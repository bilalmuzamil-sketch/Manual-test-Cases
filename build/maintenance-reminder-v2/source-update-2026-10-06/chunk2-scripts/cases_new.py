# -*- coding: utf-8 -*-
# New Chunk 2 cases (executed inside gen.py)
LINES_DONE = "On the work order's Lines tab, complete every PM-A line (Complete on each line)."
PAY = "In the payment window record the payment (do not close it with X: closing an unpaid invoice's payment window removes the invoice)."

new("N1", "Mark complete on a work order records its mileage and engine hours", ["S18", "S10"],
    [LOGIN_ADMIN, SCHED, ENROLL,
     "On the asset's Maintenance tab note the last recorded mileage and engine hours (for example 342,417 and 6,388, Recorded 29 Aug 2026).",
     NEWWO],
    ["In the asset card at the top of the work order type Mileage 346,900 and Engine Hours 6,412, saving each.",
     "Expand the Maintenance schedule card, open the PM-A row's three-dot menu and choose Mark complete.",
     "In Mark PM-A complete keep On a work order with this work order chosen, and read the line beneath the work order.",
     "Set Reset date to 1 Oct 2026 and press Mark complete.",
     "Open the asset's Maintenance tab and read the Mileage and Engine hours cards."],
    ["Under the chosen work order the window says its readings will be recorded (in the design: Its readings are recorded: 346,900 mileage · "
     "6,412 engine hours).",
     "After Mark complete, 346,900 and 6,412 are the unit's recorded readings, dated 1 Oct 2026 (the Reset date), although the work order is not "
     "invoiced; they no longer read In the shop."],
    [Q("S18-R19"), Q("S10-R11", "Mark complete on that work order fixes it too, per S18-R19, so a fleet that never invoices its own trucks still "
                                "builds a reading history")],
    "S18-R19 is new on 5 Oct and no case cited it. Line under the work order from the Chunk 1 board frame M2c / Chunk 2 board frames 9 and 10.")

new("N2", "The step after invoicing comes before the payment window", ["S18"],
    [LOGIN_ADMIN, SCHED, ENROLL, NEWWO, PANEL, ADDSVC, LINES_DONE],
    ["Open the Finance tab and press Create Invoice.",
     "Watch what opens first after the invoice is created.",
     "In When was the maintenance done? press Confirm dates.",
     "Watch what opens next. " + PAY,
     "After the page reloads, open the asset's Maintenance tab and read PM-A."],
    ["Straight after the invoice is created, When was the maintenance done? opens, before the payment window.",
     "The payment window opens only after Confirm dates.",
     "After paying and the page reloading, PM-A counts from the date confirmed in the step: nothing confirmed there is lost."],
    [Q("S18-R20")],
    "S18-R20 is new on 5 Oct and no case cited it. Flow order from the Chunk 2 board: Create Invoice → Invoice created → When was the maintenance "
    "done? → Payment.")

new("N3", "Closing the step after changing a date asks Discard your changes?", ["S18"],
    [LOGIN_ADMIN, SCHED, ENROLL,
     "Create two work orders for the unit. On each, press Add Service > Add on PM-A and complete every PM-A line on the Lines tab today."],
    ["On the first work order open the Finance tab and press Create Invoice.",
     "In When was the maintenance done? change PM-A's Work done date from today to an earlier day (for example 1 Oct 2026). Close the step with X.",
     "Read the question that appears and press Keep editing.",
     "Close the step with X again and press Discard. " + PAY,
     "Open the asset's Maintenance tab and read what PM-A counts from.",
     "On the second work order press Create Invoice, and close When was the maintenance done? with X without changing anything. " + PAY],
    ["Closing after a change asks Discard your changes? with the text The proposed dates stay. and the buttons Keep editing and Discard.",
     "Keep editing returns to the step with 1 Oct 2026 still entered.",
     "Discard closes the step and the proposed date stands: PM-A counts from today (the day its lines closed), not from 1 Oct 2026.",
     "Closing the step without changing anything asks nothing and accepts every proposed date."],
    [Q("S18-R21"), Q("S18-R15", "closing the step without touching it accepts every proposal too")],
    "S18-R21 is new on 5 Oct and no case cited it. Dialog wording matches the Chunk 2 board frame I1d.")

