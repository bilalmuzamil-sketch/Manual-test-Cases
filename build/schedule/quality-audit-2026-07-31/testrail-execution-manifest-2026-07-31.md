# Schedule — TestRail execution manifest — 2026-07-31 (consolidation + wording repairs)

**Status at time of writing: STAGED — NOT YET EXECUTED.** (Updated to EXECUTED with results once the run completes.)

**Authorization:** user-authorized 2026-07-31 to execute the recommendations in
`build/schedule/quality-audit-2026-07-31/MERGE-PLAN.md` (20 merge groups + 2 cuts) and the 6 FIX-WORDING
repairs in `USEFULNESS-AUDIT-2026-07-31.md`. Standing Rule 6 satisfied.

**Scope guards.**
- TestRail project **1** / suite **1**; **only** the Schedule group **4254** subtree is touched
  (live read before writing: 31 sections, 190 cases, C-id range C29925–C38875).
- **NO run writes.** No `add_result`, no `add_run`, no run/plan/result endpoint is called at all. All runs
  (including run 325 and every other run) are untouched.
- **No `add_case`, no `add_section`, no `update_section`, no `delete_section`.** Only `update_case` and
  `delete_case`.
- **HELD-pending-Branko cases are NOT in this manifest:** SCH-EVT-08 (C30615), SCH-CAP-01..04
  (C30030–C30033), SCH-MODAL-08 (C30015).
- Pre-write `get_case` snapshots of every case in this manifest are stored in
  `build/schedule/quality-audit-2026-07-31/pre-push-snapshot/` before the first write.

**Totals: 24 `update_case` + 25 `delete_case` = 49 operations.**
Tally effect: **190 active → 165 active** (23 merged-away members + 2 cuts deleted).

---

## A. `update_case` — 24 cases

A case that is both a merge survivor AND a wording repair is ONE update carrying the final body
(SCH-EVT-03 and SCH-COLOR-02).

