/* ============================================================
   Ladydee Minimart Store — accounts (server side)
   Users table, password hashing, one-time tokens, signed session tokens.
   A sign-up stays PENDING until the emailed link is clicked; a pending
   account (and its data) is deleted automatically after 60 minutes.
   ============================================================ */
import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { db, ensureSettingsTable } from './settings.js';

const scrypt = promisify(crypto.scrypt);

export const PENDING_MINUTES = 60;
export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

let usersReady = false;
export async function ensureUsersTable() {
  if (usersReady) return;
  await db.query('CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, verified BOOLEAN NOT NULL DEFAULT FALSE, token TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');
  await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT');
  await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ');
  await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token TEXT');
  await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_expires_at TIMESTAMPTZ');
  usersReady = true;
}

/* Deletes every sign-up that was never confirmed within its hour.
   Also catches rows from the older schema that have no expiry stored. */
export async function purgeExpiredPending() {
  const r = await db.query(
    "DELETE FROM users WHERE verified = FALSE AND COALESCE(token_expires_at, created_at + INTERVAL '" + PENDING_MINUTES + " minutes') < NOW()"
  );
  return r.rowCount || 0;
}

/* ---------- passwords: scrypt$<salt>$<hash> ---------- */
export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = (await scrypt(password, salt, 64)).toString('hex');
  return 'scrypt$' + salt + '$' + hash;
}

export async function verifyPassword(password, stored) {
  const parts = String(stored || '').split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const expected = Buffer.from(parts[2], 'hex');
  const got = await scrypt(password, parts[1], expected.length);
  return got.length === expected.length && crypto.timingSafeEqual(got, expected);
}

/* ---------- one-time tokens: the database only ever holds a hash ---------- */
export function newToken() { return crypto.randomBytes(32).toString('hex'); }
export function hashToken(t) { return crypto.createHash('sha256').update(String(t)).digest('hex'); }

/* ---------- signed login tokens ---------- */
let secretCache = null;
async function authSecret() {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  if (secretCache) return secretCache;
  await ensureSettingsTable();
  let r = await db.query("SELECT value FROM settings WHERE key = 'auth_secret'");
  if (!r.rows.length) {
    await db.query("INSERT INTO settings (key, value) VALUES ('auth_secret', $1) ON CONFLICT (key) DO NOTHING", [crypto.randomBytes(32).toString('hex')]);
    r = await db.query("SELECT value FROM settings WHERE key = 'auth_secret'");
  }
  secretCache = r.rows[0].value;
  return secretCache;
}

export async function makeSessionToken(user, days) {
  const payload = Buffer.from(JSON.stringify({ uid: user.id, exp: Date.now() + (days || 30) * 86400000 })).toString('base64url');
  const sig = crypto.createHmac('sha256', await authSecret()).update(payload).digest('base64url');
  return payload + '.' + sig;
}

/* Returns the payload ({uid, exp}) or null. */
export async function verifySessionToken(token) {
  const parts = String(token || '').split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  const expected = crypto.createHmac('sha256', await authSecret()).update(parts[0]).digest();
  let got;
  try { got = Buffer.from(parts[1], 'base64url'); } catch (e) { return null; }
  if (got.length !== expected.length || !crypto.timingSafeEqual(got, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    return payload.exp > Date.now() ? payload : null;
  } catch (e) { return null; }
}

export function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone || '' };
}
