#!/usr/bin/env python3
"""Annotate a screenshot so the IMAGE ALONE explains the issue.

WHY THIS REPLACES annotate_shot.py (QA lead, 2026-09-17): *"the screenshots are appearing dirt and
too much zoomed ... make them looking Good as per the image global standard, and annotations should
be explanatory in a way that if someone reads the image only they can understand the issue."*

What was wrong with the old one, and what this fixes:
  - captions sat in a legend UNDER the image, so the reader had to cross-reference a number to a
    sentence. Here the sentence sits IN A SIDE GUTTER, level with the box, joined by a leader line.
  - every box was red, so nothing distinguished "this is the fault" from "this is correct".
    Here `good` boxes are green and `bad` boxes are red, and the label carries a tick or a cross.
  - captions were terse fragments. Here they are full sentences that stand on their own.
  - the source was captured at 1x and the text looked coarse. Capture at deviceScaleFactor 2 and
    pass --scale 2; the picture is then DOWNSAMPLED, which is what makes it look sharp rather than
    zoomed.

Usage:
  annotate_v2.py IN.png OUT.png --title "..." --scale 2 \
      --mark "x,y,w,h:bad:Unit 'TRK 412' and the year run together, reading 'TRK 4122019'" \
      --mark "x,y,w,h:good:This vehicle has no unit number, so its line reads correctly"

x,y,w,h are in the SOURCE image's own pixels (i.e. 2x coordinates if the capture was 2x).
"""
import argparse, os
from PIL import Image, ImageDraw, ImageFont

RED   = (211, 47, 47)
GREEN = (27, 126, 63)
INK   = (32, 33, 36)
MUTED = (95, 99, 104)
PAPER = (255, 255, 255)
BAND  = (247, 248, 250)
LINE  = (218, 220, 224)

def font(sz, bold=False):
    for n in (["DejaVuSans-Bold.ttf"] if bold else ["DejaVuSans.ttf"]):
        for d in ("/usr/share/fonts/truetype/dejavu/", "/usr/share/fonts/truetype/liberation/"):
            p = d + n
            if os.path.exists(p):
                return ImageFont.truetype(p, sz)
    return ImageFont.load_default()

def wrap(draw, text, fnt, width):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=fnt) <= width:
            cur = t
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src"); ap.add_argument("out")
    ap.add_argument("--title", required=True, help="what the reader is LOOKING AT, not the ticket title")
    ap.add_argument("--mark", action="append", default=[], help="x,y,w,h:good|bad:sentence")
    ap.add_argument("--scale", type=float, default=1.0, help="source capture scale; 2 for a retina grab")
    ap.add_argument("--gutter", type=int, default=330)
    a = ap.parse_args()

    img = Image.open(a.src).convert("RGB")
    s = a.scale
    # downsample a 2x capture to its logical size - this is what makes text look crisp, not big
    if s != 1.0:
        img = img.resize((int(img.width / s), int(img.height / s)), Image.LANCZOS)

    marks = []
    for m in a.mark:
        geo, kind, label = m.split(":", 2)
        x, y, w, h = [int(round(int(v) / s)) for v in geo.split(",")]
        marks.append((x, y, w, h, kind.strip().lower(), label.strip()))

    PAD, GUT = 16, a.gutter
    f_title, f_lab, f_num = font(15, True), font(13), font(11, True)
    tmp = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    title_lines = wrap(tmp, a.title, f_title, img.width + GUT - 2 * PAD)
    head = PAD + len(title_lines) * 20 + PAD

    W = img.width + GUT + PAD * 2
    H = head + img.height + PAD * 2
    canvas = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(canvas)

    # header band - says what this is, never repeats the ticket title
    d.rectangle([0, 0, W, head - 8], fill=BAND)
    d.line([0, head - 8, W, head - 8], fill=LINE)
    for i, ln in enumerate(title_lines):
        d.text((PAD, PAD + i * 20), ln, font=f_title, fill=INK)

    ox, oy = PAD, head
    canvas.paste(img, (ox, oy))
    d.rectangle([ox, oy, ox + img.width - 1, oy + img.height - 1], outline=LINE)

    gx = ox + img.width + 18                      # gutter text starts here

    # 🔴 LAY THE LABELS OUT BEFORE DRAWING, AND NEVER LET TWO OVERLAP. Centring each label on its
    # own box independently ran two of them into each other on the first real ticket (2026-09-17)
    # and the picture became unreadable - the exact failure this tool exists to prevent.
    LH = 17
    placed = []
    for i, (x, y, w, h, kind, label) in enumerate(marks, 1):
        lines = wrap(d, ("\u2717 " if kind == "bad" else "\u2713 ") + label, f_lab, GUT - 46)
        cy = oy + y + h // 2
        top = cy - (len(lines) * LH) // 2
        if placed:
            prev_bottom = placed[-1]["top"] + len(placed[-1]["lines"]) * LH
            top = max(top, prev_bottom + 12)
        top = max(top, oy)
        placed.append({"i": i, "kind": kind, "lines": lines, "top": top, "cy": cy,
                       "box": (ox + x, oy + y, ox + x + w, oy + y + h)})

    need = (placed[-1]["top"] + len(placed[-1]["lines"]) * LH + PAD) if placed else 0
    if need > H:
        bigger = Image.new("RGB", (W, need), PAPER)
        bigger.paste(canvas, (0, 0)); canvas = bigger; d = ImageDraw.Draw(canvas)

    for pl in placed:
        col = GREEN if pl["kind"] == "good" else RED
        bx0, by0, bx1, by1 = pl["box"]
        d.rounded_rectangle([bx0, by0, bx1, by1], radius=4, outline=col, width=2)
        cy = pl["cy"]; anchor = pl["top"] + (len(pl["lines"]) * LH) // 2
        d.line([bx1 + 2, cy, gx - 24, cy], fill=col, width=1)
        if abs(anchor - cy) > 2:
            d.line([gx - 24, cy, gx - 24, anchor], fill=col, width=1)
        d.line([gx - 24, anchor, gx - 18, anchor], fill=col, width=1)
        d.ellipse([gx - 16, anchor - 6, gx - 4, anchor + 6], fill=col)
        d.text((gx - 13, anchor - 6), str(pl["i"]), font=f_num, fill=PAPER)
        ty = pl["top"]
        for ln in pl["lines"]:
            d.text((gx + 4, ty), ln, font=f_lab, fill=INK if pl["kind"] == "bad" else MUTED)
            ty += LH

    canvas.save(a.out)
    print(f"wrote {a.out}  ({canvas.width}x{canvas.height})")

if __name__ == "__main__":
    main()
