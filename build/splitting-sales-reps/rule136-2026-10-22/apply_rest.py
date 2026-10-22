#!/usr/bin/env python3
"""22 Oct 2026, Rule 136 pass (QA lead "Yes, record and apply"), after apply4.py has written the library cases:
(1) design-recheck cases from DR-PROPOSALS.json (edit lock, read back); (2) the design pictures of every case that lists them (new split
parts included), uploaded only when missing; (3) run 547: union with every C-id in testrail-id-map.csv except held ones."""
import sys, os, json, csv, base64, uuid, time, urllib.request, urllib.error, importlib
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D); A = f"{P}/design-recheck-2026-10-20/applied"
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
sys.path.insert(0, f"{P}/authoring"); import ssr_lib
for m in ["cases_s1_s2", "cases_s3_s4", "cases_s5_s8", "cases_tp", "cases_rs", "cases_rel", "cases_design"]: importlib.import_module(m)
PNG = f"{P}/design-drive-2026-10-19/unpacked/png"
log = open(f"{D}/apply-rest-log.jsonl", "a"); bad = 0
def L(r): log.write(json.dumps(r, ensure_ascii=False) + "\n"); log.flush()
# (1) design-recheck cases
for cid, v in json.load(open(f"{D}/DR-PROPOSALS.json")).items():
    if not isinstance(v, dict) or not v.get("custom_steps"): continue
    cid = int(cid); prev = json.load(open(f"{A}/C{cid}-after.json")); live = api(f"get_case/{cid}")
    if live["updated_on"] != prev["updated_on"]: L({"op": "refused_edit_lock", "case": cid}); bad += 1; continue
    json.dump(live, open(f"{D}/C{cid}-before.json", "w"), indent=1, ensure_ascii=False)
    f = {k: v[k] for k in ("title", "custom_preconds", "custom_steps", "custom_expected") if k in v}
    api(f"update_case/{cid}", f); st = LAST["status"]; a = api(f"get_case/{cid}"); b = [k for k in f if a.get(k) != f[k]]; bad += bool(b)
    json.dump(a, open(f"{A}/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    L({"op": "update_case", "case": f"C{cid}", "http": st, "readback_ok": not b})
# (2) pictures
C_ = json.load(open("/tmp/testrail/creds.json")); AUTH = base64.b64encode(f"{C_.get('email') or C_.get('user')}:{C_['password']}".encode()).decode()
def upload(cid, path):
    b = uuid.uuid4().hex; name = os.path.basename(path)
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"attachment\"; filename=\"{name}\"\r\nContent-Type: image/png\r\n\r\n").encode() + open(path, "rb").read() + f"\r\n--{b}--\r\n".encode()
    r = urllib.request.Request(f"https://shopview.testrail.io/index.php?/api/v2/add_attachment_to_case/{cid}", data=body, headers={"Authorization": "Basic " + AUTH, "Content-Type": f"multipart/form-data; boundary={b}"})
    for a in range(4):
        try: x = urllib.request.urlopen(r, timeout=120); return x.status
        except urllib.error.HTTPError as e:
            if e.code < 500 or a == 3: return e.code
        except (urllib.error.URLError, ConnectionError, TimeoutError):
            if a == 3: return 0
        time.sleep(3 * (a + 1))
def attached(cid):
    d = api(f"get_attachments_for_case/{cid}"); d = d.get("attachments", d) if isinstance(d, dict) else d
    return {a.get("name") or a.get("filename") for a in d}
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
for c in ssr_lib.CASES:
    if not c["pictures"]: continue
    cid = ids[c["key"]]; have = attached(cid)
    for pic in c["pictures"]:
        if pic not in have: L({"op": "add_attachment_to_case", "case": f"C{cid}", "file": pic, "http": upload(cid, os.path.join(PNG, pic))})
    ok = set(c["pictures"]) <= attached(cid); bad += not ok; L({"op": "readback_attachments", "key": c["key"], "case": f"C{cid}", "ok": ok})
# (3) run 547
def tests(run):
    out, off = [], 0
    while True:
        r = api(f"get_tests/{run}&limit=250&offset={off}"); t = r["tests"] if isinstance(r, dict) else r; out += t
        if len(t) < 250: return out
        off += 250
b4 = tests(547); json.dump(b4, open(f"{D}/run547-tests-before.json", "w"))
held = {c["key"] for c in ssr_lib.CASES if "waiting on the PO" in ssr_lib.render(c)["custom_expected"]}
want = {t["case_id"] for t in b4} | {v for k, v in ids.items() if k not in held}
api("update_run/547", {"include_all": False, "case_ids": sorted(want)}); st = LAST["status"]
af = tests(547); lost = {t["case_id"] for t in b4} - {t["case_id"] for t in af}; bad += bool(lost)
L({"op": "update_run", "run": 547, "http": st, "before": len(b4), "after": len(af), "lost": sorted(lost), "held_out": sorted(held)})
print("run 547", len(b4), "->", len(af), "lost", lost, "held", held, "| problems:", bad)
