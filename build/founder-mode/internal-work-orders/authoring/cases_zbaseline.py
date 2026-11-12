"""Round 2c (12 Nov 2026, coordinator's review of INV-17): loaded after every other case module.
1. Every result that judged against a baseline the tester cannot see ("as before", "as today", "where it was", "unchanged", "as usual"...)
   now names what the tester sees, notes the value in an earlier step of the same case, compares with the same screen on production
   (where the feature is not released yet), or is a before/after case run on production (PROD folder). iwo_lib.check refuses such words.
2. A plan quote that was code or a test-file path is replaced by the code-free behaviour wording of the same plan line (tp_quote_fix.py);
   where the line has none, the quote is dropped and a bullet only the code backed is removed; ADD statements no case quotes any more are
   added to cases_tp.TP_OUT with the reason.
Every change is listed per case in BASELINE_CHANGES (REPORT.md, Rule 134); each changed case is rebuilt whole by build.py."""
from iwo_lib import CASES
import cases_tp
from tp_quote_fix import TPFIX

BY = {c["key"]: c for c in CASES}
BASELINE_CHANGES = {}
PRODWIN = ("Have a second browser window signed in as an Admin to the production test account (app.shopview.com), where Internal Work "
           "Orders is not released yet, so today's screen can be compared.")
CREATED = "The invoice is created and shows on the Finance tab."


def _log(k, w): BASELINE_CHANGES.setdefault(k, []).append(w)


def rep(k, old, new, what="baseline named"):
    c = BY[k]; n = 0
    for lst in [c["pre"], c["steps"]] + c["res"]:
        for i, x in enumerate(lst):
            if old in x: lst[i] = x.replace(old, new); n += 1
    if old in c["title"]: c["title"] = c["title"].replace(old, new); n += 1
    if n != 1: raise KeyError(f"{k}: {n} places hold {old[:60]!r}")
    _log(k, f"{what}: {old[:70]!r} -> {new[:70]!r}")


def delb(k, text, why):
    c = BY[k]
    for r in c["res"]:
        if text in r: r.remove(text); _log(k, f"result removed ({why}): {text[:70]!r}"); return
    raise KeyError(f"{k}: bullet not found {text[:60]}")


def addb(k, step, text, what="result added"):
    BY[k]["res"][step - 1].append(text); _log(k, f"step {step}: {what}: {text[:70]!r}")


def addpre(k, text, at=None):
    p = BY[k]["pre"]; p.insert(len(p) if at is None else at, text); _log(k, f"precondition added: {text[:70]!r}")


def delpre(k, text):
    BY[k]["pre"].remove(text); _log(k, f"precondition removed: {text[:70]!r}")


def steps(k, st, res, what):
    c = BY[k]; c["steps"] = list(st); c["res"] = [list(r) for r in res]; _log(k, what)


def dropq(k, *tps):
    c = BY[k]
    for t in tps:
        if TPFIX.get(t) != []: raise KeyError(f"{t} is not a dropped plan quote")
        c["q"].remove(t)
    _log(k, f"plan quote(s) {', '.join(tps)} dropped: the plan states them only in code or a test-file path")


def title(k, new):
    _log(k, f"title: {BY[k]['title']!r} -> {new!r}"); BY[k]["title"] = new


# ---- 1. baselines -----------------------------------------------------------------------------------------------------------------
rep("S2-42", "\"Save\" is enabled although the category is unchanged.", "\"Save\" is enabled although Category still shows Warranty.")
rep("S1-14", "Nothing on the tab is required or blocked: Save settings works as usual.",
    "Nothing on the tab is marked as required and no control on it is greyed out because of the hint.")
title("S1-44", "A flagged customer is deleted or refused by the same rules as any customer")
addpre("S1-44", "Have a new customer for this test, customer C, not flagged, with one open billable work order, so today's refusal can be seen.")
steps("S1-44", ["Open customer A's page.", "Delete customer A.", "Open customer C's page.", "Delete customer C.", "Open customer B's page.", "Delete customer B."],
      [["Customer A's page opens."], ["Customer A is deleted and is no longer in the Customers list."], ["Customer C's page opens."],
       ["The delete is refused because customer C has an open work order; note the message."], ["Customer B's page opens."],
       ["The delete is refused with the same message as for customer C."]],
      "steps 3-4 added: a regular customer with an open work order shows today's refusal; step 6 compares with it")
