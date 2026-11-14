"""Story 9 — Putting customers on tiers (SV-12461), PRD v37 lines 596-672, design page 9 (9.1-9.41) with today's Customers list,
customer page and Edit Customer (Today pictures 9.25, 9.26, 9.27, 9.38). Tech plan rows TPX-17 (Remove asks first), TPX-20 (Edit Customer at
phone width). Batch A, 14 Nov 2026. Customers and tiers are made fresh per case; a case that changes many customers works only on its own.
The channel filter's options follow the PRD (Work orders, Part Sales, Both); the design's "Sales Type" rows are a held design case (Q26)."""
from tp_lib import C, R, B, S, QP, QD, QL, QT
from common import *

K = "S9"
CUST = ("Sign in as an Admin whose role has 'Settings — Parts', 'See Financial Data', 'Customers — View', 'Customers — Create & Edit' and "
        "'View and Manage AP/AR Data'.")
WOU = ("Sign in as an Admin whose role has 'Settings — Parts', 'See Financial Data', 'Customers — View', 'Customers — Create & Edit', "
       "'Work Orders — Order Parts' and 'Work Order Lines — Create & Edit'.")
OPEN_A = "Open customer A's page from Customers."
PENCIL = "Click the edit pencil on the customer card."
CTAB = "Click the Customers tab."
MANAGE = "Click Manage Customers."
REMOVE_TAB = "Click the Remove Customers tab."


def onA(lab, wo="Default", ps="Default", extra=""):
    return customer(lab, f", on {wo} for work orders and {ps} for Part Sales{extra}")


# ---- a customer's two tiers ----------------------------------------------------------------------------------------------------
C("S9-01", K, "A customer's work order and Part Sales tiers are picked separately",
  [CUST, tier("A"), tier("B", "", True), onA("A"), DESK],
  [OPEN_A, PENCIL, "Open the Work Order Tier picker.", "Pick tier A.", SAVE],
  [R(S("S9-R12"), "Customer A's page shows Work Order Tier and Part Sales Tier as 1 · Default on the card."),
   R(S("S9-R3"), "Edit Customer opens with Work Order Tier and Part Sales Tier, both on Default."),
   R(S("S9-R1", "chosen independently from the client's active tiers; an archived tier can't be picked"), "The picker lists the active tiers, tier A among them.", "Tier B, archived, is not in the list."),
   R(S("S9-R1"), "Work Order Tier reads tier A's number and name."),
   R(S("S9-R1", "Changing one never changes the other."), "The card shows Work Order Tier as tier A.", "Part Sales Tier still reads 1 · Default.")],
  pics=["9.31", "9.33", "9.35"])

C("S9-02", K, "New Customer shows both tier fields on Default",
  [CUST, tier("A", ", so the client has more than one active tier"), DESK],
  ["Open Customers.", "Click New Customer.", "Type a name no other customer uses in Name.", SAVE],
  [R(S("S9-R2"), "The Customers list shows."),
   R(S("S9-R2", "New Customer shows both tier fields, set to Default, to users with 'Customers — Create & Edit' (S9-R31). They are the first pricing fields on New Customer"),
     "New Customer shows Work Order Tier and Part Sales Tier, both on Default.", "They are the first pricing fields on the form."),
   R(S("S9-R2"), "The name shows in Name."),
   R(S("S9-R2", "A new customer, an imported one included, starts on Default for both channels."), "The new customer's card shows Work Order Tier 1 · Default and Part Sales Tier 1 · Default.")],
  pics=["9.31"])

C("S9-03", K, "Edit Customer puts the tier fields under Default Shop Supplies",
  [CUST, tier("A", ", so the client has more than one active tier"), onA("A"), DESK],
  [OPEN_A, PENCIL],
  [R(S("S9-R12"), "Customer A's page opens."),
   R(S("S9-R3", "Edit Customer shows the Work Order Tier and Part Sales Tier fields directly under Default Shop Supplies, before Notes."),
     "Work Order Tier and then Part Sales Tier sit directly under Default Shop Supplies.", "Notes comes after Part Sales Tier.")
   + R(S("S9-R3", "None of Edit Customer's existing fields move."), "Every other field is in the same order as in today's Edit Customer (Today picture 9.27).")],
  pics=["9.31", "today:9.27"])

C("S9-04", K, "With only Default the tier fields and tier rows are hidden",
  [CUST, "Use a client whose Tiers list shows only Default (no tier has been made in it).", "Have a new customer for this test, customer A, in that client.", DESK],
  [OPEN_A, PENCIL, "Click Cancel.", "Open Customers.", "Click New Customer."],
  [R(S("S9-R12", "Work Order Tier and Part Sales Tier, each with its number, only when the client has more than one active tier (S9-R31)"),
     "The card's Pricing section shows Labor Rate, Shop Supplies and Tax.", "It shows no Work Order Tier or Part Sales Tier row."),
   R(S("S9-R31", "With only Default, they are hidden and every customer stays on Default."), "Edit Customer opens with Default Shop Supplies and Notes.",
     "No Work Order Tier or Part Sales Tier field shows."),
   R(S("S9-R31"), "Edit Customer closes."), R(S("S9-R31"), "The Customers list shows."),
   R(S("S9-R31", "Edit Customer and New Customer show the tier fields only when the client has more than one active tier."), "New Customer opens with its usual fields.",
     "It shows no tier fields.")],
  pics=["9.37"])

