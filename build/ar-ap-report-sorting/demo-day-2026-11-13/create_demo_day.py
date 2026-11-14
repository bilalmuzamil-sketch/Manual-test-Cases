#!/usr/bin/env python3
"""DRAFT, NOT RUN (13 Nov 2026). Adds ONLY the Demo Day cases D-82 to D-95 (authoring/cases_demo_2026_11_13.py) to TestRail and run 557,
once the QA lead has said yes (Rule 6). Mirrors currency-2026-11-10/write/create_v11.py, run557_sync.py and attach_reshot.py.

  1. tester-readiness check first (Rule 138); refuses on failure
  2. section 90430 ("Design — how it looks") must hold only cases in our map (Rule 38/123); refuses otherwise
  3. add_case for each key not yet in testrail-id-map.csv (resumable), custom_atmstatus 1, read back field by field, map appended
  4. attach each case's design pictures (the names its "Design pictures attached to this case" list gives), idempotent, read back by name
  5. run 557: UNION ONLY (Rule 34) - the run's current case list plus the new C-ids; held D-94 stays out; the 89 tests from cases someone
     else added stay exactly as they are; refuses if the run is completed
  6. the new tests are assigned to Mudassir (user 6) with add_results_for_cases carrying assignedto_id only (no status), read back
Every operation is logged with C-id, HTTP status and read-back (Rule 50) in demo-day-2026-11-13/applied/.
Folder: Design (90430) by default. With --setup-folder, the cases that create their own records (D-82 to D-89, D-95) go to "Setup needed
before testing" (133629, made 11-12 Nov 2026 outside our library), where D-01 to D-18 and D-31 now are; only on the QA lead's choice.
Dry run unless --apply.   python3 create_demo_day.py [--apply] [--setup-folder]"""
import sys, os, json, csv, re, html, base64, uuid, time, urllib.request, urllib.error
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"; HERE = f"{B}/demo-day-2026-11-13"
sys.path.insert(0, "/home/user/Manual-test-Cases/build/testing-tools")
sys.path.insert(0, "/home/user/Manual-test-Cases/build/dashboards/currency-2026-10-14/apply")
sys.path.insert(0, f"{B}/authoring")
APPLY = "--apply" in sys.argv
KEYS = [f"D-{n}" for n in range(82, 96)]
HELD = {}   # 14 Nov 2026: D-94 tied to SV-12763 on the QA lead's choice; nothing held
RUN, ASSIGN, SECTION = 557, 6, 90430
SETUP_FOLDER = 133629
SETUP_KEYS = list(KEYS)   # 14 Nov 2026, QA lead: all 14 go to "Setup needed before testing" (133629)
def target(k): return SETUP_FOLDER if ("--setup-folder" in sys.argv and k in SETUP_KEYS) else SECTION
PROP = json.load(open(f"{B}/authoring/proposals.json"))
MAP = f"{B}/testrail-id-map.csv"
def ids(): return {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(MAP))}
def pictures(k):
    h = PROP[k]["fields"]["custom_expected"].split("Design pictures attached to this case:")
    return re.findall(r"<li>([^<:]+\.png):", h[1].split("</ul>")[0]) if len(h) > 1 else []
for k in KEYS:
    assert k in PROP, f"{k} missing from proposals.json: run authoring/build.py first"
    f = PROP[k]["fields"]; assert f["custom_atmstatus"] == 1 and PROP[k]["section_id"] == SECTION, k
    assert len(f["refs"]) < 250 and len(f["title"]) <= 80, k
import design_data as DD
for k in KEYS:
    for n in pictures(k): assert n in DD.PIC_FILE and os.path.exists(DD.PIC_FILE[n]), (k, n)
ID = ids(); todo = [k for k in KEYS if k not in ID]
print("Demo Day cases", len(KEYS), "| to add", len(todo), "| already added", len(KEYS) - len(todo))
for k in KEYS: print(f"  {k} -> section {target(k)}: {PROP[k]['fields']['title']}  | pictures {pictures(k)}" + (f"  | HELD: {HELD[k]}" if k in HELD else ""))
print(f"run {RUN}: will add {len([k for k in KEYS if k not in HELD])} tests (union only), assigned to user {ASSIGN}; held out: {list(HELD)}")
if not APPLY: print("DRY RUN: nothing written."); sys.exit(0)

import tester_readiness_check as T
T.require(B)                                                     # Rule 138: refuses to write when the check fails
from trlib import api, LAST
os.makedirs(f"{HERE}/applied", exist_ok=True)
LOG = open(f"{HERE}/applied/create-demo-day-log.jsonl", "a")
def log(d): LOG.write(json.dumps(d) + "\n"); LOG.flush()
def same(field, a, b):
    if field == "refs": return (a or "").replace(" ", "") == (b or "").replace(" ", "")
    return (a if a is not None else "") == (b if b is not None else "")

# 2. each target section holds only our cases
for sec in sorted({target(k) for k in todo}):
    got, off = [], 0
    while True:
        r = api(f"get_cases/1&suite_id=1&section_id={sec}&limit=250&offset={off}"); cs = r["cases"] if isinstance(r, dict) else r
        got += [c for c in cs if c["section_id"] == sec]
        if not (isinstance(r, dict) and r.get("_links", {}).get("next")): break
        off += 250
    extra = [c["id"] for c in got if c["id"] not in set(ID.values())]
    if extra: sys.exit(f"REFUSED: section {sec} holds cases not in our map {extra}; ask the QA lead (Rule 123)")

