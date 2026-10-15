/* ============================================================
   Ladydee Minimart Store — /api/health
   GET /api/health
   Reports whether the backend exists and which integrations are ready.
   Never returns a secret: only true/false flags and the public values the
   browser needs (Cloudinary cloud name + unsigned preset).
   ============================================================ */
import { getSettings, adminConfigured } from '../lib/settings.js';

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
      brevoKey: !!s.brevo_api_key,
      brevoSender: !!s.brevo_sender_email,
      openai: !!s.openai_api_key,
      cloudinary: !!(s.cloudinary_cloud_name && s.cloudinary_upload_preset)
    },
    publicConfig: { cloudinary: { cloudName: s.cloudinary_cloud_name, uploadPreset: s.cloudinary_upload_preset } }
  });
}
