# Fees & Discounts V1 — QA env (qb) VIU Recon

> **STATUS: RECON COMPLETE (2026-07-08).** Access established, feature is LIVE,
> and the F&D surfaces were walked as Admin. Earlier egress blocker resolved
> (the API host was allowlisted). Screenshots in `/tmp/fees-discounts/recon/*.png`
> (ephemeral). Secrets in `/tmp` only — never in this repo.

## 1. Environment & access (VERIFIED)

| Thing | Value |
|---|---|
| **App (SPA)** | `https://qb.qa.shopview.com/` |
| **API host** | **`https://sv7387api.qa.shopview.com`** (found by grepping the SPA bundle `/js/index.*.js`; env = SV-7387, the F&D permissions Jira). `qbapi.qa.shopview.com` does NOT exist. |
| **Auth** | `POST /api/quick-login {key:'admin'}` → **200**, gated by cookies. Same DEV quick-login pattern as staging/sv7301. |
| **Cookies that worked** | `sv_sso_session` (64-hex) + `PHPSESSID` (32-hex) + `cf_clearance` (values in `/tmp/fees-discounts/cookies.env`, chmod 600). First auth succeeded with just the first two; a `cf_clearance` was supplied mid-run and kept. No Cloudflare challenge was ever observed on either host. |
| **Logged-in user** | **Admin ShopView**, role **Admin** (41 fe-permissions, `view_mode: full`), org `d55bc308-…` "Staging Foothills Group Inc", shop "Staging Lethbridge - 4310". |
| **admin vs tech** | `{key:'admin'}` → **200**. `{key:'tech'}` → **403 `{"errors":[{"error":"Access denied."}]}`** — app-level denial (tried first-in-sequence and with fresh cookies; NOT a cookie problem). **Tech quick-login is not enabled on this env.** Role-based negatives need the staff role-switch method instead (assign roles to a user via `/api/staff/{id}/change`). |
| **Gotcha (proxy)** | Running node WITHOUT `NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt` produces a spurious proxy 403 "Host not in allowlist" even after allowlisting — always set both. |
| **Gotcha (SPA deep links)** | Deep-linking to sub-routes (`/administration/adjustment-templates`, `/workorders/{id}/stats`, `/parts/part-sales/{id}`) renders an **"Error \| ShopView"** blank page. **Navigate in-SPA** (land on `/workorders` or `/administration/settings`, then click the nav/tab/row). `/workorders/{id}/lines` deep-link works fine, and — unlike staging — existing-WO detail does **NOT** bounce on this env. |
| **Harness** | `/tmp/fdcln/fd-admin.mjs` (API client), `/tmp/fdcln/fd-boot2.mjs` (Chromium boot2 hydration, cookie domain `.qa.shopview.com`, chromium `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, Playwright straight at `$HTTPS_PROXY` — no separate bridge needed). |

## 2. Feature flag — F&D is LIVE

- Flags endpoint: **`GET /api/feature-flags`** → `{data:{featureFlags:[…]}}` (13 flags).
- **`FeesAndDiscounts` flag EXISTS and its toggle is ON** at `/administration/feature-flags`
  (sidebar DEV TOOLS → Feature Flags; toggle `aria-checked=true`). No action needed.
- `QuickBooks` flag exists in the list (untouched/off); `LateFeesMvp` also present.
- Screenshot: `feature-flags.png`.

## 3. Per-surface BUILT / NOT-YET table

| Surface (spec story) | Route / path | Status | Evidence |
|---|---|---|---|
| **Template Builder / admin templates** (S7) | Administration → **FINANCE → Fees & Discounts** = `/administration/adjustment-templates` (in-SPA click only) | **BUILT** | Page "Fees & Discounts", **"New Fee / Discount"** button, table **Name·Type·Calculation Type·Amount·Max Amount·Taxable·Auto-Apply To Work Orders** + edit/delete. Create dialog: Name, Type, Calculation Type, $ Default Amount, Taxable, **"Auto-apply to new work orders"**, Description (Optional), Cancel/Create. One template exists ("Flat fee", auto-apply Yes). NOTE: spec places it under Service below Canned Lines (S7-R7a) — build puts it under **Finance** (matches S13-R8 target). |
| **Processing Fee** (S8) | Template create dialog → Type dropdown | **NOT-YET** | Type dropdown offers **only "Fee" and "Discount"** — **no "Processing Fee"** third type (S8-R1 absent). No % of Grand Total anywhere. |
| **Whole-WO fee/discount** (S1/S2/S3) | WO detail toolbar **⋯ → "Add Fee/Discount"**; sidebar **"WO Fees & Discounts"** card | **BUILT** (end-to-end verified) | Added a fee live: dialog "Add new fee/discount" with **Apply From Template**, Name, Type, Calculation Type, Amount, **Max Amount (Optional)** (percentage only), Taxable, **live preview** ("Work-order subtotal $2,049.10 → Fee +$1.00 → New work-order subtotal $2,050.10", **"Tax is recalculated on save."**, empty state **"Enter an amount to see the impact."**), confirm **"Add Fee"** (label follows Type). Toast **"Fee added"**. Card lists entries name + set amount + signed resolved amount, per-entry ⋯ → **Edit \| Remove**. Remove → confirm **"Remove Fee / Discount" / "Are you sure you want to remove this fee?"** → toast **"Fee removed"**. Inline validation "Amount must be greater than 0" (§5-R1). |
| **Labor-line adjustment** (S1-R3) | WO line header **⋯ → "Add Fee/Discount"** (menu also has Uncomplete/Add line note/Edit labor/Move labor) | **BUILT** | Dialog opens **scope-locked**: subtitle **"Applying to: {line name}"**, Calculation Type defaults **"% Of Labor Total"**, Max Amount (Optional) present. |
| **Part-line adjustment** (S1-R5) | WO part row **⋯ → "Move \| Add Fee/Discount"** | **BUILT** | Menu item present on the part row of an open WO (staged part). Dialog not driven further (recon). |
| **Financial Info card row** (S3-R20) | WO sidebar Financial Info | **BUILT** | **"Fees & Discounts (N)"** row with net total (e.g. "(2) $26.00"), expandable, read-only. |
| **Statistics tab F&D section** (S4) | WO → **Stats** tab (in-SPA; lands on `/workorders/{id}/statistics`) | **BUILT (different layout than spec)** | Section "Fees & Discounts" shows **aggregate rows: "Fees (1) $11.00 / Discounts (0) $0.00 / Net $11.00"** — NOT the spec's per-adjustment rows with % + Amount columns (S4-R2/R3). Flag for case updates. |
| **History/audit log entries** (S10) | WO toolbar ⋯ → **Audit Log** ("Work Order Log" dialog) | **BUILT** | After the live add: entry **"Fee added / Admin ShopView / Line=− / Name: ZZAUTOTEST recon fee \| Amount: $1.00 \| Applied to: Full invoice"** — matches S10-R4a/R5/R6 incl. the exact "Full invoice" label. |
| **Customer default templates + auto-apply** (S9) | Customer page → **"Fees & Discounts (N)"** tab = `/customers/{id}/default-adjustments` | **BUILT** | Card **"Default Fees & Discounts"** with the exact S9-R14 caption, columns Name·Type·Calculation Type·Amount·Max Amount·Taxable, empty state **"No fees or discounts yet. Use 'Add Fee/Discount' to add one."** (exact S9-R17), **"Add Fee/Discount"** button. Picker is a **"Fee / Discount Templates" dropdown with Cancel/Save** — NOT the spec's checkbox multi-select list w/ "Add" (S9-R18/R20) — flag for case updates. **Auto-apply works**: the auto-apply template ("Flat fee") landed on newly created WOs automatically (seen ×2 on one WO — matches the documented S9 double-add known bug shape; needs a dedicated test). |
| **Part Sales adjustments** (S11) | Part Sale detail = `/parts/part-sale/{id}/part-requests` (via list click) | **NOT-YET** | Zero fee/discount affordances: parts table columns Description…Vendor·Requested At·Status·Actions — **no "Fees & Discounts" column** (S11-R7); toolbar ⋯ = "Delete \| Set status" — **no "Add Parts Sale Fee / Discount"** (S11-R4a); no sidebar F&D card; no "fee" text anywhere on the page. |
| **QuickBooks mapping** (S6) | Settings sidebar INTEGRATIONS | **NOT PRESENT** (presence-only check) | INTEGRATIONS group shows **IBS only** — no QuickBooks settings page; `QuickBooks` feature flag exists but not enabled. S6 mapping-guard behavior untestable on this env. (QB deep-VIU out of scope anyway.) |
| **Estimate/invoice rendering** (S5), **Shop Supplies hide** (S14) | WO Finance tab / customer documents | **UNVERIFIED** | Not walked in this recon (needs an invoice-ready WO). Finance tab exists on the WO. |

Build wording note: the app uses **"Add Fee/Discount"** (no spaces) at every WO starting
place — the spec's WO-toolbar label "Add Work Order Fee / Discount" and the
spaces-around-slash convention (S1-R1/S11-R4a, §6.1 exact-text note) do NOT match the
current build. Card menu says "Edit | Remove" (spec S3-R9 says Edit/Delete).

## 4. What's VIU-able NOW vs blocked

**VIU-able now (as Admin):**
- Story 1 (starting places: WO toolbar, line menu, part menu) — all present.
- Story 2 (Add/Edit dialog: fields, template picker, live preview, validation, toasts).
- Story 3 (sidebar card, Financial Info row, edit/remove flows, open-WO gating).
- Story 4 (Stats tab — but layout deviates from spec; verify against build reality).
- Story 7 (template builder CRUD + auto-apply checkbox).
- Story 9 (customer defaults tab, add/remove defaults, auto-apply to new WOs — incl. the double-add bug check).
- Story 10 (history log entries — proven working).
- §5 calculation contract (via live preview + saved amounts on throwaway WOs).
- Story 12 visual rules (signed badges, grey amounts — spot-check).

**Blocked / not possible yet:**
- **Story 8 Processing Fee — NOT built** (no third type in the template builder).
- **Story 11 Part Sales — NOT built** (no F&D affordances on a part sale).
- **Story 6 QuickBooks — no QuickBooks integration on this env** (mapping guard, sync, negative-total credit memo untestable).
- Story 5 / Story 14 (customer documents) — unverified; needs an invoiceable WO walk (likely possible, just not done in recon).
- Story 13 permissions matrix — `{key:'tech'}` quick-login is disabled; use the staff role-switch method (assign role → fresh login for that user); a working second-user login path must be established first.

## 5. Ops notes / cleanup

- Test data: added ZZAUTOTEST fee on WO S3-15888 and **removed it** (card restored to prior state). No other data changed. No roles changed.
- WOs used (existing, untouched): S3-15888 `33fbafa9-…` (open, 1 line, 12 parts), S3-15893 `cac7f93c-…` (0 lines). Part sale P3-69 `5b07d396-…`. Customer `7af75d7c-…` (Aaborough Works).
- Endpoints confirmed: `GET /api/feature-flags`, `GET /api/adjustment-templates` (`{data:{templates:[…]}}`), `GET /api/work-orders?page=&limit=` (`{data:{work_orders:[{linesCount,partRequestsCount,…}]}}`), `GET /api/part-sales` (`{data:{partSales:[…]}}`), `GET /api/work-orders/simple-list` (`{data:{collection}}` — no line counts).
- Screenshots (ephemeral): `/tmp/fees-discounts/recon/*.png` — feature-flags, admin-adjustment-templates, admin-template-create-dialog, admin-template-type-options, wo-add-dialog(+filled), wo-after-add, wo-remove-confirm, wo-audit-after-add, wo-line-add-dialog, wo-menu-idx1/3/4, wo-stats-tab, customer-fd-tab, customer-add-picker, part-sale-detail, home.
