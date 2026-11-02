

# SV-11879 — Technician Toggle - Story 1 - Technician toggle on a staff member

Status: In Progress | Updated: 2026-11-02T12:32:47.746-0500

## Summary

Add a Technician toggle to the New and Edit Staff Member windows, to the right of Sales Representative, so shops say per person who is offered as a technician without changing anyone's Time Clock or Billable.

## Context

As a shop owner, I want to say on each staff member whether they are a technician so that the technician lists show the right people.

Prerequisites: User must have 'Settings → App Settings' setting enabled.

Form factor: Desktop only by rule - the staff window is a settings page, so mobile is not applicable.

## Requirements

* S1-R1: The New Staff Member and Edit Staff Member windows (Settings, Staff) show a toggle labeled "Technician" directly to the right of the Sales Representative toggle, as the last toggle in that row (Time Clock, Sales Representative, Technician). In both windows the three toggles share one row of their own, below the Billable field, so New and Edit look the same, in the same style as the window's other toggles.
* S1-R2: A "New" pill sits at the top right of the "Technician" label, touching the end of the word. It looks the same as the pill on the Work Orders display switcher. It shows until 07:00 UTC on the seventh day after the release that ships this feature, then disappears for everyone, including in a window that is already open. The moment is fixed in UTC and read from the viewer's own clock: the pill shows while that clock is before it and is gone from that moment on. The exact date is set when the release is scheduled.
* S1-R3: In the New Staff Member window, Technician is pre-filled from the role shown: on when the role is the built-in Technician or the built-in Foreman role and Time Clock is on, otherwise off. Every other role pre-fills off, including Parts Technician and every custom role, even one made from Technician or Foreman. The pre-fill runs when the window opens and again each time the role or Time Clock is changed, until the user switches Technician by hand. From then on the user's choice wins: changing the role or Time Clock no longer pre-fills it, though S1-R4 and S1-N1 still turn it off, and only the user turns it back on. The toggle as shown is what is saved. Save & Add Next clears the form as it does today (no role, Time Clock off, Technician off) and forgets any earlier switch by hand, so the next person is pre-filled from their own role. Edit Staff Member never pre-fills (S1-E1).
* S1-R4: Technician can only be on while Time Clock is on. While Time Clock is off, the Technician toggle is off and grayed out, and hovering it shows "Turn on Time Clock first. Only staff who clock in can be technicians." Turning Time Clock off, in the window or any other way (for example through the Public API), turns Technician off.
* S1-R5: In Edit Staff Member, turning Time Clock back on leaves Technician off; the user turns it on. In New Staff Member, turning Time Clock on pre-fills Technician from the role (S1-R3), unless the user has already switched Technician by hand.
* S1-R6: Switching Technician on or off changes nothing until the user saves the staff member with the window's existing Save. Once saved, the change applies to every technician list (Story 3) the next time each list loads (S1-E3).
* S1-R7: A save that turns Technician on never shows a warning. A save that turns it off may show the Turn Off Technician warning first (Story 2).
* S1-R8: Saving a change to Technician never logs the staff member out. A save that also changes Time Clock or the role logs them out, as a Time Clock or role change does today.
* S1-R9: Billable and Sales Representative work exactly as today. Technician does not change, gray out or require either of them, and neither of them changes Technician.
* S1-N1: When the role picked in the window is the built-in Office User or Time Clock User role, the Technician toggle is off and grayed out, and hovering it shows "This role can't be a technician." Picking one of those roles turns Technician off. In Edit Staff Member, saving a staff member who was saved with Technician on and now has one of those roles shows the Turn Off Technician warning first (Story 2). Any other role, including a custom role made from either built-in role, never grays it out.
* S1-N2: If the user does not have the 'Settings → App Settings' setting, they cannot open the staff list or the staff window, as today.
* S1-N3: This feature adds no history of who changed Technician or when.
* S1-E1: In Edit Staff Member, changing the staff member's role to any role other than the built-in Office User or Time Clock User role leaves Technician as it is. Picking the built-in Technician or Foreman role does not turn it on; the pre-fill (S1-R3) is for new staff only.
* S1-E2: A deactivated staff member keeps their Technician toggle as it was, but is not a technician while deactivated (Story 3). Reactivating them brings it back as it was.
* S1-E3: A screen that is already open when a staff member's Technician toggle is saved keeps its lists until it loads them again; nothing is pushed to open screens. A work order's technician dropdowns show the change once the work order is opened again or the page is reloaded; reopening a dropdown on the same page does not. Board View and Tech View show it when opened from the menu, a link or the display switcher, when the filter or location changes, or on reload; coming back with the browser's Back within 30 seconds shows the board as it was. The Assign / Reassign lead technician window shows it every time it opens.
* S1-E4: Deactivate Account shows no Turn Off Technician warning. The person keeps their Technician toggle as it was (S1-E2), is not offered as a technician while deactivated, and keeps every work order and line they hold.
* Error handling: The window never sends Technician on without Time Clock, or for a staff member on the built-in Office User or Time Clock User role. A request from elsewhere (for example a second tab, or a staff window opened before another user changed the record) that would switch Technician from off to on in either case is refused with "A technician must have Time Clock on." or "This role can't be a technician." respectively, shown through the existing request error behavior, and nothing is saved. The Public API cannot set Technician, so it never gets these messages (S5-N1). When both apply (Time Clock off and one of those roles), the message is "This role can't be a technician.", both on hover in the window and in the refusal. A request for a staff member whose Technician is already on that turns Time Clock off, or moves them to one of those roles, is not refused: it saves, and Technician turns off (S1-R4, S1-N1).

