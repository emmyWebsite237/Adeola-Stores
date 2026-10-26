import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reference, orderData } = body;

    if (!reference) {
      return NextResponse.json(
        { success: false, error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    let isVerified = false;
    let paystackData: any = null;

    // Verify with Paystack API if secret key is configured
    if (PAYSTACK_SECRET_KEY && !PAYSTACK_SECRET_KEY.includes('placeholder')) {
      try {
        const verifyRes = await fetch(
          `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
          {
            headers: {
              Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const verifyJson = await verifyRes.json();
        if (verifyJson.status && verifyJson.data?.status === 'success') {
          isVerified = true;
          paystackData = verifyJson.data;
        }
      } catch (err) {
        console.error('Error verifying with Paystack API:', err);
      }
    } else {
      // In sandbox/test development mode without secret key, accept test references
      isVerified = reference.startsWith('ADEOLA-') || reference.startsWith('T');
    }

    // Persist verified order to Supabase if configured
    if (supabase && orderData) {
      try {
        const { error: dbError } = await supabase.from('store_orders').insert([
          {
            reference,
            customer_name: `${orderData.firstName || ''} ${orderData.lastName || ''}`.trim(),
            customer_email: orderData.email || '',
            customer_phone: orderData.phone || '',
            delivery_address: orderData.address || '',
            delivery_zone: orderData.zone || 'Lagos Mainland',
            items: orderData.items || [],
            subtotal: orderData.subtotal || 0,
            delivery_fee: orderData.deliveryFee || 0,
            discount: orderData.discount || 0,
            vat: orderData.vat || 0,
            total: orderData.total || 0,
            payment_method: orderData.paymentMethod || 'paystack',
            payment_status: isVerified ? 'paid' : 'pending',
            fulfillment_status: 'confirmed',
          },
        ]);

        if (dbError) {
          console.warn('Supabase insert notice (offline fallback active):', dbError.message);
        }
      } catch (dbErr) {
        console.warn('Supabase offline fallback:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      verified: isVerified,
      reference,
      data: paystackData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
