// Vercel Edge Middleware — Basic Auth pour le dashboard Sigma Signals.
// FAIL-OPEN : tant que DASHBOARD_USER / DASHBOARD_PASS ne sont pas definis dans
// les variables d'environnement Vercel, AUCUN blocage (le site reste accessible
// exactement comme avant). Le mot de passe est saisi par l'utilisateur dans
// Vercel, jamais code en dur ici. Une fois les 2 variables posees, tout l'acces
// (page + endpoints /api/*) passe derriere l'authentification.
export const config = {
  // Protege tout sauf les assets internes Vercel.
  matcher: ['/((?!_next/|_vercel/|favicon\\.ico).*)'],
};

export default function middleware(request) {
  try {
    const USER = process.env.DASHBOARD_USER;
    const PASS = process.env.DASHBOARD_PASS;
    if (!USER || !PASS) return; // non configure => pas de gate (fail-open)
    const header = request.headers.get('authorization') || '';
    if (header.startsWith('Basic ')) {
      const decoded = atob(header.slice(6));
      const sep = decoded.indexOf(':');
      const u = decoded.slice(0, sep);
      const p = decoded.slice(sep + 1);
      if (u === USER && p === PASS) return; // authentifie
    }
    return new Response('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Sigma Signals", charset="UTF-8"',
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (e) {
    return; // erreur inattendue => ne jamais bloquer le site (fail-open)
  }
}
