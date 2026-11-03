# Parts Lifecycle — build verification on QA site sv10647, 3 Nov 2026

| Item | Value |
|---|---|
| Suite | TestRail group 20439 "Part Lifecycle" (suite 1, Founder Mode, September 2026): 576 cases, 363 ours (user 3), 213 Mudassir Qamar's (user 6) |
| Build | https://sv10647.qa.shopview.com, marker v26.43.4-999c51d; calls sv10647api.qa.shopview.com |
| Product code (Rule 117) | ShopView/shopview `SV-10647-parts-lifecycle` at 999c51dca70f (= marker), worktree /home/user/shopview-sv10647, finding aid only |
| Sources (Rule 81) | QA lead: "Without re-checking". PRD Confluence 829227015 v35 (27 Oct; still v35 on 3 Nov); tickets 27 Oct; design 13 Oct copy |

## QA lead's rulings, 3 Nov 2026
- Mudassir's 213: "Ours now, his read-only" → `MUDASSIR-213-READ-ONLY-2026-11-03.md` (nothing written).
- C425662, C425725, C425726 (edited by Mudassir on 2 Nov): "Leave those 3 alone" → untouched.
- Hard data states: "You are not supposed to create a state in the QA branch … the Preconditions can simply state what is needed, NOT how
  it can be created"; then "Keep the automation as READY … the preconditions should simply tell the state needed to test this particular
  test case, its the responsibility of the tester to create that state … related to that ONE test case."

## What was written (write-log.txt; every write read back verify=OK)
- 360 cases: build line + `AUTOMATION: READY` (apply.py batch 1, then apply2.py; the "How to set this up on the QA site" lists that
  apply.py added were removed again by apply2.py per the ruling).
