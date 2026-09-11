import pymupdf, sys
n=sys.argv[1]; pg=int(sys.argv[2]) if len(sys.argv)>2 else 0
d=pymupdf.open(n+'.pdf'); p=d[pg]
out=[]
for dr in p.get_drawings():
    r=dr['rect']
    out.append((round(r.y0,1), round(r.x0,1), round(r.x1,1), round(r.y1,1), round(r.height,2), round(r.width,2),
                dr['type'], '#%02x%02x%02x'%tuple(int(c*255) for c in (dr.get('fill') or dr.get('color') or (0,0,0)))))
out.sort()
for o in out:
    print(f"y={o[0]:7.1f}..{o[3]:7.1f} h={o[4]:6.2f}  x={o[1]:6.1f}..{o[2]:6.1f} w={o[5]:6.2f} {o[6]} {o[7]}")
print('total', len(out))
