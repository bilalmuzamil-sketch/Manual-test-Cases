#!/usr/bin/env python3
"""Execute the Filters repair. Every write re-GET and byte-compared, ALL fields, no sampling."""
import json, sys, time
sys.path.insert(0,'/tmp/fv')
from tr import api, verify, norm_refs
PLAN=json.load(open('/tmp/fv/plan.json'))
SNAP={c['id']:c for c in json.load(open('/tmp/fv/cases-PRE.json'))}
LOG=open('/tmp/fv/exec-log.jsonl','a')
done=set()
try:
    for line in open('/tmp/fv/exec-log.jsonl'):
        r=json.loads(line)
        if r.get('verified'): done.add(r['cid'])
except FileNotFoundError: pass
print('already verified:',len(done))
ok=fail=0
for i,p in enumerate(PLAN,1):
    cid=p['cid']
    if cid in done: continue
    # DISCOVERED THIS PASS: TestRail re-renders any TEXT field you OMIT from an update_case
    # payload through its HTML pipeline (wraps it in <p> and converts \n to \r\n). A field
    # you send explicitly is stored verbatim. So send all three text fields every time, with
    # the unchanged ones set to their exact pre-write snapshot value.
    snap=SNAP[cid]
    intended={'custom_expected':p['expected'],
              'custom_preconds':snap.get('custom_preconds'),
              'custom_steps':snap.get('custom_steps')}
    if p['changed_refs']: intended['refs']=p['refs']
    st,resp=api(f'update_case/{cid}', intended)
    if st!=200:
        rec=dict(cid=cid,op='update_case',http=st,verified=False,error=str(resp)[:600])
        LOG.write(json.dumps(rec)+'\n'); LOG.flush()
        print(f'  !! C{cid} HTTP {st} {str(resp)[:200]}'); fail+=1
        print('STOPPING THE BATCH (Rule 50: a mismatch means the write failed)'); break
    st2,live=api(f'get_case/{cid}')
    if st2!=200:
        print(f'  !! C{cid} re-GET HTTP {st2}'); fail+=1; break
    good,probs,nf=verify(live, SNAP[cid], intended)
    rec=dict(cid=cid,op='update_case',http=st,verified=good,fields_compared=nf,
             why=p['why'],problems=probs)
    LOG.write(json.dumps(rec)+'\n'); LOG.flush()
    if good:
        ok+=1
        if i%20==0 or i<4: print(f'  [{i}/{len(PLAN)}] C{cid} 200 + byte-verified MATCH ({nf} fields)')
    else:
        fail+=1
        print(f'  !! C{cid} VERIFY FAILED ({nf} fields): {json.dumps(probs)[:900]}')
        print('STOPPING THE BATCH (Rule 50)'); break
print(f'\nverified OK {ok} | failed {fail}')
