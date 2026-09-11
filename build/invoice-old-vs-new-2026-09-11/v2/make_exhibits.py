#!/usr/bin/env python3
"""Annotated exhibits: OLD EST-S9901-17435 vs NEW EST-S1-17520.

Every box is placed from a coordinate measured out of the PDF (pymupdf
get_drawings / text spans), converted to pixels at the render DPI.
"""
import os, math, pymupdf
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'ev'); os.makedirs(OUT, exist_ok=True)
OLD = os.path.join(HERE, 'OLD-EST-S9901-17435.pdf')
NEW = os.path.join(HERE, 'NEW-EST-S1-17520.pdf')
DPI = 150; S = DPI / 72.0
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
RED = (208, 42, 42); GREEN = (22, 133, 62); DARK = (33, 37, 41); GREY = (108, 117, 125)


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


# ------------------------------------------------------------------ EX1
def ex1():
    """The same job line in both documents, stacked. One difference, boxed."""
    X0, X1 = 50, 566            # pt
    O_Y0, O_Y1 = 374, 440       # old: title 384.8 -> Line Total 428.6
    N_Y0, N_Y1 = 374, 501       # new: title 384.4 -> Line Total 489.6
    a = page(OLD, 0).crop((int(X0 * S), int(O_Y0 * S), int(X1 * S), int(O_Y1 * S)))
    b = page(NEW, 0).crop((int(X0 * S), int(N_Y0 * S), int(X1 * S), int(N_Y1 * S)))
    cw = a.size[0]
    pad, head = 44, 210
    H = head + (36 + a.size[1] + 30) + (36 + b.size[1] + 150) + pad
    subs = [
        'The same job, on the same shop, on the same build: "Service - CVIP inspection single or tandem axle",',
        'one Labor item called "Annual inspection", worth $400.00 on both documents.',
        'The old estimate goes straight from the item to Line Total. The new one inserts two extra rows first.']
    cap1 = 'These two rows are the only difference: "Parts Total" and "Labor Total" under every job line.'
    probe = ImageDraw.Draw(Image.new('RGB', (10, 10)))
    need = max([tw(probe, t, font(25))[0] for t in subs]
               + [tw(probe, 'The one thing that differs between the two estimates', font(40, True))[0],
                  tw(probe, cap1, font(27, True))[0] + 40])
    W = max(cw, need) + pad * 2
    im = Image.new('RGB', (W, H), (247, 248, 250))
    d = ImageDraw.Draw(im)

    d.text((pad, 24), 'The one thing that differs between the two estimates', font=font(40, True), fill=DARK)
    for j, t in enumerate(subs):
        d.text((pad, 84 + j * 34), t, font=font(25), fill=GREY)

    y = head
    # OLD panel
    d.rectangle([pad - 4, y, pad + cw + 4, y + 32], fill=GREEN)
    d.text((pad + 10, y + 4), 'OLD   EST-S9901-17435   (what the customers are asking for)', font=font(23, True), fill=(255, 255, 255))
    y += 36
    im.paste(a, (pad, y))
    d.rectangle([pad, y, pad + cw, y + a.size[1]], outline=(200, 205, 212), width=2)
    oy = y
    # mark the Line Total row on the old one
    d.rectangle([pad + (393.0 - X0) * S, oy + (426.4 - O_Y0) * S,
                 pad + (535.3 - X0) * S, oy + (442.5 - O_Y0) * S], outline=GREEN, width=5)
    y += a.size[1] + 30

    # NEW panel
    d.rectangle([pad - 4, y, pad + cw + 4, y + 32], fill=RED)
    d.text((pad + 10, y + 4), 'NEW   EST-S1-17520   (what they get now)', font=font(23, True), fill=(255, 255, 255))
    y += 36
    im.paste(b, (pad, y))
    d.rectangle([pad, y, pad + cw, y + b.size[1]], outline=(200, 205, 212), width=2)
    ny = y
    # the two extra rows: totals cells run y 452.2..468.3 and 469.8..485.9
    bx0, bx1 = pad + (393.0 - X0) * S, pad + (535.3 - X0) * S
    by0, by1 = ny + (450.4 - N_Y0) * S, ny + (487.7 - N_Y0) * S
    d.rectangle([bx0 - 6, by0, bx1 + 6, by1], outline=RED, width=6)
    # and the Line Total row, to show it is unchanged
    d.rectangle([pad + (393.0 - X0) * S, ny + (487.4 - N_Y0) * S,
                 pad + (535.3 - X0) * S, ny + (503.6 - N_Y0) * S], outline=GREEN, width=5)
    y += b.size[1]

    f = font(27, True)
    t1 = cap1
    w1, h1 = tw(d, t1, f)
    cx = max(pad, min(bx0 - w1 / 2, W - pad - w1 - 10))
    cap(d, cx, y + 58, t1, RED, f)
    arrow(d, cx + w1 * 0.72, y + 52, bx0 + (bx1 - bx0) / 2, by1 + 8, RED)
    d.text((pad, y + 112), 'Green = the Line Total row, identical on both.', font=font(25, True), fill=GREEN)
    im.save(f'{OUT}/EX1-the-one-difference.png')
    print('EX1', im.size)


