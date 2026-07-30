"""Minimal TestRail API helper for the Filters closing-authenticity pass.
Private to this pass (a shared /tmp helper was overwritten by a sibling worker
mid-run, so this lives in-repo with a unique name). Creds from env only, never logged.
"""
import json, os, base64, urllib.request, urllib.error, time
BASE = "https://shopview.testrail.io/index.php?/api/v2/"
AUTH = "Basic " + base64.b64encode(
    ("%s:%s" % (os.environ["TESTRAIL_USER"], os.environ["TESTRAIL_KEY"])).encode()).decode()

def api(path, payload=None, retries=3):
    for a in range(retries):
        req = urllib.request.Request(BASE + path)
        req.add_header("Authorization", AUTH)
        req.add_header("Content-Type", "application/json")
        data = json.dumps(payload).encode() if payload is not None else None
        try:
            with urllib.request.urlopen(req, data, timeout=90) as r:
                return r.status, json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            body = e.read().decode()[:500]
            if e.code == 429 and a < retries - 1:
                time.sleep(5); continue
            return e.code, {"error": body}
        except Exception as e:
            if a < retries - 1:
                time.sleep(4); continue
            return 0, {"error": str(e)}

def get_all(path, key):
    out, off = [], 0
    while True:
        st, r = api(path + "&limit=250&offset=%d" % off)
        assert st == 200, r
        chunk = r[key] if isinstance(r, dict) else r
        out += chunk
        if len(chunk) == 250:
            off += 250
        else:
            break
    return out
