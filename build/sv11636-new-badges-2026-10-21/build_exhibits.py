"""SV-11636 exhibits — annotated before/after pictures (Standing Rules 64/73). Run from this folder: PYTHONPATH=../testing-tools python3 build_exhibits.py"""
from ticket_exhibit import panel, stack, RED, GRN, BLU
from PIL import Image
S='ev/src/'
def pill_bbox(path, y_max_css=45):
    """bounding box (CSS px) of the light-blue pill background in the top strip, found from the pixels"""
    im=Image.open(path).convert('RGB'); xs=[];ys=[]
    for y in range(0,int(y_max_css*2)):
        for x in range(0,im.width):
            if im.getpixel((x,y))==(233,245,255): xs.append(x); ys.append(y)
    return (min(xs)/2-1,min(ys)/2-1,max(xs)/2+1,max(ys)/2+1) if xs else None
DASH=(760.13,3.5,796.16,20.0); SWP=(1315.98,60.5,1352.01,77.0)
# 1 — before / after, 1440 px: two matched pairs (top menu strip, view buttons). Cropped so the toolbar items left of the buttons
# (which differ between the two builds for another reason) are not in the picture.
from PIL import Image as _I
def hstack(ps,gap=30):
    W=sum(p.width for p in ps)+gap*(len(ps)-1); H=max(p.height for p in ps); o=_I.new('RGB',(W,H),(255,255,255)); x=0
    for p in ps: o.paste(p,(x,0)); x+=p.width+gap
    return o
nb=panel(S+'../raw-staging-1440.png',(700,0,1000,56),'BEFORE',[(760,12,866,44,RED,1)],[(1,RED,'Staging v26.40.20-7405769. No "New" pill on Dashboard.')])
na=panel(S+'m636-light-1440.png',(700,0,1000,56),'AFTER',[(DASH[0]-1,DASH[1]-1,DASH[2]+1,DASH[3]+1,GRN,1)],[(1,GRN,'Staging v26.43.0-e48011d. "New" pill on the top-left corner of Dashboard. Reports, Dashboard and Search have not moved.')])
sb=panel(S+'../raw-staging-1440.png',(1180,50,1440,125),'BEFORE',[(1266,79,1402,115,RED,2,'top')],[(2,RED,'Staging v26.40.20-7405769. No "New" pill above the three view buttons.')])
sa=panel(S+'after-tech-1440.png',(1180,50,1440,125),'AFTER',[(SWP[0]-1,SWP[1]-1,SWP[2]+1,SWP[3]+1,GRN,2,'right')],[(2,GRN,'Staging v26.43.0-e48011d. One "New" pill, centred just above the three view buttons. It covers none of them.')])
row1=hstack([nb,na]); row2=hstack([sb,sa]); stack([row1,row2]).save('ev/SV-11636_1-before-after-1440.png')
# 2 — tablet 1024 and phone menu
t=panel(S+'m636-light-1024.png',(560,0,1024,180),'Tablet width, 1024 px: top menu and view buttons',
  [(DASH[0]-1+0,DASH[1]-1,DASH[2]+1,DASH[3]+1,GRN,1),(774.91,114.5,810.94,131,GRN,2,'right')],
  [(1,GRN,'Dashboard pill: clear of Reports and Search.'),(2,GRN,'View-buttons pill: centred above the three buttons, nothing clipped.')])
ph=panel(S+'m636-light-390-menu.png',(0,400,300,500),'Phone width, 390 px: the menu',
  [(195,451.3,235,467.8,GRN,3,'right')],
  [(3,GRN,'The Dashboard row carries the same "New" pill. No other row changed. The List / Tech View / Board View buttons do not exist at this width, so there is no second pill.')])
stack([t,ph]).save('ev/SV-11636_2-tablet-and-phone.png')
# 3 — access to Reports
def role(file,title,box,notes,col): return panel(S+file,(200,0,1000,70),title,box,notes)
r1=role('role636-Technician-1440.png','Technician (no access to Reports), 1440 px',[(241,11,578,45,BLU,1)],[(1,BLU,'Top menu: Work Orders, Schedule, Customers. No Dashboard link, so no Dashboard pill.')],BLU)
r2=role('role636-ServiceAdvisor-1440.png','Service Advisor (no access to Reports), 1440 px',[(241,11,655,45,BLU,2)],[(2,BLU,'Top menu ends at Parts. No Dashboard link, so no Dashboard pill.')],BLU)
pb=pill_bbox(S+'role636-PartsManager-1440.png'); 
r3=role('role636-PartsManager-1440.png','Parts Manager (has access to Reports, not an Admin), 1440 px',[(pb[0],pb[1],pb[2],pb[3],GRN,3)],[(3,GRN,'Dashboard link and its "New" pill are there.')],GRN)
stack([r1,r2,r3]).save('ev/SV-11636_3-access-to-reports.png')
# 4 — Tech View button
r=panel(S+'after-tech-1440.png',(1160,30,1440,130),'Tech View button, resting',
  [(1315,59.5,1353,78,GRN,1,'top'),(1312,78,1356,116,BLU,2,'right')],
  [(1,GRN,'The "New" pill sits right above the middle button, Tech View (the person icon), with a 2 px gap.'),(2,BLU,'Tech View button: fully visible and clickable. The pill covers none of it.')])
h=panel(S+'v636-tooltip.png',(1060,30,1340,130),'Pointer over Tech View',
  [(1143,46,1225,79,BLU,3,'right')],
  [(3,BLU,'The "Tech View" label shows on top of the pill while the pointer is on the button, so the pill is hidden only for that moment.')])
stack([r,h]).save('ev/SV-11636_4-tech-view-button.png')
# 5 — expiry (comparison only)
e1=panel(S+'x636-open-before.png',(700,0,1440,130),'Comparison only, not a ShopView feature: I set the browser\'s own clock with my test tool to 31 Oct 2026, 06:58 UTC',
  [(DASH[0]-1,DASH[1]-1,DASH[2]+1,DASH[3]+1,GRN,1),(SWP[0]-1,SWP[1]-1,SWP[2]+1,SWP[3]+1,GRN,2,'right')],
  [(1,GRN,'Both "New" pills still show, one minute before the end time.')])
e2=panel(S+'x636-open-after.png',(700,0,1440,130),'Comparison only: the same open tab, with that test clock moved on to 31 Oct 2026, 07:00:36 UTC',
  [(760,12,866,44,RED,3),(1266,79,1402,115,RED,4,'right')],
  [(3,RED,'Dashboard pill gone, without reloading the page.'),(4,RED,'View-buttons pill gone at the same moment.')])
stack([e1,e2]).save('ev/SV-11636_5-expiry-comparison-only.png')
for f in ['1-before-after-1440','2-tablet-and-phone','3-access-to-reports','4-tech-view-button','5-expiry-comparison-only']:
    print(f,Image.open(f'ev/SV-11636_{f}.png').size)
