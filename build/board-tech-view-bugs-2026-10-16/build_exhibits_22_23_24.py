import json, sys
sys.path.insert(0, '.')
from bexh import *
X = json.load(open('sv11322/data/x22.json')); mk = X['mk']['version']; sub = f'Staging {mk} · 16 Oct'
# ---- SV-11322 tooltip
def tipshot(v):
    im = Image.open(f'sv11322/ev/x22-{v}-hover.png').convert('RGB'); d = ImageDraw.Draw(im); t = X[v]
    box(d, t['tip'], GRN, pad=3, w=4)
    h = t['hdr']; d.line([(0, h['y'] * 2), (2880, h['y'] * 2)], fill=BLU, width=3)
    return im.crop((1960, 50, 2700, int(h['y'] * 2) + 90))
before = head(legend(Image.open('sv11322/ev/02-tech_view-1440-retry.png').convert('RGB').crop((820, 60, 1440, 210)).resize((1240, 300), Image.LANCZOS),
                      ['"Tech View" tooltip opens below the switcher, on top of the "Service Advisor" header'], RED, 22), 'BEFORE: ticket picture, Tech View at 1440 px', 'Staging, 14 Oct 2026', RED)
P = []
for v, name in [('list', 'List'), ('tech_view', 'Tech View'), ('board_view', 'Board View')]:
    t = X[v]
    P.append(head(legend(tipshot(v), [f'"{t["text"]}" ends at {t["tip"]["y"] + t["tip"]["h"]:.0f} px; button starts at {t["btn"]["by"]} px', f'Header row (blue line) starts at {t["hdr"]["y"]:.0f} px: not covered'], GRN, 20), f'AFTER: hovering {name}', sub, GRN))
page('Display switcher tooltips open above the switcher', col([before, row(P)]),
     ['Window 1440 x 900 px, browser zoom 100%. Measured in List, Tech View and Board View, at 1440 and 1536 px: all 9 tooltips open above, none covers the header row.',
      "Spec v64, S1-R9b: \"The switcher's hover tooltip opens above the switcher, so it never covers the table's column header row. The tooltips read List, Tech View and Board View.\""]).save('sv11322/ev/sv11322-01-switcher-tooltips.png')
# ---- SV-11323 board full width
S = json.load(open('sv11323/data/p22-staging.json'))
bv = [r for r in S['runs'] if r['v'] == 'board_view']
im = Image.open('sv11323/ev/x22-board_view-rest.png').convert('RGB'); d = ImageDraw.Draw(im)
c1 = bv[1]['col1']; y = 330
d.line([(0, y), (32, y)], fill=GRN, width=5); d.text((4, y + 70), '16 px', font=fnt(30, True), fill=GRN)  # card border at x=16 css (pixel-read), same as the design
d.rectangle([2, 300, 2878, 1700], outline=GRN, width=4)
after = head(legend(im.crop((0, 260, 2880, 1760)).resize((1440, 750), Image.LANCZOS), ['Columns sit straight on the page from edge to edge: no grey rounded panel, no extra margin; first column border 16 px from the left edge, as in the design'], GRN, 20), 'AFTER: Board View, 1440 px', sub, GRN)
bb = head(legend(Image.open('sv11323/ev/02-board_view-1440.png').convert('RGB').crop((0, 60, 1440, 600)), ['Columns inside a grey rounded panel with margins'], RED, 20), 'BEFORE: ticket picture', 'Staging, 14 Oct 2026', RED)
dd = head(Image.open('sv11323/ev/D1-design-board_view-1440.png').convert('RGB').crop((0, 90, 1440, 630)), "Design (Branko's file, attached to the ticket)", 'reference', BLU)
page('Board View runs full width, with no grey rounded panel', col([row([bb, dd]), after]),
     ['Window 1440 x 900 px, browser zoom 100%. Also measured at 1280, 1536 and 1920 px: the board runs from the left edge to the right edge with 8 px padding and a see-through background.',
      'Spec v64, S3-R23: "Board View runs full width, with no grey rounded panel around the columns, as in the design."']).save('sv11323/ev/sv11323-01-board-full-width.png')
# ---- SV-11324 tech view edge to edge + List unchanged
tv = [r for r in S['runs'] if r['v'] == 'tech_view']
im = Image.open('sv11324/ev/x22-tech_view-rest.png').convert('RGB'); d = ImageDraw.Draw(im)
d.rectangle([2, 280, 2877, 1790], outline=GRN, width=5)
ta = head(legend(im.crop((0, 230, 2880, 1800)).resize((1440, 785), Image.LANCZOS), ['Table and group headers run from the left edge (0 px) to the right edge (1440 px), on white, no card or panel'], GRN, 20), 'AFTER: Tech View, 1440 px', sub, GRN)
tb = head(legend(Image.open('sv11324/ev/02-tech_view-1440-retry.png').convert('RGB').crop((0, 140, 1440, 700)), ['Table inset from the page edges, with a gutter on each side'], RED, 20), 'BEFORE: ticket picture', 'Staging, 14 Oct 2026', RED)
def lst(png, title, s2):
    im = Image.open(png).convert('RGB'); d = ImageDraw.Draw(im); d.line([(0, 262), (60, 262)], fill=GRN, width=6); d.text((4, 272), '30 px', font=fnt(28, True), fill=GRN)
    return head(legend(im.crop((0, 230, 1440, 760)), ['30 px margin each side'], GRN, 22), title, s2, GRN)
L1 = lst('sv11324/ev/p22-staging-list-1440.png', 'List on staging today', sub)
L2 = lst('sv11324/ev/p22-prod-list-1440.png', 'List on production', f"Production {json.load(open('sv11324/data/p22-prod.json'))['mk']['version']} · 16 Oct")
page('Tech View runs edge to edge on white; List is unchanged', col([tb, ta, row([L1, L2])]),
     ['Window 1440 x 900 px, browser zoom 100%. Tech View measured at 1280, 1440, 1536 and 1920 px: the table starts at 0 px and ends at the window edge every time. List: 30 px side margins and the same table box as production at all four widths.',
      "Spec v64, S2-R22: \"Tech View's table runs edge to edge on white, with no side gutter and no card or panel around it, as in the design. When the columns are wider than the screen, the table scrolls sideways, as in the design ...\""]).save('sv11324/ev/sv11324-01-edge-to-edge.png')
print('ok')
