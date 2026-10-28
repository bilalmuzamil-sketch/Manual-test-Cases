# Retest 28 Oct exhibits (build v26.43.2-3ed5bdc).
import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, font
from PIL import Image, ImageDraw
EV='ev/'; O='ev28/'; C='/tmp/qa11631/w/cap/'; T='/tmp/qa11631/w/tap28/'
def labelled(path, label, col, width):
    im=Image.open(path).convert('RGB'); im=im.resize((width,int(im.height*width/im.width)))
    out=Image.new('RGB',(width,im.height+70),'white'); d=ImageDraw.Draw(out); d.rectangle([0,0,width,70],fill=col)
    d.text((24,14),label,font=font(34,True),fill='white'); out.paste(im,(0,70)); return out
after=panel(C+'A-1440-p2109.png',crop=(250,130,1420,300),title='AFTER: QA branch sv11631, build v26.43.2-3ed5bdc, 27 October 2026 (P2-109, 1440 wide)',
  boxes=[(543,180,651,212,GRN,1),(1215,185,1293,207,GRN,2)],
  notes=[(1,GRN,'WK4707Q-23KW now shows in full (the box is 108 px; it was 98 px and cut to "WK4707Q-23..."). ZZ12CHARPN01 two rows down also shows in full.'),
         (2,GRN,'The "Requested" badge now ends before the Actions column instead of sliding under it.'),
         ])
after2=panel(C+'A-1440-p2109.png',crop=(250,700,1420,830),title='AFTER: bottom of the same table (last row, Washer, M20)',
  boxes=[(286,789,1416,812,GRN,3)],notes=[(3,GRN,'Under the last row there is no sideways scrollbar: it fits at 1440 wide (1130 of 1130 px; before it was 1146 px).')])
W=after.width
b1=labelled(EV+'SV-11631_F1-part-number-cut.png','BEFORE: build v26.43.1-a53a4ac, 26 October 2026 - part number cut',(150,20,20),W)
b2=labelled(EV+'SV-11631_F2-requested-scrolls-at-1440.png','BEFORE: build v26.43.1-a53a4ac, 26 October 2026 - table scrolled sideways',(150,20,20),W)
def vcat(ims,gap=40):
    out=Image.new('RGB',(max(i.width for i in ims),sum(i.height for i in ims)+gap*(len(ims)-1)),'white'); y=0
    for i in ims: out.paste(i,(0,y)); y+=i.height+gap
    return out
vcat([b1,b2,after,after2]).save(O+'01-before-after-fixed.png')
# Still failing on a phone: tap shows nothing; mouse hover (control) works.
t1=panel(T+'p2162-desc-touch-tap-after.png',crop=(30,360,390,460),scale=3,title='Phone (390 wide), P2-162: tapped the cut-off description "Engine Oil Filter, Kubota V24..."',
  boxes=[(105,406,147,438,RED,1)],notes=[(1,RED,'After the tap nothing appears; the full name "Engine Oil Filter, Kubota V2403" is not shown.')])
t2=panel(T+'p2162-avatar-touch-tap-after.png',crop=(30,360,390,460),scale=3,title='Phone (390 wide), P2-162: tapped the "JJ" avatar on the same row',
  boxes=[(63,406,95,438,RED,1)],notes=[(1,RED,'After the tap nothing appears; "Requested by Jeffrey Jordan on Jul 24, 2026" is not shown.')])
t3=panel(T+'p2162-avatar-desktop-hover-after.png',crop=(150,200,720,330),title='Same row with a mouse (1440 wide): pointing at the avatar shows the text',
  boxes=[(315,222,347,254,GRN,1)],notes=[(1,GRN,'With a mouse, "Requested by Jeffrey Jordan on Jul 24, 2026" appears. Only the tap on a touch screen is missing.')])
stack([t1,t2,t3]).save(O+'02-phone-tap-still-missing.png')
for f in ['01-before-after-fixed.png','02-phone-tap-still-missing.png']:
    im=Image.open(O+f); print(f,im.size)
