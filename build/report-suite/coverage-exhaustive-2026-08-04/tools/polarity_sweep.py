#!/usr/bin/env python3
"""POLARITY SWEEP — the safety net under the overlap score (Standing Rule 50, exact half).

A high content-word overlap between a requirement and a case's expected result can occur
when the case asserts the EXACT OPPOSITE using the same vocabulary ("the filter IS shown"
vs "the filter is NOT shown"). Overlap alone therefore cannot substantiate coverage.

This sweep runs over EVERY row (not a sample) and flags any row where the requirement text
and the quoted expected text disagree on polarity or on an opposed-pair keyword. Every flag
is then read by hand.

OUTPUT ../data/polarity-flags.json
"""
import json
import os
import re
import sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.abspath(os.path.join(HERE, "..", "data"))

NEG = re.compile(r"\b(not|never|no|none|without|nor|hidden|absent|excluded|cannot|can't|"
                 r"does not|do not|is not|are not|neither|un\w+ed|off by default)\b", re.I)

# opposed pairs: if one side asserts A and the other asserts B, that is a contradiction signal
PAIRS = [
    (r"\bshown\b|\bvisible\b|\bappears?\b|\bpresent\b", r"\bhidden\b|\bnot shown\b|\babsent\b|\bnot (?:be )?(?:visible|present)\b"),
    (r"\bautomatic(?:ally)?\b|\bon its own\b|\bby itself\b", r"\btoggle\b|\bcolumn selector\b|\bcolumn.selection\b"),
    (r"\benabled\b|\bon by default\b", r"\bdisabled\b|\boff by default\b"),
    (r"\bleftmost\b|\bfirst column\b", r"\brightmost\b|\blast column\b|\bafter\b"),
    (r"\beditable\b", r"\bread.only\b|\blocked\b"),
    (r"\breal.time\b|\bimmediately\b", r"\bon Apply\b|\bafter (?:pressing|clicking) Apply\b"),
    (r"\bordinary reports access\b|\bstandard reports access\b|\bone permission\b",
     r"\bdedicated\b.{0,24}\bpermission\b|\breport-specific permission\b|\bInventory Reports\b"),
    (r"\bunit ?#? on the first line\b|\bunit number on the first line\b", r"\bVIN\b.{0,40}\bmain identifier\b|\bidentifies the asset by (?:its )?VIN\b"),
]


def pol(s):
    return len(NEG.findall(s or ""))


def main():
    rows = json.load(open(os.path.join(DATA, "coverage-rows.json")))
    flags = []
    for i, r in enumerate(rows):
        a, q = r["assertion_text"], r["covering_expected_quote"]
        if not q:
            continue
        reasons = []
        # 1. polarity count mismatch on an otherwise strongly-overlapping pair
        if r["overlap_score"] >= 0.25:
            pa, pq = pol(a), pol(q)
            if (pa == 0) != (pq == 0):
                reasons.append(f"negation-imbalance req_neg={pa} quote_neg={pq}")
        # 2. opposed-pair keywords
        for lhs, rhs in PAIRS:
            al, ar = bool(re.search(lhs, a, re.I)), bool(re.search(rhs, a, re.I))
            ql, qr = bool(re.search(lhs, q, re.I)), bool(re.search(rhs, q, re.I))
            if (al and not ar and qr and not ql) or (ar and not al and ql and not qr):
                reasons.append(f"opposed-pair /{lhs[:34]}/ vs /{rhs[:34]}/")
        if reasons:
            flags.append({"row_index": i, "prefix": r["prefix"],
                          "requirement_id": r["requirement_id"],
                          "assertion_index": r["assertion_index"],
                          "quote_from_c_id": r["quote_from_c_id"],
                          "overlap_score": r["overlap_score"],
                          "assertion_text": a, "quote": q, "reasons": reasons})
    json.dump(flags, open(os.path.join(DATA, "polarity-flags.json"), "w"),
              indent=1, ensure_ascii=False)
    print("rows scanned :", len(rows))
    print("flags        :", len(flags))
    print("by spec      :", dict(sorted(Counter(f["prefix"] for f in flags).items())))
    for f in flags:
        print(f"  {f['prefix']:4} {f['requirement_id']:10} a{f['assertion_index']} {f['quote_from_c_id']:8} "
              f"{';'.join(f['reasons'])[:70]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
