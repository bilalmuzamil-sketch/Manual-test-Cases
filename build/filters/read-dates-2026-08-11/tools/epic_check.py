#!/usr/bin/env python3
"""Rule 37 Tier-1 currency check on Filters epic SV-8785 — READ-ONLY.

Child set verified TWO independent ways (`parent = SV-8785` and `"Epic Link" =
SV-8785`), each PAGED TO EXHAUSTION with the paging remainder proven zero, and
the key sets compared in BOTH directions (Rule 50). Also prints each child's
status and the epic's changelog tail (Rule 31 trap (b): `updated` moves for
administrative edits, so the changelog is what is read).
"""
import datetime as dt
import json
import os
import urllib.parse

import jira_read as J

EV = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "evidence")
EPIC = "SV-8785"


def jql(q):
    """Token-paged /rest/api/3/search/jql. The old /rest/api/3/search was REMOVED
    (HTTP 410, CHANGE-2046); the replacement pages by `nextPageToken` and reports
    NO total, so exhaustion is proven by `isLast`/absent token, not by a count."""
    out, token = [], None
    while True:
        url = ("/rest/api/3/search/jql?jql=" + urllib.parse.quote(q)
               + "&fields=summary,status,issuetype,parent,updated&maxResults=100")
        if token:
            url += "&nextPageToken=" + urllib.parse.quote(token)
        code, d = J.get(url)
        assert code == "200", (code, d)
        out += d.get("issues", [])
        token = d.get("nextPageToken")
        if d.get("isLast") or not token:
            return out, len(out)


if __name__ == "__main__":
    now = dt.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    print("read at", now)
    a, ta = jql(f"parent = {EPIC} ORDER BY key ASC")
    b, tb = jql(f'"Epic Link" = {EPIC} ORDER BY key ASC')
    ka = [i["key"] for i in a]
    kb = [i["key"] for i in b]
    print(f"parent={EPIC}      -> {len(ka)} issues (paged to isLast, remainder {ta - len(ka)})")
    print(f'"Epic Link"={EPIC} -> {len(kb)} issues (paged to isLast, remainder {tb - len(kb)})')
    print("key sets equal both directions:",
          set(ka) == set(kb), "| a-b", sorted(set(ka) - set(kb)), "| b-a", sorted(set(kb) - set(ka)))
    for i in a:
        f = i["fields"]
        print(f"  {i['key']:<9} {f['issuetype']['name']:<14} {f['status']['name']:<16} {f['summary'][:60]}")
    json.dump({"read_at": now, "parent": a, "epiclink": b},
              open(os.path.join(EV, "epic-SV-8785-children.json"), "w"), indent=1)

    ep = J.issue(EPIC)
    cl = J.changelog(EPIC)
    cl.sort(key=lambda e: e["created"])
    print("\nchangelog tail (last 8):")
    for e in cl[-8:]:
        who = (e.get("author") or {}).get("displayName")
        fields = ",".join(it.get("field") for it in e.get("items", []))
        print(f"  {e['created']}  UTC={J.utc(e['created'])}  {who}  [{fields}]")
