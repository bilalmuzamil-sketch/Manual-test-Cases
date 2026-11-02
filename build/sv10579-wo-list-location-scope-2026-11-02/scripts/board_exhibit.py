from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda n,b=False: ImageFont.truetype(FB if b else F,n)
RED=(200,40,40); GRN=(30,130,60)
p=Image.open('ev/prod/board.png').convert('RGB').crop((16,160,304,510)); b=Image.open('ev/branch/board.png').convert('RGB').crop((16,160,304,1000))
S=2; p=p.resize((p.width*S,p.height*S),Image.LANCZOS); b=b.resize((b.width*S,b.height*S),Image.LANCZOS)
W=1720; H=90+max(p.height,b.height)+40
out=Image.new('RGB',(W,H+90),'white'); d=ImageDraw.Draw(out)
def band(x,y,w,t,c): d.rectangle((x,y,x+w,y+60),fill=c); d.text((x+14,y+8),t[0],font=f(20,True),fill='white'); d.text((x+14,y+34),t[1],font=f(16),fill='white')
px,py=20,90; bx,by=660,90
band(20,15,610,("BEFORE - Production board, Trucks Hill 2","build v26.43.5-77de68c, 2 Nov 2026"),RED)
band(660,15,1040,("AFTER - QA branch sv10579 board, Staging Heavy Duty - 9919","build v26.43.5-e516d33, 2 Nov 2026"),GRN)
out.paste(p,(px,py)); out.paste(b,(bx,by))
def box(ox,oy,r,c,cap=None,cx=None,cy=None):
    x0,y0,x1,y1=[v*S for v in r]; R=(ox+x0-4,oy+y0-4,ox+x1+4,oy+y1+4); d.rectangle(R,outline=c,width=4)
    if cap:
        d.line((R[2],(R[1]+R[3])//2,cx-6,cy+12),fill=c,width=3)
        for i,l in enumerate(cap): d.text((cx,cy+i*24),l,font=f(18,i==0),fill=c)
# prod: clocked-in line on S2-1788 (orig y 363 -> crop y 203)
box(px,py,(26,193,232,212),RED,None)
for i,l in enumerate(["Red box - Clocked in shows","ZZAUTOTEST NT1 Ana Brooks.","S2-1788 is a Trucks Hill 2 work order,","but her clock-in was made at Truck Hill 1."]): d.text((px+10,py+720+i*26),l,font=f(19,i==0),fill=RED)
# branch cards (orig - (16,160))
box(bx,by,(14,236,274,417),RED,None)
d.text((bx+560+20,by+500),"S10579-17581",font=f(18,True),fill=RED)
for i,l in enumerate(["Open clock-in made at Staging Lethbridge.","No 'clocked in' line on the card now."]): d.text((bx+580,by+524+i*24),l,font=f(18),fill=RED)
d.line((bx+274*S+6,by+330*S,bx+575,by+512),fill=RED,width=3)
box(bx,by,(24,130,162,148),GRN,["S10579-17584: Michael Stephenson","clocked in at Heavy Duty - still shows"],bx+600,by+240)
box(bx,by,(24,733,142,751),GRN,["S10579-17582: Admin ShopView","clocked in at Heavy Duty - still shows"],bx+600,by+1440)
box(bx,by,(24,795,52,817),GRN,["Line technician AS (Admin ShopView)","still shows"],bx+600,by+1560)
box(bx,by,(24,575,52,597),GRN,["S10579-17585: line technician TS","(Tech ShopView) still shows"],bx+600,by+1110)
out.save('ev/before-after-board.png'); print(out.size)
