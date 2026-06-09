// api/autobuy-data.mjs
// Lecture seule pour l'onglet "Auto-achat" du dashboard.
// Se connecte directement au Postgres (DATABASE_URL publique en env Vercel, jamais dans le bundle).
// Protege par le middleware (cookie auth) comme le reste du site. GET seulement.
import pg from 'pg';

const AUTOBUY_LOG_DDL = `CREATE TABLE IF NOT EXISTS autobuy_log (
  id serial PRIMARY KEY,
  mint text NOT NULL,
  symbol text,
  source text,
  decision text NOT NULL,
  reason text,
  h24 numeric,
  liq_usd numeric,
  age_min numeric,
  sol_in numeric,
  tx text,
  position_id integer,
  created_at timestamptz DEFAULT now()
)`;

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
    await client.query(AUTOBUY_LOG_DDL); // idempotent : cree la table si le bot ne l'a jamais fait

    const log = await client.query(
      `SELECT id, created_at, mint, symbol, source, decision, reason, h24, liq_usd, age_min, sol_in, tx, position_id
         FROM autobuy_log ORDER BY created_at DESC LIMIT 200`
    );

    const positions = await client.query(
      `SELECT id, mint, symbol, status, sol_in, entry_mcap, peak_mcap, exit_mcap, exit_reason,
              buy_tx, sell_tx, tp_pct, sl_pct, partial_done, closed_at
         FROM positions ORDER BY id DESC LIMIT 200`
    );

    // bot_settings est optionnel (phase 2) : best-effort, pas d'erreur si absent.
    let settings = null;
    try {
      const s = await client.query(`SELECT key, value FROM bot_settings`);
      settings = Object.fromEntries(s.rows.map((r) => [r.key, r.value]));
    } catch (_) { settings = null; }

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ log: log.rows, positions: positions.rows, settings });
  } catch (e) {
    res.status(502).json({ error: 'db_unreachable', detail: String((e && e.message) || e).slice(0, 300) });
  } finally {
    try { await client.end(); } catch (_) {}
  }
}
