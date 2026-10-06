# Maintenance Reminders — cases for the build verification session (6 October 2026)

Hand this list to the build verification session once a Maintenance Reminders QA build is named. This session does not
verify on the build (L7). Every case below is marked `AUTOMATION: HOLD - not yet build-verified on a Maintenance Reminders QA build`.
Where a step says to record the build's wording, the wording is not judged — the PO question sheet decides it.
**Total: 209 cases.**


## Chunk 1 — group 19397 (Chunk 2 subtree excluded)

### Updated (81)

- [C146309](https://shopview.testrail.io/index.php?/cases/view/146309) — Maintenance settings sit under Settings and need Settings Service
- [C146310](https://shopview.testrail.io/index.php?/cases/view/146310) — The empty Maintenance screen prompts the first schedule
- [C146311](https://shopview.testrail.io/index.php?/cases/view/146311) — New schedule opens an empty Untitled schedule editor; first Save keeps it open
- [C146312](https://shopview.testrail.io/index.php?/cases/view/146312) — Save is disabled until the schedule has one service
- [C146313](https://shopview.testrail.io/index.php?/cases/view/146313) — A schedule name cannot be blank or already in use
- [C146314](https://shopview.testrail.io/index.php?/cases/view/146314) — The service table shows Service, Interval, Canned Lines and reorders
- [C146315](https://shopview.testrail.io/index.php?/cases/view/146315) — The schedule list: Active/Archived tabs, search, row menu
- [C146316](https://shopview.testrail.io/index.php?/cases/view/146316) — Add service opens a blank form in a fixed order
- [C146317](https://shopview.testrail.io/index.php?/cases/view/146317) — Calendar interval is required; distance and hours are optional
- [C146318](https://shopview.testrail.io/index.php?/cases/view/146318) — Interval operator Every vs At; calendar At is a day-and-month picker
- [C146319](https://shopview.testrail.io/index.php?/cases/view/146319) — The distance unit is 'mileage' and the meter unit is 'hours', in full
- [C146320](https://shopview.testrail.io/index.php?/cases/view/146320) — Interval fields take whole numbers within caps only
- [C146321](https://shopview.testrail.io/index.php?/cases/view/146321) — The service comes due at whichever trigger arrives first
- [C146322](https://shopview.testrail.io/index.php?/cases/view/146322) — Months land on the same day; a missing day falls on month-end
- [C146323](https://shopview.testrail.io/index.php?/cases/view/146323) — Services also covered pre-fills the covered services' lines
- [C146324](https://shopview.testrail.io/index.php?/cases/view/146324) — Is this a compliance inspection? is asked before the trigger
- [C146325](https://shopview.testrail.io/index.php?/cases/view/146325) — Compliance Type is required free text with examples in an (i)
- [C146326](https://shopview.testrail.io/index.php?/cases/view/146326) — Compliance Term and Remind before expiry are in months
- [C146327](https://shopview.testrail.io/index.php?/cases/view/146327) — No certificate date on the form; a compliance service is orange
- [C146328](https://shopview.testrail.io/index.php?/cases/view/146328) — Add canned lines opens a searchable picker showing hours
- [C146329](https://shopview.testrail.io/index.php?/cases/view/146329) — A service shows no value; the line count opens a hover card
- [C146330](https://shopview.testrail.io/index.php?/cases/view/146330) — Canned lines are optional; Settings edits flow through
- [C146331](https://shopview.testrail.io/index.php?/cases/view/146331) — Reminder rows are in days; a before row must be shorter than the interval
- [C146332](https://shopview.testrail.io/index.php?/cases/view/146332) — Reminder rows drive due soon only; compliance has none
- [C146333](https://shopview.testrail.io/index.php?/cases/view/146333) — Editing a schedule is silent and never touches enrolled assets
- [C146334](https://shopview.testrail.io/index.php?/cases/view/146334) — Editing or removing a service asks first and spares enrolled assets
- [C146335](https://shopview.testrail.io/index.php?/cases/view/146335) — Duplicate names the copy "(Copy)", then "(Copy 2)"; no assets
- [C146336](https://shopview.testrail.io/index.php?/cases/view/146336) — Archiving deactivates and unenrolls; restoring enrolls nobody
- [C146337](https://shopview.testrail.io/index.php?/cases/view/146337) — Remove from schedule takes one asset off; history stays
- [C146338](https://shopview.testrail.io/index.php?/cases/view/146338) — History survives removal; enrolling again anchors from last completion
- [C146339](https://shopview.testrail.io/index.php?/cases/view/146339) — Enrolment opens the same modal from three places, offering every schedule
- [C146340](https://shopview.testrail.io/index.php?/cases/view/146340) — The modal collects the schedule, then optional last-service dates
- [C146341](https://shopview.testrail.io/index.php?/cases/view/146341) — Compliance rows show the record; meterless services flag a reading
- [C146342](https://shopview.testrail.io/index.php?/cases/view/146342) — Bulk enrolment from the customer's Assets tab
- [C146343](https://shopview.testrail.io/index.php?/cases/view/146343) — The Maintenance notifications setting is a live customer toggle
- [C146344](https://shopview.testrail.io/index.php?/cases/view/146344) — No bulk consent; the setting stands if enrolment is cancelled
- [C146345](https://shopview.testrail.io/index.php?/cases/view/146345) — Enrolment sends nothing; its rows go straight to the worklist
- [C146346](https://shopview.testrail.io/index.php?/cases/view/146346) — Compliance records sit in the asset card's Compliance section
- [C146347](https://shopview.testrail.io/index.php?/cases/view/146347) — A compliance record's fields, Certificate number and attachment
- [C146348](https://shopview.testrail.io/index.php?/cases/view/146348) — Start date, End date and term derive; valid through the End date
- [C146349](https://shopview.testrail.io/index.php?/cases/view/146349) — Latest record is current; a renewal drives at once and keeps history
- [C146350](https://shopview.testrail.io/index.php?/cases/view/146350) — A recordless compliance service can't come due; closing two asks per record
- [C146351](https://shopview.testrail.io/index.php?/cases/view/146351) — The Maintenance tab is last; an unenrolled unit offers Enroll in Schedule
- [C146352](https://shopview.testrail.io/index.php?/cases/view/146352) — Two reading cards: recorded is exact, an estimate has a badge
- [C146353](https://shopview.testrail.io/index.php?/cases/view/146353) — Services list flat by date with the schedule as a column
- [C146354](https://shopview.testrail.io/index.php?/cases/view/146354) — The status badge carries exactly three values
- [C146355](https://shopview.testrail.io/index.php?/cases/view/146355) — The Due cell shows the earliest candidate; Other triggers lists the rest
- [C146356](https://shopview.testrail.io/index.php?/cases/view/146356) — The row menu and Skip; a skipped row returns on its own
- [C146357](https://shopview.testrail.io/index.php?/cases/view/146357) — Due dates: a month for estimates, End date for certificates
- [C146358](https://shopview.testrail.io/index.php?/cases/view/146358) — The worklist is a Maintenance reminders tab under Customers
- [C146359](https://shopview.testrail.io/index.php?/cases/view/146359) — Four header tiles filter, count assets, and don't add up
- [C146360](https://shopview.testrail.io/index.php?/cases/view/146360) — Time tiles don't overlap; Needs readings crosses them
- [C146361](https://shopview.testrail.io/index.php?/cases/view/146361) — No-tile window is 91 days; sort, search and empty states
- [C146362](https://shopview.testrail.io/index.php?/cases/view/146362) — One column set; unit shows number + year/make/model
- [C146363](https://shopview.testrail.io/index.php?/cases/view/146363) — Due status vs work order status; Invoice or Mark complete clears a row
- [C146364](https://shopview.testrail.io/index.php?/cases/view/146364) — A due date shows confidence, Certificate or Calendar, never a figure
- [C146365](https://shopview.testrail.io/index.php?/cases/view/146365) — Create work order raises one estimate per row at the header location
- [C146366](https://shopview.testrail.io/index.php?/cases/view/146366) — Row actions are Contact and Create work order; menu holds the rest
- [C146367](https://shopview.testrail.io/index.php?/cases/view/146367) — Multi-schedule units show a schedule chip; sort by header only
- [C146368](https://shopview.testrail.io/index.php?/cases/view/146368) — Row location and the multi-workplace location filter
- [C146369](https://shopview.testrail.io/index.php?/cases/view/146369) — The Compliance inspection chip; no-record services sort last
- [C146370](https://shopview.testrail.io/index.php?/cases/view/146370) — Worklist keeps filters, shows cards on a phone, drops deleted assets
- [C146371](https://shopview.testrail.io/index.php?/cases/view/146371) — The Contact card shows labelled phones, copy and tap
- [C146372](https://shopview.testrail.io/index.php?/cases/view/146372) — Send reminder covers one asset, updates last sent, no Resend
- [C146373](https://shopview.testrail.io/index.php?/cases/view/146373) — The contact card reads complete in every empty state
- [C146374](https://shopview.testrail.io/index.php?/cases/view/146374) — Notifications off disables Send; no permission hides it
- [C146375](https://shopview.testrail.io/index.php?/cases/view/146375) — A "last sent" line appears after a send by hand
- [C146376](https://shopview.testrail.io/index.php?/cases/view/146376) — Every maintenance state change is recorded (no audit screen in v1)
- [C146377](https://shopview.testrail.io/index.php?/cases/view/146377) — Adding a service to a work order writes a work order note
- [C146378](https://shopview.testrail.io/index.php?/cases/view/146378) — A reading correction keeps both values (no audit screen in v1)
- [C146379](https://shopview.testrail.io/index.php?/cases/view/146379) — Sends are logged with message, recipient and time (no audit screen)
- [C146380](https://shopview.testrail.io/index.php?/cases/view/146380) — History outlives removal, archive and asset deletion (no audit screen)
- [C146381](https://shopview.testrail.io/index.php?/cases/view/146381) — A notification-setting change is recorded (no audit screen in v1)
- [C146382](https://shopview.testrail.io/index.php?/cases/view/146382) — Month intervals land on the same day; a missing day rolls back
- [C146383](https://shopview.testrail.io/index.php?/cases/view/146383) — Certificate Start date + term = End date, same day, clamped
- [C146384](https://shopview.testrail.io/index.php?/cases/view/146384) — Remind before expiry: default by term band and the term cap
- [C146385](https://shopview.testrail.io/index.php?/cases/view/146385) — Confidence follows the locked table: age of last reading by pairs
- [C146386](https://shopview.testrail.io/index.php?/cases/view/146386) — Confidence worked examples, per meter, N visits and No data
- [C146387](https://shopview.testrail.io/index.php?/cases/view/146387) — Worklist tile day-window boundaries
- [C146388](https://shopview.testrail.io/index.php?/cases/view/146388) — Worklist tile counts: once per tile, no total, filtered
- [C146389](https://shopview.testrail.io/index.php?/cases/view/146389) — Interval fields: whole numbers within exact caps

### New (25) — folder 39947

- [C310721](https://shopview.testrail.io/index.php?/cases/view/310721) — Each schedule shows its home location: "Lines from Calgary South"
- [C310722](https://shopview.testrail.io/index.php?/cases/view/310722) — The Maintenance entry needs only Settings Service, not Digital Inspections
- [C310723](https://shopview.testrail.io/index.php?/cases/view/310723) — The picker lists the home location's canned lines, with a helper
- [C310724](https://shopview.testrail.io/index.php?/cases/view/310724) — Canned lines are read only for a user without access to the home location
- [C310725](https://shopview.testrail.io/index.php?/cases/view/310725) — A 14-day or shorter interval drops the default before row
- [C310726](https://shopview.testrail.io/index.php?/cases/view/310726) — A duplicate keeps the original's home location and canned lines
- [C310727](https://shopview.testrail.io/index.php?/cases/view/310727) — The confidence meter's hover ends with the estimate disclaimer
- [C310728](https://shopview.testrail.io/index.php?/cases/view/310728) — Mark complete sits in the row menu and opens "Mark PM-A complete"
- [C310729](https://shopview.testrail.io/index.php?/cases/view/310729) — "Where was it done?" lists work orders from every location
- [C310730](https://shopview.testrail.io/index.php?/cases/view/310730) — Reset date defaults: today, or the day the lines closed
- [C310731](https://shopview.testrail.io/index.php?/cases/view/310731) — Completed elsewhere asks for a Reset date and optional shop and reading
- [C310732](https://shopview.testrail.io/index.php?/cases/view/310732) — Mark complete on a compliance service takes the certificate
- [C310733](https://shopview.testrail.io/index.php?/cases/view/310733) — Mark complete resets at once; added lines wait for the invoice
- [C310734](https://shopview.testrail.io/index.php?/cases/view/310734) — After Mark complete: toast with Undo, Completed row, Undo complete
- [C310735](https://shopview.testrail.io/index.php?/cases/view/310735) — Undo complete only for the latest Mark complete
- [C310736](https://shopview.testrail.io/index.php?/cases/view/310736) — Mark complete on a work order records its mileage as a reading
- [C310737](https://shopview.testrail.io/index.php?/cases/view/310737) — A completed row rests until its first reminder; Needs readings stays
- [C310738](https://shopview.testrail.io/index.php?/cases/view/310738) — Create work order at another location adds the same work, not the lines
- [C310739](https://shopview.testrail.io/index.php?/cases/view/310739) — Opening a work order from another location offers to switch location
- [C310740](https://shopview.testrail.io/index.php?/cases/view/310740) — New lists show a loading state and an error with Retry
- [C310741](https://shopview.testrail.io/index.php?/cases/view/310741) — Hover cards open by keyboard and by tap, and Esc closes them
- [C310742](https://shopview.testrail.io/index.php?/cases/view/310742) — Settings, the asset tab and enrolment work on a phone
- [C310743](https://shopview.testrail.io/index.php?/cases/view/310743) — View-only customers user: tabs readable, every change hidden
- [C310744](https://shopview.testrail.io/index.php?/cases/view/310744) — Work-order actions follow work-order and invoicing permissions
- [C310745](https://shopview.testrail.io/index.php?/cases/view/310745) — Send reminder is offered when any contact has an email

## Chunk 2 — group 26635

### Updated (86)

- [C204102](https://shopview.testrail.io/index.php?/cases/view/204102) — Reading dialog on the asset: current vs new, one row per meter
- [C204105](https://shopview.testrail.io/index.php?/cases/view/204105) — A work order reading shows In the shop until invoiced or Mark complete
- [C204106](https://shopview.testrail.io/index.php?/cases/view/204106) — Correct a wrong reading by entering the right one; the last one counts
- [C204108](https://shopview.testrail.io/index.php?/cases/view/204108) — No reading is rejected; an implausible value asks to confirm, then saves
- [C204136](https://shopview.testrail.io/index.php?/cases/view/204136) — Card sits in the asset card, collapsed, with a count badge and nothing else
- [C204137](https://shopview.testrail.io/index.php?/cases/view/204137) — Expanded card: covered services fold in only under a listed coverer
- [C204140](https://shopview.testrail.io/index.php?/cases/view/204140) — Add Service is a button on every row and opens the Add Service window
- [C204141](https://shopview.testrail.io/index.php?/cases/view/204141) — Add a compliance certificate, or enroll the unit, from the work order card
- [C204142](https://shopview.testrail.io/index.php?/cases/view/204142) — Readings go in the work order's Mileage field; the card updates at once
- [C204147](https://shopview.testrail.io/index.php?/cases/view/204147) — Add Service at another location copies the work at this location's rates
- [C204149](https://shopview.testrail.io/index.php?/cases/view/204149) — Add Service toast with Undo; Remove until invoiced; no line is deleted
- [C204151](https://shopview.testrail.io/index.php?/cases/view/204151) — Splitting a work order and merging assets keep services and history
- [C204152](https://shopview.testrail.io/index.php?/cases/view/204152) — The card offers this or a new work order; elsewhere only Create work order
- [C204154](https://shopview.testrail.io/index.php?/cases/view/204154) — Adding a service writes one internal note naming the service and schedule
- [C204168](https://shopview.testrail.io/index.php?/cases/view/204168) — Mark complete: toast with Undo, Completed row, worklist rest until due soon
- [C204170](https://shopview.testrail.io/index.php?/cases/view/204170) — Early completion needs no confirmation; serviced Monday, invoiced later
- [C204172](https://shopview.testrail.io/index.php?/cases/view/204172) — Send reminder opens the send email window with every contact listed
- [C204174](https://shopview.testrail.io/index.php?/cases/view/204174) — The email lists every service the worklist shows for the unit, with its state
- [C204175](https://shopview.testrail.io/index.php?/cases/view/204175) — Due month where the date is sound; Soon for a Low date; no confidence words
- [C204177](https://shopview.testrail.io/index.php?/cases/view/204177) — Greeting names one or two people, else Hello; invoice-style signature
- [C204179](https://shopview.testrail.io/index.php?/cases/view/204179) — Setting off blocks every send; a send updates Last sent; no bounces
- [C204119](https://shopview.testrail.io/index.php?/cases/view/204119) — Work orders from a due service or Add Service show the Maintenance schedule
- [C204122](https://shopview.testrail.io/index.php?/cases/view/204122) — From maintenance filter: count and total of every matching work order
- [C204180](https://shopview.testrail.io/index.php?/cases/view/204180) — Rate maths: last three usable pairs over the days they span (worked example)
- [C204125](https://shopview.testrail.io/index.php?/cases/view/204125) — The rate uses the last three usable pairs; with one or two, all of them
- [C204124](https://shopview.testrail.io/index.php?/cases/view/204124) — An estimate carries the last reading forward at the unit's own rate
- [C204126](https://shopview.testrail.io/index.php?/cases/view/204126) — A usable pair, and the guards that drop pairs from the rate
- [C204127](https://shopview.testrail.io/index.php?/cases/view/204127) — Correcting a reading recomputes the rate at once
- [C204181](https://shopview.testrail.io/index.php?/cases/view/204181) — Confidence table: age of last reading × usable pairs, every cell
- [C204182](https://shopview.testrail.io/index.php?/cases/view/204182) — Confidence worked examples: visits and age together decide the grade
- [C204183](https://shopview.testrail.io/index.php?/cases/view/204183) — A dropped pair lowers the usable-pair count and so the confidence
- [C204184](https://shopview.testrail.io/index.php?/cases/view/204184) — Estimates round: mileage to the nearest 100, hours to the nearest 10
- [C204185](https://shopview.testrail.io/index.php?/cases/view/204185) — 24-month cut-off: readings older than two years give No data
- [C204186](https://shopview.testrail.io/index.php?/cases/view/204186) — Due date: the earliest candidate wins; compliance is due on its End date
- [C204187](https://shopview.testrail.io/index.php?/cases/view/204187) — Next due counts from the Work done date chosen in the step, not the invoice
- [C204128](https://shopview.testrail.io/index.php?/cases/view/204128) — Confidence reads Low, Medium or High; No data is its own state
- [C204131](https://shopview.testrail.io/index.php?/cases/view/204131) — Mileage and engine hours each carry their own confidence
- [C204139](https://shopview.testrail.io/index.php?/cases/view/204139) — Hovering a service shows its job, parts and inspection form, never money
- [C204150](https://shopview.testrail.io/index.php?/cases/view/204150) — Card negatives: line search, closing, invoiced work order, no schedule
- [C204121](https://shopview.testrail.io/index.php?/cases/view/204121) — Adding a service marks the origin without replacing an earlier one
- [C204164](https://shopview.testrail.io/index.php?/cases/view/204164) — The step lists services whose lines were added; untick to leave one
- [C204165](https://shopview.testrail.io/index.php?/cases/view/204165) — A closed line shows the date it closed, not the invoice date
- [C204167](https://shopview.testrail.io/index.php?/cases/view/204167) — The step: Compliance certificates section, optional, with its (i)
- [C204173](https://shopview.testrail.io/index.php?/cases/view/204173) — Send email opens with the fixed wording, editable for this one send
- [C204178](https://shopview.testrail.io/index.php?/cases/view/204178) — The footer says why the email was sent; there is no unsubscribe link
- [C204103](https://shopview.testrail.io/index.php?/cases/view/204103) — Saving re-evaluates thresholds at once; undo offered; returns to the tab
- [C204104](https://shopview.testrail.io/index.php?/cases/view/204104) — Every reading stored dated with its source; latest entered is current
- [C204107](https://shopview.testrail.io/index.php?/cases/view/204107) — The field reads Mileage; the unit is written in full, never mi or km
- [C204109](https://shopview.testrail.io/index.php?/cases/view/204109) — No telematics in v1: readings entered by hand or taken from a work order
- [C204110](https://shopview.testrail.io/index.php?/cases/view/204110) — Reading edge cases: gauge vs ECU, engine swap, correction, same-day
- [C204129](https://shopview.testrail.io/index.php?/cases/view/204129) — Estimated due date shows a month + confidence; exact date only if recorded
- [C204130](https://shopview.testrail.io/index.php?/cases/view/204130) — How each source renders: meter month, certificate End date, calendar month
- [C204132](https://shopview.testrail.io/index.php?/cases/view/204132) — Estimated values round (distance 100, hours 10); a rate reads as an accrual
- [C204133](https://shopview.testrail.io/index.php?/cases/view/204133) — The meter hover: the rule, the disclaimer, and View work orders
- [C204134](https://shopview.testrail.io/index.php?/cases/view/204134) — No projection is shown as fact; in Low a hand-sent reminder shows Soon
- [C204135](https://shopview.testrail.io/index.php?/cases/view/204135) — No data is the ordinary state; the meter gives no candidate, calendar governs
- [C204111](https://shopview.testrail.io/index.php?/cases/view/204111) — Each trigger proposes a candidate; the earliest wins as the Due date
- [C204112](https://shopview.testrail.io/index.php?/cases/view/204112) — Calendar always proposes a date; a meter in No data proposes nothing
- [C204113](https://shopview.testrail.io/index.php?/cases/view/204113) — 'At a reading' and 'At a day of the year' due and overdue behaviour
- [C204114](https://shopview.testrail.io/index.php?/cases/view/204114) — A compliance service is due on its certificate's End date
- [C204115](https://shopview.testrail.io/index.php?/cases/view/204115) — Confidence changes how the date reads, not which candidate wins
- [C204116](https://shopview.testrail.io/index.php?/cases/view/204116) — Covering applies only to what the shop named, within one schedule
- [C204117](https://shopview.testrail.io/index.php?/cases/view/204117) — Rows never merge; canned lines deduplicated; two schedules, one call
- [C204118](https://shopview.testrail.io/index.php?/cases/view/204118) — Today follows the location; resets and new readings recalc candidates
- [C204138](https://shopview.testrail.io/index.php?/cases/view/204138) — Rows show when due; due badges; compliance is orange and carries no tag
- [C204143](https://shopview.testrail.io/index.php?/cases/view/204143) — Two ways to satisfy a row: Add Service (on invoice) or Mark complete (now)
- [C204144](https://shopview.testrail.io/index.php?/cases/view/204144) — A row shows line count and hours only - no money anywhere on the panel
- [C204145](https://shopview.testrail.io/index.php?/cases/view/204145) — After Add Service: row reads Added, N lines; Mark complete is its button
- [C204146](https://shopview.testrail.io/index.php?/cases/view/204146) — Canned lines append as ordinary lines; nothing about the lines table changes
- [C204148](https://shopview.testrail.io/index.php?/cases/view/204148) — Each copied line carries an internal note listing the home location's parts
- [C204153](https://shopview.testrail.io/index.php?/cases/view/204153) — Adding from the worklist creates a work order and shows its number on the row
- [C204155](https://shopview.testrail.io/index.php?/cases/view/204155) — Canned lines duplicated across services are deduplicated on one visit
- [C204156](https://shopview.testrail.io/index.php?/cases/view/204156) — Adding a service is permission-gated and must offer the second destination
- [C204157](https://shopview.testrail.io/index.php?/cases/view/204157) — Declined estimate resets nothing; freeform or canned work; completion decides
- [C204158](https://shopview.testrail.io/index.php?/cases/view/204158) — Mark complete is in the row menu everywhere; it resets now, from a chosen date
- [C204159](https://shopview.testrail.io/index.php?/cases/view/204159) — Where was it done: On a work order (lists them) or Completed elsewhere
- [C204160](https://shopview.testrail.io/index.php?/cases/view/204160) — Reset date: never in the future; defaults by state; elsewhere requires it
- [C204161](https://shopview.testrail.io/index.php?/cases/view/204161) — On a compliance service the modal also takes the certificate
- [C204162](https://shopview.testrail.io/index.php?/cases/view/204162) — Mark complete resets at once; a lines-added service waits for the invoice
- [C204163](https://shopview.testrail.io/index.php?/cases/view/204163) — Covered services reset with the one that covers them, each on its own interval
- [C204166](https://shopview.testrail.io/index.php?/cases/view/204166) — Completion records where it happened and travels across the organization
- [C204169](https://shopview.testrail.io/index.php?/cases/view/204169) — Completion works with no canned line, and nothing scolds a freeform shop
- [C204171](https://shopview.testrail.io/index.php?/cases/view/204171) — One email, sent by hand via Send reminder; nothing sends automatically in v1
- [C204176](https://shopview.testrail.io/index.php?/cases/view/204176) — Sender is the shop over the platform address; Reply-To is the sender; BCC copy
- [C204120](https://shopview.testrail.io/index.php?/cases/view/204120) — A hand-created work order has an empty Maintenance schedule column
- [C204123](https://shopview.testrail.io/index.php?/cases/view/204123) — Open rates and bounce reporting are not tracked

### New (17) — folder 39946

- [C310704](https://shopview.testrail.io/index.php?/cases/view/310704) — Mark complete on a work order records its mileage and engine hours
- [C310705](https://shopview.testrail.io/index.php?/cases/view/310705) — The step after invoicing comes before the payment window
- [C310706](https://shopview.testrail.io/index.php?/cases/view/310706) — Closing the step after changing a date asks Discard your changes?
- [C310707](https://shopview.testrail.io/index.php?/cases/view/310707) — Anyone who can invoice sees the step, with no other permission
- [C310708](https://shopview.testrail.io/index.php?/cases/view/310708) — The step cannot be reopened and its dates cannot be changed afterwards
- [C310709](https://shopview.testrail.io/index.php?/cases/view/310709) — Past work order mileage is loaded as dated readings from the first day
- [C310710](https://shopview.testrail.io/index.php?/cases/view/310710) — Mileage copied onto a new work order is not a reading
- [C310711](https://shopview.testrail.io/index.php?/cases/view/310711) — A unit with nothing dated: the email says Nothing is scheduled yet
- [C310712](https://shopview.testrail.io/index.php?/cases/view/310712) — Nothing due within 91 days: the email lists the next two as Coming up
- [C310713](https://shopview.testrail.io/index.php?/cases/view/310713) — Mark complete creates no work order and sets no maintenance origin
- [C310714](https://shopview.testrail.io/index.php?/cases/view/310714) — A user who cannot open the schedule sees its name as plain text
- [C310715](https://shopview.testrail.io/index.php?/cases/view/310715) — After a reset Remove is gone; adding again re-attaches the lines still there
- [C310716](https://shopview.testrail.io/index.php?/cases/view/310716) — Reversing an invoice undoes its resets; services are proposed again
- [C310717](https://shopview.testrail.io/index.php?/cases/view/310717) — A pending invoice voided by adding a line: services proposed again
- [C310718](https://shopview.testrail.io/index.php?/cases/view/310718) — Part sales and imported work orders show no maintenance card or step
- [C310719](https://shopview.testrail.io/index.php?/cases/view/310719) — Every way of invoicing shows the step exactly once
- [C310720](https://shopview.testrail.io/index.php?/cases/view/310720) — Confidence changes band exactly at 30/31, 90/91, 180/181 and 365/366 days

