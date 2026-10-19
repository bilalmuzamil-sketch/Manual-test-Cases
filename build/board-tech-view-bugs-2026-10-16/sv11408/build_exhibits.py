"""SV-11408 exhibits: first-run state in Tech View / Board View, List unchanged, filtered states, same Create flow."""
import sys
sys.path.insert(0, '/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16')
from PIL import Image, ImageDraw
from bexh import head, legend, row, col, page, RED, GRN, BLU
E = '/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16/sv11408/'
S = 2

def panel(f, crop, title, sub, c, boxc=None):
    im = Image.open(E + 'ev/' + f).convert('RGB').crop(tuple(v * S for v in crop))
    if boxc:
        g = im.convert('L'); px = g.load(); W, H = g.size; xs, ys = [], []
        for y in range(0, H, 2):
            for x in range(0, W, 2):
                if px[x, y] < 235: xs.append(x); ys.append(y)
        if xs:
            d = ImageDraw.Draw(im); d.rectangle([min(xs) - 14, min(ys) - 14, max(xs) + 14, max(ys) + 14], outline=boxc, width=5)
    return head(im, title, sub, c)

EMPTY = (400, 410, 1040, 640)
LIST = (400, 230, 1040, 460)
p1 = [panel('prod-list-firstrun.png', LIST, 'BEFORE: Production today, List, no work orders', 'Magnifier, "No work orders found.", no button', RED, RED),
      panel('estimates-list.png', LIST, 'AFTER: Staging, List, no work orders (unchanged)', 'Same magnifier and the same words as production', BLU, BLU),
      panel('estimates-tech_view.png', EMPTY, 'AFTER: Staging, Tech View, no work orders', 'Clipboard in a grey circle, both lines, Create Work Order', GRN, GRN),
      panel('estimates-board_view.png', EMPTY, 'AFTER: Staging, Board View, no work orders', 'The same first-run state', GRN, GRN)]
b = legend(col([row(p1[:2]), row(p1[2:])]),
           ['Location "ZZAUTOTEST F2 Empty Shop", Estimates tab (no work orders, no filter, no search). The same state shows on the Completed tab. Production: location "Inventory 2", which has no work orders.'], (40, 40, 40))
page('SV-11408: first-run state in Tech View and Board View, List unchanged', b,
     ['Staging build v26.40.19-754919e and Production v26.40.19-d2441a9, 17 October 2026, window 1440 x 900 px, zoom 100%. Tech View and Board View are not on Production, so the only BEFORE picture is the Production List; the ticket has no screenshot.']).save(E + 'ev/sv11408-01-first-run-v2.png')

p2 = [panel('emptyloc-search-tech_view.png', (400, 200, 1040, 430), 'Search only, no match (Tech View)', 'No work orders match the search "zzqnomatch". No button', BLU, BLU),
      panel('emptyloc-filter-board_view.png', (400, 200, 1040, 430), 'Filter on: Assigned to me (Board View)', 'No work orders match these filters + Clear all filters', BLU, BLU),
      panel('tech_view-button_first_run_create_work_order.png', (400, 280, 1040, 610), 'Empty-state Create Work Order', 'Opens the New Work Order dialog', GRN),
      panel('tech_view-button_new_work_order.png', (400, 280, 1040, 610), "Page's Create Work Order (top right)", 'Opens the same dialog, same 8 controls', GRN)]
b = legend(col([row(p2[:2]), row(p2[2:])]),
           ['Top: with a search or a filter the first-run state is not shown; the filtered states show instead. Clicking Clear all filters brought back the first-run state. Bottom: both buttons open the identical New Work Order dialog (Customer, Add, Asset, Add, Asset Here?, Save, close).'], (40, 40, 40))
page('SV-11408: filtered states and the Create Work Order button', b,
     ['Staging build v26.40.19-754919e, 17 October 2026, location "ZZAUTOTEST F2 Empty Shop", Estimates tab, window 1440 x 900 px, zoom 100%.']).save(E + 'ev/sv11408-02-filtered-and-button.png')
for n in ['sv11408-01-first-run-v2', 'sv11408-02-filtered-and-button']: print(n, Image.open(E + f'ev/{n}.png').size)
