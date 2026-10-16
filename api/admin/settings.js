/* GET  /api/admin/settings  -> current settings (secrets are masked)
   POST /api/admin/settings  { values, clear }            -> save
   POST /api/admin/settings  { action: 'test-email', to } -> send a test email
   Every call needs   Authorization: Bearer <token from /api/admin/login>   */
import { FIELDS, getSettings, getSettingsDetailed, saveSettings, maskSecret, requireAdmin } from '../../lib/settings.js';
import { sendBrevo } from '../../lib/brevo.js';
import { resolvePayment, publicPaymentStatus } from '../../lib/payment-config.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!requireAdmin(req, res)) return;

  if (req.method === 'GET') {
    const d = await getSettingsDetailed(true);
    const values = {}, secrets = {};
    Object.keys(FIELDS).forEach(function (k) {
      if (FIELDS[k].secret) secrets[k] = { set: !!d.values[k], preview: maskSecret(d.values[k]) };
      else values[k] = d.values[k];
    });
    /* The live payment verdict for the admin console: which mode is actually in
       force, whether checkout can start, and — when it cannot — why. No keys. */
    return res.status(200).json({
      success: true, dbReady: !!process.env.DATABASE_URL,
      values: values, secrets: secrets, source: d.source,
      payment: publicPaymentStatus(resolvePayment(d.values))
    });
  }

  if (req.method === 'POST') {
    const body = req.body || {};

    if (body.action === 'test-email') {
      const to = String(body.to || '').trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
        return res.status(400).json({ success: false, error: 'Enter a valid email address' });
      }
      const s = await getSettings(true);
      const r = await sendBrevo(s, {
        to: to, toName: 'Test',
        subject: 'Ladydee test email',
        html: '<div style="font-family:Arial,sans-serif;padding:20px"><h2>It works</h2><p>Your Brevo settings are correct. This message was sent from Admin \u2192 Integrations.</p></div>'
      });
      return res.status(200).json({ success: r.ok, status: r.status, error: r.error || null, detail: r.detail || null });
    }

    try {
      await saveSettings(body.values, body.clear);
    } catch (e) {
      const notReady = !process.env.DATABASE_URL;
      return res.status(notReady ? 503 : 500).json({ success: false, error: e && e.message ? e.message : 'Could not save' });
    }
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