C("S9-05", K, "Tier picker lists tiers by number and finds a number first",
  [CUST, tier("A"), tier("B", ", whose name contains tier A's number (for example Fleet 7 when tier A is number 7)"), onA("A"), DESK],
  [OPEN_A, PENCIL, "Open the Work Order Tier picker.", "Type tier A's number in the picker's search.", "Clear the picker's search.", "Type part of tier B's name in capitals."],
  [R(S("S9-R12"), "Customer A's page opens."), R(S("S9-R3"), "Edit Customer opens."),
   R(S("S9-R30", "The tier pickers list active tiers by number, each shown as its number and name, for example \"4 · Fleet\"."),
     "The picker lists the active tiers in number order, each as its number, \" · \" and its name, 1 · Default first."),
   R(S("S19-R18", "a typed whole number matches that tier number exactly and lists it first, then the tiers whose names contain the text"),
     "Tier A is listed first.", "Tier B follows, because its name contains the typed number."),
   R(S("S9-R30"), "Every active tier is listed again."),
   R(S("S9-R30", "The picker's search matches the number or the name (S19-R18)."), "Tier B is listed, matched by its name in any letter case.")],
  pics=["9.32", "9.33"])

# ---- the customer page's Pricing section ---------------------------------------------------------------------------------------
C("S9-06", K, "The customer card shows a Pricing section under IBS, in order",
  [CUST, tier("A"), tier("B"), "Have a tax set up for this test in Settings, tax A, named for example GST 5%.",
   onA("A", "tier A", "tier B", ", with Default Shop Supplies set to No shop supplies and tax A picked"), DESK],
  [OPEN_A],
  [R(S("S9-R12", "The customer page shows the customer's pricing, read-only, in a section of its customer card headed \"Pricing\", under IBS."),
     "Below IBS the card shows a section headed Pricing, with no edit boxes.")
   + R(S("S9-R12", "Shop Supplies: \"No shop supplies\", the customer's own charge, or \"Location default\""), "The rows read, in order: Labor Rate, Shop Supplies reading \"No shop supplies\", Tax, Work Order Tier and Part Sales Tier.")
   + R(S("S9-R12", "Tax: the name of the tax picked on the customer, exactly as the client named it in Settings"), "Tax reads tax A's name as it is written in Settings.")
   + R(S("S9-R12", "Work Order Tier and Part Sales Tier, each with its number"), "Work Order Tier reads tier A's number and name; Part Sales Tier reads tier B's number and name.")],
  pics=["9.29", "9.30", "today:9.26"])

C("S9-07", K, "Pricing section shows Location default and Default Tax Settings",
  [CUST, onA("A", extra=", with Default Shop Supplies on Location default and no tax picked"), DESK],
  [OPEN_A],
  [R(S("S9-R12", "Shop Supplies: \"No shop supplies\", the customer's own charge, or \"Location default\""), "Shop Supplies reads \"Location default\".")
   + R(S("S9-R12", "or \"Default Tax Settings\" when none is picked, as on Edit Customer"), "Tax reads \"Default Tax Settings\".")],
  pics=["9.36"])

C("S9-08", K, "Labor Rate says Varies by location when another location differs",
  [CUST, "Use a client with two locations, location 1 and location 2, and be signed in at location 1.",
   onA("A", extra=", with one labor rate at location 1 (for example Heavy Duty) and a different one at location 2 (for example Light Duty)"), DESK],
  [OPEN_A],
  [R(S("S9-R12", "Labor Rate: the rate at the user's current location, with \"Varies by location\" when the customer's rate differs at another location"),
     "Labor Rate reads location 1's rate (for example Heavy Duty).", "Under it the card reads \"Varies by location\".")],
  pics=["9.30"])

C("S9-09", K, "The card's own edit icon opens Edit Customer",
  [CUST, tier("A", ", so the client has more than one active tier and the tier fields show"), onA("A"), DESK],
  [OPEN_A, PENCIL],
  [R(S("S9-R14"), "Customer A's page shows the card with its edit pencil."),
   R(S("S9-R14", "The card's own edit icon opens Edit Customer, where tiers, labor rate and shop supplies are changed, as today."),
     "Edit Customer opens with Default Labor Rate, Default Shop Supplies, Work Order Tier and Part Sales Tier.")],
  pics=["9.31"])

C("S9-10", K, "Without View and Manage AP/AR Data the Pricing section is hidden",
  ["Sign in as a user whose role has 'Customers — View' and 'Customers — Create & Edit' but not 'View and Manage AP/AR Data'. An Admin makes the records below before the test.",
   tier("A", ", so the client has more than one active tier"), onA("A", "tier A"), DESK],
  [OPEN_A, PENCIL, "Open the Work Order Tier picker.", "Pick 1 · Default.", SAVE],
  [R(S("S9-R15", "The whole pricing section, tiers included, shows only to users with 'View and Manage AP/AR Data'."),
     "The card shows customer A's other rows (address, phone).", "It shows no Pricing section and no tier rows."),
   R(S("S9-R15", "Changing tiers in Edit Customer needs only 'Customers — Create & Edit'."), "Edit Customer opens with Work Order Tier reading tier A."),
   R(S("S9-R30"), "The picker lists the active tiers."), R(S("S9-R1"), "Work Order Tier reads 1 · Default."),
   R(S("S9-R15", "Changing tiers in Edit Customer needs only 'Customers — Create & Edit'."), "The customer saves with no permission message.", "The card still shows no Pricing section.")],
  pics=["9.30", "9.31"])

