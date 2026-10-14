# Ladydee Minimart Store

A modern, mobile-responsive Nigerian groceries storefront — rice, beans, garri, cooking oil, noodles, beverages, household and baby essentials — with a full client-side cart, checkout, accounts and an admin console.

Everything runs in the browser. There is **no backend and no real payment processing**; all state (cart, wishlist, accounts, orders, admin data) lives in `localStorage`.

---

## 1. Quick start

Open `index.html` in a browser and you are running. No build step, no dependencies, no server required.

For **clean URLs** (`/cart` instead of `/cart.html`) serve the folder over HTTP — see section 3.

### Demo credentials

| What | Value |
|------|-------|
| Customer account | `alex@example.com` / `demo1234` |
| Admin console | password `ladydee2026` |
| Admin URL | `/adeolaadaccess112` |
| Coupon codes | `WELCOME10` (10% off), `FREESHIP` (free delivery) |
| Delivery promo codes | `FREEDEL`, `HALFDEL` |

---

## 2. Pages

| Page | Clean URL | File |
|------|-----------|------|
| Home | `/` | `index.html` |
| Shop / listing | `/products` | `products.html` |
| Product detail | `/product?id=…` | `product.html` |
| Search results | `/search?q=…` | `search.html` |
| Wishlist | `/wishlist` | `wishlist.html` |
| Cart & checkout | `/cart` | `cart.html` |
| Account dashboard | `/account` | `account.html` |
| Sign up | `/signup` | `signup.html` |
| Sign in | `/login` | `login.html` |
| Forgot password | `/forgot` | `forgot.html` |
| How it works | `/workflows` | `workflows.html` |
| **Test checkout (Paystack)** | `/checkout` | `checkout.html` |
| **Admin console** | `/adeolaadaccess112` | `adeolaadaccess112.html` |

Shared code: `app.js` (catalogue, cart, auth, orders, delivery rules, coupons), `brevi.js` (email), `admin.js` (admin console), `styles.css`.

### Shared components — edit once, every page updates

The **header, footer and mobile bottom bar are no longer duplicated** inside the pages. They live in one file each and are loaded by `components.js` into their mount points (`#site-header`, `#site-footer`, `#bottomNav`):

```
components/header.html        ← topbar, nav, search, cart/wishlist badges, drawer
components/footer.html        ← footer columns, contact details, payment pills
components/bottom-nav.html    ← sticky mobile Search / Cart / Account bar
components/gatekeeper.js      ← shared sign-in / verification guard for the <head>
components.js                 ← the loader (fetch + inline fallback)
build-components.js           ← regenerates the inline fallback
```

> **Changing the footer? Edit `components/footer.html` only.** Then run `node build-components.js` so the offline fallback copy stays in step.

Markup uses `{{token}}` placeholders that `app.js → renderComponents()` fills with live data (cart count, signed-in user, store contact details, clean-URL hrefs, active nav item). Icons are `<span data-i="…">` placeholders swapped for inline SVG at render time.

`components.js` resolves its own base path from the script tag, so the site works from the root, a sub-folder, or the CDN with no edits. It fetches the component files over HTTP and falls back to the generated inline copy when `fetch` is blocked (opening the files straight off disk with `file://`).

### Backend (optional, /api)

The site is fully functional **static-only**. Dropping it onto a host with serverless functions (Vercel, Netlify) additionally enables server-side keys. `api-client.js` probes `GET /api/health` once; if there is no backend, every caller silently falls back to the browser-only path.

```
api/health.js              GET  — reports which env vars are present (never their values)
api/email/send.js          POST — Brevo proxy; key stays server-side, no CORS problem
api/auth/signup.js         POST — server-side account creation + verification email
api/auth/verify.js         GET  — consumes the verification token, redirects to /login
api/checkout/ai-payout.js  POST — AI basket review before payout
```

```
vercel.json   clean URLs + /api and /components headers
_redirects    the same clean URLs for Netlify
.env.example  every server environment variable, documented
```

**Server environment variables** (hosting dashboard, never the browser):

