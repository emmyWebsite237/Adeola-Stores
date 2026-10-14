/* ============================================================
   Ladydee Minimart Store — /api/email/send
   ------------------------------------------------------------
   POST /api/email/send   { to, toName, subject, html, template? }

   Server-side proxy for Brevo transactional email. This is the piece
   that actually fixes the client-side mail integration:

     • The Brevo API key stays on the server and never reaches the
       browser, so it cannot be scraped out of localStorage.
     • Brevo's API does not send CORS headers, so a call straight from
       the page is blocked by the browser. Calling it from here has no
       CORS restriction at all.

   brevi.js uses this endpoint automatically whenever /api/health reports
   that the backend is present.
   ============================================================ */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!process.env.BREVO_API_KEY) {
    return res.status(503).json({
      success: false,
      configured: false,
      error: 'Email is not configured on the server. Set BREVO_API_KEY in your hosting environment.'
    });
  }

  const body = req.body || {};
  const to = String(body.to || '').trim();
  const subject = String(body.subject || '').trim();
  const html = String(body.html || '');

  if (!to || !subject || !html) {
    return res.status(400).json({ success: false, error: 'to, subject and html are required' });
  }

  const senderEmail = body.senderEmail || process.env.BREVO_SENDER_EMAIL;
  if (!senderEmail) {
    return res.status(503).json({
      success: false,
      configured: false,
      error: 'No sender address. Set BREVO_SENDER_EMAIL on the server, or pass senderEmail.'
    });
  }

  const endpoint = body.endpoint || process.env.BREVO_ENDPOINT || 'https://api.brevo.com/v3/smtp/email';
  const replyTo = body.replyTo || process.env.BREVO_REPLY_TO || senderEmail;
  const senderName = body.senderName || process.env.BREVO_SENDER_NAME || 'LadyDee Groceries';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: to, name: body.toName || to }],
        replyTo: { email: replyTo, name: senderName },
        subject: subject,
        htmlContent: html
      })
    });

    const detail = await response.text();
    if (!response.ok) {
      console.error('Brevo rejected the message:', response.status, detail);
      return res.status(response.status).json({
        success: false,
        error: 'Brevo rejected the message',
        providerStatus: response.status,
        detail: detail.slice(0, 500)
      });
    }

    let messageId = null;
    try { messageId = JSON.parse(detail).messageId || null; } catch (e) { /* non-JSON success body */ }

    return res.status(200).json({ success: true, messageId: messageId, template: body.template || 'generic' });
  } catch (error) {
    console.error('Email proxy failed:', error);
    return res.status(502).json({
      success: false,
      error: 'Could not reach the email provider: ' + (error && error.message ? error.message : String(error))
    });
  }
}
