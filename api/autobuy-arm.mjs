// api/autobuy-arm.mjs
// Armement / arret de l'auto-achat reel (phase 2, s32). Pilote bot_settings que le bot relit
// a chaque cycle. Asymetrie volontaire : ARMER exige le PIN (process.env.AUTOBUY_PIN, verifie
// cote serveur, jamais expose) ; STOP ne demande rien (1 clic, repasse en dry_run -> observe).
// pg direct (DATABASE_URL en env Vercel), comme api/autobuy-data.mjs. Protege par le middleware
// (cookie auth). POST seulement. NE realise aucun achat : ne fait que basculer des drapeaux DB.
import pg from 'pg';

function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body) { try { return JSON.parse(req.body); } catch { return {}; } }
  return {};
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'method not allowed' }); return; }
  const url = process.env.DATABASE_URL;
  if (!url) { res.status(503).json({ error: 'DATABASE_URL non configuree (env Vercel)' }); return; }

  const { action, pin } = parseBody(req);
  if (action !== 'arm' && action !== 'stop') { res.status(400).json({ error: "action invalide (arm|stop)" }); return; }

  // ARMER (achats reels) -> exige le PIN serveur. Dur a faire par design.
  if (action === 'arm') {
    const expected = process.env.AUTOBUY_PIN;
    if (!expected) { res.status(503).json({ error: 'AUTOBUY_PIN non configure (env Vercel) — armement impossible' }); return; }
    if (!pin || String(pin) !== String(expected)) { res.status(401).json({ error: 'PIN invalide' }); return; }
  }

  const client = new pg.Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
    query_timeout: 8000,
    statement_timeout: 8000,
  });

  const upsert = (key, value) => client.query(
    `INSERT INTO bot_settings (key, value, updated_at) VALUES ($1, $2, now())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
    [key, value]
  );

  try {
    await client.connect();
    await client.query(`CREATE TABLE IF NOT EXISTS bot_settings (
      key text PRIMARY KEY, value text, updated_at timestamptz DEFAULT now()
    )`);

    if (action === 'arm') {
      // Dur a armer : enabled=true ET dry_run=false (achats reels au prochain cycle du bot).
      await upsert('autobuy_enabled', 'true');
      await upsert('autobuy_dry_run', 'false');
      await upsert('autobuy_armed_at', new Date().toISOString());
    } else {
      // Facile a stopper : repasse en observe (dry_run=true). Le bot continue de logguer, ne depense plus.
      await upsert('autobuy_dry_run', 'true');
      await upsert('autobuy_stopped_at', new Date().toISOString());
    }

    const { rows } = await client.query(`SELECT key, value FROM bot_settings`);
    const s = {}; for (const r of rows) s[r.key] = r.value;
    const armed = s.autobuy_enabled === 'true' && s.autobuy_dry_run === 'false';

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
      ok: true, action, armed,
      enabled: s.autobuy_enabled ?? null,
      dry_run: s.autobuy_dry_run ?? null,
      armed_at: s.autobuy_armed_at ?? null,
    });
  } catch (e) {
    res.status(502).json({ error: 'db_unreachable', detail: String((e && e.message) || e).slice(0, 300) });
  } finally {
    try { await client.end(); } catch (_) {}
  }
}
