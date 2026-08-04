#!/usr/bin/env python3
"""READ-ONLY case search over the 475 active Report Suite cases."""
import json, glob, csv, re, sys, os
BASE = "/home/user/Manual-test-Cases/build/report-suite"

def load():
    cases = []
    for f in sorted(glob.glob(os.path.join(BASE, "cases", "*.json"))):
        d = json.load(open(f))
        for c in (d if isinstance(d, list) else []):
            if str(c.get("viu_status", "")).startswith("Retired"): continue
            cases.append(c)
    cid = {}
    with open(os.path.join(BASE, "testrail-id-map.csv")) as fh:
        for row in csv.DictReader(fh):
            k = (row.get("internal_id") or row.get("id") or "").strip()
            v = (row.get("testrail_case_id") or row.get("case_id") or row.get("C-ID") or "").strip()
            if k: cid[k] = v
    return cases, cid

def blob(c):
    parts = [c.get("title", "")]
    for f in ("preconditions", "steps", "expected", "notes"):
        v = c.get(f)
        if isinstance(v, list): parts += [str(x) for x in v]
        elif v: parts.append(str(v))
    return "\n".join(parts)

def search(pat, cases, cid, show=0, flags=re.I):
    rx = re.compile(pat, flags)
    hits = [c for c in cases if rx.search(blob(c))]
    print("PATTERN %r -> %d hit(s)" % (pat, len(hits)))
    for c in hits:
        print("  %-16s C%-6s %s" % (c["id"], cid.get(c["id"],"?").lstrip("C"), c["title"][:95]))
        if show:
            b = blob(c)
            for m in rx.finditer(b):
                s = max(0, m.start() - show); e = min(len(b), m.end() + show)
                print("      ...%s..." % b[s:e].replace("\n", " ⏎ "))
    return hits

if __name__ == "__main__":
    cases, cid = load()
    print("active cases:", len(cases), "| id-map entries:", len(cid))
    for p in sys.argv[1:]:
        print(); search(p, cases, cid, show=int(os.environ.get("CTX", "0")))
