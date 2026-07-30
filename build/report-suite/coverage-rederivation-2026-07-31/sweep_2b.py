#!/usr/bin/env python3
"""Rule-28 Stage-2b cross-case consistency sweep over the changed cases + neighbours.

Four mechanical checks, output read by hand:
  1. CONTROL GROUPING - group every active case by the control/behaviour it asserts on
     (here: the Location column, the exports, the Column Selection control) and diff the
     expected results inside each group.
  2. OPPOSITE-ASSERTION KEYWORD SWEEP - hidden/shown, present/absent, included/excluded,
     Multiple/never-Multiple, immediately/on-reload, editable/read-only.
  3. TITLE-vs-EXPECTED on every touched case.
  4. SAME-ANCHOR CLUSTERING - cases citing the same requirement id must not contradict.
"""
import csv
import glob
import json
import os
import re
import sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
RS = os.path.abspath(os.path.join(HERE, ".."))

TOUCHED = ["SBC-LOC-04", "SBR-LOC-05", "PV-FILT-14", "TU-LOC-06", "IV-LOC-06", "TU-COL-01",
           "SBC-EXP-02", "SBC-EXP-03", "SBC-EXP-04", "SBC-EXP-10", "SBC-EXP-14",
           "SBR-PERS-04", "SBR-STATE-01", "TU-NAV-03", "WIP-TAB-01", "WIP-SCOPE-05",
           "WIP-EXP-02", "WIP-FLT-09", "IV-NAV-06"]

OPPOSITES = [
    (r"\bis hidden\b|\bnot shown\b|\bis absent\b|\bnever (?:shown|listed|offered)\b",
     r"\bis shown\b|\bappears\b|\bis present\b|\bis offered\b|\bis listed\b"),
    (r'reads? "Multiple"|shows "Multiple"', r'never (?:shows|reads) "Multiple"'),
    (r"\bincluded in (?:all|both|every)\b", r"\b(?:not included|excluded) (?:in|from)\b"),
    (r"\bimmediately\b|\bwith no reload\b", r"\bafter a reload\b|\bon reload\b"),
    (r"\bread-only\b|\bcannot be (?:edited|turned off)\b", r"\beditable\b|\bcan be edited\b"),
]


def load():
    out = {}
    for f in sorted(glob.glob(os.path.join(RS, "cases", "*.json"))):
        for c in json.load(open(f, encoding="utf-8")):
            if c.get("viu_status") == "VIU-Pending":
                out[c["id"]] = c
    return out


def main():
    cases = load()
    idmap = {r["internal_id"]: r["testrail_case_id"]
             for r in csv.DictReader(open(os.path.join(RS, "testrail-id-map.csv"),
                                         encoding="utf-8"))}
    cid = lambda k: idmap.get(k, "no-C-id")

    # ---- 1. control grouping ------------------------------------------------
    print("=" * 78)
    print("1. CONTROL GROUPING - every active case asserting on the Location column")
    for k, c in sorted(cases.items()):
        blob = " ".join(c["expected"])
        if re.search(r"Location column", blob, re.I):
            rep = k.split("-")[0]
            exp_screen = [e for e in c["expected"] if re.search(r"Location column", e, re.I)]
            print(f"\n  [{rep}] {k} = {cid(k)}")
            for e in exp_screen:
                print("      " + e[:200])

    print("\n" + "=" * 78)
    print("   ... and every active case asserting the Location column INSIDE an export")
    for k, c in sorted(cases.items()):
        for e in c["expected"]:
            if re.search(r"Location column|column is headed|Locations:", e, re.I) and \
               re.search(r"download|export|CSV|PDF|file", e, re.I):
                print(f"  {k:<13}{cid(k):<9}{e[:190]}")

    # ---- 2. opposite-assertion sweep ---------------------------------------
    print("\n" + "=" * 78)
    print("2. OPPOSITE-ASSERTION SWEEP over the touched cases and their report siblings")
    hits = 0
    for k in TOUCHED:
        rep = k.split("-")[0]
        for pos, neg in OPPOSITES:
            mine = [e for e in cases[k]["expected"] if re.search(pos, e, re.I)]
            if not mine:
                continue
            for k2, c2 in cases.items():
                if k2 == k or not k2.startswith(rep + "-"):
                    continue
                theirs = [e for e in c2["expected"] if re.search(neg, e, re.I)]
                if not theirs:
                    continue
                # only interesting when they talk about the same noun
                nouns = set(re.findall(r"\b(Location|Totals|Subtotal|Column Selection|"
                                       r"Multiple|Summary|Status|Type)\b",
                                       " ".join(mine), re.I))
                nouns = {n.lower() for n in nouns}
                for t in theirs:
                    if nouns & {w.lower() for w in re.findall(
                            r"\b(Location|Totals|Subtotal|Column Selection|Multiple|"
                            r"Summary|Status|Type)\b", t, re.I)}:
                        hits += 1
                        print(f"\n  CHECK  {k}={cid(k)}  vs  {k2}={cid(k2)}")
                        print(f"    A: {mine[0][:170]}")
                        print(f"    B: {t[:170]}")
    print(f"\n  candidate pairs surfaced for hand review: {hits}")

    # ---- 3. title vs expected ----------------------------------------------
    print("\n" + "=" * 78)
    print("3. TITLE-vs-EXPECTED on every touched case (title len must be <= 80)")
    for k in TOUCHED:
        c = cases[k]
        print(f"  {k:<13}{cid(k):<9}len={len(c['title']):>3}  {c['title']}")

    # ---- 4. same-anchor clustering -----------------------------------------
    print("\n" + "=" * 78)
    print("4. SAME-ANCHOR CLUSTERS touching the changed requirements")
    changed_reqs = {"SBC": ["S4-R13", "S4-R12", "S4-R12a"],
                    "SBR": ["S14-R20", "S21-R7", "S21-R8"],
                    "PV": ["S6-R11", "S2-R12", "S3-R10"],
                    "TU": ["S7-R13", "S9-R9", "S9-R10", "S8-R16"],
                    "IV": ["S10-R15", "S7-R6", "S7-R7"],
                    "WIP": ["S9-R10a", "S10-R5a", "S7-R13", "S7-R14"]}
    for rep, reqs in changed_reqs.items():
        for rq in reqs:
            owners = [k for k, c in cases.items()
                      if k.startswith(rep + "-")
                      and re.search(r"\b" + re.escape(rq) + r"\b", c.get("spec_ref", ""))]
            if len(owners) > 1:
                print(f"\n  {rep} {rq} cited by {len(owners)}: "
                      + ", ".join(f"{o}={cid(o)}" for o in sorted(owners)))


if __name__ == "__main__":
    main()