rep("S1-64", "Have a second user for this test with access to both locations, so the mapping at location B can be checked after.",
    "Have a second user for this test with access to both locations.")
addpre("S1-64", "Have Goodwill mapped at location B to an expense account, account B, so a change at location A can be shown not to touch it.")
steps("S1-64", BY["S1-64"]["steps"][:5] + ["Sign in as the second user.", "Open Administration > Service > Internal Work Orders.",
                                          "Open the row menu of Goodwill.", "Click Edit."],
      BY["S1-64"]["res"][:4] + [["The window closes."], ["The app opens for the second user."], ["The categories page opens."],
                                ["The menu shows Edit."], ["Location B's picker still shows account B.", "Location A's picker shows the account picked in step 4."]],
      "the location B check split into its own steps, against account B set in the preconditions")
rep("S1-76", "is not available to this user, as today.", "is not available to this user.")
rep("S1-78", "with no Edit Customer, as today, so", "with no Edit Customer, so")
rep("S2-79", "with a portal contact.", "with a portal contact whose portal login the tester can use.")
steps("S2-79", ["Open work order 1.", "Click Send to Portal.", "Sign in to the customer portal as customer A's contact.",
                "Open work order 1's estimate in the portal.", "Open work order 2."],
      [BY["S2-79"]["res"][0], ["The estimate is sent and no error shows."], ["The portal opens."],
       ["The estimate shows its lines, hours and part quantities with no prices, no cost and no total, and the NO CHARGE stamp."],
       BY["S2-79"]["res"][2]],
      "'sent to the portal as today' replaced by opening the sent estimate in the portal (steps 3-4)")
delpre("S3-24", "Note customer A's balance.")
rep("S3-24", "Customer A's balance is the same as before: the $15.00 of shop supplies is not charged.",
    "Customer A's balance reads $0.00: the $15.00 of shop supplies is not charged.")
rep("S3-36", "\"Mark Reviewed\" works as today.", "The work order is marked reviewed and leaves Review.")
rep("S3-43", "is refused, as today, with", "is refused with")
rep("S3-53", "The work order stays where it was and nothing is posted.", "Work order 1 is not Closed and nothing is posted.")
rep("S4-09", "The vendor bill is still there for $125.00, unchanged.", "The vendor bill is still there for $125.00, on work order 1's part.")
rep("S5-12", "is not available to this user, as today.", "is not available to this user.")
rep("S5-14", "When the save fails, the existing QuickBooks settings error handling shows, unchanged.",
    "When the save fails, the QuickBooks page shows the error it shows for any other failed save, and the account is not saved.")
rep("S6-06", "is not offered, as today, so", "is not offered, so")
rep("S6-07", "is not available to this user, as today.", "is not available to this user.")
rep("S6-08", "When the save fails, the existing Account Mappings error handling shows, unchanged.",
    "When the save fails, Account Mappings shows the error it shows for any other failed save, and the account is not saved.")
rep("S7-07", "The vendor, the bill and Accounts Payable are as usual.",
    "The bill keeps its vendor and its $125.00 total and credits Accounts Payable.")
rep("S7-18", "Have a new customer for this test, customer A.", "Have a new customer for this test, customer A, with its own labor rate of $120.00 an hour.")
rep("S7-18", "(one approved labor line of 2.0 hours)", "(one approved labor line of 2.0 hours at $120.00 an hour)")
rep("S7-18", "The invoice is created as today.", CREATED)
rep("S7-18", "Line 1 is invoiced as today.", "Line 1 is on the invoice with its 2.0 hours at $240.00 (2.0 h × $120.00).")
rep("S7-19", "Cost of Parts $30.00, as today.", "Cost of Parts $30.00.")
rep("S8-07", "The bill is saved and can be paid as usual.", "The bill is saved.")
addb("S8-07", 2, "Only the move is Held: no Held row is listed for the bill itself, so the vendor can be paid.")
rep("S8-16", "goods sold account as today.", "goods sold account mapped on Account Mappings.")
rep("S9-34", "The file has today's columns, with no Classification or Category column.", "The file has no Classification column and no Category column.")
title("S9-34", "With the option off, the export has no internal rows or columns")
rep("S9-37", "Have technician A for this test.", "Have technician A for this test, with no time clocked to a department.")
rep("S9-37", "The \"Internal Hours\" column is unchanged: it counts time clocked to a department, not to work order 1.",
    "Technician A's \"Internal Hours\" shows no hours: the 2.0 hours on work order 1 are not counted there (that column counts time clocked to a department).")
