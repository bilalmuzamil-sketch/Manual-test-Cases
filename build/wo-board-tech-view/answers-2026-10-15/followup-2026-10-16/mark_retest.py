#!/usr/bin/env python3
"""QA lead 16 Oct 2026: "move it to retest" — every run-498 test whose case's expected results changed on 15-16 Oct (Chris Ward's
answers 12-31, PRD v54) gets a new result with status Retest (id 4); earlier results stay in the test's history. Untested tests
(first run) are left Untested. Writes applied/retest-2026-10-16.json with status before and after for each."""
import json, urllib.request, base64, sys
H = "build/wo-board-tech-view/answers-2026-10-15/followup-2026-10-16"
C = json.load(open("/tmp/testrail/creds.json")); AUTH = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
def call(ep, data=None):
    r = urllib.request.Request("https://shopview.testrail.io/index.php?/api/v2/" + ep, data=json.dumps(data).encode() if data is not None else None,
                               headers={"Authorization": "Basic " + AUTH, "Content-Type": "application/json"})
    resp = urllib.request.urlopen(r, timeout=120); return resp.status, json.load(resp)
RETEST = [590110, 590111, 590112, 590115, 590116, 590117, 590122, 590128, 590129, 590131, 590127, 96927, 96909, 96916, 96929, 96935,
          368127, 96956, 96990, 96978, 368163, 97021, 97022, 368150, 368151, 368152, 97020, 581895]
def tests():
    out, off = [], 0
    while True:
        st, d = call(f"get_tests/498&limit=250&offset={off}"); out += d["tests"]
        if d.get("_links", {}).get("next"): off += 250
        else: return {t["case_id"]: t for t in out}
before = tests()
todo = [c for c in RETEST if before[c]["status_id"] not in (3, 4)]
comment = ("Retest: the expected results of this case changed on 15-16 Oct 2026 (Chris Ward's answers 12-31 on the WO Board question "
           "sheet, PRD Confluence 845185030 version 54). The earlier result was recorded against the old expected results; please run "
           "the case again as it now reads.")
rec = {"before": {c: before[c]["status_id"] for c in RETEST}, "skipped_untested_or_retest": [c for c in RETEST if c not in todo]}
if "--apply" in sys.argv and todo:
    st, r = call("add_results_for_cases/498", {"results": [{"case_id": c, "status_id": 4, "comment": comment} for c in todo]})
    rec["http"] = st; rec["results_added"] = len(r)
after = tests()
rec["after"] = {c: after[c]["status_id"] for c in RETEST}; rec["test_ids"] = {c: after[c]["id"] for c in RETEST}
rec["all_retest"] = all(after[c]["status_id"] == 4 for c in todo)
rec["run_count_after"] = len(after)
json.dump(rec, open(f"{H}/applied/retest-2026-10-16.json", "w"), indent=1)
print({k: v for k, v in rec.items() if k not in ("before", "after", "test_ids")}, "before:", sorted(set(rec["before"].values())))
