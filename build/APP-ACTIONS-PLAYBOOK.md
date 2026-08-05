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
- **QA-BRANCH HOST NAMING — now proven on three data points (2026-08-04), so never re-derive it:**
  a per-epic QA branch is served at **`sv<epic-number>.qa.shopview.com`**, and its API host follows
  the **`sv<number>api.qa.shopview.com`** shape — **`api` glued on with NO dot**. The three points:
  `sv8582` → Report Suite epic **SV-8582** · `sv8785` → Filters epic **SV-8785** · `sv8685` →
  Schedule epic **SV-8685**. (Same shape as the older per-ticket envs `sv7301api…`, `sv7387api…`.)
  ⚠️ **Only the Report Suite pair is VERIFIED** (`sv8582api.qa.shopview.com` answered live
  2026-08-03). For **`sv8785api`** and **`sv8685api`** the API host is **INFERRED from the pattern
  and NOT YET VERIFIED** — those two branches have deliberately had **zero requests** made to them,
  because the QA lead reserved VIU permission on both until Report Suite is finished. So: given an
  epic number you can predict the hosts, but **state the API host as inferred until it answers.**
- **QA-BRANCH COOKIES — which cookie is shared and which is per-branch (observed 2026-08-04 across
  three branches; values are SECRETS, `/tmp` only, never in repo):** the **`sv_sso_session`** token
  and the **`cf_clearance`** token appear to be **SHARED across branches** (byte-identical for
  `sv8582`, `sv8785` and `sv8685` — single sign-on plus one Cloudflare clearance for the whole
  `.qa.shopview.com` domain), while **`PHPSESSID` is PER-BRANCH** (a different value for each).
  Practical consequence: **you still need a per-branch set**, one file per branch — the convention
  is `/tmp/<project>-viu/cookies.json` (`chmod 600`, dir `chmod 700`), same JSON shape for all, so
  the helper scripts work unchanged. **These cookies live roughly 24 hours** (or until a deployment,
  per §A), and **`/tmp` is ephemeral**, so on any resumed or newly-authorised VIU **ask the QA lead
  for a fresh set** rather than assuming a stored one is still good.
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
- **⚠️ `get_sections` NEEDS PAGING, AND IT FAILS SILENTLY IF YOU FORGET (proven live 2026-08-05,
  Filters).** This project now has **625 sections**. An unpaged `get_sections/1&suite_id=1` returns
  only the **first 250**, with no error and no warning — and because the Filters group is section
  **4110**, well past 250, an unpaged call finds **ZERO Filters sections and therefore zero cases**,
  which reads exactly like "the group is empty" rather than "you truncated the list". **Always page:**
  loop `&limit=250&offset=N` until a chunk comes back shorter than 250, then walk the `parent_id` tree
  down from the group id to collect the subtree. **Also note the URL form:** the query separator must
  be `&`, not `?` — `get_sections/1?suite_id=1` returns
  `HTTP 400 {"error":"Invalid characters in URI: [/api/v2/get_sections/1?suite_id]"}`. The same paging
  rule applies to `get_cases`, `get_tests` and `get_results_for_run`.
- **Corroboration of DECLARED NORMALISATION #2 below, from a second project (Filters, 2026-08-05):**
  retitling **C29624** made **5 of run 352's 429 historical result records** read back with a different
  `case_title`, and `case_title` was **the only field that differed across all 429** — status, comment,
  who, when, elapsed, defects and version were byte-identical. Two independent projects, same
  behaviour, so it is safe to rely on.
- **⚠️ DECLARED NORMALISATION #2 — `get_results_for_run` ECHOES THE CASE'S *CURRENT* TITLE (proven live
  2026-08-05, Report Suite).** Historical result records carry a **`case_title`** field that TestRail
  fills in **at read time from the case as it stands now**, not from the title the case had when the
  result was graded. **So retitling a case makes its old result records read back differently with NO
  run write whatsoever.** Proven: 3 of run 359's 532 result records differed pre-versus-post a
  `update_case` batch, the ONLY differing field across all 532 was `case_title`, the 3 belonged to
  exactly the 2 cases retitled, and `status_id` · `comment` · `created_on` · `created_by` · `elapsed`
  · `defects` · `version` · `test_id` · `id` were **byte-identical on all 532**. **CONSEQUENCE for
  Standing Rules 34/47/50: verify a run untouched on those fields and treat `case_title` as DERIVED —
  a raw whole-record compare will otherwise report a false "results changed" and stop a clean batch.**
