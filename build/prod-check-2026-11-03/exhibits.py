# /usr/bin/python3 exhibits.py -> one annotated PNG per ticket. Coordinates are in DISPLAY units (screenshot px / k).
from PIL import Image, ImageDraw, ImageFont
import textwrap
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; FM='/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
f=lambda n,b=False: ImageFont.truetype(FB if b else F,n); GRN=(30,130,60); RED=(200,40,40); GRY=(60,60,60); HEAD=(25,95,55)
def panel(path,crop,boxes,k=1.44):
    im=Image.open(path).convert('RGB'); d=ImageDraw.Draw(im)
    for (x1,y1,x2,y2),c in boxes: d.rectangle((x1*k-8,y1*k-6,x2*k+8,y2*k+6),outline=c,width=7)
    return im.crop(tuple(int(v*k) for v in crop))
def sheet(title,items,out,W=1500):
    ims=[]; 
    for path,crop,boxes,cap,k in items:
        p=panel(path,crop,boxes,k); p=p.resize((W,int(p.height*W/p.width))); ims.append((p,cap))
    H=90+sum(p.height+60+30*len(textwrap.wrap(c,115)) for p,c in ims); o=Image.new('RGB',(W+40,H),'white'); d=ImageDraw.Draw(o)
    d.rectangle((20,10,20+W,70),fill=HEAD); d.text((32,24),title,font=f(24,True),fill='white'); y=90
    for p,cap in ims:
        for ln in textwrap.wrap(cap,115): d.text((20,y),ln,font=f(21,True),fill=GRY); y+=30
        y+=10; o.paste(p,(20,y)); y+=p.height+40
    o.save(out); print(out,o.size)
T='Production app.shopview.com, build v26.45.0-8e138e1, 3 Nov 2026'
sheet('SV-10130 - '+T,[
 ('sv10130/03-empty-title-save.png',(578,280,1422,960),[((612,412,1388,468),GRN),((612,478,780,496),GRN),((612,518,1388,574),GRN)],'1. New Line: "Title" and "Description" sit at the top of their boxes with "What are you doing?" / "Why are you doing it?" underneath; an empty Title shows "Title is a required field".',1.44),
 ('sv10130/12-title-256-and-description.png',(578,190,1422,1050),[((612,512,920,530),GRN)],'2. 256 characters in Title: "Title cannot be longer than 255 characters" and the line is not saved.',1.44),
 ('sv10130/32-edit-old.png',(578,246,1422,993),[((612,358,1388,414),GRN),((612,436,1388,492),GRN)],'3. Edit Line on S1-979 (started 16 Oct, before the release): Title "Vvbnbv" and Description "Fghfg" exactly as saved.',1.44)],'ex-SV-10130.png')
sheet('SV-10133 - '+T,[
 ('sv10133/ev-unknown-2-after.png',(330,100,1990,400),[((363,240,1880,262),GRN)],'1. Settings > Imports > Invoices: the column list reads "Line Title, Line Description" (template header: *Line Title,Line Description).',1.44),
 ('sv10133/imported-ZZ10133-OLD.png',(700,210,1660,800),[((740,715,965,765),GRN),((1345,228,1625,300),GRN)],'2. A file with the OLD headers ("*Line Title - What are you doing", "Line Description - Why are you doing it") imports; title and description land in place.',1.44),
 ('sv10133/ev-emptytitle-2-after.png',(330,230,1990,500),[((347,395,1958,425),GRN)],'3. An empty *Line Title is refused: "Line Title cannot be empty.", Invoices Created: 0.',1.44),
 ('sv10133/ev-unknown-2-after.png',(1280,1120,1880,1245),[((1305,1133,1861,1235),GRN)],'4. An unknown "*Line Name" header is rejected and nothing is imported.',1.44)],'ex-SV-10133.png')
sheet('SV-11662 - '+T+' - work order S2-1914',[
 ('sv11662/wo-12-after-send1.png',(390,100,1990,1245),[((1305,1155,1861,1235),GRN)],'1. Send To Portal with no contact on the work order: the dialog closes and the errors show (the first, "This work order has no contact assigned; ...", had already faded here).',1.44),
 ('sv11662/wo-17-reopen-after-success.png',(578,346,1422,892),[((612,525,1388,585),GRN),((1220,808,1388,858),GRN)],'2. After a contact is assigned and the send succeeds: reopening shows "Already sent to Customer Portal." and Send To Portal is disabled.',1.44)],'ex-SV-11662.png')
sheet('SV-11715 - '+T+' - part sale P2-90',[
 ('sv11715/03-return-core-dialog.png',(20,80,1990,930),[((700,548,1255,594),GRN),((1805,236,1915,265),GRN),((40,845,335,870),GRN)],'1. Return Core asks first: "Return all 2 of Core for A158? The customer is credited $2.00 ..." - total still $602.00. Cancel changes nothing.',1.90),
 ('sv11715/09-stale-tab.png',(20,80,1990,1150),[((1824,238,1898,262),GRN),((40,845,335,870),GRN),((1473,1067,1895,1147),GRN)],'2. After Return Core: core Returned, total $600.00. A second confirm from an older tab is refused ("Core has already been actioned...") - no double credit.',1.90)],'ex-SV-11715.png')
# SV-9550: roles page + plain results
p=panel('sv9550/roles-page.png',(340,100,1990,1240),[((347,240,1958,1222),GRN)]); W=1500; p=p.resize((W,int(p.height*W/p.width)))
lines=open('sv9550/anon.txt').read().splitlines()+open('sv9550/loggedin.txt').read().splitlines()[2:6]
txt=[l.replace('logged-in GET api','Signed in  GET https://api.shopview.com') for l in lines if 'app.shopview.com' not in l]
H=90+len(txt)*30+60+p.height+80; o=Image.new('RGB',(W+40,H),'white'); d=ImageDraw.Draw(o); d.rectangle((20,10,20+W,70),fill=HEAD); d.text((32,24),'SV-9550 - '+T,font=f(24,True),fill='white')
y=90; d.text((20,y),'1. The two admin pages and anything under /admin answer 404; anonymous permission writes answer 401.',font=f(21,True),fill=GRY); y+=40
for l in txt: d.text((30,y),(l if len(l)<120 else l[:117]+'...'),font=ImageFont.truetype(FM,18),fill=GRN if ('404' in l or '401' in l) else GRY); y+=30
y+=20; d.text((20,y),'2. Regression: Settings > Roles & Permissions still loads with its roles.',font=f(21,True),fill=GRY); y+=40; o.paste(p,(20,y)); o.save('ex-SV-9550.png'); print('ex-SV-9550.png',o.size)
