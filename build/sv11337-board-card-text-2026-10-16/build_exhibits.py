"""SV-11337 exhibit: Board View card text, ticket picture vs staging now at each density (annotated)."""
import json, sys
from PIL import Image, ImageDraw
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import fnt, wrap, RED, GRN, BLU, BLK, GREY
R = json.load(open('data/b4.json')); S = 2
LAB = {'board_card_number': 'Number', 'board_card_field_company_name': 'Customer', 'board_card_unit': 'Unit · asset', 'board_card_field_total_price': 'Total price'}
def head(im, title, sub, c):
    f1, f2 = fnt(26, True), fnt(20)
    out = Image.new('RGB', (im.width, im.height + 92), 'white'); d = ImageDraw.Draw(out)
    d.rectangle([0, 0, im.width - 1, 84], fill=c); d.text((14, 10), title, font=f1, fill='white'); d.text((14, 50), sub, font=f2, fill='white')
    out.paste(im, (0, 92)); d.rectangle([0, 0, out.width - 1, out.height - 1], outline=(190, 196, 204), width=2); return out
def after(dn):
    m = R['dens'][dn]; c = m['card']; im = Image.open(f'ev/b4-{dn}.png').convert('RGB'); d = ImageDraw.Draw(im); fb = fnt(18, True)
    pad = 14; box = (int((c['x'] - pad) * S), int((c['y'] - pad) * S), int((c['x'] + c['w'] + pad) * S), int((c['y'] + c['h'] + pad) * S))
    legend = []
    for n, (k, v) in enumerate(m['f'].items(), 1):
        x0, y0, x1, y1 = v['x'] * S - 4, v['y'] * S - 3, (v['x'] + v['w']) * S + 4, (v['y'] + v['h']) * S + 3
        d.rectangle([x0, y0, x1, y1], outline=GRN, width=3)
        cx, cy = x1 + 16, y0 - 2
        d.ellipse([cx - 14, cy - 14, cx + 14, cy + 14], fill=GRN); d.text((cx, cy), str(n), font=fb, fill='white', anchor='mm')
        legend.append(f"{n}  {LAB[k]}: {v['fs']}, weight {v['fw']}")
    im = im.crop(box); L = Image.new('RGB', (440, im.height), 'white'); dl = ImageDraw.Draw(L); fl = fnt(22, True)
    for n, t in enumerate(legend): dl.text((20, 30 + n * 52), t, font=fl, fill=GRN)
    dl.text((20, 30 + 4 * 52), f"Card height {round(c['h'])} px", font=fnt(21), fill=GREY)
    full = Image.new('RGB', (im.width + L.width, im.height), 'white'); full.paste(im, (0, 0)); full.paste(L, (im.width, 0))
    return head(full, f'AFTER: staging, {dn}', f"{R['mk']['version']} · 16 Oct · same card S2-16614", GRN)
b = Image.open('ev/raw-ticket-before-14oct.png').convert('RGB').crop((292, 207, 567, 433)); b = b.resize((b.width * 2, b.height * 2), Image.LANCZOS)
d = ImageDraw.Draw(b); fb = fnt(19, True)
note = Image.new('RGB', (b.width, 150), 'white'); dn_ = ImageDraw.Draw(note)
for i, t in enumerate(['Reported 14 Oct (staging v26.40.17):', 'Number 14px/500 · Customer 14px/500', 'Unit · asset 12px/500 · Total 14px/500', 'Ticket asked: 15-16px, weight 600 (design)']):
    dn_.text((14, 10 + i * 34), t, font=fb if i == 0 else fnt(19), fill=BLK if i < 3 else RED)
bb = Image.new('RGB', (b.width, b.height + note.height), 'white'); bb.paste(b, (0, 0)); bb.paste(note, (0, b.height))
before = head(bb, 'BEFORE: ticket picture', 'Staging v26.40.17 · 14 Oct 2026', RED)
afters = [after(x) for x in ['Compact', 'Regular', 'Comfortable']]
gap = 22; AW = max(p.width for p in afters); AH = sum(p.height for p in afters) + gap * 2
col = Image.new('RGB', (AW, AH), 'white'); yy = 0
for p in afters: col.paste(p, (0, yy)); yy += p.height + gap
panels = [before, col]
H = max(p.height for p in panels); W = sum(p.width for p in panels) + gap * 3
f1, f3 = fnt(32, True), fnt(25)
notes = ['Board View card text is now set by the spec, not by the design estimate in this ticket. Spec "Work Orders — Board View & Tech View Display Options", version 62:',
         'S6-R4: "Row and card text is 14px at every density; Compact never shrinks it. Text the design sets at 12px at every density, such as ... secondary lines, stays 12px."',
         'S2-R23: "Board card customer and total price are weight 500."',
         'Staging matches both at Compact, Regular and Comfortable. Window 1600 x 1000 px, browser zoom 100%.']
d0 = ImageDraw.Draw(Image.new('RGB', (9, 9))); dl = []
for n in notes: dl += wrap(d0, n, f3, W - 2 * gap) + ['']
out = Image.new('RGB', (W, 80 + H + 20 + 34 * len(dl)), 'white'); d = ImageDraw.Draw(out)
d.text((gap, 22), 'Board View card text at every density', font=f1, fill=BLK)
x = gap
for p in panels: out.paste(p, (x, 80)); x += p.width + gap
y = 80 + H + 16
for ln in dl: d.text((gap, y), ln, font=f3, fill=BLK); y += 34
out.save('ev/sv11337-01-card-text-ticket-vs-staging-densities.png'); print(out.size, [p.size for p in panels])
