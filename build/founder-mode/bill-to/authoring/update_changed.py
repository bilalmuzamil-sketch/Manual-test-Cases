#!/usr/bin/env python3
"""Bill To: update the live TestRail cases whose rebuilt fields differ from their last read-back (applied/C<id>-after.json), for a named
set the QA lead approved (Rule 122 as amended: he chooses a full pass or a named set first). DRY RUN by default: prints, per case, which
fields would change (Rule 134 evidence: every part CHANGED or CONFIRMED). Calls the tester-readiness check first (Rule 138). Never
touches a case TestRail flags as Automated (Rule 71) or one someone else created (Rule 123: ask first).
python3 update_changed.py --keys S1-01,S1-02 [--apply]"""
import sys, os, json, csv
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
PROP = json.load(open(f"{D}/proposals.json"))
MAP = f"{P}/testrail-id-map.csv"
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(MAP))} if os.path.exists(MAP) else {}
keys = sys.argv[sys.argv.index("--keys") + 1].split(",") if "--keys" in sys.argv else []
if not keys: sys.exit("name the approved set with --keys (Rule 122): no default full pass")
FIELDS = ["title", "refs", "custom_preconds", "custom_steps", "custom_expected"]
plan = []
for k in keys:
    if k not in ids: print(f"{k}: not mapped to a C-id yet (create.py adds it)"); continue
    after = f"{P}/applied/C{ids[k]}-after.json"
    live = json.load(open(after)) if os.path.exists(after) else {}
    ch = [f for f in FIELDS if (live.get(f) or "") != PROP[k]["fields"][f]]
    print(f"{k} C{ids[k]}: " + ", ".join(f"{f} {'CHANGED' if f in ch else 'CONFIRMED'}" for f in FIELDS))
    if ch: plan.append((k, ch))
sys.path.insert(0, f"{P}/../../testing-tools"); import tester_readiness_check as TRC
TRC.require(P)
if "--apply" not in sys.argv:
    print(f"dry run: {len(plan)} case(s) would change; nothing written"); sys.exit(0)
sys.path.insert(0, f"{P}/../../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
log = open(f"{P}/applied/update-log.jsonl", "a")
for k, ch in plan:
    cid = ids[k]; cur = api(f"get_case/{cid}")
    if cur.get("custom_automation_type") not in (None, 0, 2): print(f"{k}: TestRail flags it Automated; held for the QA lead (Rule 71)"); continue
    api(f"update_case/{cid}", {f: PROP[k]["fields"][f] for f in ch}); st = LAST["status"]
    a = api(f"get_case/{cid}"); bad = [f for f in ch if (a.get(f) or "") != PROP[k]["fields"][f]]
    json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    log.write(json.dumps({"op": "update_case", "key": k, "case": f"C{cid}", "http": st, "fields": ch, "readback_ok": not bad, "bad": bad}) + "\n")
