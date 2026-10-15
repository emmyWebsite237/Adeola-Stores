/* ============================================================
   Ladydee Minimart Store — server-side settings store
   ------------------------------------------------------------
   One place for every key the store needs (Brevo, Cloudinary, OpenAI,
   Paystack, site URL). Values are entered once in Admin → Integrations,
   saved in the Neon `settings` table, and read here by the API routes.
   A server environment variable with the same job is used as a fallback.

   This file lives in /lib (not /api) so it is not deployed as a route.
   ============================================================ */
import crypto from 'node:crypto';

export const FIELDS = {
  brevo_api_key:            { env: 'BREVO_API_KEY', secret: true },
  brevo_sender_email:       { env: 'BREVO_SENDER_EMAIL' },
  brevo_sender_name:        { env: 'BREVO_SENDER_NAME' },
  brevo_reply_to:           { env: 'BREVO_REPLY_TO' },
  cloudinary_cloud_name:    { env: 'CLOUDINARY_CLOUD_NAME' },
  cloudinary_upload_preset: { env: 'CLOUDINARY_UPLOAD_PRESET' },
  openai_api_key:           { env: 'OPENAI_API_KEY', secret: true },
  openai_model:             { env: 'OPENAI_MODEL' },
  paystack_public_key:      { env: 'PAYSTACK_PUBLIC_KEY' },
  paystack_secret_key:      { env: 'PAYSTACK_SECRET_KEY', secret: true },
  site_url:                 { env: 'SITE_URL' }
};

/* Database access is behind this object so it can be swapped in tests. */
export const db = {
  async query(sql, params) {
    const { Client } = await import('@neondatabase/serverless');
    const client = new Client(process.env.DATABASE_URL);
    await client.connect();
    try {
      return await client.query(sql, params || []);
    } finally {
      try { await client.end(); } catch (e) { /* already closed */ }
    }
  }
};

let tableReady = false;
export async function ensureSettingsTable() {
  if (tableReady) return;
  await db.query("CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL DEFAULT '', updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())");
  tableReady = true;
}

async function readStored() {
  if (!process.env.DATABASE_URL) return {};
  try {
    await ensureSettingsTable();
    const r = await db.query('SELECT key, value FROM settings');
    const out = {};
    r.rows.forEach(function (row) { out[row.key] = row.value; });
    return out;
  } catch (e) {
    console.error('Reading settings failed:', e && e.message ? e.message : e);
    return {};
  }
}

let cache = null;
const TTL = 30000;

/* { values: {key: effective value}, source: {key: 'admin' | 'env' | ''} } */
export async function getSettingsDetailed(fresh) {
  if (!fresh && cache && Date.now() - cache.at < TTL) return cache.data;
  const stored = await readStored();
  const values = {}, source = {};
  Object.keys(FIELDS).forEach(function (k) {
    const fromDb = String(stored[k] || '').trim();
    const fromEnv = String(process.env[FIELDS[k].env] || '').trim();
    values[k] = fromDb || fromEnv;
    source[k] = fromDb ? 'admin' : fromEnv ? 'env' : '';
  });
  const data = { values: values, source: source };
  cache = { at: Date.now(), data: data };
  return data;
}

export async function getSettings(fresh) {
  return (await getSettingsDetailed(fresh)).values;
}

/* values: {key: string}. Secret fields: empty = keep what is saved.
   Other fields: empty = remove the saved value (falls back to the env var).
   clear: keys to delete (used to remove a saved secret). */
export async function saveSettings(values, clear) {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set, so settings cannot be saved yet.');
  await ensureSettingsTable();
  const entries = Object.keys(values || {});
  for (let i = 0; i < entries.length; i++) {
    const k = entries[i];
    if (!FIELDS[k]) continue;
    const v = String(values[k] == null ? '' : values[k]).trim();
    if (v.length > 2000) throw new Error('That value is too long: ' + k);
    if (!v) {
      if (!FIELDS[k].secret) await db.query('DELETE FROM settings WHERE key = $1', [k]);
      continue;
    }
    await db.query(
      'INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()',
      [k, v]
    );
  }
  const drop = clear || [];
  for (let j = 0; j < drop.length; j++) {
    if (FIELDS[drop[j]]) await db.query('DELETE FROM settings WHERE key = $1', [drop[j]]);
  }
  cache = null;
}

export function maskSecret(v) {
  if (!v) return '';
  return v.length >= 8 ? '\u2022\u2022\u2022\u2022' + v.slice(-4) : '\u2022\u2022\u2022\u2022';
}

/* ---------- admin sign-in (stateless signed token) ---------- */
export function adminConfigured() { return !!process.env.ADMIN_PASSWORD; }

function sha(s) { return crypto.createHash('sha256').update(String(s)).digest(); }
function tokenKey() { return sha('ladydee-admin-token:' + (process.env.ADMIN_PASSWORD || '')); }

export function checkPassword(input) {
  const real = process.env.ADMIN_PASSWORD || '';
  if (!real) return false;
  return crypto.timingSafeEqual(sha(input), sha(real));
}

export function makeToken(hours) {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + (hours || 12) * 3600000 })).toString('base64url');
  const sig = crypto.createHmac('sha256', tokenKey()).update(payload).digest('base64url');
  return payload + '.' + sig;
}

export function verifyToken(token) {
  if (!adminConfigured() || !token) return false;
  const parts = String(token).split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return false;
  const expected = crypto.createHmac('sha256', tokenKey()).update(parts[0]).digest();
  let got;
  try { got = Buffer.from(parts[1], 'base64url'); } catch (e) { return false; }
  if (got.length !== expected.length || !crypto.timingSafeEqual(got, expected)) return false;
  try {
    return JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8')).exp > Date.now();
  } catch (e) { return false; }
}

/* Returns true when the request carries a valid admin token; otherwise
   sends the error response itself and returns false. */
export function requireAdmin(req, res) {
  if (!adminConfigured()) {
    res.status(503).json({ success: false, configured: false, error: 'Set ADMIN_PASSWORD in your hosting environment to enable admin sign-in.' });
    return false;
  }
  const h = (req.headers && req.headers.authorization) || '';
  const token = h.indexOf('Bearer ') === 0 ? h.slice(7) : '';
  if (!verifyToken(token)) {
    res.status(401).json({ success: false, error: 'Not signed in' });
    return false;
  }
  return true;
}

/* ---------- tiny per-instance rate limiter ---------- */
const buckets = new Map();
export function rateLimited(bucket, key, max, windowMs) {
  const id = bucket + ':' + key;
  const now = Date.now();
  const recent = (buckets.get(id) || []).filter(function (t) { return now - t < windowMs; });
  recent.push(now);
  buckets.set(id, recent);
  return recent.length > max;
}

export function clientIp(req) {
  return String((req.headers && req.headers['x-forwarded-for']) || '').split(',')[0].trim() || 'unknown';
}
