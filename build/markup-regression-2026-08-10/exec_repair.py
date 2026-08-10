"""Repair raw markup on the 37 cases. Formatting only; text preserved word-for-word.
Rule 50: every write re-GET and byte-compared; every unintended field proven byte-identical.
On any mismatch the batch STOPS."""
import sys, json, re, datetime
sys.path.insert(0,'/tmp/mk'); sys.path.insert(0,'/tmp/mk/rep')
from tr import call
from demark import demark, words

TEXT = ('custom_preconds','custom_steps','custom_expected')
IDS = json.load(open('/tmp/mk/rep/targets.json'))
SNAP = {c['id']: c for c in json.load(open('/tmp/mk/rep/pre-write-snapshot.json'))}
LOGP = '/tmp/mk/rep/oplog.jsonl'

def shape_ok(cid, exp):
    """Assert the payload's shape BEFORE sending."""
    problems=[]
    if re.search(r'<[a-zA-Z/!]', exp): problems.append('markup still present')
    prov=[l for l in exp.splitlines() if l.strip().startswith('This is the expected behaviour')]
    if len(prov)>1: problems.append(f'{len(prov)} provenance lines')
    marks=[l for l in exp.splitlines() if l.strip().startswith('AUTOMATION:')]
    if len(marks)>1: problems.append(f'{len(marks)} automation markers')
    if marks:
        last=[l for l in exp.splitlines() if l.strip()][-1]
        if not last.strip().startswith('AUTOMATION:'): problems.append('marker is not the last line')
    return problems

def main():
    done=set()
    try:
        for line in open(LOGP):
            r=json.loads(line)
            if r.get('verified'): done.add(r['cid'])
    except FileNotFoundError: pass
    log=open(LOGP,'a')
    ok=fail=0
    print('resume: already verified', len(done))
    for n,cid in enumerate(IDS,1):
        if cid in done: continue
        snap=SNAP[cid]
        intended={}
        for f in TEXT:
            v=snap.get(f) or ''
            if re.search(r'<[a-zA-Z/!]', v):
                out,left=demark(v)
                assert not left, (cid,f,left)
                assert words(v)==words(out), (cid,f,'WORD LOSS')
                intended[f]=out
            else:
                intended[f]=v
        probs=shape_ok(cid, intended['custom_expected'])
        if probs:
            print(f'  !! C{cid} PAYLOAD SHAPE REJECTED: {probs}'); print('STOPPING THE BATCH (Rule 50)')
            log.write(json.dumps(dict(cid=cid,op='update_case',http=None,verified=False,problems=probs))+'\n')
            fail+=1; break
        st,resp=call(f'update_case/{cid}', intended)
        if st!=200:
            print(f'  !! C{cid} HTTP {st} {str(resp)[:300]}'); print('STOPPING THE BATCH (Rule 50)')
            log.write(json.dumps(dict(cid=cid,op='update_case',http=st,verified=False,error=str(resp)[:600]))+'\n')
            fail+=1; break
        st2,live=call(f'get_case/{cid}')
        if st2!=200:
            print(f'  !! C{cid} re-GET HTTP {st2}'); print('STOPPING THE BATCH (Rule 50)'); fail+=1; break
        # EXHAUSTIVE: every field. intended three must match; all others byte-identical to snapshot.
        problems=[]; compared=0
        for k in sorted(set(live) | set(snap)):
            compared+=1
            if k in ('updated_on','updated_by'):   # expected to move on a real write
                continue
            want = intended[k] if k in intended else snap.get(k)
            if live.get(k) != want:
                problems.append({'field':k,'want':repr(want)[:220],'got':repr(live.get(k))[:220]})
        good = not problems
        log.write(json.dumps(dict(cid=cid,op='update_case',http=st,verified=good,
                  fields_compared=compared,problems=problems))+'\n'); log.flush()
        if good:
            ok+=1; print(f'  [{n}/{len(IDS)}] C{cid} 200 + byte-verified MATCH ({compared} fields)')
        else:
            fail+=1; print(f'  !! C{cid} VERIFY FAILED ({compared} fields): {json.dumps(problems)[:1200]}')
            print('STOPPING THE BATCH (Rule 50)'); break
    print(f'\nverified OK {ok} | failed {fail}')
    return 0 if fail==0 else 1

if __name__=='__main__':
    sys.exit(main())
