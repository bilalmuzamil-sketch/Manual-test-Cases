#!/usr/bin/env python3
"""DRAFT, NOT RUN (14 Nov 2026). Adds ONLY the 34 Bill To layout stress cases (authoring/cases_stress_2026_11_14.py: D-71..D-103 and
S19-09) to TestRail and run 558, once the QA lead has said yes (Rule 6). Mirrors authoring/create.py, authoring/make_run.py and the A/R
suite's demo-day-2026-11-13/create_demo_day.py.

  1. tester-readiness check first (Rule 138); refuses on failure (it runs on the dry run too, so its result is always seen)
  2. each target section (DESIGN 133514 "Design — how it looks", S19 133509 "IBS and invoice export") must hold only cases in our
     testrail-id-map.csv (Rules 38, 123); refuses otherwise
  3. add_case for each key not yet in testrail-id-map.csv (resumable), read back field by field, map appended with the PRD version
  4. attach each case's design pictures (the names under "Design pictures attached to this case", from design-2026-11-09/images/),
     idempotent, read back by name
  5. run 558 "Bill To - Execution": UNION ONLY (Rule 34) - the run's current case list (paged) plus the new C-ids that are not held;
     the 3 held cases (D-101 on question 16, D-102 and D-103 on question 17) stay out; refuses if the run is completed
  6. the new tests are assigned to Mudassir (user 6) with add_results_for_cases carrying assignedto_id only (no status), read back
Every operation is logged with C-id, HTTP status and read-back (Rule 50) in layout-stress-2026-11-14/applied/create-log.jsonl.
No case here is NO_MANUAL: every one can be set up by hand (D-93 uses the QuickBooks Online sandbox company, as Story 17's cases do).
Folders: design cases stay in "Design — how it looks", held ones included (QA lead, 10 Nov 2026); S19-09 goes to its story section.
Dry run unless --apply.   python3 create_layout_stress.py [--apply]"""
import sys, os, json, csv, re, base64, uuid, time, urllib.request, urllib.error
HERE = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(HERE); D = f"{P}/authoring"
sys.path.insert(0, f"{P}/../../testing-tools"); import tester_readiness_check as TRC
APPLY = "--apply" in sys.argv
KEYS = [f"D-{n}" for n in range(71, 104)] + ["S19-09"]
HELD = {"D-101": 16, "D-102": 17, "D-103": 17}          # waiting on the PO (question n); not for the run
RUN, ASSIGN = 558, 6
PROP = json.load(open(f"{D}/proposals.json")); SECS = json.load(open(f"{P}/sections.json"))["sections"]
MAP = f"{P}/testrail-id-map.csv"; IMG = f"{P}/design-2026-11-09/images"
def ids(): return {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(MAP))}
def pictures(k):
    h = PROP[k]["fields"]["custom_expected"].split("Design pictures attached to this case:")
    return re.findall(r"<li>(bt-p\d-\d\d-[\w-]+\.png)</li>", h[1].split("</ul>")[0]) if len(h) > 1 else []
for k in KEYS:
    assert k in PROP, f"{k} missing from proposals.json: run authoring/build.py first"
    v = PROP[k]; f = v["fields"]
    assert v["held"] == (k in HELD), (k, "held flag differs from HELD")
    if k in HELD: assert f["custom_expected"].endswith(f"waiting on the PO (question {HELD[k]})</p>"), k
    assert SECS[v["sec"]].get("id") == v["section_id"] and v["section_id"], k
    assert len(f["refs"]) < 250 and len(f["title"]) <= 80, k
    for n in pictures(k): assert os.path.exists(f"{IMG}/{n}"), (k, n)
have = ids(); todo = [k for k in KEYS if k not in have]
print("PLAN (dry run unless --apply)")
for s in sorted({PROP[k]["sec"] for k in KEYS}):
    ks = [k for k in todo if PROP[k]["sec"] == s]
    print(f"  {s:7} section {SECS[s]['id']} {SECS[s]['name'][:40]:40} add {len(ks):3} | held {sum(k in HELD for k in ks)} | for run {RUN}: {sum(k not in HELD for k in ks)}")
print(f"  already mapped: {[k for k in KEYS if k in have]} | pictures to attach: {sum(len(pictures(k)) for k in todo)} "
      f"({len({n for k in todo for n in pictures(k)})} distinct files)")
TRC.require(P)          # Rule 138
if not APPLY:
    print("dry run: nothing written (add --apply, with the QA lead's go-ahead)"); sys.exit(0)

