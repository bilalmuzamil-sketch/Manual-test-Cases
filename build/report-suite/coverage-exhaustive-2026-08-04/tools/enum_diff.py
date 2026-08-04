#!/usr/bin/env python3
"""ENUMERATION DIFF — the SBR-EXP-10 defect class, hunted deliberately.

On 2026-07-31 SBR-EXP-10 / SBR-EXP-11 enumerated CSV headers "exactly" WITHOUT the
Location column that SBR v15 S14-R20 had added two days earlier, so a tester on a correct
build would have failed a passing build. That defect was found only because an outside
automated case disagreed with ours.

This tool hunts the same class mechanically: for every CLOSED ENUMERATION in a case, it
extracts the enumerated item list, extracts the item list from the SAME enumeration in the
governing spec requirement(s), and DIFFS them in BOTH DIRECTIONS:
    in the spec but MISSING from the case   -> the dangerous direction (stale case)
    in the case but NOT in the spec         -> case asserts more than the spec says

OUTPUT ../data/enum-diff.json
"""
import json
import os
import re
import sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.abspath(os.path.join(HERE, "..", "data"))

LIST_TRIGGER = re.compile(
    r"(?:in (?:this )?exact order[^:]{0,40}:|in order,? are[^:]{0,20}:?|are exactly:?|"
    r"read exactly:?|exactly these[^:]{0,40}:|are, in order:?|, in order:|"
    r"columns?(?: appear| are| show)?[^:]{0,40}:|headers?,? in order,? are[^:]{0,20}:?|"
    r"options?,? in (?:this )?order:?|offers exactly[^:]{0,30}:)", re.I)

SPLIT = re.compile(r"\s*(?:,|;|\||\band\b|→|->)\s*")
DROP = re.compile(r"^(?:then|the|a|an|of|in|with|no|and|or|plus|also|each|its?)$", re.I)


def items_after(text, start):
    """Take the enumeration that follows position `start`, up to a sentence break."""
    tail = text[start:start + 460]
    tail = re.split(r"(?:\.\s+[A-Z])|(?:\n\s*\d+\.)|(?:\s—\s)|(?:\s-\s[a-z])", tail)[0]
    tail = re.sub(r"^[^:]{0,60}:", "", tail, count=1)
    out = []
    for p in SPLIT.split(tail):
        p = p.strip().strip('."“”()[]*_ ')
        p = re.sub(r"\s*\(\d+ columns?\)\s*$", "", p)
        if not p or DROP.match(p) or len(p) > 46:
            continue
        if not re.search(r"[A-Za-z]", p):
            continue
        out.append(p)
    return out


def norm_item(s):
    s = s.lower().replace("’", "'")
    s = re.sub(r"[^a-z0-9%#/. ]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    s = re.sub(r"^(download|the)\s+", "", s)
    return s


def extract(text):
    """All enumerations in a blob -> list of lists."""
    lists = []
    for m in LIST_TRIGGER.finditer(text or ""):
        it = items_after(text, m.end())
        if len(it) >= 3:
            lists.append(it)
    return lists


def main():
    ca = json.load(open(os.path.join(DATA, "case-anchors.json")))
    reqs = json.load(open(os.path.join(DATA, "requirements.json")))
    r42 = json.load(open(os.path.join(DATA, "rule42-rows.json")))
    targets = {r["c_id"]: r for r in r42 if r["true_closed_list"]}

    findings = []
    for c in ca.values():
        if c["c_id"] not in targets:
            continue
        case_lists = extract(c["expected"])
        if not case_lists:
            findings.append({"internal_id": c["internal_id"], "c_id": c["c_id"],
                             "prefix": c["prefix"], "status": "NO-EXTRACTABLE-LIST",
                             "note": "closer present but no >=3-item comma list could be "
                                     "extracted mechanically — read by hand",
                             "anchors": c["anchors"], "refs": c["refs"]})
            continue
        spec_lists = []
        for a in c["anchors"]:
            key = f"{c['prefix']}:{a}"
            if key in reqs:
                for L in extract(reqs[key]["text_clean"]):
                    spec_lists.append((a, L))
        best = None
        for cl in case_lists:
            cn = {norm_item(x) for x in cl}
            for a, sl in spec_lists:
                sn = {norm_item(x) for x in sl}
                overlap = len(cn & sn) / max(1, len(cn | sn))
                cand = {"anchor": a, "case_list": cl, "spec_list": sl,
                        "in_spec_missing_from_case": sorted(sn - cn),
                        "in_case_not_in_spec": sorted(cn - sn),
                        "jaccard": round(overlap, 3)}
                if best is None or cand["jaccard"] > best["jaccard"]:
                    best = cand
        if best is None:
            findings.append({"internal_id": c["internal_id"], "c_id": c["c_id"],
                             "prefix": c["prefix"], "status": "NO-SPEC-LIST-TO-COMPARE",
                             "case_lists": case_lists, "anchors": c["anchors"],
                             "refs": c["refs"]})
            continue
        status = "MATCH" if not best["in_spec_missing_from_case"] else "SPEC-HAS-MORE"
        if best["jaccard"] < 0.4:
            status = "LOW-CONFIDENCE-PAIRING"
        findings.append({"internal_id": c["internal_id"], "c_id": c["c_id"],
                         "prefix": c["prefix"], "status": status,
                         "refs": c["refs"], **best})

    json.dump(findings, open(os.path.join(DATA, "enum-diff.json"), "w"),
              indent=1, ensure_ascii=False)
    print("closed-list cases examined :", len(findings))
    print("status                     :", dict(sorted(Counter(f["status"] for f in findings).items())))
    for f in findings:
        if f["status"] == "SPEC-HAS-MORE":
            print(f"  !! {f['prefix']:4} {f['internal_id']:14} C{f['c_id']} anchor={f['anchor']} "
                  f"MISSING FROM CASE: {f['in_spec_missing_from_case']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
