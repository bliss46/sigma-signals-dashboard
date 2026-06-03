// Efface le cookie de session puis renvoie vers la page de login.
const COOKIE = 'sigma_auth';

export default function handler(req, res) {
  res.setHeader(
    'Set-Cookie',
    COOKIE + '=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
  );
  res.statusCode = 302;
  res.setHeader('Location', '/login.html');
  res.end();
}