- Wording fixed to the build (all seen on sv10647, probes 01-12): inventory import route (IMPORTS → Inventory, page "Inventory Import
  Preview"); import steps Select CSV File / Submit File; "+ Add Part, then click More options" in 14 lookup cases whose expected result
  says the New Part Request window opens (on this build + Add Part opens a row in the line); routes added to start lines and bare
  "Open X." steps (72); search and filter steps (20).
- 52 cases: build line says "Partly checked … not yet seen on that build: …" (apply7.py, unseen-screens.json): the Part History page (27;
  the sign-in expired before it could be opened), inside a purchase order / Receive (13), canned job (6), Issue Credit / vendor credit (5),
  delete confirmation (2).

## Checks
- check_tester_runnable: 358/360; C154763 and C540882 flagged "asserts a start state but names no UI setup route": that is the QA lead's
  ruling (state only), conflicts with Rule 115 (iii) → raised with him.
- check_runnable_cases: 358/360; C425778, C425779 (Part History search) wait on the Part History walk.
- On-screen display: 360/360 fr-view (served-360.json) + 87/87 after the later edits (served-recheck.json).

## Left on sv10647 (ZZAUTOTEST)
Parts ZZAUTOTEST-PLBV-A (inactive) and ZZAUTOTEST-PLBV-B (active), General Storage. No work order or role was saved.

## Follow-up, 3 Nov 2026 afternoon (fresh sign-in; QA lead's answers)
- Rulings: the state-only setup is for this suite only, and Rule 115 amendment 3 is recorded (ask who owns the testing before adding setup
  clicks); Mudassir's tests are left as they are; throwaway data on this dummy branch is not a concern; the What/Why question is to be asked
  again after one week (a scheduled reminder fires on 10 Nov); the 70 hard tests go in their own folder.
- Probes 14-16 (read-only): Part History page (Part details, Part History, Search, Staff/Date/Time/Event); purchase order page and Receive
  screen (Vendor Invoice #, Invoice Date, Qty received, button "Receive Parts (1)"); New Line window (Title, Description, Save & Close) with
  the canned-line list; invoice three-dot menu (Reverse, Issue Credit) and the Issue Credit window (Parts are being returned, Parts to
  return, Cancel); Credits tab with Create Credit (Part Number, Add Part, Post Credit).
- apply8.py: full build line restored on 48 of the 52 partly-checked tests; Receive step reworded to the Receive Parts button. Still partly
  checked: C154833, C847731 (delete confirmation: no Part Library entry allows Delete, and making one is a state) and C425727, C425741 (the
  button that adds a line to a purchase order is not on the purchase order page).
- C425778, C425779: Part History search step now says to click Search first; runnable check 2/2.
- New section S114049 "Setup needed before testing" under Part Lifecycle; the 70 hard tests moved there (70/70 read back); their original
  story sections are in hard-move-origin.json.

## Setup clicks for the "Setup needed before testing" folder, 3 Nov 2026 evening
- QA lead: "Do the build verification and correct them and recheck other test cases in the same folder setup needed before testing and add
  the clicks/steps for those tests but make sure each click/step should be related to that particular test case only."
- Walked with throwaway data on the dummy branch (probes 17-27): New PO and Add Order Item windows (shown only on a purchase order with no work
  order); Delete Part (deletes at once, no confirmation, as the code notes for S13-R26) and the Part Library delete Confirmation ("Are you sure
  you want to delete this library part?", Cancel / Delete); New Work Order (Customer and Asset needed) and the New Line window (Title, Labor
  Rate, Line Approved, Save & Close); a part added from stock; the line menu (Request part, Save as canned line → New Canned Line: Line Title,
  Save As Canned Line); New Part Request with "Add new special order part"; Create Return → Save Return → Receive Credit → Process Return →
  Post Credit; New Vendor; New Location.
- setup-pass/clicks.py + apply_setup.py: 72 tests (the 70 + C154833, C847731) get "How to do it:" clicks under each setup line they build,
  with that test's own names (ZZAUTOTEST-PL-C<id>-<letter>), quantities, prices, bins and vendors. 72/72 verify=OK.
- C425727, C425741: step now "Click Add Order Item."; build line full. C154833, C847731: build line full.
- Still partly checked (named in each test's build line): special-order ordering/receiving (C425624, C573672, C573673, C573674), ordering a
  part request (C425751), a part-row fee (C425732), which bin a work order line takes from (C425660, C425664, C425665, C425666), a record
  from before this release of the kind needed (C154778, C425625, C425626, C425679, C425680, C540879, C573683, C839426), the vendor-bill line
  part control (C425728).
- Checks on the 72: runnable 72/72; display 72/72 fr-view; tester-runnable flagged C425730, C425731, C573684 only because the checker knew
  "top menu" but not "top bar" → `check_tester_runnable.py` HAS_ROUTE now also accepts "top bar" (one alternative added; rerun on all 360).
- Tester-runnable on all 360 after the change: 359/360; only C540882 (outside the folder, state-only by the QA lead's ruling).

## Rule 119 layout, 3 Nov 2026 late (QA lead: "always keep the preconditions and setup section separate, and the setup should also be easiest to understand")
- Rule 119 recorded (every line of a case serves that one test; Preconditions and a separate, plain Setup).
- setup-pass/clicks2.py + apply_setup2.py: in the 72 tests the "How to do it" text was taken out of the Preconditions (result checked equal to
  the preconditions before the clicks pass, live-before.json) and a separate "Setup" section added after them: a numbered list in the order
  the tester works (vendors and locations first), one item per thing to make, "<what it makes>: <clicks>", part fields as "Field: value".
  72/72 verify=OK. Checks: tester-runnable PASS, runnable 72/72, display 72/72 fr-view.

## Runnable-only, 3 Nov 2026 late (QA lead: "any test which is not runnable/executable should not be the part of this testing suite")
- Read-only census of this site's data (runnable-pass/p29, p30; on-screen confirmation p31) for the tests that need records from before this
  release. Found and confirmed on screen: two Part Library entries numbered 615144 (RF axle nut, LF axle nut); TK52-67-5Y0H BCM Rear (empty
  Manufacturer, Total parts 0); 68157291AA Fuel filter (no Category); 21-361 Reverse Switch (Total parts 0); W3030T in Inventory Value on
  10/20/2026 (Qty 24.00, Total Cost $688.08). → C154778, C154831, C573683, C839426, C425658: Setup names the record; C154778, C573683,
  C839426 build line full (apply_runnable.py).
- Not runnable by hand on this site → marker "AUTOMATION: HOLD - not manually testable on the QA site: <reason>" and moved to new section
  S114050 "Parts Lifecycle – not runnable by a manual tester" under Founder Mode (S20434): C425625 (needs a role screenshot taken before
  the release; no custom role from before it), C425626 (no role or part from before the release named with Catalog), C540879 (no part from
  before the release with bins of 5 and -2 at $10.00). Origins: runnable-pass/moved-out-origin.json.
- Checks on the 8: runnable 8/8, tester-runnable PASS, display 8/8 fr-view. The checker's "top bar" wording stays (QA lead: keep what makes
  the test runnable).
