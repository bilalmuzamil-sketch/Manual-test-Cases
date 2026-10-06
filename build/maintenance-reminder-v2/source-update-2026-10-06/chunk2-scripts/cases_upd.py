# -*- coding: utf-8 -*-
# Whole-case rewrites of existing Chunk 2 cases (executed inside gen.py)
AUDIT_Q = PQ("Main page change log, 5 Oct 2026", "Audit recorded, no screen in v1.", "main")
AUDIT_RES = "No screen shows the audit in this version, so the audit entry cannot be checked by hand: record this part as not checked by hand."

# ---------------- S10
upd(204102, "Reading dialog on the asset: current vs new, one row per meter", ["S10"],
    [LOGIN_ADMIN, ENROLL,
     "Make sure the unit already has a recorded mileage and engine hours, for example Mileage 342,417 and Engine hours 6,388. "
     "If it has none, press Enter mileage on its Maintenance tab, type both values and press Save the reading."],
    ["On the asset's Maintenance tab press Enter mileage.",
     "Read the CURRENT side of the window: the mileage and engine hours shown, where each came from and how old each is.",
     "Try to type into the CURRENT values.",
     "Look at the NEW side: check that mileage and engine hours each have a row of their own.",
     "In the NEW mileage field type a slightly higher value, for example 342,900, and press Save the reading.",
     "Read the Mileage card on the Maintenance tab: the value and the date it was recorded."],
    ["The window shows the current mileage and engine hours on the left, read only, each with where it came from and how old it is "
     "(for example 342,417 · Last recorded 29 Aug 2026 · WO S3780-15211).",
     "The new values are typed on the right.",
     "Mileage and engine hours each have their own row.",
     "The saved reading shows the date it was entered (today). It also carries the name of the person who entered it; "
     "if no screen shows that name, record this part as not checked by hand."],
    [Q("S10-R2"), Q("S10-R6"), Q("S10-R4")],
    "The old case opened 'the same dialog from a work order'. Since 5 Oct the work order card opens no reading dialog: work order readings are "
    "typed in the work order's Mileage and Engine Hours fields (S16-R12). S10-R1 ('same component from the asset and from the work order') is still on "
    "the page, so it is held as DIVERGE D1 and dropped from this case until the PO answers. Labels Enter mileage, CURRENT / NEW and Save the reading "
    "are from the Chunk 1 board (frames N5, X1t).")

upd(204105, "A work order reading shows In the shop until invoiced or Mark complete", ["S10"],
    [LOGIN_ADMIN, SCHED, ENROLL,
     "On the asset's Maintenance tab note the Mileage card: its last recorded value and date (for example 342,417, Recorded 29 Aug 2026).",
     NEWWO],
    ["In the asset card at the top of the work order, type a higher value in the Mileage field (for example 346,900) and save it.",
     "Open the asset's Maintenance tab and read the Mileage card.",
     "Back on the work order, open the Finance tab and press Create Invoice. If When was the maintenance done? opens, press Confirm dates. "
     "In the payment window record the payment (do not close it with X: closing an unpaid invoice's payment window removes the invoice).",
     "Read the asset's Mileage card again.",
     "Create a second work order for the same unit, type 347,500 in its Mileage field and save. Expand its Maintenance schedule card, open the PM-A "
     "row's three-dot menu and choose Mark complete; keep On a work order with this work order chosen, keep Reset date as today, press Mark complete.",
     "Read the asset's Mileage card again."],
    ["Before invoicing, 346,900 shows as In the shop (for example Entered today on WO S3780-15904 · fixed on invoice), not as the last recorded "
     "reading; the last recorded reading is still 342,417.",
     "Once the work order is invoiced, 346,900 becomes the last recorded reading.",
     "On the second work order, Mark complete records 347,500 as a reading straight away, with no invoice."],
    [Q("S10-R11")],
    "S10-R11 gained a sentence on 5 Oct: Mark complete on that work order also fixes the reading (S18-R19). Steps and results rewritten to cover it, "
    "with the payment-window warning testers need. In the shop wording from the Chunk 1 board frame P3.",
    anchors_changed=["S10-R11 (sentence added)"])

upd(204106, "Correct a wrong reading by entering the right one; the last one counts", ["S10"],
    [LOGIN_ADMIN, ENROLL,
     "Make sure the unit has a recorded mileage, for example 342,417."],
    ["On the asset's Maintenance tab press Enter mileage, type a wrong value (for example 324,417) and press Save the reading. "
     "It is lower than the last reading, so confirm the warning if one appears.",
     "Read the Mileage card.",
     "Press Enter mileage again, type the right value (for example 342,471) and press Save the reading.",
     "Read the Mileage card."],
    ["After step 1 the card shows 324,417 as the current reading.",
     "After step 3 the card shows 342,471, the last value entered, as the current reading; nothing else (no delete, no edit) is needed to correct it.",
     "Both values are kept in the audit. " + AUDIT_RES],
    [Q("S10-R8"), AUDIT_Q],
    "Old step 'Open the audit / reading history' cannot be carried out: the 5 Oct answers record the audit with no screen in v1 (main page change log; "
    "Chunk 1 S21-N3). Rewritten so the hand-checkable part is checked and the audit part is plainly marked as not checkable by hand (Rule 114).",
    main=True)

