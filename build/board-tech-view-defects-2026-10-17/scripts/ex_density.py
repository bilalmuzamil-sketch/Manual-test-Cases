"""SV-11397 + SV-11420 exhibits: Tech View row at Compact / Regular / Comfortable on staging, with measured sizes."""
import sys, json
sys.path.insert(0, '/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16')
from PIL import Image, ImageDraw
from bexh import head, legend, col, page, box, RED, GRN, BLU
from qa_exhibits import fnt
R = '/home/user/Manual-test-Cases/build/board-tech-view-defects-2026-10-17/'
E = R + 'sv11397/ev/'; S = 2
D = json.load(open(E + 'x97.json'))
MK = D['mk']['version']

def panel(dens, want, title, sub, above=False):
    d = D['tech-' + dens]; it = {i['label']: i for i in d['items'] if i}
    im = Image.open(E + f'x97-tech-{dens}.png').convert('RGB'); dr = ImageDraw.Draw(im); f = fnt(24, True)
    for lab, txt in want:
        r = it[lab]; xy = box(dr, r, GRN, S=S, pad=5, w=4)
        if above:
            t = txt(r); w = dr.textlength(t, font=f); x0 = xy[0]; y0 = xy[1] - 36
            dr.rectangle([x0, y0, x0 + w + 10, y0 + 32], fill='white', outline=GRN, width=2); dr.text((x0 + 5, y0 + 3), t, font=f, fill=GRN)
        else:
            dr.text((xy[2] + 8, (xy[1] + xy[3]) // 2), txt(r), font=f, fill=GRN, anchor='lm')
    y0 = int(min(d['rowY'], it['group header avatar']['y']) - 14) * S; y1 = int(d['rowY'] + d['rowH'] + 40) * S
    return head(im.crop((40 * S, y0, 1720 * S, y1)), title, sub, BLU)

ROW = {'compact': (20, 24), 'regular': (24, 28), 'comfortable': (32, 36)}
px = lambda r: f"{r['w']:.0f} px"
# SV-11397
ps = [panel(dn, [('group header avatar', px), ('Service Advisor avatar', px), ('technician avatar', px)],
            f'AFTER (staging): {dn.capitalize()}', f'Group header avatar {ROW[dn][1]} px, row avatars {ROW[dn][0]} px (technician and Service Advisor)') for dn in ROW]
before = head(Image.open(R + 'ticket-images/SV-11397-D-DESIGN-7-b-densities.png').convert('RGB'), 'BEFORE: the picture in this ticket (staging, 16 October)', 'The avatar stayed the same size at every density', RED)
body = legend(col([before] + ps), ['Work order S2-16688 (M&J Truck Repair LLC) under its lead Brandi Smith. Green boxes: each avatar, with its measured width. Board View card avatars measured 24 px at all three densities (spec: they stay 24 px).'], (40, 40, 40))
page('SV-11397: Tech View avatars now follow the density', body,
     [f'Staging build {MK}, 17 October 2026, window 1920 x 900 px (wider than usual so the Assigned Techs column fits in one picture), browser zoom 100%. Sizes read from the page with the browser\'s own measurements.']).save(R + 'sv11397/ev/sv11397-01-avatar-sizes.png')
# SV-11420
fsz = lambda r: f"{r['fs']}"
ps = [panel(dn, [('number', fsz), ('customer', fsz), ('percentage', fsz)], f'AFTER (staging): {dn.capitalize()}', 'Row text 14 px, progress percentage 12 px', above=True) for dn in ROW]
before = head(Image.open(R + 'ticket-images/SV-11420-C96990-1-tech-view-row-text-13px.png').convert('RGB'), 'BEFORE: the picture in this ticket (staging, 16 October)', 'Row text 13 px and the percentage 11 px', RED)
body = legend(col([before] + ps), ['Work order S2-16688. Green boxes: the number, the customer and the percentage beside the progress bar, with the text size the page reports. The other text cells measured (Waiting On Parts, Unit, Asset, VIN/Serial #, Total Price) also read 14 px at all three densities.'], (40, 40, 40))
page('SV-11420: Tech View row text 14 px and percentage 12 px at every density', body,
     [f'Staging build {MK}, 17 October 2026, window 1920 x 900 px, browser zoom 100%. Text sizes read from the page (computed font size).']).save(R + 'sv11420/ev/sv11420-01-text-sizes.png')
for n in ['sv11397/ev/sv11397-01-avatar-sizes', 'sv11420/ev/sv11420-01-text-sizes']: print(n, Image.open(R + n + '.png').size)
