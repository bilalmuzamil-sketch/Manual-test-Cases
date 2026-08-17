import sys,json,glob,time,datetime
sys.path.insert(0,'/tmp'); import tr
sys.path.insert(0,'build/testing-tools'); from testrail_add_case import add_case_payload

PASS='build/report-suite/fabian-review-2026-08-17'
def now(): return datetime.datetime.utcnow().isoformat()+'Z'

def process(files, oplog_path):
    log=open(oplog_path,'a')
    def L(s):
        log.write(s+'\n'); log.flush(); print(s)
    created=[]
    for f in files:
        cases=json.load(open(f)); changed=False
        for c in cases:
            if c.get('testrail_id'):  # already created
                continue
            pre='\n'.join(c['preconditions']); steps='\n'.join(c['steps']); expc=c['expected']
            title=c['title']; refs=c['refs']; sec=c['section_id']
            payload=add_case_payload(title=title, refs=refs, preconds=pre, steps=steps, expected=expc)
            L(f"INTENT {now()} add_case sec={sec} {c['id']} title={title!r}")
            st,body=tr.req(f"add_case/{sec}", payload)
            if st not in (200,201):
                L(f"  FAIL HTTP {st} {c['id']} -> {json.dumps(body)[:200]}"); L("STOP: add failed"); log.close(); sys.exit(2)
            cid=body['id']
            # re-GET and byte-compare
            st2,live=tr.req(f"get_case/{cid}")
            def norm_refs(s): return ','.join(p.strip() for p in (s or '').split(','))
            checks={
              'title': (title, live.get('title')),
              'custom_preconds': (pre, live.get('custom_preconds')),
              'custom_steps': (steps, live.get('custom_steps')),
              'custom_expected': (expc, live.get('custom_expected')),
              'refs': (norm_refs(refs), norm_refs(live.get('refs'))),
              'custom_atmstatus': (1, live.get('custom_atmstatus')),
            }
            mism=[k for k,(a,b) in checks.items() if a!=b]
            if mism:
                for k in mism:
                    a,b=checks[k]; L(f"  MISMATCH {k}\n   intended={a!r}\n   live    ={b!r}")
                L(f"STOP: byte mismatch on C{cid} {c['id']}"); log.close(); sys.exit(3)
            L(f"  OK C{cid} {c['id']} HTTP {st} verified 6 fields byte-identical atmstatus={live.get('custom_atmstatus')}")
            c['testrail_id']=f"C{cid}"; created.append((c['id'],cid,title,sec)); changed=True
        if changed:
            json.dump(cases,open(f,'w'),indent=1)
    L(f"CREATED {len(created)} cases")
    json.dump(created, open(PASS+'/created-ids.json','w'), indent=1)
    log.close()
    return created

if __name__=='__main__':
    files=sys.argv[1:]
    process(files, PASS+'/testrail-execution-log.txt')
