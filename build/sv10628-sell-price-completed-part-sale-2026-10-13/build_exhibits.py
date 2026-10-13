"""SV-10628 exhibits. Run: python3 build_exhibits.py  (from this folder)."""
import json, sys
sys.path.insert(0, '../testing-tools')
from ticket_exhibit import panel, stack
RED, GREEN, BLUE = (214, 40, 40), (22, 135, 60), (30, 90, 200)
R = 'ev/raw/'
pb = json.load(open('data/prod-before-out.json')); pw = json.load(open('data/prod-before-wo-out.json'))
ex = json.load(open('data/extra.json'))['ps']; cap = json.load(open('data/cap.json'))

def cell(g, pad_l=14, w=96):   # the Sell Price input is narrow; box the whole cell around it
    x, y, ww, h = g
    return (x - pad_l, y - 2, x - pad_l + w, y + h + 2)
def box(g, c, n, pad=4):
    x, y, w, h = g
    return (x - pad, y - pad, x + w + pad, y + h + pad, c, n)

# ---------- 01 part sale: BEFORE production vs AFTER branch ----------
g1, g2 = pb['geo1'], pb['geo2']
before = panel(R + 'prod-before-2.png', (20, 80, 1600, 1000),
    'BEFORE - production app.shopview.com, build v26.40.17-f5bf8f4, 13 Oct 2026. Logged in with the Parts Manager role. Part sale P2-70 (Complete).',
    [box(g1['status'], BLUE, 1), (*cell(g2['price'])[:4], RED, 2), box(g2['toast'][0], RED, 3)],
    [(1, BLUE, 'The part sale is Complete; the part is Received (same shape as the customer\'s P-21059).'),
     (2, RED, 'Sell Price changed from $25.00 to $26.00 in the grid and Enter pressed.'),
     (3, RED, 'Error: "Cannot change part on completed work order." After a reload the price is still $25.00.')])
a1 = ex['geo1']
after = panel(R + 'after-2-after-edit-reload.png', (20, 80, 1600, 1000),
    'AFTER - QA branch sv10628, build v26.40.17-ec15c08, 13 Oct 2026. Same role (Parts Manager). Part sale P2-209 (Complete), after a page reload.',
    [box(a1['status'], BLUE, 1), (*cell(a1['price'])[:4], GREEN, 2), (a1['fin'][0], a1['fin'][1]+a1['fin'][3]-232, a1['fin'][0]+a1['fin'][2], a1['fin'][1]+a1['fin'][3]+2, GREEN, 3)],
    [(1, BLUE, 'The part sale is still Complete. This part is a Received vendor part, like the customer\'s.'),
     (2, GREEN, 'Sell Price changed from $26.44 to $35.00 (quantity 4): no error, and it is still $35.00 after a reload.'),
     (3, GREEN, 'Financial Info followed: Parts $153.17 -> $187.41 (4 x $8.56 more), Total $160.84 -> $196.79.')])
stack([before, after]).save('ev/sv10628-01-part-sale-before-after.png')

# ---------- 02 service work order: BEFORE production vs AFTER branch ----------
gw = pw['geo']
wb = panel(R + 'prod-before-wo.png', (20, 80, 1600, 1000),
    'BEFORE - production, build v26.40.17-f5bf8f4, 13 Oct 2026, Parts Manager role. Service work order S2-810 (Complete), Parts tab.',
    [box(gw['status'], BLUE, 1), (*cell(gw['price'])[:4], RED, 2), box(gw['toast'][0], RED, 3)],
    [(1, BLUE, 'The work order is Complete.'),
     (2, RED, 'Sell Price changed from $90.00 to $91.00.'),
     (3, RED, 'Same error. After a reload the price is still $90.00.')])
gw2 = cap['woGeo']
wa = panel(R + 'after-wo-grid.png', (20, 80, 1600, 700),
    'AFTER - QA branch sv10628, build v26.40.17-ec15c08, Parts Manager role. Service work order S3-15003 (Complete), Parts tab, after a reload.',
    [box(gw2['status'], BLUE, 1), (*cell(gw2['price'])[:4], GREEN, 2)],
    [(1, BLUE, 'The work order is still Complete.'),
     (2, GREEN, 'Sell Price changed from $63.05 to $64.05: no error, kept after a reload.')])
stack([wb, wa]).save('ev/sv10628-02-work-order-before-after.png')

# ---------- 03 Edit Part dialog on a completed work order ----------
dg = cap['dlg']['geo']
d = panel(R + 'after-wo-dialog.png', (20, 80, 1600, 820),
    'QA branch, Parts Manager role. S3-15003 (Complete) -> Lines tab -> click the part 68399093AB -> Edit Part.',
    [box(dg['status'], BLUE, 1), box(dg['price'], GREEN, 2), box(dg['save'], GREEN, 3)],
    [(1, BLUE, 'Work order is Complete.'),
     (2, GREEN, 'The Sell Price is editable in the Edit Part dialog too (here $64.05).'),
     (3, GREEN, 'Save & Close saves with no error and the work order stays Complete - in the recording the price goes $58.05 -> $63.05 this way.')])
d.save('ev/sv10628-03-edit-part-dialog.png')

# ---------- 04 still refused where it should be ----------
pg = cap['paid']['geo']
p1 = panel(R + 'after-paid.png', (20, 80, 1600, 420),
    'QA branch, Parts Manager role. Part sale P3-239 is Paid.',
    [box(pg['status'], BLUE, 1), (*cell(pg['price'])[:4], BLUE, 2)],
    [(1, BLUE, 'Paid part sale.'), (2, BLUE, 'Sell Price is greyed out and cannot be changed - unchanged by this fix.')])
cg = cap['cust']['geo']
p2 = panel(R + 'after-custom.png', (20, 80, 1600, 600),
    'QA branch, a test role that can only VIEW part sales. Part sale P2-243 (Complete).',
    [box(cg['status'], BLUE, 1), (cell(cg['first'])[0], cg['first'][1] - 4, cell(cg['first'])[2], cg['last'][1] + cg['last'][3] + 4, BLUE, 2)],
    [(1, BLUE, 'Complete part sale.'), (2, BLUE, 'All five Sell Prices are greyed out and there is no Add Part button: a user without edit rights still cannot change parts.')])
stack([p1, p2]).save('ev/sv10628-04-still-locked.png')
print('ok')
