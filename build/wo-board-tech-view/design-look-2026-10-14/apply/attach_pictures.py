#!/usr/bin/env python3
"""Attach each design case's design pictures (proposals-design.json "pictures") to its TestRail case with
add_attachment_to_case/{case_id} (multipart, field "attachment"), idempotent (skips a name already attached), then reads
back get_attachments_for_case/{case_id}. Writes applied/attachments-log.jsonl (case, file, http, attachment id, read-back)."""
import json, base64, uuid, urllib.request, urllib.error, os, time
H = "build/wo-board-tech-view/design-look-2026-10-14/apply"
PIC = "build/wo-board-tech-view/design-look-2026-10-14/compare"
C = json.load(open("/tmp/testrail/creds.json")); AUTH = base64.b64encode(f"{C.get('email') or C.get('user')}:{C['password']}".encode()).decode()
BASE = "https://shopview.testrail.io/index.php?/api/v2/"
def get(ep):
    r = urllib.request.Request(BASE + ep, headers={"Authorization": "Basic " + AUTH})
    x = urllib.request.urlopen(r, timeout=90); return x.status, json.load(x)
def upload(cid, path):
    b = uuid.uuid4().hex; name = os.path.basename(path)
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"attachment\"; filename=\"{name}\"\r\nContent-Type: image/png\r\n\r\n").encode() + open(path, "rb").read() + f"\r\n--{b}--\r\n".encode()
    r = urllib.request.Request(BASE + f"add_attachment_to_case/{cid}", data=body, headers={"Authorization": "Basic " + AUTH, "Content-Type": f"multipart/form-data; boundary={b}"})
    for a in range(4):
        try:
            x = urllib.request.urlopen(r, timeout=120); return x.status, json.load(x)
        except urllib.error.HTTPError as e:
            if e.code < 500 or a == 3: return e.code, {"error": e.read()[:300].decode("utf-8", "replace")}
        time.sleep(2 * (a + 1))
def listing(cid):
    st, d = get(f"get_attachments_for_case/{cid}")
    return st, (d.get("attachments", d) if isinstance(d, dict) else d)
props = json.load(open(f"{H}/proposals-design.json"))["new"]
ids = json.load(open(f"{H}/applied/new-case-ids.json"))
log = open(f"{H}/applied/attachments-log.jsonl", "a")
for p in props:
    cid = ids[p["key"]]
    st, have = listing(cid); names = {a.get("name") or a.get("filename") for a in have}
    for pic in p["pictures"]:
        if pic in names:
            rec = {"op": "skip_already_attached", "case": f"C{cid}", "file": pic}
        else:
            hs, res = upload(cid, os.path.join(PIC, pic))
            rec = {"op": "add_attachment_to_case", "case": f"C{cid}", "file": pic, "http": hs, "attachment_id": res.get("attachment_id"), "error": res.get("error")}
        log.write(json.dumps(rec) + "\n"); log.flush()
    st, have = listing(cid); names = sorted(a.get("name") or a.get("filename") for a in have)
    ok = all(pic in names for pic in p["pictures"])
    rec = {"op": "readback_attachments", "case": f"C{cid}", "http": st, "attached": names, "expected": p["pictures"], "ok": ok}
    log.write(json.dumps(rec) + "\n"); log.flush()
    print(p["key"], f"C{cid}", "OK" if ok else "PROBLEM", len(names))
