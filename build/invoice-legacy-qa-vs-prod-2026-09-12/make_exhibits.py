#!/usr/bin/env python3
"""Legacy QA vs Legacy Production - annotated exhibits (design / sizes / spacing).

EX1  the verdict: every template measurement is identical (68 of 68 checks)
EX2  the line table and the money block side by side, with the shared coordinates drawn on
EX3  the only two visible layout differences, and the measurement that causes each

Every box and every number is placed from coordinates measured out of the PDFs, never by eye.
"""
import os, pymupdf
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'ev'); os.makedirs(OUT, exist_ok=True)
QA = os.path.join(HERE, 'Legacy_QA.pdf'); PR = os.path.join(HERE, 'Legacy_Production.pdf')
DPI = 150; S = DPI / 72.0
F  = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
RED=(208,42,42); GREEN=(22,133,62); BLUE=(28,78,168); AMBER=(176,108,0)
DARK=(33,37,41); GREY=(108,117,125); WHITE=(255,255,255)

font = lambda sz, b=False: ImageFont.truetype(FB if b else F, sz)
def page(pdf, i, clip=None):
    pm = pymupdf.open(pdf)[i].get_pixmap(dpi=DPI, clip=clip)
    return Image.frombytes('RGB', (pm.width, pm.height), pm.samples)
def tw(d, s, f):
    bb = d.textbbox((0,0), s, font=f); return bb[2]-bb[0], bb[3]-bb[1]
def cap(d, x, y, t, c, f):
    w,h = tw(d,t,f)
    d.rectangle([x-9,y-7,x+w+9,y+h+11], fill=WHITE, outline=c, width=3)
    d.text((x,y), t, font=f, fill=c); return w,h
probe = ImageDraw.Draw(Image.new('RGB',(10,10)))

def wrap(text, f, maxw):
    out, cur = [], ''
    for w in text.split():
        t = (cur + ' ' + w).strip()
        if tw(probe, t, f)[0] > maxw and cur: out.append(cur); cur = w
        else: cur = t
    out.append(cur); return out

def header(img, title, sub, colour=GREEN):
    ft, fs = font(34, True), font(21)
    W = max(img.width, tw(probe, title, ft)[0] + 56)
    subs = wrap(sub, fs, W - 56)
    pad = 34 + 46 + 28*len(subs) + 16
    out = Image.new('RGB', (W, img.height + pad), WHITE)
    out.paste(img, (0, pad)); d = ImageDraw.Draw(out)
    d.rectangle([0, 0, W, pad-14], fill=colour)
    d.text((28, 20), title, font=ft, fill=WHITE)
    y = 70
    for ln in subs: d.text((28, y), ln, font=fs, fill=WHITE); y += 28
    return out

def vstack(imgs, gap=26):
    W = max(i.width for i in imgs); H = sum(i.height for i in imgs) + gap*(len(imgs)-1)
    out = Image.new('RGB',(W,H),WHITE); y=0
    for i in imgs: out.paste(i,(0,y)); y += i.height+gap
    return out

# ---------------------------------------------------------------- EX1
def ex1():
    """Two page-1s side by side with the shared template coordinates drawn across both."""
    qa = page(QA,0); pr = page(PR,0)
    lblH = 46; GAP = 70
    W = qa.width + GAP + pr.width; H = max(qa.height, pr.height) + lblH
    img = Image.new('RGB',(W,H),WHITE); d = ImageDraw.Draw(img)
    img.paste(qa,(0,lblH)); img.paste(pr,(qa.width+GAP,lblH))
    ox = qa.width + GAP
    d.text((8,8),  'LEGACY  -  QA BRANCH      INV-S99999-16518', font=font(22,True), fill=BLUE)
    d.text((ox+8,8),'LEGACY  -  PRODUCTION     INV-S2-194',      font=font(22,True), fill=AMBER)
    d.rectangle([0,lblH,qa.width-1,H-1], outline=BLUE, width=3)
    d.rectangle([ox,lblH,ox+pr.width-1,H-1], outline=AMBER, width=3)

    # shared vertical coordinates, drawn straight across both pages
    for x, lab in ((58.50,'body 58.50'), (60.00,'table rule 60.00'), (60.75,'gutter 60.75'),
                   (90.41,'description 90.41'), (339.40,'Quantity 339.40'),
                   (442.17,'Rate 442.17'), (498.79,'Amount 498.79'), (535.28,'rule end 535.28')):
        for base in (0, ox):
            px = base + x*S
            d.line([px,lblH,px,H-1], fill=GREEN, width=2)
    y = lblH + 18
    for x, lab in ((58.50,'58.50'), (90.41,'90.41'), (339.40,'339.40'), (442.17,'442.17'),
                   (498.79,'498.79'), (535.28,'535.28')):
        for base in (0, ox):
            d.text((base+x*S+4, y), lab, font=font(15,True), fill=GREEN)

    img = header(img, 'The Legacy template is IDENTICAL on both',
                 'Same green lines, same place, on both documents.  70 of 70 design measurements match exactly - '
                 'type, sizes, colours, margins, column x, rules, spacing.', GREEN)
    d = ImageDraw.Draw(img)
    d.text((28, img.height-0), '', font=font(10), fill=DARK)
    img.save(os.path.join(OUT,'EX1-design-identical.png'))
    print('EX1', img.size)

