# Report Suite - One question for Chris Ward: the location column - 2026-08-04 (needed today)

> ## ⚠️ SUPERSEDED 2026-08-04 — DO NOT SEND THIS SHEET
>
> The QA lead asked for **one sheet with three tabs**, so this sheet and the other two Chris Ward sheets were consolidated into a single workbook on **2026-08-04**:
>
> **`build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx`** (with a `.md` twin)
>
> Send **that** workbook, never this file. This one is kept only as the record of how its questions were derived and verified. Its content was carried across faithfully — four overlapping items across the three sheets were removed so nothing is asked twice, and every removal plus every text change is logged on the consolidated workbook's QA-only tab.

**STATUS: READY TO SEND** (not yet sent). Single issue. On return: ingest verbatim, then apply to the eight affected cases per the standing workflow - nothing is edited before his answer and the QA lead's go-ahead.

One question only, and it should take a minute. It is separate from the longer sheet you already have - that one still stands. This one is urgent because the automated versions of these tests are being written today, and eight of our checks are waiting on your answer.

---

## The location column - should it appear on its own, or does the user switch it on?

**What happens now:** The six reports can show a location column, telling you which branch each row belongs to. Right now they do not agree on how it should behave:

- **Sales By Customer, Sales By Representative, Parts Velocity and Technician Utilization** handle it on their own - the column appears when you are looking at more than one location, and disappears when you narrow to one.
- **Work In Progress** never shows it on its own. The column is missing until you switch it on yourself from the list of columns - even when you have every location in view.
- **Inventory Value** does the opposite. The column is on from the start, and it stays on even after you narrow to a single location - so you get a column repeating the same branch name on every row.
- **One more oddity on Inventory Value -** the screen and the downloaded file disagree with each other. The download drops the column when you narrow to one location, but the screen keeps it.

**But both of those two written descriptions say the column should be automatic, and should not be something the user switches on.** Quoting them directly:

- **Work In Progress:** *"The Location column is not offered in the column selector; its visibility is automatic - shown only when more than one location is in scope (Story 7)."*
- **Work In Progress:** *"...and is hidden whenever a single location is in scope; the user does not toggle it in the column selector."*
- **Inventory Value:** *"Its visibility follows the location scope automatically and it is not one of the columns offered in the column-selection control (Story 8)."*

**Why we are asking:** We are asking rather than assuming because our eight checks for those two reports currently describe what the product does today, not what your description asks for - which means if the product is the thing that is wrong, our tests would quietly pass it instead of catching it.

**The question:** Which behaviour should all six reports use for the location column?

**Options:**

- A) The column appears on its own whenever more than one location is in view, and disappears when only one is - it is not something the user switches on. (This matches what both your written descriptions already say, and what the other four reports already do. If you choose A we will raise the two reports that behave differently, and correct our eight checks so they would catch it.)
- B) The column is a switch the user turns on and off from the list of columns, and it stays however they left it. (If you choose B, the two written descriptions need updating to say so, and we will keep our eight checks as they are.)
- C) Something else, or it should differ between reports - please describe it.

**Your answer:** ____________________

**Needed today, please: the automated versions of these tests are being written today, and these eight checks cannot be finalised until we know which behaviour is the correct one.**

---

# QA-ONLY APPENDIX - do not send this part to Chris

TestRail C-ids verified against `build/report-suite/testrail-id-map.csv` at generation time; the generator aborts on any mismatch (Standing Rule 8).

## The affected cases - the TRUE count is 8, not 7

The audit's contradiction group is headed *"3 cases + 4 more to align"* (= 7) but its own table lists **8**, and all **8** were re-read live from TestRail on 2026-08-04 and **every one asserts the selector-controlled model**. The undercount appears to be `WIP-COL-01` (C30466), whose assertion sits in a *precondition* rather than an expected result - which is exactly why it still needs the edit. **True count: 8** (5 Inventory Value + 3 Work In Progress).