- **⚠️ DECLARED NORMALISATION #2b — `case_refs` IS THE SAME KIND OF ECHO AS `case_title` (found 2026-08-05,
  Report Suite).** A result record also carries a **`case_refs`** field, filled in **at read time from the
  case's References as they stand now**. So **writing `refs` on a case makes its old result records read
  back differently with NO run write** — exactly as retitling does (#2). Both are DERIVED; neither is a
  graded field and neither can be written by us. **Verify a run untouched on the graded fields
  (`status_id` · `comment` · `defects` · `elapsed` · `version` · `assignedto_id` · `created_by` ·
  `created_on` · `test_id` · `case_id` · `id`) and treat `case_title` AND `case_refs` as echoes** — a raw
  whole-record compare will otherwise report a false "results changed" and stop a clean batch. Confirmed by
  reading a live run-359 result record whose `case_refs` reproduced its case's full Rule-20 reference
  string verbatim.
- **`/api/reporting/reports/{slug}/export` REQUIRES `variant` (proven live 2026-08-05, `sv8582`,
  `v3.5-16cf83f`).** `?format=pdf&range=this_year` alone returns **HTTP 400** `{"errors":[{"error":"Invalid
  export variant. Allowed values: summary, expanded."}]}`. The working shape is
  `?format=csv|pdf&range=<preset>&variant=summary|expanded[&locations=<id>[,<id>]]`. Accepted `range`
  values on that build: `this_year` `last_year` `this_quarter` `last_quarter` `this_month` `last_month`
  `this_week` `last_week` `today` `yesterday` (all 200); `custom` needs `start_date`+`end_date`;
  **`last_12_months` returns 400 "Selected date range is invalid."** `locations` is a **comma-separated**
  list (not `locations[]`), and an unknown id gives 400 `Invalid location id "…"`. Report slugs:
  `sales-by-customer` `sales-by-representative` `parts-velocity` `technician-utilization`
  `work-in-progress` `inventory-value`. Filenames come back on `content-disposition`, and each CSV opens
  with a UTF-8 BOM then `"Date Range: …"` and `"Locations: …"` metadata lines above the header row.
- **Known runs — do NOT write without permission:** Custom Roles run **312**, section **3527**;
  Simple Flow / F&D / Schedule / Report Suite run **325** (and R359 Reports). Section IDs per project
  in CLAUDE.md.
- **THE `refs` FIELD HAS A PER-ENTRY LIMIT OF 248 CHARS AND IS COMMA-DELIMITED (probed live
  2026-08-03, Report Suite verifier-fix pass).** TestRail treats `refs` as a COMMA-separated list of
  references: it **splits on `,`, TRIMS each entry, and re-joins with a bare `,`** (sent
  `"AAA, BBB,   CCC ,DDD"` → stored `"AAA,BBB,CCC,DDD"`). Any **single entry longer than 248
  characters rejects the WHOLE `update_case`** with **HTTP 400 `Field :refs does not match the
  required pattern.`** — 248 passes, 249 fails, and it is a *pattern* error not a length error, so
  it is easy to misdiagnose. **Total** length is unbounded (674 chars across 40 short entries → 200).
  **Consequences:** (a) **write Rule-20 `refs` COMMA-FREE and ≤ 248 chars, using semicolons as
  separators** — this is already the house style: all 475 Report Suite `refs` are comma-free single
  entries, longest 245, and one earlier author wrote `"the 10; 000-row cap"` to dodge the comma in
  10,000; (b) never put a comma inside a quoted list in `refs` (`"Today, Yesterday, …"` silently
  becomes many references) — describe the list instead; (c) **when verifying a `refs` write, compare
  under the normalisation** `','.join(p.strip() for p in s.split(','))`, or a byte compare will
  report a false mismatch. Probe + validator: `build/report-suite/verifier-fixes-2026-08-03/tools/`
  (`refs_final.json` asserts comma-free + ≤ 248 before every run).
  **⚠️ THIS IS THE ONE DECLARED NORMALISATION PERMITTED BY STANDING RULE 50** ("verify exhaustively —
  byte-level means nothing is skipped, sampled, or assumed": **every case, every field, no sampling**,
  and then **exact** byte comparison). It may be applied **only because it is recorded HERE with
  its evidence**, and it must be **asserted explicitly as the expected transformation** in the audit
  log — never treated as "close enough". Every OTHER field is compared **raw byte-for-byte**, and any
  **NEWLY discovered normalisation must be added to this section, with its evidence, BEFORE it may be
  relied on** to explain away a mismatch. Until it is recorded here, **a mismatch means the write
  FAILED** — stop the batch and report both byte sequences (Rule 50).
- **TestRail swallows angle-bracket `<placeholders>` as HTML — never use `<` `>` in case text; write
  plain words instead** (e.g. "Expand, then the technician's name" — not an angle-bracket
  placeholder). Confirmed live 2026-07-29: TU-DAY-01/C30418's expected result imported 2026-07-22 as
  "Expand 's daily breakdown" — the placeholder was eaten as an HTML tag. Sweep any import/push
  payload for `<` before sending.
- **WHO CREATED / LAST UPDATED A CASE (how to spot FOREIGN cases — not ours)** *(proven 2026-07-31;
  this is how Vladimir Tomovic's 5 Report Suite cases C38919–C38923 were identified)*
  - **In the UI:** case page → **bottom-left "People & Dates" panel** → **Created** (name + date) and
    **Updated** (name + date).
  - **Via the API:** `get_case/{id}` returns **`created_by` / `updated_by` as USER IDS** (+
    `created_on` / `updated_on` epoch). `get_cases` returns them in bulk too, so one paged pull covers
    a whole suite. Resolve ids with **`get_user/{id}`** — **`get_users` is ADMIN-ONLY** for our Lead
    account (`Access Denied. You are not a TestRail administrator. Field:project_id is a required
    field.`, and adding `&project_id=1` does NOT fix it). Our own id: `get_user_by_email&email=…`.
  - **User map (project 1):** 1 Vladimir Tomovic · 2 Nebojsa Glavinic · **3 Bilal Muzamil = US (the
    account we push with)** · 4 Viktoria Videnovic · 5 Ayesha Khan · 6 Mudassir Qamar · 7 Ahtasham
    Amjad · 8 Chris Amani · 9 Sasha Grossman. Ids 10+ do not exist.
  - **Practical tells beyond `created_by`** (measured over 474 of our Report Suite cases vs his 5):
    **`refs` empty** (ours: 474/474 populated — Rule 20 means we never ship a case without one) ·
    **`template_id` 2 = Steps** (ours: 1 = Text, 474/474) · **`custom_automation_type` unset** (ours:
    always 0) · **`type_id` 7 "Other"** (ours: 6/5/1/2) · **titles over 80 chars** (ours: 0/474 —
    the ≤80 title rule) · **no expected results at all** (automated cases keep the assertion in code).
    **⚠️ `custom_atmstatus` is NOT a usable tell** — it is 3 ("Automated") on his cases AND on 16 of
    ours. Field decode from `get_case_fields`: atmstatus `1 Not Automated · 2 Cannot be automated ·
    3 Automated · 4 Pending`; automation_type `0 None · 1 Ranorex`.
  - **The reusable READ-ONLY checker:** `build/testrail-foreign-cases-2026-07-31/foreign_overlap_check.py`
    — pulls every live case under a group, splits ours vs foreign by `created_by`, and ranks the
    best-matching OF-OURS cases per foreign case on **normalised assertion text** (title + preconds +
    steps + expected, not the title alone), printing the tells + a verdict-ready table.
    `source /tmp/tr-creds.env && python3 foreign_overlap_check.py --group 4281` (Report Suite; Filters
    **4110**, Schedule **4254**; `--top N --min-score X --csv out.csv --refresh`). Similarity only
    **suggests candidates — a human confirms** DUPLICATE / AUTOMATED EQUIVALENT / NEW COVERAGE (the
    true duplicate found on 2026-07-31 scored just 0.264, because his cases carry no expected results
    to match on; trust the RANK, not the value, and read the top handful).
  - **STANDING EXPECTATION — re-check after every authorized push.** As the last step of any push
    manifest/execution log (right next to the Rule-34 run-sync), re-run the checker on the group to
    (1) catch **new foreign cases** and (2) catch **new overlaps** between someone else's cases and
    ours, so drift is found the same day instead of at audit time. Always report **"ours N / live
    total M"**. **Never edit/delete/move a foreign case or add one to a run** — identify it, exclude
    it from our counts, raise it with the author (see CLAUDE.md standing convention).
  - **⚠️ THE OVERLAP CHECKER ONLY FINDS HALF THE PROBLEM — ALWAYS RUN THE REVERSE ONE TOO
    (Standing Rule 45a).** `foreign_overlap_check.py` answers *"do THEIR cases duplicate OURS?"*.
    It **cannot** find the shape that actually cost us on 2026-07-31: an assertion of theirs with
    **NO counterpart in ours**. **Their case existing where ours does not is a COVERAGE SIGNAL, not
    a nuisance.** The reverse checker is
    **`build/gap-rootcause-2026-07-31/reverse_coverage_diff.py`** (READ-ONLY, `get_*` only, no POST
    code path):
    ```
    source /tmp/tr-creds.env
    python3 build/gap-rootcause-2026-07-31/reverse_coverage_diff.py \
      --group 4281 --group 4110 --group 4254 --scope-to-section \
      --md OUT.md --csv OUT.csv --json OUT.json
    ```
    Flags: `--scope-to-section` (compare only against OUR cases in the same report/area folder —
    **use it**, it cuts most cross-report noise) · `--sig-size N` (signature tokens, default 3) ·
    `--ours-uid 3` · `--cache-dir /tmp/trrcd` · `--refresh`. Groups: Report Suite **4281**, Filters
    **4110**, Schedule **4254**.
    **How to read the output — the useful block first.** It splits each foreign case into
    **assertion units** (a single foreign case routinely mixes one assertion we cover with one we do
    not) and labels each **COVERED-BY / CANDIDATE GAP / CONTRADICTS-OURS**, naming the **missing
    token**. Two things make it readable rather than noisy:
    - **`STRENGTH`** — **STRONG** = the missing word IS in our own vocabulary, it just never
      co-occurs with the rest (a meaningful absence); **PHRASING** = a word we never use anywhere
      (*"refetch"*, *"widened"*) = their wording, not our gap. **Only STRONG units set the
      case-level verdict.**
    - **`CLOSED-LIST COLLISIONS`** — **read this block first.** It finds OUR cases that enumerate a
      closed list (*"exactly"*, *"in order"*, *"only these"* — the Rule 42 time-bomb shape) on the
      same subject as a foreign case, and names the term their case asserts that our closed list
      never mentions. **This is the detector for the actual 2026-07-31 defect:** for **C38923** it
      narrowed **474 of our cases to 8** with the two real defects — **SBR-EXP-10 = C30285** and
      **SBR-EXP-11 = C30286** — ranked **3rd and 4th**.
    **Honest limits (say them when quoting it):** lexical, not semantic — a gap phrased in words we
    use elsewhere can read as COVERED-BY, and a synonym can read as a gap; the per-unit verdicts on
    step-only automated cases carry real false-alarm noise from setup prose (**that is why the
    collision block and the STRONG filter exist**); it compares written text on both sides and
    **proves nothing about the running build** (Rule 12). It **suggests — a human rules.** A
    CANDIDATE GAP goes to the QA lead; **never author or push from it unasked** (Rule 6), and
    **never touch the foreign case** (Rule 38).
    **Live baseline 2026-07-30T20:20Z** (read-only, zero writes): Report Suite **4281** = live 479 =
    ours 474 + **foreign 5, all Vladimir Tomovic (user id 1; we are id 3)**; Filters **4110** = 110 =
    ours 110 + **0 foreign**; Schedule **4254** = 165 = ours 165 + **0 foreign**. Output kept at
    `build/gap-rootcause-2026-07-31/REVERSE-DIFF-2026-07-31.md`.

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
- **⚠️ TestRail `refs` (References) field — TWO hard gotchas, both cost a failed push:**
  **(1) MAX LENGTH 250 CHARACTERS.** Over it, `add_case`/`update_case` returns **HTTP 400
  `{"error":"Field :refs does not match the required pattern."}`** — a misleading message that
  looks like a charset problem but is purely length. Keep refs **≤240 chars** for margin; when a
  Rule-20 ref won't fit, trim it and move the overflow detail into the case's internal `notes`
  (never drop the ticket half or the spec anchor). **(2) TestRail NORMALIZES `refs` as a
  comma-separated reference list and STRIPS THE SPACE AFTER EVERY COMMA** — so a re-GET
  verification of a refs string containing `", "` will FALSELY MISMATCH (content identical,
  spacing only). **Write refs COMMA-FREE**: use `;` and ` + ` as separators. Check both before a
  batch push — `assert len(refs) <= 240 and "," not in refs` — rather than discovering them
  mid-run. Also: **`update_case` does NOT move a case between sections** — use
  `POST move_cases_to_section/{section_id}` with `{"suite_id":1,"case_ids":[...]}` and verify with
  a re-GET of `section_id`. And **`tr.paged` helpers must join the 2nd query param with `&`, not
  `?`** (`get_tests/352?` → HTTP 400 *"Invalid characters in URI"*).
  *(both refs gotchas proven on the Filters push 2026-07-31: the comma one on the morning pass,
  the 250-char one mid-run on FLT-PARTS-13 at 298 chars)*
  **SHARPENED (Report Suite push 2026-07-30): the boundary is EXCLUSIVE — a refs string of
  EXACTLY 250 chars is REJECTED (SBR-NAV-01 / C30195, HTTP 400), while 243 chars pushes fine
  (IV-EXP-02 / C30588). So the real ceiling is ≤249; the "≤240 for margin" rule above is the one
  to assert on, and asserting `<= 250` is NOT safe.**

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

- **Creds:** a Figma **personal access token** goes at **`/tmp/figma-token`** (`chmod 600`; secret →
  `/tmp` only, NEVER committed; scripts must read the file, never inline the value). Verify with
  `GET https://api.figma.com/v1/files/<fileKey>?depth=1` → HTTP 200 + the file name. **`/tmp` is
  ephemeral — on a fresh container ASK THE USER for a token** (Figma → Settings → Security →
  Personal access tokens → scope *"File content read-only"*).
- **⭐ WHICH ACCESS ROUTE, and in what order (learned the hard way 2026-07-30/31, Filters — this
  ordering saves a day):** **ASK FOR A REST TOKEN FIRST when there is a BACKLOG of frames.** The
  **Figma MCP** `get_screenshot` needs no token and is cheap per call, but it has a **low per-seat
  tool-call cap** (*"You've reached the Figma MCP tool call limit for your View seat"* — no
  `retry-after`, so Rule 35's +9 h applies): it managed **6 boards then stopped**. **REST
  `/v1/images` with a token has no such cap** — it rendered the **remaining 6 in ONE call with no
  429** and finished an 85-board set that had been stuck for two days. So: **MCP is fine for one or
  two boards; a token is the only sane route for a backlog.** The two budgets are independent, so a
  capped MCP does not mean REST is capped, and vice versa.
- **⚠️ A LAYER TREE CANNOT ANSWER "IS THIS CONTROL PRESENT?" — ONLY A RENDER CAN.** This cost us two
  wrong "control X is absent" claims that we wrote into our own design notes as *corrections*: a
  toolbar sort icon and a `Status ↓` column indicator were both declared absent from a tree read and
  are plainly there in the PNG. **The reason:** an icon lives inside a component `INSTANCE` under a
  layer name containing no keyword you would search for. **Rule:** use the tree for *text* and
  *structure*; for any presence/absence question, render the board, crop the region and read it at
  2–3×. And when a render lands, **re-check every absence claim you made from the tree** — record the
  verdicts in a table (correct / wrong / indeterminate), and say plainly which ones the render could
  not settle (e.g. a heading row hidden behind an open panel).
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
- **⚠️ AND YOU MUST STILL GO BACK FOR THE MISSING FRAMES — Standing Rule 35 (mandatory, no
  authorization needed).** A rate limit is a DELAY, never an end state: "all the frames needed"
  means **100%**. When capped, create/update a **`PENDING-FIGMA-FETCH.md` queue file in that
  project's design folder** holding: an **OPEN** status header with the check-and-run instruction ·
  the file key · the exact **missing node ids + target filenames** · the **UTC error timestamp** ·
  **DUE-AT = error time + 9 HOURS** · the fresh `retry-after` for reference · the **exact resumable
  command** · and a **RETRY LOG** table (attempt #, timestamp, outcome, frames obtained, still
  missing, `retry-after`, next DUE-AT) wrapped in `<!-- RETRY-LOG-START -->` /
  `<!-- RETRY-LOG-END -->` markers so the fetcher appends its own rows and re-arms DUE-AT. Then
  **re-attempt at/after DUE-AT automatically without asking**; on another 429, append + re-arm
  (new error time + 9 h) and **repeat until every board has a PNG**. Check the queue at **every
  session start** and **before/after any work on that project or any design ingest**
  (`ls build/*/design-*/PENDING-FIGMA-FETCH.md`). **A design pass may NOT be called complete while
  a queue is OPEN** — state the shortfall ("73/85 PNGs; 12 pending, due-at <ts>") in the design
  notes AND the project's PROJECT-STATE.md. There is **no background timer** across sessions — the
  queue file + that mandatory check IS the mechanism. Live example (open):
  `build/filters/design-2026-07-31/PENDING-FIGMA-FETCH.md`.
- **Naming (Rule 19):** `<Section-Name>__<Board-Name>__<node-id-with-dash>.png` — board names repeat
  constantly ("Mobile" ×4, "Step 1" ×3), so the node id is mandatory to disambiguate.
- **Python gotcha:** do NOT name a helper script `enum.py` — it shadows stdlib `enum` and breaks
  `import json` with a circular-import error.
- **Helpers (copy these):** `build/filters/design-2026-07-31/tools/` — `enumerate_frames.py`
  (tree walk + dedupe), `texts.py` (visible-text per board), `render.py` (batch image request),
  `fetch_all.py` (**the resumable/idempotent fetcher — reads `frame-inventory.json`, skips boards
  already on disk, caches signed URLs in `imgurls.json`, runs from any cwd, and on a 429 prints +
  logs the error time / `retry-after` / DUE-AT into `PENDING-FIGMA-FETCH.md`; exit 0 = complete,
  2 = rate-limited & re-armed, 3 = short for another reason**). Canonical example output:
  `build/filters/design-2026-07-31/DESIGN-NOTES.md` (85-board inventory + design-vs-cases flags)
  and `build/filters/design-2026-07-31/PENDING-FIGMA-FETCH.md` (the Rule-35 retry queue).

## Jira/Confluence access
- **LOG IN TO JIRA / FILE OR READ A TICKET — the whole recipe is `build/ATLASSIAN-JIRA-ACCESS-METHOD.md`
  (§0a "THE FAST PATH" is copy-pasteable) with runnable scripts at `build/atlassian-login/`
  (`bridge.mjs` · `login.mjs` · `jira.sh`). Do NOT re-derive it.**
- Live browser login (headless Chromium via a fresh MITM bridge → id.atlassian.com email+password →
  a **6-CHARACTER ALPHANUMERIC** email code (digits + uppercase letters) — **not** 6 digits, typed into
  **six separate boxes** `input[data-testid^="otp-input-index-"]`) is the PRIMARY way to reach
  `shopview.atlassian.net`. **Check whether the Atlassian MCP even exists before planning around it**
  — there were zero MCP servers on 2026-08-04; REST v3 with the session cookie is the reliable path.
  Creds/cookies/codes in `/tmp` only, and `/tmp` is wiped by a container reset.
- **Writes with cookie auth need `Origin` + `Referer` on `shopview.atlassian.net` or every POST/PUT
  is `403 XSRF check failed`**; `/rest/api/3/search` is **410** → use `/rest/api/3/search/jql`
  (pages by `nextPageToken`). Full gotcha table: that doc's §5a.
- **Posting evidence (attachments + inline images + comment edit):** see §K "Jira evidence method".
- **FILING A DEFECT TICKET — the organisation's REQUIRED format: see the section of that name below.**

## Filing a defect ticket — the organisation's required format (ALL projects, ALL future tickets)

**Standing instruction from the QA lead, 2026-08-04. Every defect ticket we file, on every project,
uses these SEVEN sections IN THIS ORDER.** Do not re-derive this (Rule 27). Canonical worked examples:
`build/report-suite/defect-pack-2026-08-04/TICKET-1…6*.md` (filed as SV-8818…SV-8823).

| # | Section | What goes in it |
|---|---|---|
| 1 | **Description** | Simple, layman-understandable. Plain words, **no jargon, no codes, no endpoints**. What is wrong, so anyone in the business understands it — plus why it matters. |
| 2 | **Branch / Environment** | **Stated explicitly, never assumed:** the branch/URL tested (e.g. `https://sv8582.qa.shopview.com`), the API host, the **build marker** (`<meta name="app-version">`, e.g. `v3.4.1-0ed4433`), the org/location ids, and the **date/time observed**. |
| 3 | **Steps to reproduce** | **REAL numbered steps a layman can follow**, using the **exact on-screen labels** (Rule 9). **If data is needed, include the steps that CREATE it.** **NAME THE EXACT TEST DATA — see the hard requirement below; a step that does not name it is non-compliant.** **NO API calls in this section**, and no "requires a large dataset" hand-waving — a person clicking the product must get end to end. If the fault genuinely cannot be reached from any screen, **say exactly that** and point at section 7. |
| 4 | **Expected behaviour** | What should happen, in plain words. Quote the governing requirement if there is one (Rule 25). |
| 5 | **Current behaviour** | What actually happens, in plain words. |
| 6 | **Images** | Attach them **AND embed them inline so they RENDER in the description** — not merely a file list. If no image exists, **say so and say why** (never imply one). |
| 7 | **Technical details for developers** | **LAST.** ALL the codes, endpoints, request/response bodies, request ids, timings, row counts, spec references, extracted file text, repo evidence paths. Everything technical lives here **and nowhere above**. |

### TWO THINGS THAT MUST NEVER APPEAR IN A TICKET

1. **No reference to our test cases** — no "QA test cases affected" section, no internal case IDs
   (`SBR-EXP-10`), no C-ids, no TestRail links. Keep that mapping in OUR records (e.g.
   `build/report-suite/defect-pack-2026-08-04/CASE-IMPACT.md`).
2. **No "this QA branch is not final / this finding is provisional / close it if already fixed"
   disclaimer.** **The QA lead's reasoning, recorded:** *every QA branch is always non-final — they keep
   changing it — so saying so adds nothing, and it is OUR job to keep the test cases accurate, not the
   developer's job to caveat our findings.* **A defect hedged as provisional invites dismissal.**

> ⚠️ **DO NOT OVER-APPLY #2.** This drops the **Jira-facing text only.** The **Standing Rule 49 re-check
> obligation still stands INTERNALLY** — the `RECHECK-QUEUE.md` files stay exactly as they are, and a
> finding taken from a non-final build is still re-checked when the build moves. A future pass must not
> read "no provisional disclaimer" as "no re-check duty".

### HARD REQUIREMENT ON SECTION 3 — NAME THE EXACT TEST DATA (QA lead, 2026-08-04)

**His words, verbatim:** *"This is not reproducible with the canned line I used, either you used a
different canned line (You should always name the canned line you used) unblock yourself by using
different canned lines."*

**THE RULE: a reproduction that does not name the data it used is NOT A REPRODUCTION.** Steps to
reproduce must name **every piece of data the behaviour could depend on, by its exact on-screen
name** — because the reader will pick a *different* one, get a *different* result, and close the
ticket. That is exactly what happened to SV-8821.

**NAME ALL OF THESE (every one that the flow touches; write "any" ONLY where you have PROVEN it does
not matter, and say how you proved it):**

| What | How to name it |
|---|---|
| **the canned line / pre-set job** | its exact name, e.g. *HD CVIP air brake trailer single/tandem* — and its price shape (fixed labour · fixed line total · hourly rate), because the catalogue mixes all three |
| **the customer** | the exact company name, e.g. *Aaborough Works* |
| **the contact person** | the exact name — **and whether one is set at all**, which is itself a behaviour-changing state |
| **the part** | part number **and** whether it is cored / special-order / in stock |
| **the asset** | year + make + model **and** VIN/serial, e.g. *2020 Ford Transit, VIN 86J8FAC1VALJ43SJY* |
| **the work-order state** | Estimate · Approved · Complete · **Invoiced** · Paid — these behave differently |
| **the location / workplace** | e.g. *Staging Heavy Duty - 9919* — writes are workplace-scoped |
| **the role / user** | who you were signed in as, e.g. `admin@shopview.com` (Administrator) |
| **the date range** | the exact from/to used, and the report's own date basis |
| **money** | the resulting totals, so the reader can confirm they built the same thing |

**COMPLIANCE TEST — apply it to your own text before filing:**
- ❌ *"Create a work order with a canned line."* — non-compliant.
- ✅ *"Create a work order and add canned line **HD CVIP air brake trailer single/tandem** (fixed
  labour, $350.00). The total should read **$406.09**."* — compliant.

**AND STATE WHAT YOU RULED OUT.** If several values were tried, list them and their results — a
short table of *"these behave the same"* saves the reader the work you already did, and it is the
proof that the variable is not the cause. If a value could **not** be tried, say which and why.

**RATIONALE — this is exactly how SV-8821 was lost.** Its steps said *"choosing a pre-set (canned)
job so it carries a price"*, naming none. The seeding script behind the evidence had silently
filtered the catalogue to `c.fixed_price && workplace === HD` — **11 of the 79 canned lines** — so the
report rested on a narrow slice nobody could see. The QA lead used a different one, saw it work, and
closed the ticket. **Re-testing then showed the canned line was never the variable at all: the real
condition was that the work order had no CONTACT person, which disables the Finance tab entirely
("Please select a contact for the asset") and makes the failure unreachable from any screen.** Naming
the data in the first place would have surfaced that in the first hour. Full evidence:
`build/report-suite/defect-pack-2026-08-04/repro-sv8821/` and the corrected SV-8821 description.

### INLINE IMAGES — the mechanism that actually works (proven 2026-08-04)

A hand-built ADF `media` node **fails**: `PUT /rest/api/3/issue/{key}` returns **400
`ATTACHMENT_VALIDATION_ERROR`** because the media `id` must be a **media-services UUID**, not the
attachment id. The working route is **wiki markup through API v2**, which makes Jira resolve the
filename server-side:

1. `POST /rest/api/3/issue/{KEY}/attachments` (multipart `-F file=@…`, header
   **`X-Atlassian-Token: no-check`**) → note the returned `id` and **check `size` against the source file**.
2. `PUT /rest/api/2/issue/{KEY}` with `description` as a **wiki-markup STRING** containing
   **`!the-file-name.png|width=900!`** → HTTP 204.
3. **VERIFY it truly renders inline, do not assume:** `GET /rest/api/3/issue/{KEY}?fields=description&expand=renderedFields`
   → the stored ADF must contain a **`mediaSingle` › `media`** node whose `attrs.id` is a **36-char UUID**,
   **and** `renderedFields.description` must contain a real
   **`<img src=".../rest/api/3/attachment/content/<attachmentId>">`**. An attachment with no media node
   is *attached but not inline* — that fails this format.

Wiki-markup quick reference: `h2. Heading` · `*bold*` · `_italic_` · `{{monospace}}` ·
`{noformat}…{noformat}` (code blocks) · `{quote}…{quote}` · `* bullet` · `# numbered` · `----` (rule) ·
`||header||header||` then `|cell|cell|` (tables) · `!image.png|width=900!`.
Reusable converter: `/tmp`-side `md2wiki.py` pattern documented in
`build/ATLASSIAN-JIRA-ACCESS-METHOD.md` §5a; give descriptions to v2 as wiki markup, **not** ADF, when
they contain images.

### THREE HARD GATES BEFORE AND WHILE FILING (QA lead, 2026-08-04 — Standing Rules 51 / 52 / 53)

**These three came in AFTER the six tickets below were filed, and each one corrected something that
pass got wrong. Read them before you file anything.**

**1. API-RELATED TICKETS ARE NEVER FILED WITHOUT ASKING — EVERY TIME (Rule 51).**
His words: *"do not create the tickets which are related to API , if there are any ASK me (ask again if
I have previously given a go ahead for the API tickets with the Non API tickets) and create them ONLY
if I ask you to create them"*. **A BATCH APPROVAL DOES NOT COVER THE API ITEM INSIDE IT** — ask again,
naming it, even if he already approved the batch.
**The reachability test:** if the defect is **invisible to a user and to a manual tester — reachable
only by calling an endpoint directly with a request the product's own screens never send — it is
API-RELATED.** If **the same failure also happens through the product's own screens**, it is a
**user-facing** defect that merely happens to be characterised technically (a 500 in the evidence does
**not** make it API-related).
**Method:** list API-related findings in **their own section of the defect pack BEFORE filing** (canonical
vehicle: a dated `API-SPLIT.md` beside the pack, e.g.
`build/report-suite/defect-pack-2026-08-04/API-SPLIT.md`), ask separately in plain words, file only on a
yes. **Already filed one? Withdraw on his ruling — CLOSE it by workflow transition with a plain-language
comment, set priority Low first, and NEVER DELETE** (deletion is irreversible; a withdrawn ticket with
its reasoning on the record is worth more). **Keep the finding in the pack — we withdraw the ticket, not
the finding.** Read alongside **Rule 24**: FE-blocks + BE-allows is a **PASS**, not a defect at all.

**2. PARENT = THE EPIC; THE OWNING STORY IS *LINKED*, NOT PARENTED (Rule 52).**
His clarification, verbatim and operative: *"So Yes, attach the tickets to the Epic as Parent but when
you liunk th etickets to the stories they should be linked as their story defects. You did it correctly
before."*
**Do NOT reparent a defect onto a story, do NOT convert it to a `Story Defect` subtask, do NOT create
replacement issues or close the original as a duplicate to get a story parent.**
**Why this shape is CORRECT and not a workaround:** in project **SV**, **`Bug` (10008) is hierarchy
level 0** — same level as `Story` (10245) and `Task` (10005) — so **its parent may only be an `Epic`
(10006, level 1)**. The only story-level child vehicle is **`Story Defect` (10007), a SUBTASK at level
−1**, and **Jira REFUSES the level-0 → subtask conversion** (both attempts proven 2026-08-04):
`PUT /rest/api/3/issue/{key}` with `issuetype:10007` + `parent` → **400
`{"pid":"Issues with this Issue Type must be created in the same project as the parent."}`** (misleading
— the parent *was* in the same project); `issuetype` alone → **400 `{"issuetype":"Issue type is a
sub-task but parent issue key or id not specified."}`**. An unwinnable pair.
**The LINK TYPE is his to name — never guess.** Available in this Jira (`GET /rest/api/3/issueLinkType`,
read live 2026-08-04): **Blocks** · **Cause** (`caused by`/`causes`) · **Cloners** · **Duplicate** ·
**Fixes** · **Polaris work item link** · **Relates** · **Split**. **None is a defect-of / is-defect-for
type**, so if a "story defect link" is asked for, **change nothing and ask which of the eight he means.**

**3. PRIORITY IS ALWAYS `Low` — NEVER `High` (Rule 53).**
His words: *"never mark the priority as High for the tickets you create always keep the priority as
LOW"*. Priority is **his to raise, not ours to assert**. Severity belongs in the ticket's words and in
the `Severity` field, **never** in `Priority`.
**⚠️ AND NEVER "RESTORE" A FIELD HE HAS CHANGED.** He works in the Jira UI **under this same account**,
so **his edits are indistinguishable from ours in the changelog** — the author column reads our own
name. A change with no action of ours is **his triage**, to be **asked about, never reversed**. Tells: a
**selective, semantically coherent** change (only the `High` ones moved) or a **transition that sets a
resolution**. On 2026-08-04 a pass read his four `High → Low` downgrades as drift and "restored" them;
he re-applied `Low`, and the changelog now carries **`High → Low → High → Low`** on all four.

### Fields to set on a ShopView `SV` bug (from `createmeta`, 2026-08-04)

`project` · `issuetype` (**`Bug`**) · `summary` · `description` · `labels` · **`priority` — ALWAYS
`Low`** (Rule 53; the field offers Highest/High/Medium/Low, we use `Low`) · `customfield_10418`
**Severity** (High/Medium/Low — put the real severity HERE) · **`customfield_10153` "Product Area" —
REQUIRED** (Reports & Dashboards · Work Orders · Customers · …).
**Parent:** the **Epic** (see gate 2 above) — a `Bug` is hierarchy level 0 so an Epic is the only parent
it can take. **Attach the owning story as a LINK** (`POST /rest/api/3/issueLink`), not a parent.
**Withdrawing a ticket:** read `GET /rest/api/3/issue/{KEY}/transitions` and use the closest close
transition — on `SV` that is **`Close` (id 8) → status `OBSOLETE`**, whose post-function sets
**`resolution: Done`** with no resolution screen. Comment first (v2 `POST /rest/api/2/issue/{KEY}/comment`
takes a plain string), then transition, then read back status + resolution + priority + comment.

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

## N. REPORT SUITE QA BRANCH sv8582 — reporting API + report-UI recipes (proven 2026-08-03)
First live Report Suite environment. Everything below was observed working; reuse it, do not
re-discover (Rule 27). Secrets stay in `/tmp` — helpers read them at runtime.

### Env + auth
- App `https://sv8582.qa.shopview.com` · API **`https://sv8582api.qa.shopview.com`** (no dot before
  "api", same convention as `sv7301api`). Org = the shared **`d55bc308-e61a-438d-b5f1-c7a73c89d49f`**.
- `POST /api/quick-login {"key":"admin"}` → **200** + a fresh `PHPSESSID`; cookies
  (`sv_sso_session` 64-hex, `PHPSESSID` 32-hex, `cf_clearance`) on `.qa.shopview.com`, `Max-Age=86400`.
- **Run node with `NODE_USE_ENV_PROXY=1`** or plain `fetch` bypasses the egress proxy.
- Helpers: `build/report-suite/viu-2026-08-03/tools/qa8582.mjs` (`login()`/`api()`) and
  `boot8582.mjs` (`boot()` = the boot2 hydration pattern retargeted; also logs every `/api` call the
  SPA makes, which is how these endpoints were found).
- **Build marker:** `curl -s https://sv8582.qa.shopview.com/ | grep app-version` →
  `<meta name="app-version" content="v3.4.1-0ed4433">`. Use it for Rule-49 re-check queues.

### Report routes (all six, live)
`/reports` **redirects to** `/reports/punch-clock-activities` — there is no neutral reports index.
`/reports/sales-by-customer` · `/reports/sales-by-representative` · `/reports/parts-velocity` ·
`/reports/technician-utilization` · `/reports/work-in-progress` · `/reports/inventory-value`.
Nav group headings: LABOR · PERFORMANCE (WIP, TU, SBR) · PARTS (PV, IV) · **SALES (SBC)** ·
FINANCE · ACCOUNTS RECEIVABLE · ACCOUNTS PAYABLE · ACCOUNTING · COMMUNICATIONS.

### Report DATA endpoints
`GET /api/reporting/reports/<slug>?<filters>&pagination[page]=&pagination[rowsPerPage]=&pagination[sortBy]=&pagination[descending]=`
- SBC/SBR/PV/IV are **paginated**; **TU and WIP are NOT**.
- Date scope: most take `range=custom&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`;
  **WIP takes `from`/`to` as ISO datetimes** (`from=2026-01-01T00:00:00.000Z&to=…`). A span beyond the
  server limit returns **400**.
- Multi-location scope: `&locations=<uuid>,<uuid>` (comma-separated, URL-encoded).
- Extra per report: SBC `productType=all`; SBR `productType`+`invoiceStatus=all`; PV `type=both`.
- Payload: `{data:{collection:[…], pagination:{…}, totals:{…}}}` — **PV returns NO `totals`**;
  IV also returns `as_of_date`.

### Report EXPORT endpoints (this is the part worth never re-deriving)
`GET /api/reporting/reports/<slug>/export?format=csv|pdf&<the same filters>` plus:
- `&variant=summary|expanded` — **required** for SBC, SBR, TU (else `400 "Invalid export variant.
  Allowed values: summary, expanded."`).
- `&tab=ApprovedNotStarted|ApprovedPartiallyCompleted|Completed|Estimates` — **required for WIP**
  (else `400 "Invalid tab \"\"."`).
- `&columns=<comma-separated keys>` — **required for WIP** (else `400 "At least one column is
  required."`); optional elsewhere, and **omitting it exports every column**.
  **Valid WIP keys:** `wo_number, status, customer, asset, vin, location, advisor, days_open,
  last_activity, labor_earned, labor_remaining, parts_earned, parts_remaining, earned, remaining,
  total`. **`invoiced_hours` is NOT accepted** even though the UI offers an Inv. Hrs column.
- Bad `format` → `400 "Invalid export format. Allowed values: csv, pdf."`
- **Over-size guard:** `400 "This report is too large to export. Narrow the date range or filters,
  then try again."` — narrow with `&search=<term>` or a single location to get a file.
- CSV shape: line 1 `"Locations: <name>"` (or `"Locations: All locations"`); IV puts
  `"As of: YYYY-MM-DD"` **above** it. Then the header row, the data rows, and a final `Totals,…` row.
- **The per-row `Location` column appears only when scope spans >1 location**, in the screen's slot —
  except TU, which puts it FIRST in the export and second on screen.
- **WIP export headers rename two columns:** screen `Asset`/`Location` → file **`Unit`/`Branch`**.

### Report UI recipes (Quasar)
- The **export menu** is the `more_horiz` icon button (`aria-label="Export report"`); the **column
  selector** is the `width_normal` icon button next to it (tooltip + aria `Column Selection`).
- The **date-range control** is **`span.date-range-label`** (NOT a `.q-btn` — a `.q-btn` text search
  fails). Click it by coordinate; the popup holds an inline calendar plus presets
  **Last 12 Months · This Year · Last Year · This Quarter · Last Quarter · This Month · Last Month ·
  This Week · Last Week**, a `Range: N days` readout and an **Apply** button. There is **no "Custom"
  or "Today"/"Yesterday"** preset.
- Filter dropdowns are `.q-select` in toolbar order; the **Location** filter is always last and offers
  `All locations` + `Clear all` + one row per accessible workplace.
- **The report grids are VIRTUALISED** — `tbody tr` returns a spacer, so per-cell reads fail. The
  `thead` and the `Totals` row read fine. To read data cells, scroll-and-read or use the data API.
- **Empty export:** the FE short-circuits and shows a toast `Empty export` /
  `Export didn't yield any results` / `Close`, and calls no endpoint.

### Report permission testing (the ONE-permission model, proven both ways)
- The **entire** FE-permission catalogue (`GET /api/fe-permissions`) holds exactly **one** report
  atom: **`reportsPageAccess`**. No per-report atom exists.
- Roles holding it on this org: Admin, Service Manager, Office User, **Sales Representative** (only 8
  atoms — the ideal minimal positive subject), Parts Manager. Without it: Parts Technician, Senior
  Service Advisor, Time Clock User, Technician, Service Advisor, **Foreman** (good negative subject).
- **Impersonate:** `POST /api/switch-user {user_id}` where `user_id` is the staff record's **`id`**
  (not `staff_id`). **`GET /api/staff?limit=300` returns `role_label`, `role_id`, `staff_id`, `id`,
  `is_active`.** **switch-user 403s on inactive users** — filter `is_active === true` **and**
  `confirmed_invitation_on`. Confirm who you are with `GET /api/auth/me/fe-permissions` →
  `template_slug`; `administrator` means the switch did not take.
- **Seed a minimal-permission subject** (Rule 14): `POST /api/staff/{staff_id}/change
  {first_name,last_name,email,role_id,workplace_id,job_title,salary_type,salary,billable,clockable}`
  → **201**. Note `POST /api/organizations/{org}/roles` is **GET-only (405)** on this build, so
  **reassign an existing minimal role instead of creating one**. Always restore and verify.
- **Seed a single-location user** (for the Location-filter question): assign one `workplace_id`; then
  `GET /api/staff/my-workplaces` as them returns exactly one. **Caution:** re-hydrating the same
  browser profile keeps the previous user's persisted **column selection** in localStorage, which can
  fake a Location column — use a fresh profile, and note that `localStorage.clear()` alone breaks SPA
  hydration (the SPA needs the full `user` payload, not just `fe_permissions_wrapper`).

### §N addendum — WIP + Inventory Value recipes (proven 2026-08-04, build v3.4.1-0ed4433)
Everything here was observed working. Reuse it; do not re-derive it (Rule 27).

**READ A PDF EXPORT'S CONTENTS.** `pdftotext -layout <file>.pdf -` works — **poppler-utils 24.02.0 is
already installed** at `/usr/bin/pdftotext`. Use `-layout` so the column order survives. Page count:
`pdfinfo <file>.pdf | grep ^Pages`. (`import pypdf` fails on this container with a
`pyo3_runtime.PanicException` out of `cryptography`; `pdfplumber` is not installed. Do not waste time
on either — `pdftotext` is the route.)

**TOGGLE A COLUMN IN THE Column Selection PANEL (the recipe that actually works).** Click
`[data-testid="button_column_selection"]` by coordinate, then click the **`.q-toggle` INSIDE** the
`.q-item` whose exact `innerText` is the column name — clicking the `.q-item` centre does NOT toggle
it (that is why an earlier pass reported "no change"). Then `Escape` and **re-read `table thead th`**
to confirm: the rendered header row is the only reliable state, because the toggles' `aria-checked`
reads `false` on every item regardless of state. Working script:
`build/report-suite/viu-2026-08-03/batch-wip-iv/tools/probe_colselector.mjs <slug> <ColumnLabel>`.

**DATE-RANGE PRESET, applied.** Click `span.date-range-label`, click the leaf element whose text is
the preset (e.g. `Last 12 Months`), then click the popup's **`Apply`** button, then wait ~9 s. Without
the Apply click the range does not take. The default range leaves 3 of the 4 WIP tabs empty, so widen
first or you will observe an empty report.

**WIP data payload.** `GET /api/reporting/reports/work-in-progress?from=<ISO>&to=<ISO>&locations=…`
→ `{data:{collection:[…]}}` — a FLAT list, **no `totals` and no `summary`**, each row carrying
`tab` (`ApprovedPartiallyCompleted|ApprovedNotStarted|Completed|Estimates`). Row keys: `work_order_id,
number, status, customer, unit_number, vin, location, advisor, start_date, last_activity,
labor_earned, labor_remaining, parts_earned, parts_remaining, earned, remaining, total, quoted_hours,
worked_hours, tab`. **Money is INTEGER CENTS** (`15000` = $150.00). There is **no `days_open`** (the
browser derives it from `start_date`) and **no `invoiced_hours`** (Inv. Hrs = `quoted_hours −
worked_hours`, computed in the browser) — which is exactly why the export rejects
`columns=…,invoiced_hours` with `400 Invalid column`. **Span cap = 367 days**: 367 → 200, 368 → `400
{"error":"Date range cannot be over one year."}`. An unrecognised or omitted `locations` falls back to
the active workplace only.

**Inventory Value data payload.** `GET /api/reporting/reports/inventory-value?range=custom&
start_date=&end_date=&locations=…&search=&categories=<uuid>&pagination[…]` →
`{data:{collection:[…], pagination:{rowsNumber}, totals:{qty,total_cost,total_sell,margin,margin_pct},
as_of_date}}`. Row keys: `key, workplace_id, location, part_number, description, category, vendor,
qty, unit_cost, unit_sell, total_cost, total_sell, margin, margin_pct`. **Money is INTEGER CENTS**;
`margin_pct` carries **2 decimals** (the screen renders 1 dp truncating, the exports render 1 dp
rounding — the same row can read `56.0%` on screen and `56.1%` in the file). `totals` is computed
server-side over the FULL filtered set from UNROUNDED values, so a hand sum of displayed cents can
differ by a few cents (6 cents over 5,657 rows) — that is correct.
- **Category filter param is `categories=<uuid>`** (comma-separated for several). The option list is
  `GET /api/inventory/categories?limit=500` → `{data:{collection:[{value,label}]}}` — **`value` is the
  id, not `id`**. Passing a category NAME returns 400; `category` / `category_ids` / `categoryIds` are
  silently ignored. `GET /api/vendors` is **404** on this build — the vendor param was not established;
  drive the Vendor filter through the UI dropdown.
- **The IV export IGNORES `columns=` entirely** — it always emits every column, and a nonsense column
  name is silently accepted. It DOES honour `pagination[sortBy]`/`[descending]`.
- **The IV PDF export TIMES OUT at ~30 s.** `format=pdf` 500s (`"…please try again a bit later
  later."`) on any scope big enough to take >~31 s to render — 200 at 1–578 rows, 500 at 538–9,275
  rows, **non-deterministic at the boundary** (578 rows passed at 25.4 s and failed at 32.2 s). The
  CSV of the identical scope returns in 0.8–2.2 s. Narrow with `&search=<term>` or one location to get
  a PDF. Bisector: `batch-wip-iv/tools/iv_pdf_boundary.mjs`.

**EXPORT FILE NAMES** come back in `Content-Disposition`: `wip-2-report.csv|pdf` and
`inventory-value-report.csv|pdf`. **CSV metadata lines:** WIP line 1 = `"Locations: …"`; IV line 1 =
`"As of: YYYY-MM-DD"` then line 2 = `"Locations: …"`. `"Locations: All locations"` when every
accessible location is selected. **WIP export renames two headers:** screen `Asset`/`Location` → file
`Unit`/`Branch` (confirmed in the extracted PDF text as well as the CSV).

**WORK-ORDER STATUS ENUM.** `GET /api/work-orders/statuses` → `{data:{collection:[{value,label}]}}` =
`estimate/Estimate · approved/Approved · in_progress/`**`In progress`**` · ready_for_review/Review ·
complete/Complete · invoiced/Invoiced · paid/Paid`. **There is no `declined` status.** Note the
lower-case "p" in the In-progress label.

**CREATE / DELETE a work order — the gotcha that leaves strays.**
`POST /api/work-orders/create {company_id, vehicle_id, workplace_id, start_date, is_vehicle_here:true}`
→ **201 `{data:{work_order_id:"…"}}`** — the id is `work_order_id`, **NOT `id`**. Reading `.id` returns
`undefined` and the cleanup `POST /api/work-orders/delete {work_order_id}` is silently skipped, leaving
a stray WO in the report. Always read `data.work_order_id ?? data.id`, then delete (201) and re-read
the report to confirm it is gone. On this build `GET /api/canned-lines` is **404**, so the
canned-line line-create recipe is unavailable; and driving a WO to In progress via
`POST /api/work-orders/change` was not achieved (`{id}` → `400 "Work Order ID is missing."`,
`{work_order_id}` → 500) — status transitions go through the UI wizard.

**CREATE an inventory part.** `POST /api/inventory/parts/create` requires
`catalog_part_id, category_id, quantity, cost, tags, bins` (learned by posting `{}` and reading the
validation errors). **`category_id` is mandatory, so a part with NO category cannot exist** — which is
why 0 of 5,657 Inventory Value rows show a "—" Category. `POST /api/inventory/parts` is 405 (GET only).
Check whether a part is a core charge with `GET /api/inventory/parts?search=<pn>` → `is_core` /
`core_charge` (a part merely NAMED "…-CORE" in a "CORE / FEE" category is **not** a core charge).

**SEED A MINIMAL *POSITIVE* PERMISSION SUBJECT (better than creating a fresh staff member).**
`switch-user` 403s on inactive/unconfirmed users, and on this org only Admin, Technician and Foreman
have an active+confirmed holder. So: take an existing active+confirmed holder, **temporarily reassign
their role** to the smallest role that holds the atom you need, impersonate, observe, then **restore
the original `role_id` and verify it**. `GET /api/organizations/{org}/roles` + `GET /api/roles/{id}`
gives each role's permission count; on this org the roles holding `reportsPageAccess` are Service
Manager (36), Office User (25), **Sales Representative (8 — the ideal minimal subject)**, Parts
Manager (31), Admin (42). Executor: `batch-wip-iv/tools/seed2_wo_and_minimal_role.mjs`.

**PRE-COMMIT SECRET GUARD.** `bash build/report-suite/viu-2026-08-03/batch-wip-iv/tools/secret_scan.sh
[paths]` reads the live secret VALUES from `/tmp` at run time and greps the staged folder for each
one; exit 1 = leak. Scope it to genuine secret KEYS only (`sv_sso_session`, `PHPSESSID`,
`cf_clearance`, `token`, `password`, `email`, `user`) — including the `host`/`api` values from
`cookies.json` produces false positives, because the host names are deliberately documented.

---

### §N addendum — PARTS VELOCITY + TECHNICIAN UTILIZATION recipes (proven 2026-08-04, build v3.4.1-0ed4433)

**READ THE PDF. IT IS NOT AN EXTERNAL DEPENDENCY.** `apt-get update -qq && apt-get install -y
poppler-utils` (the first attempt 404s until `apt-get update` runs) then `pdftotext -layout f.pdf
f.txt` reads every report PDF, `pdfinfo f.pdf` gives **Title / Pages / Page size**, and
`pdfimages -list f.pdf` proves whether a logo is embedded. `pip install pypdf` installs but its
import panics on this image's broken system `cryptography` — use poppler.

**EXPORT SIZE BOUNDARIES (three distinct behaviours — do not conflate them).**
- **Over ~10,000 rows → HTTP 400** `"This report is too large to export. Narrow the date range or
  filters, then try again."` Proven exactly: Parts Velocity This Year across **both** locations is
  **10,064** rows and every format is refused; **one** location is 6,219 rows and exports.
- **Under the cap but a big PDF → HTTP 500** while the CSV of the identical scope succeeds.
  Reproduced twice each way: **344 rows / 31 pages succeeds** (byte-identical 308,830 bytes at 37.9 s
  and 55.4 s), **449 rows fails** (35.1 s and 36.0 s). A 55 s success next to a 36 s failure proves it
  is **size-driven, not a wall-clock timeout**. Renderer is `WeasyPrint 69.0`. Same class on the TU
  **Expanded** PDF at This-Year scope (500 after 32.8 s) while its Summary PDF returns in 1.95 s.
- **Empty result → no request at all**: the front end short-circuits with a toast reading
  `Empty export` / `Export didn't yield any results`. Same for an export with zero columns enabled.

**PV export/data facts.** `Content-Disposition` says `velocity-report.csv/.pdf` but the **browser
filename is `parts-velocity-report.csv/.pdf`** — the front end renames it, so assert the browser name.
Omitting `columns=` exports all 20; passing an empty `columns=` also exports all 20. The per-row
`Location` column is auto-inserted whenever scope spans >1 location and sits **after Vendor** (6th) on
screen *and* in both files. CSV line 1 is `"Locations: …"`. PV has **no Totals row and no `totals`
object** — that is correct, not a gap. Export sort: `pagination[sortBy]`/`[descending]` are honoured
in the file, with **nulls first ascending, last descending**.

**TU export facts.** `variant=summary|expanded` is required. Menu ships **FOUR** items
(`Summary (PDF)`, `Summary (CSV)`, `Expanded (PDF)`, `Expanded (CSV)`). Files are
`technician-utilization-summary/-expanded.pdf/.csv`. **Location is FIRST in every export but SECOND on
screen.** Neither CSV nor the Summary PDF contains the Summary row. Rows come out in raw server order,
not A→Z. Money with commas is correctly quoted (`"$7,248.85"`).

**SEED CLOCKED TIME (this is how you make Technician Utilization non-empty).** Impersonate a holder
with `POST /api/switch-user {user_id}` (the staff record's `id`), optionally
`POST /api/iam/change-location {workplace_id, workplace_timezone}` first, then:
- `POST /api/technician-tasks/department-clock-in {department_id}` → **201** `{technician_task_id}`.
  **⚠️ SNAKE_CASE.** `{departmentId}` returns `400 "Department ID is missing."` even though the error
  names the camelCase key. Departments: `GET /api/departments` → use one with `enable_time_clock`.
- `POST /api/technician-tasks/department-clock-out {task_id, description}` → **201**.
- `GET /api/technician-tasks/my-current-task` shows the open record (with a live `seconds`).
- **`DELETE /api/technician-tasks/{id}` → 204** — full clean-up, so seeding costs nothing.
Clock the SAME technician at BOTH workplaces to produce the per-row Location value **`Multiple`**, and
leave one clock OPEN to exercise the load-instant snapshot (Total Hours read 0.06 → 0.13 → 0.76 across
successive loads). Day grouping uses the **active workplace's** time zone: a record created
`2026-08-04 01:24 UTC` lands on the `2026-08-03` day row and shows as `07:25 PM` in Timesheet
Activities. `POST /api/technician-tasks/create` needs `staff_id`+`start_date` (snake_case) but then
500s — use the clock-in/out pair instead.

**TU per-day endpoint (fires ONLY on expand).**
`GET /api/reporting/reports/technician-utilization/{staff_id}/daily?range=custom&start_date=&end_date=&locations=`

**TU deep link.** Total Hours is an anchor to
`/reports/punch-clock-activities?range=custom&startDate=&endDate=&technicianId=` — same tab, technician
and range only, **no location**. A day row narrows `startDate`=`endDate`. The landed page's Totals row
is what you reconcile against.

**REPORT UI HANDLES (`data-test-id` — stop guessing selectors).** `input_report_search`
(placeholder **"Search parts"** — the report's OWN search; `select_global_search` is the Ctrl+K bar and
is the wrong element), `btn_dropdown_pv_export` / `btn_dropdown_tu_export` (aria `Export report`),
`button_column_selection` (aria + tooltip `Column Selection`), `date-range-selector_tu_trigger`,
`clear_report_location_filter`, `clear_tu_technician_filter`, `button_tu_expand_all`
(aria `Expand all technicians`), `button_tu_expand_<staff_id>`
(aria `Expand <name>'s daily breakdown` ⇄ `Collapse …`), `header_tu_{technician,total_hours,wo_hours,
internal_hours,utilization,est_lost_labor}`, `icon_tu_est_lost_labor_info`,
`option_pv_type_{both,inventory,special_order}`. Filter `.q-select` inputs carry
`aria-label="Type|Category|Vendor|Bin|Location|Technician"` — open one by clicking
`input[aria-label="X"]`.

**QUASAR GOTCHAS THAT COST REAL TIME.**
- **Column-selector toggles: click the `.q-toggle` KNOB, not the row label.** Clicking the `.q-item`
  text does nothing, which reads exactly like a broken feature — I nearly logged a false defect.
  With a 20-entry menu also `scrollIntoView({block:'center'})` first, or `boundingBox()` returns a
  clipped/negative box and the click misses.
- **Select options are `[role=option]` with `aria-selected`**, so single-vs-multi select is provable
  from the DOM. **Date-range presets are NOT `.q-item` and NOT `<button>`** — a text match over either
  silently fails (that is why a "Last 12 Months" click appeared to do nothing).
- **Toasts are `.q-notification`; POLL them** every ~250 ms for 10–20 s. A single read at +2 s misses
  them and makes a correct error toast look absent.
- Report grids are virtualised: `tbody tr` includes spacer rows — filter on
  `tr.querySelectorAll('td').length > 5`.
- **Hydration:** set `fe_permissions_wrapper` only. Calling `localStorage.clear()` first breaks
  hydration and every report renders empty.

**SAVED VIEW.** `localStorage['report_view:<slug>']` =
`{version, view:{dateRange, locationIds, sortBy, descending, columns}, extra:{…}}` — PV's extra holds
`type/categoryIds/vendorIds/binIds`, TU's holds `deselectedTechnicianIds` (the **deselected** set, so a
newly appearing technician is selected by default). Delete just the `report_view:` keys to test
first-visit defaults without breaking hydration.

**LABOUR RATES / EST. LOST LABOR.** `GET /api/labour-types` (scoped to your **active** workplace) →
`{id, name, labour_rate, is_default, workplaceId}`. The Est. Lost Labor rate **is** the workplace's
default Labour Type — Heavy Duty's `CP RAIL FLEET RATE` at `145` matches the reported dollars exactly.
There is **no labor-rate field on the Location edit dialog**; the page is `/administration/labour-types`
(nav label "Labor Rates"). **⚠️ The default cannot be cleared:** `POST /api/labour-types/change` accepts
`is_default:false`, returns **201, and does not persist it**; `POST /api/labour-types/set-default`
requires a real `labour_type_id` and rejects null/empty/bogus. And `POST /api/workplaces/delete`
**returns 500 for every id**, so do NOT create a throwaway workplace on a shared org — it cannot be
removed. Consequence: a location with **no** default labor rate is not producible, so the em-dash
Est. Lost Labor family is environment-blocked, not seed-blocked.

**CORE PARTS.** `is_core` is not settable on create. Create the parent, then
`POST /api/inventory/parts/change {…full field set…, core:true, core_charge:25}` → 201, which mints a
**separate linked core-part record** (`core_part_id`). That core record appears in neither
`GET /api/inventory/parts` nor Parts Velocity, while the parent (which merely *carries* a core charge)
does — that is the core exclusion, and `core_charge > 0` is **not** the same thing as "is a core".
`bins` on create/change take `{id, quantity, isDefault}` — `{binLocationId,…}` is rejected.

**PV DATE-RANGE CAP, exactly.** A **366-day difference** is accepted; **367 is refused** with
`400 "Date range cannot exceed 366 days."`; reversed dates give
`400 "Invalid start date provided. Must be less than end date."`

**TURNS/YR USES THE EXCLUSIVE DAY COUNT.** For Jan 1 – Aug 4 the build divides by **215**, not the
spec's inclusive 216: `512/215*365/618 = 1.40648754422` matches the payload exactly (216 would give
1.39998). Reproduced on a second row. Useful as a worked example of settling a calculation dispute
from the payload alone.

