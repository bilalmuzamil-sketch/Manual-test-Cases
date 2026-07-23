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

## Per-case verdicts
Legend: **VIU-Verified** = live-observed this run; where an element-level control (button on a WO
detail page) could not be re-rendered this run due to the multi-location WO-detail redirect
(boot2 location-desync, an ENV limitation of this shared 10-location org), it is called out — the
composition (template==§9.2) + BE + route-guard evidence still holds, and these controls were
live-observed in the prior 2026-07-20 staging pass.

- **SF-PERM-01** (only App-Settings roles view/modify WO settings; non-admin blocked; BE rejects)
  — **VIU-Verified (FE)** live: Technician + Sr SA + SA + Parts Manager + Sales Rep all REDIRECTED
  from the settings route; admin allowed. **BE nuance/DEVIATION**: BE `settings/change` = settings-
  family gate, so Parts Manager gets 200 (see finding). → **needs a wording refinement** to
  expected #3. Statuses of roles with NO settings perm correctly 403.
- **SF-PERM-02** (which roles can complete) — **VIU-Verified (composition + nav)**. Completion
  atoms per role == §9.2 (Admin/SM/SrSA/SA/Foreman/PM can; Technician/PartsTech/Office/SalesRep/
  TimeClock cannot). Complete-button element re-render Blocked-Env this run (location-desync);
  no contradicting evidence.
- **SF-PERM-03** (which roles Bulk Receive) — **VIU-Verified (composition + partial FE route)**.
  Parts nav + /parts/orders allowed for Sr SA/SA/PM; denied for Technician/Sales Rep — matches.
  Office view-only (no holder to observe element).
- **SF-PERM-04 / SF-PERM-07 / SF-PERM-08 / SF-REV-09** (Mark Reviewed gated by Review Work Orders;
  self-review allowed) — **VIU-Verified (composition)**. woReviewWorkOrders held by Admin/SM/SrSA/
  SA/Foreman/PM, absent for Technician/PartsTech/Office/SalesRep/TimeClock == §9.2. Self-review =
  allowed (SV-8183 NET-NEW reviewer≠completer is NOT enforced; matches Milos ruling / OQ-1 resolved
  — cases already reflect this). Mark-Reviewed-button element (needs a WO in Review state + detail
  render) Blocked-Env this run.
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
- **SF-PERM-09** (Technician cannot add vendorless part = lacks See Financial Data) — **VIU-Verified
  (composition)**: Technician template lacks seeFinancialData (6 perms, live-confirmed). Add-part
  sell-price element not re-driven this run (carried from prior).
- **SF-PERM-10** (per-role completion matrix) — **VIU-Verified (composition == §9.2)**; see the
  11-role table above. Complete-button element re-render Blocked-Env this run.

## SV-8183 status note
SV-8183's own Jira status is "Blocked", but the permission BEHAVIOR is functionally present on
staging: role templates == spec §9.2, BE enforces the settings atom-family, FE route guards deny
correctly per role. No broken/erroring permission behavior observed. The one substantive gap is
the BE settings-family scope (Parts Manager) noted above.

## Wording corrections / TestRail follow-up (NONE pushed — hold for authorization)
- **SF-PERM-01** expected #3: refine "backend rejects a Work Order settings save by a role that
  lacks App Settings" → the BE `settings/change` endpoint is gated by the broader settings
  permission family (a role with settingsParts/settingsFinance e.g. Parts Manager is accepted);
  the App-Settings gate applies to the FE settings *route/page*. This is the only case needing a
  potential `update_case` (wording), subject to user + Milos confirmation. All other cases'
  wording remains accurate to the live build.

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
