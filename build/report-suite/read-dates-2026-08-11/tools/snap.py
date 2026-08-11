#!/usr/bin/env python3
"""Pre-write snapshot of the Report Suite (group 4281) and of run 359 — READ-ONLY.

Adapted from build/filters/read-dates-2026-08-11/tools/snap.py (Rule 27 — reuse,
never re-derive). Differences: group 4281, run 359, and a per-report split by the
six report subsections, because each report has its OWN specification and its own
version pin.

Everything is PAGED to exhaustion. `get_sections` fails SILENTLY when unpaged:
this project has 600+ sections and the Report Suite group is 4281, well past the
first 250, so an unpaged call finds ZERO sections and reads exactly like "the
group is empty" (playbook §J).

Each case is ALSO re-read individually with `get_case` and byte-compared against
the `get_cases` bulk body, on every field of every case, to rule out a
bulk-endpoint read trap (no sampling — Rule 50).
"""
import datetime as dt
import json
import os
import sys

import tr

HERE = os.path.dirname(os.path.abspath(__file__))
SNAP = os.path.join(HERE, "..", "snapshots")
GROUP = 4281
RUN = 359
TAG = sys.argv[1] if len(sys.argv) > 1 else "PRE"


def subtree(sections, root):
    keep, frontier = {root}, {root}
    while frontier:
        nxt = {s["id"] for s in sections if s.get("parent_id") in frontier}
        nxt -= keep
        keep |= nxt
        frontier = nxt
    return keep


if __name__ == "__main__":
    now = dt.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    print("snapshot", TAG, "at", now)

    secs = tr.getall("get_sections/1&suite_id=1", "sections")
    print("sections in project (fully paged):", len(secs))
    ids = subtree(secs, GROUP)
    print(f"sections in the Report Suite subtree under {GROUP}:", len(ids))
    json.dump([s for s in secs if s["id"] in ids],
              open(f"{SNAP}/sections-4281-{TAG}.json", "w"), indent=1)

    # the six report folders are the DIRECT children of 4281
    reports = {s["id"]: s["name"] for s in secs if s.get("parent_id") == GROUP}
    print("direct children of 4281 (the six reports):")
    for k, v in sorted(reports.items()):
        print(f"   {k}: {v}")
    # map every section in the subtree to its owning report folder
    owner = {}
    for rid in reports:
        for sid in subtree(secs, rid):
            owner[sid] = rid
    json.dump({"reports": reports, "section_to_report": owner},
              open(f"{SNAP}/report-map-{TAG}.json", "w"), indent=1)

    cases = tr.getall("get_cases/1&suite_id=1", "cases")
    print("cases in suite (fully paged):", len(cases))
    ours = [c for c in cases if c["section_id"] in ids]
    print("cases under the Report Suite group:", len(ours))

    full = {}
    for c in ours:
        st, d = tr.req(f"get_case/{c['id']}")
        assert st == 200, (c["id"], st, d)
        full[str(c["id"])] = d
    json.dump(full, open(f"{SNAP}/cases-{TAG}.json", "w"), indent=1)
    print("cases snapshotted individually:", len(full))

    bulk = {str(c["id"]): c for c in ours}
    diff = [(k, f) for k, v in full.items() for f in set(v) | set(bulk[k])
            if v.get(f) != bulk[k].get(f)]
    print("bulk-vs-individual field diffs:", len(diff), diff[:10])

    by = {}
    for k, v in full.items():
        by.setdefault(v.get("created_by"), []).append(k)
    print("created_by census (we are user 3; 1 = Vladimir Tomovic, Rule 38):")
    for k, v in sorted(by.items(), key=lambda x: -len(x[1])):
        print(f"   created_by={k}: {len(v)} cases {'' if k == 3 else sorted(v)}")

    print("custom_atmstatus census:",
          {str(s): sum(1 for v in full.values() if v.get("custom_atmstatus") == s)
           for s in sorted({v.get("custom_atmstatus") for v in full.values()},
                           key=lambda x: (x is None, x))})
    print("atmstatus==3 (Automated — TELL VLAD if we change any, Rule 65):",
          len([k for k, v in full.items() if v.get("custom_atmstatus") == 3]))

    # per-report counts of OUR cases
    per = {}
    for k, v in full.items():
        if v.get("created_by") != 3:
            continue
        per.setdefault(reports.get(owner.get(v["section_id"]), "?"), []).append(k)
    print("OUR cases per report:")
    for k, v in sorted(per.items()):
        print(f"   {k}: {len(v)}")
    print("OUR total:", sum(len(v) for v in per.values()))

    st, run = tr.req(f"get_run/{RUN}")
    assert st == 200, run
    json.dump(run, open(f"{SNAP}/run359-{TAG}.json", "w"), indent=1)
    print(f"run {RUN}: include_all={run['include_all']} "
          f"passed={run.get('passed_count')} failed={run.get('failed_count')} "
          f"untested={run.get('untested_count')} blocked={run.get('blocked_count')}")

    tests = tr.getall(f"get_tests/{RUN}", "tests")
    json.dump(tests, open(f"{SNAP}/run359-tests-{TAG}.json", "w"), indent=1)
    print("run tests (fully paged):", len(tests))

    res = tr.getall(f"get_results_for_run/{RUN}", "results")
    json.dump(res, open(f"{SNAP}/run359-results-{TAG}.json", "w"), indent=1)
    print("run result records (fully paged):", len(res))
