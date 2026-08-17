#!/usr/bin/env python3
"""Byte-verified update_case for the Fabian-review changes. Sends all three text fields + refs
+ title (§2.1). tr.update_case_verified re-GETs and byte-compares every field; raises on any
mismatch (STOP the batch, Rule 50). Per-op oplog, resumable."""
import sys,json,os,datetime,time
sys.path.insert(0,'/tmp/testrail'); sys.path.insert(0,os.path.dirname(__file__))
import tr
from updates_core import U as CORE
from updates_entity import U as ENT
ALL={}; ALL.update(CORE); ALL.update(ENT)
ORDER=sorted(ALL.keys())
HERE=os.path.dirname(__file__); OPLOG=os.path.join(HERE,'oplog-update.jsonl')
def log(r): 
    open(OPLOG,'a').write(json.dumps(r)+'\n')
def run(a,b):
    done=set()
    if os.path.exists(OPLOG):
        for ln in open(OPLOG):
            r=json.loads(ln)
            if r.get('op')=='update_case' and r.get('verify'): done.add(r['cid'])
    for cid in ORDER[a:b]:
        if cid in done: print("SKIP C%d (already verified)"%cid); continue
        u=ALL[cid]
        payload={'title':u['title'],'refs':u['refs'],'custom_preconds':u['preconds'],
                 'custom_steps':u['steps'],'custom_expected':u['expected']}
        log({'op':'update_case','cid':cid,'intent':datetime.datetime.utcnow().isoformat()+'Z'})
        st,line,before,after=tr.update_case_verified(cid,payload)
        # confirm foreign guard: we only touch our own (created_by 3)
        if before.get('created_by')!=3:
            raise SystemExit("REFUSE: C%d created_by=%s is FOREIGN"%(cid,before.get('created_by')))
        log({'op':'update_case','cid':cid,'http':st,'verify':line,'ts':datetime.datetime.utcnow().isoformat()+'Z'})
        print("OK C%d: %s"%(cid,line))
        time.sleep(0.25)
if __name__=='__main__':
    a=int(sys.argv[1]) if len(sys.argv)>1 else 0
    b=int(sys.argv[2]) if len(sys.argv)>2 else len(ORDER)
    print("total updates:",len(ORDER))
    run(a,b); print("DONE update batch [%d:%d]"%(a,b))
