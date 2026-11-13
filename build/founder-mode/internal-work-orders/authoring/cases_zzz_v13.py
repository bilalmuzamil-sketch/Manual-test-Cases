"""Round 4 (13 Nov 2026): PRD v1.3 (12 Nov 2026, Milos Vasic) and design version 1794510020-d4ec, plus the fixes of the full read
(po-answers-2026-11-12/full-read/). Loaded after every other case module. PRD v1.2/v1.3: Close Work Order closes on one press with no
confirmation; "Posting date" and the posting summary sit on the Finance tab; a dialog opens only for a missing original work order or a
vendor bill cost move (S3-R1, S3-R2); the Settings tab keeps one hint line (S1-R3). Every change is listed per case in V13_CHANGES
(PASS-REPORT.md, Rule 134). Cases that only tested the removed Close confirmation are retired and proposed for deletion (RETIRE_V13)."""
import re
from iwo_lib import C, CASES, MARKER, NOMAN, CODE
from common import *

BY = {c["key"]: c for c in CASES}
V13_CHANGES = {}
RETIRE_V13 = {}
def _log(k, w): V13_CHANGES.setdefault(k, []).append(w)

OPEN = re.compile(r"^(In tab 1, c|C)lick Close Work Order( in the work order header| in the header| in the menu| on the Finance tab)?\.$|^Click the step's Close Work Order button\.$")
CONFIRM = re.compile(r"Close Work Order in the (confirmation|window)\.$")
TRIVIAL = {"The Close confirmation opens.", "The confirmation opens.", "The Close window opens."}


def one_press(c):
    """PRD v1.3 S3-R1: Close Work Order closes on the press. An 'open the confirmation' step whose only result is that the confirmation
    opens, followed by 'Click Close Work Order in the confirmation', becomes one step with the second step's results."""
    i = 0; n = 0
    while i < len(c["steps"]) - 1:
        if OPEN.search(c["steps"][i]) and c["res"][i] and all(r in TRIVIAL for r in c["res"][i]) and CONFIRM.search(c["steps"][i + 1]):
            c["res"][i] = c["res"][i + 1]; del c["steps"][i + 1]; del c["res"][i + 1]; n += 1
        i += 1
    if n: _log(c["key"], f"one press (S3-R1 v1.3): {n} 'open the confirmation' + 'Close Work Order in the confirmation' step pair(s) made one step")


for c in CASES: one_press(c)


SUMMARY_WORDS = [("The Close confirmation shows", "The posting summary shows"), ("The confirmation shows", "The posting summary shows"),
                 ("The confirmation reads", "The posting summary reads"), ("The confirmation lists", "The posting summary lists"),
                 ("The confirmation's sentence reads", "The sentence under the posting summary reads"),
                 ("The sentence reads", "The sentence under the posting summary reads"), ("The rows show", "The posting summary's rows show"),
                 ("\"This completes the work order, posts the parts cost and shop supplies to your books and marks it", "\"Closing posts the parts cost and shop supplies to your books and marks the work order"),
                 ("\"This posts the parts cost", "\"Closing posts the parts cost"), ("\"This marks the work order", "\"Closing marks the work order"),
                 ("A window titled \"Close work order [number]?\" opens with a posting date field set to today.", "The Finance tab shows the field \"Posting date\" set to today."),
                 ("The confirmation opens with today's date.", "The \"Posting date\" field shows today's date."),
                 ("The confirmation opens.", "The \"Posting date\" field shows today's date."), ("The Close confirmation opens.", "The \"Posting date\" field shows today's date.")]
FINANCE_STEP = "Open the Finance tab."
CLOSE_STEP = "Click Close Work Order on the Finance tab."


def summary_first(c, keep_dialog=False):
    """PRD v1.3 S3-R2: what the confirmation showed (posting date, rows, sentence) sits on the Finance tab before Close; the press closes.
    'Click Close Work Order' (whose result was the confirmation) + any middle steps + 'Click Close Work Order in the confirmation' become
    'Open the Finance tab' (the summary) + the middle steps + 'Click Close Work Order on the Finance tab' (the result after Close)."""
    st, rs = c["steps"], c["res"]; i = 0; n = 0
    while i < len(st):
        if OPEN.search(st[i]):
            j = next((x for x in range(i + 1, min(i + 4, len(st))) if CONFIRM.search(st[x])), None)
            if j is not None:
                summ = []
                for r in rs[i]:
                    for a, b in SUMMARY_WORDS: r = r.replace(a, b)
                    summ.append(r)
                fin_before = i > 0 and st[i - 1] == FINANCE_STEP
                new_st = ([] if fin_before else [FINANCE_STEP]) + st[i + 1:j] + [CLOSE_STEP]
                new_rs = ([] if fin_before else [summ]) + rs[i + 1:j] + [rs[j]]
                if fin_before: rs[i - 1] = rs[i - 1] + summ
                st[i:j + 1] = new_st; rs[i:j + 1] = new_rs; n += 1
                i += len(new_st); continue
        i += 1
    if n: _log(c["key"], f"posting summary first (S3-R2 v1.3): {n} Close confirmation sequence(s) rewritten as Finance tab summary, then one press")
    return n

DIALOG_CASES = {"S3-11", "S3-55", "S3-47", "S3-48", "REL-06", "API-25", "D-42", "D-44", "D-61", "S3-53", "S3-54"}
for c in CASES:
    if c["key"] not in DIALOG_CASES: summary_first(c)


def summary_only(c):
    """A step that opened the confirmation only to read it (no Close after it): the same rows are read on the Finance tab (S3-R2 v1.3)."""
    st, rs = c["steps"], c["res"]; n = 0
    for i in range(len(st)):
        if OPEN.search(st[i]) and not any(CONFIRM.search(x) for x in st[i + 1:i + 4]) and not all(r in TRIVIAL for r in rs[i]) \
                and re.search(r"confirmation|row|sentence|note|Posting date|posting date|Stock parts|Labor", " ".join(rs[i])) and "Closed" not in " ".join(rs[i]):
            out = []
            for r in rs[i]:
                for a, b in SUMMARY_WORDS: r = r.replace(a, b)
                out.append(r)
            if i > 0 and st[i - 1] == FINANCE_STEP:
                rs[i - 1] = rs[i - 1] + out; st[i] = None
            else:
                st[i] = FINANCE_STEP; rs[i] = out
            n += 1
    if n:
        keep = [k for k, s in enumerate(st) if s is not None]
        c["steps"] = [st[k] for k in keep]; c["res"] = [rs[k] for k in keep]
        _log(c["key"], f"posting summary (S3-R2 v1.3): {n} step(s) that opened the Close confirmation to read it now read the Finance tab")

for c in CASES:
    if c["key"] not in DIALOG_CASES: summary_only(c)


