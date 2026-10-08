"""Follow-up ticket exhibits (SV-10903, 8 Oct 2026). Run from this folder."""
import sys
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
from PIL import Image, ImageDraw
R='ev/raw/'; O='ev/'
def side(a, b, gap=60):
    H=max(a.height,b.height); out=Image.new('RGB',(a.width+gap+b.width,H),(255,255,255)); out.paste(a,(0,0)); out.paste(b,(a.width+gap,0))
    d=ImageDraw.Draw(out); x=a.width+gap//2; d.line([x,20,x,H-20],fill=(200,205,215),width=4); return out
a=panel(R+'W2-i1-before-reload.png', crop=(545,265,1075,725), title='1. After Save: conflict banner, your typing still there',
    boxes=[(585,392,1015,464,BLU,1),(597,532,1005,632,BLU,2)],
    notes=[(1,BLU,'"This transaction changed. Reload it before saving." with Reload.'),(2,BLU,'What you typed: Memo "ZZ memo typed", Payee "ZZ payee typed".')])
b=panel(R+'W2-i1-after-reload.png', crop=(545,305,1075,685), title='2. After pressing Reload',
    boxes=[(597,488,1005,590,RED,3)],
    notes=[(3,RED,'Memo and Payee now show what was already saved on the row ("ZZ plain edit 5", "ZZ Payee 5"). What you typed is gone and has to be typed again.')])
side(a,b).save(O+'01-reload-clears-typing-hd.png')
panel(R+'W2-i2-toast.png', crop=(545,305,1520,1000), title='Edit window Save on a row that was matched in another tab',
    boxes=[(1096,934,1504,1000,RED,1),(560,319,1040,673,BLU,2)],
    notes=[(1,RED,'A red pop-up at the bottom right: "Only pending transactions can be edited; this one is matched."'),(2,BLU,'The Edit window stays open with no message in it and no Dismiss button, so nothing in the window says what happened.')]).save(O+'02-matched-row-popup-hd.png')
for f in ['01-reload-clears-typing-hd','02-matched-row-popup-hd']: print(f, Image.open(O+f+'.png').size)
