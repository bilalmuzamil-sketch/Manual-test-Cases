#!/usr/bin/env python3
"""Worker B — WO Board & Tech View full rewrite, Stories 4-8 (sections 13239-13243), 8 Oct 2026.
Writes proposals-B-S4-S8.json. Quotes are copied programmatically from the PRD file (and the tech-plan file for
'Tech plan ...' anchors); nothing is retyped. Run: python3 gen_b.py  (then the built-in validator runs)."""
import json, re, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "sources")
PRD_PATH = os.path.join(SRC, "CONFLUENCE-845185030-WO-BoardView-TechView-PRD-v33-edited-2026-10-07.md")
TP_PATH = os.path.join(SRC, "Tech-Plan-Kanban-Tech-View-Display-Options-2026-10-08-upload.md")
OUT = os.path.join(HERE, "proposals-B-S4-S8.json")
PRD = open(PRD_PATH, encoding="utf-8").read()
TP = open(TP_PATH, encoding="utf-8").read()
MARKER = "AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build"


def norm(s):
    return re.sub(r"\s+", " ", s.replace("**", "")).strip()


PRD_N, TP_N = norm(PRD), norm(TP)


def q(anchor):
    """Verbatim PRD requirement text for an anchor, '**' markers dropped, quote marks kept as they are."""
    for line in PRD.splitlines():
        m = re.match(r"^\s*(?:-\s*)?\*\*" + re.escape(anchor) + r":\*\*\s*(.*)$", line)
        if m:
            return [anchor, m.group(1).replace("**", "").strip()]
    raise SystemExit("anchor not found: " + anchor)


def qs(label, text):
    """A verbatim PRD sentence that has no anchor of its own (table row, key decision, release note)."""
    if norm(text) not in PRD_N:
        raise SystemExit("not a PRD substring: " + label)
    return [label, text]


def qt(label, text):
    """A verbatim tech-plan sentence."""
    if norm(text) not in TP_N:
        raise SystemExit("not a tech-plan substring: " + label)
    return [label, text]


# ---------------------------------------------------------------- shared wording
STORY = {
    4: ("SV-10047", "Story 4, Reassign or unassign the lead technician"),
    5: ("SV-10048", "Story 5, Fields to display (Board View) and columns (Tech View)"),
    6: ("SV-10049", "Story 6, Density in Tech View and Board View"),
    7: ("SV-10050", "Story 7, Show line technicians on cards and rows"),
    8: ("SV-10051", "Story 8, Remove the tech story check-mark indicator"),
}
SECTION = {4: 13239, 5: 13240, 6: 13241, 7: 13242, 8: 13243}


def src(story, anchors, extra=""):
    key, name = STORY[story]
    s = (f"Epic SV-10043; story {key} ({name}); PRD Confluence 845185030, edited 7 Oct 2026 (status line \"PRD v33\"), "
         f"{', '.join(anchors)}, read 8 Oct 2026.")
    return s + (" " + extra if extra else "") + " Source-verified 8 October 2026; not yet build-verified."


DESIGN = "Design export of 8 Oct 2026 (Claude Design project 787fef1a, Work Orders.dc.html)"

SIGN_CE = ("Sign in to the Work Orders build under test as a user whose role has Work Orders view and Work Orders create "
           "and edit. To check: Settings > Roles & Permissions > open the role > Work Orders (an Owner or Admin role has both).")
SIGN_VIEW = ("Sign in to the Work Orders build under test as a user whose role has Work Orders view (Settings > Roles & "
             "Permissions > open the role > Work Orders).")
SCREEN = ("Use a desktop browser window at least 1024 px wide. Narrower windows show only the List, without the display "
          "switcher.")
LOC = ("In the top bar, pick the location you will test in (e.g. \"Heavy Duty\") and stay in it for the whole case.")


def techs(names):
    return [
        f"At least {len(names)} technicians are eligible at this location (e.g. " + ", ".join(f'"{n}"' for n in names)
        + "). A staff member is eligible when Clockable is on, the staff record is Active, the role is neither Office "
          "nor Time Clock User, and they are enrolled at this location. To add one:",
        "↳ Settings > Staff > add a staff member, enter a first and last name (e.g. \"" + names[-1] + "\") and an email.",
        "↳ Pick a role that is not Office or Time Clock User (e.g. \"Technician\"), turn Clockable on, keep the record "
        "Active, enrol the staff member at this location, then Save.",
    ]


CUSTOMER = ("Create a customer used only by this case so a search shows only its work orders: Customers > New Customer, "
            "name (e.g. \"ZZ Board Test Co\"), add an asset with a unit number and year/make/model (e.g. unit \"TRK-118\", "
            "\"2022 Freightliner M2\"), then Save.")


def new_wo(lead, label="the work order", status="Approved"):
    lines = [
        f"Create {label}: Work Orders > New Work Order > pick the case customer (e.g. \"ZZ Board Test Co\") and its asset > "
        f"create it, and write down its number (e.g. \"S1-702\").",
    ]
    if lead:
        lines.append(f"↳ On the work order page set Lead Technician to \"{lead}\".")
    else:
        lines.append("↳ Leave Lead Technician empty.")
    lines.append("↳ On the Lines tab click New Line, enter a name (e.g. \"Brake inspection\") and labor hours (e.g. 2.0), "
                 "and save the line.")
    if status == "Approved":
        lines.append("↳ Click the line's Approve (check) button so the work order status reads Approved.")
    elif status == "Estimate":
        lines.append("↳ Leave the line unapproved so the work order status stays Estimate.")
    return lines


STATUS_RECIPE = [
    "How to reach each status (standard steps): Estimate = a new work order whose lines are not approved. Approved = "
    "approve its lines. In Progress = a technician clicks Start time clock on an approved line's Labor row. Review = set the "
    "work order to Ready for Review with its status control. Complete = enter a tech story on every line, complete each "
    "line, then complete the work order. Invoiced = Finance tab > Create Invoice (the work order needs a contact person). "
    "Paid = record a full payment on that invoice. Declined = decline the estimate.",
]


def shift(tech, wo, when, scope="Entire work order", line=None):
    s = (f"On the Schedule, give \"{tech}\" a shift on {wo} {when}: Schedule > go to that day > drag the work order from "
         f"the work order list onto {tech}'s row at the start time > in the picker choose {scope}")
    if line:
        s += f" and tick {line}"
    return s + " > set the end time > save."


OPEN_BOARD = ["Open Work Orders, click the All tab and pick Board View in the display switcher (right side of the toolbar; "
              "in the design its button tooltip reads \"Board\").",
              "Type the case customer's name (e.g. \"ZZ Board Test Co\") in Search."]
OPEN_TECH = ["Open Work Orders, click the All tab and pick Tech View in the display switcher (in the design its button "
             "tooltip reads \"By Lead Tech\").",
             "Type the case customer's name (e.g. \"ZZ Board Test Co\") in Search."]
KEEP_IF_PROMPT = "If a \"Clear …'s scheduled shifts?\" prompt opens, click Keep shifts."

U, N = [], []  # updates, new cases
NOTES = []


def upd(cid, title, pre, steps, res, source, quotes, summary):
    U.append({"case_id": cid, "title": title, "preconds": pre, "steps": steps, "results": res, "source": source,
              "quotes": quotes, "marker": MARKER, "change_summary": summary})


def new(key, story, title, pre, steps, res, source, quotes, why):
    N.append({"key": key, "section_id": SECTION[story], "title": title, "preconds": pre, "steps": steps, "results": res,
              "source": source, "quotes": quotes, "marker": MARKER, "why": why})


# ====================================================================================== STORY 4
BASE4 = [SIGN_CE, SCREEN, LOC]

upd(96956, "Reassign lead technician lists eligible technicians and Unassigned",
    BASE4 + techs(["Esther Howard", "Ralph Edwards", "Dana Ortiz"]) + [
        "Three staff members who must NOT be offered: an Office-role user (e.g. \"Owen Office\"), a technician whose staff "
        "record you set to Inactive (e.g. \"Ivan Inactive\"), and a technician enrolled only at another location (e.g. "
        "\"Lena Otherloc\"). Create them the same way under Settings > Staff.",
        CUSTOMER] + new_wo("Esther Howard"),
    OPEN_BOARD + [
        "Hover the work order's card (e.g. \"S1-702\") in Esther Howard's column and click its More actions (…) button.",
        "Choose Reassign lead technician.",
        "Read every choice listed in the dialog.",
        "Pick Ralph Edwards and confirm the dialog with its confirm button (e.g. \"Reassign\").",
        KEEP_IF_PROMPT,
        "Open the same card's More actions menu again and choose Reassign lead technician.",
        "Pick Unassigned and confirm.",
        KEEP_IF_PROMPT,
        "Open the card's More actions menu again (it is now in the Unassigned column) and choose Reassign lead technician.",
        "Pick Dana Ortiz, then click Cancel.",
        "Open the work order (click the card) and read Lead Technician.",
        "Go back, pick Tech View in the display switcher and repeat steps 3 to 13 using the row's More actions button.",
    ],
    ["The card's More actions menu (and the Tech View row's) offers Reassign lead technician, and choosing it opens the "
     "Reassign lead technician dialog.",
     "The dialog lists Unassigned and the eligible technicians of this location, e.g. Esther Howard, Ralph Edwards and "
     "Dana Ortiz. Owen Office, Ivan Inactive and Lena Otherloc are not listed.",
     "After picking Ralph Edwards and confirming, the card is in Ralph Edwards' column (the row in his group), and the "
     "work order page shows Lead Technician Ralph Edwards. After picking Unassigned and confirming, the card is in the "
     "Unassigned column and the work order has no lead technician.",
     "After Cancel, nothing changes: the card stays in Unassigned and the work order still has no lead technician."],
    src(4, ["S4-R4", "S4-R12", "S4-R13", "S4-R14"],
        "Eligibility from PRD §5 Terminology (Technician) and S2-R7. " + DESIGN + ": card and row More actions (…) button "
        "and the reassign dialog (title \"Reassign Lead Tech\", search \"Search technicians\", Cancel)."),
    [q("S4-R4"), q("S4-R12"), q("S4-R13"), q("S4-R14")],
    "Full rewrite: real click-path, named non-eligible staff to prove the filter, assign/unassign/cancel each observed in both views.")

upd(96957, "Lead technician updated and removed messages show and close on their own",
    BASE4 + techs(["Esther Howard", "Ralph Edwards"]) + [CUSTOMER] + new_wo("Esther Howard"),
    OPEN_BOARD + [
        "Drag the work order's card from Esther Howard's column into Ralph Edwards' column and release it.",
        KEEP_IF_PROMPT,
        "Read the message that appears and do not click it.",
        "Wait 10 seconds without touching the message.",
        "Drag the same card from Ralph Edwards' column into the Unassigned column and release it.",
        KEEP_IF_PROMPT,
        "Read the message that appears and wait 10 seconds without touching it.",
    ],
    ["After the move to Ralph Edwards a success message reads exactly \"Lead technician updated\".",
     "After the move to Unassigned a success message reads exactly \"Lead technician removed\".",
     "Each message goes away by itself within the 10 seconds, without being clicked."],
    src(4, ["S4-R5", "S4-R16"], "PRD §9 User Feedback Summary (\"Success toast, auto-fades\"). " + DESIGN +
        ": the design's toast reads \"<number> assigned to <name>\" / \"<number> moved to Unassigned\" with an Undo button; "
        "the PRD wording is asserted here."),
    [q("S4-R5"), q("S4-R16")],
    "Rewritten with drag click-path, exact message texts and a timed auto-dismiss check.")

upd(96958, "Changing the lead on the board sends the same notifications as today",
    BASE4 + techs(["Esther Howard", "Ralph Edwards", "Dana Ortiz"]) + [
        "Esther Howard, Ralph Edwards and Dana Ortiz can sign in (each staff record has an email and an accepted invite).",
        CUSTOMER] + new_wo("Esther Howard"),
    ["Open the work order page and change Lead Technician from Esther Howard to Ralph Edwards there.",
     "In a second browser, sign in as Esther Howard and then as Ralph Edwards, and write down any notification each of "
     "them received for this change (notification bell, email, or none).",
     ] + OPEN_BOARD + [
        "In the first browser, drag the card from Ralph Edwards' column into Dana Ortiz's column.",
        KEEP_IF_PROMPT,
        "In the second browser, sign in as Ralph Edwards and then as Dana Ortiz and write down any notification each received.",
        "Repeat steps 3 to 7 in Tech View with the row's More actions > Reassign lead technician, moving it back to Esther Howard.",
    ],
    ["A lead change made in Board View or Tech View produces exactly the same notifications as a lead change made on "
     "the work order page (step 2 compared with steps 6 and 8). The product owner records that no notification is sent "
     "on a lead change today, so none is expected in either place."],
    src(4, ["S4-R6"], "Review Decisions page 853901313 DR-46 and FF-4 (no notification is sent on a lead change today, "
                      "S4-R6 keeps it that way), Sasha Grosman 24 Sep 2026."),
    [q("S4-R6")],
    "Rewritten as a side-by-side comparison with the work order page, with the PO's recorded baseline (no notification).")

