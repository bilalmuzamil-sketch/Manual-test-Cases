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
        hits = [l for l in lines if l['t'].split('$')[0].split('(')[0].strip() == label.lstrip('*')]
        for hit in (hits if label.startswith('*') else hits[:1]):
            boxes.append((hit['x0'] * u, hit['y0'] * u - 2, x1 * u, hit['y1'] * u + 2, colour, n))
    return panel(png, crop, title, boxes, notes, scale=Z // u)



def portal_panel(png, tag, nrows, title, notes, box_colour=None):
    from PIL import Image, ImageDraw
    x, y, w, h = json.load(open('data/portal-geo.json'))[tag + '_after']['head']
    clean = png.replace('.png', '-clean.png'); im = Image.open(png).convert('RGB')
    ImageDraw.Draw(im).rectangle([0, 0, (x - 16) * 2, im.height], fill='white'); im.save(clean)
    bottom = y + h + 4 + nrows * 24.9
    crop = (x - 50, y - 14, x + w + 30, bottom + 30)
    boxes = [(x + 4, y + h + 2, x + w + 8, bottom, box_colour, 1)] if box_colour else []
    return panel(clean, crop, title, boxes, notes)


AFTER = 'production app.shopview.com, build v26.40.13-013e543, 8 Oct 2026'
R = 'ev/raw/'

before = pdf_panel(R + 'prod-estimate-S962-modern.pdf', R + 'p-before.png',
    'BEFORE - production app.shopview.com, build v26.40.9-27b6bca, 7 Oct 2026. Estimate S2-962, new layout.',
    [('Labor', RED, 1), ('Parts', RED, 2)],
    [(1, RED, 'Every labor-line fee was summed into one "Labor" row: the Shop fee and Diagnostic fee names never printed.'),
     (2, RED, 'The part Environmental fee ($6.00) and Core discount ($5.00) were netted into "Parts $1.00".')])
after = pdf_panel(R + 'estimate-A-modern.pdf', R + 'p-after.png',
    'AFTER - ' + AFTER + '. Estimate S2-965, the same eight fees and discounts entered in the same order.',
    [('Labor · Diagnostic fee', GREEN, 1), ('Labor · Shop fee', GREEN, 2), ('Parts · Environmental fee', GREEN, 3),
     ('Parts · Core discount', GREEN, 3)],
    [(1, GREEN, 'Each fee prints its own name, A to Z inside the Labor group.'),
     (2, GREEN, 'The three $15.00 Shop fees combine into one $45.00 row.'),
     (3, GREEN, 'The part fee and discount print separately, fee first: $6.00 and ($5.00).'),
     (4, BLUE, 'The subtotals differ ($1,140.90 vs $1,219.21) only because the two work orders carry different parts; the fees and discounts are the same.')])
stack([before, after]).save('ev/prod-01-before-vs-after-hd.png')

b = pdf_panel(R + 'invoice-B-modern.pdf', R + 'p-b.png',
    'Invoice S2-966 (PDF), ' + AFTER + '. Labor fees and discounts entered out of order, Z first.',
    [('Labor · Alpha fee', GREEN, 1), ('Labor · zeta fee', GREEN, 1), ('Labor · bravo discount', GREEN, 2),
     ('Labor · Zulu discount', GREEN, 2), ('Labor · Shop fee', GREEN, 3), ('*Labor · Promo', GREEN, 4),
     ('Parts · core discount', GREEN, 5), ('Parts · Waste discount', GREEN, 5), ('*Loyalty discount', BLUE, 6), ('Admin fee', BLUE, 6)],
    [(1, GREEN, 'Labor fees print A to Z, small and capital letters together: Alpha fee, Promo, Shop fee, zeta fee.'),
     (2, GREEN, 'Then the labor discounts, A to Z: bravo discount, Promo, Zulu discount.'),
     (3, GREEN, 'A flat $5.00 Shop fee and a 2%-of-labor Shop fee ($2.00) combine into one $7.00 row.'),
     (4, GREEN, '"Promo" as a fee ($10.00) and "Promo" as a discount ($4.00) stay two separate rows.'),
     (5, GREEN, 'Parts: core discount, then Waste discount. A 0.01% "Tiny fee" on a $0.72 part works out to $0.00 and is correctly not printed.'),
     (6, BLUE, 'Work-order-wide rows keep the order they were added and are not combined, as agreed on the ticket.')])
b.save('ev/prod-02-variants-hd.png')

ps = pdf_panel(R + 'invoice-PS-modern.pdf', R + 'p-ps.png',
    'Part sale P2-79 invoice (PDF), ' + AFTER + '. Entered: Tire fee, Core discount, Environmental fee x2, Fleet discount.',
    [('Parts · Environmental fee', GREEN, 1), ('Parts · Tire fee', GREEN, 1), ('Parts · Core discount', GREEN, 2)],
    [(1, GREEN, 'Part fees print by name, A to Z; the two $3.00 Environmental fees combine into $6.00.'),
     (2, GREEN, 'The discount comes after the fees.')])
ps.save('ev/prod-03-part-sale-hd.png')

lb = pdf_panel(R + 'prod-estimate-S962-legacy.pdf', R + 'p-legb.png',
    'Legacy layout BEFORE - production build v26.40.9-27b6bca, 7 Oct 2026, estimate S2-962.', [], [])
la = pdf_panel(R + 'estimate-A-legacy.pdf', R + 'p-lega.png',
    'Legacy layout AFTER - ' + AFTER + ', estimate S2-965, same fees and discounts.', [],
    [(1, GREEN, 'The Adjustments rows and amounts are identical: the Legacy layout is unchanged.')])
stack([lb, la]).save('ev/prod-04-legacy-unchanged-hd.png')

pa = portal_panel(R + 'portal-A.png', 'A', 5, 'Customer portal, invoice S2-965 (' + AFTER + ').',
    [(1, GREEN, 'The customer sees the same named rows as the PDF.')], GREEN)
pb = portal_panel(R + 'portal-B.png', 'B', 12, 'Customer portal, invoice S2-966.',
    [(1, GREEN, 'Same rows, same order as the S2-966 PDF.')], GREEN)
pp = portal_panel(R + 'portal-PS.png', 'PS', 4, 'Customer portal, part sale invoice P2-79.',
    [(1, GREEN, 'Same rows as the part sale PDF.')], GREEN)
stack([pa, pb, pp]).save('ev/prod-05-customer-portal-hd.png')
print('ok')
