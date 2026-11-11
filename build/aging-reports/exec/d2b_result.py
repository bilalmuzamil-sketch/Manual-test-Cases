"""d2b_result.py — 11 Nov 2026: C715511 (A/R Customer chip + menu vs Sales By Customer), C715513 / C715514 (Past due chip + tick-box menu vs the
Location menu) from d2 (steps 1, 2, 4: d2/<key>.json + pictures) and d2b (step 3, and step 4 of C715513/514: d2b/out.json + pictures)."""
import json, subprocess
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def comp(dst, parts):
    code = "from PIL import Image\nims=[Image.open(f).crop(b) for f,b in %r]\nw=sum(i.size[0] for i in ims)+10*(len(ims)-1); h=max(i.size[1] for i in ims)\nc=Image.new('RGB',(w,h),'white'); x=0\nfor i in ims: c.paste(i,(x,0)); x+=i.size[0]+10\nc.save(%r)" % (parts, dst)
    subprocess.run(['python3.12', '-c', code], check=True); return dst
def P(cid, src, name, title, boxes=()): dst = PP + 'pics/%s-%s.png' % (cid, name); ann(src, dst, title, [], [], list(boxes)); return dst
tmp = '/tmp/claude-0/-home-user-Manual-test-Cases/126e0959-4bca-54ed-8b95-71a191ca38d1/scratchpad/'
R = {}
c1 = comp(tmp + 'c511-menus.png', [(PP + 'd2/03-ars-menu-customer.png', (470, 100, 860, 700)), (PP + 'd2/49-sbc-menu-customer.png', (720, 100, 1110, 700))])
R['C715511'] = {'verdict': 'Passed', 'observed': [
    'A/R Aging Summary and Sales By Customer side by side, 1440 px, light theme.',
    'Step 1: the chip reads "Customer: All customers" with the person icon, no fill and grey text - the same resting style as Sales By Customer\'s Customer chip (same class, colour and size).',
    'Step 2: the menu reads, in order: the search box ("Search customer"), "All customers" (ticked), the line "All customers are included. Pick one or more to narrow.", then the customers A to Z.',
    'Step 3: ticking "ZZAUTOTEST Northern Alberta Heavy Haul and Towing Ltd" - the chip reads "Customer: ZZAUTOTEST Nort..." (shortened with "...") in a blue pill: no longer resting.',
    'Step 4: the open menu matches Sales By Customer\'s: same rows and order, same tick boxes, same row spacing, same 352 px width, opening directly under its chip.'],
    'pictures': [P('C715511', c1, 'menus', 'Steps 1, 2 and 4: A/R Aging Summary (left) and Sales By Customer (right) - the same Customer chip and menu'),
                 P('C715511', PP + 'd2b/02-C715511-3-chip.png', 'chip', 'Step 3: one customer ticked - the chip shortens the name with "..." and turns blue', [(482, 116, 280, 36, 'good', 'Customer: ZZAUTOTEST Nort...')])]}
for cid, f3, fl, fp, rep in [('C715513', '03-C715513-3-chip.png', '04-C715513-4-location-menu.png', '05-C715513-4-pastdue-menu.png', 'A/R Aging Summary'), ('C715514', '06-C715514-3-chip.png', '07-C715514-4-location-menu.png', '08-C715514-4-pastdue-menu.png', 'A/P Aging Summary')]:
    k = 'ars' if cid == 'C715513' else 'aps'; m0 = PP + 'd2/%s' % ('04-ars-menu-pastdue.png' if k == 'ars' else '27-aps-menu-pastdue.png')
    c = comp(tmp + cid + '-menus.png', [(PP + 'd2b/' + fp, (660, 100, 1180, 430)), (PP + 'd2b/' + fl, (660, 100, 1180, 430))])
    R[cid] = {'verdict': 'Passed', 'observed': [
        '%s, 1440 px, light theme.' % rep,
        'Step 1: the chip reads "Past due: Any" with the hourglass icon, no fill and grey text - the resting style (the same style as the Customer/Vendor chip beside it).',
        'Step 2: the menu reads, in order: "Any", the line "All ranges are included. Pick one or more to narrow.", "1-30 days", "31-60 days", "61-90 days", "91+ days" - five tick boxes.',
        'Step 3: after ticking "91+ days" the chip reads "Past due: 91+ days" in a blue pill (no longer resting).',
        'Step 4: the Location menu opens. Side by side the two are the same kind of tick-box menu: the same square tick boxes, the same 40 px row spacing, a top row with the count at its right ("1 selected" / "3 selected") and a divider, and both open directly under their own chip (6 px below it).'],
        'pictures': [P(cid, m0, 'pastdue-menu', 'Steps 1 and 2: "Past due: Any" (resting) and its menu', [(700, 116, 170, 36, 'good', 'Past due: Any - resting')]),
                     P(cid, PP + 'd2b/' + f3, 'chip-91', 'Step 3: "Past due: 91+ days" - no longer resting'),
                     P(cid, c, 'side-by-side', 'Step 4: Past due menu (left) and Location menu (right) - the same tick-box menu')]}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, d2 + d2b chips'}, 'results': R}, open(PP + 'RESULTS-d2b.json', 'w'), indent=1); print(list(R))
