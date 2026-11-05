from PIL import Image, ImageDraw, ImageFont
F=lambda n,b=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),n)
RED=(204,0,0); GRN=(0,140,60); ORG=(220,110,0); GRY=(70,70,70)
EV='../ev/'
COSTA=(928,387,1048,452); SELLA=(1048,387,1168,452); COSTB=(928,452,1048,517); SELLB=(1048,452,1168,517)
def panel(path,crop,boxes,title,tcol,sub):
    im=Image.open(EV+path).convert('RGB'); s=2; x0,y0,x1,y1=crop; c=im.crop((x0*s,y0*s,x1*s,y1*s)); d=ImageDraw.Draw(c)
    for (bx0,by0,bx1,by1),col,lab in boxes:
        r=((bx0-x0)*s,(by0-y0)*s,(bx1-x0)*s,(by1-y0)*s); d.rectangle(r,outline=col,width=6)
        if lab:
            f=F(26,True); w=d.textlength(lab,font=f); tx=max(4,min(r[0],c.width-w-20)); ty=r[1]-46 if r[1]>60 else r[3]+8
            d.rectangle((tx-6,ty-4,tx+w+8,ty+36),fill=(255,255,255),outline=col,width=3); d.text((tx,ty),lab,font=f,fill=col)
    head=Image.new('RGB',(c.width,110),(255,255,255)); hd=ImageDraw.Draw(head); hd.text((20,12),title,font=F(34,True),fill=tcol); hd.text((20,62),sub,font=F(26),fill=GRY)
    o=Image.new('RGB',(c.width,c.height+110),(255,255,255)); o.paste(head,(0,0)); o.paste(c,(0,110)); return o
def row(panels,caption,fn):
    W=sum(p.width for p in panels)+30*(len(panels)+1); H=max(p.height for p in panels)+60+44*len(caption); o=Image.new('RGB',(W,H),(240,240,240)); x=30
    for p in panels: o.paste(p,(x,30)); x+=p.width+30
    y=max(p.height for p in panels)+45; d=ImageDraw.Draw(o)
    for t in caption: d.text((30,y),t,font=F(28),fill=GRY); y+=44
    o.save(EV+fn); print(fn,o.size)
CR=(420,300,1560,530)
row([panel('before-after/prod-receive.png',CR,[(COSTA,RED,'Cost is plain text - cannot be changed')],'BEFORE - PRODUCTION',RED,'app.shopview.com  build v26.45.1-753355c  5 Nov 2026'),
     panel('before-after/branch-receive.png',CR,[(COSTA,GRN,'Cost is a field: changed 40 -> 80'),(SELLA,GRN,'')],'AFTER - QA BRANCH sv11006',GRN,'build v26.45.2-b7be383  5 Nov 2026')],
    ['Parts > Purchase Orders > Receive on a purchase order for an OPEN work order. Part A cost $40, sell $90.','After the fix the cost can be changed while receiving; Sell follows at once ($80 -> $180).'],'before-after-po-receive.png')
row([panel('branch-rc-e10inv/1-before.png',CR,[(COSTA,ORG,'Locked: $40.00000'),(COSTB,GRN,'Empty cost can be filled')],'INVOICED work order S11006-17613',ORG,'QA branch sv11006  build v26.45.2-b7be383'),
     panel('branch-rc-e11paid/1-before.png',CR,[(COSTA,ORG,'Locked: $40.00000'),(COSTB,GRN,'Empty cost can be filled')],'PAID work order S11006-17614',ORG,'QA branch sv11006  build v26.45.2-b7be383')],
    ['PO receive screen when the part\'s work order is invoiced (left) or paid (right): the filled cost is read-only text, an empty cost can still be entered.'],'branch-invoiced-paid-locked.png')
row([panel('branch-rc-d6split/1-before.png',CR,[(COSTA,ORG,'Part moved to invoiced WO S11006-17602: locked'),(COSTB,GRN,'Still editable')],'SPLIT LINE - original PO S11006-17601 (work order still Approved)',ORG,'QA branch sv11006  build v26.45.2-b7be383')],
    ['Part A was split onto new work order S11006-17602, which was then invoiced. On the original PO its cost is read-only, though the PO\'s own work order is still open.'],'branch-split-locked.png')
row([panel('branch-stale-d7/3-error.png',(420,300,1560,900),[(COSTA,ORG,'Reloaded: cost locked'),((1100,772,1500,888),RED,'')],'STALE TAB - PO S11006-17603',RED,'Receive screen open, work order invoiced elsewhere, then cost changed and Receive pressed')],
    ['Receiving is refused with "The cost of part ... can\'t be changed because its work order is invoiced or paid. Reload the page and try again."','The page reloads with the cost locked at $40.00000. Nothing was received; the stored cost stayed 40 / 90.'],'branch-stale-tab.png')
