import sys, json
sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import fnt, wrap, RED, GRN, BLK, GREY
from PIL import Image, ImageDraw
S=2; OR=(230,120,0)
OLD='/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16/sv11407/ev/'
def crop(src,box): x0,y0,x1,y1=box; return Image.open(src).convert('RGB').crop((x0*S,y0*S,x1*S,y1*S))
def boxes(im,org,items):
    d=ImageDraw.Draw(im)
    for (x0,y0,x1,y1,c,n) in items:
        X0,Y0,X1,Y1=[(v-o)*S for v,o in zip((x0,y0,x1,y1),(org[0],org[1],org[0],org[1]))]
        d.rectangle((X0-3,Y0-3,X1+3,Y1+3),outline=c,width=5)
    return im
def zoom(src,box,labels,k=8):
    im=crop(src,box); z=im.resize((im.width*k//2,im.height*k//2),Image.NEAREST)
    C=Image.new('RGB',(z.width+760,z.height),'white'); C.paste(z,(0,0)); d=ImageDraw.Draw(C); f=fnt(28,True)
    for (css_y,txt,c,*dy) in labels:
        dy=dy[0] if dy else 0
        y=int((css_y-box[1])*k+k/2); d.line((z.width-60,y,z.width+20,y),fill=c,width=4); d.polygon([(z.width-60,y),(z.width-40,y-10),(z.width-40,y+10)],fill=c); ty=y+dy; d.line((z.width+20,y,z.width+20,ty),fill=c,width=4); d.text((z.width+30,ty-17),txt,font=f,fill=c)
    return C
def page(title,rows,W=1800):
    # rows: list of (label, image, caption)
    f=fnt(34,True); fc=fnt(26); out=[]
    for lab,im,cap in rows:
        if im.width>W-40: im=im.resize((W-40,im.height*(W-40)//im.width))
        tmp=Image.new('RGB',(W,10),'white'); d=ImageDraw.Draw(tmp); lines=wrap(d,cap,fc,W-40)
        h=60+im.height+20+len(lines)*36+30; c=Image.new('RGB',(W,h),'white'); d=ImageDraw.Draw(c)
        d.text((20,12),lab,font=f,fill=BLK); c.paste(im,(20,60)); d.rectangle((19,59,20+im.width,60+im.height),outline=(200,205,212),width=2)
        y=60+im.height+20
        for l in lines: d.text((20,y),l,font=fc,fill=GREY); y+=36
        out.append(c)
    H=sum(o.height for o in out)+80; P=Image.new('RGB',(W,H),'white'); d=ImageDraw.Draw(P); d.text((20,20),title,font=fnt(40,True),fill=BLK); y=80
    for o in out: P.paste(o,(0,y)); y+=o.height
    return P
J=lambda f: json.load(open('ev/'+f+'.json'))
# E1 before (17 Oct) vs after (today), Board, Unassigned + first technician column
CB=(10,150,620,345)
old=crop(OLD+'bv-after.png',CB); new=crop('ev/x2b-after.png',CB)
b=J('x2b')['after']['cols']
boxes(old,CB,[(29,206,291,330,RED,'1'),(333,208,595,345,GRN,'2')])
boxes(new,CB,[(29,b[0]['first']['t'],291,b[0]['first']['b'],GRN,'1'),(333,b[1]['first']['t'],595,345,GRN,'2')])
zb=(22,198,150,222); zo=zoom(OLD+'bv-after.png',zb,[(205.5,'column top edge',BLK),(214,'no card border: it is hidden under the edge',RED)]); zn=zoom('ev/x2b-after.png',zb,[(205.5,'column top edge',BLK,-34),(207.5,'card top border, visible',GRN,36)])
E1=page('Board View, after pressing Back: Unassigned column top card',[
 ('BEFORE - Staging build v26.40.19-754919e, 17 October 2026',old,'Red box: the Unassigned column\'s top card (S2-33104) came back 2 px under the column\'s top edge, so its top border was hidden. Green box: the technician column next to it came back fully shown.'),
 ('BEFORE - close-up of the top edge of the Unassigned column (red box)',zo,'Magnified: only the column\'s grey top line shows; the card\'s own top border is hidden under it.'),
 ('AFTER - Staging build v26.40.20-9c75418, 20 October 2026',new,'Green boxes: the Unassigned column\'s top card (S2-32218) comes back with its top 1 px below the column\'s top edge, fully shown, and the technician column next to it is fully shown too.'),
 ('AFTER - close-up of the top edge of the Unassigned column (green box)',zn,'Magnified: the column\'s grey top line, then a white gap, then the card\'s own top border: the whole card is visible.'),
])
E1.save('sv11407-01-unassigned-before-after.png')
# E2 Tech View today before/after
CT=(0,140,1440,330); t=J('x2t'); tb=t['before']['cols'][0]; ta=t['after']['cols'][0]
tb_im=boxes(crop('ev/x2t-before.png',CT),CT,[(16,max(tb['first']['t'],tb['viewTop']),1420,tb['first']['b'],OR,'1')])
ta_im=boxes(crop('ev/x2t-after.png',CT),CT,[(16,ta['first']['t'],1420,ta['first']['b'],GRN,'1')])
E2=page('Tech View, Staging build v26.40.20-9c75418, 20 October 2026, Tech user',[
 ('Before opening the work order',tb_im,f"Orange box: the top row {tb['first']['num']} is half hidden under the grey Unassigned group header (only its lower half shows below the header; the upper half is behind it)."),
 ('After pressing Back',ta_im,f"Green box: the same row {ta['first']['num']} is back at the top, fully shown, starting exactly where the Unassigned header ends ({ta['first']['t']} px). It is not hidden under the header."),
])
E2.save('sv11407-02-tech-view-before-after.png')
# E3 Board today before/after, three columns
CB3=(10,140,915,420); bb=J('x2b')['before']['cols']; ba=J('x2b')['after']['cols']
xs=[29,333,637]
b_im=boxes(crop('ev/x2b-before.png',CB3),CB3,[(xs[i],max(bb[i]['first']['t'],bb[i]['viewTop']),xs[i]+262,min(bb[i]['first']['b'],419),OR,str(i+1)) for i in range(3)])
a_im=boxes(crop('ev/x2b-after.png',CB3),CB3,[(xs[i],ba[i]['first']['t'],xs[i]+262,min(ba[i]['first']['b'],419),GRN,str(i+1)) for i in range(3)])
E3=page('Board View, Staging build v26.40.20-9c75418, 20 October 2026, Tech user',[
 ('Before opening the work order',b_im,'Orange boxes: in the Unassigned column and two technician columns, each top card is half hidden behind the column\'s top edge (each column scrolled on its own).'),
 ('After pressing Back',a_im,'Green boxes: the same three cards ('+', '.join(c['first']['num'] for c in ba[:3])+') are back at the top of their columns, fully shown.'),
])
E3.save('sv11407-03-board-view-before-after.png')
for f in ['sv11407-01-unassigned-before-after.png','sv11407-02-tech-view-before-after.png','sv11407-03-board-view-before-after.png']: print(f,Image.open(f).size)
