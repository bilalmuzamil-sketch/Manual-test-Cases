from PIL import Image, ImageDraw, ImageFont
F="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"; FB="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def f(s,b=False): return ImageFont.truetype(FB if b else F, s)
RED=(190,30,30); GRN=(20,135,60)
W=1760

# (file, crop, event-col x in ORIGINAL px, row1 y-range in ORIGINAL px)
PANELS=[
 ("/tmp/sv10158/Q2-history-after.png",(460,150,2380,272),1556,(190,246),RED,
  "BEFORE  —  PRODUCTION  (build v26.36.9-8d1613f)",
  "part 1238213 · picked onto work order S2-811, then that line was split onto a new work order",
  "Part History still shows only the pick — nothing records that the part changed work order."),
 ("/tmp/sv10158/B3-history-after.png",(420,150,2180,392),958,(190,220),GRN,
  "AFTER  —  FIX BRANCH sv10158  (build v26.36.9-58de7bb)",
  "part MD668D · picked onto work order S2-17435, then that line was split onto a new work order",
  "A new entry appears at the top:  “Moved 2 from WO # S2-17435 to WO # S10158-17581”"),
]

img=Image.new("RGB",(W,1400),"white"); d=ImageDraw.Draw(img); y=14
d.text((0,y),"SV-10158  —  split a work order, then look at the part's history",font=f(33,True),fill=(15,15,15)); y+=45
d.text((0,y),"Same action on both builds: a line carrying a picked inventory part is split onto a new work order, then the part's Part History is opened.",font=f(18),fill=(90,90,90)); y+=25
d.text((0,y),"Captured 22 September 2026. Each build has its own data, so the part and the work-order numbers differ; the action is identical.",font=f(18),fill=(90,90,90)); y+=42

for path,crop,ex,(ry0,ry1),col,title,sub,verdict in PANELS:
    im=Image.open(path).crop(crop); s=W/im.size[0]
    im=im.resize((W,int(im.size[1]*s)),Image.LANCZOS)
    d.text((0,y),title,font=f(23,True),fill=col); y+=30
    d.text((0,y),sub,font=f(18),fill=(70,70,70)); y+=26
    d.text((0,y),"▶  "+verdict,font=f(20,True),fill=col); y+=31
    img.paste(im,(0,y)); d.rectangle([0,y,W-1,y+im.size[1]-1],outline=(205,205,205),width=1)
    bx0=int((ex-crop[0])*s)-10; bx1=W-12
    by0=y+int((ry0-crop[1])*s); by1=y+int((ry1-crop[1])*s)
    d.rectangle([bx0,by0,bx1,by1],outline=col,width=4)
    y+=im.size[1]+38

img.crop((0,0,W,y-10)).save("/tmp/sv10158/EX1-before-after.png")
print("EX1",Image.open("/tmp/sv10158/EX1-before-after.png").size)
