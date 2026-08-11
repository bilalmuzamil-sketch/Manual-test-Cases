#!/usr/bin/env python3
"""READ-ONLY Jira reader — GET only. No write of any kind is possible from this
file: it issues `curl -X GET` and nothing else.

Rule 31 trap (b): an issue's `updated` timestamp moves for purely administrative
edits (a status change, a label). To date a REQUIREMENT inside a description you
must read the CHANGELOG, not `updated`.

Rule 59 / timezone: this Jira instance returns `-0500` offsets. Every timestamp
printed here is ALSO converted to UTC, because a -0500 value read as UTC has
already produced one false claim in this workspace.
"""
import datetime as dt
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
EV = os.path.join(HERE, "..", "evidence")
BASE = "https://shopview.atlassian.net"


def cookie_header():
    cj = json.load(open("/tmp/atlassian/cookies.json"))
    items = cj if isinstance(cj, list) else cj.get("cookies", [])
    at = [c for c in items if "atlassian" in (c.get("domain") or "")]
    use = at or items
    return "; ".join(f"{c['name']}={c['value']}" for c in use)


def get(path):
    r = subprocess.run(["curl", "-s", "-X", "GET", "-w", "\n%{http_code}",
                        "-H", f"Cookie: {cookie_header()}",
                        "-H", "Accept: application/json", BASE + path],
                       capture_output=True, text=True)
    body, code = r.stdout.rsplit("\n", 1)
    return code.strip(), (json.loads(body) if code.strip() == "200" else body)


def utc(ts):
    if not ts:
        return None
    try:
        return dt.datetime.fromisoformat(ts.replace("Z", "+00:00")).astimezone(
            dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    except ValueError:
        return ts


def adf_text(node, out=None):
    """Flatten an ADF document to plain text, one line per block."""
    if out is None:
        out = []
    if isinstance(node, dict):
        if node.get("type") == "text":
            out.append(node.get("text", ""))
        for c in node.get("content", []) or []:
            adf_text(c, out)
        if node.get("type") in ("paragraph", "heading", "listItem", "tableRow"):
            out.append("\n")
    elif isinstance(node, list):
        for c in node:
            adf_text(c, out)
    return out


def issue(key):
    code, d = get(f"/rest/api/3/issue/{key}?expand=changelog")
    assert code == "200", (code, d)
    json.dump(d, open(os.path.join(EV, f"{key}.json"), "w"), indent=1)
    f = d["fields"]
    print(f"{key}: {f['summary']}")
    print(f"  type={f['issuetype']['name']} status={f['status']['name']} "
          f"parent={(f.get('parent') or {}).get('key')}")
    print(f"  created raw={f['created']}  UTC={utc(f['created'])}")
    print(f"  updated raw={f['updated']}  UTC={utc(f['updated'])}")
    desc = "".join(adf_text(f.get("description")))
    open(os.path.join(EV, f"{key}-description.txt"), "w").write(desc)
    print(f"  description flattened -> {len(desc)} chars")
    return d


def changelog(key):
    """FULL changelog, paged to exhaustion (Rule 50 — no sampling)."""
    items, start = [], 0
    while True:
        code, d = get(f"/rest/api/3/issue/{key}/changelog?startAt={start}&maxResults=100")
        assert code == "200", (code, d)
        items += d.get("values", [])
        if d.get("isLast") or start + d.get("maxResults", 100) >= d.get("total", 0):
            total = d.get("total")
            break
        start += d.get("maxResults", 100)
    json.dump(items, open(os.path.join(EV, f"{key}-changelog.json"), "w"), indent=1)
    print(f"{key} changelog: {len(items)} entries (API total={total})")
    return items


if __name__ == "__main__":
    key = sys.argv[1] if sys.argv[1:] else "SV-8686"
    issue(key)
    changelog(key)
