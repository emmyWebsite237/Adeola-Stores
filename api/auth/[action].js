/* ============================================================
   Ladydee Minimart Store — /api/auth/<action>
   One function that handles every account action:

     POST signup           { fullName, email, phone?, password }
     GET  verify?token=…   (the link in the confirmation email)
     POST login            { email, password }
     POST resend           { email }            (new confirmation link)
     POST forgot           { email }            (password reset link)
     POST reset            { token, password }
     POST change-password  { currentPassword, newPassword }   (Bearer token)
     GET  me                                                  (Bearer token)
     GET  purge            (deletes expired pending sign-ups)

   Rules: a new account is PENDING and cannot sign in until the emailed
   link is clicked. The link works for 60 minutes. A pending account that
   is not confirmed in time is deleted, so the person can start fresh.
   ============================================================ */
import { db, getSettings, rateLimited, clientIp } from '../../lib/settings.js';
import { sendBrevo } from '../../lib/brevo.js';
import {
  EMAIL_RE, PENDING_MINUTES, ensureUsersTable, purgeExpiredPending, hashPassword, verifyPassword,
  newToken, hashToken, makeSessionToken, verifySessionToken, publicUser
} from '../../lib/users.js';
import { verificationEmail, resetEmail, siteOrigin } from '../../lib/mail.js';

const INTERVAL = "NOW() + INTERVAL '" + PENDING_MINUTES + " minutes'";

function emailReady(s) { return !!(s.brevo_api_key && s.brevo_sender_email); }
function storeName(s) { return s.brevo_sender_name || 'Ladydee Minimart Store'; }
function lower(v) { return String(v || '').toLowerCase().trim(); }

async function signup(req, res) {
  const b = req.body || {};
  const name = String(b.fullName || b.name || '').trim().slice(0, 100);
  const email = lower(b.email);
  const phone = String(b.phone || '').trim().slice(0, 30);
  const password = String(b.password || '');

  if (!name || !email || !password) return res.status(400).json({ success: false, error: 'Name, email and password are all required.' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ success: false, error: 'That email address does not look valid.' });
  if (password.length < 8) return res.status(400).json({ success: false, error: 'Password must be at least 8 characters.' });
  if (rateLimited('signup', clientIp(req), 6, 60000)) return res.status(429).json({ success: false, error: 'Too many attempts. Please wait a minute.' });

  const s = await getSettings();
  if (!emailReady(s)) {
    return res.status(503).json({ success: false, configured: false, error: 'Sign-up is unavailable right now because email is not set up yet.' });
  }

  const existing = (await db.query('SELECT id, verified FROM users WHERE email = $1', [email])).rows[0];
  if (existing && existing.verified) {
    return res.status(409).json({ success: false, code: 'exists', error: 'An account with that email already exists. Please sign in.' });
  }

  const token = newToken();
  const hash = await hashPassword(password);
  let id;
  if (existing) {
    /* A pending sign-up that is still inside its hour: refresh it with the new details and a new link. */
    await db.query('UPDATE users SET name = $1, phone = $2, password_hash = $3, token = $4, token_expires_at = ' + INTERVAL + ' WHERE id = $5',
      [name, phone, hash, hashToken(token), existing.id]);
    id = existing.id;
  } else {
    const ins = await db.query(
      'INSERT INTO users (name, email, phone, password_hash, token, token_expires_at) VALUES ($1, $2, $3, $4, $5, ' + INTERVAL + ') RETURNING id',
      [name, email, phone, hash, hashToken(token)]);
    id = ins.rows[0].id;
  }

  const link = siteOrigin(req, s) + '/api/auth/verify?token=' + token;
  const sent = await sendBrevo(s, {
    to: email, toName: name, subject: 'Confirm your email - ' + storeName(s),
    html: verificationEmail({ name: name, link: link, store: storeName(s), minutes: PENDING_MINUTES })
  });
  if (!sent.ok) {
    console.error('Confirmation email failed:', sent.code, sent.status, sent.detail || sent.error);
    if (!existing) await db.query('DELETE FROM users WHERE id = $1', [id]);
    return res.status(502).json({ success: false, error: 'We could not send the confirmation email. Please try again in a moment.' });
  }
  return res.status(200).json({ success: true, email: email, expiresInMinutes: PENDING_MINUTES });
}

