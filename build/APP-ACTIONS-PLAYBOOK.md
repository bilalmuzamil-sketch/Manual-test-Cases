# ShopView App Actions Playbook — Proven Per-Action Recipes (NON-SECRET)

> ## 🟥 READ-FIRST — NEVER RE-DISCOVER
> **Every test / VIU / staging worker MUST read this playbook (the "STAGING ACTION
> RECIPES" index directly below) AND `CLAUDE.md` "Durable key facts" BEFORE doing ANY
> staging/QA action** — create a WO, add a part, add a fee/discount, switch a role,
> change location, hit an endpoint, drive a UI flow, log into Jira, push to TestRail.
> **REUSE the recorded recipe — do NOT re-derive an endpoint / ID / payload / UI path /
> gotcha-fix that this session (or another) already proved.** Re-discovering known
> actions from scratch wastes testing time; that is exactly what this file exists to
> prevent (user directive 2026-07-27).
>
> **The MOMENT you discover a NEW working recipe** (a new endpoint, payload field, ID,
> UI click-path, or the concrete gotcha-fix that unblocked success) — **append it here
> immediately, in the same session.** Success-proven knowledge ONLY (never failed
> attempts / dead-ends), per "Keeping this current" at the bottom. This is Standing
> Rule 27 in `CLAUDE.md`. **NO SECRETS EVER** — cookie NAMES only, never values.

**How to use this.** This is the durable "how to do X in ShopView" reference, mined
from ~2.5 weeks of committed test artifacts (VIU runs, the by-role regression run,
custom-roles run 312, and the bug-fix re-test). Each recipe gives the concrete
**UI path** (click-path from the top nav + SPA route), the **API endpoint(s)** the
button actually calls (verb + key payload fields), **Preconditions**, the
**Gotcha/Unblock** that got the action working, and a **Confidence** grade. Use it
so future runs *reuse* a proven procedure instead of re-researching each action.
When you need to do something listed here, follow the recipe; only re-investigate
genuinely new actions, and then **add them here** (see "Keeping this current").

> **Access/setup** (cookies, MITM bridge, boot2 hydration, quick-login, role
> assignment, restore) is in **`build/TESTING-RUNBOOK.md`**. Non-secret **ids and
> rules** (staff_id, org id, role ids, enforcement model) are in **`CLAUDE.md`**.
> **NO SECRETS EVER** — every value below is a non-secret identifier or an endpoint.

**Confidence legend:** `High` = executed end-to-end with the endpoint + HTTP status
observed in the artifacts. `Medium` = affordance/gate confirmed but full flow not
driven in the harness. `(verify)` = named in the task/spec but **not** directly
evidenced in the committed artifacts — confirm before relying on it.

**Base URLs:** SPA `https://app.staging.shopview.com` · API
`https://api.staging.shopview.com` (all `/api/...` paths below are on the API host).

---

# STAGING ACTION RECIPES (quick-reference index)

Consolidated, copy-paste-ready staging/QA recipes so no worker re-discovers a proven
action. Each is terse: **what · method+endpoint (minimal payload) · the gotcha · helper
location · source**. Fuller per-action detail (UI click-paths, confidence grades) is in
the sections further down (Navigation Map, WORK ORDERS, PARTS, etc.) and in the dated
"proven" appendices. **Helpers live in `build/testing-tools/`** (`staging-admin.mjs` =
`login()`/`api()`/`changeLocation()`; `staging-boot2.mjs` = `boot2()` SPA hydration;
`staging-bridge.mjs` = fresh MITM bridge; `testrail-api.mjs` = TestRail). **Do NOT invent
any endpoint/ID not recorded here or in `CLAUDE.md`** — if only partly known, it is marked
"(verify)".

**Index:**
[A. Auth & session](#a-auth--session) ·
[B. Environment / location](#b-environment--location) ·
[C. Work Orders](#c-work-orders) ·
[D. WO Lines](#d-wo-lines) ·
[E. Parts](#e-parts) ·
[F. Adjustments / Fees & Discounts](#f-adjustments--fees--discounts) ·
[G. Roles & permissions testing](#g-roles--permissions-testing) ·
[H. Settings](#h-settings) ·
[I. UI automation (Quasar)](#i-ui-automation-quasar) ·
[J. TestRail API](#j-testrail-api) ·
[K. PRODUCTION access & fix-verification](#k-production-access--fix-verification-sv-8721-proven-2026-07-29) ·
[L. Git practice with parallel workers](#l-git-practice-with-parallel-workers) ·
[M. Figma: extract ALL frames from a design link](#m-figma-extract-all-frames-from-a-design-link-proven-2026-07-31-filters) ·
[Jira/Confluence access](#jiraconfluence-access)

---

## A. Auth & session
- **Quick-login (admin/tech):** `POST /api/quick-login {key:'admin'|'tech'}` → 200 + a fresh
  `PHPSESSID`. Gated by valid session cookies. Prefer quick-login SSO over raw-cookie API (raw
  can 409). Both `{key:'admin'}` and `{key:'tech'}` return 200 on staging (tech-403 is fixed;
  on qb, tech quick-login is FLAKY — retest each run). Helper: `login(key)` in `staging-admin.mjs`
  (returns `{sessCookie, data, status}`; rebuilds cookie with the fresh PHPSESSID, keeps
  `cf_clearance` + `sv_sso_session`). *Source: CLAUDE.md Durable key facts.*
- **Cookie names / domain (values are SECRETS — `/tmp` only, NEVER in repo):** `sv_sso_session`,
  `PHPSESSID`, `cf_clearance`; staging domain `.staging.shopview.com`, qb domain `.qa.shopview.com`.
  Helpers read them from `/tmp/cln/cookies.json`.
- **Cookie lifetime ~24 HOURS** — expire only after ~24h OR a new deployment; they do NOT expire
  after ~1h (plan long VIU runs in one window). A 401 `sso_required` / 409 before 24h ⇒ suspect a
  deployment or stale set → re-request cookies. *Source: CLAUDE.md.*
- **Diagnostic ladder:** no cookies → 401; `sso_required`/only sso+cf → 409; **poisoned shared
  PHPSESSID → 500 on everything** (API root still 200). Fix a poisoned session: re-run quick-login
  `{key:'admin'}` WITHOUT sending the old PHPSESSID → fresh PHPSESSID → all 200 again.
- **Chromium UI automation (boot2 hydration):** Chromium can't TLS through the egress proxy directly.
  `boot2(roleKey, opts)` in `staging-boot2.mjs` does quick-login → optionally `change-location` →
  reads `GET /api/auth/me/fe-permissions` → seeds cookies + localStorage (`user`,
  `fe_permissions_wrapper`, `token`) THEN navigates (the DEV login BUTTONS don't reliably work).
  It points Playwright at `$HTTPS_PROXY` (read LIVE — port rotates). Exits code 2 with
  `COOKIES_EXPIRED` on a 409. *Source: CLAUDE.md, TESTING-RUNBOOK.md.*
- **Fresh MITM bridge (fallback when the direct proxy path fails):** `staging-bridge.mjs` — a small
  local proxy that accepts Chromium's CONNECT and relays via Node fetch (honours
  `NODE_USE_ENV_PROXY=1` + `NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt`). Reads `$HTTPS_PROXY`
  live; **rebuild every run, never hard-code the port.** Prints `BRIDGE_LISTENING 127.0.0.1:<port>`;
  launch Chromium with `--proxy-server=http://127.0.0.1:<port> --ignore-certificate-errors
  --no-sandbox --ssl-version-max=tls1.2`.
- **node-fetch / undici proxy gotcha:** node-fetch IGNORES the proxy → use **undici `ProxyAgent`**
  (or Node global `fetch` with `NODE_USE_ENV_PROXY=1`). *Source: CLAUDE.md Simple Flow env note.*
- **fe-permissions read:** `GET /api/auth/me/fe-permissions` → `{data:{fe_permissions:[<codes>],
  view_mode, cross_toggles}}` (array of code STRINGS, not a bool map). quick-login is stateful on the
  shared PHPSESSID → probe roles strictly SEQUENTIALLY.
- **PRODUCTION access (`app.shopview.com` / `api.shopview.com`) — proven 2026-07-29 (SV-8721 prod
  verification):** real login `POST /api/login {username, password}` → 200 + set-cookie `PHPSESSID`
  (session is PHPSESSID-only, NO SSO / no cf_clearance needed via the agent proxy; quick-login 500s on
  prod). **A fresh login for the SAME user EXPIRES the previous PHPSESSID** (old session → 409 "Session
  has expired") — log in ONCE per run and reuse that session for API + browser + cleanup. Prod test org
  = `72b2cc90-6964-4429-a207-76e55f946936`; workplaces via `GET /api/staff/my-workplaces` — **Trucks
  Hill 2 = `b617914c-16e9-4485-8e8b-193cd86aa416` (Africa/Accra, HAS canned lines — use it for WO
  seeding)**; QA Testing = `8badadec-0344-4bc3-b668-7beaedfefa8d` (Africa/Abidjan, NO canned lines).
  Same-as-staging on prod (all confirmed live): `iam/change-location`, `work-orders/create`
  (is_vehicle_here required), `part/make-request`, `perform-request-status-action {action:'order'}`,
  `inventory/orders/{id}` (incl. the `*_decimal` fields), `work-orders/delete` (deleting the WO also
  removes its un-received PO). **DIFFERENT on prod:** `POST /api/work-orders/lines/create
  {canned_line_id,…}` → 400 "Labor or fixed prices must be set" even with a fixed-price canned line —
  use **`POST /api/work-orders/{id}/lines/create-from-canned-line {canned_line_id, status:'authorized'}`
  → 201** instead. Chromium boot2-style hydration works on prod: PHPSESSID cookie on `.shopview.com` +
  localStorage `user` = `{data:<login-response data>}` (has `token`/`role`/`details`) +
  `fe_permissions_wrapper` = fe-permissions `data`; Playwright pointed straight at `$HTTPS_PROXY`
  worked (no bridge needed). Credentials/cookies in `/tmp` only. **Node-fetch proxy fix (proven
  2026-07-29):** in sandboxes where plain node `fetch` bypasses the egress proxy (403 "Host not in
  allowlist" while `curl` gets through), run node with **`NODE_USE_ENV_PROXY=1`** (Node 22.22+,
  undici EnvHttpProxyAgent) — fetch then honors `$HTTPS_PROXY` and prod login/API work; no code
  change needed. **Receive-screen Tax field (prod + staging):** a manual vendor-invoice dollar
  input defaulting to $0.00 when the org's workplace tax rate is 0 (`workplace_tax` in the order
  JSON); typing a dollar amount live-recalculates Total = Subtotal + Tax (verified: 15.32 + 0.77
  → 16.09, SV-8721).

## B. Environment / location
- **Org ID (staging, shared):** `d55bc308-...` (shared across Custom Roles + Simple Flow + F&D staging).
- **Change active workplace/location (self-unblock — required before reading/writing a WO in a
  non-default workplace, else `work-orders/view/{id}` returns 400/no-data):**
  `POST /api/iam/change-location {workplace_id, workplace_timezone}` → 200. Helper:
  `changeLocation(sessCookie, workplaceId, timezone)` in `staging-admin.mjs`; boot2 accepts
  `{workplaceId}` / env `SV_WORKPLACE`+`SV_TZ`. **On qb, AVOID `change-location`** (suspected
  500-incident trigger; admin default is already Lethbridge = the QB location). *Source: CLAUDE.md.*
- **Workplaces (`GET /api/staff/my-workplaces`):** Heavy Duty 9919 =
  `b3c8c820-f815-4cf1-8938-10956c5ee71a` (America/Edmonton); Lethbridge 4310 =
  `f8a8b802-7780-4b16-bf10-343caeb616b2`; QB Location = `d5366a95-582d-4a06-96e2-20f8cb937866`.
- **qb (SV-7387) env sleep/wake:** env auto-sleeps. Wake:
  `POST https://fz4hhptxi8.execute-api.ca-central-1.amazonaws.com/default/toggleQaEnv
  {"action":"wake","env":"sv7387"}`, then poll API ROOT `https://sv7387api.qa.shopview.com/` until
  200 (~60s; 503 while booting). *Source: FEES & DISCOUNTS appendix below.*

## C. Work Orders
- **Create WO (API):** `POST /api/work-orders/create {company_id, vehicle_id, workplace_id,
  start_date, is_vehicle_here:true}` → 201. **`is_vehicle_here:true` is REQUIRED.** Customer defaults
  auto-apply fees on new WOs (`appliedBy=customer_default`). **Gotcha:** create can 500 in some staging
  sessions → create via the UI instead (UI recipe: `/workorders` → New → pick Customer + Asset →
  Save → Confirmation "over credit limit" → Create). *Source: CLAUDE.md, UI-seeding appendix 2026-07-15.*
- **Delete WO:** `POST /api/work-orders/delete {work_order_id}`. **Move the WO to Uncomplete first**
  (a Complete WO → 400 "Completed work order cannot be deleted"). On staging, WO delete can be
  UI-only (top ⋮ → Delete Work Order) if the API 404s.
- **List / read:** list `GET /api/work-orders` / `GET /api/work-orders/simple-list`; detail
  `GET /api/work-orders/view/{id}` (carries `adjustments[]`, `adjustmentsSummary`, `editable`,
  `deletable`); lines `GET /api/work-orders/lines/{woId}`.
- **Vehicles:** `GET /api/vehicles?company_id={id}`; create `POST /api/vehicles/create
  {company_id, customer_id:<CONTACT id>, unit}`; VIN edit `POST /api/vehicles/change` → 201.
- **Existing-WO detail bounces to `/workorders` on mount (all roles incl. admin)** — create a FRESH
  WO to reliably land on `/workorders/{id}/lines`, or in-SPA `history.pushState` + dispatch
  `popstate` (see UI automation). *Source: CLAUDE.md, Navigation Map below.*

## D. WO Lines
- **`POST /api/work-orders/lines/create` SUCCEEDS with a canned line** — body `{canned_line_id,
  work_order_id, status:'authorized'}` (get a `canned_line_id` from the canned-lines list). It only
  returns **HTTP 500 when called WITHOUT a canned line / labor** (bare or empty body). So: to add a WO
  line via API, ALWAYS supply a `canned_line_id`; for a line that needs labor / has no canned line, use
  the **UI New Line dialog** (WO detail → Lines tab → New Line → pick a canned line → Save & Close) as
  the fallback. *(confirmed live 2026-07-27, SV-8721 side project; supersedes the earlier "always 500s
  → use UI" note. On qb, lines/create still 500s on ALL payloads incl. `create-from-canned-line`.)*
  **UPDATE 2026-07-29 (staging):** `lines/create` with a canned_line_id now returns **400 "Labor or
  fixed prices must be set"** on staging too (same as prod) — use
  **`POST /api/work-orders/{id}/lines/create-from-canned-line {canned_line_id, status:'authorized'}`
  → 201** on staging as well (proven live 2026-07-29). Note: a line created from a canned line can
  AUTO-CREATE a part request (with the canned line's part category) — remove it via
  `part/remove-request/{id}` if the test needs a clean line.
- **Change line status:** `POST /api/work-orders/lines/change-status {line_id, status:'authorized',
  workOrderId}` → 200 (enum `authorization_required|authorization_declined|authorized|complete`).
  Bulk: `POST /api/work-orders/lines/change-lines` → 201. Delete: `POST
  /api/work-orders/lines/delete-lines` → 200 (deletable in any status except Complete).

## E. Parts
- **ADD PART to a WO/line (API — the recorded recipe; do NOT re-discover):**
  `POST /api/work-orders/part/make-request {line, work_order, description, quantity,
  part_source_type:'inventory'|'vendor', part_number, sell_price, cost, part_category_id}` → 201.
  **`part_category_id` is REQUIRED** (categories: `GET /api/inventory/categories` → {value,label}).
  Edit: `POST /api/work-orders/part/change-request {id, description|quantity|part_number|
  part_source_type}` → 200 (recalcs sellPrice/margin; vendor→inventory locks cost). *Source: CLAUDE.md
  Simple Flow facts + Custom Roles Phase-2b appendix.*
- **Add part via UI (reliable when API awkward):** WO detail → New Part Request dialog. Fields:
  Part Number / Description / Quantity (+ Sell Price when `seeFinancialData` ON — sell-price field is
  ABSENT for roles without SFD). For inventory source: `select_part` a catalogue PN (forces
  Source=Inventory) → qty via `input_bin_quantity_{binId}`.
- **Remove a WO part:** `POST /api/work-orders/parts/delete {part_id, work_order_id}` (returns picked
  inventory + enables WO delete).
- **Cored part (seed data):** genuine cored inventory part **P550848** (core_charge=1, has
  core_part_id). Core OK/Not-OK is a LINE-level control governed by WO Lines Create & Edit; needs a
  received core-bearing part to appear.
- **Inventory / orders / deliveries:** parts `GET /api/inventory/parts?...&search=`; create
  `POST /api/inventory/parts/create` → 201, delete `POST /api/inventory/parts/delete` → 201; PO list
  `GET /api/inventory/orders`, order detail `GET /api/inventory/orders/{id}`; deliveries
  `GET /api/inventory/deliveries`. Edit a PO item pre-receive: `POST /api/inventory/orders/change-item
  {order_id,item_id,part_number,quantity_ordered,price,category,description}` → 200.
- **`GET /api/inventory/orders/{id}` now ALSO returns full-precision fields `price_decimal`,
  `total_cost_decimal`, `total_price_decimal`** (the SV-8721 5-decimal fix fields) alongside the legacy
  rounded `price` / `total_price`. Use the `*_decimal` fields to verify 5-decimal cost precision on
  Receive. *(confirmed live 2026-07-27, SV-8721 side project.)*
- **Receive parts:** `POST /api/inventory/orders/accept` (driven from `/accept-delivery/{orderId}`:
  fields `invoice-number`, Invoice Date, per-line `delivered` qty, Tax, note; over-qty → "Received
  More Than Ordered" warning). *Source: CLAUDE.md Simple Flow facts.*
- **WO Receive Parts screen (UI route):** `/order/{orderId}?receive=1&returnTo=WorkOrder&returnId={workOrderId}`
  — this is the Receive Parts screen reached from a work order (the PO Receive screen with the WO as the
  return target). *(confirmed live 2026-07-27, SV-8721 side project.)*
- **Delete an UNPICKED part REQUEST:** `POST /api/work-orders/part/remove-request/{requestId}` → 200
  (the id in the URL, empty body). **`parts/delete` returns 400 "part_id Not found" for a request that
  was never picked** — `parts/delete` is for picked inventory parts; requests use `remove-request`.
  Useful to clear the part a canned line auto-creates. *(proven live 2026-07-29, sell-price verify.)*
- **New Part Request modal (UI recipe):** WO lines page → the LINE's ⋮ kebab (inside
  `[data-test-id=table_work_order_lines]`, the menu containing "Request part | Add line note | Save as
  canned line | …") → **"Request part"**. Dialog test-ids: `input_workorder_part_description`,
  `input_workorder_part_quantity`, `select_part` (PN catalogue), `select_workorder_part_source`,
  `select_part_category`, `select_part_vendor`, `input_part_cost`, `input_workorder_part_core_charge`,
  `input_workorder_part_sell_price`, `input_workorder_part_margin`; save buttons
  `button_workorder_part_save` (= Save & Close) / `…_save_add_part` / `…_save_add_line`.
  **Category DEFAULTS to "Uncategorized"** when nothing is picked. *(proven live 2026-07-29.)*
- **Receive Parts screen driving (test-ids + endpoints):** vendor top-left =
  `select_assign_vendor_{orderId}` (Quasar select → `.q-menu .q-item`; fires
  `POST /api/orders/{orderId}/assign-vendor {vendorId, orderItemIds:[]}`); invoice # =
  `input_invoice_{orderId}`; per-item `input_part_number_{itemId}` (fires
  `POST /api/orders/items/{itemId}/part-number {partNumber}`), `input_cost_{itemId}`,
  `input_sell_{itemId}`, `input_qty_{itemId}`; submit = `button_receive_po_{orderId}` (disabled until
  vendor + invoice + PN + cost/sell present — sell>0 is part of the gate). Screen data =
  `POST /api/inventory/orders/receive-view {orderIds:[…], vendorIds:[…]}`. **GOTCHAS (proven
  2026-07-29):** (1) Cost/invoice edits fire NO API call on blur and do NOT persist across reload —
  they submit only with the final Receive; (2) after a vendor is assigned, re-opening the URL that
  still has `&vendorless=1` renders "All parts on this purchase order have been received." even though
  nothing was received (artifact — drop `vendorless=1` and reload); (3) the Sell field does NOT
  auto-calc from Cost on this screen in the current build (staging AND prod — the 2026-07-29
  sell-price bug, see build/simple-flow/sell-price-investigation-2026-07-29/live-verify-2026-07-29/).
- **Returns:** create `POST /api/work-orders/part/make-return-request` → 200; delete
  `POST /api/work-orders/part/remove-return-request {part_return_request_id}` → 200; list
  `GET /api/work-orders/part/list-return-requests`. A return can't be deleted on a Complete WO —
  uncomplete first.

## F. Adjustments / Fees & Discounts
- **Add a WO adjustment:** `POST /api/work-orders/adjustments/add {workOrderId, kind:'fee'|'discount'|
  'processing_fee', name, calculationType:'flat'|'pct_labor'|'pct_parts'|'pct_subtotal'|
  'pct_grand_total', amount, maxCap, scope:'whole_wo'|'labor_line'|'part_line', targetId, taxable,
  templateId, description}`. **Part-sales percent uses `pct_subtotal`** (`pct_total` → 400 "Invalid
  calculation type"). *Source: CLAUDE.md + F&D appendices.*
- **Remove:** `POST /api/work-orders/adjustments/remove {adjustmentId, workOrderId}` → 204.
- **Change:** `POST /api/work-orders/adjustments/change {adjustmentId, workOrderId, name, amount,
  maxCap, taxable}` (kind/calc immutable). **A `processing_fee` → HTTP 409 "cannot be edited through
  this endpoint" = REMOVE-ONLY (spec-correct);** manual add of a processing_fee → 400.
- **Base calc note:** processing-fee base = net subtotal (labour+parts+shop)×(1+tax) EXCLUDING
  whole-WO fees (§5-R4, VIU-confirmed 2026-07-23). Customer default fees auto-apply on WO create.
- **Templates:** `GET/POST /api/adjustment-templates`; `POST /api/adjustment-templates/{id}/change`;
  `DELETE .../{id}`. Customer defaults: `GET/POST /api/customers/{companyId}/default-adjustments`
  (POST `{templateIds:[…]}`). Fuller F&D contract + Quasar dialog driving in the F&D appendices below.

## G. Roles & permissions testing
- **RESET TO TEMPLATE FIRST (Standing Rule 26/26a):** before ANY permission/role verification on the
  shared org, reset every in-scope role to its template/default so you test spec-defaults, not drift.
  Record pre-reset → reset → post-reset (the diff IS a finding). Path: Settings → Roles & Permissions →
  pencil → Reset to Template → Save. If a role RE-DRIFTS mid-run (concurrent session), reset AGAIN and
  continue (persistently, Rule 26a). Leave roles at template when done. Custom-role reset API:
  `POST /api/roles/{id}` (re-PUT template perms).
- **Impersonate a role holder (PREFERRED live-role test):** `POST /api/switch-user {user_id}` (user_id =
  staff `id` from `GET /api/staff?limit=200`, which lists `role_label` per staff). End impersonation with
  a fresh admin `login()`. *Source: CLAUDE.md Rule 14 self-seed playbook.*
- **Create a fresh staff per role (alt):** `POST /api/iam/create {email, firstName, lastName, roleId,
  departments:[...], workplaceId}` → 201 `{user_id}`. On staging a fresh staff needs invite-confirmation
  → PREFER switch-user impersonation.
- **Assign a role to the Tech user (self-service):** `POST /api/staff/{staff_id}/change {first_name,
  last_name, email, workplace_id, role_id}` → 201. **Use Tech `/change` staff_id `6fb22c1b-...`** — the
  staff-LIST id `a7fd0a88-...` **404s on `/change`.** EXACT-match `email==='tech@shopview.com'` before
  changing (never substring). Invalid `role_id` → 500 (does not persist). **NEVER role-swap Tech
  mid-session** → causes the `/no-location` SPA bounce (technique artifact, not a permission result).
  Restore Tech afterward (Technician role `131b5274-...`; safety-net `staging-restore-tech.mjs`).
- **Roles list:** `GET /api/organizations/{org}/roles` (authoritative; `/api/roles` 405s);
  `GET /api/roles/{id}`. 11 system roles, all `default=true`; Office + Time Clock non-editable.
- **Role change forces re-auth:** changing a user's role invalidates the held session → next request
  409 "Session has expired." → re-login; poll fe-permissions until the new set applies (409 is expected).
- **Enforcement model:** backend enforces only resource-level View/Edit; granular perms (Delete, WO
  sub-perms, cross-toggles) are FE-only display gates → **FE-block + BE/API-allow = PASS (Rule 24)**;
  verify denials in the UI (endpoint often returns 400 validation, not 403).

## H. Settings
- **Read:** `GET /api/organizations/settings`. **Write:** `POST /api/organizations/settings/change`
  (send the FULL settings object). Simple Flow behavior is settings-driven (no feature flag).
- **Feature flags:** route `/administration/feature-flags`; org flags
  `GET /api/organization/feature-flags?organization_id={org}`.
- **PRICING MATRIX (parts sell-price rules) — route + API (proven live 2026-07-29):** UI =
  Settings → PARTS → **Pricing** = route `/administration/pricing` (permission `settingsParts`);
  tabs "Pricing Matrices(N)" + "Fixed Rules(N)"; click a matrix row → "Edit Price Matrix" dialog
  (Name, Category multi-select, rule rows Min Cost / Max Cost / Markup % / Margin %). API: list
  `GET /api/pricing-rules/list?limit=200&page=1` → `{data:{collection:[{id,name,categories:[catIds],
  rules:[{rule_id,type:'markup_for_interval',min_cost,max_cost,markup,margin}],is_default}]}}`;
  create `POST /api/pricing-rules/matrix`; edit `POST /api/pricing-rules/change-matrix`; delete
  `POST /api/pricing-rules/remove-matrix`. Fixed sell prices: `GET /api/parts/list-fixed-price`.
  Map category ids via `GET /api/inventory/categories`. **Known state 2026-07-29:** staging org
  d55bc308 has "Default matrix 07/12/2023" covering **Uncategorized** (cat id `b25c5c04-…`, 21 rules,
  e.g. $24.01–55 → markup 150%); prod test org 72b2cc90 has "Default matrix" covering Uncategorized
  (cat id `00e200b1-…`, 1 rule $1–2500 → markup 800%).

## I. UI automation (Quasar)
- **Escalation ladder when a click won't take:** (1) selector click → (2) fire the element's own
  handler / `dispatchEvent` → (3) **bounding-box / element-center COORDINATE click**
  (`page.mouse.click`) → (4) JS set value + dispatch `input`/`change` → (5) keyboard → (6) call the
  EXACT endpoint the button calls, ONLY after confirming the FE gate/dialog was reachable (disclose it;
  never PASS on gate presence alone). *Source: HEADLESS-AUTOMATION section below.*
- **Reach an in-page tab / WO detail (bounce fix):** land on `/workorders` then `page.evaluate(()=>{
  history.pushState({},'','/workorders/{id}/lines'); dispatchEvent(new PopStateEvent('popstate'))})`.
  Close the auto New-Line dialog via `.q-dialog i:text("close")` (Escape does NOT close Quasar
  persistent dialogs). JS-click a tab: `document.querySelector('[data-test-id=link_finance_tab]').click()`.
- **Quasar selects:** click `.q-dialog .q-select` by INDEX (labels wrap the whole dialog — never
  `label:has-text()`); options in `.q-menu .q-item`. Inputs: `input.q-field__native` by index.

## J. TestRail API
- **⚠️ TestRail is the ONLY real/production system — NEVER create/update/delete cases, runs, or
  results without EXPLICIT user permission (Standing Rule 6).** Log ONLY Passed cases to a run; keep
  Failed/Retest/Blocked local.
- **Project 1 / single suite 1 "Master"**; API v2, Basic auth. Helper `testrail-api.mjs` reads creds
  from `/tmp/testrail/creds.json` (email + password-OR-key + host) — **never hard-code creds.** Calls
  hit `{host}/index.php?/api/v2/{path}`.
- **`add_case` REQUIRES `custom_atmstatus:3` + `custom_automation_type:0`** (non-API cases). Place any
  case with API content in a section whose title includes "API" (Rule 4).
- **Result statuses:** 1 Passed · 2 Blocked · 3 Untested · 4 Retest · 5 Failed.
- **Known runs — do NOT write without permission:** Custom Roles run **312**, section **3527**;
  Simple Flow / F&D / Schedule / Report Suite run **325** (and R359 Reports). Section IDs per project
  in CLAUDE.md.
- **TestRail swallows angle-bracket `<placeholders>` as HTML — never use `<` `>` in case text; write
  plain words instead** (e.g. "Expand, then the technician's name" — not an angle-bracket
  placeholder). Confirmed live 2026-07-29: TU-DAY-01/C30418's expected result imported 2026-07-22 as
  "Expand 's daily breakdown" — the placeholder was eaten as an HTML tag. Sweep any import/push
  payload for `<` before sending.

## K. PRODUCTION access & fix-verification (SV-8721, proven 2026-07-29)
One indexed block for verifying a bug fix on PRODUCTION (`app.shopview.com` / `api.shopview.com`).
Terse entries; where the full detail already lives elsewhere in this playbook, this points there
(consolidated, not duplicated). All proven live 2026-07-27→29 on the SV-8721 5-decimal side project.
- **PROD login & session:** `POST /api/login {username, password}` → 200 + fresh `PHPSESSID`
  (PHPSESSID-only — NO SSO cookie on prod; quick-login 500s). **GOTCHA: a fresh login EXPIRES the
  same user's prior PHPSESSID** (old session → 409 "Session has expired") — log in ONCE per run,
  reuse for API + browser + cleanup. `cf_clearance` NOT needed via the agent proxy. Full entry: §A
  "PRODUCTION access". *(proven 2026-07-29)*
- **PROD browser automation:** boot2-style Chromium hydration works on prod — `PHPSESSID` cookie on
  `.shopview.com` + localStorage `user` = `{data:<login-response data>}` + `fe_permissions_wrapper`;
  Playwright pointed straight at `$HTTPS_PROXY`, **no MITM bridge needed**. Full entry: §A.
  *(proven 2026-07-29)*
- **PROD test org / workplace:** org `72b2cc90-6964-4429-a207-76e55f946936`; seed WOs in
  **"Trucks Hill 2" `b617914c-16e9-4485-8e8b-193cd86aa416`** (HAS canned lines; "QA Testing"
  `8badadec-…` has none). Full entry: §A. *(proven 2026-07-29)*
- **PROD API difference — WO line create:** `POST /api/work-orders/lines/create` → 400 "Labor or
  fixed prices must be set" even with a canned line → use
  **`POST /api/work-orders/{id}/lines/create-from-canned-line {canned_line_id, status:'authorized'}`
  → 201**. Full entry: §D. *(proven 2026-07-29)*
- **Node fetch proxy fix (this sandbox):** plain node `fetch` BYPASSES the egress proxy (403 "Host
  not in allowlist" while `curl` works) → run node with **`NODE_USE_ENV_PROXY=1`** (Node 22.22+,
  undici EnvHttpProxyAgent); confirm reachability with `curl` via `$HTTPS_PROXY` first. Full entry:
  §A. *(proven 2026-07-29)*
- **5-DECIMAL FIX-VERIFICATION RECIPE (works on staging AND prod, end-to-end):**
  (1) seed a throwaway WO (`work-orders/create`, §C; on prod use Trucks Hill 2) + a line
  (`create-from-canned-line`, §D);
  (2) add parts via `part/make-request` (§E) with **precision-stressing costs** — the customer trio
  `0.240 / 0.027 / 0.089` + a 4-decimal `45.6789` + a 5-decimal `124.96545`;
  (3) order them (`perform-request-status-action {action:'order'}`);
  (4) open the Receive screen `/order/{orderId}?receive=1&returnTo=WorkOrder&returnId={woId}` (§E);
  (5) check on-screen 5dp costs + line totals + Subtotal, AND the order-detail
  `GET /api/inventory/orders/{id}` **`price_decimal` / `total_cost_decimal` / `total_price_decimal`**
  fields vs the legacy rounded `price`/`total_price` (§E);
  (6) **Tax on the Receive screen = a manual dollar field** (defaults from the workplace tax rate —
  $0.00 on a 0%-rate org); typing a value live-recalculates Total = Subtotal + Tax (verified
  15.32 + 0.77 → 16.09);
  (7) clean up: `work-orders/delete` (§C — deleting the WO also removes its un-received PO).
  *(proven on staging 2026-07-27 + prod 2026-07-29, SV-8721)*
- **Jira evidence method (inline screenshots + editable comment):** attach PNGs to the issue first —
  `POST /rest/api/3/issue/{KEY}/attachments` with header `X-Atlassian-Token: no-check` (multipart
  `file=@…`) → then reference each as `!filename.png!` (optionally `|width=853`) in a **v2
  wiki-markup comment** (`POST /rest/api/2/issue/{KEY}/comment {"body":"<wiki markup>"}`) → renders
  inline. **Comments are editable in place:** `PUT /rest/api/2/issue/{KEY}/comment/{id}` with the
  full new body → 200; always re-GET to verify the text + `!refs!`. **Before/after evidence:** pull
  the ticket's ORIGINAL attachments for the "before" side instead of re-reproducing the bug.
  *(proven 2026-07-29, SV-8721 comment 74275)*
- **TestRail import gotcha (angle brackets):** `<placeholders>` get swallowed as HTML — full entry:
  §J. *(proven 2026-07-29)*

## L. Git practice with parallel workers
- **⚠️ Parallel workers SHARE ONE git index** — a bare `git commit` after `git add <own paths>` also
  commits whatever a sibling worker staged in between, sweeping their half-written files into the
  wrong commit. **Happened TWICE on 2026-07-30/31** (content survived both times, but history got
  muddied).
- **THE FIX (proven working): always commit PATH-SCOPED** — `git commit -- <explicit paths>` (or
  `git commit <paths>`), which commits only those paths regardless of what else is staged. **Never a
  bare `git commit` after staging, and never `git add -A` / `git add .`,** whenever other workers may
  be active. **Syntax gotcha:** `git commit -m "<msg>" -- <paths>` errors ("did not match any
  file(s)") — write the message to a temp file and use **`git commit -F /tmp/msg.txt -- <paths>`**
  (multi-line messages work cleanly this way too). *(proven 2026-07-31)*

## M. Figma: extract ALL frames from a design link (proven 2026-07-31, Filters)
**Use when** the user hands over one or more `figma.com/design/<fileKey>/...?node-id=A-B` links and
wants every frame/board captured. **Do NOT WebFetch the figma.com URL** (returns the app shell only)
and do not assume the Figma MCP is connected — it usually is not.

- **Creds:** a Figma **personal access token** already lives at **`/tmp/figma-token`** (secret →
  `/tmp` only, NEVER committed; scripts must read the file, never inline the value). Verify with
  `GET https://api.figma.com/v1/files/<fileKey>?depth=1` → HTTP 200 + the file name.
- **Node-id format gotcha:** the URL uses a **dash** (`11817-27678`); the **API uses a colon**
  (`11817:27678`). Convert both ways.
- **Step 1 — enumerate the whole tree (Rule 17 completeness):**
  `GET /v1/files/<fileKey>/nodes?ids=<id1>,<id2>,...` (all ids in ONE call), then walk it:
  descend through `CANVAS` and `SECTION`, and **collect at the first `FRAME` / `COMPONENT_SET`**
  (do not recurse into a frame or you collect its inner layers as separate boards).
  **Dedupe by node id** — a link often points at a whole CANVAS that *contains* the other links, so
  the union is far smaller than the sum. *(Filters: 4 links → 118 hits → **85 unique boards**.)*
  State the exact total found before rendering.
- **Step 2 — read the exact on-screen labels WITHOUT any image:** walk the same tree collecting
  `TEXT.characters` per board, **skipping `visible:false`** layers. This is the Rule-9 wording source
  and it survives a rate limit. Also read `componentProperties`/`variantProperties` on `INSTANCE`
  nodes — that is how you prove a state (e.g. a chip rendered with variant `Disabled` vs `Selected`),
  and `COMPONENT_SET` children names give the full variant list (`Default/Hover/Selected/Disabled`).
  Layer NAMES also identify unlabelled icons (`Filter-lines`, `Columns`, `Switch-vertical` = sort).
  **⚠️ Never report a `visible:false` layer as design content** — Figma components are full of hidden
  placeholder text ("By ownership", "Administrator", "Placeholder").
- **Step 3 — render:** `GET /v1/images/<fileKey>?ids=<comma ids>&format=png&scale=2` returns
  `{images:{id:url}}` (signed S3 URLs), then `curl -L -o <file> <url>`.
- **⚠️ THE BIG GOTCHA — the images endpoint has a hard, long-window cap.** After ~24 renders it
  returns `HTTP 429 {"err":"Rate limit exceeded"}` with **`retry-after: ~37874` (≈10.5 HOURS)**.
  `scale=1` is capped identically (cost is not per-pixel), and no amount of backoff helps inside a
  session. The **`/nodes` endpoint is a separate budget and keeps working** — which is why Step 2
  matters. Practical rules: **render in small batches with a pause, most-important boards FIRST**,
  make the fetcher **resumable** (skip any file already on disk, cache the signed URLs to json), and
  when capped, fall back to (a) PNGs already exported for the same node ids in an earlier pass, and
  (b) the Step-2 text/variant extraction — then state the honest split in the deliverable.
- **Naming (Rule 19):** `<Section-Name>__<Board-Name>__<node-id-with-dash>.png` — board names repeat
  constantly ("Mobile" ×4, "Step 1" ×3), so the node id is mandatory to disambiguate.
- **Python gotcha:** do NOT name a helper script `enum.py` — it shadows stdlib `enum` and breaks
  `import json` with a circular-import error.
- **Helpers (copy these):** `build/filters/design-2026-07-31/tools/` — `enumerate_frames.py`
  (tree walk + dedupe), `texts.py` (visible-text per board), `render.py` (batch image request),
  `fetch_all.py` (resumable download with backoff). Canonical example output:
  `build/filters/design-2026-07-31/DESIGN-NOTES.md` (85-board inventory + design-vs-cases flags).

## Jira/Confluence access
- Live browser login (headless Chromium via a fresh MITM bridge → id.atlassian.com email+password →
  6-digit EMAIL OTP) is the PRIMARY way to read `shopview.atlassian.net`. When the Atlassian MCP is
  live, read Confluence via `getConfluencePage` instead. **Full recipe + MFA-race crux:
  `build/ATLASSIAN-JIRA-ACCESS-METHOD.md`** (do not duplicate it here). Creds/cookies/OTP in `/tmp` only.
- **Posting evidence (attachments + inline images + comment edit):** see §K "Jira evidence method".

---

## Navigation Map

How to reach each screen. SPA routes are under `app.staging.shopview.com`. Top nav
items are **gated by permission** (a hidden item means the role lacks the perm).

| Screen / Feature | Nav path (from the top) | SPA route | Notes |
|---|---|---|---|
| Work Orders list | Top nav → Work Orders | `/workorders` | Gated by `workOrdersView`. |
| Work Order detail | WO list → click a row | `/workorders/{id}/lines` | **Existing-WO detail bounces to `/workorders` on mount for ALL roles incl. admin.** Only a **freshly-created** WO reliably lands on the detail/lines page — create fresh to test line/part/finance flows. |
| WO Finance tab | open WO → **Finance** tab | (within WO detail) | Gated by `invoicingPaymentsView` **AND** `seeFinancialData`. Holds Create Invoice / Add Deposit / invoice kebab (Reverse / Issue Credit). |
| WO Parts tab | open WO → **Parts** tab | `/workorders/{id}/parts` | Direct URL to `/parts` sub-route returns page-not-found without WO context (SPA needs WO loaded). Order Parts is meant to gate this tab (visibility looked identical ON/OFF — needs manual confirm). |
| WO Lines / Notes / Stats tabs | open WO → tab | (within WO detail) | Tabs render as Lines / Parts / Notes / Stats (+ Finance when invoicing+SFD on). |
| Schedule (calendar) | Top nav → Schedule | `/schedule` | Gated by `scheduleView`; shows ALL users' appointments. Create/delete = click/drag on the grid (no persistent button). |
| Parts (department) | Top nav → Parts | `/parts` | Gated by Parts Department parent. Parent OFF → nav item gone and inner pages redirect to `/workorders`. |
| Part Sales | Parts → Part Sales | `/parts/part-sales` | **Route is flaky in the harness** (sometimes never reaches `domcontentloaded`; `page.evaluate` hangs) while admin/catalog/vendor routes load fine. `/part-sales`, `/partsales` are NOT valid (page-not-found). |
| Catalog | Parts → Catalog | `/parts/parts-catalogue` | Read-only without Create&Edit. |
| Inventory | Parts → Inventory | `/parts/inventory` (also `/inventory`) | "New Inventory Part" button with Create&Edit. |
| Part History (inventory) | Parts → Inventory → **clock icon** next to a part | `/parts/inventory` | Clock icon (tooltip **"Part History"**) opens that part's history. This is a **separate feature** from the WO View History Logs permission. **Part Sales has NO history.** (Confirmed with product owner.) |
| Vendors | Parts → Vendors | `/parts/vendors` (also `/vendors`) | Supply-chain sub-tabs: Purchase Orders, Vendor Invoices, Returns, Vendors. |
| Parts → Returns | Parts → Vendors → Returns tab (or Parts → Returns) | `/parts` → Returns | Returns list; row three-dots → "Return to inventory" / "Delete Return". |
| Customers | Top nav → Customers | `/customers` | Gated by `customersView`; OFF → nav gone and `/customers` redirects to `/workorders`. Customer detail tabs: Work Orders / Part Sales / Contacts / Assets(vehicles) / Notes / Payments. |
| Reports | Top nav → Reports | `/reports` | Gated by `reportsPageAccess`. Left nav groups: A/R Aging (Summary/Detail/Collection), A/P Aging (Summary/Detail/Unpaid Invoices), Sales Tax, Timesheet Activities. |
| A/R & A/P aging reports | Reports → left nav | `/reports/ar-aging-summary`, `/reports/ap-aging-summary`, `/reports/ap-unpaid-invoices`, `/reports/ar-aging-collection` | Now follow **Reports** permission (all-or-nothing), per updated spec. |
| Timesheet Activities | Reports → Timesheet Activities | `/reports/punch-clock-activities` | Default report view; gated by `timesheetsView` (+ reports). |
| Administration (Settings home) | left sidebar → Settings group | `/administration`, `/administration/settings` | No perms → `/administration` redirects to `/workorders`; no SETTINGS group in sidebar. |
| Roles & Permissions (roles list) | Settings sidebar → **Roles & Permissions** | `/administration/roles-permissions` | Heading "Roles & Permissions". "Create custom role" button. Gated by `settingsApp` (App Settings). |
| Create/Edit role | Roles list → "Create custom role" (or pencil) | `/administration/roles-permissions/new` · `/administration/roles-permissions/{id}/edit` | Template picker modal → Apply → `/new?template=...`; Skip → blank `/new`. View-only summary at `/{id}/summary`. |
| Staff | Settings sidebar → Staff | `/administration/staff` | Role user-counts link here as `?roleName=<RoleName>`. |
| Locations / Departments / Taxes | Settings sidebar (App group) | `/administration/locations`, `.../departments`, `.../taxes` | App Settings group also holds Settings + Staff + Roles & Permissions. |
| Service settings | Settings sidebar → Service group | `/administration/labour-types` (Labor Rates), `/canned-lines` (Canned Lines), Asset Types, Inspection Templates | Gated by `settingsService`; OFF → these redirect to `/administration/locations`. |
| Parts settings | Settings sidebar → Parts group | Pricing, Bin Locations, Categories | Gated by `settingsParts`. |
| Finance settings | Settings sidebar → Finance group | Payment Methods | Gated by `settingsFinance`. **No QuickBooks entry present** (relocation not implemented). |
| Data Import | Settings sidebar → Imports group | Contacts, Assets, Vendors, Inventory, Invoices | Gated by `settingsDataImport`. |
| Wages | (per-staff) Staff → Edit Staff Member | (modal) | `settingsWages` reveals Salary Type + Hourly Rate on the staff modal. |
| Integrations | Settings sidebar → Integrations | `/administration/quickbooks`, `/administration/finance/quickbooks` (routes exist) | Shows only **IBS**; QuickBooks absent. |

---

## WORK ORDERS

### Create a WO
- **UI path:** Top nav → Work Orders (`/workorders`) → **New / New Work Order** button → New Work Order dialog (Customer selector + Asset selector) → Create.
- **API:** `POST /api/work-orders/` (create). Dialog offers inline **Add** buttons for Customer and Asset that open working create forms.
- **Preconditions:** `workOrdersView` + `workOrdersCreateAndEdit`. Customer selector lists customers even when `customersView` is OFF (feature-access vs data-access).
- **Gotcha/Unblock:** `work-orders/create` returns **HTTP 500 in some sessions** — reuse an existing record or create via the UI. Custom Quasar dropdowns for Customer/Asset resist automation; the New WO dialog's Add-Customer/Add-Asset buttons are **NOT gated** by `customersCreateAndEdit` (they appear and function regardless — a known FE-gating gap). **Create fresh** whenever you need to reach a WO detail page.
- **Confidence:** Medium (dialog + affordances confirmed; full automated save flaky).

### Open / navigate a WO
- **UI path:** Work Orders list → click a row → WO detail `/workorders/{id}/lines`.
- **API:** `GET /api/work-orders/view/{id}` · `GET /api/work-orders/lines/{wo}` · list `GET /api/work-orders` / `GET /api/work-orders/simple-list`.
- **Gotcha/Unblock:** **Existing-WO detail bounces back to `/workorders` on mount for every role (incl. admin).** Deep-links and row-clicks both bounce. **Workaround: create a fresh WO** — only freshly-created WOs reliably land on the detail/lines page — then run line/part/finance actions there.
- **Confidence:** High (bounce reproduced across all roles).

### Add a line
- **UI path:** WO detail → Lines tab → **New Line** button → New Line dialog (includes "AI - SHOPCOACH LINE BUILDER" entry).
- **API:** `POST /api/work-orders/lines/create`. Canned-line pick source: `GET /api/work-orders/canned-lines` **(verify — not evidenced in artifacts; the `/canned-lines` seen is the Service-settings SPA route)**.
- **Preconditions:** `workOrdersView` + `workOrderLinesCreateAndEdit` (New Line button + ShopCoach builder are gated by `workOrderLinesCreateAndEdit`; hidden when OFF).
- **Gotcha/Unblock:** `work-orders/lines/create` can return **HTTP 500** in some sessions. Line persisted end-to-end when created via the New Line dialog (Lines count incremented).
- **Confidence:** High (line added + persisted).

### Change a line's status (approve / authorize a line)
- **UI path:** WO detail → Lines grid → per-line **Approve** button (or bulk **Set line status**).
- **API:** `POST /api/work-orders/lines/change-status` body `{line_id, status:'authorized', workOrderId}` → **200**. Status advances `authorization_required` → `authorized`.
- **Preconditions:** line in an approvable state; `workOrderLinesCreateAndEdit`.
- **Confidence:** High (executed, 200).

### Bulk line status change
- **UI path:** WO detail → Lines grid → select lines → bulk-action menu (**Set line status | Delete lines | Split work order**) → Set line status.
- **API:** `POST /api/work-orders/lines/change-lines` → **201** (body `{data:[]}` on success). Bulk-complete works even for another tech's line (SV-8042 own-data bypass — needs manual confirm with default Technician role).
- **Confidence:** High (executed, 201, from SV-4112).

### Delete a line
- **UI path:** WO detail → Lines grid → select line → bulk-action menu → **Delete lines**.
- **API:** `POST /api/work-orders/lines/delete-lines` → **200**. Guard: `POST /api/work-orders/lines/check-delete` **(verify — endpoint named in task, not evidenced)**.
- **Preconditions:** `workOrderLinesDelete`. **A line is deletable in any status EXCEPT Complete.**
- **Confidence:** High for delete-lines (executed 200, Lines count decremented); (verify) for check-delete guard.

### Approve / authorize a WO (send for approval)
- **UI path:** WO detail → approvals / Send-to-Portal action.
- **API:** `POST /api/work-orders/approvals/create-approval-request`.
- **Gotcha/Unblock:** This `create-*` endpoint returns **HTTP 500 for BOTH Office and Admin** in-session (the create-* session quirk) — a clean 403 could not be isolated. WO/line status ladder: **Uncomplete / Approved / Authorized / Complete**.
- **Confidence:** Medium (endpoint mapped; 500 quirk observed).

### Uncomplete a WO, then delete it
- **UI path:** WO header three-dot menu → (Uncomplete) → then Delete Work Order.
- **API:** `POST /api/work-orders/delete` body `{work_order_id}`. **Move the WO to Uncomplete first** — delete requires it.
- **Preconditions:** `workOrdersDelete`. Without it: header menu shows only Audit Log/Timesheets (no Delete) **and** the endpoint returns **403 "Access denied."** (verified for Parts Manager).
- **Confidence:** High (403 gating confirmed; Uncomplete-first rule documented).

### Edit WO header / change service advisor
- **UI path:** WO detail → header fields / service-advisor selector.
- **API:** `POST /api/work-orders/change-service-advisor`.
- **Gotcha/Unblock:** FE hides it for Technician, but the **backend does NOT enforce it** — a Technician POST to `change-service-advisor` actually changed the field (FE-only display gate). Expected-denial cases must be verified in the **UI**, not by the endpoint.
- **Confidence:** High (FE-only gate proven).

### Edit asset fields on a WO (mileage / engine hours / plate / VIN)
- **UI path:** WO detail → vehicle/asset fields (VIN via **Edit Vehicle** form).
- **API:** `POST /api/work-orders/change-mileage` · `.../change-engine-hours` · `.../change-licence-plate` (all → **201**); VIN via `POST /api/vehicles/change` → **201**.
- **Confidence:** High (all four executed + persisted).

### Complete the Review step (why it blocks Create Invoice)
- **UI path:** WO detail → Review action (surfaces when the WO is in a reviewable state).
- **Gotcha/Unblock:** An **unclicked Review button blocks Create Invoice.** Create Invoice only enables after Review is complete (WO moved Approved → Reviewed → Complete). The Review action's visibility is gated by the `woReviewWorkOrders` sub-toggle.
- **Confidence:** High (Create-Invoice prereq confirmed across roles).

---

## PARTS

### Add a part to a line
- **UI path:** WO detail → Lines → line **more_vert** menu → **Request part** / Add Part window → Save & Close.
- **API:** part request creation flows through the WO part endpoints; category edit on an existing request uses `POST /api/work-orders/part/change-request` → **200** (recalculates sellPrice/margin; category select editable for inventory parts).
- **Gotcha/Unblock:** The Add-Part combobox + Save&Close flow is **harness-flaky** (SV-5132: modal sometimes doesn't close). Needs a role with add-parts permission (`woAddParts`; stock Technician role has it false).
- **Confidence:** Medium (change-request 200 confirmed; add-part flow flaky).

### Order / pick a part
- **UI path:** WO detail → Parts grid → blue **Order** button (part in "Auth to order") or green **Pick** button (in-stock part).
- **API:** `POST /api/work-orders/part/perform-request-status-action` body `{part_request_id, action:'order'|'pick'}` → **201**. Order: `authorized_to_order` → `waiting_to_receive`; Pick: in-stock → moves toward Received.
- **Preconditions:** `woOrderParts` (+ SFD) for Order; `woPickParts` for Pick. **Both are FE-only gates** — the endpoint returns **400 validation, not 403**, with only `workOrdersView` (confirm the Pick/Order control renders in the UI to test the gate).
- **Confidence:** High (order + pick both executed, 201).

### Receive a part (so it has a real part number)
- **UI path:** Parts / receiving flow (mark the ordered part received).
- **Gotcha/Unblock:** **Invoicing is blocked by parts that are "Requested", show `(-)`, or have no part number/badge.** The **OVER LIMIT** customer badge does **NOT** cause this — the real cause is a blank/missing part number. Fix: **delete the bad request and re-add the part WITH a number, then receive it** so it becomes a genuinely RECEIVED numbered part. (Auto Pick bug SV-6873: approving a quoted part can pick 2×qty — verify.)
- **Confidence:** High (documented as the Create-Invoice unblock across multiple runs).

### Catalog: create / edit / delete a part
- **UI path:** Parts → Catalog (`/parts/parts-catalogue`) → **New Catalog Part** (create) / open part → edit / delete.
- **API:** `POST /api/parts-catalogue/add-catalogue-part` → **201** · `POST /api/parts-catalogue/change-catalogue-part` → **200** · `POST /api/parts-catalogue/remove-catalogue-part?id=<partId>` → **200**.
- **Preconditions:** Catalog View/Create&Edit/Delete. Cost & price columns gated by **SFD** (ON shows Average Cost/Sell Price, OFF hides them; item still creatable).
- **Gotcha/Unblock:** **Backend does NOT enforce catalog edit/delete** — Office (view-only) `change-catalogue-part` returned **200** and persisted; Parts Tech (no delete perm) `remove-catalogue-part` returned **200**. FE hides the controls but the API is open — verify denials in the UI.
- **Confidence:** High (all three executed).

### Inventory: create / delete a part
- **UI path:** Parts → Inventory (`/parts/inventory`) → **New Inventory Part** (create) / row delete.
- **API:** `POST /api/inventory/parts/create` → **201** · `POST /api/inventory/parts/delete` → **201**. List: `GET /api/inventory/parts`. Orders: `GET /api/inventory/orders`.
- **Part history:** Each part row has a **clock icon** (tooltip **"Part History"**) under Parts → Inventory that opens that part's history. This is a **separate feature** from the work-order View History Logs permission and is NOT gated by it. **Part Sales has NO history at all.** (Confirmed with product owner.)
- **Confidence:** High (create + delete executed as Parts Manager, 201).

### Vendors: create / delete
- **UI path:** Parts → Vendors (`/parts/vendors`) → **New Vendor** form (Name required; Country, Taxes) → Save & Close.
- **API:** `POST /api/parts-catalogue/add-vendor` → **201** · `POST /api/parts-catalogue/remove-vendor` → **201**. Vendor detail (with sensitive fields credit_term/credit_limit/tax_id): `GET /api/parts-catalogue/vendor/{id}`.
- **Gotcha/Unblock:** UI vendor save can be blocked by a **Google Maps overlay**; the API create needs a **valid `tax_id` UUID** (returns 400 validation without one, never 403). Vendor credit: `POST /api/parts-catalogue/vendor/credit/create` → **200**.
- **Confidence:** High (add/remove executed as Parts Manager, 201).

### Part Sales: create
- **UI path:** Parts → Part Sales (`/parts/part-sales`) → create.
- **API:** `POST /api/part-sales` body `{company_id:<customer>}` → **200** (new part-sale, status Estimate). List `GET /api/part-sales`.
- **Preconditions:** `partSalesCreateAndEdit` (+ `invoicingPaymentsCreateAndEdit` to invoice it).
- **Gotcha/Unblock:** **The `/parts/part-sales` SPA route is flaky** — it repeatedly failed to finish loading in some sessions (blocked cases 26411/26412). If the UI won't load, hit `POST /api/part-sales` directly after confirming the FE gate is reachable.
- **Confidence:** High for the endpoint (executed 200); route itself flaky.

### Part Sales: Fees & Discounts VIU recipe (staging, proven 2026-07-22)
- **Part sales ARE work orders under the hood** — use the WO endpoints, NOT `/api/part-sales/{id}` (that 404s for detail/delete).
  - Detail route (SPA): `/parts/part-sale/{id}/part-requests`; Statistics section renders further down the same view.
  - Read: `GET /api/work-orders/view/{id}` (has `adjustments[]`, `adjustmentsSummary`, `editable`, `deletable`) and
    `GET /api/work-orders/lines/{id}` (`data.collection[0].part_requests[]`, each with `adjustments[]`).
- **Create:** `POST /api/part-sales {company_id}` → 200 `{data:[{id}]}` (harvest `company_id` from any `work-orders/view`).
- **Add parts (UI, reliable):** open detail → `[data-test-id="button_add_part"]` → `[data-test-id="select_part"]` type a
  catalogue name → click first `.q-menu .q-item` → set qty (`input_bin_quantity_*` for inventory, else
  `input_workorder_part_quantity`) → **"Save & Add Part"** (repeat) / **"Save & Close"** (last).
- **Add fees/discounts (API):** `POST /api/work-orders/adjustments/add` with
  `{workOrderId, kind:'fee'|'discount', name, calculationType, amount, maxCap:null, scope, targetId, taxable:true, templateId:null, description:null}`.
  - Part-line: `scope:'part_line'`, `targetId:<part_request id>`, calc `pct_parts` (or `flat`).
  - Whole parts-sale: `scope:'whole_wo'`, `targetId:null`. **Percent uses `pct_subtotal`** (⚠ `pct_total` → 400 "Invalid
    calculation type" on part sales); flat uses `flat`. (`pct_grand_total` is the company Processing-Fee template.)
- **Row/menu test-ids:** per-part ⋮ = `button_part_request_menu_{partId}` (ABSENT on non-editable sales → add blocked);
  top-right whole-sale ⋮ = `button_part_sale_nav_bar_menu` ("Delete / Add Parts Sale Fee / Discount / Set status");
  card adjustment kebabs = `button_parts_sale_adjustment_actions_{adjId}`.
- **Filled-cell breakdown viewer:** click the F&D cell text (e.g. `text=/Part Fee/`) → dialog "Fees & Discounts" with cols
  Name/Type/Calculation/Amount/Max Amount + "Net adjustment"; per-row `i:text-is("delete")` → confirm "Remove Fee /
  Discount" → "Remove".
- **Delete a part sale:** `POST /api/work-orders/delete` (201) — driven from top-right ⋮ → Delete → confirm. Re-GET
  `work-orders/view/{id}` then returns 400 (gone). (Direct `DELETE /api/part-sales/{id}` and `DELETE /api/work-orders/{id}` 404.)
- **Confirmed labels (SV-8479 build, staging):** F&D column has NO "+ Add"; per-part menu "Add Part Fee / Discount";
  per-part dialog title "New Part Fee / Discount" + subline "Applying To: Line N Part — Part — (pn) name"; whole-sale menu
  "Add Parts Sale Fee / Discount" + dialog "New Parts Sale Fee / Discount" + subline "Applying To: Entire Parts Sale";
  card "Parts Sale Fees & Discounts" plain text w/ bracket % (fee no sign, discount minus, flat name-only); Financial Info
  "Fees & Discounts (N)" directly above Subtotal; Statistics F&D section headings "% Amount" (flat = blank %); jurisdiction
  note below Taxable Yes/No dropdown in every dialog.
- **Confidence:** High (all executed live 2026-07-22, admin with Part Sales C&E + See Financial Data).

### Returns: create / list / delete
- **UI path (create from WO):** WO line → part context menu → **Return** → "Add new part return request" dialog (Return Reason, Quantity) → confirm.
- **UI path (create from WO, manual):** returns list / WO part actions.
- **UI path (delete):** Parts → Returns → row three-dots → **Delete Return** → "permanently delete" confirmation (No / Yes).
- **API (create):** `POST /api/work-orders/part/make-return-request` → **200** (returns a new return-request id) · alt `POST /api/part/manual-return-request/create` → **201** (creates part-return, status "returned").
- **API (delete):** `POST /api/work-orders/part/remove-return-request` body `{part_return_request_id}` (or `{partReturnRequestId}`) → **200** · also seen: `POST /api/work-orders/part/delete-return-request` → **200** (return-request count drops).
- **API (list):** `GET /api/work-orders/part/list-return-requests`.
- **Preconditions:** returning a part from a WO requires **no permission** (endpoint never 403s; falls through to business validation — e.g. 400 "Cannot return inventory part" / "part_id: Not found"). Deleting a return currently works even without `invoicingPaymentsDelete` (old Vendor&Order-Delete gating still applies — SV-7911 not enforced).
- **Gotcha/Unblock:** **A return cannot be deleted on a COMPLETED WO — uncomplete the WO first.** Also, to return a received part the WO must be uncompleted (line status Authorized).
- **Confidence:** High (create + delete both executed, 200/201).

### Cores (core OK / Not-OK)
- **UI path:** WO line → core inspection control (appears on the line).
- **Preconditions:** requires a **core-bearing part that has been RECEIVED and is awaiting core inspection** — the control does not appear on a normal line. Governed by **WO Lines Create & Edit** (covers core OK/Not-OK + line story/history).
- **Gotcha/Unblock:** the core data state could not be seeded in the harness (parts add+receive flow not drivable) — needs manual setup of a received core part.
- **Confidence:** Medium (precondition + gate documented; not driven).

---

## INVOICING / PAYMENTS

### Create an invoice
- **UI path:** WO detail → **Finance** tab → **Create Invoice** button. (After success the app auto-opens a "New Customer Payment" dialog.)
- **API:** `POST /api/invoices/create` → **201** (returns invoice_id; WO status → "Invoiced"). Invoice detail `GET /api/invoices/{id}/details`. Estimate PDF/HTML `POST /api/work-orders/invoices/estimate`.
- **Preconditions (ALL required):** every part **RECEIVED with a real PART NUMBER** (no "Requested", no `(-)`, no badge) **AND** the **Review** step completed **AND** `invoicingPaymentsCreateAndEdit` + `seeFinancialData` (SFD OFF → no Finance tab at all, even with V/E/D).
- **Gotcha/Unblock:** **OVER LIMIT badge blocks nothing** — if Create Invoice does nothing, it's a missing part number or an unclicked Review, not the credit badge. Use a **clean throwaway customer** + a fresh WO taken Approved → Reviewed → Complete.
- **Confidence:** High (created 201 across Foreman/SM/SA/SSA).

### Reverse an invoice
- **UI path:** WO detail → Finance tab → invoice **three-dot** menu → **Reverse** → Warning ("re-open and undo the invoice") → confirm Reverse. (Part-sales invoice: Part Sales → invoice → reverse.)
- **API:** `POST /api/invoices/reverse-invoice` body `{id}` → **200** (WO reverts "Invoiced" → "Complete", Create Invoice reappears).
- **Preconditions:** WO-invoice reverse is gated by **Work Orders: Delete** (SM has WO Delete → reverse allowed even though `invoicingPaymentsDelete`=OFF). Foreman/Parts Manager without it → menu shows only "Issue Credit" and the endpoint returns **403 "Access denied."**
- **Confidence:** High (executed 200 allowed and 403 blocked, both observed).

### Issue credit
- **UI path:** WO detail → Finance tab → invoice three-dot menu → **Issue Credit** (present even for roles that lack Reverse).
- **Confidence:** Medium (menu item confirmed; flow not fully driven).

### Create a payment
- **UI path:** WO Finance (after invoicing) → **New Payment** → method (e.g. Cash) → amount → **Make Payment**. Customer Payments also on Customers → customer → Payments tab.
- **API:** `POST /api/customer-account/create-customer-payment` → **201** (returns payment id).
- **Preconditions:** an unpaid invoice; `invoicingPaymentsCreateAndEdit` + SFD. **Add Deposit** action on Finance is gated by Invoicing Create&Edit (absent for view-only).
- **Gotcha/Unblock:** `create-customer-payment` returns **HTTP 500 in some sessions** — process via the UI when the API 500s.
- **Confidence:** High (created 201 as SSA); 500 quirk noted.

### Reverse a payment
- **UI path:** Customers → customer → Payments tab → row delete/trash icon → confirmation ("reverse the payment for all invoices … record preserved for audit") → **Reverse**.
- **API:** `POST /api/customer-account/reverse-customer-payment` → **201** (payment removed from invoice; record kept for audit).
- **Preconditions:** per-payment delete icon is gated by **`invoicingPaymentsDelete`** (NOT Customer Management Delete).
- **Confidence:** High (executed 201).

### Remove a customer transaction (delete payment / void)
- **API:** `POST /api/invoices/remove-customer-transaction` → **403 "Access denied."** without `invoicingPaymentsDelete` (observed for Service Manager).
- **Preconditions:** `invoicingPaymentsDelete`.
- **Confidence:** High (403 gating observed).

### Send to Terminal
- **UI path:** WO Finance → **Send to Terminal** (appears on an **unpaid invoice**; gated by Invoicing Create&Edit).
- **Confidence:** Medium (gate confirmed; needs an existing unpaid invoice to surface it).

---

## CUSTOMERS / VENDORS

### Create / edit / delete a customer
- **UI path:** Top nav → Customers (`/customers`) → **New Customer** (create) → save; open customer → pencil (**Edit Customer** modal) → Save; Edit modal → **Delete** → "Are you sure you want to delete the company?" → confirm.
- **API:** `POST /api/customers/create` → **201** · `POST /api/customers/change` → **200** · `POST /api/customers/delete` (redirects to list; id absent after). List/read `GET /api/customers`.
- **Preconditions:** `customersView` (+ Create&Edit / Delete). New WO dialog can create customers even without `customersCreateAndEdit` (non-gated Add — FE gap).
- **Gotcha/Unblock:** Sales Rep has no customer access — `GET /api/customers` → **403**, `POST /api/customers` → **405** (no write route). Deleting a customer does **NOT** delete its payments (needs Invoicing Delete).
- **Confidence:** High (CRUD executed as Office/Tech).

### Customer AP/AR tabs + sensitive fields gating
- **UI path:** Customers → customer → Edit Customer modal (sensitive fields) / Payments & AR tabs.
- **Gotcha/Unblock:** **`seeApArData` (AP/AR) ON reveals the 7 sensitive customer fields** — Credit Terms, Credit Limit, Default Labor Rate, Default Shop Supplies, Min & Max, Taxes, PO is required; OFF hides all 7 (basic fields remain). Vendor sensitive fields (credit_term, credit_limit, tax_id) are served unmasked to Office via `GET /api/parts-catalogue/vendor/{id}`.
- **Confidence:** High (7-field toggle confirmed).

### Create a vendor
- See **PARTS → Vendors** (`POST /api/parts-catalogue/add-vendor`). Also `POST /api/vendors` exists but returned 404/405 for roles without vendor access. Staff/user creation: `POST /api/iam/create` → **201** (returns user_id).

---

## NOTES

### Create / edit / delete a note
- **UI path:** WO (or Customer) detail → **Notes** tab → add note; existing note **more_horiz** menu → **Edit note** / **Delete note** / Attach files.
- **API:** `POST /api/note/create` body `{type:'work_order', reference_id:<WO>, content}` → **201** · `POST /api/note/update` → **200** · `POST /api/note/delete` → **200**. List `GET /api/notes`.
- **Who can edit/delete whose note (per updated spec):** **WO View = create/edit ANY note; WO Delete = delete ANY note.** Confirmed: Admin edited a Tech-authored note (`note/update` 200). JSA could create/edit/delete its **own** note (all 200/201); editing others' notes was tested against an admin-authored note.
- **Gotcha/Unblock:** the Quasar rich-text editor resists automation; note create/update still succeed via the endpoint. Story-history opens a panel (not a simple dialog).
- **Confidence:** High (create/update/delete executed).

### View History Logs (WO history + line story)
- **Scope:** **View History Logs governs work-order-level history (the WO Audit Log / History) AND line-level (line story/history) — for WORK ORDERS ONLY. There is NO history log for Part Sales or Purchase Orders. (Confirmed with product owner.)** Do not assert any part-sales or PO history behavior.
- **UI path:** WO detail → History / Audit Log section (WO-level); WO line → line story/history panel (line-level).

---

## ROLES / STAFF / ADMIN

### List roles / read a role
- **UI path:** Settings sidebar → **Roles & Permissions** (`/administration/roles-permissions`).
- **API:** `GET /api/organizations/{org}/roles` (authoritative list) · `GET /api/roles` · `GET /api/roles/{id}`. Org id in CLAUDE.md. Role fields include `default`, `editable`, `deletable`, `usersCount`, `template_id`.
- **Gotcha:** 11 system roles (Admin, Office, Time Clock, Service Manager, Service Advisor, Foreman, Technician, Parts Manager, Parts Tech, Senior Service Advisor, Sales Representative), all `default=true`. Office & Time Clock are non-editable (lock + eye-only → `/{id}/summary`); **Admin is `editable=true`** (pencil present) but all toggles disabled with a "Full administrative access" banner.
- **CONFIRMED (product owner):** Non-editable system roles: ONLY **Office** and **Time Clock** (lock + eye-only, View Permissions only). All other system roles, **INCLUDING Administrator**, are editable (pencil + three-dot Edit). No system role is deletable.
- **CONFIRMED (product owner):** Actions column: standalone **Eye (View Permissions)** icon shows ONLY for **Office** and **Time Clock**; all other roles (Administrator, all other system roles, and any custom roles) have **no eye icon** in Actions — View Permissions is inside the **3-dot menu** (3-dot menu > View Permissions).
- **Confidence:** High.

### Create / edit / delete a custom role
- **UI path (create):** Roles list → **Create custom role** → "Choose a template" modal → pick a template → **Apply** (`/new?template=...`, prefilled) or **Skip** (blank `/new`) → set Role name* + permissions → **Create** ("Role created successfully." toast).
- **UI path (edit):** Roles list → row **pencil** → `/{id}/edit` → change → **Save** → "Confirm Permission Updates" dialog (added/removed lists) → confirm.
- **UI path (delete):** Roles list → row **three-dot** menu → **Delete** (only appears when usersCount=0) → confirm ("Role deleted successfully.").
- **API:** `POST /api/roles` / `PUT /api/roles/{id}` (create/update) · `DELETE /api/roles/{id}` (delete). Similar-role check: `POST /api/check-existing-roles`.
- **Preconditions/Gotchas:** Create is disabled until a Role name + ≥1 permission ("At least one permission is required"). Duplicate name → "Role name already exists in the Organization." Duplicate permission set → "Similar role already exists" confirm dialog. **A role with ≥1 assigned user cannot be deleted** — Delete item is hidden and the editor's Delete button is disabled ("This role is assigned to N user(s). Reassign them…"); reassign users to 0 first. No "Duplicate" action exists. CRUD cascade: checking Delete auto-checks Create&Edit + View; unchecking View clears all (incl. WO Lines C&E/Delete). WO Lines card has **no View column** (inherits WO View); Timesheets card shows only View + Create&Edit (no Delete).
- **CONFIRMED (product owner):** Edit Role > Reset to Template: resets the custom role's permissions to its template defaults; the Save button enables ONLY if the role differed from the template (if it already matches, Save stays disabled). Path: Settings > Roles and Permissions > pencil (edit) > Reset to Template > Save. (Confirmed with product owner.)
- **Confidence:** High (create/edit/delete executed with toasts).

### Assign a role to a staff member
- **UI path:** Settings → Staff → open staff → **Edit Staff Member** modal → Role select (grouped SYSTEM / CUSTOM; eye icon = View Permissions preview) → save.
- **CONFIRMED (product owner):** Edit Staff Member modal (Administration > Staff > open a staff member): an eye icon next to the Role dropdown opens a read-only Permission Summary for the selected role. (Confirmed with product owner.)
- **API:** `POST /api/staff/{id}/change` → **201**. Body: `{first_name,last_name,email,workplace_id,role_id}`.
- **Preconditions/Gotchas:** **Use the EXACT Tech `/change` staff_id `6fb22c1b-...`.** The staff-**list** id **`a7fd0a88-...` 404s on `/change`** — never use it there. Never match by substring/email (a past near-miss changed the wrong user). An invalid `role_id` returns **500** and does **not** persist (Tech stays on prior role).
- **Confidence:** High (executed 201; id distinction proven).

### Create staff / search staff
- **API (create):** `POST /api/iam/create` → **201** (`{message:"created", user_id}`). **Staff search:** `GET /api/staff?search=` **(verify — not evidenced; base `GET /api/staff` list is evidenced)**. Clocked staff `GET /api/staff/clocked`.
- **UI path (search):** Staff page search field ("Search Role" analog on Roles list filters live).
- **Confidence:** High for `iam/create`; (verify) for the search query param.

### Role change forces re-auth (409)
- **Gotcha:** Changing a user's role **immediately invalidates the held session** — the very next request returns **HTTP 409 "Session has expired."** (at +0ms). The new role applies on a **fresh login**; re-login and poll `GET /api/auth/me/fe-permissions` until it reflects the new set. This 409 is **expected**, not an error.
- **Confidence:** High (reproduced 26525).

---

## REPORTS / SCHEDULE / TIMESHEETS / SETTINGS

### Reports + aging reports gating
- **UI path:** Top nav → Reports (`/reports`) → left nav (A/R Aging Summary/Detail/Collection, A/P Aging Summary/Detail/Unpaid Invoices, Sales Tax, Timesheet Activities).
- **API:** e.g. `GET /api/reporting/account-payable/unpaid-invoices-report`. Reports open with no 4xx when `reportsPageAccess` is on.
- **Gotcha:** Per the updated spec **aging reports follow the Reports permission (all-or-nothing), not Manage AP/AR** — but staging still had 26482 aging gated by AP/AR when last checked (spec not fully implemented). Office (with Reports) loaded both A/R and A/P aging with no block.
- **Confidence:** High (reports load confirmed); spec-vs-staging gap noted.

### Schedule / calendar
- **UI path:** Top nav → Schedule (`/schedule`) → full calendar (shows ALL users' appointments).
- **API:** `GET /api/calendar?date=...&end_date=...` (the schedule data endpoint).
- **Preconditions:** `scheduleView`; create/edit needs `scheduleCreateAndEdit`.
- **Gotcha/Unblock:** create/delete an appointment is a **click-to-create/drag interaction on the grid with no persistent button** — the harness could not reliably drive it; needs manual click on a day/resource cell.
- **Confidence:** Medium (view confirmed; create/delete not driven).

### Timesheets
- **UI path:** Reports → **Timesheet Activities** (`/reports/punch-clock-activities`). Wage fields on Staff → Edit Staff Member (needs `settingsWages`). Department clock: `POST /api/technician-tasks/department-clock-in {department_id}` → 201 · `.../department-clock-out {task_id,description}` → 201.
- **Preconditions:** `timesheetsView` (+ reports) to see; Create&Edit to edit. Timesheets card has no Delete column.
- **Gotcha:** virtualized report rows resist automation — edit dialog could not be opened in-harness.
- **Confidence:** Medium (view + department-clock endpoints confirmed).

### Settings sub-toggles
- **UI path:** Roles editor → **Settings** toggle reveals exactly **6** sub-toggles (App Settings, Service, Parts, Finance, Data Import, View/Manage Wages) — **no 7th "Integrations"** sub-toggle. Turning the last enabled sub OFF auto-sets the Settings parent OFF; OFF→ON preserves prior sub selections.
- **Sidebar mapping:** App Settings → Settings + Staff + Roles & Permissions + Locations + Departments + Taxes · Service → Labor Rates + Canned Lines + Asset Types + Inspection Templates · Parts → Pricing + Bin Locations + Categories · Finance → Payment Methods (no QuickBooks) · Data Import → Contacts/Assets/Vendors/Inventory/Invoices · Wages → staff wage fields. Org settings write: `POST /api/organizations/settings/change`.
- **Confidence:** High (toggle counts + sidebar groups observed).

---

## HEADLESS-AUTOMATION TECHNIQUES

When the Quasar/Vue SPA resists normal clicks, escalate in this order (proven across runs):

1. **Selector click** (normal Playwright click).
2. **Fire the element's own click handler / `dispatchEvent`** (dispatch a synthetic `click`/`input`/`change` on the DOM node).
3. **Bounding-box coordinate click** (click the element's screen coordinates).
4. **JS set value + dispatch `input`/`change`** (for inputs the framework won't fill).
5. **Keyboard** entry.
6. **If truly undrivable, call the EXACT endpoint the button calls** — but **only after confirming the FE gate/dialog was reachable** — and disclose that you did so. **Never mark PASS on gate presence alone.**

**Known session quirks to expect and route around:**
- **`create-*` endpoints return HTTP 500 in some sessions:** `work-orders/create`, `work-orders/lines/create`, `customer-account/create-customer-payment`, `work-orders/approvals/create-approval-request`. Reuse existing records or create via the UI.
- **Existing-WO detail bounces to `/workorders`** on mount for all roles — create a fresh WO to land on detail.
- **`/parts/part-sales` route is flaky** (goto never reaches domcontentloaded; `page.evaluate` hangs) while admin/catalog/vendor routes load fine. Retry or hit `POST /api/part-sales` directly.
- Undrivable widgets seen: the Quasar rich-text editor, the inline parts grid, confirmation buttons, custom Customer/Asset dropdowns, virtualized report rows, calendar day/resource cells.
- **Enforcement reality:** the backend enforces only **resource-level View/Edit**. Granular perms (Delete, WO sub-perms, cross-toggles, view_mode) are **FE-only display gates** — expected-denial cases must be verified in the **UI** (endpoint often returns 400 validation, not 403); backend-enforcement cases hit the endpoint and check **403 vs 200/201**.

## FEES & DISCOUNTS (qb env, proven 2026-07-08)

### Env / navigation (qb.qa.shopview.com, API sv7387api.qa.shopview.com)
- **In-SPA navigation that works:** land on any working page, then `page.evaluate(() => { history.pushState({}, '', '/customers/{id}/default-adjustments'); dispatchEvent(new PopStateEvent('popstate')); })` — vue-router follows popstate. Customer detail route is **`/customers/{id}`** (NOT `/customers/view/{id}`); tabs append `/work-orders`, `/default-adjustments`, etc. `/workorders/{id}/lines` deep-links fine on qb (no bounce).
- **A 0-line WO auto-opens the persistent New Line dialog** — close it via its `i:text("close")` X icon (Escape does NOT close Quasar persistent dialogs; click Cancel/X) before touching tabs; or JS-click the tab: `document.querySelector('[data-test-id=link_finance_tab]').click()`.
- Admin templates page: Administration → **FINANCE → Fees & Discounts** → `/administration/adjustment-templates` (FE-gated `settingsFinance`). Customer defaults route FE-gated `customersCreateAndEdit`+`seeApArData`.

### Seed a testable WO end-to-end (proven)
1. `POST /api/customers/create {name}` → company_id (NOTE: API-created customers do NOT inherit auto-apply templates as defaults; UI-created do).
2. `POST /api/contacts/create {company_id, first_name}` → contact_id.
3. `POST /api/vehicles/create {company_id, customer_id:<contact_id>, unit}` (customer_id = CONTACT id).
4. WO via **UI** (raw `work-orders/create` 500s): customer page → Work Orders tab → wait `[data-test-id=button_new_work_order]` ENABLED (disabled while list loads / when customer has no asset) → asset q-select = 2nd `.q-select` in dialog → Save. Payload it sends: `{company_id, customer_id:<contact>, vehicle_id, type:'service', is_vehicle_here:true,…}`.
5. Labor line with KNOWN price: New Line → first `.q-select` → pick canned line **"(L) CVIP - Light Duty Truck - Wheels On"** (fixed **$265.00**) → Save & Close (`POST work-orders/{id}/lines/create-from-canned-line` 201). Shop supplies auto-adds 10.5% ($27.83 on $265).
6. Cleanup: `work-orders/delete {work_order_id}` → `vehicles/delete {vehicle_id, company_id}` → `contacts/delete {customer_id:<contactId>, company_id}` → `customers/delete {company_id}` (contacts+vehicles must go first: "Company with a customer cannot be deleted").

### Adjustments API (full contract, proven)
- Templates: `GET/POST /api/adjustment-templates`; `POST /api/adjustment-templates/{id}/change`; `DELETE .../{id}`; `GET .../{id}/delete-precondition` → `{affectedCustomerCount}`. Fields `{name,kind:fee|discount|processing_fee, calculationType:flat|pct_labor|pct_parts|pct_subtotal|pct_grand_total, defaultAmount, defaultMaxCap, autoApply, taxable, description}`.
- WO: `POST /api/work-orders/adjustments/add` `{workOrderId,kind,name,calculationType,amount,maxCap,scope:whole_wo|labor_line|part_line,targetId,taxable,templateId,description}`; `/change` accepts ONLY `{adjustmentId,name,amount,maxCap,taxable}` (kind/calc immutable); `/remove {adjustmentId}` → 204. Processing fee: manual add → 400 "cannot be added manually"; change → 409.
- Reads: whole-WO adjustments + `adjustmentsSummary{...,excessCreditAmount}` in `work-orders/view/{id}`; **line-level adjustments live under each line** in `work-orders/lines/{woId}` `collection[].adjustments` (NOT in the WO view).
- Customer defaults: `GET/POST /api/customers/{companyId}/default-adjustments` (POST `{templateIds:[…]}`, array OK). Mapping guard: `GET /api/bookkeeping/adjustment-item-mapping-status`.
- Line status enum for billability tests: `authorization_required | authorization_declined | authorized | complete` (`work-orders/lines/change-status {line_id,status,workOrderId}`); declined → adjustments resolve $0, authorize → restore.

### Quasar dialog driving (F&D dialogs)
- Selects: click `.q-dialog .q-select` by INDEX (labels wrap the whole dialog — never click `label:has-text()`); options in `.q-menu .q-item`. Inputs: `input.q-field__native` by index (name first, amount second); template `input[name=adjustment_template_name]` maxlength=100; WO dialog name `input[name=adjustment_name]`.
- Toasts: poll `.q-notification` innerTexts for ~3s.
- Line-row ⋮ menu: hover then **mouse-click ~50px right of `[data-test-id^=button_line_expand_]`** (the button has no test-id; retry loop — flaky), menu = Request part | Add line note | Add Fee/Discount | Save as canned line | Story history | Audit log | Add inspection | Edit labor. Card entries: `[data-test-id^=button_adjustment_actions_{adjustmentId}]` → Edit | Remove.
- Estimate document renders INLINE on the WO **Finance** tab (`link_finance_tab`) — full doc text incl. Adjustments block readable from body innerText.

### qb env cautions (working fixes)
- **Shared env with active concurrent users** — they toggled autoApply and deleted ZZAUTOTEST templates mid-run. Fix: re-read state via API before every assertion; keep test data self-contained; re-verify baselines right before use.
- Tech quick-login on qb is **FLAKY**: 403 in recon/pass B but **200 in the same-day pass A** (which used it to prove whole-WO adjustment add is FE-only enforced while templates admin is BE-403). Retest `{key:'tech'}` at the start of each run before assuming it's blocked.
- `New Work Order` button stays disabled until the customer has ≥1 asset AND the tab list finished loading — poll `isDisabled()`.

---

## Keeping this current

**Standing practice — record ONLY success-proven knowledge (append-only).** After
**every** run, append the approach that actually **WORKED** — the proven navigation
path, action recipe, API endpoint, payload field, and the **concrete unblock that led
to success** ("do X to succeed") — to **this file** (and update `CLAUDE.md` /
`build/TESTING-RUNBOOK.md` if a *durable fact* changed — an id, a rule, a scope, or a
spec change that got implemented). **Do NOT record failed attempts or dead-ends as
recipes.** A "gotcha" belongs here **only** when framed as the working fix (the thing
that unblocked success), never as a log of what didn't work. **Promote a `(verify)`
item to confirmed only after you have actually succeeded with it** — until then it
stays `(verify)`. The goal is that nothing proven is ever lost or re-researched: for
anything already captured here, **reuse the recipe**; only spend effort investigating
**genuinely new** actions, then record the working path. Keep everything
**non-secret** — endpoints, routes, and non-secret ids only; cookies/tokens/keys/ports
never go in the repo.

## CUSTOM ROLES — Phase 2b functional-flow recipes (staging, proven 2026-07-09)

- **Reach a WO detail in headless (bounce fix):** direct-mount `/workorders/{id}/lines` bounces/hangs.
  Land on `/workorders` (list), then in-SPA nav: `page.evaluate(()=>{history.pushState({},'',
  '/workorders/{id}/lines'); dispatchEvent(new PopStateEvent('popstate'))})` → detail loads (no bounce).
  Close the auto New-Line dialog via `.q-dialog i:text("close")`. Finance tab: `[data-test-id=link_finance_tab]`.
- **WO tax (Financial Info card):** `POST /api/work-orders/{id}/tax {id:<taxId>}` sets the WO tax
  (Total recalcs); `POST .../{id}/tax {}` (empty) = the X reset → reverts to default customer/location tax.
- **Taxes CRUD:** `GET /api/taxes` (collection; rates[]); `POST /api/taxes {name,isEnabledLabor,
  isEnabledParts,isEnabledShopSupplies,rates:[{name,percentage}]}` (201, multi-rate OK, sums rateTotal);
  update `POST /api/taxes/{id}` (same body); `DELETE /api/taxes/{id}` (204). **Toggling a tax's
  isEnabledParts / isEnabledShopSupplies directly controls parts / shop-supplies tax on the invoice**
  (proven on the estimate: parts on=$2.82/off=$0.00; shop-supplies on=GST$11.05/off=$10.00).
- **Estimate/invoice doc:** `POST /api/work-orders/invoices/estimate {work_order_id,type:'html',
  issue_date,due_date}` → HTML with tax breakdown. NOTE: it reflects the tax CONFIG + customer/location
  default; the per-WO `/tax` override shows in the Financial Info UI but the estimate used the default.
- **Split a WO:** `POST /api/work-orders/split {work_order_id, ids:[lineIds]}` → 201 `{data:{id:newWO}}`.
  Moves the picked lines to a new WO; history logs `work_order.split_to` (source) + `work_order.split_from`
  (new). WO history: `GET /api/work-orders/{id}/history` → `{data:[{eventType,eventName,...}]}`.
- **Part requests:** add `POST /api/work-orders/part/make-request {line,work_order,description,quantity,
  part_source_type:'inventory'|'vendor',part_number,sell_price,cost,part_category_id}` (201; category
  REQUIRED; categories `GET /api/inventory/categories` {value,label}). Edit `POST .../part/change-request
  {id, description|quantity|part_number|part_source_type}` (200; switching source vendor→inventory locks cost).
- **Edit a line / tech story:** `POST /api/work-orders/lines/change {line_id,work_order_id,tech_story,
  lineName,line_name,labour_type_id,total_labour_time,fixed_price}` (needs lineName). On an **invoiced WO
  the line has `editable=false`** (read-only). (This change endpoint 500s on some lines.)
- **Change customer on WO:** `POST /api/work-orders/change-customer {work_order_id,company_id,
  customer_id:<contactId>}` → the WO vehicle becomes associated with the new company (many-to-many; the
  vehicle must be unlinked `POST /api/vehicles/delete {vehicle_id,company_id}` before that company can be deleted).
- **Return validation:** `POST /api/work-orders/part/make-return-request {part_id,quantity,return_reason}`
  → negative/zero quantity rejected ("value should be >= 0.01").
- **PO item edit before receiving:** `POST /api/inventory/orders/change-item {order_id,item_id,
  part_number,quantity_ordered,price,category,description}` (200). Cost validation is FE-only (BE accepts negative).
- **Vendor CRUD:** `POST /api/parts-catalogue/add-vendor {name,email,tax_id,credit_term,credit_limit}`
  (201; tax_id + credit_term + credit_limit required); `POST .../remove-vendor {id}` (201). Vendor list caps
  at 100 — use `?search=` to find newly-added (Z-name) vendors.
- **Department clock (timesheet):** `POST /api/technician-tasks/department-clock-in {department_id}`
  → 201 `{technician_task_id}`; clock-out `POST .../department-clock-out {task_id,description}` → completes
  with no error (SV clock-out regression fixed). Departments: `GET /api/departments`.
- **IBS:** connect `POST /api/ibs/settings/credentials {clientId,clientSecret,baseUrl}` → isConfigured/
  isActive true (masked id); status `GET /api/ibs/settings`; disconnect `POST /api/ibs/settings/disconnect`.
  **IBS Multi-Tenancy (workplace IBS Location ID field + Remit-To card) requires a feature flag NOT enabled
  on staging** (org flag list: `GET /api/organization/feature-flags?organization_id={org}`).
- **Digital Inspections builder:** DigitalInspections flag ON. New Template makes **no API call on open**
  (deferred). Save Draft = `POST /api/inspection-templates` (create) + `PUT /api/inspection-templates/{id}/draft
  {name,description,isSignatureRequired,sections:[{id?,name,position,fields:[{type:'checkbox',label,position,
  isRequired,config:{labels:{na,fail,pass}}}]}]}`. Publish `POST .../{id}/publish` (blocks: "Template name is
  required" / "At least one section is required"). Delete only never-published (`DELETE`); published → `POST
  .../{id}/archive`. Reorder = re-PUT with new `position` values (persists). Editor reached via Settings sidebar
  → Inspection Templates → New Template (admin pages need sidebar nav, not direct URL).
- **Deposits (flag ON):** WO Finance → Add Deposit → "Create Deposit" modal (Deposit Date [defaults today],
  Payment Method [required], Deposit Amount, Reference Number, Memo; Submit Deposit / Cancel).
- **Issue Credit:** WO invoice ⋮ → Issue Credit → parts-only picker ("Parts to return"; labor not selectable;
  Outcome = Store Credit / Refund). **create-customer-payment 500s in some sessions** (blocks payment/credit submit).
- **Bin count link:** Settings → Bin Locations (`/administration/bins`) → click a row's Inventory-parts count
  → `/parts/inventory?binLocation={bin}` (filtered).
- **qb (SV-7387) env SLEEP/WAKE:** the env auto-sleeps (API + `/api/quick-login` 302 →
  `sleep.qa.shopview.com`). Wake it yourself: `POST https://fz4hhptxi8.execute-api.ca-central-1.amazonaws.com/default/toggleQaEnv`
  body `{"action":"wake","env":"sv7387"}` (lambda answers "sv7387 is waking up."), then poll the API ROOT `https://sv7387api.qa.shopview.com/`
  until 200 (~60s; it passes 503 while booting). Root `/` returning 200 `{"data":[]}` = awake.
- **qb "sustained 500 incident" ROOT CAUSE = poisoned shared PHPSESSID (batch-6 proven):** when every `/api/*`
  request 500s with a requestId but the API root is 200, the backend is fine — the SESSION is corrupt. Fix:
  re-run `POST /api/quick-login {key:'admin'}` **WITHOUT sending the old PHPSESSID** (keep sv_sso_session +
  cf_clearance) → 200 + fresh PHPSESSID → everything 200 again. Diagnostic ladder: no cookies → 401; sso+cf only
  → 409; poisoned PHPSESSID → 500 on everything. **Avoid `POST /api/iam/change-location`** (prime suspect
  trigger in batch-5 AND batch-6; admin default_workplace is already Lethbridge = the QB location).
- **Invoice a WO (qb):** WO must be status `complete` AND have ≥1 completed line. Walk statuses with
  `POST /api/work-orders/change-status {id:<woId>,status:'approved'|'in_progress'|'ready_for_review'|'complete'}`
  (key is `id`, NOT work_order_id), then `POST /api/invoices/create {work_order_id,issue_date,due_date}` → 201
  `{invoice_id,customer_account_id,remaining_balance,…}`; WO becomes `Invoiced`; QB export fires automatically
  (failures land in `GET /api/bookkeeping/unexported-items`; clear own junk with `POST …/unexported-items/{id}/mark-done`).
  Undo with `POST /api/invoices/reverse-invoice {invoice_id}`.
- **WO line creation is BROKEN on qb (2026-07-09/10):** `POST /api/work-orders/lines/create` AND
  `POST /api/work-orders/{id}/lines/create-from-canned-line` 500 on every WO/payload (labour_type/fixed_price
  variants too; `fixed_price:0` and valid payloads alike). Blocks building fresh invoiceable WOs — reuse existing
  complete WOs (e.g. S-15895/S-15894, 1 completed line each) with add→observe→restore deltas.
- **Over-discount floor observables (API):** `work_order.adjustmentsSummary.excessCreditAmount` carries the
  floored-off excess exactly (e.g. discount 1265 on sub 1214.81 → 50.19); `sub_total` floors to "0.00"; a
  NON-taxable over-discount leaves `tax.amountTotal` unchanged (customer still owes tax); a TAXABLE one zeroes it.
  The Add-dialog live preview shows the floor ("New work-order subtotal $0.00 / Tax is recalculated on save")
  but there is NO warn/confirm on save (FDBUG-15).
- **WO Add Fee/Discount dialog (UI automation):** toolbar `button:has(i:text("more_vert"))` → menu item
  "Add Fee/Discount". Dialog selects order: [0]=Apply From Template (readonly combobox — don't fill), [1]=Type
  (Fee/Discount), [2]=Calculation Type. Name = first `input:not([readonly]):not([type=number])`; Amount =
  `input[type=number]`. Submit label = "Add Fee"/"Add Discount".

## FEES & DISCOUNTS — fresh full-VIU pass learnings (qb env, proven 2026-07-10)

- **`POST /api/work-orders/create` now works via raw API on qb (201)** — the old "create-* 500" quirk
  cleared for WO create; **`lines/create` + `create-from-canned-line` still 500 on every payload**
  (a bare invalid payload 400s first at validation — a 400 does NOT mean the bug is fixed; test with
  a VALID `fixed_price` payload). Existing Complete WOs stay the fallback (add→observe→remove→restore).
- **Complete WOs are terminal:** `work-orders/delete` → 400 "Completed work order cannot be deleted"
  AND `change-status` → 400 "Complete work order cannot change its status again" — there is NO
  uncomplete path on qb. Never walk a throwaway WO to Complete; leave it in estimate so it stays deletable.
  Part requests are also locked ("Part requests can`t be modified on completed line") and a line with
  staged parts refuses status changes ("Can`t change status while there are staged parts").
- **`reverse-invoice` payload key is `{id:<invoiceId>}`** (`{invoice_id}` → 400 missing-parameter).
- **Read a WO's customer credit:** `invoices/create` response carries `customer_account_id`; then
  `GET /api/customer-account/list-unpaid-transaction?account_id={customer_account_id}` (param IS
  `account_id`) → `response.unpaid_transactions_count` + `groupByDueDateData.current`. An invoiced
  over-discount shows up as count+2 (invoice + credit) and the credit amount lands negative in
  `current` (proven: excess 117.24 → current −11.63→−119.73 with a 9.14 invoice).
- **QB mapping read/restore:** `GET /api/bookkeeping/integration` returns every settings option with
  its `selected` value (snapshot this BEFORE any settings write; Fee item = key `feeItemId`, Discount
  = `discountItemId`). Writes go `PUT /api/bookkeeping/settings {settings:{...}}` (flat body → 400
  "settings missing"). **Unmapping is NOT possible via API** — `{settings:{feeItemId:null}}` → 500 and
  the mapping stays untouched; the FD-QB-004..008 guard cycle needs a dev/QB-side unmap.
- **Estimate HTML full-text:** the shared `api()` helper truncates non-JSON bodies to 500 chars — for
  `POST /api/work-orders/invoices/estimate` use a direct `fetch` and read `res.text()` (strip tags for
  assertions). The doc's bottom block reads `Subtotal $X / GST (5%) $Y / Total $Z` and 2026-07-10
  matched the API view exactly (adjustments INCLUDED — FDBUG-1 not reproduced, 3rd clean pass).
- **WO shop supplies:** `POST /api/work-orders/change-shop-supplies-charge {work_order_id,
  shop_supplies_charge}` (201) — computes on LABOR, so a parts-only WO stays $0 (can't surface the
  Shop Supplies doc section there).
- **Contacts have NO list endpoint** (`GET /api/contacts*` 404s; the SPA contacts tab makes no list
  call) — `contacts/create` returns `{data:{contact_id}}`: **SAVE that id at creation** or the company
  becomes undeletable ("Company with a customer cannot be deleted").
- **Part sales:** `POST /api/part-sales {company_id}` → 200 `{data:[{id}]}` (ARRAY). Story-11 check
  2026-07-10: the part-sale page still has NO Fees & Discounts column; `adjustments/add` against a
  part-sale id → 400 needs-target (no part-sale adjustment surface). Delete route: `DELETE
  /api/part-sales/{id}` answered 404 yet the sale vanished from the list right after (verify).
- **Template builder (fresh 2026-07-10):** dialog title is now "New Fee / Discount" (matches spec);
  Type options still only Fee|Discount (Story 8 UI missing); 4 calc methods (no legacy % Labor+Parts).
- **Role drift on shared envs is real:** the qb Technician role gained `workOrdersCreateAndEdit` +
  `workOrdersDelete` between 2026-07-09 and -10 (8 perms vs the matrix's 6) — re-read
  `GET /api/auth/me/fe-permissions` at run start and re-derive any per-role matrix before reuse.
- **NEW FDBUG-16 (probe carefully):** `adjustments/add` with an EMPTY name now 201s at the API (was
  400); the UI dialog still blocks with an inline Name-required error — FE-only guard.

## PROVEN: UI-driven WO seeding for reference states (staging, 2026-07-15)
Confirmed end-to-end via boot2+Chromium bridge as Admin (create endpoints are NOT simple REST —
this is the working UI recipe):
1. **Create WO:** navigate `/workorders` → click **New** → in "New Work Order" dialog pick a Customer
   (q-select, first `.q-menu .q-item`) → pick an Asset → click **Save** → a **Confirmation** dialog
   ("customer over credit limit") appears → click **Create** (red). WO id then in URL `/workorders/<id>/lines`.
2. **Add an UNAPPROVED line + part requests:** click **New Line** → in "New Line" modal open the
   "What Are You Doing?" q-select (catalog lookup — NO free text; pick an existing service, e.g.
   "Replace - Brake pot" which carries 2 parts) → LEAVE **"Line Approved" UNCHECKED** → **Save & Close**.
   Result: WO has linesCount=1, statusRequested=2 (2 part-request rows) → **Approve/Decline** shows on
   the WO detail; the **Parts tab** shows editable **Vendor dropdown (Assign Vendor)**, **Part Number
   field (Fix Part #)**, **Core Charge column**. ("Save & Add Part" instead adds a specific part request.)
3. **Delete WO (cleanup):** WO Delete is UI-only (DELETE/POST API 404). On the WO detail open the top
   "⋮" menu → **Delete Work Order** → confirm. Verified removes the WO.
Still needs deeper seeding (build on the above): pick cored part P550848 onto a line (Core OK/Not-OK);
create a PO + delivery via `/parts` (Order Parts/Pick/Receive/Bulk Receive); an invoice in void state
(Invoicing reverse). Tag throwaway data ZZAUTOTEST; clean up after.
