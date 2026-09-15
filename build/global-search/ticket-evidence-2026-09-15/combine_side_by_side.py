from PIL import Image, ImageDraw, ImageFont
import os

def font(sz, bold=False):
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf" % ("-Bold" if bold else ""),
              "/usr/share/fonts/truetype/liberation/LiberationSans%s.ttf" % ("-Bold" if bold else "")]:
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()

RED, GREEN, DARK, WHITE = (198, 40, 40), (27, 124, 63), (32, 38, 52), (255, 255, 255)
CROP = (462, 88, 1140, 470)          # the modal card only

def panel(src, typed, verdict, ok, note):
    im = Image.open(src).convert("RGB").crop(CROP)
    W = im.width
    fq, fv, fn = font(20, True), font(19, True), font(17)
    d = ImageDraw.Draw(im)
    col = GREEN if ok else RED
    # box the tab strip where the per-type counts live
    d.rectangle([28, 84, 652, 116], outline=col, width=4)
    head, foot = 76, 66
    out = Image.new("RGB", (W, head + im.height + foot), WHITE)
    dd = ImageDraw.Draw(out)
    dd.rectangle([0, 0, W, 36], fill=DARK)
    dd.text((14, 8), f"Typed:  {typed}", font=fq, fill=WHITE)
    dd.rectangle([0, 36, W, 74], fill=col)
    dd.text((14, 44), verdict, font=fv, fill=WHITE)
    out.paste(im, (0, head))
    dd.text((14, head + im.height + 12), note, font=fn, fill=(30, 30, 35))
    dd.rectangle([0, 0, W - 1, out.height - 1], outline=(190, 190, 196), width=1)
    return out

left = panel('a1-2019-freightliner.png', '2019 Freightliner',
             'NO VEHICLES  -  Assets reads (0)', False,
             'The boxed row of tabs shows Assets (0). No vehicle comes back at all.')
right = panel('a2-freightliner-cascadia.png', 'Freightliner Cascadia',
              'THE SAME VEHICLE IS FOUND', True,
              'Proof the vehicle exists and is searchable, so the left side is not missing data.')

GAP, TOP = 22, 96
W = left.width + GAP + right.width
H = TOP + max(left.height, right.height) + 16
canvas = Image.new("RGB", (W, H), WHITE)
d = ImageDraw.Draw(canvas)
fT, fS = font(27, True), font(19)
d.rectangle([0, 0, W, 52], fill=DARK)
d.text((18, 12), "SV-10055   The same vehicle:  a 2019 Freightliner Cascadia, unit ZZT-4471", font=fT, fill=WHITE)
d.text((18, 62), "Left: the year typed with the make finds nothing.      Right: the make typed with the model finds it.",
       font=fS, fill=(40, 40, 48))
canvas.paste(left, (0, TOP)); canvas.paste(right, (left.width + GAP, TOP))
canvas.save('/tmp/shots/ANN-SV-10055-side-by-side.png')
print("wrote side-by-side", canvas.size)
