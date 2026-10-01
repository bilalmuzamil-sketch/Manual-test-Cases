import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import panel, stack, GRN, BLU

B='/tmp/qa10408/'
BR='QA branch sv10408.qa.shopview.com - build v26.39.2-998e506 - 1 Oct 2026'

stack([
 panel(B+'before-save.png', (240,150,1700,430),
   'What was typed on Create Return',
   BR + ' - three parts, one each at the amounts the ticket names',
   word=(1000,1490), tipy=(188,380), c=BLU,
   word_note='19.99 / 4.35   -   0.29 / 0.29   -   20.00 / 20.00'),
 panel(B+'credit-detail.png', (380,140,2098,560),
   'What it reads after the return was confirmed',
   BR + ' - credit memo ZZAUTOTEST-CM-10408, opened fresh from the Credits tab',
   word=(1310,2090), tipy=(195,330), c=GRN,
   word_note='$19.99 / 4.35, $0.29 / 0.29, $20.00 / 20 - nothing lost'),
], 'Every amount comes back exactly as it was entered. Under the old behaviour $19.99 would have been stored as $19.98, '
   '$4.35 as $4.34 and $0.29 as $0.28. The subtotal of $40.28 and the total restocking fee of $24.64 are both exact.'
).save('ev/01-entered-and-saved.png')

panel(B+'wo-confirm-filled.png', (380,140,2098,575),
  'The other path: a work order return, with the restocking fee typed on the Confirm screen',
  BR + ' - credit $182.51 per unit, restocking fee typed as 4.35, two units',
  word=(1080,2090), tipy=(192,255), c=GRN,
  word_note='$182.51000 per unit and 4.35 typed - both stored to the cent'
 ).save('ev/02-work-order-path.png')
print('built')
