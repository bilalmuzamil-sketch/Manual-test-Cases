#!/usr/bin/env python3
"""Compare the LOCAL case source against LIVE TestRail by CONTENT, never by count.

Standing Rule 50: exhaustive (every case, every tester-facing field) then exact
(byte comparison). Read-only against TestRail; writes only a JSON report.

Why content and not counts: four counts reconcile perfectly over stale content.
Filters had all 114 local bodies stale on 2026-08-11 while every count matched.
"""
import glob
import json
import os
import sys
from collections import Counter

LIVE = '/tmp/qg/live-3proj.json'
# local field name -> live TestRail field name
FIELDS = {'title': 'title', 'preconditions': 'custom_preconds',
          'steps': 'custom_steps', 'expected': 'custom_expected', 'refs': 'refs'}
IDKEYS = ('testrail_id', 'testrail_case_id', 'case_id')
PROJECTS = {'Filters': 'filters', 'Schedule': 'schedule', 'ReportSuite': 'report-suite'}


def cid_of(c):
    for k in IDKEYS:
        v = c.get(k)
        if v:
            return str(v).strip().lstrip('C')
    return None


def load_local(d):
    out = {}
    for f in sorted(glob.glob(f'build/{d}/cases/*.json')):
        try:
            data = json.load(open(f))
        except Exception:
            continue
        if not isinstance(data, list):
            continue
        for c in data:
            cid = cid_of(c)
            if cid:
                out[cid] = (c, f)
    return out


def norm(s):
    """Normalise a local or live field to one comparable string.

    The local source stores preconditions/steps/expected EITHER as a list of
    lines (Report Suite) OR as an already-joined string (Filters, Schedule).
    Live TestRail always returns a newline-joined string. Comparing the raw
    values reports every list-shaped case as drifted -- 479 of 480 on the
    Report Suite -- which is a representation difference and NOT content drift.
    This is the same list-vs-string confusion behind the `joinlines` shredding
    bug that corrupted three generated imports.
    """
    if s is None:
        return ''
    if isinstance(s, list):
        return '\n'.join(str(x) for x in s)
    return str(s)


def main():
    live = json.load(open(LIVE))
    report = {}
    for proj, d in PROJECTS.items():
        lv = {str(c['id']): c for c in live[proj] if c['created_by'] == 3}
        lc = load_local(d)
        drift, missing_local, missing_live = [], [], []
        for cid, lcase in sorted(lv.items(), key=lambda x: int(x[0])):
            if cid not in lc:
                missing_local.append('C' + cid)
                continue
            loc, path = lc[cid]
            diffs = []
            for lk, vk in FIELDS.items():
                a, b = norm(loc.get(lk)), norm(lcase.get(vk))
                if a != b:
                    diffs.append({'field': lk, 'local': a, 'live': b})
            if diffs:
                drift.append({'cid': 'C' + cid, 'file': path,
                              'fields': [x['field'] for x in diffs], 'detail': diffs})
        for cid in lc:
            if cid not in lv:
                missing_live.append('C' + cid)
        report[proj] = {'live_ours': len(lv), 'local_with_cid': len(lc),
                        'drifted': len(drift), 'drift': drift,
                        'in_live_not_local': missing_local,
                        'in_local_not_live': missing_live}
        print(f'{proj}: live(ours)={len(lv)} local={len(lc)} DRIFTED={len(drift)}'
              f' onlyLive={len(missing_local)} onlyLocal={len(missing_live)}')
        if drift:
            print('   fields moved:', dict(Counter(f for x in drift for f in x['fields'])))
            for x in drift[:80]:
                print('   ', x['cid'], x['fields'])
    out = sys.argv[1] if len(sys.argv) > 1 else \
        'build/quality-gate-2026-08-11/evidence/local-vs-live.json'
    os.makedirs(os.path.dirname(out), exist_ok=True)
    json.dump(report, open(out, 'w'), indent=1)
    print('\nwritten:', out)


if __name__ == '__main__':
    main()
