#!/usr/bin/env python3
"""19 Oct 2026, QA lead: "I see that no design related test case had references from design WHY?" — bring the suite to the WO Board
design-case standard: design pictures attached and named, the design's own board titles and notes quoted, the story's design page
cited in every Source. Updates our 113 cases (edit lock: unchanged since our create), adds the new design cases, attaches every
picture (idempotent), reads everything back, rewrites testrail-id-map.csv.  python3 apply2.py [--apply]"""
import sys, os, json, csv, base64, uuid, urllib.request, urllib.error, time
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
sys.path.insert(0, D)
import ssr_lib, importlib
for m in ["cases_s1_s2", "cases_s3_s4", "cases_s5_s8", "cases_tp", "cases_rs", "cases_rel", "cases_design"]: importlib.import_module(m)
PNG = f"{P}/design-drive-2026-10-19/unpacked/png"
SEC = json.load(open(f"{P}/applied/sections.json"))
MAP = f"{P}/testrail-id-map.csv"
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(MAP))}
C_ = json.load(open("/tmp/testrail/creds.json")); AUTH = base64.b64encode(f"{C_.get('email') or C_.get('user')}:{C_['password']}".encode()).decode()
BASE = "https://shopview.testrail.io/index.php?/api/v2/"
def upload(cid, path):
    b = uuid.uuid4().hex; name = os.path.basename(path)
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"attachment\"; filename=\"{name}\"\r\nContent-Type: image/png\r\n\r\n").encode() + open(path, "rb").read() + f"\r\n--{b}--\r\n".encode()
    r = urllib.request.Request(BASE + f"add_attachment_to_case/{cid}", data=body, headers={"Authorization": "Basic " + AUTH, "Content-Type": f"multipart/form-data; boundary={b}"})
    for a in range(4):
        try:
            x = urllib.request.urlopen(r, timeout=120); return x.status, json.load(x)
        except urllib.error.HTTPError as e:
            if e.code < 500 or a == 3: return e.code, {"error": e.read()[:300].decode("utf-8", "replace")}
        except (urllib.error.URLError, ConnectionError, TimeoutError) as e:
            if a == 3: return 0, {"error": str(e)[:200]}
        time.sleep(3 * (a + 1))
def attached(cid):
    d = api(f"get_attachments_for_case/{cid}"); d = d.get("attachments", d) if isinstance(d, dict) else d
    return {a.get("name") or a.get("filename") for a in d}
todo_upd = [c for c in ssr_lib.CASES if c["key"] in ids]; todo_add = [c for c in ssr_lib.CASES if c["key"] not in ids]
print("update", len(todo_upd), "add", len(todo_add), "pictures", sum(len(c["pictures"]) for c in ssr_lib.CASES))
if "--apply" not in sys.argv: sys.exit(0)
log = open(f"{P}/applied/apply2-log.jsonl", "a")
def L(r): log.write(json.dumps(r, ensure_ascii=False) + "\n"); log.flush()
bad = 0
for c in todo_upd:
    cid = ids[c["key"]]; f = ssr_lib.render(c)
    live = api(f"get_case/{cid}"); prev = json.load(open(f"{P}/applied/C{cid}-after.json"))
    if live["updated_on"] != prev["updated_on"]: L({"op": "refused_edit_lock", "case": f"C{cid}"}); bad += 1; continue
    if live["section_id"] != SEC[c["sec"]]: L({"op": "refused_section_mismatch", "case": f"C{cid}"}); bad += 1; continue
    api(f"update_case/{cid}", f); st = LAST["status"]; a = api(f"get_case/{cid}")
    ok = all(a.get(x) == v for x, v in f.items()); bad += not ok
    json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    L({"op": "update_case", "key": c["key"], "case": f"C{cid}", "http": st, "readback_ok": ok, "bad": [x for x, v in f.items() if a.get(x) != v]})
for c in todo_add:
    f = ssr_lib.render(c); n = api(f"add_case/{SEC[c['sec']]}", f); st = LAST["status"]; cid = n["id"]; ids[c["key"]] = cid
    a = api(f"get_case/{cid}"); ok = all(a.get(x) == v for x, v in f.items()) and a["section_id"] == SEC[c["sec"]]; bad += not ok
    json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    L({"op": "add_case", "key": c["key"], "case": f"C{cid}", "http": st, "readback_ok": ok})
for c in ssr_lib.CASES:
    if not c["pictures"]: continue
    cid = ids[c["key"]]; have = attached(cid)
    for pic in c["pictures"]:
        if pic in have: continue
        hs, res = upload(cid, os.path.join(PNG, pic))
        L({"op": "add_attachment_to_case", "case": f"C{cid}", "file": pic, "http": hs, "attachment_id": res.get("attachment_id"), "error": res.get("error")})
    have = attached(cid); ok = set(c["pictures"]) <= have; bad += not ok
    L({"op": "readback_attachments", "case": f"C{cid}", "expected": c["pictures"], "attached": sorted(have), "ok": ok})
with open(MAP, "w", newline="") as mf:
    w = csv.writer(mf); w.writerow(["key", "case_id", "section", "title", "link"])
    for c in ssr_lib.CASES:
        w.writerow([c["key"], ids[c["key"]], c["sec"], c["title"], f"https://shopview.testrail.io/index.php?/cases/view/{ids[c['key']]}"])
print("problems:", bad)
