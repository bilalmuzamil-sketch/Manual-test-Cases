# -*- coding: utf-8 -*-
# Design drive (final) → DIVERGE rows for Chunk 2 stories, label settlements, drive status. Executed inside gen.py after registers.py.
def dtext(t):
    assert clean(t) in DESIGN_CORPUS, f"design text not found: {t}"
    return t
def DD_(id_, topic, spec_src, spec_quote, design_src, design_quote, q, cases, note, drive_row):
    d = D(id_, topic, {"source": spec_src, "quote": spec_quote}, {"source": design_src, "quote": design_quote}, q, cases, note)
    d["design_drive_row"] = drive_row
    return d
DIVERGE += [
    DD_("D18", "Confidence key in the worklist Due column (i)", "Chunk 2 MR S11-R24", SPEC["S11-R24"],
        "Design Chunk 1 board, worklist artboards S1…S1f, (i) on the Due column (also the Demo board's older key)",
        dtext("Certificate and calendar dates are exact. Mileage and engine hours dates are estimated from past readings, with a confidence. High: "
              "several recent readings. Medium: fewer or older readings. Low: one pair, or the last reading is old.") + " || Demo: " +
        dtext("High: several recent readings agree. Medium: few or older readings. Low: irregular readings, so the month may move."),
        "The (i) says Low means 'one pair, or the last reading is old', but under S11-R24 one pair read within 30 days is Medium. Should the (i) "
        "state the age-by-pairs table, or be reworded so it does not contradict it?", ["C204181", "N17", "C204182"],
        "Cases follow S11-R24. (The drive's own spec quote reads '31 to 91 days'; the 5 Oct page says '31 to 90 days', which is what is quoted here.)",
        "3b-2, 3b-20"),
    DD_("D19", "Engine hours card graded Low with one pair read six days ago", "Chunk 2 MR S11-R24 and S11-R23",
        Q("S11-R24", "Up to 30 days: one pair Medium, two or more High")["quote"] + " || " +
        Q("S11-R23", "In a clean history one pair is two visits")["quote"],
        "Design Chunk 1 board, artboards S4 / X1t, Engine hours card",
        dtext("27 a week · measured from 2 visits") + " · Low confidence · (i): " +
        dtext("A measured rate that is thin or stale grades Low. Confidence falls as the last reading ages."),
        "The design's sample unit shows Low for two visits, the last six days old, where S11-R24 gives Medium. Confirm the table governs (the sample "
        "data is wrong) and that 'thin' readings are not graded down on their own.", ["C204131", "C204181"], "Cases follow S11-R24.", "3b-3"),
    DD_("D20", "The meter hover lacks its closing sentence and View work orders", "Chunk 2 MR S11-R27", SPEC["S11-R27"],
        "Design Chunk 1 board, artboards S4 / X1t, hover on the confidence meter",
        dtext("Low, Medium or High, grading the meter. Four visits inside ten months with the last reading six days old. Confidence falls as the last "
              "reading ages. Separate from a reading’s own state, which is recorded or estimated.") + " (no View work orders anywhere in the design)",
        "Must the meter's hover end with the S11-R27 sentence and offer View work orders (spec), which no artboard draws?", ["C204133"],
        "C204133 keeps the spec quote; the wording 'This is the system's best estimate…' and 'View work orders' can be taken from the spec only.",
        "3b-4"),
    DD_("D21", "The step's (i): 'Untick a service to leave it as it is'", "Chunk 2 MR S18-R8 (and S18-R15)",
        Q("S18-R8", "each ticked by default and can be unticked")["quote"] + " · " + Q("S18-R8", "An unticked service does not reset and stays due")["quote"]
        + " || " + SPEC["S18-R15"],
        "Design Chunk 2 board, artboards I1–I6, (i) on When was the maintenance done?",
        dtext("Each cycle counts from when that service’s lines were all closed. Untick a service to leave it as it is. Closing this accepts every "
              "date shown."),
        "None needed. Checked: the drive compared the (i) with S18-R15 only; S18-R8 does provide unticking, so the (i) agrees with the spec.",
        ["C204164"], "RESOLVED ON CHECKING — not a divergence; C204164 shows the (i) as what the tester sees.", "3b-6"),
    DD_("D22", "Older Demo board: readings 'depend on telematics'", "Chunk 2 MR S10-N5", SPEC["S10-N5"],
        "Design Maintenance Reminders Demo board, 'Create a service', (i) on Triggers",
        dtext("Calendar is required so a reminder always fires. Distance and engine-hour readings depend on telematics many assets do not have, so they "
              "are optional additions that bring the service due sooner when a unit works harder. Whole numbers only."),
        "Confirm the Demo board is retired (the current Chunk 1 board says readings 'come from work orders'), so nobody builds this text.",
        ["C204109"], "C204109 follows S10-N5.", "3b-17"),
    DD_("D23", "Older Demo board: the estimate uses the two most recent readings", "Chunk 2 MR S11-R2", SPEC["S11-R2"],
        "Design Maintenance Reminders Demo board, asset, (i) on the estimate",
        dtext("The estimate takes the two most recent recorded readings, works out a rate from the distance and days between them, and carries the last "
              "reading forward at that rate. A new recorded reading replaces it outright."),
        "Confirm the Demo board is retired (the current Chunk 1 board states the three-pair rule).", ["C204125", "C204180"], "Cases follow S11-R2.",
        "3b-18"),
    DD_("D24", "Older Demo board: a low-confidence date reads Soon on the asset", "Chunk 2 MR S11-R9", SPEC["S11-R9"],
        "Design Maintenance Reminders Demo board, asset, (i) on the Due column",
        dtext("The earliest candidate and the trigger that produced it. Other candidates are in the row menu. A date known only to the month shows the "
              "month. At low confidence a future date reads Soon; once due, the badge carries it."),
        "Confirm Soon is for the email only (S19-R9, S11-N1) and the asset always shows a month (current Chunk 1 board agrees).",
        ["C204129", "C204134"], "Cases follow S11-R9.", "3b-19"),
    DD_("D25", "Older work-order board: the step proposes the invoice date", "Chunk 2 MR S18-R13", SPEC["S18-R13"],
        "Design 4-work-order (old WO chrome) board, I1–I5, (i) on the invoice step",
        dtext("Each cycle counts from the day the work was done, proposed as the invoice date. Change it where the work happened on a different day. "
              "Next due follows from each service’s own interval."),
        "Confirm the older work-order board is retired (the current Chunk 2 board proposes the lines-closed date).", ["C204165", "C204187"],
        "Cases follow S18-R13.", "3b-24"),
    DD_("D26", "Older work-order board: bundling and 'absorbs'", "Chunk 2 MR S16-R3 and S12-R10", SPEC["S16-R3"] + " || " + SPEC["S12-R10"],
        "Design 4-work-order (old WO chrome) board, W3, designer note",
        dtext("Candidates inside the bundling window collapse into one event, dated on the earlier of the two and showing both reasons. Bundling groups "
              "by unit, not by schedule, because a truck arrives once. Within one schedule the highest due service absorbs every lower one. Across "
              "schedules there is no absorption, and a compliance inspection is never absorbed."),
        "Confirm the older board is retired: covering is only what the shop states, and rows never merge (S12-R7).", ["C204137", "C204117"],
        "Cases follow the spec.", "3b-25"),
    DD_("D27", "Older work-order board: certificates 'date completed and date expires'", "Chunk 2 MR S18-R16", SPEC["S18-R16"],
        "Design 4-work-order (old WO chrome) board, V7, (i)",
        dtext("Every certificate on the work order is listed together. Update fills in its number, date completed and date expires. Nothing here "
              "blocks completion."),
        "Confirm the older board is retired (Start date / End date / term, per the current Chunk 2 board I6).", ["C204167"], "C204167 follows S18-R16.",
        "3b-26"),
    DD_("D28", "Older work-order board: a completion step on completing the work order", "Chunk 2 MR S18-N6 and S18-R14",
        SPEC["S18-N6"] + " || " + SPEC["S18-R14"],
        "Design 4-work-order (old WO chrome) board, W12, (i) on the completion step",
        dtext("A service is listed here when its lines are on this work order. Selecting it records the completion against the asset and resets its "
              "interval from this reading."),
        "Confirm the older board is retired: there is no step on completing a work order.", ["C204165"], "C204165 checks no step appears on completion.",
        "3b-27"),
    DD_("D29", "Older work-order board: 'absorb' instead of 'take on'", "Chunk 2 MR S17-N1", SPEC["S17-N1"],
        "Design 4-work-order (old WO chrome) board, W2a, (i)",
        dtext("A technician with three hours left cannot absorb ten more lines. Same pattern as DVI findings."),
        "Wording only; the current Chunk 2 board says 'take on', matching S17-N1. Confirm the older board is retired.", ["C204152"],
        "C204152 uses the current board's wording.", "3b-28"),
]
for d in DIVERGE:
    if d["id"] == "D7": d["design_drive_row"] = "3b-12 (confirmed by the drive: the line sits beneath Reset date)"
    if d["id"] == "D8": d["design_drive_row"] = "3b-11 (confirmed by the drive)"

