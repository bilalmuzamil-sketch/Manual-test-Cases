"""Round 3 (12 Nov 2026): PRD v1.1 and Milos Vasic's answers to questions 1-16 (po-answers-2026-11-12/). Loaded after every other case
module (after cases_zbaseline). The library already quotes PRD v1.1 (iwo_lib.PRD_FILE): every quote given by code is re-copied from v1.1,
so the From line of every case names v1.1. This module makes the case changes the answers and v1.1 call for, and lists each one per case
in V11_CHANGES (PASS-REPORT.md, Rule 134; every changed case is rebuilt whole by build.py):
  1. releases every case held on questions 1-16 (question 10: released from the PO hold, still blocked on the Open API release; the Open
     API owner's confirmation is pending, Milos: "test against (a)");
  2. turns the two cases that v1.1 makes untestable by hand into cases a tester cannot set up (S2-90: no work order import exists; S8-26:
     the hub refuses to deactivate a mapped account) and proposes them for deletion (they are live; deletion needs the QA lead);
  3. writes the new cases for what v1.1 adds that no case checks yet.
Design cases (D-..) change in make_cases_design.py, not here. Milos's answers are quoted only where v1.1 does not carry them (question 10)."""
from iwo_lib import C, CASES, MARKER, NOMAN, API_HOLD, CODE
from common import *

BY = {c["key"]: c for c in CASES}
V11_CHANGES = {}
PROPOSED_DELETE = {}


def _log(k, w): V11_CHANGES.setdefault(k, []).append(w)


def rep(k, old, new, what="result rewritten to PRD v1.1"):
    c = BY[k]; n = 0
    for lst in [c["pre"], c["steps"]] + c["res"]:
        for i, x in enumerate(lst):
            if old in x: lst[i] = x.replace(old, new); n += 1
    if old in c["title"]: c["title"] = c["title"].replace(old, new); n += 1
    if n != 1: raise KeyError(f"{k}: {n} places hold {old[:60]!r}")
    _log(k, f"{what}: {old[:80]!r} -> {new[:80]!r}")


def addb(k, step, text, what="result added from PRD v1.1"):
    BY[k]["res"][step - 1].append(text); _log(k, f"step {step}: {what}: {text[:90]!r}")


def addq(k, *q):
    c = BY[k]
    for x in q:
        if x not in c["q"]: c["q"].append(x)
    _log(k, "quote added: " + ", ".join(x if isinstance(x, str) else f"{x[0]} ({x[1][:50]}…)" for x in q))


def release(k, why, marker=MARKER):
    c = BY[k]; old = c["marker"]; c["marker"] = marker; c["held"] = marker.startswith("AUTOMATION: HOLD") or bool(c["banner"])
    _log(k, f"released ({why}): {old!r} -> {marker!r}")


def title(k, new):
    _log(k, f"title: {BY[k]['title']!r} -> {new!r}"); BY[k]["title"] = new


def sentence(code, start):
    t = CODE[code]; i = t.find(start)
    if i < 0: raise KeyError(f"{code}: {start!r}")
    j = t.find(". ", i)
    return t[i:] if j < 0 else t[i:j + 1]


# ---- 1. held cases released (answers 1-16, all option (a), carried by PRD v1.1) ----------------------------------------------------
release("S1-02b", "answer 1: the longer text; v1.1 gives it in S1-R2 and the message table")
release("S2-32b", "answer 2: \"NO CHARGE document\"; v1.1 aligns the message table")
release("S2-28", "answer 3: INTERNAL stamp on an internal estimate (S2-R4 v1.1)")
title("S2-28", "An internal estimate shows the INTERNAL stamp")
rep("S2-28", "The estimate shows the stamp for an internal work order and no prices or totals.",
    "The estimate shows the INTERNAL stamp and no prices or totals.")
_log("S2-28", "the \"Category:\" line under the stamp is left out of the expectation: S2-R4 v1.1 names that line for a no-charge work order only (skill 07 §6.0 g: the behaviour asked about, the stamp, is settled)")
release("S7-38", "answer 4: one row per pair of accounts, amounts added up (S7-R8 v1.1)")
title("S7-38", "Two lines moving between the same accounts show as one row of $150.00")
rep("S7-38", "\"Create invoice [number]?\" opens with the move from Cost of Parts to [account C] for line 1 and line 2 ($90.00 and $60.00, $150.00 together), shown as the PO rules.",
    "\"Create invoice [number]?\" opens with one row \"Moved from Cost of Parts to [account C]\" of $150.00 ($90.00 + $60.00) for line 1 and line 2 together.")