# ---- helpers for the per-case rewrites below ------------------------------------------------------------------------------------
def setc(k, why, title=None, pre=None, steps=None, res=None, q=None, marker=None, note=None):
    c = BY[k]
    if title is not None: c["title"] = title
    if pre is not None: c["pre"] = list(pre)
    if steps is not None: c["steps"] = list(steps); c["res"] = [list(r) for r in res]
    elif res is not None:
        for i, r in res.items(): c["res"][i - 1] = list(r)
    if q is not None: c["q"] = list(q)
    if marker is not None: c["marker"] = marker; c["held"] = marker.startswith("AUTOMATION: HOLD") or bool(c["banner"])
    if note is not None: c["note"] = note
    _log(k, why)


def rep(k, old, new, why):
    c = BY[k]; n = 0
    for lst in [c["pre"], c["steps"]] + c["res"]:
        for i, x in enumerate(lst):
            if old in x: lst[i] = x.replace(old, new); n += 1
    if old in c["title"]: c["title"] = c["title"].replace(old, new); n += 1
    if n < 1: raise KeyError(f"{k}: no place holds {old[:60]!r}")
    _log(k, f"{why}: {old[:70]!r} -> {new[:70]!r}")


def addq(k, *q):
    for x in q:
        if x not in BY[k]["q"]: BY[k]["q"].append(x)


def retire(k, why):
    RETIRE_V13[k] = why; BY[k]["marker"] = NOMAN("retired by PRD v1.3: " + why); BY[k]["held"] = True
    _log(k, "retired (proposed for deletion): " + why)


ADM = "Sign in as an Admin at the test location."
ON_ = "Make sure the Internal Work Orders setting is on in Settings > Work Orders."
NOINT = "Make sure the test location has no accounting integration (neither QuickBooks Online nor AccountingHub)."
QBON = "Make sure the test location is connected to QuickBooks Online, with Inventory Asset and Cost of Parts mapped on its ShopView Accounts page, and that AccountingHub is not enabled."
NOREV = "Make sure Require Review Before Completion is off in Settings > Work Orders."
HINT_START = "Manage categories in Internal Work Orders (Administration > Service). Their expense accounts are set there"

# ---- Settings: one hint line (S1-R3, S1-R4, S1-R10 v1.3) -----------------------------------------------------------------------------
for k, a, b in [("S1-03", "The hint lines show under the description.", "The hint line shows under the description."),
                ("S1-04", "Under the description the first hint reads", "Under the description the hint reads"),
                ("S1-07", "the hint lines are gone", "the hint line is gone"),
                ("S1-20", "its description and the hint lines", "its description and the hint line"),
                ("S1-38", "The hint lines show under the toggle's description.", "The hint line shows under the toggle's description."),
                ("S1-38", "The hint lines are gone.", "The hint line is gone."),
                ("INV-06", "no hint lines show", "no hint line shows")]:
    rep(k, a, b, "one hint line (S1-R3 v1.3)")
rep("S1-38", "hides the hints and badges", "hides the hint and badges", "one hint line (S1-R3 v1.3)")
setc("S1-10", "rewritten: one hint line (S1-R3 v1.3); the second line is gone", title="With QuickBooks connected, the one hint line names QuickBooks with its links",
     steps=["Open Settings > Work Orders.", "Click the \"Internal Work Orders\" link in the hint line."],
     res=[["One hint line shows under the description, with an info icon and the green QuickBooks mark.",
           "It reads \"Manage categories in Internal Work Orders (Administration > Service). Their expense accounts are set there or in Integrations > QuickBooks.\"",
           "\"Internal Work Orders\" and \"QuickBooks\" are links.", "There is no second hint line."],
          ["Administration > Service > Internal Work Orders opens."]])
setc("S1-10b", "rewritten: the QuickBooks link now sits in the one hint line (S1-R3 v1.3)", title="The QuickBooks link in the hint opens Integrations > QuickBooks",
     steps=["Open Settings > Work Orders.", "Click the \"QuickBooks\" link in the hint line."],
     res=[["The hint reads \"Manage categories in Internal Work Orders (Administration > Service). Their expense accounts are set there or in Integrations > QuickBooks.\""],
          ["Integrations > QuickBooks opens."]])
setc("S1-11", "rewritten: the one hint line names Account Mappings (S1-R3 v1.3)", title="With AccountingHub only, the hint names Account Mappings",
     res={1: ["The one hint line names Accounting > Account Mappings instead of Integrations > QuickBooks.", "No QuickBooks mark or link shows in it.", "There is no second hint line."]})
setc("S1-12", "rewritten: the one hint line names both (S1-R3 v1.3)", title="With both integrations, the hint names both",
     res={1: ["The one hint line names both Integrations > QuickBooks and Accounting > Account Mappings.", "There is no second hint line."]})
setc("S1-13", "rewritten: with neither integration the hint ends at \"set there.\" (S1-R3 v1.3); precondition names the organization-wide AccountingHub setting (full read)",
     title="With no accounting integration, the hint ends at set there",
     pre=[ADM, ON_, "Make sure AccountingHub is not enabled for the organization and the test location is not connected to QuickBooks Online.",
          "Make sure no other location of the organization is connected to QuickBooks Online.",
          "Have a new customer for this test, customer A, flagged as an Internal customer, so the no-customer hint is not shown."],
     res={1: ["One hint line shows: \"Manage categories in Internal Work Orders (Administration > Service). Their expense accounts are set there.\"", "No line about mapping expense accounts shows."]})
setc("S1-14", "rewritten: 'first hint' -> the hint (S1-R4 v1.3); a step opens customer A's page (full read)",
     steps=["Open Settings > Work Orders.", "Open customer A's page.", "Click Edit Customer on customer A's page.", "Tick the \"Internal customer\" checkbox.", "Click Save.", "Open Settings > Work Orders."],
     res=[["The hint reads \"No internal customer yet. Work orders for your own equipment stay billable until you flag one: Edit Customer > Internal customer. No Charge on customer work orders works now.\"",
           "Nothing on the tab is marked as required and no control on it is greyed out because of the hint."],
          ["Customer A's page opens."], ["The Edit Customer window opens."], ["The checkbox is ticked and \"Default internal category\" appears under it."],
          ["The window closes and customer A shows the \"Internal\" badge."], [f"The hint now begins \"{HINT_START}\"."]])
setc("S1-87", "rewritten: one hint line (S1-R3 v1.3)", title="The hint line appears only after Save settings",
     res={1: ["The toggle is off and no hint line shows."], 2: ["The toggle shows on, and the hint line is not shown yet."], 3: ["The hint line shows under the description."]})

