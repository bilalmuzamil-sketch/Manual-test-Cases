# -*- coding: utf-8 -*-
# Fold-in of the FINAL design drive (DESIGN-DRIVE-2026-10-06/DESIGN-DRIVE-FINDINGS.md + spec-comparison.md), coordinator order 6 Oct 2026.
# Design-only text a tester will see is added where a case already exercises that screen, only where the spec does not contradict it,
# cited to the design artboard. Every design text is asserted verbatim against the drive's page texts / exposures. Executed inside gen.py.
_DD = ROOT + "/source-update-2026-10-06/DESIGN-DRIVE-2026-10-06/"
DESIGN_CORPUS = clean(" ".join(open(_DD + f, encoding="utf-8").read() for f in [
    "Chunk 1-pages.txt", "Chunk 2-pages.txt", "4-work-order (old WO chrome)-pages.txt", "Maintenance Reminders Demo-pages.txt",
    "Canned lines per location - proposal-pages.txt", "DESIGN-DRIVE-FINDINGS.md"]))
DOCS["design"] = DESIGN_CORPUS
DESIGN_SRC = "Design MR_V2_2 (Claude Design export, 6 Oct 2026), driven in full on 6 Oct 2026"
def DQ(where, text):
    assert clean(text) in DESIGN_CORPUS, f"design text not found: {text}"
    return {"anchor": f"Design, {where}", "quote": text, "doc": "design"}
def _rebuild(u):
    u["custom_preconds"] = ol(u["preconditions"]); u["custom_steps"] = ol(u["steps"])
    u["custom_expected"] = expected(u["expected_results"], u["source"], u["quotes"])
def addon(cid, steps=(), results=(), quotes=(), where="", note=""):
    u = next(x for x in UPD if x["case_id"] == cid)
    u["steps"] += list(steps); u["expected_results"] += list(results); u["quotes"] += list(quotes)
    if where and DESIGN_SRC not in u["source"]:
        u["source"] = u["source"].replace("; read 6 Oct 2026.", f"; {DESIGN_SRC}, {where}; read 6 Oct 2026.")
    u["reason"] += " Design drive fold-in: " + note
    _rebuild(u)
def dsrc(stories, where, plan=None):
    return source_line(stories, plan).replace("; read 6 Oct 2026.", f"; {DESIGN_SRC}, {where}; read 6 Oct 2026.")

# ---------------------------------------------------------------- additions to cases already rewritten
addon(204124,
      ["On unit 504's Mileage card hover the (i) beside Current estimate and read it."],
      ["The (i) explains the estimate (in the design: “The estimate works out a rate from the last three usable pairs of readings, read as one "
       "period, and carries the last reading forward at that rate. At least two readings are needed for any estimate. A new recorded reading "
       "replaces it outright.”)."],
      [DQ("Chunk 1 board, artboards S4 / X1t, (i) beside Current estimate", "The estimate works out a rate from the last three usable pairs of "
          "readings, read as one period, and carries the last reading forward at that rate. At least two readings are needed for any estimate. A new "
          "recorded reading replaces it outright.")],
      "Chunk 1 board artboards S4 / X1t", "the Current estimate (i) agrees with S11-R1/R2/R14 and S11-E2, so its text is added as what the tester sees.")
addon(204131,
      ["Hover the (i) beside the Engine hours card's Current estimate and read it."],
      ["The (i) says the engine hours estimate is the same calculation (in the design: “The same calculation, run against the hour meter.”)."],
      [DQ("Chunk 1 board, artboards S4 / X1t, (i) beside the Engine hours estimate", "The same calculation, run against the hour meter.")],
      "Chunk 1 board artboards S4 / X1t", "the Engine hours (i) agrees with S11-R10.")
