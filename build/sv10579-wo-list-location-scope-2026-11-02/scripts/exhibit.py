import json
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda n,b=False: ImageFont.truetype(FB if b else F,n)
P=json.load(open('ev/prod/list.json')); B=json.load(open('ev/branch/list.json'))
def crop(img,rows):
    top=140; bottom=max(r['number']['y']+r['number']['h'] for r in rows if r.get('found'))+26
    return img.crop((20,top,1880,int(bottom))), top
pi=Image.open('ev/prod/list.png').convert('RGB'); bi=Image.open('ev/branch/list.png').convert('RGB')
pc,pt=crop(pi,P['rows']); bc,bt=crop(bi,B['rows'])
W=1860; hdr=70
out=Image.new('RGB',(W+40,hdr*2+pc.height+bc.height+400),'white'); d=ImageDraw.Draw(out)
RED=(200,40,40); GRN=(30,130,60)
def band(y,text,col):
    d.rectangle((20,y,W+20,y+52),fill=col); d.text((34,y+12),text,font=f(24,True),fill='white')
def box(c,img_top,y_off,col):
    x=c['x']-6; y=c['y']-img_top+y_off-6; w=max(c['w'],150)+12; h=c['h']+12
    d.rectangle((x,y,x+w,y+h),outline=col,width=4)
band(10,f"BEFORE - Production (build {P['marker']['version']}), location Trucks Hill 2, 2 Nov 2026",RED)
y0=72; out.paste(pc,(20,y0))
pr=[r for r in P['rows'] if r['n']=='S2-1788'][0]; box(pr['clocked'],pt,y0,RED)
ly=y0+pc.height+10
d.text((30,ly),"Red box - S2-1788 belongs to Trucks Hill 2, but Clocked In shows Ana Brooks, whose clock-in was made at Truck Hill 1.",font=f(19,True),fill=RED)
yb=ly+60
band(yb,f"AFTER - QA branch sv10579 (build {B['marker']['version']}), location Staging Heavy Duty - 9919, 2 Nov 2026",GRN)
y1=yb+62; out.paste(bc,(20,y1))
rows={r['n']:r for r in B['rows']}
box(rows['S10579-17581']['clocked'],bt,y1,RED); box(rows['S10579-17584']['clocked'],bt,y1,GRN); box(rows['S10579-17582']['clocked'],bt,y1,GRN)
for n in ('S10579-17582','S10579-17585'): box(rows[n]['waiting'],bt,y1,GRN)
ly=y1+bc.height+12
d.text((30,ly),"Red box - S10579-17581 has an open clock-in made at Staging Lethbridge. Clocked In is now empty.",font=f(19,True),fill=RED)
d.text((30,ly+30),"Green boxes - clock-ins made at Heavy Duty still show (Michael Stephenson on 17584, Admin ShopView on 17582),",font=f(19,True),fill=GRN)
d.text((30,ly+56),"and '1 Part Waiting' on 17582 and 17585 still opens each work order's own Heavy Duty parts order.",font=f(19,True),fill=GRN)
out=out.crop((0,0,W+40,ly+96)); out.save('ev/before-after-clocked-in.png'); print(out.size)
