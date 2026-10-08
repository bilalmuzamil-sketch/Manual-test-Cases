"""SV-9226 exhibits (8 Oct 2026). Run from this folder: python3 build_exhibits.py"""
import sys, json
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
from PIL import Image, ImageDraw
R = 'ev/raw/'; O = 'ev/'
def row(ps, gap=30):
    H = max(p.height for p in ps); W = sum(p.width for p in ps) + gap*(len(ps)-1)
    out = Image.new('RGB', (W, H), (255,255,255)); x = 0
    for p in ps: out.paste(p, (x, 0)); x += p.width + gap
    return out
def side(a, b, gap=60):
    H = max(a.height, b.height); out = Image.new('RGB', (a.width+gap+b.width, H), (255,255,255))
    out.paste(a, (0,0)); out.paste(b, (a.width+gap, 0)); d = ImageDraw.Draw(out)
    x = a.width+gap//2; d.line([x, 20, x, H-20], fill=(200,205,215), width=4); return out

def half(pre, G, env, col, verdict):
    rows = G['tab']['rows']; ymax = max(r['row'][1]+r['row'][3] for r in rows)
    names = {}
    boxes = []; notes = []
    for i, r in enumerate(rows, 1):
        c = r['cell']; boxes.append((c[0], c[1]+4, c[0]+c[2], c[1]+c[3]-4, col, i, 'right'))
        d = G['detail'][r['n']]['totalRow']['t'].replace('Total ', '')
        notes.append((i, col, f"{r['n']}: the list shows {r['total']}; the sale's own Total is {d}." + verdict(r['total'], d)))
    tab = panel(R+f'{pre}-tab.png', crop=(240, 130, 1300, ymax+8),
                title=f'{env}: Customers > the customer > Part Sales tab', boxes=boxes, notes=notes)
    crops = []
    for i, r in enumerate(rows, 1):
        t = G['detail'][r['n']]['totalRow']['g']
        crops.append(panel(R+f"{pre}-{r['n']}.png", crop=(20, t[1]-136, 330, t[1]+t[3]+10),
                           title=f"{i}. {r['n']} - Financial Info",
                           boxes=[(t[0], t[1], t[0]+t[2], t[1]+t[3], col, i, 'right')], notes=[]))
    return stack([tab, row(crops)])

PB = json.load(open(R+'PB.json')); BA = json.load(open(R+'BA.json'))
a = half('PB', PB, 'BEFORE - Production, build v26.40.12-106a0f1 (8 Oct 2026), customer "aqeel transport 56"', RED,
         lambda l, d: ' Different.' if l != d else '')
b = half('BA', BA, 'AFTER - QA branch sv9667, build v26.40.8-129d22f (8 Oct 2026), customer "TestVT1"', GRN,
         lambda l, d: ' Same.' if l == d else ' DIFFERENT')
side(a, b).save(O+'01-customer-tab-before-after.png')
print('01', Image.open(O+'01-customer-tab-before-after.png').size)
