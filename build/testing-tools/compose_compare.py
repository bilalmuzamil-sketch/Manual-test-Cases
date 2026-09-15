#!/usr/bin/env python3
"""Compose ONE picture that shows the old version and the new one, for a regression ticket.

Why one picture and not two. The Head of Product asked for a comparison with the live product, and
asked that it be readable without clicking. Two separate attachments make the reader do the
comparing; one stacked picture does it for them. And because each half is cropped to the search
panel itself - not a whole screen shrunk to fit - the words arrive at their own size.

  python3 build/testing-tools/compose_compare.py \
      --v1 prod-evidence/V1-SV-10002.png --v2 qa-evidence/V2-SV-10002.png \
      --out ticket-images/SV-10002.png \
      --typed "44872-9931" \
      --v1-says "the customer comes back" \
      --v2-says "nothing comes back" \
      --caption "Typing a customer postcode"
"""
import argparse, os
from PIL import Image, ImageDraw, ImageFont

RED=(200,35,45); GREEN=(21,104,60); INK=(20,24,32); MUTED=(93,107,120)
PAPER=(255,255,255); BAND=(246,248,250); LINE=(211,218,225)
PAD=14; GAP=10

def font(sz, bold=False):
    names=(["DejaVuSans-Bold.ttf","LiberationSans-Bold.ttf"] if bold else
           ["DejaVuSans.ttf","LiberationSans-Regular.ttf"])
    for root in ("/usr/share/fonts/truetype/dejavu","/usr/share/fonts/truetype/liberation",
                 "/usr/share/fonts/truetype"):
        for n in names:
            p=os.path.join(root,n)
            if os.path.exists(p):
                try: return ImageFont.truetype(p,sz)
                except Exception: pass
    return ImageFont.load_default()

def wrap(draw,text,f,maxw):
    words=text.split(); lines=[]; cur=""
    for w in words:
        t=(cur+" "+w).strip()
        if draw.textlength(t,font=f)<=maxw: cur=t
        else:
            if cur: lines.append(cur)
            cur=w
    if cur: lines.append(cur)
    return lines

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--v1',required=True); ap.add_argument('--v2',required=True)
    ap.add_argument('--out',required=True)
    ap.add_argument('--typed',required=True)
    ap.add_argument('--v1-says',default='the record comes back')
    ap.add_argument('--v2-says',default='nothing comes back')
    ap.add_argument('--caption',default='')
    a=ap.parse_args()

    a1=Image.open(a.v1).convert('RGB'); a2=Image.open(a.v2).convert('RGB')
    inner=max(a1.width,a2.width)
    inner=min(inner,int(__import__('os').environ.get('MAXW','560')))
    def fit(im):
        if im.width<=inner: return im
        h=int(im.height*inner/im.width); return im.resize((inner,h),Image.LANCZOS)
    a1=fit(a1); a2=fit(a2)
    W=inner+PAD*2

    fh=font(15,True); fs=font(13); fc=font(12)
    probe=Image.new('RGB',(10,10)); d0=ImageDraw.Draw(probe)
    cap_lines=wrap(d0,a.caption,fh,W-PAD*2) if a.caption else []
    typed_line=f'Typed into the search box:  {a.typed}'
    h_head=PAD + (len(cap_lines)*20 if cap_lines else 0) + 22 + 10
    h_sec1 = 24 + a1.height + 24
    h_sec2 = 24 + a2.height + 24
    H=h_head + h_sec1 + GAP + h_sec2 + PAD

    img=Image.new('RGB',(W,H),PAPER); d=ImageDraw.Draw(img)
    y=PAD
    for ln in cap_lines:
        d.text((PAD,y),ln,font=fh,fill=INK); y+=20
    d.text((PAD,y),typed_line,font=fs,fill=MUTED); y+=22
    d.line([(PAD,y),(W-PAD,y)],fill=LINE,width=1); y+=10

    def section(im, label, says, colour, y):
        d.text((PAD,y),label,font=fh,fill=colour); y+=22
        img.paste(im,(PAD,y))
        d.rectangle([PAD-2,y-2,PAD+im.width+1,y+im.height+1],outline=colour,width=2)
        y+=im.height+6
        d.text((PAD,y),says,font=fc,fill=colour); y+=20
        return y

    y=section(a1,'BEFORE  ·  the live product, the version people use today',
              '✔  '+a.v1_says, GREEN, y)
    y+=GAP
    d.line([(PAD,y-GAP//2),(W-PAD,y-GAP//2)],fill=LINE,width=1)
    y=section(a2,'AFTER  ·  the new version on the test branch',
              '✖  '+a.v2_says, RED, y)

    os.makedirs(os.path.dirname(a.out) or '.',exist_ok=True)
    img.save(a.out)
    print(f'{a.out}  {img.width}x{img.height}')

if __name__=='__main__':
    main()