release("S2-106", "answer 5: Closed appears only after the setting is switched on or a work order is closed (S2-R10 v1.1)")
rep("S2-106", "The Status chip offers its usual values and no \"Closed\".", "The Status chip offers no \"Closed\" value.")
release("S12P-11", "answer 7: refused and refunded by hand (new S2-E8 in v1.1)")
addq("S12P-11", "S2-E8")
release("S6-10", "answer 8: test the refusal (S6-E1 v1.1)")
release("S2-100", "answer 9: every line comes back billable (S2-R6 v1.1)")
release("API-23", "answer 10: send work_order.updated (option (a)); the Open API owner's confirmation is still pending; still blocked on the Open API release",
        marker=API_HOLD)
addq("API-23", ("PO answer, question 10", "(a) Yes, send work_order.updated with the work order and its lines for each of these changes. The Open API owner's confirmation is still pending; test against (a) and I will tell you if it changes."))
BY["API-23"]["note"] = ("Milos Vasic answered (a) on 12 Nov 2026; the Open API owner's confirmation is still pending (Milos will say if it changes).")
_log("API-23", "note added: the Open API owner's confirmation is still pending")
release("DATA-09", "answer 11: a dash, never a number (S9-R2 v1.1)")
title("DATA-09", "A technician with comebacks but no completed lines shows a dash as the rate")
rep("DATA-09", "the Comeback rate shows the empty value the PO names, not 0% or an error.", "the Comeback rate shows a dash \"—\", not 0%, a number or an error.")

# ---- 2. v1.1 makes these untestable by hand (kept in the library, proposed for deletion from TestRail) ------------------------------
BY["S2-90"]["marker"] = NOMAN("ShopView has no work order import today (PRD v1.1 S2-E3: the data import covers contacts and vehicles)")
BY["S2-90"]["held"] = True
_log("S2-90", "answer 6 / S2-E3 v1.1: no work order import exists, so a tester cannot set this up; proposed for deletion")
PROPOSED_DELETE["S2-90"] = "No work order import exists (PRD v1.1 S2-E3, answer 6); the case can never be run."
BY["S8-26"]["marker"] = NOMAN("the hub refuses to deactivate a mapped account, so an inactive mapped account needs a database change (PRD v1.1 S6-E1)")
BY["S8-26"]["held"] = True
_log("S8-26", "answer 8 / S6-E1 v1.1: the held-when-inactive rule is a safety net not tested by hand; proposed for deletion (S6-10 tests the refusal)")
PROPOSED_DELETE["S8-26"] = "The hub refuses the deactivation (S6-10); an inactive mapped account needs a database change (PRD v1.1 S6-E1, answer 8)."

# ---- 3. results that v1.1 adds to existing cases ----------------------------------------------------------------------------------
addb("S2-64", 1, "No other note shows on the closed work order.")
addq("S2-64", ("S2-R9", sentence("S2-R9", "No other note is shown")))

# ---- 4. new cases for what v1.1 adds with no case -----------------------------------------------------------------------------------
NEW = []
def new(key, sec, ttl, pre, steps, res, q, **kw):
    C(key, sec, ttl, pre, steps, res, q, **kw); NEW.append(key); _log(key, "new case (PRD v1.1)")

new("S4-15", "S4", "Reopen shows the green message that the work order reopened",
    ["Sign in as an Admin at the test location.", "Make sure the Internal Work Orders setting is on in Settings > Work Orders.",
     "Make sure the test location has no accounting integration (neither QuickBooks Online nor AccountingHub).",
     "Have a new customer for this test, customer A, flagged as an Internal customer.",
     "Have a new internal work order for this test, work order 1, for internal customer A, closed."],
    ["Open work order 1.", "Open the Finance tab.", "Open the invoice menu on the Finance tab.", "Click \"Reopen Work Order\".",
     "Click Reopen Work Order in the window."],
    [["Work order 1 opens, Closed."], ["The document shows."], ["The menu offers \"Reopen Work Order\"."], ["The window opens."],
     ["A green message reads \"Work order [number] reopened\" with work order 1's number.", "The status reads \"Complete\"."]],
    ["S4-R3", "UFS-27"], note=NAME_NOTE)

