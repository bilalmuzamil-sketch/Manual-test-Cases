"""SV-11394 exhibit: one Board View card, crops at dpr 2 (310x231 CSS); card sits at CSS (24,24)-(286,207) in each crop."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'testing-tools'))
from ticket_exhibit import panel, RED, GRN, BLU
from PIL import Image
EV = os.path.join(os.path.dirname(__file__), 'ev'); p = lambda n: os.path.join(EV, n)
C = (0, 0, 310, 231); B = (110, 203, 230, 222)   # the strip just under the card's bottom edge, where the shadow falls
a = panel(p('h-097f416b-before.png'), C, '1. At rest', boxes=[B + (BLU, 1)], notes=[(1, BLU, 'Under the card: plain background, no shadow.')])
b = panel(p('h-097f416b-after.png'), C, '2. Pointer on the card (staging today)', boxes=[B + (RED, 1)],
          notes=[(1, RED, 'The border turns darker, but under the card there is still no shadow. The shadow value reads "none".')])
c = panel(p('h-diag-noShadowRemoved-hover.png'), C, '3. Same, with "no-shadow" taken off in my browser only', boxes=[B + (GRN, 1)],
          notes=[(1, GRN, 'The soft shadow the hover style asks for now shows under the card.')])
ims = [a, b, c]; g = 30; W = sum(i.size[0] for i in ims) + g * 2; H = max(i.size[1] for i in ims)
out = Image.new('RGB', (W, H), 'white'); x = 0
for i in ims: out.paste(i, (x, 0)); x += i.size[0] + g
out.save(p('sv11394-01-card-hover-hd.png')); print(out.size)

# enlarged close-up of the strip under the card (Rule 101e): staging hover vs class removed
from PIL import ImageDraw, ImageFont
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 30)
def strip(name):  # CSS y 190-226 across the card, at 2x pixels, enlarged 3x more
    im = Image.open(p(name)).convert('RGB').crop((40, 380, 580, 452)); return im.resize((im.size[0] * 3, im.size[1] * 3), Image.NEAREST)
s2, s3 = strip('h-097f416b-after.png'), strip('h-diag-noShadowRemoved-hover.png')
pad = 70; Wd = s2.size[0]; z = Image.new('RGB', (Wd, pad * 2 + s2.size[1] * 2 + 30), 'white'); d = ImageDraw.Draw(z)
d.text((10, 15), 'Close-up of the card\'s bottom edge, pointer on the card - staging today: no shadow', fill=(200, 30, 30), font=F)
z.paste(s2, (0, pad)); y = pad + s2.size[1] + 30
d.text((10, y - 5), 'Same edge with "no-shadow" taken off in my browser: soft shadow under the edge', fill=(20, 130, 60), font=F)
z.paste(s3, (0, y + pad - 30)); z.save(p('sv11394-02-edge-closeup-hd.png')); print('closeup', z.size)