for b in BLOCKERS:
    if b["id"] == "B4":
        b["status"] = "PARTLY SETTLED by the final design drive"
        b["settled"] = ["'Closed 4 Sep' — the closed-line caption is drawn on the older work-order board (plan: 'Closed {date}'); used in C204165",
                        "'Lines can’t be created here' — the invoiced work order's row control (Chunk 2 W7i); used in C204150",
                        "'Save the reading', 'Undo complete', 'Enroll in a schedule' / 'Enroll in Schedule' — confirmed on the boards (the last is D8)"]
        b["not_drawn"] = ["the implausible-reading confirm button (no 'anyway' or other wording on any board)",
                          "a control for adding a certificate on the work order card (only 'Add record' on the asset, Chunk 1)",
                          "the notice for a service that has just become due (no 'Now due' or other wording on any board; D11)",
                          "split, merge, invoice reverse, credit memo and payment-history reverse actions (existing app features, not drawn)",
                          "the invoicing permission name; 'New Customer Payment' (the boards show only a 'Payment' step and the Settings item "
                          "'Payment Methods')",
                          "'No data' and 'View work orders' (no artboard draws them; the spec is the only source)"]
        b["items"] = b["not_drawn"]
    if b["id"] == "B5":
        b["status"] = "DONE"
        _n = sum("Design drive fold-in" in u["reason"] for u in UPD)
        b["evidence"] = ("DESIGN-DRIVE-FINDINGS.md (final, 129,428 B, 646 lines) and spec-comparison.md (29,780 B, 134 lines) read in full; every design "
                         "text used is asserted verbatim against the drive's page texts and exposures. Chunk 2 rows of 3a folded into %d cases; "
                         "Chunk 2 rows of 3b added as D18–D29 (D7/D8 already held 3b-11/3b-12)" % _n)
