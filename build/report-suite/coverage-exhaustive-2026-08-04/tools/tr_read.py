#!/usr/bin/env python3
"""READ-ONLY TestRail helper for the 2026-08-04 exhaustive coverage pass.

NO write endpoints are implemented here on purpose: this pass is forbidden from
writing to TestRail (Standing Rule 6). Credentials are read at runtime from
/tmp/testrail/creds.json and are never committed.

Usage:
  python3 tr_read.py snapshot   # writes ../data/live-cases-4281.json
"""
import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request

BASE = "https://shopview.testrail.io/index.php?/api/v2/"
CREDS = "/tmp/testrail/creds.json"
HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.abspath(os.path.join(HERE, "..", "data"))

PROJECT_ID = 1
SUITE_ID = 1
GROUP_SECTION = 4281  # "Reports Suite" parent group


def _auth():
    c = json.load(open(CREDS))
    secret = c.get("password") or c.get("key")
    return "Basic " + base64.b64encode(f"{c['email']}:{secret}".encode()).decode()


def call(path, retries=4):
    """GET only. Returns (status, parsed_body)."""
    last = None
    for attempt in range(retries):
        req = urllib.request.Request(BASE + path, method="GET")
        req.add_header("Authorization", _auth())
        req.add_header("Content-Type", "application/json")
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.status, json.loads(r.read().decode() or "{}")
        except urllib.error.HTTPError as e:
            body = e.read().decode()[:400]
            if e.code in (429, 502, 503) and attempt < retries - 1:
                time.sleep(5 * (attempt + 1))
                last = (e.code, body)
                continue
            return e.code, body
        except Exception as e:  # transient
            last = (0, repr(e))
            if attempt < retries - 1:
                time.sleep(5 * (attempt + 1))
                continue
    return last


def paged(path, key):
    out, off = [], 0
    while True:
        st, d = call(f"{path}&limit=250&offset={off}")
        assert st == 200, (st, d)
        chunk = d[key] if isinstance(d, dict) else d
        out.extend(chunk)
        if isinstance(d, dict) and d.get("_links", {}).get("next"):
            off += 250
            continue
        if not isinstance(d, dict) and len(chunk) == 250:
            off += 250
            continue
        break
    return out


def descendant_sections():
    secs = paged(f"get_sections/{PROJECT_ID}&suite_id={SUITE_ID}", "sections")
    by_id = {s["id"]: s for s in secs}
    keep = set()

    def is_desc(sid):
        seen = set()
        cur = sid
        while cur is not None and cur not in seen:
            seen.add(cur)
            if cur == GROUP_SECTION:
                return True
            cur = by_id.get(cur, {}).get("parent_id")
        return False

    for sid in by_id:
        if is_desc(sid):
            keep.add(sid)
    return keep, by_id


def main():
    os.makedirs(DATA, exist_ok=True)
    keep, by_id = descendant_sections()
    cases = paged(f"get_cases/{PROJECT_ID}&suite_id={SUITE_ID}", "cases")
    ours = [c for c in cases if c.get("section_id") in keep]
    for c in ours:
        c["_section_name"] = by_id.get(c["section_id"], {}).get("name", "")
    out = {
        "captured_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "group_section": GROUP_SECTION,
        "section_count": len(keep),
        "case_count": len(ours),
        "cases": ours,
    }
    path = os.path.join(DATA, "live-cases-4281.json")
    json.dump(out, open(path, "w"), indent=1, sort_keys=True)
    by_author = {}
    for c in ours:
        by_author[c.get("created_by")] = by_author.get(c.get("created_by"), 0) + 1
    print(f"sections under {GROUP_SECTION}: {len(keep)}")
    print(f"cases under {GROUP_SECTION}: {len(ours)}")
    print("by created_by:", json.dumps(by_author, sort_keys=True))
    print("wrote", path)


if __name__ == "__main__":
    sys.exit(main())
