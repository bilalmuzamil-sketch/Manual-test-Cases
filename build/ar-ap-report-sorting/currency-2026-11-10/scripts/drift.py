"""Compare the live TestRail bodies (live-before snapshot) with the library (authoring/proposals.json + testrail-id-map.csv)."""
import json, csv, difflib, re, sys
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"
live = {c["id"]: c for c in json.load(open(f"{B}/currency-2026-11-10/live-before/live-cases-2026-11-10.json"))["cases"]}
prop = json.load(open(f"{B}/authoring/proposals.json"))
idmap = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{B}/testrail-id-map.csv"))}
FIELDS = ["title", "custom_preconds", "custom_steps", "custom_expected", "refs", "section_id", "type_id", "priority_id", "custom_automation_type"]
out = []; nm = 0
print("map rows", len(idmap), "proposals", len(prop), "live", len(live))
print("keys in map not in proposals", sorted(set(idmap) - set(prop)))
print("keys in proposals not in map", sorted(set(prop) - set(idmap)))
inv = {v: k for k, v in idmap.items()}
print("live ids not in map", sorted(set(live) - set(inv)))
print("map ids not live", sorted(k for k, v in idmap.items() if v not in live))
for k, p in prop.items():
    cid = idmap.get(k)
    if cid not in live: continue
    L = live[cid]; f = p["fields"]; f = dict(f, section_id=p.get("section_id"))
    diffs = {}
    for fld in FIELDS:
        a = f.get(fld); b = L.get(fld)
        if fld == "section_id" and a is None: continue
        if (a or "") != (b or ""):
            diffs[fld] = list(difflib.unified_diff((str(a) or "").replace("</li>", "</li>\n").replace("</p>", "</p>\n").splitlines(),
                                                   (str(b) or "").replace("</li>", "</li>\n").replace("</p>", "</p>\n").splitlines(), "library", "live", n=0, lineterm=""))
    if diffs:
        nm += 1
        out.append({"key": k, "case_id": cid, "fields": list(diffs), "updated_on": L["updated_on"], "updated_by": L["updated_by"], "diff": diffs})
json.dump(out, open(f"{B}/currency-2026-11-10/drift-live-vs-library.json", "w"), indent=1)
print("cases differing", nm)
for o in out:
    print(o["key"], o["case_id"], o["fields"], o["updated_on"])
