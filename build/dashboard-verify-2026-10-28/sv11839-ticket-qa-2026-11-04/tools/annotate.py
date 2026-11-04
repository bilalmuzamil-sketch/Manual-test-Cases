#!/usr/bin/env python3
"""Annotate a FAIL screenshot for a non-technical reader: red box(es) around the wrong value(s) and a short red label.
Usage: annotate.py <in.png> <out.png> '<json list of {"box":[x0,y0,x1,y1],"label":"...","at":"right|below|above|left"}>'
Coordinates are in the PNG's own pixels (deviceScaleFactor 2 ⇒ CSS px × 2)."""
import sys, json
from PIL import Image, ImageDraw, ImageFont
src, dst, spec = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
im = Image.open(src).convert('RGB'); d = ImageDraw.Draw(im)
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 30)
except OSError:
    font = ImageFont.load_default()
RED = (220, 20, 20)
for s in spec:
    x0, y0, x1, y1 = s['box']; d.rectangle([x0, y0, x1, y1], outline=RED, width=6)
    lines = s['label'].split('\n'); w = max(d.textlength(l, font=font) for l in lines) + 24; h = 38 * len(lines) + 16
    at = s.get('at', 'right')
    lx, ly = {'right': (x1 + 14, y0), 'left': (x0 - 14 - w, y0), 'below': (x0, y1 + 12), 'above': (x0, y0 - 12 - h)}[at]
    lx = max(4, min(lx, im.width - w - 4)); ly = max(4, min(ly, im.height - h - 4))
    d.rectangle([lx, ly, lx + w, ly + h], fill=(255, 255, 255), outline=RED, width=4)
    for i, l in enumerate(lines):
        d.text((lx + 12, ly + 8 + 38 * i), l, fill=RED, font=font)
im.save(dst); print('wrote', dst, im.size)
