#!/usr/bin/env python3
import json,sys,os
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import tr
out=sys.argv[1]; os.makedirs(out,exist_ok=True)
GROUP=4281
secs=tr.paged('get_sections/1&suite_id=1','sections')
json.dump(secs,open(f'{out}/sections-all.json','w'))
# descendants of 4281
byid={s['id']:s for s in secs}
def anc(s):
    p=s.get('parent_id'); 
    while p:
        if p==GROUP: return True
        p=byid.get(p,{}).get('parent_id')
    return False
ours={s['id'] for s in secs if s['id']==GROUP or anc(s)}
cases=tr.paged('get_cases/1&suite_id=1','cases')
grp=[c for c in cases if c['section_id'] in ours]
json.dump(grp,open(f'{out}/cases-4281.json','w'),indent=0)
json.dump(sorted(ours),open(f'{out}/section-ids-4281.json','w'))
print("sections total",len(secs),"under 4281",len(ours),"cases under 4281",len(grp))
from collections import Counter
print("created_by:",Counter(c['created_by'] for c in grp))
s,run=tr.api('get_run/359'); json.dump(run,open(f'{out}/run359-run.json','w'),indent=1)
print("run359 http",s,"include_all",run.get('include_all'),"untested",run.get('untested_count'))
tests=tr.paged('get_tests/359','tests'); json.dump(tests,open(f'{out}/run359-tests.json','w'),indent=0)
res=tr.paged('get_results_for_run/359','results'); json.dump(res,open(f'{out}/run359-results.json','w'),indent=0)
print("tests",len(tests),"results",len(res))
