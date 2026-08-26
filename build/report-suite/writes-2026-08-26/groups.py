import json, csv, os, re
SV='/home/user/Manual-test-Cases/build/report-suite/source-verify-2026-08-26'
FC='/home/user/Manual-test-Cases/build/report-suite/format-check-2026-08-21/RESULTS.csv'
cases={('C%d'%c['id']):c for c in json.load(open(SV+'/data/live-cases.json'))}
pins=json.load(open(SV+'/data/case-version-pins.json'))
HELD={'C30265','C43831'}

GA={'SBR':['C30218','C30234','C30241','C43828','C43830','C30287'],
    'WIP':['C30470','C30474','C30482','C30512','C30518','C30525','C43820'],
    'IV':['C30597','C30610']}
ga=[c for v in GA.values() for c in v]

# format check
rows=list(csv.DictReader(open(FC)))
def has(r,k): return k in (r['reasons'] or '')
gd_raw=[r['case_id'] for r in rows if has(r,'raw-list-markup')]
gd_title=[r['case_id'] for r in rows if has(r,'title-too-long')]
gd_notlast=[r['case_id'] for r in rows if has(r,'marker-not-last')]
gd_jargon=[r['case_id'] for r in rows if has(r,'jargon:http_status')]
gd_blank=[r['case_id'] for r in rows if has(r,'no-blank-line-before-marker')]
ge=[r['case_id'] for r in rows if has(r,'no-automation-marker')]

pass
print('GroupA',len(ga))
print('GroupD raw',len(gd_raw),'title',len(gd_title),'notlast',len(gd_notlast),'jargon',len(gd_jargon),'blank',len(gd_blank))
print('GroupE',len(ge), ge)

LIVE={'IV':'10','PV':'11','SBC':'20','SBR':'24','TU':'9','WIP':'28'}
by={}
for p in pins:
    by.setdefault(p['report'],[]).append(p)
print('--- pins by report ---')
for r,v in sorted(by.items()):
    from collections import Counter
    print(r, 'live',LIVE[r], Counter([x['cited'] for x in v]))
# Group B: WIP with no pin
gb=[p['cid'] for p in pins if p['report']=='WIP' and not p['cited']]
print('GroupB (WIP unpinned)',len(gb),gb)
# Group C: content-current cases whose cited != live
stale={}
for code in ['IV','PV','SBR','WIP','SBC','TU']:
    s=json.load(open(SV+f'/reports/{code}-stale.json'))
    stale[code]=set(s['stale_cids'])
gc=[]
for p in pins:
    r=p['report']
    if not p['cited']: continue
    if p['cited']==LIVE[r]: continue
    if p['cid'] in stale[r] or p['cid'] in ga or p['cid'] in HELD: continue
    gc.append(p['cid'])
print('GroupC candidates',len(gc))
json.dump({'A':ga,'B':gb,'C':gc,'D_raw':gd_raw,'D_title':gd_title,'D_notlast':gd_notlast,
           'D_jargon':gd_jargon,'D_blank':gd_blank,'E':ge,'HELD':sorted(HELD)},
          open('/tmp/rswrite/groups.json','w'),indent=1)
alltargets=sorted(set(ga+gb+gc+gd_raw+gd_title+gd_notlast+gd_jargon+gd_blank+ge)-HELD, key=lambda x:int(x[1:]))
json.dump(alltargets,open('/tmp/rswrite/targets.json','w'))
print('TOTAL DISTINCT TARGETS',len(alltargets))
