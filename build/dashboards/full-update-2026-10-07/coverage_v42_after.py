#!/usr/bin/env python3
"""Requirement-by-requirement check of the 61 OUR Dashboard cases against PRD v42, AFTER the full update (reads live-after/, fetched by fetch_after.py)."""
import json, glob, re, html, collections
SRC = "../sources/CONFLUENCE-788430850-Dashboard-v1-2026-10-07-v42.md"
def norm(s): 
    s = html.unescape(s).replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"').replace(" ", " ")
    s = s.replace("**", "").replace("*", "")
    return re.sub(r"\s+", " ", s).strip()
A = {}
for line in open(SRC):
    m = re.match(r"^\s*-\s*\*\*(S\d+-[RNE]\d+[a-z]?)(?:\s*\(([^)]*)\))?:\*\*\s*(.*)$", line.strip())
    if m: A[m.group(1)] = norm(m.group(3))
cases = [json.load(open(f)) for f in glob.glob("live-after/*.json")]
ours = [c for c in cases if c["created_by"] == 3]
cites = collections.defaultdict(list); stale = []; unknown = []
for c in ours:
    e = c.get("custom_expected") or ""
    for a, q in re.findall(r"<li><strong>(S\d+-[RNE]\d+[a-z]?)[^<]*:</strong>\s*&ldquo;(.*?)&rdquo;", e, re.S):
        cites[a].append(c["id"]); qn = norm(re.sub(r"<[^>]+>", "", q))
        if a not in A: unknown.append((c["id"], a))
        elif qn != A[a] and qn not in A[a]: stale.append((c["id"], a, qn[:160], A[a][:160]))
out = {"anchors_v42": len(A), "cited": len([a for a in A if a in cites]),
       "uncovered": [a for a in A if a not in cites], "stale_quotes": stale, "cited_but_not_in_v42": unknown}
json.dump(out, open("coverage-v42-after.json", "w"), indent=1)
print("anchors", len(A), "cited", out["cited"], "uncovered", len(out["uncovered"]), "stale quotes", len(stale), "withdrawn-cited", len(unknown))
print("UNCOVERED:", out["uncovered"]); print("WITHDRAWN:", unknown)
for s in stale: print("STALE C%s %s\n   case: %s\n   v42 : %s" % s)
