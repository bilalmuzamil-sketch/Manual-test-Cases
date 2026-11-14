"""Rule 137 for the Admin sign-in line (consolidation, 14 Nov 2026).

The coordinator's sample read found RPT-40 asking for an Admin role with 'Customers — Create & Edit', 'Work Orders — Order Parts',
'Work Order Lines — Create & Edit' and 'Part Sales — Create & Edit' although its steps only open two reports' Category filters: the
authors had pasted one long sign-in constant into every case of a file. Every precondition must be needed to perform a step, to make a
record the case relies on, or to judge a result (Rule 137 point 1).

needed(pre, steps, results) works out which permissions a case really uses, from the PRD's own Permissions table (section 4, TP-PERM-1
to TP-PERM-12) and Story 16 (S16-R4, S16-R5, S16-R8, S9-R15):
  'Reports — Page Access'            a report is opened (TP-PERM-12)
  'Settings — Parts'                 Settings › Pricing or Settings › Categories is opened, or the case makes a tier, a matrix or a
                                     category for the test (TP-PERM-1, TP-PERM-4), or uses a tier's Customers tab / Manage Customers
                                     (TP-PERM-6, TP-PERM-7)
  'See Financial Data'               tiers, matrices, rules, the simulator, the Audit Log or category pricing (TP-PERM-1, 2, 5, 6, 7),
                                     or a line's cost, sell price, Priced by or price details (TP-PERM-10, TP-PERM-11). Not for a report
                                     alone (TP-PERM-12: the one exception to S16-R5)
  'Customers — View'                 a customer page or a tier's Customers tab is opened (TP-PERM-6, TP-PERM-9)
  'Customers — Create & Edit'        the case makes a customer, puts one on a tier, or opens Edit Customer, New Customer or Manage
                                     Customers (TP-PERM-7, TP-PERM-8)
  'View and Manage AP/AR Data'       the customer card's pricing section is read (TP-PERM-9, S9-R15)
  'Work Orders — Order Parts'        a work order with parts is made or opened (TP-PERM-10)
  'Work Order Lines — Create & Edit' a work order line or part is made or changed (TP-PERM-11)
  'Part Sales — Create & Edit'       a Part Sale is made or opened (TP-PERM-11)
tp_lib.C() rewrites every "Sign in as an Admin whose role has …" line to exactly this list (the cases' other sign-in lines, the
permission tests of Story 16, are written by hand and left as they are); build.py gates the result."""
import re

ORDER = ["Reports — Page Access", "Settings — Parts", "See Financial Data", "Customers — View", "Customers — Create & Edit",
         "View and Manage AP/AR Data", "Work Orders — Order Parts", "Work Order Lines — Create & Edit", "Part Sales — Create & Edit"]
ADMIN_RX = re.compile(r"^Sign in as an Admin whose role has .*\.$")

MAKES_PRICING = re.compile(r"\bnew (archived )?tiers?\b|\btiers? [A-Z](, [A-Z])*( and [A-Z])? (with|whose)|\bnew matri(x|ces)\b|priced by a new matrix"
                           r"|pricing a new category|\bGeneral Matrix\b|\bmatrix [A-Z]\b|\bDefault('s)? (column|rule)|Markup %|Margin %|% Off|\$ Off"
                           r"|\bcost range|\btier [A-Z]\b", re.I)
MAKES_CATEGORY = re.compile(r"\bnew categor(y|ies)\b|\bcategories [A-Z] and [A-Z]\b|\bcategory [A-Z]\b", re.I)
SETTINGS_PAGES = re.compile(r"Settings ›|\bOpen Settings\b|Tiers tab|Matrices tab|Fixed Rules|Price Part Simulator|Audit Log|tier [A-Z]'s (row|page|name|Customers|Pricing|three-dot)"
                            r"|matrix [A-Z]'s|Manage Customers|Categories list|category [A-Z]'s (row|page)|Uncategorized's (row|page)|\bNew (Tier|Matrix|Category)\b")
