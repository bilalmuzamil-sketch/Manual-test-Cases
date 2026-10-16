"""Exhibit for the production follow-up bug: the status pill width changes with what is on screen."""
import json, sys
from PIL import Image, ImageDraw
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import fnt, wrap, RED, GRN, BLU, BLK, GREY
R = json.load(open('data/pwalk.json')); E = 'ev/prod-bug/'; S = 2
def panel(key, png, title, c, ybot=540):
    m = R[key]; im = Image.open(E + png).convert('RGB'); d = ImageDraw.Draw(im)
    v = [x for x in m['v'] if x['y'] + x['h'] < ybot]
    for x in v: d.rectangle([x['x']*S-5, x['y']*S-5, (x['x']+x['w'])*S+5, (x['y']+x['h'])*S+5], outline=c, width=4)
    L = min(x['x'] for x in v)*S - 10; Rr = max(x['x']+x['w'] for x in v)*S + 10
    for X in (L, Rr):
        for y in range(180*S, ybot*S, 22): d.line([X, y, X, y+12], fill=c, width=3)
    im = im.crop((16*S, 180*S, 320*S, ybot*S))
    w = v[0]['w']; f1, f3 = fnt(27, True), fnt(25)
    lines = wrap(d, title, f1, im.width - 30)
    head = 24 + 36*len(lines); foot = 64
    out = Image.new('RGB', (im.width, head + im.height + foot), 'white'); dd = ImageDraw.Draw(out)
    y = 12
    for ln in lines: dd.text((14, y), ln, font=f1, fill=BLK); y += 36
    out.paste(im, (0, head)); dd.text((14, head + im.height + 14), f'Every pill here: {w:.2f} px', font=fnt(28, True), fill=c)
    dd.rectangle([0, 0, out.width-1, out.height-1], outline=(190,196,204), width=2)
    return out
ps = [panel('all', 'pw-all.png', '1. All tab', BLU), panel('estimates', 'pw-estimates.png', '2. Estimates tab', RED),
      panel('completed', 'pw-completed.png', '3. Completed tab', RED), panel('search S2-597', 'pw-search-S2-597.png', '4. Search S2-597 (Paid)', RED, ybot=240)]
gap = 24; H = max(p.height for p in ps); W = sum(p.width for p in ps) + gap*5
f1, f3 = fnt(34, True), fnt(27)
notes = ['Production, Work Orders > List, build v26.40.19-d2441a9, 16 Oct 2026, window 1600 x 1000 px, zoom 100%.',
         'The pill is as wide as the Status column, and the column is as wide as the longest status on the screen. So the same list shows 114 px pills on one tab, 67 px on the Estimates tab, 71.52 px on Completed, and 58.45 px when only a Paid work order is shown.']
dl = []; d0 = ImageDraw.Draw(Image.new('RGB', (9, 9)))
for n in notes: dl += wrap(d0, n, f3, W - 2*gap)
out = Image.new('RGB', (W, 80 + H + 30 + 38*len(dl)), 'white'); d = ImageDraw.Draw(out)
d.text((gap, 22), 'The status pill changes width depending on which work orders are on screen', font=f1, fill=BLK)
x = gap
for p in ps: out.paste(p, (x, 80)); x += p.width + gap
y = 80 + H + 18
for ln in dl: d.text((gap, y), ln, font=f3, fill=BLK); y += 38
out.save('ev/01-pill-width-changes-by-tab-production-hd.png'); print(out.size)