upd(96959, "Column and group counts change straight after a reassign",
    BASE4 + techs(["Esther Howard", "Ralph Edwards"]) + [CUSTOMER,
        "Create 4 work orders for the case customer, each Approved (Work Orders > New Work Order, add and approve a line): 3 "
        "with Lead Technician \"Esther Howard\" (e.g. S1-702, S1-698, S1-691) and 1 with \"Ralph Edwards\" (e.g. S1-687)."],
    OPEN_BOARD + [
        "Read the count in Esther Howard's, Ralph Edwards' and Unassigned's column headers.",
        "Drag one of Esther Howard's cards (e.g. \"S1-702\") into Ralph Edwards' column.",
        KEEP_IF_PROMPT,
        "Read the three header counts again without reloading the page.",
        "Open Ralph Edwards' card \"S1-687\" More actions > Reassign lead technician, pick Unassigned and confirm.",
        KEEP_IF_PROMPT,
        "Read the three header counts again without reloading.",
        "Pick Tech View in the display switcher and read the three group header counts.",
    ],
    ["Before the change the headers read Esther Howard 3, Ralph Edwards 1, Unassigned 0.",
     "Straight after the drag, with no reload: Esther Howard 2 (3 − 1), Ralph Edwards 2 (1 + 1), Unassigned 0.",
     "Straight after the dialog change: Ralph Edwards 1 (2 − 1), Unassigned 1 (0 + 1), Esther Howard still 2. Tech View "
     "shows the same three numbers in its group headers."],
    src(4, ["S4-R7"], "Header count definition S2-R12 / S3-R12 (work orders currently shown after filters)."),
    [q("S4-R7")],
    "Rewritten with exact seeded counts and the arithmetic of every expected number (numeric accuracy).")

SIX_LINES = [
    "Create a new work order on this build (lines created before this release follow the old rule): Work Orders > New "
    "Work Order > case customer > create it (e.g. \"S1-702\").",
    "↳ On the Lines tab add four lines with no technician: \"Line 2 Implicit\", \"Line 4 Complete\", \"Line 5 Logged\", "
    "\"Line 6 Clocked\".",
    "↳ Add \"Line 3 Explicit\", click its name to open the Edit Line dialog and choose Technicians = \"Dana Ortiz\" (a line given its own "
    "technician).",
    "↳ Set Lead Technician to \"Esther Howard\" on the work order page. Lines 2, 4, 5 and 6 now show Esther Howard in their "
    "Labor row (they follow the lead).",
    "↳ Add \"Line 1 Unassigned\". If its Labor row shows a technician, use the Labor row's More actions > Edit labor to "
    "clear it, so it reads Unassigned.",
    "↳ Click Approve (check) on all six lines (the work order reads Approved).",
    "↳ Line 4: enter a tech story (e.g. \"Done\") and complete the line, so its status is Complete.",
    "↳ Line 5: in a second browser signed in as Esther Howard, click Start time clock on Line 5's Labor row, wait at least 1 "
    "minute, then click Stop time clock, so Line 5 has logged labor.",
    "↳ Line 6: still as Esther Howard, click Start time clock on Line 6's Labor row and leave it running (no earlier labor on "
    "this line).",
    "↳ Write down each line's Labor technician: Line 1 Unassigned, Line 2 Esther Howard, Line 3 Dana Ortiz, Line 4 Esther "
    "Howard, Line 5 Esther Howard, Line 6 Esther Howard (clock running).",
]

upd(96960, "Reassigning by drag moves only open lines that follow the old lead",
    BASE4 + techs(["Esther Howard", "Ralph Edwards", "Dana Ortiz"]) + [CUSTOMER] + SIX_LINES,
    OPEN_BOARD + [
        "Drag the work order's card from Esther Howard's column into Ralph Edwards' column.",
        KEEP_IF_PROMPT,
        "Open the work order (click the card) and go to the Lines tab.",
        "Read the Labor technician of each of the six lines and whether Line 6's clock is still running.",
    ],
    ["Line 1 Unassigned now shows Ralph Edwards (a line with no technician moves to the new lead).",
     "Line 2 Implicit now shows Ralph Edwards (a line following the old lead moves).",
     "Line 3 Explicit still shows Dana Ortiz.",
     "Line 4 Complete still shows Esther Howard.",
     "Line 5 Logged still shows Esther Howard.",
     "Line 6 Clocked still shows Esther Howard and her clock is still running.",
     "So exactly 2 of the 6 lines moved (Lines 1 and 2); each line was judged on its own, and wherever a line was "
     "Complete, explicit, had labor or a running clock it stayed, even though it also followed the old lead. The drag "
     "applied the same rules as the Reassign dialog."],
    src(4, ["S4-R1", "S4-R8 (line table)", "S4-E5"],
        "Review Decisions DR-44 (lines created before the release keep today's rule; no backfill) — hence the fresh work order."),
    [q("S4-R1"), qs("S4-R8 table: no technician", "Has no technician assigned | Yes"),
     qs("S4-R8 table: implicit", "Assigned to the outgoing lead technician (an implicit assignment) | Yes"),
     qs("S4-R8 table: explicit", "Explicitly assigned to a different technician | No — the explicit assignment is preserved"),
     qs("S4-R8 table: Complete", "Status is Complete | No"),
     qs("S4-R8 table: logged labor", "Has logged labor against it | No"),
     qs("S4-R8 table: active clock-in", "Has an active clock-in on the line, including an implicit assignment with no "
        "previously logged labor | No — preserve the clock-in and that technician’s line assignment"),
     qs("S4-R8 acceptance", "Any No condition overrides a Yes condition."), q("S4-R8"), q("S4-E5")],
    "Rewritten with a six-line recipe (one line per table row) and a per-line expected result; covers the drag path.")

upd(96961, "Removing the lead returns only lines that followed it to Unassigned",
    BASE4 + techs(["Esther Howard", "Ralph Edwards", "Dana Ortiz"]) + [CUSTOMER] + SIX_LINES,
    OPEN_BOARD + [
        "Hover the work order's card in Esther Howard's column, click More actions and choose Reassign lead technician.",
        "Pick Unassigned and confirm (Esther Howard is still clocked in on Line 6).",
        KEEP_IF_PROMPT,
        "Open the work order and go to the Lines tab.",
        "Read each line's Labor technician and whether Line 6's clock is still running.",
    ],
    ["The lead is removed even though Esther Howard is clocked in: the card is in the Unassigned column and the work order "
     "has no lead technician.",
     "Line 2 Implicit now reads Unassigned (it was following the outgoing lead). Line 1 still reads Unassigned.",
     "Line 3 Explicit still shows Dana Ortiz, Line 4 Complete and Line 5 Logged still show Esther Howard.",
     "Line 6 Clocked still shows Esther Howard and her clock is still running, although she was assigned only by following "
     "the lead and had no earlier labor on it."],
    src(4, ["S4-R8 (removal)", "S4-E1", "S4-E6"], "Review Decisions DR-22 (active clock-in kept on change or removal)."),
    [qs("S4-R8 removal", "Removing the lead technician follows the same table: lines that were following the outgoing lead "
        "return to unassigned, and every other line is left as it is."),
     q("S4-E1"), q("S4-E6"),
     qs("S4-R8 table: active clock-in", "Has an active clock-in on the line, including an implicit assignment with no "
        "previously logged labor | No — preserve the clock-in and that technician’s line assignment")],
    "Title and results now match the removal path; six-line recipe; adds the running-clock checks.")

upd(96962, "A lead change adds one history entry and none for the lines it moves",
    BASE4 + techs(["Esther Howard", "Ralph Edwards", "Dana Ortiz"]) + [CUSTOMER] + new_wo("Esther Howard") + [
        "↳ Add a second line (e.g. \"Oil change\") with no technician before setting the lead, so both lines follow Esther "
        "Howard."],
    OPEN_BOARD + [
        "Note the time, then drag the card from Esther Howard's column into Ralph Edwards' column.",
        KEEP_IF_PROMPT,
        "Open the work order and open its change history (audit log). Write down where you found it.",
        "Count the entries added by this change.",
        "On the Lines tab click the first line's name to open the Edit Line dialog and set Technicians to \"Dana Ortiz\", then save.",
        "Open the change history again and read the newest entries.",
        "Repeat steps 3 to 6 using More actions > Reassign lead technician (Ralph Edwards → Esther Howard), then once more by "
        "changing Lead Technician on the work order page (Esther Howard → Ralph Edwards).",
    ],
    ["Each lead change (drag, Reassign dialog, work order page) adds exactly one entry showing the previous lead, the new "
     "lead, your user as the person who made it, and the time (e.g. Esther Howard → Ralph Edwards, by you, at the time "
     "you noted).",
     "No separate entries appear for the two lines that moved with the lead (3 lead changes = 3 entries, not 9).",
     "Changing a line's technician directly in Edit Line still adds its own line entry, as it does today."],
    src(4, ["S4-R9", "S4-R17", "S4-R18"], "Review Decisions FF-4 history (audit actor is the logged-in user)."),
    [q("S4-R9"), q("S4-R17"), q("S4-R18")],
    "Rewritten to check all three lead-change paths with a count of entries (3, not 9).")

upd(96963, "The lead of an Invoiced or Paid work order cannot be changed by any route",
    BASE4 + techs(["Esther Howard", "Ralph Edwards"]) + [CUSTOMER] + STATUS_RECIPE + [
        "Create these work orders for the case customer (Lead Technician set while they are still open): an Approved one "
        "led by Esther Howard (e.g. S1-702), an Invoiced one led by Esther Howard (e.g. S1-511), a Paid one led by Esther "
        "Howard (e.g. S1-366), an Invoiced one with no lead (e.g. S1-512), a Declined one led by Esther Howard (e.g. "
        "S1-359) and a Complete one led by Esther Howard (e.g. S1-420)."],
    OPEN_BOARD + [
        "Drag the Invoiced card \"S1-511\" from Esther Howard's column into Ralph Edwards' column.",
        "Drag \"S1-511\" into the Unassigned column.",
        "Drag \"S1-511\" within Esther Howard's column to above \"S1-702\".",
        "Repeat steps 3 to 5 with the Paid card \"S1-366\".",
        "Drag the unassigned Invoiced card \"S1-512\" into Esther Howard's column, then drag it to a new position within "
        "the Unassigned column.",
        "Drag the Declined card \"S1-359\" into Ralph Edwards' column (keep shifts if asked).",
        "Drag the Complete card \"S1-420\" into Ralph Edwards' column (keep shifts if asked).",
        "Open \"S1-511\" and try to change Lead Technician on the work order page.",
        "Pick Tech View and repeat steps 3 to 7, then drag \"S1-359\" and \"S1-420\" from Ralph Edwards' group back into Esther Howard's group.",
    ],
    ["\"S1-511\" and \"S1-366\" cannot be moved to Ralph Edwards or to Unassigned: the card returns to Esther Howard's "
     "column and the lead stays Esther Howard.",
     "\"S1-511\" and \"S1-366\" can be moved within Esther Howard's column and keep their new position. \"S1-512\" cannot "
     "be moved out of Unassigned but can be reordered inside it.",
     "The Declined \"S1-359\" and the Complete \"S1-420\" move to Ralph Edwards normally (\"Lead technician updated\").",
     "On the work order page the Lead Technician of \"S1-511\" cannot be changed either. A change sent outside the screens "
     "is also refused by the server; this part cannot be checked by hand, write 'server refusal not checked by hand' in the "
     "result comment and pass or fail on what you can see. Imported work orders are checked in their own case."],
    src(4, ["S4-R10", "S4-N2", "Key decision: lead locked once Invoiced or Paid"],
        "Review Decisions DR-37 (Declined and Complete move freely). PO answer to engineering, Sasha Grosman 24 Sep 2026 "
        "(Invoiced/Paid reorder within their technician or within Unassigned)."),
    [q("S4-R10"), q("S4-N2"),
     qs("Key decision: lead locked once Invoiced or Paid", "Lead technician cannot be changed once a work order is "
        "Invoiced or Paid. This is a product rule, not only a screen rule, so it must hold on every path that changes the "
        "lead technician — board drag, Reassign dialog, and the work order detail page.")],
    "Rewritten: every drag direction for Invoiced/Paid, reorder allowed, Declined/Complete free, detail page; server path stated plainly as not checkable by hand.")

upd(96964, "Invoiced and Paid work orders show why the lead can't be changed",
    BASE4 + techs(["Esther Howard"]) + [CUSTOMER] + STATUS_RECIPE + [
        "Create an Invoiced work order (e.g. \"S1-511\") and a Paid one (e.g. \"S1-366\") for the case customer, both with "
        "Lead Technician \"Esther Howard\" set before invoicing."],
    OPEN_BOARD + [
        "Look at the \"S1-511\" card and write down any sign that it can only be reordered within its technician (e.g. a "
        "lock icon) and any tooltip shown when you hover that sign.",
        "Hover the card, click More actions and hover the Reassign lead technician action.",
        "Read the tooltip.",
        "Repeat steps 3 to 5 for \"S1-366\".",
        "Repeat steps 3 to 6 in Tech View on the rows.",
    ],
    ["Reassign lead technician is shown disabled, and its tooltip reads exactly: The lead technician can’t be changed "
     "once a work order is Invoiced or Paid. (A straight or curly apostrophe is not a difference.)",
     "The Invoiced and Paid cards and rows carry a visible sign that they can only be reordered within their current "
     "technician and not moved to another one. The PRD does not fix its look; write down what you see."],
    src(4, ["S4-N6", "S4-N7"], "PRD §9 User Feedback Summary row \"Reassignment not allowed in current status\". " + DESIGN +
        ": lock icon next to the number with tooltip \"Invoiced · can’t be reassigned\" and a locked menu note; the PRD "
        "tooltip text is asserted here."),
    [q("S4-N6"), q("S4-N7")],
    "Rewritten with hover click-path, exact tooltip text and the visual-indicator observation.")

SHIFT_PRE = [CUSTOMER,
             "Create two Approved work orders led by \"Esther Howard\" for the case customer, each with a line \"Line 1\" "
             "(e.g. \"S1-702\" and \"S1-698\"), and a third one led by Esther Howard (e.g. \"S1-691\")."]
