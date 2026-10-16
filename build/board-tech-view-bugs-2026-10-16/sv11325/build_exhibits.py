import json, sys
sys.path.insert(0, '..')
from bexh import *
X = json.load(open('data/x25.json')); CI = json.load(open('data/ci25.json')); mk = X['mk']['version']; sub = f'Staging {mk} · 16 Oct'
def shot(png, R, items, crop, c=GRN):
    im = Image.open(png).convert('RGB'); d = ImageDraw.Draw(im)
    for n, k in enumerate(items, 1):
        xy = box(d, R[k], c, pad=3, w=4); badge(d, xy[2] - 6, xy[1] - 6, n, c)
    return im.crop(tuple(int(v * 2) for v in crop))
t = X['tech']; y0 = t['row']['y'] - 70
a = shot('ev/x25-tech.png', t, ['num', 'prog', 'sa'], (150, y0, 1080, t['row']['y'] + t['row']['h'] + 8))
l = X['list']; y1 = l['row']['y'] - 50
b = shot('ev/x25-list.png', l, ['num', 'prog', 'sa'], (220, y1, 1080, l['row']['y'] + l['row']['h'] + 8))
def ci(png, r, top):
    im = Image.open(png).convert('RGB'); d = ImageDraw.Draw(im); box(d, r, GRN, pad=2, w=4)
    return im.crop((int((r['x'] - 60) * 2), int(top * 2), int((r['x'] + r['w'] + 60) * 2), int((r['y'] + r['h'] + 6) * 2)))
c1 = ci('ev/ci25-tech.png', CI['tech']['ciRect'], 136); c2 = ci('ev/ci25-list.png', CI['list']['ciRect'], 136)
bf = Image.open('ev/02-tech_view-1440-retry.png').convert('RGB').crop((180, 140, 1290, 300)).resize((1665, 240), Image.LANCZOS)
before = head(legend(bf, ['Number plain black text, Progress a coloured percentage pill, Service Advisor name only'], RED, 22), 'BEFORE: ticket picture, Tech View at 1440 px', 'Staging, 14 Oct 2026', RED)
pa = head(legend(a, ['1 Number: a link in #175CD3 that opens the work order', '2 Progress: thin bar (64 x 6 px here; 48 x 4 px at Compact) with the percentage beside it, no hours line', '3 Service Advisor: avatar (24 px here; 20 / 32 px at Compact / Comfortable) before the name'], GRN, 22), 'AFTER: Tech View, S2-33692', sub, GRN)
pc = head(legend(row([c1, c2], 30), ['Clocked In for S2-33043 (two people clocked in): "Tech ShopView +1" in both, first full name then +N, bold'], GRN, 22), 'AFTER: Clocked In, Tech View (left) and List (right)', sub, GRN)
pl = head(legend(b, ['List unchanged: plain number, percentage pill, name only, the same as production'], GRN, 22), 'AFTER: List, same work order', sub, GRN)
page('Tech View cells: number link, progress bar and advisor avatar as in the design', col([before, pa, row([pc, pl])]),
     ['Window 1600 x 900 px, browser zoom 100%, density Regular unless stated.',
      "Spec v64, S2-R20: \"Tech View's cells follow the design: the work order number shows as a link in the design system's link color (#175CD3), which meets accessible contrast on white; Progress shows as a thin bar with the percentage beside it, with no hours line under it at any density (S6-R6); Service Advisor shows the advisor's avatar before the name. Clocked In keeps List's display (S5-R11).\""]).save('ev/sv11325-01-tech-view-cells.png')
print('ok')
