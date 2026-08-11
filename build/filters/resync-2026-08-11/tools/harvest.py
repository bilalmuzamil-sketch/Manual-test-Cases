#!/usr/bin/env python3
"""Harvest ALL cases under the Filters group (4110) from live TestRail."""
import json, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tr

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "snapshots")

# 1. sections
secs = tr.getall("get_sections/1", "sections")
print(f"sections total: {len(secs)}")
# find group 4110 subtree
by_id = {s["id"]: s for s in secs}
def in_subtree(sid, root=4110):
    seen = set()
    cur = sid
    while cur is not None and cur not in seen:
        if cur == root: return True
        seen.add(cur)
        s = by_id.get(cur)
        if not s: return False
        cur = s.get("parent_id")
    return False
filt_secs = [s for s in secs if in_subtree(s["id"])]
print(f"filters sections (incl root): {len(filt_secs)}")
json.dump(filt_secs, open(f"{OUT}/sections-4110-LIVE.json","w"), indent=1)

# 2. all cases in suite 1, filter to those sections
cases = tr.getall("get_cases/1&suite_id=1", "cases")
print(f"suite cases total: {len(cases)}")
ids = {s["id"] for s in filt_secs}
fc = [c for c in cases if c.get("section_id") in ids]
print(f"filters cases live TOTAL: {len(fc)}")
ours = [c for c in fc if c.get("created_by") == 3]
foreign = [c for c in fc if c.get("created_by") != 3]
print(f"  ours (created_by=3): {len(ours)}")
print(f"  foreign: {len(foreign)} -> {[(c['id'], c.get('created_by')) for c in foreign]}")
json.dump(fc, open(f"{OUT}/cases-LIVE-ALL.json","w"), indent=1)
json.dump(ours, open(f"{OUT}/cases-LIVE-OURS.json","w"), indent=1)
json.dump(foreign, open(f"{OUT}/cases-LIVE-FOREIGN.json","w"), indent=1)
