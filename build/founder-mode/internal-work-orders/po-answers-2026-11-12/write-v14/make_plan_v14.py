#!/usr/bin/env python3
"""Plan for the v1.4 named-set writes (14 Nov 2026; QA lead: "Named set, drop S12-49 (Recommended)"). Writes plan-v14.json and
lock-base-34.json from authoring/proposals.json (now) and commit 83ba7fe37 (the bodies round 4 wrote on 13 Nov 2026 and read back field by
field: log-update.jsonl readback_ok true for all 34; build.py reproduced them byte for byte on 14 Nov 2026).
   python3 make_plan_v14.py"""
import json, os, csv, subprocess, re
W = os.path.dirname(os.path.abspath(__file__)); A = os.path.dirname(W); P = os.path.dirname(A)
REPO = subprocess.check_output(["git", "rev-parse", "--show-toplevel"], cwd=W, text=True).strip()
NOW = json.load(open(f"{P}/authoring/proposals.json"))
BEFORE = json.loads(subprocess.check_output(["git", "show", "83ba7fe37:" + os.path.relpath(f"{P}/authoring/proposals.json", REPO)], cwd=REPO))
PP = json.load(open(f"{A}/v14/per-part-v14.json"))
MAP = {r["key"]: r for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
F = ["title", "custom_preconds", "custom_steps", "custom_expected", "refs"]
upd = [k for k, v in PP.items() if v["set"] in ("CHANGE", "RE-QUOTE", "DESIGN REFERENCE")]
new = [k for k, v in PP.items() if v["set"] == "DRAFT"]
L4 = [json.loads(x) for x in open(f"{A}/write/log-update.jsonl")]
r4 = {x["key"] for x in L4 if x.get("op") == "update_case" and x.get("apply") and x.get("readback_ok")}
assert len(upd) == 34 and len(new) == 54 and all(k in r4 for k in upd) and all(k in MAP for k in upd) and not any(k in MAP for k in new)
lock = {k: {"case_id": MAP[k]["case_id"], **{f: BEFORE[k]["fields"][f] for f in F}} for k in upd}
json.dump({"made": "14 Nov 2026", "source": "authoring/proposals.json at commit 83ba7fe37 = the round-4 body written 13 Nov 2026 and read back OK "
           "(po-answers-2026-11-12/write/log-update.jsonl)", "cases": lock}, open(f"{W}/lock-base-34.json", "w"), indent=1, ensure_ascii=False)
plan = {"made": "14 Nov 2026", "decision": "QA lead, 14 Nov 2026: \"Named set, drop S12-49 (Recommended)\"", "run": 559, "assign_to": 6,
        "folder": {"section_id": 136701, "date": "11/14/2026",
                   "sentence": "Test cases are current as of 11/14/2026. Before you start testing, check whether the PRD, design or any other source has changed since then; if it has, update the test cases first."},
        "update": [{"key": k, "case_id": MAP[k]["case_id"], "set": PP[k]["set"], "held": NOW[k]["held"], "pictures_add": PP[k]["pictures_added"],
                    "pictures_delete": PP[k]["pictures_removed"]} for k in upd],
        "create": [{"key": k, "section": NOW[k]["sec"], "section_id": NOW[k]["section_id"], "held": NOW[k]["held"]} for k in new],
        "run_add_new": [k for k in new if not NOW[k]["held"]],
        "run_keep_touched": [k for k in upd if not NOW[k]["held"]]}
json.dump(plan, open(f"{W}/plan-v14.json", "w"), indent=1, ensure_ascii=False)
from collections import Counter
print("update", len(plan["update"]), "| pictures to add", sum(len(u["pictures_add"]) for u in plan["update"]), "| to delete", sum(len(u["pictures_delete"]) for u in plan["update"]))
print("create", len(plan["create"]), dict(Counter((c["section"], c["held"]) for c in plan["create"])))
print("run 559: new released", len(plan["run_add_new"]), "| touched released (must already be in the run)", len(plan["run_keep_touched"]))
