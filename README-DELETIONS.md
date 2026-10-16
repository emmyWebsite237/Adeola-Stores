# Files that can be safely deleted

**Nothing has been deleted.** This list is for you to review and action yourself, in
case you would rather keep any of it. Every claim below was verified by scanning the
codebase for references (`href`, `src`, `url(...)`, `import`) and checking whether
anything actually loads the file.

---

## 1. Confirmed dead — safe to delete

### `utils/products-manifest.js`
The old hard-coded grocery list, replaced by `lib/store-catalog.js` (the server-side
catalogue that prices orders).
It is imported by exactly one file — `api/utils/cloudinary-auto-seed.js` — and that
file is itself dead (see next entry). Nothing else in the project reads it.

### `api/utils/cloudinary-auto-seed.js`
A one-off seeding script that needed the old manifest and a Cloudinary account. It is
never called by any page, by any API route, or by any build script. Product images are
now uploaded per product in the admin console instead.
> ⚠️ These two are **linked**: delete `cloudinary-auto-seed.js` first. Once it is gone,
> `products-manifest.js` has no importer at all. (If you delete the manifest but keep
> the seeder, the seeder will crash when it finally does run.)

### `api/checkout/ai-payout.js`
Exposes `apiClient.aiPayout()` — which was **never called by any page**, in the original
project or this one. `api-client.js` still defines the helper, so the endpoint can stay
if you plan to use the AI basket-review feature; it degrades gracefully without an
OpenAI key. Delete it only if you do not intend to use that feature, and if you do,
also remove the `aiPayout` helper (lines ~125–130 and the export at ~158 of
`api-client.js`).

---

## 2. Stale documentation — delete or replace

### `DELETE-THESE-FILES.txt`
Out of date. Of the six files it tells you to delete, **four no longer exist** in this
project (`api/auth/signup.js`, `api/auth/verify.js`, `build-catalog.js`,
`build-components.js` — already removed), and the two that do exist are covered above
with a corrected explanation. Superseded by this README.

### `CHANGED-FILES.txt`
Describes an earlier iteration — its note about `checkout.html` ("replaces the
simulated test-card flow") no longer matches reality. Superseded by
`PAYSTACK-SETUP.md` and `README-CHANGES.md`.

---

## 3. Keep — these look unused but are not

Do **not** delete any of these. Static-analysis scanners flag them as "unreferenced"
because they are serverless routes or build tooling, not browser assets:

| File | Why it must stay |
|---|---|
| `api/admin/login.js` | Staff sign-in route — reached by `fetch('/api/admin/login')`, not by a script tag. |
| `api/admin/settings.js` | Admin settings route — reached by `fetch`. |
| `api/admin/orders.js` | **New** — powers the admin Transactions tab. |
| `api/health.js` | Reached by `fetch('/api/health')` on every page load. |
| `api/auth/[action].js` | Vercel dynamic route — the `[action]` filename is intentional. |
| `api/email/send.js` | Called by `fetch` from the email helpers. |
| `api/checkout/paystack.js` · `sandbox.js` · `webhook.js` | Reached by `fetch` / by Paystack. |
| `lib/*.js` | Imported by the API routes above, never by the browser. |
| `build-catalog.cjs` · `build-components.cjs` | Build tooling, run with `node`. |
| `components/*.html` | Source for `components.js` via `build-components.cjs`. |

---

## 4. Note on the old `build-*.js` names

`DELETE-THESE-FILES.txt` refers to `build-catalog.js` and `build-components.js`. Neither
exists — this project uses the `.cjs` versions. **Do not rename them**: `package.json`
may be `"type": "module"`, in which case a plain `.js` build script would fail to run.
