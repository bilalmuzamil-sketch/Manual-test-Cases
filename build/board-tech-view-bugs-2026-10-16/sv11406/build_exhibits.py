"""SV-11406 exhibits: held group header pushed off by the next header (Tech View, staging)."""
import json, sys
sys.path.insert(0, '/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16')
from PIL import Image, ImageDraw
from bexh import head, box, badge, legend, col, page, RED, GRN, BLU, fnt
E = '/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16/sv11406/'
CROP = (0, 116, 900, 470)  # css px

def panel(tag, k, title, sub, c, notes):
    g = [x for x in json.load(open(E + f'data/{tag}.json'))['shots'] if x['k'] == k][0]
    im = Image.open(E + f'ev/{tag}-{ {"held":1,"push":2,"swap":3}[k]}-{k}.png').convert('RGB')
    d = ImageDraw.Draw(im)
    heads = [x for x in g['ths'] if x['t']]
    hy, hh = heads[0]['y'], heads[0]['h']
    box(d, {'x': 2, 'y': hy, 'w': 896, 'h': hh}, GRN, w=4)
    badge(d, 470 * 2, int((hy + hh / 2) * 2), 1, GRN)
    h = g['held']; clip = g['clip']
    vis = {'x': 4, 'y': max(h['y'], clip['y']), 'w': 892, 'h': h['y'] + h['h'] - max(h['y'], clip['y'])}
    box(d, vis, RED, w=5); badge(d, 470 * 2, int((vis['y'] + vis['h'] / 2) * 2), 2, RED)
    nx = g['next']
    if k == 'push' and nx:
        box(d, {'x': 4, 'y': nx['y'], 'w': 892, 'h': nx['h']}, BLU, w=5); badge(d, 470 * 2, int((nx['y'] + nx['h'] / 2) * 2), 3, BLU)
    im = im.crop(tuple(v * 2 for v in CROP))
    return legend(head(im, title, sub, c), notes, (40, 40, 40), size=24)

for tag, grp, nxt, n in [('dh', 'David Haynes', 'Douglas Fields', '01'), ('un', 'Unassigned', 'ZZAUTOTEST Ana Alpha', '02')]:
    ps = [panel(tag, 'held', f'1. Scrolling through {grp}: its header is held', 'Staging, Tech View, all groups expanded', GRN,
                [f'(1) green: the column headings. (2) red: the held "{grp}" header, right under them, while its work orders scroll past underneath.']),
          panel(tag, 'push', f'2. The next header reaches it and pushes it up', 'Same scroll, a few pixels further', BLU,
                [f'(3) blue: the "{nxt}" header has reached the held one and is pushing it up; (2) red: only the lower part of "{grp}" is still showing. Still only one held header.']),
          panel(tag, 'swap', f'3. "{nxt}" is now the held header', 'Same scroll, a few pixels further', GRN,
                [f'(2) red: "{nxt}" sits in the held spot right under the column headings. "{grp}" has gone off the top.'])]
    out = page(f'SV-11406: the next group header pushes the held one off ({grp})', col(ps),
               ['Staging build v26.40.19-754919e, 17 October 2026, window 1440 x 900 px, browser zoom 100%, signed in as the Tech user, search "' + ('Lamkin' if tag == 'dh' else '4 Star') + '".'])
    out.save(E + f'ev/sv11406-{n}-{"held-header-push" if tag=="dh" else "unassigned-push"}.png')
    print(out.size)