upd(204108, "No reading is rejected; an implausible value asks to confirm, then saves", ["S10"],
    [LOGIN_ADMIN, ENROLL,
     "Note the unit's last recorded mileage and engine hours with their date, for example 342,417 and 6,388 on 29 Aug 2026 (38 days before 6 Oct 2026).",
     "Work out the ceilings by hand: mileage 1,500 a day × 38 days = 57,000, so anything above 342,417 + 57,000 = 399,417 is implausible; "
     "engine hours 24 a day × 38 days = 912, so anything above 6,388 + 912 = 7,300 is implausible."],
    ["On the asset's Maintenance tab press Enter mileage, type 350,000 (below the ceiling) and press Save the reading. Then press Undo on the toast.",
     "Press Enter mileage, type 420,000 (above the ceiling) and press Save the reading.",
     "Read the message that appears and note its colour; then confirm it (the spec and the design give no wording for the confirm button).",
     "Read the Mileage card.",
     "Press Enter mileage, type 7,500 engine hours (above the ceiling) and press Save the reading; read the message and confirm it."],
    ["350,000 saves at once with no warning.",
     "420,000 is not rejected: an orange, plainly worded confirmation appears, never red and never blocking; after confirming, it saves and the "
     "Mileage card shows 420,000.",
     "7,500 engine hours behaves the same way.",
     "What counts as implausible is more than 1,500 mileage a day, or more than 24 engine hours a day, since the last reading."],
    [Q("S10-N1"), Q("S10-N2")],
    "S10-N2 gained the implausible-value figures on 5 Oct (1,500 mileage / 24 engine hours a day). Rewritten with worked ceilings (Rule 116).",
    anchors_changed=["S10-N2 (figures added)"])

# ---------------- S11
upd(204126, "A usable pair, and the guards that drop pairs from the rate", ["S11"],
    [LOGIN_ADMIN,
     "Pick a unit that has a mileage-triggered service on a schedule and a reading history you can list: on the QA branch the mileage on past "
     "invoiced work orders is loaded as dated readings, so choose a unit whose Work Orders tab shows at least three invoiced work orders with "
     "Mileage in the last 24 months, at least 7 days apart (for example unit 'ZZAUTOTEST 402').",
     "Open each of those work orders and write down its invoice date and Mileage. Work out by hand which consecutive pairs are usable: at least 7 days "
     "apart, the reading went up, no more than 1,500 a day, no more than a year apart, both readings inside the last 24 months.",
     "Open the unit's Maintenance tab and note the Mileage card's Measured from N visits and its confidence."],
    ["Compare Measured from N visits with your own count of readings that take part in at least one usable pair.",
     "Press Enter mileage and type a value lower than the last reading (for example 1,000 lower); save and confirm. Read the Mileage card. Press Undo.",
     "Press Enter mileage and type a value more than 1,500 a day above the last reading (work it out as in the implausible-value case); save and "
     "confirm. Read the Mileage card. Press Undo.",
     "On a later day, within 7 days of a reading you entered, enter a higher plausible reading and read the Mileage card again.",
     "If the history holds two readings more than a year apart, or readings older than 24 months, check they are left out of your count and of N."],
    ["Measured from N visits matches your hand count of usable pairs from the last 24 months.",
     "A lower reading is kept and shown as the current reading, but N does not grow: that pair is not used for the rate.",
     "A reading more than 1,500 a day above the last one is kept and shown, but N does not grow: that pair is not used for the rate.",
     "A reading less than 7 days after the previous one does not add to N.",
     "Pairs more than a year apart, and readings older than 24 months, are not counted.",
     "Readings dated in the future or in an impossible year are dropped before anything runs; they cannot be entered by hand, so record that part "
     "as not checked by hand."],
    [Q("S11-R23"), Q("S11-R4"), Q("S11-R5"), Q("S11-R6"), Q("S11-R19"), Q("S11-R20")],
    "S11-R19 was rewritten on 5 Oct: one ceiling of 1,500 mileage or 24 engine hours a day replaces 'what that class of unit can plausibly accrue'. "
    "The old steps also asked testers to 'create pairs' with dates they cannot set: the reading window records today only (Plan 1 testability note B5). "
    "Rewritten to use the loaded work-order history plus readings typed today; still depends on blocker B1 for exact dated histories.",
    anchors_changed=["S11-R19 (rewritten)"])

# ---------------- S16
SCHED_AB = (SCHED + " Also add service 'PM-B' with a Calendar trigger of Every 12 months and its own canned lines.")
ENROLL_AB = ("Open Customers > 'ZZAUTOTEST Fleet Co' > Assets, open unit 'ZZAUTOTEST 402' and its Maintenance tab; press Enroll in Schedule, "
             "choose 'ZZAUTOTEST Highway Tractor PM' and enter last service dates: PM-A about seven months ago (for example 6 Mar 2026) and PM-B "
             "a little under a year ago (for example 15 Oct 2025, so it falls due on 15 Oct 2026). Press Enroll. PM-A reads Overdue and PM-B Due soon.")
upd(204136, "Card sits in the asset card, collapsed, with a count badge and nothing else", ["S16"],
    [LOGIN_ADMIN, SCHED_AB, ENROLL_AB, NEWWO],
    ["Open the work order and look at the asset card before expanding anything.",
     "Read the collapsed Maintenance schedule card: note everything it shows besides its badge.",
     "Press Expand and count the rows that read Due soon, Due today or Overdue. Compare with the badge.",
     "Collapse the card again."],
    ["The maintenance card sits inside the asset card and is collapsed when the work order opens.",
     "Collapsed, it carries a badge with the number of services that are due soon, due today or overdue: 2 here (PM-A overdue, PM-B due soon).",
     "The badge stands alone: no service names, dates or other words appear beside it. The design shows the card title Maintenance schedule and the "
     "badge as 2 due; whether those words are allowed is an open product question, so write down exactly what you see and do not fail the case on it.",
     "Because the card stays collapsed, a unit with many due services does not make the work order scroll on and on."],
    [Q("S16-R1"), Q("S16-R2"), Q("S16-E2")],
    "S16-R2 gained 'It carries the badge alone, with no other text' on 5 Oct. The design (frame W2k) still shows 'Maintenance schedule' and '1 due': "
    "held as DIVERGE D2 inside the case rather than resolved from the build.",
    anchors_changed=["S16-R2 (sentence added)"])

