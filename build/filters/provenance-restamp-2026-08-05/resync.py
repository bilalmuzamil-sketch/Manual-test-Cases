#!/usr/bin/env python3
"""Re-sync the LOCAL Filters case source FROM LIVE, then report exactly what moved.
Local `expected`/`steps`/`preconditions` are plain strings, so they take the live
value verbatim - no list/string ambiguity, which is what shredded the import before."""
import json, csv, glob, os
ROOT='/home/user/Manual-test-Cases'
LIVE={c['id']:c for c in json.load(open('cases-POST.json'))}
rows=list(csv.DictReader(open(f'{ROOT}/build/filters/testrail-id-map.csv')))
to_cid={r['internal_id']: int(r['testrail_case_id'].lstrip('C')) for r in rows}
fields=[('expected','custom_expected'),('steps','custom_steps'),('preconditions','custom_preconds')]
moved={k:0 for k,_ in fields}; touched=0; files=0; unmapped=[]
for f in sorted(glob.glob(f'{ROOT}/build/filters/cases/*.json')):
    data=json.load(open(f)); changed=False
    for c in data:
        cid=to_cid.get(c.get('id'))
        if cid is None or cid not in LIVE:
            unmapped.append(c.get('id')); continue
        lv=LIVE[cid]
        for lk,rk in fields:
            new=lv.get(rk)
            if c.get(lk)!=new:
                c[lk]=new; moved[lk]+=1; changed=True
        touched+=1
    if changed:
        json.dump(data, open(f,'w'), indent=1, ensure_ascii=False); files+=1
print('local cases matched to live:',touched,'| files rewritten:',files)
print('fields moved:',moved)
print('unmapped local ids:',len(unmapped), unmapped[:5])
