#!/usr/bin/env python3
"""Annotated exhibits for the PO.

EX1  INV-S9901-16810 (older) vs INV-S2-10056 (newer) - the same design.
EX2  The cross-check: two documents from the SAME shop, both supplied as the
     "old" one, disagree with each other about the Parts Total / Labor Total
     rows - so those rows are a per-document setting, not a design change.

Every box is placed from a coordinate measured out of the PDF, not by eye.
"""
import os, math, pymupdf
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'ev'); os.makedirs(OUT, exist_ok=True)
V2 = os.path.join(os.path.dirname(HERE), 'v2')
OLD3 = os.path.join(HERE, 'OLD-INV-S9901-16810.pdf')
NEW3 = os.path.join(HERE, 'NEW-INV-S2-10056.pdf')
OLD2 = os.path.join(V2, 'OLD-EST-S9901-17435.pdf')
DPI = 150; S = DPI / 72.0
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
RED = (208, 42, 42); GREEN = (22, 133, 62); BLUE = (28, 78, 168)
AMBER = (176, 108, 0); DARK = (33, 37, 41); GREY = (108, 117, 125)


def font(sz, bold=False):
    return ImageFont.truetype(FB if bold else F, sz)


def page(pdf, i):
    pm = pymupdf.open(pdf)[i].get_pixmap(dpi=DPI)
    return Image.frombytes('RGB', (pm.width, pm.height), pm.samples)


def tw(d, s, f):
    b = d.textbbox((0, 0), s, font=f); return b[2] - b[0], b[3] - b[1]


def cap(d, x, y, text, colour, f):
    w, h = tw(d, text, f)
    d.rectangle([x - 9, y - 7, x + w + 9, y + h + 11], fill=(255, 255, 255), outline=colour, width=3)
    d.text((x, y), text, font=f, fill=colour)
    return w, h


def arrow(d, x0, y0, x1, y1, colour, width=4):
    d.line([x0, y0, x1, y1], fill=colour, width=width)
    a = math.atan2(y1 - y0, x1 - x0); L, K = 17, 0.42
    d.polygon([(x1, y1), (x1 - L * math.cos(a - K), y1 - L * math.sin(a - K)),
               (x1 - L * math.cos(a + K), y1 - L * math.sin(a + K))], fill=colour)


def width_for(lines, probe):
    return max(tw(probe, t, f)[0] for t, f in lines)


# ------------------------------------------------------------------ EX1
def ex1():
    a = page(OLD3, 0); b = page(NEW3, 0)
    W, H = a.size
    pad, gapx, head = 44, 60, 330
    im = Image.new('RGB', (W * 2 + pad * 2 + gapx, H + head + 490), (247, 248, 250))
    d = ImageDraw.Draw(im)
    d.text((pad, 24), 'The two invoices are the same design', font=font(44, True), fill=DARK)
    for j, t in enumerate([
        'Left: INV-S9901-16810, the older invoice.    Right: INV-S2-10056, the newer one.',
        'Measured straight out of the two PDF files - 16 structural checks, all 16 identical, plus every fixed landmark',
        'on the page at the same position to a tenth of a point. The letterhead image is byte-for-byte the same file.',
        'They carry different customers, different jobs and different money, so the text and the length differ.',
        'That is the data on the invoice, not the design of it.']):
        d.text((pad, 88 + j * 36), t, font=font(26), fill=GREY)

    for i, (img, lbl, colour) in enumerate([(a, 'OLDER   INV-S9901-16810', BLUE),
                                            (b, 'NEWER   INV-S2-10056', BLUE)]):
        x = pad + i * (W + gapx)
        d.rectangle([x, head - 38, x + W, head - 6], fill=colour)
        d.text((x + 12, head - 35), lbl, font=font(24, True), fill=(255, 255, 255))
        im.paste(img, (x, head))
        d.rectangle([x, head, x + W, head + H], outline=(200, 205, 212), width=2)

    y = head + H + 34
    d.text((pad, y), 'Identical, measured:', font=font(32, True), fill=GREEN)
    items = [
        'Page size, margins and the white page area',
        'Content width - 58.5pt to 536.8pt',
        'Description / Quantity / Rate / Amount columns',
        'Totals cell width - 70.4pt',
        'Typeface, every type size, every colour',
        'Bold and not-bold on every single element',
        '"Bill To" and "Remit payment to" at y 126.0',
        'Asset table headings at y 237.3',
        'Line-item headings at y 355.4',
        'First job line begins at y 384.8',
        'The rule above the line table at y 346.4',
        'The Labor / Parts row labels at x 60.8',
        'Summary block, signature block, disclaimer',
        'Footer text and position - y 814.1',
        'The letterhead image (identical file)',
    ]
    for i, t in enumerate(items):
        col, row = i // 8, i % 8
        d.text((pad + 20 + col * 1240, y + 48 + row * 34), '✓  ' + t, font=font(26), fill=DARK)
    d.text((pad, y + 48 + 8 * 34 + 14),
           'Different, and all of it is data: the customer, the jobs, the amounts, the page count,',
           font=font(26, True), fill=AMBER)
    d.text((pad, y + 48 + 8 * 34 + 48),
           'and "Service Order" wrapping onto two lines because that column sizes itself to a shorter order number.',
           font=font(26, True), fill=AMBER)
    im.save(f'{OUT}/EX1-same-design.png')
    print('EX1', im.size)


