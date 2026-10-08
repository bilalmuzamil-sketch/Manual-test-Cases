#!/usr/bin/env python3
"""Read-only. Snapshot every live case in WO Board & Tech View (group 13204 sub-sections + tech-plan folder 20449),
build the anchor map from the 2026-10-08 PRD capture, and report per case: anchors cited, stale quotes, ownership."""
import sys, json, re, html, glob, collections
sys.path.insert(0, "build/maintenance-reminder-v2")
from mr_lib import api
H = "build/wo-board-tech-view/source-update-2026-10-08"
PRD = open("build/wo-board-tech-view/sources/CONFLUENCE-845185030-WO-BoardView-TechView-PRD-v33-edited-2026-10-07.md").read()
def norm(s):
    s = html.unescape(s).replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"').replace(" ", " ")
    return re.sub(r"\s+", " ", s.replace("**", "").replace("\\", "")).strip()
A = {}
for line in PRD.splitlines():
    m = re.match(r"^\s*(?:-\s*)?\*\*(S\d+-[RNE]\d+[a-z]?):\*\*\s*(.*)$", line.strip())
    if m: A[m.group(1)] = norm(m.group(2))
old = json.load(open("build/wo-board-tech-view/anchor-quotes-v33-2026-09-28.json"))
json.dump(A, open(f"{H}/anchor-quotes-2026-10-08-final.json", "w"), indent=1, ensure_ascii=False)
new_a = [a for a in A if a not in old]; gone = [a for a in old if a not in A]
chg = [a for a in A if a in old and norm(old[a]) != A[a]]
secs = [v[0] for v in json.load(open("build/wo-board-tech-view/section-map.json")).values()] + [20449]
cases = []
for s in secs:
    off = 0
    while True:
        try: r = api(f"get_cases/1&suite_id=1&section_id={s}&limit=250&offset={off}")
        except Exception as e: print("section", s, "unreadable:", e); break
        cs = r["cases"] if isinstance(r, dict) else r
        cases += cs
        if len(cs) < 250: break
        off += 250
for c in cases: json.dump(c, open(f"{H}/snapshots-final/C{c['id']}.json", "w"), indent=1)
cites = collections.defaultdict(list); stale = []
for c in cases:
    e = c.get("custom_expected") or ""
    for a, q in re.findall(r"<strong>(S\d+-[RNE]\d+[a-z]?)[^<]*:</strong>\s*&ldquo;(.*?)&rdquo;", e, re.S):
        cites[a].append(c["id"])
        if a in A and norm(re.sub(r"<[^>]+>", "", q)) != A[a]: stale.append((c["id"], a, "subset" if norm(re.sub(r"<[^>]+>", "", q)) in A[a] else "differs"))
out = {"anchors_now": len(A), "new_anchors": new_a, "removed_anchors": gone, "changed_anchors": chg,
       "cases": len(cases), "ours": sum(c["created_by"] == 3 for c in cases), "foreign": [(c["id"], c["created_by"]) for c in cases if c["created_by"] != 3],
       "automated": [c["id"] for c in cases if c.get("custom_atmstatus") == 3],
       "uncovered": [a for a in A if a not in cites], "stale_quotes": stale,
       "per_section": {s: sum(c["section_id"] == s for c in cases) for s in secs}}
json.dump(out, open(f"{H}/check-final-2026-10-08.json", "w"), indent=1)
for k, v in out.items(): print(k, v if not isinstance(v, list) or len(v) < 40 else f"{len(v)} items")
