#!/usr/bin/env python3
"""Third detector: for each requirement, are its distinctive words present in at
least one of its OWN candidate cases (not merely somewhere in the corpus)?
Flags 'covered by the wrong case' and partially-asserted multi-clause rules."""
import json, glob, re, pathlib
BASE=pathlib.Path('build/schedule/coverage-rederivation-2026-07-31')
reqs=json.load(open(BASE/'requirement-case-candidates.json'))
cases={}
for f in sorted(glob.glob('build/schedule/cases/*.json')):
    d=json.load(open(f)); cs=d if isinstance(d,list) else d.get('cases',d)
    for c in cs:
        if str(c.get('viu_status','')).startswith('Retired'): continue
        cases[c['id']]=' '.join([c.get('title',''),c.get('notes','') or '',
            ' '.join(c.get('preconditions',[]) or []),' '.join(c.get('steps',[]) or []),
            ' '.join(c.get('expected',[]) or [])]).lower()
# corpus doc frequency to find rare/distinctive words
from collections import Counter
df=Counter()
for t in cases.values():
    for w in set(re.sub(r'[^a-z0-9]',' ',t).split()): df[w]+=1
NONTEST={'1','1.1','1.2','2','13','15'}
out=[]
for r in reqs:
    if r['section'] in NONTEST: continue
    ws=[w for w in re.sub(r'[^a-z0-9]',' ',r['text'].lower()).split() if len(w)>3]
    # distinctive = appears in <=12 cases corpus-wide (rare) and at least once
    dist=[w for w in dict.fromkeys(ws) if 0 < df[w] <= 12]
    if not dist: continue
    cand=[c['case'] for c in r['candidates']]
    covered=[w for w in dist if any(w in cases[cid] for cid in cand)]
    missing=[w for w in dist if w not in covered]
    if missing:
        out.append((r['id'],r['section'],missing,r['text']))
print('requirements whose distinctive words are missing from ALL their candidate cases:',len(out))
for rid,sec,miss,txt in out:
    print('%-12s §%-6s missing_in_candidates=%s' % (rid,sec,','.join(miss)))
    print('     '+txt[:170])
