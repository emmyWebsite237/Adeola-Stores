/* ============================================================
   Ladydee Minimart Store — /api/auth/signup
   ------------------------------------------------------------
   POST /api/auth/signup   { fullName, email, password }

   Creates the account on the server (Neon Postgres) as UNVERIFIED and
   sends the verification link through Brevo using a PROTECTED key.
   The browser never sees DATABASE_URL or BREVO_API_KEY.

   Two things were changed from the original specification on purpose:

   1. PASSWORD HASHING. The original wrote the raw password straight into
      a column called `password_hash`. Storing plaintext passwords is a
      serious vulnerability, so this hashes with Node's built-in scrypt
      (no extra dependency) in the form  scrypt$<salt>$<hash>.

   2. TOKEN ENTROPY. The original generated the verification token with
      Math.random(), which is NOT cryptographically secure despite the
      comment saying so. This uses crypto.randomBytes(32).

   The Neon driver is imported lazily so a deployment with no
   DATABASE_URL returns a clean 503 instead of crashing at module load.
   ============================================================ */
import crypto from 'node:crypto';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const SITE = process.env.SITE_URL || 'https://www.bestpenagency.com';
const SENDER = {
  name: process.env.BREVO_SENDER_NAME || 'LadyDee Groceries',
  email: process.env.BREVO_SENDER_EMAIL || 'orders@bestpenagency.com'
};

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return 'scrypt$' + salt + '$' + hash;
}

function verificationEmail(fullName, token) {
  const link = SITE + '/api/auth/verify?token=' + encodeURIComponent(token);
  return (
    '<div style="font-family:Arial,sans-serif;padding:20px;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px">' +
      '<h2 style="color:#12241c">Welcome to LadyDee Groceries, ' + escapeHtml(fullName) + '!</h2>' +
      '<p>Thank you for creating an account with us. To complete your registration and unlock checkout, please verify your email address:</p>' +
      '<div style="margin:30px 0;text-align:center">' +
        '<a href="' + link + '" style="background-color:#0f5132;color:#fff;padding:12px 24px;text-decoration:none;font-weight:bold;border-radius:6px;display:inline-block">Verify Email Address</a>' +
      '</div>' +
      '<p style="font-size:12px;color:#666">If the button does not work, paste this link into your browser:<br>' + link + '</p>' +
    '</div>'
  );
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(503).json({
      success: false,
      configured: false,
      error: 'Server database is not configured. Set DATABASE_URL in your hosting environment.'
    });
  }

  const body = req.body || {};
  const email = String(body.email || '').toLowerCase().trim();
  const fullName = String(body.fullName || '').trim();
  const password = String(body.password || '');

  if (!email || !password || !fullName) {
    return res.status(400).json({ success: false, error: 'fullName, email and password are all required' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ success: false, error: 'That email address does not look valid' });
  }
  if (password.length < 8) {
    return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
  }

  let client;
  try {
    const { Client } = await import('@neondatabase/serverless');
    client = new Client(process.env.DATABASE_URL);
    await client.connect();

    const existing = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, error: 'Email address already registered' });
    }

    const token = crypto.randomBytes(32).toString('hex');

    await client.query(
      'INSERT INTO users (name, email, password_hash, verified, token, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [fullName, email, hashPassword(password), false, token]
    );

    /* Transactional verification email through Brevo, server-side only. */
    if (!process.env.BREVO_API_KEY) {
      return res.status(200).json({
        success: true,
        emailSent: false,
        message: 'Account created, but BREVO_API_KEY is not set so no verification email was sent.'
      });
    }

    const sent = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: email, name: fullName }],
        subject: 'Verify Your LadyDee Grocery Account',
        htmlContent: verificationEmail(fullName, token)
      })
    });

    if (!sent.ok) {
      const detail = await sent.text();
      console.error('Brevo rejected the signup email:', sent.status, detail);
      return res.status(200).json({
        success: true,
        emailSent: false,
        message: 'Account created, but the verification email could not be sent.',
        providerStatus: sent.status
      });
    }

    return res.status(200).json({ success: true, emailSent: true, message: 'Account initiated. Verification email dispatched.' });
  } catch (error) {
    console.error('Signup workflow failed:', error);
    return res.status(500).json({ success: false, error: 'Registration failed: ' + (error && error.message ? error.message : String(error)) });
  } finally {
    if (client) { try { await client.end(); } catch (e) { /* already closed */ } }
  }
}
