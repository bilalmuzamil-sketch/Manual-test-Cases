from ssr_lib import C, prd_line, AQ
from common import *

PHONE = "Starting screen: {Work-order-1} is open on a phone (a touch screen with no mouse pointer)."
# ---------------- Story 3: phone ----------------
C("S3-01", "S3", "On a phone the representatives show after the card is expanded",
  [ADMIN, REPS2, CUST, WO('its one "Sales Representative" field reads {Sales-rep-A}'), PHONE],
  ["Look at the work order card as it first opens.",
   "Tap the card's edit button to expand it."],
  ["Step 1: the card is collapsed: Lead Technician, Service Advisor and the Sales Representative field are not shown.",
   "Step 2: the card expands and shows Lead Technician, Service Advisor and the Sales Representative field reading {Sales-rep-A}."],
  ["S3-R6", AQ(9)])

# 22 Oct 2026, Rule 136 split: the field and its list (S3-R1, S3-R3) and the + and remove x (S3-R2) are separate controls with their
# own requirement; each part expands the card itself and starts from its own work order.
C("S3-02", "S3", "On a phone the field shows its arrow and opens its list without hover",
  [ADMIN, REPS2, CUST, WO('its one "Sales Representative" field reads {Sales-rep-A}'), PHONE],
  *SR(("Tap the card's edit button to expand it and look at the Sales Representative field without tapping it.", "the field already shows its dropdown arrow, and the + button shows beside it at its full size, without any hover."),
      ("Tap the Sales Representative field.", "the same dropdown Lead Technician and Service Advisor open on a phone opens, with \"Unassigned\" first and the same options as on a desktop; {Sales-rep-A} is checked. There is no x inside the field."),
      ("Tap \"Unassigned\".", "the field reads \"Unassigned\".")),
  ["S3-R1", "S3-R3", "S3-R4", AQ(11)])

C("S3-02b", "S3", "On a phone the + and the remove x work without hover",
  [ADMIN, REPS2, CUST, WO('its one "Sales Representative" field reads {Sales-rep-A}'), PHONE],
  *SR(("Tap the card's edit button to expand it.", "the card expands; the + button shows beside the Sales Representative field at its full size, without any hover."),
      ("Tap the + button.", "a menu opens."),
      ("Tap \"Sales Representative - Parts\".", "\"Sales Representative - Labor\" and \"Sales Representative - Parts\" show, both reading {Sales-rep-A}, each with its arrow showing; the remove x shows beside Parts."),
      ("Tap the remove x beside \"Sales Representative - Parts\".", "one \"Sales Representative\" field shows again, reading {Sales-rep-A}.")),
  ["S3-R2", "S3-R4", "S2-R6", "S2-R16"])

C("S3-03", "S3", "On a phone the customer window's representative fields work as on desktop",
  [ADMIN, REPS2, CUST, "Starting screen: {Customer-A}'s page is open on a phone (a touch screen with no mouse pointer)."],
  *SR(("Open Edit Customer.", "the Edit Customer window shows the Sales Representative field with the + beside it, shown without any hover."),
      ("Tap the Sales Representative field.", "the same native dropdown opens."),
      ("Tap {Sales-rep-A}.", "the field reads {Sales-rep-A}."),
      ("Tap the +.", "a menu opens."),
      ("Tap \"Sales Representative - Service Parts\".", "the first field is renamed \"Sales Representative - Service Labor\" and \"Sales Representative - Service Parts\" shows under it; both read {Sales-rep-A}."),
      ("Tap the remove x beside \"Sales Representative - Service Parts\".", "the first field reads \"Sales Representative\" again, holding {Sales-rep-A}."),
      ("Save the customer.", "the customer saves and its page shows \"Sales Representative\" {Sales-rep-A}.")),
  ["S3-R5", "S4-R7", "S4-R11"])

# ---------------- Story 4: customer ----------------
CPAGE = START("{Customer-A}'s page is open in a desktop browser at least 1024 px wide")
# 22 Oct 2026, Rule 136 split: the field and its list (S4-R1, S4-R3, S4-R4) and saving with nobody in it (S4-R2) are separate
# behaviours; S4-01b starts in the Edit Customer window of its own customer.
C("S4-01", "S4", "Edit Customer has a Sales Representative field that lists Unassigned first",
  [ADMIN, REPS2, ('Staff member {Staff-member-D} is active with the "Sales Representative" switch off.', "For example: {Staff-member-D} is ZZAUTOTEST Dan Noswitch."), CUST, CPAGE],
  ["Open Edit Customer.",
   "Click the Sales Representative field."],
  ["Step 1: the window shows a Sales Representative field in the place Edit Customer shows it today, with the same outlined box as the other fields; the + shows beside it without hovering. No field has an x inside it.",
   "Step 2: the dropdown opens. Reading it from top to bottom: \"Unassigned\" is first, then every active sales representative sorted by first name, then last name, A to Z (including {Sales-rep-A} and {Sales-rep-B}); {Staff-member-D} is not listed; there is no search box."],
  ["S4-R1", "S4-R3", "S4-R4", AQ(15)])

C("S4-01b", "S4", "A customer can be saved with nobody as its sales representative",
  [ADMIN, REPS2, CUST, START("{Customer-A}'s Edit Customer window is open in a desktop browser at least 1024 px wide, with the Sales Representative field reading \"Unassigned\"")],
  ["Save the customer."],
  ["Step 1: the customer saves with nobody in the field; its page shows \"Sales Representative\" reading \"Unassigned\"."],
  ["S4-R2", "S4-R19"])

