"""References from Design for the Credit terms cases (design pass, 23 Oct 2026; Rule 117 tenth amendment, Rule 130.3).
DREFS = {case key: {"pages": [...], "pictures": [...], "words": [...]}}
- pages: the canvas pages of "Default Credit Terms" (https://claude.ai/artifact/2erYxWz2ffDNcoXzEfu6wf, version 1792722751-b285) used,
  with the figure headings the tester compares against.
- pictures: the figure pictures rendered from the boards, in build/credit-terms/design-2026-10-23/images/ (one per figure; a figure that
  embeds a build or production screenshot is that screenshot with its caption).
- words: the design's own words, quoted verbatim. They are read here from the boards' extracted text (design-2026-10-23/extract/), so a
  word that is not on the board raises an error instead of being typed from memory.
Nothing from the design goes into the PRD quotes. A PRD case whose screen the design draws differently names the difference here by
quoting the design's version (register build/credit-terms/DESIGN-DIVERGENCE-REGISTER.json, CT-D01 … CT-D10).
Written and owned by the design worker; build.py checks every key and picture."""
import json, os
_X = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "design-2026-10-23", "extract")
_B = {}
for _f in os.listdir(_X):
    if _f.endswith(".dc.html.json"): _B[_f.split(".")[0]] = json.load(open(os.path.join(_X, _f)))

def cap(board, fig, start):
    """A caption item of a figure, verbatim (the item that starts with `start`)."""
    for c in _B[board]["figures"][fig - 1]["captions"]:
        if c.startswith(start): return c
    raise KeyError(f"{board} fig {fig}: no caption item starting {start!r}")

def txt(board, fig, t):
    """An on-screen text of a figure, verbatim (must be one of the figure's texts)."""
    if any(x["text"] == t for x in _B[board]["figures"][fig - 1]["texts"]): return t
    raise KeyError(f"{board} fig {fig}: no on-screen text {t!r}")

def head(board, fig):
    return _B[board]["figures"][fig - 1]["heading"]

PG = {1: "1 List and row menus", 2: "2 Move customers to another term", 3: "3 New credit term and Inactive tab",
      4: "4 Everything deactivated and an empty tab", 5: "5 New Customer", 6: "6 Customer on a deactivated term", 7: "7 Vendors",
      8: "8 Over Credit warning", 9: "9 Invoice due date"}
_BOARD = {1: "Main", 2: "Default", 3: "NewTerm", 4: "Empty", 5: "NewCustomer", 6: "Inactive", 7: "Vendor", 8: "OverCredit", 9: "Invoice"}
_IMG = os.path.join(os.path.dirname(_X), "images")
_PICS = sorted(os.listdir(_IMG))
def pic(page, fig):
    p = f"ct-p{page}-{fig:02d}-"
    m = [x for x in _PICS if x.startswith(p)]
    if len(m) != 1: raise KeyError(p)
    return m[0]

def R(figs, words=()):
    """figs: [(page, figure), ...]. Pages are named with the figure headings used."""
    pages, seen = [], {}
    for pg, f in figs: seen.setdefault(pg, []).append(f'"{head(_BOARD[pg], f)}"')
    for pg, hs in seen.items(): pages.append(f'page "{PG[pg]}" ({", ".join(hs)})')
    return {"pages": pages, "pictures": [pic(pg, f) for pg, f in figs], "words": list(words)}

M, DF, NT, EM, NC, IN, VE, OC, IV = "Main", "Default", "NewTerm", "Empty", "NewCustomer", "Inactive", "Vendor", "OverCredit", "Invoice"
W_ORDER = cap(M, 1, "Order: COD, Due on Receipt")
W_DUE = cap(M, 1, "Due wording:")
W_COLS = cap(M, 1, "One table per tab")
W_ICONS = cap(M, 1, "COD, Due on Receipt and Credit Hold are followed by")
W_COUNTS = cap(M, 1, "The Customers and Vendors columns")
W_HEADER = cap(M, 1, "The default row carries")
W_PERM = cap(M, 1, "Permissions:")
W_TABS = cap(M, 1, "Source: Payment Methods uses native tabs")
W_DOR_DESIGN = txt(M, 2, "Payment is due on the invoice date, but you can create the invoice without taking payment.")

DREFS = {}
def D(key, figs, words=()): DREFS[key] = R(figs, words)

# ---- Story 1: page and list
D("S1-01", [(1, 1)], [W_HEADER, W_PERM])
D("S1-02", [(1, 1), (4, 2)], [W_COLS])
D("S1-03", [(1, 1)], [W_ORDER])
D("S1-04", [(4, 2)], [cap(EM, 2, "Every deactivated term")])
for k in ("S1-05", "S1-06", "S1-07", "S1-08", "S1-09"):
    D(k, [(1, 1)], [W_COLS])        # the table the sort acts on; no board draws a sorted state (register CT-N05)
