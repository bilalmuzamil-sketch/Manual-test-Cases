#!/usr/bin/env python3
"""QA lead 16 Oct 2026: (2) keep the Technician-filter cases Blocked, with the reason that they wait on SV-11326; (3) add the related
ticket SV-11336 to C581895's test in run 498. Each test gets a new result (history kept) with the ticket in its Defects field.
C581895 keeps its Retest status. Writes applied/block-and-link-2026-10-16.json."""
import json, urllib.request, base64, sys
H = "build/wo-board-tech-view/answers-2026-10-15/followup-2026-10-16"
C = json.load(open("/tmp/testrail/creds.json")); AUTH = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
def call(ep, data=None):
    r = urllib.request.Request("https://shopview.testrail.io/index.php?/api/v2/" + ep, data=json.dumps(data).encode() if data is not None else None,
                               headers={"Authorization": "Basic " + AUTH, "Content-Type": "application/json"})
    resp = urllib.request.urlopen(r, timeout=120); return resp.status, json.load(resp)
J = "https://shopview.atlassian.net/browse/"
BLOCK = [590127, 97022, 581915, 581916, 581917, 581918]
BLOCK_COMMENT = (f"Blocked: waiting on ticket SV-11326 ({J}SV-11326, \"Tech View and Board View: add a Technician filter (lead technician, "
                 "multi-select)\") to be completed. This test needs the Technician filter in Tech View and Board View, which the staging "
                 "build does not have yet. Run this test again once SV-11326 is done.")
LINK = {581895: ("SV-11336", 4, f"Related ticket: SV-11336 ({J}SV-11336, \"Board/Tech View - technician name differs from List's Lead "
                 "Technician name\"). Status stays Retest: the expected results changed on 16 Oct (PRD version 54, S5-R11b), so please "
                 "run the case again as it now reads.")}
def tests():
    out, off = [], 0
    while True:
        st, d = call(f"get_tests/498&limit=250&offset={off}"); out += d["tests"]
        if d.get("_links", {}).get("next"): off += 250
        else: return {t["case_id"]: t for t in out}
before = tests()
missing = [c for c in BLOCK + list(LINK) if c not in before]
assert not missing, missing
res = [{"case_id": c, "status_id": 2, "comment": BLOCK_COMMENT, "defects": "SV-11326"} for c in BLOCK]
res += [{"case_id": c, "status_id": s, "comment": m, "defects": k} for c, (k, s, m) in LINK.items()]
rec = {"before": {c: before[c]["status_id"] for c in BLOCK + list(LINK)}}
if "--apply" in sys.argv:
    st, r = call("add_results_for_cases/498", {"results": res}); rec["http"] = st; rec["results_added"] = len(r)
    rec["defects_written"] = {x["test_id"]: x.get("defects") for x in r}
after = tests()
rec["after"] = {c: after[c]["status_id"] for c in BLOCK + list(LINK)}; rec["test_ids"] = {c: after[c]["id"] for c in BLOCK + list(LINK)}
rec["ok"] = all(after[c]["status_id"] == 2 for c in BLOCK) and after[581895]["status_id"] == 4; rec["run_count_after"] = len(after)
json.dump(rec, open(f"{H}/applied/block-and-link-2026-10-16.json", "w"), indent=1)
print(json.dumps(rec, indent=0))
