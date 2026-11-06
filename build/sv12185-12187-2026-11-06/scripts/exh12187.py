# python3.12 exh12187.py -> ../ev/exh-12187.png : ticket video frame (before) vs QA branch sv12187 before/after pressing Enter in Qty
from PIL import Image,ImageDraw,ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; R='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
W=2400
def band(im,title,col,cap,boxes=()):
    d=ImageDraw.Draw(im)
    for b in boxes: d.rectangle(b,outline='#ff9800',width=8)
    s=W/im.width; im=im.resize((W,int(im.height*s)))
    out=Image.new('RGB',(W,im.height+200),'white'); out.paste(im,(0,90)); d=ImageDraw.Draw(out)
    d.rectangle([0,0,W,90],fill=col); d.text((25,18),title,font=ImageFont.truetype(F,46),fill='white')
    d.text((25,im.height+110),cap,font=ImageFont.truetype(R,40),fill='black'); return out
v=Image.open('../ev/reporter-video-frame-5s.png').convert('RGB')   # 1440x900
a=v.crop((505,495,1330,560)); a=band(a,'BEFORE - from the ticket video (Mudassir, sv10647)','#c62828','Qty 1 typed and Enter pressed: nothing happens, the row stays open and unsaved.',[(222,14,270,44)])
b=Image.open('../ev/branch-qty-before-enter.png').convert('RGB').crop((int(400*1.6),int(935*1.6),int(1970*1.6),int(1020*1.6)))
b=band(b,'AFTER - QA branch sv12187: Qty 1 typed, about to press Enter','#2e7d32','Part number 84-2005, Description and Qty filled in. Focus is in Qty.',[(int(595*1.6),int(13*1.6),int(675*1.6),int(58*1.6))])
c=Image.open('../ev/branch-qty-after-enter.png').convert('RGB').crop((int(400*1.6),int(935*1.6),int(1970*1.6),int(1125*1.6)))
c=band(c,'AFTER - QA branch sv12187: Enter pressed in Qty','#2e7d32','Saved: "Part added", the part is listed under the line, and a new empty row opens with the cursor in Part number.',[(int(130*1.6),int(13*1.6),int(280*1.6),int(58*1.6)),(int(130*1.6),int(110*1.6),int(600*1.6),int(145*1.6)),(int(975*1.6),int(115*1.6),int(1478*1.6),int(178*1.6))])
out=Image.new('RGB',(W,a.height+b.height+c.height+60),'white'); y=0
for im in (a,b,c): out.paste(im,(0,y)); y+=im.height+30
out=out.resize((W*2//3,out.height*2//3)); out.save('../ev/exh-12187.png'); print(out.size)
