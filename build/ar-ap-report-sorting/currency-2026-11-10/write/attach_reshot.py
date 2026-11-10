#!/usr/bin/env python3
"""10 Nov 2026, round 3. Uploads the right re-shot design picture (sent by the QA lead, 10 Nov 2026) to each of the 46 cases that carry the old
picture, under its readable new name. Idempotent: a case that already has an attachment of that name is skipped. Reads back by name. The old
attachment stays (TestRail refuses to delete it: "attached to a closed/archived run"). Run after update_refs.py. Dry run unless --apply.
python3 attach_reshot.py [--apply]"""
from _common import *
import base64, uuid, time, urllib.request, urllib.error, hashlib
IMG = f"{W}/design-2026-11-05/images"
NEW = {"ar-ap-p4-cleared-no-locations.png": "ar-ap-p4-cleared-no-locations-reshot-2026-11-05.png",
       "ar-ap-p5-links-only-where-they-can-open.png": "ar-ap-p5-links-only-where-they-can-open-reshot-2026-11-05.png",
       "ar-ap-p7-the-native-vendor-menu.png": "ar-ap-p7-the-native-vendor-menu-reshot-2026-11-05.png"}
SHA = {"ar-ap-p4-cleared-no-locations-reshot-2026-11-05.png": "09a4821bcdcf8e966c69e651840d2f465604d68bbca822551548f09e11e2f0b9",
       "ar-ap-p5-links-only-where-they-can-open-reshot-2026-11-05.png": "830c7dfa6c60cbc13f694b4ca0a40565933ca306da8e65ea633927d248b66510",
       "ar-ap-p7-the-native-vendor-menu-reshot-2026-11-05.png": "7c0f15065935bafd0c7f90fc0c5cd59f78554057eb063cc89e7c51435d813415"}
for n, h in SHA.items(): assert hashlib.sha256(open(f"{IMG}/{n}", "rb").read()).hexdigest() == h, n
AFF = json.load(open(f"{W}/reshot-affected-cases.json")); ID = ids()
plan = [(k, ID[k], NEW[old]) for k, olds in AFF.items() for old in olds]
for k, cid, n in plan: assert n in PROP[k]["fields"]["custom_expected"], (k, n)   # the case text names the picture it gets
from collections import Counter
print("cases", len(AFF), "| uploads", len(plan), dict(Counter(n for *_, n in plan)))
if not APPLY: print("DRY RUN: nothing uploaded."); sys.exit(0)
readiness()
from trlib import api, LAST
C_ = json.load(open("/tmp/testrail/creds.json")); AUTH = base64.b64encode(f"{C_.get('email') or C_.get('user')}:{C_['password']}".encode()).decode()
HOST = (C_.get("host") or "https://shopview.testrail.io").rstrip("/")
def upload(cid, name):
    b = uuid.uuid4().hex
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"attachment\"; filename=\"{name}\"\r\nContent-Type: image/png\r\n\r\n").encode() \
           + open(f"{IMG}/{name}", "rb").read() + f"\r\n--{b}--\r\n".encode()
    r = urllib.request.Request(f"{HOST}/index.php?/api/v2/add_attachment_to_case/{cid}", data=body,
                               headers={"Authorization": "Basic " + AUTH, "Content-Type": f"multipart/form-data; boundary={b}"})
    for a in range(4):
        try:
            x = urllib.request.urlopen(r, timeout=120); return x.status, json.load(x)
        except urllib.error.HTTPError as e:
            if e.code < 500 or a == 3: return e.code, {"error": e.read()[:300].decode("utf-8", "replace")}
        except (urllib.error.URLError, ConnectionError, TimeoutError) as e:
            if a == 3: return 0, {"error": str(e)[:200]}
        time.sleep(3 * (a + 1))
def names(cid):
    d = api(f"get_attachments_for_case/{cid}"); d = d.get("attachments", d) if isinstance(d, dict) else d
    return {a.get("name") or a.get("filename") for a in d}
L = log("attach-reshot-2026-11-10-log.jsonl"); bad = 0
for k, cid, n in plan:
    if n in names(cid): L.write(json.dumps({"op": "skipped_already_attached", "key": k, "case": f"C{cid}", "file": n}) + "\n"); continue
    http, res = upload(cid, n)
    ok = n in names(cid); bad += not ok
    L.write(json.dumps({"op": "add_attachment_to_case", "key": k, "case": f"C{cid}", "file": n, "http": http,
                        "attachment_id": res.get("attachment_id"), "error": res.get("error"), "readback_by_name": ok}) + "\n"); L.flush()
print("problems:", bad)
