"""Design — how it looks (Rules 124, 126; the WO Board design cases are the model). One case per screen-and-state group. Each case:
the design pictures of its boards ATTACHED and named in the preconditions; every visible attribute as a plain observation; the
PRD sentence quoted where it speaks; the design's own board title and note quoted (Exact quotes); the boards named in Source.
Where design and PRD disagree the case follows the PRD (latest); since 20 Oct 2026 each such note quotes Chris Ward's ruling (answers of 19 Oct 2026)."""
import os, json, glob, re
from ssr_lib import C, P, AQ, prd_line
from common import *

CANVAS = "https://claude.ai/artifact/8MHqwyffAYtqZ6EccS5RUm"
PNG = f"{P}/design-drive-2026-10-19/unpacked/png"
PAGE = {"1": "card", "2": "customer", "3": "partsale", "4": "sbr", "5": "sbc", "6": "phone"}
_DI = json.load(open(f"{P}/design-drive-2026-10-19/design-text-inventory-2026-10-19.json"))
TITLE = {x["text"].split(" ")[0]: x["text"] for x in _DI if x["src"] == "A-title"}
NOTE = {}
for x in _DI:
    m = re.match(r"canvas note (\w+)-note-(\d+)", x["where"])
    if x["src"] == "A-note" and m:
        pg = {v: k for k, v in PAGE.items()}[m.group(1)]
        NOTE[f"{pg}.{int(m.group(2))}"] = re.sub(r"\s+", " ", x["text"].replace(" / ", " ")).strip()
def pic(b):
    pg, n = b.split(".")
    f = sorted(glob.glob(f"{PNG}/{PAGE[pg]}-{int(n):02d}-*.png"))
    assert f, b; return os.path.basename(f[0])
def PICS(boards): return [pic(b) for b in boards]
def PIC_PRE(boards, width="1440 px wide with the zoom at 100%"):
    names = [f'"{pic(b)}" (board {b})' for b in boards]
    lst = names[0] if len(names) == 1 else ", ".join(names[:-1]) + " and " + names[-1]
    return (f"The browser window is {width}, and the design picture{'s' if len(names) > 1 else ''} {lst} attached to this case "
            f"{'are' if len(names) > 1 else 'is'} open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.", None)
def DQ(boards):
    out = []
    for b in boards:
        out.append((f"Design — board {b} title", TITLE[b]))
        if b in NOTE: out.append((f"Design — board {b} note", NOTE[b]))
    return out
def DSRC(boards):
    return (f'Claude design canvas "Splitting Sales Representatives" ({CANVAS}), export read 19 Oct 2026, boards '
            + "; ".join(f'{TITLE[b]}' for b in boards) + " (the attached pictures are these boards).")
def D(key, title, pre, steps, res, q, boards, note="", stories=None, width=None):
    C(key, "DESIGN", title, pre[:1] + [PIC_PRE(boards, width) if width else PIC_PRE(boards)] + pre[1:], steps, res, q + DQ(boards),
      design_src=DSRC(boards), note=note, pictures=PICS(boards), stories=stories)

W = START("{Work-order-1} is open in that browser window")

D("D-01", "Work order card at rest matches the design",
  [ADMIN, REPS2, CUST,
   ('Work order {Work-order-1} for {Customer-A} is open and not invoiced with nobody in Sales Representative; work order {Work-order-2} has Sales Representative {Sales-rep-A}.', "For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002."),
   W],
  ["Without hovering, compare the Lead Technician, Service Advisor and Sales Representative rows with the picture of board 1.2.",
   "Open {Work-order-2} and compare the card with the picture of board 1.5."],
  ["Step 1: \"Sales Representative\" sits directly under Service Advisor, label on the first line and \"Unassigned\" on the second, in the same text style, size, weight and left edge as Lead Technician and Service Advisor; no box, no arrow and no button at rest, as in the picture. Measured on the screen, no blank strip remains under Lead Technician, and every gap is 16 px, including the gap under Lead Technician.",
   "Step 2: the name {Sales-rep-A} on the second line as plain text, no box, as in the picture."],
  ["S1-R1", "S1-R2", "S1-R3", "S1-R6", "S1-R6a", ("S1-R6a context note", prd_line("* Context note (S1-R6a)")), "S1-R7", AQ(40)], ["1.2", "1.5"])

