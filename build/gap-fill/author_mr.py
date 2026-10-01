#!/usr/bin/env python3
"""Rule-117 gap-fill authoring for 5 Maintenance Reminders gap/partial stories.
Sources: Jira (one-line user stories, primary/current) + Confluence 897679389 "Chunk 2 MR"
(fuller verbatim requirement wording; Chunk 1 capture 886931488 does NOT contain S10/S16/S17/S18/S22).
Dry-run prints titles+lengths; --apply creates cases via the shared builder and logs them."""
import importlib.util
spec = importlib.util.spec_from_file_location("gf", "build/gap-fill/gf_lib.py")
L = importlib.util.module_from_spec(spec); spec.loader.exec_module(L)

def SRC(key, title):
    return (f"Epic SV-3780 (Maintenance Reminders); story {key} ({title}); "
            f"Confluence 897679389 (Chunk 2 MR, lastModified 29 Sep 2026); read 1 Oct 2026.")
def MK(key):
    return f"authored from story {key} (status Open, not yet built); no QA build - not build-verified."

# ============================================================================
# SV-10567 / S10 "Enter a reading" - PLAUSIBILITY aspect -> section 25602
# ============================================================================
S = "SV-10567"; T = "Enter a mileage or engine hours reading"; SEC = 25602
src = SRC(S, T); mk = MK(S)

L.add(SEC,
  "Implausible reading shows an orange confirmation and saves on confirm",
  ["Log in as a user with View and edit customers permission on a QA build carrying the maintenance_reminders flag.",
   "Open a customer asset that exists, e.g. ZZAUTOTEST Truck 12 (example).",
   "Give it a baseline recorded reading: open Enter mileage and save Mileage = 100,000 (example), so a later jump is measurably implausible."],
  ["Open the asset Maintenance tab and click Enter mileage above the reading cards.",
   "Read the current value on the left (shown read-only with its source and age).",
   "In the new value on the right, type an implausibly large Mileage, e.g. 9,000,000 (example).",
   "Click Save.",
   "Read the confirmation the dialog shows.",
   "Confirm the save."],
  ["The dialog does not reject the value and does not turn red; nothing blocks the save.",
   "An orange, plainly worded confirmation appears asking you to confirm the unusual value.",
   "On confirming, the reading saves and the dialog returns to the Maintenance tab.",
   "The new Mileage (e.g. 9,000,000) is shown as the current reading."],
  src,
  [("S10-N2", "An implausible value shows an orange, plainly worded confirmation and saves on confirm. Never red, never blocking"),
   ("S10-N1", "No reading value is ever rejected by validation")],
  mk)

L.add(SEC,
  "Reading lower than the last one saves, is flagged, both stay in history",
  ["Log in as a user with View and edit customers permission on a QA build carrying the maintenance_reminders flag.",
   "Open an asset with a recorded reading, e.g. ZZAUTOTEST Truck 12 (example) whose last recorded Mileage is 100,000 (example)."],
  ["Open the asset Maintenance tab and click Enter mileage.",
   "In the new value, type a Mileage lower than the last recorded one, e.g. 95,000 (example).",
   "Click Save and confirm any prompt shown.",
   "Open the reading history for the asset."],
  ["The lower value saves; it is not rejected.",
   "The lower reading is flagged (marked as lower than the previous reading).",
   "Both the previous 100,000 and the new 95,000 remain visible in the reading history.",
   "The last value entered, 95,000, is shown as the current reading even though it is lower."],
  src,
  [("S10-N3", "A value lower than the last one saves, is flagged, and both values stay in history"),
   ("S10-R10", "The last value entered is the current reading, even when it is lower; a lower value is flagged and both stay in history"),
   ("S10-N1", "No reading value is ever rejected by validation")],
  mk)

# ============================================================================
# SV-10572 / S16 "Maintenance panel on a work order" (GAP) -> section 25603
# ============================================================================
S = "SV-10572"; T = "Maintenance panel on a work order"; SEC = 25603
src = SRC(S, T); mk = MK(S)

