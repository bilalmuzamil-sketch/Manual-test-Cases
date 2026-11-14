# Tiered Pricing — ready to write to TestRail (report for the QA lead, 14 Nov 2026)

**Nothing has been written to TestRail, Jira, Slack or Google.** Everything below is drafts, checks and dry runs. The write needs your go-ahead (Rule 6).

## In one line

818 test cases are ready in 23 folders under "Tiered Pricing (11/14/2026)" (section 138770): 763 go into one test run for Mudassir, 55 stay held
(41 wait on Matt Barge's answers, 11 need staging data from before the release, 2 need AccountingHub, 1 is an engineering timing target). The
31 questions for Matt are drafted as one sheet; it is not created yet. All checks pass (build.py 0 problems, readiness check 0 hard problems,
ticket sweep 0 unhandled).

## Cases per folder

| Folder | Cases | In the run | Held |
|---|---|---|---|
| Story 1: Release day | 22 | 15 | 7 (staging data from before the release) |
| Story 2: Tiers | 78 | 78 | 0 |
| Story 3: Matrices and rules | 43 | 42 | 1 (staging data from before the release) |
| Story 4: The tier grid: every tier of a matrix, edited in place | 41 | 41 | 0 |
| Story 5: Price Part Simulator | 14 | 14 | 0 |
| Story 6: Every matrix in one list | 19 | 19 | 0 |
| Story 7: Categories: every category's pricing at a glance | 20 | 20 | 0 |
| Story 8: Categories over time | 12 | 12 | 0 |
| Story 9: Putting customers on tiers | 38 | 38 | 0 |
| Story 10: How a part is priced | 38 | 36 | 2 (1 staging data, 1 engineering timing target) |
| Story 11: When a part is priced again | 43 | 43 | 0 |
| Story 12: Seeing what priced a part | 22 | 22 | 0 |
| Story 13: Part Sales | 6 | 6 | 0 |
| Story 14: Changing the customer on a work order | 9 | 9 | 0 |
| Story 15: The below-cost warning in the matrix | 8 | 8 | 0 |
| Story 16: Who can do what | 20 | 20 | 0 |
| Story 17: Reports and totals stay consistent | 6 | 6 | 0 |
| Story 18: Accounting and QuickBooks receive the right figures | 7 | 6 | 1 (AccountingHub) |
| Story 19: Shared behavior for every new page, dialog and list | 23 | 23 | 0 |
| Sales by Tier and Sales by Category | 75 | 75 | 0 |
| Design — how it looks | 189 | 152 | 37 (the design differs from the PRD: waiting on Matt) |
| Must not change: today's pricing | 81 | 78 | 3 (2 staging data, 1 AccountingHub) |
| Waiting on Matt Barge's answers | 4 | 0 | 4 (waiting on Matt) |
| **Total** | **818** | **763** | **55** |

The folder "Run on Production After Release" is not made: no case needs it (the two AccountingHub cases fall back to the production test account,
look only, only if staging has no AccountingHub connection).

Every held case says why in its last line ("AUTOMATION: HOLD - …"); a case waiting on Matt names its question number ("waiting on the PO (question 24)").

## Pictures

1,575 picture attachments on 780 cases (282 different picture files): the design boards, their 14 full-height versions (boards taller than the
canvas frame, so nothing at the bottom is cut), and 12 "Today" production screenshots on the "must not change" cases. The other 38 cases say why
they have none (for example Story 16's permission states, which the design does not draw). Of the design's 272 boards, 257 are attached to a case,
14 are explained (Today boards attached as screenshots, prototype entry lists), and board 0.0 is the overview page.

## Coverage per source

| Source | Rows | Covered | Partly | Not testable by hand | Notes |
|---|---|---|---|---|---|
| Tiered Pricing PRD (page v37, v0.17), stories 1-19 incl. the 12 Permissions-table rows | 312 | 265 | 18 | 29 | "Not testable": forced save/load failures, loading skeletons, "not applicable" error-handling rows, the client e-mail, all-time audit retention, a 1,284-customer bulk save; listed for the developers |
| Sales by Tier and Sales by Category PRD (page v21) | 70 | 60 | 4 | 6 | Partly: the CSV 50,000-row limit, the tie-out sign-off list, the download line order (held on question 30); not testable: forced failures, a deleted customer with invoices |
| Developers' two plans (tester-visible additions, 39 rows) | 39 | 32 | 1 | 5 | 1 held on question 24 (reopened paid work order); not testable: forced failures, imported invoices engineering has not reported on, a sign-off process |
| Jira (54 tickets under the epic) | 54 | 20 new cases + 30 covered | – | 4 no case | No case: SV-11698 (obsolete), SV-9314 (out of scope), SV-12682 (engineering step), SV-12745 (speed baseline). API halves of 4 verify tickets are for the automation owner. Re-swept today: nothing changed |
| Design (272 boards, 17 pages) | 272 | 257 attached | – | – | 133 design differences in the register, every one closed or held on a question; 18 long-name cases and 20 before-and-after cases |
| Invariants ("must not change", 93 behaviours of today) | 79 kept or silent | 78 cases + 3 from linked tickets | – | 2 | INV-39 (a Maintenance Reminder line at another location) and INV-84 (the Open API) cannot be checked by hand; INV-76 (wording of old screens' empty and error states) is **not written**: no source names a screen that shows it, and its error half needs a forced failure; 13 changed behaviours are tested in the story folders |

241 cases check numbers with the arithmetic shown (Rule 116).

## What changed in this consolidation

- **Relevant sign-in lines (Rule 137):** 370 of 791 Admin sign-in lines asked for permissions the case never uses (for example the report case
  that only opens two Category filters asked for customer, work order and Part Sale permissions). Each now lists exactly what its steps and set-up
  use, worked out from the PRD's Permissions table, and a check refuses any line that differs. One permission test (a tier's Remove Customers link)
  asked for a permission it then said the user must not have: fixed.
- **One action per step (Rule 135):** 91 steps that opened a form, filled it and saved it in one go (adding a part on a work order, Set Rule, a
  customer's tier in Edit Customer, Change Customer) are now one action per step with the design's own labels. 25 such steps stay whole because no
  source draws the screen (a Part Sale's add-part row, Tech View, returns, credits, invoicing): splitting them would mean inventing button names.
  They are listed in `authoring/kept-whole-steps.json`.
- **Sample read (Rule 138):** 20 random cases across all folders (seed 1116) and all 138 "does not / never" results read in full. Fixed: bundled
  steps, three "Type 35." steps that did not say where, and four cases that expected the QuickBooks field without saying the client must be connected
  to QuickBooks.
- **Library:** full-height pictures, Permissions-table numbers in the References field, an invariant source helper (INV-78 written on the
  developers' plan's own words), window-size lines that say why.

## The questions for Matt Barge (one merged sheet, not created yet)

33 drafts from three workers → **31 questions** after the pre-send checks on the merged list (two duplicates merged into one question about
moving columns; none dropped). Numbered by story. Topics:

1 page trail at the top of tier and matrix pages · 2 "This can't be undone." in Delete tier · 3 "in all 7 matrices" in Set Rule · 4 "Uses previous
tier" or "Same as previous tier" · 5 Default's page columns · 6 when a picked category moves to a matrix · 7 Duplicate: copy at once or after
Create · 8 where Add Range puts the range · 9 "$10,000.01 and up" or "+" · 10 which ranges have a delete button · 11 grid error messages and the
"Save is blocked" banner · 12 where a taken matrix name is shown · 13 % Off starts empty or 0 · 14 the change count · 15 the save message ·
16 Matrices list Part Sale column · 17 "no match" messages · 18 other categories: line or tooltip · 19 New Category: Save or Create Category ·
20 two category messages · 21 Uncategorized's page · 22 Customers tab filter options · 23 Counter Sale: tooltip or box · 24 a reopened paid work
order's tier (money) · 25 the message after receiving · 26 price details content · 27 Change Customer notice counting · 28 report tier labels ·
29 Category filter order · 30 download header line order · 31 columns that move between the design's pictures.

Files: `questions-2026-11-14/QUESTIONS-FOR-MATT-BARGE.md` (the sheet plus the QA-only record of each check and the held cases),
`questions-2026-11-14/sheet_rows.py` and `sheet-values.json` (the colour-coded rows: #, Topic, Question for you with lettered options and the
suggested one first, What we know today, Your answer, Where we found it), `questions-2026-11-14/QUESTION-MAP.json` (old → new numbers).

## Decisions needed from you

| # | Decision | Why | My recommendation |
|---|---|---|---|
| 1 | Go-ahead to write to TestRail (folders, 818 cases, pictures, the run, the folder note) | Rule 6 | **Yes, in the order below** (Recommended): every dry run passed against the live folder, which is empty |
| 2 | The 11 cases that need data made on staging **before** the release reaches it (S1-02, S1-03, S1-04, S1-05, S1-20, S1-21, S1-22, S3-45, S10-37, INV-85, INV-87) | They compare prices and totals from before and after the release; if staging already has the release, the "before" state is gone | **Write them now as held, outside the run** (Recommended), and ask engineering when the release reaches staging; set the data up before that, then release them. If staging already has it, run them on the QA site with a copy of pre-release data, or drop them |
| 3 | The 2 AccountingHub cases (S18-06, INV-83) | They need an AccountingHub connection | **Keep them held** (Recommended) until engineering says whether staging has AccountingHub; if not, run them on the production test account after the release, look only |
| 4 | Create and share the question sheet for Matt (31 questions) | Rule 66: the sheet goes last, and you see it first | **Create it after the TestRail write** (Recommended), shared as you asked: Matt editor and notified, QA people editors (please send their addresses), everyone at shopview.com read only |
| 5 | The 25 steps kept whole (flows no source draws) | Rule 135 wants one action per step, but splitting needs button names no source gives | **Keep them whole** (Recommended); the build check can split them once the screens are seen on the build |
| 6 | Section 138770 already has a description written outside our files ("The test cases are aligned with the PRD as of November 14, 2026 …") | Rule 140 | **Put the standard note on top and keep that text below it** (Recommended, as the script does) |

## Dry-run results (read-only, 14 Nov 2026)

| Script | Result |
|---|---|
| `write/1_create_sections.py` | Section 138770 "Tiered Pricing (11/14/2026)", suite 1: 0 subfolders, 0 cases, nothing that is not ours. Plan: 23 subfolders |
| `write/2_create_cases.py` | Plan: 818 cases (55 held, 763 for the run); every body has custom_atmstatus 1, a title of at most 80 characters and References under 250; field-by-field read-back on apply |
| `write/3_attach_pictures.py` | Plan: 1,575 attachments, 282 files, none missing; read back by name on apply |
| `write/4_make_run.py` | No run yet; user 6 is Mudassir Qamar; plan: "Tiered Pricing - Execution" with the 763 released cases; union only on any rerun |
| `write/5_folder_note.py` | Will put "Test cases are current as of 11/14/2026. Before you start testing, …" on top of the existing description; the live text is saved as the lock |

Every script runs the tester-readiness check first (0 hard problems) and logs operation, C-id, HTTP status and read-back (Rule 50). Outputs:
`write/dryrun-*.out`.

## Apply order (coordinator, after your go-ahead)

1. Re-read both PRDs' page versions (Rule 59; v37 and v21 expected) and re-run `authoring/build.py` (0 problems).
2. `python3 write/1_create_sections.py --apply` (writes the folder ids into `authoring/sections.json`), then `python3 authoring/build.py` so the cases carry them.
3. `python3 write/2_create_cases.py --apply` (writes `testrail-id-map.csv`).
4. `python3 write/3_attach_pictures.py --apply`.
5. `python3 write/4_make_run.py --apply`, then confirm by reading the run back that all 763 are in it (Rule 34).
6. `python3 write/5_folder_note.py` (dry run, saves the lock), then `python3 write/5_folder_note.py --apply`.
7. Create the question sheet from `questions-2026-11-14/sheet_rows.py`, share it, add it to `build/PO-QUESTIONS-OPEN.md` (Rule 132).

## OUTSTANDING — what I need from you

| What | Recommendation |
|---|---|
| Go-ahead for the TestRail write | Yes, in the order above (Recommended) |
| Staging data from before the release (11 cases) | Keep held now; ask engineering when the release reaches staging (Recommended) |
| AccountingHub on staging (2 cases) | Keep held; production test account, look only, as the fallback (Recommended) |
| QA people's addresses for the question sheet | Send them so the sheet can be shared as you asked |
| The Tiered Pricing QA site address | Ask engineering for it (sv11692.qa.shopview.com does not resolve); cases say "staging, and the QA site once it exists" |

**Waiting on the PO:** no question sheet exists yet for Tiered Pricing, so nothing is waiting on Matt Barge yet. Once the sheet is created, all 31
questions wait on him, holding 41 cases (37 in "Design — how it looks", 4 in "Waiting on Matt Barge's answers").
