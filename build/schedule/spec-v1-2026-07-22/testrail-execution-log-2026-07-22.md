# Schedule — TestRail SYNC EXECUTION LOG (2026-07-22)

**AUTHORIZED write** (user explicit permission 2026-07-22, incl. the delete — Standing Rule 6).
Project **1** / suite **1 "Master"** / group **4254**. Host shopview.testrail.io (Basic auth; creds in /tmp only).
Executed by `build/schedule/exec_sync_2026-07-22.py`. Field mapping mirrors `build/schedule/gen_import.py`
(clean/joinlines; VIU-word-free + flag-free) + the fees-discounts push (title, custom_preconds,
custom_steps, custom_expected, refs). NO writes to any execution run.

**Result: 7 update_case + 2 add_case + 1 delete_case — ALL 10 succeeded (HTTP 200), all re-GET verified.**

## A. update_case ×7 (before → after title; re-GET MATCH)

| # | SCH- | Case ID | Before (title) | After (title) | re-GET MATCH |
|---|------|---------|----------------|---------------|--------------|
| 1 | SCH-MODAL-04 | C30011 | The modal shows a scope summary and the scheduled line(s) with labor/total figures | The modal shows a scope summary and the scheduled line(s) with number, title, hours, and status only | YES (title/ok preconds/ok steps/ok expected/ok refs/ok) |
| 2 | SCH-MODAL-08 | C30015 | The modal offers Delete (series-aware) and Reassign actions | The modal offers a Delete (series-aware) action only - there is no Reassign action | YES (title/ok preconds/ok steps/ok expected/ok refs/ok) |
| 3 | SCH-CONF-02 | C30024 | Weekend shift: a shift on Saturday or Sunday is flagged as a conflict | Working-day conflict: a shift on a day outside the technician's configured working days is flagged | YES (title/ok preconds/ok steps/ok expected/ok refs/ok) |
| 4 | SCH-CONF-03 | C30025 | Before hours: a shift starting before the working-day start is flagged | Before hours: a shift starting before the technician's configured working-day start is flagged | YES (title/ok preconds/ok steps/ok expected/ok refs/ok) |
| 5 | SCH-CONF-04 | C30026 | After hours: a shift extending past the working-day end is flagged | After hours: a shift extending past the technician's configured working-day end is flagged | YES (title/ok preconds/ok steps/ok expected/ok refs/ok) |
| 6 | SCH-VIEW-04 | C30045 | The VIN toggle adds the VIN to shift blocks (day/week) and hover tooltips; the detail modal shows VIN regardless | The 'VIN Number' toggle adds the VIN to shift blocks (day/week) only; the hover tooltip and the detail modal always show the VIN | YES (title/ok preconds/ok steps/ok expected/ok refs/ok) |
| 7 | SCH-TIP-01 | C30034 | Shift hover tooltip shows customer, unit/vehicle/VIN, date and time, technician, scope, up to 3 line names, and a progress bar | Shift hover tooltip shows customer, unit/vehicle/VIN, date and time, technician, scope, up to 3 line names, and a progress bar | YES (title/ok preconds/ok steps/ok expected/ok refs/ok) |

All 7 re-GET compared live vs local (title/custom_preconds/custom_steps/custom_expected/refs) = **MATCH**.
Statuses unchanged (all VIU-Pending); type_id/priority_id/section_id untouched.

### Notes-only (NO write) — per manifest §A.1
- **SCH-CONF-01 / C30023** — events-excluded caveat lives only in the QA-side `notes` field; tester-facing
  Title/Preconditions/Steps/Expected UNCHANGED → NO update_case emitted (correct).

## B. add_case ×2 (new C-ids)

| # | SCH- | NEW Case ID | Section | type_id | priority_id | custom_atmstatus | custom_automation_type | verify |
|---|------|-------------|---------|---------|-------------|------------------|------------------------|--------|
| 1 | SCH-PERM-12 | **C30614** | Permissions (4279) | 5 | 3 | 3 | 0 | MATCH |
| 2 | SCH-EVT-08 | **C30615** | Events (4269) | 6 | 2 | 3 | 0 | MATCH |

- **SCH-PERM-12 → C30614** (Permissions §4279; Negative→type_id 5; High→priority_id 3).
- **SCH-EVT-08 → C30615** (Events §4269; Functional→type_id 6; Medium→priority_id 2).
- Both created with `custom_atmstatus:3` + `custom_automation_type:0` (Custom Roles convention); non-API (correct — no API section).
- New C-ids merged into `build/schedule/testrail-id-map.csv` + case JSON has no C-id field (id-map is sole holder).

## C. delete_case ×1 (RETIRE — separately user-authorized 2026-07-22)

| # | SCH- | Case ID | Reason | verify-gone |
|---|------|---------|--------|-------------|
| 1 | SCH-REAS-02 | C30053 | Reassign-in-modal removed (Branko 2026-07-22); drag-reassign covered by SCH-REAS-01 (C30052) | YES (re-GET gone) |

- **SCH-REAS-02 / C30053** delete_case → HTTP 200; re-GET confirms gone. Body kept locally marked Retired;
  id-map −1 (SCH-REAS-02 row removed); generators exclude Retired.

## D. Tally after sync
- **168 authored** (166 original + 2 new SCH-PERM-12/SCH-EVT-08).
- **167 ACTIVE** (168 − 1 Retired SCH-REAS-02). Import + id-map = 167 rows; all 167 carry C-ids (0 blank).
- SCH-REAS-02/C30053 = Retired (deleted from TestRail; body kept for the record).

## E. Safety
- Only Schedule cases (group 4254) touched. NO execution run written (run 325 etc. untouched).
- No secrets committed (creds stay in /tmp).