"""SV-10599 re-test exhibits (8 Oct 2026). Run from this folder: python3 build_exhibits.py"""
import sys, json
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
from PIL import Image, ImageDraw
R = 'ev/raw/'; O = 'ev/'
def side(a, b, gap=60):
    H = max(a.height, b.height); out = Image.new('RGB', (a.width+gap+b.width, H), (255,255,255))
    out.paste(a, (0,0)); out.paste(b, (a.width+gap, 0)); d = ImageDraw.Draw(out)
    x = a.width+gap//2; d.line([x, 20, x, H-20], fill=(200,205,215), width=4); return out
def J(f): return json.load(open(R+f))
OLD = 'QA branch sv10599, build v26.40.3-971d112 (7 Oct 2026)'
NEW = 'QA branch sv10599, build v26.40.12-9176f26 (8 Oct 2026)'
PROD = 'Production, build v26.40.12-106a0f1 (8 Oct 2026)'

# 01: same work order S10599-17581, yesterday vs today
x2 = J('X2.json')['col']; b5 = J('B5.json')
a1 = panel(R+'X2-parts-collapsed.png', crop=(300,80,1240,225), title='BEFORE - '+OLD+': S10599-17581, Parts tab, line folded',
    boxes=[(x2[1]['g'][0], x2[1]['g'][1], x2[1]['g'][0]+x2[1]['g'][2], x2[1]['g'][1]+x2[1]['g'][3], RED, 1, 'right')],
    notes=[(1, RED, '"3 In Stock", but only one of the three stock parts has any on hand (the other two are at 0 and -3).')])
a2 = panel(R+'X4-list-tip.png', crop=(20,120,700,250), title='BEFORE - Work Orders list, hover the small blue circle on the status',
    boxes=[(128, 140, 281, 195, RED, 2, 'right')],
    notes=[(2, RED, '"3 Parts In Stock".')])
c = b5['collapsed'][1]['g']; t = b5['tip'][0]['g']
b1 = panel(R+'B5-parts-collapsed.png', crop=(300,80,1240,225), title='AFTER - '+NEW+': S10599-17581, Parts tab, line folded',
    boxes=[(c[0], c[1], c[0]+c[2], c[1]+c[3], GRN, 1, 'right')],
    notes=[(1, GRN, '"1 In Stock": only FLAT HOOK WINCH STRAP (10 on hand) is counted. The parts at 0 and -3 are left out.')])
b2 = panel(R+'B5-list-tip.png', crop=(20,120,700,250), title='AFTER - Work Orders list, hover the small blue circle on the status',
    boxes=[(t[0], t[1], t[0]+t[2], t[1]+t[3], GRN, 2, 'right')],
    notes=[(2, GRN, '"1 Part In Stock". Same parts, same stock as yesterday.')])
side(stack([a1, a2]), stack([b1, b2])).save(O+'01-same-work-order-before-after.png')

# 02: production vs branch, one line with a 0-on-hand part and a stocked part
pb = J('PB.json'); f1 = J('F1.json')
c = pb['collapsed'][0]['g']; t = pb['tip'][0]['g']
p1 = panel(R+'PB-parts-expanded.png', crop=(300,80,1590,345), title='BEFORE - '+PROD+': work order S2-964, Parts tab',
    boxes=[(1495, 283, 1575, 319, RED, 1)],
    notes=[(1, RED, 'ZZKRYPTON Brake Kit has 0 on hand and still shows "In Stock".')])
p2 = panel(R+'PB-parts-collapsed.png', crop=(300,80,1240,225), title='BEFORE - '+PROD+': work order S2-964 (ZZKRYPTON Brake Kit 0 on hand + A427 5 on hand), Parts tab, line folded',
    boxes=[(c[0], c[1], c[0]+c[2], c[1]+c[3], RED, 1, 'right')], notes=[(1, RED, '"2 In Stock": the part with 0 on hand is counted.')])
p3 = panel(R+'PB-list-tip.png', crop=(20,120,700,250), title='Work Orders list, hover the blue circle',
    boxes=[(t[0], t[1], t[0]+t[2], t[1]+t[3], RED, 2, 'right')], notes=[(2, RED, '"2 Parts In Stock".')])
c = f1['collapsed'][0]['g']; t = f1['tip'][0]['g']
q1 = panel(R+'F1-parts-expanded.png', crop=(300,80,1590,380), title='AFTER - '+NEW+': work order S10599-17586, Parts tab',
    boxes=[(1495, 312, 1575, 360, GRN, 1)],
    notes=[(1, GRN, 'SPINDLE NUT KIT has 0 on hand: no "In Stock" badge.')])
q2 = panel(R+'F1-parts-collapsed.png', crop=(300,80,1240,225), title='AFTER - '+NEW+': work order S10599-17586 (SPINDLE NUT KIT 0 on hand + FLAT HOOK WINCH STRAP 10 on hand), Parts tab, line folded',
    boxes=[(c[0], c[1], c[0]+c[2], c[1]+c[3], GRN, 1, 'right')], notes=[(1, GRN, '"1 In Stock": only the part with stock is counted.')])
q3 = panel(R+'F1-list-tip.png', crop=(20,120,700,250), title='Work Orders list, hover the blue circle',
    boxes=[(t[0], t[1], t[0]+t[2], t[1]+t[3], GRN, 2, 'right')], notes=[(2, GRN, '"1 Part In Stock".')])
side(stack([p2, p3]), stack([q2, q3])).save(O+'02-production-vs-qa.png')

# 03: two lines on one work order
e1 = J('E1.json'); g = e1['groups']; c = e1['collapsed'][0]['g']
panel(R+'E1-parts-collapsed.png', crop=(300,80,1590,270), title='AFTER - '+NEW+': work order S10599-17585, two lines, both folded',
    boxes=[(g[0]['g'][0], g[0]['g'][1]-4, g[0]['g'][0]+700, g[0]['g'][1]+g[0]['g'][3]+4, BLU, 1),
           (c[0], c[1], c[0]+c[2], c[1]+c[3], GRN, 2, 'right')],
    notes=[(1, BLU, 'Line 1 has only SPINDLE NUT KIT (0 on hand): no "In Stock" count.'),
           (2, GRN, 'Line 2 has FLAT HOOK WINCH STRAP (10 on hand): "1 In Stock".')]).save(O+'03-two-lines-qa.png')
for f in ['01-same-work-order-before-after','02-production-vs-qa','03-two-lines-qa']:
    print(f, Image.open(O+f+'.png').size)
