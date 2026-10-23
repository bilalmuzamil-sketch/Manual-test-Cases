#!/usr/bin/env python3
"""DESIGN-FIGURES-2026-10-23.json: every figure of the 9 boards (62), with board, page, badge and what it means, heading, caption items,
the picture file we rendered (images/), the screenshot it embeds (if any), and the state it shows (written after viewing each picture)."""
import json, os
H = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
log = json.load(open(f"{H}/render/render-log.json"))
cj = json.load(open(f"{H}/files/project/canvas.json"))
pages = {p["id"]: p["name"] for p in cj["pages"]}
STATE = {
 ("Main", 1): "Credit Terms page, Active tab (13), one table: Name, Due, Customers, Vendors, unlabeled ⋯ column; COD / Due on Receipt / Credit Hold with info + lock icons; Default tag on Due on Receipt; the lock tooltip open on COD",
 ("Main", 2): "Active tab with the Due on Receipt info tooltip open (right of the icon, over the Due column)",
 ("Main", 3): "Active tab with the COD info tooltip open",
 ("Main", 4): "row menu of an unused term the shop created (Net 6): Edit, Make Default for New Customers, Move Customers greyed, Deactivate, divider, Delete Credit Term red (build capture)",
 ("Main", 5): "row menu of a standard term (Net 15) with Deactivate hovered and its tooltip (build capture)",
 ("Main", 6): "row menu of COD while COD is the default: Move Customers only, greyed, tooltip \"No customers are on this term\" (build capture)",
 ("Main", 7): "row menu of an in-use term the shop created (10th of next month): Edit and Delete greyed, Delete hovered with the \"Used by …\" tooltip (build capture)",
 ("Main", 8): "row menu of the current default (Net 30, standard): Move Customers, Deactivate greyed with the default tooltip; Make Default absent",
 ("Main", 9): "Make Default confirmation \"Make Net 30 the default?\" over the dimmed page (Cancel, Make Default)",
 ("Main", 10): "after Make Default: Default tag on Net 30, green success toast bottom right with Close",
 ("Main", 11): "Delete Credit Term confirmation \"Confirmation\" with grey Cancel and red Delete Credit Term (build capture)",
 ("Main", 12): "a 31-character term name on one line at 1440 px, and its wrapped \"… created\" toast (build capture)",
 ("Main", 13): "page ⋯ menu open with its one item Audit Log (build capture)",
 ("Main", 14): "Credit Terms Log window with 9 rows newest first (build capture)",
 ("Main", 15): "Credit Terms Log with no rows: \"No history here. Yet.\" (build capture)",
 ("Main", 16): "Credit Terms Log load error: the sentence in the table and a red error alert (build capture)",
 ("Default", 1): "row menu of Net 15 (5 customers) with Move Customers hovered (build capture)",
 ("Default", 2): "Move Customers from COD: search, Select All / Select None, 214 selected, ticked list, Move To prefilled with the default and its hint, Cancel / Move 214 Customers",
 ("Default", 3): "Move Customers with some customers unticked: 180 selected, Move 180 Customers",
 ("Default", 4): "Move Customers with the Move To dropdown open (active terms except COD, no Default tag)",
 ("Default", 5): "after the move: toast \"214 customers moved to Due on Receipt.\", COD 0 customers, Due on Receipt 252",
 ("Default", 6): "Move Customers from Net 7 with Move To COD: hint and the \"$0\" line under Move To, one customer unticked (build capture)",
 ("Default", 7): "the \"Set 14 customers' credit limit to $0?\" confirmation with a red Set Limits To $0 And Move (build capture)",
 ("Default", 8): "back in the Move window after Cancel in the $0 confirmation, choices kept (build capture)",
 ("Default", 9): "row menu of COD for a user without the customer permissions: Move Customers greyed with the permission tooltip",
 ("NewTerm", 1): "New Credit Term, Due Net X days chosen with 14, Day box disabled, blue information line",
 ("NewTerm", 2): "New Credit Term, Due day of the following month chosen with 10, Days box disabled, blue line",
 ("NewTerm", 3): "New Credit Term validation errors: Name \"net 30\" (standard-term error) and Days 400 (range error), Create disabled, no blue line",
 ("NewTerm", 4): "Edit Credit Term filled with an unused own term, Cancel / Save Changes (build capture)",
 ("NewTerm", 5): "Inactive tab, row menu of Net 7: Reactivate hovered with its tooltip, then Move Customers (build capture)",
 ("Empty", 1): "Active tab after deactivating everything possible: COD, Due on Receipt, Net 30 (Default), Credit Hold; counts 4 / 10",
 ("Empty", 2): "Inactive tab with the 10 deactivated terms in the same order",
 ("Empty", 3): "a new shop's empty Inactive tab (0): column headings and the line \"No inactive terms\"",
 ("NewCustomer", 1): "today's New Customer (production): no Credit Terms / Credit Limit",
 ("NewCustomer", 2): "New Customer with Credit Terms prefilled with the default (Due on Receipt) and an empty Credit Limit beside it",
 ("NewCustomer", 3): "New Customer with the Credit Terms dropdown open: active terms in order, Default tag on Due on Receipt (list drawn down to Net 60)",
 ("NewCustomer", 4): "New Customer with COD picked: Credit Limit $ 0.00 disabled and its hover text",
 ("NewCustomer", 5): "New Customer for a user without View and Manage AP/AR Data: no Credit Terms, no Credit Limit",
 ("Inactive", 1): "today's customer page (production)",
 ("Inactive", 2): "customer card on a deactivated term: Credit term \"Net 10 (Inactive)\"",
 ("Inactive", 3): "today's Edit Customer (production)",
 ("Inactive", 4): "Edit Customer keeping \"Net 10 (Inactive)\" selected, Credit Limit $ 5,000.00",
 ("Inactive", 5): "Edit Customer with the dropdown open for the customer on Net 10 (Inactive): active terms (Net 10 absent); the inactive row at the end is not visible in the drawing",
 ("Inactive", 6): "Edit Customer with COD picked: Credit Limit $ 0.00 disabled and its hover text",
 ("Inactive", 7): "Edit Customer dropdown for a customer on Net 30: Net 10 not offered",
 ("Vendor", 1): "today's New Vendor (branch build, unchanged)",
 ("Vendor", 2): "New Vendor starting on COD with the dropdown open: active terms incl. the shop's own, no Default tag; Credit Limit $ 0.00 editable",
 ("Vendor", 3): "today's Edit Vendor (branch build, unchanged)",
 ("Vendor", 4): "Edit Vendor dropdown open, Net 30 ticked",
 ("Vendor", 5): "today's vendor page (branch build, unchanged)",
 ("Vendor", 6): "vendor card on a deactivated term: Credit term \"Net 10 (Inactive)\"",
 ("Vendor", 7): "Edit Vendor dropdown for the vendor on Net 10 (Inactive): active terms then \"Net 10 (Inactive)\" last, ticked",
 ("Vendor", 8): "Edit Vendor dropdown for another vendor: Net 10 not offered",
 ("Vendor", 9): "today's vendor invoice on Net 60 (branch build, unchanged)",
 ("Vendor", 10): "vendor invoice for a vendor on 10th of next month: invoice Oct 5, 2026, due Nov 10, 2026 (highlighted)",
 ("Vendor", 11): "vendor invoice for a vendor on the shop's Net 10: invoice Oct 5, 2026, due Oct 15, 2026",
 ("OverCredit", 1): "today's Over Credit confirmation (branch build, unchanged): Confirmation, red Create, blue Cancel",
 ("OverCredit", 2): "New Work Order for a COD customer with a $0 limit who owes money: no confirmation",
 ("OverCredit", 3): "the confirmation that still shows (limit above $0 exceeded), wording unchanged",
 ("Invoice", 1): "today's invoice on Net 30 (branch build, unchanged): Terms chip, Due date under Invoice date",
 ("Invoice", 2): "invoice for a customer on 10th of next month dated Oct 5, 2026: Due date Nov 10, 2026, Terms chip \"10th of next month\"",
 ("Invoice", 3): "same customer, invoice dated Oct 28, 2026: still due Nov 10, 2026",
}
def badge_kind(b):
    if b == "This design": return "after: the new design, drawn"
    if b.startswith("Build"): return "after: captured from the feature's local build (" + b + ")"
    return "before: production today (" + b + ")"
