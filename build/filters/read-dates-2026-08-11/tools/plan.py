#!/usr/bin/env python3
"""Build the write plan — READ-ONLY, no TestRail call at all.

For each of our 114 cases: split `custom_expected` into (everything before the
provenance block) + (the provenance block), stamp read-dates into the block, and
record the exact intended new field value. The plan is what write.py sends and
what final_verify.py checks against, so the intended bytes are fixed BEFORE any
write happens.
"""
import difflib
import json
import os
import sys

import stamp

HERE = os.path.dirname(os.path.abspath(__file__))
SNAP = os.path.join(HERE, "..", "snapshots")
PROV = "This is the expected behaviour as per"

if __name__ == "__main__":
    d = json.load(open(f"{SNAP}/cases-PRE.json"))
    ours = {k: v for k, v in d.items() if v.get("created_by") == 3}
    plan, unchanged = {}, []
    for cid in sorted(ours, key=int):
        exp = ours[cid]["custom_expected"] or ""
        i = exp.find(PROV)
        assert i >= 0, f"C{cid} has no provenance line"
        body, block = exp[:i], exp[i:]
        new, ops = stamp.stamp(block)
        plan[cid] = {"body": body, "old_block": block, "new_block": new, "ops": ops,
                     "atmstatus_pre": ours[cid].get("custom_atmstatus"),
                     "title": ours[cid]["title"]}
        if not ops:
            unchanged.append(cid)
    json.dump(plan, open("/tmp/filters_stamp_plan.json", "w"), indent=1)

    print(f"cases planned: {len(plan)}   to be written: {len(plan) - len(unchanged)}   "
          f"already complete (no op): {len(unchanged)} {unchanged}")
    tally = {}
    for p in plan.values():
        for o in p["ops"]:
            tally[o] = tally.get(o, 0) + 1
    print("\ninsertions by source:")
    for k in sorted(tally, key=lambda x: -tally[x]):
        print(f"   {k:<14} {tally[k]}")
    per = {}
    for p in plan.values():
        per[len(p["ops"])] = per.get(len(p["ops"]), 0) + 1
    print("\ninsertions per case:", dict(sorted(per.items())))

    # sentence 2 must be untouched on every case
    bad = [c for c, p in plan.items()
           if p["old_block"].split(stamp.S2, 1)[1:] != p["new_block"].split(stamp.S2, 1)[1:]]
    print("sentence-2 altered on:", bad)
    # the AUTOMATION marker must be untouched
    def marker(t):
        return [l for l in t.split("\n") if l.strip().startswith("AUTOMATION:")]
    bad2 = [c for c, p in plan.items() if marker(p["old_block"]) != marker(p["new_block"])]
    print("AUTOMATION marker altered on:", bad2)

    if "-v" in sys.argv:
        n = int(sys.argv[sys.argv.index("-v") + 1]) if len(sys.argv) > sys.argv.index("-v") + 1 else 6
        for cid in list(plan)[:n]:
            p = plan[cid]
            print("=" * 96)
            print(f"C{cid} {p['title'][:70]}   ops={p['ops']}")
            for line in difflib.unified_diff(p["old_block"].split("\n"),
                                             p["new_block"].split("\n"),
                                             lineterm="", n=0):
                if line[:3] not in ("---", "+++"):
                    print("  ", line[:300])