upd(204137, "Expanded card: covered services fold in only under a listed coverer", ["S16"],
    [LOGIN_ADMIN,
     "Open Settings > Maintenance and open (or create with New schedule) 'ZZAUTOTEST Highway Tractor PM' with 'PM-A' (Calendar: Every 6 months, "
     "4 canned lines, 2.8 hours) and 'PM-C' (Calendar: Every 12 months) whose Services also covered include PM-A. Save.",
     "Create a second schedule 'ZZAUTOTEST Trailer PM' with one service 'PM-T' (Calendar: Every 12 months, canned lines). Save.",
     "Enroll unit 'ZZAUTOTEST 402' on Highway Tractor PM with last service dates PM-A 6 Mar 2026 and PM-C 1 Sep 2025 (both overdue), and on "
     "Trailer PM with PM-T last done last month (nothing due).",
     "Enroll unit 'ZZAUTOTEST 403' on Highway Tractor PM with PM-A 6 Mar 2026 (overdue) and PM-C last month (not due).",
     "Create a work order for each unit (New Work Order on the customer page)."],
    ["Open the work order for 402, expand the Maintenance schedule card and read every row.",
     "Hover the PM-C row's summary and read what it contains.",
     "Open the work order for 403, expand the card and read every row."],
    ["On 402, PM-C is listed as overdue and PM-A, which PM-C covers, has no row of its own: it is folded into PM-C.",
     "On 402, Trailer PM, which has nothing due, shows its next service, PM-T.",
     "On 403, PM-C is not listed, so PM-A keeps a row of its own.",
     "Each row reads as one summary of line count and hours (for example 4 lines · 2.8 hours) and shows no money."],
    [Q("S16-R3"), Q("S16-R16")],
    "S16-R3 changed on 5 Oct: covered services fold in only 'where that service is also listed, and otherwise kept on rows of their own'. "
    "Rewritten with one unit for each branch.",
    anchors_changed=["S16-R3 (rewritten)"])

upd(204140, "Add Service is a button on every row and opens the Add Service window", ["S16"],
    [LOGIN_ADMIN,
     SCHED + " Also add service 'Visual walk-around' with a Calendar trigger of Every 3 months and no canned lines.",
     "Create a second schedule 'ZZAUTOTEST Trailer PM' with one service 'PM-T' (Calendar: Every 12 months) that has canned lines.",
     "Enroll unit 'ZZAUTOTEST 402' on Highway Tractor PM with last service dates PM-A 6 Mar 2026 and Visual walk-around 1 May 2026 (both overdue), "
     "and on Trailer PM with PM-T last done last month (nothing due).",
     NEWWO, PANEL],
    ["On the PM-A row find Add Service.",
     "Press Add Service and read the window: its title, the summary, the choices it offers and its buttons. Press Cancel.",
     "On the PM-T row (Trailer PM's next service, not yet due) look for Add Service.",
     "On the Visual walk-around row look for Add Service, then open the row's three-dot menu."],
    ["Add Service is a button on the PM-A row and on the PM-T row, even though PM-T is not yet due.",
     "Add Service opens the Add Service window (in the design: Add PM-A to S3780-15904, 4 lines · 2.8 hours) offering this work order or a new "
     "one (in the design: Add to this work order and Create a new work order instead), with Cancel and Add.",
     "The window shows no money.",
     "Visual walk-around, which has no canned lines, has no Add Service; its three-dot menu offers Mark complete alone."],
    [Q("S16-R8"), Q("S16-R9"),
     Q("S16-R16", "It carries no money: no total on the row, in the hover card of S16-R7 or in the Add Service modal")],
    "S16-R8 was rewritten on 5 Oct: Add Service is a button that opens the Add Service modal offering this work order or a new one (it was 'the "
    "existing inline add pattern'). Window labels from the Chunk 2 board frame W2a; the tech plan names them differently (DIVERGE D6).",
    anchors_changed=["S16-R8 (rewritten)"])

upd(204141, "Add a compliance certificate, or enroll the unit, from the work order card", ["S16"],
    [LOGIN_ADMIN,
     "Open Settings > Maintenance; make sure 'ZZAUTOTEST Highway Tractor PM' also holds a compliance service 'CVIP' with a 12-month term. Save.",
     "Enroll unit 'ZZAUTOTEST 402' on that schedule (no CVIP certificate on file). Make sure unit 'ZZAUTOTEST 403' is on no schedule.",
     "Create a work order for each unit (New Work Order on the customer page)."],
    ["Open the work order for 402, expand the Maintenance schedule card and find the way to add a certificate for CVIP "
     "(the spec and the design give no wording for it).",
     "Add a certificate: Number C-448210, Start date today, Term 12 months; check End date fills in, then save.",
     "Open the asset's Maintenance tab and read CVIP's due date.",
     "Open the work order for 403 and read the Maintenance schedule card.",
     "Press the enrol action and read the window that opens; press Cancel."],
    ["A compliance certificate can be added from the work order card, just as from the asset.",
     "After saving, End date is today plus 12 months, and the asset shows CVIP due on that End date.",
     "For 403, which is on no schedule, the card offers to enroll it (spec wording Enroll in Schedule; the design shows Not on a maintenance schedule "
     "with Enroll in a schedule — record the wording you see).",
     "It opens the same enrolment window as the asset's Maintenance tab."],
    [Q("S16-R10"), Q("S16-R11")],
    "Quotes still match, but the old plain result and step named a requirement id ('(S7)') and the steps were not click-by-click (Rules 7/9/114). "
    "The enrol wording differs between spec and design (DIVERGE D8).")

