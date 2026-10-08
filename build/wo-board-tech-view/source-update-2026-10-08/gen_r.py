#!/usr/bin/env python3
"""Regression cases for the areas OUTSIDE the new Work Orders Board View / Tech View that epic SV-10043 (PR #3548)
touches. Drafted 8 Oct 2026 for a NEW TestRail folder the QA lead creates. Writes proposals-R-regression.json.

Scope = the developer's ranked regression list (received 8 Oct 2026) plus the regression-relevant checks of the
developer's QA handoff test plan (generated 2026-10-08) and the PRD (Confluence 845185030, edited 7 Oct 2026).
Every quote is checked programmatically against its source file (whitespace and ** ignored); nothing is retyped
without that check. Run: python3 gen_r.py  (the validator runs at the end and exits non-zero on any failure)."""
import json, re, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "sources")
DEV_PATH = os.path.join(SRC, "dev-regression-2026-10-08", "Dev-regression-areas-reply-2026-10-08.md")
QAH_PATH = os.path.join(SRC, "dev-regression-2026-10-08", "QA-Handoff-SV-10043-dev-test-plan-2026-10-08.md")
PRD_PATH = os.path.join(SRC, "CONFLUENCE-845185030-WO-BoardView-TechView-PRD-v33-edited-2026-10-07.md")
OUT = os.path.join(HERE, "proposals-R-regression.json")
MARKER = "AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build"


def norm(s):
    return re.sub(r"\s+", " ", s.replace("**", "")).strip()


DEV, QAH, PRD = (open(p, encoding="utf-8").read() for p in (DEV_PATH, QAH_PATH, PRD_PATH))
DEV_N, QAH_N, PRD_N = norm(DEV), norm(QAH), norm(PRD)


def qd(label, text):
    if norm(text) not in DEV_N:
        raise SystemExit("not verbatim in the developer's reply: " + label + " :: " + text)
    return ["Dev reply " + label, text]


def qh(label, text):
    if norm(text) not in QAH_N:
        raise SystemExit("not verbatim in the QA handoff: " + label + " :: " + text)
    return ["QA handoff " + label, text]


def qp(anchor):
    for line in PRD.splitlines():
        m = re.match(r"^\s*(?:-\s*)?\*\*" + re.escape(anchor) + r":\*\*\s*(.*)$", line)
        if m:
            return ["PRD " + anchor, m.group(1).replace("**", "").strip()]
    raise SystemExit("PRD anchor not found: " + anchor)


def qps(label, text):
    if norm(text) not in PRD_N:
        raise SystemExit("not verbatim in the PRD: " + label + " :: " + text)
    return ["PRD " + label, text]


def src(dev=None, qah=None, prd=None):
    parts = ["Regression for epic SV-10043 (PR #3548)"]
    parts.append("developer's regression list, received 8 Oct 2026" + (f", {dev}" if dev else ""))
    parts.append("QA handoff test plan (generated 2026-10-08)" + (f", {qah}" if qah else ""))
    s = "; ".join(parts) + "; PRD Confluence 845185030 (edited 7 Oct 2026) where quoted"
    if prd:
        s += f" ({', '.join(prd)})"
    return s + ". Source-verified 8 October 2026; not yet build-verified."


# ------------------------------------------------------------------ shared tester wording
SIGN = ("Sign in to the Work Orders build under test as a user whose role has Work Orders view and Work Orders create "
        "and edit. To check: Settings > Roles & Permissions > open the role > Work Orders (an Owner or Admin role has both).")
SIGN_ADMIN = "Sign in to the Work Orders build under test as an Admin (the Admin role can see every page used below)."
DESK = "Use a desktop browser window at least 1024 px wide."
LIST = ("On Work Orders, click List in the display switcher at the right of the toolbar (in the design its tooltip reads "
        "\"Table\"), so the page shows the List.")
LOC = "In the top bar, pick the location you will test in (e.g. \"Heavy Duty\") and stay in it for the whole case."
CUST = ("Create a customer used only by this case: Customers > New Customer, name (e.g. \"ZZAUTOTEST Regression Co\"), "
        "add an asset with a unit number and year/make/model (e.g. unit \"TRK-118\", \"2022 Freightliner M2\"), then Save.")
WO = ("To create a work order: Work Orders > Create Work Order > pick the case customer and its asset > create it, and "
      "write down the number the build gives it (the numbers in this case are examples, e.g. \"S1-702\").")
STATUS = ("How to reach each status: a new work order starts as Estimate. Approved = click each line's Approve (check) "
          "button. In Progress, Review (Ready for Review) and Complete = the status control on the work order page. "
          "Invoiced = Finance tab > Create Invoice (the work order needs a contact person). Paid = record a payment for "
          "the full amount on that invoice. Set the lead technician before invoicing.")
LINE = ("To add a line: open the work order, click the Lines tab, click New Line, enter a name (e.g. \"Brake inspection\") "
        "and labor hours (e.g. 2.0), and save the line.")
SECOND = "A second browser (or a private window) where you can sign in at the same location."
AUDIT = ("To read the work order history: on the work order page click the three-dots button at the top right, then "
         "Audit Log. The window that opens is titled Work Order Log and lists Event, User, Line, Details, Date and Time.")
PARTS = "Parts in the top menu holds Part Sales, Inventory, Catalog, Returns, Purchase Orders, Deliveries and Vendors."


def techs(names):
    return [
        f"At least {len(names)} technicians are eligible at this location (e.g. " + ", ".join(f'"{n}"' for n in names)
        + "). A staff member is eligible when Clockable is on, the staff record is Active, the role is neither Office "
          "nor Time Clock User, and they are enrolled at this location. To add one:",
        "↳ Settings > Staff > add a staff member, enter a first and last name (e.g. \"" + names[-1] + "\") and an email.",
        "↳ Pick a role that is not Office or Time Clock User (e.g. \"Technician\"), turn Clockable on, keep the record "
        "Active, enrol the staff member at this location, then Save.",
    ]


SHIFT = ("To give a technician a shift: Schedule > go to that day > drag the work order from the work order list onto the "
         "technician's row at the start time > in the picker choose Entire work order (or Choose lines and tick a line) > "
         "set the end time > save.")

CASES = []


def case(section, title, preconds, steps, results, source, quotes, why):
    CASES.append({"section_id": section, "title": title, "preconds": preconds, "steps": steps, "results": results,
                  "source": source, "quotes": quotes, "marker": MARKER, "why": why})


# ===================================================================================== HIGH 1 — work order detail page
H1_LOCK = qd("High 1", "Status card, Lead Technician select: the lock rule is new (disabled on Invoiced and Paid).")
H1_REFUSE = qd("High 1", "A refused change now shows an error and puts the old value back.")
H1_EDIT = qd("High 1", "Edit Work Order: the lead now goes through the new shared path.")
H1_EDIT_REF = qd("High 1", "If the lead change is refused, the other edits in the same save (mileage, engine hours, PO) "
                           "are not saved either.")
H1_HIST = qd("High 1", "Every lead change also adds a \"Lead tech changed\" history entry.")
H1_LINES = qd("High 1", "Lines tab: adding a line, editing a line's technician and assigning a technician now reject "
                        "staff from another organization.")
P_LOCK = qps("§4 Key Decisions (lead lock)", "Lead technician cannot be changed once a work order is Invoiced or Paid. "
             "This is a product rule, not only a screen rule, so it must hold on every path that changes the lead "
             "technician — board drag, Reassign dialog, and the work order detail page.")
QH7_CARD = qh("§7", "On the detail page status card, the lead select is disabled on Invoiced and Paid.")
QH7_OK = qh("§7", "A successful change shows the new lead.")
QH7_REF = qh("§7", "A refused change shows an error and puts the old value back.")
QH7_MSG = qh("§7", "changing the lead from the dialog, by a board drag or from the detail card is refused with \"The "
                   "lead technician can't be changed once a work order is Invoiced or Paid.\"")
QH7_HIST = qh("§7", "Each change adds exactly one \"Lead tech changed\" entry to the work order history.")
QH7_LINES_OK = qh("§7", "Adding, editing and assigning line technicians on the Lines tab still works.")
QH7_CLOCK = qh("§7", "Clocking in on an unassigned line assigns that technician.")

case("HIGH", "Lead Technician cannot be changed on a Paid work order's page",
     [SIGN, DESK, LOC] + techs(["Esther Howard", "Ralph Edwards"]) + [CUST, WO, STATUS,
      "Create one work order for the case customer, set Lead Technician to \"Esther Howard\" on its page, add one line, "
      "approve it, then invoice it and record a full payment so its status reads Paid (e.g. \"S1-366\")."],
     ["Open Work Orders and open the Paid work order \"S1-366\".",
      "Look at the Lead Technician field on the work order's status card.",
      "Click the Lead Technician field and try to pick \"Ralph Edwards\".",
      "Reload the page."],
     ["Step 2: the Lead Technician field shows \"Esther Howard\" and is shown disabled (greyed out).",
      "Step 3: it does not open a list, or it lets nothing be picked. The lead cannot be changed to Ralph Edwards.",
      "Step 4: after the reload Lead Technician still reads \"Esther Howard\".",
      "The Invoiced status is checked on the work order page by the feature case for Invoiced and Paid locks."],
     src("High 1", "§7", ["§4 Key Decisions"]), [H1_LOCK, QH7_CARD, P_LOCK],
     "Dev High 1 status card lock (Paid). Invoiced at the detail page is already in C96963.")

