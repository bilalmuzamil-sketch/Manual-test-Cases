#!/usr/bin/env python3
"""23 Oct 2026, QA lead: "Get Done with all the test cases creation" (Credit terms, group 91454). Adds every case in proposals.json that
has no C-id yet (resumable), reads each back, keeps applied/C<id>-after.json, appends testrail-id-map.csv, and uploads each case's
design pictures under their readable names (idempotent), with a read-back of the attachments. python3 create.py [--apply]"""
import sys, os, json, csv, re, base64, uuid, time, urllib.request, urllib.error
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
PROP = json.load(open(f"{D}/proposals.json")); MAP = f"{P}/testrail-id-map.csv"; IMG = f"{P}/design-2026-10-23/images"
os.makedirs(f"{P}/applied", exist_ok=True)
if not os.path.exists(MAP):
    with open(MAP, "w", newline="") as f: csv.writer(f).writerow(["key", "case_id", "section", "title", "link"])
PICRE = re.compile(r"ct-p\d+-[\w-]+\.png")
def pics(f): return sorted(set(PICRE.findall(f["custom_preconds"] + f["custom_expected"])))
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(MAP))}
todo = [k for k in PROP if k not in ids]
missing = {p for v in PROP.values() for p in pics(v["fields"]) if not os.path.exists(f"{IMG}/{p}")}
print("to add", len(todo), "already", len(ids), "picture links", sum(len(pics(v["fields"])) for v in PROP.values()), "missing pictures", missing)
if "--apply" not in sys.argv or missing: sys.exit(0)
for sec in sorted({v["section_id"] for v in PROP.values()}):  # the sections must hold only our cases from this pass
    r = api(f"get_cases/1&section_id={sec}"); cs = r["cases"] if isinstance(r, dict) else r
    extra = [c["id"] for c in cs if c["id"] not in ids.values()]
    if extra: raise SystemExit(f"section {sec} already has cases {extra}: stop")
C_ = json.load(open("/tmp/testrail/creds.json")); AUTH = base64.b64encode(f"{C_.get('email') or C_.get('user')}:{C_['password']}".encode()).decode()
def upload(cid, name):
    b = uuid.uuid4().hex
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"attachment\"; filename=\"{name}\"\r\nContent-Type: image/png\r\n\r\n").encode() + open(f"{IMG}/{name}", "rb").read() + f"\r\n--{b}--\r\n".encode()
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
def attached(cid):
    d = api(f"get_attachments_for_case/{cid}"); d = d.get("attachments", d) if isinstance(d, dict) else d
    return {a.get("name") or a.get("filename") for a in d}
log = open(f"{P}/applied/create-log.jsonl", "a"); bad = 0
def L(r): log.write(json.dumps(r, ensure_ascii=False) + "\n"); log.flush()
for k in todo:
    v = PROP[k]; f = v["fields"]
    n = api(f"add_case/{v['section_id']}", f); st = LAST["status"]; cid = n["id"]
    a = api(f"get_case/{cid}")
    diff = [x for x, y in f.items() if x != "refs" and a.get(x) != y] + (["refs"] if (a.get("refs") or "").replace(" ", "") != f["refs"].replace(" ", "") else [])
    if a["section_id"] != v["section_id"]: diff.append("section")
    bad += bool(diff)
    json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    L({"op": "add_case", "key": k, "case": f"C{cid}", "http": st, "readback_ok": not diff, "bad": diff})
    with open(MAP, "a", newline="") as mf:
        csv.writer(mf).writerow([k, cid, v["sec"], f["title"], f"https://shopview.testrail.io/index.php?/cases/view/{cid}"])
    ids[k] = cid
for k, v in PROP.items():  # pictures, idempotent
    want = pics(v["fields"])
    if not want: continue
    cid = ids[k]; have = attached(cid)
    for name in want:
        if name in have: continue
        hs, res = upload(cid, name); L({"op": "add_attachment_to_case", "case": f"C{cid}", "file": name, "http": hs, "error": res.get("error")})
    ok = set(want) <= attached(cid); bad += not ok
    L({"op": "readback_attachments", "key": k, "case": f"C{cid}", "expected": want, "ok": ok})
print("cases", len(ids), "problems:", bad)
