"""SV-11430 exhibit: Board View column scrollbars in dark theme (and light unchanged)."""
import sys, json
sys.path.insert(0, '/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16')
from PIL import Image, ImageDraw
from bexh import head, legend, row, col, page, RED, GRN, BLU
from qa_exhibits import fnt
R = '/home/user/Manual-test-Cases/build/board-tech-view-defects-2026-10-17/'; E = R + 'sv11430/ev/'; S = 2
B = json.load(open(E + 't30b.json')); C = json.load(open(E + 't30c.json'))
cols = [c for c in B['dark'] if c['sbw'] > 0]
def full(fn, title, sub, c):
    im = Image.open(E + fn).convert('RGB'); d = ImageDraw.Draw(im)
    for k in cols:
        d.rectangle([(k['x'] - 12) * S, k['y'] * S, (k['x'] + 2) * S, (k['y'] + k['h']) * S], outline=(230, 120, 0), width=5)
    return head(im.crop((0, 180 * S, 1300 * S, 900 * S)), title, sub, c)
def zoom(fn, title, sub, c):
    k = cols[0]; im = Image.open(E + fn).convert('RGB').crop(((k['x'] - 60) * S, (k['y'] + 10) * S, (k['x'] + 20) * S, (k['y'] + 250) * S))
    im = im.resize((im.width * 2, im.height * 2), Image.NEAREST); d = ImageDraw.Draw(im)
    d.rectangle([(48) * S * 2, 0, (62) * S * 2, im.height - 1], outline=(230, 120, 0), width=6)
    return head(im, title, sub, c)
b0 = Image.open(R + 'ticket-images/SV-11430-board_scrollbar_actual_vs_design.png').convert('RGB'); b0 = b0.crop((0, 0, b0.width, b0.height // 2))
before = head(b0, 'BEFORE: the picture in this ticket (staging)', 'White scrollbar tracks on every column in dark theme', RED)
a1 = full('t30-dark-reload.png', 'AFTER (staging): dark theme, after a page reload', 'Orange: each column\'s scrollbar. Thin dark thumb on the column\'s own dark background', GRN)
a2 = zoom('t30-dark-reload.png', 'Close-up (dark)', 'Track = panel colour, thumb dark grey', GRN)
l1 = full('t30-light.png', 'Light theme (unchanged)', 'Thin grey thumb on a light track, as before', BLU)
l2 = zoom('t30-light.png', 'Close-up (light)', 'Grey thumb on the light track', BLU)
body = legend(col([row([before]), row([a1, a2]), row([l1, l2])]), [
    f'Measured from the page in dark theme, on all {C["out"]["total"]} columns of the board ({C["out"]["scrolling"]} of them long enough to scroll): every column body uses a thin scrollbar with a dark grey thumb (rgb(75, 85, 101)) on a transparent track. Pixel read of the scrollbar strip: only the panel colour rgb(32, 41, 57) and the thumb colour; no white.'], (40, 40, 40))
page('SV-11430: Board View column scrollbars are thin and dark in dark theme', body,
     ['Staging build v26.40.19-754919e, 17 October 2026, window 1440 x 900 px, zoom 100%, Chromium with scrollbars shown. Board View is not on production yet, so the "before" is the ticket\'s own picture.']).save(E + 'sv11430-01-dark-scrollbars.png')
print(Image.open(E + 'sv11430-01-dark-scrollbars.png').size)
