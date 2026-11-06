import sys,csv; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, font, RED, GRN, BLU, BLK
from PIL import Image, ImageDraw
a=panel('ev/prod-contacts-tab.png',crop=(20,70,1600,400),title='1. Customers > ZZAUTOTEST SV12234 Contacts 47637 > Contacts tab: 3 contacts',
  boxes=[(521,89,598,113,GRN,1,'below'),(335,252,1570,390,GRN,2)],
  notes=[(1,GRN,'The Contacts tab reads "Contacts (3)".'),(2,GRN,'Ben Second, Anna First and Cara Third all belong to this customer.')])
b=panel('ev/prod-export-dialog.png',crop=(20,60,1600,800),title='2. Reports > Export Reports (left menu, under Accounting): Customer Contact, Today',
  boxes=[(44,736,170,760,BLU,1),(521,396,1079,436,BLU,2),(521,452,1079,492,BLU,3),(1007,516,1079,552,BLU,4,'right')],
  notes=[(1,BLU,'Click "Export Reports" in the left menu.'),(2,BLU,'Report Name: Customer Contact.'),(3,BLU,'Date Range: Today (the day the customer was made).'),(4,BLU,'Click Export. A file called customer_contact.csv downloads.')])
rows=[r for r in csv.reader(open('ev/prod-customer_contact-today.csv',encoding='utf-8-sig'))]
h=rows[0]; body=[r for r in rows[1:] if 'SV12234' in r[1]]; cols=[0,1,3,14]; W=[300,560,520,220]; S=2; rh=40*S
im=Image.new('RGB',((sum(W)+40)*S,(len(body)+1)*rh+230*S),'white'); d=ImageDraw.Draw(im)
d.rectangle([0,0,im.width,60*S],fill=(244,246,250)); d.text((20*S,16*S),'3. Inside customer_contact.csv: only ONE row for this customer',font=font(22*S,True),fill=BLK)
y=80*S; x=20*S
for i,c in enumerate(cols): d.text((x+8*S,y+10*S),h[c],font=font(17*S,True),fill=BLK); x+=W[i]*S
for j,r in enumerate(body):
    x=20*S; yy=y+(j+1)*rh
    for i,c in enumerate(cols): d.text((x+8*S,yy+10*S),r[c],font=font(17*S),fill=BLK); x+=W[i]*S
d.rectangle([14*S,y+rh-4*S,im.width-14*S,y+(len(body)+1)*rh+4*S],outline=RED,width=4*S)
yy=y+(len(body)+1)*rh+20*S
for t in ['Only Ben Second is in the file. Anna First and Cara Third are missing.','Same in bigger exports: This Month = 128 rows for 128 customers, Last Month = 447 rows for 447 customers - never more than one contact per customer.']:
    d.text((20*S,yy),t,font=font(18*S,True),fill=RED); yy+=34*S
stack([a,b,im]).save('ev/jira/01-contact-export-one-per-customer.png'); print(Image.open('ev/jira/01-contact-export-one-per-customer.png').size)
