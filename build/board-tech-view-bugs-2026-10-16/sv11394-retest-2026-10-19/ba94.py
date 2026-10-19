# SV-11394 before/after on the same work order S2-33692.
# BEFORE = our 16 Oct capture on build v26.40.19-edc8195 (attachments 62455 panel 2 + 62456 top close-up)
# AFTER  = 19 Oct capture on build v26.40.19-31ad1e1 (ba94cap.mjs), same card, same window 1440x900, zoom 100%
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'
fb=ImageFont.truetype(F%'-Bold',30); fs=ImageFont.truetype(F%'',24); fz=ImageFont.truetype(F%'-Bold',22)
before=Image.open('ev/before-62455.png').convert('RGB').crop((650,150,1270,620))
after=Image.open('ev/ba94-hover.png').convert('RGB')
zb=Image.open('ev/before-edge-62456.png').convert('RGB').crop((0,70,1610,215))
ea=Image.open('ev/ba94-hover-edge.png').convert('RGB')   # card bottom edge +-24 css px at 2x
za=ea.crop((0,0,ea.width,ea.height)).resize((1610,int(ea.height*1610/ea.width)),Image.LANCZOS)
zw=900
zb=zb.resize((zw,int(zb.height*zw/zb.width))); za=za.resize((zw,int(za.height*zw/za.width)))
H=max(before.height,after.height); top=150; zh=max(zb.height,za.height)
img=Image.new('RGB',(1960,top+H+70+zh+130),'white'); d=ImageDraw.Draw(img)
cols=[(0,'BEFORE the fix','16 October 2026, staging build v26.40.19-edc8195','#c62828',before,zb,
       'Pointer on the card: the border turns darker, but there is no shadow under the card.'),
      (1000,'AFTER the fix','19 October 2026, staging build v26.40.19-31ad1e1','#2e7d32',after,za,
       'Pointer on the card: the border turns darker and a soft shadow shows under the card.')]
for x,t,s,c,im,z,cap in cols:
    d.rectangle((x,0,x+960,top-12),fill=c); d.text((x+24,20),t,font=fb,fill='white'); d.text((x+24,70),s,font=fs,fill='white')
    img.paste(im,(x+(960-im.width)//2,top))
    y2=top+H+70; d.text((x+30,y2-34),"Close-up of the card's bottom edge",font=fz,fill=c)
    img.paste(z,(x+30,y2)); d.rectangle((x+30,y2,x+30+z.width,y2+z.height),outline=c,width=4)
    words=cap.split(); line=''; yy=y2+zh+18
    for w in words:
        if d.textlength(line+' '+w,font=fs)>900: d.text((x+30,yy),line,font=fs,fill='black'); yy+=32; line=w
        else: line=(line+' '+w).strip()
    d.text((x+30,yy),line,font=fs,fill='black')
ox=1000+(960-after.width)//2   # box under the AFTER card: card bottom is 20 css px above clip bottom (=40 px at 2x)
d.rectangle((ox+30,top+after.height-46,ox+after.width-30,top+after.height-4),outline='#2e7d32',width=4)
img.save('ev/sv11394-01-before-after.png'); print(img.size)
