"""Exhibit 04 — a discount on a PART line, production."""
import sys, json
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import panel, stack, GRN
from PIL import Image

g = json.load(open('geo-prod.json'))
b = g['editPreview']
crop = (max(0, b['x'] - 40), max(0, b['y'] - 120), b['x'] + b['w'] + 40, b['y'] + b['h'] + 34)

p = panel('raw-prod-part-edit.png', crop,
          'PRODUCTION — editing a discount on a PART',
          'app.shopview.com  ·  build v26.39.2-1aeb22d  ·  30 September 2026  ·  S2-917, part at $20.00',
          item=(b['x'], b['y'], b['w'], b['h']), c=GRN,
          item_note='starts from $20.00,\nnot from $15.00', gutter=360)

out = stack([p],
      'A $5.00 discount on a $20.00 part. The popup starts from the part’s pre-discount $20.00 '
      'and reaches $15.00 — the same figures it showed when the discount was first added.')
# give the footer room it actually needs
pad = Image.new('RGB', (out.width, out.height + 26), (255, 255, 255))
pad.paste(out, (0, 0))
pad.save('04-part-line-production.png')
print('written', pad.size)
