/* ============================================================
   Adeola Stores — server-side order engine
   ----------------------------------------------------------------------------
   ONE place that owns the store_orders table, the reference format, the
   server-side price calculation and the order status vocabulary. Every
   checkout route (Paystack, sandbox, admin) goes through here, so an order
   looks the same no matter how it was paid for.

   Prices are ALWAYS recalculated from lib/store-catalog.js — the browser is
   never trusted with a price.
   ============================================================ */
import crypto from 'node:crypto';
import { db } from './settings.js';
import { STORE_CATALOG } from './store-catalog.js';

export const CURRENCY = 'NGN';
export const MAX_ITEMS = 40;
export const MAX_QTY = 99;

/* Delivery: a flat DELIVERY_FEE_NGN override when set, otherwise free at or
   above the threshold and a flat fee below it. (Unchanged business rule.) */
export const FREE_DELIVERY_OVER_NGN = 50000;
export const FALLBACK_DELIVERY_NGN = 1500;

export function safeText(value, max) {
  return String(value == null ? '' : value).trim().slice(0, max);
}

export function jsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch (_) {} }
  return {};
}

export function intOrNull(v) {
  const n = Number(v);
  return Number.isInteger(n) ? n : null;
}

export function deliveryFeeNgn(subtotalNgn) {
  const override = intOrNull(process.env.DELIVERY_FEE_NGN);
  if (override !== null && override >= 0) return override;
  return subtotalNgn >= FREE_DELIVERY_OVER_NGN ? 0 : FALLBACK_DELIVERY_NGN;
}

/* Re-price the cart from the trusted catalogue. Throws a message safe to show. */
export function normalizeItems(input) {
  if (!Array.isArray(input) || !input.length || input.length > MAX_ITEMS) {
    throw new Error('Your cart is empty or contains too many different items.');
  }
  const out = [];
  let subtotal = 0;
  for (const item of input) {
    const id = safeText(item && item.id, 120);
    const qty = Number(item && item.qty);
    const p = STORE_CATALOG.get(id);
    if (!p) throw new Error('A product in your cart is not available for secure checkout. Please remove it or contact the store.');
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) throw new Error('One of your item quantities is invalid.');
    const line = p.price * qty;
    subtotal += line;
    out.push({ id: id, name: p.name, qty: qty, unitPriceNgn: p.price, lineTotalNgn: line });
  }
  if (!Number.isSafeInteger(subtotal) || subtotal <= 0 || subtotal > 100000000) throw new Error('The order total is invalid.');
  return { items: out, subtotal: subtotal };
}

export function newReference() {
  return 'LDM-' + Date.now().toString(36).toUpperCase() + '-' + crypto.randomBytes(6).toString('hex').toUpperCase();
}

