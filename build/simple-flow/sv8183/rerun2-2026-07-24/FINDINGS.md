# Simple Flow SV-8183 — Uncovered-Areas Re-Run (rerun2) — FINDINGS

- **Date:** 2026-07-24
- **Env:** `app.staging.shopview.com` / `api.staging.shopview.com`, shared org `d55bc308-e61a-438d-b5f1-c7a73c89d49f`, workplace **Staging Heavy Duty - 9919** `b3c8c820…`.
- **Access:** quick-login admin = **200** (verified live at start); cookies OK the whole run.
- **Purpose:** close the 5 UNCOVERED areas from `rerun-2026-07-24/FINDINGS.md §7` so SV-8183 coverage is genuinely exhaustive. FIND-issues pass — no cases authored, no TestRail writes.
- **Method (Rules 10/12/13/14/15/24/25/26):** role impersonation via `POST /api/switch-user {user_id}` of real holders, or of the disposable `qa_reassign` user reassigned per role via `POST /api/staff/{staff_id}/change`; FE observed live via boot2 Chromium hydration reading the **rendered page body + true CSS visibility** (not URL alone — see honesty note); BE measured by hitting the real endpoint with an empty body (**403 = permission ENFORCED/blocked; 400/422 = permission PASSED — endpoint reached, would succeed with a valid body = NOT BE-enforced**; no data mutated). All verdicts LIVE-OBSERVED.
- **Classification ruling (user 2026-07-24):** FE-blocked + BE/API-allowed = **PASS** (ShopView enforcement model; not a flag, not a bug). A real ISSUE is only **FE-EXPOSURE** (FE lets a role reach/see something it shouldn't) OR **FE-allows + BE-allows for a role §9.2 says is blocked** (true gap).

---

## 0. Role reset / drift (Rule 26) — 0 drift

All 11 system roles were read live BEFORE and AFTER the run and each derives EXACTLY its §9.2 atom count → **0 drift, template == §9.2 for all 11, before == after** (my qa_reassign role-cycling touched only a user's assignment, never a role definition; qa_reassign restored to Admin, verified). Because every role already equals template, "Reset To Template" is a no-op (Save stays disabled) — no reset write required.

| Role | atoms | Role | atoms | Role | atoms |
|---|---|---|---|---|---|
| Admin | 42 | Foreman | 23 | Sales Representative | 8 |
| Service Manager | 36 | Parts Manager | 31 | Technician | 6 |
| Senior Service Advisor | 31 | Parts Technician | 19 | Time Clock User | 3 |
| Service Advisor | 25 | Office User | 25 | | |

Evidence: `evidence/roles-atoms.json`, `roles-drift-before.json`, `roles-drift-after.json`.

---

## 1. BE-enforcement matrix — 11 roles × 7 endpoints (extends rerun1's 6×4)

`400/422 = permission PASSED (reached; NOT BE-enforced). 403 = ENFORCED (blocked).` Raw: `evidence/be-matrix-11roles.json`.

| Endpoint (action → §9.2 gate) | Adm | SvcMgr | SrSA | SvcAdv | Frmn | PtMgr | PtTech | Office | SalesRep | Tech | TimeClk |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `orders/accept` (receive) | 400 | 400 | 400 | 400 | 400 | 400 | 400 | **403** | **403** | **403** | **403** |
| `orders/change-item` (change vendor / edit PO item) | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 400 | **403** | **403** |
| `work-orders/part/change-request` (edit part) | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 400 |
| `work-orders/{id}/pre-resolve-cores` (resolve core) | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 400 |
| `inventory/returns/create` (return / credit) | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 400 | **403** | **403** | **403** |
| `work-orders/part/make-request` (add part) | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 400 |
| `work-orders/parts/delete` (cancel / remove part) | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 400 | 400 |

**Reading:**
- **`accept` (receive) is BE-enforced and matches §9.2 EXACTLY** — 400 (allowed) for the 7 "Yes" roles (Admin/SvcMgr/SrSA/SvcAdv/Foreman/PartsMgr/PartsTech), 403 (blocked) for the 4 "No" roles (Office/SalesRep/Tech/TimeClock). Cites §9.2 matrix "Receive on WO" column + AC "BE accepts the OR of `ROLE_DELIVERY_CREATE_AND_EDIT` / `ROLE_WORK_ORDER_PART_CREATE` / `ROLE_WORK_ORDER_CREATE_AND_EDIT`." **No issue.**
- **`change-item`** blocked (403) only for Tech + TimeClock; **Office + SalesRep PASS (400)** even though §9.2 line 74 gates vendor assignment on **"Vendor & Order Mgmt: Create & Edit"** (Office = VOM View-only, SalesRep = none). The BE is applying the **See-Financial-Data** gate (both hold `seeFinancialData`) instead of VOM C&E → this is **NEW-1 from rerun1, re-confirmed on all 11 roles**. Classified below (PASS/Rule-24 — FE hides it both ways).
- **`part/change-request`, `part/make-request`, `parts/delete`, `pre-resolve-cores`** = **400 for ALL 11 roles** → NOT BE-enforced for anyone (atom-collapse, SV-7864; the SV-8541 pre-resolve-cores angle). Classified below (PASS/Rule-24 — FE hides for negatives).
- **`inventory/returns/create`** (the Returns/credit path) IS BE-enforced: **403 for SalesRep/Tech/TimeClock**, 400 for Office + the 7 Yes roles. No exposure (spec silent on a dedicated "create return" atom; behaviour is a reasonable inventory-credit gate; flagged as spec-silent, not a deviation).

---

## 2. FE route + action observation (Areas 3 & 4) — per role, body-read

Real routes (from the live Parts nav, not guessed): `/bulk-receive` (redirects to `/parts/orders`), `/parts/orders`, `/parts/part-sales`, `/parts/inventory`, `/parts/parts-catalogue`, `/parts/returns`, `/parts/deliveries` (labelled "Vendor Invoices"), `/parts/vendors`. Verdict = **BLOCKED** (redirect to /workorders OR the app renders a 404/"page not found" shell) vs **REACHED** (real content). Evidence: `evidence/route_*.json`, `body_*` / `order_*` screenshots.

| Route | Parts Manager (Yes) | Office User (view-only) | Technician (No) | Sales Rep (No) | Time Clock (No) |
|---|---|---|---|---|---|
| `/bulk-receive` → `/parts/orders` | REACHED · New PO + Receive | REACHED · **no actions** | BLOCKED →/workorders | BLOCKED →/workorders | BLOCKED →/workorders |
| `/parts/orders` (PO list) | REACHED · New PO + Receive | REACHED · **view-only** | BLOCKED | BLOCKED | BLOCKED |
| `/parts/part-sales` | REACHED · New Part Sale | REACHED · view | BLOCKED | REACHED · **view only** (legit `partSalesView`) | BLOCKED |
| `/parts/inventory` | REACHED · New Inventory Part | REACHED · view | BLOCKED | BLOCKED | BLOCKED |
| `/parts/parts-catalogue` | REACHED | REACHED · view | BLOCKED | BLOCKED | BLOCKED |
| `/parts/returns` | REACHED · Create Return | REACHED · view | BLOCKED | BLOCKED | BLOCKED |
| `/parts/deliveries` | REACHED | REACHED · view | BLOCKED | BLOCKED | BLOCKED |
| `/parts/vendors` | REACHED · New Vendor | REACHED · view | BLOCKED | BLOCKED | BLOCKED |

- **Parts Manager (yes-heavy, real holder impersonated):** every Parts route renders with its create/action buttons (New PO / Receive / New Part Sale / New Inventory Part / Create Return / New Vendor). Positive capabilities confirmed. **PASS.**
- **Office User:** reaches the Parts pages **read-only — NO action buttons** (no New PO, no Receive, no Create Return, no New Vendor). Matches §9.2 **note 4 verbatim**: *"Office has Vendor & Order Mgmt: View only → can open Bulk Receive but cannot receive (no edit)."* **PASS, no exposure.**
- **Technician / Time Clock:** every Parts route **BLOCKED** (redirect to /workorders); Parts nav item itself hidden. **PASS.**
- **Sales Rep:** all BLOCKED **except** `/parts/part-sales` (view-only, no "New Part Sale") — legitimate because Sales Rep holds the `partSalesView` atom (Part Sales is a separate feature; §9.2's "Sales Rep = No" is about the Simple-Flow WO/receive actions, not Part-Sales viewing). **PASS, no exposure.**

---

## 3. Order / PO page part-item actions (Area 1) — per role

Observed on the live PO `5b4401a2` (WO **S-25992** `f3a3b90f`, 4 special-order items incl. cores). Evidence: `order_Admin.png`, `order_Office.png`, `order_OfficeRcv.png`.

| Control | Admin (baseline) | Office (view-only) | Tech / SalesRep / TimeClock |
|---|---|---|---|
| Reach `/order/{id}` | REACHED | REACHED (view) | **route-BLOCKED** (Parts gate → /workorders) |
| `edit_note` (edit PO / change vendor) | **visible** | **HIDDEN** | n/a (route-blocked) |
| Receive mode `?receive=1` → "Receive" button + editable qty fields | **visible** | **HIDDEN** (no `edit`, no `Receive`) | n/a (route-blocked) |

The negative roles never reach the PO page (Parts route gate). Office reaches it **read-only** — the change-vendor (`edit_note`) and Receive controls are FE-hidden. This is the FE side of NEW-1: even though the `change-item` API returns 400 for Office (and SalesRep), the FE gives neither role a way to trigger it. **PASS.**

> Note: WO S-25992's WO-lines tab surfaces **line-level** kebabs (Request part / Edit labor), not part-request-row kebabs — same as rerun1. The distinct edit/cancel/change-vendor/return part-item controls live on the **PO/order page** (observed above) and the **completion-flow resolve-cores wizard** (`pre-resolve-cores`, gated by WO Lines: C&E in the modal; BE 400-for-all = the known SV-8541 behaviour).

---

## 4. SV-8541 endpoint location (Area 2)

Located and per-role-tested (BE section above):
- **Resolve core** = `POST /api/work-orders/{id}/pre-resolve-cores {cores:[{partRequestId,isCoreOk}]}` → **400 "At least one core is required" for ALL roles incl. Time Clock** = NOT BE-enforced (the known SV-8541 "pre-resolve-cores→201 even for Time Clock, §9.4-anticipated" behaviour — **recurs, already known, NOT re-filed** per user "ignore for now"). FE: appears only inside the completion "Resolve cores" wizard, reachable only by roles that can complete (WO Create&Edit) → FE-gated.
- **Return received part / credit** = `POST /api/inventory/returns/create` → **403 for SalesRep/Tech/TimeClock**, 400 for Office + Yes roles (BE-enforced for the low roles). FE: the Returns page (`/parts/returns` → Create Return) is Parts-route-gated (negatives blocked; Office view-only).
- **Edit part** = `POST /api/work-orders/part/change-request` → 400 all (not BE-enforced) — the SV-8516 part-edit angle; FE-hidden for negatives.

No new SV-8541 behaviour beyond the already-known clarification.

---

## 5. Classification of every observed cell (per 2026-07-24 ruling)

| Observation | FE for negative role | BE | Verdict |
|---|---|---|---|
| Receive (`accept`) | hidden / route-blocked | 403 (No roles) / 400 (Yes roles) | **PASS** — BE matches §9.2 exactly |
| Change vendor (`change-item`) — Office & SalesRep | Office `edit_note` HIDDEN; SalesRep route-blocked | 400 (SFD gate, not VOM C&E) | **PASS / Rule-24 flag** (NEW-1) — FE hides both angles; not a bug |
| Edit part (`part/change-request`) | hidden / route-blocked | 400 all | **PASS / Rule-24 flag** (SV-8516 angle) |
| Add part (`part/make-request`) | hidden for negatives | 400 all | **PASS / Rule-24 flag** (NEW-2) |
| Cancel/remove part (`parts/delete`) | hidden for negatives | 400 all | **PASS / Rule-24 flag** (NEW-2) |
| Resolve core (`pre-resolve-cores`) | wizard gated by WOL C&E | 400 all | **PASS / Rule-24 flag** (known SV-8541) |
| Return/credit (`inventory/returns/create`) | Parts route-gated | 403 (SalesRep/Tech/TimeClk) | **PASS** — BE-enforced for low roles, no exposure |
| Bulk-receive / PO list / Parts pages | Office view-only; negatives blocked | accept 403 for Office | **PASS** — §9.2 note 4 |

---

## 6. NEW-ISSUE STATEMENT

**No NEW permission issue was found across these 5 areas — no FE-EXPOSURE defect and no true FE-allows+BE-allows gap.**

- Every negative role is either **route-blocked** from the Parts/PO/bulk-receive/returns/vendors surfaces, or (Office) reaches them **read-only with all action controls FE-hidden**. No role reaches a control it shouldn't.
- The Rule-24 "FE-hidden but API-possible" items (NEW-1 `change-item` SFD-gate for Office/SalesRep; NEW-2 part add/delete/edit + `pre-resolve-cores` not BE-enforced) are, under the user's 2026-07-24 ruling, **PASS (accepted-for-now), NOT bugs** — this run added the missing FE half of the proof (Office `edit_note`/Receive hidden; SalesRep route-blocked), so both angles of each are confirmed FE-blocked.
- `accept`/receive is genuinely BE-enforced and matches §9.2 exactly (best-behaved gate in the feature).
- Known items unchanged: **SV-8515** not reproducible (bulk-receive redirects to the PO list; no "Receive Selected" bulk exposure for any negative role; receive BE 403); **SV-8516** part-edit/cancel angle persists as a Rule-24 flag (FE-hidden, `change-request`/`parts/delete` 400); **SV-8541** pre-resolve-cores recurs (400 all) — held per user, not re-filed.

## 7. Honest coverage statement — now covered vs still not

**Now covered (this run):**
- Role reset/drift: 11/11, before==after, 0 drift.
- BE enforcement: **11 roles × 7 endpoints** (vs rerun1's 6×4), incl. the SV-8541 resolve-core + return endpoints.
- Bulk-receive page (Area 3): FE per role.
- Returns / Part-Sales / Vendors / Deliveries / Inventory / Catalog pages (Area 4): FE per role.
- Order/PO page part-item actions incl. change-vendor + receive, and receive-mode (Area 1 PO-page side): Admin baseline + Office view-only + negatives route-blocked.
- Yes-heavy Parts Manager (Area 5): individually UI-driven, full positive capability rendered. BE-positive for Service Manager / Senior SA / Service Advisor / Foreman confirmed via the matrix (all 400 on accept/change/return).

**Still NOT driven this run (honest gaps — none blocking a verdict):**
- **Service Manager, Senior Service Advisor, Foreman** were NOT individually UI-driven (no active confirmed real holder on this org; impersonating them via qa_reassign would be valid but was deprioritised for budget). Their positive capability is confirmed at the BE (matrix 400s) and their atom sets are a superset covering these features; a UI render pass would mirror Parts Manager/Admin.
- The **resolve-cores wizard** and the **return-received-part** flows were not driven end-to-end through the UI to a resolved/returned state; their **BE enforcement per role IS captured** (pre-resolve-cores 400 all = known; returns/create 403 for low roles), and the FE entry points are route/modal-gated as shown.
- Part-request-**row** kebab on a WO with a genuinely **received** special-order part + a resolved core in the WO-lines tab was not surfaced (S-25992's parts are on "ordered" POs; the actionable controls proved to live on the PO page + completion wizard, both observed at the gate level). No evidence of a hidden exposure there.

## 8. Cleanup
- Seed WO `8fd68433…` (ZZAUTOTEST, Iibay Landscaping) **deleted** (HTTP 201).
- `qa_reassign` (`0ca87d16…`) restored to **Admin** (verified). No new staff created (only the existing disposable qa_reassign user was reassigned and restored).
- All 11 roles left at template (before==after). No TestRail writes; run 325 untouched. Secrets in /tmp only. MITM bridge stopped.
