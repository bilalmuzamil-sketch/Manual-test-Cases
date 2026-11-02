#!/usr/bin/env python3
"""Technician Toggle, PRD v18 named set (QA lead 2 Nov 2026: "Named set"): update the named-set cases in TestRail to the library's
current text. DRY RUN by default: prints the plan, writes nothing. --apply is run only by the coordinator with the QA lead's go-ahead.
 - Rule 138 guard: the tester-readiness check must pass first (also on the dry run).
 - verify_v18_named_set.py must pass (every quote v18, nothing outside the set differs from its read-back).
 - Lock: each case is updated only if the LIVE case still equals our latest read-back (applied/C<id>-after.json); a case someone else
   changed since is SKIPPED and reported (Rules 38, 87, 123).
 - Only the fields that differ are sent; each update is read back and kept as applied/C<id>-after.json (the previous one is kept as
   applied/C<id>-before-v18.json); a per-op log goes to applied/update-v18-log.jsonl (Rule 50).
 - Run 555: cases released from a hold join the run, union only (Rules 34, 123); new cases join after create.py adds them.
 - Deleting D-33 and D-34 is NOT done here: po-answers-2026-11-02/DELETE.json lists them for the coordinator.
python3 update_changed.py [--apply]"""
import sys, os, json, csv, subprocess
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
PROP = json.load(open(f"{D}/proposals.json"))
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
sys.path.insert(0, D); import tt_lib as L
F = ("title", "custom_preconds", "custom_steps", "custom_expected", "refs")
def same(a, b, x): return (a or "").replace(" ", "") == (b or "").replace(" ", "") if x == "refs" else a == b
RUN = json.load(open(f"{P}/applied/run.json"))["run"]
plan, release = [], []
for k in sorted(L.NAMED_SET):
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
print(f"new cases for create.py, then run {RUN}: {', '.join(new)} | delete (coordinator, DELETE.json): {', '.join(f'{k} {c}' for k, c in L.DELETED.items())}")
r = subprocess.run([sys.executable, f"{D}/verify_v18_named_set.py"], capture_output=True, text=True)
print("named-set proof:", r.stdout.strip().splitlines()[-1])
if r.returncode: sys.exit("REFUSED: verify_v18_named_set.py failed")
sys.path.insert(0, f"{P}/../testing-tools"); import tester_readiness_check as TRC
TRC.require(P)          # Rule 138
if "--apply" not in sys.argv:
    print("dry run: nothing written (add --apply, with the QA lead's go-ahead)"); sys.exit(0)
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
log = open(f"{P}/applied/update-v18-log.jsonl", "a"); bad = skipped = 0
for k, cid, send in plan:
    live = api(f"get_case/{cid}"); rb = json.load(open(f"{P}/applied/C{cid}-after.json"))
    moved = [x for x in F if not same(live.get(x), rb.get(x), x)]
    if moved:
        skipped += 1; log.write(json.dumps({"op": "skip", "key": k, "case": f"C{cid}", "changed_by_someone_else": moved}) + "\n"); continue
    json.dump(rb, open(f"{P}/applied/C{cid}-before-v18.json", "w"), indent=1, ensure_ascii=False)
    api(f"update_case/{cid}", send); st = LAST["status"]
    a = api(f"get_case/{cid}"); diff = [x for x in send if not same(a.get(x), send[x], x)]
    bad += bool(diff); json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    log.write(json.dumps({"op": "update_case", "key": k, "case": f"C{cid}", "http": st, "fields": list(send), "readback_ok": not diff, "bad": diff}) + "\n"); log.flush()
if release:
    tests = api(f"get_tests/{RUN}"); tests = tests.get("tests", tests) if isinstance(tests, dict) else tests
    have = {t["case_id"] for t in tests}; want = sorted(have | {c for _, c in release})
    api(f"update_run/{RUN}", {"include_all": False, "case_ids": want}); st = LAST["status"]
    tests = api(f"get_tests/{RUN}"); tests = tests.get("tests", tests) if isinstance(tests, dict) else tests
    ok = {t["case_id"] for t in tests} == set(want)
    log.write(json.dumps({"op": "update_run", "run": RUN, "http": st, "added": [c for _, c in release], "tests": len(tests), "readback_ok": ok}) + "\n")
    bad += not ok
print("updated", len(plan) - skipped, "skipped (changed by someone else)", skipped, "problems", bad)