## Acceptance Criteria

- [ ] Given a user with 'Settings → App Settings' opens New Staff Member or Edit Staff Member, then a toggle labeled "Technician" shows directly to the right of the Sales Representative toggle, as the last toggle in one row of its own below the Billable field, in the order Time Clock, Sales Representative, Technician, the same in both windows and in the same style as the other toggles (S1-R1).
- [ ] Given it is before 07:00 UTC on the seventh day after the release that ships this feature, by the viewer's own clock, when the staff window shows, then a "New" pill sits at the top right of the "Technician" label, touching the end of the word, and it is the same pill as the one on the Work Orders display switcher (S1-R2).
- [ ] Given a staff window is already open with the "New" pill showing, when 07:00 UTC on the seventh day after the release that ships this feature, by the viewer's own clock passes, then the pill disappears without a reload, and from then on it shows for no user (S1-R2).
- [ ] Given the release date is scheduled, then the build's end date for the "New" pill is 07:00 UTC on the seventh day after that release date; if it is still the placeholder 31 Dec 2026, 07:00 UTC, this check fails (S1-R2, SV-12008).
- [ ] Given a user opens New Staff Member and the role shown is the built-in Technician or the built-in Foreman role with Time Clock on, then Technician is on (S1-R3).
- [ ] Given the role in New Staff Member is any other role, including Parts Technician and any custom role made from Technician or Foreman, or Time Clock is off, then Technician is off (S1-R3).
- [ ] Given New Staff Member is open and the user has not switched Technician by hand, when the user changes the role or Time Clock, then Technician is set again from the role (S1-R3).
- [ ] Given New Staff Member with the built-in Technician role and Time Clock on (Technician pre-filled on), when the user switches Technician off by hand and then picks the built-in Foreman role, then Technician stays off; when the user then switches Time Clock off and back on, then Technician stays off (S1-R3).
- [ ] Given Technician was pre-filled in New Staff Member, when the user switches it either way and saves, then the staff member is saved with the toggle as shown (S1-R3); when they use Save & Add Next, then the next, empty form starts with no role, Time Clock off and Technician off, and is pre-filled from the next person's own role, whatever was switched by hand before (S1-R3).
- [ ] Given Time Clock is off in the staff window, then the Technician toggle is off and grayed out, and hovering it shows "Turn on Time Clock first. Only staff who clock in can be technicians." (S1-R4).
- [ ] Given Time Clock and Technician are both on in the staff window, when the user switches Time Clock off, then Technician switches off and is grayed out (S1-R4).
- [ ] Given a staff member with Time Clock and Technician on, when Time Clock is turned off another way (for example through the Public API), then Technician is off too (S1-R4).
- [ ] Given Edit Staff Member, and Technician was turned off because Time Clock was switched off, when the user switches Time Clock back on, then Technician stays off and can be switched on by the user; in New Staff Member it is pre-filled from the role instead, unless the user has already switched Technician by hand (S1-R5).
- [ ] Given a user switches Technician on or off, when they have not saved the staff member, then no technician list changes; when they save with the window's existing Save, then the change applies to every technician list the next time each list loads (S1-R6).
- [ ] Given a user saves a staff member with Technician turned on, then no warning shows; given they save with it turned off, then the Turn Off Technician warning may show first, per Story 2 (S1-R7).
- [ ] Given a staff member is logged in, when they are saved with only Technician changed (on or off), then they are not logged out; when the same save also changes Time Clock or the role, then they are logged out, as a Time Clock or role change does today (S1-R8).
- [ ] Given any staff member, when Technician is switched on or off, then Billable and Sales Representative do not change and are not grayed out; when Billable or Sales Representative is changed, then Technician does not change (S1-R9).
- [ ] Given the role picked in the staff window is the built-in Office User role or the built-in Time Clock User role, then the Technician toggle is off and grayed out, and hovering it shows "This role can't be a technician."; given Technician was on, when the user picks one of those roles, then Technician switches off (S1-N1).
- [ ] Given Edit Staff Member for a staff member saved with Technician on who holds counted open work, when the user picks the built-in Office User or Time Clock User role and saves, then the Turn Off Technician warning shows first, per Story 2 (S1-N1).
- [ ] Given the role picked is any other role, including a custom role made from either built-in role, then the Technician toggle is not grayed out on account of the role (S1-N1).
- [ ] Given a user without the 'Settings → App Settings' setting, then they cannot open the staff list or the staff window, as today (S1-N2).
- [ ] Given a user changes a staff member's Technician and saves, then no new record of who changed it or when is kept (S1-N3).
- [ ] Given Edit Staff Member and Technician is on, when the user changes the staff member's role to any role other than the built-in Office User or Time Clock User role, then Technician stays on; given Technician is off, when the user picks the built-in Technician or Foreman role, then Technician stays off (S1-E1).
- [ ] Given a staff member with Technician and Time Clock on is deactivated, then they are not offered on any technician list; when they are reactivated, then their Technician toggle is as it was before deactivation (S1-E2).
- [ ] Given a work order is open when a staff member's Technician toggle is saved, when the user reopens a technician dropdown on the same page, then the list has not changed; when the work order is opened again or the page is reloaded, then the dropdown shows the change (S1-E3).
- [ ] Given Board View or Tech View is open when a staff member's Technician toggle is saved, then nothing changes on the open screen; when the board is opened from the menu, a link or the display switcher, the filter or location changes, or the page is reloaded, then it shows the change; when the user comes back with the browser's Back within 30 seconds, then it shows the board as it was (S1-E3).
- [ ] Given a staff member's Technician toggle was saved while a page was open, when the Assign or Reassign lead technician window is opened on that page, then it shows the change, every time it opens (S1-E3).
- [ ] Given a staff member with Technician and Time Clock on and open work, when the user clicks Deactivate Account, then no Turn Off Technician warning shows; the person keeps their Technician toggle, is not offered while deactivated, and keeps every work order and line they hold (S1-E4).
- [ ] Given a request from outside the staff window (for example a second tab, or a staff window opened before another user changed the record) would switch Technician from off to on for a staff member whose Time Clock is off, then it is refused with "A technician must have Time Clock on."; given it would switch Technician from off to on for a staff member on the built-in Office User or Time Clock User role, then it is refused with "This role can't be a technician."; both are shown through the existing request error behavior and nothing is saved (Error handling).
- [ ] Given Time Clock is off and the role is the built-in Office User or Time Clock User role, then hovering the grayed-out Technician toggle shows "This role can't be a technician.", and a request from outside the staff window that would switch Technician on is refused with "This role can't be a technician." (Error handling).
- [ ] Given a staff member whose Technician is already on, when a request from outside the staff window turns Time Clock off, or moves them to the built-in Office User or Time Clock User role, while still sending Technician on, then it is not refused: it saves and Technician is off afterwards (Error handling).

