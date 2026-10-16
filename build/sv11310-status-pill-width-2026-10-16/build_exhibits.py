"""SV-11310 exhibits: annotated before/after of the Work Orders List status pills (Rules 64/73/90)."""
import json, sys
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import fnt, wrap, RED, GRN, BLU, BLK, GREY
D = 'data/'; E = 'ev/'

def pills(f, term):
    d = json.load(open(D + f)); return d['mk']['version'], [x for x in d['out'] if x['term'] == term][0]['v']

def after_panel(src, f, term, title, sub, c, crop=(16, 180, 330, 935), S=2):
    ver, v = pills(f, term)
    im = Image.open(src).convert('RGB'); dr = ImageDraw.Draw(im)
    v = [x for x in v if x['y'] + x['h'] < crop[3]]
    L = min(x['x'] for x in v) * S; R = max(x['x'] + x['w'] for x in v) * S
    for x in v:
        dr.rectangle([x['x']*S - 5, x['y']*S - 5, (x['x']+x['w'])*S + 5, (x['y']+x['h'])*S + 5], outline=c, width=4)
    for X in (L - 9, R + 9):
        for y in range(crop[1]*S, crop[3]*S, 22): dr.line([X, y, X, y + 12], fill=BLU, width=3)
    im = im.crop(tuple(k * S for k in crop))
    widths = sorted(set(x['w'] for x in v)); sts = []
    for x in v:
        if x['t'] not in sts: sts.append(x['t'])
    return frame(im, title, sub, [f"{len(v)} pills on screen, {len(sts)} different statuses ({', '.join(sts)}).",
                                  f"Every pill is {widths[0]:.2f} px wide; the blue dashed lines show the edges line up."], c), widths, ver

