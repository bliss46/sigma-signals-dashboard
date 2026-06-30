// api/pilot-health.mjs
// Panneau "Pilote micro-listener" + tendance P&L recente du dashboard (s60).
// Lecture seule, pg direct (DATABASE_URL en env Vercel), GET, protege par le middleware (cookie auth).
// Expose : accumulation early_micro, progression des fermetures appariees vers H1 (n>=80),
// depense micro_budget vs plafonds, et P&L realise sur 7j / 14j / 30 derniers trades.
import pg from 'pg';

const H1_TARGET = 80;
const CAP_TOTAL = 100000;
const CAP_DAILY = 30000;

// 0.01 SOL / 10 000 messages payants => 1e-6 SOL / message.
const SOL_PER_MSG = 1e-6;

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

  // Bloc P&L realise sur une sous-requete (sol_out non null = ere P&L-reel propre, ~depuis 15 juin).
  const pnl = (where) =>
    `(SELECT json_build_object(
        'n',   count(*)::int,
        'win', round(100.0*avg((sol_out>sol_in)::int), 1),
        'avg', round(avg((sol_out-sol_in)/sol_in*100)::numeric, 1),
        'net', round(sum(sol_out-sol_in)::numeric, 4)
      ) FROM (${where}) z)`;

  try {
    await client.connect();
    const r = await client.query(
      `SELECT
        (SELECT count(*)::int FROM early_micro) AS em_total,
        (SELECT count(sell_ratio)::int FROM early_micro) AS em_sr,
        (SELECT round(extract(epoch FROM (now()-max(created_at)))/60)::int FROM early_micro) AS em_last_min,
        (SELECT count(*)::int FROM positions p
           WHERE p.status <> 'open' AND p.sol_out IS NOT NULL
             AND EXISTS (SELECT 1 FROM early_micro e
                         WHERE e.mint = p.mint AND e.sell_ratio IS NOT NULL)) AS paired,
        (SELECT paid_total FROM micro_budget ORDER BY id LIMIT 1) AS paid_total,
        (SELECT updated_at FROM micro_budget ORDER BY id LIMIT 1) AS budget_updated,
        ${pnl(`SELECT sol_in,sol_out FROM positions WHERE status<>'open' AND sol_out IS NOT NULL AND sol_in>0 AND closed_at > now()-interval '7 days'`)}  AS d7,
        ${pnl(`SELECT sol_in,sol_out FROM positions WHERE status<>'open' AND sol_out IS NOT NULL AND sol_in>0 AND closed_at > now()-interval '14 days'`)} AS d14,
        ${pnl(`SELECT sol_in,sol_out FROM positions WHERE status<>'open' AND sol_out IS NOT NULL AND sol_in>0 ORDER BY id DESC LIMIT 30`)}              AS last30`
    );
    const row = r.rows[0] || {};
    const paid = row.paid_total == null ? null : Number(row.paid_total);
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
      pilot: {
        em_total: row.em_total || 0,
        em_sr: row.em_sr || 0,
        last_min: row.em_last_min,
        paired: row.paired || 0,
        h1_target: H1_TARGET,
        paid_total: paid,
        cap_total: CAP_TOTAL,
        cap_daily: CAP_DAILY,
        sol_spent: paid == null ? null : +(paid * SOL_PER_MSG).toFixed(6),
        budget_updated: row.budget_updated,
      },
      pnl: { d7: row.d7, d14: row.d14, last30: row.last30 },
      generated_at: new Date().toISOString(),
    });
  } catch (e) {
    res.status(502).json({ error: 'db_unreachable', detail: String((e && e.message) || e).slice(0, 300) });
  } finally {
    try { await client.end(); } catch (_) {}
  }
}
