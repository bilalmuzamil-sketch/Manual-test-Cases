"""Tester read-through, 26 Oct 2026 (QA lead: "GO", and "Make sure that your work does not bite me"; brief
build/tester-readthrough-2026-10-26/WORKER-BRIEF.md). Every case was read as a manual tester who has never seen the feature would
read it (title, preconditions, steps and expected results together). This layer is applied by pattern.pattern() after the
relevance pass (pattern.relate) and fixes what the reading found, without touching the quotes block, the References from Design
block or the AUTOMATION line (checked by build/tester-readthrough-2026-10-26/ar-ap-report-sorting/check_tail_identity.py):

  ENROL   PRD v9 makes the six reports organization-wide (Key Decisions; Out of Scope "Restricting these reports by the user's location
          enrollment"). "Make sure you are enrolled at both locations" stays only where a step or result depends on it: a document at
          another location is clicked (the "Switch location?" prompt, S7-R3; a bill there, S7-R6), a link at another location must
          show as a link (S7-R1, S7-R3), the location switcher must offer the other location (S5-33, S5-34, S5-12, REL-10, D-65), or
          another report's own Location filter must list it (REL-12, REL-12b, REL-12c); a case about a location the user is NOT
          enrolled in keeps its own line (S5-10, S5-11, S7-11). Everywhere else the line is removed.
  CURRENT "with location A as your current location" stays only where a step or result uses the current location.
  ROWS    "Make sure the report has open documents on today's date" says what to have, per report, and why.
  RT      per-case corrections (same keys as pattern.apply_layout: pre_set, res_step, step_set, sub, pre_sub, res_sub, step_sub;
          every replacement must find its target or the build stops)."""
import re

ENROL_LINE = "Make sure you are enrolled at both locations."
# document at another location clicked, switch prompt (S7-R3 / S7-R6 / S7-R8)
SWITCH = {"S7-03", "S7-04", "S7-05", "S7-06", "S7-09", "S7-20", "REL-07", "D-39", "D-40", "D-64"}
ENROL_REASON = {
    "S7-06": "Make sure you are enrolled at both locations, so bill B is plain text only because a bill page cannot switch location.",
    "D-63": "Make sure you are enrolled at both locations, so an invoice at your other location is a link.",
    "S5-12": "Make sure you are enrolled at both locations, so the location switcher lists both.",
    "S5-33": "Make sure you are enrolled at both locations, so you can switch to location B in the location switcher.",
    "S5-34": "Make sure you are enrolled at both locations, so you can switch to location B in the location switcher.",
    "REL-10": "Make sure you are enrolled at both locations, so you can switch to location B in the location switcher.",
    "REL-12": "Make sure you are enrolled at both locations, so both are in Sales By Customer's Location filter.",
    "REL-12b": "Make sure you are enrolled at both locations, so both are in Inventory Value's Location filter.",
    "REL-12c": "Make sure you are enrolled at both locations, so both are in Work In Progress's Location filter.",
}
ENROL_KEEP = SWITCH | set(ENROL_REASON) | {"D-65", "S5-10", "S5-11", "S7-11"}
CURRENT_KEEP = {"S5-10", "S5-11", "S5-12", "S7-20", "REL-03"}

ROWS_BULLET = "Make sure the report has open documents on today's date."
ROWS = {"ARS": "Have a customer with an open invoice on today's date, so the report has rows.",
        "ARD": "Have a customer with an open invoice on today's date, so the report has rows.",
        "ARC": "Have a customer with an overdue invoice on today's date, so the report has rows.",
        "APS": "Have a vendor with an open bill on today's date, so the report has rows.",
        "APD": "Have a vendor with an open bill on today's date, so the report has rows.",
        "APU": "Have a vendor with an unpaid bill on today's date, so the report has rows."}
LINKS = {"ARS": "Have a customer with an open invoice on today's date, so the report shows its name as a link.",
         "ARD": "Have a customer with an open invoice made at your current location on today's date, so its number shows as a link.",
         "ARC": "Have a customer with an overdue invoice made at your current location on today's date, so its number shows as a link.",
         "APS": "Have a vendor with an open bill on today's date, so the report shows its name as a link.",
         "APD": "Have a vendor with an open bill received on a delivery at your current location on today's date, so its number shows as a link.",
         "APU": "Have a vendor with an unpaid bill received on a delivery at your current location on today's date, so its number shows as a link."}
