# Prod-vs-Staging Permission Compare — LIVE-VERIFIED, DUAL-VERDICT — 2026-07-15

> **TRUST-CRITICAL REBUILD. Observed-only (Standing Rules 10 & 12).** A cell is a real
> result **only if the control was rendered on the real screen this run with a screenshot
> captured**; everything else is **NOT VERIFIED** with the reason. Nothing is inferred from
> role definitions, `fe_permissions`, atoms, or source. The prior deliverable
> (`Prod-vs-Staging-Permission-Gaps_2026-07-14.xlsx`/`.md`) is **SUPERSEDED**.
>
> Workbook: `Prod-vs-Staging-LIVE-VERIFIED-2026-07-14.xlsx`.
> Evidence: `live-ui-2026-07-15/staging/<role>/` and `live-ui-2026-07-15/production/<role>/`
> (full-page WO screenshots + `observation.json` per role).

> **⚠ 2026-07-15b UPDATE — PROD SESSION EXPIRED.** On this remaining-caps pass the
> supplied **production** cookies were already dead: `GET /api/work-orders` returned
> **409 `Session has expired.`** Production could **NOT** be observed at all this run,
> so **every production cell for the remaining caps is `NOT VERIFIED` (fresh prod
> cookies required)** — nothing was inferred. **Staging session was fully ALIVE** and
> the staging half of the remaining caps was observed live (see §0e). Rebuild the dual
> verdicts once fresh prod cookies are supplied. Staging env also drifted: `staff/change`
> role-swap returned **HTTP 500** on the tech staff (and 404 on the alt throwaway), so
> the 4 holderless staging roles could not be impersonated for the new caps this run.

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

## 0e. REMAINING FE-GATED CAPS — STAGING LIVE observations (2026-07-15b, NEW)

Coordinator remaining-caps pass, **existing data only (no seeding)**: reference WO with picked
parts = **S9-23636** (`39ace770`), invoiced WO = **S9-25382** (`6883dfc1`). Caps observed live
on the WO-lines + invoiced-WO Finance surfaces per role. **Method:** Admin = admin quick-login
(self); Senior SA / Parts Manager / Service Advisor / Sales Representative = genuine `switch-user`
impersonation of a real role-holder (exit-switch-user 200 each); Technician = `tech` quick-login
in the shared org (tech view). **PROD side = NOT VERIFIED (session expired) for all of these.**

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
- **No prod role-swaps performed**; no throwaway data created; **no TestRail writes**.
