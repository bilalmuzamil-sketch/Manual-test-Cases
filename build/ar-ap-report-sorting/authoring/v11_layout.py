"""Currency check of 10 Nov 2026 (PRD version 11 of 5 Nov 2026, Jira of 10 Nov 2026, the design version of 5 Nov 2026; QA lead round 2:
"Named set", "Yes, both", "Yes, add Q1 only", "Remove old, add later"). Assessment: build/ar-ap-report-sorting/currency-2026-11-10/ASSESSMENT.md.

This layer is applied last (ar_lib.C for the case model: removals, added quotes and notes; pattern.pattern for the tester's words, after the
tester read-through layer). Every replacement must find its target (pattern.apply_layout raises otherwise).

  REMOVED  cases taken out of the library (proposed for deletion; the QA lead deletes them in TestRail)
  Q_ADD    quotes added to a case (requirement codes or named PRD items, quoted word for word from PRD version 11)
  NOTE     a case's note replaced ("" removes it)
  LAYOUT   the tester's words (apply_layout keys: title, pre_set, step_set, res_step, sub, pre_sub, step_sub, res_sub, title_sub)"""

REMOVED = {
    "REL-08": ("C715478", "A credit dated on the as-of date stays in the same bucket as before",
               "PRD version 10/11 S1-R5a moves SV-11441 into scope (a credit dated on the as-of date is Current with Past Due 0) and drops it from "
               "Out of Scope; replaced by the S1-R5a cases and the release-day case of 10 Nov 2026. Deleted on the QA lead's order of 10 Nov 2026 "
               "(\"Yes, both\"); the QA lead deletes it in TestRail."),
}

Q_ADD = {
    "S5-18": ["S5-E3"],
    "REL-01": ["WC-12", "WC-13", "WC-14"],
    "REL-02": ["WC-12", "WC-13", "WC-14"],
    "D-63": ["S7-R7"],
    # the tech plan (21 Oct 2026) is behind PRD v11 S8-R3 here; quoted as the divergence it is (Rules 115, 134.5)
    "D-16": [("Tech plan §7 Manual testing checklist", "1. At 1440 px every column of all six reports fits; headings never wrap; Location wraps only on A/P Detail (S8-R3).")],
}

NOTE = {"S5-18": "",
        "REL-02": "",   # the A/R overpaid-invoice note was copied into the A/P case (found in the 10 Nov 2026 reading)
        "D-16": ("Where the tech plan differs: the tech plan (21 Oct 2026) says Location wraps only on A/P Detail; PRD version 11 (S8-R3, 5 Nov 2026) "
                 "lets it wrap on A/P Unpaid Invoices too. This case follows the PRD.")}   # the step-3 hedge ("If step 3 keeps location B unticked ...") is settled by S5-E3

_ARS = ("Only the order may differ, and, as PRD section 2 lists for this release, a credit memo or deposit dated exactly on the as-of date "
        "now counts in Current, where it was in 1-30 Days.")
_ARD = ("Only the order may differ, and these three changes PRD section 2 lists for this release: Date and Due Date are plain dates (for "
        "example \"Nov 4, 2026\") where the screenshot shows \"Today\", \"Yesterday\" or \"2 days ago\"; a credit shows \"Credit Memo\" or "
        "\"Deposit\" under Transaction Type where it shows \"Credit\"; and a credit memo or deposit dated exactly on the as-of date is in "
        "\"Current\", where it was in \"1-30 days past due\".")
_ARC = ("Only the order may differ, and these three changes PRD section 2 lists for this release: Date and Due Date are plain dates (for "
        "example \"Nov 4, 2026\") where the screenshot shows \"Today\", \"Yesterday\" or \"2 days ago\"; a credit shows \"Credit Memo\" or "
        "\"Deposit\" under Transaction Type where it shows \"Credit\"; and a credit memo or deposit dated exactly on the as-of date shows "
        "Past Due 0, where it showed 1.")
_APS = ("Only the order may differ, and, as PRD section 2 lists for this release, a vendor credit dated exactly on the as-of date now counts "
        "in Current, where it was in 1-30 Days.")