rep("S9-43", "are not available to this user, as today.", "are not available to this user.")
rep("S10-04", "disabled until a percentage is entered, as today.", "disabled because no percentage is entered.")
rep("S10-13", "When the save fails, the existing shop supplies error handling of the work order shows, unchanged.",
    "When the save fails, an error shows and \"Shop supplies\" does not keep $20.00.")
addb("S12-05", 1, "Financial Info shows its cost figures; note them.")
rep("S12-05", "Financial Info, the cost view, is unchanged.", "Financial Info shows the same cost figures as noted in step 1.")
rep("S12-16", "The invoice is created as today.", CREATED)
rep("S12-36", "line 1 prints as today.", "line 1 prints with no chip.")
rep("S12-42", "line 2 stays as it was.", "line 2 keeps its price and shows no chip.")
rep("S12P-02", "The approval is recorded, as today.", "The estimate shows as approved.")
rep("S12P-05", "Approve works as today.", "The estimate shows as approved.")
rep("API-20", "The request is refused as today, with no new fields to see.",
    "The request is refused because Open API V1 is not enabled: no work order data comes back.")
rep("API-26", "The $0 invoice is created and paid as today.", "The $0 invoice is created and shows as Paid.")
rep("REL-01", "The \"Internal Work Orders\" toggle is off and nothing new shows on the tab beyond it.",
    "The \"Internal Work Orders\" toggle is off and no hint line shows under it.")
addpre("REL-02", "Before the release, note the rows and their accounts on this location's ShopView Accounts page.")
rep("REL-02", "the other rows are as they were.", "the other rows and their accounts are the ones noted before the release.")
rep("REL-03", "Every mapping noted before the release that was valid is unchanged.",
    "Every mapping noted before the release that was valid still points at the same account.")
rep("REL-03", "that account is unchanged.", "that account keeps its name and number.")
rep("INV-01", "The invoice is created as today, with no confirmation window, for $240.00 plus the usual tax and shop supplies.",
    "The invoice is created at once, with no confirmation window, and shows on the Finance tab for $240.00 plus the location's tax and shop supplies.")
addpre("INV-02", PRODWIN)
addpre("INV-02", "In that production window, have a new invoiced billable work order for this test, work order P.")
steps("INV-02", BY["INV-02"]["steps"] + ["Open work order P in the production window.", "Open the Finance tab.",
                                          "Open the invoice menu on the Finance tab.", "Click \"Reverse\"."],
      BY["INV-02"]["res"][:3] + [["The invoice is reversed; note the status work order 1 shows and what its Finance tab shows."],
                                 ["Work order P opens."], ["The invoice shows."], ["The menu offers \"Reverse\"."],
                                 ["Work order P shows the same status and the same Finance tab as work order 1 after step 4."]],
      "'reversed as today' compared with Reverse on production (steps 5-8)")
rep("INV-03", ", and is invoiced as today.", ".")
rep("INV-04", "The line is approved as on a billable work order.", "The line shows as approved.")
rep("INV-05", "with no prices, as it does today.", "with no prices.")
rep("INV-07", "(2.0 h × $150.00), as today.", "(2.0 h × $150.00).")
rep("INV-08", "Have a new customer for this test, customer A.", "Have a new customer for this test, customer A, with its own labor rate of $120.00 an hour.")
rep("INV-08", "The invoice shows its prices and totals as today, with no NO CHARGE stamp and no category line.",
    "The invoice shows the line at $240.00 (2.0 h × $120.00) and its totals, with no NO CHARGE stamp and no category line.")
rep("INV-10", "The deposit window opens as today.", "The deposit window opens.")
rep("INV-10", "The $50.00 deposit is recorded as today.", "The $50.00 deposit is listed on the Finance tab.")
rep("INV-11", "(10% of $240.00), as today.", "(10% of $240.00).")
rep("INV-12", "with the restocking fee option, as today.", "with the restocking fee option.")
rep("INV-13", "The line card shows $240.00 and the price summary as today, with no stamp, no category and no changed-estimate notice.",
    "The line card shows $240.00 (2.0 h × $120.00) and the price summary includes the $240.00, with no stamp, no category and no changed-estimate notice.")
