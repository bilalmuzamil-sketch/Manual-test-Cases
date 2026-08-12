#!/usr/bin/env python3
"""Union-sync ONE TestRail run. Scoped by argv so it cannot reach the other two.

QA-lead authorised 2026-08-11: "regarding pushing the test cases to test run,
yes please push them to the relevant test runs."

Standing Rules 6 / 34 / 47 / 50.  update_run REPLACES the selection, so the FULL
union is sent and a removal is impossible by construction: the script ABORTS
before writing unless union is a strict superset of the run's current selection.

  python3 sync_one_run.py <run_id>               # dry run, writes nothing
  python3 sync_one_run.py <run_id> --authorized  # performs the single update_run
"""
import sys, json, os, datetime
sys.path.insert(0, '/tmp/testrail')
import tr

RUNS = {357: ('Schedule', 4254, 176), 352: ('Filters', 4110, 115), 359: ('ReportSuite', 4281, 480)}
OUR_USER_ID = 3
OUT = '/home/user/Manual-test-Cases/build/run-sync-2026-08-11/SNAPSHOTS'

# Real graded data. Compared raw, byte for byte.
GRADED = ['id', 'test_id', 'status_id', 'comment', 'defects', 'elapsed', 'version',
          'assignedto_id', 'created_by', 'created_on', 'attachment_ids']
# Declared read-time echoes of the case's CURRENT title / refs -- playbook J #2 / #2b / #2c.
ECHOES = {'case_title', 'case_refs'}
# Run-record fields update_run is EXPECTED to move.
RUN_EXPECTED = {'untested_count', 'updated_on', 'passed_count', 'failed_count',
                'blocked_count', 'retest_count'}


def all_sections(project=1, suite=1):
    out, offset = [], 0
    while True:
        st, b = tr.api(f"get_sections/{project}&suite_id={suite}&limit=250&offset={offset}")
        if st != 200:
            raise RuntimeError(f"get_sections HTTP {st}: {b}")
        chunk = b["sections"] if isinstance(b, dict) else b
        out.extend(chunk)
        if len(chunk) == 250:
            offset += 250
            continue
        break
    return out


def subtree(root):
    secs = all_sections()
    kids = {}
    for s in secs:
        kids.setdefault(s.get('parent_id'), []).append(s['id'])
    seen, stack = set(), [root]
    while stack:
        n = stack.pop()
        if n in seen:
            continue
        seen.add(n)
        stack.extend(kids.get(n, []))
    return seen


def snap(rid, tag):
    stamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
    st, run = tr.api(f"get_run/{rid}")
    if st != 200:
        raise RuntimeError(f"get_run HTTP {st}: {run}")
    tests, results = tr.get_tests(rid), tr.get_results_for_run(rid)
    for nm, obj in (('run', run), ('tests', tests), ('results', results)):
        json.dump({'fetched_utc': stamp, nm: obj},
                  open(f'{OUT}/run{rid}-{tag}-{nm}.json', 'w'), indent=1, sort_keys=True)
    return stamp, run, tests, results


