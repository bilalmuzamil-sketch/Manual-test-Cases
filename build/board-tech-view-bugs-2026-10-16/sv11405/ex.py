"""SV-11405 (and SV-11318) exhibits: Board card pill vs List, and the Paid pill width in List / Tech View / Board View."""
import sys, json
sys.path.insert(0, '/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16')
from PIL import Image, ImageDraw
from bexh import head, legend, row, col, page, box, RED, GRN, BLU
from qa_exhibits import fnt
E = '/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16/sv11405/ev/'; S = 2; OR = (230, 120, 0); f = fnt(28, True)
X = json.load(open(E + 'x05c.json')); P = json.load(open(E + 'x05c-prod.json'))
def lab(d, xy, t, c, below=True):
    w = d.textlength(t, font=f); x = xy[0]; y = xy[3] + 8 if below else xy[1] - 50
    d.rectangle([x, y, x + w + 14, y + 42], fill='white', outline=c, width=2); d.text((x + 7, y + 4), t, font=f, fill=c)
def pan(fn, marks, crop, title, sub, c):
    im = Image.open(E + fn).convert('RGB'); d = ImageDraw.Draw(im)
    for r, cc, t, below in marks:
        xy = box(d, r, cc, S=S, pad=4, w=5)
        if t: lab(d, xy, t, cc, below)
    return head(im.crop(tuple(int(v * S) for v in crop)), title, sub, c)
cp, lp = X['card'], X['list']
a = pan('x05c-card.png', [(cp['pill'], GRN, f"pill {cp['pill']['w']:.0f} x {cp['pill']['h']:.0f} px", True), (cp['counts'][0], RED, None, True), (cp['counts'][1], BLU, None, True), (X['cardTip'], OR, None, True)], (cp['card']['x'] - 20, X['cardTip']['y'] - 20, cp['card']['x'] + cp['card']['w'] + 120, cp['card']['y'] + 150), 'Board View card, S2-34941', f"Ready For Review pill with red 1 and blue 2; hover: \"{X['cardTip']['t']}\"", GRN)
b = pan('x05c-list.png', [(lp['pill'], GRN, f"pill {lp['pill']['w']:.0f} px wide", True), (lp['counts'][0], RED, None, True), (lp['counts'][1], BLU, None, True), (X['listTip'], OR, None, True)], (60, X['listTip']['y'] - 20, 700, lp['pill']['y'] + 110), 'List, the same work order', f"Same pill, same counts, same hover text: \"{X['listTip']['t']}\"", GRN)
page('SV-11405: the Board View card shows the List\'s status pill with its counts', legend(row([a, b]), ['Green: the pill (same label, colours and 114 px width as List; 22 px tall on the card). Red and blue: the service-actions and parts-actions counts. Orange: the hover text, identical in both places. The same held for Estimate, Approved, In Progress, Complete, Invoiced and Declined.'], (40, 40, 40)),
     [f'Staging build {X["mk"]["version"]}, 17 October 2026, window 1440 x 900 px, zoom 100%. Board View is not on production yet, so there is no production "before".']).save(E + 'sv11405-01-card-pill.png')
def paid(fn, r, title, c, crop=None):
    cc = GRN if c == 'g' else RED
    crop = crop or (r['x'] - 80, r['y'] - 40, r['x'] + 360, r['y'] + 80)
    return pan(fn, [(r, cc, f"Paid {r['w']:.1f} px", True)], crop, title, '', GRN if c == 'g' else RED)
p0 = paid('x05c-paid-prod-list.png', P, 'Production List (today)', 'g')
p1 = paid('x05c-paid-list.png', X['paid-list'], 'Staging List', 'g')
p2 = paid('x05c-paid-tech_view.png', X['paid-tech_view'], 'Staging Tech View', 'r')
p3 = paid('x05c-paid-board_view.png', X['paid-board_view'], 'Staging Board View card', 'r')
page('Paid pill: 58.5 px in the List, 44.5 px in Tech View and on Board View cards', legend(col([row([p0, p1]), row([p2, p3])]), ['Status filter set to Paid (every work order on the page is Paid). Green: List, the same on Production and Staging (58.5 px). Red: Tech View and the Board View card draw the Paid pill narrower (44.5 px). Every other status measured the same in all three views (for example Invoiced 64.2 px, Ready For Review 114 px).'], (40, 40, 40)),
     [f'Staging build {X["mk"]["version"]} and Production v26.40.19-d2441a9, 17 October 2026, window 1440 x 900 px, zoom 100%.']).save(E + 'sv11405-02-paid-width.png')
for n in ['sv11405-01-card-pill', 'sv11405-02-paid-width']: print(n, Image.open(E + n + '.png').size)