D("S1-10", [(1, 1)], [W_DUE])
D("S1-11", [(1, 1)], [W_DUE])
D("S1-12", [(1, 3)], [txt(M, 3, "Cash on delivery. COD customers can't charge to account, so payment is taken when the invoice is created.")])
D("S1-13", [(1, 2)], [W_DOR_DESIGN, cap(M, 2, "Only COD, Due on Receipt and Credit Hold have the info icon.")])   # CT-D01: the design's words differ
D("S1-14", [(1, 2)], [cap(M, 2, "Credit Hold:")])
D("S1-15", [(1, 1)], [W_ICONS])
D("S1-16", [(1, 1)], [cap(M, 2, "Only COD, Due on Receipt and Credit Hold have the info icon.")])
D("S1-17", [(1, 1), (1, 6)], [W_HEADER])
D("S1-18", [(1, 10)], [cap(M, 10, "The Default badge moves to Net 30.")])
D("S1-19", [(1, 1)], [W_COUNTS])
D("S1-20", [(1, 12)], [cap(M, 12, "Rendered from the local build with")])
D("S1-23", [(4, 3)], [cap(EM, 3, "With nothing inactive the table shows one line:"), cap(EM, 3, "No build shot:")])   # CT-D02
D("S1-24", [(1, 6), (2, 9)], [cap(M, 6, "Rendered from the local build, where COD is the default")])
D("S1-25", [(4, 1), (4, 2)], [cap(EM, 1, "What stays:")])
# ---- Story 2: row menus
D("S2-01", [(1, 6)], [cap(M, 6, "Rendered from the local build, where COD is the default"), cap(M, 6, "COD, Due on Receipt and Credit Hold never show Deactivate")])
D("S2-02", [(2, 9)], [cap(DF, 9, "A user with Settings")])
D("S2-04", [(1, 8)], [cap(M, 8, "Here Net 30 is the default.")])
D("S2-06", [(1, 5)], [cap(M, 5, "Rendered from the local build: Net 15.")])
D("S2-07", [(3, 5)], [cap(NT, 5, "Rendered from the local build: Inactive tab, Net 7.")])
D("S2-08", [(1, 8)], [cap(M, 8, "Here Net 30 is the default.")])
D("S2-09", [(1, 4)], [cap(M, 4, "Rendered from the local build: Net 6"), cap(M, 4, "The menu is as wide as its items.")])
D("S2-10", [(1, 7)], [cap(M, 7, "Rendered from the local build: 10th of next month")])
D("S2-13", [(1, 7)], [cap(M, 7, "Rendered from the local build: 10th of next month")])
D("S2-14", [(1, 7)], [cap(M, 7, "Rendered from the local build: 10th of next month")])
D("S2-15", [(1, 7)], [cap(M, 7, "Rendered from the local build: 10th of next month")])
D("S2-16", [(1, 8)], [cap(M, 8, "Here Net 30 is the default.")])
D("S2-20", [(1, 9)], [txt(M, 9, "Make Net 30 the default?"), txt(M, 9, "New customers start on Net 30. Customers you already have keep their current term."), cap(M, 9, "No option to move existing customers here")])
D("S2-21", [(1, 10)], [txt(M, 10, "Net 30 is now the default"), txt(M, 10, "New customers start on Net 30."), cap(M, 10, "The Default badge moves to Net 30.")])
D("S2-22", [(4, 1), (4, 2)], [cap(EM, 2, "Every deactivated term")])
D("S2-23", [(6, 2), (6, 4)], [cap(IN, 2, "The shop deactivated Net 10."), cap(IN, 4, "Credit Terms stays on")])
D("S2-24", [(3, 5)], [cap(NT, 5, "Rendered from the local build: Inactive tab, Net 7.")])
D("S2-25", [(1, 11)], [cap(M, 11, "Rendered from the local build. Title"), cap(M, 11, "On confirm the term leaves the page")])
D("S2-28", [(1, 12)], [cap(M, 12, "Toast in the capture:")])
# ---- Story 3: New / Edit Credit Term
D("S3-01", [(3, 1)], [cap(NT, 1, "New Credit Term opens this window."), cap(NT, 1, "Only the selected option's box is active")])
D("S3-02", [(3, 1), (3, 2)], [cap(NT, 1, "Only the selected option's box is active"), cap(NT, 2, "Day is active with 10;")])
D("S3-03", [(3, 1)], [txt(NT, 1, "Net 14 Days means payment is due 14 days after the invoice date. An invoice dated Oct 21 is due Nov 4."),
                      cap(NT, 1, "The sentence under the fields updates"), cap(NT, 3, "Other messages:")])           # CT-D03
