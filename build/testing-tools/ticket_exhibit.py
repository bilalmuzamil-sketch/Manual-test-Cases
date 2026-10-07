"""Sharp, plain-language ticket exhibits (the SV-10804 standard — build/JIRA-TICKET-STANDARD.md).

Capture the screen at 2x with qa-session.mjs:  open({..., vp:{width:1300,height:900}, dpr:2})
and read the boxes you want to mark with getBoundingClientRect() (CSS px). Then:

    from ticket_exhibit import panel, stack, RED, GRN
    a = panel('raw.png', crop=(x0,y0,x1,y1), title='1. When the part was received',
              boxes=[(x0,y0,x1,y1, GRN, 1)],
              notes=[(1, GRN, 'The $18.00 tax was recorded as a tax cost.')])
    stack([a, b]).save('02-received-vs-returned-hd.png')

All coordinates are CSS px; the tool multiplies by `scale` (2 for a dpr:2 capture).
Embed in Jira at HALF the pixel width (!file.png|width=<w/2>,height=<h/2>!) so it renders sharp.
Rules baked in: crop to only what matters · box + numbered badge on the row · the explanation goes
UNDER the image as numbered plain sentences (never beside it, never over a value).
"""
from PIL import Image, ImageDraw, ImageFont

_F = '/usr/share/fonts/truetype/dejavu/'
def font(sz, bold=False):
    return ImageFont.truetype(_F + ('DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf'), sz)

RED = (205, 20, 20); GRN = (0, 130, 60); BLU = (21, 101, 192)
BLK = (25, 25, 25); BG = (244, 246, 250); EDGE = (200, 205, 215)

def _wrap(d, text, f, w):
    out, line = [], ''
    for word in text.split(' '):
        t = (line + ' ' + word).strip()
        if d.textlength(t, font=f) <= w: line = t
        else: out.append(line); line = word
    out.append(line)
    return out

def panel(src, crop, title, boxes, notes, scale=2):
    """crop/boxes in CSS px. boxes=[(x0,y0,x1,y1,colour,number)], notes=[(number,colour,text)].
    Leave ~36 CSS px left of a boxed row inside the crop so its number badge fits."""
    S = scale
    im = Image.open(src).convert('RGB'); cx0, cy0, cx1, cy1 = crop
    shot = im.crop((int(cx0*S), int(cy0*S), int(cx1*S), int(cy1*S))); W = shot.width; pad = 18*S
    d0 = ImageDraw.Draw(Image.new('RGB', (10, 10)))
    tf, nf = font(20*S, True), font(17*S)
    tl = _wrap(d0, title, tf, W - 2*pad)
    nl = [(n, c, _wrap(d0, t, nf, W - 2*pad - 45*S)) for n, c, t in notes]
    hh = pad + len(tl)*26*S + 8*S
    hn = sum(len(l)*23*S + 12*S for _, _, l in nl) + pad
    out = Image.new('RGB', (W, hh + shot.height + hn), (255, 255, 255)); d = ImageDraw.Draw(out)
    d.rectangle([0, 0, W, hh - 3*S], fill=BG)
    y = pad - 3*S
    for l in tl: d.text((pad, y), l, font=tf, fill=BLK); y += 26*S
    out.paste(shot, (0, hh)); d.rectangle([0, hh, W - 1, hh + shot.height], outline=EDGE, width=S)
    for bx in boxes:
        x0, y0, x1, y1, c, n = bx[:6]; side = bx[6] if len(bx) > 6 else 'auto'   # optional 7th item: 'right' keeps the badge off a neighbour (SV-9828: a left badge covered the "No" button)
        a = ((x0-cx0)*S - 4*S, (y0-cy0)*S + hh - 3*S, (x1-cx0)*S + 4*S, (y1-cy0)*S + hh + 3*S)
        d.rectangle(a, outline=c, width=int(3.5*S))
        r = 15*S; cx = a[0] - r - 3*S if (side != 'right' and a[0] - 2*r - 6*S > 0) else a[2] + r + 3*S; cy = (a[1] + a[3])//2
        d.ellipse([cx-r, cy-r, cx+r, cy+r], fill=c)
        d.text((cx, cy), str(n), font=font(17*S, True), fill=(255, 255, 255), anchor='mm')
    y = hh + shot.height + pad
    for n, c, lines in nl:
        r = 13*S; d.ellipse([pad, y + 2*S, pad + 2*r, y + 2*S + 2*r], fill=c)
        d.text((pad + r, y + 2*S + r), str(n), font=font(15*S, True), fill=(255, 255, 255), anchor='mm')
        for i, l in enumerate(lines): d.text((pad + 45*S, y + i*23*S), l, font=nf, fill=BLK)
        y += len(lines)*23*S + 12*S
    return out

def stack(panels, gap=40):
    W = max(p.width for p in panels)
    out = Image.new('RGB', (W, sum(p.height for p in panels) + gap*(len(panels) - 1)), (255, 255, 255))
    y = 0
    for p in panels: out.paste(p, (0, y)); y += p.height + gap
    return out

def jira_embed(path):
    """Wiki-markup embed at half the pixel size (renders sharp on retina)."""
    im = Image.open(path); n = path.rsplit('/', 1)[-1]
    return f'!{n}|width={im.width//2},height={im.height//2}!'
