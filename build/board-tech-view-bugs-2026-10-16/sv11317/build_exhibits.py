import json, sys
from PIL import Image, ImageDraw
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import fnt, wrap, RED, GRN, BLU, BLK, GREY
R = json.load(open('data/c7.json'))
def head(im, title, sub, c):
    out = Image.new('RGB', (im.width, im.height + 86), 'white'); d = ImageDraw.Draw(out)
    d.rectangle([0, 0, im.width - 1, 80], fill=c); d.text((16, 8), title, font=fnt(28, True), fill='white'); d.text((16, 46), sub, font=fnt(21), fill='white')
    out.paste(im, (0, 86)); d.rectangle([0, 0, out.width - 1, out.height - 1], outline=(190, 196, 204), width=2); return out
def after(q, title, c, note):
    hs = R[q]; im = Image.open(f'ev/c7-{q}.png').convert('RGB'); d = ImageDraw.Draw(im); S = 2; f = fnt(20, True)
    y0 = min(h['y'] for h in hs); y1 = max(h['y'] + h['h'] for h in hs)
    for i, h in enumerate(hs, 1):
        d.rectangle([h['x'] * S + 3, y0 * S + 3, (h['x'] + h['w']) * S - 3, y1 * S - 3], outline=c, width=3)
        cx = (h['x'] + h['w'] / 2) * S; d.ellipse([cx - 15, y0 * S - 34, cx + 15, y0 * S - 4], fill=c); d.text((cx, y0 * S - 19), str(i), font=f, fill='white', anchor='mm')
    im = im.crop((0, int((y0 - 24) * S), im.width, int((y1 + 52) * S)))
    lab = Image.new('RGB', (im.width, 60), 'white'); ImageDraw.Draw(lab).text((16, 14), note, font=fnt(26, True), fill=c)
    full = Image.new('RGB', (im.width, im.height + 60), 'white'); full.paste(im, (0, 0)); full.paste(lab, (0, im.height))
    return head(full, title, f"Staging {R['mk']['version']} · 16 Oct 2026 · window 1920 px, zoom 100%", c)
b = Image.open('ev/08-tech_view-scrolled-right-1440.png').convert('RGB').crop((0, 140, 1440, 270)); b = b.resize((b.width * 2, b.height * 2), Image.LANCZOS)
d = ImageDraw.Draw(b); d.rectangle([10, 30, 2870, 90], outline=RED, width=5)
lab = Image.new('RGB', (b.width, 60), 'white'); ImageDraw.Draw(lab).text((16, 14), 'The List\'s columns: On Site first, VIN/Serial # and Lead Technician shown, no Waiting On Parts or Assigned Techs', font=fnt(26, True), fill=RED)
bb = Image.new('RGB', (b.width, b.height + 60), 'white'); bb.paste(b, (0, 0)); bb.paste(lab, (0, b.height))
before = head(bb, 'BEFORE: ticket picture', 'Staging, 14 Oct 2026 (develop b19269d4487), window 1440 px', RED)
P = [before,
     after('admin', 'AFTER: Admin (has financial permission)', GRN, '13 columns, in the spec\'s order: Status ... Created On, Total Price'),
     after('tech', 'AFTER: Technician role (no financial permission)', GRN, '12 columns: the same order, Total Price hidden as the spec requires')]
W = max(p.width for p in P); W2 = 2000; sc = W2 / W
P = [p.resize((int(p.width * sc), int(p.height * sc)), Image.LANCZOS) for p in P]
gap = 26; f1, f3 = fnt(30, True), fnt(24)
notes = ['Spec v63, S5-R4: "Until the user changes Tech View\'s columns, Tech View shows these columns, in this order, as in the design: Status, Waiting On Parts, Number, Customer, Unit, Asset, Progress, Service Advisor, Clocked In, Lines, Assigned Techs, Created on, Total price (Total price subject to financial permission). On Site, VIN/Serial # and Lead Technician are off by default ..."']
d0 = ImageDraw.Draw(Image.new('RGB', (9, 9))); dl = []
for n in notes: dl += wrap(d0, n, f3, W2 - 2 * gap)
H = 74 + sum(p.height + gap for p in P) + 34 * len(dl) + 20
out = Image.new('RGB', (W2 + 2 * gap, H), 'white'); dd = ImageDraw.Draw(out)
dd.text((gap, 20), 'Tech View opens on the design\'s columns', font=f1, fill=BLK); y = 74
for p in P: out.paste(p, (gap, y)); y += p.height + gap
for ln in dl: dd.text((gap, y), ln, font=f3, fill=BLK); y += 34
out.save('ev/sv11317-01-tech-view-default-columns.png'); print(out.size)
