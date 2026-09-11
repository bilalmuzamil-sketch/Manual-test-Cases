#!/usr/bin/env python3
"""Side-by-side exhibits for the old vs new estimate/invoice document.

Every box is drawn from a coordinate measured out of the PDF itself
(pymupdf get_drawings / get_text spans), converted to pixels at the
render DPI - never eyeballed.
"""
import os, math, pymupdf
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'ev'); os.makedirs(OUT, exist_ok=True)
OLD = os.path.join(HERE, 'OLD-EST-S1113-1190.pdf')
NEW = os.path.join(HERE, 'NEW-EST-S1-17520.pdf')
DPI = 150
S = DPI / 72.0
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
RED = (208, 42, 42); GREEN = (22, 133, 62); BLUE = (28, 78, 168)
DARK = (33, 37, 41); GREY = (108, 117, 125); AMBER = (196, 120, 0)


def font(sz, bold=False):
    return ImageFont.truetype(FB if bold else F, sz)


def page(pdf, i):
    d = pymupdf.open(pdf)
    return Image.frombytes('RGB', (d[i].get_pixmap(dpi=DPI).width, d[i].get_pixmap(dpi=DPI).height),
                           d[i].get_pixmap(dpi=DPI).samples)


def tw(d, s, f):
    b = d.textbbox((0, 0), s, font=f); return b[2] - b[0], b[3] - b[1]


def cap(d, x, y, text, colour, f):
    w, h = tw(d, text, f)
    d.rectangle([x - 8, y - 6, x + w + 8, y + h + 10], fill=(255, 255, 255), outline=colour, width=3)
    d.text((x, y), text, font=f, fill=colour)
    return w, h


def arrow(d, x0, y0, x1, y1, colour, width=4):
    d.line([x0, y0, x1, y1], fill=colour, width=width)
    a = math.atan2(y1 - y0, x1 - x0); L, K = 16, 0.42
    d.polygon([(x1, y1), (x1 - L * math.cos(a - K), y1 - L * math.sin(a - K)),
               (x1 - L * math.cos(a + K), y1 - L * math.sin(a + K))], fill=colour)


def hband(d, x0, x1, y, colour, label, f, above=True):
    """A measured horizontal span with end ticks and a centred label."""
    d.line([x0, y, x1, y], fill=colour, width=4)
    for x in (x0, x1):
        d.line([x, y - 12, x, y + 12], fill=colour, width=4)
    w, h = tw(d, label, f)
    cx = (x0 + x1) / 2 - w / 2
    cy = y - h - 20 if above else y + 14
    cap(d, cx, cy, label, colour, f)


# ------------------------------------------------------------------ EX1
def ex1():
    """Whole page 1 side by side: the content block is 60pt narrower."""
    a = page(OLD, 0); b = page(NEW, 0)
    W, H = a.size
    pad, gapx = 40, 60
    head = 250
    im = Image.new('RGB', (W * 2 + pad * 2 + gapx, H + head + 210), (247, 248, 250))
    d = ImageDraw.Draw(im)
    d.text((pad, 22), 'The old document and the new one, page 1, drawn to the same scale',
           font=font(40, True), fill=DARK)
    for j, t in enumerate([
        'Left: EST-S1113-1190, the version customers want back.    Right: EST-S1-17520, what they get now.',
        'Both are Legacy-design estimates on A4, and the page margin is identical on both.',
        'What changed is the block of content inside that margin: it is pushed in by 30pt on each side,',
        'so it prints 60pt (11%) narrower and leaves the two amber strips of paper unused.']):
        d.text((pad, 80 + j * 36), t, font=font(26), fill=GREY)

    for i, (img, lbl, colour) in enumerate([
            (a, 'OLD   content runs 28.5pt to 566.8pt  =  538pt wide', GREEN),
            (b, 'NEW   content runs 58.5pt to 536.8pt  =  478pt wide', RED)]):
        x = pad + i * (W + gapx)
        d.rectangle([x, head - 38, x + W, head - 6], fill=colour)
        d.text((x + 12, head - 35), lbl, font=font(24, True), fill=(255, 255, 255))
        im.paste(img, (x, head))
        d.rectangle([x, head, x + W, head + H], outline=(200, 205, 212), width=2)

    # the unused strips on the new page, shaded
    x = pad + W + gapx
    ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); od = ImageDraw.Draw(ov)
    for x0pt, x1pt in [(28.5, 58.5), (536.8, 566.8)]:
        od.rectangle([x0pt * S, 6 * S, x1pt * S, 800 * S], fill=(255, 176, 32, 90))
    im.paste(Image.alpha_composite(b.convert('RGBA'), ov).convert('RGB'), (x, head))
    d.rectangle([x, head, x + W, head + H], outline=(200, 205, 212), width=2)
    for x0pt, x1pt in [(28.5, 58.5), (536.8, 566.8)]:
        d.rectangle([x + x0pt * S, head + 6 * S, x + x1pt * S, head + 800 * S], outline=AMBER, width=4)

    # measured content bands, under each page
    yb = head + H + 40
    for i, (x0pt, x1pt, colour, txt) in enumerate([(28.5, 566.8, GREEN, '538pt of content'),
                                                   (58.5, 536.8, RED, '478pt of content')]):
        x = pad + i * (W + gapx)
        hband(d, x + x0pt * S, x + x1pt * S, yb, colour, txt, font(30, True), above=False)
    d.text((pad, head + H + 150),
           'Amber = 30pt of paper on each side that the new document no longer prints on.',
           font=font(30, True), fill=AMBER)
    im.save(f'{OUT}/EX1-page1-side-by-side.png')
    print('EX1', im.size)