# ---- Close: the cases the generic rewrite could not settle (S3-R1, S3-R2, S3-R3, S3-E1, S3-E4, S3-E5 v1.3) ----------------------------
setc("S3-02", "one press (S3-R1 v1.3)", res={3: ["The work order closes at once, with no confirmation window: the status reads Closed."]})
setc("S3-07", "rewritten: the posting date and the posting summary sit on the Finance tab (S3-R2 v1.3)",
     title="The Finance tab shows the posting date and the posting summary before Close",
     steps=["Open work order 1.", "Open the Finance tab."],
     res=[["Work order 1 opens."],
          ["The field \"Posting date\" shows today's date.", "A row reads \"Stock parts $80.00\" (2 × $40.00) with the note \"Posted to [General Internal's account]\".",
           "A row reads \"Labor 2.0 h\" with the note \"Hours only, nothing posted\".",
           "A row reads \"Shop supplies $15.00\" with the note \"Posted to [General Internal's account], credited to [the income account of the Shop supplies item]\".",
           "No special orders row shows, since there are none.",
           "Under the rows it reads \"Closing posts the parts cost and shop supplies to your books and marks the work order Closed · Internal. You can reopen it later.\"",
           "The preview of the work order's document shows under the posting summary."]])
setc("S3-08", "rewritten: v1.3 has one sentence; a press on a work order that is not Complete completes and closes it (S3-R3 v1.3)",
     title="Close on a work order that is not Complete completes and closes it",
     res={3: ["The work order is completed and closed on the press, with no confirmation window: the status reads Closed."]}, q=["S3-R3", "S3-R1"])
setc("S3-09", "rewritten: the no-charge sentence sits under the posting summary; Goodwill closes with no window (S3-R2 v1.3)",
     title="A no-charge work order's posting summary says Closed · No Charge",
     steps=["Open work order 1.", "Open the Finance tab.", "Click Close Work Order on the Finance tab."],
     res=[["Work order 1 opens."],
          ["Under the posting summary it reads \"Closing posts the parts cost and shop supplies to your books and marks the work order Closed · No Charge. You can reopen it later.\""],
          ["The work order closes with no window: Goodwill never asks for the original work order.", "The status reads Closed with the \"No Charge\" badge."]])
setc("S3-11", "rewritten: the move shows on the posting summary, and Close opens the cost move window (S3-R2 (2) v1.3)",
     title="A bill posted to Cost of Parts is moved at Close in the cost move window",
     steps=["Open work order 1.", "Open the Finance tab.", "Click Close Work Order on the Finance tab.", "Click Close Work Order in the window."],
     res=[["Work order 1 opens with the \"Internal\" badge."],
          ["A row reads \"Special orders and sublet $125.00\" with the note \"Moved from Cost of Parts to [General Internal's account]\"."],
          ["A window \"Close work order [number]?\" opens with one row \"Moved from Cost of Parts to [General Internal's account] $125.00\" and the buttons \"Cancel\" and \"Close Work Order\"."],
          ["The work order shows the status Closed."]], q=["S3-R2", "UFS-17"])
setc("S3-15", "rewritten: the original work order is asked in the Close window, the only Close dialog with S3-R2 (2) (S3-R2 (1) v1.3)",
     steps=["Open work order 1.", "Click Close Work Order in the work order header.", "Pick \"Not in ShopView\" in \"Original work order\"."],
     res=[["Work order 1 opens."],
          ["A window \"Close work order [number]?\" opens with the select \"Original work order *\" and \"Original line\".",
           "The warning reads \"Warranty requires the original work order. Pick the earlier work order this job comes from, or Not in ShopView.\"",
           "\"Close Work Order\" in the window is disabled."],
          ["\"Close Work Order\" in the window is enabled."]], q=["S3-R2", "S2-R17", "UFS-16"])
setc("S3-31", "rewritten: one press (S3-R1 v1.3)", steps=["Open work order 1.", "Click Close Work Order in the work order header."],
     res=[["Work order 1 opens."], ["The work order closes with no window and without asking for a Customer PO: the status reads Closed."]])
rep("S3-44", "\"Parts cost $0.00\"", "\"Stock parts $0.00\"", "S3-E1 v1.3")
rep("S3-44", "shows Parts cost $0.00", "shows Stock parts $0.00", "S3-E1 v1.3")
setc("S3-46", "rewritten: the sentence sits under the posting summary and reads \"Closing marks…\" (S3-E4 v1.3); the 'not yet Complete' variant is gone in v1.3",
     title="Without an accounting integration the posting summary names the report",
     pre=[ADM, ON_, NOINT, NOREV, "Have a new customer for this test, customer A, flagged as an Internal customer.",
          "Have a new internal work order for this test, work order 1, for internal customer A, in status Complete, with one approved line with one stock part picked from inventory at a cost of $40.00 each, quantity 2."],
     steps=["Open work order 1.", "Open the Finance tab.", "Click Close Work Order on the Finance tab."],
     res=[["Work order 1 opens."],
          ["The posting summary's rows show no account notes.",
           "Under them it reads \"Closing marks the work order Closed · Internal (Closed · No Charge). Parts cost, shop supplies and hours are available in the Internal Work Orders report.\""],
          ["The work order closes with no window: the status reads Closed."]])
setc("S3-47", "rewritten: v1.3 refuses only while a Close window is open (S3-E5 v1.3); the original work order window is used",
     title="Close is refused when the work order changed while its Close window is open",
     pre=[ADM, ON_, NOINT, NOREV, "Have a new customer for this test, customer A.",
          "Have a new No Charge work order for this test, work order 1, for customer A, category Warranty, in status Complete, with no original work order, whose Shop supplies amount is $15.00.",
          "Open work order 1 in two browser tabs, tab 1 and tab 2."],
     steps=["In tab 1, click Close Work Order in the header.", "In tab 1, pick \"Not in ShopView\" in \"Original work order\".",
            "In tab 2, change \"Shop supplies\" to $20.00.", "In tab 1, click Close Work Order in the window."],
     res=[["The window \"Close work order [number]?\" opens in tab 1 and asks for the original work order."], ["\"Close Work Order\" in the window is enabled."],
          ["Tab 2 saves the new amount."], ["Tab 1 shows the inline error \"This work order changed. Review and close again.\"", "Work order 1 is not closed."]],
     q=["S3-E5", "UFS-31", "S3-R2"])
# S3-48 is NOT retired (13 Nov 2026, second reading): Jira SV-11976 item 5 still applies under v1.3, through the original work order window
# (S3-R2 (1)) on a work order Close has to complete first. Rewritten to that path.
setc("S3-48", "rewritten: the refusal happens in the original work order window (S3-E5, S3-R2 (1) v1.3); the work order stays where it was (Jira SV-11976 item 5)",
     pre=[ADM, ON_, NOINT, "Make sure Require Review Before Completion is off in Settings > Work Orders.", "Have a new customer for this test, customer A.",
          "Have a new No Charge work order for this test, work order 1, for customer A, category Warranty, with no original work order, in status In Progress, with every line done but the work order not yet Complete, whose Shop supplies amount is $15.00.",
          "Open work order 1 in two browser tabs, tab 1 and tab 2."],
     steps=["In tab 1, open the work order's three-dots menu.", "In tab 1, click Close Work Order in the menu.", "In tab 1, pick \"Not in ShopView\" in \"Original work order\".",
            "In tab 2, change \"Shop supplies\" to $20.00.", "In tab 1, click Close Work Order in the window.", "Reload tab 1."],
     res=[["The menu shows \"Close Work Order\"."], ["The window \"Close work order [number]?\" opens in tab 1 and asks for the original work order."],
          ["\"Close Work Order\" in the window is enabled."], ["Tab 2 saves the new amount."],
          ["Tab 1 shows the error \"This work order changed. Review and close again.\""], ["Work order 1 is still In Progress: not Complete and not Closed."]],
     q=["S3-E5", "S3-R2", ("Jira SV-11976", "A refused or failed Close leaves the work order where it was (not Complete), even when Close ran the completion steps.")])
