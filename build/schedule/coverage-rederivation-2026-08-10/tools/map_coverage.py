#!/usr/bin/env python3
"""Build the Schedule requirement<->case map from scratch, in BOTH directions,
at ASSERTION granularity (Standing Rules 43 + 45(e)).

READ-ONLY. Nothing here can write to TestRail or Jira.

Direction 1  assertion -> case(s)   finds UNCOVERED and PARTIAL assertions
Direction 2  case -> requirement    finds STALE / ORPHANED anchors

The matcher PROPOSES; it never verdicts. For every assertion it emits the
best-matching line of the best-matching case's own text, so both texts sit side
by side for the hand pass to read (Rule 45(e)). The score is a reading aid.
Every verdict in COVERAGE-MAP.md is made by hand against these two texts.
"""
import csv, json, re, sys
from collections import defaultdict

STOP = set("""a an the and or of to in on for with by is are be been was were it its
this that these those at as from not no if when then than so such each per any all
both other another same only also which what where who whom whose how while during
you your they their there here we our us can cannot could should would may might
must will shall do does did done has have had having but into out up down over under
above below off again further once more most some few own very s t don now shows show
shown showing appears appear appearing use uses used using open opens opened see""".split())


def words(txt):
    return {w for w in re.findall(r"[a-z0-9]+", txt.lower()) if w not in STOP and len(w) > 2}


def case_lines(c):
    """Tester-facing text only. The provenance line, the automation marker and the
    divergence sentence are METADATA about the case, not assertions the case makes,
    so matching against them would manufacture false coverage."""
    out = []
    for field in ("title", "custom_preconds", "custom_steps", "custom_expected"):
        v = str(c.get(field) or "")
        for ln in v.split("\n"):
            ln = ln.strip()
            if not ln or ln.startswith("---") or ln.startswith("AUTOMATION:"):
                continue
            if ln.startswith("This is the expected behaviour as per"):
                continue
            out.append((field, re.sub(r"^\d+\.\s*", "", ln)))
    return out


def main(assertions, tr_json, idmap_csv, out_json):
    rows = json.load(open(assertions))
    cases = {c["id"]: c for c in json.load(open(tr_json))["cases"]}

    internal = {}
    for r in csv.DictReader(open(idmap_csv)):
        cid = (r.get("testrail_case_id") or "").strip()
        if cid.isdigit():
            internal[int(cid)] = r.get("internal_id") or r.get("id") or ""

    anchors = {cid: set(re.findall(r"§(\d+(?:\.\d+)*)", c.get("refs") or ""))
               for cid, c in cases.items()}
    by_anchor = defaultdict(set)
    for cid, ancs in anchors.items():
        for a in ancs:
            by_anchor[a].add(cid)

    lines_cache = {cid: case_lines(c) for cid, c in cases.items()}

    d1 = []
    for r in rows:
        sec = r["section"]
        aw = words(r["assertion_text"])
        cand = set(by_anchor.get(sec, set()))
        for a, cs in by_anchor.items():          # parent and child anchors count
            if a.startswith(sec + ".") or sec.startswith(a + "."):
                cand |= cs
        scored = []
        for cid in cand:
            best, bl, bf = 0.0, "", ""
            for field, ln in lines_cache[cid]:
                lw = words(ln)
                if not lw:
                    continue
                ov = len(aw & lw) / max(1, len(aw))
                if ov > best:
                    best, bl, bf = ov, ln, field
            scored.append({"cid": cid, "internal": internal.get(cid, ""),
                           "score": round(best, 3), "field": bf, "case_line": bl})
        scored.sort(key=lambda x: -x["score"])
        d1.append({**r, "n_candidates": len(cand), "top": scored[:4]})

    spec_sections = {x["section"] for x in json.load(open(assertions))}
    all_sections = {rr["section"] for rr in json.load(open(
        assertions.replace("assertions-", "extract-"))) if rr["section"]}
    d2 = []
    for cid, c in sorted(cases.items()):
        ancs = sorted(anchors[cid])
        d2.append({"cid": cid, "internal": internal.get(cid, ""), "title": c["title"],
                   "refs": c.get("refs") or "", "anchors": ancs,
                   "stale": sorted(a for a in ancs if a not in all_sections),
                   "no_anchor": not ancs,
                   "spec_version_stamped": (re.search(r"specification version (\d+)",
                                                      c.get("custom_expected") or "") or [None, None])[1]})

    json.dump({"d1": d1, "d2": d2, "sections_with_assertions": sorted(spec_sections,
               key=lambda s: [int(x) for x in s.split(".")])}, open(out_json, "w"), indent=1)

    zero = [x for x in d1 if x["n_candidates"] == 0]
    weak = [x for x in d1 if x["n_candidates"] and (not x["top"] or x["top"][0]["score"] < 0.30)]
    print(f"DIRECTION 1  assertion -> case")
    print(f"  assertions                 : {len(d1)}")
    print(f"  with ZERO candidate case   : {len(zero)}")
    print(f"  best match below 0.30      : {len(weak)}  (these are the hand-check queue)")
    print(f"DIRECTION 2  case -> requirement")
    print(f"  cases                      : {len(d2)}")
    print(f"  STALE anchor               : {sum(1 for x in d2 if x['stale'])}")
    print(f"  NO anchor                  : {sum(1 for x in d2 if x['no_anchor'])}")
    covered = {s for s in all_sections if by_anchor.get(s)}
    print(f"  spec sections              : {len(all_sections)}")
    print(f"  sections with >=1 case     : {len(covered)}")
    print(f"  sections with NO case      : {sorted(all_sections - covered, key=lambda s:[int(x) for x in s.split('.')])}")
    print("\nZERO-CANDIDATE ASSERTIONS:")
    for x in zero:
        print(f"  {x['assertion_id']:<16} {x['assertion_text'][:160]}")


if __name__ == "__main__":
    main(*sys.argv[1:])