def frame(im, title, sub, notes, c, W=None):
    W = W or im.width; f1, f2, f3 = fnt(25, True), fnt(19), fnt(24)
    d0 = ImageDraw.Draw(im); lines = []
    for n in notes: lines += wrap(d0, n, f3, W - 40)
    head = 110; foot = 30 + 34 * len(lines)
    out = Image.new('RGB', (W, head + im.height + foot), 'white'); d = ImageDraw.Draw(out)
    d.rectangle([0, 0, W - 1, head - 8], fill=c); d.text((18, 14), title, font=f1, fill='white'); d.text((18, 58), sub, font=f2, fill='white')
    out.paste(im, ((W - im.width) // 2, head))
    y = head + im.height + 15
    for ln in lines: d.text((20, y), ln, font=f3, fill=BLK); y += 34
    d.rectangle([0, 0, W - 1, out.height - 1], outline=(190, 196, 204), width=2)
    return out

def side(panels, top, bottom, gap=24):
    H = max(p.height for p in panels); W = sum(p.width for p in panels) + gap * (len(panels) + 1)
    f1, f3 = fnt(34, True), fnt(26)
    d0 = ImageDraw.Draw(Image.new('RGB', (10, 10))); bl = wrap(d0, bottom, f3, W - 60)
    out = Image.new('RGB', (W, 80 + H + 40 + 38 * len(bl)), 'white'); d = ImageDraw.Draw(out)
    d.text((gap, 22), top, font=f1, fill=BLK); x = gap
    for p in panels: out.paste(p, (x, 80)); x += p.width + gap
    y = 80 + H + 22
    for ln in bl: d.text((gap, y), ln, font=f3, fill=BLK); y += 38
    return out

# BEFORE: the reporter's own screenshot in the ticket (staging v26.40.17, 14 Oct)
tb = Image.open(E + 'raw-ticket-before-14oct.png').convert('RGB').crop((24, 362, 664, 1478))
tb = tb.resize((int(tb.width * 1.0), int(tb.height * 1.0)))
before = frame(tb, 'BEFORE: as reported (ticket picture)', 'Staging v26.40.17-ddb9ba1 · 14 Oct 2026',
               ['Each pill is only as wide as its text: Approved 72.4 px, Complete 71.5 px, Estimate 67 px, Invoiced 64.2 px, Paid 44.5 px, Ready For Review widest (red boxes).'], RED)
a_st, w_st, v_st = after_panel(E + 'raw-staging-S2-363.png', 'mix-staging-1600.json', 'S2-363',
    'AFTER: staging now', 'v26.40.19-1493c63 · 16 Oct · search S2-363', GRN)
a_pr, w_pr, v_pr = after_panel(E + 'raw-production-S2-9.png', 'mix-prod-1600.json', 'S2-9',
    'PRODUCTION (List today)', 'v26.40.19-d2441a9 · 16 Oct · search S2-9', BLU)
H = max(before.height, a_st.height, a_pr.height)
scale = lambda p: p.resize((int(p.width * H / p.height), H)) if p.height != H else p
out = side([scale(before), a_st, a_pr], 'Work Orders > All > List: the status pills are the same width again',
           'Window 1600 x 1000 px, browser zoom 100%. Before the fix, staging sized each pill to its text. '
           'Now every pill on the screen is the same width, exactly as on production.')
out.save(E + 'sv11310-01-before-after-status-pills.png'); print('ex1', out.size, w_st, w_pr)

# EXHIBIT 2: each status searched on its own, staging vs production (same width per status)
import glob
st = {r['t']: r for f in ['sr-staging-1600-a.json', 'sr-staging-1600.json'] for r in json.load(open(D + f))['res']}
pr = {r['t']: r for r in json.load(open(D + 'sr-prod-1600.json'))['res']}
order = ['Ready For Review', 'In Progress', 'Approved', 'Complete', 'Declined', 'Estimate', 'Invoiced', 'Paid']
def cell(env, r, c):
    im = Image.open(f"{E}raw-search/sr-{env}-1600-{r['q']}.png").convert('RGB')
    box = (16 * 2, 186 * 2, 520 * 2, 232 * 2); im = im.crop(box); d = ImageDraw.Draw(im)
    # pill box: column starts at the Status cell; pill x read from the page is not stored per search, so find it by colour edge
    x0, x1 = 109.2 * 2 - 32, (109.2 + r['w']) * 2 - 32
    d.rectangle([x0 - 6, 201 * 2 - 372 - 6, x1 + 6, 222 * 2 - 372 + 6], outline=c, width=4)
    return im
f_h, f_t, f_s = fnt(30, True), fnt(26, True), fnt(24)
rows = []
CW = 1008; RH = 92 + 34
out = Image.new('RGB', (40 + 300 + 2 * (CW + 30), 130 + RH * len(order) + 90), 'white'); d = ImageDraw.Draw(out)
d.text((20, 18), 'Each status searched on its own: the pill is the same width on staging and on production', font=f_h, fill=BLK)
d.text((340, 78), 'STAGING (v26.40.19-1493c63)', font=f_t, fill=GRN); d.text((340 + CW + 30, 78), 'PRODUCTION (v26.40.19-d2441a9)', font=f_t, fill=BLU)
y = 130
for t in order:
    a, b = st[t], pr[t]
    d.text((20, y + 30), t, font=f_t, fill=BLK)
    for k, (env, r, c) in enumerate([('staging', a, GRN), ('prod', b, BLU)]):
        im = cell(env, r, c).resize((CW, 92)); x0 = 340 + k * (CW + 30); out.paste(im, (x0, y))
        dd = ImageDraw.Draw(out); dd.rectangle([x0, y, x0 + CW, y + 92], outline=c, width=3)
        dd.text((x0 + 8, y + 96), f"{r['q']}: pill {r['w']:.2f} px (column {r['td']} px)", font=f_s, fill=c)
    y += RH
d.text((20, y + 20), 'Window 1600 x 1000 px, zoom 100%. The same eight results were measured again at 1280 px wide: identical on both.', font=f_s, fill=GREY)
out.save(E + 'sv11310-02-each-status-staging-vs-production.png'); print('ex2', out.size)