# 3. add the cases
bad = 0
for k in todo:
    v = PROP[k]; f = v["fields"]
    sec = target(k); n = api(f"add_case/{sec}", f); http = LAST["status"]; cid = n["id"]
    a = api(f"get_case/{cid}")
    wrong = [x for x in f if not same(x, a.get(x), f[x])] + (["section"] if a["section_id"] != sec else [])
    bad += bool(wrong)
    json.dump(a, open(f"{HERE}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    log({"op": "add_case", "key": k, "case": f"C{cid}", "section": sec, "http": http, "readback_ok": not wrong, "wrong": wrong})
    with open(MAP, "a", newline="") as mf:
        csv.writer(mf).writerow([k, cid, v["sec"], f["title"], f"https://shopview.testrail.io/index.php?/cases/view/{cid}"])
ID = ids()

# 4. the design pictures
C_ = json.load(open("/tmp/testrail/creds.json")); AUTH = base64.b64encode(f"{C_.get('email') or C_.get('user')}:{C_['password']}".encode()).decode()
HOST = (C_.get("host") or "https://shopview.testrail.io").rstrip("/")
def upload(cid, name):
    b = uuid.uuid4().hex
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"attachment\"; filename=\"{name}\"\r\nContent-Type: image/png\r\n\r\n").encode() \
           + open(DD.PIC_FILE[name], "rb").read() + f"\r\n--{b}--\r\n".encode()
    r = urllib.request.Request(f"{HOST}/index.php?/api/v2/add_attachment_to_case/{cid}", data=body,
                               headers={"Authorization": "Basic " + AUTH, "Content-Type": f"multipart/form-data; boundary={b}"})
    for t in range(4):
        try:
            x = urllib.request.urlopen(r, timeout=120); return x.status, json.load(x)
        except urllib.error.HTTPError as e:
            if e.code < 500 or t == 3: return e.code, {"error": e.read()[:300].decode("utf-8", "replace")}
        except (urllib.error.URLError, ConnectionError, TimeoutError) as e:
            if t == 3: return 0, {"error": str(e)[:200]}
        time.sleep(3 * (t + 1))
def names(cid):
    d = api(f"get_attachments_for_case/{cid}"); d = d.get("attachments", d) if isinstance(d, dict) else d
    return {a.get("name") or a.get("filename") for a in d}
for k in KEYS:
    cid = ID[k]
    for n in pictures(k):
        if n in names(cid): log({"op": "skipped_already_attached", "key": k, "case": f"C{cid}", "file": n}); continue
        http, res = upload(cid, n); ok = n in names(cid); bad += not ok
        log({"op": "add_attachment_to_case", "key": k, "case": f"C{cid}", "file": n, "http": http,
             "attachment_id": res.get("attachment_id"), "error": res.get("error"), "readback_by_name": ok})

# 5. run 557, union only
run = api(f"get_run/{RUN}")
if run.get("is_completed"): sys.exit(f"REFUSED: run {RUN} is completed; ask the QA lead")
def tests():
    out, off = [], 0
    while True:
        t = api(f"get_tests/{RUN}&limit=250&offset={off}"); t = t["tests"] if isinstance(t, dict) else t; out += t
        if len(t) < 250: break
        off += 250
    return out
before = tests(); cur = sorted({t["case_id"] for t in before})
json.dump(before, open(f"{HERE}/applied/run557-tests-before.json", "w"), indent=1)
add = [ID[k] for k in KEYS if k not in HELD]
union = sorted(set(cur) | set(add))
api(f"update_run/{RUN}", {"include_all": False, "case_ids": union}); http = LAST["status"]
after_t = tests(); after = sorted({t["case_id"] for t in after_t})
ok = after == union and set(cur) <= set(after)
log({"op": "update_run", "run": RUN, "http": http, "before": len(cur), "added": len(union) - len(cur), "after": len(after), "match": ok})

# 6. assign the new tests to Mudassir (no status)
new_ids = [c for c in add if c not in cur]
if new_ids:
    api(f"add_results_for_cases/{RUN}", {"results": [{"case_id": c, "assignedto_id": ASSIGN} for c in new_ids]}); http = LAST["status"]
    who = {t["case_id"]: t.get("assignedto_id") for t in tests()}
    wrong = [c for c in new_ids if who.get(c) != ASSIGN]; bad += bool(wrong)
    log({"op": "add_results_for_cases (assign only)", "run": RUN, "http": http, "cases": [f"C{c}" for c in new_ids], "assigned_to": ASSIGN,
         "readback_ok": not wrong, "wrong": [f"C{c}" for c in wrong]})
rec = {"run": RUN, "before": len(cur), "after": len(after), "union_match": ok, "held_out": {k: f"C{ID[k]}" for k in HELD if k in ID},
       "link": f"https://shopview.testrail.io/index.php?/runs/view/{RUN}", "problems": bad}
json.dump(rec, open(f"{HERE}/applied/run557-sync-demo-day.json", "w"), indent=1); print(rec)
