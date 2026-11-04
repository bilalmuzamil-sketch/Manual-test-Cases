# Step picture for the follow-up ticket: Reports > Timesheet Activities > New, End left empty
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda n,b=False: ImageFont.truetype(FB if b else F,n); RED=(200,40,40); GRY=(60,60,60)
im=Image.open('ev/tsnew-filled.png').convert('RGB'); k=1.6
cx0,cy0,cx1,cy1=[int(v*k) for v in (560,60,1990,850)]; P=im.crop((cx0,cy0,cx1,cy1)); d=ImageDraw.Draw(P)
def box(x0,y0,x1,y1,n):
    a=(int(x0*k)-cx0-8,int(y0*k)-cy0-8,int(x1*k)-cx0+8,int(y1*k)-cy0+8); d.rectangle(a,outline=RED,width=7)
    d.ellipse((a[0]-30,a[1]-30,a[0]+30,a[1]+30),fill=RED); d.text((a[0],a[1]),str(n),font=f(36,True),fill='white',anchor='mm')
box(1847,102,1962,146,1); box(651,520,1348,570,2); box(651,590,1348,640,3); box(651,660,990,710,4); box(1010,660,1348,710,5); box(1254,760,1342,805,6)
P=P.resize((P.width//2,P.height//2),Image.LANCZOS)
out=Image.new('RGB',(P.width+40,P.height+320),'white'); out.paste(P,(20,20)); d=ImageDraw.Draw(out)
L=[('QA branch sv12112 (v26.45.0-279650f), 4 Nov 2026',GRY,True),
   ('Reports > Timesheet Activities',GRY,True),
   ('1 New   2 Work Order S12112-17584   3 its line   4 a Start time',RED,False),
   ('5 End left EMPTY (still clocked in)   6 Create',RED,False),
   ('The entry then shows as Active: Admin ShopView is clocked in on S12112-17584.',GRY,False)]
for i,(t,c,b) in enumerate(L): d.text((20,P.height+40+i*50),t,font=f(24,b),fill=c)
out.save('ev/ticket-step-add-by-hand.png'); print(out.size)
