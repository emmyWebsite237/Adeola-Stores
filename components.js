/* ============================================================
   Ladydee Minimart Store — COMPONENT LOADER
   ------------------------------------------------------------
   Loads the shared header, footer and mobile bottom bar so they live in
   ONE file each instead of being duplicated across the 13 pages:

       components/header.html
       components/footer.html
       components/bottom-nav.html

   How it loads them:
     1. fetch('components/<name>.html') — used on any real host
        (CDN, GitHub Pages, Vercel, Netlify, or `python -m http.server`).
     2. If fetch is blocked (opening the files straight off disk with
        file://) it falls back to an INLINE copy of the same markup that
        is generated from components/*.html by build-components.js.

   >>> DO NOT hand-edit the INLINE block below — edit components/*.html
       then run:  node build-components.js
   ============================================================ */
(function () {
  'use strict';

  var MOUNTS = { 'header': 'site-header', 'footer': 'site-footer', 'bottom-nav': 'bottomNav' };
  var BASE = 'components/';

  /* >>> GENERATED:INLINE >>> */
  var INLINE = {
    "header": "<!-- ============================================================\n     Ladydee Minimart Store — SHARED HEADER COMPONENT\n     ------------------------------------------------------------\n     This is the ONE place the site header lives. Edit here and every\n     page updates. Tokens written as double-brace placeholders are filled\n     at runtime by app.js -> renderComponents() with live data (cart count,\n     signed-in user, store contact details, clean-URL hrefs).\n\n     Structure markup ONLY. No data, no logic. Icons are <span data-i=\"…\">\n     placeholders that the loader swaps for the real inline SVG.\n     ============================================================ -->\n<div class=\"topbar\" data-component=\"header\"><div class=\"wrap\">\n  <span class=\"topbar-msg\"><span data-i=\"truck\"></span> {{topbarMsg}}</span>\n  <span class=\"topbar-links\">\n    <a href=\"{{href.workflows}}\">Delivery &amp; returns</a>\n    <a href=\"tel:{{store.phoneHref}}\"><span data-i=\"phone\"></span> {{store.phone}}</a>\n  </span>\n</div></div>\n\n<header class=\"header\" id=\"siteHeader\"><div class=\"wrap\">\n  <button class=\"icon-btn menu-btn\" id=\"menuBtn\" aria-label=\"Open menu\" aria-expanded=\"false\"><span data-i=\"menu\"></span></button>\n\n  <a class=\"logo\" href=\"{{href.home}}\">\n    <span class=\"logo-mark\"><span data-i=\"basket\"></span></span>\n    <span class=\"logo-text\">Ladydee<small>Minimart Store</small></span>\n  </a>\n\n  <div class=\"search-wrap\" id=\"searchWrap\">\n    <form class=\"search\" id=\"searchForm\" role=\"search\" autocomplete=\"off\">\n      <span class=\"search-ico\"><span data-i=\"search\"></span></span>\n      <input type=\"search\" id=\"searchInput\" placeholder=\"Search rice, oil, noodles&#8230;\" aria-label=\"Search products\" value=\"{{searchValue}}\">\n      <button class=\"btn btn-primary btn-sm search-go\" type=\"submit\" aria-label=\"Search\">\n        <span class=\"search-go-ico\"><span data-i=\"search\"></span></span>\n        <span class=\"search-go-label\">Search</span>\n      </button>\n    </form>\n    <div class=\"search-drop\" id=\"searchDrop\" hidden></div>\n  </div>\n\n  <nav class=\"mainnav\" aria-label=\"Main\">{{nav}}</nav>\n\n  <div class=\"head-actions\">\n    <a class=\"icon-btn\" href=\"{{href.wishlist}}\" aria-label=\"Wishlist\"><span data-i=\"heart\"></span>\n      <span class=\"badge\" id=\"wishBadge\"{{wishBadgeHidden}}>{{wishCount}}</span></a>\n\n    <a class=\"icon-btn\" href=\"{{href.cart}}\" aria-label=\"Cart\"><span data-i=\"cart\"></span>\n      <span class=\"badge\" id=\"cartBadge\"{{cartBadgeHidden}}>{{cartCount}}</span></a>\n\n    {{accountArea}}\n  </div>\n</div>\n\n<div class=\"catbar\"><div class=\"wrap\">{{catBar}}</div></div>\n</header>\n\n<!-- mobile drawer -->\n<div class=\"drawer-scrim\" id=\"drawerScrim\" hidden></div>\n<aside class=\"drawer\" id=\"drawer\" aria-hidden=\"true\">\n  <div class=\"drawer-head\">\n    <a class=\"logo\" href=\"{{href.home}}\">\n      <span class=\"logo-mark\"><span data-i=\"basket\"></span></span>\n      <span class=\"logo-text\">Ladydee<small>Minimart Store</small></span>\n    </a>\n    <button class=\"icon-btn\" id=\"drawerClose\" aria-label=\"Close menu\"><span data-i=\"close\"></span></button>\n  </div>\n  <div class=\"drawer-body\">\n    <form class=\"search drawer-search\" id=\"drawerSearchForm\" role=\"search\">\n      <span class=\"search-ico\"><span data-i=\"search\"></span></span>\n      <input type=\"search\" id=\"drawerSearchInput\" placeholder=\"Search products&#8230;\" aria-label=\"Search products\">\n    </form>\n\n    <div class=\"drawer-sec\">\n      <span class=\"drawer-label\">Menu</span>\n      {{drawerLinks}}\n    </div>\n\n    <div class=\"drawer-sec\">\n      <span class=\"drawer-label\">Shop by category</span>\n      <div class=\"drawer-cats\">{{drawerCats}}</div>\n    </div>\n\n    <div class=\"drawer-sec drawer-help\">\n      <span class=\"drawer-label\">Need help?</span>\n      <a class=\"drawer-link\" href=\"tel:{{store.phoneHref}}\"><span data-i=\"phone\"></span> {{store.phone}}</a>\n      <a class=\"drawer-link\" href=\"mailto:{{store.email}}\"><span data-i=\"mail\"></span> {{store.email}}</a>\n    </div>\n  </div>\n</aside>\n",
    "footer": "<!-- ============================================================\n     Ladydee Minimart Store — SHARED FOOTER COMPONENT\n     ------------------------------------------------------------\n     The ONE place the site footer lives. Edit here and every page\n     updates — no need to touch the 13 HTML pages.\n\n     There is deliberately NO link to the admin console here: the staff\n     console is reachable only by typing its direct URL (/adeolaadaccess112).\n     ============================================================ -->\n<footer class=\"footer\" data-component=\"footer\"><div class=\"wrap\">\n  <div class=\"foot-grid\">\n\n    <div class=\"foot-brand\">\n      <a class=\"logo logo-light\" href=\"{{href.home}}\">\n        <span class=\"logo-mark\"><span data-i=\"basket\"></span></span>\n        <span class=\"logo-text\">Ladydee<small>Minimart Store</small></span>\n      </a>\n      <p>Everyday groceries, sealed and delivered across Nigeria. Rice, oil, noodles, household and baby essentials at fair prices.</p>\n      <div class=\"foot-social\">\n        <a href=\"#\" aria-label=\"Facebook\"><span data-i=\"facebook\"></span></a>\n        <a href=\"#\" aria-label=\"Instagram\"><span data-i=\"instagram\"></span></a>\n        <a href=\"#\" aria-label=\"X\"><span data-i=\"twitter\"></span></a>\n        <a href=\"#\" aria-label=\"WhatsApp\"><span data-i=\"whatsapp\"></span></a>\n      </div>\n    </div>\n\n    <div class=\"foot-col\"><h4>Shop</h4>{{footShop}}</div>\n\n    <div class=\"foot-col\"><h4>Account</h4>\n      <a href=\"{{href.account}}\">My account</a>\n      <a href=\"{{href.login}}\">Sign in</a>\n      <a href=\"{{href.signup}}\">Create account</a>\n      <a href=\"{{href.wishlist}}\">Wishlist</a>\n      <a href=\"{{href.cart}}\">Cart &amp; checkout</a>\n    </div>\n\n    <div class=\"foot-col\"><h4>Company</h4>\n      <a href=\"{{href.workflows}}\">How it works</a>\n      <a href=\"{{href.workflows}}\">Delivery &amp; returns</a>\n      <a href=\"{{href.workflows}}\">Integrations</a>\n      <a href=\"{{href.checkout}}\">Test checkout (Paystack)</a>\n    </div>\n\n    <div class=\"foot-col foot-contact\"><h4>Contact</h4>\n      <a href=\"tel:{{store.phoneHref}}\"><span data-i=\"phone\"></span> {{store.phone}}</a>\n      <a href=\"mailto:{{store.email}}\"><span data-i=\"mail\"></span> {{store.email}}</a>\n      <span><span data-i=\"mapPin\"></span> {{store.address}}</span>\n      <span><span data-i=\"clock\"></span> {{store.hours}}</span>\n    </div>\n\n  </div>\n\n  <div class=\"foot-bottom\">\n    <span>&copy; {{year}} Ladydee Minimart Store. Demo store &mdash; no real payments are processed.</span>\n    <span class=\"foot-pay\">{{payPills}}</span>\n  </div>\n</div></footer>\n",
    "bottom-nav": "<!-- ============================================================\n     Ladydee Minimart Store — SHARED MOBILE BOTTOM NAVIGATION\n     ------------------------------------------------------------\n     The ONE place the mobile one-thumb bottom bar lives. Shown only on\n     mobile widths (hidden by CSS on desktop). app.js -> renderComponents()\n     fills {{items}} with Search / Cart / Account, including the live cart\n     badge and the active-page highlight.\n     ============================================================ -->\n<nav class=\"bottom-nav\" data-component=\"bottom-nav\" aria-label=\"Quick navigation\">\n  <div class=\"bn-inner\">{{items}}</div>\n</nav>\n"
  };
  /* <<< GENERATED:INLINE <<< */

  /* Resolve the component base from where THIS script was loaded, not from
     a hard-coded path, so the loader works in the site root, inside a
     sub-folder, and from the CDN, without editing anything.

     components.js sits NEXT TO the components/ folder, so the base is the
     script's own directory plus components/. Both are tried, so a layout
     that keeps the files side by side still works. */
  function scriptBase() {
    var s = document.currentScript;
    if (!s) {
      var all = document.getElementsByTagName('script');
      for (var i = all.length - 1; i >= 0; i--) {
        if ((all[i].getAttribute('src') || '').indexOf('components.js') > -1) { s = all[i]; break; }
      }
    }
    if (!s) return './';
    try {
      var dir = new URL('.', new URL(s.getAttribute('src'), location.href)).pathname;
      return dir.charAt(dir.length - 1) === '/' ? dir : dir + '/';
    } catch (e) { return './'; }
  }
  var SCRIPT_DIR = scriptBase();
  var BASE = SCRIPT_DIR + 'components/';
  var BASE_FALLBACK = SCRIPT_DIR;
  var MOUNT_SEL = {
    'header': ['#site-header', '[data-component="header"]'],
    'footer': ['#site-footer', '[data-component="footer"]', 'footer.footer'],
    'bottom-nav': ['#bottomNav', 'nav.bottom-nav', '[data-component="bottom-nav"]']
  };

  function ensureMount(name) {
    var id = MOUNTS[name];
    if (!id) return null;
    var el = document.getElementById(id);
    if (el) return el;
    /* Fall back to any element already carrying a component selector, so a
       page that mounts a component differently still works. */
    var sels = MOUNT_SEL[name] || [];
    for (var i = 0; i < sels.length; i++) {
      el = document.querySelector(sels[i]);
      if (el) return el;
    }
    /* The bottom-nav mount is created for us so pages don't need a stub. */
    if (name !== 'bottom-nav') return null;
    el = document.createElement('div');
    el.id = id;
    document.body.appendChild(el);
    return el;
  }

  /* Very small sanity check: a component must look like markup and must
     actually carry at least one token, otherwise we treat it as missing
     and use the inline copy rather than injecting a blank header. */
  function looksValid(text) {
    if (!text) return false;
    var t = text.trim();
    if (t.length < 40) return false;
    if (t.indexOf('<') < 0) return false;
    if (t.indexOf('{{') < 0) return false;
    return true;
  }

  function fetchOne(base, name) {
    return fetch(base + name + '.html', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    });
  }

  /* Returns { tpl, src } - the markup and the URL it actually came from. */
  function source(name) {
    function accept(base) {
      return function (t) {
        if (!looksValid(t)) throw new Error('component looks empty');
        return { tpl: t, src: base + name + '.html' };
      };
    }
    return fetchOne(BASE, name)
      .then(accept(BASE))
      .catch(function () { return fetchOne(BASE_FALLBACK, name).then(accept(BASE_FALLBACK)); });
  }

  function inject(name) {
    var el = ensureMount(name);
    if (!el) return Promise.resolve(false);
    if (el.getAttribute('data-loaded') === '1') return Promise.resolve(true);

    function use(tpl, src) {
      el.innerHTML = tpl;
      /* Remember the exact text we injected so a re-render re-uses the FRESH
         markup we just fetched, not the possibly-stale generated INLINE copy.
         Edit components/*.html and the fetched file is authoritative; only
         file:// and offline loads fall back to the generated copy. */
      el.__raw = tpl;
      el.setAttribute('data-loaded', '1');
      el.setAttribute('data-component-source', src);
      return true;
    }

    var canFetch = (typeof fetch === 'function') && !(location.protocol === 'file:');
    if (!canFetch) {
      return Promise.resolve(INLINE[name] ? use(INLINE[name], 'inline') : false);
    }
    return source(name)
      .then(function (got) { return use(got.tpl, got.src); })
      .catch(function () {
        /* Network hiccup or file:// — fall back to the generated copy. */
        return INLINE[name] ? use(INLINE[name], 'inline') : false;
      });
  }

  /* Load the named components, then hand control back to app.js so it can
     fill the {{tokens}} with live data and wire up the interactive parts. */
  function load(names, done) {
    var list = (names && names.length) ? names : ['header', 'footer', 'bottom-nav'];
    var jobs = list.map(function (n) {
      return inject(n).catch(function () { return false; });
    });
    Promise.all(jobs).then(function (results) {
      if (typeof done === 'function') done(results);
    });
  }

  window.LadydeeComponents = {
    load: load,
    inject: inject,
    MOUNTS: MOUNTS,
    BASE: BASE,
    SCRIPT_DIR: SCRIPT_DIR,
    INLINE: INLINE
  };
})();