def main():
    rid = int(sys.argv[1])
    if rid not in RUNS:
        sys.exit(f"run {rid} is OUT OF SCOPE")
    proj, gid, expected = RUNS[rid]
    authorized = '--authorized' in sys.argv
    L = []

    def log(s):
        print(s)
        L.append(s)

    log(f"=== RUN {rid} ({proj}) — {'AUTHORISED WRITE' if authorized else 'DRY RUN'}")

    ss = subtree(gid)
    cases = tr.get_cases()
    ours = sorted(c['id'] for c in cases if c['section_id'] in ss and c.get('created_by') == OUR_USER_ID)
    foreign = {c['id']: c.get('created_by') for c in cases
               if c['section_id'] in ss and c.get('created_by') != OUR_USER_ID}
    log(f"live inventory: {len(cases)} cases in project; {len(ours)} ours under group {gid}; "
        f"{len(foreign)} foreign (hands-off)")

    stamp, run0, tests0, res0 = snap(rid, 'PREWRITE')
    cur = sorted({t['case_id'] for t in tests0})
    union = sorted(set(cur) | set(ours))
    adding = sorted(set(union) - set(cur))
    dropping = sorted(set(cur) - set(union))
    log(f"pre-write @ {stamp}: include_all={run0.get('include_all')}, tests={len(tests0)}, "
        f"distinct case_ids={len(cur)}, results={len(res0)}")
    log(f"union={len(union)} (expected {expected}); adding={adding}; DROPPING={dropping}")
    fr = sorted(set(cur) & set(foreign))
    log(f"foreign cases already in run (retained by the union): {len(fr)} {fr}")

    # ---- hard pre-write guards. Any failure aborts before the write. ----
    assert not dropping, f"ABORT: union would DROP {len(dropping)} cases: {dropping}"
    assert set(union) >= set(cur), "ABORT: union is not a superset of the current selection"
    assert len(union) == expected, f"ABORT: union {len(union)} != expected {expected}"
    assert run0.get('include_all') is False, "ABORT: include_all is not False"
    log("pre-write guards PASSED (no removals possible; union is a strict superset)")

    if not authorized:
        log("DRY RUN — nothing written.")
        json.dump(L, open(f'{OUT}/run{rid}-DRYRUN-log.json', 'w'), indent=1)
        return

    st, body = tr.api(f"update_run/{rid}", "POST", {'include_all': False, 'case_ids': union})
    log(f"update_run/{rid} HTTP {st} with {len(union)} case_ids")
    if st != 200:
        raise RuntimeError(f"WRITE FAILED HTTP {st}: {body}")

    stamp2, run1, tests1, res1 = snap(rid, 'POST')
    bad = []

    # 1. count + include_all
    cur1 = sorted({t['case_id'] for t in tests1})
    log(f"post: tests={len(tests1)}, distinct case_ids={len(cur1)}, results={len(res1)}, "
        f"include_all={run1.get('include_all')}")
    if len(tests1) != expected:
        bad.append(f"TEST COUNT {len(tests1)} != expected {expected}")
    if run1.get('include_all') is not False:
        bad.append(f"include_all CHANGED to {run1.get('include_all')}")

    # 2. case_id sets equal BOTH directions
    miss_a = set(union) - set(cur1)
    miss_b = set(cur1) - set(union)
    log(f"case_id set equality: union-not-in-run={sorted(miss_a)}, run-not-in-union={sorted(miss_b)}")
    if miss_a or miss_b:
        bad.append(f"CASE_ID SETS NOT EQUAL: {sorted(miss_a)} / {sorted(miss_b)}")

    # 3. every prior test present BY ID, bound to the same case
    tb = {t['id']: t for t in tests0}
    ta = {t['id']: t for t in tests1}
    lost = sorted(set(tb) - set(ta))
    rebound = [i for i in tb if i in ta and tb[i]['case_id'] != ta[i]['case_id']]
    log(f"prior tests: {len(tb)} checked BY ID; lost={len(lost)}; rebound-to-other-case={len(rebound)}")
    if lost:
        bad.append(f"PRIOR TESTS LOST BY ID ({len(lost)}): {lost[:40]}")
    if rebound:
        bad.append(f"PRIOR TESTS REBOUND ({len(rebound)}): {rebound[:40]}")

    # 4/5. every prior result present BY ID, graded fields byte-identical
    rb = {r['id']: r for r in res0}
    ra = {r['id']: r for r in res1}
    missing = sorted(set(rb) - set(ra))
    echo_moved, field_moved = {}, []
    for i, rec in rb.items():
        if i not in ra:
            continue
        now = ra[i]
        for k in sorted(set(rec) | set(now)):
            if rec.get(k) == now.get(k):
                continue
            if k in ECHOES:
                echo_moved.setdefault(k, []).append(i)
                continue
            field_moved.append(f"RESULT {i} FIELD {k}: before={rec.get(k)!r} after={now.get(k)!r}")
    log(f"prior results: {len(rb)} checked BY ID; missing={len(missing)}; "
        f"non-echo field changes={len(field_moved)}; "
        f"declared echoes moved={{{', '.join(f'{k}:{len(v)}' for k, v in echo_moved.items()) or 'none'}}}")
    if missing:
        bad.append(f"PRIOR RESULTS MISSING BY ID ({len(missing)}): {missing[:40]}")
    bad.extend(field_moved)
    for k in GRADED:
        d = [i for i in rb if i in ra and rb[i].get(k) != ra[i].get(k)]
        if d:
            bad.append(f"GRADED FIELD {k} MOVED on {len(d)} results: {d[:20]}")
    new = sorted(set(ra) - set(rb))
    log(f"results after: {len(ra)}; NEW since pre-write snapshot = {len(new)} {new[:20]} "
        f"(we call no add_result -- any new are the run owner's)")

    # 6. run record: nothing but the expected counters moved
    for k in sorted(set(run0) | set(run1)):
        if k in RUN_EXPECTED:
            continue
        if run0.get(k) != run1.get(k):
            bad.append(f"RUN FIELD {k}: before={run0.get(k)!r} after={run1.get(k)!r}")

    log("VERDICT: " + ("ALL CHECKS PASSED" if not bad else f"{len(bad)} FAILURES"))
    for b in bad:
        log("  !! " + b)
    json.dump({'run': rid, 'project': proj, 'log': L, 'failures': bad,
               'echo_moved': {k: v for k, v in echo_moved.items()},
               'new_results': new, 'union_sent': union},
              open(f'{OUT}/run{rid}-POST-verification.json', 'w'), indent=1, sort_keys=True)
    if bad:
        sys.exit(1)


main()