C("S9-11", K, "Pricing rows show for a customer with no address",
  [CUST, tier("A", ", so the client has more than one active tier"), onA("A", extra=", with no address and an IBS value"), DESK],
  [OPEN_A],
  [R(S("S9-R16", "The pricing rows show even when the customer has no address."), "The card's Pricing section shows Labor Rate, Shop Supplies, Tax and both tier rows.")
   + R(S("S9-R16", "Today the card hides every row, IBS included, for a customer with no address."), "The card's other rows, IBS included, stay hidden as today.")],
  pics=["9.30", "today:9.26"])

# ---- a tier's Customers tab --------------------------------------------------------------------------------------------------
C("S9-12", K, "A tier's Customers tab lists its customers with their channels",
  [ADMIN_CUST, tier("A"), onA("A", "tier A", "tier A"), onA("B", "tier A", "Default"), onA("C", "Default", "Default"), DESK],
  [TIERS, open_tier("A"), CTAB, "Open customer A's row."],
  [R(S("S9-R4"), "The Tiers list shows tier A."), R(S("S9-R4"), "Tier A's page opens with Pricing and Customers tabs."),
   R(S("S9-R4", "A tier's Customers tab lists its customers with their channel(s)."), "The tab lists customer A with both channels and customer B with work orders.",
     "Customer C is not listed (it is on Default for both channels)."),
   R(S("S9-R5", "A customer's row on a tier's Customers tab has no actions menu."), "Customer A's row shows its name and channels.", "The row offers no actions menu.")],
  pics=["9.1"])

C("S9-13", K, "Manage Customers opens with Add and Remove tabs",
  [ADMIN_CUST, tier("A"), onA("A", "tier A", "tier A"), onA("B", "tier A", "Default"), onA("C"), DESK],
  [TIERS, open_tier("A"), CTAB, MANAGE, REMOVE_TAB],
  [R(S("S9-R4"), "The Tiers list shows tier A."), R(S("S9-R4"), "Tier A's page opens."), R(S("S9-R4", "Manage Customers can be opened at any time."), "The Customers tab shows Manage Customers."),
   R(S("S9-R4", "Add Customers lists every customer who isn't on the tier for at least one channel"), "A dialog opens on Add Customers.",
     "It lists customer B (not on tier A for Part Sales) and customer C.", "It does not list customer A, already on tier A for both channels.")
   + R(S("S9-R4", "Each row shows the customer's current work order and Part Sales tiers."), "Each row shows the customer's Work Order Tier and Part Sales Tier."),
   R(S("S9-R4", "Remove Customers lists the customers on the tier, with the count."), "The Remove Customers tab shows a count of 2 (customers A and B: 1 + 1 = 2) and lists customers A and B.")],
  pics=["9.4", "9.16"], flags=["numbers"])

C("S9-14", K, "Each Manage Customers tab explains itself in a tooltip",
  [ADMIN_CUST, tier("A"), DESK],
  [TIERS, open_tier("A"), CTAB, MANAGE, "Point at the Add Customers tab title."],
  [R(S("S9-R17"), "The Tiers list shows tier A."), R(S("S9-R17"), "Tier A's page opens."), R(S("S9-R17"), "The Customers tab shows Manage Customers."),
   R(S("S9-R17", "with no message above the list"), "The dialog shows the search and the list.", "No message shows above the list."),
   R(S("S9-R17", "Each Manage Customers tab says what it does in a tooltip on its title"), "A tooltip on the tab title says what the tab does.")],
  pics=["9.4", "9.5"])

C("S9-15", K, "Ticking customers shows the dark bulk bar above the search",
  [ADMIN_CUST, tier("A"), onA("A"), onA("B"), DESK],
  [TIERS, open_tier("A"), CTAB, MANAGE, "Tick customer A.", "Tick customer B.", "Click the X in the bar."],
  [R(S("S9-R18"), "The Tiers list shows tier A."), R(S("S9-R18"), "Tier A's page opens."), R(S("S9-R18"), "The Customers tab shows Manage Customers."), R(S("S9-R18"), "The Add Customers tab lists customers A and B."),
   R(S("S9-R18", "Ticking customers shows the design system's dark bulk action bar at the top of the dialog, above the search and the list"), "A dark bar appears at the top of the dialog, above the search."),
   R(S("S9-R18", "\"3 selected\";"), "The bar reads \"2 selected\".")
   + R(S("S9-R18", "Select All, with the number of customers in the list, while not every customer is ticked"), "It shows Select All with the number of customers in the list.")
   + R(S("S9-R18", "a Work Orders checkbox and a Part Sales checkbox;"), "It shows a Work Orders checkbox and a Part Sales checkbox, both checked."),
   R(S("S9-R18", "the X that clears the selection."), "The bar is gone.", "Customers A and B are unticked and still listed.")],
  pics=["9.6"])

C("S9-16", K, "Bar channel boxes show checked or mixed and set every ticked row",
  [ADMIN_CUST, tier("A"), onA("A"), onA("B"), DESK],
  [TIERS, open_tier("A"), CTAB, MANAGE, "Tick customer A.", "Tick customer B.", "Untick Part Sales on customer B's row.", "Click the Part Sales checkbox in the bar."],
  [R(S("S9-R19"), "The Tiers list shows tier A."), R(S("S9-R19"), "Tier A's page opens."), R(S("S9-R19"), "The Customers tab shows Manage Customers."), R(S("S9-R19"), "The Add Customers tab shows."),
   R(S("S9-R19"), "Customer A is ticked."),
   R(S("S9-R19", "A channel checkbox in the bar is checked when every ticked customer has that channel"), "The bar's Part Sales checkbox is checked."),
   R(S("S9-R19", "and mixed when only some do"), "The bar's Part Sales checkbox shows mixed.", "The bar's Work Orders checkbox is still checked."),
   R(S("S9-R19", "Checking or clearing it sets that channel on every customer ticked at that moment."), "Part Sales is set on both customer A's and customer B's rows.", "The bar's Part Sales checkbox is checked.")],
  pics=["9.6", "9.7"])

