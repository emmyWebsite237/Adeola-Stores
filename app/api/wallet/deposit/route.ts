import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ofpheisrsxochsldqcbt.supabase.co';
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mcGhlaXNyc3hvY2hzbGRxY2J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzUzNzQ5MSwiZXhwIjoyMTA5MTEzNDkxfQ.XOCSoKjIufSC1-7ODcIIUJ_vlDc_tGjGtv6Y2AGbD7U';

export async function POST(req: Request) {
  try {
    const { userId, amount, reference } = await req.json();

    if (!userId || !amount || Number(amount) <= 0 || !reference) {
      return NextResponse.json(
        { error: 'Valid userId, positive amount, and reference are required.' },
        { status: 400 }
      );
    }

    const depositAmount = Number(amount);

    // Fetch current user profile
    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=id,wallet_balance,email,full_name`,
      {
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
        },
      }
    );

    if (!profileRes.ok) {
      return NextResponse.json({ error: 'Failed to find user profile.' }, { status: 404 });
    }

    const profiles = await profileRes.json();
    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ error: 'User profile does not exist.' }, { status: 404 });
    }

    const currentBalance = Number(profiles[0].wallet_balance || 0);
    const newBalance = currentBalance + depositAmount;

    // Update wallet balance
    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        wallet_balance: newBalance,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!updateRes.ok) {
      return NextResponse.json({ error: 'Failed to update wallet balance.' }, { status: 500 });
    }

    // Record wallet transaction
    await fetch(`${SUPABASE_URL}/rest/v1/wallet_transactions`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        amount: depositAmount,
        type: 'deposit',
        reference,
        description: `Wallet top-up via Paystack`,
        balance_after: newBalance,
      }),
    });

    return NextResponse.json({
      success: true,
      message: 'Wallet funded successfully',
      newBalance,
    });
  } catch (error: any) {
    console.error('[Wallet Deposit Error]:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}