case("HIGH", "Changing Lead Technician on the work order page shows the new lead",
     [SIGN, DESK, LOC] + techs(["Esther Howard", "Ralph Edwards"]) + [CUST, WO,
      "Create one work order for the case customer (e.g. \"S1-702\"), set Lead Technician to \"Esther Howard\" on its "
      "page, add one line and approve it so the status reads Approved."],
     ["Open Work Orders and open \"S1-702\".",
      "On the status card, click Lead Technician.",
      "Pick \"Ralph Edwards\".",
      "Read the Lead Technician field and any message that appears.",
      "Reload the page and read Lead Technician again."],
     ["Step 4: Lead Technician reads \"Ralph Edwards\" and no error message appears.",
      "Step 5: after the reload it still reads \"Ralph Edwards\"."],
     src("High 1", "§7"), [H1_LOCK, QH7_OK],
     "Handoff §7 successful change on the detail card (the card now uses the shared lead path).")

case("HIGH", "A refused lead change on the work order page shows an error, keeps the old lead",
     [SIGN, DESK, LOC] + techs(["Esther Howard", "Ralph Edwards"]) + [CUST, WO, STATUS, SECOND,
      "Create one work order for the case customer with a contact person (e.g. \"S1-705\"), set Lead Technician to "
      "\"Esther Howard\", add one line and approve it so the status reads Approved."],
     ["In browser 1, open \"S1-705\" and leave the page open.",
      "In browser 2, open \"S1-705\", click the Finance tab and click Create Invoice so the work order is Invoiced.",
      "In browser 1, without reloading, click Lead Technician on the status card.",
      "Pick \"Ralph Edwards\".",
      "Read the message that appears and the Lead Technician field.",
      "Reload browser 1 and read Lead Technician."],
     ["Step 5: an error message appears (write down its words, e.g. \"The lead technician can't be changed once a work "
      "order is Invoiced or Paid.\") and the Lead Technician field goes back to \"Esther Howard\".",
      "Step 6: after the reload Lead Technician still reads \"Esther Howard\". The change was not saved.",
      "If browser 1 already shows the field disabled at step 3 because the page refreshed itself, write 'page refreshed "
      "itself' in the result comment and pass on the disabled field."],
     src("High 1", "§7", ["§4 Key Decisions"]), [H1_REFUSE, QH7_REF, QH7_MSG, P_LOCK],
     "Dev High 1 refused change shows an error and restores the old value (two browsers make the refusal happen by hand).")

case("HIGH", "Changing the lead on the work order page moves the lines that followed it",
     [SIGN, DESK, LOC] + techs(["Esther Howard", "Ralph Edwards", "Dana Ortiz"]) + [CUST, WO, LINE,
      "Create one work order for the case customer (e.g. \"S1-710\") and set Lead Technician to \"Esther Howard\".",
      "Add Line 1 with no technician (it follows the lead, so its Labor row shows Esther Howard).",
      "Add Line 2 and give it to \"Dana Ortiz\" (click the line's name to open Edit Line > Technicians, pick Dana Ortiz, "
      "save).",
      "Approve both lines so the status reads Approved, and write down each line's Labor row."],
     ["Open \"S1-710\" and click the Lines tab.",
      "On the status card change Lead Technician from \"Esther Howard\" to \"Ralph Edwards\".",
      "Reload the page and click the Lines tab.",
      "Read Line 1's and Line 2's Labor rows."],
     ["Line 1 (it was following the old lead) now shows \"Ralph Edwards\".",
      "Line 2 (given to Dana Ortiz on purpose) still shows \"Dana Ortiz\".",
      "So 1 of 2 lines moved. No clear-shifts question appeared on the work order page."],
     src("High 1", "§7", ["S4-R8", "S4-R31"]),
     [qh("§7", "Lines follow the lead. Set up a work order with lead A, line 1 created with no technician (it follows A), "
              "and line 2 set to Tech B on the Lines tab. Change the lead to C."),
      qh("§7", "Line 1 moves to C. Line 2 stays B."), qp("S4-R8"), qp("S4-R31")],
     "Handoff §7 lines follow the lead, on the detail-card path (board and dialog paths are in C96960, C96961, C368140).")

case("HIGH", "Edit Work Order saves a new lead and a new mileage together",
     [SIGN, DESK, LOC] + techs(["Esther Howard", "Ralph Edwards"]) + [CUST, WO,
      "Create one work order for the case customer (e.g. \"S1-712\"), set Lead Technician to \"Esther Howard\", enter "
      "a mileage (e.g. 120,000), add one line and approve it so the status reads Approved."],
     ["Open \"S1-712\".",
      "Open the work order's edit window (Edit Work Order).",
      "Change the lead technician to \"Ralph Edwards\".",
      "Change Mileage to 120,500.",
      "Save.",
      "Reload the page and read Lead Technician and Mileage."],
     ["Step 5: the window saves with no error message.",
      "Step 6: Lead Technician reads \"Ralph Edwards\" and Mileage reads 120,500. Both changes were saved."],
     src("High 1", "§7"), [H1_EDIT, QH7_OK],
     "Dev High 1 Edit Work Order uses the new shared lead path (happy path).")

case("HIGH", "A refused lead change in Edit Work Order saves none of the other edits",
     [SIGN, DESK, LOC] + techs(["Esther Howard", "Ralph Edwards"]) + [CUST, WO, STATUS, SECOND,
      "Create one work order for the case customer with a contact person (e.g. \"S1-714\"), set Lead Technician to "
      "\"Esther Howard\", enter a mileage (e.g. 120,000), engine hours (e.g. 3,420) and a PO number (e.g. \"PO-100\"), "
      "add one line and approve it so the status reads Approved."],
     ["In browser 1, open \"S1-714\" and open its edit window (Edit Work Order). Leave it open.",
      "In browser 2, open \"S1-714\", click the Finance tab and click Create Invoice so the work order is Invoiced.",
      "In browser 1, change the lead technician to \"Ralph Edwards\".",
      "Change Mileage to 120,500.",
      "Change Engine Hours to 3,470.",
      "Change the PO number to \"PO-200\".",
      "Save.",
      "Read the message that appears.",
      "Reload browser 1 and read Lead Technician, Mileage, Engine Hours and the PO number."],
     ["Step 8: an error message appears (write down its words) and the save does not go through.",
      "Step 9: Lead Technician still reads \"Esther Howard\", Mileage 120,000, Engine Hours 3,420 and PO \"PO-100\". "
      "None of the four edits was saved (0 of 4)."],
     src("High 1", "§7", ["§4 Key Decisions"]),
     [H1_EDIT_REF, qh("§7", "Edit Work Order on a Paid work order, with a different lead and a changed mileage, is "
                           "refused"), P_LOCK],
     "Dev High 1 Edit Work Order: refused lead change rolls back mileage, engine hours and PO (two browsers).")

case("HIGH", "A lead change in Edit Work Order adds one Lead tech changed entry",
     [SIGN, DESK, LOC] + techs(["Esther Howard", "Ralph Edwards"]) + [CUST, WO, AUDIT,
      "Create one work order for the case customer (e.g. \"S1-716\"), set Lead Technician to \"Esther Howard\", add "
      "two lines and approve them so the status reads Approved."],
     ["Open \"S1-716\" and open the Audit Log. Count the \"Lead tech changed\" entries and close the window.",
      "Note the time.",
      "Open the work order's edit window (Edit Work Order).",
      "Change the lead technician to \"Ralph Edwards\" and save.",
      "Open the Audit Log again.",
      "Read the newest entries."],
     ["Exactly one new \"Lead tech changed\" entry appears (count at step 1 + 1).",
      "It names Esther Howard as the previous lead, Ralph Edwards as the new lead, your user, and the time you noted.",
      "No separate entries appear for the two lines that followed the lead."],
     src("High 1", "§7", ["S4-R9", "S4-R17"]),
     [H1_HIST, QH7_HIST, qh("§7", "This now also happens for changes made in Edit Work Order"), qp("S4-R9"),
      qp("S4-R17")],
     "Dev High 1 history entry on Edit Work Order (drag, dialog and status-card paths are in C96962).")

case("HIGH", "A new line created with a technician keeps that technician",
     [SIGN, DESK, LOC] + techs(["Esther Howard", "Dana Ortiz"]) + [CUST, WO,
      "Create one work order for the case customer (e.g. \"S1-720\") with Lead Technician \"Esther Howard\"."],
     ["Open \"S1-720\" and click the Lines tab.",
      "Click New Line.",
      "Enter a name (e.g. \"Oil change\") and labor hours (e.g. 1.0).",
      "In Technicians pick \"Dana Ortiz\".",
      "Save the line.",
      "Reload the page and read the new line's Labor row."],
     ["Step 5: the line saves with no error message.",
      "Step 6: the new line shows \"Dana Ortiz\" as its technician."],
     src("High 1", "§7"), [H1_LINES, QH7_LINES_OK],
     "Dev High 1 Lines tab: adding a line with a technician still works.")

