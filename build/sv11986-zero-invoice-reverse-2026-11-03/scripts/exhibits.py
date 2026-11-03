# /usr/bin/python3 scripts/exhibits.py  -> ev/before-after-reverse.png, ev/branch-steps.png
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda n,b=False: ImageFont.truetype(FB if b else F,n); RED=(200,40,40); GRN=(30,130,60); GRY=(70,70,70); BLU=(25,90,200)
def panel(path,crop,boxes):
    im=Image.open(path).convert('RGB'); d=ImageDraw.Draw(im)
    for (x1,y1,x2,y2),c in boxes: d.rectangle((x1-10,y1-8,x2+10,y2+8),outline=c,width=7)
    return im.crop(crop)
def banner(dr,x,w,c,t1,t2): dr.rectangle((x,10,x+w,80),fill=c); dr.text((x+12,18),t1,font=f(24,True),fill='white'); dr.text((x+12,50),t2,font=f(20),fill='white')
def notes(dr,y,L):
    for i,(t,b) in enumerate(L): dr.text((20,y+i*36),t,font=f(20,b),fill=GRY)
# 1. before vs after: Finance tab, $0 invoice, AFTER its $0 payment was deleted, Reverse clicked
H=760; b=panel('ev/p-zero-flow/09-D-reverse-after-click.png',(0,144,2059,1109),[((390,209,477,245),RED),((881,886,1673,919),RED)])
a=panel('ev/b-zero1-flow/09-D-reverse-after-click.png',(0,144,2059,1109),[((82,271,210,307),GRN),((881,886,1832,919),GRN),((1529,972,1754,1043),GRN)])
b=b.resize((int(b.width*H/b.height),H)); a=a.resize((int(a.width*H/a.height),H))
W=b.width+a.width+60; out=Image.new('RGB',(W,H+300),'white'); dr=ImageDraw.Draw(out)
banner(dr,20,b.width,RED,'BEFORE: production (build v26.45.0-8e138e1)','$0 payment deleted - invoice still Paid, Reverse refused')
x2=40+b.width; banner(dr,x2,a.width,GRN,'AFTER: QA branch sv11986 (v26.45.0-279650f)','$0 payment deleted - invoice back to Invoiced, Reverse offered')
out.paste(b,(20,90)); out.paste(a,(x2,90))
notes(dr,H+110,[('Both: a $0.00 invoice (marked Paid), its $0.00 payment deleted on Customer > Payments, then Finance tab > invoice menu (⋮) > Reverse.',True),
 ('BEFORE: work order S1-1910 still shows Paid and the warning "This invoice has been paid, please delete payment before reversing." although no payment is left.',False),
 ('AFTER: work order S11986-17581 shows Invoiced and the normal question "This action will re-open and undo the invoice." with a Reverse button.',False),
 ('3 Nov 2026, admin user on each environment.',False)])
out.save('ev/before-after-reverse.png'); print('1',out.size)
# 2. branch steps for S11986-17581
p1=panel('ev/b-zero1-flow/04-B-payments-before.png',(600,400,2830,620),[((2762,530,2788,559),RED),((2440,520,2600,566),BLU)])
p2=panel('ev/b-zero1-flow/07-C-customer-invoices.png',(600,400,2830,620),[((2595,527,2712,566),GRN)])
p3=panel('ev/b-zero1-flow/11-D-reverse-result.png',(0,150,2880,460),[((82,269,226,307),GRN),((2590,170,2821,248),GRN)])
Wd=1700; ims=[x.resize((Wd,int(x.height*Wd/x.width))) for x in (p1,p2,p3)]
caps=['1. Customer > Payments: the $0.00 "Payment for invoice ..." row (Paid). Click the red bin (red box), then Reverse in the dialog.',
      '2. Customer > Invoices: invoice S11986-17581 now shows Unpaid ($0.00); the work order badge reads Invoiced.',
      '3. After Finance tab > ⋮ > Reverse > Reverse: work order back to Complete, Create Invoice available again.']
Ht=sum(i.height+70 for i in ims)+120; out=Image.new('RGB',(Wd+40,Ht),'white'); dr=ImageDraw.Draw(out); y=10
dr.rectangle((20,y,20+Wd,y+60),fill=GRN); dr.text((32,y+16),'QA branch sv11986 (v26.45.0-279650f) - work order S11986-17581, 4 Star Truck Repair, 3 Nov 2026',font=f(22,True),fill='white'); y+=80
for im,c in zip(ims,caps): dr.text((20,y),c,font=f(19,True),fill=GRY); y+=34; out.paste(im,(20,y)); y+=im.height+30
out.save('ev/branch-steps.png'); print('2',out.size)
