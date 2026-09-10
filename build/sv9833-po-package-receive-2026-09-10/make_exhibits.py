#!/usr/bin/env python3
"""Builds the annotated SV-9833 exhibits from the raw captures in /tmp/sv9833.

Every box and arrow is drawn from real element geometry captured with
getBoundingClientRect (the geo-*.json files), never from eyeballed pixels.
"""
import json, os
from PIL import Image, ImageDraw, ImageFont

SRC = '/tmp/sv9833'
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ev')
os.makedirs(OUT, exist_ok=True)
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

RED = (208, 42, 42)
GREEN = (22, 133, 62)
BLUE = (28, 78, 168)
DARK = (33, 37, 41)
GREY = (108, 117, 125)


def font(sz, bold=False):
    return ImageFont.truetype(FB if bold else F, sz)


def tw(d, s, f):
    b = d.textbbox((0, 0), s, font=f)
    return b[2] - b[0], b[3] - b[1]


def box(d, xy, colour, width=4, pad=3):
    x, y, w, h = xy
    d.rectangle([x - pad, y - pad, x + w + pad, y + h + pad], outline=colour, width=width)


def arrow(d, x0, y0, x1, y1, colour, width=4):
    """Straight arrow from (x0,y0) to (x1,y1) with a solid head at the target."""
    d.line([x0, y0, x1, y1], fill=colour, width=width)
    import math
    ang = math.atan2(y1 - y0, x1 - x0)
    L, S = 18, 0.42
    d.polygon([
        (x1, y1),
        (x1 - L * math.cos(ang - S), y1 - L * math.sin(ang - S)),
        (x1 - L * math.cos(ang + S), y1 - L * math.sin(ang + S)),
    ], fill=colour)


def caption(d, x, y, text, colour, f, boxed=True):
    w, h = tw(d, text, f)
    if boxed:
        d.rectangle([x - 8, y - 6, x + w + 8, y + h + 10], fill=(255, 255, 255), outline=colour, width=3)
    d.text((x, y), text, font=f, fill=colour)
    return w, h