case("HIGH", "Changing a line's technician in Edit Line saves the new technician",
     [SIGN, DESK, LOC] + techs(["Esther Howard", "Ralph Edwards", "Dana Ortiz"]) + [CUST, WO, LINE,
      "Create one work order for the case customer (e.g. \"S1-722\") with Lead Technician \"Esther Howard\" and one "
      "line given to \"Dana Ortiz\" (click the line's name > Edit Line > Technicians > Dana Ortiz > save)."],
     ["Open \"S1-722\" and click the Lines tab.",
      "Click the line's name to open Edit Line.",
      "In Technicians replace \"Dana Ortiz\" with \"Ralph Edwards\".",
      "Save.",
      "Reload the page and read the line's technician."],
     ["Step 4: the line saves with no error message.",
      "Step 5: the line shows \"Ralph Edwards\" as its technician."],
     src("High 1", "§7"), [H1_LINES, QH7_LINES_OK],
     "Dev High 1 Lines tab: editing a line's technician still works.")

case("HIGH", "Assigning a technician to lines from the Lines tab still works",
     [SIGN, DESK, LOC] + techs(["Esther Howard", "Ralph Edwards"]) + [CUST, WO, LINE,
      "Create one work order for the case customer (e.g. \"S1-724\") with no lead technician and two lines with no "
      "technician (\"Line 1\", \"Line 2\")."],
     ["Open \"S1-724\" and click the Lines tab.",
      "Use the Lines tab's assign-technician action to assign \"Ralph Edwards\" to Line 1 and Line 2.",
      "Reload the page and read both lines' technicians."],
     ["Step 2: the assignment saves with no error message.",
      "Step 3: Line 1 and Line 2 both show \"Ralph Edwards\" (2 of 2)."],
     src("High 1", "§7"), [H1_LINES, QH7_LINES_OK],
     "Dev High 1 Lines tab: assigning a technician still works.")

case("HIGH", "Line technician lists offer no staff from another organization",
     ["Two organizations on the build under test: A (your usual test organization) and B. If you have no second "
      "organization, sign up a new one on the QA build (e.g. \"ZZAUTOTEST Org B\").",
      "In organization B add an eligible technician \"ZZAUTOTEST OrgB Tech\" (Settings > Staff > add a staff member, "
      "role Technician, Clockable on, Active, enrolled at a location).",
      SIGN + " Sign in to organization A.", DESK, LOC, CUST, WO, LINE,
      "Create one work order for the case customer in organization A (e.g. \"S1-726\") with one line."],
     ["Open \"S1-726\" and click the Lines tab.",
      "Click New Line and open the Technicians list. Type \"OrgB\".",
      "Cancel the new line.",
      "Click the existing line's name to open Edit Line, open Technicians and type \"OrgB\".",
      "Cancel.",
      "Open the Lines tab's assign-technician action and type \"OrgB\" in its technician list."],
     ["Steps 2, 4 and 6: \"ZZAUTOTEST OrgB Tech\" is never offered. Only organization A's staff are listed.",
      "The server also refuses a technician from another organization if one is sent outside the screens. This part "
      "cannot be checked by hand; write 'not checked by hand' in the result comment and pass or fail on what you can "
      "see."],
     src("High 1", "§9, §10"), [H1_LINES, qh("§10", "Logged in at location A, nothing from location B appears in the "
                                                     "List, Board View, Tech View, the candidates or the part counts.")],
     "Dev High 1 Lines tab organization check (human-visible part).")

# ===================================================================================== HIGH 2 — clock-in and labor moves
H2_CLOCK = qd("High 2", "Clock in as a technician on an unassigned line: the line should take that technician.")
H2_MOVE = qd("High 2", "Move a labor task from one line to another: the target line takes the technician.")

case("HIGH", "Clocking in on an unassigned line gives the line to that technician",
     [SIGN, DESK, LOC] + techs(["Esther Howard"]) + [CUST, WO, LINE, SECOND,
      "Create one work order for the case customer (e.g. \"S1-730\") with NO lead technician (leave Lead Technician "
      "empty, so the line does not follow anyone) and one line with no technician. Approve the line.",
      "Esther Howard can sign in (she has an email and a password, or you can reset hers in Settings > Staff)."],
     ["In browser 1, open \"S1-730\", click the Lines tab and read the line's Labor row.",
      "In browser 2, sign in as \"Esther Howard\".",
      "Open \"S1-730\" and click the Lines tab.",
      "Click Start time clock on the line's Labor row.",
      "Wait at least 1 minute, then click Stop time clock.",
      "In browser 1, reload the page and read the line's Labor row."],
     ["Step 1: the Labor row reads \"Unassigned\".",
      "Step 6: the Labor row now shows \"Esther Howard\". The line took the technician who clocked in."],
     src("High 2", "§7"), [H2_CLOCK, QH7_CLOCK, qd("High 2", "Both code paths were changed.")],
     "Dev High 2 clock-in on an unassigned line.")

case("HIGH", "Moving labor to another line gives that line the technician",
     [SIGN, DESK, LOC] + techs(["Esther Howard"]) + [CUST, WO, LINE, SECOND,
      "Create one work order for the case customer (e.g. \"S1-732\") with NO lead technician and two lines with no "
      "technician, \"Line 1\" and \"Line 2\". Approve both lines.",
      "In browser 2 sign in as \"Esther Howard\", open the work order, click Start time clock on Line 1's Labor row, "
      "wait at least 1 minute, then click Stop time clock, so Line 1 has Esther Howard's labor. Line 2 still reads "
      "\"Unassigned\"."],
     ["In browser 1, open \"S1-732\" and click the Lines tab.",
      "Hover Line 1's Labor row and click its More actions.",
      "Click Move labor.",
      "Pick \"Line 2\" as the destination and confirm.",
      "Reload the page and read Line 2's Labor row."],
     ["Step 4: the move saves with no error message.",
      "Step 5: Line 2's Labor row shows \"Esther Howard\". The line that received the labor took its technician."],
     src("High 2", None), [H2_MOVE, qd("High 2", "Both code paths were changed.")],
     "Dev High 2 labor move to another line.")

# ===================================================================================== HIGH 3 — Schedule
H3_DRAG = qd("High 3", "Creating shifts by dragging onto the schedule should still work.")
case("HIGH", "Dragging a work order onto the Schedule as Entire work order makes a shift",
     [SIGN, DESK, LOC] + techs(["Esther Howard"]) + [CUST, WO,
      "Create one Approved work order for the case customer (e.g. \"S1-740\") with one line. Your role can create and "
      "edit the Schedule (Settings > Roles & Permissions > open the role > Schedule > Create & Edit)."],
     ["Click Schedule in the top menu and go to tomorrow.",
      "Find \"S1-740\" in the work order list beside the schedule.",
      "Drag it onto Esther Howard's row at 9:00.",
      "In the picker choose Entire work order.",
      "Set the end time to 11:00 and save.",
      "Reload the page and look at Esther Howard's row."],
     ["Step 5: the shift saves with no error message.",
      "Step 6: Esther Howard's row shows a 9:00–11:00 shift for \"S1-740\" for the whole work order (no single line "
      "named on it)."],
     src("High 3", "§0"), [H3_DRAG],
     "Dev High 3 creating a whole-work-order shift by dragging.")

case("HIGH", "Dragging a work order onto the Schedule with Choose lines makes a line shift",
     [SIGN, DESK, LOC] + techs(["Esther Howard"]) + [CUST, WO,
      "Create one Approved work order for the case customer (e.g. \"S1-742\") with two lines, \"Line 1\" and "
      "\"Line 2\". Your role can create and edit the Schedule (Settings > Roles & Permissions > open the role > "
      "Schedule > Create & Edit)."],
     ["Click Schedule in the top menu and go to tomorrow.",
      "Find \"S1-742\" in the work order list beside the schedule.",
      "Drag it onto Esther Howard's row at 13:00.",
      "In the picker choose Choose lines and tick Line 1 only.",
      "Set the end time to 15:00 and save.",
      "Reload the page and open the new shift."],
     ["Step 5: the shift saves with no error message.",
      "Step 6: Esther Howard's row shows a 13:00–15:00 shift for \"S1-742\" covering Line 1 only (1 of 2 lines)."],
     src("High 3", "§0"), [H3_DRAG],
     "Dev High 3 creating a line shift by dragging.")

# ===================================================================================== HIGH 4 — asset and customer WO tabs
H4_API = qd("High 4", "Both use the same work orders list API, which was refactored and is now scoped to the "
                      "organization.")
H4_CHECK = qd("High 4", "Check rows, counts, progress and sorting.")
H4_TOGGLE = qd("High 4", "The asset-on-site toggle no longer sends the lead; the lead should stay unchanged after a "
                         "toggle.")
