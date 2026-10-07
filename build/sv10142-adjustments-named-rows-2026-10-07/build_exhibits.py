"""SV-10142 exhibits. Run: python3 build_exhibits.py  (from this folder)."""
import json, sys, pymupdf
sys.path.insert(0, '../testing-tools')
from ticket_exhibit import panel, stack

RED, GREEN, BLUE = (214, 40, 40), (22, 135, 60), (30, 90, 200)
R = 'ev/raw/'


Z = 4   # render zoom; crop/box units are half-points so panel(scale=2) stays sharp


def pdf_lines(pdf):
    """Page holding 'Adjustments', plus the text lines between that heading and Subtotal."""
    d = pymupdf.open(pdf)
    for pg in d:
        ws = pg.get_text('words')
        heads = [w for w in ws if w[4] == 'Adjustments']
        if not heads:
            continue
        a = heads[0]
        sub = sorted([w for w in ws if w[4] == 'Subtotal' and w[1] > a[1]], key=lambda w: w[1])[0]
        rows = {}
        for w in ws:
            if a[3] - 1 < w[1] < sub[1] - 1 and w[0] > a[0] - 140:
                rows.setdefault((w[5], w[6]), []).append(w)
        lines = []
        for ws_ in rows.values():
            ws_.sort(key=lambda w: w[0])
            lines.append({'t': ' '.join(w[4] for w in ws_), 'x0': ws_[0][0], 'y0': min(w[1] for w in ws_),
                          'x1': ws_[-1][2], 'y1': max(w[3] for w in ws_)})
        lines = [l for l in lines if l['x1'] > a[0] + 2]   # drop the disclaimer column to the left
        lines.sort(key=lambda l: l['y0'])
        return pg, a, sub, lines
    raise SystemExit('no Adjustments in ' + pdf)


