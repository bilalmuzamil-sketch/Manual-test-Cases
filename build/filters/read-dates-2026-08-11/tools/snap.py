#!/usr/bin/env python3
"""Pre-write snapshot of the Filters suite and of run 352 — READ-ONLY.

Everything is PAGED to exhaustion. `get_sections` in particular fails SILENTLY
when unpaged: this project has 600+ sections and the Filters group is 4110, well
past the first 250, so an unpaged call finds ZERO Filters sections and reads
exactly like "the group is empty" (playbook §J).

Each case is ALSO re-read individually with `get_case` and byte-compared against
the `get_cases` bulk body, on every field of every case, to rule out a
bulk-endpoint read trap (no sampling — Rule 50).
"""
import datetime as dt
import json
import os

import tr

HERE = os.path.dirname(os.path.abspath(__file__))
SNAP = os.path.join(HERE, "..", "snapshots")
GROUP = 4110
RUN = 352


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
    print("snapshot at", now)

    secs = tr.getall("get_sections/1?suite_id=1".replace("?", "&"), "sections")
    print("sections in project (fully paged):", len(secs))
    ids = subtree(secs, GROUP)
    print(f"sections in the Filters subtree under {GROUP}:", len(ids))
    json.dump([s for s in secs if s["id"] in ids],
              open(f"{SNAP}/sections-4110.json", "w"), indent=1)

    cases = tr.getall("get_cases/1&suite_id=1", "cases")
    print("cases in suite (fully paged):", len(cases))
    ours = [c for c in cases if c["section_id"] in ids]
    print("cases under the Filters group:", len(ours))

    full = {}
    for c in ours:
        st, d = tr.req(f"get_case/{c['id']}")
        assert st == 200, (c["id"], st, d)
        full[str(c["id"])] = d
    json.dump(full, open(f"{SNAP}/cases-PRE.json", "w"), indent=1)
    print("cases snapshotted individually:", len(full))

    bulk = {str(c["id"]): c for c in ours}
    diff = [(k, f) for k, v in full.items() for f in set(v) | set(bulk[k])
            if v.get(f) != bulk[k].get(f)]
    print("bulk-vs-individual field diffs:", len(diff), diff[:10])

    print("created_by census:", {})
    by = {}
    for k, v in full.items():
        by.setdefault(v.get("created_by"), []).append(k)
    for k, v in sorted(by.items(), key=lambda x: -len(x[1])):
        print(f"   created_by={k}: {len(v)} cases {'' if k == 3 else v}")
    print("custom_atmstatus census:",
          {s: sum(1 for v in full.values() if v.get("custom_atmstatus") == s)
           for s in sorted({v.get("custom_atmstatus") for v in full.values()})})
    print("atmstatus==3 (Automated):",
          sorted(k for k, v in full.items() if v.get("custom_atmstatus") == 3))

    st, run = tr.req(f"get_run/{RUN}")
    assert st == 200, run
    json.dump(run, open(f"{SNAP}/run352-PRE.json", "w"), indent=1)
    print(f"run {RUN}: include_all={run['include_all']} "
          f"passed={run.get('passed_count')} failed={run.get('failed_count')} "
          f"untested={run.get('untested_count')} blocked={run.get('blocked_count')}")

    tests = tr.getall(f"get_tests/{RUN}", "tests")
    json.dump(tests, open(f"{SNAP}/run352-tests-PRE.json", "w"), indent=1)
    print("run tests (fully paged):", len(tests))

    res = tr.getall(f"get_results_for_run/{RUN}", "results")
    json.dump(res, open(f"{SNAP}/run352-results-PRE.json", "w"), indent=1)
    print("run result records (fully paged):", len(res))
