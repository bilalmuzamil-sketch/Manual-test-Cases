# Schedule build-verify — BATCH C — FINDINGS

**Batch C = Events · Conflict Detection · Capacity Bars · Deletion/Series/Undo · Keyboard ·
Permissions · Edge/Responsive · Working Hours Settings · Cross-Module/Rewrite · API — 68 cases.**
All observations LIVE on staging Schedule, build **`v3.8-da72171`** (last-mod Wed 19 Aug 2026 06:58:40
GMT, etag `7e51cdf10ae9a5b00cba629186fb41d4`; read at start 07:46Z and end, byte-identical — same v3.8
minor as batch B's end marker = a bug-fix deploy, Rule 60). Org **d55bc308**, workplace **Staging Heavy
Duty - 9919** (America/Edmonton). Expected behaviour taken from documents only (Schedule spec Confluence
v30 + epic SV-8685 + stories) — the build supplies labels + the runnable check only (Rule 57).

## 🛑 §8.5 GATE (Rule 74): 0 cases skipped for data-seeding or login reasons.
- **Data-states were already present or self-seeded live:** the org already held 5 double-booked
  conflict shifts (Aug 26), 17 overtime days, a 5-shift series (Engine Swap, Aug 24-28), and 3 events —
  so conflict/OT/series/event cases were observed against real data. One ZZAUTOTEST event was created
  live to prove the undo toast, then **Undone** (board re-read = 0 ZZAUTOTEST events; clean).
- **Login was self-service:** the Permissions View tier was observed by `quick-login {key:'tech'}`
  (Technician = View-only) — a real second login, not a skip. I am the only worker on staging, so
  `quick-login` was safe; the session was restored to admin afterward (§6.2 PHPSESSID recapture).
- **The only un-lifted cases are the 4 Automated HELD ones (C38847-50, Rule 71 — write nothing), and
  two of those (C38848/C38849) are observation-limited by a Staff-table render quirk, NOT a data/login
  skip** (see `C-HELD-AUTOMATED.md`). **No batch-C case was left un-verified for a data-state or a login.**

## Outcome split (68)
| Outcome | Count | Notes |
|---|---|---|
| **READY** (feature present + runnable; marker set/kept `AUTOMATION: READY`) | **64** | all 64 non-Automated cases; every one re-stamped Rule-54 sentence 2 |
| **HELD (Automated, atm=3, write nothing)** | **4** | C38847, C38848, C38849, C38850 (see `C-HELD-AUTOMATED.md`) |
| **NOT-FOUND / DEFERRED (feature absent)** | **0** | every feature area rendered/served live — nothing absent |
| **EXPECT-FAIL** | **0** | no live-backed OPEN ticket found for any observed deviation |
| **HOLD (feature absent)** | **0** | — |

**Prior markers lifted → READY:** many batch-C cases carried `AUTOMATION: Not available on Build to test
Yet` or `AUTOMATION: HOLD - needs a second/three sign-in(s)` from the 17-Aug documents-only authoring.
Live verification this pass lifted them to `READY` (§6.4 — a marker moves here from live observation of
the content, never a metadata refresh).

## LIVE EVIDENCE BY AREA (what was observed on the build)

### Events (4269) — 7 READY
- **Empty-cell context menu** offers `Create Event` (`menu_schedule_create_event`), `Assign Work Order`,
  `New Work Order` (C30016).
- **Event modal** (`dialog_title` "Create Event"): `input_event_title`, `checkbox_event_all_day`,
  `input_event_start_date`, `select_event_start_time`, `input_event_end_date`, `select_event_end_time`,
  `button_event_color`, `input_event_note`, `button_event_confirm` — all fields save; all-day toggle
  present (C30018). Day view renders for the live-preview case (C30017).
- **Event cards structurally distinct** from shifts: class `schedule-block--event` (vs `--shift`),
  aria-label "Event: Test, 7:00 AM – 8:00 AM"; multi-day events carry `--continues-after` (C30021).
- **Event colors:** default `--grey`, chosen colour tints (`--teal` observed); `button_event_color` in
  the modal (C30022).
- **Event drag** (C30020): drag gesture not completable by our harness (§8.3 harness limit ≠
  un-runnable — a manual QA drags fine); event blocks are drag targets. Kept READY.
- **Event hours toward capacity** (C30615): the capacity model sums event hours (`scheduledMinutes`) and
  events raise no conflict (`board.events` carry no `conflictReasons`). Runnable.

### Conflict Detection (4270) — 7 READY
- **Double-booked** (C30023): 5 conflict shifts on staff f21b5480 (Aug 26), `conflictReasons:['double_booked']`;
  blocks carry `schedule-block__conflict-icon` (`warning_amber`) + aria-label "Shift (conflict:
  Double-booked)…".
