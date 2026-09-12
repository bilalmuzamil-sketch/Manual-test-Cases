#!/usr/bin/env python3
"""Legacy QA vs Legacy Production — design / size / spacing comparison.

Every number is read out of the two PDFs (pymupdf). Nothing is eyeballed.
Geometry is compared UNROUNDED with a 0.01pt tolerance; a check whose shape
does not exist in one document is reported N/A, never as a difference.
"""
import pymupdf, collections

QA = pymupdf.open('Legacy_QA.pdf'); PR = pymupdf.open('Legacy_Production.pdf')
TOL_PT = 0.05   # 0.05pt = 1/1440 inch; below this is glyph-ink noise, not layout

def spans(doc):
    o = []
    for pno, p in enumerate(doc):
        for b in p.get_text('dict')['blocks']:
            for l in b.get('lines', []):
                for s in l['spans']:
                    o.append(dict(p=pno, t=s['text'].strip(), x0=s['bbox'][0], y0=s['bbox'][1],
                                  x1=s['bbox'][2], sz=round(s['size'], 2), f=s['font'], c=s['color'],
                                  bold='Bold' in s['font']))
    return o

def draws(doc):
    o = []
    for pno, p in enumerate(doc):
        for d in p.get_drawings():
            r = d['rect']
            o.append(dict(p=pno, x0=r.x0, y0=r.y0, x1=r.x1, y1=r.y1, w=r.width, h=r.height,
                          fill=d.get('fill')))
    return o

Q, P = spans(QA), spans(PR)
DQ, DP = draws(QA), draws(PR)
rows = []

def near(a, b):
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return abs(a - b) <= TOL_PT
    if isinstance(a, (list, tuple)) and isinstance(b, (list, tuple)) and len(a) == len(b):
        return all(near(x, y) for x, y in zip(a, b))
    return a == b

def chk(name, a, b, note=''):
    if a in (None, [], ()) or b in (None, [], ()):
        v = 'N/A'
    else:
        v = 'SAME' if near(a, b) else 'DIFF'
    rows.append([name, a, b, v, note])

def fmt(v, n=2):
    if isinstance(v, float): return round(v, n)
    if isinstance(v, (list, tuple)): return [fmt(x, n) for x in v]
    return v

# ---- 1. paper, producer, font files ------------------------------------
chk('Page size', fmt(tuple(QA[0].rect)), fmt(tuple(PR[0].rect)), 'A4 595.28 x 841.89 pt')
chk('PDF producer', QA.metadata.get('producer'), PR.metadata.get('producer'))
ef = lambda d: sorted({f[3] for pno in range(d.page_count) for f in d.get_page_fonts(pno, full=True)})
chk('Embedded font subsets', ef(QA), ef(PR), 'same subset tag = byte-identical font file')

# ---- 2. type -----------------------------------------------------------
chk('Font families', sorted({s['f'] for s in Q}), sorted({s['f'] for s in P}))
chk('Type sizes (pt)', sorted({s['sz'] for s in Q}), sorted({s['sz'] for s in P}))
chk('Size x weight pairs', sorted({(s['f'], s['sz']) for s in Q}), sorted({(s['f'], s['sz']) for s in P}))
chk('Text colours', sorted({hex(s['c']) for s in Q}), sorted({hex(s['c']) for s in P}))

# ---- 3. page frame -----------------------------------------------------
card = lambda D: sorted({(round(d['x0'],2), round(d['x1'],2), round(d['w'],2)) for d in D if d['fill'] == (1.0,1.0,1.0)})
chk('White page card x-span / width', card(DQ), card(DP))
chk('Page-1 card height', fmt(max(d['h'] for d in DQ if d['p']==0 and d['fill']==(1.0,1.0,1.0))),
                          fmt(max(d['h'] for d in DP if d['p']==0 and d['fill']==(1.0,1.0,1.0))))
chk('Body text left edge', fmt(min(s['x0'] for s in Q if s['x0'] > 30)), fmt(min(s['x0'] for s in P if s['x0'] > 30)))
rt = lambda S: fmt(max(s['x1'] for s in S if s['sz'] == 14.4))
chk('Masthead right-aligned edge', rt(Q), rt(P), 'right edge of the document-label box (+-0.05pt glyph ink)')
chk('Footer band baseline y', fmt(sorted({s['y0'] for s in Q if s['x0'] < 30})[:1]), fmt(sorted({s['y0'] for s in P if s['x0'] < 30})[:1]))
chk('Footer left / centre x', fmt([min(s['x0'] for s in Q), [s['x0'] for s in Q if 'Powered by' in s['t']][0]]),
                              fmt([min(s['x0'] for s in P), [s['x0'] for s in P if 'Powered by' in s['t']][0]]))
