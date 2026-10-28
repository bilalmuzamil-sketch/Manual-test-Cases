#!/usr/bin/env python3
"""28 Oct 2026 named-set check (PRD v35). python3 verbatim_v35_check.py   (exit 1 on any failure)

1. Every PRD quote in every case on prd=35 is word for word in PRD v35 (raw page text above the Change Log, or a feedback-table row),
   checked with its own normaliser, independent of pllib's parser; every answer 13-27 quote is word for word in the saved answers file.
2. Every case on prd=35 renders its PRD From line as version 35, edited 27 Oct 2026, read 28 Oct 2026; every other case still says
   version 33 and read 27 Oct 2026.
3. Against our latest TestRail read-backs (../applied-2026-10-27/C<id>-after.json, same comparison as apply.py): the only mapped cases
   whose fields differ are cases on prd=35 (the named set); no case outside the set changes, not even its version stamp."""
import sys, os, re, json, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pllib as L, build_mods  # noqa: F401  (imports every case module)

def norm(s): return re.sub(r"\s+", " ", s.replace("\\", "").replace("**", "").replace("*", "").replace("`", "")).strip()
raw = open(L.PRD_FILES[35]).read(); body = raw.split("## 9. Change Log")[0]
RAWN = norm(body)
TABLE = norm(" ".join(" | ".join(c.strip() for c in l.strip().strip("|").split("|")) for l in body.split("\n") if l.startswith("|")))
ANS = norm(re.sub(r"<!--.*?-->", "", open(L.PO27_FILE).read(), flags=re.S))
bad = n_prd = n_po = 0
v35 = [c for c in L.CASES if c["prd"] == 35]
for c in v35:
    for doc, label, text in L.quotes(c):
        t = norm(text)
        if doc == "PRD":
            n_prd += 1
            if t not in RAWN and t not in TABLE: bad += 1; print("NOT IN v35", c["key"], label, text[:90])
        elif doc == "PO27":
            n_po += 1
            if t not in ANS: bad += 1; print("NOT IN ANSWERS 13-27", c["key"], label, text[:90])
        elif not L.DOCS[doc][1](text): bad += 1; print("NOT VERBATIM", c["key"], doc, label)
for c in L.CASES:
    ex = L.render(c)["custom_expected"]
    want = ("version 35 (edited 27 Oct 2026 by Chris Ward), read 28 Oct 2026" if c["prd"] == 35 else "version 33 (23 Oct 2026, owner Chris Ward), read 27 Oct 2026")
    if want not in ex: bad += 1; print("FROM LINE", c["key"], "does not read", want)
MAP = L.id_map(); changed, nob = [], []
def diff(a, f): return [x for x, y in f.items() if ((a.get(x) or "").replace(" ", "") != y.replace(" ", "") if x == "refs" else a.get(x) != y)]
for c in L.CASES:
    r = MAP.get(c["key"])
    if not r: continue
    fb = f"{L.P}/applied-2026-10-27/C{r['case_id']}-after.json"
    if not os.path.exists(fb): nob.append(c["key"]); continue
    if diff(json.load(open(fb)), L.render(c)): changed.append(c["key"])
outside = [k for k in changed if next(c for c in L.CASES if c["key"] == k)["prd"] != 35]
unchanged_v35 = [c["key"] for c in v35 if c["key"] in MAP and c["key"] not in changed]
new = [c["key"] for c in L.CASES if c["key"] not in MAP]
print(f"cases {len(L.CASES)} | on PRD v35 {len(v35)} | v35 PRD quotes checked {n_prd} | answer 13-27 quotes checked {n_po} | not verbatim / wrong From line {bad}")
print(f"mapped cases differing from our latest read-back {len(changed)}: {changed}")
print(f"  of them outside the named set (must be 0): {len(outside)} {outside}")
print(f"  named-set cases identical to their read-back (must be 0): {len(unchanged_v35)} {unchanged_v35}")
print(f"mapped cases with no 27 Oct read-back: {len(nob)} {nob} | new keys (ADD): {len(new)} {new}")
bad += len(outside) + len(unchanged_v35) + len(nob)
print("named-set check problems:", bad); sys.exit(1 if bad else 0)