upd(96965, "Clear shifts removes only the old lead's whole-work-order shifts",
    BASE4 + techs(["Esther Howard", "Ralph Edwards", "Dana Ortiz"]) + SHIFT_PRE + [
        shift("Esther Howard", "\"S1-702\"", "tomorrow 8:00–12:00"),
        shift("Esther Howard", "\"S1-702\"", "tomorrow 13:00–15:00", "Choose lines", "Line 1"),
        shift("Dana Ortiz", "\"S1-702\"", "tomorrow 8:00–10:00"),
        shift("Esther Howard", "\"S1-691\"", "the day after tomorrow 8:00–12:00"),
        "Give \"S1-698\" the same two Esther Howard shifts as \"S1-702\" (8:00–12:00 entire work order, 13:00–15:00 Line 1)."],
    OPEN_BOARD + [
        "Drag \"S1-702\" from Esther Howard's column into Ralph Edwards' column.",
        "Read the prompt that opens, then click Clear shifts.",
        "Drag \"S1-698\" from Esther Howard's column into Ralph Edwards' column.",
        "In the prompt click Keep shifts.",
        "Open the Schedule for tomorrow and the day after, and read every shift on \"S1-702\", \"S1-698\" and \"S1-691\".",
    ],
    ["Both drags open a prompt asking whether to clear Esther Howard's scheduled shifts for the whole work order.",
     "After Clear shifts: \"S1-702\" is led by Ralph Edwards, Esther Howard's 8:00–12:00 whole-work-order shift on it is "
     "gone, Dana Ortiz's 8:00–10:00 shift on it is still there, and Esther Howard's shift on \"S1-691\" is untouched.",
     "After Keep shifts: \"S1-698\" is led by Ralph Edwards and both Esther Howard shifts on it are still there.",
     "Esther Howard's 13:00–15:00 Line 1 shifts are still there on both work orders: the prompt never clears line shifts."],
    src(4, ["S4-R11", "S4-R22", "S4-R23", "S4-R24"], "Review Decisions DR-31 (optional whole-work-order shift clearing). "
        "Schedule shift picker labels \"Entire work order\" / \"Choose lines\" from the Schedule suite."),
    [q("S4-R11"), q("S4-R22"), q("S4-R23"), q("S4-R24")],
    "Rewritten with named shifts (whole-order, line, another technician's, another work order's) and Keep/Clear runs.")

upd(96966, "A lead change leaves status and recorded time alone",
    BASE4 + techs(["Esther Howard", "Ralph Edwards", "Dana Ortiz"]) + [CUSTOMER] + new_wo("Esther Howard") + [
        "↳ As Esther Howard (second browser) click Start time clock on the line's Labor row, wait at least 1 minute, click Stop time "
        "clock, then click Start time clock again and leave it running; the work order now reads In Progress.",
        "↳ Write down the line's Actual hours (e.g. \"0.02 / 2.00\") and the work order's Total Hours.",
        shift("Esther Howard", "the work order", "tomorrow 8:00–12:00"),
        "If your shop locks time entries (timesheet approval), lock one of Esther Howard's entries on this work order; "
        "otherwise write 'no locked time on this site' in the result comment."],
    ["On the Schedule, drag Esther Howard's shift on this work order to 13:00–17:00, then resize it to 13:00–16:00, then "
     "drag it onto Dana Ortiz's row.",
     "Open the work order and read Lead Technician and Status.",
     ] + OPEN_BOARD + [
        "Drag the card from Esther Howard's column into Ralph Edwards' column and click Clear shifts if the prompt opens.",
        "Open the work order and read Status, the running clock, the line's Actual hours and Total Hours.",
    ],
    ["Moving, resizing and reassigning the shift on the Schedule does not change the lead: Lead Technician still reads "
     "Esther Howard after step 2.",
     "After the lead change the Status still reads In Progress.",
     "Recorded time is unchanged (Actual hours and Total Hours as written down, plus only the minutes the running clock "
     "added), Esther Howard's clock is still running, and any locked entry is unchanged."],
    src(4, ["S4-R19", "S4-R20", "S4-R21"], "Review Decisions DR-18 / DR-31."),
    [q("S4-R19"), q("S4-R20"), q("S4-R21")],
    "Rewritten with Schedule move/resize/reassign steps and recorded-time numbers to compare.")

upd(96967, "A user without create and edit cannot drag or reassign work orders",
    [SIGN_CE, SCREEN, LOC] + techs(["Esther Howard", "Ralph Edwards"]) + [
        "A second user whose role has Work Orders view but not Work Orders create and edit (e.g. \"Vera Viewonly\"): "
        "Settings > Roles & Permissions > Create custom role (e.g. \"WO View Only\") with Work Orders view only > Save, "
        "then Settings > Staff > add \"Vera Viewonly\" with that role and an email, enrolled at this location.",
        CUSTOMER] + new_wo("Esther Howard"),
    ["In a second browser sign in as Vera Viewonly and pick the same location.",
     ] + OPEN_BOARD + [
        "Try to drag the card from Esther Howard's column into Ralph Edwards' column.",
        "Try to drag the card to a different position within Esther Howard's column.",
        "Hover the card and look for More actions and Reassign lead technician.",
        "Repeat steps 4 to 6 in Tech View.",
        "In your first browser (your own user) open the work order and read Lead Technician.",
    ],
    ["Vera Viewonly cannot drag the card to another technician or within the column; it stays where it was and the lead "
     "stays Esther Howard.",
     "Vera Viewonly is not offered Reassign lead technician (no More actions button, or the action is missing or disabled)."],
    src(4, ["S4-N1"], "PRD §4 Key decision \"Permissions\". " + DESIGN + ": more-actions button hidden without the "
        "assign permission; a refused drag shows \"You don’t have permission to assign technicians\"."),
    [q("S4-N1")],
    "Rewritten with a by-hand recipe for a view-only user and both views.")

upd(96968, "A reassign that cannot be saved puts the card back with an alert",
    BASE4 + techs(["Esther Howard", "Ralph Edwards"]) + [CUSTOMER] + new_wo("Esther Howard"),
    OPEN_BOARD + [
        "Turn off this computer's network connection (e.g. switch Wi-Fi off) while the board stays open.",
        "Drag the card from Esther Howard's column into Ralph Edwards' column.",
        "Read where the card ends up and the alert that appears.",
        "Wait 10 seconds, then click the alert's close (X) button.",
        "Turn the network back on and reload the page.",
        "Repeat steps 3 to 7 in Tech View.",
    ],
    ["The card (or row) goes back to Esther Howard's column (group).",
     "An alert reads exactly \"Failed to update lead technician, please try again.\", stays on screen until you close it, "
     "and closes when you click X. After the reload the lead is still Esther Howard. If the app shows a different "
     "offline message instead, write down its words: that is a deviation to report."],
    src(4, ["S4-N3", "S4-N8"], "PRD §9 User Feedback Summary row \"Reassignment fails\" (\"Alert; card/row returns to "
        "origin; user dismisses\")."),
    [q("S4-N3"), q("S4-N8")],
    "Replaces 'force the request to fail' with a by-hand method (network off) and exact alert text.")

upd(96969, "Choosing the current lead again changes nothing and shows no message",
    BASE4 + techs(["Esther Howard", "Ralph Edwards"]) + [CUSTOMER] + new_wo("Esther Howard") + [
        "↳ Add a second line \"Line 2\" after the lead is set and clear its technician (Labor row > More actions > Edit "
        "labor) so its Labor row reads Unassigned."],
    OPEN_BOARD + [
        "Hover the card in Esther Howard's column, click More actions and choose Reassign lead technician.",
        "Pick Esther Howard (the current lead) and confirm.",
        "Watch the bottom of the screen for 10 seconds.",
        "Open the work order, read Lead Technician and Line 2's Labor row, and open its change history.",
    ],
    ["No \"Lead technician updated\" message (or any reassignment message) appears.",
     "Nothing changes: Lead Technician is still Esther Howard, Line 2 still reads Unassigned (it is not given to Esther "
     "Howard), and no new history entry is added."],
    src(4, ["S4-N4", "R-1 (release note, item 3)"]),
    [q("S4-N4"), qs("R-1 (release note, item 3)", "(3) choosing the same lead technician again no longer assigns the "
                    "unassigned lines")],
    "Adds an unassigned line to prove 'no assignment change' and the release-note behaviour.")

upd(96970, "Nothing can be dropped on an inactive or unenrolled technician",
    BASE4 + techs(["Esther Howard", "Ralph Edwards", "Dana Ortiz"]) + [CUSTOMER,
        "Create three Approved work orders for the case customer: one led by Esther Howard (e.g. \"S1-702\"), one led by "
        "Ralph Edwards (e.g. \"S1-698\") and one led by Dana Ortiz (e.g. \"S1-691\").",
        "Deactivate Esther Howard: Settings > Staff > Esther Howard > set the record Inactive > Save.",
        "Un-enrol Dana Ortiz from this location (Settings > Staff > Dana Ortiz > remove this location > Save); she stays Active."],
    OPEN_BOARD + [
        "Find Esther Howard's column and Dana Ortiz's column (they stay because they lead matching work) and read their headers.",
        "Drag \"S1-698\" from Ralph Edwards' column onto Esther Howard's column.",
        "Drag \"S1-698\" onto Dana Ortiz's column.",
        "Repeat steps 4 and 5 in Tech View on the groups.",
    ],
    ["Esther Howard's column/group is still shown with her work order and is marked inactive.",
     "Neither drop is accepted: \"S1-698\" returns to Ralph Edwards' column and its lead stays Ralph Edwards. The same "
     "happens in Tech View."],
    src(4, ["S4-N5"], "S2-N2/S3-N2 (deactivated lead keeps matching work visible). PO answer to engineering, Sasha "
        "Grosman 24 Sep 2026: technicians who are active but no longer eligible here are treated like inactive."),
    [q("S4-N5")],
    "Rewritten with deactivation and un-enrolment recipes and both views.")

upd(96971, "When two people reassign the same work order, the later one wins",
    BASE4 + techs(["Esther Howard", "Ralph Edwards", "Dana Ortiz"]) + [
        "A second user with Work Orders view and create and edit (e.g. \"Sam Second\", created under Settings > Staff with "
        "an Admin role), signed in in a second browser at the same location.",
        CUSTOMER] + new_wo("Esther Howard"),
    ["In both browsers open Work Orders, click the All tab, pick Board View and search for the case customer.",
     "In browser 1, move the card to Ralph Edwards with More actions > Reassign lead technician (keep shifts if asked).",
     "In browser 2, without reloading, move the same card (still shown in Esther Howard's column) to Dana Ortiz with More "
     "actions > Reassign lead technician (keep shifts if asked).",
     "Reload the page in both browsers.",
     "Open the work order in both browsers and read Lead Technician."],
    ["Dana Ortiz, the later change, is the final lead.",
     "After the reload both browsers show the card in Dana Ortiz's column and the work order page reads Dana Ortiz in both."],
    src(4, ["S4-E2", "S4-E7"]),
    [q("S4-E2"), q("S4-E7")],
    "Rewritten with a second user recipe and two browsers.")

upd(96972, "A reassign is refused if the work order was just invoiced elsewhere",
    BASE4 + techs(["Esther Howard", "Ralph Edwards"]) + [
        "A second user with create and edit and invoicing permission (e.g. \"Sam Second\", Admin role) in a second browser.",
        CUSTOMER] + STATUS_RECIPE + [
        "A Complete work order for the case customer led by Esther Howard (e.g. \"S1-420\") with a contact person, so it "
        "can be invoiced."],
    ["In browser 1 open Work Orders, click the All tab, pick Board View and search for the case customer. The card shows Complete.",
     "In browser 2 open \"S1-420\" and invoice it (Finance tab > Create Invoice). Its status is now Invoiced.",
     "In browser 1, without reloading, drag \"S1-420\" from Esther Howard's column into Ralph Edwards' column.",
     "Read where the card ends up and the alert, then close the alert.",
     "Reload browser 1 and read the card's column."],
    ["The drop is refused: the card goes back to Esther Howard's column and the lead stays Esther Howard.",
     "An alert reads \"Failed to update lead technician, please try again.\" and also explains the status (e.g. that the "
     "work order is now Invoiced). Write down the explanation. The status cannot be changed in the middle of a single "
     "drag by hand; a board that still shows the old status is the same situation for the user."],
    src(4, ["S4-E3", "S4-N3", "S4-N8"]),
    [q("S4-E3"), q("S4-N3"), q("S4-N8")],
    "Replaces 'dev support' with a two-browser method.")

upd(96973, "Reassign can pick a technician outside the filter and the card then leaves",
    [SIGN_CE + " Your own staff record must also be an eligible technician (Settings > Staff > your record > Clockable on, "
               "role not Office or Time Clock User, enrolled here), e.g. \"Aaron Keating\".", SCREEN, LOC]
    + techs(["Ralph Edwards", "Dana Ortiz"]) + [CUSTOMER] + new_wo("Aaron Keating") + [
        "↳ Make sure you are not this work order's service advisor and no line is assigned to anyone but you."],
    ["Open Work Orders, click the All tab, pick Board View and turn on Assigned to me.",
     "Write down which technician columns are shown.",
     "Hover the card, click More actions and choose Reassign lead technician.",
     "Read the technicians offered.",
     "Pick Ralph Edwards and confirm (keep shifts if asked).",
     "Read the board and its header count."],
    ["The dialog offers Ralph Edwards and Dana Ortiz although their columns are not on screen under Assigned to me.",
     "After the change the work order no longer matches Assigned to me and disappears from the board without a reload "
     "(your column count goes from 1 to 0)."],
    src(4, ["S4-E4", "S4-E8"], "Assigned to me behaviour S1-R13 / S3-N1."),
    [q("S4-E4"), q("S4-E8")],
    "Rewritten with Assigned to me as the filter that hides the destination, and the count change.")