figs = []
for board in cj["order"]:
    bl = log["boards"][board]; ex = json.load(open(f"{H}/extract/{board}.json")); stem = board.replace(".dc.html", "")
    for f, x in zip(bl["figures"], ex["figures"]):
        figs.append(dict(board=board, page=f"p{bl['page']} \"{pages[cj['boards'][board]['page']]}\"", board_title=cj["boards"][board]["title"],
                         board_width=cj["boards"][board]["w"], figure=f["n"], badge=x["badge"], badge_means=badge_kind(x["badge"]),
                         heading=x["heading"], caption=x["captions"], picture=f"images/{f['file']}", picture_size=f"{round(f['w'])}x{round(f['h'])}",
                         screen_width=1440, embeds_screenshot=(f"files/project/{f['img']}" if f["img"] else None),
                         screenshot_natural_size=f["imgOk"], img_alt=(x["imgs"][0]["alt"] if x["imgs"] else None), state=STATE[(stem, f["n"])]))
json.dump(dict(design="https://claude.ai/artifact/2erYxWz2ffDNcoXzEfu6wf", version="1792722751-b285", canvas_title=cj["title"],
               rendered="2026-10-23, Chromium (Playwright 1.56.1), light theme, each board at its own width; every figure screenshotted",
               figures=figs, counts=dict(figures=len(figs), drawn=sum(1 for f in figs if f["badge"] == "This design"),
                                          build_captures=sum(1 for f in figs if f["badge"].startswith("Build")),
                                          before=sum(1 for f in figs if "before" in f["badge"]))),
          open(f"{H}/DESIGN-FIGURES-2026-10-23.json", "w"), indent=1, ensure_ascii=False)
print(len(figs))
