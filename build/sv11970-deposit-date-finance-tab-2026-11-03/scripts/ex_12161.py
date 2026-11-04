# SV-12161 retest on staging v26.45.0-f417d48, DVI Test on Toronto time, 11:23 PM 3 Nov. /usr/bin/python3.
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda n,b=False: ImageFont.truetype(FB if b else F,n); GRN=(30,130,60); AMB=(210,120,0); GRY=(60,60,60)
im=Image.open('ev/stg12161-retest-cash-nov1/5-customer-deposits.png').convert('RGB').crop((560,380,2880,1560)); dr=ImageDraw.Draw(im)
def row(y,c,label):
    dr.rectangle((40,y-44-380,2280,y+44-380),outline=c,width=7); 
for y,c in [(542,GRN),(1022,GRN),(926,AMB)]: row(y,c,'')
out=Image.new('RGB',(im.width,im.height+330),'white'); out.paste(im,(0,0)); d=ImageDraw.Draw(out)
L=[('Green: deposits recorded now, by the ticket\'s steps, both saved on the right day.',GRN,True),
 ('DEP-4831: Deposit Date left on today (Nov 3), Cash $5.00, recorded 11:22 PM Toronto  ->  "Today".',GRY,False),
 ('DEP-4832: Deposit Date 11/01/2026, Cash $5.00, recorded 11:23 PM Toronto  ->  "2 days ago" (Nov 1).',GRY,False),
 ('Orange: DEP-4823, the ticket\'s example from 7:16 PM, still reads "Yesterday": it was saved a day early then.',AMB,True),
 ('Staging, build v26.45.0-f417d48, DVI Test on Toronto time, customer ZZAUTOTEST P2C DEP, work order S1-38222, 3 Nov 2026.',GRY,False)]
for i,(t,c,b) in enumerate(L): d.text((30,im.height+30+i*56),t,font=f(30,b),fill=c)
out.save('ev/sv12161-retest-deposits-tab.png'); print(out.size)