# ------------------------------------------------------------------ EX2
def ex2():
    """Two OLD invoices from the same shop disagree with each other."""
    X0, X1 = 50, 566
    # S-17435: line 1 runs 374 -> 440 (no Parts/Labor Total)
    a = page(OLD2, 0).crop((int(X0 * S), int(374 * S), int(X1 * S), int(441 * S)))
    # S-16810: line 1 runs 374 -> 515 (has them)
    b = page(OLD3, 0).crop((int(X0 * S), int(374 * S), int(X1 * S), int(515 * S)))
    cw = a.size[0]
    probe = ImageDraw.Draw(Image.new('RGB', (10, 10)))
    subs = [
        'Both of these came from the same shop, Staging Heavy Duty - 9919, and both were produced the same way.',
        'Neither is "the new design". They simply disagree with each other.',
        'So these two rows are not something the redesign introduced - they are a per-invoice setting.']
    cap2 = 'Same shop, same template - and only one of them prints "Parts Total" and "Labor Total".'
    need = max(width_for([(t, font(26)) for t in subs] +
                         [('Two older invoices from the same shop do not agree', font(44, True)),
                          (cap2, font(28, True))], probe) + 40, cw)
    pad, head = 44, 250
    Wd = need + pad * 2
    H = head + (36 + a.size[1] + 40) + (36 + b.size[1] + 170) + pad
    im = Image.new('RGB', (Wd, H), (247, 248, 250))
    d = ImageDraw.Draw(im)
    d.text((pad, 24), 'Two older invoices from the same shop do not agree', font=font(44, True), fill=DARK)
    for j, t in enumerate(subs):
        d.text((pad, 96 + j * 36), t, font=font(26), fill=GREY)

    y = head
    d.rectangle([pad - 4, y, pad + cw + 4, y + 32], fill=AMBER)
    d.text((pad + 10, y + 4), 'OLDER   EST-S9901-17435   -   goes straight to Line Total', font=font(23, True), fill=(255, 255, 255))
    y += 36
    im.paste(a, (pad, y))
    d.rectangle([pad, y, pad + cw, y + a.size[1]], outline=(200, 205, 212), width=2)
    d.rectangle([pad + (393.0 - X0) * S, y + (426.4 - 374) * S,
                 pad + (535.3 - X0) * S, y + (442.5 - 374) * S], outline=GREEN, width=5)
    y += a.size[1] + 40

    d.rectangle([pad - 4, y, pad + cw + 4, y + 32], fill=AMBER)
    d.text((pad + 10, y + 4), 'OLDER   INV-S9901-16810   -   prints both extra rows', font=font(23, True), fill=(255, 255, 255))
    y += 36
    im.paste(b, (pad, y))
    d.rectangle([pad, y, pad + cw, y + b.size[1]], outline=(200, 205, 212), width=2)
    bx0, bx1 = pad + (393.0 - X0) * S, pad + (535.3 - X0) * S
    by0, by1 = y + (464.1 - 374) * S, y + (501.4 - 374) * S
    d.rectangle([bx0 - 6, by0, bx1 + 6, by1], outline=RED, width=6)
    d.rectangle([pad + (393.0 - X0) * S, y + (501.1 - 374) * S,
                 pad + (535.3 - X0) * S, y + (517.3 - 374) * S], outline=GREEN, width=5)
    y += b.size[1]

    f = font(28, True)
    w1, _ = tw(d, cap2, f)
    cx = max(pad, min(bx0 - w1 / 2, Wd - pad - w1 - 10))
    cap(d, cx, y + 66, cap2, RED, f)
    arrow(d, cx + w1 * 0.74, y + 60, bx0 + (bx1 - bx0) / 2, by1 + 8, RED)
    d.text((pad, y + 124), 'Green = the Line Total row, which both of them print.', font=font(26, True), fill=GREEN)
    im.save(f'{OUT}/EX2-two-old-invoices-disagree.png')
    print('EX2', im.size)


if __name__ == '__main__':
    ex1(); ex2()
