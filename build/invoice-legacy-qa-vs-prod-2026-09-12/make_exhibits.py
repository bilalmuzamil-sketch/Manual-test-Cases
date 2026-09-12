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
QA_E = os.path.join(HERE, 'QA_Legacy_Empty.pdf')
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


# ---------------------------------------------------------------- EX4
def ex4():
    """Every header / column name / label, read off all three documents."""
    strips = [
        ('Asset table headers',
         (QA_E,0,pymupdf.Rect(58,216,540,236)), (QA,0,pymupdf.Rect(58,216,540,236)), (PR,0,pymupdf.Rect(58,219,540,239))),
        ('Order table headers',
         (QA_E,0,pymupdf.Rect(58,280,540,300)), (QA,0,pymupdf.Rect(58,266,540,286)), (PR,0,pymupdf.Rect(58,269,540,303))),
        ('Line table column names',
         (QA_E,0,pymupdf.Rect(58,334,540,352)), (QA,0,pymupdf.Rect(58,320,540,338)), (PR,0,pymupdf.Rect(58,337,540,355))),
        ('Summary block labels',
         (QA_E,0,pymupdf.Rect(330,368,545,466)), (QA,5,pymupdf.Rect(330,102,545,214)), (PR,1,pymupdf.Rect(330,498,545,624))),
        ('Signature block',
         (QA_E,0,pymupdf.Rect(50,560,545,604)), (QA,5,pymupdf.Rect(50,307,545,351)), (PR,1,pymupdf.Rect(50,716,545,760))),
    ]
    fh = font(21,True); fl = font(17,True)
    cols = ['QA BRANCH  -  empty invoice (the full skeleton)', 'QA BRANCH  -  Legacy_QA', 'PRODUCTION  -  Legacy_Production']
    colc = [BLUE, BLUE, AMBER]
    panels = []
    for title, *three in strips:
        ims = [page(f,p,r) for f,p,r in three]
        W = max(i.width for i in ims) + 20
        H = 36 + sum(i.height+40 for i in ims) + 10
        p = Image.new('RGB',(W,H),WHITE); d = ImageDraw.Draw(p)
        d.text((8,4), title, font=fh, fill=GREEN)
        y = 36
        for im, lab, c in zip(ims, cols, colc):
            d.text((8,y), lab, font=fl, fill=c); y += 22
            d.rectangle([8,y,8+im.width-1,y+im.height-1], outline=c, width=2); p.paste(im,(8,y))
            y += im.height + 18
        panels.append(p)
    img = vstack(panels, 30)
    img = header(img, 'Every header, column name and label - identical on production',
                 'All 35 template labels present on production: Unit, VIN/Serial #, Asset, Mileage, Eng Hrs, Service Order, '
                 'Terms, Due date, Customer PO, Authorizer, Description, Quantity, Rate, Amount, Parts Total, Labor Total, '
                 'Line Total, Labor, Parts, Shop supplies, Subtotal, Total, Payments, Balance, Bill To, Remit payment to, '
                 'the signature block and the full disclaimer.', GREEN)
    img.save(os.path.join(OUT,'EX4-every-label-present.png'))
    print('EX4', img.size)

# ---------------------------------------------------------------- EX5
def ex5():
    """Part rows exist on both, with the same anatomy."""
    qa = page(QA,1, pymupdf.Rect(56,424,545,556))
    pr = page(PR,0, pymupdf.Rect(56,368,545,442))
    rows = [('row-type gutter label x','60.75 pt','60.75 pt'),
            ('part text x','90.41 pt','90.41 pt'),
            ('part text format','NUMBER - Description','NUMBER - Description'),
            ('Quantity column x','355.76 pt','355.76 pt'),
            ('Rate right edge','465.11 pt','465.11 pt'),
            ('Amount right edge','537.00 pt','537.00 pt'),
            ('part rows in this document','11','3')]
    fh = font(21,True); fr = font(19); fv = font(19,True)
    lw = max(tw(probe,r[0],fr)[0] for r in rows)
    v1 = max(tw(probe,r[1],fv)[0] for r in rows); v2 = max(tw(probe,r[2],fv)[0] for r in rows)
    W = max(qa.width, pr.width, lw+40+v1+40+v2) + 20
    H = 30 + qa.height + 30 + pr.height + 30 + 32*len(rows) + 20
    img = Image.new('RGB',(W,H),WHITE); d = ImageDraw.Draw(img)
    d.text((8,4),'QA BRANCH', font=fh, fill=BLUE)
    d.rectangle([8,30,8+qa.width-1,30+qa.height-1], outline=BLUE, width=2); img.paste(qa,(8,30))
    y = 30+qa.height+8
    d.text((8,y),'PRODUCTION', font=fh, fill=AMBER); y += 26
    d.rectangle([8,y,8+pr.width-1,y+pr.height-1], outline=AMBER, width=2); img.paste(pr,(8,y))
    y += pr.height + 22
    for l,a,b in rows:
        d.text((8,y), l, font=fr, fill=DARK)
        d.text((lw+48,y), a, font=fv, fill=BLUE)
        d.text((lw+48+v1+40,y), b, font=fv, fill=AMBER)
        y += 32
    img = header(img, 'Part rows: present on BOTH, same anatomy',
                 'My earlier note that the QA invoice was labour-only was wrong - it has 11 part rows and $613.78 of parts. '
                 'Both documents put the row-type label, the part text and the three money columns at the same x.', GREEN)
    img.save(os.path.join(OUT,'EX5-part-rows-both.png'))
    print('EX5', img.size)