/* ---------- table ---------- */
let ordersReady = false;
export async function ensureOrdersTable() {
  if (ordersReady) return;
  await db.query(`CREATE TABLE IF NOT EXISTS store_orders (
    id BIGSERIAL PRIMARY KEY,
    reference TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    items JSONB NOT NULL,
    subtotal_kobo BIGINT NOT NULL,
    delivery_kobo BIGINT NOT NULL,
    total_kobo BIGINT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    status TEXT NOT NULL DEFAULT 'pending',
    paystack_status TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  /* Columns added after the first release — safe to re-run on an existing table. */
  await db.query("ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS payment_mode TEXT NOT NULL DEFAULT 'test'");
  await db.query("ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS payment_provider TEXT NOT NULL DEFAULT 'paystack'");
  await db.query("ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN NOT NULL DEFAULT FALSE");
  await db.query("ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ");
  await db.query('CREATE INDEX IF NOT EXISTS store_orders_user_created_idx ON store_orders(user_id, created_at DESC)');
  await db.query('CREATE INDEX IF NOT EXISTS store_orders_created_idx ON store_orders(created_at DESC)');
  await db.query('CREATE INDEX IF NOT EXISTS store_orders_status_idx ON store_orders(status)');
  ordersReady = true;
}

/* Where does the browser come back to after paying? SITE_URL wins; otherwise
   the request's own host, so previews work without extra configuration. */
export function siteOrigin(req, settings) {
  const configured = safeText(settings && settings.site_url, 300).replace(/\/+$/, '');
  if (configured && /^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(configured)) return configured;
  const host = String((req.headers && (req.headers['x-forwarded-host'] || req.headers.host)) || '');
  if (!host || /[^a-z0-9.:-]/i.test(host)) return '';
  const proto = String((req.headers && req.headers['x-forwarded-proto']) || 'https').split(',')[0].trim();
  const scheme = proto === 'http' || /^(localhost|127\.0\.0\.1|\d+\.\d+\.\d+\.\d+)(:\d+)?$/i.test(host) ? 'http' : 'https';
  return scheme + '://' + host;
}

/* ---------- create ---------- */
export async function createOrder(opts) {
  await ensureOrdersTable();
  const r = await db.query(
    `INSERT INTO store_orders
       (reference,user_id,email,customer_name,phone,address,city,notes,items,
        subtotal_kobo,delivery_kobo,total_kobo,currency,status,payment_mode,payment_provider,terms_accepted,terms_accepted_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$12,$13,'pending',$14,$15,$16,$17)
     RETURNING *`,
    [opts.reference, opts.userId, opts.email, opts.customerName, opts.phone, opts.address, opts.city, opts.notes || '',
      JSON.stringify(opts.items), opts.subtotalNgn * 100, opts.deliveryNgn * 100, opts.totalNgn * 100, CURRENCY,
      opts.paymentMode || 'test', opts.paymentProvider || 'paystack',
      !!opts.termsAccepted, opts.termsAccepted ? new Date() : null]
  );
  return r.rows[0];
}

/* ---------- read ---------- */
export async function findOrderByReference(reference) {
  const r = await db.query('SELECT * FROM store_orders WHERE reference = $1', [reference]);
  return r.rows[0] || null;
}

export async function findOrderForUser(reference, userId) {
  const r = await db.query('SELECT * FROM store_orders WHERE reference = $1 AND user_id = $2', [reference, userId]);
  return r.rows[0] || null;
}

/* The shape the browser is allowed to see. There is no secret in here. */
export function publicOrder(order) {
  if (!order) return null;
  const items = Array.isArray(order.items) ? order.items : [];
  return {
    reference: order.reference,
    status: order.status,
    paymentMode: order.payment_mode || 'test',
    paymentProvider: order.payment_provider || 'paystack',
    paystackStatus: order.paystack_status || '',
    email: order.email,
    customerName: order.customer_name,
    phone: order.phone,
    address: order.address,
    city: order.city,
    notes: order.notes || '',
    termsAccepted: !!order.terms_accepted,
    termsAcceptedAt: order.terms_accepted_at || null,
    items: items.map(function (i) {
      return { id: i.id, name: i.name, qty: i.qty, unitPrice: Number(i.unitPriceNgn) || 0, lineTotal: Number(i.lineTotalNgn) || 0 };
    }),
    itemCount: items.reduce(function (n, i) { return n + (Number(i.qty) || 0); }, 0),
    subtotal: Number(order.subtotal_kobo) / 100,
    delivery: Number(order.delivery_kobo) / 100,
    total: Number(order.total_kobo) / 100,
    currency: order.currency,
    createdAt: order.created_at,
    paidAt: order.paid_at || null
  };
}

/* ---------- state changes ---------- */
export async function markPaid(reference, providerStatus) {
  await db.query(
    "UPDATE store_orders SET status='paid', paystack_status=$2, paid_at=COALESCE(paid_at,NOW()), updated_at=NOW() WHERE reference=$1 AND status <> 'paid'",
    [reference, safeText(providerStatus || 'success', 40)]
  );
}

export async function markFailed(reference, providerStatus) {
  await db.query(
    "UPDATE store_orders SET status='failed', paystack_status=$2, updated_at=NOW() WHERE reference=$1 AND status <> 'paid'",
    [reference, safeText(providerStatus || 'failed', 40)]
  );
}

/* ---------- admin listing ---------- */
export async function listOrders(opts) {
  await ensureOrdersTable();
  opts = opts || {};
  const limit = Math.min(Math.max(Number(opts.limit) || 50, 1), 200);
  const where = [];
  const params = [];
  if (opts.status && ['pending', 'paid', 'failed'].indexOf(opts.status) > -1) {
    params.push(opts.status);
    where.push('status = $' + params.length);
  }
  if (opts.mode && ['test', 'live', 'demo'].indexOf(opts.mode) > -1) {
    params.push(opts.mode);
    where.push('payment_mode = $' + params.length);
  }
  if (opts.q) {
    params.push('%' + safeText(opts.q, 80).toLowerCase() + '%');
    where.push('(LOWER(reference) LIKE $' + params.length + ' OR LOWER(customer_name) LIKE $' + params.length +
      ' OR LOWER(email) LIKE $' + params.length + ')');
  }
  params.push(limit);
  const sql = 'SELECT * FROM store_orders' + (where.length ? ' WHERE ' + where.join(' AND ') : '') +
    ' ORDER BY created_at DESC LIMIT $' + params.length;
  const r = await db.query(sql, params);

  const totals = await db.query(`SELECT
      COUNT(*)::int AS orders_all,
      COUNT(*) FILTER (WHERE status='paid')::int AS orders_paid,
      COUNT(*) FILTER (WHERE status='pending')::int AS orders_pending,
      COUNT(*) FILTER (WHERE status='failed')::int AS orders_failed,
      COALESCE(SUM(total_kobo) FILTER (WHERE status='paid'),0)::bigint AS paid_kobo
    FROM store_orders`);

  return { orders: r.rows.map(publicOrder), totals: totals.rows[0] };
}
