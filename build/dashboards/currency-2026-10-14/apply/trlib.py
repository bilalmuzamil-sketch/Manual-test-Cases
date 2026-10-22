"""Small TestRail helper for the Dashboard apply pass (14 Oct 2026; copied from the WO Board v49 pass). Credentials from /tmp/testrail/creds.json only; never printed."""
import json, urllib.request, urllib.error, base64, time
_C = json.load(open("/tmp/testrail/creds.json"))
_AUTH = base64.b64encode(f"{_C.get('email') or _C.get('user')}:{_C['password']}".encode()).decode()
_HOST = (_C.get("host") or "https://shopview.testrail.io").rstrip("/")
LAST = {"status": None}
def api(ep, data=None):
    r = urllib.request.Request(f"{_HOST}/index.php?/api/v2/{ep}", data=(json.dumps(data).encode() if data is not None else None),
                               headers={"Authorization": "Basic " + _AUTH, "Content-Type": "application/json"})
    for a in range(8):
        try:
            resp = urllib.request.urlopen(r, timeout=120); LAST["status"] = resp.status; return json.load(resp)
        except urllib.error.HTTPError as e:
            LAST["status"] = e.code
            if e.code == 429 and a < 7:  # 22 Oct 2026: TestRail allows 180 calls a minute; wait and retry instead of stopping
                time.sleep(25); continue
            if e.code < 500 or a == 7: raise SystemExit(f"HTTP {e.code} on {ep.split('&')[0]}: {e.read()[:300]}")
        except Exception:
            if a == 7: raise
        time.sleep(2 * (a + 1))
