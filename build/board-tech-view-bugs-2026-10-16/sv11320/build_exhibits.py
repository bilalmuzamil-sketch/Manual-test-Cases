import json, sys
sys.path.insert(0, '..')
from bexh import *
A = json.load(open('data/x20-admin.json')); T = json.load(open('data/x20-tech.json')); mk = A['mk']['version']
def panel(png, R, quick):
    im = Image.open(png).convert('RGB'); d = ImageDraw.Draw(im)
    box(d, R['uaHead'], RED, pad=2, w=4); badge(d, (R['uaHead']['x'] + R['uaHead']['w']) * 2 + 24, R['uaHead']['y'] * 2 + 10, 1, RED)
    rl = R['rowsLeft']
    if quick == 'admin':
        box(d, rl, GRN, pad=4, w=4); badge(d, (rl['x'] + rl['w']) * 2 + 24, rl['y'] * 2 + 20, 2, GRN)
    else:
        box(d, rl, RED, pad=4, w=4); badge(d, (rl['x'] + rl['w']) * 2 + 24, rl['y'] * 2 + 20, 2, RED)
    return im.crop((0, int(R['uaHead']['y'] * 2) - 120, 1500, int((rl['y'] + rl['h']) * 2) + 20))
def heads(png, R):
    im = Image.open(png).convert('RGB'); d = ImageDraw.Draw(im); hs = R['heads']
    u = {'x': hs[0]['x'], 'y': hs[0]['y'], 'w': hs[0]['w'], 'h': hs[-1]['y'] + hs[-1]['h'] - hs[0]['y']}
    box(d, u, GRN, pad=6, w=4); badge(d, (u['x'] + u['w']) * 2 + 26, u['y'] * 2 + 10, 3, GRN)
    return im.crop((0, int(hs[0]['y'] * 2) - 120, 1100, int((hs[-1]['y'] + hs[-1]['h']) * 2) + 20))
b0 = Image.open('ev/06-tech_view-row-hover-1440.png').convert('RGB'); b0 = b0.crop((0, 280, 720, 700)).resize((1080, 630), Image.LANCZOS)
before = head(legend(b0, ['No grip at the left of any work order row'], RED, 20), 'BEFORE: ticket picture (Tech View rows)', 'Staging, 14 Oct 2026', RED)
pa = head(legend(panel('ev/x20-admin-ua.png', A['R'], 'admin'), [f"1 Unassigned header: no grip", f"2 Every row has the six-dot grip ({A['R']['nGrips']} of {A['R']['nRows']} shown; 59/59 on screen, 156/156 while scrolling; Aaron Baker 16/16)"], GRN, 20),
          'AFTER: Admin (can drag work orders)', f'Staging {mk} · 16 Oct', GRN)
pt = head(legend(panel('ev/x20-tech-ua.png', T['R'], 'tech'), ['1 Unassigned header: no grip', '2 No row grips for a view-only user (0 of 59 Unassigned rows, 0 of 57 in a technician group)'], GRN, 20),
          'AFTER: Technician (view only, cannot drag work orders)', f"Staging {T['mk']['version']} · 16 Oct", GRN)
ph = head(legend(heads('ev/x20-tech-heads.png', T['R']), ['3 Technician headers keep their grip for the view-only user too (59 of 59 headers)'], GRN, 20), 'AFTER: Technician, group headers', f"Staging {T['mk']['version']} · 16 Oct", GRN)
body = col([row([before, pa]), row([pt, ph])])
page('Tech View: drag grip on every work order row for users who can drag', body,
     ['Window 1440 x 900 px, browser zoom 100%. Admin = Work Orders create and edit; Technician role reset to template first (Work Orders view only).',
      'Spec v64, S9-R1a: "In Tech View every work order row, Unassigned\'s rows included, shows the design\'s six-dot drag grip at its left edge to users who can drag work orders (S4-N1). Every technician group header shows the grip to every user who can reorder technicians (S9-R2), view-only users included ... The Unassigned group header shows no grip ... The whole row still drags (S2-R8); the grip shows that it can."']).save('ev/sv11320-01-row-grips.png')
print('ok')