C("S9-17", K, "A customer ticked afterwards starts with both channels",
  [ADMIN_CUST, tier("A"), onA("A"), onA("B"), DESK],
  [TIERS, open_tier("A"), CTAB, MANAGE, "Tick customer A.", "Click the Part Sales checkbox in the bar.", "Tick customer B."],
  [R(S("S9-R20"), "The Tiers list shows tier A."), R(S("S9-R20"), "Tier A's page opens."), R(S("S9-R20"), "The Customers tab shows Manage Customers."), R(S("S9-R20"), "The Add Customers tab shows."),
   R(S("S9-R20"), "Customer A's row has Work Orders and Part Sales set."), R(S("S9-R19"), "Customer A's Part Sales is cleared."),
   R(S("S9-R20", "A customer ticked afterwards starts with both channels it isn't on yet, until it is changed on its row or in the bar."),
     "Customer B's row has both Work Orders and Part Sales set.", "Customer A keeps Work Orders only.")],
  pics=["9.7", "9.10"])

C("S9-18", K, "A channel the customer is already on shows locked",
  [ADMIN_CUST, tier("A"), onA("A", "tier A", "Default"), DESK],
  [TIERS, open_tier("A"), CTAB, MANAGE, "Tick customer A."],
  [R(S("S9-R21"), "The Tiers list shows tier A."), R(S("S9-R21"), "Tier A's page opens."), R(S("S9-R21"), "The Customers tab shows Manage Customers."), R(S("S9-R21"), "The Add Customers tab lists customer A."),
   R(S("S9-R21", "Each ticked row has its own Work Orders and Part Sales chips."), "Customer A's row shows Work Orders and Part Sales.")
   + R(S("S9-R21", "on Add, a channel the customer is already on"), "Work Orders shows locked: grayed, reading just \"Work Orders\" with no added words.")
   + R(S("S9-R21"), "Part Sales can still be set.")],
  pics=["9.11"])

C("S9-19", K, "Adding customers sums up the change and names the count",
  [ADMIN_CUST, tier("A"), onA("A"), onA("B"), onA("C"), DESK],
  [TIERS, open_tier("A"), CTAB, MANAGE, "Tick customer A.", "Tick customer B.", "Tick customer C.", "Untick Part Sales on customer C's row.", "Click Add 3 Customers.", CTAB],
  [R(S("S9-R23"), "The Tiers list shows tier A."), R(S("S9-R23"), "Tier A's page opens."), R(S("S9-R23"), "The Customers tab shows Manage Customers."),
   R(S("S9-N1", "With nobody ticked, the footer says \"No customers picked yet.\" and the button is off."), "The footer reads \"No customers picked yet.\"", "The add button is off."),
   R(S("S9-R23"), "Customer A is ticked."), R(S("S9-R23"), "Customer B is ticked."), R(S("S9-R23"), "Customer C is ticked with both channels."),
   R(S("S9-R23", "The footer sums up the change (\"Adding 3 customers: 2 for both, 1 for Work Orders only.\"). The button names the count: \"Add 3 Customers\""),
     "The footer reads \"Adding 3 customers: 2 for both, 1 for Work Orders only.\" (2 + 1 = 3).", "The button reads \"Add 3 Customers\"."),
   R(S("S9-R5"), "The dialog closes."),
   R(S("S9-R4"), "Tier A's Customers tab lists customers A and B for both channels and customer C for work orders.")],
  pics=["9.6", "9.7", "9.14", "9.15"], flags=["numbers"])

C("S9-20", K, "Removing a customer asks first and puts them back on Default",
  [ADMIN_CUST, tier("A"), onA("A", "tier A", "tier A"), onA("B", "tier A", "tier A"), DESK],
  [TIERS, open_tier("A"), CTAB, MANAGE, REMOVE_TAB, "Tick customer A.", "Click Remove 1 Customer.", "Click Remove in the question.", OPEN_A],
  [R(S("S9-R22"), "The Tiers list shows tier A."), R(S("S9-R22"), "Tier A's page opens."), R(S("S9-R22"), "The Customers tab lists customers A and B."), R(S("S9-R4"), "The dialog opens on Add Customers."),
   R(S("S9-R4"), "The Remove Customers tab lists customers A and B with the count 2."),
   R(S("S9-R23", "on Remove, a red \"Remove 2 Customers\""), "The footer sums up the removal.", "The button reads \"Remove 1 Customer\" in red."),
   R(QT("Remove n Customers?\" confirm per design 9.17", "TPX-17"), "A question titled \"Remove 1 Customer?\" opens before anything is removed."),
   R(S("S9-R22"), "Tier A's Customers tab lists customer B.", "Customer A is no longer listed."),
   R(S("S9-R22", "A removed customer goes back to Default for that channel."), "Customer A's card shows Work Order Tier 1 · Default and Part Sales Tier 1 · Default.")],
  pics=["9.16", "9.17", "9.18", "9.19", "9.20"])

