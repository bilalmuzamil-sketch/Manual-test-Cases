# Splitting Sales Representatives: tester read-through, 26 Oct 2026 (DRAFT: nothing written to TestRail, Jira, Slack or Google)

Brief: `build/tester-readthrough-2026-10-26/WORKER-BRIEF.md` (QA lead, 26 Oct 2026: "GO" to a read-through of every case; "Make sure that your work does not bite me"). Rules read in full first: Rule 117 fourteenth and fifteenth amendments, Rules 113, 114, 116, 134, 135, 136, 137 (`build/rules/RULES-61-96.md`), `build/LESSONS-REGISTER.md` (L-01 to L-11), the suite's `PROJECT-STATE.md` and its 26 Oct pattern pass (`pattern-format-2026-10-26/`).

## Reading coverage
- Cases read: **176 of 176** (170 library cases + the 6 design-recheck cases DR-01, DR-02, DR-03, DR-04, DR-06 and DR-07; the four deleted cases excluded). Every case's title, preconditions, steps and expected results were read together, as a tester would, from a plain-text render of the drafts (3,579 lines, lines 1 to 3,579, 100% read).
- For the 44 cases where a fix depended on what the sources say, the case's whole quotes block, From: lines and References from Design block were read too (from the live read-backs, `applied/C<id>-after.json`).
- Before the read the drafts were proved equal to the live TestRail read-backs (176 of 176, title, preconditions, steps, expected, refs), so "old" below is what is live today.

