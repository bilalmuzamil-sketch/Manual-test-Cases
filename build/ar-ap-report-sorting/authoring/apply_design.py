#!/usr/bin/env python3
"""22 Oct 2026, QA lead chose "Full pass now" on the A/R and A/P design (design-2026-10-22/). Updates every existing case whose fields
differ from our last read-back (edit lock on updated_on), adds the new cases (D-50 to D-81), uploads each case's design pictures under
their readable names (idempotent), reads everything back, appends testrail-id-map.csv, and adds the new non-held cases to run 549
(union only). python3 apply_design.py [--apply]"""
import sys, os, json, csv, re, base64, uuid, time, urllib.request, urllib.error
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
sys.path.insert(0, D); import design_data as DD
PROP = json.load(open(f"{D}/proposals.json")); MAP = f"{P}/testrail-id-map.csv"
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(MAP))}
HOLD = "AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO"
TAG = "rule136-2026-10-22"  # was design-2026-10-22 for the design pass
RELEASED = ["S1-07"]  # released from hold by the tech plan pass (plan D4)
PICRE = re.compile(r"ar-ap-p\d-[a-z0-9-]+\.png")
def pics(f): return sorted(set(PICRE.findall(f["custom_preconds"] + f["custom_expected"])))
def same(prev, f):
    return [x for x, y in f.items() if (((prev.get(x) or "").replace(" ", "") != y.replace(" ", "")) if x == "refs" else prev.get(x) != y)]
upd = [(k, ids[k], v["fields"]) for k, v in PROP.items() if k in ids and same(json.load(open(f"{P}/applied/C{ids[k]}-after.json")), v["fields"])]
add = [k for k in PROP if k not in ids]
npics = sum(len(pics(v["fields"])) for v in PROP.values())
unknown = {p for v in PROP.values() for p in pics(v["fields"])} - set(DD.PIC_FILE)
print("update", len(upd), "add", len(add), "picture links", npics, "unknown pictures", unknown)
if "--apply" not in sys.argv or unknown: sys.exit(0)
C_ = json.load(open("/tmp/testrail/creds.json")); AUTH = base64.b64encode(f"{C_.get('email') or C_.get('user')}:{C_['password']}".encode()).decode()
def upload(cid, name, path):
    b = uuid.uuid4().hex
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"attachment\"; filename=\"{name}\"\r\nContent-Type: image/png\r\n\r\n").encode() + open(path, "rb").read() + f"\r\n--{b}--\r\n".encode()
    r = urllib.request.Request(f"https://shopview.testrail.io/index.php?/api/v2/add_attachment_to_case/{cid}", data=body,
                               headers={"Authorization": "Basic " + AUTH, "Content-Type": f"multipart/form-data; boundary={b}"})
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
os.makedirs(f"{P}/applied/before-{TAG}", exist_ok=True)
log = open(f"{P}/applied/{TAG}-log.jsonl", "a"); bad = 0
def L(r): log.write(json.dumps(r, ensure_ascii=False) + "\n"); log.flush()
for k, cid, f in upd:
    prev = json.load(open(f"{P}/applied/C{cid}-after.json")); live = api(f"get_case/{cid}")
    if live["updated_on"] != prev["updated_on"]: L({"op": "refused_edit_lock", "case": f"C{cid}"}); bad += 1; continue
    json.dump(live, open(f"{P}/applied/before-{TAG}/C{cid}-before.json", "w"), indent=1, ensure_ascii=False)
    diff = same(prev, f); api(f"update_case/{cid}", {x: f[x] for x in diff}); st = LAST["status"]; a = api(f"get_case/{cid}")
    b = same(a, f); bad += bool(b)
    json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    L({"op": "update_case", "key": k, "case": f"C{cid}", "http": st, "fields": diff, "readback_ok": not b})
for k in add:
    v = PROP[k]; f = v["fields"]; n = api(f"add_case/{v['section_id']}", f); st = LAST["status"]; cid = n["id"]; ids[k] = cid
    a = api(f"get_case/{cid}"); b = same(a, f) + (["section"] if a["section_id"] != v["section_id"] else []); bad += bool(b)
    json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    L({"op": "add_case", "key": k, "case": f"C{cid}", "http": st, "readback_ok": not b})
    with open(MAP, "a", newline="") as mf: csv.writer(mf).writerow([k, cid, v["sec"], f["title"], f"https://shopview.testrail.io/index.php?/cases/view/{cid}"])
for k, v in PROP.items():
    want = pics(v["fields"])
    if not want: continue
    cid = ids[k]; have = attached(cid)
    for name in want:
        if name in have: continue
        hs, res = upload(cid, name, DD.PIC_FILE[name]); L({"op": "add_attachment_to_case", "case": f"C{cid}", "file": name, "http": hs, "error": res.get("error")})
    have = attached(cid); ok = set(want) <= have; bad += not ok
    L({"op": "readback_attachments", "key": k, "case": f"C{cid}", "expected": want, "ok": ok})
def tests(run):
    out, off = [], 0
    while True:
        r = api(f"get_tests/{run}&limit=250&offset={off}"); t = r["tests"] if isinstance(r, dict) else r; out += t
        if len(t) < 250: return out
        off += 250
b4 = tests(549); json.dump(b4, open(f"{P}/applied/run549-tests-before-design.json", "w"))
PO_HOLD = "AUTOMATION: HOLD - waiting on the PO"
new_run = [ids[k] for k in add if HOLD not in PROP[k]["fields"]["custom_expected"] and PO_HOLD not in PROP[k]["fields"]["custom_expected"]]
new_run += [ids[k] for k in RELEASED]
api("update_run/549", {"include_all": False, "case_ids": sorted({t["case_id"] for t in b4} | set(new_run))}); st = LAST["status"]
af = tests(549); lost = {t["case_id"] for t in b4} - {t["case_id"] for t in af}; bad += bool(lost) or not set(new_run) <= {t["case_id"] for t in af}
L({"op": "update_run", "run": 549, "http": st, "before": len(b4), "after": len(af), "added": new_run, "lost": sorted(lost)})
print("run 549", len(b4), "->", len(af), "lost", lost, "| problems:", bad)
