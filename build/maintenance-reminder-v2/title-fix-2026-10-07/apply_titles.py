#!/usr/bin/env python3
"""Plain-language titles for the Maintenance Reminders cases (QA lead 2026-10-07: titles must be understandable by a
manual QA tester while kept short). Title only: nothing else in a case changes. Snapshot + read-back per case."""
import sys, json
sys.path.insert(0, "build/maintenance-reminder-v2")
from mr_lib import api
H = "build/maintenance-reminder-v2/title-fix-2026-10-07"
T = dict(l.rstrip("\n").split("\t") for l in open(f"{H}/titles.tsv"))
log = []
for cid, new in T.items():
    c = api(f"get_case/{cid}")
    assert c.get("custom_atmstatus") != 3, f"C{cid} Automated - stop"
    assert c["updated_by"] == 3, f"C{cid} last edited by someone else - stop"
    if c["title"] == new: continue
    api(f"update_case/{cid}", {"title": new}); a = api(f"get_case/{cid}")
    ok = a["title"] == new and all(a.get(k) == c.get(k) for k in ("custom_preconds", "custom_steps", "custom_expected"))
    log.append({"case": f"C{cid}", "old": c["title"], "new": new, "verified": ok}); print(("OK " if ok else "MISMATCH ") + cid)
json.dump(log, open(f"{H}/apply-log.json", "w"), indent=1, ensure_ascii=False)
print("verified", sum(x["verified"] for x in log), "of", len(log))
