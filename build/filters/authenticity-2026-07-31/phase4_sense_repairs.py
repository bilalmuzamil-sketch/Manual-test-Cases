#!/usr/bin/env python3
"""PHASE 4 Dimension-2 (MAKES SENSE) repairs — Filters closing-authenticity pass.

Found by the COLD READ of all 110 active case bodies (not by a script): two cases
fail Rule-28 fail-condition 6 (*not actionable* — a tester cannot tell what to DO)
in a small way. Both are wording-only; no expectation or behaviour changes.

S1 — FLT-PSRCH-06 = C38891: steps 1-5 are bare LISTS of surfaces with no verb
     ("1. Work Orders surfaces: the Work Orders list, ..."), and the action only
     arrives in step 6. A non-technical tester reading step 1 has nothing to do.
     Each list step now starts with "Visit ...", so every step is an instruction.

S2 — FLT-MOB-01 = C29621: expected 3 ended "(per the design variant)" — internal
     design jargon in a tester-facing line (Rules 7/9). Replaced with the plain
     hedge pattern the rest of the suite uses.

LOCAL ONLY — the TestRail write is the Phase 5 authorized push.
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caseio import active, patch

def main():
    cases = {c["id"]: c for _, c in active()}

    p6 = cases["FLT-PSRCH-06"]
    steps = list(p6["steps"])
    repl = {
        0: "1. Visit the Work Orders surfaces: the Work Orders list, a work order's History tab, the Work Order Log dialog opened from that tab's kebab menu, a line's Line Log dialog opened from the Lines tab, and the work order's Notes tab.",
        1: "2. Visit the customer and asset surfaces: the Customers list, then on one customer - Contacts, Assets, Invoices, Work Orders, Part Sales, Fees & Discounts, Notes; then on one asset - Work Orders, Invoices, Notes.",
        2: "3. Visit the Parts surfaces: Inventory, Catalog, Part Sales, Purchase Orders, Returns, Credits, Vendors, Vendor Invoices (web address /parts/deliveries), a vendor's Unpaid Invoices, and Part History.",
        3: "4. Visit the Administration surfaces: Locations, Roles & Permissions, Staff, Departments, Taxes, Labor Rates, Canned Lines, Payment Methods, Fees & Discounts, Asset Types, Categories, Pricing.",
        4: "5. Visit the Reports and Dashboard surfaces: IBS Batch Transactions, Sales Tax Invoices, the Dashboard, and one dashboard report drill-down.",
    }
    for i, t in repl.items():
        assert steps[i].startswith("%d." % (i + 1)), steps[i]
        steps[i] = t

    m1 = cases["FLT-MOB-01"]
    exp = list(m1["expected"])
    old = "3. A right-edge arrow affordance indicates the row can be scrolled (per the design variant)."
    assert exp[2] == old, exp[2]
    exp[2] = ("3. An arrow at the right-hand edge shows that the row can be scrolled. "
              "(This is what the design shows - if your screen looks different, write down "
              "what you actually see and carry on.)")

    edits = {"FLT-PSRCH-06": {"steps": steps}, "FLT-MOB-01": {"expected": exp}}
    for iid, e in edits.items():
        print("===", iid)
        for k, v in e.items():
            for line in v:
                print("   ", line)
    print("patched:", patch(edits))

if __name__ == "__main__":
    main()