QH9_RENDER = qh("§9", "The List, the customer Work Orders tab and the vehicle Work Orders tab still render.")
TAB_DATA = [
    "Create a customer used only by this case: Customers > New Customer, name (e.g. \"ZZAUTOTEST Tab Co\"), then "
    "Save. On its Assets tab add two assets with New Asset: \"TRK-201\" (e.g. 2021 Kenworth T680) and \"TRK-202\" "
    "(e.g. 2019 Peterbilt 579).",
    STATUS,
    WO.replace("the case customer and its asset", "the case customer and the asset named"),
    "For TRK-201 create 3 work orders: A = Estimate with one line (e.g. \"S1-750\"), B = Approved with two lines where "
    "Line 1 is completed and Line 2 is not (enter a tech story on Line 1 and complete it) (e.g. \"S1-751\"), C = "
    "Complete (e.g. \"S1-752\").",
    "For TRK-202 create 1 Approved work order D (e.g. \"S1-753\").",
    "Open Work Orders in List, search \"ZZAUTOTEST Tab Co\" and write down the Progress shown for B.",
]
ASSET_TAB = ("Click Customers in the top menu, open \"ZZAUTOTEST Tab Co\", click its Assets tab, open \"TRK-201\" and "
             "click its Work Orders tab.")
CUST_TAB = "Click Customers in the top menu, open \"ZZAUTOTEST Tab Co\" and click its Work Orders tab."

for where, nav, rows, total in (("An asset's", ASSET_TAB, "A, B and C", 3), ("A customer's", CUST_TAB,
                                                                            "A, B, C and D", 4)):
    short = "asset" if where.startswith("An") else "customer"
    case("HIGH", f"{where} Work Orders tab lists exactly its own work orders",
         [SIGN, DESK, LOC] + TAB_DATA,
         [nav, "Read every work order number in the table."],
         [f"The table lists {rows} ({total} rows) and nothing else. "
          + ("D (TRK-202) is not listed." if short == "asset" else "Work orders of other customers are not listed."),
          "No error message appears and the table finishes loading."],
         src("High 4", "§9, hotspot 4"), [H4_API, H4_CHECK, QH9_RENDER],
         f"Dev High 4 rows on the {short} Work Orders tab.")
    case("HIGH", f"{where} Work Orders tab count matches its rows",
         [SIGN, DESK, LOC] + TAB_DATA,
         [nav, "Read the count shown for the list (on the tab label or under the table, e.g. \"1-"
          + str(total) + " of " + str(total) + "\").", "Count the rows in the table."],
         [f"The count reads {total} and the table has {total} rows. The two numbers are the same."],
         src("High 4", "hotspot 4"), [H4_API, H4_CHECK],
         f"Dev High 4 counts on the {short} Work Orders tab.")
    case("HIGH", f"{where} Work Orders tab shows the same progress as the List",
         [SIGN, DESK, LOC] + TAB_DATA,
         [nav, "Read the Progress shown for B (\"S1-751\")."],
         ["B's Progress equals the value you wrote down from the Work Orders List (e.g. 1 of 2 lines complete shown the "
          "same way in both places)."],
         src("High 4", "hotspot 4"), [H4_API, H4_CHECK],
         f"Dev High 4 progress on the {short} Work Orders tab.")
    case("HIGH", f"{where} Work Orders tab sorts by a column header",
         [SIGN, DESK, LOC] + TAB_DATA,
         [nav, "Click the work order number column header.", "Read the order of the rows.",
          "Click the same header again.", "Read the order of the rows."],
         [f"Step 3: the {total} rows are in number order (e.g. "
          + ("S1-750, S1-751, S1-752" if short == "asset" else "S1-750, S1-751, S1-752, S1-753") + ").",
          "Step 5: the same rows in the reverse order. No row is missing or repeated."],
         src("High 4", "hotspot 4"), [H4_API, H4_CHECK],
         f"Dev High 4 sorting on the {short} Work Orders tab.")

case("HIGH", "The asset tab's Asset on Site toggle keeps the lead technician",
     [SIGN, DESK, LOC] + techs(["Ana Alpha"]) + [
      "Create a customer used only by this case: Customers > New Customer, name (e.g. \"ZZAUTOTEST Tab Co\"), then "
      "Save. On its Assets tab add an asset with New Asset (e.g. \"TRK-201\").", WO.replace(
          "the case customer and its asset", "the case customer and TRK-201"),
      "Create one Approved work order for TRK-201 (e.g. \"S1-760\") with Lead Technician \"Ana Alpha\"."],
     ["Click Customers in the top menu, open \"ZZAUTOTEST Tab Co\", click its Assets tab, open \"TRK-201\" and click "
      "its Work Orders tab.",
      "In the \"S1-760\" row click the Asset on Site toggle to change it.",
      "Reload the page and read the Asset on Site value.",
      "Open \"S1-760\" and read Lead Technician."],
     ["Step 2: the toggle flips with no error message.", "Step 3: the new Asset on Site value is kept.",
      "Step 4: Lead Technician still reads \"Ana Alpha\"."],
     src("High 4", "§2"), [H4_TOGGLE],
     "Dev High 4 asset-on-site toggle on the asset tab (simple path).")

case("HIGH", "The asset tab's toggle on an old page does not undo a new lead",
     [SIGN, DESK, LOC] + techs(["Ana Alpha", "Ben Bravo"]) + [SECOND,
      "Create a customer used only by this case: Customers > New Customer, name (e.g. \"ZZAUTOTEST Tab Co\"), then "
      "Save. On its Assets tab add an asset with New Asset (e.g. \"TRK-201\").", WO.replace(
          "the case customer and its asset", "the case customer and TRK-201"),
      "Create one Approved work order for TRK-201 (e.g. \"S1-762\") with Lead Technician \"Ana Alpha\"."],
     ["In browser 1, open Customers > \"ZZAUTOTEST Tab Co\" > Assets > \"TRK-201\" > Work Orders tab and leave it open.",
      "In browser 2, open \"S1-762\" and change Lead Technician to \"Ben Bravo\".",
      "In browser 1, without reloading, click the \"S1-762\" row's Asset on Site toggle.",
      "In browser 1, open \"S1-762\" and read Lead Technician and Asset on Site."],
     ["Lead Technician reads \"Ben Bravo\". The older page in browser 1 did not put Ana Alpha back.",
      "The Asset on Site change from step 3 is kept."],
     src("High 4", "§2"), [H4_TOGGLE, qh("§2", "the lead is unchanged.")],
     "Dev High 4 asset-on-site toggle no longer sends the lead (stale-page proof).")

# ===================================================================================== HIGH — Lines tab (handoff §8)
case("HIGH", "Removing a line's only shift puts its Labor row back to Unassigned",
     [SIGN, DESK, LOC] + techs(["Jenny Wilson"]) + [CUST, WO, SHIFT,
      "Create one Approved work order for the case customer with NO lead technician (e.g. \"S1-770\") and one line "
      "with no labor and no technician (\"Line 1\").",
      "On the Schedule give \"Jenny Wilson\" a shift on \"S1-770\" tomorrow 8:00–10:00 with Choose lines and Line 1 "
      "ticked."],
     ["Open \"S1-770\", click the Lines tab and read Line 1's Labor row.",
      "Click Schedule in the top menu, go to tomorrow and delete Jenny Wilson's shift on \"S1-770\".",
      "Open \"S1-770\" again, click the Lines tab and read Line 1's Labor row."],
     ["Step 1: Line 1's Labor row shows \"Jenny Wilson\".",
      "Step 3: Line 1's Labor row reads \"Unassigned\" again (no scheduled technician, no labor technician)."],
     src(None, "§8", ["S7-R8", "S7-R10"]),
     [qp("S7-R8"), qp("S7-R10"), qh("§8", "Remove the shifts and it goes back to")],
     "Handoff §8 removing the shifts restores the empty Labor row (PRD wording \"Unassigned\" wins).")

case("HIGH", "A line with labor by a deleted staff member still reads Deleted user",
     [SIGN, DESK, LOC,
      "A work order at this location has a line whose labor was logged by a staff member who has since been deleted, "
      "so its Labor row reads \"Deleted user\". To find one: open the work orders you know were worked by former staff "
      "and check their Lines tab. If there is none on this site, mark the case Blocked with 'no Deleted user line on "
      "this site'.", SHIFT,
      "On the Schedule give an eligible technician (e.g. \"Jenny Wilson\") a shift tomorrow on that work order with "
      "Choose lines and that line ticked."],
     ["Open the work order and click the Lines tab.", "Read that line's Labor row."],
     ["The Labor row still reads \"Deleted user\". The scheduled technician does not replace a line that has real "
      "labor."],
     src(None, "§8", ["S7-R8"]),
     [qh("§8", "A line with real labor keeps its labor technician, and \"Deleted user\" stays."), qp("S7-R8")],
     "Handoff §8 real labor and Deleted user are kept.")

case("HIGH", "At phone width an expanded line shows its scheduled technicians",
     [SIGN, LOC] + techs(["Jenny Wilson"]) + [CUST, WO, SHIFT,
      "Create one Approved work order for the case customer with NO lead technician (e.g. \"S1-772\") and one line "
      "with no labor (\"Line 1\").",
      "On the Schedule give \"Jenny Wilson\" a shift on \"S1-772\" tomorrow 8:00–10:00 with Choose lines and Line 1 "
      "ticked.",
      "Use a phone, or narrow the browser window to about 390 px wide."],
     ["Open \"S1-772\" and click the Lines tab.", "Tap Line 1's card to expand it.",
      "Read the Assigned Technicians part of the card."],
     ["Assigned Technicians shows \"Jenny Wilson\". No \"Needs techs\" badge appears."],
     src(None, "§8", ["S7-R8", "S7-R9"]),
     [qh("§8", "expand the line card. \"Assigned Technicians\" shows the scheduled names"), qp("S7-R8"),
      qp("S7-R9")],
     "Handoff §8 phone-width line card.")

