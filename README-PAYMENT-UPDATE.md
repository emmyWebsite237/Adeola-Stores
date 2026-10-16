# Adeola Stores — Payment Integration Update

This zip contains **only the files that were added or updated** in the payment-integration
work. It is **not** the whole project.

## How to apply

Copy every file in this zip over your existing project, **keeping the same folder paths**
(the structure inside the zip mirrors the project root). Overwrite when asked.

```
unzip adeola-stores-payment-update.zip -d /path/to/your/adeola-stores
```

Then redeploy. No other steps are required — no database migration, no config edit to get
running (the store stays in **test** mode by default).

> **Note:** `PAYSTACK-SETUP.md`, `README-CHANGES.md` and `README-DELETIONS.md` are
> documentation files that live at the project root. They are included for reference and
> are safe to keep or discard.

---

## Files in this zip

### Added (9)

| File | What it is |
|---|---|
| `lib/payment-config.js` | **The one test/live switch** plus the safety rails (mode/key agreement check). |
| `lib/order.js` | Server-side order engine: re-prices the cart from the trusted catalogue, creates orders, owns the `store_orders` table. |
| `api/checkout/sandbox.js` | The offline `demo` payment provider — refused unless `PAYMENT_MODE=demo`. |
| `api/admin/orders.js` | Authenticated endpoint behind the new admin Transactions tab. |
| `checkout-flow.js` | The browser-side checkout engine shared by the cart and `/checkout`. |
| `checkout.css` | Styles for checkout, mode banners, the terms box, the receipt and the admin console. |
| `PAYSTACK-SETUP.md` | The test↔live guide (replaces the old, outdated one). |
| `README-DELETIONS.md` | The reviewed list of files you may safely delete. |
| `README-CHANGES.md` | The full change summary for this build. |

### Updated (12)

| File | What changed |
|---|---|
| `checkout.html` | Rebuilt: delivery form, **required terms acceptance**, mode banner, payment result handling, printable receipt. |
| `cart.html` | Payment step now hands online methods to the real checkout; added terms acceptance and the mode banner. Pay-on-delivery unchanged. |
| `product.html` | **Buy now** wired into `/checkout`. |
| `components/footer.html` | Removed the "Test checkout (Paystack)" link; corrected the "Demo store" footer claim. |
| `components.js` | Regenerated from `components/*.html` (`node build-components.cjs`). |
| `app.js` | Removed the mobile drawer's "Test checkout" link. Nothing else changed. |
| `api/checkout/paystack.js` | Respects `PAYMENT_MODE`, requires verified accounts + accepted terms, creates the order before calling Paystack, confirms amount + currency + reference before marking paid. |
| `api/checkout/webhook.js` | Mode-aware HMAC verification; refuses everything while in `demo`. |
| `api/health.js` | Reports the payment mode (name only — never a key). |
| `lib/settings.js` | Added the `payment_mode` setting. |
| `api/admin/settings.js` | Returns the live payment verdict to the admin console. |
| `admin.js` | New **Transactions** tab; payment-mode dropdown and verdict banner in Integrations → Payments. |

---

## Switching test → live

Set these two environment variables and redeploy — no code changes:

| Variable | Test | Live |
|---|---|---|
| `PAYMENT_MODE` | `test` (default) | `live` |
| `PAYSTACK_SECRET_KEY` | `sk_test_…` | `sk_live_…` |

If the mode and the key disagree, checkout **refuses to start** — so you can never
accidentally charge real cards while thinking you are testing.

See `PAYSTACK-SETUP.md` for the full walkthrough.
