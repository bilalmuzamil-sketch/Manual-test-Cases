"""Story 8 — "Service For" band on invoices and estimates (SV-12310).

14 Nov 2026 (named-set update, QA lead's approval after the PRD page was edited on 14 Nov 2026; Rule 134: every case rewritten top to
bottom): the band now reads "SERVICE FOR" on its first line and, on its second, the customer's name, " · " and that customer's own address
in the same weight as the address (S8-R1); the address order and the province/state + postal code that never split (S8-R2); missing parts
drop out, and with no address the name prints alone (S8-R3); the band never repeats the unit, year, make or model, and a part sale prints
the same band (S8-R4); gray fill and border (S8-R5); layouts and documents (S8-R6); the address row left free (S8-R7); an invoice keeps the
name and address it was created with, an estimate shows the current ones (S8-R8); no band when the customer pays for itself (S8-N1);
invoices created before the release (S8-N2, held for production).
S8-09 (a unit already starting "Unit" is not prefixed again) tested a clause the 14 Nov page removed with no successor: it stays as it
was, on PRD version 0.5, and is proposed for deletion (story8-2026-11-14/PASS-REPORT.md). New cases: S8-16 to S8-20."""
from bt_lib import C, HOLD, PRE_REL, MARKER_1114 as M
from common import *

S = "S8"
MODERN = "Make sure the organization's document design setting is the modern layout."
LEGACY = "Make sure the organization's document design setting is the legacy layout."
ADDR = ("with an address on file: street, city, province or state and postal or ZIP code, and no Address 2 "
        "(for example 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3)")
A = cust("A", ", the customer the work is for, " + ADDR)
B = cust("B", ", the payer")
ASSET = 'with an asset whose Unit is "854", Year 2024, Make "International" and Model "CV515"'
LINE1 = 'Directly under the address row, a full-width band prints; its first line reads "SERVICE FOR".'
LINE2 = ("Its second line reads customer A's name, then \" · \", then customer A's address as street, city, province or state and postal "
         "code, separated by commas (for example \"[customer A's name] · 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3\").")
WEIGHT = "Customer A's name is in the same weight as the address after it."
NO_UNIT = ('The band shows no unit, year, make or model: "854" and "2024 International CV515" print only in the asset table below the band.')
BILLTO_B = "The Bill To block names customer B."
OPEN_INV = "Open the invoice's PDF."
OPEN_EST = "Open the estimate's PDF."
EDIT_A = "Open customer A's Edit Customer window."
NOTE = ("Words in square brackets stand for the value they name, such as customer A's name exactly as it is saved; every other word must "
        "match exactly.")


def doc(key, title, layout, status, open_step, kind, q, asset=False):
    C(key, S, title,
      [ADMIN, layout, A, B, wo(1, "A", status, "B", (", " + ASSET) if asset else "")],
      [OPEN_WO, FIN, open_step],
      [["Work order 1 opens for customer A."], [f"The Finance tab shows the {kind}."],
       [BILLTO_B, LINE1, LINE2, WEIGHT] + ([NO_UNIT] if asset else [])],
      q, marker=M, note=NOTE)


doc("S8-01", "Modern invoice prints the two-line Service For band under the address row", MODERN, "invoiced", OPEN_INV, "invoice",
    ["S8-R1", "S8-R2", "S8-R4", "S8-R6", "KD-BAND", "CORE-7"], asset=True)
doc("S8-02", "Legacy invoice prints the two-line Service For band", LEGACY, "invoiced", OPEN_INV, "invoice",
    ["S8-R6", "S8-R1", "S8-R4"], asset=True)
doc("S8-03", "Modern estimate prints the two-line Service For band", MODERN, "in Approved", OPEN_EST, "estimate",
    ["S8-R6", "S8-R1", "KD-BAND"])
doc("S8-04", "Legacy estimate prints the two-line Service For band", LEGACY, "in Approved", OPEN_EST, "estimate",
    ["S8-R6", "S8-R1"])

C("S8-05", S, "The Service For band is light gray with a thin gray border",
  [ADMIN, MODERN, A, B, wo(1, "A", "invoiced", "B")],
  [OPEN_WO, FIN, OPEN_INV, "Print the PDF in black and white."],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the invoice."],
   [BILLTO_B, "The band has a light gray fill and a thin gray border."],
   ["On the black-and-white print the band's fill and border are still visible and both of its lines are readable."]],
  ["S8-R5"], marker=M)


def part(key, title, have, expect):
    C(key, S, title,
      [ADMIN, MODERN, cust("A", ", the customer the work is for, with an address on file " + have), B, wo(1, "A", "invoiced", "B")],
      [OPEN_WO, FIN, OPEN_INV],
      [["Work order 1 opens for customer A."], ["The Finance tab shows the invoice."], [BILLTO_B, LINE1] + expect],
      ["S8-R3", "S8-R2"], marker=M, note=NOTE)


