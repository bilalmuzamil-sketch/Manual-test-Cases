# A/R and A/P Report Sorting — PRD version 11 pass, 10 Nov 2026 (PASS-REPORT)

Feature: A/R and A/P Report Sorting, Export and Location Filter (epic SV-11315), TestRail group 90418. Sources: PRD Confluence 947650561 version 11 (5 Nov 2026, Chris Ward), Jira of 10 Nov 2026 (26 tickets), Chris Ward's answers 1 to 17, the tech plan of 21 Oct 2026, the design version of 5 Nov 2026 (1793886208-34e0). The QA lead's decisions of 10 Nov 2026: "Named set", "Yes, both", "Yes, add Q1 only", "Remove old, add later". Drafted only: nothing was written to TestRail, Jira, Slack or Google and nothing was committed. Assessment: `ASSESSMENT.md`.

## 1. Counts

| | Cases |
|---|---|
| Library after the pass | 380 (S1 22, S2 60, S3 36, S4 30, S5 46, S6 5, S7 21, S8 14, S9 4, DATA 30, REL 18, DESIGN 94) |
| CHANGE (rewritten top to bottom, Rule 134) | 133 |
| CONFIRMED, stamps only (From line, build sentence, marker) | 222 |
| NEW | 25 |
| RETIRE (proposed for deletion) | 1: REL-08 [C715478](https://shopview.testrail.io/index.php?/cases/view/715478) |
| Cases the update script writes | 355 (fields: custom_expected 344, custom_preconds+custom_expected 6, refs+custom_expected 2, title+custom_preconds+custom_expected 2, title+custom_preconds+custom_steps+custom_expected 1) |

## 2. What I did

- Folded the 9 live expect-fail blocks of 4 Nov 2026 into the library (`authoring/expect_fail_2026_11_04.json`); the library then rendered all 356 live cases byte for byte (`proposals-foldin-equal-live.json` = live).
- Pointed the library at PRD version 11 (`sources/CONFLUENCE-947650561-2026-11-05-read-2026-11-10.*`) and at the design version of 5 Nov 2026; every quote is checked word for word against PRD version 11 by build.py.
- Read every case in full once as the tester reads it (all 380, `readall` text, 3,125 lines, 100%), after the build.py and readiness gates. Found and fixed: D-13 (Location wrap, from the readiness read), D-02, D-03, D-10, D-11, D-12 (preconditions that named a column or row a Summary does not have), REL-03 (a day before the 10th, question 18), new S1-19 (a credit memo's Due Date on A/R Collection is not stated by the PRD: that bullet removed). No stamp-only case needed more than a stamp; S5-05 and S5-06 had moved to CHANGE earlier in this round (DD-02 line).
- Wrote the 25 new cases (`authoring/cases_v11.py`), removed REL-08 from the library (`authoring/v11_layout.py` REMOVED), refreshed the ticket ledger for all 26 tickets, re-rendered the setup file and the suite outputs, and prepared the write scripts as dry runs (`write/`).

## 3. The AUTOMATION marker (Rules 61 and 69, read in full)

- Rule 61: HOLD is only for what genuinely cannot be had; "no build yet" stopped being true on 10 Nov 2026 (QA build sv11315, v26.45.2-6a8b89c).
- Rule 69: a case whose steps cannot yet be build-verified carries `AUTOMATION: Not available on Build to test Yet - Last checked <M/D/YYYY>`; it never replaces an EXPECT FAIL or a real HOLD.
- Used: `AUTOMATION: Not available on Build to test Yet - Last checked 11/10/2026` on 356 cases (the 333 former "no build yet" HOLDs plus 23 of the new cases). Kept: 9 `READY - EXPECT FAIL` (SV-12138 ×2, SV-12139 ×5, SV-12140, SV-12141), 13 release-day HOLDs (REL-14 among them), DATA-19's developer-check HOLD. New: S3-32 `AUTOMATION: HOLD - waiting on the PO (question 18)`. Sum 356 + 9 + 13 + 1 + 1 = 380.
- **Flag for the QA lead:** Rule 69 says a metadata-only re-stamp normally keeps the marker as it is. Here the marker is changed on the 222 stamp-only cases because you ordered it ("the AUTOMATION marker whose 'no build yet' reason has gone"); it is the only marker change those cases get.

## 4. Gates

| Gate | Result |
|---|---|
| `authoring/build.py` | 380 cases, **0 PROBLEM lines**; every PRD code covered except S3-N2, OOS-1, UFS-2, which only the case deleted on 26 Oct 2026 (DATA-21) covered (left to the developers, as ruled then) |
| `build/testing-tools/tester_readiness_check.py build/ar-ap-report-sorting` | 380 cases, **0 hard problems**; all 200 "does not / never" results read, each has its control; the random sample (S4-11, REL-12b, S2-04, S3-15, S1-05) read in full: runnable |
| `build/testing-tools/ticket_sweep.py` (PRD version 11, flat copy of the 10 Nov search) | 26 tickets, **0 unhandled**, PRD handled 11, exit 0 |
| `authoring/render_setup.py` | `AR-AP-SETUP-FILE.md` 7,184 lines; no "mark this test Blocked" line |
| `authoring/render_outputs.py` | `REPORT.md`, `PO-QUESTIONS-DRAFT.md`, design checklist and register re-rendered; ledger and sweep config kept as refreshed 10 Nov |
| `write/_common.readiness()` (what every write script calls) | passes |
| `check_add_case_payloads.py` | PASS: no payload sends custom_atmstatus 3 (the new cases send 1) |

## 5. Write scripts (dry runs; the coordinator runs them with `--apply`, in this order)

| # | Script | Does | Dry run says |
|---|---|---|---|
| 1 | `write/update_v11.py` | update_case for the 355 kept cases, only the fields that differ; edit lock on the 10 Nov snapshot (live `updated_on` and every field to be written must equal the snapshot, else skipped and logged); before-copy, read-back, log | 355 cases |
| 2 | `write/create_v11.py` | add_case for the 25 new cases in their sections; refuses if a section holds a case not in our map; read-back; appends `testrail-id-map.csv` | 25 to add: S1 6 (90419), S2 8 (90420), S3 2 (90421), S4 2 (90422), S5 3 (90423), DATA 3 (90428), REL 1 (90429) |
| 3 | `write/delete_rel08.py` | delete_case C715478 (edit-locked) — the proposal; the coordinator decides | REL-08 C715478 |
| 4 | `write/run557_sync.py` | update_run 557 with the UNION of its current cases and 24 new ones (S3-32 left out: question 18); never removes a case | 24 to add (after step 2) |
| 5 | `write/delete_attachments.py` | delete_attachment for the 46 old picture copies, re-checking each before deleting | 46 attachments on 46 cases |

Order matters: 1 before 5 (the text stops calling the picture attached before it goes), 2 before 4. REL-14 goes into run 557 because the 12 other release-day cases are in it (run on release day); say if you want it out.

## 6. Attachments to delete (the three re-shot pictures, QA lead: "Remove old, add later")

Read with get_attachments_for_case on 10 Nov 2026; every one of the 356 live cases was scanned and exactly these 46 carry one of the three files (`live-before/attachments-all-2026-11-10.json`). Each case's References from Design now says the picture is no longer attached and quotes its new 5 Nov caption.

| Case | Attachment file to delete | Attachment id |
|---|---|---|
| S3-12 [C715338](https://shopview.testrail.io/index.php?/cases/view/715338) | ar-ap-p7-the-native-vendor-menu.png | 1000036292 |
| S3-13 [C715339](https://shopview.testrail.io/index.php?/cases/view/715339) | ar-ap-p7-the-native-vendor-menu.png | 1000036296 |
| S3-14 [C715340](https://shopview.testrail.io/index.php?/cases/view/715340) | ar-ap-p7-the-native-vendor-menu.png | 1000036300 |
| S3-24 [C715350](https://shopview.testrail.io/index.php?/cases/view/715350) | ar-ap-p4-cleared-no-locations.png | 1000036314 |
| S5-04 [C715378](https://shopview.testrail.io/index.php?/cases/view/715378) | ar-ap-p7-the-native-vendor-menu.png | 1000036364 |
| S5-14 [C715388](https://shopview.testrail.io/index.php?/cases/view/715388) | ar-ap-p4-cleared-no-locations.png | 1000036389 |
| S5-18 [C715392](https://shopview.testrail.io/index.php?/cases/view/715392) | ar-ap-p4-cleared-no-locations.png | 1000036403 |
| S5-24 [C715398](https://shopview.testrail.io/index.php?/cases/view/715398) | ar-ap-p7-the-native-vendor-menu.png | 1000036416 |
| S5-28 [C715402](https://shopview.testrail.io/index.php?/cases/view/715402) | ar-ap-p7-the-native-vendor-menu.png | 1000036423 |
| S5-29 [C715403](https://shopview.testrail.io/index.php?/cases/view/715403) | ar-ap-p7-the-native-vendor-menu.png | 1000036426 |
| S5-35 [C715577](https://shopview.testrail.io/index.php?/cases/view/715577) | ar-ap-p7-the-native-vendor-menu.png | 1000036777 |
| S5-36 [C715578](https://shopview.testrail.io/index.php?/cases/view/715578) | ar-ap-p7-the-native-vendor-menu.png | 1000036780 |
| S5-39 [C797943](https://shopview.testrail.io/index.php?/cases/view/797943) | ar-ap-p7-the-native-vendor-menu.png | 1000037543 |
| S6-03 [C715411](https://shopview.testrail.io/index.php?/cases/view/715411) | ar-ap-p4-cleared-no-locations.png | 1000036440 |
| S7-01 [C715414](https://shopview.testrail.io/index.php?/cases/view/715414) | ar-ap-p5-links-only-where-they-can-open.png | 1000036448 |
| S7-02 [C715415](https://shopview.testrail.io/index.php?/cases/view/715415) | ar-ap-p5-links-only-where-they-can-open.png | 1000036450 |
| S7-06 [C715419](https://shopview.testrail.io/index.php?/cases/view/715419) | ar-ap-p5-links-only-where-they-can-open.png | 1000036455 |
| S7-07 [C715420](https://shopview.testrail.io/index.php?/cases/view/715420) | ar-ap-p5-links-only-where-they-can-open.png | 1000036456 |
| S7-08 [C715421](https://shopview.testrail.io/index.php?/cases/view/715421) | ar-ap-p5-links-only-where-they-can-open.png | 1000036458 |
| S7-11 [C715424](https://shopview.testrail.io/index.php?/cases/view/715424) | ar-ap-p5-links-only-where-they-can-open.png | 1000036462 |
| S7-12 [C715425](https://shopview.testrail.io/index.php?/cases/view/715425) | ar-ap-p5-links-only-where-they-can-open.png | 1000036464 |
| S7-13 [C715426](https://shopview.testrail.io/index.php?/cases/view/715426) | ar-ap-p5-links-only-where-they-can-open.png | 1000036466 |
| S7-14 [C715427](https://shopview.testrail.io/index.php?/cases/view/715427) | ar-ap-p5-links-only-where-they-can-open.png | 1000036467 |
| S7-15 [C715428](https://shopview.testrail.io/index.php?/cases/view/715428) | ar-ap-p5-links-only-where-they-can-open.png | 1000036469 |
| S7-16 [C715429](https://shopview.testrail.io/index.php?/cases/view/715429) | ar-ap-p5-links-only-where-they-can-open.png | 1000036471 |
| S7-17 [C715430](https://shopview.testrail.io/index.php?/cases/view/715430) | ar-ap-p5-links-only-where-they-can-open.png | 1000036472 |
| S7-18 [C715431](https://shopview.testrail.io/index.php?/cases/view/715431) | ar-ap-p5-links-only-where-they-can-open.png | 1000036475 |
| S7-18b [C715610](https://shopview.testrail.io/index.php?/cases/view/715610) | ar-ap-p5-links-only-where-they-can-open.png | 1000036917 |
| S7-19 [C715432](https://shopview.testrail.io/index.php?/cases/view/715432) | ar-ap-p5-links-only-where-they-can-open.png | 1000036477 |
| DATA-20 [C715469](https://shopview.testrail.io/index.php?/cases/view/715469) | ar-ap-p7-the-native-vendor-menu.png | 1000036570 |
| REL-11 [C715582](https://shopview.testrail.io/index.php?/cases/view/715582) | ar-ap-p7-the-native-vendor-menu.png | 1000036792 |
| D-04 [C715484](https://shopview.testrail.io/index.php?/cases/view/715484) | ar-ap-p5-links-only-where-they-can-open.png | 1000036587 |
| D-04b [C715623](https://shopview.testrail.io/index.php?/cases/view/715623) | ar-ap-p5-links-only-where-they-can-open.png | 1000036940 |
| D-04c [C715624](https://shopview.testrail.io/index.php?/cases/view/715624) | ar-ap-p5-links-only-where-they-can-open.png | 1000036943 |
| D-19 [C715499](https://shopview.testrail.io/index.php?/cases/view/715499) | ar-ap-p4-cleared-no-locations.png | 1000036623 |
| D-20 [C715500](https://shopview.testrail.io/index.php?/cases/view/715500) | ar-ap-p4-cleared-no-locations.png | 1000036624 |
| D-21 [C715501](https://shopview.testrail.io/index.php?/cases/view/715501) | ar-ap-p4-cleared-no-locations.png | 1000036625 |
| D-22 [C715502](https://shopview.testrail.io/index.php?/cases/view/715502) | ar-ap-p4-cleared-no-locations.png | 1000036626 |
| D-23 [C715503](https://shopview.testrail.io/index.php?/cases/view/715503) | ar-ap-p4-cleared-no-locations.png | 1000036627 |
| D-24 [C715504](https://shopview.testrail.io/index.php?/cases/view/715504) | ar-ap-p4-cleared-no-locations.png | 1000036628 |
| D-25 [C715505](https://shopview.testrail.io/index.php?/cases/view/715505) | ar-ap-p5-links-only-where-they-can-open.png | 1000036630 |
| D-32 [C715512](https://shopview.testrail.io/index.php?/cases/view/715512) | ar-ap-p7-the-native-vendor-menu.png | 1000036650 |
| D-63 [C715545](https://shopview.testrail.io/index.php?/cases/view/715545) | ar-ap-p5-links-only-where-they-can-open.png | 1000036713 |
| D-68 [C715550](https://shopview.testrail.io/index.php?/cases/view/715550) | ar-ap-p4-cleared-no-locations.png | 1000036720 |
| D-73 [C715555](https://shopview.testrail.io/index.php?/cases/view/715555) | ar-ap-p7-the-native-vendor-menu.png | 1000036725 |
| D-81 [C715563](https://shopview.testrail.io/index.php?/cases/view/715563) | ar-ap-p5-links-only-where-they-can-open.png | 1000036736 |

## 7. Question 18 (the QA lead's Q1) — the row for Chris Ward's sheet

Sheet https://docs.google.com/spreadsheets/d/11_3z_TpKkOL-MiAWqxrj1jlHP1rn9QXu_h3uCR0SjVA, tab "Questions for Chris". Question 17 is in rows 24-25 (light purple, colour guide G3). Question 18 goes in rows 26-27 in a colour not used before, for example light pink, with colour guide H3 "Light pink = new question, 10 Nov 2026" (Rule 131). Answer cell: column E of row 27, yellow, empty.

Row 26 (heading line, as row 24): `New question, 10 Nov 2026 (spec version 11, 5 Nov 2026)`

Row 27:

| Column | Text |
|---|---|
| # | 18 |
| Topic | A/R and A/P Report Sorting: the date on the PDF's "As of" line for a day before the 10th |
| Question for you | The PDF of every one of the six reports starts with an "As of" line. For an as-of date before the 10th of the month (for example 4 November 2026), which form should it print?<br>(a) "As of Nov 4, 2026" — Suggested: the form of the "As of" example, no leading zero, with a comma<br>(b) "As of Nov 04, 2026" — a leading zero, with a comma<br>(c) "As of Nov 04 2026" — the PDF's own date form, as the document dates print |
| What we know today | The spec says: "Each export states the as-of date the user picked: the PDF "As of Oct 15, 2026", the CSV "As of: Oct 15, 2026" (format: three-letter month, day, four-digit year)." It also says the PDF uses the app-wide report format, where "dates print as "Nov 04 2026"". The "As of" example is the 15th, so it does not show whether a day before the 10th gets a leading zero, or which of the two rules the "As of" line follows. |
| Your answer | (empty, yellow) |
| Where we found it | PRD v11 (5 Nov 2026) S3-R4, S3-R7a; Jira SV-11533 (Story 3) |

Held on it: S3-32 (new, no C-id yet; out of run 557 until answered). REL-03 checks only which date the line shows, so it is not held. Q2 dropped as ordered. Not added to the sheet: that is the QA lead's or coordinator's write (no Google writes in this pass).

## 8. Tech-plan differences to report to the QA lead (Rules 115, 134)

- TP-66 (§6 Phase 4, backend): the plan says "credits never Current"; PRD v10/v11 S1-R5a puts a credit dated exactly on the as-of date in Current with Past Due 0. S1-18 follows the PRD and quotes the plan as the difference.
- TP-71 (§7 Manual testing checklist 1): the plan says Location wraps only on A/P Detail; PRD v11 S8-R3 also lets it wrap on A/P Unpaid Invoices. D-16 follows the PRD and quotes the plan as the difference.
- The tech plan file is unchanged since 22 Oct 2026 (read in full then); this round its 84 statements were re-checked against PRD v11 (TP-37 reason updated, TP-66 and TP-71 now DIVERGE); it was not re-read line by line. Say if you want it re-read in full.

## 9. Notes

- The setup file (`AR-AP-SETUP-FILE.md`) shows each case's tester preconditions as TestRail will hold them, including this pass's corrections; its "placeholders and example values" lines come from the case model, which the tester-text corrections (v11_layout) do not touch, so for D-02, D-03, D-10, D-11, D-12, D-63, D-68, D-73 and D-81 those lines still carry the earlier wording.
- Unchanged design blocks keep "read 22 Oct 2026": the QA lead's named set limits stamp-only cases to the From line, the build sentence and the marker; a design block that changes names the version of 5 Nov 2026.
- New cases carry custom_automation_type 2, as the 356 existing cases do; custom_atmstatus 1 (Not Automated).
- The CSV's "As of:" line has the same open point for a day before the 10th; no case depends on it (every CSV case uses the 15th), so it is not on the sheet (Q2 dropped).
- SV-11442 to SV-11447 moved to epic SV-12125 on 4 Nov 2026; REL-09 still checks they do not appear; the PRD's Out of Scope line still says they are tickets on SV-11315 (a wording point for Chris).

## 10. OUTSTANDING — what I need from you

| What | Why | Recommendation |
|---|---|---|
| Go-ahead to run the five write scripts (section 5) | TestRail writes need your permission (Rule 6) | run them in the order given |
| Go-ahead to delete REL-08 C715478 | ordered "Yes, both"; deletion is the coordinator's call | delete: PRD v11 S1-R5a reverses it and REL-14 replaces it |
| Add question 18 to Chris Ward's sheet (section 7) | no Google writes in this pass | add rows 26-27 as written |
| The three re-shot pictures (5 Nov 2026) | this account is not a writer of the design canvas, so the files cannot be fetched | share them, or open the canvas and download the three pictures |
| The 13 release-day cases' records and captures | must be made before the release is installed (19 Nov 2026) | testers capture them this week |

### Waiting on the PO

Sheet https://docs.google.com/spreadsheets/d/11_3z_TpKkOL-MiAWqxrj1jlHP1rn9QXu_h3uCR0SjVA: questions 1 to 17 answered. Question 18 (added 10 Nov 2026) is not sent yet; held on it: S3-32 (new). `build/PO-QUESTIONS-OPEN.md` needs this row once the question is on the sheet.

## 11. Reading coverage (Rule 119)

| Source | Size | Read |
|---|---|---|
| PRD v11 `sources/CONFLUENCE-947650561-2026-11-05-read-2026-11-10.md` | 58,699 bytes, 479 lines | 100% (lines 1-479); HTML 99,325 bytes diffed block by block against v9 |
| Jira, 26 tickets, `sources/JIRA-READING-2026-11-10.md` | 151,539 bytes, 2,030 lines | 100% (lines 1-2030) |
| Design version of 5 Nov 2026, 8 project files | 48,734 bytes | 100%; the 3 re-shot pictures could not be fetched |
| Chris Ward's answers 1 to 17 | 3,806 + 902 bytes | 100% |
| Tech plan | 88,174 bytes | read in full 22 Oct 2026; statements re-checked 10 Nov (section 8) |
| Every case of the library as the tester reads it | 380 cases, 3,125 lines | 100% |
| Live cases snapshot | 356 cases | 100% by script; 9 expect-fail blocks folded in byte for byte |
| Rules 61, 69, 113, 116, 117 (14th and 15th amendments), 128-139 | repo | 100% of those sections |

## 12. Per-case record (Rule 134)

Parts: T title, P preconditions, S steps, R results and notes, Q quotes, D References from Design, F refs, From line, build sentence, marker. CH = changed, ok = confirmed unchanged. Every kept case gets the three stamps (From line version 11 with its date, author and read date; the build sentence; the Rule 69 marker where the old marker was the "no build yet" HOLD).

| Case | C-id | Verdict | T | P | S | R | Q | D | F | Why |
|---|---|---|---|---|---|---|---|---|---|---|
| S1-01 | [C715273](https://shopview.testrail.io/index.php?/cases/view/715273) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S1-02 | [C715274](https://shopview.testrail.io/index.php?/cases/view/715274) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S1-03 | [C715275](https://shopview.testrail.io/index.php?/cases/view/715275) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S1-04 | [C715276](https://shopview.testrail.io/index.php?/cases/view/715276) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S1-05 | [C715277](https://shopview.testrail.io/index.php?/cases/view/715277) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S1-06 | [C715278](https://shopview.testrail.io/index.php?/cases/view/715278) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S1-07 | [C715279](https://shopview.testrail.io/index.php?/cases/view/715279) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S1-08 | [C715280](https://shopview.testrail.io/index.php?/cases/view/715280) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S1-09 | [C715281](https://shopview.testrail.io/index.php?/cases/view/715281) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S1-10 | [C715282](https://shopview.testrail.io/index.php?/cases/view/715282) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| S1-11 | [C715283](https://shopview.testrail.io/index.php?/cases/view/715283) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| S1-12 | [C715284](https://shopview.testrail.io/index.php?/cases/view/715284) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S1-13 | [C715285](https://shopview.testrail.io/index.php?/cases/view/715285) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S1-14 | [C715286](https://shopview.testrail.io/index.php?/cases/view/715286) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S1-15 | [C715287](https://shopview.testrail.io/index.php?/cases/view/715287) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S1-16 | [C715573](https://shopview.testrail.io/index.php?/cases/view/715573) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-01 | [C715288](https://shopview.testrail.io/index.php?/cases/view/715288) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-01b | [C715585](https://shopview.testrail.io/index.php?/cases/view/715585) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-02 | [C715289](https://shopview.testrail.io/index.php?/cases/view/715289) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-03 | [C715290](https://shopview.testrail.io/index.php?/cases/view/715290) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-04 | [C715291](https://shopview.testrail.io/index.php?/cases/view/715291) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-04b | [C715586](https://shopview.testrail.io/index.php?/cases/view/715586) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-05 | [C715292](https://shopview.testrail.io/index.php?/cases/view/715292) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-06 | [C715293](https://shopview.testrail.io/index.php?/cases/view/715293) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-07 | [C715294](https://shopview.testrail.io/index.php?/cases/view/715294) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-07b | [C715587](https://shopview.testrail.io/index.php?/cases/view/715587) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-08 | [C715295](https://shopview.testrail.io/index.php?/cases/view/715295) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-09 | [C715296](https://shopview.testrail.io/index.php?/cases/view/715296) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-10 | [C715297](https://shopview.testrail.io/index.php?/cases/view/715297) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-11 | [C715298](https://shopview.testrail.io/index.php?/cases/view/715298) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-12 | [C715299](https://shopview.testrail.io/index.php?/cases/view/715299) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| S2-12b | [C715588](https://shopview.testrail.io/index.php?/cases/view/715588) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-13 | [C715300](https://shopview.testrail.io/index.php?/cases/view/715300) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-14 | [C715301](https://shopview.testrail.io/index.php?/cases/view/715301) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-15 | [C715302](https://shopview.testrail.io/index.php?/cases/view/715302) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-15b | [C715589](https://shopview.testrail.io/index.php?/cases/view/715589) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-16 | [C715303](https://shopview.testrail.io/index.php?/cases/view/715303) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-17 | [C715304](https://shopview.testrail.io/index.php?/cases/view/715304) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-18 | [C715305](https://shopview.testrail.io/index.php?/cases/view/715305) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-19 | [C715306](https://shopview.testrail.io/index.php?/cases/view/715306) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-19b | [C715590](https://shopview.testrail.io/index.php?/cases/view/715590) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| S2-20 | [C715307](https://shopview.testrail.io/index.php?/cases/view/715307) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| S2-20b | [C715591](https://shopview.testrail.io/index.php?/cases/view/715591) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-21 | [C715308](https://shopview.testrail.io/index.php?/cases/view/715308) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-22 | [C715309](https://shopview.testrail.io/index.php?/cases/view/715309) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-23 | [C715310](https://shopview.testrail.io/index.php?/cases/view/715310) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-24 | [C715311](https://shopview.testrail.io/index.php?/cases/view/715311) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-25 | [C715312](https://shopview.testrail.io/index.php?/cases/view/715312) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-26 | [C715313](https://shopview.testrail.io/index.php?/cases/view/715313) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-27 | [C715314](https://shopview.testrail.io/index.php?/cases/view/715314) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-28 | [C715315](https://shopview.testrail.io/index.php?/cases/view/715315) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-29 | [C715316](https://shopview.testrail.io/index.php?/cases/view/715316) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S1-R8, S2-R7) |
| S2-30 | [C715317](https://shopview.testrail.io/index.php?/cases/view/715317) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S2-R7) |
| S2-31 | [C715318](https://shopview.testrail.io/index.php?/cases/view/715318) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S1-R8, S2-R7) |
| S2-32 | [C715319](https://shopview.testrail.io/index.php?/cases/view/715319) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S1-R8, S2-R7) |
| S2-33 | [C715320](https://shopview.testrail.io/index.php?/cases/view/715320) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S2-R7) |
| S2-34 | [C715321](https://shopview.testrail.io/index.php?/cases/view/715321) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S1-R8, S2-R7) |
| S2-35 | [C715322](https://shopview.testrail.io/index.php?/cases/view/715322) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S2-R7) |
| S2-36 | [C715323](https://shopview.testrail.io/index.php?/cases/view/715323) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-36b | [C715592](https://shopview.testrail.io/index.php?/cases/view/715592) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-37 | [C715324](https://shopview.testrail.io/index.php?/cases/view/715324) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-37b | [C715593](https://shopview.testrail.io/index.php?/cases/view/715593) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-38 | [C715325](https://shopview.testrail.io/index.php?/cases/view/715325) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-38b | [C715594](https://shopview.testrail.io/index.php?/cases/view/715594) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-39 | [C715326](https://shopview.testrail.io/index.php?/cases/view/715326) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-40 | [C797940](https://shopview.testrail.io/index.php?/cases/view/797940) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-41 | [C797941](https://shopview.testrail.io/index.php?/cases/view/797941) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S2-42 | [C797942](https://shopview.testrail.io/index.php?/cases/view/797942) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-01 | [C715327](https://shopview.testrail.io/index.php?/cases/view/715327) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-01b | [C715595](https://shopview.testrail.io/index.php?/cases/view/715595) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-01c | [C715596](https://shopview.testrail.io/index.php?/cases/view/715596) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-02 | [C715328](https://shopview.testrail.io/index.php?/cases/view/715328) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-02b | [C715597](https://shopview.testrail.io/index.php?/cases/view/715597) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-02c | [C715598](https://shopview.testrail.io/index.php?/cases/view/715598) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-03 | [C715329](https://shopview.testrail.io/index.php?/cases/view/715329) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-04 | [C715330](https://shopview.testrail.io/index.php?/cases/view/715330) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-05 | [C715331](https://shopview.testrail.io/index.php?/cases/view/715331) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-06 | [C715332](https://shopview.testrail.io/index.php?/cases/view/715332) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-07 | [C715333](https://shopview.testrail.io/index.php?/cases/view/715333) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-08 | [C715334](https://shopview.testrail.io/index.php?/cases/view/715334) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-09 | [C715335](https://shopview.testrail.io/index.php?/cases/view/715335) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-10 | [C715336](https://shopview.testrail.io/index.php?/cases/view/715336) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-11 | [C715337](https://shopview.testrail.io/index.php?/cases/view/715337) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-12 | [C715338](https://shopview.testrail.io/index.php?/cases/view/715338) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p7-the-native-vendor-menu.png no longer attached, its 5 Nov caption quoted; ruling line re-read against PRD v11 |
| S3-13 | [C715339](https://shopview.testrail.io/index.php?/cases/view/715339) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p7-the-native-vendor-menu.png no longer attached, its 5 Nov caption quoted; ruling line re-read against PRD v11 |
| S3-14 | [C715340](https://shopview.testrail.io/index.php?/cases/view/715340) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p7-the-native-vendor-menu.png no longer attached, its 5 Nov caption quoted; ruling line re-read against PRD v11 |
| S3-15 | [C715341](https://shopview.testrail.io/index.php?/cases/view/715341) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-16 | [C715342](https://shopview.testrail.io/index.php?/cases/view/715342) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-17 | [C715343](https://shopview.testrail.io/index.php?/cases/view/715343) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-18 | [C715344](https://shopview.testrail.io/index.php?/cases/view/715344) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-19 | [C715345](https://shopview.testrail.io/index.php?/cases/view/715345) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-20 | [C715346](https://shopview.testrail.io/index.php?/cases/view/715346) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-21 | [C715347](https://shopview.testrail.io/index.php?/cases/view/715347) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-22 | [C715348](https://shopview.testrail.io/index.php?/cases/view/715348) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-23 | [C715349](https://shopview.testrail.io/index.php?/cases/view/715349) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-24 | [C715350](https://shopview.testrail.io/index.php?/cases/view/715350) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p4-cleared-no-locations.png no longer attached, its 5 Nov caption quoted; ruling line re-read against PRD v11 |
| S3-25 | [C715351](https://shopview.testrail.io/index.php?/cases/view/715351) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-26 | [C715352](https://shopview.testrail.io/index.php?/cases/view/715352) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-27 | [C715353](https://shopview.testrail.io/index.php?/cases/view/715353) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-28 | [C715574](https://shopview.testrail.io/index.php?/cases/view/715574) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-29 | [C715575](https://shopview.testrail.io/index.php?/cases/view/715575) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S3-30 | [C715576](https://shopview.testrail.io/index.php?/cases/view/715576) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S4-01 | [C715354](https://shopview.testrail.io/index.php?/cases/view/715354) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S4-02 | [C715355](https://shopview.testrail.io/index.php?/cases/view/715355) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S4-03 | [C715356](https://shopview.testrail.io/index.php?/cases/view/715356) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S4-04 | [C715357](https://shopview.testrail.io/index.php?/cases/view/715357) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S4-05 | [C715358](https://shopview.testrail.io/index.php?/cases/view/715358) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S1-R8) |
| S4-06 | [C715359](https://shopview.testrail.io/index.php?/cases/view/715359) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S1-R8) |
| S4-07 | [C715360](https://shopview.testrail.io/index.php?/cases/view/715360) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S1-R8) |
| S4-08 | [C715361](https://shopview.testrail.io/index.php?/cases/view/715361) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S1-R8) |
| S4-09 | [C715362](https://shopview.testrail.io/index.php?/cases/view/715362) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named |
| S4-09b | [C715599](https://shopview.testrail.io/index.php?/cases/view/715599) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S8-R3) |
| S4-10 | [C715363](https://shopview.testrail.io/index.php?/cases/view/715363) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named |
| S4-10b | [C715600](https://shopview.testrail.io/index.php?/cases/view/715600) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S8-R3) |
| S4-11 | [C715364](https://shopview.testrail.io/index.php?/cases/view/715364) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named |
| S4-11b | [C715601](https://shopview.testrail.io/index.php?/cases/view/715601) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S8-R3) |
| S4-12 | [C715365](https://shopview.testrail.io/index.php?/cases/view/715365) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named |
| S4-12b | [C715602](https://shopview.testrail.io/index.php?/cases/view/715602) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S8-R3) |
| S4-13 | [C715366](https://shopview.testrail.io/index.php?/cases/view/715366) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S1-R8) |
| S4-14 | [C715367](https://shopview.testrail.io/index.php?/cases/view/715367) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S1-R8) |
| S4-15 | [C715368](https://shopview.testrail.io/index.php?/cases/view/715368) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S4-15b | [C715603](https://shopview.testrail.io/index.php?/cases/view/715603) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S4-16 | [C715369](https://shopview.testrail.io/index.php?/cases/view/715369) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S4-16b | [C715604](https://shopview.testrail.io/index.php?/cases/view/715604) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S4-17 | [C715370](https://shopview.testrail.io/index.php?/cases/view/715370) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S4-18 | [C715371](https://shopview.testrail.io/index.php?/cases/view/715371) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S4-19 | [C715372](https://shopview.testrail.io/index.php?/cases/view/715372) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S4-20 | [C715373](https://shopview.testrail.io/index.php?/cases/view/715373) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S4-21 | [C715374](https://shopview.testrail.io/index.php?/cases/view/715374) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S4-21b | [C715605](https://shopview.testrail.io/index.php?/cases/view/715605) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-01 | [C715375](https://shopview.testrail.io/index.php?/cases/view/715375) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-02 | [C715376](https://shopview.testrail.io/index.php?/cases/view/715376) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-03 | [C715377](https://shopview.testrail.io/index.php?/cases/view/715377) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-04 | [C715378](https://shopview.testrail.io/index.php?/cases/view/715378) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p7-the-native-vendor-menu.png no longer attached, its 5 Nov caption quoted; ruling line re-read against PRD v11 |
| S5-05 | [C715379](https://shopview.testrail.io/index.php?/cases/view/715379) | CHANGE | ok | ok | ok | ok | ok | CH | ok | Moved from stamp-only to CHANGE (round 2): the DD-02 ruling line in References from Design now reads as of PRD v11.; design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| S5-06 | [C715380](https://shopview.testrail.io/index.php?/cases/view/715380) | CHANGE | ok | ok | ok | ok | ok | CH | ok | Moved from stamp-only to CHANGE (round 2): same DD-02 ruling line.; design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| S5-07 | [C715381](https://shopview.testrail.io/index.php?/cases/view/715381) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-08 | [C715382](https://shopview.testrail.io/index.php?/cases/view/715382) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-09 | [C715383](https://shopview.testrail.io/index.php?/cases/view/715383) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-10 | [C715384](https://shopview.testrail.io/index.php?/cases/view/715384) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-10b | [C715606](https://shopview.testrail.io/index.php?/cases/view/715606) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-10c | [C715607](https://shopview.testrail.io/index.php?/cases/view/715607) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-11 | [C715385](https://shopview.testrail.io/index.php?/cases/view/715385) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-11b | [C715608](https://shopview.testrail.io/index.php?/cases/view/715608) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-11c | [C715609](https://shopview.testrail.io/index.php?/cases/view/715609) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-12 | [C715386](https://shopview.testrail.io/index.php?/cases/view/715386) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-13 | [C715387](https://shopview.testrail.io/index.php?/cases/view/715387) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-14 | [C715388](https://shopview.testrail.io/index.php?/cases/view/715388) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p4-cleared-no-locations.png no longer attached, its 5 Nov caption quoted; ruling line re-read against PRD v11 |
| S5-15 | [C715389](https://shopview.testrail.io/index.php?/cases/view/715389) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-16 | [C715390](https://shopview.testrail.io/index.php?/cases/view/715390) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-17 | [C715391](https://shopview.testrail.io/index.php?/cases/view/715391) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-18 | [C715392](https://shopview.testrail.io/index.php?/cases/view/715392) | CHANGE | ok | ok | ok | CH | CH | CH | ok | S5-E3 (PRD v11) settles step 3: location A stays ticked and the chip hides; the hedge note is removed; S5-E3 quoted.; design version of 5 Nov 2026 named; old picture ar-ap-p4-cleared-no-locations.png no longer attached, its 5 Nov caption quoted |
| S5-19 | [C715393](https://shopview.testrail.io/index.php?/cases/view/715393) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-20 | [C715394](https://shopview.testrail.io/index.php?/cases/view/715394) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-21 | [C715395](https://shopview.testrail.io/index.php?/cases/view/715395) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-22 | [C715396](https://shopview.testrail.io/index.php?/cases/view/715396) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-23 | [C715397](https://shopview.testrail.io/index.php?/cases/view/715397) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-24 | [C715398](https://shopview.testrail.io/index.php?/cases/view/715398) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p7-the-native-vendor-menu.png no longer attached, its 5 Nov caption quoted |
| S5-25 | [C715399](https://shopview.testrail.io/index.php?/cases/view/715399) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-26 | [C715400](https://shopview.testrail.io/index.php?/cases/view/715400) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-27 | [C715401](https://shopview.testrail.io/index.php?/cases/view/715401) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-28 | [C715402](https://shopview.testrail.io/index.php?/cases/view/715402) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p7-the-native-vendor-menu.png no longer attached, its 5 Nov caption quoted |
| S5-29 | [C715403](https://shopview.testrail.io/index.php?/cases/view/715403) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p7-the-native-vendor-menu.png no longer attached, its 5 Nov caption quoted; ruling line re-read against PRD v11 |
| S5-30 | [C715404](https://shopview.testrail.io/index.php?/cases/view/715404) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-31 | [C715405](https://shopview.testrail.io/index.php?/cases/view/715405) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-32 | [C715406](https://shopview.testrail.io/index.php?/cases/view/715406) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-33 | [C715407](https://shopview.testrail.io/index.php?/cases/view/715407) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-34 | [C715408](https://shopview.testrail.io/index.php?/cases/view/715408) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-35 | [C715577](https://shopview.testrail.io/index.php?/cases/view/715577) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p7-the-native-vendor-menu.png no longer attached, its 5 Nov caption quoted |
| S5-36 | [C715578](https://shopview.testrail.io/index.php?/cases/view/715578) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p7-the-native-vendor-menu.png no longer attached, its 5 Nov caption quoted |
| S5-37 | [C715579](https://shopview.testrail.io/index.php?/cases/view/715579) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-38 | [C715580](https://shopview.testrail.io/index.php?/cases/view/715580) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S5-39 | [C797943](https://shopview.testrail.io/index.php?/cases/view/797943) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p7-the-native-vendor-menu.png no longer attached, its 5 Nov caption quoted; ruling line re-read against PRD v11 |
| S6-01 | [C715409](https://shopview.testrail.io/index.php?/cases/view/715409) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S6-02 | [C715410](https://shopview.testrail.io/index.php?/cases/view/715410) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S6-03 | [C715411](https://shopview.testrail.io/index.php?/cases/view/715411) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p4-cleared-no-locations.png no longer attached, its 5 Nov caption quoted; ruling line re-read against PRD v11 |
| S6-04 | [C715412](https://shopview.testrail.io/index.php?/cases/view/715412) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S6-05 | [C715413](https://shopview.testrail.io/index.php?/cases/view/715413) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S7-01 | [C715414](https://shopview.testrail.io/index.php?/cases/view/715414) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p5-links-only-where-they-can-open.png no longer attached, its 5 Nov caption quoted |
| S7-02 | [C715415](https://shopview.testrail.io/index.php?/cases/view/715415) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p5-links-only-where-they-can-open.png no longer attached, its 5 Nov caption quoted |
| S7-03 | [C715416](https://shopview.testrail.io/index.php?/cases/view/715416) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named |
| S7-04 | [C715417](https://shopview.testrail.io/index.php?/cases/view/715417) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named |
| S7-05 | [C715418](https://shopview.testrail.io/index.php?/cases/view/715418) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S7-06 | [C715419](https://shopview.testrail.io/index.php?/cases/view/715419) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p5-links-only-where-they-can-open.png no longer attached, its 5 Nov caption quoted |
| S7-07 | [C715420](https://shopview.testrail.io/index.php?/cases/view/715420) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p5-links-only-where-they-can-open.png no longer attached, its 5 Nov caption quoted |
| S7-08 | [C715421](https://shopview.testrail.io/index.php?/cases/view/715421) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p5-links-only-where-they-can-open.png no longer attached, its 5 Nov caption quoted |
| S7-09 | [C715422](https://shopview.testrail.io/index.php?/cases/view/715422) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S7-10 | [C715423](https://shopview.testrail.io/index.php?/cases/view/715423) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S7-11 | [C715424](https://shopview.testrail.io/index.php?/cases/view/715424) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p5-links-only-where-they-can-open.png no longer attached, its 5 Nov caption quoted |
| S7-12 | [C715425](https://shopview.testrail.io/index.php?/cases/view/715425) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p5-links-only-where-they-can-open.png no longer attached, its 5 Nov caption quoted |
| S7-13 | [C715426](https://shopview.testrail.io/index.php?/cases/view/715426) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p5-links-only-where-they-can-open.png no longer attached, its 5 Nov caption quoted |
| S7-14 | [C715427](https://shopview.testrail.io/index.php?/cases/view/715427) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p5-links-only-where-they-can-open.png no longer attached, its 5 Nov caption quoted |
| S7-15 | [C715428](https://shopview.testrail.io/index.php?/cases/view/715428) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p5-links-only-where-they-can-open.png no longer attached, its 5 Nov caption quoted |
| S7-16 | [C715429](https://shopview.testrail.io/index.php?/cases/view/715429) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p5-links-only-where-they-can-open.png no longer attached, its 5 Nov caption quoted |
| S7-17 | [C715430](https://shopview.testrail.io/index.php?/cases/view/715430) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p5-links-only-where-they-can-open.png no longer attached, its 5 Nov caption quoted |
| S7-18 | [C715431](https://shopview.testrail.io/index.php?/cases/view/715431) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p5-links-only-where-they-can-open.png no longer attached, its 5 Nov caption quoted |
| S7-18b | [C715610](https://shopview.testrail.io/index.php?/cases/view/715610) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p5-links-only-where-they-can-open.png no longer attached, its 5 Nov caption quoted |
| S7-19 | [C715432](https://shopview.testrail.io/index.php?/cases/view/715432) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p5-links-only-where-they-can-open.png no longer attached, its 5 Nov caption quoted |
| S8-01 | [C715433](https://shopview.testrail.io/index.php?/cases/view/715433) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S8-02 | [C715434](https://shopview.testrail.io/index.php?/cases/view/715434) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S8-03 | [C715435](https://shopview.testrail.io/index.php?/cases/view/715435) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S8-04 | [C715436](https://shopview.testrail.io/index.php?/cases/view/715436) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S8-05 | [C715437](https://shopview.testrail.io/index.php?/cases/view/715437) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S8-06 | [C715438](https://shopview.testrail.io/index.php?/cases/view/715438) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S8-07 | [C715439](https://shopview.testrail.io/index.php?/cases/view/715439) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S8-07b | [C715611](https://shopview.testrail.io/index.php?/cases/view/715611) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S8-08 | [C715440](https://shopview.testrail.io/index.php?/cases/view/715440) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S8-09 | [C715441](https://shopview.testrail.io/index.php?/cases/view/715441) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S8-10 | [C715442](https://shopview.testrail.io/index.php?/cases/view/715442) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S8-11 | [C715443](https://shopview.testrail.io/index.php?/cases/view/715443) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S8-12 | [C715444](https://shopview.testrail.io/index.php?/cases/view/715444) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S9-01 | [C715445](https://shopview.testrail.io/index.php?/cases/view/715445) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S9-02 | [C715446](https://shopview.testrail.io/index.php?/cases/view/715446) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S9-03 | [C715447](https://shopview.testrail.io/index.php?/cases/view/715447) | CHANGE | ok | ok | ok | CH | CH | ok | ok | CSV heading "Credit Term" (PRD v11 S3-R8a; the group row keeps "Credit term: "). |
| S9-04 | [C715448](https://shopview.testrail.io/index.php?/cases/view/715448) | CHANGE | ok | ok | ok | CH | CH | ok | ok | CSV heading "Credit Term" (PRD v11 S3-R8a, S9-N2). |
| S8-13 | [C715449](https://shopview.testrail.io/index.php?/cases/view/715449) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| S7-20 | [C797944](https://shopview.testrail.io/index.php?/cases/view/797944) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named |
| DATA-01 | [C715450](https://shopview.testrail.io/index.php?/cases/view/715450) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S1-R8) |
| DATA-01b | [C715612](https://shopview.testrail.io/index.php?/cases/view/715612) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S1-R8) |
| DATA-02 | [C715451](https://shopview.testrail.io/index.php?/cases/view/715451) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S1-R8) |
| DATA-02b | [C715613](https://shopview.testrail.io/index.php?/cases/view/715613) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S1-R8) |
| DATA-03 | [C715452](https://shopview.testrail.io/index.php?/cases/view/715452) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S1-R8) |
| DATA-03b | [C715614](https://shopview.testrail.io/index.php?/cases/view/715614) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S1-R8) |
| DATA-04 | [C715453](https://shopview.testrail.io/index.php?/cases/view/715453) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S1-R8) |
| DATA-04b | [C715615](https://shopview.testrail.io/index.php?/cases/view/715615) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S1-R8) |
| DATA-05 | [C715454](https://shopview.testrail.io/index.php?/cases/view/715454) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S1-R8) |
| DATA-06 | [C715455](https://shopview.testrail.io/index.php?/cases/view/715455) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S1-R8) |
| DATA-07 | [C715456](https://shopview.testrail.io/index.php?/cases/view/715456) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| DATA-08 | [C715457](https://shopview.testrail.io/index.php?/cases/view/715457) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| DATA-09 | [C715458](https://shopview.testrail.io/index.php?/cases/view/715458) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| DATA-10 | [C715459](https://shopview.testrail.io/index.php?/cases/view/715459) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| DATA-11 | [C715460](https://shopview.testrail.io/index.php?/cases/view/715460) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| DATA-12 | [C715461](https://shopview.testrail.io/index.php?/cases/view/715461) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| DATA-13 | [C715462](https://shopview.testrail.io/index.php?/cases/view/715462) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| DATA-14 | [C715463](https://shopview.testrail.io/index.php?/cases/view/715463) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| DATA-15 | [C715464](https://shopview.testrail.io/index.php?/cases/view/715464) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| DATA-16 | [C715465](https://shopview.testrail.io/index.php?/cases/view/715465) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| DATA-17 | [C715466](https://shopview.testrail.io/index.php?/cases/view/715466) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| DATA-18 | [C715467](https://shopview.testrail.io/index.php?/cases/view/715467) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| DATA-19 | [C715468](https://shopview.testrail.io/index.php?/cases/view/715468) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| DATA-20 | [C715469](https://shopview.testrail.io/index.php?/cases/view/715469) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p7-the-native-vendor-menu.png no longer attached, its 5 Nov caption quoted; ruling line re-read against PRD v11 |
| DATA-22 | [C715581](https://shopview.testrail.io/index.php?/cases/view/715581) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| DATA-23 | [C797945](https://shopview.testrail.io/index.php?/cases/view/797945) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| DATA-24 | [C797946](https://shopview.testrail.io/index.php?/cases/view/797946) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| REL-01 | [C715471](https://shopview.testrail.io/index.php?/cases/view/715471) | CHANGE | ok | ok | ok | CH | CH | ok | CH | Each step's "Only the order may differ" now names the release changes PRD section 2 lists (S1-R5a credit on the as-of date in Current; on Detail and Collection S2-R1a plain dates and S2-R1b credit names); WC-12 to WC-14 quoted; refs add SV-11531, SV-11532 (the stories those lines belong to). |
| REL-02 | [C715472](https://shopview.testrail.io/index.php?/cases/view/715472) | CHANGE | ok | ok | ok | CH | CH | ok | CH | Same for A/P (vendor credit on the as-of date, plain dates, "Vendor Credit"); the A/R overpaid-invoice bullet copied from REL-01 is removed; WC-12 to WC-14 quoted; refs add SV-11531, SV-11532. |
| REL-03 | [C715473](https://shopview.testrail.io/index.php?/cases/view/715473) | CHANGE | ok | ok | ok | CH | ok | ok | ok | PRD v11 S3-R4's format no longer says "the day without a leading zero": example now "As of Oct 15, 2026"; for a day before the 10th the tester judges only the date (question 18). |
| REL-04 | [C715474](https://shopview.testrail.io/index.php?/cases/view/715474) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| REL-04b | [C715616](https://shopview.testrail.io/index.php?/cases/view/715616) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| REL-05 | [C715475](https://shopview.testrail.io/index.php?/cases/view/715475) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| REL-05b | [C715617](https://shopview.testrail.io/index.php?/cases/view/715617) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| REL-05c | [C715618](https://shopview.testrail.io/index.php?/cases/view/715618) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| REL-06 | [C715476](https://shopview.testrail.io/index.php?/cases/view/715476) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| REL-07 | [C715477](https://shopview.testrail.io/index.php?/cases/view/715477) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| REL-09 | [C715479](https://shopview.testrail.io/index.php?/cases/view/715479) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (Out of Scope) |
| REL-10 | [C715480](https://shopview.testrail.io/index.php?/cases/view/715480) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| REL-11 | [C715582](https://shopview.testrail.io/index.php?/cases/view/715582) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p7-the-native-vendor-menu.png no longer attached, its 5 Nov caption quoted |
| REL-12 | [C715583](https://shopview.testrail.io/index.php?/cases/view/715583) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| REL-12b | [C715619](https://shopview.testrail.io/index.php?/cases/view/715619) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| REL-12c | [C715620](https://shopview.testrail.io/index.php?/cases/view/715620) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| REL-13 | [C715584](https://shopview.testrail.io/index.php?/cases/view/715584) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-01 | [C715481](https://shopview.testrail.io/index.php?/cases/view/715481) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S8-R3) |
| D-01b | [C715621](https://shopview.testrail.io/index.php?/cases/view/715621) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S8-R3) |
| D-01c | [C715622](https://shopview.testrail.io/index.php?/cases/view/715622) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| D-02 | [C715482](https://shopview.testrail.io/index.php?/cases/view/715482) | CHANGE | ok | CH | ok | ok | CH | CH | ok | Precondition corrected in the full reading: a Summary lists customers, so the credit memo shows as a negative amount, not as a "credit memo row" (Rule 137).; design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| D-03 | [C715483](https://shopview.testrail.io/index.php?/cases/view/715483) | CHANGE | ok | CH | ok | ok | CH | CH | ok | Same precondition correction as D-02.; design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| D-04 | [C715484](https://shopview.testrail.io/index.php?/cases/view/715484) | CHANGE | ok | ok | ok | ok | CH | CH | ok | quotes re-taken from PRD v11 (S8-R3); design version of 5 Nov 2026 named; old picture ar-ap-p5-links-only-where-they-can-open.png no longer attached, its 5 Nov caption quoted |
| D-04b | [C715623](https://shopview.testrail.io/index.php?/cases/view/715623) | CHANGE | ok | ok | ok | ok | CH | CH | ok | quotes re-taken from PRD v11 (S8-R3); design version of 5 Nov 2026 named; old picture ar-ap-p5-links-only-where-they-can-open.png no longer attached, its 5 Nov caption quoted |
| D-04c | [C715624](https://shopview.testrail.io/index.php?/cases/view/715624) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p5-links-only-where-they-can-open.png no longer attached, its 5 Nov caption quoted; ruling line re-read against PRD v11 |
| D-05 | [C715485](https://shopview.testrail.io/index.php?/cases/view/715485) | CHANGE | ok | ok | ok | ok | CH | CH | ok | quotes re-taken from PRD v11 (S8-R3); design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| D-06 | [C715486](https://shopview.testrail.io/index.php?/cases/view/715486) | CHANGE | ok | ok | ok | ok | CH | CH | ok | quotes re-taken from PRD v11 (S8-R3); design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| D-07 | [C715487](https://shopview.testrail.io/index.php?/cases/view/715487) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S8-R3) |
| D-07b | [C715625](https://shopview.testrail.io/index.php?/cases/view/715625) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S8-R3) |
| D-07c | [C715626](https://shopview.testrail.io/index.php?/cases/view/715626) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| D-08 | [C715488](https://shopview.testrail.io/index.php?/cases/view/715488) | CHANGE | ok | ok | ok | ok | CH | CH | ok | quotes re-taken from PRD v11 (S8-R3); design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| D-09 | [C715489](https://shopview.testrail.io/index.php?/cases/view/715489) | CHANGE | ok | ok | ok | ok | CH | CH | ok | quotes re-taken from PRD v11 (S8-R3); design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| D-10 | [C715490](https://shopview.testrail.io/index.php?/cases/view/715490) | CHANGE | ok | CH | ok | ok | CH | ok | ok | Precondition corrected in the full reading: A/P Summary has no Transaction Type column (Rule 137). |
| D-10b | [C715627](https://shopview.testrail.io/index.php?/cases/view/715627) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S8-R3) |
| D-10c | [C715628](https://shopview.testrail.io/index.php?/cases/view/715628) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| D-11 | [C715491](https://shopview.testrail.io/index.php?/cases/view/715491) | CHANGE | ok | CH | ok | ok | CH | CH | ok | Same precondition correction as D-10 (and "a negative amount" in place of "a long Transaction Type").; design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| D-12 | [C715492](https://shopview.testrail.io/index.php?/cases/view/715492) | CHANGE | ok | CH | ok | ok | CH | CH | ok | Same precondition correction as D-11.; design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| D-13 | [C715493](https://shopview.testrail.io/index.php?/cases/view/715493) | CHANGE | ok | ok | ok | CH | CH | ok | ok | PRD v11 S8-R3: Location wraps on A/P Detail and A/P Unpaid Invoices (was: only on this report). Found by the readiness read, 10 Nov 2026. |
| D-13b | [C715629](https://shopview.testrail.io/index.php?/cases/view/715629) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S8-R3) |
| D-13c | [C715630](https://shopview.testrail.io/index.php?/cases/view/715630) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| D-14 | [C715494](https://shopview.testrail.io/index.php?/cases/view/715494) | CHANGE | ok | ok | ok | ok | CH | CH | ok | quotes re-taken from PRD v11 (S8-R3); design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| D-15 | [C715495](https://shopview.testrail.io/index.php?/cases/view/715495) | CHANGE | ok | ok | ok | ok | CH | CH | ok | quotes re-taken from PRD v11 (S8-R3); design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| D-16 | [C715496](https://shopview.testrail.io/index.php?/cases/view/715496) | CHANGE | ok | ok | ok | CH | CH | CH | ok | PRD v11 S8-R3: Location may wrap on A/P Unpaid Invoices; the tech plan's "only on A/P Detail" is quoted as the difference (TP-71) with a divergence note.; design block re-rendered |
| D-16b | [C715631](https://shopview.testrail.io/index.php?/cases/view/715631) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S8-R3) |
| D-16c | [C715632](https://shopview.testrail.io/index.php?/cases/view/715632) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| D-17 | [C715497](https://shopview.testrail.io/index.php?/cases/view/715497) | CHANGE | ok | ok | ok | ok | CH | CH | ok | Results re-checked against PRD v11 and kept; quotes and design references only.; design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| D-18 | [C715498](https://shopview.testrail.io/index.php?/cases/view/715498) | CHANGE | ok | ok | ok | ok | CH | CH | ok | Results re-checked against PRD v11 and kept; quotes and design references only.; design version of 5 Nov 2026 named; DD-07 (credit names) closed by PRD v10 |
| D-19 | [C715499](https://shopview.testrail.io/index.php?/cases/view/715499) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p4-cleared-no-locations.png no longer attached, its 5 Nov caption quoted; ruling line re-read against PRD v11 |
| D-19b | [C715633](https://shopview.testrail.io/index.php?/cases/view/715633) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-20 | [C715500](https://shopview.testrail.io/index.php?/cases/view/715500) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p4-cleared-no-locations.png no longer attached, its 5 Nov caption quoted; ruling line re-read against PRD v11 |
| D-20b | [C715634](https://shopview.testrail.io/index.php?/cases/view/715634) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-21 | [C715501](https://shopview.testrail.io/index.php?/cases/view/715501) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p4-cleared-no-locations.png no longer attached, its 5 Nov caption quoted; ruling line re-read against PRD v11 |
| D-21b | [C715635](https://shopview.testrail.io/index.php?/cases/view/715635) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-22 | [C715502](https://shopview.testrail.io/index.php?/cases/view/715502) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p4-cleared-no-locations.png no longer attached, its 5 Nov caption quoted; ruling line re-read against PRD v11 |
| D-22b | [C715636](https://shopview.testrail.io/index.php?/cases/view/715636) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-23 | [C715503](https://shopview.testrail.io/index.php?/cases/view/715503) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p4-cleared-no-locations.png no longer attached, its 5 Nov caption quoted; ruling line re-read against PRD v11 |
| D-23b | [C715637](https://shopview.testrail.io/index.php?/cases/view/715637) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-24 | [C715504](https://shopview.testrail.io/index.php?/cases/view/715504) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p4-cleared-no-locations.png no longer attached, its 5 Nov caption quoted; ruling line re-read against PRD v11 |
| D-24b | [C715638](https://shopview.testrail.io/index.php?/cases/view/715638) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-25 | [C715505](https://shopview.testrail.io/index.php?/cases/view/715505) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p5-links-only-where-they-can-open.png no longer attached, its 5 Nov caption quoted |
| D-26 | [C715506](https://shopview.testrail.io/index.php?/cases/view/715506) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named |
| D-27 | [C715507](https://shopview.testrail.io/index.php?/cases/view/715507) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-28 | [C715508](https://shopview.testrail.io/index.php?/cases/view/715508) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-29 | [C715509](https://shopview.testrail.io/index.php?/cases/view/715509) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-30 | [C715510](https://shopview.testrail.io/index.php?/cases/view/715510) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-31 | [C715511](https://shopview.testrail.io/index.php?/cases/view/715511) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-32 | [C715512](https://shopview.testrail.io/index.php?/cases/view/715512) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; old picture ar-ap-p7-the-native-vendor-menu.png no longer attached, its 5 Nov caption quoted; ruling line re-read against PRD v11 |
| D-33 | [C715513](https://shopview.testrail.io/index.php?/cases/view/715513) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-34 | [C715514](https://shopview.testrail.io/index.php?/cases/view/715514) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-35 | [C715515](https://shopview.testrail.io/index.php?/cases/view/715515) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-36 | [C715516](https://shopview.testrail.io/index.php?/cases/view/715516) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-37 | [C715517](https://shopview.testrail.io/index.php?/cases/view/715517) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-38 | [C715518](https://shopview.testrail.io/index.php?/cases/view/715518) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-39 | [C715519](https://shopview.testrail.io/index.php?/cases/view/715519) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named |
| D-40 | [C715520](https://shopview.testrail.io/index.php?/cases/view/715520) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named |
| D-41 | [C715521](https://shopview.testrail.io/index.php?/cases/view/715521) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-42 | [C715522](https://shopview.testrail.io/index.php?/cases/view/715522) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-43 | [C715523](https://shopview.testrail.io/index.php?/cases/view/715523) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-44 | [C715524](https://shopview.testrail.io/index.php?/cases/view/715524) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-45 | [C715525](https://shopview.testrail.io/index.php?/cases/view/715525) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-46 | [C715526](https://shopview.testrail.io/index.php?/cases/view/715526) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-47 | [C715527](https://shopview.testrail.io/index.php?/cases/view/715527) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S8-R3) |
| D-48 | [C715528](https://shopview.testrail.io/index.php?/cases/view/715528) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S8-R3) |
| D-49 | [C715529](https://shopview.testrail.io/index.php?/cases/view/715529) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-50 | [C715532](https://shopview.testrail.io/index.php?/cases/view/715532) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S8-R3) |
| D-51 | [C715533](https://shopview.testrail.io/index.php?/cases/view/715533) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-52 | [C715534](https://shopview.testrail.io/index.php?/cases/view/715534) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-53 | [C715535](https://shopview.testrail.io/index.php?/cases/view/715535) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-54 | [C715536](https://shopview.testrail.io/index.php?/cases/view/715536) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-55 | [C715537](https://shopview.testrail.io/index.php?/cases/view/715537) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-56 | [C715538](https://shopview.testrail.io/index.php?/cases/view/715538) | CHANGE | ok | ok | ok | ok | CH | ok | ok | quotes re-taken from PRD v11 (S8-R3) |
| D-57 | [C715539](https://shopview.testrail.io/index.php?/cases/view/715539) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named |
| D-58 | [C715540](https://shopview.testrail.io/index.php?/cases/view/715540) | CHANGE | ok | ok | ok | ok | CH | CH | ok | Results re-checked against PRD v11 and kept; quotes and design references only.; design version of 5 Nov 2026 named; DD-07 (credit names) closed by PRD v10 |
| D-59 | [C715541](https://shopview.testrail.io/index.php?/cases/view/715541) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| D-60 | [C715542](https://shopview.testrail.io/index.php?/cases/view/715542) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-61 | [C715543](https://shopview.testrail.io/index.php?/cases/view/715543) | CHANGE | ok | ok | ok | ok | CH | CH | ok | quotes re-taken from PRD v11 (S8-R3); design version of 5 Nov 2026 named; ruling line re-read against PRD v11 |
| D-62 | [C715544](https://shopview.testrail.io/index.php?/cases/view/715544) | CHANGE | ok | ok | ok | ok | CH | ok | ok | Results re-checked against PRD v11 and kept; quotes and design references only. |
| D-63 | [C715545](https://shopview.testrail.io/index.php?/cases/view/715545) | CHANGE | CH | CH | CH | CH | CH | CH | ok | Re-shot picture "Links only where they can open" removed: title, preconditions and steps no longer ask for it; the column list is given in words; S7-R7 quoted (semi-bold, not underlined).; design version of 5 Nov 2026 named; old picture ar-ap-p5-links-only-where-they-can-open.png no longer attached, its 5 Nov caption quoted; DD-07 (credit names) closed by PRD v10 |
| D-64 | [C715546](https://shopview.testrail.io/index.php?/cases/view/715546) | CHANGE | ok | ok | ok | ok | ok | CH | ok | design version of 5 Nov 2026 named |
| D-65 | [C715547](https://shopview.testrail.io/index.php?/cases/view/715547) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-66 | [C715548](https://shopview.testrail.io/index.php?/cases/view/715548) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-67 | [C715549](https://shopview.testrail.io/index.php?/cases/view/715549) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-68 | [C715550](https://shopview.testrail.io/index.php?/cases/view/715550) | CHANGE | CH | CH | ok | CH | ok | CH | ok | Re-shot picture "Cleared: No locations" removed: title, preconditions and step 2 results reworded to the PRD (no Totals row, no Location column).; design version of 5 Nov 2026 named; old picture ar-ap-p4-cleared-no-locations.png no longer attached, its 5 Nov caption quoted; ruling line re-read against PRD v11 |
| D-69 | [C715551](https://shopview.testrail.io/index.php?/cases/view/715551) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-70 | [C715552](https://shopview.testrail.io/index.php?/cases/view/715552) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-71 | [C715553](https://shopview.testrail.io/index.php?/cases/view/715553) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-72 | [C715554](https://shopview.testrail.io/index.php?/cases/view/715554) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-73 | [C715555](https://shopview.testrail.io/index.php?/cases/view/715555) | CHANGE | CH | CH | ok | CH | ok | CH | ok | Re-shot picture "The native Vendor menu" removed: title, preconditions and step 1 results reworded ("Search vendors", S5-R13).; design version of 5 Nov 2026 named; old picture ar-ap-p7-the-native-vendor-menu.png no longer attached, its 5 Nov caption quoted; ruling line re-read against PRD v11 |
| D-74 | [C715556](https://shopview.testrail.io/index.php?/cases/view/715556) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-75 | [C715557](https://shopview.testrail.io/index.php?/cases/view/715557) | CONFIRMED | ok | ok | ok | ok | ok | ok | ok | stamps only |
| D-81 | [C715563](https://shopview.testrail.io/index.php?/cases/view/715563) | CHANGE | ok | CH | ok | CH | ok | CH | ok | One of its two pictures ("Links only where they can open") removed; "as in the picture" dropped from step 1; "Expand all from the header" stays.; design version of 5 Nov 2026 named; old picture ar-ap-p5-links-only-where-they-can-open.png no longer attached, its 5 Nov caption quoted |
| S1-17 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| S1-18 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| S1-19 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| S1-20 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| S1-21 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| S1-22 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| S2-43 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| S2-44 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| S2-45 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| S2-46 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| S2-47 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| S2-48 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| S2-49 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| S2-50 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| S3-31 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| S3-32 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| S4-22 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| S4-23 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| S5-40 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| S5-41 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| S5-42 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| DATA-25 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| DATA-26 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| DATA-27 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| REL-14 | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |
| REL-08 | [C715478](https://shopview.testrail.io/index.php?/cases/view/715478) | RETIRE | | | | | | | | PRD v10/v11 S1-R5a reverses it; proposed for deletion |
