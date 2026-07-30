#!/usr/bin/env python3
"""Standing Rule 34 — run-352 UNION sync after the 8 add_case.

USER-AUTHORIZED 2026-07-31 (run 352 belongs to another tester, Ahtesham, so the
run write needed its own authorization - Rule 6).

Run 352 was built with include_all=false, so it is FROZEN at its case selection:
without this sync the 8 new cases are INVISIBLE to the tester, which is the exact
failure that created Rule 34.

SAFETY: update_run REPLACES the case selection. A partial case_ids list would
DELETE the omitted tests AND THEIR RECORDED RESULTS. This script therefore
 (1) snapshots get_run + get_tests + get_results_for_run BEFORE writing,
 (2) asserts set(current) is a SUBSET of the union,
 (3) asserts len(union) == len(current) + len(added),
 (4) sends the FULL UNION only,
 (5) re-verifies count / every prior case_id / every new case_id / no extras /
     the results count UNCHANGED,
 (6) ABORTS on any failed assertion, before or after the write.
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
FILTERS = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(FILTERS, "fixes-2026-07-31"))
import tr  # noqa: E402

RUN = 352
OUT = os.path.join(HERE, "run352")
os.makedirs(OUT, exist_ok=True)

NEW = sorted(json.load(open(os.path.join(HERE, "new-cids.json")))["new_cids"].values())


def dump(name, obj):
    json.dump(obj, open(os.path.join(OUT, name), "w"), indent=1)


def main():
    print("new case ids to add:", NEW, f"({len(NEW)})")
    assert len(NEW) == 8, NEW

    # ---------- BEFORE ----------
    st, run = tr.call(f"get_run/{RUN}")
    assert st == 200, (st, run)
    dump("get_run-BEFORE.json", run)
    print(f"run {RUN}: {run['name']!r}")
    print(f"  include_all={run['include_all']}  is_completed={run['is_completed']}")
    assert run["include_all"] is False, "include_all is TRUE - no sync needed, verify only"
    assert run["is_completed"] is False, "run is COMPLETED - stop and ask the user"

    tests = tr.paged(f"get_tests/{RUN}&x=1", "tests")
    dump("get_tests-BEFORE.json", tests)
    current = sorted({t["case_id"] for t in tests})
    print(f"  tests BEFORE: {len(tests)} | distinct case_ids: {len(current)}")

    results = tr.paged(f"get_results_for_run/{RUN}&x=1", "results")
    dump("get_results-BEFORE.json", results)
    n_res_before = len(results)
    print(f"  result records BEFORE: {n_res_before}")

    # ---------- union + pre-write assertions ----------
    union = sorted(set(current) | set(NEW))
    already = [c for c in NEW if c in current]
    assert set(current) <= set(union), "SUBSET assertion FAILED - ABORT"
    expected = len(current) + len([c for c in NEW if c not in current])
    assert len(union) == expected, (len(union), expected)
    print(f"  union: {len(current)} + {len(NEW) - len(already)} new "
          f"({len(already)} already in run) = {len(union)}  [assertions PASS]")
    dump("case-ids.json", {"before": current, "new": NEW, "union": union,
                           "already_in_run": already})

    if union == current:
        print("  nothing to add - run already in sync")
        return

    # ---------- WRITE ----------
    st, d = tr.call(f"update_run/{RUN}", {"case_ids": union})
    assert st == 200, (st, d)
    print(f"  update_run/{RUN} HTTP {st}")
    dump("update_run-RESPONSE.json", d)

    # ---------- AFTER ----------
    st, run2 = tr.call(f"get_run/{RUN}")
    assert st == 200
    dump("get_run-AFTER.json", run2)
    tests2 = tr.paged(f"get_tests/{RUN}&x=1", "tests")
    dump("get_tests-AFTER.json", tests2)
    after = sorted({t["case_id"] for t in tests2})
    results2 = tr.paged(f"get_results_for_run/{RUN}&x=1", "results")
    dump("get_results-AFTER.json", results2)

    checks = [
        ("test count == len(union)", len(tests2) == len(union), f"{len(tests2)} vs {len(union)}"),
        ("all prior case_ids still present", set(current) <= set(after),
         f"missing {sorted(set(current) - set(after))}"),
        ("all 8 new case_ids present", set(NEW) <= set(after),
         f"missing {sorted(set(NEW) - set(after))}"),
        ("no extra case_ids", set(after) == set(union),
         f"extra {sorted(set(after) - set(union))}"),
        ("results count UNCHANGED", len(results2) == n_res_before,
         f"{n_res_before} -> {len(results2)}"),
        ("include_all still false", run2["include_all"] is False, str(run2["include_all"])),
    ]
    print(f"\n  tests {len(tests)} -> {len(tests2)} | results {n_res_before} -> {len(results2)}")
    bad = 0
    for name, ok, detail in checks:
        print(f"  [{'PASS' if ok else 'FAIL'}] {name}  ({detail})")
        bad += 0 if ok else 1
    dump("verification.json", {"before_tests": len(tests), "after_tests": len(tests2),
                               "before_results": n_res_before,
                               "after_results": len(results2),
                               "checks": [(n, bool(o), d) for n, o, d in checks]})
    assert bad == 0, "RUN SYNC VERIFICATION FAILED - report to the user"
    print("\nRUN 352 SYNC CLEAN — all assertions PASS.")


if __name__ == "__main__":
    main()
