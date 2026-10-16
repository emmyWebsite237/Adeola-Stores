import crypto from 'node:crypto';
import { db, getSettings } from '../../lib/settings.js';
import { verifySessionToken } from '../../lib/users.js';
import { STORE_CATALOG } from '../../lib/store-catalog.js';

const CURRENCY = 'NGN';
const MAX_ITEMS = 40;
const MAX_QTY = 99;

function jsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch (_) {} }
  return {};
}
async function authenticatedUser(req) {
  const header = String((req.headers || {}).authorization || '');
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const session = await verifySessionToken(token);
  if (!session || !session.uid) return null;
  const r = await db.query('SELECT id, name, email, phone FROM users WHERE id = $1 AND verified = TRUE', [session.uid]);
  return r.rows[0] || null;
}
async function ensureOrdersTable() {
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
  await db.query('CREATE INDEX IF NOT EXISTS store_orders_user_created_idx ON store_orders(user_id, created_at DESC)');
}
function safeText(value, max) { return String(value == null ? '' : value).trim().slice(0, max); }
function siteOrigin(req, settings) {
  const configured = String(settings.site_url || '').trim().replace(/\/+$/, '');
  if (configured && /^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(configured)) return configured;
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '');
  if (!host || /[^a-z0-9.:-]/i.test(host)) return '';
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  return (proto === 'http' ? 'http' : 'https') + '://' + host;
}
async function paystackRequest(path, secret, body) {
  const response = await fetch('https://api.paystack.co' + path, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: 'Bearer ' + secret, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  let data = {};
  try { data = await response.json(); } catch (_) {}
  if (!response.ok || !data.status) {
    const e = new Error(data.message || 'Paystack could not complete the request.');
    e.status = response.status;
    throw e;
  }
  return data.data;
}
function normalizeItems(input) {
  if (!Array.isArray(input) || !input.length || input.length > MAX_ITEMS) throw new Error('Your cart is empty or contains too many different items.');
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
    out.push({ id, name: p.name, qty, unitPriceNgn: p.price, lineTotalNgn: line });
  }
  if (!Number.isSafeInteger(subtotal) || subtotal <= 0 || subtotal > 100000000) throw new Error('The order total is invalid.');
  return { items: out, subtotal };
}
async function initialize(req, res) {
  const user = await authenticatedUser(req);
  if (!user) return res.status(401).json({ success: false, code: 'unauthenticated', error: 'Please sign in with a verified account before checkout.' });
  const body = jsonBody(req);
  const address = safeText(body.address, 500);
  const city = safeText(body.city, 100);
  const phone = safeText(body.phone || user.phone, 40);
  const customerName = safeText(body.name || user.name, 160);
  const notes = safeText(body.notes, 1000);
  if (!address || !city || !phone || !customerName) return res.status(400).json({ success: false, error: 'Enter your name, phone number, delivery address and city.' });

  let normalized;
  try { normalized = normalizeItems(body.items); }
  catch (e) { return res.status(400).json({ success: false, error: e.message }); }

  const settings = await getSettings(true);
  const secret = String(settings.paystack_secret_key || process.env.PAYSTACK_SECRET_KEY || '').trim();
  if (!secret) return res.status(503).json({ success: false, code: 'payment_not_configured', error: 'Online payment is not configured yet. Please contact the store.' });

  // Delivery is calculated on the server and never accepted from the browser.
  const deliveryNgn = Number.isInteger(Number(process.env.DELIVERY_FEE_NGN)) && Number(process.env.DELIVERY_FEE_NGN) >= 0
    ? Number(process.env.DELIVERY_FEE_NGN) : (normalized.subtotal >= 50000 ? 0 : 1500);
  const totalNgn = normalized.subtotal + deliveryNgn;
  const reference = 'LDM-' + Date.now().toString(36).toUpperCase() + '-' + crypto.randomBytes(6).toString('hex').toUpperCase();
  const origin = siteOrigin(req, settings);
  if (!origin) return res.status(500).json({ success: false, error: 'The site URL is not configured. Set SITE_URL in Vercel and try again.' });
  const callbackUrl = origin + '/checkout?reference=' + encodeURIComponent(reference);

  await ensureOrdersTable();
  await db.query(
    `INSERT INTO store_orders (reference,user_id,email,customer_name,phone,address,city,notes,items,subtotal_kobo,delivery_kobo,total_kobo,currency,status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$12,$13,'pending')`,
    [reference,user.id,user.email,customerName,phone,address,city,notes,JSON.stringify(normalized.items),
      normalized.subtotal * 100,deliveryNgn * 100,totalNgn * 100,CURRENCY]
  );

  try {
    const tx = await paystackRequest('/transaction/initialize', secret, {
      email: user.email,
      amount: totalNgn * 100,
      currency: CURRENCY,
      reference,
      callback_url: callbackUrl,
      metadata: { order_reference: reference, customer_name: customerName, custom_fields: [
        { display_name: 'Order reference', variable_name: 'order_reference', value: reference }
      ] }
    });
    return res.status(200).json({ success: true, authorizationUrl: tx.authorization_url, reference });
  } catch (e) {
    await db.query("UPDATE store_orders SET status='failed', paystack_status='initialization_failed', updated_at=NOW() WHERE reference=$1", [reference]);
    console.error('Paystack initialization failed:', e.message);
    return res.status(502).json({ success: false, error: 'Paystack could not start the payment. No payment has been confirmed; please try again.' });
  }
}
async function verify(req, res) {
  const user = await authenticatedUser(req);
  if (!user) return res.status(401).json({ success: false, code: 'unauthenticated', error: 'Please sign in to verify your order.' });
  const reference = safeText((req.query || {}).reference, 160);
  if (!reference) return res.status(400).json({ success: false, error: 'Missing payment reference.' });
  const settings = await getSettings(true);
  const secret = String(settings.paystack_secret_key || process.env.PAYSTACK_SECRET_KEY || '').trim();
  if (!secret) return res.status(503).json({ success: false, error: 'Payment verification is not configured.' });
  await ensureOrdersTable();
  const orderResult = await db.query('SELECT * FROM store_orders WHERE reference=$1 AND user_id=$2', [reference,user.id]);
  const order = orderResult.rows[0];
  if (!order) return res.status(404).json({ success: false, error: 'This order was not found for your account.' });
  if (order.status === 'paid') return res.status(200).json({ success: true, status: 'paid', reference, amount: Number(order.total_kobo) / 100 });
  try {
    const tx = await paystackRequest('/transaction/verify/' + encodeURIComponent(reference), secret);
    const amountMatches = Number(tx.amount) === Number(order.total_kobo);
    const currencyMatches = String(tx.currency || '').toUpperCase() === String(order.currency).toUpperCase();
    if (tx.status === 'success' && amountMatches && currencyMatches && String(tx.reference) === reference) {
      await db.query("UPDATE store_orders SET status='paid', paystack_status=$2, paid_at=COALESCE(paid_at,NOW()), updated_at=NOW() WHERE reference=$1", [reference, safeText(tx.status,40)]);
      return res.status(200).json({ success: true, status: 'paid', reference, amount: Number(order.total_kobo) / 100 });
    }
    if (tx.status === 'failed' || tx.status === 'abandoned') {
      await db.query("UPDATE store_orders SET status='failed', paystack_status=$2, updated_at=NOW() WHERE reference=$1 AND status <> 'paid'", [reference,safeText(tx.status,40)]);
      return res.status(200).json({ success: false, status: 'failed', reference, error: 'Payment was not successful. Your order has not been marked as paid.' });
    }
    return res.status(200).json({ success: false, status: 'pending', reference, error: 'Payment is not yet confirmed. Please wait a moment and refresh this page.' });
  } catch (e) {
    console.error('Paystack verification failed:', e.message);
    return res.status(502).json({ success: false, status: 'pending', error: 'We could not verify the payment just yet. Do not pay again immediately; refresh this page shortly.' });
  }
}
export default async function handler(req, res) {
  res.setHeader('Cache-Control','no-store');
  if (!process.env.DATABASE_URL) return res.status(503).json({ success:false, error:'The order database is not connected.' });
  try {
    if (req.method === 'POST') return await initialize(req,res);
    if (req.method === 'GET') return await verify(req,res);
    res.setHeader('Allow','GET, POST');
    return res.status(405).json({ success:false, error:'Method not allowed' });
  } catch (e) {
    console.error('Checkout API failed:', e && e.message ? e.message : e);
    return res.status(500).json({ success:false, error:'We could not process checkout. Please try again.' });
  }
}
