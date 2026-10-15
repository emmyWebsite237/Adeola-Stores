/* ============================================================
   Ladydee Minimart Store — /api/email/send
   POST /api/email/send   { to, toName, subject, html, template? }

   Server-side proxy for Brevo. The key, sender and reply-to come only
   from the saved settings (Admin → Integrations) or the matching
   environment variables, never from the request.
   ============================================================ */
import { getSettings, rateLimited, clientIp } from '../../lib/settings.js';
import { sendBrevo } from '../../lib/brevo.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const body = req.body || {};
  const to = String(body.to || '').trim();
  const subject = String(body.subject || '').trim();
  const html = String(body.html || '');

  if (!to || !subject || !html) {
    return res.status(400).json({ success: false, error: 'to, subject and html are required' });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to) || subject.length > 200 || html.length > 200000) {
    return res.status(400).json({ success: false, error: 'Invalid recipient, or subject/body too long' });
  }
  if (rateLimited('email-send', clientIp(req), 10, 60000)) {
    return res.status(429).json({ success: false, error: 'Too many emails, try again in a minute' });
  }

  const s = await getSettings();
  const r = await sendBrevo(s, { to: to, toName: body.toName, subject: subject, html: html });

  if (!r.ok) {
    console.error('Email failed:', r.code, r.status, r.detail || r.error);
    const notConfigured = r.code === 'no_key' || r.code === 'no_sender';
    return res.status(notConfigured ? 503 : 502).json({ success: false, configured: !notConfigured, error: r.error });
  }
  return res.status(200).json({ success: true, messageId: r.messageId, template: body.template || 'generic' });
}
