# Filters — TestRail execution log — tech-plan push EXECUTED 2026-07-30

**Authorization:** user explicitly authorized THIS pass 2026-07-30 ("Push all three"):
exactly the ChangeList.md §E queue — **15 × `add_case` + 1 × `update_case`
(FLT-PERS-02 = C29614)**, plus the §E-named new section "Page Search Toolbar".
**Nothing else: 0 deletes, 0 run writes, only the Filters group 4110 touched.**

**Method (mirrors the proven Schedule/branko-2026-07-17 pushes):** pre-flight gate on
all 16 payloads (add-case titles ≤80 chars, no angle brackets, refs present ≤250) →
read live section tree → `add_section` ×1 → per case `add_case`/`update_case`
(fields `title`/`custom_preconds`/`custom_steps`/`custom_expected`/`refs`, mapped
identically to gen_import.py Title/Preconditions/Steps/Expected Result/References
with the same clean()/joinlines transforms; adds carry `template_id:1` +
`custom_atmstatus:3` + `custom_automation_type:0`) → re-GET byte-verify each.
Executor: `exec_sync_2026-07-30.py`; raw op log: `exec-log-2026-07-30.json`;
pre-push snapshot: `pre-push-snapshot/C29614-pre-push-2026-07-30.json`.

**RESULT: 17/17 operations HTTP 200; 16/16 re-GET verified MATCH; 0 failures.**
Live count under group 4110: **79 before → 94 after** (= 79 + 15, confirmed by a
per-section live re-count). Import/id-map regenerated over 137 (94 C-ids, 43 blank
= the separately-pending Parts/Reports/⌘K design-level queue).

## add_section ×1

| Section | ID | Parent | Status |
|---|---|---|---|
| Page Search Toolbar | **5410** | 4110 | CREATED (HTTP 200) — authorized by ChangeList §E for FLT-PSRCH-01..07 |

## add_case ×15 (all HTTP 200, re-GET MATCH, atm/auto fields verified)

| Internal ID | New C-ID | TestRail link | Section (id) | Verify |
|---|---|---|---|---|
| FLT-TAB-06 | C38876 | https://shopview.testrail.io/index.php?/cases/view/38876 | Tab Behaviour (4120) | MATCH |
| FLT-STAT-07 | C38877 | https://shopview.testrail.io/index.php?/cases/view/38877 | Status Filter (4112) | MATCH |
| FLT-ASSET-07 | C38878 | https://shopview.testrail.io/index.php?/cases/view/38878 | Asset on Site Filter (4116) | MATCH |
| FLT-URL-05 | C38879 | https://shopview.testrail.io/index.php?/cases/view/38879 | URL State and Shareable Links (4122) | MATCH |
| FLT-PERS-05 | C38880 | https://shopview.testrail.io/index.php?/cases/view/38880 | Persistence (4121) | MATCH |
| FLT-PERS-06 | C38881 | https://shopview.testrail.io/index.php?/cases/view/38881 | Persistence (4121) | MATCH |
| FLT-RPTS-23 | C38882 | https://shopview.testrail.io/index.php?/cases/view/38882 | Active Filter Chips and Clear Filters (4117) — see placement note | MATCH |
| FLT-PSRCH-01 | C38883 | https://shopview.testrail.io/index.php?/cases/view/38883 | Page Search Toolbar (5410) | MATCH |
| FLT-PSRCH-02 | C38884 | https://shopview.testrail.io/index.php?/cases/view/38884 | Page Search Toolbar (5410) | MATCH |
| FLT-PSRCH-03 | C38886 | https://shopview.testrail.io/index.php?/cases/view/38886 | Page Search Toolbar (5410) | MATCH |
| FLT-PSRCH-04 | C38888 | https://shopview.testrail.io/index.php?/cases/view/38888 | Page Search Toolbar (5410) | MATCH |
| FLT-PSRCH-05 | C38889 | https://shopview.testrail.io/index.php?/cases/view/38889 | Page Search Toolbar (5410) | MATCH |
| FLT-PSRCH-06 | C38891 | https://shopview.testrail.io/index.php?/cases/view/38891 | Page Search Toolbar (5410) | MATCH |
| FLT-PSRCH-07 | C38893 | https://shopview.testrail.io/index.php?/cases/view/38893 | Page Search Toolbar (5410) | MATCH |
| FLT-API-06 | C38895 | https://shopview.testrail.io/index.php?/cases/view/38895 | API — Work Orders List Filtering (4124) | MATCH |

(The C-id gaps — C38885/38887/38890/38892/38894 — belong to the concurrent
sibling-project pushes running the same day; not Filters cases.)

## update_case ×1 (HTTP 200, re-GET MATCH)

| Internal ID | C-ID | TestRail link | Change | Verify |
|---|---|---|---|---|
| FLT-PERS-02 | C29614 | https://shopview.testrail.io/index.php?/cases/view/29614 | Added step 6 (second computer/profile) + expected 3 (filters follow the account, cross-device; "to confirm live once built") per ChangeList §B / tech-plan G6. Title/preconditions unchanged. | MATCH |

Pre-push before-image saved: `pre-push-snapshot/C29614-pre-push-2026-07-30.json`.

## Placement notes

- **FLT-RPTS-23 (C38882):** authored area "Reports Page Filters" does NOT exist live
  (that section belongs to the separately-pending 43-case Parts/Reports queue) and a
  second `add_section` was NOT in the authorized queue (§E authorizes only "Page
  Search Toolbar"). Placed in the most fitting EXISTING section **4117 "Active Filter
  Chips and Clear Filters"** (it is a chip-behaviour case: the new date-range chip
  type). **Follow-up:** move it to "Reports Page Filters" when that queue's
  authorized push creates the section. The local id-map/import keep the authored
  section name (the import is the authored source of truth; this live placement is a
  documented temporary divergence).
- **FLT-PERS-02 title = 151 chars** (over the ≤80 concise-title bar). It is the
  PRE-EXISTING live title, byte-identical before/after — shortening it was not in the
  authorized §E queue, so it was left untouched. Flagged as a candidate for the next
  authorized tester-facing touch.

## Reconciliation (post-push)

- `build/filters/testrail-id-map.csv`: 137 rows; **94 C-ids populated (79 prior +
  15 new), 0 blanks among pushed cases**; 43 blank = the pending design-level queue
  (Parts/Reports/⌘K incl. FLT-SRCH-01..09 held for Branko Q6).
- `testrail-import/filters-v1-testrail-import.csv`/`.xlsx` regenerated: 137 rows;
  header byte-identical to the sibling imports (md5 `cccad469…` == simple-flow);
  0 VIU/flag words; 0 dup titles/ids; API cases (6) only in "API — Work Orders List
  Filtering"; no missing Preconditions/Steps/Expected. (gen_import.py rerun blanks
  the id-map C-id column — re-merged 94/94 after, per the standing gotcha.)
- **Live TestRail count under group 4110 = 94** (per-section re-count 2026-07-30)
  = expected 79 + 15. Run(s) untouched; no deletes; no other group touched;
  no secrets.
