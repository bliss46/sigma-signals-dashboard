// Vercel Edge Middleware — Auth par COOKIE de session pour le dashboard Sigma Signals.
// Remplace le Basic Auth (popup natif du navigateur) par une page de login custom
// (/login.html) + un cookie signe. Ce changement permet une vraie page d'accueil ET
// un bouton Deconnexion — tous deux impossibles avec le Basic Auth.
//
// FAIL-OPEN : tant que DASHBOARD_USER / DASHBOARD_PASS ne sont pas definis dans les
// variables d'environnement Vercel, AUCUN blocage (le site reste accessible comme
// avant). Le mot de passe est saisi par l'utilisateur dans Vercel, jamais code ici.
//
// Cookie 'sigma_auth' = HMAC-SHA256(cle = DASHBOARD_PASS, message = 'sigma|' + USER)
// en hex. Sa validite prouve la connaissance des identifiants ; changer le mot de
// passe invalide automatiquement toutes les sessions (la cle HMAC change).
export const config = {
  // Protege tout sauf les assets internes Vercel.
  matcher: ['/((?!_next/|_vercel/|favicon\\.ico).*)'],
};

const COOKIE = 'sigma_auth';

// Chemins toujours libres (sinon impossible de se connecter / charger le logo).
function isPublicPath(p) {
  return (
    p === '/login.html' ||
    p === '/api/login' ||
    p === '/api/logout' ||
    p === '/Logo_Sigma_Signals.png'
  );
}

function getCookie(request, name) {
  const raw = request.headers.get('cookie') || '';
  const parts = raw.split(/; */);
  for (let i = 0; i < parts.length; i++) {
    const eq = parts[i].indexOf('=');
    if (eq > -1 && parts[i].slice(0, eq) === name) return parts[i].slice(eq + 1);
  }
  return '';
}

async function expectedToken(user, pass) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(pass), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode('sigma|' + user));
  const bytes = new Uint8Array(sig);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) hex += bytes[i].toString(16).padStart(2, '0');
  return hex;
}

export default async function middleware(request) {
  try {
    const USER = process.env.DASHBOARD_USER;
    const PASS = process.env.DASHBOARD_PASS;
    if (!USER || !PASS) return; // non configure => pas de gate (fail-open)

    const { pathname } = new URL(request.url);
    if (isPublicPath(pathname)) return; // login / logout / logo : libres

    const token = getCookie(request, COOKIE);
    if (token) {
      const expected = await expectedToken(USER, PASS);
      if (token === expected) return; // cookie valide => authentifie
    }

    // Pas (ou plus) authentifie.
    if (pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return Response.redirect(new URL('/login.html', request.url), 302);
  } catch (e) {
    return; // erreur inattendue => ne jamais bloquer le site (fail-open)
  }
}
