"""Shared annotated-exhibit helpers for the Board/Tech View bug batch (Rules 64/73/90)."""
import sys
from PIL import Image, ImageDraw
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import fnt, wrap, RED, GRN, BLU, BLK, GREY

def head(im, title, sub, c):
    out = Image.new('RGB', (im.width, im.height + 84), 'white'); d = ImageDraw.Draw(out)
    d.rectangle([0, 0, im.width - 1, 78], fill=c); d.text((14, 8), title, font=fnt(25, True), fill='white'); d.text((14, 46), sub, font=fnt(19), fill='white')
    out.paste(im, (0, 84)); d.rectangle([0, 0, out.width - 1, out.height - 1], outline=(190, 196, 204), width=2); return out

def box(d, r, c, S=2, pad=4, w=4, oval=False):
    xy = [r['x'] * S - pad, r['y'] * S - pad, (r['x'] + r['w']) * S + pad, (r['y'] + r['h']) * S + pad]
    (d.ellipse if oval else d.rectangle)(xy, outline=c, width=w); return xy

def badge(d, x, y, n, c):
    d.ellipse([x - 15, y - 15, x + 15, y + 15], fill=c); d.text((x, y), str(n), font=fnt(19, True), fill='white', anchor='mm')

def legend(im, lines, c, size=22, pad=14):
    f = fnt(size, True); d0 = ImageDraw.Draw(Image.new('RGB', (9, 9))); L = []
    for t in lines: L += wrap(d0, t, f, im.width - 2 * pad)
    out = Image.new('RGB', (im.width, im.height + 20 + 34 * len(L)), 'white'); out.paste(im, (0, 0)); d = ImageDraw.Draw(out)
    y = im.height + 10
    for t in L: d.text((pad, y), t, font=f, fill=c); y += 34
    return out

def row(panels, gap=22):
    H = max(p.height for p in panels); out = Image.new('RGB', (sum(p.width for p in panels) + gap * (len(panels) - 1), H), 'white'); x = 0
    for p in panels: out.paste(p, (x, 0)); x += p.width + gap
    return out

def col(panels, gap=22):
    W = max(p.width for p in panels); out = Image.new('RGB', (W, sum(p.height for p in panels) + gap * (len(panels) - 1)), 'white'); y = 0
    for p in panels: out.paste(p, (0, y)); y += p.height + gap
    return out

def page(title, body, notes, maxw=2000, gap=24):
    if body.width > maxw: body = body.resize((maxw, int(body.height * maxw / body.width)), Image.LANCZOS)
    W = body.width + 2 * gap; f3 = fnt(24); d0 = ImageDraw.Draw(Image.new('RGB', (9, 9))); dl = []
    for n in notes: dl += wrap(d0, n, f3, W - 2 * gap) + ['']
    out = Image.new('RGB', (W, 76 + body.height + 18 + 34 * len(dl)), 'white'); d = ImageDraw.Draw(out)
    d.text((gap, 20), title, font=fnt(31, True), fill=BLK); out.paste(body, (gap, 76)); y = 76 + body.height + 14
    for ln in dl: d.text((gap, y), ln, font=f3, fill=BLK); y += 34
    return out
