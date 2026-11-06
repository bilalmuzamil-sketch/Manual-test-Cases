# usage: python3.12 exhibit.py -> ../ev/exh-1-before-after.png (Profile menu > location chip, 1536x936 at pixel ratio 1.25, options held back 1.5 s)
import json, textwrap
from PIL import Image, ImageDraw, ImageFont
EV='../ev/'; F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def font(s,b=False): return ImageFont.truetype(FB if b else F,s)
RED=(220,30,30); GRN=(20,140,60); K=1.25; X0,Y0,X1,Y1=1080,0,1920,720
def panel(tag,color,title,note):
    im=Image.open(EV+tag+'-2-chip.png').convert('RGB'); j=json.load(open(EV+tag+'.json')); d=ImageDraw.Draw(im)
    c=j['chip']; d.rectangle((c['x']*K-6,c['y']*K+8,(c['x']+c['width'])*K+6,(c['y']+c['height'])*K+6),outline=color,width=5)
    m=[x for x in j['menus'] if 'limit-select' in x['cls']][0]
    if m['vis']=='visible': d.rectangle((m['x']*K-5,m['y']*K-5,(m['x']+m['w'])*K+5,(m['y']+m['h'])*K+5),outline=color,width=6)
    else:
        bx=(c['x']*K-20,(c['y']+c['height'])*K+20,1895,(c['y']+c['height'])*K+260); d.rectangle(bx,outline=color,width=6)
        d.rectangle((bx[0]+8,bx[1]+60,bx[2]-8,bx[1]+170),fill=(255,240,240)); d.text((bx[0]+22,bx[1]+72),'Nothing opens here',font=font(24,True),fill=color); d.text((bx[0]+22,bx[1]+116),'The list is hidden at the bottom',font=font(18),fill=color); d.text((bx[0]+22,bx[1]+142),'of the page (y = 936).',font=font(18),fill=color)
    im=im.crop((X0,Y0,X1,Y1)); h=Image.new('RGB',(im.width,64),color); ImageDraw.Draw(h).text((14,16),title,font=font(25,True),fill='white')
    out=Image.new('RGB',(im.width,im.height+64+90),'white'); out.paste(h,(0,0)); out.paste(im,(0,64)); dd=ImageDraw.Draw(out)
    for i,l in enumerate(textwrap.wrap(note,62)): dd.text((14,im.height+74+28*i),l,font=font(21),fill=(30,30,30))
    return out
B=panel('prod2-qat-r1500',RED,'BEFORE - production v26.45.1-753355c','Location QA Testing chosen, page reloaded, chip clicked: no list on screen. The list exists with all 8 locations but has no position and stays hidden.')
A=panel('m3-1.25-DVITest-r1500',GRN,'AFTER - QA branch sv11839 v26.45.0-5d54a3f','Location DVI Test chosen, page reloaded, chip clicked: the list opens under the chip with all 4 locations.')
W=B.width+A.width+30; out=Image.new('RGB',(W,max(B.height,A.height)),'white'); out.paste(B,(0,0)); out.paste(A,(B.width+30,0))
cap='Chrome window 1536 x 936 at pixel ratio 1.25 (125% display scaling). Profile menu > Change Location chip, same condition on both builds: the location list is made to finish drawing 1.5 s late, which is what a slower machine does (comparison only, done in the test browser, not a ShopView feature).'
f=font(22); lines=textwrap.wrap(cap,int(W/12.5)); out2=Image.new('RGB',(W,out.height+30*len(lines)+20),'white'); out2.paste(out,(0,0)); d=ImageDraw.Draw(out2)
for i,l in enumerate(lines): d.text((14,out.height+10+30*i),l,font=f,fill=(30,30,30))
out2.save(EV+'exh-1-before-after.png'); print(out2.size)
