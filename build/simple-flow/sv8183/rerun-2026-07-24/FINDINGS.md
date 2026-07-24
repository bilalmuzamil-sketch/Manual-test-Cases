# Simple Flow SV-8183 — Exhaustive Live Permission Re-Run (§13a) — FINDINGS

- **Date:** 2026-07-24
- **Env:** `app.staging.shopview.com` / `api.staging.shopview.com`, shared org `d55bc308-e61a-438d-b5f1-c7a73c89d49f`
- **Method (Rules 10/12/13/14/15/24/25/26):** role impersonation via `POST /api/switch-user {user_id}` (authentic per-role `fe_permissions` + BE session); UI observed via boot2 hydration (Chromium); BE enforced-vs-not measured by hitting the real endpoints with an empty body — **403 = permission enforced, 400 (missing-param) = permission PASSED (endpoint reached; would succeed with a valid body) = NOT enforced** (no data mutated). Verdicts below are all LIVE-OBSERVED; nothing inferred.
- **Access:** quick-login admin = **200**, fe-permissions = 42 (verified live at start). Cookies OK.

## 1. Role reset / drift (Rule 26)

All 11 system roles were read live BEFORE testing; each derives EXACTLY the §9.2 per-role matrix
from its current atom set → **0-drift, template == spec** for all 11. Because every role already
equals its template default, a UI "Reset To Template" is a no-op (Save stays disabled) — no reset
write required. Re-read AFTER the run: **all 11 unchanged (before == after, no drift)** — my
qa_reassign role cycling changed only a user's assignment, never a role definition.

| Role | atoms | template==§9.2 | Role | atoms | template==§9.2 |
|---|---|---|---|---|---|
| Admin | 42 | MATCH | Parts Manager | 31 | MATCH |
| Service Manager | 36 | MATCH | Parts Technician | 19 | MATCH |
| Senior Service Advisor | 31 | MATCH | Office User | 25 | MATCH |
| Service Advisor | 25 | MATCH | Sales Representative | 8 | MATCH |
| Foreman | 23 | MATCH | Time Clock User | 3 | MATCH |
| Technician | 6 | MATCH | | | |

Before/after atoms: `evidence/roles-before-after.json`.

## 2. Coverage achieved (live-observed this run)

- **Roles reset-verified:** 11/11 (atoms read live).
- **FE observation (boot2, real rendered UI):**
  - Parts → Purchase Orders list: Admin, Office (multi-select + per-row Receive + New PO + selection bar).
  - WO lines/parts page (`/workorders/{id}/lines`, WO S-25992): Admin (baseline), Technician, Sales Rep, Office — top-action buttons (New Line / Send To Review / Complete / Start / Receive / Order / Build Lines) with **true visibility + disabled** detection, plus line kebab menus.
  - Returns page reachability: Office.
- **BE-enforcement probe:** 4 real endpoints × 6 roles = **24 live API observations** (Admin, Technician, Sales Rep, Office, Time Clock, Parts Tech). Endpoints: `POST /api/inventory/orders/accept` (receive), `POST /api/inventory/orders/change-item` (edit PO item / change vendor), `POST /api/work-orders/part/make-request` (add part), `POST /api/work-orders/parts/delete` (remove/cancel part). Raw: `evidence/be-probe-batch1.json`.

## 3. BE-enforcement matrix (403 = enforced; 400 = permission passed / NOT enforced)

| Endpoint (§9.2 gate) | Admin | Technician | Sales Rep | Office | Time Clock | Parts Tech |
|---|---|---|---|---|---|---|
| accept / receive (Order Parts family) | 400 | **403** | **403** | **403** | **403** | 400 |
| change-item (edit / change vendor — §9.2: VOM Create&Edit) | 400 | **403** | 400 | 400 | **403** | 400 |
| part/make-request (add part — §9.2: Pick/WOL) | 400 | 400 | 400 | 400 | 400 | 400 |
| parts/delete (remove/cancel part — §9.2: WOL Create&Edit) | 400 | 400 | 400 | 400 | 400 | 400 |

perms: Admin 42 / Technician 6 / Sales Rep 8 / Office 25 / Time Clock 3 / Parts Tech 19.

## 4. Known-3 re-confirmation (calibration)

- **SV-8515 (Office bulk-receive + cancel/return; "Production blocks these").**
  - *FE:* On the CURRENT build, selecting one/more POs on Parts → Purchase Orders reveals only a
    **Clear** action — there is **NO "Receive Selected" bulk button for ANY role, including Admin**
    (Admin selection new-actions = `["Clear"]`; `evidence/pobtn_admin.json`). For Office the per-row
    **Receive** and **New PO** buttons are **HIDDEN** (`evidence/po_officeuser.png`,
    `pobtn_officeuser.json`).
  - *BE:* `accept` (receive) returns **403 for Office** (and Technician/Sales Rep/Time Clock).
  - → **SV-8515 is NOT reproducible on the current build — the bulk-receive FE path is gone AND the
    receive BE is enforced (403).** Matches SV-8541's own note that SV-8515 is superseded.
- **SV-8516 (Time Clock can edit/cancel/return/change-vendor via app; "Production blocks it").**
  - *BE:* `change-item` (edit part / change vendor) returns **403 for Time Clock** → the edit/
    change-vendor path is now BE-enforced for Time Clock. `accept` also 403.
  - *BUT* `parts/delete` and `part/make-request` still return **400 for Time Clock** → a 3-permission
    no-access role can STILL add and remove/cancel WO parts via the API. So SV-8516's "cancel a part"
    angle (via `parts/delete`) is **still reproducible at the BE**, while its "change vendor / edit
    detail" angle is **fixed (403)**. (FE hides all of these for Time Clock.)