_RPT_PRE = ["Sign in as an Admin at the test location.", "Make sure the Internal Work Orders setting is on in Settings > Work Orders.",
            "Make sure the test location has no accounting integration (neither QuickBooks Online nor AccountingHub).",
            "Have a new customer for this test, customer A, flagged as an Internal customer.",
            "Have a new internal work order for this test, work order 1, for internal customer A, closed this month."]
new("S9-47", "S9", "Empty cells in the Internal Work Orders report show a dash",
    _RPT_PRE + ["Have a new customer for this test, customer B.",
                "Have a new No Charge work order for this test, work order 2, for customer B, category Comeback, closed this month, with Not in ShopView as its original work order, so a row with no original technician shows."],
    ["Open Reports > Internal Work Orders.", "Set the date range to this month.", "Open the \"By technician\" tab."],
    [["The report opens on the \"By work order and line\" tab."],
     ["Work order 1's row shows a dash \"—\" in Original work order and Original technician (an internal work order has no original).",
      "Work order 1's row shows no empty cell: every cell holds a value or a dash."],
     ["The \"Unassigned\" row (work order 2) shows a dash \"—\" as its Comeback rate, because it has no completed lines; no cell is left empty."]],
    ["S9-R2"], stories=[9])
new("S9-48", "S9", "Report work order numbers and dates stay on one line at 1440 and 1536",
    ["Use a desktop browser window 1440 pixels wide at 100% zoom."] + _RPT_PRE,
    ["Open Reports > Internal Work Orders.", "Set the date range to this month.", "Resize the browser window to 1536 pixels wide."],
    [["The report opens."], ["Work order 1's number and its Closed / invoiced date each sit on one line; the number is not broken over two lines."],
     ["Work order 1's number and date still sit on one line each."]],
    ["S9-R2"], stories=[9])
_CAT_PRE = ["Sign in as an Admin at the test location.", "Make sure the Internal Work Orders setting is on in Settings > Work Orders."]
new("S1-92", "S1", "The Internal categories tab shows where an internal category is set",
    _CAT_PRE, ["Open Administration > Service > Internal Work Orders."],
    [["The Internal categories tab is open.",
      "Under the tab a hint reads \"Set on the customer, or on the asset for one unit. An internal work order takes it when it is created.\""]],
    ["S1-R13"])
new("S1-93", "S1", "The category windows show where the category is shown",
    _CAT_PRE, ["Open Administration > Service > Internal Work Orders.", "Open the No Charge categories tab.", "Click \"New No Charge Category\".",
               "Click Cancel.", "Open the Internal categories tab.", "Click \"New Internal Category\"."],
    [["The Internal categories tab is open."], ["The No Charge categories tab is open."],
     ["The \"New No Charge Category\" window shows the helper \"It shows in the badge tooltip on the work order, on the NO CHARGE document and in the Internal Work Orders report.\""],
     ["The window closes."], ["The Internal categories tab is open."],
     ["The \"New Internal Category\" window shows the same helper, word for word."]],
    ["S1-R14"])
new("S1-94", "S1", "Edit Customer explains the Default internal category",
    _CAT_PRE + ["Have a new customer for this test, customer A."],
    ["Open customer A's page.", "Click Edit Customer on customer A's page.", "Tick the \"Internal customer\" checkbox."],
    [["Customer A's page opens."], ["The Edit Customer window opens."],
     ["The select \"Default internal category\" appears with the helper \"Used by every new internal work order for this customer unless the asset has its own category.\""]],
    ["S1-R7"])

# ---- 5. read in this pass: results that judged against an unseen "usual" baseline (the baseline gate now refuses "usual") ---------
rep("S1-16", "opens with its usual fields, including", "opens with its fields, including", "baseline named")
rep("S2-18", "The window shows its usual fields and no \"No Charge\" checkbox.", "The window shows no \"No Charge\" checkbox.", "baseline named")
rep("S2-103", "Work order 2's Finance tab shows its usual actions.", "Work order 2's Finance tab offers Add Deposit, which work order 1's does not.", "baseline named")
rep("INV-29", "New Asset shows its usual fields and no \"Internal category\".", "New Asset shows no \"Internal category\" field.", "baseline named")
rep("INV-29", "New Customer shows its usual fields and no \"Internal customer\".", "New Customer shows no \"Internal customer\" checkbox.", "baseline named")
rep("S2-103", "in status Approved, billable, so the usual actions can be compared.", "in status Approved, billable, so a billable Finance tab can be compared.", "precondition reworded")
