import pymupdf, sys
n=sys.argv[1]; pg=int(sys.argv[2]) if len(sys.argv)>2 else 0
d=pymupdf.open(n+'.pdf'); p=d[pg]
rows=[]
for b in p.get_text('dict')['blocks']:
    if b['type']!=0: continue
    for l in b['lines']:
        for s in l['spans']:
            rows.append((round(s['bbox'][1],1), round(s['bbox'][0],1), round(s['bbox'][2],1), round(s['size'],2), s['font'], '#%06x'%s['color'], s['text']))
rows.sort()
for r in rows:
    print(f"y={r[0]:7.1f} x={r[1]:6.1f}..{r[2]:6.1f} sz={r[3]:5.2f} {r[4]:22s} {r[5]} | {r[6]}")
