# usage: python3.12 exhibit.py -> builds the SV-12048 Jira exhibits in ../ev/
from PIL import Image, ImageDraw, ImageFont
F=lambda n,b=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),n)
RED=(204,0,0); GRN=(0,140,60); ORG=(220,110,0); GRY=(70,70,70); EV='../ev/'
def panel(path,crop,boxes,title,tcol,sub,s=2):
    im=Image.open(EV+path).convert('RGB'); x0,y0,x1,y1=crop; c=im.crop((x0*s,y0*s,x1*s,y1*s))
    if s==1: c=c.resize((c.width*2,c.height*2),Image.LANCZOS)
    k=2; d=ImageDraw.Draw(c)
    for (bx0,by0,bx1,by1),col,lab,below in boxes:
        r=((bx0-x0)*k,(by0-y0)*k,(bx1-x0)*k,(by1-y0)*k); d.rectangle(r,outline=col,width=6)
        if lab:
            f=F(26,True); w=d.textlength(lab,font=f); tx=(c.width-w-24) if below==2 else max(4,min(r[0],c.width-w-20)); ty=r[3]+10 if below==1 else r[1]-48
            d.rectangle((tx-6,ty-4,tx+w+8,ty+36),fill=(255,255,255),outline=col,width=3); d.text((tx,ty),lab,font=f,fill=col)
    head=Image.new('RGB',(c.width,110),(255,255,255)); hd=ImageDraw.Draw(head); hd.text((20,12),title,font=F(32,True),fill=tcol); hd.text((20,62),sub,font=F(24),fill=GRY)
    o=Image.new('RGB',(c.width,c.height+110),(255,255,255)); o.paste(head,(0,0)); o.paste(c,(0,110)); return o
def row(panels,caption,fn):
    W=sum(p.width for p in panels)+30*(len(panels)+1); H=max(p.height for p in panels)+60+44*len(caption); o=Image.new('RGB',(W,H),(240,240,240)); x=30
    for p in panels: o.paste(p,(x,30)); x+=p.width+30
    y=max(p.height for p in panels)+45; d=ImageDraw.Draw(o)
    for t in caption: d.text((30,y),t,font=F(28),fill=GRY); y+=44
    o.save(EV+fn); print(fn,o.size)
PROD='app.shopview.com  build v26.45.1-753355c  5 Nov 2026'; BR='QA branch sv12048  build v26.45.0-747429d  5 Nov 2026'
# 1 before/after
row([panel('PB-prod-lines.png',(360,170,1160,580),[((1060,195,1140,226),RED,'',0),((1060,362,1140,391),RED,'',0),((1060,530,1140,559),RED,'Line 3 approved after booking',1)],'BEFORE - PRODUCTION: work order S2-1931',RED,PROD),
     panel('PB-prod-final-0.png',(940,130,1390,640),[((1085,486,1374,517),RED,'Shift still shows 2 lines',2)],'BEFORE - PRODUCTION: its shift',RED,'Schedule > Fri 6 Nov > block'),
     panel('B-final-0.png',(605,115,1050,650),[((748,389,1037,420),GRN,'4 lines: 2 booked + 2 approved later',2),((623,424,1033,640),GRN,'',0)],'AFTER - QA BRANCH: work order S12048-17582',GRN,BR)],
    ['Production: the work order was booked as "Entire work order" with 2 lines, then a 3rd line was approved. The shift still lists only 2 lines.',
     'QA branch: booked the same way with 2 lines; lines 3 and 4 were approved later and both joined the shift (Shift details: "4 lines · Est. 8h").'],'before-after-shift-lines.png')
# 2 A from the Schedule cell
row([panel('A-newwo-dialog.png',(480,280,1120,620),[((980,538,1075,575),GRN,'Save',0)],'1. Empty spot on a lane > New Work Order',GRN,BR,s=1),
     panel('A1-nolines-1.png',(682,238,1136,664),[((700,465,1115,517),GRN,'0 lines right after Save',1)],'2. Block opened: no lines yet',GRN,'S12048-17601, Marissa Armstrong, Fri 6 Nov',s=1),
     panel('L1-final-1.png',(683,115,1130,650),[((828,389,1117,420),GRN,'Lines approved later joined',2),((703,424,1113,640),GRN,'',0)],'3. After approving lines on the Lines tab',GRN,'2 approved one by one, 2 with "Approve (2)"')],
    ['A work order created from the Schedule cell starts with no lines on its shift. Every line approved afterwards joins it, including 2 approved together with the bulk "Approve (2)" button.'],'branch-new-wo-from-schedule.png')
# 3 L decline/delete
row([panel('L1-final-0.png',(733,105,1180,700),[((1056,511,1163,539),GRN,'Was 3 lines, now 2',2),((751,545,1161,600),GRN,'Declined line stays on the shift',1)],'Decline one line, delete another',GRN,'sv12048  v26.45.0-747429d  S12048-17600')],
    ['Line 1 declined (right-click > Decline):','it stays on the shift as "Auth Declined".','Line 2 deleted (right-click > Delete line):','it left the shift, 3 lines became 2.'],'branch-decline-delete.png')
# 4 failure: series undo
row([panel('JX-week-before.png',(300,115,1000,870),[((529,737,824,820),ORG,'One booking over Mon 9 + Tue 10',1)],'BEFORE DELETE',ORG,BR+'  (S12048-17602)'),
     panel('JX-week-after-undo.png',(300,115,1000,870),[((529,737,678,820),RED,'',0),((683,737,824,820),RED,'Tue 10 not restored',1)],'AFTER "Entire series" + Undo',RED,'Schedule > Week view, John Ortiz')],
    ['The 2-day booking was deleted with "Entire series" and then Undo was clicked in the toast. Only Monday came back; Tuesday is gone.'],'branch-series-undo-fail.png')
