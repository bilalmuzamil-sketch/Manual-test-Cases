# Parts Lifecycle — setup file for Claude sessions (a tester does not need it)

Built by `authoring/render_setup.py` from the case library (363 cases written so far). Sources: PRD "Parts Lifecycle Update", Confluence 829227015, version 33 (23 Oct 2026, owner Chris Ward), read 27 Oct 2026; tech plan of 7 Oct 2026; Jira epic SV-10647 read 27 Oct 2026; design canvas https://claude.ai/artifact/Vz6rprcWyP16tYxzM1kdeE (13 Oct copy, unchanged 27 Oct).
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

### S1-02b · C839413 (split from S1-02) · No setting turns part status or tracking on or off
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

### S1-12b · C839414 (split from S1-12) · Export follows the Supply filter and leaves out an untracked part
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

### S1-14 · C839415 · Switching tabs during a cycle count drops the counts typed so far
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

### S2-05b · C839416 (split from S2-05) · The X on the bulk bar leaves bulk mode and clears the ticks
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

### S2-06b · C839417 (split from S2-06) · Deactivating one part says 1 part selected and 1 part updated
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

### S2-13b · C839418 (split from S2-13) · More than 200 ticked parts disables Activate on the Inactive tab
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

### S3-04b · C839420 (split from S3-04) · On the Inactive tab a new search or filter clears the ticks, sorting keeps them
State the tester sets up:
- Sign in as an Admin at the test location.
- Have three inactive parts: part A and part B in category A, and part C in category B, so the category A filter leaves part C out.
- Give parts A, B and C part numbers that start with the same text, so one search lists all three.
- Use a longer search text that still matches all three part numbers.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Inactive tab.
Example values: part A = ZZAUTOTEST-PL-S3-04b-A; part B = ZZAUTOTEST-PL-S3-04b-B; part C = ZZAUTOTEST-PL-S3-04b-C.
Quotes: S3-R3, S2-R10a, S2-R10b. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S3-04c · C839421 (split from S3-04) · On the Inactive tab the bulk bar's X shows Clear selection and leaves the mode
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an inactive part at the test location, so the Inactive tab lists a row.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Inactive tab.
Quotes: S3-R3, S2-R9, S2-R9a. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S3-04d · C839422 (split from S3-04) · On the Inactive tab only the parts that failed to activate stay ticked
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
- Have two bin locations at the test location, bin location A and bin location B.
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
- Delete bin location A in Bin Locations (Settings, then Parts, then Bin Locations) while part A holds 0 there.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S5-16-A.
Quotes: S5-E2, S5-R8, Chris Ward, 27 Oct 2026, answer 17. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S5-17 · C573676 · A part's core has no row of its own on the Inventory list or in Export
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active tracked part, part A, for this test with 2 in its bin and a Core Charge of $25.00, so it has a core.
- Use a computer that can open the exported file in a spreadsheet program.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S5-17-A.
Quotes: S5-E3, S1-R9b, S2-R6. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S5-17b · C839423 (split from S5-17) · A part's core has no row of its own on the Part Library list
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test with a Core Charge of $25.00, so it has a core.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Example values: part A = ZZAUTOTEST-PL-S5-17b-A.
Quotes: S5-E3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S6-01 · C154774 · Searching not tracked lists untracked parts and normal matches
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an untracked part, part A, whose part number, description and tags contain neither the word not nor the word tracked.
- Have a tracked part, part B, whose description contains the words NOT TRACKED, so the search also matches it on its description.
- Have a tracked part, part C, whose part number, description and tags contain neither word, so the search has a part it must leave out.
- Give parts A, B and C part numbers that start with ZZ, so a Part Number sort from Z to A lists them at the top of the results.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S6-01-A; part B = ZZAUTOTEST-PL-S6-01-B; part C = ZZAUTOTEST-PL-S6-01-C.
Quotes: S6-R1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S6-02 · C154775 · Total Qty sort puts untracked parts below tracked parts both ways
State the tester sets up:
- Sign in as an Admin at the test location.
- Have five parts, part A, part B, part C, part D and part E, each with one bin location that holds a quantity above 0 (no bin below zero), so the sort and the Total Qty cells agree.
- Set parts A, B and C as tracked parts, with 5, 5 and 2 on hand.
- Set parts D and E as untracked parts, with 1 and 9 on their shelf.
- Give parts A, B, C, D and E descriptions that start with the same text and end, in turn, with ALPHA, BRAVO, CHARLIE, XRAY and YANKEE.
- Give parts A, B, C, D and E part numbers that start with the same text, so one search lists all five.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S6-02-A; part B = ZZAUTOTEST-PL-S6-02-B; part C = ZZAUTOTEST-PL-S6-02-C; part D = ZZAUTOTEST-PL-S6-02-D; part E = ZZAUTOTEST-PL-S6-02-E.
Quotes: S6-R3, S6-R4, S6-R5, S6-R6, S6-R7, §6 Phase 5, Key code changes. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S6-03 · C425641 · Searching track, no or t never finds a part by its tracking
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an untracked part, part A, whose part number, description and tags contain no letter t and never the letters no side by side, so none of the searches below can match it by its text.
- Have a tracked part, part B, whose description contains TRACKBAR.
- Have a tracked part, part C, whose description contains NOZZLE.
- Give parts A, B and C part numbers that start with ZZ, so a Part Number sort from Z to A lists them at the top of the results.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S6-03-A; part B = ZZAUTOTEST-PL-S6-03-B; part C = ZZAUTOTEST-PL-S6-03-C.
Quotes: S6-R2. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S6-04 · C425642 · With no untracked parts, searching not tracked lists nothing
State the tester sets up:
- Sign in as an Admin at a location that has no untracked part.
- Have a tracked part, part A, at that location whose part number, description and tags contain neither the word not nor the word tracked.
- Start on that location's Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S6-04-A.
Quotes: S6-N1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S6-05 · C425643 · Sorting by Avg Cost sorts by cost, whatever the tracking
State the tester sets up:
- Sign in as an Admin at the test location.
- Have four parts: part A tracked with Avg Cost $7.00, part B untracked with Avg Cost $9.00, part C untracked with Avg Cost $3.00 and part D tracked with Avg Cost $9.00.
- Give parts A, B, C and D descriptions that start with the same text and end, in turn, with ALPHA, BRAVO, DELTA and ECHO.
- Give parts A, B, C and D part numbers that start with the same text, so one search lists all four.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S6-05-A; part B = ZZAUTOTEST-PL-S6-05-B; part C = ZZAUTOTEST-PL-S6-05-C; part D = ZZAUTOTEST-PL-S6-05-D.
Quotes: S6-R8, SV-10819 acceptance criteria. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S6-06 · C425644 · With no sort chosen, tracked parts come before untracked parts
State the tester sets up:
- Sign in as an Admin at the test location.
- Have two tracked parts, part A and part B, with descriptions ending ALPHA and CHARLIE.
- Have two untracked parts, part C and part D, with descriptions ending AARDVARK and ZULU.
- Give parts A, B, C and D descriptions that start with the same text before those endings.
- Give parts A, B, C and D part numbers that start with the same text, so one search lists all four.
- Make sure no column of the Inventory list is sorted: reload the page so no header shows a sort arrow.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S6-06-A; part B = ZZAUTOTEST-PL-S6-06-B; part C = ZZAUTOTEST-PL-S6-06-C; part D = ZZAUTOTEST-PL-S6-06-D.
Quotes: S6-R9. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S6-07 · C425645 · The Supply filter shows an untracked part only under All
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a tracked part, part A, with 1 on hand, Min 5 and Max 10, so it is under-supplied.
- Have a tracked part, part C, with 7 on hand, Min 5 and Max 10, so it is well-supplied.
- Have a tracked part, part D, with 12 on hand, Min 5 and Max 10, so it is over-supplied.
- Have an untracked part, part B, with 1 on its shelf and a Min 5 and Max 10 saved while it was tracked.
- Give parts A, B, C and D part numbers that start with the same text, so one search lists all four.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S6-07-A; part B = ZZAUTOTEST-PL-S6-07-B; part C = ZZAUTOTEST-PL-S6-07-C; part D = ZZAUTOTEST-PL-S6-07-D.
Quotes: S6-R10, OOS-2. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S6-08 · C425656 · Global search shows Not Tracked in place of an untracked part's badge
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a tracked part, part A, with 4 on hand.
- Have an untracked part, part B, with 3 on its shelf.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Make sure the Search box in the top bar is the global search, which lists inventory parts.
Example values: part A = ZZAUTOTEST-PL-S6-08-A; part B = ZZAUTOTEST-PL-S6-08-B.
Quotes: UFS-42, S9-R20, QA lead's answer of 9 Oct 2026, situation 3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S6-09 · C839424 · On a vendor return, searching not tracked also lists untracked parts
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a vendor, vendor A.
- Have an untracked part, part A, with vendor A, whose part number, description and tags contain neither the word not nor the word tracked.
- Have a tracked part, part B, with vendor A, whose description contains the word NOTCHED, so the word not also matches it on its description.
- Have a tracked part, part C, with vendor A, whose part number, description and tags contain neither word, so the search has a part it must leave out.
- Start on the Create Return page (Parts in the top bar, Returns in the left menu, then the button that starts a new return).
Example values: part A = ZZAUTOTEST-PL-S6-09-A; part B = ZZAUTOTEST-PL-S6-09-B; part C = ZZAUTOTEST-PL-S6-09-C.
Quotes: S6-R1a, S6-R1, SV-10819, Chris Ward, 23 Oct 2026. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S6-10 · C839425 · On a vendor credit, searching tracked also lists untracked parts
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a vendor, vendor A.
- Have an untracked part, part A, with vendor A, whose part number, description and tags contain neither the word not nor the word tracked.
- Have a tracked part, part C, with vendor A, whose part number, description and tags contain neither word, so the search has a part it must leave out.
- Start on vendor A's page (Parts in the top bar, Vendors in the left menu, then the vendor A row).
Example values: part A = ZZAUTOTEST-PL-S6-10-A; part C = ZZAUTOTEST-PL-S6-10-C.
Quotes: S6-R1a, S6-R1, SV-10819, Chris Ward, 23 Oct 2026. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-01 · C154776 · New Inventory Part has Description then Part Number, with no library pick
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a part number for a new part, part A, that no part or Part Library entry uses yet.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S7-01-A.
Quotes: S7-R1, S7-R2, FO-8. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-02 · C154777 · A number that exactly matches one Part Library entry links to it
State the tester sets up:
- Sign in as an Admin who can switch between two locations, the test location and location B, so a part can be stocked at location B only.
- Create a part for this test at location B only, part A, with a description, description 1, so its Part Library entry exists and part A is not stocked at the test location.
- Use a description, description 2, that differs from description 1 by more than upper and lower case.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S7-02-A.
Quotes: S7-R4, S7-R5, S7-R6, S7-R9, UFS-10, KD-4. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-03 · C154778 · A number held by two Part Library entries gets a new entry of its own
State the tester sets up:
- Sign in as an Admin at the test location.
- Use two Part Library entries from before this release that have exactly the same part number, with the same upper and lower case, and different descriptions (such pairs come only from data saved before this release); call that part number number 1.
- Make sure no part at the test location has a part number that matches number 1, ignoring upper and lower case, hyphens, asterisks, periods and spaces.
- Use a description for the new part, description 3, that neither entry has.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S7-R8, S7-R10, CN-S7-1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-04 · C154779 · Description and Part Number must be filled before a new part saves
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a part number for a new part, part A, that no part or Part Library entry uses yet.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S7-04-A.
Quotes: S7-N1, S7-N2, UFS-04, UFS-05, KD-3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-05 · C425669 · Spaces before and after the number and description are removed on save
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a part number for a new part, part A, that no part or Part Library entry uses yet.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S7-05-A.
Quotes: S7-R3, S11-R6a. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-06 · C425670 · A linked Part Library entry keeps its tags and gains the new one
State the tester sets up:
- Sign in as an Admin who can switch between two locations, the test location and location B, so a part can be stocked at location B only.
- Create a part for this test at location B only, part A, with exactly two tags, tag 1 and tag 2, so part A is not stocked at the test location.
- Use a third tag, tag 3, that part A does not have.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S7-06-A.
Quotes: S7-R6a. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-07 · C425671 · A linked entry with no manufacturer takes the one picked
State the tester sets up:
- Sign in as an Admin who can switch between two locations, the test location and location B, so a part can be stocked at location B only.
- Create a part for this test at location B only, part A, with the Manufacturer field left empty, so part A is not stocked at the test location.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S7-07-A.
Quotes: S7-R6b, S7-R6d. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-08 · C425672 · A linked entry keeps the manufacturer it already has
State the tester sets up:
- Sign in as an Admin who can switch between two locations, the test location and location B, so a part can be stocked at location B only.
- Create a part for this test at location B only, part A, with a manufacturer, manufacturer 1, so part A is not stocked at the test location.
- Use a different manufacturer, manufacturer 2, from the Manufacturer list.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S7-08-A.
Quotes: S7-R6b, S7-R6d. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-09 · C425673 · A linked entry that has a category keeps its own category
State the tester sets up:
- Sign in as an Admin who can switch between two locations, the test location and location B, so a part can be stocked at location B only.
- Create a part for this test at location B only, part A, with a category, category A, so part A is not stocked at the test location.
- Use a different category, category B, from the Category list.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S7-09-A.
Quotes: S7-R6c, SV-10820, Chris Ward, 23 Oct 2026. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-09b · C839426 (split from S7-09) · A linked entry with no category takes the category picked
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a Part Library entry that has no category and that no part at the test location uses (such entries come from data saved before this release); call its part number number 1.
- Use any category, category A, from the Category list.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S7-R6c, S7-R6b, SV-10820, Chris Ward, 23 Oct 2026. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-10 · C425674 · No Part Library message when the typed description differs only in case
State the tester sets up:
- Sign in as an Admin who can switch between two locations, the test location and location B, so a part can be stocked at location B only.
- Create a part for this test at location B only, part A, with a description, description 1, in capital letters, so part A is not stocked at the test location.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S7-10-A.
Quotes: S7-R9, S7-R10. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-11 · C425675 · A new number creates its own Part Library entry, with no message
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a part number for a new part, part A, that no part or Part Library entry uses in any upper and lower case or punctuation.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S7-11-A.
Quotes: S7-R7, S7-R10, S11-R6. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-12 · C425676 · A number that differs only in upper or lower case is not linked
State the tester sets up:
- Sign in as an Admin who can switch between two locations, the test location and location B, so a part can be stocked at location B only.
- Create a part for this test at location B only, part A, whose part number is in capital letters, with a description, description 1, so part A is not stocked at the test location.
- Use a description for the new part, description 2, that differs from description 1.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S7-12-A.
Quotes: S7-R4, S7-R7, KD-4. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-13 · C425677 · A part number already stocked here and active is refused
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test at the test location, with a part number that has a hyphen in it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S7-13-A.
Quotes: S7-N3, S7-N5, UFS-08, CN-S13-3, KD-5. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-14 · C425678 · A part number already stocked here but inactive is refused
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test at the test location, with a hyphen in its part number, and set it inactive.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S7-14-A.
Quotes: S7-N4, S7-N5, UFS-09, CN-S13-3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-15 · C425679 · With active and inactive matches, the active part's number is named
State the tester sets up:
- Sign in as an Admin at the test location.
- Have at the test location an active part, part A, and an inactive part, part B, on two different Part Library entries, whose part numbers differ only in hyphens or periods (such a pair comes from data saved before this release, or from the parts import, which can add one when the number matches a Part Library entry stocked only at another location).
- Use a number to type, number 1: part A's number in lower case with spaces in place of its hyphens, so it matches both parts.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S7-15-A; part B = ZZAUTOTEST-PL-S7-15-B.
Quotes: S7-N5a, S7-N3, S7-N5, UFS-08, CN-S7-3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-16 · C425680 · Saving a part with its number unchanged is never refused as a duplicate
State the tester sets up:
- Sign in as an Admin at the test location.
- Have at the test location two active parts, part A and part B, on two different Part Library entries, whose part numbers differ only in hyphens or periods (such a pair comes from data saved before this release, or from the parts import).
- Keep parts A and B as they are: this test changes only their Sell Price.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S7-16-A; part B = ZZAUTOTEST-PL-S7-16-B.
Quotes: S7-N5b, KD-5, CN-S7-3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-17 · C425681 · Changing a part's number to a look-alike of one stocked here is refused
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two active parts for this test at the test location, part A and part B, with a hyphen in part A's part number.
- Use a number to type, number 1: part A's number in lower case with spaces in place of its hyphens, which no Part Library entry has exactly.
- Start on the Inventory page, on the Active tab, with part B's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S7-17-A; part B = ZZAUTOTEST-PL-S7-17-B.
Quotes: S7-N5b, S7-N3, S7-N5, UFS-08, S13-N1a, CN-S13-3, Chris Ward, 27 Oct 2026, answer 23. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-17b · C847726 (split from S7-17) · Changing a number to a look-alike of an inactive part here is refused
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two parts for this test at the test location: part A, set inactive, with a hyphen in its part number, and part B, active.
- Use a number to type, number 1: part A's number in lower case with spaces in place of its hyphens, which no Part Library entry has exactly.
- Start on the Inventory page, on the Active tab, with part B's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S7-17b-A; part B = ZZAUTOTEST-PL-S7-17b-B.
Quotes: S7-N4, S7-N5b, S7-N5, UFS-09, S13-N1a, CN-S13-3, Chris Ward, 27 Oct 2026, answer 23. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-18 · C425682 · A description or part number of only spaces is refused on its own
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a part number for a new part, part A, that no part or Part Library entry uses yet.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S7-18-A.
Quotes: S7-N1, S7-N2, UFS-04, UFS-05. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-19 · C425683 · A part from before the release keeps its Part Library entry
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a part, part A, that was stocked at the test location before this release was installed and whose number and description nobody has changed since.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Example values: part A = ZZAUTOTEST-PL-S7-19-A.
Quotes: S7-R11. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-20 · C540880 · Changing only the case or punctuation of a part's own number saves
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test at the test location only, with capital letters and a hyphen in its part number.
- Make sure no other part at the test location has a number that matches part A's, ignoring upper and lower case, hyphens, asterisks, periods and spaces.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S7-20-A.
Quotes: S7-N5c, S7-N5b, KD-5. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-21 · C573678 · An import row with the number of a part stocked here updates that part
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test at the test location, with Min 1 and Max 5.
- Have a parts import file with one row for part A, with part A's exact part number, its description, Min 2 and Max 6.
- Start on the Inventory data import page (Settings, then Data Import, then Inventory).
Example values: part A = ZZAUTOTEST-PL-S7-21-A.
Quotes: S7-N7, S13-N9a. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-21b · C839427 (split from S7-21) · An import row whose number differs only in case and punctuation updates the part
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test at the test location, with a hyphen in its part number and Min 1 and Max 5.
- Make sure no other Part Library entry has a number that matches part A's, ignoring upper and lower case, hyphens, asterisks, periods and spaces.
- Have a parts import file with one row whose part number is part A's number in lower case with periods in place of its hyphens, with part A's description, Min 3 and Max 7.
- Start on the Inventory data import page (Settings, then Data Import, then Inventory).
Example values: part A = ZZAUTOTEST-PL-S7-21b-A.
Quotes: S7-N7, S13-N9a, OOS-8. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-22 · C573679 · A parts import row with no part number is skipped with no message
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a part number for a new part, part A, that no part or Part Library entry uses yet.
- Use a description, description 1, that no part or Part Library entry has.
- Have a parts import file with two rows: the first with an empty part number and description 1, the second with part A's part number and a description of its own, each with quantity 1.
- Start on the Inventory data import page (Settings, then Data Import, then Inventory).
Example values: part A = ZZAUTOTEST-PL-S7-22-A.
- The description is the import template's name column (open question Q4(b)); the part number is the part_number column.
Quotes: S7-N8. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-23 · C573680 · An import row with no description keeps the part's description
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test at the test location, with a description, description 1, and Min 1 and Max 5.
- Have a parts import file with one row for part A: part A's part number, an empty description, Min 2 and Max 6.
- Start on the Inventory data import page (Settings, then Data Import, then Inventory).
Example values: part A = ZZAUTOTEST-PL-S7-23-A.
Quotes: S7-N9, CN-S7-4. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-24 · C573681 · A new part imported with no description takes its part number
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a part number for a new part, part A, that no part or Part Library entry uses in any upper and lower case or punctuation.
- Have a parts import file with one row: part A's part number, an empty description and quantity 2.
- Start on the Inventory data import page (Settings, then Data Import, then Inventory).
Example values: part A = ZZAUTOTEST-PL-S7-24-A.
Quotes: S7-N9, CN-S7-4. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-25 · C573682 · An imported part with no bin location goes to an Unassigned bin
State the tester sets up:
- Sign in as an Admin at a location that has no bin location named Unassigned.
- Use part numbers for two new parts, part A and part B, that no part or Part Library entry uses yet.
- Have a parts import file with two rows that add part A and part B, each with quantity 0 and an empty bin location cell.
- Start on that location's Inventory data import page (Settings, then Data Import, then Inventory).
Example values: part A = ZZAUTOTEST-PL-S7-25-A; part B = ZZAUTOTEST-PL-S7-25-B.
Quotes: S7-N10, S7-N11, Chris Ward's answer 3 a) of 14 Oct 2026, Chris Ward, 27 Oct 2026, answer 16, Chris Ward, 27 Oct 2026, answer 17. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-27 · C847727 · An imported part is tracked and takes its description from the name column
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a part number for a new part, part A, that no part or Part Library entry uses yet.
- Use a description, description 1, that no part or Part Library entry has.
- Create an untracked part, part B, for this test at the test location, with 4 in one bin location, bin location A.
- Have a parts import file made from the Inventory import template with two rows: one that adds part A, with description 1 in the name column, quantity 2 and bin location A, and one for part B with quantity 6 in bin location A.
- Start on the Inventory data import page (Settings, then Data Import, then Inventory).
Example values: part A = ZZAUTOTEST-PL-S7-27-A; part B = ZZAUTOTEST-PL-S7-27-B.
- Template columns: the description is the name column (answer 16(b), 27 Oct 2026); the part number is the part_number column.
Quotes: S7-N11, S5-E1, Chris Ward, 27 Oct 2026, answer 16. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S7-26 · C573683 · A linked entry whose manufacturer no longer exists takes the one picked
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a Part Library entry from data saved before this release that still points to a manufacturer that no longer exists in this organization (its Manufacturer shows empty), and that no part at the test location uses; call its part number number 1.
- Make sure no other Part Library entry has exactly number 1, with the same upper and lower case.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S7-R6d, S7-R6b, CN-S7-2, Chris Ward's answer 11 of 14 Oct 2026. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S8-01 · C154780 · Without Delete, the actions menu has no Deactivate parts or Activate parts
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a custom role for this test, role B, with Part Library & Inventory — View, Part Library & Inventory — Create & Edit and See Financial Data but without Part Library & Inventory — Delete, so user B can create and edit parts but cannot delete them.
- Create a staff member for this test, user B, at the test location with role B, so the steps run with role B's permissions.
- Use two browser windows: window 1 signed in as the Admin, window 2 (a private window) signed in as user B, so both users' screens can be seen side by side.
- Start both windows on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S8-R3, S8-R4, S8-R5. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S8-02 · C154781 · Without Delete, the tracking switch shows but cannot be changed
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a custom role for this test, role B, with Part Library & Inventory — View, Part Library & Inventory — Create & Edit and See Financial Data but without Part Library & Inventory — Delete, so user B can create and edit parts but cannot delete them.
- Create a staff member for this test, user B, at the test location with role B, so the steps run with role B's permissions.
- Use two browser windows: window 1 signed in as the Admin, window 2 (a private window) signed in as user B, so both users' screens can be seen side by side.
- Have a tracked part, part A, with 2 on hand.
- Have an untracked part, part B.
- Start window 2 on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S8-02-A; part B = ZZAUTOTEST-PL-S8-02-B.
Quotes: S8-R8, S8-R9, S5-N2. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S8-03 · C154782 · The Service Manager role sees the status, tracking and delete controls
State the tester sets up:
- Make sure the Service Manager role is at its default permissions: reset it to its template, so earlier edits do not change the result.
- Sign in as a staff member with the default Service Manager role at the test location.
- Have an active, tracked part, part A, with 2 on hand.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S8-03-A.
Quotes: S8-R14, KD-14, CN-S8-2. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S8-03b · C839428 (split from S8-03) · The Parts Manager role sees the status, tracking and delete controls
State the tester sets up:
- Make sure the Parts Manager role is at its default permissions: reset it to its template, so earlier edits do not change the result.
- Sign in as a staff member with the default Parts Manager role at the test location.
- Have an active, tracked part, part A, with 2 on hand.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S8-03b-A.
Quotes: S8-R14, KD-14, CN-S8-2. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S8-03c · C839429 (split from S8-03) · The Service Advisor role has no status, tracking or delete controls
State the tester sets up:
- Make sure the Service Advisor role is at its default permissions: reset it to its template, so earlier edits do not change the result.
- Sign in as a staff member with the default Service Advisor role at the test location.
- Have an active, tracked part, part A, with 2 on hand.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S8-03c-A.
Quotes: S8-R14, KD-14, S8-R12. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S8-04 · C154783 · A role change signs the user out before a status change goes through
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a custom role for this test, role D, with Part Library & Inventory — View, Part Library & Inventory — Create & Edit, Part Library & Inventory — Delete and See Financial Data, and with no Vendor Order Management, Part Sales or Settings permission, so user D starts with the right to delete parts.
- Create a staff member for this test, user D, at the test location with role D.
- Use two browser windows: window 1 signed in as the Admin, window 2 (a private window) signed in as user D.
- Create an active part, part A, for this test.
- Start window 1 on role D's Edit Role page (Roles & Permissions), with nothing changed yet.
- Start window 2 on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S8-04-A.
Quotes: Chris Ward, 27 Oct 2026, answer 27, Chris Ward, 27 Oct 2026, answer 27, S8-R15, S8-R3, S8-R5. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S8-05 · C425646 · A user with only View sees no Inventory actions menu
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a custom role for this test, role C, with only Part Library & Inventory — View (no Create & Edit, no Delete, no See Financial Data and no Settings permission), so user C can only look at the list.
- Create a staff member for this test, user C, at the test location with role C, so the steps run with role C's permissions.
- Use a second browser window (a private window) signed in as user C.
- Have an active part, part A, so the list has a part to show.
Example values: part A = ZZAUTOTEST-PL-S8-05-A.
Quotes: S8-R5, S8-R13, SV-10821 acceptance criteria. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S8-06 · C425647 · A custom role can change part status only once Delete is granted
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a custom role for this test, role B, with Part Library & Inventory — View, Part Library & Inventory — Create & Edit and See Financial Data but without Part Library & Inventory — Delete, so user B can create and edit parts but cannot delete them.
- Create a staff member for this test, user B, at the test location with role B, so the steps run with role B's permissions.
- Use two browser windows: window 1 signed in as the Admin, window 2 (a private window) signed in as user B, so both users' screens can be seen side by side.
- Create an active, tracked part, part A, for this test.
- Start window 1 on role B's Edit Role page (Roles & Permissions), with nothing changed yet.
- Start window 2 on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S8-06-A.
Quotes: S8-R1, S8-R2, S8-R16, S8-R6, UFS-24, UFS-25. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S8-07 · C425648 · Without Delete, New Inventory Part creates only tracked parts
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a custom role for this test, role B, with Part Library & Inventory — View, Part Library & Inventory — Create & Edit and See Financial Data but without Part Library & Inventory — Delete, so user B can create and edit parts but cannot delete them.
- Create a staff member for this test, user B, at the test location with role B, so the steps run with role B's permissions.
- Use two browser windows: window 1 signed in as the Admin, window 2 (a private window) signed in as user B, so both users' screens can be seen side by side.
- Use a part number for a new part, part A, that no part or Part Library entry uses yet.
- Start window 2 on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S8-07-A.
Quotes: S8-R7, S8-R10. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S8-08 · C425649 · Without Delete, Part Status in the part window is greyed out
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a custom role for this test, role B, with Part Library & Inventory — View, Part Library & Inventory — Create & Edit and See Financial Data but without Part Library & Inventory — Delete, so user B can create and edit parts but cannot delete them.
- Create a staff member for this test, user B, at the test location with role B, so the steps run with role B's permissions.
- Use two browser windows: window 1 signed in as the Admin, window 2 (a private window) signed in as user B, so both users' screens can be seen side by side.
- Have an active part, part A.
- Have an inactive part, part B.
- Start window 2 on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S8-08-A; part B = ZZAUTOTEST-PL-S8-08-B.
Quotes: S8-R6, S13-R20, S13-R3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S8-09 · C425650 · Without Delete, the part window shows no Delete Part button
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a custom role for this test, role B, with Part Library & Inventory — View, Part Library & Inventory — Create & Edit and See Financial Data but without Part Library & Inventory — Delete, so user B can create and edit parts but cannot delete them.
- Create a staff member for this test, user B, at the test location with role B, so the steps run with role B's permissions.
- Use two browser windows: window 1 signed in as the Admin, window 2 (a private window) signed in as user B, so both users' screens can be seen side by side.
- Have an active part, part A, that sits on no work order.
- Start both windows on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S8-09-A.
Quotes: S8-R12, S13-R10. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S8-10 · C425651 · Without Delete, a user can still rename a part stocked at two locations
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a custom role for this test, role B, with Part Library & Inventory — View, Part Library & Inventory — Create & Edit and See Financial Data but without Part Library & Inventory — Delete, so user B can create and edit parts but cannot delete them.
- Create a staff member for this test, user B, at the test location with role B, so the steps run with role B's permissions.
- Use two browser windows: window 1 signed in as the Admin, window 2 (a private window) signed in as user B, so both users' screens can be seen side by side.
- Create a part, part A, for this test at the test location and at location B under the same part number, so both share one Part Library entry.
- Use a new description, description 2, that no part uses.
- Start window 2 on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S8-10-A.
Quotes: S8-R11, S13-R12, KD-2. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S8-11 · C425652 · Without Delete, a user can still edit pricing and bin quantities
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a custom role for this test, role B, with Part Library & Inventory — View, Part Library & Inventory — Create & Edit and See Financial Data but without Part Library & Inventory — Delete, so user B can create and edit parts but cannot delete them.
- Create a staff member for this test, user B, at the test location with role B, so the steps run with role B's permissions.
- Use two browser windows: window 1 signed in as the Admin, window 2 (a private window) signed in as user B, so both users' screens can be seen side by side.
- Create a tracked part, part A, for this test, with Sell Price $15.00 and 4 in one bin location, bin location A.
- Start window 2 on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S8-11-A.
Quotes: S8-R13. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S8-12 · C425653 · Without Delete, an untracked part's price, bins and description can be edited
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a custom role for this test, role B, with Part Library & Inventory — View, Part Library & Inventory — Create & Edit and See Financial Data but without Part Library & Inventory — Delete, so user B can create and edit parts but cannot delete them.
- Create a staff member for this test, user B, at the test location with role B, so the steps run with role B's permissions.
- Use two browser windows: window 1 signed in as the Admin, window 2 (a private window) signed in as user B, so both users' screens can be seen side by side.
- Create an untracked part, part A, for this test, with Sell Price $15.00 and 4 in one bin location, bin location A.
- Use a new description, description 2, that no part uses.
- Start window 2 on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S8-12-A.
Quotes: S8-N1a. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S8-13 · C425654 · A role change signs the user out before a tracking change is saved
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a custom role for this test, role D, with Part Library & Inventory — View, Part Library & Inventory — Create & Edit, Part Library & Inventory — Delete and See Financial Data, and with no Vendor Order Management, Part Sales or Settings permission, so user D starts with the right to delete parts.
- Create a staff member for this test, user D, at the test location with role D.
- Use two browser windows: window 1 signed in as the Admin, window 2 (a private window) signed in as user D.
- Create an active, tracked part, part A, for this test, with 2 on hand.
- Start window 1 on role D's Edit Role page (Roles & Permissions), with nothing changed yet.
- Start window 2 on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S8-13-A.
Quotes: Chris Ward, 27 Oct 2026, answer 27, Chris Ward, 27 Oct 2026, answer 27, S8-R15, S8-R8, S8-R5. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S8-14 · C425655 · A role change signs the user out before an untracked part is created
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a custom role for this test, role D, with Part Library & Inventory — View, Part Library & Inventory — Create & Edit, Part Library & Inventory — Delete and See Financial Data, and with no Vendor Order Management, Part Sales or Settings permission, so user D starts with the right to delete parts.
- Create a staff member for this test, user D, at the test location with role D.
- Use two browser windows: window 1 signed in as the Admin, window 2 (a private window) signed in as user D.
- Use a part number for a new part, part A, that no part or Part Library entry uses yet.
- Start window 1 on role D's Edit Role page (Roles & Permissions), with nothing changed yet.
- Start window 2 on the Inventory page, on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S8-14-A.
Quotes: Chris Ward, 27 Oct 2026, answer 27, Chris Ward, 27 Oct 2026, answer 27, S8-R15, S8-R7, S8-R5. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-01 · C154784 · Work order part lookup no longer offers a part once it is inactive
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an inactive part, part A, with 4 on hand and a hyphen in its part number.
- Have an active part, part B, with 4 on hand, so the lookup has a part it must still offer.
- Give parts A and B part numbers that start with the same text, and descriptions that start with the same text, so one search finds both.
- Create an open work order, work order 1, for this test, with an approved line, line 1, that holds no parts.
- Start on work order 1, on its Lines tab.
Example values: part A = ZZAUTOTEST-PL-S9-01-A; part B = ZZAUTOTEST-PL-S9-01-B.
Quotes: S9-R1, S9-E10, CN-S9-1, SV-10822 acceptance criteria. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-02 · C154785 · An inactive part's window shows a grey Inactive pill in the title row
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an inactive part, part A.
- Have an active part, part B, so the pill can be compared.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Inactive tab.
Example values: part A = ZZAUTOTEST-PL-S9-02-A; part B = ZZAUTOTEST-PL-S9-02-B.
Quotes: S9-R14, S13-R3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-03 · C154786 · A user with only the View permission can open the Inactive tab
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a custom role for this test, role B, with only Part Library & Inventory — View in the Parts department, so user B can only look at the list.
- Create a staff member for this test, user B, at the test location with role B, so the steps run with role B's permissions.
- Use a second browser window (a private window) signed in as user B.
- Have an inactive part, part A.
Example values: part A = ZZAUTOTEST-PL-S9-03-A.
Quotes: S9-N1, S1-R2. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-04 · C154787 · A work order line keeps its inactive part and can still be edited
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test, with Sell Price $20.00 and 4 on hand.
- Create an open work order, work order 1, for this test, whose approved line, line 1, holds 2 of part A at $20.00.
- Set part A inactive after it is on line 1.
- Start on work order 1, on its Lines tab.
Example values: part A = ZZAUTOTEST-PL-S9-04-A.
Quotes: S9-E1, S9-E2, FO-5. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-05 · C154788 · An invoiced work order with an inactive part can be viewed, printed and reported
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test, with Sell Price $20.00.
- Create a work order, work order 1, for this test, that sold 1 of part A today on its line, line 1, and is invoiced.
- Set part A inactive after the invoice was made.
- Start on work order 1, on its Lines tab.
Example values: part A = ZZAUTOTEST-PL-S9-05-A.
Quotes: S9-E4, S9-E11. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-06 · C425724 · Estimate part lookup no longer offers a part once it is inactive
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an inactive part, part A, with 4 on hand and a hyphen in its part number.
- Have an active part, part B, with 4 on hand, so the lookup has a part it must still offer.
- Give parts A and B part numbers that start with the same text, and descriptions that start with the same text, so one search finds both.
- Create a work order for this test, work order 1, that is still an estimate (it shows the Estimate pill), with a line, line 1, that reads Needs Approval and holds no parts.
- Start on work order 1, on its Lines tab.
Example values: part A = ZZAUTOTEST-PL-S9-06-A; part B = ZZAUTOTEST-PL-S9-06-B.
Quotes: S9-R2, SV-10822 acceptance criteria. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-07 · C425725 · Technician charge-out does not offer or accept an inactive part
State the tester sets up:
- Sign in as a staff member with the default Technician role, technician A, who is a technician on line 1.
- Have an inactive part, part A, with 4 on hand and a hyphen in its part number.
- Have an active part, part B, with 4 on hand, so the lookup has a part it must still offer.
- Give parts A and B part numbers that start with the same text, and descriptions that start with the same text, so one search finds both.
- Create an open work order, work order 1, for this test, with an approved line, line 1, that holds no parts.
- Use a desktop browser.
- Start on work order 1, on its Lines tab.
Example values: part A = ZZAUTOTEST-PL-S9-07-A; part B = ZZAUTOTEST-PL-S9-07-B.
Quotes: S9-R3, S9-R16, UFS-44, SV-10822 acceptance criteria. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-08 · C425726 · Technician charge-out on a phone refuses an inactive part number
State the tester sets up:
- Sign in as a staff member with the default Technician role, technician A, who is a technician on line 1.
- Have an inactive part, part A, with 4 on hand and a hyphen in its part number.
- Have an active part, part B, with 4 on hand, so the lookup has a part it must still offer.
- Give parts A and B part numbers that start with the same text, and descriptions that start with the same text, so one search finds both.
- Create an open work order, work order 1, for this test, with an approved line, line 1, that holds no parts.
- Use a phone with a web browser, signed in as technician A.
- Start on work order 1 on the phone.
Example values: part A = ZZAUTOTEST-PL-S9-08-A; part B = ZZAUTOTEST-PL-S9-08-B.
Quotes: S9-R3, FF-2, S9-R16, UFS-44. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-09 · C425727 · Purchase order line lookup does not offer an inactive part
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an inactive part, part A, with 4 on hand and a hyphen in its part number.
- Have an active part, part B, with 4 on hand, so the lookup has a part it must still offer.
- Give parts A and B part numbers that start with the same text, and descriptions that start with the same text, so one search finds both.
- Create an open purchase order for this test, purchase order A, with one line for another part, not yet received.
- Start on purchase order A (Parts in the top bar, Purchase Orders in the left menu, then purchase order A).
Example values: part A = ZZAUTOTEST-PL-S9-09-A; part B = ZZAUTOTEST-PL-S9-09-B.
Quotes: S9-R5, S9-R16, UFS-44. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-10 · C425728 · Changing the part a received vendor bill line points to skips inactive parts
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an inactive part, part A, with 4 on hand and a hyphen in its part number.
- Have an active part, part B, with 4 on hand, so the lookup has a part it must still offer.
- Give parts A and B part numbers that start with the same text, and descriptions that start with the same text, so one search finds both.
- Have a received vendor bill, bill A, with one line for a vendor part.
- Start on bill A (Parts in the top bar, Vendor Invoices in the left menu, then bill A).
Example values: part A = ZZAUTOTEST-PL-S9-10-A; part B = ZZAUTOTEST-PL-S9-10-B.
Quotes: S9-R6. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-11 · C425729 · Part sale line lookup does not offer an inactive part
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an inactive part, part A, with 4 on hand and a hyphen in its part number.
- Have an active part, part B, with 4 on hand, so the lookup has a part it must still offer.
- Give parts A and B part numbers that start with the same text, and descriptions that start with the same text, so one search finds both.
- Create an open part sale for this test, part sale A, with no parts.
- Start on part sale A's Parts tab (Parts in the top bar, Part Sales in the left menu, then part sale A).
Example values: part A = ZZAUTOTEST-PL-S9-11-A; part B = ZZAUTOTEST-PL-S9-11-B.
Quotes: S9-R8, S9-R16, SV-10822 acceptance criteria. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-12 · C425730 · A canned job is added without its inactive parts and one warning names them
State the tester sets up:
- Sign in as an Admin at the test location.
- Create three active parts for this test, part A, part B and part C, with part A's number coming before part B's from A to Z.
- Create a canned job for this test, canned job A, holding parts A, B and C, one of each.
- Set parts A and B inactive after canned job A is saved.
- Create an open work order, work order 1, for this test, with no lines.
- Start on work order 1, on its Lines tab.
Example values: part A = ZZAUTOTEST-PL-S9-12-A; part B = ZZAUTOTEST-PL-S9-12-B; part C = ZZAUTOTEST-PL-S9-12-C.
Quotes: S9-R9, S9-R10, S9-R10b, S9-R10c, UFS-43. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-13 · C425731 · The canned job warning names a typed vendor part by the inactive part's number
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test, with a hyphen in its part number, and an active part, part C.
- Create a canned job for this test, canned job A, holding part C and a vendor part typed in by hand whose number is part A's number in lower case with periods in place of its hyphens.
- Set part A inactive after canned job A is saved.
- Create an open work order, work order 1, for this test, with no lines.
- Start on work order 1, on its Lines tab.
Example values: part A = ZZAUTOTEST-PL-S9-13-A; part C = ZZAUTOTEST-PL-S9-13-C.
Quotes: S9-R9a, CN-S9-2, S9-R10, S9-R10b, SV-10822 acceptance criteria. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-14 · C425732 · A canned job leaves out the fee that belongs to an inactive part
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two active parts for this test, part A and part C.
- Create a canned job for this test, canned job A, holding part A with a part fee, fee 1, and part C with a part fee, fee 2.
- Set part A inactive after canned job A is saved.
- Create an open work order, work order 1, for this test, with no lines.
- Start on work order 1, on its Lines tab.
Example values: part A = ZZAUTOTEST-PL-S9-14-A; part C = ZZAUTOTEST-PL-S9-14-C.
Quotes: S9-R10a, S9-R10, UFS-43, SV-10822 acceptance criteria. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-15 · C425733 · Vendor return lookup offers an inactive part with a grey Inactive tag
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a vendor, vendor A.
- Create a part, part A, for this test, with vendor A and 4 on hand, and set it inactive.
- Create an active part, part B, for this test, with vendor A.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Start on the Create Return page (Parts in the top bar, Returns in the left menu, then the button that starts a new return).
Example values: part A = ZZAUTOTEST-PL-S9-15-A; part B = ZZAUTOTEST-PL-S9-15-B.
Quotes: S9-R11, S9-R12, KD-12. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-16 · C425734 · Vendor credit lookup offers an inactive part with a grey Inactive tag
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a vendor, vendor A.
- Have an inactive part, part A, with vendor A.
- Have an active part, part B, with vendor A.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Start on vendor A's page (Parts in the top bar, Vendors in the left menu, then the vendor A row).
Example values: part A = ZZAUTOTEST-PL-S9-16-A; part B = ZZAUTOTEST-PL-S9-16-B.
Quotes: S9-R11, S9-R12. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-17 · C425735 · A credit on a part sale invoice lists an inactive part with its tag
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two active parts for this test, part A with Sell Price $20.00 and part B with Sell Price $15.00.
- Create a part sale, part sale A, for this test, that sold one part A and one part B and is invoiced.
- Set part A inactive after the invoice was made.
- Start on part sale A (Parts in the top bar, Part Sales in the left menu, then part sale A).
Example values: part A = ZZAUTOTEST-PL-S9-17-A; part B = ZZAUTOTEST-PL-S9-17-B.
Quotes: S9-R13, KD-12. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-18 · C425736 · A credit on a work order invoice lists an inactive part with its tag
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two active parts for this test, part A with Sell Price $20.00 and part B with Sell Price $15.00.
- Create a work order, work order 1, for this test, that sold one part A and one part B and is invoiced.
- Set part A inactive after the invoice was made.
- Start on work order 1.
Example values: part A = ZZAUTOTEST-PL-S9-18-A; part B = ZZAUTOTEST-PL-S9-18-B.
Quotes: S9-R13, KD-12. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-19 · C425737 · A library entry stocked elsewhere is hidden when it matches an inactive part
State the tester sets up:
- Sign in as an Admin who can switch between two locations, the test location and location B, so a part can be stocked at location B only.
- Have an inactive part, part A, at the test location, with a hyphen in its part number.
- Create a part for this test at location B only whose number is part A's number with periods in place of its hyphens, number 1, so its Part Library entry matches part A.
- Create a part for this test at location B only whose number matches nothing at the test location, number 2, so the Part Library has a row the search must still offer.
- Give part A and the two location B parts descriptions that start with the same text, so one search finds all three.
- Create an open work order, work order 1, for this test, with an approved line, line 1, that holds no parts.
- Start on work order 1, on its Lines tab.
Example values: part A = ZZAUTOTEST-PL-S9-19-A.
Quotes: S9-R15, CN-S9-2, S12-R10. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-20 · C425738 · Typing an inactive part number in full shows the inactive message
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an inactive part, part A, with 4 on hand and a hyphen in its part number.
- Have an active part, part B, with 4 on hand, so the lookup has a part it must still offer.
- Give parts A and B part numbers that start with the same text, and descriptions that start with the same text, so one search finds both.
- Create an open work order, work order 1, for this test, with an approved line, line 1, that holds no parts.
- Start on work order 1, on its Lines tab.
Example values: part A = ZZAUTOTEST-PL-S9-20-A; part B = ZZAUTOTEST-PL-S9-20-B.
Quotes: S9-R16, UFS-44, CN-S9-2, KD-13, SV-10822 acceptance criteria. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-21 · C425739 · Saving a Part Request is refused once the part was retired meanwhile
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test, with 4 on hand.
- Create an open work order, work order 1, for this test, with an approved line, line 1, that holds no parts.
- Use a desktop browser that can open a second tab on the same ShopView address, signed in as the same user.
- Start in tab 1 on work order 1, on its Lines tab.
Example values: part A = ZZAUTOTEST-PL-S9-21-A.
Quotes: S9-R17, UFS-45, CN-S13-3, FO-6. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-22 · C425740 · Saving a part sale line is refused once the part was retired meanwhile
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test, with 4 on hand.
- Create an open part sale for this test, part sale A, with no parts.
- Use a desktop browser that can open a second tab on the same ShopView address, signed in as the same user.
- Start in tab 1 on part sale A's Parts tab.
Example values: part A = ZZAUTOTEST-PL-S9-22-A.
Quotes: S9-R17, UFS-45, CN-S13-3, FO-6. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-23 · C425741 · Saving a purchase order line is refused once the part was retired meanwhile
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test, with 4 on hand.
- Create an open purchase order for this test, purchase order A, with one line for another part, line 1, not yet received.
- Use a desktop browser that can open a second tab on the same ShopView address, signed in as the same user.
- Start in tab 1 on purchase order A.
Example values: part A = ZZAUTOTEST-PL-S9-23-A.
Quotes: S9-R17, UFS-45, CN-S13-3, FO-6. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-24 · C425742 · Global search lists an inactive part with a grey Inactive tag
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an inactive part, part A.
- Have an active part, part B, so the tag can be compared.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Make sure the Search box in the top bar is the global search, which lists inventory parts.
Example values: part A = ZZAUTOTEST-PL-S9-24-A; part B = ZZAUTOTEST-PL-S9-24-B.
Quotes: S9-R18. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-25 · C425743 · Selecting an inactive part in global search opens the Inactive tab
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an inactive part, part A.
- Make sure the Search box in the top bar is the global search, which lists inventory parts.
- Start on any page other than Inventory, such as Work Orders.
Example values: part A = ZZAUTOTEST-PL-S9-25-A.
Quotes: S9-R18, S9-R19. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-26 · C425744 · Global search shows Not Tracked for an untracked part
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an untracked part, part A, with 4 on its shelf.
- Have a tracked part, part B, with 4 on hand, so the badge can be compared.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Make sure the Search box in the top bar is the global search, which lists inventory parts.
Example values: part A = ZZAUTOTEST-PL-S9-26-A; part B = ZZAUTOTEST-PL-S9-26-B.
Quotes: S9-R20, UFS-42. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-27 · C425745 · A user who cannot view the Inventory list sees neither tab
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a custom role for this test, role B, with the Parts department on with Part Sales open to it and every Part Library & Inventory box unticked, so user B cannot view the Inventory list.
- Create a staff member for this test, user B, at the test location with role B, so the steps run with role B's permissions.
- Use a second browser window (a private window) signed in as user B.
Quotes: S9-N2. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-28 · C425746 · With Vendor Order Management Create & Edit, a return's part search works
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a custom role for this test, role B, with Vendor Order Management — View and Vendor Order Management — Create & Edit ticked and every Part Library & Inventory box unticked, so user B reaches parts only through Vendor Order Management.
- Create a staff member for this test, user B, at the test location with role B, so the steps run with role B's permissions.
- Use a second browser window (a private window) signed in as user B.
- Have a vendor, vendor A, and an inactive part, part A, with vendor A.
Example values: part A = ZZAUTOTEST-PL-S9-28-A.
Quotes: S9-N3a, S9-N3, S12-N1, Chris Ward, 27 Oct 2026, answer 22, SV-10822, Chris Ward, 23 Oct 2026. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-29 · C425747 · A completed part sale with an inactive part keeps its totals
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two active parts for this test, part A with Sell Price $20.00 and part B with Sell Price $15.00.
- Create a part sale for this test, part sale A, that sold 2 of part A and 1 of part B and is invoiced.
- Set part A inactive after the invoice was made.
- Start on part sale A's Parts tab.
Example values: part A = ZZAUTOTEST-PL-S9-29-A; part B = ZZAUTOTEST-PL-S9-29-B.
Quotes: S9-E1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-30 · C425748 · Changing a line to another inactive part is refused
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test, and add it to the approved line, line 1, of an open work order, work order 1, made for this test.
- Create two more parts for this test: part B, set inactive, and part C, left active.
- Set part A inactive after it is on line 1.
- Start on work order 1, on its Lines tab.
Example values: part A = ZZAUTOTEST-PL-S9-30-A; part B = ZZAUTOTEST-PL-S9-30-B; part C = ZZAUTOTEST-PL-S9-30-C.
Quotes: S9-E2a, S9-R17, S9-E2. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-31 · C425749 · A work order holding an inactive part can still be invoiced
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test, with Sell Price $20.00.
- Create a work order, work order 1, for this test, with part A picked on its line, line 1, and complete it, ready to invoice.
- Set part A inactive after work order 1 is complete.
- Start on work order 1's Finance tab.
Example values: part A = ZZAUTOTEST-PL-S9-31-A.
Quotes: S9-E3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-32 · C425750 · Reopening a completed work order leaves its inactive part inactive
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test.
- Create a work order, work order 1, for this test, with part A on its line, line 1, and complete it, not invoiced.
- Set part A inactive after work order 1 is complete.
- Start on work order 1.
Example values: part A = ZZAUTOTEST-PL-S9-32-A.
Quotes: S9-E5. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-33 · C425751 · A part retired while on order can still be ordered, received and picked
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a vendor, vendor A.
- Create an active part, part A, for this test, with vendor A and 0 on hand.
- Create an open work order, work order 1, for this test, whose approved line, line 1, has two Part Requests for part A from vendor A: Part Request 1 ordered on purchase order A, and Part Request 2 not yet ordered.
- Set part A inactive after that.
- Start on work order 1's Parts tab.
Example values: part A = ZZAUTOTEST-PL-S9-33-A.
Quotes: S9-E6. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-34 · C425752 · Splitting a work order moves a line that holds an inactive part
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test.
- Create an open work order, work order 1, for this test, with two approved lines: line 1 with no parts and line 2 holding part A.
- Set part A inactive after it is on line 2.
- Start on work order 1, on its Lines tab.
Example values: part A = ZZAUTOTEST-PL-S9-34-A.
Quotes: S9-E7. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-35 · C425753 · The parts import updates an inactive part in place and keeps it inactive
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test, with Min 1 and Max 5, and set it inactive.
- Have a parts import file with one row for part A with the same number, description, category, bin location and quantity, and Min 3.
- Start on the Inventory data import page (Settings, then Data Import, then Inventory).
Example values: part A = ZZAUTOTEST-PL-S9-35-A.
Quotes: S9-E8. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-36 · C425754 · A parts import row with a blank Manufacturer keeps the part's manufacturer
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test, with a manufacturer, manufacturer 1, and Min 1.
- Have a parts import file with one row for part A with the Manufacturer cell blank and Min 2.
- Start on the Inventory data import page (Settings, then Data Import, then Inventory).
Example values: part A = ZZAUTOTEST-PL-S9-36-A.
Quotes: S9-E8a. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-37 · C425756 · The Inventory Value report still lists a part after it is set inactive
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a tracked part, part A, for this test, with 4 on hand at a Cost of $12.50, so its stock is worth $50.00 (4 × $12.50).
- Set part A inactive.
- Start on the Inventory Value report (Reports in the top bar, then Inventory Value), for today at the test location.
Example values: part A = ZZAUTOTEST-PL-S9-37-A.
Quotes: S9-E11, ACC-7. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-38 · C425757 · The Parts Velocity report still lists an inactive part's sales
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test.
- Create a part sale for this test that sold 2 of part A today and is invoiced, so part A has sales to report.
- Set part A inactive after the sale.
- Start on the Parts Velocity report (Reports in the top bar, then Parts Velocity).
Example values: part A = ZZAUTOTEST-PL-S9-38-A.
Quotes: S9-E11. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-39 · C540882 · No invoice line or scan lookup exists that could offer an inactive part
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an inactive part, part A.
- Create an invoiced work order, work order 1, for this test, whose line, line 1, sold an active part, part B.
- Start on work order 1, on its Lines tab.
Example values: part A = ZZAUTOTEST-PL-S9-39-A; part B = ZZAUTOTEST-PL-S9-39-B.
Quotes: S9-R4, S9-R7, CN-S9-3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-40 · C573684 · The canned job warning lists inactive parts A to Z, separated by commas
State the tester sets up:
- Sign in as an Admin at the test location.
- Create four active parts for this test, part A, part B, part C and part D, whose part numbers run A to Z in that order.
- Create a canned job for this test, canned job A, holding, in this order, part C, part B, part A and part D, one of each.
- Set parts A, B and C inactive after canned job A is saved.
- Create an open work order, work order 1, for this test, with no lines.
- Start on work order 1, on its Lines tab.
Example values: part A = ZZAUTOTEST-PL-S9-40-A; part B = ZZAUTOTEST-PL-S9-40-B; part C = ZZAUTOTEST-PL-S9-40-C; part D = ZZAUTOTEST-PL-S9-40-D.
Quotes: S9-R10c, S9-R10, S9-R10b, S9-R9, UFS-43, Chris Ward's answer 9 of 14 Oct 2026. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-41 · C573685 · Without Vendor Order Management, Returns is hidden and cannot be opened
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a custom role for this test, role B, with Part Library & Inventory — View and no Vendor Order Management permission, so user B can see parts but not vendor orders.
- Create a staff member for this test, user B, at the test location with role B, so the steps run with role B's permissions.
- Use a second browser window (a private window) signed in as user B.
- Write down the address of the Returns list: as the Admin, open Parts, then Returns, and copy the address from the browser's address bar.
Quotes: S9-N3a, S12-N1, Chris Ward, 27 Oct 2026, answer 22. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-42 · C573686 · With Vendor Order Management View only, a return's part search is refused
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a custom role for this test, role B, with Vendor Order Management — View only: no Vendor Order Management — Create & Edit, no Part Library & Inventory box, no Part Sales — Create & Edit, no work order permission to pick parts, no Settings permission and no See Financial Data, so no setting gives user B part search access.
- Create a staff member for this test, user B, at the test location with role B, so the steps run with role B's permissions.
- Use a second browser window (a private window) signed in as user B.
- Have a vendor, vendor A, and an active part, part A, with vendor A.
- Write down the address of the Create Return page: as the Admin, open Parts, then Returns, click Create Return, and copy the address from the browser's address bar.
Example values: part A = ZZAUTOTEST-PL-S9-42-A.
Quotes: S9-N3, S9-N3a, S12-N1, Chris Ward, 27 Oct 2026, answer 22, Chris Ward, 27 Oct 2026, answer 22. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-43 · C839430 · The work order part lookup shows Not Tracked for an untracked part
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an untracked part, part A, with 3 in one bin location, bin location A.
- Have a tracked part, part B, with 4 on hand, so the lookup rows can be compared.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Create an open work order, work order 1, for this test, with an approved line, line 1, that holds no parts.
- Start on work order 1, on its Lines tab.
Example values: part A = ZZAUTOTEST-PL-S9-43-A; part B = ZZAUTOTEST-PL-S9-43-B.
Quotes: S9-R21, FO-7. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-44 · C839431 · The estimate part lookup shows Not Tracked for an untracked part
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an untracked part, part A, with 3 in one bin location, bin location A.
- Have a tracked part, part B, with 4 on hand, so the lookup rows can be compared.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Create a work order for this test, work order 1, that is still an estimate, with a line, line 1, that holds no parts.
- Start on work order 1, on its Lines tab.
Example values: part A = ZZAUTOTEST-PL-S9-44-A; part B = ZZAUTOTEST-PL-S9-44-B.
Quotes: S9-R21, FO-7. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-45 · C839432 · The part sale part lookup shows Not Tracked for an untracked part
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an untracked part, part A, with 3 in one bin location, bin location A.
- Have a tracked part, part B, with 4 on hand, so the lookup rows can be compared.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Create an open part sale for this test, part sale A, with no parts.
- Start on part sale A's Parts tab.
Example values: part A = ZZAUTOTEST-PL-S9-45-A; part B = ZZAUTOTEST-PL-S9-45-B.
Quotes: S9-R21, FO-7. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-46 · C839433 · The purchase order part lookup shows Not Tracked for an untracked part
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an untracked part, part A, with 3 in one bin location, bin location A.
- Have a tracked part, part B, with 4 on hand, so the lookup rows can be compared.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Create an open purchase order for this test, purchase order A.
- Start on purchase order A.
Example values: part A = ZZAUTOTEST-PL-S9-46-A; part B = ZZAUTOTEST-PL-S9-46-B.
Quotes: S9-R21, FO-7. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-47 · C839434 · On a work order, an untracked part with nothing on hand shows In Stock
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an untracked part, part A, for this test, with 0 on its shelf.
- Create an open work order, work order 1, for this test, with an approved line, line 1, that holds no parts.
- Start on work order 1, on its Lines tab.
Example values: part A = ZZAUTOTEST-PL-S9-47-A.
Quotes: S9-R22, FO-7. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-48 · C839435 · On a part sale, an untracked part with nothing on hand shows In Stock
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an untracked part, part A, for this test, with 0 on its shelf.
- Create an open part sale for this test, part sale A, with no parts.
- Start on part sale A's Parts tab.
Example values: part A = ZZAUTOTEST-PL-S9-48-A.
Quotes: S9-R22, FO-7. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S9-49 · C847728 · Global search never lists a part's core
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active, tracked part, part A, for this test with a Core Charge of $25.00, so it has a core described Core for followed by part A's description.
- Create a part, part B, for this test with a Core Charge of $25.00, then set it inactive and turn its tracking off, so its core is inactive and untracked too.
- Make sure the Search box in the top bar is the global search, which lists inventory parts.
Example values: part A = ZZAUTOTEST-PL-S9-49-A; part B = ZZAUTOTEST-PL-S9-49-B.
Quotes: S9-R18a, S9-R18, S9-R20, FO-10, Chris Ward, 27 Oct 2026, answer 13. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-01 · C154789 · Saving a different Part Status asks to confirm first
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S10-01-A.
Quotes: S10-R1, S10-R2, S13-R21, KD-11. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-02 · C154790 · A bulk change that partly fails lists the failed part and its reason
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two active parts for this test, part A and part B.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Use a desktop browser that can open a second tab on the same ShopView address, signed in as the same user.
- Start in tab 1 on the Inventory page, on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S10-02-A; part B = ZZAUTOTEST-PL-S10-02-B.
Quotes: S10-R12, S10-R13, S10-R13a, UFS-30, UFS-37, S2-R15. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-03 · C154791 · A status change records who made it and when
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test.
- Write down the date and time on your computer clock just before step 1.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S10-03-A.
Quotes: S10-R14, S10-R17. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-04 · C154792 · Deactivating then reactivating keeps two Part History entries
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S10-04-A.
Quotes: S10-R16, S10-R17. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-05 · C154793 · A Part History status entry reads with or without a note
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two active parts for this test, part A and part B.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S10-05-A; part B = ZZAUTOTEST-PL-S10-05-B.
Quotes: S10-R17. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-06 · C154794 · The bulk confirmation title and first line give the count
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two active parts, part A and part B, and an inactive part, part C, for this test.
- Give parts A, B and C part numbers that start with the same text, so one search lists all three.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S10-06-A; part B = ZZAUTOTEST-PL-S10-06-B; part C = ZZAUTOTEST-PL-S10-06-C.
Quotes: S10-R3, S10-R4, S10-R1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-07 · C154795 · The bulk deactivation confirmation shows its three lines in order
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two active parts for this test, part A and part B.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S10-07-A; part B = ZZAUTOTEST-PL-S10-07-B.
Quotes: S10-R5. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-08 · C154796 · The reactivation confirmation from the part window has one line
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an inactive part, part A, for this test.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Inactive tab.
Example values: part A = ZZAUTOTEST-PL-S10-08-A.
Quotes: S10-R7, S10-R4, S10-R11. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-09 · C154797 · The confirmation note field is labelled Note (Optional) and stops at 255
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test.
- Have a text of 300 characters ready to paste: 1234567890 written 30 times in a row (30 × 10 = 300).
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S10-09-A.
Quotes: S10-R10, S10-R17. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-10 · C154798 · Part History columns keep their width for a short entry
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an inactive part, part A, whose newest Part History entry is a short "Deactivated".
- Have a part, part B, with a long "Description updated" entry in its Part History, so the two pages can be compared.
- Keep the browser window the same size for the whole test.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Inactive tab.
Example values: part A = ZZAUTOTEST-PL-S10-10-A; part B = ZZAUTOTEST-PL-S10-10-B.
Quotes: S10-R21. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-11 · C154799 · The confirm button is red to deactivate and blue to activate
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, and an inactive part, part B, for this test.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S10-11-A; part B = ZZAUTOTEST-PL-S10-11-B.
Quotes: S10-R11. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-12 · C154800 · Cancelling the confirmation changes nothing
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two active parts for this test, part A and part B.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S10-12-A; part B = ZZAUTOTEST-PL-S10-12-B.
Quotes: S10-N1, S13-R23. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-13 · C425760 · The part window's confirmation names the part as typed in the form
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test, with a description, description 1.
- Use a new description, description 2, that no part uses.
- Create an inactive part, part B, for this test, with a description, description 3.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S10-13-A; part B = ZZAUTOTEST-PL-S10-13-B.
Quotes: S10-R4, S10-R3, S10-N1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-14 · C425761 · The part window's deactivation confirmation shows its three lines in order
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S10-14-A.
Quotes: S10-R6, S10-N1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-15 · C425762 · The bulk reactivation confirmation shows its two lines
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two inactive parts for this test, part A and part B.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Inactive tab.
Example values: part A = ZZAUTOTEST-PL-S10-15-A; part B = ZZAUTOTEST-PL-S10-15-B.
Quotes: S10-R8. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-16 · C425763 · Confirmation lines use medium weight and grey as specified
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, and an inactive part, part B, for this test.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Make sure the app is in the Light theme.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S10-16-A; part B = ZZAUTOTEST-PL-S10-16-B.
Quotes: S10-R9, S10-R8. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-17 · C425764 · A bulk change that succeeds says how many parts were updated
State the tester sets up:
- Sign in as an Admin at the test location.
- Create three active parts for this test, part A, part B and part C.
- Give parts A, B and C part numbers that start with the same text, so one search lists all three.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S10-17-A; part B = ZZAUTOTEST-PL-S10-17-B; part C = ZZAUTOTEST-PL-S10-17-C.
Quotes: S10-R12, UFS-28. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-18 · C425765 · A bulk change lists a part deleted meanwhile as Part not found
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two active parts for this test, part A and part B, that sit on no work order and no return.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Use a desktop browser that can open a second tab on the same ShopView address, signed in as the same user.
- Start in tab 1 on the Inventory page, on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S10-18-A; part B = ZZAUTOTEST-PL-S10-18-B.
Quotes: S10-R13, S10-R13a, UFS-36, UFS-30. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-19 · C425766 · A core has no row of its own to tick in Deactivate parts
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an active part, part A, with a Core Charge above $0, so it has a core described Core for followed by part A's description.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S10-19-A.
Quotes: S5-E3, KD-8, FO-10. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-20 · C425767 · A note of only spaces records no note
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S10-20-A.
Quotes: S10-R15, S10-R17. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-21 · C425768 · A bulk change of forty parts writes forty Part History entries
State the tester sets up:
- Sign in as an Admin at the test location.
- Create forty active parts for this test whose part numbers start with the same text, so one search lists all forty and no other part.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S10-R18, UFS-28, S2-R6. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-23 · C425770 · A status entry has Staff, Date and Time and can be searched
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test, so its Part History already holds its creation entries.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S10-23-A.
Quotes: S10-R20, S10-R27. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-24 · C425771 · Turning tracking off and on writes two Part History entries
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active, tracked part, part A, for this test, with nothing on hand (quantity 0).
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S10-24-A.
Quotes: S10-R22, S5-R5. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-25 · C425772 · Changing Min and Max in the part window writes one entry with both
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a tracked part, part A, for this test, with Min 2 and Max 6.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S10-25-A.
Quotes: S10-R22a, SV-10823, Chris Ward, 23 Oct 2026. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-25b · C839436 (split from S10-25) · Changing only Max writes only the Max pair, and no change writes nothing
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a tracked part, part A, for this test, with Min 2, Max 6 and Sell Price $20.00.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S10-25b-A.
Quotes: S10-R22a, SV-10823, Chris Ward, 23 Oct 2026. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-26 · C425773 · Changing only Min through the parts import writes an Import entry
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a tracked part, part A, for this test, with Min 2 and Max 6.
- Have a parts import file with one row for part A with the same values except Min 4 (Max stays 6).
- Start on the Inventory data import page (Settings, then Data Import, then Inventory).
Example values: part A = ZZAUTOTEST-PL-S10-26-A.
Quotes: S10-R22a, S5-E1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-27 · C425774 · Changing a part number is recorded at both locations with Changed at
State the tester sets up:
- Sign in as an Admin who can switch between two locations, the test location and location B, so the change can be seen at both.
- Create a part, part A, for this test at the test location and at location B under the same part number, so both share one Part Library entry.
- Use a new part number, number 2, that no part or Part Library entry uses.
- Start at the test location on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S10-27-A.
Quotes: S10-R23, S10-R25, UFS-12. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-28 · C425775 · Changing a description is recorded at both locations with Changed at
State the tester sets up:
- Sign in as an Admin who can switch between two locations, the test location and location B, so the change can be seen at both.
- Create a part, part A, for this test at the test location and at location B under the same part number, with a description, description 1, so both share one Part Library entry.
- Use a new description, description 2, that no part uses.
- Start at the test location on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S10-28-A.
Quotes: S10-R24, S10-R25, UFS-11. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-30 · C425778 · Part History search finds entries by their text or staff name, in any case
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test, then deactivate it with the note Superseded Kit, reactivate it with no note and turn its tracking off, so its Part History holds those three entries from you.
- Start on part A's Part History page (the clock icon at the left of its row).
Example values: part A = ZZAUTOTEST-PL-S10-30-A.
Quotes: S10-R27. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-31 · C425779 · Part History search shows only the bin rows that match
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a part, part A, whose Part History has one entry split into a bin location A row and a bin location B row.
- Start on part A's Part History page (the clock icon at the left of its row).
Example values: part A = ZZAUTOTEST-PL-S10-31-A.
Quotes: S10-R28. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-32 · C425780 · Prices in Part History can be searched only by users who see prices
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a custom role for this test, role B, with Part Library & Inventory — View and See Financial Data off, so user B cannot see prices.
- Create a staff member for this test, user B, at the test location with role B, so the steps run with role B's permissions.
- Use a second browser window (a private window) signed in as user B.
- Create a part, part A, for this test with Sell Price $20.00, then change its Sell Price to 23.45, so its Part History holds a price entry.
- Start window 1 on part A's Part History page (the clock icon at the left of its row).
Example values: part A = ZZAUTOTEST-PL-S10-32-A.
Quotes: S10-R29. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-33 · C425781 · A bulk change where every part fails keeps the selection
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two active parts for this test, part A and part B.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Use a desktop browser that can open a second tab on the same ShopView address, signed in as the same user.
- Start in tab 1 on the Inventory page, on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S10-33-A; part B = ZZAUTOTEST-PL-S10-33-B.
Quotes: S10-N2, UFS-31, UFS-37. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-34 · C425782 · With nothing ticked, the bulk button cannot open a confirmation
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S10-34-A.
Quotes: S2-N1, S2-R8, UFS-32. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-35 · C540883 · The bulk change count does not count the cores that change with their parts
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two active parts for this test, part A and part B, each with a Core Charge above $0, so each has a core.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S10-35-A; part B = ZZAUTOTEST-PL-S10-35-B.
Quotes: S10-R12, S10-R12a, UFS-28, SV-10823 acceptance criteria. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S10-36 · C847729 · Pressing Esc or clicking outside does not close a status confirmation
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two active parts for this test, part A and part B.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Make sure no Cycle count is running on the Inventory list.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S10-36-A; part B = ZZAUTOTEST-PL-S10-36-B.
Quotes: S10-R11a, S13-R23, S10-N1, S10-R4, Chris Ward, 27 Oct 2026, answer 19. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-01 · C154828 · The Part Library page has no button that creates an entry
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a part, part A, at the test location, so the Part Library lists its entry.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Example values: part A = ZZAUTOTEST-PL-S11-01-A.
Quotes: S11-R1, S11-R2, S11-R3, KD-17. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-02 · C154829 · Clicking a Part Library row opens the entry's detail page
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test at the test location only, so its entry's detail page lists one location and one part.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Example values: part A = ZZAUTOTEST-PL-S11-02-A.
Quotes: S11-R3, S11-R3c, S12-R3, Chris Ward, 14 Oct 2026, answer 12, Chris Ward, 27 Oct 2026, answer 20. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-03 · C154830 · Creating a part with a new number adds one Part Library entry
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a new part number that no Part Library entry has yet, so saving the part must make a new entry.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S11-R6, S7-R7, S7-R10, S11-N1, KD-17. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-03b · C839437 (split from S11-03) · The parts import adds a Part Library entry for a new part number
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a new part number that no Part Library entry has yet.
- Have a parts import file with one row for the new part number, with a description, a category, a cost of 10.00 and a quantity of 2, so the import adds a part.
- Start on the Inventory data import page (Settings, then Data Import, then Inventory).
- Import file: the template from Settings → Data Import → Inventory (columns name, part_number, uom, quantity, min_qty, max_qty, grid_location, purchase_price, core_price, vendor, manufacturer, category, tags), one row with part_number ZZAUTOTEST-PL-S11-03b-A, name ZZAUTOTEST PL S11-03b, category Uncategorized, purchase_price 10.00, quantity 2.
Quotes: S11-R6, S11-N1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-04 · C154831 · Part Library entries from before the release stay listed
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a Part Library entry from before this release, entry A, that no part uses ("Total parts" 0).
- Have a second Part Library entry from before this release, entry B, that a part uses.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Quotes: S11-E1, CN-S11-1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-05 · C425607 · Users with and without Create & Edit see the same Part Library toolbar
State the tester sets up:
- Sign in as an Admin at the test location in one browser.
- Use a second browser, or a private window, signed in at the test location as user B, whose role has only 'Part Library & Inventory → View' in the Part Library and Inventory group (no Create & Edit, no Delete).
Quotes: S11-R7, S11-R1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-06 · C425608 · Part Library rows can still be ticked and given a category with Set category
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two parts for this test, part A and part B, both in category A.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Make sure a second category, category B, exists.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Example values: part A = ZZAUTOTEST-PL-S11-06-A; part B = ZZAUTOTEST-PL-S11-06-B.
Quotes: S11-R4. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-07 · C425609 · Part Library search, filters, sorting and columns still work
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two parts for this test with no manufacturer: part A in category A and part B in category B, with descriptions that sort A to Z with part A's first.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Make sure at least one manufacturer exists, manufacturer A.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Example values: part A = ZZAUTOTEST-PL-S11-07-A; part B = ZZAUTOTEST-PL-S11-07-B.
Quotes: S11-R5. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-08 · C425610 · Changing an entry's number on the Part Library page renames the part
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Create a part, part A, for this test at the test location and at location B under the same part number, so both share one Part Library entry.
- Use a new part number that no part and no Part Library entry has yet.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Example values: part A = ZZAUTOTEST-PL-S11-08-A.
Quotes: S11-R3a, S13-R16, S13-R18, S10-R23, S10-R25, UFS-12. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-08b · C839438 (split from S11-08) · The Part Library window warns while a new number differs from the saved one
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Have a part, part A, at the test location and at location B under the same part number, so its entry is shared with one other location.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Example values: part A = ZZAUTOTEST-PL-S11-08b-A.
Quotes: S11-R3a, S13-R16, S13-R17, UFS-12. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-09 · C425611 · Changing an entry's description on the Part Library page reaches every location
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Create a part, part A, for this test at the test location (active) and at location B (inactive there) under the same part number, with description 1.
- Use a new description, description 2.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Example values: part A = ZZAUTOTEST-PL-S11-09-A.
Quotes: S11-R3a, S13-R14, S10-R24, S10-R25, OOS-5. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-09b · C839439 (split from S11-09) · The description warning counts a location where the part is inactive
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Have a part, part A, active at the test location and inactive at location B under the same part number, so the only other location that stocks it has it inactive.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Example values: part A = ZZAUTOTEST-PL-S11-09b-A.
Quotes: S11-R3a, S13-R12, S13-R13, UFS-11, Chris Ward, 9 Oct 2026, answer 5. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-10 · C425612 · The Part Library page refuses a number another entry has exactly
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Create a part, part A, for this test at the test location only.
- Create a part, part B, for this test at location B only, with its part number in capital letters, so it is a separate Part Library entry the test location does not stock.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Example values: part A = ZZAUTOTEST-PL-S11-10-A; part B = ZZAUTOTEST-PL-S11-10-B.
Quotes: S11-R3a, S13-N1, KD-6, CN-S13-3, UFS-13, S12-R3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-11 · C425613 · A number changed on the Part Library page reaches an open part request
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test at the test location.
- Create a work order for this test, work order 1, with a line holding a part request for part A, quantity 1, not yet received.
- Use a new part number that no part and no Part Library entry has yet.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Example values: part A = ZZAUTOTEST-PL-S11-11-A.
Quotes: S11-R3a, S13-R19, TERM-6. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-12 · C425614 · A Part Library number over 50 characters is refused on an open part request
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test at the test location.
- Create a work order for this test, work order 1, with a line holding a part request for part A, not yet received, so part A sits on an open part request.
- Use two new part numbers that no Part Library entry has, one exactly 51 characters long and one exactly 50 characters long.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Example values: part A = ZZAUTOTEST-PL-S11-12-A.
- 51 characters: ZZAUTOTEST-PL-S11-12-A-XXXXXXXXXXXXXXXXXXXXXXXXXXXX (count it); 50 characters: one X fewer.
Quotes: S11-R3a, S13-N7, UFS-16, CN-S13-3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-13 · C425615 · The Part Library page keeps upper and lower case in a typed part number
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test at the test location.
- Use a new part number written in mixed capitals and small letters that no Part Library entry has.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Example values: part A = ZZAUTOTEST-PL-S11-13-A.
Quotes: S11-R3b. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-14 · C425616 · A part requested from a vendor reaches the Part Library when it is received
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a new part number that no Part Library entry has and no inventory part uses.
- Have a vendor, vendor A.
- Create a work order for this test, work order 1, with an approved line.
- Start on work order 1 (Work Orders in the top bar, then open work order 1).
Quotes: S11-R6, S11-N1, §1 Clarifications, Q11 Part request entry timing. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-15 · C425617 · Spaces around a typed part number do not create a second Part Library entry
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Create a part, part A, for this test at the test location only.
- Start at location B on the Inventory page (pick location B in the location selector, then Parts, then Inventory).
Example values: part A = ZZAUTOTEST-PL-S11-15-A.
Quotes: S11-R6a, S7-R3, S7-R4, S7-R5, S7-R10. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-16 · C425618 · An entry with no part behind it can be edited and a new part links to it
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a Part Library entry with no part behind it for this test, entry A: create a part at the test location, then delete it, so its entry stays with "Total parts" 0.
- Use two descriptions that differ from each other and from entry A's, description 1 and description 2.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Quotes: S11-E2, S7-R5, S7-R6, S7-R9, QA lead, 9 Oct 2026, set-up answer 4. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-17 · C540877 · Receiving a typed purchase order line adds its number to the Part Library
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a new part number that no Part Library entry has and no inventory part uses.
- Have a vendor, vendor A.
- Start on the Purchase Orders page (Parts in the top bar, then Purchase Orders in the left menu).
Quotes: S11-R6, S11-N1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-18 · C573671 · Delete is disabled while a part still uses the Part Library entry
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test at the test location only, on no work order and with no open return or credit, so it can be deleted later in the test.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Example values: part A = ZZAUTOTEST-PL-S11-18-A.
Quotes: S11-R3c, S11-R3, S12-R13, UFS-01, Chris Ward, 14 Oct 2026, answer 12, QA lead, 9 Oct 2026, set-up answer 4, Chris Ward, 27 Oct 2026, answer 20. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-19 · C839440 · The entry's Parts table shows Not Tracked for a location that does not count it
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Have a part, part A, stocked at the test location and at location B under the same part number: tracked at the test location with 4 in its bin, and untracked at location B with 3 in its bin.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Example values: part A = ZZAUTOTEST-PL-S11-19-A.
Quotes: S11-R8. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-20 · C839441 · The entry's Parts table tags a location where the part is inactive
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Have a part, part A, tracked at the test location and at location B under the same part number: active at the test location with 4 in its bin, and inactive at location B with 2 in its bin.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Example values: part A = ZZAUTOTEST-PL-S11-20-A.
Quotes: S11-R9. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S11-21 · C847730 · Delete in Edit Library Part is enabled only after the page is reloaded
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test at the test location only, on no work order and with no open return, credit or part request, so it can be deleted later in the test.
- Use a desktop browser that can open a second tab on the same ShopView address, signed in as the same user.
- Start in browser tab 1 on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Example values: part A = ZZAUTOTEST-PL-S11-21-A.
Quotes: S11-E5, S11-R3c, UFS-01, Chris Ward, 27 Oct 2026, answer 15. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S12-01 · C154832 · The Parts menu, page title and browser tab read Part Library
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a part, part A, at the test location, so the Part Library lists an entry to open.
- Start on the Work Orders page (Work Orders in the top bar).
Example values: part A = ZZAUTOTEST-PL-S12-01-A.
Quotes: S12-R1, S12-R2, S12-R12, CN-S12-1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S12-02 · C154833 · Deleting an unused Part Library entry asks and confirms in Part Library words
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a Part Library entry with no part behind it for this test, entry A: create a part at the test location, then delete it, so the entry stays with "Total parts" 0.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Quotes: S12-R13, S12-R5, S11-R3, Chris Ward, 14 Oct 2026, answer 12, QA lead, 9 Oct 2026, set-up answer 4. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S12-03 · C154834 · Roles & Permissions shows the Part Library and Inventory permission group
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a custom role for this test, role A, so no shared role is opened.
- Start on Roles & Permissions (Settings, then Roles & Permissions).
Quotes: S12-R6, S12-R7, S12-R8, S12-R9. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S12-04 · C154835 · An old bookmark to the Catalog page opens the Part Library
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a bookmark, saved before this release, to the Catalog page (your ShopView address followed by /parts/parts-catalogue).
- Start on any page of the app in the same browser.
Quotes: S12-N2, S12-R2, SV-10825, acceptance criteria, Phase 9 frontend changes. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S12-05 · C425619 · The edit window for a Part Library entry is titled Edit Library Part
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a part, part A, at the test location, so its Part Library entry can be opened.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Example values: part A = ZZAUTOTEST-PL-S12-05-A.
Quotes: S12-R3, S11-R3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S12-06 · C425620 · Deleting a Part Library entry that a part now uses is refused
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a Part Library entry with no part behind it for this test, entry A: create a part at the test location, then delete it, so the entry stays with "Total parts" 0.
- Use a desktop browser that can open a second tab on the same ShopView address, signed in as the same user.
- Start in browser tab 1 on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Quotes: S12-R11, S12-R11a, S12-R13, UFS-46, CN-S13-3, S11-R3c, S11-E5, §1 Clarifications, Q9 S12-R11 copy, Chris Ward, 27 Oct 2026, answer 15, Chris Ward, 27 Oct 2026, answer 24. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S12-07 · C425621 · Saving a Part Library entry deleted in another tab is refused
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a Part Library entry with no part behind it for this test, entry A: create a part at the test location, then delete it, so the entry stays with "Total parts" 0.
- Use a new description for entry A, description 1.
- Use a desktop browser that can open a second tab on the same ShopView address, signed in as the same user.
- Start in browser tab 1 on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Quotes: S11-E4, S12-R4, S12-R5, S12-R11, CN-S13-3, Chris Ward, 9 Oct 2026, answer 8, Chris Ward, 14 Oct 2026, answer 1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S12-08 · C425623 · A part lookup result from the shared list shows Part Library as its source
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a part, part A, at the test location with 5 on hand, so the lookup offers it both from stock and from the Part Library.
- Create a work order for this test, work order 1, with a line.
- Start on work order 1 (Work Orders in the top bar, then open work order 1).
Example values: part A = ZZAUTOTEST-PL-S12-08-A.
Quotes: S12-R10. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S12-09 · C425624 · A special-order lookup result shows Part Library and its vendor
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a vendor, vendor A.
- Have a special-order number that the test location received from vendor A on a special-order line of a work order within the last 12 months, and that is not an inventory part here.
- Create a work order for this test, work order 1, with a line.
- Start on work order 1 (Work Orders in the top bar, then open work order 1).
Quotes: S12-R14, S12-R14a, Chris Ward, 14 Oct 2026, answer 2, Phase 7 frontend changes, PartSelect.vue. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S12-10 · C425625 · Release day leaves every role's permissions as they were
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a custom role from before this release, role A, with View and Create & Edit ticked and Delete unticked in the parts inventory group.
- Have a screenshot of role A's permissions taken before this release, so they can be compared.
- Use a second browser, or a private window, signed in as user B, who has had role A since before this release.
- Start on Roles & Permissions (Settings, then Roles & Permissions).
Quotes: S12-N1, S12-R6, S8-R12. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S12-11 · C425626 · Release day keeps saved names that contain the word Catalog
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a custom role from before this release, role A, whose name contains the word Catalog.
- Have a part from before this release, part A, whose description contains the word Catalog.
- Start on Roles & Permissions (Settings, then Roles & Permissions).
Example values: part A = ZZAUTOTEST-PL-S12-11-A.
Quotes: S12-N3, CN-S12-1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S12-12 · C573672 · A special order not yet received is not offered with its vendor
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a vendor, vendor A.
- Have a special-order number that the test location received from vendor A within the last 12 months, the received number, so the lookup has a result it must show with vendor A.
- Create a special order for this test from vendor A on a work order line, with a new part number, the ordered number, and order it, but receive it nowhere.
- Create a work order for this test, work order 1, with a line.
- Start on work order 1 (Work Orders in the top bar, then open work order 1).
Quotes: S12-R14a, S12-R14, Chris Ward, 14 Oct 2026, answer 2. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S12-13 · C573673 · A special order received only at another location is not offered with its vendor
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Have a vendor, vendor A.
- Have a special-order number that location B received from vendor A on a special-order line within the last 12 months; the test location never received it and does not stock it.
- Create a work order for this test at the test location, work order 1, with a line.
- Create a work order for this test at location B, work order 2, with a line.
- Start on work order 1 (Work Orders in the top bar, then open work order 1).
Quotes: S12-R14a, S12-R14, S12-R10, S11-R6. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S12-14 · C573674 · The special-order result uses the vendor and cost of the latest delivery
State the tester sets up:
- Sign in as an Admin at the test location.
- Have two vendors, vendor A and vendor B.
- Create a special-order part number for this test that the test location ordered from vendor A first and from vendor B second, but received from vendor B first at a cost of $12.00 and from vendor A last at a cost of $15.00, all within the last 12 months, so vendor A made the most recent delivery.
- Create a work order for this test, work order 1, with a line.
- Start on work order 1 (Work Orders in the top bar, then open work order 1).
- Where the cost shows is our reading of S12-R14b ("uses that delivery's cost"): the picked result fills Cost. Question Q14 asks Product to confirm.
Quotes: S12-R14b, S12-R14a, S12-R14, Chris Ward, 14 Oct 2026, answer 2. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S12-15 · C847731 · Opening the address of a deleted Part Library entry says it is not found
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a Part Library entry with no part behind it for this test, entry A: create a part at the test location, then delete it, so the entry stays with "Total parts" 0.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Quotes: S12-R11a, S12-R11, UFS-47, CN-S13-3, S12-R5, S12-R13, Chris Ward, 27 Oct 2026, answer 24. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-01 · C154836 · The part window title row shows Active or Inactive beside the close X
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an active part, part A, and an inactive part, part B, at the test location.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-01-A; part B = ZZAUTOTEST-PL-S13-01-B.
Quotes: S13-R1, S13-R2, S13-R3, S9-R14. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-02 · C154837 · Editing shows Description and Part Number as plain text fields
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a part, part A, at the test location.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-02-A.
Quotes: S13-R11. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-03 · C154838 · Saving a new part number renames the part in place
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Create a part, part A, for this test at the test location and at location B under the same part number, with 3 in its default bin at the test location.
- Set part A's Sell Price to a new value once before the test, so its Part History already has an entry.
- Use a new part number that no part and no Part Library entry has yet, and that does not contain part A's number.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-03-A.
Quotes: S13-R18, S10-R23, FO-9, KD-2. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-04 · C154839 · Changing the part number warns how many other locations it changes
State the tester sets up:
- Sign in as an Admin who can switch between three locations: the test location, location B and location C.
- Have a part, part A, at the test location, at location B (active there) and at location C (inactive there), under the same part number.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-04-A.
Quotes: S13-R16, S13-R17, UFS-12. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-04b · C839443 (split from S13-04) · The part number warning says 1 other location, or nothing for one location
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Have a part, part B, at the test location and at location B under the same part number.
- Have a part, part C, at the test location only.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part B = ZZAUTOTEST-PL-S13-04b-B; part C = ZZAUTOTEST-PL-S13-04b-C.
Quotes: S13-R16, UFS-12. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-05 · C154840 · A number that another Part Library entry has exactly is refused
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Create a part, part A, for this test at the test location.
- Create a part, part B, for this test at location B only, so its separate Part Library entry is one the test location does not stock.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-05-A; part B = ZZAUTOTEST-PL-S13-05-B.
Quotes: S13-N1, KD-6, CN-S13-3, UFS-13, §1 Clarifications, Q2 S13-N1 rename refusal. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-06 · C425684 · Edit Inventory Part lists its fields in the set order
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an active tracked part, part A, at the test location.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-06-A.
Quotes: S13-R4, S13-R5. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-07 · C425685 · New Inventory Part lists its fields in the set order
State the tester sets up:
- Sign in as an Admin at the test location.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S13-R4. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-08 · C425686 · Cost and price fields show only to a user who can see financial data
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a second browser, or a private window, signed in at the test location as user B, whose role has 'Part Library & Inventory → View', 'Part Library & Inventory → Create & Edit' and 'Part Library & Inventory → Delete' but not See Financial Data.
- Have a tracked part, part A, at the test location.
- Start in both browsers on the Inventory page, on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-08-A.
Quotes: S13-R4a. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-09 · C425687 · The part window footer shows Delete Part, Cancel and Save
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a part, part A, at the test location.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-09-A.
Quotes: S13-R6, S13-R7, S13-R8, S13-R9. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-10 · C425688 · Cancel closes the part window without saving
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test with description 1 and a Sell Price of $20.00.
- Use a different description, description 2.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-10-A.
Quotes: S13-R8. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-11 · C425689 · Delete Part shows only on an existing part, to a user with Delete
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a second browser, or a private window, signed in at the test location as user B, whose role has 'Part Library & Inventory → View' and 'Part Library & Inventory → Create & Edit' but not 'Part Library & Inventory → Delete'.
- Have a part, part A, at the test location.
- Start in both browsers on the Inventory page, on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-11-A.
Quotes: S13-R10, S8-R12. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-12 · C425690 · Changing the description warns how many other locations it changes
State the tester sets up:
- Sign in as an Admin who can switch between three locations: the test location, location B and location C.
- Have a part, part A, at the test location, at location B (active there) and at location C (inactive there), under the same part number.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-12-A.
Quotes: S13-R12, S13-R13, UFS-11, Chris Ward, 9 Oct 2026, answer 5. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-12b · C839444 (split from S13-12) · The description warning says 1 other location, or nothing for one location
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Have a part, part B, at the test location and at location B under the same part number.
- Have a part, part C, at the test location only.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part B = ZZAUTOTEST-PL-S13-12b-B; part C = ZZAUTOTEST-PL-S13-12b-C.
Quotes: S13-R12, UFS-11. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-13 · C425691 · Saving a new description changes it at every location
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Create a part, part A, for this test at the test location and at location B under the same part number, with description 1.
- Use a new description, description 2.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-13-A.
Quotes: S13-R14, FO-9, OOS-5. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-14 · C425692 · A number that differs from another entry only in letter case is accepted
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Create a part, part A, for this test at the test location only.
- Create a part, part B, for this test at location B only, with its part number in capital letters, so it is a separate entry the test location does not stock.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-14-A; part B = ZZAUTOTEST-PL-S13-14-B.
Quotes: S13-N1, KD-6, §1 Clarifications, Q2 S13-N1 rename refusal, Phase 6 unit tests, PartLibraryNumberCollisionCheckerTest. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-15 · C425693 · Description and Part Number cannot be left empty when editing
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-15-A.
Quotes: S13-N2, KD-3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-16 · C425694 · Saving with the part number unchanged leaves the number and open work alone
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test.
- Create an open purchase order for this test, purchase order 1, from any vendor, with a line for part A picked from the lookup, 2 ordered and none received.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-16-A.
Quotes: S13-N3, S7-N5b. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-17 · C425695 · Adding spaces around the part number is not a change
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-17-A.
Quotes: S13-N3a. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-18 · C425696 · A rename carries over to open purchase order lines at every location
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Create a part, part A, for this test at the test location, with 4 on hand, and at location B under the same part number.
- Create an open purchase order for this test at the test location, purchase order 1, from any vendor, with a line for part A picked from the lookup, 2 ordered and none received.
- Create an open purchase order for this test at location B, purchase order 2, from any vendor, with a line for part A picked from the lookup, 4 ordered and none received.
- Use a new part number that no part and no Part Library entry has yet, and that does not contain part A's number.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-18-A.
Quotes: S13-R19, KD-16, TERM-6. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-18b · C839445 (split from S13-18) · Received purchase order lines and accepted vendor bills keep the old number
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test.
- Create a purchase order for this test, purchase order 1, from any vendor, with a line for part A picked from the lookup, 1 ordered and fully received on a vendor invoice.
- Use a new part number that no part and no Part Library entry has yet, and that does not contain part A's number.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-18b-A.
Quotes: S13-R19b, CN-S13-2, KD-16. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-18c · C839446 (split from S13-18) · A purchase order line typed by hand with the old number keeps its number
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test.
- Create an open purchase order for this test, purchase order 1, from any vendor, with two lines, neither received: one for part A picked from the lookup, and one where part A's number was typed by hand and added as typed, with no link to the part.
- Use a new part number that no part and no Part Library entry has yet, and that does not contain part A's number.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-18c-A.
Quotes: S13-R19a, S13-R19. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-19 · C425697 · A rename carries over to open part requests but not to received ones
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test with 5 on hand.
- Create a work order for this test, work order 1, with a line holding two part requests for part A: one requested from the Part Library result and not yet received, and one picked from stock, so it is received.
- Use a new part number that no part and no Part Library entry has yet, and that does not contain part A's number.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-19-A.
Quotes: S13-R19, S13-R19e, TERM-6, CN-S13-2, Chris Ward, 27 Oct 2026, answer 26. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-20 · C425698 · A rename carries over to canned jobs that hold the part
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test with 5 on hand.
- Create a work order for this test, work order 1, with a line holding part A picked from stock.
- Create a canned job for this test, canned job A, saved from that line, so it holds part A.
- Use a new part number that no part and no Part Library entry has yet, and that does not contain part A's number.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-20-A.
Quotes: S13-R19, CN-S13-2, KD-16. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-21 · C425699 · A rename carries over to vendor returns that are not completed
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test with 5 on hand.
- Create a vendor return for this test, return A, for part A to any vendor, saved and not completed.
- Create a vendor return for this test, return B, for part A to any vendor, completed (accepted by the vendor).
- Use a new part number that no part and no Part Library entry has yet, and that does not contain part A's number.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-21-A.
Quotes: S13-R19, TERM-6, CN-S13-2. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-22 · C425700 · A delivery opened before a rename is received under the new number
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test with 3 on hand.
- Create an open purchase order for this test, purchase order 1, from any vendor, with a line for part A picked from the lookup, 2 ordered and none received.
- Use a new part number that no part and no Part Library entry has yet, and that does not contain part A's number.
- Use a desktop browser that can open a second tab on the same ShopView address, signed in as the same user.
- Start in browser tab 1 on purchase order 1 (Parts, then Purchase Orders, then open purchase order 1).
Example values: part A = ZZAUTOTEST-PL-S13-22-A.
Quotes: S13-R19c, §3 Technical Decisions, D30. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-22b · C839447 (split from S13-22) · A hand-typed purchase order line is received under its own number
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test.
- Create an open purchase order for this test, purchase order 1, from any vendor, with one line where part A's number was typed by hand and added as typed, 1 ordered and none received.
- Use a new part number that no part and no Part Library entry has yet, and that does not contain part A's number.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-22b-A.
Quotes: S13-R19c, S13-R19a. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-23 · C425702 · Part Status offers Active and Inactive, set to the saved status
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an active part, part A, and an inactive part, part B, at the test location.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-23-A; part B = ZZAUTOTEST-PL-S13-23-B.
Quotes: S13-R20. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-24 · C425703 · Part Status is disabled for a user without Delete
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a second browser, or a private window, signed in at the test location as user B, whose role has 'Part Library & Inventory → View' and 'Part Library & Inventory → Create & Edit' but not 'Part Library & Inventory → Delete'.
- Have an active part, part A, at the test location.
- Start in both browsers on the Inventory page, on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-24-A.
Quotes: S13-R20, S8-R6. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-25 · C425704 · Picking a different status changes nothing until Save
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S13-25-A.
Quotes: S13-R21, KD-10. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-26 · C425705 · The status pill keeps the saved status while another is picked
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an active part, part A, and an inactive part, part B, at the test location.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-26-A; part B = ZZAUTOTEST-PL-S13-26-B.
Quotes: S13-R25. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-27 · C425706 · Save with a different status asks for confirmation first
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S13-27-A.
Quotes: S13-R21, S10-R1, KD-10. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-28 · C425707 · Confirming Deactivate saves the edits and shows Part deactivated.
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test with a Sell Price of $20.00.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S13-28-A.
Quotes: S13-R22, UFS-24. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-29 · C425708 · Confirming Activate saves the edits and shows Part activated.
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test with a Sell Price of $20.00, and set it inactive.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Inactive tab.
Example values: part A = ZZAUTOTEST-PL-S13-29-A.
Quotes: S13-R22, UFS-25. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-30 · C425709 · Cancelling the confirmation saves nothing and keeps the picked status
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test with a Sell Price of $20.00.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S13-30-A.
Quotes: S13-R23, S10-N1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-31 · C425710 · Saving with the saved status picked asks no confirmation
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S13-31-A.
Quotes: S13-R24. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-32 · C425711 · A deactivation refused after the save keeps the confirmation open
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part, part A, for this test with a Sell Price of $20.00.
- Use a desktop browser that can open a second tab on the same ShopView address, signed in as the same user.
- Start in browser tab 1 on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S13-32-A.
Quotes: S13-N4, S13-R22, S10-R13a, UFS-26. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-33 · C425712 · A refused save closes the confirmation and saves nothing
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Create an active part, part A, for this test at the test location with a Sell Price of $20.00.
- Create a part, part B, for this test at location B only, so its separate entry's number is one the test location does not stock.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S13-33-A; part B = ZZAUTOTEST-PL-S13-33-B.
Quotes: S13-N5, S13-N1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-34 · C425713 · Delete Part deletes the part at once with no confirmation
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test, on no work order and with no return or credit.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S13-34-A.
Quotes: S13-R26. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-35 · C425714 · Delete Part on a part on a work order shows why and does nothing
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test.
- Create a work order for this test, work order 1, with a line holding part A picked from stock.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S13-35-A.
Quotes: S13-R27, UFS-22, Phase 6 frontend changes, Delete trap. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-36 · C425715 · Delete Part on a part with an open return shows why and does nothing
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test with 3 on hand.
- Have a vendor, vendor A.
- Create a vendor return for this test, return A, for part A and vendor A, saved and not completed.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S13-36-A.
Quotes: S13-R28, UFS-23, Phase 6 frontend changes, Delete trap. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-37 · C425716 · Deleting a part that reached a work order meanwhile is refused
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test with 3 on hand, on no work order.
- Create a work order for this test, work order 1, with a line that has no part on it.
- Use a desktop browser that can open a second tab on the same ShopView address, signed in as the same user.
- Start in browser tab 1 on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S13-37-A.
Quotes: S13-N6, UFS-20, CN-S13-3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-38 · C425717 · Deleting a part that got an open return meanwhile is refused
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test with 3 on hand, on no return.
- Have a vendor, vendor A.
- Use a desktop browser that can open a second tab on the same ShopView address, signed in as the same user.
- Start in browser tab 1 on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S13-38-A.
Quotes: S13-N6, UFS-21, CN-S13-3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-39 · C425718 · A number over 50 characters is refused while on an open part request
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test.
- Create a work order for this test, work order 1, with a line holding an open part request for part A, requested and not received.
- Create a part, part B, for this test, on no part request.
- Use two new part numbers that no part uses, one exactly 51 characters long and one exactly 60 characters long.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-39-A; part B = ZZAUTOTEST-PL-S13-39-B.
- 51 characters: ZZAUTOTEST-PL-S13-39-A-XXXXXXXXXXXXXXXXXXXXXXXXXXXX; 60 characters: ZZAUTOTEST-PL-S13-39-B- plus 37 Y (count both).
Quotes: S13-N7, UFS-16, CN-S13-3, Phase 6 functional tests. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-40 · C425719 · The part window offers no way to move a part to another library entry
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a part, part A, at the test location.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-40-A.
Quotes: S13-E1, KD-15, S7-R2. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-41 · C425720 · The parts import never changes an entry's part number
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test with its part number in capital letters, Min 1, Max 5 and 3 in bin location A.
- Have a parts import file with one row whose part number is part A's number in small letters, with a new description, description 2, Min 2, Max 8, quantity 3 and bin location A, so the row matches part A.
- Start on the Inventory data import page (Settings, then Data Import, then Inventory).
Example values: part A = ZZAUTOTEST-PL-S13-41-A.
Quotes: S13-N9, S7-N7, OOS-8, Chris Ward, 14 Oct 2026, answer 3 b. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-42 · C425721 · Re-importing the old number of a case-only rename updates that part
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test with its part number in capital letters, Min 1, Max 5 and 3 in bin location A, then rename it to the same number in small letters, so its old number differs from the new one only in letter case.
- Have a parts import file with one row whose part number is part A's old number in capital letters, with Min 3, Max 9, quantity 3 and bin location A.
- Start on the Inventory data import page (Settings, then Data Import, then Inventory).
Example values: part A = ZZAUTOTEST-PL-S13-42-A.
Quotes: S13-N9a, S7-N7. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-43 · C425722 · Re-importing a fully different old number creates a separate part
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test with Min 1, Max 5 and 3 in bin location A, then rename it to a fully different number, so its old number matches no part any more.
- Have a parts import file with one row whose part number is part A's old number, with Min 4, Max 10, quantity 2 and bin location A.
- Start on the Inventory data import page (Settings, then Data Import, then Inventory).
Example values: part A = ZZAUTOTEST-PL-S13-43-A.
Quotes: S13-E1, Phase 6 functional tests, ImportTest. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-44 · C540881 · Vendor always shows in the part window, for every user
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a second browser, or a private window, signed in at the test location as user B, whose role has 'Part Library & Inventory → View' and 'Part Library & Inventory → Create & Edit' but neither 'Part Library & Inventory → Delete' nor See Financial Data.
- Have a vendor, vendor A.
- Have a part, part A, at the test location with vendor A as its Vendor.
- Start in both browsers on the Inventory page, on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-44-A.
Quotes: S13-R4a, S13-R4, SV-10826, acceptance criteria, Chris Ward, 9 Oct 2026, answer 6. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-45 · C839448 · A new number that looks like a part at another location is refused
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Create a part, part A, for this test at the test location and at location B under the same part number, so a rename reaches location B too.
- Create a part, part B, for this test at location B only, so location B stocks a part the new number will look like.
- Use a new number for part A that differs from part B's number only by a hyphen or a period, so the two numbers match once punctuation is ignored, but no entry has it exactly.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-45-A; part B = ZZAUTOTEST-PL-S13-45-B.
- Example (the SV-10939 shape from the Jira comment): part A ZZPL-S13-45-1, part B ZZPLS13451 at location B, look-alike number ZZPL.S13.45.1.
Quotes: S13-N1a, UFS-14, CN-S13-3, SV-10826, comment, Chris Ward, 23 Oct 2026, Chris Ward, 27 Oct 2026, answer 23. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-46 · C839449 · An activation refused after the save keeps the confirmation open
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test with a Sell Price of $20.00, and set it inactive.
- Use a desktop browser that can open a second tab on the same ShopView address, signed in as the same user.
- Start in browser tab 1 on the Inventory page, on the Inactive tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S13-46-A.
Quotes: S13-N4, S10-R13a, UFS-26. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-47 · C839450 · Inventory Value for a date before a rename shows the old part number
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a tracked part, part A, for this test on an earlier day, date A, with 4 in its bin at a cost of $10.00, so the Inventory Value report saved a figure for it on date A.
- Use a new part number that no part and no Part Library entry has yet, and that does not contain part A's number.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-S13-47-A.
Quotes: CN-S13-2, S13-R18, ACC-3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-48 · C847732 · A rename leaves the old number on part sale lines that hold the part
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a part, part A, for this test with 5 on hand.
- Create an open part sale for this test, part sale A, with a line holding 1 of part A picked from stock.
- Create a part sale for this test, part sale B, with a line holding 1 of part A picked from stock, and invoice it so it is completed.
- Use a new part number that no part and no Part Library entry has yet, and that does not contain part A's number.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-S13-48-A.
Quotes: S13-R19e, CN-S13-2, Chris Ward, 27 Oct 2026, answer 26. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### S13-49 · C847733 · A look-alike rename on the Part Library page names the location it clashes with
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two parts for this test at the test location, part A and part B, with a hyphen in part B's part number.
- Use a number to type, number 1: part B's number in lower case with spaces in place of its hyphens, which no Part Library entry has exactly.
- Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).
Example values: part A = ZZAUTOTEST-PL-S13-49-A; part B = ZZAUTOTEST-PL-S13-49-B.
Quotes: S13-N1a, S11-R3a, UFS-14, CN-S13-3, Chris Ward, 27 Oct 2026, answer 23. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### IV-01 · C425660 · Bins of +5 and -2 show quantity 3 and $30 in Inventory Value
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a tracked part, part A, for this test at a cost of $10.00 and a Sell Price of $20.00, with 5 in bin location A and 0 in bin location B, so the report has two bins to add up.
- Add 2 of part A to a work order line from bin location B while it holds 0, so bin location B goes to -2 and part A's net is 3 (5 + (-2)).
- Start on the Inventory Value report (Reports in the top bar, then Inventory Value), with the as-of date on today.
Example values: part A = ZZAUTOTEST-PL-IV-01-A.
Quotes: ACC-4, SV-10380, description, Acceptance criteria, SV-10380, description, Reproduction table, SV-10380, description, Expected behavior, SV-10380, description, Acceptance criteria, QA lead, 9 Oct 2026, set-up answer 1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### IV-02 · C425661 · A part with only a -2 bin shows -2 and -$20 and lowers the totals
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two tracked parts for this test at a cost of $10.00 and a Sell Price of $20.00: part A with 0 in its only bin and part B with 4 in its only bin.
- Add 2 of part A to a work order line while its bin holds 0, so part A's bin goes to -2.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Start on the Inventory Value report (Reports in the top bar, then Inventory Value), with the as-of date on today.
Example values: part A = ZZAUTOTEST-PL-IV-02-A; part B = ZZAUTOTEST-PL-IV-02-B.
Quotes: ACC-4, SV-10380, description, Acceptance criteria, SV-10380, description, Expected behavior, SV-10380, comment, Chris Ward, 23 Oct 2026, QA lead, 9 Oct 2026, set-up answer 1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### IV-03 · C425662 · Bins of +5 and -5 add nothing to the Inventory Value totals
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two tracked parts for this test at a cost of $10.00: part A with 5 in bin location A and 0 in bin location B, and part B with 4 in its bin, so part A has two bins to add up.
- Add 5 of part A to a work order line from bin location B while it holds 0, so bin location B goes to -5 and part A's net is 0.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Start on the Inventory Value report (Reports in the top bar, then Inventory Value), with the as-of date on today.
Example values: part A = ZZAUTOTEST-PL-IV-03-A; part B = ZZAUTOTEST-PL-IV-03-B.
Quotes: ACC-4, SV-10380, description, Acceptance criteria, SV-10380, description, Expected behavior. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### IV-04 · C425663 · Bins of +5 and +3 still show quantity 8 and $80 in Inventory Value
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a tracked part, part A, for this test at a cost of $10.00, with 5 in bin location A and 3 in bin location B, so the report has two bins to add up.
- Start on the Inventory Value report (Reports in the top bar, then Inventory Value), with the as-of date on today.
Example values: part A = ZZAUTOTEST-PL-IV-04-A.
Quotes: ACC-4, SV-10380, description, Acceptance criteria, SV-10380, description, Reproduction table. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### IV-05 · C425664 · The Inventory list's available quantity still leaves out a negative bin
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a tracked part, part A, for this test at a cost of $10.00, with 5 in bin location A and 0 in bin location B, so the report has two bins to add up.
- Add 2 of part A to a work order line from bin location B while it holds 0, so bin location B goes to -2.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-IV-05-A.
- Question Q7 (still open) asks Product to confirm "5 Available" (unchanged availability) for bins +5 and -2; the ticket's own words say the shop-floor availability is unchanged and positive-only.
Quotes: ACC-4, SV-10380, description, Expected behavior, SV-10380, description, Acceptance criteria, SV-10380, description, Summary. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### IV-06 · C425665 · The Supply filter still uses the positive bins for a part with a negative bin
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a tracked part, part A, for this test with Min 4 and Max 10, 5 in bin location A and 0 in bin location B, so it has a positive and a second bin.
- Add 2 of part A to a work order line from bin location B while it holds 0, so bin location B goes to -2: on its positive bin (5) part A sits between Min and Max, on the net (3) it would be below Min.
- Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box.
Example values: part A = ZZAUTOTEST-PL-IV-06-A.
Quotes: ACC-4, SV-10380, description, Acceptance criteria, SV-10380, description, Code evidence. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### IV-07 · C425666 · Fractional bins of +2.5 and -1.25 show quantity 1.25 and $12.50
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a tracked part, part A, for this test whose quantities allow fractions, at a cost of $10.00, with 2.5 in bin location A and 0 in bin location B, so the report has two bins to add up.
- Add 1.25 of part A to a work order line from bin location B while it holds 0, so bin location B goes to -1.25 and part A's net is 1.25.
- Start on the Inventory Value report (Reports in the top bar, then Inventory Value), with the as-of date on today.
Example values: part A = ZZAUTOTEST-PL-IV-07-A.
Quotes: ACC-4, SV-10380, description, Acceptance criteria, SV-10380, description, Expected behavior. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### IV-08 · C425667 · The Inventory Value CSV download shows the same net figures as the screen
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two tracked parts for this test at a cost of $10.00: part A with 5 in bin location A and 0 in bin location B, and part B with 0 in its only bin, so part A has two bins to add up.
- Add 2 of part A to a work order line from bin location B while it holds 0, and 2 of part B while its bin holds 0, so part A's net is 3 and part B's is -2.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Use a computer that can open the exported file in a spreadsheet program.
- Start on the Inventory Value report (Reports in the top bar, then Inventory Value), with the as-of date on today.
Example values: part A = ZZAUTOTEST-PL-IV-08-A; part B = ZZAUTOTEST-PL-IV-08-B.
Quotes: ACC-4, SV-10380, description, Acceptance criteria, SV-10380, description, Expected behavior. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### IV-08b · C839451 (split from IV-08) · The Inventory Value PDF download shows the same net figures as the screen
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two tracked parts for this test at a cost of $10.00: part A with 5 in bin location A and 0 in bin location B, and part B with 0 in its only bin, so part A has two bins to add up.
- Add 2 of part A to a work order line from bin location B while it holds 0, and 2 of part B while its bin holds 0, so part A's net is 3 and part B's is -2.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Use a computer that can open a PDF file.
- Start on the Inventory Value report (Reports in the top bar, then Inventory Value), with the as-of date on today.
Example values: part A = ZZAUTOTEST-PL-IV-08b-A; part B = ZZAUTOTEST-PL-IV-08b-B.
Quotes: ACC-4, SV-10380, description, Acceptance criteria. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### IV-09 · C425668 · Inventory Value location and category filters still scope the net figures
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Create a category for this test, category A, used by no other part.
- Create a tracked part, part A, for this test at the test location in category A, at a cost of $10.00, with 0 in its only bin.
- Create a tracked part, part B, for this test at location B in another category, at a cost of $10.00, with 5 in bin location A and 0 in bin location B, so the report has two bins to add up.
- Add 2 of part A to a work order line at the test location while its bin holds 0, and 2 of part B to a work order line at location B from bin location B while it holds 0, so part A's net is -2 and part B's is 3.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Start on the Inventory Value report (Reports in the top bar, then Inventory Value), with the as-of date on today.
Example values: part A = ZZAUTOTEST-PL-IV-09-A; part B = ZZAUTOTEST-PL-IV-09-B.
Quotes: ACC-4, SV-10380, description, Acceptance criteria, SV-10380, description, Expected behavior. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### IV-10 · C540878 · Inventory Value for a day after release counts a bin below zero
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a tracked part, part A, for this test on an earlier day after this release, date A, at a cost of $10.00, with 0 in its only bin.
- Add 2 of part A to a work order line on date A while its bin holds 0, so part A ended date A at -2 and the report saved that figure for date A.
- Start on the Inventory Value report (Reports in the top bar, then Inventory Value), with the as-of date on today.
Example values: part A = ZZAUTOTEST-PL-IV-10-A.
Quotes: ACC-4, SV-10380, description, Acceptance criteria, SV-10380, description, Acceptance criteria. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### IV-11 · C540879 · Inventory Value for a date before release keeps its saved figures
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a tracked part from before this release, part A, at the test location, that has held 5 in bin location A and -2 in bin location B at a cost of $10.00 since before date A, with no change since, so the net of its bins is 3.
- Use date A, a date before this release that the Inventory Value report has saved figures for.
- Start on the Inventory Value report (Reports in the top bar, then Inventory Value), with the as-of date on today.
Example values: part A = ZZAUTOTEST-PL-IV-11-A.
Quotes: ACC-4, SV-10380, description, Acceptance criteria, SV-10380, description, Acceptance criteria, SV-10380, description, Reproduction table. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### IV-12 · C839452 · The Totals row's Margin % stays the true total and can go above 100%
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two tracked parts for this test: part A at a cost of $10.00 and a Sell Price of $100.00 with 1 in its bin, and part B at a cost of $50.00 and a Sell Price of $60.00 with 0 in its bin.
- Add 1 of part B to a work order line while its bin holds 0, so part B's bin goes to -1.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Start on the Inventory Value report (Reports in the top bar, then Inventory Value), with the as-of date on today.
Example values: part A = ZZAUTOTEST-PL-IV-12-A; part B = ZZAUTOTEST-PL-IV-12-B.
Quotes: ACC-4, SV-10380, comment, Chris Ward, 23 Oct 2026, SV-10380, comment, Nemanja Djuric, 23 Oct 2026, SV-10380, comment, Nemanja Djuric, 23 Oct 2026, SV-10380, description, Expected behavior. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### IV-13 · C839453 · The Totals row's Margin % stays the true total and can go below zero
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two tracked parts for this test: part A at a cost of $10.00 and a Sell Price of $20.00 with 3 in its bin, and part B at a cost of $5.00 and a Sell Price of $40.00 with 0 in its bin.
- Add 1 of part B to a work order line while its bin holds 0, so part B's bin goes to -1.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Start on the Inventory Value report (Reports in the top bar, then Inventory Value), with the as-of date on today.
Example values: part A = ZZAUTOTEST-PL-IV-13-A; part B = ZZAUTOTEST-PL-IV-13-B.
Quotes: ACC-4, SV-10380, comment, Chris Ward, 23 Oct 2026, SV-10380, comment, Nemanja Djuric, 23 Oct 2026, SV-10380, description, Expected behavior. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-01 · C839454 · Design: Inventory list page looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an active part, part A, with Part History entries, two or more tags and stock in one bin, so its row shows the history icon, tag chips and a bin chip.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design pictures of boards 1.4, 2.3, 2.5, 4.0 and 5.3 at 100% zoom, so you can compare the screen with them.
- Start on any page other than Inventory, so you can watch the Inventory page open.
Example values: part A = ZZAUTOTEST-PL-D-01-A.
- Part A: any active part with history, 2+ tags and one bin with stock (a ZZAUTOTEST part made for the suite is fine).
Quotes: S1-R1, S1-R8, S2-R3, S4-R8, S12-R1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-02 · C839455 · Design: Inactive tab selected looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an inactive part, part A, and an active part, part B.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 3.5 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-02-A; part B = ZZAUTOTEST-PL-D-02-B.
Quotes: S1-R4, S1-R7, CN-S9-4. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-03 · C839456 · Design: Empty Inactive tab message looks as in the design
State the tester sets up:
- Sign in as an Admin at a location that has no inactive parts.
- Make sure no search text and no filter is set on the Inventory list.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 4.10 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S1-N1, UFS-40. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-04 · C839457 · Design: Search with no matching part looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 3.4 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S1-N2, S1-N1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-05 · C839458 · Design: Actions menu with Deactivate parts looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure no Cycle count is running on the Inventory list.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 4.1 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S2-R1, S2-R2. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-06 · C839459 · Design: Actions menu in bulk mode shows only Export
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure no Cycle count is running on the Inventory list.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 4.8 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S2-R10b, S2-R9a. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-07 · C839460 · Design: Bulk bar with nothing ticked looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an active part, part A.
- Make sure no Cycle count is running on the Inventory list.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 4.2 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-07-A.
Quotes: S2-R4, S2-R7, S2-R7a, S2-R7b, S2-R8, S2-R9, Tech plan, §3 Technical Decisions, D24. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-08 · C839461 · Design: Two ticked rows in bulk mode look as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Have two active parts, part A and part B.
- Give part A a description long enough to be cut off with "..." in the Description column, so hovering it can show the full text.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Make sure no Cycle count is running on the Inventory list.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 4.3 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-08-A; part B = ZZAUTOTEST-PL-D-08-B.
Quotes: S2-R5, S2-R7b, Tech plan, §3 Technical Decisions, D24. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-09 · C839462 · Design: Every row ticked on the Inactive tab looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Have two inactive parts, part A and part B.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Make sure no Cycle count is running on the Inventory list.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 4.6 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Inactive tab.
Example values: part A = ZZAUTOTEST-PL-D-09-A; part B = ZZAUTOTEST-PL-D-09-B.
Quotes: S3-R1, S3-R2, S2-R6, Tech plan, §3 Technical Decisions, D24. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-10 · C839463 · Design: Over 200 ticked shows its hover text below Deactivate
State the tester sets up:
- Sign in as an Admin at the test location.
- Have 201 active parts whose part numbers start with the same text, so one search lists all 201.
- Make sure no Cycle count is running on the Inventory list.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 4.9 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S2-R8a, UFS-34, S2-R6. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-11 · C839464 · Design: Bulk deactivation confirmation looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two active parts for this test, part A and part B.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Make sure no Cycle count is running on the Inventory list.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 4.4 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-11-A; part B = ZZAUTOTEST-PL-D-11-B.
Quotes: S10-R2, S10-R3, S10-R4, S10-R5, S10-R9, S10-R10, S10-R11, S10-N1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-12 · C839465 · Design: Bulk reactivation confirmation looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two inactive parts for this test, part A and part B.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Make sure no Cycle count is running on the Inventory list.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 4.7 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Inactive tab.
Example values: part A = ZZAUTOTEST-PL-D-12-A; part B = ZZAUTOTEST-PL-D-12-B.
Quotes: S10-R3, S10-R4, S10-R8, S10-R9, S10-R10, S10-R11, S10-N1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-13 · C839466 · Design: Bulk change success message looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two active parts for this test, part A and part B.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Make sure no Cycle count is running on the Inventory list.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 4.5 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-13-A; part B = ZZAUTOTEST-PL-D-13-B.
Quotes: S10-R12, S2-R12, S2-R14, UFS-28. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-14 · C839467 · Design: New Inventory Part window looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure the test location has a default bin location, so the new part's bin row is filled in.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 1.1 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S13-R1, S13-R2, S13-R4, S13-R5, S13-R6, S13-R8, S13-R9, S13-R10, S4-R1, S4-R2, S4-R3, S4-R4, S7-R1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-15 · C839468 · Design: Typed values in New Inventory Part look as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 1.3 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S7-R1, S13-R4. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-16 · C839469 · Design: Required-field errors in the part window look as drawn
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 1.2 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S7-N1, S7-N2, UFS-04, UFS-05. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-17 · C839470 · Design: New part with tracking off looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 1.6 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Quotes: S4-R5, S4-R6. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-18 · C839471 · Design: Part created and linked message looks as in the design
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Create part A for this test at location B only, so its Part Library entry exists and the test location does not stock it.
- Write down part A's part number and description.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 1.4 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-18-A.
Quotes: S7-R9, UFS-10. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-19 · C839472 · Design: Duplicate part number error looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Create part A for this test at the test location, with a part number that has capital letters.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 1.5 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-19-A.
Quotes: S7-N3, S7-N5, UFS-08, CN-S13-3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-20 · C839473 · Design: Edit Inventory Part window looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an active, tracked part, part A, with two or more tags, so the tags show as chips.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design pictures of boards 2.1 and 3.1 at 100% zoom, so you can compare the screen with them.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-20-A.
Quotes: S13-R1, S13-R2, S13-R3, S13-R4, S13-R6, S13-R7, S13-R8, S13-R9, S13-R20. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-21 · C839474 · Design: Inactive part's window shows a grey Inactive pill
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an inactive part, part A.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 3.6 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Inactive tab.
Example values: part A = ZZAUTOTEST-PL-D-21-A.
Quotes: S13-R3, S9-R14. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-22 · C839475 · Design: Picked status leaves the green Active pill in place
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an active part, part A.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 3.2 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-22-A.
Quotes: S13-R21, S13-R25. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-23 · C839476 · Design: Other-locations warnings look as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Have part A stocked at the test location and at one other location, so a change to it reaches one other location.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 2.2 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-23-A.
Quotes: S13-R12, S13-R16, UFS-11, UFS-12. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-24 · C839477 · Design: Deactivate part confirmation looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part for this test, part A.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 3.3 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-24-A.
Quotes: S10-R3, S10-R4, S10-R6, S10-R9, S10-R10, S10-R11, S13-R23. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-25 · C839478 · Design: Activate part confirmation looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an inactive part for this test, part A.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 3.7 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Inactive tab.
Example values: part A = ZZAUTOTEST-PL-D-25-A.
Quotes: S10-R3, S10-R4, S10-R7, S10-R10, S10-R11, S13-R25. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-26 · C839479 · Design: Part deactivated message looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part for this test, part A.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 3.4 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-26-A.
Quotes: S13-R22, UFS-24, S1-N2. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-27 · C839480 · Design: Inventory Tracking hover text opens below its info icon
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an active, tracked part, part A.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 5.1 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-27-A.
Quotes: S4-R3. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-28 · C839481 · Design: Tracking switched off on a part looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an active, tracked part, part A, with stock in one bin and a saved Min and Max.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 5.2 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-28-A.
Quotes: S5-R3, S5-R3a, S5-R5. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-29 · C839482 · Design: Tracking switched back on shows Min and Max again
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an untracked part, part A, that had Min 2 and Max 6 saved before tracking was turned off.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 5.6 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-29-A.
Quotes: S5-R4. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-30 · C839483 · Design: Not Tracked in the Inventory list looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an untracked part, part A, with stock in one bin and a saved Min and Max.
- Have a tracked part, part B, with stock.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design pictures of boards 5.3 and 5.4 at 100% zoom, so you can compare the screen with them.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-30-A; part B = ZZAUTOTEST-PL-D-30-B.
Quotes: S4-R8, S4-R8a, S4-R8b, S6-R1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-31 · C839484 · Design: Cycle count with an untracked part looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an untracked part, part A, and a tracked part, part B, with stock.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Make sure no Cycle count is running on the Inventory list.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 5.7 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-31-A; part B = ZZAUTOTEST-PL-D-31-B.
Quotes: S5-R12, S1-E1, UFS-41. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-32 · C839485 · Design: Part History page looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an active part, part A, whose tracking was turned off and back on, so its Part History has entries.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design pictures of boards 2.4 and 5.5 at 100% zoom, so you can compare the screen with them.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-32-A.
Quotes: S10-R20, S10-R22. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-33 · C839486 · Design: Part History keeps column widths when events are long
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Create part A for this test at the test location and at location B, and change its part number once at the test location, so location B's Part History has a long entry ending with Changed at.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design pictures of boards 2.4 and 2.6 at 100% zoom, so you can compare the screen with them.
- Start on the test location's Inventory page, on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-33-A.
Quotes: S10-R21, S10-R25, Chris Ward, 27 Oct 2026, answer 21. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-34 · C839487 · Design: Part History search with a term looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an inactive part, part A, deactivated with the note Superseded by a newer part, so its Part History has a Deactivated entry with a reason.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 3.8 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Inactive tab.
Example values: part A = ZZAUTOTEST-PL-D-34-A.
Quotes: S10-R27, S10-R17. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-35 · C839488 · Design: Part lookup results look as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an active part, part A, with stock in one bin.
- Have a Part Library entry, part B, that is not stocked at the test location, so the lookup lists one result from the Part Library.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Create an open work order for this test, work order 1, with one line.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 6.1 at 100% zoom, so you can compare the screen with it.
- Start on the Work Orders page.
Example values: part A = ZZAUTOTEST-PL-D-35-A; part B = ZZAUTOTEST-PL-D-35-B.
Quotes: S12-R10, S9-R1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-36 · C839489 · Design: Lookup with no match shows No results
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an inactive part, part A, and an active part, part B.
- Create an open work order for this test, work order 1, with one line.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 6.2 at 100% zoom, so you can compare the screen with it.
- Start on the Work Orders page.
Example values: part A = ZZAUTOTEST-PL-D-36-A; part B = ZZAUTOTEST-PL-D-36-B.
Quotes: S9-R1. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-37 · C839490 · Design: Retired number typed in a lookup shows the inactive line
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an inactive part, part A, whose part number has capital letters.
- Create an open work order for this test, work order 1, with one line.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 6.3 at 100% zoom, so you can compare the screen with it.
- Start on the Work Orders page.
Example values: part A = ZZAUTOTEST-PL-D-37-A.
Quotes: S9-R16, UFS-44. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-38 · C839491 · Design: Canned job warning looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an inactive part for this test, part A, and an active part for this test, part B.
- Have a canned job, canned job 1, that holds part A and part B.
- Create an open work order for this test, work order 1, with one line.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design pictures of boards 6.4 and 6.5 at 100% zoom, so you can compare the screen with them.
- Start on the Work Orders page.
Example values: part A = ZZAUTOTEST-PL-D-38-A; part B = ZZAUTOTEST-PL-D-38-B.
Quotes: S9-R9, S9-R10, UFS-43. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-39 · C839492 · Design: Inactive tag in the vendor return lookup looks as drawn
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an inactive part, part A, and an active part, part B, both with stock.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 6.6 at 100% zoom, so you can compare the screen with it.
- Start on the Create Return page (Parts in the top bar, Returns in the left menu, then start a new return).
Example values: part A = ZZAUTOTEST-PL-D-39-A; part B = ZZAUTOTEST-PL-D-39-B.
Quotes: S9-R11, S9-R12. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-40 · C839493 · Design: Inactive tag in the Issue Credit list looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a paid part sale, part sale 1, that sold part A and part B, with part A set inactive after the sale and part B still active.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 6.7 at 100% zoom, so you can compare the screen with it.
- Start on the Part Sales page.
Example values: part A = ZZAUTOTEST-PL-D-40-A; part B = ZZAUTOTEST-PL-D-40-B.
Quotes: S9-R13. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-41 · C839494 · Design: Part Library page looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 7.1 at 100% zoom, so you can compare the screen with it.
- Start on the Inventory page.
Quotes: S11-R1, S11-R4, S11-R5, S12-R1, S12-R2. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-42 · C839495 · Design: Part Library entry page looks as in the design
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a Part Library entry, part A, stocked at the test location.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 7.2 at 100% zoom, so you can compare the screen with it.
- Start on the Part Library page.
Example values: part A = ZZAUTOTEST-PL-D-42-A.
Quotes: S11-R3, S12-R12, Chris Ward, 27 Oct 2026, answer 20. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-43 · C839496 · Design: Inventory list and bulk bar fit a 1440 px wide window
State the tester sets up:
- Sign in as an Admin at the test location.
- Have two active parts, part A and part B.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Make sure no Cycle count is running on the Inventory list.
- Make sure the app is in the Light theme.
- Use a computer whose screen is set to 1440 pixels wide, with the browser window maximised and the page zoom at 100%.
- Open the attached design pictures of boards 4.2 and 4.3 at 100% zoom, so you can compare the screen with them.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-43-A; part B = ZZAUTOTEST-PL-D-43-B.
Quotes: FF-1, S1-R8, S2-R7. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-44 · C839497 · Design: Inventory list and bulk bar fit a 1536 px wide window
State the tester sets up:
- Sign in as an Admin at the test location.
- Have two active parts, part A and part B.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Make sure no Cycle count is running on the Inventory list.
- Make sure the app is in the Light theme.
- Use a computer whose screen is set to 1536 pixels wide, with the browser window maximised and the page zoom at 100%.
- Open the attached design pictures of boards 4.2 and 4.3 at 100% zoom, so you can compare the screen with them.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-44-A; part B = ZZAUTOTEST-PL-D-44-B.
Quotes: FF-1, S1-R8, S2-R7. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-45 · C839498 · Design: Part window and confirmation fit a 1440 px wide window
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part for this test, part A, with two or more tags.
- Make sure the app is in the Light theme.
- Use a computer whose screen is set to 1440 pixels wide, with the browser window maximised and the page zoom at 100%.
- Open the attached design pictures of boards 2.1 and 3.3 at 100% zoom, so you can compare the screen with them.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-45-A.
Quotes: FF-1, S13-R2, S13-R3, S10-R11. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-46 · C839499 · Design: Part window and confirmation fit a 1536 px wide window
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an active part for this test, part A, with two or more tags.
- Make sure the app is in the Light theme.
- Use a computer whose screen is set to 1536 pixels wide, with the browser window maximised and the page zoom at 100%.
- Open the attached design pictures of boards 2.1 and 3.3 at 100% zoom, so you can compare the screen with them.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-46-A.
Quotes: FF-1, S13-R2, S13-R3, S10-R11. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-47 · C839500 · Design: Inactive tag on the Part Library entry page sits before the quantity
State the tester sets up:
- Sign in as an Admin who can switch between two locations: the test location and location B.
- Have part A stocked at the test location and at location B, active here and inactive at location B.
- Have part B stocked at the test location and at location B, tracked here and untracked at location B.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 7.2 at 100% zoom, so you can compare the screen with it.
- Start on the Part Library page.
Example values: part A = ZZAUTOTEST-PL-D-47-A; part B = ZZAUTOTEST-PL-D-47-B.
Quotes: S11-R8, S11-R9. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-48 · C839501 · Design: Not Tracked replaces the stock line in a part lookup
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an untracked part, part A, with stock in one bin, and a tracked part, part B, with stock.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Create an open work order for this test, work order 1, with one line.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design picture of board 6.1 at 100% zoom, so you can compare the screen with it.
- Start on the Work Orders page.
Example values: part A = ZZAUTOTEST-PL-D-48-A; part B = ZZAUTOTEST-PL-D-48-B.
Quotes: S9-R21. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).

### D-49 · C839502 · Design: Status confirmation has a close X in its title row
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two active parts for this test, part A and part B.
- Give parts A and B part numbers that start with the same text, so one search lists both.
- Make sure no Cycle count is running on the Inventory list.
- Make sure the app is in the Light theme.
- Use a desktop browser window at least 1600 pixels wide with the page zoom at 100%, so the screen is as wide as the design boards.
- Open the attached design pictures of boards 3.3, 3.7, 4.4 and 4.7 at 100% zoom, so you can compare the screen with them.
- Start on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab.
Example values: part A = ZZAUTOTEST-PL-D-49-A; part B = ZZAUTOTEST-PL-D-49-B.
Quotes: KD-11, S10-R11a, S10-R2, S13-R23, S10-N1, Chris Ward, 27 Oct 2026, answer 19. Marker: AUTOMATION: HOLD - not yet build-verified (no build yet).