addon(204186,
      ["On unit 550's Maintenance tab hover the (i) on the Due column heading and read it."],
      ["The Due column's (i) explains the rule (in the design: “The earliest candidate and the trigger that produced it. Other candidates are in the "
       "row menu. A date known only to the month shows the month. Every estimate shows a month with its confidence; once due, the badge carries it.”)."],
      [DQ("Chunk 1 board, artboards S4 / X1t / M1u / M6, (i) on the Due column", "The earliest candidate and the trigger that produced it. Other "
          "candidates are in the row menu. A date known only to the month shows the month. Every estimate shows a month with its confidence; once due, "
          "the badge carries it.")],
      "Chunk 1 board artboards S4 / X1t", "the Due column (i) agrees with S12-R5/R7 and S11-R9.")
addon(204105,
      ["Before invoicing, hover the (i)s on the asset's Mileage card; after invoicing, hover them again."],
      ["Before invoicing the card's (i) describes the estimate (in the design: “The estimate carries the last recorded reading forward at a measured "
       "rate.”); once the reading is recorded it describes the recorded value (in the design: “A recorded reading replaces the estimate outright. There "
       "is nothing left to project until the next visit.”)."],
      [DQ("Chunk 1 board, artboard P3, (i) on the Mileage card before", "The estimate carries the last recorded reading forward at a measured rate."),
       DQ("Chunk 1 board, artboard P3, (i) on the Mileage card after", "A recorded reading replaces the estimate outright. There is nothing left to "
          "project until the next visit.")],
      "Chunk 1 board artboard P3", "the P3 (i)s agree with S10-R11 and S11-R1.")
addon(204152,
      ["Back on the first work order, press Add Service on PM-A again and hover the (i) beside Create a new work order instead; press Cancel."],
      ["The (i) gives the reason for a second destination (in the design: “A technician with three hours left cannot take on ten more lines. Same "
       "pattern as DVI findings.”)."],
      [DQ("Chunk 2 board, artboards W2a / L3, (i) beside Create a new work order instead", "A technician with three hours left cannot take on ten "
          "more lines. Same pattern as DVI findings."), Q("S17-N1")],
      "Chunk 2 board artboards W2a / L3", "the (i) is S17-N1's own rationale shown on screen.")
addon(204149,
      ["After the Undo in step 2, hover the (i) on the PM-A row."],
      ["The row's (i) explains it (in the design: “Undo and Remove take PM-A off this work order. The lines stay; delete them by hand if they are not "
       "wanted.”)."],
      [DQ("Chunk 2 board, artboard W2e, (i) on the row", "Undo and Remove take PM-A off this work order. The lines stay; delete them by hand if they "
          "are not wanted.")],
      "Chunk 2 board artboard W2e", "the W2e (i) agrees with S16-R25.")
addon(204122,
      ["Hover the (i) beside the Maintenance schedule column heading and read it."],
      ["The (i) explains the column (in the design: “Origin and value are reportable together, which is how a shop answers whether the feature "
       "earned anything.”)."],
      [DQ("Chunk 2 board, artboard W14, (i) on the Maintenance Schedule column", "Origin and value are reportable together, which is how a shop "
          "answers whether the feature earned anything.")],
      "Chunk 2 board artboard W14", "the W14 (i) agrees with S22-E2.")
addon(204187,
      ["When the step opens, read the line beneath its title and the column headings."],
      ["Beneath the title the step explains the date (in the design: “The next reminder counts from the date the work was done, not the invoice "
       "date. Change a date if the work was finished earlier.”), with the column Work done."],
      [DQ("Chunk 2 board, artboards I1–I6, line beneath the step title", "The next reminder counts from the date the work was done, not the invoice "
          "date. Change a date if the work was finished earlier.")],
      "Chunk 2 board artboards I1–I6", "the step's sub-heading agrees with S18-R14.")
addon(204177,
      ["In the sent email read the call to action word for word."],
      ["The call to action reads (in the design): “Give us a call and we will find a time that suits your schedule.”"],
      [DQ("Chunk 2 board, artboard R1, email body", "Give us a call and we will find a time that suits your schedule.")],
      "Chunk 2 board artboard R1", "the spec fixes the wording but does not print it; the design is the only source of the words.")