part("S8-06", "A missing street drops out of the band's address with its comma",
     "that has a city, a province or state and a postal or ZIP code but no street (for example Port Peterchester, Yukon Territory Y5P 3K3)",
     ['The second line reads customer A\'s name, " · ", then the city, a comma, then the province or state and the postal code '
      '(for example "[customer A\'s name] · Port Peterchester, Yukon Territory Y5P 3K3").',
      'No comma or empty space shows where the street would be: the address starts with the city, right after " · ".'])
part("S8-07", "A missing postal code drops out of the band's address",
     "that has a street, a city and a province or state but no postal or ZIP code (for example 965 Smith Course, Port Peterchester, Yukon Territory)",
     ['The second line reads customer A\'s name, " · ", then the street, the city and the province or state, separated by commas '
      '(for example "[customer A\'s name] · 965 Smith Course, Port Peterchester, Yukon Territory").',
      "Nothing follows the province or state: no comma and no empty space where the postal code would be."])
part("S8-08", "A missing city drops out of the band's address with its comma",
     "that has a street, a province or state and a postal or ZIP code but no city (for example 965 Smith Course, Yukon Territory Y5P 3K3)",
     ['The second line reads customer A\'s name, " · ", then the street, a comma, then the province or state and the postal code '
      '(for example "[customer A\'s name] · 965 Smith Course, Yukon Territory Y5P 3K3").',
      "No two commas show side by side where the city would be."])

# S8-09 (C1062367) "A unit that already starts with Unit is not prefixed again": DELETED 14 Nov 2026 (QA lead: "Delete it (Recommended)");
# the 14 Nov 2026 page removed the clause it tested. Copy: story8-2026-11-14/applied/C1062367-S8-09-before-delete.json.

PS_LINE2 = LINE2
C("S8-10", S, "A part sale with a vehicle prints the same band, with no unit",
  [ADMIN, MODERN, A, B,
   'Have a new part sale for this test, part sale 1, for customer A, invoiced, billed to customer B, with a vehicle attached whose Unit is '
   '"4417", Year 2011, Make "Hyundai" and Model "Santa Fe".'],
  ["Open part sale 1.", FIN, OPEN_INV],
  [["Part sale 1 opens for customer A."], ["The Finance tab shows the part sale invoice."],
   [BILLTO_B, LINE1, PS_LINE2, WEIGHT, 'The band shows no "4417" and no "2011 Hyundai Santa Fe".']],
  ["S8-R4", "S8-R6", "S8-R1"], marker=M, note=NOTE)
C("S8-11", S, "A part sale without a vehicle prints the same band",
  [ADMIN, LEGACY, A, B, "Have a new part sale for this test, part sale 1, for customer A, invoiced, billed to customer B, with no vehicle attached."],
  ["Open part sale 1.", FIN, OPEN_INV],
  [["Part sale 1 opens for customer A."], ["The Finance tab shows the part sale invoice."], [BILLTO_B, LINE1, PS_LINE2, WEIGHT]],
  ["S8-R4", "S8-R6", "S8-R1"], marker=M, note=NOTE)
C("S8-12", S, "A batch invoice gives each invoice billed to someone else its own band",
  [ADMIN, MODERN, A, B, wo(1, "A", "invoiced", "B"),
   wo(2, "B", "invoiced", None, ", so the batch holds an invoice with no band")],
  ["Open customer B's Invoices tab.", "Tick work order 1's invoice.", "Tick work order 2's invoice.", "Print the ticked invoices as a batch invoice."],
  [["Both invoices are listed."], ["Work order 1's invoice is ticked."], ["Work order 2's invoice is ticked."],
   ['Work order 1\'s pages carry the band: "SERVICE FOR", then customer A\'s name, " · " and customer A\'s address.',
    "Work order 2's pages carry no band."]],
  ["S8-R6", "S8-N1"], marker=M)
C("S8-13", S, "The Service For band leaves the address row as it was",
  [ADMIN, MODERN, A, B, wo(1, "A", "invoiced", "B"),
   wo(2, "B", "invoiced", None, ", so there is an invoice to compare the address row with")],
  [OPEN_WO, FIN, OPEN_INV, "Open work order 2's invoice PDF."],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the invoice."],
   ["The band sits below the address row, not inside it.", "The address row holds the same blocks as on work order 2's invoice, in the same places."],
   ["Work order 2's address row holds the Bill To block naming customer B and the shop's own block, and no band."]],
  ["S8-R7", "OOS-01"], marker=M)
