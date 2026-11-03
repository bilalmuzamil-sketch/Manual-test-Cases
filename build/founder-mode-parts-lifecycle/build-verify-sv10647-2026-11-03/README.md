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
