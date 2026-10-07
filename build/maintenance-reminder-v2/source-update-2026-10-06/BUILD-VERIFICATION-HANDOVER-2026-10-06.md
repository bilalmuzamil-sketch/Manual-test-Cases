# Maintenance Reminders — cases for the build verification session (6 October 2026)

Hand this list to the build verification session once a Maintenance Reminders QA build is named. This session does not
verify on the build (L7). Every case below is marked `AUTOMATION: HOLD - not yet build-verified on a Maintenance Reminders QA build`.
Where a step says to record the build's wording, the wording is not judged — the PO question sheet decides it.
**Total: 209 cases.**

Facts for the build verification session (QA lead 2026-10-06: that session raises any questions for the PO,
the designer or anyone else). Already-known disagreements between the specification, the design and the tech plans, with
the cases each affects, are in `Maintenance-Reminders_QA-internal-notes-for-the-PO-sheet_2026-10-06.md`; a prepared,
unsent question sheet is `Maintenance-Reminders_Questions-for-Milos-Vasic_2026-10-06.md`. Requirement S10-R1 (entering a
reading on a work order) has no case because the specification contradicts itself.


## Chunk 1 — group 19397 (Chunk 2 subtree excluded)

### Updated (81)

- [C146309](https://shopview.testrail.io/index.php?/cases/view/146309) — Only users with Settings Service see Settings > Maintenance
- [C146310](https://shopview.testrail.io/index.php?/cases/view/146310) — Empty Maintenance settings page offers to create the first schedule
- [C146311](https://shopview.testrail.io/index.php?/cases/view/146311) — New schedule opens a blank "Untitled schedule" that stays open after Save
- [C146312](https://shopview.testrail.io/index.php?/cases/view/146312) — Save stays disabled until the schedule has at least one service
- [C146313](https://shopview.testrail.io/index.php?/cases/view/146313) — A schedule name cannot be left blank or reuse an existing name
- [C146314](https://shopview.testrail.io/index.php?/cases/view/146314) — The schedule's service table shows its columns and lets you reorder services
- [C146315](https://shopview.testrail.io/index.php?/cases/view/146315) — Schedule list has Active and Archived tabs, search and a row menu
- [C146316](https://shopview.testrail.io/index.php?/cases/view/146316) — Add service opens a blank service form with its fields in a fixed order
- [C146317](https://shopview.testrail.io/index.php?/cases/view/146317) — A service needs a time interval, while mileage and hours are optional
- [C146318](https://shopview.testrail.io/index.php?/cases/view/146318) — Interval can be "Every" or "At", and an "At" date uses a day-and-month picker
- [C146319](https://shopview.testrail.io/index.php?/cases/view/146319) — Units are written in full as "mileage" and "hours", never abbreviated
- [C146320](https://shopview.testrail.io/index.php?/cases/view/146320) — Interval boxes accept only whole numbers within the allowed limits
- [C146321](https://shopview.testrail.io/index.php?/cases/view/146321) — A service with several triggers comes due at whichever is reached first
- [C146322](https://shopview.testrail.io/index.php?/cases/view/146322) — Monthly intervals keep the same day, or the month's last day if missing
- [C146323](https://shopview.testrail.io/index.php?/cases/view/146323) — Choosing "Services also covered" pre-fills those services' canned lines
- [C146324](https://shopview.testrail.io/index.php?/cases/view/146324) — The form asks "Is this a compliance inspection?" before the trigger
- [C146325](https://shopview.testrail.io/index.php?/cases/view/146325) — Compliance Type is a required free-text box with example hints
- [C146326](https://shopview.testrail.io/index.php?/cases/view/146326) — Compliance Term and Remind before expiry are entered in months
- [C146327](https://shopview.testrail.io/index.php?/cases/view/146327) — A compliance service form has no certificate date and shows in orange
- [C146328](https://shopview.testrail.io/index.php?/cases/view/146328) — Add canned lines opens a searchable picker that shows each line's hours
- [C146329](https://shopview.testrail.io/index.php?/cases/view/146329) — A service shows no price, and hovering its line count lists the lines
- [C146330](https://shopview.testrail.io/index.php?/cases/view/146330) — Canned lines are optional, and later edits in Settings carry through
- [C146331](https://shopview.testrail.io/index.php?/cases/view/146331) — Reminder rows are in days and must be shorter than the interval
- [C146332](https://shopview.testrail.io/index.php?/cases/view/146332) — Reminder rows only set "due soon", and compliance services have none
- [C146333](https://shopview.testrail.io/index.php?/cases/view/146333) — Editing a schedule does not change assets already enrolled on it
- [C146334](https://shopview.testrail.io/index.php?/cases/view/146334) — Editing or removing a service asks first and leaves enrolled assets alone
- [C146335](https://shopview.testrail.io/index.php?/cases/view/146335) — Duplicating a schedule names it "(Copy)", then "(Copy 2)", with no assets
- [C146336](https://shopview.testrail.io/index.php?/cases/view/146336) — Archiving a schedule takes its assets off, and restoring adds none back
- [C146337](https://shopview.testrail.io/index.php?/cases/view/146337) — Remove from schedule takes one asset off and keeps its history
- [C146338](https://shopview.testrail.io/index.php?/cases/view/146338) — Enrolling an asset again counts from its last completion
- [C146339](https://shopview.testrail.io/index.php?/cases/view/146339) — The Enroll window opens from three places and lists every schedule
- [C146340](https://shopview.testrail.io/index.php?/cases/view/146340) — The Enroll window asks for the schedule, then optional last service dates
- [C146341](https://shopview.testrail.io/index.php?/cases/view/146341) — Enroll window shows certificates, missing readings and passed targets
- [C146342](https://shopview.testrail.io/index.php?/cases/view/146342) — Enroll several assets at once from the customer's Assets tab
- [C146343](https://shopview.testrail.io/index.php?/cases/view/146343) — The customer's Maintenance notifications switch takes effect at once
- [C146344](https://shopview.testrail.io/index.php?/cases/view/146344) — A notifications change made during enrolment stays if you cancel
- [C146345](https://shopview.testrail.io/index.php?/cases/view/146345) — Enrolling sends no email and puts due rows straight on the worklist
- [C146346](https://shopview.testrail.io/index.php?/cases/view/146346) — Compliance records appear in the asset card's Compliance section
- [C146347](https://shopview.testrail.io/index.php?/cases/view/146347) — Compliance record form: its fields, certificate number and attachment
- [C146348](https://shopview.testrail.io/index.php?/cases/view/146348) — Certificate Start date, End date and term fill each other in
- [C146349](https://shopview.testrail.io/index.php?/cases/view/146349) — The newest certificate is current, and a renewal takes effect at once
- [C146350](https://shopview.testrail.io/index.php?/cases/view/146350) — A compliance service with no certificate never comes due
- [C146351](https://shopview.testrail.io/index.php?/cases/view/146351) — Maintenance is the asset's last tab and offers Enroll in Schedule
- [C146352](https://shopview.testrail.io/index.php?/cases/view/146352) — Asset tab shows a recorded reading exactly and marks estimates
- [C146353](https://shopview.testrail.io/index.php?/cases/view/146353) — Asset tab lists services by due date, with the schedule as a column
- [C146354](https://shopview.testrail.io/index.php?/cases/view/146354) — The status badge shows only Due soon, Due today or Overdue
- [C146355](https://shopview.testrail.io/index.php?/cases/view/146355) — The Due cell shows the earliest date, other triggers are in the menu
- [C146356](https://shopview.testrail.io/index.php?/cases/view/146356) — Skip hides a service from the worklist until a new reading or work order
- [C146357](https://shopview.testrail.io/index.php?/cases/view/146357) — Due dates show a month when estimated and the End date for certificates
- [C146358](https://shopview.testrail.io/index.php?/cases/view/146358) — The worklist is the Maintenance reminders tab on the Customers page
- [C146359](https://shopview.testrail.io/index.php?/cases/view/146359) — Worklist tiles filter the list and count assets, not rows
- [C146360](https://shopview.testrail.io/index.php?/cases/view/146360) — Time tiles never overlap and combine with the Needs readings tile
- [C146361](https://shopview.testrail.io/index.php?/cases/view/146361) — Worklist shows 91 days ahead, with sorting, search and empty state
- [C146362](https://shopview.testrail.io/index.php?/cases/view/146362) — Worklist columns never change, and units show number, year, make, model
- [C146363](https://shopview.testrail.io/index.php?/cases/view/146363) — Invoicing or Mark complete clears the row from the worklist
- [C146364](https://shopview.testrail.io/index.php?/cases/view/146364) — Worklist due date shows confidence, Certificate or Calendar, not a figure
- [C146365](https://shopview.testrail.io/index.php?/cases/view/146365) — Create work order makes one estimate at the header location
- [C146366](https://shopview.testrail.io/index.php?/cases/view/146366) — Worklist row buttons are Contact and Create work order, the rest in a menu
- [C146367](https://shopview.testrail.io/index.php?/cases/view/146367) — Units on two schedules show a schedule chip on each row
- [C146368](https://shopview.testrail.io/index.php?/cases/view/146368) — Location column and location filter for shops with several locations
- [C146369](https://shopview.testrail.io/index.php?/cases/view/146369) — Compliance inspection chip filters rows, uncertified services sort last
- [C146370](https://shopview.testrail.io/index.php?/cases/view/146370) — Worklist keeps filters, shows cards on a phone and drops deleted assets
- [C146371](https://shopview.testrail.io/index.php?/cases/view/146371) — Contact card shows labelled phone numbers you can copy or tap
- [C146372](https://shopview.testrail.io/index.php?/cases/view/146372) — Send reminder emails about one asset and updates Last sent
- [C146373](https://shopview.testrail.io/index.php?/cases/view/146373) — Contact card reads correctly when phone, email or contact is missing
- [C146374](https://shopview.testrail.io/index.php?/cases/view/146374) — Send reminder is disabled when the customer's notifications are off
- [C146375](https://shopview.testrail.io/index.php?/cases/view/146375) — A "Last sent" date appears on the contact card after a reminder is sent
- [C146376](https://shopview.testrail.io/index.php?/cases/view/146376) — Maintenance changes are saved to the history (no screen shows it yet)
- [C146377](https://shopview.testrail.io/index.php?/cases/view/146377) — Adding a service to a work order adds a work order note
- [C146378](https://shopview.testrail.io/index.php?/cases/view/146378) — Correcting a reading keeps both values in the history
- [C146379](https://shopview.testrail.io/index.php?/cases/view/146379) — Sent reminders are logged with message, recipient and time
- [C146380](https://shopview.testrail.io/index.php?/cases/view/146380) — History is kept after removal, archiving and asset deletion
- [C146381](https://shopview.testrail.io/index.php?/cases/view/146381) — Changing the notifications setting is saved to the history
- [C146382](https://shopview.testrail.io/index.php?/cases/view/146382) — Monthly due dates keep the day, or move to the month's last day
- [C146383](https://shopview.testrail.io/index.php?/cases/view/146383) — Certificate End date is the Start date plus the term, same day of month
- [C146384](https://shopview.testrail.io/index.php?/cases/view/146384) — Remind before expiry defaults by the term and cannot exceed it
- [C146385](https://shopview.testrail.io/index.php?/cases/view/146385) — Confidence grade follows the reading's age and the number of visits
- [C146386](https://shopview.testrail.io/index.php?/cases/view/146386) — Confidence examples for mileage and hours, including No data
- [C146387](https://shopview.testrail.io/index.php?/cases/view/146387) — Worklist tiles: which days fall into each tile at the edges
- [C146388](https://shopview.testrail.io/index.php?/cases/view/146388) — Worklist tiles count each asset once per tile and follow the filters
- [C146389](https://shopview.testrail.io/index.php?/cases/view/146389) — Interval boxes accept whole numbers only, up to the exact limits

### New (25) — folder 39947

- [C310721](https://shopview.testrail.io/index.php?/cases/view/310721) — Each schedule shows its home location, e.g. "Lines from Calgary South"
- [C310722](https://shopview.testrail.io/index.php?/cases/view/310722) — Maintenance settings need only Settings Service, not Digital Inspections
- [C310723](https://shopview.testrail.io/index.php?/cases/view/310723) — The canned line picker lists the home location's lines
- [C310724](https://shopview.testrail.io/index.php?/cases/view/310724) — Users without access to the home location can't edit canned lines
- [C310725](https://shopview.testrail.io/index.php?/cases/view/310725) — Intervals of 14 days or less get no default "14 days before" row
- [C310726](https://shopview.testrail.io/index.php?/cases/view/310726) — A duplicated schedule keeps the original's home location and lines
- [C310727](https://shopview.testrail.io/index.php?/cases/view/310727) — The confidence hover ends with the estimate disclaimer
- [C310728](https://shopview.testrail.io/index.php?/cases/view/310728) — Mark complete in the row menu opens "Mark PM-A complete"
- [C310729](https://shopview.testrail.io/index.php?/cases/view/310729) — "Where was it done?" lists work orders from every location
- [C310730](https://shopview.testrail.io/index.php?/cases/view/310730) — Reset date defaults to today or the day the lines closed
- [C310731](https://shopview.testrail.io/index.php?/cases/view/310731) — Completed elsewhere needs a Reset date, shop and reading are optional
- [C310732](https://shopview.testrail.io/index.php?/cases/view/310732) — Mark complete on a compliance service records the certificate
- [C310733](https://shopview.testrail.io/index.php?/cases/view/310733) — Mark complete resets at once, but added lines wait for the invoice
- [C310734](https://shopview.testrail.io/index.php?/cases/view/310734) — After Mark complete: Undo toast, Completed row and Undo complete
- [C310735](https://shopview.testrail.io/index.php?/cases/view/310735) — Undo complete works only on the latest Mark complete
- [C310736](https://shopview.testrail.io/index.php?/cases/view/310736) — Mark complete on a work order saves its mileage as a reading
- [C310737](https://shopview.testrail.io/index.php?/cases/view/310737) — A completed row leaves the worklist until due soon (not Needs readings)
- [C310738](https://shopview.testrail.io/index.php?/cases/view/310738) — Create work order at another location adds the same work at local rates
- [C310739](https://shopview.testrail.io/index.php?/cases/view/310739) — Opening a work order from another location offers to switch location
- [C310740](https://shopview.testrail.io/index.php?/cases/view/310740) — New maintenance screens show loading, and an error with Retry
- [C310741](https://shopview.testrail.io/index.php?/cases/view/310741) — Hover cards open by keyboard or tap and close with Esc
- [C310742](https://shopview.testrail.io/index.php?/cases/view/310742) — Settings, the asset tab and enrolment work on a phone
- [C310743](https://shopview.testrail.io/index.php?/cases/view/310743) — View-only customer users can read the tabs but not change anything
- [C310744](https://shopview.testrail.io/index.php?/cases/view/310744) — Work order actions follow work order and invoicing permissions
- [C310745](https://shopview.testrail.io/index.php?/cases/view/310745) — Send reminder is offered when any of the customer's contacts has an email

## Chunk 2 — group 26635

### Updated (86)

- [C204102](https://shopview.testrail.io/index.php?/cases/view/204102) — Enter mileage window shows the current and new reading for each meter
- [C204105](https://shopview.testrail.io/index.php?/cases/view/204105) — A reading typed on a work order shows "In the shop" until invoiced
- [C204106](https://shopview.testrail.io/index.php?/cases/view/204106) — Fix a wrong reading by entering the right one
- [C204108](https://shopview.testrail.io/index.php?/cases/view/204108) — An unusual reading asks for confirmation but is never refused
- [C204136](https://shopview.testrail.io/index.php?/cases/view/204136) — Work order Maintenance card starts collapsed with only a count badge
- [C204137](https://shopview.testrail.io/index.php?/cases/view/204137) — Covered services are folded under the service that covers them
- [C204140](https://shopview.testrail.io/index.php?/cases/view/204140) — Every row has an Add Service button that opens the Add Service window
- [C204141](https://shopview.testrail.io/index.php?/cases/view/204141) — Add a certificate or enroll the unit from the work order card
- [C204142](https://shopview.testrail.io/index.php?/cases/view/204142) — Typing Mileage on the work order updates the card at once
- [C204147](https://shopview.testrail.io/index.php?/cases/view/204147) — Add Service at another location charges this location's rates
- [C204149](https://shopview.testrail.io/index.php?/cases/view/204149) — Add Service shows Undo, and Remove works until the work order is invoiced
- [C204151](https://shopview.testrail.io/index.php?/cases/view/204151) — Splitting a work order or merging assets keeps services and history
- [C204152](https://shopview.testrail.io/index.php?/cases/view/204152) — Only the work order card offers "This work order" or "A new work order"
- [C204154](https://shopview.testrail.io/index.php?/cases/view/204154) — Adding a service writes one internal note naming service and schedule
- [C204168](https://shopview.testrail.io/index.php?/cases/view/204168) — After Mark complete: Undo toast, Completed row, off the worklist
- [C204170](https://shopview.testrail.io/index.php?/cases/view/204170) — Completing early needs no confirmation, and invoicing later changes nothing
- [C204172](https://shopview.testrail.io/index.php?/cases/view/204172) — Send reminder opens the send email window listing every contact
- [C204174](https://shopview.testrail.io/index.php?/cases/view/204174) — The reminder email lists every service the worklist shows for the unit
- [C204175](https://shopview.testrail.io/index.php?/cases/view/204175) — The reminder email shows the due month, or "Soon" for Low confidence
- [C204177](https://shopview.testrail.io/index.php?/cases/view/204177) — Reminder email greets one or two people by name, otherwise "Hello"
- [C204179](https://shopview.testrail.io/index.php?/cases/view/204179) — Notifications off blocks sending, and each send updates Last sent
- [C204119](https://shopview.testrail.io/index.php?/cases/view/204119) — Work orders from Maintenance show the schedule in the Work Orders list
- [C204122](https://shopview.testrail.io/index.php?/cases/view/204122) — "From maintenance" filter shows the count and total of work orders
- [C204180](https://shopview.testrail.io/index.php?/cases/view/204180) — Rate example: three intervals give 97.5 a day and the due month
- [C204125](https://shopview.testrail.io/index.php?/cases/view/204125) — The rate uses the last three reading intervals, or all if fewer
- [C204124](https://shopview.testrail.io/index.php?/cases/view/204124) — Estimated reading is the last reading plus the unit's daily rate
- [C204126](https://shopview.testrail.io/index.php?/cases/view/204126) — The rate ignores readings that are too close, lower, too high or too old
- [C204127](https://shopview.testrail.io/index.php?/cases/view/204127) — Correcting a reading updates the rate at once
- [C204181](https://shopview.testrail.io/index.php?/cases/view/204181) — Confidence grade for every reading age and number of visits
- [C204182](https://shopview.testrail.io/index.php?/cases/view/204182) — Confidence examples: visits and reading age together set the grade
- [C204183](https://shopview.testrail.io/index.php?/cases/view/204183) — An ignored reading lowers the confidence grade
- [C204184](https://shopview.testrail.io/index.php?/cases/view/204184) — Estimates round to the nearest 100 mileage or 10 engine hours
- [C204185](https://shopview.testrail.io/index.php?/cases/view/204185) — Readings older than two years are not used (No data)
- [C204186](https://shopview.testrail.io/index.php?/cases/view/204186) — Due date is the earliest trigger, and certificates are due on End date
- [C204187](https://shopview.testrail.io/index.php?/cases/view/204187) — Next due counts from the "Work done" date, not the invoice date
- [C204128](https://shopview.testrail.io/index.php?/cases/view/204128) — Confidence shows Low, Medium or High, or No data
- [C204131](https://shopview.testrail.io/index.php?/cases/view/204131) — Mileage and engine hours each have their own confidence
- [C204139](https://shopview.testrail.io/index.php?/cases/view/204139) — Hovering a service shows its lines, parts and form, never prices
- [C204150](https://shopview.testrail.io/index.php?/cases/view/204150) — Work order card: line search, completing, invoiced and no-schedule cases
- [C204121](https://shopview.testrail.io/index.php?/cases/view/204121) — Adding a service keeps an existing Maintenance schedule origin
- [C204164](https://shopview.testrail.io/index.php?/cases/view/204164) — Invoicing shows "When was the maintenance done?" for added services
- [C204165](https://shopview.testrail.io/index.php?/cases/view/204165) — A closed line shows the date it closed, not the invoice date
- [C204167](https://shopview.testrail.io/index.php?/cases/view/204167) — "When was the maintenance done?" has a Compliance certificates section
- [C204173](https://shopview.testrail.io/index.php?/cases/view/204173) — The reminder email has fixed wording you can edit for this send
- [C204178](https://shopview.testrail.io/index.php?/cases/view/204178) — Reminder email footer says why it was sent, with no unsubscribe link
- [C204103](https://shopview.testrail.io/index.php?/cases/view/204103) — Saving a reading updates due dates at once and offers Undo
- [C204104](https://shopview.testrail.io/index.php?/cases/view/204104) — Every reading is kept with its date and source, and the newest is current
- [C204107](https://shopview.testrail.io/index.php?/cases/view/204107) — The field reads "Mileage" and the unit is never shown as mi or km
- [C204109](https://shopview.testrail.io/index.php?/cases/view/204109) — Readings come only from manual entry or work orders, not telematics
- [C204110](https://shopview.testrail.io/index.php?/cases/view/204110) — Unusual readings: gauge vs ECU, engine swap and same-day readings
- [C204129](https://shopview.testrail.io/index.php?/cases/view/204129) — Estimated due dates show a month and confidence, not an exact day
- [C204130](https://shopview.testrail.io/index.php?/cases/view/204130) — How due dates read for mileage, certificate and calendar services
- [C204132](https://shopview.testrail.io/index.php?/cases/view/204132) — Estimates round to 100 mileage or 10 hours, and the rate reads per week
- [C204133](https://shopview.testrail.io/index.php?/cases/view/204133) — Confidence hover explains the estimate and links to View work orders
- [C204134](https://shopview.testrail.io/index.php?/cases/view/204134) — Estimated dates never look certain, and Low reads "Soon" in the email
- [C204135](https://shopview.testrail.io/index.php?/cases/view/204135) — With no readings the calendar date is used and nothing looks broken
- [C204111](https://shopview.testrail.io/index.php?/cases/view/204111) — The due date is the earliest of a service's triggers
- [C204112](https://shopview.testrail.io/index.php?/cases/view/204112) — A meter with No data gives no due date, so the calendar decides
- [C204113](https://shopview.testrail.io/index.php?/cases/view/204113) — "At" a reading or a yearly date: when it comes due and stays overdue
- [C204114](https://shopview.testrail.io/index.php?/cases/view/204114) — A compliance service is due on its certificate's End date
- [C204115](https://shopview.testrail.io/index.php?/cases/view/204115) — Confidence changes how the due date reads, not which date is chosen
- [C204116](https://shopview.testrail.io/index.php?/cases/view/204116) — A service resets others only if the shop named them as covered
- [C204117](https://shopview.testrail.io/index.php?/cases/view/204117) — Each service keeps its own row, and shared canned lines are added once
- [C204118](https://shopview.testrail.io/index.php?/cases/view/204118) — "Today" follows the location's time zone, and readings recalculate dues
- [C204138](https://shopview.testrail.io/index.php?/cases/view/204138) — Work order card rows show when each is due, compliance rows in orange
- [C204143](https://shopview.testrail.io/index.php?/cases/view/204143) — Two ways to clear a row: Add Service (on invoice) or Mark complete (now)
- [C204144](https://shopview.testrail.io/index.php?/cases/view/204144) — The work order card shows line count and hours, never money
- [C204145](https://shopview.testrail.io/index.php?/cases/view/204145) — After Add Service the row reads "Added · N lines" with Mark complete
- [C204146](https://shopview.testrail.io/index.php?/cases/view/204146) — Added canned lines appear as normal lines at the end of the work order
- [C204148](https://shopview.testrail.io/index.php?/cases/view/204148) — Copied lines carry an internal note listing the home location's parts
- [C204153](https://shopview.testrail.io/index.php?/cases/view/204153) — Create work order from the worklist shows the new number on the row
- [C204155](https://shopview.testrail.io/index.php?/cases/view/204155) — A canned line shared by two services is added only once
- [C204156](https://shopview.testrail.io/index.php?/cases/view/204156) — Add Service needs permission and offers "A new work order"
- [C204157](https://shopview.testrail.io/index.php?/cases/view/204157) — Only completed work resets a service, never a declined estimate
- [C204158](https://shopview.testrail.io/index.php?/cases/view/204158) — Mark complete is in every row menu and resets from a chosen date
- [C204159](https://shopview.testrail.io/index.php?/cases/view/204159) — Mark complete asks where: On a work order or Completed elsewhere
- [C204160](https://shopview.testrail.io/index.php?/cases/view/204160) — Reset date cannot be in the future and Completed elsewhere needs it
- [C204161](https://shopview.testrail.io/index.php?/cases/view/204161) — Mark complete on a compliance service also records the certificate
- [C204162](https://shopview.testrail.io/index.php?/cases/view/204162) — Mark complete resets at once, but added lines reset only on invoice
- [C204163](https://shopview.testrail.io/index.php?/cases/view/204163) — Covered services reset together with the service that covers them
- [C204166](https://shopview.testrail.io/index.php?/cases/view/204166) — Work done at one location updates the service at every location
- [C204169](https://shopview.testrail.io/index.php?/cases/view/204169) — Mark complete works without canned lines and shows no warning
- [C204171](https://shopview.testrail.io/index.php?/cases/view/204171) — The reminder email is sent only by hand with Send reminder
- [C204176](https://shopview.testrail.io/index.php?/cases/view/204176) — Reminder email sender, Reply-To and BCC copy
- [C204120](https://shopview.testrail.io/index.php?/cases/view/204120) — A hand-made work order has an empty Maintenance schedule column
- [C204123](https://shopview.testrail.io/index.php?/cases/view/204123) — Email open rates and bounces are not tracked

### New (17) — folder 39946

- [C310704](https://shopview.testrail.io/index.php?/cases/view/310704) — Mark complete on a work order saves its mileage and hours as readings
- [C310705](https://shopview.testrail.io/index.php?/cases/view/310705) — "When was the maintenance done?" appears before the payment window
- [C310706](https://shopview.testrail.io/index.php?/cases/view/310706) — Closing "When was the maintenance done?" after an edit asks to discard
- [C310707](https://shopview.testrail.io/index.php?/cases/view/310707) — Anyone who can invoice sees "When was the maintenance done?"
- [C310708](https://shopview.testrail.io/index.php?/cases/view/310708) — "When was the maintenance done?" cannot be reopened later
- [C310709](https://shopview.testrail.io/index.php?/cases/view/310709) — Past work order mileage counts as readings from release day
- [C310710](https://shopview.testrail.io/index.php?/cases/view/310710) — Mileage copied onto a new work order is not counted as a reading
- [C310711](https://shopview.testrail.io/index.php?/cases/view/310711) — Unit with nothing scheduled: email says "Nothing is scheduled yet"
- [C310712](https://shopview.testrail.io/index.php?/cases/view/310712) — Nothing due in 91 days: the email lists the next two as "Coming up"
- [C310713](https://shopview.testrail.io/index.php?/cases/view/310713) — Mark complete creates no work order and no Maintenance schedule origin
- [C310714](https://shopview.testrail.io/index.php?/cases/view/310714) — Users who can't open the schedule see its name as plain text
- [C310715](https://shopview.testrail.io/index.php?/cases/view/310715) — After a reset Remove is gone, and re-adding reuses lines still there
- [C310716](https://shopview.testrail.io/index.php?/cases/view/310716) — Reversing an invoice undoes its resets and asks again next invoice
- [C310717](https://shopview.testrail.io/index.php?/cases/view/310717) — Adding a line to a pending invoice asks again at the next invoice
- [C310718](https://shopview.testrail.io/index.php?/cases/view/310718) — Part sales and imported work orders show no Maintenance card
- [C310719](https://shopview.testrail.io/index.php?/cases/view/310719) — Every way of invoicing shows "When was the maintenance done?" once
- [C310720](https://shopview.testrail.io/index.php?/cases/view/310720) — Confidence changes exactly at 30, 90, 180 and 365 days