# ===================================================================================== HIGH — List rebuilt (hotspot 3)
P_LIST = qps("§1 Business Case", "List remains the default and stays exactly as it is in production today; the only "
             "addition to the Work Orders page is the switcher that offers the two new displays.")
HOT3 = qh("hotspot 3", "The rebuilt Work Orders List. Check saved preferences against URL links, Back and Forward, "
                       "location switch, stale rows after an edit, and sorting and paging.")
LBASE = [SIGN, DESK, LOC, LIST]


def lcase(title, extra, steps, results, qah, quotes, why, desk=True):
    pre = ([SIGN, DESK, LOC, LIST] if desk else [SIGN, LOC]) + extra
    case("HIGH", title, pre, steps, results, src(None, qah, ["§1 Business Case"]), quotes + [P_LIST], why)


lcase("Changing tab in the List clears the search box",
      [CUST, WO, "Create one Approved work order for the case customer (e.g. \"S1-780\")."],
      ["Open Work Orders and click the All tab.", "Type \"ZZAUTOTEST Regression Co\" in Search.",
       "Click the Estimates tab.", "Read the search box and the rows."],
      ["The search box is empty and the Estimates tab shows its work orders without the search applied."],
      "§2", [qh("§2", "Changing tab clears the search box.")], "Handoff §2 tab change clears search.")

lcase("A column turned on in List Column Selection stays after a reload",
      [], ["Open Work Orders and click the All tab.", "Click Column Selection in the toolbar.", "Turn on Days open.",
           "Close the menu.", "Reload the page."],
      ["Step 4: the List shows a Days open column.", "Step 5: after the reload Days open is still shown."],
      "§2", [qh("§2", "turn \"Days open\" on, reload, and it is still shown.")],
      "Handoff §2 List Column Selection is saved.")

lcase("A new user's List hides the five optional columns by default",
      ["A user who has never opened Work Orders (e.g. \"Nora New\"): Settings > Staff > add a staff member with a role "
       "that has Work Orders view, then sign in as that user in a private window."],
      ["As Nora New, open Work Orders and click the All tab.", "Write down every column heading.",
       "Click Column Selection and read which columns are off."],
      ["Invoiced Date, Days open, Parts, Returns and Waiting On Parts are not shown (5 columns off).",
       "Every other column shows as it does in production today."],
      "§2", [qh("§2", "Hidden by default: Invoiced Date, Days open, Parts, Returns, Waiting On Parts.")],
      "Handoff §2 default hidden columns.")

lcase("Clicking a sortable List header orders the rows",
      [CUST, WO, "Create three work orders for the case customer on different days or in order (e.g. \"S1-781\", "
                 "\"S1-782\", \"S1-783\")."],
      ["Open Work Orders, click the All tab and type \"ZZAUTOTEST Regression Co\" in Search.",
       "Click the work order number column header.", "Read the order of the rows.", "Click the same header again.",
       "Read the order of the rows.", "Repeat steps 2 to 5 for every other header that can be clicked to sort."],
      ["Step 3: S1-781, S1-782, S1-783. Step 5: S1-783, S1-782, S1-781.",
       "Step 6: every sortable header orders the 3 rows by that column, one way then the other. Write down any header "
       "that does not."],
      "§2", [qh("§2", "Every sortable header orders the rows.")], "Handoff §2 sortable headers.")

lcase("Paging the List shows no repeated or missing work orders",
      [CUST, WO, "Create enough work orders for the case customer on the same day to fill more than one page: 12 if the "
                 "smallest rows-per-page choice at the bottom of the List is 10, otherwise one full page plus 2. Write "
                 "down every number."],
      ["Open Work Orders, click the All tab and type \"ZZAUTOTEST Regression Co\" in Search.",
       "At the bottom of the List pick the smallest rows-per-page choice (e.g. 10).",
       "Write down every work order number on page 1.", "Go to page 2.", "Write down every number on page 2."],
      ["Pages 1 and 2 together list every work order you created exactly once (e.g. 10 + 2 = 12).",
       "No number appears on both pages and none is missing."],
      "§2", [qh("§2", "With 12 work orders for one customer on the same date, paging shows no repeats and no gaps.")],
      "Handoff §2 paging tie-break.")

lcase("With only Invoiced ticked on All, the List sorts newest invoice first",
      [CUST, WO, STATUS, "Create two work orders for the case customer with a contact person. Invoice X first (e.g. "
                         "\"S1-790\"), wait one minute, then invoice Y (e.g. \"S1-791\")."],
      ["Open Work Orders and click the All tab.", "Click Status and tick Invoiced only.",
       "Click Column Selection and turn on Invoiced Date.", "Type \"ZZAUTOTEST Regression Co\" in Search.",
       "Read the order of the rows and their Invoiced Date."],
      ["Y (\"S1-791\") is above X (\"S1-790\"): the rows are in Invoiced Date order, newest first."],
      "§2", [qh("§2", "On All, with only \"Invoiced\" selected in Status, the list sorts by Invoiced Date, newest "
                      "first.")], "Handoff §2 Invoiced sort.")

lcase("Switching List tabs quickly shows only the last tab's work orders",
      [], ["Open Work Orders and click the All tab.",
           "Click Estimates, Completed, Work Orders and Completed again as fast as you can.",
           "Wait for the List to finish loading.", "Read the rows and look for any error message."],
      ["Only the Completed tab's work orders show (every row reads Complete or a later status, as the Completed tab "
       "shows today).", "No error message appears.",
       "Requests the page stops on the way are a developer check. This part cannot be checked by hand; write 'not "
       "checked by hand' in the result comment and pass or fail on what you can see."],
      "§2", [qh("§2", "Switch tabs quickly."), qh("§2", "no error toast appears, and only the last tab's rows show.")],
      "Handoff §2 quick tab switching.")

lcase("Clicking a row's Asset on Site toggle does not open the work order",
      [CUST, WO, "Create one Approved work order for the case customer (e.g. \"S1-792\")."],
      ["Open Work Orders, click the All tab and type \"ZZAUTOTEST Regression Co\" in Search.",
       "In the \"S1-792\" row click the Asset on Site toggle.", "Read the page you are on and the toggle."],
      ["You are still on the Work Orders List (the work order did not open) and the toggle's icon has flipped."],
      "§2", [qh("§2", "The icon flips and the work order does not open.")],
      "Handoff §2 toggle does not open the row (saving and lead are in C368158, C368159).")

lcase("After a status change, Back shows the new status in the List",
      [CUST, WO, "Create one Approved work order for the case customer with a line (e.g. \"S1-793\")."],
      ["Open Work Orders, click the All tab and type \"ZZAUTOTEST Regression Co\" in Search.",
       "Click the \"S1-793\" row to open it.", "Use the status control to set it to Ready for Review.",
       "Press the browser Back button.", "Read the \"S1-793\" row's status."],
      ["The row reads Review straight away, with no manual reload."],
      "§2, hotspot 3", [qh("§2", "Open a work order, change its status, then press Back. The list refetches and shows "
                                 "the new status."), HOT3], "Handoff §2 Back after an edit (stale rows).")

lcase("A work order made with Create Work Order shows in the List at once",
      [CUST], ["Open Work Orders and click the All tab.", "Click Create Work Order.",
               "Pick \"ZZAUTOTEST Regression Co\" and its asset and create the work order. Write down its number.",
               "Go back to Work Orders (top menu) without reloading.", "Type \"ZZAUTOTEST Regression Co\" in Search."],
      ["The new work order is listed without a manual reload."],
      "§2", [qh("§2", "A work order created with Create Work Order appears without a manual reload.")],
      "Handoff §2 new work order appears.")

lcase("A link with Estimates and Assigned to me opens with both applied",
      ["Your saved List is on the All tab with Assigned to me off (set it so before you start)."],
      ["In the browser's address bar, open the site's Work Orders address with ?tab=estimate&assigned_to_me=1 added "
       "at the end (e.g. https://sv10043.qa.shopview.com/workorders?tab=estimate&assigned_to_me=1).",
       "Read which tab is selected and whether Assigned to me is on."],
      ["The Estimates tab is selected and Assigned to me is on."],
      "§2, hotspot 3", [qh("§2", "Estimates and Assigned to me are applied."), HOT3],
      "Handoff §2 shared link applies its settings.")

lcase("Opening Work Orders after a link shows your saved view",
      ["Your saved List is on the All tab with Assigned to me off (set it so before you start)."],
      ["Open the site's Work Orders address with ?tab=estimate&assigned_to_me=1 added at the end.",
       "Click Work Orders in the top menu.", "Read which tab is selected and whether Assigned to me is on."],
      ["The All tab is selected and Assigned to me is off: your saved view, not the link's."],
      "§2, hotspot 3", [qh("§2", "afterwards shows the saved view, not the link's."), HOT3],
      "Handoff §2 link does not overwrite the saved view.")

