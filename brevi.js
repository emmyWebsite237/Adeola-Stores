/* ============================================================
   Ladydee Minimart Store — Brevi email module
   ------------------------------------------------------------
   Sends transactional email (order confirmation, sign-up
   verification, password reset) through Brevi.

   Brevi uses the Brevo-compatible transactional email API:
     POST https://api.brevo.com/v3/smtp/email
     headers: { "api-key": "<YOUR_KEY>", "content-type": "application/json" }
     body:    { sender:{name,email}, to:[{email,name}], subject, htmlContent }

   If no API key is configured the module runs in DEMO MODE:
   nothing is sent anywhere, and the exact email that *would*
   have been sent is stored locally and shown in a preview
   modal so it can be tested end to end.

   Configure the key from the admin page (Settings → Brevi email)
   or in the console:
     LadydeeEmail.setConfig({ apiKey: 'xkeysib-...' })
   ============================================================ */
(function () {
  'use strict';

  var DEFAULTS = {
    apiKey: '',                                   // paste your Brevi / Brevo API key here
    endpoint: 'https://api.brevo.com/v3/smtp/email',
    senderName: 'Ladydee Minimart Store',
    senderEmail: 'orders@ladydee.ng',
    replyTo: 'hello@ladydee.ng',
    enabled: true
  };

  var K = { config: 'ladydee_brevi_config', log: 'ladydee_email_log' };

  function read(key, fb) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; } catch (e) { return fb; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  function getConfig() {
    var c = read(K.config, null) || {};
    var out = {};
    for (var k in DEFAULTS) if (Object.prototype.hasOwnProperty.call(DEFAULTS, k)) out[k] = (c[k] !== undefined ? c[k] : DEFAULTS[k]);

    /* The admin's "API keys" tab stores the same Brevo values in
       ladydee_integrations. Use those when the Brevi tab has no value, so
       configuring either place works. The Brevi tab always wins. */
    var I = (window.Ladydee && window.Ladydee.getIntegrations) ? window.Ladydee.getIntegrations() : null;
    if (I) {
      if (!out.apiKey && I.brevoKey) out.apiKey = I.brevoKey;
      if (!c.senderEmail && I.brevoSenderEmail) out.senderEmail = I.brevoSenderEmail;
      if (!c.replyTo && I.brevoReplyTo) out.replyTo = I.brevoReplyTo;
    }
    return out;
  }
  function setConfig(patch) {
    var c = getConfig();
    for (var k in patch) if (Object.prototype.hasOwnProperty.call(patch, k)) c[k] = patch[k];
    write(K.config, c);
    return c;
  }
  /* True when mail can really be sent - either the server proxy is
     configured (preferred: the key stays on the server) or a client-side
     key has been entered (testing only). */
  var serverLive = false;
  function isLive() {
    if (serverLive) return true;
    var c = getConfig();
    return !!(c.enabled && c.apiKey && c.apiKey.trim().length > 8);
  }
  function viaServer() { return serverLive; }
  function mode() { return isLive() ? 'live' : 'demo'; }

  /* Ask the backend once whether server-side email is available. When it is,
     the key never has to exist in the browser at all. */
  (function probeServer() {
    var API = window.LadydeeAPI;
    if (!API || typeof API.probe !== 'function') return;
    API.probe().then(function (api) {
      serverLive = !!(api && api.available && api.integrations && api.integrations.brevo);
    });
  })();

  /* ---------- Email log (demo mode + audit trail) ---------- */
  function getLog() { return read(K.log, []); }
  function clearLog() { write(K.log, []); }
  function logEmail(entry) {
    var all = getLog();
    all.unshift(entry);
    if (all.length > 60) all = all.slice(0, 60);
    write(K.log, all);
    return entry;
  }

  /* ---------- Sending ----------
     Three routes, tried in this order:

       1. SERVER PROXY  POST /api/email/send - used whenever the backend is
          present and BREVO_API_KEY is set on it. The key stays server-side
          and there is no CORS problem. This is the production path.
       2. DIRECT CLIENT - a key pasted into the admin. Works for a quick
          test, but the key is readable in the browser and Brevo's API has
          no CORS headers, so a real send usually gets blocked. Testing only.
       3. DEMO MODE    - nothing leaves the browser; the exact email is
          logged and can be previewed. This is the default with no keys.   */
  function send(opts) {
    var cfg = getConfig();
    var entry = {
      id: 'em' + Date.now() + Math.floor(Math.random() * 1000),
      to: opts.to, toName: opts.toName || '',
      subject: opts.subject, html: opts.html,
      template: opts.template || 'generic',
      at: new Date().toISOString(),
      mode: 'demo', status: 'queued'
    };

    var API = window.LadydeeAPI;
    var probeDone = (API && typeof API.probe === 'function') ? API.probe() : Promise.resolve(null);

    return probeDone.then(function (api) {
      if (api && api.available && api.integrations && api.integrations.brevo) {
        serverLive = true;
        entry.mode = 'live';
        entry.via = 'server';
        return fetch('/api/email/send', {
          method: 'POST',
          headers: { 'content-type': 'application/json', accept: 'application/json' },
          body: JSON.stringify({
            to: opts.to, toName: opts.toName || '',
            subject: opts.subject, html: opts.html,
            template: entry.template,
            replyTo: cfg.replyTo, senderName: cfg.senderName
          })
        }).then(function (r) {
          entry.status = r.ok ? 'sent' : 'failed';
          entry.httpStatus = r.status;
          logEmail(entry);
          return { ok: r.ok, demo: false, entry: entry, status: r.status, via: 'server' };
        }).catch(function (err) {
          entry.status = 'failed';
          entry.error = String(err && err.message ? err.message : err);
          logEmail(entry);
          return { ok: false, demo: false, entry: entry, error: entry.error, via: 'server' };
        });
      }

      if (!isLive()) {
        entry.status = 'demo';
        logEmail(entry);
        return { ok: true, demo: true, entry: entry };
      }

      /* direct client-side send (testing only) */
      entry.mode = 'live';
      entry.via = 'client';
      var body = {
        sender: { name: cfg.senderName, email: cfg.senderEmail },
        to: [{ email: opts.to, name: opts.toName || opts.to }],
        replyTo: { email: cfg.replyTo, name: cfg.senderName },
        subject: opts.subject,
        htmlContent: opts.html
      };

      return fetch(cfg.endpoint, {
        method: 'POST',
        headers: { 'api-key': cfg.apiKey, 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(body)
      }).then(function (r) {
        entry.status = r.ok ? 'sent' : 'failed';
        entry.httpStatus = r.status;
        logEmail(entry);
        return { ok: r.ok, demo: false, entry: entry, status: r.status, via: 'client' };
      }).catch(function (err) {
        entry.status = 'failed';
        entry.error = String(err && err.message ? err.message : err);
        logEmail(entry);
        return { ok: false, demo: false, entry: entry, error: entry.error, via: 'client' };
      });
    });
  }

  /* ---------- Shared email shell ---------- */
  function shell(title, intro, bodyHTML, footerNote) {
    return '' +
    '<div style="margin:0;padding:24px;background:#f4f6f3;font-family:Arial,Helvetica,sans-serif;color:#12241c">' +
      '<div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e2e8e2">' +
        '<div style="background:#0f5132;padding:22px 26px">' +
          '<div style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-.3px">Ladydee <span style="color:#f0b429">Minimart</span></div>' +
          '<div style="font-size:12px;color:#bfe0cd;margin-top:2px">Everyday groceries, delivered</div>' +
        '</div>' +
        '<div style="padding:28px 26px">' +
          '<h1 style="margin:0 0 10px;font-size:21px;color:#12241c">' + title + '</h1>' +
          '<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#4a5a52">' + intro + '</p>' +
          bodyHTML +
        '</div>' +
        '<div style="padding:18px 26px;background:#f7f9f7;border-top:1px solid #e2e8e2;font-size:12px;color:#7b8a82;line-height:1.6">' +
          (footerNote || '') +
          '<div style="margin-top:8px">' + (function () {
            var s = (window.Ladydee && Ladydee.getStoreInfo) ? Ladydee.getStoreInfo() : null;
            return s ? (s.name + ' · ' + s.address + ' · ' + s.phone) : 'Ladydee Minimart Store · 12 Adeniran Ogunsanya, Surulere, Lagos · 0801 234 5678';
          })() + '</div>' +
          '<div style="margin-top:6px">This is a demonstration store. No real payment was taken.</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function money(n) {
    n = Number(n) || 0;
    return '\u20a6' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ---------- Templates ---------- */
  function orderConfirmationHTML(order) {
    var rows = (order.items || []).map(function (it) {
      return '<tr>' +
        '<td style="padding:10px 0;border-bottom:1px solid #eef2ee;font-size:14px;color:#12241c">' +
          esc(it.name) + '<div style="font-size:12px;color:#7b8a82">' + esc(it.size || '') + ' · Qty ' + it.qty + '</div></td>' +
        '<td style="padding:10px 0;border-bottom:1px solid #eef2ee;font-size:14px;text-align:right;color:#12241c">' +
          money(it.price * it.qty) + '</td>' +
      '</tr>';
    }).join('');

    var body =
      '<div style="background:#f0f7f2;border:1px solid #cfe6d8;border-radius:10px;padding:14px 16px;margin-bottom:20px">' +
        '<div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#0f5132;font-weight:700">Order number</div>' +
        '<div style="font-size:19px;font-weight:800;color:#0f5132;margin-top:2px">' + esc(order.code) + '</div>' +
      '</div>' +
      '<table style="width:100%;border-collapse:collapse;margin-bottom:16px">' + rows + '</table>' +
      '<table style="width:100%;border-collapse:collapse;font-size:14px">' +
        '<tr><td style="padding:4px 0;color:#4a5a52">Subtotal</td><td style="text-align:right">' + money(order.subtotal) + '</td></tr>' +
        (order.discount ? '<tr><td style="padding:4px 0;color:#0f5132">Discount' + (order.coupon ? ' (' + esc(order.coupon) + ')' : '') + '</td><td style="text-align:right;color:#0f5132">−' + money(order.discount) + '</td></tr>' : '') +
        '<tr><td style="padding:4px 0;color:#4a5a52">Delivery' + (order.deliveryDiscount ? ' <span style="color:#0f5132">(discounted)</span>' : '') + '</td><td style="text-align:right">' + (order.deliveryFee ? money(order.deliveryFee) : 'Free') + '</td></tr>' +
        '<tr><td style="padding:4px 0;color:#4a5a52">VAT (7.5%)</td><td style="text-align:right">' + money(order.tax) + '</td></tr>' +
        '<tr><td style="padding:10px 0 0;font-weight:800;font-size:16px;border-top:1px solid #e2e8e2">Total</td>' +
          '<td style="padding:10px 0 0;text-align:right;font-weight:800;font-size:16px;border-top:1px solid #e2e8e2">' + money(order.total) + '</td></tr>' +
      '</table>' +
      '<div style="margin-top:22px;padding:16px;background:#f7f9f7;border-radius:10px;font-size:14px;line-height:1.6;color:#4a5a52">' +
        '<b style="color:#12241c">Delivering to</b><br>' +
        esc(order.customer && order.customer.name) + '<br>' +
        esc(order.customer && order.customer.address) + ', ' + esc(order.customer && order.customer.city) + '<br>' +
        '<span style="color:#0f5132;font-weight:700">Estimated arrival: ' + esc(order.eta || '2–3 days') + '</span>' +
      '</div>' +
      '<div style="margin-top:20px;font-size:14px;color:#4a5a52">Payment method: <b style="color:#12241c">' + esc(order.payment || 'Card') + '</b></div>';

    return shell(
      'Thank you — your order is confirmed',
      'Hi ' + esc((order.customer && order.customer.name) || 'there') + ', we have received your order and our team is already picking it.',
      body,
      'You are receiving this because you placed an order with Ladydee Minimart Store.'
    );
  }

  function verifyHTML(user, code) {
    var body =
      '<div style="text-align:center;margin:8px 0 22px">' +
        '<div style="display:inline-block;background:#0f5132;color:#ffffff;font-size:30px;font-weight:800;letter-spacing:8px;padding:16px 26px;border-radius:12px">' + esc(code) + '</div>' +
      '</div>' +
      '<p style="font-size:14px;line-height:1.6;color:#4a5a52;margin:0 0 8px">Enter this code on the verification screen to activate your account. It expires in 15 minutes.</p>' +
      '<p style="font-size:13px;color:#7b8a82;margin:16px 0 0">If you did not create a Ladydee account, you can safely ignore this email.</p>';
    return shell(
      'Verify your email address',
      'Welcome to Ladydee, ' + esc(user.name || 'there') + '! One quick step and your account is ready.',
      body,
      'You are receiving this because an account was created with this email address.'
    );
  }

  function resetHTML(user, code) {
    var body =
      '<div style="text-align:center;margin:8px 0 22px">' +
        '<div style="display:inline-block;background:#f0b429;color:#3a2600;font-size:30px;font-weight:800;letter-spacing:8px;padding:16px 26px;border-radius:12px">' + esc(code) + '</div>' +
      '</div>' +
      '<p style="font-size:14px;line-height:1.6;color:#4a5a52;margin:0 0 8px">Use this code to reset your password. It expires in 15 minutes.</p>' +
      '<p style="font-size:13px;color:#7b8a82;margin:16px 0 0">If you did not request a reset, no action is needed — your password has not changed.</p>';
    return shell(
      'Reset your password',
      'Hi ' + esc(user.name || 'there') + ', we received a request to reset your Ladydee password.',
      body,
      'You are receiving this because a password reset was requested for this email address.'
    );
  }

  /* ---------- High-level senders ---------- */
  function sendOrderConfirmation(order) {
    return send({
      to: (order.customer && order.customer.email) || '',
      toName: (order.customer && order.customer.name) || '',
      subject: 'Your Ladydee order ' + order.code + ' is confirmed',
      html: orderConfirmationHTML(order),
      template: 'order-confirmation'
    });
  }
  function sendVerification(user, code) {
    return send({
      to: user.email, toName: user.name,
      subject: 'Verify your Ladydee account',
      html: verifyHTML(user, code),
      template: 'signup-verification'
    });
  }
  function sendPasswordReset(user, code) {
    return send({
      to: user.email, toName: user.name,
      subject: 'Reset your Ladydee password',
      html: resetHTML(user, code),
      template: 'password-reset'
    });
  }

  /* ---------- Preview modal (demo mode) ---------- */
  function ensureModal() {
    var m = document.getElementById('breviModal');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'breviModal';
    m.className = 'modal-scrim';
    m.hidden = true;
    m.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="breviModalTitle">' +
        '<div class="modal-head">' +
          '<div><span class="modal-kicker" id="breviModalKicker">Email preview</span>' +
          '<h3 id="breviModalTitle">Message</h3></div>' +
          '<button class="icon-btn" id="breviModalClose" aria-label="Close">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="modal-meta" id="breviModalMeta"></div>' +
        '<div class="modal-body" id="breviModalBody"></div>' +
        '<div class="modal-foot"><button class="btn btn-outline" id="breviModalOk" type="button">Close</button></div>' +
      '</div>';
    document.body.appendChild(m);
    function shut() { m.hidden = true; document.body.classList.remove('no-scroll'); }
    m.addEventListener('click', function (e) { if (e.target === m) shut(); });
    m.querySelector('#breviModalClose').addEventListener('click', shut);
    m.querySelector('#breviModalOk').addEventListener('click', shut);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !m.hidden) shut(); });
    return m;
  }

  function showPreview(entry) {
    var m = ensureModal();
    var live = entry.mode === 'live';
    var how = entry.via === 'server' ? 'Sent via Brevi (server proxy)' : live ? 'Sent via Brevi (browser)' : 'Demo mode — not actually sent';
    m.querySelector('#breviModalKicker').textContent = how;
    m.querySelector('#breviModalTitle').textContent = entry.subject;
    m.querySelector('#breviModalMeta').innerHTML =
      '<span class="mm-row"><b>To</b> ' + esc(entry.toName ? entry.toName + ' <' + entry.to + '>' : entry.to) + '</span>' +
      '<span class="mm-row"><b>From</b> ' + esc(getConfig().senderName + ' <' + getConfig().senderEmail + '>') + '</span>' +
      '<span class="mm-row"><b>Status</b> <span class="pill ' + (live ? 'pill-ok' : 'pill-warn') + '">' + esc(entry.status) + '</span></span>' +
      (live ? '' : '<span class="mm-note">No email integration is configured, so nothing left the browser. Either set BREVO_API_KEY on your server, or add a Brevi key in the admin settings to send for real.</span>');
    m.querySelector('#breviModalBody').innerHTML = entry.html;
    m.hidden = false;
    document.body.classList.add('no-scroll');
  }

  /* ---------- Public API ---------- */
  window.LadydeeEmail = {
    getConfig: getConfig, setConfig: setConfig, isLive: isLive, mode: mode, viaServer: viaServer,
    send: send, getLog: getLog, clearLog: clearLog,
    orderConfirmationHTML: orderConfirmationHTML, verifyHTML: verifyHTML, resetHTML: resetHTML,
    sendOrderConfirmation: sendOrderConfirmation,
    sendVerification: sendVerification,
    sendPasswordReset: sendPasswordReset,
    showPreview: showPreview,
    DEFAULTS: DEFAULTS
  };
})();
