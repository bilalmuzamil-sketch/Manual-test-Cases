import sys,json
sys.path.insert(0,'/tmp'); import tr
sys.path.insert(0,'build/report-suite/fabian-review-2026-08-17'); import rslib as R
sys.path.insert(0,'build/testing-tools'); from testrail_add_case import add_case_payload
new=json.load(open('/tmp/new_cases.json'))
LOG='build/report-suite/fabian-review-2026-08-17/oplog-new.txt'
f=open(LOG,'a'); 
def L(s): f.write(s+'\n'); f.flush(); print(s)
L(f"# NEW cases (item 7 CSV-metadata x6 + items 2/3/4 visual x3) {R.now()}")
created=[]
for o in new:
    payload=add_case_payload(title=o['title'],refs=o['refs'],preconds=o['preconds'],steps=o['steps'],expected=o['expected'])
    L(f"INTENT {R.now()} add_case sec={o['section_id']} {o['id']}")
    st,body=tr.req(f"add_case/{o['section_id']}",payload)
    if st not in (200,201): L(f"  FAIL HTTP {st} -> {json.dumps(body)[:200]}"); raise SystemExit(2)
    cid=body['id']; live=R.get_live(cid)
    checks={'title':o['title'],'custom_preconds':o['preconds'],'custom_steps':o['steps'],'custom_expected':o['expected']}
    mism=[k for k,v in checks.items() if v!=live.get(k)]
    if R.norm_refs(o['refs'])!=R.norm_refs(live.get('refs')): mism.append('refs')
    if live.get('custom_atmstatus')!=1: mism.append('atmstatus')
    if mism: L(f"  MISMATCH {mism} on C{cid}"); raise SystemExit(3)
    L(f"  OK C{cid} {o['id']} verified 6 fields byte-identical atm=1")
    created.append((o['id'],cid,o['title'],o['section_id']))
json.dump(created,open('build/report-suite/fabian-review-2026-08-17/new-created-ids.json','w'),indent=1)
L(f"# CREATED {len(created)}: {[c[1] for c in created]}"); f.close()