C("S8-14", S, "No band prints when the customer pays for itself",
  [ADMIN, MODERN, cust("A", ", that bills itself, " + ADDR), wo(1, "A", "invoiced")],
  [OPEN_WO, FIN, OPEN_INV],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the invoice."],
   ["The Bill To block names customer A.", 'No "SERVICE FOR" band prints, and customer A\'s address shows only in the Bill To block.']],
  ["S8-N1", "KD-BAND", "CORE-8"], marker=M)
C("S8-15", S, "Invoices created before the release never print the band",
  [ADMIN, "Use the production test account.", cust("A", ", created on production before the release"),
   wo(1, "A", "invoiced on production before the release")],
  [OPEN_WO, FIN, OPEN_INV],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the invoice."],
   ['No "SERVICE FOR" band prints.', "The invoice reads as it did before the release."]],
  ["S8-N2"], marker=PRE_REL)

# ---- new on 14 Nov 2026 ----
C("S8-16", S, "The band's address includes Address 2 after the street",
  [ADMIN, MODERN,
   cust("A", ", the customer the work is for, with an address on file that has a street, an Address 2, a city, a province or state and a "
        "postal or ZIP code (for example 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4)"),
   B, wo(1, "A", "invoiced", "B")],
  [OPEN_WO, FIN, OPEN_INV],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the invoice."],
   [BILLTO_B, LINE1,
    'The second line reads customer A\'s name, " · ", then the street, Address 2, the city, then the province or state and the postal code, '
    'in that order, separated by commas (for example "[customer A\'s name] · 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4").',
    "The province or state and the postal code are separated by a space, not a comma."]],
  ["S8-R2", "S8-R1"], marker=M, note=NOTE)
C("S8-17", S, "With no address on file the band prints the name alone",
  [ADMIN, MODERN, cust("A", ", the customer the work is for, with no address on file (no street, city, province or state, or postal code)"),
   B, wo(1, "A", "invoiced", "B")],
  [OPEN_WO, FIN, OPEN_INV],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the invoice."],
   [BILLTO_B, LINE1, "The second line reads customer A's name alone.", 'No " · " follows the name.']],
  ["S8-R3"], marker=M)
C("S8-18", S, "An invoice keeps the name and address it was created with",
  [ADMIN, MODERN, A, cust("B", ", the payer, so the invoice prints the band"), wo(1, "A", "invoiced", "B")],
  [OPEN_WO, FIN, OPEN_INV, EDIT_A, "Change customer A's name to a new name.", "Change customer A's street to a new street.", SAVE,
   OPEN_WO, FIN, OPEN_INV],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the invoice."],
   ["The band's second line reads customer A's name, \" · \" and customer A's address."],
   ["Customer A's Edit Customer window opens."], ["The name field shows the new name."], ["The street field shows the new street."],
   ["The window closes and customer A's page shows the new name and street."],
   ["Work order 1 opens."], ["The Finance tab shows the invoice."],
   ["The band's second line still reads customer A's old name and old address, exactly as in step 3: the invoice was not changed."]],
  ["S8-R8"], marker=M)
C("S8-19", S, "Changing the work order's customer leaves the invoice's band as it was",
  [ADMIN, MODERN, A, B, cust("C", ", the new customer, that bills itself, with an address different from customer A's"),
   wo(1, "A", "invoiced", "B")],
  [OPEN_WO, FIN, OPEN_INV, EXPAND, "Click Change Customer (the two arrows at the top right of the Customer card).", "Pick customer C.",
   "Confirm the change.", FIN, OPEN_INV],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the invoice."],
   ["The band's second line reads customer A's name, \" · \" and customer A's address."],
   ["The Customer card shows customer A."], ["The customer picker opens."], ["Customer C is picked."],
   ["Work order 1 now shows customer C as its customer."], ["The Finance tab shows the invoice."],
   ["The band's second line still reads customer A's name and customer A's address, exactly as in step 3.",
    "Customer C's name and address are not on the invoice.", BILLTO_B]],
  ["S8-R8", "S6-N1"], marker=M)
C("S8-20", S, "An estimate shows the customer's current address",
  [ADMIN, MODERN, A, cust("B", ", the payer, so the estimate prints the band"), wo(1, "A", "in Approved", "B")],
  [OPEN_WO, FIN, OPEN_EST, EDIT_A, "Change customer A's street to a new street.", SAVE, OPEN_WO, FIN, OPEN_EST],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the estimate."],
   ["The band's second line reads customer A's name, \" · \" and customer A's address."],
   ["Customer A's Edit Customer window opens."], ["The street field shows the new street."], ["The window closes."],
   ["Work order 1 opens."], ["The Finance tab shows the estimate."],
   ["The band's second line now reads customer A's address with the new street."]],
  ["S8-R8"], marker=M)