upd(204142, "Readings go in the work order's Mileage field; the card updates at once", ["S16"],
    [LOGIN_ADMIN,
     "Open Settings > Maintenance and add to 'ZZAUTOTEST Highway Tractor PM' a service 'PM-M' with a Distance trigger set At 350,000 mileage and "
     "canned lines. Save.",
     "Enroll unit 'ZZAUTOTEST 403', whose last recorded mileage is 342,417, on that schedule. Note on its Maintenance tab the Mileage card's rate "
     "and confidence (for example 640 a week, High confidence).",
     "Enroll unit 'ZZAUTOTEST 404', which has never had a mileage recorded, on the same schedule.",
     "Create a work order for each unit (New Work Order on the customer page)."],
    ["Open the work order for 404 and expand the Maintenance schedule card. Read the PM-M row. Look for any reading button or reading window on "
     "the card.",
     "Open the work order for 403, expand the card and read the PM-M row.",
     "In the asset card's Mileage field type 350,100 and save it.",
     "Without reloading, read the Maintenance schedule card again.",
     "Open the asset's Maintenance tab and read the Mileage card's rate and confidence."],
    ["The card has no reading button and opens no reading window of its own; readings are typed in the work order's Mileage and Engine Hours "
     "fields above it.",
     "On 404 the PM-M row reads Needs mileage reading and points to the Mileage field (in the design: Needs mileage reading · enter it in Mileage above).",
     "On 403, as soon as 350,100 is saved the card updates and shows that PM-M has just become due (the spec gives no wording for this notice: record "
     "the words you see).",
     "The In the shop value 350,100 is enough to make PM-M due at once.",
     "The rate and the confidence on the asset's Mileage card do not change until the work order is invoiced."],
    [Q("S16-N1"), Q("S16-R12"), Q("S16-E1")],
    "S16-R12 and S16-E1 were rewritten on 5 Oct: work order readings are typed in the work order's existing Mileage and Engine Hours fields, the "
    "card opens no reading dialog, a missing reading reads Needs mileage / engine hours reading, and an In the shop value makes a service due at once "
    "without moving the rate. The old case opened 'the same dialog as the asset' from the work order. Design label from frame W2r.",
    anchors_changed=["S16-R12 (rewritten)", "S16-E1 (sentences added)"])

upd(204147, "Add Service at another location copies the work at this location's rates", ["S16"],
    [LOGIN_ADMIN + " The organization has two locations, for example 'Calgary South' (where the schedule is built) and 'Lethbridge'.",
     "At Calgary South, in Settings > Maintenance, give PM-A of 'ZZAUTOTEST Highway Tractor PM' these canned lines: 'Engine oil and filter change' "
     "with labour type Mechanical, 1.2 hours, tech time 1.0 and two parts; 'Chassis lubrication' fixed price; 'Air filter inspection' with a labour type "
     "that does not exist at Lethbridge, 0.3 hours; 'Brake adjustment check' with no labour type.",
     "At Lethbridge note the labour rates: Mechanical (for example $160.00 an hour) and the default labour type (for example $145.00 an hour).",
     "Enroll unit 'ZZAUTOTEST 402' on that schedule so PM-A reads Overdue.",
     "In the header choose Lethbridge, then create a work order for the unit (New Work Order)."],
    ["Expand the Maintenance schedule card and read the PM-A row and its (i).",
     "Press Add Service, read the window's preview, and press Add.",
     "Open the Lines tab and read each new line: name, description, hours, tech time, labour type, rate, price, parts and its line note."],
    ["The row reads exactly as at Calgary South (for example PM-A, Overdue · Aug 2026, 4 lines · 2.8 hours, Add Service) with an (i): PM-A's lines "
     "were set up at Calgary South. We add the same work here at Lethbridge's rates. Parts are not added; each line's note lists the parts Calgary "
     "South uses, for reference.",
     "The Add Service preview lists no parts.",
     "Four new lines carry the same names, descriptions, hours and tech time; no parts are added and no Calgary South price is copied.",
     "'Engine oil and filter change' takes Lethbridge's Mechanical rate: 1.2 × $160.00 = $192.00.",
     "'Air filter inspection' takes Lethbridge's default labour type: 0.3 × $145.00 = $43.50.",
     "'Chassis lubrication', fixed price at Calgary South, is priced the same way here.",
     "'Brake adjustment check', with no labour type at Calgary South, is copied with none and is not priced."],
    [Q("S16-R21"), Q("S16-R24"), Q("S16-N6"), Q("S16-R22")],
    "S16-R22 gained two sentences on 5 Oct: the copied line carries the home line's tech time, and a home line with no labour type is copied with none "
    "and not priced. Rewritten with worked prices (Rule 116).",
    anchors_changed=["S16-R22 (sentences added)"])

