import sys,json; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, font, RED, GRN, BLK
from PIL import Image, ImageDraw
P={r['name']:r for r in json.load(open('ev/prod-r3-roles.json')) if 'name' in r}
S={r['name']:r for r in json.load(open('ev/staging-r3-roles.json')) if 'name' in r}
pb=P['WO list: Columns']['menu'][0]['box']; sb=S['WO list: Columns']['menu'][0]['box']
a=panel('ev/prod-r3-columns.png',(1000,75,1600,720),'BEFORE - production v26.45.2-198e632: Work Orders > Columns',[(*pb,RED,1)],
  [(1,RED,'Comparison only (read with the browser developer tools, not a ShopView feature): marked role="menu", no name. It is a panel of switches, not a list of commands.')])
b=panel('ev/staging-r3-columns.png',(1000,75,1600,720),'AFTER - staging v26.45.2-df7aeed, 6 Nov 2026: same Columns panel',[(*sb,GRN,1)],
  [(1,GRN,'Now marked role="dialog" with the name "Column Selection". Looks and works the same.')])
rows=[('Work Orders: Columns','WO list: Columns'),('Work Orders: Status filter','WO list: Status filter'),('Work Orders: Asset on Site filter','WO list chip: filter_chip_vehicleHere'),('Schedule: Filter & display','Schedule: Filter & display'),('Schedule: View options','Schedule: View options'),('Timesheet Activities: Date Range','Timesheet Activities: Date Range'),('Tech View: Density (a real menu)','Tech View: Density'),('Board: Card size (a real menu)','Board: Card size')]
def cell(d): m=(d.get('menu') or [{}])[0]; return f"{m.get('role')} / {m.get('label') or '(no name)'}"
Sc=2; W=[560,420,560]; rh=40*Sc; im=Image.new('RGB',((sum(W)+40)*Sc,(len(rows)+1)*rh+140*Sc),'white'); d=ImageDraw.Draw(im)
d.rectangle([0,0,im.width,60*Sc],fill=(244,246,250)); d.text((20*Sc,16*Sc),'All panels checked - role / name (comparison only, read with developer tools)',font=font(21*Sc,True),fill=BLK)
y=80*Sc; x=20*Sc
for i,h in enumerate(['Panel','Production (before)','Staging (after)']): d.text((x+8*Sc,y+8*Sc),h,font=font(17*Sc,True),fill=BLK); x+=W[i]*Sc
for j,(lab,key) in enumerate(rows):
    yy=y+(j+1)*rh; x=20*Sc
    for i,t in enumerate([lab,cell(P[key]),cell(S[key])]): d.text((x+8*Sc,yy+8*Sc),t,font=font(17*Sc,i==2),fill=(GRN if i==2 else BLK)); x+=W[i]*Sc
    d.line([20*Sc,yy,im.width-20*Sc,yy],fill=(220,224,230),width=Sc)
stack([a,b,im]).save('ev/jira/sv12214-r3-panels-before-after.png'); print('ok')