# ---------------------------------------------------------------- flag-only cases the drive affects: now whole-case rewrites
upd(204139, "Hovering a service shows its job, parts and inspection form, never money", ["S16"],
    [LOGIN_ADMIN + " The organization has a second location, for example 'Lethbridge', besides the schedule's home location 'Calgary South'.",
     SCHED.replace("(4 lines, 2.8 hours). Save.", "(4 lines, 2.8 hours), with parts on its lines and an inspection form attached. Save."),
     ENROLL, NEWWO, PANEL,
     "In the header choose 'Lethbridge' and create a second work order for the unit there (New Work Order)."],
    ["On the first work order (Calgary South) hover the PM-A row and read the card that opens.",
     "On a phone or tablet, tap the PM-A row instead and read what opens.",
     "On the Lethbridge work order hover the PM-A row and read the card."],
    ["At Calgary South the card shows what PM-A contains: its job description, its parts, and the inspection form attached to it (in the design, "
     "under the headings JOB DESCRIPTION, PARTS ON IT and INSPECTION FORM).",
     "The card shows no price and no total.",
     "On touch, tapping the service opens the same card.",
     "At Lethbridge the parts are headed PARTS CALGARY SOUTH USES (reference), because none of them will be added."],
    [Q("S16-R7"), Q("S16-R16", "It carries no money: no total on the row, in the hover card of S16-R7 or in the Add Service modal"),
     DQ("Chunk 2 board, artboard W2h, hover card headings", "JOB DESCRIPTION"), DQ("Chunk 2 board, artboard W2h, hover card headings", "PARTS ON IT"),
     DQ("Chunk 2 board, artboard W2h, hover card headings", "INSPECTION FORM")],
    "Was flag-only. Design drive fold-in: the hover card's headings (JOB DESCRIPTION, PARTS ON IT, INSPECTION FORM) are tester-visible and agree "
    "with S16-R7; steps made click by click, including the other-location heading the spec states.")
UPD[-1]["source"] = dsrc(["S16"], "Chunk 2 board artboards W2h / L2"); _rebuild(UPD[-1])

upd(204150, "Card negatives: line search, closing, invoiced work order, no schedule", ["S16"],
    [LOGIN_ADMIN, SCHED, ENROLL, NEWWO, PANEL,
     "Have a second work order for the unit that is already invoiced (Finance > Create Invoice, payment recorded).",
     "For the last step: a test organization with no maintenance schedule, and one with a single workplace (location), if available."],
    ["On the open work order press New Line and search for 'PM-A'; read what the search returns.",
     "Expand the Maintenance schedule card and try to complete the work order (Complete work order) with PM-A still due.",
     "Open the invoiced work order, expand the card and read the PM-A row: look for Add Service, hover the (i), and open the three-dot menu.",
     "In the organization with no schedule open any work order and look for a Maintenance schedule card.",
     "In the organization with one workplace add a service from the card and check the lines were not copied."],
    ["Line search returns canned lines only, never the maintenance service PM-A.",
     "Nothing in the card blocks completing the work order.",
     "On the invoiced work order there is no Add Service (in the design the row shows Lines can’t be created here); its (i) reads Lines can't be "
     "created on an invoiced work order, and Mark complete is still in the row's menu.",
     "The organization with no maintenance schedule shows no maintenance card on a work order.",
     "The organization with one workplace never copies work: every work order is at the home location, so the lines are the schedule's own."],
    [Q("S16-N2"), Q("S16-N3"), Q("S16-N7"), Q("S16-N8"), Q("S16-N9"),
     DQ("Chunk 2 board, artboard W7i, row control on an invoiced work order", "Lines can’t be created here")],
    "Was flag-only. Design drive fold-in: on an invoiced work order the row shows the design-only control 'Lines can’t be created here' with the "
    "S16-N7 (i); steps made click by click.")
UPD[-1]["source"] = dsrc(["S16"], "Chunk 2 board artboard W7i"); _rebuild(UPD[-1])

