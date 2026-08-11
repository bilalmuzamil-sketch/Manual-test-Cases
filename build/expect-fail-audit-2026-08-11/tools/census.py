import re, json
from scope import group, unmarkup
MARK=re.compile(r'^AUTOMATION:\s*(.+)$',re.M)
def markers(c):
    t=unmarkup(c.get('custom_expected') or '')
    return [m.group(0).strip() for m in MARK.finditer(t)]
def kind(m):
    u=m.upper()
    if 'EXPECT FAIL' in u: return 'EXPECT-FAIL'
    if 'HOLD' in u: return 'HOLD'
    if 'READY' in u: return 'READY'
    return 'OTHER'
out={}
for r,n in ((4110,'Filters'),(4254,'Schedule')):
    g=[c for c in group(r) if c['created_by']==3]
    rows=[]
    from collections import Counter
    k=Counter()
    for c in g:
        ms=markers(c)
        kk=[kind(m) for m in ms]
        if len(ms)==1: k[kk[0]]+=1
        elif len(ms)==0: k['NONE']+=1
        else: k['MULTI(%d)'%len(ms)]+=1
        rows.append({'id':c['id'],'title':c['title'],'markers':ms,'kinds':kk,'section':c['section_id']})
    out[n]=rows
    print(f"--- {n}: {len(g)} ours ---")
    for kk,v in sorted(k.items()): print(f"   {kk:14s} {v}")
    ef=[r_ for r_ in rows if 'EXPECT-FAIL' in r_['kinds']]
    print(f"   EXPECT-FAIL cases: {len(ef)}")
json.dump(out,open('census.json','w'),indent=1)
