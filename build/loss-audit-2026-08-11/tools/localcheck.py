import sys,json,glob,csv
d=json.load(open('/tmp/lossaudit/suites-live.json'))
live={c['id']:c for c in d['all']}
def norm(x): return ('\n'.join(str(i) for i in x) if isinstance(x,list) else str(x or ''))
for name,base,casedir in (('schedule','/home/user/Manual-test-Cases/build/schedule/','cases'),
                          ('report_suite','/home/user/Manual-test-Cases/build/report-suite/','cases')):
    idmap=base+'testrail-id-map.csv'
    m={}
    for r in csv.DictReader(open(idmap)):
        k=list(r.keys())
        iid=r[k[0]]; v=str(r.get('testrail_case_id') or r.get('case_id') or '').strip().lstrip('Cc')
        if v.isdigit(): m[iid]=int(v)
    loc={}
    for f in glob.glob(base+casedir+'/*.json'):
        try: rows=json.load(open(f))
        except Exception: continue
        if not isinstance(rows,list): continue
        for c in rows:
            if isinstance(c,dict) and c.get('id') in m: loc[m[c['id']]]=c
    diff=[cid for cid,c in loc.items() if cid in live and norm(c.get('expected')).strip()!=(live[cid].get('custom_expected') or '').strip()]
    print(f'{name:14s} idmap={len(m):4d} matched={len(loc):4d} expected-diffs={len(diff):4d}', ('sample '+str(diff[:3])) if diff else '')
