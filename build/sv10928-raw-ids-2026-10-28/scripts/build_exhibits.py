# Before (production) vs after (branch) exhibits for SV-10928, boxes placed on OCR'd text / the red pop-up.
import sys, numpy as np
sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools'); sys.path.insert(0,'scripts')
from PIL import Image
from ticket_exhibit import panel, stack, RED, GRN
from ocrfind import find
OUT='ev/exhibits'; import os; os.makedirs(OUT,exist_ok=True)
def ocr_box(png,subs,pad=7):
    bs=[b for s in subs for b in find(png,s)][:len(subs)] if subs else []
    bs=[b for s in subs for b in find(png,s)[:1]]
    if not bs: raise SystemExit(f'not found {subs} in {png}')
    return (min(b[0] for b in bs)-pad,min(b[1] for b in bs)-pad,max(b[2] for b in bs)+pad,max(b[3] for b in bs)+pad)
def red_box(png):
    a=np.asarray(Image.open(png).convert('RGB')).astype(int); m=(a[:,:,0]>170)&(a[:,:,1]<60)&(a[:,:,2]<70)
    rows=np.where(m.sum(1)>150)[0]; runs=np.split(rows,np.where(np.diff(rows)>3)[0]+1); r=runs[0]
    cols=np.where(m[r[0]:r[-1]+1].sum(0)>(len(r)*0.5))[0]; return (int(cols[0])-4,int(r[0])-4,int(cols[-1])+4,int(r[-1])+4)
def crop_around(png,b,w=820,h=260):
    W,H=Image.open(png).size; cx=(b[0]+b[2])//2; cy=(b[1]+b[3])//2
    x0=max(0,min(W-w,cx-w//2)); y0=max(0,min(H-h,cy-h//2)); return (x0,y0,min(W,x0+w),min(H,y0+h))
def pair(name,before,after,title_b,title_a,note_b,note_a,w=820,h=260):
    ps=[]
    for (png,box),title,note,col in ((before,title_b,note_b,RED),(after,title_a,note_a,GRN)):
        b=box(png) if callable(box) else box; c=crop_around(png,b,w,h)
        ps.append(panel(png,c,title,[(b[0],b[1],b[2],b[3],col,1)],[(1,col,note)],scale=1))
    stack(ps).save(f'{OUT}/{name}.png'); print('wrote',name)
O='ev/other/'; M='ev/messages/'
pair('01-parts-tab-vendor',('ev/secondtab/prod/tab1-parts-tab.png',lambda p:ocr_box(p,['Ab730b89'])),('ev/secondtab/branch/tab1-parts-tab.png',lambda p:(lambda b:(b[0]-200,b[1],b[2],b[3]))(ocr_box(p,['082057']))),
 'BEFORE — production: Work order → Parts tab, vendor created in another tab','AFTER — branch sv10928: same steps',
 'The Vendor column shows the vendor\'s ID.','The Vendor column shows the vendor\'s name.',w=900)
pair('02-staff-location',('ev/flash/prod-staffEdit.png',lambda p:ocr_box(p,['555206'])),(O+'staff-edit-branch.png',lambda p:ocr_box(p,['Staging','Heavy','9919'])),
 'BEFORE — production: Settings → Staff → Edit Staff Member','AFTER — branch sv10928: same window',
 'Location shows an ID while it loads.','Location shows "Staging Heavy Duty - 9919" — no ID at any point (9 loads, incl. slow network).')
pair('03-new-part-sale-customer',(O+'prod-psnocontact/1-new-part-sale.png',(448,412,695,438)),(O+'branch-pschange/1-new-part-sale.png',lambda p:ocr_box(p,['ZZAUTOTEST','Empty'])),
 'BEFORE — production: customer with no contacts → Part Sales tab → New Part Sale','AFTER — branch sv10928: same steps',
 'The Customer field shows the customer\'s ID.','The Customer field shows the customer\'s name.')
for n,(slug,tb,ta,nb,na) in enumerate([
 ('cm2tab','BEFORE — production: Issue Credit pressed in tab A after tab B already credited the part','AFTER — branch sv10928: same steps','The pop-up names the line by its ID.','The pop-up names the part: "ZZCMV660470 (ZZAUTOTEST vendor part for credit)".'),
 ('mr2tab','BEFORE — production: Receive Credit for two manual returns, one moved to another vendor in tab B','AFTER — branch sv10928: same steps','The pop-up names the manual return by its ID.','The pop-up names it by packing slip: "ZZ58626".'),
 ('ibs','BEFORE — production: Finance tab → Request IBS Approval → Request Approval','AFTER — branch sv10928: same steps','The pop-up names the location by its ID.','The pop-up names the location: "Staging Heavy Duty - 9919".'),
 ('ibs2tab','BEFORE — production: Request Approval after tab B cleared the customer\'s IBS number','AFTER — branch sv10928: same steps','The pop-up names the customer by its ID.','The pop-up names the customer: "4 Star Truck Repair".')],start=4):
    fb={'cm2tab':'3-tabA-popup.png','mr2tab':'3-tabA-popup.png','ibs':'3-after-request.png','ibs2tab':'3-tabA-popup.png','taxes':'A-save-error.png'}[slug]
    pair(f'{n:02d}-popup-{slug}',(f'{M}prod-{slug}/{fb}',red_box),(f'{M}branch-{slug}/{fb}',red_box),tb,ta,nb,na,w=700,h=230)
