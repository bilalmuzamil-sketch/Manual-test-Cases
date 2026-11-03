import json,sys
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda n,b=False: ImageFont.truetype(FB if b else F,n)
GRN=(30,130,60); GRY=(90,90,90); S=2
def crop(tag,row,cap,sub):
    d=json.load(open(f'ev/{tag}.json')); h=[x for x in d['hover'] if x['row']==row][0]
    ex,ey,ew,eh=h['elB']; boxes=[h['elB']]+h['tipB']
    xs=[b[0] for b in boxes]+[b[0]+b[2] for b in boxes]; ys=[b[1] for b in boxes]+[b[1]+b[3] for b in boxes]
    vw=d.get('vw') or int(tag.split('-')[1])
    x0=max(0,min(xs)-120); x1=min(vw,max(xs)+120); y0=max(0,min(ys)-50); y1=max(ys)+40
    im=Image.open(f'ev/{tag}-hover-row{row}.png').convert('RGB').crop((x0*S,y0*S,x1*S,y1*S))
    out=Image.new('RGB',(max(im.width,1280),im.height+110),'white'); out.paste(im,(0,0)); dr=ImageDraw.Draw(out)
    for b in boxes: x,y,w,hh=b; dr.rectangle(((x-x0)*S-5,(y-y0)*S-5,(x-x0+w)*S+5,(y-y0+hh)*S+5),outline=GRN,width=5)
    dr.text((10,im.height+14),cap,font=f(22,True),fill=GRN); dr.text((10,im.height+50),sub,font=f(19),fill=GRY)
    return out
def stack(parts,path,title):
    W=max(p.width for p in parts); H=sum(p.height for p in parts)+30*len(parts)+70
    out=Image.new('RGB',(W,H),'white'); dr=ImageDraw.Draw(out); dr.rectangle((0,0,W,56),fill=GRN); dr.text((14,12),title,font=f(24,True),fill='white')
    y=70
    for p in parts: out.paste(p,(0,y)); y+=p.height+30; dr.line((0,y-15,W,y-15),fill=(200,200,200),width=2)
    out.save(path); print(path,out.size)
B='QA branch sv11904, build v26.43.5-2999cf9, 3 Nov 2026'
stack([crop('branch-1440',0,'1. Percent fee next to a +1 badge: full name "Such a Long name testing"',f'P2-162 row 1 (Ignition Switch), 1440 wide. 5% and +1 stay visible. {B}'),
       crop('branch-1440',1,'2. Discount: full name "ZZAUTOTEST Part Discount with a long name"',f'P2-162 row 2 (Freight), 1440 wide. {B}'),
       crop('branch-1440',2,'3. Fixed-amount fee: full name "ZZAUTOTEST Flat fee with a long name"',f'P2-162 row 3 (Engine Oil Filter), 1440 wide. +$5.00 stays visible. {B}'),
       crop('branch-1440',7,'4. A name that fits ("Fee"): no tooltip, as expected',f'P2-162 row 8 (Pilot Filter), 1440 wide. Rates and badges show no tooltip either. {B}')],
      'ev/every-kind-of-name-1440.png','Hover on every kind of fee or discount name - green boxes: where you point, and what appears')
stack([crop('branch-1024',1,'1024 wide: full name on hover',f'P2-162 row 2. Heading on one line, 39 px. {B}'),
       crop('branch-768',2,'768 wide: full name on hover',f'P2-162 row 3. Heading on one line, 39 px; Actions stays pinned. Build v26.43.5-2999cf9, 3 Nov 2026'),
       crop('branch-1440-dark',0,'Dark mode (1440 wide): tooltip readable',f'P2-162 row 1. Heading on one line, 39 px. {B}')],
      'ev/other-widths-and-dark.png','The same at 1024 and 768 wide, and in dark mode')