lcase("A link with an unknown Asset on Site value is ignored",
      ["Your saved List is on the All tab with no filters (set it so before you start). Write down how many work "
       "orders the All tab shows."],
      ["Open the site's Work Orders address with ?vehicleHere=2 added at the end.",
       "Read the Asset on Site filter and the number of work orders shown."],
      ["The Asset on Site filter has nothing selected, the same number of work orders shows as before, and no error "
       "message appears."],
      "§2", [qh("§2", "`?vehicleHere=2` is ignored.")], "Handoff §2 unknown link value ignored.")

lcase("Without See Financial Data the List has no Total price column or total",
      ["A user whose role has Work Orders view but not See Financial Data (Settings > Roles & Permissions: copy a role, "
       "turn See Financial Data off; Settings > Staff: add a staff member with that role). Sign in as that user in a "
       "private window for the steps."],
      ["As that user open Work Orders and click the All tab.", "Read the column headings.",
       "Click Column Selection and read the options.", "Scroll to the bottom of the List."],
      ["No Total price column is shown, Column Selection does not offer it, and no total row or total figure is "
       "shown at the bottom."],
      "§2", [qh("§2", "Without financial data: no Total price column and no total.")],
      "Handoff §2 financial permission on List.")

lcase("A view-only user sees no Create Work Order button in the List",
      ["A user whose role has Work Orders view but not Work Orders create and edit (Settings > Roles & Permissions: "
       "copy a role and turn Create & Edit off on Work Orders; Settings > Staff: add a staff member with that role). "
       "Sign in as that user in a private window for the steps."],
      ["As that user open Work Orders and click the All tab.", "Look for the Create Work Order button."],
      ["There is no Create Work Order button."],
      "§2", [qh("§2", "View-only user: no Create Work Order button, and the toggle is disabled.")],
      "Handoff §2 view-only Create button.")

lcase("A view-only user cannot change a row's Asset on Site toggle",
      ["A user whose role has Work Orders view but not Work Orders create and edit (Settings > Roles & Permissions: "
       "copy a role and turn Create & Edit off on Work Orders; Settings > Staff: add a staff member with that role). "
       "Sign in as that user in a private window for the steps.", CUST, WO,
       "As your own user create one Approved work order for the case customer (e.g. \"S1-794\")."],
      ["As the view-only user open Work Orders, click the All tab and search \"ZZAUTOTEST Regression Co\".",
       "Click the \"S1-794\" row's Asset on Site toggle.", "Reload and read the toggle."],
      ["The toggle is shown disabled and does not change, before or after the reload."],
      "§2", [qh("§2", "View-only user: no Create Work Order button, and the toggle is disabled.")],
      "Handoff §2 view-only toggle.")

lcase("On a phone the List sort choice stays after a reload",
      ["Use a phone, or narrow the browser window to about 390 px wide."],
      ["Open Work Orders.", "Tap the sort button.", "Pick Customer A-Z.", "Reload the page.",
       "Read the sort button and the order of the cards."],
      ["After the reload the sort still reads Customer A-Z and the cards are in customer name order A to Z."],
      "§2", [qh("§2", "keeps its choice after a reload.")], "Handoff §2 phone sort is saved.", desk=False)

lcase("On a phone the next page of cards loads only when you scroll",
      ["Use a phone, or narrow the browser window to about 390 px wide.",
       "The All tab holds more work orders than one page (most test sites do, e.g. 40 or more)."],
      ["Open Work Orders and click the All tab.", "Without scrolling, count the cards.",
       "Scroll to the bottom of the cards.", "Count the cards again."],
      ["Step 2: one page of cards shows (write down the number, e.g. 25).",
       "Step 4: more cards appear only after the scroll (e.g. 50), with no repeats."],
      "§2", [qh("§2", "Page 2 loads only after scrolling.")], "Handoff §2 phone paging.", desk=False)

lcase("On a phone a no-match search shows the empty state with Clear filters",
      ["Use a phone, or narrow the browser window to about 390 px wide."],
      ["Open Work Orders and click the All tab.", "Search for \"zz-no-such-work-order\".",
       "Read the message shown.", "Tap Clear filters."],
      ["Step 3: the page reads \"No work orders match your filters\" with a Clear filters action.",
       "Step 4: the search is cleared and the work orders show again."],
      "§2", [qh("§2", "The empty state shows `empty_state_clear_filters_mobile`."), qp("S1-N1")],
      "Handoff §2 phone empty state (desktop is C96918).", desk=False)

lcase("The List at one location shows no work orders from another location",
      ["A second location in this organization (Settings > Locations), with a work order for customer \"ZZAUTOTEST "
       "Loc2 Customer\" created while that location is picked in the top bar (e.g. \"S2-501\")."],
      ["At your usual location open Work Orders and click the All tab.", "Type \"Loc2\" in Search.",
       "Clear the search and look through the list for \"S2-501\".",
       "In the top bar pick the second location, open Work Orders, click All and search \"Loc2\"."],
      ["Steps 2 and 3: \"S2-501\" does not appear at your usual location.",
       "Step 4: \"S2-501\" does appear at the second location, so the record exists and is only hidden where it does "
       "not belong."],
      "§10, hotspot 4", [qh("§10", "Logged in at location A, nothing from location B appears in the List, Board View, "
                                   "Tech View, the candidates or the part counts.")],
      "Handoff §10 List location scope.")

lcase("The List's Parts and Returns counts match the work order",
      [CUST, WO, "Create one Approved work order for the case customer (e.g. \"S1-795\"). On its Lines tab add a line "
                 "and, in the line's Parts section, add two parts from a vendor with + Add Part so two part requests "
                 "exist. Receive one of them (the part row's Receive button) and raise a return on it (the Return arrow "
                 "> Add new part return request > Return reason, Quantity 1 > Save & Close)."],
      ["Open Work Orders, click the All tab and type \"ZZAUTOTEST Regression Co\" in Search.",
       "Click Column Selection and turn on Parts and Returns.", "Read the \"S1-795\" row's Parts and Returns."],
      ["Parts reads 2 and Returns reads 1, the requests you created. Nothing from other work orders or locations is "
       "added."],
      "§10, API changes", [qh("Where This Applies", "Part request and part return counts (Work Orders List and Part "
                                                     "Sales list) are now scoped to the organization.")],
      "Handoff part counts on the Work Orders List.")

lcase("After Back and Forward the List keeps its tab, search and filters",
      [CUST, WO, "Create one Approved work order for the case customer (e.g. \"S1-796\")."],
      ["Open Work Orders and click the Work Orders tab.", "Click Status and tick Approved only.",
       "Type \"ZZAUTOTEST Regression Co\" in Search.", "Click the \"S1-796\" row to open it.",
       "Press the browser Back button and read the tab, Status, search and rows.",
       "Press the browser Forward button and read the page.", "Press Back again and read the List."],
      ["Step 5: the Work Orders tab, Status Approved and the same rows show, as they do in production today. Write "
       "down whether the search text is kept.", "Step 6: the work order \"S1-796\" opens again.",
       "Step 7: the List shows the same tab, filters and rows as at step 5."],
      "hotspot 3", [HOT3, qp("S1-R8")], "Hotspot 3 Back and Forward on the List.")

# ===================================================================================== MEDIUM 5 — Part Sales
M5 = qd("5", "The detail page's status card had props removed. Check that it renders and that changing the "
             "technician works.")
M5_COUNT = qd("5", "The Part Sales list's part request and part return counts are now scoped to the organization.")
PS = ("Create a part sale: Parts > Part Sales > New Part Sale, select a customer (e.g. \"ZZAUTOTEST Regression Co\"; "
      "add it with Customers > New Customer if missing). On the Parts tab click Add Part, enter a Description (e.g. "
      "\"Brake Pads\"), Quantity 1 and a Sell Price (e.g. $290.91), and save the row. Write down the part sale's number "
      "(e.g. \"PS-1001\").")
case("MEDIUM", "A part sale's status card shows in full",
     [SIGN_ADMIN, DESK, LOC, PS],
     ["Click Parts in the top menu, then Part Sales.", "Open \"PS-1001\".", "Read the status card at the left of the "
      "page."],
     ["The status card shows the part sale's status and its people fields (e.g. Sales Representative or technician) "
      "with their values, with no empty box, missing field or error message. Write down the fields you see."],
     src("Medium 5", "Frontend screens"), [M5], "Dev Medium 5 part sale status card renders.")
case("MEDIUM", "Changing the person on a part sale's status card saves",
     [SIGN_ADMIN, DESK, LOC] + techs(["Esther Howard"]) + [PS],
     ["Click Parts in the top menu, then Part Sales.", "Open \"PS-1001\".",
      "On the status card pick a different person in the technician field (on part sales it may read Sales "
      "Representative), e.g. \"Esther Howard\".", "Reload the page and read the field."],
     ["Step 3: the change saves with no error message.", "Step 4: the field still shows \"Esther Howard\"."],
     src("Medium 5", None), [M5], "Dev Medium 5 changing the technician on the part sale status card.")
