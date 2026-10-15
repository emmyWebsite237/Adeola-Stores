/* ============================================================
   Ladydee Minimart Store — frontend API client
   ------------------------------------------------------------
   One small module that talks to the /api backend and degrades gracefully
   when there isn't one.

     • On load it probes GET /api/health once. If that 404s (plain static
       hosting, or opening the files locally) LadydeeAPI.available === false
       and every caller falls back to the browser-only (localStorage) path.
       That is why the site keeps working with no server and no keys.

     • When a backend IS present it uses it for the things that must not
       happen in the browser: sign-up, verification email and the AI payout
       review. The Brevo key never reaches the client.

   Nothing here throws: every method resolves to a plain result object.
   ============================================================ */
(function () {
  'use strict';

  var HEALTH = '/api/health';
  var TIMEOUT = 6000;

  var api = {
    checked: false,
    available: false,
    integrations: { database: false, brevo: false, openai: false, cloudinary: false },
    publicConfig: {},
    adminLogin: false
  };

  function hasFetch() { return typeof fetch === 'function'; }

  function withTimeout(promise, ms) {
    return new Promise(function (resolve, reject) {
      var done = false;
      var timer = setTimeout(function () {
        if (done) return;
        done = true;
        reject(new Error('timeout'));
      }, ms || TIMEOUT);
      promise.then(function (v) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        resolve(v);
      }, function (e) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        reject(e);
      });
    });
  }

  function post(url, body) {
    if (!hasFetch()) return Promise.resolve({ ok: false, status: 0, error: 'fetch is unavailable' });
    return withTimeout(
      fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(body || {})
      }).then(function (r) {
        return r.text().then(function (text) {
          var data = {};
          try { data = text ? JSON.parse(text) : {}; } catch (e) { data = { raw: text }; }
          return { ok: r.ok, status: r.status, data: data };
        });
      })
    ).catch(function (err) {
      return { ok: false, status: 0, error: String(err && err.message ? err.message : err) };
    });
  }

  /* Probe the backend once and cache the answer. */
  function probe() {
    if (api.checked) return Promise.resolve(api);
    if (!hasFetch()) { api.checked = true; return Promise.resolve(api); }
    return withTimeout(fetch(HEALTH, { headers: { accept: 'application/json' } }))
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        api.available = !!(data && data.server);
        api.integrations = (data && data.integrations) || api.integrations;
        api.publicConfig = (data && data.publicConfig) || {};
        api.adminLogin = !!(data && data.adminLogin);
        api.checked = true;
        return api;
      })
      .catch(function () {
        api.available = false;
        api.checked = true;
        return api;
      });
  }

  function ready(cb) {
    probe().then(function () { if (typeof cb === 'function') cb(api); });
  }

  /* ---- endpoints -------------------------------------------------------
     Each returns { ok, used:'server'|'skipped', data } and NEVER rejects,
     so callers can simply fall back when used !== 'server'.               */

  function signup(payload) {
    return probe().then(function () {
      if (!api.available) return { ok: false, used: 'skipped', reason: 'no backend' };
      return post('/api/auth/signup', payload).then(function (r) {
        return { ok: r.ok, used: 'server', status: r.status, data: r.data, error: r.error };
      });
    });
  }

  function sendEmail(payload) {
    return probe().then(function () {
      if (!api.available) return { ok: false, used: 'skipped', reason: 'no backend' };
      return post('/api/email/send', payload).then(function (r) {
        return { ok: r.ok, used: 'server', status: r.status, data: r.data, error: r.error };
      });
    });
  }

  function aiPayout(payload) {
    return probe().then(function () {
      if (!api.available) return { ok: false, used: 'skipped', reason: 'no backend' };
      return post('/api/checkout/ai-payout', payload).then(function (r) {
        return { ok: r.ok, used: 'server', status: r.status, data: r.data, error: r.error };
      });
    });
  }

  api.probe = probe;
  api.ready = ready;
  api.signup = signup;
  api.sendEmail = sendEmail;
  api.aiPayout = aiPayout;

  window.LadydeeAPI = api;

  /* Warm the probe up straight away so the first call is instant. */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { probe(); });
  else probe();
})();
