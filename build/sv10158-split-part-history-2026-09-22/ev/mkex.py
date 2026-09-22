"""SV-10158 exhibits. Run from this directory; sources in /tmp/sv10158."""
from PIL import Image, ImageDraw, ImageFont
S = "/tmp/sv10158/"
F = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def f(sz, b=False): return ImageFont.truetype(FB if b else F, sz)

RED, GREEN, GREY, INK = (190, 30, 30), (20, 135, 60), (95, 95, 95), (15, 15, 15)

# The Part History table region on a 2200x1200 capture (Staff .. Event columns).
CROP = (420, 150, 1820, 400)


def panel(draw, img, y, w, png, title, sub, verdict, colour, crop=CROP, box=None):
    """One labelled screenshot panel. Returns the new y."""
    draw.text((0, y), title, font=f(24, True), fill=colour); y += 31
    draw.text((0, y), sub, font=f(19), fill=(70, 70, 70)); y += 27
    draw.text((0, y), "▶  " + verdict, font=f(21, True), fill=colour); y += 30
    src = Image.open(S + png).crop(crop)
    img.paste(src, (0, y))
    draw.rectangle([0, y, w - 1, y + src.size[1] - 1], outline=(205, 205, 205), width=1)
    if box:
        draw.rectangle([box[0] - 4, y + box[1] - 4, box[2] + 4, y + box[3] + 4],
                       outline=colour, width=4)
    return y + src.size[1] + 36
