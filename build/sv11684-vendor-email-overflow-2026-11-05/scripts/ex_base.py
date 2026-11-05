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
PROD='app.shopview.com  build v26.45.1-753355c  5 Nov 2026'; BR='QA branch sv11116  build v26.45.0-fd56729  5 Nov 2026'
row([panel('PR3-prod-row.png',(880,190,1600,300),[((1470,240,1524,266),RED,'Full tax $29.99, no credit share',1)],'BEFORE - PRODUCTION: S2-1933 after a $100 credit',RED,PROD),
     panel('T1-branch-row.png',(880,622,1600,800),[((1472,672,1550,698),GRN,'',0),((1386,704,1600,783),GRN,'',0)],'AFTER - QA BRANCH: S11116-17580 after a $100 credit',GRN,BR)],
    ['Reports > Sales Tax Collected, this month. Both invoices are taxed at 5%','and had a $100 goodwill credit applied. Production still reports the full tax.','The QA branch reports $44.95 ($49.71 - $4.76); the info icon explains it.'],'before-after-sales-tax.png',stack=True)
row([panel('T1-finance.png',(900,460,1320,690),[((980,478,1302,512),GRN,'',0),((980,608,1082,633),GRN,'Credit row shows its tax share',1)],'QA BRANCH: invoice, Finance tab',GRN,'sv11116  v26.45.0-fd56729  S11116-17580')],
    ['Invoice GST (5%) $49.71 is unchanged.','The applied credit row reads "incl. GST $4.76".'],'branch-invoice-doc.png')
row([panel('fail-1-click-on.png',(1250,640,1600,800),[((1521,672,1547,698),ORG,'',0)],'1. Click the icon: tooltip opens',ORG,BR),
     panel('fail-2-click-away.png',(1250,640,1600,800),[((1521,672,1547,698),RED,'Gone as soon as the mouse moves away',1)],'2. Move the mouse away',RED,'Expected: it stays open until a 2nd click')],
    ['Sales Tax Collected, row S11116-17580. After a click the tooltip should stay open;','it closes the moment the pointer leaves the icon.'],'branch-click-fail.png')
row([panel('fail-3-tab.png',(1250,640,1600,800),[((1521,672,1547,698),ORG,'',0)],'1. Tab onto the icon: it opens',ORG,BR),
     panel('fail-4-tab-enter.png',(1250,640,1600,800),[((1521,672,1547,698),RED,'Enter closes it',1)],'2. Press Enter (or Space)',RED,'Expected: Enter / Space opens it')],
    ['Same row, keyboard only. Tab already shows the tooltip,','and pressing Enter or Space then hides it.'],'branch-keyboard-fail.png')
row([panel('MR1-rep-1-collapsed.png',(1100,150,1600,300),[((1436,192,1468,222),RED,'Multi-rate: icon BEFORE amount',0),((1508,240,1548,268),GRN,'Single-rate: icon AFTER amount',1)],'Multi-rate row (GST + PST), collapsed',RED,'sv11116  v26.45.0-fd56729  S11116-17592')],
    ['Collapsed GST + PST row: the icon sits in front of $108.59.','Single-rate rows and the expanded Total line: after the amount.'],'branch-multirate-icon.png')
