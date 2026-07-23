# SV-8183 Simple Flow Permissions — Live Staging VIU Summary (2026-07-23)

Epic SV-7301 · Story SV-8183 (Permission mapping) · PO Milos · env `app.staging.shopview.com` /
`api.staging.shopview.com` · org `d55bc308-e61a-438d-b5f1-c7a73c89d49f` (SHARED, 10 locations).
Cases: SF-PERM-01..10 + SF-REV-09 (group-C). Method: Standing Rules 10/12/13/14 —
observed live with evidence, never inferred; where an element-level control could not be
re-observed this run it is stated plainly (NOT claimed verified).

## Access
Fresh user-supplied cookies authenticate: `POST /api/quick-login {key:'admin'}` = 200
(also tech = 200). Cookies in `/tmp/fd-tickets/cookies.env` only (never committed).

## Live 11 role IDs (org d55bc308)
Admin 3f2a106c · Service Manager ca2b0818 · Senior Service Advisor b7e0b1eb · Service Advisor
381865c9 · Foreman a9328e5c · Technician 50bf6a0d · Parts Manager ca64dbeb · Parts Technician
c7444560 · Office User d704c465 · Sales Representative 6134f700 · Time Clock User e35b0211.
(Full list: role-ids.txt.)

## Tech baseline (answers the pending cross-project question)
`tech@shopview.com` (user a7fd0a88) holds role **"Technician" (50bf6a0d)**. The USER reset it via
"Reset To Template" earlier today → canonical 6 perms: customersView, scheduleView, woPickParts,
woTechViewMode, workOrderLinesCreateAndEdit, workOrdersView. **This is the authoritative Tech
baseline.** (This session never modified Tech.)

## Requirement A — Reset all 11 roles to template + drift + spec check (LIVE)
- **Drift: 0 at capture.** Each role's live fe_permissions == its template's fe_permissions
  (GET /api/roles/{id} vs GET /api/role-templates/{template_id}/fe-permissions). All 11 clean;
  the only role that had been over-granted (Technician) was already reset by the user. **No reset
  writes were needed / made** (would be a no-op). Data: role-current-vs-template.json.
- **Template defaults == SV-8183 §9.2 matrix EXACTLY (0 deviations)** — truth-table derivation
  (Rule 15) diffed vs §9.2; findings: NONE. Data: template-vs-spec92.json,
  ROLE-RESET-AND-DRIFT-FINDING.md.
- ⚠️ **CONCURRENCY:** ~30 min after the 0-drift snapshot, the **Technician role RE-DRIFTED**
  (another actor added settingsFinance + settingsParts + workOrdersCreateAndEdit → 9 perms). NOT
  caused by this session. Recommend the user re-assert "Reset To Template" on Technician. Evidence:
  technician-redrift-2026-07-23.json. (This is the two-actor shared-env hazard flagged in CLAUDE.md.)

## Live 11-role completion / permission matrix (composition, LIVE via template==spec)
Y/N derived from each role's TEMPLATE-default atoms (verified == §9.2). Gates: Complete =
workOrdersCreateAndEdit + woFullViewMode + workOrderLinesCreateAndEdit.

| Role | EditSet | Complete | Pick | Order/PO | Recv-WO | Bulk | AssignV | FixPN | AddVendorless | MarkReviewed |
|---|---|---|---|---|---|---|---|---|---|---|
| Admin | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| Service Manager | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| Senior Service Advisor | - | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| Service Advisor | - | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| Foreman | - | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| Technician | - | No | Y | - | - | - | - | - | No | No |
| Parts Manager | - | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| Parts Technician | - | No | Y | Y | Y | Y | Y | Y | No | No |
| Office User | Y | No | - | - | - | - | - | - | - | No |
| Sales Representative | - | No | - | - | - | - | - | - | - | No |
| Time Clock User | - | No | - | - | - | - | - | - | - | No |

This matches SF-PERM-10/§9.2 exactly.

## BE enforcement — LIVE via switch-user impersonation of real role-holders
`POST /api/organizations/settings/change` (idempotent, same values), per holder:
| Role (holder) | settingsApp | settings/change |
|---|---|---|
| Admin | true | **200** allowed |
| Senior Service Advisor | false | **403** deny |
| Service Advisor | false | **403** deny |
| Technician | false | **403** deny |
| Sales Representative | false | **403** deny |
| **Parts Manager** | false | **200 ALLOWED** ← finding |

**BE-vs-FE finding (SF-PERM-01 / SF-PERM-06):** the WO-settings BE endpoint is gated by the
**whole settings family**, NOT `settingsApp` specifically. Parts Manager (clean system role,
template_slug parts_manager, has settingsParts/settingsFinance but NOT settingsApp) gets **200**.
Roles with NO settings permission (Sr SA, SA, Technician, Sales Rep) correctly get **403** (BE
DOES enforce). The FE settings *route* is still `settingsApp`-gated (Parts Manager cannot reach
the WO Settings page — confirmed live below), so the user-facing gate is correct; only SF-PERM-01
expected-result #3's tester wording ("backend rejects a save by a role lacking App Settings") is
**imprecise** and should be refined. Evidence: be-settings-probe.json.

