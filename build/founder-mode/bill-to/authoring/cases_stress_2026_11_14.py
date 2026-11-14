"""Layout stress cases of 14 Nov 2026 (QA lead, 14 Nov 2026: "Draft all 87 + 4 questions (Recommended)"; this file is the Bill To part:
34 new cases from build/founder-mode/LAYOUT-STRESS-GAP-SCAN-2026-11-13.md §B3, B-P01..B-P26 and B-S01..B-S12).

Why: lesson L-21 (A/R and A/P, 13 Nov 2026: SV-12722, SV-12763, SV-12764) and skill 21 §6d lines 9 and 10. No Bill To case had a long
name with no spaces or a name with & " ' < >, and no case compared two states of one screen.

How (the suite's own machinery, nothing by hand in a generated file):
- Case bodies in the QA lead's pattern (Rule 117 fourteenth and fifteenth amendments), one action per step (135), whole cases where the
  steps need each other (136), every precondition record used or explained and made fresh for the test (137).
- Stress names are created by the tester for the case: a long name with spaces, the same name with the spaces taken out, and a name with
  & " ' < >. The library's gate bans the throwaway-data keyword and "For example:" lines in tester text, so each name is given by its shape
  with an example in brackets. Results say the name stays inside its own row, cell, chip or window, never covers the next element, every
  control stays visible, and a special-character name shows exactly as saved; whether a name wraps or is cut with "..." is said only where
  a source says which (the Customer chip: the design's own "Quartzsite Truc...") (skill 07 §6.0 check g).
- Before-and-after cases take a screenshot first and compare (the A/R suite's D-90..D-93 pattern).
- Quotes come from PRD v0.5 by requirement code or §8 row (checked word for word by bt_lib.check). References from Design are registered
  in design_refs.DREFS below (the same hook the generated design cases use); every picture is from design-2026-11-09/images/.
- B-S07b, B-S09 and B-S10 are held on the two new questions for Chris Ward, numbered 16 and 17 on his sheet (po_questions.py).
DRAFT: nothing here is in TestRail (layout-stress-2026-11-14/NEW-CASES.md)."""
from bt_lib import C, PO_HOLD
from common import *
import design_refs as _DR

S = "DESIGN"
NEWC = "Click New Customer."
NEW = {}          # key -> scan id, for the create script and NEW-CASES.md
W1440 = "Use a desktop browser window 1440 pixels wide, at 100% zoom."
PHONE = "Use a phone, or a browser window 390 pixels wide, signed in as an Admin at the test location."
CANVAS = ('Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794510417-a68d (its boards are '
          'byte-identical to version 1794239066-4906 read 9 Nov 2026), read 13 Nov 2026')
SHORT_ONLY = ("The design draws this place with ordinary names only; it draws no long name without spaces and no name with & \" ' < >. "
              "The stress check follows the design-case checklist (lesson L-21); the expected words come from the PRD quotes above.")

# ---- the three stress names, as the tester creates them -----------------------------------------------------------------------
LONG_SP = ("with a long name with spaces that no other customer has, at least 60 characters "
           "(for example Northern Plains Heavy Truck and Trailer Repair Services West)")
LONG_FROM_A = ("whose name is customer A's name with every space taken out "
               "(for example NorthernPlainsHeavyTruckandTrailerRepairServicesWest)")
LONG_NO = ("with a long name with no spaces that no other customer has, at least 50 characters "
           "(for example NorthernPlainsHeavyTruckandTrailerRepairServicesWest)")
SPECIAL = ("with a name that no other customer has and that includes each of the characters & \" ' < > "
           "(for example A&B \"Fleet\" O'Neil <Parts> & Sons)")
FIT = "If a name field stops before the end of a name, use the longest name it takes."


def IN_ROW(x, what="row"):
    return f"{x}'s name stays inside its own {what}: no part of it covers the {what} under it, and that {what}'s text can be read."


def EXACT(x):
    return f"{x}'s name shows exactly as saved: the & \" ' < > characters appear as typed, not changed into other characters or codes."


SHOT = "Take a screenshot of the page."
SHOT_R = "You have a picture of where each heading, field and button sits before the change."
SAME_H = "Every column heading is in the same place as in your screenshot: none has moved left or right."


def PICS(*names):
    return "Open the attached picture" + ("s " if len(names) > 1 else " ") + ", ".join(names) + " at 100% zoom beside the screen."


def refs(key, pics, words_from=None, notes=(), pages=None):
    """References from Design for one case: the canvas, each picture's figure heading, page and badge, one caption per picture as the
    design's own words (checked against the design package by bt_lib.check), and notes."""
    figs = [_DR.BYPIC[p[:8]] for p in pics]
    head = pages or (CANVAS + ": pictures " + ", ".join(f'"{f["heading"]}" (page {f["page"]} "{f["page_name"]}", {f["badge"]})' for f in figs)
                     + ". Compare the screen with the pictures; the expected results come from the PRD.")
    words = []
    for f in figs:
        caps = f.get("captions") or []
        if caps and caps[0] not in words: words.append(caps[0])
    if words_from is not None: words = words_from
    _DR.DREFS[key] = {"pages": head, "pictures": list(pics), "words": words, "notes": list(notes)}


def N(key, scan, title, pre, steps, res, q, pics=(), notes=(SHORT_ONLY,), marker=None, note="", pages=None, words=None, sec=S):
    C(key, sec, title, pre, steps, res, q, marker=marker, note=note)
    if sec == S or pics: refs(key, list(pics), words, notes, pages)
    NEW[key] = scan


NO_PIC = CANVAS + ": the design draws no picture of this place (all 126 pictures checked 9 Nov 2026). The expected results come from the PRD."

