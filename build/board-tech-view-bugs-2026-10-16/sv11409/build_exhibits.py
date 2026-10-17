"""SV-11409 exhibits: keyboard focus on avatars shows names; Columns menu and chip x by keyboard."""
import json, sys
sys.path.insert(0, '/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16')
from PIL import Image, ImageDraw
from bexh import head, box, badge, legend, row, col, page, RED, GRN, BLU
E = '/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16/sv11409/'
S = 2; G = json.load(open(E + 'data/cap.json'))['shots']

def pan(k, crop, title, sub, c=GRN, scale=1.0):
    g = G[k]; im = Image.open(E + f'ev/cap-{k}.png').convert('RGB'); d = ImageDraw.Draw(im)
    a = g['active']
    if a['w'] < 1400: box(d, {'x': a['x'], 'y': a['y'], 'w': a['w'], 'h': a['h']}, RED, pad=6, w=4)
    if g.get('tip'): box(d, {'x': g['tip']['x'], 'y': g['tip']['y'], 'w': g['tip']['w'], 'h': g['tip']['h']}, GRN, pad=4, w=4)
    im = im.crop(tuple(int(v * S) for v in crop))
    if scale != 1.0: im = im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)
    return head(im, title, sub, c)

def around(k, w=620, up=70, down=40):
    a = G[k]['active']; x0 = max(0, min(1440 - w, a['x'] - w / 2)); y1 = min(900, a['y'] + a['h'] + down); return (x0, y1 - up - a['h'] - down, x0 + w, y1)

ps = [pan('tv-avatar1', around('tv-avatar1'), 'Tech View, row S2-12718: Tab reaches the first avatar', 'Its name shows on focus: "David Haynes"'),
      pan('tv-overflow', around('tv-overflow'), 'Tech View: Tab reaches "+3"', 'Names on focus: "Nicole Mitchell, Emily Madden, Karen Peck"'),
      pan('bv-avatar1', around('bv-avatar1', up=100, down=60), 'Board View, card S2-12718: first avatar', 'Name on focus: "David Haynes"'),
      pan('bv-overflow', around('bv-overflow', up=100, down=60), 'Board View: "+3"', 'Names on focus: "Nicole Mitchell, Emily Madden, Karen Peck"')]
b = legend(col([row(ps[:2]), row(ps[2:])]), ['Red: the avatar that has keyboard focus (blue focus ring). Green: the name that appears, the same box as on mouse hover. Reached with the keyboard only (Tab into the view, arrow keys to the work order, Tab to its avatars).'], (40, 40, 40))
page('SV-11409: technician names behind avatars by keyboard', b,
     ['Staging build v26.40.19-754919e, 17 October 2026, window 1440 x 900 px, zoom 100%, search "Lamkin", all groups open.']).save(E + 'ev/sv11409-01-avatar-names.png')

ps = [pan('tv-columns-unit-off', (640, 60, 1120, 420), 'Columns menu: Enter opens it, Tab reaches "Unit"', 'Space turned Unit off (the column left the table); Space again turned it back on', BLU),
      pan('tv-chip-x', (380, 64, 900, 124), 'Filter chip x: Tab reaches it', '"Status: In progress" with its x focused ("Clear Status filter")', BLU, 1.4),
      pan('tv-chip-cleared', (380, 64, 900, 124), 'Enter on the x', 'The Status filter is cleared', GRN, 1.4)]
b = legend(col([ps[0], row(ps[1:])]), ['The same worked in Board View ("Fields to display" menu) and with the Asset on Site chip, with both Enter and Space.'], (40, 40, 40))
page('SV-11409: Columns options and filter chip x by keyboard', b,
     ['Staging build v26.40.19-754919e, 17 October 2026, Tech View, window 1440 x 900 px, zoom 100%.']).save(E + 'ev/sv11409-02-columns-and-chip.png')
for n in ['sv11409-01-avatar-names', 'sv11409-02-columns-and-chip']: print(n, Image.open(E + f'ev/{n}.png').size)
