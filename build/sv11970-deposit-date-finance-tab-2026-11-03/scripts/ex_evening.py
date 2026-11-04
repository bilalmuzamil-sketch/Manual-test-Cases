# Evening case (the ticket's own report): location behind UTC, evening, local date 3 Nov while UTC is already 4 Nov.
# Before = production v26.45.0-8e138e1, S-1916 (Toronto). After = branch sv11970 v26.43.3-551fa20, S11970-17586 (Edmonton). /usr/bin/python3.
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda n,b=False: ImageFont.truetype(FB if b else F,n); RED=(200,40,40); GRN=(30,130,60); GRY=(70,70,70)
def panel(path,crop,boxes):
    im=Image.open(path).convert('RGB'); dr=ImageDraw.Draw(im)
    for (x1,y1,x2,y2),c in boxes: dr.rectangle((x1-10,y1-8,x2+10,y2+8),outline=c,width=7)
    return im.crop(crop)
b=panel('ev/prod-before-evening/3-finance-after.png',(1560,470,2460,1700),[((2088,523,2422,554),GRN),((1634,1572,2219,1603),RED)])
a=panel('ev/branch-EV1-invoiced/6-finance-deposit-line.png',(1770,700,2460,1300),[((1784,1170,2200,1212),GRN)])
H=900; b=b.resize((int(b.width*H/b.height),H)); a=a.resize((int(a.width*620/a.height),620))
W=b.width+a.width+60; out=Image.new('RGB',(max(W,1700),H+340),'white'); dr=ImageDraw.Draw(out)
dr.rectangle((20,10,20+b.width,80),fill=RED); dr.text((32,18),'BEFORE: production (v26.45.0-8e138e1)',font=f(22,True),fill='white'); dr.text((32,50),'Deposit dated Nov 3 shows as Nov 4',font=f(20),fill='white')
x2=40+b.width; dr.rectangle((x2,10,x2+a.width,80),fill=GRN); dr.text((x2+12,18),'AFTER: QA branch (v26.43.3-551fa20)',font=f(22,True),fill='white'); dr.text((x2+12,50),'Deposit dated Nov 3 shows as Nov 3',font=f(20),fill='white')
out.paste(b,(20,90)); out.paste(a,(x2,90))
L=[('Red box: the deposit line showing the wrong day. Green boxes: the right day.',GRY,True),
 ('Both: work order > Finance tab > Add Deposit, Deposit Date left at its default 11/03/2026, Record Deposit, in the evening.',GRY,False),
 ('BEFORE: location on Toronto time, 7:29 PM on 3 Nov (UTC already 4 Nov). Work order S-1916, DEP-5039.',GRY,False),
 ('AFTER: location on Edmonton time, 5:33 PM on 3 Nov (UTC already 4 Nov). Work order S11970-17586, DEP-4709, then invoiced.',GRY,False),
 ('Both customers\' Deposits tabs list the deposit as "Today" (3 Nov).',GRY,False)]
for i,(t,c,bo) in enumerate(L): dr.text((20,H+110+i*38),t,font=f(20,bo),fill=c)
out.save('ev/before-after-evening.png'); print(out.size)
