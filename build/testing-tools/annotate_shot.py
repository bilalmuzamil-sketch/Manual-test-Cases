#!/usr/bin/env python3
"""Annotate a screenshot for a defect ticket: red callout boxes with numbered labels and a
caption strip along the top. Written for the Inline Add and Edit Parts defect pack, but the
shape is generic — a defect screenshot the QA lead can read without the transcript.

  python3 build/testing-tools/annotate_shot.py IN.png OUT.png \
      --title "SV-XXXX — what this shows" \
      --crop 0,80,1600,560 \
      --box 430,350,240,40:1:"the box that should be empty" \
      --box 1400,350,120,30:2:"saves anyway"

--crop is left,top,right,bottom in the ORIGINAL image's pixels (omit for the whole page).
--box  is x,y,w,h:<number>:<caption>, in the CROPPED image's pixels.
Captions are also listed in a legend under the image, so a small box never has to carry long text.
"""
import argparse, os
from PIL import Image, ImageDraw, ImageFont

RED = (208, 32, 42)
INK = (24, 24, 27)
PAPER = (255, 255, 255)
BAND = (250, 246, 235)


def _font(size, bold=False):
    names = ([ "DejaVuSans-Bold.ttf", "LiberationSans-Bold.ttf" ] if bold else
             [ "DejaVuSans.ttf", "LiberationSans-Regular.ttf" ])
    for root in ("/usr/share/fonts/truetype/dejavu", "/usr/share/fonts/truetype/liberation",
                 "/usr/share/fonts"):
        for n in names:
            p = os.path.join(root, n)
            if os.path.exists(p):
                return ImageFont.truetype(p, size)
    for n in names:
        try:
            return ImageFont.truetype(n, size)
        except Exception:
            pass
    return ImageFont.load_default()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src"); ap.add_argument("dst")
    ap.add_argument("--title", required=True)
    ap.add_argument("--crop", default=None, help="left,top,right,bottom in the source image")
    ap.add_argument("--box", action="append", default=[], help="x,y,w,h:N:caption")
    ap.add_argument("--scale", type=float, default=1.0)
    a = ap.parse_args()

    im = Image.open(a.src).convert("RGB")
    if a.crop:
        l, t, r, b = [int(x) for x in a.crop.split(",")]
        im = im.crop((l, t, min(r, im.width), min(b, im.height)))
    if a.scale != 1.0:
        im = im.resize((int(im.width * a.scale), int(im.height * a.scale)), Image.LANCZOS)

    boxes = []
    for spec in a.box:
        geo, num, cap = spec.split(":", 2)
        side = None
        if geo.endswith("!R") or geo.endswith("!L"):
            side, geo = geo[-1], geo[:-2]
        x, y, w, h = [int(v) for v in geo.split(",")]
        boxes.append((x, y, w, h, num, cap, side))

    f_title = _font(24, bold=True)
    f_leg = _font(19)
    f_num = _font(20, bold=True)

    # wrap the title to the image width
    probe = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    lines, cur = [], ""
    for word in a.title.split():
        trial = (cur + " " + word).strip()
        if probe.textlength(trial, font=f_title) > im.width - 36 and cur:
            lines.append(cur); cur = word
        else:
            cur = trial
    if cur:
        lines.append(cur)
    head = 20 + 30 * len(lines)

    legend_h = (28 * len(boxes) + 22) if boxes else 0
    out = Image.new("RGB", (im.width, head + im.height + legend_h), PAPER)
    d = ImageDraw.Draw(out)
    d.rectangle([0, 0, out.width, head], fill=BAND)
    for i, ln in enumerate(lines):
        d.text((18, 10 + 30 * i), ln, font=f_title, fill=INK)
    out.paste(im, (0, head))

    for x, y, w, h, num, cap, side in boxes:
        y0 = y + head
        for k in range(3):
            d.rectangle([x - k, y0 - k, x + w + k, y0 + h + k], outline=RED)
        # badge sits OUTSIDE the box: to its left if there is room, otherwise to its right,
        # vertically centred, so it never covers what the box is pointing at
        r = 17
        cy = y0 + h // 2 - r
        cx = (x + w + 8) if side == "R" else (x - 2 * r - 8)
        if cx < 4:
            cx = x + w + 8
        if cx + 2 * r > out.width - 4:
            cx = max(4, x - 2 * r - 8)
        cy = max(head + 2, min(cy, out.height - legend_h - 2 * r - 2))
        d.ellipse([cx, cy, cx + 2 * r, cy + 2 * r], fill=RED)
        tw = d.textlength(num, font=f_num)
        d.text((cx + r - tw / 2, cy + r - 12), num, font=f_num, fill=PAPER)

    if boxes:
        ly = head + im.height + 10
        for b in boxes:
            num, cap = b[4], b[5]
            d.ellipse([18, ly + 2, 36, ly + 20], fill=RED)
            tw = d.textlength(num, font=f_num)
            d.text((27 - tw / 2, ly + 1), num, font=f_num, fill=PAPER)
            d.text((46, ly), cap, font=f_leg, fill=INK)
            ly += 28

    out.save(a.dst)
    print("wrote %s  (%dx%d)" % (a.dst, out.width, out.height))


if __name__ == "__main__":
    main()