setc("S3-49", "rewritten: one press with today's posting date on the Finance tab (S3-R1, S3-R2 v1.3)", title="Closing is one press with today's posting date by default",
     steps=["Open work order 1.", "Open the Finance tab.", "Click Close Work Order on the Finance tab.", "Open the Finance tab."],
     res=[["Work order 1 opens."], ["The field \"Posting date\" shows today's date."], ["The work order closes at once, with no confirmation window: the status reads Closed."],
          ["The document's date is today."]], q=["KD-ONEPRESS", "S3-R1", "S3-R2", "T-PDATE"])
setc("S3-55", "rewritten: the original is picked in the Close window (S3-R2 (1) v1.3)",
     steps=["Open work order 1.", "Click Close Work Order in the work order header.", "Pick work order 2 in \"Original work order\".", "Click Close Work Order in the window."],
     res=[["Work order 1 opens."], ["The window \"Close work order [number]?\" opens with \"Original work order *\"; its \"Close Work Order\" is disabled."],
          ["\"Close Work Order\" in the window is enabled."], ["The work order is Closed and the document reads \"Category: Warranty · Original work order [work order 2's number]\"."]])
addq("S3-55", "UFS-16")
setc("S4-10", "one press (S3-R1 v1.3); full read: the result now says what the tester sees",
     steps=BY["S4-10"]["steps"][:5] + ["Click Close Work Order in the work order header."],
     res=BY["S4-10"]["res"][:5] + [["The work order closes with no window as internal: the status reads Closed with the \"Internal\" badge."]])
setc("API-25", "rewritten: v1.3 refuses only while a Close window is open (S3-E5); the original work order window is used",
     pre=["Use an Open API key for the test organization, the Open API documentation, and a tool that sends API requests.", ON_, NOINT, NOREV,
          "Have a webhook subscription for the test organization pointed at a request-catching page the tester can read. Subscribe it to work_order.status_changed.",
          "Have a new customer for this test, customer A.",
          "Have a new No Charge work order for this test, work order 1, for customer A, category Warranty, in status Complete, with no original work order, whose Shop supplies amount is $15.00.",
          "Open work order 1 in two browser tabs, tab 1 and tab 2."],
     steps=["In tab 1, click Close Work Order in the header.", "In tab 1, pick \"Not in ShopView\" in \"Original work order\".", "In tab 2, change \"Shop supplies\" to $20.00.",
            "In tab 1, click Close Work Order in the window.", "Open the request-catching page to read the webhook requests."],
     res=[["The window \"Close work order [number]?\" opens in tab 1."], ["\"Close Work Order\" in the window is enabled."], ["The amount is saved."],
          ["Tab 1 shows \"This work order changed. Review and close again.\""], ["No work_order.status_changed arrived for work order 1."]])
setc("REL-06", "rewritten: one press with the cost move window (S3-R2 (2) v1.3); full read: internal customer and setting given, Change Customer split, Continue step added",
     pre=["Sign in as an Admin at the test location.", "Use the production test account.", ON_,
          "Have access to the QuickBooks Online company of the test location, so its journal entries can be read.",
          "Have a new customer for this test, customer A.", "Have a new customer for this test, customer B, flagged as an Internal customer.",
          "Have a new work order for this test, work order 1, for customer A, in status Complete, billable, whose special-order part's vendor bill of $125.00 was posted to Cost of Parts before the release."],
     steps=["After the release, open work order 1.", "Click \"Change Customer\" on the customer card.", "Pick customer B.", "Click \"Continue\".", "Open the Finance tab.",
            "Click Close Work Order on the Finance tab.", "Click Close Work Order in the window.", "In QuickBooks Online, open the journal entries for work order 1's number."],
     res=[["Work order 1 opens, billable."], ["The customer picker opens."], ["The window \"Change where the cost is posted?\" opens."], ["Work order 1 shows the \"Internal\" badge."],
          ["The posting summary shows the special order with the note \"Moved from Cost of Parts to [the category's account]\"."],
          ["A window \"Close work order [number]?\" opens with one row \"Moved from Cost of Parts to [the category's account] $125.00\"."],
          ["The work order is Closed."], ["A reclass entry moves $125.00 from Cost of Parts to the category's account."]], q=["S7-R4", "S3-R2", "S2-R8", "TP-633"])

# ---- design cases on the 15 redrawn boards (design 1794510020-d4ec) and the new held design version -------------------------------
import design_refs as DR
NEW_DESIGN = []
DPRE = ["Sign in as an Admin (a user with every setting, See Financial Data included).", "Use a desktop browser window 1440 pixels wide at 100% zoom.",
        "Have Internal Work Orders turned on in Settings > Work Orders."]
QBD = "Use a location that is connected to QuickBooks Online, with every ShopView Accounts row mapped."
INTC = "Have a customer flagged as Internal customer, with one asset, and its default internal category left at General Internal."
def pics_pre(k): return "Open the attached picture%s %s at 100%% zoom beside the screen." % ("s" if len(DR.DREFS[k]["pictures"]) > 1 else "", ", ".join(DR.DREFS[k]["pictures"]))
def dref(k, words=None, notes=None):
    if words is not None: DR.DREFS[k]["words"] = list(words)
    if notes is not None: DR.DREFS[k]["notes"] = list(notes)
CLOSE_SENT = "Closing posts the parts cost and shop supplies to your books and marks the work order Closed · Internal. You can reopen it later."

setc("D-03", "rewritten: one hint line (S1-R3 v1.3; board redrawn)", title="Design: Work Orders settings with Internal Work Orders on show one hint line",
     pre=DPRE + [QBD, "Have at least one customer flagged as Internal customer.", pics_pre("D-03")],
     res={1: ["The Internal Work Orders toggle is on, with its description under the name.",
              "One grey hint line sits under the description, led by an info icon: \"Manage categories in Internal Work Orders (Administration > Service). Their expense accounts are set there or in Integrations > QuickBooks.\" with \"Internal Work Orders\" and \"QuickBooks\" as blue links and the QuickBooks mark.",
              "The hint stays on one line beside its icon; no second hint line shows."]})
dref("D-03", words=["Manage categories in Internal Work Orders (Administration > Service). Their expense accounts are set there or in Integrations > QuickBooks."],
     notes=["Difference: none left: register IWO-D02 is closed, the redrawn board gives S1-R3 v1.3 word for word."])