## FE route-guard gates — LIVE (boot2 + TLS-terminating MITM)
Final URL after navigating each route (ALLOWED = stayed; ->x = router redirected = denied):
| Role | nav shown | /administration/settings | /parts/orders | /reports |
|---|---|---|---|---|
| Admin | (all) | ALLOWED (settings route granted) | ALLOWED | ALLOWED |
| Senior Service Advisor | WO,Sched,Cust,Parts | ->workorders (denied) | ALLOWED | ->workorders |
| Service Advisor | WO,Sched,Cust,Parts | ->workorders (denied) | ALLOWED | ->workorders |
| Parts Manager | +Reports | ->workorders (denied) | ALLOWED | ALLOWED |
| Technician | WO,Sched,Cust | ->workorders (denied) | ->workorders (denied) | ->workorders |
| Sales Representative | WO,Cust,Parts,Reports | ->workorders (denied) | ->workorders (denied) | ALLOWED |

All consistent with §9.2. (`/parts/bulk-receive` direct-URL gave a timing false-positive
"ALLOWED" for Technician/Sales-Rep — disregarded; `/parts/orders` and `/bulk-receive` correctly
deny them.) Evidence: fe-route-probe.jsonl, screenshots/technician-settings-REDIRECTED-to-workorders.png.

## Element-level re-observation (2026-07-23, LATEST — closes the element gap)
The WO-detail location-desync was UNBLOCKED (each session opens a WO in its OWN location scope →
no bounce). Element-level controls were then re-observed LIVE this run: see
`element-reobserve/element-matrix.json` + screenshots `complete-<role>.png` / `markrev-<role>.png`.
Method: GENUINE switch-user impersonation of REAL role-holders (Admin/SrSA/SA/PM/SalesRep/Technician);
fe-permission-set render (admin backend session + role's live template fe_permissions, no location
bounce) for the 5 roles with NO live holder (Service Manager/Foreman/Parts Tech/Office/Time Clock;
staff-provisioning is email-invite-gated = unavailable unattended). All observed WOs read-only.
- **Complete-WO CTA cluster (SF-PERM-02/10):** CAN (cluster present) = Admin/SrSA/SA/PM (genuine) +
  SM/Foreman (render); CANNOT (read-only) = Sales Rep (genuine) + Parts Tech/Office/Time Clock
  (render). 10/11 match §9.2. Technician cell only: role concurrently DRIFTED (holds
  workOrdersCreateAndEdit now) → shows cluster; baseline No-negative not cleanly observable this run.
- **Mark Reviewed button (SF-PERM-04/07/08/REV-09):** on the SAME markable WO S9-25963 — ENABLED for
  SrSA/SA/PM (genuine, hold Review Work Orders); DISABLED for Sales Rep (genuine) and Technician
  (genuine, lacks Review even while drifted). Gate = woReviewWorkOrders, live-confirmed.
- **Add-vendorless sell field (SF-PERM-09):** NOT cleanly re-observed — the only qualifying negative
  role (baseline Technician, line-edit without See Financial Data) is drifted to hold seeFinancialData
  and cannot be re-seeded unattended; Technician-negative element CARRIED (2026-07-13), not claimed
  verified this run.

## ⚠️ Concurrency: Technician ROLE drift at observation time
The Technician role (50bf6a0d) live atoms this run = 14 incl. workOrdersCreateAndEdit + seeFinancialData
+ settingsApp/Finance/Parts + invoicingPaymentsCreateAndEdit + seeApArData (baseline = 6). NOT reset
(a concurrent session is using it). This contaminates only the Technician-specific negatives for
SF-PERM-02/10 (complete) and SF-PERM-09 (add-vendorless); the Technician Mark-Reviewed negative is
unaffected (drift did not add woReviewWorkOrders) and was observed DISABLED live.

## Per-case verdicts
Legend: **VIU-Verified** = live-observed. Element-level controls were re-observed live 2026-07-23
(above); any residual carried element evidence is from the **2026-07-13 / 2026-07-10** passes
(NOT 2026-07-20 — provenance corrected). Where a specific role's element is drift-blocked this run
it is called out explicitly.

- **SF-PERM-01** (only App-Settings roles view/modify WO settings; non-admin blocked; BE rejects)
  — **VIU-Verified (FE)** live: Technician + Sr SA + SA + Parts Manager + Sales Rep all REDIRECTED
  from the settings route; admin allowed. **BE nuance/DEVIATION**: BE `settings/change` = settings-
  family gate, so Parts Manager gets 200 (see finding). → **needs a wording refinement** to
  expected #3. Statuses of roles with NO settings perm correctly 403.
- **SF-PERM-02** (which roles can complete) — **VIU-Verified (element re-observed 2026-07-23)**.
  Complete-WO CTA cluster observed live per role for 10/11 (Admin/SrSA/SA/PM genuine + SM/Foreman
  render = CAN; SalesRep genuine + PartsTech/Office/TimeClock render = CANNOT) == §9.2. Technician
  cell drift-blocked (see Concurrency); baseline No-negative carried 2026-07-13.