upd(96974, "The dialog's open count is the technician's Approved to Complete work",
    BASE4 + techs(["Esther Howard", "Nina Newtech"]) + [
        "\"Nina Newtech\" must be a technician created for this case (no other work), so the expected number is known.",
        CUSTOMER] + STATUS_RECIPE + [
        "Create these work orders for the case customer with Lead Technician \"Nina Newtech\" (set the lead while they are "
        "open): 1 Estimate, 1 Approved, 1 In Progress, 1 Review, 1 Complete, 1 Invoiced, 1 Paid, 1 Declined.",
        "Create 1 more Approved work order led by Esther Howard where Nina Newtech is only the technician on a line "
        "(Edit Line > Technicians = Nina Newtech).",
        "If Nina Newtech is also enrolled at a second location, create 1 Approved work order there led by her; otherwise "
        "write 'second location not checked' in the result comment."],
    ["Open Work Orders, click the Work Orders tab (so Estimates, Invoiced and Paid are filtered out of the page) and pick "
     "Board View.",
     "Hover any card in Esther Howard's column, click More actions and choose Reassign lead technician.",
     "Find Nina Newtech in the dialog and read her open count (e.g. \"4 open\").",
     "Click Cancel."],
    ["Nina Newtech's count reads 4 open: Approved 1 + In Progress 1 + Review 1 + Complete 1 = 4.",
     "Estimate, Invoiced, Paid and Declined are not counted (8 work orders led, 4 counted), her line-only work order on "
     "Esther Howard's work order is not counted, any work at another location is not counted, and the page's tab or "
     "filters do not change the number."],
    src(4, ["S4-R15"], "Review Decisions DR-43 / MF-3. PO answer to engineering, Sasha Grosman 24 Sep 2026 (lead only, "
        "current location, regardless of the page's filters), recorded in the tech plan §1.4. Jira SV-10047 still lists "
        "three statuses; the PRD (four) is followed."),
    [q("S4-R15"), qt("Tech plan §1.4 (MF-3 answer)", "Confirmed **plus Complete**: lead only, current location, Approved / "
                     "In Progress / Ready for Review / **Complete**, ignoring page filters")],
    "Rewritten as an exact numeric check (8 led, 4 counted) with lead-only, location and filter isolation.")

upd(154887, "An Imported work order's Reassign lead technician is disabled with its tooltip",
    BASE4 + [
        "An Imported work order exists at this location. Imported work orders come from a data import; to find one, open "
        "Work Orders in List, click the All tab, open Status and tick Imported (e.g. \"S2-17578\"). If there is none, mark "
        "the case Blocked with 'no Imported work order on this site'."],
    ["In List, note the Imported work order's number (e.g. \"S2-17578\").",
     "Pick Board View in the display switcher and search for that number.",
     "If the card is shown, hover it, click More actions and hover the Reassign lead technician action.",
     "Read the tooltip.",
     "Repeat in Tech View.",
     "If the Imported work order cannot be shown in Board View or Tech View at all (for example the Status filter's "
     "Imported option is disabled there), write down exactly what you see."],
    ["Reassign lead technician is disabled on the Imported work order and its tooltip reads exactly: The lead technician "
     "can’t be changed on an imported work order.",
     "If an Imported work order never appears in Board View or Tech View, so the action cannot be reached, mark the case "
     "Blocked with 'Imported work orders are not shown in Tech View or Board View'. That is an open product question, "
     "not a failure."],
    src(4, ["S4-N9"], "Review Decisions DR-37 (Chris Ward, 29 Sep 2026). Tech plan §3.26 / PO answer 24 Sep 2026: Imported is "
        "excluded from the board displays. " + DESIGN + ": Imported cards show \"Imported · review before assigning\"."),
    [q("S4-N9"), qt("Tech plan §3.26", "Imported is excluded from the board displays (follow-up A3). While the Imported "
                    "status chip is selected, Tech View and Board View are disabled in the switcher with a tooltip; while "
                    "in Tech View or Board View, the Imported option in the Status filter is disabled.")],
    "Rewritten with how to find an Imported work order and an honest Blocked path, since the tech plan keeps Imported out of both views.")

upd(154888, "Clear shifts keeps ended shifts, removes future ones, trims a running one",
    BASE4 + techs(["Esther Howard", "Dana Ortiz"]) + [CUSTOMER] + new_wo("Esther Howard") + [
        shift("Esther Howard", "this work order", "yesterday 8:00–12:00 (already ended)"),
        shift("Esther Howard", "this work order", "tomorrow 8:00–12:00 (not started)"),
        shift("Esther Howard", "this work order", "today, starting 1 hour before you run the test and ending 2 hours after "
              "(e.g. 9:00–12:00 when you test at 10:00)")],
    OPEN_BOARD + [
        "Note the exact time on your clock (e.g. 10:00).",
        "Drag the card from Esther Howard's column into Dana Ortiz's column.",
        "In the prompt click Clear shifts.",
        "Open the Schedule and read Esther Howard's shifts on this work order for yesterday, today and tomorrow.",
    ],
    ["Yesterday's 8:00–12:00 shift is unchanged.",
     "Tomorrow's 8:00–12:00 shift is gone.",
     "Today's shift now ends at the time of the change: e.g. 9:00–12:00 now reads 9:00–10:00 (3 hours before, 1 hour "
     "after). The part already under way stays on the Schedule and the rest is removed, just as Jeremy's 8:00–12:00 shift "
     "becomes 8:00–10:00 when the lead changes to Dana at 10:00."],
    src(4, ["S4-R25"], "Review Decisions DR-38. Tech plan §12.2 item 12 still says a running shift is deleted whole; the "
        "PRD (trim) is followed."),
    [q("S4-R25")],
    "Rewritten with a seeding recipe for ended, future and running shifts and the before/after arithmetic.")

upd(154889, "Removing the lead asks the same clear-shifts question as changing it",
    BASE4 + techs(["Esther Howard"]) + [CUSTOMER,
        "Create two Approved work orders led by Esther Howard for the case customer (e.g. \"S1-702\", \"S1-698\").",
        shift("Esther Howard", "each of them", "tomorrow 8:00–12:00")],
    OPEN_BOARD + [
        "Drag \"S1-702\" from Esther Howard's column into the Unassigned column.",
        "Read the prompt's title, text and buttons, then click Keep shifts.",
        "Hover \"S1-698\", click More actions > Reassign lead technician, pick Unassigned and confirm.",
        "Read the prompt, then click Keep shifts.",
    ],
    ["Both removals open the same shift-clearing prompt as a change of lead: title \"Clear Esther Howard's scheduled "
     "shifts?\" with the buttons Keep shifts, Clear shifts and Cancel.",
     "After Keep shifts both work orders are in Unassigned and Esther Howard's shifts are still on the Schedule."],
    src(4, ["S4-R26", "S4-R29"], "Review Decisions DR-46 / FF-4."),
    [q("S4-R26"), q("S4-R29")],
    "Corrected: removal by drag and by the dialog (the work order page does not prompt, so it was removed from the steps).")

upd(154890, "If shifts can't be cleared, the lead does not change either",
    BASE4 + techs(["Esther Howard", "Ralph Edwards"]) + [CUSTOMER] + new_wo("Esther Howard") + [
        shift("Esther Howard", "the work order", "tomorrow 8:00–12:00")],
    OPEN_BOARD + [
        "Drag the card from Esther Howard's column into Ralph Edwards' column; the prompt opens.",
        "Turn off this computer's network connection (e.g. Wi-Fi off).",
        "Click Clear shifts.",
        "Read the card's position and the alert, then close the alert.",
        "Turn the network back on, reload, open the work order and read Lead Technician, then open the Schedule for tomorrow.",
    ],
    ["Nothing is half done: the card goes back to Esther Howard's column, Lead Technician still reads Esther Howard, and "
     "her 8:00–12:00 shift is still on the Schedule.",
     "The alert reads \"Failed to update lead technician, please try again.\". A failure of only the shift clearing (with "
     "the lead change itself able to save) cannot be caused by hand; write 'clearing-only failure not checked by hand' in "
     "the result comment and pass or fail on what you can see."],
    src(4, ["S4-R27"], "Review Decisions DR-46; tech plan §12.1 (clearing failure rolls back the lead change)."),
    [q("S4-R27"), q("S4-N8")],
    "Replaces 'Schedule service unavailable' with a by-hand network-off method and states plainly what cannot be forced.")

# ---- new Story 4 cases
new("NEW-B-01", 4, "The clear-shifts question appears only for the old lead's unfinished shifts",
    BASE4 + techs(["Esther Howard", "Ralph Edwards", "Dana Ortiz"]) + [CUSTOMER,
        "Create six Approved work orders led by Esther Howard for the case customer, each with a line \"Line 1\": A (e.g. "
        "S1-701), B (S1-702), C (S1-703), D (S1-704), E (S1-705), F (S1-706).",
        shift("Esther Howard", "A", "tomorrow 8:00–12:00"),
        "B has no shifts at all.",
        shift("Esther Howard", "C", "tomorrow 8:00–12:00", "Choose lines", "Line 1"),
        shift("Esther Howard", "D", "yesterday 8:00–12:00 (already ended)"),
        shift("Dana Ortiz", "E", "tomorrow 8:00–12:00"),
        shift("Esther Howard", "a different work order (not F)", "tomorrow 13:00–15:00")],
    OPEN_BOARD + [
        "Drag A from Esther Howard's column into Ralph Edwards' column and note whether a prompt opens (if it does, click "
        "Keep shifts).",
        "Do the same, one at a time, for B, C, D, E and F.",
    ],
    ["Only A opens the \"Clear Esther Howard's scheduled shifts?\" prompt (1 of 6).",
     "B (no shift), C (only a line shift), D (only an ended shift), E (only Dana Ortiz's shift) and F (Esther Howard's "
     "shift is on another work order) change lead straight away with \"Lead technician updated\" and no prompt (5 of 6)."],
    src(4, ["S4-R28"], "PO answer to engineering, Sasha Grosman 24 Sep 2026 (only the outgoing lead's whole-work-order shifts "
        "that haven't ended)."),
    [q("S4-R28"), qt("Tech plan §1.4 (FF-4 shift scope)", "Confirmed: only the outgoing lead's whole-work-order shifts that "
                     "have not ended")],
    "S4-R28 (new): when the prompt shows, with one positive and five negative work orders.")

new("NEW-B-02", 4, "The clear-shifts question shows its exact title, text and buttons",
    BASE4 + techs(["Esther Howard", "Ralph Edwards"]) + [CUSTOMER] + new_wo("Esther Howard") + [
        shift("Esther Howard", "the work order", "tomorrow 8:00–12:00")],
    OPEN_BOARD + [
        "Drag the card from Esther Howard's column into Ralph Edwards' column.",
        "Read the prompt's title, its text and the labels of its buttons, word for word.",
        "Click Keep shifts.",
    ],
    ["The title reads exactly: Clear Esther Howard's scheduled shifts?",
     "The text reads exactly: Esther Howard has shifts scheduled for this whole work order. Clearing removes shifts that "
     "haven't started and ends one that's under way now. Shifts on individual lines and recorded time don't change.",
     "The buttons read exactly Keep shifts, Clear shifts and Cancel (3 buttons).",
     "When there is no name to show the title must read: Clear the lead technician's scheduled shifts? A technician "
     "without a name cannot be set up by hand; write 'no-name title not checked by hand' in the result comment. A straight "
     "or curly apostrophe is not a difference; any other word difference is a failure."],
    src(4, ["S4-R29"], "PO decision Chris Ward 6 Oct 2026 on the PRD page (\"lock your wording as written\"); PRD §Design "
        "updates note (S4-R28 to S4-R31 decided in the PRD, not by design)."),
    [q("S4-R29")],
    "S4-R29 (new): exact prompt wording asserted word for word, name filled in.")

new("NEW-B-03", 4, "Cancel or closing the clear-shifts question calls the change off",
    BASE4 + techs(["Esther Howard", "Ralph Edwards"]) + [CUSTOMER] + new_wo("Esther Howard") + [
        shift("Esther Howard", "the work order", "tomorrow 8:00–12:00")],
    OPEN_BOARD + [
        "Drag the card from Esther Howard's column into Ralph Edwards' column.",
        "In the prompt click Cancel.",
        "Drag the card into Ralph Edwards' column again and close the prompt with its close (X) button.",
        "Hover the card, click More actions > Reassign lead technician, pick Ralph Edwards and confirm.",
        "In the prompt click Cancel and read the screen.",
        "Click Cancel in the Reassign lead technician dialog.",
        "Open the work order and read Lead Technician, then open the Schedule for tomorrow.",
        "Repeat steps 3 to 8 in Tech View.",
    ],
    ["After Cancel and after X the dragged card goes back to its place in Esther Howard's column, and no \"Lead technician "
     "updated\" message appears.",
     "After Cancel from the dialog path you are back in the Reassign lead technician dialog with Ralph Edwards still chosen.",
     "In the end nothing changed: Lead Technician is Esther Howard and her 8:00–12:00 shift is still on the Schedule."],
    src(4, ["S4-R30"], "PO decision Chris Ward 6 Oct 2026 (\"Cancel undoes the move\")."),
    [q("S4-R30")],
    "S4-R30 (new): Cancel and X on both the drag and the dialog path, in both views.")