L.add(SEC,
  "Maintenance panel sits in the asset card, collapsed, with a due-count badge",
  ["Log in as a user with View work orders permission on a QA build carrying the maintenance_reminders flag.",
   "In Settings, create a maintenance schedule ZZAUTOTEST PM (example) with a routine service PM-A (example) on an interval of 5,000 mi (example).",
   "Enrol an asset onto it, e.g. ZZAUTOTEST Truck 12 (example), and set its reading so at least two services are due soon, due today or overdue.",
   "Open a work order that carries that asset, e.g. a new estimate for ZZAUTOTEST Truck 12 (example)."],
  ["On the work order, find the asset card.",
   "Locate the maintenance panel inside the asset card.",
   "Read the panel's badge without expanding it."],
  ["The maintenance panel appears inside the asset card and is collapsed by default.",
   "Collapsed, it shows a badge counting the services that are due soon, due today or overdue (e.g. 2).",
   "A unit with many due services does not make the card scroll forever, because the panel stays collapsed until opened."],
  src,
  [("S16-R1", "The panel will sit inside the asset card and be collapsed by default"),
   ("S16-R2", "Collapsed, it will carry a badge counting the services that are due soon, due today or overdue"),
   ("S16-E2", "A unit with ten due services does not scroll forever, because the panel is collapsed by default")],
  mk)

L.add(SEC,
  "Expanded maintenance panel lists due services with badges and summaries",
  ["Log in as a user with View work orders permission on a QA build carrying the maintenance_reminders flag.",
   "Create a maintenance schedule ZZAUTOTEST PM (example) with a routine service PM-A (example, carrying canned lines) and a compliance inspection service DOT (example).",
   "Enrol asset ZZAUTOTEST Truck 12 (example) so one routine service is overdue, the compliance service is overdue, and at least one schedule has nothing due.",
   "Open a work order carrying that asset."],
  ["On the work order asset card, expand the maintenance panel.",
   "Read each listed service row: its name, when it is due, and its badge.",
   "Find the compliance service row and note its colour when overdue.",
   "Find a schedule that has nothing due and read which row it shows.",
   "Hover a service row (or tap it on touch) and read the card that appears.",
   "Read the one-line summary on each row and look for any money figure."],
  ["The panel lists every service that is due; absorbed services are folded into the service that covers them.",
   "For a schedule with nothing due, the panel shows that schedule's next service.",
   "Each row shows when it is due in the same words the asset Maintenance tab uses.",
   "Rows carry due soon, due today and overdue badges, with overdue routine services in red.",
   "The compliance row is orange, never red, even when overdue, and carries no tag (its name and due date identify it).",
   "Hovering a service shows its contents: job description, parts, and the inspection form where one is attached.",
   "Each row reads as one summary of line count and hours, e.g. 4 lines - 2.1 hours, and shows no money anywhere (no total on the row, in the hover card, or in the add confirmation)."],
  src,
  [("S16-R3", "Expanded, it will list every service that is due, with absorbed services folded into the one that covers them, and for a schedule with nothing due, that schedule's next service. Each row carries the summary of S16-R16"),
   ("S16-R4", "Every row shows when it is due in the words the asset tab uses, per S11-R9 and S11-R13"),
   ("S16-R5", "Rows carry the asset tab's badges, due soon, due today and overdue, with overdue in red. A compliance row is orange, never red, including when overdue, per S3-R10"),
   ("S16-R6", "A compliance row carries no tag. The service name alone identifies it, and the due date already says what it is"),
   ("S16-R7", "Hovering a service will show what it contains: job description, parts, and where one is attached the inspection form. On touch, tapping the service opens the same card"),
   ("S16-R16", "Each row reads as one summary, the line count and the hours, for example 4 lines · 2.1 hours, rather than listing its lines. It carries no money: no total on the row, in the hover card of S16-R7, or in the add confirmation, on the same reasoning that took money off the worklist"),
   ("S16-N5", "Nothing in the panel shows a price. An honest figure would need the customer's labour rate, tax, fees and discounts, which the work order itself already computes once the lines are on it")],
  mk)

