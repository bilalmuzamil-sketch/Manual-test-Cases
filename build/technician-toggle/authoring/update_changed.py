#!/usr/bin/env python3
"""Technician Toggle, PRD v20 named set (QA lead 4 Nov 2026: "Yes, named sets"; the v18 set of 2 Nov 2026 is applied): update the named-set cases in TestRail to the library's
current text. DRY RUN by default: prints the plan, writes nothing. --apply is run only by the coordinator with the QA lead's go-ahead.
 - Rule 138 guard: the tester-readiness check must pass first (also on the dry run).
 - verify_v20_named_set.py must pass (every set quote v20, nothing outside the set differs from its read-back).
 - Lock: each case is updated only if the LIVE case still equals our latest read-back (applied/C<id>-after.json); a case someone else
   changed since is SKIPPED and reported (Rules 38, 87, 123).
 - Only the fields that differ are sent; each update is read back and kept as applied/C<id>-after.json (the previous one is kept as
   applied/C<id>-before-v20.json); a per-op log goes to applied/update-v20-log.jsonl (Rule 50).
 - Run 555: every unheld, mapped library case not yet in the run joins it, union only (Rules 34, 123): cases released from a hold and
   the new cases once create.py has added them. Run 555 and its tests are assigned to Mudassir (user 6): each test added is assigned
   to him (add_result_for_case with assignedto_id only, no status) and read back.
 - Nothing is deleted here (D-33 and D-34 were deleted on 2 Nov 2026).
python3 update_changed.py [--apply]"""
import sys, os, json, csv, subprocess
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
PROP = json.load(open(f"{D}/proposals.json"))
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
sys.path.insert(0, D); import tt_lib as L
F = ("title", "custom_preconds", "custom_steps", "custom_expected", "refs")
def same(a, b, x): return (a or "").replace(" ", "") == (b or "").replace(" ", "") if x == "refs" else a == b
RUN = json.load(open(f"{P}/applied/run.json"))["run"]; ASSIGN = 6   # Mudassir (coordinator, 4 Nov 2026)
plan, release = [], []
for k in sorted(L.NAMED_SET20):
    if k not in ids or k not in PROP: continue
    rb = json.load(open(f"{P}/applied/C{ids[k]}-after.json")); f = PROP[k]["fields"]
    send = {x: f[x] for x in F if not same(rb.get(x), f[x], x)}
    if send: plan.append((k, ids[k], send))
    was_held = "AUTOMATION: HOLD" in (rb.get("custom_expected") or "")
    if was_held and not PROP[k]["held"]: release.append((k, ids[k]))
new = [k for k in PROP if k not in ids and k not in L.NO_MANUAL]
print(f"PLAN (dry run unless --apply): update {len(plan)} named-set cases; fields: " +
      str({x: sum(1 for _, _, s in plan if x in s) for x in F}))
for k, cid, s in plan: print(f"  {k:7} C{cid}  {', '.join(s)}")
print(f"run {RUN}: add {len(release)} released cases (union only): {', '.join(f'{k} C{c}' for k, c in release)}")
print(f"new cases for create.py, then run {RUN} (assigned to user {ASSIGN}): {', '.join(new)}")
r = subprocess.run([sys.executable, f"{D}/verify_v20_named_set.py"], capture_output=True, text=True)
print("named-set proof:", r.stdout.strip().splitlines()[-1])
if r.returncode: sys.exit("REFUSED: verify_v20_named_set.py failed")
sys.path.insert(0, f"{P}/../testing-tools"); import tester_readiness_check as TRC
TRC.require(P)          # Rule 138
if "--apply" not in sys.argv:
    print("dry run: nothing written (add --apply, with the QA lead's go-ahead)"); sys.exit(0)
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
log = open(f"{P}/applied/update-v20-log.jsonl", "a"); bad = skipped = 0
for k, cid, send in plan:
    live = api(f"get_case/{cid}"); rb = json.load(open(f"{P}/applied/C{cid}-after.json"))
    moved = [x for x in F if not same(live.get(x), rb.get(x), x)]
    if moved:
        skipped += 1; log.write(json.dumps({"op": "skip", "key": k, "case": f"C{cid}", "changed_by_someone_else": moved}) + "\n"); continue
    json.dump(rb, open(f"{P}/applied/C{cid}-before-v20.json", "w"), indent=1, ensure_ascii=False)
    api(f"update_case/{cid}", send); st = LAST["status"]
    a = api(f"get_case/{cid}"); diff = [x for x in send if not same(a.get(x), send[x], x)]
    bad += bool(diff); json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    log.write(json.dumps({"op": "update_case", "key": k, "case": f"C{cid}", "http": st, "fields": list(send), "readback_ok": not diff, "bad": diff}) + "\n"); log.flush()
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}   # re-read: create.py may have added cases
want_in_run = {ids[k] for k in PROP if k in ids and not PROP[k]["held"]}
tests = api(f"get_tests/{RUN}"); tests = tests.get("tests", tests) if isinstance(tests, dict) else tests
have = {t["case_id"] for t in tests}; add = sorted(want_in_run - have)
if add:
    api(f"update_run/{RUN}", {"include_all": False, "case_ids": sorted(have | set(add))}); st = LAST["status"]
    for cid in add:
        api(f"add_result_for_case/{RUN}/{cid}", {"assignedto_id": ASSIGN, "comment": "Assigned to Mudassir (Technician Toggle, v20 named set)."})
    tests = api(f"get_tests/{RUN}"); tests = tests.get("tests", tests) if isinstance(tests, dict) else tests
    got = {t["case_id"]: t.get("assignedto_id") for t in tests}
    ok = set(got) == have | set(add) and all(got.get(c) == ASSIGN for c in add)
    log.write(json.dumps({"op": "update_run", "run": RUN, "http": st, "added": add, "assigned_to": ASSIGN, "tests": len(tests), "readback_ok": ok}) + "\n")
    bad += not ok
print("updated", len(plan) - skipped, "skipped (changed by someone else)", skipped, "problems", bad)