case("MEDIUM", "The Part Sales list shows the right part request and return counts",
     [SIGN_ADMIN, DESK, LOC, PS + " Add a second part row the same way.",
      "Receive one part (the part row's Receive button > Receive parts > Receive) and raise a return on it (the "
      "Return arrow > Add new part return request > Return reason, Quantity 1 > Save & Close).",
      "A second location in this organization with its own part sale that has part requests (create it with the "
      "second location picked in the top bar)."],
     ["Click Parts in the top menu, then Part Sales.", "Find \"PS-1001\".",
      "Read its part request count and part return count (columns or badges on the row)."],
     ["\"PS-1001\" shows 2 part requests and 1 part return, the ones you created.",
      "Counts from the second location's part sale are not added to it."],
     src("Medium 5", "§10"), [M5_COUNT, qh("§10", "Parts → Part Sales still shows the right part request and part "
                                                  "return counts.")], "Dev Medium 5 Part Sales list counts.")

# ===================================================================================== MEDIUM 6 — remembered filters
M6 = qd("6", "Set a filter, reload, and check that it's kept.")
M6_PAGES = qd("6", "Pages that remember filters and settings: Orders, Vendors, Return Requests, Return Credits, Part "
                   "Sales, Deliveries, Parts Catalogue, Inventory, and the report pages.")
FILTER_PAGES = [
    ("Purchase Orders", ["Click Parts in the top menu, then Purchase Orders."], "Vendor",
     "At least two vendors with purchase orders at this location (Parts > Purchase Orders lists orders from more than "
     "one vendor)."),
    ("Vendors", ["Click Parts in the top menu, then Vendors."], "State/Province",
     "At least two vendors in different states or provinces (Parts > Vendors > New Vendor if needed)."),
    ("Return requests", ["Click Parts in the top menu, then Returns.", "Make sure the Returns tab is selected."],
     "Vendor", "At least two return requests for parts from different vendors."),
    ("Return credits", ["Click Parts in the top menu, then Returns.", "Click the Credits tab."], "Vendor",
     "At least two processed credits from different vendors."),
    ("Part Sales", ["Click Parts in the top menu, then Part Sales."], "Status",
     "At least two part sales in different statuses."),
    ("Deliveries", ["Click Parts in the top menu, then Deliveries."], "any of its filter buttons (e.g. Vendor)",
     "At least two deliveries from different vendors."),
    ("Catalog", ["Click Parts in the top menu, then Catalog."], "Manufacturer",
     "Catalog parts from at least two manufacturers."),
    ("Inventory", ["Click Parts in the top menu, then Inventory."], "Category",
     "Inventory parts in at least two categories."),
]
REPORTS = [
    ("Work In Progress", "Performance", "Location", "the organization has at least two locations"),
    ("Sales By Customer", "Performance", "Customer", "at least two customers have invoices in the report's range"),
    ("Parts Velocity", "Parts", "Vendor", "at least two vendors have parts sold in the report's range"),
    ("Inventory Value", "Parts", "Category", "inventory parts exist in at least two categories"),
    ("Technician Utilization", "Performance", "Technician", "at least two technicians clocked time in the report's "
                                                            "range"),
    ("Sales By Representative", "Performance", "Location", "the organization has at least two locations"),
]
for name, nav, flt, data in FILTER_PAGES:
    fname = flt if flt.startswith("any") else f"the {flt} filter"
    case("MEDIUM", f"{name} keeps a chosen filter after a reload",
         [SIGN_ADMIN, DESK, LOC, PARTS, data],
         nav + [f"Open {fname} and tick one value (e.g. the first one listed). Write down the value.",
                "Close the filter and write down the rows shown.", "Reload the page."],
         ["After the reload the filter still shows the value you ticked and the same rows show as before the reload.",
          "No error message appears."],
         src("Medium 6", "hotspot 5"), [M6_PAGES, M6], f"Dev Medium 6 remembered filter on {name}.")
for name, grp, flt, data in REPORTS:
    case("MEDIUM", f"The {name} report keeps a chosen filter after a reload",
         [SIGN_ADMIN, DESK, LOC, f"Your role can see reports, and {data}."],
         ["Click Reports in the top menu.", f"In the {grp} group click \"{name}\".",
          f"Open the {flt} filter and untick one value. Write down which.",
          "Close the filter and write down the rows or totals shown.", "Reload the page."],
         ["After the reload the filter still shows your choice and the report shows the same rows or totals as before "
          "the reload.", "No error message appears."],
         src("Medium 6", "hotspot 5"), [M6_PAGES, M6], f"Dev Medium 6 remembered filter on the {name} report.")

# ===================================================================================== MEDIUM 7 — report filter option lists
M7 = qd("7", "The filter option list now supports disabled options. Check that options toggle normally and that "
             "Select all and Clear selection work.")
for name, grp, flt, data in REPORTS:
    case("MEDIUM", f"The {name} {flt} filter ticks, selects all and clears",
         [SIGN_ADMIN, DESK, LOC, f"Your role can see reports, and {data}."],
         ["Click Reports in the top menu.", f"In the {grp} group click \"{name}\".", f"Open the {flt} filter.",
          "Untick one option.", "Tick the same option again.", "Click Select all.", "Click Clear selection.",
          "Close the filter."],
         ["Step 4: only that option is unticked and the report updates to leave it out.",
          "Step 5: it is ticked again and the report includes it again.",
          "Step 6: every option is ticked.",
          "Step 7: every option is unticked.",
          "Write down the exact words of the select-all and clear buttons (they may read e.g. \"All technicians\" and "
          "\"Clear all\"); a different label alone is not a fail."],
         src("Medium 7", "hotspot 5"), [M7], f"Dev Medium 7 filter option list on the {name} report.")

# ===================================================================================== MEDIUM 8 — impersonation, session
M8 = qd("8", "Start and exit impersonation while a page is loading. There should be no stale data, and no error toasts "
             "from cancelled requests.")
M8_ANY = qd("8", "Impersonation and session expiry, on any page.")
IMP = ("Your user can impersonate other users (the Admin control that lets you use the app as another staff member; "
       "it is reached from Settings > Staff).")
IMP_DATA = (techs(["Esther Howard"]) + [CUST, WO,
            "Create one Approved work order for the case customer with Lead Technician \"Esther Howard\" (e.g. "
            "\"S1-797\"). You yourself lead no work orders at this location."])
case("MEDIUM", "Starting impersonation while a page loads shows the new user's data",
     [SIGN_ADMIN, DESK, LOC, IMP] + IMP_DATA,
     ["Open Work Orders, click the All tab and turn on Assigned to me.",
      "Open Settings > Staff and find \"Esther Howard\".",
      "Click Reports > Work In Progress and, while it is still loading, start impersonating \"Esther Howard\".",
      "Wait for the page to finish loading.", "Open Work Orders with Assigned to me on."],
     ["Step 4: no red error message appears and the top bar shows you are using the app as Esther Howard.",
      "Step 5: Assigned to me lists \"S1-797\". Nothing from before the switch is left on screen."],
     src("Medium 8", "hotspot 5"), [M8_ANY, M8], "Dev Medium 8 start impersonation during a load.")
case("MEDIUM", "Exiting impersonation while a page loads shows your own data",
     [SIGN_ADMIN, DESK, LOC, IMP] + IMP_DATA,
     ["Start impersonating \"Esther Howard\" and open Work Orders with Assigned to me on. \"S1-797\" is listed.",
      "Click Reports > Work In Progress and, while it is still loading, exit impersonation.",
      "Wait for the page to finish loading.", "Open Work Orders with Assigned to me on."],
     ["Step 3: no red error message appears and the top bar shows your own user again.",
      "Step 4: \"S1-797\" is not listed (you lead no work orders). Nothing of Esther Howard's is left on screen."],
     src("Medium 8", "hotspot 5"), [M8_ANY, M8], "Dev Medium 8 exit impersonation during a load.")
case("MEDIUM", "An ended session shows the sign-in page without error messages",
     [SIGN_ADMIN, DESK, LOC],
     ["Open Work Orders in tab 1.", "Open a second tab of the same browser on the same site and sign out there.",
      "Go back to tab 1 and click Reports > Inventory Value.", "Read the screen."],
     ["Tab 1 takes you to the sign-in page (or asks you to sign in again).",
      "No pile of red error messages appears, and no work orders or report rows are left showing.",
      "After you sign in again, the page shows current data."],
     src("Medium 8", None), [M8_ANY, M8], "Dev Medium 8 session expiry.")

# ===================================================================================== MEDIUM 9 — avatars
M9 = qd("9", "Avatars everywhere (header, Staff, Schedule, cards). Avatars are now cached. After someone uploads a new "
             "photo, a reload must show the new one.")
QH9_AV = qh("§9", "After a new photo is uploaded, a reload shows the new image.")
PHOTO = ("Two clearly different photos on your computer (e.g. a red square and a blue square). Upload the red one as "
         "the person's photo first (on the staff member's record, or your own profile).")