new("NEW-B-04", 4, "The clear-shifts question shows on Board and Tech View only",
    BASE4 + techs(["Esther Howard", "Ralph Edwards"]) + [CUSTOMER] + new_wo("Esther Howard") + [
        shift("Esther Howard", "the work order", "tomorrow 8:00–12:00")],
    OPEN_BOARD + [
        "Drag the card from Esther Howard's column into Ralph Edwards' column. Note whether the prompt opens, click Keep shifts.",
        "Drag the card back into Esther Howard's column.",
        "Use More actions > Reassign lead technician to pick Ralph Edwards and confirm. Note the prompt, click Keep shifts.",
        "Move it back to Esther Howard the same way.",
        "Pick Tech View and repeat steps 3 to 6 with the row (drag between groups, then the row's More actions).",
        "Open the work order page and change Lead Technician from Esther Howard to Ralph Edwards there.",
        "Pick List in the display switcher and look for any way to change the lead from a List row.",
        "Open the Schedule for tomorrow.",
    ],
    ["The prompt opens 4 times: Board View drag, Board View dialog, Tech View drag and Tech View dialog.",
     "Changing the lead on the work order page does not show the prompt, and the List offers no lead change at all, so "
     "no prompt appears there either (as today).",
     "Esther Howard's 8:00–12:00 shift is still on the Schedule (every choice was Keep shifts or no prompt)."],
    src(4, ["S4-R31"], "PO decision Chris Ward 6 Oct 2026; DR-33 (List gets no lead reassignment)."),
    [q("S4-R31")],
    "S4-R31 (new): all four board paths prompt, work order page and List do not.")

new("NEW-B-05", 4, "A reorder that cannot be saved shows its alert and the card goes back",
    BASE4 + techs(["Esther Howard"]) + [CUSTOMER,
        "Create three Approved work orders led by Esther Howard for the case customer (e.g. \"S1-701\", \"S1-702\", \"S1-703\")."],
    OPEN_BOARD + [
        "Write down the order of the three cards in Esther Howard's column (e.g. S1-701, S1-702, S1-703).",
        "Turn off this computer's network connection (e.g. Wi-Fi off).",
        "Drag the last card to the top of Esther Howard's column.",
        "Read the alert and the order of the cards.",
        "Turn the network back on and reload.",
        "Repeat steps 3 to 7 in Tech View.",
    ],
    ["An alert reads exactly: Couldn't save the new order. Please try again. (A straight or curly apostrophe is not a "
     "difference.)",
     "The card goes back to where it was, so the order is again as written down, and stays so after the reload. No lead "
     "change message appears."],
    src(4, ["S4-N10"], "PO decision Chris Ward 6 Oct 2026 (two sentences)."),
    [q("S4-N10")],
    "S4-N10 (new): failed reorder alert text and card return, by hand with the network off.")

new("NEW-B-06", 4, "Dropping next to a card someone just moved shows a refresh alert",
    BASE4 + techs(["Esther Howard", "Ralph Edwards"]) + [
        "A second user with Work Orders view and create and edit (e.g. \"Sam Second\", Admin role) in a second browser.",
        CUSTOMER,
        "Create three Approved work orders led by Esther Howard for the case customer (e.g. \"S1-701\", \"S1-702\", \"S1-703\")."],
    ["In both browsers open Work Orders, click the All tab, pick Board View and search for the case customer.",
     "In browser 2 drag \"S1-702\" into Ralph Edwards' column (keep shifts if asked).",
     "In browser 1, without reloading, drag \"S1-703\" and drop it directly above \"S1-702\" (still shown in Esther Howard's "
     "column there).",
     "Read the alert in browser 1 and where \"S1-703\" ends up.",
     "Reload browser 1."],
    ["Browser 1 shows an alert reading exactly: The card you dropped this next to has moved. Refresh the board and try "
     "again.",
     "\"S1-703\" goes back to where it was, and after the reload the board matches browser 2 (S1-702 under Ralph Edwards)."],
    src(4, ["S4-N11"], "PO decision Chris Ward 6 Oct 2026 (\"OK as written\")."),
    [q("S4-N11")],
    "S4-N11 (new): stale-neighbour drop with two browsers.")

new("NEW-B-07", 4, "Two drops into one technician at once show a board-busy alert",
    BASE4 + techs(["Esther Howard", "Ralph Edwards"]) + [
        "A second user with Work Orders view and create and edit (e.g. \"Sam Second\", Admin role) in a second browser, "
        "both screens side by side.",
        CUSTOMER,
        "Create two Approved work orders led by Esther Howard for the case customer (e.g. \"S1-701\", \"S1-702\")."],
    ["In both browsers open Work Orders, click the All tab, pick Board View and search for the case customer.",
     "In browser 1 start dragging \"S1-701\" over Ralph Edwards' column; in browser 2 start dragging \"S1-702\" over Ralph "
     "Edwards' column.",
     "Count 3-2-1 and release both at the same moment (keep shifts if asked).",
     "Read any alert in either browser and where each card ends up.",
     "Repeat steps 2 to 4 up to five times, then reload both browsers."],
    ["If the second drop cannot be saved in time, that browser shows an alert reading exactly: The board is busy with "
     "another move. Please try again. and its card goes back to where it was.",
     "Two people dropping at exactly the same moment cannot be guaranteed by hand. If every drop saved, write 'busy alert "
     "not reproduced by hand' in the result comment and pass or fail on what you can see: no card may be lost or shown "
     "twice, and after the reload each card is in exactly one column."],
    src(4, ["S4-N12"], "PO decision Chris Ward 6 Oct 2026. Jira SV-10985 (a held column lock makes drops fail as 'busy')."),
    [q("S4-N12")],
    "S4-N12 (new): concurrent drops; exact alert asserted when it appears, honest note when it cannot be produced.")

new("NEW-B-08", 4, "Assigning a lead to unassigned work moves only open unassigned lines",
    BASE4 + techs(["Ralph Edwards", "Dana Ortiz"]) + [CUSTOMER,
        "Create a new work order on this build for the case customer with no lead technician (e.g. \"S1-710\").",
        "↳ Add \"Line 1 Unassigned\" with no technician.",
        "↳ Add \"Line 2 Explicit\" and in Edit Line set Technicians = \"Dana Ortiz\".",
        "↳ Add \"Line 3 Complete\" with no technician, approve it, enter a tech story and complete it.",
        "↳ Approve the other lines (the work order reads Approved).",
        "↳ Write down each line's Labor row: Line 1 Unassigned, Line 2 Dana Ortiz, Line 3 Unassigned (Complete)."],
    OPEN_BOARD + [
        "Hover the card in the Unassigned column, click More actions > Reassign lead technician.",
        "Pick Ralph Edwards and confirm.",
        "Open the work order's Lines tab and read each line's Labor row.",
    ],
    ["The card moves to Ralph Edwards' column with \"Lead technician updated\".",
     "Line 1 now shows Ralph Edwards. Line 2 still shows Dana Ortiz. Line 3 (Complete) still reads Unassigned. So 1 of 3 "
     "lines moved."],
    src(4, ["S4-R8 (assign path)"], "PRD acceptance note under the S4-R8 table (all six rows for assign, reassign and remove)."),
    [q("S4-R8"), qs("S4-R8 acceptance", "Acceptance criteria must cover all six rows for assign, reassign and remove. Any No "
                    "condition overrides a Yes condition."),
     qs("S4-R8 table: no technician", "Has no technician assigned | Yes"),
     qs("S4-R8 table: explicit", "Explicitly assigned to a different technician | No — the explicit assignment is preserved"),
     qs("S4-R8 table: Complete", "Status is Complete | No")],
    "S4-R8 assign path (added in this full pass): the PRD asks for assign, reassign and remove; assign had no case.")

# ====================================================================================== STORY 5
BASE5 = [SIGN_CE, SCREEN, LOC]
FIELDS13 = ("lead technician name, customer, asset (year/make/model), VIN/serial, progress, service advisor, clocked in, "
            "line count, line technicians, estimated hours, total price, on-site indicator and created date")

upd(96975, "Tech View keeps its own column choice, separate from List, for each user",
    BASE5 + techs(["Esther Howard"]) + [
        "A second browser or computer, and a second location you can switch to in the top bar (e.g. \"Trailer Shop\").",
        CUSTOMER] + new_wo("Esther Howard"),
    ["Open Work Orders in List, open the column chooser (Columns) and write down which columns are on.",
     "Pick Tech View, open its column chooser, turn Service Advisor off and Assigned Techs on.",
     "Pick List and read whether Service Advisor and Assigned Techs changed there.",
     "In List turn Progress off.",
     "Pick Tech View and read whether Progress changed there.",
     "Log out, log back in and open Tech View.",
     "In the second browser sign in as the same user and open Tech View.",
     "Switch to the second location in the top bar and open Tech View.",
     "Open List in each of the above and read its columns."],
    ["Tech View's choice does not touch List: after step 3 List still shows Service Advisor (and has no Assigned Techs). "
     "List's choice does not touch Tech View: after step 5 Tech View still shows Progress.",
     "Tech View keeps Service Advisor off and Assigned Techs on after logging back in, in the second browser and at the "
     "second location. List keeps its own columns (Progress off) exactly as it saves them today."],
    src(5, ["S5-R1", "S5-R8"], "Review Decisions DR-33 (Tech View's column selection separate from List both ways)."),
    [q("S5-R1"), q("S5-R8")],
    "Rewritten: each direction of independence checked, persistence over logout, second browser and second location.")

upd(96976, "Board View's Fields to display applies to cards and is saved per user",
    BASE5 + techs(["Esther Howard"]) + [
        "A second browser or computer, and a second location you can switch to in the top bar.",
        CUSTOMER] + new_wo("Esther Howard") + ["↳ Give the asset a VIN (e.g. \"1FD0W5HY2EEA05499\")."],
    ["Open Work Orders, pick Tech View and note where its column chooser sits in the toolbar and how it works.",
     ] + OPEN_BOARD + [
        "Open Fields to display (in the same toolbar spot) and read how it works.",
        "Turn Customer off and VIN/serial on.",
        "Read the card.",
        "Log out, log back in and open Board View.",
        "In the second browser sign in as the same user and open Board View.",
        "Switch to the second location and open Board View.",
    ],
    ["Board View has its own Fields to display picker, in the same toolbar position and working the same way (a list of "
     "fields you tick on or off) as Tech View's column chooser.",
     "Optional fields can be turned on and off: the card stops showing the customer and starts showing the VIN.",
     "The choice (Customer off, VIN/serial on) is still in force after logging back in, in the second browser and at the "
     "second location.",
     "Each saved field change is also recorded for the product team's usage reports. This part cannot be checked by hand; "
     "write 'usage recording not checked by hand' in the result comment (the Usage analytics folder covers it)."],
    src(5, ["S5-R2", "S5-R9", "S5-R10", "S5-R7"], DESIGN + ": Board View has only \"Card size\" and no Fields to display "
        "picker (design follow-up UX-12 open); the PRD is followed."),
    [q("S5-R2"), q("S5-R9"), q("S5-R10"), q("S5-R7")],
    "Rewritten with a concrete field change, persistence checks and the S5-R7 analytics link stated as not checkable by hand.")

upd(96977, "Work order number, unit number and status cannot be turned off on cards",
    BASE5 + techs(["Esther Howard"]) + [CUSTOMER] + new_wo("Esther Howard"),
    OPEN_BOARD + [
        "Open Fields to display.",
        "Try to turn off Work order number, Unit number and Status.",
        "Close the picker and read the card.",
    ],
    ["Work order number, Unit number and Status are shown as always on and cannot be turned off.",
     "The card still shows the work order number (e.g. \"S1-702\"), the unit (e.g. \"TRK-118\") and the status (e.g. "
     "\"Approved\")."],
    src(5, ["S5-R3"], "S3-R4 (cards include the mandatory fields)."),
    [q("S5-R3")],
    "Rewritten for the Board View picker (the mandatory fields are card fields); click-path and example values added.")

upd(96978, "Fields to display offers the 13 optional fields with their usual values",
    BASE5 + techs(["Esther Howard", "Ralph Edwards"]) + [CUSTOMER,
        "Create an Approved work order for the case customer (e.g. \"S1-702\"): Lead Technician \"Esther Howard\", Service "
        "Advisor (e.g. \"James Smith\"), asset with a VIN, 3 lines with labor hours (e.g. 2.0 + 3.0 + 3.0 = 8.0 estimated "
        "hours), \"Line 2\" given to Ralph Edwards in Edit Line, Asset on site turned on.",
        "↳ In a second browser, sign in as Esther Howard and click Start time clock on Line 1's Labor row, and as Ralph Edwards do the same on Line 2 "
        "(two people clocked in)."],
    ["Open Work Orders in List, search for the case customer and write down the row's values: Lead Technician, Customer, "
     "Asset, VIN/Serial #, Progress, Service Advisor, Clocked In, Lines, Assigned Tech, Total price, On Site, Created on.",
     "Hover the Clocked In value and read the names.",
     "Pick Board View, open Fields to display and count the optional fields offered.",
     "Turn every optional field on.",
     "Compare each field on the card with the List value, and hover the clocked-in field."],
    ["Fields to display offers 13 optional fields: " + FIELDS13 + ".",
     "Each field on the card shows the same value as List for the same work order (e.g. 8.0 estimated hours, 3 lines, "
     "the same total price).",
     "Clocked in shows the names of the technicians clocked in the way List's Clocked In column does: first name, then "
     "+N (e.g. \"Esther +1\"), and hovering shows every name (Esther Howard, Ralph Edwards)."],
    src(5, ["S5-R11"], "PO answer Chris Ward 25 Sep 2026 (\"The clocked in field shows technician names, as List does\")."),
    [q("S5-R11"), qs("S5-R11 field list", "lead technician name, customer, asset (year/make/model), VIN/serial, progress, "
                     "service advisor, clocked in (the names of the technicians currently clocked in to the work order, "
                     "shown the way List’s Clocked In column shows them today: first name, then +N, with every name on "
                     "hover), line count, line technicians, estimated hours, total price, on-site indicator, and created date.")],
    "Corrected 'clocked-in time' to clocked-in names; count of 13 fields and value-by-value comparison with List.")

