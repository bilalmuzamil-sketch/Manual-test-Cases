import json, sys
sys.path.insert(0, '..')
from bexh import *
mk = json.load(open('data/d02bx2-admin.json'))['mk']['version']; sub = f'Staging {mk} · 16 Oct · admin'
def load(p, top, bot):  # 2x shot -> 1x (css px) crop, annotations drawn after, in css px
    return Image.open(p).convert('RGB').resize((1440, 900), Image.LANCZOS).crop((0, top, 1440, bot))
T = 100
h = load('ev/d02bx2-admin-B-pinned-onto-unpinned-row-hold.png', T, 820); d = ImageDraw.Draw(h)
d.rectangle([2, 326 - T, 1437, 360 - T], outline=RED, width=3); badge(d, 1415, 343 - T, 1, RED)
d.rectangle([570, 756 - T, 749, 798 - T], outline=BLU, width=3); badge(d, 770, 777 - T, 2, BLU)
d.rectangle([2, 720 - T, 1437, 766 - T], outline=BLU, width=2)
badge(d, 1415, 456 - T, 3, GRN)
hold = head(legend(h, ['1 Pinned header "Ahtsham Foreman" picked up by its grip', '2 Released over work order S2-35339 (an unpinned technician\'s row)', '3 The app\'s blue line shows where it will land: the end of the pinned group'], BLU, 22), 'While dragging', sub, BLU)
a = load('ev/d02bx2-admin-B-pinned-onto-unpinned-row-after.png', 0, 820); d = ImageDraw.Draw(a)
d.rectangle([2, 326, 1437, 406], outline=GRN, width=3); badge(d, 1415, 366, 1, GRN)
d.rectangle([2, 720, 1437, 766], outline=GRN, width=3); badge(d, 1415, 743, 2, GRN)
after = head(legend(a, ['The Work Orders list is still showing: no work order opened', '1 Ahtsham Foreman moved to the end of the pinned group, after Aaron Baker', '2 S2-35339 was not opened and is still under Ahtsham Parts Manger'], GRN, 22), 'AFTER release', sub, GRN)
page('Tech View: dragging a pinned technician\'s header never opens a work order', row([hold, after]),
     ['Window 1440 x 900 px, browser zoom 100%, mouse. No before picture: the ticket has no screenshot and Tech View is not on production yet.',
      'Spec v64, S9-R9: "Allow pinned technicians to re order only within the pinned area." S2-R8: "Clicking anywhere on a row, outside its own controls, opens the work order. A drag starts only after the pointer has moved a few pixels, so a click never turns into a drag."']).save('ev/sv11402-01-header-drag.png')
print('ok')
