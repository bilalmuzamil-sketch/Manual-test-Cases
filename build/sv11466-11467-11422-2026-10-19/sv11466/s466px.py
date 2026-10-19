import sys,json
from PIL import Image
def measure(png,jsn):
    j=json.load(open(jsn)); g=j['g']; im=Image.open(png).convert('RGB'); y=round(g['y']+g['h']-g['thickH']/2)
    xs=range(int(g['x']),int(g['x']+g['w']))
    row=[im.getpixel((x,y)) for x in xs]
    from collections import Counter
    track=Counter(row).most_common(1)[0][0]
    d=lambda c:sum(abs(a-b) for a,b in zip(c,track))
    best=(0,0);st=None
    for i,c in enumerate(row+[track]):
        if d(c)>30:
            if st is None: st=i
        elif st is not None:
            if i-st>best[1]-best[0]: best=(st,i)
            st=None
    x0,x1=best[0]+int(g['x']),best[1]+int(g['x']); mx=(x0+x1)//2
    rows=[]
    yy=int(g['y']+g['h'])-1
    while yy>g['y'] and d(im.getpixel((mx,yy)))>30: rows.append(yy); yy-=1
    return dict(file=png.split('/')[-1],track=track,thumb=im.getpixel((mx,y)),x0=x0,x1=x1,len=x1-x0,tall=len(rows),bar_rows=(rows[0],rows[-1]) if rows else None,
                expected_proportional=round(g['cw']*g['cw']/g['sw'],1), sw=g['sw'], cw=g['cw'], thick=g['thickH'])
for a in sys.argv[1:]:
    print(json.dumps(measure(a+'.png',a+'.json')))