upd(96979, "Tech View starts with List's default columns and saved List choices stay",
    BASE5 + [
        "A brand-new user who has never changed any Work Orders columns (e.g. \"Nora New\", created under Settings > Staff "
        "with an Admin role), signed in in a second browser.",
        CUSTOMER] + new_wo(None),
    ["As Nora New open Work Orders in List and write down every column shown.",
     "Pick Tech View and write down every column shown.",
     "Open Tech View's column chooser and read whether Assigned Techs is on.",
     "As your own user, open List, turn Service Advisor off and Created on on, then reload.",
     "Pick Tech View, change any column there, pick List again and reload."],
    ["Nora New's Tech View shows exactly the same columns as her List default (the production List defaults); Assigned "
     "Techs is off until she turns it on.",
     "Your List keeps Service Advisor off and Created on on after every switch and reload: saved List choices stay exactly "
     "as they are. (Choices saved before this release cannot be recreated by hand; write 'pre-release List choice not "
     "checked' unless you have such a user.)"],
    src(5, ["S5-R4", "S5-R12"], "Review Decisions FF-7 / DR-21. Tech plan §3.9 records the production default List columns."),
    [q("S5-R4"), q("S5-R12"), qt("Tech plan §3.9 (default List columns)", "Default List columns = every non-required column "
                                  "except `invoicedDate`, `daysOpen`, `partRequestsCount`, `partReturnRequestsCount`, "
                                  "`unreceivedPartRequestsCount`.")],
    "Rewritten with a new-user recipe and side-by-side comparison against List's defaults.")

upd(96980, "Board View's default fields, with total price only for financial access",
    [SIGN_CE, SCREEN, LOC] + techs(["Esther Howard"]) + [
        "Two brand-new users who have never opened Board View, each signed in in their own browser: \"Fay Financial\" "
        "(role with Work Orders view and See Financial Data) and \"Nate Nofinance\" (role with Work Orders view but See "
        "Financial Data off — create a custom role under Settings > Roles & Permissions).",
        CUSTOMER] + new_wo("Esther Howard"),
    ["As Fay Financial open Work Orders, pick Board View and search for the case customer.",
     "Read the card and open Fields to display; write down which fields are on.",
     "Repeat steps 1 and 2 as Nate Nofinance."],
    ["Fay Financial's card shows 8 things by default: lead technician name, work order number, customer, unit number, "
     "asset, progress, total price and status. VIN/serial, service advisor, clocked in, line count, line technicians, "
     "estimated hours, on-site indicator and created date are off.",
     "Nate Nofinance's defaults are the same 7 without total price, and total price is not offered in his Fields to display."],
    src(5, ["S5-R13"], "Review Decisions FF-7 / DR-21 / UX-13."),
    [q("S5-R13")],
    "Rewritten with two new-user recipes and the counted default set (8 with financial access, 7 without).")

upd(96981, "Field changes apply to every card at once without a reload",
    BASE5 + techs(["Esther Howard", "Ralph Edwards"]) + [CUSTOMER,
        "Create 3 Approved work orders for the case customer, 2 led by Esther Howard and 1 by Ralph Edwards."],
    OPEN_BOARD + [
        "Open Fields to display.",
        "Turn Created date on and Customer off.",
        "Read all 3 cards while watching whether the page reloads (the search text stays and the board does not go blank).",
    ],
    ["All 3 cards show the created date and no longer show the customer straight away.",
     "The page does not reload: the search text is still there and the board keeps its place."],
    src(5, ["S5-R5"]),
    [q("S5-R5")],
    "Rewritten with three cards and a visible no-reload check.")

upd(96982, "With every optional field off a card keeps only the required fields",
    BASE5 + techs(["Esther Howard"]) + [CUSTOMER,
        "Create 2 Approved work orders for the case customer led by Esther Howard: one with unit \"TRK-118\" (e.g. "
        "\"S1-702\") and one whose asset has no unit number but has year/make/model \"1999 Ford Explorer\" (e.g. \"S1-472\")."],
    OPEN_BOARD + [
        "Open Fields to display and turn every optional field off.",
        "Read both cards.",
    ],
    ["\"S1-702\" shows only its number, status and unit: \"S1-702\", \"Approved\", \"TRK-118\".",
     "\"S1-472\" shows only its number, status and, in the unit's place, \"1999 Ford Explorer\"."],
    src(5, ["S5-N1", "S5-E1"], "Review Decisions SQ-14 / DR-29."),
    [q("S5-N1"), q("S5-E1")],
    "Rewritten with two seeded cards and exact expected content.")

upd(96983, "If saved field choices can't load, the defaults show and the next change saves",
    BASE5 + [
        "This case needs the user's saved field and column choices to fail to load. That cannot be caused from the product. "
        "Run it only on a test site where a developer has made the saved choices fail to load; otherwise run steps 1 to 3 "
        "only and write 'load failure not checked by hand' in the result comment.",
        CUSTOMER] + new_wo(None),
    ["Open Work Orders, pick Board View and open Fields to display; write down the fields that are on.",
     "Pick Tech View and write down the columns shown.",
     "Turn one Board View field on (e.g. Created date), reload and read whether it stayed on.",
     "(Only with a forced load failure) reload Board View and Tech View and read the fields and columns shown.",
     "(Only with a forced load failure) change one field, then reload once the failure is removed."],
    ["With the saved choices unreadable, Board View shows its default fields (lead technician name, work order number, "
     "customer, unit number, asset, progress, total price, status) and Tech View shows its starting columns (the List "
     "default columns).",
     "The next field choice made after the failure is saved and is still there after the reload. Without a forced failure "
     "only step 3 (a normal save) can be seen."],
    src(5, ["S5-N2", "S5-N3"], "Tech plan Phase 4 (after a failed preference load the next save re-reads and merges)."),
    [q("S5-N2"), q("S5-N3")],
    "Rewritten: what a tester can see is separated from the load failure, which is stated plainly as not producible by hand.")

upd(96984, "No unit number shows the asset instead, and a real zero still shows",
    BASE5 + techs(["Esther Howard"]) + [CUSTOMER,
        "Create 4 work orders for the case customer led by Esther Howard: (a) asset with unit \"TRK-118\" and \"2022 "
        "Freightliner M2\"; (b) asset with no unit number and \"1999 Ford Explorer\"; (c) asset with no unit number and no "
        "year, make or model; (d) a work order with no lines (0 lines, $0.00 total, 0% progress)."],
    OPEN_BOARD + [
        "Open Fields to display and turn on line count, total price and progress (keep the defaults on).",
        "Read the four cards.",
    ],
    ["(a) shows \"TRK-118\" and its asset. (b) shows \"1999 Ford Explorer\" where the unit would be.",
     "(c) shows neither a unit nor an asset line (nothing invented, no blank placeholder).",
     "(d) shows its zero values as values: line count 0, total price $0.00 and progress 0%, not left out."],
    src(5, ["S5-E1", "S5-E5", "S5-E4"], "Review Decisions SQ-14 / DR-29."),
    [q("S5-E1"), q("S5-E5"), q("S5-E4")],
    "Rewritten with four seeded work orders, one per rule, and the zero values named.")

upd(96985, "Optional fields with no value are left off the card",
    BASE5 + techs(["Esther Howard"]) + [CUSTOMER,
        "Create an Approved work order for the case customer led by Esther Howard with no Service Advisor, no VIN on the "
        "asset and nobody clocked in."],
    OPEN_BOARD + [
        "Open Fields to display and turn on service advisor, VIN/serial and clocked in.",
        "Read the card.",
    ],
    ["The card leaves out the service advisor, VIN/serial and clocked-in fields entirely (no label, no blank, no dash), "
     "while its other fields still show."],
    src(5, ["S5-E3"], DESIGN + ": the design shows \"-\" for some empty values; the PRD (omit) is followed."),
    [q("S5-E3")],
    "Rewritten with a seeded work order missing exactly three values.")

upd(96986, "Without See Financial Data no dollar amounts show in Tech or Board View",
    [SIGN_CE, SCREEN, LOC] + techs(["Esther Howard"]) + [
        "A second user \"Nate Nofinance\" whose role has Work Orders view and, for now, See Financial Data (custom role "
        "under Settings > Roles & Permissions), signed in in a second browser.",
        CUSTOMER] + new_wo("Esther Howard") + [
        "↳ As Nate Nofinance, turn Total price on in Tech View's column chooser and in Board View's Fields to display."],
    ["As the admin, edit Nate Nofinance's role and turn See Financial Data off, then save.",
     "As Nate Nofinance sign in again, open Work Orders, pick Tech View and search for the case customer.",
     "Read the columns and open the column chooser.",
     "Open every filter in the toolbar and read its options.",
     "Pick Board View, read the card and open Fields to display."],
    ["Tech View has no Total price column and its column chooser does not offer it; Board View cards show no dollar amount "
     "and Fields to display does not offer total price.",
     "No filter offers a dollar-amount option, and Nate's earlier saved choice (Total price on) does not bring any dollar "
     "value back. List is not part of this change and stays as in production."],
    src(5, ["S5-E2", "S5-E6"], "Review Decisions MF-1 (see financial data; List dropped from this answer, DR-33)."),
    [q("S5-E2"), q("S5-E6")],
    "Rewritten with a saved-selection-then-permission-removed recipe; List removed from scope per DR-33.")

# ====================================================================================== STORY 6
BASE6 = [SIGN_CE, SCREEN, LOC]
upd(96987, "Density offers Compact, Regular and Comfortable, Regular by default",
    BASE6 + [
        "A brand-new user who has never changed density (e.g. \"Nora New\", Admin role, Settings > Staff), signed in in a "
        "second browser.",
        CUSTOMER] + new_wo(None),
    ["As Nora New open Work Orders in List and look for a density control.",
     "Pick Tech View and open the density control.",
     "Read its choices and which one is selected.",
     "Pick Board View and open the density control.",
     "Read its choices and which one is selected."],
    ["Tech View and Board View each offer three density choices named Compact, Regular and Comfortable. List has no "
     "density control.",
     "For a user who never chose, Regular is selected in both views."],
    src(6, ["S6-R1", "S6-R5"], DESIGN + ": Tech View shows \"Row height: Small / Medium / Large\" and Board View \"Card "
        "size: Compact / Detailed\" (UX-14 open); the PRD names are asserted."),
    [q("S6-R1"), q("S6-R5")],
    "Rewritten for Tech/Board View only (List has none, DR-33) with a new-user default check.")

upd(96988, "Density changes spacing and size only, never what is shown",
    BASE6 + techs(["Esther Howard"]) + [CUSTOMER] + new_wo("Esther Howard"),
    OPEN_BOARD + [
        "Open Fields to display and turn on estimated hours and total price.",
        "Write down every field and value on the card.",
        "Set density to Compact, then Regular, then Comfortable, reading the card each time.",
        "Repeat steps 3 to 5 in Tech View with its columns and the row's values.",
    ],
    ["Each density changes only spacing and the size of rows, cards and their parts (Compact tighter, Comfortable roomier).",
     "The same fields, columns and values are shown at every density (e.g. estimated hours and total price stay on the "
     "card in Compact)."],
    src(6, ["S6-R2", "S6-R6"], "PRD §4 Key decision \"Fields vs. density are separate controls\". " + DESIGN + ": the "
        "design's Compact card hides hours, progress and totals; the PRD is followed."),
    [q("S6-R2"), q("S6-R6")],
    "Rewritten with a field list to compare at each density in both views.")

upd(96989, "One density choice is shared by Tech View and Board View and kept",
    BASE6 + ["A second browser or computer, and a second location you can switch to in the top bar.", CUSTOMER]
    + new_wo(None),
    ["Open Work Orders, pick Tech View and set density to Comfortable.",
     "Pick Board View and read the selected density.",
     "Log out, log back in and open Tech View.",
     "In the second browser sign in as the same user and open Board View.",
     "Switch to the second location and open Tech View."],
    ["Board View is already Comfortable after the change in Tech View (one shared choice).",
     "Comfortable is still selected after logging back in, in the second browser and at the second location."],
    src(6, ["S6-R3", "S6-R7"]),
    [q("S6-R3"), q("S6-R7")],
    "Rewritten: the change starts in Tech View (List has no density), with persistence checks.")

upd(96990, "Compact never makes text smaller than normal body text",
    BASE6 + techs(["Esther Howard"]) + [CUSTOMER] + new_wo("Esther Howard"),
    ["Open Work Orders in List and look at the size of the text in a row (normal body text).",
     "Pick Tech View and set density to Compact.",
     "Compare the row text with the List text, side by side if you can (two browser windows).",
     "Pick Board View (Compact) and compare the card text with the List text."],
    ["Text in Compact rows and cards is not smaller than the app's normal body text (the List row text). An exact size "
     "measurement cannot be made by hand; if Compact text looks smaller, mark Failed and attach a screenshot."],
    src(6, ["S6-R4"], "PRD §5 Terminology (Density)."),
    [q("S6-R4")],
    "Rewritten as a visual comparison against List text, with what cannot be measured by hand stated.")

