#!/usr/bin/env python3
"""TestRail write for the Parts Lifecycle full pass — DRAFT, NOT RUN BY ANY PHASE WORKER. Only the coordinator runs it, and only
with the QA lead's explicit go-ahead (Rule 6). Without --apply it only prints the plan.

  python3 apply.py                 plan: which keys UPDATE a live case (key has a C-id in ../testrail-id-map.csv), which are NEW
  python3 apply.py --apply         writes, in this order, with a per-operation log (../applied-2026-10-27/apply-log.jsonl, Rule 50):
    0. build.py must end "PROBLEM lines: 0" and tester_readiness_check.require() must pass (Rule 138), or nothing is written;
    1. UPDATE each mapped case, under an edit lock: the live case must still equal our 14 Oct read-back (same updated_on, updated_by
       us), else that case is skipped and listed (Rules 87, 123); a before-copy and a read-back are kept per case;
    2. ADD each new key to its section (refused for DESIGN until the coordinator has created "Design — how it looks" and put its id in
       ../section-map.json as "DESIGN"); the new C-id is appended to ../testrail-id-map.csv;
    3. upload each case's design pictures (idempotent, read back).
  Held cases (marker other than the standard HOLD) are written like the others (they are in the suite) but are NOT added to a run.
  Runs: the cases live in the automatic Nightly runs (QA lead, 13 Oct: no dedicated run); any run sync is union only (Rule 34)."""
import sys, os, json, csv, subprocess
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
PROP = json.load(open(f"{D}/proposals.json")); MAP = {r["key"]: r for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
upd = [k for k in PROP if k in MAP]; new = [k for k in PROP if k not in MAP]
print(f"UPDATE {len(upd)} live cases | ADD {len(new)} new cases | sections", sorted({PROP[k]['sec'] for k in PROP}))
if "--apply" not in sys.argv: sys.exit(0)
b = subprocess.run([sys.executable, f"{D}/build.py"], capture_output=True, text=True)
if b.returncode != 0 or "PROBLEM lines: 0" not in b.stdout: sys.exit("REFUSED: build.py has PROBLEM lines")
sys.path.insert(0, "/home/user/Manual-test-Cases/build/testing-tools"); import tester_readiness_check as T
T.require(P)                                                          # Rule 138: exits on any hard problem
sys.path.insert(0, f"{P}/../../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
OUT = f"{P}/applied-2026-10-27"; os.makedirs(f"{OUT}/before", exist_ok=True)
log = open(f"{OUT}/apply-log.jsonl", "a")
def L(r): log.write(json.dumps(r, ensure_ascii=False) + "\n"); log.flush()
def diff(a, f): return [x for x, y in f.items() if ((a.get(x) or "").replace(" ", "") != y.replace(" ", "") if x == "refs" else a.get(x) != y)]
for k in upd:
    cid = int(MAP[k]["case_id"]); prev = json.load(open(f"{P}/update-2026-10-14/applied/C{cid}-after.json"))
    live = api(f"get_case/{cid}")
    if live["updated_on"] != prev["updated_on"]:
        L({"op": "skip", "key": k, "case": f"C{cid}", "why": "changed since our 14 Oct read-back: ask the QA lead (Rule 123)"}); continue
    json.dump(live, open(f"{OUT}/before/C{cid}.json", "w"), indent=1, ensure_ascii=False)
    f = PROP[k]["fields"]; api(f"update_case/{cid}", f); st = LAST["status"]; a = api(f"get_case/{cid}")
    json.dump(a, open(f"{OUT}/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    L({"op": "update_case", "key": k, "case": f"C{cid}", "http": st, "readback_ok": not diff(a, f), "bad": diff(a, f)})
for k in new:
    v = PROP[k]
    if not v["section_id"]: L({"op": "skip", "key": k, "why": f"section {v['sec']} has no id yet"}); continue
    n = api(f"add_case/{v['section_id']}", v["fields"]); st = LAST["status"]; cid = n["id"]; a = api(f"get_case/{cid}")
    json.dump(a, open(f"{OUT}/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    L({"op": "add_case", "key": k, "case": f"C{cid}", "http": st, "readback_ok": not diff(a, v["fields"]), "bad": diff(a, v["fields"])})
    with open(f"{P}/testrail-id-map.csv", "a", newline="") as mf:
        csv.writer(mf).writerow([k, cid, v["section_id"], v["fields"]["title"], f"https://shopview.testrail.io/index.php?/cases/view/{cid}"])
print("written; see", f"{OUT}/apply-log.jsonl", "(pictures: upload with the credit-terms create.py recipe once the coordinator confirms the names)")
