"""Design — how it looks (Rule 126). One case per screen and state group, each naming the design board to compare against.
Expected looks come from the PRD where it speaks (quoted); the design board is named for the picture. Conflicts follow the PRD (latest)."""
from ssr_lib import C
from common import *

CANVAS = "https://claude.ai/artifact/8MHqwyffAYtqZ6EccS5RUm"
def DSRC(boards): return (f'Claude design canvas "Splitting Sales Representatives" ({CANVAS}), export read 19 Oct 2026, {boards}, '
                          "used for the picture to compare against.")
def CANVAS_PRE(boards): return (f"The design canvas is open in another tab at {boards}.", f"For example: the canvas is {CANVAS}.")
W1440 = "in a desktop browser window 1440 px wide at 100% zoom"

C("D-01", "DESIGN", "Work order card at rest matches the design",
  [ADMIN, REPS2, CUST,
   ('Work order {Work-order-1} for {Customer-A} is open and not invoiced, with Lead Technician, Service Advisor and Sales Representative {Sales-rep-A}; work order {Work-order-2} has nobody in Sales Representative.', "For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002."),
   CANVAS_PRE("page 1, boards 1.2 and 1.5"),
   START("{Work-order-2} is open " + W1440)],
  ["Without hovering, compare the Sales Representative field with board 1.2.",
   "Open {Work-order-1} and compare the card with board 1.5.",
   "Measure the gaps between Lead Technician, Service Advisor and Sales Representative (for example with the browser's ruler or a screenshot)."],
  ["Step 1: \"Sales Representative\" on the first line and \"Unassigned\" on the second, in the same text style, size, weight and left edge as Lead Technician and Service Advisor; no box, no arrow and no button, as in the picture.",
   "Step 2: the name {Sales-rep-A} on the second line, plain at rest, as in the picture.",
   "Step 3: every gap is 16 px, including the gap under Lead Technician."],
  ["S1-R1", "S1-R2", "S1-R3", "S1-R6"], extra_src=DSRC("page 1, boards 1.2 and 1.5"))

C("D-02", "DESIGN", "Hovering the Sales Representative row shows the box, arrow and +",
  [ADMIN, REPS2, CUST, WO('its one "Sales Representative" field reads {Sales-rep-A}'),
   CANVAS_PRE("page 1, boards 1.3 and 1.6"), START("{Work-order-1} is open " + W1440)],
  ["Hover over the Sales Representative row and compare with board 1.6.",
   "Measure the box and the + button.",
   "Hover over the + itself.",
   "Move the pointer away, then click into the field with the keyboard (Tab) instead of hovering."],
  ["Step 1: one box around the label and the name together, the same box and height Lead Technician and Service Advisor show on hover, same left edge; the dropdown arrow at the right end, vertically centred on the label and name; the + to the right, as in the picture.",
   "Step 2: the box ends 16 px before a 32 px column holding the +; the + is a 32 px square with 8 px corners and a 20 px plus icon, grey on no fill.",
   "Step 3: the + shows a light fill.",
   "Step 4: while the field has keyboard focus the box, the arrow and the + stay shown."],
  ["S1-R4", "S1-R5", "S1-R11", "S2-R1", "S2-R2"], extra_src=DSRC("page 1, boards 1.3 and 1.6"),
  note="The design boards measure about 22 px between the box and the + on the work order card (16 px in the customer window). This case follows the PRD's 16 px; the difference is on the product owner's question list.")

C("D-03", "DESIGN", "The + tooltip and menu look as designed",
  [ADMIN, REPS2, CUST, WO('its one "Sales Representative" field reads {Sales-rep-A}'),
   CANVAS_PRE("page 1, boards 1.7 and 1.8"), START("{Work-order-1} is open " + W1440)],
  ["Hover over the + and compare with board 1.7.",
   "Click the + and compare with board 1.8."],
  ["Step 1: the tooltip \"Add representative\" shows where the picture shows it, without covering the field.",
   "Step 2: the menu opens below the + with the one option \"Sales Representative - Parts\"; the + keeps its light fill and the tooltip is gone, as in the picture."],
  ["S2-R2", "S2-R3", "S2-R4"], extra_src=DSRC("page 1, boards 1.7 and 1.8"))

