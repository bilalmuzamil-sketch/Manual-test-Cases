import sys, json
sys.path.insert(0, "/home/user/Manual-test-Cases/build/dashboards/currency-2026-10-14/apply")
import trlib as T
RUNS = {"splitting-sales-reps": [547], "technician-toggle": [555], "ar-ap-report-sorting": [557], "founder-mode/what-why": [553],
        "founder-mode/part-lifecycle": [556], "founder-mode/bill-to": [558], "founder-mode/internal-work-orders": [559],
        "tiered-pricing": [560], "credit-terms": [551]}
out = {}
for s, rs in RUNS.items():
    for r in rs:
        try: run = T.api(f"get_run/{r}")
        except SystemExit as e: print(s, r, 'NOT A VALID RUN', e); out[s]={'run':r,'name':None,'is_completed':None,'case_ids':[]}; continue
        ids, off = [], 0
        while True:
            d = T.api(f"get_tests/{r}&limit=250&offset={off}")
            t = d.get("tests", d) if isinstance(d, dict) else d
            ids += [x["case_id"] for x in t]
            if not isinstance(d, dict) or not d.get("_links", {}).get("next"): break
            off += 250
        out[s] = {"run": r, "name": run["name"], "is_completed": run["is_completed"], "case_ids": sorted(set(ids))}
        print(s, r, run["name"][:60], "completed" if run["is_completed"] else "open", len(ids))
json.dump(out, open("runs.json", "w"))
