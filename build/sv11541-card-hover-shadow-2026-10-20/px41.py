import json,sys
from PIL import Image
d=json.load(open(sys.argv[1])); S=2
for c in d['cells']:
    if 'err' in c: print(c['label'],'ERR'); continue
    r=Image.open(f"ex41/{c['label']}-rest.png").convert('L'); h=Image.open(f"ex41/{c['label']}-hover.png").convert('L')
    cl=c['clip']; R=c['rest']; ox=(R['x']-cl['x'])*S; oy=(R['y']-cl['y'])*S; W=R['w']*S; H=R['h']*S
    def band(xs,ys):
        tot=0;n=0;mx=0
        for x in xs:
            for y in ys:
                dv=r.getpixel((x,y))-h.getpixel((x,y)); tot+=dv;n+=1;mx=max(mx,dv)
        return round(tot/n,2),mx
    ymid=range(int(oy+H*0.3),int(oy+H*0.8))
    L=band(range(int(ox-8),int(ox-2)),ymid); Rr=band(range(int(ox+W+2),int(ox+W+8)),ymid)
    B=band(range(int(ox+W*0.2),int(ox+W*0.8)),range(int(oy+H+2),int(oy+H+10)))
    print(f"{c['label']:42s} {c['n']:9s} left avg/max {L}  right {Rr}  bottom {B}")
