// api/peak-data.mjs
// Métrique vivante "taux de pic" pour le dashboard (prio 3, s32).
// Source de vérité = pending_checks.peak_pct (shadow-tracker via G1, sans biais de survie, #217).
// Agrège le taux d'atteinte de pic (>=+20/50/100 %) + pic médian, PAR source et PAR bande Δ24h.
// Se connecte directement au Postgres (DATABASE_URL publique en env Vercel, jamais dans le bundle),
// comme api/autobuy-data.mjs. Protégé par le middleware (cookie auth). GET seulement.
//
// Fenêtre : tout l'historique par défaut. ?days=N (entier > 0) restreint aux N derniers jours
// (vue "glissante" sans redéploiement).
import pg from 'pg';

// pending_checks.source est désormais rempli (forward #218 + backfill s32) -> lu en direct,
// COALESCE pour les rares lignes sans signal correspondant. signals n'est joint que pour change_24h.
const SQL = `
WITH sig AS (
  SELECT DISTINCT ON (lower(address)) lower(address) AS addr, change_24h
  FROM   signals
  WHERE  change_24h IS NOT NULL
  ORDER  BY lower(address), id ASC          -- 1er détecteur (Δ24h à la détection)
),
base AS (
  SELECT pc.peak_pct::numeric                         AS pk,
         COALESCE(NULLIF(pc.source, ''), '?')          AS src,
         s.change_24h::numeric                         AS c24
  FROM   pending_checks pc
  LEFT   JOIN sig s ON s.addr = lower(pc.address)
  WHERE  pc.peak_pct IS NOT NULL
    AND  ($1::int IS NULL OR pc.signal_at > now() - ($1 || ' days')::interval)
),
src_agg AS (
  SELECT 'source' AS dim, src AS bucket, count(*)::int AS n,
         round(100.0 * count(*) FILTER (WHERE pk >= 20)  / count(*))::int AS ge20,
         round(100.0 * count(*) FILTER (WHERE pk >= 50)  / count(*))::int AS ge50,
         round(100.0 * count(*) FILTER (WHERE pk >= 100) / count(*))::int AS ge100,
         round(percentile_cont(0.5) WITHIN GROUP (ORDER BY pk))::int       AS med
  FROM base GROUP BY src
),
band_agg AS (
  SELECT 'band' AS dim,
         CASE WHEN c24 IS NULL    THEN '?'
              WHEN c24 < 0        THEN '<0'
              WHEN c24 < 100      THEN '0-100'
              WHEN c24 < 300      THEN '100-300'
              WHEN c24 < 1000     THEN '300-1000'
              ELSE '>1000' END AS bucket,
         count(*)::int AS n,
         round(100.0 * count(*) FILTER (WHERE pk >= 20)  / count(*))::int AS ge20,
         round(100.0 * count(*) FILTER (WHERE pk >= 50)  / count(*))::int AS ge50,
         round(100.0 * count(*) FILTER (WHERE pk >= 100) / count(*))::int AS ge100,
         round(percentile_cont(0.5) WITHIN GROUP (ORDER BY pk))::int       AS med
  FROM base GROUP BY 2
)
SELECT * FROM src_agg
UNION ALL
SELECT * FROM band_agg
ORDER BY dim, n DESC;`;

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'method not allowed' }); return; }
  const url = process.env.DATABASE_URL;
  if (!url) { res.status(503).json({ error: 'DATABASE_URL non configuree (env Vercel)' }); return; }

  // ?days=N optionnel (entier > 0) -> fenetre glissante ; sinon null = tout l'historique.
  let days = null;
  const raw = (req.query && req.query.days) || null;
  if (raw != null && raw !== '') {
    const n = parseInt(Array.isArray(raw) ? raw[0] : raw, 10);
    if (Number.isFinite(n) && n > 0) days = n;
  }

  const client = new pg.Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
    query_timeout: 8000,
    statement_timeout: 8000,
  });

  try {
    await client.connect();
    const r = await client.query(SQL, [days]);
    const bySource = {}, byBand = {};
    let total = 0;
    for (const row of r.rows) {
      const cell = { n: row.n, ge20: row.ge20, ge50: row.ge50, ge100: row.ge100, med: row.med };
      if (row.dim === 'source') { bySource[row.bucket] = cell; total += row.n; }
      else if (row.dim === 'band') { byBand[row.bucket] = cell; }
    }
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ bySource, byBand, total, days, generated_at: new Date().toISOString() });
  } catch (e) {
    res.status(502).json({ error: 'db_unreachable', detail: String((e && e.message) || e).slice(0, 300) });
  } finally {
    try { await client.end(); } catch (_) {}
  }
}
