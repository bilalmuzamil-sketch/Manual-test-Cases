from PIL import Image, ImageDraw, ImageFont
F="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"; FB="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def f(sz,b=False): return ImageFont.truetype(FB if b else F, sz)
X0,X1,Y0,Y1 = 600, 2130, 128, 248
AVG=(1906-X0, 189-Y0, 2022-X0, 240-Y0)
W=X1-X0; PH=Y1-Y0
panels=[("w2-broken.png","BEFORE  —  PRODUCTION  (build v26.36.9-8d1613f)",
         "part 1237944  ·  $3,896.04 entered, then the part saved again changing only Min",
         "Average Cost has collapsed to  $3.00",(200,30,30)),
        ("x2-branch-still.png","AFTER  —  FIX BRANCH sv9940  (build v26.36.9-e96da48)",
         "part P550848  ·  $3,896.04 entered, then the part saved again changing only Min",
         "Average Cost is still  $3,896.04",(22,140,60))]
img=Image.new("RGB",(W,1150),"white"); d=ImageDraw.Draw(img)
y=14
d.text((0,y),"SV-8447  —  the same action on both builds",font=f(34,True),fill=(15,15,15)); y+=46
d.text((0,y),"Inventory page, Average Cost column.  Captured 22 Sep 2026, viewport 2560x1200, browser zoom 100%.",font=f(19),fill=(90,90,90)); y+=26
d.text((0,y),"Each build has its own data, so the part differs; the action and the entered value are identical.",font=f(19),fill=(90,90,90)); y+=44
for fn,title,sub,verdict,col in panels:
    d.text((0,y),title,font=f(24,True),fill=col); y+=31
    d.text((0,y),sub,font=f(19),fill=(70,70,70)); y+=27
    d.text((0,y),"▶  "+verdict,font=f(21,True),fill=col); y+=30
    img.paste(Image.open("/tmp/sv8447/"+fn).crop((X0,Y0,X1,Y1)),(0,y))
    d.rectangle([0,y,W-1,y+PH-1],outline=(205,205,205),width=1)
    d.rectangle([AVG[0]-4,y+AVG[1]-4,AVG[2]+4,y+AVG[3]+4],outline=col,width=4)
    y+=PH+36
y+=6
d.rectangle([0,y,W-1,y+108],outline=(210,210,210),width=1,fill=(250,250,250))
d.text((16,y+14),"What changed under the covers — the value the screen sends back on that second save:",font=f(20,True),fill=(20,20,20))
d.text((16,y+46),'PRODUCTION      "purchasePrice": "3,896.04"     the formatted text, read up to the comma → stored as 3',font=f(19),fill=(175,25,25))
d.text((16,y+74),'FIX BRANCH        "purchasePrice": 3896.04         the number itself → stored in full',font=f(19),fill=(22,110,50))
img=img.crop((0,0,W,y+122)); img.save("/tmp/sv8447/EX2-before-after.png")
print("wrote EX2", img.size)
