#!/usr/bin/env python3
"""Union-only add of the new case to run 525 "Dashboards" (Rules 34/123), 16 Oct 2026; read back; prove nothing dropped and no
existing test id or status changed; write the test link for every touched case. --apply to write."""
import json, sys, os
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, f"{D}/../currency-2026-10-14/apply"); from trlib import api, LAST
RUN = 525; NEW = [json.load(open(f"{D}/applied/new-case-id.json"))["new_case"]]; EDITED = [351714, 88604, 88636]
def tests():
    out, off = [], 0
    while True:
        d = api(f"get_tests/{RUN}&limit=250&offset={off}"); out += d["tests"] if isinstance(d, dict) else d
        if isinstance(d, dict) and d.get("_links", {}).get("next"): off += 250
        else: return out
run = api(f"get_run/{RUN}"); before = tests()
b_ids = sorted({t["case_id"] for t in before}); b_st = {t["case_id"]: (t["id"], t["status_id"]) for t in before}
rec = {"run": RUN, "name": run["name"], "include_all": run["include_all"], "is_completed": run["is_completed"], "before": len(b_ids),
       "edited_in_run": {c: c in b_ids for c in EDITED}}
if run["is_completed"] or run["include_all"]: print("REFUSED", rec); sys.exit(1)
union = sorted(set(b_ids) | set(NEW))
if "--apply" in sys.argv and union != b_ids: api(f"update_run/{RUN}", {"include_all": False, "case_ids": union}); rec["http"] = LAST["status"]
after = tests(); a_ids = sorted({t["case_id"] for t in after}); a_st = {t["case_id"]: (t["id"], t["status_id"]) for t in after}
rec.update(after=len(a_ids), dropped=[c for c in b_ids if c not in a_ids], added=[c for c in a_ids if c not in b_ids],
           changed=[c for c in b_ids if c in a_st and a_st[c] != b_st[c]], union_ok=a_ids == union)
links = {f"C{c}": {"test_id": a_st[c][0], "status_id": a_st[c][1], "link": f"https://shopview.testrail.io/index.php?/tests/view/{a_st[c][0]}"}
         for c in EDITED + NEW if c in a_st}
json.dump({"sync": rec, "links": links}, open(f"{D}/applied/run525-2026-10-16.json", "w"), indent=1)
print(rec); print(json.dumps(links, indent=1))
