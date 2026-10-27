# Parts Lifecycle full pass — Phase A pass record (Rule 134), 27 Oct 2026

Sections S1, S2, S3, S4, S5. Every case is compared part by part with its live read-back of 14 Oct 2026 and checked against PRD "Parts Lifecycle Update", Confluence 829227015, version 33 (23 Oct 2026, owner Chris Ward). Counts: {'rewritten': 62, 'split': 10, 'new': 1}.

| Section | rewritten (keeps C-id) | split parts (new) | new behaviour (new) |
|---|---|---|---|
| S1 | 13 | 2 | 1 |
| S2 | 20 | 4 | 0 |
| S3 | 4 | 3 | 0 |
| S4 | 7 | 0 | 0 |
| S5 | 18 | 1 | 0 |

## Per case, per part

- **S1-01** [C154752](https://shopview.testrail.io/index.php?/cases/view/154752) — Inventory opens on the Active tab, with the Inactive tab beside it: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 3.5, 4.1); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S1-02** [C154753](https://shopview.testrail.io/index.php?/cases/view/154753) — Parts from before the release are active and tracked: title CHANGED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CHANGED (S1-R5b, S13-R20 differ); from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 3.1, 5.3); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S1-02b** new — No setting turns part status or tracking on or off: all NEW (split from S1-02); needs a C-id and the run (union only)
- **S1-03** [C425585](https://shopview.testrail.io/index.php?/cases/view/425585) — Each tab lists only the parts with that status at its location: title CHANGED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 3.5, 2.5); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S1-04** [C425586](https://shopview.testrail.io/index.php?/cases/view/425586) — Switching tabs ends bulk mode and clears the ticked rows: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.2, 4.6); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S1-05** [C425587](https://shopview.testrail.io/index.php?/cases/view/425587) — Search, filters and sort work the same way on the Inactive tab: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 3.5); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S1-06** [C425588](https://shopview.testrail.io/index.php?/cases/view/425588) — Export from each tab holds only that tab's parts: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.1); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S1-07** [C425589](https://shopview.testrail.io/index.php?/cases/view/425589) — Export shows Not Tracked for an untracked part and has no status column: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 5.3); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S1-08** [C425590](https://shopview.testrail.io/index.php?/cases/view/425590) — Cycle count on the Inactive tab counts only the inactive parts: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 5.7); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S1-09** [C425591](https://shopview.testrail.io/index.php?/cases/view/425591) — An empty Inactive tab says No inactive parts at this location.: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CHANGED (S13-R21, S13-R22 differ); from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.10); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S1-10** [C425592](https://shopview.testrail.io/index.php?/cases/view/425592) — An Inactive tab emptied by a search shows the usual no-match result: title CHANGED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.10); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S1-11** [C573668](https://shopview.testrail.io/index.php?/cases/view/573668) — Export holds every part the search matches, even rows not yet loaded: title CHANGED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.1); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S1-12** [C573669](https://shopview.testrail.io/index.php?/cases/view/573669) — Export follows the Category filter: title CHANGED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CHANGED (S6-R10 differ); from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.1); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S1-12b** new — Export follows the Supply filter and leaves out an untracked part: all NEW (split from S1-12); needs a C-id and the run (union only)
- **S1-13** [C573670](https://shopview.testrail.io/index.php?/cases/view/573670) — Export with nothing matching shows Empty export and saves no file: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CHANGED (S1-R9 differ); from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards none); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S1-14** new — Switching tabs during a cycle count drops the counts typed so far: all NEW (new requirement); needs a C-id and the run (union only)
- **S2-01** [C154754](https://shopview.testrail.io/index.php?/cases/view/154754) — The actions menu offers Deactivate parts between Cycle count and Export: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.1, 4.6); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S2-02** [C154755](https://shopview.testrail.io/index.php?/cases/view/154755) — Outside bulk mode the list has no checkboxes and a row click opens the part: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.0, 3.6); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S2-03** [C154756](https://shopview.testrail.io/index.php?/cases/view/154756) — In bulk mode a click anywhere on a row ticks it instead of opening it: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.3); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S2-04** [C154757](https://shopview.testrail.io/index.php?/cases/view/154757) — The bulk bar sits under the tabs and counts the ticked rows: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.2, 4.3); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S2-05** [C154758](https://shopview.testrail.io/index.php?/cases/view/154758) — Hovering the bulk bar's X shows Clear selection, also read aloud: title CHANGED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CHANGED (S2-R9a differ); from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.2); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S2-05b** new — The X on the bulk bar leaves bulk mode and clears the ticks: all NEW (split from S2-05); needs a C-id and the run (union only)
- **S2-06** [C154759](https://shopview.testrail.io/index.php?/cases/view/154759) — Confirming Deactivate moves the ticked parts to the Inactive tab: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.3, 4.4, 4.5); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S2-06b** new — Deactivating one part says 1 part selected and 1 part updated: all NEW (split from S2-06); needs a C-id and the run (union only)
- **S2-07** [C154760](https://shopview.testrail.io/index.php?/cases/view/154760) — When some parts fail, only the failed parts stay ticked: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.3, 4.4); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S2-08** [C154762](https://shopview.testrail.io/index.php?/cases/view/154762) — With nothing ticked Deactivate is disabled and its hover text says why: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.2); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S2-09** [C154763](https://shopview.testrail.io/index.php?/cases/view/154763) — A part on an open work order can still be deactivated: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CHANGED (S10-R16 differ); from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.4, 4.5, 3.8); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S2-10** [C425593](https://shopview.testrail.io/index.php?/cases/view/425593) — Turning on Deactivate parts adds a checkbox column at the left edge: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.2); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S2-11** [C425594](https://shopview.testrail.io/index.php?/cases/view/425594) — The header checkbox ticks only the rows loaded so far: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.6, 4.9); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S2-12** [C425595](https://shopview.testrail.io/index.php?/cases/view/425595) — The bulk bar is near-black in the light theme and white in the dark theme: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.3); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S2-13** [C425596](https://shopview.testrail.io/index.php?/cases/view/425596) — More than 200 ticked parts disables Deactivate: title CHANGED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CHANGED (S10-R4, S2-R6, S3-R3 differ); from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.9); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S2-13b** new — More than 200 ticked parts disables Activate on the Inactive tab: all NEW (split from S2-13); needs a C-id and the run (union only)
- **S2-14** [C425597](https://shopview.testrail.io/index.php?/cases/view/425597) — Search, filters, sorting and scrolling keep working in bulk mode: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.2, 4.3); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S2-15** [C425598](https://shopview.testrail.io/index.php?/cases/view/425598) — Changing the search or a filter clears the ticks but sorting keeps them: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.3); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S2-16** [C425599](https://shopview.testrail.io/index.php?/cases/view/425599) — In bulk mode the actions menu offers only Export: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CHANGED (S2-E4 differ); from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.8); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S2-17** [C425600](https://shopview.testrail.io/index.php?/cases/view/425600) — Bulk mode cannot be turned on while a cycle count is running: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 5.7, 4.1); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S2-18** [C425601](https://shopview.testrail.io/index.php?/cases/view/425601) — When every ticked part fails, nothing changes and the ticks stay: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.4); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S2-19** [C425603](https://shopview.testrail.io/index.php?/cases/view/425603) — Deactivating a part that has a core charge also deactivates its core: title CHANGED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CHANGED (S10-R19, S2-N3, S3-R3, S9-R18 differ); from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards none); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S2-19b** new — Activating a part that has a core charge also activates its core: all NEW (split from S2-19); needs a C-id and the run (union only)
- **S2-20** [C425604](https://shopview.testrail.io/index.php?/cases/view/425604) — The work order lines bulk bar is unchanged and its X shows Clear selection: title CHANGED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards none); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S3-01** [C154764](https://shopview.testrail.io/index.php?/cases/view/154764) — Activate parts on the Inactive tab opens the same bulk mode with Activate: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.6, 4.3); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S3-02** [C154765](https://shopview.testrail.io/index.php?/cases/view/154765) — Confirming Activate moves the ticked parts back to the Active tab: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CHANGED (S10-R8 differ); from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.6, 4.7); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S3-03** [C425605](https://shopview.testrail.io/index.php?/cases/view/425605) — With nothing ticked Activate is disabled and its hover text says why: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.6); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S3-04** [C425606](https://shopview.testrail.io/index.php?/cases/view/425606) — On the Inactive tab a row click ticks the row in bulk mode only: title CHANGED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CHANGED (S2-R10a, S2-R10b, S2-R15, S2-R9 differ); from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 4.6); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S3-04b** new — On the Inactive tab a new search or filter clears the ticks, sorting keeps them: all NEW (split from S3-04); needs a C-id and the run (union only)
- **S3-04c** new — On the Inactive tab the bulk bar's X shows Clear selection and leaves the mode: all NEW (split from S3-04); needs a C-id and the run (union only)
- **S3-04d** new — On the Inactive tab only the parts that failed to activate stay ticked: all NEW (split from S3-04); needs a C-id and the run (union only)
- **S4-01** [C154766](https://shopview.testrail.io/index.php?/cases/view/154766) — New Inventory Part opens with tracking on in its own Inventory Tracking section: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CHANGED (S13-R1 differ); from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 1.1); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S4-02** [C154767](https://shopview.testrail.io/index.php?/cases/view/154767) — Switching tracking off hides Min and Max but keeps the bin section: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 1.6); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S4-03** [C154768](https://shopview.testrail.io/index.php?/cases/view/154768) — An untracked part shows Not Tracked with its bins, Min and Max in the list: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 5.3); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S4-04** [C154769](https://shopview.testrail.io/index.php?/cases/view/154769) — A tracked new part always keeps a default bin in the window: title CHANGED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CHANGED (S4-N1, S4-N2 differ); from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 1.1); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S4-05** [C425627](https://shopview.testrail.io/index.php?/cases/view/425627) — The Inventory Tracking info icon shows the tracking help text: title CHANGED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 5.1); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S4-06** [C425628](https://shopview.testrail.io/index.php?/cases/view/425628) — An untracked part saves with its bin and quantity as a shelf reference: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CHANGED (S4-R8 differ); from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 1.6); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S4-07** [C425630](https://shopview.testrail.io/index.php?/cases/view/425630) — The Inventory Value report leaves out an untracked part: title CHANGED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 5.3); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S5-01** [C154770](https://shopview.testrail.io/index.php?/cases/view/154770) — Turning tracking on gives a part with no bin the default bin at zero: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CHANGED (S5-N1 differ); from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 5.6); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S5-02** [C154771](https://shopview.testrail.io/index.php?/cases/view/154771) — Turning tracking off and back on keeps Min and Max: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 5.2, 5.6); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S5-03** [C154772](https://shopview.testrail.io/index.php?/cases/view/154772) — Turning tracking off on a part with stock asks for no confirmation: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 5.2); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S5-04** [C154773](https://shopview.testrail.io/index.php?/cases/view/154773) — Turning tracking off keeps every bin quantity: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 5.2); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S5-05** [C425631](https://shopview.testrail.io/index.php?/cases/view/425631) — Turning tracking on marks the first bin as default when none is: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 5.6); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S5-06** [C425632](https://shopview.testrail.io/index.php?/cases/view/425632) — The list shows Not Tracked right after Save, without a page reload: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 5.2, 5.3); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S5-07** [C425633](https://shopview.testrail.io/index.php?/cases/view/425633) — Turning tracking back on shows the count as it stands now: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 5.6); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S5-08** [C425634](https://shopview.testrail.io/index.php?/cases/view/425634) — A part's core turns untracked and tracked together with the part: title CHANGED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards none); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S5-09** [C425635](https://shopview.testrail.io/index.php?/cases/view/425635) — A core charge added to an untracked part gives it an untracked core: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards none); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S5-10** [C425636](https://shopview.testrail.io/index.php?/cases/view/425636) — Cycle count shows Not Tracked for an untracked part and never counts it: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 5.7); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S5-11** [C425637](https://shopview.testrail.io/index.php?/cases/view/425637) — The printed count sheet leaves out an untracked part: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 5.7); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S5-12** [C425638](https://shopview.testrail.io/index.php?/cases/view/425638) — Part History records Tracking turned off and Tracking turned on: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 5.5); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S5-13** [C425640](https://shopview.testrail.io/index.php?/cases/view/425640) — Importing Min, Max and a bin quantity for an untracked part saves them: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards none); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S5-14** [C425657](https://shopview.testrail.io/index.php?/cases/view/425657) — Inventory Value for an earlier date still counts a part untracked today: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards none); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S5-15** [C425658](https://shopview.testrail.io/index.php?/cases/view/425658) — Inventory Value before the release counts every part as tracked: title CHANGED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards none); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S5-16** [C573675](https://shopview.testrail.io/index.php?/cases/view/573675) — After its default bin is deleted, turning tracking on marks the remaining bin: title CONFIRMED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards 5.6); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S5-17** [C573676](https://shopview.testrail.io/index.php?/cases/view/573676) — A part's core has no row of its own on the Inventory list or in Export: title CHANGED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards none); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)
- **S5-17b** new — A part's core has no row of its own on the Part Library list: all NEW (split from S5-17); needs a C-id and the run (union only)
- **S5-18** [C573677](https://shopview.testrail.io/index.php?/cases/view/573677) — A core's own Part History page shows its name and its own history: title CHANGED; preconditions CHANGED; steps CHANGED; results CHANGED; quotes CONFIRMED; from_lines CHANGED (v29 Source paragraph -> From: lines, PRD version 33, read 27 Oct 2026); build_line CHANGED (eleventh amendment build sentence); design CHANGED (References from Design block, boards none); marker CHANGED; refs CHANGED; setup CHANGED (per-case Google Doc link removed; recipe in PARTS-LIFECYCLE-SETUP-FILE.md); run CONFIRMED (same C-id; stays in the open Nightly runs, union only)

## Samples, old (14 Oct, live) vs new (this pass), tester text

### S1-01 · C154752

**Old (live since 14 Oct 2026)**

```
Inventory opens on the Active tab, with the Inactive tab beside it
Setup (manual QA tester and Claude session)
Preconditions
 - You are signed in as an Admin at {Location-A} (for example Staging Heavy Duty - 9919). The Admin role has 'Part Library & Inventory → View / Create & Edit / Delete'.
 - Inventory part {Part-A} (for example ZZAUTOTEST-PL-TABS-01) is active and tracked at {Location-A}.
STEPS
- In the top bar click Parts, then click Inventory in the left menu.
 - Look at the area between the page title "Inventory" and the table.
 - Type {Part-A} in the Search box.
 - Click the Inactive tab.
 - Click the Active tab.
Expected results
 - Step 1: The Inventory page opens with two tabs, "Active" and "Inactive", and "Active" is already the selected tab (shown in blue) without you clicking it.
 - Step 2: The two tabs sit on their own line directly under the title "Inventory". The search and filter row (Search, Bin Location, Category, Supply, the columns icon, the ⋮ menu and New Inventory Part) sits below the tabs, not beside them.
 - Step 3: The Active tab lists {Part-A} (1 row).
 - Step 4: "Inactive" becomes the selected tab and {Part-A} is not listed there.
 - Step 5: "Active" is selected again and {Part-A} is listed again.
```

**New**

```
Inventory opens on the Active tab, with the Inactive tab beside it
Preconditions
 - Sign in as an Admin at the test location.
 - Have an active part, part A, at the test location.
 - Start on any page other than Inventory, so you can watch the Inventory page open.
STEPS
- Click Parts in the top bar.
 - Click Inventory in the left menu.
 - Type part A's part number in the Search box.
 - Click the Inactive tab.
 - Click the Active tab.
Expected Result
Step 1:
 - The Parts left menu shows Inventory.
Step 2:
 - The Inventory page opens with two tabs, "Active" and "Inactive".
 - "Active" is the selected tab (blue text) without you clicking it.
 - The two tabs sit on their own line directly under the page title "Inventory".
 - The search and filter row (Search, Bin Location, Category, Supply, the columns button, the three-dot actions button and New Inventory Part) sits below the tabs, not on the same line.
Step 3:
 - Part A is listed on the Active tab.
Step 4:
 - "Inactive" becomes the selected tab.
 - Part A is not listed.
Step 5:
 - "Active" is the selected tab again.
 - Part A is listed again.
Exact quotes from the source (for reproducibility)
From: PRD "Parts Lifecycle Update", Confluence 829227015, version 33 (23 Oct 2026, owner Chris Ward), read 27 Oct 2026 · Epic SV-10647, story SV-10814 (Story 1, Active and Inactive Tabs on the Inventory List)
 - S1-R1: “The Inventory list shows two tabs, Active and Inactive.”
 - S1-R2: “Active is the selected tab when the page opens.”
 - S1-R3: “The Active tab lists only parts that are active at the current location.”
 - S1-R4: “The Inactive tab lists only parts that are inactive at the current location.”
 - S1-R8: “The Active and Inactive tabs sit on their own line under the page title, above the search and filter row.”
The build is not yet available to check this case against.
References from Design
Design canvas "Parts Lifecycle Update" (https://claude.ai/artifact/Vz6rprcWyP16tYxzM1kdeE), 13 Oct 2026 copy, unchanged when re-read on 27 Oct 2026: boards "3.5 The Inactive tab", "4.1 The actions menu". Compare the screen with the pictures below; the expected results above come from the quotes above.
Design pictures attached to this case:
 - retire-05-p3-5-inactive-tab.png
 - bulk-01-p4-1-actions-menu.png
The design's own words:
 - “The part is listed on the Inactive tab, which lists only parts that are inactive at this location (S1-R4).”
AUTOMATION: HOLD - not yet build-verified (no build yet)
```

### S2-06 · C154759

**Old (live since 14 Oct 2026)**

```
Confirming Deactivate moves the ticked parts to the Inactive tab
Setup (manual QA tester and Claude session)
Preconditions
 - You are signed in as an Admin at {Location-A} (for example Staging Heavy Duty - 9919). The Admin role has 'Part Library & Inventory → View / Create & Edit / Delete'.
 - Inventory parts {Part-A}, {Part-B} and {Part-C} (for example ZZAUTOTEST-PL-BULKOFF-01 to -03) are active and tracked at {Location-A}, with quantity 5 each.
 - Their part numbers start with {Prefix-A} (for example ZZAUTOTEST-PL-BULKOFF).
STEPS
- In the top bar click Parts, then click Inventory in the left menu.
 - Type {Prefix-A} in the Search box.
 - Click the ⋮ actions menu button in the toolbar, to the left of New Inventory Part.
 - Click Deactivate parts.
 - Click the {Part-A} row.
 - Click the {Part-B} row.
 - Click the Deactivate button on the bar.
 - Click Deactivate in the "Deactivate parts?" confirmation.
 - Do not refresh the page.
 - Wait 10 seconds without touching the page.
 - Click the Inactive tab.
 - Type {Prefix-A} in the Search box, replacing any text there.
 - Click the Active tab.
 - Type {Prefix-A} in the Search box, replacing any text there.
 - Click the ⋮ actions menu button.
 - Click Deactivate parts.
 - Click the {Part-C} row.
 - Click the Deactivate button.
 - Click Deactivate in the confirmation.
Expected results
 - Step 7: The "Deactivate parts?" confirmation opens and reads "2 parts selected."
 - Step 8: A green toast reads "2 parts updated." {Part-A} and {Part-B} leave the Active list at once, without a page reload, and {Part-C} is still listed. The dark bar and the checkbox column disappear: bulk mode has ended and nothing is ticked.
 - Step 10: The green toast closes on its own.
 - Step 12: The Inactive tab lists {Part-A} and {Part-B}.
 - Step 18: The confirmation reads "1 part selected."
 - Step 19: A green toast reads "1 part updated.", {Part-C} leaves the Active list without a reload, and bulk mode ends.
```

**New**

```
Confirming Deactivate moves the ticked parts to the Inactive tab
Preconditions
 - Sign in as an Admin at the test location.
 - Create three active parts for this test, part A, part B and part C.
 - Give parts A, B and C part numbers that start with the same text, so one search lists all three.
 - Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
STEPS
- Type the shared start of the part numbers in the Search box.
 - Click the three-dot actions button (⋮) in the toolbar, to the left of New Inventory Part.
 - Click Deactivate parts.
 - Click the part A row.
 - Click the part B row.
 - Click Deactivate on the dark bar.
 - Click Deactivate in the confirmation.
 - Wait 10 seconds without refreshing the page.
 - Click the Inactive tab.
 - Type the shared start of the part numbers in the Search box again.
Expected Result
Step 1:
 - Parts A, B and C are listed.
Step 2:
 - The menu opens.
Step 3:
 - Bulk mode turns on.
Step 4:
 - The part A row is ticked.
Step 5:
 - The bar reads 2 selected.
Step 6:
 - The "Deactivate parts?" confirmation opens and reads "2 parts selected."
Step 7:
 - A green message reads "2 parts updated."
 - Parts A and B leave the Active list at once, without a page reload, and part C is still listed.
 - The dark bar and the checkbox column disappear: bulk mode has ended and nothing is ticked.
Step 8:
 - The green message has closed on its own.
Step 9:
 - The Inactive tab is selected.
Step 10:
 - The Inactive tab lists parts A and B.
 - Part C is not listed.
Exact quotes from the source (for reproducibility)
From: PRD "Parts Lifecycle Update", Confluence 829227015, version 33 (23 Oct 2026, owner Chris Ward), read 27 Oct 2026 · Epic SV-10647, story SV-10815 (Story 2, Deactivate Parts in Bulk), story SV-10823 (Story 10, Confirming and Recording a Status Change)
 - S2-R11: “When the user confirms (Story 10), every ticked part becomes inactive.”
 - S2-R12: “The deactivated parts leave the Active tab without a page reload.”
 - S2-R13: “The deactivated parts appear on the Inactive tab.”
 - S2-R14: “When every ticked part changes, the mode ends and the selection clears.”
 - S10-R3: “Raised from the bulk bar, the confirmation is titled "Deactivate parts?" or "Activate parts?". Raised from the part dialog, it is titled "Deactivate part?" or "Activate part?".”
 - S10-R4: “Raised from the bulk bar, the confirmation opens with "{n} parts selected.", or "1 part selected." for one. Raised from the part dialog, it opens with the part number followed by the description, as they stand in the form, with spaces before and after removed.”
 - S10-R12: “After a bulk change, the system shows how many parts changed and how many failed.”
 - User Feedback Summary: “Bulk change, every part changed | "{n} parts updated." ("1 part updated." for one) | Success toast, fades on its own”
The build is not yet available to check this case against.
References from Design
Design canvas "Parts Lifecycle Update" (https://claude.ai/artifact/Vz6rprcWyP16tYxzM1kdeE), 13 Oct 2026 copy, unchanged when re-read on 27 Oct 2026: boards "4.3 Two rows ticked", "4.4 Confirm", "4.5 Done". Compare the screen with the pictures below; the expected results above come from the quotes above.
Design pictures attached to this case:
 - bulk-03-p4-3-ticked.png
 - bulk-04-p4-4-confirm.png
 - bulk-05-p4-5-result.png
The design's own words:
 - “"2 parts updated." (S10-R12). The parts leave the Active tab without a page reload, the mode ends and the selection clears (S2-R12, S2-R14).”
AUTOMATION: HOLD - not yet build-verified (no build yet)
```

### S5-02 · C154771

**Old (live since 14 Oct 2026)**

```
Turning tracking off and back on keeps Min and Max
Setup (manual QA tester and Claude session)
Preconditions
 - You are signed in as an Admin at {Location-A} (for example Staging Heavy Duty - 9919); the Admin role has 'Part Library & Inventory → View', 'Part Library & Inventory → Create & Edit' and 'Part Library & Inventory → Delete' and can see costs and prices.
 - Parts → Inventory is open on the Active tab at {Location-A}.
 - Bin {Bin-A} is the default bin of {Location-A} (for example General Storage), the bin New Inventory Part fills in.
 - Inventory part {Part-A} (for example ZZAUTOTEST-PL-MINMAX-01) is active and tracked at {Location-A}, with Min 2, Max 6 and 4 in {Bin-A}.
STEPS
- Search the part number of {Part-A} and click its row.
 - Click the Track quantities and cost of goods switch so it is off.
 - Look for the Min and Max fields.
 - Click Save.
 - Read the {Part-A} row in the list (Total Qty, Min, Max).
 - Click the {Part-A} row again.
 - Click the switch so it is on.
 - Read the Min and Max fields.
 - Click Save.
 - Read the {Part-A} row.
Expected results
 - Step 2: The switch turns off; nothing else is asked.
 - Step 3: Min and Max are hidden.
 - Step 5: Total Qty reads "Not Tracked"; Min still reads 2 and Max 6.
 - Step 8: Min shows 2 and Max shows 6 again, exactly as before; they are not blank and not 0.
 - Step 10: The row shows Total Qty "4 Available", Min 2 and Max 6.
```

**New**

```
Turning tracking off and back on keeps Min and Max
Preconditions
 - Sign in as an Admin at the test location.
 - Create an active tracked part, part A, for this test with Min 2, Max 6 and 4 in its bin.
 - Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
STEPS
- Click the part A row.
 - Click the Track quantities and cost of goods switch.
 - Click Save.
 - Click the part A row again.
 - Click the Track quantities and cost of goods switch.
 - Click Save.
Expected Result
Step 1:
 - Edit Inventory Part opens with the switch on, Min 2 and Max 6.
Step 2:
 - The switch turns off, Min and Max are hidden, and nothing else is asked.
Step 3:
 - Part A's row reads "Not Tracked" in Total Qty, and its Min still reads 2 and its Max 6.
Step 4:
 - Edit Inventory Part opens with the switch off.
Step 5:
 - The switch turns on and Min shows 2 and Max shows 6 again: not blank and not 0.
Step 6:
 - Part A's row shows Total Qty 4 Available, Min 2 and Max 6.
Exact quotes from the source (for reproducibility)
From: PRD "Parts Lifecycle Update", Confluence 829227015, version 33 (23 Oct 2026, owner Chris Ward), read 27 Oct 2026 · Epic SV-10647, story SV-10818 (Story 5, Change Tracking on an Existing Part), story SV-10817 (Story 4, Create an Untracked Part)
 - S5-R1: “The "Track quantities and cost of goods" switch can be changed in the Edit Inventory Part dialog.”
 - S5-R3: “Turning tracking off hides Min and Max in the part dialog. It does not change the quantity in any bin.”
 - S5-R4: “Turning tracking off keeps the Min and Max values, so turning tracking back on shows them as they were.”
 - S4-R8b: “On the Inventory list, an untracked part's Min and Max columns still show the saved values.”
 - Feature Overview, Core functionality: “An untracked part is not counted. The Inventory list shows "Not Tracked" instead of its total quantity, and its Min and Max are kept but not used. Its bins and their quantities stay on screen as a shelf reference. It can still be used on work orders and invoices.”
The build is not yet available to check this case against.
References from Design
Design canvas "Parts Lifecycle Update" (https://claude.ai/artifact/Vz6rprcWyP16tYxzM1kdeE), 13 Oct 2026 copy, unchanged when re-read on 27 Oct 2026: boards "5.2 Switch off", "5.6 Switch back on". Compare the screen with the pictures below; the expected results above come from the quotes above.
Design pictures attached to this case:
 - tracking-01-p5-2-switch-off.png
 - tracking-05-p5-5-switch-back-on.png
The design's own words:
 - “Min and Max show again with the values they had (S5-R4), and the count shows as it stands (S5-R6).”
AUTOMATION: HOLD - not yet build-verified (no build yet)
```
