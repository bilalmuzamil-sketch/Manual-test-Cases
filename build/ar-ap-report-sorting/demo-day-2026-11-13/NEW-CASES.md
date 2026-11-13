# A/R and A/P Report Sorting — Demo Day cases (draft, 13 Nov 2026)

**Status: DRAFT for the QA lead to see first.** Nothing written to TestRail, Jira, Slack or Google; nothing committed. 14 new cases, keys
D-82 to D-95, all in the folder **Design — how it looks** (section 90430). The library has them (`authoring/cases_demo_2026_11_13.py`);
`authoring/proposals.json` now holds 394 cases, and the 380 existing cases render **byte for byte as before** (checked by diff).

**Why.** Chris Ward's Slack post after Demo Day (13 Nov 2026, thread C0C454MLP0T, read only) and the three bugs filed from it:
SV-12722 (Customer menu: a long no-space name is drawn over the next row), SV-12763 (the four grouped reports: columns move when groups open
or close, and while more lines load), SV-12764 (A/R Collection: a long no-space name pushes Past Due and Amount off screen while collapsed).
None of our cases caught them: our long names always had spaces, and no case compared two states of the same screen (lessons register L-21;
skill 21 §6d lines 9 and 10). I read all three tickets in Jira and the Slack thread myself (read only).

## 1. The cases

| Key | Title | Folder | Marker | Ticket | Source quoted |
|---|---|---|---|---|---|
| D-82 | Design: A/R Customer menu keeps a long no-space name inside its row | Design | READY - EXPECT FAIL (SV-12722) | SV-12722 | PRD v13 S5-R13; Slack, Picture #1 |
| D-83 | Design: A/P Vendor menu keeps a long no-space name inside its row | Design | Not available on Build - 11/13/2026 | (SV-12722 related) | PRD v13 S5-R13; Slack, Picture #1 |
| D-84 | Design: A/R Summary with a long no-space customer name shows every column | Design | Not available on Build - 11/13/2026 | (SV-12764 related) | PRD v13 S8-R3 |
| D-85 | Design: A/P Summary with a long no-space vendor name shows every column | Design | Not available on Build - 11/13/2026 | (SV-12764 related) | PRD v13 S8-R3 |
| D-86 | Design: A/R Detail with a long no-space customer name shows every column | Design | Not available on Build - 11/13/2026 | (SV-12764 related) | PRD v13 S8-R3 |
| D-87 | Design: A/P Detail with a long no-space vendor name shows every column | Design | Not available on Build - 11/13/2026 | (SV-12764 related) | PRD v13 S8-R3 |
| D-88 | Design: A/R Collection with a long no-space customer name shows every column | Design | READY - EXPECT FAIL (SV-12764) | SV-12764 | PRD v13 S8-R3 |
| D-89 | Design: A/P Unpaid Invoices with a 78-character vendor name shows every column | Design | Not available on Build - 11/13/2026 | (SV-12764 related) | PRD v13 S8-R3 (with its new A/P Unpaid Invoices exception) |
| D-90 | Design: A/R Detail columns stay in place when buckets open and close | Design | READY - EXPECT FAIL (SV-12763) | SV-12763 | PRD v13 S4-R5, S4-R1; Slack, Picture #2 + #3 |
| D-91 | Design: A/R Collection columns stay in place when groups open and close | Design | READY - EXPECT FAIL (SV-12763) | SV-12763 | PRD v13 S4-R5, S4-R1; Slack, Picture #2 + #3 |
| D-92 | Design: A/P Detail columns stay in place when buckets open and close | Design | READY - EXPECT FAIL (SV-12763) | SV-12763 | PRD v13 S4-R5, S4-R1; Slack, Picture #2 + #3 |
| D-93 | Design: A/P Unpaid Invoices columns stay in place when groups open and close | Design | READY - EXPECT FAIL (SV-12763) | SV-12763 | PRD v13 S4-R5, S4-R1; Slack, Picture #2 + #3 |
| D-94 | Design: A/R Detail columns stay in place while more lines load | Design | **HOLD - waiting on the PO** | SV-12763 | PRD v13 S4-R4 (loading); Slack (context only): **no source settles the column part** |
| D-95 | Design: A/R Collection PDF wraps a long no-space name in its Total row | Design | Not available on Build - 11/13/2026 | none (L-21 print line) | PRD v13 S3-R1, S3-R7b ("A long name wraps inside that row.") |

"Not available on Build - 11/13/2026" is the suite's standard marker, written `AUTOMATION: Not available on Build to test Yet - Last checked 11/13/2026`. The three
EXPECT FAIL tickets are open (SV-12722 "Ready to Fix", SV-12763 and SV-12764 "Open", read 13 Nov 2026) and their symptoms were observed on
staging v26.45.4, so each backs its marker (Rule 61). Each expect-fail case carries the symptom and all three outcomes above its quotes.
Refs (all under 250 characters): ticket(s), owning story, PRD v13 anchor.

**Splitting (Rule 136).** One menu case per menu kind (Customer and Vendor differ: different native parents, search-box rule). One 1440 px case
per report, because each is its own screen with its own data. One stability case per grouped report: its steps compare each state with a single
screenshot taken before the first click, so they must stay together (never split a before-and-after). The loading case and the PDF case need
their own data. The special-character name sits in the menu cases (same check, same screen); it adds one step, not a case.

**What rests on which source.**
- *A long name must stay in its own menu row; the next row stays readable and tickable:* Chris Ward's Slack post ("the long customer name wrap
  issue (shows up in the filter)") plus S5-R13 for the menu's rows, the chip's "..." and "several can be ticked". How the name should look
  (wrapped or "...") is not settled by any source, so the cases accept either (skill 07 §6.0 g: test the behaviour, leave the look out).
- *Every column visible at 1440 px, the name wrapping:* PRD v13 S8-R3, word for word. D-89 uses S8-R3's new v13 exception: on A/P Unpaid
  Invoices a vendor's group row does not wrap and "78 characters still fit", so D-89 tests 78 characters, not 120.
- *Columns keep their place when groups open and close:* only Chris Ward's Slack post ("would be great if they wouldn’t (though unsure how
  possible)"). The PRD has no sentence on it. S4-R1 and S4-R5 back only the opening and closing in those steps. See unsettled point 1.
- *Columns keep their place while lines load:* no source at all, so D-94 is held (see unsettled point 2).
- *Design library:* `components.css` (design-2026-10-22, the design system of the saved design) has **no** always/never sentence on menu-row
  overflow, ellipsis or table column widths. The menu spec gives fixed 40 px rows (`.sv-menu__row { height: 40px }`), and the filter-dropdown
  row comment says "one row of a filter dropdown: a real button, so the keyboard can reach every option". Neither is quoted, because neither
  settles what a long name must do. The board caption "Group labels span to the total; text columns wrap. S8-R3." is quoted under References
  from Design in D-84 to D-87 and D-89.
- The Slack quote is copied character for character from the thread, including its curly apostrophe "wouldn’t". The brief had a straight one.
  The post is saved without email addresses in `sources/SLACK-C0C454MLP0T-demo-day-2026-11-13.md`; the build checks each quote against it.

## 2. Which existing case each new case complements, and why that one passed

Run 557 was fully executed on 11-12 Nov 2026 (QA site v26.45.2-6a8b89c, then staging v26.45.4). All the cases below **Passed** there (read
from run 557, 13 Nov 2026). Their marker line says nothing about whether they ran.

