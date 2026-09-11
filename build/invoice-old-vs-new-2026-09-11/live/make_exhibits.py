#!/usr/bin/env python3
"""Live exhibits: the same work order rendered on v26.35.10 and on v26.36.2.

EX1  the template proof - identical once the display settings match
EX2  the real cause - one display toggle on the work order's Finance tab

Boxes are placed from coordinates measured out of the PDFs, never by eye.
"""
import os, math, pymupdf
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'ev'); os.makedirs(OUT, exist_ok=True)
OLD = os.path.join(HERE, 'v26.35.10-sv9901.pdf')
NEWM = os.path.join(HERE, 'v26.36.2-sv9872-settings-matched.pdf')
NEWA = os.path.join(HERE, 'v26.36.2-sv9872-as-found.pdf')
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
    a = page(OLD, 0); b = page(NEWM, 0)
    W, H = a.size
    pad, gapx, head = 44, 60, 360
    im = Image.new('RGB', (W * 2 + pad * 2 + gapx, H + head + 420), (247, 248, 250))
    d = ImageDraw.Draw(im)
    d.text((pad, 24), 'The same invoice, rendered on both builds', font=font(48, True), fill=DARK)
    for j, t in enumerate([
        'Work order S-16810 on two QA branches: sv9901 running v26.35.10, and sv9872 running v26.36.2.',
        'Same work order, same lines, same money - and the invoice display settings were made identical first,',
        'because they were not: sv9872 had "Summarize labor total" switched off. That is covered in the next exhibit.',
        'With the settings matched, the two documents were compared element by element straight out of the PDF files.']):
        d.text((pad, 96 + j * 38), t, font=font(28), fill=GREY)

    for i, (img, lbl, colour) in enumerate([
            (a, 'sv9901   ·   v26.35.10-7b9a47d', GREEN),
            (b, 'sv9872   ·   v26.36.2-ad8b0e2', BLUE)]):
        x = pad + i * (W + gapx)
        d.rectangle([x, head - 38, x + W, head - 6], fill=colour)
        d.text((x + 12, head - 35), lbl, font=font(26, True), fill=(255, 255, 255))
        im.paste(img, (x, head))
        d.rectangle([x, head, x + W, head + H], outline=(200, 205, 212), width=2)
        # box the invoice number, the only thing that differs
        d.rectangle([x + (438.0) * S, head + (24.0) * S, x + (545.0) * S, head + (60.0) * S],
                    outline=AMBER, width=5)

    y = head + H + 40
    d.text((pad, y), 'Result: the documents are the same', font=font(38, True), fill=GREEN)
    facts = [
        ('1,050 text elements on each', 'position, size, weight, colour and text compared one by one'),
        ('1,037 of them identical', 'to a hundredth of a point'),
        ('13 differ, and all 13 are the same thing', 'the branch name inside the invoice number - "S9901-16810" against "S9872-16810"'),
        ('225 lines, rules and boxes on each', '0 differ - same positions, same heights, same fills'),
        ('11 pages on each', 'the same content falls on the same page in both'),
        ('The letterhead image', 'byte for byte the same file'),
    ]
    for i, (k, v) in enumerate(facts):
        yy = y + 58 + i * 40
        d.text((pad + 20, yy), '✓', font=font(30, True), fill=GREEN)
        d.text((pad + 62, yy), k, font=font(30, True), fill=DARK)
        d.text((pad + 800, yy), v, font=font(28), fill=GREY)
    d.text((pad, y + 58 + len(facts) * 40 + 18),
           'Amber marks the invoice number - the only difference, and it is the QA branch\'s own name, not the design.',
           font=font(28, True), fill=AMBER)
    im.save(f'{OUT}/EX1-same-invoice-both-builds.png')
    print('EX1', im.size)


# ------------------------------------------------------------------ EX2
def ex2():
    """Same branch, same invoice - only the display toggle changed."""
    X0, X1 = 52, 566
    a = page(NEWA, 0).crop((int(X0 * S), int(374 * S), int(X1 * S), int(497 * S)))
    b = page(NEWM, 0).crop((int(X0 * S), int(374 * S), int(X1 * S), int(515 * S)))
    cw = a.size[0]
    probe = ImageDraw.Draw(Image.new('RGB', (10, 10)))
    subs = [
        'Both panels are the SAME invoice on the SAME branch, sv9872. The only thing changed between them',
        'is one switch on the work order\'s Finance tab: "Summarize labor total".',
        'Switching it on brought the Labor Total row back on all 29 job lines, and the invoice went from 10 pages to 11 -',
        'which is exactly what the v26.35.10 copy prints. Nothing in the template was touched.']
    cap2 = 'Two rows here - no "Labor Total".'
    need = max([tw(probe, t, font(28))[0] for t in subs]
               + [tw(probe, 'What was actually causing it: one switch', font(48, True))[0],
                  tw(probe, cap2, font(29, True))[0] + 40, cw])
    pad, head = 44, 300
    Wd = need + pad * 2
    H = head + (36 + a.size[1] + 130) + (36 + b.size[1] + 110) + pad
    im = Image.new('RGB', (Wd, H), (247, 248, 250))
    d = ImageDraw.Draw(im)
    d.text((pad, 24), 'What was actually causing it: one switch', font=font(48, True), fill=DARK)
    for j, t in enumerate(subs):
        d.text((pad, 100 + j * 38), t, font=font(28), fill=GREY)

    y = head
    d.rectangle([pad - 4, y, pad + cw + 4, y + 34], fill=RED)
    d.text((pad + 10, y + 5), 'sv9872   switch OFF   ·   10 pages   ·   0 Labor Total rows',
           font=font(24, True), fill=(255, 255, 255))
    y += 38
    im.paste(a, (pad, y))
    d.rectangle([pad, y, pad + cw, y + a.size[1]], outline=(200, 205, 212), width=2)
    bx0, bx1 = pad + (393.0 - X0) * S, pad + (535.3 - X0) * S
    d.rectangle([bx0 - 6, y + (464.5 - 374) * S, bx1 + 6, y + (500.5 - 374) * S], outline=RED, width=6)
    f = font(29, True)
    w1, _ = tw(d, cap2, f)
    cx = max(pad, min(bx0 - w1 * 0.55, Wd - pad - w1 - 12))
    cap(d, cx, y + a.size[1] + 46, cap2, RED, f)
    arrow(d, cx + w1 * 0.78, y + a.size[1] + 40, bx0 + (bx1 - bx0) / 2, y + (501.5 - 374) * S, RED)
    y += a.size[1] + 130

    d.rectangle([pad - 4, y, pad + cw + 4, y + 34], fill=GREEN)
    d.text((pad + 10, y + 5), 'sv9872   switch ON   ·   11 pages   ·   29 Labor Total rows',
           font=font(24, True), fill=(255, 255, 255))
    y += 38
    im.paste(b, (pad, y))
    d.rectangle([pad, y, pad + cw, y + b.size[1]], outline=(200, 205, 212), width=2)
    d.rectangle([bx0 - 6, y + (464.5 - 374) * S, bx1 + 6, y + (518.0 - 374) * S], outline=GREEN, width=6)
    cap(d, cx, y + b.size[1] + 18, 'Three rows here - "Labor Total" is back.', GREEN, f)
    im.save(f'{OUT}/EX2-the-switch.png')
    print('EX2', im.size)


if __name__ == '__main__':
    ex1(); ex2()
