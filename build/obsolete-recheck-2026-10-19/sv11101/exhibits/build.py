# C96929 / SV-11101 retest exhibits (staging v26.40.19-e435950, 19 Oct 2026, 2x). Coordinates from k10.json.
import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
from PIL import Image
E='/home/user/Manual-test-Cases/build/obsolete-recheck-2026-10-19/sv11101/ev/'; O='/home/user/Manual-test-Cases/build/obsolete-recheck-2026-10-19/sv11101/exhibits/'
def hstack(ps,gap=40):
    H=max(p.height for p in ps); out=Image.new('RGB',(sum(p.width for p in ps)+gap*(len(ps)-1),H),(255,255,255)); x=0
    for p in ps: out.paste(p,(x,0)); x+=p.width+gap
    return out
# List: our four rows (Nora Sort QA1019 as lead)
L=[(372,'Alpha Freight S2-37438'),(468,'Mid Trucking S2-37440 (newer)'),(564,'Mid Trucking S2-37439'),(708,'Zeta Hauling S2-37437')]
lst=panel(E+'k10-list-after.png',(0,180,1120,760),'1. List (no saved sort): sorted by Customer, A to Z',
  [(60,y,1112,y+48,BLU,i+1) for i,(y,_) in enumerate(L)],
  [(i+1,BLU,t) for i,(_,t) in enumerate(L)]+[(5,BLU,'Unboxed rows are other QA1019 work orders led by other technicians. Lead Technician is the last column shown.')])
lst.save(O+'c96929-01-list.png')
tv=panel(E+'k10-tech.png',(0,190,760,510),'2. Tech View, Nora Sort QA1019\'s group',
  [(52,245+64*i,750,309+64*i,GRN,i+1) for i in range(4)],
  [(1,GRN,'Zeta S2-37437: lead given 1st'),(2,GRN,'Mid S2-37439: lead given 2nd'),(3,GRN,'Mid S2-37440: lead given 3rd'),(4,GRN,'Alpha S2-37438: lead given last, so it is at the bottom')])
bv=panel(E+'k10-board.png',(700,200,1045,1125),'3. Board View, the same column',
  [(741,y,1003,y+207,GRN,i+1) for i,y in enumerate([262,477,693,908])],
  [(1,GRN,'Zeta'),(2,GRN,'Mid S2-37439'),(3,GRN,'Mid S2-37440'),(4,GRN,'Alpha: same order as Tech View')])
hstack([tv,bv]).save(O+'c96929-02-tech-board.png')
for f in ['01-list','02-tech-board']:
    i=Image.open(O+'c96929-'+f+'.png'); print(f,i.width//2,i.height//2)
