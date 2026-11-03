from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda n,b=False: ImageFont.truetype(FB if b else F,n)
GRN=(30,130,60); RED=(200,40,40); GRY=(90,90,90)
# viewer (1440 wide, dpr 2; displayed coords x1.44 -> px)
K=1.44; im=Image.open('ev/viewer-row0.png').convert('RGB')
c=im.crop((int(1150*K),int(180*K),int(1980*K),int(300*K)))  # table cell area (row 1 fee)
dlg=im.crop((int(440*K),int(420*K),int(1560*K),int(815*K)))
W=max(dlg.width,c.width)+40; out=Image.new('RGB',(W,70+c.height+30+dlg.height+130),'white'); d=ImageDraw.Draw(out)
d.rectangle((0,0,W,58),fill=GRN); d.text((14,12),'Clicking the cut name still opens the Fees & Discounts viewer, with every name in full',font=f(24,True),fill='white')
out.paste(c,(20,70)); y2=70+c.height+30; out.paste(dlg,(20,y2))
def box(x0,y0,x1,y1,ox,oy,col): d.rectangle((ox+(x0-ox0)*K-6,oy+(y0-oy0)*K-6,ox+(x1-ox0)*K+6,oy+(y1-oy0)*K+6),outline=col,width=5)
ox0,oy0=1150,180; box(1642,258,1745,285,20,70,GRN)
ox0,oy0=440,420; box(495,592,718,620,20,y2,GRN); box(495,632,548,660,20,y2,GRN)
yc=y2+dlg.height+16
for i,(t,cl,b) in enumerate([('1. Click "Such A Lo..." in the Fees & Discounts column (P2-162, row 1).',GRN,True),('2. The viewer opens and lists "Such a Long name testing" and "Disc" in full. Closing it leaves nothing on screen.',GRN,False),('QA branch sv11904, build v26.43.5-2999cf9, 1440 wide, 3 Nov 2026.',GRY,False)]):
    d.text((20,yc+i*34),t,font=f(21,b),fill=cl)
out.save('ev/viewer-full-names.png'); print('viewer',out.size)
# phone (390 css? this file is 375x812 at dpr 3)
P=3; ph=Image.open('ev/phone-row0-6s.png').convert('RGB'); pd=ImageDraw.Draw(ph)
x,y,w,h=101,429,183,35; pd.rectangle((x*P-8,y*P-8,(x+w)*P+8,(y+h)*P+8),outline=RED,width=8)
ph=ph.crop((0,int(180*P),ph.width,int(560*P)))
o=Image.new('RGB',(ph.width,ph.height+260),'white'); o.paste(ph,(0,0)); od=ImageDraw.Draw(o)
for i,(t,cl,b) in enumerate([('Phone (375 wide, touch): tap "Such A Lo..."',RED,True),('The viewer opens with the full names, but the grey',RED,False),('tooltip stays on top of it (still there after 6 s)',RED,False),('and covers the "Disc" row until you tap again.',RED,False),('QA branch sv11904, v26.43.5-2999cf9, 3 Nov 2026',GRY,False)]):
    od.text((24,ph.height+14+i*46),t,font=f(34,b),fill=cl)
o.save('ev/phone-tooltip-over-viewer.png'); print('phone',o.size)
