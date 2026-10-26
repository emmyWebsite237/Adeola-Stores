# 🛒 Adeola Stores (Lady Dee Minimart) - Full Setup & Deployment Guide

This guide walks you through setting up every piece of your reconstructed modern React + TypeScript e-commerce platform, including **Supabase**, **Cloudinary**, **Paystack**, and **Vercel**.

---

## 📋 Table of Contents
1. [Fast Start: Run Locally in 2 Minutes](#1-fast-start-run-locally-in-2-minutes)
2. [Database Setup: Supabase (PostgreSQL)](#2-database-setup-supabase-postgresql)
3. [Image Hosting & CDN: Cloudinary](#3-image-hosting--cdn-cloudinary)
4. [Nigerian Payment Gateway: Paystack](#4-nigerian-payment-gateway-paystack)
5. [Deploy to Production on Vercel](#5-deploy-to-production-on-vercel)
6. [Store Features & Navigation Map](#6-store-features--navigation-map)

---

## 1. Fast Start: Run Locally in 2 Minutes

You can run this project on your computer immediately. Even without setting up Supabase, Cloudinary, or Paystack yet, the app runs smoothly with offline mock fallbacks and local storage persistence!

### Step 1: Open Terminal in Project Directory
```bash
cd "adeola-stores-app"
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start the Development Server
```bash
npm run dev
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**.
- Customer Storefront: `http://localhost:3000`
- Cook Tonight (Recipe Hub): `http://localhost:3000/cook`
- Household Bundles: `http://localhost:3000/bundles`
- Basket & Free Lagos Delivery Meter: `http://localhost:3000/cart`
- Checkout & Paystack Modal: `http://localhost:3000/checkout`
- Merchant Operations Admin Hub: `http://localhost:3000/admin`

---

## 2. Database Setup: Supabase (PostgreSQL)

Supabase gives you a free, lightning-fast PostgreSQL database with a friendly web dashboard to view customer orders and payments.

### Step 1: Create a Free Project
1. Go to [https://supabase.com](https://supabase.com) and click **Sign Up** or **Sign In** (you can sign in with your GitHub account).
2. Click **New Project**.
3. Choose your organization, name your project `adeola-stores-db`, and set a strong database password.
4. Select the region closest to Nigeria (e.g. **London (eu-west-2)** or **Frankfurt (eu-central-1)**).
5. Click **Create new project** and wait ~1 minute for it to finish provisioning.

### Step 2: Run the SQL Schema to Create Tables
1. In the Supabase left navigation bar, click on **SQL Editor** (icon that looks like `>_`).
2. Click **New Query**.
3. Copy and paste the following SQL script into the query editor:

```sql
-- 1. Create Orders Table for Store Purchases
CREATE TABLE IF NOT EXISTS store_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_zone TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  delivery_fee NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  vat NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  fulfillment_status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Store Settings Table
CREATE TABLE IF NOT EXISTS store_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS) with Public Read/Insert for Checkout
ALTER TABLE store_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts on checkout"
ON store_orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read of own order references"
ON store_orders FOR SELECT USING (true);
```
4. Click **Run** (or `Ctrl + Enter`). You will see `Success: No rows returned`.

### Step 3: Copy Your Supabase API Keys
1. Go to **Project Settings** (gear icon at the bottom of the left sidebar) -> **API**.
2. Copy the **Project URL** (e.g. `https://xyzabc.supabase.co`).
3. Copy the **Project API Keys** -> `anon` `public` key.
4. Open or create `.env.local` in your `adeola-stores-app` folder and paste them:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xyzabc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Now all online and offline checkout orders will sync directly to your Supabase cloud table!

---

## 3. Image Hosting & CDN: Cloudinary

Cloudinary automatically compresses your grocery photos, converts them to modern next-gen WebP/AVIF formats, and delivers them instantly over global CDNs so mobile users on 3G/4G in Lagos load the site in under 1 second.

### Step 1: Create a Free Account
1. Go to [https://cloudinary.com](https://cloudinary.com) and click **Sign Up For Free**.
2. Note your **Cloud Name** displayed on the dashboard home screen (e.g. `adeola-stores`).

### Step 2: Create an "Unsigned" Upload Preset
This allows you or your staff to upload product photos directly from the browser without exposing private API secrets:
1. In Cloudinary, click the **Settings** (gear icon) in the bottom left.
2. Select the **Upload** tab.
3. Scroll down to **Upload presets** and click **Add upload preset**.
4. Set **Signing Mode** to **Unsigned**.
5. Set **Preset name** to `adeola_products`.
6. Set **Folder** to `adeola_stores/products`.
7. Click **Save**.

### Step 3: Add Keys to `.env.local`
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=adeola-stores
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=adeola_products
```

### Step 4: Use the Built-in Image Uploader
1. Open your admin dashboard at `http://localhost:3000/admin`.
2. Look at the right sidebar: **Cloudinary Image Uploader**.
3. Choose any image from your computer or phone — it uploads instantly and gives you a clean CDN URL that you can paste into your product list!

---

## 4. Nigerian Payment Gateway: Paystack

Paystack allows your customers to pay using:
- Nigerian Debit Cards (Mastercard, Visa, Verve)
- Direct Bank Transfer (with instant virtual account number)
- USSD (*737#, *894#, *966#, etc.)
- OPay, PalmPay & Apple Pay

### Understanding Paystack Starter Business in Nigeria
- **Can you accept payments without CAC registration?** Yes! Paystack's **Starter Business** allows you to collect up to **₦8,000,000** without CAC incorporation certificates.
- **Can you withdraw/receive payouts?** Yes! Paystack settles directly to your personal Nigerian commercial bank account (Access, GTCO, Zenith, Kuda, etc.) as long as your BVN, NIN, and bank account name match your profile.

### Step 1: Obtain Paystack API Keys
1. Log in to [https://dashboard.paystack.com](https://dashboard.paystack.com).
2. Go to **Settings** -> **API Keys & Webhooks**.
3. You will see:
   - **Test Public Key** (`pk_test_...`)
   - **Test Secret Key** (`sk_test_...`)
   - **Live Public Key** (`pk_live_...`) *(once your business account is activated)*
   - **Live Secret Key** (`sk_live_...`)

### Step 2: Add Keys to `.env.local`
```env
# For Testing:
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxx

# When Ready to Go Live:
# NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxx
# PAYSTACK_SECRET_KEY=sk_live_xxxxxx
```

### Step 3: Configure Webhook URL
A webhook notifies your website automatically when a customer's bank transfer succeeds:
1. In the same **API Keys & Webhooks** tab on Paystack:
2. In the **Test Webhook URL** field, set:
   `https://your-domain.vercel.app/api/checkout/webhook`
3. Click **Save Changes**.

---

## 5. Deploy to Production on Vercel

Since you are already comfortable with GitHub and Vercel, deploying takes under 3 minutes:

### Step 1: Push Project to GitHub
```bash
git init
git add .
git commit -m "Launch reconstructed Adeola Stores React app"
git branch -M main
git remote add origin https://github.com/your-username/adeola-stores.git
git push -u origin main
```

### Step 2: Import Project in Vercel
1. Go to [https://vercel.com](https://vercel.com) and log in.
2. Click **Add New...** -> **Project**.
3. Select your `adeola-stores` GitHub repository and click **Import**.
4. In the **Environment Variables** section, expand it and add your variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `PAYSTACK_SECRET_KEY`
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
5. Click **Deploy**.

Vercel builds the Next.js application and gives you a live global HTTPS URL (e.g. `https://adeola-stores.vercel.app`).

---

## 6. Store Features & Navigation Map

| Page | URL Path | What It Does |
|---|---|---|
| **Marketplace Home** | `/` | Responsive hero banner, Quick categories, "Cook Tonight" spotlight, Household Bundles, Deals of the Day. |
| **Full Supermarket** | `/shop` | All 78 grocery items, filter by aisle, search with live autocomplete, sort by price. |
| **Cook Tonight Hub** | `/cook` | Authentic Nigerian recipes (Party Jollof, Egusi Soup, etc.) with ingredient checklists and 1-tap bundle add. |
| **Household Bundles** | `/bundles` | Curated bulk kits (Family Monthly, Student Survival, Weekend Soup Pack) saving up to 15%. |
| **Product Detail** | `/product/[id]` | Per-unit pricing, volume discounts, quick WhatsApp order link, delivery zone estimates. |
| **Cart & Delivery Meter**| `/cart` | Dynamic progress meter toward the ₦35,000 Free Lagos Delivery milestone, zone selector, coupon codes. |
| **Checkout** | `/checkout` | Delivery address form, Paystack inline modal (Card/USSD/Transfer), terms agreement. |
| **Order Receipt** | `/checkout/confirmation` | Clean printable digital receipt with order reference and WhatsApp dispatch tracking. |
| **Customer Account** | `/account` | Live 4-stage delivery tracker ladder, saved delivery addresses, past order history. |
| **Merchant Admin** | `/admin` | Total revenue KPI, live orders table, rider dispatch status updates, and Cloudinary image uploader. |
| **Terms of Service** | `/terms` | Paystack-compliant grocery sales, delivery schedules, and cancellation policies. |
| **Returns & Refunds** | `/returns` | 100% doorstep inspection guarantee and 24-48h Paystack refund terms. |
| **Privacy Policy** | `/privacy` | NDPR-compliant customer data security policies. |

---

## Need Help?
- **Brand Colors:** Maintained at `#166534` (Forest Green), `#edf9f0` (Soft Green), `#f59e0b` (Gold/Amber), `#dc2626` (Coral), `#111827` (Ink), and `#fafbf9` (Cream).
- **Offline Mode:** If any external service is temporarily unreachable, the app automatically switches to secure local persistence without crashing.
