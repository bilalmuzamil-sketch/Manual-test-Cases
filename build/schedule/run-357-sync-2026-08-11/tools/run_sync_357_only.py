#!/usr/bin/env python3
"""
run_sync_357_only.py — Standing-Rule-34 run sync for RUN 357 (Schedule, group 4254) ALONE.

PROVENANCE: this is build/testrail-run-sync-2026-08-05/tools/run_sync_2026_08_05.py, copied
byte-identical (sha256 99c9e890d368cb394d2b0a5ae7de879fd78b97dd42870bca5d8011d24abb241c) and
changed in exactly THREE places, all recorded here (Rule 27 — reuse the proven tool, never
re-derive it):
  1. SCOPE cut from three runs to run 357 alone, so runs 352 and 359 — where other workers are
     live today — cannot be reached from this script at all.
  2. BEFORE/AFTER snapshot paths redirected to this pass's own snapshots/ directory. The two
     tags write distinct filenames (run-357-before.json / run-357-after.json), so pointing both
     at one directory cannot overwrite a snapshot.
  3. This docstring.
Nothing in the union logic, the write, or the verification was touched.

The parent's own description follows.
---
Standing-Rule-34 run sync for the THREE ACTIVE projects only
(Rule 47): run 359 Report Suite (group 4281) · run 357 Schedule (group 4254) ·
run 352 Filters (group 4110).

Descends from build/testrail-run-sync-2026-07-31/{run_sync_audit.py,sync_runs_EXECUTOR.py}
(Rule 27 — reuse, never re-derive). What is IMPROVED over the 2026-07-31 pair:

  1. SCOPE is hard-coded to the three ACTIVE runs (Rule 47). The old PLAN list also held
     runs 278/324/325, which are now explicitly out of scope and must not even be READ
     for gaps. They cannot be reached from this script at all.
  2. FOREIGN-CASE EXCLUSION IS DERIVED LIVE from `created_by`, not from a hard-coded list.
     We are user id 3. A foreign case is never ADDED to a union; but if it is ALREADY in
     the run's selection it is PRESERVED, because the union keeps whatever is there and
     dropping it would delete that tester's tests and results (Rules 38 + 34).
  3. SNAPSHOTS ARE FULL AND PERSISTED TO THE REPO before any write — every result record
     in full, not a 3-field digest as the old executor stored. A snapshot you did not
     persist is not a snapshot.
  4. VERIFICATION IS BY ID AND FIELD BY FIELD (Rule 50), not `len(res2) >= len(results)`.
     Every prior result is located BY ITS OWN id and compared on every graded field.
     `case_title` and `case_refs` are treated as DERIVED read-time echoes per the
     declared normalisations #2 / #2b in build/APP-ACTIONS-PLAYBOOK.md §J.
  5. THE CASE-ID SET IS PROVEN EQUAL IN BOTH DIRECTIONS, never by matching totals.
  6. THE RUN RECORD ITSELF is diffed field by field, so a stray change to name /
     description / milestone / assignee would be caught rather than assumed absent.
  7. It STOPS THE WHOLE SEQUENCE on the first failed verification and does not touch a
     later run (the old one carried on round the loop).

Usage:
    python3 tools/run_sync_2026_08_05.py --audit        # read-only, writes BEFORE snapshots
    python3 tools/run_sync_2026_08_05.py --authorized   # performs the update_run writes
"""
import base64
import datetime
import json
import os
import sys
import time
import urllib.error
import urllib.request

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BEFORE = os.path.join(HERE, 'snapshots')
AFTER = os.path.join(HERE, 'snapshots')
BASE = 'https://shopview.testrail.io/index.php?/api/v2/'
PROJECT, SUITE = 1, 1
OUR_USER_ID = 3                     # Bilal Muzamil — Rule 38

# Rule 47 + the 2026-08-11 authorisation: RUN 357 ALONE IS IN SCOPE.
# Runs 352 (Filters) and 359 (Report Suite) are CUT OUT ENTIRELY — other workers are live on
# those projects today and the QA lead authorised the 357 sync only. They cannot be reached
# from this script at all. Runs 278 / 324 / 325 were already out of scope in the parent.
SCOPE = [(357, 'Schedule', 4254)]

