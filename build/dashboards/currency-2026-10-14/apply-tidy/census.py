"""Live census of group 12166 (all descendant sections, fully paged) + start-of-pass snapshot of every case (Rule 87)."""
import json, sys, os
H = "build/dashboards/currency-2026-10-14/apply-tidy"; sys.path.insert(0, H)
from trlib import api, LAST
secs, off = [], 0
while True:
    d = api(f"get_sections/1&suite_id=1&limit=250&offset={off}"); page = d["sections"] if isinstance(d, dict) else d
    secs += page
    if isinstance(d, dict) and d.get("_links", {}).get("next"): off += 250
    else: break
kids = {}
for s in secs: kids.setdefault(s.get("parent_id"), []).append(s["id"])
want, stack = [], [12166]
while stack:
    x = stack.pop(); want.append(x); stack += kids.get(x, [])
live = {}
for sec in want:
    off = 0
    while True:
        d = api(f"get_cases/1&section_id={sec}&limit=250&offset={off}"); page = d["cases"] if isinstance(d, dict) else d
        for c in page:
            if c["section_id"] == sec: live[c["id"]] = c
        if isinstance(d, dict) and d.get("_links", {}).get("next"): off += 250
        else: break
outdir = sys.argv[1]
os.makedirs(outdir, exist_ok=True)
for cid, c in live.items(): json.dump(c, open(f"{outdir}/C{cid}.json", "w"), indent=1, ensure_ascii=False)
print("sections", len(secs), "in group", len(want), "cases", len(live))
from collections import Counter
print("updated_by", Counter(c.get("updated_by") for c in live.values()), "created_by", Counter(c["created_by"] for c in live.values()))