upd(96991, "If the saved density can't load, Regular is used",
    BASE6 + ["This case needs the saved density to fail to load. That cannot be caused from the product. Run step 3 only "
             "where a developer has made it fail; otherwise write 'load failure not checked by hand'.", CUSTOMER]
    + new_wo(None),
    ["Open Work Orders, pick Tech View and set density to Comfortable.",
     "Reload and confirm Comfortable is kept (normal load).",
     "(Only with a forced load failure) reload Tech View and Board View and read the density."],
    ["When the saved density cannot be loaded, both views use Regular. Without a forced failure only the normal load "
     "(step 2) can be seen."],
    src(6, ["S6-N2"]),
    [q("S6-N2")],
    "Rewritten with the forced-failure part stated as not producible by hand.")

upd(96992, "Density affects Tech View rows and Board View cards, List stays as today",
    BASE6 + techs(["Esther Howard"]) + [CUSTOMER] + new_wo("Esther Howard"),
    ["Open Work Orders in List and note the row height.",
     "Pick Tech View and set density to Comfortable, then Compact.",
     "Pick Board View and read the card spacing at Compact.",
     "Pick List and compare the row height with step 1.",
     "Open another table in the app (e.g. Customers) and compare it with before."],
    ["Tech View rows and Board View cards change with density.",
     "List rows keep today's height, and other tables in the app are unchanged."],
    src(6, ["S6-E1"], "Review Decisions DR-33 (List keeps today's row size)."),
    [q("S6-E1")],
    "Corrected: List no longer expected to change; another app table checked.")

# ====================================================================================== STORY 7
BASE7 = [SIGN_CE, SCREEN, LOC]
CREW = [CUSTOMER,
        "Create an Approved work order for the case customer (e.g. \"S1-644\") with Lead Technician \"Esther Howard\" and "
        "three lines: \"Line 1\" given to Ralph Edwards and \"Line 2\" given to Dana Ortiz (Edit Line > Technicians), and "
        "\"Line 3\" with no labor technician.",
        shift("Jenny Wilson", "\"S1-644\"", "tomorrow 8:00–10:00", "Choose lines", "Line 3")]

upd(96993, "Cards and Tech View's Assigned Techs show the lead and line technicians",
    BASE7 + techs(["Esther Howard", "Ralph Edwards", "Dana Ortiz", "Jenny Wilson"]) + CREW,
    OPEN_BOARD + [
        "Open Fields to display and turn line technicians on.",
        "Read the avatar group on the card and hover each avatar.",
        "Pick Tech View, open the column chooser and turn Assigned Techs on.",
        "Read the avatar group in the row.",
        "Pick List and open its column chooser.",
    ],
    ["The card shows a compact avatar group of 4: Esther Howard (lead) plus Ralph Edwards, Dana Ortiz and Jenny Wilson "
     "(the scheduled technician on Line 3 counts as that line's technician).",
     "Tech View's Assigned Techs column shows the same 4-avatar group.",
     "List does not offer an Assigned Techs column."],
    src(7, ["S7-R1"], "PRD Story 7 context note (scheduled technicians count as the line's technicians). Review Decisions "
        "DR-33. " + DESIGN + ": List's Columns shows an \"Assigned Tech\" column; the PRD (no column in List) is followed."),
    [q("S7-R1"), qs("Story 7 context note", "this feature counts technicians scheduled on a line as that line’s "
                    "technicians (S7-R1).")],
    "Rewritten with a four-person crew (incl. a scheduled technician) and the List exclusion checked in its chooser.")

upd(96994, "The lead comes first and each technician shows only once",
    BASE7 + techs(["Esther Howard", "Ralph Edwards"]) + [CUSTOMER,
        "Create an Approved work order for the case customer with Lead Technician \"Esther Howard\" and three lines: "
        "\"Line 1\" given to Esther Howard, \"Line 2\" and \"Line 3\" both given to Ralph Edwards (Edit Line > Technicians)."],
    OPEN_BOARD + [
        "Turn line technicians on in Fields to display.",
        "Read the avatars in order and hover each one.",
        "Pick Tech View with Assigned Techs on and do the same.",
    ],
    ["The group shows 2 avatars: Esther Howard first, then Ralph Edwards.",
     "Esther Howard appears once although she is lead and on a line, and Ralph Edwards appears once although he is on two lines."],
    src(7, ["S7-R3", "S7-R5", "S7-E1"], "Review Decisions FF-8 / DR-11."),
    [q("S7-R3"), q("S7-R5"), q("S7-E1")],
    "Rewritten with a seeded duplicate-heavy crew and the exact expected count (2).")

upd(96995, "Extra technicians show as +N and every name can be found by hovering",
    BASE7 + techs(["Esther Howard", "Ralph Edwards", "Dana Ortiz", "Jenny Wilson", "Kristin Watson", "Theresa Webb"]) + [
        CUSTOMER,
        "Create an Approved work order for the case customer with Lead Technician \"Esther Howard\" and five lines, each "
        "given to a different technician: Ralph Edwards, Dana Ortiz, Jenny Wilson, Kristin Watson, Theresa Webb (6 people)."],
    OPEN_BOARD + [
        "Turn line technicians on in Fields to display.",
        "Count the avatars shown and read the +N indicator.",
        "Hover each visible avatar, one at a time, and read the name shown.",
        "Hover the +N indicator and read what it shows.",
        "Pick Tech View with Assigned Techs on and repeat steps 4 to 6.",
    ],
    ["If not all 6 fit, the first avatars are shown followed by +N, and shown avatars + N = 6 (e.g. 4 avatars and \"+2\").",
     "Hovering an avatar shows that avatar's own name, only while the pointer is on that avatar.",
     "Every one of the 6 technicians can be found by name, including those behind +N (e.g. hovering +2 lists Kristin "
     "Watson and Theresa Webb)."],
    src(7, ["S7-R4", "S7-R6", "S7-R2"], DESIGN + " / design system TechStack: up to 5 avatars, else 4 avatars + \"+N\"; "
        "hovering +N lists the hidden names."),
    [q("S7-R4"), q("S7-R6"), q("S7-R2")],
    "Rewritten with a six-person crew and the arithmetic shown + N = 6.")

upd(96996, "The technician field is blank only with no lead and no line technician",
    BASE7 + techs(["Esther Howard", "Ralph Edwards"]) + [CUSTOMER,
        "Create 3 Approved work orders for the case customer: (a) no lead and no line technician; (b) no lead, one line "
        "given to Ralph Edwards; (c) lead Esther Howard and no line technician."],
    OPEN_BOARD + [
        "Turn line technicians on in Fields to display and read the field on each of the three cards.",
        "Pick Tech View with Assigned Techs on and read the column for the three rows.",
    ],
    ["(a) is blank. (b) shows Ralph Edwards. (c) shows Esther Howard. So only 1 of the 3 is blank."],
    src(7, ["S7-N1"], DESIGN + ": an empty group renders \"-\"; write down whether blank shows as empty or as a dash."),
    [q("S7-N1")],
    "Rewritten with three seeded work orders, one blank.")

new("NEW-B-09", 7, "Tech View's Assigned Techs column sits right after Lines",
    BASE7 + techs(["Esther Howard", "Ralph Edwards"]) + [CUSTOMER] + new_wo("Esther Howard"),
    OPEN_TECH + [
        "Open the column chooser and read whether Assigned Techs is on.",
        "Turn Lines on if it is off, then turn Assigned Techs on.",
        "Read which column is directly to the right of Lines.",
        "Turn Assigned Techs off again.",
    ],
    ["Assigned Techs is optional: it is added from the column chooser and can be turned off again.",
     "When on, the Assigned Techs column is immediately after Lines, as in the design."],
    src(7, ["S7-R7"], "PO answer Chris Ward 2 Oct 2026 thread (\"right after Lines\"). " + DESIGN + ": Tech View column "
        "order … Lines, Assigned Tech, Created on, Total price."),
    [q("S7-R7")],
    "S7-R7 (new): column position and optional status.")

LINES_PRE = [CUSTOMER,
             "Create an Approved work order for the case customer (e.g. \"S1-760\") with no lead technician and three lines "
             "approved for repair, none with a labor technician: \"Line 1\", \"Line 2\", \"Line 3\".",
             shift("Jenny Wilson", "\"S1-760\"", "tomorrow 8:00–10:00", "Choose lines", "Line 2"),
             shift("Ralph Edwards", "\"S1-760\"", "tomorrow 10:00–12:00", "Choose lines", "Line 3"),
             shift("Dana Ortiz", "\"S1-760\"", "tomorrow 13:00–15:00", "Choose lines", "Line 3")]
new("NEW-B-10", 7, "The Lines tab shows scheduled technicians instead of Unassigned",
    BASE7 + techs(["Jenny Wilson", "Ralph Edwards", "Dana Ortiz"]) + LINES_PRE,
    ["Open the work order \"S1-760\" and click the Lines tab.",
     "Read Line 2's Labor row.",
     "Read Line 3's Labor row.",
     "Look for any badge on those two rows (e.g. \"Needs techs\")."],
    ["Line 2's Labor row shows Jenny Wilson's name in place of \"Unassigned\".",
     "Line 3's Labor row shows both scheduled technicians, Ralph Edwards and Dana Ortiz (2 names).",
     "Neither row shows a \"Needs techs\" badge or any other badge."],
    src(7, ["S7-R8", "S7-R9"], "Story 7 context note (@chris, 7 Oct 2026; closes bug SV-9769; \"Needs techs\" stays removed, "
        "SV-9486). Jira SV-9769 comment Chris Ward 7 Oct 2026."),
    [q("S7-R8"), q("S7-R9")],
    "S7-R8 and S7-R9 (new): Lines tab shows scheduled technicians, with no badge.")

new("NEW-B-11", 7, "A line with no labor and no scheduled technician still reads Unassigned",
    BASE7 + techs(["Jenny Wilson", "Ralph Edwards", "Dana Ortiz"]) + LINES_PRE,
    ["Open the work order \"S1-760\" and click the Lines tab.",
     "Read Line 1's Labor row.",
     "Give Line 1 a labor technician (Labor row > More actions > Edit labor > \"Ralph Edwards\") and read the row again."],
    ["Line 1, with neither a labor technician nor a scheduled technician, reads \"Unassigned\".",
     "Once a labor technician is set, the row shows that technician (Ralph Edwards) as it does today."],
    src(7, ["S7-R10"], "Story 7 context note (@chris, 7 Oct 2026)."),
    [q("S7-R10")],
    "S7-R10 (new): the Unassigned fallback when nobody is scheduled.")

# ====================================================================================== STORY 8
BASE8 = [SIGN_CE, LOC]
TECH_ROLE = ("A user whose role uses the Tech View work order mode from Roles & Permissions (e.g. a \"Technician\" role, "
             "Settings > Roles & Permissions > the role's work order view mode), signed in in a second browser. This is "
             "the Simple Flow tech view mode, not the Tech View display on the Work Orders page.")
upd(96997, "The tech story check mark no longer shows on work order lines",
    BASE8 + [TECH_ROLE, CUSTOMER,
             "Create an Approved work order for the case customer with a line \"Line 1\" and enter a tech story on it (e.g. "
             "\"Brought unit in. Completed inspection.\")."],
    ["Open the work order and click the Lines tab.",
     "Look at Line 1's Story row and the line row for a check mark.",
     "In the second browser (Tech View work order mode) open the same work order and look at Line 1 again."],
    ["Line 1 shows its story text with no check-mark indicator anywhere on the line, on the normal work order page and in "
     "the Simple Flow tech view mode."],
    src(8, ["S8-R1"], DESIGN + " work order page (wo-details/Add Part.html): Story row shows only the text."),
    [q("S8-R1")],
    "Rewritten with a seeded story and the Simple Flow tech view mode reachable by role; code-file reference removed.")

upd(96998, "Tech stories can still be entered, edited and required",
    BASE8 + [CUSTOMER,
             "Create an Approved work order for the case customer with two lines, \"Line 1\" and \"Line 2\", and a mileage "
             "entered on the work order."],
    ["On the Lines tab, add a tech story to Line 1 (e.g. \"First note\") and save.",
     "Edit Line 1's story to \"First note, edited\" and save.",
     "Try to complete Line 2 without a tech story.",
     "Add a tech story to Line 2 and complete it."],
    ["Entering and editing the story work as before and the edited text shows.",
     "Completing a line without a tech story is still blocked with today's message (a tech story is required), and works "
     "once the story is entered. Nothing else about tech stories changed; only the check mark is gone."],
    src(8, ["S8-R2"]),
    [q("S8-R2")],
    "Rewritten with enter, edit and required-story steps; code-file and E2E references removed.")

upd(96999, "Lines without a tech story look the same as before",
    BASE8 + [CUSTOMER,
             "Create an Approved work order for the case customer with a line \"Line 1\" and no tech story.",
             "A way to see the same kind of line before this release: the current production app, or a screenshot taken "
             "before the release."],
    ["Open the work order and click the Lines tab.",
     "Look at Line 1 (its Story row and add-story prompt).",
     "Compare it with the same kind of line before this release."],
    ["Line 1 looks exactly as before: the same add-story prompt and layout, no new mark and nothing missing."],
    src(8, ["S8-N1"]),
    [q("S8-N1")],
    "Rewritten with an explicit before/after comparison method; code-file reference removed.")

