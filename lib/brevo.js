/* Sends one email through Brevo using the saved settings. */
export async function sendBrevo(s, msg) {
  if (!s.brevo_api_key) {
    return { ok: false, status: 503, code: 'no_key', error: 'Email is not set up yet. Add the Brevo API key in Admin \u2192 Integrations.' };
  }
  if (!s.brevo_sender_email) {
    return { ok: false, status: 503, code: 'no_sender', error: 'Email is not set up yet. Add the sender email in Admin \u2192 Integrations (it must be verified in Brevo).' };
  }
  const senderName = s.brevo_sender_name || 'Ladydee Minimart Store';
  const replyTo = s.brevo_reply_to || s.brevo_sender_email;
  let response, detail;
  try {
    response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { accept: 'application/json', 'api-key': s.brevo_api_key, 'content-type': 'application/json' },
      body: JSON.stringify({
        sender: { name: senderName, email: s.brevo_sender_email },
        to: [{ email: msg.to, name: msg.toName || msg.to }],
        replyTo: { email: replyTo, name: senderName },
        subject: msg.subject,
        htmlContent: msg.html
      })
    });
    detail = await response.text();
  } catch (e) {
    return { ok: false, status: 502, code: 'unreachable', error: 'Could not reach Brevo: ' + (e && e.message ? e.message : e) };
  }
  if (!response.ok) {
    return { ok: false, status: response.status, code: 'rejected', error: 'Brevo rejected the message', detail: detail.slice(0, 500) };
  }
  let messageId = null;
  try { messageId = JSON.parse(detail).messageId || null; } catch (e) { /* non-JSON success body */ }
  return { ok: true, status: 200, messageId: messageId };
}
