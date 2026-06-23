// api/haiku-health.mjs
// Bandeau "sante scoring Haiku" du dashboard (#213, s34).
// Detecte une coupure de credits Anthropic via le fallback note=null (#233) : si des signaux
// D1/C1/M1 recents existent mais sont TOUS note_claude NULL, le scoring Haiku est tombe.
// pg direct (DATABASE_URL en env Vercel), GET seulement, protege par le middleware (cookie auth).
import pg from 'pg';

const SOURCES = ['D1', 'C1', 'M1'];

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.status(405).json({ error: 'method not allowed' }); return; }
  const url = process.env.DATABASE_URL;
  if (!url) { res.status(503).json({ error: 'DATABASE_URL non configuree (env Vercel)' }); return; }

  const client = new pg.Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
    query_timeout: 8000,
    statement_timeout: 8000,
  });

  try {
    await client.connect();
    const r = await client.query(
      `SELECT
         (SELECT count(*)::int FROM signals
            WHERE "timestamp" > now() - interval '30 minutes' AND source = ANY($1)) AS recent,
         (SELECT count(*)::int FROM signals
            WHERE "timestamp" > now() - interval '30 minutes' AND source = ANY($1) AND note_claude IS NOT NULL) AS scored,
         (SELECT round(extract(epoch FROM (now() - max("timestamp")))/60)::int FROM signals
            WHERE source = ANY($1)) AS last_min`,
      [SOURCES]
    );
    const row = r.rows[0] || {};
    const recent = row.recent || 0;
    const scored = recent;
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
      recent,
      scored,
      null_scored: recent - scored,
      last_min: row.last_min,
      generated_at: new Date().toISOString(),
    });
  } catch (e) {
    res.status(502).json({ error: 'db_unreachable', detail: String((e && e.message) || e).slice(0, 300) });
  } finally {
    try { await client.end(); } catch (_) {}
  }
}