C("D-04", "DESIGN", "Labor and Parts fields at rest and on hover look as designed",
  [ADMIN, REPS2, CUST, WO('Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}'),
   CANVAS_PRE("page 1, boards 1.9, 1.10, 1.12 and 1.13"), START("{Work-order-1} is open " + W1440)],
  ["Without hovering, compare the two fields with board 1.12.",
   "Hover over the rows and compare with board 1.10.",
   "Hover over the remove x and compare with board 1.13.",
   "Set the browser zoom to 200% and look at the two labels.",
   "Repeat steps 1 and 2 with the window 1536 px wide."],
  ["Step 1: \"Sales Representative - Labor\" above \"Sales Representative - Parts\", both labels in full, plain at rest, with 16 px between all fields.",
   "Step 2: both fields show their box at once; each arrow sits in the bottom-right corner of its field, on the name line; the remove x (32 px, 20 px x icon, grey) sits beside Parts only; no button beside Labor; no +.",
   "Step 3: the remove x shows a light fill and the tooltip \"Remove Sales Representative - Parts\".",
   "Step 4: both labels still show in full, never cut off, and no arrow covers a label.",
   "Step 5: the same look with nothing overlapping."],
  ["S1-R6", "S1-R11", "S2-R8", "S2-R9", "S2-R10", "S2-R14"], extra_src=DSRC("page 1, boards 1.9, 1.10, 1.12 and 1.13"))

C("D-05", "DESIGN", "The invoiced work order card shows the representatives as plain text",
  [ADMIN, REPS2, CUST, WO('Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}; it has been invoiced'),
   CANVAS_PRE("page 1, board 1.17"), START("{Work-order-1} is open " + W1440)],
  ["Hover over the representative rows and compare with board 1.17.",
   "Measure the gaps between the fields."],
  ["Step 1: both labels with their names as plain text, with no box, arrow, + or remove x, as in the picture.",
   "Step 2: every gap is 16 px."],
  ["S2-R17", "S1-R6"], extra_src=DSRC("page 1, board 1.17"))

