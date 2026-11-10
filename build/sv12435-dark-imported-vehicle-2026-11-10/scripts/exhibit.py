from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; f=ImageFont.truetype(F,30); fs=ImageFont.truetype(F,24)
E='../ev/'; R='#c62828'; G='#2e7d32'
def panel(env,label,color,box,tag,cap):
    im=Image.open(E+env+'/imported-dark-strip.png').convert('RGB'); k=2; d=ImageDraw.Draw(im)
    x,y,w,h=box; r=[x*k-10,y*k-10,(x+w)*k+10,(y+h)*k+10]; d.rectangle(r,outline=color,width=8)
    tw=d.textlength(tag,font=fs); ty=r[3]+14; d.rectangle([r[0],ty-6,r[0]+tw+16,ty+40],fill='white',outline=color,width=3); d.text((r[0]+8,ty),tag,fill=color,font=fs)
    im=im.crop((int(x*k-150),int(y*k-420),int((x+w)*k+150),int((y+h)*k+330))); im=im.resize((im.width//2,im.height//2))
    top=Image.new('RGB',(im.width,64),color); ImageDraw.Draw(top).text((14,12),label,fill='white',font=f)
    bot=Image.new('RGB',(im.width,64),'white'); ImageDraw.Draw(bot).text((14,16),cap,fill='black',font=fs)
    o=Image.new('RGB',(im.width,im.height+128),'white'); o.paste(top,(0,0)); o.paste(im,(0,64)); o.paste(bot,(0,64+im.height)); return o
import json
pb=json.load(open(E+'prod/dark.json'))['m2_dark']['box']; bb=json.load(open(E+'branch/dark.json'))['m2_dark']['box']
a=panel('prod','BEFORE: production, dark mode',R,pb,'vehicle details invisible (white on white)','ZZ9818-P, build v26.45.3-fc08f23: strip blank')
b=panel('branch','AFTER: QA branch sv12435, dark mode',G,bb,'vehicle details readable (black)','ZZ12435-INV1, build v26.45.3-8f11821: all show')
W=a.width+b.width+20; o=Image.new('RGB',(W,max(a.height,b.height)),'#888'); o.paste(a,(0,0)); o.paste(b,(a.width+20,0)); o.save(E+'01-before-after-dark-mode.png'); print(o.size)
