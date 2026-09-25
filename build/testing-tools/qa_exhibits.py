"""Reusable annotated-exhibit builders for QA evidence (Standing Rules 64/73/90).

Boxes, arrows and captions are drawn ON the pixels at real coordinates — a coloured
header panel around a crop is NOT annotation (Rule 90).

    from qa_exhibits import panel, strip, stack, words
    ws = words(img, tooltip_box)          # pixel word boundaries, for boxing one word
    a = panel('before.png', crop, 'BEFORE — production', 'build v... · date',
              word=(x0,x1), tipy=(y0,y1), item=(x,y,w,h), c=RED,
              word_note='says "declined"', item_note='the greyed-out item')
    stack([a,b], 'Only one word changed.').save('exhibit.png')
"""
from PIL import Image, ImageDraw, ImageFont
import math
try:
    import numpy as np
except ImportError:
    np = None

F = '/usr/share/fonts/truetype/dejavu/'
RED=(205,20,20); GRN=(0,130,55); BLU=(21,101,192); BLK=(25,25,25); GREY=(96,102,110)
BORDER=(214,219,226); BANDBG=(243,246,250)

def fnt(size, bold=False):
    return ImageFont.truetype(F + ('DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf'), size)

def wrap(d, text, f, maxw):
    out, cur = [], ''
    for w in text.split():
        c = (cur + ' ' + w).strip()
        if d.textlength(c, font=f) <= maxw: cur = c
        else: out.append(cur); cur = w
    if cur: out.append(cur)
    return out

def arrow(d, x1, y1, x2, y2, c, w=3):
    d.line([x1,y1,x2,y2], fill=c, width=w)
    a = math.atan2(y2-y1, x2-x1); L = 12
    for s in (2.6, -2.6):
        d.line([x2, y2, x2+L*math.cos(a+s), y2+L*math.sin(a+s)], fill=c, width=w)

def tag(d, x, y, text, c, size=17, anchor='lm'):
    f = fnt(size, True); bb = d.textbbox((x,y), text, font=f, anchor=anchor)
    d.rectangle([bb[0]-9, bb[1]-7, bb[2]+9, bb[3]+7], fill=(255,255,255), outline=c, width=2)
    d.text((x,y), text, font=f, fill=c, anchor=anchor)
    return bb

def words(img, box, gap=4, thr=45):
    """Pixel word boundaries inside a light-on-dark tooltip, so a box lands on the real glyphs
    instead of an estimate. Returns [(x0,x1), ...] in image coordinates."""
    if np is None: raise RuntimeError('pip install numpy')
    x,y,w,h = box
    a = np.array(img.convert('L').crop((x,y,x+w,y+h)), dtype=int)
    ink = (np.abs(a - np.median(a)) > thr).any(axis=0)
    runs, s = [], None
    for i,v in enumerate(ink):
        if v and s is None: s = i
        if not v and s is not None: runs.append([s,i]); s = None
    if s is not None: runs.append([s, len(ink)])
    merged = []
    for r in runs:
        if merged and r[0]-merged[-1][1] < gap: merged[-1][1] = r[1]
        else: merged.append(r)
    return [(x+a0, x+a1) for a0,a1 in merged]

def panel(src, crop, title, sub, *, word=None, tipy=None, item=None, c=BLU,
          word_note=None, item_note=None, gutter=340, band=52):
    """One labelled screenshot panel. `word`+`tipy` box a single word (callout drops from a
    blank band above, so the arrow never crosses the text being evidenced); `item` boxes the
    control, called out in a right-hand gutter."""
    im = Image.open(src).convert('RGB'); cx0, cy0, cx1, cy1 = crop
    shot = im.crop(crop); HDR = 78
    band = band if word_note else 12
    W = shot.width + (gutter if item_note else 16)
    out = Image.new('RGB', (W, HDR+band+shot.height+12), (255,255,255))
    d = ImageDraw.Draw(out)
    d.rectangle([0,0,W,HDR-8], fill=BANDBG); d.line([0,HDR-8,W,HDR-8], fill=BORDER, width=2)
    d.text((16,11), title, font=fnt(25,True), fill=BLK)
    d.text((16,46), sub,  font=fnt(14), fill=GREY)
    SY = HDR + band; out.paste(shot,(0,SY))
    d.rectangle([0,SY,shot.width,SY+shot.height], outline=BORDER, width=1)
    off = lambda x,y: (x-cx0, y-cy0+SY)

    if word and tipy:
        a = off(word[0],tipy[0]); bpt = off(word[1],tipy[1])
        d.rectangle([a[0]-3,a[1]-3,bpt[0]+3,bpt[1]+3], outline=c, width=3)
        if word_note:
            mid=(a[0]+bpt[0])//2; f=fnt(18,True); tw=d.textlength(word_note,font=f)
            lx=max(8,min(mid-tw/2, shot.width-tw-12))
            bb=d.textbbox((lx,HDR+6), word_note, font=f)
            d.rectangle([bb[0]-9,bb[1]-6,bb[2]+9,bb[3]+6], fill=(255,255,255), outline=c, width=2)
            d.text((lx,HDR+6), word_note, font=f, fill=c)
            arrow(d, mid, bb[3]+10, mid, a[1]-6, c)
    if item:
        ia=off(item[0],item[1]); ib=off(item[0]+item[2], item[1]+item[3])
        d.rectangle([ia[0]-2,ia[1]-2,ib[0]+2,ib[1]+2], outline=BLU, width=3)
        if item_note:
            gx=shot.width+22; y2=ia[1]+(ib[1]-ia[1])//2
            tag(d, gx+14, y2, item_note, BLU, 15); arrow(d, gx+8, y2, ib[0]+8, y2, BLU)
    return out

def strip(src, tip, item, title, sub, note, c=BLU, gutter=300):
    """Tight crop around one tooltip + its control, whole tooltip boxed — for
    'this message is unchanged' exhibits."""
    im = Image.open(src).convert('RGB')
    x0 = max(0, min(tip[0], item[0]) - 40); x1 = max(tip[0]+tip[2], item[0]+item[2]) + 40
    y0 = min(tip[1], item[1]) - 16;         y1 = max(tip[1]+tip[3], item[1]+item[3]) + 16
    return panel(src, (x0,y0,x1,y1), title, sub, word=(tip[0],tip[0]+tip[2]),
                 tipy=(tip[1],tip[1]+tip[3]), item=item, c=c, word_note=note, gutter=gutter)

def stack(panels, footer=None, gap=10):
    W = max(p.width for p in panels)
    foot = 62 if footer else 0
    H = sum(p.height for p in panels) + gap*(len(panels)-1) + foot + 12
    out = Image.new('RGB',(W,H),(255,255,255)); y=0
    for p in panels: out.paste(p,(0,y)); y += p.height + gap
    if footer:
        d=ImageDraw.Draw(out); f=fnt(16,True); yy=y+10
        for ln in wrap(d, footer, f, W-32): d.text((16,yy), ln, font=f, fill=BLK); yy+=23
    return out