async function verify(req, res) {
  const token = String((req.query && req.query.token) || '');
  let ok = false;
  if (token) {
    const r = await db.query(
      'UPDATE users SET verified = TRUE, token = NULL, token_expires_at = NULL WHERE token = $1 AND verified = FALSE AND token_expires_at > NOW() RETURNING id',
      [hashToken(token)]);
    ok = r.rows.length > 0;
  }
  res.setHeader('Location', ok ? '/login?verified=1' : '/login?verify=expired');
  return res.status(302).end();
}

async function login(req, res) {
  const b = req.body || {};
  const email = lower(b.email);
  const password = String(b.password || '');
  if (!email || !password) return res.status(400).json({ success: false, error: 'Enter your email and password.' });
  if (rateLimited('login', clientIp(req) + ':' + email, 10, 60000)) return res.status(429).json({ success: false, error: 'Too many attempts. Please wait a minute.' });

  const u = (await db.query('SELECT id, name, email, phone, password_hash, verified FROM users WHERE email = $1', [email])).rows[0];
  const good = u ? await verifyPassword(password, u.password_hash) : (await hashPassword(password), false);
  if (!good) return res.status(401).json({ success: false, error: 'Email or password is incorrect. If you signed up more than an hour ago without confirming, please sign up again.' });
  if (!u.verified) {
    return res.status(403).json({ success: false, code: 'unverified', error: 'Please confirm your email first. Open the link we sent you (check spam too).' });
  }
  return res.status(200).json({ success: true, token: await makeSessionToken(u), user: publicUser(u) });
}

async function resend(req, res) {
  const email = lower((req.body || {}).email);
  if (!EMAIL_RE.test(email)) return res.status(400).json({ success: false, error: 'Enter a valid email address.' });
  if (rateLimited('resend', clientIp(req) + ':' + email, 3, 600000)) return res.status(429).json({ success: false, error: 'Too many requests. Please wait a few minutes.' });

  const s = await getSettings();
  if (!emailReady(s)) return res.status(503).json({ success: false, configured: false, error: 'Email is not set up yet.' });

  const u = (await db.query('SELECT id, name FROM users WHERE email = $1 AND verified = FALSE', [email])).rows[0];
  if (!u) {
    return res.status(404).json({ success: false, code: 'not_found', error: 'That sign-up has expired or was already confirmed. Please sign up again, or sign in if you already confirmed.' });
  }
  const token = newToken();
  await db.query('UPDATE users SET token = $1, token_expires_at = ' + INTERVAL + ' WHERE id = $2', [hashToken(token), u.id]);
  const sent = await sendBrevo(s, {
    to: email, toName: u.name, subject: 'Confirm your email - ' + storeName(s),
    html: verificationEmail({ name: u.name, link: siteOrigin(req, s) + '/api/auth/verify?token=' + token, store: storeName(s), minutes: PENDING_MINUTES })
  });
  if (!sent.ok) return res.status(502).json({ success: false, error: 'We could not send the email. Please try again in a moment.' });
  return res.status(200).json({ success: true, expiresInMinutes: PENDING_MINUTES });
}

