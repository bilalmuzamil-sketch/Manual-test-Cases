"""SV-9828 exhibits + the Cancel Return ticket exhibits. Run from this folder: python3 build_exhibits.py"""
import json, sys
sys.path.insert(0, '../testing-tools')
from ticket_exhibit import panel, stack

RED, GREEN, BLUE = (214, 40, 40), (22, 135, 60), (30, 90, 200)
R, P = 'ev/raw/', 'ev/prod/'

# ---------- SV-9828 01: before (production) vs after (branch) ----------
before = panel(P + 'confirm.png', (330, 150, 1880, 250),
    'BEFORE - production app.shopview.com, build v26.40.10-9b663ae, 7 Oct 2026. Process Return for the core on work order S2-963.',
    [(1250, 199, 1376, 242, RED, 1)],
    [(1, RED, 'Accepted Quantity 2.50. After Post Credit the core stock went from 32 to 30: only 2 was taken off, not 2.5.')])
after = panel(R + 'A-7-before-post.png', (330, 168, 1880, 268),
    'AFTER - QA branch sv9828, build v26.40.8-71ec2f7, 7 Oct 2026. Process Return for the core on work order S9828-17580.',
    [(1386, 216, 1510, 262, GREEN, 1)],
    [(1, GREEN, 'Accepted Quantity 2.50. After Post Credit the core stock went from 6.00 to 3.50: exactly 2.5 taken off.')])
stack([before, after]).save('ev/01-before-vs-after-hd.png')

# ---------- SV-9828 02: control path, visible on screen ----------
def badge_panel(png, geo, title, colour, n, note):
    g = json.load(open(geo))
    crop = (g['nx'] - 50, g['by'] - 22, g['bx'] + g['bw'] + 160, g['by'] + g['bh'] + 22)
    return panel(png, crop, title, [(g['bx'], g['by'], g['bx'] + g['bw'], g['by'] + g['bh'], colour, n)], [(n, colour, note)])
b1 = badge_panel(R + 'badge-md-before.png', R + 'badge-md-before.json',
    'Parts > Inventory, MD668D (ATF Bulk - Mobil Delvac 1 ATF 668), before the return.', BLUE, 1, '20 Available.')
b2 = badge_panel(R + 'badge-md-after.png', R + 'badge-md-after.json',
    'The same row after Parts > Returns > Create Return of 2.5 MD668D > Save Return.', GREEN, 2, '17.5 Available: exactly 2.5 taken off.')
stack([b1, b2]).save('ev/02-create-return-control-hd.png')

# ---------- SV-9828 03: where the core Ok button is ----------
panel(R + 'A-3-pick.png', (395, 340, 1898, 445),
    'Work order S9828-17580, Lines tab, after Pick: the core row appears under the part.',
    [(475, 382, 905, 402, BLUE, 1), (1068, 407, 1099, 431, GREEN, 2)],
    [(1, BLUE, 'The core row: "(P550848) Core for FUEL/WATER SEPARATOR...", quantity 2.5.'),
     (2, GREEN, 'Click the green Ok button on that row. This sends the core back to the vendor as a return.')]
).save('ev/03-core-ok-button-hd.png')

# ---------- Cancel Return ticket ----------
d = json.load(open(R + 'cr-run1.json'))
row, mi, dg = d['row1'], d['menu'], d['dialog']
panel(R + 'cr-run1-2-menu.png', (row['x'], row['y'] - 70, row['x'] + row['w'] + 10, mi['by'] + mi['bh'] + 20),
    'Parts > Returns. A Manual return for MD668D, with its three-dot menu open.',
    [(row['x'] + 40, row['y'], row['x'] + row['w'] - 140, row['y'] + row['h'], BLUE, 1),
     (mi['bx'], mi['by'], mi['bx'] + mi['bw'], mi['by'] + mi['bh'], RED, 2)],
    [(1, BLUE, 'The return: Manual Return, Roselle Park Trailer Repair Ltd, MD668D, quantity 1.00, status Manual.'),
     (2, RED, 'Cancel Return in the three-dot menu at the right end of the row.')]
).save('ev/t01-cancel-return-menu-hd.png')
panel(R + 'cr-run1-3-dialog.png', (dg['x'] - 20, dg['y'] - 20, dg['x'] + dg['w'] + 60, dg['y'] + dg['h'] + 20),
    'The confirmation that opens.',
    [(dg['yx'], dg['yy'], dg['yx'] + dg['yw'], dg['yy'] + dg['yh'], RED, 3, 'right')],
    [(3, RED, 'Click Yes. The window closes, but the return is not cancelled and no message appears.')]
).save('ev/t02-confirm-yes-hd.png')
a = d['rowAfterReload']
after_yes = panel(R + 'cr-run1-4-after-yes.png', (row['x'], row['y'] - 70, row['x'] + row['w'] + 10, row['y'] + row['h'] + 12),
    'Straight after clicking Yes.', [(row['x'] + 40, row['y'], row['x'] + row['w'] - 140, row['y'] + row['h'], RED, 4)],
    [(4, RED, 'The Manual return is still listed. No success or error message is shown.')])
after_reload = panel(R + 'cr-run1-5-after-reload.png', (a['x'], a['y'] - 70, a['x'] + a['w'] + 10, a['y'] + a['h'] + 12),
    'After reloading the page.', [(a['x'] + 40, a['y'], a['x'] + a['w'] - 140, a['y'] + a['h'], RED, 5)],
    [(5, RED, 'Still listed, and MD668D stock stays where the return left it (19, not back to 20).')])
stack([after_yes, after_reload]).save('ev/t03-return-still-listed-hd.png')
print('ok')
