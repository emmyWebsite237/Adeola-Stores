/* ============================================================
   Ladydee Minimart Store — /api/auth/verify
   ------------------------------------------------------------
   GET /api/auth/verify?token=…

   Handles the click from the verification email: checks the token in
   Neon Postgres, flips the user to verified, clears the token and sends
   the browser back to the sign-in page.

   Errors render a small friendly page rather than a raw stack trace.
   ============================================================ */
function page(title, message) {
  return (
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + title + ' — LadyDee Groceries</title>' +
    '<style>body{font-family:Arial,Helvetica,sans-serif;background:#f4f6f3;color:#12241c;margin:0;padding:48px 20px}' +
    '.card{max-width:520px;margin:0 auto;background:#fff;border:1px solid #e2e8e2;border-radius:14px;padding:32px;text-align:center}' +
    'h1{font-size:22px;margin:0 0 10px}p{color:#4a5a52;line-height:1.6;margin:0 0 20px}' +
    'a.btn{display:inline-block;background:#0f5132;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:700}</style>' +
    '</head><body><div class="card"><h1>' + title + '</h1><p>' + message + '</p>' +
    '<a class="btn" href="/login.html">Go to sign in</a></div></body></html>'
  );
}

export default async function handler(req, res) {
  const token = req.query && req.query.token;

  if (!token) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(400).send(page('Verification failed', 'The verification link is missing its token.'));
  }

  if (!process.env.DATABASE_URL) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(503).send(page('Server not configured', 'This deployment has no DATABASE_URL set, so the account cannot be verified here.'));
  }

  let client;
  try {
    const { Client } = await import('@neondatabase/serverless');
    client = new Client(process.env.DATABASE_URL);
    await client.connect();

    const found = await client.query('SELECT id FROM users WHERE token = $1', [token]);
    if (found.rows.length === 0) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(400).send(page('Invalid or expired link', 'That token does not match an account, or it has already been used.'));
    }

    await client.query('UPDATE users SET verified = true, token = NULL WHERE id = $1', [found.rows[0].id]);

    res.writeHead(302, { Location: '/login.html?verified=true' });
    return res.end();
  } catch (error) {
    console.error('Verification callback failed:', error);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(500).send(page('Something went wrong', 'We could not validate your email just now. Please try the link again.'));
  } finally {
    if (client) { try { await client.end(); } catch (e) { /* already closed */ } }
  }
}
