import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder')
);

// If Supabase is not configured, console.warn clearly in development
if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.warn(
    '[Supabase Configuration Missing]: Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel or local .env to enable real-time cloud data.'
  );
}

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// ==============================================================================
// TYPES
// ==============================================================================
export interface UserProfile {
  id: string; // matches auth.users.id
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  default_address?: string;
  default_zone?: string;
  updated_at?: string;
}

export interface StoreOrderRecord {
  id: string;
  reference: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_zone: string;
  items: Array<{ id: string; name: string; qty: number; price: number }>;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  vat: number;
  total: number;
  payment_method: string;
  payment_status: string;
  fulfillment_status: string;
  created_at: string;
}

export interface StoreRecipeRecord {
  id: string;
  slug: string;
  name: string;
  headline: string;
  image: string;
  prep_time: string;
  cook_time: string;
  servings: number;
  difficulty: string;
  category: string;
  description: string;
  instructions: string[];
  ingredients: Array<{
    productId: string;
    name: string;
    amount: string;
    required: boolean;
  }>;
  created_at?: string;
  updated_at?: string;
}

// ==============================================================================
// LIVE DATA ACCESS FUNCTIONS (Zero Fake Mocks)
// ==============================================================================

/**
 * Fetch a user's text-based profile metadata from Supabase
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!supabase) {
    console.error('[Supabase Error]: Cannot fetch profile - Supabase client unconfigured.');
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('[Supabase Error]: getUserProfile failed', error.message);
    return null;
  }

  return data as UserProfile;
}

/**
 * Upsert user profile metadata with avatar URL
 */
export async function upsertUserProfile(profile: Partial<UserProfile> & { id: string }): Promise<UserProfile | null> {
  if (!supabase) {
    console.error('[Supabase Error]: Cannot save profile - Supabase client unconfigured.');
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      ...profile,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('[Supabase Error]: upsertUserProfile failed', error.message);
    throw new Error(error.message);
  }

  return data as UserProfile;
}

/**
 * Fetch all live orders (or customer-specific orders).
 * If unconfigured or empty, returns empty array without hardcoded fallback.
 */
export async function fetchLiveOrders(customerEmail?: string): Promise<StoreOrderRecord[]> {
  if (!supabase) {
    console.error('[Supabase Error]: Cannot fetch orders - Supabase client unconfigured.');
    return [];
  }

  let query = supabase
    .from('store_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (customerEmail) {
    query = query.eq('customer_email', customerEmail);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[Supabase Error]: fetchLiveOrders failed', error.message);
    return [];
  }

  return (data || []) as StoreOrderRecord[];
}

/**
 * Fetch recipes from Supabase.
 */
export async function fetchLiveRecipes(): Promise<StoreRecipeRecord[]> {
  if (!supabase) {
    console.error('[Supabase Error]: Cannot fetch recipes - Supabase client unconfigured.');
    return [];
  }

  const { data, error } = await supabase
    .from('store_recipes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Supabase Error]: fetchLiveRecipes failed', error.message);
    return [];
  }

  return (data || []) as StoreRecipeRecord[];
}

/**
 * Save or update a recipe in Supabase
 */
export async function upsertLiveRecipe(recipe: Partial<StoreRecipeRecord> & { id: string }): Promise<StoreRecipeRecord | null> {
  if (!supabase) {
    console.error('[Supabase Error]: Cannot save recipe - Supabase client unconfigured.');
    throw new Error('Supabase client unconfigured');
  }

  const { data, error } = await supabase
    .from('store_recipes')
    .upsert({
      ...recipe,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('[Supabase Error]: upsertLiveRecipe failed', error.message);
    throw new Error(error.message);
  }

  return data as StoreRecipeRecord;
}

/**
 * Delete a recipe from Supabase
 */
export async function deleteLiveRecipe(recipeId: string): Promise<boolean> {
  if (!supabase) {
    console.error('[Supabase Error]: Cannot delete recipe - Supabase client unconfigured.');
    throw new Error('Supabase client unconfigured');
  }

  const { error } = await supabase
    .from('store_recipes')
    .delete()
    .eq('id', recipeId);

  if (error) {
    console.error('[Supabase Error]: deleteLiveRecipe failed', error.message);
    throw new Error(error.message);
  }

  return true;
}

/**
 * Update order fulfillment status
 */
export async function updateOrderStatus(reference: string, fulfillment_status: string): Promise<boolean> {
  if (!supabase) {
    console.error('[Supabase Error]: Cannot update order - Supabase client unconfigured.');
    return false;
  }

  const { error } = await supabase
    .from('store_orders')
    .update({ fulfillment_status })
    .eq('reference', reference);

  if (error) {
    console.error('[Supabase Error]: updateOrderStatus failed', error.message);
    return false;
  }

  return true;
}

/**
 * Fetch live product catalog from Supabase.
 */
export async function fetchLiveProducts(): Promise<any[]> {
  if (!supabase) {
    console.error('[Supabase Error]: Cannot fetch products - client unconfigured.');
    return [];
  }
  const { data, error } = await supabase.from('store_products').select('*');
  if (error) {
    console.error('[Supabase Error]: fetchLiveProducts failed', error.message);
    return [];
  }
  return data as any[];
}

/**
 * SQL SCHEMA SCRIPT TO INITIALIZE SUPABASE TABLES
 * Run this directly in your Supabase SQL Editor:
 *
 * CREATE TABLE IF NOT EXISTS profiles (
 *   id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 *   full_name TEXT,
 *   email TEXT,
 *   phone TEXT,
 *   avatar_url TEXT,
 *   default_address TEXT,
 *   default_zone TEXT,
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * CREATE TABLE IF NOT EXISTS store_orders (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   reference TEXT UNIQUE NOT NULL,
 *   user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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
 * CREATE TABLE IF NOT EXISTS store_recipes (
 *   id TEXT PRIMARY KEY,
 *   slug TEXT UNIQUE NOT NULL,
 *   name TEXT NOT NULL,
 *   headline TEXT,
 *   image TEXT,
 *   prep_time TEXT,
 *   cook_time TEXT,
 *   servings INT,
 *   difficulty TEXT,
 *   category TEXT,
 *   description TEXT,
 *   instructions JSONB NOT NULL,
 *   ingredients JSONB NOT NULL,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE store_orders ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE store_recipes ENABLE ROW LEVEL SECURITY;
 *
 * CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
 * CREATE POLICY "Users manage own profile" ON profiles FOR ALL USING (auth.uid() = id);
 * CREATE POLICY "Public insert orders" ON store_orders FOR INSERT WITH CHECK (true);
 * CREATE POLICY "Public read orders" ON store_orders FOR SELECT USING (true);
 * CREATE POLICY "Public read recipes" ON store_recipes FOR SELECT USING (true);
 * CREATE POLICY "Admin manage recipes" ON store_recipes FOR ALL USING (true);
 *
 * CREATE TABLE IF NOT EXISTS store_products (
 *   id TEXT PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   short TEXT,
 *   description TEXT,
 *   price NUMERIC NOT NULL,
 *   old_price NUMERIC,
 *   size TEXT,
 *   image TEXT,
 *   category TEXT NOT NULL,
 *   rating NUMERIC DEFAULT 4.8,
 *   review_count INT DEFAULT 0,
 *   stock INT DEFAULT 50,
 *   features JSONB DEFAULT '[]'::jsonb,
 *   specs JSONB DEFAULT '{}'::jsonb,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Public read products" ON store_products FOR SELECT USING (true);
 * CREATE POLICY "Admin manage products" ON store_products FOR ALL USING (true);
 */
