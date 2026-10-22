# Pass report — Splitting Sales Representatives: one action per step (22 Oct 2026)

**Draft only.** Nothing was written to TestRail, Jira, Slack or Google, and nothing was committed. The library cases live in
`authoring/` (built into `authoring/proposals.json`); the three design-recheck cases that change are in `DR-PROPOSALS.json` (full new
`custom_steps` and `custom_expected`). Pre-pass copies of every authoring file, `proposals.json` and the setup file: `before/`.

Orders applied: QA lead, 22 Oct 2026, "Yes, fix all 113 cases" (each step is ONE action); and the same day, *"do not add unecessary
steps … but that should not be done at a cost that it make the test NOT runnable for the manual QA tester"*.
Rules read in full first: 41, 117 (all twelve amendments), 127, 134; `build/skills/IDEAL-TEST-CASE-STANDARD.md`; `build/LESSONS-REGISTER.md`
(L-01 to L-07). Sources the cases were re-checked against (Rule 134): PRD Confluence 919928833 version 11 (21 Oct 2026), Chris Ward's
answers 1-40, tech plan (14 Oct 2026, read in full 22 Oct 2026 by the tech-plan pass), SBR spec v28, SBC spec v21, design export of
19 Oct 2026. No source changed in this pass, so no quote, "From:" line or build line changed.

## 1. Counts
| | Before | After |
|---|---|---|
| Cases scanned | 144 (138 library + 6 design-recheck) | 144 |
| Steps with two or more UI actions (own scan, `scan.py` heuristic + read by hand) | 120 flagged by the scan, plus these found by reading every step by hand (S1-08, S4-15, S4-26, S4-09, S4-16, S4-17, S5-14, S5-16, S2-10, S4-12, REL-14, REL-16 report-opening steps written "for today with …", S8-01 "Untick Labor and Parts too", C690661 and C690664 "Expand A and B") | **0** |
| Steps in the suite | 465 (444 library + 21 design-recheck) | 681 (657 library + 24 design-recheck) |
| Cases changed | — | **96**: 93 library cases + 3 design-recheck cases (C690660, C690661, C690664) |
| Cases unchanged (every step already one action) | — | 48: 45 library + C690658, C690659, C690663 |

**Gate output** (`python3 authoring/build.py`, exit 0):
```
cases 138 {'S1': 11, 'S2': 16, 'S3': 4, 'S4': 28, 'S5': 10, 'DATA': 10, 'S6': 5, 'S7': 5, 'S8': 12, 'REL': 19, 'DESIGN': 18}
PRD codes 143 covered 143 not yet covered: []
design gate: boards 68 attached 68 | design cases 18
ASK (Rule 127, case kept whole) S4-20: 11 steps (over 10: ask before splitting, Rule 127)
ASK (Rule 127, case kept whole) S5-09: 12 steps (over 10: ask before splitting, Rule 127)
ASK (Rule 127, case kept whole) S7-01: 13 steps (over 10: ask before splitting, Rule 127)
```
`python3 authoring/render_setup.py`: setup file regenerated (1,770 lines). No precondition changed, so every recipe is unchanged; the
header now records this pass. Two facts in the setup file were stale and are corrected by the regeneration: the 9 tech-plan cases now
link their real C-ids (C715564–C715572, from `testrail-id-map.csv`), and question 41 is recorded as in the sheet and unanswered.

**Final scan** (own scan, re-run on the built library and on `DR-PROPOSALS.json`): `cases 144 steps 681 flagged 0`.

## 2. How a bundled step was split (applied the same way in every case)
- Each action is its own step, in the same order, in the screen's own words. The old step's result goes on the step that produces it;
  a new intermediate step gets a plain, neutral observation of that action ("the dropdown opens.", "the work order's menu opens.",
  "the Edit Customer window opens.", "the staff record saves.", "the report shows today's date range."). No new behaviour was claimed:
  every other result line is the old line, moved or split along the old sentence's own parts.
