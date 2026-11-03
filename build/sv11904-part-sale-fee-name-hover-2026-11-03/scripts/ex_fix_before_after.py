# Before (build 2999cf9) vs after (build 51811b2): desktop Chrome with a touchscreen, 1024x768, quick tap, after 6 s.
# Run from the ticket folder. Old frames: ev/dev/, new frames: ev/dev2/.
import json, sys
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda n,b=False: ImageFont.truetype(FB if b else F,n)
RED=(200,40,40); GRN=(30,130,60); GRY=(90,90,90)
TAG=sys.argv[1] if len(sys.argv)>1 else 'touch-laptop-1024-quick'
NEWDLG=json.load(open(f'ev/dev2/{TAG}.json'))['states'][-1]['dlgB']  # old run did not record the viewer box; same viewport, same viewer position
def load(folder):
    d=json.load(open(f'{folder}/{TAG}.json')); s=d['states'][-1]; s.setdefault('dlgB',NEWDLG); s.setdefault('tipB',[[718,219,172,33]]);  # old 1024 run: tooltip box measured from the frame's pixels (grey 117,117,117, rows 440-501, cols 1436-1779 at dpr 2)
    im=Image.open(f'{folder}/{TAG}-6000ms.png').convert('RGB'); k=d['env']['dpr']; dr=ImageDraw.Draw(im)
    for b in s['dlgB']: x,y,w,h=b; dr.rectangle((x*k-6,y*k-6,(x+w)*k+6,(y+h)*k+6),outline=GRN,width=int(3*k))
    for b in s['tipB']: x,y,w,h=b; dr.rectangle((x*k-8,y*k-8,(x+w)*k+8,(y+h)*k+8),outline=RED,width=int(4*k))
    return d,s,im
d1,s1,i1=load('ev/dev'); d2,s2,i2=load('ev/dev2')
assert s1['tips'] and s1['viewer'], 'before frame should show the tooltip with the viewer open'
assert not s2['tips'] and s2['viewer'], 'after frame should show the viewer with no tooltip'
H=760; i1=i1.resize((int(i1.width*H/i1.height),H)); i2=i2.resize((int(i2.width*H/i2.height),H))
W=i1.width+i2.width+60; out=Image.new('RGB',(W,H+250),'white'); dr=ImageDraw.Draw(out)
dr.rectangle((20,10,20+i1.width,70),fill=RED); dr.text((32,18),'BEFORE: build v26.43.5-2999cf9',font=f(22,True),fill='white'); dr.text((32,44),'Tooltip stays on top of the viewer (still there after 6 s)',font=f(16),fill='white')
x2=40+i1.width; dr.rectangle((x2,10,x2+i2.width,70),fill=GRN); dr.text((x2+12,18),'AFTER: build v26.43.5-51811b2',font=f(22,True),fill='white'); dr.text((x2+12,44),'Viewer opens with every name in full, no tooltip',font=f(16),fill='white')
out.paste(i1,(20,80)); out.paste(i2,(x2,80))
lines=[('Red box: the grey full-name tooltip. Green box: the Fees & Discounts viewer.',GRY,True),
 ('Same set-up on both builds: Chrome 153 desktop window 1024 x 768 with a touchscreen (touchscreen laptop), quick tap (about 0.2 s)',GRY,False),
 ('on "Such A Lo..." in row 1 (Ignition Switch) of part sale P2-162, picture taken 6 seconds after the tap.',GRY,False),
 ('QA branch sv11904, 3 Nov 2026, Admin. Chrome emulation of a touchscreen laptop, not a real device.',GRY,False)]
for i,(t,c,b) in enumerate(lines): dr.text((20,H+100+i*32),t,font=f(18,b),fill=c)
out.save(f'ev/fix-before-after-{TAG}.png'); print(out.size)
