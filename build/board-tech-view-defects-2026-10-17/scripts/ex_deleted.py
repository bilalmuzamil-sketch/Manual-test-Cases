"""SV-11416 exhibit: Deleted technician column/group on staging; List cell compared with production today."""
import sys, json
sys.path.insert(0, '/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16')
from PIL import Image, ImageDraw
from bexh import head, legend, row, col, page, box, RED, GRN, BLU
from qa_exhibits import fnt
R = '/home/user/Manual-test-Cases/build/board-tech-view-defects-2026-10-17/'; E = R + 'sv11416/ev/'; S = 2
X = json.load(open(E + 'x16.json')); P = json.load(open(E + 'p16l.json')); OR = (230, 120, 0); f = fnt(30, True)
def lab(dr, xy, t, c, below=False):
    w = dr.textlength(t, font=f); x = xy[0] if below else xy[2] + 10; y = xy[3] + 8 if below else (xy[1] + xy[3]) // 2 - 22
    dr.rectangle([x, y, x + w + 14, y + 44], fill='white', outline=c, width=2); dr.text((x + 7, y + 5), t, font=f, fill=c)
def pan(fn, marks, crop, title, sub, c):
    im = Image.open(E + fn).convert('RGB'); dr = ImageDraw.Draw(im)
    for r, cc, t, below in marks:
        xy = box(dr, r, cc, S=S, pad=4, w=5)
        if t: lab(dr, xy, t, cc, below)
    return head(im.crop(tuple(int(v * S) for v in crop)), title, sub, c)
b = X['board']; t = X['tech']; L = X['list']
p_board = pan('x16-board.png', [(b['panel'], GRN, None, False), (b['badge'], OR, 'Inactive', True), (b['normalGrip'], BLU, 'normal column: grip', True)], (180, 180, 1440, 470), 'AFTER (staging): Board View column "Deleted technician"', 'Inactive marker, no drag grip (other columns have one)', GRN)
p_tech = pan('x16-tech.png', [({**t['group'], 'w': 900}, GRN, None, False), (t['badge'], OR, 'Inactive', False), (t['normalGrip'], BLU, 'grip', False)], (0, 700, 1000, 900), 'AFTER (staging): Tech View group "Deleted technician"', 'Inactive marker, no drag grip', GRN)
cellP = {k: P[k] for k in ('x', 'y', 'w', 'h')}
p_pb = pan('p16-list-before.png', [(cellP, BLU, None, False)], (600, 150, 1440, 260), 'Production today: List before the lead was deleted', 'Lead Technician: "ZZAUTOTEST Deleted Lead 11006"', BLU)
p_pa = pan('p16l-list.png', [(cellP, BLU, None, False)], (600, 150, 1440, 260), 'Production today: List after the lead was deleted', 'Lead Technician: "Unassigned"', BLU)
p_sl = pan('x16-list.png', [({k: L[k] for k in ('x', 'y', 'w', 'h')}, GRN, None, False)], (760, 190, 1440, 300), 'AFTER (staging): List, S2-36641 (lead deleted)', 'Lead Technician: "Unassigned", the same as production', GRN)
before = head(Image.open(R + 'ticket-images/SV-11416-SV_unknown_technician.png').convert('RGB'), 'BEFORE: the picture in this ticket (staging, 16 October)', '"Unknown Technician" column, generic icon, no inactive marker', RED)
body = legend(col([row([before, col([p_pb, p_pa])]), row([p_board, p_tech]), p_sl]), ['Staging: S2-35709 and S2-36641 were given a ZZAUTOTEST technician as lead, then that technician was deleted in Settings -> Staff. Production: work order S2-968 in the production test company, same steps. Green: what the staging build shows. Orange: the Inactive marker. Blue: a normal column/group grip for comparison, and the production List cell.'], (40, 40, 40))
page('SV-11416: work orders of a deleted lead sit under "Deleted technician"', body,
     [f'Staging build {X["mk"]["version"]} and Production v26.40.19-d2441a9, 17 October 2026, window 1440 x 900 px, zoom 100%. Board View and Tech View are not on production yet; the production pictures show the List, which the spec says stays as today.']).save(E + 'sv11416-01-deleted-technician.png')
print(Image.open(E + 'sv11416-01-deleted-technician.png').size)
