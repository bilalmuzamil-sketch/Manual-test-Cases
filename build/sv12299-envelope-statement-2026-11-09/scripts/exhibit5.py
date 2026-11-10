import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, font, RED, GRN, BLU
from PIL import Image, ImageDraw
E='/home/user/Manual-test-Cases/build/sv12299-envelope-statement-2026-11-09/ev/'
R=E+'rewalk-2026-11-10/'; F=E+'followups/'; O=E+'exhibits/'
# Ticket 1, picture 1: same icon + same tooltip, two different documents
a=panel(F+'C-01-wo-envelope-hover.png',(1000,70,1600,180),'Work order > Finance tab',
  [(1255,83,1300,126,GRN,1),(1232,136,1322,171,GRN,1)],[(1,GRN,'Envelope icon, tooltip "Send Email" ... opens "Sending invoice" and emails the INVOICE.')])
b=panel(R+'B-07-dialog.png',(400,60,1200,120),'',[(420,75,565,100,GRN,2)],[(2,GRN,'Window title: "Sending invoice".')])
c=panel(R+'A-05-hover-envelope.png',(880,130,1580,240),'Customers > customer > Invoices tab',
  [(1172,142,1217,185,RED,3),(1150,195,1240,230,RED,3)],[(3,RED,'The SAME envelope icon and the SAME tooltip "Send Email" ... but this one emails a STATEMENT.')])
d=panel(R+'A-06-dialog.png',(400,90,1200,140),'',[(420,100,600,130,RED,4)],[(4,RED,'Window title: "Sending statement". Nothing on the button itself says statement.')])
stack([a,b,c,d]).save(O+'12-same-envelope-two-documents.png')
# Ticket 1, picture 2: one invoice ticked, statement still has every open invoice
e=panel(F+'C-02-one-ticked.png',(330,140,1580,385),'Customers > Invoices tab: only S2-1945 ticked',
  [(340,306,370,336,RED,1),(335,355,1460,382,RED,2),(1172,142,1217,185,BLU,3)],
  [(1,RED,'Only invoice S2-1945 is ticked.'),(2,RED,'"Totals selected $149.95" suggests only that invoice will be used.'),(3,BLU,'Then the envelope is clicked and Send Email pressed.')])
f=panel(F+'C-statement-hi-1.png',(60,40,880,530),'What the customer receives: a statement of ALL open invoices',
  [(75,352,833,428,RED,4),(625,230,832,267,RED,5)],[(4,RED,'Both invoices are listed, not just the ticked one.'),(5,RED,'Total due $299.90, not the $149.95 that was selected.')])
stack([e,f]).save(O+'13-ticked-invoice-ignored.png')
# Ticket 3: what the user sees vs what goes out
g=panel(R+'B-05-for-customer-ticked.png',(300,80,1580,400),'Work order S2-1944 > Notes tab: a statement PDF saved with "For Customer" ticked',
  [(335,286,585,388,RED,1)],[(1,RED,'File "ZZAUTOTEST SV12299 Charge Account Statement.pdf" marked For Customer.')])
h=panel(R+'B-08-include-ticked.png',(400,45,1200,280),'Finance tab > envelope > "Sending invoice"',
  [(428,136,720,162,RED,2),(420,165,1120,200,RED,3)],[(2,RED,'"Include \'For Customer\' Attachments in email" ticked.'),(3,RED,'No list of which files will be attached - the statement is not mentioned anywhere.')])
stack([g,h]).save(O+'14-for-customer-files-not-listed.png')
# Ticket 2: the stray "<" - rendered from the verbatim email source lines
W,H=2000,520; im=Image.new('RGB',(W,H),'white'); dr=ImageDraw.Draw(im); fm=font(30); fb=font(34,True)
dr.text((30,20),'Invoice email for S2-1944 (received 10 Nov 2026, 07:58 UTC): lines copied from the email itself',font=fb,fill=(25,25,25))
lines=[('Email title:','<title>Invoice for the order number: S2-1944<</title>'),('Inbox preview text:','<span class="preheader">Invoice for the order number: S2-1944<</span>'),('What Gmail shows as the preview:','Invoice for the order number: S2-1944<  Hello, Please find your attached invoice ...')]
y=100
for lab,txt in lines:
    dr.text((30,y),lab,font=font(28,True),fill=(80,80,80)); dr.text((30,y+40),txt,font=fm,fill=(25,25,25))
    i=txt.index('S2-1944<')+len('S2-1944'); x=30+dr.textlength(txt[:i],font=fm); w=dr.textlength('<',font=fm)
    dr.rectangle((x-6,y+34,x+w+6,y+80),outline=RED,width=5); y+=130
dr.text((30,y-10),'The red box: a stray "<" after the work order number.',font=font(30,True),fill=RED)
im.save(O+'15-stray-lt-in-invoice-email.png')
