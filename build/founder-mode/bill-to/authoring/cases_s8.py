"""Story 8 — "Service For" band on invoices and estimates (SV-12310): the band's place and words, the unit and the year/make/model, parts
that drop out with their separator, a unit already starting "Unit", part sales with and without a vehicle, the grey fill and border,
modern and legacy layouts, invoice and estimate, part sale invoice, batch invoice, the address row left free, no band when the customer
pays for itself, and invoices created before the release (held for production)."""
from bt_lib import C, HOLD, PRE_REL
from common import *

S = "S8"
MODERN = "Make sure the organization's document design setting is the modern layout."
LEGACY = "Make sure the organization's document design setting is the legacy layout."
A = cust("A", ", the customer the work is for")
B = cust("B", ", the payer")
ASSET = 'with an asset whose Unit is "854", Year 2024, Make "International" and Model "CV515"'
BAND_FULL = ('Directly under the address row, a full-width band reads "SERVICE FOR", then customer A\'s name in bold, then "Unit 854" and '
             '"2024 International CV515", separated by " · ".')
OPEN_INV = "Open the invoice's PDF."
OPEN_EST = "Open the estimate's PDF."


def doc(key, title, layout, status, open_step, kind, q):
    C(key, S, title, [ADMIN, layout, A, B, wo(1, "A", status, "B", ", " + ASSET)],
      [OPEN_WO, FIN, open_step],
      [["Work order 1 opens for customer A."], [f"The Finance tab shows the {kind}."],
       ["The Bill To block names customer B.", BAND_FULL]],
      q)


doc("S8-01", "Modern invoice prints the Service For band under the address row", MODERN, "invoiced", OPEN_INV, "invoice",
    ["S8-R1", "S8-R2", "S8-R6", "KD-BAND", "CORE-7"])
doc("S8-02", "Legacy invoice prints the Service For band", LEGACY, "invoiced", OPEN_INV, "invoice", ["S8-R6", "S8-R1", "S8-R2"])
doc("S8-03", "Modern estimate prints the Service For band", MODERN, "in Approved", OPEN_EST, "estimate", ["S8-R6", "S8-R1", "S8-R2", "KD-BAND"])
doc("S8-04", "Legacy estimate prints the Service For band", LEGACY, "in Approved", OPEN_EST, "estimate", ["S8-R6", "S8-R1", "S8-R2"])
C("S8-05", S, "The Service For band is light grey with a thin grey border",
  [ADMIN, MODERN, A, B, wo(1, "A", "invoiced", "B", ", " + ASSET)],
  [OPEN_WO, FIN, OPEN_INV, "Print the PDF in black and white."],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the invoice."],
   ["The Bill To block names customer B.", "The band has a light grey fill and a thin grey border."], ["On the black-and-white print the band's fill and border are still visible and its words are readable."]],
  ["S8-R5"])
C("S8-06", S, "Without a unit the band leaves out Unit and its separator",
  [ADMIN, MODERN, A, B, wo(1, "A", "invoiced", "B", ', with an asset that has no Unit, Year 2017, Make "Ford" and Model "Transit"')],
  [OPEN_WO, FIN, OPEN_INV],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the invoice."],
   ["The Bill To block names customer B.", 'The band reads "SERVICE FOR", customer A\'s name, then "2017 Ford Transit", separated by " · ".', 'No "Unit" and no extra " · " show.']],
  ["S8-R3"])
C("S8-07", S, "Without year, make and model the band shows only the unit",
  [ADMIN, MODERN, A, B, wo(1, "A", "invoiced", "B", ', with an asset whose Unit is "12" and that has no Year, Make or Model')],
  [OPEN_WO, FIN, OPEN_INV],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the invoice."],
   ["The Bill To block names customer B.", 'The band reads "SERVICE FOR", customer A\'s name, then "Unit 12", separated by " · ".', "No trailing \" · \" shows after the unit."]],
  ["S8-R3"])
C("S8-08", S, "A missing make drops out of the year, make and model",
  [ADMIN, MODERN, A, B, wo(1, "A", "invoiced", "B", ', with an asset whose Unit is "31", Year 2019, no Make and Model "T680"')],
  [OPEN_WO, FIN, OPEN_INV],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the invoice."],
   ["The Bill To block names customer B.", 'The band reads "SERVICE FOR", customer A\'s name, "Unit 31" and "2019 T680", separated by " · ".']],
  ["S8-R3"])
