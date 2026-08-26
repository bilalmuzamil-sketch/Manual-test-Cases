#!/usr/bin/env python3
"""The deliverable set: per report, every case that CITES a requirement whose definition
moved between the version that case is pinned to (or our newest held export, whichever is
closer to the case) and the LIVE version.

This is the honest completeness boundary. Verbatim wording matching (stale_check.py) proves
a case IS stale but cannot prove one is not: our cases are written in plain layman English
(Rules 7/9), not copied from the spec, so a case can assert a superseded rule without
sharing a single phrase with it — WIP C30482 does exactly that. So the CITATION set is the
re-verification list, and the wording set is the proven-wrong subset inside it.
"""
import json,os,sys
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,HERE)
from verify import flatten,anchor_texts,live_body,held_body,definition,R,OUT,DATA,SPECS

BASE={ # report -> baseline to diff against live: ('pin',v) uses the fetched historical body
 'IV':[('held',6)], 'PV':[('pin',10)], 'SBR':[('held',22)],
 'WIP':[('pin',21),('pin',22),('pin',24)], 'SBC':[('held',20)], 'TU':[('held',9)]}

def body(code,kind,v):
    slug,hslug,_=R[code]
    if kind=='held': return held_body(hslug,v)
    return json.load(open(os.path.join(SPECS,f'{slug}-v{v}.json')))['body']['storage']['value']

pins={r['cid']:r for r in json.load(open(os.path.join(DATA,'case-version-pins.json')))}
final={}
for code,bases in BASE.items():
    slug=R[code][0]; lx,lver,lmod=live_body(slug); la=anchor_texts(flatten(lx))
    res=json.load(open(os.path.join(OUT,f'{code}.json')))
    need={}
    for kind,v in bases:
        pa=anchor_texts(flatten(body(code,kind,v)))
        changed=[a for a in sorted(set(pa)&set(la)) if definition(pa,a)!=definition(la,a)]
        grp=[c for c,p in pins.items() if p['report']==code and (kind=='held' or str(p['cited'])==str(v))]
        for a in changed:
            for cid in res['cites'].get(a,[]):
                if cid in grp: need.setdefault(cid,[]).append(f'{a}(vs v{v})')
    total=sum(1 for p in pins.values() if p['report']==code)
    final[code]={'live':lver,'lastmod':lmod,'cases':total,'baselines':[f'{k} v{v}' for k,v in bases],
                 'needs_recheck':sorted(need),'n_needs':len(need),
                 'safe':total-len(need),'anchor_map':need}
    print(f"{code}: live v{lver} cases={total} NEEDS-RECHECK={len(need)} SAFE={total-len(need)}")
    if need: print('     '+', '.join(sorted(need)))
json.dump(final,open(os.path.join(OUT,'FINAL-TABLE.json'),'w'),indent=1)
