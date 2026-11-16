#!/usr/bin/env python3
"""Area 1: per-check PASS/FAIL, 28 Oct vs 16 Nov, for one worker folder. Prints only checks whose FAIL count changed
or that are new/missing, plus totals; writes area1/<w>/compare-28oct-16nov.json. Usage: compare_checks.py <worker folder>"""
import json, sys, os, glob, collections
B = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28'; w = sys.argv[1]
def per_check(j):
    c = collections.Counter()
    if isinstance(j, dict) and isinstance(j.get('tally'), list):
        for t in j['tally']: c[(t.get('check'), t.get('result'))] += t.get('count', 0)
        return c
    rows = None
    if isinstance(j, dict):
        for k in ('rows', 'checks', 'results'):
            if isinstance(j.get(k), list): rows = j[k]; break
        if rows is None and isinstance(j.get('tally'), dict):
            for k, v in j['tally'].items(): c[(k, 'n')] += v if isinstance(v, int) else 0
            return c
    elif isinstance(j, list): rows = j
    for r in rows or []:
        if isinstance(r, dict): c[(r.get('check') or r.get('id') or r.get('desc', '?')[:40], r.get('result') or r.get('verdict') or r.get('status'))] += r.get('count', 1)
    return c
OUT = {}
for new in sorted(glob.glob(f'{B}/report-gaps-2026-11-16/area1/{w}/results-*.json')):
    n = os.path.basename(new); old = f'{B}/reports/{w}/{n}'
    cn = per_check(json.load(open(new))); co = per_check(json.load(open(old))) if os.path.exists(old) else collections.Counter()
    checks = sorted({k[0] for k in cn} | {k[0] for k in co}, key=str); diff = []
    for ch in checks:
        o = {r: v for (c, r), v in co.items() if c == ch}; nn = {r: v for (c, r), v in cn.items() if c == ch}
        if o.get('FAIL', 0) != nn.get('FAIL', 0) or (bool(o) != bool(nn)): diff.append({'check': ch, '28oct': o, '16nov': nn})
    tot = lambda c, r: sum(v for (k, rr), v in c.items() if rr == r)
    OUT[n] = {'28oct': {'PASS': tot(co, 'PASS'), 'FAIL': tot(co, 'FAIL')}, '16nov': {'PASS': tot(cn, 'PASS'), 'FAIL': tot(cn, 'FAIL')}, 'changed_checks': diff}
    print(n, OUT[n]['28oct'], '->', OUT[n]['16nov'], '| changed checks:', len(diff))
    for d in diff[:8]: print('    ', str(d['check'])[:70], d['28oct'], '->', d['16nov'])
json.dump(OUT, open(f'{B}/report-gaps-2026-11-16/area1/{w}/compare-28oct-16nov.json', 'w'), indent=1, default=str)
