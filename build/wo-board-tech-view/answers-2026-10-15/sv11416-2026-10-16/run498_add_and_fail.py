#!/usr/bin/env python3
"""QA lead 16 Oct 2026: add C614711 to run 498 (union only, Rules 34/123) and mark it Failed with SV-11416 as the ticket to follow
(comment + Defects field). Proves nothing dropped and no other test's status changed. Writes applied/run498-sv11416-2026-10-16.json."""
import json, urllib.request, base64, sys
H = "build/wo-board-tech-view/answers-2026-10-15/sv11416-2026-10-16"
C = json.load(open("/tmp/testrail/creds.json")); AUTH = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
def call(ep, data=None):
    r = urllib.request.Request("https://shopview.testrail.io/index.php?/api/v2/" + ep, data=json.dumps(data).encode() if data is not None else None,
                               headers={"Authorization": "Basic " + AUTH, "Content-Type": "application/json"})
    resp = urllib.request.urlopen(r, timeout=120); return resp.status, json.load(resp)
def tests():
    out, off = [], 0
    while True:
        st, d = call(f"get_tests/498&limit=250&offset={off}"); out += d["tests"]
        if d.get("_links", {}).get("next"): off += 250
        else: return {t["case_id"]: (t["id"], t["status_id"]) for t in out}
NEW = 614711
J = "https://shopview.atlassian.net/browse/SV-11416"
COMMENT = (f"Failed. Ticket to follow: SV-11416 ({J}), \"Board View - Deleted Lead Technician's Work Order Shows Under 'Unknown "
           "Technician'\" (open). Found on staging on 16 Oct 2026 by Bilal Muzamil: after the lead technician is deleted in Settings > "
           "Staff, the work order sits in a Board View column headed \"Unknown Technician\" with a generic person icon; the "
           "technician's name is not shown and the column has no inactive marker. Run this test again once SV-11416 is done.")
st, run = call("get_run/498"); assert not run["is_completed"] and not run["include_all"]
before = tests(); rec = {"before_count": len(before), "already_in": NEW in before}
union = sorted(set(before) | {NEW})
if "--apply" in sys.argv:
    if NEW not in before:
        st, _ = call("update_run/498", {"include_all": False, "case_ids": union}); rec["update_run_http"] = st
    st, r = call("add_results_for_cases/498", {"results": [{"case_id": NEW, "status_id": 5, "comment": COMMENT, "defects": "SV-11416"}]})
    rec["result_http"] = st; rec["result_defects"] = r[0].get("defects")
after = tests()
rec.update(after_count=len(after), dropped=[c for c in before if c not in after],
           others_changed=[c for c in before if after.get(c) != before[c]], new_test=after.get(NEW))
rec["ok"] = not rec["dropped"] and not rec["others_changed"] and after.get(NEW, (0, 0))[1] == 5
json.dump(rec, open(f"{H}/applied/run498-sv11416-2026-10-16.json", "w"), indent=1); print(rec)
