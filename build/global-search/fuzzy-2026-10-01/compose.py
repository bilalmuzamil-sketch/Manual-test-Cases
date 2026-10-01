#!/usr/bin/env python3
"""Compose the ticket picture: correct spelling beside its typo, same record, same tab.

Rule 116: landscape, so it is not shrunk to a thumbnail inline; source captured at 2x and
DOWNsampled here, never upscaled; a banner saying WHAT YOU ARE LOOKING AT, not the ticket title.
"""
from PIL import Image, ImageDraw, ImageFont
import sys

D = 'build/global-search/fuzzy-2026-10-01/pics/'
def font(sz, bold=False):
    for p in ['/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bold else ''),
              '/usr/share/fonts/truetype/liberation/LiberationSans%s.ttf' % ('-Bold' if bold else '')]:
        try: return ImageFont.truetype(p, sz)
        except Exception: pass
    return ImageFont.load_default()

def panel(src, crop_h, label, verdict, good):
    im = Image.open(D+src).convert('RGB').crop((0, 0, 1280, crop_h))
    w, h = im.size
    head, foot = 86, 64
    out = Image.new('RGB', (w, h+head+foot), '#ffffff')
    out.paste(im, (0, head))
    d = ImageDraw.Draw(out)
    colour = '#1a7f37' if good else '#cf222e'
    d.rectangle([0, 0, w, head], fill=colour)
    d.text((24, 16), label, font=font(30, True), fill='#ffffff')
    d.text((24, 52), verdict, font=font(23), fill='#ffffff')
    d.rectangle([0, head, w-1, h+head-1], outline=colour, width=5)
    return out

left  = panel('ctrl-po-exact.png', 760, 'Spelled correctly:  Stillwater',
              'The matched word is highlighted. You can see why the row came back.', True)
right = panel('bad-po-fuzzy.png', 760, 'One letter wrong:  tSillwater',
              'Same purchase orders, flagged as close matches - nothing highlighted at all.', False)

gap = 28
W = left.width + right.width + gap*3
cap = 120
out = Image.new('RGB', (W, left.height + cap + gap*2), '#f6f8fa')
out.paste(left,  (gap, cap+gap))
out.paste(right, (gap*2 + left.width, cap+gap))
d = ImageDraw.Draw(out)
d.text((gap, 26), 'Purchase Orders tab - the same record, S3-6881 Stillwater Diesel Repair, searched both ways',
       font=font(34, True), fill='#1f2328')
d.text((gap, 72), 'A one-letter slip still finds the purchase orders, but the row no longer shows which word matched.',
       font=font(28), fill='#57606a')
out = out.resize((out.width//2, out.height//2), Image.LANCZOS)   # 2x capture -> downsample
out.save(D+'TICKET-1-fuzzy-no-highlight.png')
print('written', D+'TICKET-1-fuzzy-no-highlight.png', out.size)