# ================================================ Typed text (B-P01 .. B-P26) ================================================
P = ["bt-p1-12-after-bill-invoices-to-line.png"]
N("D-71", "B-P01", "Design: Long and unusual payer names fit the Bill Invoices To line",
  [ADMIN, W1440, cust("A", ", a payer, " + LONG_SP), cust("B", ", a payer, " + LONG_FROM_A), cust("C", ", a payer, " + SPECIAL), FIT,
   "Have three new customers for this test, customer D, customer E and customer F, whose Bill Invoices To is saved as customer A, "
   "customer B and customer C in turn (in Edit Customer).", PICS(*P)],
  ["Open customer D's page.", "Open customer E's page.", "Open customer F's page."],
  [['Under IBS on the left card, "Bill Invoices To" shows customer A\'s name, with "Change" under it.',
    "Customer A's name stays inside the card: no part of it runs past the card's right edge or covers \"Change\".",
    "The Contacts and Assets counters below are fully visible."],
   ['"Bill Invoices To" shows customer B\'s name, with "Change" under it.',
    "Customer B's name stays inside the card: no part of it runs past the card's right edge or covers \"Change\".",
    "The Contacts and Assets counters below are fully visible."],
   ['"Bill Invoices To" shows customer C\'s name, with "Change" under it.', EXACT("Customer C")]],
  ["S1-R1", "S1-R2"], P)

P = ["bt-p1-26-after-phone.png"]
N("D-72", "B-P02", "Design: A long payer name on the phone customer page keeps Change visible",
  [PHONE, cust("A", ", a payer, " + LONG_SP), cust("B", ", a payer, " + LONG_FROM_A), FIT,
   "Have two new customers for this test, customer D and customer E, whose Bill Invoices To is saved as customer A and customer B in turn.",
   PICS(*P)],
  ["Open customer D's page.", "Open customer E's page."],
  [['The card shows "Bill Invoices To" with customer A\'s name and "Change".',
    "Customer A's name stays inside the card: no part of it runs past the right edge of the screen or covers \"Change\".",
    '"Change" is fully visible without scrolling the page sideways.'],
   ['The card shows "Bill Invoices To" with customer B\'s name and "Change".',
    "Customer B's name stays inside the card: no part of it runs past the right edge of the screen or covers \"Change\".",
    '"Change" is fully visible without scrolling the page sideways.']],
  ["S1-R2", "S1-R1"], P)

P = ["bt-p1-13-after-change.png", "bt-p1-14-after-change-open.png"]
N("D-73", "B-P03", "Design: Long and unusual names stay in their rows in the Bill Invoices To window",
  [ADMIN, W1440, cust("A", " " + LONG_SP), cust("B", " " + LONG_FROM_A), cust("C", " " + SPECIAL), FIT,
   cust("D", ", whose Bill Invoices To is saved as customer C, so its card shows \"Change\""), PICS(*P)],
  ["Open customer D's page.", 'Click "Change" beside "Bill Invoices To" on the left card.', 'Click the "Bill Invoices To" field.',
   "Type the first word of customer A's name in the field."],
  [['The left card shows "Bill Invoices To" with customer C\'s name.'],
   ['The "Bill Invoices To" window opens with its "Save" button.', 'The field shows customer C\'s name.', EXACT("Customer C"),
    "The name stays inside the field: no part of it runs past the field's right edge."],
   ['The list opens; its first row reads "[customer D\'s name] (this customer)".'],
   ["Customer A's row and customer B's row are listed.", IN_ROW("Customer A"), IN_ROW("Customer B")]],
  ["S1-R4", "S1-R5"], P, note=NAME_NOTE)

P = ["bt-p1-03-after-open.png"]
N("D-74", "B-P04", "Design: A long typed name keeps the (this customer) row inside the list",
  [ADMIN, W1440, "Start on the Customers page.", FIT, PICS(*P)],
  [NEWC,
   "In the name field, type a long name with no spaces, at least 50 characters (for example NorthernPlainsHeavyTruckandTrailerRepairServicesWest).",
   'Click the "Bill Invoices To" field.',
   "In the name field, replace the name with one that includes each of the characters & \" ' < > (for example A&B \"Fleet\" O'Neil <Parts> & Sons).",
   'Click the "Bill Invoices To" field.'],
  [["The New Customer window opens."], ["The name field shows the whole name you typed."],
   ['The list opens; its first row reads "[the name you typed] (this customer)".',
    "That first row stays inside the list: no part of it covers the row under it, and that row's name can be read.",
    '"(this customer)" is visible at the end of the first row, or on its own line inside that row.'],
   ["The name field shows the new name."],
   ['The first row reads "[the new name] (this customer)".',
    "The name in that row shows exactly as typed: the & \" ' < > characters appear as typed, not changed into other characters or codes."]],
  ["S2-R4"], P, note=NAME_NOTE)

P = ["bt-p1-18-after-pays-for-list.png"]
N("D-75", "B-P05", "Design: Pays for window with long names keeps its title, links and Close inside",
  [ADMIN, W1440, cust("A", ", the payer, " + LONG_SP), cust("B", ", whose Bill Invoices To is saved as customer A, " + LONG_FROM_A),
   cust("C", ", whose Bill Invoices To is saved as customer A, " + SPECIAL), FIT, PICS(*P)],
  ["Open customer A's page.", 'Click the "Pays for" counter.'],
  [['The "Pays for" counter shows 2.'],
   ['A window titled "[customer A\'s name] pays for" opens.',
    "The title stays inside the window: no part of it runs past the window's edge.",
    "Customer B and customer C are listed, each as a link.", IN_ROW("Customer B"), EXACT("Customer C"),
    'The line "These customers bill new work orders and part sales to [customer A\'s name] by default." stays inside the window.',
    'The "Close" button is fully visible and nothing covers it.']],
  ["S1-R9", "S1-R10"], P, note=NAME_NOTE)

P = ["bt-p2-03-after-open.png"]
N("D-76", "B-P07", "Design: Long and unusual names stay in their rows in the work order Bill To list",
  [ADMIN, W1440, cust("A", " " + LONG_SP), cust("B", " " + LONG_FROM_A), cust("C", ", that bills itself, " + SPECIAL), FIT,
   wo(1, "C"), PICS(*P)],
  [OPEN_WO, EXPAND, CLICK_BT, "Type the first word of customer A's name."],
  [["Work order 1 opens for customer C."], [BT_SELF],
   ['The list opens; its first row reads "[customer C\'s name] (this customer)".', EXACT("Customer C")],
   ["Customer A's row and customer B's row are listed under the first row.", IN_ROW("Customer A"), IN_ROW("Customer B")]],
  ["S3-R3"], P, note=NAME_NOTE)

