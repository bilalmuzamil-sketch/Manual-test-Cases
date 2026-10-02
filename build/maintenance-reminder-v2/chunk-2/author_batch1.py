# -*- coding: utf-8 -*-
"""Chunk-2 batch 1: S10 (26636), S12 (26638), S22 (26643)."""
import sys,os
sys.path.insert(0,os.path.dirname(__file__))
import mr2_lib as M

# ============================== S10 — Enter a reading (26636) ==============================
S10="SV-10567"; L10="S10, Enter a reading"; P10="Part 2 / S10"
pre_asset=["You are signed in as a user with View and edit customers, on the build under test. The Maintenance Reminders feature is on for the shop (it ships behind the maintenance_reminders flag).",
 "An asset exists that has a mileage and engine-hours history (e.g. unit 'ZZAUTOTEST Truck 12').",
 "Open the asset's Maintenance tab; a work order carrying the same asset is also available."]
M.add(26636,"Reading dialog: same from asset and work order, current vs new, per meter",S10,L10,P10,
 pre_asset,
 ["Open the reading dialog from the asset Maintenance tab.","Note the left side (current) and the right side (new).",
  "Note the separate rows for distance and engine hours.","Open the same dialog from a work order and confirm it is the same component.",
  "Enter and save a reading, then check it records when it was entered and by whom."],
 ["The reading dialog is the same component whether opened from the asset or from the work order.",
  "The left side shows the current value, read-only, with its source and age; the right side is where the new value is entered.",
  "Distance and engine hours each have their own row.",
  "A saved reading carries a timestamp and the author's name."],
 [("S10-R1","The reading dialog will be the same component from the asset and from the work order"),
  ("S10-R2","It will show current on the left, read only with its source and age, and new on the right"),
  ("S10-R6","Distance and engine hours will each have their own row"),
  ("S10-R4","A reading will carry a timestamp and an author")])
M.add(26636,"Saving re-evaluates thresholds at once; undo offered; returns to the tab",S10,L10,P10,
 pre_asset,
 ["Enter a new reading and Save.","Watch the services and thresholds on the maintenance tab.",
  "Look for an undo control after saving.","Note where the dialog returns to and whether it forecasts anything."],
 ["Saving re-evaluates every dependent threshold immediately, not overnight.",
  "An undo appears after saving.",
  "The reading modal forecasts nothing; saving returns to the maintenance tab, which already shows every service the reading moved."],
 [("S10-R5","Saving will re-evaluate every dependent threshold immediately, not overnight"),
  ("S10-R7","An undo will appear after saving"),
  ("S10-N4","The reading modal forecasts nothing. Saving returns to the maintenance tab, which already shows every service the reading moved, with room to show it properly")])
M.add(26636,"Every reading stored dated with its source; latest entered is current",S10,L10,P10,
 pre_asset,
 ["Enter readings from different sources (from the asset, and from a work order).","Open the reading history.",
  "Enter a value lower than the last one and save.","Check the current reading and the history."],
 ["Every change to mileage or engine hours is stored as a dated reading with its source (work order, asset, customer portal, import or API).",
  "The last value entered is the current reading, even when it is lower.",
  "A lower value is flagged, and both the lower and the previous value stay in history."],
 [("S10-R10","Every change to an asset's mileage or engine hours is stored as a dated reading with its source: work order, asset, customer portal, import or API. A value on an open work order shows In the shop until that work order is invoiced, per S10-R11. The last value entered is the current reading, even when it is lower; a lower value is flagged and both stay in history"),
  ("S10-N3","A value lower than the last one saves, is flagged, and both values stay in history")])
M.add(26636,"A reading on an open work order shows 'In the shop' until invoiced",S10,L10,P10,
 pre_asset,
 ["On an open (not yet invoiced) work order carrying the asset, enter a reading and save.",
  "Look at how that value is labelled on the asset and in the history.","Invoice the work order and look again."],
 ["A reading entered on an open work order shows as 'In the shop' rather than recorded, until that work order is invoiced.",
  "The invoice is what fixes it into the recorded history; until then the shop can see the value but the history does not yet carry it."],
 [("S10-R11","A reading entered on an open work order shows as In the shop rather than recorded, until that work order is invoiced. The invoice is what fixes it, per S10-R10, so between the two there is a value the shop can see and the history does not yet carry")])
