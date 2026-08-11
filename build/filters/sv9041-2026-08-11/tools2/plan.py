#!/usr/bin/env python3
"""SV-9041 write plan -- REBUILT (not replayed) against LIVE v19 + read-date text.

Scope re-derived this pass: TWO cases, C29601 and C43562.
Dry-run only: writes /tmp/sv9041_plan.json and asserts every anchor against live.
"""
import json, os, sys

SNAP = "/home/user/Manual-test-Cases/build/filters/resync-2026-08-11/snapshots/cases-LIVE-OURS.json"
live = {c["id"]: c for c in json.load(open(SNAP))}

SV = "https://shopview.atlassian.net/browse/SV-9041"

# ---------------------------------------------------------------- C29601
c1 = live[29601]
C1_ITEM_OLD = "3. The filter icon shows a pressed/active look while the bar is collapsed.\n\n---\n"
C1_ITEM_NEW = (
    "3. The filter icon shows a pressed/active look while the bar is collapsed.\n"
    "4. The filter icon is shown on this page because the Work Orders page has more than one filter. "
    "This button is only shown on a page that has more than one filter; on a page that has only one "
    "filter the button is not shown at all and that page's filter bar is always on display.\n"
    "\n"
    "Note for the tester: if you are ever on a page that has only one filter and you cannot find this "
    "button, that is correct and is not a fault - do not raise it. On the Work Orders page, which has "
    "five filters, the button should always be there.\n"
    "\n---\n")

C1_PROV_OLD = ("and the Filters specification at Confluence version 19 (published 6 August 2026) "
               "(S1-R4, S1-R5), read on 11 August 2026.")
C1_PROV_NEW = ("the Filters specification at Confluence version 19 (published 6 August 2026) "
               "(S1-R4, S1-R5), read on 11 August 2026, and ticket SV-9041 "
               "(https://shopview.atlassian.net/browse/SV-9041), read on 11 August 2026, which sets "
               "the condition for when this button is shown.")

# ---------------------------------------------------------------- C43562
c2 = live[43562]
C2_STEP_OLD = "2. Find the control that collapses the filter bar and use it. Then expand it again."
C2_STEP_NEW = ("2. Count the filter buttons on the page. If there is more than one, find the control that "
               "collapses the filter bar and use it, then expand it again. If there is only one filter button, "
               "check instead that there is no collapse control at all and the filter bar stays on display.")

C2_EXP_OLD_1 = ("1. The filter bar on the Parts page and on the report can be collapsed and expanded, and the "
                "table takes the freed space when it is collapsed - exactly as on the Work Orders page.")
C2_EXP_NEW_1 = ("1. On a Parts page or a report that has more than one filter, the filter bar can be collapsed "
                "and expanded, and the table takes the freed space when it is collapsed - exactly as on the Work "
                "Orders page. On a page that has only one filter there is no collapse control at all and the "
                "filter bar is always on display; that is correct and is not a fault.")

C2_EXP_OLD_2 = ("2. While the bar is collapsed the filters keep working, and the collapsed control shows that "
                "filters are active - exactly as on the Work Orders page.")
C2_EXP_NEW_2 = ("2. Where that collapse control is present: while the bar is collapsed the filters keep working, "
                "and the collapsed control shows that filters are active - exactly as on the Work Orders page.")

C2_EXP_OLD_3 = "3. Whether you left the bar collapsed or expanded is remembered when you come back to that page."
C2_EXP_NEW_3 = ("3. Where that collapse control is present, whether you left the bar collapsed or expanded is "
                "remembered when you come back to that page.")

C2_NOTE_OLD = ("Note for the tester: only some Parts views and only some reports have the new filter bar so far. "
               "If the page you open has no filter bar, mark this test BLOCKED - do not mark it failed.")
C2_NOTE_NEW = ("Note for the tester: only some Parts views and only some reports have the new filter bar so far. "
               "If the page you open has no filter bar, mark this test BLOCKED - do not mark it failed. A page "
               "that has a filter bar with only one filter button and no collapse control is a PASS for that "
               "page, not a failure.")

C2_PROV_OLD = ("He said that collapsing, the shareable web address and the phone layout all match the Work "
               "Orders page. The Filters specification at Confluence version 19 has no numbered requirement "
               "for this, so there is no requirement number to quote.")
C2_PROV_NEW = ("He said that collapsing, the shareable web address and the phone layout all match the Work "
               "Orders page. The Filters specification at Confluence version 19 has no numbered requirement "
               "for this, so there is no requirement number to quote. It also follows ticket SV-9041 "
               "(https://shopview.atlassian.net/browse/SV-9041), read on 11 August 2026, which says the "
               "collapse control is only shown on a page that has more than one filter. Branko's answer of "
               "31 July 2026 says collapsing on Parts and Reports matches the Work Orders page and does not "
               "mention any condition on the number of filters; ticket SV-9041, raised on 7 August 2026, is "
               "the newer statement, so this test follows it and expects no collapse control on a page that "
               "has only one filter.")