- **Shared helpers split** (`cases_s5_s8.py`, `common.py`): `SBR_STEP` ("Open Reports > Sales By Representative, set the date range to
  today, turn Show Unassigned on and turn the Sales Type column on in the column selector") is gone; it is now up to four steps from
  `common.py` (`OPEN_SBR`, `TODAY`, `UNASSIGNED_ON`, `SALES_TYPE_ON`), used only where the case needs each one. `PR` (open menu, click
  Print Work Order, read the row) is now `MENU` + "Click Print Work Order and read the Sales Representative row of the printout."
  `LOG` (open menu, click Audit Log) is now `MENU` + "Click Audit Log." A new helper `SR()` writes each step with its own result, so
  the "Step N:" numbering cannot drift.
- **Kept together on purpose** (one action and the reading of its own outcome, as the brief allows): "Export the PDF and read the filter
  line", "Click Print Work Order and read the Sales Representative row of the printout", "Turn Show Unassigned on and write down the
  report total", "Hover over … and compare with the picture of board …", "Start deactivating … and read the Deactivate window".
- **Judged to be ONE action and left as written** (each names one task with one outcome; splitting it into clicks would add steps a
  tester does not need): "Invoice {Work-order-1}.", "Reverse the invoice …", "Split {Work-order-1} with Split Work Order, moving one
  line to the new work order." (S2-12; also S4-27), "Move one line of {Work-order-1} to … {Work-order-2}." (S2-13), "Change / Set …
  to …", "Add the "Sales Representative - Parts" field." (S5-09, D-09, D-11, D-13, D-18), "Create a new part sale for …". Location
  prefixes ("In the second tab, …", "In the first window, …", "On {Work-order-1}'s Finance tab, …" in S5-02 and REL-18, "In Settings >
  Staff, …") say where the one action happens; they are not a second action.

## 3. Steps removed as unnecessary, and steps added because the case could not be run without them
QA lead, 22 Oct 2026: no step a tester does not need; never remove one a tester needs.
| Case | What | Why |
|---|---|---|
| S5-01 C665962, S5-02 C665963, S5-03 C665964, S5-04 C665965, S5-05 C665966, S5-07 C665968, S5-08 C665969, S5-10 C665971, S5-13 C665974, S5-20 C715569, S5-16 C665992, S2-10 C665934 | "Turn Show Unassigned on" (part of the old bundled report step) **not carried over** | Nothing in these cases is credited to Unassigned; no result depends on it. |
| S5-06 C665967 | "Turn the Sales Type column on" **not carried over** | No result reads the Sales Type column (the case checks who gets each fee). Show Unassigned kept: {Work-order-3}'s fee goes to Unassigned. |
| S5-19 C715568 | "Open Reports > Sales By Representative" **not carried over** | The starting screen already has the report open. |
| S5-11 C665972 | "close the selector" **removed** | Signing out does not need the selector closed; the result does not depend on it. |
| S6-01 C665976 | three separate "Read the Sales Representative row of the printout." steps **folded into** the Print click | The reading is that click's own result (same form as S6-02 to S6-05); the result lines are unchanged in substance ("the printout opens and the row reads …"). |
| S4-12 C665951 | **added** "Turn the Sales Type column on in the column selector." | The result reads a "Part Sales" row, which only the Sales Type column shows. Without it the case could not be judged. |
| REL-02 C666004 | **added** "Turn the Sales Type column on in the column selector." | The result reads one "Labor, Parts" row "when the Sales Type column is on". |
| S1-10 C665924 | "With the connection back" is now its own step, "Bring the connection back." | It was an action hidden in a phrase. |
| REL-14 C666016 | "with the Sales Type column off" became "Set the date range to today, leaving the Sales Type column off." | Not an action; kept as the condition of the date step. |
| S8-03 C665986 | "Find the filter that used to read "Product Type" and open it." → "Open the filter that used to read "Product Type"." | One action (open); same result. |
| REL-05 C666007 | "Change a column and the sort, leave the report and open it again." → four steps (turn a column on or off in the column selector; change the sort; leave the report for another page; open the report again) | Four actions. |
No existing step in an unchanged case was found unnecessary: every reading step there is the case's check (for example S1-01's two
look steps, S4-04 "Look beside the first field for the + button", S5-17's sums, S7-03's count).

## 4. Rule 127 — three cases now over 10 steps, kept whole: please decide
The build gate used to fail a case over 10 steps. Rule 127 says such a case is written whole and listed for you, so `authoring/build.py`
now prints it as `ASK (Rule 127, case kept whole)` and no longer fails on it; every other check still fails the build.
| Case | Title | Preconditions | Steps | Why a split might help | What a split costs |
|---|---|---|---|---|---|
| S4-20 [C665959](https://shopview.testrail.io/index.php?/cases/view/665959) | Renaming a rep updates every customer, and a switched-off rep stays | 5 (incl. the Blocked line) | 11 (was 7) | Two behaviours: rename (steps 1-4) and a switched-off rep staying on save (steps 5-11). | One new C-id; run 547 history stays on C665959; automation links point at C665959. |
| S5-09 [C665970](https://shopview.testrail.io/index.php?/cases/view/665970) | Report totals are the same split or not when Show Unassigned is on | 7 | 12 (was 4) | Steps 1-4 (unsplit total) and 5-12 (split total) could be two cases with their own work orders. | Same as above, for C665970. |
| S7-01 [C665981](https://shopview.testrail.io/index.php?/cases/view/665981) | Each representative change writes one log entry with before and after | 6 | 13 (was 6) | Three log checks (pick, add Parts, remove Parts). | Same as above, for C665981. |

## 5. Every changed case, part by part (Rule 134)
Each changed case was re-read top to bottom against the sources in the header. The comparison is by script against `before/proposals.json`
and the script stops if any part other than Steps and Results differs (it did not). Build line and marker were also compared (CONFIRMED);
the setup recipe is unchanged because no precondition changed. Design-recheck cases: §6.
| Key | Case | Steps before → after | Title | Preconditions + For example | Steps | Results | Quotes | From lines | Build line | References from Design | Notes | Marker | Refs | Setup recipe |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| S1-04 | [C665918](https://shopview.testrail.io/index.php?/cases/view/665918) | 3 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S1-07 | [C665921](https://shopview.testrail.io/index.php?/cases/view/665921) | 4 → 6 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S1-08 | [C665922](https://shopview.testrail.io/index.php?/cases/view/665922) | 4 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S1-09 | [C665923](https://shopview.testrail.io/index.php?/cases/view/665923) | 3 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S1-10 | [C665924](https://shopview.testrail.io/index.php?/cases/view/665924) | 2 → 6 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S2-01 | [C665925](https://shopview.testrail.io/index.php?/cases/view/665925) | 5 → 6 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S2-02 | [C665926](https://shopview.testrail.io/index.php?/cases/view/665926) | 2 → 3 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S2-03 | [C665927](https://shopview.testrail.io/index.php?/cases/view/665927) | 4 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S2-04 | [C665928](https://shopview.testrail.io/index.php?/cases/view/665928) | 4 → 8 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S2-07 | [C665931](https://shopview.testrail.io/index.php?/cases/view/665931) | 4 → 7 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S2-10 | [C665934](https://shopview.testrail.io/index.php?/cases/view/665934) | 4 → 6 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S2-11 | [C665935](https://shopview.testrail.io/index.php?/cases/view/665935) | 4 → 6 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S2-14 | [C690667](https://shopview.testrail.io/index.php?/cases/view/690667) | 5 → 8 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S2-15 | [C715564](https://shopview.testrail.io/index.php?/cases/view/715564) | 5 → 7 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S3-02 | [C665938](https://shopview.testrail.io/index.php?/cases/view/665938) | 5 → 6 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S3-03 | [C665939](https://shopview.testrail.io/index.php?/cases/view/665939) | 5 → 7 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S4-01 | [C665940](https://shopview.testrail.io/index.php?/cases/view/665940) | 3 → 4 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S4-02 | [C665941](https://shopview.testrail.io/index.php?/cases/view/665941) | 3 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S4-03 | [C665942](https://shopview.testrail.io/index.php?/cases/view/665942) | 4 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S4-04 | [C665943](https://shopview.testrail.io/index.php?/cases/view/665943) | 4 → 6 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S4-05 | [C665944](https://shopview.testrail.io/index.php?/cases/view/665944) | 2 → 3 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S4-06 | [C665945](https://shopview.testrail.io/index.php?/cases/view/665945) | 2 → 4 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S4-07 | [C665946](https://shopview.testrail.io/index.php?/cases/view/665946) | 4 → 6 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S4-09 | [C665948](https://shopview.testrail.io/index.php?/cases/view/665948) | 2 → 3 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S4-12 | [C665951](https://shopview.testrail.io/index.php?/cases/view/665951) | 3 → 7 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S4-14 | [C665953](https://shopview.testrail.io/index.php?/cases/view/665953) | 4 → 8 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S4-15 | [C665954](https://shopview.testrail.io/index.php?/cases/view/665954) | 4 → 7 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S4-16 | [C665955](https://shopview.testrail.io/index.php?/cases/view/665955) | 2 → 4 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S4-17 | [C665956](https://shopview.testrail.io/index.php?/cases/view/665956) | 2 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S4-19 | [C665958](https://shopview.testrail.io/index.php?/cases/view/665958) | 4 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S4-20 | [C665959](https://shopview.testrail.io/index.php?/cases/view/665959) | 7 → 11 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S4-25 | [C690668](https://shopview.testrail.io/index.php?/cases/view/690668) | 4 → 7 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S4-26 | [C690669](https://shopview.testrail.io/index.php?/cases/view/690669) | 4 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S3-04 | [C690672](https://shopview.testrail.io/index.php?/cases/view/690672) | 4 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S4-28 | [C715567](https://shopview.testrail.io/index.php?/cases/view/715567) | 4 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S5-01 | [C665962](https://shopview.testrail.io/index.php?/cases/view/665962) | 6 → 8 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S5-02 | [C665963](https://shopview.testrail.io/index.php?/cases/view/665963) | 4 → 6 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S5-03 | [C665964](https://shopview.testrail.io/index.php?/cases/view/665964) | 5 → 7 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S5-04 | [C665965](https://shopview.testrail.io/index.php?/cases/view/665965) | 4 → 6 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S5-05 | [C665966](https://shopview.testrail.io/index.php?/cases/view/665966) | 4 → 7 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S5-06 | [C665967](https://shopview.testrail.io/index.php?/cases/view/665967) | 3 → 7 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S5-07 | [C665968](https://shopview.testrail.io/index.php?/cases/view/665968) | 4 → 8 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S5-08 | [C665969](https://shopview.testrail.io/index.php?/cases/view/665969) | 6 → 9 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S5-09 | [C665970](https://shopview.testrail.io/index.php?/cases/view/665970) | 4 → 12 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S5-10 | [C665971](https://shopview.testrail.io/index.php?/cases/view/665971) | 4 → 6 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S5-11 | [C665972](https://shopview.testrail.io/index.php?/cases/view/665972) | 4 → 6 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S5-12 | [C665973](https://shopview.testrail.io/index.php?/cases/view/665973) | 3 → 4 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S5-13 | [C665974](https://shopview.testrail.io/index.php?/cases/view/665974) | 4 → 7 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S5-14 | [C665975](https://shopview.testrail.io/index.php?/cases/view/665975) | 3 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S6-01 | [C665976](https://shopview.testrail.io/index.php?/cases/view/665976) | 7 → 9 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S6-02 | [C665977](https://shopview.testrail.io/index.php?/cases/view/665977) | 2 → 6 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S6-03 | [C665978](https://shopview.testrail.io/index.php?/cases/view/665978) | 2 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S6-04 | [C665979](https://shopview.testrail.io/index.php?/cases/view/665979) | 1 → 2 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S6-05 | [C665980](https://shopview.testrail.io/index.php?/cases/view/665980) | 1 → 2 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S7-01 | [C665981](https://shopview.testrail.io/index.php?/cases/view/665981) | 6 → 13 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S7-02 | [C665982](https://shopview.testrail.io/index.php?/cases/view/665982) | 2 → 3 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S7-03 | [C665983](https://shopview.testrail.io/index.php?/cases/view/665983) | 3 → 7 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S7-05 | [C690670](https://shopview.testrail.io/index.php?/cases/view/690670) | 4 → 8 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S8-01 | [C665984](https://shopview.testrail.io/index.php?/cases/view/665984) | 4 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S8-02 | [C665985](https://shopview.testrail.io/index.php?/cases/view/665985) | 3 → 7 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S8-03 | [C665986](https://shopview.testrail.io/index.php?/cases/view/665986) | 4 → 4 | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S8-04 | [C665987](https://shopview.testrail.io/index.php?/cases/view/665987) | 4 → 10 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S8-12 | [C690671](https://shopview.testrail.io/index.php?/cases/view/690671) | 4 → 7 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S5-19 | [C715568](https://shopview.testrail.io/index.php?/cases/view/715568) | 2 → 4 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S5-20 | [C715569](https://shopview.testrail.io/index.php?/cases/view/715569) | 5 → 7 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S4-23 | [C665989](https://shopview.testrail.io/index.php?/cases/view/665989) | 3 → 6 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S4-24 | [C665990](https://shopview.testrail.io/index.php?/cases/view/665990) | 3 → 6 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S5-16 | [C665992](https://shopview.testrail.io/index.php?/cases/view/665992) | 5 → 7 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S7-04 | [C665994](https://shopview.testrail.io/index.php?/cases/view/665994) | 2 → 3 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S8-07 | [C665997](https://shopview.testrail.io/index.php?/cases/view/665997) | 3 → 4 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S8-09 | [C665999](https://shopview.testrail.io/index.php?/cases/view/665999) | 4 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S8-10 | [C666000](https://shopview.testrail.io/index.php?/cases/view/666000) | 2 → 4 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S8-11 | [C666001](https://shopview.testrail.io/index.php?/cases/view/666001) | 2 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| REL-16 | [C715272](https://shopview.testrail.io/index.php?/cases/view/715272) | 3 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| REL-02 | [C666004](https://shopview.testrail.io/index.php?/cases/view/666004) | 2 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| REL-03 | [C666005](https://shopview.testrail.io/index.php?/cases/view/666005) | 3 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| REL-04 | [C666006](https://shopview.testrail.io/index.php?/cases/view/666006) | 2 → 4 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| REL-05 | [C666007](https://shopview.testrail.io/index.php?/cases/view/666007) | 3 → 6 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| REL-08 | [C666010](https://shopview.testrail.io/index.php?/cases/view/666010) | 2 → 3 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| REL-11 | [C666013](https://shopview.testrail.io/index.php?/cases/view/666013) | 2 → 3 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| REL-14 | [C666016](https://shopview.testrail.io/index.php?/cases/view/666016) | 3 → 4 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| REL-17 | [C715570](https://shopview.testrail.io/index.php?/cases/view/715570) | 4 → 6 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| REL-18 | [C715571](https://shopview.testrail.io/index.php?/cases/view/715571) | 3 → 4 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| REL-19 | [C715572](https://shopview.testrail.io/index.php?/cases/view/715572) | 2 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| D-02 | [C666018](https://shopview.testrail.io/index.php?/cases/view/666018) | 4 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| D-03 | [C666019](https://shopview.testrail.io/index.php?/cases/view/666019) | 2 → 3 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| D-05 | [C666021](https://shopview.testrail.io/index.php?/cases/view/666021) | 5 → 9 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| D-07 | [C666023](https://shopview.testrail.io/index.php?/cases/view/666023) | 1 → 2 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| D-09 | [C666025](https://shopview.testrail.io/index.php?/cases/view/666025) | 2 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| D-11 | [C666027](https://shopview.testrail.io/index.php?/cases/view/666027) | 7 → 9 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| D-13 | [C666029](https://shopview.testrail.io/index.php?/cases/view/666029) | 3 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| D-14 | [C666030](https://shopview.testrail.io/index.php?/cases/view/666030) | 4 → 5 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| D-15 | [C666031](https://shopview.testrail.io/index.php?/cases/view/666031) | 6 → 10 | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |



**Unchanged cases (every step already one action, no unnecessary step; all parts CONFIRMED):**
S1-01 (C665915), S1-02 (C665916), S1-03 (C665917), S1-05 (C665919), S1-06 (C665920), S1-11 (C690666), S2-05 (C665929), S2-06 (C665930), S2-08 (C665932), S2-09 (C665933), S2-12 (C665936), S2-16 (C715565), S3-01 (C665937), S4-08 (C665947), S4-10 (C665949), S4-11 (C665950), S4-13 (C665952), S4-18 (C665957), S4-21 (C665960), S4-22 (C665961), S4-27 (C715566), S8-05 (C665988), S5-15 (C665991), S5-17 (C665993), S2-13 (C665995), S5-18 (C715271), S8-06 (C665996), S8-08 (C665998), REL-15 (C666002), REL-01 (C666003), REL-06 (C666008), REL-07 (C666009), REL-09 (C666011), REL-10 (C666012), REL-12 (C666014), REL-13 (C666015), D-01 (C666017), D-04 (C666020), D-06 (C666022), D-08 (C666024), D-10 (C666026), D-12 (C666028), D-16 (C666032), D-17 (C666033), D-18 (C666034)

## 6. The six design-recheck cases (not in the library)
| Case | Steps before → after | Title | Preconditions | Steps | Results | Quotes | From lines | Build line | References from Design | Notes | Marker | Refs | Setup recipe |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| DR-03 [C690660](https://shopview.testrail.io/index.php?/cases/view/690660) | 4 → 5 | CONFIRMED | CONFIRMED | CHANGED (turn the Sales Type column on / expand {Sales-rep-A}) | CHANGED (old Step 1 result on new Step 2; new Step 1 "a Sales Type column shows.") | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| DR-04 [C690661](https://shopview.testrail.io/index.php?/cases/view/690661) | 3 → 4 | CONFIRMED | CONFIRMED | CHANGED (expand {Sales-rep-A} / expand {Sales-rep-B} and write down the dates) | CHANGED (new Step 1 "{Sales-rep-A}'s invoice rows show."; old Step 1 result on Step 2) | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| DR-07 [C690664](https://shopview.testrail.io/index.php?/cases/view/690664) | 4 → 5 | CONFIRMED | CONFIRMED | CHANGED (expand {Sales-rep-A} / expand {Sales-rep-B}) | CHANGED (as DR-04) | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| DR-01 [C690658](https://shopview.testrail.io/index.php?/cases/view/690658) | 3 → 3 | all parts CONFIRMED: every step is one action (step 3 "Open {Work-order-2} and compare …" is an action and the reading of its outcome) |
| DR-02 [C690659](https://shopview.testrail.io/index.php?/cases/view/690659) | 3 → 3 | all parts CONFIRMED |
| DR-06 [C690663](https://shopview.testrail.io/index.php?/cases/view/690663) | 4 → 4 | all parts CONFIRMED |
In `DR-PROPOSALS.json` everything below the results list is byte-identical to the current bodies (checked by script).

## 7. Observations (nothing changed for them)
- Turning a staff member's "Sales Representative" switch off is written with a save in S1-07, S1-09, S4-20 and S4-23 and without one in
  S6-01 and S6-02. Whether the switch saves on its own cannot be known until a build exists; the build verification session should
  settle it and make the cases agree.
- C690661 and C690664 name the "Labor row" and "Parts row" with the Sales Type column off; the tester can still tell them apart by the
  representative each sits under ({Sales-rep-A} holds only Labor, {Sales-rep-B} only Parts), so they stay runnable.
- Over 10 steps after this pass: only the three cases in §4. The step-count target (about 10) was otherwise kept by not adding steps a
  tester does not need (§3).

## 8. Waiting on the PO (Rule 132)
- Sheet https://docs.google.com/spreadsheets/d/17Ry1BtRTPEkecBP5TlgAE0T93Ai1TQewdJ7B7WpWDBQ — answer column read 22 Oct 2026: questions 1-40
  answered; **question 41** (rows 48-49, light orange: what a newly added "Sales Representative - Part Sales" field starts with when the
  Service Parts person's switch is off) is **unanswered**. No case is held on it.

## 9. What the QA lead needs to decide
1. The three Rule 127 cases in §4: split or keep whole.
2. Go-ahead for the TestRail writes: `update_case` for the 93 library cases (fields in `authoring/proposals.json`) and the 3 design-recheck
   cases (`DR-PROPOSALS.json`), each read back field by field. These cases are already in run 547; nothing is added or removed from it.
   The write pass must check each case's Automated flag in TestRail before writing (Rule 71); this draft did not read TestRail.

## Appendix — every changed library case, steps before and after
**S1-04 (C665918)** 3 → 5
- Before: 1. Hover over the Sales Representative field and look inside it for an x. | 2. Click the field and click "Unassigned". | 3. Reload the page and click the field.
- After: 1. Hover over the Sales Representative field and look inside it for an x. | 2. Click the field. | 3. Click "Unassigned". | 4. Reload the page. | 5. Click the field.

**S1-07 (C665921)** 4 → 6
- Before: 1. Open {Sales-rep-B}'s staff record, turn the "Sales Representative" switch off and save. | 2. Open {Work-order-1}. | 3. Click the Sales Representative field. | 4. Click on an empty part of the page to close the dropdown.
- After: 1. Open {Sales-rep-B}'s staff record. | 2. Turn the "Sales Representative" switch off. | 3. Save the staff record. | 4. Open {Work-order-1}. | 5. Click the Sales Representative field. | 6. Click on an empty part of the page to close the dropdown.

**S1-08 (C665922)** 4 → 5
- Before: 1. Deactivate {Sales-rep-B}'s staff account (confirm any warning). | 2. Open {Work-order-1}. | 3. Click the Sales Representative field. | 4. Click {Sales-rep-A}.
- After: 1. Start deactivating {Sales-rep-B}'s staff account. | 2. Confirm the deactivation. | 3. Open {Work-order-1}. | 4. Click the Sales Representative field. | 5. Click {Sales-rep-A}.

**S1-09 (C665923)** 3 → 5
- Before: 1. In the first tab, click the Sales Representative field so the dropdown lists {Sales-rep-B}. | 2. In the second tab, open {Sales-rep-B}'s staff record, turn the "Sales Representative" switch off and save. | 3. Back in the first tab, without reloading, click {Sales-rep-B} in the open dropdown.
- After: 1. In the first tab, click the Sales Representative field so the dropdown lists {Sales-rep-B}. | 2. In the second tab, open {Sales-rep-B}'s staff record. | 3. Turn the "Sales Representative" switch off. | 4. Save the staff record. | 5. Back in the first tab, without reloading, click {Sales-rep-B} in the open dropdown.

**S1-10 (C665924)** 2 → 6
- Before: 1. Make the save of a Sales Representative change fail (for example by going offline in the browser) and pick {Sales-rep-A}. | 2. With the connection back, pick {Sales-rep-B} and, before it finishes saving, pick {Sales-rep-A} and click the + button.
- After: 1. Make the next save of a Sales Representative change fail (for example by going offline in the browser). | 2. Pick {Sales-rep-A} in the Sales Representative field. | 3. Bring the connection back. | 4. Pick {Sales-rep-B} in the Sales Representative field. | 5. Before that save finishes, pick {Sales-rep-A}. | 6. Before that save finishes, click the + button.

**S2-01 (C665925)** 5 → 6
- Before: 1. Hover over the Sales Representative field and hover over the + button beside it. | 2. Click the + button. | 3. Click "Sales Representative - Parts" in the menu. | 4. Look at both fields without clicking anything. | 5. Reload the page.
- After: 1. Hover over the Sales Representative field. | 2. Hover over the + button. | 3. Click the + button. | 4. Click "Sales Representative - Parts" in the menu. | 5. Look at both fields without clicking anything. | 6. Reload the page.

**S2-02 (C665926)** 2 → 3
- Before: 1. Hover over the Sales Representative field and click the + button. | 2. Click "Sales Representative - Parts".
- After: 1. Hover over the Sales Representative field. | 2. Click the + button. | 3. Click "Sales Representative - Parts".

**S2-03 (C665927)** 4 → 5
- Before: 1. Hover over the Sales Representative field and click the + button. | 2. Press Escape. | 3. Click the + button again. | 4. Click on an empty part of the page outside the menu.
- After: 1. Hover over the Sales Representative field. | 2. Click the + button. | 3. Press Escape. | 4. Click the + button again. | 5. Click on an empty part of the page outside the menu.

**S2-04 (C665928)** 4 → 8
- Before: 1. Click "Sales Representative - Parts" and pick {Sales-rep-B}. | 2. Click "Sales Representative - Labor" and pick "Unassigned". | 3. Reload the page. | 4. Click "Sales Representative - Labor" and pick {Sales-rep-B}, then reload the page.
- After: 1. Click "Sales Representative - Parts". | 2. Click {Sales-rep-B} in the dropdown. | 3. Click "Sales Representative - Labor". | 4. Click "Unassigned" in the dropdown. | 5. Reload the page. | 6. Click "Sales Representative - Labor". | 7. Click {Sales-rep-B} in the dropdown. | 8. Reload the page.

**S2-07 (C665931)** 4 → 7
- Before: 1. Hover over the Sales Representative field, click the + and click "Sales Representative - Parts". | 2. Reload the page. | 3. Click "Sales Representative - Parts" and pick {Sales-rep-A}. | 4. Click the remove x beside "Sales Representative - Parts".
- After: 1. Hover over the Sales Representative field. | 2. Click the + button. | 3. Click "Sales Representative - Parts". | 4. Reload the page. | 5. Click "Sales Representative - Parts". | 6. Click {Sales-rep-A} in the dropdown. | 7. Click the remove x beside "Sales Representative - Parts".

**S2-10 (C665934)** 4 → 6
- Before: 1. Reverse the invoice of {Work-order-1}. | 2. Click the Sales Representative field and pick {Sales-rep-B}. | 3. Invoice {Work-order-1} again. | 4. Open Reports > Sales By Representative for today, with Show Unassigned on.
- After: 1. Reverse the invoice of {Work-order-1}. | 2. Click the Sales Representative field. | 3. Click {Sales-rep-B} in the dropdown. | 4. Invoice {Work-order-1} again. | 5. Open Reports > Sales By Representative. | 6. Set the date range to today.

**S2-11 (C665935)** 4 → 6
- Before: 1. Hover over the part sale's Sales Representative field. | 2. Click the field and pick {Sales-rep-A}. | 3. Reload the page. | 4. Open the part sale's log from its menu and read the newest entry.
- After: 1. Hover over the part sale's Sales Representative field. | 2. Click the field. | 3. Click {Sales-rep-A} in the dropdown. | 4. Reload the page. | 5. Open the part sale's menu. | 6. Open the log from the menu and read the newest entry.

**S2-14 (C690667)** 5 → 8
- Before: 1. In the first window, hover over the Sales Representative field, click the + and click "Sales Representative - Parts". | 2. In the second window, without reloading, click the Sales Representative field and pick {Sales-rep-B}. | 3. Wait until the second window's change has saved. Do not reload either window. | 4. Reload the first window. | 5. Reload the second window.
- After: 1. In the first window, hover over the Sales Representative field. | 2. In the first window, click the + button. | 3. In the first window, click "Sales Representative - Parts". | 4. In the second window, without reloading, click the Sales Representative field. | 5. In the second window, click {Sales-rep-B} in the dropdown. | 6. Wait until the second window's change has saved. Do not reload either window. | 7. Reload the first window. | 8. Reload the second window.

**S2-15 (C715564)** 5 → 7
- Before: 1. Open {Work-order-1}'s history and open the version saved after both representatives were set. | 2. Without hovering, read the representative fields. | 3. Hover over the representative rows and click "Sales Representative - Parts". | 4. Measure the gaps between Lead Technician, Service Advisor and both representative fields. | 5. Open the work order's menu and look for Print Work Order.
- After: 1. Open {Work-order-1}'s history. | 2. Open the version saved after both representatives were set. | 3. Without hovering, read the representative fields. | 4. Hover over the representative rows. | 5. Click "Sales Representative - Parts". | 6. Measure the gaps between Lead Technician, Service Advisor and both representative fields. | 7. Open the work order's menu and look for Print Work Order.

**S3-02 (C665938)** 5 → 6
- Before: 1. Tap the card's edit button to expand it and look at the Sales Representative field without tapping it. | 2. Tap the Sales Representative field. | 3. Tap "Unassigned". | 4. Tap the + button and tap "Sales Representative - Parts". | 5. Tap the remove x beside "Sales Representative - Parts".
- After: 1. Tap the card's edit button to expand it and look at the Sales Representative field without tapping it. | 2. Tap the Sales Representative field. | 3. Tap "Unassigned". | 4. Tap the + button. | 5. Tap "Sales Representative - Parts". | 6. Tap the remove x beside "Sales Representative - Parts".

**S3-03 (C665939)** 5 → 7
- Before: 1. Open Edit Customer. | 2. Tap the Sales Representative field and tap {Sales-rep-A}. | 3. Tap the + and tap "Sales Representative - Service Parts". | 4. Tap the remove x beside "Sales Representative - Service Parts". | 5. Save the customer.
- After: 1. Open Edit Customer. | 2. Tap the Sales Representative field. | 3. Tap {Sales-rep-A}. | 4. Tap the +. | 5. Tap "Sales Representative - Service Parts". | 6. Tap the remove x beside "Sales Representative - Service Parts". | 7. Save the customer.

**S4-01 (C665940)** 3 → 4
- Before: 1. Open Edit Customer. | 2. Click the Sales Representative field and read the options. | 3. Close the dropdown and save the customer without picking anyone.
- After: 1. Open Edit Customer. | 2. Click the Sales Representative field and read the options. | 3. Close the dropdown without picking anyone. | 4. Save the customer.

**S4-02 (C665941)** 3 → 5
- Before: 1. Open New Customer. | 2. Fill in the required customer details, pick {Sales-rep-A} in Sales Representative and save. | 3. Open the new customer's page.
- After: 1. Open New Customer. | 2. Fill in the required customer details. | 3. Pick {Sales-rep-A} in Sales Representative. | 4. Save the customer. | 5. Open the new customer's page.

**S4-03 (C665942)** 4 → 5
- Before: 1. Open Edit Customer and hover over the + beside Sales Representative. | 2. Click the +. | 3. Click "Sales Representative - Service Parts". | 4. Click the + again.
- After: 1. Open Edit Customer. | 2. Hover over the + beside Sales Representative. | 3. Click the +. | 4. Click "Sales Representative - Service Parts". | 5. Click the + again.

**S4-04 (C665943)** 4 → 6
- Before: 1. Open Edit Customer, click the + and click "Sales Representative - Part Sales". | 2. Look beside the first field for the + button. | 3. Change "Sales Representative - Service Parts" to {Sales-rep-C}. | 4. Save the customer and look at its page.
- After: 1. Open Edit Customer. | 2. Click the +. | 3. Click "Sales Representative - Part Sales". | 4. Look beside the first field for the + button. | 5. Change "Sales Representative - Service Parts" to {Sales-rep-C}. | 6. Save the customer and look at its page.

**S4-05 (C665944)** 2 → 3
- Before: 1. Open Edit Customer and click the remove x beside "Sales Representative - Service Parts". | 2. Save the customer and look at its page.
- After: 1. Open Edit Customer. | 2. Click the remove x beside "Sales Representative - Service Parts". | 3. Save the customer and look at its page.

**S4-06 (C665945)** 2 → 4
- Before: 1. Open Edit Customer, click the remove x beside "Sales Representative - Part Sales" and save. | 2. Create a new part sale for {Customer-A} and look at its Sales Representative field.
- After: 1. Open Edit Customer. | 2. Click the remove x beside "Sales Representative - Part Sales". | 3. Save the customer. | 4. Create a new part sale for {Customer-A} and look at its Sales Representative field.

**S4-07 (C665946)** 4 → 6
- Before: 1. Open Edit Customer, click the + and add "Sales Representative - Service Parts". | 2. Change Service Parts to {Sales-rep-B}. | 3. Close the window without saving (Cancel or the window's close button). | 4. Open Edit Customer again.
- After: 1. Open Edit Customer. | 2. Click the +. | 3. Click "Sales Representative - Service Parts". | 4. Change Service Parts to {Sales-rep-B}. | 5. Close the window without saving (Cancel or the window's close button). | 6. Open Edit Customer again.

**S4-09 (C665948)** 2 → 3
- Before: 1. Create a new work order for {Customer-A}. | 2. Open the work order's Audit Log from its menu.
- After: 1. Create a new work order for {Customer-A}. | 2. Open the work order's menu. | 3. Click Audit Log.

**S4-12 (C665951)** 3 → 7
- Before: 1. Create a new part sale for {Customer-A}. | 2. Add a part and invoice the part sale without picking a representative. | 3. Open Reports > Sales By Representative for today with Show Unassigned on.
- After: 1. Create a new part sale for {Customer-A}. | 2. Add a part to the part sale. | 3. Invoice the part sale without picking a representative. | 4. Open Reports > Sales By Representative. | 5. Set the date range to today. | 6. Turn Show Unassigned on. | 7. Turn the Sales Type column on in the column selector.

**S4-14 (C665953)** 4 → 8
- Before: 1. Change the work order's Sales Representative to {Sales-rep-C}. | 2. Change the work order's customer to {Customer-B}. | 3. Open {Customer-A}'s page. | 4. Change {Customer-B}'s Sales Representative to {Sales-rep-A} in Edit Customer and save, then open {Work-order-1} again.
- After: 1. Change the work order's Sales Representative to {Sales-rep-C}. | 2. Change the work order's customer to {Customer-B}. | 3. Open {Customer-A}'s page. | 4. Open {Customer-B}'s page. | 5. Open Edit Customer. | 6. Change the Sales Representative field to {Sales-rep-A}. | 7. Save the customer. | 8. Open {Work-order-1} again.

**S4-15 (C665954)** 4 → 7
- Before: 1. Open {Customer-A}'s page. | 2. Create a new work order for {Customer-A} with one labor line and one part. | 3. Invoice the work order without picking a representative. | 4. Open Reports > Sales By Representative for today.
- After: 1. Open {Customer-A}'s page. | 2. Create a new work order for {Customer-A}. | 3. Add one labor line to the work order. | 4. Add one part to the work order. | 5. Invoice the work order without picking a representative. | 6. Open Reports > Sales By Representative. | 7. Set the date range to today.

**S4-16 (C665955)** 2 → 4
- Before: 1. Invoice {Work-order-1}. | 2. Open Reports > Sales By Representative for today with the Sales Type column turned on.
- After: 1. Invoice {Work-order-1}. | 2. Open Reports > Sales By Representative. | 3. Set the date range to today. | 4. Turn the Sales Type column on in the column selector.

**S4-17 (C665956)** 2 → 5
- Before: 1. Invoice {Work-order-1}. | 2. Open Reports > Sales By Representative for today with Show Unassigned on and the Sales Type column on.
- After: 1. Invoice {Work-order-1}. | 2. Open Reports > Sales By Representative. | 3. Set the date range to today. | 4. Turn Show Unassigned on. | 5. Turn the Sales Type column on in the column selector.

**S4-19 (C665958)** 4 → 5
- Before: 1. Start deactivating {Sales-rep-B}'s account and read the Deactivate window. | 2. Cancel the deactivation. | 3. Open {Sales-rep-B}'s staff record, turn the "Sales Representative" switch off and read the "Turn Off Sales Representative" warning. | 4. Cancel the warning.
- After: 1. Start deactivating {Sales-rep-B}'s account and read the Deactivate window. | 2. Cancel the deactivation. | 3. Open {Sales-rep-B}'s staff record. | 4. Turn the "Sales Representative" switch off and read the "Turn Off Sales Representative" warning. | 5. Cancel the warning.

**S4-20 (C665959)** 7 → 11
- Before: 1. Change {Sales-rep-B}'s last name (for example to "Brook") and save. | 2. Open {Customer-A}'s page. | 3. Open {Customer-B}'s page. | 4. Turn {Sales-rep-A}'s "Sales Representative" switch off (keep the account active) and save. | 5. Open {Customer-A}'s page again. | 6. Open Edit Customer and click the "Sales Representative - Service Labor" field. | 7. Close the dropdown without picking anything and save the customer.
- After: 1. Change {Sales-rep-B}'s last name (for example to "Brook"). | 2. Save the staff record. | 3. Open {Customer-A}'s page. | 4. Open {Customer-B}'s page. | 5. Turn {Sales-rep-A}'s "Sales Representative" switch off (keep the account active). | 6. Save the staff record. | 7. Open {Customer-A}'s page again. | 8. Open Edit Customer. | 9. Click the "Sales Representative - Service Labor" field. | 10. Close the dropdown without picking anything. | 11. Save the customer.

**S4-25 (C690668)** 4 → 7
- Before: 1. Start a New Part Sale and choose to add a new customer from it. | 2. Click the Sales Representative field in the New Customer window. | 3. Read the options in the dropdown from top to bottom. | 4. Pick {Sales-rep-A}, fill in the required details and save the customer.
- After: 1. Start a New Part Sale. | 2. Choose to add a new customer from it. | 3. Click the Sales Representative field in the New Customer window. | 4. Read the options in the dropdown from top to bottom. | 5. Click {Sales-rep-A} in the dropdown. | 6. Fill in the required customer details. | 7. Save the customer.

**S4-26 (C690669)** 4 → 5
- Before: 1. Deactivate {Sales-rep-C}'s account (confirm the Deactivate window). | 2. Reactivate {Sales-rep-C}'s account. | 3. Open {Customer-A}'s page. | 4. Open {Customer-B}'s page.
- After: 1. Start deactivating {Sales-rep-C}'s account. | 2. Confirm the deactivation. | 3. Reactivate {Sales-rep-C}'s account. | 4. Open {Customer-A}'s page. | 5. Open {Customer-B}'s page.

**S3-04 (C690672)** 4 → 5
- Before: 1. Look at the work order card as it first opens, without tapping anything. | 2. Look at the Sales Representative field and the space to its right, without tapping them. | 3. Tap the + button and tap "Sales Representative - Parts". | 4. Look at the two fields and the space to the right of "Sales Representative - Parts", without tapping them.
- After: 1. Look at the work order card as it first opens, without tapping anything. | 2. Look at the Sales Representative field and the space to its right, without tapping them. | 3. Tap the + button. | 4. Tap "Sales Representative - Parts". | 5. Look at the two fields and the space to the right of "Sales Representative - Parts", without tapping them.

**S4-28 (C715567)** 4 → 5
- Before: 1. Open Edit Customer. | 2. Click the Sales Representative field. | 3. Read the options in the dropdown from top to bottom. | 4. Pick {Sales-rep-A} and save the customer.
- After: 1. Open Edit Customer. | 2. Click the Sales Representative field. | 3. Read the options in the dropdown from top to bottom. | 4. Click {Sales-rep-A} in the dropdown. | 5. Save the customer.

**S5-01 (C665962)** 6 → 8
- Before: 1. Invoice {Work-order-1}. | 2. Open Reports > Sales By Representative, set the date range to today, turn Show Unassigned on and turn the Sales Type column on in the column selector. | 3. Read {Sales-rep-A}'s invoice row for {Work-order-1}. | 4. Read {Sales-rep-B}'s invoice row for {Work-order-1}. | 5. Read each representative's summary row and invoice count. | 6. Look at the Sales Type column on each representative's summary row and on the Totals row.
- After: 1. Invoice {Work-order-1}. | 2. Open Reports > Sales By Representative. | 3. Set the date range to today. | 4. Turn the Sales Type column on in the column selector. | 5. Read {Sales-rep-A}'s invoice row for {Work-order-1}. | 6. Read {Sales-rep-B}'s invoice row for {Work-order-1}. | 7. Read each representative's summary row and invoice count. | 8. Look at the Sales Type column on each representative's summary row and on the Totals row.

**S5-02 (C665963)** 4 → 6
- Before: 1. On the work order's Finance tab, type a shop supplies amount of $15.00 by hand in place of the calculated $20.00. | 2. Invoice {Work-order-1}. | 3. Open Reports > Sales By Representative, set the date range to today, turn Show Unassigned on and turn the Sales Type column on in the column selector. | 4. Read the Shop Supplies column on both rows for the invoice.
- After: 1. On the work order's Finance tab, type a shop supplies amount of $15.00 by hand in place of the calculated $20.00. | 2. Invoice {Work-order-1}. | 3. Open Reports > Sales By Representative. | 4. Set the date range to today. | 5. Turn the Sales Type column on in the column selector. | 6. Read the Shop Supplies column on both rows for the invoice.

**S5-03 (C665964)** 5 → 7
- Before: 1. Invoice {Work-order-1}. | 2. Open Reports > Sales By Representative, set the date range to today, turn Show Unassigned on and turn the Sales Type column on in the column selector. | 3. Read {Sales-rep-A}'s Labor row for the invoice. | 4. Read {Sales-rep-B}'s Parts row for the invoice. | 5. Add the two rows' subtotals.
- After: 1. Invoice {Work-order-1}. | 2. Open Reports > Sales By Representative. | 3. Set the date range to today. | 4. Turn the Sales Type column on in the column selector. | 5. Read {Sales-rep-A}'s Labor row for the invoice. | 6. Read {Sales-rep-B}'s Parts row for the invoice. | 7. Add the two rows' subtotals.

**S5-04 (C665965)** 4 → 6
- Before: 1. Invoice {Work-order-1}. | 2. Open Reports > Sales By Representative, set the date range to today, turn Show Unassigned on and turn the Sales Type column on in the column selector. | 3. Read the Labor row and the Parts row for the invoice. | 4. Add the two rows' subtotals.
- After: 1. Invoice {Work-order-1}. | 2. Open Reports > Sales By Representative. | 3. Set the date range to today. | 4. Turn the Sales Type column on in the column selector. | 5. Read the Labor row and the Parts row for the invoice. | 6. Add the two rows' subtotals.

**S5-05 (C665966)** 4 → 7
- Before: 1. Invoice {Work-order-1} and {Work-order-2}. | 2. Open Reports > Sales By Representative, set the date range to today, turn Show Unassigned on and turn the Sales Type column on in the column selector. | 3. Read the Adjustments column on the Labor row and on the Parts row of {Work-order-1}'s invoice. | 4. Read the Adjustments column on the Labor row and on the Parts row of {Work-order-2}'s invoice.
- After: 1. Invoice {Work-order-1}. | 2. Invoice {Work-order-2}. | 3. Open Reports > Sales By Representative. | 4. Set the date range to today. | 5. Turn the Sales Type column on in the column selector. | 6. Read the Adjustments column on the Labor row and on the Parts row of {Work-order-1}'s invoice. | 7. Read the Adjustments column on the Labor row and on the Parts row of {Work-order-2}'s invoice.

**S5-06 (C665967)** 3 → 7
- Before: 1. Invoice {Work-order-1}, {Work-order-2} and {Work-order-3}. | 2. Open Reports > Sales By Representative, set the date range to today, turn Show Unassigned on and turn the Sales Type column on in the column selector. | 3. Find each invoice's fee in the report.
- After: 1. Invoice {Work-order-1}. | 2. Invoice {Work-order-2}. | 3. Invoice {Work-order-3}. | 4. Open Reports > Sales By Representative. | 5. Set the date range to today. | 6. Turn Show Unassigned on. | 7. Find each invoice's fee in the report.

**S5-07 (C665968)** 4 → 8
- Before: 1. Invoice {Part-sale-1}, {Part-sale-2} and {Part-sale-3}. | 2. Open Reports > Sales By Representative, set the date range to today, turn Show Unassigned on and turn the Sales Type column on in the column selector. | 3. Read {Sales-rep-A}'s rows for the three part sales. | 4. Read Labor Delta, Labor Invoiced and Labor Margin on the three part sale rows.
- After: 1. Invoice {Part-sale-1}. | 2. Invoice {Part-sale-2}. | 3. Invoice {Part-sale-3}. | 4. Open Reports > Sales By Representative. | 5. Set the date range to today. | 6. Turn the Sales Type column on in the column selector. | 7. Read {Sales-rep-A}'s rows for the three part sales. | 8. Read Labor Delta, Labor Invoiced and Labor Margin on the three part sale rows.

**S5-08 (C665969)** 6 → 9
- Before: 1. Invoice {Work-order-1} and {Work-order-2}. | 2. Open Reports > Sales By Representative, set the date range to today, turn Show Unassigned on and turn the Sales Type column on in the column selector. | 3. Read {Sales-rep-A}'s rows for {Work-order-1}'s invoice. | 4. Read {Sales-rep-A}'s row for {Work-order-2}'s invoice. | 5. Set the Sales Type filter to Labor only. | 6. Set the Sales Type filter to Parts only.
- After: 1. Invoice {Work-order-1}. | 2. Invoice {Work-order-2}. | 3. Open Reports > Sales By Representative. | 4. Set the date range to today. | 5. Turn the Sales Type column on in the column selector. | 6. Read {Sales-rep-A}'s rows for {Work-order-1}'s invoice. | 7. Read {Sales-rep-A}'s row for {Work-order-2}'s invoice. | 8. Set the Sales Type filter to Labor only. | 9. Set the Sales Type filter to Parts only.

**S5-09 (C665970)** 4 → 12
- Before: 1. Invoice {Work-order-1}, then open Sales By Representative for today with Show Unassigned on and write down the report total. | 2. Reverse the invoice, add the Parts field, set "Sales Representative - Parts" to "Unassigned" and invoice again. | 3. Open Sales By Representative for today with Show Unassigned on and read the report total. | 4. Turn Show Unassigned off and read the report total.
- After: 1. Invoice {Work-order-1}. | 2. Open Reports > Sales By Representative. | 3. Set the date range to today. | 4. Turn Show Unassigned on and write down the report total. | 5. Reverse the invoice of {Work-order-1}. | 6. Add the "Sales Representative - Parts" field to {Work-order-1}. | 7. Set "Sales Representative - Parts" to "Unassigned". | 8. Invoice {Work-order-1} again. | 9. Open Reports > Sales By Representative. | 10. Set the date range to today. | 11. Turn Show Unassigned on and read the report total. | 12. Turn Show Unassigned off and read the report total.

**S5-10 (C665971)** 4 → 6
- Before: 1. Invoice {Work-order-1}. | 2. Open Reports > Sales By Representative, set the date range to today, turn Show Unassigned on and turn the Sales Type column on in the column selector. | 3. Read the Parts row's Parts Margin and Margin %. | 4. Read the Labor row's Labor Invoiced, Labor Margin and Margin %.
- After: 1. Invoice {Work-order-1}. | 2. Open Reports > Sales By Representative. | 3. Set the date range to today. | 4. Turn the Sales Type column on in the column selector. | 5. Read the Parts row's Parts Margin and Margin %. | 6. Read the Labor row's Labor Invoiced, Labor Margin and Margin %.

**S5-11 (C665972)** 4 → 6
- Before: 1. Look at the report's columns. | 2. Open the column selector. | 3. Turn Sales Type on and close the selector. | 4. Sign out, sign in again and open Sales By Representative.
- After: 1. Look at the report's columns. | 2. Open the column selector. | 3. Turn Sales Type on. | 4. Sign out. | 5. Sign in again. | 6. Open Reports > Sales By Representative.

**S5-12 (C665973)** 3 → 4
- Before: 1. Set the date range to today and export the Expanded CSV. | 2. Open the CSV and find the rows for {Work-order-1}'s invoice. | 3. Export the Expanded PDF and find the same rows.
- After: 1. Set the date range to today. | 2. Export the Expanded CSV. | 3. Open the CSV and find the rows for {Work-order-1}'s invoice. | 4. Export the Expanded PDF and find the same rows.

**S5-13 (C665974)** 4 → 7
- Before: 1. Invoice {Work-order-1} and {Work-order-2}. | 2. Open Reports > Sales By Representative, set the date range to today, turn Show Unassigned on and turn the Sales Type column on in the column selector. | 3. Read {Sales-rep-B}'s row for {Work-order-1} and invoice count. | 4. Read {Sales-rep-A}'s row for {Work-order-2}.
- After: 1. Invoice {Work-order-1}. | 2. Invoice {Work-order-2}. | 3. Open Reports > Sales By Representative. | 4. Set the date range to today. | 5. Turn the Sales Type column on in the column selector. | 6. Read {Sales-rep-B}'s row for {Work-order-1} and invoice count. | 7. Read {Sales-rep-A}'s row for {Work-order-2}.

**S5-14 (C665975)** 3 → 5
- Before: 1. Change {Sales-rep-B}'s last name (for example to "Brook") and save. | 2. Open Sales By Representative for today. | 3. Open {Work-order-1}.
- After: 1. Change {Sales-rep-B}'s last name (for example to "Brook"). | 2. Save the staff record. | 3. Open Reports > Sales By Representative. | 4. Set the date range to today. | 5. Open {Work-order-1}.

**S6-01 (C665976)** 7 → 9
- Before: 1. Open the work order's menu and click Print Work Order. | 2. Read the Sales Representative row of the printout. | 3. Open {Work-order-2}, open its menu and click Print Work Order. | 4. Read the Sales Representative row of the printout. | 5. In Settings > Staff, turn {Sales-rep-A}'s "Sales Representative" switch off. | 6. Open {Work-order-1}, open its menu and click Print Work Order. | 7. Read the Sales Representative row of the printout.
- After: 1. Open the work order's menu. | 2. Click Print Work Order and read the Sales Representative row of the printout. | 3. Open {Work-order-2}. | 4. Open the work order's menu. | 5. Click Print Work Order and read the Sales Representative row of the printout. | 6. In Settings > Staff, turn {Sales-rep-A}'s "Sales Representative" switch off. | 7. Open {Work-order-1}. | 8. Open the work order's menu. | 9. Click Print Work Order and read the Sales Representative row of the printout.

**S6-02 (C665977)** 2 → 6
- Before: 1. Open the work order's menu, click Print Work Order and read the Sales Representative row. | 2. Turn {Sales-rep-B}'s "Sales Representative" switch off in Settings > Staff, then print {Work-order-1} again.
- After: 1. Open the work order's menu. | 2. Click Print Work Order and read the Sales Representative row of the printout. | 3. In Settings > Staff, turn {Sales-rep-B}'s "Sales Representative" switch off. | 4. Open {Work-order-1}. | 5. Open the work order's menu. | 6. Click Print Work Order and read the Sales Representative row of the printout.

**S6-03 (C665978)** 2 → 5
- Before: 1. Open the work order's menu, click Print Work Order and read the Sales Representative row. | 2. Open {Work-order-2} and print it the same way.
- After: 1. Open the work order's menu. | 2. Click Print Work Order and read the Sales Representative row of the printout. | 3. Open {Work-order-2}. | 4. Open the work order's menu. | 5. Click Print Work Order and read the Sales Representative row of the printout.

**S6-04 (C665979)** 1 → 2
- Before: 1. Open the work order's menu, click Print Work Order and read the Sales Representative row.
- After: 1. Open the work order's menu. | 2. Click Print Work Order and look for a Sales Representative row on the printout.

**S6-05 (C665980)** 1 → 2
- Before: 1. Open the work order's menu, click Print Work Order and read the Sales Representative row.
- After: 1. Open the work order's menu. | 2. Click Print Work Order and read the Sales Representative row of the printout.

**S7-01 (C665981)** 6 → 13
- Before: 1. Change Sales Representative to {Sales-rep-A}. | 2. Open the work order's menu and click Audit Log. | 3. Close the log, click the + and add "Sales Representative - Parts", then set Parts to {Sales-rep-B}. | 4. Open the work order's menu and click Audit Log. | 5. Close the log, click the remove x beside Parts. | 6. Open the work order's menu and click Audit Log.
- After: 1. Change Sales Representative to {Sales-rep-A}. | 2. Open the work order's menu. | 3. Click Audit Log. | 4. Close the log. | 5. Click the + button. | 6. Click "Sales Representative - Parts". | 7. Set "Sales Representative - Parts" to {Sales-rep-B}. | 8. Open the work order's menu. | 9. Click Audit Log. | 10. Close the log. | 11. Click the remove x beside "Sales Representative - Parts". | 12. Open the work order's menu. | 13. Click Audit Log.

**S7-02 (C665982)** 2 → 3
- Before: 1. Set "Sales Representative - Labor" to "Unassigned". | 2. Open the work order's menu and click Audit Log.
- After: 1. Set "Sales Representative - Labor" to "Unassigned". | 2. Open the work order's menu. | 3. Click Audit Log.

**S7-03 (C665983)** 3 → 7
- Before: 1. Open the work order's menu and click Audit Log. Count the "Sales representative changed" entries. | 2. Close the log, click the Sales Representative field and pick {Sales-rep-A} again. | 3. Open the work order's menu and click Audit Log.
- After: 1. Open the work order's menu. | 2. Click Audit Log and count the "Sales representative changed" entries. | 3. Close the log. | 4. Click the Sales Representative field. | 5. Click {Sales-rep-A} again. | 6. Open the work order's menu. | 7. Click Audit Log and count the "Sales representative changed" entries.

**S7-05 (C690670)** 4 → 8
- Before: 1. Set "Sales Representative - Labor" to {Sales-rep-B}. | 2. Open the work order's menu and click Audit Log. | 3. Close the log, open {Work-order-2} and set its Sales Representative to {Sales-rep-A}. | 4. Open the work order's menu and click Audit Log.
- After: 1. Set "Sales Representative - Labor" to {Sales-rep-B}. | 2. Open the work order's menu. | 3. Click Audit Log. | 4. Close the log. | 5. Open {Work-order-2}. | 6. Set its Sales Representative to {Sales-rep-A}. | 7. Open the work order's menu. | 8. Click Audit Log.

**S8-01 (C665984)** 4 → 5
- Before: 1. Open the Sales Type filter. | 2. Read the filter's label with all options selected. | 3. Untick Part Sales. | 4. Untick Labor and Parts too.
- After: 1. Open the Sales Type filter. | 2. Read the filter's label with all options selected. | 3. Untick Part Sales. | 4. Untick Labor. | 5. Untick Parts.

**S8-02 (C665985)** 3 → 7
- Before: 1. With all Sales Types selected, export the PDF and the CSV and read the filter line at the top of each. | 2. Select only Parts and Part Sales, export again and read the filter line. | 3. Untick every Sales Type and click Export.
- After: 1. With all Sales Types selected, export the PDF and read the filter line at the top. | 2. Export the CSV and read the filter line at the top. | 3. Select only Parts and Part Sales in the Sales Type filter. | 4. Export the PDF and read the filter line. | 5. Export the CSV and read the filter line. | 6. Untick every Sales Type. | 7. Click Export.

**S8-03 (C665986)** 4 → 4
- Before: 1. Find the filter that used to read "Product Type" and open it. | 2. Read its label with both options selected. | 3. Untick Service Sales. | 4. Untick Part Sales too.
- After: 1. Open the filter that used to read "Product Type". | 2. Read its label with both options selected. | 3. Untick Service Sales. | 4. Untick Part Sales too.

**S8-04 (C665987)** 4 → 10
- Before: 1. With both options selected, export the PDF and the CSV and read the filter line. | 2. Select only Part Sales and export both again. | 3. Select only Service Sales and export both again. | 4. Untick both options and click Export.
- After: 1. With both options selected, export the PDF and read the filter line. | 2. Export the CSV and read the filter line. | 3. Select only Part Sales in the Sales Type filter. | 4. Export the PDF and read the filter line. | 5. Export the CSV and read the filter line. | 6. Select only Service Sales in the Sales Type filter. | 7. Export the PDF and read the filter line. | 8. Export the CSV and read the filter line. | 9. Untick both options. | 10. Click Export.

**S8-12 (C690671)** 4 → 7
- Before: 1. Set the date range to {Date-A}, keep all three Sales Types selected and export the CSV. | 2. Export the PDF. | 3. Open Reports > Sales By Customer, set the date range to {Date-A}, keep both Sales Types selected and export the CSV. | 4. Export the PDF.
- After: 1. Set the date range to {Date-A}. | 2. With all three Sales Types selected, export the CSV. | 3. Export the PDF. | 4. Open Reports > Sales By Customer. | 5. Set the date range to {Date-A}. | 6. With both Sales Types selected, export the CSV. | 7. Export the PDF.

**S5-19 (C715568)** 2 → 4
- Before: 1. Open Reports > Sales By Representative, set the date range to today, turn Show Unassigned on and turn the Sales Type column on in the column selector. | 2. Find {Work-order-1}'s Parts row and read the representative it is listed under.
- After: 1. Set the date range to today. | 2. Turn Show Unassigned on. | 3. Turn the Sales Type column on in the column selector. | 4. Find {Work-order-1}'s Parts row and read the representative it is listed under.

**S5-20 (C715569)** 5 → 7
- Before: 1. Invoice {Work-order-1}. | 2. Open Reports > Sales By Representative, set the date range to today, turn Show Unassigned on and turn the Sales Type column on in the column selector. | 3. Read {Sales-rep-A}'s Labor row for the invoice. | 4. Read {Sales-rep-B}'s Parts row for the invoice. | 5. Add the two rows' subtotals.
- After: 1. Invoice {Work-order-1}. | 2. Open Reports > Sales By Representative. | 3. Set the date range to today. | 4. Turn the Sales Type column on in the column selector. | 5. Read {Sales-rep-A}'s Labor row for the invoice. | 6. Read {Sales-rep-B}'s Parts row for the invoice. | 7. Add the two rows' subtotals.

**S4-23 (C665989)** 3 → 6
- Before: 1. In the first tab, open Edit Customer and click the Sales Representative field so {Sales-rep-B} is listed. | 2. In the second tab, turn {Sales-rep-B}'s "Sales Representative" switch off and save. | 3. In the first tab, pick {Sales-rep-B} and save the customer.
- After: 1. In the first tab, open Edit Customer. | 2. In the first tab, click the Sales Representative field. | 3. In the second tab, turn {Sales-rep-B}'s "Sales Representative" switch off. | 4. In the second tab, save the staff record. | 5. In the first tab, click {Sales-rep-B} in the open dropdown. | 6. Save the customer.

**S4-24 (C665990)** 3 → 6
- Before: 1. Start a New Work Order and choose to add a new customer from it. | 2. Click the Sales Representative field in the New Customer window. | 3. Pick {Sales-rep-A}, fill in the required details and save the customer.
- After: 1. Start a New Work Order. | 2. Choose to add a new customer from it. | 3. Click the Sales Representative field in the New Customer window. | 4. Click {Sales-rep-A} in the dropdown. | 5. Fill in the required customer details. | 6. Save the customer.

**S5-16 (C665992)** 5 → 7
- Before: 1. Invoice {Work-order-1}. | 2. Open Reports > Sales By Representative for today with Show Unassigned on and the Sales Type column on. | 3. Read the Labor row. | 4. Read the Parts row. | 5. Add the two rows' subtotals.
- After: 1. Invoice {Work-order-1}. | 2. Open Reports > Sales By Representative. | 3. Set the date range to today. | 4. Turn the Sales Type column on in the column selector. | 5. Read the Labor row. | 6. Read the Parts row. | 7. Add the two rows' subtotals.

**S7-04 (C665994)** 2 → 3
- Before: 1. Open the work order's menu and click Audit Log. | 2. Search the log for {Sales-rep-B}'s name.
- After: 1. Open the work order's menu. | 2. Click Audit Log. | 3. Search the log for {Sales-rep-B}'s name.

**S8-07 (C665997)** 3 → 4
- Before: 1. Select only "Parts" in the Sales Type filter and expand {Sales-rep-B}. | 2. Open the invoice from {Sales-rep-B}'s row. | 3. Press the browser's back button.
- After: 1. Select only "Parts" in the Sales Type filter. | 2. Expand {Sales-rep-B}. | 3. Open the invoice from {Sales-rep-B}'s row. | 4. Press the browser's back button.

**S8-09 (C665999)** 4 → 5
- Before: 1. Expand {Customer-A}'s row. | 2. Select only "Service Sales". | 3. Expand {Customer-A} again and open the work order's invoice from it. | 4. Press the browser's back button.
- After: 1. Expand {Customer-A}'s row. | 2. Select only "Service Sales". | 3. Expand {Customer-A} again. | 4. Open the work order's invoice from {Customer-A}'s row. | 5. Press the browser's back button.

**S8-10 (C666000)** 2 → 4
- Before: 1. Look at the toolbar. | 2. Select only "Part Sales", open the Customer filter and type {Search-A}.
- After: 1. Look at the toolbar. | 2. Select only "Part Sales" in the Sales Type filter. | 3. Open the Customer filter. | 4. Type {Search-A}.

**S8-11 (C666001)** 2 → 5
- Before: 1. Tap the Sales Type filter and untick "Part Sales". | 2. Open Reports > Sales By Customer, tap the Sales Type filter and untick "Service Sales".
- After: 1. Tap the Sales Type filter. | 2. Untick "Part Sales". | 3. Open Reports > Sales By Customer. | 4. Tap the Sales Type filter. | 5. Untick "Service Sales".

**REL-16 (C715272)** 3 → 5
- Before: 1. Invoice {Part-sale-1} and {Work-order-1}. | 2. Open Reports > Sales By Representative for today and read the part sale's row. | 3. Read {Sales-rep-A}'s Labor Invoiced total and Parts Invoiced total.
- After: 1. Invoice {Part-sale-1}. | 2. Invoice {Work-order-1}. | 3. Open Reports > Sales By Representative. | 4. Set the date range to today and read the part sale's row. | 5. Read {Sales-rep-A}'s Labor Invoiced total and Parts Invoiced total.

**REL-02 (C666004)** 2 → 5
- Before: 1. Look at the work order card. | 2. Invoice {Work-order-1} and open Reports > Sales By Representative for today.
- After: 1. Look at the work order card. | 2. Invoice {Work-order-1}. | 3. Open Reports > Sales By Representative. | 4. Set the date range to today. | 5. Turn the Sales Type column on in the column selector.

**REL-03 (C666005)** 3 → 5
- Before: 1. Open the same date range with Show Unassigned on and turn the Sales Type column on. | 2. Compare each representative's summary row and the report totals with the export made before the release. | 3. Read the Sales Type of the past invoice rows.
- After: 1. Set the same date range as the export made before the release. | 2. Turn Show Unassigned on. | 3. Turn the Sales Type column on in the column selector. | 4. Compare each representative's summary row and the report totals with the export made before the release. | 5. Read the Sales Type of the past invoice rows.

**REL-04 (C666006)** 2 → 4
- Before: 1. Set a date range before 29 Jul 2026 that holds invoices, turn Show Unassigned on and the Sales Type column on. | 2. Read the rows.
- After: 1. Set a date range before 29 Jul 2026 that holds invoices. | 2. Turn Show Unassigned on. | 3. Turn the Sales Type column on in the column selector. | 4. Read the rows.

**REL-05 (C666007)** 3 → 6
- Before: 1. Look at the columns and the sort. | 2. Change a column and the sort, leave the report and open it again. | 3. Open the link bookmarked before the release.
- After: 1. Look at the columns and the sort. | 2. Turn a column on or off in the column selector. | 3. Change the sort. | 4. Leave the report for another page. | 5. Open Reports > Sales By Representative again. | 6. Open the link bookmarked before the release.

**REL-08 (C666010)** 2 → 3
- Before: 1. Open the customer-facing estimate document. | 2. Invoice the work order and open the customer-facing invoice document.
- After: 1. Open the customer-facing estimate document. | 2. Invoice the work order. | 3. Open the customer-facing invoice document.

**REL-11 (C666013)** 2 → 3
- Before: 1. Invoice {Work-order-1} and let it sync to QuickBooks. | 2. Open the invoice in QuickBooks.
- After: 1. Invoice {Work-order-1}. | 2. Wait for the invoice to sync to QuickBooks. | 3. Open the invoice in QuickBooks.

**REL-14 (C666016)** 3 → 4
- Before: 1. Invoice {Work-order-1}. | 2. Open Reports > Sales By Representative for today with the Sales Type column off. | 3. Turn the Sales Type column on.
- After: 1. Invoice {Work-order-1}. | 2. Open Reports > Sales By Representative. | 3. Set the date range to today, leaving the Sales Type column off. | 4. Turn the Sales Type column on.

**REL-17 (C715570)** 4 → 6
- Before: 1. Open a filter on the report that lets you tick several options (for example Location) and tick every option. | 2. Close the filter and read its label in the toolbar. | 3. Open the same filter again and untick options until exactly two remain ticked. | 4. Close the filter and read its label in the toolbar.
- After: 1. Open a filter on the report that lets you tick several options (for example Location). | 2. Tick every option. | 3. Close the filter and read its label in the toolbar. | 4. Open the same filter again. | 5. Untick options until exactly two remain ticked. | 6. Close the filter and read its label in the toolbar.

**REL-18 (C715571)** 3 → 4
- Before: 1. On {Work-order-1}'s Finance tab, open the invoice preview. | 2. Invoice {Work-order-1}. | 3. Open {Unit-A}'s page and its list of invoices.
- After: 1. On {Work-order-1}'s Finance tab, open the invoice preview. | 2. Invoice {Work-order-1}. | 3. Open {Unit-A}'s page. | 4. Open {Unit-A}'s list of invoices.

**REL-19 (C715572)** 2 → 5
- Before: 1. Open the work order's menu, click Audit Log and find the entry written before the release. | 2. Close the log, open {Work-order-1}'s history and open the version saved before the release.
- After: 1. Open the work order's menu. | 2. Click Audit Log and find the entry written before the release. | 3. Close the log. | 4. Open {Work-order-1}'s history. | 5. Open the version saved before the release.

**D-02 (C666018)** 4 → 5
- Before: 1. Hover over the Sales Representative row and compare with the picture of board 1.6. | 2. Measure the box and the + button. | 3. Hover over the + itself. | 4. Move the pointer away, then move into the field with the keyboard (Tab).
- After: 1. Hover over the Sales Representative row and compare with the picture of board 1.6. | 2. Measure the box and the + button. | 3. Hover over the + itself. | 4. Move the pointer away from the Sales Representative rows. | 5. Move into the field with the keyboard (Tab).

**D-03 (C666019)** 2 → 3
- Before: 1. Click the field and compare the open list with the picture of board 1.4. | 2. Pick {Sales-rep-A}, open the list again and compare with the picture of board 1.15.
- After: 1. Click the field and compare the open list with the picture of board 1.4. | 2. Click {Sales-rep-A} in the list. | 3. Open the list again and compare with the picture of board 1.15.

**D-05 (C666021)** 5 → 9
- Before: 1. Without hovering, compare the two fields with the picture of board 1.9. | 2. Hover over the rows and compare with the picture of board 1.10. | 3. Click "Sales Representative - Labor" and compare the open list with the picture of board 1.11. | 4. Close the list, set the browser zoom to 200% and look at the two labels. | 5. Set the zoom back to 100%, make the window 1536 px wide and repeat steps 1 and 2.
- After: 1. Without hovering, compare the two fields with the picture of board 1.9. | 2. Hover over the rows and compare with the picture of board 1.10. | 3. Click "Sales Representative - Labor" and compare the open list with the picture of board 1.11. | 4. Close the list. | 5. Set the browser zoom to 200% and look at the two labels. | 6. Set the browser zoom back to 100%. | 7. Make the window 1536 px wide. | 8. Without hovering, compare the two fields with the picture of board 1.9 again. | 9. Hover over the rows and compare with the picture of board 1.10 again.

**D-07 (C666023)** 1 → 2
- Before: 1. Open the list, pick "Unassigned" and compare the card with the picture of board 1.16.
- After: 1. Open the list. | 2. Click "Unassigned" and compare the card with the picture of board 1.16.

**D-09 (C666025)** 2 → 5
- Before: 1. Add the Parts field, set Parts to {Sales-rep-B}, then remove the Parts field. | 2. Open the work order's Audit Log and compare the newest entries with the picture of board 1.19.
- After: 1. Add the "Sales Representative - Parts" field. | 2. Set "Sales Representative - Parts" to {Sales-rep-B}. | 3. Click the remove x beside "Sales Representative - Parts". | 4. Open the work order's menu. | 5. Click Audit Log and compare the newest entries with the picture of board 1.19.

**D-11 (C666027)** 7 → 9
- Before: 1. Open Edit Customer, add "Sales Representative - Service Parts" and compare with the picture of board 2.8. | 2. Click the + and compare the menu with the picture of board 2.9. | 3. Add "Sales Representative - Part Sales" and compare with the picture of board 2.10. | 4. Open the Part Sales list and compare with the picture of board 2.11. | 5. Set Service Parts to {Sales-rep-B} and Part Sales to {Sales-rep-C}, then compare with the picture of board 2.12. | 6. Hover over the remove x beside Service Parts and compare with the picture of board 2.13. | 7. Click it and compare with the picture of board 2.14.
- After: 1. Open Edit Customer. | 2. Add "Sales Representative - Service Parts" and compare with the picture of board 2.8. | 3. Click the + and compare the menu with the picture of board 2.9. | 4. Add "Sales Representative - Part Sales" and compare with the picture of board 2.10. | 5. Open the Part Sales list and compare with the picture of board 2.11. | 6. Set Service Parts to {Sales-rep-B}. | 7. Set Part Sales to {Sales-rep-C} and compare with the picture of board 2.12. | 8. Hover over the remove x beside Service Parts and compare with the picture of board 2.13. | 9. Click it and compare with the picture of board 2.14.

**D-13 (C666029)** 3 → 5
- Before: 1. Open New Customer and compare with the picture of board 2.16. | 2. Type a customer name, click the + and compare with the picture of board 2.17. | 3. Add "Sales Representative - Part Sales", pick {Sales-rep-C} in it and compare with the picture of board 2.18.
- After: 1. Open New Customer and compare with the picture of board 2.16. | 2. Type a customer name. | 3. Click the + and compare with the picture of board 2.17. | 4. Add "Sales Representative - Part Sales". | 5. Pick {Sales-rep-C} in it and compare with the picture of board 2.18.

**D-14 (C666030)** 4 → 5
- Before: 1. Compare the Sales Representative field with the picture of board 3.1. | 2. Hover over it and compare with the picture of board 3.2. | 3. Open its list and compare with the picture of board 3.3. | 4. Pick {Sales-rep-A}, hover and compare with the picture of board 3.4.
- After: 1. Compare the Sales Representative field with the picture of board 3.1. | 2. Hover over it and compare with the picture of board 3.2. | 3. Open its list and compare with the picture of board 3.3. | 4. Pick {Sales-rep-A}. | 5. Hover over the field and compare with the picture of board 3.4.

**D-15 (C666031)** 6 → 10
- Before: 1. Compare the default report with the picture of board 4.4. | 2. Expand both representatives and compare with the picture of board 4.5. | 3. Open the Sales Type filter and compare with the picture of board 4.6. | 4. Select only Labor and compare with the picture of board 4.7, then select all three again. | 5. Open the column selector and compare with the pictures of boards 4.8 and 4.9 as you turn Sales Type on. | 6. Expand both representatives and compare with the picture of board 4.10.
- After: 1. Compare the default report with the picture of board 4.4. | 2. Expand {Sales-rep-A}. | 3. Expand {Sales-rep-B} and compare with the picture of board 4.5. | 4. Open the Sales Type filter and compare with the picture of board 4.6. | 5. Select only Labor and compare with the picture of board 4.7. | 6. Select all three again. | 7. Open the column selector and compare with the picture of board 4.8. | 8. Turn Sales Type on and compare with the picture of board 4.9. | 9. Expand {Sales-rep-A}. | 10. Expand {Sales-rep-B} and compare with the picture of board 4.10.

