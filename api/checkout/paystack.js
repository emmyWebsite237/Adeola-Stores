/* ============================================================
   Adeola Stores — /api/checkout/paystack
   ----------------------------------------------------------------------------
   The real, server-backed payment route. It powers the SAME purchase journey
   for test mode and live mode — the only difference is which Paystack key is
   configured (see lib/payment-config.js, the single test/live switch).

     POST /api/checkout/paystack
       { items, name, phone, address, city, notes, termsAccepted }
       -> { success, authorizationUrl, reference, mode }

     GET  /api/checkout/paystack?reference=…
       -> { success, status:'paid'|'failed'|'pending', order, mode }

   What the server does, in order:
     1. requires a signed-in, email-verified account
     2. requires the customer to have accepted the terms (recorded on the order)
     3. re-prices every line from lib/store-catalog.js — never from the browser
     4. calculates delivery itself — never from the browser
     5. refuses to start if PAYMENT_MODE and the secret key disagree
     6. stores a `pending` order BEFORE talking to Paystack
     7. only marks the order paid when Paystack confirms the amount, the
        currency AND the reference all match the stored order
   ============================================================ */
import { db, getSettings } from '../../lib/settings.js';
import { verifySessionToken } from '../../lib/users.js';
import { resolvePayment } from '../../lib/payment-config.js';
import {
  normalizeItems, deliveryFeeNgn, newReference, createOrder, findOrderForUser,
  markPaid, markFailed, safeText, jsonBody, publicOrder, siteOrigin
} from '../../lib/order.js';