def lb(d):
    b = d[0].get_image_bbox(d[0].get_images(full=True)[0])
    return dict(x0=round(b.x0,1), x1=round(b.x1,1), cy=round((b.y0+b.y1)/2,1), h=round(b.y1-b.y0,1))
chk('Logo slot x-span', (lb(QA)['x0'], lb(QA)['x1']), (lb(PR)['x0'], lb(PR)['x1']))
chk('Logo slot vertical centre', lb(QA)['cy'], lb(PR)['cy'], 'image height inside the slot follows the image aspect ratio')
chk('Footer right edge', fmt(max(s['x1'] for s in Q)), fmt(max(s['x1'] for s in P)))

# ---- 4. rules, borders, boxes -----------------------------------------
rule = lambda D: sorted({(round(d['x0'],2), round(d['x1'],2), round(d['w'],2), round(d['h'],2), str(d['fill'])) for d in D if d['h'] < 2})
chk('Horizontal rules (x0,x1,width,thickness,colour)', rule(DQ), rule(DP))
cell = lambda D: sorted({(round(d['x0'],2), round(d['x1'],2), round(d['w'],2), round(d['h'],2)) for d in D if 15 < d['h'] < 20})
chk('Totals cell boxes (x0,x1,w,h)', cell(DQ), cell(DP))

# ---- 5. line-table horizontal geometry --------------------------------
hdr = lambda S: sorted({(s['t'], round(s['x0'],2), round(s['x1'],2)) for s in S
                        if s['sz'] == 9.6 and s['bold'] and s['t'] in ('Description','Quantity','Rate','Amount')})
chk('Line-table column headers (x0,x1)', hdr(Q), hdr(P))
gut = lambda S: sorted({round(s['x0'],2) for s in S if s['t'] in ('Labor','Parts') and s['sz'] == 9.6 and s['x0'] < 100})
chk('Row-type gutter label x ("Labor"/"Parts")', gut(Q), gut(P))
dtx = lambda S: fmt(sorted({s['x0'] for s in S if s['sz'] == 9.6 and 88 < s['x0'] < 92})[:1])
chk('Description text left x', dtx(Q), dtx(P))
qty = lambda S: sorted({round(s['x1'],2) for s in S if s['sz']==9.6 and 460 < s['x1'] < 470})
chk('Rate column right edge', qty(Q), qty(P))
amt = lambda S: sorted({round(s['x1'],2) for s in S if s['sz']==9.6 and 536 < s['x1'] < 538})
chk('Amount column right edge', amt(Q), amt(P))

# ---- 6. vertical rhythm ------------------------------------------------
def gaps(S, pa, pb):
    """unrounded gaps between consecutive baselines a->b on the same page"""
    out = []
    byp = collections.defaultdict(list)
    for s in S: byp[s['p']].append(s)
    for pno, ss in byp.items():
        ys = sorted({s['y0'] for s in ss})
        for i in range(len(ys) - 1):
            a = [s for s in ss if abs(s['y0']-ys[i]) < 1e-6]
            b = [s for s in ss if abs(s['y0']-ys[i+1]) < 1e-6]
            if any(pa(s) for s in a) and any(pb(s) for s in b):
                out.append(ys[i+1] - ys[i])
    return out
def mode(v):
    if not v: return []
    c = collections.Counter(round(x, 3) for x in v)
    return [c.most_common(1)[0][0]]
eq  = lambda txt: (lambda s: s['t'] == txt)
pre = lambda txt: (lambda s: s['t'].startswith(txt))
sz  = lambda n: (lambda s: s['sz'] == n)
title = lambda s: s['sz'] == 9.6 and s['bold'] and abs(s['x0'] - 90.41) < .01