M.add(26636,"Correcting a wrong reading: enter the right one; both stay in the audit",S10,L10,P10,
 pre_asset,
 ["Enter a wrong reading and save.","Enter the correct reading and save.","Open the audit / reading history."],
 ["A wrong reading is corrected simply by entering the right one; the last value entered becomes the current reading.",
  "Both the wrong value and the corrected value stay in the audit."],
 [("S10-R8","A wrong reading is corrected by entering the right one: the last value entered is the current reading, per S10-R10, and both values stay in the audit, per S21-R4")])
M.add(26636,"The field reads Mileage; the unit is written in full, never mi or km",S10,L10,P10,
 pre_asset,
 ["Open the reading dialog and read the distance field label.","Find anywhere a value names its distance unit."],
 ["The distance field reads 'Mileage'.",
  "Where a value names its unit it reads 'mileage' in full, never 'mi' or 'km'."],
 [("S10-R9","The field reads `Mileage`. Where a value names its unit it reads `mileage` in full, never `mi` or `km`")])
M.add(26636,"No value is rejected; an implausible value warns orange and saves on confirm",S10,L10,P10,
 pre_asset,
 ["Enter an ordinary value and save.","Enter an implausible value (e.g. far above the last reading) and save.",
  "Read the confirmation shown, then confirm it."],
 ["No reading value is ever rejected by validation.",
  "An implausible value shows an orange, plainly-worded confirmation and saves on confirm - never red, never blocking."],
 [("S10-N1","No reading value is ever rejected by validation"),
  ("S10-N2","An implausible value shows an orange, plainly worded confirmation and saves on confirm. Never red, never blocking")])
M.add(26636,"No telematics in v1: readings entered by hand or taken from a work order",S10,L10,P10,
 pre_asset,
 ["Review how a reading can be entered in v1 (by a person, or taken from a work order).",
  "Confirm there is no live telematics feed and no projected figure presented as a fact."],
 ["There is no live telematics feed in v1.",
  "Every reading is entered by a person or taken from a work order, so no projected figure is ever printed as a fact."],
 [("S10-N5","There is no live telematics feed in v1. Every reading is entered by a person or taken from a work order, which is why no projected figure is ever printed as a fact")])
M.add(26636,"Reading edge cases: gauge vs ECU, engine swap, correction, same-day",S10,L10,P10,
 pre_asset,
 ["Enter a gauge reading and an ECU reading that disagree.","On a unit after an engine swap, enter a low engine-hours value.",
  "Correct an earlier reading and watch the rate, thresholds and queued reminders.","Enter two readings on the same day."],
 ["A gauge and an ECU may legitimately disagree; if the gauge was ever replaced they cannot be synced.",
  "A replacement engine resets the hours (a 2019 unit reading 11 engine hours the week after a swap is expected).",
  "A correction recomputes the rate from stored pairs and moves every threshold and queued reminder.",
  "With two readings on the same day the rate takes the higher one, while the display keeps the last entered."],
 [("S10-E1","A gauge and an ECU legitimately disagree. If the gauge was ever replaced they cannot be synced"),
  ("S10-E2","A replacement engine resets the hours. A 2019 unit showing 11 engine hours is expected the week after a swap"),
  ("S10-E3","A correction recomputes the rate from stored pairs and moves every threshold and queued reminder"),
  ("S10-E4","Two readings on the same day: the rate takes the higher one. Display keeps the last entered")])

# ============================== S12 — Due date resolution (26638) ==============================
S12="SV-10569"; L12="S12, Due date resolution"; P12="Part 2 / S12"
pre12=["You are signed in as a user with View customers, on the build under test. The Maintenance Reminders feature is on (maintenance_reminders flag).",
 "An asset is enrolled on a schedule whose service has more than one active trigger (e.g. a calendar interval and a mileage 'At' target), e.g. unit 'ZZAUTOTEST Truck 12'.",
 "Open the asset's Maintenance tab (the worklist and a work order's maintenance panel show the same rows)."]
M.add(26638,"Each trigger proposes a candidate; the earliest wins as the Due date",S12,L12,P12,
 pre12,
 ["Find the service that has more than one trigger.","Read the Due cell.","Open the row menu and read the other candidates."],
 ["Every active trigger proposes a candidate date.","Due is the earliest candidate.",
  "The Due cell shows that earliest candidate with its trigger; the row menu lists every other candidate with its date and trigger."],
 [("S12-R1","Every active trigger will propose a candidate date"),("S12-R5","Due will be the earliest candidate"),
  ("S12-R7","Within one service, its triggers' candidates resolve to the earliest per S12-R5. The Due cell shows that one with its trigger per S9-R12, and the row menu lists every other candidate with its date and trigger. Rows are never merged across services on the asset tab, the worklist or the panel")])