upd(204121, "Adding a service marks the origin without replacing an earlier one", ["S22"],
    [LOGIN_ADMIN, SCHED + " Also add service 'PM-B' with a Calendar trigger of Every 12 months and canned lines.",
     "Enroll units 'ZZAUTOTEST 402' and 'ZZAUTOTEST 403' so PM-A and PM-B read Overdue on both.",
     "Create work order W1 for 402 by hand (New Work Order) with no service on it.",
     WORKLIST + " On 403's PM-A row press Create work order; note the new work order W2."],
    ["Open Work Orders and read the Maintenance schedule column for W1 (empty) and W2.",
     "On W1 expand the Maintenance schedule card and press Add Service > Add on PM-B. Read W1's Maintenance schedule cell.",
     "On W2 expand the card and press Add Service > Add on PM-B. Read W2's cell."],
    ["Before step 2, W1 has no origin and its Maintenance schedule cell is empty.",
     "After Add Service, W1 shows 'ZZAUTOTEST Highway Tractor PM' and (in the design) a line saying the work order was created earlier and the "
     "service was added with Add Service, for example Created earlier · PM-B added with Add Service.",
     "W2 keeps the origin it already had from the worklist; adding PM-B does not replace it."],
    [Q("S22-E1"), Q("S22-R1"), DQ("Chunk 2 board, artboard W14, cell for a work order created earlier",
                                  "Created earlier · PM-B added with Add Service")],
    "Was flag-only. Design drive fold-in: the Work Orders list shows 'Created earlier · PM-B added with Add Service' for this case (agrees with "
    "S22-E1); steps made click by click.")
UPD[-1]["source"] = dsrc(["S22"], "Chunk 2 board artboard W14"); _rebuild(UPD[-1])

upd(204164, "The step lists services whose lines were added; untick to leave one", ["S18"],
    [LOGIN_ADMIN, SCHED + " Also add service 'PM-B' (Calendar: Every 12 months) with canned lines, and a second schedule 'ZZAUTOTEST Trailer PM' "
     "with service 'PM-T' (Calendar: Every 12 months) with canned lines.",
     "Enroll unit 'ZZAUTOTEST 402' on both schedules so PM-A, PM-B and PM-T read Overdue.",
     NEWWO, PANEL,
     "Press Add Service > Add on PM-A, PM-B and PM-T. Then use Mark complete (the row's button) on PM-B, keeping this work order and Reset date today.",
     "On the asset's Maintenance tab remove the unit from 'ZZAUTOTEST Trailer PM' (Remove from schedule) while the work order is still open.",
     "On the Lines tab complete every line."],
    ["Open the Finance tab and press Create Invoice. In When was the maintenance done? hover the (i) beside the title and read it.",
     "Read the list of services and the reason under each.",
     "Untick PM-A, press Confirm dates and record the payment.",
     "Open the asset's Maintenance tab and read PM-A and PM-B."],
    ["The (i) explains the step (in the design: “Each cycle counts from when that service’s lines were all closed. Untick a service to leave it as it "
     "is. Closing this accepts every date shown.”).",
     "Only PM-A is listed, ticked, with its reason Lines added from PM-A.",
     "PM-B is not listed: it was already reset by Mark complete (a service resets once).",
     "PM-T is not listed and does not reset, because its schedule was removed from the asset while the work order was open.",
     "PM-A, unticked, does not reset and stays due."],
    [Q("S18-R8"), Q("S18-R18"), DQ("Chunk 2 board, artboards I1–I6, (i) beside When was the maintenance done?",
                                   "Each cycle counts from when that service’s lines were all closed. Untick a service to leave it as it is. Closing "
                                   "this accepts every date shown.")],
    "Was flag-only. Design drive fold-in: the step's (i) is tester-visible and agrees with S18-R8 (unticking) and S18-R15 (closing accepts); the "
    "drive listed it as differing from S18-R15 only, see D21. Steps made click by click with one unit covering all three branches.")
UPD[-1]["source"] = dsrc(["S18"], "Chunk 2 board artboards I1–I6"); _rebuild(UPD[-1])

