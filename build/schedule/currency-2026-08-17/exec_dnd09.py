# -*- coding: utf-8 -*-
"""SCH-DND-09 (C43555): genuine OPEN PO-question HOLD (Month-view drag, SV-8870).
Minimal v30 re-stamp only: version 27->30 (body + provenance), read dates ->17 Aug,
drop sentence-2; KEEP the HOLD marker and KEEP the open-question/build-observation body
(the blocker is a PO answer, not build availability). Rule-50 byte-verified."""
import sys, os, json, glob, time, re
sys.path.insert(0, "/tmp/testrail")
import tr
ROOT = "/home/user/Manual-test-Cases"
CID = "43555"; IID = "SCH-DND-09"
OPLOG = os.path.join(os.path.dirname(__file__), "oplog-currency.jsonl")

code, live = tr.api(f"get_case/{CID}")
assert code == 200 and live.get("created_by") == 3, (code, live.get("created_by"))
exp = live.get("custom_expected")
new = exp.replace("specification version 27", "specification version 30")
new = new.replace("read on 11 August 2026", "read on 17 August 2026")
new = re.sub(r"\s*Last checked against build[^\n]*", "", new)
assert "specification version 27" not in new and "Last checked against build" not in new
assert new != exp
# marker unchanged (still HOLD - waiting on the product owner's answer)
assert "AUTOMATION: HOLD - waiting on the product owner" in new
payload = {"title": live["title"], "custom_preconds": live.get("custom_preconds"),
           "custom_steps": live.get("custom_steps"), "custom_expected": new,
           "refs": live.get("refs")}
FROZEN = ["section_id","type_id","priority_id","template_id","created_by","custom_atmstatus","custom_automation_type","is_deleted"]
fb = {k: live.get(k) for k in FROZEN}
print("NEW tail:\n", new[-300:])
code, res = tr.api(f"update_case/{CID}", "POST", payload)
assert code == 200, res
code, back = tr.api(f"get_case/{CID}")
mism = [(k, live.get(k) if False else want, back.get(k)) for k, want in
        [("custom_expected", new), ("title", payload["title"]),
         ("custom_preconds", payload["custom_preconds"]), ("custom_steps", payload["custom_steps"])]
        if back.get(k) != want]
if ",".join(x.strip() for x in (back.get("refs") or "").split(",")) != ",".join(x.strip() for x in (payload["refs"] or "").split(",")):
    mism.append(("refs", payload["refs"], back.get("refs")))
for k in FROZEN:
    if fb.get(k) != back.get(k): mism.append((f"FROZEN:{k}", fb.get(k), back.get(k)))
if mism:
    print("🛑 MISMATCH", mism); raise SystemExit(2)
with open(OPLOG, "a") as f:
    f.write(json.dumps({"ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "iid": IID, "cid": CID,
            "status": "VERIFIED_OK", "mode": "po-hold-restamp", "fields_checked": 5+len(FROZEN)}) + "\n")
# mirror local source
for path in glob.glob(f"{ROOT}/build/schedule/cases/cases-*.json"):
    data = json.load(open(path)); items = data if isinstance(data, list) else data.get("cases", [])
    ch = False
    for c in items:
        if c.get("id") == IID:
            c["expected"] = new; ch = True
    if ch:
        json.dump(items, open(path, "w"), ensure_ascii=False, indent=1); print("mirrored ->", path)
print("✓ VERIFIED C43555 (PO-hold re-stamp)")