setc("D-04", "rewritten: 'first hint' -> the hint (S1-R4 v1.3; board redrawn)", title="Design: With no internal customer the hint says none is flagged yet",
     res={1: ["The hint line under the Internal Work Orders description reads \"No internal customer yet. Work orders for your own equipment stay billable until you flag one: Edit Customer > Internal customer. No Charge on customer work orders works now.\"",
              "Nothing on the page is disabled or marked as required because of it."]})
setc("D-05", "rewritten: one hint line (S1-R10 v1.3)", res={1: ["The toggle shows off and no window opens.", "The hint line disappears; the toggle name stays \"Internal Work Orders\" with the same description."]})
INTWO_C = "Have a new internal work order for that customer with every line Complete: one stock part with a cost, one posted special-order part and 2.0 h of labor, shop supplies $25.00, made for this test."
setc("D-38", "rewritten: the posting date and the posting summary on the Finance tab, no window (S3-R1, S3-R2 v1.3; boards redrawn)",
     title="Design: Finance tab shows the posting date and the posting summary rows",
     steps=["Open the internal work order.", "Click the Finance tab."],
     res=[["The work order opens."],
          ["The Finance tab shows the field \"Posting date\" set to today and Close Work Order.",
           "Rows in order: \"Stock parts $[cost]\" with \"Posted to [account]\", \"Special orders and sublet $[amount]\" with \"Already posted to [account] at the vendor bill\", \"Labor 2.0 h\" with \"Hours only, nothing posted\", \"Shop supplies $25.00\" with \"Posted to [account], credited to [shop supplies account]\".",
           f"Under the rows: \"{CLOSE_SENT}\"", "Below, the preview of the document reads \"Internal Work Order [number]\" with the INTERNAL stamp."]],
     q=["S3-R2", "S10-R3", "UFS-18", "S3-R5"])
dref("D-38", words=["Posting date", "Hours only, nothing posted", CLOSE_SENT], notes=["Difference: none left: register IWO-D20 is closed, the redrawn board's sentence says Closed · Internal."])
setc("D-39", "rewritten: the no-account warning sits in the Finance tab summary (S3-N4 v1.3; board redrawn)", title="Design: Finance tab says no account is set and offers Set account",
     steps=["Open the internal work order.", "Click the Finance tab."],
     res=[["The work order opens."],
          ["The Stock parts row's note reads \"No account set for General Internal. The entry posts to the ShopView Review account until you set one.\" with a \"Set account\" link.",
           "Close Work Order is offered and not greyed out."]])
dref("D-39", words=["No account set for General Internal. The entry posts to the ShopView Review account until you set one."],
     notes=["Difference: register IWO-D22 (narrowed): the design gives the Special orders row no note; settled by S3-N4 v1.3.",
            "Difference: register IWO-D60: the design's Shop supplies note reads \"Posted to ShopView Review, credited to …\"; settled by S3-N4 v1.3 (check a, the text wins); this case does not judge that row."])
setc("D-40", "rewritten: no account notes and the \"Closing marks…\" sentence on the Finance tab (S3-E4 v1.3; board redrawn)", title="Design: Finance tab without an accounting integration has no account notes",
     steps=["Open the internal work order.", "Click the Finance tab."],
     res=[["The work order opens."],
          ["The field \"Posting date\" shows.", "The posting summary's rows show no account notes.",
           "The sentence under them reads \"Closing marks the work order Closed · Internal. Parts cost, shop supplies and hours are available in the Internal Work Orders report.\""]])
dref("D-40", words=["Posting date", "Closing marks the work order Closed · Internal. Parts cost, shop supplies and hours are available in the Internal Work Orders report."],
     notes=["Difference: none left: register IWO-D21 is closed (the Posting date is drawn and the sentence matches S3-E4 v1.3).",
            "Difference: register IWO-D59: the design's Labor row has no \"Hours only, nothing posted\"; this case tests the behaviour (no account notes, nothing posted for labor) and leaves that wording out (check g)."])
setc("D-41", "rewritten: parts with no cost are listed in the Finance tab summary (S3-E2 v1.3; board redrawn)", title="Design: Finance tab lists parts with no cost",
     steps=["Open the internal work order.", "Click the Finance tab."], res=[["The work order opens."], ["The posting summary lists the part under \"Parts with no cost\"."]])
dref("D-41", words=["Parts with no cost"])
COSTMOVE_PRE = "Have a new internal work order for that customer with every line Complete and one special-order part whose vendor bill was posted to Cost of Parts while the work order was billable, made for this test."
setc("D-42", "rewritten: the redrawn board 7e is the vendor bill cost move window (S3-R2 (2) v1.3); its 'work order changed' message is no longer drawn (design-silent)",
     title="Design: Close window shows the vendor bill cost move",
     pre=DPRE + [QBD, INTC, COSTMOVE_PRE, pics_pre("D-42")],
     steps=["Open the internal work order.", "Click Close Work Order."],
     res=[["The work order opens."],
          ["A window \"Close work order [number]?\" opens over the Finance tab with one row \"Moved from Cost of Parts to [General Internal's account] $[amount]\".", "Buttons Cancel then \"Close Work Order\"."]],
     q=["S3-R2", "UFS-17"])
dref("D-42", words=["Moved from Cost of Parts to 6500 Vehicle Expenses"],
     notes=["Difference: register IWO-D57: the window adds a lead sentence and an item line the PRD does not give; held as its own design-version case.",
            "Difference: register IWO-D58: behind the window the Special orders row says \"Already posted … at the vendor bill\" while the window moves that cost; settled by S3-R2 v1.3 (check a, the text wins: a moved item's note is \"Moved from [account] to [account]\")."])
setc("D-43", "rewritten: the note sits on the Finance tab rows; full read: the note's words are given", title="Design: Finance tab notes parts cost is not posted without inventory accounts",
     pre=DPRE + [INTC, "Use a location connected to QuickBooks Online where Inventory Asset is not mapped.",
                 "Have a new internal work order for that customer with every line Complete, one stock part and one posted special-order part, made for this test.", pics_pre("D-43")],
     steps=["Open the internal work order.", "Click the Finance tab."],
     res=[["The work order opens."], ["The Stock parts and Special orders and sublet rows each carry the note \"Parts cost is not posted to QuickBooks at this location: inventory accounts are not mapped.\""]])
setc("D-60", "rewritten: the no-charge posting summary on the Finance tab (S3-R2 v1.3; board redrawn)", title="Design: Finance tab of a no-charge work order names the category account",
     steps=["Open the no-charge work order.", "Click the Finance tab."],
     res=[["The work order opens."],
          ["The Stock parts row's note names Goodwill's account (for example \"Posted to 6430 Warranty & Goodwill Expense\").",
           "The sentence under the rows ends \"marks the work order Closed · No Charge. You can reopen it later.\"",
           "Below, the preview of the document reads \"No Charge Work Order [number]\" with the NO CHARGE stamp and \"Category: Goodwill\"."]],
     q=["S3-R2", "S3-R5"])
