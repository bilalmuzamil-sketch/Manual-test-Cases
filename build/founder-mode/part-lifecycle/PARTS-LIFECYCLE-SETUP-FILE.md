# Parts Lifecycle — setup file for Claude sessions (a tester does not need it)

Built by `authoring/render_setup.py` from the case library (73 cases written so far). Sources: PRD "Parts Lifecycle Update", Confluence 829227015, version 33 (23 Oct 2026, owner Chris Ward), read 27 Oct 2026; tech plan of 7 Oct 2026; Jira epic SV-10647 read 27 Oct 2026; design canvas https://claude.ai/artifact/Vz6rprcWyP16tYxzM1kdeE (13 Oct copy, unchanged 27 Oct).
No environment address, credential, cookie or session data is written here.

## 1 · Accounts and places (slots)
| Slot | What it is | Notes |
|---|---|---|
| Admin at the test location | the QA build's Admin user | Admin holds Part Library & Inventory View / Create & Edit / Delete and sees financial data (PRD S8-R14: by default Admin, Service Manager and Parts Manager see the Delete-gated controls). |
| location B | a second location the same Admin can pick in the location selector (top right) | Stories 1, 11, 13 (other-location messages and history). |
| the test location | the location the session signs in at | every case. |
| a location with no inactive parts | a newly created location | S1-09 only. |

## 2 · Shared recipes (screens first; every value below is an example)
- **Part names.** Each case owns its records: part numbers `ZZAUTOTEST-PL-<case key>-A`, `-B`, ... (for example ZZAUTOTEST-PL-S2-06-A) and
  descriptions `ZZAUTOTEST PL <case key> PART A`. "Give parts A and B part numbers that start with the same text" = this shared prefix.
- **Create a part (screen).** Parts → Inventory → New Inventory Part → Description, Part Number, Category (required), Cost (required),
  leave "Track quantities and cost of goods" on (tracked) or click it off (untracked) → bin row: the location's default bin, Quantity →
  Save. A Core Charge above 0 gives the part a core ("Core for <description>").
- **Set a part inactive (screen).** Open the part → Part Status → Inactive → Save → Deactivate in "Deactivate part?" (Story 13), or bulk:
  ⋮ → Deactivate parts → tick → Deactivate → Deactivate.
- **Many parts (35 or 201).** Parts CSV import (Settings → Data Import → Inventory) with one row per part (template columns: name,
  part_number, uom, quantity, min_qty, max_qty, grid_location, purchase_price, core_price, vendor, manufacturer, category, tags; example
  file `po-answers-2026-10-09/inventory-import-no-bin-example.csv`). For 201 inactive parts: import, then bulk-deactivate 200 + 1.
- **A part with stock in two bins.** Add Bin Location in the part window → pick a second bin → Quantity.
- **An untracked part saved with no Default bin (S5-05).** Product answer 5 of 14 Oct: save an untracked part with bins and none marked
  default, then turn tracking on.
- **A deleted default bin (S5-16).** Product answer 5 of 14 Oct: delete, in Bin Locations (Settings on screen; the PRD says
  Administration, question Q6), the bin location that is the part's default while the part holds 0 there.
- **A bin below zero.** QA lead's answer of 9 Oct (situation 1): order an inventory part with bin quantity 0 on a work order line.
- **A part from before the release / a date before the release.** Any part whose Part History has entries older than the day the Part
  Lifecycle build reached the environment; the Inventory Value report saves a figure per day (tech plan D6), so any date before that day.
- **Two browser tabs.** Same address, same user; the second tab changes a part so the first tab's bulk change fails for it.
- **Screen reader.** Narrator (Windows, Ctrl + Windows key + Enter) or VoiceOver (Mac, Command + F5).
- **Theme.** Avatar at the top right → Light / Dark.
- **Global search.** On by default for every account, QA branches included (QA lead, 9 Oct, situation 3).
- **Core's own Part History page.** Not known yet (question Q1); S5-18 is held on it.

