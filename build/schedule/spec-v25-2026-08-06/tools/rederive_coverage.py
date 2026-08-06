#!/usr/bin/env python3
"""Re-derive the Schedule requirement <-> case map from scratch, in BOTH directions
(Standing Rule 43: re-derive, never patch).

READ-ONLY. Inputs:
  - the extraction produced by extract_requirements.py (current spec version)
  - the LIVE TestRail case bodies for the project's cases (pulled with get_cases)
  - the project's testrail-id-map.csv (internal id <-> C-id <-> refs)

Direction 1  requirement -> case(s)   finds UNCOVERED requirements
Direction 2  case -> requirement      finds STALE / ORPHANED anchors

Matching is deliberately conservative and TRANSPARENT: a candidate is proposed by
section anchor and scored by content-word overlap, and the single best-matching
line of the case's own text is emitted beside the requirement text so both texts
can be read side by side (Rule 45(e)). The score is an aid to the reader, never a
verdict: every row still gets a human verdict in COVERAGE-REDERIVATION.md.
"""
import csv
import json
import re
import sys
from collections import defaultdict

STOP = set("""a an the and or of to in on for with by is are be been was were it its
this that these those at as from not no if when then than so such each per any all
both other another same only also which what where who whom whose how while during
you your they their there here we our us can cannot could should would may might
must will shall do does did done has have had having but into out up down over under
above below off again further once more most some few own very s t don now shows show
shown showing appears appear appearing use uses used using open opens opened""".split())


def words(txt):
    return {w for w in re.findall(r"[a-z0-9]+", txt.lower()) if w not in STOP and len(w) > 2}


def case_lines(c):
    out = []
    for field in ("title", "custom_preconds", "custom_steps", "custom_expected"):
        v = c.get(field) or ""
        for ln in str(v).split("\n"):
            ln = ln.strip()
            # skip the provenance block, the automation marker and the Rule-61 outcome bullets
            if not ln or ln.startswith("---") or ln.startswith("AUTOMATION:"):
                continue
            if ln.startswith("·") or ln.startswith("This is the expected behaviour as per"):
                continue
            out.append((field, ln))
    return out


def main(extract, tr_cases, idmap_csv, out_json):
    recs = json.load(open(extract))
    reqs = [r for r in recs if r["class"] == "REQ"]
    cases = json.load(open(tr_cases))

    idmap = {}
    anchors_by_case = {}
    for row in csv.DictReader(open(idmap_csv)):
        cid = int(row["testrail_case_id"])
        idmap[cid] = row["internal_id"]
        anchors_by_case[cid] = set(re.findall(r"§(\d+(?:\.\d+)*)", row["refs"]))

    cases_by_anchor = defaultdict(list)
    for cid, ancs in anchors_by_case.items():
        for a in ancs:
            cases_by_anchor[a].append(cid)

    # ---------- direction 1: requirement -> case(s) ----------
    d1 = []
    for i, r in enumerate(reqs):
        sec = r["section"]
        rw = words(r["text"])
        # candidates: cases anchored on this section, or on a parent/child of it
        cand = set(cases_by_anchor.get(sec, []))
        for a, cs in cases_by_anchor.items():
            if a.startswith(sec + ".") or sec.startswith(a + "."):
                cand |= set(cs)
        scored = []
        for cid in cand:
            c = cases[str(cid)]
            best, bestln, bestfield = 0.0, "", ""
            for field, ln in case_lines(c):
                lw = words(ln)
                if not lw:
                    continue
                ov = len(rw & lw) / max(1, len(rw))
                if ov > best:
                    best, bestln, bestfield = ov, ln, field
            scored.append((round(best, 3), cid, bestfield, bestln))
        scored.sort(reverse=True)
        d1.append({"req_id": f"§{sec}-L{i + 1}", "section": sec, "req_text": r["text"],
                   "n_candidates": len(cand),
                   "best": scored[:3]})

    # ---------- direction 2: case -> requirement ----------
    spec_sections = {r["section"] for r in recs if r["section"]}
    d2 = []
    for cid, ancs in sorted(anchors_by_case.items()):
        stale = sorted(a for a in ancs if a not in spec_sections)
        d2.append({"cid": cid, "internal_id": idmap[cid], "anchors": sorted(ancs),
                   "stale_anchors": stale, "no_anchor": not ancs})

    json.dump({"d1": d1, "d2": d2,
               "spec_sections": sorted(spec_sections,
                                       key=lambda s: [int(x) for x in s.split(".")])},
              open(out_json, "w"), indent=1)

    unc = [r for r in d1 if r["n_candidates"] == 0]
    weak = [r for r in d1 if r["n_candidates"] and (not r["best"] or r["best"][0][0] < 0.25)]
    print(f"DIRECTION 1  requirement -> case")
    print(f"  requirement lines (REQ)      : {len(reqs)}")
    print(f"  with >=1 candidate case      : {len(reqs) - len(unc)}")
    print(f"  with ZERO candidate case     : {len(unc)}")
    print(f"  weak best-match (<0.25)      : {len(weak)}")
    print(f"DIRECTION 2  case -> requirement")
    print(f"  cases                        : {len(d2)}")
    print(f"  with a STALE anchor          : {sum(1 for x in d2 if x['stale_anchors'])}")
    print(f"  with NO section anchor at all: {sum(1 for x in d2 if x['no_anchor'])}")
    print(f"  spec sections                : {len(spec_sections)}")
    covered_sec = {s for s in spec_sections if cases_by_anchor.get(s)}
    print(f"  sections with >=1 case       : {len(covered_sec)}")
    print(f"  sections with NO case        : {sorted(spec_sections - covered_sec, key=lambda s: [int(x) for x in s.split('.')])}")
    print("\nZERO-CANDIDATE REQUIREMENT LINES:")
    for r in unc:
        print(f"  {r['req_id']:<12} {r['req_text'][:150]}")


if __name__ == "__main__":
    main(*sys.argv[1:])