dref("D-60", notes=["Difference: register IWO-D61: the design heads the preview \"Estimate\" with no \"Category:\" line; settled by S3-R2 and S3-R5 v1.3 (check a, the text wins)."])
setc("D-61", "rewritten: the Close window opens only for a missing original (S3-R2 (1) v1.3)", title="Design: Close window asks for the original work order when required",
     res={2: ["A window \"Close work order [number]?\" opens with the select \"Original work order *\" (and \"Original line\") and the warning \"Warranty requires the original work order. Pick the earlier work order this job comes from, or Not in ShopView.\"",
              "Close Work Order in the window is greyed out until one is picked."]}, q=["S3-R2", "UFS-16"])
dref("D-61", notes=["Difference: register IWO-D23 (narrowed): no closing sentence is expected in this window any more; the Flow 2 card wording part stands, settled by S2-R5."])

C("D-93", "DESIGN", "Design: Cost move window adds a lead sentence and the item line",
  DPRE + [QBD, INTC, COSTMOVE_PRE, "Open the attached picture " + DR.DREFS["D-42"]["pictures"][0] + " at 100% zoom beside the screen."],
  ["Open the internal work order.", "Click Close Work Order."],
  [["The work order opens."],
   ["Above the row the window reads \"A vendor bill on this work order was posted to another account. Closing moves that cost.\" (the design version).",
    "Under the row the item reads \"[part] (special order), vendor bill [number]\" (the design version)."]],
  [("S3-R2", "Two cases open a dialog before closing, each only when its case applies: (1) a no-charge work order whose category requires the original work order and has none: \"Close work order [number]?\" with the selects \"Original work order *\" and \"Original line\" of S2-R2, the warning \"[Category] requires the original work order. Pick the earlier work order this job comes from, or Not in ShopView.\", and the buttons Cancel and \"Close Work Order\", disabled until one is picked; Goodwill never shows this; (2) a vendor bill whose cost moves to another account at Close (S7-R4), at a location with an accounting integration: \"Close work order [number]?\" with one \"Moved from [account] to [account] $[amount]\" row per pair of accounts, the amounts added up, and the buttons Cancel and \"Close Work Order\", the same dialog Create invoice shows for a move (S7-R8).")],
  marker="AUTOMATION: HOLD - the design adds words S3-R2 does not give; held as the design version (Rule 130)", note=NAME_NOTE, stories=[3])
NEW_DESIGN.append("D-93")
DR.DREFS["D-93"] = {"pages": DR.DREFS["D-42"]["pages"], "pictures": list(DR.DREFS["D-42"]["pictures"]), "boards": list(DR.DREFS["D-42"]["boards"]),
                    "words": ["A vendor bill on this work order was posted to another account. Closing moves that cost.", "Caliper (special order), vendor bill VB-2041"],
                    "notes": ["Difference: register IWO-D57 (check c: the PRD is silent on these words and the design speaks; held as the design version). \"Caliper\" and \"VB-2041\" are example data.",
                              "Held design version (Rule 130): not run and not added to the run until the QA lead or the PO rules on it."]}
BY["D-93"] = next(c for c in CASES if c["key"] == "D-93"); _log("D-93", "new held design-version case (design 1794510020-d4ec, board 7e)")

# ---- full read (po-answers-2026-11-12/full-read/): S1-71 and the 51 runnability problems ---------------------------------------------
FR = "full read: "
setc("S1-71", FR + "the S1-R7 helper shows under the select, so 'no hint' named the archived hint only", res={5: [
    "\"Default internal category\" shows category A's name with no \"(archived)\" and no \"Archived. Pick an active category.\" hint.",
    "Under the select the helper reads \"Used by every new internal work order for this customer unless the asset has its own category.\""]})
addq("S1-71", "S1-R7")
setc("API-10", FR + "a step sends the GET its result reads", steps=BY["API-10"]["steps"] + ["Send GET for work order 1 through the Open API."],
     res=[["The change is refused."], ["Work order 1 still reads classification billable."]])
setc("API-13", FR + "a step sends the GET for customer A", steps=BY["API-13"]["steps"] + ["Send GET for customer A through the Open API."],
     res=[["classification still reads internal."], ["Customer A's internal reads false."]])
setc("API-20", FR + "one precondition names the organization without Open API V1 and the key used",
     pre=["Use an organization without Open API V1 enabled, an API key of that organization, the Open API documentation, and a tool that sends API requests.", ON_])
setc("D-65", FR + "the tester reaches the estimate through the contact's portal login",
     pre=[p for p in BY["D-65"]["pre"] if not p.startswith("Have a regular customer")][:3] + ["Have a regular customer (not flagged), with one asset and a portal contact whose portal login the tester can use."] + BY["D-65"]["pre"][4:],
     steps=["Sign in to the customer portal as the regular customer's contact.", "Open the work order's estimate in the portal."],
     res=[["The portal opens."], ["The portal estimate shows the NO CHARGE stamp and no prices."]])
rep("D-70", "Mark the second line No Charge with the category Warranty.", "Mark the second line No Charge with the category Warranty, picking the invoiced work order as Original work order and its line as Original line.", FR + "the original is picked so the note can name it")
BY["D-70"]["pre"].insert(4, "Have an invoiced work order of the regular customer with one line, made for this test, as the original.")
rep("D-72", "Mark the second line No Charge with the category Warranty.", "Mark the second line No Charge with the category Warranty and \"Not in ShopView\" as Original work order.", FR + "Warranty needs an original before Create invoice")
rep("D-85", "with one line marked No Charge, Warranty, made for this test.", "with one line marked No Charge, Warranty, whose original is another invoiced work order of the customer, its line done by a technician, made for this test.", FR + "the original work order and technician are named")
setc("INV-02", FR + "the noting is its own step", steps=BY["INV-02"]["steps"][:4] + ["Note the status work order 1 shows and what its Finance tab shows."] + BY["INV-02"]["steps"][4:],
     res=BY["INV-02"]["res"][:3] + [["The invoice is reversed."], ["The status and the Finance tab are noted."]] + BY["INV-02"]["res"][4:7] + [["Work order P shows the same status and the same Finance tab as work order 1 after step 4."]])
rep("S1-24", "Open the work orders list.", "Open the All tab of the work orders list.", FR + "closed work orders show in the All tab")
setc("S1-24", FR + "step 7 checks the work order page, not the list again", res={7: ["Work order 2's page shows the status Closed with the \"Internal\" badge."]})
setc("S1-29", FR + "work order 2 is opened in its own step", steps=BY["S1-29"]["steps"] + ["Open work order 2."],
     res=BY["S1-29"]["res"][:5] + [["Work order 1 shows no \"Internal\" badge and keeps its prices."], ["Work order 2 shows the \"Internal\" badge."]])
BY["S1-36"]["pre"] = [p for p in BY["S1-36"]["pre"] if p != ADM]; _log("S1-36", FR + "only the restricted user signs in")
for k in ("S1-39", "S12-43"):
    BY[k]["pre"] = [ADM if "signed in to the same account" in p and False else p.replace(", signed in to the same account", "") for p in BY[k]["pre"]]
    if ADM not in BY[k]["pre"]: BY[k]["pre"].insert(0, ADM)
    _log(k, FR + "the sign-in is named")
