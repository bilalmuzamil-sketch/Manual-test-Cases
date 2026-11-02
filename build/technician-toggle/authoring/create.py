#!/usr/bin/env python3
"""Technician Toggle: add every case in proposals.json that has no C-id yet to its subsection of 113017, and attach each case's design
pictures (design-2026-11-02/images/, readable names, idempotent, read back). DRY RUN by default: it prints the plan and writes nothing.
--apply is run only by the coordinator, with the QA lead's go-ahead (Rule 6). Before any write it calls the tester-readiness check
(Rule 138) and refuses on failure. Held cases are created like the others but are not added to a run (the run list it prints is the
union-only candidate set, Rules 34 and 123). Resumable: appends testrail-id-map.csv and keeps applied/C<id>-after.json read-backs.
python3 create.py [--apply]"""
import sys, os, json, csv, re, base64, uuid, time, urllib.request, urllib.error
from collections import Counter
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
PROP = json.load(open(f"{D}/proposals.json")); SECS = json.load(open(f"{P}/sections.json"))["sections"]
MAP = f"{P}/testrail-id-map.csv"; IMG = f"{P}/design-2026-11-02/images"
PICRE = re.compile(r"tt-p\d-\d\d-[\w-]+\.png")
def pics(f): return sorted(set(PICRE.findall(f["custom_expected"])))
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(MAP))} if os.path.exists(MAP) else {}
# QA lead, 2 Nov 2026, on the 5 cases a manual tester cannot force: "Leave them out" (kept in the library only; NO-MANUAL-CASES.md)
NO_MANUAL = {"S2-34", "S2-35", "S2-36", "S3-47", "S4-07"}
todo = [k for k in PROP if k not in ids and k not in NO_MANUAL]
missing = sorted({p for v in PROP.values() for p in pics(v["fields"]) if not os.path.exists(f"{IMG}/{p}")})
print("PLAN (dry run unless --apply)")
print(f"{'key':7} {'subsection of 113017':52} {'cases':>5} {'held':>5} {'to run':>6} {'pictures':>8}")
for s, v in SECS.items():
    ks = [k for k in todo if PROP[k]["sec"] == s]
    print(f"{s:7} {v['name'][:52]:52} {len(ks):5} {sum(PROP[k]['held'] for k in ks):5} {sum(not PROP[k]['held'] for k in ks):6} "
          f"{sum(len(pics(PROP[k]['fields'])) for k in ks):8}   id {v.get('id')}")
print(f"total to add {len(todo)} | already {len(ids)} | held (not for a run) {sum(PROP[k]['held'] for k in todo)} | "
      f"for the run {sum(not PROP[k]['held'] for k in todo)} | picture uploads {sum(len(pics(PROP[k]['fields'])) for k in todo)} "
      f"({len({p for k in todo for p in pics(PROP[k]['fields'])})} distinct files) | missing picture files {missing}")
print("held by reason:", dict(Counter(re.sub(r"\(question \d+\)", "(question n)", PROP[k]["automation"]) for k in todo if PROP[k]["held"])))
no_section = sorted({PROP[k]["sec"] for k in todo if not SECS[PROP[k]["sec"]].get("id")})
print("subsections still to create (no id in sections.json):", no_section)
sys.path.insert(0, f"{P}/../testing-tools"); import tester_readiness_check as TRC
TRC.require(P)          # Rule 138: no write unless the check passes (runs on the dry run too, so its result is always seen)
if "--apply" not in sys.argv:
    print("dry run: nothing written (add --apply, with the QA lead's go-ahead)"); sys.exit(0)
if no_section or missing: sys.exit(f"create the subsections first and put their ids in sections.json: {no_section}; missing pictures: {missing}")
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
os.makedirs(f"{P}/applied", exist_ok=True)
if not os.path.exists(MAP):
    with open(MAP, "w", newline="") as f: csv.writer(f).writerow(["key", "case_id", "section", "title", "link"])
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
def attached(cid):
    d = api(f"get_attachments_for_case/{cid}"); d = d.get("attachments", d) if isinstance(d, dict) else d
    return {a.get("name") or a.get("filename") for a in d}
log = open(f"{P}/applied/create-log.jsonl", "a"); bad = 0
def L(r): log.write(json.dumps(r, ensure_ascii=False) + "\n"); log.flush()
for k in todo:
    v = PROP[k]; f = v["fields"]; sid = SECS[v["sec"]]["id"]
    n = api(f"add_case/{sid}", f); st = LAST["status"]; cid = n["id"]
    a = api(f"get_case/{cid}")
    diff = [x for x, y in f.items() if x != "refs" and a.get(x) != y] + (["refs"] if (a.get("refs") or "").replace(" ", "") != f["refs"].replace(" ", "") else [])
    if a["section_id"] != sid: diff.append("section")
    bad += bool(diff)
    json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    L({"op": "add_case", "key": k, "case": f"C{cid}", "http": st, "readback_ok": not diff, "bad": diff})
    with open(MAP, "a", newline="") as mf:
        csv.writer(mf).writerow([k, cid, v["sec"], f["title"], f"https://shopview.testrail.io/index.php?/cases/view/{cid}"])
    ids[k] = cid
for k, v in PROP.items():  # pictures, idempotent
    want = pics(v["fields"])
    if not want or k not in ids or k in NO_MANUAL: continue
    cid = ids[k]; have = attached(cid)
    for name in want:
        if name in have: continue
        hs, res = upload(cid, name); L({"op": "add_attachment_to_case", "case": f"C{cid}", "file": name, "http": hs, "error": res.get("error")})
    ok = set(want) <= attached(cid); bad += not ok
    L({"op": "readback_attachments", "key": k, "case": f"C{cid}", "expected": want, "ok": ok})
print("cases", len(ids), "problems:", bad)
