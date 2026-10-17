"""SV-11407 exhibits: Back restores the top row/card fully shown (Tech View, Board View)."""
import json, sys
sys.path.insert(0, '/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16')
from PIL import Image, ImageDraw
from bexh import head, box, badge, legend, row, col, page, RED, GRN, BLU, fnt
E = '/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16/sv11407/'
S = 2

def tv(state):
    d0 = json.load(open(E + 'data/tv2x.json')); c = d0[state]['cols'][0]
    im = Image.open(E + f'ev/tv2x-{state}.png').convert('RGB'); d = ImageDraw.Draw(im)
    f = c['first']; vt = c['viewTop']
    box(d, {'x': 2, 'y': f['t'], 'w': 896, 'h': f['b'] - f['t']}, RED if state == 'before' else GRN, w=5)
    d.line([(0, vt * S), (900 * S, vt * S)], fill=BLU, width=3)
    im = im.crop((0, 120 * S, 900 * S, 420 * S))
    t = f"{'Before opening' if state=='before' else 'After Back'}: {f['num']}"
    sub = (f"Half of it is under the held Unassigned header ({vt - f['t']} px hidden)" if state == 'before'
           else f"Back at the top, fully shown, right under the held header")
    return head(im, t, sub, RED if state == 'before' else GRN)

def bv(state):
    g = json.load(open(E + 'data/bv-detail.json'))[state]
    im = Image.open(E + f'ev/bv-{state}.png').convert('RGB'); d = ImageDraw.Draw(im)
    for i, c in enumerate(g):
        cd = c['card']; top = c['body']['y']
        clr = RED if state == 'before' else (BLU if i == 0 else GRN)
        y0 = max(cd['y'], top) if state == 'before' else cd['y']
        box(d, {'x': cd['x'], 'y': y0, 'w': cd['w'], 'h': cd['y'] + cd['h'] - y0}, clr, w=5, pad=2)
        d.line([(c['body']['x'] * S, top * S), ((c['body']['x'] + c['body']['w']) * S, top * S)], fill=BLU, width=3)
    im = im.crop((0, 100 * S, 930 * S, 440 * S))
    if state == 'before':
        return head(im, 'Before opening: the top card in each column is cut', ', '.join(f"{c['card']['num']} {round(c['body']['y']-c['card']['y'])} px hidden" for c in g), RED)
    return head(im, 'After Back: the same cards are back at the top', ', '.join(f"{c['card']['num']} top at {round(c['card']['y']-c['body']['y'],1):+} px" for c in g), GRN)

def zoom():
    g = json.load(open(E + 'data/bv-detail.json'))['after']
    im = Image.open(E + 'ev/bv-after.png').convert('RGB')
    def z(x0):
        return im.crop((x0 * S, 200 * S, (x0 + 160) * S, 216 * S)).resize((160 * S * 4, 16 * S * 4), Image.NEAREST)
    a = z(14); b = z(318)
    pa = head(a, 'Close-up, Unassigned column (8x)', 'Column top line, then no card border: the card\'s top edge is hidden', BLU)
    pb = head(b, 'Close-up, ZZAUTOTEST Ana Alpha column (8x)', 'Column top line, a gap, then the card\'s top border', GRN)
    return row([pa, pb])

t = legend(row([tv('before'), tv('after')]), ['Blue line: the bottom of the held group header, where the visible list starts. Red: the row cut at the top before opening a work order. Green: the same row after Back.'], (40, 40, 40))
out = page('SV-11407: Back brings the top row back fully shown (Tech View)', t,
           ['Staging build v26.40.19-754919e, 17 October 2026, window 1440 x 900 px, zoom 100%, Tech user, all groups open. I clicked the visible part of S2-32993\'s number, then pressed the browser Back button.'])
out.save(E + 'ev/sv11407-01-tech-view-back.png'); print(out.size)
b = legend(col([bv('before'), bv('after'), zoom()]), ['Blue lines: the top of each column\'s list. Red: cards cut at the top before opening a work order. After Back: green = back at the top with a 2 px gap; blue = Unassigned, back at the top but 2 px above the column edge, so its top border line is hidden.'], (40, 40, 40))
out = page('SV-11407: Back on Board View (3 columns scrolled separately)', b,
           ['Staging build v26.40.19-754919e, 17 October 2026, window 1440 x 900 px, zoom 100%, Tech user. I opened a card lower in the Unassigned column, then pressed the browser Back button.'])
out.save(E + 'ev/sv11407-02-board-view-back.png'); print(out.size)
