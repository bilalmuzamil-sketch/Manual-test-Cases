#!/usr/bin/env python3
"""Minimal TestRail v2 API helper for the Filters 2026-07-31 push.

Credentials come from the environment ONLY (TESTRAIL_USER / TESTRAIL_KEY, sourced
from /tmp/tr-creds.env) — never committed. Read-only helpers plus the two write
calls this pass needs (update_case, add_case) and the run-sync calls.
"""
import base64, json, os, time, urllib.request, urllib.error

BASE = "https://shopview.testrail.io/index.php?/api/v2/"


def _auth():
    u, k = os.environ["TESTRAIL_USER"], os.environ["TESTRAIL_KEY"]
    return "Basic " + base64.b64encode(f"{u}:{k}".encode()).decode()


def call(path, payload=None, retries=3):
    last = None
    for attempt in range(retries):
        req = urllib.request.Request(BASE + path,
                                     data=json.dumps(payload).encode() if payload is not None else None,
                                     method="POST" if payload is not None else "GET")
        req.add_header("Authorization", _auth())
        req.add_header("Content-Type", "application/json")
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.status, json.loads(r.read().decode() or "{}")
        except urllib.error.HTTPError as e:
            body = e.read().decode()[:400]
            if e.code in (429, 502, 503) and attempt < retries - 1:
                time.sleep(5 * (attempt + 1)); last = (e.code, body); continue
            return e.code, body
        except Exception as e:  # transient network / timeout
            last = (0, repr(e))
            if attempt < retries - 1:
                time.sleep(5 * (attempt + 1)); continue
            return last
    return last


def get_case(cid):
    return call(f"get_case/{cid}")


def paged(path, key):
    out, off = [], 0
    while True:
        st, d = call(f"{path}&limit=250&offset={off}")
        assert st == 200, (st, d)
        chunk = d[key] if isinstance(d, dict) else d
        out += chunk
        if len(chunk) < 250:
            return out
        off += 250
