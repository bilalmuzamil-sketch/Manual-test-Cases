"""SV-11395 exhibit: name bubble opens above the avatar (technician and +N) in Tech View and Board View."""
import sys, json
sys.path.insert(0, '/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16')
from PIL import Image, ImageDraw
from bexh import head, legend, row, col, page, box, RED, GRN, BLU
from qa_exhibits import fnt
R = '/home/user/Manual-test-Cases/build/board-tech-view-defects-2026-10-17/'; E = R + 'sv11395/ev/'; S = 2
D = json.load(open(E + 'x95.json'))
def panel(k, title):
    d = D[k]; im = Image.open(E + f'x95-{k}.png').convert('RGB'); dr = ImageDraw.Draw(im)
    a = box(dr, d['el'], GRN, S=S, pad=4, w=4); t = box(dr, d['tip'], (230, 120, 0), S=S, pad=4, w=4)
    f = fnt(22, True); dr.text((a[2] + 10, a[3] - 4), 'avatar', font=f, fill=GRN); dr.text((t[2] + 10, t[1] + 6), 'name bubble (above)', font=f, fill=(230, 120, 0))
    x0 = min(a[0], t[0]) - 120; x1 = max(a[2], t[2]) + 300; y0 = t[1] - 70; y1 = a[3] + 70
    gap = round(d['el']['y'] - (d['tip']['y'] + d['tip']['h']))
    return head(im.crop((max(0, x0), y0, x1, y1)), title, f'Bubble "{d["tip"]["text"][:44]}" ends {gap} px above the avatar', BLU)
p = [panel('tech-avatar', 'AFTER: Tech View, technician avatar'), panel('tech-plusN', 'AFTER: Tech View, "+4"'),
     panel('board-avatar', 'AFTER: Board View, card avatar'), panel('board-plusN', 'AFTER: Board View, card "+4"')]
W = max(x.width for x in p)
p = [x if x.width == W else (lambda c: (c.paste(x, (0, 0)), c)[1])(Image.new('RGB', (W, x.height), 'white')) for x in p]
b0 = Image.open(R + 'ticket-images/SV-11395-D-DESIGN-13-name-bubble-below.png').convert('RGB'); b0 = b0.resize((b0.width * 2, b0.height * 2), Image.LANCZOS)
before = head(b0, 'BEFORE: the picture in this ticket (staging, 15 October)', 'The name bubble opened below the avatar', RED)
body = legend(col([before, row(p[:2]), row(p[2:])]), ['Work order S2-16688 (M&J Truck Repair LLC). Green box: the avatar the pointer rests on. Orange box: the name bubble. In all four cases the bubble ends 6 px above the avatar. The header avatars (group and column headers) keep the plain browser name tip, as agreed in this ticket.'], (40, 40, 40))
page('SV-11395: the avatar name bubble opens above the avatar', body,
     [f'Staging build {D["mk"]["version"]}, 17 October 2026, window 1440 x 900 px, zoom 100%, pointer moved onto each avatar with the mouse. Tech View is not on production yet, so the "before" is the ticket\'s own picture.']).save(E + 'sv11395-01-bubble-above.png')
print(Image.open(E + 'sv11395-01-bubble-above.png').size)