M.add(26638,"Calendar always proposes a date; a meter in No data proposes nothing",S12,L12,P12,
 pre12,
 ["On a unit with no usable meter history (No data), read the Due.","On a unit with a usable meter estimate, read the Due.",
  "Open the row menu on the No-data unit."],
 ["The calendar always proposes a candidate date.","A meter in No data proposes nothing.",
  "A meter with no usable delta is silent rather than wrong, and the row menu never hides a candidate."],
 [("S12-R2","The calendar always proposes one. A meter in No data proposes nothing"),
  ("S12-N1","A meter with no usable delta is silent rather than wrong"),
  ("S12-N2","The row menu never hides a candidate")])
M.add(26638,"'At a reading' and 'At a day of the year' due and overdue behaviour",S12,L12,P12,
 pre12,
 ["For a service set 'At' a reading, bring the unit to that reading.","Complete it and confirm it never comes due again.",
  "For a service set 'At' a day of the year, pass that day; complete it early or late and check next year's date."],
 ["A service set 'At' a reading comes due when the unit reaches it and stays overdue until done; once done it never comes due again.",
  "A service set 'At' a day of the year comes due that day each year and stays overdue until done; next year's date appears only once it is done, and doing it early or late does not move it."],
 [("S12-R3","A service set \"At\" a reading comes due when the unit reaches it and stays overdue until it is done; once done, it never comes due again. A service set \"At\" a day of the year comes due on that day each year and stays overdue until it is done; next year's date appears only once it is done. Doing it early or late does not move next year's date"),
  ("S12-E2","An \"At\" date does not move when the service is done early or late")])
M.add(26638,"A compliance service is due on its certificate's End date",S12,L12,P12,
 ["You are signed in with View customers; a compliance inspection service on an enrolled asset carries a current certificate with an End date (e.g. 14 Oct 2026) and a Remind before expiry. Flag on."],
 ["Read the compliance service's Due date.","Check the state before, on, and after the End date, and at the Remind-before-expiry point."],
 ["A compliance service is due on its current certificate's End date.",
  "It reads due soon from its Remind before expiry, due today on the End date, and overdue from the next day."],
 [("S12-R4","A compliance service is due on its current certificate's End date. It reads due soon from its Remind before expiry, due today on that day and overdue from the next day")])
M.add(26638,"Confidence changes how the date reads, not which candidate wins",S12,L12,P12,
 pre12,
 ["Compare how a Low-confidence estimate renders against a High-confidence one.","Set two triggers of one service to land on the same day and read the Due cell."],
 ["Confidence changes how the date is rendered, never which candidate wins.",
  "Where two triggers of one service land on the same day, the Due cell names the one with the higher confidence."],
 [("S12-R6","Confidence will change how the date is rendered, never which candidate wins"),
  ("S12-R8","Where two triggers of one service land on the same day, the Due cell names the one with the higher confidence")])
M.add(26638,"Covering applies only to what the shop named, within one schedule",S12,L12,P12,
 ["You are signed in with View customers; a schedule has a service that NAMES other services as covered (per S2-R16), plus a compliance inspection, on an enrolled asset. Flag on."],
 ["Bring the covering service due and complete it.","Check the covered services it named.","Check a service on a DIFFERENT schedule is not covered.","Check a compliance inspection is never covered."],
 ["Covering is what a shop states, never inferred from interval length or shared lines; within one schedule a service covers the services it names.",
  "Across schedules nothing is covered.","Covered services reset with the one that covers them, each on its own interval.",
  "A compliance inspection is never covered."],
 [("S12-R10","Covering is what a shop states per S2-R16, never inferred from interval length or shared lines. Within one schedule a service covers the services it names. Across schedules nothing is covered"),
  ("S12-R11","Covered services reset with the one that covers them, each on its own interval"),
  ("S12-R13","A compliance inspection is never covered")])
M.add(26638,"Rows never merge; canned lines deduplicated; two schedules, one call",S12,L12,P12,
 ["You are signed in with View customers; a unit is on TWO schedules that share the same service, and some services share canned lines. Flag on."],
 ["On the asset tab, worklist and panel, confirm each service keeps its own row.","Look at a unit on two schedules with the same service.","Add services that share canned lines to one visit."],
 ["Grouping services into one entry applies to the customer email alone; on the asset tab, the worklist and the panel every service keeps its own row and rows are never merged.",
  "A unit on two schedules with the same service produces two rows and one phone call.",
  "Canned lines are deduplicated by identity, so a unit never gets oil twice on one visit."],
 [("S12-R9","Grouping services into one entry applies to the customer email alone, in S19. On the asset tab, the worklist and the panel every service keeps its own row"),
  ("S12-E4","A unit on two schedules with the same service produces two rows and one phone call"),
  ("S12-R12","Canned lines will be deduplicated by identity, so a unit never gets oil twice on one visit")])
