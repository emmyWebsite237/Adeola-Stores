/* ============================================================
   Ladydee Minimart Store — /api/health
   ------------------------------------------------------------
   GET /api/health

   Lets the frontend find out, once, whether the serverless backend
   exists AND which integrations are configured — without ever leaking a
   key. The static build has no /api directory, so this returns a 404
   there and api-client.js quietly falls back to browser-only behaviour.

   Nothing here reads or returns a secret value; it only reports whether
   each environment variable is PRESENT.
   ============================================================ */
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    ok: true,
    server: true,
    service: 'ladydee-api',
    time: new Date().toISOString(),
    integrations: {
      database: !!process.env.DATABASE_URL,
      brevo: !!process.env.BREVO_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
      cloudinary: !!(process.env.CLOUDINARY_SECRET || process.env.CLOUDINARY_CLOUD_NAME)
    }
  });
}
