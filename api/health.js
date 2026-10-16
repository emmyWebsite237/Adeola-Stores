/* ============================================================
   Adeola Stores — /api/health
   GET /api/health
   Reports whether the backend exists, which integrations are ready, and — the
   part the storefront cares about — WHAT PAYMENT MODE THE STORE IS IN.

   Never returns a secret: only true/false flags, the mode NAME, and the public
   values the browser needs (Cloudinary cloud name + unsigned preset).
   ============================================================ */
import { getSettings, adminConfigured } from '../lib/settings.js';
import { resolvePayment, publicPaymentStatus } from '../lib/payment-config.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const s = await getSettings();
  res.status(200).json({
    ok: true,
    server: true,
    service: 'ladydee-api',
    time: new Date().toISOString(),
    adminLogin: adminConfigured(),
    integrations: {
      database: !!process.env.DATABASE_URL,
      brevo: !!(s.brevo_api_key && s.brevo_sender_email),
      /* real sign-up/login needs the database AND working email */
      accounts: !!process.env.DATABASE_URL && !!(s.brevo_api_key && s.brevo_sender_email),
      brevoKey: !!s.brevo_api_key,
      brevoSender: !!s.brevo_sender_email,
      openai: !!s.openai_api_key,
      cloudinary: !!(s.cloudinary_cloud_name && s.cloudinary_upload_preset)
    },
    /* Payments: { mode:'test'|'live'|'demo', usable, modeLabel, problems, … }.
       The storefront uses `mode` to show the right banner and pick the right
       checkout route; no key is ever included. */
    payment: publicPaymentStatus(resolvePayment(s)),
    publicConfig: { cloudinary: { cloudName: s.cloudinary_cloud_name, uploadPreset: s.cloudinary_upload_preset } }
  });
}
