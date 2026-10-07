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


R2 = 'ev/raw2/'   # re-captured after Stefan's fixed-order commit 13b782a reached the branch (7 Oct ~14:25Z)
AFTER = 'QA branch sv10142, build v26.40.8-a32d41c (with the fixed-order update), 7 Oct 2026'

# ---------- 01 BEFORE vs AFTER (same fees, same entry order, estimate, new layout) ----------
before = pdf_panel(R + 'prod-estimate-S962-modern.pdf', R + 'p-before.png',
    'BEFORE - production app.shopview.com, build v26.40.9-27b6bca, 7 Oct 2026. Estimate S2-962, new invoice layout.',
    [('Labor', RED, 1), ('Parts', RED, 2)],
    [(1, RED, 'Every labor-line fee is summed into one "Labor" row: the Shop fee and Diagnostic fee names never print.'),
     (2, RED, 'The parts Environmental fee ($6.00) and Core discount ($5.00) are netted into "Parts $1.00".')])
after = pdf_panel(R2 + 'estimate-A.pdf', R2 + 'p-after.png',
    'AFTER - ' + AFTER + '. Estimate S10142-17580, the same fees entered in the same order.',
    [('Labor · Diagnostic fee', GREEN, 1), ('Labor · Shop fee', GREEN, 2), ('Parts · Environmental fee', GREEN, 3),
     ('Parts · Core discount', GREEN, 3)],
    [(1, GREEN, 'Each fee prints its own name.'),
     (2, GREEN, 'Three $15.00 Shop fees combine into one $45.00 row.'),
     (3, GREEN, 'The parts fee and discount are no longer netted: $6.00 and ($5.00) print separately, fee first.')])
stack([before, after]).save('ev/01-before-vs-after-hd.png')

# ---------- 02 entry order no longer matters ----------
c = screen_panel(R2 + 'screen-C.png', R2 + 'geo.json', 'C',
    'S10142-17582, Finance tab. Fees entered in this order: Shop fee, Diagnostic fee, Core discount, Environmental fee.',
    [('Labor · Diagnostic fee', GREEN, 1), ('Labor · Shop fee', GREEN, 1), ('Parts · Environmental fee', GREEN, 2),
     ('Parts · Core discount', GREEN, 2)],
    [(1, GREEN, 'Labor prints Diagnostic fee, then Shop fee: A to Z, not the order they were entered.'),
     (2, GREEN, 'Parts prints the Environmental fee before the Core discount: fees before discounts.')])
d = screen_panel(R2 + 'screen-D.png', R2 + 'geo.json', 'D',
    "S10142-17583, Finance tab. The same fees, entered in the order of Chris's example.",
    [('Labor · Diagnostic fee', GREEN, 3), ('Labor · Shop fee', GREEN, 3), ('Parts · Environmental fee', GREEN, 3),
     ('Parts · Core discount', GREEN, 3)],
    [(3, GREEN, "Prints exactly the same as S10142-17582, and line for line as Chris's example in comment 78126.")])
stack([c, d]).save('ev/02-entry-order-does-not-matter-hd.png')

# ---------- 03 variants on S10142-17584 ----------
g = json.load(open(R2 + 'geo.json'))['E']
near = g['rows']['near']
e = screen_panel(R2 + 'screen-E.png', R2 + 'geo.json', 'E',
    'S10142-17584, Finance tab. Entered Z-first: Zeta fee, Zulu discount, Promo, Shop fee, Bravo discount, Alpha fee, Promo discount, Shop fee 2%.',
    [('Labor · Alpha fee', GREEN, 1), ('Labor · Zeta fee', GREEN, 1), ('Labor · Bravo discount', GREEN, 2),
     ('Labor · Zulu discount', GREEN, 2), ('Labor · Shop fee', GREEN, 3),
     ('Parts · Battery fee', GREEN, 6), ('Parts · Tire fee', GREEN, 6), ('Parts · Waste discount', GREEN, 6)]
    + [({'x': k['x'], 'y': k['y'], 'h': k['h']}, GREEN, 4) for k in near if k['t'] == 'Labor · Promo']
    + [({'x': k['x'], 'y': k['y'], 'h': k['h']}, BLUE, 5) for k in near if k['t'] == 'Loyalty discount'],
    [(1, GREEN, 'Labor fees print A to Z: Alpha fee, Promo, Shop fee, Zeta fee.'),
     (2, GREEN, 'Then the labor discounts, A to Z: Bravo discount, Promo, Zulu discount.'),
     (3, GREEN, 'A flat $5.00 Shop fee and a 2%-of-labor Shop fee ($3.00) combine into one $8.00 row, as Chris confirmed.'),
     (4, GREEN, '"Promo" as a fee ($10.00) and "Promo" as a discount ($4.00) stay two rows - a fee and a discount never combine.'),
     (5, BLUE, 'Work-order-wide rows are not combined and keep the order they were added (Chris ruled on the Labor and Parts groups only).'),
     (6, GREEN, 'Parts: Battery fee, Tire fee, then Waste discount.'),
     (7, GREEN, 'Not printed, correctly: a "Tiny fee" of 0.01% on a $4.56 part, which works out to $0.00 (no row).')])
e.save('ev/03-variants-hd.png')

# ---------- 04 part sale ----------
ps = pdf_panel(R2 + 'invoice-PS.pdf', R2 + 'p-ps.png',
    'Part sale P10142-248 invoice (PDF). Entered: Tire fee, Core discount, Environmental fee x2.',
    [('Parts · Environmental fee', GREEN, 1), ('Parts · Tire fee', GREEN, 1), ('Parts · Core discount', GREEN, 2)],
    [(1, GREEN, 'Part fees print as "Parts · <name>", A to Z; the two $3.00 Environmental fees combine into $6.00.'),
     (2, GREEN, 'The discount comes after the fees.')])
ps.save('ev/04-part-sale-hd.png')

# ---------- 05 Legacy layout unchanged ----------
lb = pdf_panel(R + 'prod-estimate-S962-legacy.pdf', R + 'p-legb.png',
    'Legacy layout on production (build v26.40.9-27b6bca), estimate S2-962.', [], [])
la = pdf_panel(R2 + 'v2-estimate-A-legacy.pdf', R2 + 'p-lega.png',
    'Legacy layout on the ' + AFTER + ', estimate S10142-17580, same fees.', [],
    [(1, GREEN, 'Identical rows and amounts on both builds: the Legacy layout is unchanged by the fix.')])
stack([lb, la]).save('ev/05-legacy-unchanged-hd.png')

# ---------- 06 lowercase names and a discount-only group ----------
f = screen_panel(R2 + 'screen-F.png', R2 + 'geo.json', 'F',
    'S10142-17585, Finance tab. Entered: zeta fee, bravo discount, Alpha fee, Alpha discount, brake fee, then part discounts Waste discount, core discount.',
    [('Labor · Alpha fee', GREEN, 1), ('Labor · brake fee', GREEN, 1), ('Labor · zeta fee', GREEN, 1),
     ('Labor · Alpha discount', GREEN, 3), ('Labor · bravo discount', GREEN, 3),
     ('Parts · core discount', GREEN, 2), ('Parts · Waste discount', GREEN, 2)],
    [(1, GREEN, 'Capital and small letters sort together: Alpha fee, brake fee, zeta fee.'),
     (2, GREEN, 'A Parts group with only discounts also sorts A to Z: core discount, Waste discount.'),
     (3, GREEN, 'The labor discounts follow the fees, also A to Z regardless of capitals: Alpha discount, bravo discount.')])
f.save('ev/06-lowercase-and-discount-only-hd.png')
print('ok')
