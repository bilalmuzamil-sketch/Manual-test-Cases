#!/usr/bin/env python3
"""Emit the reference line for a set of case ids, in the shape Rule 8 requires.

Rule 8, as the QA lead amended it on 2026-09-10 and had to repeat on 2026-09-15:

    "Give me the Test run of the test case link ALWAYS anytime you have to share with me the
     test case number."

A case number never travels alone. Every mention carries the C-id, and the link that opens THE
RESULT -- the run-scoped test link `/tests/view/<test_id>` -- plus the run number. The plain
`/cases/view/<id>` link is not enough on its own: it opens the case, not the result, so he has to
go hunting for the run.

This exists because I kept giving him case links. Remembering a rule is not a mechanism; a command
that emits the right thing is.

    python3 build/testing-tools/case_ref.py --run 415 C55673 C53605
    python3 build/testing-tools/case_ref.py --run 415 --all
    python3 build/testing-tools/case_ref.py --run 415 --all --status failed

Prints one line per case, ready to paste under a ---REFERENCE--- line.
"""
import argparse, sys

sys.path.insert(0, 'build/testing-tools')
import tr_client as t

BASE = 'https://shopview.testrail.io/index.php?'
STATUS = {1: 'Passed', 2: 'Blocked', 3: 'Untested', 4: 'Retest', 5: 'Failed'}


def paged_tests(run_id):
    out, off = [], 0
    while True:
        s, r = t.get('get_tests/%d&limit=250&offset=%d' % (run_id, off))
        if s != 200:
            sys.exit('get_tests failed: %s %s' % (s, r))
        out += r['tests']
        if r.get('_links', {}).get('next'):
            off += 250
        else:
            return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--run', type=int, required=True)
    ap.add_argument('--all', action='store_true')
    ap.add_argument('--status', help='filter: passed / failed / blocked / untested / retest')
    ap.add_argument('cases', nargs='*', help='C-ids, e.g. C55673')
    a = ap.parse_args()

    tests = paged_tests(a.run)
    by_case = {x['case_id']: x for x in tests}

    if a.all:
        wanted = sorted(by_case)
    else:
        if not a.cases:
            sys.exit('give some C-ids, or --all')
        wanted = [int(c.lstrip('Cc')) for c in a.cases]

    if a.status:
        want = a.status.lower()
        wanted = [c for c in wanted
                  if by_case.get(c) and STATUS.get(by_case[c]['status_id'], '').lower() == want]

    print('Run %d: %s/runs/view/%d' % (a.run, BASE, a.run))
    missing = []
    for cid in wanted:
        row = by_case.get(cid)
        if not row:
            missing.append(cid)
            continue
        print('C%d (%s) - %s - %s/tests/view/%d'
              % (cid, STATUS.get(row['status_id'], '?'), row.get('title', '')[:58],
                 BASE, row['id']))
    if missing:
        print('\nNOT IN RUN %d: %s' % (a.run, ', '.join('C%d' % c for c in missing)))
        print('A case that is not in the run has no result link, and saying so is the point -- '
              'do not quietly fall back to a case link.')


if __name__ == '__main__':
    main()