PRICING_PAGES = re.compile(r"Settings › Pricing|Settings › Categories|Tiers tab|Matrices tab|Price Part Simulator|Audit Log|tier [A-Z]'s|matrix [A-Z]'s|Manage Customers|"
                           r"\bNew (Tier|Matrix)\b|Pricing Matrix|grid|Set Rule|General Matrix")
LINE_MONEY = re.compile(r"\bcost\b|sell price|Sell Price|Priced by|Priced By|price details|Manual icon|\bpriced\b|\bsells? at\b", re.I)
REPORT = re.compile(r"\bReports\b|Sales by (Tier|Category|Customer)|Sales By Customer")
CUST_PAGE = re.compile(r"\bOpen Customers\b|customer [A-Z]'s page|customer page|Customers list|from Customers|Customers tab|customer card|Open customer|the customer's page")
CUST_EDIT = re.compile(r"\bnew customers?\b|customers [A-Z](, [A-Z])*,? and [A-Z]\b|Edit Customer|New Customer|Manage Customers|put on tier|edit pencil|"
                       r"customer [A-Z], (on|put|left)|Counter Sale|a customer on it")
CARD = re.compile(r"customer card|card's pricing|Pricing section|pricing section|card shows|The card\b|the card\b")
WORK_ORDER = re.compile(r"\bwork order\b(?!s)|Tech View|Split Work Order|Quick Add|Add Part\b")
CUST_CARD_PAGE = re.compile(r"customer [A-Z]'s page|the customer's page|customer page\b")
CARD_WORDS = re.compile(r"Shop Supplies|[Ll]abor [Rr]ate|\bTax\b|Work Order Tier|Part Sales Tier|\btiers?\b|[Pp]ricing")
PART_SALE = re.compile(r"\bPart Sale\b(?! Matrix| pricing| side| Tier|s)")


def needed(pre, steps, results):
    """Permissions the case uses (ORDER order). pre: precondition lines without the Admin sign-in line."""
    P = " ".join(pre); S = " ".join(steps); R = " ".join(results); ALL = " ".join([P, S, R])
    want = set()
    report = bool(REPORT.search(P + " " + S))
    if report: want.add("Reports — Page Access")
    makes_pricing = bool(MAKES_PRICING.search(P))
    if SETTINGS_PAGES.search(P + " " + S) or makes_pricing or MAKES_CATEGORY.search(P): want.add("Settings — Parts")
    wo = bool(WORK_ORDER.search(P + " " + S)); ps = bool(PART_SALE.search(P + " " + S))
    if makes_pricing or PRICING_PAGES.search(S) or ((wo or ps) and (LINE_MONEY.search(ALL) or re.search(r"\bparts?\b", P + " " + S))) or (not report and LINE_MONEY.search(S + " " + R)):
        want.add("See Financial Data")
    if CUST_PAGE.search(P + " " + S) or CARD.search(S + " " + R) or re.search(r"Customers tab", P + S): want.add("Customers — View")
    if CUST_EDIT.search(P + " " + S): want |= {"Customers — Create & Edit", "Customers — View"}   # Edit Customer is reached from the customer page
    if CARD.search(S + " " + R) or (CUST_CARD_PAGE.search(S) and CARD_WORDS.search(R) and not re.search(r"Edit Customer|edit pencil", S)):
        want.add("View and Manage AP/AR Data")   # the customer card's pricing section (TP-PERM-9, S9-R15)
    if wo: want |= {"Work Orders — Order Parts", "Work Order Lines — Create & Edit"}
    if ps: want.add("Part Sales — Create & Edit")
    return [p for p in ORDER if p in want]


def line(perms):
    if not perms: return "Sign in as an Admin."
    q = [f"'{p}'" for p in perms]
    return "Sign in as an Admin whose role has " + (q[0] if len(q) == 1 else ", ".join(q[:-1]) + " and " + q[-1]) + "."


def listed(admin_line):
    return re.findall(r"'([^']+)'", admin_line)
