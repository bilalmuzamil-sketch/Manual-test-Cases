# Schedule — Engineering Tech Plan vs the 177-case suite — DELTAS (2026-07-29)

**Source:** `TechPlan-Schedule-Module-Rewrite.md` (user upload 2026-07-29; plan dated
2026-07-22, "Schedule Module Rewrite — Technical Implementation Plan", engineering).
**Compared against:** `build/schedule/PROJECT-STATE.md` (through §0.0-EPIC-EXECUTED),
`requirements.md` (spec_1 + design deltas + Branko answers), `cases/*.json` (177 active,
all C-id'd), `epic-sv8685/RECONCILIATION.md` (story map SV-8686..SV-8700), the HELD items
(D1 events→capacity, D4 modal Reassign), `PO-Questions-Branko-Schedule-2026-07-27.md`.

**Ground rules applied:** product truth = the PO (Branko). Where the tech plan *decides*
a pending product question, we do NOT rewrite cases — we flag it (CONFIRM-WITH-BRANKO)
and fold what the plan says into the question drafts' QA-internal sections. Engineering
detail that is testable and uncontested becomes case improvements. Everything
tech-plan-pinned is **NOT VIU-verified** (Rule 12) — live VIU still pending the QA branch.

**Headline counts:** IMPROVES-CASE = **10 points → 13 new cases + 3 tester-facing edits
+ 7 notes-only metadata edits** · API-CONTRACT = **17 endpoints recorded, 4 lean API
cases** · CONFLICTS/CONFIRM-WITH-BRANKO = **9 flagged (incl. both HELD items — the plan
speaks to both, neither is settled by it)** · VIU-PREP = **12 facts recorded** ·
NO-IMPACT = **10 groups**.

---

## A. Does the tech plan settle the HELD items? (D1 / D4) — NO; it informs them

### A-D1 — Events count toward capacity (HELD → stays HELD, plan informs Q1)
- **Tech plan D5 (verbatim):** "Events count toward capacity, but are NOT conflict-checked
  (answer to one of our questions in the **PRD Confluence Q&A comment thread**, 2026-07-23 —
  this **revises** the earlier 'events are visual-only, not in capacity' answer #1)."
  Plus two engineering defaults *pending product confirm*: (1) **department-assigned
  events do NOT contribute** to per-tech capacity; (2) all-day/unbounded events are
  excluded from the numeric sum (visual only). Also §3: "there are **9,684 existing event
  rows** … migrated events will immediately contribute to capacity bars — so post-cutover
  utilization will read higher … worth telling product so it isn't reported as a bug."
- **Classification: CONFIRM-WITH-BRANKO.** Engineering will BUILD events-count (option A
  of Q1), citing a PRD Q&A comment we have not ingested — but the pending Branko ruling is
  the product truth. Cases held untouched: SCH-EVT-08 (C30615,
  https://shopview.testrail.io/index.php?/cases/view/30615) + SCH-CAP-01..04
  (C30030–C30033). QA-internal of Q1 updated (see §F).

### A-D4 — Modal "Reassign" (HELD → stays HELD, plan informs Q2)
- **Tech plan (verbatim, Design caveat 2):** "PRD wins over prototype drift: … reassign is
  **drag-only (no modal reassign action)**. Build the PRD version…" and Phase 8:
  ShiftDetailDialog "drag-only reassign — no modal reassign action".
- **Classification: CONFIRM-WITH-BRANKO.** Engineering sides with the design/current cases
  (option B of Q2) — but the Jira story SV-8695 still says Delete AND Reassign, so the
  ruling stays with Branko. Cases held untouched: SCH-MODAL-08 (C30015,
  https://shopview.testrail.io/index.php?/cases/view/30015); SCH-REAS-02 stays retired.
  QA-internal of Q2 updated (see §F).

---

## B. IMPROVES-CASE — testable behaviors our cases miss or under-specify

| # | Tech-plan anchor | What it adds | Action |
|---|---|---|---|
| B1 | **D8 + §4 error cases** | Series caps: beyond **8 weeks (56 days)** create rejects with a warning unless acknowledged; absolute **120-shift hard cap** never overridable. No case covers series length limits. | **NEW SCH-SPREAD-11** (UI: warn/ack at 8 weeks + hard stop at 120) + **NEW SCH-API-02** (409 `SeriesTooLongError` + `acknowledgeLongSeries` retry; >120 → 422). |
| B2 | **D10 Undo** | "Commit-immediately + compensating mutation. The real mutation fires now (a tab close must not lose the action); the toast's Undo issues a compensating mutation … not a cache rollback." Distinct observable: refresh before pressing Undo → the action stuck. | **NEW SCH-DEL-10**; notes-only pointer on SCH-DEL-09 (C30065) that undo-of-delete is backed by a restore endpoint. |
| B3 | **D2 time model / NFR-005** | Spread "converting '8am local' → UTC per-day … a DST-crossing series stays at 8am local every day." Spec glossed DST entirely. | **NEW SCH-EDGE-07** (series across the DST change keeps the same local start each day). |
| B4 | **§3 resolution chain — known, intended behavior change** | "for a tech enrolled at multiple locations, today's schedule renders their task on **every** enrolled workplace board … With WO-primary, the shift appears on **the WO's location only** — the correct behavior … **Call this out in QA notes so it isn't filed as a bug.**" | **NEW SCH-REG-04** (multi-location tech: shift shows only on the WO's location board — expected, not a bug). |
| B5 | **§3 migration + §7 runbook** | The rewrite migrates all existing schedule entries (copy-only, lossless); after release everything created before must still appear. Rewrite-regression check a manual tester must run. | **NEW SCH-REG-01** (pre-release shifts/events survive the rewrite unchanged). |
| B6 | **§4 Dashboard modified endpoint / FR-016** | Dashboard repointed + "fix a pre-existing row-multiplication bug … one aggregated row instead of N — **surface to product as a fix**" (a WO with a 20-shift spread showed 20 dashboard rows before). | **NEW SCH-REG-02** (Dashboard shows ONE schedule row per WO — intended change, not a bug). |
| B7 | **§4 WO create / FR-001** | "creating a WO with an appointment produces a `schedule_shift` row that appears on the board" — cross-module path with zero coverage. | **NEW SCH-REG-03** (WO created with an appointment shows on the Schedule board). |
| B8 | **FR-P4 WO priority** | Phase 1 adds a High/Med/Low select (default unset) to the WO form; the sidebar Priority filter (SCH-FILT-04) has no case for the *setting* side. | **NEW SCH-REG-05** (set Priority on the WO form → sidebar card/filter reflects it; default = none). |
| B9 | **Design §Theming + §6 manual checklist 13** | Design system is light/dark aware; plan mandates "Dark mode across the whole feature". New module = real dark-mode risk. | **NEW SCH-EDGE-08** (Schedule + all its dialogs readable/correct in dark mode). |
| B10 | **D4 + §6 unit matrix ("Saturday-with-tech-hours ⇒ working")** | "Saturday with tech Saturday hours set is **not** a conflict" — the positive complement our SCH-CONF-02 lacks (it only tests the flagged case). Consistent with SV-8691's weekend rule (no product conflict). | **EDIT SCH-CONF-02 (C30024)** — add the expected line: a day WITH tech hours set (e.g. Saturday) is NOT flagged. |
| B11 | **Phase 7 SchedulePage ("My Shifts hidden when `userService.getStaffId()` undefined")** | 'My Shifts' is hidden for a user with no technician/staff record — SCH-VIEW-03 assumes it's always there. | **EDIT SCH-VIEW-03 (C30044)** — tester-facing note (tech-plan-pinned, confirm at VIU). |
| B12 | **§4 board/sidebar ("server-side search + pagination")** | Sidebar search/pagination is server-side (list loads in pages). | Notes-only on SCH-WOL-05 (C29940) — VIU-prep, testers may see paged loading with 50+ WOs. |

Also tester-facing **confirmations** (no edit needed — the plan agrees with the case):
SCH-DEL-08 toast 7s/4s (D10 "4–7s"); SCH-MODAL-04 no `$`/labor (D6); SCH-PERM-12
WO-fields masked without WO:View (D6 server-side); SCH-COLOR-03 renameable labels
(color-labels endpoint, Phase 8); SCH-LANE-03/04 `eventMaxStack:3`/`dayMaxEvents:3`;
SCH-DAY-06 nowIndicator; SCH-PERM-01/04/06/07 — the plan reuses exactly
`ROLE_SCHEDULE_VIEW / CREATE_AND_EDIT / DELETE` ("No new permission atoms").

## C. API-CONTRACT (Rule 4 — endpoints for API cases)

The tech plan §4 is the first backend contract this project has (resolves the "no API
contract" note in gen_import.py / Q7 of the Branko sheet — QA-internal updated). Full
endpoint map recorded for VIU + API cases:

| Endpoint | Purpose | Auth (per plan) |
|---|---|---|
| `GET /api/schedule/board?from=&to=` | composite grid read (resources/shifts/events/capacity/workingWindows/closures; conflicts computed on read) | `ROLE_SCHEDULE_VIEW` |
| `GET /api/schedule/shifts/{id}` | shift-detail modal payload (no `$`) | `ROLE_SCHEDULE_VIEW` |
| `GET /api/schedule/work-orders?search=&status[]=&priority[]=&assignment=&page=&rowsPerPage=` | sidebar WOs, server-side search+pagination | `ROLE_SCHEDULE_VIEW` |
| `POST /api/schedule/shifts` | create single or series (spread server-materialized) | `ROLE_SCHEDULE_CREATE_AND_EDIT` + voter |
| `PATCH /api/schedule/shifts/{id}` | move/resize/reassign/recolor/note; `scope:'shift'\|'day'\|'series'` | same |
| `DELETE /api/schedule/shifts/{id}?scope=shift\|following\|series` | scoped delete → 204 | `ROLE_SCHEDULE_DELETE` + voter |
| `POST /api/schedule/shifts/restore` | undo-of-delete compensation → 201 | `ROLE_SCHEDULE_CREATE_AND_EDIT` + voter |
| `POST/PATCH/DELETE /api/schedule/events…` | event CRUD | create/edit = C&E, delete = DELETE |
| `GET/PUT /api/staff/{id}/working-hours` | per-weekday tech hours | PUT `ROLE_USER_CREATE_AND_EDIT`; GET also SCHEDULE_VIEW |
| `GET/PUT /api/workplaces/business-hours` | shop hours (authenticated workplace) | PUT `ROLE_WORKPLACE_CHANGE` |
| `GET/POST/DELETE /api/workplaces/closures…` | closures/holidays | same split |
| `GET /api/work-orders/{id}/line-technicians` · `PUT /api/work-orders/lines/{lineId}/technicians` | roster read/write | WO View / WO C&E |
| `POST /api/work-orders/change-priority` | `{workOrderId, priority}` | WO C&E |
| `GET/PUT /api/schedule/color-labels` | renameable 7-color labels | GET VIEW / PUT C&E |

**Error contract:** series >8wk → **409** `SeriesTooLongError` (retry with
`acknowledgeLongSeries=true`); >120 shifts → **422** non-overridable; cross-tech own-data
violation → **403** (voter); missing/foreign-workplace shift id → **404**
(workplace-scoped load); validation → **422**. Wire format UTC ISO-8601.

**Lean API cases authored (Rule 28 — one gate per case, no per-endpoint explosion):**
- **SCH-API-01** — permission enforcement matrix in one case: board GET 403 without View /
  200 with; POST+PATCH 403 without Create & Edit; DELETE 403 without Delete.
- **SCH-API-02** — series caps at the API (409 + ack retry; 422 hard cap) — B1.
- **SCH-API-03** — data protection: no pricing/`$` field in ANY schedule response (D6) +
  WO-derived fields (customer/unit/VIN/lines) omitted server-side without WO:View.
- **SCH-API-04** — location scoping: a shift id belonging to another location → 404
  (NFR-001 — the tenant-scoping improvement the rewrite introduces).

NOT authored (kept lean): per-endpoint happy-path reads (covered by the UI cases that
consume them); restore endpoint standalone (covered via SCH-DEL-09/10 UI undo);
own-data-voter negative (product-side ambiguity — flagged as question C8 instead).

## D. CONFLICTS-WITH-SPEC/DESIGN/BRANKO — flagged, NOT silently rewritten

Layman question drafts: `tech-plan-2026-07-29/Questions-for-Branko-dev.md`.

| # | Conflict | Sources (verbatim, Rule 25) | Cases affected | Handling |
|---|---|---|---|---|
| C1 | **Closures & spread skipping.** Tech plan D7: spread "skips closures + non-working days (**real skipping** — the prototype never skipped closures)"; Phase 7 SpreadDialog "real closure skip"; E2E "created series has no shift on the closure day". Jira/design delta D2 (applied 2026-07-27): "shop closures NOT skipped in V1 — shifts can land on closure days" (SCH-EDGE-05 verbatim). | SCH-EDGE-05 (C30089), SCH-SPREAD-07 (C29983), SCH-SPREAD-08 (C29984, preview "skipped days") | Question NQ-1; notes-only caution flags on all three; no rewrite. |
| C2 | **Is double-booking a "conflict"?** Tech plan D4: "Tech double-booking … is flagged by the FE engine as a **soft warning** but is **not** a hard 'conflict' per the locked definition; the BE detector reports only outside-window/closure/non-working-day." Our SCH-CONF-01 (per SV-8697/PRD §4.11): double-booked IS flagged, and SCH-CONF-05 counts it in the toolbar pill. | SCH-CONF-01 (C30023), SCH-CONF-05 (C30027) | Question NQ-2 (does the pill count double-bookings?); notes-only flag on SCH-CONF-01; no rewrite. |
| C3 | **D1 events→capacity** — see §A-D1. HELD. | SCH-EVT-08, SCH-CAP-01..04 | Q1 QA-internal updated; cases untouched. |
| C4 | **D4 modal Reassign** — see §A-D4. HELD. | SCH-MODAL-08 | Q2 QA-internal updated; cases untouched. |
| C5 | **Where do business hours + closures live?** Tech plan Phase 2: a NEW admin page `ScheduleSettings.vue` ("Business hours per weekday + closures CRUD; reachable from AdminLeftMenuNav; also the 'Schedule Settings' link target from the calendar's ViewOptions"). Our SCH-HRS-01/02 (design G1): an "Edit Location" toggle "Set business hours for this shop". Note the design's `Hours Settings.dc.html` is "currently a SHELL … not drawn as of 2026-07-22" per the plan itself. | SCH-HRS-01 (C38846), SCH-HRS-02 (C38847) | Question NQ-3; notes-only flags; no rewrite (both are VIU-Pending new-scope anyway). |
| C6 | **Split shifts ("Add hours") vs the single-range data model.** Tech plan `staff_working_hours` = ONE `start_minute/end_minute` per weekday (unique `(staff_id, workplace_id, day_of_week)`) — no room for a second range. Our SCH-HRS-05/06/07 (design): "Add hours" appends a removable second range; overlap check. | SCH-HRS-05/06/07 (C38850–C38852) | Question NQ-4; notes-only flags; no rewrite. |
| C7 | **"New Work Order" from the cell menu.** Tech plan Phase 7: "CellMenu 'New Work Order' opens the real `WorkOrderDialog.vue` (not a toast)". Our SCH-REAS-06 (C38855, design): "points the user to the Work Orders tab". Also folds into pending Q4. | SCH-REAS-06 (C38855) | Q4 QA-internal updated + notes-only flag; no rewrite. |
| C8 | **Own-data write scoping.** Tech plan NFR-003/§4: `ManageShiftVoter` "enforces own-data scoping for technician-template users (`isRestrictedToOwnData()`)"; error case "cross-tech own-data violation → 403". Our SCH-PERM-09 (spec §14): "No own-only restriction: every Schedule: View user sees ALL technicians' shifts" — that is about VIEWING; the voter restricts WRITES for restricted users. Spec is silent on write-scoping. | SCH-PERM-09 (C30082) context; no case asserts the 403 | Question NQ-5 (dev/PO confirm before authoring a negative case); NOT authored. |
| C9 | **Default working day 7–19 supports Q5 option B.** Tech plan D3: "Shared constant: **Default = 07:00–19:00 local** must match on both sides"; D4 hierarchy "Tech hours > Business hours > Default (7–19)". Pending Q5 (design 8–5 vs 7–7). | SCH-START-03/06, SCH-CONF-03/04 | Q5 QA-internal updated; cases already say 7 AM (kept); end-of-day 7 PM confirm at VIU. |

Also **informs Q3 (Week Export):** the tech plan's FR table (§9) contains **no export or
printing requirement at all** — engineering is not building it per this plan. Q3
QA-internal updated; SCH-EXP-01/02 (C38853/C38854) stay pending Branko.

## E. VIU-PREP facts (record only — live VIU pending the QA branch, OQ-3)

1. **One release, NO feature flag (D-0b)** — no flag precondition will ever apply; before
   cutover `/schedule` renders the LEGACY page even though new endpoints exist ("Phases
   0–8 are inert"). VIU must wait for the cutover build on the QA branch.
2. Route stays `/schedule`; permission `requiredCheck` unchanged (Phase 9).
3. Permission atoms reused, none added: `ROLE_SCHEDULE_VIEW/CREATE_AND_EDIT/DELETE`,
   `ROLE_WORK_ORDER_*`, `ROLE_USER_CREATE_AND_EDIT`, `ROLE_WORKPLACE_CHANGE` (matches our
   3-tier permission cases).
4. DOM hooks for verification: shift block = `schedule_shift_block` with `data-shift-id`
   (from the E2E spec in §6).
5. Wire format = UTC ISO-8601 everywhere; FE converts to shop-local (SV-8038 helpers).
6. Working hours are **per staff per workplace** — a multi-location tech can have
   different hours per location.
7. Conflicts/capacity computed on READ (no stored conflict column) — editing a tech's
   hours retroactively changes which future shifts show as conflicted (worth observing).
8. Board response carries `workingWindows` — FE drag-check and BE use the SAME resolved
   hierarchy Tech > Business > Default (7–19).
9. Migration is copy-only + idempotent; `calendar_task` row count unchanged post-run;
   ~61 legacy rows (0.09%) migrate with NULL location and stay invisible (already
   invisible today — not a data-loss bug).
10. Post-cutover the E2E schedule suite is rewritten in the same PR; QA runs land on the
    new UI immediately (no legacy grace period).
11. Events: white outlined card model retained; event payload has NO all-day column —
    all-day events are represented by their start/end span (relevant to SCH-EVT-04 VIU).
12. Watermark note: a "valid license key" watermark would indicate a licensing misconfig,
    not a feature bug (don't file as functional defect; mention to dev).

## F. Question-draft updates executed with this analysis

- `PO-Questions-Branko-Schedule-2026-07-27.md` → **QA Internal Mapping appendix
  "2026-07-29 tech-plan update"** added for Q1 (D5 events-count + dept/all-day boundary
  defaults), Q2 (drag-only build), Q3 (no export FR in the plan), Q4 (opens the real WO
  dialog), Q5 (plan constant 07:00–19:00), Q7 (the tech plan IS the backend contract —
  API cases now authored from it, pending live VIU). Reader-facing questions untouched
  (xlsx unchanged).
- NEW `tech-plan-2026-07-29/Questions-for-Branko-dev.md` — NQ-1..NQ-5 (Rule-7 layman).

## G. NO-IMPACT (engineering-internal, no test-case value)

FullCalendar licensing/key wiring, CC fallback, bundle/lazy-chunk (NFR-006); design-token
hexes/spacing/shadows; code layout (DDD/hexagonal, module paths, voter class names);
migration mechanics (CLI command shape, idempotency internals, audit-SQL caveats,
far-future garbage dates); rollback/redeploy mechanics + Phase 10 table drop; E2E
reference-breakage inventory + page objects; POC harvest notes; Mercure/live-push
deferral (D9 — concurrency stays optimistic+refetch LWW, same as today: no case);
`schedule_shift_line` FK cascade internals (the observable half — shift survives line
delete — is engineering-default, revisit only if a tester can delete a scheduled line);
`is_all_day` shift semantics (model nuance; SCH-START-08 "every shift has a start time"
kept — `starts_at` is NOT NULL in the schema, so no contradiction; notes-only).

---
*No TestRail writes in this pass. All new/edited cases LOCAL, staged for an authorized
push (see the ChangeList). Tech-plan-pinned wording carries VIU-confirm flags (Rule 9/12).*