# Result fields that are REAL graded data. Compared raw, byte for byte.
GRADED = ['id', 'test_id', 'status_id', 'comment', 'defects', 'elapsed', 'version',
          'assignedto_id', 'created_by', 'created_on', 'attachment_ids']
# Declared read-time echoes of the case's CURRENT title / refs — playbook §J #2 and #2b.
ECHOES = {'case_title', 'case_refs'}

_C = json.load(open('/tmp/testrail/creds.json'))
AUTH = 'Basic ' + base64.b64encode(
    f"{_C['email']}:{_C.get('password') or _C.get('key')}".encode()).decode()


def api(path, body=None):
    for attempt in range(5):
        try:
            req = urllib.request.Request(
                BASE + path,
                data=json.dumps(body).encode() if body is not None else None,
                headers={'Authorization': AUTH, 'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=180) as r:
                raw = r.read().decode()
                return r.status, (json.loads(raw) if raw.strip() else {})
        except urllib.error.HTTPError as e:
            return e.code, {'error': e.read().decode()[:400]}
        except Exception as exc:
            if attempt == 4:
                raise RuntimeError(f'{path} failed: {exc}')
            time.sleep(2 ** attempt)


def get(path):
    st, b = api(path)
    if st != 200:
        raise RuntimeError(f'GET {path} -> HTTP {st}: {b}')
    return b


def paged(path, key):
    """Every list endpoint here needs paging (playbook §J) — 250 at a time until short."""
    out, offset = [], 0
    while True:
        b = get(f'{path}&limit=250&offset={offset}')
        chunk = b[key] if isinstance(b, dict) else b
        out.extend(chunk)
        if len(chunk) < 250:
            return out
        offset += 250


def group_of(section_id, sections_by_id, group_ids):
    seen = set()
    sid = section_id
    while sid and sid not in seen:
        if sid in group_ids:
            return sid
        seen.add(sid)
        sid = sections_by_id.get(sid, {}).get('parent_id')
    return None


def live_case_inventory():
    """Every case in project 1 / suite 1, mapped to its top-level group, with authorship."""
    cases = paged(f'get_cases/{PROJECT}&suite_id={SUITE}', 'cases')
    sections = paged(f'get_sections/{PROJECT}&suite_id={SUITE}', 'sections')
    by_id = {s['id']: s for s in sections}
    group_ids = {g for _r, _p, g in SCOPE}
    inv = {}
    for c in cases:
        g = group_of(c['section_id'], by_id, group_ids)
        if g:
            inv.setdefault(g, {})[c['id']] = {
                'title': c['title'], 'created_by': c['created_by'],
                'section_id': c['section_id'],
                'section': by_id.get(c['section_id'], {}).get('name', '')}
    return inv, len(cases), len(sections)


def snapshot(rid, outdir, tag):
    run = get(f'get_run/{rid}')
    tests = paged(f'get_tests/{rid}', 'tests')
    results = paged(f'get_results_for_run/{rid}', 'results')
    snap = {'captured_utc': datetime.datetime.utcnow().isoformat() + 'Z',
            'run_id': rid, 'tag': tag, 'run': run,
            'test_count': len(tests), 'result_count': len(results),
            'tests': sorted(tests, key=lambda t: t['id']),
            'results': sorted(results, key=lambda r: r['id'])}
    os.makedirs(outdir, exist_ok=True)
    with open(os.path.join(outdir, f'run-{rid}-{tag}.json'), 'w') as f:
        json.dump(snap, f, indent=1, sort_keys=True)
    return snap


def verify(rid, before, after, union, expected_after):
    """Rule 50: exhaustive then exact. Returns (ok, lines)."""
    L, bad = [], []

    # (a) the run's own record — every field, only the derived counters may move
    counters = {'passed_count', 'failed_count', 'blocked_count', 'retest_count',
                'untested_count', 'custom_status1_count', 'custom_status2_count',
                'custom_status3_count', 'custom_status4_count', 'custom_status5_count',
                'custom_status6_count', 'custom_status7_count', 'updated_on'}
    rb, ra = before['run'], after['run']
    moved = []
    for k in sorted(set(rb) | set(ra)):
        if rb.get(k) != ra.get(k):
            moved.append(k)
            if k not in counters:
                bad.append(f'RUN FIELD CHANGED {k}: before={rb.get(k)!r} after={ra.get(k)!r}')
    L.append(f'run record: {len(set(rb) | set(ra))} fields compared; '
             f'moved = {moved or "none"} (all derived counters)')

    # (b) case_id set equality, BOTH directions — never by count
    got = {t['case_id'] for t in after['tests']}
    want = set(union)
    if got - want or want - got:
        bad.append(f'CASE SET MISMATCH: extra={sorted(got - want)} missing={sorted(want - got)}')
    L.append(f'case_id set: got {len(got)} / want {len(want)}; '
             f'got-want={sorted(got - want) or "empty"}, want-got={sorted(want - got) or "empty"}')

    # (c) test count
    if len(after['tests']) != expected_after:
        bad.append(f'TEST COUNT {len(after["tests"])} != expected {expected_after}')
    L.append(f'test count: before {before["test_count"]} -> after {len(after["tests"])} '
             f'(expected {expected_after})')

    # (d) every PRIOR TEST still present BY ID with the same id->case_id binding
    tb = {t['id']: t['case_id'] for t in before['tests']}
    ta = {t['id']: t['case_id'] for t in after['tests']}
    lost = [i for i in tb if i not in ta]
    rebound = [i for i in tb if i in ta and ta[i] != tb[i]]
    if lost:
        bad.append(f'PRIOR TESTS LOST BY ID: {lost}')
    if rebound:
        bad.append(f'PRIOR TEST REBOUND TO A DIFFERENT CASE: {rebound}')
    L.append(f'prior tests: {len(tb)} checked by id, lost={len(lost)}, rebound={len(rebound)}')

    # (e) EVERY prior result present BY ID and byte-identical on every graded field
    rbm = {r['id']: r for r in before['results']}
    ram = {r['id']: r for r in after['results']}
    missing = [i for i in rbm if i not in ram]
    if missing:
        bad.append(f'PRIOR RESULTS MISSING BY ID ({len(missing)}): {missing[:40]}')
    echo_moved, field_moved = {}, []
    for i, rec in rbm.items():
        if i not in ram:
            continue
        now = ram[i]
        for k in sorted(set(rec) | set(now)):
            if rec.get(k) == now.get(k):
                continue
            if k in ECHOES:
                echo_moved.setdefault(k, []).append(i)
                continue
            field_moved.append(f'RESULT {i} FIELD {k}: before={rec.get(k)!r} after={now.get(k)!r}')
    bad.extend(field_moved)
    for k in GRADED:
        diff = [i for i in rbm if i in ram and rbm[i].get(k) != ram[i].get(k)]
        if diff:
            bad.append(f'GRADED FIELD {k} MOVED on {len(diff)} results: {diff[:20]}')
    L.append(f'prior results: {len(rbm)} checked BY ID, missing={len(missing)}, '
             f'graded-field changes={len(field_moved)}, '
             f'declared echoes moved={{' +
             ', '.join(f'{k}:{len(v)}' for k, v in echo_moved.items()) + '}')
    new_results = [i for i in ram if i not in rbm]
    L.append(f'results after: {len(ram)} total; NEW since snapshot = {len(new_results)} '
             f'{new_results[:20]} (none may be ours — we call no add_result)')
    return not bad, L, bad, echo_moved, new_results


def main():
    authorized = '--authorized' in sys.argv
    inv, total_cases, total_sections = live_case_inventory()
    print(f'live inventory: {total_cases} cases, {total_sections} sections '
          f'(both fully paged)\n')

    plan, report = [], {'generated_utc': datetime.datetime.utcnow().isoformat() + 'Z',
                        'authorized': authorized, 'runs': {}}

    for rid, proj, gid in SCOPE:
        cases = inv.get(gid, {})
        ours = {c for c, m in cases.items() if m['created_by'] == OUR_USER_ID}
        foreign = {c: cases[c]['created_by'] for c in cases if c not in ours}
        snap = snapshot(rid, BEFORE, 'before')
        current = {t['case_id'] for t in snap['tests']}
        run = snap['run']

        union = sorted(current | ours)
        adding = sorted(ours - current)
        foreign_in_run = sorted(set(foreign) & current)
        foreign_excluded = sorted(set(foreign) - current)
        stale = sorted(c for c in current if c not in cases)

        assert current.issubset(set(union)), 'UNION LOST AN EXISTING CASE — ABORT'
        assert not (set(foreign_excluded) & set(union)), 'a foreign case leaked into the union'

        rec = {'run_id': rid, 'project': proj, 'group': gid,
               'run_name': run['name'], 'include_all': run['include_all'],
               'tests_before': snap['test_count'], 'results_before': snap['result_count'],
               'live_group_cases': len(cases), 'ours': len(ours), 'foreign': len(foreign),
               'current_selection': len(current), 'union': len(union),
               'adding': adding, 'foreign_in_run_preserved': foreign_in_run,
               'foreign_excluded_from_union': foreign_excluded,
               'in_run_not_in_group': stale,
               'foreign_authors': {str(k): v for k, v in foreign.items()}}
        report['runs'][str(rid)] = rec
        plan.append((rid, proj, current, union, adding, snap))

        print(f'run {rid} {proj} (group {gid})')
        print(f'   include_all      : {run["include_all"]}')
        print(f'   tests now        : {snap["test_count"]}  results now: {snap["result_count"]}')
        print(f'   live in group    : {len(cases)}  = ours {len(ours)} + foreign {len(foreign)}')
        print(f'   union            : {len(union)}  (adding {len(adding)}: {adding})')
        print(f'   foreign in run   : {foreign_in_run} -> PRESERVED')
        print(f'   foreign excluded : {foreign_excluded}')
        print(f'   in run, not in group: {stale}\n')

    with open(os.path.join(HERE, 'sync-plan.json'), 'w') as f:
        json.dump(report, f, indent=1, sort_keys=True)

    if not authorized:
        print('AUDIT ONLY — no TestRail write was made. BEFORE snapshots written to '
              'snapshots-before/.')
        return

    verdicts = {}
    for rid, proj, current, union, adding, snap_before in plan:
        if not adding:
            print(f'run {rid} {proj}: already complete, nothing to add — NO WRITE MADE')
            verdicts[str(rid)] = {'wrote': False, 'reason': 'union == current selection'}
            continue
        payload = {'include_all': False, 'case_ids': union}
        st, body = api(f'update_run/{rid}', payload)
        print(f'run {rid} {proj}: update_run HTTP {st} with {len(union)} case_ids')
        if st != 200:
            raise SystemExit(f'WRITE FAILED run {rid} HTTP {st}: {body} — STOPPING, '
                             'no further run touched (Rule 50)')
        snap_after = snapshot(rid, AFTER, 'after')
        ok, lines, bad, echoes, new = verify(rid, snap_before, snap_after, union, len(union))
        for l in lines:
            print('   ' + l)
        verdicts[str(rid)] = {'wrote': True, 'http': st, 'ok': ok, 'lines': lines,
                              'failures': bad, 'echoes_moved': echoes,
                              'new_results': new,
                              'tests_after': snap_after['test_count'],
                              'results_after': snap_after['result_count']}
        with open(os.path.join(HERE, 'verification.json'), 'w') as f:
            json.dump(verdicts, f, indent=1, sort_keys=True)
        if not ok:
            for b in bad:
                print('   *** ' + b)
            raise SystemExit(f'VERIFICATION FAILED on run {rid} — STOPPING before any other '
                             'run is touched (Rule 50)')
        print(f'   VERIFIED OK\n')

    with open(os.path.join(HERE, 'verification.json'), 'w') as f:
        json.dump(verdicts, f, indent=1, sort_keys=True)
    print('all in-scope runs synced and verified.')


if __name__ == '__main__':
    main()