new("N4", "Anyone who can invoice sees the step, with no other permission", ["S18"],
    [LOGIN_ADMIN, SCHED, ENROLL,
     "In Settings > Staff / Roles create a test user 'ZZAUTOTEST Invoicer' whose role can create invoices but cannot edit customers.",
     "As the Owner/Admin, create a work order for the unit, press Add Service > Add on PM-A and complete every PM-A line.",
     "Sign out and sign in as 'ZZAUTOTEST Invoicer'."],
    ["Open the work order, open the Finance tab and press Create Invoice.",
     "In When was the maintenance done? press Confirm dates. " + PAY,
     "Open the asset's Maintenance tab (or ask the Owner/Admin to) and read PM-A."],
    ["When was the maintenance done? appears for the user who can invoice, although that user cannot edit customers.",
     "Confirm dates works for that user, and PM-A counts from the confirmed date."],
    [Q("S18-N7"),
     PQ("Plan 2 Phase Q3, Definition of Done 11", "A user who can invoice but has no customer edit: the step appears and Confirm dates works (S18-N7).",
        "plan2")],
    "S18-N7 is new on 5 Oct and no case cited it. The role names are the shop's own; the spec gives no permission label for invoicing.",
    plan="Phase Q3, Verification (Definition of Done) item 11")

new("N5", "The step cannot be reopened and its dates cannot be changed afterwards", ["S18"],
    [LOGIN_ADMIN, SCHED, ENROLL, NEWWO, PANEL, ADDSVC, LINES_DONE],
    ["Open the Finance tab, press Create Invoice, press Confirm dates in When was the maintenance done?, and record the payment.",
     "Look everywhere on the work order (Finance tab, Lines tab, the three-dot menus, the Maintenance schedule card) for a way to open When was the "
     "maintenance done? again or change its dates.",
     "Open the asset's Maintenance tab and read PM-A."],
    ["Nothing offers to reopen the step or to change the dates confirmed in it.",
     "PM-A reads as done, counting from the date confirmed in the step."],
    [Q("S18-N8")],
    "S18-N8 is new on 5 Oct and no case cited it.")

new("N6", "Past work order mileage is loaded as dated readings from the first day", ["S10"],
    [LOGIN_ADMIN,
     "Pick an existing unit, not created for this test, whose Work Orders tab shows at least two invoiced work orders with Mileage in the last 24 "
     "months, at least 7 days apart and increasing.",
     "Open each of those work orders and write down its invoice date and Mileage, for example 330,100 on 2 Jun 2026 and 342,417 on 29 Aug 2026.",
     "Enroll the unit on a schedule with a mileage-triggered service if it is not on one. Do not enter any reading."],
    ["Open the unit's Maintenance tab and read the Mileage card: the last recorded value, its date and where it came from.",
     "Read the current estimate line and Measured from N visits."],
    ["The last recorded mileage is the latest of those work orders' Mileage (342,417 in the example), dated from that work order and naming it as the "
     "source (for example Recorded 29 Aug 2026 · WO S3780-15211).",
     "An estimate is shown, measured from the loaded visits, although nobody has entered a reading since release.",
     "If the organization has imported history, its readings appear in the same way."],
    [Q("S10-R12"), Q("S10-R10", "Every change to an asset's mileage or engine hours is stored as a dated reading with its source: work order, asset, "
                                "customer portal, import or API"),
     PQ("Plan 2 §3.1 D2", "WO reading dated by invoice date, else WO start", "plan2")],
    "S10-R12 is new on 5 Oct (no feature flag; past readings loaded once) and no case cited it. Which date a work order reading carries (invoice date, "
    "else start date) is stated only in the tech plan.",
    plan="section 3.1, settled decision D2")

new("N7", "Mileage copied onto a new work order is not a reading", ["S10"],
    [LOGIN_ADMIN, SCHED, ENROLL,
     "On the asset's Maintenance tab note the last recorded mileage and its date (for example 342,417, Recorded 29 Aug 2026)."],
    ["Create a new work order for the unit (New Work Order). Look at its Mileage field but do not change it.",
     "Add one hand-typed line, complete it, open the Finance tab, press Create Invoice and record the payment.",
     "Open the asset's Maintenance tab and read the Mileage card.",
     WORKLIST + " On the unit's PM-A row press Create work order and look at the new work order's Mileage field."],
    ["The new work order shows the unit's mileage (342,417), copied from the asset.",
     "After invoicing, the Mileage card still shows 342,417 recorded on 29 Aug 2026: the copied value did not become a reading dated today, and the "
     "unit does not look freshly read.",
     "A work order created from the worklist copies the mileage in the same way."],
    [Q("S10-N6")],
    "S10-N6 is new on 5 Oct and no case cited it.")