## Counts
- Read: 176. Changed: **175** (136 only for check 7, the Blocked line; 39 with further fixes). Unchanged: **1** (S1-01 [C665915](https://shopview.testrail.io/index.php?/cases/view/665915): the QA lead's model case, which never had the Blocked line; only check 7 applies to it).
- Keys removed from the library (deleted from TestRail earlier today on the QA lead's order): **4**, S1-11 (C690666), S5-19 (C715568), S6-05 (C665980), S7-05 (C690670). They are gone from the case modules, `pattern_cases.py`, `scenarios.py`, the setup file (their four recipes and the developer-check account slot) and every output; `apply5.py` (dry run: "update 169 add []") can no longer re-create them, and build.py fails if any of them comes back.

## Requirement coverage after the deletions (`NO_MANUAL_CASE.json`, checked by build.py)
| Requirement | Was covered by | Now |
|---|---|---|
| S1-E3 | S1-11 C690666 | No manual case: deleted 26 Oct 2026 on the QA lead's order (a manual tester cannot set it up); left to the developers' own checks |
| S6-N1 | S6-05 C665980 | No manual case: deleted 26 Oct 2026 on the QA lead's order (a manual tester cannot set it up); left to the developers' own checks |
| S7-R6 | S7-05 C690670 | No manual case: deleted 26 Oct 2026 on the QA lead's order (a manual tester cannot set it up); left to the developers' own checks |
| Story 6 context note (S6-N1, S1-E3, S7-R6) | S1-11 C690666, S6-05 C665980, S7-05 C690670, S5-19 C715568 | No manual case: deleted 26 Oct 2026 on the QA lead's order (a manual tester cannot set it up); left to the developers' own checks |
| Chris Ward's answer 5 | S1-11 C690666, S7-05 C690670 | No manual case: deleted 26 Oct 2026 on the QA lead's order (a manual tester cannot set it up); left to the developers' own checks |
| Chris Ward's answer 30 | S1-11 C690666, S6-05 C665980, S7-05 C690670, S5-19 C715568 | No manual case: deleted 26 Oct 2026 on the QA lead's order (a manual tester cannot set it up); left to the developers' own checks |
| Tech plan, Phase 8 fetcher tests (section 8.4) | S5-19 C715568 | No manual case: deleted 26 Oct 2026 on the QA lead's order (a manual tester cannot set it up); left to the developers' own checks |
| S5-R2 | S5-19 C715568, S5-14 C665975 | Covered by S5-14 (C665975) for the names captured on the invoice; its last part ("it shows the captured name only when the staff record no longer exists") has no manual case: deleted 26 Oct 2026 on the QA lead's order (a manual tester cannot set it up); left to the developers' own checks |
| S5-R1 | S5-19 C715568, S2-10, S5-01, S5-14 | Covered by S2-10 (C665934), S5-01 (C665962) and S5-14 (C665975) |
| S7-R2 | S7-05 C690670, S7-01, S7-01c, REL-19, D-09 | Covered by S7-01 (C665981), S7-01c (C715656), REL-19 (C715572) and D-09 (C666025) |
| S7-R3 | S7-05 C690670, S7-01b, S7-01c, S7-02, S7-04, D-09 | Covered by S7-01b (C715655), S7-01c (C715656), S7-02 (C665982), S7-04 (C665994) and D-09 (C666025) |

build.py's REQUIREMENT-COVERAGE GATE accepts a PRD code with no case only when NO_MANUAL_CASE.json records it as "No manual case: deleted 26 Oct 2026 on the QA lead's order ...", and fails if such a code is covered again or if any other code loses its case.

## Gates
`python3 authoring/build.py` (exit 0):
```
cases 170 {'S1': 11, 'S2': 18, 'S3': 5, 'S4': 38, 'S5': 12, 'DATA': 10, 'S6': 5, 'S7': 6, 'S8': 19, 'REL': 22, 'DESIGN': 24}
PRD codes 143 covered 140 | no manual case (deleted 26 Oct 2026, QA lead's order): ['S1-E3', 'S6-N1', 'S7-R6'] | not covered and not recorded: []
design gate: boards 68 attached 68 | design cases 24
independence gate: no case key or C-id in tester text; every record a step or precondition changes is made "for this test" in the preconditions
relevance gate: every record a precondition names is used by a step or result, is the record the steps start on, or says why ("so ...")
pattern gate: S1-01 keeps the QA lead's approved Preconditions word for word, as he gave them
blocked-line gate: no case and no setup-file line carries "mark this test Blocked" / "setup not done" or a variant (Rule 117 fifteenth amendment)
pattern gate: library cases 170 | design-recheck cases 6 | cases in testrail-id-map.csv 176 | unmapped library cases []
read-through gate: fixes for 39 cases applied (readthrough.py); could not make concrete: 8 | negative check without a control: 1
```
New gates: BLOCKED-LINE GATE (Rule 117 fifteenth amendment: any case, in any field, or any setup-file line carrying "setup not done", "If you cannot set up any of the above", "If any record above is missing" or "mark this test Blocked" fails the build); REQUIREMENT-COVERAGE GATE (above); READ-THROUGH GATE (every fix in `authoring/readthrough.py` names a case of the suite). Every earlier gate is kept.

Byte identity (`check_byte_identity.py`, exit 0):
```
cases checked: 176 | quotes block onward byte-identical: 176 | everything below the results (notes included) byte-identical: 176 | cases with an added quote: 0
```
No fix added a quote: every result changed in this pass restates a sentence already quoted in its case (or its design reference), so the quotes block, From: lines, References from Design and the AUTOMATION line are byte-identical in all 176 cases.

## Changed cases (one line each: key, C-id, checks failed (1 clear setup, 2 vague words, 3 negative check without proof, 4 repeated or bundled steps, 5 related, 6 understandable, 7 Blocked line), what changed)
| Key | C-id | Checks | What changed |
|---|---|---|---|
| S1-02 | [C665916](https://shopview.testrail.io/index.php?/cases/view/665916) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S1-03 | [C665917](https://shopview.testrail.io/index.php?/cases/view/665917) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S1-04 | [C665918](https://shopview.testrail.io/index.php?/cases/view/665918) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S1-05 | [C665919](https://shopview.testrail.io/index.php?/cases/view/665919) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S1-06 | [C665920](https://shopview.testrail.io/index.php?/cases/view/665920) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S1-07 | [C665921](https://shopview.testrail.io/index.php?/cases/view/665921) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S1-08 | [C665922](https://shopview.testrail.io/index.php?/cases/view/665922) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S1-09 | [C665923](https://shopview.testrail.io/index.php?/cases/view/665923) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S1-10 | [C665924](https://shopview.testrail.io/index.php?/cases/view/665924) | 2, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." Step 1 said "for example by going offline in the browser": it now says exactly what to do, matching its result "The browser is offline". |
| S2-01 | [C665925](https://shopview.testrail.io/index.php?/cases/view/665925) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S2-02 | [C665926](https://shopview.testrail.io/index.php?/cases/view/665926) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S2-03 | [C665927](https://shopview.testrail.io/index.php?/cases/view/665927) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S2-04 | [C665928](https://shopview.testrail.io/index.php?/cases/view/665928) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S2-05 | [C665929](https://shopview.testrail.io/index.php?/cases/view/665929) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S2-06 | [C665930](https://shopview.testrail.io/index.php?/cases/view/665930) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S2-07 | [C665931](https://shopview.testrail.io/index.php?/cases/view/665931) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S2-08 | [C665932](https://shopview.testrail.io/index.php?/cases/view/665932) | 1, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The work order to invoice had no lines; it now has one approved labor line and one part, so it can be invoiced. |
| S2-09 | [C665933](https://shopview.testrail.io/index.php?/cases/view/665933) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S2-10 | [C665934](https://shopview.testrail.io/index.php?/cases/view/665934) | 1, 5, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The work order to invoice had no lines (added one approved labor line and one part). The last result (the new invoice is credited to sales rep B) could not be seen: Sales By Representative shows a representative's invoices only after the row is expanded, so a step "Expand sales rep B." was added and the date-range step now has its own result. |
| S2-11 | [C665935](https://shopview.testrail.io/index.php?/cases/view/665935) | 2, 6, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The last result said the entry is recorded "as Part Sales Update v1 records it", a name a tester does not know; it now says the entry is worded as a part sale's log entry was before this release. The sources give no wording for that entry, so it is listed under "could not make concrete". |
| S2-12 | [C665936](https://shopview.testrail.io/index.php?/cases/view/665936) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S3-01 | [C665937](https://shopview.testrail.io/index.php?/cases/view/665937) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S3-02 | [C665938](https://shopview.testrail.io/index.php?/cases/view/665938) | 2, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." "The same dropdown Lead Technician and Service Advisor open on a phone" and "the same options as on a desktop" now say what the tester sees: the phone's own built-in list (the design's "native dropdown", board 6.3 on the case's design page 6), with "Unassigned" first and then the sales representatives. |
| S3-03 | [C665939](https://shopview.testrail.io/index.php?/cases/view/665939) | 2, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." "The same native dropdown opens" now says what the tester sees: the phone's own built-in list, the same kind the work order fields open. |
| S4-01 | [C665940](https://shopview.testrail.io/index.php?/cases/view/665940) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-02 | [C665941](https://shopview.testrail.io/index.php?/cases/view/665941) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-03 | [C665942](https://shopview.testrail.io/index.php?/cases/view/665942) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-04 | [C665943](https://shopview.testrail.io/index.php?/cases/view/665943) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-05 | [C665944](https://shopview.testrail.io/index.php?/cases/view/665944) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-06 | [C665945](https://shopview.testrail.io/index.php?/cases/view/665945) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-07 | [C665946](https://shopview.testrail.io/index.php?/cases/view/665946) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-08 | [C665947](https://shopview.testrail.io/index.php?/cases/view/665947) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-09 | [C665948](https://shopview.testrail.io/index.php?/cases/view/665948) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-10 | [C665949](https://shopview.testrail.io/index.php?/cases/view/665949) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-11 | [C665950](https://shopview.testrail.io/index.php?/cases/view/665950) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-12 | [C665951](https://shopview.testrail.io/index.php?/cases/view/665951) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-13 | [C665952](https://shopview.testrail.io/index.php?/cases/view/665952) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-14 | [C665953](https://shopview.testrail.io/index.php?/cases/view/665953) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-15 | [C665954](https://shopview.testrail.io/index.php?/cases/view/665954) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-16 | [C665955](https://shopview.testrail.io/index.php?/cases/view/665955) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-17 | [C665956](https://shopview.testrail.io/index.php?/cases/view/665956) | 1, 5, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The result "Sales rep B is not listed in the report" holds only if sales rep B has no other invoice that day; a "Make sure ..." line now says so. |
| S4-18 | [C665957](https://shopview.testrail.io/index.php?/cases/view/665957) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-19 | [C665958](https://shopview.testrail.io/index.php?/cases/view/665958) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-20 | [C665959](https://shopview.testrail.io/index.php?/cases/view/665959) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-21 | [C665960](https://shopview.testrail.io/index.php?/cases/view/665960) | 1, 4, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The last precondition said "Open the page with the Sales Representative Assignments export", which names no page, and step 1 bundled choosing and downloading the export. The precondition now opens Reports > Export Reports (the Export Report dialog, as the report suite records it) and the download is two steps: pick the report, click Export. |
| S4-22 | [C665961](https://shopview.testrail.io/index.php?/cases/view/665961) | 1, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The import file and the place to import it were not said ("Have a contacts import file that contains the customer", "Open the contacts import"). The file now holds this same customer with its current name and details, so the import is a re-import of it, and the import page is named (Settings > Imports). |
| S5-01 | [C665962](https://shopview.testrail.io/index.php?/cases/view/665962) | 2, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." "With the labor columns filled" and "counts the invoice once" now say what the tester sees: the labor cells show figures, not dashes, and each summary row shows (1) after the name (the report's invoice count, as the design's page 4 shows it, for example "Devon Whitfield (3)"). |
| S5-02 | [C665963](https://shopview.testrail.io/index.php?/cases/view/665963) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S5-03 | [C665964](https://shopview.testrail.io/index.php?/cases/view/665964) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S5-04 | [C665965](https://shopview.testrail.io/index.php?/cases/view/665965) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S5-05 | [C665966](https://shopview.testrail.io/index.php?/cases/view/665966) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S5-06 | [C665967](https://shopview.testrail.io/index.php?/cases/view/665967) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S5-07 | [C665968](https://shopview.testrail.io/index.php?/cases/view/665968) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S5-08 | [C665969](https://shopview.testrail.io/index.php?/cases/view/665969) | 2, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." "It counts once" now says what the tester sees: sales rep A's summary row shows (2) after the name, one for each work order. |
| S5-09 | [C665970](https://shopview.testrail.io/index.php?/cases/view/665970) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S5-10 | [C665971](https://shopview.testrail.io/index.php?/cases/view/665971) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S5-11 | [C665972](https://shopview.testrail.io/index.php?/cases/view/665972) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S5-12 | [C665973](https://shopview.testrail.io/index.php?/cases/view/665973) | 2, 6, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." "The cells of the side a row is not credited with show a dash" now names the cells, the same ones the case's CSV result names. |
| S5-13 | [C665974](https://shopview.testrail.io/index.php?/cases/view/665974) | 2, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." "Counts that invoice once" and "counted once" now say what the tester sees: (1) after sales rep B's name and (2) after sales rep A's (the first work order's labor and this one). |
| S5-14 | [C665975](https://shopview.testrail.io/index.php?/cases/view/665975) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S6-01 | [C665976](https://shopview.testrail.io/index.php?/cases/view/665976) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S6-02 | [C665977](https://shopview.testrail.io/index.php?/cases/view/665977) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S6-03 | [C665978](https://shopview.testrail.io/index.php?/cases/view/665978) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S6-04 | [C665979](https://shopview.testrail.io/index.php?/cases/view/665979) | 3, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The only result was "There is no Sales Representative row on the printout"; it now first shows the printout opened, so a tester knows the print ran (S6-R4: "the row is left off the printout"). |
| S7-01 | [C665981](https://shopview.testrail.io/index.php?/cases/view/665981) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S7-02 | [C665982](https://shopview.testrail.io/index.php?/cases/view/665982) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S7-03 | [C665983](https://shopview.testrail.io/index.php?/cases/view/665983) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S8-01 | [C665984](https://shopview.testrail.io/index.php?/cases/view/665984) | 2, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." "The totals and counts follow" and "shows its empty state" now say what the tester sees. |
| S8-02 | [C665985](https://shopview.testrail.io/index.php?/cases/view/665985) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S8-03 | [C665986](https://shopview.testrail.io/index.php?/cases/view/665986) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S8-04 | [C665987](https://shopview.testrail.io/index.php?/cases/view/665987) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S8-05 | [C665988](https://shopview.testrail.io/index.php?/cases/view/665988) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-23 | [C665989](https://shopview.testrail.io/index.php?/cases/view/665989) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-24 | [C665990](https://shopview.testrail.io/index.php?/cases/view/665990) | 2, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." "The new work order can carry on with it" now says what the tester sees: the new work order shows the new customer. |
| S5-15 | [C665991](https://shopview.testrail.io/index.php?/cases/view/665991) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S5-16 | [C665992](https://shopview.testrail.io/index.php?/cases/view/665992) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S5-17 | [C665993](https://shopview.testrail.io/index.php?/cases/view/665993) | 1, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The invoices the sums are checked on were a "Make sure ..." line; they are data the result depends on, so they are now something to have, and the split work order names the two staff members. |
| S7-04 | [C665994](https://shopview.testrail.io/index.php?/cases/view/665994) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S2-13 | [C665995](https://shopview.testrail.io/index.php?/cases/view/665995) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S8-06 | [C665996](https://shopview.testrail.io/index.php?/cases/view/665996) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S8-07 | [C665997](https://shopview.testrail.io/index.php?/cases/view/665997) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S8-08 | [C665998](https://shopview.testrail.io/index.php?/cases/view/665998) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S8-09 | [C665999](https://shopview.testrail.io/index.php?/cases/view/665999) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S8-10 | [C666000](https://shopview.testrail.io/index.php?/cases/view/666000) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S8-11 | [C666001](https://shopview.testrail.io/index.php?/cases/view/666001) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| REL-15 | [C666002](https://shopview.testrail.io/index.php?/cases/view/666002) | 1, 2, 5, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." "Only the invoiced work order counts" could not be judged without amounts, and the customer could have other invoices that day. The customer now has no other invoices today, the two work orders have amounts ($100.00 invoiced, $50.00 reversed), and the result says the row holds the $100.00 only. The customer's representative played no part and is no longer asked for. |
| REL-01 | [C666003](https://shopview.testrail.io/index.php?/cases/view/666003) | 5, 6, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The design pictures (boards 2.0 to 2.2, "Before": production today) were opened but no step used them; their bullet now says why. The last result's second bullet ("This is one of the few customers ...") is not something a tester sees; it is now said inside the result it explains. |
| REL-02 | [C666004](https://shopview.testrail.io/index.php?/cases/view/666004) | 5, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The design pictures (boards 1.0 and 1.1, "Before": production today) were opened but no step said why; their bullet now does. |
| REL-03 | [C666005](https://shopview.testrail.io/index.php?/cases/view/666005) | 5, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The design pictures (boards 4.0 to 4.3, "Before": production today) were opened but no step said why; their bullet now does. |
| REL-04 | [C666006](https://shopview.testrail.io/index.php?/cases/view/666006) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| REL-05 | [C666007](https://shopview.testrail.io/index.php?/cases/view/666007) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| REL-06 | [C666008](https://shopview.testrail.io/index.php?/cases/view/666008) | 5, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The design picture (board 5.0, "Before": production today) was opened but no step said why; its bullet now does. |
| REL-07 | [C666009](https://shopview.testrail.io/index.php?/cases/view/666009) | 2, 5, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." "The imported work order looks as it did before" could not be judged: nothing recorded how it looked. A screenshot taken before the release is now a precondition, the work order is opened with the release installed, and the result compares with it. |
| REL-08 | [C666010](https://shopview.testrail.io/index.php?/cases/view/666010) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| REL-09 | [C666011](https://shopview.testrail.io/index.php?/cases/view/666011) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| REL-10 | [C666012](https://shopview.testrail.io/index.php?/cases/view/666012) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| REL-11 | [C666013](https://shopview.testrail.io/index.php?/cases/view/666013) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| REL-12 | [C666014](https://shopview.testrail.io/index.php?/cases/view/666014) | 2, 4, 5, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The preconditions said twice that a phone is used ("Use a phone screen." and "Open the work order on a phone ..."): the first is removed. The design pictures (boards 6.0 and 6.1, "Before": production today) now say why they are open, and "Its dropdown opens as today" points at the picture of today's list (board 6.1). |
| REL-13 | [C666015](https://shopview.testrail.io/index.php?/cases/view/666015) | 1, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." Step 2 asked the tester to open "the Sales By Representative report's address" without saying where to get it: a precondition now has it copied while signed in as an Admin, and the step pastes it. |
| REL-14 | [C666016](https://shopview.testrail.io/index.php?/cases/view/666016) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| D-01 | [C666017](https://shopview.testrail.io/index.php?/cases/view/666017) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| D-02 | [C666018](https://shopview.testrail.io/index.php?/cases/view/666018) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| D-03 | [C666019](https://shopview.testrail.io/index.php?/cases/view/666019) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| D-04 | [C666020](https://shopview.testrail.io/index.php?/cases/view/666020) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| D-05 | [C666021](https://shopview.testrail.io/index.php?/cases/view/666021) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| D-06 | [C666022](https://shopview.testrail.io/index.php?/cases/view/666022) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| D-07 | [C666023](https://shopview.testrail.io/index.php?/cases/view/666023) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| D-08 | [C666024](https://shopview.testrail.io/index.php?/cases/view/666024) | 1, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The work order to invoice had no lines; it now has one approved labor line and one part. |
| D-09 | [C666025](https://shopview.testrail.io/index.php?/cases/view/666025) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| D-10 | [C666026](https://shopview.testrail.io/index.php?/cases/view/666026) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| D-11 | [C666027](https://shopview.testrail.io/index.php?/cases/view/666027) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| D-12 | [C666028](https://shopview.testrail.io/index.php?/cases/view/666028) | 2, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." "They are in the window's order" now names the order. |
| D-13 | [C666029](https://shopview.testrail.io/index.php?/cases/view/666029) | 2, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." "The same ... as Edit Customer, in the same spot" and "the same two options as Edit Customer" now say what the tester sees (S4-R1 outlined box, S4-R6 menu order). |
| D-14 | [C666030](https://shopview.testrail.io/index.php?/cases/view/666030) | 2, 6, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The title and step 2's result named "Part Sales Update v1", a release a tester does not know; the title now says the field keeps its look, and the result says what shows (a hover box and arrow across the full width of the card, as in the picture of board 3.2). |
| D-15 | [C666031](https://shopview.testrail.io/index.php?/cases/view/666031) | 2, 5, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The part sale had no representative, so the expanded rows might not show it: it is now sales rep A's. "A side a representative did not sell shows a dash" now names the cells (S5-R15). |
| D-16 | [C666032](https://shopview.testrail.io/index.php?/cases/view/666032) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| D-17 | [C666033](https://shopview.testrail.io/index.php?/cases/view/666033) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| D-18 | [C666034](https://shopview.testrail.io/index.php?/cases/view/666034) | 2, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." "The native dropdown opens" now says what the tester sees: the phone's own built-in list. |
| DR-01 | [C690658](https://shopview.testrail.io/index.php?/cases/view/690658) | 1, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The work order to invoice had no lines; it now has one approved labor line and one part. |
| DR-02 | [C690659](https://shopview.testrail.io/index.php?/cases/view/690659) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| DR-03 | [C690660](https://shopview.testrail.io/index.php?/cases/view/690660) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| DR-04 | [C690661](https://shopview.testrail.io/index.php?/cases/view/690661) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| DR-06 | [C690663](https://shopview.testrail.io/index.php?/cases/view/690663) | 1, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The first precondition selected both locations in the Location filter before the report was opened; the report is now opened with both locations selected, and the first bullet only has the second location. |
| DR-07 | [C690664](https://shopview.testrail.io/index.php?/cases/view/690664) | 1, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The work order was set up as "labor $600.00, parts $400.00, shop supplies $30.00": it now says how (a labor line of 6.00 hours at $100.00, a part sold at $400.00, shop supplies typed by hand, the discount not on any line). |
| S2-14 | [C690667](https://shopview.testrail.io/index.php?/cases/view/690667) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-25 | [C690668](https://shopview.testrail.io/index.php?/cases/view/690668) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-26 | [C690669](https://shopview.testrail.io/index.php?/cases/view/690669) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S8-12 | [C690671](https://shopview.testrail.io/index.php?/cases/view/690671) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S3-04 | [C690672](https://shopview.testrail.io/index.php?/cases/view/690672) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S5-18 | [C715271](https://shopview.testrail.io/index.php?/cases/view/715271) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| REL-16 | [C715272](https://shopview.testrail.io/index.php?/cases/view/715272) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S2-15 | [C715564](https://shopview.testrail.io/index.php?/cases/view/715564) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S2-16 | [C715565](https://shopview.testrail.io/index.php?/cases/view/715565) | 1, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The work order to invoice and pay had no lines; it now has one approved labor line and one part. |
| S4-27 | [C715566](https://shopview.testrail.io/index.php?/cases/view/715566) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-28 | [C715567](https://shopview.testrail.io/index.php?/cases/view/715567) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S5-20 | [C715569](https://shopview.testrail.io/index.php?/cases/view/715569) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| REL-17 | [C715570](https://shopview.testrail.io/index.php?/cases/view/715570) | 2, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." Step 1 said "Open a filter ... (for example Location)": the preconditions set up three locations for the Location filter, so the step now opens the Location filter and the results name its labels. |
| REL-18 | [C715571](https://shopview.testrail.io/index.php?/cases/view/715571) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| REL-19 | [C715572](https://shopview.testrail.io/index.php?/cases/view/715572) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S1-10b | [C715639](https://shopview.testrail.io/index.php?/cases/view/715639) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S2-07b | [C715640](https://shopview.testrail.io/index.php?/cases/view/715640) | 1, 5, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The person the case changes (sales rep C, whose switch is turned off) was described as an existing staff member while sales rep A, who is only picked, was "created for this test": swapped, so the record the case changes is the one made for it. |
| S2-07c | [C715641](https://shopview.testrail.io/index.php?/cases/view/715641) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S3-02b | [C715642](https://shopview.testrail.io/index.php?/cases/view/715642) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-01b | [C715643](https://shopview.testrail.io/index.php?/cases/view/715643) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-04b | [C715644](https://shopview.testrail.io/index.php?/cases/view/715644) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-12b | [C715645](https://shopview.testrail.io/index.php?/cases/view/715645) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-14b | [C715646](https://shopview.testrail.io/index.php?/cases/view/715646) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-14c | [C715647](https://shopview.testrail.io/index.php?/cases/view/715647) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-15b | [C715648](https://shopview.testrail.io/index.php?/cases/view/715648) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-19b | [C715649](https://shopview.testrail.io/index.php?/cases/view/715649) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-20b | [C715650](https://shopview.testrail.io/index.php?/cases/view/715650) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S5-01b | [C715651](https://shopview.testrail.io/index.php?/cases/view/715651) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S5-08b | [C715652](https://shopview.testrail.io/index.php?/cases/view/715652) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S5-11b | [C715653](https://shopview.testrail.io/index.php?/cases/view/715653) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S6-01b | [C715654](https://shopview.testrail.io/index.php?/cases/view/715654) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S7-01b | [C715655](https://shopview.testrail.io/index.php?/cases/view/715655) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S7-01c | [C715656](https://shopview.testrail.io/index.php?/cases/view/715656) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S8-02b | [C715657](https://shopview.testrail.io/index.php?/cases/view/715657) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S8-04b | [C715658](https://shopview.testrail.io/index.php?/cases/view/715658) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S8-12b | [C715659](https://shopview.testrail.io/index.php?/cases/view/715659) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S8-06b | [C715660](https://shopview.testrail.io/index.php?/cases/view/715660) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S8-09b | [C715661](https://shopview.testrail.io/index.php?/cases/view/715661) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S8-10b | [C715662](https://shopview.testrail.io/index.php?/cases/view/715662) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S8-11b | [C715663](https://shopview.testrail.io/index.php?/cases/view/715663) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| REL-05b | [C715664](https://shopview.testrail.io/index.php?/cases/view/715664) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| REL-18b | [C715665](https://shopview.testrail.io/index.php?/cases/view/715665) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| REL-19b | [C715666](https://shopview.testrail.io/index.php?/cases/view/715666) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| D-05b | [C715667](https://shopview.testrail.io/index.php?/cases/view/715667) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| D-10b | [C715668](https://shopview.testrail.io/index.php?/cases/view/715668) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| D-11b | [C715669](https://shopview.testrail.io/index.php?/cases/view/715669) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| D-15b | [C715670](https://shopview.testrail.io/index.php?/cases/view/715670) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| D-15c | [C715671](https://shopview.testrail.io/index.php?/cases/view/715671) | 5, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." The part sale had no representative, so expanding sales reps A and B might not show its "Part Sales" row: it is now sales rep A's. |
| D-18b | [C715672](https://shopview.testrail.io/index.php?/cases/view/715672) | 2, 4, 6, 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." Step 2 said "Add Parts" and step 3 used the same words for the menu option and the field; both now say what to tap. "The same list opens as for each row" now says what the tester sees, against the picture of board 6.7. |
| S4-03b | [C724219](https://shopview.testrail.io/index.php?/cases/view/724219) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |
| S4-04c | [C724220](https://shopview.testrail.io/index.php?/cases/view/724220) | 7 | removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"." |

## Could not make concrete (meaning left unchanged)
- S2-11: Step 6: the sources say only that Part Sales Update v1 adds the part sale's log entry (Story 7 context note); they give no wording for it, so the result says it is worded as before this release.
- S4-01: Step 1: "in the place Edit Customer shows it today" (S4-R1): no source names the position.
- D-10: Step 1: "in the place Edit Customer shows it today" (S4-R1): no source names the position; the picture of board 2.3 is the reference.
- D-13: Step 1: "in the same spot as on Edit Customer" (S4-R1, board 2.16 note): no source names the position; the picture of board 2.16 is the reference.
- S4-19b: Step 1: the "Turn Off Sales Representative" warning "does not change" (S4-R21, answer 13): no source gives today's wording (only the product code does, which is never a source of expected results).
- S5-14: Step 2: "still shows the representatives captured when it was invoiced" (S5-R2 is about the invoice): no source says what the work order card shows after a rename.
- S8-07: Step 4: "without a full reload" (Sales By Representative spec S12-R3a): no source says what a full reload looks like to the user.
- REL-14: Step 1: "all figures as before the release": the case gives the exact figures; no source gives the pre-release figures beyond them.

## Negative check without a control
- S8-06b: Step 1 ("Nothing happens" on a Sales Type header click): the only control the sources back is sorting by a money column (Sales By Representative spec S11-R1), but no source says how a sorted column looks, so a tester could not tell that control passed; the header click itself is the trigger the tester performs.
- Every other "does not appear / nothing changes" result was checked: the same case already shows the trigger ran (the dropdown or window that opened, the copied name, the count read before, the row that is listed, the "Empty export" message), or the trigger is the tester's own click on what the result describes. S6-04 had none and now shows the printout opening first (S6-R4).

## Enrolment (check 8)
- Not applicable: check 8 is for A/R and A/P only. No case of this suite mentions enrolment or the "Switch location?" prompt.

## Left as they are, for the QA lead to confirm
- Four cases keep a note below the results that tells the tester when to mark the case Blocked because of something outside the case (not the closing "setup not done" line the fifteenth amendment removes): S1-09 (if the build never offers the person in the open list), S2-11 and S4-27 (if Part Sales Update v1 is not on the build), REL-19 (if Part Sales Update v1 was not on the site before the release). They sit in the byte-identical block below the results, so this pass did not touch them; the Blocked-line gate does not flag them. Say if they should go too.
- Two navigation facts came from other suites' recorded cases (Rule 118, facts only): Reports > Export Reports (Accounting) for the Sales Representative Assignments export (report suite C30292) and Settings > Imports for the contacts import (custom roles C26449). No build exists yet, so both are unverified, as is every case of the suite.

## Old vs new, every changed case (tester-facing text; script-generated from the live read-back and the draft)
#### S1-02 [C665916](https://shopview.testrail.io/index.php?/cases/view/665916)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S1-03 [C665917](https://shopview.testrail.io/index.php?/cases/view/665917)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S1-04 [C665918](https://shopview.testrail.io/index.php?/cases/view/665918)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S1-05 [C665919](https://shopview.testrail.io/index.php?/cases/view/665919)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S1-06 [C665920](https://shopview.testrail.io/index.php?/cases/view/665920)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S1-07 [C665921](https://shopview.testrail.io/index.php?/cases/view/665921)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S1-08 [C665922](https://shopview.testrail.io/index.php?/cases/view/665922)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S1-09 [C665923](https://shopview.testrail.io/index.php?/cases/view/665923)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S1-10 [C665924](https://shopview.testrail.io/index.php?/cases/view/665924)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
-  1. Make the next save of a Sales Representative change fail (for example by going offline in the browser).
+  1. Turn off this computer's network connection (Wi-Fi off or network cable unplugged), so the next save of a Sales Representative change fails.
```

#### S2-01 [C665925](https://shopview.testrail.io/index.php?/cases/view/665925)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S2-02 [C665926](https://shopview.testrail.io/index.php?/cases/view/665926)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S2-03 [C665927](https://shopview.testrail.io/index.php?/cases/view/665927)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S2-04 [C665928](https://shopview.testrail.io/index.php?/cases/view/665928)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S2-05 [C665929](https://shopview.testrail.io/index.php?/cases/view/665929)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S2-06 [C665930](https://shopview.testrail.io/index.php?/cases/view/665930)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S2-07 [C665931](https://shopview.testrail.io/index.php?/cases/view/665931)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S2-08 [C665932](https://shopview.testrail.io/index.php?/cases/view/665932)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - Create a work order for this test for that customer with "Sales Representative - Labor" set to sales rep A and "Sales Representative - Parts" set to sales rep B, and invoice it.
+  - Create a work order for this test for that customer with one approved labor line, one part, "Sales Representative - Labor" set to sales rep A and "Sales Representative - Parts" set to sales rep B, and invoice it.
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S2-09 [C665933](https://shopview.testrail.io/index.php?/cases/view/665933)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S2-10 [C665934](https://shopview.testrail.io/index.php?/cases/view/665934)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - Create a work order for this test for that customer with one "Sales Representative" field set to sales rep A, and invoice it (do not take a payment).
+  - Create a work order for this test for that customer with one approved labor line, one part and one "Sales Representative" field set to sales rep A, and invoice it (do not take a payment).
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
+  7. Expand sales rep B.
-     * The new invoice of the work order is credited to sales rep B, not sales rep A.
+     * The report shows today's date range.
+  R7:
+     * The new invoice of the work order is listed under sales rep B: it is credited to sales rep B, not sales rep A.
```

#### S2-11 [C665935](https://shopview.testrail.io/index.php?/cases/view/665935)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
-     * The log has an entry for the representative change to sales rep A, as Part Sales Update v1 records it.
+     * The log has an entry for the change of the representative to sales rep A, worded as a part sale's log entry was worded before this release.
```

#### S2-12 [C665936](https://shopview.testrail.io/index.php?/cases/view/665936)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S3-01 [C665937](https://shopview.testrail.io/index.php?/cases/view/665937)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S3-02 [C665938](https://shopview.testrail.io/index.php?/cases/view/665938)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
-     * The same dropdown Lead Technician and Service Advisor open on a phone opens.
-     * "Unassigned" is first, with the same options as on a desktop.
+     * The phone's own built-in list opens, the same kind Lead Technician and Service Advisor open on a phone.
+     * "Unassigned" is first, then the sales representatives: the same options as on a desktop.
```

#### S3-03 [C665939](https://shopview.testrail.io/index.php?/cases/view/665939)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
-     * The same native dropdown opens.
+     * The phone's own built-in list opens, the same kind Lead Technician and Service Advisor open on a phone.
```

#### S4-01 [C665940](https://shopview.testrail.io/index.php?/cases/view/665940)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-02 [C665941](https://shopview.testrail.io/index.php?/cases/view/665941)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-03 [C665942](https://shopview.testrail.io/index.php?/cases/view/665942)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-04 [C665943](https://shopview.testrail.io/index.php?/cases/view/665943)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-05 [C665944](https://shopview.testrail.io/index.php?/cases/view/665944)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-06 [C665945](https://shopview.testrail.io/index.php?/cases/view/665945)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-07 [C665946](https://shopview.testrail.io/index.php?/cases/view/665946)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-08 [C665947](https://shopview.testrail.io/index.php?/cases/view/665947)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-09 [C665948](https://shopview.testrail.io/index.php?/cases/view/665948)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-10 [C665949](https://shopview.testrail.io/index.php?/cases/view/665949)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-11 [C665950](https://shopview.testrail.io/index.php?/cases/view/665950)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-12 [C665951](https://shopview.testrail.io/index.php?/cases/view/665951)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-13 [C665952](https://shopview.testrail.io/index.php?/cases/view/665952)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-14 [C665953](https://shopview.testrail.io/index.php?/cases/view/665953)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-15 [C665954](https://shopview.testrail.io/index.php?/cases/view/665954)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-16 [C665955](https://shopview.testrail.io/index.php?/cases/view/665955)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-17 [C665956](https://shopview.testrail.io/index.php?/cases/view/665956)
```diff
--- old (live in TestRail)
+++ new (draft)
+  - Make sure sales rep B has no other invoices at the test location today, so the report would list sales rep B only if this invoice credited them.
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-18 [C665957](https://shopview.testrail.io/index.php?/cases/view/665957)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-19 [C665958](https://shopview.testrail.io/index.php?/cases/view/665958)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-20 [C665959](https://shopview.testrail.io/index.php?/cases/view/665959)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-21 [C665960](https://shopview.testrail.io/index.php?/cases/view/665960)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - Open the page with the Sales Representative Assignments export in a desktop browser at least 1024 pixels wide.
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
+  - Open Reports > Export Reports (in the Reports left sidebar, under Accounting) in a desktop browser at least 1024 pixels wide, so the "Export Report" dialog is open.
-  1. Download the Sales Representative Assignments export.
-  2. Open the downloaded file.
+  1. Pick "Sales Representative Assignments" in the Report Name list.
+  2. Click Export.
+  3. Open the downloaded file.
+     * "Sales Representative Assignments" is selected.
+  R2:
-  R2:
+  R3:
```

#### S4-22 [C665961](https://shopview.testrail.io/index.php?/cases/view/665961)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - Have a contacts import file that contains the customer with its current details.
-  - Open the contacts import in a desktop browser at least 1024 pixels wide.
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
+  - Have a contacts import file that holds this customer with its current name and details, so importing it re-imports the same customer (it does not add a new one).
+  - Open the contacts import page (Settings > Imports) in a desktop browser at least 1024 pixels wide.
```

#### S5-01 [C665962](https://shopview.testrail.io/index.php?/cases/view/665962)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
-     * The row shows Labor Invoiced $200.00 and Hrs Invoiced 2.00, with the labor columns filled.
+     * The row shows Labor Invoiced $200.00 and Hrs Invoiced 2.00.
+     * Its Hrs Worked, Labor Delta and Labor Margin cells show figures, not dashes.
-     * Sales rep A's summary row counts the invoice once.
+     * Sales rep A's summary row shows (1) after the name: it counts the invoice once.
-     * Sales rep B's summary row counts the invoice once.
+     * Sales rep B's summary row shows (1) after the name: it counts the invoice once.
```

#### S5-02 [C665963](https://shopview.testrail.io/index.php?/cases/view/665963)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S5-03 [C665964](https://shopview.testrail.io/index.php?/cases/view/665964)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S5-04 [C665965](https://shopview.testrail.io/index.php?/cases/view/665965)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S5-05 [C665966](https://shopview.testrail.io/index.php?/cases/view/665966)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S5-06 [C665967](https://shopview.testrail.io/index.php?/cases/view/665967)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S5-07 [C665968](https://shopview.testrail.io/index.php?/cases/view/665968)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S5-08 [C665969](https://shopview.testrail.io/index.php?/cases/view/665969)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
-     * It counts once.
+     * It counts once: sales rep A's summary row shows (2) after the name, one for each work order.
```

#### S5-09 [C665970](https://shopview.testrail.io/index.php?/cases/view/665970)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S5-10 [C665971](https://shopview.testrail.io/index.php?/cases/view/665971)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S5-11 [C665972](https://shopview.testrail.io/index.php?/cases/view/665972)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S5-12 [C665973](https://shopview.testrail.io/index.php?/cases/view/665973)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
-     * The cells of the side a row is not credited with show a dash.
+     * On the Labor row the parts cells show a dash.
+     * On the Parts row the labor, hours and Shop Supplies cells show a dash.
```

#### S5-13 [C665974](https://shopview.testrail.io/index.php?/cases/view/665974)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
-     * Sales rep B's summary row counts that invoice once.
+     * Sales rep B's summary row shows (1) after the name: it counts that invoice once.
-     * Sales rep A has a $0.00 row for the second work order, counted once.
+     * Sales rep A has a $0.00 row for the second work order.
+     * Sales rep A's summary row shows (2) after the name: the first work order and this one, each counted once.
```

#### S5-14 [C665975](https://shopview.testrail.io/index.php?/cases/view/665975)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S6-01 [C665976](https://shopview.testrail.io/index.php?/cases/view/665976)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S6-02 [C665977](https://shopview.testrail.io/index.php?/cases/view/665977)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S6-03 [C665978](https://shopview.testrail.io/index.php?/cases/view/665978)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S6-04 [C665979](https://shopview.testrail.io/index.php?/cases/view/665979)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
+     * The printout opens.
```

#### S7-01 [C665981](https://shopview.testrail.io/index.php?/cases/view/665981)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S7-02 [C665982](https://shopview.testrail.io/index.php?/cases/view/665982)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S7-03 [C665983](https://shopview.testrail.io/index.php?/cases/view/665983)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S8-01 [C665984](https://shopview.testrail.io/index.php?/cases/view/665984)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
-     * Part Sales rows leave the report, and the totals and counts follow.
+     * Part Sales rows leave the report.
+     * The totals and the invoice counts no longer include the part sale.
-     * The report shows its empty state with no invoices.
+     * The report lists no representatives and no invoices: it shows its empty state.
```

#### S8-02 [C665985](https://shopview.testrail.io/index.php?/cases/view/665985)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S8-03 [C665986](https://shopview.testrail.io/index.php?/cases/view/665986)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S8-04 [C665987](https://shopview.testrail.io/index.php?/cases/view/665987)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S8-05 [C665988](https://shopview.testrail.io/index.php?/cases/view/665988)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-23 [C665989](https://shopview.testrail.io/index.php?/cases/view/665989)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-24 [C665990](https://shopview.testrail.io/index.php?/cases/view/665990)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
-     * The new work order can carry on with it.
+     * The new work order shows the new customer.
```

#### S5-15 [C665991](https://shopview.testrail.io/index.php?/cases/view/665991)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S5-16 [C665992](https://shopview.testrail.io/index.php?/cases/view/665992)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S5-17 [C665993](https://shopview.testrail.io/index.php?/cases/view/665993)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - Make sure the test location has at least three invoices today: one split work order, one work order with one person on both sides and one part sale.
+  - Have, at the test location today, at least three invoices: one split work order (Labor and Parts set to the two staff members), one work order with one person on both sides and one part sale.
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S7-04 [C665994](https://shopview.testrail.io/index.php?/cases/view/665994)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S2-13 [C665995](https://shopview.testrail.io/index.php?/cases/view/665995)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S8-06 [C665996](https://shopview.testrail.io/index.php?/cases/view/665996)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S8-07 [C665997](https://shopview.testrail.io/index.php?/cases/view/665997)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S8-08 [C665998](https://shopview.testrail.io/index.php?/cases/view/665998)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S8-09 [C665999](https://shopview.testrail.io/index.php?/cases/view/665999)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S8-10 [C666000](https://shopview.testrail.io/index.php?/cases/view/666000)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S8-11 [C666001](https://shopview.testrail.io/index.php?/cases/view/666001)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### REL-15 [C666002](https://shopview.testrail.io/index.php?/cases/view/666002)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - Use a customer with no Sales Representative assigned.
-  - Have one invoiced work order and one reversed invoice for that customer today.
+  - Use a customer that has no other invoices today.
+  - Have, for that customer today, one invoiced work order with one part sold at $100.00, and another work order with one part sold at $50.00 that was invoiced and then had its invoice reversed.
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
-     * Only the invoiced work order counts.
+     * The customer's row holds only the invoiced work order's $100.00.
-     * The reversed invoice adds nothing to any count or total.
+     * The reversed invoice's $50.00 adds nothing to any count or total.
```

#### REL-01 [C666003](https://shopview.testrail.io/index.php?/cases/view/666003)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - Open the design pictures "customer-00-b-customer-page.png" (board 2.0), "customer-01-b-customer-dialog-open.png" (board 2.1) and "customer-02-b-new.png" (board 2.2) attached to this case beside the browser window at 100% (actual size). Names, numbers and dates in the pictures are sample data.
+  - Open the design pictures "customer-00-b-customer-page.png" (board 2.0), "customer-01-b-customer-dialog-open.png" (board 2.1) and "customer-02-b-new.png" (board 2.2) attached to this case beside the browser window at 100% (actual size), so you can see how these screens looked before the release. Names, numbers and dates in the pictures are sample data.
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
-     * "Sales Representative" reads "Unassigned".
-     * This is one of the few customers whose representative was no longer a user of the shop.
+     * "Sales Representative" reads "Unassigned" (customer C is one of the few customers whose representative was no longer a user of the shop).
```

#### REL-02 [C666004](https://shopview.testrail.io/index.php?/cases/view/666004)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - Open the design pictures "card-00-b-wo-rest2.png" (board 1.0) and "card-01-b-wo-open.png" (board 1.1) attached to this case beside the browser window at 100% (actual size). Names, numbers and dates in the pictures are sample data.
+  - Open the design pictures "card-00-b-wo-rest2.png" (board 1.0) and "card-01-b-wo-open.png" (board 1.1) attached to this case beside the browser window at 100% (actual size), so you can see how the card and its list looked before the release. Names, numbers and dates in the pictures are sample data.
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### REL-03 [C666005](https://shopview.testrail.io/index.php?/cases/view/666005)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - Open the design pictures "sbr-00-b-sbr.png" (board 4.0), "sbr-01-b-sbr-filter.png" (board 4.1), "sbr-02-b-sbr-columns.png" (board 4.2) and "sbr-03-b-sbr-expanded.png" (board 4.3) attached to this case beside the browser window at 100% (actual size). Names, numbers and dates in the pictures are sample data.
+  - Open the design pictures "sbr-00-b-sbr.png" (board 4.0), "sbr-01-b-sbr-filter.png" (board 4.1), "sbr-02-b-sbr-columns.png" (board 4.2) and "sbr-03-b-sbr-expanded.png" (board 4.3) attached to this case beside the browser window at 100% (actual size), so you can see how the report looked before the release. Names, numbers and dates in the pictures are sample data.
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### REL-04 [C666006](https://shopview.testrail.io/index.php?/cases/view/666006)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### REL-05 [C666007](https://shopview.testrail.io/index.php?/cases/view/666007)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### REL-06 [C666008](https://shopview.testrail.io/index.php?/cases/view/666008)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - Open the design picture "sbc-00-b-sbc-filter.png" (board 5.0) attached to this case beside the browser window at 100% (actual size). Names, numbers and dates in the pictures are sample data.
+  - Open the design picture "sbc-00-b-sbc-filter.png" (board 5.0) attached to this case beside the browser window at 100% (actual size), so you can see how the filter looked before the release. Names, numbers and dates in the pictures are sample data.
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### REL-07 [C666009](https://shopview.testrail.io/index.php?/cases/view/666009)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - Open the work order in a desktop browser at least 1024 pixels wide.
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
+  - Have a screenshot of this imported work order's card taken before the release was installed, so you can compare.
+  - With the release installed, open the work order in a desktop browser at least 1024 pixels wide.
-     * The imported work order looks as it did before.
+     * The imported work order looks the same as in the screenshot taken before the release.
```

#### REL-08 [C666010](https://shopview.testrail.io/index.php?/cases/view/666010)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### REL-09 [C666011](https://shopview.testrail.io/index.php?/cases/view/666011)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### REL-10 [C666012](https://shopview.testrail.io/index.php?/cases/view/666012)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### REL-11 [C666013](https://shopview.testrail.io/index.php?/cases/view/666013)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### REL-12 [C666014](https://shopview.testrail.io/index.php?/cases/view/666014)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - Use a phone screen.
-  - Open the design pictures "phone-00-b-phone-details.png" (board 6.0) and "phone-01-b-phone-open.png" (board 6.1) attached to this case beside the browser window at 100% (actual size). Names, numbers and dates in the pictures are sample data.
+  - Open the design pictures "phone-00-b-phone-details.png" (board 6.0) and "phone-01-b-phone-open.png" (board 6.1) attached to this case beside the browser window at 100% (actual size), so you can see how the details panel and the representative list look before the release. Names, numbers and dates in the pictures are sample data.
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
-     * The card expands with the same control as before.
+     * The card expands with the same edit button as before the release.
-     * Its dropdown opens as today.
+     * Its list opens as it did before the release (as in the picture of board 6.1).
```

#### REL-13 [C666015](https://shopview.testrail.io/index.php?/cases/view/666015)
```diff
--- old (live in TestRail)
+++ new (draft)
+  - Have the address of the Sales By Representative report, copied from the browser's address bar while signed in as an Admin.
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
-  2. Open the Sales By Representative report's address directly in the browser.
+  2. Paste that address into the browser's address bar and open it.
```

#### REL-14 [C666016](https://shopview.testrail.io/index.php?/cases/view/666016)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### D-01 [C666017](https://shopview.testrail.io/index.php?/cases/view/666017)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### D-02 [C666018](https://shopview.testrail.io/index.php?/cases/view/666018)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### D-03 [C666019](https://shopview.testrail.io/index.php?/cases/view/666019)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### D-04 [C666020](https://shopview.testrail.io/index.php?/cases/view/666020)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### D-05 [C666021](https://shopview.testrail.io/index.php?/cases/view/666021)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### D-06 [C666022](https://shopview.testrail.io/index.php?/cases/view/666022)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### D-07 [C666023](https://shopview.testrail.io/index.php?/cases/view/666023)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### D-08 [C666024](https://shopview.testrail.io/index.php?/cases/view/666024)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - Have a work order for that customer with Labor set to sales rep A and Parts set to sales rep B, and invoice it.
+  - Have a work order for that customer with one approved labor line, one part, Labor set to sales rep A and Parts set to sales rep B, and invoice it.
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### D-09 [C666025](https://shopview.testrail.io/index.php?/cases/view/666025)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### D-10 [C666026](https://shopview.testrail.io/index.php?/cases/view/666026)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### D-11 [C666027](https://shopview.testrail.io/index.php?/cases/view/666027)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### D-12 [C666028](https://shopview.testrail.io/index.php?/cases/view/666028)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
-     * They are in the window's order.
+     * They show in the window's order: Service Labor, then Service Parts, then Part Sales.
```

#### D-13 [C666029](https://shopview.testrail.io/index.php?/cases/view/666029)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
-     * New Customer has the same optional "Sales Representative" field and + as Edit Customer, in the same spot.
+     * New Customer shows the optional "Sales Representative" field in an outlined box, with the + beside it, in the same spot as on Edit Customer, as in the picture.
-     * The menu has the same two options as Edit Customer.
+     * The menu lists "Sales Representative - Service Parts" and then "Sales Representative - Part Sales", the same two options as Edit Customer.
```

#### D-14 [C666030](https://shopview.testrail.io/index.php?/cases/view/666030)
```diff
--- old (live in TestRail)
+++ new (draft)
-TITLE: A part sale's representative field is unchanged from Part Sales Update v1
+TITLE: A part sale's representative field keeps the look it has today
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
-     * Part Sales Update v1's own hover box and arrow show, the full width of the card.
+     * The field's own hover box and arrow show across the full width of the card, as in the picture of board 3.2.
```

#### D-15 [C666031](https://shopview.testrail.io/index.php?/cases/view/666031)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - Have, today, one invoiced split work order for that customer (Labor set to sales rep A, Parts set to sales rep B), one invoiced work order with sales rep A on both sides and one invoiced part sale with no shop supplies.
+  - Have, today, one invoiced split work order for that customer (Labor set to sales rep A, Parts set to sales rep B), one invoiced work order with sales rep A on both sides and one invoiced part sale for that customer with Sales Representative set to sales rep A and no shop supplies.
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
-     * A side a representative did not sell shows a dash (including Shop Supplies on the Parts row).
+     * On sales rep A's Labor row of the split invoice the parts columns show a dash.
+     * On sales rep B's Parts row the labor, hours and Shop Supplies columns show a dash.
```

#### D-16 [C666032](https://shopview.testrail.io/index.php?/cases/view/666032)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### D-17 [C666033](https://shopview.testrail.io/index.php?/cases/view/666033)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### D-18 [C666034](https://shopview.testrail.io/index.php?/cases/view/666034)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
-     * The native dropdown opens, the same as Lead Technician.
+     * The phone's own built-in list opens, the same kind Lead Technician opens.
```

#### DR-01 [C690658](https://shopview.testrail.io/index.php?/cases/view/690658)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - Have a first work order with "Sales Representative - Labor" set to one of them and "Sales Representative - Parts" set to the other, and invoice it.
+  - Have a first work order with one approved labor line, one part, "Sales Representative - Labor" set to one of them and "Sales Representative - Parts" set to the other, and invoice it.
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### DR-02 [C690659](https://shopview.testrail.io/index.php?/cases/view/690659)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### DR-03 [C690660](https://shopview.testrail.io/index.php?/cases/view/690660)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### DR-04 [C690661](https://shopview.testrail.io/index.php?/cases/view/690661)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### DR-06 [C690663](https://shopview.testrail.io/index.php?/cases/view/690663)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - Have a second location open to you, and select both locations in the Location filter so that the report shows its Location column.
+  - Have a second location open to you besides the test location, so that the report can show its Location column.
-  - Open Reports > Sales By Representative in that browser window, with the date range set to today and Show Unassigned on.
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
+  - Open Reports > Sales By Representative in that browser window, with the date range set to today, Show Unassigned on and both locations selected in the Location filter, so that the Location column shows.
```

#### DR-07 [C690664](https://shopview.testrail.io/index.php?/cases/view/690664)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - Have a work order for that customer with labor $600.00, parts $400.00, shop supplies $30.00 and a whole-invoice discount of $50.00, "Sales Representative - Labor" set to sales rep A and "Sales Representative - Parts" set to sales rep B, and invoice it today.
+  - Have a work order for that customer with one labor line of 6.00 hours at $100.00 an hour ($600.00), one part sold at $400.00, shop supplies typed by hand as $30.00 and a whole-invoice discount of $50.00 (not on any line), "Sales Representative - Labor" set to sales rep A and "Sales Representative - Parts" set to sales rep B, and invoice it today.
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S2-14 [C690667](https://shopview.testrail.io/index.php?/cases/view/690667)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-25 [C690668](https://shopview.testrail.io/index.php?/cases/view/690668)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-26 [C690669](https://shopview.testrail.io/index.php?/cases/view/690669)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S8-12 [C690671](https://shopview.testrail.io/index.php?/cases/view/690671)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S3-04 [C690672](https://shopview.testrail.io/index.php?/cases/view/690672)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S5-18 [C715271](https://shopview.testrail.io/index.php?/cases/view/715271)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### REL-16 [C715272](https://shopview.testrail.io/index.php?/cases/view/715272)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S2-15 [C715564](https://shopview.testrail.io/index.php?/cases/view/715564)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S2-16 [C715565](https://shopview.testrail.io/index.php?/cases/view/715565)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - Create a work order for this test for that customer with "Sales Representative - Labor" set to sales rep A and "Sales Representative - Parts" set to sales rep B, then invoice it and take payment in full.
+  - Create a work order for this test for that customer with one approved labor line, one part, "Sales Representative - Labor" set to sales rep A and "Sales Representative - Parts" set to sales rep B, then invoice it and take payment in full.
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-27 [C715566](https://shopview.testrail.io/index.php?/cases/view/715566)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-28 [C715567](https://shopview.testrail.io/index.php?/cases/view/715567)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S5-20 [C715569](https://shopview.testrail.io/index.php?/cases/view/715569)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### REL-17 [C715570](https://shopview.testrail.io/index.php?/cases/view/715570)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
-  1. Open a filter on the report that lets you tick several options (for example Location).
+  1. Open the Location filter (it lets you tick several options).
-     * The label reads "All" followed by the filter's own word, as before the release (for example "All locations").
+     * The label reads "All" followed by the filter's own word, as before the release (for the Location filter, "All locations").
-     * The label reads the count and the filter's own word, as before the release (for example "2 locations").
+     * The label reads the count and the filter's own word, as before the release (for the Location filter, "2 locations").
```

#### REL-18 [C715571](https://shopview.testrail.io/index.php?/cases/view/715571)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### REL-19 [C715572](https://shopview.testrail.io/index.php?/cases/view/715572)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S1-10b [C715639](https://shopview.testrail.io/index.php?/cases/view/715639)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S2-07b [C715640](https://shopview.testrail.io/index.php?/cases/view/715640)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - Create an active staff member for this test at the test location with the "Sales Representative" switch on: sales rep A.
-  - Have a second active staff member at the test location with the "Sales Representative" switch on: sales rep C.
+  - Have an active staff member at the test location with the "Sales Representative" switch on: sales rep A.
+  - Create a second active staff member for this test at the test location with the "Sales Representative" switch on: sales rep C.
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S2-07c [C715641](https://shopview.testrail.io/index.php?/cases/view/715641)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S3-02b [C715642](https://shopview.testrail.io/index.php?/cases/view/715642)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-01b [C715643](https://shopview.testrail.io/index.php?/cases/view/715643)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-04b [C715644](https://shopview.testrail.io/index.php?/cases/view/715644)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-12b [C715645](https://shopview.testrail.io/index.php?/cases/view/715645)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-14b [C715646](https://shopview.testrail.io/index.php?/cases/view/715646)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-14c [C715647](https://shopview.testrail.io/index.php?/cases/view/715647)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-15b [C715648](https://shopview.testrail.io/index.php?/cases/view/715648)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-19b [C715649](https://shopview.testrail.io/index.php?/cases/view/715649)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-20b [C715650](https://shopview.testrail.io/index.php?/cases/view/715650)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S5-01b [C715651](https://shopview.testrail.io/index.php?/cases/view/715651)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S5-08b [C715652](https://shopview.testrail.io/index.php?/cases/view/715652)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S5-11b [C715653](https://shopview.testrail.io/index.php?/cases/view/715653)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S6-01b [C715654](https://shopview.testrail.io/index.php?/cases/view/715654)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S7-01b [C715655](https://shopview.testrail.io/index.php?/cases/view/715655)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S7-01c [C715656](https://shopview.testrail.io/index.php?/cases/view/715656)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S8-02b [C715657](https://shopview.testrail.io/index.php?/cases/view/715657)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S8-04b [C715658](https://shopview.testrail.io/index.php?/cases/view/715658)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S8-12b [C715659](https://shopview.testrail.io/index.php?/cases/view/715659)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S8-06b [C715660](https://shopview.testrail.io/index.php?/cases/view/715660)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S8-09b [C715661](https://shopview.testrail.io/index.php?/cases/view/715661)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S8-10b [C715662](https://shopview.testrail.io/index.php?/cases/view/715662)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S8-11b [C715663](https://shopview.testrail.io/index.php?/cases/view/715663)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### REL-05b [C715664](https://shopview.testrail.io/index.php?/cases/view/715664)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### REL-18b [C715665](https://shopview.testrail.io/index.php?/cases/view/715665)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### REL-19b [C715666](https://shopview.testrail.io/index.php?/cases/view/715666)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### D-05b [C715667](https://shopview.testrail.io/index.php?/cases/view/715667)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### D-10b [C715668](https://shopview.testrail.io/index.php?/cases/view/715668)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### D-11b [C715669](https://shopview.testrail.io/index.php?/cases/view/715669)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### D-15b [C715670](https://shopview.testrail.io/index.php?/cases/view/715670)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### D-15c [C715671](https://shopview.testrail.io/index.php?/cases/view/715671)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - Have, today, one invoiced split work order for that customer (Labor set to sales rep A, Parts set to sales rep B), one invoiced work order with sales rep A on both sides and one invoiced part sale with no shop supplies.
+  - Have, today, one invoiced split work order for that customer (Labor set to sales rep A, Parts set to sales rep B), one invoiced work order with sales rep A on both sides and one invoiced part sale for that customer with Sales Representative set to sales rep A and no shop supplies.
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### D-18b [C715672](https://shopview.testrail.io/index.php?/cases/view/715672)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
-  2. Add Parts and compare with the picture of board 6.6.
-  3. Tap "Sales Representative - Parts" and compare with the picture of board 6.7.
+  2. Tap "Sales Representative - Parts" in the menu and compare with the picture of board 6.6.
+  3. Tap the "Sales Representative - Parts" field and compare with the picture of board 6.7.
-     * The same list opens as for each row.
+     * The Parts field opens the same list the Labor field has, as in the picture of board 6.7.
```

#### S4-03b [C724219](https://shopview.testrail.io/index.php?/cases/view/724219)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

#### S4-04c [C724220](https://shopview.testrail.io/index.php?/cases/view/724220)
```diff
--- old (live in TestRail)
+++ new (draft)
-  - If you cannot set up any of the above, mark this test Blocked: "setup not done".
```