C("S4-02", "S4", "New Customer has the Sales Representative field too",
  [ADMIN, REPS2, START("the Customers page is open in a desktop browser at least 1024 px wide")],
  *SR(("Open New Customer.", "the New Customer window shows a Sales Representative field with the + beside it."),
      ("Fill in the required customer details.", "the required fields are filled in."),
      ("Pick {Sales-rep-A} in Sales Representative.", "the field reads {Sales-rep-A}."),
      ("Save the customer.", "the customer is created."),
      ("Open the new customer's page.", "the page shows \"Sales Representative\" {Sales-rep-A}.")),
  ["S4-R1", "S4-R19", ("Release day", prd_line("New: the New Customer window has a Sales Representative field"))])

C("S4-03", "S4", "Adding Service Parts renames the first field and copies the person",
  [ADMIN, REPS2, ("Customer {Customer-A} has {Sales-rep-A} as its one sales representative.", "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."), CEDIT],
  ["Hover over the + beside Sales Representative.",
   "Click the +.",
   "Click \"Sales Representative - Service Parts\".",
   "Click the + again."],
  ["Step 1: the tooltip reads \"Add representative\".",
   "Step 2: the menu lists, in this order, \"Sales Representative - Service Parts\" and \"Sales Representative - Part Sales\".",
   "Step 3: the first field is renamed \"Sales Representative - Service Labor\" and \"Sales Representative - Service Parts\" shows under it. Both read {Sales-rep-A}. No dropdown opens on its own; Service Parts has a remove x.",
   "Step 4: the menu now lists only \"Sales Representative - Part Sales\"."],
  ["S4-R5", "S4-R6", "S4-R7", "S4-R10", "S4-R15"])