C("S8-09", S, "A unit that already starts with Unit is not prefixed again",
  [ADMIN, MODERN, A, B, wo(1, "A", "invoiced", "B", ', with an asset whose Unit is "Unit 7", Year 2020, Make "Kenworth" and Model "W900"')],
  [OPEN_WO, FIN, OPEN_INV],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the invoice."],
   ["The Bill To block names customer B.", 'The band shows "Unit 7", not "Unit Unit 7".', 'The band reads "SERVICE FOR", customer A\'s name, "Unit 7" and "2020 Kenworth W900", separated by " · ".']],
  ["S8-R3"])
C("S8-10", S, "A part sale with a vehicle prints the unit in its band",
  [ADMIN, MODERN, A, B, ps(1, "A", "invoiced", "B", ', with a vehicle attached whose Unit is "4417", Year 2011, Make "Hyundai" and Model "Santa Fe"')],
  [OPEN_PS, FIN, OPEN_INV],
  [["Part sale 1 opens for customer A."], ["The Finance tab shows the part sale invoice."],
   ["The Bill To block names customer B.",
    'The band reads "SERVICE FOR", customer A\'s name, "Unit 4417" and "2011 Hyundai Santa Fe", separated by " · ".']],
  ["S8-R4", "S8-R6"])
C("S8-11", S, "A part sale without a vehicle prints only SERVICE FOR and the name",
  [ADMIN, LEGACY, A, B, ps(1, "A", "invoiced", "B", ", with no vehicle attached")],
  [OPEN_PS, FIN, OPEN_INV],
  [["Part sale 1 opens for customer A."], ["The Finance tab shows the part sale invoice."],
   ["The Bill To block names customer B.", 'The band reads only "SERVICE FOR" and customer A\'s name.', 'No "Unit" and no " · " show.']],
  ["S8-R4", "S8-R6"])
C("S8-12", S, "A batch invoice gives each invoice billed to someone else its own band",
  [ADMIN, MODERN, A, B, wo(1, "A", "invoiced", "B", ", " + ASSET),
   "Have a new work order for this test, work order 2, for customer B, invoiced, that bills itself, so the batch holds an invoice with no band."],
  ["Open customer B's Invoices tab.", "Tick work order 1's invoice.", "Tick work order 2's invoice.", "Print the ticked invoices as a batch invoice."],
  [["Both invoices are listed."], ["Work order 1's invoice is ticked."], ["Work order 2's invoice is ticked."],
   ["Work order 1's pages carry the band: \"SERVICE FOR\", customer A's name, \"Unit 854\" and \"2024 International CV515\".",
    "Work order 2's pages carry no band."]],
  ["S8-R6", "S8-N1"])
C("S8-13", S, "The Service For band leaves the address row as it was",
  [ADMIN, MODERN, A, B, wo(1, "A", "invoiced", "B", ", " + ASSET),
   "Have a new work order for this test, work order 2, for customer B, invoiced, that bills itself, so there is an invoice to compare the address row with."],
  [OPEN_WO, FIN, OPEN_INV, "Open work order 2's invoice PDF."],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the invoice."],
   ["The band sits below the address row, not inside it.", "The address row holds the same blocks as on work order 2's invoice, in the same places."],
   ["Work order 2's address row holds the Bill To block naming customer B and the shop's own block, and no band."]],
  ["S8-R7", "OOS-01"])
C("S8-14", S, "No band prints when the customer pays for itself",
  [ADMIN, MODERN, cust("A", ", that bills itself"), wo(1, "A", "invoiced", None, ", " + ASSET)],
  [OPEN_WO, FIN, OPEN_INV],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the invoice."],
   ["The Bill To block names customer A.", 'No "SERVICE FOR" band prints.']],
  ["S8-N1", "KD-BAND", "CORE-8"])
C("S8-15", S, "Invoices created before the release never print the band",
  [ADMIN, "Use the production test account.", cust("A", ", created on production before the release"),
   wo(1, "A", "invoiced on production before the release", None, ", " + ASSET)],
  [OPEN_WO, FIN, OPEN_INV],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the invoice."],
   ['No "SERVICE FOR" band prints.', "The invoice reads as it did before the release."]],
  ["S8-N2"], marker=PRE_REL)