sys.path.insert(0, f"{P}/../../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
os.makedirs(f"{HERE}/applied", exist_ok=True)
logf = open(f"{HERE}/applied/create-log.jsonl", "a"); bad = 0
def log(x): logf.write(json.dumps(x, ensure_ascii=False) + "\n"); logf.flush()

# 2. foreign-case guard on each target section
def section_cases(sid):
    out, off = [], 0
    while True:
        r = api(f"get_cases/1&section_id={sid}&limit=250&offset={off}"); c = r["cases"] if isinstance(r, dict) else r; out += c
        if len(c) < 250: return out
        off += 250
ours = set(ids().values())
for s in sorted({PROP[k]["sec"] for k in KEYS}):
    foreign = [c["id"] for c in section_cases(SECS[s]["id"]) if c["id"] not in ours]
    log({"op": "section_guard", "section": SECS[s]["id"], "foreign": foreign})
    if foreign: sys.exit(f"REFUSED: section {SECS[s]['id']} holds cases not in our map {foreign}; ask the QA lead (Rules 38, 123)")

# 3. add the cases
for k in todo:
    v = PROP[k]; f = v["fields"]; sid = v["section_id"]
    n = api(f"add_case/{sid}", f); st = LAST["status"]; cid = n["id"]
    a = api(f"get_case/{cid}")
    diff = [x for x, y in f.items() if x != "refs" and a.get(x) != y] + (["refs"] if (a.get("refs") or "").replace(" ", "") != f["refs"].replace(" ", "") else [])
    if a["section_id"] != sid: diff.append("section")
    bad += bool(diff)
    json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    log({"op": "add_case", "key": k, "case": f"C{cid}", "http": st, "readback_ok": not diff, "bad": diff})
    with open(MAP, "a", newline="") as mf:
        csv.writer(mf).writerow([k, cid, v["sec"], f["title"], f"https://shopview.testrail.io/index.php?/cases/view/{cid}", v["prd_version"]])
ID = ids()

# 4. pictures, idempotent, read back by name
C_ = json.load(open("/tmp/testrail/creds.json")); AUTH = base64.b64encode(f"{C_.get('email') or C_.get('user')}:{C_['password']}".encode()).decode()
def upload(cid, name):
    b = uuid.uuid4().hex
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"attachment\"; filename=\"{name}\"\r\nContent-Type: image/png\r\n\r\n").encode() \
        + open(f"{IMG}/{name}", "rb").read() + f"\r\n--{b}--\r\n".encode()
    r = urllib.request.Request(f"https://shopview.testrail.io/index.php?/api/v2/add_attachment_to_case/{cid}", data=body,
                               headers={"Authorization": "Basic " + AUTH, "Content-Type": f"multipart/form-data; boundary={b}"})
    for a in range(6):
        try:
            x = urllib.request.urlopen(r, timeout=120); return x.status, json.load(x)
        except urllib.error.HTTPError as e:
            if e.code == 429 and a < 5: time.sleep(25); continue
            if e.code < 500 or a == 5: return e.code, {"error": e.read()[:300].decode("utf-8", "replace")}
        except (urllib.error.URLError, ConnectionError, TimeoutError) as e:
            if a == 5: return 0, {"error": str(e)[:200]}
        time.sleep(3 * (a + 1))
def names(cid):
    d = api(f"get_attachments_for_case/{cid}"); d = d.get("attachments", d) if isinstance(d, dict) else d
    return {a.get("name") or a.get("filename") for a in d}
for k in KEYS:
    cid = ID[k]; want = pictures(k)
    for n in want:
        if n in names(cid): log({"op": "skipped_already_attached", "key": k, "case": f"C{cid}", "file": n}); continue
        http, res = upload(cid, n)
        log({"op": "add_attachment_to_case", "key": k, "case": f"C{cid}", "file": n, "http": http, "error": res.get("error")})
    ok = set(want) <= names(cid); bad += not ok
    log({"op": "readback_attachments", "key": k, "case": f"C{cid}", "expected": want, "ok": ok})

# 5. run 558, union only (paged: an unpaged read stops at 250 and would cut the run)
run = api(f"get_run/{RUN}")
if run.get("is_completed"): sys.exit(f"REFUSED: run {RUN} is completed; ask the QA lead")
def tests():
    out, off = [], 0
    while True:
        t = api(f"get_tests/{RUN}&limit=250&offset={off}"); t = t["tests"] if isinstance(t, dict) else t; out += t
        if len(t) < 250: return out
        off += 250
before = tests(); cur = sorted({t["case_id"] for t in before})
json.dump(before, open(f"{HERE}/applied/run558-tests-before.json", "w"), indent=1)
add = [ID[k] for k in KEYS if k not in HELD]
union = sorted(set(cur) | set(add))
api(f"update_run/{RUN}", {"include_all": False, "case_ids": union}); http = LAST["status"]
after = sorted({t["case_id"] for t in tests()})
ok = after == union and set(cur) <= set(after); bad += not ok
log({"op": "update_run", "run": RUN, "http": http, "before": len(cur), "added": len(union) - len(cur), "after": len(after), "match": ok})

# 6. assign the new tests to Mudassir (user 6), no status
new_ids = [c for c in add if c not in cur]
if new_ids:
    api(f"add_results_for_cases/{RUN}", {"results": [{"case_id": c, "assignedto_id": ASSIGN} for c in new_ids]}); http = LAST["status"]
    who = {t["case_id"]: t.get("assignedto_id") for t in tests()}
    wrong = [c for c in new_ids if who.get(c) != ASSIGN]; bad += bool(wrong)
    log({"op": "add_results_for_cases (assign only)", "run": RUN, "http": http, "cases": [f"C{c}" for c in new_ids], "assigned_to": ASSIGN,
         "readback_ok": not wrong, "wrong": [f"C{c}" for c in wrong]})
rec = {"run": RUN, "before": len(cur), "after": len(after), "union_match": ok, "held_out": {k: f"C{ID[k]}" for k in HELD},
       "link": f"https://shopview.testrail.io/index.php?/runs/view/{RUN}", "problems": bad}
json.dump(rec, open(f"{HERE}/applied/run558-sync.json", "w"), indent=1); print(rec)
