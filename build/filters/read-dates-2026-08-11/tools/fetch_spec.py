#!/usr/bin/env python3
"""READ-ONLY Confluence fetch for the Filters page (572030978).

Pulls the version metadata and the storage-format body for any version.
Auth: the session cookie jar in /tmp (never committed).

Rule 31 trap (a): this page's IN-BODY "Version" field reads 1.0 and has since
version 1. ONLY the Confluence version integer returned by
`?expand=version` is a reliable currency marker. That integer is what this
script prints and what every deliverable in this folder cites.
"""
import json, subprocess, sys, os

PAGE = "572030978"
OUT = os.path.join(os.path.dirname(__file__), "..", "evidence")


def cookie_header():
    cj = json.load(open("/tmp/atlassian/cookies.json"))
    items = cj if isinstance(cj, list) else cj.get("cookies", [])
    at = [c for c in items if "atlassian" in (c.get("domain") or "")]
    use = at or items
    return "; ".join(f"{c['name']}={c['value']}" for c in use)


def get(url, out):
    ck = cookie_header()
    r = subprocess.run(["curl", "-s", "-o", out, "-w", "%{http_code}",
                        "-H", f"Cookie: {ck}", "-H", "Accept: application/json", url],
                       capture_output=True, text=True)
    return r.stdout.strip()


def body(version=None):
    q = f"?expand=version,body.storage" + (f"&version={version}" if version else "")
    out = os.path.join(OUT, f"raw-v{version or 'current'}.json")
    code = get(f"https://shopview.atlassian.net/wiki/rest/api/content/{PAGE}{q}", out)
    d = json.load(open(out))
    v = d.get("version", {})
    xml = d.get("body", {}).get("storage", {}).get("value", "")
    open(os.path.join(OUT, f"raw-v{v.get('number')}.xml"), "w").write(xml)
    print(f"HTTP {code} | version {v.get('number')} | when {v.get('when')} | "
          f"by {v.get('by',{}).get('displayName')} | comment {v.get('message')!r} | body {len(xml)} chars")
    return v.get("number"), xml


def history():
    out = os.path.join(OUT, "version-history.json")
    code = get(f"https://shopview.atlassian.net/wiki/rest/api/content/{PAGE}/version?limit=50", out)
    d = json.load(open(out))
    print(f"HTTP {code} | {len(d.get('results',[]))} version records")
    for r in d.get("results", []):
        print(f"  v{r['number']:>3} | {r['when']} | {r.get('by',{}).get('displayName')} | {r.get('message')!r}")


if __name__ == "__main__":
    if sys.argv[1:] and sys.argv[1] == "history":
        history()
    else:
        body(sys.argv[1] if sys.argv[1:] else None)
