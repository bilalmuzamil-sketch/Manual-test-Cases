# Schedule — TestRail SYNC EXECUTION LOG (epic SV-8685 backfill, 2026-07-27)

**AUTHORIZED write** (user explicit permission 2026-07-27 — Standing Rule 6).
Project **1** / suite **1 "Master"** / group **4254 "Schedule - 2026 (VIU Pending)"**.
Host shopview.testrail.io (Basic auth; creds in /tmp only). Executed by
`build/schedule/exec_sync_epic_2026-07-27.py` (+ `exec_sync_epic_resume.py` for the
16-case tail after a transient HTTP 000 network drop; no data loss — idempotent resume).
Field mapping mirrors `build/schedule/gen_import.py` (clean/joinlines; VIU-word-free +
flag-free) + the established Schedule push (title, custom_preconds, custom_steps,
custom_expected, refs). **NO writes to any execution run (run 325 / any Schedule run untouched).**

**Result: 2 add_section + 10 add_case + 167 update_case — ALL succeeded (HTTP 200), all re-GET verified MATCH. 0 delete_case.**

Read-only creds check first: `GET get_case/29942` → HTTP 200.

## 0. add_section ×2 (new leaf sections under group 4254)

| Section | New section_id | Note |
|---|---|---|
| Working Hours Settings | **5405** | created (did not exist) |
| Week Export and Printing | **5406** | created (did not exist) |

(SCH-REAS-06 went into the EXISTING "Reassignment and Context Menu" = section **4275**.)

## 1. add_case ×10 (new-scope, new C-ids; all `custom_atmstatus:3` + `custom_automation_type:0`, non-API)

| # | SCH- | NEW Case ID | Section (id) | type_id | priority_id | re-GET MATCH |
|---|------|-------------|--------------|---------|-------------|--------------|
| 1 | SCH-HRS-01 | **C38846** | Working Hours Settings (5405) | 6 | 3 | YES |
| 2 | SCH-HRS-02 | **C38847** | Working Hours Settings (5405) | 6 | 3 | YES |
| 3 | SCH-HRS-03 | **C38848** | Working Hours Settings (5405) | 6 | 3 | YES |
| 4 | SCH-HRS-04 | **C38849** | Working Hours Settings (5405) | 6 | 2 | YES |
| 5 | SCH-HRS-05 | **C38850** | Working Hours Settings (5405) | 6 | 2 | YES |
| 6 | SCH-HRS-06 | **C38851** | Working Hours Settings (5405) | 5 | 3 | YES |
| 7 | SCH-HRS-07 | **C38852** | Working Hours Settings (5405) | 6 | 2 | YES |
| 8 | SCH-EXP-01 | **C38853** | Week Export and Printing (5406) | 6 | 2 | YES |
| 9 | SCH-EXP-02 | **C38854** | Week Export and Printing (5406) | 6 | 2 | YES |
| 10 | SCH-REAS-06 | **C38855** | Reassignment and Context Menu (4275) | 6 | 2 | YES |

Each verified live (title/custom_preconds/custom_steps/custom_expected/refs/section_id/atm+auto) = MATCH.
New C-ids merged into `build/schedule/testrail-id-map.csv` (id-map is the sole holder; case JSONs carry no C-id).

## 2. update_case ×167 (epic SV-8685 refs backfill; 10 also tester-facing)

- **157 metadata-only**: only the `refs` field written (`<TICKET> (<spec-anchor>)`), tester-facing
  Title/Steps/Expected/Preconditions UNCHANGED. Re-GET refs MATCH on all 157.
- **10 tester-facing**: refs + Title/Preconditions/Steps/Expected pushed. Re-GET all-field MATCH:

| SCH- | Case ID | re-GET MATCH (refs+title+preconds+steps+expected) |
|------|---------|---------------------------------------------------|
| SCH-FILT-01 | C29942 | YES |
| SCH-VIEW-01 | C30042 | YES |
| SCH-EVT-01 | C30016 | YES |
| SCH-REAS-03 | C30054 | YES |
| SCH-REAS-04 | C30055 | YES |
| SCH-REAS-05 | C30056 | YES |
| SCH-DEL-08 | C30064 | YES |
| SCH-SPREAD-07 | C29983 | YES |
| SCH-EDGE-05 | C30089 | YES |
| SCH-BLOCK-04 | C29994 | YES |

All 167 re-GET compared live vs local = **MATCH** (0 mismatches). viu_status/type_id/priority_id/section_id
untouched for updates.

## 3. HELD — NOT written (pending Branko), per manifest §D
- **D1 events-count-toward-capacity** — SCH-EVT-08 (C30615) + SCH-CAP-01..04 (C30030/31/32/33): untouched.
- **D4 modal "Reassign"** — SCH-MODAL-08 (C30015): untouched.

## 4. Reconciliation / tally
- **New tally: 177 ACTIVE cases, all in TestRail with a C-id** (167 prior C-id'd + 10 new-scope added).
- id-map re-merged: 177 rows, 0 blank C-ids, 0 unmapped.
- Deliverables regenerated (`gen_import.py`): `testrail-import/schedule-v1-testrail-import.csv`/`.xlsx`
  = 177 rows; header byte-identical vs filters + fees-discounts imports; 0 VIU / 0 feature-flag words;
  no duplicate titles; no C-id column in the import; no rows missing Preconditions/Steps/Expected.

## 5. Safety
- Only group 4254 touched (+ 2 new child sections 5405/5406). No execution-run writes. No secrets committed.
