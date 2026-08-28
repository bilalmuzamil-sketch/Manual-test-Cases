#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""JOB 2 phase C - add the three new cases to run 359.  UNION ONLY.

A partial `case_ids` list on `update_run` DELETES the tests it omits and every result
attached to them (Rule 34).  So: snapshot the run's tests AND results first, send the
FULL union, then prove by ID that nothing was deleted.
"""
import json, os, sys, datetime
ROOT = '/home/user/Manual-test-Cases'
HERE = os.path.join(ROOT, 'build/report-suite/wip-authoring-2026-08-28')
sys.path.insert(0, os.path.join(ROOT, 'build/report-suite/writes-2026-08-26'))
from tr import call                                                    # noqa

RUN = 359
NEW = [45208, 45209, 45210]


def paged(path, key):
    out, off = [], 0
    while True:
        s, d = call('%s&limit=250&offset=%d' % (path, off))
        assert s == 200, (path, s, str(d)[:200])
        p = d[key] if isinstance(d, dict) else d
        out += p
        if not isinstance(d, dict) or len(p) < d.get('limit', 250):
            break
        off += len(p)
    return out


def snap():
    tests = paged('get_tests/%d' % RUN, 'tests')
    results = paged('get_results_for_run/%d' % RUN, 'results')
    return tests, results


def main():
    s, run = call('get_run/%d' % RUN)
    assert s == 200
    before_t, before_r = snap()
    before = {'run_id': RUN, 'name': run['name'], 'include_all': run['include_all'],
              'tests': len(before_t), 'results': len(before_r),
              'test_ids': sorted(t['id'] for t in before_t),
              'case_ids': sorted(t['case_id'] for t in before_t),
              'result_ids': sorted(r['id'] for r in before_r)}
    print('BEFORE  include_all=%s  tests=%d  results=%d' %
          (before['include_all'], before['tests'], before['results']))
    missing = [c for c in NEW if c not in set(before['case_ids'])]
    print('new cases not yet in the run:', missing)
    if not missing:
        print('nothing to do'); return 0
    union = sorted(set(before['case_ids']) | set(NEW))
    assert set(before['case_ids']).issubset(set(union)), 'UNION GUARD FAILED - refusing to send'
    assert len(union) == len(set(before['case_ids'])) + len(missing)
    s, resp = call('update_run/%d' % RUN, {'include_all': False, 'case_ids': union})
    if s != 200:
        print('STOP - update_run HTTP %s %s' % (s, str(resp)[:300])); return 2
    after_t, after_r = snap()
    after = {'tests': len(after_t), 'results': len(after_r),
             'test_ids': sorted(t['id'] for t in after_t),
             'case_ids': sorted(t['case_id'] for t in after_t),
             'result_ids': sorted(r['id'] for r in after_r)}
    probs = []
    lost_tests = sorted(set(before['test_ids']) - set(after['test_ids']))
    lost_cases = sorted(set(before['case_ids']) - set(after['case_ids']))
    lost_results = sorted(set(before['result_ids']) - set(after['result_ids']))
    if lost_tests: probs.append('TESTS DELETED: %s' % lost_tests[:20])
    if lost_cases: probs.append('CASES DROPPED: %s' % lost_cases[:20])
    if lost_results: probs.append('RESULTS DELETED: %s' % lost_results[:20])
    still_missing = [c for c in NEW if c not in set(after['case_ids'])]
    if still_missing: probs.append('new cases still absent: %s' % still_missing)
    if after['tests'] != before['tests'] + len(missing):
        probs.append('test count %d, expected %d' % (after['tests'], before['tests'] + len(missing)))
    rec = {'run': RUN, 'when': datetime.datetime.utcnow().isoformat() + 'Z',
           'before': {k: before[k] for k in ('include_all', 'tests', 'results')},
           'after': {'tests': after['tests'], 'results': after['results']},
           'added_case_ids': missing, 'union_size': len(union),
           'every_before_test_id_still_present': not lost_tests,
           'every_before_result_id_still_present': not lost_results,
           'problems': probs}
    json.dump(rec, open(os.path.join(HERE, 'RUN-359-SYNC.json'), 'w'), indent=1)
    print(json.dumps(rec, indent=1))
    return 3 if probs else 0


if __name__ == '__main__':
    sys.exit(main())
