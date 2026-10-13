## CUSTOMER PORTAL (ShopPay) — staging entry, proven live 2026-09-07

- **Entry (there is NO portal password):** in the shop app click the **round avatar, top right** →
  **"Customer Portal"**. A new tab opens at `https://staging.portal.shopview.com/invoices`; the click
  mints `shopview_customer_portal_session` for the same signed-in shop user. Production is
  `https://portal.shopview.com`.
- **🛑 THE CLICK IS TWO CALLS, NOT ONE — the sso-login needs a BEARER TOKEN (corrected 2026-09-12).**
  An earlier version of this bullet said only *"the click does `POST …/sso-login`"*. Posting that on its
  own answers **401 `{"error":"Login to Customer Portal failed.","message":"No token provided."}`** and
  drops you on the portal's own email/password login card — which looks like "no access" and is not.
  **The real sequence, from `usePortalRedirect.*.js`, proven live 2026-09-12:**
  1. `POST https://<api-host>/api/token` (shop-app session cookies) → `data.accessToken`, a JWT.
  2. `POST https://staging.portal.shopview.com/sso-login` with header
     `Authorization: Bearer <accessToken>` and body `{"returnJson":true,"portalType":"customer"}`
     → `200 {"message":"SSO login successful","redirect":"https://staging.portal.shopview.com"}`.
  3. Navigate to that `redirect` — the portal session is now live.
  **This works with cookies alone and does NOT need the shop-app SPA to render**, which matters because
  a borrowed `sv_sso_session` authenticates the API but leaves the SPA sitting on `/login`.
- **Reading the portal's lists without scraping:** every page embeds `script[data-page]`; parse
  `props.invoices.data` / `props.payments.data`. The invoices list carries `status` (`paid`/`pending`)
  so a paid invoice can be picked without opening anything.
- **It is a separate Laravel + Inertia app.** Its host is in NO shop-app bundle, NO invoice email and
  on NO API route — only the lazy chunk `usePortalRedirect.*.js`, fetched when the menu item is
  clicked. Do not conclude it is unreachable from a bundle grep.
- **Free route map:** the portal's login HTML carries an inline `const Ziggy={…}` block with all 161
  routes (invoices, payments, batch-payments, disputes, payouts, terminal, admin). Parse it instead of
  guessing.
- **Reading pages as JSON:** every page embeds `data-page="app" type="application/json">{…}</script>`.
  Sending `X-Inertia: true` answers **409** (version mismatch) — fetch the HTML and parse that block.
- **The paid-banner document:** on an invoice, the **printer icon** → **"Print with Payment Receipt"**
  → `/invoices/{id}/preview?include_receipt=1`. 🛑 **The banner is rendered CLIENT-SIDE** by
  `build/assets/PreviewInvoice-*.js`; the server's `props.htmlContent` has none of the banner strings,
  so a server-side fetch makes the feature look missing. Render it and read
  `#portal-paid-invoice-summary`.
  **🛑 AND IT NEEDS A SUCCEEDED PAYMENT, NOT JUST THE QUERY PARAM (read out of the chunk, proven live
  2026-09-12).** `PreviewInvoice-*.js` injects the block only when the page is given `payments` AND at
  least one of them is `status: succeeded` with the invoice `paid`/`partially_paid` (or
  `shopview_sync_success`). `?include_receipt=1` **on its own injects nothing** — the working URL the
  menu item builds is `/invoices/{id}/preview?include_receipt=1&payment_id=<payment id>`. Find a
  qualifying invoice from the portal's **Payments** list: rows carry `invoice_id` + `invoice_number`,
  so `status==='succeeded' && invoice_id && !is_batch_payment` hands you the pair directly.
  The banner is a pill — **`PAID IN FULL`** (green) or **`PARTIALLY PAID`** (amber) — with hard-coded
  inline styles, so **the pill looks the same in both Invoice Designs** while the invoice under it
  follows the current setting. Proven on staging under Legacy and Modern, with three negative controls
  (same invoice printed without the receipt · an invoice with no payment · the in-app Finance tab of
  the same invoice and of an estimate): evidence in
  `build/invoice-design-selection/staging-2026-09-12/evidence/` (`S24.json`, `pdf24-*.pdf`).
- **🖨️ WHAT THE PRINTER ICON ACTUALLY IS, AND WHERE THE "PDF" COMES FROM (observed live 2026-09-12 on
  `/invoices/<id>`; BOTH READINGS STAY ON THE RECORD — the menu above was observed 2026-09-07).**
  The printer control sits top right of `/invoices/<id>`, beside a mail button, and it takes **two
  shapes depending on the INVOICE, not the build** (`Show-*.js`):
  - **Invoice with a ShopPay payment → a DROPDOWN `<button>`** with two items:
    **`Print Invoice`** → `/invoices/<id>/preview` and **`Print with Payment Receipt`** →
    `/invoices/<id>/preview?include_receipt=1`.
  - **Invoice with no payment record → a plain `<a>`** straight to `/invoices/<id>/preview`. An invoice
    can be `status: paid` and still land here — one paid by card **in the shop app** has
    `props.payment === null`, so it gets the single link. Seeing the plain link is NOT evidence the
    menu does not exist (learning L0065).
  Either way the target opens **in a NEW TAB**, and **the preview page has ZERO clickable controls** —
  it is not a viewer, it *is* the printable document (it even calls `window.print()` 200 ms after
  mount), and the customer's "PDF" is the browser's own **Save as PDF**. So:
  - **Capture it with the print engine, never a fetch:**
    `await page.emulateMedia({media:'print'}); await page.pdf({path, format:'Letter', printBackground:true});`
    A fetch misses every `@media print` rule — and a banner that exists only in print is exactly what a
    case will ask about.
  - **The saved file's NAME is `document.title`.** Staging titled the preview
    `Bravo Mechanical Services - S-32981 - Invoice - ShopView Customer Portal` while the document's own
    letterhead read `Staging Heavy Duty - 9919`. **OPEN QUESTION, not a finding** — that reading was
    taken without the design setting guarded and has not been reconciled against the source (Rule 106).
  - **Enumerate the page with NO container exclusion.** Dropping `[class*=sidebar]` matches the layout
    shell and returns "0 controls" on a page full of them (learning L0060).
- **Pay an invoice:** open it → **Pay Now** → confirm payer → amount → **Continue to checkout** →
  Stripe **sandbox** (`is_test_mode: true`), card `4242 4242 4242 4242`, any future expiry, any CVC,
  **ZIP `94107`** (checkout defaults Country = United States, so a Canadian postal code is rejected).
- **Batch payment:** Invoices list → **Filter by Customer** → tick two unpaid rows → **Pay Online**.
  The row checkbox is a `<button>` inside the first `<td>`, not an `<input type=checkbox>`.
- **Two payer-dialog shapes:** "Who is this payment for?" with a picker (several contacts) or
  "Confirm payment recipient" with just **Next** (one contact). Handle both.
- **`/invoices/{id}/preview` → 404** means the invoice is outside the portal's current scope, not that
  it is missing.
- **Build manifest** `/build/manifest.json` on both hosts lists every JS asset — the cheapest way to
  prove what production actually ships (compare chunk names and sha256 against staging).

---

