import sys, json; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import fnt, wrap, RED, GRN, BLK, GREY
from PIL import Image, ImageDraw
BLU=(21,101,192); S=2
def panel(title,img,cap,W=1800):
    f=fnt(32,True); fc=fnt(26); d0=ImageDraw.Draw(Image.new('RGB',(10,10))); lines=wrap(d0,cap,fc,W-40)
    if img.width>W-40: img=img.resize((W-40,img.height*(W-40)//img.width))
    c=Image.new('RGB',(W,60+img.height+20+36*len(lines)+30),'white'); d=ImageDraw.Draw(c); d.text((20,12),title,font=f,fill=BLK); c.paste(img,(20,60)); d.rectangle((19,59,20+img.width,60+img.height),outline=(200,205,212),width=2)
    y=80+img.height
    for l in lines: d.text((20,y),l,font=fc,fill=GREY); y+=36
    return c
def stack(title,ps):
    W=max(p.width for p in ps); c=Image.new('RGB',(W,sum(p.height for p in ps)+80),'white'); ImageDraw.Draw(c).text((20,20),title,font=fnt(40,True),fill=BLK); y=80
    for p in ps: c.paste(p,(0,y)); y+=p.height
    return c
def shot(src,crop,boxes):
    im=Image.open(src).convert('RGB'); d=ImageDraw.Draw(im)
    for (b,c) in boxes: d.rectangle((b['x']*S-4,b['y']*S-4,(b['x']+b['w'])*S+4,(b['y']+b['h'])*S+4),outline=c,width=6)
    x0,y0,x1,y1=crop; return im.crop((x0*S,y0*S,x1*S,y1*S))
def redbox(src):
    im=Image.open(src).convert('RGB'); w,h=im.size; xs=[];ys=[]
    for y in range(h//2,h,4):
        for x in range(w//2,w,4):
            r,g,b=im.getpixel((x,y))
            if r>180 and g<40 and b<50: xs.append(x); ys.append(y)
    return {'x':min(xs)/S,'y':min(ys)/S,'w':(max(xs)-min(xs))/S,'h':(max(ys)-min(ys))/S}
# ---------- SV-11498
d=json.load(open('ev/b-37313.json')); st=[x for x in d['steps'] if x['k']=='Down']
re_=st[1]['bx']; un=st[0]['bx']
A1=shot('ev/b-37313-3-down2.png',(960,250,1440,440),[(re_['focus'],BLU),(re_['tip'],GRN)])
A2=shot('ev/b-37313-3-down1.png',(960,250,1440,440),[(un['focus'],BLU),(un['tip'],GRN)])
def row(a,b,gap=30):
    c=Image.new('RGB',(a.width+b.width+gap,max(a.height,b.height)),'white'); c.paste(a,(0,0)); c.paste(b,(a.width+gap,0)); return c
E1=stack('Board View, locked work order S2-37313 (Invoiced), keyboard only',[
 panel('BEFORE - from the ticket (Staging build v26.40.19-31ad1e1, 19 October 2026)',Image.open('ev/before-sv11498-ticket.png').convert('RGB'),
  'The reporter\'s picture: with the keyboard, "Reassign lead technician" had the focus but no note appeared. Only the mouse showed it.'),
 panel('AFTER - Staging build v26.40.20-9c75418, 20 October 2026, keyboard only',row(A1,A2),
  'Blue box: the item the keyboard focus is on - "Reassign lead technician" (left) and "Unassign" (right), both greyed out. Green box: the note now appears under the focused item: "The lead technician can\'t be changed once a work order is Invoiced or Paid." Nothing opens when Enter is pressed.'),
])
E1.save('sv11498-01-keyboard-note-before-after.png')
# ---------- SV-11454
b1=json.load(open('ev/b1.json')); tv=json.load(open('ev/t1.json')); bp=json.load(open('ev/bP.json'))
def cardbox(it): return {'x':it['x'],'y':it['y'],'w':it['w'],'h':it['h']}
al=redbox('ev/b1-3-refused.png')
B1=shot('ev/b1-3-refused.png',(0,190,1440,900),[(cardbox(b1['after1']),GRN),(al,BLU)])
BP=shot('ev/bP-3-refused.png',(300,240,640,520),[(cardbox(bp['after1']),GRN)])
tr=dict(cardbox(tv['after1'])); tr['w']=1418
TV=shot('ev/t1-3-refused.png',(0,180,1440,420),[(tr,GRN)])
E2=stack('Board View: a move refused because the work order was invoiced in another tab',[
 panel('BEFORE - from the ticket (Staging, 16 October 2026)',Image.open('ev/before-sv11454-ticket.png').convert('RGB'),
  'The reporter\'s picture: the alert said the lead technician can\'t be changed once a work order is Invoiced or Paid, but the card S2-36364 still read "Approved".'),
 panel('AFTER - Staging build v26.40.20-9c75418, 20 October 2026, Board View (S2-37623)',B1,
  'Blue box: the same alert. Green box: the card now reads "Invoiced" with a lock icon, and it stays in Brandi Smith\'s column. The page was not reloaded.'),
])
E2.save('sv11454-01-refused-move-before-after.png')
E3=stack('Same check, other cases (Staging build v26.40.20-9c75418, 20 October 2026)',[
 panel('Board View, work order paid in the other tab (S2-37627)',BP,'Green box: after the refused move the card reads "Paid" with a lock icon and stays with its technician.'),
 panel('Tech View, work order invoiced in the other tab (S2-37625)',TV,'Green box: after the refused move the row reads "Invoiced" with a lock icon and stays in Brandi Smith\'s group.'),
])
E3.save('sv11454-02-paid-and-tech-view.png')
for f in ['sv11498-01-keyboard-note-before-after.png','sv11454-01-refused-move-before-after.png','sv11454-02-paid-and-tech-view.png']: print(f,Image.open(f).size)