### N.2 SBC / SBR report internals + the seeding chain (proven 2026-08-04, build v3.4.1-0ed4433)

**Report UI selectors (Quasar) — do not re-derive.**
- Date range trigger is **`span.date-range-label`** (NOT a `.q-btn`). Presets inside the popup are
  **`div.preset-option`** in **`div.preset-sidebar`** (active one also carries `.active`); the readout
  is **`span.range-indicator`** ("Range: N days"); then an **Apply** `.q-btn`.
  **Exactly NINE presets, and NO "Custom"/"Today"/"Yesterday":** Last 12 Months · This Year · Last Year ·
  This Quarter · Last Quarter · This Month · Last Month · This Week · Last Week. Default is **This Month**,
  which on this org is EMPTY — always widen to Last 12 Months before observing anything.
- Export menu = **`[aria-label="Export report"]`** (`btn_dropdown_<sbc|sbr>_export`), exactly four items:
  `Download Summary (PDF)` · `Download Expanded View (PDF)` · `Download Summary (CSV)` · `Download Expanded View (CSV)`.
  **No Print control exists on any report page.**
- Column selector = **`[aria-label="Column Selection"]`** (`button_column_selection`). **The menu ROW is
  NOT clickable** — the control is the **`q-toggle` `role="switch"` `data-test-id="toggle_column_<key>"`**
  beside the label. Clicking the row centre does nothing and reads as "the selector is broken"; clicking
  the toggle removes the column correctly. (Cost an hour once — don't repeat it.)
- Grand totals row = **`tbody tr.report-totals-row`**, label `Totals`. Row classes: `sbc-row--customer`
  / `sbc-row--asset` / `sbc-row--invoice`, `sbr-row--rep` / `sbr-row--invoice`.
- Expand-all is a header `.q-btn` with aria-label **"Expand all customers"** / **"Expand all representatives"**.
- Entity-filter menus have a real search input (`placeholder="Search customers"`) — you must **click the
  input inside the `.q-menu`** before typing, or the keystrokes go nowhere and it looks like search is broken.
- Filter state persists in **`localStorage['report_view:<slug>']`**; the **URL carries no filter state**.

**Report data + drill-down endpoints.**
- `GET /api/reporting/reports/sales-by-customer/{customerId}/assets?<filters>` then
  `.../assets/vehicle%3A{vehicleId}/invoices?<filters>` — SBC is a 3-level tree, loaded on demand.
- `GET /api/reporting/reports/sales-by-representative/{repKey}/invoices?<filters>`; the **Unassigned
  bucket's key is `00000000-0000-0000-0000-000000000000`**.
- **`showUnassigned=1`** is the Show Unassigned parameter (`show_unassigned`/`showUnassigned=true` also work;
  `includeUnassigned`/`unassigned` do NOT). It is the cheapest way to get a big SBR dataset without seeding.
- `productType=all|parts|service`; `invoiceStatus=all|paid|partially_paid|unpaid`; `customers=<uuid>`.
- A **span beyond ~2 years returns 400** — use `start_date` within 12 months for real data.
- Money is integer **CENTS** in every payload.

**Sales reps.**
- `GET /api/sales-reps` → `[{id (= the staff_id), name}]` — this is what the **work-order** selector uses.
- A staff member becomes selectable by setting **`is_sales_rep`** via
  `POST /api/staff/{staff_id}/change` (echo the whole record; **`workplace_id` must be non-null** or it
  400s "Missing required parameter").
- Assign on a WO: `POST /api/work-orders/change-sales-rep {work_order_id, sales_rep_id}` → 201.
  **⚠️ Returns 201 but SILENTLY NO-OPS for a work order in another workplace** — switch first with
  `POST /api/iam/change-location {workplace_id, workplace_timezone}`.
- The **customer's** rep is a different mechanism: `POST /api/customers/change` stores
  **`sales_rep_first_name` / `sales_rep_last_name` as STRINGS** (no `sales_rep_id`; sending one → 500), and
  its picker offers **all staff including inactive**, unlike the WO selector.
- **The report reads a SNAPSHOT taken at invoice creation** (SBR S19-R6/S19-N2): changing a WO's rep after
  invoicing does NOT move the invoice. So **a new invoice is the only way to create a new rep row.**

**The invoiced-work-order chain (each step's exact gotcha).**
1. `POST /api/work-orders/create {company_id, vehicle_id, workplace_id, start_date, is_vehicle_here:true}`
   → 201; the response key is **`work_order_id`**, NOT `id` (getting this wrong silently strands work orders).
2. `POST /api/work-orders/{woId}/lines/create-from-canned-line {canned_line_id, status:'authorized'}` → 201
   `{line_id}`. Canned lines: `GET /api/work-orders/canned-lines` (filter to `fixed_price` set + your
   `workplace_id`). **The generic `POST /api/work-orders/lines/create` returns 500** once validation passes.
3. `POST /api/work-orders/change-mileage {work_order_id, mileage:'123456'}` → 201.
   **`mileage` MUST be a STRING** — a number returns 500. Without it, line-complete 400s
   "Line can not be completed without a Work Order mileage".
4. `POST /api/work-orders/lines/change-story {line_id, tech_story, work_order_id}` → 201. Required before
   completing a line ("Line can not be completed without a tech story"). **`/lines/change` returns 500.**
5. `POST /api/work-orders/lines/change-status {line_id, status:'complete'}` → 200.
6. `POST /api/work-orders/change-status {id, status:'complete'}` → 201. **The field is `id`, not `work_order_id`.**
7. `POST /api/invoices/create {work_order_id}` → **201** — **but ONLY if the work order carries a
   CONTACT PERSON.** Without one it returns **500**. See the next block: this is the single most
   expensive thing this chain got wrong.

**⚠️ THE CONTACT IS MANDATORY FOR INVOICING — the correction that cost us SV-8821 (proven 2026-08-04,
build `v3.4.1-0ed4433`).** The earlier version of this recipe said `invoices/create` "returns 500 on
this branch" and that the UI's Create Invoice failed too. **Both statements were wrong**, and they were
wrong because the chain above never set a contact.

- **`POST /api/work-orders/create` does NOT set a contact unless you pass one.** Add
  **`customer_id: <contactId>`** to the create payload — on this build **`company_id` is the business
  and `customer_id` is the CONTACT PERSON**, which is easy to misread as the same thing.
- **Get a contact id from `GET /api/customers/view/{companyId}` → `data.company.contacts[]`.**
  (`/api/customers/{id}/contacts` is **404**; not every company has one — pick a company where
  `contacts_count > 0`.)
- **On an existing work order:** `POST /api/work-orders/change-contact
  {work_order_id, vehicle_id, contact_id, update_vehicle:true}` → **200**. This is what the UI sends;
  `update_vehicle:true` writes the contact onto the **asset** permanently (the UI asks *"Would you like
  to change to the new contact for this asset permanently?"* → **YES**).
- **With a contact: `invoices/create` → 201** (work order status → **Invoiced**) and
  `POST /api/work-orders/invoices/estimate` → **200**. **Without: both → 500** with the generic
  `"An error occurred…"` body. Proven with everything else held constant (same customer, same asset,
  same canned line, identical `sub_total 386.75` / `total_cost 406.09`).
- **The bare `{work_order_id}` body is fine** — the UI sends a much larger body, but the minimal one
  returns 201 once a contact exists, so **do not chase the payload shape.**
- **UI-side gate (useful for any invoicing test):** with no contact the work order's **Finance tab is
  disabled** (`aria-disabled="true"`, tooltip **"Please select a contact for the asset"**) and **no
  Create Invoice button exists in the DOM**. The **Create Work Order** dialog has only *Customer ·
  Asset · Asset Here?* — **no Contact field** — so every freshly created work order starts in that
  state. The **New Asset** dialog makes **`Contact *`** required, which is why the tooltip says
  "for the asset".

**⚠️ Canned lines that bring PARTS cannot reach Complete without receiving them first.**
`GET /api/work-orders/canned-lines` on this branch returns **79** lines (all at Heavy Duty): **11**
with `fixed_price` (Fixed labour), **3** with `fixed_line_total`, **65** hourly via `labour_rate`;
**37 pull catalogue parts**. For a parts-bearing line,
`POST /api/work-orders/lines/change-status {status:'complete'}` → **400 ``"Line can`t be completed with
unfulfilled part requests."``**, so the work order never completes and `invoices/create` correctly
answers **400 `"Work order is not complete."`**. **Pick a `total_parts === 0` canned line** for any
seed that only needs a completed, priced line — filtering on `fixed_price` (as the original script did)
narrows you to 11 lines for no reason and hides the parts distinction that actually matters.
Enumerator: `build/report-suite/defect-pack-2026-08-04/repro-sv8821/tools/enumerate_canned.mjs`.

**Deleting seeded work orders.** A Complete/Invoiced WO cannot be deleted — first
`POST /api/work-orders/change-status {id, status:'estimate'}`, then
`POST /api/work-orders/delete {work_order_id}`. **⚠️ A missing work order answers
`400 {"workOrderId":"Not found"}`, NOT 404** — a cleanup verifier checking for 404 will wrongly report
everything still present.

**Reading PDF exports (the "PDF is an external dependency" excuse is wrong).**
`pip install pypdf` — and if it fails to import with `ModuleNotFoundError: _cffi_backend`, `pip install cffi`
repairs the broken system `cryptography` module. `apt-get install poppler-utils` 404s on this image, and is
unnecessary. Extractor: `build/report-suite/viu-2026-08-03/batch-sbc-sbr/tools/extract_pdf.py`.

---

## §N — Report Suite QA branch `sv8582`: the ONE-LOGIN session recipe (proven 2026-08-04)

**The trap this exists to stop.** `POST /api/quick-login` is **stateful on the shared `PHPSESSID` and
rotates it on every call.** So calling it a second time **invalidates the session the first call gave
you**, and a worker that "re-logs-in to be safe" locks itself out. A previous worker burned its session
exactly this way. Symptom: `HTTP 409 {"errors":[{"error":"Session has expired."}]}` on every read.

**Also true and worth knowing:** a **raw-cookie** read (the cookies as supplied, before any
quick-login) returns **409 `Session has expired.`** — that is **normal, not a dead session.** The
cookies gate quick-login; they are not themselves an API session. **Do not conclude the session is dead
from a 409 on a raw-cookie read — try quick-login once.**

**The recipe: capture EVERYTHING you will need in ONE login.**

```python
# ONE call. Persist BOTH the rotated cookie AND the SPA user payload.
r = POST https://sv8582api.qa.shopview.com/api/quick-login  {"key":"admin"}
    headers: Cookie: sv_sso_session=…; PHPSESSID=…; cf_clearance=…
             Origin/Referer: https://sv8582.qa.shopview.com
new_phpsessid = the PHPSESSID in the response's Set-Cookie      # REPLACE the old one
userobj       = {"data": <the whole response .data payload>}     # token + role + details
# write both to /tmp; never call quick-login again this run
```

**For Chromium/Playwright hydration the `user` object shape matters exactly:** `localStorage.user` must
be `{"data": <the quick-login data payload>}` — **the whole payload**, not a hand-built
`{token, ...profile}`. Getting it wrong renders the **login page** with no error. Also set
`fe_permissions_wrapper` (from `GET /api/auth/me/fe-permissions` → `.data`) and
`token` (`.data.token`).

**In-SPA route changes: use a FULL `page.goto()`, not `pushState`.** `history.pushState` +
`popstate` leaves the app on `/reports/punch-clock-activities` (its default) — every report then renders
the punch-clock table and you get six identical, wrong captures. `page.goto(APP + '/reports/<slug>')`
plus a ~11 s settle works. Reusable: `build/report-suite/recheck-2026-08-04/tools/boot.mjs`.

### Report endpoints (all `GET`)

| Purpose | Path |
|---|---|
| Report data | `/api/reporting/reports/<slug>?<params>` |
| Export | `/api/reporting/reports/<slug>/export?format=csv\|pdf&<params>` |

Slugs: `sales-by-customer` · `sales-by-representative` · `parts-velocity` ·
`technician-utilization` · `work-in-progress` · `inventory-value`.

**Per-report parameter shapes — they are NOT uniform:**
- most: `range=this_year|last_year|this_month|last_month|this_quarter|last_quarter|this_week`
  **or** `range=custom&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`. **`range=last_12_months` → HTTP 400.**
- **Work In Progress is different** — it takes `from=<ISO>&to=<ISO>&tab=<Tab>` and **requires**
  `columns=` on export (`At least one column is required.`). Tabs:
  `ApprovedNotStarted` · `ApprovedPartiallyCompleted` · `Completed` · `Estimates`.
- SBC/SBR/TU exports take `variant=summary|expanded`; SBC/SBR also `productType`, SBR `invoiceStatus`.
- Location scope: `&locations=<uuid>[,<uuid>]`.
- Paging: `pagination[page]=1&pagination[rowsPerPage]=500`.

**Field-name traps that cost real time:**
- Work In Progress uses **`number`** (not `wo_number`) and **`labor_earned` / `parts_earned` /
  `labor_remaining` / `parts_remaining`** (not `earned_labor` …). Wrong names silently yield
  "mismatches" that are your own.
- **Money is integer cents** in the API. The CSV writes negatives as **`-$33.73`** — minus **outside**
  the `$`. Formatting them as `$-33.73` produces phantom mismatches.

**Export file shape (as of `v3.4.1-3d03023`):** a UTF-8 BOM, then metadata lines, then the header row.
`Date Range:` is line 1 on **all six**; Inventory Value adds `As of:` so its header row is **line 4**,
everyone else's is line 3. **Do not hard-code the header's line number — find it.**

**Validation messages (all HTTP 400, verbatim):** `Invalid export format. Allowed values: csv, pdf.` ·
`Invalid export variant. Allowed values: summary, expanded.` · `Invalid tab "zzz".` ·
`At least one column is required.` · `Invalid column "invoiced_hours".` ·
`Selected date range is invalid.`

**`format=pdf` 500s at whole-list scope** (SV-8818) after 30–45 s and succeeds when narrowed — budget
for the timeout, and give PDF probes ≥ 60 s.

**Transport:** the egress proxy occasionally resets the connection mid-run
(`ConnectionResetError [Errno 104]`). **Retry with a short backoff** rather than treating it as a dead
session — 4 tries with a 3 s pause cleared every occurrence.

## §N.1 — `gen_import.py` blanks the id-map C-ids (Report Suite too)

Running `build/report-suite/gen_import.py` **blanked all 469 C-ids** in
`build/report-suite/testrail-id-map.csv`. Same gotcha already recorded for Filters and Schedule.
**Fix: `git checkout -- build/report-suite/testrail-id-map.csv` after any regeneration, then verify
`0 blanks`.** The import file itself is fine.


---

## §O — FILTERS QA BRANCH `sv8785`: the filter-bar recipes (proven 2026-08-04)

**Hosts.** App `https://sv8785.qa.shopview.com` · API **`https://sv8785api.qa.shopview.com`** —
**VERIFIED live** (this closes the §B note that called it inferred; the `sv<epic>api` pattern is now
proven on two of three branches). Cookies `/tmp/filters-viu/cookies.json`. **Build marker:**
`curl -s https://sv8785.qa.shopview.com/ | grep app-version` → `v3.4.2-4f8211c` (2026-08-04),
**`v3.4.2-d00239b`** (2026-08-05 — **the branch redeploys overnight; read the marker EVERY session
before trusting any prior verdict**, Rule 49). Read it with headers in one shot:
`curl -sS -D- -o /tmp/idx.html https://sv8785.qa.shopview.com/index.html | grep -iE 'last-modified|etag'`
— `last-modified` + `etag` corroborate the version string and are what prove a deploy happened.

**The same session survives a redeploy.** `/tmp/filters-viu/cookies.json` + the stored `PHPSESSID`
still authenticated the day after the deploy — `POST /api/quick-login {"key":"admin"}` → **HTTP 200**
on the first try. So a deploy invalidates *verdicts*, not necessarily *credentials*.

**Navigation gotcha — never use `waitUntil:'networkidle'` on this SPA.** It never goes idle and the
`goto` times out at 90 s. Use the established pattern from `tools/h.mjs`:
`goto(..., {waitUntil:'domcontentloaded', timeout:90000})` then `waitForTimeout(12000)`.

**Session.** The §N one-login rule applies unchanged: **call `POST /api/quick-login {"key":"admin"}`
exactly ONCE**, keep the rotated `PHPSESSID`, and never call it again in the run. A raw-cookie read
returning `409 Session has expired.` before that is normal, not a dead session. Boot helper:
`build/filters/viu-2026-08-04/tools/boot.mjs` (Chromium straight through `$HTTPS_PROXY` with
`--ignore-certificate-errors` — **no MITM bridge is needed**).

### THE FILTER-BAR TEST-ID MAP — never re-derive these by reading the DOM again

Every control in this feature carries a `data-test-id`. Selectors, not guesses:

| Control | `data-test-id` |
|---|---|
| collapse / expand toggle (`filter_list` icon) | `toggle_filter_bar` |
| the five chips | `filter_chip_status` · `filter_chip_company_id` · `filter_chip_tech_assigned_id` · `filter_chip_service_advisor_id` · `filter_chip_vehicleHere` |
| mobile combined chip | `filter_chip_all_filters` |
| a Status option | `filter_option_status_<value>` — **note `Review` is `ready_for_review`** |
| a person / customer option | `filter_option_<field>_<uuid>` |
| Asset on Site options | `filter_option_vehicleHere_1` (Yes) · `filter_option_vehicleHere_0` (No) |
| in-dropdown search box | `filter_search_<field>` |
| Clear Selection | `filter_clear_selection_<field>` |
| a selected-customer tag | `filter_tag_company_id_<uuid>` |
| toolbar Clear Filters | `clear_filters` |
| Clear Filters inside the empty state | `empty_state_clear_filters` |
| page search (collapsed / expanded / clear) | `page_search_toggle` · `page_search_input` · `page_search_clear` |
| mobile search icon (top header, NOT the action row) | `button_open_mobile_search` |
| mobile All Filters footer button | `apply_filters` |
| Back To My Saved Filters | `back_to_saved_filters` |
| column selector · primary CTA | `button_column_selection` · `button_new_work_order` |

**Only TWO dropdown components exist app-wide** — worth knowing before writing any selector:
`.filter-option-list-panel` (checkbox list; options are `[role=checkbox][aria-label][aria-checked]`)
and `.filter-search-list-panel` (search box + `[role=listitem]` rows + a `.filter-search-list-panel__tags`
strip of removable `.q-chip`s). Mobile reuses both inside `.mobile-filter-sheet__body`;
the combined sheet adds `.mobile-all-filters-sheet__footer`.

### The three contracts

- **List request:** `GET /api/work-orders?pagination[rowsPerPage]=..&pagination[page]=..&pagination[sortBy]=..&pagination[descending]=..&filters[N][field]=<status|company_id|tech_assigned_id|service_advisor_id|vehicleHere>&filters[N][value]=<v>&search=<q>&showMyWorkOrders=<0|1>`.
  Repeat `filters[N]` with the **same field** for OR; **different fields AND together**.
  A bad `field` → **400**; a bad `value` → **200 with 0 rows**; a bad `vehicleHere` value → **200 UNFILTERED**.
- **Saved state:** `GET`/`PUT /api/users/me/preferences/work-orders-list`, value =
  `{tab, search, sortBy, descending, columns{...}, filters{<field>:[values]}, collapsed}`.
  **⚠️ BUILD-DEPENDENT: `search` is GONE from this payload as of `v3.4.2-d00239b` (2026-08-05).**
  On `v3.4.2-4f8211c` typing in the page search wrote `"search":"<term>"` here and it came back on a
  later visit (that was defect SV-8844); on `d00239b` **no `search` key is written at all** — before
  typing, after typing, or after clearing — so the page search is now session-only. Verified live:
  `build/filters/ruling-2026-08-05/evidence/recheck3.json`. **This is the cleanest probe for that
  behaviour — read the preference rather than trying to infer it from the screen.**
  A never-saved key returns **200 with `value: null`**; a path-traversal key returns a clean **404**.
  **`PUT` this to reset a branch to a known state** — far faster and more reliable than clicking
  Clear Filters, and it is how to stop filter state leaking between runs.
- **URL:** `?status=<v>` (repeatable) `&company_id=<uuid>` (repeatable) `&tech_assigned_id=` `&service_advisor_id=` `&vehicleHere=<1|0>` `&search=<q>` `&tab=<all|complete|my>`. **There is NO `tab` param on the Estimates tab** — a shared Estimates link does not carry its tab.

### Three traps that cost real time

1. **Filter state PERSISTS SERVER-SIDE across browser contexts**, so a fresh Chromium does **not**
   give you a clean page. **`PUT` the preferences payload before each run** or your results carry
   over from the last one. (This is also how the persistence requirement was verified.)
2. **A dropdown closes the moment you tick one option** (SV-8824), so a `click option, click option`
   sequence times out on the second. Re-open the chip between ticks — the helper
   `tick(page, testid, chipName)` in `viu-2026-08-04/tools/h.mjs` does it automatically.
3. **On a phone the list renders as CARDS, not `<tbody><tr>`** — row-counting selectors silently
   return 0 (or double-count nested card elements). Count distinct work-order numbers from
   `document.body.innerText` instead.

### On-screen labels — the build differs from the spec in eight places

Build wins for test wording (Rule 9): **`Asset on Site`** (not "on site") · **`Clear Selection`**
and **`Clear Filters`** (capital second word) · in-dropdown placeholder is plain **`Search`** (not
"Search customer"/"Search technician") · statuses read **`In progress`** (lowercase p) ·
**`Create Work Order`** (the spec says "New Work Order") · **`Back To My Saved Filters`** (the spec
says "Back to my view") · page-search placeholder **`Type to search`** · empty state
**`No work orders match your filters`**.
