"""SV-11407 exhibits (re-check 17 Oct): Tech View + Board View Back, and the Unassigned 2 px cut."""
import sys, json
sys.path.insert(0, '/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16')
from PIL import Image, ImageDraw
from bexh import head, legend, row, col, page, RED, GRN, BLU
from qa_exhibits import fnt
E = '/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16/sv11407/ev2/'; S = 2; OR = (230, 120, 0); f = fnt(28, True)
def lab(d, x, y, t, c):
    w = d.textlength(t, font=f); d.rectangle([x, y, x + w + 14, y + 42], fill='white', outline=c, width=2); d.text((x + 7, y + 4), t, font=f, fill=c)
def mark(fn, rects, crop):
    im = Image.open(E + fn).convert('RGB'); d = ImageDraw.Draw(im)
    for (x0, y0, x1, y1, c, t, lx, ly) in rects:
        d.rectangle([x0 * S, y0 * S, x1 * S, y1 * S], outline=c, width=5)
        if t: lab(d, lx * S, ly * S, t, c)
    return im.crop(tuple(v * S for v in crop))
T = json.load(open(E + 'tv-re.json')); Bd = json.load(open(E + 'bvt-0.5-0.json'))
tb, ta = T['before']['cols'][0], T['after']['cols'][0]
t1 = head(mark('tv-re-before.png', [(2, tb['first']['t'], 1436, tb['first']['b'], OR, f"top row {tb['first']['num']}: half hidden", 1000, tb['first']['b'] + 2)], (0, 120, 1440, 420)), 'Tech View, before opening S2-33522', 'Top row S2-32993 half hidden under the "Unassigned" header', BLU)
t2 = head(mark('tv-re-after.png', [(2, ta['first']['t'], 1436, ta['first']['b'], GRN, f"{ta['first']['num']}: fully shown", 1000, ta['first']['b'] + 2)], (0, 120, 1440, 420)), 'Tech View, after browser Back', 'Same row, fully shown, below the held header (not under it)', GRN)
def bpanel(fn, data, title, sub, c, before=False):
    rects = []
    for k in data['cols'][:3]:
        fi = k['first']; ok = fi['t'] >= k['viewTop'] - 1
        rects.append((k['x'] + 4, max(fi['t'], k['viewTop'] - 30), k['x'] + 282, fi['b'], OR if before else (GRN if ok else RED), None, 0, 0))
    return head(mark(fn, rects, (0, 150, 930, 560)), title, sub, c)
b1 = bpanel('bvt-0.5-0-before.png', Bd['before'], 'Board View, before opening a card', 'Orange: each column\'s top card, half hidden', BLU, before=True)
b2 = bpanel('bvt-0.5-0-after.png', Bd['after'], 'Board View, after browser Back', 'Unassigned (red): top card 2 px under the column edge; the other columns (green): fully shown', RED)
body = legend(col([row([t1, t2]), row([b1, b2])]), ['Staging, signed in as the Tech user (DEV "Tech" quick login), window 1440 x 900, zoom 100%. Tech View: search none, top row S2-32993. Board View: Unassigned top card S2-33104, Ana Alpha S2-35559, Ben Bravo S2-35561. Green = comes back fully shown. Red = comes back 2 px cut.'], (40, 40, 40))
page('SV-11407: after Back, the top row or card comes back fully shown (except Board View\'s Unassigned column)', body,
     ['Staging build v26.40.19-754919e, 17 October 2026. There is no "before" picture: this was never on production, and the ticket has no screenshot.']).save(E + 'sv11407-01-back-top-item.png')
# close-up of the cut vs a neighbouring column
im = Image.open(E + 'bvt-0.5-0-after.png').convert('RGB')
a = Bd['after']['cols']; u, z = a[0], a[1]
def zoomc(k, title, sub, c):
    z0 = im.crop(((k['x'] + 40) * S, (k['viewTop'] - 14) * S, (k['x'] + 200) * S, (k['viewTop'] + 26) * S)).resize((160 * S * 3, 40 * S * 3), Image.NEAREST)
    d = ImageDraw.Draw(z0); y = 14 * S * 3; d.line([0, y, z0.width, y], fill=OR, width=3); lab(d, 10, 10, 'column top edge', OR)
    return head(z0, title, sub, c)
z1 = zoomc(u, f"Unassigned ({u['first']['num']}): no card border below the edge", f"Card top {u['first']['t']} px, column top {u['viewTop']} px: 2 px of the card are under the edge", RED)
z2 = zoomc(z, f"Next column ({z['first']['num']}): card border visible", f"Card top {z['first']['t']} px, column top {z['viewTop']} px: 2 px gap, border shown", GRN)
page('SV-11407 remaining issue: the Unassigned column\'s top card comes back 2 px cut', legend(row([z1, z2]), ['Close-up at 6x of the same screenshot after browser Back (orange line = top edge of each column). Repeated 9 of 9 times as the Tech user (all three densities, scroll depths 0.25 / 0.5 / 0.75, and with the board scrolled sideways); never in the other columns.'], (40, 40, 40)),
     ['Staging build v26.40.19-754919e, 17 October 2026, Tech user, window 1440 x 900, zoom 100%.']).save(E + 'sv11407-02-unassigned-cut.png')
for n in ['sv11407-01-back-top-item', 'sv11407-02-unassigned-cut']: print(n, Image.open(E + n + '.png').size)
