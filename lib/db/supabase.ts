import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// If Supabase keys are not provided yet in .env, create a safe fallback
// so the app still runs and persists locally with zero crashes!
export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * SQL SCHEMA FOR SUPABASE SETUP
 * Run this directly in the Supabase SQL Editor:
 *
 * CREATE TABLE IF NOT EXISTS store_orders (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   reference TEXT UNIQUE NOT NULL,
 *   customer_name TEXT NOT NULL,
 *   customer_email TEXT NOT NULL,
 *   customer_phone TEXT NOT NULL,
 *   delivery_address TEXT NOT NULL,
 *   delivery_zone TEXT NOT NULL,
 *   items JSONB NOT NULL,
 *   subtotal NUMERIC NOT NULL,
 *   delivery_fee NUMERIC NOT NULL,
 *   discount NUMERIC DEFAULT 0,
 *   vat NUMERIC NOT NULL,
 *   total NUMERIC NOT NULL,
 *   payment_method TEXT NOT NULL,
 *   payment_status TEXT DEFAULT 'pending',
 *   fulfillment_status TEXT DEFAULT 'confirmed',
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * CREATE TABLE IF NOT EXISTS store_settings (
 *   key TEXT PRIMARY KEY,
 *   value TEXT NOT NULL,
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */
