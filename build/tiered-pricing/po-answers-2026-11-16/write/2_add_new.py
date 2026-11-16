#!/usr/bin/env python3
"""(2) Add the 9 new cases (PRD v38 / Matt Barge's answers 2, 6, 14, 15, 21, 22) to their story folders, read back field by field, append
testrail-id-map.csv (resumable: a key already mapped is not added again), then attach each new case's design pictures (proposals.json
picture_files; existing cases' pictures are untouched, QA lead 16 Nov 2026: "Wait for his canvas") and read them back by name.
Refuses if a target folder holds a case that is not ours. Log: log-add.jsonl.   python3 2_add_new.py [--apply]"""
import json, sys, os, csv, base64, uuid, urllib.request, urllib.error, time
from _w import *
L = logger("add"); PR = prop(); M = idmap(); S = secs()
NEW = ["S2-79", "S3-46", "S3-47", "S4-42", "S4-43", "S4-44", "S8-13", "S9-39", "S19-24"]
todo = [k for k in NEW if k not in M]
readiness()
for k in NEW: assert not PR[k]["held"] and PR[k]["fields"]["custom_atmstatus"] == 1 and len(PR[k]["fields"]["title"]) <= 80, k
targets = sorted({S[PR[k]["sec"]]["id"] for k in NEW})
ours = {int(r["case_id"]) for r in M.values()}
foreign = []
for sid in targets:
    for c in paged(f"get_cases/{SUITE}&section_id={sid}", "cases"):
        if c["id"] not in ours: foreign.append((sid, c["id"], c.get("created_by")))
print(f"PLAN: add {len(todo)} of {len(NEW)} new cases ({len(NEW) - len(todo)} already mapped); target folders {targets}; cases there not ours: {foreign}")
for k in todo: print(f"  {k:7} -> {S[PR[k]['sec']]['name'][:50]} ({S[PR[k]['sec']]['id']}): {PR[k]['title']} | pictures {PR[k]['pictures']}")
if foreign: print("NOTE: folders hold cases not in our map (listed above)")
if not APPLY: print("dry run: nothing written"); sys.exit(0)
if [f for f in foreign if f[2] != 3]: sys.exit("REFUSED: a target folder holds a case someone else made (Rules 38, 123)")


def upload(cid, path):
    c = json.load(open("/tmp/testrail/creds.json"))
    auth = base64.b64encode(f"{c.get('email') or c.get('user')}:{c['password']}".encode()).decode()
    host = (c.get("host") or "https://shopview.testrail.io").rstrip("/")
    b = uuid.uuid4().hex; name = os.path.basename(path)
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"attachment\"; filename=\"{name}\"\r\nContent-Type: image/png\r\n\r\n").encode() \
        + open(path, "rb").read() + f"\r\n--{b}--\r\n".encode()
    r = urllib.request.Request(f"{host}/index.php?/api/v2/add_attachment_to_case/{cid}", data=body,
                               headers={"Authorization": "Basic " + auth, "Content-Type": f"multipart/form-data; boundary={b}"})
    for a in range(8):
        try:
            x = urllib.request.urlopen(r, timeout=120); return x.status, None
        except urllib.error.HTTPError as e:
            if e.code in (403, 429, 500, 502, 503, 504) and a < 7: time.sleep(25 if e.code == 429 else 3 * (a + 1)); continue
            return e.code, e.read()[:300].decode("utf-8", "replace")
        except (urllib.error.URLError, ConnectionError, TimeoutError) as e:
            if a == 7: return 0, str(e)[:200]
            time.sleep(3 * (a + 1))


def attached(cid):
    d = api(f"get_attachments_for_case/{cid}"); d = d.get("attachments", d) if isinstance(d, dict) else d
    return {a.get("name") or a.get("filename") for a in d}


bad = []
MAPF = f"{TP}/testrail-id-map.csv"
for k in todo:
    f = PR[k]["fields"]; sid = S[PR[k]["sec"]]["id"]
    try: r = api(f"add_case/{sid}", f); st = LAST["status"]
    except RuntimeError as e: L({"op": "add_case", "key": k, "http": e.args[0], "error": e.args[1]}); bad.append(k); break
    cid = r["id"]
    with open(MAPF, "a", newline="") as fh:
        csv.writer(fh).writerow([k, cid, PR[k]["sec"], f["title"], f"https://shopview.testrail.io/index.php?/cases/view/{cid}",
                                 "PRD 938213378 page v38 (v0.17); reports PRD 968687617 page v21"])
    a = api(f"get_case/{cid}"); json.dump(a, open(f"{W}/after/C{cid}.json", "w"), indent=1, ensure_ascii=False)
    diff = [x for x in FIELDS if a.get(x) != f[x]] + (["refs"] if norm_refs(a.get("refs")) != norm_refs(f["refs"]) else []) + (["section"] if a["section_id"] != sid else [])
    if diff: bad.append(k)
    L({"op": "add_case", "key": k, "case": f"C{cid}", "section": sid, "http": st, "readback_ok": not diff, "bad": diff})
M = idmap()
for k in NEW:
    if k not in M: continue
    cid = int(M[k]["case_id"]); paths = [f"{TP}/{p}" for p in PR[k]["picture_files"]]; have = attached(cid)
    for p in paths:
        n = os.path.basename(p)
        if n in have: L({"op": "skipped_already_attached", "key": k, "case": f"C{cid}", "file": n}); continue
        http, err = upload(cid, p); L({"op": "add_attachment_to_case", "key": k, "case": f"C{cid}", "file": n, "http": http, "error": err})
    ok = {os.path.basename(p) for p in paths} <= attached(cid)
    if not ok: bad.append(k + " pictures")
    L({"op": "readback_attachments", "key": k, "case": f"C{cid}", "expected": [os.path.basename(p) for p in paths], "ok": ok})
print("added:", len(todo), "| problems:", bad); sys.exit(1 if bad else 0)
