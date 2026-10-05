#!/usr/bin/env python3
"""Founder Mode Part Sales — 4 new cases for requirements added in the 5 October 2026 specification edit.
Goes in its own folder (lesson L3) under Part Sales (section 20435).
  python3 new_cases_2026_10_05.py          # dry run
  python3 new_cases_2026_10_05.py --apply  # create folder + cases
"""
import sys, json, os
sys.path.insert(0, "build/founder-mode/part-sales")
from ps_lib import api, esc, ol, ul_raw
HERE = "build/founder-mode/part-sales"
SRC_TXT = open(f"{HERE}/sources/CONFLUENCE-867434569-PartSales-Update-v1-2026-10-05.md").read().replace("**", "")
APPLY = "--apply" in sys.argv
PARENT = 20435
FOLDER = "Specification update 5 October 2026 (QA Additions)"
MARKER = "<p>AUTOMATION: HOLD - authored from the 5 October 2026 specification; not yet build-verified on a Part Sales build</p>"

def Q(a, t):
    assert t in SRC_TXT, f"NOT VERBATIM {a}: {t[:80]}"
    return (a, t)

def src(story, jira, title):
    return (f"Epic SV-9667 (Founder Mode Batch #1); story {jira} ({title}); Part Sales Update v1 PRD (Confluence 867434569) "
            f"as edited 5 October 2026, {story}; read 5 Oct 2026. Source-verified 5 October 2026; not yet build-verified.")

def expected(results, source, quotes):
    return ("<p><strong>Expected results</strong></p>" + ul_raw(esc(r) for r in results) + "<p></p>"
            + f"<p><strong>Source — where this behaviour comes from</strong><br>{esc(source)}</p><p></p>"
            + "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
            + ul_raw(f"<strong>{esc(a)}:</strong> &ldquo;{esc(q)}&rdquo;" for a, q in quotes) + "<p></p>" + MARKER)

ROLE = "You are signed in as a user with the Part sales -> Create & Edit permission, on the build under test."
CUST = 'A customer to sell to exists; if none does, create one first: Customers -> New Customer (e.g. "4 Star Truck Repair").'
DEP_ROLE = "You are signed in as a user with BOTH Part sales -> Create & Edit AND Invoicing & payments -> Create & Edit, on the build under test."