- **SV-8541 (user without WO Line: Create&Edit can return a received special-order part + resolve
  cores; matches Production — "clarification").** The specific return-received-part and resolve-core
  endpoints were NOT located this run (candidate routes 405'd — see §6 uncovered). Since SV-8541 is a
  cross-env clarification that already matches Production, it was not the focus. NOT re-driven live
  this run.

## 5. NEW observations beyond the known 3

Under **Standing Rule 24** (FE-restricted but API-possible is NOT a bug — flag it; user 2026-07-24),
the items below are **FE-gated** (the control is hidden for the role) but **BE-permissive via the
API**. They are therefore **RULE-24 FLAGS (accepted-for-now, not bugs)**, recorded per instruction —
NOT permission-gap bugs (a bug would be FE-reachable + BE-allows for a role that shouldn't; none of
those were found).

- **NEW-1 — `change-item` is BE-gated by `seeFinancialData`, not by `vendorOrderManagementCreateAndEdit`.**
  `change-item` (edit a PO line / change its vendor) returns **400 (permission passed) for Sales
  Representative AND Office User** — both hold `seeFinancialData` but do NOT hold VOM Create&Edit —
  while **Time Clock (no SFD) is correctly 403**. Per §9.2 / SV-8183 action→atom table, *"Assign
  vendor to a vendor-missing PO / merge / keep-separate → Gated by **Vendor & Order Mgmt: Create &
  Edit**"* and *"Cost/sell fields on receive screens → visibility+edit → See Financial Data"*. So the
  BE is applying the **cost-visibility gate (SFD)** to the whole `change-item` action instead of the
  **vendor-management edit gate (VOM C&E)** the spec assigns to vendor/part edits. Consequence: a
  **Sales Representative** (spec: "No" to everything) and an **Office User** (VOM View-only) can edit
  a PO line / change vendor **via the API** even though the FE hides it. The Sales-Rep angle is not
  covered by any of the 3 known tickets. **Verdict: RULE-24 FLAG** (FE hides it; doable via API).
  Evidence: `evidence/be-probe-batch1.json`.
- **NEW-2 — `part/make-request` (add WO part) and `parts/delete` (remove/cancel WO part) are NOT
  BE-enforced for ANY role**, including **Time Clock (3 perms)** and **Sales Rep (no WOL C&E, no
  Pick)** — both return 400 (permission passed). Per §9.2, adding a part follows Pick/WOL and
  removing follows *"WO Lines: Create & Edit"*. This is the atom-collapse Dipesh described (SV-7864,
  Done) surfacing on the part add/delete endpoints. FE hides these controls for the negative roles.
  **Verdict: RULE-24 FLAG** (consistent with the accepted ShopView enforcement model; also underlies
  the still-reproducible "cancel a part" portion of SV-8516).

**FE gates verified WORKING (no exposure) — adversarial re-check (Rule 15):** an initial pass flagged
"Order"/"Receive" as present+enabled for Technician and Sales Rep, but a corrected probe that checks
**true CSS visibility** (display/visibility/opacity/rect/offsetParent), not just the `disabled`
attribute, showed both buttons are **present-in-DOM but HIDDEN (visible=false)** for Technician, Sales
Rep, and Office — the FE gate hides them; a click finds no visible target. **This was a false
positive that the visibility re-check caught — reported here for honesty, not as a finding.**
Evidence: `evidence/vis_*.json`. `accept`=403 for these same roles corroborates the gate at the BE.

## 6. Explicit NEW-issue statement

**No NEW permission BUG was found beyond the known 3.** The two NEW observations (§5 NEW-1, NEW-2)
are **Rule-24 FLAGS** (FE-hidden, BE-permissive-via-API) — recorded per the user's 2026-07-24 rule as
accepted-for-now, not bugs. Materially, the known issues are largely **mitigated on the current
build**: SV-8515 not reproducible (FE path gone + receive BE 403); SV-8516's change-vendor/edit angle
fixed at BE (403 for Time Clock) though its part add/cancel angle persists as a Rule-24 flag.

## 7. What remains uncovered (for resume)

1. **Part-level row kebab actions** (Edit part / Cancel part / Return received part / Change vendor /
   Resolve core OK-NotOK) on a WO parts row — the WO used (S-25992) did not surface part-level action
   kebabs (its line kebabs are line-level: Request part, Edit labor, etc.). Needs a WO seeded with a
   **received special-order part + a pending core** to exercise the exact SV-8516/8541 part-row
   controls FE-side per role.
2. **SV-8541 endpoints** (return-received-special-order-part, resolve-core OK/NotOK) — not located
   (candidate routes 405'd). Capture from Admin network while performing the action on a cored WO.
3. **Dedicated Bulk Receive page** (`/bulk-receive?ids=…`) FE + its accept BE per negative role.
4. **Returns page actions**, **Part Sales actions**, **Vendor Invoices / Vendors pages** per role
   (only Office Returns *reachability* checked, = true/view).
5. **Yes-heavy positive roles** (Service Manager, Senior SA, Foreman, Parts Manager) — covered only
   by atom-derivation + Admin baseline, not individually UI-driven (they should mirror Admin).
6. **cleanup note:** qa_reassign restored to Admin (verified). 3 pending ZZAUTOTEST invitations
   (`zzautotest.officeuser/timeclockuser/partstechnician@shopview.com`) could not be canceled via
   known endpoints — they are pending invites only (never active staff, cannot log in), harmless.
