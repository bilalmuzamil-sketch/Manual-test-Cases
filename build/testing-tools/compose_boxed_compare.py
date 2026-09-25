#!/usr/bin/env python3
"""Compose a two-state annotated picture from MEASURED element boxes (Standing Rule 116).

Why this exists. An annotated picture whose outlines sit over empty space is worse than no picture:
the reader stops trusting the whole ticket. That happened on 2026-09-25 because the coordinates were
worked out by hand from remembered page positions. The cure is to never do that - the probe asks the
browser for each element's box in the same run as the screenshot, and this composer maps them.

Two rules it enforces:
  * boxes come from a measured {x,y,w,h} in PAGE coordinates plus the clip and scale used for the
    capture, so the mapping is arithmetic the probe already proved, not a guess;
  * number badges never collide - a badge whose gutter slot is taken is drawn on its own box instead.
"""
import os, json
from PIL import Image, ImageDraw, ImageFont

INK=(20,24,32); RED=(205,32,44); GREEN=(20,110,64)
BAND=(246,248,250); LINE=(205,213,222); PAPER=(255,255,255)
LEFTPAD=64

def font(sz, bold=False):
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf"%("-Bold" if bold else ""),
              "/usr/share/fonts/truetype/liberation/LiberationSans-%s.ttf"%("Bold" if bold else "Regular")]:
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()

def mapbox(b, clip, scale, pad=4):
    return (int((b['x']-clip['x'])*scale)-pad, int((b['y']-clip['y'])*scale)-pad,
            int((b['x']+b['w']-clip['x'])*scale)+pad, int((b['y']+b['h']-clip['y'])*scale)+pad)

def _badge(d, cx, cy, n, colour, r=24):
    d.ellipse([cx-r, cy-r, cx+r, cy+r], fill=colour)
    f = font(int(r*1.55), True)
    w = d.textlength(str(n), font=f)
    d.text((cx-w/2, cy-r*0.92), str(n), font=f, fill=PAPER)

def panel(path, banner, boxes, start=1):
    """boxes: [((x0,y0,x1,y1), colour, label), ...] in the crop's own pixels."""
    im = Image.open(path).convert('RGB')
    W = im.width + LEFTPAD; BH = 80; NH = 18 + 58*len(boxes)
    out = Image.new('RGB', (W, BH+im.height+NH), PAPER); d = ImageDraw.Draw(out)
    d.rectangle([0,0,W,BH], fill=BAND); d.line([0,BH,W,BH], fill=LINE, width=2)
    d.text((28,22), banner, font=font(40, True), fill=INK)
    out.paste(im, (LEFTPAD, BH))
    used = []                      # gutter slots already taken, so two badges never overlap
    for i,(rect,colour,_) in enumerate(boxes):
        n = start+i
        x0,y0,x1,y1 = rect
        d.rectangle([x0+LEFTPAD, y0+BH, x1+LEFTPAD, y1+BH], outline=colour, width=6)
        cy = BH + (y0+y1)//2
        if any(abs(cy-u) < 56 for u in used):
            # the gutter slot at this height is taken - put the badge on the box's own corner
            _badge(d, x0+LEFTPAD, y0+BH, n, colour, r=22)
        else:
            _badge(d, 34, cy, n, colour); used.append(cy)
    y = BH + im.height + 12
    for i,(_,colour,label) in enumerate(boxes):
        _badge(d, 34, y+30, start+i, colour, r=18)
        d.text((70, y+12), label, font=font(34), fill=colour)
        y += 58
    d.rectangle([0,0,W-1,out.height-1], outline=LINE, width=2)
    return out

def stack(title, panels, out_path):
    GAP = 30
    W = max(p.width for p in panels)
    H = 92 + sum(p.height for p in panels) + GAP*(len(panels)-1)
    out = Image.new('RGB', (W,H), PAPER); d = ImageDraw.Draw(out)
    d.text((28,26), title, font=font(36, True), fill=INK)
    y = 92
    for p in panels:
        out.paste(p, (0,y)); y += p.height + GAP
    out.save(out_path)
    return out.size