CASES = [
 {"anchors": ["S3-R6"], "title": "Customer Part Sales tab: Total Price includes tax",
  "pre": [ROLE, CUST,
          "A tax rate set on the shop for the customer (e.g. 8.25%).",
          "A part sale with a known taxable total. Seed it:",
          '↳ Part Sales -> New Part Sale, select the customer (e.g. "4 Star Truck Repair"); Add Part with a Sell Price of $100.00 (e.g.), taxable, Quantity 1.',
          "↳ Read the sale's total on its Finance tab: $108.25 with an 8.25% rate ($100.00 + $8.25 tax).",
          "A work order for the same customer with a taxable part (e.g. $100.00), for the comparison."],
  "steps": ["Open Customers, open the customer, and on the customer overview open the Part Sales tab.",
            "Find the seeded part sale and read its Total Price.",
            "Compare it with the sale's own total including tax (e.g. $108.25).",
            "Open the Work Orders tab on the same customer overview and read the work order's Total Price."],
  "results": ["The part sale's Total Price on the Part Sales tab includes tax: $108.25 in the example ($100.00 + $8.25 tax), not $100.00.",
              "It equals the part sale's own total including tax, to the cent.",
              "The Work Orders tab's Total Price includes tax in the same way, so both tabs read alike."],
  "source": src("Story 3", "SV-10264", "Change the tax on a part sale"),
  "quotes": [Q("S3-R6", "On the customer overview's Part Sales tab, each part sale's Total Price includes tax, as the Work Orders tab's does (SV-9226)")]},

 {"anchors": ["S8-N6"], "title": "Closing New Customer Payment unpaid reverses the invoice",
  "pre": [DEP_ROLE, CUST,
          "A part sale at Complete. Seed it: Part Sales -> New Part Sale, select the customer, Add Part with a Sell Price (e.g. $290.91), then Order and Receive the part (receiving takes the sale to Complete).",
          "For the comparison, a service work order for the same customer at Complete."],
  "steps": ["On the part sale, click Create Invoice and read what opens.",
            "Close New Customer Payment without paying.",
            "Read the part sale's status, then try to edit it (e.g. change the Sell Price to $300.00 and save).",
            "On the work order, click Create Invoice, close New Customer Payment without paying, and read its status."],
  "results": ["Create Invoice opens New Customer Payment.",
              "Closing it without paying reverses the invoice: the part sale is back to Complete and can be edited again (e.g. the Sell Price change saves).",
              "The work order behaves the same way."],
  "source": src("Story 8", "SV-10269", "Take a deposit on a part sale"),
  "quotes": [Q("S8-N6", "Create Invoice opens New Customer Payment"),
             Q("S8-N6", "Closing it without paying reverses the invoice, so the part sale returns to Complete and can be edited again"),
             Q("S8-N6", "A work order behaves the same way")]},

 {"anchors": ["S8-R15"], "title": "Smallest deposit is $0.01, zero is refused; portal minimum $1.00",
  "pre": [DEP_ROLE, CUST,
          'A part sale in Estimate, Approved or Complete status. Seed it: Part Sales -> New Part Sale, select the customer (e.g. "4 Star Truck Repair"), Add Part with a Sell Price (e.g. $290.91), and open the Finance tab.',
          "For the portal steps only: the shop takes online payments and Collect in Portal is enabled on this build. If Collect in Portal is disabled (the Customer Portal does not yet take part sale deposits), mark steps 4-5 Blocked and say so."],
  "steps": ["Click Add Deposit, enter a Deposit Amount of $0.00, and try Record Deposit.",
            "Change the Deposit Amount to $0.01 and click Record Deposit; read the deposit in the payment history.",
            "On a service work order, try a $0.00 and a $0.01 deposit the same way, for the comparison.",
            "Click Add Deposit again and use Collect in Portal; open the portal link as the customer and try to pay $0.99.",
            "In the portal, change the amount to $1.00 and pay."],
  "results": ["A $0.00 deposit is refused.",
              "A $0.01 deposit is accepted and shows as $0.01 in the payment history.",
              "The work order deposit refuses $0.00 and accepts $0.01 in the same way.",
              "In the Customer Portal, $0.99 is refused and $1.00 is accepted (the portal's own $1.00 minimum)."],
  "source": src("Story 8", "SV-10269", "Take a deposit on a part sale"),
  "quotes": [Q("S8-R15", "The smallest deposit is $0.01 and zero is refused, the same as a work order deposit"),
             Q("S8-R15", "A deposit paid through the Customer Portal follows the portal's own $1.00 minimum")]},

 {"anchors": ["FORM-768"], "title": "From 768px wide, Return Core and Actions stay visible, no scrolling",
  "pre": [ROLE, CUST,
          "A part sale with a received part carrying a core, so Return Core is offered. Seed it: Part Sales -> New Part Sale, select the customer, Add Part with a Core Charge (e.g. $79.99), then Order and Receive the part.",
          "A portrait tablet 768 pixels wide (e.g. an iPad in portrait), or a desktop browser window narrowed to about that width."],
  "steps": ["Open the part sale on the tablet in portrait (768 pixels wide).",
            "On the Parts grid, without scrolling sideways, look for Return Core on the core row and for the Actions column.",
            "Click Return Core, then use an action in the Actions column.",
            "Turn the tablet to landscape (wider) and repeat steps 2-3."],
  "results": ["At 768 pixels wide, Return Core and the Actions column are visible without scrolling sideways.",
              "Both can be clicked and work at that width.",
              "At any wider size they stay visible and clickable the same way.",
              "No phone layout is expected; narrower than 768 pixels is not tested."],
  "source": ("Epic SV-9667 (Founder Mode Batch #1); Part Sales Update v1 PRD (Confluence 867434569) as edited 5 October 2026, "
             "Feature Overview -> Form factor; read 5 Oct 2026. Source-verified 5 October 2026; not yet build-verified."),
  "quotes": [Q("Form factor", "From 768px wide (a portrait tablet) upward, the Return Core action and the Actions column stay visible and clickable without scrolling sideways, because counter staff do carry one"),
             Q("Form factor", "Desktop first, usable down to 768px wide"),
             Q("Form factor", "so no phone layout is owed")]},
]

def main():
    from runnable_pre_2026_10_05 import NEW_PRE
    for cs in CASES:
        assert len(cs["title"]) <= 80, cs["title"]
        cs["pre"] = NEW_PRE[cs["anchors"][0]]
    if not APPLY:
        for cs in CASES: print(f"[DRY] {cs['anchors']}  {cs['title']}  ({len(cs['title'])} chars)")
        return
    sec = api("add_section/1", {"suite_id": 1, "parent_id": PARENT, "name": FOLDER})
    print("[OK] folder", sec["id"], sec["name"])
    log = {}
    for cs in CASES:
        r = api(f"add_case/{sec['id']}", {"title": cs["title"], "custom_preconds": ol(cs["pre"]), "custom_steps": ol(cs["steps"]),
             "custom_expected": expected(cs["results"], cs["source"], cs["quotes"]), "custom_automation_type": 2, "custom_atmstatus": 1})
        log[str(r["id"])] = {"title": cs["title"], "anchors": cs["anchors"], "section": sec["id"]}
        print(f"[OK] C{r['id']}  {cs['title']}")
    json.dump({"folder": sec["id"], "cases": log}, open(f"{HERE}/new-cases-2026-10-05.json", "w"), indent=1)

if __name__ == "__main__":
    main()
