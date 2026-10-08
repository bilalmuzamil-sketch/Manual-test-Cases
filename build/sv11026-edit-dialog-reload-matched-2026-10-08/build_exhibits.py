"""SV-11026 exhibits (8 Oct 2026). Run from this folder. BEFORE = sv10360 build v26.40.8-3e5c1df (captured 8 Oct for the ticket); AFTER = sv10360 build v26.40.8-e20f5ff."""
import sys
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
from PIL import Image, ImageDraw
R='ev/raw/'; O='ev/'
def side(a, b, gap=60):
    H=max(a.height,b.height); out=Image.new('RGB',(a.width+gap+b.width,H),(255,255,255)); out.paste(a,(0,0)); out.paste(b,(a.width+gap,0))
    d=ImageDraw.Draw(out); x=a.width+gap//2; d.line([x,20,x,H-20],fill=(200,205,215),width=4); return out
def bx(g,col,n,p=6,side=None):
    x,y,w,h=g; t=(x-p,y-p,x+w+p,y+h+p,col,n); return t+(side,) if side else t
# 1. Reload: before vs after
a=panel(R+'BEFORE-reload-after.png', crop=(545,305,1075,685), title='BEFORE (build 3e5c1df): after pressing Reload',
    boxes=[(597,488,1005,590,RED,1)],
    notes=[(1,RED,'Memo and Payee went back to what was already saved on the row. What had been typed was gone.')])
b=panel(R+'T1c-after-reload.png', crop=(545,305,1075,685), title='AFTER (build e20f5ff): after pressing Reload',
    boxes=[bx((597,492,406,96),GRN,1),bx((597,446,410,32),BLU,2)],
    notes=[(1,GRN,'What was typed is still there: Payee "ZZ typed payee 1", Memo "ZZ typed memo 1".'),(2,BLU,'Account shows "6100 Insurance", the change made in the other tab. Save then kept both.')])
side(a,b).save(O+'01-reload-before-after.png')
# 2. Matched elsewhere: before vs after
a=panel(R+'BEFORE-matched-toast.png', crop=(545,305,1520,1000), title='BEFORE (build 3e5c1df): Save on a row matched in another tab',
    boxes=[(1096,934,1504,1000,RED,1),(560,319,1040,673,RED,2)],
    notes=[(1,RED,'Only a red pop-up at the bottom right.'),(2,RED,'The Edit window had no message in it and no Dismiss.')])
b=panel(R+'T3-7-msg.png', crop=(545,265,1075,725), title='AFTER (build e20f5ff): same action',
    boxes=[bx((585,394,430,68),GRN,1),bx((954,654,61,36),BLU,2,4,'right')],
    notes=[(1,GRN,'The message is inside the window: "Only pending transactions can be edited; this one is matched.", with a Dismiss button that closes the window.'),(2,BLU,'Save is greyed out, so nothing more can be sent. No pop-up appears.')])
side(a,b).save(O+'02-matched-before-after.png')
# 3. Other cases on the fixed build
p1=panel(R+'T5b-reload-failed.png', crop=(545,265,1075,725), title='A. Reload could not refresh the list (refresh made to fail on purpose)',
    boxes=[bx((585,394,430,68),GRN,1),bx((820,534,183,40),GRN,2)],
    notes=[(1,GRN,'The "This transaction changed" message and its Reload button stay.'),(2,GRN,'What was typed (Payee "ZZ typed payee 4") stays. A second Reload then worked and Save kept it.')])
p2=panel(R+'T4c-500.png', crop=(545,265,1075,725), title='B. Save failed on the server (failure made on purpose)',
    boxes=[bx((585,394,430,68),GRN,1),bx((597,534,406,96),GRN,2)],
    notes=[(1,GRN,'"Couldn\'t save the transaction. Please try again." with Dismiss, inside the window.'),(2,GRN,'Typing kept. After Dismiss, Save worked first time.')])
p3=panel(R+'T6c-excluded.png', crop=(545,265,1075,725), title='C. Row excluded in another tab, then Save',
    boxes=[bx((585,394,430,68),GRN,1),bx((954,654,61,36),BLU,2,4,'right')],
    notes=[(1,GRN,'"Only pending transactions can be edited; this one is excluded." with Dismiss.'),(2,BLU,'Save greyed out, same as a matched row.')])
row=Image.new('RGB',(p1.width+p2.width+p3.width+120,max(p1.height,p2.height,p3.height)),(255,255,255))
x=0
for pp in (p1,p2,p3): row.paste(pp,(x,0)); x+=pp.width+60
row.save(O+'03-other-cases.png')
for f in ['01-reload-before-after','02-matched-before-after','03-other-cases']: print(f, Image.open(O+f+'.png').size)
