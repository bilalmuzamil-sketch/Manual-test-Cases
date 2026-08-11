import tr, json, sys, hashlib
tag = sys.argv[1]
rows = json.load(open('rows.json'))
# the 44 candidates (ours, atm=3, Filters + Report Suite) + every foreign case in the three groups
cand = [r['id'] for r in rows if r['atm']==3 and r['created_by']==3 and r['proj'] in ('Filters','ReportSuite')]
foreign = [r['id'] for r in rows if r['created_by']!=3]
ids = sorted(set(cand)|set(foreign))
snap={}
for cid in ids:
    st,c = tr.req(f'get_case/{cid}')
    assert st==200,(cid,st,c)
    snap[str(cid)]=c
p=f'../snapshots/CASES-{tag}.json'
json.dump(snap, open(p,'w'), indent=1, sort_keys=True)
print(f'{tag}: {len(cand)} candidates + {len(foreign)} foreign = {len(ids)} cases')
print('sha256', hashlib.sha256(open(p,'rb').read()).hexdigest(), '->', p)
