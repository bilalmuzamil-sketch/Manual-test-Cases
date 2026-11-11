"""textpic.py — 11 Nov 2026: render the first N lines of a text/CSV file as a PNG (monospace), as evidence of what a downloaded CSV holds.
Usage: python3.12 textpic.py <file> <out.png> [N=8] [title]"""
import sys
from PIL import Image, ImageDraw, ImageFont
f, out = sys.argv[1], sys.argv[2]; n = int(sys.argv[3]) if len(sys.argv) > 3 else 8; title = sys.argv[4] if len(sys.argv) > 4 else f.split('/')[-1]
lines = open(f, encoding='utf-8-sig', errors='replace').read().splitlines()[:n]
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', 16); tf = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 17)
except Exception: font = tf = ImageFont.load_default()
w = max(900, 20 + 10 * max((len(l) for l in lines), default=40)); h = 60 + 24 * len(lines)
im = Image.new('RGB', (min(w, 2400), h), 'white'); d = ImageDraw.Draw(im); d.text((12, 10), title, fill='black', font=tf)
for i, l in enumerate(lines): d.text((12, 44 + 24 * i), (str(i + 1) + ' ').rjust(4) + l, fill='black', font=font)
im.save(out); print('wrote', out, im.size)
