"""Live (14 Nov 2026) vs our last written body (currency-2026-11-10/applied/C*-after.json) vs the library (authoring/proposals.json).
Fields compared: title, custom_preconds, custom_steps, custom_expected, refs (refs without spaces). section_id is reported, never a drift."""
import json, csv, os
from collections import Counter
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"; W = f"{B}/currency-2026-11-14"
L = json.load(open(f"{W}/live-before/live-2026-11-14.json")); live = {c["id"]: c for c in L["cases"]}
mp = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{B}/testrail-id-map.csv"))}
PROP = json.load(open(f"{B}/authoring/proposals.json"))
F = ["title", "custom_preconds", "custom_steps", "custom_expected", "refs"]
def n(f, v): v = v or ""; return v.replace(" ", "") if f == "refs" else v
out = {}; c1 = Counter()
for k, cid in sorted(mp.items()):
    if cid not in live: out[k] = {"case": cid, "status": "not live"}; continue
    lv = live[cid]; ap = f"{B}/currency-2026-11-10/applied/C{cid}-after.json"
    base = json.load(open(ap)) if os.path.exists(ap) else None
    p = PROP.get(k, {}).get("fields")
    d_base = [f for f in F if base and n(f, lv.get(f)) != n(f, base.get(f))]
    d_prop = [f for f in F if p and n(f, lv.get(f)) != n(f, p.get(f))]
    pb = [f for f in F if p and base and n(f, p.get(f)) != n(f, base.get(f))]
    st = ("no baseline" if base is None else "edited outside" if d_base else "equal to last write")
    out[k] = {"case": cid, "status": st, "live_vs_lastwrite": d_base, "live_vs_library": d_prop, "library_vs_lastwrite": pb,
              "section_live": lv["section_id"], "section_lastwrite": base and base["section_id"], "updated_by": lv["updated_by"],
              "updated_on": lv["updated_on"], "lastwrite_updated_on": base and base["updated_on"]}
    c1[st] += 1
json.dump(out, open(f"{W}/live-before/drift-2026-11-14.json", "w"), indent=1)
print(c1)
print("library != last write (non-demo):", Counter("+".join(v["library_vs_lastwrite"]) for v in out.values() if v.get("library_vs_lastwrite")))
for k, v in out.items():
    if v["status"] == "edited outside": print(" EDITED", k, "C%d" % v["case"], v["live_vs_lastwrite"], "by", v["updated_by"])
for k, v in out.items():
    if v["status"] == "no baseline": print(" NOBASE", k, v["case"], "live_vs_library", v["live_vs_library"])
for k, v in out.items():
    if v.get("library_vs_lastwrite") and v["status"] != "no baseline": print(" LIBDIFF", k, v["library_vs_lastwrite"])