function authUser(req) {
  const header = String((req.headers || {}).authorization || '');
  return header.indexOf('Bearer ') === 0 ? header.slice(7) : '';
}
async function authenticatedUser(req) {
  const session = await verifySessionToken(authUser(req));
  if (!session || !session.uid) return null;
  const r = await db.query('SELECT id, name, email, phone FROM users WHERE id = $1 AND verified = TRUE', [session.uid]);
  return r.rows[0] || null;
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

/* ------------------------------------------------------------------ POST */
async function initialize(req, res) {
  const user = await authenticatedUser(req);
  if (!user) {
    return res.status(401).json({ success: false, code: 'unauthenticated', error: 'Please sign in with a verified account before checkout.' });
  }

  const body = jsonBody(req);
  const address = safeText(body.address, 500);
  const city = safeText(body.city, 100);
  const phone = safeText(body.phone || user.phone, 40);
  const customerName = safeText(body.name || user.name, 160);
  const notes = safeText(body.notes, 1000);
  const termsAccepted = body.termsAccepted === true;

  if (!address || !city || !phone || !customerName) {
    return res.status(400).json({ success: false, error: 'Enter your name, phone number, delivery address and city.' });
  }
  if (!termsAccepted) {
    return res.status(400).json({
      success: false, code: 'terms_required',
      error: 'Please accept the Terms & Conditions, Returns Policy and Privacy Policy to continue.'
    });
  }

  let normalized;
  try { normalized = normalizeItems(body.items); }
  catch (e) { return res.status(400).json({ success: false, error: e.message }); }

  const settings = await getSettings(true);
  const pay = resolvePayment(settings);
  if (!pay.usable) {
    return res.status(503).json({
      success: false, code: 'payment_not_configured',
      paymentMode: pay.mode,
      error: pay.problems[0] || 'Online payment is not configured yet. Please contact the store.'
    });
  }
  if (pay.mode === 'demo') {
    /* Sandbox is handled by /api/checkout/sandbox — this route never fakes a
       payment, so it must not be used while PAYMENT_MODE=demo. */
    return res.status(409).json({
      success: false, code: 'use_sandbox',
      error: 'Payments are in sandbox mode. Use the sandbox checkout to preview this order.'
    });
  }

  const deliveryNgn = deliveryFeeNgn(normalized.subtotal);
  const totalNgn = normalized.subtotal + deliveryNgn;
  const reference = newReference();
  const origin = siteOrigin(req, settings);
  if (!origin) {
    return res.status(500).json({ success: false, error: 'The site URL is not configured. Set SITE_URL in your hosting environment and try again.' });
  }
  const callbackUrl = origin + '/checkout?reference=' + encodeURIComponent(reference);

  /* The order exists as `pending` before Paystack is ever called, so a payment
     can always be traced back to a real order. */
  await createOrder({
    reference: reference, userId: user.id, email: user.email, customerName: customerName,
    phone: phone, address: address, city: city, notes: notes, items: normalized.items,
    subtotalNgn: normalized.subtotal, deliveryNgn: deliveryNgn, totalNgn: totalNgn,
    paymentMode: pay.mode, paymentProvider: 'paystack', termsAccepted: termsAccepted
  });

  try {
    const tx = await paystackRequest('/transaction/initialize', pay.secretKey, {
      email: user.email,
      amount: totalNgn * 100,
      currency: 'NGN',
      reference: reference,
      callback_url: callbackUrl,
      metadata: {
        order_reference: reference,
        customer_name: customerName,
        payment_mode: pay.mode,
        custom_fields: [
          { display_name: 'Order reference', variable_name: 'order_reference', value: reference },
          { display_name: 'Mode', variable_name: 'payment_mode', value: pay.mode }
        ]
      }
    });
    return res.status(200).json({ success: true, authorizationUrl: tx.authorization_url, reference: reference, mode: pay.mode });
  } catch (e) {
    await markFailed(reference, 'initialization_failed');
    console.error('Paystack initialization failed:', e.message);
    return res.status(502).json({
      success: false, paymentMode: pay.mode,
      error: 'Paystack could not start the payment. No payment has been confirmed; please try again.'
    });
  }
}

/* ------------------------------------------------------------------- GET */
async function verify(req, res) {
  const user = await authenticatedUser(req);
  if (!user) return res.status(401).json({ success: false, code: 'unauthenticated', error: 'Please sign in to verify your order.' });

  const reference = safeText((req.query || {}).reference, 160);
  if (!reference) return res.status(400).json({ success: false, error: 'Missing payment reference.' });

  const order = await findOrderForUser(reference, user.id);
  if (!order) return res.status(404).json({ success: false, error: 'This order was not found for your account.' });

  const settings = await getSettings(true);
  const pay = resolvePayment(settings);

  /* Already settled — answer from our own record, never re-charge or re-check. */
  if (order.status === 'paid') {
    return res.status(200).json({ success: true, status: 'paid', reference: reference, mode: order.payment_mode, amount: Number(order.total_kobo) / 100, order: publicOrder(order) });
  }
  if (order.payment_mode === 'demo') {
    return res.status(200).json({ success: false, status: 'pending', reference: reference, mode: 'demo', error: 'This is a sandbox order. Open the sandbox payment page to complete or decline it.', order: publicOrder(order) });
  }
  if (!pay.usable || pay.mode === 'demo') {
    return res.status(503).json({ success: false, status: 'pending', reference: reference, mode: pay.mode, error: 'Payment verification is not configured right now. Please contact the store.', order: publicOrder(order) });
  }

  try {
    const tx = await paystackRequest('/transaction/verify/' + encodeURIComponent(reference), pay.secretKey);
    const amountMatches = Number(tx.amount) === Number(order.total_kobo);
    const currencyMatches = String(tx.currency || '').toUpperCase() === String(order.currency).toUpperCase();
    const referenceMatches = String(tx.reference) === reference;

    if (tx.status === 'success' && amountMatches && currencyMatches && referenceMatches) {
      await markPaid(reference, tx.status);
      const fresh = await findOrderForUser(reference, user.id);
      return res.status(200).json({ success: true, status: 'paid', reference: reference, mode: pay.mode, amount: Number(fresh.total_kobo) / 100, order: publicOrder(fresh) });
    }
    if (tx.status === 'failed' || tx.status === 'abandoned') {
      await markFailed(reference, tx.status);
      const fresh = await findOrderForUser(reference, user.id);
      return res.status(200).json({
        success: false, status: 'failed', reference: reference, mode: pay.mode,
        error: tx.status === 'abandoned'
          ? 'You closed the payment page before paying. Your order has not been marked as paid.'
          : 'Payment was not successful. Your order has not been marked as paid.',
        order: publicOrder(fresh)
      });
    }
    return res.status(200).json({ success: false, status: 'pending', reference: reference, mode: pay.mode, error: 'Payment is not yet confirmed. Please wait a moment and refresh this page.', order: publicOrder(order) });
  } catch (e) {
    console.error('Paystack verification failed:', e.message);
    return res.status(502).json({ success: false, status: 'pending', reference: reference, mode: pay.mode, error: 'We could not verify the payment just yet. Do not pay again immediately; refresh this page shortly.', order: publicOrder(order) });
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!process.env.DATABASE_URL) return res.status(503).json({ success: false, error: 'The order database is not connected.' });
  try {
    if (req.method === 'POST') return await initialize(req, res);
    if (req.method === 'GET') return await verify(req, res);
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (e) {
    console.error('Checkout API failed:', e && e.message ? e.message : e);
    return res.status(500).json({ success: false, error: 'We could not process checkout. Please try again.' });
  }
}