L.add(SEC,
  "Satisfy a panel row by Mark complete or by adding its canned lines",
  ["Log in as a user with Create and edit work orders permission on a QA build carrying the maintenance_reminders flag.",
   "Create a maintenance schedule ZZAUTOTEST PM (example) with a routine service PM-A (example) that carries canned lines, and a service with no canned lines, e.g. Visual check (example).",
   "Enrol asset ZZAUTOTEST Truck 12 (example) so both services are due.",
   "Open an estimate work order carrying that asset, at the location the schedule belongs to."],
  ["Expand the maintenance panel on the work order asset card.",
   "On the PM-A row, click + Add, and read where its canned lines land on the lines table.",
   "On the Visual check row (no canned lines), note which controls are offered.",
   "On a service row, click Mark complete and read what it asks for.",
   "Confirm Mark complete, then undo it while the work order is still open.",
   "Open the same panel on a work order at a different location, and on an invoiced work order, and note the controls offered."],
  ["+ Add uses the existing inline add pattern and is identical on every row.",
   "+ Add is offered on every row whose service carries canned lines; a service with no canned lines offers Mark complete alone.",
   "Canned lines added for a service are appended as separate, ordinary lines at the end of the work order, with no parent line, no indent and no new column.",
   "Mark complete on a work order asks only for confirmation, with no date and no reading, and can be undone while the work order is still open.",
   "Either + Add or Mark complete marks the row addressed on this work order, and a marked-addressed service stays visible as such on the work order itself.",
   "The addressed service resets when the work order is invoiced.",
   "+ Add is offered only at the location the service's schedule belongs to; at any other location the row offers Mark complete alone.",
   "+ Add is not offered on a work order that is invoiced or paid."],
  src,
  [("S16-R8", "+ Add will use the existing inline add pattern, identical on every row"),
   ("S16-R9", "+ Add will be available on every row whose service carries canned lines, including services not yet due. A service with no canned lines offers Mark complete alone"),
   ("S16-R19", "Canned lines added for a service arrive the way canned lines arrive today, appended as separate, ordinary lines at the end of the work order. Nothing about nesting, grouping, line placement or the lines table changes for this feature: no parent line, no indent, no new column"),
   ("S16-R17", "Mark complete on a work order asks only for confirmation, with no date and no reading, and can be undone while the work order is still open. The date is set in the step after invoicing, per S18-R13"),
   ("S16-R13", "Every row on the panel offers two ways to satisfy it: Mark complete, which on a work order means this work order, and adding its canned lines. Either marks the row addressed on this work order"),
   ("S16-R18", "A service marked addressed stays visible as such on the work order itself, not only in the audit log"),
   ("S16-R15", "A service marked addressed resets when the work order is invoiced, on the same rule as any other completion"),
   ("S16-N6", "+ Add is offered only on a work order at the location the service's schedule belongs to, because the canned lines are that location's. At any other location the row offers Mark complete alone. Tracking and completion stay organization-wide per S18-R12"),
   ("S16-N7", "+ Add is not offered on a work order that is invoiced or paid. Adding lines there would void or reopen its invoice")],
  mk)

L.add(SEC,
  "Panel offers Enrol and re-evaluates after a reading, with no reading control",
  ["Log in as a user with View and edit customers and work orders permission on a QA build carrying the maintenance_reminders flag.",
   "Have an asset on no maintenance schedule, e.g. ZZAUTOTEST Truck 99 (example), and a second asset enrolled with a service nearly due, e.g. ZZAUTOTEST Truck 12 (example).",
   "Open a work order carrying the enrolled asset ZZAUTOTEST Truck 12 (example)."],
  ["Open a work order carrying the un-enrolled asset ZZAUTOTEST Truck 99 (example) and expand its maintenance panel.",
   "Read what the panel offers for an asset on no schedule.",
   "On the enrolled asset's work order, look for an Enter a reading control inside the panel itself.",
   "Enter a reading for that asset from the work order (using the reading control above the panel) that pushes a service into due, then return to the panel."],
  ["Where the asset is on no schedule, the panel offers Enrol, which opens the same enrolment modal as the asset enrolment flow.",
   "The panel itself carries no Enter a reading control; readings live above it, and an empty reading shows as needing one.",
   "Entering a reading re-evaluates the unit immediately, and a service that has just become due says so in the panel."],
  src,
  [("S16-R11", "Where the asset is on no schedule, the panel will offer Enrol, opening the same modal as S7"),
   ("S16-N1", "The panel carries no Enter a reading control of its own. Readings live above it, and an empty reading shows as needing one"),
   ("S16-R12", "Entering a reading from the work order uses the same dialog as the asset. The dialog forecasts nothing, per S10-N4; once the reading is saved the panel shows what it moved, per S16-E1"),
   ("S16-E1", "A reading entered here re-evaluates the unit immediately, and a service that has just become due says so")],
  mk)

