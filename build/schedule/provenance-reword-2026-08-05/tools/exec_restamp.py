import sys,json,time
sys.path.insert(0,'/tmp/sch2')
import tr
plan=json.load(open('plan.json'))
pre={c['id']:c for c in json.load(open('snap/PRE-cases.json'))}
def norm_refs(s):
    if s is None: return None
    return ','.join(p.strip() for p in s.split(','))
LOG=open('exec-log.jsonl','a')
CMP=[k for k in pre[plan[0]['cid']].keys() if k not in ('updated_on','updated_by')]
done=0; fail=0
start=int(sys.argv[1]) if len(sys.argv)>1 else 0
for i,p in enumerate(plan):
    if i<start: continue
    cid=p['cid']; before=pre[cid]
    # ALL THREE TEXT FIELDS sent every time (playbook J normalisation #3)
    payload={'custom_expected':p['new_expected'],
             'custom_preconds':before['custom_preconds'],
             'custom_steps':before['custom_steps']}
    code,resp=tr.post(f'update_case/{cid}',payload)
    if code!=200:
        print('FAIL',cid,code,str(resp)[:200]); fail+=1
        LOG.write(json.dumps({'op':'update_case','cid':cid,'http':code,'verify':'NOT ATTEMPTED','error':str(resp)[:400]})+'\n'); LOG.flush()
        break
    after=tr.get(f'get_case/{cid}')
    # byte-verify EVERY field
    mism=[]
    for k in CMP:
        want = payload[k] if k in payload else before.get(k)
        got  = after.get(k)
        if k=='refs': want,got=norm_refs(want),norm_refs(got)
        if json.dumps(want,sort_keys=True)!=json.dumps(got,sort_keys=True):
            mism.append({'field':k,'intended':repr(want)[:400],'stored':repr(got)[:400]})
    ok = not mism
    LOG.write(json.dumps({'op':'update_case','cid':cid,'http':code,
        'fields_compared':len(CMP),'verify':'MATCH' if ok else 'MISMATCH',
        'new_check':p['new_check'],'marker':p['marker'],'mismatches':mism})+'\n'); LOG.flush()
    if not ok:
        print('BYTE MISMATCH — STOPPING at index',i,'case',cid)
        print(json.dumps(mism,indent=1)[:2000]); fail+=1; break
    done+=1
    if done%25==0: print(' ...',done,'verified')
print('DONE ops',done,'failures',fail)
