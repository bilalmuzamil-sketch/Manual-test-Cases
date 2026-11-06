#!/usr/bin/env python3
"""Numbered red boxes + a white legend strip (labels never cover data). Usage:
ann.py out.png '<json: [{"src":png,"crop":[x0,y0,x1,y1],"boxes":[[x0,y0,x1,y1,n],...]}...]>' '<json legend list>'
Box coords are in the SOURCE png's pixels; panels are scaled to 1600 px wide and stacked."""
import sys, json
from PIL import Image, ImageDraw, ImageFont
out, panels, legend = sys.argv[1], json.loads(sys.argv[2]), json.loads(sys.argv[3])
F = lambda s: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', s)
RED = (215, 20, 20); W = 1600; ims = []
for p in panels:
    im = Image.open(p['src']).convert('RGB'); x0, y0, x1, y1 = p.get('crop', [0, 0, im.width, im.height]); d = ImageDraw.Draw(im)
    for b in p['boxes']:
        d.rectangle(b[:4], outline=RED, width=8); n = str(b[4]); r = 30
        cx, cy = max(b[0] - 10, x0 + r), max(b[1] - 10, y0 + r); d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=RED); d.text((cx, cy), n, fill='white', font=F(36), anchor='mm')
    im = im.crop((x0, y0, x1, y1)); im = im.resize((W, int(im.height * W / im.width))); ims.append(im)
font = F(24); lines = []
dd = ImageDraw.Draw(Image.new('RGB', (10, 10)))
for i, t in enumerate(legend, 1):
    words, cur = t.split(), ''
    first = True
    for w in words:
        test = (cur + ' ' + w).strip()
        if dd.textlength(test, font=font) > W - 110: lines.append((i if first else None, cur)); first = False; cur = w
        else: cur = test
    lines.append((i if first else None, cur))
H = 30 + 38 * len(lines) + 20; strip = Image.new('RGB', (W, H), 'white'); d = ImageDraw.Draw(strip); y = 25
for n, t in lines:
    if n: d.ellipse([20, y - 2, 52, y + 30], fill=RED); d.text((36, y + 14), str(n), fill='white', font=F(20), anchor='mm')
    d.text((70, y), t, fill=(30, 30, 30), font=font); y += 38
total = sum(i.height for i in ims) + H + 12 * len(ims); c = Image.new('RGB', (W, total), (200, 200, 200)); y = 0
for i in ims: c.paste(i, (0, y)); y += i.height + 12
c.paste(strip, (0, y)); c.save(out); print('wrote', out, c.size)