## 3 · Traps
- The design canvas boards are build screenshots on Staging Heavy Duty data: never use their record names as test data.
- The Inventory list loads 30 rows at a time (S2-R6): the header checkbox ticks only loaded rows; scroll to load more.
- Export downloads a file; "Empty export" when nothing matches (S1-R9b).
- A cycle count drops typed counts when the tab changes (S1-E1): save the count first if it should stay.

## 4 · One recipe per case

### S1-01 · C154752 · Inventory opens on the Active tab, with the Inactive tab beside it
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an active part, part A, at the test location.
- Start on any page other than Inventory, so you can watch the Inventory page open.
Example values: part A = ZZAUTOTEST-PL-S1-01-A.
- Part A: any active part at the location, e.g. a ZZAUTOTEST part created for this case.
- Labels to confirm on the build: tab names Active / Inactive, title Inventory.
Quotes: S1-R1, S1-R2, S1-R3, S1-R4, S1-R8. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S1-02 · C154753 · Parts from before the release are active and tracked
State the tester sets up:
- Sign in as an Admin at the test location.
- Use three parts, part A, part B and part C, that were at the test location before this release was installed and that nobody has changed since.
- Use a part B that has stock on hand and a saved Min and Max, so its tracking can be seen in its window.
- Have an inactive part, part D, at the test location, so the Inactive tab has a part it must list.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S1-02-A; part B = ZZAUTOTEST-PL-S1-02-B; part C = ZZAUTOTEST-PL-S1-02-C; part D = ZZAUTOTEST-PL-S1-02-D.
- Parts A, B, C: any three parts created before the Part Lifecycle build reached the environment (check their Part History: no entry after the deploy date).
Quotes: S1-R5, S1-R5a, CN-S1-1, S13-R3, S13-R20, S4-R8. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S1-02b · new case (split from S1-02) · No setting turns part status or tracking on or off
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Start on the Settings page of the test location.
Quotes: S1-R5b. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S1-03 · C425585 · Each tab lists only the parts with that status at its location
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Create part A for this test at the test location only, and leave it active.
- Create part B for this test at both locations under the same part number, inactive at the test location and active at location B.
- Create part C for this test at location B only, and set it inactive there, so location B's Inactive tab has a part it must list.
- Give parts A, B and C part numbers that start with the same text, so one search lists all three.
- Start on the test location's Inventory page, on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S1-03-A; part B = ZZAUTOTEST-PL-S1-03-B; part C = ZZAUTOTEST-PL-S1-03-C.
Quotes: S1-R3, S1-R4, FO-2, KD-1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S1-04 · C425586 · Switching tabs ends bulk mode and clears the ticked rows
State the tester sets up:
- Sign in as an Admin at the test location.
- Have two active parts, part A and part B, and one inactive part, part C.
- Give parts A, B and C part numbers that start with the same text, so one search lists all three.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S1-04-A; part B = ZZAUTOTEST-PL-S1-04-B; part C = ZZAUTOTEST-PL-S1-04-C.
Quotes: S1-R6, S2-R16. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S1-05 · C425587 · Search, filters and sort work the same way on the Inactive tab
State the tester sets up:
- Sign in as an Admin at the test location.
- Have two active parts, part A in category A and part B in category B, so the category A filter leaves part B out.
- Have two inactive parts, part C in category A and part D in category B, so the category A filter leaves part D out.
- Give parts A, B, C and D part numbers that start with the same text, so one search lists them, and descriptions that run A to Z in the order part A, part B, part C, part D.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S1-05-A; part B = ZZAUTOTEST-PL-S1-05-B; part C = ZZAUTOTEST-PL-S1-05-C; part D = ZZAUTOTEST-PL-S1-05-D.
Quotes: S1-R7. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S1-06 · C425588 · Export from each tab holds only that tab's parts
State the tester sets up:
- Sign in as an Admin at the test location.
- Have two active parts, part A and part B, and one inactive part, part C.
- Give parts A, B and C part numbers that start with the same text, so one search lists all three.
- Use a computer that can open the exported file in a spreadsheet program.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S1-06-A; part B = ZZAUTOTEST-PL-S1-06-B; part C = ZZAUTOTEST-PL-S1-06-C.
Quotes: S1-R9, S1-R9b. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S1-07 · C425589 · Export shows Not Tracked for an untracked part and has no status column
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an active tracked part, part A, with 6 in its default bin.
- Have an active untracked part, part B, with 4 in its bin.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Use a computer that can open the exported file in a spreadsheet program.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S1-07-A; part B = ZZAUTOTEST-PL-S1-07-B.
Quotes: S1-R9a, S4-R8. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S1-08 · C425590 · Cycle count on the Inactive tab counts only the inactive parts
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an active tracked part, part A, with 5 in its bin.
- Have two inactive tracked parts, part B and part C, with 5 each.
- Give parts A, B and C part numbers that start with the same text, so one search lists all three.
- Make sure no Cycle count is running on the Inventory list.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S1-08-A; part B = ZZAUTOTEST-PL-S1-08-B; part C = ZZAUTOTEST-PL-S1-08-C.
Quotes: S1-R10. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S1-09 · C425591 · An empty Inactive tab says No inactive parts at this location.
State the tester sets up:
- Sign in as an Admin at a location that has no inactive parts at all, such as a newly created location.
- Create an active part, part A, at that location for this test.
- Start on that location's Inventory page, on the Active tab, with the Search box empty and Bin Location and Category set to All.
Example values: part A = ZZAUTOTEST-PL-S1-09-A.
Quotes: S1-N1, UFS-40, S13-R21, S13-R22. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S1-10 · C425592 · An Inactive tab emptied by a search shows the usual no-match result
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an inactive part, part A, in category A, so the category B filter leaves it out.
- Use a second category, category B, that part A is not in.
- Use a search text that matches no part at the test location, active or inactive.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S1-10-A.
Quotes: S1-N2, S1-N1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S1-11 · C573668 · Export holds every part the search matches, even rows not yet loaded
State the tester sets up:
- Sign in as an Admin at the test location.
- Create 35 active parts for this test whose part numbers start with the same text, so one search lists all 35.
- Have another active part, part A, whose part number does not start with that text.
- Use a computer that can open the exported file in a spreadsheet program.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S1-11-A.
Quotes: S1-R9b, S1-R9, S2-R6. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S1-12 · C573669 · Export follows the Category filter
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an active part, part A, in category A, and an active part, part B, in category B, so the category A filter leaves part B out.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Use a computer that can open the exported file in a spreadsheet program.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S1-12-A; part B = ZZAUTOTEST-PL-S1-12-B.
Quotes: S1-R9b. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S1-12b · new case (split from S1-12) · Export follows the Supply filter and leaves out an untracked part
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an active tracked part, part A, holding 1, with Min 5 and Max 10, so it is under-supplied.
- Have an active untracked part, part B, with 1 in its bin and a saved Min 5 and Max 10.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Use a computer that can open the exported file in a spreadsheet program.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S1-12b-A; part B = ZZAUTOTEST-PL-S1-12b-B.
Quotes: S1-R9b, S6-R10. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S1-13 · C573670 · Export with nothing matching shows Empty export and saves no file
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a search text that matches no part at the test location, active or inactive.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S1-R9b. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S1-14 · new case · Switching tabs during a cycle count drops the counts typed so far
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active tracked part, part A, for this test with 5 in its bin.
- Make sure no Cycle count is running on the Inventory list.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S1-14-A.
Quotes: S1-E1, S1-R10, SV-10814, Chris Ward, 23 Oct 2026. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-01 · C154754 · The actions menu offers Deactivate parts between Cycle count and Export
State the tester sets up:
- Sign in as an Admin at the test location.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S2-R1, S2-R2, S3-R1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-02 · C154755 · Outside bulk mode the list has no checkboxes and a row click opens the part
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an active part, part A, and an inactive part, part B.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Make sure bulk mode is off: no dark bar shows on the Inventory list.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S2-02-A; part B = ZZAUTOTEST-PL-S2-02-B.
Quotes: S2-R3, S2-N2, KD-9. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-03 · C154756 · In bulk mode a click anywhere on a row ticks it instead of opening it
State the tester sets up:
- Sign in as an Admin at the test location.
- Have two active parts, part A and part B.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S2-03-A; part B = ZZAUTOTEST-PL-S2-03-B.
Quotes: S2-R5. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-04 · C154757 · The bulk bar sits under the tabs and counts the ticked rows
State the tester sets up:
- Sign in as an Admin at the test location.
- Have two active parts, part A and part B.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S2-04-A; part B = ZZAUTOTEST-PL-S2-04-B.
Quotes: S2-R7, S2-R7b, S2-R9, TERM-5, §3 Technical Decisions, D24. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-05 · C154758 · Hovering the bulk bar's X shows Clear selection, also read aloud
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a computer with a screen reader you can turn on (Narrator on Windows, VoiceOver on a Mac).
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S2-R9. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-05b · new case (split from S2-05) · The X on the bulk bar leaves bulk mode and clears the ticks
State the tester sets up:
- Sign in as an Admin at the test location.
- Have two active parts, part A and part B.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S2-05b-A; part B = ZZAUTOTEST-PL-S2-05b-B.
Quotes: S2-R9a. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-06 · C154759 · Confirming Deactivate moves the ticked parts to the Inactive tab
State the tester sets up:
- Sign in as an Admin at the test location.
- Create three active parts for this test, part A, part B and part C.
- Give parts A, B and C part numbers that start with the same text, so one search lists all three.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S2-06-A; part B = ZZAUTOTEST-PL-S2-06-B; part C = ZZAUTOTEST-PL-S2-06-C.
Quotes: S2-R11, S2-R12, S2-R13, S2-R14, S10-R3, S10-R4, S10-R12, UFS-28. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-06b · new case (split from S2-06) · Deactivating one part says 1 part selected and 1 part updated
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S2-06b-A.
Quotes: S10-R4, UFS-28, S2-R12, S2-R14. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-07 · C154760 · When some parts fail, only the failed parts stay ticked
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two active parts for this test, part A and part B.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Use a desktop browser that can open a second tab on the same ShopView address, signed in as the same user.
- Start in browser tab 1 on the Inventory page, on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S2-07-A; part B = ZZAUTOTEST-PL-S2-07-B.
Quotes: S2-R15, CN-S2-1, S10-R13, S10-R13a, UFS-30, UFS-37. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-08 · C154762 · With nothing ticked Deactivate is disabled and its hover text says why
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S2-08-A.
Quotes: S2-R8, S2-N1, UFS-32. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-09 · C154763 · A part on an open work order can still be deactivated
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active tracked part, part A, for this test, with 5 in its bin.
- Create an open work order, work order 1, for this test, with a line that holds part A, quantity 1.
- Write down what part A's row on work order 1 shows: part number, description, quantity, price and total.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S2-09-A.
Quotes: S2-E1, S2-E2, S2-E3, S10-R14, S10-R16, S10-R17. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-10 · C425593 · Turning on Deactivate parts adds a checkbox column at the left edge
State the tester sets up:
- Sign in as an Admin at the test location.
- Have at least one active part at the test location.
- Make sure every column is switched on in the columns button.
- Use a desktop browser window about 1280 pixels wide, so the Inventory table scrolls sideways.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S2-R4. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-11 · C425594 · The header checkbox ticks only the rows loaded so far
State the tester sets up:
- Sign in as an Admin at the test location.
- Create 35 active parts for this test whose part numbers start with the same text, so one search lists all 35.
- Use a browser window no more than 1080 pixels tall, so the 30 rows the list loads first do not all fit on screen.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S2-R6, §3 Technical Decisions, D24. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-12 · C425595 · The bulk bar is near-black in the light theme and white in the dark theme
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an active part, part A.
- Make sure the app is in the Light theme.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S2-12-A.
Quotes: S2-R7a. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-13 · C425596 · More than 200 ticked parts disables Deactivate
State the tester sets up:
- Sign in as an Admin at the test location.
- Create 201 active parts for this test whose part numbers start with the same text, so one search lists all 201.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S2-R8a, UFS-34, S2-R6, S10-R4. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-13b · new case (split from S2-13) · More than 200 ticked parts disables Activate on the Inactive tab
State the tester sets up:
- Sign in as an Admin at the test location.
- Create 201 parts for this test whose part numbers start with the same text, so one search lists all 201, and set all 201 inactive.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Inactive tab.
Quotes: S3-R3, S2-R8a, UFS-34. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-14 · C425597 · Search, filters, sorting and scrolling keep working in bulk mode
State the tester sets up:
- Sign in as an Admin at the test location.
- Have three active parts: part A and part C in category A, and part B in category B, so the category A filter leaves part B out.
- Give parts A, B and C part numbers that start with the same text, so one search lists them, and descriptions that run A to Z in the order part A, part B, part C.
- Make sure the test location has more than 30 active parts, so the list loads more rows as you scroll.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S2-14-A; part B = ZZAUTOTEST-PL-S2-14-B; part C = ZZAUTOTEST-PL-S2-14-C.
Quotes: S2-R10, S2-R6. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-15 · C425598 · Changing the search or a filter clears the ticks but sorting keeps them
State the tester sets up:
- Sign in as an Admin at the test location.
- Have three active parts: part A and part B in category A, and part C in category B, so the category A filter leaves part C out.
- Give parts A, B and C part numbers that start with the same text, so one search lists all three.
- Use a longer search text that still matches all three part numbers.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S2-15-A; part B = ZZAUTOTEST-PL-S2-15-B; part C = ZZAUTOTEST-PL-S2-15-C.
Quotes: S2-R10a. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-16 · C425599 · In bulk mode the actions menu offers only Export
State the tester sets up:
- Sign in as an Admin at the test location.
- Have at least one active part at the test location, so Export has a part to export.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S2-R10b, S2-E4. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-17 · C425600 · Bulk mode cannot be turned on while a cycle count is running
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active tracked part, part A, for this test, with 5 in its bin.
- Make sure no Cycle count is running on the Inventory list.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S2-17-A.
Quotes: S2-E4. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-18 · C425601 · When every ticked part fails, nothing changes and the ticks stay
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two active parts for this test, part A and part B.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Use a desktop browser that can open a second tab on the same ShopView address, signed in as the same user.
- Start in browser tab 1 on the Inventory page, on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S2-18-A; part B = ZZAUTOTEST-PL-S2-18-B.
Quotes: S2-R15, S10-N2, S10-R13a, UFS-31, UFS-37. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-19 · C425603 · Deactivating a part that has a core charge also deactivates its core
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test, with a Core Charge above $0, so it has a core.
- Make sure the Search box in the top bar is the global search, which lists inventory parts.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S2-19-A.
Quotes: S2-R17, S10-R12a, S5-E3, FO-10, S9-R18. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-19b · new case (split from S2-19) · Activating a part that has a core charge also activates its core
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test, with a Core Charge above $0, so it has a core, and set it inactive.
- Make sure the Search box in the top bar is the global search, which lists inventory parts.
- Start on the Inventory page, on the Inactive tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S2-19b-A.
Quotes: S3-R3, S2-R17, S10-R12a, FO-10, S9-R18. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S2-20 · C425604 · The work order lines bulk bar is unchanged and its X shows Clear selection
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an open work order for this test, with two lines.
- Have screenshots of the work order lines bulk bar from the build before this one, in the light and the dark theme, so the bar can be compared.
- Make sure the app is in the Light theme.
- Start on that work order's Lines tab.
Quotes: S2-R9, TERM-5, §6 Phase 1, Verification (browser-walk). Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S3-01 · C154764 · Activate parts on the Inactive tab opens the same bulk mode with Activate
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an inactive part, part A, and an active part, part C.
- Give parts A and C part numbers that start with the same text, so one search lists both.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S3-01-A; part C = ZZAUTOTEST-PL-S3-01-C.
Quotes: S3-R1, S3-R2. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S3-02 · C154765 · Confirming Activate moves the ticked parts back to the Active tab
State the tester sets up:
- Sign in as an Admin at the test location.
- Create three parts for this test, part A, part B and part C, and set all three inactive.
- Give parts A, B and C part numbers that start with the same text, so one search lists all three.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Inactive tab.
Example values: part A = ZZAUTOTEST-PL-S3-02-A; part B = ZZAUTOTEST-PL-S3-02-B; part C = ZZAUTOTEST-PL-S3-02-C.
Quotes: S3-R4, S3-R5, S10-R3, S10-R8, S10-R11, UFS-28. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S3-03 · C425605 · With nothing ticked Activate is disabled and its hover text says why
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test and set it inactive.
- Start on the Inventory page, on the Inactive tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S3-03-A.
Quotes: S3-N1, S3-R3, UFS-33. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S3-04 · C425606 · On the Inactive tab a row click ticks the row in bulk mode only
State the tester sets up:
- Sign in as an Admin at the test location.
- Have three inactive parts, part A, part B and part C.
- Give parts A, B and C part numbers that start with the same text, so one search lists all three.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Inactive tab.
Example values: part A = ZZAUTOTEST-PL-S3-04-A; part B = ZZAUTOTEST-PL-S3-04-B; part C = ZZAUTOTEST-PL-S3-04-C.
Quotes: S3-R3, S2-R3, S2-R5, S2-R6. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S3-04b · new case (split from S3-04) · On the Inactive tab a new search or filter clears the ticks, sorting keeps them
State the tester sets up:
- Sign in as an Admin at the test location.
- Have three inactive parts: part A and part B in category A, and part C in category B, so the category A filter leaves part C out.
- Give parts A, B and C part numbers that start with the same text, so one search lists all three.
- Use a longer search text that still matches all three part numbers.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Inactive tab.
Example values: part A = ZZAUTOTEST-PL-S3-04b-A; part B = ZZAUTOTEST-PL-S3-04b-B; part C = ZZAUTOTEST-PL-S3-04b-C.
Quotes: S3-R3, S2-R10a, S2-R10b. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S3-04c · new case (split from S3-04) · On the Inactive tab the bulk bar's X shows Clear selection and leaves the mode
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an inactive part at the test location, so the Inactive tab lists a row.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Inactive tab.
Quotes: S3-R3, S2-R9, S2-R9a. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S3-04d · new case (split from S3-04) · On the Inactive tab only the parts that failed to activate stay ticked
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two parts for this test, part A and part B, and set both inactive.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Use a desktop browser that can open a second tab on the same ShopView address, signed in as the same user.
- Start in browser tab 1 on the Inventory page, on the Inactive tab.
Example values: part A = ZZAUTOTEST-PL-S3-04d-A; part B = ZZAUTOTEST-PL-S3-04d-B.
Quotes: S3-R3, S2-R15, UFS-30, UFS-37. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S4-01 · C154766 · New Inventory Part opens with tracking on in its own Inventory Tracking section
State the tester sets up:
- Sign in as an Admin at the test location.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S4-R1, S4-R2, S4-R4, S13-R1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S4-02 · C154767 · Switching tracking off hides Min and Max but keeps the bin section
State the tester sets up:
- Sign in as an Admin at the test location.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S4-R5, S4-R6, CN-S4-1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S4-03 · C154768 · An untracked part shows Not Tracked with its bins, Min and Max in the list
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an active untracked part, part A, with 4 in bin location A, 3 in bin location B, and a saved Min of 2 and Max of 6.
- Make sure the Bin Location / Quantity, Total Qty, Min and Max columns are switched on in the columns button.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S4-03-A.
Quotes: S4-R8, S4-R8a, S4-R8b, FO-7. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S4-04 · C154769 · A tracked new part always keeps a default bin in the window
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure the test location has at least two bin locations, so a second bin can be added.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S4-R7, CN-S4-1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S4-05 · C425627 · The Inventory Tracking info icon shows the tracking help text
State the tester sets up:
- Sign in as an Admin at the test location.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S4-R3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S4-06 · C425628 · An untracked part saves with its bin and quantity as a shelf reference
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a part number that no part at the test location has, so the new part can be saved.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S4-R6, S4-R6a, S4-R8. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S4-07 · C425630 · The Inventory Value report leaves out an untracked part
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two parts for this test: part A, active and tracked, with 4 in its bin at a cost of $10.00, and part B, active and untracked, with 3 in its bin at a cost of $20.00.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Start on the Inventory Value report (Reports in the top bar, then Inventory Value), with the as-of date on today.
Example values: part A = ZZAUTOTEST-PL-S4-07-A; part B = ZZAUTOTEST-PL-S4-07-B.
Quotes: S4-R9, ACC-2. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S5-01 · C154770 · Turning tracking on gives a part with no bin the default bin at zero
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an untracked part, part A, for this test with no bin location: its only bin location was deleted in Bin Locations (under Settings) while part A held 0 there, so its window shows no bin row.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S5-01-A.
Quotes: S5-R7. Marker: AUTOMATION: HOLD - waiting on the PO (question Q2: how a part with no bin location is made).