P = ["bt-p2-21-after-s2-17579.png"]
N("D-77", "B-P08", "Design: A long payer name shows in full on the phone Customer card",
  [PHONE, cust("A", ", a payer, " + LONG_SP), cust("B", ", a payer, " + LONG_FROM_A), cust("D", ", the customer the work is for"), FIT,
   wo(1, "D", "in Estimate", "A"), wo(2, "D", "in Estimate", "B"), PICS(*P)],
  [OPEN_WO, "Tap to open the work order details.", "Open work order 2.", "Tap to open the work order details."],
  [["Work order 1 opens for customer D, in the phone layout."],
   ['The Customer card shows "Bill To" under Authorizer with customer A\'s whole name: every character can be read.',
    "The name stays inside the card: no part of it runs past the right edge of the screen."],
   ["Work order 2 opens for customer D."],
   ['"Bill To" shows customer B\'s whole name: every character can be read.',
    "The name stays inside the card: no part of it runs past the right edge of the screen."]],
  ["FF-S3", "S3-R2"], P)

P = ["bt-p2-10-after-authorizer-list-top.png", "bt-p2-11-after-authorizer-list-bottom.png"]
N("D-78", "B-P09", "Design: Long contact and payer names stay in their Authorizer list rows",
  [ADMIN, W1440,
   cust("A", " " + LONG_SP + ", with one contact, contact A1, whose first name is long with no spaces, at least 30 characters "
        "(for example Maximilianbartholomewjohnsonwilliams), who can be picked as Authorizer"),
   cust("B", ", the payer, " + LONG_FROM_A + ", with one contact, contact B1, whose last name includes the characters & \" ' < > "
        "(for example O'Neil \"Jr\" <Parts> & Co), who can be picked as Authorizer"),
   FIT, wo(1, "A", "in Estimate", "B"), PICS(*P)],
  [OPEN_WO, EXPAND, "Click the Authorizer field."],
  [["Work order 1 opens for customer A."], [bt_reads("B")],
   ['The list starts with "No authorizer", then contact A1, then contact B1.',
    "Contact A1's name and customer A's name on the second line stay inside contact A1's row: no part of them covers contact B1's row.",
    "Contact B1's name and customer B's name on the second line stay inside contact B1's row and inside the list.",
    "Contact B1's name shows exactly as saved: the & \" ' < > characters appear as typed, not changed into other characters or codes."]],
  ["S4-R2", "S4-R1"], P)

P = ["bt-p3-07-after-hover.png", "bt-p3-08-after-click.png"]
N("D-79", "B-P10", "Design: Deposit tooltip and toast keep a long customer name inside the box",
  [ADMIN, W1440, cust("A", ", the customer the work is for"), cust("B", ", the payer, " + LONG_NO), cust("C", ", a second payer, " + SPECIAL), FIT,
   wo(1, "A", "in Approved", "B", ", holding one deposit of $10.00 taken on its Finance tab after customer B was picked"),
   wo(2, "A", "in Approved", "C", ", holding one deposit of $10.00 taken on its Finance tab after customer C was picked"), PICS(*P)],
  [OPEN_WO, EXPAND, HOVER_BT, CLICK_BT, "Open work order 2.", EXPAND, HOVER_BT],
  [["Work order 1 opens for customer A."], [bt_reads("B")],
   ['The tooltip reads "' + M1_ONE.format(amt="$10.00", c="B") + '"',
    "The whole message stays inside the tooltip's box: no part of it runs past the box or off the screen."],
   ['An error toast shows the same message with "Open Deposits".',
    "The whole message stays inside the toast: no part of it runs past the toast or covers \"Open Deposits\".",
    '"Open Deposits" is fully visible.'],
   ["Work order 2 opens for customer A."], [bt_reads("C")],
   ['The tooltip reads "' + M1_ONE.format(amt="$10.00", c="C") + '"', EXACT("Customer C"),
    "The whole message stays inside the tooltip's box."]],
  ["UFS-01"], P, note=NAME_NOTE)

P = ["bt-p3-14-after-banner.png"]
N("D-80", "B-P11", "Design: Credit Hold banner with a long payer name keeps Change Bill To visible",
  [ADMIN, W1440, cust("A", ", the customer the work is for, on the COD credit term"),
   cust("B", ", the payer, on the Credit Hold credit term, " + LONG_NO), cust("C", ", a second payer, on the Credit Hold credit term, " + SPECIAL),
   FIT, wo(1, "A", "in Complete, ready to invoice", "B"), wo(2, "A", "in Complete, ready to invoice", "C"), PICS(*P)],
  [OPEN_WO, "Open work order 2."],
  [['The Credit Hold banner reads "' + M2.format(c="B") + '"',
    "The banner text stays inside the banner: no part of it runs past the right edge of the window or covers \"Change Bill To\".",
    'The "Change Bill To" button is fully visible.'],
   ['The Credit Hold banner reads "' + M2.format(c="C") + '"', EXACT("Customer C"), 'The "Change Bill To" button is fully visible.']],
  ["S7-R6", "UFS-05"], P, note=NAME_NOTE)