upd(204149, "Add Service toast with Undo; Remove until invoiced; no line is deleted", ["S16"],
    [LOGIN_ADMIN, SCHED, ENROLL, NEWWO, PANEL],
    ["Press Add Service on PM-A, then Add. Read the toast straight away.",
     "Press Undo on the toast. Read the PM-A row and the Lines tab.",
     "Press Add Service and Add again. Wait until the toast has gone, then open the PM-A row's three-dot menu.",
     "On the Lines tab delete two of PM-A's lines by hand. Read the PM-A row.",
     "Open the PM-A row's three-dot menu and press Remove. Read the row and the Lines tab.",
     "Open the Finance tab, press Create Invoice and record the payment. Then open the asset's Maintenance tab.",
     "On another work order where PM-A was added and which has since been invoiced, open the PM-A row's three-dot menu."],
    ["After Add, a toast reads PM-A added · 4 lines with Undo, and stays as long as the application's toasts normally stay.",
     "Undo returns the row to Add Service; the 4 lines stay on the Lines tab.",
     "Once the toast has gone, the row's three-dot menu offers Remove.",
     "Deleting PM-A's lines by hand leaves PM-A addressed on this work order: the row still reads Added · 4 lines.",
     "Remove does the same as Undo: the row returns to Add Service and the remaining lines stay.",
     "Because PM-A was removed, invoicing does not list it in When was the maintenance done?, and PM-A is still due on the asset's Maintenance tab.",
     "On the invoiced work order, the menu does not offer Remove."],
    [Q("S16-R25", "After Add Service a toast reads PM-A added · 4 lines, with Undo, for as long as the application's toasts stay. Once it is gone, the "
       "row's three-dot menu offers Remove, for an Add Service made by mistake, until the work order is invoiced. Undo and Remove do the same: the row "
       "returns to Add Service and is no longer addressed on this work order, so the step after invoicing does not list it. Neither deletes a line. The "
       "lines already added stay on the work order, as any line does, and are deleted by hand, per S16-N4, because a line's own state decides whether "
       "it can be deleted."), Q("S16-N4")],
    "S16-R25 gained two sentences on 5 Oct (no Remove after a reset; adding again re-attaches surviving lines). This case keeps the toast / Undo / "
    "Remove part with click-by-click steps; the two new sentences get their own new case (N12).",
    anchors_changed=["S16-R25 (sentences added)"])

upd(204151, "Splitting a work order and merging assets keep services and history", ["S16"],
    [LOGIN_ADMIN, SCHED + " Also add service 'PM-B' (Calendar: Every 12 months) with no canned lines.",
     "Enroll units 'ZZAUTOTEST 402' and 'ZZAUTOTEST 403' so PM-A and PM-B read Overdue.",
     "Create work order W1 for 402 and press Add Service > Add on PM-A (4 lines). Create work order W2 for 403 and do the same. On W2 also open "
     "PM-B's three-dot menu and use Mark complete with On a work order (W2) and Reset date today.",
     "Enroll two more units, 'ZZAUTOTEST 405' and 'ZZAUTOTEST 406', on the same schedule; mark PM-A complete on 405 with Reset date 1 Sep 2026 "
     "and on 406 with Reset date 1 Oct 2026. Give 406 a mileage reading and a CVIP certificate if the schedule has one."],
    ["On W1 use the work order's existing split action and move all four PM-A lines to the new work order. Expand the card on both work orders.",
     "On W2 split again, moving only two of PM-A's lines. Expand the card on both work orders.",
     "Merge 405 and 406 with the existing asset merge, keeping 405. Open 405's Maintenance tab."],
    ["When all of PM-A's lines move, PM-A goes with them: the new work order's card reads Added · 4 lines and the original no longer does.",
     "When only some of its lines move, PM-A stays with the original work order.",
     "PM-B, marked complete on W2, stays with the original work order.",
     "After the merge, 405 holds both units' enrolments, readings, certificates and history; where both were on the same schedule, the enrolment "
     "with the later completion (406's, counting from 1 Oct 2026) is the one that stays."],
    [Q("S16-E3"),
     PQ("Plan 2 §1 NFR-114", "WO split: an open lines link moves to the new WO when every remaining line it added moved there; otherwise it stays; "
        "no_lines and mark_complete links stay with the original", "plan2")],
    "Quote still matches, but a partial split was untestable as written. The tech plan (NFR-114) adds the testable rule for a partial split. Steps now "
    "click-by-click. The split and merge actions' on-screen names are not in the spec or design.",
    plan="section 1, Analysis-introduced requirements, NFR-114")

# ---------------- S17
upd(204152, "The card offers this or a new work order; elsewhere only Create work order", ["S17"],
    [LOGIN_ADMIN, SCHED,
     "Enroll units 'ZZAUTOTEST 402' and 'ZZAUTOTEST 403' so PM-A reads Overdue on both.",
     NEWWO, PANEL],
    ["On the PM-A row press Add Service and read the destination choices.",
     "Choose Create a new work order instead and press Add. Open the new work order's Lines tab.",
     WORKLIST + " Find the PM-A row for 403 and read the actions it offers.",
     "Open unit 403's Maintenance tab and read the actions on the PM-A row."],
    ["From the work order card, Add Service offers this work order or a new one (in the design: Add to this work order and Create a new work order "
     "instead).",
     "Choosing a new work order creates one that carries PM-A's 4 canned lines.",
     "The worklist row and the asset's Maintenance tab offer Create work order only, with no choice of an existing work order."],
    [Q("S17-R1"), Q("S17-R2")],
    "S17-R1 was rewritten on 5 Oct: the choice is offered from the work order card only; the worklist and the asset tab offer Create work order only. "
    "The old step also cited a requirement id ('per S16-N6').",
    anchors_changed=["S17-R1 (rewritten)"])

