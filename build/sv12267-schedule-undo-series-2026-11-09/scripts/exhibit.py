import sys, json; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
from PIL import Image
R='/tmp/sv12267/'; O='/home/user/Manual-test-Cases/build/sv12267-schedule-undo-series-2026-11-09/ev/exhibits/'
def comp(png, js, name):
    b=json.loads(open(R+js).read().strip().splitlines()[-1])['boxes'][0]; by=int(b['y']); im=Image.open(R+png)
    X0,X1=300,1000; h=im.crop((X0*2,113*2,X1*2,195*2)); r=im.crop((X0*2,(by-10)*2,X1*2,(by+96)*2))
    c=Image.new('RGB',(h.width,h.height+r.height),'white'); c.paste(h,(0,0)); c.paste(r,(0,h.height)); c.save(R+name)
    return b
bp=comp('EX-prod-1-before.png','EX-prod-1.json','c-p1.png'); ap=comp('EX-prod-2-after.png','EX-prod-2.json','c-p2.png')
bb=comp('EX-br-1-before.png','EX-br-1.json','c-b1.png'); ab=comp('EX-br-2-after.png','EX-br-2.json','c-b2.png')
W,Hh=700,188; Y0,Y1=92,178
def bx(b,c,n): x=int(b['x'])-300; return (x,Y0,x+int(b['width']),Y1,c,n)
p1=panel(R+'c-p1.png',(0,0,W,Hh),'BEFORE (production, build v26.45.2-107ad4b): booked Tue 1 and Wed 2 Dec',[bx(bp,BLU,1)],
 [(1,BLU,'One booking across Tuesday 1 and Wednesday 2 December (work order S2-1928).')])
p2=panel(R+'c-p2.png',(0,0,W,Hh),'BEFORE (production): after Entire series, then Undo',[bx(ap,BLU,1),(530,Y0,684,Y1,RED,2)],
 [(1,BLU,'Only Tuesday 1 December came back.'),(2,RED,'Wednesday 2 December is lost and would have to be booked again by hand.')])
b1=panel(R+'c-b1.png',(0,0,W,Hh),'AFTER (QA branch sv12267, build v26.45.2-3378a88): booked Tue 1 and Wed 2 Dec',[bx(bb,BLU,1)],
 [(1,BLU,'One booking across Tuesday 1 and Wednesday 2 December (work order S12267-17590, Karen Peck).')])
b2=panel(R+'c-b2.png',(0,0,W,Hh),'AFTER (QA branch): after Entire series, then Undo',[bx(ab,GRN,1)],
 [(1,GRN,'Both days are back: Tuesday 1 and Wednesday 2 December, same technician, same times, same lines.')])
stack([p1,p2,b1,b2]).save(O+'01-before-vs-after-day-view.png'); print(Image.open(O+'01-before-vs-after-day-view.png').size)
