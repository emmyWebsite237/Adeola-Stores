import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const reference = searchParams.get('reference');

  if (!supabase) {
    return NextResponse.json({
      orders: [],
      message: 'Supabase offline fallback active. Connect Supabase to store orders in the cloud.',
    });
  }

  try {
    let query = supabase.from('store_orders').select('*').order('created_at', { ascending: false });

    if (reference) {
      query = query.eq('reference', reference);
    } else if (email) {
      query = query.eq('customer_email', email);
    }

    const { data, error } = await query.limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ orders: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { reference, fulfillment_status, payment_status } = body;

    if (!reference) {
      return NextResponse.json({ error: 'Reference required' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ success: true, message: 'Local mode mock update' });
    }

    const updates: Record<string, string> = {};
    if (fulfillment_status) updates.fulfillment_status = fulfillment_status;
    if (payment_status) updates.payment_status = payment_status;

    const { error } = await supabase
      .from('store_orders')
      .update(updates)
      .eq('reference', reference);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, updated: updates });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