### S5-02 · C154771 · Turning tracking off and back on keeps Min and Max
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active tracked part, part A, for this test with Min 2, Max 6 and 4 in its bin.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S5-02-A.
Quotes: S5-R1, S5-R3, S5-R4, S4-R8b, FO-7. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S5-03 · C154772 · Turning tracking off on a part with stock asks for no confirmation
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active tracked part, part A, for this test with 7 on hand: 4 in one bin and 3 in another.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S5-03-A.
Quotes: S5-R5, S5-R1, KD-7. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S5-04 · C154773 · Turning tracking off keeps every bin quantity
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active tracked part, part A, for this test with 4 in bin location A and 3 in bin location B.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S5-04-A.
Quotes: S5-R3, S5-R3a. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S5-05 · C425631 · Turning tracking on marks the first bin as default when none is
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an untracked part, part A, for this test with 2 in bin location A (the first bin row) and 5 in bin location B, saved with neither bin marked Default.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S5-05-A.
Quotes: S5-R8, S5-E2, Chris Ward, 14 Oct 2026, answer 5. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S5-06 · C425632 · The list shows Not Tracked right after Save, without a page reload
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active tracked part, part A, for this test with 5 in its bin.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S5-06-A.
Quotes: S5-R2, S5-R10. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S5-07 · C425633 · Turning tracking back on shows the count as it stands now
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test with 4 in bin location A and 3 in bin location B, turn its tracking off, then change bin location A's quantity to 1 while it is untracked.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S5-07-A.
Quotes: S5-R6, KD-7. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S5-08 · C425634 · A part's core turns untracked and tracked together with the part
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active tracked part, part A, for this test with 2 in its bin and a Core Charge of $25.00, so it has a core.
- Make sure the Search box in the top bar is the global search, which lists inventory parts.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S5-08-A.
Quotes: S5-R9, S9-R20, FO-10, KD-8. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S5-09 · C425635 · A core charge added to an untracked part gives it an untracked core
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an untracked part, part A, for this test with 2 in its bin and no Core Charge, so it has no core yet.
- Make sure the Search box in the top bar is the global search, which lists inventory parts.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S5-09-A.
Quotes: S5-R9, S9-R20. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S5-10 · C425636 · Cycle count shows Not Tracked for an untracked part and never counts it
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two parts for this test: part A, active and tracked, with 5 in its bin, and part B, active and untracked, with 3 in its bin.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Make sure no Cycle count is running on the Inventory list.
- Start on the Inventory page, on the Active tab, with the shared start of the part numbers typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S5-10-A; part B = ZZAUTOTEST-PL-S5-10-B.
Quotes: S5-R12, UFS-41. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S5-11 · C425637 · The printed count sheet leaves out an untracked part
State the tester sets up:
- Sign in as an Admin at the test location.
- Have two active tracked parts, part A with 2 in its bin and part B with 4, and an active untracked part, part C, with 6 in its bin.
- Give parts A, B and C part numbers that start with the same text, so one search lists all three.
- Make sure no Cycle count is running on the Inventory list.
- Start on the Inventory page, on the Active tab, with the shared start of the part numbers typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S5-11-A; part B = ZZAUTOTEST-PL-S5-11-B; part C = ZZAUTOTEST-PL-S5-11-C.
Quotes: S5-R13. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S5-12 · C425638 · Part History records Tracking turned off and Tracking turned on
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active tracked part, part A, for this test with nothing on hand: its only bin holds 0.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S5-12-A.
Quotes: S5-R11, S10-R22. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S5-13 · C425640 · Importing Min, Max and a bin quantity for an untracked part saves them
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an untracked part, part A, for this test with Min 2 and Max 6 (saved while it was tracked) and 4 in bin location A.
- Have a parts import file with one row for part A that sets bin location A's quantity to 9, Min to 3 and Max to 8.
- Start on the Inventory data import page (Settings, then Data Import, then Inventory).
Example values: part A = ZZAUTOTEST-PL-S5-13-A.
Quotes: S5-E1, S7-N7, S10-R22a. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S5-14 · C425657 · Inventory Value for an earlier date still counts a part untracked today
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active tracked part, part A, for this test on an earlier day, with 4 in its bin at a cost of $10.00, so the Inventory Value report saved a figure for it on that earlier date (date A).
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S5-14-A.
Quotes: S4-R9, ACC-3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S5-15 · C425658 · Inventory Value before the release counts every part as tracked
State the tester sets up:
- Sign in as an Admin at the test location.
- Use an active tracked part, part A, that was at the test location before this release was installed and that no other test needs.
- Use a date before the release, date A, on which the Inventory Value report lists part A.
- Write down part A's Qty and Total Cost on the Inventory Value report for date A.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S5-15-A.
Quotes: ACC-5, ACC-4, S4-R9. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S5-16 · C573675 · After its default bin is deleted, turning tracking on marks the remaining bin
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two bin locations for this test, bin location A and bin location B, at the test location.
- Create an untracked part, part A, for this test with 0 in bin location A, marked Default, and 5 in bin location B.
- Delete bin location A in Bin Locations (under Settings) while part A holds 0 there.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S5-16-A.
Quotes: S5-E2, S5-R8, Chris Ward, 14 Oct 2026, answer 5. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S5-17 · C573676 · A part's core has no row of its own on the Inventory list or in Export
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active tracked part, part A, for this test with 2 in its bin and a Core Charge of $25.00, so it has a core.
- Use a computer that can open the exported file in a spreadsheet program.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S5-17-A.
Quotes: S5-E3, S1-R9b, S2-R6. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S5-17b · new case (split from S5-17) · A part's core has no row of its own on the Part Library list
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test with a Core Charge of $25.00, so it has a core.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Example values: part A = ZZAUTOTEST-PL-S5-17b-A.
Quotes: S5-E3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S5-18 · C573677 · A core's own Part History page shows its name and its own history
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test with a Core Charge of $25.00, so it has a core, then change part A's description once in its Edit Inventory Part window, from description 1 to description 2.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S5-18-A.
Quotes: S5-E3, S13-R15, S10-R24, S10-R26. Marker: AUTOMATION: HOLD - waiting on the PO (question Q1: how a core's own Part History page is opened).
