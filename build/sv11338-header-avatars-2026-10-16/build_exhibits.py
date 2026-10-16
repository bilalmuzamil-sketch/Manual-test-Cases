"""SV-11338 exhibit: header avatar of a technician without a photo — ticket picture vs staging now (Tech + Board, light + dark)."""
import json, sys
from PIL import Image, ImageDraw
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import fnt, wrap, RED, GRN, BLU, BLK, GREY
R = json.load(open('data/a7.json')); S = 2
hexc = lambda s: '#%02X%02X%02X' % tuple(int(x) for x in s[s.index('(') + 1:s.index(')')].split(',')[:3])
def head(im, title, sub, c):
    f1, f2 = fnt(24, True), fnt(19)
    out = Image.new('RGB', (im.width, im.height + 82), 'white'); d = ImageDraw.Draw(out)
    d.rectangle([0, 0, im.width - 1, 76], fill=c); d.text((14, 8), title, font=f1, fill='white'); d.text((14, 44), sub, font=f2, fill='white')
    out.paste(im, (0, 82)); d.rectangle([0, 0, out.width - 1, out.height - 1], outline=(190, 196, 204), width=2); return out
def panel(key, png, title, c):
    m = R[key]; a, n = m['a'], m['n']; im = Image.open(png).convert('RGB'); d = ImageDraw.Draw(im)
    d.ellipse([a['x'] * S - 7, a['y'] * S - 7, (a['x'] + a['w']) * S + 7, (a['y'] + a['h']) * S + 7], outline=c, width=4)
    x0 = int((a['x'] - 60) * S); y0 = int((a['y'] - 22) * S); x1 = int((n['x'] + n['w'] + 70) * S); y1 = int((a['y'] + a['h'] + 22) * S)
    im = im.crop((x0, y0, x1, y1))
    lab = Image.new('RGB', (im.width, 118), 'white'); dl = ImageDraw.Draw(lab); f = fnt(21, True)
    dl.text((14, 10), f"Circle {hexc(a['bg'])} · initials {hexc(a['fg'])}", font=f, fill=c)
    dl.text((14, 44), f"Name {n['fs']}, weight {n['fw']}, {hexc(n['col'])}", font=f, fill=c)
    dl.text((14, 78), f"Avatar {round(a['w'])} px", font=fnt(20), fill=GREY)
    full = Image.new('RGB', (im.width, im.height + lab.height), 'white'); full.paste(im, (0, 0)); full.paste(lab, (0, im.height))
    return head(full, title, f"{R['mk']['version']} · 16 Oct 2026", c)
b = Image.open('ev/raw-ticket-before.png').convert('RGB').crop((20, 58, 520, 255)); b = b.resize((b.width * 2, b.height * 2), Image.LANCZOS)
before = head(b, 'BEFORE: ticket picture (Tech View)', 'Staging v26.40.17 · 14 Oct 2026: solid blue circle, white initials', RED)
P = [panel('tech_light', 'ev/a7-tech-light.png', 'AFTER: Tech View, light', GRN), panel('board_light', 'ev/a7-board-light.png', 'AFTER: Board View, light', GRN),
     panel('tech_dark', 'ev/a7-tech-dark.png', 'Tech View, dark theme', BLU), panel('board_dark', 'ev/a7-board-dark.png', 'Board View, dark theme', BLU)]
gap = 22; cw = max(p.width for p in P)
grid = Image.new('RGB', (cw * 2 + gap, P[0].height + P[2].height + gap), 'white')
grid.paste(P[0], (0, 0)); grid.paste(P[1], (cw + gap, 0)); grid.paste(P[2], (0, P[0].height + gap)); grid.paste(P[3], (cw + gap, P[0].height + gap))
W = max(before.width, grid.width) + 2 * gap
f1, f3 = fnt(32, True), fnt(25)
notes = ['Same technician (Brandi Smith, no photo) in the header of both views. Window 1600 x 1000 px, browser zoom 100%.',
         'Spec v62, S2-R23: "a technician avatar without a photo is a light-grey circle (--sv-grey-100, #EEF2F6) with initials in --sv-grey-600 (#4B5565) in light mode ... dark mode uses the design\'s dark colors; group and column header names are 14px, weight 600, in the design\'s slate text color (#364152)".']
d0 = ImageDraw.Draw(Image.new('RGB', (9, 9))); dl = []
for n in notes: dl += wrap(d0, n, f3, W - 2 * gap) + ['']
out = Image.new('RGB', (W, 80 + before.height + gap + grid.height + 20 + 34 * len(dl)), 'white'); d = ImageDraw.Draw(out)
d.text((gap, 22), 'Header avatar, technician with no photo', font=f1, fill=BLK)
out.paste(before, (gap, 80)); out.paste(grid, (gap, 80 + before.height + gap))
y = 80 + before.height + gap + grid.height + 16
for ln in dl: d.text((gap, y), ln, font=f3, fill=BLK); y += 34
out.save('ev/sv11338-01-header-avatar-ticket-vs-staging.png'); print(out.size, before.size, grid.size)
