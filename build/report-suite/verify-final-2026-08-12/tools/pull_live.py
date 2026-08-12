import json,sys,time
sys.path.insert(0,'.')
from tr import call
# group 4281 = Reports Suite. Pull all cases in project 1 / suite 1 under that subtree.
secs={}
off=0
while True:
    st,b=call(f'get_sections/1&suite_id=1&limit=250&offset={off}')
    assert st==200,(st,b)
    for s in b['sections']: secs[s['id']]=s
    if not b.get('_links',{}).get('next'): break
    off+=250
print('sections total:',len(secs))
# build subtree of 4281
def children(root):
    out={root}
    changed=True
    while changed:
        changed=False
        for sid,s in secs.items():
            if s.get('parent_id') in out and sid not in out:
                out.add(sid); changed=True
    return out
sub=children(4281)
print('subtree sections under 4281:',len(sub))
cases=[]; off=0
while True:
    st,b=call(f'get_cases/1&suite_id=1&limit=250&offset={off}')
    assert st==200,(st,b)
    cases+=b['cases']
    if not b.get('_links',{}).get('next'): break
    off+=250
rs=[c for c in cases if c['section_id'] in sub]
print('cases under 4281:',len(rs))
from collections import Counter
print('created_by:',Counter(c['created_by'] for c in rs))
json.dump({'sections':{str(k):v for k,v in secs.items() if k in sub},'cases':rs},open('/tmp/rs812/live_now.json','w'))
