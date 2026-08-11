#!/usr/bin/env python3
"""READ-ONLY Confluence fetch for the SIX Report Suite specification pages.

Adapted from build/filters/read-dates-2026-08-11/tools/fetch_spec.py (Rule 27).
Difference: this project has SIX specifications, one per report, each with its
own page id and its own independent version number, so every figure here is
per-report and nothing is generalised across them.

Rule 31 trap (a): an in-body "Version" field is NOT a currency marker. ONLY the
Confluence version integer returned by `?expand=version` is, and that integer is
what every deliverable in this folder cites.

Auth: the session cookie jar in /tmp (never committed, never printed).
"""
import json
import os
import subprocess
import sys

PAGES = {
    "Sales By Customer":       "577634305",
    "Sales By Representative": "585629698",
    "Parts Velocity":          "620888066",
    "Technician Utilization":  "641400833",
    "Work In Progress":        "703660034",
    "Inventory Value":         "720142338",
}
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "evidence")


def cookie_header():
    cj = json.load(open("/tmp/atlassian/cookies.json"))
    items = cj if isinstance(cj, list) else cj.get("cookies", [])
    at = [c for c in items if "atlassian" in (c.get("domain") or "")]
    use = at or items
    return "; ".join(f"{c['name']}={c['value']}" for c in use)


def get(url, out):
    """curl to a FILE. The response body is never echoed to stdout and never
    stored in an evidence file that could carry a credential — only the parsed
    version metadata and the storage XML are kept."""
    ck = cookie_header()
    r = subprocess.run(["curl", "-s", "-o", out, "-w", "%{http_code}",
                        "-H", f"Cookie: {ck}", "-H", "Accept: application/json", url],
                       capture_output=True, text=True)
    return r.stdout.strip()


def body(name, page, version=None):
    q = "?expand=version,body.storage" + (f"&version={version}" if version else "")
    tmp = f"/tmp/rs_spec_{page}_{version or 'cur'}.json"
    code = get(f"https://shopview.atlassian.net/wiki/rest/api/content/{page}{q}", tmp)
    d = json.load(open(tmp))
    v = d.get("version", {})
    xml = d.get("body", {}).get("storage", {}).get("value", "")
    slug = name.replace(" ", "-")
    open(os.path.join(OUT, f"{slug}-v{v.get('number')}.xml"), "w").write(xml)
    json.dump({"page": page, "report": name, "version": v.get("number"),
               "when": v.get("when"), "by": v.get("by", {}).get("displayName"),
               "message": v.get("message"), "body_chars": len(xml), "http": code},
              open(os.path.join(OUT, f"{slug}-v{v.get('number')}-meta.json"), "w"), indent=1)
    print(f"{name:<26} page {page} | HTTP {code} | version {v.get('number'):<3} | "
          f"{v.get('when')} | by {v.get('by',{}).get('displayName')} | "
          f"msg {str(v.get('message'))[:60]!r} | body {len(xml)} chars")
    return v.get("number"), xml


def history(name, page, limit=60):
    tmp = f"/tmp/rs_hist_{page}.json"
    code = get(f"https://shopview.atlassian.net/wiki/rest/api/content/{page}/version?limit={limit}", tmp)
    d = json.load(open(tmp))
    print(f"\n== {name} (page {page}) HTTP {code} | {len(d.get('results',[]))} version records")
    for r in d.get("results", []):
        print(f"  v{r['number']:>3} | {r['when']} | {r.get('by',{}).get('displayName')} | {str(r.get('message'))[:70]!r}")
    json.dump(d.get("results", []),
              open(os.path.join(OUT, f"{name.replace(' ','-')}-version-history.json"), "w"), indent=1)


if __name__ == "__main__":
    mode = sys.argv[1] if sys.argv[1:] else "current"
    for name, page in PAGES.items():
        if mode == "history":
            history(name, page)
        else:
            body(name, page)