| Variable | Enables |
|---|---|
| `DATABASE_URL` | Server-side accounts (Neon Postgres) |
| `BREVO_API_KEY` | Transactional email — order, verify, reset |
| `OPENAI_API_KEY` | AI basket review at checkout |
| `CLOUDINARY_SECRET` | Signed Cloudinary operations |
| `BREVO_SENDER_EMAIL` / `BREVO_SENDER_NAME` / `BREVO_REPLY_TO` | Sender + reply-to addresses |
| `SITE_URL` | Base URL used in verification links |

With `BREVO_API_KEY` set, `brevi.js` sends through `/api/email/send` and the key never reaches the browser — that is what fixes the previously blocked client-side mail setup. The admin console's **API keys** tab has a **Check backend** button that reports which integrations are live.

### Optional sign-in gate

`components/gatekeeper.js` is shipped but **not enabled** — no page carries
`data-guard-page`, so cart, checkout, account and wishlist behave exactly as
they always have. It exists so you have ONE place to enforce a sign-in rule
instead of copying the same guard into four pages. To switch it on for a page,
add `data-guard-page` to its `<html>` and the script to its `<head>`:

| `data-guard-page` | Effect |
|---|---|
| `protected` | must be signed in |
| `payout` | signed in **and** email-verified |
| absent / `public` | nothing happens |

```html
<html lang="en" data-guard-page="payout">
  …
  <script src="components/gatekeeper.js?v=10"></script>
</head>
```

A sensible starter set is `account.html` → `protected` and `checkout.html` →
`payout`; leave `cart.html` and `wishlist.html` open so a guest can fill a
basket and only be asked to sign in at checkout. Redirects resolve the sibling
`login.html`, never an absolute `/login`, so it works from a sub-path too.


---

## 3. Clean URLs

All internal links are written as clean paths (`href="/cart"`). `app.js` detects how the site is being served:

- **Served over HTTP with rewrites** → clean URLs are used as-is.
- **Opened as a local file** (`file://…/index.html`) → links are automatically rewritten to `*.html` so the site still works when you just double-click it.

Config files are included for the common static hosts:

| Host | File | What it does |
|------|------|--------------|
| Apache / cPanel | `.htaccess` | Rewrites `/products` → `/products.html` |
| Netlify | `_redirects` | 200-rewrites for every clean path |
| Vercel | `vercel.json` | `cleanUrls` + explicit rewrites |

**GitHub Pages / S3 / other hosts without rewrites:** the site still works — links fall back to `.html` automatically. If you want true clean URLs there, use a host that supports rewrites (Netlify, Vercel, Cloudflare Pages) or add the equivalent rule for your server.

---

## 4. Brevi email

Order confirmations, sign-up verification and password-reset emails are sent through **Brevi** (Brevo-compatible transactional email API).

### Demo mode (default)

With no API key configured, nothing is sent anywhere. Instead the exact email that *would* be sent is stored locally and can be previewed:

- After checkout → **“Preview confirmation email”** on the order confirmation screen.
- On sign-up / forgot-password → the **“Preview email”** button on the verification step.
- In the admin console → **Brevi email** tab → the email log, with a preview button per message.

### Going live

1. Get an API key from your Brevi / Brevo account.
2. Open the admin console → **Brevi email**.
3. Paste the key into **Brevi API key**, check the sender name and email, and save.
4. Click **Send test email** to confirm it works.

The key is stored in `localStorage` only and is sent to nothing except the configured endpoint. You can also set it from the browser console:

```js
LadydeeEmail.setConfig({ apiKey: 'xkeysib-…' });
LadydeeEmail.isLive();   // true once a key is set
```

Default endpoint: `https://api.brevo.com/v3/smtp/email` (change it in the admin settings if your Brevi endpoint differs).

---

## 5. Admin console

Path: **`/adeolaadaccess112`** (deliberately not `/admin`). Password: `ladydee2026`.