new("N8", "A unit with nothing dated: the email says Nothing is scheduled yet", ["S19"],
    [LOGIN_ADMIN,
     "Open Settings > Maintenance and create a schedule 'ZZAUTOTEST Compliance only' with one compliance service 'CVIP' (12-month term). Save.",
     "Enroll unit 'ZZAUTOTEST 407' of 'ZZAUTOTEST Fleet Co' on it, with no CVIP certificate on file.",
     CONTACT.replace("'ZZAUTOTEST 402'", "'ZZAUTOTEST 407'"),
     WORKLIST + " Find unit 407's row. If the unit has no row, its contact card cannot be reached: mark this case Blocked and report it.",
     QA_MAIL],
    ["On 407's row press Contact and check Send reminder.",
     "Press Send reminder and read Email content and the Reminder table.",
     "Press Send and read the email."],
    ["Send reminder is available.",
     "Instead of the opening line and the table, the email reads Nothing is scheduled for ZZAUTOTEST 407 yet. (design example: Nothing is "
     "scheduled for 402 yet.)",
     "The call to action and the signature are still there."],
    [Q("S19-R23")],
    "S19-R23 is new on 5 Oct and no case cited it. Reaching the contact card for a unit with nothing dated depends on it having a worklist row "
    "(blocker B2). Wording matches the Chunk 2 board frame R1Z.")

new("N9", "Nothing due within 91 days: the email lists the next two as Coming up", ["S19"],
    [LOGIN_ADMIN,
     "Open Settings > Maintenance and create a schedule 'ZZAUTOTEST Later PM' with three Calendar services, each Every 12 months: 'PM-B', 'PM-C' "
     "and 'PM-D'. Save.",
     "Enroll unit 'ZZAUTOTEST 408' with last service dates (examples for 6 Oct 2026): PM-B 6 Feb 2026 (due Feb 2027), PM-C 6 Apr 2026 (due Apr 2027) "
     "and PM-D 6 Jun 2026 (due Jun 2027). Nothing is due within 91 days.",
     CONTACT.replace("'ZZAUTOTEST 402'", "'ZZAUTOTEST 408'"),
     WORKLIST + " Find unit 408's row. If the unit has no row, its contact card cannot be reached: mark this case Blocked and report it.",
     QA_MAIL],
    ["On 408's row press Contact and check Send reminder.",
     "Press Send reminder, read the Reminder table, press Send and read the email."],
    ["Send reminder is available, not disabled, although nothing is due.",
     "The email lists the next two upcoming services, PM-B and PM-C, each as Coming up.",
     "PM-D is not included."],
    [Q("S19-R7")],
    "S19-R7 was rewritten on 5 Oct (next two upcoming services as Coming up; Send reminder never disabled) and no case covered the new rule. "
    "Reachability of the contact card is blocker B2. Matches the Chunk 2 board frame R1N.")

new("N10", "Mark complete creates no work order and sets no maintenance origin", ["S22"],
    [LOGIN_ADMIN, SCHED, ENROLL, NEWWO],
    ["Expand the Maintenance schedule card, open PM-A's three-dot menu, choose Mark complete, keep On a work order with this work order chosen and "
     "Reset date today, and press Mark complete.",
     "Open Work Orders. Find this work order and read its Maintenance schedule column. Check whether any new work order appeared.",
     "Turn on the From maintenance filter and look for this work order."],
    ["Mark complete creates no work order and adds no line to this one.",
     "This work order's Maintenance schedule column is empty.",
     "With From maintenance on, this work order is not listed."],
    [Q("S22-N3"), Q("S22-R3")],
    "S22-N3 is new on 5 Oct and no case cited it.")