# ------------------------------------------------------------------ EX2
def ex2():
    """One line item, close up: the new left gutter and the lost bold."""
    a = page(OLD, 0).crop((int(20 * S), int(360 * S), int(580 * S), int(500 * S)))
    b = page(NEW, 0).crop((int(20 * S), int(370 * S), int(580 * S), int(510 * S)))
    cw, ch = a.size
    pad = 40; head = 150; blk = 34 + ch + 120
    im = Image.new('RGB', (cw + pad * 2, head + blk * 2 + 40), (247, 248, 250))
    d = ImageDraw.Draw(im)
    d.text((pad, 20), 'One job line, close up', font=font(38, True), fill=DARK)
    d.text((pad, 68), 'Same scale. The description starts 30pt further in, and the money figures have lost their bold.',
           font=font(23), fill=GREY)
    d.text((pad, 98), 'Only "Line Total" is still bold on the new one - and even there the amount beside it is not.',
           font=font(23), fill=GREY)
    y = head
    for img, lbl, colour, notes in [
        (a, 'OLD', GREEN, [(30.8, 'description starts at the table edge'),
                           (442.3, 'Parts Total / Labor Total / Line Total - labels AND amounts bold')]),
        (b, 'NEW', RED, [(60.8, '"Labor" sits in a new left column, description pushed 29.6pt right'),
                         (393.0, 'labels regular, amounts regular - nothing stands out')])]:
        d.rectangle([pad - 4, y, pad + cw + 4, y + 30], fill=colour)
        d.text((pad + 8, y + 4), lbl, font=font(22, True), fill=(255, 255, 255))
        y += 34
        im.paste(img, (pad, y))
        d.rectangle([pad, y, pad + cw, y + ch], outline=(200, 205, 212), width=2)
        cy = y + ch + 26
        for j, (xpt, txt) in enumerate(notes):
            px = pad + (xpt - 20) * S
            f = font(23, True)
            w, h = tw(d, txt, f)
            tx = min(max(px - w / 2, pad), pad + cw - w - 10)
            cap(d, tx, cy + j * 46, txt, colour, f)
            arrow(d, tx + w / 2, cy + j * 46 - 8, px, y + ch - 6, colour, 3)
        y += ch + 120
    im.save(f'{OUT}/EX2-line-item-anatomy.png')
    print('EX2', im.size)


# ------------------------------------------------------------------ EX3
def ex3():
    """The totals block: bold lost on Subtotal and Total."""
    a = page(OLD, 6).crop((int(380 * S), int(205 * S), int(580 * S), int(320 * S)))
    b = page(NEW, 4).crop((int(380 * S), int(20 * S), int(580 * S), int(135 * S)))
    cw, ch = a.size
    pad = 40; head = 200; gap = 70
    im = Image.new('RGB', (max(cw * 2 + pad * 2 + gap, 1500), head + ch + 150), (247, 248, 250))
    d = ImageDraw.Draw(im)
    d.text((pad, 22), 'The totals block', font=font(40, True), fill=DARK)
    for j, t in enumerate([
        'On the old document the Subtotal and the Total are bold, so the eye lands on the amount owed.',
        'On the new one every figure in the block is the same regular weight and nothing stands out.']):
        d.text((pad, 80 + j * 34), t, font=font(25), fill=GREY)
    for i, (img, lbl, colour) in enumerate([
            (a, 'OLD   Subtotal and Total are BOLD', GREEN),
            (b, 'NEW   Subtotal and Total are NOT bold', RED)]):
        x = pad + i * (cw + gap)
        d.rectangle([x, head - 36, x + cw, head - 6], fill=colour)
        d.text((x + 10, head - 33), lbl, font=font(21, True), fill=(255, 255, 255))
        im.paste(img, (x, head))
        d.rectangle([x, head, x + cw, head + ch], outline=(200, 205, 212), width=2)
    for i, (ys, ye, x0, x1, base) in enumerate([(255.4, 281.6, 512, 571, 205.0),
                                                (67.8, 94.0, 489, 542, 20.0)]):
        x = pad + i * (cw + gap)
        colour = GREEN if i == 0 else RED
        d.rectangle([x + (x0 - 380) * S, head + (ys - base - 1) * S,
                     x + (x1 - 380) * S, head + (ye - base + 12) * S], outline=colour, width=5)
    im.save(f'{OUT}/EX3-totals-block.png')
    print('EX3', im.size)


if __name__ == '__main__':
    ex1(); ex2(); ex3()