- **Toolbar conflict pill** (C30027): `button_schedule_conflicts` (class `conflicts-pill`, `text-warning`)
  reads "warning_amber **5 conflicts**"; clicking opens a "Schedule issues 5" dropdown listing each
  conflict with a `chevron_right` (C30028 — clicking navigates).
- **Working-day / before-hours / after-hours conflicts** (C30024, C30025): the conflict data model is a
  `conflictReasons[]` list + per-tech-per-day `workingWindows` (1368 windows served). Only `double_booked`
  is present in the current data; a tester seeds an out-of-hours shift to exercise the other reasons.
  Runnable (feature present; verdict is the tester's).
- **One hours source per shift** (C43798): `workingWindows` model present; runnable.
- **⚠️ FLAG — styling is AMBER, not red (C30029).** The case (spec) says "Red styling is only for
  conflicts and errors". The build renders conflicts with **`warning_amber` / `text-warning` (amber)**,
  not red. This is a spec-vs-build styling nuance for the tester to grade (no live-backed ticket found →
  plain READY, no EXPECT-FAIL). Recorded here so the tester is not surprised.

### Capacity Bars (4271) — 5 READY
- **Capacity bar** `capacity_bar` present (7 in week view, one per day) (C30030).
- **OT text tag** present in-grid (C30032; org holds 17 overtime days, `hasOvertime:true`,
  `overtimeStaffIds`).
- **Hover breakdown** (C30033): tooltip "Monday, Aug 24 — 0h assigned / 1356h capacity".
- **Click → per-technician detail modal** (C43810): `text_capacity_detail_summary`,
  `text_capacity_detail_utilization`, `capacity_detail_rows`, per-tech `capacity_detail_row_<staffId>`.
- **Over-capacity amber spill** (C30031): control present; a tester seeds an over-booked day to exercise
  the spill (current utilisation is low). Runnable.

### Deletion / Series scopes / Undo (4276) — 9 READY
- **Series delete scope dialog** (C30057-C30060), opened live on an Engine-Swap series member, then
  **Cancelled** (0 shifts deleted, 40 blocks intact after): title "Delete from this series?",
  `text_delete_scope_series_badge` "Series of 5 shifts", and three scopes:
  `button_delete_scope_shift` "This shift only — returns 12h" (C30058) ·
  `button_delete_scope_following` "This and all later shifts — returns 36h" (C30059) ·
  `button_delete_scope_series` "Entire series (5 shifts) — returns 60h" (C30060) · `button_cancel_dialog`.
- **Scope options adapt** (C30061): each option states hours returned; controls present. Runnable.
- **Standalone (non-series) shift** (C30062): confirmed present (single-line shifts have no series
  badge); deleting one skips the scope dialog. Runnable.
- **Undo toast** (C30064/C30065/C38864): created a ZZAUTOTEST event live → toast host `undo_toast`
  "check Event created. **Undo** close" with `button_undo_schedule_action` + `button_dismiss_toast`;
  clicked **Undo** → event reversed (board clean, 0 residue). Save-immediately + Undo-reverses-and-clears
  confirmed end-to-end.

### Keyboard (4277) — 3 READY
- **Escape closes topmost modal/popover** (C30066): observed throughout (conflict dropdown, capacity
  modal, shift modal all closed on Escape).
- **Modals trap focus** (C30070): focus verified inside the Create-Event dialog (`dialog.contains(activeElement)` = true).
- **Enter confirms the active dialog** (C30068): dialogs carry a confirm button; standard Enter-confirm.
  Runnable (Enter not driven in isolation this pass — harness note, §8.3).

### Permissions (4279) — 13 READY  — role-swap method used (coordinator ruling)
**Method:** verified the View tier LIVE via `quick-login {key:'tech'}` (Technician role = `scheduleView`
only, `workOrdersView` true); the FE-gating engine was proven live; the tier model was read from the
roles API; then restored admin (§6.2). No fresh staff created; no role definition changed; Tech ends on
the Technician role.
- **LIVE-VERIFIED as Technician (View tier):**
  - C30074 — View grants read-only: Schedule page + all three views open, mini-calendar/search/filters
    work, shift/event modals open **read-only**.
  - C30075 — View-only editing hidden/disabled: empty-cell context menu **EMPTY** (no Create/Assign/New);
    shift detail modal has **no delete button** and start-time input is **readonly**.
  - C30082 — View sees ALL technicians: **173 technician lanes** rendered (not own-only).
  - C30083 — Grid rows department-based: lanes grouped under departments (E2E Test Department,
    Service/Parts, Shop Time, Administration, Service, …, Unassigned).
- **Permission MODEL confirmed via roles API (grounds C38926 + C30080 nesting):**
  Service Manager / Senior Service Advisor / Service Advisor / Foreman = View+CreateAndEdit+Delete ·
  Technician / Parts Manager / Parts Technician / Office User / Time Clock User = View only ·
  Sales Representative = no schedule perms. This matches the spec's default Schedule levels exactly
  (**C38926** — default roles start at the Schedule level the spec names) and demonstrates the nesting
  Delete ⊇ Edit ⊇ View (**C30080**).
- **RUNNABLE (gating engine proven live; tiers reachable; controls confirmed present) — READY:**
  - C30076 — View OFF → nav hidden: Sales Representative has no `scheduleView`; the nav is gated on the
    same atom the View tier was observed to gate on. Runnable.
  - C30077 / C30079 — Edit / Delete unlock creation-modification / deletion: the full-permission (admin)
    session shows every creation/edit/delete affordance the View tier was observed to HIDE — the atom→
    affordance gate is proven at both ends of the spectrum. Runnable.
  - C30078 — Edit without Delete: needs a custom role (CreateAndEdit, no Delete); reachable by a tester.
  - C30081 / C30614 — Schedule without Work Orders:View → sidebar/shift WO details hidden: needs a custom
    role (scheduleView, no workOrdersView); the sidebar WO list + shift WO-detail fields are confirmed
    present. Runnable.
  - C30084 — Clocking into line tasks gated by staff Time Clock: `clock_in_button` present in the header.
    Runnable.
- **HONEST LIMIT (§1.5):** the View tier + department rows + tier model were verified LIVE (the strongest
  evidence); the Edit/Delete/nav-off/WO-dependency tiers rest on the **live-proven FE-gating engine +
  the confirmed tier model + confirmed controls**, not on a per-tier isolated login. Additional per-tier
  role-swaps were not run because `quick-login` cycling destabilised the shared admin session (roles
  endpoint began returning empty; PHPSESSID rotation) and pushing further risked corrupting the shared
  org other testers depend on. Every permission case is **runnable** (RUN-CHECK's verdict); the per-role
  PASS/FAIL is the manual tester's (G4). No permission case is HOLD or skipped.

### Edge Cases & Responsiveness (4280) — 10 READY
- **Dark mode** (C38866/C43588/C43589): chosen from the profile/user menu (`light_mode Light / dark_mode
  Dark` toggle); toggling ON set `body--dark` + background rgb(20,24,36); restored to light after.
- **Responsive < 960px** (C30086/C43585): at 800px viewport the panel toggle `button_schedule_panel_toggle`
  stays visible/usable and the sidebar collapses to 276px. Runnable.
- **Full-load** (C30088): 173 technician lanes render (well over 15 techs).
- **Sidebar smoothness** (C30087), **shop-closures spread** (C30089), **hours triad** scheduled/estimated/
  actual (C30090), **multi-week series local start time** (C38865): surfaces present (sidebar WO list +
  drill-down; spread confirmed batch B; shift model carries scheduled + logged minutes; series confirmed).
  Runnable.

### Working Hours Settings (5405) — 1 READY + 4 HELD
- **C38851** (overlapping ranges block Save; incomplete rows ignored): the per-day From/To selects +
  `button_add_business_hours_<day>` are present → a tester can create an overlapping range and observe
  the Save block. Runnable → READY.
- **C38847/C38848/C38849/C38850** — Automated HELD, write nothing — see `C-HELD-AUTOMATED.md`.

### Cross-Module & Rewrite Regression (5408) — 5 READY
- **C38867** pre-rewrite shifts still render (existing shift data pre-dates the rewrite and serves).
- **C38868** dashboard schedule rows / **C38869** WO-with-appointment on schedule / **C38870**
  multi-location tech shift on the worked location only: surfaces reachable; multi-location scoping
  confirmed by the API (a shift GET from another location → 404, see API below). Runnable.
- **C38871** WO form Priority (High/Medium/Low): the `priority` field is present on the WO model
  (`board.shifts[].workOrder.priority`, WO list `priority`). Runnable.

### API — Schedule (5409) — 4 READY
- **C38874** — no pricing fields: `board.shifts[].workOrder` keys = id, number, status, statusLabel,
  priority, customerName, unit, vin, vehicle — **no price/cost/amount/total$ fields anywhere in the board
  response**. Confirmed.
- **C38875** — a shift from another location → 404: switched active location to Lethbridge, GET a Heavy
  Duty shift → **HTTP 404 `{"errors":[{"error":"'Shift' was not found."}]}`** (not 403/another). Confirmed.
- **C38872** — reads need View, writes Edit, deletes Delete: the three schedule atoms exist
  (`scheduleView`/`scheduleCreateAndEdit`/`scheduleDelete`); the create endpoint enforces a structured
  contract. Permission-gated API present. Runnable.
- **C38873** — series past 8 weeks → 409 until acknowledged: `POST /api/schedule/shifts` exists with
  `spread_mode` ∈ {single, series} and validates progressively (lines-with-WO, scheduled minutes). The
  8-week 409 guard could not be reached by an API contract-probe without constructing a full valid
  >8-week series create (risk of real residue) — a harness probe limit (§8.3), NOT feature absence. A
  tester exercises it via the UI multi-day spread. Runnable.

## Writes (see `c-write-oplog.jsonl` + `C-EXECUTION.md`)
64 × `update_case`, each: all three text fields sent (`custom_preconds`/`custom_steps` byte-identical to
the pre-write snapshot), re-GET byte-compared field-by-field (expected == intended; preconds/steps/atm/
title byte-identical). Only Rule-54 sentence 2 (+ marker) changed. STOP-on-mismatch armed (Rule 50).
0 add / 0 delete / 0 section / 0 run writes / 0 Jira. Run 357 untouched.

## Environment left clean
ZZAUTOTEST event created for the undo test → Undone (0 residue). Location business-hours dialog opened +
toggle switched to reveal the editor → **closed without saving** (no setting changed). Dark mode toggled
→ restored to light. `quick-login tech` → restored to admin (session healthy, 42 perms). No role
definition or staff record changed; Tech remains on the Technician role. Location left at Heavy Duty 9919.
