# Payment setup — test ↔ live in ONE switch

The store's payment integration is now wired into the real buying flow. **Buy now**,
the cart's payment step and `/checkout` all lead to the same server-backed payment.
Nothing is reachable only from a footer link any more.

---

## 1. The one place that decides test vs live

> ### 👉 `lib/payment-config.js`
>
> That file is the single source of truth for the payment mode. **You do not need to
> edit it to switch modes** — it reads the mode from a setting or an environment
> variable. It is the file to *read* when you want to understand the rules.

The mode comes from, in priority order:

1. **The saved setting** — Admin → Integrations → **Payments — Paystack** → *Payment mode*
2. **The `PAYMENT_MODE` environment variable**

---

## 2. Switching the store to LIVE

In your hosting project (Vercel → **Settings → Environment Variables**):

| Variable | Value |
|---|---|
| `PAYMENT_MODE` | `live` |
| `PAYSTACK_SECRET_KEY` | `sk_live_…` (your **live** secret key) |

Then **redeploy**. That is the whole change — no code edits, no file replacements.

You can set the mode from the admin console instead of the env var if you prefer
(Admin → Integrations → Payments); the key still comes from the environment.

## 3. Staying in TEST (the default)

| Variable | Value |
|---|---|
| `PAYMENT_MODE` | `test` (this is the default when unset) |
| `PAYSTACK_SECRET_KEY` | `sk_test_…` (your **test** secret key) |

Test mode runs the **real** checkout journey against Paystack's test environment, so
you can prove the whole path end to end without a naira moving. Use Paystack's test
cards.

## 4. Sandbox mode (offline previews only)

| Variable | Value |
|---|---|
| `PAYMENT_MODE` | `demo` |

Runs the entire purchase journey with **no Paystack account and no money at all**. Use
it to demonstrate the flow on a laptop or a preview URL. It is **refused** the moment a
real `sk_test_` / `sk_live_` key is present, so it can never be reached on a store that
can take real payments.

---

## 5. The safety rail — the mode and the key MUST agree

The one mistake that costs real money is believing you are testing while you are live.
So checkout **refuses to start** when they disagree:

| `PAYMENT_MODE` | key is | result |
|---|---|---|
| `live` | `sk_test_…` | **refused** — you would otherwise "prove" a payment that never happened |
| `test` | `sk_live_…` | **refused** — you would otherwise charge real cards while thinking you were testing |
| `live` | `sk_live_…` | ✅ live payments run |
| `test` | `sk_test_…` | ✅ test payments run |
| `demo` | none | ✅ sandbox preview |

The current verdict — mode in force, whether checkout can start, and *why not* when it
cannot — is shown in two places:

- **Admin → Transactions** (banner at the top)
- **Admin → Integrations → Payments** (banner under the key fields)
- and in the storefront's own payment step (a Test / Sandbox banner above the pay button)

`GET /api/health` returns the same information (`payment.mode`, `payment.usable`,
`payment.problems`) — mode **name** and flags only, **never a key**.

---

## 6. Environment variables — full list

| Variable | Required | Purpose |
|---|---|---|
| `PAYMENT_MODE` | recommended | `test` / `live` / `demo`. Defaults to `test`. |
| `PAYSTACK_SECRET_KEY` | ✅ for test/live | `sk_test_…` or `sk_live_…`. **Server only — never sent to the browser.** |
| `DATABASE_URL` | ✅ | Postgres (Neon) connection string. Orders live here. |
| `SITE_URL` | ✅ for test/live | Public site origin, e.g. `https://your-store.com`. Used for the payment return URL. Falls back to the request's own host. |
| `PAYSTACK_PUBLIC_KEY` | optional | Not needed — the store uses Paystack's **hosted** checkout. Kept for future use. |
| `DELIVERY_FEE_NGN` | optional | Flat delivery fee in naira. When unset: free at/above ₦50,000, otherwise ₦1,500. |
| `ADMIN_PASSWORD` | ✅ | Staff console password. |

---

## 7. Where the money path lives (for future you)

| File | Role |
|---|---|
| `lib/payment-config.js` | **The test/live switch** and the safety rails. |
| `lib/order.js` | Server-side order engine: re-prices the cart, creates orders, owns the `store_orders` table and order statuses. |
| `api/checkout/paystack.js` | `POST` starts a payment · `GET` verifies it. Used for **both** test and live. |
| `api/checkout/sandbox.js` | The offline `demo` provider. Refused unless `PAYMENT_MODE=demo`. |
| `api/checkout/webhook.js` | Paystack's safety net — HMAC-verified, reconciles a payment even if the shopper closes the browser. |
| `api/admin/orders.js` | The admin transaction console (read-only). |
| `checkout-flow.js` | The browser-side engine both the cart and `/checkout` use. Picks the route from the mode. |

### Server-side trust rules (never trust the browser)

- Every line is **re-priced from `lib/store-catalog.js`** — a browser-supplied price is ignored.
- Delivery is **calculated on the server**.
- An order is created as `pending` **before** the provider is called, so a payment can
  always be traced to a real order.
- An order is marked `paid` **only** when the provider confirms the **amount**, the
  **currency** and the **reference** all match the stored order.
- A `paid` order can never be flipped back to `failed`.

---

## 8. Webhook (recommended before going live)

Paystack → **Settings → API Keys & Webhooks** → Webhook URL:

```
https://YOUR-SITE.com/api/checkout/webhook
```

The signature is verified with the configured key, so a test-mode deployment can never
be credited by a live charge and vice versa. While `PAYMENT_MODE=demo` (no key) the
webhook refuses everything.

---

## 9. Going live — the recommended order

1. Stay in `test` + `sk_test_…`.
2. Do a real test purchase through **Buy now** → checkout → terms → pay.
3. Open **Admin → Transactions** and confirm the order appears as **Paid** with mode
   **Test**. (Its reference starts `LDM-`.)
4. Set `PAYMENT_MODE=live` and `PAYSTACK_SECRET_KEY=sk_live_…`, then redeploy.
5. Open **Admin → Integrations → Payments** — the banner must say **LIVE**.
6. Make one small real purchase and confirm it appears as **Paid** with mode **Live**.
7. Confirm the webhook URL above is saved in Paystack.

If step 3 shows nothing, the payments were not reaching the server — check
`DATABASE_URL` and the mode banner before switching to live.

---

## 10. Old documentation that no longer applies

`CHANGED-FILES.txt` and `DELETE-THESE-FILES.txt` describe an earlier iteration of this
project. Some files they tell you to delete do not exist here, and their description of
`checkout.html` is now out of date. See `README-DELETIONS.md` for the accurate,
current list.