D("D-02", "Hovering the Sales Representative row shows the box, arrow and +",
  [ADMIN, REPS2, CUST, WO('its one "Sales Representative" field reads {Sales-rep-A}'), W],
  ["Hover over the Sales Representative row and compare with the picture of board 1.6.",
   "Hover over the + itself.",
   "Move the pointer away from the Sales Representative rows.",
   "Move into the field with the keyboard (Tab)."],
  ["Step 1: one box around the label and the name together, the same box and height Lead Technician and Service Advisor show on hover, same left edge; the dropdown arrow at the right end, vertically centred on the label and the name; the grey + to the right, as in the picture. Measured on the screen, the box ends 16 px before a 32 px column holding the +; the + is a 32 px square with 8 px corners and a 20 px plus icon, grey on no fill.",
   "Step 2: the + shows a light fill.",
   "Step 3: the pointer is no longer over the Sales Representative rows.",
   "Step 4: while the field has keyboard focus the box, the arrow and the + stay shown."],
  ["S1-R4", "S1-R5", "S1-R11", "S2-R1", "S2-R2", AQ(1), AQ(2)], ["1.3", "1.6"],
  note="The design pictures measure about 22 px between the box and the + on the work order card (16 px in the customer window). Chris Ward ruled on 19 Oct 2026 for the PRD's 16 px (answer 2, quoted above); this case follows it.")

D("D-03", "The Sales Representative list looks as designed",
  [ADMIN, REPS2, CUST, WO('its one "Sales Representative" field reads "Unassigned"'), W],
  ["Click the field and compare the open list with the picture of board 1.4.",
   "Click {Sales-rep-A} in the list.",
   "Open the list again and compare with the picture of board 1.15."],
  ["Step 1: the list opens under the field; \"Unassigned\" is first and checked, then the representatives; no search box; as in the picture.",
   "Step 2: the field reads {Sales-rep-A}.",
   "Step 3: {Sales-rep-A} is the checked option and \"Unassigned\" is still first, as in the picture."],
  ["S1-R8", "S1-R9", "S1-R12"], ["1.4", "1.15"])

D("D-04", "The + tooltip and menu look as designed",
  [ADMIN, REPS2, CUST, WO('its one "Sales Representative" field reads {Sales-rep-A}'), W],
  ["Hover over the + and compare with the picture of board 1.7.",
   "Click the + and compare with the picture of board 1.8."],
  ["Step 1: the tooltip \"Add representative\" shows where the picture shows it, without covering the field.",
   "Step 2: the menu opens below the + with one option, \"Sales Representative - Parts\"; the + keeps its light fill and the tooltip is gone, as in the picture."],
  ["S2-R2", "S2-R3", "S2-R4"], ["1.7", "1.8"])

# 22 Oct 2026, Rule 136 split: the labels at 200% zoom (S2-R14, S1-R11) are their own check (D-05b); the rest stays one case because the
# 1536 px look is compared with the 1440 px look of steps 1 and 2. The step that set the zoom back to 100% is no longer needed.
D("D-05", "Labor and Parts fields at rest and on hover look as designed",
  [ADMIN, REPS2, CUST, WO('its card shows "Sales Representative - Labor" and "Sales Representative - Parts", both reading {Sales-rep-A}'), W],
  ["Without hovering, compare the two fields with the picture of board 1.9.",
   "Hover over the rows and compare with the picture of board 1.10.",
   "Click \"Sales Representative - Labor\" and compare the open list with the picture of board 1.11.",
   "Close the list.",
   "Make the window 1536 px wide.",
   "Hover over the rows and compare with the picture of board 1.10 again."],
  ["Step 1: \"Sales Representative - Labor\" above \"Sales Representative - Parts\", both labels in full, plain at rest, with 16 px between all fields, as in the picture.",
   "Step 2: both boxes show at once; each arrow sits in the bottom-right corner of its field, on the name line; the remove x (32 px, 20 px x icon, grey) beside Parts only; nothing beside Labor; no +.",
   "Step 3: the list opens under Labor, \"Unassigned\" first, as in the picture; the person on the Parts row is not hidden.",
   "Step 4: the list closes.",
   "Step 5: the window is 1536 px wide; with the pointer away from the rows, the two fields have the same look as in step 1 (compare with the picture of board 1.9 again), nothing overlapping.",
   "Step 6: the same look as in step 2, nothing overlapping."],
  ["S1-R6", "S1-R11", "S2-R5", "S2-R8", "S2-R10", "S2-R14"], ["1.9", "1.10", "1.11"])

