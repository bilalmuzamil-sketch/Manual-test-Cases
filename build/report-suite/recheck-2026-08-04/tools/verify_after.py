#!/usr/bin/env python3
"""Post-push verification, Rule 50: EXHAUSTIVE then EXACT."""
import json,os,sys,csv,re
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__))); import tr
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','data')
BUILD='v3.4.1-3d03023'
LEAD='This is the expected behaviour as per the build tested on'
STAMP=f'{LEAD} 8/4/2026 (build {BUILD})'
snap={str(c['id']):c for c in json.load(open(os.path.join(D,'live-cases-START.json')))}
rs=set(json.load(open(os.path.join(D,'rs-sections.json'))))
allc=tr.get_cases()
under=[c for c in allc if c['section_id'] in rs]
ours=[c for c in under if c.get('created_by')==3]
foreign=[c for c in under if c.get('created_by')!=3]
print('=== LIVE AFTER THE PUSH ===')
print('  under group 4281 :',len(under))
print('  ours             :',len(ours))
print('  foreign          :',len(foreign))
print()
# 1. every one of ours carries the NEW stamp
missing=[c['id'] for c in ours if STAMP not in (c.get('custom_expected') or '')]
dbl=[c['id'] for c in ours if (c.get('custom_expected') or '').count('(build ')>1]
print('=== RULE 54 PROVENANCE, EXHAUSTIVE ===')
print(f'  cases carrying the new build stamp : {len(ours)-len(missing)}/{len(ours)}')
print(f'  cases MISSING it                   : {len(missing)} {missing[:6]}')
print(f'  cases with a DOUBLED (build ...)   : {len(dbl)} {dbl[:6]}')
# 2. no unintended field moved, on EVERY case
VOL={'updated_on','updated_by'}
coll=[]
for c in ours:
    pre=snap.get(str(c['id']))
    if not pre: coll.append((c['id'],'no snapshot')); continue
    for k in set(pre)|set(c):
        if k in VOL or k=='custom_expected': continue
        if pre.get(k)!=c.get(k): coll.append((c['id'],k))
print(f'\n=== COLLATERAL FIELD CHANGES (should be 0) : {len(coll)} {coll[:6]}')
# 3. DO-NOT-AUTOMATE warnings
dna=[c['id'] for c in ours if 'DO NOT AUTOMATE' in (c.get('custom_expected') or '')]
print(f'=== DO-NOT-AUTOMATE warnings present : {len(dna)} (expected 47)')
# 4. the SV-8819 line must be GONE from both, and still present for 8818/8820
for tk,exp in (('SV-8819',0),('SV-8818',10),('SV-8820',4)):
    n=len([c for c in ours if tk in (c.get('custom_expected') or '')])
    print(f'=== cases citing {tk}: {n} (expected {exp}) {"OK" if n==exp else "*** CHECK ***"}')
# 5. foreign byte-identical INCLUDING timestamps
fs=json.load(open(os.path.join(D,'foreign-START.json')))
fnow={str(c['id']):c for c in allc if c['id'] in tr.FOREIGN}
fdiff=[]
for k,v in fs.items():
    n=fnow.get(k)
    if not n: fdiff.append((k,'GONE')); continue
    for f in set(v)|set(n):
        if v.get(f)!=n.get(f): fdiff.append((k,f))
print(f'\n=== FOREIGN CASES byte-identical (incl. updated_on/by): {len(fdiff)==0}  diffs={fdiff[:6]}')
# 6. run 359
s,run=tr.api('get_run/359')
def paged(b,k):
    o=[];off=0
    while True:
        s,j=tr.api(f'{b}&limit=250&offset={off}')
        x=j.get(k,j if isinstance(j,list) else []); o+=x
        if len(x)<250: break
        off+=250
    return o
tests=paged('get_tests/359','tests'); res=paged('get_results_for_run/359','results')
t0=json.load(open(os.path.join(D,'run359-tests-START.json')))
r0=json.load(open(os.path.join(D,'run359-results-START.json')))
ids0={r['id'] for r in r0}; ids1={r['id'] for r in res}
tc={t['case_id'] for t in tests}; oid={c['id'] for c in ours}
print('\n=== RUN 359 ===')
print(f'  include_all        : {run.get("include_all")} (was False)')
print(f'  tests              : {len(tests)} (was {len(t0)})')
print(f'  results            : {len(res)} (was {len(r0)})')
print(f'  EVERY prior result present BY ID : {ids0.issubset(ids1)}  missing={sorted(ids0-ids1)[:5]}')
print(f'  case_ids set-equal to ours BOTH WAYS : {tc==oid}')
json.dump({'ours':len(ours),'under':len(under),'foreign':len(foreign),'stampMissing':missing,
 'doubled':dbl,'collateral':coll,'dna':len(dna),'foreignDiffs':fdiff,
 'run':{'include_all':run.get('include_all'),'tests':len(tests),'results':len(res),
        'allPriorResultsById':ids0.issubset(ids1),'caseIdsSetEqual':tc==oid}},
 open(os.path.join(D,'verify-after.json'),'w'),indent=1)