| Internal ID | TestRail | Link | Report | Spec anchor | What it asserts today |
|---|---|---|---|---|---|
| IV-COL-01 | C30551 | [open](https://shopview.testrail.io/index.php?/cases/view/30551) | Inventory Value | Inventory Value spec v3 S7-R6 | Asserts Location is in the column-selection control and appears 'when it is turned on', between Vendor and Qty. |
| IV-COL-04 | C30554 | [open](https://shopview.testrail.io/index.php?/cases/view/30554) | Inventory Value | Inventory Value spec v3 S7-R6 | Asserts Location can be 'turned on from the column-selection control' and then appears in its fixed position. |
| IV-PERS-02 | C30580 | [open](https://shopview.testrail.io/index.php?/cases/view/30580) | Inventory Value | Inventory Value spec v3 S7-R6 | Fixed column order stated 'with Location, when it is turned on in the column-selection control, between Vendor and Qty'. |
| IV-EXP-02 | C30588 | [open](https://shopview.testrail.io/index.php?/cases/view/30588) | Inventory Value | Inventory Value spec v3 S7-R6 | Tester note says the files carry Location 'when Location is turned ON in the column-selection control'. |
| IV-LOC-06 | C38917 | [open](https://shopview.testrail.io/index.php?/cases/view/38917) | Inventory Value | Inventory Value spec v3 S7-R6 | Step 1 instructs the tester to 'Turn Location on in the column-selection control'; expected says visibility 'follows that toggle, not the location selection'. |
| WIP-COL-01 | C30466 | [open](https://shopview.testrail.io/index.php?/cases/view/30466) | Work In Progress | WIP spec v6 S4-R3; S7-R13 | Precondition 4: 'Location is turned ON in the column-selection control (it is off by default).' |
| WIP-COL-02 | C30467 | [open](https://shopview.testrail.io/index.php?/cases/view/30467) | Work In Progress | WIP spec v6 S4-R3; S7-R13 | Asserts Location IS offered in the selector, off by default, and does 'NOT appear on its own' - and says out loud 'That is what the build does today.' |
| WIP-FLT-09 | C38916 | [open](https://shopview.testrail.io/index.php?/cases/view/38916) | Work In Progress | WIP spec v6 S4-R3; S7-R13 | Asserts 'The column does not appear or disappear on its own ... it follows the column-selection toggle only.' |

## What each answer resolves to

| Answer | Consequence |
|---|---|
| If Chris answers A (automatic - matches both specs) | All 8 cases are re-worded to assert the automatic, scope-driven model that SBC/SBR/PV/TU already use, and the observed selector-controlled build is recorded as a DEVIATION in the case notes (the pattern WIP-FLT-05 = C30502 already uses). Two build defects get raised: Work In Progress never shows it automatically; Inventory Value never hides it at single scope on screen. This is the outcome Standing Rule 33 already points to - the specs outrank our build observation - so A costs 8 re-words and 2 tickets. |
| If Chris answers B (user-toggled) | All 8 cases stand exactly as they are; no TestRail write is needed. Chris updates the two written descriptions (WIP S4-R3 + S7-R13, IV S7-R6). The 11 cases on the other four reports that assert the automatic model stay correct, because B would apply only to the two reports whose descriptions change - CONFIRM THIS WITH HIM if he picks B, since a suite-wide B would invalidate those 11. |
| If Chris answers C (something else / differs per report) | Re-derive per report from his answer; expect a further reconciliation pass and treat all 8 as blocked until then. |
| Regardless of the answer - a separate surface split to settle | On Inventory Value the SCREEN keeps the Location column at single scope while the CSV download drops it (screen observed 2026-08-04; CSV observed 2026-08-03, viu-2026-08-03/evidence/location-matrix/inventory-value__SINGLE__plain.csv has no Location header, __MULTI__ does). Two surfaces, two behaviours - IV-EXP-02 (C30588) is the export case affected. Standing Rule 40: every surface gets its own verdict. |

## Live evidence behind the "what happens now" text

| Observation | What was seen | Evidence |
|---|---|---|
| Work In Progress, every location in view | Headers: WO # | Status | Customer | Asset | Advisor | Days Open | Earned | Remaining | Total. NO Location column. Location IS listed in the Column Selection panel. | `evidence/location-behaviour.json; evidence/work-in-progress-selector.png` |
| Work In Progress, one location in view | Identical headers - still no Location column. | `evidence/location-single-vs-multi.json; evidence/wip-ONE-location-screen.png` |
| Inventory Value, every location in view | Headers: Part # | Description | Category | Vendor | LOCATION | Qty | Unit Cost | Unit Sell | Margin | Margin % | Total Sell | Total Cost. Location present, and ALSO offered in the Column Selection panel. | `evidence/location-behaviour.json; evidence/inventory-value-selector.png` |
| Inventory Value, ONE location in view (the deviation) | Location filter reads 'Staging Lethbridge - 4310' (single) yet the Location column is STILL shown, every row repeating 'Staging Lethbridge - 4310'. Reproduced twice. | `evidence/location-single-vs-multi.json; evidence/iv-ONE-location-screen.png` |
| Build marker (Standing Rule 49 - branch declared NOT FINAL) | v3.4.1-0ed4433 on sv8582.qa.shopview.com; index.html last-modified Mon, 03 Aug 2026 13:40:38 GMT, etag 02091e9dc11f187d7739b4efa166ea21 - byte-identical to the 2026-08-03 marker, so the build has not moved. All observations PROVISIONAL. | `../viu-2026-08-03/RECHECK-QUEUE.md` |

## Honesty notes

- Both reports were driven live on 2026-08-04 by mouse clicks; the single-location state was reached by de-selecting one of the two locations, leaving the filter reading a single branch, and the result was reproduced twice.
- The Column Selection panel's per-item on/off state could NOT be read reliably by automation (the detector reported every item as off, including columns plainly displayed). So the claim *"off by default"* on Work In Progress rests on the **column's absence from the grid** plus the 2026-08-03 pass's own observation, not on a machine reading of the toggle. The presence/absence of the column - which is what the question turns on - is solid.
- Standing Rule 49: the branch was declared NOT FINAL, so every observation here is PROVISIONAL and carries the build marker above.