rep("INV-14", "\"Create invoice\" is offered, as today.", "\"Create invoice\" is offered.")
rep("INV-15", "The header status reads as before (Review).", "The header status reads Review.")
addpre("INV-15", PRODWIN)
addpre("INV-15", "In that production window, have a new open part sale for this test, part sale P.")
rep("INV-15", "The part sale header reads as before.", "The part sale header shows its status with no Closed, Internal or No Charge label; note the status.")
BY["INV-15"]["steps"].append("Open part sale P in the production window.")
BY["INV-15"]["res"].append(["Part sale P's header shows the same status label as the part sale in step 2."])
_log("INV-15", "step 3 added: the part sale's status label compared with production")
rep("INV-16", "The settings are saved as before.", "The settings are saved, with no window and no message about Internal Work Orders.")
title("INV-17", "Administration shows the same sections as production, plus one tab")
BY["INV-17"]["pre"].append(PRODWIN)
steps("INV-17", ["Open Administration.", "In the production window, open Administration."],
      [["The Administration sections show; note them in order."],
       ["Production shows the same sections in the same order.",
        "The only difference is the \"Internal Work Orders\" tab under Service, which production does not show."]],
      "rewritten: 'where it was before' compared with Administration on production; precondition for the production window added")
BY["S1-84"]["pre"].append(PRODWIN)
steps("S1-84", ["Open Administration > Service.", "In the production window, open Administration > Service."],
      [["The \"Internal Work Orders\" tab sits directly after \"Fees & Discounts\"."],
       ["Production shows the same Service tabs in the same order, without \"Internal Work Orders\"."]],
      "'the other Service tabs are where they were' compared with production (step 2)")
rep("INV-19", "\"Create invoice\", as today.", "\"Create invoice\".")
rep("INV-19", "The invoice is created as today.", CREATED)
rep("INV-20", "with one part that carries a core.", "with one part that carries a core of $50.00.")
rep("INV-20", "The core step shows the core amount, as today.", "The core step shows the part's $50.00 core.")
addpre("INV-21", PRODWIN)
addpre("INV-21", "In that production window, have a new billable work order for this test, work order P, in status Approved.")
rep("INV-21", "The menu shows Audit Log, Timesheets, \"Add Work Order Fee / Discount\", Print and Delete as before, plus \"Convert to No Charge\".",
    "The menu shows \"Convert to No Charge\" among its items; note the items in order.")
BY["INV-21"]["steps"] += ["Open work order P in the production window.", "Open the work order's three-dots menu."]
BY["INV-21"]["res"] += [["Work order P opens."], ["The menu shows the same items in the same order as in step 2, without \"Convert to No Charge\"."]]
title("INV-21", "A billable work order's menu matches production plus Convert to No Charge")
_log("INV-21", "the menu list (not in any source) replaced by a comparison with the same menu on production (steps 3-4)")
rep("INV-22", "Change Customer is refused for the deposit, as today.", "Change Customer is disabled, with a tooltip about the deposit.")
rep("INV-22", "offers no Change Customer, as today.", "offers no Change Customer.")
rep("INV-23", "for the line, as today.", "for the line.")
rep("INV-24", "Work order 1 opens.", "Work order 1 opens; its second line shows $240.00 (2.0 h × $120.00).")
rep("INV-24", "The moved line shows $240.00, as before the split, and no badge.", "The moved line shows $240.00, as it did in step 1, and no badge.")
rep("INV-25", "and the 5% discount, as today.", "and the 5% discount.")
rep("INV-26", "\"Updating the cost also updates the sell price\", as today.", "\"Updating the cost also updates the sell price\".")
rep("INV-26", "The sell price preview updates from the new cost, as today.", "The sell price preview changes to a price worked out from the $60.00 cost.")
rep("INV-27", "its edit menu, as today;", "its edit menu;")
rep("INV-28", "Work order 3 is listed, as today.", "Work order 3 is listed.")
rep("INV-30", "Cost of Parts, as today.", "Cost of Parts.")
rep("INV-31", "\"Work Order Create\", as today.", "\"Work Order Create\".")
rep("INV-32", "The record is listed with its status as today.", "The record is listed with no \"Closed\" pill and no \"Internal\" or \"No Charge\" badge.")
rep("INV-32", "The record has no \"No Charge lines\" block and its entries post as today.",
    "The record has no \"No Charge lines\" block and none of its entries posts to a category account.")
