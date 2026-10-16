/* ============================================================
   Adeola Stores — shared checkout engine
   ----------------------------------------------------------------------------
   ONE front-end module behind every payment entry point, so the Buy Now
   button, the cart's payment step and /checkout all behave identically and
   always agree about which mode the store is in.

   It decides which server route to call from the mode reported by
   /api/health:

       mode "test" | "live"  ->  /api/checkout/paystack
       mode "demo"           ->  /api/checkout/sandbox     (offline preview)

   The mode itself lives on the SERVER (lib/payment-config.js). This module
   only reads the name of it — no key ever reaches the browser.

   Exposes window.LadydeeCheckout.
   ============================================================ */
(function () {
  'use strict';

  var ROUTE = { paystack: '/api/checkout/paystack', sandbox: '/api/checkout/sandbox' };
  var TIMEOUT = 12000;

  var state = {
    mode: 'test',
    status: null,        /* the whole payment object from /api/health */
    loaded: false,
    problem: null
  };

  function S() { return window.Ladydee; }

  function request(url, method, body) {
    var headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    var token = (S() && S().authToken) ? S().authToken() : '';
    if (token) headers.Authorization = 'Bearer ' + token;

    var controller = ('AbortController' in window) ? new AbortController() : null;
    var timer = setTimeout(function () { if (controller) controller.abort(); }, TIMEOUT);

    return fetch(url, {
      method: method || 'GET', headers: headers,
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
      signal: controller ? controller.signal : undefined
    }).then(function (r) {
      clearTimeout(timer);
      return r.json().catch(function () { return {}; }).then(function (d) {
        return { ok: r.ok, status: r.status, data: d };
      });
    }).catch(function (err) {
      clearTimeout(timer);
      return { ok: false, status: 0, data: {}, networkError: String(err && err.message ? err.message : err) };
    });
  }

  /* Ask the server which mode the store is in. Cached after the first call. */
  function load(force) {
    if (state.loaded && !force) return Promise.resolve(state);
    return fetch('/api/health', { headers: { accept: 'application/json' }, cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) {
        state.status = (d && d.payment) || null;
        state.mode = (state.status && state.status.mode) || 'test';
        state.problem = (state.status && state.status.problems && state.status.problems.length) ? state.status.problems[0] : null;
        state.loaded = true;
        return state;
      })
      .catch(function () {
        /* No backend (opened off disk) — leave the sensible default. */
        state.loaded = true;
        state.mode = 'test';
        state.problem = 'The store server could not be reached, so online payment is unavailable.';
        return state;
      });
  }

  function route() { return state.mode === 'demo' ? ROUTE.sandbox : ROUTE.paystack; }
  function isDemo() { return state.mode === 'demo'; }
  function isLive() { return state.mode === 'live'; }
  function label() {
    if (state.mode === 'live') return 'Live';
    if (state.mode === 'demo') return 'Sandbox';
    return 'Test';
  }

  /* ---------- start a payment ---------- */
  function startPayment(payload) {
    return request(route(), 'POST', payload).then(function (r) {
      var d = r.data || {};
      if (r.status === 401) return { ok: false, unauthenticated: true, error: d.error || 'Please sign in to continue.' };
      if (!r.ok || !d.success || !d.authorizationUrl) {
        return { ok: false, error: d.error || 'We could not start payment. Please try again.', code: d.code || '', paymentMode: d.paymentMode || state.mode };
      }
      return { ok: true, authorizationUrl: d.authorizationUrl, reference: d.reference, mode: d.mode || state.mode };
    }).catch(function () {
      return { ok: false, error: 'A network error prevented checkout. Please check your connection and try again.' };
    });
  }

  /* ---------- verify a return from payment ---------- */
  function verifyPayment(reference, outcome) {
    var url = (state.mode === 'demo' ? ROUTE.sandbox : ROUTE.paystack) + '?reference=' + encodeURIComponent(reference);
    if (state.mode === 'demo' && outcome) url += '&outcome=' + encodeURIComponent(outcome);
    return request(url, 'GET').then(function (r) {
      var d = r.data || {};
      if (r.status === 401) return { ok: false, unauthenticated: true, error: d.error || 'Please sign in.' };
      return {
        ok: !!(r.ok && d.success && d.status === 'paid'),
        status: d.status || 'pending',
        order: d.order || null,
        mode: d.mode || state.mode,
        amount: d.amount,
        reference: reference,
        error: d.error || ''
      };
    }).catch(function () {
      return { ok: false, status: 'pending', error: 'We could not verify the payment just yet.' };
    });
  }

  /* ---------- the mode banner (what the shopper sees) ---------- */
  function modeBannerHTML() {
    var esc = (S() && S().esc) ? S().esc : function (s) { return String(s == null ? '' : s); };
    if (state.mode === 'live') return '';
    if (state.mode === 'demo') {
      return '<div class="pays-mode pays-mode--demo" role="status">' +
        '<span class="pays-mode-ico" aria-hidden="true">🧪</span>' +
        '<span><b>Sandbox preview — no money moves.</b>' +
        '<small>This walkthrough uses the full checkout journey with a simulated payment. Switch the store to test or live mode in the admin to take real payments.</small></span></div>';
    }
    return '<div class="pays-mode pays-mode--test" role="status">' +
      '<span class="pays-mode-ico" aria-hidden="true">🧪</span>' +
      '<span><b>Test mode — no real money is taken.</b>' +
      '<small>Payments run through Paystack\'s test environment. Use a Paystack test card; nothing is charged.</small></span></div>';
  }

  /* ---------- terms & conditions (required by the provider/checkout) ---------- */
  function termsHTML(checked) {
    /* No `required` attribute on purpose: the explicit check in each page shows
       a clear, styled message, whereas the native bubble would fire first and
       say nothing useful. */
    return '<label class="terms-check" for="termsAccept">' +
      '<input type="checkbox" id="termsAccept"' + (checked ? ' checked' : '') + '>' +
      '<span>I have read and accept the <a href="/workflows" target="_blank" rel="noopener">Terms &amp; Conditions</a>, ' +
      'the <a href="/workflows" target="_blank" rel="noopener">Returns Policy</a> and the ' +
      '<a href="/workflows" target="_blank" rel="noopener">Privacy Policy</a>, and I confirm my delivery details are correct.</span>' +
      '</label>';
  }

  /* ---------- a printable receipt for a paid order ---------- */
  function receiptHTML(order, opts) {
    opts = opts || {};
    var esc = (S() && S().esc) ? S().esc : function (s) { return String(s == null ? '' : s); };
    var money = (S() && S().money) ? S().money : function (n) { return '₦' + Number(n || 0).toLocaleString('en-NG'); };
    if (!order) return '';
    var rows = (order.items || []).map(function (i) {
      return '<tr><td><b>' + esc(i.name) + '</b><small>× ' + esc(i.qty) + '</small></td>' +
        '<td class="rc-num">' + money(i.lineTotal) + '</td></tr>';
    }).join('');
    /* Use the store's own (admin-editable) name so the receipt always matches
       the rest of the site — never a hard-coded brand. */
    var brand = (S() && S().getStoreInfo) ? (S().getStoreInfo().name || 'Store') : 'Store';
    var paid = String(order.status || '').toLowerCase() === 'paid';
    return '<div class="receipt" id="orderReceipt" data-reference="' + esc(order.reference) + '">' +
      '<div class="receipt-head">' +
        '<div><span class="receipt-brand">' + esc(brand) + '</span>' +
        '<h3>' + (paid ? 'Payment receipt' : 'Order summary') + '</h3></div>' +
        '<span class="receipt-badge ' + (paid ? 'is-paid' : 'is-pending') + '">' +
          (paid ? 'Paid' : esc(order.status)) + '</span>' +
      '</div>' +
      '<div class="receipt-meta">' +
        '<div><small>Reference</small><b class="mono">' + esc(order.reference) + '</b></div>' +
        '<div><small>Date</small><b>' + esc(fmtDate(order.paidAt || order.createdAt)) + '</b></div>' +
        '<div><small>Payment</small><b>' + esc(modeLabelFor(order.paymentMode)) + '</b></div>' +
      '</div>' +
      '<table class="receipt-table"><tbody>' + rows + '</tbody></table>' +
      '<div class="receipt-totals">' +
        '<div class="receipt-row"><span>Subtotal</span><b>' + money(order.subtotal) + '</b></div>' +
        '<div class="receipt-row"><span>Delivery</span><b>' + (Number(order.delivery) === 0 ? 'Free' : money(order.delivery)) + '</b></div>' +
        '<div class="receipt-row total"><span>Total ' + (paid ? 'paid' : 'due') + '</span><b>' + money(order.total) + '</b></div>' +
      '</div>' +
      '<div class="receipt-deliver">' +
        '<small>Delivering to</small>' +
        '<p><b>' + esc(order.customerName) + '</b><br>' + esc(order.address) + ', ' + esc(order.city) + '<br>' + esc(order.phone) + '</p>' +
      '</div>' +
      (opts.footNote ? '<p class="receipt-note">' + opts.footNote + '</p>' : '') +
      '</div>';
  }

  function modeLabelFor(m) {
    if (m === 'live') return 'Live';
    if (m === 'demo') return 'Sandbox';
    return 'Test';
  }
  function fmtDate(v) {
    if (!v) return '—';
    try {
      var d = new Date(v);
      if (isNaN(d.getTime())) return '—';
      return d.toLocaleString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) { return '—'; }
  }

  /* ---------- print just the receipt ---------- */
  function printReceipt() {
    var el = document.getElementById('orderReceipt');
    if (!el) return;
    var w = window.open('', '_blank', 'width=720,height=900');
    if (!w) { window.print(); return; }
    var css = '';
    try {
      css = Array.prototype.slice.call(document.styleSheets).map(function (ss) {
        try { return Array.prototype.slice.call(ss.cssRules).map(function (r) { return r.cssText; }).join('\n'); }
        catch (e) { return ''; }
      }).join('\n');
    } catch (e) { css = ''; }
    w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Receipt ' +
      (el.getAttribute('data-reference') || '') + '</title><style>' + css +
      '\nbody{background:#fff;padding:26px;max-width:640px;margin:0 auto}' +
      '.receipt{box-shadow:none;border-color:#ddd}</style></head><body>' + el.outerHTML + '</body></html>');
    w.document.close();
    setTimeout(function () { try { w.focus(); w.print(); } catch (e) {} }, 350);
  }

  window.LadydeeCheckout = {
    load: load,
    state: state,
    route: route,
    isDemo: isDemo,
    isLive: isLive,
    modeLabel: label,
    startPayment: startPayment,
    verifyPayment: verifyPayment,
    modeBannerHTML: modeBannerHTML,
    termsHTML: termsHTML,
    receiptHTML: receiptHTML,
    printReceipt: printReceipt,
    request: request
  };
})();
