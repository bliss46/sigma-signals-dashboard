// Proxy serverless : le navigateur appelle /api/n8n?hook=NAME (meme origine, donc
// derriere la Basic Auth du middleware). Le serveur ajoute l'en-tete secret
// X-Webhook-Secret (jamais expose au client / au bundle) et relaie vers le webhook
// n8n correspondant. L'allowlist empeche tout usage en proxy ouvert (SSRF).
// Tant que WEBHOOK_SECRET n'est pas defini, le proxy relaie sans en-tete (no-op) :
// le dashboard fonctionne a l'identique avant l'activation cote n8n.
const N8N_BASE = 'https://n8n-production-05f0.up.railway.app/webhook/';
const ALLOW = {
  'signals-data': 'GET',
  'positions-data': 'GET',
  'g1-data': 'GET',
  'prelaunch-data': 'GET',
};

export default async function handler(req, res) {
  const hook = req.query && req.query.hook ? String(req.query.hook) : '';
  const method = ALLOW[hook];
  if (!method) { res.status(404).json({ error: 'unknown hook' }); return; }
  if (req.method !== method) { res.status(405).json({ error: 'method not allowed' }); return; }
  const headers = { Accept: 'application/json' };
  const secret = process.env.WEBHOOK_SECRET;
  if (secret) headers['X-Webhook-Secret'] = secret;
  try {
    const upstream = await fetch(N8N_BASE + hook, { method, headers });
    const body = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.send(body);
  } catch (e) {
    res.status(502).json({ error: 'upstream_unreachable', detail: String((e && e.message) || e) });
  }
}
