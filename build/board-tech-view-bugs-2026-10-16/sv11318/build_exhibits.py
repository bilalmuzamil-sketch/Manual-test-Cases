import json, sys
sys.path.insert(0, '..')
from bexh import *
R = json.load(open('data/p18d.json')); S = 2
def pan(png, r, title, c, note):
    im = Image.open(png).convert('RGB'); d = ImageDraw.Draw(im)
    box(d, r, c)
    for f in r['fl']: box(d, f, BLU, oval=True, pad=3, w=3)
    x0 = int((r['x'] - 40) * S); y0 = int((r['y'] - 30) * S); im = im.crop((x0, y0, x0 + 560, y0 + 140))
    return head(legend(im, note, c), title, f"Staging {R['mk']['version']} · 16 Oct 2026", c)
b = Image.open('ev/09-tech_view-status-chips-2x.png').convert('RGB').crop((200, 90, 760, 470))
before = head(legend(b, ['Old pill: the same size (about 21 px) at every density'], RED), 'BEFORE: ticket picture', 'Staging, 14 Oct 2026, Tech View', RED)
P = [pan(f'ev/p18d-{d}.png', R[d], f'AFTER: Tech View, {d.title()}', GRN, [f"Pill {R[d]['h']:.0f} px tall, {R[d]['w']:.2f} px wide", f"Red {R[d]['fl'][0]['t']} and blue {R[d]['fl'][1]['t']} counts on it"]) for d in ['compact', 'regular', 'comfortable']]
L = pan('ev/p18d-list.png', R['list'], 'List (unchanged, as Production)', BLU, [f"Pill {R['list']['h']:.0f} px tall, {R['list']['w']:.2f} px wide", 'Same red 2 and blue 3 counts'])
body = col([before, row(P), L])
page('Tech View status pill height follows density', body,
     ['Same work order in every panel: S2-33351 (Ready For Review, red 2 = "2 Lines in Auth Req\'d", blue 3 = "3 Parts Ready to Order"). Window 1600 x 900 px, browser zoom 100%.',
      'Spec v64, S6-R2a: "In Tech View the status pill is 16px tall at Compact and Regular and 22px tall at Comfortable ... Tech View\'s pill takes the same widths as List\'s; only its height follows density."']).save('ev/sv11318-01-pill-height-by-density.png')
print('ok')