# ============================================================================
# SV-10573 / S17 "Add a service to an EXISTING work order" (PARTIAL) -> 25604
# ============================================================================
S = "SV-10573"; T = "Add a service to a work order"; SEC = 25604
src = SRC(S, T); mk = MK(S)

L.add(SEC,
  "Add a due service to the current work order with its canned lines",
  ["Log in as a user with Create and edit work orders permission on a QA build carrying the maintenance_reminders flag.",
   "Create a maintenance schedule ZZAUTOTEST PM (example) with a routine service PM-A (example) carrying canned lines, e.g. 4 lines (example).",
   "Enrol asset ZZAUTOTEST Truck 12 (example) so PM-A is due.",
   "Open an existing estimate work order that already carries that asset, e.g. with a line already typed on it (example)."],
  ["From the due PM-A service (on the work order panel, the worklist or the asset), choose Add.",
   "In the destination prompt, read the choices offered, and choose this work order.",
   "Confirm the add.",
   "Read the work order's lines table.",
   "Open the work order's notes.",
   "Open the work order's audit entries.",
   "Check whether any customer email was sent."],
  ["Adding offers a choice of this work order or a new one.",
   "Choosing this work order brings the service's canned lines onto it (e.g. 4 lines appended).",
   "A work order note is written naming the schedule and service it came from; the note is internal and no customer email is sent.",
   "An audit entry is written with the actor and a timestamp."],
  src,
  [("S17-R1", "Adding will offer this work order or a new one"),
   ("S17-R2", "Adding will bring the service's canned lines with it"),
   ("S17-R5", "Adding will write a work order note naming the schedule and service it came from. The note is internal and never visible to the customer, so it sends no customer email"),
   ("S17-R6", "Adding will write an audit entry with actor and timestamp")],
  mk)

L.add(SEC,
  "Adding services that share canned lines does not duplicate them",
  ["Log in as a user with Create and edit work orders permission on a QA build carrying the maintenance_reminders flag.",
   "Create a maintenance schedule ZZAUTOTEST PM (example) with two routine services that share a canned line, e.g. PM-A and PM-B both carrying an Oil change line (example).",
   "Enrol asset ZZAUTOTEST Truck 12 (example) so both PM-A and PM-B are due.",
   "Open a work order carrying that asset."],
  ["Add PM-A to this work order.",
   "Add PM-B to the same work order.",
   "Read the work order's lines table, looking for the shared Oil change line."],
  ["The canned lines duplicated across the two services are deduplicated; the shared Oil change line appears only once.",
   "The unit does not get the same line (e.g. oil) twice on one visit."],
  src,
  [("S17-R8", "Canned lines duplicated across services will be deduplicated, so a unit never gets oil twice on one visit")],
  mk)

L.add(SEC,
  "Existing hand-typed work order satisfies a due service without re-adding",
  ["Log in as a user with Create and edit work orders permission on a QA build carrying the maintenance_reminders flag.",
   "Create a maintenance schedule ZZAUTOTEST PM (example) with a routine service PM-A (example).",
   "Enrol asset ZZAUTOTEST Truck 12 (example) so PM-A is due.",
   "Open an existing work order carrying that asset whose lines were all typed by hand, e.g. a single 4-hour PM line (example), not added from canned lines."],
  ["Open the maintenance panel for that work order's asset and find the due PM-A row.",
   "On the PM-A row, choose Mark complete against this work order.",
   "Confirm.",
   "Read the PM-A row's state without adding any canned lines."],
  ["The existing hand-typed work order satisfies the due PM-A service without re-adding the lines.",
   "PM-A is marked addressed on this work order even though no canned lines were added.",
   "A shop that writes PM-A as one four-hour line and a shop that writes it as four canned lines can both satisfy the service."],
  src,
  [("S17-E2", "An existing work order whose lines were typed by hand must be able to satisfy a due service without re-adding the lines"),
   ("S17-E1", "A shop that writes PM-A as one four hour line and a shop that writes it as four canned lines must both be possible")],
  mk)