## UI/UX

Design: page 2 (Turn Technician on for a staff member)

Design: page 3 (When Technician can't be turned on)

[Technician Toggle design canvas](https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R)

## PRD

[Technician Toggle, Story 1](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=977371146)


# SV-11880 — Technician Toggle - Story 2 - Warning before turning Technician off

Status: In Progress | Updated: 2026-11-02T09:29:44.846-0500

## Summary

Show a "Turn Off Technician" warning with the open work a staff member still holds before they are saved with Technician turned off, so the editor knows they stay on existing work; nothing is unassigned.

## Context

As a shop owner, I want to know what a staff member still holds before I turn Technician off so that I am not surprised by who stays on existing work.

Prerequisites: User must have 'Settings → App Settings' setting enabled. The staff member was saved with Technician on, and in Edit Staff Member the user has switched Technician off, switched Time Clock off (which turns Technician off, S1-R4), or picked the built-in Office User or Time Clock User role (which turns Technician off, S1-N1).

Form factor: Desktop only by rule - the staff window is a settings page, so mobile is not applicable.

## Requirements

* S2-R1: When the user saves, before anything else, the system counts the staff member's open work across every location of the organization: the work orders they lead and the lines they are on, whether they have labor on the line, were added to it with Add Technician, or are the line's own technician, where the work order is a service work order in Estimate, Approved, In Progress or Ready for Review and the line is not declined. Each work order and each line is counted once. A line on a work order the person also leads still counts, so that job shows as one work order they lead and one line they are on. A person added to a line through a schedule shift is on the line, the same as one added with Add Technician.
* S2-R2: When at least one work order or line is counted, a warning window titled "Turn Off Technician" shows. The text names the staff member as last saved (a new name typed in the same save is not used) and what they hold, for example: "Jordan Lee leads 8 open work orders and is on 50 labor lines. They'll stay on them, but won't be offered as a technician on anything new."
* S2-R3: The text adapts to the counts. A count of zero leaves its part out, and "it" is used only when the work orders and lines add up to 1. Exact text for each case (\[Name\] is the staff member's name):

    * 1 work order, no lines: "\[Name\] leads 1 open work order. They'll stay on it, but won't be offered as a technician on anything new."
    * No work orders, 1 line: "\[Name\] is on 1 labor line. They'll stay on it, but won't be offered as a technician on anything new."
    * 1 work order, 1 line: "\[Name\] leads 1 open work order and is on 1 labor line. They'll stay on them, but won't be offered as a technician on anything new."
    * No work orders, 5 lines: "\[Name\] is on 5 labor lines. They'll stay on them, but won't be offered as a technician on anything new."
    * 3 work orders, no lines: "\[Name\] leads 3 open work orders. They'll stay on them, but won't be offered as a technician on anything new."
    
* S2-R4: The window has Cancel and Save. Save continues the staff save as in S1-R6. Cancel, the X or Escape close the warning and leave the staff member unsaved, with the staff window still open and the toggle as the user left it; clicking outside the warning does nothing. While the counts load after Save, the Save button shows its loading state and cannot be clicked again. Closing the staff window while the counts load cancels the save: nothing is saved and no warning shows. Save in the warning saves the staff member exactly as the window showed when the warning opened.
* S2-R5: Saving with Technician off unassigns nothing. Every lead and labor line stays as it was (Story 3, S3-R7 and S3-R8).
* S2-N1: If no open work order or line is counted, no warning shows and the save goes straight on.
* S2-N2: If the save does not turn Technician off (it was already off, or stays on), no warning shows.
* S2-E1: Declined, Complete, Invoiced and Paid work orders, part sales, and declined lines on any work order are never counted.
* S2-E2: A save that turns Technician off in more than one way at once (for example Technician and Time Clock both switched off, or Time Clock off and the Office User role picked) shows the warning once.
* S2-E3: Turning off Sales Representative still shows its existing removal warning at the moment that toggle is switched off, as today; the Turn Off Technician warning shows only on Save. Cancelling the Turn Off Technician warning cancels the whole save, including a Sales Representative removal already confirmed, and the window stays open as the user left it.
* Error handling: If the counts cannot be loaded, the save goes ahead without the warning; any error message follows the existing request error behavior. The warning is information, not a guard.

## Acceptance Criteria

- [ ] Given a staff member saved with Technician on who, across two locations of the organization, leads one service work order in Estimate and one in In Progress, and is on a labor line of a service work order in Approved that they do not lead, when the user switches Technician off in Edit Staff Member and saves, then before anything else is saved the counts are 2 open work orders and 1 labor line (S2-R1).
- [ ] Given the staff member leads a service work order in Ready for Review, when Technician is switched off and saved, then that work order is counted as open (S2-R1).
- [ ] Given on an Approved service work order they do not lead, the staff member has labor on line 1, was added with Add Technician (with no labor) to line 2, and is the own technician of line 3, none declined, when Technician is switched off and saved, then 0 work orders and 3 labor lines are counted, each line once (S2-R1).
- [ ] Given the staff member leads an In Progress service work order and has labor on one of its lines, not declined, and holds nothing else, when Technician is switched off and saved, then the warning reads "\[Name\] leads 1 open work order and is on 1 labor line. They'll stay on them, but won't be offered as a technician on anything new." (S2-R1).
- [ ] Given the staff member was added to a line of an Approved service work order, not declined, through a schedule shift, and holds nothing else, when Technician is switched off and saved, then 1 labor line is counted (S2-R1).
- [ ] Given the staff member was saved with Technician on and holds counted work, when the user switches Time Clock off (which turns Technician off) and saves, then the same counts are taken and the same warning shows (S2-R1).
- [ ] Given the staff member was saved with Technician on and holds counted work, when the user picks the built-in Office User or Time Clock User role (which turns Technician off) and saves, then the same counts are taken and the same warning shows (S2-R1).
- [ ] Given at least one open work order or labor line is counted, when the user saves, then a warning window titled "Turn Off Technician" shows; for Jordan Lee leading 8 open work orders and on 50 labor lines it reads "Jordan Lee leads 8 open work orders and is on 50 labor lines. They'll stay on them, but won't be offered as a technician on anything new." (S2-R2).
- [ ] Given a staff member last saved as "Jordan Lee", when the user changes the first name to "Jordy" and switches Technician off in the same save, then the warning names "Jordan Lee" (S2-R2).
- [ ] Given 1 work order and no lines, then the text reads "\[Name\] leads 1 open work order. They'll stay on it, but won't be offered as a technician on anything new." (S2-R3).
- [ ] Given no work orders and 1 line, then the text reads "\[Name\] is on 1 labor line. They'll stay on it, but won't be offered as a technician on anything new." (S2-R3).
- [ ] Given 1 work order and 1 line, then the text reads "\[Name\] leads 1 open work order and is on 1 labor line. They'll stay on them, but won't be offered as a technician on anything new." (S2-R3).
- [ ] Given no work orders and 5 lines, then the text reads "\[Name\] is on 5 labor lines. They'll stay on them, but won't be offered as a technician on anything new." (S2-R3).
- [ ] Given 3 work orders and no lines, then the text reads "\[Name\] leads 3 open work orders. They'll stay on them, but won't be offered as a technician on anything new.", with no labor line part (S2-R3).
- [ ] Given the warning shows, when the user clicks Save, then the staff save continues as in S1-R6 (S2-R4).
- [ ] Given the warning shows, when the user clicks Cancel, clicks the X or presses Escape, then the warning closes, the staff member is not saved, and the staff window stays open with the toggles as the user left them (S2-R4).
- [ ] Given the warning shows, when the user clicks outside it, then nothing happens and the warning stays open (S2-R4).
- [ ] Given the user has clicked Save with Technician switched off, while the counts load, then the Save button shows its loading state and clicking it again does nothing (S2-R4).
- [ ] Given the counts are still loading after Save, when the user closes the staff window, then nothing is saved and no warning shows (S2-R4).
- [ ] Given the warning shows, when the user clicks Save in it, then the staff member is saved exactly as the window showed when the warning opened (S2-R4).
- [ ] Given the staff member is saved with Technician off after the warning, then every lead and labor line they held stays exactly as it was, and nothing is unassigned (S2-R5).
- [ ] Given no open work order or labor line is counted, when the user saves with Technician switched off, then no warning shows and the save goes straight on (S2-N1).
- [ ] Given Technician was already off, or stays on, when the user saves the staff member, then no warning shows (S2-N2).
- [ ] Given the staff member only leads or is on lines of Declined, Complete, Invoiced and Paid work orders and part sales, plus a declined line on an In Progress service work order they do not lead, when Technician is switched off and saved, then nothing is counted and no warning shows (S2-E1).
- [ ] Given a save that turns Technician off in more than one way at once (Technician and Time Clock both switched off, or Time Clock off and the Office User role picked), when the staff member holds counted work, then the warning shows once (S2-E2).
- [ ] Given a staff member who is a sales representative and a technician with open work, when the user switches Sales Representative off, then its existing removal warning shows at that moment, as today; when the user then switches Technician off and clicks Save, then the Turn Off Technician warning shows (S2-E3).
- [ ] Given the user confirmed the Sales Representative removal and then cancels the Turn Off Technician warning, then nothing is saved, including the Sales Representative removal, and the window stays open with both toggles as the user left them; given the user cancelled the Sales Representative removal and confirms the Turn Off Technician warning, then the save goes through with Sales Representative on and Technician off (S2-E3).
- [ ] Given the counts cannot be loaded, when the user saves with Technician switched off, then the save goes ahead without the warning, any error message shown follows the existing request error behavior, and no new message is added (Error handling).

## UI/UX

Design: page 4 (Turn Technician off with open work)

[Technician Toggle design canvas](https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R)

## PRD

[Technician Toggle, Story 2](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=977371146)


# SV-11881 — Technician Toggle - Story 3 - Who appears on the technician lists

Status: In Progress | Updated: 2026-11-02T12:32:49.232-0500

## Summary

Offer only technicians (Technician toggle on, Time Clock on, active, enrolled at the location, not on the built-in Office User or Time Clock User role) on Board View, Tech View, the Technician filter and the technician dropdowns, while existing leads and labor lines keep showing, so service writers assign and read the board without office and parts staff in the way.

## Context

As a service writer, I want the technician lists to offer only technicians so that I can assign work and read the board without the office and parts staff in the way.

Prerequisites: The user can see and use each screen as today; no permission changes.

Form factor: Mobile-optimized - no new controls; the existing screens keep their current mobile behavior and only the names they list change.

## Requirements

* S3-R1: A person is offered on a technician list at a location when all of these hold: their Technician toggle is on, their Time Clock is on, their user is active, they are enrolled at that location, and their role is not the built-in Office User or Time Clock User role.
* S3-R2: Board View gives a column, and Tech View a group, to each person offered by S3-R1, plus everyone who leads work shown on the board (S3-E1, S3-E2).
* S3-R3: The Technician filter on Work Orders offers the same people the board gives a column or group to.
* S3-R4: The Assign lead technician and Reassign lead technician window (from a card's more-actions menu on Board View or Tech View) offers only people per S3-R1. Searching for anyone else shows the existing No technicians match “\[search\]” message. A current lead who is not offered per S3-R1 is listed last, cannot be picked, and is labeled "Current · no longer assignable"; searching for their name finds that entry.
* S3-R5: The Lead Technician dropdown on a work order offers only people per S3-R1.
* S3-R6: Add Technician on a line (in the New Line and Edit Line windows) and the Technician dropdown in the Edit Labor window offer only people per S3-R1.
* S3-R6a: Part sales show no technician dropdown, so nothing on screen changes for them.
* S3-R7: A work order's current lead who is not offered per S3-R1 still shows as the lead on the work order and in Board View and Tech View. In the Lead Technician dropdown they are listed last, grayed out, with the check mark, and cannot be picked. Picking someone else saves at once, as today, and the former lead then leaves the dropdown.
* S3-R7a: If a location has no technicians and the work order has no lead, the Lead Technician field shows as read-only text, the label "Lead technician" with "Unassigned" under it, as it does today whenever that list is empty. If the work order's lead is not a technician, the dropdown still shows (S3-R7), listing "Unassigned" and that lead, grayed out, even when the location has no technicians.
* S3-R8: Someone already on a line who is not offered per S3-R1 stays on the line. In the Edit Labor technician list they show grayed out, the same as a deactivated technician today; that list is in name order, so they appear among the others alphabetically, and they cannot be unticked there. In Edit Line they show as an ordinary chip that can be removed with its X, unless they have logged time on the line, in which case the chip shows the existing lock and "This technician has logged time on the line and cannot be removed.", as today. Saving a line's technicians in Edit Line keeps a person who is no longer a technician on the line unless the user removed them. As today, saving also drops a person from the line who has a labor entry on the work order but is not in the location's Time Clock list (deactivated, Time Clock off, on the built-in Office User or Time Clock User role, or not enrolled at the location) and has no time logged on that line; such a person who is on the line only through Add Technician, with no labor entry, stays.
* S3-R9: Lists that are not technician lists keep everyone with Time Clock on except the Office User and Time Clock User roles, as today: time sheets and the time sheet dialogs, Punch Clock Activities, the Technician Efficiency and Technician Utilization reports, and the schedule (which follows departments).
* S3-R10: When Board View or Tech View has no technician column or group at all (no technician at the location, no column kept for a non-technician lead under S3-E1 and no pinned column under S3-E2), and neither Assigned to me nor a Technician filter is on, it shows the title "No technicians yet" with the text "Turn Technician on for your technicians in Staff to assign work orders. Until then, every work order stays in Unassigned." A Technician filter can be on at such a location only through its Unassigned or Deleted technician choices: people picked at another location are dropped from the filter when the location changes (S3-N1). When the open tab has no work orders either, the "Nothing here yet" state keeps its title, and its text reads "Turn Technician on for your technicians and create your first work order to track work by tech." The button the Board View and Tech View PRD (S1-N1d, SV-11555) calls Add Technician reads "Set Up Technicians" and opens the staff list (Settings, Staff), for the same users who see it today. This replaces S1-N1d's text and button target once this feature ships.
* S3-N1: A person with Technician off, or with Time Clock off, gets no Board View column, no Tech View group, and is not offered in the Technician filter or any technician dropdown, unless S3-E1 or S3-E2 applies. A person already picked in the Technician filter who is no longer offered (Technician turned off, or a person from another location) is dropped from the filter the next time the board loads, as if never picked. Their work orders do not move.
* S3-N2: A person on the built-in Office User or Time Clock User role is never offered, as today.
* S3-N3: Technician narrows only what is offered. A non-technician who is made lead or added to a labor line another way (an outside tool through the Public API, or a screen opened before the change) is accepted as today, and so is job time they record (S3-E3).
* S3-E1: Someone who is not a technician but still leads a work order shown on the board keeps a column (Board View) or group (Tech View) for that work until it is reassigned or closed.
* S3-E2: Someone who is not a technician but whose column the user pinned on Board View keeps the pinned column at the locations they are enrolled at, until the user unpins it. Dropping a work order on that column is refused with "This technician can't be assigned work orders."
* S3-E3: A person who is not a technician can still press Start on an approved line and record time, as today; doing so adds them to the line's labor as today.
* Error handling: No new failure paths: each list loads and fails as it does today. If only the list of technicians fails to load on a work order, the existing request error behavior applies, the technician pickers keep what they had (empty on first load) and anyone already assigned shows grayed out; the rest of the work order still loads.

## Acceptance Criteria

- [ ] Given a person whose Technician toggle is on, whose Time Clock is on, whose user is active, who is enrolled at location A only and whose role is not the built-in Office User or Time Clock User role, then they are offered on the technician lists at location A and not at location B; if any one of those conditions is false, they are not offered at location A (S3-R1).
- [ ] Given location A, when Board View or Tech View loads, then each person offered per S3-R1 at A has a column (Board View) or group (Tech View), plus everyone who leads work shown on the board (S3-R2).
- [ ] Given Work Orders at a location, when the user opens the Technician filter, then it offers exactly the people Board View gives a column, and Tech View a group, to (S3-R3).
- [ ] Given the Assign lead technician or Reassign lead technician window is opened from a card's more-actions menu on Board View or Tech View, then it offers only people per S3-R1; when the user searches "Pat" and the only Pat has Technician off and is not the card's current lead, then it shows the existing message No technicians match “Pat” (S3-R4).
- [ ] Given a card whose current lead is not offered per S3-R1, when the Reassign lead technician window opens, then the current lead is listed last, labeled "Current · no longer assignable", and cannot be picked; when the user searches for that lead's name, then that entry is found (S3-R4).
- [ ] Given a work order, when the user opens its Lead Technician dropdown, then it offers only people per S3-R1 (S3-R5).
- [ ] Given a work order line, when the user opens Add Technician in the New Line window or in the Edit Line window, or the Technician dropdown in the Edit Labor window, then each offers only people per S3-R1 (S3-R6).
- [ ] Given a part sale, then it shows no technician dropdown and nothing on its screen changes (S3-R6a).
- [ ] Given a work order whose current lead is not offered per S3-R1, then they still show as the lead on the work order and in Board View and Tech View; in the Lead Technician dropdown they are listed last, grayed out, with the check mark, and cannot be picked; when the user picks someone else, then that saves at once and the former lead no longer appears in the dropdown (S3-R7).
- [ ] Given a location with no technicians and a work order there with no lead, when the work order opens, then the Lead Technician field shows as read-only text: the label "Lead technician" with "Unassigned" under it, as it does today whenever that list is empty (S3-R7a).
- [ ] Given a work order whose lead is not a technician, including at a location with no technicians, when the work order opens, then the Lead Technician dropdown still shows (per S3-R7), listing "Unassigned" and that lead, grayed out (S3-R7a).
- [ ] Given someone already on a line who is not offered per S3-R1, then they stay on the line; in the Edit Labor technician list they show grayed out, the same as a deactivated technician today, in name order among the others alphabetically, and they cannot be unticked there (S3-R8).
- [ ] Given such a person on a line with no logged time on it, when the user opens Edit Line, then they show as an ordinary chip (not grayed out) that can be removed with its X (S3-R8).
- [ ] Given such a person who has logged time on the line, when the user opens Edit Line, then their chip shows the existing lock and "This technician has logged time on the line and cannot be removed.", as today, and cannot be removed (S3-R8).
- [ ] Given such a person on a line, when the user saves the line's technicians in Edit Line without removing them, then they stay on the line; when the user removed them with the chip's X, then they are no longer on the line after save (S3-R8).
- [ ] Given a person on the line with a labor entry on the work order and no time logged on that line, who is deactivated, has Time Clock off, is on the built-in Office User or Time Clock User role, or is not enrolled at the location, when the line's technicians are saved in Edit Line, then they are dropped from the line, as today; given such a person who is on the line only through Add Technician, with no labor entry, then they stay (S3-R8).
- [ ] Given a person with Time Clock on and Technician off, then they are still listed in time sheets and the time sheet dialogs, Punch Clock Activities, and the Technician Efficiency and Technician Utilization reports; given a person with Time Clock on whose role is the built-in Office User or Time Clock User role, then they are not listed there, as today; the schedule keeps following departments (S3-R9).
- [ ] Given Board View or Tech View at a location with no technician, no column kept for a non-technician lead under S3-E1 and no pinned column under S3-E2, with neither Assigned to me nor a Technician filter on, when it opens, then it shows the title "No technicians yet" with the text "Turn Technician on for your technicians in Staff to assign work orders. Until then, every work order stays in Unassigned." (S3-R10).
- [ ] Given the same board state as the "No technicians yet" case, when the open tab also has no work orders, then the "Nothing here yet" state shows with its title unchanged and the text "Turn Technician on for your technicians and create your first work order to track work by tech." (S3-R10).
- [ ] Given a location with no technician, when the board has a column (Board View) or group (Tech View) kept for a non-technician lead under S3-E1, or a pinned column under S3-E2, then "No technicians yet" does not show (S3-R10).
- [ ] Given a location with no technician and no S3-E1 or S3-E2 column, when Assigned to me is on, or a Technician filter is on, then "No technicians yet" does not show (S3-R10); given people were picked in the Technician filter at another location, when the user changes to this location, then they are dropped from the filter, and "No technicians yet" shows unless the Unassigned or Deleted technician choice is on (S3-R10, S3-N1).
- [ ] Given a user who sees the button the Board View and Tech View PRD (S1-N1d, SV-11555) calls Add Technician, when that button shows, then it reads "Set Up Technicians" and clicking it opens the staff list (Settings, Staff); users who do not see that button today still do not see it (S3-R10).
- [ ] Given a person with Technician off, or with Time Clock off, who leads no work shown on the board and has no pinned column, then they get no Board View column and no Tech View group, and are not offered in the Technician filter or any technician dropdown (S3-N1); given such a person was already picked in the Technician filter, when the board next loads, then they are dropped from the filter as if never picked, and their work orders do not move (S3-N1).
- [ ] Given a person on the built-in Office User or Time Clock User role, then they are never offered on any technician list, as today (S3-N2).
- [ ] Given a non-technician is made lead or added to a labor line through the Public API, or from a screen opened before the change, then the assignment is accepted as today; given they record job time, then it is accepted as today (S3-N3).
- [ ] Given someone who is not a technician leads a work order shown on the board, then they keep a column (Board View) or group (Tech View) for that work until it is reassigned or closed (S3-E1).
- [ ] Given a user pinned the Board View column of someone who is not a technician, then the pinned column stays at the locations that person is enrolled at, until the user unpins it (S3-E2).
- [ ] Given such a pinned column of a non-technician, when the user drops a work order on it, then the drop is refused with "This technician can't be assigned work orders." and the work order's lead does not change (S3-E2).
- [ ] Given a person who is not a technician and has Time Clock on, when they press Start on an approved line, then they record time and are added to the line's labor, as today (S3-E3).
- [ ] Given any technician list fails to load, then it fails exactly as it does today; no new error message is added (Error handling).
- [ ] Given a work order where only the list of technicians fails to load, then the existing request error behavior applies, the technician pickers keep what they had (empty on first load), anyone already assigned shows grayed out, and the rest of the work order still loads (Error handling).

## UI/UX

Design: page 5 (Board View and Tech View)

Design: page 6 (Technician dropdowns on a work order)

[Technician Toggle design canvas](https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R)

## PRD

[Technician Toggle, Story 3](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=977371146)


# SV-11884 — Technician Toggle - Story 6 - Release day

Status: In Progress | Updated: 2026-11-02T09:29:46.085-0500

## Summary

Turn Technician on once at release for every active Time Clock staff member who did technician work recently or is billable, and mark them as updated, so no shop loses a technician on release day; everyone else starts off.

## Context

As a shop owner, I want ShopView to keep my current technicians on release day so that nobody disappears from the board or the dropdowns before I have looked at the new toggle.

Prerequisites: None: it runs for every organization.

Trigger: The release that ships this feature, once.

## Requirements

* S6-R1: Technician is turned on for each staff member whose user is active, whose Time Clock is on and who has a role other than the built-in Office User or Time Clock User role, when they meet any of these, at any location of their organization:

    * (a) has a time entry on a work order, part sales included, whose start is no more than 90 days (to the second) before the moment the release step runs, or later, including manual entries made by someone else (time on a department does not count);
    * (b) leads, has labor on, or is on a line that is not declined (with labor on it, added with Add Technician or through a schedule shift, or as the line's own technician) of, a service work order that is Approved, In Progress or Ready for Review;
    * (c) has Billable on.
    
* S6-R2: Every other staff member starts with Technician off.
* S6-R3: Nothing else on any staff record changes: Time Clock, Billable, Sales Representative and roles stay as they are. A staff member turned on by the step is marked as updated at that moment, so software connected through the Public API that asks which staff changed picks up the new technician value on its next check (S5-R1). Staff left off are not marked.
* S6-R4: Nobody is logged out by the release step (S1-R8).
* S6-R5: Open work is untouched: every lead and labor line stays as it was, so S3-R7 and S3-R8 cover anyone who is no longer offered.
* S6-N1: A staff member who meets none of S6-R1 (for example a Parts Manager who never works on work orders and is not billable) starts with Technician off and leaves the technician lists. S6-N2: A staff member with no role is never turned on, whatever they meet, matching who the board offers today. In practice this only affects Public API sandbox staff.
* S6-E1: A person who appeared as a technician before release but starts with Technician off keeps every work order and line they hold (S3-E1, S3-R7, S3-R8).
* S6-E2: Estimates, declined work orders, declined lines and part sales do not count toward S6-R1 (b).
* S6-E3: A staff member who is deactivated, or has Time Clock off, at the moment the step runs starts with Technician off. Turning Time Clock on later does not turn Technician on (S1-R5). A seasonal technician who is deactivated on release day and reactivated later is not offered on any technician list until the shop turns Technician on for them.
* S6-E4: The step runs once. A shop that turns Technician off for someone after release keeps it off.
* Error handling: No user-facing failure path.

## Acceptance Criteria

- [ ] Given an active staff member with Time Clock on, not on the built-in Office User or Time Clock User role, with a time entry on a work order whose start is exactly 90 days before the moment the release step runs, when the release step runs, then Technician is turned on for them; given the start is 90 days and 1 second before, then that entry does not count (S6-R1).
- [ ] Given such a staff member with a time entry on a work order whose start is later than the moment the release step runs, when the release step runs, then that entry counts toward S6-R1 (a) and Technician is turned on (S6-R1).
- [ ] Given the qualifying time entry is on a part sale, or is a manual entry made by someone else for that staff member, then it counts toward S6-R1 (a) the same way; given their only time in those 90 days is time on a department, then it does not count (S6-R1).
- [ ] Given such a staff member who, on a service work order that is Approved, In Progress or Ready for Review, leads it, or has labor on a line that is not declined, or was added to a line that is not declined with Add Technician, or is the own technician of a line that is not declined, when the release step runs, then Technician is turned on (S6-R1).
- [ ] Given such a staff member with Billable on, when the release step runs, then Technician is turned on (S6-R1).
- [ ] Given a staff member who meets (a), (b) or (c) but whose user is deactivated, or whose Time Clock is off, or whose role is the built-in Office User or Time Clock User role, when the release step runs, then Technician stays off (S6-R1).
- [ ] Given every other staff member, then they start with Technician off (S6-R2).
- [ ] Given any staff record before the release, then after the release step its Time Clock, Billable, Sales Representative and role are unchanged (S6-R3).
- [ ] Given a staff member turned on by the release step, then their record is marked as updated at that moment, so an integration that reads staff changed since an earlier time picks up their technician value on its next check; given a staff member left off, then their record is not marked (S6-R3).
- [ ] Given users are logged in when the release step runs, then none of them is logged out (S6-R4).
- [ ] Given open work before the release, then after the release step every lead and labor line is exactly as it was (S6-R5).
- [ ] Given a Parts Manager who is not billable and has no work order time in the last 90 days and no open work, when the release step runs, then they start with Technician off and leave the technician lists (S6-N1).
- [ ] Given an active staff member with Time Clock on and no role who meets (a), (b) or (c), when the release step runs, then Technician stays off (S6-N2).
- [ ] Given such a staff member who was added to a line that is not declined, of an Approved, In Progress or Ready for Review service work order, through a schedule shift, when the release step runs, then Technician is turned on (S6-R1).
- [ ] Given a person who appeared as a technician before release and starts with Technician off, then they keep every work order and line they hold, per S3-E1, S3-R7 and S3-R8 (S6-E1).
- [ ] Given a staff member who only leads or is on lines of Estimates, declined work orders or part sales, or is on declined lines of an Approved, In Progress or Ready for Review service work order, then none of that counts toward S6-R1 (b) (S6-E2).
- [ ] Given a staff member who is deactivated, or has Time Clock off, when the release step runs, then they start with Technician off; when their Time Clock is turned on later, then Technician stays off (S6-E3).
- [ ] Given a staff member who was deactivated when the release step ran, when they are reactivated later, then they are not offered on any technician list until Technician is turned on for them (S6-E3).
- [ ] Given a shop turns Technician off for someone after the release, then the release step does not run again and Technician stays off (S6-E4).
- [ ] Given the release step runs, then no message is shown to any user about it; it has no user-facing failure path (Error handling).

## UI/UX

Design: page 1 (Staff list)

[Technician Toggle design canvas](https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R)

## PRD

[Technician Toggle, Story 6](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=977371146)