D("D-05b", "Design: at 200% zoom the Labor and Parts labels show in full",
  [ADMIN, REPS2, CUST, WO('its card shows "Sales Representative - Labor" and "Sales Representative - Parts", both reading {Sales-rep-A}'), W],
  ["Set the browser zoom to 200%.",
   "Hover over the Sales Representative rows."],
  ["Step 1: both labels show in full, never cut off, as in the picture of board 1.9.",
   "Step 2: both labels still show in full, and no arrow covers a label: each arrow sits in the bottom-right corner of its field, on the name line, as in the picture of board 1.10."],
  ["S2-R14", "S1-R11"], ["1.9", "1.10"])

D("D-06", "Two reps, the remove x and removing Parts look as designed",
  [ADMIN, REPS2, CUST, WO('Labor reads {Sales-rep-B} and Parts reads {Sales-rep-A}'), W],
  ["Without hovering, compare the card with the picture of board 1.12.",
   "Hover over the remove x and compare with the picture of board 1.13.",
   "Click the remove x and compare with the picture of board 1.14."],
  ["Step 1: Labor {Sales-rep-B} and Parts {Sales-rep-A} as plain text, as in the picture.",
   "Step 2: the remove x shows a light fill and the tooltip \"Remove Sales Representative - Parts\", as in the picture.",
   "Step 3: one \"Sales Representative\" field reading {Sales-rep-B} (the Labor person), with the + back, as in the picture."],
  ["S2-R8", "S2-R9", "S2-R16"], ["1.12", "1.13", "1.14"])

D("D-07", "Clearing the field with Unassigned looks as designed",
  [ADMIN, REPS2, CUST, WO('its one "Sales Representative" field reads {Sales-rep-A}'), W],
  ["Open the list.",
   "Click \"Unassigned\" and compare the card with the picture of board 1.16."],
  ["Step 1: the list opens.",
   "Step 2: the field reads \"Unassigned\" as plain text, as in the picture; there was never an x inside the field."],
  ["S1-R7", "S1-R10"], ["1.15", "1.16"])

D("D-08", "The invoiced work order card shows the reps as plain text",
  [ADMIN, REPS2, CUST, WO('Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}; it has been invoiced'), W],
  ["Hover over the representative rows and compare with the picture of board 1.17."],
  ["Step 1: \"Sales Representative - Labor\" {Sales-rep-A} and \"Sales Representative - Parts\" {Sales-rep-B} as plain text, with no box, arrow, + or remove x even on hover, as in the picture; Lead Technician and Service Advisor keep the labels an invoiced card shows today. Measured on the screen, every gap between Lead Technician, Service Advisor and both representative fields is 16 px."],
  ["S2-R17", AQ(8), "S1-R6"], ["1.17"])

D("D-09", "Work order log entries read as designed",
  [ADMIN, REPS2, CUST, WO('its one "Sales Representative" field reads {Sales-rep-A}'), W],
  ["Add the \"Sales Representative - Parts\" field.",
   "Set \"Sales Representative - Parts\" to {Sales-rep-B}.",
   "Click the remove x beside \"Sales Representative - Parts\".",
   "Open the work order's menu.",
   "Click Audit Log and compare the newest entries with the picture of board 1.19."],
  ["Step 1: the card shows \"Sales Representative - Labor\" and \"Sales Representative - Parts\".",
   "Step 2: Parts reads {Sales-rep-B}.",
   "Step 3: the card ends with one \"Sales Representative\" field reading {Sales-rep-A}.",
   "Step 4: the work order's menu opens.",
   "Step 5: each change is a \"Sales representative changed\" entry with who, when and before → after, worded as in the picture, Parts first (for example \"{Sales-rep-B} (Parts) · {Sales-rep-A} (Labor) → {Sales-rep-A}\")."],
  ["S7-R1", "S7-R2", "S7-R3"], ["1.19"], stories=[7],
  note="The PRD's Story 7 says \"Design: none\", yet board 1.19 shows the log; the wording on the board matches the PRD.")

