/* ============================================================
   Adeola Stores — PAYMENT CONFIGURATION
   ============================================================================
   ★★★  THIS IS THE ONE PLACE THAT DECIDES TEST vs LIVE  ★★★
   ----------------------------------------------------------------------------
   One switch controls the entire payment integration. Nothing else in the
   codebase has to change to go live.

   ── HOW TO SWITCH TO LIVE (when you are ready) ──────────────────────────────
   In your hosting project (Vercel → Settings → Environment Variables):

        PAYMENT_MODE          = live
        PAYSTACK_SECRET_KEY   = sk_live_…      (your LIVE secret key)

   then redeploy.  That is the whole change. You can also set the mode from the
   admin console (Admin → Integrations → Payments) instead of the env var.

   ── HOW TO STAY IN TEST (the default) ───────────────────────────────────────
        PAYMENT_MODE          = test           (this is the default when unset)
        PAYSTACK_SECRET_KEY   = sk_test_…      (your TEST secret key)

   ── SANDBOX MODE (local previews only, never production) ────────────────────
        PAYMENT_MODE          = demo
   Runs the complete purchase journey with NO Paystack account and NO money
   moving at all. Used to demonstrate/verify the flow offline. It is refused
   whenever a real sk_live_ / sk_test_ key is present.

   ── SAFETY RAILS ───────────────────────────────────────────────────────────
   The mode and the key must AGREE, or checkout refuses to start:
     • mode=live + a sk_test_ key  → refused (you cannot accidentally go live
                                      with a test key and see everything pass)
     • mode=test + a sk_live_ key  → refused (you cannot accidentally charge a
                                      real card while you think you are testing)
   This is the one mistake that costs real money, so it is a hard stop.

   The mode is read on the SERVER only. No key and no secret is ever sent to
   the browser — /api/health exposes only the mode name and readiness flags.
   ============================================================================ */

/* Where the mode comes from, in priority order:
   1. the saved setting (Admin → Integrations → Payments)
   2. the PAYMENT_MODE environment variable
   3. DEFAULT_MODE                                                             */
export const MODE_SETTING = 'payment_mode';
export const MODE_ENV = 'PAYMENT_MODE';
export const MODES = ['test', 'live', 'demo'];
export const DEFAULT_MODE = 'test';

export const LIVE_KEY_PREFIX = 'sk_live_';
export const TEST_KEY_PREFIX = 'sk_test_';

/* ---------- tiny helpers ---------- */
function clean(v) { return String(v == null ? '' : v).trim(); }

/* Which mode does the operator ASK for? */
export function requestedMode(settings) {
  const saved = clean(settings && settings[MODE_SETTING]).toLowerCase();
  if (MODES.indexOf(saved) > -1) return saved;
  const env = clean(process.env[MODE_ENV]).toLowerCase();
  if (MODES.indexOf(env) > -1) return env;
  return DEFAULT_MODE;
}

/* Which mode does the SECRET KEY belong to? '' when it is not a Paystack key. */
export function modeFromKey(secret) {
  const k = clean(secret);
  if (k.indexOf(LIVE_KEY_PREFIX) === 0) return 'live';
  if (k.indexOf(TEST_KEY_PREFIX) === 0) return 'test';
  return '';
}

export function modeLabel(mode) {
  if (mode === 'live') return 'Live';
  if (mode === 'demo') return 'Sandbox (no money moves)';
  return 'Test';
}

export function modeIsPublic(mode) { return mode !== 'demo'; }

/* ============================================================================
   resolvePayment — the single source of truth for the checkout routes.
   Returns everything the server needs plus a plain-language verdict.
   `settings` is the object from lib/settings.js getSettings().
   ============================================================================ */
