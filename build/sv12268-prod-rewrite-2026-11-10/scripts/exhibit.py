from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; f=ImageFont.truetype(F,40); fs=ImageFont.truetype(F,30)
E='../ev/'; R='#c62828'; B='#1565c0'
def panel(path,label,color,boxes,cap,crop=900):
    im=Image.open(E+path).convert('RGB'); k=1.6; im=im.crop((0,0,im.width,int(crop*k))); d=ImageDraw.Draw(im)
    for bx in boxes:
        x,y,w,h,t,c=bx[:6]; above=len(bx)>6 and bx[6]
        r=[x*k,y*k,(x+w)*k,(y+h)*k]; d.rectangle(r,outline=c,width=8)
        tw=d.textlength(t,font=fs); tx=max(10,min(r[0],im.width-tw-30)); ty=r[1]-56 if above else r[3]+12
        d.rectangle([tx-8,ty-6,tx+tw+8,ty+42],fill='white',outline=c,width=3); d.text((tx,ty),t,fill=c,font=fs)
    im=im.resize((im.width//2,im.height//2))
    top=Image.new('RGB',(im.width,72),color); ImageDraw.Draw(top).text((16,14),label,fill='white',font=f)
    bot=Image.new('RGB',(im.width,72),'white'); ImageDraw.Draw(bot).text((16,18),cap,fill='black',font=fs)
    out=Image.new('RGB',(im.width,im.height+144),'white'); out.paste(top,(0,0)); out.paste(im,(0,72)); out.paste(bot,(0,72+im.height)); return out
a=panel('pay-P1-1.png','1. Production: pay bill ZZ12268P1 with 100 in Amount to credit',B,[(1290,664,442,56,'100 typed in Amount to credit',B,True),(1505,730,228,36,'window: Payment amount $110.00',B)],'The New Vendor Payment window adds the 100 and shows $110.00.')
b=panel('P1-payments.png','2. Production: Payments tab after Make Payment',R,[(1540,248,180,34,'saved as $10.00, not $110.00',R)],'Only the $10.00 bill payment is saved.',crop=500)
c=panel('P1-unpaid.png','3. Production: Unpaid Invoices tab afterwards',R,[(1250,104,180,42,'Balance $10.00 = only bill ZZ12268P2',R),(498,236,1465,58,'no $100.00 credit anywhere',R)],'No $100.00 credit was created for the vendor.',crop=500)
W=max(a.width,b.width,c.width); out=Image.new('RGB',(W,a.height+b.height+c.height+40),'#888'); y=0
for p in (a,b,c): out.paste(p,(0,y)); y+=p.height+20
out.save(E+'01-production-amount-to-credit-lost.png'); print(out.size)
