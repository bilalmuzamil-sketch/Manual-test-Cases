#!/usr/bin/env python3
"""REVERSE COVERAGE DIFF — the outside-in direction (Standing Rule 45a).

The overlap direction ("which of THEIR cases duplicate OURS") is the easy half. This is the
REVERSE half: for each FOREIGN case, rank OUR cases in the same report by assertion overlap,
so an assertion of theirs with no counterpart of ours becomes visible as a COVERAGE SIGNAL.

READ-ONLY. It reads the committed snapshot; it never calls a write endpoint and never touches
a foreign case (Rule 38).

Sanity check it must pass: run against C38923 (the case that exposed our 2026-07-31 export
defect) and SBR-EXP-10 / SBR-EXP-11 must surface in the top candidates.

Usage: python3 reverse_diff.py            # writes ../data/reverse-diff.json
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.abspath(os.path.join(HERE, "..", "data"))
TR = "https://shopview.testrail.io/index.php?/cases/view/"
TOP = 5

STOP = set("""a an the and or but of to in on at by for with from as is are was were be been
being it its their there here not no nor so such when while where which who whose what how
why any all each every both either neither only also just does do did done can could may
might must shall should will would has have had into over under about above below between
across per via up down out off again further more most other some own same too very report
reports case cases test tests you your""".split())


def words(s):
    return {w for w in re.sub(r"[^a-z0-9%$#/.\- ]", " ", (s or "").lower()).split()
            if w and w not in STOP and len(w) > 1}


def main():
    snap = json.load(open(os.path.join(DATA, "live-cases-4281.json")))
    ours = json.load(open(os.path.join(DATA, "case-anchors.json")))
    foreign = [c for c in snap["cases"] if c.get("created_by") != 3]

    out = []
    for f in foreign:
        prefix = (f.get("_section_name") or "").split(" ")[0]
        # his assertions are only inferable from title + steps: there are no expected results
        steps = f.get("custom_steps") or ""
        sep = f.get("custom_steps_separated") or []
        if isinstance(sep, list):
            steps += " " + " ".join(str(s.get("content", "")) + " " + str(s.get("expected", ""))
                                    for s in sep if isinstance(s, dict))
        fw = words(f.get("title", ""))
        cands = []
        for c in ours.values():
            if c["prefix"] != prefix:
                continue
            sc = len(fw & words(c["title"] + " " + c["expected"])) / max(1, len(fw))
            cands.append((round(sc, 3), c["internal_id"], c["c_id"], c["title"]))
        cands.sort(reverse=True)
        out.append({
            "foreign_c_id": f["id"], "foreign_title": f.get("title"),
            "foreign_created_by": f.get("created_by"),
            "foreign_refs": f.get("refs"),
            "foreign_updated_on": f.get("updated_on"),
            "report_prefix": prefix,
            "our_cases_in_report": sum(1 for c in ours.values() if c["prefix"] == prefix),
            "top_candidates": [{"score": s, "internal_id": i, "c_id": f"C{cid}",
                                "link": TR + str(cid), "title": t}
                               for s, i, cid, t in cands[:TOP]],
        })
        print(f"FOREIGN C{f['id']} [{prefix}] {f.get('title')[:70]}")
        for s, i, cid, t in cands[:TOP]:
            print(f"   {s:5}  {i:14} C{cid} | {t[:70]}")

    json.dump(out, open(os.path.join(DATA, "reverse-diff.json"), "w"),
              indent=1, ensure_ascii=False)

    # sanity check: the 2026-07-31 catch must reproduce from cold
    row = next(r for r in out if r["foreign_c_id"] == 38923)
    hit = {c["c_id"] for c in row["top_candidates"]} & {"C30285", "C30286"}
    print(f"\nSANITY CHECK — C38923 top-{TOP} contains the two 2026-07-31 defect cases: "
          f"{sorted(hit) or 'NO — the checker would NOT have caught it'}")
    return 0 if hit else 1


if __name__ == "__main__":
    sys.exit(main())
