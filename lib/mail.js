/* Email bodies and link helpers for the account emails. */
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* Public address of the site: the saved Site URL, else the address the request came in on. */
export function siteOrigin(req, settings) {
  const configured = String((settings && settings.site_url) || '').trim().replace(/\/+$/, '');
  if (/^https?:\/\/[^\s]+$/.test(configured)) return configured;
  const h = (req && req.headers) || {};
  const host = String(h['x-forwarded-host'] || h.host || '').split(',')[0].trim();
  const proto = String(h['x-forwarded-proto'] || 'https').split(',')[0].trim();
  return host ? proto + '://' + host : '';
}

function shell(store, heading, intro, buttonText, link, minutes, footer) {
  return (
    '<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #e2e8e2;border-radius:12px;overflow:hidden">' +
      '<div style="background:#0f5132;color:#fff;padding:18px 24px;font-size:18px;font-weight:700">' + esc(store) + '</div>' +
      '<div style="padding:24px;color:#12241c">' +
        '<h2 style="margin:0 0 12px;font-size:20px">' + heading + '</h2>' +
        '<p style="line-height:1.6;margin:0 0 20px">' + intro + '</p>' +
        '<div style="text-align:center;margin:28px 0"><a href="' + esc(link) + '" style="background:#0f5132;color:#fff;padding:13px 26px;text-decoration:none;font-weight:700;border-radius:8px;display:inline-block">' + buttonText + '</a></div>' +
        '<p style="font-size:13px;color:#5f7268;line-height:1.6;margin:0 0 8px"><b>This link works for ' + minutes + ' minutes.</b> ' + footer + '</p>' +
        '<p style="font-size:12px;color:#8a9a90;word-break:break-all;margin:16px 0 0">Button not working? Paste this into your browser:<br>' + esc(link) + '</p>' +
      '</div>' +
    '</div>'
  );
}

export function verificationEmail(o) {
  return shell(o.store, 'Confirm your email, ' + esc(o.name),
    'Thanks for signing up. Tap the button below to confirm your email address and activate your account. You will not be able to sign in until you do.',
    'Confirm my email', o.link, o.minutes,
    'If it expires, your sign-up is removed and you can simply start again. If you did not sign up, ignore this email.');
}

export function resetEmail(o) {
  return shell(o.store, 'Reset your password',
    'We received a request to reset the password on your account. Tap the button below to choose a new one.',
    'Choose a new password', o.link, o.minutes,
    'If you did not ask for this, ignore this email and your password stays the same.');
}