C("S9-21", K, "Switching tabs clears the picks",
  [ADMIN_CUST, tier("A"), onA("A"), DESK],
  [TIERS, open_tier("A"), CTAB, MANAGE, "Tick customer A.", REMOVE_TAB, "Click the Add Customers tab."],
  [R(S("S9-R24"), "The Tiers list shows tier A."), R(S("S9-R24"), "Tier A's page opens."), R(S("S9-R24"), "The Customers tab shows Manage Customers."), R(S("S9-R24"), "The Add Customers tab shows."),
   R(S("S9-R24"), "The bar reads \"1 selected\"."), R(S("S9-R24"), "The Remove Customers tab shows with no customer ticked."),
   R(S("S9-R24", "Switching tabs clears the picks."), "Customer A is listed and unticked.", "The footer reads \"No customers picked yet.\"")],
  pics=["9.4", "9.16"])

C("S9-22", K, "Adding for a channel takes the customer off the tier they were on",
  [ADMIN_CUST, tier("A"), tier("B"), onA("A", "tier B", "tier B"), DESK],
  [TIERS, open_tier("A"), CTAB, MANAGE, "Tick customer A.", "Untick Part Sales on customer A's row.", "Click Add 1 Customer.", TIERS, open_tier("B"), CTAB],
  [R(S("S9-R5"), "The Tiers list shows tier A."), R(S("S9-R5"), "Tier A's page opens."), R(S("S9-R5"), "The Customers tab shows Manage Customers."),
   R(S("S9-R4"), "Customer A is listed with Work Order Tier and Part Sales Tier both on tier B."), R(S("S9-R5"), "Customer A is ticked."), R(S("S9-R5"), "Customer A keeps Work Orders."),
   R(S("S9-R5"), "The dialog closes and customer A shows on tier A for work orders."), R(S("S9-R5"), "The Tiers list shows tier B."), R(S("S9-R5"), "Tier B's page opens."),
   R(S("S9-R5", "There, adding a customer for a channel takes them off the tier they were on for that channel (S9-R1)."),
     "Tier B's Customers tab lists customer A for Part Sales.", "Customer A is no longer on tier B for work orders.")],
  pics=["9.14", "9.15"])

C("S9-23", K, "Moving a customer keeps open work orders on their tier and prices",
  [WOU, tier("A"), "Have a new matrix for this test, matrix A, pricing a new category made for this test, category A, with one range from $0.00: Default Markup % 50, tier A Markup % 20.",
   onA("A"), "Have a new work order for this test, work order 1, for customer A, with a category A part line at a cost of $10.00.", DESK],
  [OPEN_A, PENCIL, "Open the Work Order Tier picker.", "Pick tier A.", SAVE, "Open work order 1.", "Add a category A part to work order 1 at a cost of $20.00.",
   "Create a new work order for customer A.", "Add a category A part to the new work order at a cost of $20.00."],
  [R(S("S9-R7"), "Customer A's page opens."), R(S("S9-R7"), "Edit Customer opens."), R(S("S9-R30"), "The picker lists tier A."), R(S("S9-R1"), "Work Order Tier reads tier A."),
   R(S("S9-R7", "The dialog says \"Existing work orders and Part Sales keep their prices and tier.\""), "The card shows tier A for work orders.",
     "The message reads \"Existing work orders and Part Sales keep their prices and tier.\""),
   R(S("S9-R7", "their prices stay (S11-R6)"), "Work order 1's first part still sells at $15.00 ($10.00 × 1.50 = $15.00, Default).", "Its price shows no Manual icon."),
   R(S("S9-R27", "their open work orders and Part Sales keep the tier they were made with, for parts added later too (S10-R14), and their lines show no Manual icon"),
     "The new part on work order 1 sells at $30.00 ($20.00 × 1.50 = $30.00): work order 1 still uses Default.", "It shows no Manual icon."),
   R(S("S9-R7"), "The new work order opens for customer A."),
   R(S("S9-R7", "open ones keep the tier they were made with (S10-R14)"), "The part on the new work order sells at $24.00 ($20.00 × 1.20 = $24.00): new work orders use tier A.")],
  pics=["9.33", "9.35"], flags=["numbers"])

C("S9-24", K, "A work order tier change leaves Part Sales on their tier",
  [WOU, tier("A"), "Have a new matrix for this test, matrix A, pricing a new category made for this test, category A, with one range from $0.00: Default Markup % 50, tier A Markup % 20.",
   onA("A"), DESK],
  [OPEN_A, PENCIL, "Open the Work Order Tier picker.", "Pick tier A.", SAVE, "Create a new Part Sale for customer A.", "Add a category A part to the Part Sale at a cost of $20.00."],
  [R(S("S9-R27"), "Customer A's page opens."), R(S("S9-R27"), "Edit Customer opens."), R(S("S9-R30"), "The picker lists tier A."), R(S("S9-R1"), "Work Order Tier reads tier A."),
   R(S("S9-R1"), "The card shows Work Order Tier tier A and Part Sales Tier 1 · Default."), R(S("S9-R27"), "The Part Sale opens for customer A."),
   R(S("S9-R27", "only on that channel: a work order tier change doesn't affect Part Sales"), "The part sells at $30.00 ($20.00 × 1.50 = $30.00, Default).", "It is not priced at tier A's $24.00.")],
  nopic="no design board draws a Part Sale after a work order tier change", flags=["numbers"])