| # | Internal ID | C-id | Why updated | Fields written |
|---|---|---|---|---|
| 1 | SCH-COLOR-02 | C30072 ([link](https://shopview.testrail.io/index.php?/cases/view/30072)) | merge survivor of **G-SHIFT-COLOR** (absorbed SCH-BLOCK-04) + **FIX-WORDING** repair | title, custom_preconds, custom_steps, custom_expected, refs |
| 2 | SCH-CONF-03 | C30025 ([link](https://shopview.testrail.io/index.php?/cases/view/30025)) | merge survivor of **G-HOURS-CONFLICT** (absorbed SCH-CONF-04) | title, custom_preconds, custom_steps, custom_expected, refs |
| 3 | SCH-DAY-01 | C30001 ([link](https://shopview.testrail.io/index.php?/cases/view/30001)) | merge survivor of **G-AUTOSCROLL** (absorbed SCH-DAY-02) | title, custom_preconds, custom_steps, custom_expected, refs |
| 4 | SCH-DEL-09 | C30065 ([link](https://shopview.testrail.io/index.php?/cases/view/30065)) | merge survivor of **G-UNDO** (absorbed SCH-DEL-07) | title, custom_preconds, custom_steps, custom_expected, refs |
| 5 | SCH-EVT-03 | C30018 ([link](https://shopview.testrail.io/index.php?/cases/view/30018)) | merge survivor of **G-EVENT-MODAL** (absorbed SCH-EVT-04) + **FIX-WORDING** repair | title, custom_preconds, custom_steps, custom_expected, refs |
| 6 | SCH-EXP-01 | C38853 ([link](https://shopview.testrail.io/index.php?/cases/view/38853)) | merge survivor of **G-WEEK-EXPORT** (absorbed SCH-EXP-02) | title, custom_preconds, custom_steps, custom_expected, refs |
| 7 | SCH-HRS-02 | C38847 ([link](https://shopview.testrail.io/index.php?/cases/view/38847)) | merge survivor of **G-HRS-LOCATION** (absorbed SCH-HRS-01) | title, custom_preconds, custom_steps, custom_expected, refs |
| 8 | SCH-HRS-06 | C38851 ([link](https://shopview.testrail.io/index.php?/cases/view/38851)) | merge survivor of **G-HRS-VALIDATION** (absorbed SCH-HRS-07) | title, custom_preconds, custom_steps, custom_expected, refs |
| 9 | SCH-KEY-01 | C30066 ([link](https://shopview.testrail.io/index.php?/cases/view/30066)) | merge survivor of **G-ESCAPE** (absorbed SCH-KEY-02) | title, custom_preconds, custom_steps, custom_expected, refs |
| 10 | SCH-KEY-03 | C30068 ([link](https://shopview.testrail.io/index.php?/cases/view/30068)) | merge survivor of **G-ENTER** (absorbed SCH-KEY-04) | title, custom_preconds, custom_steps, custom_expected, refs |
| 11 | SCH-LANE-01 | C29996 ([link](https://shopview.testrail.io/index.php?/cases/view/29996)) | merge survivor of **G-SAMEDAY-LANE** (absorbed SCH-LANE-05) | title, custom_preconds, custom_steps, custom_expected, refs |
| 12 | SCH-LINE-01 | C29948 ([link](https://shopview.testrail.io/index.php?/cases/view/29948)) | merge survivor of **G-DRILLDOWN-OPEN** (absorbed SCH-LINE-02) | title, custom_preconds, custom_steps, custom_expected, refs |
| 13 | SCH-NAV-01 | C29925 ([link](https://shopview.testrail.io/index.php?/cases/view/29925)) | merge survivor of **G-NAV-LANDING** (absorbed SCH-NAV-02) | title, custom_preconds, custom_steps, custom_expected, refs |
| 14 | SCH-PERM-02 | C30075 ([link](https://shopview.testrail.io/index.php?/cases/view/30075)) | **FIX-WORDING** repair | custom_preconds, custom_steps, custom_expected (title + refs unchanged, re-sent identical) |
| 15 | SCH-PERM-04 | C30077 ([link](https://shopview.testrail.io/index.php?/cases/view/30077)) | **FIX-WORDING** repair | custom_preconds, custom_steps, custom_expected (title + refs unchanged, re-sent identical) |
| 16 | SCH-REAS-03 | C30054 ([link](https://shopview.testrail.io/index.php?/cases/view/30054)) | merge survivor of **G-CELL-MENU** (absorbed SCH-REAS-04, SCH-REAS-05) | title, custom_preconds, custom_steps, custom_expected, refs |
| 17 | SCH-REAS-06 | C38855 ([link](https://shopview.testrail.io/index.php?/cases/view/38855)) | **FIX-WORDING** repair | custom_preconds, custom_steps, custom_expected (title + refs unchanged, re-sent identical) |
| 18 | SCH-SCOPE-01 | C29963 ([link](https://shopview.testrail.io/index.php?/cases/view/29963)) | merge survivor of **G-SCOPE-CONTENTS** (absorbed SCH-SCOPE-04) | title, custom_preconds, custom_steps, custom_expected, refs |
| 19 | SCH-SCOPE-05 | C29967 ([link](https://shopview.testrail.io/index.php?/cases/view/29967)) | merge survivor of **G-SCOPE-MULTI** (absorbed SCH-SCOPE-06) | title, custom_preconds, custom_steps, custom_expected, refs |
| 20 | SCH-SPREAD-02 | C29978 ([link](https://shopview.testrail.io/index.php?/cases/view/29978)) | merge survivor of **G-SPREAD-HEADER** (absorbed SCH-SPREAD-01) | title, custom_preconds, custom_steps, custom_expected, refs |
| 21 | SCH-SPREAD-08 | C29984 ([link](https://shopview.testrail.io/index.php?/cases/view/29984)) | **FIX-WORDING** repair | custom_preconds, custom_steps, custom_expected (title + refs unchanged, re-sent identical) |
| 22 | SCH-VIEW-04 | C30045 ([link](https://shopview.testrail.io/index.php?/cases/view/30045)) | merge survivor of **G-VIN-TOGGLE** (absorbed SCH-BLOCK-03, SCH-DAY-07) | title, custom_preconds, custom_steps, custom_expected, refs |
| 23 | SCH-VIEW-05 | C30046 ([link](https://shopview.testrail.io/index.php?/cases/view/30046)) | merge survivor of **G-VIEW-TOGGLES** (absorbed SCH-VIEW-07, SCH-VIEW-08) | title, custom_preconds, custom_steps, custom_expected, refs |
| 24 | SCH-WOL-04 | C29939 ([link](https://shopview.testrail.io/index.php?/cases/view/29939)) | merge survivor of **G-SIDEBAR-SEARCH** (absorbed SCH-WOL-03) | title, custom_preconds, custom_steps, custom_expected, refs |

### Final titles written (all ≤ 80 chars)

| Internal ID | C-id | Title written | Chars | Changed? |
|---|---|---|---|---|
| SCH-COLOR-02 | C30072 | Shift modal color picker recolors that shift only, in matching tones | 68 | **changed** |
| SCH-CONF-03 | C30025 | Before-hours and after-hours shifts are flagged against the tech's hours | 72 | **changed** |
| SCH-DAY-01 | C30001 | Day view auto-scrolls to the working-day start; manual scrolling stands | 71 | **changed** |
| SCH-DEL-09 | C30065 | Every create/delete/move/reassign toasts with Undo, and Undo restores | 69 | **changed** |
| SCH-EVT-03 | C30018 | Event modal fields all save; the all-day toggle creates an all-day event | 72 | **changed** |
| SCH-EXP-01 | C38853 | Week Export opens a printable Department-by-Technician week grid | 64 | unchanged |
| SCH-HRS-02 | C38847 | Business-hours toggle reveals a per-day (Mon-Sun) From-To editor | 64 | **changed** |
| SCH-HRS-06 | C38851 | Overlapping hour ranges block Save; incomplete rows are ignored | 63 | **changed** |
| SCH-KEY-01 | C30066 | Escape closes the topmost open modal or popover, following the stacking order | 77 | unchanged |
| SCH-KEY-03 | C30068 | Enter confirms the active dialog, but not inside a note textarea | 64 | **changed** |
| SCH-LANE-01 | C29996 | Non-overlapping same-day shifts share one lane, even from different orders | 74 | **changed** |
| SCH-LINE-01 | C29948 | Work order card opens the line drill-down in place, with header and back control | 80 | **changed** |
| SCH-NAV-01 | C29925 | Schedule opens from the top-level navigation into a sidebar + grid layout | 73 | **changed** |
| SCH-PERM-02 | C30075 | View-only: every editing affordance is hidden or disabled | 57 | unchanged |
| SCH-PERM-04 | C30077 | Schedule: Edit unlocks all creation and modification interactions | 65 | unchanged |
| SCH-REAS-03 | C30054 | Right-click a grid cell opens a menu with Create Event and New Work Order | 73 | unchanged |
| SCH-REAS-06 | C38855 | 'New Work Order' in the cell menu points the user to the Work Orders tab | 72 | unchanged |
| SCH-SCOPE-01 | C29963 | Scope picker contents: the pinned whole-order row and the line rows | 67 | **changed** |
| SCH-SCOPE-05 | C29967 | 'Select multiple' checkbox mode: running tally, Select all, and Cancel | 70 | **changed** |
| SCH-SPREAD-02 | C29978 | Spread step header shows the scope; 'Change scope' returns to the picker | 72 | **changed** |
| SCH-SPREAD-08 | C29984 | Preview is collapsed to a one-line summary, expandable to a week-by-week breakdown with skipped days struck through and their reasons | 133 | unchanged |
| SCH-VIEW-04 | C30045 | 'VIN Number' toggle gates the block VIN only - tooltip and modal always show it | 79 | **changed** |
| SCH-VIEW-05 | C30046 | 'View Options': six toggles with defaults; Capacity Bars and Events flip | 72 | **changed** |
| SCH-WOL-04 | C29939 | 'Search work orders' matches work order number, customer, unit, and technician | 78 | **changed** |

### References (`refs`) written — Rule 20 (ticket + spec anchor, unioned from absorbed members)

| Internal ID | C-id | refs written |
|---|---|---|
| SCH-COLOR-02 | C30072 | `SV-8700 (§10, §4.9 (Color picker)); SV-8690 (§4.4, §10)` |
| SCH-CONF-03 | C30025 | `SV-8697 (§4.11 (Before hours, After hours))` |
| SCH-DAY-01 | C30001 | `SV-8694 (§4.8 (Auto-scroll to business hours))` |
| SCH-DEL-09 | C30065 | `SV-8688 (§7 (Toast notifications), §11 (Undo))` |
| SCH-EVT-03 | C30018 | `SV-8696 (§4.10 (Event modal), §8.1 (Event allDay field))` |
| SCH-EXP-01 | C38853 | `SV-8685 (design Week Export - V1 scope pending Branko)` |
| SCH-HRS-02 | C38847 | `SV-8699 (§4.2 Working Hours - business hours toggle, per-day From/To editor)` |
| SCH-HRS-06 | C38851 | `SV-8699 (§4.2 Working Hours - overlap validation; incomplete rows ignored by overlap check)` |
| SCH-KEY-01 | C30066 | `SV-8700 (§7 (Keyboard support - Escape, including within the shift modal))` |
| SCH-KEY-03 | C30068 | `SV-8700 (§7 (Keyboard support - Enter; Enter does not fire inside textareas))` |
| SCH-LANE-01 | C29996 | `SV-8693 (§4.7, §12 (edge case))` |
| SCH-LINE-01 | C29948 | `SV-8687 (§3.1 (Line drill-down))` |
| SCH-NAV-01 | C29925 | `SV-8686 (§3, §3.1, §3.2)` |
| SCH-PERM-02 | C30075 | `SV-8685 (§14.1 (Schedule: View - editing affordances hidden or disabled))` |
| SCH-PERM-04 | C30077 | `SV-8685 (§14.1 (Schedule: Edit))` |
| SCH-REAS-03 | C30054 | `SV-8700 (§7 (Right-click context menu; View Day and New Shift removed), §14.1 (creation via context menu))` |
| SCH-REAS-06 | C38855 | `SV-8700 (§7 / §4.10 New Work Order cell-menu shortcut)` |
| SCH-SCOPE-01 | C29963 | `SV-8689 (§4.3)` |
| SCH-SCOPE-05 | C29967 | `SV-8689 (§4.3 (Select multiple, Select all shortcut, Cancel))` |
| SCH-SPREAD-02 | C29978 | `SV-8691 (§4.5)` |
| SCH-SPREAD-08 | C29984 | `SV-8691 (§4.5 (Preview))` |
| SCH-VIEW-04 | C30045 | `SV-8700 (§9 (VIN), §4.4); SV-8690 (§4.4, §9 (VIN option)); SV-8694 (§4.8 (Lane height with VIN))` |
| SCH-VIEW-05 | C30046 | `SV-8700 (§6, §9 (View Options popover, Capacity Bars, Events), §4.12)` |
| SCH-WOL-04 | C29939 | `SV-8687 (§3.1 (Sidebar search, Work order card anatomy))` |

---

## B. `delete_case` — 25 cases

Every C-id below was verified **twice**: (1) against `build/schedule/testrail-id-map.csv`, and
(2) against a live `get_cases` read of the group-4254 subtree taken immediately before writing
(all present, all inside C29925–C38875, none outside group 4254). Bodies are KEPT locally, marked
`viu_status: "Retired - ..."`, and additionally backed up in
`build/schedule/consolidation-backup-2026-07-31/`.

### B1. Merged-away members (23) — coverage folded into the named survivor

| # | Internal ID | C-id | Group | Survivor that absorbed it |
|---|---|---|---|---|
| 1 | SCH-BLOCK-03 | C29993 ([link](https://shopview.testrail.io/index.php?/cases/view/29993)) | G-VIN-TOGGLE | SCH-VIEW-04 (C30045) |
| 2 | SCH-BLOCK-04 | C29994 ([link](https://shopview.testrail.io/index.php?/cases/view/29994)) | G-SHIFT-COLOR | SCH-COLOR-02 (C30072) |
| 3 | SCH-CONF-04 | C30026 ([link](https://shopview.testrail.io/index.php?/cases/view/30026)) | G-HOURS-CONFLICT | SCH-CONF-03 (C30025) |
| 4 | SCH-DAY-02 | C30002 ([link](https://shopview.testrail.io/index.php?/cases/view/30002)) | G-AUTOSCROLL | SCH-DAY-01 (C30001) |
| 5 | SCH-DAY-07 | C30007 ([link](https://shopview.testrail.io/index.php?/cases/view/30007)) | G-VIN-TOGGLE | SCH-VIEW-04 (C30045) |
| 6 | SCH-DEL-07 | C30063 ([link](https://shopview.testrail.io/index.php?/cases/view/30063)) | G-UNDO | SCH-DEL-09 (C30065) |
| 7 | SCH-EVT-04 | C30019 ([link](https://shopview.testrail.io/index.php?/cases/view/30019)) | G-EVENT-MODAL | SCH-EVT-03 (C30018) |
| 8 | SCH-EXP-02 | C38854 ([link](https://shopview.testrail.io/index.php?/cases/view/38854)) | G-WEEK-EXPORT | SCH-EXP-01 (C38853) |
| 9 | SCH-HRS-01 | C38846 ([link](https://shopview.testrail.io/index.php?/cases/view/38846)) | G-HRS-LOCATION | SCH-HRS-02 (C38847) |
| 10 | SCH-HRS-07 | C38852 ([link](https://shopview.testrail.io/index.php?/cases/view/38852)) | G-HRS-VALIDATION | SCH-HRS-06 (C38851) |
| 11 | SCH-KEY-02 | C30067 ([link](https://shopview.testrail.io/index.php?/cases/view/30067)) | G-ESCAPE | SCH-KEY-01 (C30066) |
| 12 | SCH-KEY-04 | C30069 ([link](https://shopview.testrail.io/index.php?/cases/view/30069)) | G-ENTER | SCH-KEY-03 (C30068) |
| 13 | SCH-LANE-05 | C30000 ([link](https://shopview.testrail.io/index.php?/cases/view/30000)) | G-SAMEDAY-LANE | SCH-LANE-01 (C29996) |
| 14 | SCH-LINE-02 | C29949 ([link](https://shopview.testrail.io/index.php?/cases/view/29949)) | G-DRILLDOWN-OPEN | SCH-LINE-01 (C29948) |
| 15 | SCH-NAV-02 | C29926 ([link](https://shopview.testrail.io/index.php?/cases/view/29926)) | G-NAV-LANDING | SCH-NAV-01 (C29925) |
| 16 | SCH-REAS-04 | C30055 ([link](https://shopview.testrail.io/index.php?/cases/view/30055)) | G-CELL-MENU | SCH-REAS-03 (C30054) |
| 17 | SCH-REAS-05 | C30056 ([link](https://shopview.testrail.io/index.php?/cases/view/30056)) | G-CELL-MENU | SCH-REAS-03 (C30054) |
| 18 | SCH-SCOPE-04 | C29966 ([link](https://shopview.testrail.io/index.php?/cases/view/29966)) | G-SCOPE-CONTENTS | SCH-SCOPE-01 (C29963) |
| 19 | SCH-SCOPE-06 | C29968 ([link](https://shopview.testrail.io/index.php?/cases/view/29968)) | G-SCOPE-MULTI | SCH-SCOPE-05 (C29967) |
| 20 | SCH-SPREAD-01 | C29977 ([link](https://shopview.testrail.io/index.php?/cases/view/29977)) | G-SPREAD-HEADER | SCH-SPREAD-02 (C29978) |
| 21 | SCH-VIEW-07 | C30048 ([link](https://shopview.testrail.io/index.php?/cases/view/30048)) | G-VIEW-TOGGLES | SCH-VIEW-05 (C30046) |
| 22 | SCH-VIEW-08 | C30049 ([link](https://shopview.testrail.io/index.php?/cases/view/30049)) | G-VIEW-TOGGLES | SCH-VIEW-05 (C30046) |
| 23 | SCH-WOL-03 | C29938 ([link](https://shopview.testrail.io/index.php?/cases/view/29938)) | G-SIDEBAR-SEARCH | SCH-WOL-04 (C29939) |

### B2. Outright cuts (2) — literal duplicates

| # | Internal ID | C-id | Duplicate of |
|---|---|---|---|
| 1 | SCH-EDGE-01 | C30085 ([link](https://shopview.testrail.io/index.php?/cases/view/30085)) | SCH-SPREAD-10 (C29986) — same setup, same assertion (its Expected 3 states it verbatim) |
| 2 | SCH-START-08 | C29976 ([link](https://shopview.testrail.io/index.php?/cases/view/29976)) | SCH-START-01..05 (C29969, C29970, C29971, C29972, C29973) — re-runs them; each already reads the created shift's start time |

---

## C. Execution order and verification protocol

1. `get_case` every case in sections A + B → `pre-push-snapshot/C<id>.json` (done before any write).
2. All 24 `update_case` calls; each must return HTTP 200, then an immediate `get_case` re-GET must MATCH
   the sent title / preconds / steps / expected / refs.
3. All 25 `delete_case` calls; each must return HTTP 200, then a re-GET must show the case GONE
   (HTTP 400 / `is_deleted`).
4. Per-operation results are flushed immediately to `testrail-execution-log-2026-07-31.md` so a killed run
   is resumable against live state (Standing Rule 29).
5. Final live `get_cases` count under group 4254 must equal **165**.

## D. Not in this manifest (still pending)

- **98→79 over-80-character title trims** — not authorized this pass.
- **HELD items** SCH-EVT-08 (C30615), SCH-CAP-01..04 (C30030–C30033), SCH-MODAL-08 (C30015) — awaiting Branko.
- **19 WEAK-KEEP** cases — audit recommends KEEP; no action.

