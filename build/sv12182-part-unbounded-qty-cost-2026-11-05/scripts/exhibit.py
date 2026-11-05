# usage: python3.12 exhibit.py -> SV-11116 Jira exhibits in ../ev/
from PIL import Image, ImageDraw, ImageFont
F=lambda n,b=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),n)
RED=(204,0,0); GRN=(0,140,60); ORG=(220,110,0); GRY=(70,70,70); EV='../ev/'
def panel(path,crop,boxes,title,tcol,sub,s=2):
    im=Image.open(EV+path).convert('RGB'); x0,y0,x1,y1=crop; c=im.crop((x0*s,y0*s,x1*s,y1*s))
    if s==1: c=c.resize((c.width*2,c.height*2),Image.LANCZOS)
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
PROD='Production app.shopview.com  build v26.45.1-753355c  5 Nov 2026'; BR='QA branch sv12182  build v26.45.2-ef57078  5 Nov 2026'
row([panel('P-cost-1-typed.png',(500,372,1104,445),[((521,388,696,428),ORG,'',0)],'BEFORE - PRODUCTION: 1. Average Cost typed as 99,999,999,999',ORG,PROD),
     panel('PR-dialog.png',(500,372,1104,445),[((521,388,696,428),RED,'',0),((712,388,888,428),RED,'',0)],'BEFORE - PRODUCTION: 2. Saved with no message, reopened',RED,'Part A158: cost became 21,474,836.47, sell 214,748,364.70'),
     panel('G-cost-2-after-save.png',(500,400,1500,900),[((521,412,696,452),GRN,'',0),((1100,770,1500,824),GRN,'Clear message, nothing saved',1)],'AFTER - QA BRANCH: same cost typed, Save',GRN,BR)],
    ['Parts > Inventory > Edit Inventory Part. Production saves an impossible cost without a word and quietly stores a different number.','The QA branch refuses it and says why: "Cost cannot exceed 21,474,836.47."'],'before-after-cost.png',stack=True)
row([panel('PR-list.png',(250,180,1600,236),[((1214,196,1316,222),RED,'',0)],'BEFORE - PRODUCTION: Quantity typed as 012345678901234567, saved with no message',RED,PROD+'  -  part A158 now shows 100000096.99 Available'),
     panel('G-qty-2-after-save.png',(500,600,1500,900),[((804,624,890,664),GRN,'',0),((1100,661,1500,890),GRN,'',0)],'AFTER - QA BRANCH: same quantity typed, Save',GRN,BR)],
    ['Production accepted the pasted number and the part now has about 100 million in stock.','The QA branch refuses it: "Quantity must be between -99,999,999.99 and 99,999,999.99." and the same for the bin quantity.'],'before-after-quantity.png',stack=True)