SORT2 = {"S2-36": "Have two customers with open invoices on today's date and different totals, so sorting by Total changes their order.",
         "S2-36b": "Have two open invoices in the same aging bucket on today's date, with different open balances, so sorting by Open Balance changes their order.",
         "S2-37": "Have a customer with two overdue invoices on today's date, with different open balances, so sorting by Open Balance changes their order.",
         "S2-37b": "Have two vendors with open bills on today's date and different totals, so sorting by Total changes their order.",
         "S2-38": "Have two open bills in the same aging bucket on today's date, with different open balances, so sorting by Open Balance changes their order.",
         "S2-38b": "Have a vendor with two unpaid bills on today's date, with different open balances, so sorting by Open Balance changes their order."}
AR_SWITCH = 'Make sure your role has the "View and Manage AP/AR Data" switch on.'
AR_SWITCH_WHY = 'Make sure your role has the "View and Manage AP/AR Data" switch on, so the credit term shows.'

def _two_loc_rows(doc):
    return ("Have open documents in this report on today's date at two locations, so the Location column shows.", doc)

RT = {
    "S1-12": dict(pre_set=[("Make sure each of the three A/R reports has open documents", [
        "Have a customer with an overdue invoice on today's date, so each of the three A/R reports has rows."])]),
    "S1-13": dict(pre_set=[("Make sure each of the three A/P reports has open documents", [
        "Have a vendor with an overdue bill on today's date, so each of the three A/P reports has rows."])]),
    "S2-25": dict(pre_set=[("Make sure the report has open invoices, credit memos and deposits in several buckets", [
        'Have open documents on today\'s date (invoices, credit memos and deposits) in the "31-60 days past due" and "1-30 days past due" '
        "buckets, at least two in each with different open balances and dates, so the re-sort can be seen."])]),
    "S2-27": dict(pre_set=[("Make sure the report has open bills and vendor credits in several buckets", [
        'Have open documents on today\'s date (bills and vendor credits) in the "31-60 days past due" and "1-30 days past due" '
        "buckets, at least two in each with different open balances and dates, so the re-sort can be seen."])]),
    "S2-39": dict(pre_set=[("Have open documents in these reports at two locations, location A and your other location.", [
        "Have open documents in this report at two locations, so the Location column shows."])]),
    "S3-24": dict(res_sub=[('The native empty state shows with "Clear all filters", no totals and no Location column.',
                            'The empty state shows, with a "Clear all filters" button, no totals and no Location column.')]),
    "S4-15": dict(pre_set=[("Make sure the report has open documents on today's date in several buckets.", [
        "Have open documents on today's date in at least two aging buckets, so there are bucket rows to expand and collapse."])],
        res_step={1: ["Each bucket row shows its chevron: pointing down when the bucket is expanded, pointing right when it is collapsed."]}),
    "S4-16": dict(pre_set=[("Make sure the report has open documents on today's date in several buckets.", [
        "Have open documents on today's date in at least two aging buckets, so there are bucket rows to expand and collapse."])],
        res_step={1: ["Each bucket row shows its chevron: pointing down when the bucket is expanded, pointing right when it is collapsed."]}),
    "S4-15b": dict(pre_set=[("Make sure the report has open documents on today's date in several customer groups.", [
        "Have at least two customers with overdue invoices on today's date, so there are customer groups to expand and collapse."])],
        res_step={1: ["Each customer group row shows its chevron: pointing down when the group is expanded, pointing right when it is collapsed."]}),
    "S4-16b": dict(pre_set=[("Make sure the report has open documents on today's date in several vendor groups.", [
        "Have at least two vendors with unpaid bills on today's date, so there are vendor groups to expand and collapse."])],
        res_step={1: ["Each vendor group row shows its chevron: pointing down when the group is expanded, pointing right when it is collapsed."]}),
    "S5-07": dict(pre_set=[("Make sure the report's Location list has 8 locations or fewer", [
        "Make sure no other location has open documents in this report on today's date, so the Location list holds only these two "
        "(8 or fewer, so there is no search box)."])]),
    "S5-08": dict(pre_set=[("Make sure the report's Location list has 8 locations or fewer", [
        "Make sure no other location has open documents in this report on today's date, so the Location list holds only these two "
        "(8 or fewer, so there is no search box)."])]),
    "S5-32": dict(res_sub=[("The empty state shows.", 'The empty state reads "No record matches these filters" and "Try changing filters to '
                                                         'widen your results." with a "Clear all filters" button.')]),
    "S8-12": dict(res_sub=[("While it loads, the native table progress bar shows.", "While it loads, a progress bar shows on the table.")]),
    "S9-01": dict(step_set={3: "Switch back to the report's tab."}),
    "REL-04": dict(pre_set=[("Make sure each of the six reports has open documents", [
        "Have a customer with an overdue invoice and a vendor with an overdue bill on today's date, so each of the six reports has rows "
        "and amounts."])]),
    "REL-04b": dict(pre_set=[("Make sure A/R Summary and A/P Detail have open documents", [
        "Have a customer with an open invoice and a vendor with an open bill on today's date, so both exports have rows."])]),
    "REL-05": dict(pre_set=[("Have open documents in these reports at two locations, so one location can be ticked", [
        "Make sure the organization has two or more locations, so one location can be ticked in Inventory Value's Location filter."])]),
    "REL-05b": dict(pre_set=[("Have open documents in these reports at two locations, so one location can be ticked", [
        "Make sure the organization has two or more locations, so one location can be ticked in Sales By Customer's Location filter."])]),
    "REL-05c": dict(pre_set=[("Have open documents in these reports at two locations, so one location can be ticked", [
        "Make sure the organization has two or more locations, so one location can be ticked in Work In Progress's Location filter."])]),
    "REL-09": dict(pre_set=[("Make sure the three A/R reports have open documents", [
        "Have a customer with an overdue invoice on today's date, so the three A/R reports have rows and A/R Collection has a customer "
        "group to expand."])]),
    "D-32": dict(pre_set=[("Make sure the report has unpaid bills on today's date.", [
        "Have a vendor with an unpaid bill on today's date, so the Vendor menu lists vendors."])]),
    "D-44": dict(pre_set=[("Make sure the report has customers with amounts in every bucket", [
        "Have a customer with open invoices on today's date in every bucket: not yet due, 1-30, 31-60, 61-90 and more than 90 days past due."])]),
    "D-45": dict(pre_set=[("Make sure the report has vendors with amounts in every bucket", [
        "Have a vendor with open bills on today's date in every bucket: not yet due, 1-30, 31-60, 61-90 and more than 90 days past due."])]),
    "D-70": dict(pre_sub=[('switch on.', 'switch on, so customer A\'s name is a link and its credit term shows.')]),
}
for _k in ("D-39", "D-40"):
    RT[_k] = dict(pre_set=[("Make sure a link to a work order made at location B", [
        "Open a link to a work order made at location B (copied from the address bar) in a second tab, so the existing location-switch "
        "prompt shows there for comparison."])])
