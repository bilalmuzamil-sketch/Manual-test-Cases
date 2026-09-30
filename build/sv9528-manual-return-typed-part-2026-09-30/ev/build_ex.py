import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import panel, stack, RED, GRN, BLU
OUT='/home/user/Manual-test-Cases/build/sv9528-manual-return-typed-part-2026-09-30/ev/'
FORM=(290,150,1700,340); FIELD=(320,510); FY=(217,245)

before = panel('/tmp/qa9528/prod-02-after-tab.png', FORM,
  'BEFORE — production (what users hit today)',
  'app.shopview.com  ·  build v26.39.2-1aeb22d  ·  30 Sep 2026  ·  typed SV9528-PROD-01 into Part Number, then pressed Tab',
  word=FIELD, tipy=FY, c=RED, word_note='The part number has been wiped — the field is empty again')
after = panel('/tmp/qa9528/br-02-after-tab.png', FORM,
  'AFTER — fix branch (same keystrokes)',
  'sv9528.qa.shopview.com  ·  build v26.39.2-0ab2729  ·  30 Sep 2026  ·  typed SV9528-QA-01 into Part Number, then pressed Tab',
  word=FIELD, tipy=FY, c=GRN, word_note='The part number stays, so the return can be completed')
stack([before, after],
  'A part number that is not an inventory item: on the live build it disappears the moment you leave the field, '
  'which is what stopped the customer recording her vendor credit. On the fix branch it stays.'
  ).save(OUT+'01-before-after.png')

panel('/tmp/qa9528/br-05-list.png', (250,130,1700,230),
  'The saved return is listed with the typed part number',
  'sv9528.qa.shopview.com  ·  build v26.39.2-0ab2729  ·  Parts → Returns, top row',
  word=(770,1010), tipy=(186,214), c=GRN,
  word_note='SV9528-QA-01, 2.00 at $12.34, marked Manual'
  ).save(OUT+'02-return-saved.png')

panel('/tmp/qa9528/br-13-core-pick.png', (290,150,1700,430),
  'Picking an inventory part from the dropdown still behaves as before',
  'sv9528.qa.shopview.com  ·  build v26.39.2-0ab2729  ·  inventory part FLT1443E23, which carries a core charge',
  word=(540,1560), tipy=(270,320), c=BLU,
  word_note='The core row is added automatically — "Core for REMANUFACTURED…" at $43.47'
  ).save(OUT+'03-inventory-regression.png')

panel('/tmp/qa9528/br-14-catalog-typed.png', (290,150,1700,340),
  'A catalog part that is not stocked can be returned by typing its number',
  'sv9528.qa.shopview.com  ·  build v26.39.2-0ab2729  ·  F40010212 "Slack Adjuster" — in the Catalog, not in Inventory; left the field by clicking away, not Tab',
  word=FIELD, tipy=FY, c=GRN, word_note='Kept on click-away too, not only on Tab'
  ).save(OUT+'04-catalog-part.png')
print('built')
