"""The population: every ticket WE created in the Filters (SV-8785) and Schedule
(SV-8685) trees. Established THREE independent ways and reconciled, because
`build/ticket-source-blocks-2026-08-06/TICKET-LIST.md` said 66 when the truth was 87.

  (1) OUR COMMITTED RECORDS  -- build/ticket-type-audit-2026-08-06/type-audit.json,
      whose own population came from the per-pass FILED.md files.
  (2) THE LIVE EPIC TREE     -- every child of each epic and every child of those,
      filtered to creator = us. MISSES a ticket whose parent was removed.
  (3) A LIVE AUTHOR SWEEP    -- every SV issue our shared account created since
      2026-08-01, filtered to the two projects. Catches anything filed after (1)
      was written, and catches parentless tickets that (2) cannot see.

The account is SHARED with the QA lead (Standing Rule 53's corollary), so (3) alone
would over-collect; it is used to find candidates, and each candidate is confirmed
against our records or its own content before being called ours.
"""
import json, os, sys, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = "/home/user/Manual-test-Cases"
sys.path.insert(0, f"{ROOT}/build/ticket-source-blocks-2026-08-06/tools")
sys.path.insert(0, HERE)
import jiralib
from enumerate import jql, flat, FIELDS

OUT = f"{ROOT}/build/ticket-reformat-2026-08-06/filters-schedule/snapshots"

AUDIT = json.load(open(f"{ROOT}/build/ticket-type-audit-2026-08-06/type-audit.json"))
TREE = json.load(open(f"{OUT}/live-tree.json"))

# (1) our records, restricted to the two projects
FROM_RECORDS = {k: v["project"] for k, v in AUDIT["tickets"].items()
                if v.get("project") in ("Filters", "Schedule")}

# (2) the live tree, creator = us
FROM_TREE = {k: v["project"] for k, v in TREE["issues"].items()
             if v.get("creator") == "Bilal Muzamil"
             and v["issuetype"] in ("Story Defect", "Bug", "Story Defect - Archive")}

if __name__ == "__main__":
    # (3) live author sweep
    sweep, _ = jql("project = SV AND creator = currentUser() AND created >= 2026-08-01 "
                   "ORDER BY key ASC")
    swept = {}
    for iss in sweep:
        r = flat(iss)
        swept[r["key"]] = r
    json.dump(swept, open(f"{OUT}/author-sweep.json", "w"), indent=1, sort_keys=True)

    rs = set(FROM_RECORDS)
    tr = set(FROM_TREE)
    sw = set(swept)

    print(f"(1) our records, Filters+Schedule : {len(rs)}")
    print(f"(2) live tree, creator = us       : {len(tr)}")
    print(f"(3) live author sweep, all of SV  : {len(sw)}")
    print()
    print("in records but NOT in tree :", sorted(rs - tr))
    print("in tree but NOT in records :", sorted(tr - rs))
    print("in sweep but in NEITHER    :", sorted(sw - rs - tr))
    print()
    union = sorted(rs | tr, key=lambda k: int(k.split("-")[1]))
    print("UNION (the population):", len(union))
    print(union)