| New | Complements | Why the existing case passed although the bug is real |
|---|---|---|
| D-82 | D-31 [C715511](https://shopview.testrail.io/index.php?/cases/view/715511) (Customer chip and menu) | Friendly data: its long name has spaces ("more than 40 characters", for example "Northern Alberta Heavy Equipment and Trailer Repair"), so it wraps neatly; it checks the chip's "..." and the menu's rows and order, never a long name as a row of the open menu or the next row's tick box. |
| D-83 | D-32 [C715512](https://shopview.testrail.io/index.php?/cases/view/715512) (Vendor chip and menu) | Friendly data: an ordinary vendor name, no long name in the list. |
| D-84 | D-01 [C715481](https://shopview.testrail.io/index.php?/cases/view/715481) (A/R Summary at 1440 px) | Friendly data: long name with spaces. |
| D-85 | D-10 [C715490](https://shopview.testrail.io/index.php?/cases/view/715490) (A/P Summary at 1440 px) | Friendly data: long name with spaces. |
| D-86 | D-04 [C715484](https://shopview.testrail.io/index.php?/cases/view/715484) (A/R Detail at 1440 px) | Friendly data, and every group expanded (Expand all). |
| D-87 | D-13 [C715493](https://shopview.testrail.io/index.php?/cases/view/715493) (A/P Detail at 1440 px) | Friendly data, and every group expanded. |
| D-88 | D-07 [C715487](https://shopview.testrail.io/index.php?/cases/view/715487) (A/R Collection at 1440 px) | Both: a long name with spaces, and the report checked with every group expanded. SV-12764 shows only while the groups are collapsed, and only with a no-space name. |
| D-89 | D-16 [C715496](https://shopview.testrail.io/index.php?/cases/view/715496) (A/P Unpaid Invoices at 1440 px) | Friendly data (spaced name, more than 40 characters) and every group expanded. |
| D-90 to D-93 | S4-01 [C715354](https://shopview.testrail.io/index.php?/cases/view/715354), S4-02 [C715355](https://shopview.testrail.io/index.php?/cases/view/715355) and the A/P chevron cases; D-25 to D-28 [C715505](https://shopview.testrail.io/index.php?/cases/view/715505)–[C715508](https://shopview.testrail.io/index.php?/cases/view/715508) (chevron, tooltips, pinned row) | They check what the chevron does (groups open and close, tooltips, pinned row), never where the columns are before and after. |
| D-94 | S1-21 [C1062570](https://shopview.testrail.io/index.php?/cases/view/1062570) (100 at a time); the S4 loading cases | They check that lines load and are not repeated, not that the columns stay put. |
| D-95 | D-44, D-45 [C715524](https://shopview.testrail.io/index.php?/cases/view/715524), [C715525](https://shopview.testrail.io/index.php?/cases/view/715525) (PDF headings) | No PDF case uses a long name; S3-R7b's "Total for" row arrived in PRD v12 (12 Nov) and no case quotes it yet. |

**The 89 tests in run 557 from cases someone else added** (section 134654, C1078974 to C1079044 and C1095429 to C1095449, all titles read
and their text searched): **none** covers a long name without spaces, special characters, or columns staying put. C1095440 ("an A/R Detail
bucket shows 100 lines, then more") mentions Expand all only for loading. So nothing is duplicated. Left untouched.

## 3. Unsettled points for the QA lead (skill 07 §6.0 checks a–h run on each)

**1. Must the columns stay put when groups open and close, for the 19 Nov release? (affects D-90 to D-93)**
The only source is Chris's post: "would be great if they wouldn’t (though unsure how possible)". That is a wish, not a requirement, and he
hedges it. Production already moves the columns on A/R Detail (SV-12763), and the design's own A/P Detail pictures place "Vendor Name" at
about 762 px collapsed and 800 px expanded (L-21). The PRD (v13) says nothing.
Checks: a (no precedence statement settles it), b (no source sentence backs an answer), c (the design and the Slack post point different ways,
so a question is allowed), d (no design-library rule), e (testable by hand with a screenshot), f (owner: Chris Ward, design authority),
g (it is behaviour, not wording). **Kept.**
*Suggested question for Chris Ward:* "On A/R Detail, A/R Collection, A/P Detail and A/P Unpaid Invoices, the columns move when a group is opened
or closed and on Expand all / Collapse all (SV-12763; production does it too on A/R Detail). Is keeping them in place part of the 19 Nov release,
or a later improvement? Our four cases expect them to stay in place."
*My recommendation:* add the four cases to run 557 with EXPECT FAIL (SV-12763) as drafted. The tester records the known failure and raises
nothing new, so the release is not blocked by a misread. Ask the question on Chris's sheet (new row, new colour, Rule 131). If he says
"later", move the four cases to "Waiting on Chris Ward's answers" (133627).

**2. Columns moving while more lines load (D-94, held)**
SV-12763 notes it ("The columns also move a little more as further rows load while scrolling"), but no source sentence covers it. Chris's post
speaks only of expand and collapse. Checks a–d: nothing settles it; e: testable by hand; f: Chris; g: behaviour. **Kept.**
*Suggested question:* "When more lines load as you scroll an open bucket, may the columns move, or should they stay where they were?"
*My recommendation:* ask it in the same row block as question 1. Keep D-94 out of run 557 until he answers (the script holds it out).

**Considered and not asked (failed a check):**
- *Exactly how a long name should look in a menu row or cell (wrap, how many lines, or "...")*: check g. The behaviour (inside its own row or
  cell, nothing covered, every column visible) is settled, so the cases accept either look.
- *S5-R13 says the Customer menu is "exactly as Sales By Customer's", and Sales By Customer has the same overlap (SV-12722)*: check a/b.
  Chris's newer post calls it an issue, and the fix belongs in the shared menu. That is a developer matter, not a PO question.
- *Whether names with < > & " ' should show exactly as typed*: no source says so. The cases check only that such a name stays in its row and
  claim nothing about how the characters render. If you want it checked, I'd raise it with the developers rather than the PO (Rule 139: my
  recommendation is a developer question, because it is a general app rule and not this feature's).
- *78 characters "still fit" on A/P Unpaid Invoices*: settled by S8-R3 (v13); tested as written in D-89.

**3. The PRD moved to version 13 (decision needed, Rule 122: ask first)**
The live page changed on 12 Nov (v12, Milos Vasic) and 13 Nov (v13, Chris Ward). Our 380 cases quote v11 (5 Nov). The foreign cases already cite v12.
Changes: S1-R8 (one-request sentence added), **S3-R7b new** ("Total for <name>" rows in grouped PDFs, never "Subtotal"), S4-R1 (the chevron is
blue), **S5-R10b new** (any as-of date, including a future one), S5-E3 (one location left hides the chip), S8-R3 (the A/P Unpaid Invoices
long-vendor exception). Existing cases quoting a changed requirement: S1-R8 23 cases, S4-R1 13, S5-E3 4, S8-R3 35 (list in section 6). Two
new requirements have no case of ours (S5-R10b; S3-R7b only by D-95, A/R Collection).
*My recommendation:* a V1 currency check of just that named set (about 70 cases, plus new cases for S5-R10b and the other three grouped
PDFs), before the 19 Nov release. The new cases here already quote v13, so they are unaffected.

## 4. Gate results (13 Nov 2026)

- `authoring/build.py`: **0 PROBLEM lines**, 394 cases (DESIGN 108). Every new quote was checked word for word against the saved PRD v13
  (`sources/CONFLUENCE-947650561-v13-read-2026-11-13.md`) or the saved Slack post.
- `build/testing-tools/tester_readiness_check.py build/ar-ap-report-sorting`: **exit 0, 0 hard problems**. Its "does not / never" list names
  D-84 to D-87, D-89 and D-94; each of those results sits in the same bullet as a positive thing the tester can see (the name wraps in its
  cell; the bill shows). I read the 3 random sample cases in full (DATA-22, REL-09, S6-01; all existing, not touched).
- Existing cases: `proposals.json` before and after compared key by key: **0 of 380 changed**.
- **I read every one of the 14 new cases in full, as TestRail will show them.** Fixed in that reading: D-83 had told the tester about an "older
  attachment" a new case never has (the library now leaves that paragraph off new cases); D-89 lacked the check on the "Vendor Name" cell;
  D-95's refs named SV-12722 (a menu bug) and its design note did not say the Export menu is pictured.
- Create script `demo-day-2026-11-13/create_demo_day.py`, dry run only: 14 to add, 13 into run 557, D-94 held out, every picture file found.

**Reading coverage (Rule 119):** PRD v11 sections 1–6 and Stories 4, 5 and 8 read in full. The other stories were grepped (wrap, width,
shortened, overlap). The whole v11-to-live diff was read (21 lines). The three tickets and the Slack thread were read in full. Design: every
always/never and overflow line of `components.css` was grepped, and its TABLE, MENU and list-layout sections were read in full (lines 280–330,
357–393, 529–575). Every text line on the Layout, Grouped and Filters boards matching wrap, width, expand, collapse or long name was read.
Not read in full: the other parts of `components.css`, `tokens.css` and `colors_and_type.css` (tokens; grepped for always/never/ellipsis/overflow).

## 5. What changed in the library (draft, uncommitted)

- `authoring/cases_demo_2026_11_13.py` (new): the 14 cases.
- `authoring/ar_lib.py`: adds two quote sources (PRD v13 and the Slack post, each with its own "From:" line and verbatim check), an optional
  per-case refs value, and a flag that leaves the "older attachment" paragraph off new cases. Nothing an existing case uses changed.
- `authoring/build.py`: loads the new module; the From-line gate accepts "version 11" or "version 13".
- `sources/CONFLUENCE-947650561-v13-read-2026-11-13.md`, `sources/SLACK-C0C454MLP0T-demo-day-2026-11-13.md` (new).
- `authoring/proposals.json` and `cases/design/DESIGN-CASES.json` were rebuilt by build.py (+14 cases).
- Not run: `render_setup.py` (it would rewrite AR-AP-SETUP-FILE.md; the cases carry their setup examples for it when you want it).
- Not touched: the DESIGN-DIVERGENCE-REGISTER.json row for point 1 (the design pictures move the columns). It needs a sent question
  to close (Rule 130). Proposed row: DD-08, codes S4-R1/S4-R5, figures I05 and I23, "the design's A/P Detail pictures place Vendor Name at
  about 762 px collapsed and 800 px expanded; Chris Ward's Slack post of 13 Nov 2026 wishes the columns would not move".

## 6. Other things noticed (not acted on)

- Run 557: 467 tests, 463 passed, 4 failed. Of ours, REL-01 C715471 and REL-02 C715472 failed. Not in the run: S1-05 C715277,
  S1-07 C715279, and REL-08 C715478 (deleted 10 Nov, but still a row in `testrail-id-map.csv`).
- The 89 added cases were created under the same TestRail user as ours (created_by 3) but are not in our map. Treated as someone else's (left alone).
- `ar_lib.NOBUILD` ("this case has not been run on it yet") is now untrue for the 378 cases of ours that ran in run 557. It is true for the 14 new ones.
- `build/LESSONS-REGISTER.md` holds row L-21 twice (lines 29 and 31, the same text).
- Existing cases quoting a requirement that changed in v12/v13:
  - S1-R8 (23): S2-29 C715316, S2-31 C715318, S2-32 C715319, S2-34 C715321, S4-05 C715358, S4-06 C715359, S4-07 C715360, S4-08 C715361, S4-13 C715366, S4-14 C715367, DATA-01 C715450, DATA-01b C715612, DATA-02 C715451, DATA-02b C715613, DATA-03 C715452, DATA-03b C715614, DATA-04 C715453, DATA-04b C715615, DATA-05 C715454, DATA-06 C715455, S1-21 C1062570, S1-22 C1062571, DATA-27 C1062589
  - S4-R1 (13): S4-01 C715354, S4-02 C715355, S4-03 C715356, S4-04 C715357, S4-05 C715358, S4-06 C715359, D-25 C715505, D-26 C715506, D-27 C715507, D-28 C715508, D-52 C715534, D-56 C715538, D-59 C715541
  - S5-E3 (4): S5-18 C715392, S5-40 C1062584, S5-41 C1062585, S5-42 C1062586
  - S8-R3 (35): S4-09b C715599, S4-10b C715600, S4-11b C715601, S4-12b C715602, D-01 C715481, D-01b C715621, D-02 C715482, D-03 C715483, D-04 C715484, D-04b C715623, D-05 C715485, D-06 C715486, D-07 C715487, D-07b C715625, D-08 C715488, D-09 C715489, D-10 C715490, D-10b C715627, D-11 C715491, D-12 C715492, D-13 C715493, D-13b C715629, D-14 C715494, D-15 C715495, D-16 C715496, D-16b C715631, D-17 C715497, D-18 C715498, D-47 C715527, D-48 C715528, D-50 C715532, D-56 C715538, D-58 C715540, D-61 C715543, D-62 C715544
- **Folders changed outside the library (11-12 Nov 2026):** 135 of our cases are no longer in the folder the library gives them. 130 are in
  "Setup needed before testing" (133629, under 90418; its description reads "Tests whose starting records must be made first. Each test lists
  them under "Setup" after its Preconditions"). They include D-01 to D-18 and D-31, the cases these new ones complement. S1-05 C715277 and
  S1-07 C715279 are in "Retired - cannot be set up (QA lead 11 and 12 Nov 2026)" (134653, with 3 foreign cases), which is why they are not in
  run 557. 16 cases (REL-*, DATA-13) are in 133628, now "Run on Staging After the Feature Is Deployed". Left alone. **Folder choice for the new
  cases** (point 4 below).

## 6b. Point 4 (your decision): which folder for the new cases
D-82 to D-89 and D-95 make their own records first, like the cases now in "Setup needed before testing". Our rule book (Rule 117, fourteenth
amendment) has no "Setup" block after the Preconditions, so I wrote them in the library's standard shape and filed them in Design, as asked.
*My recommendation:* create them in Design (the default), and if you want them beside D-01 to D-18, run the script with `--setup-folder`.
That changes only the folder; giving them a "Setup" block would be a format change that needs your say. D-90 to D-94 use any existing records
and stay in Design either way.

## 7. The create script (prepared, not run)

`demo-day-2026-11-13/create_demo_day.py` mirrors `currency-2026-11-10/write/create_v11.py`, `run557_sync.py` and `attach_reshot.py`. It runs as a dry run unless
`--apply` is given. With `--apply` it: runs the tester-readiness check first and stops on failure; refuses if a target folder holds a case outside
our map; adds only D-82 to D-95 (resumable, read back, map appended, custom_atmstatus 1); attaches each case's listed design pictures (read back
by name); refuses if run 557 is completed; adds the 13 non-held C-ids to run 557 **union only**, so the 89 foreign tests and all results stay;
assigns the new tests to Mudassir (user 6) with an assign-only result; and logs every operation with C-id, HTTP status and read-back to
`demo-day-2026-11-13/applied/`. Rule 128 (link the case at the bottom of its ticket) applies after creation: SV-12722 (D-82), SV-12763
(D-90 to D-93) and SV-12764 (D-88). That is a separate, approved Jira edit, not in this script.

## 8. Full text of every new case (as TestRail will show it)

### D-82 — Design: A/R Customer menu keeps a long no-space name inside its row

Folder: Design — how it looks (section 90430) · Refs: SV-12722, SV-11535, PRD v13 S5-R13

Preconditions
- Sign in as an Admin user (the "Admin" role).
- Create, for this test, a customer, customer A, whose name is 120 letters long with no spaces, and give them an open invoice dated today, so they are in the Customer menu.
- Create, for this test, a second customer, customer B, whose name is more than 60 characters long and includes each of these characters: & " ' < >, and give them an open invoice dated today.
- Use a desktop browser window 1440 px wide, at 100% zoom.
- Open A/R Summary (Reports, then "A/R Aging Summary" under ACCOUNTS RECEIVABLE in the left menu).

**Steps**

1. Click the Customer chip.
2. Scroll the list in the menu to customer A's row.
3. Click customer A's tick box.
4. Click the tick box in the row directly under customer A's row (if customer A's row is the last one, the row directly above it).
5. Scroll the list to customer B's row.

Expected Result
Step 1:
- The Customer menu opens: a search box, "All customers", then the list of customers.
Step 2:
- Customer A's whole name stays inside its own row (wrapped inside the row or shortened with "..."; either is a pass).
- No part of it is drawn over the row under it or over that row's tick box; that row's name can be read.
Step 3:
- Customer A is ticked.
- The chip shows customer A's name, shortened with "...".
Step 4:
- The customer in that row is ticked, and customer A stays ticked.
- The chip reads "Customer: 2 customers".
Step 5:
- Customer B's whole name, with its & " ' < > characters, stays inside its own row (wrapped inside the row or shortened with "..."; either is a pass).
- No part of it is drawn over the row under it or over that row's tick box; that row's name can be read.

What you should see today: in step 2, customer A's name wraps onto about 4 lines; the first line is cut off at the top and the last line is drawn on top of the next customer's row and its tick box. The same happens in Sales By Customer's Customer menu. This is a known problem and it is already reported — see https://shopview.atlassian.net/browse/SV-12722 (filed 13 Nov 2026, after Demo Day).
· If you see exactly that, mark this test FAILED and do not raise anything new.
· If it fails in a DIFFERENT way from what is described above, that is a NEW problem — please report it.
· If it PASSES, the fix has shipped: report it so the ticket can be closed and this note removed.
Exact quotes from the source (for reproducibility)
From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 13 (Change Log: version 12 on 12 Nov 2026 by Milos Vasic, version 13 on 13 Nov 2026 by Chris Ward), read 13 Nov 2026 · Epic SV-11315, story SV-11535 (Story 5, Filters: customer or vendor, past due and location)
- S5-R13 (version 13): “The customer chip (A/R) and vendor chip (A/P) and their open menus are the native ones: Customer exactly as Sales By Customer's Customer filter (person icon), Vendor exactly as Inventory Value's Vendor filter (truck icon, "Search vendors"; as there, the search box shows only when there are more than 8 vendors). The menu has a search box, an "All customers" or "All vendors" row, the native line "All customers are included. Pick one or more to narrow." (or vendors) while none is ticked, and the list; several can be ticked. The chip reads "Customer: All customers" or "Vendor: All vendors" in the resting (grey) style when none is ticked, the name when one is (shortened with "..." when long), and "Customer: N customers" or "Vendor: N vendors" when N are. The ticked customers or vendors narrow every row, group, total, page, sort and export; the Location list does not change (S5-R3).”
From: Slack, Chris Ward (product owner), 13 Nov 2026, thread in channel C0C454MLP0T, read 13 Nov 2026
- Slack, Chris Ward, Picture #1: “Picture #1 — the long customer name wrap issue (shows up in the filter)”
Not yet checked against a build: the QA build v26.45.2-6a8b89c exists since 10 Nov 2026 and this case has not been run on it yet.

References from Design
Design canvas "A/R and A/P Report Sorting" (https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4), version of 5 Nov 2026 (1793886208-34e0), read 10 Nov 2026: page 7 "Filters and call list" (board Filters.dc.html). The design draws the Customer menu with short names only ("Two customers ticked"); it draws no long name in a menu row. The expected results come from the PRD and Slack quotes above; the pictures give the menu's rows and labels.
Design pictures attached to this case:
- ar-ap-p7-two-customers-ticked.png: figure "Two customers ticked" (New in this build), board "7. Filters and call list"
- ar-ap-p7-four-chips-on-every-report.png: figure "Four chips on every report" (This build (after)), board "7. Filters and call list"
The design's own words:
- "Customer menu with 10 Trucking and 4 Star Truck Repair ticked ("2 selected", shown as tags in the search box): the chip reads "Customer: 2 customers", and rows and Totals narrow to them (4 Star Truck Repair has nothing open). S5-R13, S5-R14, S5-R19." (caption of "Two customers ticked")
- "As of, Customer (Vendor on A/P), Past due, Location. "Customer: All customers" and "Past due: Any" rest grey, Past due with the design system’s hourglass icon. S5-R1, S5-R13, S5-R15." (caption of "Four chips on every report")
Design note (DR-04): the design shows the Customer menu with two ticked shows the ticked names as tags in the search box, a clear "×", and "2 selected" on the "All customers" row. Closed without a question: No conflict: PRD S5-R13 "Customer exactly as Sales By Customer's Customer filter"; the PRD lists the menu's main rows, the design shows the native extras. The design case checks them.

AUTOMATION: READY - EXPECT FAIL (SV-12722)


---

### D-83 — Design: A/P Vendor menu keeps a long no-space name inside its row

Folder: Design — how it looks (section 90430) · Refs: SV-12722, SV-11535, PRD v13 S5-R13

Preconditions
- Sign in as an Admin user (the "Admin" role).
- Create, for this test, a vendor, vendor A, whose name is 120 letters long with no spaces, and give them an unpaid bill dated today, so they are in the Vendor menu.
- Create, for this test, a second vendor, vendor B, whose name is more than 60 characters long and includes each of these characters: & " ' < >, and give them an unpaid bill dated today.
- Use a desktop browser window 1440 px wide, at 100% zoom.
- Open A/P Detail (Reports, then "A/P Aging Detail" under ACCOUNTS PAYABLE in the left menu).

**Steps**

1. Click the Vendor chip.
2. Scroll the list in the menu to vendor A's row.
3. Click vendor A's tick box.
4. Click the tick box in the row directly under vendor A's row (if vendor A's row is the last one, the row directly above it).
5. Scroll the list to vendor B's row.

Expected Result
Step 1:
- The Vendor menu opens: "All vendors", then the list of vendors (a search box "Search vendors" above them when there are more than 8 vendors).
Step 2:
- Vendor A's whole name stays inside its own row (wrapped inside the row or shortened with "..."; either is a pass).
- No part of it is drawn over the row under it or over that row's tick box; that row's name can be read.
Step 3:
- Vendor A is ticked.
- The chip shows vendor A's name, shortened with "...".
Step 4:
- The vendor in that row is ticked, and vendor A stays ticked.
- The chip reads "Vendor: 2 vendors".
Step 5:
- Vendor B's whole name, with its & " ' < > characters, stays inside its own row (wrapped inside the row or shortened with "..."; either is a pass).
- No part of it is drawn over the row under it or over that row's tick box; that row's name can be read.

Exact quotes from the source (for reproducibility)
From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 13 (Change Log: version 12 on 12 Nov 2026 by Milos Vasic, version 13 on 13 Nov 2026 by Chris Ward), read 13 Nov 2026 · Epic SV-11315, story SV-11535 (Story 5, Filters: customer or vendor, past due and location)
- S5-R13 (version 13): “The customer chip (A/R) and vendor chip (A/P) and their open menus are the native ones: Customer exactly as Sales By Customer's Customer filter (person icon), Vendor exactly as Inventory Value's Vendor filter (truck icon, "Search vendors"; as there, the search box shows only when there are more than 8 vendors). The menu has a search box, an "All customers" or "All vendors" row, the native line "All customers are included. Pick one or more to narrow." (or vendors) while none is ticked, and the list; several can be ticked. The chip reads "Customer: All customers" or "Vendor: All vendors" in the resting (grey) style when none is ticked, the name when one is (shortened with "..." when long), and "Customer: N customers" or "Vendor: N vendors" when N are. The ticked customers or vendors narrow every row, group, total, page, sort and export; the Location list does not change (S5-R3).”
From: Slack, Chris Ward (product owner), 13 Nov 2026, thread in channel C0C454MLP0T, read 13 Nov 2026
- Slack, Chris Ward, Picture #1: “Picture #1 — the long customer name wrap issue (shows up in the filter)”
Not yet checked against a build: the QA build v26.45.2-6a8b89c exists since 10 Nov 2026 and this case has not been run on it yet.

References from Design
Design canvas "A/R and A/P Report Sorting" (https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4), version of 5 Nov 2026 (1793886208-34e0), read 10 Nov 2026: page 7 "Filters and call list" (board Filters.dc.html). The design draws the Vendor menu with short names only ("The native Vendor menu"); it draws no long name in a menu row. The expected results come from the PRD and Slack quotes above; the picture gives the menu's rows and labels.
Design pictures attached to this case:
- ar-ap-p7-the-native-vendor-menu-reshot-2026-11-05.png: figure "The native Vendor menu" (New in this build), board "7. Filters and call list", re-shot 23 Oct 2026, design version of 5 Nov 2026
The design's own words:
- "Vendor chip with the truck icon, as on Inventory Value. Its menu: a search box reading "Search vendors" (shown when there are more than 8 vendors), "All vendors" ticked, "All vendors are included. Pick one or more to narrow.", then the vendors A to Z. Reshot 2026-10-23 (round 15). S5-R13, S5-R14." (caption of "The native Vendor menu")
Difference from the PRD (DD-02), closed: PRD version 5 said Vendor "exactly as Inventory Value's Vendor filter (truck icon, "Search vendors")" (S5-R13); the design shows the Vendor menu's search box reads "Search vendor" (singular); alt text: "Search vendor, All vendors and the helper line". PRD version 9 (23 Oct 2026), written after question 12, keeps "Search vendors" and adds that the search box shows only when there are more than 8 vendors (S5-R13), unchanged in version 11. The design's Vendor menu picture was reshot on 23 Oct 2026 (round 15) and published on 5 Nov 2026; its caption now reads: a search box reading "Search vendors" (shown when there are more than 8 vendors). This case follows the PRD. The held design-version case D-77 (C715559) was deleted from TestRail on 26 Oct 2026 with the QA lead's go-ahead (snapshot in v9-pass-2026-10-26/deleted/).

AUTOMATION: Not available on Build to test Yet - Last checked 11/13/2026


---

### D-84 — Design: A/R Summary with a long no-space customer name shows every column

Folder: Design — how it looks (section 90430) · Refs: SV-12764, SV-11538, PRD v13 S8-R3

Preconditions
- Sign in as an Admin user (the "Admin" role).
- Create, for this test, a customer, customer A, whose name is 120 letters long with no spaces, and give them an open invoice dated today.
- Use a desktop browser window 1440 px wide, at 100% zoom.
- Open A/R Summary (Reports, then "A/R Aging Summary" under ACCOUNTS RECEIVABLE in the left menu).
- Leave the report with only customer A ticked in the Customer filter.

**Steps**

1. Look at customer A's row, from the name to "Total".

Expected Result
Step 1:
- Customer A's name wraps inside its own cell, onto as many lines as it needs, and does not run into the next column.
- Every column heading from the customer name to "Total" is visible without scrolling sideways, and no heading wraps.
- There is no sideways scroll bar under the table.
- "Total" stays bold at the right edge.

Exact quotes from the source (for reproducibility)
From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 13 (Change Log: version 12 on 12 Nov 2026 by Milos Vasic, version 13 on 13 Nov 2026 by Chris Ward), read 13 Nov 2026 · Epic SV-11315, story SV-11538 (Story 8, Report descriptions and layout)
- S8-R3 (version 13): “The headline column (Open Balance; Total on the Summaries) is pinned to the right edge and bold on the header, every row, every expanded row and the Totals row, as on Sales By Customer. At 1440 pixels wide every column of all six reports is visible without scrolling sideways: the customer or vendor name and Transaction Type wrap long values onto a second line, Location wraps only on A/P Detail (nine columns) and A/P Unpaid Invoices, column headings never wrap, and money, date and number columns never wrap. Narrower than 1440 pixels, the table scrolls sideways under the pinned column. One exception, as today: on A/P Unpaid Invoices a vendor's group row does not wrap, so a very long vendor name (78 characters still fit) can make the table scroll sideways at 1440 pixels.”
Not yet checked against a build: the QA build v26.45.2-6a8b89c exists since 10 Nov 2026 and this case has not been run on it yet.

References from Design
Design canvas "A/R and A/P Report Sorting" (https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4), version of 5 Nov 2026 (1793886208-34e0), read 10 Nov 2026: page 6 "Descriptions and pinned column" (board Layout.dc.html). The design pictures 1440 px with short names only; its caption "text columns wrap" is the design's own rule for long values. The expected results come from the PRD quote above.
Design pictures attached to this case:
- ar-ap-p6-a-p-unpaid-invoices-at-1440-every-column-visible.png: figure "A/P Unpaid Invoices at 1440: every column visible" (This build (after)), board "6. Report descriptions and the pinned headline column"
- ar-ap-p6-open-balance-pinned-light.png: figure "Open Balance pinned, light" (This build (after)), board "6. Report descriptions and the pinned headline column"
- ar-ap-p6-a-p-detail-scrolled-sideways-light.png: figure "A/P Detail scrolled sideways, light" (Production (before)), board "6. Report descriptions and the pinned headline column" (today's look, for comparison only)
The design's own words:
- "At 1440 pixels every column fits without sideways scrolling: Date, Location, Transaction Type, No., Vendor Name, Due Date, Past Due, Amount and the pinned, bold Open Balance. Group labels span to the total; text columns wrap. S8-R3." (caption of "A/P Unpaid Invoices at 1440: every column visible")
- "The headline column (Open Balance; Total on the Summaries) is bold and pinned right; the group label stays at the left. S8-R3, S8-R4, S4-R7." (caption of "Open Balance pinned, light")
- "No description anywhere; no column stays in place." (caption of "A/P Detail scrolled sideways, light")
- "Group labels span to the total; text columns wrap. S8-R3."

AUTOMATION: Not available on Build to test Yet - Last checked 11/13/2026


---

### D-85 — Design: A/P Summary with a long no-space vendor name shows every column

Folder: Design — how it looks (section 90430) · Refs: SV-12764, SV-11538, PRD v13 S8-R3

Preconditions
- Sign in as an Admin user (the "Admin" role).
- Create, for this test, a vendor, vendor A, whose name is 120 letters long with no spaces, and give them an unpaid bill dated today.
- Use a desktop browser window 1440 px wide, at 100% zoom.
- Open A/P Summary (Reports, then "A/P Aging Summary" under ACCOUNTS PAYABLE in the left menu).
- Leave the report with only vendor A ticked in the Vendor filter.

**Steps**

1. Look at vendor A's row, from the name to "Total".

Expected Result
Step 1:
- Vendor A's name wraps inside its own cell, onto as many lines as it needs, and does not run into the next column.
- Every column heading from the vendor name to "Total" is visible without scrolling sideways, and no heading wraps.
- There is no sideways scroll bar under the table.
- "Total" stays bold at the right edge.

Exact quotes from the source (for reproducibility)
From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 13 (Change Log: version 12 on 12 Nov 2026 by Milos Vasic, version 13 on 13 Nov 2026 by Chris Ward), read 13 Nov 2026 · Epic SV-11315, story SV-11538 (Story 8, Report descriptions and layout)
- S8-R3 (version 13): “The headline column (Open Balance; Total on the Summaries) is pinned to the right edge and bold on the header, every row, every expanded row and the Totals row, as on Sales By Customer. At 1440 pixels wide every column of all six reports is visible without scrolling sideways: the customer or vendor name and Transaction Type wrap long values onto a second line, Location wraps only on A/P Detail (nine columns) and A/P Unpaid Invoices, column headings never wrap, and money, date and number columns never wrap. Narrower than 1440 pixels, the table scrolls sideways under the pinned column. One exception, as today: on A/P Unpaid Invoices a vendor's group row does not wrap, so a very long vendor name (78 characters still fit) can make the table scroll sideways at 1440 pixels.”
Not yet checked against a build: the QA build v26.45.2-6a8b89c exists since 10 Nov 2026 and this case has not been run on it yet.

References from Design
Design canvas "A/R and A/P Report Sorting" (https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4), version of 5 Nov 2026 (1793886208-34e0), read 10 Nov 2026: page 6 "Descriptions and pinned column" (board Layout.dc.html). The design pictures 1440 px with short names only; its caption "text columns wrap" is the design's own rule for long values. The expected results come from the PRD quote above.
Design pictures attached to this case:
- ar-ap-p6-a-p-unpaid-invoices-at-1440-every-column-visible.png: figure "A/P Unpaid Invoices at 1440: every column visible" (This build (after)), board "6. Report descriptions and the pinned headline column"
- ar-ap-p6-open-balance-pinned-light.png: figure "Open Balance pinned, light" (This build (after)), board "6. Report descriptions and the pinned headline column"
- ar-ap-p6-a-p-detail-scrolled-sideways-light.png: figure "A/P Detail scrolled sideways, light" (Production (before)), board "6. Report descriptions and the pinned headline column" (today's look, for comparison only)
The design's own words:
- "At 1440 pixels every column fits without sideways scrolling: Date, Location, Transaction Type, No., Vendor Name, Due Date, Past Due, Amount and the pinned, bold Open Balance. Group labels span to the total; text columns wrap. S8-R3." (caption of "A/P Unpaid Invoices at 1440: every column visible")
- "The headline column (Open Balance; Total on the Summaries) is bold and pinned right; the group label stays at the left. S8-R3, S8-R4, S4-R7." (caption of "Open Balance pinned, light")
- "No description anywhere; no column stays in place." (caption of "A/P Detail scrolled sideways, light")
- "Group labels span to the total; text columns wrap. S8-R3."

AUTOMATION: Not available on Build to test Yet - Last checked 11/13/2026


---

### D-86 — Design: A/R Detail with a long no-space customer name shows every column

Folder: Design — how it looks (section 90430) · Refs: SV-12764, SV-11538, PRD v13 S8-R3

Preconditions
- Sign in as an Admin user (the "Admin" role).
- Create, for this test, a customer, customer A, whose name is 120 letters long with no spaces, and give them an open invoice dated today, not yet due, so it is in the "Current" bucket.
- Use a desktop browser window 1440 px wide, at 100% zoom.
- Open A/R Detail (Reports, then "A/R Aging Detail" under ACCOUNTS RECEIVABLE in the left menu).
- Leave the report with only customer A ticked in the Customer filter and every bucket collapsed.

**Steps**

1. Look at the column headings and the bottom edge of the table.
2. Expand the "Current" bucket.

Expected Result
Step 1:
- Every column heading from "Date" to "Open Balance" is visible without scrolling sideways, and no heading wraps.
- There is no sideways scroll bar under the table.
Step 2:
- Customer A's line shows; the name in "Customer Full Name" wraps inside its own cell, onto as many lines as it needs, and does not run into the next column.
- Every column heading from "Date" to "Open Balance" is still visible without scrolling sideways, with no sideways scroll bar.
- "Open Balance" stays bold at the right edge.

Exact quotes from the source (for reproducibility)
From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 13 (Change Log: version 12 on 12 Nov 2026 by Milos Vasic, version 13 on 13 Nov 2026 by Chris Ward), read 13 Nov 2026 · Epic SV-11315, story SV-11538 (Story 8, Report descriptions and layout)
- S8-R3 (version 13): “The headline column (Open Balance; Total on the Summaries) is pinned to the right edge and bold on the header, every row, every expanded row and the Totals row, as on Sales By Customer. At 1440 pixels wide every column of all six reports is visible without scrolling sideways: the customer or vendor name and Transaction Type wrap long values onto a second line, Location wraps only on A/P Detail (nine columns) and A/P Unpaid Invoices, column headings never wrap, and money, date and number columns never wrap. Narrower than 1440 pixels, the table scrolls sideways under the pinned column. One exception, as today: on A/P Unpaid Invoices a vendor's group row does not wrap, so a very long vendor name (78 characters still fit) can make the table scroll sideways at 1440 pixels.”
Not yet checked against a build: the QA build v26.45.2-6a8b89c exists since 10 Nov 2026 and this case has not been run on it yet.

References from Design
Design canvas "A/R and A/P Report Sorting" (https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4), version of 5 Nov 2026 (1793886208-34e0), read 10 Nov 2026: page 1 "Opening order and header sorting" (board Main.dc.html); page 6 "Descriptions and pinned column" (board Layout.dc.html). The design pictures 1440 px with short names only; its caption "text columns wrap" is the design's own rule for long values. The expected results come from the PRD quote above.
Design pictures attached to this case:
- ar-ap-p6-open-balance-pinned-light.png: figure "Open Balance pinned, light" (This build (after)), board "6. Report descriptions and the pinned headline column"
- ar-ap-p1-a-p-aging-detail-opens-by-vendor-name.png: figure "A/P Aging Detail opens by vendor name" (This build (after)), board "1. Opening order and header sorting"
- ar-ap-p6-a-p-detail-scrolled-sideways-light.png: figure "A/P Detail scrolled sideways, light" (Production (before)), board "6. Report descriptions and the pinned headline column" (today's look, for comparison only)
The design's own words:
- "The headline column (Open Balance; Total on the Summaries) is bold and pinned right; the group label stays at the left. S8-R3, S8-R4, S4-R7." (caption of "Open Balance pinned, light")
- "Buckets stay in fixed order; rows inside each bucket go by vendor name (was most overdue first). S1-R5, S2-R4, S2-R5." (caption of "A/P Aging Detail opens by vendor name")
- "No description anywhere; no column stays in place." (caption of "A/P Detail scrolled sideways, light")
- "Group labels span to the total; text columns wrap. S8-R3."

AUTOMATION: Not available on Build to test Yet - Last checked 11/13/2026


---

### D-87 — Design: A/P Detail with a long no-space vendor name shows every column

Folder: Design — how it looks (section 90430) · Refs: SV-12764, SV-11538, PRD v13 S8-R3

Preconditions
- Sign in as an Admin user (the "Admin" role).
- Create, for this test, a vendor, vendor A, whose name is 120 letters long with no spaces, and give them an unpaid bill dated today, not yet due, so it is in the "Current" bucket.
- Use a desktop browser window 1440 px wide, at 100% zoom.
- Open A/P Detail (Reports, then "A/P Aging Detail" under ACCOUNTS PAYABLE in the left menu).
- Leave the report with only vendor A ticked in the Vendor filter and every bucket collapsed.

**Steps**

1. Look at the column headings and the bottom edge of the table.
2. Expand the "Current" bucket.

Expected Result
Step 1:
- Every column heading from "Date" to "Open Balance" is visible without scrolling sideways, and no heading wraps.
- There is no sideways scroll bar under the table.
Step 2:
- Vendor A's line shows; the name in "Vendor Name" wraps inside its own cell, onto as many lines as it needs, and does not run into the next column.
- Every column heading from "Date" to "Open Balance" is still visible without scrolling sideways, with no sideways scroll bar.
- "Open Balance" stays bold at the right edge.

Exact quotes from the source (for reproducibility)
From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 13 (Change Log: version 12 on 12 Nov 2026 by Milos Vasic, version 13 on 13 Nov 2026 by Chris Ward), read 13 Nov 2026 · Epic SV-11315, story SV-11538 (Story 8, Report descriptions and layout)
- S8-R3 (version 13): “The headline column (Open Balance; Total on the Summaries) is pinned to the right edge and bold on the header, every row, every expanded row and the Totals row, as on Sales By Customer. At 1440 pixels wide every column of all six reports is visible without scrolling sideways: the customer or vendor name and Transaction Type wrap long values onto a second line, Location wraps only on A/P Detail (nine columns) and A/P Unpaid Invoices, column headings never wrap, and money, date and number columns never wrap. Narrower than 1440 pixels, the table scrolls sideways under the pinned column. One exception, as today: on A/P Unpaid Invoices a vendor's group row does not wrap, so a very long vendor name (78 characters still fit) can make the table scroll sideways at 1440 pixels.”
Not yet checked against a build: the QA build v26.45.2-6a8b89c exists since 10 Nov 2026 and this case has not been run on it yet.

References from Design
Design canvas "A/R and A/P Report Sorting" (https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4), version of 5 Nov 2026 (1793886208-34e0), read 10 Nov 2026: page 1 "Opening order and header sorting" (board Main.dc.html); page 6 "Descriptions and pinned column" (board Layout.dc.html). The design pictures 1440 px with short names only; its caption "text columns wrap" is the design's own rule for long values. The expected results come from the PRD quote above.
Design pictures attached to this case:
- ar-ap-p6-open-balance-pinned-light.png: figure "Open Balance pinned, light" (This build (after)), board "6. Report descriptions and the pinned headline column"
- ar-ap-p1-a-p-aging-detail-opens-by-vendor-name.png: figure "A/P Aging Detail opens by vendor name" (This build (after)), board "1. Opening order and header sorting"
- ar-ap-p6-a-p-detail-scrolled-sideways-light.png: figure "A/P Detail scrolled sideways, light" (Production (before)), board "6. Report descriptions and the pinned headline column" (today's look, for comparison only)
The design's own words:
- "The headline column (Open Balance; Total on the Summaries) is bold and pinned right; the group label stays at the left. S8-R3, S8-R4, S4-R7." (caption of "Open Balance pinned, light")
- "Buckets stay in fixed order; rows inside each bucket go by vendor name (was most overdue first). S1-R5, S2-R4, S2-R5." (caption of "A/P Aging Detail opens by vendor name")
- "No description anywhere; no column stays in place." (caption of "A/P Detail scrolled sideways, light")
- "Group labels span to the total; text columns wrap. S8-R3."

AUTOMATION: Not available on Build to test Yet - Last checked 11/13/2026


---

### D-88 — Design: A/R Collection with a long no-space customer name shows every column

Folder: Design — how it looks (section 90430) · Refs: SV-12764, SV-11538, PRD v13 S8-R3

Preconditions
- Sign in as an Admin user (the "Admin" role).
- Create, for this test, a customer, customer A, whose name is 120 letters long with no spaces, and give them an invoice that is overdue on today's date.
- Use a desktop browser window 1440 px wide, at 100% zoom.
- Open A/R Collection (Reports, then "A/R Aging Collection" under ACCOUNTS RECEIVABLE in the left menu).
- Leave the report with only customer A ticked in the Customer filter and customer A's group collapsed.

**Steps**

1. Look at customer A's group row, the column headings and the Totals row.
2. Expand customer A's group.

Expected Result
Step 1:
- Customer A's name wraps inside the group row, onto as many lines as it needs.
- Every column heading from "Date" to "Open Balance" is visible without scrolling sideways, "Past Due" and "Amount" included, and no heading wraps.
- There is no sideways scroll bar under the table, and the Totals row shows its Amount and Open Balance.
Step 2:
- Customer A's overdue invoice shows under the group row.
- Every column heading from "Date" to "Open Balance" is still visible without scrolling sideways, with no sideways scroll bar.
- Customer A's name still wraps inside the group row.

What you should see today: in step 1, customer A's name stays on one line across the group row, the table becomes wider than the page, a sideways scroll bar shows under it, "Past Due" and "Amount" are hidden behind the pinned "Open Balance" column and the Totals row shows only Open Balance. In step 2 the columns fit again, but the name still runs on one line. This is a known problem and it is already reported — see https://shopview.atlassian.net/browse/SV-12764 (filed 13 Nov 2026, after Demo Day).
· If you see exactly that, mark this test FAILED and do not raise anything new.
· If it fails in a DIFFERENT way from what is described above, that is a NEW problem — please report it.
· If it PASSES, the fix has shipped: report it so the ticket can be closed and this note removed.
Exact quotes from the source (for reproducibility)
From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 13 (Change Log: version 12 on 12 Nov 2026 by Milos Vasic, version 13 on 13 Nov 2026 by Chris Ward), read 13 Nov 2026 · Epic SV-11315, story SV-11538 (Story 8, Report descriptions and layout)
- S8-R3 (version 13): “The headline column (Open Balance; Total on the Summaries) is pinned to the right edge and bold on the header, every row, every expanded row and the Totals row, as on Sales By Customer. At 1440 pixels wide every column of all six reports is visible without scrolling sideways: the customer or vendor name and Transaction Type wrap long values onto a second line, Location wraps only on A/P Detail (nine columns) and A/P Unpaid Invoices, column headings never wrap, and money, date and number columns never wrap. Narrower than 1440 pixels, the table scrolls sideways under the pinned column. One exception, as today: on A/P Unpaid Invoices a vendor's group row does not wrap, so a very long vendor name (78 characters still fit) can make the table scroll sideways at 1440 pixels.”
Not yet checked against a build: the QA build v26.45.2-6a8b89c exists since 10 Nov 2026 and this case has not been run on it yet.

References from Design
Design canvas "A/R and A/P Report Sorting" (https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4), version of 5 Nov 2026 (1793886208-34e0), read 10 Nov 2026: page 3 "Collapse all and pinned group rows" (board Grouped.dc.html); page 6 "Descriptions and pinned column" (board Layout.dc.html); page 7 "Filters and call list" (board Filters.dc.html). The design pictures A/R Collection at 1440 px with short names only. The expected results come from the PRD quote above.
Design pictures attached to this case:
- ar-ap-p3-expand-all-from-the-header.png: figure "Expand all from the header" (This build (after)), board "3. Collapse all, Expand all and pinned group rows"
- ar-ap-p7-call-list-on-a-r-collection.png: figure "Call list on A/R Collection" (New in this build), board "7. Filters and call list"
- ar-ap-p6-a-p-detail-scrolled-sideways-light.png: figure "A/P Detail scrolled sideways, light" (Production (before)), board "6. Report descriptions and the pinned headline column" (today's look, for comparison only)
The design's own words:
- "One chevron in the top-left header cell: "Collapse all" while any group is open, "Expand all" when none is. Group toggles use the same chevron. S4-R1 to S4-R5, S4-R8." (caption of "Expand all from the header")
- "Customer picked: the group row shows "Phone:" and, for users with View and Manage AP/AR Data, "Credit term:". The Totals row follows the customer filter. S9-R1, S9-R2, S5-R18. Exports carry the same lines and columns: S9-R3, S3-R5, S3-R8a." (caption of "Call list on A/R Collection")
- "No description anywhere; no column stays in place." (caption of "A/P Detail scrolled sideways, light")

AUTOMATION: READY - EXPECT FAIL (SV-12764)


---

### D-89 — Design: A/P Unpaid Invoices with a 78-character vendor name shows every column

Folder: Design — how it looks (section 90430) · Refs: SV-12764, SV-11538, PRD v13 S8-R3

Preconditions
- Sign in as an Admin user (the "Admin" role).
- Create, for this test, a vendor, vendor A, whose name is exactly 78 characters long with no spaces, and give them an unpaid bill dated today.
- Use a desktop browser window 1440 px wide, at 100% zoom.
- Open A/P Unpaid Invoices (Reports, then "A/P Unpaid Invoices" under ACCOUNTS PAYABLE in the left menu; the page title reads "A/P Unpaid Invoices Report").
- Leave the report with only vendor A ticked in the Vendor filter and vendor A's group collapsed.

**Steps**

1. Look at vendor A's group row, the column headings and the bottom edge of the table.
2. Expand vendor A's group.

Expected Result
Step 1:
- Vendor A's whole name shows in the group row.
- Every column heading from "Date" to "Open Balance" is visible without scrolling sideways, and no heading wraps.
- There is no sideways scroll bar under the table.
Step 2:
- Vendor A's bill shows under the group row.
- On the bill's line, the name in "Vendor Name" wraps inside its own cell, onto as many lines as it needs, and does not run into the next column.
- Every column heading from "Date" to "Open Balance" is still visible without scrolling sideways, with no sideways scroll bar.
- "Open Balance" stays bold at the right edge.

Why 78 characters: on this report a vendor's group row does not wrap, and the PRD allows a much longer vendor name to make the table scroll sideways here; it says 78 characters still fit.
Exact quotes from the source (for reproducibility)
From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 13 (Change Log: version 12 on 12 Nov 2026 by Milos Vasic, version 13 on 13 Nov 2026 by Chris Ward), read 13 Nov 2026 · Epic SV-11315, story SV-11538 (Story 8, Report descriptions and layout)
- S8-R3 (version 13): “The headline column (Open Balance; Total on the Summaries) is pinned to the right edge and bold on the header, every row, every expanded row and the Totals row, as on Sales By Customer. At 1440 pixels wide every column of all six reports is visible without scrolling sideways: the customer or vendor name and Transaction Type wrap long values onto a second line, Location wraps only on A/P Detail (nine columns) and A/P Unpaid Invoices, column headings never wrap, and money, date and number columns never wrap. Narrower than 1440 pixels, the table scrolls sideways under the pinned column. One exception, as today: on A/P Unpaid Invoices a vendor's group row does not wrap, so a very long vendor name (78 characters still fit) can make the table scroll sideways at 1440 pixels.”
Not yet checked against a build: the QA build v26.45.2-6a8b89c exists since 10 Nov 2026 and this case has not been run on it yet.

References from Design
Design canvas "A/R and A/P Report Sorting" (https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4), version of 5 Nov 2026 (1793886208-34e0), read 10 Nov 2026: page 3 "Collapse all and pinned group rows" (board Grouped.dc.html); page 6 "Descriptions and pinned column" (board Layout.dc.html). The design pictures A/P Unpaid Invoices at 1440 px with short names only. The expected results come from the PRD quote above.
Design pictures attached to this case:
- ar-ap-p6-a-p-unpaid-invoices-at-1440-every-column-visible.png: figure "A/P Unpaid Invoices at 1440: every column visible" (This build (after)), board "6. Report descriptions and the pinned headline column"
- ar-ap-p3-same-on-a-p-unpaid-invoices.png: figure "Same on A/P Unpaid Invoices" (This build (after)), board "3. Collapse all, Expand all and pinned group rows"
- ar-ap-p6-a-p-detail-scrolled-sideways-light.png: figure "A/P Detail scrolled sideways, light" (Production (before)), board "6. Report descriptions and the pinned headline column" (today's look, for comparison only)
The design's own words:
- "At 1440 pixels every column fits without sideways scrolling: Date, Location, Transaction Type, No., Vendor Name, Due Date, Past Due, Amount and the pinned, bold Open Balance. Group labels span to the total; text columns wrap. S8-R3." (caption of "A/P Unpaid Invoices at 1440: every column visible")
- "Vendor rows pin the same way; re-sorting never collapses an open group. S4-R6, S2-R9." (caption of "Same on A/P Unpaid Invoices")
- "No description anywhere; no column stays in place." (caption of "A/P Detail scrolled sideways, light")
- "At 1440 pixels every column fits without sideways scrolling: Date, Location, Transaction Type, No., Vendor Name, Due Date, Past Due, Amount and the pinned, bold Open Balance. Group labels span to the total; text columns wrap. S8-R3."

AUTOMATION: Not available on Build to test Yet - Last checked 11/13/2026


---

### D-90 — Design: A/R Detail columns stay in place when buckets open and close

Folder: Design — how it looks (section 90430) · Refs: SV-12763, SV-11534, PRD v13 S4-R1, S4-R5

Preconditions
- Sign in as an Admin user (the "Admin" role).
- Have open invoices dated on different days so that at least two aging buckets of A/R Detail have lines, so there are groups to open.
- Use a desktop browser window 1440 px wide, at 100% zoom.
- Open A/R Detail (Reports, then "A/R Aging Detail" under ACCOUNTS RECEIVABLE in the left menu).
- Leave every bucket collapsed (the chevron at the top left of the table points right).

**Steps**

1. Take a screenshot of the page, showing the column headings.
2. Click the chevron of the first bucket that has lines.
3. Click the same bucket's chevron again.
4. Click the chevron at the top left of the table (Expand all).
5. Click the chevron at the top left of the table again (Collapse all).

Expected Result
Step 1:
- You have a picture of where each column heading sits while every bucket is collapsed.
Step 2:
- The bucket opens and shows its lines, each cell under its own heading.
- Every column heading is in the same place as in your screenshot: none has moved left or right.
Step 3:
- The bucket closes.
- Every column heading is in the same place as in your screenshot: none has moved left or right.
Step 4:
- Every bucket opens.
- Every column heading is in the same place as in your screenshot: none has moved left or right.
Step 5:
- Every bucket closes.
- Every column heading is in the same place as in your screenshot: none has moved left or right.

What you should see today: when a bucket opens or closes, and on Expand all and Collapse all, the column widths change, so the headings and lines jump sideways (on the ticket, in a 1536 px window, "Location", "ID" and "Customer Full Name" moved 30 to 55 px to the left and "Due Date" about 125 px and "Amount" about 86 px to the right on Expand all, and every column jumped back on Collapse all). Production already does this on A/R Detail. This is a known problem and it is already reported — see https://shopview.atlassian.net/browse/SV-12763 (filed 13 Nov 2026, after Demo Day).
· If you see exactly that, mark this test FAILED and do not raise anything new.
· If it fails in a DIFFERENT way from what is described above, that is a NEW problem — please report it.
· If it PASSES, the fix has shipped: report it so the ticket can be closed and this note removed.
Exact quotes from the source (for reproducibility)
From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 13 (Change Log: version 12 on 12 Nov 2026 by Milos Vasic, version 13 on 13 Nov 2026 by Chris Ward), read 13 Nov 2026 · Epic SV-11315, story SV-11534 (Story 4, Collapse all, Expand all and pinned group rows)
- S4-R5 (version 13): “Each group's own expand toggle uses the same chevron: pointing down when open, right when closed. Behavior is unchanged.”
- S4-R1 (version 13): “The table's top-left header cell holds one chevron button. While any group is expanded it points down, its tooltip (above the button) reads "Collapse all", and a click collapses every group. When every group is collapsed it points right, its tooltip reads "Expand all", and a click expands every group. The chevron is blue, the same as each group's own chevron (S4-R5).”
From: Slack, Chris Ward (product owner), 13 Nov 2026, thread in channel C0C454MLP0T, read 13 Nov 2026
- Slack, Chris Ward, Picture #2 + #3: “Picture #2 + #3 — for the reports with chevrons, the tables jump around when they expand/collapse. would be great if they wouldn’t (though unsure how possible).”
Not yet checked against a build: the QA build v26.45.2-6a8b89c exists since 10 Nov 2026 and this case has not been run on it yet.

References from Design
Design canvas "A/R and A/P Report Sorting" (https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4), version of 5 Nov 2026 (1793886208-34e0), read 10 Nov 2026: page 1 "Opening order and header sorting" (board Main.dc.html); page 3 "Collapse all and pinned group rows" (board Grouped.dc.html); page 6 "Descriptions and pinned column" (board Layout.dc.html). The design draws this report's groups collapsed and expanded in separate pictures; on A/P Detail its own pictures already place "Vendor Name" at different points (about 762 px collapsed, 800 px expanded, measured 13 Nov 2026), so the design does not settle this. The expected results come from Chris Ward's Slack post quoted above; the point is listed for the product owner.
Design pictures attached to this case:
- ar-ap-p3-expand-all-from-the-header.png: figure "Expand all from the header" (This build (after)), board "3. Collapse all, Expand all and pinned group rows"
- ar-ap-p6-open-balance-pinned-light.png: figure "Open Balance pinned, light" (This build (after)), board "6. Report descriptions and the pinned headline column"
- ar-ap-p1-a-p-aging-detail-opens-by-vendor-name.png: figure "A/P Aging Detail opens by vendor name" (This build (after)), board "1. Opening order and header sorting"
- ar-ap-p7-a-r-collection-date-and-customer-only.png: figure "A/R Collection, groups opened one by one" (Production (before)), board "3. Collapse all, Expand all and pinned group rows" (today's look, for comparison only)
The design's own words:
- "One chevron in the top-left header cell: "Collapse all" while any group is open, "Expand all" when none is. Group toggles use the same chevron. S4-R1 to S4-R5, S4-R8." (caption of "Expand all from the header")
- "The headline column (Open Balance; Total on the Summaries) is bold and pinned right; the group label stays at the left. S8-R3, S8-R4, S4-R7." (caption of "Open Balance pinned, light")
- "Buckets stay in fixed order; rows inside each bucket go by vendor name (was most overdue first). S1-R5, S2-R4, S2-R5." (caption of "A/P Aging Detail opens by vendor name")
- "Each customer opens with its own arrow; there is no way to open or close them all." (caption of "A/R Collection, groups opened one by one")

AUTOMATION: READY - EXPECT FAIL (SV-12763)


---

### D-91 — Design: A/R Collection columns stay in place when groups open and close

Folder: Design — how it looks (section 90430) · Refs: SV-12763, SV-11534, PRD v13 S4-R1, S4-R5

Preconditions
- Sign in as an Admin user (the "Admin" role).
- Have at least two customers with overdue invoices on today's date, so the report lists at least two customer groups to open.
- Use a desktop browser window 1440 px wide, at 100% zoom.
- Open A/R Collection (Reports, then "A/R Aging Collection" under ACCOUNTS RECEIVABLE in the left menu).
- Leave every group collapsed (the chevron at the top left of the table points right).

**Steps**

1. Take a screenshot of the page, showing the column headings.
2. Click the chevron of the first customer's group.
3. Click the same group's chevron again.
4. Click the chevron at the top left of the table (Expand all).
5. Click the chevron at the top left of the table again (Collapse all).

Expected Result
Step 1:
- You have a picture of where each column heading sits while every group is collapsed.
Step 2:
- The group opens and shows its lines, each cell under its own heading.
- Every column heading is in the same place as in your screenshot: none has moved left or right.
Step 3:
- The group closes.
- Every column heading is in the same place as in your screenshot: none has moved left or right.
Step 4:
- Every group opens.
- Every column heading is in the same place as in your screenshot: none has moved left or right.
Step 5:
- Every group closes.
- Every column heading is in the same place as in your screenshot: none has moved left or right.

What you should see today: when a group opens or closes, and on Expand all and Collapse all, the column widths change, so the headings and lines jump sideways (on the ticket, in a 1536 px window, "ID" moved about 146 px and "Due Date" about 167 px to the left on Expand all, and every column jumped back on Collapse all). Production already does this on A/R Detail. This is a known problem and it is already reported — see https://shopview.atlassian.net/browse/SV-12763 (filed 13 Nov 2026, after Demo Day).
· If you see exactly that, mark this test FAILED and do not raise anything new.
· If it fails in a DIFFERENT way from what is described above, that is a NEW problem — please report it.
· If it PASSES, the fix has shipped: report it so the ticket can be closed and this note removed.
Exact quotes from the source (for reproducibility)
From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 13 (Change Log: version 12 on 12 Nov 2026 by Milos Vasic, version 13 on 13 Nov 2026 by Chris Ward), read 13 Nov 2026 · Epic SV-11315, story SV-11534 (Story 4, Collapse all, Expand all and pinned group rows)
- S4-R5 (version 13): “Each group's own expand toggle uses the same chevron: pointing down when open, right when closed. Behavior is unchanged.”
- S4-R1 (version 13): “The table's top-left header cell holds one chevron button. While any group is expanded it points down, its tooltip (above the button) reads "Collapse all", and a click collapses every group. When every group is collapsed it points right, its tooltip reads "Expand all", and a click expands every group. The chevron is blue, the same as each group's own chevron (S4-R5).”
From: Slack, Chris Ward (product owner), 13 Nov 2026, thread in channel C0C454MLP0T, read 13 Nov 2026
- Slack, Chris Ward, Picture #2 + #3: “Picture #2 + #3 — for the reports with chevrons, the tables jump around when they expand/collapse. would be great if they wouldn’t (though unsure how possible).”
Not yet checked against a build: the QA build v26.45.2-6a8b89c exists since 10 Nov 2026 and this case has not been run on it yet.

References from Design
Design canvas "A/R and A/P Report Sorting" (https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4), version of 5 Nov 2026 (1793886208-34e0), read 10 Nov 2026: page 3 "Collapse all and pinned group rows" (board Grouped.dc.html). The design draws this report's groups collapsed and expanded in separate pictures; on A/P Detail its own pictures already place "Vendor Name" at different points (about 762 px collapsed, 800 px expanded, measured 13 Nov 2026), so the design does not settle this. The expected results come from Chris Ward's Slack post quoted above; the point is listed for the product owner.
Design pictures attached to this case:
- ar-ap-p3-expand-all-from-the-header.png: figure "Expand all from the header" (This build (after)), board "3. Collapse all, Expand all and pinned group rows"
- ar-ap-p3-same-on-a-p-unpaid-invoices.png: figure "Same on A/P Unpaid Invoices" (This build (after)), board "3. Collapse all, Expand all and pinned group rows"
- ar-ap-p7-a-r-collection-date-and-customer-only.png: figure "A/R Collection, groups opened one by one" (Production (before)), board "3. Collapse all, Expand all and pinned group rows" (today's look, for comparison only)
The design's own words:
- "One chevron in the top-left header cell: "Collapse all" while any group is open, "Expand all" when none is. Group toggles use the same chevron. S4-R1 to S4-R5, S4-R8." (caption of "Expand all from the header")
- "Vendor rows pin the same way; re-sorting never collapses an open group. S4-R6, S2-R9." (caption of "Same on A/P Unpaid Invoices")
- "Each customer opens with its own arrow; there is no way to open or close them all." (caption of "A/R Collection, groups opened one by one")

AUTOMATION: READY - EXPECT FAIL (SV-12763)


---

### D-92 — Design: A/P Detail columns stay in place when buckets open and close

Folder: Design — how it looks (section 90430) · Refs: SV-12763, SV-11534, PRD v13 S4-R1, S4-R5

Preconditions
- Sign in as an Admin user (the "Admin" role).
- Have unpaid bills dated on different days so that at least two aging buckets of A/P Detail have lines, so there are groups to open.
- Use a desktop browser window 1440 px wide, at 100% zoom.
- Open A/P Detail (Reports, then "A/P Aging Detail" under ACCOUNTS PAYABLE in the left menu).
- Leave every bucket collapsed (the chevron at the top left of the table points right).

**Steps**

1. Take a screenshot of the page, showing the column headings.
2. Click the chevron of the first bucket that has lines.
3. Click the same bucket's chevron again.
4. Click the chevron at the top left of the table (Expand all).
5. Click the chevron at the top left of the table again (Collapse all).

Expected Result
Step 1:
- You have a picture of where each column heading sits while every bucket is collapsed.
Step 2:
- The bucket opens and shows its lines, each cell under its own heading.
- Every column heading is in the same place as in your screenshot: none has moved left or right.
Step 3:
- The bucket closes.
- Every column heading is in the same place as in your screenshot: none has moved left or right.
Step 4:
- Every bucket opens.
- Every column heading is in the same place as in your screenshot: none has moved left or right.
Step 5:
- Every bucket closes.
- Every column heading is in the same place as in your screenshot: none has moved left or right.

What you should see today: when a bucket opens or closes, and on Expand all and Collapse all, the column widths change, so the headings and lines jump sideways (on the ticket, in a 1536 px window, "Vendor Name" moved about 57 px, "Due Date" about 123 px and "Past Due" about 96 px to the right on Expand all, and every column jumped back on Collapse all). Production already does this on A/R Detail. This is a known problem and it is already reported — see https://shopview.atlassian.net/browse/SV-12763 (filed 13 Nov 2026, after Demo Day).
· If you see exactly that, mark this test FAILED and do not raise anything new.
· If it fails in a DIFFERENT way from what is described above, that is a NEW problem — please report it.
· If it PASSES, the fix has shipped: report it so the ticket can be closed and this note removed.
Exact quotes from the source (for reproducibility)
From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 13 (Change Log: version 12 on 12 Nov 2026 by Milos Vasic, version 13 on 13 Nov 2026 by Chris Ward), read 13 Nov 2026 · Epic SV-11315, story SV-11534 (Story 4, Collapse all, Expand all and pinned group rows)
- S4-R5 (version 13): “Each group's own expand toggle uses the same chevron: pointing down when open, right when closed. Behavior is unchanged.”
- S4-R1 (version 13): “The table's top-left header cell holds one chevron button. While any group is expanded it points down, its tooltip (above the button) reads "Collapse all", and a click collapses every group. When every group is collapsed it points right, its tooltip reads "Expand all", and a click expands every group. The chevron is blue, the same as each group's own chevron (S4-R5).”
From: Slack, Chris Ward (product owner), 13 Nov 2026, thread in channel C0C454MLP0T, read 13 Nov 2026
- Slack, Chris Ward, Picture #2 + #3: “Picture #2 + #3 — for the reports with chevrons, the tables jump around when they expand/collapse. would be great if they wouldn’t (though unsure how possible).”
Not yet checked against a build: the QA build v26.45.2-6a8b89c exists since 10 Nov 2026 and this case has not been run on it yet.

References from Design
Design canvas "A/R and A/P Report Sorting" (https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4), version of 5 Nov 2026 (1793886208-34e0), read 10 Nov 2026: page 1 "Opening order and header sorting" (board Main.dc.html); page 3 "Collapse all and pinned group rows" (board Grouped.dc.html); page 6 "Descriptions and pinned column" (board Layout.dc.html). The design draws this report's groups collapsed and expanded in separate pictures; on A/P Detail its own pictures already place "Vendor Name" at different points (about 762 px collapsed, 800 px expanded, measured 13 Nov 2026), so the design does not settle this. The expected results come from Chris Ward's Slack post quoted above; the point is listed for the product owner.
Design pictures attached to this case:
- ar-ap-p3-expand-all-from-the-header.png: figure "Expand all from the header" (This build (after)), board "3. Collapse all, Expand all and pinned group rows"
- ar-ap-p6-open-balance-pinned-light.png: figure "Open Balance pinned, light" (This build (after)), board "6. Report descriptions and the pinned headline column"
- ar-ap-p1-a-p-aging-detail-opens-by-vendor-name.png: figure "A/P Aging Detail opens by vendor name" (This build (after)), board "1. Opening order and header sorting"
- ar-ap-p7-a-r-collection-date-and-customer-only.png: figure "A/R Collection, groups opened one by one" (Production (before)), board "3. Collapse all, Expand all and pinned group rows" (today's look, for comparison only)
The design's own words:
- "One chevron in the top-left header cell: "Collapse all" while any group is open, "Expand all" when none is. Group toggles use the same chevron. S4-R1 to S4-R5, S4-R8." (caption of "Expand all from the header")
- "The headline column (Open Balance; Total on the Summaries) is bold and pinned right; the group label stays at the left. S8-R3, S8-R4, S4-R7." (caption of "Open Balance pinned, light")
- "Buckets stay in fixed order; rows inside each bucket go by vendor name (was most overdue first). S1-R5, S2-R4, S2-R5." (caption of "A/P Aging Detail opens by vendor name")
- "Each customer opens with its own arrow; there is no way to open or close them all." (caption of "A/R Collection, groups opened one by one")

AUTOMATION: READY - EXPECT FAIL (SV-12763)


---

### D-93 — Design: A/P Unpaid Invoices columns stay in place when groups open and close

Folder: Design — how it looks (section 90430) · Refs: SV-12763, SV-11534, PRD v13 S4-R1, S4-R5

Preconditions
- Sign in as an Admin user (the "Admin" role).
- Have at least two vendors with unpaid bills on today's date, so the report lists at least two vendor groups to open.
- Use a desktop browser window 1440 px wide, at 100% zoom.
- Open A/P Unpaid Invoices (Reports, then "A/P Unpaid Invoices" under ACCOUNTS PAYABLE in the left menu; the page title reads "A/P Unpaid Invoices Report").
- Leave every group collapsed (the chevron at the top left of the table points right).

**Steps**

1. Take a screenshot of the page, showing the column headings.
2. Click the chevron of the first vendor's group.
3. Click the same group's chevron again.
4. Click the chevron at the top left of the table (Expand all).
5. Click the chevron at the top left of the table again (Collapse all).

Expected Result
Step 1:
- You have a picture of where each column heading sits while every group is collapsed.
Step 2:
- The group opens and shows its lines, each cell under its own heading.
- Every column heading is in the same place as in your screenshot: none has moved left or right.
Step 3:
- The group closes.
- Every column heading is in the same place as in your screenshot: none has moved left or right.
Step 4:
- Every group opens.
- Every column heading is in the same place as in your screenshot: none has moved left or right.
Step 5:
- Every group closes.
- Every column heading is in the same place as in your screenshot: none has moved left or right.

What you should see today: when a group opens or closes, and on Expand all and Collapse all, the column widths change, so the headings and lines jump sideways (on the ticket, in a 1536 px window, "Vendor Name" moved about 42 px, "Due Date" about 140 px and "Past Due" about 110 px to the right on Expand all, and every column jumped back on Collapse all). Production already does this on A/R Detail. This is a known problem and it is already reported — see https://shopview.atlassian.net/browse/SV-12763 (filed 13 Nov 2026, after Demo Day).
· If you see exactly that, mark this test FAILED and do not raise anything new.
· If it fails in a DIFFERENT way from what is described above, that is a NEW problem — please report it.
· If it PASSES, the fix has shipped: report it so the ticket can be closed and this note removed.
Exact quotes from the source (for reproducibility)
From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 13 (Change Log: version 12 on 12 Nov 2026 by Milos Vasic, version 13 on 13 Nov 2026 by Chris Ward), read 13 Nov 2026 · Epic SV-11315, story SV-11534 (Story 4, Collapse all, Expand all and pinned group rows)
- S4-R5 (version 13): “Each group's own expand toggle uses the same chevron: pointing down when open, right when closed. Behavior is unchanged.”
- S4-R1 (version 13): “The table's top-left header cell holds one chevron button. While any group is expanded it points down, its tooltip (above the button) reads "Collapse all", and a click collapses every group. When every group is collapsed it points right, its tooltip reads "Expand all", and a click expands every group. The chevron is blue, the same as each group's own chevron (S4-R5).”
From: Slack, Chris Ward (product owner), 13 Nov 2026, thread in channel C0C454MLP0T, read 13 Nov 2026
- Slack, Chris Ward, Picture #2 + #3: “Picture #2 + #3 — for the reports with chevrons, the tables jump around when they expand/collapse. would be great if they wouldn’t (though unsure how possible).”
Not yet checked against a build: the QA build v26.45.2-6a8b89c exists since 10 Nov 2026 and this case has not been run on it yet.

References from Design
Design canvas "A/R and A/P Report Sorting" (https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4), version of 5 Nov 2026 (1793886208-34e0), read 10 Nov 2026: page 3 "Collapse all and pinned group rows" (board Grouped.dc.html). The design draws this report's groups collapsed and expanded in separate pictures; on A/P Detail its own pictures already place "Vendor Name" at different points (about 762 px collapsed, 800 px expanded, measured 13 Nov 2026), so the design does not settle this. The expected results come from Chris Ward's Slack post quoted above; the point is listed for the product owner.
Design pictures attached to this case:
- ar-ap-p3-expand-all-from-the-header.png: figure "Expand all from the header" (This build (after)), board "3. Collapse all, Expand all and pinned group rows"
- ar-ap-p3-same-on-a-p-unpaid-invoices.png: figure "Same on A/P Unpaid Invoices" (This build (after)), board "3. Collapse all, Expand all and pinned group rows"
- ar-ap-p7-a-r-collection-date-and-customer-only.png: figure "A/R Collection, groups opened one by one" (Production (before)), board "3. Collapse all, Expand all and pinned group rows" (today's look, for comparison only)
The design's own words:
- "One chevron in the top-left header cell: "Collapse all" while any group is open, "Expand all" when none is. Group toggles use the same chevron. S4-R1 to S4-R5, S4-R8." (caption of "Expand all from the header")
- "Vendor rows pin the same way; re-sorting never collapses an open group. S4-R6, S2-R9." (caption of "Same on A/P Unpaid Invoices")
- "Each customer opens with its own arrow; there is no way to open or close them all." (caption of "A/R Collection, groups opened one by one")

AUTOMATION: READY - EXPECT FAIL (SV-12763)


---

### D-94 — Design: A/R Detail columns stay in place while more lines load

Folder: Design — how it looks (section 90430) · Refs: SV-12763, SV-11534, PRD v13 S4-R4

Preconditions
- Sign in as an Admin user (the "Admin" role).
- Have a bucket in A/R Detail, bucket A, with more than 100 lines on today's date, so its later lines load as you scroll.
- Use a desktop browser window 1440 px wide, at 100% zoom.
- Open A/R Detail (Reports, then "A/R Aging Detail" under ACCOUNTS RECEIVABLE in the left menu).

**Steps**

1. Expand bucket A.
2. Take a screenshot of the page, showing the column headings.
3. Scroll down past bucket A's 100th line until more lines load.

Expected Result
Step 1:
- Bucket A opens with its first 100 lines.
Step 2:
- You have a picture of where each column heading sits with the first 100 lines shown.
Step 3:
- More lines load under the first 100.
- Every column heading is in the same place as in your screenshot: none has moved left or right.

Held: the product owner's post speaks of the tables moving when groups expand or collapse; it does not mention lines loading while scrolling, and no other source does. The question is with the product owner; until it is answered, do not run this test.
Exact quotes from the source (for reproducibility)
From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 13 (Change Log: version 12 on 12 Nov 2026 by Milos Vasic, version 13 on 13 Nov 2026 by Chris Ward), read 13 Nov 2026 · Epic SV-11315, story SV-11534 (Story 4, Collapse all, Expand all and pinned group rows)
- S4-R4 (version 13): “On A/R Detail and A/P Detail, expanding a bucket (by hand or with Expand all) shows its first 100 lines, then loads more as the user scrolls. This is as today on A/P Detail and new on A/R Detail, which today shows a whole bucket at once.”
From: Slack, Chris Ward (product owner), 13 Nov 2026, thread in channel C0C454MLP0T, read 13 Nov 2026
- Slack, Chris Ward, Picture #2 + #3: “Picture #2 + #3 — for the reports with chevrons, the tables jump around when they expand/collapse. would be great if they wouldn’t (though unsure how possible).”
Not yet checked against a build: the QA build v26.45.2-6a8b89c exists since 10 Nov 2026 and this case has not been run on it yet.

References from Design
Design canvas "A/R and A/P Report Sorting" (https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4), version of 5 Nov 2026 (1793886208-34e0), read 10 Nov 2026: page 3 "Collapse all and pinned group rows" (board Grouped.dc.html). The design draws no picture of lines loading while scrolling. No source sentence says whether the columns may move while more lines load; this case is held until the product owner answers.
Design pictures attached to this case:
- ar-ap-p3-expand-all-from-the-header.png: figure "Expand all from the header" (This build (after)), board "3. Collapse all, Expand all and pinned group rows"
- ar-ap-p3-the-customer-row-stays-pinned.png: figure "The customer row stays pinned" (This build (after)), board "3. Collapse all, Expand all and pinned group rows"
The design's own words:
- "One chevron in the top-left header cell: "Collapse all" while any group is open, "Expand all" when none is. Group toggles use the same chevron. S4-R1 to S4-R5, S4-R8." (caption of "Expand all from the header")
- "While scrolling a group, its row stays under the column headings; the next group's row pushes it up and off. S4-R6. Known build bug: invoices on the same date show in time-of-day order here; the PRD puts them in invoice-number order (S1-R6)." (caption of "The customer row stays pinned")

AUTOMATION: HOLD - waiting on the PO (columns moving while more lines load)


---

### D-95 — Design: A/R Collection PDF wraps a long no-space name in its Total row

Folder: Design — how it looks (section 90430) · Refs: SV-11533, PRD v13 S3-R7b, SV-12764

Preconditions
- Sign in as an Admin user (the "Admin" role).
- Create, for this test, a customer, customer A, whose name is 120 letters long with no spaces, and give them an invoice that is overdue on today's date.
- Use a desktop browser window 1440 px wide, at 100% zoom.
- Open A/R Collection (Reports, then "A/R Aging Collection" under ACCOUNTS RECEIVABLE in the left menu).
- Leave the report with only customer A ticked in the Customer filter.

**Steps**

1. Click the ⋯ Export button ("Export report") at the right of the title row.
2. Click "Download (PDF)".
3. Open the downloaded PDF.

Expected Result
Step 1:
- The menu shows "Download (PDF)" and "Download (CSV)".
Step 2:
- A PDF file downloads.
Step 3:
- Customer A's group ends with a row that reads "Total for " followed by customer A's name, with its Amount and Open Balance.
- Customer A's name wraps inside that row: no part of it runs over the Amount or Open Balance figures or off the edge of the page.
- The word "Subtotal" appears nowhere in the PDF.

Exact quotes from the source (for reproducibility)
From: PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 13 (Change Log: version 12 on 12 Nov 2026 by Milos Vasic, version 13 on 13 Nov 2026 by Chris Ward), read 13 Nov 2026 · Epic SV-11315, story SV-11533 (Story 3, Export to PDF and CSV)
- S3-R1 (version 13): “Each of the six reports has the native report Export menu (the ⋯ button at the right of the title row, labelled "Export report") with "Download (PDF)" and "Download (CSV)". A/R's former Print button is replaced by this menu. The A/P reports gain a PDF.”
- S3-R7b (version 13): “In the A/R Detail, A/R Collection, A/P Detail and A/P Unpaid Invoices PDFs, each bucket, customer or vendor ends with a row that reads "Total for <name>", the same words as the screen, for example "Total for 31-60 days past due" or "Total for Acme Towing", with its Amount and Open Balance. A long name wraps inside that row. The PDF never prints "Subtotal".”
Not yet checked against a build: the QA build v26.45.2-6a8b89c exists since 10 Nov 2026 and this case has not been run on it yet.

References from Design
Design canvas "A/R and A/P Report Sorting" (https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4), version of 5 Nov 2026 (1793886208-34e0), read 10 Nov 2026: page 2 "Export" (board Export.dc.html). The design pictures the Export menu used in steps 1 and 2, but no PDF file (all 7 boards checked); the PDF results follow the PRD.
Design pictures attached to this case:
- ar-ap-p2-export-menu-pdf-and-csv.png: figure "Export menu: PDF and CSV" (This build (after)), board "2. Export"
- ar-ap-p2-a-p-gets-the-same-menu.png: figure "A/P gets the same menu" (This build (after)), board "2. Export"
- ar-ap-p2-a-p-no-export-at-all.png: figure "A/P: no export at all" (Production (before)), board "2. Export" (today's look, for comparison only)
The design's own words:
- "The native ⋯ Export menu on all six reports. Files hold exactly the rows on screen, in screen order, with the as-of date and locations, then Past due and the customer or vendor when chosen. S3-R1 to S3-R8, S3-R8a." (caption of "Export menu: PDF and CSV")
- "A/P Summary, Detail and Unpaid Invoices now export PDF and CSV. S3-R1." (caption of "A/P gets the same menu")
- "The A/P reports have no print, PDF or CSV." (caption of "A/P: no export at all")

AUTOMATION: Not available on Build to test Yet - Last checked 11/13/2026


---