def pdf_panel(pdf, png, title, marks, notes):
    from PIL import Image, ImageDraw
    pg, a, sub, lines = pdf_lines(pdf)
    pg.get_pixmap(matrix=pymupdf.Matrix(Z, Z)).save(png)
    x0 = min([a[0], sub[0]] + [l['x0'] for l in lines]); x1 = max([l['x1'] for l in lines] + [sub[2]]) + 4
    crop_pt = (x0 - 24, a[1] - 3, x1 + 18, sub[3] + 3)
    # blank everything outside the block so stray text from the next column does not show
    im = Image.open(png); dr = ImageDraw.Draw(im); k = Z
    dr.rectangle([0, 0, (x0 - 3) * k, im.height], fill='white')
    dr.rectangle([0, 0, im.width, (a[1] - 1.5) * k], fill='white')
    dr.rectangle([0, (sub[3] + 1.5) * k, im.width, im.height], fill='white')
    im.save(png)
    u = 2  # half-points per point
    crop = tuple(v * u for v in crop_pt)
    boxes = []
    for label, colour, n in marks:
        hit = [l for l in lines if l['t'].split('$')[0].split('(')[0].strip() == label][0]
        boxes.append((hit['x0'] * u, hit['y0'] * u - 2, x1 * u, hit['y1'] * u + 2, colour, n))
    return panel(png, crop, title, boxes, notes, scale=Z // u)


def screen_panel(png, geo, L, title, marks, notes, bottom=None):
    g = json.load(open(geo))[L]
    h = g['rows']['head']
    near = g['rows']['near']
    y_end = bottom or max(n['y'] + n['h'] for n in near if n['t'] == 'Subtotal')
    x1 = h['x'] + h['w']
    crop = (h['x'] - 44, h['y'] - 12, x1 + 34, y_end + 8)
    from PIL import Image, ImageDraw
    clean = png.replace('.png', '-clean.png'); im = Image.open(png).convert('RGB')
    ImageDraw.Draw(im).rectangle([0, 0, (h['x'] - 4) * 2, im.height], fill='white'); im.save(clean); png = clean
    boxes = []
    for label, colour, n in marks:
        r = [k for k in near if k['t'] == label][0] if isinstance(label, str) else label
        boxes.append((r['x'], r['y'] - 2, x1, r['y'] + r['h'] + 2, colour, n))
    return panel(png, crop, title, boxes, notes)


# ---------- 01 BEFORE vs AFTER (same fees, same entry order, estimate, new layout) ----------
before = pdf_panel(R + 'prod-estimate-S962-modern.pdf', R + 'p-before.png',
    'BEFORE - production app.shopview.com, build v26.40.9-27b6bca, 7 Oct 2026. Estimate S-962, new invoice layout.',
    [('Labor', RED, 1), ('Parts', RED, 2)],
    [(1, RED, 'Every labor-line fee is summed into one "Labor" row: the Shop fee and Diagnostic fee names never print.'),
     (2, RED, 'The parts Environmental fee ($6.00) and Core discount ($5.00) are netted into "Parts $1.00".')])
after = pdf_panel(R + 'estimate-A.pdf', R + 'p-after.png',
    'AFTER - QA branch sv10142, build v26.40.3-d72fa24, 7 Oct 2026. Estimate S-17580, same fees entered the same way.',
    [('Labor · Shop fee', GREEN, 1), ('Labor · Diagnostic fee', GREEN, 2), ('Parts · Core discount', GREEN, 3),
     ('Parts · Environmental fee', GREEN, 4)],
    [(1, GREEN, 'Each fee prints its own name. Three $15.00 Shop fees combine into one $45.00 row.'),
     (2, GREEN, 'The Diagnostic fee has its own row.'),
     (3, GREEN, 'The parts discount and fee are no longer netted: ($5.00) and $6.00 print separately.'),
     (4, GREEN, 'Two $3.00 Environmental fees combine into $6.00. The adjustments add up to the same $61.00 on both builds (the subtotals differ only because the labor lines are priced differently).')])
stack([before, after]).save('ev/01-before-vs-after-hd.png')

# ---------- 02 FAIL: the order inside a group follows entry order ----------
c = screen_panel(R + 'screen-C.png', R + 'geo-CD.json', 'C',
    'S-17582, Finance tab. Fees entered in this order: Shop fee, Diagnostic fee, Core discount, Environmental fee.',
    [('Labor · Shop fee', RED, 1), ('Labor · Diagnostic fee', RED, 1), ('Parts · Core discount', RED, 2),
     ('Parts · Environmental fee', RED, 2)],
    [(1, RED, 'Labor prints Shop fee before Diagnostic fee - the order they were entered, not A to Z.'),
     (2, RED, 'Parts prints the Core discount before the Environmental fee - a discount before a fee.')])
d = screen_panel(R + 'screen-D.png', R + 'geo-CD.json', 'D',
    "S-17583, Finance tab. The same fees, entered in the order of Chris's example.",
    [('Labor · Diagnostic fee', GREEN, 3), ('Labor · Shop fee', GREEN, 3), ('Parts · Environmental fee', GREEN, 4), ('Parts · Core discount', GREEN, 4)],
    [(3, GREEN, 'Labor prints Diagnostic fee, then Shop fee - only because the Diagnostic fee was entered first.'),
     (4, GREEN, "Parts prints the Environmental fee, then the Core discount - again only because of the entry order. Chris's comment 78126 asks for THIS order on both work orders, whatever order the fees were entered in.")])
stack([c, d]).save('ev/02-order-follows-entry-order-hd.png')

# ---------- 03 variants on S-17584 ----------
g = json.load(open(R + 'geo-E.json'))['E']
e = screen_panel(R + 'screen-E.png', R + 'geo-E.json', 'E',
    'S-17584, Finance tab. Fees and discounts entered Z-first, with repeated names.',
    [('Labor · Zeta fee', RED, 1), ('Labor · Zulu discount', RED, 1), ('Labor · Shop fee', GREEN, 2)]
    + [({'x': k['x'], 'y': k['y'], 'h': k['h']}, GREEN, 3) for k in g['rows']['near'] if k['t'] == 'Labor · Promo']
    + [({'x': k['x'], 'y': k['y'], 'h': k['h']}, BLUE, 4) for k in g['rows']['near'] if k['t'] == 'Loyalty discount'],
    [(1, RED, 'Labor opens with Zeta fee, then Zulu discount: entry order, fees and discounts mixed. Expected: Alpha fee, Promo, Shop fee, Zeta fee, then Bravo discount, Promo, Zulu discount.'),
     (2, GREEN, 'A flat $5.00 Shop fee and a 2%-of-labor Shop fee ($3.00) combine into one $8.00 row, as Chris confirmed.'),
     (3, GREEN, '"Promo" as a fee ($10.00) and "Promo" as a discount ($4.00) stay two rows - a fee and a discount never combine.'),
     (4, BLUE, 'Work-order-wide rows are not combined: two Loyalty discounts print as two rows, as Stefan described and Chris accepted.'),
     (5, GREEN, 'Not printed, correctly: a "Tiny fee" of 0.01% on a $4.56 part, which works out to $0.00.')])
e.save('ev/03-variants-hd.png')

# ---------- 04 part sale ----------
ps = pdf_panel(R + 'invoice-PS.pdf', R + 'p-ps.png',
    'Part sale P-248 invoice (PDF), QA branch sv10142. Fees entered: Tire fee, Core discount, Environmental fee x2.',
    [('Parts · Tire fee', RED, 1), ('Parts · Core discount', RED, 1), ('Parts · Environmental fee', GREEN, 2)],
    [(1, RED, 'Rows print in entry order. Expected: Environmental fee, Tire fee, then Core discount.'),
     (2, GREEN, 'Each part fee prints as "Parts · <name>", and the two $3.00 Environmental fees combine into $6.00.')])
ps.save('ev/04-part-sale-hd.png')

# ---------- 05 Legacy layout unchanged ----------
lb = pdf_panel(R + 'prod-estimate-S962-legacy.pdf', R + 'p-legb.png',
    'Legacy layout on production (build v26.40.9-27b6bca), estimate S-962.', [], [])
la = pdf_panel(R + 'estimate-A-legacy.pdf', R + 'p-lega.png',
    'Legacy layout on the QA branch (build v26.40.3-d72fa24), estimate S-17580, same fees.', [],
    [(1, GREEN, 'Identical rows and amounts on both builds: the Legacy layout is unchanged by the fix.')])
stack([lb, la]).save('ev/05-legacy-unchanged-hd.png')
print('ok')