upd(204154, "Adding a service writes one internal note naming the service and schedule", ["S17"],
    [LOGIN_ADMIN, SCHED, ENROLL, NEWWO, PANEL],
    ["Press Add Service on PM-A, then Add.",
     "Open the work order's Notes tab and read the new note.",
     "Check how the note is marked and whether the customer received any email."],
    ["The Notes tab gains one short note: PM-A added from ZZAUTOTEST Highway Tractor PM. It does not mention copying.",
     "The note is internal (in the design: Internal · not visible to the customer) and no email goes to the customer.",
     "Adding also writes an audit entry with who did it and when. " + AUDIT_RES],
    [Q("S17-R5"), Q("S17-R6"), AUDIT_Q],
    "Old step 'Open the audit and find the entry' cannot be carried out: no screen shows the audit in v1 (5 Oct answers). Rewritten so the audit part is "
    "plainly marked as not checkable by hand (Rule 114).",
    main=True)

# ---------------- S18
upd(204168, "Mark complete: toast with Undo, Completed row, worklist rest until due soon", ["S18"],
    [LOGIN_ADMIN,
     "Open Settings > Maintenance; in 'ZZAUTOTEST Highway Tractor PM' add service 'Annual check' with a Calendar trigger of Every 12 months; note its "
     "first reminder row (for example 14 days before). Save.",
     "Enroll units 'ZZAUTOTEST 402' and 'ZZAUTOTEST 403' with Annual check last done 13 months ago, so it reads Overdue on both."],
    ["On 402's Maintenance tab open the Annual check row's three-dot menu and choose Mark complete. Choose Completed elsewhere, set Reset date to "
     "today and press Mark complete.",
     "Read the toast.",
     "Read the row and open its three-dot menu.",
     WORKLIST + " Look for 402's Annual check row.",
     "On 403 use Mark complete the same way, but set Reset date to 12 months ago less 10 days (for example 16 Oct 2025, so the next due is 16 Oct 2026).",
     "Look for 403's Annual check row on the worklist."],
    ["A toast reads Annual check marked complete · next due counts from <today> (for example 6 Oct 2026), with Undo.",
     "The row reads Completed · next due counts from <today>, and its three-dot menu offers Undo complete.",
     "402's Annual check row leaves the worklist (its next cycle is 12 months away).",
     "403's next cycle (16 Oct 2026) already falls inside its first reminder row, so its row is on the worklist reading due soon."],
    [Q("S18-R17")],
    "S18-R17 changed on 5 Oct: the worklist row returns when its next cycle reads due soon. Rewritten with one unit for each branch, using a past "
    "Reset date so the return can be seen without waiting.",
    anchors_changed=["S18-R17 (rewritten)"])

upd(204170, "Early completion needs no confirmation; serviced Monday, invoiced later", ["S18"],
    [LOGIN_ADMIN, SCHED,
     "Make sure the schedule also holds a compliance service 'CVIP' (12-month term), and that unit 'ZZAUTOTEST 402' is enrolled with a CVIP "
     "certificate ending in about four months (for example End date 14 Feb 2027).",
     "Enroll unit 'ZZAUTOTEST 403' so PM-A reads Overdue. Create a work order for 403, press Add Service > Add on PM-A, and complete every PM-A line "
     "on the Lines tab."],
    ["On 402's Maintenance tab open CVIP's three-dot menu, choose Mark complete, choose Completed elsewhere, Reset date today, Start date today, "
     "Term 12 months, and press Mark complete. Watch for any warning or extra confirmation.",
     "On 403's work order press Mark complete on the PM-A row (its button now). Keep On a work order with this work order chosen and set Reset date "
     "to a Monday about three weeks ago (for example Mon 14 Sep 2026). Press Mark complete.",
     WORKLIST + " Look for 403's PM-A row. Open 403's Maintenance tab and read PM-A.",
     "Back on the work order open the Finance tab, press Create Invoice and record the payment. Watch whether When was the maintenance done? lists PM-A.",
     "Read 403's PM-A on the Maintenance tab again."],
    ["Completing CVIP four months early shows no warning and asks for no confirmation.",
     "PM-A reads next due counts from 14 Sep 2026, so with Every 6 months its next due is Mar 2027.",
     "The worklist shows nothing due for 403's PM-A.",
     "Invoicing later changes nothing: the step after invoicing does not list PM-A (it was already reset), and PM-A still counts from 14 Sep 2026."],
    [Q("S18-E1"), Q("S18-E8"),
     Q("S18-R8", "A service already reset by Mark complete is not listed: a service resets once")],
    "S18-E2 and S18-E3 were rewritten on 5 Oct and now say the opposite of the old case (a credit memo changes nothing; a voided pending invoice is "
    "treated like a reversal). This case keeps early completion and serviced-Monday-invoiced-later; reversal and void get new cases N13 and N14.",
    anchors_changed=["S18-E2 (rewritten)", "S18-E3 (rewritten, meaning reversed)"])

