#!/usr/bin/env python3
"""READ-ONLY-by-default TestRail client for this pass.

NOTE ON THE PAGINATION BUG (task brief item 10): the shared `trlib.getall()`
appends `?limit=` to a URL that already contains `?`, so every paginated call
400s. This client builds the query string itself with `&` when the endpoint
already carries `?`, and follows `_links.next` exactly as TestRail returns it.
No sampling is used anywhere to work around it.
"""
import base64, json, os, time, urllib.error, urllib.request

_c = json.load(open("/tmp/testrail/creds.json"))
HOST = _c["host"].rstrip("/")
_AUTH = base64.b64encode(
    f"{_c.get('email') or _c['user']}:{_c['password']}".encode()).decode()


def req(endpoint, data=None, method=None):
    url = f"{HOST}/index.php?/api/v2/{endpoint}"
    r = urllib.request.Request(
        url,
        data=json.dumps(data).encode() if data is not None else None,
        headers={"Authorization": f"Basic {_AUTH}",
                 "Content-Type": "application/json"},
        method=method or ("POST" if data is not None else "GET"))
    for attempt in range(4):
        try:
            with urllib.request.urlopen(r, timeout=180) as resp:
                return resp.status, json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            body = e.read().decode()
            if e.code in (429, 502, 503) and attempt < 3:
                time.sleep(3 * (attempt + 1)); continue
            try:
                return e.code, json.loads(body)
            except Exception:
                return e.code, body
        except Exception as e:
            if attempt < 3:
                time.sleep(3 * (attempt + 1)); continue
            raise
    raise RuntimeError("unreachable")


def getall(endpoint, key):
    """Paginate correctly. `endpoint` may already contain a '?'."""
    out = []
    # TestRail's real URL shape is index.php?/api/v2/<endpoint>&param=... —
    # everything after the endpoint is joined with '&', NEVER '?', because the
    # whole path already sits inside the index.php query string. Appending '?'
    # returns 400 "Invalid characters in URI". That is the bug in trlib.getall.
    ep = f"{endpoint}&limit=250&offset=0"
    while True:
        st, d = req(ep)
        if st != 200:
            raise RuntimeError(f"{st} on {ep}: {d}")
        if isinstance(d, list):
            out.extend(d); return out
        out.extend(d.get(key, []))
        nxt = (d.get("_links") or {}).get("next")
        if not nxt:
            return out
        # TestRail returns e.g. "/api/v2/get_cases/1&suite_id=1&limit=250&offset=250"
        ep = nxt.split("/api/v2/", 1)[1]
