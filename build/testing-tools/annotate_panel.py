#!/usr/bin/env python3
"""Mark up a cropped search-panel screenshot the way the house style does it: a red box round the
exact thing being pointed at, a numbered disc on the box, and a numbered legend underneath.

A bare screenshot is not an annotated one (skill 06, evidence-bar item 2). The comparison pictures
built on 15 September had framing labels round each half but nothing inside them, so a reader still
had to work out where to look.

  python3 annotate_panel.py --in crop.png --out marked.png \
      --note "12,62,What was typed" --note "64,112,The count says the record is there" ...

Each --note is  y0,y1,text  in the cropped image's own pixels. The box spans the panel's width.
"""
import argparse, os
from PIL import Image, ImageDraw, ImageFont

RED=(200,35,45); INK=(20,24,32); PAPER=(255,255,255)
PAD=10; DISC=19

def font(sz,bold=False):
    names=(["DejaVuSans-Bold.ttf"] if bold else ["DejaVuSans.ttf"])
    for root in ("/usr/share/fonts/truetype/dejavu","/usr/share/fonts/truetype/liberation","/usr/share/fonts/truetype"):
        for n in names:
            p=os.path.join(root,n)
            if os.path.exists(p):
                try: return ImageFont.truetype(p,sz)
                except Exception: pass
    return ImageFont.load_default()

def wrap(d,text,f,maxw):
    out=[]; cur=""
    for w in text.split():
        t=(cur+" "+w).strip()
        if d.textlength(t,font=f)<=maxw: cur=t
        else:
            if cur: out.append(cur)
            cur=w
    if cur: out.append(cur)
    return out

def annotate(src, notes, colour=RED):
    """notes = [(y0,y1,text)]. Returns a new image: the crop with boxes and discs, legend beneath."""
    im=Image.open(src).convert('RGB')
    fl=font(12); fd=font(11,True)
    probe=ImageDraw.Draw(Image.new('RGB',(10,10)))
    W=im.width+DISC//2+2
    legend=[]
    for i,(y0,y1,text) in enumerate(notes,1):
        legend.append((i, wrap(probe, text, fl, W-PAD-22)))
    lh=sum(len(ls)*15 for _,ls in legend)+8
    out=Image.new('RGB',(W, im.height+lh+6), PAPER)
    out.paste(im,(DISC//2+2,0))
    d=ImageDraw.Draw(out)
    off=DISC//2+2
    for i,(y0,y1,_) in enumerate(notes,1):
        d.rounded_rectangle([off+3, y0, off+im.width-4, y1], radius=5, outline=colour, width=2)
        cx, cy = off, (y0+y1)//2
        d.ellipse([cx-DISC//2, cy-DISC//2, cx+DISC//2, cy+DISC//2], fill=colour)
        t=str(i); tw=d.textlength(t,font=fd)
        d.text((cx-tw/2, cy-7), t, font=fd, fill=PAPER)
    y=im.height+6
    for i,ls in legend:
        d.ellipse([PAD-2, y+1, PAD+13, y+14], fill=colour)
        t=str(i); tw=d.textlength(t,font=fd)
        d.text((PAD+5-tw/2, y+2), t, font=fd, fill=PAPER)
        for j,ln in enumerate(ls):
            d.text((PAD+20, y+1+j*15), ln, font=fl, fill=INK)
        y+=len(ls)*15
    return out

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--in',dest='src',required=True); ap.add_argument('--out',required=True)
    ap.add_argument('--note',action='append',default=[])
    a=ap.parse_args()
    notes=[]
    for n in a.note:
        y0,y1,text=n.split(',',2)
        notes.append((int(y0),int(y1),text))
    img=annotate(a.src,notes)
    os.makedirs(os.path.dirname(a.out) or '.',exist_ok=True)
    img.save(a.out); print(a.out, f'{img.width}x{img.height}')

if __name__=='__main__': main()
