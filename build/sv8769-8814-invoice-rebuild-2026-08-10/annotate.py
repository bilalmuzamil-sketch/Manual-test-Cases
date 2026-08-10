from PIL import Image, ImageDraw, ImageFont
import sys, json
F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
FR='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def ann(src, dst, boxes, caption, banner=None, bannercol=(200,30,30)):
    im=Image.open(src).convert('RGB')
    W,H=im.size
    pad=132 if caption else 0
    top=56 if banner else 0
    out=Image.new('RGB',(W,H+pad+top),(255,255,255))
    out.paste(im,(0,top))
    d=ImageDraw.Draw(out)
    f=ImageFont.truetype(F,20); fr=ImageFont.truetype(FR,19); fb=ImageFont.truetype(F,25)
    if banner:
        d.rectangle([0,0,W,top],fill=bannercol)
        d.text((16,14),banner,font=fb,fill=(255,255,255))
    for b in boxes:
        x,y,w,h=b['x'],b['y']+top,b['w'],b['h']
        col=tuple(b.get('color',(220,20,20)))
        d.rectangle([x-4,y-4,x+w+4,y+h+4],outline=col,width=4)
        lbl=b.get('label')
        if lbl:
            tw=d.textlength(lbl,font=f)
            lx=b.get('lx', x-tw-24); ly=b.get('ly', y+h//2-16)
            lx=max(6,min(lx,W-tw-16))
            d.rectangle([lx-8,ly-6,lx+tw+8,ly+30],fill=(255,255,255),outline=col,width=3)
            d.text((lx,ly),lbl,font=f,fill=col)
            d.line([lx+tw+8,ly+12,x-6,y+h//2],fill=col,width=4)
    if caption:
        d.rectangle([0,H+top,W,H+top+pad],fill=(248,248,248))
        yy=H+top+12
        for line in caption.split('\n'):
            d.text((18,yy),line,font=fr,fill=(20,20,20)); yy+=26
    out.save(dst)
    print('wrote',dst,out.size)
if __name__=='__main__':
    spec=json.load(open(sys.argv[1]))
    for s in spec: ann(s['src'],s['dst'],s['boxes'],s.get('caption'),s.get('banner'),tuple(s.get('bannercol',(200,30,30))))
