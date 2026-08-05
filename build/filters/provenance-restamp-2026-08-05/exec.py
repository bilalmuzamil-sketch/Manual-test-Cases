#!/usr/bin/env python3
"""Write the 110 Filters provenance re-stamps. One write per case. Every write re-GET and
byte-compared on EVERY field; every field not intended to change proven byte-identical."""
import json, sys, datetime
sys.path.insert(0,'.')
from tr import api, verify
PLAN=json.load(open('plan.json'))
SNAP={c['id']:c for c in json.load(open('cases-PRE.json'))}
LOG=open('exec-log.jsonl','a')
done=set()
try:
    for line in open('exec-log.jsonl'):
        r=json.loads(line)
        if r.get('verified'): done.add(r['cid'])
except FileNotFoundError: pass
print('already verified (resume):',len(done))
print('write phase start UTC', datetime.datetime.utcnow().isoformat()+'Z')
ok=fail=0; rerender=[]
for i,p in enumerate(PLAN,1):
    cid=p['cid']
    if cid in done: continue
    snap=SNAP[cid]
    # DECLARED NORMALISATION #3 (playbook J, found on THIS project today): update_case
    # RE-RENDERS any text field you OMIT (wraps in <p>, \n -> \r\n). It is INTERMITTENT.
    # So ALL THREE text fields go on EVERY payload, the unchanged two at their exact
    # pre-write snapshot bytes. refs is deliberately NOT sent - it is not being changed.
    intended={'custom_expected':p['expected'],
              'custom_preconds':snap.get('custom_preconds'),
              'custom_steps':snap.get('custom_steps')}
    st,resp=api(f'update_case/{cid}', intended)
    if st!=200:
        LOG.write(json.dumps(dict(cid=cid,op='update_case',http=st,verified=False,
                  error=str(resp)[:800]))+'\n'); LOG.flush()
        print(f'  !! C{cid} HTTP {st} {str(resp)[:300]}'); fail+=1
        print('STOPPING THE BATCH (Rule 50)'); break
    st2,live=api(f'get_case/{cid}')
    if st2!=200:
        print(f'  !! C{cid} re-GET HTTP {st2}'); fail+=1
        print('STOPPING THE BATCH (Rule 50)'); break
    good,probs,nf=verify(live, snap, intended)
    # did the omit-field re-render fire despite sending explicitly?
    for f in ('custom_preconds','custom_steps'):
        if live.get(f)!=snap.get(f): rerender.append((cid,f))
    LOG.write(json.dumps(dict(cid=cid,op='update_case',http=st,verified=good,
              fields_compared=nf,group=p['group'],problems=probs))+'\n'); LOG.flush()
    if good:
        ok+=1
        if i%20==0 or i<3: print(f'  [{i}/{len(PLAN)}] C{cid} 200 + byte-verified MATCH ({nf} fields)')
    else:
        fail+=1
        print(f'  !! C{cid} VERIFY FAILED ({nf} fields): {json.dumps(probs)[:1500]}')
        print('STOPPING THE BATCH (Rule 50)'); break
print(f'\nverified OK {ok} | failed {fail}')
print('omit-field re-render occurrences:', len(rerender), rerender[:5])
print('write phase end UTC', datetime.datetime.utcnow().isoformat()+'Z')