_APD = ("Only the order may differ, and these three changes PRD section 2 lists for this release: Date and Due Date are plain dates (for "
        "example \"Nov 4, 2026\") where the screenshot shows \"Today\", \"Yesterday\" or \"2 days ago\"; a vendor credit shows \"Vendor Credit\" "
        "under Transaction Type where it shows \"Credit\"; and a vendor credit dated exactly on the as-of date is in \"Current\" with Past Due 0, "
        "where it was in \"1-30 days past due\" with Past Due 1.")
_APU = ("Only the order may differ, and these two changes PRD section 2 lists for this release: Date and Due Date are plain dates (for example "
        "\"Nov 4, 2026\") where the screenshot shows \"Today\", \"Yesterday\" or \"2 days ago\"; and a vendor credit shows \"Vendor Credit\" "
        "under Transaction Type where it shows \"Credit\".")

LAYOUT = {
    "S5-18": dict(res_step={3: ["The report reloads for date A.",
                                "Location A is still ticked: it is in the Location list for date A.",
                                "The Location chip is not shown: the only location in the list is ticked."]}),
    "S9-03": dict(res_sub=[('In the heading row "Phone" and "Credit term" columns come right after "Customer".',
                            'In the heading row "Phone" and "Credit Term" columns come right after "Customer".')]),
    "S9-04": dict(res_sub=[('No "Credit term" column.', 'No "Credit Term" column.')]),
    "REL-01": dict(res_sub=[("Only the order and, for customers with an overpaid invoice, the Totals row may differ.",
                             _ARS + " For customers with an overpaid invoice the Totals row may differ too.")],
                   res_step=None),
    "REL-03": dict(res_sub=[("three-letter month, the day without a leading zero, four-digit year (for example \"As of Oct 5, 2026\")",
                             "three-letter month, day, four-digit year (for example \"As of Oct 15, 2026\")")]),
    "D-16": dict(res_sub=[("Money, date and number cells stay on one line, and Location does not wrap.",
                           "Money, date and number cells stay on one line.")],
                 res_step=None),
    "D-63": dict(title="Design: A/R Detail invoice numbers are blue links, credit memos plain text",
                 pre_set=[("Open the design picture \"Links only where they can open\"", [])],
                 step_set={1: "Read the header row, letter for letter.", 3: "Look at the subtotal row at the end of the bucket."},
                 res_sub=[("The chevron, then the columns in the picture's order, letter for letter:", "The chevron, then the columns in this order, letter for letter:")],
                 res_step=None),
    "D-68": dict(title="Design: No locations shows the empty state with no Totals row",
                 pre_set=[("Open the design picture \"Cleared: No locations\"", [])],
                 pre_sub=[("so the Location column and the Location chip show, as in the design picture.", "so the Location column and the Location chip show.")],
                 res_step={2: ["The menu closes.",
                               "The chip reads \"Location: No locations\" with the location pin icon, still in the filter row.",
                               "The table area shows the column headings without a Location column, then the empty state.",
                               "No rows and no Totals row.",
                               "The empty state reads, letter for letter, \"No record matches these filters\", \"Try changing filters to widen your results.\" and a \"Clear all filters\" button."]}),
    "D-73": dict(title="Design: the Vendor menu shows its search box and rows in order",
                 pre_set=[("Open the design picture \"The native Vendor menu\"", [])],
                 res_step={1: ["The menu opens under the chip (\"Vendor: All vendors\", truck icon).",
                               "Its rows read, top to bottom, a search box with the placeholder \"Search vendors\", \"All vendors\" (ticked), the line \"All vendors are included. Pick one or more to narrow.\", then the vendors."]}),
    "D-81": dict(pre_set=[("Open the design pictures \"Links only where they can open\"",
                           ["Open the design picture \"Expand all from the header\" (ar-ap-p3-expand-all-from-the-header.png) (attached to this case) beside the browser at 100% zoom; compare the layout, labels and styles, not the names and amounts, which are only examples."])],
                 res_sub=[("every word starts with a capital letter, as in the picture and as on the A/P reports.", "every word starts with a capital letter, as on the A/P reports.")]),
}
# REL-01 and REL-02: every step's "Only the order may differ." gets the section-2 changes for that report; REL-02's last result, copied
# from REL-01, spoke of the A/R Summary overpaid-invoice Totals and is removed (found in the 10 Nov 2026 reading).
LAYOUT["REL-01"] = dict(res_sub=[("Only the order and, for customers with an overpaid invoice, the Totals row may differ.",
                                   _ARS + " For customers with an overpaid invoice the Totals row may differ too.")])
