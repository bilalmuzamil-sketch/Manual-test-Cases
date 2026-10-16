import json, sys
sys.path.insert(0, '..')
from bexh import *
X = json.load(open('data/x21.json')); H = json.load(open('data/h21.json')); mk = X['mk']['version']
def strip(png, labels, pairs, y0=136, y1=180):
    im = Image.open(png).convert('RGB'); d = ImageDraw.Draw(im); L = {l['t']: l for l in labels}; notes = []
    for n, (a, b) in enumerate(pairs, 1):
        la, lb = L[a], L[b]
        r = {'x': la['x'] - 3, 'y': la['y'] - 4, 'w': lb['x'] + lb['w'] - la['x'] + 6, 'h': la['h'] + 8}
        xy = box(d, r, GRN, pad=2, w=4); badge(d, xy[2] + 18, xy[1] + 4, n, GRN)
        notes.append(f'{n} "{a}" and "{b}": {lb["x"] - (la["x"] + la["w"]):.0f} px apart')
    return im.crop((0, y0 * 2, 2880, y1 * 2)), notes
b = Image.open('ev/04-tech_view-from-completed-tab-1440.png').convert('RGB').crop((0, 140, 1440, 190)).resize((2880, 100), Image.LANCZOS)
d = ImageDraw.Draw(b)
for x0, x1 in [(1770, 2095), (2100, 2450)]: d.rectangle([x0, 18, x1, 82], outline=RED, width=4)
before = head(legend(b, ['Bold black labels; "Progress" touches "Service Advisor" and "Lead Technician" runs into "Clocked In"'], RED, 22), 'BEFORE: ticket picture, Tech View headers at 1440 px', 'Staging, 14 Oct 2026', RED)
a1, n1 = strip('ev/x21-def0.png', X['def0'], [('Progress', 'Service Advisor')])
a2, n2 = strip('ev/x21-all2.png', X['all2'], [('Progress', 'Service Advisor'), ('Lead Technician', 'Clocked In')])
dg = [r for r in H['runs'] if r['tag'] == 'default']; ag = [r for r in H['runs'] if r['tag'] == 'all']
p1 = head(legend(a1, [f'Default 13 columns: every label 12px, weight 500, rgb(105, 117, 134); closest pair of labels {min(r["minGap"] for r in dg)} px apart at 1024–1920 px'] + n1, GRN, 22), 'AFTER: default columns, 1440 px', f'Staging {mk} · 16 Oct', GRN)
p2 = head(legend(a2, [f'All 20 columns switched on (scrolled right): same style; closest pair {min(r["minGap"] for r in ag)} px apart at 1024–1920 px, no label on two lines'] + n2, GRN, 22), 'AFTER: every optional column added, 1440 px', f'Staging {mk} · 16 Oct', GRN)
page("Tech View column header labels: 12px, weight 500, secondary grey; no overlap", col([before, p1, p2]),
     ['Window 1440 x 900 px (also measured at 1024, 1280, 1536 and 1920, and at Compact and Comfortable), browser zoom 100%. The design draws these labels in rgb(105, 117, 134).',
      "Spec v64, S2-R21: \"Tech View's column header labels are 12px, medium weight (500), in the secondary text color, as in the design. Labels never overlap a neighboring label.\""]).save('ev/sv11321-01-header-labels.png')
print('ok')
