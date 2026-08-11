#!/usr/bin/env python3
"""READ-ONLY. Date a requirement STRING across every historical version of the
Schedule Confluence page (713031682) — Standing Rule 31 trap (c).

A page's version number dates the PAGE, not the rule inside it. To date a
requirement you must diff THAT REQUIREMENT'S OWN TEXT across versions. This
script fetches every version body once, caches it, and reports for each probe
literal the exact set of versions it is present in, plus first/last.

Usage:
  python3 date_string.py fetch          # cache all version bodies
  python3 date_string.py date           # run the probes
"""
import html
import json
import os
import re
import subprocess
import sys

PAGE = "713031682"
HERE = os.path.dirname(os.path.abspath(__file__))
EV = os.path.join(HERE, "..", "evidence")
CACHE = os.path.join(EV, "versions")


def cookie_header():
    cj = json.load(open("/tmp/atlassian/cookies.json"))
    items = cj if isinstance(cj, list) else cj.get("cookies", [])
    at = [c for c in items if "atlassian" in (c.get("domain") or "")]
    use = at or items
    return "; ".join(f"{c['name']}={c['value']}" for c in use)


def curl_json(url):
    ck = cookie_header()
    r = subprocess.run(["curl", "-s", "-w", "\n%{http_code}", "-H", f"Cookie: {ck}",
                        "-H", "Accept: application/json", url],
                       capture_output=True, text=True)
    parts = r.stdout.rsplit("\n", 1)
    code = parts[-1].strip()
    return code, json.loads(parts[0]) if code == "200" else None


def history():
    code, d = curl_json(
        f"https://shopview.atlassian.net/wiki/rest/api/content/{PAGE}/version?limit=100")
    assert code == "200", code
    recs = [{"number": r["number"], "when": r["when"],
             "by": r.get("by", {}).get("displayName"),
             "message": r.get("message")} for r in d["results"]]
    recs.sort(key=lambda r: r["number"])
    json.dump(recs, open(os.path.join(EV, "version-history.json"), "w"), indent=1)
    return recs


def fetch_all():
    os.makedirs(CACHE, exist_ok=True)
    recs = history()
    latest = max(r["number"] for r in recs)
    print(f"history: {len(recs)} records, latest v{latest}")
    for n in range(1, latest + 1):
        dest = os.path.join(CACHE, f"v{n}.xml")
        if os.path.exists(dest) and os.path.getsize(dest) > 0:
            continue
        code, d = curl_json(
            f"https://shopview.atlassian.net/wiki/rest/api/content/{PAGE}"
            f"?expand=version,body.storage&version={n}")
        assert code == "200", f"v{n} HTTP {code}"
        xml = d["body"]["storage"]["value"]
        assert d["version"]["number"] == n, (n, d["version"]["number"])
        open(dest, "w").write(xml)
        print(f"  v{n:>3} {len(xml):>6} chars  {d['version']['when']}")
    return latest


def plain(xml):
    """Tag-stripped, whitespace-collapsed text of a storage body."""
    t = re.sub(r"<[^>]+>", " ", xml)
    t = html.unescape(t)
    return re.sub(r"\s+", " ", t).strip()


PROBES = {
    "fade sentence (whole)": "Non-matching blocks fade; matching blocks highlight",
    "fade sentence (fragment 'blocks fade')": "blocks fade",
    "fade sentence (fragment 'matching blocks highlight')": "matching blocks highlight",
    "'Non-matching' anywhere": "Non-matching",
    "search 5-field list": "customer name, WO number, unit number, technician name, and line name",
    "search row label": "Filters grid blocks by matching against",
    "'restore' anywhere": "restore",
    "'clearing' anywhere": "clearing",
    "'rearrang' anywhere": "rearrang",
    "'dim' anywhere": "dim",
    "'opacity' anywhere": "opacity",
    "'hides' anywhere": "hides",
    "'hidden' anywhere": "hidden",
}


def date_probes(latest):
    bodies = {}
    for n in range(1, latest + 1):
        p = os.path.join(CACHE, f"v{n}.xml")
        bodies[n] = plain(open(p).read())
    lens = {n: len(bodies[n]) for n in bodies}
    med = sorted(lens.values())[len(lens) // 2]
    partial = [n for n, L in lens.items() if L < med * 0.5]
    out = {"versions_examined": sorted(bodies),
           "body_lengths": lens,
           "partial_saves_flagged": partial,
           "probes": {}}
    for label, lit in PROBES.items():
        low = lit.lower()
        present = [n for n in sorted(bodies) if low in bodies[n].lower()]
        out["probes"][label] = {
            "literal": lit,
            "present_in": present,
            "first_version": present[0] if present else None,
            "last_version": present[-1] if present else None,
            "absent_in": [n for n in sorted(bodies) if n not in present],
        }
    json.dump(out, open(os.path.join(EV, "string-dating.json"), "w"), indent=1)
    for label, r in out["probes"].items():
        print(f"{label:<50} first=v{r['first_version']} last=v{r['last_version']} "
              f"n={len(r['present_in'])}")
    print("\npartial saves flagged (body < 50% of median length):", partial)
    return out


if __name__ == "__main__":
    cmd = sys.argv[1] if sys.argv[1:] else "date"
    if cmd == "fetch":
        fetch_all()
    else:
        recs = json.load(open(os.path.join(EV, "version-history.json")))
        date_probes(max(r["number"] for r in recs))
