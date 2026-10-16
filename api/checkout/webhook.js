/* ============================================================
   Adeola Stores — /api/checkout/webhook
   ----------------------------------------------------------------------------
   Paystack calls this after a charge settles. It is the safety net for a
   customer who closes the browser before being redirected back to /checkout.

   Security: the x-paystack-signature header is an HMAC-SHA512 of the RAW body
   keyed with the store's secret key, compared in constant time. Only then, and
   only when the amount, currency and reference all match the stored order, is
   the order marked paid.

   Mode safety: the signature is checked with whichever key the server is
   configured with, so a test-mode deployment can never be credited by a live
   charge and vice versa. While PAYMENT_MODE=demo no key is configured and this
   route refuses everything.
   ============================================================ */
import crypto from 'node:crypto';
import { db, getSettings } from '../../lib/settings.js';
import { resolvePayment } from '../../lib/payment-config.js';
import { ensureOrdersTable, markPaid } from '../../lib/order.js';

function safeEqualHex(a, b) {
  if (!/^[a-f0-9]+$/i.test(a) || !/^[a-f0-9]+$/i.test(b)) return false;
  const aa = Buffer.from(a, 'hex'), bb = Buffer.from(b, 'hex');
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  if (!process.env.DATABASE_URL) return res.status(503).end();
  try {
    const settings = await getSettings(true);
    const pay = resolvePayment(settings);
    if (!pay.secretKey || pay.mode === 'demo') return res.status(503).end();

    const signature = String((req.headers || {})['x-paystack-signature'] || '');
    const raw = Buffer.isBuffer(req.rawBody) ? req.rawBody
      : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {}));
    const expected = crypto.createHmac('sha512', pay.secretKey).update(raw).digest('hex');
    if (!safeEqualHex(signature, expected)) return res.status(401).end();

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (body.event !== 'charge.success' || !body.data || !body.data.reference) {
      return res.status(200).json({ received: true });
    }

    await ensureOrdersTable();
    const tx = body.data;
    const r = await db.query('SELECT reference,total_kobo,currency,status,payment_mode FROM store_orders WHERE reference=$1', [String(tx.reference)]);
    const order = r.rows[0];
    if (order && tx.status === 'success' &&
        Number(tx.amount) === Number(order.total_kobo) &&
        String(tx.currency).toUpperCase() === String(order.currency).toUpperCase()) {
      await markPaid(order.reference, 'success');
    }
    return res.status(200).json({ received: true });
  } catch (e) {
    console.error('Paystack webhook failed:', e && e.message ? e.message : e);
    return res.status(500).json({ received: false });
  }
}
