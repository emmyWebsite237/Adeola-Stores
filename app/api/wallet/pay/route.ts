import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ofpheisrsxochsldqcbt.supabase.co';
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mcGhlaXNyc3hvY2hzbGRxY2J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzUzNzQ5MSwiZXhwIjoyMTA5MTEzNDkxfQ.XOCSoKjIufSC1-7ODcIIUJ_vlDc_tGjGtv6Y2AGbD7U';

export async function POST(req: Request) {
  try {
    const { userId, pin, amount, orderReference, description } = await req.json();

    if (!userId || !pin || !amount || Number(amount) <= 0 || !orderReference) {
      return NextResponse.json(
        { error: 'userId, PIN, positive amount, and orderReference are required.' },
        { status: 400 }
      );
    }

    const payAmount = Number(amount);

    // Fetch user profile
    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=id,wallet_balance,wallet_pin,email,full_name`,
      {
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
        },
      }
    );

    if (!profileRes.ok) {
      return NextResponse.json({ error: 'User profile not found.' }, { status: 404 });
    }

    const profiles = await profileRes.json();
    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ error: 'User profile not found.' }, { status: 404 });
    }

    const userProfile = profiles[0];

    // Check if PIN has been set
    if (!userProfile.wallet_pin) {
      return NextResponse.json(
        { error: 'You have not set up a 4-digit Wallet PIN yet. Please set your PIN in your Account dashboard first.' },
        { status: 400 }
      );
    }

    // Verify PIN
    if (userProfile.wallet_pin !== pin.toString().trim()) {
      return NextResponse.json(
        { error: 'Incorrect 4-digit Wallet PIN. Please try again.' },
        { status: 401 }
      );
    }

    const currentBalance = Number(userProfile.wallet_balance || 0);

    // Verify sufficient funds
    if (currentBalance < payAmount) {
      return NextResponse.json(
        {
          error: `Insufficient wallet funds. Current balance is ₦${currentBalance.toLocaleString()}, but order requires ₦${payAmount.toLocaleString()}.`,
        },
        { status: 400 }
      );
    }

    const newBalance = currentBalance - payAmount;

    // Deduct balance
    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallet_balance: newBalance,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!updateRes.ok) {
      return NextResponse.json({ error: 'Failed to deduct from wallet balance.' }, { status: 500 });
    }

    // Log transaction
    await fetch(`${SUPABASE_URL}/rest/v1/wallet_transactions`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        amount: -payAmount,
        type: 'payment',
        reference: orderReference,
        description: description || `Grocery order payment for ref ${orderReference}`,
        balance_after: newBalance,
      }),
    });

    return NextResponse.json({
      success: true,
      message: 'Payment completed successfully from Ladydee Wallet.',
      newBalance,
    });
  } catch (error: any) {
    console.error('[Wallet Pay Error]:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}