N("D-81", "B-P12", "Design: Payment refusal toast keeps a long customer name inside it",
  [ADMIN, W1440, cust("A", ", the customer the work is for"), cust("B", ", the payer, " + LONG_NO), cust("C", ", the new payer"), FIT,
   "Have a new work order for this test, work order 1, for customer A, invoiced for $210.00, billed to customer B, unpaid.",
   "Open customer B's Invoices tab in a first browser tab and work order 1 in a second tab."],
  ["In the first tab, tick work order 1's invoice.", "Click New Payment.", "Switch to the second tab.", FIN, "Reverse the invoice.", EXPAND,
   CLICK_BT, "Pick customer C in the list.", "Click Create Invoice on the Finance tab.", "Switch to the first tab.", "Click Make Payment."],
  [["The invoice is ticked."], ["The New Customer Payment window shows the invoice for $210.00."],
   ["The second tab shows work order 1 for customer A."], ["The Finance tab lists the invoice."],
   ["The invoice is removed and work order 1 is back to Complete."], ['"Bill To" reads customer B\'s name.'], ["The list opens."],
   [bt_reads("C")], ["The invoice is created again for customer C."], ["The payment window is still open."],
   ['The payment is refused with the error toast "This payment can only be applied to invoices billed to [customer B\'s name]."',
    "The whole message, with customer B's name, stays inside the toast: no part of it runs past the toast or off the screen.",
    "No payment is recorded."]],
  ["UFS-06", "EH-S10"], notes=(), pages=NO_PIC, note=NAME_NOTE)

ASSET = 'with an asset whose Unit is "854", Year 2024, Make "International" and Model "CV515"'
P = ["bt-p4-02-after-modern.png"]
N("D-82", "B-P13a", "Design: Service For band with long names stays inside the band on modern invoices",
  [ADMIN, W1440, "Make sure the organization's document design setting is the modern layout.",
   cust("A", ", the customer the work is for, " + LONG_NO), cust("C", ", a second customer the work is for, " + SPECIAL), cust("B", ", the payer"),
   FIT, wo(1, "A", "invoiced", "B", ", " + ASSET), wo(2, "C", "invoiced", "B", ", " + ASSET), PICS(*P)],
  [OPEN_WO, FIN, "Click the print icon on the Finance tab.", "Open the invoice's PDF.", "Open work order 2.", FIN, "Open the invoice's PDF."],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the invoice."],
   ['Directly under the address row, a full-width band reads "SERVICE FOR", then customer A\'s name in bold, then "Unit 854" and "2024 International CV515".',
    "Customer A's name stays inside the band: no part of it covers \"Unit 854\", the year, make and model, or the page's right edge.",
    "The address row above the band keeps its blocks; the band does not reach into it."],
   ["The PDF shows the same band, with customer A's name inside it and \"Unit 854\" and \"2024 International CV515\" fully visible."],
   ["Work order 2 opens for customer C."], ["The Finance tab shows the invoice."],
   ['The band reads "SERVICE FOR", then customer C\'s name in bold, then "Unit 854" and "2024 International CV515".', EXACT("Customer C")]],
  ["S8-R1", "S8-R2", "S8-R7"], P)

P = ["bt-p4-04-after-legacy.png"]
N("D-83", "B-P13b", "Design: Service For band with long names stays inside the band on legacy invoices",
  [ADMIN, W1440, "Make sure the organization's document design setting is the legacy layout.",
   cust("A", ", the customer the work is for, " + LONG_NO), cust("C", ", a second customer the work is for, " + SPECIAL), cust("B", ", the payer"),
   FIT, wo(1, "A", "invoiced", "B", ", " + ASSET), wo(2, "C", "invoiced", "B", ", " + ASSET), PICS(*P)],
  [OPEN_WO, FIN, "Click the print icon on the Finance tab.", "Open the invoice's PDF.", "Open work order 2.", FIN, "Open the invoice's PDF."],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the invoice."],
   ['Under Bill To and Remit payment to, above the asset table, a full-width band reads "SERVICE FOR", then customer A\'s name in bold, then "Unit 854" and "2024 International CV515".',
    "Customer A's name stays inside the band: no part of it covers \"Unit 854\", the year, make and model, or the page's right edge.",
    "The Bill To and Remit payment to blocks above the band keep their place; the band does not reach into them."],
   ["The PDF shows the same band, with customer A's name inside it and \"Unit 854\" and \"2024 International CV515\" fully visible."],
   ["Work order 2 opens for customer C."], ["The Finance tab shows the invoice."],
   ['The band reads "SERVICE FOR", then customer C\'s name in bold, then "Unit 854" and "2024 International CV515".', EXACT("Customer C")]],
  ["S8-R1", "S8-R2", "S8-R7"], P)

P = ["bt-p4-02-after-modern.png"]
N("D-84", "B-P14", "Design: Invoice Bill To block prints a long payer name with its IBS number",
  [ADMIN, "Use a test organization connected to IBS.", cust("A", ", the customer the work is for, with its own IBS account number"),
   cust("B", ", the payer, with an IBS account number different from customer A's, " + LONG_NO),
   cust("C", ", a second payer, with an IBS account number of its own, " + SPECIAL), FIT,
   wo(1, "A", "invoiced", "B"), wo(2, "A", "invoiced", "C"), PICS(*P)],
  [OPEN_WO, FIN, "Open the invoice's document.", "Open work order 2.", FIN, "Open the invoice's document."],
  [["Work order 1 opens for customer A."], ["The Finance tab shows the invoice."],
   ['The Bill To block shows customer B\'s name followed by "(IBS#: [customer B\'s IBS number])", then customer B\'s address and phone.',
    "Customer B's name and the IBS number stay inside the Bill To block: no part of them runs into the block beside it or past the page's edge.",
    "The IBS number is fully visible."],
   ["Work order 2 opens for customer A."], ["The Finance tab shows the invoice."],
   ['The Bill To block shows customer C\'s name followed by "(IBS#: [customer C\'s IBS number])".', EXACT("Customer C")]],
  ["S7-R1", "S19-R3"], P, note=NAME_NOTE)

P = ["bt-p5-02-after-a-j-invoices.png"]
N("D-85", "B-P15", "Design: Long Service For names never cover Memo on the payer's Invoices tab",
  [ADMIN, W1440, cust("A", ", a customer the work is for, " + LONG_SP), cust("B", ", a customer the work is for, " + LONG_FROM_A),
   cust("C", ", a customer the work is for, " + SPECIAL), cust("D", ", the payer"), FIT,
   "Have three new work orders for this test, for customer A, customer B and customer C in turn, each invoiced and unpaid, all billed to customer D.",
   PICS(*P)],
  ["Open customer D's page.", "Click the Invoices tab.", "Resize the browser window to 1536 pixels wide."],
  [["Customer D's page opens."],
   ["The columns read Date, Type, No., Service For, Memo, Total, Balance, Status, Action, all visible without scrolling sideways.",
    "The Service For cells name customer A, customer B and customer C.",
    "Each name stays inside its own Service For cell: no part of it covers the Memo column, its heading or the row under it.",
    EXACT("Customer C")],
   ["Every column is still visible without scrolling sideways.", "Each Service For name still stays inside its own cell and does not cover Memo."]],
  ["S10-R6"], P)