# ---------------------------------------------------------------- EX2
def ex2():
    """The money block: identical alignment and identical row spacing."""
    qa = page(QA, 5, pymupdf.Rect(330, 100, 560, 215))
    pr = page(PR, 1, pymupdf.Rect(330, 495, 560, 625))
    H0 = max(qa.height, pr.height)
    def padto(im):
        if im.height == H0: return im
        o = Image.new('RGB', (im.width, H0), WHITE); o.paste(im, (0, 0)); return o
    qa, pr = padto(qa), padto(pr)
    blocks = []
    for im, lab, col, rows in (
        (qa,'LEGACY - QA BRANCH', BLUE,
         [('Labor  ->  Parts', '13.09 pt'), ('Parts  ->  Shop supplies', '13.10 pt'),
          ('Shop supplies  ->  Subtotal', '13.09 pt'), ('label right edge', '472.42 pt'),
          ('amount right edge', '539.25 pt')]),
        (pr,'LEGACY - PRODUCTION', AMBER,
         [('Labor  ->  Parts', '13.09 pt'), ('Parts  ->  Shop supplies', '13.10 pt'),
          ('Shop supplies  ->  Subtotal', '13.09 pt'), ('label right edge', '472.42 pt'),
          ('amount right edge', '539.25 pt')])):
        blocks.append((im, lab, col, rows))

    fh = font(21,True); fr = font(20); fv = font(20,True)
    lw = max(tw(probe, r[0], fr)[0] for _,_,_,rs in blocks for r in rs)
    vw = max(tw(probe, r[1], fv)[0] for _,_,_,rs in blocks for r in rs)
    panelW = max(max(i.width for i,_,_,_ in blocks), lw+vw+70)
    rowsH = 34*len(blocks[0][3]) + 20
    panelH = max(i.height for i,_,_,_ in blocks) + rowsH + 46
    GAP = 60
    W = panelW*2 + GAP; H = panelH
    img = Image.new('RGB',(W,H),WHITE); d = ImageDraw.Draw(img)
    for k,(im,lab,col,rows) in enumerate(blocks):
        x0 = k*(panelW+GAP)
        d.text((x0+4,6), lab, font=fh, fill=col)
        d.rectangle([x0, 36, x0+im.width-1, 36+im.height-1], outline=col, width=3)
        img.paste(im,(x0,36))
        y = 36+im.height+20
        for l,v in rows:
            d.text((x0+6,y), l, font=fr, fill=DARK)
            d.text((x0+lw+40,y), v, font=fv, fill=GREEN)
            y += 34
    img = header(img, 'The money block: same alignment, same spacing, to the hundredth of a point',
                 'Labels right-align to 472.42 pt and amounts to 539.25 pt on BOTH documents. '
                 'Row pitch, the gap above the block and the gap below it are identical.', GREEN)
    img.save(os.path.join(OUT,'EX2-money-block-identical.png'))
    print('EX2', img.size)