new("N11", "A user who cannot open the schedule sees its name as plain text", ["S22"],
    [LOGIN_ADMIN, SCHED, ENROLL,
     WORKLIST + " On the unit's PM-A row press Create work order (the work order now has a maintenance origin).",
     "In Settings > Staff / Roles create a test user 'ZZAUTOTEST NoSettings' whose role does not have Settings Service (so Settings > Maintenance is "
     "out of reach), but can see work orders.",
     "Sign out and sign in as 'ZZAUTOTEST NoSettings'."],
    ["Open Work Orders and find the work order. Read its Maintenance schedule cell.",
     "Hover and click the schedule name."],
    ["The schedule's name shows as plain text, not a link (in the design a hint reads You can't open this schedule).",
     "Clicking it opens nothing."],
    [Q("S22-R2", "Where the user cannot open the schedule, its name shows as plain text, without a link")],
    "S22-R2 gained this sentence on 5 Oct; its quote in the existing case still matched, so the new sentence was untested.")

new("N12", "After a reset Remove is gone; adding again re-attaches the lines still there", ["S16", "S18"],
    [LOGIN_ADMIN, SCHED, ENROLL, NEWWO, PANEL, ADDSVC],
    ["Press Mark complete on the PM-A row (its button now). Keep On a work order with this work order chosen and Reset date today, and press "
     "Mark complete.",
     "Open the PM-A row's three-dot menu and read what it offers.",
     "Choose Undo complete. Wait for any toast to go, open the menu again and choose Remove.",
     "On the Lines tab delete one of PM-A's lines by hand (for example 'Air filter inspection'). Count PM-A's lines.",
     "On the card press Add Service on PM-A, then Add. Count PM-A's lines on the Lines tab and read the row."],
    ["After Mark complete the menu does not offer Remove; it offers Undo complete. (The tech plan puts Undo complete for this kind of row only on "
     "the asset's Maintenance tab: if it is missing on the card, use the asset tab and report the difference.)",
     "After Undo complete, Remove is offered and works.",
     "After the deletion, three PM-A lines remain.",
     "Adding PM-A again re-attaches the three lines still there and adds back only the deleted one: the Lines tab holds exactly 4 PM-A lines, not 7, "
     "and the row reads Added · 4 lines."],
    [Q("S16-R25", "Remove is not offered once the service has been reset, by Mark complete or by invoicing; Undo complete comes first, per S18-R17. "
                  "Adding the service again after Undo or Remove re-attaches the lines still on the work order rather than adding them a second time, "
                  "and adds only the lines no longer there"),
     Q("S18-R17", "its menu offers Undo complete until the service's next cycle moves again")],
    "Two sentences added to S16-R25 on 5 Oct; the existing case's quote still matched, so they were untested. The tech plan (FD-211) differs on where "
    "Undo complete appears for a lines-added row (DIVERGE D5).")

new("N13", "Reversing an invoice undoes its resets; services are proposed again", ["S18"],
    [LOGIN_ADMIN, SCHED, ENROLL,
     "Create work order A for the unit, press Add Service > Add on PM-A and complete every PM-A line today.",
     "Create work order B the same way for unit 'ZZAUTOTEST 403' (also enrolled with PM-A overdue)."],
    ["On A open the Finance tab and press Create Invoice. In When was the maintenance done? change PM-A's date to 1 Oct 2026 and press Confirm dates.",
     "In the payment window close it with X without paying. Read the work order and the asset's PM-A.",
     "Press Create Invoice again and read the step's date for PM-A. Press Confirm dates and record the payment.",
     "Read the asset's PM-A. Then reverse A's invoice with the work order's existing reverse action. Read PM-A again.",
     "Press Create Invoice on A once more and read the step.",
     "On B invoice it, confirm the step and pay. Then issue a credit memo against B's invoice with the existing credit memo action. Read 403's PM-A."],
    ["Closing the payment window removes the invoice seconds after invoicing, and PM-A is no longer reset: it reads Overdue again.",
     "At the next invoice PM-A is proposed again, keeping the date entered before (1 Oct 2026).",
     "Reversing the paid invoice deletes it and undoes PM-A's reset; invoicing again proposes PM-A again.",
     "The credit memo changes nothing: 403's PM-A still counts from the date confirmed for B."],
    [Q("S18-E2")],
    "S18-E2 was rewritten on 5 Oct and now says reversal undoes the resets and re-proposes, and a credit memo changes nothing; the old case said the "
    "opposite. The reverse and credit memo actions' on-screen names are not in the spec or design.",
    )

