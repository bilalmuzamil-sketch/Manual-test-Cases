#!/usr/bin/env python3
import sys, json, os, datetime, time
sys.path.insert(0,'/tmp/testrail'); sys.path.insert(0,'build/testing-tools')
import tr
from testrail_add_case import add_case_payload
HERE=os.path.dirname(__file__)
JSON=os.path.join(HERE,'..','cases','cases-J-fabian-review-2026-08-17.json')
OPLOG=os.path.join(HERE,'oplog-add.jsonl')
cases=json.load(open(JSON))
def log(r):
    open(OPLOG,'a').write(json.dumps(r)+'\n')
TEXT={'title':'title','refs':'refs','preconditions':'custom_preconds','steps':'custom_steps','expected':'custom_expected'}
norm=lambda s: ",".join(p.strip() for p in (s or '').split(","))
def run(a,b):
    for c in cases[a:b]:
        if c.get('testrail_case_id'):
            print("SKIP",c['id'],"already C%s"%c['testrail_case_id']); continue
        payload=add_case_payload(title=c['title'],refs=c['refs'],preconds=c['preconditions'],steps=c['steps'],expected=c['expected'])
        sid=c['section_id']; t0=datetime.datetime.utcnow().isoformat()+'Z'
        log({'op':'add_case','iid':c['id'],'section':sid,'intent':t0})
        st,body=tr.api(f"add_case/{sid}","POST",payload)
        if st not in (200,201) or not isinstance(body,dict) or 'id' not in body:
            log({'op':'add_case','iid':c['id'],'http':st,'result':'FAILED','body':str(body)[:300]}); raise SystemExit("ADD FAILED %s %s %s"%(c['id'],st,str(body)[:200]))
        cid=body['id']; st2,live=tr.get_case(cid); assert st2==200
        bad=[]
        for src,fld in TEXT.items():
            w=c[src]; g=live.get(fld)
            if fld=='refs':
                if norm(w)!=norm(g): bad.append(f"{fld} want={w!r} got={g!r}")
            elif w!=g: bad.append(f"{fld} MISMATCH len want={len(w)} got={len(g or '')}")
        if live.get('custom_atmstatus')!=1: bad.append("atmstatus=%s (must be 1)"%live.get('custom_atmstatus'))
        if bad:
            log({'op':'verify','iid':c['id'],'cid':cid,'result':'BYTE-MISMATCH','bad':bad}); raise SystemExit("VERIFY FAILED %s C%s\n%s"%(c['id'],cid,"\n".join(bad)))
        c['testrail_case_id']=cid
        log({'op':'add_case','iid':c['id'],'cid':cid,'http':st,'atmstatus':1,'verify':'MATCH 5 fields','ts':datetime.datetime.utcnow().isoformat()+'Z'})
        print("OK %s -> C%s (5 fields byte-match, atmstatus=1)"%(c['id'],cid))
        json.dump(cases,open(JSON,'w'),indent=1,ensure_ascii=False); time.sleep(0.3)
if __name__=='__main__':
    run(int(sys.argv[1]) if len(sys.argv)>1 else 0, int(sys.argv[2]) if len(sys.argv)>2 else len(cases))
    print("DONE add batch")
