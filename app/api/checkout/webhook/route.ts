import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/db/supabase';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    // Verify webhook signature if secret key is configured
    if (PAYSTACK_SECRET_KEY && signature) {
      const hash = crypto
        .createHmac('sha512', PAYSTACK_SECRET_KEY)
        .update(rawBody)
        .digest('hex');

      if (hash !== signature) {
        return NextResponse.json({ error: 'Invalid Paystack signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'charge.success') {
      const reference = event.data?.reference;
      const amountPaid = (event.data?.amount || 0) / 100; // kobo to naira

      console.log(`Paystack payment verified for ref: ${reference}, amount: ₦${amountPaid}`);

      if (supabase && reference) {
        await supabase
          .from('store_orders')
          .update({
            payment_status: 'paid',
            fulfillment_status: 'processing',
          })
          .eq('reference', reference);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Paystack webhook error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
