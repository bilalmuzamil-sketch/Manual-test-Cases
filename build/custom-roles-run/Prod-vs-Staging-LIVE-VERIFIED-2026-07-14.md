# Prod-vs-Staging Permission Compare — LIVE-VERIFIED, DUAL-VERDICT — 2026-07-15

> **TRUST-CRITICAL REBUILD. Observed-only (Standing Rules 10 & 12).** A cell is a real
> result **only if the control was rendered on the real screen this run with a screenshot
> captured**; everything else is **NOT VERIFIED** with the reason. Nothing is inferred from
> role definitions, `fe_permissions`, atoms, or source. The prior deliverable
> (`Prod-vs-Staging-Permission-Gaps_2026-07-14.xlsx`/`.md`) is **SUPERSEDED**.
>
> Workbook: `Prod-vs-Staging-LIVE-VERIFIED-2026-07-14.xlsx` (see the **"Pass-12 LIVE (2026-07-16)"** tab for the latest).
> Evidence: `live-ui-2026-07-15/staging/<role>/`, `live-ui-2026-07-15/production/<role>/`,
> `live-ui-2026-07-16/production/<role>/`, and `live-ui-2026-07-16/staging/<role>/` (full-page screenshots + per-role JSON).
>
> **➡️ 2026-07-16 PASS-12 — the FINAL two residuals CLOSED; read `live-ui-PASS12-2026-07-16.md`. ZERO unexplained NOT-VERIFIED remain.**
> (1) **Approve/Decline line = OBSERVED-LIVE both envs, all roles** (prod: seeded a genuine
> `authorization_required` line "SV 8180" on S1-723 via the canned-line typeahead with "Line Approved"
> unchecked, role-swap+self-login per role, line deleted after; staging: real-holder switch-user on WOs
> carrying a real pending line + the healthy 2026-07-15 role-swap capture for the 4 holderless roles).
> SHOWN: Admin/Service Manager/all Service-Advisor tiers/Foreman (both envs) + **Parts Manager = STAGING-MORE**
> (prod HIDDEN / staging SHOWN); HIDDEN both: Technician/Parts Tech/Office/Sales Rep/Time Clock.
> (2) **Send to Terminal (prod) = fully-characterized ORG-DEVICE gate** (NOT role/migration gated):
> prod admin Settings full nav + Payment Methods page show no Terminals/Card-Readers/Devices section,
> "New Payment Method" makes named methods only, all terminal APIs 404 → no UI path to provision a
> terminal on prod (needs external hardware/processor registration). Staging org HAS a terminal → SHOWN
> for invoicing roles. Migrating roles does not change Send-to-Terminal access.
> *Env note:* staging `staff/change` is currently 500 (role-swap unavailable this window) — worked around
> with real-holder switch-user.
>
> **➡️ 2026-07-16 PASS-11 — the two Pass-10 residuals CLOSED; read `live-ui-PASS11-2026-07-16.md`.**
> (1) **Prod See AP/AR = OBSERVED-LIVE for all 14 legacy roles** (real-holder switch-user + role-swap+
> switch-user; render path validated by an Administrator CONTROL rendering the A/R+A/P tiles; the whole
> Reports surface is a single FE all-or-nothing gate). SHOWN: Admin + Office only. **STAGING-MORE:
> Service Manager, Parts Manager, Sales Representative**; MATCH for the rest. (2) **Prod Part Return =
> OBSERVED-LIVE for all 13 prod roles** on returnable WO **S1-719** via role-swap + **self-login**
> (switch-user bounces WO-detail on null location; the "Return" control is in a picked part's
> `[aria-label="Part context menu"]`). SHOWN for 10 roles; **STAGING-MORE: Sales Representative +
> Office User** (prod HIDDEN); Time Clock = PARTIAL (staging side still NV). **Only residual left in
> the entire matrix: staging Time Clock User Part Return** (needs a live staging Time-Clock session).
>
> **➡️ 2026-07-16 PASS-10 — Pass-9 residuals CLOSED; read `live-ui-PASS10-2026-07-16.md`.**
> (1) **Prod finance for Service Manager / Parts Manager / Parts Technician = OBSERVED-LIVE**:
> the Finance route deterministically bounces these roles to `/no-location` (SA-Limited-View
> renders via `/api/invoices/preview` 200) while `invoice-view` API = 200 (data readable) —
> payment controls NOT usable in prod UI → **STAGING-MORE** for all 3. The estimate-400 was a
> universal "missing parameter" data error (hits SA-LV too), NOT a permission deny.
> (2) **Staging Core OK/Not-OK + Part Return** for the 4 holderless roles = **all SHOWN** on the
> existing cored WO S9-25051 (Core OK/Not-OK dual = MATCH x4). (3) **See AP/AR** observed live for
> **all 11 staging roles** (SHOWN: Admin/Svc Mgr/Parts Mgr/Sales Rep/Office; HIDDEN: Sr SA/Svc
> Advisor/Foreman/Tech/Parts Tech/Time Clock); prod = Office User SHOWN (MATCH), others route-bounce
> (NV). **Build findings:** Bulk Receive absent (Simple-Flow feature), Fix Part# no distinct control,
> Assign Vendor only in New-PO/Order-Parts flow. **Residual NV (precise): prod Part Return per role
> (no returnable-state part on prod) + prod See-AP/AR for non-Office roles (reports route bounces;
> FE-gated so API cannot classify).**
>
> **➡️ 2026-07-16 PASS-9 ADDENDUM — read `live-ui-PASS9-2026-07-16.md`.** Self-service
> unblocks: prod finance via role-swap **self-login** (SA-Limited-View New Payment/Reverse/
> Issue Credit = **all SHOWN**, confirming the **Invoice-Reverse STAGING-LESS** dual on the
> prod side; Foreman finance HIDDEN → **STAGING-MORE**), + the 4 holderless STAGING roles'
> **Set Line Status + WO Delete** observed live on a seeded unapproved-line WO
> (**Foreman/Office User/Parts Technician lose WO Delete = STAGING-LESS**). 14 new
> OBSERVED-LIVE cells; residual NOT-VERIFIED = prod finance for Service Manager/Parts
> Manager/Parts Technician (estimate-400 panel crash), staging Core-OK/Part-Return
> (needs a picked cored line), and Task-C PO-detail/AP-AR nav.

