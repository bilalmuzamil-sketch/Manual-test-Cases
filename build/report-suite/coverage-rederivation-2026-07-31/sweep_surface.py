#!/usr/bin/env python3
"""SAME-REQUIREMENT-DIFFERENT-SURFACE sweep (new Rule-28 Stage-2b check, 2026-07-31).

The defect class this catches: a requirement that governs TWO surfaces — the screen AND
the exported file (or the mobile view, or the API) — where our cases only ever assert it
on ONE of them. That is how the per-row Location column ended up covered on screen in
five reports and in no export at all: the covering case satisfied the anchor, so a
coverage matrix looked green.

Mechanically, for every one of the 895 current requirements:
  * classify which SURFACES the requirement's own verbatim text speaks about
      SCREEN  - on screen / the report shows / the column is shown / the toolbar
      EXPORT  - export / download / CSV / PDF / the file / print
      MOBILE  - mobile / narrow / phone / breakpoint
      API     - endpoint / HTTP / request / response / status code
  * classify which surfaces its covering cases' EXPECTED RESULTS actually assert on
  * report every requirement whose surface set is NOT fully covered by its cases

Output is a report, not an edit. Read by hand: some splits are legitimate (a requirement
naming a surface only to exclude it), which is why every hit is printed with its text.
"""
import csv
import glob
import json
import os
import re
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
RS = os.path.abspath(os.path.join(HERE, ".."))

SURFACES = {
    "EXPORT": re.compile(r"\bexport(s|ed|ing)?\b|\bdownload(s|ed|ing)?\b|\bCSV\b|\bPDF\b"
                         r"|\bprint(s|ed|ing)?\b|\bthe file\b|\bfile name\b", re.I),
    "MOBILE": re.compile(r"\bmobile\b|\bnarrow (?:screen|viewport)\b|\bphone\b"
                         r"|\bbreakpoint\b|\btouch\b", re.I),
    "API": re.compile(r"\bendpoint\b|\bHTTP\b|\bGET /|\bPOST /|\bstatus code\b"
                      r"|\bserver returns\b|\bresponse\b|\brequest payload\b", re.I),
    "SCREEN": re.compile(r"\bon screen\b|\bon-screen\b|\bthe report shows\b|\bis shown\b"
                         r"|\bthe table\b|\bthe toolbar\b|\bthe column is\b|\bthe user sees\b"
                         r"|\bis hidden\b|\bthe page\b|\brenders\b|\bdisplays\b", re.I),
}

# a requirement that mentions a surface only to EXCLUDE it is not a split
EXCLUSIONARY = re.compile(r"\bnot (?:included|exported|printed|shown) in\b|\bnever (?:in|on) the "
                          r"(?:export|download|CSV|PDF)\b|\bexcluded from the (?:export|CSV|PDF)\b"
                          r"|\bout of scope\b|\bno (?:export|download)\b", re.I)


def load_cases():
    out = {}
    for f in sorted(glob.glob(os.path.join(RS, "cases", "*.json"))):
        for c in json.load(open(f, encoding="utf-8")):
            if c.get("viu_status") == "VIU-Pending":
                out[c["id"]] = c
    return out


def surfaces_of(text):
    return {name for name, rx in SURFACES.items() if rx.search(text or "")}


def main():
    cases = load_cases()
    idmap = {r["internal_id"]: r["testrail_case_id"]
             for r in csv.DictReader(open(os.path.join(RS, "testrail-id-map.csv"),
                                         encoding="utf-8"))}
    rows = list(csv.DictReader(open(os.path.join(HERE, "requirement-coverage.csv"),
                                   encoding="utf-8")))

    findings = []
    for r in rows:
        if not (r["status"].startswith("COVERED") or r["status"] == "GAP-CLOSED"):
            continue
        req_surf = surfaces_of(r["requirement_text"])
        # only the multi-surface requirements are interesting
        interesting = req_surf & {"EXPORT", "MOBILE", "API"}
        if not interesting:
            continue
        if EXCLUSIONARY.search(r["requirement_text"]):
            continue
        owners = [x.strip() for x in r["covering_cases"].split(";") if x.strip()]
        case_surf = set()
        for o in owners:
            c = cases.get(o)
            if not c:
                continue
            # a case is "on" a surface if ANY of its preconditions/steps/expected put the
            # tester there - an expected line can assert an exported column without the
            # word "PDF" in that line, because the step already opened the file
            case_surf |= surfaces_of(" ".join(list(c["preconditions"]) + list(c["steps"])
                                              + list(c["expected"]) + [c["title"]]))
        missing = interesting - case_surf
        if missing:
            findings.append((r, sorted(missing), owners))

    print("=" * 80)
    print("SAME-REQUIREMENT-DIFFERENT-SURFACE SWEEP")
    print(f"requirements examined: {len(rows)}")
    multi = sum(1 for r in rows if surfaces_of(r['requirement_text']) &
                {'EXPORT', 'MOBILE', 'API'})
    print(f"requirements that speak about a non-screen surface: {multi}")
    print(f"of those, covering cases assert NOTHING on that surface: {len(findings)}")
    print("=" * 80)
    by_rep = Counter(f[0]["report_prefix"] for f in findings)
    print("by report:", dict(by_rep))
    print()
    for r, missing, owners in findings:
        print(f"--- {r['report_prefix']} {r['requirement_id']}  MISSING SURFACE: "
              f"{'/'.join(missing)}")
        print(f"    req : {r['requirement_text'][:300]}")
        print(f"    case: " + ", ".join(f"{o}={idmap.get(o, '?')}" for o in owners))
    json.dump([{"report": r["report_prefix"], "req": r["requirement_id"],
                "missing_surface": m, "cases": o,
                "text": r["requirement_text"]} for r, m, o in findings],
              open(os.path.join(HERE, "surface-split-findings.json"), "w",
                   encoding="utf-8"), indent=1)


if __name__ == "__main__":
    main()
