# SV-12039 before/after: New Part Request with an inventory part whose part number holds a line break. /usr/bin/python3
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda n,b=False: ImageFont.truetype(FB if b else F,n); RED=(200,40,40); GRN=(30,130,60); GRY=(60,60,60)
C=(800,220,2080,1600)
def panel(path,boxes,title,col):
    im=Image.open(path).convert('RGB').crop(C); d=ImageDraw.Draw(im)
    for b,c in boxes: d.rectangle(b,outline=c,width=8)
    out=Image.new('RGB',(im.width,im.height+80),'white'); dd=ImageDraw.Draw(out); dd.rectangle((0,0,im.width,70),fill=col); dd.text((16,14),title,font=f(36,True),fill='white'); out.paste(im,(0,80)); return out
SRC=(70,395,1210,490); TBL=(70,860,1210,1085)
p1=panel('ev/p-nl-mid/3-picked-inventory.png',[(SRC,GRN),(TBL,GRN)],'1. Pick the Inventory option',(110,110,110))
p2=panel('ev/p-nl-mid/4-clicked-amount.png',[((70,520,1210,620),RED),((645,408,1210,508),RED)],'2. Click into Amount: Vendor',RED)
p3=panel('ev/b-final-request/5-typed-amount.png',[(SRC,GRN),(TBL,GRN)],'Click into Amount, type 1: Inventory',GRN)
s=0.62; P=[x.resize((int(x.width*s),int(x.height*s))) for x in (p1,p2,p3)]
W=sum(x.width for x in P)+100; H=P[0].height; out=Image.new('RGB',(W,H+150+330),'white'); d=ImageDraw.Draw(out)
d.rectangle((20,10,40+P[0].width+P[1].width,90),fill=RED); d.text((34,18),'BEFORE: production (v26.45.0-8e138e1)',font=f(32,True),fill='white'); d.text((34,56),'Source flips to Vendor the moment you click into Amount',font=f(26),fill='white')
x3=80+P[0].width+P[1].width; d.rectangle((x3,10,x3+P[2].width,90),fill=GRN); d.text((x3+14,18),'AFTER: QA branch',font=f(32,True),fill='white'); d.text((x3+14,56),'(v26.45.0-9b141c4)  stays on Inventory',font=f(26),fill='white')
out.paste(P[0],(20,110)); out.paste(P[1],(40+P[0].width,110)); out.paste(P[2],(x3,110))
L=[('Work order > line (right-click) > Request part > Part Number: type "ZZ12039 LAMP - HEADLIGHT" > pick the "Inventory Qty: 1 ea" option.',GRY,False),
 ('The part number of this inventory part contains a line break (like the customer\'s part). 1 in stock.',GRY,False),
 ('Before: clicking into Amount turns Source to Vendor, the Inventory bin table disappears and an empty Quantity box appears;',RED,False),
 ('Save & Close then says "Quantity is a required field". After: Source stays Inventory; saved as In Stock; Pick takes it from stock (1 to 0).',GRN,False),
 ('Production work order S2-1917 (Trucks Hill 2). Branch work order S12039-17582 (Heavy Duty). 4 Nov 2026.',GRY,False)]
for i,(t,c,b) in enumerate(L): d.text((20,H+130+i*46),t,font=f(26,b),fill=c)
out.save('ev/before-after-request-part.png'); print(out.size)