C("S9-25", K, "The built-in Counter Sale customer can go on a tier, with a tooltip",
  [CUST, tier("A"), "Have a new customer for this test, customer A, named Counter Sale by the client.", DESK],
  ["Open the built-in Counter Sale customer's page.", PENCIL, "Point at the Work Order Tier field.", "Open the Work Order Tier picker.", "Pick tier A.", SAVE, OPEN_A, PENCIL, "Point at the Work Order Tier field.",
   "Click Cancel.", "Open the built-in Counter Sale customer's page.", PENCIL, "Open the Work Order Tier picker.", "Pick 1 · Default.", SAVE],
  [R(S("S9-R8"), "The built-in Counter Sale customer's page opens."), R(S("S9-R8", "can be put on a tier for work orders and for Part Sales, like any customer"), "Edit Customer shows Work Order Tier and Part Sales Tier."),
   R(S("S9-R8", "Edit Customer shows a tooltip on this customer's tier fields: \"Every walk-in sale uses this tier.\""), "A tooltip reads \"Every walk-in sale uses this tier.\""),
   R(S("S9-R30"), "The picker lists tier A."), R(S("S9-R8"), "Work Order Tier reads tier A."), R(S("S9-R8"), "The card shows Work Order Tier as tier A."),
   R(S("S9-R8"), "Customer A's page opens."), R(S("S9-R8"), "Edit Customer shows the tier fields."),
   R(S("S9-R8", "a client-created customer, even one named Counter Sale, is an ordinary customer"), "No \"Every walk-in sale uses this tier.\" tooltip shows.", "The Work Order Tier field shows as on any customer."),
   R(S("S9-R8"), "Edit Customer closes."), R(S("S9-R8"), "The built-in Counter Sale customer's page opens."), R(S("S9-R8"), "Edit Customer opens."), R(S("S9-R30"), "The picker lists 1 · Default."),
   R(S("S9-R8"), "Work Order Tier reads 1 · Default."), R(S("S9-R8"), "The card shows Work Order Tier 1 · Default again.")],
  pics=["9.36"])

C("S9-26", K, "Customers tab search and channel filter narrow the list",
  [ADMIN_CUST, tier("A"), "Have a new customer for this test, customer A, named for example Quokka Hauling, on tier A for work orders and Part Sales.",
   onA("B", "tier A", "Default"), onA("C", "Default", "tier A"), DESK],
  [TIERS, open_tier("A"), CTAB, "Type quokka in the search.", "Clear the search.", "Open the channel filter.", "Pick Part Sales."],
  [R(S("S9-R9"), "The Tiers list shows tier A."), R(S("S9-R9"), "Tier A's page opens."), R(S("S9-R9"), "The tab lists customers A, B and C."),
   R(S("S9-R9", "search by customer name"), "Customer A is listed.", "Customers B and C are hidden."), R(S("S9-R9"), "Customers A, B and C are listed again."),
   R(S("S9-R9", "a channel filter (Work orders, Part Sales, Both)"), "The filter offers Work orders, Part Sales and Both."),
   R(S("S9-R9", "a channel filter (Work orders, Part Sales, Both)"), "Customer C is listed.", "Customer B (on tier A for work orders, Default for Part Sales) is hidden.")],
  pics=["9.1", "9.3"])

C("S9-27", K, "Customers tab sorts by name, and by channel with ties by name",
  [ADMIN_CUST, tier("A"), "Have a new customer for this test, customer A, named for example Aardvark Haulers, on tier A for work orders and Part Sales.",
   "Have a new customer for this test, customer B, named for example Mongoose Co, on tier A for work orders and Default for Part Sales.",
   "Have a new customer for this test, customer C, named for example Zebra Fleet, on tier A for work orders and Part Sales.", DESK],
  [TIERS, open_tier("A"), CTAB, "Click the channel column header."],
  [R(S("S9-R9"), "The Tiers list shows tier A."), R(S("S9-R9"), "Tier A's page opens."),
   R(S("S9-R9", "sorting by customer name, A to Z by default"), "Customers A, B and C are listed A to Z by name."),
   R(S("S9-R9", "a sortable channel column, with ties broken by customer name"), "The list is grouped by channel.", "Customers A and C, with the same channels, stay in name order: A before C.")],
  pics=["9.1"])

C("S9-28", K, "Customers tab shows 50 a page and keeps search, filter and page",
  [ADMIN_CUST, tier("A"), "Have at least 51 customers on tier A for work orders (put customers made for this test on it if needed).", DESK],
  [TIERS, open_tier("A"), CTAB, "Go to the second page.", TIERS, open_tier("A"), CTAB],
  [R(S("S9-R9"), "The Tiers list shows tier A."), R(S("S9-R9"), "Tier A's page opens."), R(S("S9-R9", "50 customers a page"), "The first page lists 50 customers."),
   R(S("S9-R9", "50 customers a page"), "The second page lists the rest (51 − 50 = 1 or more)."), R(S("S9-R9"), "The Tiers list shows."), R(S("S9-R9"), "Tier A's page opens."),
   R(S("S9-R9", "Its search, filters, sort and page are kept when the user comes back."), "The Customers tab opens on the second page again.", "The same customers as before are listed.")],
  pics=["9.1"], flags=["numbers"])

