# Fees & Discounts — Verify-in-UI (VIU) findings on STAGING

**Date:** 2026-07-06
**Environment:** `app.staging.shopview.com` (SPA) driven headless as **ADMIN**
(quick-login `key:'admin'`, boot2 hydration). Org
`d55bc308-e61a-438d-b5f1-c7a73c89d49f`.
**Purpose:** With the **FeesAndDiscounts** feature flag now enabled for the org,
check whether ANY Fees & Discounts UI actually renders / works.

## Precondition confirmed: the flag really is ON for this org
- `GET /api/organization/feature-flags?organization_id=d55bc308-…` returns the
  org's **enabled** feature set, and **`FeesAndDiscounts` is present** in it.
  (This is a curated subset of the global flag catalog — e.g. `ShopPay`,
  `Dashboards`, `DashboardAll` from the global list are NOT in the org set — so
  its presence means the flag is genuinely enabled for the org, not just defined.)
- The Administration → **Feature Flags** page also lists `FeesAndDiscounts`
  (screenshot `viu-50-feature-flags.png`).

So the frontend has the flag it would gate on. Despite that, **no F&D controls
render anywhere.**

---

## Per-surface results

### 1. Work Order (WO `S10-24280`, id `544c84ac-…`, 3 lines, ready_for_review)
Screenshots: `viu-10-wo-lines.png`, `viu-11-wo-menu-0..3.png`,
`viu-12-wo-scrolled.png`, `viu-13-tab-Stats.png`.
The WO detail rendered normally on `/workorders/{id}/lines` (no bounce). Tabs
present: **Lines (3) · Parts (4) · Notes (1) · Stats · Finance**.

- **Toolbar / ⋯ menu "Add fee / discount" (whole WO):** **Does NOT render.** The
  header ⋮ / more_vert menus were opened; one shows only the WO financial
  summary (Parts / Labor / Shop Supplies / Subtotal / HST / Total / Balance) —
  **no "Add fee / discount" action and no Fees & Discounts row.**
- **Labor line 3-dot menu "Add fee / discount":** **Does NOT render.** The
  available 3-dot menus on the lines grid (25 more_vert icons scanned, first
  several opened) contained **no** fee/discount option.
- **"Work Order Fee / Discount" sidebar card:** **Does NOT render.** The left
  sidebar has only the WO summary, customer, asset, and **Financial Info** cards.
- **Stats tab "Fees & Discounts (N)" section:** **Does NOT render.** The Stats
  (`/statistics`) tab loaded with no F&D section.
- **Financial Info "Fees & Discounts" row:** **Does NOT render.** Financial Info
  card lists Parts / Labor / … only — no Fees & Discounts row.
- DOM scan for "fee"/"discount" across body text and HTML on every WO view:
  **zero real matches.**

### 2. Parts page
Screenshots: `viu-20-parts.png` (`/parts/inventory`), `viu-21-part-sales.png`
(`/parts/part-sales`).
- **"FEES & DISCOUNTS" column / "+ Add" on a part:** **Does NOT render.** No F&D
  column, no add control. (Two apparent "fee" hits in raw HTML were **false
  positives** inside UUIDs, e.g. `…27feb**dfee**457…` / `…name_b7bc…` — not F&D
  UI.)

### 3. Customer page (customer `eb304603-…` "new test")
Screenshots: `viu-30-customers.png`, `viu-32-customer-detail.png`.
- Customer detail rendered. Tabs present:
  **Work Orders (1) · Part Sales · Contacts (1) · Assets (2) · Notes · Invoices ·
  Payments (5) · Deposits.**
- **"Fees & Discounts" tab + "Add Fee/Discount" button:** **Does NOT render.**
  No such tab, no button. DOM scan: zero F&D matches.

### 4. Administration → Service (Fees & Discounts templates)
Screenshot: `viu-41-admin-settings.png`.
- The Administration left nav **SERVICE** section contains exactly:
  **Labor Rates · Canned Lines · Asset Types · Inspection Templates.**
- **"Fees & Discounts" templates area:** **Does NOT render / does not exist.**
  DOM scan of the full Administration page: `fee`=false, `discount`=false. Direct
  route guesses (`/administration/service`, `/settings/service`) return the app's
  "page does not exist" 404 screen.

---

## Dialog / add-edit-remove behavior
Not reachable to test — **no F&D control renders on any surface**, so there is
no Add dialog to open and nothing to add / edit / remove. (Consistent with the
earlier API probe: no fee/discount permission in `fe-permissions`, no WO
adjustment fields, all fee/discount endpoints 404.)

---

## VERDICT

**Fees & Discounts is NOT exercisable in the UI at all (not even partially).**

The **FeesAndDiscounts flag is confirmed enabled for the org**, but the ShopView
staging **frontend renders no Fees & Discounts controls on any surface** (Work
Order whole-WO menu, labor-line menu, sidebar card, Stats section, Financial Info
row, Parts column, Customer tab/button, or Administration → Service templates).
Combined with the API probe (no permission, no adjustment fields, all endpoints
404), the feature is **not deployed on staging on either the frontend or the
backend** despite the flag being on. There is no "frontend present but backend
missing" split — **both layers are absent.** The design in
`build/fees-discounts/design-notes.md` / `requirements.md` cannot currently be
verified against the live app; it should be treated as **not yet implemented on
staging.**

## Screenshots (all in `build/fees-discounts/screenshots/`)
- `viu-01-wo-list.png` — Work Orders list
- `viu-10-wo-lines.png` — WO detail /lines (tabs, Financial Info card)
- `viu-11-wo-menu-0..3.png` — WO 3-dot / more_vert menus opened
- `viu-12-wo-scrolled.png` — WO detail scrolled (sidebar cards)
- `viu-13-tab-Stats.png` — WO Stats tab
- `viu-20-parts.png` / `viu-21-part-sales.png` — Parts inventory / Part Sales
- `viu-30-customers.png` / `viu-32-customer-detail.png` — Customers list / detail (tabs)
- `viu-41-admin-settings.png` — Administration nav (SERVICE section)
- `viu-50-feature-flags.png` — Feature Flags admin page (FeesAndDiscounts listed)