for _k in ("S2-40", "S2-41", "S2-42"):
    RT[_k] = dict(pre_set=[("Have open documents in these reports at two locations, so the Location column shows.", [
        "Have open documents in this report on today's date at two locations, so the Location column shows."]),
                           ("Make sure the report has open documents at both locations on today's date.", [])])

HEADER = re.compile(r"^The rows sort by (.+?), largest first\.$")

def readthrough(c, out, L):
    """L = ar_lib (for reports_of). Applied after pattern.relate(); returns the corrected case."""
    import pattern as PT
    k = c["key"]; pre = list(out["pre"])
    # ENROL
    if k in ENROL_REASON: pre = [ENROL_REASON[k] if x == ENROL_LINE else x for x in pre]
    elif k not in ENROL_KEEP:
        pre = [x for x in pre if x != ENROL_LINE]
        pre = [x.replace(", and you are enrolled at all three", "").replace(", and make sure you are enrolled there too", "") for x in pre]
    # CURRENT
    if k not in CURRENT_KEEP:
        pre = [x.replace(", with location A as your current location.", ".") for x in pre]
    # ROWS
    reps = L.reports_of(c)
    if ROWS_BULLET in pre:
        if k in SORT2: new = SORT2[k]
        elif c["sec"] == "DESIGN" and k.endswith("c") and "links" in c["title"]: new = LINKS[reps[0]]
        else: new = ROWS[reps[0]]
        pre = [new if x == ROWS_BULLET else x for x in pre]
    pre = [AR_SWITCH_WHY if x == AR_SWITCH else x for x in pre]
    out = dict(out, pre=pre)
    # "The header shows it." says which header: the column the step sorted by
    res = []
    for r in out["results"]:
        r2 = []
        for i, b in enumerate(r):
            m = HEADER.match(r[i - 1]) if i else None
            r2.append(f'"{m.group(1)}" is marked as the sorted column (a small arrow beside its heading).' if b == "The header shows it." and m else b)
        res.append(r2)
    out["results"] = res
    if k in RT: out = PT.apply_layout(c, out, RT[k])
    return out
