import json,sys,time
sys.path.insert(0,'/tmp/rswrite')
from tr import call
targets=json.load(open('targets.json'))
out={}; log=[]
for i,cid in enumerate(targets):
    s,d=call('get_case/'+cid[1:])
    if s!=200 or not isinstance(d,dict):
        log.append((cid,s,'FETCH-FAIL',str(d)[:120])); continue
    out[cid]=d
    log.append((cid,s,'OK',d.get('custom_atmstatus')))
    if i%50==0: print(i,flush=True)
json.dump(out,open('cases_fresh.json','w'))
with open('gate0.log','w') as f:
    for r in log: f.write('get_case · %s · HTTP %s · %s · atmstatus=%s\n'%r)
auto=[c for c,d in out.items() if d.get('custom_atmstatus')==3]
from collections import Counter
print('fetched',len(out),'of',len(targets))
print('atmstatus dist',Counter([d.get('custom_atmstatus') for d in out.values()]))
print('AUTOMATED(3):',sorted(auto,key=lambda x:int(x[1:])))
json.dump(sorted(auto,key=lambda x:int(x[1:])),open('automated.json','w'))