# 22 Oct 2026, Rule 136 split: the field and its list (boards 2.3 to 2.5) and the + with its tooltip and menu (boards 2.6, 2.7) are separate
# controls; D-10b starts in the Edit Customer window of its own customer.
D("D-10", "Design: Edit Customer's Sales Representative field and list look as designed",
  [ADMIN, REPS3, ("Customer {Customer-A} has no sales representative.", "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   START("{Customer-A}'s page is open in that browser window")],
  ["Open Edit Customer and compare the field with the picture of board 2.3.",
   "Open the field's list and compare with the picture of board 2.4.",
   "Pick {Sales-rep-A} and compare with the picture of board 2.5."],
  ["Step 1: one \"Sales Representative\" field with the same outlined box as every other field in the window, reading \"Unassigned\", in the place Edit Customer shows it today, with the + beside it shown without hovering; the arrow vertically centred; no x inside the field.",
   "Step 2: \"Unassigned\" first, then the representatives, sorted by first name, then last name, A to Z; no search box.",
   "Step 3: the field reads {Sales-rep-A}."],
  ["S4-R1", "S4-R3", "S4-R4", AQ(15)], ["2.3", "2.4", "2.5"],
  note="The design's list shows names out of A to Z order (board 2.4; the canvas says its test copy lists login names). Chris Ward ruled on 19 Oct 2026 for the PRD's A to Z by first name, then last name (answer 15, quoted above); this case follows it.")

D("D-10b", "Design: Edit Customer's + tooltip and menu look as designed",
  [ADMIN, REPS3, ("Customer {Customer-A} has no sales representative.", "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   START("{Customer-A}'s Edit Customer window is open in that browser window")],
  ["Hover over the + and compare with the picture of board 2.6.",
   "Click the + and compare with the picture of board 2.7."],
  ["Step 1: the tooltip \"Add representative\", as in the picture.",
   "Step 2: the menu lists \"Sales Representative - Service Parts\" then \"Sales Representative - Part Sales\", as in the picture."],
  ["S4-R5", "S4-R6"], ["2.6", "2.7"])

# 22 Oct 2026, Rule 136 split: adding the Service Parts and Part Sales fields (boards 2.8 to 2.11) and removing Service Parts from a
# customer that has all three (boards 2.12 to 2.14) are separate behaviours; D-11b's customer already has the three fields filled, so the
# two "Set …" steps that only prepared board 2.12 are its preconditions now.
D("D-11", "Design: adding Service Parts and Part Sales in Edit Customer looks as designed",
  [ADMIN, REPS3, ("Customer {Customer-A} has {Sales-rep-A} as its one sales representative.", "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   START("{Customer-A}'s Edit Customer window is open in that browser window")],
  ["Add \"Sales Representative - Service Parts\" and compare with the picture of board 2.8.",
   "Click the + and compare the menu with the picture of board 2.9.",
   "Add \"Sales Representative - Part Sales\" and compare with the picture of board 2.10.",
   "Open the Part Sales list and compare with the picture of board 2.11."],
  ["Step 1: the first field reads \"Sales Representative - Service Labor\" and \"Sales Representative - Service Parts\" shows under it, both {Sales-rep-A}, with a remove x beside Service Parts.",
   "Step 2: the menu lists only \"Sales Representative - Part Sales\".",
   "Step 3: three fields in order: Service Labor, Service Parts, Part Sales; each added field has a remove x; the + is gone; labels in full.",
   "Step 4: the same list as every other field: \"Unassigned\" first, then the representatives, with no \"Same as Service Parts\" option."],
  ["S4-R7", "S4-R8", "S4-R9", "S4-R10"], ["2.8", "2.9", "2.10", "2.11"])

D("D-11b", "Design: removing Service Parts in Edit Customer looks as designed",
  [ADMIN, REPS3,
   ('Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A}, "Sales Representative - Service Parts" {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}.', "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   START("{Customer-A}'s Edit Customer window is open in that browser window")],
  ["Without hovering, compare the three fields with the picture of board 2.12.",
   "Hover over the remove x beside Service Parts and compare with the picture of board 2.13.",
   "Click it and compare with the picture of board 2.14."],
  ["Step 1: Service Labor {Sales-rep-A}, Service Parts {Sales-rep-B}, Part Sales {Sales-rep-C}, in that order, as in the picture.",
   "Step 2: the tooltip \"Remove Sales Representative - Service Parts\".",
   "Step 3: \"Sales Representative\" {Sales-rep-A} and \"Sales Representative - Part Sales\" {Sales-rep-C}; the + is back, as in the picture."],
  ["S4-R9", "S4-R10", "S4-R11", "S4-R14"], ["2.12", "2.13", "2.14"])

D("D-12", "The customer page reads every representative row as designed",
  [ADMIN, REPS3,
   ('Customer {Customer-A} shows Service Labor {Sales-rep-A}, Service Parts {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}.', "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   START("{Customer-A}'s page is open in that browser window")],
  ["Compare the representative rows with the picture of board 2.15."],
  ["Step 1: \"Sales Representative - Service Labor\", \"Sales Representative - Service Parts\" and \"Sales Representative - Part Sales\" with their names as plain text, in the window's order, styled like the page's other rows, as in the picture."],
  ["S4-R19"], ["2.15"])

D("D-13", "New Customer's representative field looks as designed",
  [ADMIN, REPS3, START("the Customers page is open in that browser window")],
  ["Open New Customer and compare with the picture of board 2.16.",
   "Type a customer name.",
   "Click the + and compare with the picture of board 2.17.",
   "Add \"Sales Representative - Part Sales\".",
   "Pick {Sales-rep-C} in it and compare with the picture of board 2.18."],
  ["Step 1: the same optional \"Sales Representative\" field and + as Edit Customer, in the same spot.",
   "Step 2: the name shows in the window.",
   "Step 3: the same two options as Edit Customer.",
   "Step 4: the \"Sales Representative - Part Sales\" field shows.",
   "Step 5: \"Sales Representative\" and \"Sales Representative - Part Sales\" {Sales-rep-C} with its remove x, as in the picture."],
  ["S4-R1", "S4-R6", "S4-R8", "S4-R10"], ["2.16", "2.17", "2.18"])

D("D-14", "A part sale's representative field is unchanged from Part Sales Update v1",
  [ADMIN, REPS2, CUST, ("Part sale {Part-sale-1} for {Customer-A} is open and not invoiced.", "For example: {Part-sale-1} is P-30001."),
   START("{Part-sale-1} is open in that browser window")],
  ["Compare the Sales Representative field with the picture of board 3.1.",
   "Hover over it and compare with the picture of board 3.2.",
   "Open its list and compare with the picture of board 3.3.",
   "Pick {Sales-rep-A}.",
   "Hover over the field and compare with the picture of board 3.4."],
  ["Step 1: one field labelled \"Sales representative\" (small \"r\"), plain text at rest, the full width of the card; no + and no remove x.",
   "Step 2: Part Sales Update v1's own hover box and arrow, the full width of the card.",
   "Step 3: the list as in the picture.",
   "Step 4: the field reads {Sales-rep-A}.",
   "Step 5: {Sales-rep-A} in the same field, its label still \"Sales representative\", still no + and no remove x."],
  ["S2-N2", AQ(7)], ["3.1", "3.2", "3.3", "3.4"], stories=[2],
  note="The pictures of boards 3.1 to 3.4 read \"Sales Representative\" with a capital R, and the tech plan changes the label to \"Sales Representative\". Chris Ward ruled on 19 Oct 2026 that nothing changes (answer 7, quoted above), as PRD version 10 says: the label stays \"Sales representative\". This case follows them, not the design's capital R.")

# 22 Oct 2026, Rule 136 split into three: the report's rows and dashes (boards 4.4, 4.5), the Sales Type filter (4.6, 4.7) and the Sales
# Type column (4.8 to 4.10) are separate parts of the screen with their own requirements; all three read the same records and change none.
D15_DAY = ("Today has one invoiced split work order (Labor {Sales-rep-A}, Parts {Sales-rep-B}), one invoiced work order with {Sales-rep-A} on both sides and one invoiced part sale with no shop supplies.", None)
D("D-15", "Design: Sales By Representative rows and dashes look as designed",
  [ADMIN, REPS2, CUST, D15_DAY, START("Reports > Sales By Representative is open for today in that browser window, with the Sales Type column off")],
  ["Compare the default report with the picture of board 4.4.",
   "Expand {Sales-rep-A}.",
   "Expand {Sales-rep-B} and compare with the picture of board 4.5."],
  ["Step 1: one row per representative; the filter reads \"Sales Type: All\"; no Sales Type column by default.",
   "Step 2: {Sales-rep-A}'s invoice rows show.",
   "Step 3: the split invoice shows under both representatives; a side a representative did not sell shows a dash (including Shop Supplies on the Parts row); the part sale with no shop supplies shows a dash under Shop Supplies and under Labor Delta, Labor Invoiced and Labor Margin."],
  ["S5-R15", "S5-R15a", "S5-R15b", "S5-R21", "S8-R3", AQ(24), AQ(25), AQ(39)], ["4.4", "4.5"],
  note="The picture of board 4.5 shows $0.00 under Shop Supplies on the Parts row and on the part sales, while the board 4.5 note (quoted below) says a side a rep did not sell shows a dash. Chris Ward ruled on 19 Oct 2026 for the PRD's dash, and said the design's $0.00 on the part sales is a sample-data mistake (answers 24 and 25, quoted above); this case follows them.")

D("D-15b", "Design: the Sales Type filter on Sales By Representative looks as designed",
  [ADMIN, REPS2, CUST, D15_DAY, START("Reports > Sales By Representative is open for today in that browser window, with the Sales Type column turned on (as in the picture of board 4.7)")],
  ["Open the Sales Type filter and compare with the picture of board 4.6.",
   "Select only Labor and compare with the picture of board 4.7.",
   "Select all three again."],
  ["Step 1: the filter lists \"Labor\", \"Parts\", \"Part Sales\", all ticked.",
   "Step 2: only the labor side of each work order shows, as in the picture.",
   "Step 3: all three are ticked again and the filter reads \"Sales Type: All\"."],
  ["S8-R1", "S8-R3", "S5-R12"], ["4.6", "4.7"])

D("D-15c", "Design: the Sales Type column on Sales By Representative looks as designed",
  [ADMIN, REPS2, CUST, D15_DAY, START("Reports > Sales By Representative is open for today in that browser window, with the Sales Type column off")],
  ["Open the column selector and compare with the picture of board 4.8.",
   "Turn Sales Type on and compare with the picture of board 4.9.",
   "Expand {Sales-rep-A}.",
   "Expand {Sales-rep-B} and compare with the picture of board 4.10."],
  ["Step 1: \"Sales Type\" is the first entry, off by default.",
   "Step 2: switching it on adds the column right after Status (and before Location when the Location column shows).",
   "Step 3: {Sales-rep-A}'s invoice rows show.",
   "Step 4: the Sales Type column reads \"Labor\", \"Parts\", \"Part Sales\" and \"Labor, Parts\"; columns line up as in the picture and nothing overlaps."],
  ["S5-R10", "S5-R19", "S5-R20", "S5-R21", AQ(24), AQ(25), AQ(26), AQ(36)], ["4.8", "4.9", "4.10"],
  note="The picture of board 4.10 shows $0.00 under Shop Supplies on the Parts row and on the part sales; Chris Ward ruled on 19 Oct 2026 for the PRD's dash, and said the design's $0.00 on the part sales is a sample-data mistake (answers 24 and 25, quoted above), so the $0.00 in the picture is not what to expect. The \"Column Selection\" tooltip covering the Sales Type switch (board 4.8) is acceptable as today (answer 36, quoted above).")

D("D-16", "Sales By Representative Expanded CSV and PDF look as designed",
  [ADMIN, REPS2, CUST, ("Today has one invoiced split work order (Labor {Sales-rep-A}, Parts {Sales-rep-B}) and one invoiced part sale.", None),
   START("Reports > Sales By Representative is open in that browser window, with the Sales Type column off")],
  ["Export the Expanded CSV and compare it with the picture of board 4.11.",
   "Export the Expanded PDF and compare it with the picture of board 4.12."],
  ["Step 1: the file has the Sales Type column right after Status (and before any Location column) even though it is off on screen; the cells of the side a row is not credited with are blank, and so are the part sale's labor and hours cells.",
   "Step 2: the PDF has the Sales Type column in the same place; those cells, and the part sale's labor and hours cells, show a dash; the header lines name the filters, including \"Sales Type: All\"."],
  ["S5-R15b", "S5-R23", "S8-R4", AQ(24), AQ(26), AQ(39)], ["4.11", "4.12"],
  note="The export pictures show 0.00 / $0.00 under Shop Supplies on the Parts row. Chris Ward ruled on 19 Oct 2026 for the PRD: blank in the CSV and a dash in the PDF (answer 24, quoted above); this case follows it.")

D("D-17", "Sales By Customer Sales Type filter looks as designed",
  [ADMIN, START("Reports > Sales By Customer is open in that browser window")],
  ["Compare the closed filter with the picture of board 5.1.",
   "Open it and compare with the picture of board 5.2."],
  ["Step 1: it reads \"Sales Type: All Sales\" where \"Product Type\" used to be, as in the picture.",
   "Step 2: options \"Part Sales\" and \"Service Sales\", both ticked, as in the picture."],
  ["S8-R6", "S8-R7", "S8-R8", AQ(28)], ["5.1", "5.2"])

# 22 Oct 2026, Rule 136 split: the field and its list (boards 6.2 to 6.4) and the + with the Labor and Parts fields (6.5 to 6.7) are separate
# controls; D-18b starts from its own work order with the card expanded.
D("D-18", "Design: on a phone the Sales Representative field looks as designed",
  [ADMIN, REPS2, CUST, WO('its one "Sales Representative" field reads "Unassigned"'),
   "Starting screen: {Work-order-1} is open on a phone (a touch screen with no mouse pointer), card expanded."],
  ["Compare the field with the picture of board 6.2.",
   "Tap the field and compare with the picture of board 6.3.",
   "Pick {Sales-rep-A} and compare with the picture of board 6.4."],
  ["Step 1: \"Sales Representative\" reading \"Unassigned\", with the + (32 px) always showing beside it and the dropdown arrow shown.",
   "Step 2: the native dropdown, the same as Lead Technician: \"Unassigned\" first, then the representatives.",
   "Step 3: {Sales-rep-A}; the + shows without any hover."],
  ["S3-R1", "S3-R2", "S3-R4", AQ(11)], ["6.2", "6.3", "6.4"], width="a phone screen 390 px wide",
  note="The picture of board 6.2 shows no dropdown arrow at rest. Chris Ward ruled on 19 Oct 2026 that the arrow always shows on a touch screen, as the PRD says (answer 11, quoted above); this case follows it.")

D("D-18b", "Design: on a phone the + and the Labor and Parts fields look as designed",
  [ADMIN, REPS2, CUST, WO('its one "Sales Representative" field reads {Sales-rep-A}'),
   "Starting screen: {Work-order-1} is open on a phone (a touch screen with no mouse pointer), card expanded."],
  ["Tap the + and compare with the picture of board 6.5.",
   "Add Parts and compare with the picture of board 6.6.",
   "Tap \"Sales Representative - Parts\" and compare with the picture of board 6.7."],
  ["Step 1: the menu \"Sales Representative - Parts\".",
   "Step 2: \"Sales Representative - Labor\" and \"Sales Representative - Parts\", both {Sales-rep-A}, labels in full; the remove x (32 px) always showing beside Parts; each field shows its arrow.",
   "Step 3: the same list per row."],
  ["S3-R1", "S3-R2", "S3-R4", AQ(11)], ["6.5", "6.6", "6.7"], width="a phone screen 390 px wide",
  note="The picture of board 6.6 shows no dropdown arrow at rest (the board 6.6 note, quoted below, says the rows read as plain text). Chris Ward ruled on 19 Oct 2026 that the arrow always shows on a touch screen, as the PRD says (answer 11, quoted above); this case follows it.")

# "Before" boards (production today) → the release-day / must-not-change cases that compare against today's screens
import ssr_lib
BEFORE = {"REL-01": ["2.0", "2.1", "2.2"], "REL-02": ["1.0", "1.1"], "REL-03": ["4.0", "4.1", "4.2", "4.3"], "REL-06": ["5.0"],
          "REL-12": ["6.0", "6.1"], "D-09": ["1.18"], "D-14": ["3.0"]}
for c in ssr_lib.CASES:
    if c["key"] in BEFORE:
        b = BEFORE[c["key"]]
        if c["key"].startswith("REL"):
            c["pre"].insert(len(c["pre"]) - 1, PIC_PRE(b, "a desktop browser at least 1024 px wide" if c["key"] != "REL-12" else "a phone screen"))
            c["pre"] = ssr_lib.setup_order(c["pre"][:-1]) + c["pre"][-1:]  # 26 Oct 2026: browser-window line above the starting screen
            c["design_src"] = DSRC(b).replace("(the attached pictures are these boards)", "(\"Before\" boards: production today, attached for comparison)")
        else:
            i = next(n for n, x in enumerate(c["pre"]) if x[0].startswith("The browser window is "))  # 26 Oct 2026: no longer always line 2
            c["pre"][i] = PIC_PRE(sorted(set(b) | set(re.findall(r'\(board (\d+\.\d+)\)', c["pre"][i][0])), key=lambda x: [int(y) for y in x.split(".")]))
            c["design_src"] = DSRC(sorted(set(b) | set(re.findall(r'board (\d+\.\d+)', " ".join(c["steps"]))), key=lambda x: [int(y) for y in x.split(".")]))
        c["q"] = c["q"] + DQ(b); c["pictures"] = sorted(set(c["pictures"]) | set(PICS(b)))


# ---------------- S1-01 (C665915), rebuilt from scratch, 26 Oct 2026 ----------------
# QA lead: "Read the PRD and create the test case from scratch and ot to copy what is already there" / "PRD+Design+SOurces/Tech plan".
# Scope (one behaviour): a new work order whose customer has no representative shows the Sales Representative field directly under
# Service Advisor, reading "Unassigned", as plain text at rest (S1-R1, S1-R2, S1-R3, S1-R7). The look against the design, with the
# 16px gaps, is D-01. Why the customer must have no representative: S4-R24. Why a mouse: S3-R4 (touch screens always show the arrow).
# Lead Technician may read blank: design note on board 1.2. Already built (SV-8599): tech plan "Already built".
C("S1-01", "S1", "New work order shows Sales Representative under Service Advisor as Unassigned",
  [("You are signed in as a user with the Admin role at {Location-A}.", "For example: {Location-A} is Staging Heavy Duty - 9919."),
   ("Customer {Customer-A} has no sales representative.", "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   ("Work order {Work-order-1} was created for {Customer-A} at {Location-A}, is not invoiced or paid, and nobody has picked a sales representative on it.",
    "For example: {Work-order-1} is S2-40001."),
   ("Starting screen: the Work Orders page, on a desktop or laptop computer with a mouse.", None)],
  ["Open work order {Work-order-1} from the Work Orders list.",
   "Move the mouse pointer to an empty part of the page, away from the work order card."],
  ["Step 1: the work order opens. On the card, a field labelled \"Sales Representative\" sits directly under Service Advisor. (Lead Technician may read blank; that is today's behaviour and not part of this test.)",
   "Step 2: the field reads \"Sales Representative\" on the first line and \"Unassigned\" on the second, in the same text style, size and boldness as Service Advisor and starting at the same left edge. There is no box around it, no dropdown arrow and no button beside it, as in the attached picture of board 1.2."],
  [("Story 1 prerequisite", prd_line("User has 'Work Orders — Create & Edit' enabled.")),
   ("Story 1 prerequisite", prd_line("The work order is not invoiced or paid, and is not opened from its history.")),
   "S1-R1", "S1-R2", "S1-R3", "S1-R7", "S4-R24", "S3-R4",
   ("Tech plan, Already built", "Already built: the work order's single rep field with \"Unassigned\", (Inactive), save-as-you-go and the read-only gate (SV-8599)")]
  + DQ(["1.2"]),
  stories=[1, 4], design_src=DSRC(["1.2"]), pictures=PICS(["1.2"]))
