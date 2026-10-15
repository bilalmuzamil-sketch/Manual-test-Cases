# Chris Ward answers (questions 12-31, 15 Oct 2026) -> affected WO Board & Tech View tests (run 498)
Source: Google Sheet 1gBGmNB4B1bRrD2ZJvBn1tuvbfxFPjcsKddz_I5H3CvU, answers read 15 Oct; Chris cites PRD v53. Matching scripted over all 271 run-498 cases (keyword per topic), then each candidate read.

| Q | Case | Test | Status now | What the answer changes | Case text | Retest on staging |
|---|---|---|---|---|---|---|
| 12 | C590110 | 3995719 | Failed | Chip and Search icons now use the design icons in every view, List included | Expected changes | YES |
| 15 | C590115 | 3995724 | Failed | Status pill is 16 px at Compact and Regular (not 18 px), 22 px at Comfortable | Expected changes | YES |
| 16 | C590116 | 3995725 | Failed | Unassigned header has NO grip; group-header grips show to view-only users too | Expected changes | YES |
| 16 | C590117 | 3995726 | Failed | Unassigned header has NO grip (expected lists a grip first) | Expected changes | YES |
| 17 | C590122 | 3995731 | Passed | No-results page uses the magnifier (as List); clipboard only when a view has no work orders at all | Expected to re-check against PRD v53 | YES |
| 22 | C590120 | 3995729 | Untested | Board cards use the List pill with red and blue counts, 22 px | Expected to add the new rule | YES (not yet run) |
| 23 | C581895 | 3974851 | Passed | Avatar hover names in Tech View rows are the staff record name too | Expected to tighten | NO - cannot be set up on staging (one name per technician) |
| 24 | C96909 | 3481854 | Passed | Tooltips must read List, Tech View and Board View (a different label is now a fail) | Expected changes | YES |
| 25 | C96927 | 3481871 | Passed | Status, Number, Customer always shown in Tech View; every other column, Unit included, can be turned off | Expected to re-check against PRD v53 | YES |
| 25 | C590113 | 3995722 | Failed | Same rule; staging Column Selection offers neither On Site nor Unit | No change | YES |
| 27 | C590128 | 3995737 | Failed | Row text is 14 px at every density; Compact never shrinks it (expected allowed 13 px) | Expected changes | YES |
| 28 | C97020 | 3481958 | Passed | Keyboard now defined (Tab/Enter/Escape, focus returns, reassign via the menu, no keyboard drag) | Expected changes (remove "not designed yet") | YES |
| 28 | C97021 | 3481959 | Passed | same | Expected changes | YES |
| 28 | C97022 | 3481960 | Passed | Focus returns to the control that opened the menu or dialog | Expected changes | YES |
| 28 | C368150 | 3761671 | Passed | No keyboard drag: Enter opens, moving is not offered by keyboard | Expected changes | YES |
| 28 | C368151 | 3761672 | Passed | Keys now defined | Expected changes | YES |
| 28 | C368152 | 3761673 | Passed | Cards cannot be reordered by keyboard (reorder is mouse or touch only) | Expected changes | YES |
| 28 | C97011 | 3481955 | Passed | Escape cancel no longer "pending" | Expected changes (AUTOMATED: needs go-ahead, tell Vlad) | YES |
| 29 | C590125 | 3995734 | Untested | Dark theme is in scope: test both views dark with the design file colours | Expected to be written; HOLD lifted | YES |
| 30 | C96916 | 3481861 | Passed | Sideways exact; the top row or card comes back at the top, fully shown, within one row or card | Expected changes | YES (likely passes) |
| 31 | C96978 | 3481922 | Passed | Same as List: full name, then +N | Expected changes (AUTOMATED: needs go-ahead, tell Vlad) | YES (likely passes) |

No test change needed: Q13 (sideways scroll — C590112, C590126 already expect it), Q14 (Unit / Assigned Techs — C590113 already), Q18 (no hours line — C590128 note already), Q19 (dialog as drawn + Unassigned — C590129 already), Q20 (sticky group header — C96935, C590131 already), Q21 (page look unchanged — no case expects the restyle), Q26 (minimap out — no case).
Gaps for the test-writing side: Q22 (Board card pill, new S3-R5a) and Q25 (locked Tech View columns, new S5-R4a) have no dedicated case.
