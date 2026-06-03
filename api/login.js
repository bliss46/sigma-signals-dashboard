// Verifie les identifiants (POST {user, pass}) contre les variables d'env Vercel
// DASHBOARD_USER / DASHBOARD_PASS (deja posees). En cas de succes, pose le cookie
// de session signe 'sigma_auth' (HttpOnly, Secure, SameSite=Lax, 30 jours). Aucun
// mot de passe n'est stocke cote client. La cle de signature derive de DASHBOARD_PASS
// => aucune variable d'env supplementaire a creer.
import { createHmac } from 'node:crypto';

const COOKIE = 'sigma_auth';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

function token(user, pass) {
  return createHmac('sha256', pass).update('sigma|' + user).digest('hex');
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method not allowed' });
    return;
  }
  const USER = process.env.DASHBOARD_USER;
  const PASS = process.env.DASHBOARD_PASS;

  // Corps JSON (auto-parse Vercel), avec repli defensif si chaine.
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};
  const user = (body.user || '').toString();
  const pass = (body.pass || '').toString();

  // Fail-open : auth non configuree => pas de gate, on laisse passer.
  if (!USER || !PASS) { res.status(200).json({ ok: true, note: 'auth disabled' }); return; }

  if (user === USER && pass === PASS) {
    const cookie = [
      COOKIE + '=' + token(USER, PASS),
      'Path=/', 'HttpOnly', 'Secure', 'SameSite=Lax',
      'Max-Age=' + MAX_AGE,
    ].join('; ');
    res.setHeader('Set-Cookie', cookie);
    res.status(200).json({ ok: true });
    return;
  }
  res.status(401).json({ ok: false, error: 'Identifiants incorrects' });
}