export function resolvePayment(settings) {
  const secretKey = clean(settings && settings.paystack_secret_key);
  const publicKey = clean(settings && settings.paystack_public_key);
  const requested = requestedMode(settings);
  const keyMode = modeFromKey(secretKey);

  const problems = [];
  const warnings = [];

  /* ---------- demo / sandbox ---------- */
  if (requested === 'demo') {
    if (keyMode) {
      problems.push('PAYMENT_MODE is set to "demo" but a real Paystack key (' +
        (keyMode === 'live' ? LIVE_KEY_PREFIX : TEST_KEY_PREFIX) + '…) is configured. ' +
        'Remove the key or switch PAYMENT_MODE back to "' + keyMode + '" — sandbox mode is for offline previews only.');
      return verdict('demo', requested, secretKey, publicKey, keyMode, false, problems, warnings);
    }
    warnings.push('Sandbox mode: the full purchase journey works but no money can move. Never use this in production.');
    return verdict('demo', requested, secretKey, publicKey, keyMode, true, problems, warnings);
  }

  /* ---------- test / live ---------- */
  if (!secretKey) {
    problems.push('No Paystack secret key is configured. Add PAYSTACK_SECRET_KEY in your hosting environment variables (or save it in Admin → Integrations → Payments).');
    return verdict(requested, requested, secretKey, publicKey, keyMode, false, problems, warnings);
  }
  if (!keyMode) {
    problems.push('The configured Paystack secret key does not look like a Paystack key — it should start with ' +
      TEST_KEY_PREFIX + '… or ' + LIVE_KEY_PREFIX + '….');
    return verdict(requested, requested, secretKey, publicKey, keyMode, false, problems, warnings);
  }
  if (requested === 'live' && keyMode === 'test') {
    problems.push('PAYMENT_MODE is set to "live" but the configured secret key is a TEST key (' + TEST_KEY_PREFIX +
      '…). Checkout is stopped so you never mistake a test run for a live one. Set a ' + LIVE_KEY_PREFIX +
      ' key, or switch PAYMENT_MODE back to "test".');
    return verdict('test', requested, secretKey, publicKey, keyMode, false, problems, warnings);
  }
  if (requested === 'test' && keyMode === 'live') {
    problems.push('PAYMENT_MODE is set to "test" but the configured secret key is a LIVE key (' + LIVE_KEY_PREFIX +
      '…). Checkout is stopped so a real card can never be charged while you believe you are testing. Set a ' +
      TEST_KEY_PREFIX + ' key, or switch PAYMENT_MODE to "live".');
    return verdict('live', requested, secretKey, publicKey, keyMode, false, problems, warnings);
  }

  if (keyMode === 'live') warnings.push('Payments are LIVE — real cards will be charged.');
  if (!publicKey) warnings.push('No Paystack public key saved. This is fine — hosted checkout never needs it in the browser.');

  return verdict(keyMode, requested, secretKey, publicKey, keyMode, true, problems, warnings);
}

function verdict(mode, requested, secretKey, publicKey, keyMode, usable, problems, warnings) {
  return {
    mode: mode,                       /* the mode actually in force              */
    requestedMode: requested,         /* what the operator asked for             */
    keyMode: keyMode,                 /* what the key says it is, or ''          */
    secretKey: secretKey,             /* SERVER ONLY — never serialise this       */
    publicKey: publicKey,
    usable: usable,                   /* may checkout start?                     */
    live: usable && mode === 'live',
    test: usable && mode === 'test',
    demo: usable && mode === 'demo',
    problems: problems,
    warnings: warnings
  };
}

/* The safe, browser-facing view (no keys). Used by /api/health and the admin. */
export function publicPaymentStatus(pay) {
  return {
    mode: pay.mode,
    modeLabel: modeLabel(pay.mode),
    requestedMode: pay.requestedMode,
    keyMode: pay.keyMode,
    usable: pay.usable,
    live: !!pay.live,
    test: !!pay.test,
    demo: !!pay.demo,
    secretKeySet: !!pay.secretKey,
    problems: pay.problems.slice(),
    warnings: pay.warnings.slice()
  };
}
