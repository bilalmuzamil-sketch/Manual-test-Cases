"""SV-10902 exhibits (8 Oct 2026). Run from this folder: python3 build_exhibits.py"""
import sys
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
from PIL import Image, ImageDraw
R = 'ev/raw/'; O = 'ev/'
def side(a, b, gap=60):
    H = max(a.height, b.height); out = Image.new('RGB', (a.width+gap+b.width, H), (255,255,255))
    out.paste(a, (0,0)); out.paste(b, (a.width+gap, 0)); d = ImageDraw.Draw(out)
    x = a.width+gap//2; d.line([x, 20, x, H-20], fill=(200,205,215), width=4); return out
start = panel(R+'B2-before-splits.png', crop=(240,340,1340,600),
    title='Starting point (same steps on both): the row was set to "ZZ Acme" by a rule, then split; a second rule changed the lines to "ZZ Bob" and a third line was added untouched',
    boxes=[(630,472,812,582,BLU,1,'right')], notes=[(1,BLU,'The split lines read ZZ Bob, ZZ Bob and blank. ZZ Acme is no longer on any line; it only survives hidden on the row.')])
before = panel(R+'P5-list-after.png', crop=(232,425,1580,575),
    title='BEFORE - Production, build v26.40.12-106a0f1, 8 Oct 2026: after the category-only rule (row ZZ10902-A)',
    boxes=[(1115,521,1312,566,RED,2)], notes=[(2,RED,'The row comes back as "ZZ Acme", the customer from before the split. Nobody picked it for this row.')])
after = panel(R+'B2-after.png', crop=(232,425,1580,575),
    title='AFTER - QA branch sv10360, build v26.40.8-3e5c1df, 8 Oct 2026: after the same rule (row ZZ10902-G)',
    boxes=[(1115,521,1312,566,GRN,2)], notes=[(2,GRN,'The row comes back with no customer. ZZ Acme does not come back.')])
stack([start, before, after]).save(O+'01-before-after.png')
rows = [(487,'F',GRN,'F: lines 4 Star, 4 Star (they agreed) -> 4 Star kept, correctly'),
        (542,'E',GRN,'E: splits cleared by hand -> blank'),
        (598,'D',GRN,'D: lines picked by the user, both 7 Star -> 7 Star kept'),
        (652,'C',BLU,'C: lines picked by the user, 7 Star and A & J (they disagree) -> left alone, still split'),
        (707,'B',GRN,'B: lines 7 Star, 7 Star (set by a rule) -> 7 Star kept'),
        (762,'A',GRN,'A: lines 7 Star, 7 Star and blank, old customer 4 Star hidden -> blank, 4 Star does not come back')]
panel(R+'U2-list-after.png', crop=(232,425,1580,795),
    title='All six rows right after the category-only rule (QA branch sv10360, 8 Oct 2026). Every row was set to 4 Star Truck Repair before it was split',
    boxes=[(1115,y-24,1312,y+24,c,i+1) for i,(y,_,c,_t) in enumerate(rows)],
    notes=[(i+1,c,t) for i,(_,_,c,t) in enumerate(rows)]).save(O+'02-all-cases-after-rule.png')
for f in ['01-before-after','02-all-cases-after-rule']: print(f, Image.open(O+f+'.png').size)
panel(R+'W3-categorized.png', crop=(232,508,1580,630),
    title='Categorized tab after posting (QA branch sv10360, 8 Oct 2026), Customer / Vendor column on the right',
    boxes=[(1240,521,1440,566,GRN,1), (1240,576,1440,620,GRN,2)],
    notes=[(1,GRN,'ZZ10902-B posted with 7 Star Truck Repair (its split lines all agreed).'),
           (2,GRN,'ZZ10902-A posted with no customer. It did not post as 4 Star Truck Repair, the customer from before the split.')]).save(O+'03-posted-rows.png')
print('03', Image.open(O+'03-posted-rows.png').size)
