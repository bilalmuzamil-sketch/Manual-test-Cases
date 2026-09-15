from PIL import Image, ImageDraw, ImageFont
import os, glob

def font(sz, bold=False):
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf" % ("-Bold" if bold else ""),
              "/usr/share/fonts/truetype/liberation/LiberationSans%s.ttf" % ("-Bold" if bold else "")]:
        if os.path.exists(p):
            return ImageFont.truetype(p, sz)
    return ImageFont.load_default()

RED, GREEN, INK, BG = (200, 30, 30), (20, 130, 60), (25, 25, 30), (255, 255, 255)

def wrap(draw, text, f, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=f) <= maxw: cur = t
        else: lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

def make(src, out, title, verdict, verdict_ok, notes, boxes):
    im = Image.open(src).convert("RGB").crop((462, 88, 1140, 640))
    W = im.width
    fT, fN, fV = font(21, True), font(19), font(19, True)
    d0 = ImageDraw.Draw(im)
    for (x0, y0, x1, y1, lbl, ok) in boxes:
        col = GREEN if ok else RED
        d0.rectangle([x0, y0, x1, y1], outline=col, width=4)
        lf = font(18, True)
        tw = d0.textlength(lbl, font=lf)
        ly = y0 - 26 if y0 > 30 else y1 + 6
        d0.rectangle([x0, ly - 3, x0 + tw + 12, ly + 23], fill=col)
        d0.text((x0 + 6, ly), lbl, font=lf, fill=(255, 255, 255))
    tmp = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    nlines = []
    for n in notes: nlines += wrap(tmp, n, fN, W - 40) + [""]
    tmp2 = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    head = (14 + len(wrap(tmp2, title, fT, W - 32)) * 26) + (12 + len(wrap(tmp2, verdict, fV, W - 32)) * 24)
    foot = 18 + len(nlines) * 26 + 14
    canvas = Image.new("RGB", (W, head + im.height + foot), BG)
    d = ImageDraw.Draw(canvas)
    tl = wrap(d, title, fT, W - 32)
    th = 14 + len(tl) * 26
    d.rectangle([0, 0, W, th], fill=(35, 40, 55))
    for i, ln in enumerate(tl): d.text((16, 8 + i * 26), ln, font=fT, fill=(255, 255, 255))
    vl = wrap(d, verdict, fV, W - 32)
    vh = 12 + len(vl) * 24
    d.rectangle([0, th, W, th + vh], fill=(GREEN if verdict_ok else RED))
    for i, ln in enumerate(vl): d.text((16, th + 6 + i * 24), ln, font=fV, fill=(255, 255, 255))
    canvas.paste(im, (0, head))
    y = head + im.height + 12
    for ln in nlines:
        d.text((16, y), ln, font=fN, fill=INK); y += 26
    d.rectangle([0, 0, W - 1, canvas.height - 1], outline=(200, 200, 205), width=1)
    canvas.save(out)
    print("wrote", out, canvas.size)

TAB = (30, 84, 650, 116)     # the tab strip with the per-type counts, inside the crop
ROW = (30, 128, 650, 200)    # the first result row(s)
