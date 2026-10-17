import crypto from 'node:crypto';
import { db, getSettings } from '../../lib/settings.js';

async function ensureOrdersTable() {
  await db.query(`CREATE TABLE IF NOT EXISTS store_orders (
    id BIGSERIAL PRIMARY KEY, reference TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL REFERENCES users(id), email TEXT NOT NULL,
    customer_name TEXT NOT NULL, phone TEXT NOT NULL, address TEXT NOT NULL,
    city TEXT NOT NULL, notes TEXT NOT NULL DEFAULT '', items JSONB NOT NULL,
    subtotal_kobo BIGINT NOT NULL, delivery_kobo BIGINT NOT NULL, total_kobo BIGINT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN', status TEXT NOT NULL DEFAULT 'pending',
    paystack_status TEXT, paid_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
}
function safeEqualHex(a,b) {
  if (!/^[a-f0-9]+$/i.test(a) || !/^[a-f0-9]+$/i.test(b)) return false;
  const aa=Buffer.from(a,'hex'), bb=Buffer.from(b,'hex');
  return aa.length===bb.length && crypto.timingSafeEqual(aa,bb);
}
export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  if (req.method !== 'POST') { res.setHeader('Allow','POST'); return res.status(405).end(); }
  if (!process.env.DATABASE_URL) return res.status(503).end();
  try {
    const settings=await getSettings(true);
    const secret=String(settings.paystack_secret_key || process.env.PAYSTACK_SECRET_KEY || '').trim();
    if (!secret) return res.status(503).end();
    const signature=String((req.headers||{})['x-paystack-signature']||'');
    const raw=Buffer.isBuffer(req.rawBody) ? req.rawBody : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {}));
    const expected=crypto.createHmac('sha512',secret).update(raw).digest('hex');
    if (!safeEqualHex(signature,expected)) return res.status(401).end();
    const body=typeof req.body==='string' ? JSON.parse(req.body) : (req.body || {});
    if (body.event !== 'charge.success' || !body.data || !body.data.reference) return res.status(200).json({ received:true });
    await ensureOrdersTable();
    const tx=body.data;
    const r=await db.query('SELECT reference,total_kobo,currency,status FROM store_orders WHERE reference=$1',[String(tx.reference)]);
    const order=r.rows[0];
    if (order && tx.status==='success' && Number(tx.amount)===Number(order.total_kobo) && String(tx.currency).toUpperCase()===String(order.currency).toUpperCase()) {
      await db.query("UPDATE store_orders SET status='paid', paystack_status='success', paid_at=COALESCE(paid_at,NOW()), updated_at=NOW() WHERE reference=$1 AND status <> 'paid'",[order.reference]);
    }
    return res.status(200).json({ received:true });
  } catch(e) {
    console.error('Paystack webhook failed:',e && e.message ? e.message : e);
    return res.status(500).json({ received:false });
  }
}