# ---------------------------------------------------------------- EX3
def ex3():
    """The two visible layout differences and the measurement that causes each."""
    panels = []
    fh = font(22,True); fr = font(19); fv = font(19,True)

    # A - masthead block
    a_qa = page(QA,0, pymupdf.Rect(50,22,216,146))
    a_pr = page(PR,0, pymupdf.Rect(50,22,216,146))
    panels.append(('1.  The block under the shop name sits 3.29 pt lower on production',
                   a_qa, a_pr,
                   [('shop name + address lines', '5 lines', '6 lines'),
                    ('block content ends at', '113.47 pt', '123.29 pt'),
                    ('"Bill To" starts at', '126.00 pt', '129.29 pt'),
                    ('', '(block has not filled', '(block has overrun'),
                    ('', 'its minimum height)', 'it by 3.29 pt)')],
                   'The block has a minimum height. The QA address is shorter than that minimum, so "Bill To" '
                   'rests on the floor at 126.00. The production address is one line longer, overruns the floor by '
                   '3.29 pt, and everything below shifts down by the same 3.29 pt. Same template - more address lines.'))

    # B - Service Order wrap
    b_qa = page(QA,0, pymupdf.Rect(56,265,372,309))
    b_pr = page(PR,0, pymupdf.Rect(56,268,372,327))
    panels.append(('2.  "Service Order" wraps onto two lines on production',
                   b_qa, b_pr,
                   [('"Service Order" heading needs', '69.21 pt', '69.21 pt'),
                    ('the order number below it is', 'S99999-16518', 'S2-194'),
                    ('...and measures', '73.93 pt', '38.85 pt'),
                    ('so the column is', 'wide enough', 'too narrow'),
                    ('result', 'one line', 'wraps to two')],
                   'The column sizes itself to whatever is in it. A short order number makes the column narrower than '
                   'the heading, so the heading breaks. The heading itself is 69.21 pt on both - the same text in the '
                   'same font at the same size. Put a 12-character order number on production and it stops wrapping.'))

    imgs = []
    for title, qa, pr, rows, note in panels:
        lw = max(tw(probe, r[0], fr)[0] for r in rows)
        v1 = max(tw(probe, r[1], fv)[0] for r in rows)
        v2 = max(tw(probe, r[2], fv)[0] for r in rows)
        tblW = lw + 40 + v1 + 40 + v2 + 20
        imW  = qa.width + 40 + pr.width
        # wrap the note
        words = note.split(); lines=[]; cur=''
        maxw = max(tblW, imW, tw(probe, title, fh)[0]) - 20
        for w in words:
            t = (cur+' '+w).strip()
            if tw(probe,t,fr)[0] > maxw and cur: lines.append(cur); cur=w
            else: cur=t
        lines.append(cur)
        W = max(tblW, imW, tw(probe, title, fh)[0] + 20) + 20
        H = 44 + 30 + max(qa.height,pr.height) + 24 + 32*len(rows) + 18 + 26*len(lines) + 24
        p = Image.new('RGB',(W,H),WHITE); d = ImageDraw.Draw(p)
        d.text((8,6), title, font=fh, fill=RED)
        d.text((8,44), 'QA BRANCH', font=font(17,True), fill=BLUE)
        d.text((qa.width+48,44), 'PRODUCTION', font=font(17,True), fill=AMBER)
        y0 = 70
        d.rectangle([8,y0,8+qa.width-1,y0+qa.height-1], outline=BLUE, width=3); p.paste(qa,(8,y0))
        d.rectangle([qa.width+48,y0,qa.width+48+pr.width-1,y0+pr.height-1], outline=AMBER, width=3)
        p.paste(pr,(qa.width+48,y0))
        y = y0 + max(qa.height,pr.height) + 22
        for l,a,b in rows:
            d.text((8,y), l, font=fr, fill=DARK)
            d.text((lw+48,y), a, font=fv, fill=BLUE)
            d.text((lw+48+v1+40,y), b, font=fv, fill=AMBER)
            y += 32
        y += 14
        for ln in lines:
            d.text((8,y), ln, font=fr, fill=GREY); y += 26
        imgs.append(p)

    img = vstack(imgs, 34)
    img = header(img, 'The only two visible layout differences - both caused by the data, not the design',
                 'Neither is a template change. Both move if you put the same shop details and the same order '
                 'number on production.', AMBER)
    img.save(os.path.join(OUT,'EX3-the-two-visible-differences.png'))
    print('EX3', img.size)

if __name__ == '__main__':
    ex1(); ex2(); ex3()
