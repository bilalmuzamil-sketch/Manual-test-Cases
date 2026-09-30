"""Exhibit 1 — BEFORE (production) vs AFTER (fix branch): tagging yourself in a Work Order note."""
import sys, json
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import panel, stack, RED, GRN
from PIL import Image

gp = json.load(open('/tmp/qa8745/geo-prod-cap.json'))
gb = json.load(open('/tmp/qa8745/geo-branch-cap.json'))
d  = gp['dlg']
crop = (d['x']-20, d['y']-20, d['x']+d['w']+20, d['y']+d['h']+20)

f = gp['field']
a = panel('raw-prod-selftag.png', crop,
          'BEFORE — production, what customers use today',
          'app.shopview.com  ·  build v26.39.2-1aeb22d  ·  30 September 2026  ·  signed in as Bilal Muzammil',
          item=(f['x'], f['y'], f['w'], f['h']), c=RED,
          item_note='typed my own name\n"@Bilal" — nothing\nis offered', gutter=360)

i = gb['item']
b = panel('raw-branch-selftag.png', crop,
          'AFTER — the fix branch',
          'sv8745.qa.shopview.com  ·  build v26.39.1-068d31b  ·  30 September 2026  ·  signed in as Admin ShopView',
          item=(i['x'], i['y'], i['w'], i['h']), c=GRN,
          item_note='typed my own name\n"@Admin" — my own\naccount is offered', gutter=360)

out = stack([a, b],
    'The same New Note box on a work order, in both cases typing the signed-in person’s own name. '
    'Today nothing comes back; on the fix branch your own account is offered and can be picked.')
pad = Image.new('RGB', (out.width, out.height + 24), (255, 255, 255))
pad.paste(out, (0, 0))
pad.save('01-self-tag-before-after.png')
print('written', pad.size)
