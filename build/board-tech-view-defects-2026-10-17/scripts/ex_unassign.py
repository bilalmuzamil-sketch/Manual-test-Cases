"""SV-11419 exhibits: Unassign in the More actions menu, its prompt and result, and the locked / no-lead menus."""
import sys, json
sys.path.insert(0, '/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16')
from PIL import Image, ImageDraw
from bexh import head, legend, row, col, page, box, RED, GRN, BLU
from qa_exhibits import fnt
R = '/home/user/Manual-test-Cases/build/board-tech-view-defects-2026-10-17/'; E = R + 'sv11419/ev/'; S = 2
D = json.load(open(E + 'x19.json')); OR = (230, 120, 0); f = fnt(30, True)
def lab(dr, xy, t, c, right=True):
    w = dr.textlength(t, font=f); x = xy[2] + 10 if right else xy[0]; y = (xy[1] + xy[3]) // 2 - 22 if right else xy[3] + 8
    dr.rectangle([x, y, x + w + 14, y + 44], fill='white', outline=c, width=2); dr.text((x + 7, y + 5), t, font=f, fill=c)
def pan(fn, marks, crop, title, sub, c=GRN):
    im = Image.open(E + fn).convert('RGB'); dr = ImageDraw.Draw(im)
    for r, col_, t in marks:
        xy = box(dr, r, col_, S=S, pad=4, w=5)
        if t: lab(dr, xy, t, col_)
    return head(im.crop(tuple(v * S for v in crop)), title, sub, c)
def around(sec):
    c = sec['card']; its = sec['items']; x0 = min([c['x']] + [i['x'] for i in its]) - 40; x1 = max([c['x'] + c['w']] + [i['x'] + i['w'] for i in its]) + 280
    y0 = min([c['y']] + [i['y'] for i in its]) - 60; y1 = max([c['y'] + c['h']] + [i['y'] + i['h'] for i in its]) + 40
    return (max(0, int(x0)), max(0, int(y0)), min(1440, int(x1)), min(900, int(y1)))
m = {i['tid']: i for i in D['menu']['items']}
p1 = pan('x19-1-menu.png', [(m['menu_item_reassign_lead_technician'], GRN, None), (m['menu_item_unassign_lead_technician'], OR, 'Unassign (red, x icon)')], around(D['menu']), '1. More actions menu on S2-35490 (lead Esther Howard)', 'Reassign lead technician + Unassign')
p2 = pan('x19-2-prompt.png', [(D['dlg'], OR, None)], (380, 230, 1060, 680), '2. Unassign shows the shift-clearing prompt', 'Same prompt as changing the lead: Cancel, Keep Shifts, Clear Shifts')
p3 = pan('x19-3-toast.png', [(D['toast'], OR, None)], (700, 600, 1440, 900), '3. Keep Shifts: "Lead technician removed"', 'The toast after the lead is removed')
p4 = pan('x19-4-after.png', [(D['unCol'], GRN, None)], (0, 160, 700, 620), '4. S2-35490 now sits in Unassigned', 'Lead removed; it shows in the Unassigned column')
pm = {i['tid']: i for i in D['paid']['items']}
p5 = pan('x19-5-paid.png', [(pm['menu_item_unassign_lead_technician'], (105, 117, 134), 'greyed out')], around(D['paid']), '5. Paid work order S2-15322: locked', 'Both items greyed out (lead cannot change when Invoiced or Paid)', BLU)
nm = D['nolead']['items'][0]
p6 = pan('x19-6-nolead.png', [(nm, GRN, 'only Reassign')], around(D['nolead']), '6. S2-17495 has no lead', 'No Unassign item, only Reassign lead technician', BLU)
before = head(Image.open(R + 'ticket-images/SV-11419-C368152-2-menu-has-no-unassign.png').convert('RGB'), 'BEFORE: the picture in this ticket (staging, 16 October)', 'The menu had only "Reassign lead technician"', RED)
body = legend(col([before, row([p1, p2]), row([p3, p4]), row([p5, p6])]), ['Board View, staging. Green and orange boxes mark the items and messages described in each heading. After the check the lead (Esther Howard) was put back on S2-35490 and her shift was kept.'], (40, 40, 40))
page('SV-11419: Unassign is now in the More actions menu', body,
     [f'Staging build {D["mk"]["version"]}, 17 October 2026, window 1440 x 900 px, zoom 100%. Board View is not on production yet, so the "before" is the ticket\'s own picture. Tech View has the same menu and the same result (shown in the recording).']).save(E + 'sv11419-01-unassign.png')
print(Image.open(E + 'sv11419-01-unassign.png').size)