upd(97000, "No new required-story marker replaces the old check mark",
    BASE8 + [TECH_ROLE, CUSTOMER,
             "Create an Approved work order for the case customer with two lines: \"Line 1\" with a tech story and "
             "\"Line 2\" without one."],
    ["Open the work order and click the Lines tab.",
     "Look at both lines for any marker about the tech story (an icon, badge or colour).",
     "Repeat in the second browser (Tech View work order mode)."],
    ["Neither line shows any new marker in place of the removed check mark. Any required-story marker would need its own "
     "specification, so none ships with this change."],
    src(8, ["S8-E1"]),
    [q("S8-E1")],
    "Rewritten as a by-eye check on both lines and both modes; code-file reference removed.")

# ---------------------------------------------------------------- notes, coverage, reading
NOTES += [
    "DESIGN vs PRD — menu and dialog: the design's more-actions item reads \"Reassign Lead Tech\" (\"Assign Tech\" when no lead) "
    "with a separate \"Unassign\" item; the dialog has no Unassigned option and no confirm button (picking a technician applies "
    "it). PRD S4-R4/R12/R13 name \"Reassign lead technician\", Unassigned in the dialog and a confirm step. Steps use the PRD "
    "label; the build (per Vladimir's automated cases C236976) shows \"Reassign lead technician\", Unassigned and a \"Reassign\" button.",
    "DESIGN vs PRD — toasts: design shows \"<number> assigned to <name>\" / \"<number> lead technician set to <name>\" / "
    "\"<number> moved to Unassigned\" with an Undo button (5 s). PRD S4-R5 fixes \"Lead technician updated\" / \"Lead technician "
    "removed\"; the PO (Chris Ward, 29 Sep 2026) put Undo out of scope. Cases assert the PRD words.",
    "DESIGN vs PRD — lock tooltips: design \"Invoiced · can’t be reassigned\", \"Paid · can’t be reassigned\", \"Declined · can’t "
    "be reassigned\", \"Imported · review before assigning\". PRD S4-N6/S4-N9 fix different texts, and Declined is NOT locked "
    "(S4-N2, DR-37). Cases assert the PRD.",
    "DESIGN vs PRD — design reassign dialog \"N open\" counts every work order in the technician's column (all statuses); PRD "
    "S4-R15 counts Approved, In Progress, Ready for Review and Complete only.",
    "DESIGN vs PRD — design: \"Unassign clears the whole crew; reassigning a lead keeps the assisting techs\" (code comment) "
    "contradicts the S4-R8 table (explicit lines stay on removal). PRD followed.",
    "DESIGN vs PRD — density: Tech View \"Row height: Small / Medium / Large\", Board View \"Card size: Compact / Detailed\"; PRD "
    "Compact / Regular / Comfortable shared by both views. Design Compact card hides hours, progress and totals (PRD: density "
    "never hides fields). Cases follow the PRD.",
    "DESIGN vs PRD — Board View has no Fields to display picker in the design (only Card size; UX-12 open). PRD S5-R2 requires it.",
    "DESIGN vs PRD — design List's Columns offers \"Assigned Tech\" and List rows show it; PRD S7-R1 and DR-33: List does not get "
    "this column. Column label in the design is \"Assigned Tech\", PRD \"Assigned Techs\".",
    "DESIGN vs PRD — empty-value display: design renders \"-\" for an empty technician group and some empty fields; PRD S5-E3 "
    "says omit optional fields without values, S7-N1 says blank.",
    "DESIGN — drag refused for a user without permission shows \"You don’t have permission to assign technicians\"; the PRD fixes "
    "no text for this (not asserted). The design offers no shift-clearing prompt, failed-move alerts or a Lines-tab scheduled "
    "technician display; their wording comes only from the PRD (S4-R29, S4-N10–N12, S7-R8).",
    "DESIGN — work order page (wo-details/Add Part.html): Story row shows the text with no check mark (consistent with S8-R1); "
    "Labor row shows the technician avatar and name or \"Unassigned\".",
    "BUILD FACT (from Vladimir's automated case C351740, not a source of expectation): the Lines-tab Labor row of an unassigned "
    "line may read \"No technicians assigned to this line.\" rather than \"Unassigned\". PRD S7-R10 says \"Unassigned\"; NEW-B-11 "
    "asserts the PRD. If the build shows the other words, that is a deviation for the build session, or a PO question.",
    "PO QUESTION — Imported work orders (S4-N9): the tech plan §3.26 and the PO answer of 24 Sep 2026 keep Imported out of Tech "
    "View and Board View (Status filter option disabled, switcher disabled while Imported is selected). Then the S4-N9 tooltip "
    "can never be reached on the board. Where should a user see it? C154887 tells the tester to mark Blocked in that situation.",
    "PO QUESTION — S5-R3 (mandatory work order number, unit number, status): the PRD ties it to Board View cards (S3-R4); should "
    "Tech View's column chooser also lock Number, Unit # and Status, given List's Unit # column is optional today? C96977 "
    "checks Board View only.",
    "PO QUESTION — S4-R6 notifications: DR-46 records that no notification is sent today; C96958 expects none on both paths. "
    "Confirm that 'same as the work order page' means none.",
    "PO QUESTION — S4-R9: where does a user see the work-order-level lead-change audit entry? Neither the PRD nor the design "
    "shows a work-order audit screen (the design line menu has \"Audit log\" for lines). C96962 asks the tester to write down "
    "where they found it.",
    "TECH PLAN vs PRD — tech plan §12.2 item 12 plans to delete a running shift whole when clearing; PRD S4-R25 (and PO answer "
    "Chris Ward 25 Sep 2026) trims it at the moment of the change. C154888 follows the PRD.",
    "TECH PLAN vs PRD — tech plan §3.23 / Phase 3 keeps Declined in the locked set (LEAD_LOCKED_STATUSES); the current PRD S4-N2 "
    "and DR-37 say Declined moves freely. C96963 follows the PRD; worth confirming the build constant.",
    "TECH PLAN — 'roster rows count as explicit' (§1.4 MF-2): a line with a Schedule shift on it stays put on a lead change. "
    "Consistent with S7 context note; no separate case needed beyond C96960's explicit line.",
    "JIRA vs PRD — SV-10047 requirement 6 still lists three statuses for N open (no Complete); its 'Open design decisions' still "
    "says lead removal is unanswered. The 7 Oct PRD (four statuses; S4-R26) is followed.",
    "JIRA vs PRD — SV-10049 summary says density is shared 'across all Work Orders displays' and its AC 'Given any Work Orders "
    "display'; PRD S6-R1/S6-E1 and DR-33 exclude List. PRD followed.",
    "COVERAGE — S5-R7 (measure usage as in Story 12) is quoted in C96976 with the analytics part stated as not checkable by hand; "
    "the Story 12 folder (C97023, other worker) checks the events.",
    "COVERAGE — S4-R8 assign path had no case; NEW-B-08 added so assign, reassign (C96960) and remove (C96961) are all covered, "
    "as the PRD's acceptance note requires.",
    "BY-HAND METHODS — failures are produced by turning the network off (C96968, C154890, NEW-B-05) and stale/concurrent states "
    "with two browsers (C96971, C96972, NEW-B-06, NEW-B-07). Load failures of saved preferences (C96983, C96991), a "
    "clearing-only failure (C154890), the server refusal of a bypassing request (C96963), the no-name prompt title (NEW-B-02) "
    "and exact simultaneity (NEW-B-07) cannot be produced by hand and say so in the plain results.",
    "DESIGN (work order page, wo-details/Add Part.html and its sweep design-drive/add-part): Lines tab line controls \"Approve\" (toast \"Line approved\" with Undo), \"Decline\", \"Uncomplete\", \"Add line note\", \"Save line\", \"Story history\", \"Audit log\", \"Add fee / discount\"; Labor row More actions > \"Edit labor\" / \"Move labor\"; clock button \"Start time clock\" / \"Stop time clock\" (disabled: \"Approve the line to start the clock\"); work order More actions \"Add Fee / Discount\", \"Print Work Order\", \"Delete Work Order\"; header field \"Lead Technician\". The design has no Edit Line dialog; that name and its Technicians field come from Jira SV-9769. Steps use these labels.",
    "SEEDING — Schedule shift picker labels \"Entire work order\" / \"Choose lines\" come from the Schedule suite's build notes "
    "(facts only). Staff/role click-paths use Settings > Staff and Settings > Roles & Permissions.",
]

all_cases = U + N
cov = {}
for c in all_cases:
    ref = c.get("case_id") or c.get("key")
    for a, _ in c["quotes"]:
        m = re.match(r"(S\d+-[RNE]\d+[a-z]?)", a)
        if m:
            cov.setdefault(m.group(1), [])
            if ref not in cov[m.group(1)]:
                cov[m.group(1)].append(ref)
ANCH = json.load(open(os.path.join(HERE, "anchor-quotes-2026-10-08.json")))
share = [a for a in ANCH if re.match(r"S[4-8]-", a)]
anchors_covered = {a: cov.get(a, []) for a in share}

READING = (
    "PRD CONFLUENCE-845185030 …edited-2026-10-07.md — 59,254 B — lines 1-640 — 100% read | "
    "Review Decisions CONFLUENCE-853901313 …2026-09-29.md — 91,532 B — lines 1-273 — 100% read | "
    "PRD page comments (Atlassian MCP, page 845185030): 7 footer threads with all replies + 27 open inline threads with all "
    "replies (resolved inline: 0) — 100% read | "
    "Jira SV-10043-stories-2026-10-08.md — 113,391 B — lines 1-773 — 100% read | "
    "Tech plan …2026-10-08-upload.md — 115,972 B — lines 1-970 — 100% read | "
    "Design Work Orders.dc.html — 105,853 B — lines 1-1411 — 100% read; 'Work Orders -no page-fix-.dc.html' — diffed by script "
    "against it (5 style-only differences) | design-crawl list/tech/board states.jsonl (9+27+36 states) and actions.jsonl "
    "(472+442+400 actions) — 100% read via a deduplicating digest script (every state's new text, every hover/click's exposed "
    "text and tooltip) | design-drive Work Orders-pages.txt 224 lines 100% read; -interactions.jsonl 308 interactions — 100% "
    "via deduplicated exposed-text script (218 unique texts, no new labels); -summary.json read | design uploads/ — 14/14 images "
    "viewed | design screenshots/ — 26/26 images viewed (7 contact sheets) | wo-details/Add Part.html — 304,402 B — visible text "
    "100% extracted by script (433 unique lines), every user-facing string in its 99 KB of scripts (35), + Story/Labor row markup lines 2395-2445 and labor-name script 5502-5520 read | "
    "_ds/_ds_bundle.js 403 KB and support.js 69 KB — scanned by script for user-facing strings (62 / 0 found) + TechStack "
    "component (lines 10019-10095) and empty-state strings read; design-drive/add-part (pages.txt 164 lines, summary with 69 hidden text blocks, 180 interactions) — 100% via digest script; lucide-icons.js / fonts / CSS not read line by line (icon and "
    "style code, no labels) | snapshots-before: my 49 cases 100% read; Vladimir's C236975, C236976, C204101, C228763, C351740 "
    "read (facts only); other folders' cases scanned for S4-S8 quotes | V33-RECHECK, RULE117-REFORMAT, PROJECT-STATE — 100% | "
    "IDEAL-TEST-CASE-STANDARD.md and C154586-after.json — 100% | RULES-61-96.md lines 2391-2837 — 100% | "
    "WORKER-BRIEF.md, SOURCE-CHECK-2026-10-08.md, check-2026-10-08.json, anchor-quotes-2026-10-08.json — 100%.")

out = {"updates": U, "new": N, "retire": [], "notes": NOTES, "anchors_covered": anchors_covered,
       "reading_coverage": READING}
json.dump(out, open(OUT, "w", encoding="utf-8"), indent=1, ensure_ascii=False)


# ---------------------------------------------------------------- validation
def validate():
    d = json.load(open(OUT, encoding="utf-8"))
    errs = []
    bad_words = [r"Rule \d", r"\bS\d+-[RNE]\d+", "seed the exact", "display options are on", "ask the QA lead"]
    for c in d["updates"] + d["new"]:
        ref = c.get("case_id") or c.get("key")
        if len(c["title"]) > 80: errs.append(f"{ref}: title {len(c['title'])} chars")
        if ";" in c["title"]: errs.append(f"{ref}: semicolon in title")
        if c["marker"] != MARKER: errs.append(f"{ref}: marker")
        blob = " ".join([c["title"]] + c["preconds"] + c["steps"] + c["results"])
        if blob.count("AUTOMATION:") or c["source"].count("AUTOMATION:"): errs.append(f"{ref}: stray marker text")
        for w in bad_words:
            if re.search(w, blob): errs.append(f"{ref}: tester text contains /{w}/")
        if not c["quotes"]: errs.append(f"{ref}: no quotes")
        for a, t in c["quotes"]:
            pool = TP_N if a.startswith("Tech plan") else PRD_N
            if norm(t) not in pool: errs.append(f"{ref}: quote {a} not verbatim")
        for part in (c["preconds"], c["steps"], c["results"]):
            for line in part:
                if "\n" in line or "<" in line and ">" in line: errs.append(f"{ref}: multi-line or HTML item")
    unc = [a for a, v in d["anchors_covered"].items() if not v]
    if unc: errs.append("uncovered anchors: " + ", ".join(unc))
    print(f"updates {len(d['updates'])}, new {len(d['new'])}, retire {len(d['retire'])}, notes {len(d['notes'])}, "
          f"anchors {len(d['anchors_covered'])} ({len(d['anchors_covered']) - len(unc)} covered)")
    print("ERRORS:" if errs else "VALID", *errs, sep="\n  ")
    return not errs


if __name__ == "__main__":
    sys.exit(0 if validate() else 1)
