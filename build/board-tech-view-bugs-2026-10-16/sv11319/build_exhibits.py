import json, sys
sys.path.insert(0, '..')
from bexh import *
R = json.load(open('data/i19c.json')); S = 2
def ann(png, items, crop, c=GRN):
    im = Image.open(png).convert('RGB'); d = ImageDraw.Draw(im); L = []
    for n, (r, lab) in enumerate(items, 1):
        if not r: continue
        xy = box(d, r, c, pad=6, w=3); badge(d, xy[2] + 14, xy[1] - 8, n, c); L.append(f'{n} {lab}: {r["icon"]}')
    return im.crop(tuple(int(v * S) for v in crop)), L
tv = R['tv']; bv = R['bv']
a, la = ann('ev/i19c-tv.png', [(tv['dens'], 'density'), (tv['list'], 'List'), (tv['tech'], 'Tech View'), (tv['board'], 'Board View')], (1100, 70, 1420, 130))
b, lb = ann('ev/i19c-tv.png', [(tv['chev'], 'collapse (points right while closed)'), (tv['ua'], 'Unassigned avatar'), (tv['clip'], 'count'), (tv['grip'], 'drag grip'), (tv['pinoff'], 'pinned'), (tv['pin'], 'not pinned')], (0, 185, 330, 310))
c, lc = ann('ev/i19c-bv.png', [(bv['dens'], 'density'), (bv['ua'], 'Unassigned avatar'), (bv['lock'], 'Invoiced/Paid lock'), (bv['pinoff'], 'pinned')], (0, 70, 1220, 270))
e = Image.open('ev/e08d-estimates-tech_view.png').convert('RGB').crop((1000, 900, 2300, 1400))
before = head(legend(Image.open('ev/03-toolbar-tech_view-2x.png').convert('RGB').crop((1300, 0, 2500, 230)), ['Material icons: list/person/board switcher, line-spacing density'], RED), 'BEFORE: ticket picture (Tech View toolbar)', 'Staging, 14 Oct 2026', RED)
P = [head(legend(a, la, GRN, 20), 'AFTER: Tech View toolbar', f"Staging {R['mk']['version']} · 16 Oct", GRN),
     head(legend(b, lb, GRN, 20), 'AFTER: Tech View group headers', f"Staging {R['mk']['version']} · 16 Oct", GRN)]
Q = [head(legend(c, lc, GRN, 20), 'AFTER: Board View toolbar and column headers', f"Staging {R['mk']['version']} · 16 Oct", GRN),
     head(legend(e, ['No work orders at all (Estimates tab, ZZAUTOTEST F2 Empty Shop): clipboard-list in a grey circle'], GRN, 20), 'AFTER: first-run state', f"Staging {R['mk']['version']} · 16 Oct", GRN)]
body = col([before, row(P), row(Q)])
page('Tech View and Board View use the design\'s Lucide icons', body,
     ['Window 1600 x 1000 px, browser zoom 100%. Icon names are read from each icon on the page.',
      'Spec v64, S1-R9a: "The switcher uses the design\'s icons at 20px: List is Lucide list, Tech View is user-round, Board View is square-kanban. In Tech View and Board View these icons are the design\'s: density (row-height in Tech View, card-height in Board View ...), collapse chevron (chevron-down), pin and unpin (pin / pin-off), Invoiced or Paid lock (lock), Unassigned avatar (user-round) and the empty state when there are no work orders at all (clipboard-list) ... Every other List icon is unchanged."']).save('ev/sv11319-01-lucide-icons.png')
print('ok')
