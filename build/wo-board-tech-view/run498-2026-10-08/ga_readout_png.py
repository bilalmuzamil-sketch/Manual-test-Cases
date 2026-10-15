#!/usr/bin/env python3
"""15 Oct 2026 (Rule 130) — analytics tests have no screen to photograph: their result is what the browser SENDS to Google
Analytics. This renders the captured events of one test (from analytics-batch.json) as a labelled picture, one block per
step, so the result carries honest evidence. Usage: ga_readout_png.py <analytics-batch.json> <C-id> <out.png> <title>"""
import json, sys, textwrap
from PIL import Image, ImageDraw, ImageFont
src, cid, out, title = sys.argv[1:5]
d = json.load(open(src))[cid]
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FM = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
fT, fH, fL = ImageFont.truetype(F, 30), ImageFont.truetype(F, 22), ImageFont.truetype(FM, 19)
lines = []
def add(label, val):
    if isinstance(val, list):
        lines.append(('h', f'{label} — {len(val)} event(s)'))
        for x in val[:40]: lines.append(('l', '  ' + (x if isinstance(x, str) else json.dumps(x))))
        if len(val) > 40: lines.append(('l', f'  … and {len(val) - 40} more'))
    elif isinstance(val, dict):
        lines.append(('h', label))
        for k, v in val.items():
            if isinstance(v, list): add('  ' + k, v)
            else: lines.append(('l', f'  {k}: {json.dumps(v)}'))
    else: lines.append(('h', f'{label}: {json.dumps(val)}'))
for k, v in d.items():
    if k in ('note',): continue
    add(k, v)
wrapped = []
for kind, t in lines:
    for i, w in enumerate(textwrap.wrap(t, 150) or ['']): wrapped.append((kind, w if i == 0 else '      ' + w))
W, H = 2000, 150 + 30 * len(wrapped) + 60
img = Image.new('RGB', (W, H), 'white'); dr = ImageDraw.Draw(img)
dr.rectangle([0, 0, W, 110], fill=(27, 126, 63)); dr.text((30, 18), title, font=fT, fill='white')
dr.text((30, 64), 'What the browser sent to Google Analytics during this test (captured from the browser on staging, 15 Oct 2026)', font=fH, fill='white')
y = 140
for kind, t in wrapped:
    dr.text((30, y), t, font=fH if kind == 'h' else fL, fill=(32, 33, 36) if kind == 'h' else (60, 60, 60)); y += 30
img.save(out); print(out, img.size)
