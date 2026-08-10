#!/usr/bin/env python3
"""READ-ONLY TestRail client. GET only — this module has no write path at all,
by design: the 2026-08-10 coverage-map pass is authorised to BUILD THE MAP, not
to change the suite (Rule 6). Every proposed case change is staged in
PROPOSED-CHANGES.md instead.
"""
import base64, json, os, urllib.request

_c = json.load(open("/tmp/testrail/creds.json"))
HOST = _c["host"].rstrip("/")
_AUTH = base64.b64encode(f"{_c.get('email') or _c['user']}:{_c['password']}".encode()).decode()


def get(endpoint):
    req = urllib.request.Request(
        f"{HOST}/index.php?/api/v2/{endpoint}",
        headers={"Authorization": f"Basic {_AUTH}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read().decode())


def paged(endpoint, key):
    """TestRail v2 pages at 250; follow _links.next until exhausted."""
    out, ep = [], endpoint
    while True:
        d = get(ep)
        if isinstance(d, list):
            return d
        out.extend(d.get(key, []))
        nxt = (d.get("_links") or {}).get("next")
        if not nxt:
            return out
        ep = nxt.split("/api/v2/", 1)[1]