P = ["bt-p5-12-after-sending-invoice-s2-17581.png"]
N("D-86", "B-P16", "Design: Long contact names stay in their rows in Sending invoice",
  [ADMIN, W1440, cust("A", ", the customer the work is for"),
   cust("B", ", the payer, with three contacts whose email addresses you can read: contact B1, whose first and last name together are "
        "long with spaces, at least 40 characters, contact B2, whose first name is long with no spaces, at least 30 characters, and contact B3, "
        "whose last name includes the characters & \" ' < > (for example O'Neil \"Jr\" <Parts> & Co)"),
   FIT, wo(1, "A", "invoiced", "B"), PICS(*P)],
  [OPEN_WO, "Open the invoice's email (send) window on the Finance tab."],
  [["Work order 1 opens for customer A."],
   ["The window lists contact B1, contact B2 and contact B3, each with its name and email address.",
    "Each contact's name and email stay inside the contact's own row: no part of them covers the row under it or that row's tick box.",
    "Contact B3's name shows exactly as saved: the & \" ' < > characters appear as typed, not changed into other characters or codes.",
    "The window's buttons are fully visible."]],
  ["S9-R1"], P)

P = ["bt-p6-05-after-delete-customer-refused.png"]
N("D-87", "B-P17", "Design: Delete Customer window lists long dependent names inside the window",
  [ADMIN, W1440, cust("D", ", the payer, with no work orders, part sales, assets or contacts of its own, so only the Bill To rule can stop the delete"),
   cust("A", ", whose Bill Invoices To is saved as customer D, " + LONG_SP), cust("B", ", whose Bill Invoices To is saved as customer D, " + LONG_FROM_A),
   cust("C", ", whose Bill Invoices To is saved as customer D, " + SPECIAL), FIT, PICS(*P)],
  ["Open customer D's Edit Customer window.", "Click Delete.", "Click Delete in the Confirmation window."],
  [["Customer D's Edit Customer window opens."],
   ['A "Confirmation" window asks "Are you sure you want to delete this company?" with "Cancel" and "Delete".'],
   ['A "Delete Customer" window opens: "This customer is the default Bill To for [customer A\'s, customer B\'s and customer C\'s names, comma separated]. Remove it from those customers first."',
    "Customer A, customer B and customer C are each listed as a link.",
    "Every name stays inside the window: no part of it runs past the window's edge or covers the next name.", EXACT("Customer C"),
    'The "Cancel" and "Remove As Default Bill To" buttons are fully visible.']],
  ["UFS-11", "S12-R2", "S12-R3"], P, note=NAME_NOTE)

P = ["bt-p6-06-after-remove-as-default-bill-to.png"]
N("D-88", "B-P18", "Design: Remove as default question with a long name keeps both buttons visible",
  [ADMIN, W1440, cust("D", ", the payer, with no work orders, part sales, assets or contacts of its own, " + LONG_NO),
   cust("E", ", whose Bill Invoices To is saved as customer D, so one customer is the other's saved payer"), FIT, PICS(*P)],
  ["Open customer D's Edit Customer window.", "Click Delete.", "Click Delete in the Confirmation window.", 'Click "Remove As Default Bill To".'],
  [["Customer D's Edit Customer window opens."],
   ['A "Confirmation" window asks "Are you sure you want to delete this company?" with "Cancel" and "Delete".'],
   ['A "Delete Customer" window opens with customer E\'s name as a link.'],
   ['A window titled "Remove as default Bill To" reads "Remove [customer D\'s name] as the default Bill To for 1 customer? Open work orders keep their Bill To."',
    "The whole question, with customer D's name, stays inside the window: no part of it runs past the window's edge or covers the buttons.",
    'The "Remove" and "Cancel" buttons are fully visible.']],
  ["UFS-12", "S12-R4"], P, note=NAME_NOTE)

P = ["bt-p2-15-after-work-order-log.png"]
N("D-89", "B-P19", "Design: Work Order Log shows long Bill To names inside the Details cell",
  [ADMIN, W1440, cust("A", ", that bills itself, " + LONG_SP), cust("B", ", a payer, " + LONG_FROM_A), cust("C", ", a second payer, " + SPECIAL),
   FIT, wo(1, "A"), PICS(*P)],
  [OPEN_WO, EXPAND, CLICK_BT, "Pick customer B in the list.", CLICK_BT, "Pick customer C in the list.", "Open the Work Order Log."],
  [["Work order 1 opens for customer A."], [BT_SELF], ["The list opens."], [bt_reads("B")], ["The list opens."], [bt_reads("C")],
   ['The two newest entries are "Bill To changed".',
    "The newer one reads \"Bill To\" with customer B's name as the old value and customer C's name as the new value, each a link.",
    "The older one reads \"Bill To\" with customer A's name as the old value and customer B's name as the new value, each a link.",
    "Every name stays inside its own Details cell: no part of it covers the next column or the row under it.", EXACT("Customer C")]],
  ["S13-R2", "S13-R1"], P)

