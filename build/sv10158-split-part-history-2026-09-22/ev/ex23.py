from PIL import Image, ImageDraw, ImageFont
F="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"; FB="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def f(s,b=False): return ImageFont.truetype(FB if b else F, s)
GRN=(20,135,60); W=1760
# branch captures: 2200x1200 (C1,C2) and 1600x1000 (H1)
def panel(img,d,y,path,crop,ex,rows,title,sub,verdict,scalehint=None):
    im=Image.open(path).crop(crop); s=W/im.size[0]
    im=im.resize((W,int(im.size[1]*s)),Image.LANCZOS)
    d.text((0,y),title,font=f(23,True),fill=GRN); y+=30
    d.text((0,y),sub,font=f(18),fill=(70,70,70)); y+=26
    d.text((0,y),"▶  "+verdict,font=f(20,True),fill=GRN); y+=31
    img.paste(im,(0,y)); d.rectangle([0,y,W-1,y+im.size[1]-1],outline=(205,205,205),width=1)
    for (r0,r1) in rows:
        d.rectangle([int((ex-crop[0])*s)-10, y+int((r0-crop[1])*s),
                     W-12, y+int((r1-crop[1])*s)],outline=GRN,width=4)
    return y+im.size[1]+38

# EX2 — one entry per inventory part on the split line
img=Image.new("RGB",(W,1400),"white"); d=ImageDraw.Draw(img); y=14
d.text((0,y),"SV-10158  —  one entry per part, each with its own quantity",font=f(33,True),fill=(15,15,15)); y+=45
d.text((0,y),"One line was given TWO different inventory parts — MD668D at quantity 3 and 2208H476 at quantity 1 — and then split.",font=f(18),fill=(90,90,90)); y+=25
d.text((0,y),"Fix branch sv10158, build v26.36.9-58de7bb, 22 September 2026.",font=f(18),fill=(90,90,90)); y+=42
y=panel(img,d,y,"/tmp/sv10158/C1-MD668D-after.png",(420,150,2180,330),958,[(190,220)],
        "Part MD668D",
        "seeded at quantity 3, split onto work order S10158-17582",
        "“Moved 3 from WO # S2-17435 to WO # S10158-17582”  —  one entry, quantity 3")
y=panel(img,d,y,"/tmp/sv10158/C2-2208H476-after.png",(420,150,2180,270),958,[(190,220)],
        "Part 2208H476",
        "seeded at quantity 1, on the same line, split at the same moment",
        "“Moved 1 from WO # S2-17435 to WO # S10158-17582”  —  one entry, quantity 1")
img.crop((0,0,W,y-10)).save("/tmp/sv10158/EX2-one-per-part.png")
print("EX2",Image.open("/tmp/sv10158/EX2-one-per-part.png").size)

# EX3 — the ordinary Move still writes, in the same words
img=Image.new("RGB",(W,900),"white"); d=ImageDraw.Draw(img); y=14
d.text((0,y),"SV-10158  —  the ordinary Move option still works, and reads the same way",font=f(33,True),fill=(15,15,15)); y+=45
d.text((0,y),"A staged part was moved between work orders with the Move option, to check the earlier fix (SV-9304) was not disturbed.",font=f(18),fill=(90,90,90)); y+=25
d.text((0,y),"Fix branch sv10158, build v26.36.9-58de7bb, 22 September 2026.",font=f(18),fill=(90,90,90)); y+=42
y=panel(img,d,y,"/tmp/sv10158/H1-move-history.png",(330,150,1590,290),735,[(190,218)],
        "Part P550848  —  moved, not split",
        "moved from work order S2-17435 to a line on S10158-17581 using the Move option",
        "“Moved 1 from WO # S2-17435 to WO # S10158-17581”  —  the same wording a split now produces")
img.crop((0,0,W,y-10)).save("/tmp/sv10158/EX3-move-regression.png")
print("EX3",Image.open("/tmp/sv10158/EX3-move-regression.png").size)