M.add(26638,"Today follows the location; resets and new readings recalc candidates",S12,L12,P12,
 pre12,
 ["Confirm 'today' follows the location chosen in the header (its timezone).","Reset a service via completion and watch its candidates.","Enter a new reading and watch candidates.","Invoice a work order that recorded a reading and check the order of reading-then-reset."],
 ["Today is the day of the location the user is working in (its timezone), and a due-today row resolves against it.",
  "A reset moves every candidate on that service at once, anchored on the confirmed date.",
  "A new reading recalculates candidates immediately.",
  "When a work order is invoiced, the reading is recorded first and the cycle resets second, so the reading carried forward is the one at invoicing."],
 [("S12-R14","Today is the day of the location the user is working in, as chosen in the header, which already sets the timezone for the session. A due-today row resolves against it."),
  ("S12-E1","A reset moves every candidate on that service at once, anchored on the date confirmed per S18-R13"),
  ("S12-E3","A new reading recalculates candidates immediately"),
  ("S12-E5","Where a work order is invoiced, the reading is recorded first and the cycle resets second, so the reading carried forward is the one at invoicing")])

# ============================== S22 — Origin reporting (26643) ==============================
S22="SV-10577"; L22="S22, Origin reporting"; P22="Part 3 / S22"
pre22=["You are signed in with Create and edit work orders and reporting access, on the build under test. The Maintenance Reminders feature is on (maintenance_reminders flag).",
 "Work orders are being created from due services (an enrolled asset has a due service, e.g. 'ZZAUTOTEST Truck 12')."]
M.add(26643,"A work order from a due service carries the Maintenance schedule origin",S22,L22,P22,
 pre22,
 ["Create a work order from a due service (from the worklist or the work order's maintenance panel).","Open the Work Orders list.","Read the Maintenance schedule column on that work order's row."],
 ["A work order created from a due service carries the origin.",
  "The Work Orders list has a Maintenance schedule column naming the schedule and linking to it where the work order came from one."],
 [("S22-R1","A work order created from a due service will carry the origin"),
  ("S22-R2","The Work Orders list will gain a Maintenance schedule column, naming the schedule and linking to it where the work order came from one")])
M.add(26643,"A hand-created work order has an empty Maintenance schedule column",S22,L22,P22,
 pre22,
 ["Create a work order by hand (not from a due service).","Open the Work Orders list and read its Maintenance schedule column."],
 ["The Maintenance schedule column is empty for a work order with no maintenance origin.",
  "A work order created by hand carries no origin and is not inferred into one."],
 [("S22-R3","The column will be empty for work orders with no maintenance origin"),
  ("S22-N1","A work order created by hand carries no origin and is not inferred into one")])
M.add(26643,"Adding a service sets the work order origin without replacing one",S22,L22,P22,
 pre22,
 ["On a hand-created work order with no origin, add a due service; check the Maintenance schedule column.","On a work order that already has an origin, add another service; check the origin is unchanged."],
 ["Adding a service to an existing work order marks that work order's origin.",
  "It does not replace an origin the work order already had."],
 [("S22-E1","A service added to an existing work order marks that work order's origin without replacing an origin it already had")])
M.add(26643,"Origin and value are reportable together (reminder revenue)",S22,L22,P22,
 pre22,
 ["Create work orders from due services that carry a value.","In reporting, view origin alongside work-order value."],
 ["Origin and value are reportable together, so the revenue attributable to reminders can be answered.",
  "Without this column there is no way to answer whether the feature earned anything, which is why it is in v1."],
 [("S22-R4","Origin and value will be reportable together, so the revenue attributable to reminders can be answered"),
  ("S22-E2","Without this column there is no way to answer whether the feature earned anything, which is why it is v1 rather than later")])
M.add(26643,"Open rates and bounce reporting are not tracked",S22,L22,P22,
 pre22,
 ["Review the reminder reporting available in the product."],
 ["Open rates and bounce reporting are not tracked."],
 [("S22-N2","Open rates and bounce reporting are not tracked")])

M.save(os.path.join(os.path.dirname(__file__),"created-chunk2.json"))
