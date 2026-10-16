/* ============================================================
   Ladydee Minimart Store — admin console
   Products CRUD · coupons · orders · live delivery board
   inventory · customers · delivery config · integrations
   Orders and products are client-side (localStorage); API keys are saved
   on the server through Admin → Integrations.
   ============================================================ */
(function () {
  'use strict';

  var S = window.Ladydee;

  var ADMIN_PASSWORD = 'ladydee2026';
  var K = {
    session: 'ladydee_admin_session',
    products: 'ladydee_admin_products',
    deleted: 'ladydee_admin_deleted'
  };

  /* ---------- product store (admin can add/edit/delete) ---------- */
  /* Delegates to the shared catalogue so the admin and the storefront always
     agree: seed products + admin uploads, minus anything deleted. */
  function readProducts() {
    return S.catalogue();
  }
  function saveProduct(p) {
    var custom = S.read(K.products, []) || [];
    var found = false;
    custom.forEach(function (x, i) { if (x.id === p.id) { custom[i] = p; found = true; } });
    if (!found) custom.push(p);
    S.write(K.products, custom);
  }
  function deleteProduct(id) {
    var custom = S.read(K.products, []) || [];
    custom = custom.filter(function (x) { return x.id !== id; });
    S.write(K.products, custom);
    var deleted = S.read(K.deleted, []) || [];
    if (deleted.indexOf(id) < 0) deleted.push(id);
    S.write(K.deleted, deleted);
  }

  /* ---------- helpers ---------- */
  function money(n) { return S.money(n); }
  function esc(s) { return S.esc(s); }
  function icon(n) { return S.icon(n); }
  function el(id) { return document.getElementById(id); }

  function stockClass(n) { return n <= 0 ? 'stock-out' : n <= 30 ? 'stock-low' : 'stock-ok'; }
  function stockPct(n) { return Math.max(3, Math.min(100, Math.round((n / 200) * 100))); }

  function orderRevenue(orders) {
    return orders.filter(function (o) { return o.status !== 'rejected' && o.status !== 'cancelled'; })
      .reduce(function (n, o) { return n + o.total; }, 0);
  }

  /* ---------- server sign-in helpers ---------- */
  var TOKEN_KEY = 'ladydee_admin_token';
  function getToken() { try { return sessionStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; } }
  function setToken(t) { try { if (t) sessionStorage.setItem(TOKEN_KEY, t); else sessionStorage.removeItem(TOKEN_KEY); } catch (e) {} }
  function hasToken() {
    var t = getToken();
    if (!t) return false;
    try { return JSON.parse(atob(t.split('.')[0].replace(/-/g, '+').replace(/_/g, '/'))).exp > Date.now(); } catch (e) { return false; }
  }
  /* true when the backend exists AND ADMIN_PASSWORD is set on it */
  function serverMode() { var a = window.LadydeeAPI; return !!(a && a.available && a.adminLogin); }
  function authHeaders() { return { 'content-type': 'application/json', accept: 'application/json', authorization: 'Bearer ' + getToken() }; }

  /* ---------- gate ---------- */
  function renderGate(server) {
    if (server === undefined) server = serverMode();
    el('adminRoot').innerHTML =
      '<div class="admin-gate"><div class="gate-card">' +
        '<span class="logo-mark">' + icon('lock') + '</span>' +
        '<h1>Staff portal</h1>' +
        '<p>Sign in to manage products, orders and deliveries.</p>' +
        (server ? '' : '<div class="demo-note">' + icon('info') + '<span><b>Demo password:</b> ' + ADMIN_PASSWORD + '</span></div>') +
        '<form class="auth-form" id="gateForm">' +
          '<div class="field"><label for="gatePw">Admin password</label>' +
            '<div class="pw-wrap"><input id="gatePw" type="password" placeholder="Enter password" autocomplete="current-password">' +
            '<button class="pw-toggle" type="button" id="gateToggle" aria-label="Show password">' + icon('eye') + '</button></div></div>' +
          '<button class="btn btn-primary btn-lg btn-block" type="submit">' + icon('logOut') + ' Sign in</button>' +
        '</form>' +
        '<p class="auth-alt"><a href="/">\u2190 Back to the store</a></p>' +
      '</div></div>';

    var pw = el('gatePw');
    el('gateToggle').addEventListener('click', function () {
      var t = pw.type === 'password';
      pw.type = t ? 'text' : 'password';
      this.innerHTML = icon(t ? 'eyeOff' : 'eye');
    });
    el('gateForm').addEventListener('submit', function (e) {
      e.preventDefault();
      if (server) {
        fetch('/api/admin/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password: pw.value }) })
          .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
          .then(function (res) {
            if (res.ok && res.j.token) { setToken(res.j.token); S.write(K.session, { at: Date.now() }); renderShell(); }
            else S.toast((res.j && res.j.error) || 'Sign-in failed', 'alert');
          })
          .catch(function () { S.toast('Could not reach the server', 'alert'); });
        return;
      }
      if (pw.value !== ADMIN_PASSWORD) { S.toast('Incorrect password', 'alert'); return; }
      S.write(K.session, { at: Date.now() });
      renderShell();
    });
  }

  /* ---------- shell ---------- */
  var tab = 'dashboard';
  var adminSearchTerm = '';

  function searchPlaceholder() {
    var labels = { products: 'products by name, category, size…', inventory: 'products, stock status…', orders: 'order code, customer, phone, address, item…', transactions: 'payment reference, customer, email, status…', deliveries: 'order code, customer, city…', coupons: 'coupon code, note, discount…', customers: 'name, email, phone, status…', dashboard: 'recent orders and dashboard data…' };
    return 'Search ' + (labels[tab] || 'this page') ;
  }

  function applyAdminSearch() {
    var root = el('adminMain');
    if (!root) return;
    var q = (adminSearchTerm || '').trim().toLowerCase();
    var selector = 'tbody tr, .board-card, .coupon, .alert-row';
    var items = Array.prototype.slice.call(root.querySelectorAll(selector));
    var visible = 0;
    items.forEach(function (item) {
      var match = !q || (item.textContent || '').toLowerCase().indexOf(q) !== -1;
      item.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    var status = el('adminSearchStatus');
    if (status) status.textContent = q ? (visible + ' matching item' + (visible === 1 ? '' : 's')) : 'Search this section to find records quickly';
    var input = el('adminDataSearch');
    if (input && input.value !== adminSearchTerm) input.value = adminSearchTerm;
  }

  function renderShell() {
    el('adminRoot').innerHTML =
      '<div class="admin-shell">' +
        '<aside class="admin-side">' +
          '<div class="as-brand"><span class="logo-mark" style="width:34px;height:34px;border-radius:10px">' + icon('store') + '</span>' +
            '<span><b>Ladydee Admin</b><small>Minimart Store</small></span></div>' +
          '<nav class="admin-nav" id="adminNav"></nav>' +
          '<div style="margin-top:18px;padding-top:16px;border-top:1px solid rgba(255,255,255,.1)">' +
            '<button class="admin-nav" style="display:block;width:100%"><span></span></button>' +
            '<a class="drawer-link" href="/" style="color:#a9c2b3;padding:10px 12px">' + icon('store') + ' View store</a>' +
            '<button class="drawer-link" id="adminLogout" style="color:#a9c2b3;width:100%;padding:10px 12px">' + icon('logOut') + ' Sign out</button>' +
          '</div>' +
        '</aside>' +
        '<main class="admin-main" id="adminMain"></main>' +
      '</div>';

    el('adminLogout').addEventListener('click', function () {
      localStorage.removeItem(K.session);
      setToken('');
      S.toast('Signed out of admin', 'logOut');
      renderGate();
    });

    renderNav();
    renderPanel();
  }

  function renderNav() {
    var orders = S.getOrders();
    var pending = orders.filter(function (o) { return o.status === 'placed'; }).length;
    var low = readProducts().filter(function (p) { return p.stock <= 30; }).length;
    var items = [
      ['dashboard', 'grid', 'Dashboard', ''],
      ['products', 'package', 'Products', ''],
      ['inventory', 'layers', 'Inventory', low],
      ['orders', 'clipboard', 'Orders', pending],
      ['transactions', 'creditCard', 'Transactions', ''],
      ['deliveries', 'truck', 'Live deliveries', ''],
      ['coupons', 'tag', 'Coupons', ''],
      ['customers', 'users', 'Customers', ''],
      ['delivery', 'route', 'Delivery &amp; fees', ''],
      ['integrations', 'plug', 'Integrations', ''],
      ['settings', 'store', 'Store details', '']
    ];
    el('adminNav').innerHTML = items.map(function (i) {
      return '<button type="button" data-tab="' + i[0] + '"' + (tab === i[0] ? ' class="on"' : '') + '>' +
        icon(i[1]) + '<span>' + i[2] + '</span>' + (i[3] ? '<span class="an-badge">' + i[3] + '</span>' : '') + '</button>';
    }).join('');
  }

  function head(title, sub, actions) {
    return '<div class="admin-head"><div><h1>' + title + '</h1><p>' + sub + '</p></div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap">' + (actions || '') + '</div></div>';
  }

  /* ---------- dashboard ---------- */
  function panelDashboard() {
    var orders = S.getOrders();
    var products = readProducts();
    var users = S.getUsers();
    var revenue = orderRevenue(orders);
    var pending = orders.filter(function (o) { return o.status === 'placed'; }).length;
    var low = products.filter(function (p) { return p.stock > 0 && p.stock <= 30; });
    var out = products.filter(function (p) { return p.stock <= 0; });
    var coupons = S.getCoupons();
    var redeemed = coupons.reduce(function (n, c) { return n + (c.used || 0); }, 0);

    var recent = orders.slice(0, 5).map(function (o) {
      return '<tr><td><b>' + esc(o.code) + '</b><br><small class="muted">' + S.fmtDate(new Date(o.date)) + '</small></td>' +
        '<td>' + esc((o.customer && o.customer.name) || '—') + '</td>' +
        '<td>' + (o.items || []).length + ' item' + ((o.items || []).length === 1 ? '' : 's') + '</td>' +
        '<td><span class="status-pill st-' + o.status + '">' + S.statusLabel(o.status) + '</span></td>' +
        '<td><b>' + money(o.total) + '</b></td></tr>';
    }).join('');

    var alerts = '';
    if (pending) alerts += '<div class="alert-row warn"><span class="alert-ico" style="color:var(--amber-dark)">' + icon('bell') + '</span>' +
      '<span><b>' + pending + ' order' + (pending === 1 ? '' : 's') + ' waiting to be confirmed</b><small>Review and approve them on the Orders tab.</small></span>' +
      '<span class="ar-right"><button class="btn btn-outline btn-sm" type="button" data-tab="orders">Review</button></span></div>';
    if (out.length) alerts += '<div class="alert-row crit"><span class="alert-ico" style="color:var(--coral)">' + icon('alert') + '</span>' +
      '<span><b>' + out.length + ' product' + (out.length === 1 ? '' : 's') + ' out of stock</b><small>' + out.slice(0, 3).map(function (p) { return esc(p.name); }).join(', ') + '</small></span>' +
      '<span class="ar-right"><button class="btn btn-outline btn-sm" type="button" data-tab="inventory">Restock</button></span></div>';
    if (low.length) alerts += '<div class="alert-row warn"><span class="alert-ico" style="color:var(--amber-dark)">' + icon('layers') + '</span>' +
      '<span><b>' + low.length + ' product' + (low.length === 1 ? '' : 's') + ' running low</b><small>30 units or fewer left in stock.</small></span>' +
      '<span class="ar-right"><button class="btn btn-outline btn-sm" type="button" data-tab="inventory">View</button></span></div>';

    return head('Dashboard', 'A live snapshot of the store.', '<button class="btn btn-outline btn-sm" type="button" data-tab="products">' + icon('plus') + ' Add product</button>') +
      '<div class="kpis">' +
        '<div class="kpi"><span class="kpi-ico" style="background:var(--green-soft);color:var(--green)">' + icon('wallet') + '</span><b>' + money(revenue) + '</b><small>Revenue (all orders)</small></div>' +
        '<div class="kpi"><span class="kpi-ico" style="background:var(--blue-soft);color:var(--blue)">' + icon('clipboard') + '</span><b>' + orders.length + '</b><small>Total orders</small></div>' +
        '<div class="kpi"><span class="kpi-ico" style="background:var(--amber-soft);color:var(--amber-dark)">' + icon('bell') + '</span><b>' + pending + '</b><small>Awaiting confirmation</small></div>' +
        '<div class="kpi"><span class="kpi-ico" style="background:var(--coral-soft);color:var(--coral)">' + icon('alert') + '</span><b>' + (low.length + out.length) + '</b><small>Stock alerts</small></div>' +
      '</div>' +
      '<div class="kpis">' +
        '<div class="kpi"><span class="kpi-ico" style="background:var(--green-soft);color:var(--green)">' + icon('package') + '</span><b>' + products.length + '</b><small>Products listed</small></div>' +
        '<div class="kpi"><span class="kpi-ico" style="background:var(--blue-soft);color:var(--blue)">' + icon('users') + '</span><b>' + users.length + '</b><small>Registered customers</small></div>' +
        '<div class="kpi"><span class="kpi-ico" style="background:var(--amber-soft);color:var(--amber-dark)">' + icon('tag') + '</span><b>' + coupons.length + '</b><small>Coupons created</small></div>' +
        '<div class="kpi"><span class="kpi-ico" style="background:var(--coral-soft);color:var(--coral)">' + icon('percent') + '</span><b>' + redeemed + '</b><small>Coupon redemptions</small></div>' +
      '</div>' +
      (alerts ? '<h3 style="font-size:1rem;margin:26px 0 14px">Needs attention</h3>' + alerts : '') +
      '<h3 style="font-size:1rem;margin:26px 0 14px">Recent orders</h3>' +
      '<div class="table-wrap"><div class="table-scroll"><table class="data"><thead><tr>' +
        '<th>Order</th><th>Customer</th><th>Items</th><th>Status</th><th>Total</th>' +
      '</tr></thead><tbody>' + (recent || '<tr><td colspan="5" class="muted">No orders yet.</td></tr>') + '</tbody></table></div></div>';
  }

  /* ---------- products ---------- */
  var editingProduct = null;
  var editingImages = [];   /* [{ url, isPrimary }] for the product form */

  /* ---------- product form (image upload + cover picker) ---------- */
  function productForm(p) {
    var isNew = !p.id;
    var tiles = editingImages.map(function (im, i) {
      return '<div class="upload-tile' + (im.isPrimary ? ' is-cover' : '') + '">' +
        (im.isPrimary ? '<span class="ut-cover">Primary</span>' : '') +
        '<button class="ut-remove" type="button" data-rmimg="' + i + '" aria-label="Remove image">' + icon('close') + '</button>' +
        '<img src="' + esc(im.url) + '" alt="Product image ' + (i + 1) + '">' +
        '<label class="ut-pick"><input type="radio" name="primaryImage" value="' + i + '"' + (im.isPrimary ? ' checked' : '') +
          ' data-cover="' + i + '"><span>Primary image</span></label>' +
      '</div>';
    }).join('');

    var drop = editingImages.length < 3
      ? '<label class="upload-drop"><input type="file" id="prFiles" accept="image/*" multiple>' + icon('plus') +
          '<span>Add image' + (editingImages.length ? '' : 's') + '</span><small>2\u20133 images \u00b7 JPG or PNG</small></label>'
      : '';

    return '<div class="panel" style="margin-bottom:20px"><div class="panel-head"><b>' + (isNew ? 'New product' : 'Edit \u2014 ' + esc(p.name)) + '</b>' +
      '<button class="btn btn-ghost btn-sm" type="button" id="cancelProduct">Cancel</button></div>' +
      '<div class="panel-body">' +
        '<div class="field full" style="margin-bottom:18px"><label>Product images</label>' +
          '<div class="upload-grid">' + tiles + drop + '</div>' +
          '<div class="upload-note">Select <b>2 to 3 images</b> from your device, then tick <b>Primary image</b> under the one that should be the cover in the grocery grid. ' +
            'Images upload to Cloudinary and the secure URLs are saved with the product.</div>' +
        '</div>' +
        '<div class="form-grid">' +
          '<div class="field full"><label for="prName">Product name</label><input id="prName" value="' + esc(p.name || '') + '" placeholder="Fresh Organic Strawberries"></div>' +
          '<div class="field"><label for="prCat">Category</label><select id="prCat">' +
            S.CATEGORIES.map(function (c) { return '<option value="' + c.id + '"' + (p.category === c.id ? ' selected' : '') + '>' + esc(c.name) + '</option>'; }).join('') +
          '</select></div>' +
          '<div class="field"><label for="prPrice">Price (\u20a6)</label><input id="prPrice" type="number" min="0" step="0.01" value="' + (p.price != null ? p.price : '') + '" placeholder="4500"></div>' +
          '<div class="field"><label for="prOld">Old price (\u20a6) \u2014 optional, makes it a deal</label><input id="prOld" type="number" min="0" step="0.01" value="' + (p.oldPrice || '') + '" placeholder="5000"></div>' +
          '<div class="field"><label for="prBadge">Badge</label><select id="prBadge">' +
            '<option value="">None</option><option value="bestseller"' + (p.badge === 'bestseller' ? ' selected' : '') + '>Bestseller</option><option value="new"' + (p.badge === 'new' ? ' selected' : '') + '>New</option></select></div>' +
          '<div class="field"><label for="prSize">Size label</label><input id="prSize" value="' + esc(p.size || '') + '" placeholder="5kg bag"></div>' +
          '<div class="field"><label for="prStock">Stock</label><input id="prStock" type="number" min="0" step="1" value="' + (p.stock != null ? p.stock : 100) + '"></div>' +
          '<div class="field full"><label style="display:flex;align-items:center;gap:8px;font-weight:600"><input type="checkbox" id="prFeatured"' + (p.featured ? ' checked' : '') + ' style="width:auto"> Show in \u201cPopular this week\u201d on the home page</label></div>' +
          '<div class="field full"><label for="prDesc">Description</label><textarea id="prDesc" rows="3" placeholder="What the customer is buying">' + esc(p.description || '') + '</textarea></div>' +
        '</div>' +
        '<div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">' +
          '<button class="btn btn-primary" type="button" id="saveProduct">' + icon('check') + ' ' + (isNew ? 'Create product' : 'Save changes') + '</button>' +
          '<span class="upload-note" id="uploadStatus" style="align-self:center;margin:0"></span>' +
        '</div>' +
      '</div></div>';
  }

  /* ---------- Cloudinary upload ---------- */
  function readAsDataURL(file) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () { resolve(fr.result); };
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }
  /* Uploads one file to Cloudinary (unsigned preset). Falls back to a local
     data URL when no cloud name / preset is configured, so the form still
     works end-to-end in demo mode. */
  function uploadToCloudinary(file) {
    var API = window.LadydeeAPI;
    var ready = (API && typeof API.probe === 'function') ? API.probe() : Promise.resolve(null);
    return ready.then(function (api) {
      /* Cloud name + unsigned preset are public values served by /api/health. */
      var cfg = (api && api.publicConfig && api.publicConfig.cloudinary) || {};
      if (!cfg.cloudName || !cfg.uploadPreset) {
        return readAsDataURL(file).then(function (d) { return { url: d, local: true }; });
      }
      var fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', cfg.uploadPreset);
      return fetch('https://api.cloudinary.com/v1_1/' + encodeURIComponent(cfg.cloudName) + '/image/upload', {
        method: 'POST', body: fd
      }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, body: j }; }); })
        .then(function (res) {
          if (res.ok && res.body && res.body.secure_url) return { url: res.body.secure_url };
          throw new Error((res.body && res.body.error && res.body.error.message) || ('HTTP ' + res.status));
        });
    });
  }

  function handleFiles(files) {
    var list = Array.prototype.slice.call(files || []).slice(0, 3 - editingImages.length);
    if (!list.length) return;
    var status = el('uploadStatus');
    if (status) status.textContent = 'Uploading ' + list.length + ' image' + (list.length === 1 ? '' : 's') + '\u2026';
    Promise.all(list.map(uploadToCloudinary)).then(function (results) {
      results.forEach(function (r) {
        editingImages.push({ url: r.url, isPrimary: editingImages.length === 0 });
      });
      if (!editingImages.some(function (i) { return i.isPrimary; }) && editingImages.length) editingImages[0].isPrimary = true;
      var local = results.some(function (r) { return r.local; });
      S.toast(local ? 'Cloudinary is not set up on the server, so images were kept in this browser only' : results.length + ' image' + (results.length === 1 ? '' : 's') + ' added', local ? 'alert' : 'checkCircle');
      renderPanel();
    }).catch(function (err) {
      S.toast('Upload failed: ' + err.message, 'alert');
      if (status) status.textContent = '';
    });
  }

  function panelProducts() {
    var products = readProducts();
    var rows = products.map(function (p) {
      return '<tr>' +
        '<td><div class="td-prod"><img src="' + p.image + '" alt=""><span><b>' + esc(p.name) + '</b><small>' + esc(p.size) + ' · ' + esc(S.catName(p.category)) + '</small></span></div></td>' +
        '<td><b>' + money(p.price) + '</b>' + (p.oldPrice ? '<br><small class="muted"><s>' + money(p.oldPrice) + '</s></small>' : '') + '</td>' +
        '<td><span class="pill ' + (p.stock <= 0 ? 'pill-bad' : p.stock <= 30 ? 'pill-warn' : 'pill-ok') + '">' + p.stock + ' in stock</span></td>' +
        '<td>' + S.stars(p.rating) + '<br><small class="muted">' + p.rating + ' · ' + p.reviewCount + ' reviews</small></td>' +
        '<td><div class="td-actions">' +
          '<button class="mini-btn" type="button" data-editprod="' + p.id + '" aria-label="Edit ' + esc(p.name) + '">' + icon('edit') + '</button>' +
          '<button class="mini-btn danger" type="button" data-delprod="' + p.id + '" aria-label="Delete ' + esc(p.name) + '">' + icon('trash') + '</button>' +
        '</div></td>' +
      '</tr>';
    }).join('');

    return head('Products', products.length + ' products in the catalogue.',
      '<button class="btn btn-primary btn-sm" type="button" id="newProduct">' + icon('plus') + ' Add product</button>') +
      (editingProduct ? productForm(editingProduct) : '') +
      '<div class="table-wrap"><div class="table-scroll"><table class="data"><thead><tr>' +
        '<th>Product</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table></div></div>';
  }

  /* ---------- inventory ---------- */
  function panelInventory() {
    var products = readProducts().slice().sort(function (a, b) { return a.stock - b.stock; });
    var low = products.filter(function (p) { return p.stock > 0 && p.stock <= 30; });
    var out = products.filter(function (p) { return p.stock <= 0; });

    var alerts = '';
    out.forEach(function (p) {
      alerts += '<div class="alert-row crit"><span class="alert-ico" style="color:var(--coral)">' + icon('alert') + '</span>' +
        '<span><b>' + esc(p.name) + ' — out of stock</b><small>' + esc(p.size) + ' · ' + esc(S.catName(p.category)) + '</small></span>' +
        '<span class="ar-right"><button class="btn btn-outline btn-sm" type="button" data-restock="' + p.id + '">Restock</button></span></div>';
    });
    low.forEach(function (p) {
      alerts += '<div class="alert-row warn"><span class="alert-ico" style="color:var(--amber-dark)">' + icon('layers') + '</span>' +
        '<span><b>' + esc(p.name) + ' — only ' + p.stock + ' left</b><small>Consider restocking soon.</small></span>' +
        '<span class="ar-right"><button class="btn btn-outline btn-sm" type="button" data-restock="' + p.id + '">Restock</button></span></div>';
    });

    var rows = products.map(function (p) {
      return '<tr>' +
        '<td><div class="td-prod"><img src="' + p.image + '" alt=""><span><b>' + esc(p.name) + '</b><small>' + esc(p.size) + '</small></span></div></td>' +
        '<td><b>' + p.stock + '</b><div class="stock-bar"><div class="stock-fill ' + stockClass(p.stock) + '" style="width:' + stockPct(p.stock) + '%"></div></div></td>' +
        '<td><span class="pill ' + (p.stock <= 0 ? 'pill-bad' : p.stock <= 30 ? 'pill-warn' : 'pill-ok') + '">' +
          (p.stock <= 0 ? 'Out of stock' : p.stock <= 30 ? 'Low' : 'Healthy') + '</span></td>' +
        '<td><div class="td-actions">' +
          '<button class="mini-btn" type="button" data-stockminus="' + p.id + '" aria-label="Decrease stock">' + icon('minus') + '</button>' +
          '<button class="mini-btn" type="button" data-stockplus="' + p.id + '" aria-label="Increase stock">' + icon('plus') + '</button>' +
          '<button class="mini-btn" type="button" data-restock="' + p.id + '" aria-label="Set stock">' + icon('edit') + '</button>' +
        '</div></td>' +
      '</tr>';
    }).join('');

    return head('Inventory', products.length + ' products · ' + out.length + ' out of stock · ' + low.length + ' low.',
      '<button class="btn btn-outline btn-sm" type="button" id="restockAll">' + icon('refresh') + ' Restock all low items</button>') +
      (alerts ? '<h3 style="font-size:1rem;margin:0 0 14px">Stock alerts</h3>' + alerts + '<h3 style="font-size:1rem;margin:26px 0 14px">All stock</h3>' : '') +
      '<div class="table-wrap"><div class="table-scroll"><table class="data"><thead><tr>' +
        '<th>Product</th><th>Units</th><th>Status</th><th>Adjust</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table></div></div>';
  }

  /* ---------- orders ---------- */
  function panelOrders() {
    var orders = S.getOrders();
    var pending = orders.filter(function (o) { return o.status === 'placed'; });
    var rows = orders.map(function (o) {
      var c = o.customer || {};
      return '<tr>' +
        '<td><b>' + esc(o.code) + '</b><br><small class="muted">' + S.fmtDate(new Date(o.date)) + '</small></td>' +
        '<td><b>' + esc(c.name || '—') + '</b><br><small class="muted">' + esc(c.phone || '') + '</small></td>' +
        '<td><small>' + esc(c.address || '') + '<br>' + esc(c.city || '') + '</small></td>' +
        '<td>' + (o.items || []).map(function (it) { return esc(it.name) + ' ×' + it.qty; }).join('<br>') + '</td>' +
        '<td><b>' + money(o.total) + '</b><br><small class="muted">' + esc(o.payment || '') + '</small></td>' +
        '<td><span class="status-pill st-' + o.status + '">' + S.statusLabel(o.status) + '</span></td>' +
        '<td><div class="td-actions">' +
          (o.status === 'placed'
            ? '<button class="mini-btn" type="button" data-approve="' + esc(o.code) + '" aria-label="Confirm order" title="Confirm">' + icon('check') + '</button>' +
              '<button class="mini-btn danger" type="button" data-reject="' + esc(o.code) + '" aria-label="Reject order" title="Reject">' + icon('close') + '</button>'
            : '<button class="mini-btn" type="button" data-advance="' + esc(o.code) + '" aria-label="Advance status" title="Advance status">' + icon('chevronRight') + '</button>') +
          '<button class="mini-btn" type="button" data-vieworder="' + esc(o.code) + '" aria-label="View order" title="View">' + icon('eye') + '</button>' +
        '</div></td>' +
      '</tr>';
    }).join('');

    return head('Orders', orders.length + ' orders · ' + pending.length + ' awaiting confirmation.',
      '<button class="btn btn-primary btn-sm" type="button" id="confirmAll">' + icon('check') + ' Confirm all pending</button>') +
      '<div class="table-wrap"><div class="table-scroll"><table class="data"><thead><tr>' +
        '<th>Order</th><th>Customer</th><th>Address</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th>' +
      '</tr></thead><tbody>' + (rows || '<tr><td colspan="7" class="muted">No orders yet.</td></tr>') + '</tbody></table></div></div>';
  }

  /* ---------- live deliveries board ---------- */
  function panelDeliveries() {
    var orders = S.getOrders();
    var cols = S.orderStatuses();
    var board = cols.map(function (st) {
      var list = orders.filter(function (o) { return o.status === st; });
      var cards = list.map(function (o) {
        var i = cols.indexOf(st);
        return '<div class="board-card">' +
          '<b>' + esc(o.code) + '</b>' +
          '<small>' + esc((o.customer && o.customer.name) || '—') + '</small>' +
          '<small>' + esc((o.customer && o.customer.city) || '') + ' · ' + esc(o.eta || '') + '</small>' +
          '<div class="bc-foot"><span class="bc-amt">' + money(o.total) + '</span>' +
            '<span class="bc-move">' +
              (i > 0 ? '<button type="button" data-move="' + esc(o.code) + '" data-dir="-1" aria-label="Move back">' + icon('chevronLeft') + '</button>' : '') +
              (i < cols.length - 1 ? '<button type="button" data-move="' + esc(o.code) + '" data-dir="1" aria-label="Move forward">' + icon('chevronRight') + '</button>' : '') +
            '</span></div>' +
        '</div>';
      }).join('');
      return '<div class="board-col"><div class="board-col-head"><b>' + S.statusLabel(st) + '</b>' +
        '<span class="bc-count">' + list.length + '</span></div>' +
        '<div class="board-col-body">' + (cards || '<div class="board-empty">Nothing here</div>') + '</div></div>';
    }).join('');

    /* timeline of the most recent active order */
    var active = orders.filter(function (o) { return o.status !== 'delivered' && o.status !== 'rejected' && o.status !== 'cancelled'; })[0] || orders[0];
    var timeline = '';
    if (active) {
      var idx = cols.indexOf(active.status);
      timeline = '<h3 style="font-size:1rem;margin:26px 0 14px">Tracking — ' + esc(active.code) + '</h3>' +
        '<div class="panel"><div class="panel-body"><div class="timeline">' +
        cols.map(function (st, i) {
          var done = i <= idx;
          return '<div class="tl-item"><div class="tl-rail"><span class="tl-dot" style="background:' + (done ? 'var(--green)' : 'var(--line)') + '"></span><span class="tl-line"></span></div>' +
            '<div class="tl-body"><b>' + S.statusLabel(st) + '</b><small>' +
            (i < idx ? 'Completed' : i === idx ? 'Current stage' : 'Pending') + '</small></div></div>';
        }).join('') + '</div></div></div>';
    }

    return head('Live deliveries', 'Move orders through the delivery pipeline.',
      '<button class="btn btn-outline btn-sm" type="button" id="advanceAll">' + icon('truck') + ' Advance all active</button>') +
      '<div class="board">' + board + '</div>' + timeline;
  }

  /* ---------- coupons ---------- */
  function panelCoupons() {
    var coupons = S.getCoupons();
    var cards = coupons.map(function (c) {
      var pct = Math.min(100, Math.round(((c.used || 0) / c.limit) * 100));
      var full = (c.used || 0) >= c.limit;
      var cls = !c.active ? 'off' : full ? 'full' : '';
      return '<div class="coupon ' + cls + '">' +
        '<div class="coupon-code">' + esc(c.code) + '</div>' +
        '<div class="coupon-val">' + c.value + '% off the order' + (c.note ? ' · ' + esc(c.note) : '') + '</div>' +
        '<div class="coupon-usage"><span>' + (c.used || 0) + ' of ' + c.limit + ' used</span>' +
          '<span>' + (full ? 'Limit reached' : (c.limit - (c.used || 0)) + ' left') + '</span></div>' +
        '<div class="coupon-track"><div class="coupon-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="coupon-actions">' +
          '<button class="btn btn-outline btn-sm" type="button" data-togglecoupon="' + esc(c.code) + '">' + (c.active ? 'Deactivate' : 'Activate') + '</button>' +
          '<button class="btn btn-outline btn-sm" type="button" data-editcoupon="' + esc(c.code) + '">' + icon('edit') + '</button>' +
          '<button class="btn btn-danger btn-sm" type="button" data-delcoupon="' + esc(c.code) + '">' + icon('trash') + '</button>' +
        '</div>' +
      '</div>';
    }).join('');

    return head('Coupons', coupons.length + ' coupons · percentage discounts with a usage limit.',
      '<button class="btn btn-primary btn-sm" type="button" id="newCoupon">' + icon('plus') + ' Create coupon</button>') +
      (editingCoupon ? couponForm(editingCoupon) : '') +
      '<div class="coupon-grid">' + (cards || '<p class="muted">No coupons yet.</p>') + '</div>';
  }

  var editingCoupon = null;

  function couponForm(c) {
    var isNew = !c.code;
    return '<div class="panel" style="margin-bottom:20px"><div class="panel-head"><b>' + (isNew ? 'New coupon' : 'Edit — ' + esc(c.code)) + '</b>' +
      '<button class="btn btn-ghost btn-sm" type="button" id="cancelCoupon">Cancel</button></div>' +
      '<div class="panel-body"><div class="form-grid">' +
        '<div class="field"><label for="cpCode">Coupon code</label><input id="cpCode" value="' + esc(c.code || '') + '" placeholder="WELCOME10" style="text-transform:uppercase"></div>' +
        '<div class="field"><label for="cpValue">Percentage discount (%)</label><input id="cpValue" type="number" min="1" max="100" value="' + (c.value != null ? c.value : 10) + '"></div>' +
        '<div class="field"><label for="cpLimit">Usage limit (max redemptions)</label><input id="cpLimit" type="number" min="1" value="' + (c.limit != null ? c.limit : 50) + '"></div>' +
        '<div class="field"><label for="cpNote">Internal note</label><input id="cpNote" value="' + esc(c.note || '') + '" placeholder="What is this for?"></div>' +
      '</div><div style="margin-top:18px;display:flex;gap:10px">' +
        '<button class="btn btn-primary" type="button" id="saveCoupon">' + icon('check') + ' ' + (isNew ? 'Create coupon' : 'Save changes') + '</button>' +
      '</div></div></div>';
  }

  /* ---------- customers ---------- */
  function panelCustomers() {
    var users = S.getUsers();
    var orders = S.getOrders();
    var rows = users.map(function (u) {
      var mine = orders.filter(function (o) { return o.customer && o.customer.email && o.customer.email.toLowerCase() === u.email.toLowerCase(); });
      var spent = mine.reduce(function (n, o) { return n + o.total; }, 0);
      return '<tr>' +
        '<td><div class="td-prod"><span class="acct-av" style="width:38px;height:38px;font-size:.9rem">' + esc((u.name || 'A').charAt(0).toUpperCase()) + '</span>' +
          '<span><b>' + esc(u.name) + '</b><small>' + esc(u.email) + '</small></span></div></td>' +
        '<td>' + esc(u.phone || '—') + '</td>' +
        '<td>' + mine.length + '</td>' +
        '<td><b>' + money(spent) + '</b></td>' +
        '<td><span class="pill ' + (u.verified ? 'pill-ok' : 'pill-warn') + '">' + (u.verified ? 'Verified' : 'Unverified') + '</span></td>' +
        '<td><small class="muted">' + S.fmtDate(new Date(u.createdAt)) + '</small></td>' +
      '</tr>';
    }).join('');

    return head('Customers', users.length + ' registered customers.',
      '<button class="btn btn-outline btn-sm" type="button" id="exportCustomers">' + icon('download') + ' Export CSV</button>') +
      '<div class="table-wrap"><div class="table-scroll"><table class="data"><thead><tr>' +
        '<th>Customer</th><th>Phone</th><th>Orders</th><th>Spent</th><th>Status</th><th>Joined</th>' +
      '</tr></thead><tbody>' + (rows || '<tr><td colspan="6" class="muted">No customers yet.</td></tr>') + '</tbody></table></div></div>';
  }

  /* ---------- delivery config ---------- */
  function panelDelivery() {
    var rules = S.getDeliveryRules();
    var zones = S.ZONES.map(function (z) {
      return '<tr><td><b>' + esc(z.name) + '</b><br><small class="muted">' + esc(z.eta) + '</small></td>' +
        '<td><input type="number" min="0" value="' + z.fee + '" data-zonefee="' + z.id + '" style="width:120px;padding:8px 10px;border:1.5px solid var(--line);border-radius:9px"></td>' +
        '<td><small class="muted">' + (z.fee === 0 ? 'Pickup — always free' : 'Base fee before discounts') + '</small></td></tr>';
    }).join('');

    var codes = Object.keys(rules.codes).map(function (code) {
      var c = rules.codes[code];
      return '<div class="setting-row"><span><b>' + esc(code) + '</b><small>' + esc(c.label) + '</small></span>' +
        '<button class="btn btn-danger btn-sm" type="button" data-delcode="' + esc(code) + '">' + icon('trash') + '</button></div>';
    }).join('');

    return head('Delivery &amp; fees', 'Set zone fees and the delivery discount rules.', '') +
      '<div class="settings-grid">' +
        '<div class="setting-card"><h3>Delivery discount rules</h3><p>These apply automatically at checkout.</p>' +
          '<div class="setting-row"><span><b>Free delivery over</b><small>Order subtotal threshold</small></span>' +
            '<input type="number" min="0" step="1000" value="' + rules.freeOver + '" id="ruleFreeOver" style="width:130px;padding:8px 10px;border:1.5px solid var(--line);border-radius:9px"></div>' +
          '<div class="setting-row"><span><b>Percentage off delivery</b><small>Applied to everyone when no other rule matches</small></span>' +
            '<input type="number" min="0" max="100" value="' + rules.percentOff + '" id="rulePercent" style="width:90px;padding:8px 10px;border:1.5px solid var(--line);border-radius:9px"></div>' +
          '<div class="setting-row"><span><b>Free delivery for members</b><small>Signed-in customers pay nothing</small></span>' +
            '<label class="switch"><input type="checkbox" id="ruleMember"' + (rules.memberFree ? ' checked' : '') + '><span class="switch-track"></span></label></div>' +
          '<div style="margin-top:16px"><button class="btn btn-primary" type="button" id="saveRules">' + icon('check') + ' Save rules</button></div>' +
        '</div>' +
        '<div class="setting-card"><h3>Delivery promo codes</h3><p>Codes customers can enter at checkout for a delivery discount.</p>' +
          (codes || '<p class="muted" style="font-size:.86rem">No delivery codes yet.</p>') +
          '<div class="form-grid" style="margin-top:16px">' +
            '<div class="field"><label for="dcCode">Code</label><input id="dcCode" placeholder="FREEDEL" style="text-transform:uppercase"></div>' +
            '<div class="field"><label for="dcType">Type</label><select id="dcType"><option value="free">Free delivery</option><option value="percent">Percentage off</option></select></div>' +
            '<div class="field"><label for="dcValue">Percent (if percentage)</label><input id="dcValue" type="number" min="1" max="100" value="50"></div>' +
          '</div>' +
          '<div style="margin-top:14px"><button class="btn btn-outline" type="button" id="addCode">' + icon('plus') + ' Add delivery code</button></div>' +
        '</div>' +
      '</div>' +
      '<h3 style="font-size:1rem;margin:26px 0 14px">Zone fees</h3>' +
      '<div class="table-wrap"><div class="table-scroll"><table class="data"><thead><tr>' +
        '<th>Zone</th><th>Fee (₦)</th><th>Notes</th>' +
      '</tr></thead><tbody>' + zones + '</tbody></table></div></div>' +
      '<div style="margin-top:16px"><button class="btn btn-primary" type="button" id="saveZones">' + icon('check') + ' Save zone fees</button></div>';
  }

  /* ---------- store details ---------- */
  function panelSettings() {
    var s = S.getStoreInfo();
    return head('Store details', 'Contact information shown across the storefront \u2014 footer, header and help areas.', '') +
      '<div class="settings-grid">' +
        '<div class="setting-card"><h3>Contact information</h3>' +
          '<p>Saved to localStorage and applied everywhere the store details appear. Leave a field blank to fall back to the default.</p>' +
          '<div class="form-grid">' +
            '<div class="field full"><label for="stName">Store name</label><input id="stName" value="' + esc(s.name) + '"></div>' +
            '<div class="field"><label for="stPhone">Phone number</label><input id="stPhone" value="' + esc(s.phone) + '" placeholder="0801 234 5678">' +
              '<span class="hint">Used for the click-to-call links.</span></div>' +
            '<div class="field"><label for="stEmail">Email address</label><input id="stEmail" type="email" value="' + esc(s.email) + '"></div>' +
            '<div class="field full"><label for="stAddress">Store address</label><input id="stAddress" value="' + esc(s.address) + '"></div>' +
            '<div class="field full"><label for="stHours">Working days &amp; hours</label><input id="stHours" value="' + esc(s.hours) + '" placeholder="Mon\u2013Sat, 8am \u2013 8pm"></div>' +
          '</div>' +
          '<div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">' +
            '<button class="btn btn-primary" type="button" id="saveStore">' + icon('check') + ' Save details</button>' +
            '<button class="btn btn-outline" type="button" id="resetStore">' + icon('refresh') + ' Reset to defaults</button>' +
          '</div>' +
        '</div>' +
        '<div class="setting-card"><h3>Live preview</h3><p>This is how the details render in the storefront footer.</p>' +
          '<div class="store-preview">' +
            '<div class="sp-row">' + icon('phone') + '<span>' + esc(s.phone) + '</span></div>' +
            '<div class="sp-row">' + icon('mail') + '<span>' + esc(s.email) + '</span></div>' +
            '<div class="sp-row">' + icon('mapPin') + '<span>' + esc(s.address) + '</span></div>' +
            '<div class="sp-row">' + icon('clock') + '<span>' + esc(s.hours) + '</span></div>' +
          '</div>' +
          '<p class="muted" style="font-size:.82rem;margin-top:14px">The admin console is not linked anywhere on the storefront \u2014 reach it only by typing <b>/adeolaadaccess112</b>.</p>' +
        '</div>' +
      '</div>';
  }

  /* ---------- panel router ---------- */
  function renderPanel() {
    var map = {
      dashboard: panelDashboard, products: panelProducts, inventory: panelInventory,
      orders: panelOrders, transactions: panelTransactions, deliveries: panelDeliveries, coupons: panelCoupons,
      customers: panelCustomers, delivery: panelDelivery, settings: panelSettings,
      integrations: panelIntegrations
    };
    el('adminMain').innerHTML =
      '<div class="admin-searchbar" role="search">' +
        '<span class="admin-search-icon">' + icon('search') + '</span>' +
        '<input id="adminDataSearch" type="search" value="' + esc(adminSearchTerm) + '" placeholder="' + esc(searchPlaceholder()) + '" aria-label="Search records on this admin page" autocomplete="off">' +
        '<kbd>/</kbd>' +
        '<button type="button" class="admin-search-clear" id="clearAdminSearch" aria-label="Clear search"' + (adminSearchTerm ? '' : ' hidden') + '>Clear</button>' +
      '</div>' +
      '<p class="admin-search-status" id="adminSearchStatus" aria-live="polite">Search this section to find records quickly</p>' +
      (map[tab] || panelDashboard)();
    renderNav();
    applyAdminSearch();
  }

  /* ---------- live admin data search ---------- */
  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'adminDataSearch') {
      adminSearchTerm = e.target.value || '';
      var clear = el('clearAdminSearch');
      if (clear) clear.hidden = !adminSearchTerm;
      applyAdminSearch();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !/INPUT|TEXTAREA|SELECT/.test((e.target && e.target.tagName) || '')) {
      var search = el('adminDataSearch');
      if (search) { e.preventDefault(); search.focus(); search.select(); }
    }
    if (e.key === 'Escape' && e.target && e.target.id === 'adminDataSearch') {
      adminSearchTerm = ''; e.target.value = '';
      var clear = el('clearAdminSearch'); if (clear) clear.hidden = true;
      applyAdminSearch();
    }
  });

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    if (!el('adminRoot') || !el('adminRoot').contains(e.target)) return;
    var t = e.target.closest('button, a'); if (!t) return;

    if (t.id === 'clearAdminSearch') {
      adminSearchTerm = '';
      var searchInput = el('adminDataSearch');
      if (searchInput) { searchInput.value = ''; searchInput.focus(); }
      t.hidden = true;
      applyAdminSearch();
      return;
    }

    if (t.hasAttribute('data-tab')) { tab = t.getAttribute('data-tab'); editingProduct = null; editingCoupon = null; renderPanel(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }

    /* products */
    if (t.id === 'newProduct') { editingProduct = { id: '', name: '', category: 'rice-grains', price: '', description: '' }; editingImages = []; renderPanel(); return; }
    if (t.id === 'cancelProduct') { editingProduct = null; editingImages = []; renderPanel(); return; }
    if (t.hasAttribute('data-editprod')) {
      var pid = t.getAttribute('data-editprod');
      editingProduct = JSON.parse(JSON.stringify(readProducts().filter(function (p) { return p.id === pid; })[0]));
      var imgs = (editingProduct.additionalImages || []).slice();
      if (editingProduct.primaryImage && imgs.indexOf(editingProduct.primaryImage) < 0) imgs.unshift(editingProduct.primaryImage);
      if (!imgs.length && editingProduct.image) imgs = [editingProduct.image];
      editingImages = imgs.map(function (u) { return { url: u, isPrimary: u === (editingProduct.primaryImage || editingProduct.image) }; });
      if (editingProduct.noImage) editingImages = []; /* placeholder is not a real image: start empty so the first upload becomes the cover */
      if (editingImages.length && !editingImages.some(function (i) { return i.isPrimary; })) editingImages[0].isPrimary = true;
      renderPanel(); return;
    }
    if (t.hasAttribute('data-rmimg')) {
      var ri = Number(t.getAttribute('data-rmimg'));
      var wasPrimary = editingImages[ri] && editingImages[ri].isPrimary;
      editingImages.splice(ri, 1);
      if (wasPrimary && editingImages.length) editingImages[0].isPrimary = true;
      renderPanel(); return;
    }
    if (t.hasAttribute('data-delprod')) {
      var did = t.getAttribute('data-delprod');
      var prod = readProducts().filter(function (p) { return p.id === did; })[0];
      if (confirm('Delete "' + (prod ? prod.name : did) + '"? This removes it from the store.')) {
        deleteProduct(did); S.toast('Product deleted', 'trash'); renderPanel();
      }
      return;
    }
    if (t.id === 'saveProduct') {
      var name = el('prName').value.trim();
      var price = Number(el('prPrice').value);
      if (!name) { S.toast('Product name is required', 'alert'); return; }
      if (!price || price <= 0) { S.toast('Enter a valid price', 'alert'); return; }
      if (!editingImages.length) { S.toast('Add at least one product image', 'alert'); return; }
      var primary = (editingImages.filter(function (i) { return i.isPrimary; })[0] || editingImages[0]).url;
      var extras = editingImages.map(function (i) { return i.url; }).filter(function (u) { return u !== primary; });
      var oldP = Number(el('prOld').value);
      var sv = el('prStock').value.trim();
      var stockVal = sv === '' ? 100 : Math.max(0, Math.floor(Number(sv)) || 0);
      var p = {
        id: editingProduct.id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString().slice(-4),
        /* required data shape */
        productName: name,
        primaryImage: primary,
        additionalImages: extras,
        /* storefront fields */
        name: name,
        size: el('prSize').value.trim() || editingProduct.size || 'Each',
        category: el('prCat').value,
        price: price,
        oldPrice: (oldP && oldP > price) ? oldP : null,
        stock: stockVal,
        featured: el('prFeatured').checked,
        image: primary,
        images: [primary].concat(extras),
        scene: editingProduct.scene || 'images/scene-warehouse.png',
        badge: el('prBadge').value || null,
        short: (el('prDesc').value.trim() || name).slice(0, 90),
        description: el('prDesc').value.trim(),
        rating: editingProduct.rating != null ? editingProduct.rating : 4.5,
        reviewCount: editingProduct.reviewCount || 0,
        features: editingProduct.features && editingProduct.features.length ? editingProduct.features : ['Sealed packaging', 'Quality checked'],
        specs: editingProduct.specs && Object.keys(editingProduct.specs).length ? editingProduct.specs : { Packaging: 'Sealed' }
      };
      saveProduct(p);
      editingProduct = null;
      editingImages = [];
      S.toast('Product saved', 'checkCircle');
      renderPanel(); return;
    }

    /* inventory */
    if (t.hasAttribute('data-stockplus')) { adjustStock(t.getAttribute('data-stockplus'), 10); return; }
    if (t.hasAttribute('data-stockminus')) { adjustStock(t.getAttribute('data-stockminus'), -10); return; }
    if (t.hasAttribute('data-restock')) {
      var rid = t.getAttribute('data-restock');
      var rp = readProducts().filter(function (x) { return x.id === rid; })[0];
      var v = prompt('New stock level for "' + rp.name + '":', rp.stock);
      if (v === null) return;
      var n = Number(v);
      if (isNaN(n) || n < 0) { S.toast('Enter a valid number', 'alert'); return; }
      rp.stock = n; saveProduct(rp); S.toast('Stock updated', 'checkCircle'); renderPanel(); return;
    }
    if (t.id === 'restockAll') {
      var prods = readProducts();
      prods.forEach(function (p) { if (p.stock <= 30) { p.stock = 120; saveProduct(p); } });
      S.toast('Low-stock items restocked to 120', 'checkCircle'); renderPanel(); return;
    }

    /* orders */
    if (t.hasAttribute('data-approve')) { S.updateOrder(t.getAttribute('data-approve'), { status: 'confirmed' }); S.toast('Order confirmed', 'checkCircle'); renderPanel(); return; }
    if (t.hasAttribute('data-reject')) { S.updateOrder(t.getAttribute('data-reject'), { status: 'rejected' }); S.toast('Order rejected', 'alert'); renderPanel(); return; }
    if (t.hasAttribute('data-advance')) { advanceOrder(t.getAttribute('data-advance'), 1); return; }
    if (t.id === 'confirmAll') {
      var n2 = 0;
      S.getOrders().forEach(function (o) { if (o.status === 'placed') { S.updateOrder(o.code, { status: 'confirmed' }); n2++; } });
      S.toast(n2 + ' order' + (n2 === 1 ? '' : 's') + ' confirmed', 'checkCircle'); renderPanel(); return;
    }
    if (t.hasAttribute('data-vieworder')) {
      var code = t.getAttribute('data-vieworder');
      var o = S.getOrders().filter(function (x) { return x.code === code; })[0];
      if (o) showOrder(o);
      return;
    }

    /* deliveries */
    if (t.hasAttribute('data-move')) { advanceOrder(t.getAttribute('data-move'), Number(t.getAttribute('data-dir'))); return; }
    if (t.id === 'advanceAll') {
      var cols = S.orderStatuses();
      var n3 = 0;
      S.getOrders().forEach(function (o) {
        var i = cols.indexOf(o.status);
        if (i > -1 && i < cols.length - 1) { S.updateOrder(o.code, { status: cols[i + 1] }); n3++; }
      });
      S.toast(n3 + ' order' + (n3 === 1 ? '' : 's') + ' advanced', 'truck'); renderPanel(); return;
    }

    /* coupons */
    if (t.id === 'newCoupon') { editingCoupon = { code: '', value: 10, limit: 50, used: 0, active: true, note: '' }; renderPanel(); return; }
    if (t.id === 'cancelCoupon') { editingCoupon = null; renderPanel(); return; }
    if (t.hasAttribute('data-editcoupon')) {
      var cc = t.getAttribute('data-editcoupon');
      editingCoupon = JSON.parse(JSON.stringify(S.findCoupon(cc)));
      renderPanel(); return;
    }
    if (t.id === 'saveCoupon') {
      var code2 = el('cpCode').value.trim().toUpperCase();
      var val = Number(el('cpValue').value);
      var lim = Number(el('cpLimit').value);
      if (!code2) { S.toast('Enter a coupon code', 'alert'); return; }
      if (!val || val < 1 || val > 100) { S.toast('Discount must be 1–100%', 'alert'); return; }
      if (!lim || lim < 1) { S.toast('Usage limit must be at least 1', 'alert'); return; }
      var list = S.getCoupons();
      var existing = null;
      list.forEach(function (x) { if (x.code === code2) existing = x; });
      if (existing && existing.code !== editingCoupon.code) { S.toast('That code already exists', 'alert'); return; }
      var rec = { code: code2, type: 'percent', value: val, limit: lim, used: editingCoupon.used || 0, active: editingCoupon.active !== false, note: el('cpNote').value.trim() };
      var replaced = false;
      list.forEach(function (x, i) { if (x.code === editingCoupon.code) { list[i] = rec; replaced = true; } });
      if (!replaced) list.push(rec);
      S.setCoupons(list);
      editingCoupon = null;
      S.toast('Coupon saved', 'tag'); renderPanel(); return;
    }
    if (t.hasAttribute('data-togglecoupon')) {
      var tc = t.getAttribute('data-togglecoupon');
      var l = S.getCoupons();
      l.forEach(function (x) { if (x.code === tc) x.active = !x.active; });
      S.setCoupons(l); S.toast('Coupon updated', 'tag'); renderPanel(); return;
    }
    if (t.hasAttribute('data-delcoupon')) {
      var dc = t.getAttribute('data-delcoupon');
      if (confirm('Delete coupon ' + dc + '?')) {
        S.setCoupons(S.getCoupons().filter(function (x) { return x.code !== dc; }));
        S.toast('Coupon deleted', 'trash'); renderPanel();
      }
      return;
    }

    /* customers */
    if (t.id === 'exportCustomers') {
      var rows = [['Name', 'Email', 'Phone', 'Orders', 'Spent', 'Verified']];
      S.getUsers().forEach(function (u) {
        var mine = S.getOrders().filter(function (o) { return o.customer && o.customer.email && o.customer.email.toLowerCase() === u.email.toLowerCase(); });
        rows.push([u.name, u.email, u.phone || '', mine.length, mine.reduce(function (n, o) { return n + o.total; }, 0), u.verified ? 'yes' : 'no']);
      });
      var csv = rows.map(function (r) { return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(','); }).join('\n');
      var blob = new Blob([csv], { type: 'text/csv' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'ladydee-customers.csv';
      a.click();
      S.toast('Customer list exported', 'download'); return;
    }

    /* delivery config */
    if (t.id === 'saveRules') {
      var r = S.getDeliveryRules();
      r.freeOver = Number(el('ruleFreeOver').value) || 0;
      r.percentOff = Number(el('rulePercent').value) || 0;
      r.memberFree = el('ruleMember').checked;
      S.setDeliveryRules(r);
      S.toast('Delivery rules saved', 'checkCircle'); renderPanel(); return;
    }
    if (t.id === 'addCode') {
      var ccode = el('dcCode').value.trim().toUpperCase();
      if (!ccode) { S.toast('Enter a code', 'alert'); return; }
      var r2 = S.getDeliveryRules();
      var type = el('dcType').value;
      r2.codes[ccode] = type === 'free'
        ? { type: 'free', label: 'Free delivery' }
        : { type: 'percent', value: Number(el('dcValue').value) || 50, label: (Number(el('dcValue').value) || 50) + '% off delivery' };
      S.setDeliveryRules(r2);
      S.toast('Delivery code added', 'truck'); renderPanel(); return;
    }
    if (t.hasAttribute('data-delcode')) {
      var dcode = t.getAttribute('data-delcode');
      var r3 = S.getDeliveryRules();
      delete r3.codes[dcode];
      S.setDeliveryRules(r3);
      S.toast('Delivery code removed', 'trash'); renderPanel(); return;
    }
    if (t.id === 'saveZones') {
      document.querySelectorAll('[data-zonefee]').forEach(function (inp) {
        var zid = inp.getAttribute('data-zonefee');
        S.ZONES.forEach(function (z) { if (z.id === zid) z.fee = Number(inp.value) || 0; });
      });
      S.toast('Zone fees saved', 'checkCircle'); renderPanel(); return;
    }

    /* system status */
    if (t.id === 'checkBackend') {
      var outEl = el('backendResult');
      if (outEl) outEl.textContent = 'Checking\u2026';
      var API = window.LadydeeAPI;
      if (!API) { if (outEl) outEl.textContent = 'api-client.js is not loaded on this page.'; return; }
      API.probe().then(function (api) {
        if (!outEl) return;
        if (!api.available) {
          outEl.innerHTML = '<b>No backend found.</b> This build is running static-only \u2014 the site works, but server keys have no effect until it is deployed to a host with the /api functions.';
          return;
        }
        var i = api.integrations || {};
        var rows = [['database', 'Database'], ['brevoKey', 'BREVO_API_KEY'], ['brevoSender', 'BREVO_SENDER_EMAIL'], ['openai', 'OpenAI (optional)'], ['cloudinary', 'Cloudinary uploads']];
        outEl.innerHTML = 'Backend online — ' + rows.map(function (r) {
          return '<b>' + r[1] + '</b> ' + (i[r[0]] ? '✅' : '❌ not set');
        }).join(' · ');
      });
      return;
    }

    /* store details */
    if (t.id === 'saveStore') {
      S.setStoreInfo({
        name: el('stName').value.trim(),
        phone: el('stPhone').value.trim(),
        email: el('stEmail').value.trim(),
        address: el('stAddress').value.trim(),
        hours: el('stHours').value.trim()
      });
      S.mount('products'); /* re-render header/footer so the change shows immediately */
      S.toast('Store details saved', 'checkCircle'); renderPanel(); return;
    }
    if (t.id === 'resetStore') {
      S.setStoreInfo(S.STORE_DEFAULTS);
      S.mount('products');
      S.toast('Store details reset', 'refresh'); renderPanel(); return;
    }
  });

  /* ---------- file input (delegated: inputs are re-rendered) ---------- */
  document.addEventListener('change', function (e) {
    if (!el('adminRoot') || !el('adminRoot').contains(e.target)) return;
    var t = e.target;
    if (t.id === 'prFiles') { handleFiles(t.files); return; }
    if (t.hasAttribute('data-cover')) {
      var ci = Number(t.getAttribute('data-cover'));
      editingImages.forEach(function (im, i) { im.isPrimary = (i === ci); });
      renderPanel(); return;
    }
  });

  function adjustStock(id, delta) {
    var p = readProducts().filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    p.stock = Math.max(0, p.stock + delta);
    saveProduct(p);
    renderPanel();
  }

  function advanceOrder(code, dir) {
    var cols = S.orderStatuses();
    var o = S.getOrders().filter(function (x) { return x.code === code; })[0];
    if (!o) return;
    var i = cols.indexOf(o.status);
    if (i < 0) return;
    var next = Math.max(0, Math.min(cols.length - 1, i + dir));
    S.updateOrder(code, { status: cols[next] });
    S.toast(code + ' → ' + S.statusLabel(cols[next]), 'truck');
    renderPanel();
  }

  function showOrder(o) {
    var c = o.customer || {};
    var html = '<div class="modal-scrim" id="orderModal"><div class="modal" role="dialog" aria-modal="true">' +
      '<div class="modal-head"><div><span class="modal-kicker">Order</span><h3>' + esc(o.code) + '</h3></div>' +
        '<button class="icon-btn" id="orderModalClose" aria-label="Close">' + icon('close') + '</button></div>' +
      '<div class="modal-meta">' +
        '<span class="mm-row"><b>Customer</b> ' + esc(c.name || '—') + ' · ' + esc(c.phone || '') + '</span>' +
        '<span class="mm-row"><b>Address</b> ' + esc(c.address || '') + ', ' + esc(c.city || '') + '</span>' +
        '<span class="mm-row"><b>Payment</b> ' + esc(o.payment || '') + ' · <b>Status</b> ' + S.statusLabel(o.status) + '</span>' +
      '</div>' +
      '<div class="modal-body" style="padding:20px;background:var(--surface)">' +
        (o.items || []).map(function (it) {
          return '<div class="cart-line"><span class="cart-line-media"><img src="' + it.image + '" alt=""></span>' +
            '<span><b>' + esc(it.name) + '</b><small>' + esc(it.size) + ' × ' + it.qty + '</small></span>' +
            '<span class="amt">' + money(it.price * it.qty) + '</span></div>';
        }).join('') +
        '<div style="margin-top:16px">' +
          '<div class="sum-row"><span>Subtotal</span><b>' + money(o.subtotal) + '</b></div>' +
          (o.discount ? '<div class="sum-row"><span>Discount</span><b style="color:var(--green)">−' + money(o.discount) + '</b></div>' : '') +
          '<div class="sum-row"><span>Delivery</span><b>' + (o.deliveryFee ? money(o.deliveryFee) : 'Free') + '</b></div>' +
          '<div class="sum-row"><span>VAT</span><b>' + money(o.tax) + '</b></div>' +
          '<div class="sum-row total"><span>Total</span><b>' + money(o.total) + '</b></div>' +
        '</div>' +
      '</div>' +
      '<div class="modal-foot"><button class="btn btn-outline" id="orderModalOk" type="button">Close</button></div>' +
    '</div></div>';
    var host = document.createElement('div');
    host.innerHTML = html;
    document.body.appendChild(host.firstChild);
    function shut() { var m = el('orderModal'); if (m) m.remove(); }
    el('orderModalClose').addEventListener('click', shut);
    el('orderModalOk').addEventListener('click', shut);
    el('orderModal').addEventListener('click', function (e) { if (e.target.id === 'orderModal') shut(); });
  }

  /* ---------- transactions: test / live payment console ----------
     Lists every payment the store has taken, in any mode, side by side — so
     you can PROVE test payments work before flipping the store to live.
     Read-only by design: money state is only ever changed by the provider. */
  var txFilter = { status: '', mode: '', q: '' };
  var txData = null;

  function txPill(m) {
    var cls = m === 'live' ? 'live' : m === 'demo' ? 'demo' : 'test';
    var label = m === 'live' ? 'Live' : m === 'demo' ? 'Sandbox' : 'Test';
    return '<span class="tx-mode-pill ' + cls + '">' + label + '</span>';
  }
  function txStatusPill(s) {
    var cls = s === 'paid' ? 'paid' : s === 'failed' ? 'failed' : 'pending';
    return '<span class="tx-status-pill ' + cls + '">' + esc(s) + '</span>';
  }
  function txFmt(v) {
    if (!v) return '\u2014';
    try { return new Date(v).toLocaleString('en-NG', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' }); }
    catch (e) { return '\u2014'; }
  }

  function panelTransactions() {
    setTimeout(loadTransactions, 0);
    return head('Transactions', 'Every payment the store has taken \u2014 test, live and sandbox side by side. Prove payments work here before you switch the store to live.', '') +
      '<div id="txBody"><div class="muted" style="padding:20px">Loading\u2026</div></div>';
  }

  function loadTransactions() {
    var body = el('txBody');
    if (!body) return;
    if (!serverMode()) { body.innerHTML = intgNotice('The server (<code>/api</code>) cannot be reached, so transactions are unavailable. Open the deployed site to use this page.'); return; }
    if (!hasToken()) { renderGate(true); return; }
    var qs = [];
    if (txFilter.status) qs.push('status=' + encodeURIComponent(txFilter.status));
    if (txFilter.mode) qs.push('mode=' + encodeURIComponent(txFilter.mode));
    if (txFilter.q) qs.push('q=' + encodeURIComponent(txFilter.q));
    fetch('/api/admin/orders?limit=100' + (qs.length ? '&' + qs.join('&') : ''), { headers: authHeaders() })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, j: j }; }); })
      .then(function (res) {
        if (res.status === 401) { intgExpired(); return; }
        if (!res.j || !res.j.success) { body.innerHTML = intgNotice(esc((res.j && res.j.error) || 'Could not load transactions')); return; }
        txData = res.j;
        drawTransactions();
      })
      .catch(function () { body.innerHTML = intgNotice('Could not reach the server.'); });
  }

  function drawTransactions() {
    var body = el('txBody');
    if (!body || !txData) return;
    var pay = txData.payment || {};
    var t = txData.totals || {};
    var banner;
    if (!pay.usable) {
      banner = '<div class="tx-config-banner bad"><b>Online payment is not available right now.</b><ul>' +
        (pay.problems || []).map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></div>';
    } else if (pay.mode === 'live') {
      banner = '<div class="tx-config-banner ok"><b>Payments are LIVE.</b> Real cards are being charged and every paid order below moved real money.</div>';
    } else if (pay.mode === 'demo') {
      banner = '<div class="tx-config-banner warn"><b>Sandbox mode.</b> The whole checkout journey works but no money can move. Switch the mode to <b>test</b> to run real test payments, then to <b>live</b> when you are satisfied.</div>';
    } else {
      banner = '<div class="tx-config-banner ok"><b>Test mode \u2014 connected and working.</b> Payments run against the provider\u2019s test environment, so no real money moves. Complete a test purchase, confirm it lands below as <b>Paid</b>, then switch the mode to <b>live</b>.</div>';
    }

    var filters = '<div class="tx-modeswitch" style="margin-bottom:16px">' +
      [['', 'All modes'], ['test', 'Test'], ['live', 'Live'], ['demo', 'Sandbox']].map(function (m) {
        return '<button type="button" data-txmode="' + m[0] + '"' + (txFilter.mode === m[0] ? ' class="on"' : '') + '>' + m[1] + '</button>';
      }).join('') +
      [['', 'All'], ['paid', 'Paid'], ['pending', 'Pending'], ['failed', 'Failed']].map(function (m) {
        return '<button type="button" data-txstatus="' + m[0] + '"' + (txFilter.status === m[0] ? ' class="on"' : '') + '>' + m[1] + '</button>';
      }).join('') + '</div>';

    var rows = (txData.orders || []).map(function (o) {
      return '<tr><td><b class="mono">' + esc(o.reference) + '</b><br><small class="muted">' + txFmt(o.createdAt) + '</small></td>' +
        '<td>' + esc(o.customerName) + '<br><small class="muted">' + esc(o.email) + '</small></td>' +
        '<td>' + esc(o.city) + '<br><small class="muted">' + esc(o.phone) + '</small></td>' +
        '<td>' + txPill(o.paymentMode) + '</td>' +
        '<td>' + txStatusPill(o.status) + '</td>' +
        '<td><b>' + money(o.total) + '</b><br><small class="muted">' + o.itemCount + ' item' + (o.itemCount === 1 ? '' : 's') + '</small></td></tr>';
    }).join('');

    body.innerHTML = banner + filters +
      '<div class="kpis">' +
        '<div class="kpi"><span class="kpi-ico" style="background:var(--green-soft);color:var(--green)">' + icon('wallet') + '</span><b>' + money((Number(t.paid_kobo) || 0) / 100) + '</b><small>Paid value (all modes)</small></div>' +
        '<div class="kpi"><span class="kpi-ico" style="background:var(--green-soft);color:var(--green)">' + icon('checkCircle') + '</span><b>' + (t.orders_paid || 0) + '</b><small>Paid orders</small></div>' +
        '<div class="kpi"><span class="kpi-ico" style="background:var(--amber-soft);color:var(--amber-dark)">' + icon('clock') + '</span><b>' + (t.orders_pending || 0) + '</b><small>Pending</small></div>' +
        '<div class="kpi"><span class="kpi-ico" style="background:var(--coral-soft);color:var(--coral)">' + icon('alert') + '</span><b>' + (t.orders_failed || 0) + '</b><small>Failed / abandoned</small></div>' +
      '</div>' +
      '<h3 style="font-size:1rem;margin:26px 0 14px">Payments' + (pay.modeLabel ? ' \u00b7 ' + esc(pay.modeLabel) + ' mode' : '') + '</h3>' +
      '<div class="table-wrap"><div class="table-scroll"><table class="data"><thead><tr>' +
        '<th>Reference</th><th>Customer</th><th>Delivery</th><th>Mode</th><th>Status</th><th>Total</th>' +
      '</tr></thead><tbody>' + (rows || '<tr><td colspan="6" class="muted">No transactions yet. Complete a purchase to see it here.</td></tr>') + '</tbody></table></div></div>';

    var b = el('txBody');
    if (!b) return;
    b.querySelectorAll('[data-txmode]').forEach(function (btn) {
      btn.addEventListener('click', function () { txFilter.mode = btn.getAttribute('data-txmode'); loadTransactions(); });
    });
    b.querySelectorAll('[data-txstatus]').forEach(function (btn) {
      btn.addEventListener('click', function () { txFilter.status = btn.getAttribute('data-txstatus'); loadTransactions(); });
    });
  }

  /* ---------- integrations: every key in ONE tab, saved on the server ---------- */
  var INTG = [
    { id: 'email', title: 'Email \u2014 Brevo', note: 'Order confirmations, verification and password-reset emails. In Brevo: SMTP & API \u2192 API Keys, and verify your sender under Senders.', fields: [
      ['brevo_api_key', 'Brevo API key', 'secret', 'xkeysib-\u2026'],
      ['brevo_sender_email', 'Sender email (verified in Brevo)', 'text', 'orders@yourdomain.com'],
      ['brevo_sender_name', 'Sender name', 'text', 'Ladydee Minimart Store'],
      ['brevo_reply_to', 'Reply-to email', 'text', 'hello@yourdomain.com'] ] },
    { id: 'images', title: 'Product images \u2014 Cloudinary', note: 'Used by the product form. The cloud name and the unsigned upload preset are public values (the preset can only upload).', fields: [
      ['cloudinary_cloud_name', 'Cloud name', 'text', 'your-cloud-name'],
      ['cloudinary_upload_preset', 'Unsigned upload preset', 'text', 'ladydee_products'] ] },
    { id: 'ai', title: 'AI basket review \u2014 OpenAI (optional)', note: 'Checkout works without it.', fields: [
      ['openai_api_key', 'OpenAI API key', 'secret', 'sk-\u2026'],
      ['openai_model', 'Model', 'text', 'gpt-4o-mini'] ] },
    { id: 'pay', title: 'Payments \u2014 Paystack', note: 'These keys now power the real checkout. Set the mode to test while you verify payments, then change it to live when you are ready \u2014 nothing else needs to change. The mode and the key must agree, or checkout is stopped on purpose.', fields: [
      ['payment_mode', 'Payment mode', 'select', '', [['test', 'Test \u2014 no real money is taken (use while verifying)'], ['live', 'Live \u2014 real cards are charged'], ['demo', 'Sandbox \u2014 offline preview only, no provider']]],
      ['paystack_public_key', 'Public key', 'text', 'pk_live_\u2026'],
      ['paystack_secret_key', 'Secret key', 'secret', 'sk_live_\u2026'] ] },
    { id: 'site', title: 'Website', note: 'Used for links inside emails.', fields: [
      ['site_url', 'Site URL', 'text', 'https://your-site.vercel.app'] ] }
  ];
  var intg = null;

  function panelIntegrations() {
    setTimeout(loadIntegrations, 0);
    return head('Integrations', 'Enter every key and setting here, once. They are saved on the server, never in this browser.', '') +
      '<div id="intgBody"><div class="muted" style="padding:20px">Loading\u2026</div></div>';
  }

  function intgNotice(msg) { return '<div class="setting-card"><p style="margin:0">' + msg + '</p></div>'; }

  function postSettings(payload) {
    return fetch('/api/admin/settings', { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, j: j }; }); });
  }

  function intgExpired() { setToken(''); S.toast('Session expired, please sign in again', 'alert'); renderGate(true); }

  function refreshApi() { var A = window.LadydeeAPI; if (A) { A.checked = false; A.probe(); } }

  function loadIntegrations() {
    var body = el('intgBody');
    if (!body) return;
    if (!serverMode()) {
      var A = window.LadydeeAPI;
      body.innerHTML = intgNotice(A && A.available
        ? 'To use this page, add <code>ADMIN_PASSWORD</code> in Vercel (Settings \u2192 Environment Variables), redeploy, then sign out and sign in again with that password.'
        : 'The server (<code>/api</code>) cannot be reached. Open the deployed site on Vercel to use this page.');
      return;
    }
    if (!hasToken()) { renderGate(true); return; }
    fetch('/api/admin/settings', { headers: authHeaders() })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, j: j }; }); })
      .then(function (res) {
        if (res.status === 401) { intgExpired(); return; }
        if (!res.j || !res.j.success) { body.innerHTML = intgNotice(esc((res.j && res.j.error) || 'Could not load settings')); return; }
        intg = res.j;
        drawIntegrations();
      })
      .catch(function () { body.innerHTML = intgNotice('Could not reach the server.'); });
  }

  function srcBadge(key) {
    var s = intg.source && intg.source[key];
    return '<span class="intg-src">' + (s === 'admin' ? 'saved here' : s === 'env' ? 'from a server variable' : 'not set') + '</span>';
  }

  /* The payment verdict, shown right under the key fields: which mode is
     actually in force, whether checkout can start, and — when it cannot — why.
     No key value is ever shown. */
  function payStatusHTML() {
    var p = intg && intg.payment;
    if (!p) return '';
    var cls = !p.usable ? 'bad' : p.mode === 'live' ? 'ok' : 'warn';
    var head = !p.usable ? 'Online payment is NOT usable yet'
      : p.mode === 'live' ? 'LIVE — real cards will be charged'
      : p.mode === 'demo' ? 'Sandbox — no money can move'
      : 'Test mode — connected and safe';
    var lines = [];
    if (p.mode) {
      lines.push('Mode in force: <b>' + esc(p.modeLabel || p.mode) + '</b>' +
        (p.keyMode ? ' (the saved key is a ' + esc(p.keyMode) + ' key)' : ' (no Paystack key saved)'));
    }
    (p.problems || []).forEach(function (x) { lines.push('\u26a0 ' + esc(x)); });
    (p.warnings || []).forEach(function (x) { lines.push(esc(x)); });
    return '<div class="tx-config-banner ' + cls + '" style="margin-top:14px"><b>' + head + '</b><ul>' +
      lines.map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ul></div>';
  }

  function drawIntegrations() {
    var body = el('intgBody');
    if (!body || !intg) return;
    var warn = intg.dbReady ? '' :
      '<div class="deliv-note warn" style="margin-bottom:16px">' + icon('alert') +
      '<span>The database is not connected, so nothing can be saved yet. Add <code>DATABASE_URL</code> (your Neon connection string) in Vercel, then redeploy.</span></div>';

    var cards = INTG.map(function (g) {
      var fields = g.fields.map(function (f) {
        var key = f[0], input;
        if (f[2] === 'select') {
          var cur = String((intg.values && intg.values[key]) || '').toLowerCase();
          input = '<select id="intg_' + key + '">' + (f[4] || []).map(function (o) {
            return '<option value="' + o[0] + '"' + (cur === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
          }).join('') + '</select>';
        } else if (f[2] === 'secret') {
          var st = (intg.secrets && intg.secrets[key]) || {};
          input = '<input id="intg_' + key + '" type="password" autocomplete="new-password" placeholder="' +
            (st.set ? 'Saved (' + esc(st.preview) + ') \u2014 leave blank to keep' : esc(f[3])) + '">' +
            (st.set && intg.source[key] === 'admin' ? '<button class="btn btn-ghost btn-sm" type="button" data-intgclear="' + key + '" style="margin-top:6px">Remove saved key</button>' : '');
        } else {
          input = '<input id="intg_' + key + '" type="text" autocomplete="off" value="' + esc((intg.values && intg.values[key]) || '') + '" placeholder="' + esc(f[3]) + '">';
        }
        return '<div class="field"><label for="intg_' + key + '">' + f[1] + ' ' + srcBadge(key) + '</label>' + input + '</div>';
      }).join('');
      var test = g.id !== 'email' ? '' :
        '<div class="field" style="margin-top:14px"><label for="intg_test_to">Send a test email to (save first)</label>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap"><input id="intg_test_to" type="email" placeholder="you@example.com" style="flex:1;min-width:200px">' +
        '<button class="btn btn-outline" type="button" id="testEmail">Send test</button></div>' +
        '<div class="upload-note" id="testResult"></div></div>';
      var payStatus = g.id !== 'pay' ? '' : payStatusHTML();
      return '<div class="setting-card" style="margin-bottom:16px"><h3>' + g.title + '</h3><p>' + g.note + '</p><div class="form-grid">' + fields + '</div>' + test + payStatus + '</div>';
    }).join('');

    body.innerHTML = warn + cards +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:6px">' +
        '<button class="btn btn-primary" type="button" id="saveIntegrations"' + (intg.dbReady ? '' : ' disabled') + '>' + icon('check') + ' Save all</button>' +
        '<button class="btn btn-outline" type="button" id="checkBackend">' + icon('plug') + ' Check backend</button>' +
        '<span id="backendResult" class="muted" style="font-size:.85rem"></span>' +
      '</div>';

    el('saveIntegrations').addEventListener('click', saveIntegrations);
    el('testEmail').addEventListener('click', testEmail);
    body.querySelectorAll('[data-intgclear]').forEach(function (b) {
      b.addEventListener('click', function () {
        var key = b.getAttribute('data-intgclear');
        if (!window.confirm('Remove the saved key? Features that need it will stop working until you add it again.')) return;
        postSettings({ clear: [key] }).then(function (res) {
          if (res.status === 401) { intgExpired(); return; }
          if (res.j && res.j.success) { S.toast('Saved key removed', 'checkCircle'); refreshApi(); loadIntegrations(); }
          else S.toast((res.j && res.j.error) || 'Could not remove', 'alert');
        });
      });
    });
  }

  function saveIntegrations() {
    var values = {};
    INTG.forEach(function (g) { g.fields.forEach(function (f) { values[f[0]] = el('intg_' + f[0]).value; }); });
    var btn = el('saveIntegrations');
    btn.disabled = true;
    postSettings({ values: values }).then(function (res) {
      btn.disabled = false;
      if (res.status === 401) { intgExpired(); return; }
      if (res.j && res.j.success) { S.toast('Integrations saved', 'checkCircle'); refreshApi(); loadIntegrations(); }
      else S.toast((res.j && res.j.error) || 'Could not save', 'alert');
    }).catch(function () { btn.disabled = false; S.toast('Could not reach the server', 'alert'); });
  }

  function testEmail() {
    var out = el('testResult');
    var to = el('intg_test_to').value.trim();
    if (!to) { out.textContent = 'Enter an email address first.'; return; }
    out.textContent = 'Sending\u2026';
    postSettings({ action: 'test-email', to: to }).then(function (res) {
      if (res.status === 401) { intgExpired(); return; }
      var j = res.j || {};
      if (j.success) { out.textContent = 'Sent. Check the inbox (and spam) of ' + to + '.'; return; }
      out.textContent = (j.error || 'Failed') + (j.detail ? ' \u2014 Brevo says: ' + j.detail : '');
    }).catch(function () { out.textContent = 'Could not reach the server.'; });
  }

  /* ---------- boot ---------- */
  function boot() {
    S.mount('products');
    var A = window.LadydeeAPI;
    var ready = (A && typeof A.probe === 'function') ? A.probe() : Promise.resolve(null);
    ready.then(function () {
      var server = serverMode();
      if (server ? hasToken() : S.read(K.session, null)) renderShell();
      else renderGate(server);
    });
  }

  window.LadydeeAdmin = { boot: boot, readProducts: readProducts, saveProduct: saveProduct, deleteProduct: deleteProduct };
})();
