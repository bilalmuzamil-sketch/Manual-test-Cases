# Tech plan pass — every case, one verdict, a per-part record (22 Oct 2026, Rule 134)

Sources the cases were re-checked against: PRD v5 (Confluence 947650561, 21 Oct 2026, Chris Ward) · tech plan "A/R and A/P Report Sorting, Export and Location Filter — Technical Implementation Plan" (2026-10-21, uploaded 22 Oct 2026; read in full, READING-RECORD.md) · design canvas (read 22 Oct 2026) · Jira epic SV-11315 and stories (read 22 Oct 2026) · PO answers: none yet (questions 1 to 10 sent, 11 to 16 drafted).

Before = the cases as committed after the design pass (git `5f10e1005`); after = `authoring/proposals.json` and `AR-AP-SETUP-FILE.md` now. Each part below is compared by script (`make_pass_report.py`): CONFIRMED means byte-identical, CHANGED means rewritten. Every case was read whole (all case sources, 289 + 12); the parts marked CONFIRMED in a changed case were re-read against all current sources and needed no change.

## Counts

| Verdict | Cases |
|---|---|
| CONFIRMED | 259 |
| CHANGE | 30 |
| RETIRE | 0 |
| NEW CASE | 12 |
| **Total now** | **301** (289 before + 12 new) |

**RETIRE: none.** No statement of the tech plan proves a case wrong. Three held design-version cases (D-76, D-78, D-79) are contradicted by the tech plan as well as by the PRD; they stay held until Chris Ward answers questions 11, 13 and 14, as Rule 130 item 5 says.

## Changed cases — the per-part record

