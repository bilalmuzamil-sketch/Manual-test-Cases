import json
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda n,b=False: ImageFont.truetype(FB if b else F,n)
RED=(200,40,40); GRN=(30,130,60); GRY=(90,90,90)
def load(t):
    d=json.load(open(f'ev/dev/{t}.json')); s=d['states'][-1]; im=Image.open(f'ev/dev/{t}-6000ms.png').convert('RGB'); k=d['env']['dpr']; dr=ImageDraw.Draw(im)
    for b in s['dlgB']: x,y,w,h=b; dr.rectangle((x*k-6,y*k-6,(x+w)*k+6,(y+h)*k+6),outline=GRN,width=int(4*k))
    for b in s['tipB']: x,y,w,h=b; dr.rectangle((x*k-8,y*k-8,(x+w)*k+8,(y+h)*k+8),outline=RED,width=int(4*k))
    return d,s,im
d1,s1,i1=load('iPhone_12_Pro-quick'); d2,s2,i2=load('touch-laptop-1440-quick')
H=900; i1=i1.resize((int(i1.width*H/i1.height),H)); i2=i2.resize((int(i2.width*H/i2.height),H))
W=i1.width+i2.width+60; out=Image.new('RGB',(W,H+330),'white'); dr=ImageDraw.Draw(out)
dr.rectangle((20,10,20+i1.width,70),fill=GRN); dr.text((32,18),'Phone preset: not reproduced',font=f(22,True),fill='white'); dr.text((32,44),'iPhone 12 Pro preset, quick tap, after 6 s',font=f(16),fill='white')
x2=40+i1.width; dr.rectangle((x2,10,x2+i2.width,70),fill=RED); dr.text((x2+12,18),'Touchscreen laptop: reproduced',font=f(22,True),fill='white'); dr.text((x2+12,44),'Desktop Chrome 1440x900 with touch, quick tap, after 6 s',font=f(16),fill='white')
out.paste(i1,(20,80)); out.paste(i2,(x2,80))
lines=[('Green box: the Fees & Discounts viewer. Red box: the full-name tooltip that stays on screen.',GRY,True),
 ('Phone presets (iPhone 12 Pro, Pixel 7, iPhone SE): a quick tap opens the viewer with no tooltip; a press-and-hold shows the',GRN,False),
 ('tooltip while holding, and it is gone once the viewer opens.',GRN,False),
 ('Desktop browser with a touchscreen (1440 and 1024 wide): after a quick tap or a press-and-hold the tooltip stays on screen with',RED,False),
 ('the viewer open (still there after 6 s), until the next tap. At 1024 it sits over the viewer; at 1440 beside it.',RED,False),
 ('QA branch sv11904, build v26.43.5-2999cf9, 3 Nov 2026, Admin, part sale P2-162 row 1. Chrome device emulation, not a real device.',GRY,False)]
for i,(t,c,b) in enumerate(lines): dr.text((20,H+100+i*34),t,font=f(19,b),fill=c)
out.save('ev/phone-vs-touch-laptop.png'); print(out.size)