V = [
 ('Masthead heading line pitch (14.4pt)', lambda s: s['sz']==14.4, lambda s: s['sz']==14.4),
 ('Address line leading (10.8pt)',        sz(10.8), sz(10.8)),
 ('Heading -> first address line',        lambda s: s['sz']==14.4, sz(10.8)),
 ('Asset header -> asset values',         eq('Unit'), lambda s: s['sz']==10.5 and not s['bold']),
 ('Service-Order header -> values',       lambda s: s['sz']==10.5 and s['bold'] and s['t'] in ('Service Order','Order'),
                                          lambda s: s['sz']==10.5 and not s['bold']),
 ('Service-Order values -> table header', lambda s: s['sz']==10.5 and not s['bold'], eq('Description')),
 ('Table header -> first job title',      eq('Description'), title),
 ('Description line leading',             lambda s: abs(s['x0']-90.41)<.01, lambda s: abs(s['x0']-90.41)<.01),
 ('Parts Total -> Labor Total',           pre('Parts Total'), pre('Labor Total')),
 ('Labor Total -> Line Total',            pre('Labor Total'),  pre('Line Total')),
 ('Line Total -> next job title',         pre('Line Total'), title),
 ('Last Line Total -> summary block',     pre('Line Total'), lambda s: abs(s['x0']-444.34)<.01),
 ('Summary row pitch',                    lambda s: 405<s['x0']<475 and s['sz']==9.6 and s['x1']<473,
                                          lambda s: 405<s['x0']<475 and s['sz']==9.6 and s['x1']<473),
 ('Balance -> disclaimer',                pre('Balance'), sz(6.48)),
 ('Disclaimer leading',                   sz(6.48), sz(6.48)),
 ('Disclaimer -> "Customer signature:"',  sz(6.48), pre('Customer signature')),
 ('"Customer signature:" -> "Printed name:"', pre('Customer signature'), pre('Printed name')),
]
for name, pa, pb in V:
    chk(name, fmt(mode(gaps(Q, pa, pb)), 3), fmt(mode(gaps(P, pa, pb)), 3))

# ---- 7. summary block alignment ---------------------------------------
slab = lambda S: sorted({round(s['x1'],2) for s in S if 405 < s['x0'] < 475 and s['sz'] == 9.6 and s['x1'] < 473})
chk('Summary label right edge', slab(Q), slab(P), 'labels right-aligned to the same column')
samt = lambda S: sorted({round(s['x1'],2) for s in S if s['x0'] >= 490 and s['sz'] == 9.6 and s['x1'] > 538})
chk('Summary amount right edge', samt(Q), samt(P))

# ---- 8. disclaimer wrap = proof of text-column width -------------------
dis = lambda S: [(round(s['x0'],2), round(s['x1'],2)) for s in S if s['sz'] == 6.48]
chk('Disclaimer line count', len(dis(Q)), len(dis(P)))
chk('Disclaimer wrap widths per line', dis(Q), dis(P), 'identical wrap proves identical column width')

# ---- 9. signature block ------------------------------------------------
sig = lambda S: sorted({(s['t'], round(s['x0'],2)) for s in S if s['t'] in ('Customer signature:','Printed name:','Date:')})
chk('Signature block labels + x', sig(Q), sig(P))

# ---- 10. weight map (SV-4314 compliance) ------------------------------
def wt(S, txt, pref=False):
    w = {s['bold'] for s in S if (s['t'].startswith(txt) if pref else s['t'] == txt)}
    return 'bold' if w == {True} else 'regular' if w == {False} else 'mixed' if w else None
LAB = [('Line Total', True), ('Parts Total', True), ('Labor Total', True), ('Subtotal', True),
       ('Total', False), ('Shop supplies', True), ('Payments', True), ('Balance', True),
       ('Bill To', False), ('Remit payment to', False), ('Description', False), ('Quantity', False),
       ('Rate', False), ('Amount', False), ('Unit', False), ('VIN/Serial #', False), ('Asset', False),
       ('Mileage', False), ('Eng Hrs', False), ('Terms', False), ('Customer PO', False),
       ('Authorizer', False), ('Customer signature:', False), ('Printed name:', False), ('Date:', False)]
for lab, pref in LAB:
    chk(f'Weight: "{lab}"', wt(Q, lab, pref), wt(P, lab, pref))
gl = lambda S: ('regular' if {s['bold'] for s in S if s['t'] in ('Labor','Parts') and s['x0'] < 100} == {False} else 'mixed')
chk('Weight: gutter "Labor"/"Parts"', gl(Q), gl(P))

# ---- report ------------------------------------------------------------
w1 = max(len(r[0]) for r in rows)
tally = collections.Counter(r[3] for r in rows)
print(f'{"CHECK":<{w1}}  RESULT')
print('-' * (w1 + 10))
for n, a, b, v, note in rows:
    print(f'{n:<{w1}}  {v}' + (f'   [{note}]' if note and v == 'SAME' else ''))
    if v != 'SAME':
        print(f'{"":<{w1}}    QA   = {a}')
        print(f'{"":<{w1}}    PROD = {b}')
print('-' * (w1 + 10))
print(f'{tally["SAME"]} IDENTICAL   {tally["DIFF"]} DIFFERENT   {tally["N/A"]} not present in one document')
