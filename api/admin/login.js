/* POST /api/admin/login  { password }  ->  { success, token }
   The password is checked on the server against ADMIN_PASSWORD. */
import { adminConfigured, checkPassword, makeToken, rateLimited, clientIp } from '../../lib/settings.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  if (!adminConfigured()) {
    return res.status(503).json({ success: false, configured: false, error: 'ADMIN_PASSWORD is not set on the server.' });
  }
  if (rateLimited('admin-login', clientIp(req), 8, 60000)) {
    return res.status(429).json({ success: false, error: 'Too many attempts. Try again in a minute.' });
  }
  const password = String((req.body && req.body.password) || '');
  if (!checkPassword(password)) {
    return res.status(401).json({ success: false, error: 'Incorrect password' });
  }
  return res.status(200).json({ success: true, token: makeToken(12), expiresInHours: 12 });
}