# ============================================================================
# SV-10574 / S18 "Complete a service and reset its cycle" (PARTIAL) -> 25605
# ============================================================================
S = "SV-10574"; T = "Complete a service"; SEC = 25605
src = SRC(S, T); mk = MK(S)

L.add(SEC,
  "Mark complete on a work order marks the service done immediately",
  ["Log in as a user with View and edit customers permission on a QA build carrying the maintenance_reminders flag.",
   "Create a maintenance schedule ZZAUTOTEST PM (example) with a routine service PM-A (example).",
   "Enrol asset ZZAUTOTEST Truck 12 (example) so PM-A is due or overdue.",
   "Have an open (un-invoiced) work order in the organization that did the service, e.g. at location Yard A (example)."],
  ["On the due PM-A service, click Mark complete.",
   "Read the radio choice offered.",
   "Choose a work order.",
   "Read what the work order dropdown lists, and that a work order from any location is selectable.",
   "Pick the work order and confirm; note that nothing else (no date, no reading) is asked.",
   "Open the maintenance reminders worklist and find the PM-A row."],
  ["Mark complete offers a radio choice: a work order, or completed elsewhere.",
   "The work order branch asks for nothing else; date and readings come from the work order.",
   "The work order dropdown lists location and date and allows a work order from any location in the organization.",
   "The service is marked completed immediately.",
   "Until that work order is invoiced, the worklist row reads the work order's Complete status with its Invoice action and stays on the worklist."],
  src,
  [("S18-R1", "Mark complete will offer a radio choice: a work order, or completed elsewhere"),
   ("S18-R2", "The work order branch will ask for nothing else. Date and readings come from the work order"),
   ("S18-R3", "The work order dropdown will list location and date, and will allow a work order from any location in the organization"),
   ("S18-R6", "Completion marks the service completed immediately. Where it was completed on a work order, the cycle resets from the date confirmed in the step after invoicing, and until the work order is invoiced the row reads the work order's Complete status with its Invoice action, per S13-R26, and stays on the worklist. Where it was completed elsewhere, there is no invoice to wait for and the cycle resets at once from the date the advisor entered")],
  mk)

L.add(SEC,
  "Invoicing resets each service from the editable date the work was done",
  ["Log in as a user with Create and edit work orders and customers permission on a QA build carrying the maintenance_reminders flag.",
   "Create a maintenance schedule ZZAUTOTEST PM (example) with a routine service PM-A (example) on a 90-day interval (example).",
   "Enrol asset ZZAUTOTEST Truck 12 (example) so PM-A is due.",
   "Have a work order that completed PM-A with its lines closed on, e.g., 10 Sept 2026 (example), ready to invoice weeks later, e.g. today (example)."],
  ["Invoice the work order that completed PM-A.",
   "Read the step shown after invoicing, listing each maintenance service completed on this work order.",
   "Read the date proposed for PM-A and its tick state.",
   "Change the proposed date to the day the work was actually done, e.g. 10 Sept 2026 (example).",
   "Note the next due date for PM-A.",
   "Untick a second completed service if one is present, then click Confirm dates.",
   "Separately, invoice an ordinary work order with no maintenance service and confirm no such step appears."],
  ["After invoicing, each completed service is listed with the date its cycle counts from; the proposed date is when that service's lines were all closed (e.g. 10 Sept 2026), or the invoice date only where there is nothing better.",
   "The proposed date is editable and names the day the work was done; the next due follows from it through PM-A's interval (e.g. 10 Sept 2026 + 90 days = 9 Dec 2026) and updates as the date changes.",
   "Each service is ticked by default and can be unticked; an unticked service does not reset and stays due.",
   "Accepting every proposed date is one action, Confirm dates; closing the step without touching it accepts every proposal.",
   "The step appears only where a maintenance service was completed; it never appears on an ordinary work order."],
  src,
  [("S18-R13", "Where a work order completed one or more maintenance services, invoicing it shows each of those services with the date its cycle counts from. The date proposed is when that service's own lines were all closed, which S18-R9 already stamps; for a service marked complete without lines, the day it was marked; and the invoice date only where there is nothing better"),
   ("S18-R14", "The proposed date is editable and names the day the work was done. The next due follows from it through the service's own interval and updates as it changes, so a shop invoicing weeks late resets from the work rather than from the paperwork"),
   ("S18-R8", "The step after invoicing lists every service marked on this work order, each ticked by default and can be unticked, with its reason: Lines added from PM-A, or Marked complete on this work order. An unticked service does not reset and stays due"),
   ("S18-R15", "Accepting every proposed date is one action, Confirm dates. A shop that invoices on the day of the work passes through without touching it, and closing the step without touching it accepts every proposal too, per S18-N5"),
   ("S18-N5", "The step appears only where a maintenance service was completed. It never appears on an ordinary work order, and leaving without touching it accepts every proposal, on the same rule as S18-N1")],
  mk)