new("N14", "A pending invoice voided by adding a line: services proposed again", ["S18"],
    [LOGIN_ADMIN, SCHED, ENROLL,
     "Create a work order for the unit, press Add Service > Add on PM-A and complete every PM-A line.",
     "Create an invoice that stays pending (unpaid) without the payment window removing it, the way the shop normally leaves an invoice unpaid "
     "(for example a customer on credit terms). If you cannot produce a pending invoice, mark this case Blocked and report it."],
    ["With the invoice pending, add a new hand-typed line to the work order.",
     "Check the invoice: ShopView voids it because a line was added.",
     "Read the asset's PM-A.",
     "Invoice the work order again and read When was the maintenance done?."],
    ["The pending invoice is voided when the line is added.",
     "Its reset of PM-A is undone, as for a reversal.",
     "At the next invoice, PM-A is proposed again in When was the maintenance done?."],
    [Q("S18-E3"), Q("S18-E2", "The resets that invoice made are undone, and its services are proposed again when the work order is next invoiced, "
                              "keeping any date a person entered")],
    "S18-E3 was rewritten on 5 Oct (a voided pending invoice is treated like a reversal); the old case said 'A voided invoice is not a case'. "
    "How a tester leaves an invoice pending is blocker B3.")

new("N15", "Part sales and imported work orders show no maintenance card or step", ["S16", "S18"],
    [LOGIN_ADMIN, SCHED, ENROLL,
     "Customer 'ZZAUTOTEST Fleet Co' has a part sale (Part Sales tab), and, if the organization holds imported work orders from a data import, "
     "one imported work order."],
    ["Open the part sale and look for a Maintenance schedule card.",
     "Invoice the part sale and watch for When was the maintenance done?.",
     "If an imported work order exists, open it and look for a Maintenance schedule card."],
    ["The part sale shows no maintenance card.",
     "Invoicing the part sale looks exactly as today: no When was the maintenance done? step appears.",
     "An imported work order shows no maintenance card."],
    [PQ("Plan 2 §1 NFR-F103", "The panel never renders on part sales, imported WOs or history mode", "plan2"),
     PQ("Plan 2 Phase Q3, Definition of Done 7", "An ordinary WO (no maintenance) and a part sale: invoicing looks exactly as today and no step appears.",
        "plan2"),
     Q("S18-N5", "The step appears only where a maintenance service was completed. It never appears on an ordinary work order")],
    "Rule 115 ADD from the tech plan: testable behaviour the spec does not state for part sales and imported work orders.",
    plan="section 1, Analysis-introduced requirements, NFR-F103; Phase Q3, Definition of Done item 7")

new("N16", "Every way of invoicing shows the step exactly once", ["S18"],
    [LOGIN_ADMIN, SCHED,
     "Enroll four units so PM-A reads Overdue on each. Create one work order per unit and press Add Service > Add on PM-A on each.",
     "On work orders 1, 3 and 4 complete every PM-A line; leave work order 2 unfinished."],
    ["Work order 1: open the Finance tab and press Create Invoice. Count how many times When was the maintenance done? appears; confirm and pay.",
     "Work order 2 (unfinished): use the header Create Invoice, go through the completion steps it asks for, and count the step.",
     "Work order 3: on the Lines tab select the lines and use the bulk bar's Create Invoice; count the step.",
     "Work order 4: clock in on a PM-A line, then clock out and complete the work order, invoicing from there; count the step."],
    ["Each way of invoicing shows When was the maintenance done? exactly once, then the payment window.",
     "No way of invoicing skips it, and none shows it twice."],
    [PQ("Plan 2 Phase Q3, Definition of Done 2", "Repeat the entry: header Create invoice on an unfinished WO (completion wizard path); lines bulk bar "
        "Create invoice; clock out and complete on a line of that WO. Each one shows the step exactly once.", "plan2"),
     Q("S18-R13", "Every path that closes a line stamps that date: completing the line, the bulk action bar, creating an invoice, clocking out and review")],
    "Rule 115 ADD from the tech plan: the spec names the five paths that close a line, and the plan's Definition of Done requires every invoicing "
    "path to show the step exactly once.",
    plan="Phase Q3, Verification (Definition of Done) item 2")