- **Dashboard** — revenue, orders, pending confirmations, stock alerts, registered customers, coupon redemptions.
- **Products** — add, edit and delete products. The form takes **2–3 images from your device**, shows a preview tile for each with a **Primary image** radio to pick the cover, plus name, category, price and description. Images upload to **Cloudinary** and the secure URLs are saved with the product.
- **API keys** — enter and save your own integration keys (Cloudinary cloud name / API key / upload preset, Brevo API key + sender + reply-to, Paystack public + secret). Stored in `localStorage` and used by the site. Each field is labelled with whether it is safe client-side, testing-only, or needs a server proxy.
- **Inventory** — stock levels with low-stock (≤30) and out-of-stock alerts, quick ±10 adjustments and restock.
- **Orders** — view every order, confirm or reject pending ones, advance status, open the full order detail.
- **Live deliveries** — a five-column board (Placed → Confirmed → Packed → Out for delivery → Delivered) with move-forward/back controls and a tracking timeline.
- **Coupons** — create percentage coupons with a **usage limit** and a live redemption counter; activate, deactivate or delete.
- **Customers** — every registered account with order count, total spend, verification status and CSV export.
- **Delivery & fees** — edit zone fees, the free-delivery threshold, the percentage-off-delivery rule, the member perk, and add or remove delivery promo codes.
- **Brevi email** — API key, sender details, test send and the full email log.

---

## 6. Delivery discounts

Delivery is priced by zone, then the best available discount is applied (never stacked twice):

- **Free delivery** over a configurable subtotal threshold (default ₦50,000).
- **Free delivery for signed-in members.**
- **Percentage off delivery** as a fallback rule.
- **Delivery promo codes** entered at checkout (e.g. `FREEDEL`, `HALFDEL`).

The final fee, the saving and the reason are itemised in the order summary before payment. All of it is editable in the admin console.

---

## 7. Product images, lazy loading & filters

**Uploading a product.** In the admin console → **Products** → **Add product**, pick 2–3 images from your device. Each appears as a preview tile; tick **Primary image** under the one that should be the cover in the grocery grid. Fill in name, category, price and description, then **Create product**. The product is saved in this shape:

```json
{
  "productName": "Fresh Organic Strawberries",
  "category": "Fruits",
  "price": 4.50,
  "primaryImage": "https://res.cloudinary.com/…/image/upload/…",
  "additionalImages": ["https://…", "https://…"]
}
```

Uploaded products appear in the storefront grid, search, wishlist and product pages immediately.

**Cloudinary setup.** Create a free Cloudinary account, then in **Settings → Upload** create an **unsigned upload preset**. Enter your **cloud name** and the **preset name** in the admin's **API keys** tab. An unsigned preset is designed to be public — it can only upload, never read or delete your library. Your Cloudinary **API secret** must never be placed in the site.

**No Cloudinary configured?** The form still works: images are stored as local data URLs so you can test the whole flow offline. Add the keys when you are ready to go live.

**Fast image loading.** Product images are lazy-loaded — the real image is only requested from the CDN when its card is about to scroll into view (IntersectionObserver, 250px look-ahead). A shimmering skeleton box reserves the exact space so the layout never jumps, then the image fades in. Cloudinary URLs automatically get `f_auto,q_auto` appended, so modern browsers receive WebP/AVIF at an automatically compressed quality.

**Filters.** The shop and search sidebars use simple text checkboxes only — **Category**, **Availability** (In Stock / Out of Stock), **Offers** (On sale / In stock only) — alongside the existing price and rating controls.

---

## 8. Paystack test-mode checkout

Open **`/checkout`** (linked from the footer and the mobile drawer). It walks the whole payment and payout flow with **no real money**:

1. **Keys** — paste a Paystack **test public key** (`pk_test_…`). Any value works for the demo.
2. **Card** — click one of Paystack's published test cards to fill the form, or type your own. The card ending `667` is declined; the others succeed.
3. **Result** — a simulated success or decline with a receipt (reference, card, mode, amount).
4. **Payout** — a simulated seller transfer showing the gross charge, the test fee and the net payout.

**Test cards:** `4084 0840 8408 4081` (success, Visa) · `5060 6666 6666 6666 666` (success, Verve) · `5060 6666 6666 6666 667` (declined).

> The Paystack **public key** is safe in the browser. The **secret key** must never be used client-side in production — it can move money. Route it through a small serverless function.

---

## 9. Notes

- Prices are in Naira (₦) and are realistic sample figures for a Nigerian groceries store.
- Product images are original generated artwork with no third-party brand logos.
- This is a demonstration store: no real payments are taken and no data leaves the browser.