P = ["bt-p7-04-after-one-customer-picked.png", "bt-p7-05-after-applied.png", "bt-p7-07-after-1600-wide-search-s2-16.png"]
N("D-90", "B-P20", "Design: Customer chip with a long name is shortened and the toolbar stays on one line",
  [ADMIN, W1440, cust("A", ", the asset's owner"), cust("B", ", a payer, " + LONG_NO), FIT,
   "Have a new asset for this test, asset 1, owned by customer A, with work order 1 for customer A billed to customer B and work order 2 "
   "for customer A billing itself, both at the test location.", PICS(*P)],
  ["Open asset 1's Work Orders tab from customer A's page.", 'Click the "Customer" filter chip.', "Tick customer B.", "Click outside the panel.",
   "Resize the browser window to 1536 pixels wide."],
  [["Work order 1 and work order 2 are listed."], ["The panel opens."],
   ['Customer B is ticked and the chip reads "Customer: " and the start of customer B\'s name, shortened with "...".'],
   ["The panel closes and only work order 1 is listed.",
    "The search box, Status, the Customer chip and New sit on one line; nothing wraps and New is fully visible at the right."],
   ["The search box, Status, the Customer chip and New still sit on one line, with New fully visible."]],
  ["S14-R2", "S14-R4"], P,
  words=['Quartzsite ticked: "1 selected", and the chip reads "Customer: Quartzsite Truc...".',
         "Searching the whole history finds Kolosov's S2-16894 as well. The search box, Status, Customer chip and New sit on one line at 1600; nothing wraps."])

P = ["bt-p7-03-after-customer-chip-open.png"]
N("D-91", "B-P21", "Design: Long and unusual names stay in their own rows in the Customer chip panel",
  [ADMIN, W1440, cust("A", ", a payer, " + LONG_SP), cust("B", ", a payer, " + LONG_FROM_A), cust("C", ", a payer, " + SPECIAL),
   cust("D", ", the asset's owner"), FIT,
   "Have a new asset for this test, asset 1, owned by customer D, with three work orders for customer D at the test location, billed to "
   "customer A, customer B and customer C in turn, so the chip lists all four customers.", PICS(*P)],
  ["Open asset 1's Work Orders tab from customer D's page.", 'Click the "Customer" filter chip.',
   "Click the tick box in the row directly under customer B's row (if customer B's row is the last one, the row directly above it)."],
  [["Three work orders are listed."],
   ["The panel lists customer A, customer B, customer C and customer D.", IN_ROW("Customer A"), IN_ROW("Customer B"), EXACT("Customer C"),
    "Every row's tick box is fully visible."],
   ["The customer in that row is ticked; customer B stays unticked."]],
  ["S14-R3"], P)

P = ["bt-p7-03-after-customer-chip-open.png"]
N("D-92", "B-P22", "Design: Customer chip search shows long names in their own rows",
  [ADMIN, W1440, cust("A", ", a payer, " + LONG_SP), cust("B", ", a payer, " + LONG_FROM_A), cust("C", ", a payer, " + SPECIAL),
   cust("D", ", the asset's owner"), FIT,
   "Have a new asset for this test, asset 1, owned by customer D, with nine work orders for customer D at the test location: one billing "
   "customer D itself, three billed to customer A, customer B and customer C in turn, and five billed to five other new payers, so the chip "
   "has 9 options.", PICS(*P)],
  ["Open asset 1's Work Orders tab from customer D's page.", 'Click the "Customer" filter chip.',
   "Type the first word of customer A's name in Search customers."],
  [["Nine work orders are listed."],
   ['A "Search customers" box shows above the 9 options.', EXACT("Customer C"), IN_ROW("Customer C")],
   ["Customer A's row and customer B's row are listed.", IN_ROW("Customer A"), IN_ROW("Customer B")]],
  ["S14-R5"], P,
  notes=("The design draws the chip panel without search (fewer than 9 options); the picture shows the row look only. " + SHORT_ONLY,))

N("D-93", "B-P26", "Design: Unexported report keeps a long QuickBooks customer name inside its row",
  [ADMIN, "Use a test organization connected to a QuickBooks Online sandbox company that you can sign in to.", W1440,
   cust("A", ", the customer the work is for"),
   cust("D", ", already linked to a QuickBooks customer whose name is long with no spaces, at least 50 characters "
        "(for example NorthernPlainsHeavyTruckandTrailerRepairServicesWest)"),
   cust("B", ", the payer, not linked to QuickBooks, whose name is exactly the name of customer D's QuickBooks customer"), FIT,
   wo(1, "A", "in Complete, ready to invoice", "B")],
  [OPEN_WO, FIN, CREATE_INV, "Open the Unexported report."],
  [["Work order 1 opens for customer A."], ["The Finance tab shows Create Invoice."], ["The invoice is created in ShopView."],
   ['Work order 1\'s invoice is listed with the reason "QuickBooks customer [that QuickBooks customer\'s name] is already linked to another ShopView customer."',
    "The reason, with the long name, stays inside its own cell: no part of it covers the next column or the row under it.",
    "Every column of the report is visible."]],
  ["UFS-18", "S17-R4"], notes=(), pages=NO_PIC, note=NAME_NOTE)

N("S19-09", "B-P24", "Invoice CSV export keeps long and unusual names whole in their cells",
  [ADMIN, cust("A", ", a customer the work is for, " + LONG_SP), cust("C", ", a second customer the work is for, " + SPECIAL),
   cust("B", ", the payer, " + LONG_FROM_A), FIT,
   wo(1, "A", "invoiced today", "B"), wo(2, "C", "invoiced today", "B"), "Start on the page that exports the invoice list."],
  ["Export the invoice list to CSV.", "Open the CSV file in a spreadsheet program."],
  [["A CSV file downloads."],
   ["Work order 1's invoice row reads customer B's whole name under \"Customer\" and customer A's whole name under \"Service Customer\".",
    "Work order 2's invoice row reads customer B's whole name under \"Customer\" and customer C's name under \"Service Customer\".",
    EXACT("Customer C"),
    "No name is split across two cells: every row has its values under the same headings as the heading row."]],
  ["S19-R5", "S19-R6"], sec="S19", notes=())

