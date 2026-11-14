"""Classify every outside edit (live 14 Nov vs our last write 10 Nov) into kinds, by field. Writes live-before/outside-edits-2026-11-14.json."""
import json, csv, re, difflib
from collections import Counter, defaultdict
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"; W = f"{B}/currency-2026-11-14"
L = json.load(open(f"{W}/live-before/live-2026-11-14.json")); live = {c["id"]: c for c in L["cases"]}
mp = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{B}/testrail-id-map.csv"))}
sp = lambda s: [x for x in re.sub(r"(</p>|</li>|<ul>|</ul>|<ol>|</ol>)", r"\1\n", s or "").split("\n") if x != ""]
def kinds(f, a, b):
    rem, add = [], []
    for l in difflib.unified_diff(sp(a), sp(b), lineterm="", n=0):
        if l.startswith("---") or l.startswith("+++") or l.startswith("@@"): continue
        (rem if l[0] == "-" else add).append(l[1:])
    k = set(); other_r, other_a = [], []
    for x in rem:
        if x.startswith("<p>Not yet checked against a build"): k.add("build line")
        elif x.startswith("<p>AUTOMATION:"): k.add("marker")
        else: other_r.append(x)
    insetup = False
    for x in add:
        if x.startswith("<p>Last checked against build") or x.startswith("<p>Not yet checked") : k.add("build line")
        elif x.startswith("<p>AUTOMATION:"): k.add("marker")
        elif x.startswith("<p><strong>Setup</strong>") or (f == "custom_preconds" and (x.startswith("<li>") or x in ("<ol>", "</ol>")) and "Setup" in b and b.index("<strong>Setup</strong>") < b.index(x)):
            k.add("setup block")
        else: other_a.append(x)
    if other_r or other_a: k.add("other")
    return sorted(k), other_r, other_a
res = {}; cnt = Counter(); mk = Counter(); bl = Counter(); titles = []
for key, cid in sorted(mp.items()):
    base_p = f"{B}/currency-2026-11-10/applied/C{cid}-after.json"
    try: base = json.load(open(base_p))
    except FileNotFoundError: continue
    lv = live.get(cid)
    if not lv: continue
    r = {}
    for f in ["title", "custom_preconds", "custom_steps", "custom_expected", "refs"]:
        a, b = base.get(f) or "", lv.get(f) or ""
        if f == "refs": a, b = a.replace(" ", ""), b.replace(" ", "")
        if a == b: continue
        if f in ("title", "refs"): r[f] = {"kinds": ["other"], "before": a, "after": b}; continue
        k, orr, oa = kinds(f, a, b)
        r[f] = {"kinds": k, "other_removed": orr, "other_added": oa}
    res[key] = {"case": cid, "fields": r, "marker_live": (re.findall(r"<p>(AUTOMATION:[^<]*)</p>", lv.get("custom_expected") or "") or [None])[-1],
                "build_line_live": (re.findall(r"<p>((?:Last checked|Not yet checked)[^<]*)</p>", lv.get("custom_expected") or "") or [None])[-1],
                "section_live": lv["section_id"]}
    sig = "; ".join(f"{f}:{'+'.join(v['kinds'])}" for f, v in sorted(r.items()))
    cnt[sig] += 1; mk[res[key]["marker_live"]] += 1; bl[res[key]["build_line_live"]] += 1
json.dump(res, open(f"{W}/live-before/outside-edits-2026-11-14.json", "w"), indent=1, ensure_ascii=False)
for s, n in cnt.most_common(): print(n, s)
print("markers live:", mk.most_common()); print("build lines live:", bl.most_common())