C("S9-29", K, "Manage Customers search finds customers by their tier's name",
  [ADMIN_CUST, tier("A"), tier("B", ", named for example Fleet Platinum"), onA("A", "tier B", "Default"), onA("B"), DESK],
  [TIERS, open_tier("A"), CTAB, MANAGE, "Type part of tier B's name in the search (for example platinum)."],
  [R(S("S9-R10"), "The Tiers list shows tier A."), R(S("S9-R10"), "Tier A's page opens."), R(S("S9-R10"), "The Customers tab shows Manage Customers."), R(S("S9-R10"), "The Add Customers tab lists customers A and B."),
   R(S("S9-R10", "Its search matches the customer's name and the names of their current work order and Part Sales tiers, so typing \"Fleet\" finds the customers on Fleet."),
     "Customer A, on tier B for work orders, is listed.", "Customer B, on Default, is hidden.")],
  pics=["9.12"])

C("S9-30", K, "Manage Customers loads 50 at a time and Select All covers every match",
  [ADMIN_CUST, tier("A"), "Use a client with more than 60 customers who are not on tier A (customers made for this test count).", DESK],
  [TIERS, open_tier("A"), CTAB, MANAGE, "Scroll to the bottom of the list.", "Tick the first customer."],
  [R(S("S9-R10"), "The Tiers list shows tier A."), R(S("S9-R10"), "Tier A's page opens."), R(S("S9-R10"), "The Customers tab shows Manage Customers."),
   R(S("S9-R10", "It has no paging: it loads 50 customers at a time as the user scrolls in the dialog."), "The dialog opens with no page buttons."),
   R(S("S9-R10", "it loads 50 customers at a time as the user scrolls in the dialog"), "More customers load after the first 50 as you scroll."),
   R(S("S9-R10", "The tab count and Select all cover every customer the search matches, loaded or not."), "Select All shows the number of every customer in the list, more than 60, counting those not yet loaded.")],
  pics=["9.9"])

C("S9-31", K, "Customers list itself is unchanged",
  [CUST, tier("A"), onA("A", "tier A", "tier A"), DESK],
  ["Open Customers."],
  [R(S("S9-R11", "The Customers list is unchanged. A customer's tiers are seen on the customer page, in Edit Customer and on a tier's Customers tab."),
     "The Customers list shows the same columns as today (Today picture 9.25).", "It has no tier column, and customer A's row shows no tier.")],
  pics=["9.28", "today:9.25"])

C("S9-32", K, "A ticked customer with no channel blocks the button",
  [ADMIN_CUST, tier("A"), onA("A"), DESK],
  [TIERS, open_tier("A"), CTAB, MANAGE, "Tick customer A.", "Untick Work Orders on customer A's row.", "Untick Part Sales on customer A's row."],
  [R(S("S9-N1"), "The Tiers list shows tier A."), R(S("S9-N1"), "Tier A's page opens."), R(S("S9-N1"), "The Customers tab shows Manage Customers."), R(S("S9-N1"), "The Add Customers tab shows."),
   R(S("S9-N1"), "Customer A is ticked with both channels."), R(S("S9-N1"), "Customer A keeps Part Sales."),
   R(S("S9-N1", "A ticked customer with neither Work Orders nor Part Sales shows \"Pick Work Orders, Part Sales or both.\" and the button stays off."),
     "Customer A's row shows \"Pick Work Orders, Part Sales or both.\"", "The add button is off.")],
  pics=["9.8"])

C("S9-33", K, "Closing Manage Customers without saving changes nothing",
  [ADMIN_CUST, tier("A"), onA("A"), DESK],
  [TIERS, open_tier("A"), CTAB, MANAGE, "Tick customer A.", "Click Cancel."],
  [R(S("S9-N3"), "The Tiers list shows tier A."), R(S("S9-N3"), "Tier A's page opens."), R(S("S9-N3"), "The Customers tab shows Manage Customers with no customer A."),
   R(S("S9-N3"), "The Add Customers tab shows."), R(S("S9-N3"), "Customer A is ticked."),
   R(S("S9-N3", "Closing Manage Customers without saving changes nothing."), "The dialog closes.", "Tier A's Customers tab still does not list customer A.")],
  pics=["9.4"])

C("S9-34", K, "No-match searches and an empty Remove tab say so",
  [ADMIN_CUST, tier("A", ", with no customers"), DESK],
  [TIERS, open_tier("A"), CTAB, "Type zzqqzz in the search.", MANAGE, "Type zzqqzz in the dialog's search.", REMOVE_TAB],
  [R(S("S9-N6"), "The Tiers list shows tier A."), R(S("S9-N6"), "Tier A's page opens."), R(S("S9-N6"), "The Customers tab shows."),
   R(S("S9-N6", "a search with no match, on a tier's Customers tab or in Manage Customers: 'No customer matches \"…\".'"), "The tab reads 'No customer matches \"zzqqzz\".'", "Manage Customers is still offered."),
   R(S("S9-N6"), "The dialog opens on Add Customers."),
   R(S("S9-N6", "a search with no match, on a tier's Customers tab or in Manage Customers: 'No customer matches \"…\".'"), "The dialog reads 'No customer matches \"zzqqzz\".'", "Cancel is still offered."),
   R(S("S9-N6", "the Remove tab of an empty tier: \"No customer is on Fleet Platinum yet.\""), "The Remove tab reads \"No customer is on\", tier A's name, \"yet.\"")],
  pics=["9.2", "9.13", "9.24"])

