# Before/after exhibit for SV-12405: production try 4 (two preview requests at once) vs sv12405 try 4 (one).
from PIL import Image, ImageDraw, ImageFont
import os
os.chdir(os.path.join(os.path.dirname(__file__),'..','ev'))
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda s,b=False: ImageFont.truetype(FB if b else F,s)
RED=(214,40,40); GRN=(20,140,60); BLUE=(30,90,200)
panels=[
 ('BEFORE - production app.shopview.com (v26.45.3-fc08f23), S2-918, 10 Nov 2026','prod-try4.png',[(183.31,183.68),(183.41,183.81)],RED,
  'After Reverse: the preview was asked for TWICE at the same moment (try 4 of 10; 2 of 10 tries did this)'),
 ('AFTER - QA branch sv12405 (fix), S2-15597, 10 Nov 2026','branch2-try4.png',[(183.66,183.97)],GRN,
  'After Reverse: the preview was asked for ONCE (every one of 20 tries)'),
]
W=1600; out=[]
for title,fn,reqs,col,cap in panels:
    im=Image.open(fn).convert('RGB').resize((W,900)); d=ImageDraw.Draw(im); s=W/1200
    # 1 status badge, 2 preview paper
    d.rectangle([140*s,72*s,205*s,98*s],outline=BLUE,width=5); d.text((210*s,74*s),'1',fill=BLUE,font=f(30,True))
    d.rectangle([406*s,146*s,1010*s,672*s],outline=col,width=6); d.text((1016*s,150*s),'2',fill=col,font=f(34,True))
    # timeline strip
    H=300; can=Image.new('RGB',(W,90+900+H),'white'); can.paste(im,(0,90)); c=ImageDraw.Draw(can)
    c.rectangle([0,0,W,90],fill=(245,245,245)); c.text((20,24),title,fill=(0,0,0),font=f(30,True))
    y0=90+900+20; t0=min(a for a,b in reqs)-0.2; span=1.0; x0,x1=260,W-60
    X=lambda t: x0+(t-t0)/span*(x1-x0)
    c.text((20,y0),'Preview requests sent after Reverse (from the browser network log):',fill=(0,0,0),font=f(26,True))
    for i,(a,b) in enumerate(reqs):
        y=y0+55+i*60; c.text((20,y+6),f'Request {i+1}',fill=(0,0,0),font=f(26))
        c.rectangle([X(a),y,X(b),y+40],fill=col); c.text((X(b)+12,y+6),f'{b-a:.2f} s',fill=(60,60,60),font=f(24))
    ya=y0+55+2*60+10; c.line([x0,ya,x1,ya],fill=(120,120,120),width=2)
    for k in range(6):
        t=t0+k*0.2; c.line([X(t),ya,X(t),ya+10],fill=(120,120,120),width=2); c.text((X(t)-30,ya+14),f'+{k*0.2:.1f} s',fill=(90,90,90),font=f(20))
    c.text((20,y0+H-62),cap,fill=col,font=f(26,True))
    out.append(can)
gap=40; tot=Image.new('RGB',(W,sum(o.height for o in out)+gap+220),'white'); y=0
for o in out: tot.paste(o,(0,y)); y+=o.height+gap
d=ImageDraw.Draw(tot)
for i,l in enumerate(['1 = work order status back to Complete after Reverse.',
 '2 = the invoice preview. It looks the same on both builds; the difference is how often it is requested.',
 'Comparison only: the request bars come from the browser\'s developer tools (Network tab), not from a ShopView screen.',
 'Steps both sides: Finance tab > Create Invoice > reload with the payment window open > three dots > Reverse > Reverse.']):
    d.text((20,y+10+i*48),l,fill=(30,30,30),font=f(24))
tot.save('exhibit/before-after-reverse-preview.png')
print(tot.size)