D("S3-04", [(3, 2)], [txt(NT, 2, "10th of next month means payment is due on the 10th of the following month. An invoice dated Oct 21 is due Nov 10."),
                      cap(NT, 2, "The day field reads"), cap(NT, 3, "Other messages:")])                               # CT-D03
D("S3-05", [(3, 1)], [cap(NT, 1, "The sentence under the fields updates")])
D("S3-07", [(3, 3)], [cap(NT, 3, "Create Credit Term stays disabled")])
D("S3-08", [(1, 12)], [cap(M, 12, "Toast in the capture:")])
D("S3-10", [(3, 3)], [cap(NT, 3, "Other messages:"), cap(NT, 3, "Create Credit Term stays disabled")])                 # CT-D04
D("S3-11", [(3, 1), (3, 3)], [cap(NT, 1, "New Credit Term opens this window."), cap(NT, 3, "Create Credit Term stays disabled")])   # CT-D04
D("S3-12", [(3, 1), (1, 12)], [txt(NT, 1, "Up to 31 characters. Prints on invoices and goes to QuickBooks."), cap(M, 12, "Rendered from the local build with")])
D("S3-13", [(3, 3)], [txt(NT, 3, "Net 30 is already a standard term. Pick another name."), cap(NT, 3, "Names are compared ignoring capitals")])
D("S3-14", [(3, 3)], [cap(NT, 3, "Names are compared ignoring capitals")])
D("S3-15", [(3, 3)], [txt(NT, 3, "Enter 1 to 365 days.")])
D("S3-16", [(3, 3)], [cap(NT, 3, "Other messages:")])
D("S3-19", [(3, 4)], [cap(NT, 4, "Rendered from the local build: Edit on an unused term")])
D("S3-20", [(3, 4)], [cap(NT, 4, "Rendered from the local build: Edit on an unused term")])
D("S3-23", [(3, 1)], [txt(NT, 1, "Cancel")])
D("S3-24", [(1, 4)], [cap(M, 4, "Rendered from the local build: Net 6")])
# ---- Story 4: Move Customers
D("S4-01", [(2, 1), (2, 2)], [cap(DF, 1, "Rendered from the local build: Net 15"), cap(DF, 2, "Every customer on COD is listed and ticked."), cap(DF, 2, "The button names the count:")])
D("S4-02", [(2, 2)], [cap(DF, 2, "Every customer on COD is listed and ticked.")])
D("S4-05", [(2, 2), (2, 3)], [cap(DF, 2, "Search narrows the list;")])
D("S4-06", [(2, 4)], [cap(DF, 4, "Any active term can be picked."), cap(DF, 2, "\"Move To\" is prefilled")])
D("S4-08", [(2, 5)], [txt(DF, 5, "214 customers moved to Due on Receipt."), cap(DF, 5, "Toast:")])
D("S4-10", [(2, 5)], [cap(DF, 5, "Each moved customer gets a note")])
D("S4-12", [(2, 6), (2, 7), (2, 8)], [cap(DF, 6, "Rendered from the local build: moving from Net 7"), cap(DF, 7, "Rendered from the local build. Title"), cap(DF, 8, "Rendered from the local build after Cancel")])
D("S4-13", [(2, 7)], [cap(DF, 7, "Rendered from the local build. Title"), cap(DF, 5, "Each moved customer gets a note")])
D("S4-16", [(2, 3)], [cap(DF, 3, "Unticking customers lowers the count")])
D("S4-20", [(2, 2)], [cap(DF, 2, "The button names the count:")])
D("S4-26", [(2, 9)], [txt(DF, 9, "You need Customers → Create & Edit and View and Manage AP/AR Data to move customers."), cap(DF, 9, "A user with Settings")])
D("S4-27", [(2, 9)], [cap(DF, 9, "A user with Settings")])
D("S4-28", [(2, 9)], [cap(DF, 9, "A user with Settings")])
D("S4-24", [(3, 5)], [cap(NT, 5, "Rendered from the local build: Inactive tab, Net 7.")])
# ---- Story 5: New / Edit Customer
D("S5-01", [(5, 1), (5, 2)], [cap(NC, 2, "For a user with View and Manage AP/AR Data."), cap(NC, 2, "Credit Limit now sits beside it")])
D("S5-02", [(5, 3)], [cap(NC, 3, "The picker lists the active terms"), cap(NC, 3, "The shop default (Due on Receipt) carries")])
D("S5-03", [(5, 4)], [txt(NC, 4, "COD and Credit Hold customers can't charge to account, so they have no credit limit."), cap(NC, 4, "Picking COD or Credit Hold sets")])
D("S5-04", [(5, 4), (6, 6)], [cap(NC, 4, "Picking COD or Credit Hold sets"), cap(IN, 6, "On COD or Credit Hold the Credit Limit is")])
D("S5-05", [(5, 4)], [cap(NC, 4, "Picking any other term makes the field editable again")])
D("S5-09", [(6, 2), (6, 4)], [cap(IN, 2, "The shop deactivated Net 10."), cap(IN, 2, "Invoices still print plain"), cap(IN, 4, "Credit Terms stays on")])
D("S5-10", [(6, 5), (6, 7)], [cap(IN, 5, "The active terms, then this customer's own"), cap(IN, 7, "A customer not on Net 10")])   # CT-D10
D("S5-16", [(5, 5)], [cap(NC, 5, "No Credit Terms and no Credit Limit field.")])
D("S5-17", [(5, 5)], [cap(NC, 5, "No Credit Terms and no Credit Limit field.")])
D("S5-18", [(5, 5)], [cap(NC, 5, "No Credit Terms and no Credit Limit field.")])
D("S5-26", [(5, 4)], [cap(NC, 4, "On touch screens a tap")])
D("S11-08", [(6, 6)], [cap(IN, 6, "On COD or Credit Hold the Credit Limit is")])
# ---- Story 6: vendors
D("S6-01", [(7, 2), (7, 4)], [cap(VE, 2, "One term list for customers and vendors"), cap(VE, 4, "The same list and order")])
D("S6-02", [(7, 1), (7, 2)], [cap(VE, 2, "A new vendor starts on COD")])
D("S6-03", [(7, 6), (7, 7), (7, 8)], [cap(VE, 6, "The shop deactivated Net 10."), cap(VE, 7, "Credit Terms stays on"), cap(VE, 8, "A vendor not on Net 10")])
D("S6-04", [(7, 2)], [cap(VE, 2, "Credit Limit: vendors have a required Credit Limit field.")])
# ---- Story 7: due dates
D("S7-02", [(7, 9), (7, 10), (7, 11)], [cap(VE, 9, "Captured on the branch build: layout unchanged from production. Invoice Aug 31"), cap(VE, 10, "Same date rule"), cap(VE, 11, "A shop's own Net X term")])
D("S7-06", [(6, 2)], [cap(IN, 2, "Invoices still print plain")])
for k, figs in (("DATA-02", [(7, 11)]), ("DATA-03", [(9, 2), (9, 3)]), ("DATA-04", [(9, 3)])):
    D(k, figs, [cap(IV, 3, "Always the next month,")] if k != "DATA-02" else [cap(VE, 11, "A shop's own Net X term")])