upd(204165, "A closed line shows the date it closed, not the invoice date", ["S18"],
    [LOGIN_ADMIN, SCHED, ENROLL, NEWWO, PANEL, ADDSVC],
    ["On the Lines tab complete one PM-A line today and read that line.",
     "Leave the other PM-A lines open; read them.",
     "The next day (or later), complete the remaining PM-A lines, then open Finance and press Create Invoice; read the date proposed in When was the "
     "maintenance done? and the dates shown on the lines."],
    ["A completed line shows the date it closed (in the older work-order board: Closed 4 Sep), labelled so it is not the invoice date.",
     "A line that is still open shows no closed date.",
     "After invoicing, each line keeps its own closed date, distinct from the invoice date, and the step proposes the day PM-A's lines were all closed."],
    [Q("S18-R9"), Q("S18-R13", "The date proposed is when that service's own lines were all closed, which S18-R9 stamps, and the invoice date only "
                               "where there is nothing better"),
     DQ("4-work-order (old WO chrome) board, Lines tab, completed PM-A line", "Closed 4 Sep")],
    "Was flag-only. Design drive fold-in: the closed-line caption is drawn as 'Closed 4 Sep' on the older work-order board (the tech plan calls it "
    "'Closed {date}'), settling a label on the unconfirmed list; that board's nested line layout is older than S16-R19 and is not used. The five "
    "completion paths stay covered by new case N16, so this case keeps one behaviour.")
UPD[-1]["source"] = dsrc(["S18"], "4-work-order (old WO chrome) board, Lines tab"); _rebuild(UPD[-1])

upd(204167, "The step: Compliance certificates section, optional, with its (i)", ["S18"],
    [LOGIN_ADMIN, SCHED + " Also add a compliance service 'CVIP' (12-month term) with canned lines.",
     ENROLL, NEWWO, PANEL, "Press Add Service > Add on PM-A and on CVIP. Complete every line on the Lines tab."],
    ["Open the Finance tab and press Create Invoice.",
     "In When was the maintenance done? find the Compliance certificates section and hover its (i).",
     "For CVIP enter Number C-448210, Start date today and Term 12 months; read End date.",
     "Press Add another certificate and read what appears; then remove or leave it empty.",
     "Press Confirm dates and record the payment. Open the asset's Maintenance tab and read CVIP.",
     "On a second identical work order, invoice again but leave the certificate section empty; press Confirm dates."],
    ["The step carries a Compliance certificates section for CVIP, one record per inspection: type, number, Start date, End date and term.",
     "Its (i) explains it (in the design: “Optional. End date fills in from Start date plus the term. A certificate is valid through its End date. The "
     "next due comes from the certificate.”).",
     "End date fills in as today plus 12 months.",
     "Add another certificate offers a further record (design label).",
     "After confirming, CVIP's next due comes from the certificate's End date.",
     "Leaving the section empty is allowed: the section is optional."],
    [Q("S18-R16"), Q("S18-E6", "Its next due comes from the certificate's End date per S12-R4, entered in the certificate section of S18-R16"),
     DQ("Chunk 2 board, artboards I6 / I7, (i) on Compliance certificates", "Optional. End date fills in from Start date plus the term. A certificate "
        "is valid through its End date. The next due comes from the certificate."),
     DQ("Chunk 2 board, artboard I6", "Add another certificate")],
    "Was flag-only and held five behaviours. Design drive fold-in: the certificates (i) and 'Add another certificate' are tester-visible and agree "
    "with S18-R16. The other behaviours it held are covered elsewhere (editable date C204187, Confirm dates and closing N3, ordinary work order N15, "
    "skippable C204170/N3); their anchors stay cited there.")
UPD[-1]["source"] = dsrc(["S18"], "Chunk 2 board artboards I6 / I7"); _rebuild(UPD[-1])

