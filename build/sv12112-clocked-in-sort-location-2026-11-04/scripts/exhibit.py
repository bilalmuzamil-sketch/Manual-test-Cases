# SV-12112 before/after: Work Orders list sorted by Clocked In (highest first). /usr/bin/python3
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda n,b=False: ImageFont.truetype(FB if b else F,n); RED=(200,40,40); GRN=(30,130,60); GRY=(60,60,60)
def strips(path,parts,y0,y1):
    im=Image.open(path).convert('RGB'); ims=[im.crop((x0*2,y0*2,x1*2,y1*2)) for x0,x1 in parts]
    W=sum(i.width for i in ims)+30*(len(ims)-1); out=Image.new('RGB',(W,ims[0].height),'white'); x=0
    for i in ims: out.paste(i,(x,0)); x+=i.width+30
    return out
def mark(img,rows,y0,labels,colors):
    d=ImageDraw.Draw(img)
    for (ry,lab,c) in zip(rows,labels,colors):
        y=(ry-y0)*2; d.rectangle((4,y+4,img.width-4,y+92),outline=c,width=6)
    return img
# production: Number strip + Clocked In strip, header + 4 rows
P=strips('ev/p-list/list-sorted-desc.png',[(20,325),(1405,1590)],140,380)
P=mark(P,[188,236,284],140,['','',''],[RED,RED,GRN])
B=strips('ev/b-list/list-sorted-desc.png',[(100,300),(1175,1318)],140,428)
B=mark(B,[188,236,332],140,['','',''],[GRN,GRN,GRN])
H=max(P.height,B.height)
W=P.width+B.width+60; out=Image.new('RGB',(W,H+120+420),'white'); d=ImageDraw.Draw(out)
d.rectangle((20,10,20+P.width,100),fill=RED); d.text((34,20),'BEFORE: production (v26.45.0-8e138e1)',font=f(30,True),fill='white'); d.text((34,60),'Highest first: the row showing NO one is on top',font=f(26),fill='white')
x2=40+P.width; d.rectangle((x2,10,x2+B.width,100),fill=GRN); d.text((x2+14,20),'AFTER: QA branch (v26.45.0-279650f)',font=f(30,True),fill='white'); d.text((x2+14,60),'Highest first: 2 people, then 1, then none',font=f(26),fill='white')
out.paste(P,(20,110)); out.paste(B,(x2,110))
L=[('Work Orders > All tab > Clocked In sorted highest first, 4 Nov 2026. Same set-up on both:',GRY,True),
 ('BEFORE  S2-1918: 3 people clocked in at another location. Shows nobody, yet sorted FIRST.',RED,False),
 ('        S2-1919: 1 here + 2 at another location. Shows 1 person, yet sorted above S2-1920 (2 people).',RED,False),
 ('AFTER   S12112-17585: 2 people here, first. S12112-17582: 1 here + 2 elsewhere, second.',GRN,False),
 ('        S12112-17580: 3 people at another location. Shows nobody, sorted with the empty rows.',GRN,False),
 ('Production: Trucks Hill 2 (other location Truck Hill 1). Branch: Heavy Duty (other location Lethbridge).',GRY,False)]
for i,(t,c,b) in enumerate(L): d.text((20,H+140+i*46),t,font=f(26,b),fill=c)
out.save('ev/before-after-clocked-in-sort.png'); print(out.size)