setc("S1-66", FR + "the report filter the title promises is checked",
     steps=BY["S1-66"]["steps"] + ["Open Reports > Internal Work Orders.", "Open the \"Category\" filter."],
     res=BY["S1-66"]["res"] + [["The report opens."], ["The filter offers the category under its new name."]])
setc("S1-72", FR + "opening the asset page and Edit Asset are two steps",
     steps=BY["S1-72"]["steps"][:4] + ["Open asset 1's page.", "Click Edit Asset."],
     res=BY["S1-72"]["res"][:4] + [["Asset 1's page opens."], ["The \"Internal category\" helper is led by the mark."]])
setc("S1-77", FR + "customer A's page is opened in its own step", steps=BY["S1-77"]["steps"] + ["Open customer A's page."],
     res=BY["S1-77"]["res"][:4] + [["Customer A shows the \"Internal\" badge."], ["Customer A's page offers no Edit Customer to this user."]])
for k in ("S1-90",):
    rep(k, "Use a new organization in which the Internal Work Orders setting has never been switched on.",
        "Use a new organization created on the build (a new sign-up), in which the Internal Work Orders setting has never been switched on.", FR + "how to get such an organization")
setc("S12-03", FR + "the Original technician line needs a pick no step makes; that result is left out here", res={4: [x for x in BY["S12-03"]["res"][3] if "Original technician" not in x]})
setc("S12-05", FR + "Financial Info is opened, and the noting is its own step",
     steps=["Open work order 1.", "Open Financial Info.", "Note the cost figures under Financial Info."] + BY["S12-05"]["steps"][1:5] + ["Open Financial Info."],
     res=[[BY["S12-05"]["res"][0][0]], ["Financial Info shows the work order's cost figures."], ["The figures are noted."]] + BY["S12-05"]["res"][1:4]
         + [[BY["S12-05"]["res"][4][0]], ["Financial Info shows the same cost figures as noted in step 3."]])
setc("S12-18", FR + "what the tester sees instead of 'no completion step runs'",
     res={2: [x if "completion step" not in x else "The message shows for about five seconds; the work order stays Complete and no invoice is created." for x in BY["S12-18"]["res"][1]]})
addq("S12-23", "S2-R14"); _log("S12-23", FR + "the Classification chip is defined by S2-R14 (now quoted)")
setc("S12-24", FR + "Edit Line is closed before the next menu", steps=BY["S12-24"]["steps"][:3] + ["Click Cancel."] + BY["S12-24"]["steps"][3:],
     res=BY["S12-24"]["res"][:3] + [["Edit Line closes."]] + BY["S12-24"]["res"][3:])
for k in ("S12P-02", "S12P-03"):
    rep(k, "with one approved labor line of 2.0 hours", "with one labor line of 2.0 hours waiting for approval", FR + "the line waits for approval so Approve and the email apply")
setc("S12P-06", FR + "the mailbox, the earlier email and the print preview each have a step",
     steps=BY["S12P-06"]["steps"][:5] + ["Open the contact's mailbox.", "Open the \"Approval Required\" email received before the conversion.",
                                          "Sign in to the customer portal as customer A's contact.", "Open work order 1's estimate in the portal.", "Open the estimate's print preview."],
     res=BY["S12P-06"]["res"][:5] + [["No new email has arrived since the conversion."], ["It still shows the old prices."], ["The portal opens."],
          ["The same estimate shows the NO CHARGE stamp and no prices.", "Under the lines the notice reads \"This estimate changed after it was sent. The lines above are current.\""],
          ["The print preview shows no document with prices."]])
setc("S12P-12", FR + "Edit Customer is opened, ticked and saved in separate steps",
     steps=BY["S12P-12"]["steps"][:2] + ["In ShopView, open customer A's page.", "Click Edit Customer on customer A's page.", "Tick the \"Internal customer\" checkbox.", "Click Save."] + BY["S12P-12"]["steps"][3:],
     res=BY["S12P-12"]["res"][:2] + [["Customer A's page opens."], ["The Edit Customer window opens."], ["The checkbox is ticked."], ["The Make internal window lists work order 1."]] + BY["S12P-12"]["res"][3:])
rep("S12P-13", "with line 1 and line 2 marked No Charge under Goodwill", "with line 1 billable and line 2 marked No Charge under Goodwill", FR + "only line 2 is marked")
BY["S12P-13"]["pre"].append("Have access to the shop's mailbox that receives approval emails."); _log("S12P-13", FR + "the shop mailbox is given")
BY["S13-03"]["pre"].insert(2, "Make sure the Internal Work Orders setting is off in Settings > Work Orders."); _log("S13-03", FR + "the setting is said to be off (Rule 137)")
setc("S2-33", FR + "the note's original-work-order part is not judged for Goodwill, which has none (check g)",
     res={6: ["A read-only system note by ShopView, with the user and the time, begins \"Converted to No Charge by [user]. Category Goodwill\" and ends \"Prices, fees and discounts removed; costs and hours kept.\""]})
rep("S2-34", "Have a new invoiced work order for this test, work order 2, for customer A on asset 1, with one line, line 1, assigned to technician A.",
    "Have a new invoiced work order for this test, work order 2, for customer A on asset 1, assigned to technician A, with one line, line 1, also done by technician A.", FR + "the work order itself carries technician A")
setc("S2-34", FR + "'Original line' appears once a work order is picked (S2-R2)", res={4: ["The select \"Original work order\" appears."], 5: ["\"Original line\" appears and \"Original technician: [technician A]\" shows."]})
BY["S2-59"]["pre"] = [p for p in BY["S2-59"]["pre"] if not p.startswith("Make sure the Goodwill category has")]
BY["S2-59"]["note"] = (BY["S2-59"]["note"] + " " if BY["S2-59"]["note"] else "") + "[account] is not judged in this case: the category is picked only in the next window."
_log("S2-59", FR + "[account] is free text before the category is picked; the unused Goodwill precondition removed")
setc("S2-91", FR + "Close Work Order is in the three-dots menu while lines are open (S3-N2)",
     steps=["Open work order 1.", "Open the work order's three-dots menu.", "Click Close Work Order in the menu.", "Answer the core \"Core OK\"."],
     res=[BY["S2-91"]["res"][0], ["The menu shows \"Close Work Order\"."], BY["S2-91"]["res"][1], BY["S2-91"]["res"][2]])
rep("S3-34", "closed, on asset 1, closed with a posting date of yesterday.", "closed on asset 1 with a posting date of yesterday.", FR + "wording tidied")
for k in ("S3-42", "S7-14"):
    BY[k]["pre"] = [p if "no income account mapped" not in p else "Make sure the Shop supplies item in QuickBooks Products And Services has no income account mapped (leave the mapping empty; do not delete or deactivate its income account)." for p in BY[k]["pre"]]
    _log(k, FR + "the unmapped state is named exactly")
