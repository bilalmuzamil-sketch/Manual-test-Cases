#!/usr/bin/env python3
"""PHASE 4 repairs of the Filters closing-authenticity pass (2026-07-31).

Fixes raised by the Stage-2b cross-case consistency sweep
(`sweep_2b_closing.py`) on this pass's own work:

R1 — FLT-ASSET-07 = C38878: the Phase-2 ticket-half normaliser only anchored at
     the START of the refs string, so this case kept a SECOND nested, now-false
     "Filters (Epic key TBD)" in the middle of its refs. Removed.

R2 — six TITLE refinements. The sweep's TITLE-vs-EXPECTED scan flagged eight
     cases whose title vocabulary had drifted from the words used in their own
     steps/expected. Six were genuine vocabulary mismatches and are re-aligned to
     the case's own on-screen/step wording (also plainer per Rule 7 — e.g.
     "malformed" was jargon a non-technical tester would stumble on). Two
     (FLT-COLL-02, FLT-TAB-05) are pure synonyms and are ADJUDICATED as accepted
     in the sweep with a written reason, not reworded.

LOCAL ONLY — the TestRail write is the Phase 5 authorized push.
"""
import sys, os, csv
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caseio import active, patch

REFS = {
    "FLT-ASSET-07": "Filters (no Jira epic) (S6-R2; tech plan 2026-07-29 G4 (filtering No is new capability)) [spec v1.6 2026-07-28]",
}

TITLES = {
    # was: "Several different filters combine: only work orders matching every one remain"
    # steps drive exactly Status + Customer, so name them (Rule 9 build-accurate)
    "FLT-CHIP-06": "Status and Customer filters together show only work orders matching both",
    # expected says the value is "silently ignored"; spec S10-N1 says "silently ignores"
    "FLT-PERS-04": "A remembered filter value that was deleted is silently ignored",
    # steps say URL / bookmark, not "link"
    "FLT-URL-02":  "Opening a shared URL or bookmark loads the page with those filters on",
    "FLT-URL-03":  "A URL with a deleted filter value loads and ignores that value",
    # "malformed" -> plain English, matching the step "Manually break the filter part"
    "FLT-URL-04":  "A broken filter URL loads the page with no filters and no error",
    "FLT-URL-05":  "Opening a shared link does not change your own saved filters",
}


def main():
    cases = {c["id"]: c for _, c in active()}
    idmap = {r["internal_id"]: r["testrail_case_id"] for r in
             csv.DictReader(open("/home/user/Manual-test-Cases/build/filters/testrail-id-map.csv"))}
    edits = {}
    for i, v in REFS.items():
        assert len(v) <= 250 and "," not in v and v.count("Filters (") == 1, i
        print("REFS  %-14s %-8s %d -> %d chars" % (i, idmap[i], len(cases[i]["spec_ref"]), len(v)))
        print("      BEFORE:", cases[i]["spec_ref"])
        print("      AFTER :", v)
        edits.setdefault(i, {})["spec_ref"] = v
    for i, v in TITLES.items():
        assert len(v) <= 80, (i, len(v))
        print("TITLE %-14s %-8s %d -> %d" % (i, idmap[i], len(cases[i]["title"]), len(v)))
        print("      BEFORE:", cases[i]["title"])
        print("      AFTER :", v)
        edits.setdefault(i, {})["title"] = v
    print("patched:", patch(edits))


if __name__ == "__main__":
    main()