# ================================================ State changes (B-S01 .. B-S12) ================================================
P = ["bt-p1-02-after-bill-invoices-to-empty.png", "bt-p1-03-after-open.png", "bt-p1-05-after-picked.png"]
N("D-94", "B-S01", "Design: Opening the Bill Invoices To list leaves the New Customer fields in place",
  [ADMIN, W1440, cust("B", ", so there is a customer to pick"), "Start on the Customers page.", PICS(*P)],
  [NEWC, SHOT, 'Click the "Bill Invoices To" field.', "Type the first word of customer B's name.", "Pick customer B in the list."],
  [['The New Customer window opens; "Bill Invoices To" reads "This customer".'], [SHOT_R],
   ["The list opens over the fields under it.",
    "Every field label you can still see and the Save button are in the same place as in your screenshot."],
   ["The list narrows to the names that match; the Save button is still in the same place as in your screenshot."],
   ['The list closes and "Bill Invoices To" reads customer B\'s name.',
    "Every field and the Save button are in the same place as in your screenshot: none has moved up, down, left or right."]],
  ["S2-R1"], P,
  notes=("The design's pictures of the closed, open and picked field keep the window's Save button at the same place (compared 13 Nov 2026).",))

P = ["bt-p1-02-after-bill-invoices-to-empty.png", "bt-p1-07-after-saved-default.png"]
N("D-95", "B-S02", "Design: Showing and hiding Address 2 moves no field sideways",
  [ADMIN, W1440, "Start on the Customers page.", PICS(*P)],
  [NEWC, SHOT, "Click the + beside Address 1.", "Click the x beside Address 2."],
  [["The New Customer window opens with no Address 2 field and a + beside Address 1."], [SHOT_R],
   ["An empty Address 2 field shows.", "Address 1 and every field above it are in the same place as in your screenshot.",
    "No field or button has moved left or right."],
   ["Address 2 is hidden again.", "Every field and button is back in the same place as in your screenshot."]],
  ["S2-R6", "S2-R7"], P,
  notes=("The design draws Address 2 hidden and shown in two different windows, not as a pair; the place check follows the design-case "
         "checklist (layout stays put when the screen changes state).",))

P = ["bt-p1-11-before-customer-page.png", "bt-p1-12-after-bill-invoices-to-line.png"]
N("D-96", "B-S04", "Design: Saving a default adds the Bill Invoices To line and moves nothing sideways",
  [ADMIN, W1440, cust("A", ", with no saved Bill Invoices To, so the customer bills itself"), cust("B", ", the payer"), PICS(*P)],
  ["Open customer A's page.", SHOT, "Open customer A's Edit Customer window.", 'Click the "Bill Invoices To" field.', "Pick customer B in the list.", SAVE],
  [['Customer A\'s left card shows no "Bill Invoices To" line.'], [SHOT_R], ["Customer A's Edit Customer window opens."], ["The list opens."],
   ['"Bill Invoices To" reads customer B\'s name.'],
   ['The window closes; under IBS the left card now shows "Bill Invoices To" with customer B\'s name and "Change".',
    "Every line above the new line is in the same place as in your screenshot.",
    "The Contacts and Assets counters keep their left-right place and only move down, below the new line."]],
  ["S1-R1"], P,
  notes=("The design's before and after pictures of the customer page (compared 13 Nov 2026) show the counters pushed straight down by "
         "the new line and nothing moving sideways.",))

P = ["bt-p2-02-after-this-customer.png", "bt-p2-03-after-open.png", "bt-p2-06-after-picked.png"]
N("D-97", "B-S05", "Design: Opening the Bill To list leaves the card and the lines table in place",
  [ADMIN, W1440, cust("A", ", that bills itself"), cust("B", ", the payer"),
   wo(1, "A", "in Estimate", None, ", with one labor line, so the lines table shows"), PICS(*P)],
  [OPEN_WO, EXPAND, SHOT, CLICK_BT, "Type the first word of customer B's name.", "Pick customer B in the list."],
  [["Work order 1 opens for customer A."], [BT_SELF], [SHOT_R],
   ["The list opens over the lines table.", "The Customer card's rows and the lines table's headings are in the same place as in your screenshot."],
   ["The list narrows; the card's rows and the table's headings are still in the same place as in your screenshot."],
   [bt_reads("B"), "The list closes.", "The card's rows and the lines table's headings are in the same place as in your screenshot."]],
  ["S3-R2", "S3-R3"], P,
  notes=("The design's pictures of the closed, open and picked list keep the card's rows and the lines table's headings at the same place "
         "(compared 13 Nov 2026); the list is drawn over the table.",))

P = ["bt-p3-13-before-lines.png", "bt-p3-14-after-banner.png"]
N("D-98", "B-S06", "Design: Lines table headings keep their place when the Credit Hold banner shows",
  [ADMIN, W1440, cust("A", ", the customer the work is for, on the COD credit term"),
   cust("B", ", the payer, on the COD credit term, so the payer can be put on Credit Hold during the case"),
   wo(1, "A", "in Complete, ready to invoice", "B", ", with one labor line, so the lines table shows"), PICS(*P)],
  [OPEN_WO, SHOT, "Open customer B's Edit Customer window.", "Choose Credit Hold in Credit Terms.", SAVE, OPEN_WO],
  [["Work order 1 opens for customer A with no Credit Hold banner."], [SHOT_R], ["Customer B's Edit Customer window opens."],
   ["Credit Terms reads Credit Hold."], ["The window closes."],
   ['The Credit Hold banner reads "' + M2.format(c="B") + '", with "Change Bill To".',
    "Every lines-table heading is in the same left-right place as in your screenshot: the table only moves down by the banner's height.",
    "The work order's tabs are in the same place as in your screenshot."]],
  ["S7-R6", "UFS-05"], P, note=NAME_NOTE,
  notes=("The design's before and after pictures (compared 13 Nov 2026) keep all 8 lines-table headings at the same left-right place; the "
         "table drops by the banner's height.",))

HIST2 = ("Have a new asset for this test, asset 1, now owned by customer A, that earlier belonged to customer C, with work order 1 for customer C "
         "billing itself (made first, while customer C owned it) and work order 2 for customer A billed to customer B (made later), both at the test location.")
