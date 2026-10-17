# Paystack checkout setup

This patch replaces the demonstration card-entry checkout with Paystack-hosted checkout. Customers must have a verified server account before an order can be initialized. The API recalculates product prices on the server, stores a pending order in Neon, and only marks it paid after Paystack verification (or a valid webhook).

## Vercel environment variables

Set these in the Adeola Stores Vercel project and redeploy:

- `DATABASE_URL` — the existing Neon database connection string.
- `PAYSTACK_SECRET_KEY` — Paystack **test** secret key while testing. Never put this key in browser code or commit it.
- `SITE_URL` — the exact deployed HTTPS origin, e.g. `https://your-store.vercel.app` (no trailing slash).
- `DELIVERY_FEE_NGN` — optional server-controlled delivery fee in naira. If omitted, delivery is ₦1,500 below ₦50,000 and free at/above ₦50,000.

`PAYSTACK_PUBLIC_KEY` may remain configured in the existing settings helper, but this hosted-checkout implementation does not expose or need it in the browser.

## Configure the webhook

In Paystack Dashboard → API Keys & Webhooks, set the webhook URL to:

`https://YOUR-DEPLOYED-HOST/api/checkout/webhook`

Use the same test/live mode as the secret key. The webhook verifies `x-paystack-signature` with HMAC-SHA512 and checks the transaction amount, currency, reference, and status against the stored order.

## Test checklist

1. Deploy with Paystack test credentials and a valid `DATABASE_URL` / `SITE_URL`.
2. Sign up with a real inbox you can verify, then sign in.
3. Add products from the built-in storefront catalogue to the cart and open checkout.
4. Enter delivery details. Paystack's hosted page should show the server-calculated amount.
5. Complete a Paystack test transaction; return to `/checkout?reference=...` and confirm the page says **Payment verified**.
6. Test a failed or abandoned transaction and confirm it is not marked paid.
7. Confirm the `store_orders` table records pending/paid/failed status.

Do not switch to live keys until the complete flow has been tested.

## Catalogue limitation

The current admin product editor saves additional products in the visitor's browser `localStorage`; that data is not authoritative on the server and cannot safely be used to charge customers. The checkout deliberately rejects product IDs that are not in `lib/store-catalog.js`. Sync admin product changes into a server-side catalogue before enabling payment for those products.
