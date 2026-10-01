import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import panel, stack, GRN, BLU

B='/tmp/qa10406/'
BR='QA branch sv10408.qa.shopview.com - build v26.39.2-998e506 - 1 Oct 2026'
CROP=(380,140,2098,470); W=(1080,2090); WY=(195,250)

stack([
 panel(B+'detail-A.png', CROP, 'One and a half units returned',
   BR + ' - credit memo ZZAUTOTEST-CM-10406-A, $14.69 per unit, no fee and no tax',
   word=W, tipy=WY, c=GRN, word_note='accepted 1.50, credited $22.04 - that is 1.5 x $14.69'),
 panel(B+'detail-B.png', CROP, 'Half a unit returned, with a $5.00 restocking fee',
   BR + ' - credit memo ZZAUTOTEST-CM-10406-B, $35.53 per unit',
   word=W, tipy=WY, c=GRN, word_note='accepted 0.50, line $17.77, credit $12.77 - not just the fee'),
], 'Both returns were confirmed with a decimal quantity typed on the Confirm Return screen, then reopened from the Credits tab. '
   'Under the old behaviour 1.5 became 1 and 0.5 became 0, so the half-unit return would have credited nothing at all and left '
   'only the $5.00 fee.'
).save('ev/01-decimals-survive-the-save.png')

stack([
 panel(B+'detail-C.png', CROP, 'A quarter of a unit - 1.25',
   BR + ' - credit memo ZZAUTOTEST-CM-10406-C, $35.53 per unit',
   word=W, tipy=WY, c=BLU, word_note='accepted 1.25, credited $44.41'),
 panel(B+'detail-D.png', CROP, 'A whole unit, to check nothing else moved',
   BR + ' - credit memo ZZAUTOTEST-CM-10406-D, $139.54 per unit',
   word=W, tipy=WY, c=BLU, word_note='accepted 1.00, credited $139.54 - exactly as before'),
], 'The third decimal the ticket names, and a whole-unit return alongside it as a control. Whole units behave exactly as they did.'
).save('ev/02-quarter-unit-and-whole-unit.png')
print('built')