# 22 Oct 2026, Rule 136 split: adding the Part Sales field (S4-R8, S4-R10) and keeping its choice when Service Parts changes (S4-R14,
# S4-E2) are separate behaviours; S4-04b starts from its own customer that already has the Part Sales field. The tooltip of the
# remove x shows on hover, so S4-04 now hovers it.
C("S4-04", "S4", "Adding Part Sales starts with what new part sales would get",
  [ADMIN, REPS3,
   ('Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A} and "Sales Representative - Service Parts" {Sales-rep-B}, with no Part Sales field.', "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   CEDIT],
  ["Click the +.",
   "Click \"Sales Representative - Part Sales\".",
   "Hover over the remove x beside \"Sales Representative - Part Sales\"."],
  ["Step 1: the menu opens.",
   "Step 2: \"Sales Representative - Part Sales\" shows last, under Service Parts, reading {Sales-rep-B} (the person new part sales get today), with a remove x to its right. The + is no longer shown beside the first field, because both fields have been added.",
   "Step 3: the tooltip reads \"Remove Sales Representative - Part Sales\"."],
  ["S4-R6", "S4-R8", "S4-R9", "S4-R10"])

C("S4-04b", "S4", "Changing Service Parts never changes an added Part Sales field",
  [ADMIN, REPS3,
   ('Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A}, "Sales Representative - Service Parts" {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-B}.', "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   CEDIT],
  ["Change \"Sales Representative - Service Parts\" to {Sales-rep-C}.",
   "Save the customer."],
  ["Step 1: Service Parts reads {Sales-rep-C}; Part Sales still reads {Sales-rep-B}.",
   "Step 2: the customer saves, and its page lists, in this order, \"Sales Representative - Service Labor\" {Sales-rep-A}, \"Sales Representative - Service Parts\" {Sales-rep-C}, \"Sales Representative - Part Sales\" {Sales-rep-B}."],
  ["S4-R14", "S4-E2", "S4-R19", "S4-R9"])

# 23 Oct 2026: Chris Ward's answer 41 (PRD v13 S4-R7 and S4-R8): an added field never copies a person whose Sales Representative
# switch is off; it starts "Unassigned" and the field they hold keeps them as "(Inactive)". Two cases, one per added field (Rule 136).
# The "account deactivated" half of the rule has no customer case: deactivating an account removes the person from every customer
# field first (S4-R20), so no customer field can hold them when a field is added.
SWITCHED_OFF = ('Staff member {Staff-member-D} is active at {Location-A} with the "Sales Representative" switch turned off after being picked on the customer.',
                "For example: {Staff-member-D} is ZZAUTOTEST Dan Noswitch.")
C("S4-03b", "S4", "Adding Service Parts starts Unassigned when the rep's switch is off",
  [ADMIN, SWITCHED_OFF,
   ('Customer {Customer-A} has {Staff-member-D} as its one sales representative, shown as "{Staff-member-D} (Inactive)".', "For example: {Customer-A} is ZZAUTOTEST SSR Switch Off."),
   CEDIT],
  ["Click the + beside Sales Representative.",
   "Click \"Sales Representative - Service Parts\".",
   "Save the customer."],
  ["Step 1: the menu opens.",
   "Step 2: the first field is renamed \"Sales Representative - Service Labor\" and still reads \"{Staff-member-D} (Inactive)\"; \"Sales Representative - Service Parts\" shows under it reading \"Unassigned\".",
   "Step 3: the customer saves, and its page lists \"Sales Representative - Service Labor\" {Staff-member-D} (Inactive) and \"Sales Representative - Service Parts\" Unassigned."],
  ["S4-R7", "S4-N2", "S4-R27", AQ(41)])

C("S4-04c", "S4", "Adding Part Sales starts Unassigned when the person it copies is switched off",
  [ADMIN, ('Staff member {Sales-rep-A} is active at {Location-A} with the "Sales Representative" switch on.', "For example: {Sales-rep-A} is ZZAUTOTEST Ann Able."), SWITCHED_OFF,
   ('Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A} and "Sales Representative - Service Parts" "{Staff-member-D} (Inactive)", with no Part Sales field.', "For example: {Customer-A} is ZZAUTOTEST SSR Switch Off PS."),
   CEDIT],
  ["Click the +.",
   "Click \"Sales Representative - Part Sales\".",
   "Save the customer."],
  ["Step 1: the menu opens.",
   "Step 2: \"Sales Representative - Part Sales\" shows last and reads \"Unassigned\"; Service Parts still reads \"{Staff-member-D} (Inactive)\" and Service Labor {Sales-rep-A}.",
   "Step 3: the customer saves, and its page lists Service Labor {Sales-rep-A}, Service Parts {Staff-member-D} (Inactive) and \"Sales Representative - Part Sales\" Unassigned, in that order."],
  ["S4-R8", "S4-R26", "S4-R27", "S4-N2", AQ(41)])

C("S4-05", "S4", "Removing Service Parts makes the Service Labor person the one rep",
  [ADMIN, REPS3,
   ('Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A}, "Sales Representative - Service Parts" {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}.', "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   CEDIT],
  ["Click the remove x beside \"Sales Representative - Service Parts\".",
   "Save the customer and look at its page."],
  ["Step 1: Service Parts goes away; the first field is renamed \"Sales Representative\" and reads {Sales-rep-A}; \"Sales Representative - Part Sales\" still reads {Sales-rep-C}.",
   "Step 2: the page shows \"Sales Representative\" {Sales-rep-A} and \"Sales Representative - Part Sales\" {Sales-rep-C}."],
  ["S4-R11", "S4-R19"])

C("S4-06", "S4", "Removing Part Sales makes new part sales follow again",
  [ADMIN, REPS3,
   ('Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A}, "Sales Representative - Service Parts" {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}.', "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   CEDIT],
  *SR(("Click the remove x beside \"Sales Representative - Part Sales\".", "the \"Sales Representative - Part Sales\" field is removed from the window."),
      ("Save the customer.", "the customer saves with no Part Sales field."),
      ("Create a new part sale for {Customer-A} and look at its Sales Representative field.", "the new part sale starts with {Sales-rep-B}, the Service Parts person.")),
  ["S4-R12", "S4-R26"])

C("S4-07", "S4", "Nothing in the customer window is saved until Save",
  [ADMIN, REPS2, ("Customer {Customer-A} has {Sales-rep-A} as its one sales representative.", "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."), CEDIT],
  ["Click the +.",
   "Click \"Sales Representative - Service Parts\".",
   "Change Service Parts to {Sales-rep-B}.",
   "Close the window without saving (Cancel or the window's close button).",
   "Open Edit Customer again."],
  ["Step 1: the menu opens.",
   "Step 2: Service Labor and Service Parts show, both {Sales-rep-A}.",
   "Step 3: Service Parts reads {Sales-rep-B}.",
   "Step 4: the window closes; the page still shows one \"Sales Representative\" {Sales-rep-A}.",
   "Step 5: the window shows one \"Sales Representative\" field reading {Sales-rep-A}; nothing was saved."],
  ["S4-R16"])

C("S4-08", "S4", "The customer page shows the reps with or without an address",
  [ADMIN, REPS2,
   ("Customer {Customer-A} has no address and no sales representative; customer {Customer-B} has no address and {Sales-rep-A} as Service Labor and {Sales-rep-B} as Service Parts.", "For example: {Customer-A} is ZZAUTOTEST SSR No Address and {Customer-B} is ZZAUTOTEST SSR Split No Address."),
   START("the Customers page is open in a desktop browser at least 1024 px wide")],
  ["Open {Customer-A}'s page.",
   "Open {Customer-B}'s page."],
  ["Step 1: the page shows \"Sales Representative\" reading \"Unassigned\" (not \"N/A\"), even though the customer has no address.",
   "Step 2: the page shows \"Sales Representative - Service Labor\" {Sales-rep-A}, then \"Sales Representative - Service Parts\" {Sales-rep-B}."],
  ["S4-R19", "S4-E1"])

C("S4-09", "S4", "A new work order starts with the customer's one representative",
  [ADMIN, REPS2, ("Customer {Customer-A} has {Sales-rep-A} as its one sales representative.", "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   START("the Work Orders page is open in a desktop browser at least 1024 px wide")],
  *SR(("Create a new work order for {Customer-A}.", "the new work order shows one \"Sales Representative\" field reading {Sales-rep-A}; it is not split."),
      MENU,
      ("Click Audit Log.", "there is no \"Sales representative changed\" entry for the copied representative.")),
  ["S4-R24", "S7-R5", AQ(38)],
  note="The Sales By Representative spec, version 28 (12 Oct 2026, S19-R3), still says a new work order opens \"Unassigned\". Chris Ward ruled on 19 Oct 2026 that the PRD wins (answer 38, quoted below); this case follows PRD version 10, which fills it from the customer.")

C("S4-10", "S4", "A new work order for a split customer starts with Labor and Parts",
  [ADMIN, REPS2,
   ('Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A} and "Sales Representative - Service Parts" {Sales-rep-B}.', "For example: {Customer-A} is ZZAUTOTEST SSR Split Fleet."),
   START("the Work Orders page is open in a desktop browser at least 1024 px wide")],
  ["Create a new work order for {Customer-A}.",
   "Click the remove x beside \"Sales Representative - Parts\"."],
  ["Step 1: the card shows \"Sales Representative - Labor\" {Sales-rep-A} and \"Sales Representative - Parts\" {Sales-rep-B}.",
   "Step 2: one \"Sales Representative\" field shows, reading {Sales-rep-A}."],
  ["S4-R25", "S2-R16"])

C("S4-11", "S4", "A new part sale starts with Part Sales, Service Parts or the one rep",
  [ADMIN, REPS3,
   ('Customer {Customer-A} has {Sales-rep-A} as its one sales representative; customer {Customer-B} shows "Sales Representative - Service Labor" {Sales-rep-A} and "Sales Representative - Service Parts" {Sales-rep-B}; customer {Customer-C} shows Service Labor {Sales-rep-A}, Service Parts {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}.',
    "For example: {Customer-A} is ZZAUTOTEST SSR One, {Customer-B} is ZZAUTOTEST SSR Two and {Customer-C} is ZZAUTOTEST SSR Three."),
   START("the Part Sales page is open in a desktop browser at least 1024 px wide")],
  ["Create a new part sale for {Customer-A}.",
   "Create a new part sale for {Customer-B}.",
   "Create a new part sale for {Customer-C}."],
  ["Step 1: its Sales Representative field reads {Sales-rep-A}.",
   "Step 2: it reads {Sales-rep-B}, the Service Parts person.",
   "Step 3: it reads {Sales-rep-C}, the Part Sales person."],
  ["S4-R26", "S4-R13"])

C("S4-12", "S4", "Part Sales set to Unassigned gives new part sales Unassigned",
  [ADMIN, REPS2,
   ('Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A}, "Sales Representative - Service Parts" {Sales-rep-B} and "Sales Representative - Part Sales" reading "Unassigned".', "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   START("the Part Sales page is open in a desktop browser at least 1024 px wide")],
  ["Create a new part sale for {Customer-A}."],
  ["Step 1: its Sales Representative field reads \"Unassigned\"."],
  ["S4-R26", "S4-R14"])

# 22 Oct 2026, Rule 136 split from S4-12: the credit of a part sale invoiced with nobody (S4-R18) is its own behaviour; the part sale
# is invoiced during setup and the case starts on the report.
C("S4-12b", "S4", "A part sale invoiced with Unassigned is credited to Unassigned",
  [ADMIN, REPS2,
   ('Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A}, "Sales Representative - Service Parts" {Sales-rep-B} and "Sales Representative - Part Sales" reading "Unassigned".', "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   ('Part sale {Part-sale-1} for {Customer-A} started with Sales Representative "Unassigned", has one part, and was invoiced today without a representative being picked.', "For example: {Part-sale-1} is P-30001."),
   SBR_TODAY(", with Show Unassigned on and the Sales Type column turned on")],
  *SR(EXPAND_UNASSIGNED("the whole of {Part-sale-1} is credited to Unassigned, as one \"Part Sales\" row; {Sales-rep-A} and {Sales-rep-B} are not credited with it.")),
  ["S4-R18", "S5-R9"])

C("S4-13", "S4", "Counter Sale starts with no representative",
  [ADMIN, START("the Part Sales page is open at {Location-A} in a desktop browser at least 1024 px wide; nobody has set a representative on {Location-A}'s Counter Sale customer")],
  ["Create a new walk-in part sale (Counter Sale customer)."],
  ["Step 1: its Sales Representative field reads \"Unassigned\"."],
  ["S4-R31"])

# 22 Oct 2026, Rule 136 split into three: a work order's representative change never reaches its customer (S4-R32), a work order's
# customer change never changes its representatives (S4-R28), and a customer's change never reaches its existing work orders
# (S4-R30). Each part has its own work order and customers, so none needs another run first.
C("S4-14", "S4", "Changing a work order's representative never changes its customer",
  [ADMIN, REPS3,
   ("Customer {Customer-A} has {Sales-rep-A} as its one sales representative.", "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   WO('its one "Sales Representative" field reads {Sales-rep-A} (copied from {Customer-A} when it was created)'), WO_START],
  ["Change the work order's Sales Representative to {Sales-rep-C}.",
   "Open {Customer-A}'s page."],
  ["Step 1: the work order reads {Sales-rep-C}.",
   "Step 2: {Customer-A} still shows {Sales-rep-A}."],
  ["S4-R32"])

C("S4-14b", "S4", "Changing a work order's customer never changes its representatives",
  [ADMIN, REPS2,
   ("Customer {Customer-A} has {Sales-rep-A} as its one sales representative; customer {Customer-B} has {Sales-rep-B}.", "For example: {Customer-A} is ZZAUTOTEST SSR Fleet and {Customer-B} is ZZAUTOTEST SSR Other."),
   WO('its one "Sales Representative" field reads {Sales-rep-A} (copied from {Customer-A} when it was created)'), WO_START],
  ["Change the work order's customer to {Customer-B}."],
  ["Step 1: the work order's customer is {Customer-B}, and its Sales Representative still reads {Sales-rep-A}; it does not take {Customer-B}'s {Sales-rep-B}."],
  ["S4-R28"])

C("S4-14c", "S4", "Changing a customer's representative never changes its work orders",
  [ADMIN, REPS2,
   ("Customer {Customer-A} has {Sales-rep-A} as its one sales representative.", "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   WO('its one "Sales Representative" field reads {Sales-rep-A} (copied from {Customer-A} when it was created)'), CEDIT],
  ["Change the Sales Representative field to {Sales-rep-B}.",
   "Save the customer.",
   "Open {Work-order-1}."],
  ["Step 1: the field reads {Sales-rep-B}.",
   "Step 2: the customer saves.",
   "Step 3: {Work-order-1} still reads {Sales-rep-A}."],
  ["S4-R30"])

# 22 Oct 2026, Rule 136 split: not copying a switched-off representative to a new work order (S4-R27, S4-N2) and still crediting them
# when the work order is invoiced with nobody (S4-R17) are separate behaviours; S4-15b's work order is invoiced during setup and the
# case starts on the report, where the invoice row shows once the representative is expanded.
# The staff line says plainly that {Sales-rep-B}'s switch is now off (it used to read "Two active staff members ... have their switch on").
STAFF_B_OFF = ('Staff members {Sales-rep-A} and {Sales-rep-B} are active at {Location-A}. {Sales-rep-A}\'s "Sales Representative" switch is on; {Sales-rep-B}\'s was on and has since been turned off (the staff account is still active).',
               "For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.")
C("S4-15", "S4", "A rep with the switch off is not copied to a new work order",
  [ADMIN, STAFF_B_OFF,
   ("Customer {Customer-A} has {Sales-rep-B} as its one sales representative, picked while their switch was on.", "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   START("the Work Orders page is open in a desktop browser at least 1024 px wide")],
  *SR(("Open {Customer-A}'s page.", "{Customer-A} still shows {Sales-rep-B}, reading \"{Sales-rep-B} (Inactive)\"."),
      ("Create a new work order for {Customer-A}.", "the new work order's Sales Representative reads \"Unassigned\".")),
  ["S4-R27", "S4-N2", AQ(14), ("Story 4 context note (S4-R27, S4-N2)", prd_line("* Context note (S4-R27, S4-N2)"))])

C("S4-15b", "S4", "A switched-off customer rep is still credited when invoicing with nobody",
  [ADMIN, STAFF_B_OFF,
   ("Customer {Customer-A} has {Sales-rep-B} as its one sales representative, picked while their switch was on.", "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   ('Work order {Work-order-1} for {Customer-A} was created after the switch was turned off, so its Sales Representative reads "Unassigned"; it has one labor line and one part, and was invoiced today without a representative being picked.', "For example: {Work-order-1} is S2-40001."),
   SBR_TODAY()],
  *SR(EXPAND("{Sales-rep-B}", "{Work-order-1}'s invoice is credited to {Sales-rep-B}, labor and parts.")),
  ["S4-R17", "S4-R27", ("Story 4 context note (S4-R27, S4-N2)", prd_line("* Context note (S4-R27, S4-N2)"))])

C("S4-16", "S4", "A work order invoiced with nobody takes the customer's reps per side",
  [ADMIN, REPS2,
   ('Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A} and "Sales Representative - Service Parts" {Sales-rep-B}.', "For example: {Customer-A} is ZZAUTOTEST SSR Split Fleet."),
   WO('it has one labor line (for example $100.00) and one part (for example $50.00); both sides read "Unassigned" and it was invoiced today without a representative being picked'),
   SBR_TODAY(", with the Sales Type column turned on")],
  *SR(EXPAND("{Sales-rep-A}", "the labor of {Work-order-1}'s invoice (for example $100.00) is credited to {Sales-rep-A} on a \"Labor\" row."),
      EXPAND("{Sales-rep-B}", "the part (for example $50.00) is credited to {Sales-rep-B} on a \"Parts\" row.")),
  ["S4-R17", "S5-R3"])

C("S4-17", "S4", "An empty side is not filled from the customer at invoicing",
  [ADMIN, REPS2, ("Customer {Customer-A} has {Sales-rep-B} as its one sales representative.", "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   WO('its card showed "Sales Representative - Labor" reading "Unassigned" and "Sales Representative - Parts" reading {Sales-rep-A} when it was invoiced today; it has one labor line and one part'),
   SBR_TODAY(", with Show Unassigned on and the Sales Type column turned on")],
  *SR(EXPAND_UNASSIGNED("the labor of {Work-order-1}'s invoice is credited to Unassigned on a \"Labor\" row."),
      EXPAND("{Sales-rep-A}", "the part is credited to {Sales-rep-A} on a \"Parts\" row. {Sales-rep-B} is not listed in the report: nothing is credited to {Sales-rep-B}.")),
  ["S4-N1", "S2-N1", "S5-R18"])

C("S4-18", "S4", "Deactivating a rep clears their customer fields and removes Part Sales",
  [ADMIN, REPS3,
   ('Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A}, "Sales Representative - Service Parts" {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}; customer {Customer-B} has {Sales-rep-C} as its one representative.',
    "For example: {Customer-A} is ZZAUTOTEST SSR Fleet and {Customer-B} is ZZAUTOTEST SSR Other."),
   START("Settings > Staff is open in a desktop browser at least 1024 px wide")],
  ["Start deactivating {Sales-rep-C}'s account and read the Deactivate window.",
   "Confirm the deactivation.",
   "Open {Customer-A}'s page.",
   "Open {Customer-B}'s page."],
  ["Step 1: the Deactivate window reads \"They will be removed as sales representative from 2 customers.\" ({Customer-A} once, {Customer-B} once); the old line \"Their customer assignments will stay where they are.\" is not shown.",
   "Step 2: {Sales-rep-C} is deactivated.",
   "Step 3: {Customer-A} shows Service Labor {Sales-rep-A} and Service Parts {Sales-rep-B}; the Part Sales field is gone, so new part sales follow Service Parts.",
   "Step 4: {Customer-B} shows \"Sales Representative\" reading \"Unassigned\"."],
  ["S4-R20", "S4-R21", AQ(12), AQ(13)],
  note="The Sales By Representative spec, version 28 (12 Oct 2026, Story 13), still keeps a deactivated person on their customers. Chris Ward ruled on 19 Oct 2026 for the PRD (answers 12 and 13, quoted below); this case follows PRD version 10, which removes them.")

C("S4-19", "S4", "The Deactivate window counts a customer once when a rep holds two fields",
  [ADMIN, REPS2,
   ('Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-B} and "Sales Representative - Service Parts" {Sales-rep-B}, and no other customer has {Sales-rep-B}.', "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   START("Settings > Staff is open in a desktop browser at least 1024 px wide")],
  ["Start deactivating {Sales-rep-B}'s account and read the Deactivate window.",
   "Cancel the deactivation."],
  ["Step 1: the Deactivate window reads \"They will be removed as sales representative from 1 customer.\" (\"customer\", not \"customers\"; {Customer-A} is counted once).",
   "Step 2: nothing changes; {Sales-rep-B} stays active."],
  ["S4-R21", AQ(13)])

# 22 Oct 2026, Rule 136 split from S4-19: the "Turn Off Sales Representative" warning staying as it is today (answer 13) is checked on
# its own, from the staff record; nothing in it depends on the Deactivate window.
C("S4-19b", "S4", "Turning off the switch still shows today's warning with no customer count",
  [ADMIN, REPS2,
   ('Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-B} and "Sales Representative - Service Parts" {Sales-rep-B}.', "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   START("{Sales-rep-B}'s staff record is open in Settings > Staff in a desktop browser at least 1024 px wide, with the \"Sales Representative\" switch on")],
  ["Turn the \"Sales Representative\" switch off and read the \"Turn Off Sales Representative\" warning.",
   "Cancel the warning."],
  ["Step 1: the \"Turn Off Sales Representative\" warning shows as it does today, with no customer count.",
   "Step 2: the switch stays on and nothing changes."],
  ["S4-R21", AQ(13)])

# 22 Oct 2026, tech plan pass (Rule 134): rewritten top to bottom. The tech plan says today a rename reaches only ONE customer
# ("it updates one, `findOneBy`") and tests "the new name on every customer holding them"; it also tests that a customer still holding a
# switched-off rep can be saved ("An already-held unflagged id saves (S4-N2)"). Was: one customer, no save.
# 22 Oct 2026, Rule 136 split (was 11 steps): the rename reaching every customer (S4-R22) and a customer still holding a switched-off
# representative being saved (S4-N2, answer 14) are separate behaviours. S4-20b has its own customer and representatives, and turning
# the switch off is its setup; nothing in it depends on the rename.
C("S4-20", "S4", "Renaming a rep updates their name on every customer",
  [ADMIN, REPS2,
   ('Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A} and "Sales Representative - Service Parts" {Sales-rep-B}; customer {Customer-B} has {Sales-rep-B} as its one sales representative.', "For example: {Customer-A} is ZZAUTOTEST SSR Fleet and {Customer-B} is ZZAUTOTEST SSR Other."),
   START("{Sales-rep-B}'s staff record is open in Settings > Staff in a desktop browser at least 1024 px wide")],
  *SR(("Change {Sales-rep-B}'s last name (for example to \"Brook\").", "the new last name shows in the staff record."),
      ("Save the staff record.", "the staff record saves."),
      ("Open {Customer-A}'s page.", "Service Parts shows {Sales-rep-B}'s new name."),
      ("Open {Customer-B}'s page.", "\"Sales Representative\" also shows {Sales-rep-B}'s new name.")),
  ["S4-R22",
   ("Tech plan, what the code does today (section 1)", "Assumed but not true today: a rename updates every customer (it updates one, `findOneBy`)"),
   ("Tech plan, Phase 2 functional tests (section 3.7, rename)", "Rename the user, then the view shows the new name on every customer holding them (S4-R22).")])

C("S4-20b", "S4", "A customer still holding a switched-off rep keeps them and saves",
  [ADMIN,
   ('Staff members {Sales-rep-A} and {Sales-rep-B} are active at {Location-A}. {Sales-rep-B}\'s "Sales Representative" switch is on; {Sales-rep-A}\'s was on and has since been turned off (the staff account is still active).',
    "For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able."),
   ('Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A}, picked while their switch was on, and "Sales Representative - Service Parts" {Sales-rep-B}.', "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   START("the Customers page is open in a desktop browser at least 1024 px wide")],
  *SR(("Open {Customer-A}'s page.", "Service Labor still shows {Sales-rep-A}, reading \"{Sales-rep-A} (Inactive)\"."),
      ("Open Edit Customer.", "the Edit Customer window opens."),
      ("Click the \"Sales Representative - Service Labor\" field.", "the field reads \"{Sales-rep-A} (Inactive)\"; {Sales-rep-A} is not offered in the dropdown and no option is checked."),
      ("Close the dropdown without picking anything.", "the field still reads \"{Sales-rep-A} (Inactive)\"."),
      ("Save the customer.", "the customer saves with no error message, and its page still shows Service Labor \"{Sales-rep-A} (Inactive)\" and Service Parts {Sales-rep-B}.")),
  ["S4-N2", AQ(14),
   ("Tech plan, Phase 2 functional tests (section 3.7, already held)", "An already-held unflagged id saves (S4-N2).")])

# 22 Oct 2026, tech plan pass (Rule 134): rewritten top to bottom. The tech plan's export query sorts by customer name, then
# representative name, and folds the rows into one per customer per person (section 4.1); the example names now sort in a known order.
C("S4-21", "S4", "The assignments export lists one row per customer per person with Side",
  [ADMIN, REPS3,
   ('Customer {Customer-A} has {Sales-rep-A} as its one representative; customer {Customer-B} shows Service Labor {Sales-rep-A} and Service Parts {Sales-rep-B}; customer {Customer-C} has {Sales-rep-C} as its one representative and "Sales Representative - Part Sales" {Sales-rep-C}. The customer names sort A to Z as {Customer-A}, {Customer-B}, {Customer-C}, and {Sales-rep-A}\'s name sorts before {Sales-rep-B}\'s.',
    "For example: {Customer-A} is ZZAUTOTEST SSR A-One, {Customer-B} is ZZAUTOTEST SSR B-Two and {Customer-C} is ZZAUTOTEST SSR C-Three."),
   START("the page with the Sales Representative Assignments export is open in a desktop browser at least 1024 px wide")],
  ["Download the Sales Representative Assignments export.",
   "Open the downloaded file."],
  ["Step 1: a file named sales-representative-assignments.csv downloads.",
   "Step 2: the column after \"Representative is active?\" is named \"Side\". {Customer-A}: one row, {Sales-rep-A}, Side \"Parts and Service\". {Customer-B}: two rows, {Sales-rep-A} \"Service Labor\" and {Sales-rep-B} \"Service Parts\". {Customer-C}: one row, {Sales-rep-C}, Side \"Parts and Service, Part Sales\". The rows run by customer name, A to Z ({Customer-A}, then {Customer-B}, then {Customer-C}), and within {Customer-B} {Sales-rep-A}'s row comes before {Sales-rep-B}'s."],
  ["S4-R23", AQ(17), AQ(18),
   ("Tech plan, Assignments export (section 4.1, row order)", "ORDER BY LOWER(co.name), LOWER(sales_rep_name), co.id, csr.user_id"),
   ("Tech plan, Assignments export (section 4.1, one row per person)", "Then fold in PHP into one row per (customer id, user id).")],
  note="The Sales By Representative spec, version 28 (12 Oct 2026, S15-R1, S15-R4, S15-R5 and S15-R9), names the export, its heading (\"Rep is active?\") and its Side values differently. Chris Ward ruled on 19 Oct 2026 for the PRD (answers 17 and 18, quoted below); this case follows PRD version 11.")

C("S4-22", "S4", "Re-importing a customer keeps all its representatives",
  [ADMIN, REPS3,
   ('Customer {Customer-A} shows Service Labor {Sales-rep-A}, Service Parts {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}.', "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   ("A contacts import file contains {Customer-A} with its current details.", "For example: the file is ZZAUTOTEST-ssr-reimport.csv."),
   START("the contacts import is open in a desktop browser at least 1024 px wide")],
  ["Import the file.",
   "Open {Customer-A}'s page."],
  ["Step 1: the import finishes.",
   "Step 2: Service Labor {Sales-rep-A}, Service Parts {Sales-rep-B} and Part Sales {Sales-rep-C} are all still there."],
  ["S4-N3"])

C("S4-25", "S4", "A part-sales-only user adding a customer from a part sale sees the reps",
  [('You are signed in as {User-B}, whose role has "Part Sales — Create & Edit" but not "Customers — Create & Edit" or "Work Orders — Create & Edit", at {Location-A}.',
    "For example: {User-B} is ZZAUTOTEST SSR Part Sales Only with the custom role ZZAUTOTEST SSR Part Sales Only; {Location-A} is Staging Heavy Duty - 9919."),
   REPS2, ('Staff member {Staff-member-D} is active at {Location-A} with the "Sales Representative" switch off.', "For example: {Staff-member-D} is ZZAUTOTEST Dan Noswitch."),
   START("the Part Sales page is open in a desktop browser at least 1024 px wide")],
  ["Start a New Part Sale.",
   "Choose to add a new customer from it.",
   "Click the Sales Representative field in the New Customer window.",
   "Click {Sales-rep-A} in the dropdown.",
   "Fill in the required customer details.",
   "Save the customer."],
  ["Step 1: a new part sale starts.",
   "Step 2: the New Customer window opens with a Sales Representative field.",
   "Step 3: the dropdown opens and lists the sales representatives; it is not empty and shows no access-denied message. Reading it from top to bottom: \"Unassigned\" is first, then every active sales representative sorted by first name, then last name, A to Z (including {Sales-rep-A} and {Sales-rep-B}); {Staff-member-D} is not listed; there is no search box.",
   "Step 4: the field reads {Sales-rep-A}.",
   "Step 5: the required fields are filled in.",
   "Step 6: the customer is created with {Sales-rep-A} as its sales representative."],
  ["S4-R3", AQ(16), ("Story 4 prerequisites", prd_line("User has 'Customers — Create & Edit' enabled, or 'Work Orders — Create & Edit'")), "S4-R1"])

# 22 Oct 2026, Rule 136 pass: the deactivation is the setup (what it does to the customers is checked in S4-18); this case checks only
# that reactivating does not put the person back, so it starts with the account already deactivated.
C("S4-26", "S4", "Reactivating a rep does not put them back on their customers",
  [ADMIN,
   ('Staff members {Sales-rep-A} and {Sales-rep-B} are active at {Location-A} with the "Sales Representative" switch on. Staff member {Sales-rep-C} had the switch on, and their staff account has since been deactivated.',
    "For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able."),
   ('Before {Sales-rep-C} was deactivated, customer {Customer-A} had {Sales-rep-C} as its one sales representative and customer {Customer-B} showed "Sales Representative - Service Labor" {Sales-rep-A}, "Sales Representative - Service Parts" {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}.',
    "For example: {Customer-A} is ZZAUTOTEST SSR Fleet and {Customer-B} is ZZAUTOTEST SSR Other."),
   START("{Sales-rep-C}'s staff record is open in Settings > Staff in a desktop browser at least 1024 px wide")],
  ["Reactivate {Sales-rep-C}'s account.",
   "Open {Customer-A}'s page.",
   "Open {Customer-B}'s page."],
  ["Step 1: {Sales-rep-C}'s account is active again.",
   "Step 2: {Customer-A}'s \"Sales Representative\" reads \"Unassigned\"; {Sales-rep-C} has not been put back.",
   "Step 3: {Customer-B} shows \"Sales Representative - Service Labor\" {Sales-rep-A} and \"Sales Representative - Service Parts\" {Sales-rep-B}, with no Part Sales field; {Sales-rep-C} has not been put back."],
  ["S4-R20", AQ(12)],
  note="The Sales By Representative spec, version 28 (12 Oct 2026, Story 13), says reactivating brings a person back to their customers. Chris Ward ruled on 19 Oct 2026 that they are not put back (answer 12, quoted below); this case follows PRD version 10.")

# 20 Oct 2026, QA lead "2. Yes": a case for Chris Ward's answer 10 (wide touch tablet), which has no PRD v10 sentence of its own.
C("S3-04", "S3", "On a wide touch tablet the card opens expanded with its buttons showing",
  [ADMIN, REPS2, CUST, WO('its one "Sales Representative" field reads {Sales-rep-A}'),
   ("Starting screen: {Work-order-1} is open on a touch tablet with no mouse, held so its screen is at least 1024 px wide.",
    "For example: an iPad Pro 12.9-inch in landscape.")],
  ["Look at the work order card as it first opens, without tapping anything.",
   "Tap the + button.",
   "Tap \"Sales Representative - Parts\"."],
  ["Step 1: the card is not collapsed: Lead Technician, Service Advisor and the Sales Representative field show without tapping the card's edit button. The field shows its dropdown arrow and the + button shows beside it at its full size, without any hover.",
   "Step 2: a menu opens.",
   "Step 3: the menu closes and \"Sales Representative - Labor\" and \"Sales Representative - Parts\" show, in that order. Without tapping them, both fields show their dropdown arrow, and the remove x shows beside \"Sales Representative - Parts\", without any hover."],
  [AQ(10), "S3-R2", "S3-R4", "S2-R5"],
  note="Chris Ward's answer 10 chose option (a) of the question sheet: on a wide touch screen with no mouse the card opens expanded, with the + and remove x always shown. Touch decides the buttons; the screen width decides whether the card is collapsed.")


# ---------------- 22 Oct 2026, tech plan pass (Rule 134): new cases ----------------
C("S4-27", "S4", "A part sale split off another keeps its representative",
  [ADMIN, REPS3,
   ('Customer {Customer-A} shows "Sales Representative - Part Sales" {Sales-rep-C}.', "For example: {Customer-A} is ZZAUTOTEST SSR Fleet."),
   ("Part sale {Part-sale-1} for {Customer-A} is open and not invoiced, with Sales Representative {Sales-rep-A} and two parts.", "For example: {Part-sale-1} is P-30001."),
   START("{Part-sale-1} is open in a desktop browser at least 1024 px wide")],
  ["Split {Part-sale-1} with Split Part Sale, moving one part to the new part sale.",
   "Open the new part sale and read its Sales Representative field."],
  ["Step 1: a new part sale is created.",
   "Step 2: its one Sales Representative field reads {Sales-rep-A}, not the customer's {Sales-rep-C}, and there is no + beside it."],
  ["S4-R29", "S2-N2",
   ("Tech plan, Phase 6 files (copy on split and reopen)", "Copy the source's reps + split state")],
  note="Split Part Sale comes from Part Sales Update v1 (SV-10266). If that is not on the build being tested, mark this case Blocked and say so.")

C("S4-28", "S4", "A customers-only user sees the representatives in Edit Customer",
  [('You are signed in as {User-B}, whose role has "Customers — Create & Edit" but neither "Work Orders — View" nor "Work Orders — Create & Edit", at {Location-A}.',
    "For example: {User-B} is ZZAUTOTEST SSR Customers Only with the custom role ZZAUTOTEST SSR Customers Only; {Location-A} is Staging Heavy Duty - 9919."),
   REPS2, ('Staff member {Staff-member-D} is active at {Location-A} with the "Sales Representative" switch off.', "For example: {Staff-member-D} is ZZAUTOTEST Dan Noswitch."),
   CUST, CPAGE],
  ["Open Edit Customer.",
   "Click the Sales Representative field.",
   "Click {Sales-rep-A} in the dropdown.",
   "Save the customer."],
  ["Step 1: the Edit Customer window opens with a Sales Representative field.",
   "Step 2: the dropdown opens and lists the sales representatives; it is not empty and shows no access-denied message. Reading it from top to bottom: \"Unassigned\" is first, then every active sales representative sorted by first name, then last name, A to Z (including {Sales-rep-A} and {Sales-rep-B}); {Staff-member-D} is not listed; there is no search box.",
   "Step 3: the field reads {Sales-rep-A}.",
   "Step 4: the customer saves and its page shows \"Sales Representative\" {Sales-rep-A}."],
  [("Story 4 prerequisites", prd_line("User has 'Customers — Create & Edit' enabled, or 'Work Orders — Create & Edit'")), "S4-R3", "S4-R1",
   ("Tech plan, security considerations (section 9)", "The picker widens to work-order view, work-order create/edit and customer create/edit (D14) — it exposes only names + ids of the organization's active sales reps, which those roles can already see on the card.")])
