# python3.12 exh12185.py -> ../ev/exh-12185.png (production vs QA branch, duplicate-name New Customer, toasts boxed)
from PIL import Image,ImageDraw,ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; S=1.6
def panel(p,box,title,col,cap):
    im=Image.open(p).convert('RGB').crop((int(620*S),int(100*S),int(1890*S),int(1125*S)))
    d=ImageDraw.Draw(im); x0,y0,x1,y1=[int(v*S) for v in box]; d.rectangle([x0-620*S,y0-100*S,x1-620*S,y1-100*S],outline='#ff9800',width=10)
    W,H=im.size; out=Image.new('RGB',(W,H+260),'white'); out.paste(im,(0,130)); d=ImageDraw.Draw(out)
    d.rectangle([0,0,W,130],fill=col); d.text((30,35),title,font=ImageFont.truetype(F,48),fill='white')
    d.text((30,H+150),cap,font=ImageFont.truetype(F,40),fill='black'); return out
a=panel('prod-1-dup-create.png',(1365,945,1885,1125),'BEFORE - Production v26.45.1','#c62828','Two red messages: "already exists" + "Error creating/updating customer"')
b=panel('branch-1-dup-create.png',(1365,1015,1885,1125),'AFTER - QA branch sv12185','#2e7d32','One red message: "Company with provided name already exists."')
out=Image.new('RGB',(a.width+b.width+40,max(a.height,b.height)),'white'); out.paste(a,(0,0)); out.paste(b,(a.width+40,0))
out=out.resize((out.width//2,out.height//2)); out.save('exh-12185.png'); print(out.size)
