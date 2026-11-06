import json,sys
env=sys.argv[1]; a=json.load(open(f'../ev/{env}-api.json'))
def lvl(it,q):
    q=q.lower(); pn=(it.get('part_number') or '').lower(); nm=(it.get('name') or it.get('description') or '').lower()
    if pn==q: return 1
    if pn.startswith(q) or nm.startswith(q): return 2
    if q in pn: return 3
    return 4
for q,v in a.items():
    c=v['data']['collection'] if isinstance(v.get('data'),dict) else v['data']
    if not q: print('EMPTY',len(c),[ (x.get('part_type'),x.get('part_number')) for x in c[:6]]); continue
    L=[lvl(x,q) for x in c]; mono=all(L[i]<=L[i+1] for i in range(len(L)-1))
    types=[x.get('part_type') for x in c]
    print(f'{q!r}: n={len(c)} levels={ {k:L.count(k) for k in sorted(set(L))} } monotonic={mono} first={(c[0].get("part_type"),c[0].get("part_number"),c[0].get("name")) if c else None}')
    if not mono:
        bad=[(i,L[i],L[i+1],c[i].get('part_number'),c[i+1].get('part_number')) for i in range(len(L)-1) if L[i]>L[i+1]][:5]; print('  breaks',bad)
    print('  types',{t:types.count(t) for t in set(types)})
