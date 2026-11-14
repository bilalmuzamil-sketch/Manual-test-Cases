"""Read-only snapshot for the 14 Nov 2026 PRD v13 currency pass (get_* calls only; credentials from /tmp via trlib, never printed).
Pages through get_cases for the whole suite (not per section), so cases moved out of group 90418 are found by C-id; also reads every
section, run 557 and its tests, and folder 90418 (its description, for the Rule 140 note)."""
import json, sys, csv, datetime
sys.path.insert(0, "/home/user/Manual-test-Cases/build/dashboards/currency-2026-10-14/apply")
from trlib import api
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"; OUT = f"{B}/currency-2026-11-14/live-before"
def paged(ep, key):
    out, off = [], 0
    while True:
        r = api(f"{ep}&offset={off}&limit=250")
        items = r[key] if isinstance(r, dict) else r
        out += items
        if isinstance(r, dict) and r.get("_links", {}).get("next"): off += 250; continue
        return out
secs = paged("get_sections/1&suite_id=1", "sections")
cases = paged("get_cases/1&suite_id=1", "cases")
run = api("get_run/557")
tests = paged("get_tests/557", "tests")
f90418 = api("get_section/90418")
ours = {int(r["case_id"]) for r in csv.DictReader(open(f"{B}/testrail-id-map.csv"))}
byid = {s["id"]: s for s in secs}
def under(sid):
    while sid:
        if sid == 90418: return True
        sid = byid.get(sid, {}).get("parent_id")
    return False
keep = [c for c in cases if c["id"] in ours or under(c["section_id"]) or c["id"] in {t["case_id"] for t in tests}]
json.dump({"read": datetime.datetime.utcnow().isoformat() + "Z", "folder_90418": f90418, "run": run,
           "sections": [{"id": s["id"], "name": s["name"], "parent_id": s["parent_id"], "description": s.get("description")} for s in secs if under(s["id"]) or s["id"] in {c["section_id"] for c in keep}],
           "cases": keep, "tests": tests}, open(f"{OUT}/" + (sys.argv[1] if len(sys.argv) > 1 else "live-2026-11-14.json"), "w"), indent=1)
from collections import Counter
print("sections in suite", len(secs), "| cases in suite", len(cases), "| kept", len(keep))
print("map ids", len(ours), "found live", len(ours & {c["id"] for c in cases}), "missing", sorted(ours - {c["id"] for c in cases}))
print("run 557:", run["name"], "| tests", len(tests), "| status", Counter(t["status_id"] for t in tests), "| assignedto", Counter(t["assignedto_id"] for t in tests))
print("folder 90418 name:", f90418["name"], "| description length", len(f90418.get("description") or ""))
