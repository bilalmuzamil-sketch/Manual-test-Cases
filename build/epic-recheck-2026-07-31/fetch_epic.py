#!/usr/bin/env python3
"""Epic re-check fetcher (2026-07-31).

Fetches an epic + ALL its children from Jira REST v3 using the live session
cookies in /tmp (NO secrets written to this repo). Writes raw JSON to raw/.

Usage: python3 fetch_epic.py SV-8685
"""
import json
import os
import subprocess
import sys
import time

COOKIE_FILE = "/tmp/fd-tickets/all-cookie-header.txt"
CA = "/root/.ccr/ca-bundle.crt"
BASE = "https://shopview.atlassian.net"
RAW = os.path.join(os.path.dirname(os.path.abspath(__file__)), "raw")


def cookie():
    with open(COOKIE_FILE) as f:
        return f.read().strip()


def get(path, params=None):
    url = BASE + path
    if params:
        from urllib.parse import urlencode
        url += "?" + urlencode(params)
    for attempt in range(4):
        p = subprocess.run(
            ["curl", "-s", "--cacert", CA, "-H", "Cookie: " + cookie(),
             "-H", "Accept: application/json", "-w", "\n__HTTP__%{http_code}", url],
            capture_output=True, text=True, timeout=120)
        out = p.stdout
        if "__HTTP__" not in out:
            time.sleep(2)
            continue
        body, code = out.rsplit("\n__HTTP__", 1)
        code = code.strip()
        if code == "200":
            return json.loads(body)
        if code in ("429", "500", "502", "503", "000"):
            time.sleep(3 * (attempt + 1))
            continue
        raise SystemExit("HTTP %s for %s :: %s" % (code, url, body[:400]))
    raise SystemExit("giving up on " + url)


def issue(key):
    return get("/rest/api/3/issue/%s" % key,
               {"expand": "renderedFields,changelog", "fields": "*all"})


def search(jql):
    """Paginate fully via the token-based /search/jql API. Returns (issues, total)."""
    issues = []
    token = None
    while True:
        params = {"jql": jql, "maxResults": 100,
                  "fields": "summary,status,updated,created,issuetype,parent,labels,priority,resolutiondate"}
        if token:
            params["nextPageToken"] = token
        r = get("/rest/api/3/search/jql", params)
        issues.extend(r.get("issues", []))
        token = r.get("nextPageToken")
        if r.get("isLast") or not token:
            return issues, len(issues)


def main():
    key = sys.argv[1]
    os.makedirs(RAW, exist_ok=True)
    ep = issue(key)
    with open(os.path.join(RAW, "%s-epic.json" % key), "w") as f:
        json.dump(ep, f, indent=1)
    print("epic", key, ep["fields"]["status"]["name"], ep["fields"]["updated"])

    kids, total = search("parent = %s ORDER BY key ASC" % key)
    kids2, total2 = search('"Epic Link" = %s ORDER BY key ASC' % key)
    print("children via parent=%d (total %s) via EpicLink=%d (total %s)" % (len(kids), total, len(kids2), total2))
    keys1 = sorted(i["key"] for i in kids)
    keys2 = sorted(i["key"] for i in kids2)
    if keys1 != keys2:
        print("!! SET MISMATCH parent-only:", set(keys1) - set(keys2),
              "epiclink-only:", set(keys2) - set(keys1))
    allkeys = sorted(set(keys1) | set(keys2))
    with open(os.path.join(RAW, "%s-children-index.json" % key), "w") as f:
        json.dump({"parent_jql_total": total, "epiclink_jql_total": total2,
                   "keys_parent": keys1, "keys_epiclink": keys2,
                   "keys_union": allkeys, "issues": kids}, f, indent=1)

    full = {}
    for i, k in enumerate(allkeys, 1):
        full[k] = issue(k)
        if i % 10 == 0:
            print("  fetched", i, "/", len(allkeys))
    with open(os.path.join(RAW, "%s-children-full.json" % key), "w") as f:
        json.dump(full, f, indent=1)
    print("done", key, len(full), "children fetched")


if __name__ == "__main__":
    main()