LAYOUT["REL-02"] = {}
LAYOUT["D-16"] = dict(res_sub=[("Money, date and number cells stay on one line, and Location does not wrap.",
                                "Money, date and number cells stay on one line, and a long location name wraps onto a second line (Location wraps only here and on A/P Detail).")])
LAYOUT["D-13"] = dict(res_sub=[("Money, date and number cells stay on one line, and Location wraps only on this report (nine columns).",
                                "Money, date and number cells stay on one line, and Location wraps onto a second line when long (only here and on A/P Unpaid Invoices).")])
LAYOUT["D-63"]["res_step"] = {2: ["Customer A's is a blue link (another location you work at).",
                                  "Customer B's is plain dark text, not blue.",
                                  "Customer C's is a blue link.",
                                  "The links are semi-bold and not underlined."]}

def by_report(out, per_step):
    """REL-01 / REL-02: replace "Only the order may differ." in step n's bullets with per_step[n]; drop a bullet that names A/R in an A/P case."""
    res = []
    for n, r in enumerate(out["results"], 1):
        rr = []
        for b in r:
            if b == "Only the order may differ.": b = per_step[n]
            rr.append(b)
        res.append(rr)
    return res

def apply(c, out):
    import pattern as PT
    k = c["key"]
    L = {kk: v for kk, v in LAYOUT.get(k, {}).items() if v is not None}
    if k == "REL-01":
        out = dict(out, results=by_report(PT.apply_layout(c, out, L), {1: _ARS, 2: _ARD, 3: _ARC})); return out
    if k == "REL-02":
        res = by_report(out, {1: _APS, 2: _APD, 3: _APU})
        res = [[b for b in r if "A/R Summary Totals row" not in b] for r in res]
        return dict(out, results=res)
    return PT.apply_layout(c, out, L) if L else out

# Found in the full reading of 10 Nov 2026 (Rules 134, 137): the A/P Summary design cases named a "Transaction Type" that the
# Summary has no column for, and the A/R Summary ones a "credit memo row" (a Summary lists customers, not documents).
_APSUM_OLD = ("including a vendor credit (its Transaction Type is the longest), so the page shows a long name and a long Transaction Type, "
              "which must not overlap or be cut off.")
_APSUM_NEW = "including a vendor credit, so the page shows a long name and a negative amount, which must not overlap or be cut off."
_ARSUM_OLD = "including a credit memo, so the page shows a long name and a credit memo row, which must not overlap or be cut off."
_ARSUM_NEW = "including a credit memo, so the page shows a long name and a negative amount, which must not overlap or be cut off."
LAYOUT["D-10"] = dict(pre_sub=[("including a vendor credit (its Transaction Type is the longest).", "including a vendor credit.")])
LAYOUT["D-11"] = dict(pre_sub=[(_APSUM_OLD, _APSUM_NEW)])
LAYOUT["D-12"] = dict(pre_sub=[(_APSUM_OLD, _APSUM_NEW)])
LAYOUT["D-02"] = dict(pre_sub=[(_ARSUM_OLD, _ARSUM_NEW)])
LAYOUT["D-03"] = dict(pre_sub=[(_ARSUM_OLD, _ARSUM_NEW)])
# REL-03 runs on today's date; for a day before the 10th the PDF's leading zero is question 18 (S3-R4 against S3-R7a), so the
# tester judges the date itself, not its leading zero.
LAYOUT["REL-03"]["res_sub"].append(("not tomorrow's date.",
    "not tomorrow's date. On a day before the 10th, judge only which date it is: whether the day carries a leading zero is waiting on the product owner."))
