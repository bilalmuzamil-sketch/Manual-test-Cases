# Schedule — Tech-Plan Push — TestRail Execution Log — 2026-07-30

**User authorization:** "Push all three" (2026-07-30) — SCHEDULE queue = exactly
2 add_section + 13 add_case + 2 update_case per
`Schedule_TechPlan_ChangeList_2026-07-29.md` §A. **Nothing else was written:**
no deletes, no run writes (run 325 / all runs untouched), no other sections or
cases touched. All operations HTTP 200 + re-GET verified MATCH, 0 failures.
Executor: `build/schedule/exec_sync_techplan_2026-07-30.py` (raw per-op result
JSON captured at run time; mirrors gen_import.py field cleaning + the
established Schedule push mapping).

## 1. add_section ×2 (parent = group 4254)

| Section | New section id | Result |
|---|---|---|
| Cross-Module and Rewrite Regression | **5408** | HTTP 200, created |
| API — Schedule (Rule 4) | **5409** | HTTP 200, created |

## 2. update_case ×2 (tester-facing; pre-push snapshots saved first)

Pre-push `get_case` snapshots: `pre-push-snapshot/C29940-SCH-WOL-05-pre-push-2026-07-30.json`,
`pre-push-snapshot/C30044-SCH-VIEW-03-pre-push-2026-07-30.json`. For both cases the
live title matched the local title before the push (title unchanged; the authorized
change = the added Expected line only).

| Case | C-ID / link | Change pushed | Result |
|---|---|---|---|
| SCH-WOL-05 | C29940 — https://shopview.testrail.io/index.php?/cases/view/29940 | Added expected #3: with very many work orders the list may load further results in pages as you scroll — expected, not a fault | HTTP 200, re-GET MATCH |
| SCH-VIEW-03 | C30044 — https://shopview.testrail.io/index.php?/cases/view/30044 | Added expected #4: a user with no technician record does not see the 'My Shifts' option at all | HTTP 200, re-GET MATCH |

## 3. add_case ×13 (all with `custom_atmstatus:3` + `custom_automation_type:0`, template 1)

| Internal ID | New C-ID / link | Section (id) | Result |
|---|---|---|---|
| SCH-SPREAD-11 | C38863 — https://shopview.testrail.io/index.php?/cases/view/38863 | Multi-Day Spread Scheduling (4263) | HTTP 200, re-GET MATCH |
| SCH-DEL-10 | C38864 — https://shopview.testrail.io/index.php?/cases/view/38864 | Deletion, Series Scopes and Undo (4276) | HTTP 200, re-GET MATCH |
| SCH-EDGE-07 | C38865 — https://shopview.testrail.io/index.php?/cases/view/38865 | Edge Cases and Responsiveness (4280) | HTTP 200, re-GET MATCH |
| SCH-EDGE-08 | C38866 — https://shopview.testrail.io/index.php?/cases/view/38866 | Edge Cases and Responsiveness (4280) | HTTP 200, re-GET MATCH |
| SCH-REG-01 | C38867 — https://shopview.testrail.io/index.php?/cases/view/38867 | Cross-Module and Rewrite Regression (5408) | HTTP 200, re-GET MATCH |
| SCH-REG-02 | C38868 — https://shopview.testrail.io/index.php?/cases/view/38868 | Cross-Module and Rewrite Regression (5408) | HTTP 200, re-GET MATCH |
| SCH-REG-03 | C38869 — https://shopview.testrail.io/index.php?/cases/view/38869 | Cross-Module and Rewrite Regression (5408) | HTTP 200, re-GET MATCH |
| SCH-REG-04 | C38870 — https://shopview.testrail.io/index.php?/cases/view/38870 | Cross-Module and Rewrite Regression (5408) | HTTP 200, re-GET MATCH |
| SCH-REG-05 | C38871 — https://shopview.testrail.io/index.php?/cases/view/38871 | Cross-Module and Rewrite Regression (5408) | HTTP 200, re-GET MATCH |
| SCH-API-01 | C38872 — https://shopview.testrail.io/index.php?/cases/view/38872 | API — Schedule (5409) | HTTP 200, re-GET MATCH |
| SCH-API-02 | C38873 — https://shopview.testrail.io/index.php?/cases/view/38873 | API — Schedule (5409) | HTTP 200, re-GET MATCH |
| SCH-API-03 | C38874 — https://shopview.testrail.io/index.php?/cases/view/38874 | API — Schedule (5409) | HTTP 200, re-GET MATCH |
| SCH-API-04 | C38875 — https://shopview.testrail.io/index.php?/cases/view/38875 | API — Schedule (5409) | HTTP 200, re-GET MATCH |

Re-GET verification per new case covered: title, preconditions, steps, expected,
refs, section id, and `custom_atmstatus`/`custom_automation_type` — all MATCH.

## 4. Live reconciliation

- **Live case count under group 4254 subtree = 190** (read back post-push via
  paginated `get_cases`) — matches the 190-row `testrail-id-map.csv` exactly.
- `testrail-id-map.csv`: **190/190 C-ids populated, 0 blanks** (177 prior re-merged
  + the 13 new above).
- Import regenerated over 190 (`testrail-import/schedule-v1-testrail-import.csv`/
  `.xlsx`): header byte-identical to the other project imports, 0 VIU words,
  0 feature-flag words, no duplicate titles/ids, 4 API cases in "API — Schedule",
  no rows missing Preconditions/Steps/Expected.

## 5. What was NOT written

- No `delete_case` / `delete_section`.
- No run/result writes of any kind (run 325 and every other run untouched).
- HELD items untouched per the ChangeList: SCH-EVT-08 (C30615), SCH-CAP-01..04
  (C30030–C30033), SCH-MODAL-08 (C30015), SCH-EXP-01/02 (C38853/C38854), and all
  §C blocked-on-an-answer items.
- No secrets in any file (creds from env only).

All 13 new + 2 edited cases remain **VIU-Pending** — live VIU when the QA branch
exists (SCH-REG-01..04 need the cutover build).
