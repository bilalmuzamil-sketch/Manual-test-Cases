#!/usr/bin/env python3
import json, glob, sys, pathlib, re
BASE = pathlib.Path('build/schedule/coverage-rederivation-2026-07-31')
reqs = json.load(open(BASE / 'requirement-case-candidates.json'))
cases = {}
for f in sorted(glob.glob('build/schedule/cases/*.json')):
    d = json.load(open(f)); cs = d if isinstance(d, list) else d.get('cases', d)
    for c in cs:
        if str(c.get('viu_status','')).startswith('Retired'): continue
        cases[c['id']] = c
want = sys.argv[1:]
for sec in want:
    rs = [r for r in reqs if r['section'] == sec]
    print('#'*70); print('SECTION §%s  (%d requirements)' % (sec, len(rs))); print('#'*70)
    for r in rs:
        print('\n[%s] %s' % (r['id'], r['kind']))
        print('   TEXT: ' + r['text'])
        print('   cands: ' + ', '.join('%s%s(%.2f)' % (c['case'], '*' if c['anchor'] else '', c['score']) for c in r['candidates'][:6]))
    anch = sorted({c['case'] for r in rs for c in r['candidates'] if c['anchor']})
    print('\n--- CASES ANCHORED TO §%s (%d) ---' % (sec, len(anch)))
    for cid in anch:
        c = cases[cid]
        print(' %-16s %s' % (cid, c['title']))
        print('%s   EXP: %s' % (' '*16, ' | '.join(x[3:] if re.match(r'^\d+\.\s',x) else x for x in c.get('expected', []))[:600]))
