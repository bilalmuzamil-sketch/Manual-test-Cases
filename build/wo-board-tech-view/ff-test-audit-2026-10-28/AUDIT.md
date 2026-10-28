# Fast Follow board — tests that need correcting after a fix (28 Oct 2026, QA lead's ask)

Source of truth read live 28 Oct ~14:30 UTC: the 26 children of SV-11593 (statuses), the WO Board suite tree (section 13204, 348 cases), run 498 (295 tests). Every test whose Expected carries a "Known problem (SV-…)" block, an "EXPECT FAIL (SV-…)" marker or an "SV-… - " title prefix was matched to that ticket's live status (`stale-classified-1028.json`), plus every test naming a board ticket (`matches-1028.json`).

## Corrected today (Rule 136 — ticket passed QA)
| Test | Ticket (status) | Change |
|---|---|---|
| C698884, C96989 (Automated), C96992 (Automated) | SV-11580 (Done) | Known-problem block removed, marker READY, last-checked stamp from the last Pass |
| C707076 | SV-11576 (Done) | same |
| C707077 | SV-11577 (Done) | same |
| C682437 | SV-11402 (Done) | same |
| C682445 | SV-11119 (Done) | same |
| C590127 | SV-11326 (Done) | same (one UI `<br>` became a paragraph break) |
| C682439 | SV-11430 (Done) | same |
| C682440 | SV-11467 (Done) | same |
| C97022 | SV-11582 (Ready for Production) | marker READY, stamp |
| C682423 | SV-11567 (Ready for Production) | run whole on sv11567 → Passed, added to run 498, notes removed |

## Still waiting — parked in the Fast-follow folder (not in run 498), tickets now closed
Need a whole run (L0573) before notes come off and they join the run (Rule 136 amendment):
- SV-11524 (Done) + Undo SV-11567 (Ready for Production): C96956, C96957, C96963, C96969*, C96973*, C154889, C368133*, C368135*, C368136*, C368140*, C581891, C581892, C581893, C97002, C97007*, C97008*, C97009, C368144*, C97028, C590130 (* Automated)
- SV-11545 (Done): C690642, C690647 (title prefixes)
- SV-11524 / SV-11416 (Done): C368152, C614711 (prefixes; C614711 EXPECT FAIL SV-11416)
- Vladimir's (created_by 1, never changed): C724216 (SV-11720 prefix), C724217, C724218 (SV-11710 prefix) — tickets Ready for Production.

## Correct as they are (ticket still open)
C682436 (SV-11555, Code Review) · C847744 Failed / C847745 (SV-11581, Rejected from testing) · C682419 Blocked step 8 (chat bubble; SV-11835 RfP).

## Open tickets that will need test changes when they ship
- **SV-11902 (Open) contradicts PRD v81 S4-N2** ("Declined and Complete work orders can be moved freely, as today"). Tests that expect a Declined work order to move: C96963, C97009, C690642, C690647 (+ the S4-N2 quote in C97010, C368158, C590123, C682428, C96964). Nothing changes until the PRD does (Rule 57/58).
- SV-11837 (Code Review): tooltip after 300 ms and a new look — no PRD sentence yet; C590114 / C690642 tooltip lines follow the PRD today.
- SV-11872 (Open): a race after a lead change + filter change — no test covers it; a test can be written once the PRD or ticket gives the rule.
