from PIL import Image, ImageDraw, ImageFont
F="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"; FB="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def f(sz,b=False): return ImageFont.truetype(FB if b else F, sz)
X0,X1,Y0,Y1 = 600, 2130, 128, 248
AVG=(1906-X0, 189-Y0, 2022-X0, 240-Y0)
W=X1-X0; PH=Y1-Y0
panels=[("w1-correct.png","BEFORE  —  the cost was entered and saved correctly",
         "Average Cost reads $3,896.04, the vendor-invoice cost",(22,140,60)),
        ("w2-broken.png","AFTER  —  the part was saved again, changing ONLY the Min value",
         "Average Cost has collapsed to $3.00  —  nobody touched the cost",(200,30,30))]
img=Image.new("RGB",(W,1000),"white"); d=ImageDraw.Draw(img)
y=14
d.text((0,y),"SV-8447  —  Inventory page, Average Cost",font=f(34,True),fill=(15,15,15)); y+=44
d.text((0,y),"PRODUCTION  app.shopview.com   build v26.36.9-8d1613f   captured 22 Sep 2026   viewport 2560x1200, browser zoom 100%",font=f(19),fill=(90,90,90)); y+=26
d.text((0,y),"Same part (1237944 / A158), same screen, two consecutive states.",font=f(19),fill=(90,90,90)); y+=40
mid=[]
for i,(fn,title,sub,col) in enumerate(panels):
    d.text((0,y),title,font=f(23,True),fill=col); y+=30
    d.text((0,y),sub,font=f(19),fill=(70,70,70)); y+=26
    img.paste(Image.open("/tmp/sv8447/"+fn).crop((X0,Y0,X1,Y1)),(0,y))
    d.rectangle([0,y,W-1,y+PH-1],outline=(205,205,205),width=1)
    d.rectangle([AVG[0]-4,y+AVG[1]-4,AVG[2]+4,y+AVG[3]+4],outline=col,width=4)
    y+=PH
    if i==0:
        a0=y+6
        d.text((0,y+16),"only the Min value was changed in between   →",font=f(21,True),fill=(120,120,120))
        d.line([(AVG[0]+56,a0),(AVG[0]+56,a0+48)],fill=(120,120,120),width=3)
        d.polygon([(AVG[0]+56,a0+58),(AVG[0]+47,a0+44),(AVG[0]+65,a0+44)],fill=(120,120,120))
        y+=72
y+=30
d.rectangle([0,y,W-1,y+196],outline=(210,210,210),width=1,fill=(250,250,250))
d.text((16,y+14),"What the screen sent to the server on each save:",font=f(20,True),fill=(20,20,20))
d.text((16,y+46),'save 1  (the cost was typed)              "purchasePrice": 3896.04          a number  —  stored correctly',font=f(19),fill=(22,110,50))
d.text((16,y+74),'save 2  (only Min was changed)      "purchasePrice": "3,896.04"     the formatted text  —  read up to the comma, becomes 3',font=f(19),fill=(175,25,25))
d.text((16,y+110),"This is the customer's report exactly: the receipt and part history keep $3,896.04 while the Inventory page shows $3.00.",font=f(19),fill=(40,40,40))
d.text((16,y+138),"It only happens at $1,000 and above, because only then does the displayed text carry a thousands separator — which is why it",font=f(19),fill=(40,40,40))
d.text((16,y+166),"could never be reproduced by typing a cost and checking it straight away.",font=f(19),fill=(40,40,40))
img=img.crop((0,0,W,y+210)); img.save("/tmp/sv8447/EX1-production-before.png")
print("wrote EX1", img.size)
