#!/usr/bin/env python3
"""Date a REQUIREMENT by diffing its own text across every Confluence version.

READ-ONLY. Standing Rule 31 trap (c): a page's version number and last-updated
date say NOTHING about the age of a rule inside it. A page republished yesterday
can carry a requirement untouched for five months. So to date a requirement you
must find the version at which THAT REQUIREMENT'S OWN TEXT actually changed.

Getting this wrong applies Rule 32's latest-wins BACKWARDS -- on 2026-08-06 two
Filters cases were flipped off a PO ruling and onto spec text that turned out to
be two and a half months OLDER than the ruling. This script is the cheap check
that prevents it: one fetch per version, cached on disk, then a literal probe.

Usage:  date_requirements.py            # fetch any missing versions, then probe
Bodies are cached in ../evidence/versions/raw-vN.xml and never re-fetched.
"""
import json, os, re, subprocess, sys

PAGE = "572030978"
HERE = os.path.dirname(os.path.abspath(__file__))
EV = os.path.join(HERE, "..", "evidence")
CACHE = os.path.join(EV, "versions")
MAX_VERSION = 19

# Versions 10, 12 and 14 are TRUNCATED PARTIAL SAVES (7,314 / 8,632 / 5,918 chars
# against ~40,000 for their neighbours). They are excluded from the dating logic
# and NAMED here so the gaps in the matrix are never misread as removals.
PARTIAL_SAVES = set()

# The requirements this pass needs dated, each probed by a literal that is unique
# to it. Escaped-entity forms matter: Confluence storage writes &sect; not §.
PROBES = {
    "S1-R4 body - 'The page toolbar contains a toggle button that collapses and expands the filter bar'":
        "toolbar contains a toggle button that collapses and expands the filter bar",
    "S1-R5 body - 'the bar is hidden and the table expands to use the reclaimed vertical space'":
        "the bar is hidden and the table expands to use the reclaimed vertical space",
    "S1-R6 body - 'the bar reappears in its previous state'":
        "the bar reappears in its previous state",
    "S1-R7 body - 'collapsed/expanded state of the filter bar persists across navigation'":
        "state of the filter bar persists across navigation",
    "S12-R4 body - 'collapse toggle is not shown on mobile; the filter bar is always visible'":
        "collapse toggle is not shown on mobile",
    "S7-R4 body - 'toolbar collapse/expand toggle displays a visual indicator'":
        "toggle displays a visual indicator",
    "ANY '>1 filter' visibility condition (SV-9041's rule) - 'more than 1 filter'":
        "more than 1 filter",
    "ANY '>1 filter' visibility condition (SV-9041's rule) - 'more then 1 filter'":
        "more then 1 filter",
    "ANY conditional visibility - 'only be visible if'":
        "only be visible if",
    "Overview collapse sentence - 'can be collapsed and expanded via a toggle in the page toolbar'":
        "can be collapsed and expanded via a toggle in the page toolbar",
    "C38882 subject - date-range chip 'pre-populated with the current default range'":
        "pre-populated with the current default range",
    "C38882 subject - 'offers standard predefined ranges as well as a custom start/end range'":
        "offers standard predefined ranges as well as a custom",
    "C38882 subject - 'A new date-range filter type is introduced'":
        "A new date-range filter type is introduced",
    "S1-R3 (what v19 actually changed) - 'leading type-icon'":
        "leading type-icon",
}


def cookie_header():
    cj = json.load(open("/tmp/atlassian/cookies.json"))
    items = cj if isinstance(cj, list) else cj.get("cookies", [])
    at = [c for c in items if "atlassian" in (c.get("domain") or "")]
    use = at or items
    return "; ".join(f"{c['name']}={c['value']}" for c in use)


def fetch(version):
    """Fetch one historical body into the cache. Returns (chars, when)."""
    os.makedirs(CACHE, exist_ok=True)
    xml_path = os.path.join(CACHE, f"raw-v{version}.xml")
    meta_path = os.path.join(CACHE, f"meta-v{version}.json")
    if os.path.exists(xml_path) and os.path.exists(meta_path):
        return len(open(xml_path).read()), json.load(open(meta_path)).get("when")
    tmp = os.path.join(CACHE, f"_raw-v{version}.json")
    url = (f"https://shopview.atlassian.net/wiki/rest/api/content/{PAGE}"
           f"?expand=version,body.storage&version={version}")
    code = subprocess.run(
        ["curl", "-s", "-o", tmp, "-w", "%{http_code}",
         "-H", f"Cookie: {cookie_header()}", "-H", "Accept: application/json", url],
        capture_output=True, text=True).stdout.strip()
    if code != "200":
        print(f"  v{version:>3} HTTP {code} - NOT FETCHED", file=sys.stderr)
        return None, None
    d = json.load(open(tmp))
    xml = d.get("body", {}).get("storage", {}).get("value", "")
    v = d.get("version", {})
    open(xml_path, "w").write(xml)
    json.dump({"number": v.get("number"), "when": v.get("when"),
               "by": (v.get("by") or {}).get("displayName"),
               "message": v.get("message"), "chars": len(xml)},
              open(meta_path, "w"), indent=1)
    os.remove(tmp)
    return len(xml), v.get("when")


def normalise(xml):
    """Compare on text, not markup. Confluence re-serialises freely -- v27 dropped
    216 ac:local-id attributes with no content change -- so a raw byte compare
    would report edits that never happened."""
    t = re.sub(r"<[^>]+>", " ", xml)
    t = (t.replace("&sect;", "§").replace("&nbsp;", " ").replace("&amp;", "&")
          .replace("&rsquo;", "'").replace("&mdash;", "—").replace("&ndash;", "–")
          .replace("&quot;", '"').replace("&lt;", "<").replace("&gt;", ">"))
    return re.sub(r"\s+", " ", t)


def main():
    bodies, meta = {}, {}
    for v in range(1, MAX_VERSION + 1):
        chars, when = fetch(v)
        if chars is None:
            continue
        bodies[v] = normalise(open(os.path.join(CACHE, f"raw-v{v}.xml")).read())
        meta[v] = json.load(open(os.path.join(CACHE, f"meta-v{v}.json")))

    usable = [v for v in sorted(bodies) if v not in PARTIAL_SAVES]
    out = {"versions_fetched": sorted(bodies),
           "partial_saves_excluded_from_dating": sorted(PARTIAL_SAVES),
           "versions_used_for_dating": usable,
           "version_meta": {str(v): meta[v] for v in sorted(meta)},
           "probes": {}}

    print(f"versions fetched: {len(bodies)} | used for dating: {len(usable)}")
    print(f"{'requirement':<70} {'first':>6}  {'when':<26} present in")
    for label, literal in PROBES.items():
        present = [v for v in usable if literal in bodies[v]]
        first = present[0] if present else None
        when = meta.get(first, {}).get("when") if first else None
        out["probes"][label] = {"literal": literal, "first_version": first,
                                "first_seen_when": when, "present_in": present,
                                "present_in_v27": MAX_VERSION in present}
        print(f"{label[:70]:<70} {str(first):>6}  {str(when)[:25]:<26} "
              f"{present[:1]}..{present[-1:] if present else []}")

    json.dump(out, open(os.path.join(EV, "requirement-dating-2026-08-11.json"), "w"),
              indent=1)


if __name__ == "__main__":
    main()
