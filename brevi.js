/* ============================================================
   Ladydee Minimart Store — Brevi (Brevo) transactional email, browser side
   ------------------------------------------------------------
   Builds the order-confirmation, verification and reset emails and hands
   them to the server: POST /api/email/send. The Brevo API key, the sender
   address and the reply-to address all live in server environment
   variables (BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME,
   BREVO_REPLY_TO). Nothing about email is configured in the browser.

   If the server cannot send yet (no /api, or key/sender not set), the
   email is only logged here and can be previewed (demo mode).
   ============================================================ */
(function () {
  'use strict';

  var K = { config: 'ladydee_brevi_config', log: 'ladydee_email_log' };

  function read(key, fb) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; } catch (e) { return fb; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  /* True only when the server reports email is fully configured. */
  var serverLive = false;
  function isLive() { return serverLive; }
  function viaServer() { return serverLive; }
  function mode() { return serverLive ? 'live' : 'demo'; }

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
     Server only: POST /api/email/send. Only the message itself is sent;
     the server decides the sender, reply-to and Brevo key.
     With no working server the email is logged and can be previewed.   */
  function send(opts) {
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
      if (!(api && api.available && api.integrations && api.integrations.brevo)) {
        entry.status = 'demo';
        logEmail(entry);
        return { ok: true, demo: true, entry: entry };
      }
      serverLive = true;
      entry.mode = 'live';
      entry.via = 'server';
      return fetch('/api/email/send', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          to: opts.to, toName: opts.toName || '',
          subject: opts.subject, html: opts.html,
          template: entry.template
        })
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          entry.status = r.ok ? 'sent' : 'failed';
          entry.httpStatus = r.status;
          if (!r.ok) entry.error = (j && j.error) || ('HTTP ' + r.status);
          logEmail(entry);
          return { ok: r.ok, demo: false, entry: entry, status: r.status, error: entry.error, via: 'server' };
        });
      }).catch(function (err) {
        entry.status = 'failed';
        entry.error = String(err && err.message ? err.message : err);
        logEmail(entry);
        return { ok: false, demo: false, entry: entry, error: entry.error, via: 'server' };
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
    var how = entry.via === 'server' ? 'Sent via Brevi (server)' : 'Demo mode — not actually sent';
    m.querySelector('#breviModalKicker').textContent = how;
    m.querySelector('#breviModalTitle').textContent = entry.subject;
    m.querySelector('#breviModalMeta').innerHTML =
      '<span class="mm-row"><b>To</b> ' + esc(entry.toName ? entry.toName + ' <' + entry.to + '>' : entry.to) + '</span>' +
      '<span class="mm-row"><b>Status</b> <span class="pill ' + (live ? 'pill-ok' : 'pill-warn') + '">' + esc(entry.status) + '</span></span>' +
      (live ? '' : '<span class="mm-note">No email integration is configured, so nothing left the browser. Set BREVO_API_KEY and BREVO_SENDER_EMAIL in your server environment to send for real.</span>');
    m.querySelector('#breviModalBody').innerHTML = entry.html;
    m.hidden = false;
    document.body.classList.add('no-scroll');
  }

  /* ---------- Public API ---------- */
  window.LadydeeEmail = {
    isLive: isLive, mode: mode, viaServer: viaServer,
    send: send, getLog: getLog, clearLog: clearLog,
    orderConfirmationHTML: orderConfirmationHTML, verifyHTML: verifyHTML, resetHTML: resetHTML,
    sendOrderConfirmation: sendOrderConfirmation,
    sendVerification: sendVerification,
    sendPasswordReset: sendPasswordReset,
    showPreview: showPreview
  };
})();