C("S9-35", K, "Deleting a customer with no records removes their tier",
  [ADMIN_CUST, tier("A"), onA("A", "tier A", "tier A", extra=", with no work orders, Part Sales, vehicles, contacts, transactions, payments or credit"),
   onA("B", "tier A", "tier A", extra=", with an open work order, so it cannot be deleted"), DESK],
  [OPEN_A, "Delete customer A from its page.", TIERS, open_tier("A"), CTAB, "Open customer B's page from Customers.", "Delete customer B from its page."],
  [R(S("S9-E3"), "Customer A's page opens."), R(S("S9-E3", "Deleting a customer with none of these removes their tier assignments."), "Customer A is deleted."),
   R(S("S9-E3"), "The Tiers list shows tier A."), R(S("S9-E3"), "Tier A's page opens."),
   R(S("S9-E3", "Deleting a customer with none of these removes their tier assignments."), "Tier A's Customers tab lists customer B.", "Customer A is not listed."),
   R(S("S9-E3"), "Customer B's page opens."),
   R(S("S9-E3", "A customer can't be deleted when they have work orders or Part Sales, vehicles, linked contacts, transactions, payments or open credit, as today."),
     "Customer B is not deleted: the delete is refused as today.", "Customer B's page still shows.")],
  nopic="no design board draws deleting a customer")

C("S9-36", K, "Select All skips customers already on the tier for that channel",
  [ADMIN_CUST, tier("A"), "Have a new customer for this test, customer A, named for example Quokka One, on tier A for work orders and Default for Part Sales.",
   "Have a new customer for this test, customer B, named for example Quokka Two, on Default for both channels.", DESK],
  [TIERS, open_tier("A"), CTAB, MANAGE, "Type quokka in the search.", "Tick customer B.", "Click the Part Sales checkbox in the bar.", "Click Select All.", "Click the Part Sales checkbox in the bar."],
  [R(S("S9-E5"), "The Tiers list shows tier A."), R(S("S9-E5"), "Tier A's page opens."), R(S("S9-E5"), "The Customers tab shows Manage Customers."), R(S("S9-E5"), "The Add Customers tab shows."),
   R(S("S9-E5"), "Customers A and B are listed."), R(S("S9-E5"), "Customer B is ticked with both channels."), R(S("S9-E5"), "Customer B keeps Work Orders."),
   R(S("S9-E5", "On the Add tab, Select All and a channel checked in the bar leave out any customer already on the tier for every channel picked."),
     "Customer A is not ticked (already on tier A for work orders).", "Customer B stays ticked.")
   + R(S("S9-E5", "the footer says how many were skipped (\"12 skipped: already on Fleet Platinum for Work Orders.\")"), "The footer adds \"1 skipped: already on\", tier A's name, \"for Work Orders.\" (2 listed − 1 ticked = 1 skipped)")
   + R(S("S9-E5", "They never block Save."), "The add button is on."),
   R(S("S9-E5", "A customer can still be ticked for a channel they aren't on yet."), "Customer A can now be ticked for Part Sales.", "Customer B is still ticked.")],
  pics=["9.9", "9.10", "9.11"], flags=["numbers"])

C("S9-37", K, "The Remove tab skips customers not on the tier for that channel",
  [ADMIN_CUST, tier("A"), onA("A", "tier A", "tier A"), onA("B", "tier A", "Default"), DESK],
  [TIERS, open_tier("A"), CTAB, MANAGE, REMOVE_TAB, "Tick customer A.", "Click Select All.", "Untick Work Orders in the bar.", "Click the Part Sales checkbox in the bar."],
  [R(S("S9-E7"), "The Tiers list shows tier A."), R(S("S9-E7"), "Tier A's page opens."), R(S("S9-E7"), "The Customers tab shows Manage Customers."), R(S("S9-E7"), "The Add Customers tab shows."),
   R(S("S9-E7"), "The Remove tab lists customers A and B."), R(S("S9-E7"), "Customer A is ticked."),
   R(S("S9-E7"), "Customers A and B are ticked."),
   R(S("S9-R19", "On the Remove tab, it sets the channels to take them off."), "Work Orders is cleared on both rows."),
   R(S("S9-E7", "The Remove tab works the same way: customers who aren't on the tier for any channel picked are left out. On both tabs, checking a channel in the bar again skips again."),
     "Customer B is left out (not on tier A for Part Sales).", "Customer A stays ticked for Part Sales.")
   + R(S("S9-E7", "A customer ticked by hand stays ticked for the channels they can still use."), "The footer sums up removing customer A for Part Sales.")],
  pics=["9.16", "9.17"])

C("S9-38", K, "Edit Customer works on a phone with the tier fields stacked",
  [CUST, tier("A"), onA("A"), "Use a phone, or a browser window narrower than 768 pixels."],
  [OPEN_A, PENCIL, "Tap Work Order Tier.", "Tap tier A.", "Tap Save."],
  [R(S("S9-R3"), "Customer A's page opens."),
   R([S("S9-R3", "Edit Customer shows the Work Order Tier and Part Sales Tier fields directly under Default Shop Supplies, before Notes."), QT("and the phone width for Edit Customer", "TPX-20")],
     "Edit Customer opens with the fields stacked one under another.", "Work Order Tier and Part Sales Tier sit under Default Shop Supplies, before Notes."),
   R(S("S9-R30", "The tier pickers list active tiers by number"), "The picker lists the active tiers by number, tier A among them."),
   R(S("S9-R1"), "Work Order Tier reads tier A."), R(S("S9-R1"), "The customer saves; the card shows tier A for work orders.")],
  pics=["9.39", "9.40", "9.41", "today:9.38"])
