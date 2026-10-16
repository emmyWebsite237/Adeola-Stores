/* ============================================================
   Adeola Stores — /api/checkout/sandbox
   ----------------------------------------------------------------------------
   The SANDBOX payment provider. Runs ONLY when PAYMENT_MODE=demo, which is
   meant for local previews and demonstrations — no Paystack account, no keys
   and no money moving at all.

   It is deliberately refused the moment a real Paystack key is configured, so
   it can never be reached on a store that can take real payments.

     POST /api/checkout/sandbox   { items, name, phone, address, city, notes, termsAccepted }
                                  -> { success, authorizationUrl, reference }
     GET  /api/checkout/sandbox?reference=…&outcome=success|fail|abandon
                                  -> the same shape as the Paystack verify route

   The order record it creates is byte-identical in shape to a real one, so the
   checkout page, the receipt and the admin transactions view all behave exactly
   as they will in test/live mode.
   ============================================================ */
import { db, getSettings } from '../../lib/settings.js';
import { verifySessionToken } from '../../lib/users.js';
import { resolvePayment } from '../../lib/payment-config.js';
import {
  normalizeItems, deliveryFeeNgn, newReference, createOrder, findOrderForUser,
  markPaid, markFailed, safeText, jsonBody, publicOrder, siteOrigin
} from '../../lib/order.js';

async function authenticatedUser(req) {
  const header = String((req.headers || {}).authorization || '');
  const token = header.indexOf('Bearer ') === 0 ? header.slice(7) : '';
  const session = await verifySessionToken(token);
  if (!session || !session.uid) return null;
  const r = await db.query('SELECT id, name, email, phone FROM users WHERE id = $1 AND verified = TRUE', [session.uid]);
  return r.rows[0] || null;
}

function guard() {
  return process.env.DATABASE_URL ? null : 'The order database is not connected.';
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
  const termsAccepted = body.termsAccepted === true;
  if (!address || !city || !phone || !customerName) {
    return res.status(400).json({ success: false, error: 'Enter your name, phone number, delivery address and city.' });
  }
  if (!termsAccepted) {
    return res.status(400).json({ success: false, code: 'terms_required', error: 'Please accept the Terms & Conditions, Returns Policy and Privacy Policy to continue.' });
  }

  let normalized;
  try { normalized = normalizeItems(body.items); }
  catch (e) { return res.status(400).json({ success: false, error: e.message }); }

  const settings = await getSettings(true);
  const pay = resolvePayment(settings);
  if (!pay.usable) {
    return res.status(503).json({ success: false, code: 'sandbox_unavailable', error: pay.problems[0] || 'Sandbox checkout is not available.' });
  }
  if (pay.mode !== 'demo') {
    return res.status(409).json({
      success: false,
      code: 'not_sandbox',
      error: 'Sandbox checkout is only available while PAYMENT_MODE=demo. PAYMENT_MODE is "' + pay.mode + '".'
    });
  }

  const deliveryNgn = deliveryFeeNgn(normalized.subtotal);
  const totalNgn = normalized.subtotal + deliveryNgn;
  const reference = newReference();

  await createOrder({
    reference: reference, userId: user.id, email: user.email, customerName: customerName,
    phone: phone, address: address, city: city, notes: notes, items: normalized.items,
    subtotalNgn: normalized.subtotal, deliveryNgn: deliveryNgn, totalNgn: totalNgn,
    paymentMode: 'demo', paymentProvider: 'sandbox', termsAccepted: termsAccepted
  });

  const origin = siteOrigin(req, settings) || 'http://localhost:3000';
  return res.status(200).json({
    success: true,
    reference: reference,
    amount: totalNgn,
    mode: 'demo',
    authorizationUrl: origin + '/checkout?reference=' + encodeURIComponent(reference) + '&sandbox=1&outcome=success'
  });
}

async function verify(req, res) {
  const user = await authenticatedUser(req);
  if (!user) return res.status(401).json({ success: false, code: 'unauthenticated', error: 'Please sign in to verify your order.' });

  const query = req.query || {};
  const reference = safeText(query.reference, 160);
  const outcome = safeText(query.outcome, 20).toLowerCase();
  if (!reference) return res.status(400).json({ success: false, error: 'Missing payment reference.' });

  const order = await findOrderForUser(reference, user.id);
  if (!order) return res.status(404).json({ success: false, error: 'This order was not found for your account.' });
  /* Already decided — never flip a paid order back. */
  if (order.status === 'paid') return res.status(200).json({ success: true, status: 'paid', reference: reference, mode: 'demo', amount: Number(order.total_kobo) / 100, order: publicOrder(order) });
  if (order.status === 'failed') return res.status(200).json({ success: false, status: 'failed', reference: reference, mode: 'demo', error: 'This sandbox payment was declined. No money moved.', order: publicOrder(order) });

  if (outcome === 'fail' || outcome === 'abandon') {
    await markFailed(reference, outcome === 'abandon' ? 'abandoned' : 'declined');
    const fresh = await findOrderForUser(reference, user.id);
    return res.status(200).json({
      success: false, status: 'failed', reference: reference, mode: 'demo',
      error: outcome === 'abandon'
        ? 'You closed the sandbox payment page before paying. Your order has not been marked as paid.'
        : 'The sandbox payment was declined. No money moved and your order has not been marked as paid.',
      order: publicOrder(fresh)
    });
  }

  await markPaid(reference, 'sandbox_success');
  const paid = await findOrderForUser(reference, user.id);
  return res.status(200).json({ success: true, status: 'paid', reference: reference, mode: 'demo', amount: Number(paid.total_kobo) / 100, order: publicOrder(paid) });
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const bad = guard();
  if (bad) return res.status(503).json({ success: false, error: bad });
  try {
    if (req.method === 'POST') return await initialize(req, res);
    if (req.method === 'GET') return await verify(req, res);
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (e) {
    console.error('Sandbox checkout failed:', e && e.message ? e.message : e);
    return res.status(500).json({ success: false, error: 'We could not process the sandbox checkout. Please try again.' });
  }
}
