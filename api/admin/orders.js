/* ============================================================
   Adeola Stores — /api/admin/orders
   ----------------------------------------------------------------------------
   The admin transaction console. A signed-in staff member can list every order
   in ANY payment mode side by side — so you can watch real test payments land
   (and prove them) BEFORE you flip PAYMENT_MODE to live.

     GET /api/admin/orders?limit=50&status=paid|pending|failed&mode=test|live|demo&q=…
         -> { success, orders:[…], totals:{…}, payment:{ mode, … } }

   Read-only on purpose: the store's money state is changed only by the payment
   provider (Paystack verify/webhook or the sandbox), never by a button here.
   Every call needs  Authorization: Bearer <token from /api/admin/login>.
   ============================================================ */
import { getSettings, requireAdmin } from '../../lib/settings.js';
import { resolvePayment, publicPaymentStatus } from '../../lib/payment-config.js';
import { listOrders } from '../../lib/order.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!requireAdmin(req, res)) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  if (!process.env.DATABASE_URL) {
    return res.status(503).json({ success: false, error: 'The order database is not connected.' });
  }

  try {
    const q = req.query || {};
    const result = await listOrders({
      limit: q.limit,
      status: q.status,
      mode: q.mode,
      q: q.q
    });
    const settings = await getSettings(true);
    return res.status(200).json({
      success: true,
      orders: result.orders,
      totals: result.totals,
      payment: publicPaymentStatus(resolvePayment(settings))
    });
  } catch (e) {
    console.error('Admin orders failed:', e && e.message ? e.message : e);
    return res.status(500).json({ success: false, error: 'Could not load transactions.' });
  }
}
