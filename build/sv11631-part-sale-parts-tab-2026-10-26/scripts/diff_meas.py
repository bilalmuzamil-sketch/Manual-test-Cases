import json,sys
def summ(m):
    out={}
    for w,d in m.items():
        pn=lambda r:next((c['text'] for c in r['cells'] if c['cls'].startswith('part-number')),'?')
        clip=sorted(f"{pn(r).strip()}:{c['cls'].split('-cell')[0]}={c['text'][:26]!r}" for r in d['rows'] for c in r['cells'] if c.get('clip'))
        th={h['t']:round(h['b'][2]) for h in d['ths'] if h['t']}
        out[w]=(f"table {d['sb']['sw']}/{d['sb']['cw']}",th,clip)
    return out
o,n=summ(json.load(open(sys.argv[1]))),summ(json.load(open(sys.argv[2])))
for w in n:
    print(f'== {w}  OLD {o[w][0]}  NEW {n[w][0]}')
    print('  col widths changed:',{k:(o[w][1].get(k),v) for k,v in n[w][1].items() if o[w][1].get(k)!=v})
    print('  clipped only OLD:',sorted(set(o[w][2])-set(n[w][2])))
    print('  clipped only NEW:',sorted(set(n[w][2])-set(o[w][2])))
    print('  clipped in both :',sorted(set(n[w][2])&set(o[w][2])))
