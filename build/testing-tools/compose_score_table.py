#!/usr/bin/env python3
"""Compose: annotated panel screenshot ON TOP, a small score table UNDER it.
The table is the proof a reader cannot get from the panel alone (scores are not on screen)."""
import sys, json, os
from PIL import Image, ImageDraw, ImageFont
INK=(32,33,36); MUTED=(95,99,104); LINE=(218,220,224); BAND=(247,248,250)
RED=(211,47,47); GREEN=(27,126,63); PAPER=(255,255,255)
def F(sz,b=False):
    n="DejaVuSans-Bold.ttf" if b else "DejaVuSans.ttf"
    for d in ("/usr/share/fonts/truetype/dejavu/","/usr/share/fonts/truetype/liberation/"):
        if os.path.exists(d+n): return ImageFont.truetype(d+n,sz)
    return ImageFont.load_default()
def wrap(d,t,f,w):
    out=[];cur=""
    for word in t.split():
        p=(cur+" "+word).strip()
        if d.textlength(p,font=f)<=w: cur=p
        else: out.append(cur); cur=word
    if cur: out.append(cur)
    return out
def build(src,out,cols,rows,caption=None):
    top=Image.open(src).convert("RGB")
    W=top.width
    fh=F(15,True); fb=F(15); fc=F(14)
    pad=14
    # measure
    tmp=Image.new("RGB",(10,10)); d=ImageDraw.Draw(tmp)
    widths=[int(W*c[1]) for c in cols]
    rowlines=[]
    for r in rows:
        cells=[wrap(d,str(v),fb,widths[i]-2*pad) for i,v in enumerate(r[:-1])]
        rowlines.append((cells,r[-1]))
    hh=34
    heights=[max(len(c) for c in cells)*21+18 for cells,_ in rowlines]
    caph=0
    if caption:
        capl=wrap(d,caption,fc,W-2*pad); caph=len(capl)*19+16
    H=top.height+hh+sum(heights)+caph+8
    img=Image.new("RGB",(W,H),PAPER); img.paste(top,(0,0)); dr=ImageDraw.Draw(img)
    y=top.height+4
    dr.rectangle([0,y,W,y+hh],fill=BAND); dr.line([0,y,W,y],fill=LINE)
    x=0
    for i,(name,_) in enumerate(cols):
        dr.text((x+pad,y+9),name,font=fh,fill=INK); x+=widths[i]
        if i<len(cols)-1: dr.line([x,y,x,y+hh+sum(heights)],fill=LINE)
    y+=hh
    for (cells,kind),h in zip(rowlines,heights):
        dr.line([0,y,W,y],fill=LINE)
        col=RED if kind=="bad" else (GREEN if kind=="good" else INK)
        x=0
        for i,lines in enumerate(cells):
            ty=y+9
            for ln in lines:
                dr.text((x+pad,ty),ln,font=fb,fill=col if i==len(cells)-1 else INK); ty+=21
            x+=widths[i]
        y+=h
    dr.line([0,y,W,y],fill=LINE)
    if caption:
        y+=8
        for ln in capl: dr.text((pad,y),ln,font=fc,fill=MUTED); y+=19
    img.save(out); print("wrote",out,img.size)
if __name__=="__main__":
    spec=json.load(open(sys.argv[1])); build(**spec)
