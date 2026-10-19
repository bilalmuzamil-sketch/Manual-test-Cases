# SV-11418 exhibits (staging v26.40.19-e435950, 19 Oct 2026). Coordinates are CSS px from cap18.json / cap18b.json.
import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
from PIL import Image
E='/home/user/Manual-test-Cases/build/obsolete-recheck-2026-10-19/sv11418/ev/'; O='/home/user/Manual-test-Cases/build/obsolete-recheck-2026-10-19/sv11418/exhibits/'
def hstack(ps,gap=40):
    H=max(p.height for p in ps); out=Image.new('RGB',(sum(p.width for p in ps)+gap*(len(ps)-1),H),(255,255,255)); x=0
    for p in ps: out.paste(p,(x,0)); x+=p.width+gap
    return out
Image.open(E+'ticket-before.png').resize((2400,3706),Image.LANCZOS).save(E+'ticket-before-2x.png')
b=panel(E+'ticket-before-2x.png',crop=(24,985,985,1312),title='BEFORE (from this ticket, 16 Oct 2026, staging): Time Clock turned off for Test B1',boxes=[],notes=[(1,RED,'Work order S1-2 moved to the Unassigned column and its card shows no technician name.')])
a=panel(E+'b3-board-off.png',crop=(0,185,1040,712),title='AFTER (staging build v26.40.19-e435950, 19 Oct 2026): Time Clock turned off for Wes Hover',
        boxes=[(729,201,1015,697,GRN,1)],notes=[(1,GRN,'Wes Hover keeps his own column under his name, holding both of his work orders (S2-37409 and S2-37410). Each card still reads Wes Hover.')])
stack([b,a]).save(O+'sv11418-01-before-after-board.png')
panel(E+'b2-timeclock-off.png',crop=(320,143,1120,750),title='Settings > Staff > Wes Hover (pencil icon) > Edit Staff Member',
      boxes=[(345,504,449,524,BLU,1),(979,688,1090,724,BLU,2)],notes=[(1,BLU,'Time Clock switched off.'),(2,BLU,'Save & Close.')]).save(O+'sv11418-02-time-clock-off.png')
t=panel(E+'b6-tech-off.png',crop=(0,295,1440,500),title='Tech View, Time Clock off: Wes Hover keeps his own group',
        boxes=[(4,309,420,365,GRN,1),(1060,365,1268,493,GRN,2)],notes=[(1,GRN,'Group "Wes Hover", 2 work orders.'),(2,GRN,'Lead Technician reads Wes Hover on both rows.')])
l=panel(E+'b5-list-off.png',crop=(0,170,1440,575),title='List, Time Clock off: Lead Technician still reads Wes Hover',
        boxes=[(947,420,1136,468,GRN,1),(947,516,1136,564,GRN,2)],notes=[(1,GRN,'S2-37409 (Alpha Freight QA1019): Wes Hover.'),(2,GRN,'S2-37410 (Mid Trucking QA1019): Wes Hover.')])
stack([t,l]).save(O+'sv11418-03-tech-view-and-list.png')
panel(E+'b4-drop-refused.png',crop=(0,185,1100,700),title='Board View: dragging an unassigned work order onto Wes Hover\'s column',
      boxes=[(783,212,1071,240,GRN,1),(29,255,291,460,BLU,2)],notes=[(1,GRN,'"This technician can\'t be assigned work orders." shows over his column.'),(2,BLU,'After letting go, S2-37411 stays in Unassigned.')]).save(O+'sv11418-04-drop-refused.png')
for f in ['01-before-after-board','02-time-clock-off','03-tech-view-and-list','04-drop-refused']:
    im=Image.open(O+'sv11418-'+f+'.png'); print(f,im.size)