# ---------------- S19
upd(204172, "Send reminder opens the send email window with every contact listed", ["S19"],
    [LOGIN_ADMIN, SCHED, ENROLL, CONTACT,
     "Give the customer two more contacts: 'Lisa Brabay' with an email address you can read, and 'Sam Brabay' with no email address.",
     QA_MAIL],
    [WORKLIST + " On unit 402's row press Contact, then press Send reminder on the contact card.",
     "Read the window's title and the Send to list.",
     "Check who is ticked, and try to tick Sam Brabay.",
     "Next to Sam Brabay press Add email; in Email for Sam Brabay type an address you can read and press Save. Try to tick Sam again.",
     "Find the Optional emails field and type one more address you can read.",
     "Press Cancel. Open the customer's Contacts tab and read Sam Brabay's details."],
    ["Send reminder opens the application's existing Send email window.",
     "Send to lists every contact of the customer, each with a checkbox. Dave Brabay, the unit's preferred contact, is ticked and marked Preferred "
     "contact; Lisa Brabay is listed unticked.",
     "Sam Brabay, who has no email, is listed unticked, cannot be ticked, and shows No email with Add email.",
     "After Add email and Save, Sam Brabay can be ticked, and the address is saved on Sam's contact.",
     "The Optional emails field takes further addresses."],
    [Q("S19-R3")],
    "S19-R3 was rewritten on 5 Oct: every contact is listed, a contact without email shows No email with Add email. Labels from the Chunk 1 board "
    "frames B5, B5l and B5m.",
    anchors_changed=["S19-R3 (rewritten)"])

upd(204174, "The email lists every service the worklist shows for the unit, with its state", ["S19"],
    [LOGIN_ADMIN,
     "Open Settings > Maintenance and create a schedule 'ZZAUTOTEST Email PM' with four Calendar services: 'PM-A' Every 12 months, 'PM-B' Every 6 "
     "months, 'PM-C' Every 12 months and 'PM-D' Every 12 months. Save.",
     "Enroll unit 'ZZAUTOTEST 402' with last service dates (examples for 6 Oct 2026): PM-A 6 Sep 2025 (overdue since 6 Sep 2026), PM-B 6 Apr 2026 "
     "(due today), PM-C 6 Dec 2025 (due 6 Dec 2026, 61 days away) and PM-D 6 Feb 2026 (due 6 Feb 2027, 123 days away).",
     CONTACT, QA_MAIL],
    [WORKLIST + " Note which of 402's services it lists.",
     "On 402's row press Contact, then Send reminder. Read the Reminder table in the Send email window.",
     "Press Send. Open the email in the mailbox and read its table."],
    ["The worklist lists PM-A, PM-B and PM-C for 402, and not PM-D.",
     "One email lists the same three services, PM-A, PM-B and PM-C, and not PM-D, which is more than 91 days away.",
     "Each row names the unit, the service and when it is due, with its state: PM-A Past due, PM-B Due today, PM-C Coming up.",
     "PM-A (overdue) and PM-B (due today) travel in the one email, each with its own state."],
    [Q("S19-R5"), Q("S19-R6"), Q("S19-R8")],
    "S19-R6 and S19-R7 were rewritten on 5 Oct: the email carries what the worklist shows (overdue, due today, next 91 days), no longer 'what is "
    "inside its reminder window'. The 'next two upcoming' branch of S19-R7 gets its own new case (N9).",
    anchors_changed=["S19-R6 (rewritten)", "S19-R7 (rewritten)"])

upd(204175, "Due month where the date is sound; Soon for a Low date; no confidence words", ["S19", "S11"],
    [LOGIN_ADMIN, CONTACT,
     "Unit 'ZZAUTOTEST 402' is enrolled with a Calendar service 'PM-C' due in about two months (for example last done 6 Dec 2025, due Dec 2026).",
     "It also has a mileage-triggered service whose due date on the worklist shows a month with Low confidence beneath it, inside the next 91 days "
     "(for example a unit whose last mileage reading is more than six months old). If no such unit exists, mark this case Blocked and report it.",
     QA_MAIL],
    [WORKLIST + " Read 402's rows: PM-C's month, and the meter row's month with Low confidence.",
     "Press Contact, then Send reminder; read the Reminder table. Press Send and read the email."],
    ["PM-C, a calendar date, shows its due month (for example Dec 2026).",
     "The row whose date has Low confidence reads Soon instead of a month.",
     "The words Low, Medium, High and confidence appear nowhere in the email.",
     "Whether a High or Medium meter estimate shows its month or Soon is an open product question: write down what you see and do not pass or fail "
     "the case on it."],
    [Q("S19-R9"), Q("S11-N1")],
    "S19-R9 was rewritten on 5 Oct: Soon for every guessed date, every Low date included, and never any confidence wording (it used to show 'Low "
    "confidence where it applies'). What counts as a 'guess' beyond Low is held as DIVERGE D3; a day versus a month for certificates and due today is "
    "DIVERGE D4.",
    anchors_changed=["S19-R9 (rewritten)"])

upd(204177, "Greeting names one or two people, else Hello; invoice-style signature", ["S19"],
    [LOGIN_ADMIN, SCHED, ENROLL, CONTACT,
     "Give the customer two more contacts with email addresses you can read: 'Lisa Brabay' and 'Tom Brabay'.",
     "The location chosen in the header has a telephone number (for example 403-252-7710). A second location of the organization has no telephone "
     "(blank).", QA_MAIL],
    [WORKLIST + " On 402's row press Contact, then Send reminder. With only Dave Brabay ticked, read the greeting in Email content.",
     "Tick Lisa Brabay too and read the greeting.",
     "Tick Tom Brabay too and read the greeting.",
     "Untick Lisa and Tom, type another address in Optional emails, and read the greeting.",
     "Press Send. Open the email and read the greeting, the call to action and the signature.",
     "In the header choose the location with no telephone, send the reminder again, and read the email."],
    ["One person ticked: the email opens Hi Dave Brabay,",
     "Two people ticked: Hi Dave Brabay and Lisa Brabay,",
     "Three or more ticked: Hello,",
     "A typed address does not change the greeting: it stays Hi Dave Brabay,",
     "The signature is the invoice email's: Best regards, your name, the organization's name and the header location's telephone "
     "(for example Northline Heavy Duty · 403-252-7710).",
     "The call to action asks the customer to call.",
     "From the location with no telephone, the call to action is left out rather than printed with nothing after it."],
    [Q("S19-R19"), Q("S19-R21")],
    "S19-R19 was rewritten on 5 Oct: one or two names, otherwise Hello; a typed address does not change the greeting (it used to be 'the chosen "
    "contact's first and last name'). Two-names wording from the Chunk 1 board frame B5b.",
    anchors_changed=["S19-R19 (rewritten)"])