def sub(text, old, new, label):
    if old not in text:
        raise SystemExit(f"ANCHOR MISS [{label}]:\n{old[:200]}")
    if text.count(old) != 1:
        raise SystemExit(f"ANCHOR NOT UNIQUE [{label}]: {text.count(old)} occurrences")
    return text.replace(old, new)

ops = []

# C29601 -- expected only; preconds/steps/refs unchanged but SENT (TestRail re-renders omitted fields)
e = c1["custom_expected"]
e = sub(e, C1_ITEM_OLD, C1_ITEM_NEW, "C29601 item4")
e = sub(e, C1_PROV_OLD, C1_PROV_NEW, "C29601 prov")
C1_REFS_NEW = ("SV-8786; SV-9041 (S1-R4; S1-R5; SV-9041 - toggle shown only when the page has "
               "more than one filter) [spec v19 2026-08-06]")
ops.append({"case_id": 29601, "internal": "FLT-COLL-01",
            "payload": {"custom_preconds": c1["custom_preconds"],
                        "custom_steps": c1["custom_steps"],
                        "custom_expected": e,
                        "refs": C1_REFS_NEW},
            "fields_changed": ["custom_expected", "refs"]})

# C43562 -- steps + expected
s = sub(c2["custom_steps"], C2_STEP_OLD, C2_STEP_NEW, "C43562 step2")
e = c2["custom_expected"]
e = sub(e, C2_EXP_OLD_1, C2_EXP_NEW_1, "C43562 exp1")
e = sub(e, C2_EXP_OLD_2, C2_EXP_NEW_2, "C43562 exp2")
e = sub(e, C2_EXP_OLD_3, C2_EXP_NEW_3, "C43562 exp3")
e = sub(e, C2_NOTE_OLD, C2_NOTE_NEW, "C43562 note")
e = sub(e, C2_PROV_OLD, C2_PROV_NEW, "C43562 prov")
C2_REFS_NEW = ("SV-8785 [epic]; SV-9041 (Branko 2026-07-31 R3 Q5=A - collapse; URL and mobile match "
               "Work Orders; SV-9041 - collapse control only where a page has >1 filter; spec v19 "
               "\u00a74 Key Decisions - context-specific filter sets) [spec v19 2026-08-06]")
ops.append({"case_id": 43562, "internal": "FLT-PR-PAR-01",
            "payload": {"custom_preconds": c2["custom_preconds"],
                        "custom_steps": s,
                        "custom_expected": e,
                        "refs": C2_REFS_NEW},
            "fields_changed": ["custom_steps", "custom_expected", "refs"]})

# Rule-54 sentence 2 preservation check + marker check
for o in ops:
    L = live[o["case_id"]]
    new_e = o["payload"]["custom_expected"]; old_e = L["custom_expected"]
    for probe, name in [("Last checked against build", "sentence 2"),
                        ("This test has not yet been checked against any build", "sentence 2 (never-checked form)")]:
        if probe in old_e and old_e.count(probe) != new_e.count(probe):
            raise SystemExit(f"C{o['case_id']}: Rule-54 {name} count changed")
    om = [l for l in old_e.split("\n") if l.startswith("AUTOMATION:")]
    nm = [l for l in new_e.split("\n") if l.startswith("AUTOMATION:")]
    if om != nm:
        raise SystemExit(f"C{o['case_id']}: automation marker changed {om} -> {nm}")
    if not new_e.rstrip().endswith(nm[0]):
        raise SystemExit(f"C{o['case_id']}: marker is not last")
    for tag in ("<p>", "<li>", "<ol>", "\r\n"):
        if tag in new_e or tag in o["payload"]["custom_steps"]:
            raise SystemExit(f"C{o['case_id']}: markup/CRLF {tag!r} in payload")

for o in ops:
    r = o["payload"].get("refs")
    if r is not None:
        for part in r.split(","):
            if len(part.strip()) > 248:
                raise SystemExit(f"C{o['case_id']}: refs entry {len(part.strip())} chars > 248")
        if ",".join(p2.strip() for p2 in r.split(",")) != r:
            raise SystemExit(f"C{o['case_id']}: refs not normalisation-stable")
        print(f"  refs C{o['case_id']}: len={len(r)} commas={r.count(',')} OK")

json.dump(ops, open("/tmp/sv9041_plan.json", "w"), indent=1)
print(f"PLAN OK -- {len(ops)} ops, all anchors matched and unique")
for o in ops:
    print(f"  C{o['case_id']}  changes {o['fields_changed']}  (refs NOT written)")
