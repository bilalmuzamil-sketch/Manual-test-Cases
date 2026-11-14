#!/usr/bin/env python3
"""DRAFT, NOT RUN (14 Nov 2026). Creates the cases of the Story 8 named set that are not yet in TestRail: the new S8-16 to S8-20 and the
layout stress cases D-82, D-83 and D-84 (held back on 14 Nov 2026 for this rewrite). Mirrors layout-stress-2026-11-14/create_layout_stress.py:
  1. tester-readiness check first (Rule 138)
  2. foreign-case guard on each target section (S8 133498, DESIGN 133514): refuses if a case there is not in our map (Rules 38, 123)
  3. add_case, read back field by field, map appended with prd_version "0.5 (edited 14 Nov 2026)"
  4. pictures (the redrawn page 4 pictures named under References from Design), idempotent, read back by name
  5. run 558: UNION ONLY (Rule 34, paged read); none of these 8 is held, so all join; refuses if the run is completed
  6. new tests assigned to Mudassir (user 6) with assign-only results, read back
Log: story8-2026-11-14/applied/create-log.jsonl.  Dry run unless --apply.   python3 create_story8.py [--apply]"""
import sys, os, json, csv, re, base64, uuid, time, urllib.request, urllib.error
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(H); D = f"{P}/authoring"
sys.path.insert(0, f"{P}/../../testing-tools"); import tester_readiness_check as TRC
APPLY = "--apply" in sys.argv
KEYS = ["S8-16", "S8-17", "S8-18", "S8-19", "S8-20", "D-82", "D-83", "D-84"]
RUN, ASSIGN = 558, 6
PROP = json.load(open(f"{D}/proposals.json")); SECS = json.load(open(f"{P}/sections.json"))["sections"]
MAP = f"{P}/testrail-id-map.csv"; IMG = f"{P}/design-2026-11-09/images"
def ids(): return {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(MAP))}
def pictures(k):
    h = PROP[k]["fields"]["custom_expected"].split("Design pictures attached to this case:")
    return re.findall(r"<li>(bt-p\d-\d\d-[\w-]+\.png)</li>", h[1].split("</ul>")[0]) if len(h) > 1 else []
for k in KEYS:
    v = PROP[k]; f = v["fields"]
    assert not v["held"] and v["prd_version"] == "0.5 (edited 14 Nov 2026)", k
    assert v["section_id"] == SECS[v["sec"]]["id"] and len(f["title"]) <= 80 and len(f["refs"]) < 250, k
    for n in pictures(k): assert os.path.exists(f"{IMG}/{n}") and (not n.startswith("bt-p4-") or n.endswith("-2026-11-14.png")), (k, n)
have = ids(); todo = [k for k in KEYS if k not in have]
print("PLAN (dry run unless --apply):", {s: [k for k in todo if PROP[k]["sec"] == s] for s in sorted({PROP[k]["sec"] for k in KEYS})},
      "| already mapped:", [k for k in KEYS if k in have], "| pictures:", sum(len(pictures(k)) for k in todo))
TRC.require(P)
if not APPLY:
    print("dry run: nothing written (add --apply, with the QA lead's go-ahead)"); sys.exit(0)
sys.path.insert(0, f"{P}/../../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
os.makedirs(f"{H}/applied", exist_ok=True)
logf = open(f"{H}/applied/create-log.jsonl", "a"); bad = 0
def log(x): logf.write(json.dumps(x, ensure_ascii=False) + "\n"); logf.flush()
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
    if foreign: sys.exit(f"REFUSED: section {SECS[s]['id']} holds cases not in our map {foreign}; ask the QA lead")
for k in todo:
    v = PROP[k]; f = v["fields"]; sid = v["section_id"]
    n = api(f"add_case/{sid}", f); st = LAST["status"]; cid = n["id"]; a = api(f"get_case/{cid}")
    diff = [x for x, y in f.items() if x != "refs" and a.get(x) != y] + (["refs"] if (a.get("refs") or "").replace(" ", "") != f["refs"].replace(" ", "") else [])
    if a["section_id"] != sid: diff.append("section")
    bad += bool(diff); json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    log({"op": "add_case", "key": k, "case": f"C{cid}", "http": st, "readback_ok": not diff, "bad": diff})
    with open(MAP, "a", newline="") as mf:
        csv.writer(mf).writerow([k, cid, v["sec"], f["title"], f"https://shopview.testrail.io/index.php?/cases/view/{cid}", v["prd_version"]])
ID = ids()
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
        if n in names(cid): continue
        hs, res = upload(cid, n); log({"op": "add_attachment_to_case", "key": k, "case": f"C{cid}", "file": n, "http": hs, "error": res.get("error")})
    ok = set(want) <= names(cid); bad += not ok; log({"op": "readback_attachments", "key": k, "case": f"C{cid}", "expected": want, "ok": ok})
run = api(f"get_run/{RUN}")
if run.get("is_completed"): sys.exit(f"REFUSED: run {RUN} is completed")
def tests():
    out, off = [], 0
    while True:
        t = api(f"get_tests/{RUN}&limit=250&offset={off}"); t = t["tests"] if isinstance(t, dict) else t; out += t
        if len(t) < 250: return out
        off += 250
before = tests(); cur = sorted({t["case_id"] for t in before}); json.dump(before, open(f"{H}/applied/run558-tests-before.json", "w"), indent=1)
add = [ID[k] for k in KEYS]; union = sorted(set(cur) | set(add))
api(f"update_run/{RUN}", {"include_all": False, "case_ids": union}); http = LAST["status"]
after = sorted({t["case_id"] for t in tests()}); ok = after == union and set(cur) <= set(after); bad += not ok
log({"op": "update_run", "run": RUN, "http": http, "before": len(cur), "after": len(after), "match": ok})
new_ids = [c for c in add if c not in cur]
if new_ids:
    api(f"add_results_for_cases/{RUN}", {"results": [{"case_id": c, "assignedto_id": ASSIGN} for c in new_ids]}); http = LAST["status"]
    who = {t["case_id"]: t.get("assignedto_id") for t in tests()}; wrong = [c for c in new_ids if who.get(c) != ASSIGN]; bad += bool(wrong)
    log({"op": "add_results_for_cases (assign only)", "run": RUN, "http": http, "cases": [f"C{c}" for c in new_ids], "readback_ok": not wrong})
print({"run": RUN, "before": len(cur), "after": len(after), "union_match": ok, "problems": bad})