L.add(SEC,
  "Record a service completed elsewhere and reset its cycle at once",
  ["Log in as a user with View and edit customers permission on a QA build carrying the maintenance_reminders flag.",
   "Create a maintenance schedule ZZAUTOTEST PM (example) with a routine service PM-A (example) on a 90-day interval (example).",
   "Enrol asset ZZAUTOTEST Truck 12 (example) so PM-A is due."],
  ["On the due PM-A service, click Mark complete.",
   "Choose completed elsewhere.",
   "Read the fields the elsewhere branch asks for.",
   "Enter a date earlier than today, e.g. 1 Aug 2026 (example); optionally enter a reading and choose which shop.",
   "Confirm.",
   "Open the asset Maintenance tab / worklist and read PM-A's next due and where the work is recorded as having happened."],
  ["The elsewhere branch asks for the date, optionally a reading, and optionally which shop.",
   "There is no invoice to wait for: the cycle resets at once from the date entered (e.g. next due = 1 Aug 2026 + 90 days = 30 Oct 2026).",
   "Completion records where it happened, including another shop, and advances what every location tracks across the organization.",
   "Entering an earlier date for early completion is accepted with nothing warning or confirming."],
  src,
  [("S18-R4", "The elsewhere branch will ask for the date, optionally a reading, and optionally which shop"),
   ("S18-R6", "Completion marks the service completed immediately. Where it was completed on a work order, the cycle resets from the date confirmed in the step after invoicing, and until the work order is invoiced the row reads the work order's Complete status with its Invoice action, per S13-R26, and stays on the worklist. Where it was completed elsewhere, there is no invoice to wait for and the cycle resets at once from the date the advisor entered"),
   ("S18-R11", "Completion will record where it happened, including another shop"),
   ("S18-R12", "Completion travels across the organization. A unit serviced at one location advances what another location tracks"),
   ("S18-E1", "Early completion is normal. Fleets move compliance work months earlier to fit a slow season, and nothing warns or confirms")],
  mk)

L.add(SEC,
  "Completed-elsewhere compliance service captures a certificate record",
  ["Log in as a user with View and edit customers permission on a QA build carrying the maintenance_reminders flag.",
   "Create a maintenance schedule ZZAUTOTEST PM (example) with a compliance inspection service DOT (example) that has a term, e.g. 12 months (example).",
   "Enrol asset ZZAUTOTEST Truck 12 (example) so the DOT compliance service is due."],
  ["On the due DOT compliance service, click Mark complete and choose completed elsewhere.",
   "Read the fields the elsewhere branch collects for a compliance service.",
   "Enter the certificate type and term and at least one of the effective and expiry dates, e.g. effective 1 Sept 2026 (example).",
   "Confirm.",
   "Open the asset's compliance inspection records."],
  ["For a compliance service, the elsewhere branch collects the certificate's type and term and at least one of its effective and expiry dates.",
   "Confirming creates a compliance inspection record on the asset."],
  src,
  [("S18-R5", "On a compliance service, the elsewhere branch will collect the certificate's type and term and at least one of its effective and expiry dates, per S8-R11, and will create a record")],
  mk)

