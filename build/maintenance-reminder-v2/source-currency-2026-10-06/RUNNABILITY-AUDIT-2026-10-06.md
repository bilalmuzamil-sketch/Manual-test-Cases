# Runnability audit — 209 live Maintenance Reminders cases

## requirement code in preconditions/steps/plain results: 0

## engineering words (API, endpoint, server, database, payload, 4xx/5xx, JSON, devtools, console, network tab): 83
- [C146327](https://shopview.testrail.io/index.php?/cases/view/146327) (chunk1) — No certificate date on the form; a compliance service is orange — found: 402
- [C146334](https://shopview.testrail.io/index.php?/cases/view/146334) (chunk1) — Editing or removing a service asks first and spares enrolled assets — found: 402
- [C146335](https://shopview.testrail.io/index.php?/cases/view/146335) (chunk1) — Duplicate names the copy "(Copy)", then "(Copy 2)"; no assets — found: 402
- [C146336](https://shopview.testrail.io/index.php?/cases/view/146336) (chunk1) — Archiving deactivates and unenrolls; restoring enrolls nobody — found: 402
- [C146337](https://shopview.testrail.io/index.php?/cases/view/146337) (chunk1) — Remove from schedule takes one asset off; history stays — found: 402
- [C146338](https://shopview.testrail.io/index.php?/cases/view/146338) (chunk1) — History survives removal; enrolling again anchors from last completion — found: 402
- [C146339](https://shopview.testrail.io/index.php?/cases/view/146339) (chunk1) — Enrolment opens the same modal from three places, offering every schedule — found: 402
- [C146340](https://shopview.testrail.io/index.php?/cases/view/146340) (chunk1) — The modal collects the schedule, then optional last-service dates — found: 402
- [C146346](https://shopview.testrail.io/index.php?/cases/view/146346) (chunk1) — Compliance records sit in the asset card's Compliance section — found: 402
- [C146347](https://shopview.testrail.io/index.php?/cases/view/146347) (chunk1) — A compliance record's fields, Certificate number and attachment — found: 402
- [C146348](https://shopview.testrail.io/index.php?/cases/view/146348) (chunk1) — Start date, End date and term derive; valid through the End date — found: 402
- [C146349](https://shopview.testrail.io/index.php?/cases/view/146349) (chunk1) — Latest record is current; a renewal drives at once and keeps history — found: 402
- [C146352](https://shopview.testrail.io/index.php?/cases/view/146352) (chunk1) — Two reading cards: recorded is exact, an estimate has a badge — found: 402
- [C146355](https://shopview.testrail.io/index.php?/cases/view/146355) (chunk1) — The Due cell shows the earliest candidate; Other triggers lists the rest — found: 402
- [C146357](https://shopview.testrail.io/index.php?/cases/view/146357) (chunk1) — Due dates: a month for estimates, End date for certificates — found: 402
- [C146362](https://shopview.testrail.io/index.php?/cases/view/146362) (chunk1) — One column set; unit shows number + year/make/model — found: 402
- [C146364](https://shopview.testrail.io/index.php?/cases/view/146364) (chunk1) — A due date shows confidence, Certificate or Calendar, never a figure — found: 402
- [C146378](https://shopview.testrail.io/index.php?/cases/view/146378) (chunk1) — A reading correction keeps both values (no audit screen in v1) — found: 500
- [C146385](https://shopview.testrail.io/index.php?/cases/view/146385) (chunk1) — Confidence follows the locked table: age of last reading by pairs — found: 400
- [C310727](https://shopview.testrail.io/index.php?/cases/view/310727) (chunk1) — The confidence meter's hover ends with the estimate disclaimer — found: 402
- [C310728](https://shopview.testrail.io/index.php?/cases/view/310728) (chunk1) — Mark complete sits in the row menu and opens "Mark PM-A complete" — found: 402
- [C310729](https://shopview.testrail.io/index.php?/cases/view/310729) (chunk1) — "Where was it done?" lists work orders from every location — found: 402
- [C310730](https://shopview.testrail.io/index.php?/cases/view/310730) (chunk1) — Reset date defaults: today, or the day the lines closed — found: 402
- [C310731](https://shopview.testrail.io/index.php?/cases/view/310731) (chunk1) — Completed elsewhere asks for a Reset date and optional shop and reading — found: 402
- [C310732](https://shopview.testrail.io/index.php?/cases/view/310732) (chunk1) — Mark complete on a compliance service takes the certificate — found: 402
- [C310733](https://shopview.testrail.io/index.php?/cases/view/310733) (chunk1) — Mark complete resets at once; added lines wait for the invoice — found: 402
- [C310734](https://shopview.testrail.io/index.php?/cases/view/310734) (chunk1) — After Mark complete: toast with Undo, Completed row, Undo complete — found: 402
- [C310735](https://shopview.testrail.io/index.php?/cases/view/310735) (chunk1) — Undo complete only for the latest Mark complete — found: 402
- [C310736](https://shopview.testrail.io/index.php?/cases/view/310736) (chunk1) — Mark complete on a work order records its mileage as a reading — found: 402
- [C204102](https://shopview.testrail.io/index.php?/cases/view/204102) (chunk2) — Reading dialog on the asset: current vs new, one row per meter — found: 402
- [C204105](https://shopview.testrail.io/index.php?/cases/view/204105) (chunk2) — A work order reading shows In the shop until invoiced or Mark complete — found: 402, 500
- [C204106](https://shopview.testrail.io/index.php?/cases/view/204106) (chunk2) — Correct a wrong reading by entering the right one; the last one counts — found: 402
- [C204108](https://shopview.testrail.io/index.php?/cases/view/204108) (chunk2) — No reading is rejected; an implausible value asks to confirm, then saves — found: 402, 500
- [C204136](https://shopview.testrail.io/index.php?/cases/view/204136) (chunk2) — Card sits in the asset card, collapsed, with a count badge and nothing else — found: 402
- [C204137](https://shopview.testrail.io/index.php?/cases/view/204137) (chunk2) — Expanded card: covered services fold in only under a listed coverer — found: 402, 403
- [C204140](https://shopview.testrail.io/index.php?/cases/view/204140) (chunk2) — Add Service is a button on every row and opens the Add Service window — found: 402
- [C204141](https://shopview.testrail.io/index.php?/cases/view/204141) (chunk2) — Add a compliance certificate, or enroll the unit, from the work order card — found: 402, 403
- [C204142](https://shopview.testrail.io/index.php?/cases/view/204142) (chunk2) — Readings go in the work order's Mileage field; the card updates at once — found: 403, 404
- [C204147](https://shopview.testrail.io/index.php?/cases/view/204147) (chunk2) — Add Service at another location copies the work at this location's rates — found: 402
- [C204149](https://shopview.testrail.io/index.php?/cases/view/204149) (chunk2) — Add Service toast with Undo; Remove until invoiced; no line is deleted — found: 402
- [C204151](https://shopview.testrail.io/index.php?/cases/view/204151) (chunk2) — Splitting a work order and merging assets keep services and history — found: 402, 403, 405, 406
- [C204152](https://shopview.testrail.io/index.php?/cases/view/204152) (chunk2) — The card offers this or a new work order; elsewhere only Create work order — found: 402, 403
- [C204154](https://shopview.testrail.io/index.php?/cases/view/204154) (chunk2) — Adding a service writes one internal note naming the service and schedule — found: 402
- [C204168](https://shopview.testrail.io/index.php?/cases/view/204168) (chunk2) — Mark complete: toast with Undo, Completed row, worklist rest until due soon — found: 402, 403
- [C204170](https://shopview.testrail.io/index.php?/cases/view/204170) (chunk2) — Early completion needs no confirmation; serviced Monday, invoiced later — found: 402, 403
- [C204172](https://shopview.testrail.io/index.php?/cases/view/204172) (chunk2) — Send reminder opens the send email window with every contact listed — found: 402
- [C204174](https://shopview.testrail.io/index.php?/cases/view/204174) (chunk2) — The email lists every service the worklist shows for the unit, with its state — found: 402
- [C204175](https://shopview.testrail.io/index.php?/cases/view/204175) (chunk2) — Due month where the date is sound; Soon for a Low date; no confidence words — found: 402
- [C204177](https://shopview.testrail.io/index.php?/cases/view/204177) (chunk2) — Greeting names one or two people, else Hello; invoice-style signature — found: 402, 403
- [C204179](https://shopview.testrail.io/index.php?/cases/view/204179) (chunk2) — Setting off blocks every send; a send updates Last sent; no bounces — found: 402, 403
- [C204119](https://shopview.testrail.io/index.php?/cases/view/204119) (chunk2) — Work orders from a due service or Add Service show the Maintenance schedule — found: 402, 403
- [C204122](https://shopview.testrail.io/index.php?/cases/view/204122) (chunk2) — From maintenance filter: count and total of every matching work order — found: 402, 403
- [C204180](https://shopview.testrail.io/index.php?/cases/view/204180) (chunk2) — Rate maths: last three usable pairs over the days they span (worked example) — found: 501
- [C204125](https://shopview.testrail.io/index.php?/cases/view/204125) (chunk2) — The rate uses the last three usable pairs; with one or two, all of them — found: 400, 401, 403, 502
- [C204124](https://shopview.testrail.io/index.php?/cases/view/204124) (chunk2) — An estimate carries the last reading forward at the unit's own rate — found: 504, 505
- [C204126](https://shopview.testrail.io/index.php?/cases/view/204126) (chunk2) — A usable pair, and the guards that drop pairs from the rate — found: 500
- [C204127](https://shopview.testrail.io/index.php?/cases/view/204127) (chunk2) — Correcting a reading recomputes the rate at once — found: 506
- [C204181](https://shopview.testrail.io/index.php?/cases/view/204181) (chunk2) — Confidence table: age of last reading × usable pairs, every cell — found: 400
- [C204182](https://shopview.testrail.io/index.php?/cases/view/204182) (chunk2) — Confidence worked examples: visits and age together decide the grade — found: 400, 500
- [C204187](https://shopview.testrail.io/index.php?/cases/view/204187) (chunk2) — Next due counts from the Work done date chosen in the step, not the invoice — found: 402
- [C204139](https://shopview.testrail.io/index.php?/cases/view/204139) (chunk2) — Hovering a service shows its job, parts and inspection form, never money — found: 402
- [C204150](https://shopview.testrail.io/index.php?/cases/view/204150) (chunk2) — Card negatives: line search, closing, invoiced work order, no schedule — found: 402
- [C204121](https://shopview.testrail.io/index.php?/cases/view/204121) (chunk2) — Adding a service marks the origin without replacing an earlier one — found: 402, 403
- [C204164](https://shopview.testrail.io/index.php?/cases/view/204164) (chunk2) — The step lists services whose lines were added; untick to leave one — found: 402
- [C204165](https://shopview.testrail.io/index.php?/cases/view/204165) (chunk2) — A closed line shows the date it closed, not the invoice date — found: 402
- [C204167](https://shopview.testrail.io/index.php?/cases/view/204167) (chunk2) — The step: Compliance certificates section, optional, with its (i) — found: 402
- [C204173](https://shopview.testrail.io/index.php?/cases/view/204173) (chunk2) — Send email opens with the fixed wording, editable for this one send — found: 402
- [C204178](https://shopview.testrail.io/index.php?/cases/view/204178) (chunk2) — The footer says why the email was sent; there is no unsubscribe link — found: 402
- [C204104](https://shopview.testrail.io/index.php?/cases/view/204104) (chunk2) — Every reading stored dated with its source; latest entered is current — found: API
- [C310704](https://shopview.testrail.io/index.php?/cases/view/310704) (chunk2) — Mark complete on a work order records its mileage and engine hours — found: 402
- [C310705](https://shopview.testrail.io/index.php?/cases/view/310705) (chunk2) — The step after invoicing comes before the payment window — found: 402
- [C310706](https://shopview.testrail.io/index.php?/cases/view/310706) (chunk2) — Closing the step after changing a date asks Discard your changes? — found: 402
- [C310707](https://shopview.testrail.io/index.php?/cases/view/310707) (chunk2) — Anyone who can invoice sees the step, with no other permission — found: 402
- [C310708](https://shopview.testrail.io/index.php?/cases/view/310708) (chunk2) — The step cannot be reopened and its dates cannot be changed afterwards — found: 402
- [C310710](https://shopview.testrail.io/index.php?/cases/view/310710) (chunk2) — Mileage copied onto a new work order is not a reading — found: 402
- [C310711](https://shopview.testrail.io/index.php?/cases/view/310711) (chunk2) — A unit with nothing dated: the email says Nothing is scheduled yet — found: 402, 407
- [C310712](https://shopview.testrail.io/index.php?/cases/view/310712) (chunk2) — Nothing due within 91 days: the email lists the next two as Coming up — found: 408
- [C310713](https://shopview.testrail.io/index.php?/cases/view/310713) (chunk2) — Mark complete creates no work order and sets no maintenance origin — found: 402
- [C310714](https://shopview.testrail.io/index.php?/cases/view/310714) (chunk2) — A user who cannot open the schedule sees its name as plain text — found: 402
- [C310715](https://shopview.testrail.io/index.php?/cases/view/310715) (chunk2) — After a reset Remove is gone; adding again re-attaches the lines still there — found: 402
- [C310716](https://shopview.testrail.io/index.php?/cases/view/310716) (chunk2) — Reversing an invoice undoes its resets; services are proposed again — found: 402, 403
- [C310717](https://shopview.testrail.io/index.php?/cases/view/310717) (chunk2) — A pending invoice voided by adding a line: services proposed again — found: 402
- [C310718](https://shopview.testrail.io/index.php?/cases/view/310718) (chunk2) — Part sales and imported work orders show no maintenance card or step — found: 402

## plan or design jargon (Plan 1/2, TD-, FD-, NFR, artboard, board, frame, D-number): 0

## points to another case or section instead of saying what to do: 0

## placeholder left in text: 0

## feature-flag wording: 0

## unclear verbs (verify the logic / ensure it works / check behaviour): 0

## no preconditions: 0

## no steps: 0

## title > 80: 0

## steps with no numbered list: 0

## very long step (>350 chars): 0

## asks the tester to record wording (not judge): 8
- [C146310](https://shopview.testrail.io/index.php?/cases/view/146310) (chunk1) — The empty Maintenance screen prompts the first schedule
- [C146316](https://shopview.testrail.io/index.php?/cases/view/146316) (chunk1) — Add service opens a blank form in a fixed order
- [C146320](https://shopview.testrail.io/index.php?/cases/view/146320) (chunk1) — Interval fields take whole numbers within caps only
- [C146363](https://shopview.testrail.io/index.php?/cases/view/146363) (chunk1) — Due status vs work order status; Invoice or Mark complete clears a row
- [C146366](https://shopview.testrail.io/index.php?/cases/view/146366) (chunk1) — Row actions are Contact and Create work order; menu holds the rest
- [C146374](https://shopview.testrail.io/index.php?/cases/view/146374) (chunk1) — Notifications off disables Send; no permission hides it
- [C204175](https://shopview.testrail.io/index.php?/cases/view/204175) (chunk2) — Due month where the date is sound; Soon for a Low date; no confidence words
- [C310712](https://shopview.testrail.io/index.php?/cases/view/310712) (chunk2) — Nothing due within 91 days: the email lists the next two as Coming up

## says part cannot be checked by hand: 10
- [C146372](https://shopview.testrail.io/index.php?/cases/view/146372) (chunk1) — Send reminder covers one asset, updates last sent, no Resend
- [C146376](https://shopview.testrail.io/index.php?/cases/view/146376) (chunk1) — Every maintenance state change is recorded (no audit screen in v1)
- [C146377](https://shopview.testrail.io/index.php?/cases/view/146377) (chunk1) — Adding a service to a work order writes a work order note
- [C146378](https://shopview.testrail.io/index.php?/cases/view/146378) (chunk1) — A reading correction keeps both values (no audit screen in v1)
- [C146379](https://shopview.testrail.io/index.php?/cases/view/146379) (chunk1) — Sends are logged with message, recipient and time (no audit screen)
- [C146380](https://shopview.testrail.io/index.php?/cases/view/146380) (chunk1) — History outlives removal, archive and asset deletion (no audit screen)
- [C146381](https://shopview.testrail.io/index.php?/cases/view/146381) (chunk1) — A notification-setting change is recorded (no audit screen in v1)
- [C204106](https://shopview.testrail.io/index.php?/cases/view/204106) (chunk2) — Correct a wrong reading by entering the right one; the last one counts
- [C204154](https://shopview.testrail.io/index.php?/cases/view/204154) (chunk2) — Adding a service writes one internal note naming the service and schedule
- [C204179](https://shopview.testrail.io/index.php?/cases/view/204179) (chunk2) — Setting off blocks every send; a send updates Last sent; no bounces

## plain results missing: 0

---
# Manual review of the flagged text (6 Oct 2026) — what a tester could still trip on
The "engineering words" hits above are all unit names (402, 501…) or mileage values — false positives. The real risks:

1. **Wording checks with no clear verdict (7):** C146310, C146316, C146320, C146363, C146366, C146374, C204141 say "record
   the build's wording" but not whether a different wording passes or fails. (C204136, C204175, C310712 already say "write
   down what you see and do not pass or fail the case on it" — the clear form.)
2. **Dates fixed to a 6 Oct 2026 run (14):** C204124, C204125, C204126, C204127, C204128, C204131, C204180, C204181, C204182,
   C204183, C204184, C204185, C204186, C310720 — on any other day the tester must shift every reading date by hand.
   Chunk 1's seeded cases already use "N days before today".
3. **Conditional or outside-the-case data (4):** C204124 ("if the organization holds a unit with imported history… if none
   exists"), C204150 ("a test organization with no maintenance schedule, and one with a single workplace, if available"),
   C310709 (needs an existing unit with two invoiced work orders), C310715 (names "the tech plan" in the expected result).
4. **"Record this part as not checked by hand" (13)** — the audit parts with no screen in v1. Clear enough, but they don't
   say where to record it (the result comment).
5. **Seeding depends on Mark complete working (21 cases)** — every past-dated reading is seeded through Mark complete On a
   work order. If that is broken, the case should be Blocked, not Failed; no case says so.
