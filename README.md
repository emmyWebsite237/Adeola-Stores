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
| **Admin console** | `/adeolaadaccess112` | `adeolaadaccess112.html` |

Shared code: `app.js` (catalogue, cart, auth, orders, delivery rules, coupons, header/footer), `brevi.js` (email), `admin.js` (admin console), `styles.css`.

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
- **Products** — add, edit and delete products (name, category, price, compare-at price, size, stock, image, badge, description).
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

## 7. Notes

- Prices are in Naira (₦) and are realistic sample figures for a Nigerian groceries store.
- Product images are original generated artwork with no third-party brand logos.
- This is a demonstration store: no real payments are taken and no data leaves the browser.
