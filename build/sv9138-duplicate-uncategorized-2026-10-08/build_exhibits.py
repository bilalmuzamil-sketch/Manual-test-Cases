"""SV-9138 exhibits. Run: python3 build_exhibits.py  (reads ev/raw, writes ev/)."""
import json, sys
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, font, RED, GRN, BLU, BLK
from PIL import Image, ImageDraw
R = 'ev/raw/'; O = 'ev/'
B = json.load(open(R+'F-geo.json')); P = json.load(open(R+'F-prod-geo.json'))
INV = json.load(open(R+'F-inv-geo.json')); RF = json.load(open(R+'F-refuse-geo.json'))
PROD = 'Production (app.shopview.com, build v26.40.12-106a0f1), 8 Oct 2026'
QA = 'QA branch sv9138 (build v26.40.12-944b391), 8 Oct 2026'

def side(a, b, gap=60):
    H = max(a.height, b.height); out = Image.new('RGB', (a.width+gap+b.width, H), (255,255,255))
    out.paste(a, (0,0)); out.paste(b, (a.width+gap, 0))
    d = ImageDraw.Draw(out); x = a.width + gap//2; d.line([x, 20, x, H-20], fill=(200,205,215), width=4)
    return out

def rowbox(r, c, n, pad=0): return (r['x']+6, r['y']+3, r['x']+430, r['y']+r['h']-3, c, n)

# 01 Settings -> Categories, before vs after
pl = P['list']; bl = B['list']
a = panel(R+'F-prod-list.png', crop=(205,70,720,430),
    title='BEFORE - ' + PROD + ': Settings > Categories after importing one file',
    boxes=[(pl[0]['x']+4, pl[0]['y']+4, pl[0]['x']+170, pl[0]['y']+44, BLU, 1),
           (pl[1]['x']+4, pl[1]['y']+4, pl[3]['x']+170, pl[3]['y']+44, RED, 2)],
    notes=[(1, BLU, 'The real "Uncategorized" category (Default).'),
           (2, RED, 'Three more "Uncategorized" rows. One import created all three, because the file had the word with extra spaces or in capitals.')])
b = panel(R+'F-branch-list.png', crop=(205,70,720,430),
    title='AFTER - ' + QA + ': the same spellings imported three times',
    boxes=[(bl[0]['x']+4, bl[0]['y']+4, bl[0]['x']+170, bl[0]['y']+44, GRN, 1)],
    notes=[(1, GRN, 'Still exactly one "Uncategorized". Every part from the three imports went into it (8,766 parts before, 8,784 after).')])
side(a, b).save(O+'01-categories-before-after.png')

# 02 Category dropdown, before vs after
po = P['opts']; bo = B['opts']
a = panel(R+'F-prod-dropdown.png', crop=(470,300,1130,610),
    title='BEFORE - ' + PROD + ': New Inventory Part > Category',
    boxes=[(po[0]['x']+2, po[0]['y']+3, po[0]['x']+300, po[3]['y']+po[3]['h']-3, RED, 1, 'right')],
    notes=[(1, RED, 'The dropdown starts with four "Uncategorized" choices, so users have to scroll past them, which is what the customer reported.')])
b = panel(R+'F-branch-dropdown.png', crop=(470,300,1130,610),
    title='AFTER - ' + QA + ': New Inventory Part > Category',
    boxes=[(bo[0]['x']+2, bo[0]['y']+3, bo[0]['x']+300, bo[0]['y']+bo[0]['h']-3, GRN, 1, 'right')],
    notes=[(1, GRN, 'One "Uncategorized", then the real categories straight away.')])
side(a, b).save(O+'02-dropdown-before-after.png')

# 03 Import result on the branch, with the exact text typed in the file
rows = [r for r in INV['rows'] if len(r['td']) > 4]
typed = ['" Uncategorized"', '"Uncategorized "', '"  UNCATEGORIZED  "', '"uncategorized"', '(left empty)',
         '"Uncategorized"', '"ZZAUTOTEST-9138-Cat"', '" zzautotest-9138-cat "', '" HD-Fasteners "']
cat_x0, cat_x1 = 692, 900
boxes = []
for i, r in enumerate(rows):
    c = GRN if i < 6 else BLU
    boxes.append((cat_x0+4, r['y']+6, cat_x1, r['y']+r['h']-6, c, i+1, 'right'))
p3 = panel(R+'F-branch-inventory2.png', crop=(240,140,1000,622),
    title='AFTER - ' + QA + ': Parts > Inventory, the 9 parts from the test file (Category column)',
    boxes=boxes,
    notes=[(i+1, GRN if i < 6 else BLU, f'File said {t} - saved as "{rows[i]["td"][4]}".') for i, t in enumerate(typed)])
p3.save(O+'03-import-result-qa.png')

# 04 Settings refusals on the branch
ad = RF['add']; ch = ad['chip']; sv = ad['addSave']
a = panel(R+'F-add-refused.png', crop=(480,280,1120,610),
    title='AFTER - ' + QA + ': Settings > Categories > New Category, name typed as " Uncategorized"',
    boxes=[(ch['x'], ch['y'], ch['x']+ch['w'], ch['y']+ch['h'], RED, 1), (sv['x'], sv['y'], sv['x']+sv['w'], sv['y']+sv['h'], RED, 2, 'right')],
    notes=[(1, RED, 'Warning: "Category Name Is Already In Use."'), (2, RED, 'Save & Close is greyed out, so no copy can be created.')])
n = RF['notif']; ri = RF['renInput']
b = panel(R+'F-rename-refused.png', crop=(480,300,1520,900),
    title='AFTER - ' + QA + ': renaming an ordinary category to "UNCATEGORIZED" and pressing Save & Close',
    boxes=[(ri['x'], ri['y'], ri['x']+ri['w'], ri['y']+ri['h'], BLU, 1), (n['x'], n['y'], n['x']+n['w'], n['y']+n['h'], RED, 2)],
    notes=[(1, BLU, 'The new name typed in.'), (2, RED, 'Refused: "Cannot rename a category to the reserved name "Uncategorized"." The category keeps its old name.')])
stack([a, b]).save(O+'04-settings-refused-qa.png')
for f in ['01-categories-before-after','02-dropdown-before-after','03-import-result-qa','04-settings-refused-qa']:
    im = Image.open(O+f+'.png'); print(f, im.size)
