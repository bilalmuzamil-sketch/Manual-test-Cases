"""SV-11421 exhibits: browser Back restores tab, filters and position on Board View and Tech View."""
import sys, json
sys.path.insert(0, '/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16')
from PIL import Image, ImageDraw
from bexh import head, legend, row, col, page, RED, GRN, BLU
from qa_exhibits import fnt
R = '/home/user/Manual-test-Cases/build/board-tech-view-defects-2026-10-17/'; E = R + 'sv11421/ev/'; S = 2
f = fnt(44, True)
def mark(im, rects):
    d = ImageDraw.Draw(im)
    for (x0, y0, x1, y1, c, t) in rects:
        d.rectangle([x0 * S, y0 * S, x1 * S, y1 * S], outline=c, width=6)
        if t:
            w = d.textlength(t, font=f); ty = y1 * S + 8 if y1 < 820 else y0 * S - 60
            d.rectangle([x0 * S, ty, x0 * S + w + 14, ty + 56], fill='white', outline=c, width=2); d.text((x0 * S + 7, ty + 4), t, font=f, fill=c)
    return im
B = json.load(open(E + 'bk-board.json')); T = json.load(open(E + 'bk-tech.json'))
TAB = (34, 78, 78, 108)
def bpanel(fn, data, title, sub):
    th = data['theresa']; c0 = th['cards'][0]
    im = mark(Image.open(E + fn).convert('RGB'), [(*TAB, GRN, None), (1108, 200, 1404, 880, GRN, None), (1114, max(c0['t'], th['bodyTop']), 1398, c0['b'], (230, 120, 0), f"top card {c0['n']}")])
    return head(im, title, sub, GRN)
ta = Image.open(R + 'ticket-images/SV-11421-C96916-1-board-before-open.png').convert('RGB'); tb = Image.open(R + 'ticket-images/SV-11421-C96916-2-board-after-back.png').convert('RGB')
p0 = row([head(ta, 'BEFORE (ticket picture): before opening a card', 'Board scrolled right to Theresa Webb', RED), head(tb, 'BEFORE (ticket picture): after Back', 'Board back at the far left, tab changed to Work Orders', RED)])
p1 = row([bpanel('bk-board-before.png', B['before'], 'AFTER (staging): before opening S2-36404', f"Tab All, board scrolled {B['before']['scrollLeft']} px right"),
          bpanel('bk-board-after.png', B['after'], 'AFTER (staging): after browser Back', f"Tab All, board at {B['after']['scrollLeft']} px (exact), {B['after']['theresa']['cards'][0]['n']} at the top, fully shown")])
body = legend(col([p0, p1]), ['Search "ZZAUTOTEST F1 Scroll Back Theresa". Green: the tab and Theresa Webb\'s column. Orange: the card at the top of her column. Before opening S2-36404 the top card S2-36403 was partly hidden under the column header; after Back it is at the top and fully shown, as the spec allows (up to one card from the exact pixel position). The same result with the Status: Approved filter on: the filter came back too.'], (40, 40, 40))
page('SV-11421: Back returns Board View to the same tab, filters and position', body,
     [f'Staging build v26.40.19-754919e, 17 October 2026, window 1440 x 900 px, zoom 100%. Board View is not on production yet, so the "before" is the ticket\'s own pictures.']).save(E + 'sv11421-01-board-back.png')
def tpanel(fn, data, title, sub, top):
    im = mark(Image.open(E + fn).convert('RGB'), [(*TAB, GRN, None), (2, top[0], 1436, top[1], (230, 120, 0), f"top row {data['topRow']['n'] if fn.endswith('after.png') else 'S2-33679 (mostly hidden)'}")])
    return head(im, title, sub, GRN)
p2 = row([tpanel('bk-tech-before.png', T['before'], 'Tech View: before opening S2-32988', f"Tab All, {T['before']['held']}, scrolled down", (240, 276)),
          tpanel('bk-tech-after.png', T['after'], 'Tech View: after browser Back', f"Tab All, same sideways position ({T['after']['scrollLeft']} px), S2-33679 at the top, fully shown", (264, 300))])
body = legend(p2, ['Search "4 Star". Before opening S2-32988 the top row S2-33679 was mostly hidden under the Unassigned header (a sliver showed) and S2-32993 was the first full row; after Back S2-33679 is at the top, fully shown, with S2-32993 right below it (24 px from the exact position, less than one row). Sideways position 120 px, back exactly. With the Status: Approved filter on, the tab, the filter and the position came back the same way.'], (40, 40, 40))
page('SV-11421: Back returns Tech View to the same tab, filters and position', body,
     ['Staging build v26.40.19-754919e, 17 October 2026, window 1440 x 900 px, zoom 100%.']).save(E + 'sv11421-02-tech-back.png')
for n in ['sv11421-01-board-back', 'sv11421-02-tech-back']: print(n, Image.open(E + n + '.png').size)
