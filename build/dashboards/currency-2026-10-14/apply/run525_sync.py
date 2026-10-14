#!/usr/bin/env python3
"""Union-only sync of run 525 "Dashboards" (Rules 34/123), copied from the WO Board run498_sync.py: read every test (paged), add the 17
new cases, update_run with include_all false and the FULL union, read back, prove nothing dropped and no existing test id or status
changed. Writes applied/run525-sync-2026-10-14.json and applied/run525-test-links-2026-10-14.json (test link for every touched case).
Run without --apply for a dry run."""
import json, sys
H = "build/dashboards/currency-2026-10-14/apply"
sys.path.insert(0, H); from trlib import api, LAST
RUN = 525
def tests(run):
    out, off = [], 0
    while True:
        d = api(f"get_tests/{run}&limit=250&offset={off}"); page = d["tests"] if isinstance(d, dict) else d; out += page
        if isinstance(d, dict) and d.get("_links", {}).get("next"): off += 250
        else: return out
run = api(f"get_run/{RUN}")
before = tests(RUN)
b_ids = sorted({t["case_id"] for t in before}); b_status = {t["case_id"]: (t["id"], t["status_id"]) for t in before}
new = sorted(json.load(open(f"{H}/applied/new-case-ids.json")).values())
EDITED = [88632, 351723, 351734, 88606, 88647, 351729, 88645, 351716]
rec = {"run": RUN, "name": run["name"], "suite_id": run["suite_id"], "include_all": run["include_all"], "is_completed": run["is_completed"],
       "before_count": len(b_ids), "new": new, "already_in": [c for c in new if c in b_ids], "edited_cases_in_run": {c: c in b_ids for c in EDITED}}
if run["is_completed"] or run["include_all"]:
    rec["refused"] = "run completed or include_all"; print(rec); json.dump(rec, open(f"{H}/applied/run525-sync-2026-10-14.json", "w"), indent=1); sys.exit(1)
union = sorted(set(b_ids) | set(new))
if "--apply" in sys.argv and union != b_ids:
    api(f"update_run/{RUN}", {"include_all": False, "case_ids": union}); rec["update_http"] = LAST["status"]
after = tests(RUN); a_ids = sorted({t["case_id"] for t in after}); a_status = {t["case_id"]: (t["id"], t["status_id"]) for t in after}
rec.update(after_count=len(a_ids), dropped=[c for c in b_ids if c not in a_ids], added=[c for c in a_ids if c not in b_ids],
           test_or_status_changed=[c for c in b_ids if c in a_status and a_status[c] != b_status[c]], union_ok=a_ids == union,
           status_counts_before={s: sum(1 for t in before if t["status_id"] == s) for s in sorted({t["status_id"] for t in before})},
           status_counts_after={s: sum(1 for t in after if t["status_id"] == s) for s in sorted({t["status_id"] for t in after})})
rec["before_case_ids"] = b_ids; rec["after_case_ids"] = a_ids
json.dump(rec, open(f"{H}/applied/run525-sync-2026-10-14.json", "w"), indent=1)
links = {f"C{c}": {"test_id": a_status[c][0], "status_id": a_status[c][1], "link": f"https://shopview.testrail.io/index.php?/tests/view/{a_status[c][0]}"}
         for c in EDITED + new if c in a_status}
json.dump(links, open(f"{H}/applied/run525-test-links-2026-10-14.json", "w"), indent=1)
print({k: v for k, v in rec.items() if not k.endswith("case_ids")})
