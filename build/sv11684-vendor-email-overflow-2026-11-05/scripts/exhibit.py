# usage: python3.12 exhibit.py -> SV-11116 Jira exhibits in ../ev/
from PIL import Image, ImageDraw, ImageFont
F=lambda n,b=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),n)
RED=(204,0,0); GRN=(0,140,60); ORG=(220,110,0); GRY=(70,70,70); EV='../ev/'
def panel(path,crop,boxes,title,tcol,sub,s=2):
    im=Image.open(EV+path).convert('RGB'); x0,y0,x1,y1=crop; c=im.crop((x0*s,y0*s,x1*s,y1*s))
    k=2/s if s!=2 else 1
    if s!=2: c=c.resize((int(c.width*2/s),int(c.height*2/s)),Image.LANCZOS)
    d=ImageDraw.Draw(c)
    for (bx0,by0,bx1,by1),col,lab,pos in boxes:
        r=((bx0-x0)*2,(by0-y0)*2,(bx1-x0)*2,(by1-y0)*2); d.rectangle(r,outline=col,width=6)
        if lab:
            f=F(26,True); w=d.textlength(lab,font=f)
            tx={'r':c.width-w-24}.get(pos, max(4,min(r[0],c.width-w-20))); ty=r[3]+10 if pos in('b','r') else r[1]-48
            d.rectangle((tx-6,ty-4,tx+w+8,ty+36),fill=(255,255,255),outline=col,width=3); d.text((tx,ty),lab,font=f,fill=col)
    head=Image.new('RGB',(c.width,110),(255,255,255)); hd=ImageDraw.Draw(head); hd.text((20,12),title,font=F(30,True),fill=tcol); hd.text((20,62),sub,font=F(23),fill=GRY)
    o=Image.new('RGB',(c.width,c.height+110),(255,255,255)); o.paste(head,(0,0)); o.paste(c,(0,110)); return o
def row(panels,caption,fn,stack=False):
    if stack:
        W=max(p.width for p in panels)+60; H=sum(p.height for p in panels)+30*(len(panels)+1)+44*len(caption)+20; o=Image.new('RGB',(W,H),(240,240,240)); y=30
        for p in panels: o.paste(p,(30,y)); y+=p.height+30
    else:
        W=sum(p.width for p in panels)+30*(len(panels)+1); H=max(p.height for p in panels)+60+44*len(caption); o=Image.new('RGB',(W,H),(240,240,240)); x=30
        for p in panels: o.paste(p,(x,30)); x+=p.width+30
        y=max(p.height for p in panels)+45
    d=ImageDraw.Draw(o)
    for t in caption: d.text((30,y),t,font=F(28),fill=GRY); y+=44
    o.save(EV+fn); print(fn,o.size)

PROD='app.shopview.com  build v26.45.1-753355c  5 Nov 2026'; BR='QA branch sv11684  build v26.45.1-5bdeeb6  5 Nov 2026'
row([panel('PV2-1440.png',(20,60,640,260),[((40,150,500,205),RED,'Email runs past the card edge',1),((255,70,262,255),RED,'',0)],'BEFORE - PRODUCTION (1440 wide)',RED,PROD),
     panel('V2-1440-1-hover.png',(20,60,640,260),[((40,152,340,182),GRN,'Stays inside the card',0),((26,188,354,246),GRN,'',0)],'AFTER - QA BRANCH (1440 wide)',GRN,BR)],
    ['Vendor ZZAUTOTEST SV11684 long email > Contacts. Production: the email spills past the vendor card.','QA branch: it stays inside the card, shortened with "...", and the full address shows on hover.'],'before-after-vendor-email.png')
row([panel('V2-1440-0.png',(20,60,640,260),[((40,152,340,182),RED,'Cut off with "..." - not wrapped',1)],'QA BRANCH, desktop 1440 wide',RED,BR),
     panel('V2-phone-1-tap.png',(0,90,390,230),[((24,148,366,175),RED,'Tap shows nothing; rest of email hidden',1)],'QA BRANCH, phone, after a tap',RED,'iPhone 12 Pro preset, 390 x 844, touch',s=3)],
    ['Same vendor. The address is cut short instead of wrapping onto a second line.','On a phone there is no hover, and tapping the address does not show the rest, so it cannot be read in full.'],'branch-email-cut-off.png')