- **SF-PERM-03** (which roles Bulk Receive) — **VIU-Verified (composition + partial FE route)**.
  Parts nav + /parts/orders allowed for Sr SA/SA/PM; denied for Technician/Sales Rep — matches.
  Office view-only (no holder to observe element).
- **SF-PERM-04 / SF-PERM-07 / SF-PERM-08 / SF-REV-09** (Mark Reviewed gated by Review Work Orders;
  self-review allowed) — **VIU-Verified (element re-observed 2026-07-23)**. On the SAME markable
  ready_for_review WO S9-25963: 'Mark Reviewed' ENABLED for SrSA/SA/PM (genuine holders, hold
  woReviewWorkOrders) and DISABLED for SalesRep (genuine) + Technician (genuine, lacks Review even
  while drifted) — gate live-confirmed. Self-review = allowed (reviewer≠completer NOT enforced;
  Milos/OQ-1 resolved). SM/Foreman hold the perm (composition); PartsTech/Office/TimeClock read-only.
- **SF-PERM-05** (PO Receive hidden for office/readonly = Order Parts) — **VIU-Verified
  (composition + FE route)**. Technician + Sales Rep denied /parts/orders live; Order-Parts atom
  absent for Office/Sales Rep/Time Clock == §9.2. Office-specific button element not observed (no
  Office holder in the org).
- **SF-PERM-06** (BE-vs-FE gating; app blocks / backend allows) — **VIU-Verified (settings BE
  portion, LIVE)** + refined: BE **enforces** the settings atom-family (403 for no-settings roles;
  the collapse means completion/review atoms are NOT BE-enforced per Dipesh's 10/Jul comment +
  the documented atom collapse). The completion/review BE-200-gap was NOT re-driven this run (would
  complete a real WO — side-effect; carried from spec + prior). Parts Manager settings 200 = the
  new BE-scope nuance above.
- **SF-PERM-09** (Technician cannot add vendorless part = lacks See Financial Data) — **element
  NOT cleanly re-observed 2026-07-23 (drift-blocked)**: the Technician role is concurrently drifted
  to HOLD seeFinancialData, and no other available holder has line-edit-without-seeFinancialData;
  a clean baseline-Technician holder cannot be seeded unattended (staff provisioning email-gated).
  Sell-price field (input_workorder_part_sell_price) exists in the New Part Request dialog (build
  fact). Technician element-negative CARRIED from 2026-07-13; NOT claimed element-verified this run.
- **SF-PERM-10** (per-role completion matrix) — **VIU-Verified (element re-observed 2026-07-23)**;
  Complete-WO CTA cluster observed live for 10/11 roles matching the §9.2 table above (Technician
  cell drift-blocked, carried 2026-07-13). See element-reobserve/element-matrix.json + screenshots.

## SV-8183 status note
SV-8183's own Jira status is "Blocked", but the permission BEHAVIOR is functionally present on
staging: role templates == spec §9.2, BE enforces the settings atom-family, FE route guards deny
correctly per role. No broken/erroring permission behavior observed. The one substantive gap is
the BE settings-family scope (Parts Manager) noted above.

## Wording corrections / TestRail follow-up (NONE pushed — hold for authorization)
- **SF-PERM-01** expected: **REFINED locally 2026-07-23** in the case source. Tester-facing expected
  reworded (Rule 9, plain) to the page-reachability truth — only App-Settings roles can open/change
  the WO settings page; a role that cannot open the page cannot save changes. The BE driver moved to
  metadata (viu_note): POST /api/organizations/settings/change is gated by the SETTINGS ATOM-FAMILY
  (a clean Parts Manager with settingsParts/settingsFinance gets HTTP 200; no-settings roles get 403),
  while settingsApp gates the FE settings PAGE/route. This needs an `update_case` — **PENDING user
  authorization (not pushed).** All other cases' wording remains accurate to the live build.

## Env cleanup
- Tech user NOT modified by this session (verified). No ZZAUTOTEST staff or roles were created
  (fresh-staff creation needs an email-invite flow, not available unattended; per-role observation
  used **switch-user impersonation of existing real holders** — ephemeral admin sessions, nothing
  persisted). No role definitions changed by this session. Only writes: idempotent
  `settings/change` with identical values on authorized sessions (no-op). Run 325 untouched. No
  TestRail writes.
- ⚠️ Technician **role** re-drifted by another actor mid-session (see Concurrency above) — user
  should re-assert Reset To Template on Technician.

## Evidence index (build/simple-flow/viu-sv8183-2026-07-23/)
role-ids.txt · roles-live.json · role-perms-live.json · role-current-vs-template.json ·
template-vs-spec92.json · ROLE-RESET-AND-DRIFT-FINDING.md · be-settings-probe.json ·
fe-route-probe.jsonl · technician-redrift-2026-07-23.json · HARNESS-NOTES.md ·
screenshots/ (technician-settings-REDIRECTED-to-workorders.png, admin-workorders-list.png).