P = ["bt-p7-02-after-whole-history.png", "bt-p7-03-after-customer-chip-open.png"]
N("D-99", "B-S08", "Design: Opening the Customer chip panel leaves the table headings in place",
  [ADMIN, W1440, cust("A", ", the asset's current owner"), cust("B", ", a payer"), cust("C", ", the asset's earlier owner"), HIST2, PICS(*P)],
  ["Open asset 1's Work Orders tab from customer A's page.", SHOT, 'Click the "Customer" filter chip.', "Click outside the panel."],
  [["Work order 1 and work order 2 are listed, with a \"Bill To\" column reading customer B's name on work order 2."], [SHOT_R],
   ["The panel opens over the table.", SAME_H], ["The panel closes; both work orders are still listed.", SAME_H]],
  ["S14-R2", "S14-R3"], P,
  notes=("The design's pictures with the panel closed and open (compared 13 Nov 2026) keep every visible heading at the same place.",))

P = ["bt-p7-10-after-work-orders-tab-top.png"]
N("D-100", "B-S12", "Design: Sorting the asset Work Orders tab keeps the Bill To column in place",
  [ADMIN, W1440, cust("A", ", the asset's owner"), cust("B", ", a payer"),
   "Have a new asset for this test, asset 1, owned by customer A, with three work orders at the test location: work order 1 billed to "
   "customer B, then work order 2 and work order 3 billing customer A, so a sort changes the order.", PICS(*P)],
  ["Open asset 1's Work Orders tab from customer A's page.", SHOT, "Click the work order number column header.", "Click the same header again."],
  [['A "Bill To" column shows after Customer: work order 1 reads customer B\'s name, work order 2 and work order 3 are blank.'], [SHOT_R],
   ["The rows are in work order number order.", 'The "Bill To" column still shows, with customer B\'s name on work order 1.', SAME_H],
   ["The rows are in the reverse order.", 'The "Bill To" column still shows, with customer B\'s name on work order 1.', SAME_H]],
  ["S14-R6", "S14-R1"], P,
  notes=("The design draws no sorted picture; a sort changes no row, so the column rule is unchanged. The place check follows the "
         "design-case checklist (layout stays put when the screen changes state).",))

# ---- held on the two new questions for Chris Ward (16 and 17) ----
P = ["bt-p5-02-after-a-j-invoices.png", "bt-p5-04-after-valders-open-only-off.png"]
N("D-101", "B-S07b", "Design: Service For column keeps its place when Open only is switched",
  [ADMIN, W1440, cust("A", ", the customer the work is for"), cust("B", ", the payer"),
   "Have a new work order for this test, work order 1, for customer A, invoiced, billed to customer B and paid in full, so it is not open.",
   "Have a new work order for this test, work order 2, for customer B, invoiced, unpaid, that bills itself.",
   "Open customer B's Invoices tab and make sure \"Open only\" is switched on.", PICS(*P)],
  [SHOT, 'Switch "Open only" off.', 'Switch "Open only" on.'],
  [["Only work order 2's invoice is listed.", 'A "Service For" column shows after No., blank on work order 2\'s row.', SHOT_R],
   ["Work order 1's invoice is listed too, with customer A's name under Service For.", SAME_H],
   ["Only work order 2's invoice is listed.", 'The "Service For" column still shows.', SAME_H]],
  ["S10-N1", "S10-R6"], P, marker=PO_HOLD(16),
  notes=("The PRD says the column is hidden when no row on the tab, before any search, is billed for someone else; it does not name the "
         "Open only switch, and the design draws the column moving Date, Type, No. and Memo when it appears. These results follow the "
         "suggested answer of question 16; the case is released or rewritten when Chris Ward answers.",))

P = ["bt-p7-02-after-whole-history.png", "bt-p7-04-after-one-customer-picked.png", "bt-p7-10-after-work-orders-tab-top.png"]
N("D-102", "B-S09", "Design: Picking a customer in the chip keeps the table headings in place",
  [ADMIN, W1440, cust("A", ", the asset's current owner"), cust("B", ", a payer"), cust("C", ", the asset's earlier owner"), HIST2, PICS(*P)],
  ["Open asset 1's Work Orders tab from customer A's page.", SHOT, 'Click the "Customer" filter chip.', "Tick customer C.", "Click outside the panel."],
  [['Work order 1 and work order 2 are listed; a "Bill To" column reads customer B\'s name on work order 2 and is blank on work order 1.'],
   [SHOT_R], ["The panel opens."], ["Customer C is ticked."],
   ["Only work order 1 is listed.", 'The "Bill To" column still shows, blank on work order 1.',
    "Every column heading of the table is in the same place as in your screenshot: none has moved left or right (the chip itself now shows customer C's name)."]],
  ["S14-R6", "S14-R4"], P, marker=PO_HOLD(17),
  notes=("The PRD's column rule does not say whether it counts the rows before or after a filter; the design draws no filtered list with "
         "the column, and its pictures with and without the column place the later headings 77 to 213 pixels apart. These results follow "
         "the suggested answer of question 17.",))

N("D-103", "B-S10", "Design: Choosing Imported in Status keeps the table headings in place",
  [ADMIN, W1440, cust("A", ", the asset's current owner"), cust("B", ", a payer"), cust("C", ", the asset's earlier owner"), HIST2,
   PICS("bt-p7-10-after-work-orders-tab-top.png")],
  ["Open asset 1's Work Orders tab from customer A's page.", 'Click the "Customer" filter chip.', "Tick customer C.", "Click outside the panel.",
   SHOT, "Add Imported to the Status filter."],
  [['Work order 1 and work order 2 are listed, with a "Bill To" column.'], ["The panel opens."], ["Customer C is ticked."],
   ["Only work order 1 is listed.", 'The "Bill To" column still shows, blank on work order 1.'], [SHOT_R],
   ['The "Customer" chip is disabled and reads "Customer: All customers".', "Work order 1 and work order 2 are listed again.",
    'The "Bill To" column shows customer B\'s name on work order 2.', SAME_H]],
  ["S14-N1", "S14-R6"], ["bt-p7-10-after-work-orders-tab-top.png"], marker=PO_HOLD(17),
  notes=("The design draws no Imported state. These results follow the suggested answer of question 17 (the column is decided from the "
         "asset's list before any filter).",))
