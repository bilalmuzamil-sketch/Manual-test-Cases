import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import panel, stack, RED, GRN, BLU
OUT='/home/user/Manual-test-Cases/build/sv10190-delete-line-staged-part-2026-10-01/ev/'
SUB='app.staging.shopview.com  ·  build v26.39.2-538dd8d  ·  1 October 2026'

# 1 — the data-loss half is fixed
panel('/tmp/qa10190/click-result.png', (330,120,1700,1050),
  'The delete is refused and nothing is lost',
  SUB+'  ·  work order S2-34499, line "Replace - Hub cap gaskets", part SV10190-CLICK received moments earlier',
  word=(1198,1600), tipy=(940,1040), c=GRN,
  word_note='"Line can not be deleted with staged parts…" — the line and its received part are still in the table behind',
  item=(430,330,1240,110), item_note='the received part, still here', gutter=330
  ).save(OUT+'01-server-refuses.png')

# 2 — the remaining defect
panel('/tmp/qa10190/click-menu.png', (330,120,1700,780),
  'Still open: the menu item stays clickable after a receive done elsewhere',
  SUB+'  ·  tab 1 left open on the Lines page, the part received in a second tab, no reload — 6 of 6 attempts',
  word=(400,565), tipy=(700,750), c=RED,
  word_note='"Delete line" is red and clickable, though the backend already says this line cannot be deleted',
  item=(950,335,480,40), item_note='the part row still reads "Awaiting"', gutter=330
  ).save(OUT+'02-two-tab-still-enabled.png')

# 3 — the two states that are correct
a = panel('/tmp/qa10190/menu-fresh.png', (330,120,1700,780),
  'Correct when the page is loaded fresh',
  SUB+'  ·  the same line after a reload',
  word=(400,565), tipy=(655,705), c=GRN,
  word_note='greyed out, with the hover message the ticket asks for')
b = panel('/tmp/qa10190/single-menu.png', (330,120,1700,780),
  'Correct when the part is received on the page itself',
  SUB+'  ·  the ticket\'s own steps — Receive parts used on the Lines page, no reload — 3 of 3 attempts',
  word=(400,565), tipy=(655,705), c=GRN,
  word_note='greyed out straight away; the board refetches after an in-page receive')
stack([a,b],
  'So the stale view only happens when the receive is done somewhere else — another tab, the purchase order page, or bulk receive.'
  ).save(OUT+'03-correct-states.png')
print('built')
