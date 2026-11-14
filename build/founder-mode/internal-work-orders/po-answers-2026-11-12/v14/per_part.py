#!/usr/bin/env python3
"""Rule 134 per-part record for the v1.4 named set (14 Nov 2026): for each of the 34 touched live cases, S12-24 and the 54 drafts, each
part CHANGED or CONFIRMED, comparing authoring/proposals.json now with commit 83ba7fe37 (before the pass).
Parts: title, preconditions, steps, results (above "Exact quotes"), quotes and From lines, design references (text), pictures, marker,
refs, folder (TestRail section).   python3 per_part.py   -> per-part-v14.json"""
import json, re, subprocess, os, html, csv
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(os.path.dirname(H))
REPO = subprocess.check_output(["git", "rev-parse", "--show-toplevel"], cwd=H, text=True).strip()
BEFORE = json.loads(subprocess.check_output(["git", "show", "83ba7fe37:" + os.path.relpath(f"{P}/authoring/proposals.json", REPO)], cwd=REPO))
NOW = json.load(open(f"{P}/authoring/proposals.json"))
MAP = {r["key"]: r for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
import sys; sys.path.insert(0, f"{P}/authoring")
SETS = {"CHANGE": ["D-68", "S12-04", "S12-11", "S12-13", "S12-15", "S12-21", "S12-27", "S12-28", "S12-30", "S12-33", "S12-36", "S12-43", "S12-46", "S2-100", "S2-35", "S7-20"],
        "RE-QUOTE": ["API-22", "API-27", "S12-23", "S12-25", "S12-35", "S12-37", "S12-38", "S12-39"],
        "DESIGN REFERENCE": ["D-69", "S12-05", "S12-07", "S12-08", "S12-09", "S12-14", "S12-44", "S12-47", "S12-48", "S12P-08"],
        "CONFIRM": ["S12-24"]}
DRAFTS = sorted((k for k in NOW if k not in MAP and not NOW[k]["automation"].startswith("AUTOMATION: HOLD - a tester cannot set this up")),
                key=lambda k: (k[0] != "D", int(re.search(r"\d+$", k).group(0))))
SETS["DRAFT"] = DRAFTS
PIC = re.compile(r"[\w-]+\.png")
def parts(v):
    f = v["fields"]; e = f["custom_expected"]
    res = e.split("<p><strong>Exact quotes")[0]
    q = e.split("<p><strong>Exact quotes")[1].split("References from Design")[0] if "Exact quotes" in e else ""
    d = e.split("References from Design", 1)[1].rsplit("<p>AUTOMATION:", 1)[0] if "References from Design" in e else ""
    return {"title": f["title"], "preconditions": f["custom_preconds"], "steps": f["custom_steps"], "results": res, "quotes and From lines": q,
            "design references": PIC.sub("", d), "pictures": sorted(set(PIC.findall(d))), "marker": v["automation"], "refs": f["refs"],
            "folder": v["section_id"]}
out = {}
for s, keys in SETS.items():
    for k in keys:
        a = parts(NOW[k]); b = parts(BEFORE[k]) if k in BEFORE else None
        out[k] = {"set": s, "cid": MAP.get(k, {}).get("case_id"), "title": NOW[k]["title"], "held": NOW[k]["held"], "prd_version": NOW[k]["prd_version"],
                  "parts": {p: ("CHANGED" if b is None or a[p] != b[p] else "CONFIRMED") for p in a},
                  "pictures_added": sorted(set(a["pictures"]) - set(b["pictures"] if b else [])),
                  "pictures_removed": sorted(set(b["pictures"] if b else []) - set(a["pictures"]))}
json.dump(out, open(f"{H}/per-part-v14.json", "w"), indent=1)
from collections import Counter
for s in SETS:
    c = Counter((p, v) for k, x in out.items() if x["set"] == s for p, v in x["parts"].items())
    print(s, len(SETS[s]), {p: c[(p, "CHANGED")] for p in parts(NOW["S12-24"])})