D("DATA-01", [(9, 1)], [cap(IV, 1, "Captured on the branch build: the invoice layout is unchanged")])
# ---- Story 9: Over Credit
D("S9-01", [(8, 1), (8, 3)], [cap(OC, 1, "The dialog itself does not change."), cap(OC, 3, "Only when a credit limit above $0"), cap(OC, 3, "Source: CustomerWarningDialog.vue")])   # CT-D06
D("S9-02", [(9, 1)], [cap(OC, 3, "Part sales show no over-credit confirmation")])          # CT-D07: today's badge reads "Over Limit"
D("S9-03", [(8, 3)], [cap(OC, 3, "Part sales show no over-credit confirmation")])
D("S9-04", [(8, 2)], [cap(OC, 2, "Save opens the work order.")])
D("S9-05", [(8, 2)], [cap(OC, 2, "Save opens the work order."), cap(OC, 1, "In production this same dialog")])
D("S9-06", [(8, 2)], [cap(OC, 2, "Save opens the work order.")])
D("S9-07", [(8, 2)], [cap(OC, 2, "Credit Hold keeps its own, separate warning")])
D("S9-09", [(8, 3)], [cap(OC, 3, "Only when a credit limit above $0")])
# ---- Story 11 / 12
D("S11-01", [(1, 6)], [cap(M, 6, "Rendered from the local build, where COD is the default")])
D("S11-10", [(4, 3)], [cap(EM, 3, "No build shot:")])
D("S12-01", [(1, 13), (1, 14)], [cap(M, 13, "Rendered from the local build: the page"), cap(M, 14, "Columns Event, User, Details")])
D("S12-02", [(1, 14)], [cap(M, 14, "Columns Event, User, Details")])
for k in ("S12-03", "S12-04", "S12-05", "S12-06", "S12-07", "S12-10", "S12-15"):
    D(k, [(1, 14)], [cap(M, 14, "Columns Event, User, Details")])
D("S12-16", [(1, 15)], [cap(M, 15, "Rendered from the local build with no log rows")])
D("S12-19", [(1, 16)], [cap(M, 16, "Rendered from the local build with the log request failing."), cap(M, 16, "Differs from the PRD:")])   # CT-D08 (caption older than PRD v3)
