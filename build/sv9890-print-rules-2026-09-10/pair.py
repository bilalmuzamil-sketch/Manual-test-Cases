import pymupdf, sys, collections
def hexc(c):
    return None if not c else '#%02X%02X%02X'%tuple(round(x*255) for x in c[:3])
def edges(path):
    d=pymupdf.open(path); out=[]
    for pno,p in enumerate(d):
        for dr in p.get_drawings():
            res=[it[1] for it in dr['items'] if it[0]=='re']
            if len(res)!=2: continue
            a,b=res
            o,i=(a,b) if a.get_area()>=b.get_area() else (b,a)
            col=hexc(dr.get('fill') or dr.get('color'))
            for name,t in (('top',i.y0-o.y0),('bottom',o.y1-i.y1),('left',i.x0-o.x0),('right',o.x1-i.x1)):
                if t>0.05:
                    out.append((pno,name,round(o.x0,1),round(o.y0,0),round(o.width,1),col,round(t,4)))
    return out
A=edges(sys.argv[1]); B=edges(sys.argv[2])
print(f'{"pg":>2} {"edge":6} {"x":>6} {"y":>6} {"width":>6} {"colour":8} {"before":>8} {"after":>8}  change')
used=set(); rows=[]
for a in A:
    best=None
    for j,b in enumerate(B):
        if j in used: continue
        if b[0]==a[0] and b[1]==a[1] and b[5]==a[5] and abs(b[2]-a[2])<3 and abs(b[4]-a[4])<3 and abs(b[3]-a[3])<40:
            if best is None or abs(b[3]-a[3])<abs(B[best][3]-a[3]): best=j
    if best is None: rows.append((a,None)); continue
    used.add(best); rows.append((a,B[best]))
for a,b in rows:
    ch='' if b and b[6]==a[6] else ('THINNED' if b else 'NO MATCH')
    print(f'{a[0]:>2} {a[1]:6} {a[2]:>6} {a[3]:>6.0f} {a[4]:>6} {a[5]:8} {a[6]:>8.4f} {(b[6] if b else float("nan")):>8.4f}  {ch}')
print('\nunmatched on the AFTER side:',[b for j,b in enumerate(B) if j not in used])
