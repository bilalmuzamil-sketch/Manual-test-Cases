from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda n,b=False: ImageFont.truetype(FB if b else F,n)
G=(30,130,60)
im=Image.open('ev/branch/waiting-click-S10579-17582.png').convert('RGB').crop((0,0,1900,560))
out=Image.new('RGB',(1900,560+130),'white'); out.paste(im,(0,0)); d=ImageDraw.Draw(out)
for r in [(1642,6,1880,48),(90,98,360,126),(60,232,195,274)]: d.rectangle(r,outline=G,width=4)
for i,l in enumerate(["After clicking '1 Part Waiting' on S10579-17582 in the Work Orders list (Staging Heavy Duty - 9919):",
 "it opens Purchase Order S10579-17582, whose Work Order Number is S10579-17582 - the work order's own Heavy Duty order.",
 "QA branch sv10579, build v26.43.5-e516d33, 2 Nov 2026. S10579-17585 behaves the same (opens its own order)."]):
    d.text((30,575+i*34),l,font=f(21,i==1),fill=G if i<2 else (90,90,90))
out.save('ev/waiting-link-own-order.png'); print(out.size)
