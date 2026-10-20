"""SV-9938 rule-4 exhibit: production Work Order Log (BEFORE) vs branch save of the same number + trailing space (AFTER)."""
import json, sys
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
from PIL import Image, ImageDraw
from qa_exhibits import fnt, wrap, arrow, tag, RED, GRN, BLU, BLK, GREY
EV = '/home/user/Manual-test-Cases/build/sv9938-part-number-trim-2026-10-20/ev/'
OUT = '/home/user/Manual-test-Cases/build/sv9938-part-number-trim-2026-10-20/exhibits/'
def load(n): return Image.open(EV+n+'.png').convert('RGB'), json.load(open(EV+n+'.json'))

def panel(img, crop, head, sub, boxes, w=1800, notes=()):
    x0,y0,x1,y1 = crop; im = img.crop(crop); sc = w/im.width; im = im.resize((w, int(im.height*sc)), Image.LANCZOS)
    d = ImageDraw.Draw(im)
    for (b, c, label, side) in boxes:
        bx = [(b[0]-x0)*sc-6, (b[1]-y0)*sc-6, (b[2]-x0)*sc+6, (b[3]-y0)*sc+6]
        d.rectangle(bx, outline=c, width=6)
        if label: tag(d, max(bx[0]-6, 30), bx[1]+4, label, c, size=26, anchor='mm')
    top = 120; nh = 44*len(notes)+(16 if notes else 0)
    canvas = Image.new('RGB', (w, im.height+top+nh), 'white'); dc = ImageDraw.Draw(canvas)
    dc.text((24, 18), head, font=fnt(34, True), fill=BLK); dc.text((24, 66), sub, font=fnt(24), fill=GREY)
    canvas.paste(im, (0, top))
    for i,(n,c) in enumerate(notes): dc.text((24, top+im.height+12+44*i), n, font=fnt(27, True), fill=c)
    return canvas

# BEFORE: production log, row D boxed
pi, pj = load('log-prod')
crop = (720, 140, 3080, 800)
before = panel(pi, crop, 'BEFORE — Production (build v26.40.21-81fa887), work order S2-868, 20 Oct 2026',
               'Work Order Log, searched for "Part number". Window 1900 x 1100 px, zoom 100%.',
               [(pj['partD'], RED, '1', '')], notes=[('1  The same number re-saved with a space at the end is logged as a change', RED)])
# AFTER: branch, typed with trailing space, then the row after saving
bi, bj = load('bD-2typed')
after1 = panel(bi, (860, 470, 2020, 660), 'AFTER — QA branch sv9938 (build v26.40.19-f2443c6), 20 Oct 2026',
               'Edit Part Request: Part Number retyped as "ZZ9938-D-38519 " (space at the end), then Save & Close.',
               [(bj['pn'], BLU, '2', '')], notes=[('2  The same number typed with one space at the end', BLU)])
ai, aj = load('bD-4after')
after2 = panel(ai, (560, 800, 2860, 915), 'AFTER — the same part after saving',
               'Saved as ZZ9938-D-38519 (no space). The branch Work Order Log listed no "Part number changed" for this save.',
               [(aj['pn'], GRN, '3', '')], notes=[('3  Saved without the space; no "Part number changed" was logged', GRN)])
W = 1800; gap = 30
H = before.height + after1.height + after2.height + gap*3 + 110
out = Image.new('RGB', (W, H), 'white'); y = 0
for p in (before, after1, after2):
    out.paste(p, (0, y)); y += p.height + gap
d = ImageDraw.Draw(out)
for i, line in enumerate(wrap(d, 'Rule 4: re-saving the same part number with a stray space must not count as a change. Production logs one; the branch does not.', fnt(28, True), W-48)):
    d.text((24, y+10+i*38), line, font=fnt(28, True), fill=BLK)
out.save(OUT+'sv9938-rule4-before-after.png'); print(out.size)
