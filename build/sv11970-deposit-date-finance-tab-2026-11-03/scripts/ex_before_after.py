# Before (production v26.45.0-8e138e1, S-1907) vs after (branch sv11970 v26.43.3-551fa20, S11970-17581). Both: location on Pacific/Kiritimati,
# deposit recorded on screen with the default Deposit Date (4 Nov local) while UTC was still 3 Nov. Run with /usr/bin/python3 from the ticket folder.
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda n,b=False: ImageFont.truetype(FB if b else F,n); RED=(200,40,40); GRN=(30,130,60); GRY=(70,70,70)
def panel(path,crop,boxes):
    im=Image.open(path).convert('RGB'); dr=ImageDraw.Draw(im)
    for (x1,y1,x2,y2),c in boxes: dr.rectangle((x1-10,y1-8,x2+10,y2+8),outline=c,width=7)
    return im.crop(crop)
b=panel('ev/prod-before/3-finance-after.png',(1560,470,2460,1700),[((2088,523,2422,554),GRN),((1634,1572,2219,1601),RED)])
a=panel('ev/branch-K1/6-finance-deposit-line.png',(1762,640,2440,1320),[((1784,1226,2300,1272),GRN)])
H=900; b=b.resize((int(b.width*H/b.height),H)); a=a.resize((int(a.width*H/a.height),H))
W=b.width+a.width+60; out=Image.new('RGB',(W,H+330),'white'); dr=ImageDraw.Draw(out)
dr.rectangle((20,10,20+b.width,80),fill=RED); dr.text((32,18),'BEFORE: production (build v26.45.0-8e138e1)',font=f(24,True),fill='white'); dr.text((32,50),'Deposit dated Nov 4 shows as Nov 3',font=f(20),fill='white')
x2=40+b.width; dr.rectangle((x2,10,x2+a.width,80),fill=GRN); dr.text((x2+12,18),'AFTER: QA branch sv11970 (v26.43.3-551fa20)',font=f(24,True),fill='white'); dr.text((x2+12,50),'Deposit dated Nov 4 shows as Nov 4',font=f(20),fill='white')
out.paste(b,(20,90)); out.paste(a,(x2,90))
L=[('Red box: the deposit line showing the wrong day. Green box: the right day.',GRY,True),
 ('Same set-up on both: Work Orders > work order > Finance tab > Add Deposit, Deposit Date left at its default 11/04/2026, Record Deposit.',GRY,False),
 ('The location was set to the Pacific/Kiritimati time zone (UTC+14), so the local date (4 Nov) was a day ahead of UTC (3 Nov).',GRY,False),
 ('BEFORE: work order S-1907, DEP-5038, 3 Nov 2026 12:35 UTC. AFTER: work order S11970-17581, DEP-4704, 3 Nov 2026 13:03 UTC.',GRY,False),
 ('Both customers\' Deposits tabs list the deposit as "Today" (4 Nov).',GRY,False)]
for i,(t,c,bo) in enumerate(L): dr.text((20,H+110+i*38),t,font=f(20,bo),fill=c)
out.save('ev/before-after-finance-deposit-date.png'); print(out.size)
