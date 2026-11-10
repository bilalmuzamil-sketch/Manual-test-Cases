"""Compare the library (authoring/proposals.json) with the live snapshot of 10 Nov 2026, after taking out the stamp lines
(PRD From line v9 -> v11, the build sentence, the 'no build yet' HOLD -> Rule 69 marker). Prints per case: STAMP-ONLY (equal after the
stamps), CHANGED (parts listed), NEW (not live), GONE (live, not in library). Writes stamp-diff.json. Read-only."""
import json, csv, re, sys, difflib
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"
live = {c["id"]: c for c in json.load(open(f"{B}/currency-2026-11-10/live-before/live-cases-2026-11-10.json"))["cases"]}
idm = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{B}/testrail-id-map.csv"))}
prop = json.load(open(f"{B}/authoring/proposals.json"))
OLD_FROM = 'version 9 (23 Oct 2026, Chris Ward), read 26 Oct 2026'
NEW_FROM = 'version 11 (5 Nov 2026, Chris Ward), read 10 Nov 2026'
OLD_B = "The build is not yet available to check this case against."
NEW_B = "Not yet checked against a build: the QA build v26.45.2-6a8b89c exists since 10 Nov 2026 and this case has not been run on it yet."
OLD_M = "AUTOMATION: HOLD - not yet build-verified (no build yet)"
NEW_M = "AUTOMATION: Not available on Build to test Yet - Last checked 11/10/2026"
def stamp(h): return (h or "").replace(OLD_FROM, NEW_FROM).replace(OLD_B, NEW_B).replace(OLD_M, NEW_M)
F = ["title", "custom_preconds", "custom_steps", "custom_expected", "refs"]
def parts(old, new):
    out = []
    for f in F:
        a, b = stamp(old.get(f)), new.get(f) or ""
        if a == b: continue
        if f != "custom_expected": out.append(f); continue
        ah, at = a.split("<p><strong>Exact quotes", 1) if "<p><strong>Exact quotes" in a else (a, "")
        bh, bt = b.split("<p><strong>Exact quotes", 1) if "<p><strong>Exact quotes" in b else (b, "")
        if ah != bh: out.append("results/notes")
        aq, ad = at.split("References from Design", 1) if "References from Design" in at else (at, "")
        bq, bd = bt.split("References from Design", 1) if "References from Design" in bt else (bt, "")
        if aq != bq: out.append("quotes")
        if ad != bd: out.append("design")
    return out
res = {}
for k, v in prop.items():
    cid = idm.get(k)
    if cid is None or cid not in live: res[k] = {"status": "NEW"}; continue
    p = parts(live[cid], v["fields"])
    res[k] = {"case_id": cid, "status": "CHANGED" if p else "STAMP-ONLY", "parts": p,
              "stamps": [s for s, o in (("From", OLD_FROM), ("build", OLD_B), ("marker", OLD_M)) if o in (live[cid].get("custom_expected") or "")]}
for k, cid in idm.items():
    if k not in prop: res[k] = {"case_id": cid, "status": "GONE"}
json.dump(res, open(f"{B}/currency-2026-11-10/stamp-diff.json", "w"), indent=1)
from collections import Counter
print(Counter(r["status"] for r in res.values()))
if "-v" in sys.argv:
    for k, r in res.items():
        if r["status"] != "STAMP-ONLY": print(k, r.get("case_id"), r["status"], r.get("parts"))
