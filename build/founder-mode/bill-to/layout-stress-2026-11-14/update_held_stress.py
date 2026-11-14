#!/usr/bin/env python3
"""DRAFT, NOT RUN (14 Nov 2026). Updates the five held Bill To cases extended with the layout stress names (QA lead, 14 Nov 2026: "Draft all
87 + 4 questions (Recommended)"), once the QA lead has said yes (Rule 6). Mirrors authoring/update_changed.py, with a lock on the live text.

  S3-32 C1062292 (question 9) · D-66 C1062561 (question 9) · D-67 C1062562 (question 10) · S16-02 C1062439 (portal release)
  · S14-13 C1062431 (question 14).   S9-06 is library only (create.py NO_MANUAL) and is not in TestRail: nothing to write.

  1. tester-readiness check first (Rule 138); refuses on failure
  2. per case, LOCKED ON THE LIVE TEXT (Rule 87): get_case, save the before-copy, and compare its title, refs, preconditions, steps and
     expected result with our last read-back (applied/C<id>-after.json). Any difference means someone else edited the case since we
     wrote it: that case is NOT written and is listed for the QA lead (Rule 123). A case TestRail flags as Automated is held (Rule 71); a
     case created by someone else is refused (Rule 123)
  3. update_case with only the fields that changed (Rule 134 evidence: each field CHANGED or CONFIRMED is printed on the dry run), read
     back field by field, read-back saved as applied/C<id>-after.json
  4. no run change: all five stay held, out of run 558 (D-66/D-67 keep their attached pictures; no new picture)
Every operation is logged (operation, C-id, HTTP status, read-back) in layout-stress-2026-11-14/applied/update-log.jsonl (Rule 50).
Dry run unless --apply.   python3 update_held_stress.py [--apply]"""
import sys, os, json, csv
HERE = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(HERE); D = f"{P}/authoring"
sys.path.insert(0, f"{P}/../../testing-tools"); import tester_readiness_check as TRC
APPLY = "--apply" in sys.argv
KEYS = {"S3-32": 1062292, "D-66": 1062561, "D-67": 1062562, "S16-02": 1062439, "S14-13": 1062431}
FIELDS = ["title", "refs", "custom_preconds", "custom_steps", "custom_expected"]
OURS = 3                                             # created_by of our cases (CLAUDE.md §3)
PROP = json.load(open(f"{D}/proposals.json"))
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
plan = []
for k, cid in KEYS.items():
    assert ids.get(k) == cid, (k, cid, ids.get(k)); assert PROP[k]["held"], f"{k} is no longer held"
    last = json.load(open(f"{P}/applied/C{cid}-after.json"))
    ch = [f for f in FIELDS if (last.get(f) or "") != PROP[k]["fields"][f]]
    print(f"{k} C{cid}: " + ", ".join(f"{f} {'CHANGED' if f in ch else 'CONFIRMED'}" for f in FIELDS))
    if ch: plan.append((k, cid, ch, last))
TRC.require(P)          # Rule 138
if not APPLY:
    print(f"dry run: {len(plan)} case(s) would change; nothing written (add --apply, with the QA lead's go-ahead)"); sys.exit(0)

sys.path.insert(0, f"{P}/../../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
os.makedirs(f"{HERE}/applied", exist_ok=True)
log = open(f"{HERE}/applied/update-log.jsonl", "a"); held_back = []
for k, cid, ch, last in plan:
    live = api(f"get_case/{cid}")
    json.dump(live, open(f"{HERE}/applied/C{cid}-before.json", "w"), indent=1, ensure_ascii=False)
    moved = [f for f in FIELDS if (live.get(f) or "") != (last.get(f) or "")]
    if moved:
        held_back.append((k, cid, moved)); log.write(json.dumps({"op": "lock_refused", "key": k, "case": f"C{cid}", "live_differs": moved}) + "\n"); continue
    if live.get("custom_automation_type") not in (None, 0, 2):
        held_back.append((k, cid, ["Automated"])); log.write(json.dumps({"op": "held_automated", "key": k, "case": f"C{cid}"}) + "\n"); continue
    if live.get("created_by") != OURS:
        held_back.append((k, cid, ["created by someone else"])); log.write(json.dumps({"op": "held_foreign", "key": k, "case": f"C{cid}"}) + "\n"); continue
    api(f"update_case/{cid}", {f: PROP[k]["fields"][f] for f in ch}); st = LAST["status"]
    a = api(f"get_case/{cid}"); bad = [f for f in ch if (a.get(f) or "") != PROP[k]["fields"][f]]
    json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    log.write(json.dumps({"op": "update_case", "key": k, "case": f"C{cid}", "http": st, "fields": ch, "readback_ok": not bad, "bad": bad}) + "\n")
    log.flush()
print("written:", len(plan) - len(held_back), "| not written (for the QA lead):", held_back)
