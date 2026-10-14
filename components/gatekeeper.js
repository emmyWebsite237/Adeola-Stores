/* ============================================================
   Ladydee Minimart Store — OPTIONAL shared gatekeeper
   ------------------------------------------------------------
   NOT enabled by default. No page ships data-guard-page, so the site
   behaves exactly as it always has: cart, checkout, account and wishlist
   are all reachable.

   It is here so you have ONE place to enforce a sign-in rule instead of
   pasting the same guard into four pages. To switch it on, pick the level
   on <html> and add this line to that page's <head> (before </head>):

     data-guard-page="protected"   → must be signed in
     data-guard-page="payout"      → must be signed in AND email-verified
     (absent / "public")           → nothing happens

     <script src="components/gatekeeper.js?v=10"></script>

   WHICH PAGES YOU GATE IS YOUR CALL. Recommended starter set:
     account.html    protected
     checkout.html   payout
   cart.html and wishlist.html are usually better left open — a guest can
   fill a basket, and only the checkout asks them to sign in.

   Redirects always resolve the SIBLING file (login.html next to this
   page), never an absolute /login, so it works when the site is served
   from a sub-path as well as from a domain root.

   NOTE: this is a UX gate, not a security boundary. Anything genuinely
   private has to be enforced by the server — see the /api routes.
   ============================================================ */
(function () {
  'use strict';

  var html = document.documentElement;
  var guard = html.getAttribute('data-guard-page');
  if (!guard || guard === 'public' || guard === 'none') return;

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function parse(key, fallback) {
    try { var v = read(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }

  var session = parse('ladydee_session', null) || read('ladydee_session') || read('ld_auth_session');
  if (!session) session = parse('ld_auth_session', null);
  if (!session) session = null;
  var sessionEmail = (session && session.email) ? session.email : null;

  /* Absolute clean URLs (/login) only exist on a host that rewrites them.
     This site may also be served from a sub-path (e.g. a CDN project URL),
     where /login would 404. Always resolve the SIBLING page instead, which
     exists wherever the site is served from. */
  function sibling(file) {
    var path = location.pathname;
    var cut = path.lastIndexOf('/');
    var dir = cut >= 0 ? path.slice(0, cut + 1) : './';
    return dir + file;
  }
  function loginHref(from) {
    var target = sibling('login.html');
    return target + (target.indexOf('?') > -1 ? '&' : '?') + 'redirect=' + encodeURIComponent(from);
  }

  if (!sessionEmail) {
    location.replace(loginHref(location.pathname));
    return;
  }

  if (guard === 'payout') {
    /* Verification lives on the user record in ladydee_users; a plain
       ld_user_verified flag is also accepted if one has been set. */
    var verified = read('ladydee_user_verified') === 'true';
    if (!verified && sessionEmail) {
      var users = parse('ladydee_users', []);
      for (var i = 0; i < users.length; i++) {
        if (users[i] && users[i].email === sessionEmail && users[i].verified === true) { verified = true; break; }
      }
    }
    if (!verified) {
      var page = (document.body && document.body.getAttribute('data-page')) || '';
      /* The <head> runs before <body> exists — fall back to the file name. */
      if (!page) page = (location.pathname.split('/').pop() || '').replace(/\.html?$/i, '');
      if (page === 'checkout' || page === 'cart') {
        alert('Account Action Required: please complete the email verification we sent you before checking out.');
        location.replace(sibling('account.html') + '?status=unverified');
      }
    }
  }
})();
