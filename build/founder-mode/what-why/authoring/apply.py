#!/usr/bin/env python3
"""TestRail write for the What/Why full pass — DRAFT, NOT RUN BY ANY PHASE WORKER. Only the coordinator runs it, and only
with the QA lead's explicit go-ahead (Rule 6). Without --apply it only prints the plan.

  python3 apply.py                 plan: which keys UPDATE a live case (key has a C-id in ../testrail-id-map.csv), which are NEW
  python3 apply.py --apply         writes, in this order, with a per-operation log (../applied-2026-10-27/apply-log.jsonl, Rule 50):
    0. build.py must end "PROBLEM lines: 0" and tester_readiness_check.require() must pass (Rule 138), or nothing is written;
    1. UPDATE each mapped case, under an edit lock: the live case must still equal our 13 Oct read-back (same updated_on, updated_by
       us), else that case is skipped and listed (Rules 87, 123); a before-copy and a read-back are kept per case;
    2. ADD each new key to its section (refused for DESIGN until the coordinator has created "Design — how it looks" and put its id in
       ../section-map.json as "DESIGN", then re-run build.py so proposals.json carries it; this script never creates a section); the new
       C-id is appended to ../testrail-id-map.csv;
    3. upload each case's design pictures (idempotent, read back).
  Rule 65/71: C154707-C154725 were listed by Vladimir Tomovic (SV-10130..SV-10133 comments of 7 Oct 2026) as "automation planned";
  every one of them is rewritten here, so tell Vlad when this runs. EXPECT FAIL (SV-11850) cases go into the run like the others.
  Held cases (marker other than the standard HOLD or an EXPECT FAIL) are written like the others (they are in the suite) but are NOT added to a run.
  Runs: the cases live in the automatic Nightly runs (QA lead, 13 Oct: no dedicated run); any run sync is union only (Rule 34)."""