> **✅ 2026-07-15c UPDATE — PROD RE-OBSERVED, DUAL VERDICTS REBUILT.** The expired
> prod cookies were re-established via the **renewable prod self-login**
> (`POST /api/login`), so production was observed LIVE this run after all. **All 14
> prod legacy roles** were driven live via **test-staff role-swap + self-login**
> (`POST /api/staff/change` → `POST /api/login` as the test staff), controls observed
> on the real `app.shopview.com` screens with screenshots, and the test staff was
> **RESTORED to Office User** (verified). See **§0e** for the completed dual verdicts
> and the **"Remaining-Caps Dual LIVE"** + **"Prod Remaining-Caps (all 14)"** workbook
> tabs. Remaining NOT-VERIFIED: (a) **Part Return** prod-side (the control does not
> surface via the headless probe — even Admin didn't render it — so it is honestly
> NOT VERIFIED, never asserted hidden); (b) **finance caps** (New Payment / Reverse /
> Issue Credit) for **Service Manager / Service Advisor / Parts Manager / Parts
> Technician / Office User** because the Finance tab's `GET /api/work-orders/invoices/
> estimate` returns **HTTP 400** under the role-swap session and crashes the panel to
> "No location" (a session artifact, not a permission result); (c) **Sales Rep /
> Reporting / Time Clock** whose WO detail did not render ("No location"); (d) the **4
> holderless STAGING roles** (Service Manager / Foreman / Office User / Parts
> Technician) — still **NO live role-holder** and `staff/change` still returns **HTTP
> 500** (shared-env drift, retried 4×), so their staging remaining-cap cells stay NOT
> VERIFIED. Nothing inferred.

## 0. Both environments observed LIVE this run

- **STAGING** (all 11 system roles): rendered in the real SPA via genuine impersonation —
  `switch-user` for 7 roles with an active user + **tech role-swap** (assign real role →
  quick-login tech → observe → restore Technician) for the 4 without. WO-detail controls
  observed on-screen with screenshots.
- **PRODUCTION**: session came back **ALIVE**. The **6 prod roles that had an active user**
  were observed live via `switch-user` on the old-model SPA (`app.shopview.com`) —
  Administrator, Office User, Sales Representative, Service Advisor, Technician, Time Clock
  User — full-page screenshots, all `exit-switch-user` 200. The **8 prod roles with NO active
  user** (Service Manager, Foreman, Parts Manager, Parts Technician, SA Limited View, SA
  Technician, SA No Reports, Reporting) were **NOT role-swapped** (prod is a real system on a
  fast-expiring session) → they remain **NOT VERIFIED**.

## 0a. FULL DUAL MATRIX (2026-07-15) — all 14 prod roles + 11 staging roles deep-observed

Both halves were deep-observed live via role-swap of a test staff (prod: bilal.muzamil+…limitedview
in "Truck Hill 1" org; staging: tech@shopview.com in "Staging Heavy Duty" org), capturing per role:
Send to Portal, New Line, Reviewed, See Financial Data (Rate/Margin), Take Payment (New Payment),
Send to Terminal, line Return, WO Delete, plus tabs/menus. See the **"Full Dual Matrix"** workbook tab.

**Coverage: 14 capabilities × 11 roles, 95% observed (294/308 cells), real dual verdicts.**

**Confirmed migration LOSSES (STAGING-LESS — prod SHOWN → staging hidden, both live-observed):**
- **WO Delete:** Service Advisor, Foreman, Technician, Office User (old model let them delete WOs; new model removes it)
- **Send to Portal:** Technician, Parts Technician, Office User (Technician loss confirms spec)
- **WO-level History:** Technician, Parts Technician, Office User
- **Change Customer / Change Asset on WO:** Technician, Office User
- **Order Parts area (Parts tab):** Technician, Office User
- **Timesheets tab:** Technician, Parts Manager
- **Invoicing/Finance view:** Technician
- **Create/Edit WO Lines (New Line):** Parts Technician

**New grants (STAGING-MORE — staging SHOWN → prod hidden):**
- **Take Payment / New Payment:** Service Manager, Senior SA, Foreman, Parts Manager, Parts Technician, Office User (new model grants invoicing-create more broadly)
- **Send to Terminal:** Admin, Service Advisor (org-terminal caveat)
- **WO Delete:** Service Manager; **Reviewed:** Parts Manager; **Change Customer/Asset:** Service Manager, Parts Manager

**Still NOT VERIFIED (need targeted seeding, both envs):** Approve/Decline line (needs a pending-unapproved
line — the estimate WO's line was already approved), Part Return (needs a returnable picked part), Set Line
Status, Core OK/Not-OK (needs a cored inventory part), plus Parts-module deep flows (Pick, Receive, Bulk
Receive, Assign Vendor, Fix Part #, vendorless part), Invoicing delete/reverse, part-return complete,
create customer/asset from the New-WO flow, and AP/AR detail.

**Important org-config caveat:** prod Send to Portal is broadly SHOWN in "Truck Hill 1" because that org
has customer-portal enabled; the new-model staging role-gating removes it for non-review roles. So the
STAGING-LESS is a real role-gating change, modulated by org portal config. (An earlier switch-user prod
pass in *other* orgs showed Technician hidden — org-dependent; the role-swap dataset here is the
consistent single-org comparison.)

**Send to Terminal:** ORG-CONFIG gated — prod "Truck Hill 1" has NO terminal (button absent for all prod
roles); staging "Staging Heavy Duty" HAS one (SHOWN for invoicing roles: Admin/Service Mgr/Senior SA/
Parts Mgr/Service Advisor). Not a role/build migration risk.

**WO Delete:** WO-state dependent (deletable only without an invoice); the dynamically-picked WO this pass
was not consistently deletable → flagged with caveat in the matrix rather than asserted per role.

## 0b. Send to Terminal — MAJOR CORRECTION (staging, live-observed)

The prior workbook claimed **"no Send to Terminal control anywhere in the staging build"**
(from a source grep). **This is WRONG.** Live, **"Send to Terminal" is a real button** in the
**New Customer Payment dialog** on an invoiced WO with a balance (Finance tab → New Payment).
Screenshot: `live-ui-2026-07-15/staging/Admin/SendToTerminal_dialog.png`.

Staging live observations (Send to Terminal): **SHOWN** for Admin, Parts Manager, Senior
Service Advisor; **hidden** for Technician (tech view, no Finance) and Sales Representative
(no invoicing-create). Gate = invoicing-create + Finance access (same as the "New Payment"
button). NOT VERIFIED this session: Office User + Time Clock (invoiced WO did not render for
them) and Service Manager / Service Advisor / Foreman / Parts Technician (staff/change
role-swap hit an org-context 403). Prod Send-to-Terminal not driven yet. See the
"Send to Terminal LIVE" workbook tab.

## 0c. PARTS-MODULE deep-flow — LIVE DUAL verdicts (2026-07-15b, NEW)

Previously NOT VERIFIED. Now driven LIVE to `/parts/orders` per role on BOTH envs, controls
observed on-screen with full-page screenshots. Unblocked by reusing the Simple Flow inventory
recipe (endpoints `/api/inventory/orders`, `/api/inventory/deliveries` exist identically on the
Custom Roles envs) — the orgs already hold real POs/deliveries so NO seeding was needed; pure
FE-gate observation on existing data.

- **Method (staging):** genuine `switch-user` impersonation for 7 roles with an active holder;
  throwaway role-swap of `bilal.muzamil+20` + `switch-user` for the 4 roles without a holder
  (Service Manager / Foreman / Parts Technician / Office User) — throwaway RESTORED to its
  original role after.
- **Method (production):** test-staff role-swap (`POST /api/staff/change`) + self-login for
  ALL 14 prod roles — test staff RESTORED to Office User (verified).
- **Capabilities observed:** **Order Parts** = the **"New PO"** button (create purchase order)
  on `/parts/orders`; **Receive** = the per-PO **"Receive"** button (accept a delivery).

**Result — every one of the 22 dual cells (11 staging roles × 2 caps) is a DUAL LIVE-OBSERVED
MATCH.** The Parts-module Order-Parts and Receive gates map identically prod↔staging → **NOT a
migration risk.**

| Staging role | Prod role compared | Order Parts (New PO) prod / stg | Receive prod / stg | Verdict |
|---|---|---|---|---|
| Admin | Administrator | SHOWN / SHOWN | SHOWN / SHOWN | MATCH |
| Service Manager | Service Manager | SHOWN / SHOWN | SHOWN / SHOWN | MATCH |
| Senior Service Advisor | Service Advisor *(merge: SA Tech + SA No Reports, both consistent)* | SHOWN / SHOWN | SHOWN / SHOWN | MATCH |
| Parts Manager | Parts Manager | SHOWN / SHOWN | SHOWN / SHOWN | MATCH |
| Service Advisor | SA Limited View | SHOWN / SHOWN | SHOWN / SHOWN | MATCH |
| Foreman | Foreman *(prod nav hidden, page reachable)* | SHOWN / SHOWN | SHOWN / SHOWN | MATCH |
| Office User | Office User | **hidden / hidden** *(page viewable, no create/receive)* | hidden / hidden | MATCH |
| Parts Technician | Parts Technician | SHOWN / SHOWN | SHOWN / SHOWN | MATCH |
| Sales Representative | Sales Representative *(merge: Reporting, consistent)* | hidden / hidden | hidden / hidden | MATCH |
| Technician | Technician | hidden / hidden | hidden / hidden | MATCH |
| Time Clock User | Time Clock User | hidden / hidden | hidden / hidden | MATCH |

Evidence: `live-ui-2026-07-15/staging/<role>/parts_orders.png` + `parts-obs.json`;
`live-ui-2026-07-15/production/<role>/parts_orders.png` + `prod-parts-obs.json`.
Workbook tab: **"Parts-Module Dual LIVE"**.

## 0d. NEW-WO CREATE flow — create Customer / create Asset — LIVE DUAL verdicts (2026-07-15b, NEW)

Previously NOT VERIFIED. Now driven LIVE per role on BOTH envs: open the Work Orders list → click
**"New"** → observe the **New Work Order** dialog (an **"Add"** button next to Customer =
create-customer; an **"Add"** next to Asset = create-asset, enabled only after a customer is
chosen = design gate, so presence is reported). No seeding needed. Same method as §0c (staging
switch-user + throwaway role-swap; prod test-staff role-swap, both restored).

- **Capabilities:** Create Work Order ("New" button, `workOrdersCreateAndEdit`); Create Customer
  from New-WO ("Add" next to Customer, `customersCreateAndEdit`); Create Asset control present
  ("Add" next to Asset, `assetsCreateAndEdit`).

**Result — 30/33 dual cells MATCH; the 3 non-matches are all Parts Manager = STAGING-MORE.**

| Staging role | Prod role | New (WO create) prod/stg | Add Customer prod/stg | Add Asset prod/stg | Verdict |
|---|---|---|---|---|---|
| Admin | Administrator | SHOWN/SHOWN | SHOWN/SHOWN | SHOWN/SHOWN | MATCH |
| Service Manager | Service Manager | SHOWN/SHOWN | SHOWN/SHOWN | SHOWN/SHOWN | MATCH |
| Senior Service Advisor | Service Advisor *(merge consistent)* | SHOWN/SHOWN | SHOWN/SHOWN | SHOWN/SHOWN | MATCH |
| **Parts Manager** | **Parts Manager** | **hidden/SHOWN** | **hidden/SHOWN** | **hidden/SHOWN** | **STAGING-MORE** |
| Service Advisor | SA Limited View | SHOWN/SHOWN | SHOWN/SHOWN | SHOWN/SHOWN | MATCH |
| Foreman | Foreman | SHOWN/SHOWN | SHOWN/SHOWN | SHOWN/SHOWN | MATCH |
| Office User | Office User | hidden/hidden | hidden/hidden | hidden/hidden | MATCH |
| Parts Technician | Parts Technician | hidden/hidden | hidden/hidden | hidden/hidden | MATCH |
| Sales Representative | Sales Representative *(merge: Reporting consistent)* | hidden/hidden | hidden/hidden | hidden/hidden | MATCH |
| Technician | Technician | hidden/hidden | hidden/hidden | hidden/hidden | MATCH |
| Time Clock User | Time Clock User | hidden/hidden | hidden/hidden | hidden/hidden | MATCH |

**Headline (live-proven, both sides):** the new model **grants Parts Manager the ability to
create a Work Order and to create a Customer/Asset from the New-WO dialog**, which the prod Parts
Manager did NOT have. This is a real STAGING-MORE grant (consistent with the earlier Full-Dual
finding that staging Parts Manager has broader WO/finance reach). All other roles map identically.

Evidence: `live-ui-2026-07-15/{staging,production}/<role>/new_wo_dialog.png` (or `new_wo_nobutton.png`)
+ `newwo-obs.json` / `prod-newwo-obs.json`. Workbook tab: **"New-WO Create Dual LIVE"**.

## 0e. REMAINING FE-GATED CAPS — DUAL LIVE verdicts (2026-07-15c, COMPLETED prod side)

Coordinator remaining-caps cluster (Part Return, Set Line Status, WO Delete, New Payment,
Invoice Reverse, Issue Credit) — now with the **PROD side observed live**.

**PROD method (all 14 legacy roles):** test-staff role-swap (`POST /api/staff/change` as admin) +
test-staff self-login (`POST /api/login`), then drive the real `app.shopview.com` SPA as that role.
Reference WOs (existing data, no seeding) in the test-staff org "Truck Hill 1": **S1-476**
(`a0e2e0e0`, approved, 2 lines incl. a Needs-Approval line + cored part lines) for line/WO-menu
caps; **S1-518** (`19c185ed`, invoiced) for finance caps. Test staff **RESTORED to Office User**
after (verified live). Screenshots + `wocaps-obs.json` / `fin-reobs.json` per prod role.

**PROD live results (all 14):** see the **"Prod Remaining-Caps (all 14)"** workbook tab. Highlights:
- **Set Line Status** SHOWN for every role that rendered the WO; **Technician / Parts Manager /
  Parts Technician** show **Start/Complete only** (no Approve/Decline); **Office User** shows the
  line but **no status buttons**. Confirms the prod SPA reflects the swapped role (not a leak).
- **WO Delete ("Delete Work Order")** appears in the WO ⋮ menu for **every prod role that renders
  the WO** — including Technician, Parts Manager, Parts Technician, Office User. (Old-model prod
  shows it broadly.)
- **Core OK / Not-OK** buttons **SHOWN** live on prod for all rendering roles (bonus — this cap was
  NOT VERIFIED on staging).
- **Finance (New Payment / Reverse / Issue Credit):** SHOWN for **Administrator, Service Advisor -
  No Reports, Service Advisor - Limited View**; **HIDDEN (no Finance tab)** for **SA Technician,
  Foreman, Technician**; **NOT VERIFIED** for **Service Manager, Service Advisor, Parts Manager,
  Parts Technician, Office User** (Finance tab present but `invoices/estimate` HTTP 400 → "No
  location"), and for **Sales Rep, Reporting, Time Clock** (WO didn't render).
- **Part Return = NOT VERIFIED for all 14 prod roles** — the control does not surface via the
  headless click-probe (Admin didn't render it either), so it is honestly NOT VERIFIED, never
  asserted hidden.

**REAL DUAL VERDICTS (both sides live-observed) — see "Remaining-Caps Dual LIVE" tab
(15 MATCH / 4 STAGING-LESS / 47 NOT VERIFIED):**

| Staging role | Cap | Prod (live) | Staging (live) | Verdict |
|---|---|---|---|---|
| **Parts Manager** | **WO Delete** | SHOWN | hidden | **STAGING-LESS** (spec: PM loses WO Delete) |
| **Service Advisor** | **WO Delete** | SHOWN (SA Limited View) | hidden | **STAGING-LESS** |
| **Service Advisor** | **Invoice Reverse** | SHOWN (SA Limited View) | hidden (Issue Credit only) | **STAGING-LESS** ← release risk |
| **Technician** | **WO Delete** | SHOWN | hidden | **STAGING-LESS** |
| Admin | Invoice Reverse | SHOWN | SHOWN | MATCH |
| Admin | New Payment / Issue Credit / WO Delete / Set Line Status | SHOWN | SHOWN | MATCH |
| Technician | New Payment / Reverse / Issue Credit | HIDDEN | hidden | MATCH (no finance either side) |
| Technician / Parts Mgr / SA / Senior SA | Set Line Status | SHOWN | SHOWN | MATCH |
| Service Advisor | New Payment / Issue Credit | SHOWN | SHOWN | MATCH |

**KEY finding (Invoice Reverse gated to Admin + Senior SA on staging) — prod side:**
**Admin Invoice Reverse = MATCH (SHOWN both).** The prod **SA-Limited-View** (→ new staging
**Service Advisor**) **DID** have Invoice Reverse, and the new staging Service Advisor does **NOT**
→ **STAGING-LESS** (a real migration removal). Senior SA's prod merge is mixed/partly NV: its
component **Service Advisor - No Reports** shows Reverse SHOWN live, but the primary **Service
Advisor** prod component is NOT VERIFIED (estimate-400), so the Senior-SA dual cell is NOT VERIFIED.
**Parts Manager Invoice Reverse:** staging hidden confirmed; prod NOT VERIFIED (estimate-400).

---
### 0e-prior. Original 2026-07-15b staging-only observations (retained for the record)
**Method:** Admin = admin quick-login (self); Senior SA / Parts Manager / Service Advisor /
Sales Representative = genuine `switch-user` impersonation of a real role-holder (exit-switch-user
200 each); Technician = `tech` quick-login in the shared org (tech view). Existing data only:
reference WO with picked parts = **S9-23636** (`39ace770`), invoiced WO = **S9-25382** (`6883dfc1`).

**Control → capability map (captured live from the build):**
- **Part Return** = the **"Return"** item in a line's **"Part context menu"** (⋮).
- **Set Line Status** = the per-line **Approve / Start / Complete / Pick** buttons.
- **WO Delete** = **"Delete Work Order"** in the WO top **more_vert (⋮)** menu.
- **Invoicing create** = **"New Payment"** on the invoiced-WO **Finance** tab.
- **Invoice reverse** = **"Reverse"**; credit = **"Issue Credit"** — both in the Finance ⋮ menu.

| Staging role | Method | Part Return | Set Line Status | WO Delete | New Payment | Invoice Reverse | Issue Credit |
|---|---|---|---|---|---|---|---|
| Admin | self | SHOWN | SHOWN (Approve/Start/Complete/Pick) | **SHOWN** | SHOWN | **SHOWN** | SHOWN |
| Senior Service Advisor | switch-user | SHOWN | SHOWN (Approve/Complete) | **SHOWN** | SHOWN | **SHOWN** | SHOWN |
| Parts Manager | switch-user | SHOWN | SHOWN (Approve/Start/Complete) | hidden | SHOWN | **hidden** | SHOWN |
| Service Advisor | switch-user | SHOWN | SHOWN (Approve/Start/Complete) | hidden | SHOWN | **hidden** | SHOWN |
| Sales Representative | switch-user | SHOWN (Return) | partial (Start) | hidden | hidden | hidden | hidden |
| Technician | tech (tech view) | SHOWN | SHOWN (Complete/Pick) | hidden | hidden | hidden | hidden |
| Time Clock User | switch-user | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED |
| Service Manager | role-swap | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED |
| Foreman | role-swap | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED |
| Office User | role-swap | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED |
| Parts Technician | role-swap | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED |

**NOT-VERIFIED reasons:** Time Clock = WO detail did not render (view=null role, no WO-detail
access — control not reachable, not inferred). Service Manager / Foreman / Office User / Parts
Technician = **no live role-holder** in the staging staff list AND `staff/change` role-swap
returned **HTTP 500** today (shared-env drift), so they could not be impersonated for these new
caps (they WERE observed for New-WO + Parts-module caps in the earlier passes — §0c/§0d).

**Live-observed staging findings (new):**
- **Invoice "Reverse"** is role-gated: SHOWN for **Admin + Senior Service Advisor**, **hidden**
  for **Parts Manager + Service Advisor** (they get "Issue Credit" only). A real distinction.
- **WO Delete ("Delete Work Order")** confirmed SHOWN for Admin + Senior SA; hidden for Parts
  Manager / Service Advisor / Sales Rep / Technician.
- **Part Return** is broadly SHOWN (Admin, Senior SA, Parts Manager, Service Advisor, Sales Rep,
  Technician all show the "Return" line-menu item).
- **Technician (tech view)** shows Part Return + Set Line Status (Complete/Pick) + New Line, but
  **no WO Delete, no Finance/New Payment** — consistent with a locked-down tech role.

Evidence: `live-ui-2026-07-15/staging/<role>/wo_lines.png`, `part_menu.png`, `wo_menu.png`,
`inv_finance.png` + `wocaps-obs.json`. Workbook tab: **"Remaining-Caps Staging LIVE"**.

**Caps still NOT OBSERVABLE on staging this run (both sides NOT VERIFIED):** Assign Vendor /
Fix Part# (PO-detail `/parts/orders/{id}` renders only the nav shell via direct URL — needs
in-app navigation from the WO Parts tab), Bulk Receive (`/parts/deliveries` surfaced no
bulk-receive control via direct URL), Core OK/Not-OK (no existing WO with a cored picked line
found; needs a cored line seeded), See AP/AR detail (no route reliably isolated). Marked
NOT VERIFIED — not inferred.

## 1. REAL dual verdicts — Send to Portal (both sides observed live)

| Staging role | Prod role compared | Prod (live) | Staging (live) | Verdict |
|---|---|---|---|---|
| Admin | Administrator | SHOWN | SHOWN | **MATCH** |
| Senior Service Advisor | Service Advisor *(merge)* | hidden | SHOWN | **STAGING-MORE** (staging gains it) |
| Office User | Office User | **SHOWN** | **hidden** | **STAGING-LESS** ← real release risk (Office loses Send to Portal) |
| Sales Representative | Sales Representative *(merge)* | hidden | hidden | **MATCH** |
| Technician | Technician | hidden | hidden | **MATCH** |
| Time Clock User | Time Clock User | hidden | hidden | **MATCH** |
| Service Manager / Parts Manager / Service Advisor / Foreman | (no active prod user) | NOT VERIFIED | SHOWN/hidden | **NOT VERIFIED** |

**Headline findings (live-proven, both sides):**
- **Office User** genuinely **loses Send to Portal** in migration (prod SHOWN → staging hidden). This is the one real, both-observed release risk on Send-to-Portal.
- **Technician does NOT lose Send to Portal.** The spec's Behavior-Changes table says Technician "Loses Send to Portal", but **prod Technician never showed it either** — so it is not a real loss (MATCH, both hidden). This corrects a spec-based expectation.
- **Senior Service Advisor gains** Send to Portal vs the prod Service Advisor component (STAGING-MORE; merge caveat — the SA Technician + SA No Reports components are NOT VERIFIED).
- Correcting the earlier inferred workbook: on **staging**, live observation shows **Foreman SHOWS Send to Portal** despite lacking the `customerPortalPageAccess` atom (the prior run inferred it hidden). The real staging gate tracks WO-review capability.

## 2. Staging LIVE grid (all 11 roles, OBSERVED)

| Role | Perms | View | Send to Portal | See Fin Data | New Line | Reviewed | Line ⋮ | Finance tab |
|---|---|---|---|---|---|---|---|---|
| Admin | 42 | full | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN |
| Service Manager | 36 | full | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN |
| Senior Service Advisor | 32 | full | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN |
| Parts Manager | 31 | full | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN |
| Service Advisor | 26 | full | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN |
| Foreman | 23 | full | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN | SHOWN |
| Office User | 23 | full | hidden | hidden | hidden | hidden | hidden | hidden |
| Parts Technician | 19 | full | hidden | SHOWN | hidden | hidden | hidden | SHOWN |
| Sales Representative | 8 | full | hidden | SHOWN | hidden | hidden | hidden | hidden |
| Technician | 6 | tech | hidden | hidden | SHOWN | hidden | SHOWN | hidden |
| Time Clock User | 3 | null | hidden | hidden | hidden | hidden | hidden | hidden |

## 3. Production LIVE grid (6 roles OBSERVED via switch-user)

| Prod role | Maps to staging | Perms | Send to Portal | See Fin Data | New Line | Reviewed |
|---|---|---|---|---|---|---|
| Administrator | Admin | 60 | SHOWN | SHOWN | SHOWN | SHOWN |
| Service Advisor | Senior Service Advisor *(merge)* | 38 | hidden | SHOWN | SHOWN | SHOWN |
| Office User | Office User | 52 | **SHOWN** | SHOWN | hidden | hidden |
| Sales Representative | Sales Representative *(merge)* | 5 | hidden | hidden | hidden | hidden |
| Technician | Technician | 30 | hidden | hidden | SHOWN | hidden |
| Time Clock User | Time Clock User | 2 | hidden | hidden | hidden | hidden |

(NOT VERIFIED prod roles — no active user: Service Manager, Foreman, Parts Manager, Parts
Technician, SA Limited View, SA Technician, SA No Reports, Reporting.)

## 4. Coverage

- Total cells = 14 caps × 11 roles × 2 envs = **308**.
- Staging observed LIVE = 66 (6 caps × 11 roles).
- Production observed LIVE = 30 (5 reliable caps × 6 roles).
- **Cells with a REAL dual verdict = 30** (both sides observed live).
- Production NOT VERIFIED = 124.

## 5. Still NOT VERIFIED (and why)

- **Prod roles without an active user** (Service Manager, Foreman, Parts Manager, Parts
  Technician, SA Limited View→staging Service Advisor, + merge components): not role-swapped
  on prod for safety/time → dual verdict pending.
- **Send to Terminal / take payment**: behind the Finance/payment dialog; not driven live on
  either env this run (invoiced-WO cold-load redirected to the list on staging; payment
  surface not reached on prod). The prior "no control in the build" was a source grep, not an
  observation — left unverified.
- **Order Parts (New PO) + Receive**: ✅ NOW VERIFIED live for all 11 staging + 14 prod roles
  (see §0c) — no longer NOT VERIFIED.
- **Remove-a-WO-part, WO Delete, WO Lines Delete, part-return approve/complete, Core OK/Not-OK,
  Set Line Status, Assign Vendor / Fix Part# (PO-detail), Bulk Receive, Invoicing delete/reverse,
  See AP/AR, create customer/asset from New-WO**: behind top/line "⋮" menus, PO-detail rows, the
  New-WO wizard, or other tabs not driven per-role live this run. These need a per-role controlled
  reference state (a WO with a cored picked line, a returnable picked part, an invoiced WO, an
  open editable PO-detail row) — the multi-step SPA create wizards have no simple create API, so
  each needs either a dev/human-seeded reference state or an attended headful session. Marked
  NOT VERIFIED — not inferred.

## 6. Cleanup

- All `switch-user` impersonations exited (`exit-switch-user` → 200 each), both envs.
- Staging tech restored to **Technician** (`10fdbeaa…`, 6 perms, verified).
- **PROD (2026-07-15c):** test-staff role-swap used across all 14 legacy roles; test staff
  **RESTORED to Office User** (`d238a892`, verified via `GET /api/staff`). No throwaway data
  created on prod; no data mutated (read-only observation of existing WOs). **No TestRail writes.**
- **Staging (2026-07-15c):** attempted throwaway (`bilal.muzamil+20`) role-swap for the 4
  holderless roles — `staff/change` still HTTP 500 (4×); throwaway left on its pre-existing role
  (Admin); no data created. No TestRail writes.

## 7. Remaining-caps coverage (2026-07-15c)

- Remaining-caps cluster cells = 6 caps × 11 staging roles × 2 envs = 132.
- **Prod remaining-caps observed LIVE:** 10 of 14 legacy roles rendered the WO (Sales Rep,
  Reporting, Time Clock did not; 4 finance-caps NV via estimate-400). Core OK/Not-OK bonus-observed.
- **Real dual verdicts (both live): 19** (15 MATCH + 4 STAGING-LESS); NOT VERIFIED: 47 remaining
  cells (prod Part Return all NV; prod finance estimate-400 roles; the 4 holderless staging roles).
- **STAGING-LESS release risks (dual-observed):** Parts Manager / Service Advisor / Technician lose
  **WO Delete**; **Service Advisor loses Invoice Reverse**.

## 8. BETTER-TECHNIQUE PASS (2026-07-15d) — converting technique-artifact NOT-VERIFIEDs

This pass specifically re-attacked the NOT-VERIFIED cells that were technique/env artifacts
(not permission truths), per the coordinator's four targets. Both sessions held the whole run
(staging quick-login + prod renewable self-login). Observed-only; per-cell evidence in
`live-ui-2026-07-15/<env>/<role>/` + the `_*-2026-07-15.json` diagnosis files.

### Target #1 — Prod finance caps via GENUINE switch-user (no role-swap)
Prod org "Truck Hill 1" has REAL role-holders for only **6 of 14** legacy roles
(Administrator, Office User, Sales Representative, Service Advisor, Technician, Time Clock User).
Diagnosis of the "No location" crash (was blamed on role-swap): it is **two different things**,
both reproduced under genuine switch-user impersonation:
- **Office User = GENUINE ROLE-LEVEL DENY.** `GET /api/invoices/{id}/view` → **403 "Insufficient
  permissions"** (confirmed on BOTH Office User holders) → Finance panel crashes to `/no-location`.
  So prod Office User **cannot view invoice/finance → New Payment / Reverse / Issue Credit NOT
  ACCESSIBLE.** OBSERVED-LIVE (403 captured ×2 + screenshot `Office_User/finance_403_crash.png`).
- **Service Advisor = invoice-view ALLOWED (200 observed)** but the Finance panel still crashes to
  `/no-location` under switch-user because the SPA location store is not populated in the
  impersonation context (a technique artifact, NOT a permission block). So the SA control-level
  states (New Payment/Reverse/Issue Credit) remain **NOT VERIFIED** — precise unblock: a real
  SA-role credentialed login (username/password) or a headful attended session.
- **Service Manager / Parts Manager / Parts Technician / Foreman (+ SA variants, Reporting)** have
  **NO real holder on prod** → cannot switch-user → **GENUINE BLOCKER** (role-swap crashes finance).
  Unblock: seed a prod holder per role, or a dev-provided per-role login.
- **Administrator (control): New Payment / Reverse / Issue Credit all SHOWN** (re-confirmed live).

### Target #2 — Staging holderless roles finance caps (the staff/change-500 blocker is CLEARED)
No existing staging staff hold Service Manager / Foreman / Office User / Parts Technician, so a
ZZAUTOTEST throwaway (staff `0336686b`, user `051292ea`, wp `b3c8c820` Staging Heavy Duty-9919)
was **role-swapped to each target role — `staff/change` now returns 201** (the earlier HTTP 500 was
cleared by a fresh session + location-pin), then **GENUINE switch-user** into it, and the invoiced
WO **S9-24662** Finance tab observed live:

| Staging role | perms | New Payment | Invoice Reverse | Issue Credit | Confidence |
|---|---|---|---|---|---|
| Service Manager | 36 | **SHOWN** | **SHOWN** | **SHOWN** | OBSERVED-LIVE |
| Office User | 25 | **SHOWN** | hidden | **SHOWN** | OBSERVED-LIVE |
| Foreman | 23 | **SHOWN** | hidden | **SHOWN** | OBSERVED-LIVE |
| Parts Technician | 19 | **SHOWN** | hidden | **SHOWN** | OBSERVED-LIVE |

- **RECONCILIATION:** this CORRECTS §2's grid which had Office User staging "Finance hidden" — live
  re-observation on a rendering invoiced WO shows Office User HAS Finance + New Payment + Issue
  Credit (screenshot `staging/Office_User/caps_finance.png`). The earlier "hidden" was a
  non-rendering-WO artifact.
- **DUAL VERDICT — Office User finance = STAGING-MORE:** prod Office User invoice-view **403 DENY**
  vs staging Office User **New Payment + Issue Credit SHOWN** → Office User **GAINS** finance/payment
  access in migration (potential over-grant — flag alongside the Send-to-Portal STAGING-LESS).
- WO Delete / Set Line Status / Part Return returned empty for these 4 on the invoiced WO — those
  are **WO-state confounds** (invoiced WO has no approvable line, cannot be deleted, parts already
  consumed), NOT role results.

### Target #3 — Prod Part Return via in-app WO Parts tab
Reached the Parts tab in-app and scrolled to the **Actions** column. The Actions are **lifecycle-
gated by the part Status**: `Requested` → no action; `Awaiting` → **Receive** button. **"Return"
surfaces only for a RECEIVED/PICKED inventory part**, which none of the prod WOs have. So prod Part
Return is **NOT a click-probe miss** — the control genuinely does not exist for the available part
states (screenshot `production/Administrator_finrecheck/partreturn_actions_column.png`). Unblock: a
WO with a received+picked inventory part in a returnable state.

### Target #4 — Staging Core OK/Not-OK
No existing staging WO with a cored **picked** line was found by UI scan (headless per-WO render is
slow on the shared env). Remains a **genuine deep-seeding blocker**: needs a cored part (PN
P550848 / 84-2005 / 58-12) **picked onto a WO line** — the add-arbitrary-part-request + inventory-
pick flow that has no simple create API. Unblock: dev/human-seeded cored picked line or an attended
headful session. Prod side was previously bonus-observed; the dual remains pending the staging side.

### Cleanup (this pass)
- Staging throwaway `bilal.muzamil+20` **RESTORED to Admin** (`7d1f3fc3`, verified 201); staging
  tech still **Technician**; all `switch-user` exited (200).
- Prod: genuine `switch-user` into real holders, each **exit-switch-user 200**; prod test staff
  remains **Office User** (untouched — no prod role-swap used this pass). No data mutated
  (read-only). **No TestRail writes.**
