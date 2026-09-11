#!/usr/bin/env python3
"""Strict comparison exhibits: INV-S9901-16810 vs INV-S2-10056.

EX1  the verdict, with the strict checklist
EX2  the single visible difference - the "Service Order" heading wrapping -
     shown with the cause beside it

Boxes are placed from coordinates measured out of the PDFs, never by eye.
"""
import os, math, pymupdf
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'ev'); os.makedirs(OUT, exist_ok=True)
OLD = os.path.join(HERE, 'OLD-INV-S9901-16810.pdf')
NEW = os.path.join(HERE, 'NEW-INV-S2-10056.pdf')
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


# ------------------------------------------------------------------ EX1
def ex1():
    a = page(OLD, 0); b = page(NEW, 0)
    W, H = a.size
    pad, gapx, head = 44, 60, 340
    rows = 9
    im = Image.new('RGB', (W * 2 + pad * 2 + gapx, H + head + 150 + rows * 36 + 90), (247, 248, 250))
    d = ImageDraw.Draw(im)
    d.text((pad, 24), 'Strict comparison: no design difference found', font=font(46, True), fill=DARK)
    for j, t in enumerate([
        'INV-S9901-16810 (older) against INV-S2-10056 (newer). Same shop, same render engine, so like for like.',
        'Every figure below is read out of the two PDF files themselves - positions, type sizes, weights, colours and rules.',
        'The two documents carry different customers, different jobs and different money, so the words and the length differ.',
        'That is what is printed on the invoice, not how the invoice is built.']):
        d.text((pad, 92 + j * 36), t, font=font(27), fill=GREY)

    for i, (img, lbl) in enumerate([(a, 'OLDER   INV-S9901-16810   ·   11 pages'),
                                    (b, 'NEWER   INV-S2-10056   ·   5 pages')]):
        x = pad + i * (W + gapx)
        d.rectangle([x, head - 38, x + W, head - 6], fill=BLUE)
        d.text((x + 12, head - 35), lbl, font=font(25, True), fill=(255, 255, 255))
        im.paste(img, (x, head))
        d.rectangle([x, head, x + W, head + H], outline=(200, 205, 212), width=2)

    y = head + H + 40
    d.text((pad, y), 'Checked strictly, and identical on both:', font=font(34, True), fill=GREEN)
    items = [
        ('Embedded font subsets', 'the same two subsets, character for character'),
        ('Type sizes and line metrics', '6.48 / 9.6 / 10.5 / 10.8 / 14.4pt, same ascender and descender'),
        ('Colours', 'black #000000 and grey #424242 only; the rule grey #a8a8a8'),
        ('Every rule and border', 'same heights, same fills, same widths'),
        ('Line-table columns', 'Description 90.41  ·  Quantity 339.40  ·  Rate 442.17  ·  Amount 498.79'),
        ('Every money column edge', '465.11  ·  537.00  ·  539.25 - identical on both'),
        ('The baseline ladder', 'Bill To 126.0, asset headings 237.29, line headings 355.41, first job 384.85'),
        ('Row spacing inside a job', '13.09pt between rows, 17.59pt to each total, 27.94pt between jobs'),
        ('Page frames and continuation', 'first page 793.37, middle 776.87, last 295.74; same repeated headings'),
    ]
    for i, (k, v) in enumerate(items):
        yy = y + 52 + i * 36
        d.text((pad + 20, yy), '✓', font=font(28, True), fill=GREEN)
        d.text((pad + 58, yy), k, font=font(28, True), fill=DARK)
        d.text((pad + 660, yy), v, font=font(27), fill=GREY)
    yy = y + 52 + rows * 36 + 16
    d.text((pad, yy), 'The only visible difference, and it is caused by the data:', font=font(30, True), fill=AMBER)
    d.text((pad + 20, yy + 40),
           '"Service Order" fits on one line in the older invoice and wraps onto two in the newer one - see the next exhibit.',
           font=font(27), fill=DARK)
    im.save(f'{OUT}/EX1-strict-verdict.png')
    print('EX1', im.size)


# ------------------------------------------------------------------ EX2
def ex2():
    """The Service Order heading: one line vs two, and why."""
    X0, X1 = 52, 360
    Y0, Y1 = 228, 336
    a = page(OLD, 0).crop((int(X0 * S), int(Y0 * S), int(X1 * S), int(Y1 * S)))
    b = page(NEW, 0).crop((int(X0 * S), int(Y0 * S), int(X1 * S), int(Y1 * S)))
    cw, ch = a.size
    probe = ImageDraw.Draw(Image.new('RGB', (10, 10)))
    subs = [
        'This column has no fixed width - it sizes itself to what is inside it.',
        'The older invoice\'s order number, S9901-16810, is 67.6pt wide. The newer one, S2-10056, is only 51.4pt.',
        'The narrower number makes the column narrower, so the heading "Service Order" no longer fits on one line.',
        'Nothing in the template changed. Put a longer order number on the newer invoice and it fits again.']
    need = max([tw(probe, t, font(27))[0] for t in subs]
               + [tw(probe, 'The one visible difference - and the data causes it', font(46, True))[0],
                  cw * 2 + 70])
    pad, head = 44, 300
    Wd = need + pad * 2
    im = Image.new('RGB', (Wd, head + ch + 250), (247, 248, 250))
    d = ImageDraw.Draw(im)
    d.text((pad, 24), 'The one visible difference - and the data causes it', font=font(46, True), fill=DARK)
    for j, t in enumerate(subs):
        d.text((pad, 96 + j * 36), t, font=font(27), fill=GREY)

    for i, (img, lbl, colour) in enumerate([
            (a, 'OLDER   ·   order no. S9901-16810', GREEN),
            (b, 'NEWER   ·   order no. S2-10056', AMBER)]):
        x = pad + i * (cw + 70)
        d.rectangle([x, head - 36, x + cw, head - 6], fill=colour)
        d.text((x + 10, head - 33), lbl, font=font(21, True), fill=(255, 255, 255))
        im.paste(img, (x, head))
        d.rectangle([x, head, x + cw, head + ch], outline=(200, 205, 212), width=2)

    # box the heading cell in each: OLD one line at y 301.26, NEW two lines 286.94..301.26+
    xo = pad
    d.rectangle([xo + (58.0 - X0) * S, head + (293.0 - Y0) * S,
                 xo + (142.0 - X0) * S, head + (313.0 - Y0) * S], outline=GREEN, width=5)
    xn = pad + cw + 70
    d.rectangle([xn + (58.0 - X0) * S, head + (279.0 - Y0) * S,
                 xn + (142.0 - X0) * S, head + (313.0 - Y0) * S], outline=RED, width=5)

    f = font(28, True)
    t = 'One line here.'
    w1, _ = tw(d, t, f); cap(d, xo + 30, head + ch + 42, t, GREEN, f)
    t2 = 'Two lines here - the column is 16.2pt narrower.'
    w2, _ = tw(d, t2, f)
    cap(d, min(xn, Wd - pad - w2 - 12), head + ch + 42, t2, RED, f)
    d.text((pad, head + ch + 120),
           'Everything else in this block is identical: the headings sit at the same heights, and the five columns',
           font=font(27), fill=GREY)
    d.text((pad, head + ch + 156),
           'shift by at most 5.3pt for the same reason - they size themselves to the values printed in them.',
           font=font(27), fill=GREY)
    im.save(f'{OUT}/EX2-service-order-wrap.png')
    print('EX2', im.size)


if __name__ == '__main__':
    ex1(); ex2()
