#!/usr/bin/env python3
"""Union-only sync of run 498 (Rules 34/123): read every test (paged), add the new case(s), update_run with include_all false
and the full union, read back, prove nothing dropped and no result lost. Writes applied/run498-sync-answers-2026-10-16.json."""
import json, urllib.request, urllib.error, base64, sys
H = "build/wo-board-tech-view/answers-2026-10-15/apply"
C = json.load(open("/tmp/testrail/creds.json")); AUTH = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
def call(ep, data=None):
    r = urllib.request.Request(f"https://shopview.testrail.io/index.php?/api/v2/{ep}", data=json.dumps(data).encode() if data is not None else None,
                               headers={"Authorization": "Basic " + AUTH, "Content-Type": "application/json"})
    resp = urllib.request.urlopen(r, timeout=120); return resp.status, json.load(resp)
def tests(run):
    out, off = [], 0
    while True:
        st, d = call(f"get_tests/{run}&limit=250&offset={off}")
        page = d["tests"] if isinstance(d, dict) else d; out += page
        if isinstance(d, dict) and d.get("_links", {}).get("next"): off += 250
        else: return out
st, run = call("get_run/498")
before = tests(498)
b_ids = sorted({t["case_id"] for t in before}); b_status = {t["case_id"]: (t["id"], t["status_id"]) for t in before}
new = sorted(json.load(open(f"{H}/applied/new-case-ids.json")).values())
rec = {"run": 498, "name": run["name"], "include_all": run["include_all"], "is_completed": run["is_completed"], "before_count": len(b_ids), "new": new,
       "already_in": [c for c in new if c in b_ids], "updated_cases_in_run": {c: c in b_ids for c in tuple(int(p['case_id']) for p in json.load(open(f'{H}/proposals-answers.json'))['updates'])}}
if run["is_completed"] or run["include_all"]: rec["refused"] = "run completed or include_all"; print(rec); json.dump(rec, open(f"{H}/applied/run498-sync-answers-2026-10-16.json", "w"), indent=1); sys.exit(1)
union = sorted(set(b_ids) | set(new))
if "--apply" in sys.argv and union != b_ids:
    st, r = call("update_run/498", {"include_all": False, "case_ids": union}); rec["update_http"] = st
after = tests(498); a_ids = sorted({t["case_id"] for t in after}); a_status = {t["case_id"]: (t["id"], t["status_id"]) for t in after}
rec.update(after_count=len(a_ids), dropped=[c for c in b_ids if c not in a_ids], added=[c for c in a_ids if c not in b_ids],
           test_or_status_changed=[c for c in b_ids if c in a_status and a_status[c] != b_status[c]], union_ok=a_ids == union)
rec["before_case_ids"] = b_ids; rec["after_case_ids"] = a_ids
json.dump(rec, open(f"{H}/applied/run498-sync-answers-2026-10-16.json", "w"), indent=1)
print({k: v for k, v in rec.items() if not k.endswith("case_ids")})