import sys, os, json, csv, subprocess
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
PROP = json.load(open(f"{D}/proposals.json")); MAP = {r["key"]: r for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
upd = [k for k in PROP if k in MAP]; new = [k for k in PROP if k not in MAP]
print(f"UPDATE {len(upd)} live cases | ADD {len(new)} new cases | sections", sorted({PROP[k]['sec'] for k in PROP}))
# ---- the plan in full (integration step, 27 Oct 2026): per section, the new section, moves, deletes, read-backs, held cases
from collections import Counter
ORDER = ["S1", "S2", "S3", "S4", "DESIGN"]
print("per section (UPDATE in place / ADD: split parts + new behaviour / held):")
for sec in ORDER:
    ks = [k for k in PROP if PROP[k]["sec"] == sec]
    if not ks: continue
    a = [k for k in ks if k not in MAP]
    print(f"  {sec:6} section {PROP[ks[0]]['section_id']}: UPDATE {len([k for k in ks if k in MAP]):3} | ADD {len(a):3} "
          f"(splits {len([k for k in a if PROP[k]['part_of']])}, new {len([k for k in a if not PROP[k]['part_of']])}) | held {len([k for k in ks if PROP[k]['held']])}")
design_id = PROP[next(k for k in PROP if PROP[k]["sec"] == "DESIGN")]["section_id"] if any(PROP[k]["sec"] == "DESIGN" for k in PROP) else None
print("new section 'Design — how it looks' under What/Why 20437:", f"id {design_id} (from ../section-map.json)" if design_id else
      "NOT CREATED YET - this script never creates a section: the coordinator creates it in TestRail, writes its id into "
      "../section-map.json as \"DESIGN\", re-runs build.py; until then the design cases are skipped by --apply")
moves = [(k, MAP[k]["section_id"], PROP[k]["section_id"]) for k in upd if str(MAP[k]["section_id"]) != str(PROP[k]["section_id"])]
print("cases that would MOVE section:", len(moves), moves[:5])
print("cases this script would DELETE: 0 (it has no delete operation; no What/Why case is retired in this pass)")
nob = [k for k in upd if not os.path.exists(f"{P}/update-2026-10-13/applied/C{MAP[k]['case_id']}-after.json")]
print("updates with no 13 Oct read-back to lock against:", len(nob), nob[:5])
dup = [c for c, n in Counter(MAP[k]["case_id"] for k in upd).items() if n > 1]
print("C-ids updated by more than one key:", len(dup))
print("held cases (written, not added to any run):", len([k for k in PROP if PROP[k]["held"]]),
      sorted(k for k in PROP if PROP[k]["held"]))
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
    cid = int(MAP[k]["case_id"])
    # 27 Oct 2026 (coordinator): lock against our LATEST read-back, so a re-run neither writes twice nor skips a case it wrote
    lastf = f"{OUT}/C{cid}-after.json" if os.path.exists(f"{OUT}/C{cid}-after.json") else f"{P}/update-2026-10-13/applied/C{cid}-after.json"
    prev = json.load(open(lastf)); live = api(f"get_case/{cid}")
    if lastf.startswith(OUT) and not diff(live, PROP[k]["fields"]):
        L({"op": "already", "key": k, "case": f"C{cid}"}); continue
    if live["updated_on"] != prev["updated_on"]:
        L({"op": "skip", "key": k, "case": f"C{cid}", "why": "changed since our 13 Oct read-back: ask the QA lead (Rule 123)"}); continue
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
# 27 Oct 2026 (coordinator): attach every design picture a case names (idempotent: names already attached are skipped), then read back
import re as _re, base64 as _b64, uuid as _uuid, time as _time, urllib.request as _ur, urllib.error as _ue
PIC_DIRS = [f"{P}/full-pass-2026-10-27/design/images", f"{P}/full-pass-2026-10-27/design/renders", f"{P}/sources/design-2026-10-27-artifact/png"]
_C = json.load(open("/tmp/testrail/creds.json")); _AUTH = _b64.b64encode(f"{_C.get('email') or _C.get('user')}:{_C['password']}".encode()).decode()
def _upload(cid, name, path):
    b = _uuid.uuid4().hex
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"attachment\"; filename=\"{name}\"\r\nContent-Type: image/png\r\n\r\n").encode() + open(path, "rb").read() + f"\r\n--{b}--\r\n".encode()
    r = _ur.Request(f"https://shopview.testrail.io/index.php?/api/v2/add_attachment_to_case/{cid}", data=body,
                    headers={"Authorization": "Basic " + _AUTH, "Content-Type": f"multipart/form-data; boundary={b}"})
    for t in range(4):
        try: x = _ur.urlopen(r, timeout=120); return x.status
        except _ue.HTTPError as e:
            if e.code < 500 or t == 3: return e.code
        except (_ue.URLError, ConnectionError, TimeoutError):
            if t == 3: return 0
        _time.sleep(3 * (t + 1))
def _attached(cid):
    d = api(f"get_attachments_for_case/{cid}"); d = d.get("attachments", d) if isinstance(d, dict) else d
    return {x["name"] for x in d}
IDS = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
for k, v in PROP.items():
    if k not in IDS: continue
    want = sorted(set(_re.findall(r"[A-Za-z0-9_.-]+\.png", v["fields"]["custom_preconds"] + v["fields"]["custom_expected"])))
    if not want: continue
    have = _attached(IDS[k])
    for n in want:
        if n in have: continue
        path = next((f"{d}/{n}" for d in PIC_DIRS if os.path.exists(f"{d}/{n}")), None)
        st = _upload(IDS[k], n, path) if path else "no file"
        L({"op": "add_attachment", "key": k, "case": f"C{IDS[k]}", "name": n, "http": st})
    miss = [n for n in want if n not in _attached(IDS[k])]
    L({"op": "readback_attachments", "key": k, "case": f"C{IDS[k]}", "want": len(want), "missing": miss})
print("written; see", f"{OUT}/apply-log.jsonl")
