import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import panel, stack, RED, GRN, BLU
OUT='/home/user/Manual-test-Cases/build/sv9690-catalog-punctuation-2026-09-30/ev/'

# 1 — before vs after, same scenario, two builds
before = panel('/tmp/qa9690p/before-mismatch.png', (0,0,2060,300),
  'BEFORE — production (the bug customers see today)',
  'app.shopview.com  ·  build v26.39.2-1aeb22d  ·  captured 30 Sep 2026  ·  catalogue record SV9690*PROD*A, its receipt typed sv9690-prod-a',
  word=(1000,1420), tipy=(160,186), c=RED,
  word_note='No location and no receipt — the whole location is missing, not just collapsed')
after = panel('/tmp/qa9690/after-main.png', (0,0,2060,420),
  'AFTER — fix branch (same scenario)',
  'sv9690.qa.shopview.com  ·  build v26.39.1-99a393c  ·  captured 30 Sep 2026  ·  catalogue record SV9690*TEST*A, receipts typed four different ways',
  word=(404,1000), tipy=(130,400), c=GRN,
  word_note='Both locations listed, all four receipts with vendor, invoice, cost and quantity')
stack([before, after],
  'Same situation on each build: a part whose receipts were typed with different punctuation. '
  'Before, the receiving location does not appear at all. After, every spelling resolves to the one catalogue record.'
  ).save(OUT+'01-before-after.png')

# 2 — production control: exact spelling works there, so the empty page above is the defect
panel('/tmp/qa9690p/before-exact.png', (0,0,2060,300),
  'Production control — the same receipt typed exactly as the catalogue record',
  'app.shopview.com  ·  build v26.39.2-1aeb22d  ·  part number changed to SV9690*PROD*A, nothing else',
  word=(404,1000), tipy=(130,230), c=BLU,
  word_note='It appears — so the page works; only the punctuation difference breaks it'
  ).save(OUT+'02-production-control.png')

# 3 — sibling catalogue record
panel('/tmp/qa9690/after-sibling.png', (0,0,2060,420),
  'The sibling catalogue record shows the same receipts',
  'sv9690.qa.shopview.com  ·  build v26.39.1-99a393c  ·  catalogue record SV9690 TEST A (spaces) — the other spelling',
  word=(404,1000), tipy=(130,400), c=GRN,
  word_note='Identical four receipts across the same two locations'
  ).save(OUT+'03-sibling-record.png')

# 4 — tenant isolation
panel('/tmp/qa9690/org2-part.png', (0,0,2060,300),
  'A second organization with the same part number sees none of the first organization\'s data',
  'sv9690.qa.shopview.com  ·  build v26.39.1-99a393c  ·  organization "ZZAUTOTEST SV9690 Tenant NewReg", catalogue record SV9690*TEST*A',
  word=(1000,1420), tipy=(160,186), c=GRN,
  word_note='No locations and no receipts from the other organization'
  ).save(OUT+'04-tenant-isolation.png')
print('built')
