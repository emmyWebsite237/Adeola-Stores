import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    if (!supabase) {
      // Fallback check if Supabase is offline
      if (username === 'adeola_admin' && password === 'AdeolaStores2026!') {
        return NextResponse.json({
          success: true,
          user: { username: 'adeola_admin', role: 'admin' },
        });
      }
      return NextResponse.json(
        { success: false, error: 'Database unconfigured.' },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from('admin_credentials')
      .select('*')
      .eq('username', username.trim())
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin username or password.' },
        { status: 401 }
      );
    }

    // Direct match against password_hash stored in Supabase
    if (data.password_hash !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin username or password.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        username: data.username,
        role: data.role,
      },
    });
  } catch (err: any) {
    console.error('[Admin Auth API Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Authentication failed.' },
      { status: 500 }
    );
  }
}

// Update admin credentials
export async function PATCH(req: Request) {
  try {
    const { currentUsername, currentPassword, newUsername, newPassword } = await req.json();

    if (!currentUsername || !currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Current credentials and new password are required.' },
        { status: 400 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database unconfigured.' },
        { status: 500 }
      );
    }

    // Verify current
    const { data: currentCreds, error: fetchErr } = await supabase
      .from('admin_credentials')
      .select('*')
      .eq('username', currentUsername.trim())
      .single();

    if (fetchErr || !currentCreds || currentCreds.password_hash !== currentPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password verification failed.' },
        { status: 401 }
      );
    }

    const updatePayload: Record<string, any> = {
      password_hash: newPassword,
      updated_at: new Date().toISOString(),
    };

    if (newUsername && newUsername.trim()) {
      updatePayload.username = newUsername.trim();
    }

    const { error: updateErr } = await supabase
      .from('admin_credentials')
      .update(updatePayload)
      .eq('id', currentCreds.id);

    if (updateErr) {
      return NextResponse.json(
        { success: false, error: updateErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin credentials successfully updated in Supabase.',
      newUsername: updatePayload.username || currentUsername,
    });
  } catch (err: any) {
    console.error('[Admin Auth PATCH Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update credentials.' },
      { status: 500 }
    );
  }
}
