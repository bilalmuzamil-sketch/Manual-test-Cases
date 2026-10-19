# New case (created with lead keeps List's order) exhibits; staging v26.40.19-e435950, 19 Oct 2026, 2x. Geometry from k12.json.
import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, RED, GRN, BLU
from PIL import Image
E='/home/user/Manual-test-Cases/build/obsolete-recheck-2026-10-19/created-with-lead/ev/'; O='/home/user/Manual-test-Cases/build/obsolete-recheck-2026-10-19/created-with-lead/exhibits/'
def hstack(ps,gap=40):
    H=max(p.height for p in ps); out=Image.new('RGB',(sum(p.width for p in ps)+gap*(len(ps)-1),H),(255,255,255)); x=0
    for p in ps: out.paste(p,(x,0)); x+=p.width+gap
    return out
L=[(372,'Alpha Freight S2-37443'),(516,'Mid Trucking S2-37446 (newer)'),(756,'Mid Trucking S2-37444'),(852,'Zeta Hauling S2-37442')]
lst=panel(E+'k12-list.png',(0,180,1120,910),'1. List (no saved sort): Customer, A to Z. Lead Technician shows Owen Created QA1019 on all four',
  [(60,y,1112,y+48,BLU,i+1) for i,(y,_) in enumerate(L)],
  [(i+1,BLU,t) for i,(_,t) in enumerate(L)]+[(5,BLU,'They were made in this order: Zeta, Alpha, Mid, Mid. Unboxed rows are other QA1019 work orders.')])
lst.save(O+'created-lead-01-list.png')
tv=panel(E+'k12-tech.png',(0,180,760,510),"2. Tech View, Owen Created QA1019's group",
  [(52,245+64*i,750,309+64*i,GRN,i+1) for i in range(4)],
  [(1,GRN,'Alpha S2-37443 (made 2nd)'),(2,GRN,'Mid S2-37446 (made 4th, newer)'),(3,GRN,'Mid S2-37444 (made 3rd)'),(4,GRN,'Zeta S2-37442 (made 1st), last')])
bv=panel(E+'k12-board.png',(700,200,1045,1015),'3. Board View, the same column',
  [(741,y,1003,y+180,GRN,i+1) for i,y in enumerate([262,450,637,825])],
  [(1,GRN,'Alpha'),(2,GRN,'Mid S2-37446'),(3,GRN,'Mid S2-37444'),(4,GRN,"Zeta: same order as List and Tech View")])
hstack([tv,bv]).save(O+'created-lead-02-tech-board.png')
for f in ['01-list','02-tech-board']:
    i=Image.open(O+'created-lead-'+f+'.png'); print(f,i.width//2,i.height//2)
