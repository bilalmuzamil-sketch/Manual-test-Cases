import sys, json; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN
from PIL import Image
nm=lambda t:' '.join(t.split()).lower()
num={'accuride':1,'dayco':2,'heavy duty brand':3,'':4,'haldex':2}
def boxes(v,col,keys):
    out=[]
    for h in v['hits']:
        k=nm(h['t'])
        if k in keys: out.append((h['x']+4,h['y']+4,h['x']+h['w']-60,h['y']+h['h']-4,col,keys[k],'right'))
    return out
XP=json.load(open('ev/xp.json')); XB=json.load(open('ev/xb.json'))
crop=lambda v:(v['menu']['x']-50,v['menu']['y']-6,v['menu']['x']+v['menu']['w']+60,v['menu']['y']+v['menu']['h']+6)
pk={'accuride':1,'dayco':2,'heavy duty brand':3,'':4}
b1=panel(XP[0]['file'].replace('../',''),crop(XP[0]),'BEFORE - production (app.shopview.com, build v26.43.2-537378f): Parts > Catalog > Manufacturer filter, top of the list',boxes(XP[0],RED,pk),[])
b2=panel(XP[1]['file'].replace('../',''),crop(XP[1]),'BEFORE - same list, scrolled to the bottom',boxes(XP[1],RED,pk),
 [(1,RED,'Accuride is listed 4 times ("Accuride" x3 and "ACCURIDE").'),(2,RED,'Dayco is listed 3 times ("Dayco", "dayco", "dAyCo").'),(3,RED,'Heavy Duty Brand is listed twice.'),(4,RED,'5 entries have no name at all (one of them was created by my test import).')])
bk={'accuride':1,'dayco':2,'haldex':2,'heavy duty brand':3}
a1=panel(XB[0]['file'].replace('../',''),crop(XB[0]),'AFTER - QA branch sv11669 (build v26.43.2-64183b8): the same filter after the same steps',boxes(XB[0],GRN,bk),[])
a2=panel(XB[1]['file'].replace('../',''),crop(XB[1]),'AFTER - same list, further down',boxes(XB[1],GRN,bk),[])
a3=panel(XB[2]['file'].replace('../',''),crop(XB[2]),'AFTER - same list, further down',boxes(XB[2],GRN,bk),
 [(1,GRN,'Accuride is listed once.'),(2,GRN,'Dayco and Haldex are each listed once.'),(3,GRN,'Heavy Duty Brand is listed once.'),(4,GRN,'No entry without a name. The whole list of 148 manufacturers was read: none appears twice.')])
def row(ps,gap=30):
    W=sum(p.width for p in ps)+gap*(len(ps)-1); H=max(p.height for p in ps); out=Image.new('RGB',(W,H),(255,255,255)); x=0
    for p in ps: out.paste(p,(x,0)); x+=p.width+gap
    return out
stack([row([b1,b2]),row([a1,a2,a3])],gap=60).save('ev/01-before-after-manufacturer-list.png'); print('ok')