| Key | C-id | Why | title | preconditions | for-example lines | steps | results | quotes | From lines | build line | References from Design | notes | marker | refs | setup recipe | run membership |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| S1-07 | [C715279](https://shopview.testrail.io/index.php?/cases/view/715279) | TP-21 (D4): the tech plan says how two names that tie are ordered (lower-cased names as written, so Emile before Émile); PRD silent, no contradiction, so the case follows the plan (QA lead's ruling of 12 Aug 2026) and leaves the hold; question 1 stays open. | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED |
| S2-29 | [C715316](https://shopview.testrail.io/index.php?/cases/view/715316) | TP-65: "Go to the next page" only; the paging cases already say "or scroll until the next ones load" and question 5 is open: same wording, so the step works either way (runnability, Rule 114). | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S2-31 | [C715318](https://shopview.testrail.io/index.php?/cases/view/715318) | TP-65: on A/R Collection later groups arrive as the user scrolls (Phase 3 verification); step 3 now allows scrolling. | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| S2-32 | [C715319](https://shopview.testrail.io/index.php?/cases/view/715319) | TP-65: as S2-29 (A/P Summary). | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S2-34 | [C715321](https://shopview.testrail.io/index.php?/cases/view/715321) | TP-65: as S2-31 (A/P Unpaid Invoices). | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| S3-17 | [C715343](https://shopview.testrail.io/index.php?/cases/view/715343) | TP-41 (D30): the tech plan says several locations keep the order they were ticked; PRD silent (question 7, part 1), no contradiction: the case now ticks two locations in a known order and checks it. | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| S4-09 | [C715362](https://shopview.testrail.io/index.php?/cases/view/715362) | TP-33 (D21, manual checklist 3): what the pinned row shows (chevron and label, no amounts) and a fast scroll that must not overlap the headings or the Totals row. | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| S4-10 | [C715363](https://shopview.testrail.io/index.php?/cases/view/715363) | TP-33 (D21, manual checklist 3): as S4-09, plus the pinned customer row carries "Phone:" and "Credit term:" (precondition for the AP/AR switch added). | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED |
| S4-11 | [C715364](https://shopview.testrail.io/index.php?/cases/view/715364) | TP-33: as S4-09 (A/P Detail). | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| S4-12 | [C715365](https://shopview.testrail.io/index.php?/cases/view/715365) | TP-33: as S4-09 (A/P Unpaid Invoices). | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| S5-16 | [C715390](https://shopview.testrail.io/index.php?/cases/view/715390) | TP-11 (Q2, D13): a vendor has no single "own location"; the precondition now says where each bill was received, and the result compares two bills. | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| S5-17 | [C715391](https://shopview.testrail.io/index.php?/cases/view/715391) | TP-11 (Q2, D13): the credit that is not from a return is now said to be entered at {Location-A}; result wording says why it shows that location. | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| S5-20 | [C715394](https://shopview.testrail.io/index.php?/cases/view/715394) | TP-40 (D30): the address writes each location as its own "locationIds=" entry holding a code, not a name; the old step (add a location name with a comma) could not be done. Steps rewritten to get the codes and build a comma list. | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| S5-21 | [C715395](https://shopview.testrail.io/index.php?/cases/view/715395) | TP-39/TP-55 (D29, Phase 1 tests): the step now names where the location code sits; added the all-unknown link, which opens on All locations. | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| S5-22 | [C715396](https://shopview.testrail.io/index.php?/cases/view/715396) | TP-28 (D16): the step now names where the Past due value sits ("pastDue=") and what it reads (31-60). | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| S5-24 | [C715398](https://shopview.testrail.io/index.php?/cases/view/715398) | TP-42 (D31, API): the Customer menu lists at most 50 customers until you search, from all the organization's customers; the precondition now asks for that. | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| S5-26 | [C715400](https://shopview.testrail.io/index.php?/cases/view/715400) | TP-59/TP-60 (Phase 2 and 3): the reports are delivered family by family; a note tells the tester what a build with only the Summaries updated shows (Blocked, not Failed). | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| S5-27 | [C715401](https://shopview.testrail.io/index.php?/cases/view/715401) | TP-59/TP-60: as S5-26 (A/P). | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| S5-29 | [C715403](https://shopview.testrail.io/index.php?/cases/view/715403) | TP-30 (D18): the Vendor menu shows its search box only above 8 vendors; precondition added. | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| S5-30 | [C715404](https://shopview.testrail.io/index.php?/cases/view/715404) | TP-48 (Phase 1, fullSelectionNarrows): the "Any" row is ticked only while no range is; checked with none and with all four ticked. | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| S5-31 | [C715405](https://shopview.testrail.io/index.php?/cases/view/715405) | TP-48: as S5-30 (A/P Summary). | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| S7-02 | [C715415](https://shopview.testrail.io/index.php?/cases/view/715415) | TP-58 (Phase 3): the whole-row click, hand pointer and blue row text are removed on A/R Collection; hover step added. | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| S7-05 | [C715418](https://shopview.testrail.io/index.php?/cases/view/715418) | TP-50 (Phase 1): Cancel closes the prompt with no message; result added. | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| DATA-05 | [C715454](https://shopview.testrail.io/index.php?/cases/view/715454) | TP-68 (Phase 4): re-sorting keeps the bucket expanded and starts it again from its first 100 lines; the old step's "expand it if it closed" contradicted PRD S4-R8 and the plan. | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| DATA-06 | [C715455](https://shopview.testrail.io/index.php?/cases/view/715455) | TP-68: as DATA-05 (A/P Detail). | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| DATA-20 | [C715469](https://shopview.testrail.io/index.php?/cases/view/715469) | TP-79/TP-76: a 2,000-row PDF takes about 30 seconds, and a site may lack the PDF generator; result and note added. | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| REL-03 | [C715473](https://shopview.testrail.io/index.php?/cases/view/715473) | TP-26 (D9): the as-of line uses the location's time zone and writes the day without a leading zero; the evening condition and the result now say so. | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| D-32 | [C715512](https://shopview.testrail.io/index.php?/cases/view/715512) | TP-30 (D18): precondition of more than 8 vendors (search box). | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| D-73 | [C715555](https://shopview.testrail.io/index.php?/cases/view/715555) | TP-30 (D18): as D-32. | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |
| D-77 | [C715559](https://shopview.testrail.io/index.php?/cases/view/715559) | TP-30 (D18): as D-32 (held design-version case; stays held on question 12). | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED |

Run membership: S1-07 leaves the hold and joins run 549 when the QA lead approves the write (it was held out on question 1); every other changed case keeps its place (in the run, or held out: D-77).

## New cases

| Key | Section | Title | Marker | In run 549 | Why |
|---|---|---|---|---|---|
| S1-16 | S1 | A/R Summary sorts names that start with a punctuation mark by character | `AUTOMATION: HOLD - waiting on the PO (question 16: names that start with a punctuation mark)` | no (held) | TP-22 (DIVERGE): names that start with a punctuation mark; follows the PRD, held on question 16. |
| S3-28 | S3 | A/R Detail: exporting with every bucket closed still downloads every row | `AUTOMATION: HOLD - not yet build-verified (no build yet)` | yes | TP-38 (D28): A/R Detail export with every bucket closed still downloads every row. |
| S3-29 | S3 | A/P Detail: exporting with every bucket closed still downloads every row | `AUTOMATION: HOLD - not yet build-verified (no build yet)` | yes | TP-38 (D28): A/P Detail, the same. |
| S3-30 | S3 | A/R Summary: a name starting with = opens in the CSV as plain text | `AUTOMATION: HOLD - not yet build-verified (no build yet)` | yes | TP-81 (§9 Security): a name starting with "=" opens in the CSV as text, not as a formula. |
| S5-35 | S5 | A/R Collection: a link with an unknown customer ignores it | `AUTOMATION: HOLD - not yet build-verified (no build yet)` | yes | TP-39 (D29): an unknown customer in a link is ignored. |
| S5-36 | S5 | A/P Unpaid Invoices: a link with an unknown vendor ignores it | `AUTOMATION: HOLD - not yet build-verified (no build yet)` | yes | TP-39 (D29): an unknown vendor in a link is ignored. |
| S5-37 | S5 | A/R Summary: the As of date cannot be set later than today | `AUTOMATION: HOLD - not yet build-verified (no build yet)` | yes | TP-32 (D20): the As of date cannot be later than today. |
| S5-38 | S5 | A/R Summary: ticking several customers quickly shows rows for all of them | `AUTOMATION: HOLD - not yet build-verified (no build yet)` | yes | TP-08/TP-54 (NFR-005, D5): ticking several customers quickly ends with the rows for all of them. |
| DATA-22 | DATA | A/R Summary: a payment shows as soon as the report is reloaded | `AUTOMATION: HOLD - not yet build-verified (no build yet)` | yes | TP-04 (NFR-001, D1, replica lag): a payment shows on reload (Rule 116 freshness). |
| REL-11 | REL | A drill-down link saved before the release still opens on its customer | `AUTOMATION: HOLD - needs records and screenshots captured before the release is installed on the test site` | yes | TP-40/TP-59 (D30, Phase 2): an old drill-down link (customerId / vendorId) still opens on its customer or vendor. |
| REL-12 | REL | Other reports keep or forget their filters between visits as before | `AUTOMATION: HOLD - needs records and screenshots captured before the release is installed on the test site` | yes | TP-56 (regression re-runs): other reports keep or forget their filters as before. |
| REL-13 | REL | Sales By Customer's filter menus behave as before the release | `AUTOMATION: HOLD - needs records and screenshots captured before the release is installed on the test site` | yes | TP-56, TP-48: Sales By Customer's filter menus behave as before. |

## Every case

| Key | C-id | Verdict | Reason |
|---|---|---|---|
| S1-01 | [C715273](https://shopview.testrail.io/index.php?/cases/view/715273) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-21, TP-75. |
| S1-02 | [C715274](https://shopview.testrail.io/index.php?/cases/view/715274) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-21. |
| S1-03 | [C715275](https://shopview.testrail.io/index.php?/cases/view/715275) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-21, TP-75. |
| S1-04 | [C715276](https://shopview.testrail.io/index.php?/cases/view/715276) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-21. |
| S1-05 | [C715277](https://shopview.testrail.io/index.php?/cases/view/715277) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-21. |
| S1-06 | [C715278](https://shopview.testrail.io/index.php?/cases/view/715278) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-21. |
| S1-07 | [C715279](https://shopview.testrail.io/index.php?/cases/view/715279) | CHANGE | TP-21 (D4): the tech plan says how two names that tie are ordered (lower-cased names as written, so Emile before Émile); PRD silent, no contradiction, so the case follows the plan (QA lead's ruling of 12 Aug 2026) and leaves the hold; question 1 stays open. |
| S1-08 | [C715280](https://shopview.testrail.io/index.php?/cases/view/715280) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S1-09 | [C715281](https://shopview.testrail.io/index.php?/cases/view/715281) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S1-10 | [C715282](https://shopview.testrail.io/index.php?/cases/view/715282) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-62. |
| S1-11 | [C715283](https://shopview.testrail.io/index.php?/cases/view/715283) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-62. |
| S1-12 | [C715284](https://shopview.testrail.io/index.php?/cases/view/715284) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S1-13 | [C715285](https://shopview.testrail.io/index.php?/cases/view/715285) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S1-14 | [C715286](https://shopview.testrail.io/index.php?/cases/view/715286) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-44, TP-61. |
| S1-15 | [C715287](https://shopview.testrail.io/index.php?/cases/view/715287) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S1-16 | not in TestRail yet | NEW CASE | TP-22 (DIVERGE): names that start with a punctuation mark; follows the PRD, held on question 16. |
| S2-01 | [C715288](https://shopview.testrail.io/index.php?/cases/view/715288) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-75. |
| S2-02 | [C715289](https://shopview.testrail.io/index.php?/cases/view/715289) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-52. |
| S2-03 | [C715290](https://shopview.testrail.io/index.php?/cases/view/715290) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-04 | [C715291](https://shopview.testrail.io/index.php?/cases/view/715291) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-05 | [C715292](https://shopview.testrail.io/index.php?/cases/view/715292) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-06 | [C715293](https://shopview.testrail.io/index.php?/cases/view/715293) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-07 | [C715294](https://shopview.testrail.io/index.php?/cases/view/715294) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-08 | [C715295](https://shopview.testrail.io/index.php?/cases/view/715295) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-09 | [C715296](https://shopview.testrail.io/index.php?/cases/view/715296) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-52. |
| S2-10 | [C715297](https://shopview.testrail.io/index.php?/cases/view/715297) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-11 | [C715298](https://shopview.testrail.io/index.php?/cases/view/715298) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-12 | [C715299](https://shopview.testrail.io/index.php?/cases/view/715299) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-13 | [C715300](https://shopview.testrail.io/index.php?/cases/view/715300) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-52. |
| S2-14 | [C715301](https://shopview.testrail.io/index.php?/cases/view/715301) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-15 | [C715302](https://shopview.testrail.io/index.php?/cases/view/715302) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-16 | [C715303](https://shopview.testrail.io/index.php?/cases/view/715303) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-17 | [C715304](https://shopview.testrail.io/index.php?/cases/view/715304) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-52. |
| S2-18 | [C715305](https://shopview.testrail.io/index.php?/cases/view/715305) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-19 | [C715306](https://shopview.testrail.io/index.php?/cases/view/715306) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-20 | [C715307](https://shopview.testrail.io/index.php?/cases/view/715307) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-21 | [C715308](https://shopview.testrail.io/index.php?/cases/view/715308) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-52. |
| S2-22 | [C715309](https://shopview.testrail.io/index.php?/cases/view/715309) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-23 | [C715310](https://shopview.testrail.io/index.php?/cases/view/715310) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-35, TP-75. |
| S2-24 | [C715311](https://shopview.testrail.io/index.php?/cases/view/715311) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-66. |
| S2-25 | [C715312](https://shopview.testrail.io/index.php?/cases/view/715312) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-51, TP-68. |
| S2-26 | [C715313](https://shopview.testrail.io/index.php?/cases/view/715313) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-51. |
| S2-27 | [C715314](https://shopview.testrail.io/index.php?/cases/view/715314) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-51, TP-68, TP-69, TP-75. |
| S2-28 | [C715315](https://shopview.testrail.io/index.php?/cases/view/715315) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-51. |
| S2-29 | [C715316](https://shopview.testrail.io/index.php?/cases/view/715316) | CHANGE | TP-65: "Go to the next page" only; the paging cases already say "or scroll until the next ones load" and question 5 is open: same wording, so the step works either way (runnability, Rule 114). |
| S2-30 | [C715317](https://shopview.testrail.io/index.php?/cases/view/715317) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-31 | [C715318](https://shopview.testrail.io/index.php?/cases/view/715318) | CHANGE | TP-65: on A/R Collection later groups arrive as the user scrolls (Phase 3 verification); step 3 now allows scrolling. |
| S2-32 | [C715319](https://shopview.testrail.io/index.php?/cases/view/715319) | CHANGE | TP-65: as S2-29 (A/P Summary). |
| S2-33 | [C715320](https://shopview.testrail.io/index.php?/cases/view/715320) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-34 | [C715321](https://shopview.testrail.io/index.php?/cases/view/715321) | CHANGE | TP-65: as S2-31 (A/P Unpaid Invoices). |
| S2-35 | [C715322](https://shopview.testrail.io/index.php?/cases/view/715322) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-36 | [C715323](https://shopview.testrail.io/index.php?/cases/view/715323) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-37 | [C715324](https://shopview.testrail.io/index.php?/cases/view/715324) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-38 | [C715325](https://shopview.testrail.io/index.php?/cases/view/715325) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S2-39 | [C715326](https://shopview.testrail.io/index.php?/cases/view/715326) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S3-01 | [C715327](https://shopview.testrail.io/index.php?/cases/view/715327) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-27. |
| S3-02 | [C715328](https://shopview.testrail.io/index.php?/cases/view/715328) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S3-03 | [C715329](https://shopview.testrail.io/index.php?/cases/view/715329) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-18, TP-29. |
| S3-04 | [C715330](https://shopview.testrail.io/index.php?/cases/view/715330) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-18. |
| S3-05 | [C715331](https://shopview.testrail.io/index.php?/cases/view/715331) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-18. |
| S3-06 | [C715332](https://shopview.testrail.io/index.php?/cases/view/715332) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-18. |
| S3-07 | [C715333](https://shopview.testrail.io/index.php?/cases/view/715333) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-18. |
| S3-08 | [C715334](https://shopview.testrail.io/index.php?/cases/view/715334) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-18. |
| S3-09 | [C715335](https://shopview.testrail.io/index.php?/cases/view/715335) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-26, TP-29, TP-41, TP-46, TP-74. |
| S3-10 | [C715336](https://shopview.testrail.io/index.php?/cases/view/715336) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-26, TP-41. |
| S3-11 | [C715337](https://shopview.testrail.io/index.php?/cases/view/715337) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-26, TP-41, TP-75. |
| S3-12 | [C715338](https://shopview.testrail.io/index.php?/cases/view/715338) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-26, TP-41. |
| S3-13 | [C715339](https://shopview.testrail.io/index.php?/cases/view/715339) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-26, TP-41. |
| S3-14 | [C715340](https://shopview.testrail.io/index.php?/cases/view/715340) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-26, TP-41. |
| S3-15 | [C715341](https://shopview.testrail.io/index.php?/cases/view/715341) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S3-16 | [C715342](https://shopview.testrail.io/index.php?/cases/view/715342) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S3-17 | [C715343](https://shopview.testrail.io/index.php?/cases/view/715343) | CHANGE | TP-41 (D30): the tech plan says several locations keep the order they were ticked; PRD silent (question 7, part 1), no contradiction: the case now ticks two locations in a known order and checks it. |
| S3-18 | [C715344](https://shopview.testrail.io/index.php?/cases/view/715344) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S3-19 | [C715345](https://shopview.testrail.io/index.php?/cases/view/715345) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S3-20 | [C715346](https://shopview.testrail.io/index.php?/cases/view/715346) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S3-21 | [C715347](https://shopview.testrail.io/index.php?/cases/view/715347) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S3-22 | [C715348](https://shopview.testrail.io/index.php?/cases/view/715348) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S3-23 | [C715349](https://shopview.testrail.io/index.php?/cases/view/715349) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S3-24 | [C715350](https://shopview.testrail.io/index.php?/cases/view/715350) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-37. |
| S3-25 | [C715351](https://shopview.testrail.io/index.php?/cases/view/715351) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S3-26 | [C715352](https://shopview.testrail.io/index.php?/cases/view/715352) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-53. |
| S3-27 | [C715353](https://shopview.testrail.io/index.php?/cases/view/715353) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-53. |
| S3-28 | not in TestRail yet | NEW CASE | TP-38 (D28): A/R Detail export with every bucket closed still downloads every row. |
| S3-29 | not in TestRail yet | NEW CASE | TP-38 (D28): A/P Detail, the same. |
| S3-30 | not in TestRail yet | NEW CASE | TP-81 (§9 Security): a name starting with "=" opens in the CSV as text, not as a formula. |
| S4-01 | [C715354](https://shopview.testrail.io/index.php?/cases/view/715354) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-52. |
| S4-02 | [C715355](https://shopview.testrail.io/index.php?/cases/view/715355) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-52. |
| S4-03 | [C715356](https://shopview.testrail.io/index.php?/cases/view/715356) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-52. |
| S4-04 | [C715357](https://shopview.testrail.io/index.php?/cases/view/715357) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-52. |
| S4-05 | [C715358](https://shopview.testrail.io/index.php?/cases/view/715358) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-51, TP-65. |
| S4-06 | [C715359](https://shopview.testrail.io/index.php?/cases/view/715359) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-51, TP-65. |
| S4-07 | [C715360](https://shopview.testrail.io/index.php?/cases/view/715360) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-13, TP-46. |
| S4-08 | [C715361](https://shopview.testrail.io/index.php?/cases/view/715361) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-13, TP-69. |
| S4-09 | [C715362](https://shopview.testrail.io/index.php?/cases/view/715362) | CHANGE | TP-33 (D21, manual checklist 3): what the pinned row shows (chevron and label, no amounts) and a fast scroll that must not overlap the headings or the Totals row. |
| S4-10 | [C715363](https://shopview.testrail.io/index.php?/cases/view/715363) | CHANGE | TP-33 (D21, manual checklist 3): as S4-09, plus the pinned customer row carries "Phone:" and "Credit term:" (precondition for the AP/AR switch added). |
| S4-11 | [C715364](https://shopview.testrail.io/index.php?/cases/view/715364) | CHANGE | TP-33: as S4-09 (A/P Detail). |
| S4-12 | [C715365](https://shopview.testrail.io/index.php?/cases/view/715365) | CHANGE | TP-33: as S4-09 (A/P Unpaid Invoices). |
| S4-13 | [C715366](https://shopview.testrail.io/index.php?/cases/view/715366) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-51. |
| S4-14 | [C715367](https://shopview.testrail.io/index.php?/cases/view/715367) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-51. |
| S4-15 | [C715368](https://shopview.testrail.io/index.php?/cases/view/715368) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S4-16 | [C715369](https://shopview.testrail.io/index.php?/cases/view/715369) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S4-17 | [C715370](https://shopview.testrail.io/index.php?/cases/view/715370) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-51. |
| S4-18 | [C715371](https://shopview.testrail.io/index.php?/cases/view/715371) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-51. |
| S4-19 | [C715372](https://shopview.testrail.io/index.php?/cases/view/715372) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-51. |
| S4-20 | [C715373](https://shopview.testrail.io/index.php?/cases/view/715373) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-51. |
| S4-21 | [C715374](https://shopview.testrail.io/index.php?/cases/view/715374) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S5-01 | [C715375](https://shopview.testrail.io/index.php?/cases/view/715375) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S5-02 | [C715376](https://shopview.testrail.io/index.php?/cases/view/715376) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S5-03 | [C715377](https://shopview.testrail.io/index.php?/cases/view/715377) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S5-04 | [C715378](https://shopview.testrail.io/index.php?/cases/view/715378) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S5-05 | [C715379](https://shopview.testrail.io/index.php?/cases/view/715379) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S5-06 | [C715380](https://shopview.testrail.io/index.php?/cases/view/715380) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S5-07 | [C715381](https://shopview.testrail.io/index.php?/cases/view/715381) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S5-08 | [C715382](https://shopview.testrail.io/index.php?/cases/view/715382) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S5-09 | [C715383](https://shopview.testrail.io/index.php?/cases/view/715383) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S5-10 | [C715384](https://shopview.testrail.io/index.php?/cases/view/715384) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-13, TP-19, TP-75. |
| S5-11 | [C715385](https://shopview.testrail.io/index.php?/cases/view/715385) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-13, TP-19. |
| S5-12 | [C715386](https://shopview.testrail.io/index.php?/cases/view/715386) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S5-13 | [C715387](https://shopview.testrail.io/index.php?/cases/view/715387) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S5-14 | [C715388](https://shopview.testrail.io/index.php?/cases/view/715388) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-37, TP-74. |
| S5-15 | [C715389](https://shopview.testrail.io/index.php?/cases/view/715389) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S5-16 | [C715390](https://shopview.testrail.io/index.php?/cases/view/715390) | CHANGE | TP-11 (Q2, D13): a vendor has no single "own location"; the precondition now says where each bill was received, and the result compares two bills. |
| S5-17 | [C715391](https://shopview.testrail.io/index.php?/cases/view/715391) | CHANGE | TP-11 (Q2, D13): the credit that is not from a return is now said to be entered at {Location-A}; result wording says why it shows that location. |
| S5-18 | [C715392](https://shopview.testrail.io/index.php?/cases/view/715392) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S5-19 | [C715393](https://shopview.testrail.io/index.php?/cases/view/715393) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-40, TP-74. |
| S5-20 | [C715394](https://shopview.testrail.io/index.php?/cases/view/715394) | CHANGE | TP-40 (D30): the address writes each location as its own "locationIds=" entry holding a code, not a name; the old step (add a location name with a comma) could not be done. Steps rewritten to get the codes and build a comma list. |
| S5-21 | [C715395](https://shopview.testrail.io/index.php?/cases/view/715395) | CHANGE | TP-39/TP-55 (D29, Phase 1 tests): the step now names where the location code sits; added the all-unknown link, which opens on All locations. |
| S5-22 | [C715396](https://shopview.testrail.io/index.php?/cases/view/715396) | CHANGE | TP-28 (D16): the step now names where the Past due value sits ("pastDue=") and what it reads (31-60). |
| S5-23 | [C715397](https://shopview.testrail.io/index.php?/cases/view/715397) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-40, TP-74. |
| S5-24 | [C715398](https://shopview.testrail.io/index.php?/cases/view/715398) | CHANGE | TP-42 (D31, API): the Customer menu lists at most 50 customers until you search, from all the organization's customers; the precondition now asks for that. |
| S5-25 | [C715399](https://shopview.testrail.io/index.php?/cases/view/715399) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S5-26 | [C715400](https://shopview.testrail.io/index.php?/cases/view/715400) | CHANGE | TP-59/TP-60 (Phase 2 and 3): the reports are delivered family by family; a note tells the tester what a build with only the Summaries updated shows (Blocked, not Failed). |
| S5-27 | [C715401](https://shopview.testrail.io/index.php?/cases/view/715401) | CHANGE | TP-59/TP-60: as S5-26 (A/P). |
| S5-28 | [C715402](https://shopview.testrail.io/index.php?/cases/view/715402) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-30. |
| S5-29 | [C715403](https://shopview.testrail.io/index.php?/cases/view/715403) | CHANGE | TP-30 (D18): the Vendor menu shows its search box only above 8 vendors; precondition added. |
| S5-30 | [C715404](https://shopview.testrail.io/index.php?/cases/view/715404) | CHANGE | TP-48 (Phase 1, fullSelectionNarrows): the "Any" row is ticked only while no range is; checked with none and with all four ticked. |
| S5-31 | [C715405](https://shopview.testrail.io/index.php?/cases/view/715405) | CHANGE | TP-48: as S5-30 (A/P Summary). |
| S5-32 | [C715406](https://shopview.testrail.io/index.php?/cases/view/715406) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-42. |
| S5-33 | [C715407](https://shopview.testrail.io/index.php?/cases/view/715407) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-73. |
| S5-34 | [C715408](https://shopview.testrail.io/index.php?/cases/view/715408) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-73. |
| S5-35 | not in TestRail yet | NEW CASE | TP-39 (D29): an unknown customer in a link is ignored. |
| S5-36 | not in TestRail yet | NEW CASE | TP-39 (D29): an unknown vendor in a link is ignored. |
| S5-37 | not in TestRail yet | NEW CASE | TP-32 (D20): the As of date cannot be later than today. |
| S5-38 | not in TestRail yet | NEW CASE | TP-08/TP-54 (NFR-005, D5): ticking several customers quickly ends with the rows for all of them. |
| S6-01 | [C715409](https://shopview.testrail.io/index.php?/cases/view/715409) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S6-02 | [C715410](https://shopview.testrail.io/index.php?/cases/view/715410) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S6-03 | [C715411](https://shopview.testrail.io/index.php?/cases/view/715411) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-29, TP-37. |
| S6-04 | [C715412](https://shopview.testrail.io/index.php?/cases/view/715412) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-75. |
| S6-05 | [C715413](https://shopview.testrail.io/index.php?/cases/view/715413) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S7-01 | [C715414](https://shopview.testrail.io/index.php?/cases/view/715414) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-23, TP-58. |
| S7-02 | [C715415](https://shopview.testrail.io/index.php?/cases/view/715415) | CHANGE | TP-58 (Phase 3): the whole-row click, hand pointer and blue row text are removed on A/R Collection; hover step added. |
| S7-03 | [C715416](https://shopview.testrail.io/index.php?/cases/view/715416) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-23, TP-63, TP-75. |
| S7-04 | [C715417](https://shopview.testrail.io/index.php?/cases/view/715417) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-23, TP-63. |
| S7-05 | [C715418](https://shopview.testrail.io/index.php?/cases/view/715418) | CHANGE | TP-50 (Phase 1): Cancel closes the prompt with no message; result added. |
| S7-06 | [C715419](https://shopview.testrail.io/index.php?/cases/view/715419) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S7-07 | [C715420](https://shopview.testrail.io/index.php?/cases/view/715420) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-47. |
| S7-08 | [C715421](https://shopview.testrail.io/index.php?/cases/view/715421) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-47, TP-75. |
| S7-09 | [C715422](https://shopview.testrail.io/index.php?/cases/view/715422) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-82. |
| S7-10 | [C715423](https://shopview.testrail.io/index.php?/cases/view/715423) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-47. |
| S7-11 | [C715424](https://shopview.testrail.io/index.php?/cases/view/715424) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-19. |
| S7-12 | [C715425](https://shopview.testrail.io/index.php?/cases/view/715425) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-23, TP-31. |
| S7-13 | [C715426](https://shopview.testrail.io/index.php?/cases/view/715426) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-23, TP-31. |
| S7-14 | [C715427](https://shopview.testrail.io/index.php?/cases/view/715427) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-23, TP-31. |
| S7-15 | [C715428](https://shopview.testrail.io/index.php?/cases/view/715428) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-31. |
| S7-16 | [C715429](https://shopview.testrail.io/index.php?/cases/view/715429) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-31. |
| S7-17 | [C715430](https://shopview.testrail.io/index.php?/cases/view/715430) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-31. |
| S7-18 | [C715431](https://shopview.testrail.io/index.php?/cases/view/715431) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-31, TP-57, TP-61. |
| S7-19 | [C715432](https://shopview.testrail.io/index.php?/cases/view/715432) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-31. |
| S8-01 | [C715433](https://shopview.testrail.io/index.php?/cases/view/715433) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-34. |
| S8-02 | [C715434](https://shopview.testrail.io/index.php?/cases/view/715434) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-34. |
| S8-03 | [C715435](https://shopview.testrail.io/index.php?/cases/view/715435) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-34. |
| S8-04 | [C715436](https://shopview.testrail.io/index.php?/cases/view/715436) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-34. |
| S8-05 | [C715437](https://shopview.testrail.io/index.php?/cases/view/715437) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-34. |
| S8-06 | [C715438](https://shopview.testrail.io/index.php?/cases/view/715438) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-34. |
| S8-07 | [C715439](https://shopview.testrail.io/index.php?/cases/view/715439) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S8-08 | [C715440](https://shopview.testrail.io/index.php?/cases/view/715440) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S8-09 | [C715441](https://shopview.testrail.io/index.php?/cases/view/715441) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S8-10 | [C715442](https://shopview.testrail.io/index.php?/cases/view/715442) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S8-11 | [C715443](https://shopview.testrail.io/index.php?/cases/view/715443) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S8-12 | [C715444](https://shopview.testrail.io/index.php?/cases/view/715444) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| S9-01 | [C715445](https://shopview.testrail.io/index.php?/cases/view/715445) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-43, TP-64. |
| S9-02 | [C715446](https://shopview.testrail.io/index.php?/cases/view/715446) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-43. |
| S9-03 | [C715447](https://shopview.testrail.io/index.php?/cases/view/715447) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-25, TP-64, TP-74, TP-75. |
| S9-04 | [C715448](https://shopview.testrail.io/index.php?/cases/view/715448) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-25, TP-61, TP-74. |
| S8-13 | [C715449](https://shopview.testrail.io/index.php?/cases/view/715449) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| DATA-01 | [C715450](https://shopview.testrail.io/index.php?/cases/view/715450) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-05, TP-24, TP-46. |
| DATA-02 | [C715451](https://shopview.testrail.io/index.php?/cases/view/715451) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-05, TP-24. |
| DATA-03 | [C715452](https://shopview.testrail.io/index.php?/cases/view/715452) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-05, TP-24. |
| DATA-04 | [C715453](https://shopview.testrail.io/index.php?/cases/view/715453) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-05, TP-24. |
| DATA-05 | [C715454](https://shopview.testrail.io/index.php?/cases/view/715454) | CHANGE | TP-68 (Phase 4): re-sorting keeps the bucket expanded and starts it again from its first 100 lines; the old step's "expand it if it closed" contradicted PRD S4-R8 and the plan. |
| DATA-06 | [C715455](https://shopview.testrail.io/index.php?/cases/view/715455) | CHANGE | TP-68: as DATA-05 (A/P Detail). |
| DATA-07 | [C715456](https://shopview.testrail.io/index.php?/cases/view/715456) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-17, TP-18. |
| DATA-08 | [C715457](https://shopview.testrail.io/index.php?/cases/view/715457) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-17. |
| DATA-09 | [C715458](https://shopview.testrail.io/index.php?/cases/view/715458) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-17. |
| DATA-10 | [C715459](https://shopview.testrail.io/index.php?/cases/view/715459) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-17. |
| DATA-11 | [C715460](https://shopview.testrail.io/index.php?/cases/view/715460) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-17. |
| DATA-12 | [C715461](https://shopview.testrail.io/index.php?/cases/view/715461) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-17, TP-18. |
| DATA-13 | [C715462](https://shopview.testrail.io/index.php?/cases/view/715462) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-01, TP-17. |
| DATA-14 | [C715463](https://shopview.testrail.io/index.php?/cases/view/715463) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| DATA-15 | [C715464](https://shopview.testrail.io/index.php?/cases/view/715464) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| DATA-16 | [C715465](https://shopview.testrail.io/index.php?/cases/view/715465) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| DATA-17 | [C715466](https://shopview.testrail.io/index.php?/cases/view/715466) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| DATA-18 | [C715467](https://shopview.testrail.io/index.php?/cases/view/715467) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-06, TP-14, TP-20, TP-45, TP-69. |
| DATA-19 | [C715468](https://shopview.testrail.io/index.php?/cases/view/715468) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-06, TP-16, TP-45. |
| DATA-20 | [C715469](https://shopview.testrail.io/index.php?/cases/view/715469) | CHANGE | TP-79/TP-76: a 2,000-row PDF takes about 30 seconds, and a site may lack the PDF generator; result and note added. |
| DATA-21 | [C715470](https://shopview.testrail.io/index.php?/cases/view/715470) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-06, TP-10, TP-45. |
| DATA-22 | not in TestRail yet | NEW CASE | TP-04 (NFR-001, D1, replica lag): a payment shows on reload (Rule 116 freshness). |
| REL-01 | [C715471](https://shopview.testrail.io/index.php?/cases/view/715471) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-01, TP-02. |
| REL-02 | [C715472](https://shopview.testrail.io/index.php?/cases/view/715472) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-02. |
| REL-03 | [C715473](https://shopview.testrail.io/index.php?/cases/view/715473) | CHANGE | TP-26 (D9): the as-of line uses the location's time zone and writes the day without a leading zero; the evening condition and the result now say so. |
| REL-04 | [C715474](https://shopview.testrail.io/index.php?/cases/view/715474) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-25, TP-44, TP-70. |
| REL-05 | [C715475](https://shopview.testrail.io/index.php?/cases/view/715475) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-20, TP-56. |
| REL-06 | [C715476](https://shopview.testrail.io/index.php?/cases/view/715476) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| REL-07 | [C715477](https://shopview.testrail.io/index.php?/cases/view/715477) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-50, TP-56. |
| REL-08 | [C715478](https://shopview.testrail.io/index.php?/cases/view/715478) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-66. |
| REL-09 | [C715479](https://shopview.testrail.io/index.php?/cases/view/715479) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| REL-10 | [C715480](https://shopview.testrail.io/index.php?/cases/view/715480) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-73. |
| REL-11 | not in TestRail yet | NEW CASE | TP-40/TP-59 (D30, Phase 2): an old drill-down link (customerId / vendorId) still opens on its customer or vendor. |
| REL-12 | not in TestRail yet | NEW CASE | TP-56 (regression re-runs): other reports keep or forget their filters as before. |
| REL-13 | not in TestRail yet | NEW CASE | TP-56, TP-48: Sales By Customer's filter menus behave as before. |
| D-01 | [C715481](https://shopview.testrail.io/index.php?/cases/view/715481) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-71. |
| D-02 | [C715482](https://shopview.testrail.io/index.php?/cases/view/715482) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-72. |
| D-03 | [C715483](https://shopview.testrail.io/index.php?/cases/view/715483) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-04 | [C715484](https://shopview.testrail.io/index.php?/cases/view/715484) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-71. |
| D-05 | [C715485](https://shopview.testrail.io/index.php?/cases/view/715485) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-72. |
| D-06 | [C715486](https://shopview.testrail.io/index.php?/cases/view/715486) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-07 | [C715487](https://shopview.testrail.io/index.php?/cases/view/715487) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-71. |
| D-08 | [C715488](https://shopview.testrail.io/index.php?/cases/view/715488) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-72. |
| D-09 | [C715489](https://shopview.testrail.io/index.php?/cases/view/715489) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-10 | [C715490](https://shopview.testrail.io/index.php?/cases/view/715490) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-71. |
| D-11 | [C715491](https://shopview.testrail.io/index.php?/cases/view/715491) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-72. |
| D-12 | [C715492](https://shopview.testrail.io/index.php?/cases/view/715492) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-13 | [C715493](https://shopview.testrail.io/index.php?/cases/view/715493) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-69, TP-71. |
| D-14 | [C715494](https://shopview.testrail.io/index.php?/cases/view/715494) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-72. |
| D-15 | [C715495](https://shopview.testrail.io/index.php?/cases/view/715495) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-16 | [C715496](https://shopview.testrail.io/index.php?/cases/view/715496) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-71. |
| D-17 | [C715497](https://shopview.testrail.io/index.php?/cases/view/715497) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-72. |
| D-18 | [C715498](https://shopview.testrail.io/index.php?/cases/view/715498) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-19 | [C715499](https://shopview.testrail.io/index.php?/cases/view/715499) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-20 | [C715500](https://shopview.testrail.io/index.php?/cases/view/715500) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-21 | [C715501](https://shopview.testrail.io/index.php?/cases/view/715501) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-22 | [C715502](https://shopview.testrail.io/index.php?/cases/view/715502) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-23 | [C715503](https://shopview.testrail.io/index.php?/cases/view/715503) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-24 | [C715504](https://shopview.testrail.io/index.php?/cases/view/715504) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-25 | [C715505](https://shopview.testrail.io/index.php?/cases/view/715505) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-72, TP-83. |
| D-26 | [C715506](https://shopview.testrail.io/index.php?/cases/view/715506) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-72, TP-83. |
| D-27 | [C715507](https://shopview.testrail.io/index.php?/cases/view/715507) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-72, TP-83. |
| D-28 | [C715508](https://shopview.testrail.io/index.php?/cases/view/715508) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-72, TP-83. |
| D-29 | [C715509](https://shopview.testrail.io/index.php?/cases/view/715509) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-30 | [C715510](https://shopview.testrail.io/index.php?/cases/view/715510) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-31 | [C715511](https://shopview.testrail.io/index.php?/cases/view/715511) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-30. |
| D-32 | [C715512](https://shopview.testrail.io/index.php?/cases/view/715512) | CHANGE | TP-30 (D18): precondition of more than 8 vendors (search box). |
| D-33 | [C715513](https://shopview.testrail.io/index.php?/cases/view/715513) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-83. |
| D-34 | [C715514](https://shopview.testrail.io/index.php?/cases/view/715514) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-83. |
| D-35 | [C715515](https://shopview.testrail.io/index.php?/cases/view/715515) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-36 | [C715516](https://shopview.testrail.io/index.php?/cases/view/715516) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-37 | [C715517](https://shopview.testrail.io/index.php?/cases/view/715517) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-38 | [C715518](https://shopview.testrail.io/index.php?/cases/view/715518) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-53. |
| D-39 | [C715519](https://shopview.testrail.io/index.php?/cases/view/715519) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-63. |
| D-40 | [C715520](https://shopview.testrail.io/index.php?/cases/view/715520) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-63. |
| D-41 | [C715521](https://shopview.testrail.io/index.php?/cases/view/715521) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-34, TP-83. |
| D-42 | [C715522](https://shopview.testrail.io/index.php?/cases/view/715522) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-34, TP-83. |
| D-43 | [C715523](https://shopview.testrail.io/index.php?/cases/view/715523) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-43. |
| D-44 | [C715524](https://shopview.testrail.io/index.php?/cases/view/715524) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-45 | [C715525](https://shopview.testrail.io/index.php?/cases/view/715525) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-46 | [C715526](https://shopview.testrail.io/index.php?/cases/view/715526) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-47 | [C715527](https://shopview.testrail.io/index.php?/cases/view/715527) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-48 | [C715528](https://shopview.testrail.io/index.php?/cases/view/715528) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-49 | [C715529](https://shopview.testrail.io/index.php?/cases/view/715529) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-50 | [C715532](https://shopview.testrail.io/index.php?/cases/view/715532) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-51 | [C715533](https://shopview.testrail.io/index.php?/cases/view/715533) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-52 | [C715534](https://shopview.testrail.io/index.php?/cases/view/715534) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-53 | [C715535](https://shopview.testrail.io/index.php?/cases/view/715535) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-54 | [C715536](https://shopview.testrail.io/index.php?/cases/view/715536) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-55 | [C715537](https://shopview.testrail.io/index.php?/cases/view/715537) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-45. |
| D-56 | [C715538](https://shopview.testrail.io/index.php?/cases/view/715538) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-57 | [C715539](https://shopview.testrail.io/index.php?/cases/view/715539) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-33. |
| D-58 | [C715540](https://shopview.testrail.io/index.php?/cases/view/715540) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-33. |
| D-59 | [C715541](https://shopview.testrail.io/index.php?/cases/view/715541) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-60 | [C715542](https://shopview.testrail.io/index.php?/cases/view/715542) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-61 | [C715543](https://shopview.testrail.io/index.php?/cases/view/715543) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-72. |
| D-62 | [C715544](https://shopview.testrail.io/index.php?/cases/view/715544) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-63 | [C715545](https://shopview.testrail.io/index.php?/cases/view/715545) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-64 | [C715546](https://shopview.testrail.io/index.php?/cases/view/715546) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-50. |
| D-65 | [C715547](https://shopview.testrail.io/index.php?/cases/view/715547) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-66 | [C715548](https://shopview.testrail.io/index.php?/cases/view/715548) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-67 | [C715549](https://shopview.testrail.io/index.php?/cases/view/715549) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-68 | [C715550](https://shopview.testrail.io/index.php?/cases/view/715550) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-37. |
| D-69 | [C715551](https://shopview.testrail.io/index.php?/cases/view/715551) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-70 | [C715552](https://shopview.testrail.io/index.php?/cases/view/715552) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-60. |
| D-71 | [C715553](https://shopview.testrail.io/index.php?/cases/view/715553) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-48. |
| D-72 | [C715554](https://shopview.testrail.io/index.php?/cases/view/715554) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-73 | [C715555](https://shopview.testrail.io/index.php?/cases/view/715555) | CHANGE | TP-30 (D18): as D-32. |
| D-74 | [C715556](https://shopview.testrail.io/index.php?/cases/view/715556) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-75 | [C715557](https://shopview.testrail.io/index.php?/cases/view/715557) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-76 | [C715558](https://shopview.testrail.io/index.php?/cases/view/715558) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-63. |
| D-77 | [C715559](https://shopview.testrail.io/index.php?/cases/view/715559) | CHANGE | TP-30 (D18): as D-32 (held design-version case; stays held on question 12). |
| D-78 | [C715560](https://shopview.testrail.io/index.php?/cases/view/715560) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-37. |
| D-79 | [C715561](https://shopview.testrail.io/index.php?/cases/view/715561) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. Confirmed by TP-62. |
| D-80 | [C715562](https://shopview.testrail.io/index.php?/cases/view/715562) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
| D-81 | [C715563](https://shopview.testrail.io/index.php?/cases/view/715563) | CONFIRMED | Re-read whole against the tech plan; nothing in it changes this case. |