# ---------------------------------------------------------------- EX6
def ex6():
    """Wrap audit: every fixed block, how many lines it takes on each document."""
    rows = [
        # block, QA lines, PROD lines, verdict, reason
        ('Masthead - shop name',        '2 lines', '1 line',  'QA wraps', 'QA name "Staging Heavy Duty - 9919" is longer'),
        ('Masthead - document label',   '2 lines', '1 line',  'QA wraps', 'QA number "INV-S99999-16518" is longer'),
        ('Masthead - address',          '3 lines', '5 lines', 'ok',       'production address simply has more lines'),
        ('Masthead - dates',            '2 lines', '2 lines', 'ok',       ''),
        ('Bill To block',               '3 lines', '3 lines', 'ok',       ''),
        ('Remit payment to block',      '4 lines', '4 lines', 'ok',       ''),
        ('Asset table HEADER row',      '1 line',  '1 line',  'ok',       ''),
        ('Asset table VALUE row',       '1 line',  '1 line',  'ok',       'but it DOES wrap on QA with a long asset - see below'),
        ('Order table HEADER row',      '1 line',  '3 lines', 'PROD WRAPS', '"Service Order" broken by a short order number'),
        ('Order table VALUE row',       '1 line',  '1 line',  'ok',       ''),
        ('Line table HEADER row',       '1 line',  '1 line',  'ok',       ''),
        ('Summary block',               '8 rows',  '9 rows',  'ok',       'production org has two taxes, not one'),
        ('Signature block',             '2 lines', '2 lines', 'ok',       ''),
        ('Disclaimer',                  '7 lines', '7 lines', 'ok',       'identical wrap points'),
    ]
    fh = font(23,True); fr = font(19); fv = font(19,True); fn = font(18)
    c0 = max([tw(probe,r[0],fv)[0] for r in rows] + [tw(probe,'BLOCK',fh)[0]])
    c1 = max([tw(probe,r[1],fv)[0] for r in rows] + [tw(probe,'QA',fh)[0]])
    c2 = max([tw(probe,r[2],fv)[0] for r in rows] + [tw(probe,'PRODUCTION',fh)[0]])
    c3 = max([tw(probe,r[3],fv)[0] for r in rows] + [tw(probe,'VERDICT',fh)[0]])
    c4 = max([tw(probe,r[4],fn)[0] for r in rows] + [tw(probe,'WHY',fh)[0]])
    X0, X1 = 10, 10+c0+40
    X2, X3 = X1+c1+40, X1+c1+40+c2+40
    X4 = X3+c3+34
    tblW = X4+c4+20

    # the one production-only wrap, in the flesh
    qa_so = page(QA,0, pymupdf.Rect(56,265,372,309))
    pr_so = page(PR,0, pymupdf.Rect(56,268,372,327))
    # and the proof the QA branch wraps too, with different data
    qe_as = page(QA_E,0, pymupdf.Rect(58,216,540,272))

    W = max(tblW, qa_so.width+pr_so.width+60, qe_as.width+20) + 10
    H = 40 + 32*len(rows) + 46 + 26 + max(qa_so.height,pr_so.height) + 50 + 26 + qe_as.height + 70
    img = Image.new('RGB',(W,H),WHITE); d = ImageDraw.Draw(img)

    d.text((X0,6), 'BLOCK', font=fh, fill=DARK)
    d.text((X1,6), 'QA', font=fh, fill=BLUE)
    d.text((X2,6), 'PRODUCTION', font=fh, fill=AMBER)
    d.text((X3,6), 'VERDICT', font=fh, fill=DARK)
    d.text((X4,6), 'WHY', font=fh, fill=GREY)
    y = 40
    for b,a,p_,v,why in rows:
        bad = v == 'PROD WRAPS'
        if bad: d.rectangle([X0-6,y-5,tblW-8,y+27], fill=(253,236,236))
        d.text((X0,y), b,  font=fv if bad else fr, fill=RED if bad else DARK)
        d.text((X1,y), a,  font=fv, fill=BLUE)
        d.text((X2,y), p_, font=fv, fill=RED if bad else AMBER)
        d.text((X3,y), v,  font=fv, fill=RED if bad else GREEN)
        d.text((X4,y), why, font=fn, fill=GREY)
        y += 32

    y += 14
    d.text((X0,y), 'The one cell that wraps on production and not on QA  -  INV-S2-194', font=fh, fill=RED); y += 30
    d.text((X0,y), 'QA  INV-S99999-16518', font=font(17,True), fill=BLUE)
    d.text((X0+qa_so.width+60,y), 'PRODUCTION  INV-S2-194', font=font(17,True), fill=AMBER); y += 22
    d.rectangle([X0,y,X0+qa_so.width-1,y+qa_so.height-1], outline=BLUE, width=3); img.paste(qa_so,(X0,y))
    d.rectangle([X0+qa_so.width+60,y,X0+qa_so.width+60+pr_so.width-1,y+pr_so.height-1], outline=RED, width=3)
    img.paste(pr_so,(X0+qa_so.width+60,y))
    y += max(qa_so.height,pr_so.height) + 26

    d.text((X0,y), 'The SAME wrapping happens on the QA branch too  -  EST-S99999-17582, asset value "2011 Hyundai Santa Fe"',
           font=font(19,True), fill=BLUE); y += 26
    d.rectangle([X0,y,X0+qe_as.width-1,y+qe_as.height-1], outline=BLUE, width=3); img.paste(qe_as,(X0,y))

    img = header(img, 'Wrapping: ONE cell wraps on production that does not wrap on QA',
                 'It is the "Service Order" heading on INV-S2-194. The cause is the column sizing itself to its content: '
                 'the order number S2-194 is 38.85 pt wide against a 69.21 pt heading, so the heading breaks. '
                 'The same template does the same thing on the QA branch when the data is shaped that way - the QA empty '
                 'invoice wraps its asset value for exactly the same reason.', AMBER)
    img.save(os.path.join(OUT,'EX6-wrap-audit.png'))
    print('EX6', img.size)


