import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ofpheisrsxochsldqcbt.supabase.co';
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mcGhlaXNyc3hvY2hzbGRxY2J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzUzNzQ5MSwiZXhwIjoyMTA5MTEzNDkxfQ.XOCSoKjIufSC1-7ODcIIUJ_vlDc_tGjGtv6Y2AGbD7U';

export async function POST(req: Request) {
  try {
    const { userId, pin } = await req.json();

    if (!userId || !pin || !/^\d{4}$/.test(pin.toString())) {
      return NextResponse.json(
        { error: 'A 4-digit numeric PIN is required (e.g. 1234).' },
        { status: 400 }
      );
    }

    const cleanPin = pin.toString().trim();

    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallet_pin: cleanPin,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!updateRes.ok) {
      return NextResponse.json({ error: 'Failed to save security PIN.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '4-digit security PIN set successfully.',
    });
  } catch (error: any) {
    console.error('[Set PIN Error]:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}