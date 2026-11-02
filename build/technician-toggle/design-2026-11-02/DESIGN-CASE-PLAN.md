# Design-case plan — Technician Toggle (2 Nov 2026, round 1 drafts for the case worker)

For the TestRail section **"Design — how it looks"** under 113017 "Technician Toggle" (Rule 126), local sources `build/technician-toggle/cases/design/`. Written in full in the QA lead's pattern (Rule 117 fourteenth and fifteenth amendments, example C665915): title starting "Design: " (at most 80 characters, no semicolons), plain "Sign in as … / Use a … / Have a …" preconditions, numbered steps with one action each, "Step N:" results with bullets, a blank line, then the exact PRD quotes under their "From:" line and the build sentence, then **References from Design** (tenth amendment), the AUTOMATION line last. Expected behaviour comes from PRD v17; the design gives the look (Rule 126.5) and is named, with its own words, under References from Design. Every quote below was checked by `tools/make_case_plan.py` against PRD v17 and the board files, word for word.

Notes for the case worker: the pictures to attach are in `design-2026-11-02/images/` (figure pictures with the design's caption) and `files/project/shots/` (the bare screenshots). Light theme only (no board draws dark). Widths: the pictures are 1440 x 900; DC-05 and DC-16 add 1536 px. Each case that changes a record creates its own staff member or work order (Rule 137). A line marked "Difference" is for the case worker and goes under References from Design in the case.

**Count: 32 look cases (DC-01 … DC-32) + 2 held design-version cases (DV-01, DV-02) = 34.**

| Id | Title | Pictures | Marker |
|---|---|---|---|
| DC-01 | Design: Staff list shows the New notice between the toolbar and the tabs | tt-p1-02-after-notice-and-technician-column.png, tt-p1-01-before-staff-list.png | AUTOMATION: READY |
| DC-02 | Design: Technician column sits just left of Billable on the staff list | tt-p1-02-after-notice-and-technician-column.png | AUTOMATION: READY |
| DC-03 | Design: New pill sits at the top right of the Technician column header | tt-p1-02-after-notice-and-technician-column.png, tt-p5-04-after-tech-view.png | AUTOMATION: READY |
| DC-04 | Design: Technician Yes and No pills look like the Billable pills | tt-p1-02-after-notice-and-technician-column.png, tt-p2-07-after-saved.png | AUTOMATION: READY |
| DC-05 | Design: Staff list header fits without overlap at 1440 and 1536 px | tt-p1-02-after-notice-and-technician-column.png | AUTOMATION: READY |
| DC-06 | Design: Deactivated tab shows the Technician column with No | tt-p1-02-after-notice-and-technician-column.png | AUTOMATION: READY |
| DC-07 | Design: New Staff Member shows the three toggles in one row below Billable | tt-p2-02-after-new-staff-member.png, tt-p2-01-before-new-staff-member.png | AUTOMATION: READY |
| DC-08 | Design: Technician is grayed out when New Staff Member opens | tt-p2-02-after-new-staff-member.png | AUTOMATION: READY |
| DC-09 | Design: Technician switches on with the Technician role and Time Clock | tt-p2-03-after-technician-role-picked.png | AUTOMATION: READY |
| DC-10 | Design: Time Clock tooltip on the grayed Technician toggle looks as designed | tt-p3-01-after-time-clock-off.png | AUTOMATION: READY |
| DC-11 | Design: Office User role tooltip on the Technician toggle looks as designed | tt-p3-02-after-built-in-office-user-role.png | AUTOMATION: READY |
| DC-12 | Design: Time Clock User role grays out Technician with the same tooltip | tt-p3-02-after-built-in-office-user-role.png | AUTOMATION: READY |
| DC-13 | Design: Edit Staff Member shows the same toggle row as New Staff Member | tt-p2-05-after-technician-off.png, tt-p2-04-before-edit-staff-member.png | AUTOMATION: READY |
| DC-14 | Design: Technician switched on in Edit Staff Member before saving | tt-p2-06-after-switched-on.png | AUTOMATION: READY |
| DC-15 | Design: Staff list shows Technician Yes and Billable No after the save | tt-p2-07-after-saved.png | AUTOMATION: READY |
| DC-16 | Design: Staff window toggle row does not wrap at 1440 and 1536 px | tt-p2-02-after-new-staff-member.png, tt-p2-05-after-technician-off.png | AUTOMATION: READY |
| DC-17 | Design: New pill on the Technician toggle looks like the switcher pill | tt-p2-02-after-new-staff-member.png, tt-p5-04-after-tech-view.png | AUTOMATION: READY |
| DC-18 | Design: Turn Off Technician warning looks as designed | tt-p4-02-after-turn-off-technician-warning.png, tt-p4-01-after-switched-off.png | AUTOMATION: READY |
| DC-19 | Design: Board View shows no column for a staff member who is not a technician | tt-p5-02-after-board-view.png, tt-p5-01-before-board-view.png | AUTOMATION: READY |
| DC-20 | Design: Tech View shows no group for a staff member who is not a technician | tt-p5-04-after-tech-view.png, tt-p5-03-before-tech-view.png | AUTOMATION: READY |
| DC-21 | Design: Technician filter shows No results for a staff member who is not one | tt-p5-06-after-technician-filter-searching-oli.png, tt-p5-05-before-technician-filter-searching-oli.png | AUTOMATION: READY |
| DC-22 | Design: Reassign lead technician shows the no-match message | tt-p5-08-after-reassign-lead-technician-searching-oli.png, tt-p5-07-before-reassign-lead-technician-searching-oli.png | AUTOMATION: READY |
| DC-23 | Design: Lead Technician list leaves out a staff member who is not a technician | tt-p6-02-after-lead-technician.png, tt-p6-01-before-lead-technician.png | AUTOMATION: READY |
| DC-24 | Design: A lead who is no longer a technician shows last and grayed out | tt-p6-02-after-lead-technician.png | AUTOMATION: READY |
| DC-25 | Design: Add Technician list on a line leaves out a staff member not a technician | tt-p6-04-after-add-technician-on-a-line.png, tt-p6-03-before-add-technician-on-a-line.png | AUTOMATION: READY |
| DC-26 | Design: Edit Labor list shows a former technician grayed out in name order | tt-p6-04-after-add-technician-on-a-line.png | AUTOMATION: READY |
| DC-27 | Design: Edit Line shows a former technician as an ordinary chip with its X | tt-p6-04-after-add-technician-on-a-line.png | AUTOMATION: READY |
| DC-28 | Design: Lead Technician shows Unassigned as text when there are no technicians | tt-p6-04-after-add-technician-on-a-line.png | AUTOMATION: READY |
| DC-29 | Design: Board View shows No technicians yet when there are no technicians | tt-p5-02-after-board-view.png | AUTOMATION: READY |
| DC-30 | Design: Nothing here yet text names Technician when there are no technicians | tt-p5-02-after-board-view.png | AUTOMATION: READY |
| DC-31 | Design: Reassign window lists a former lead as Current · no longer assignable | tt-p5-08-after-reassign-lead-technician-searching-oli.png | AUTOMATION: READY |
| DC-32 | Design: New pills and the notice are gone after the end date | tt-p1-02-after-notice-and-technician-column.png, tt-p1-01-before-staff-list.png | AUTOMATION: READY |
| DV-01 | Design: Time Clock back on in New Staff Member leaves Technician off | tt-p3-01-after-time-clock-off.png | AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO |
| DV-02 | Design: A former technician on a line shows grayed out in Edit Line | tt-p6-04-after-add-technician-on-a-line.png | AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO |

## DC-01 · Design: Staff list shows the New notice between the toolbar and the tabs

**Title:** Design: Staff list shows the New notice between the toolbar and the tabs

**Preconditions**
- Sign in as an Admin at the test location.
- Use the build before the "New" pill end date (07:00 UTC on the seventh day after the release that ships Technician Toggle), by your computer's clock.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Open the attached picture tt-p1-02-after-notice-and-technician-column.png at 100% zoom beside the screen.
- Start on the Settings page.

**Steps**
1. In the Settings menu, click Staff.

**Expected Result**
Step 1:
- A light blue box with a blue (i) icon at its left sits below the toolbar (Staff, Search, Permissions, Locations, Departments, New Staff Member) and above the Active and Deactivated tabs, as in the picture.
- Its text reads exactly: New: Decide who appears on Board View, Tech View and the technician dropdowns. Turn Technician on or off for each person in their staff settings, next to Sales Representative. To start, it is on for everyone who worked on a work order in the last 90 days, is on open work, or is billable.
- At 1440 px the text runs on two lines and nothing in the box is cut off.
- The box has no close button (no X), and the tabs still show below it.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11882 (Story 4, Technician column and notice on the staff list)
- S4-R4: “A notice shows on the staff list, below the page toolbar and above the Active and Deactivated tabs, including when the list fails to load (the existing "Something went wrong loading the staff list. Please try again." line then sits between the toolbar and the notice), with this text: "New: Decide who appears on Board View, Tech View and the technician dropdowns. Turn Technician on or off for each person in their staff settings, next to Sales Representative. To start, it is on for everyone who worked on a work order in the last 90 days, is on open work, or is billable."”
- S4-R5: “The notice cannot be closed.”
- §8 row 1: “Info notice at the top of the staff list, cannot be closed, disappears for everyone at the end date”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "1 Staff list", pictures "Notice and Technician column" (This build) and "Staff list" (Production today (before), no notice).
- Pictures to attach: tt-p1-02-after-notice-and-technician-column.png, tt-p1-01-before-staff-list.png.
- The design's own words:
  - “No close button: it disappears for everyone on the "New" pill's end date.”
  - “Billable is the last column. There is no Technician column and no notice.”

AUTOMATION: READY

## DC-02 · Design: Technician column sits just left of Billable on the staff list

**Title:** Design: Technician column sits just left of Billable on the staff list

**Preconditions**
- Sign in as an Admin at the test location.
- Use the build before the "New" pill end date (07:00 UTC on the seventh day after the release that ships Technician Toggle), by your computer's clock.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have at least one active staff member with Time Clock on and Technician on, and one with Technician off, so the column shows both values.
- Open the attached picture tt-p1-02-after-notice-and-technician-column.png at 100% zoom beside the screen.
- Start on the Settings page.

**Steps**
1. In the Settings menu, click Staff.
2. Scroll the staff table to its last columns.

**Expected Result**
Step 1:
- The staff list opens on the Active tab.
Step 2:
- The column order at the right end is: Created, Confirmed Invitation, Technician, Billable, then the row edit icon, as in the picture.
- The Technician header is in bold dark text, like the Billable header.
- Each Technician cell shows only a Yes or a No pill: there is no switch, dropdown or link in the cell.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11882 (Story 4, Technician column and notice on the staff list)
- S4-R1: “The staff list (Settings, Staff) gains a read-only "Technician" column directly left of Billable, on the Active and Deactivated tabs.”
- S4-E1: “The column is not editable on the list; the value changes only through the staff window (Story 1) or the person's Time Clock.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "1 Staff list", picture "Notice and Technician column" (This build).
- Pictures to attach: tt-p1-02-after-notice-and-technician-column.png.
- The design's own words:
  - “Technician column, read-only and sortable, just left of Billable: Yes when the person's Technician toggle is on and their Time Clock is on, otherwise No.”
  - “Settings, Staff, scrolled to the last columns.”
- Difference named for the case worker: the caption says "It changes only through the staff window (page 2)."; S4-E1 also names the person's Time Clock (register TT-D09, settled by S4-E1).

AUTOMATION: READY

## DC-03 · Design: New pill sits at the top right of the Technician column header

**Title:** Design: New pill sits at the top right of the Technician column header

**Preconditions**
- Sign in as an Admin at the test location.
- Use the build before the "New" pill end date (07:00 UTC on the seventh day after the release that ships Technician Toggle), by your computer's clock.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Open the attached pictures tt-p1-02-after-notice-and-technician-column.png and tt-p5-04-after-tech-view.png at 100% zoom beside the screen.
- Start on the Settings page.

**Steps**
1. In the Settings menu, click Staff.
2. Scroll the staff table to its last columns.
3. Open Work Orders in a second browser tab and look at the display switcher at the top right.

**Expected Result**
Step 1:
- The staff list opens on the Active tab.
Step 2:
- A small rounded "New" pill sits at the top right of the word Technician in the column header, its left edge touching the end of the word, as in the picture.
- The pill stays inside the Technician column and does not touch or cover the Billable header.
- The pill has a light blue fill, a thin blue border and blue text.
Step 3:
- The "New" pill above the Work Orders display switcher has the same size, shape and colours as the pill in the Technician header.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11882 (Story 4, Technician column and notice on the staff list), story SV-11879 (Story 1, Technician toggle on a staff member)
- S4-R3: “A "New" pill sits at the top right of the "Technician" column header, touching the end of the word and inside the column, clear of the Billable header. It follows the same end date as S1-R2.”
- S1-R2: “It looks the same as the pill on the Work Orders display switcher.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "1 Staff list", picture "Notice and Technician column" (This build); page "5 Board View and Tech View", picture "Tech View" (This build) for the switcher pill.
- Pictures to attach: tt-p1-02-after-notice-and-technician-column.png, tt-p5-04-after-tech-view.png.
- The design's own words:
  - “"New" pill at the top right of the Technician header.”

AUTOMATION: READY

## DC-04 · Design: Technician Yes and No pills look like the Billable pills

**Title:** Design: Technician Yes and No pills look like the Billable pills

**Preconditions**
- Sign in as an Admin at the test location.
- Use the build before the "New" pill end date (07:00 UTC on the seventh day after the release that ships Technician Toggle), by your computer's clock.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have an active staff member with Time Clock on, Technician on and Billable No (staff member A).
- Have an active staff member with Time Clock on, Technician off and Billable Yes (staff member B).
- Open the attached pictures tt-p1-02-after-notice-and-technician-column.png and tt-p2-07-after-saved.png at 100% zoom beside the screen.
- Start on the Settings page.

**Steps**
1. In the Settings menu, click Staff.
2. Scroll the staff table to its last columns.

**Expected Result**
Step 1:
- The staff list opens on the Active tab.
Step 2:
- Staff member A shows a green Yes pill under Technician and a red No pill under Billable.
- Staff member B shows a red No pill under Technician and a green Yes pill under Billable.
- The green pills in both columns have the same size, shape, colour and white text, and so do the red pills, as in the pictures.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11882 (Story 4, Technician column and notice on the staff list)
- S4-R1: “Each row shows "Yes" (green) when the person is active, their Technician toggle is on and their Time Clock is on, otherwise "No" (red), in the same style as the Billable column.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "1 Staff list", picture "Notice and Technician column"; page "2 Turn Technician on for a staff member", picture "Saved" (both This build).
- Pictures to attach: tt-p1-02-after-notice-and-technician-column.png, tt-p2-07-after-saved.png.
- The design's own words:
  - “The staff list, filtered to Parts Manager, now shows Technician Yes. Billable stays No: Technician never changes Billable.”

AUTOMATION: READY

## DC-05 · Design: Staff list header fits without overlap at 1440 and 1536 px

**Title:** Design: Staff list header fits without overlap at 1440 and 1536 px

**Preconditions**
- Sign in as an Admin at the test location.
- Use the build before the "New" pill end date (07:00 UTC on the seventh day after the release that ships Technician Toggle), by your computer's clock.
- Use a desktop browser at 100% zoom on a screen at least 1536 pixels wide.
- Open the attached picture tt-p1-02-after-notice-and-technician-column.png at 100% zoom beside the screen.
- Start on the Settings page.

**Steps**
1. Set the browser window to 1440 pixels wide.
2. In the Settings menu, click Staff.
3. Scroll the staff table to its last columns.
4. Set the browser window to 1536 pixels wide.

**Expected Result**
Step 1:
- The window is 1440 pixels wide.
Step 2:
- The notice, the tabs and the table show as in the picture.
Step 3:
- The Technician header, its "New" pill and the Billable header do not overlap and none is cut off.
- The notice text is whole, with nothing cut off or hidden behind another element.
Step 4:
- The notice, the Technician header with its pill and the Billable header still do not overlap and nothing is cut off.
- The notice may now take fewer lines; its text is unchanged.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11882 (Story 4, Technician column and notice on the staff list)
- S4-R3: “A "New" pill sits at the top right of the "Technician" column header, touching the end of the word and inside the column, clear of the Billable header.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "1 Staff list", picture "Notice and Technician column" (This build, 1440 x 900).
- Pictures to attach: tt-p1-02-after-notice-and-technician-column.png.
- The design's own words:
  - “Every picture is a real screenshot at 1440 x 900.”

AUTOMATION: READY

## DC-06 · Design: Deactivated tab shows the Technician column with No

**Title:** Design: Deactivated tab shows the Technician column with No

**Preconditions**
- Sign in as an Admin at the test location.
- Use the build before the "New" pill end date (07:00 UTC on the seventh day after the release that ships Technician Toggle), by your computer's clock.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have a deactivated staff member whose Technician toggle was on and Time Clock on before they were deactivated.
- Start on the Settings page.

**Steps**
1. In the Settings menu, click Staff.
2. Click the Deactivated tab.
3. Scroll the staff table to its last columns.

**Expected Result**
Step 1:
- The staff list opens on the Active tab.
Step 2:
- The Deactivated tab opens.
Step 3:
- The Technician column sits directly left of Billable, with the same header and "New" pill as on the Active tab.
- The deactivated staff member shows a red No pill under Technician.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11882 (Story 4, Technician column and notice on the staff list)
- S4-R1: “The staff list (Settings, Staff) gains a read-only "Technician" column directly left of Billable, on the Active and Deactivated tabs. A deactivated person always shows "No", whatever their toggles.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "1 Staff list" (the design draws the Active tab only; no picture of the Deactivated tab, register TT-N15).
- Pictures to attach: tt-p1-02-after-notice-and-technician-column.png.
- The design's own words:
  - “A deactivated person always shows No.”

AUTOMATION: READY

## DC-07 · Design: New Staff Member shows the three toggles in one row below Billable

**Title:** Design: New Staff Member shows the three toggles in one row below Billable

**Preconditions**
- Sign in as an Admin at the test location.
- Use the build before the "New" pill end date (07:00 UTC on the seventh day after the release that ships Technician Toggle), by your computer's clock.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Open the attached pictures tt-p2-02-after-new-staff-member.png and tt-p2-01-before-new-staff-member.png at 100% zoom beside the screen.
- Start on the Settings page.

**Steps**
1. In the Settings menu, click Staff.
2. Click New Staff Member.

**Expected Result**
Step 1:
- The staff list opens.
Step 2:
- The New Staff Member window opens with the fields in the same places as in the picture: First Name and Last Name, Email, Salary Type and Salary, Job Title and Role, All Departments and Location, then Billable alone on its row.
- Below Billable is one row of its own with three toggles, left to right: Time Clock, Sales Representative, Technician.
- The Technician toggle has the same shape and size as the other two, and the "New" pill sits at the top right of the word Technician.
- Below the toggle row are the orange "Adding new staff members will impact billing." line and the buttons Save & Add Next and Save & Close, as in the picture.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11879 (Story 1, Technician toggle on a staff member)
- S1-R1: “The New Staff Member and Edit Staff Member windows (Settings, Staff) show a toggle labeled "Technician" directly to the right of the Sales Representative toggle, as the last toggle in that row (Time Clock, Sales Representative, Technician). In both windows the three toggles share one row of their own, below the Billable field, so New and Edit look the same, in the same style as the window's other toggles.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "2 Turn Technician on for a staff member", pictures "New Staff Member" (This build) and "New Staff Member" (Production today (before)).
- Pictures to attach: tt-p2-02-after-new-staff-member.png, tt-p2-01-before-new-staff-member.png.
- The design's own words:
  - “The three toggles move to one row of their own below Billable, the same row as Edit: Time Clock, Sales Representative, Technician. Nothing else moves.”
  - “Time Clock and Sales Representative sit beside Billable. No Technician toggle.”

AUTOMATION: READY

## DC-08 · Design: Technician is grayed out when New Staff Member opens

**Title:** Design: Technician is grayed out when New Staff Member opens

**Preconditions**
- Sign in as an Admin at the test location.
- Use the build before the "New" pill end date (07:00 UTC on the seventh day after the release that ships Technician Toggle), by your computer's clock.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Open the attached picture tt-p2-02-after-new-staff-member.png at 100% zoom beside the screen.
- Start on the Settings page.

**Steps**
1. In the Settings menu, click Staff.
2. Click New Staff Member.

**Expected Result**
Step 1:
- The staff list opens.
Step 2:
- The window opens with no role picked and the Time Clock toggle off.
- The Technician toggle is off and grayed out: its track is a lighter grey than the Sales Representative toggle's and the word Technician is grey, as in the picture.
- Time Clock and Sales Representative are off and not grayed out.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11879 (Story 1, Technician toggle on a staff member)
- S1-R4: “Technician can only be on while Time Clock is on. While Time Clock is off, the Technician toggle is off and grayed out, and hovering it shows "Turn on Time Clock first. Only staff who clock in can be technicians."”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "2 Turn Technician on for a staff member", picture "New Staff Member" (This build).
- Pictures to attach: tt-p2-02-after-new-staff-member.png.
- The design's own words:
  - “The window opens with no role and Time Clock off, so Technician starts off and grayed out.”

AUTOMATION: READY

## DC-09 · Design: Technician switches on with the Technician role and Time Clock

**Title:** Design: Technician switches on with the Technician role and Time Clock

**Preconditions**
- Sign in as an Admin at the test location.
- Use the build before the "New" pill end date (07:00 UTC on the seventh day after the release that ships Technician Toggle), by your computer's clock.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Open the attached picture tt-p2-03-after-technician-role-picked.png at 100% zoom beside the screen.
- Start on the Settings page.

**Steps**
1. In the Settings menu, click Staff.
2. Click New Staff Member.
3. In Role, pick the built-in Technician role.
4. Switch Time Clock on.

**Expected Result**
Step 1:
- The staff list opens.
Step 2:
- The New Staff Member window opens with Technician off and grayed out.
Step 3:
- Role shows Technician. Technician is still off and grayed out, because Time Clock is off.
Step 4:
- Time Clock is on (blue) and Technician switches on by itself.
- The Technician toggle is no longer grayed out: it is blue with the knob at the right, the same blue as Time Clock, and the word Technician is dark, as in the picture.
- Sales Representative stays off.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11879 (Story 1, Technician toggle on a staff member)
- S1-R3: “In the New Staff Member window, Technician is pre-filled from the role shown: on when the role is the built-in Technician or the built-in Foreman role and Time Clock is on, otherwise off.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "2 Turn Technician on for a staff member", picture "Technician role picked" (This build).
- Pictures to attach: tt-p2-03-after-technician-role-picked.png.
- The design's own words:
  - “Time Clock on and the built-in Technician role picked: Technician switches on by itself.”

AUTOMATION: READY

## DC-10 · Design: Time Clock tooltip on the grayed Technician toggle looks as designed

**Title:** Design: Time Clock tooltip on the grayed Technician toggle looks as designed

**Preconditions**
- Sign in as an Admin at the test location.
- Use the build before the "New" pill end date (07:00 UTC on the seventh day after the release that ships Technician Toggle), by your computer's clock.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Open the attached picture tt-p3-01-after-time-clock-off.png at 100% zoom beside the screen.
- Start on the Settings page.

**Steps**
1. In the Settings menu, click Staff.
2. Click New Staff Member.
3. Point at the grayed-out Technician toggle without clicking.

**Expected Result**
Step 1:
- The staff list opens.
Step 2:
- The New Staff Member window opens with Time Clock off and Technician grayed out.
Step 3:
- A dark grey tooltip with white text opens below the toggle row, centred under Technician, as in the picture.
- It reads exactly: Turn on Time Clock first. Only staff who clock in can be technicians.
- The text is on one line, nothing is cut off, and the tooltip closes when the pointer moves away.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11879 (Story 1, Technician toggle on a staff member)
- S1-R4: “While Time Clock is off, the Technician toggle is off and grayed out, and hovering it shows "Turn on Time Clock first. Only staff who clock in can be technicians."”
- §8 row 2: “Hover the grayed-out Technician toggle while Time Clock is off (S1-R4)”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "3 When Technician can't be turned on", picture "Time Clock off" (This build).
- Pictures to attach: tt-p3-01-after-time-clock-off.png.
- The design's own words:
  - “Tooltip, verbatim: "Turn on Time Clock first. Only staff who clock in can be technicians."”
  - “The tooltip shows while hovering the grayed-out toggle.”

AUTOMATION: READY

## DC-11 · Design: Office User role tooltip on the Technician toggle looks as designed

**Title:** Design: Office User role tooltip on the Technician toggle looks as designed

**Preconditions**
- Sign in as an Admin at the test location.
- Use the build before the "New" pill end date (07:00 UTC on the seventh day after the release that ships Technician Toggle), by your computer's clock.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Open the attached picture tt-p3-02-after-built-in-office-user-role.png at 100% zoom beside the screen.
- Start on the Settings page.

**Steps**
1. In the Settings menu, click Staff.
2. Click New Staff Member.
3. Switch Time Clock on.
4. In Role, pick the built-in Office User role.
5. Point at the grayed-out Technician toggle without clicking.

**Expected Result**
Step 1:
- The staff list opens.
Step 2:
- The New Staff Member window opens.
Step 3:
- Time Clock is on and Technician is not grayed out.
Step 4:
- Role shows Office User. Technician is off and grayed out, as in the picture.
Step 5:
- A dark grey tooltip with white text opens below the toggle row, under Technician, as in the picture.
- It reads exactly: This role can't be a technician.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11879 (Story 1, Technician toggle on a staff member)
- S1-N1: “When the role picked in the window is the built-in Office User or Time Clock User role, the Technician toggle is off and grayed out, and hovering it shows "This role can't be a technician." Picking one of those roles turns Technician off.”
- §8 row 3: “Hover the grayed-out Technician toggle on the built-in Office User or Time Clock User role (S1-N1)”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "3 When Technician can't be turned on", picture "Built-in Office User role" (This build).
- Pictures to attach: tt-p3-02-after-built-in-office-user-role.png.
- The design's own words:
  - “On the built-in Office User or Time Clock User role, Technician is off and grayed out.”

AUTOMATION: READY

## DC-12 · Design: Time Clock User role grays out Technician with the same tooltip

**Title:** Design: Time Clock User role grays out Technician with the same tooltip

**Preconditions**
- Sign in as an Admin at the test location.
- Use the build before the "New" pill end date (07:00 UTC on the seventh day after the release that ships Technician Toggle), by your computer's clock.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Open the attached picture tt-p3-02-after-built-in-office-user-role.png at 100% zoom beside the screen.
- Start on the Settings page.

**Steps**
1. In the Settings menu, click Staff.
2. Click New Staff Member.
3. Switch Time Clock on.
4. In Role, pick the built-in Time Clock User role.
5. Point at the grayed-out Technician toggle without clicking.

**Expected Result**
Step 1:
- The staff list opens.
Step 2:
- The New Staff Member window opens.
Step 3:
- Time Clock is on and Technician is not grayed out.
Step 4:
- Role shows Time Clock User. Technician is off and grayed out, the same as for Office User in the picture.
Step 5:
- The same dark grey tooltip opens below the toggle row and reads exactly: This role can't be a technician.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11879 (Story 1, Technician toggle on a staff member)
- S1-N1: “When the role picked in the window is the built-in Office User or Time Clock User role, the Technician toggle is off and grayed out, and hovering it shows "This role can't be a technician."”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "3 When Technician can't be turned on", picture "Built-in Office User role" (This build); the design draws Office User only (register TT-N03).
- Pictures to attach: tt-p3-02-after-built-in-office-user-role.png.
- The design's own words:
  - “On the built-in Office User or Time Clock User role, Technician is off and grayed out.”

AUTOMATION: READY

## DC-13 · Design: Edit Staff Member shows the same toggle row as New Staff Member

**Title:** Design: Edit Staff Member shows the same toggle row as New Staff Member

**Preconditions**
- Sign in as an Admin at the test location.
- Use the build before the "New" pill end date (07:00 UTC on the seventh day after the release that ships Technician Toggle), by your computer's clock.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have an active staff member with Time Clock on and Technician off (for example a Parts Manager), staff member A.
- Open the attached pictures tt-p2-05-after-technician-off.png and tt-p2-04-before-edit-staff-member.png at 100% zoom beside the screen.
- Start on the Settings page.

**Steps**
1. In the Settings menu, click Staff.
2. Click the edit icon on staff member A's row.

**Expected Result**
Step 1:
- The staff list opens.
Step 2:
- The Edit Staff Member window opens with Location and Billable side by side, then one row of its own with Time Clock, Sales Representative, Technician, left to right, as in the picture.
- Technician is off and not grayed out (Time Clock is on), and the "New" pill sits at the top right of the word Technician.
- The TECHNICIAN HOURS section with "Set working hours for this technician", the orange "Role changes may impact billing." line and the buttons are below the toggle row, as in the picture; nothing else has moved compared with the production picture.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11879 (Story 1, Technician toggle on a staff member)
- S1-R1: “In both windows the three toggles share one row of their own, below the Billable field, so New and Edit look the same, in the same style as the window's other toggles.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "2 Turn Technician on for a staff member", pictures "Technician off" (This build) and "Edit Staff Member" (Production today (before)).
- Pictures to attach: tt-p2-05-after-technician-off.png, tt-p2-04-before-edit-staff-member.png.
- The design's own words:
  - “In both windows the toggles share one row below Billable: Time Clock, Sales Representative, Technician.”

AUTOMATION: READY

## DC-14 · Design: Technician switched on in Edit Staff Member before saving

**Title:** Design: Technician switched on in Edit Staff Member before saving

**Preconditions**
- Sign in as an Admin at the test location.
- Use the build before the "New" pill end date (07:00 UTC on the seventh day after the release that ships Technician Toggle), by your computer's clock.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have an active staff member with Time Clock on and Technician off, staff member A.
- Open the attached picture tt-p2-06-after-switched-on.png at 100% zoom beside the screen.
- Start on the Settings page.

**Steps**
1. In the Settings menu, click Staff.
2. Click the edit icon on staff member A's row.
3. Switch Technician on.

**Expected Result**
Step 1:
- The staff list shows staff member A with No under Technician.
Step 2:
- The Edit Staff Member window opens with Technician off.
Step 3:
- Technician is on: blue with the knob at the right, the same look as Time Clock, as in the picture.
- No warning or message opens.
- The staff list behind the window still shows No under Technician for staff member A.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11879 (Story 1, Technician toggle on a staff member)
- S1-R6: “Switching Technician on or off changes nothing until the user saves the staff member with the window's existing Save.”
- S1-R7: “A save that turns Technician on never shows a warning.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "2 Turn Technician on for a staff member", picture "Switched on" (This build).
- Pictures to attach: tt-p2-06-after-switched-on.png.
- The design's own words:
  - “Switched on, not saved yet. Nothing changes until Save & Close.”
  - “Turning it on never shows a warning and never logs her out.”
- The window's existing save button is labelled Save & Close (register TT-D05, settled by S1-R6).

AUTOMATION: READY

## DC-15 · Design: Staff list shows Technician Yes and Billable No after the save

**Title:** Design: Staff list shows Technician Yes and Billable No after the save

**Preconditions**
- Sign in as an Admin at the test location.
- Use the build before the "New" pill end date (07:00 UTC on the seventh day after the release that ships Technician Toggle), by your computer's clock.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have an active staff member with Time Clock on, Technician off and Billable No, staff member A.
- Open the attached picture tt-p2-07-after-saved.png at 100% zoom beside the screen.
- Start on the Settings page.

**Steps**
1. In the Settings menu, click Staff.
2. Click the edit icon on staff member A's row.
3. Switch Technician on.
4. Click Save & Close.

**Expected Result**
Step 1:
- The staff list shows staff member A with No under Technician and No under Billable.
Step 2:
- The Edit Staff Member window opens.
Step 3:
- Technician is on.
Step 4:
- The window closes without a warning and the staff list shows staff member A with a green Yes under Technician and a red No under Billable, as in the picture.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11879 (Story 1, Technician toggle on a staff member), story SV-11882 (Story 4, Technician column and notice on the staff list)
- S1-R9: “Billable and Sales Representative work exactly as today. Technician does not change, gray out or require either of them, and neither of them changes Technician.”
- S4-R1: “Each row shows "Yes" (green) when the person is active, their Technician toggle is on and their Time Clock is on, otherwise "No" (red), in the same style as the Billable column.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "2 Turn Technician on for a staff member", picture "Saved" (This build).
- Pictures to attach: tt-p2-07-after-saved.png.
- The design's own words:
  - “The staff list, filtered to Parts Manager, now shows Technician Yes. Billable stays No: Technician never changes Billable.”

AUTOMATION: READY

## DC-16 · Design: Staff window toggle row does not wrap at 1440 and 1536 px

**Title:** Design: Staff window toggle row does not wrap at 1440 and 1536 px

**Preconditions**
- Sign in as an Admin at the test location.
- Use the build before the "New" pill end date (07:00 UTC on the seventh day after the release that ships Technician Toggle), by your computer's clock.
- Use a desktop browser at 100% zoom on a screen at least 1536 pixels wide.
- Have an active staff member with Time Clock on, staff member A.
- Open the attached pictures tt-p2-02-after-new-staff-member.png and tt-p2-05-after-technician-off.png at 100% zoom beside the screen.
- Start on the Settings page.

**Steps**
1. Set the browser window to 1440 pixels wide.
2. In the Settings menu, click Staff.
3. Click New Staff Member.
4. Set the browser window to 1536 pixels wide.
5. Close the window with its X.
6. Click the edit icon on staff member A's row.

**Expected Result**
Step 1:
- The window is 1440 pixels wide.
Step 2:
- The staff list opens.
Step 3:
- Time Clock, Sales Representative and Technician with its "New" pill sit on one line; the pill does not overlap anything and nothing is cut off.
Step 4:
- The toggle row still sits on one line with nothing overlapping or cut off.
Step 5:
- The New Staff Member window closes.
Step 6:
- In Edit Staff Member the toggle row sits on one line, the "New" pill does not overlap the TECHNICIAN HOURS heading, and nothing is cut off.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11879 (Story 1, Technician toggle on a staff member)
- S1-R1: “In both windows the three toggles share one row of their own, below the Billable field, so New and Edit look the same, in the same style as the window's other toggles.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "2 Turn Technician on for a staff member", pictures "New Staff Member" and "Technician off" (This build, 1440 x 900).
- Pictures to attach: tt-p2-02-after-new-staff-member.png, tt-p2-05-after-technician-off.png.
- The design's own words:
  - “Every picture is a real screenshot at 1440 x 900.”

AUTOMATION: READY

## DC-17 · Design: New pill on the Technician toggle looks like the switcher pill

**Title:** Design: New pill on the Technician toggle looks like the switcher pill

**Preconditions**
- Sign in as an Admin at the test location.
- Use the build before the "New" pill end date (07:00 UTC on the seventh day after the release that ships Technician Toggle), by your computer's clock.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Open the attached pictures tt-p2-02-after-new-staff-member.png and tt-p5-04-after-tech-view.png at 100% zoom beside the screen.
- Start on the Settings page.

**Steps**
1. In the Settings menu, click Staff.
2. Click New Staff Member.
3. Open Work Orders in a second browser tab.

**Expected Result**
Step 1:
- The staff list opens.
Step 2:
- A small rounded "New" pill sits at the top right of the word Technician, its left edge touching the end of the word, as in the picture.
Step 3:
- The "New" pill above the Work Orders display switcher has the same size, shape, light blue fill, thin blue border and blue text as the pill on the Technician toggle.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11879 (Story 1, Technician toggle on a staff member)
- S1-R2: “A "New" pill sits at the top right of the "Technician" label, touching the end of the word. It looks the same as the pill on the Work Orders display switcher.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "2 Turn Technician on for a staff member", picture "New Staff Member"; page "5 Board View and Tech View", picture "Tech View" (both This build).
- Pictures to attach: tt-p2-02-after-new-staff-member.png, tt-p5-04-after-tech-view.png.
- The design's own words:
  - “Technician is last, with the "New" pill (same end date as the staff list pill).”

AUTOMATION: READY

## DC-18 · Design: Turn Off Technician warning looks as designed

**Title:** Design: Turn Off Technician warning looks as designed

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have staff member A with Time Clock on and Technician on, who leads at least two open service work orders (In Progress) and is on at least two labor lines of open work orders. Note how many of each.
- Open the attached pictures tt-p4-02-after-turn-off-technician-warning.png and tt-p4-01-after-switched-off.png at 100% zoom beside the screen.
- Start on the Settings page.

**Steps**
1. In the Settings menu, click Staff.
2. Click the edit icon on staff member A's row.
3. Switch Technician off.
4. Click Save & Close.

**Expected Result**
Step 1:
- The staff list opens.
Step 2:
- The Edit Staff Member window opens with Technician on.
Step 3:
- Technician is off, as in the picture "Switched off"; nothing is saved yet.
Step 4:
- A warning window opens over the dimmed Edit Staff Member window, as in the picture.
- Its header is a yellow band with the title Turn Off Technician in large bold dark text and a blue X at the right.
- Its text starts with staff member A's full name and the two numbers you noted, in this form: (name) leads (work orders) open work orders and is on (lines) labor lines. They'll stay on them, but won't be offered as a technician on anything new.
- At the bottom right are Cancel (grey) then Save (blue), in that order.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11880 (Story 2, Warning before turning Technician off)
- S2-R2: “When at least one work order or line is counted, a warning window titled "Turn Off Technician" shows.”
- S2-R4: “The window has Cancel and Save.”
- §8 row 4: “Title "Turn Off Technician"; text "[Name] leads [n] open work orders and is on [n] labor lines. They'll stay on them, but won't be offered as a technician on anything new." (other forms per S2-R3)”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "4 Turn Technician off with open work", pictures "Switched off" and "Turn Off Technician warning" (This build).
- Pictures to attach: tt-p4-02-after-turn-off-technician-warning.png, tt-p4-01-after-switched-off.png.
- The design's own words:
  - “Text, verbatim with this demo's counts: "Emily Madden leads 15 open work orders and is on 141 labor lines. They'll stay on them, but won't be offered as a technician on anything new."”
  - “Cancel, the X or Escape leave the staff member unsaved.”

AUTOMATION: READY

## DC-19 · Design: Board View shows no column for a staff member who is not a technician

**Title:** Design: Board View shows no column for a staff member who is not a technician

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have staff member C at the test location with Time Clock on and Technician off, who leads no work order (for example a Parts Manager).
- Have staff members A and B at the test location with Time Clock on and Technician on, whose names sort just before and just after staff member C's name (for example Nikola, Olivia and Parth).
- Open the attached pictures tt-p5-02-after-board-view.png and tt-p5-01-before-board-view.png at 100% zoom beside the screen.

**Steps**
1. Open Work Orders.
2. Click the Board View icon in the display switcher.
3. Scroll the board sideways to staff members A and B.

**Expected Result**
Step 1:
- Work Orders opens.
Step 2:
- Board View opens with the Unassigned column first.
Step 3:
- Staff member A's column is followed directly by staff member B's column: there is no column for staff member C, as in the picture.
- Each column header looks as in the picture: a grip, a round avatar with initials, the name, a pin icon and a count with a clipboard icon, and the empty column shows the dashed box "Drag a work order here to assign it".

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11881 (Story 3, Who appears on the technician lists)
- S3-R2: “Board View gives a column, and Tech View a group, to each person offered by S3-R1, plus everyone who leads work shown on the board (S3-E1, S3-E2).”
- S3-N1: “A person with Technician off, or with Time Clock off, gets no Board View column, no Tech View group, and is not offered in the Technician filter or any technician dropdown, unless S3-E1 or S3-E2 applies.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "5 Board View and Tech View", pictures "Board View" (This build) and "Board View" (Production today (before)).
- Pictures to attach: tt-p5-02-after-board-view.png, tt-p5-01-before-board-view.png.
- The design's own words:
  - “No column for her: Parth Fadadu follows Nikola Milosevic.”
  - “Columns sort by name, so she sits between Nikola Milosevic and Parth Fadadu.”

AUTOMATION: READY

## DC-20 · Design: Tech View shows no group for a staff member who is not a technician

**Title:** Design: Tech View shows no group for a staff member who is not a technician

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have staff member C at the test location with Time Clock on and Technician off, who leads no work order (for example a Parts Manager).
- Have staff members A and B at the test location with Time Clock on and Technician on, whose names sort just before and just after staff member C's name (for example Nikola, Olivia and Parth).
- Open the attached pictures tt-p5-04-after-tech-view.png and tt-p5-03-before-tech-view.png at 100% zoom beside the screen.

**Steps**
1. Open Work Orders.
2. Click the Tech View icon in the display switcher.
3. Scroll the list to staff members A and B.

**Expected Result**
Step 1:
- Work Orders opens.
Step 2:
- Tech View opens with one group row per technician.
Step 3:
- Staff member A's group is followed directly by staff member B's group: there is no group for staff member C, as in the picture.
- Each group row looks as in the picture: a grip, a chevron, a round avatar with initials, the name, a pin icon and a count.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11881 (Story 3, Who appears on the technician lists)
- S3-R2: “Board View gives a column, and Tech View a group, to each person offered by S3-R1, plus everyone who leads work shown on the board (S3-E1, S3-E2).”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "5 Board View and Tech View", pictures "Tech View" (This build) and "Tech View" (Production today (before)).
- Pictures to attach: tt-p5-04-after-tech-view.png, tt-p5-03-before-tech-view.png.
- The design's own words:
  - “No group for her. Same rule as Board View.”

AUTOMATION: READY

## DC-21 · Design: Technician filter shows No results for a staff member who is not one

**Title:** Design: Technician filter shows No results for a staff member who is not one

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have staff member C at the test location with Time Clock on and Technician off, who leads no work order (for example a Parts Manager).
- Have staff member A at the test location with Time Clock on and Technician on.
- Open the attached picture tt-p5-06-after-technician-filter-searching-oli.png at 100% zoom beside the screen.

**Steps**
1. Open Work Orders.
2. Click the Technician filter.
3. Type the first three letters of staff member A's first name.
4. Clear the search box with its clear icon.
5. Type the first three letters of staff member C's first name.

**Expected Result**
Step 1:
- Work Orders opens.
Step 2:
- The Technician filter opens below its button with a search box at the top and Clear selection at the bottom.
Step 3:
- Staff member A is listed with a checkbox.
Step 4:
- The search box is empty.
Step 5:
- Where the names were, the filter shows "No results" in grey, centred, as in the picture.
- Clear selection still shows below the divider.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11881 (Story 3, Who appears on the technician lists)
- S3-R3: “The Technician filter on Work Orders offers the same people the board gives a column or group to.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "5 Board View and Tech View", pictures "Technician filter, searching \"Oli\"" (This build and Production today (before)).
- Pictures to attach: tt-p5-06-after-technician-filter-searching-oli.png, tt-p5-05-before-technician-filter-searching-oli.png.
- The design's own words:
  - “"No results". The filter offers the same people as the columns.”

AUTOMATION: READY

## DC-22 · Design: Reassign lead technician shows the no-match message

**Title:** Design: Reassign lead technician shows the no-match message

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have staff member C at the test location with Time Clock on and Technician off, who leads no work order (for example a Parts Manager).
- Have an open service work order at the test location whose lead is a technician, shown on Board View.
- Open the attached picture tt-p5-08-after-reassign-lead-technician-searching-oli.png at 100% zoom beside the screen.

**Steps**
1. Open Work Orders.
2. Click the Board View icon in the display switcher.
3. Open the more-actions menu on the work order's card.
4. Click Reassign lead technician.
5. Type the first three letters of staff member C's first name.

**Expected Result**
Step 1:
- Work Orders opens.
Step 2:
- Board View opens.
Step 3:
- The card's menu opens.
Step 4:
- The Reassign lead technician window opens with the work order number and customer under the title, a search box, the list and the buttons Cancel and Reassign.
Step 5:
- The Unassigned row stays at the top of the list.
- Below it, centred grey text reads No technicians match, then the three letters you typed inside curly quotes (“ ”), as in the picture.
- Staff member C is not listed and the Cancel and Reassign buttons are unchanged.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11881 (Story 3, Who appears on the technician lists)
- S3-R4: “The Assign lead technician and Reassign lead technician window (from a card's more-actions menu on Board View or Tech View) offers only people per S3-R1. Searching for anyone else shows the existing No technicians match “[search]” message.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "5 Board View and Tech View", pictures "Reassign lead technician, searching \"Oli\"" (This build and Production today (before)).
- Pictures to attach: tt-p5-08-after-reassign-lead-technician-searching-oli.png, tt-p5-07-before-reassign-lead-technician-searching-oli.png.
- The design's own words:
  - “Opened from a card's more-actions menu on Board View.”
  - “Only staff whose Technician toggle is on and whose Time Clock is on are offered.”
- The caption types the message with straight quotes; the screen and the PRD use curly quotes (register TT-D12, settled).

AUTOMATION: READY

## DC-23 · Design: Lead Technician list leaves out a staff member who is not a technician

**Title:** Design: Lead Technician list leaves out a staff member who is not a technician

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have staff member C at the test location with Time Clock on and Technician off, who leads no work order (for example a Parts Manager).
- Have staff members A and B at the test location with Time Clock on and Technician on, whose names sort just before and just after staff member C's name (for example Nikola, Olivia and Parth).
- Have an open service work order at the test location with no lead technician.
- Open the attached picture tt-p6-02-after-lead-technician.png at 100% zoom beside the screen.

**Steps**
1. Open the work order.
2. Click the Lead Technician field in the card at the left.

**Expected Result**
Step 1:
- The work order opens with Lead Technician showing Unassigned.
Step 2:
- The dropdown opens below the field with the names in alphabetical order, as in the picture.
- Staff member A is followed directly by staff member B: staff member C is not in the list.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11881 (Story 3, Who appears on the technician lists)
- S3-R5: “The Lead Technician dropdown on a work order offers only people per S3-R1.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "6 Technician dropdowns on a work order", pictures "Lead Technician" (This build and Production today (before)).
- Pictures to attach: tt-p6-02-after-lead-technician.png, tt-p6-01-before-lead-technician.png.
- The design's own words:
  - “Not offered: Parth Fadadu follows Nikola Milosevic. The list holds only staff whose Technician toggle is on and whose Time Clock is on.”

AUTOMATION: READY

## DC-24 · Design: A lead who is no longer a technician shows last and grayed out

**Title:** Design: A lead who is no longer a technician shows last and grayed out

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have staff member C at the test location with Time Clock on and Technician on.
- Have a new open service work order at the test location with staff member C as its lead technician.
- Then switch Technician off for staff member C in Edit Staff Member, click Save & Close and click Save in the Turn Off Technician warning.

**Steps**
1. Open the work order.
2. Click the Lead Technician field in the card at the left.

**Expected Result**
Step 1:
- The work order opens with staff member C still shown as the Lead Technician.
Step 2:
- Staff member C is the last name in the list, grayed out, with the check mark.
- The other names above are in their usual style.
- Clicking staff member C's row does not pick it.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11881 (Story 3, Who appears on the technician lists)
- S3-R7: “A work order's current lead who is not offered per S3-R1 still shows as the lead on the work order and in Board View and Tech View. In the Lead Technician dropdown they are listed last, grayed out, with the check mark, and cannot be picked.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "6 Technician dropdowns on a work order", picture "Lead Technician" (This build). The design describes this state but draws a work order with no lead (register TT-N07).
- Pictures to attach: tt-p6-02-after-lead-technician.png.
- The design's own words:
  - “A current lead who is not a technician any more stays the lead, listed last, grayed out with the check, so the current lead never reads as blank (PRD S3-R7).”
- The last step of the preconditions is setup, done before the test starts.

AUTOMATION: READY

## DC-25 · Design: Add Technician list on a line leaves out a staff member not a technician

**Title:** Design: Add Technician list on a line leaves out a staff member not a technician

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have staff member C at the test location with Time Clock on and Technician off, who leads no work order (for example a Parts Manager).
- Have staff members A and B at the test location with Time Clock on and Technician on, whose names sort just before and just after staff member C's name (for example Nikola, Olivia and Parth).
- Have an open service work order at the test location with an approved labor line.
- Open the attached picture tt-p6-04-after-add-technician-on-a-line.png at 100% zoom beside the screen.

**Steps**
1. Open the work order.
2. Open the labor line in the Edit Line window.
3. Click the Add Technician field.
4. Scroll the list to staff members A and B.

**Expected Result**
Step 1:
- The work order opens on its Lines tab.
Step 2:
- The Edit Line window opens with Add Technician, Labor Rate, Estimated Time and Tech Time.
Step 3:
- The list opens above the field, in alphabetical order, as in the picture.
Step 4:
- Staff member A is followed directly by staff member B: staff member C is not in the list.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11881 (Story 3, Who appears on the technician lists)
- S3-R6: “Add Technician on a line (in the New Line and Edit Line windows) and the Technician dropdown in the Edit Labor window offer only people per S3-R1.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "6 Technician dropdowns on a work order", pictures "Add Technician on a line" (This build and Production today (before)).
- Pictures to attach: tt-p6-04-after-add-technician-on-a-line.png, tt-p6-03-before-add-technician-on-a-line.png.
- The design's own words:
  - “Not offered: Parth Fadadu follows Nikola Milosevic. Add Labor uses the same list.”
- Difference named for the case worker: the caption says "Add Labor"; the PRD says "the Technician dropdown in the Edit Labor window" (register TT-D03, settled by S3-R6).

AUTOMATION: READY

## DC-26 · Design: Edit Labor list shows a former technician grayed out in name order

**Title:** Design: Edit Labor list shows a former technician grayed out in name order

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have staff member C at the test location with Time Clock on and Technician on.
- Have a new open service work order at the test location with an approved labor line that has a labor entry for staff member C.
- Then switch Technician off for staff member C in Edit Staff Member, click Save & Close and click Save in the Turn Off Technician warning.

**Steps**
1. Open the work order.
2. Open the Edit Labor window for the labor line.
3. Open the Technician list.

**Expected Result**
Step 1:
- The work order opens on its Lines tab with staff member C on the labor line.
Step 2:
- The Edit Labor window opens.
Step 3:
- Staff member C is in the list in name order among the others, grayed out the same way a deactivated technician shows, and cannot be unticked.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11881 (Story 3, Who appears on the technician lists)
- S3-R8: “Someone already on a line who is not offered per S3-R1 stays on the line. In the Edit Labor technician list they show grayed out, the same as a deactivated technician today; that list is in name order, so they appear among the others alphabetically, and they cannot be unticked there.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "6 Technician dropdowns on a work order" (the design draws no Edit Labor window, register TT-N10).
- Pictures to attach: tt-p6-04-after-add-technician-on-a-line.png.
- The design's own words:
  - “Anyone already on a line who is not a technician any more stays on it and shows grayed out, the same as a deactivated technician today.”

AUTOMATION: READY

## DC-27 · Design: Edit Line shows a former technician as an ordinary chip with its X

**Title:** Design: Edit Line shows a former technician as an ordinary chip with its X

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have staff member C at the test location with Time Clock on and Technician on.
- Have a new open service work order at the test location with an approved labor line, with staff member C added to it with Add Technician and no time logged on it.
- Then switch Technician off for staff member C in Edit Staff Member, click Save & Close and click Save in the Turn Off Technician warning.

**Steps**
1. Open the work order.
2. Open the labor line in the Edit Line window.

**Expected Result**
Step 1:
- The work order opens on its Lines tab.
Step 2:
- Staff member C shows in Add Technician as an ordinary chip, not grayed out, with its X to remove it, the same as the other technicians' chips.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11881 (Story 3, Who appears on the technician lists)
- S3-R8: “In Edit Line they show as an ordinary chip that can be removed with its X, unless they have logged time on the line, in which case the chip shows the existing lock and "This technician has logged time on the line and cannot be removed.", as today.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "6 Technician dropdowns on a work order", picture "Add Technician on a line" (This build); the chip is not drawn (register TT-N10).
- Pictures to attach: tt-p6-04-after-add-technician-on-a-line.png.
- The design's own words:
  - “Anyone already on a line who is not a technician any more stays on it and shows grayed out, the same as a deactivated technician today.”
- Difference: the design's caption on this picture says such a person "shows grayed out"; S3-R8 says an ordinary chip in Edit Line (register TT-D02, question 2; design version DV-02, held).

AUTOMATION: READY

## DC-28 · Design: Lead Technician shows Unassigned as text when there are no technicians

**Title:** Design: Lead Technician shows Unassigned as text when there are no technicians

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Use a test location where no staff member has both Time Clock and Technician on.
- Have an open service work order at that location with no lead technician.

**Steps**
1. Open the work order.

**Expected Result**
Step 1:
- In the card at the left, the Lead Technician field shows as plain text: the label Lead Technician with Unassigned under it, with no dropdown arrow and no border, the same way the field reads in the picture behind the open Edit Line window.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11881 (Story 3, Who appears on the technician lists)
- S3-R7a: “If a location has no technicians and the work order has no lead, the Lead Technician field shows as read-only text, the label "Lead technician" with "Unassigned" under it, as it does today whenever that list is empty.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "6 Technician dropdowns on a work order", picture "Add Technician on a line" (This build, left card); the no-technician state is not drawn (register TT-N09).
- Pictures to attach: tt-p6-04-after-add-technician-on-a-line.png.
- The design's own words:
  - “Work order S2-17528.”
- The PRD writes the label "Lead technician"; the screen shows "Lead Technician" today (register TT-D07, settled by "as it does today").

AUTOMATION: READY

## DC-29 · Design: Board View shows No technicians yet when there are no technicians

**Title:** Design: Board View shows No technicians yet when there are no technicians

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Use a test location where no staff member has both Time Clock and Technician on, with at least one open work order, no pinned column and no lead on any work order shown.
- Make sure Assigned to me and the Technician filter are off on Work Orders.

**Steps**
1. Open Work Orders.
2. Click the Board View icon in the display switcher.

**Expected Result**
Step 1:
- Work Orders opens.
Step 2:
- The board shows the title "No technicians yet" with the text "Turn Technician on for your technicians in Staff to assign work orders. Until then, every work order stays in Unassigned."
- A button reads "Set Up Technicians"; clicking it opens Settings, Staff.
- The Unassigned column is still shown with the work orders.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11881 (Story 3, Who appears on the technician lists)
- S3-R10: “When Board View or Tech View has no technician column or group at all (no technician at the location, no column kept for a non-technician lead under S3-E1 and no pinned column under S3-E2), and neither Assigned to me nor a Technician filter is on, it shows the title "No technicians yet" with the text "Turn Technician on for your technicians in Staff to assign work orders. Until then, every work order stays in Unassigned." The button the Board View and Tech View PRD (S1-N1d, SV-11555) calls Add Technician reads "Set Up Technicians" and opens the staff list (Settings, Staff), for the same users who see it today.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "5 Board View and Tech View" (no picture of this state, register TT-N12); design system library ds/shopview/components.css, EMPTY STATE rule.
- Pictures to attach: tt-p5-02-after-board-view.png.
- Difference: the design system library the canvas installs says an empty state has "at most one sentence"; the PRD text has two (register TT-D04, question 3).

AUTOMATION: READY

## DC-30 · Design: Nothing here yet text names Technician when there are no technicians

**Title:** Design: Nothing here yet text names Technician when there are no technicians

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Use a test location where no staff member has both Time Clock and Technician on and no work order is open on the All tab of Work Orders.
- Make sure Assigned to me and the Technician filter are off on Work Orders.

**Steps**
1. Open Work Orders.
2. Click the Board View icon in the display switcher.

**Expected Result**
Step 1:
- Work Orders opens.
Step 2:
- The board shows the title "Nothing here yet" with the text "Turn Technician on for your technicians and create your first work order to track work by tech."
- A button reads "Set Up Technicians".

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11881 (Story 3, Who appears on the technician lists)
- S3-R10: “When the open tab has no work orders either, the "Nothing here yet" state keeps its title, and its text reads "Turn Technician on for your technicians and create your first work order to track work by tech."”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "5 Board View and Tech View" (no picture of this state, register TT-N12).
- Pictures to attach: tt-p5-02-after-board-view.png.

AUTOMATION: READY

## DC-31 · Design: Reassign window lists a former lead as Current · no longer assignable

**Title:** Design: Reassign window lists a former lead as Current · no longer assignable

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have staff member C at the test location with Time Clock on and Technician on.
- Have a new open service work order at the test location with staff member C as its lead, shown on Board View.
- Then switch Technician off for staff member C in Edit Staff Member, click Save & Close and click Save in the Turn Off Technician warning.

**Steps**
1. Open Work Orders.
2. Click the Board View icon in the display switcher.
3. Open the more-actions menu on the work order's card.
4. Click Reassign lead technician.
5. Type the first three letters of staff member C's first name.

**Expected Result**
Step 1:
- Work Orders opens.
Step 2:
- Board View opens with a column for staff member C holding the work order.
Step 3:
- The card's menu opens.
Step 4:
- The Reassign lead technician window opens; staff member C is the last entry, labelled "Current · no longer assignable", and cannot be picked.
Step 5:
- The search finds staff member C's entry, still labelled "Current · no longer assignable".

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11881 (Story 3, Who appears on the technician lists)
- S3-R4: “A current lead who is not offered per S3-R1 is listed last, cannot be picked, and is labeled "Current · no longer assignable"; searching for their name finds that entry.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "5 Board View and Tech View", picture "Reassign lead technician, searching \"Oli\"" (This build); the former-lead entry is not drawn (register TT-N08).
- Pictures to attach: tt-p5-08-after-reassign-lead-technician-searching-oli.png.

AUTOMATION: READY

## DC-32 · Design: New pills and the notice are gone after the end date

**Title:** Design: New pills and the notice are gone after the end date

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Know the "New" pill end date of the build under test (07:00 UTC on the seventh day after the release that ships Technician Toggle).
- Be able to change your computer's date and time.
- Start on the Settings page.

**Steps**
1. Set your computer's clock to one hour after the end date.
2. In the Settings menu, click Staff.
3. Scroll the staff table to its last columns.
4. Click New Staff Member.

**Expected Result**
Step 1:
- The computer shows the new date and time.
Step 2:
- The staff list shows no notice: the Active and Deactivated tabs sit right below the toolbar, as in the production picture.
Step 3:
- The Technician column header shows the word Technician with no "New" pill.
Step 4:
- The Technician toggle shows the word Technician with no "New" pill.

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11882 (Story 4, Technician column and notice on the staff list), story SV-11879 (Story 1, Technician toggle on a staff member)
- S4-N2: “After the end date, neither the notice nor the pills show anywhere.”
- S1-R2: “The moment is fixed in UTC and read from the viewer's own clock: the pill shows while that clock is before it and is gone from that moment on.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "1 Staff list", pictures "Notice and Technician column" (This build) and "Staff list" (Production today (before)); the after-date state is not drawn (register TT-N17).
- Pictures to attach: tt-p1-02-after-notice-and-technician-column.png, tt-p1-01-before-staff-list.png.
- The design's own words:
  - “"New" pill at the top right of the Technician header. It goes away at 07:00 UTC on the seventh day after the release that ships this; the exact date is set when the release is scheduled.”
- Set the computer's clock back afterwards.

AUTOMATION: READY

## DV-01 · Design: Time Clock back on in New Staff Member leaves Technician off

**Title:** Design: Time Clock back on in New Staff Member leaves Technician off

**Preconditions**
- Sign in as an Admin at the test location.
- Use the build before the "New" pill end date (07:00 UTC on the seventh day after the release that ships Technician Toggle), by your computer's clock.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Open the attached picture tt-p3-01-after-time-clock-off.png at 100% zoom beside the screen.
- Start on the Settings page.

**Steps**
1. In the Settings menu, click Staff.
2. Click New Staff Member.
3. In Role, pick the built-in Technician role.
4. Switch Time Clock on.
5. Switch Time Clock off.
6. Switch Time Clock on.

**Expected Result**
Step 1:
- The staff list opens.
Step 2:
- The New Staff Member window opens.
Step 3:
- Role shows Technician.
Step 4:
- Technician switches on.
Step 5:
- Technician turns off and is grayed out.
Step 6:
- Design version: Technician stays off and the user turns it on (the PRD instead pre-fills it on again from the role).

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11879 (Story 1, Technician toggle on a staff member)
- S1-R5: “In Edit Staff Member, turning Time Clock back on leaves Technician off; the user turns it on. In New Staff Member, turning Time Clock on pre-fills Technician from the role (S1-R3), unless the user has already switched Technician by hand.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "3 When Technician can't be turned on", picture "Time Clock off" (This build), board note "Shown in the New Staff Member window; Edit behaves the same.".
- Pictures to attach: tt-p3-01-after-time-clock-off.png.
- The design's own words:
  - “Turning Time Clock off turns Technician off. Turning Time Clock back on leaves Technician off; the user turns it on.”
  - “Shown in the New Staff Member window; Edit behaves the same.”
- Held: the design differs from the PRD (register TT-D01, question 1 for Chris Ward). Not run and not added to the run until he answers; released (and the PRD case changed) if the design wins, deleted with the QA lead's go-ahead if the PRD wins.

AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO

## DV-02 · Design: A former technician on a line shows grayed out in Edit Line

**Title:** Design: A former technician on a line shows grayed out in Edit Line

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have staff member C at the test location with Time Clock on and Technician on.
- Have a new open service work order at the test location with an approved labor line, with staff member C added to it with Add Technician and no time logged on it.
- Then switch Technician off for staff member C in Edit Staff Member, click Save & Close and click Save in the Turn Off Technician warning.

**Steps**
1. Open the work order.
2. Open the labor line in the Edit Line window.

**Expected Result**
Step 1:
- The work order opens on its Lines tab.
Step 2:
- Design version: staff member C stays on the line and their chip in Add Technician shows grayed out, the same as a deactivated technician (the PRD instead shows an ordinary chip with its X).

Exact quotes from the source (for reproducibility)
From: PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward), read 2 Nov 2026 · Epic SV-11788, story SV-11881 (Story 3, Who appears on the technician lists)
- S3-R8: “In Edit Line they show as an ordinary chip that can be removed with its X, unless they have logged time on the line, in which case the chip shows the existing lock and "This technician has logged time on the line and cannot be removed.", as today.”
Not yet checked against a build.

References from Design
- Design canvas "Technician Toggle" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R), version 1793629882-06f7, read 2 Nov 2026: page "6 Technician dropdowns on a work order", picture "Add Technician on a line" (This build).
- Pictures to attach: tt-p6-04-after-add-technician-on-a-line.png.
- The design's own words:
  - “Anyone already on a line who is not a technician any more stays on it and shows grayed out, the same as a deactivated technician today.”
- Held: the design differs from the PRD (register TT-D02, question 2 for Chris Ward). Not run and not added to the run until he answers.

AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO
