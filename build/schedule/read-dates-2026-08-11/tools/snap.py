import tr, json, datetime as dt
SNAP='../snapshots'
cases = json.load(open('/tmp/sched_cases.json'))
full={}
for c in cases:
    s,d = tr.req(f"get_case/{c['id']}")
    assert s==200, (c['id'], s, d)
    full[str(c['id'])]=d
json.dump(full, open(f'{SNAP}/cases-PRE.json','w'), indent=1)
print('cases snapshotted individually:', len(full))
# CORRECTED 2026-08-11: 1 ('Not Automated') is the EXPECTED value on a case we
# created (testrail_add_case.py::verify_created_case); 3 is Vlad's own flag and is
# the EXCEPTION to report (Rule 65), never the pass condition.
print('atmstatus==1 (expected on cases we created):', sum(1 for v in full.values() if v.get('custom_atmstatus')==1))
print('atmstatus==3 (Automated - TELL VLAD if we changed any, Rule 65):', [k for k,v in full.items() if v.get('custom_atmstatus')==3])
# bulk-vs-individual byte check on every field, all 174 (no sampling)
bulk={str(c['id']):c for c in cases}
diff=[]
for k,v in full.items():
    for f in set(v)|set(bulk[k]):
        if v.get(f)!=bulk[k].get(f): diff.append((k,f))
print('bulk-vs-individual field diffs:', len(diff), diff[:10])
print('snapshot at', dt.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ'))
