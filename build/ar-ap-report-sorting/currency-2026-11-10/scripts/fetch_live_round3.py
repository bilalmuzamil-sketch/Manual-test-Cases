"""Read-only (get_case): the 46 cases that carry a re-shot picture, as round 2 left them in TestRail, for the round-3 edit lock. Also compares
each live text with the round-2 library (proposals-round2.json)."""
import json, sys, csv
sys.path.insert(0, "/home/user/Manual-test-Cases/build/dashboards/currency-2026-10-14/apply")
from trlib import api
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"; W = f"{B}/currency-2026-11-10"
aff = json.load(open(f"{W}/reshot-affected-cases.json")); ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{B}/testrail-id-map.csv"))}
r2 = json.load(open(f"{W}/proposals-round2.json")); out = {}; diff = []
for k in aff:
    c = api(f"get_case/{ids[k]}"); out[k] = c
    d = [x for x in ("title", "custom_preconds", "custom_steps", "custom_expected") if (c.get(x) or "") != r2[k]["fields"][x]]
    if d: diff.append((k, d))
json.dump(out, open(f"{W}/live-before/live-46-round3-2026-11-10.json", "w"), indent=1, ensure_ascii=False)
print("read", len(out), "| differ from the round-2 library:", diff or "none")
print("updated_by", sorted({c["updated_by"] for c in out.values()}), "updated_on max", max(c["updated_on"] for c in out.values()))