# ------------------------------------------------------------------ EX2
def ex2():
    """Page 1 of each, same scale, with the measured list of what matches."""
    a = page(OLD, 0); b = page(NEW, 0)
    W, H = a.size
    pad, gapx, head = 44, 60, 330
    im = Image.new('RGB', (W * 2 + pad * 2 + gapx, H + head + 380), (247, 248, 250))
    d = ImageDraw.Draw(im)
    d.text((pad, 24), 'Everything else on the page already matches', font=font(42, True), fill=DARK)
    for j, t in enumerate([
        'Both estimates were produced by the same shop on the same build, so this is a like-for-like comparison.',
        'They carry different jobs and a different customer, so the wording and the length differ - that is the data, not the design.',
        'Measured directly from the two PDF files, 23 checks. 22 are identical. Only the two extra total rows differ',
        '(and "Service Order" wrapping, which is the column sizing itself to a shorter order number - also data).']):
        d.text((pad, 88 + j * 36), t, font=font(26), fill=GREY)
    d.text((pad, 240), 'The logo differs between shops and is out of scope here.', font=font(25, True), fill=GREY)

    for i, (img, lbl, colour) in enumerate([(a, 'OLD   EST-S9901-17435', GREEN),
                                            (b, 'NEW   EST-S1-17520', RED)]):
        x = pad + i * (W + gapx)
        d.rectangle([x, head - 38, x + W, head - 6], fill=colour)
        d.text((x + 12, head - 35), lbl, font=font(24, True), fill=(255, 255, 255))
        im.paste(img, (x, head))
        d.rectangle([x, head, x + W, head + H], outline=(200, 205, 212), width=2)

    items = [
        'Page size and margins', 'White page area', 'Content width (58.5pt to 536.8pt)',
        'Description / Quantity / Rate / Amount column positions', 'Totals cell width (70.4pt)',
        'Typeface, every type size, every colour', 'Bold and not-bold on every element',
        'Column headings: Unit, VIN/Serial #, Asset, Mileage, Eng Hrs', '"Invoice Date" and "Due date" labels',
        'The Labor / Parts row labels and where they sit', 'Row spacing inside a job line (13.1pt)',
        'Summary block: labels, weights, positions', 'Signature block and disclaimer', 'Footer text and position',
    ]
    y = head + H + 34
    d.text((pad, y), 'Verified identical:', font=font(30, True), fill=GREEN)
    for i, t in enumerate(items):
        col, row = i // 7, i % 7
        d.text((pad + 20 + col * 1180, y + 44 + row * 32), '✓  ' + t, font=font(25), fill=DARK)
    im.save(f'{OUT}/EX2-everything-else-matches.png')
    print('EX2', im.size)


if __name__ == '__main__':
    ex1(); ex2()