rep("INV-34", "The payment is taken and recorded in ShopView, as today.", "The portal confirms the payment, and work order 1's invoice shows Paid in ShopView.")
rep("INV-35", "The portal's new invoice email has arrived, as today.", "The portal's new invoice email for work order 1 has arrived.")

# ---- 2. plan quotes that were code: bullets only the code backed, and dropped quotes --------------------------------------------
rep("S2-22", "The \"Internal\" badge is filled orange; the \"No Charge\" badge is outlined in orange.",
    "The \"Internal\" badge is filled; the \"No Charge\" badge is outlined.", "result reworded to the plan's behaviour words")
rep("S2-24", "The third column is headed \"Cost\"; no Labour type column shows.", "The third column is headed \"Cost\".",
    "result reworded to the plan's behaviour words")
rep("S2-67", "The \"Closed\" status shows in a neutral grey; the orange is only on the badge.",
    "The \"Closed\" status shows in a neutral colour, not orange; the orange is only on the badge.", "result reworded to the plan's behaviour words")
delb("S6-01", "The Internal row comes first, then the No Charge rows by name: Comeback, Goodwill, Warranty.", "backed only by code")
dropq("S6-01", "TP-600")
delb("S8-01", "The \"Closed\" pill is grey.", "backed only by a code file reference"); dropq("S8-01", "TP-635")
delb("S8-03", "The credit side is account 1300 (Inventory).", "backed only by code; the first bullet already says Inventory")
delb("S8-03", "Its source document reads \"Internal work order [number]\".", "backed only by code; the PRD's source wording is in the first bullet")
dropq("S8-03", "TP-614", "TP-604")
delb("S8-04", "Its source document reads \"No-charge work order [number]\".", "backed only by code; the PRD's source wording is in the first bullet")
dropq("S8-04", "TP-604")
delb("S8-07", "The Held pill is amber.", "backed only by code"); dropq("S8-07", "TP-395", "TP-497")
rep("S8-30", "The first record is Void with its number suffixed; a new Closed record carries work order 1's number.",
    "The first record is Void; a new Closed record carries work order 1's number.", "result reworded (the suffix was backed only by code)")
dropq("S8-30", "TP-579")
delb("S9-09", "The date presets include \"Last 12 months\".", "backed only by a code constant"); dropq("S9-09", "TP-507")
for k, t in (("INV-16", "TP-020"), ("API-27", "TP-057"), ("REL-07", "TP-064"), ("S6-09", "TP-093"), ("INV-19", "TP-125"), ("INV-17", "TP-199"),
             ("S1-84", "TP-199"), ("S1-85", "TP-270"), ("API-26", "TP-304"), ("S1-67", "TP-347"), ("INV-23", "TP-373")):
    dropq(k, t)
# S2-105 (list footer total) rested on one plan line that states the footer only in code: retired before it reached TestRail
CASES.remove(BY["S2-105"]); _log("S2-105", "retired: its only source for the footer total is a code reference (TP-522); the \"No Charge\" Total Price check stays in the other work orders list cases")

cases_tp.TP_OUT.update({
 "TP-020": "Stated only as a request path and setting key; INV-16 checks the behaviour from the PRD (KD-ORG) and TP-547.",
 "TP-093": "Stated only through code names; S6-09 quotes the same behaviour from TP-496.",
 "TP-199": "A note about a test file, not a behaviour; S1-84 and INV-17 compare Administration with production.",
 "TP-270": "Stated only through a table name; S1-85 checks the field from the PRD (S1-R15).",
 "TP-347": "Stated only as a request parameter; S1-67 checks archived categories from the PRD (S1-R16, S12-E4).",
 "TP-395": "A colour key in code; the Held state is checked from the PRD (S8-N2) and against the design picture (D-84).",
 "TP-497": "A colour entry in code; as TP-395.",
 "TP-507": "A code constant (date presets); the 12-month limit is quoted from TP-344.",
 "TP-522": "The footer total is stated only through a component file and field; S2-105 retired.",
 "TP-579": "The number suffix is stated only through code names; S8-30 checks Void and the new record from TP-626.",
 "TP-600": "The row order is stated only through code keys; the bullet was removed from S6-01.",
 "TP-604": "A code call; the source wording is quoted from the PRD (S8-R2) in S8-03 and S8-04.",
 "TP-614": "Account numbers inside a code sentence; S8-03 checks the posting from the PRD (S8-R2).",
 "TP-635": "A code file reference (grey pill); S8-01 checks the Closed record from the PRD.",
})