upd(204173, "Send email opens with the fixed wording, editable for this one send", ["S19"],
    [LOGIN_ADMIN, SCHED, ENROLL, CONTACT, QA_MAIL],
    [WORKLIST + " On 402's row press Contact, then Send reminder.",
     "Read Email content and the Reminder table beneath it.",
     "Change one word in Email content and press Send; read the email received.",
     "Open Send reminder again and read Email content.",
     "Look in Settings > Maintenance for any wording editor, subject field or reset to default."],
    ["Email content opens with the fixed wording, the same for every shop and phrased for any mix of states with no singular or plural form (in the "
     "design: “You have some preventive maintenance we want to remind you about.” and “Give us a call and we will find a time that suits your "
     "schedule.”).",
     "The Reminder table beneath it is read only (in the design marked Read only).",
     "The changed word is in that one email; the next Send reminder opens with the fixed wording again.",
     "The email's subject is fixed (in the design: Preventive maintenance coming up) and there is no wording editor, no subject the shop can change "
     "and no reset to default in Settings."],
    [Q("S19-R2"), Q("S19-R4"), Q("S19-N7"),
     DQ("Chunk 1 board, artboard B5, Email content", "You have some preventive maintenance we want to remind you about."),
     DQ("Chunk 1 board, artboard B5, Email content", "Give us a call and we will find a time that suits your schedule."),
     DQ("Chunk 2 board, artboard R1, email subject", "Preventive maintenance coming up")],
    "Was flag-only. Design drive fold-in: the spec fixes the wording but does not print it; the design (Chunk 1 B5 dialog, Chunk 2 R1 email) is the "
    "only source of the words, so they are given as what the tester sees. Steps made click by click.")
UPD[-1]["source"] = dsrc(["S19"], "Chunk 1 board artboard B5 and Chunk 2 board artboard R1"); _rebuild(UPD[-1])

upd(204178, "The footer says why the email was sent; there is no unsubscribe link", ["S19"],
    [LOGIN_ADMIN, SCHED, ENROLL, CONTACT, QA_MAIL],
    [WORKLIST + " On 402's row press Contact, then Send reminder, then Send.",
     "Open the email in the mailbox and read the footer.",
     "Look for any unsubscribe link anywhere in the email."],
    ["The footer states why the customer received it (in the design: Sent because <customer> is the contact for this unit at <organization>., "
     "for example Sent because ZZAUTOTEST Fleet Co is the contact for this unit at the shop's organization).",
     "There is no unsubscribe link: consent is the Send preventive maintenance notifications setting on the customer record."],
    [Q("S19-R15"), DQ("Chunk 2 board, artboard R1, email footer", "Sent because Aacrest Works is the contact for this unit at Northline Heavy Duty.")],
    "Was flag-only. Design drive fold-in: the footer wording exists only in the design (the spec requires a reason footer but prints none).")
UPD[-1]["source"] = dsrc(["S19"], "Chunk 2 board artboard R1"); _rebuild(UPD[-1])

# keep anchors that C204167 used to carry
addon(204165, ["Before invoicing, complete the work order (Complete work order) and watch for any maintenance step."],
      ["Completing the work order shows no maintenance step; the step appears only after Create Invoice."],
      [Q("S18-N6")], "", "S18-N6 moved here from C204167 (this case already completes the lines).")
_n3 = next(n for n in NEW if n["key"] == "N3")
_n3["expected_results"].append("Nothing blocks the work order or the invoice: the step can be closed and skipped.")
_n3["quotes"].append(Q("S18-N1")); _n3["reason"] += " S18-N1 moved here from C204167."
_n3["custom_expected"] = expected(_n3["expected_results"], _n3["source"], _n3["quotes"])
addon(204165, [], ["PM-A counts as completed only when every line it added is completed: the proposed date is the day the last of them closed."],
      [Q("S18-R10", "A service added by its canned lines completes when every line it added completes")], "",
      "S18-R10 (first sentence) kept here from the old version of this case.")
_n16 = next(n for n in NEW if n["key"] == "N16")
_n16["expected_results"].append("Whichever of these ways closes PM-A's lines, PM-A completes when every line it added is completed.")
_n16["quotes"].append(Q("S18-R10")); _n16["reason"] += " S18-R10 (the five paths) is cited here as well."
_n16["custom_expected"] = expected(_n16["expected_results"], _n16["source"], _n16["quotes"])
