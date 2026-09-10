import pymupdf, sys, collections
def hexc(c):
    if not c: return None
    return '#%02X%02X%02X'%tuple(round(x*255) for x in c[:3])
def edges(path):
    d=pymupdf.open(path); out=[]
    for pno,p in enumerate(d):
        for dr in p.get_drawings():
            res=[it[1] for it in dr['items'] if it[0]=='re']
            if len(res)!=2: continue
            a,b=res
            outer,inner=(a,b) if a.get_area()>=b.get_area() else (b,a)
            col=hexc(dr.get('fill') or dr.get('color'))
            for name,t in (('top',inner.y0-outer.y0),('bottom',outer.y1-inner.y1),
                           ('left',inner.x0-outer.x0),('right',outer.x1-inner.x1)):
                if t>0.05:
                    out.append(dict(page=pno,edge=name,thick=round(t,4),colour=col,
                                    x=round(outer.x0,1),y=round(outer.y0,1),
                                    w=round(outer.width,1),h=round(outer.height,1)))
    return d,out
for path in sys.argv[1:]:
    d,es=edges(path)
    print('=====',path,'| pages',len(d),'| border edges',len(es))
    c=collections.Counter((e['thick'],e['colour']) for e in es)
    for (t,col),n in sorted(c.items()):
        print(f'   {t:8.4f}pt  {col}  x{n}')
