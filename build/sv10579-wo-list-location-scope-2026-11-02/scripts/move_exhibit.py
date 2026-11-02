from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda n,b=False: ImageFont.truetype(FB if b else F,n)
RED=(200,40,40); BLU=(30,80,170)
im=Image.open('ev/branch/move-dialog-search-17581.png').convert('RGB')
im=im.crop((0,0,1900,690)); out=Image.new('RGB',(1900,690+200),'white'); out.paste(im,(0,0))
d=ImageDraw.Draw(out)
d.rectangle((1642,6,1880,48),outline=BLU,width=4); d.text((1260,58),"You are at Staging Lethbridge - 4310",font=f(20,True),fill=BLU)
d.rectangle((26,95,330,125),outline=BLU,width=3); 
# search box with typed 17581 and the only result
d.rectangle((668,494,1232,538),outline=RED,width=4); d.rectangle((668,540,1232,584),outline=RED,width=4)
y=700
for i,l in enumerate(["Blue boxes: you are at Staging Lethbridge - 4310, on S10579-17583 (a Lethbridge work order). Lines tab -> the part's  ⋮  menu -> Move",
  "-> 'Move part to line:' -> Work Order box, typed 17581.",
  "17581 is a Heavy Duty work order. The only result is this work order itself (S10579-17583), so a part cannot be",
  "moved to a work order at another location. Control: typing 17570 (a Lethbridge work order) finds S3-17570.",
  "QA branch sv10579, build v26.43.5-e516d33, 2 Nov 2026."]):
    d.text((30,y+i*32),l,font=f(21,i==2),fill=RED if i<4 else (90,90,90))
out.save('ev/move-dialog-same-location-only.png'); print(out.size)
