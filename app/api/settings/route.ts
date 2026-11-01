import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';

// Standard fallback values if database is empty or offline
const DEFAULT_SETTINGS: Record<string, string> = {
  phone: '+234 800 000 0000',
  email: 'support@ladydeestores.com',
  whatsapp: '+234 800 000 0000',
  instagram: '',
  facebook: '',
  twitter: '',
  tiktok: '',
  address: 'Ladydee Minimart Store, Lagos, Nigeria',
  delivery_zones: 'Ikeja, Lekki, Victoria Island, Surulere, Yaba, Maryland, Agege',
  announcement: 'Free delivery on orders over ₦50,000 across Lagos',
};

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ settings: DEFAULT_SETTINGS, source: 'default' });
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value');

    if (error) {
      console.warn('[API /api/settings GET]:', error.message);
      return NextResponse.json({ settings: DEFAULT_SETTINGS, source: 'fallback' });
    }

    const settingsMap: Record<string, string> = { ...DEFAULT_SETTINGS };
    if (data && Array.isArray(data)) {
      data.forEach((row) => {
        if (row.key) {
          settingsMap[row.key] = row.value || '';
        }
      });
    }

    return NextResponse.json({ settings: settingsMap, source: 'live' });
  } catch (err: any) {
    console.error('[API /api/settings GET Exception]:', err);
    return NextResponse.json({ settings: DEFAULT_SETTINGS, source: 'error' });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Settings object is required' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 });
    }

    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value: String(value ?? '').trim(),
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('site_settings')
      .upsert(updates, { onConflict: 'key' });

    if (error) {
      console.error('[API /api/settings POST Error]:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Store and social settings successfully updated',
      settings,
    });
  } catch (err: any) {
    console.error('[API /api/settings POST Exception]:', err);
    return NextResponse.json({ error: err.message || 'Failed to save settings' }, { status: 500 });
  }
}
