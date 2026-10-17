import json, sys
sys.path.insert(0, '..')
from bexh import *
S = json.load(open('data/s04-staging.json')); P = json.load(open('data/s04-prod.json'))
mk = S['mk']['version']; pk = P['mk']['version']
def tile(png, title, sub, c, note, crop=None):
    im = Image.open(png).convert('RGB')
    if crop: im = im.crop(crop)
    if im.width < 520: pad = Image.new('RGB', (520, im.height), (249, 250, 251)); pad.paste(im, (0, 0)); im = pad
    return head(legend(im, [note], c, 20), title, sub, c)

def iconbox(png):
    im = Image.open(png).convert('L'); w, h = im.size
    px = [(x, y) for x in range(min(w, 200)) for y in range(h) if im.getpixel((x, y)) < 120]
    xs = [a for a, b in px]; ys = [b for a, b in px]
    return (min(xs) - 6, min(ys) - 6, min(xs) + max(ys) - min(ys) + 6, max(ys) + 6)
def big(png, box_, title, sub, c, note, f=6):
    im = Image.open(png).convert('RGB').crop(box_); im = im.resize((im.width * f, im.height * f), Image.NEAREST)
    if im.width < 360: pad = Image.new('RGB', (360, im.height), (249, 250, 251)); pad.paste(im, ((360 - im.width) // 2, 0)); im = pad
    return head(legend(im, [note], c, 20), title, sub, c)
r0 = S['runs'][0]['closed'][0]
before = row([tile('ev/s04-prod-list-closed.png', 'BEFORE: Production', f'{pk} · 16 Oct', RED, 'Material "search" icon, 24 px'),
              tile('ev/s04-prod-list-open.png', 'BEFORE: Production, search open', f'{pk} · 16 Oct', RED, 'Material "search" icon, 20 px', crop=(300, 0, 1000, 120))])
after = []
for v, n in [('list', 'List'), ('tech_view', 'Tech View'), ('board_view', 'Board View')]:
    after.append(tile(f'ev/s04-staging-{v}-closed.png', f'AFTER: {n}', f'Staging {mk} · 16 Oct', GRN, 'design system magnifier, 20 px'))
opened = [tile(f'ev/s04-staging-{v}-open.png', f'AFTER: {n}, search open', f'Staging {mk} · 16 Oct', GRN, 'same magnifier, 20 px, typing "S2-33"', crop=(600, 0, 1300, 120)) for v, n in [('list', 'List'), ('tech_view', 'Tech View'), ('board_view', 'Board View')]]
dz = big('ev/D1-design-tech_view-1440.png', (32, 136, 56, 160), 'Design file (enlarged)', 'Tech View design, 1440 px', BLU, 'design magnifier, 1x picture enlarged 12x', f=12)
st = Image.open('ev/s04-staging-tech_view-closed.png').convert('RGB'); sw = st.width
sz = big('ev/s04-staging-tech_view-closed.png', iconbox('ev/s04-staging-tech_view-closed.png'), 'Staging (enlarged)', 'Tech View, 2x capture', GRN, 'staging magnifier, 2x capture enlarged 6x')
page("Work Orders Search uses the design system's magnifier in every view", col([before, row(after), row(opened), row([dz, sz])]),
     ['Window 1440 x 900 px, browser zoom 100%. The icon on staging is drawn as a circle (radius 7) with a short handle, the design system\'s own magnifier; Lucide\'s search icon is a circle of radius 8, and Material\'s is a font glyph.',
      'Spec v64, S1-R9a: "The filter chips and Search use the design file\'s icons in every display option, List included, each exactly as the design file draws it."']).save('ev/sv11404-01-search-icon.png')
print('ok')