# ============================================================================
# SV-10577 / S22 "Work order origin reporting" (GAP) -> section 25606
# ============================================================================
S = "SV-10577"; T = "Origin reporting"; SEC = 25606
src = SRC(S, T); mk = MK(S)

L.add(SEC,
  "Work order from a due service shows its Maintenance schedule column",
  ["Log in as a user with Create and edit work orders and View work orders permission on a QA build carrying the maintenance_reminders flag.",
   "Create a maintenance schedule ZZAUTOTEST PM (example) with a routine service PM-A (example).",
   "Enrol asset ZZAUTOTEST Truck 12 (example) so PM-A is due."],
  ["From the due PM-A service on the maintenance reminders worklist, use Create work order.",
   "Open the Work Orders list.",
   "Find the row for the work order just created and read its Maintenance schedule column.",
   "Click the schedule name in that column."],
  ["The work order created from the due service carries its origin.",
   "The Work Orders list shows a Maintenance schedule column naming the schedule (e.g. ZZAUTOTEST PM).",
   "The schedule name links to the schedule the work order came from."],
  src,
  [("S22-R1", "A work order created from a due service will carry the origin"),
   ("S22-R2", "The Work Orders list will gain a Maintenance schedule column, naming the schedule and linking to it where the work order came from one")],
  mk)

L.add(SEC,
  "Hand-created work order has an empty Maintenance schedule column",
  ["Log in as a user with Create and edit work orders permission on a QA build carrying the maintenance_reminders flag."],
  ["Create a work order by hand (not from a due service), e.g. ZZAUTOTEST hand WO (example) for any asset.",
   "Open the Work Orders list and find that work order's row.",
   "Read its Maintenance schedule column."],
  ["A work order created by hand carries no origin and is not inferred into one.",
   "Its Maintenance schedule column is empty."],
  src,
  [("S22-R3", "The column will be empty for work orders with no maintenance origin"),
   ("S22-N1", "A work order created by hand carries no origin and is not inferred into one")],
  mk)

L.add(SEC,
  "Adding a service sets a work order origin without replacing an existing one",
  ["Log in as a user with Create and edit work orders permission on a QA build carrying the maintenance_reminders flag.",
   "Create a maintenance schedule ZZAUTOTEST PM (example) with a routine service PM-A (example); enrol asset ZZAUTOTEST Truck 12 (example) so PM-A is due.",
   "Have a hand-created work order for that asset with no origin (example), and separately a work order already created from another due service, e.g. from schedule ZZAUTOTEST PM-OTHER (example)."],
  ["Add the due PM-A service to the hand-created work order (which had no origin).",
   "Open the Work Orders list and read that work order's Maintenance schedule column.",
   "Add a second due service to the work order that already has an origin.",
   "Read that work order's Maintenance schedule column again."],
  ["Adding a service to the existing hand-created work order marks that work order's origin (its Maintenance schedule column now names the schedule).",
   "Where the work order already had an origin, adding another service does not replace the origin it already had."],
  src,
  [("S22-E1", "A service added to an existing work order marks that work order's origin without replacing an origin it already had")],
  mk)

L.add(SEC,
  "Maintenance origin and work order value are reportable together",
  ["Log in as a user with View work orders / reporting access on a QA build carrying the maintenance_reminders flag.",
   "Have at least one work order created from a due service (with a Maintenance schedule origin) carrying a value, e.g. $480.00 (example), and at least one hand-created work order with no origin."],
  ["Open the Work Orders list (or the reporting surface that lists work orders with their value).",
   "Show the Maintenance schedule column alongside the work order value.",
   "Read the value against the maintenance-origin work orders."],
  ["Origin and value are shown together, so the revenue attributable to reminders can be read and summed (e.g. $480.00 for the maintenance-origin work order).",
   "Work orders with no maintenance origin are distinguishable (empty schedule column), so reminder revenue can be separated from the rest."],
  src,
  [("S22-R4", "Origin and value will be reportable together, so the revenue attributable to reminders can be answered"),
   ("S22-E2", "Without this column there is no way to answer whether the feature earned anything, which is why it is v1 rather than later")],
  mk)

L.save("build/gap-fill/mr-created-log.json")