_log("S3-48", FR + "the menu is opened in its own step")
setc("S4-04", FR + "the result says what is judged: the window stays open and nothing is reversed (S4-R2, as the design case on Esc reads it)",
     res={5: ["The window stays open and work order 1 is still Closed: nothing is reversed."]})
rep("S4-09", "Open the vendor bill.", "Open the vendor bill from the special-order part on work order 1.", FR + "the path to the vendor bill is named")
setc("S7-01", FR + "no pointer to other cases", res={3: ["No invoice, sales receipt or payment for work order 1 is found."]})
BY["S7-35"]["pre"] = [p if not p.startswith("Have access to the QuickBooks Online company") else "Have access to location A's QuickBooks Online company, so its journal entries can be searched." for p in BY["S7-35"]["pre"]]
_log("S7-35", FR + "location A's QuickBooks company is named")
setc("S8-23", FR + "one result: saving the mapping retries the held Close on its own (S6-R4)", title="Saving the empty row's mapping posts the held Close",
     steps=BY["S8-23"]["steps"][:4], res=BY["S8-23"]["res"][:3] + [["The Close is posted, $80.00 to the picked account, with no Retry pressed."]])
setc("S9-06", FR + "customer A exists before the dashboard baseline is noted",
     pre=[ADM, ON_, "Have a new customer for this test, customer A, flagged as an Internal customer.",
          "Open the dashboard for today and note the Sales, Billing and Invoices (\"Total invoices in range\") cards.",
          "After noting them, have a new internal work order for this test, work order 1, for internal customer A, closed today, with one approved line with one stock part picked from inventory at a cost of $40.00 each, quantity 2 and one approved labor line of 2.0 hours."],
     res={2: ["The Sales, Billing and Invoices cards show the noted figures: work order 1 adds nothing.", "Customer A is in neither Top Customers nor At-Risk Customers: its only work order is internal."]})
REOPEN4 = (["Open the Finance tab.", "Open the invoice menu on the Finance tab.", "Click \"Reopen Work Order\".", "Click Reopen Work Order in the window."],
           [["The document shows."], ["The menu offers \"Reopen Work Order\"."], ["The window opens."], ["Work order 1 is Complete again."]])
setc("S9-26", FR + "Reopen and turning the setting off are split into one action per step",
     steps=BY["S9-26"]["steps"][:3] + REOPEN4[0] + ["Open Settings > Work Orders.", "Switch the \"Internal Work Orders\" toggle off.", "Click Save settings.", "Open Reports."],
     res=BY["S9-26"]["res"][:3] + REOPEN4[1] + [["The tab opens."], ["The toggle shows off."], ["The setting is saved off."], BY["S9-26"]["res"][5]])
setc("S9-28", FR + "Reopen is split into one action per step", steps=["Open work order 1."] + REOPEN4[0] + BY["S9-28"]["steps"][1:],
     res=[["Work order 1 opens."]] + REOPEN4[1][:3] + [["Work order 1 is Complete."]] + BY["S9-28"]["res"][1:])
BY["S9-29"]["pre"] = [p if not p.startswith("Have a new customer for this test, customer A, flagged") else
                      "Have a new customer for this test, customer A, with one billable invoice, work order 2, left unpaid, so the customer has an open balance; then flag customer A as an Internal customer (it has no open billable work order, so no Make internal window opens)." for p in BY["S9-29"]["pre"]]
_log("S9-29", FR + "the setup order is given: invoice first, then flag")

# ---- found by check_v13_text.py (13 Nov 2026): tester text still naming what v1.3 removed --------------------------------------------
setc("S3-21", "rewritten: the step's Close Work Order closes on the press, no confirmation (S3-R1 v1.3)",
     res={5: ["Work order 1 closes with no other window: an alert reads \"Work order [number] is Closed · Internal.\"", "The status reads \"Closed\" with the \"Internal\" badge."]})
addq("S3-21", "S3-R1")
setc("S1-42", "rewritten: one hint line (S1-R10 v1.3)", res={3: [x.replace("The hint lines show again.", "The hint line shows again.") for x in BY["S1-42"]["res"][2]]})
setc("D-01", "rewritten: one hint line (S1-R3 v1.3)", res={k + 1: [x.replace("No hint lines show", "No hint line shows") for x in r] for k, r in enumerate(BY["D-01"]["res"])})
setc("D-05", "title: one hint line (S1-R10 v1.3)", title="Design: Turning Internal Work Orders off hides the hint line")
# D-60: board hf-28 "28 Close confirmation" was not redrawn and still draws the removed confirmation ("This posts ..."); it is no longer
# a reference for the Finance tab. Register IWO-D62 (check a, S3-R1 v1.3; check d, the design's own notes c-hf-17 / c-rv-5-2).
_d = DR.DREFS["D-60"]
_d["boards"] = ["flow2-4"]; _d["pictures"] = ["iwo-flow2-10-04-finance-tab-close-work-order-v13.png"]
_d["pages"] = _d["pages"].replace(' / "Happy flow v6"', "").replace(', "28 Close confirmation" (Happy flow v6)', "")
_d["notes"] = _d["notes"] + ["Difference: register IWO-D62: board \"28 Close confirmation\" (Happy flow v6) was not redrawn and still draws the Close confirmation PRD v1.3 removed; settled by S3-R1 v1.3 (check a) and the design's own notes on boards 17 and 5.2 (check d); it is not used here."]
BY["D-60"]["pre"] = [p if not p.startswith("Open the attached picture") else pics_pre("D-60") for p in BY["D-60"]["pre"]]
_log("D-60", "board 28 Close confirmation dropped from the references (IWO-D62)")
# D-38 and D-60 quote S3-R5 only for the preview under the posting summary; the closed-document cases keep their closed-document boards.
DR.SECONDARY |= {("D-38", "S3-R5"), ("D-60", "S3-R5")}
_log("D-90", "quote corrected: the User Feedback row is \"Reopen done\" (UFS-27 in v1.3); the round 3 draft quoted the Export option row by mistake")
setc("S3-46", "result reads the sentence as an internal work order shows it (S3-E4 v1.3 gives \"(Closed · No Charge)\" for the other kind)",
     res={2: ["The posting summary's rows show no account notes.",
              "Under them it reads \"Closing marks the work order Closed · Internal. Parts cost, shop supplies and hours are available in the Internal Work Orders report.\""]})
# Round 3 released S1-02b and S2-32b (questions 1 and 2 answered; PRD v1.1 aligned the message rows with the stories) but left their
# "until the PO answers" notes; v1.3 still gives both texts word for word the same, so the notes go.
for _k in ("S1-02b", "S2-32b"):
    BY[_k]["note"] = ""; _log(_k, "note removed: the story text and the message row now agree (answers 1 and 2, PRD v1.1; still so in v1.3)")
setc("S9-28", "sample read: step 6 says what opens", res={6: ["The Internal Work Orders report opens."]})
