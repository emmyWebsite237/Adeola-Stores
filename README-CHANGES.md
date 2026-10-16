# What changed in this build

## The problem, in one line

A complete, working Paystack integration already existed at `/checkout` — but **nothing
in the buying flow ever went there**. The only door to it was a footer link
("Test checkout (Paystack)"), and the cart's own payment step ended in
`placeOrder()`, which wrote a **fake localStorage order** ("Demo checkout — no real
payment is taken"). So the real payment was an orphan page and the shopping journey was
a dead end.

## The fix

Payment is now reached through the **normal buying journey**. Three entry points, one
engine:

```
Buy now (product page) ─┐
Cart → step 3 (pay)    ─┼─→ the shared checkout engine ─→ the server creates the order
/checkout              ─┘                                  └→ the provider's page
                                                              └→ verified → receipt
```

- **Buy now** now adds the item and goes straight to `/checkout`, instead of detouring
  into the fake demo order.
- **The cart's payment step** (step 3) hands online methods (Card / Bank transfer /
  USSD) to the real payment. **Pay on delivery** keeps its own working local flow.
- **The footer-only entry point is gone** (`components/footer.html`, and the same link
  in the mobile drawer in `app.js`).

---

## Files added

| File | What it does |
|---|---|
| `lib/payment-config.js` | **The one test/live switch** + the safety rails. See `PAYSTACK-SETUP.md`. |
| `lib/order.js` | Server-side order engine: re-prices the cart from the trusted catalogue, creates orders, owns the `store_orders` table. |
| `api/checkout/sandbox.js` | The offline `demo` payment provider, refused unless `PAYMENT_MODE=demo`. |
| `api/admin/orders.js` | Authenticated endpoint behind the new admin Transactions tab. |
| `checkout-flow.js` | The browser-side engine shared by the cart and `/checkout`. |
| `checkout.css` | Styles for checkout, the mode banners, the terms box, the receipt and the admin console. |
| `PAYSTACK-SETUP.md` | Rewritten. The test↔live guide (this replaces the old, outdated one). |
| `README-DELETIONS.md` | The reviewed list of files you may safely delete. |
| `README-CHANGES.md` | This file. |

## Files changed

| File | Change |
|---|---|
| `checkout.html` | Rebuilt: delivery form, **required terms acceptance**, mode banner, payment result handling, printable receipt. |
| `cart.html` | Payment step now hands online methods to the real checkout; added terms acceptance and the mode banner. Pay-on-delivery unchanged. |
| `product.html` | Buy now wired into `/checkout`. |
| `components/footer.html` | Removed the "Test checkout (Paystack)" link; corrected the "Demo store — no real payments are processed" footer claim. |
| `components.js` | Regenerated from `components/*.html` (`node build-components.cjs`). |
| `app.js` | Removed the mobile drawer's "Test checkout" link. **Nothing else** — all cart, session, catalogue and helper logic is byte-identical to the original. |
| `api/checkout/paystack.js` | Now respects `PAYMENT_MODE`, requires verified accounts and accepted terms, creates the order *before* calling Paystack, and confirms amount + currency + reference before marking paid. |
| `api/checkout/webhook.js` | Mode-aware HMAC verification; refuses everything while in `demo`. |
| `api/health.js` | Reports the payment mode (name only — never a key). |
| `lib/settings.js` | Added the `payment_mode` setting. |
| `api/admin/settings.js` | Returns the live payment verdict to the admin console. |
| `admin.js` | New **Transactions** tab; payment-mode dropdown and verdict banner in Integrations → Payments. |

### Untouched, byte-for-byte

`lib/store-catalog.js` · `lib/users.js` · `lib/brevo.js` · `lib/mail.js` ·
`api/auth/[action].js` · `api/admin/login.js` · `api/email/send.js` · `brevi.js` ·
`api-client.js` · and all 9 other pages (`index`, `products`, `product` markup aside …
`account`, `login`, `signup`, `forgot`, `wishlist`, `search`, `workflows`,
`adeolaadaccess112`). Only **3 of 13 pages** changed: `cart.html`, `checkout.html`,
`product.html`.

---

## Safety rules now enforced on the server

The browser is never trusted with money:

1. Every line is **re-priced from `lib/store-catalog.js`**; a browser-supplied price is ignored.
2. Delivery is **calculated on the server**.
3. The order is created `pending` **before** the provider is called.
4. An order becomes `paid` **only** when the provider confirms **amount + currency + reference**.
5. A `paid` order can never be reverted to `failed`.
6. `PAYMENT_MODE` and the secret key must agree, or checkout **refuses to start**.
7. No key is ever sent to the browser — `/api/health` exposes only the mode name and flags.
8. Checkout requires a **signed-in, email-verified** account, and **accepted terms** (recorded on the order).

---

## The surprise additions

### 1. Admin → Transactions (a payment console)
A new, read-only tab that lists every payment the store has taken — **test and live
side by side** — with reference, customer, delivery, mode, status and total, plus KPIs
(paid value, paid / pending / failed counts) and mode/status filters. It answers the
question that actually matters before switching to live: *"are my test payments really
landing?"* You can now prove it instead of assuming it. It also shows the payment-mode
verdict banner at the top.

### 2. A real order receipt
The success screen is now a proper receipt: store name, `PAID` badge, reference, date,
mode, line items with quantities, subtotal / delivery / total, and the delivery address —
plus a **Print receipt** button that opens a clean print view. Previously a paid order
just showed a toast and vanished.

### 3. Smaller touches
- A clear **Test / Sandbox banner** above the pay button, so nobody is confused about
  whether real money is moving.
- **Terms & conditions acceptance** — required, recorded on the order
  (`terms_accepted`, `terms_accepted_at`), and validated again on the server.
- **Form state is preserved** across the sign-in hop: if a shopper must sign in before
  paying, their delivery details are restored instead of retyped.
- The payment amount is explicitly labelled as **server-calculated** in the summary, so
  a minor difference between the estimate and the provider's page is never a surprise.

---

## How to switch to live

See `PAYSTACK-SETUP.md`. Short version: set `PAYMENT_MODE=live` and
`PAYSTACK_SECRET_KEY=sk_live_…`, then redeploy. No code changes.