DRIVE_NOTES = [
    "3a items 47–54 and 56 (Chunk 2) and 19, 21, 23 and 26 (Chunk 1 screens that Chunk 2 cases use) were checked against the 5 Oct spec; none "
    "contradicts it, so each is added to the case that already exercises its screen, cited to its artboard. Items 34 (Mark complete (i), the spec's "
    "own text), 45 (Send email fields) and 51 (Needs mileage reading · enter it in Mileage above) were already in the cases; 46 is an existing "
    "product tooltip; 55 holds designer notes (not on screen).",
    "3a item 20 (the meter hover) contradicts S11-R27 and is D20, not added; 38 (worklist Due column key) contradicts S11-R24 and is D18.",
    "3a items 59–62 come from the older work-order board (old WO chrome), whose layout the spec supersedes (nested lines vs S16-R19; 'resets when "
    "invoiced' vs S16-R13). Not added to cases, except the closed-line caption 'Closed 4 Sep', which no newer artboard draws and nothing contradicts.",
    "3a item 25 / 61 (sample 'last reading 207 / 34 days old' hovers) and 29 (enrolment badge (i)) are sample-data or Chunk 1 texts; not added.",
    "Navigation dead end: 35 'Create work order' links in the Chunk 1 board point to Chunk 2#v5, which does not exist — a design defect, not a "
    "product expectation.",
    "The drive's spec column for 3b-2 quotes S11-R24 as '31 to 91 days'; the 5 Oct page reads '31 to 90 days'. D18 quotes the page.",
    "'No data' (S11-R17/R26) and S11-R27's closing sentence and View work orders are drawn on no artboard; cases take those words from the spec only.",
]