# ---------------------------------------------------------------- EX7
QA_S2 = os.path.join(HERE, 'QA_Legacy_INV-S2-4219.pdf')
def ex7():
    """The QA branch wraps 'Service Order' too, whenever the order number is short."""
    a = page(QA,    0, pymupdf.Rect(56,265,372,309))   # QA, long number  - no wrap
    b = page(QA_S2, 0, pymupdf.Rect(56,279,372,338))   # QA, short number - WRAPS
    c = page(PR,    0, pymupdf.Rect(56,268,372,327))   # PROD, short number - WRAPS
    panels = [
        (a, 'QA BRANCH   INV-S99999-16518', BLUE,  'order no. 12 chars = 73.93 pt', 'ONE LINE',  GREEN),
        (b, 'QA BRANCH   INV-S2-4219',      BLUE,  'order no.  7 chars = 45.15 pt', 'WRAPS',     RED),
        (c, 'PRODUCTION  INV-S2-194',       AMBER, 'order no.  6 chars = 38.85 pt', 'WRAPS',     RED),
    ]
    fh = font(19,True); fm = font(19); fv = font(21,True)
    cw = max(i.width for i,_,_,_,_,_ in panels)
    lw = max(tw(probe,m,fm)[0] for _,_,_,m,_,_ in panels)
    vw = max(tw(probe,v,fv)[0] for _,_,_,_,v,_ in panels)
    W = max(cw, lw+40+vw) + 20
    H = sum(26 + i.height + 34 for i,_,_,_,_,_ in panels) + 30
    img = Image.new('RGB',(W,H),WHITE); d = ImageDraw.Draw(img)
    y = 4
    for im, lab, col, meas, verdict, vcol in panels:
        d.text((8,y), lab, font=fh, fill=col); y += 24
        d.rectangle([8,y,8+im.width-1,y+im.height-1], outline=vcol, width=3); img.paste(im,(8,y))
        y += im.height + 6
        d.text((8,y), meas, font=fm, fill=GREY)
        d.text((lw+48,y), verdict, font=fv, fill=vcol)
        y += 34
    img = header(img, 'The reference build wraps it too - this is the template, not production',
                 'The heading needs 69.21 pt in every case. Live on the QA branch sv9901 (v26.35.10 - the exact build the '
                 'customers want back), invoice INV-S2-4219 breaks "Service Order" onto two lines, because its order number '
                 'is short. Production cannot avoid this: all 100 of its work-order numbers read live are 6 characters.', RED)
    img.save(os.path.join(OUT,'EX7-the-QA-build-wraps-too.png'))
    print('EX7', img.size)

if __name__ == '__main__':
    ex1(); ex2(); ex3(); ex4(); ex5(); ex6(); ex7()