async function forgot(req, res) {
  const email = lower((req.body || {}).email);
  if (!EMAIL_RE.test(email)) return res.status(400).json({ success: false, error: 'Enter a valid email address.' });
  if (rateLimited('forgot', clientIp(req) + ':' + email, 3, 600000)) return res.status(429).json({ success: false, error: 'Too many requests. Please wait a few minutes.' });

  const s = await getSettings();
  if (!emailReady(s)) return res.status(503).json({ success: false, configured: false, error: 'Email is not set up yet.' });

  const u = (await db.query('SELECT id, name FROM users WHERE email = $1 AND verified = TRUE', [email])).rows[0];
  if (u) {
    const token = newToken();
    await db.query('UPDATE users SET reset_token = $1, reset_expires_at = ' + INTERVAL + ' WHERE id = $2', [hashToken(token), u.id]);
    const sent = await sendBrevo(s, {
      to: email, toName: u.name, subject: 'Reset your password - ' + storeName(s),
      html: resetEmail({ link: siteOrigin(req, s) + '/forgot?token=' + token, store: storeName(s), minutes: PENDING_MINUTES })
    });
    if (!sent.ok) console.error('Reset email failed:', sent.code, sent.status, sent.detail || sent.error);
  }
  /* Same answer whether or not the account exists, so emails cannot be probed. */
  return res.status(200).json({ success: true });
}

async function reset(req, res) {
  const b = req.body || {};
  const token = String(b.token || '');
  const password = String(b.password || '');
  if (password.length < 8) return res.status(400).json({ success: false, error: 'Password must be at least 8 characters.' });
  if (!token) return res.status(400).json({ success: false, code: 'expired', error: 'That reset link is not valid.' });
  const r = await db.query(
    'UPDATE users SET password_hash = $1, reset_token = NULL, reset_expires_at = NULL WHERE reset_token = $2 AND reset_expires_at > NOW() AND verified = TRUE RETURNING id',
    [await hashPassword(password), hashToken(token)]);
  if (!r.rows.length) return res.status(400).json({ success: false, code: 'expired', error: 'That reset link has expired or was already used. Please request a new one.' });
  return res.status(200).json({ success: true });
}

async function currentUserRow(req) {
  const h = (req.headers && req.headers.authorization) || '';
  const payload = await verifySessionToken(h.indexOf('Bearer ') === 0 ? h.slice(7) : '');
  if (!payload) return null;
  return (await db.query('SELECT id, name, email, phone, password_hash FROM users WHERE id = $1 AND verified = TRUE', [payload.uid])).rows[0] || null;
}

async function me(req, res) {
  const u = await currentUserRow(req);
  if (!u) return res.status(401).json({ success: false, error: 'Not signed in' });
  return res.status(200).json({ success: true, user: publicUser(u) });
}

async function changePassword(req, res) {
  const u = await currentUserRow(req);
  if (!u) return res.status(401).json({ success: false, error: 'Please sign in again.' });
  const b = req.body || {};
  const next = String(b.newPassword || '');
  if (next.length < 8) return res.status(400).json({ success: false, error: 'New password must be at least 8 characters.' });
  if (!(await verifyPassword(String(b.currentPassword || ''), u.password_hash))) {
    return res.status(400).json({ success: false, error: 'Current password is not correct.' });
  }
  await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [await hashPassword(next), u.id]);
  return res.status(200).json({ success: true });
}

const ACTIONS = {
  signup: { post: signup }, login: { post: login }, resend: { post: resend }, forgot: { post: forgot },
  reset: { post: reset }, 'change-password': { post: changePassword },
  verify: { get: verify }, me: { get: me }
};

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const action = String((req.query && req.query.action) || '').toLowerCase();

  if (!process.env.DATABASE_URL) {
    if (action === 'verify') { res.setHeader('Location', '/login?verify=unavailable'); return res.status(302).end(); }
    return res.status(503).json({ success: false, configured: false, error: 'The account database is not connected yet.' });
  }

  try {
    await ensureUsersTable();
    const removed = await purgeExpiredPending();

    if (action === 'purge') return res.status(200).json({ success: true, removed: removed });

    const entry = ACTIONS[action];
    if (!entry) return res.status(404).json({ success: false, error: 'Unknown action' });
    const fn = entry[String(req.method || '').toLowerCase()];
    if (!fn) return res.status(405).json({ success: false, error: 'Method not allowed' });
    return await fn(req, res);
  } catch (e) {
    console.error('Auth ' + action + ' failed:', e && e.message ? e.message : e);
    return res.status(500).json({ success: false, error: 'Something went wrong. Please try again.' });
  }
}
