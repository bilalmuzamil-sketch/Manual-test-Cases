from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; f=ImageFont.truetype(F,34); fs=ImageFont.truetype(F,28)
E='../ev/'
def panel(path,label,color,boxes,cap):
    im=Image.open(E+path).convert('RGB'); d=ImageDraw.Draw(im); k=1.6
    for (x,y,w,h,t) in boxes:
        r=[x*k,y*k,(x+w)*k,(y+h)*k]; d.rectangle(r,outline=color,width=8)
        if t:
            tw=d.textlength(t,font=fs); tx=max(10,min(r[0],im.width-tw-30)); ty=r[1]-56 if r[1]-56>80 else r[3]+12
            d.rectangle([tx-8,ty-6,tx+tw+8,ty+40],fill='white',outline=color,width=3); d.text((tx,ty),t,fill=color,font=fs)
    im=im.resize((im.width//2,im.height//2))
    top=Image.new('RGB',(im.width,70),color); ImageDraw.Draw(top).text((16,16),label,fill='white',font=f)
    bot=Image.new('RGB',(im.width,70),'white'); ImageDraw.Draw(bot).text((16,18),cap,fill='black',font=fs)
    out=Image.new('RGB',(im.width,im.height+140),'white'); out.paste(top,(0,0)); out.paste(im,(0,70)); out.paste(bot,(0,70+im.height)); return out
def pair(a,b,name):
    o=Image.new('RGB',(a.width+b.width+20,max(a.height,b.height)),'#888'); o.paste(a,(0,0)); o.paste(b,(a.width+20,0)); o.save(E+'exhibits/'+name)
R='#c62828'; G='#2e7d32'; B='#1565c0'
a=panel('prod-01-unknown-id.png','BEFORE - production (v26.45.3-fc08f23), 10 Nov 2026',R,[(1375,773,500,340,'2 red "Ooooops! An error occurred" messages')],'A return address that matches no return: the page breaks with errors.')
b=panel('b-02-orgA-unknown-id.png','AFTER - sv12120 (v26.45.3-8f11821), 10 Nov 2026',G,[(1375,773,500,340,'no error messages')],'Same kind of address: no error, nothing is loaded.')
pair(a,b,'01-before-after-unknown-return.png')
c=panel('b-01-orgA-own-return.png','sv12120 - Staging Foothills admin opens its own return',B,[(40,98,320,150,'X101366385:01 / Willoughby Mechanical Services')],'Own return loads normally (vendor, credit memo, items, totals).')
d=panel('b-03-orgB-opens-orgA-return.png','sv12120 - ANOTHER organization opens the same address',G,[(40,98,320,150,'no credit memo, no vendor'),(1690,12,285,48,'ZZAUTOTEST OrgB Shop')],'Same return address in a different organization: nothing from the other shop is shown.')
pair(c,d,'02-own-return-vs-other-organization.png')
