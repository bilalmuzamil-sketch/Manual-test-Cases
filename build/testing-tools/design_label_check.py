#!/usr/bin/env python3
"""Rule 124: every on-screen word a draft case tells the tester to click or read (text in double quotes in preconditions
and steps) must appear in the design or the spec. Prints the labels found nowhere, with the cases using them; the
misses must be example data only.
  python3 design_label_check.py --corpus <design/spec/crawl files or globs …> --proposals <proposals JSON glob>"""
import argparse, json, glob, re, html, collections
ap = argparse.ArgumentParser(); ap.add_argument("--corpus", nargs="+", required=True); ap.add_argument("--proposals", required=True); a = ap.parse_args()
C = html.unescape("\n".join(open(f, errors="ignore").read() for g in a.corpus for f in glob.glob(g, recursive=True))).lower().replace("’", "'")
miss = collections.defaultdict(list); n = 0
for f in sorted(glob.glob(a.proposals)):
    d = json.load(open(f))
    for p in d.get("updates", []) + d.get("new", []):
        k = p.get("case_id") or p.get("key")
        for line in p["preconds"] + p["steps"]:
            for lab in re.findall(r'"([^"]{2,60})"', line):
                n += 1
                if lab.lower().replace("’", "'") not in C and not lab.startswith(("ZZAUTOTEST", "e.g")): miss[lab].append(str(k))
print("quoted labels checked:", n, "· not found in design or spec:", len(miss))
for lab, ks in sorted(miss.items(), key=lambda x: -len(x[1])): print(f"  {lab!r}: {', '.join(ks[:8])}{' …' if len(ks) > 8 else ''}")