for where, who, pre_x, steps_x in (
        ("the top bar", "your own", [], ["Look at your avatar in the top bar."]),
        ("the Staff list", "Esther Howard's", techs(["Esther Howard"]),
         ["Click Settings, then Staff, and look at Esther Howard's avatar."]),
        ("the Schedule", "Esther Howard's", techs(["Esther Howard"]),
         ["Click Schedule in the top menu and look at Esther Howard's avatar on her row."]),
        ("Board View", "Esther Howard's", techs(["Esther Howard"]) + [
            "Esther Howard leads at least one work order here. Use a desktop window at least 1024 px wide."],
         ["Open Work Orders, pick Board View in the display switcher (in the design its tooltip reads \"Board\") and look "
          "at the avatar in Esther Howard's column header."])):
    case("MEDIUM", f"A new photo shows in {where} after a reload",
         [SIGN_ADMIN, LOC, PHOTO] + pre_x,
         steps_x + [f"Upload the blue photo as {who} photo.", "Go back to the same place and reload the page.",
                    "Look at the avatar again."],
         ["Before the upload the avatar shows the red photo.",
          "After the reload it shows the blue photo, not the old red one."],
         src("Medium 9", "§9, hotspot 5"), [M9, QH9_AV], f"Dev Medium 9 avatar refresh in {where}.")

# ===================================================================================== LOW
LOW_T = qd("Low", "Any table page (Customers, Dashboard cards): the table component only gained an addition.")
LOW_IMP = qd("Low", "Imported work orders: they open in List, and the lead stays locked.")
case("LOW", "The Customers table lists, sorts and pages as before",
     [SIGN_ADMIN, DESK, LOC, "The organization has more customers than one page holds (most test sites do)."],
     ["Click Customers in the top menu.", "Read the first page of rows.", "Click the Name column header.",
      "Read the order.", "Go to the next page."],
     ["Step 2: the table shows rows with no error message.", "Step 4: rows are in name order.",
      "Step 5: the next page shows different customers, still in name order, with no repeats."],
     src("Low", "§Frontend Components"), [LOW_T], "Dev Low Customers table quick look.")
case("LOW", "Dashboard cards that show a table list their rows as before",
     [SIGN_ADMIN, DESK, LOC],
     ["Click Dashboard in the top menu.", "Find each card that shows a table (e.g. At Risk Customers).",
      "Read its rows and, where offered, click a column header to sort."],
     ["Each table card shows its rows with no error message, and a clicked header orders the rows. Write down the "
      "cards you checked."],
     src("Low", "§Frontend Components"), [LOW_T], "Dev Low Dashboard card tables quick look.")
case("LOW", "An imported work order's lead technician cannot be changed",
     [SIGN, DESK, LOC,
      "An Imported work order exists at this location. Imported work orders come from a data import; to find one, "
      "open Work Orders in List, click the All tab, open Status and tick Imported (e.g. \"S2-17578\"). If there is "
      "none, mark the case Blocked with 'no Imported work order on this site'."],
     ["Open Work Orders in List, click All, tick Imported in Status and open the work order.",
      "Write down Lead Technician.", "Try to change Lead Technician on the work order page.", "Reload the page."],
     ["Step 3: Lead Technician cannot be changed (it is shown disabled, or the change is refused with a message).",
      "Step 4: Lead Technician reads the same as at step 2."],
     src("Low", "What is NOT Impacted", ["S4-N2"]),
     [LOW_IMP, qp("S4-N2")], "Dev Low imported work orders keep the lead locked (open-in-List is C154648).")

# ------------------------------------------------------------------ keys, notes, coverage
TIER_ORDER = {"HIGH": 0, "MEDIUM": 1, "LOW": 2}
CASES.sort(key=lambda c: TIER_ORDER[c["section_id"]])
for i, c in enumerate(CASES, 1):
    c["key"] = f"NEW-R-{i:02d}"
NEW = [{k: c[k] for k in ("key", "section_id", "title", "preconds", "steps", "results", "source", "quotes", "marker",
                          "why")} for c in CASES]

NOTES = [
    "Navigation to confirm on the build (not found in our repo; written in plain words): the Edit Work Order window and "
    "how it opens, and its Mileage / Engine Hours / PO field names; the Lines tab's assign-technician action; the "
    "Technicians field on New Line; the Labor row More actions > Move labor (design label from the Add Part design); the "
    "Work Orders tab label on an asset page and whether its count sits on the tab or under the table; the impersonation "
    "control (start and exit) under Settings > Staff; where a profile photo is uploaded (staff record or own profile); "
    "the part sale status card's person field (developer says technician, PRD of Part Sales says Sales Representative); "
    "how the Part Sales list shows part request and part return counts; the Deliveries page's filter buttons; whether "
    "Vendors has a filter bar on this build (the Filters suite recorded none earlier); the report select-all and clear "
    "labels (Technician Utilization read \"All technicians\" / \"Clear all\" on an earlier build); the List rows-per-page "
    "control; Dashboard cards that contain a table.",
    "Label choice: \"Create Work Order\" is used (the handoff and the Filters playbook record it as the build label; some "
    "feature cases say \"New Work Order\").",
    "Source difference: the QA handoff §8 says a line goes back to \"No technicians assigned to this line.\"; the PRD "
    "S7-R10 (edited 7 Oct 2026) says it reads \"Unassigned\". The case follows the PRD. PO question if the build shows "
    "the handoff wording.",
    "Source difference: the QA handoff lists \"The Schedule page itself\" under What is NOT Impacted, while the "
    "developer's reply ranks the Schedule as High 3. The developer's list is the scope, so the two drag-to-create cases "
    "are kept.",
    "Not manual (developer/automated only): every API check in handoff §9 (status codes, response fields, ETag/304, "
    "cache headers), the schema checks in §10, cancelled requests in the network log, the one-request-per-work-order "
    "and offline/history-mode checks in §8, and the server refusal of foreign staff ids. The human-visible part of each "
    "is in a case where one exists.",
    "Safe to skip (developer): invoicing, payments, accounting and QuickBooks. No case written. Invoicing is used only "
    "as a setup step to reach Invoiced or Paid.",
]

ANCHORS = {}
for c in CASES:
    for lab, _ in c["quotes"]:
        ANCHORS.setdefault(lab, []).append(c["key"])

READING = ("Dev-regression-areas-reply-2026-10-08.md — 3,863 bytes — lines 1-50 — 100%; "
           "QA-Handoff-SV-10043-dev-test-plan-2026-10-08.md — 47,452 bytes — lines 1-463 — 100%; "
           "CONFLUENCE-845185030-WO-BoardView-TechView-PRD-v33-edited-2026-10-07.md — 59,254 bytes — lines 1-640 — "
           "100%; WORKER-BRIEF.md — 15,374 bytes — 100%; snapshots-final C*.json — 188 cases, titles 100% by script, "
           "bodies of the 25 overlapping cases read; label sources targeted by grep (playbook, OBSERVED-UI-LABELS-*, "
           "skill 18 read in full, earlier suites' snapshots).")

OUT_DOC = {"updates": [], "new": NEW, "retire": [], "notes": NOTES, "anchors_covered": ANCHORS,
           "reading_coverage": READING}


# ------------------------------------------------------------------ validator
def validate(doc):
    errs = []
    bad = [(r"\bS\d{1,2}-[RNE]\d", "anchor code"), (r"\bRule \d", "rule number"), (r"ask the QA lead", "ask QA lead"),
           (r"/api/", "API path"), (r"DevTools", "DevTools"), (r"Network tab", "Network tab"), (r"\bcurl\b", "curl"),
           (r"\b(400|401|403|404|409|422|304)\b", "HTTP code"), (r"ETag", "ETag"), (r"`", "backtick"),
           (r"<[a-z/][^>]*>", "HTML")]
    keys = set()
    for c in doc["new"]:
        k = c["key"]
        if k in keys:
            errs.append(k + " duplicate key")
        keys.add(k)
        t = c["title"]
        if len(t) > 80:
            errs.append(f"{k} title {len(t)} chars")
        if ";" in t:
            errs.append(k + " semicolon in title")
        if c["marker"] != MARKER:
            errs.append(k + " marker")
        tester = [t] + c["preconds"] + c["steps"] + c["results"]
        blob = "\n".join(tester)
        if MARKER in blob or blob.count("AUTOMATION:"):
            errs.append(k + " marker inside tester text")
        for pat, why in bad:
            if re.search(pat, blob):
                errs.append(f"{k} {why}: " + re.search(pat, blob).group(0))
        if not c["quotes"]:
            errs.append(k + " no quotes")
        for lab, txt in c["quotes"]:
            n = norm(txt)
            if lab.startswith("Dev reply"):
                ok = n in DEV_N
            elif lab.startswith("QA handoff"):
                ok = n in QAH_N
            elif lab.startswith("PRD"):
                ok = n in PRD_N
            else:
                ok = False
            if not ok:
                errs.append(f"{k} quote not verbatim: {lab}")
        if c["section_id"] not in TIER_ORDER:
            errs.append(k + " section")
        for lst in ("preconds", "steps", "results"):
            if not c[lst]:
                errs.append(f"{k} empty {lst}")
    return errs


if __name__ == "__main__":
    errors = validate(OUT_DOC)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(OUT_DOC, f, ensure_ascii=False, indent=1)
    json.load(open(OUT, encoding="utf-8"))
    tiers = {t: sum(1 for c in NEW if c["section_id"] == t) for t in TIER_ORDER}
    print("written", OUT, "| new cases:", len(NEW), tiers)
    if errors:
        print("VALIDATION FAILED:")
        print("\n".join(errors))
        sys.exit(1)
    print("VALIDATION OK: JSON valid, quotes verbatim, titles <=80 with no semicolons, one marker each, "
          "no codes/jargon in tester text")
