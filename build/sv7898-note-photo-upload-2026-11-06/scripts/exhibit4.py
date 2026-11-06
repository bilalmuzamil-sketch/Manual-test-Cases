# SV-7898 retest exhibit: BEFORE (a5c66b3, from exh-3 right panel) vs AFTER (aa4c767): offline Save message, then back online Save creates the note with the photo
import json, textwrap
from PIL import Image, ImageDraw, ImageFont
EV='../ev/'; F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
fo=lambda s,b=False: ImageFont.truetype(FB if b else F,s)
W=560; DPR=3; G=(30,150,70); RD=(214,40,40)
def panel(png,boxes,title,cap,col):
    im=Image.open(EV+png).convert('RGB').crop((0,0,1170,1110*3//3*3 if False else 3330//1)) if False else Image.open(EV+png).convert('RGB')
    im=im.crop((0,0,1170,1110*3//3*1))  # top 370 css px? keep full
    im=Image.open(EV+png).convert('RGB'); k=W/im.width; im=im.resize((W,int(im.height*k)),Image.LANCZOS); d=ImageDraw.Draw(im)
    for i,(x,y,w,h) in enumerate(boxes,1):
        x0,y0,x1,y1=x*DPR*k-4,y*DPR*k-4,(x+w)*DPR*k+4,(y+h)*DPR*k+4; d.rectangle([x0,y0,x1,y1],outline=col,width=5)
        cx,cy=max(18,x0-2),max(18,y0-2); d.ellipse([cx-17,cy-17,cx+17,cy+17],fill=col); d.text((cx,cy),str(i),font=fo(20,True),fill='white',anchor='mm')
    head=Image.new('RGB',(W,56),col); ImageDraw.Draw(head).text((14,28),title,font=fo(21,True),fill='white',anchor='lm')
    lines=[]; [lines.extend(textwrap.wrap(p,46) or ['']) for p in cap.split('\n')]
    c=Image.new('RGB',(W,24+len(lines)*27),'white'); cd=ImageDraw.Draw(c); [cd.text((14,12+i*27),l,font=fo(19),fill=(20,20,20)) for i,l in enumerate(lines)]
    o=Image.new('RGB',(W,head.height+im.height+c.height),'white'); o.paste(head,(0,0)); o.paste(im,(0,56)); o.paste(c,(0,56+im.height)); return o
old=Image.open(EV+'exh-3-newnote-offline-fail.png').convert('RGB'); before=old.crop((600,100,1161,1241))
r=json.load(open(EV+'R1-newnote-offline-offline-save+3s.json'))
toast=[m['box'] for m in r['msgs'] if 'wasn' in m['t']][0]; pend=r['pending'][0]['box']; save=r['save']['box']
a=panel('R1-newnote-offline-offline-save+3s.png',[pend,toast],'QA branch aa4c767 - offline, Save',"1 Photo and text stay in the window\n2 \"Your note wasn't saved. Check your connection, then tap Save.\" Nothing was sent.",G)
b=panel('R1-newnote-offline-reload.png',[],'Back online, tap Save again',"The note is created with the photo (server: 1 note, attachment image.jpg). Shown after a reload.",G)
ph=max(before.height,a.height,b.height); w=before.width+a.width+b.width+80
top="New Note window: photo attached, phone goes offline, tap Save. Left: the previous build (my comment of 5 Nov 23:15). Middle and right: today's build."
tl=textwrap.wrap(top,120); th=20+len(tl)*30
o=Image.new('RGB',(w,ph+40+th),(235,237,240)); d=ImageDraw.Draw(o); [d.text((20,14+i*30),l,font=fo(23,True),fill=(20,20,20)) for i,l in enumerate(tl)]
x=20
for p in [before,a,b]: o.paste(p,(x,th+20)); x+=p.width+20
o.save(EV+'exh-4-newnote-offline-fixed.png'); print(o.size)