upd(204179, "Setting off blocks every send; a send updates Last sent; no bounces", ["S19"],
    [LOGIN_ADMIN, SCHED,
     "Enroll units 'ZZAUTOTEST 402' and 'ZZAUTOTEST 403' of 'ZZAUTOTEST Fleet Co' so each has something due.", CONTACT, QA_MAIL],
    [WORKLIST + " On 402's row press Contact, then Send reminder, then Send. Read the toast and the contact card.",
     "Open the customer 'ZZAUTOTEST Fleet Co', switch Send preventive maintenance notifications off and save.",
     "On the worklist open Contact for 402 and for 403; look at Send reminder on each.",
     "Switch the setting back on."],
    ["After sending, a toast confirms it (in the design: Reminder sent to Dave Brabay) and the contact card shows Last sent with today's date "
     "(for example Last sent 6 Oct 2026).",
     "With the setting off, Send reminder is unavailable for both units, because the setting lives on the customer record, not on the unit or its "
     "enrolment.",
     "The send is also recorded in the audit with the message, the recipients, the sender and the time. " + AUDIT_RES,
     "Nothing reports a bounced reminder."],
    [Q("S19-N3"), Q("S19-R14"), Q("S19-E4"), AUDIT_Q],
    "Old step 'Send a reminder and open the audit' cannot be carried out: no screen shows the audit in v1 (5 Oct answers). Rewritten so the audit part "
    "is plainly marked as not checkable by hand (Rule 114). Toast and Last sent wording from the Chunk 1 board frame B1r.",
    main=True)

# ---------------- S22
upd(204119, "Work orders from a due service or Add Service show the Maintenance schedule", ["S22"],
    [LOGIN_ADMIN, SCHED, "Enroll units 'ZZAUTOTEST 402' and 'ZZAUTOTEST 403' so PM-A reads Overdue on both."],
    [WORKLIST + " On 402's PM-A row press Create work order. Note the new work order's number.",
     "On the customer page press New Work Order for 403 (a hand-made work order). Expand its Maintenance schedule card, press Add Service on PM-A, "
     "keep Add to this work order and press Add. Note its number.",
     "Open Work Orders and find the Maintenance schedule column. Read it on both work orders' rows.",
     "Click the schedule name on one of the rows."],
    ["Both work orders show 'ZZAUTOTEST Highway Tractor PM' in the Maintenance schedule column: the one created from the due service, and the "
     "hand-made one to which Add Service added PM-A.",
     "The name is a link that opens that schedule."],
    [Q("S22-R1"), Q("S22-R2", "The Work Orders list will gain a Maintenance schedule column, naming the schedule and linking to it where the work "
                    "order came from one")],
    "S22-R1 was rewritten on 5 Oct: a work order also carries the origin when Add Service added a service to it. The design capitalises the column "
    "as Maintenance Schedule (frame W14).",
    anchors_changed=["S22-R1 (rewritten)"])

upd(204122, "From maintenance filter: count and total of every matching work order", ["S22"],
    [LOGIN_ADMIN, SCHED, "Enroll units 'ZZAUTOTEST 402' and 'ZZAUTOTEST 403' so PM-A reads Overdue on both.",
     "Create work order X from the worklist (Create work order on 402's PM-A row) and add one extra hand-typed line to it (for example 1 hour of labour). "
     "Note X's Total.",
     "Create work order Y for 403 by hand and press Add Service > Add on PM-A. Note Y's Total.",
     "Create work order Z for 403 by hand with one hand-typed line and no service. Note it."],
    ["Open Work Orders, search for 'ZZAUTOTEST Fleet Co' and turn on the From maintenance filter.",
     "Read the line above the list.",
     "Work out by hand: the count of X and Y, and X's Total plus Y's Total.",
     "Clear the search, keep From maintenance on, and read the line. Scroll down until more pages load, and read it again."],
    ["With both filters on, the line reads 2 work orders · $<X + Y> · Work order total; for example with X $1,050.40 and Y $620.00 it reads "
     "2 work orders · $1,670.40 · Work order total.",
     "Z, with no maintenance origin, is not counted.",
     "The total uses each work order's whole total, including the hand-typed line on X, not only the lines PM-A added.",
     "With only From maintenance on, the count and the total cover every matching work order across all pages: they do not change as more pages load."],
    [Q("S22-R4"), Q("S22-E2")],
    "S22-R4 was rewritten on 5 Oct: a From maintenance filter and a count-and-total line ('Origin and value will be reportable together' is gone). "
    "Rewritten with a hand-computed total (Rule 116). Wording of the line from the spec and the Chunk 2 board frame W14.",
    anchors_changed=["S22-R4 (rewritten)"])
