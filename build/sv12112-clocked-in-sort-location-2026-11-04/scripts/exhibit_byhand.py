# SV-12112 question: an open clock-in added by hand (Reports > Timesheet Activities > New, no End) is not counted by the sort. /usr/bin/python3
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda n,b=False: ImageFont.truetype(FB if b else F,n); RED=(200,40,40); GRY=(60,60,60)
im=Image.open('ev/b-list-byhand/list-sorted-desc.png').convert('RGB')
parts=[(100,300),(1175,1318)]; y0,y1=140,428; ims=[im.crop((a*2,y0*2,b*2,y1*2)) for a,b in parts]
W=sum(i.width for i in ims)+30; P=Image.new('RGB',(W,ims[0].height),'white'); x=0
for i in ims: P.paste(i,(x,0)); x+=i.width+30
d=ImageDraw.Draw(P); y=(380-y0)*2; d.rectangle((4,y+4,P.width-4,y+92),outline=RED,width=6); y=(284-y0)*2; d.rectangle((4,y+4,P.width-4,y+188),outline=(230,150,30),width=5)
out=Image.new('RGB',(1320,P.height+374),'white'); out.paste(P,(20,20)); d=ImageDraw.Draw(out)
L=[('QA branch sv12112 (v26.45.0-279650f), 4 Nov 2026',GRY,True),('Work Orders > All > Clocked In, highest first.',GRY,True),
 ('Red: S12112-17584 shows Admin ShopView (added on screen: Reports > Timesheet',RED,False),
 ('Activities > New, no End time) but is sorted LAST,',RED,False),
 ('below two rows (orange) that show nobody.',RED,False),
 ('It moves into place only after someone clocks in or out on that work order.',GRY,False),
 ('Production does the same (S2-1920 showed 2 people and sorted as 0 until then).',GRY,False)]
for i,(t,c,b) in enumerate(L): d.text((20,P.height+40+i*44),t,font=f(26,b),fill=c)
out.save('ev/question-hand-added-clock-in.png'); print(out.size)