C("D-06", "DESIGN", "Edit Customer and New Customer representative fields look as designed",
  [ADMIN, REPS3, ("Customer {Customer-A} has {Sales-rep-A} as its one sales representative.", "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   CANVAS_PRE("page 2, boards 2.3 to 2.12 and 2.16 to 2.18"), START("{Customer-A}'s page is open " + W1440)],
  ["Open Edit Customer and compare the field with board 2.3.",
   "Hover over the + and open its menu; compare with boards 2.6 and 2.7.",
   "Add Service Parts and Part Sales, pick {Sales-rep-B} and {Sales-rep-C}, and compare with board 2.12.",
   "Hover over a remove x; compare with board 2.13.",
   "Close the window without saving, open New Customer and compare with boards 2.16 and 2.17."],
  ["Step 1: the field has the same outlined box as every other field in the window, in the place Edit Customer shows it today; the arrow is vertically centred; the + shows without hovering; no x inside the field.",
   "Step 2: the tooltip \"Add representative\"; the menu lists \"Sales Representative - Service Parts\" then \"Sales Representative - Part Sales\".",
   "Step 3: three fields in order: \"Sales Representative - Service Labor\", \"Sales Representative - Service Parts\", \"Sales Representative - Part Sales\"; each added field has a remove x and the + is gone; labels in full.",
   "Step 4: the tooltip reads \"Remove Sales Representative - Service Parts\" or \"Remove Sales Representative - Part Sales\".",
   "Step 5: New Customer shows the same field and + as Edit Customer."],
  ["S4-R1", "S4-R4", "S4-R5", "S4-R6", "S4-R9", "S4-R10"], extra_src=DSRC("page 2, boards 2.3 to 2.18"),
  note="The design's customer list shows names that are not in A to Z order (boards 2.4 and 2.11). The PRD says A to Z by first name, then last name; this case and the customer-window list case follow the PRD, and the difference is on the product owner's question list.")

C("D-07", "DESIGN", "The customer page reads every representative row as designed",
  [ADMIN, REPS3,
   ('Customer {Customer-A} shows Service Labor {Sales-rep-A}, Service Parts {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}.', "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   CANVAS_PRE("page 2, board 2.15"), START("{Customer-A}'s page is open " + W1440)],
  ["Compare the representative rows with board 2.15."],
  ["Step 1: \"Sales Representative - Service Labor\", \"Sales Representative - Service Parts\" and \"Sales Representative - Part Sales\" with their names, in the window's order, styled like the page's other rows, as in the picture."],
  ["S4-R19"], extra_src=DSRC("page 2, board 2.15"))

C("D-08", "DESIGN", "Sales By Representative filter, column and dash cells look as designed",
  [ADMIN, REPS2, CUST, ("Today has one invoiced split work order (Labor {Sales-rep-A}, Parts {Sales-rep-B}) and one invoiced part sale with no shop supplies.", None),
   CANVAS_PRE("page 4, boards 4.4 to 4.10"), START("Reports > Sales By Representative is open for today " + W1440)],
  ["Compare the default report with boards 4.4 and 4.5.",
   "Open the Sales Type filter; compare with board 4.6.",
   "Open the column selector, turn Sales Type on and expand both representatives; compare with boards 4.8 to 4.10.",
   "Read the Shop Supplies cell on {Sales-rep-B}'s Parts row."],
  ["Step 1: one row per representative; no Sales Type column by default.",
   "Step 2: the filter lists \"Labor\", \"Parts\", \"Part Sales\", all ticked.",
   "Step 3: \"Sales Type\" is first in the column selector; the column shows after Status with \"Labor\", \"Parts\", \"Part Sales\"; columns line up as in the pictures and nothing overlaps.",
   "Step 4: a dash, not $0.00."],
  ["S5-R15", "S5-R19", "S5-R20", "S5-R21", "S8-R1"], extra_src=DSRC("page 4, boards 4.4 to 4.10"),
  note="The design shows $0.00 under Shop Supplies on the Parts row (boards 4.5 and 4.10). The PRD says a dash; this case follows the PRD, and the difference is on the product owner's question list. Whether a part sale with no shop supplies shows a dash or $0.00 is also on the list.")

C("D-09", "DESIGN", "Sales By Representative Expanded CSV and PDF look as designed",
  [ADMIN, REPS2, CUST, ("Today has one invoiced split work order (Labor {Sales-rep-A}, Parts {Sales-rep-B}).", None),
   CANVAS_PRE("page 4, boards 4.11 and 4.12"), START("Reports > Sales By Representative is open for today " + W1440)],
  ["Export the Expanded CSV and compare it with board 4.11.",
   "Export the Expanded PDF and compare it with board 4.12."],
  ["Step 1: the Sales Type column after Status; the cells of the side a row is not credited with are blank.",
   "Step 2: the Sales Type column after Status; those cells show a dash; layout as in the picture."],
  ["S5-R23"], extra_src=DSRC("page 4, boards 4.11 and 4.12"),
  note="The design's export pictures show 0.00 / $0.00 under Shop Supplies on the Parts row; the PRD says blank in the CSV and a dash in the PDF. This case follows the PRD; the difference is on the product owner's question list.")

C("D-10", "DESIGN", "Sales By Customer Sales Type filter looks as designed",
  [ADMIN, CANVAS_PRE("page 5, boards 5.1 and 5.2"), START("Reports > Sales By Customer is open " + W1440)],
  ["Compare the closed filter with board 5.1.",
   "Open it and compare with board 5.2."],
  ["Step 1: it reads \"Sales Type: All Sales\" where \"Product Type\" used to be, as in the picture.",
   "Step 2: options \"Part Sales\" and \"Service Sales\", both ticked, as in the picture."],
  ["S8-R6", "S8-R7", "S8-R8"], extra_src=DSRC("page 5, boards 5.1 and 5.2"))

C("D-11", "DESIGN", "On a phone the representative fields look as designed",
  [ADMIN, REPS2, CUST, WO('its one "Sales Representative" field reads {Sales-rep-A}'),
   CANVAS_PRE("page 6, boards 6.2 to 6.7"), "Starting screen: {Work-order-1} is open on a phone (a touch screen with no mouse pointer), card expanded."],
  ["Compare the field with board 6.2.",
   "Tap the + , add Parts, and compare with board 6.6."],
  ["Step 1: the field, its dropdown arrow and the + (32 px) are all shown without hover.",
   "Step 2: both fields with their arrows shown, and the remove x (32 px) beside Parts."],
  ["S3-R2", "S3-R4"], extra_src=DSRC("page 6, boards 6.2 to 6.7"),
  note="The design shows no arrow at rest on a phone (boards 6.2 and 6.6). The PRD says the arrow always shows on a touch screen; this case follows the PRD, and the difference is on the product owner's question list.")