# ---------------------------------------------------------------- exhibit 1
def exhibit1():
    """The reported bug, before and after, on the same inventory part."""
    crop_x0, crop_x1 = 250, 2230
    crop_y0, crop_y1 = 132, 244
    cw, ch = crop_x1 - crop_x0, crop_y1 - crop_y0

    panels = []
    for env, label, colour in [
        ('stg', 'BEFORE  —  released build  ·  app.staging.shopview.com  ·  v26.36.2-a678e3c  ·  10 Sep 2026', RED),
        ('qa', 'AFTER  —  fix branch  ·  sv9833.qa.shopview.com  ·  v26.36.2-165cc79  ·  10 Sep 2026', GREEN),
    ]:
        img = Image.open(f'{SRC}/geo-{env}-ex1.png').convert('RGB').crop((crop_x0, crop_y0, crop_x1, crop_y1))
        geo = json.load(open(f'{SRC}/geo-{env}-ex1.json'))
        cells = {c['txt']: c for c in geo['cells']}
        qty = [c for c in geo['cells'] if c['txt'].endswith('Available')][0]
        avg = geo['cells'][9]
        panels.append((env, label, colour, img, qty, avg))

    pad, gap = 34, 30
    title_h, sub_h = 62, 118
    W = cw + pad * 2
    panel_extra = 150
    H = title_h + sub_h + (34 + ch + panel_extra) * 2 + gap + pad
    im = Image.new('RGB', (W, H), (247, 248, 250))
    d = ImageDraw.Draw(im)

    d.text((pad, 16), 'SV-9833  \u00b7  1 package containing 19 units, ordered at $10.00 for the package',
           font=font(30, True), fill=DARK)
    d.text((pad, title_h + 6),
           'Same inventory part on both builds: Synthetic Dexron VI ATF, 1L  (POI5730C)  \u00b7  vendor Stillwater Diesel Repair',
           font=font(21), fill=GREY)
    d.text((pad, title_h + 36),
           'Both started from Total Quantity 0 and Average Cost $6.93. Added through Add Order Item on a saved purchase order,',
           font=font(21), fill=GREY)
    d.text((pad, title_h + 64),
           'then received with Quantity Received 1. Screen: Parts \u2192 Inventory.',
           font=font(21), fill=GREY)

    y = title_h + sub_h
    for env, label, colour, img, qty, avg in panels:
        d.rectangle([pad - 4, y, pad + cw + 4, y + 30], fill=colour)
        d.text((pad + 8, y + 4), label, font=font(20, True), fill=(255, 255, 255))
        y += 34
        im.paste(img, (pad, y))
        qx, qy = qty['x'] - crop_x0 + pad, qty['y'] - crop_y0 + y
        ax = avg['x'] - crop_x0 + pad
        # one box around the two cells that carry the finding
        span_w = (ax + avg['w']) - qx
        box(d, (qx, qy, span_w, qty['h']), colour, width=4)
        y += ch
        if env == 'stg':
            txt = 'Total Quantity 1  and  Average Cost $10.00  \u2014  the package arrived as a single unit at the full package price'
        else:
            txt = 'Total Quantity 19  and  Average Cost $0.53  \u2014  the package expanded into 19 units and $10.00 was shared across them'
        f = font(22, True)
        w1, h1 = tw(d, txt, f)
        cx = min(max(qx + span_w // 2 - w1 // 2, pad), pad + cw - w1 - 16)
        cy = y + 64
        caption(d, cx, cy, txt, colour, f)
        arrow(d, cx + w1 // 2, cy - 12, qx + span_w // 2, qy + qty['h'] + 10, colour)
        y += panel_extra + gap

    im.save(f'{OUT}/EX1-reported-bug-before-after.png')
    print('EX1', im.size)


# ---------------------------------------------------------------- exhibit 2
def exhibit2():
    """The Receive Parts screen: the pack size is only visible on the fixed build."""
    specs = [
        ('stg', 'BEFORE — released build (v26.36.2-a678e3c): no Items Per Package column at all',
         f'{SRC}/ev-stg-B-stg-invpart-screen.png', RED),
        ('qa', 'AFTER — fix branch (v26.36.2-165cc79): Items Per Package shows 19 for the package line',
         f'{SRC}/ev-qa-A-after-screen.png', GREEN),
    ]
    crops = []
    for env, label, path, colour in specs:
        img = Image.open(path).convert('RGB')
        crops.append((env, label, img.crop((325, 158, 1580, 350)), colour))
    cw, ch = crops[0][2].size
    pad, gap = 34, 22
    W = cw + pad * 2
    H = 96 + (30 + ch) * 2 + gap + pad
    im = Image.new('RGB', (W, H), (247, 248, 250))
    d = ImageDraw.Draw(im)
    d.text((pad, 14), 'SV-9833  ·  the Receive Parts screen, same purchase order shape on both builds',
           font=font(26, True), fill=DARK)
    d.text((pad, 52), 'Line 1 is an ordinary line (no package). Line 2 is 1 package of 19 at $10.00. Nothing else differs.',
           font=font(19), fill=GREY)
    y = 96
    for env, label, img, colour in crops:
        d.rectangle([pad - 4, y, pad + cw + 4, y + 26], fill=colour)
        d.text((pad + 8, y + 3), label, font=font(17, True), fill=(255, 255, 255))
        y += 30
        im.paste(img, (pad, y))
        y += ch + gap
    im.save(f'{OUT}/EX2-receive-screen-before-after.png')
    print('EX2', im.size)


# ---------------------------------------------------------------- exhibit 3
def exhibit3():
    """The vendor invoice: quantity stays 1 at the package price on both, by design."""
    specs = [
        ('stg', 'BEFORE — released build: quantity 1.00 at $10.00, and no pack size recorded anywhere',
         f'{SRC}/ev-stg-G-invoice.png', RED),
        ('qa', 'AFTER — fix branch: quantity 1.00 at $10.00 (unchanged, as intended) plus Items Per Package 19',
         f'{SRC}/ev-qa-G-invoice.png', GREEN),
    ]
    crops = []
    for env, label, path, colour in specs:
        img = Image.open(path).convert('RGB')
        crops.append((label, img.crop((325, 145, 1580, 430)), colour))
    cw, ch = crops[0][1].size
    pad, gap = 34, 22
    W = cw + pad * 2
    H = 96 + (30 + ch) * 2 + gap + pad
    im = Image.new('RGB', (W, H), (247, 248, 250))
    d = ImageDraw.Draw(im)
    d.text((pad, 14), 'SV-9833  ·  the Vendor Invoice for that delivery', font=font(26, True), fill=DARK)
    d.text((pad, 52), 'The amount billed by the vendor is the same on both builds. Only the pack size is new.',
           font=font(19), fill=GREY)
    y = 96
    for label, img, colour in crops:
        d.rectangle([pad - 4, y, pad + cw + 4, y + 26], fill=colour)
        d.text((pad + 8, y + 3), label, font=font(17, True), fill=(255, 255, 255))
        y += 30
        im.paste(img, (pad, y))
        y += ch + gap
    im.save(f'{OUT}/EX3-vendor-invoice-before-after.png')
    print('EX3', im.size)




# ---------------------------------------------------------------- exhibit 4
def exhibit4():
    """The extra cases the ticket asks for, all on the fixed branch."""
    crop = (250, 132, 2230, 244)
    rows = [
        ('ev-qa-O-inv-19421426.png',
         'Two packages of 10 at $100.00 each, both received in one go',
         'Total Quantity 20  ·  Average Cost $10.00'),
        ('ev-qa-O-inv-104775.png',
         'Two packages of 10 at $100.00 each, received one package at a time',
         'Total Quantity 20 after the second receipt  ·  Average Cost $10.00  (10 after the first)'),
        ('ev-qa-O-inv-68175338AC.png',
         'One package of 19 at $147.16, added while creating the purchase order (the path that already worked)',
         'Total Quantity 19  ·  Average Cost $7.75  ($147.16 ÷ 19, rounded to the cent)'),
        ('ev-qa-O-inv-2SHL55057739.png',
         'One package of 19 at $10.00, received through the Receive button on the purchase order itself',
         'Total Quantity 19  ·  Average Cost $0.53'),
    ]
    imgs = [(Image.open(f'{SRC}/{f}').convert('RGB').crop(crop), a, b) for f, a, b in rows]
    cw, ch = imgs[0][0].size
    pad = 34
    head = 96
    blk = 30 + ch + 40
    W, H = cw + pad * 2, head + blk * len(imgs) + pad
    im = Image.new('RGB', (W, H), (247, 248, 250))
    d = ImageDraw.Draw(im)
    d.text((pad, 16), 'SV-9833  ·  the other package cases, all on the fix branch (v26.36.2-165cc79)',
           font=font(30, True), fill=DARK)
    d.text((pad, 58), 'Screen: Parts → Inventory. Every part below started at Total Quantity 0.',
           font=font(21), fill=GREY)
    y = head
    for img, label, result in imgs:
        d.rectangle([pad - 4, y, pad + cw + 4, y + 26], fill=BLUE)
        d.text((pad + 8, y + 3), label, font=font(18, True), fill=(255, 255, 255))
        y += 30
        im.paste(img, (pad, y))
        y += ch + 4
        d.text((pad + 8, y), result, font=font(21, True), fill=GREEN)
        y += 36
    im.save(f'{OUT}/EX4-other-package-cases.png')
    print('EX4', im.size)


if __name__ == '__main__':
    exhibit1()
    exhibit2()
    exhibit3()
    exhibit4()
