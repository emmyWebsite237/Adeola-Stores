/* ============================================================
   Ladydee Minimart Store — admin console
   Products CRUD · coupons · orders · live delivery board
   inventory · customers · delivery config · Brevi settings
   All state is client-side (localStorage) — demo only.
   ============================================================ */
(function () {
  'use strict';

  var S = window.Ladydee;
  var E = window.LadydeeEmail;

  var ADMIN_PASSWORD = 'ladydee2026';
  var K = {
    session: 'ladydee_admin_session',
    products: 'ladydee_admin_products',
    deleted: 'ladydee_admin_deleted'
  };

  /* ---------- product store (admin can add/edit/delete) ---------- */
  function readProducts() {
    var custom = S.read(K.products, null);
    var deleted = S.read(K.deleted, []);
    var base = S.PRODUCTS.filter(function (p) { return deleted.indexOf(p.id) < 0; });
    if (!custom) return base;
    /* custom holds overrides + new products */
    var map = {};
    base.forEach(function (p) { map[p.id] = p; });
    custom.forEach(function (p) { map[p.id] = p; });
    var out = [];
    Object.keys(map).forEach(function (k) { out.push(map[k]); });
    return out;
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

  /* ---------- gate ---------- */
  function renderGate() {
    el('adminRoot').innerHTML =
      '<div class="admin-gate"><div class="gate-card">' +
        '<span class="logo-mark">' + icon('lock') + '</span>' +
        '<h1>Staff portal</h1>' +
        '<p>Sign in to manage products, orders and deliveries.</p>' +
        '<div class="demo-note">' + icon('info') + '<span><b>Demo password:</b> ' + ADMIN_PASSWORD + '</span></div>' +
        '<form class="auth-form" id="gateForm">' +
          '<div class="field"><label for="gatePw">Admin password</label>' +
            '<div class="pw-wrap"><input id="gatePw" type="password" placeholder="Enter password" autocomplete="current-password">' +
            '<button class="pw-toggle" type="button" id="gateToggle" aria-label="Show password">' + icon('eye') + '</button></div></div>' +
          '<button class="btn btn-primary btn-lg btn-block" type="submit">' + icon('logOut') + ' Sign in</button>' +
        '</form>' +
        '<p class="auth-alt"><a href="/">← Back to the store</a></p>' +
      '</div></div>';

    var pw = el('gatePw');
    el('gateToggle').addEventListener('click', function () {
      var t = pw.type === 'password';
      pw.type = t ? 'text' : 'password';
      this.innerHTML = icon(t ? 'eyeOff' : 'eye');
    });
    el('gateForm').addEventListener('submit', function (e) {
      e.preventDefault();
      if (pw.value !== ADMIN_PASSWORD) { S.toast('Incorrect password', 'alert'); return; }
      S.write(K.session, { at: Date.now() });
      renderShell();
    });
  }

  /* ---------- shell ---------- */
  var tab = 'dashboard';

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
      ['deliveries', 'truck', 'Live deliveries', ''],
      ['coupons', 'tag', 'Coupons', ''],
      ['customers', 'users', 'Customers', ''],
      ['delivery', 'route', 'Delivery &amp; fees', ''],
      ['email', 'mail', 'Brevi email', '']
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

  function productForm(p) {
    var isNew = !p.id;
    return '<div class="panel" style="margin-bottom:20px"><div class="panel-head"><b>' + (isNew ? 'New product' : 'Edit — ' + esc(p.name)) + '</b>' +
      '<button class="btn btn-ghost btn-sm" type="button" id="cancelProduct">Cancel</button></div>' +
      '<div class="panel-body"><div class="form-grid">' +
        '<div class="field"><label for="prName">Product name</label><input id="prName" value="' + esc(p.name || '') + '" placeholder="Premium Parboiled Rice"></div>' +
        '<div class="field"><label for="prSize">Size / weight</label><input id="prSize" value="' + esc(p.size || '') + '" placeholder="10kg bag"></div>' +
        '<div class="field"><label for="prCat">Category</label><select id="prCat">' +
          S.CATEGORIES.map(function (c) { return '<option value="' + c.id + '"' + (p.category === c.id ? ' selected' : '') + '>' + esc(c.name) + '</option>'; }).join('') +
        '</select></div>' +
        '<div class="field"><label for="prStock">Stock (units)</label><input id="prStock" type="number" min="0" value="' + (p.stock != null ? p.stock : 0) + '"></div>' +
        '<div class="field"><label for="prPrice">Price (₦)</label><input id="prPrice" type="number" min="0" value="' + (p.price != null ? p.price : '') + '" placeholder="17500"></div>' +
        '<div class="field"><label for="prOld">Compare-at price (₦, optional)</label><input id="prOld" type="number" min="0" value="' + (p.oldPrice != null ? p.oldPrice : '') + '" placeholder="19000"></div>' +
        '<div class="field"><label for="prImage">Image path</label><input id="prImage" value="' + esc(p.image || 'images/rice-10kg.png') + '" placeholder="images/rice-10kg.png"><span class="hint">Relative to the site folder.</span></div>' +
        '<div class="field"><label for="prBadge">Badge</label><select id="prBadge">' +
          [['', 'None'], ['sale', 'Sale'], ['bestseller', 'Bestseller'], ['new', 'New']].map(function (b) {
            return '<option value="' + b[0] + '"' + ((p.badge || '') === b[0] ? ' selected' : '') + '>' + b[1] + '</option>';
          }).join('') + '</select></div>' +
        '<div class="field full"><label for="prShort">Short description</label><input id="prShort" value="' + esc(p.short || '') + '" placeholder="One line shown on cards"></div>' +
        '<div class="field full"><label for="prDesc">Full description</label><textarea id="prDesc" rows="3" placeholder="Longer description for the product page">' + esc(p.description || '') + '</textarea></div>' +
      '</div><div style="margin-top:18px;display:flex;gap:10px">' +
        '<button class="btn btn-primary" type="button" id="saveProduct">' + icon('check') + ' ' + (isNew ? 'Create product' : 'Save changes') + '</button>' +
      '</div></div></div>';
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

  /* ---------- brevi email ---------- */
  function panelEmail() {
    var cfg = E.getConfig();
    var live = E.isLive();
    var log = E.getLog();

    var logRows = log.map(function (e) {
      return '<div class="email-item"><span class="ei-ico">' + icon('mail') + '</span>' +
        '<span><b>' + esc(e.subject) + '</b><small>' + esc(e.to) + ' · ' + S.fmtDate(new Date(e.at)) + ' · ' + esc(e.template) + '</small></span>' +
        '<span class="ei-right"><span class="pill ' + (e.status === 'sent' ? 'pill-ok' : e.status === 'failed' ? 'pill-bad' : 'pill-warn') + '">' + esc(e.status) + '</span>' +
        '<button class="mini-btn" type="button" data-viewemail="' + e.id + '" aria-label="Preview email">' + icon('eye') + '</button></span></div>';
    }).join('');

    return head('Brevi email', 'Transactional email for order confirmations and account verification.', '') +
      '<div class="settings-grid">' +
        '<div class="setting-card"><h3>Connection</h3>' +
          '<p>Paste your Brevi API key to send real email. Without a key the store runs in demo mode and shows a preview instead.</p>' +
          '<div class="alert-row ' + (live ? '' : 'warn') + '" style="margin-bottom:18px">' +
            '<span class="alert-ico" style="color:' + (live ? 'var(--green)' : 'var(--amber-dark)') + '">' + icon(live ? 'checkCircle' : 'info') + '</span>' +
            '<span><b>' + (live ? 'Live mode — emails will be sent' : 'Demo mode — nothing is sent') + '</b>' +
            '<small>' + (live ? 'Your key is stored in this browser only.' : 'Add a key below to switch to live sending.') + '</small></span></div>' +
          '<div class="form-grid">' +
            '<div class="field full"><label for="brKey">Brevi API key</label>' +
              '<input id="brKey" type="password" value="' + esc(cfg.apiKey) + '" placeholder="xkeysib-…" autocomplete="off">' +
              '<span class="hint">Stored in localStorage. Never sent anywhere except the Brevi endpoint.</span></div>' +
            '<div class="field full"><label for="brEndpoint">API endpoint</label><input id="brEndpoint" value="' + esc(cfg.endpoint) + '"></div>' +
            '<div class="field"><label for="brSenderName">Sender name</label><input id="brSenderName" value="' + esc(cfg.senderName) + '"></div>' +
            '<div class="field"><label for="brSenderEmail">Sender email</label><input id="brSenderEmail" value="' + esc(cfg.senderEmail) + '"></div>' +
            '<div class="field full"><label for="brReplyTo">Reply-to email</label><input id="brReplyTo" value="' + esc(cfg.replyTo) + '"></div>' +
          '</div>' +
          '<div class="setting-row" style="margin-top:8px"><span><b>Email sending enabled</b><small>Turn off to force demo mode</small></span>' +
            '<label class="switch"><input type="checkbox" id="brEnabled"' + (cfg.enabled ? ' checked' : '') + '><span class="switch-track"></span></label></div>' +
          '<div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">' +
            '<button class="btn btn-primary" type="button" id="saveBrevi">' + icon('check') + ' Save settings</button>' +
            '<button class="btn btn-outline" type="button" id="testBrevi">' + icon('send') + ' Send test email</button>' +
          '</div>' +
        '</div>' +
        '<div class="setting-card"><h3>Email log</h3><p>Every email the store has prepared or sent from this browser.</p>' +
          '<div class="email-log">' + (logRows || '<p class="muted" style="font-size:.86rem">No emails yet. Place an order or sign up to generate one.</p>') + '</div>' +
          (log.length ? '<div style="margin-top:16px"><button class="btn btn-danger btn-sm" type="button" id="clearLog">' + icon('trash') + ' Clear log</button></div>' : '') +
        '</div>' +
      '</div>';
  }

  /* ---------- panel router ---------- */
  function renderPanel() {
    var map = {
      dashboard: panelDashboard, products: panelProducts, inventory: panelInventory,
      orders: panelOrders, deliveries: panelDeliveries, coupons: panelCoupons,
      customers: panelCustomers, delivery: panelDelivery, email: panelEmail
    };
    el('adminMain').innerHTML = (map[tab] || panelDashboard)();
    renderNav();
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    if (!el('adminRoot') || !el('adminRoot').contains(e.target)) return;
    var t = e.target.closest('button, a'); if (!t) return;

    if (t.hasAttribute('data-tab')) { tab = t.getAttribute('data-tab'); editingProduct = null; editingCoupon = null; renderPanel(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }

    /* products */
    if (t.id === 'newProduct') { editingProduct = { id: '', name: '', size: '', category: 'rice-grains', price: '', oldPrice: '', stock: 0, image: 'images/rice-10kg.png', badge: '', short: '', description: '', rating: 4.5, reviewCount: 0, features: [], specs: {} }; renderPanel(); return; }
    if (t.id === 'cancelProduct') { editingProduct = null; renderPanel(); return; }
    if (t.hasAttribute('data-editprod')) {
      var pid = t.getAttribute('data-editprod');
      editingProduct = JSON.parse(JSON.stringify(readProducts().filter(function (p) { return p.id === pid; })[0]));
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
      var p = {
        id: editingProduct.id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString().slice(-4),
        name: name,
        size: el('prSize').value.trim() || 'Each',
        category: el('prCat').value,
        price: price,
        oldPrice: el('prOld').value ? Number(el('prOld').value) : null,
        stock: Number(el('prStock').value) || 0,
        image: el('prImage').value.trim() || 'images/rice-10kg.png',
        scene: editingProduct.scene || 'images/scene-warehouse.png',
        badge: el('prBadge').value || null,
        short: el('prShort').value.trim(),
        description: el('prDesc').value.trim(),
        rating: editingProduct.rating || 4.5,
        reviewCount: editingProduct.reviewCount || 0,
        features: editingProduct.features && editingProduct.features.length ? editingProduct.features : ['Sealed packaging', 'Quality checked'],
        specs: editingProduct.specs && Object.keys(editingProduct.specs).length ? editingProduct.specs : { Size: el('prSize').value.trim() || 'Each', Packaging: 'Sealed' }
      };
      saveProduct(p);
      editingProduct = null;
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

    /* brevi */
    if (t.id === 'saveBrevi') {
      E.setConfig({
        apiKey: el('brKey').value.trim(),
        endpoint: el('brEndpoint').value.trim(),
        senderName: el('brSenderName').value.trim(),
        senderEmail: el('brSenderEmail').value.trim(),
        replyTo: el('brReplyTo').value.trim(),
        enabled: el('brEnabled').checked
      });
      S.toast('Brevi settings saved', 'checkCircle'); renderPanel(); return;
    }
    if (t.id === 'testBrevi') {
      var to = prompt('Send a test email to:', (S.currentUser() && S.currentUser().email) || 'you@example.com');
      if (!to) return;
      E.send({
        to: to, toName: 'Test recipient',
        subject: 'Ladydee test email',
        html: E.orderConfirmationHTML({
          code: 'LDM-TEST-0001', items: [{ name: 'Premium Parboiled Rice', size: '10kg bag', price: 17500, qty: 1 }],
          subtotal: 17500, discount: 0, deliveryFee: 0, deliveryDiscount: 2000, tax: 1313, total: 18813,
          coupon: null, payment: 'Card', eta: 'Same day',
          customer: { name: 'Test recipient', address: '27 Bourdillon Road', city: 'Lagos' }
        }),
        template: 'test'
      }).then(function (res) {
        if (res.demo) { S.toast('Demo mode — preview opened', 'mail'); E.showPreview(res.entry); }
        else if (res.ok) S.toast('Test email sent', 'mail');
        else S.toast('Send failed: ' + (res.error || res.status), 'alert');
        renderPanel();
      });
      return;
    }
    if (t.hasAttribute('data-viewemail')) {
      var eid = t.getAttribute('data-viewemail');
      var entry = E.getLog().filter(function (x) { return x.id === eid; })[0];
      if (entry) E.showPreview(entry);
      return;
    }
    if (t.id === 'clearLog') { E.clearLog(); S.toast('Email log cleared', 'trash'); renderPanel(); return; }
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

  /* ---------- boot ---------- */
  function boot() {
    S.mount('products');
    if (S.read(K.session, null)) renderShell();
    else renderGate();
  }

  window.LadydeeAdmin = { boot: boot, readProducts: readProducts, saveProduct: saveProduct, deleteProduct: deleteProduct };
})();
