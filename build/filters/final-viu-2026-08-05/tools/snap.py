import json, sys
sys.path.insert(0,'/tmp/fv')
from tr import paged
from collections import Counter
secs = paged('get_sections/1&suite_id=1','sections')
json.dump(secs, open('/tmp/fv/sections.json','w'))
by_id={s['id']:s for s in secs}
def anc(s):
    out=[]; cur=s
    while cur: out.append(cur['id']); cur=by_id.get(cur.get('parent_id'))
    return out
filt=[s for s in secs if 4110 in anc(s)]
print('sections total', len(secs), '| filters subtree', len(filt))
json.dump(filt, open('/tmp/fv/sections-4110.json','w'), indent=1)
ids={s['id'] for s in filt}
cases = paged('get_cases/1&suite_id=1','cases')
ours=[c for c in cases if c['section_id'] in ids]
print('cases in suite', len(cases), '| under 4110', len(ours))
json.dump(ours, open('/tmp/fv/cases-PRE.json','w'), indent=1)
print('created_by', dict(Counter(c['created_by'] for c in ours)))
for s in sorted(filt,key=lambda x:x['id']):
    n=sum(1 for c in ours if c['section_id']==s['id'])
    print(f"  {s['id']:5d} p={str(s.get('parent_id')):>5s} n={n:3d}  {s['name']}")
