#!/usr/bin/env python3
import sys,json,os
from PIL import Image,ImageDraw,ImageFont
INK=(32,33,36);MUTED=(95,99,104);LINE=(218,220,224);BAND=(247,248,250);RED=(211,47,47);GREEN=(27,126,63)
def F(sz,b=False):
    n="DejaVuSans-Bold.ttf" if b else "DejaVuSans.ttf"
    for d in ("/usr/share/fonts/truetype/dejavu/","/usr/share/fonts/truetype/liberation/"):
        if os.path.exists(d+n): return ImageFont.truetype(d+n,sz)
    return ImageFont.load_default()
def wrap(d,t,f,w):
    out=[];cur=""
    for word in str(t).split():
        p=(cur+" "+word).strip()
        if d.textlength(p,font=f)<=w: cur=p
        else: out.append(cur);cur=word
    if cur: out.append(cur)
    return out or ['']
spec=json.load(open(sys.argv[1]))
W=spec.get('width',1002); pad=14
cols=spec['cols']; rows=spec['rows']
ft=F(19,True); fh=F(15,True); fb=F(15); fc=F(14)
tmp=Image.new("RGB",(10,10)); d=ImageDraw.Draw(tmp)
widths=[int(W*c[1]) for c in cols]
title_lines=wrap(d,spec['title'],ft,W-2*pad)
cap_lines=wrap(d,spec.get('caption',''),fc,W-2*pad) if spec.get('caption') else []
body=[]
for r in rows:
    cells=[wrap(d,v,fb,widths[i]-2*pad) for i,v in enumerate(r[:-1])]
    body.append((cells,r[-1]))
th=len(title_lines)*26+22; hh=36
heights=[max(len(c) for c in cells)*21+18 for cells,_ in body]
caph=len(cap_lines)*19+16 if cap_lines else 0
H=th+hh+sum(heights)+caph+10
img=Image.new("RGB",(W,H),(255,255,255)); dr=ImageDraw.Draw(img)
dr.rectangle([0,0,W,th],fill=BAND); y=12
for l in title_lines: dr.text((pad,y),l,font=ft,fill=INK); y+=26
y=th; dr.line([0,y,W,y],fill=LINE); dr.rectangle([0,y,W,y+hh],fill=(252,252,253))
x=0
for i,(name,_) in enumerate(cols):
    dr.text((x+pad,y+10),name,font=fh,fill=INK); x+=widths[i]
    if i<len(cols)-1: dr.line([x,y,x,y+hh+sum(heights)],fill=LINE)
y+=hh
for (cells,kind),h in zip(body,heights):
    dr.line([0,y,W,y],fill=LINE); col=RED if kind=='bad' else (GREEN if kind=='good' else INK)
    x=0
    for i,lines in enumerate(cells):
        ty=y+9
        for ln in lines: dr.text((x+pad,ty),ln,font=fb,fill=col if i==len(cells)-1 else INK); ty+=21
        x+=widths[i]
    y+=h
dr.line([0,y,W,y],fill=LINE); y+=8
for l in cap_lines: dr.text((pad,y),l,font=fc,fill=MUTED); y+=19
img.save(spec['out']); print('wrote',spec['out'],img.size)
