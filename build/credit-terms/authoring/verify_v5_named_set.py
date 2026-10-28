#!/usr/bin/env python3
"""28 Oct 2026, PRD v5 named set (QA lead: "Named set", Rule 122 amendment). Proves, from proposals.json (run build.py first):
 1. every PRD quote in a case of the named set or a new case is word for word in PRD v5 (the Change Log cut off), and its From line
    says version 5, read 28 Oct 2026;
 2. every mapped case outside the named set renders exactly like its latest read-back in applied/C<id>-after.json (every field the
    update script writes, compared the way update_changed.py compares them), so the v3 text and "version 3" stay as live.
python3 verify_v5_named_set.py   (exit 1 on any failure)"""
import json, csv, os, re, html, sys
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
sys.path.insert(0, D)
import ct_lib as L
PROP = json.load(open(f"{D}/proposals.json"))
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
def diff(prev, f):
    return [x for x, y in f.items() if (((prev.get(x) or "").replace(" ", "") != y.replace(" ", "")) if x == "refs" else prev.get(x) != y)]
bad = []
# ---- 1. touched cases: quotes verbatim in v5
touched = sorted(k for k in PROP if k in L.NAMED_SET or k not in ids)
nq = 0
for k in touched:
    h = PROP[k]["fields"]["custom_expected"]
    q = h.split("Exact quotes from the source")[1].split("References from Design")[0]
    froms = re.findall(r"<p>From: (.*?)</p>", q)
    if not froms or "version 5 (26 Oct 2026" not in froms[0] or "read 28 Oct 2026" not in froms[0] or "version 3" in q:
        bad.append(f"{k}: From line does not say version 5, read 28 Oct 2026")
    for lab, txt in re.findall(r"<li><strong>(.*?):</strong> &ldquo;(.*?)&rdquo;</li>", q, re.S):
        t = L.ws(html.unescape(txt)); nq += 1
        if lab.startswith("Jira SV-"): ok = t in L.JIRAW
        else: ok = t in L.PRD5W or t in L.PRD5_RAWW
        if not ok: bad.append(f"{k}: quote {html.unescape(lab)} is not word for word in PRD v5")
print(f"1. touched cases {len(touched)} ({', '.join(touched)}): {nq} quotes checked against PRD v5")
# ---- 2. every mapped case outside the set: identical to its read-back
same = 0
for k, cid in sorted(ids.items()):
    if k in L.NAMED_SET: continue
    if k not in PROP: bad.append(f"{k} C{cid}: mapped but not in proposals.json"); continue
    prev = json.load(open(f"{P}/applied/C{cid}-after.json"))
    d = diff(prev, PROP[k]["fields"])
    if d: bad.append(f"{k} C{cid}: differs from its read-back in {d}")
    else: same += 1
print(f"2. mapped cases outside the set: {same} of {len(ids) - len(L.NAMED_SET & set(ids))} identical to applied/C<id>-after.json")
print(f"   named set in the map: {sorted(L.NAMED_SET & set(ids))}; new keys (no C-id): {sorted(k for k in PROP if k not in ids)}")
for b in bad: print("FAIL", b)
print("failures:", len(bad))
sys.exit(1 if bad else 0)
