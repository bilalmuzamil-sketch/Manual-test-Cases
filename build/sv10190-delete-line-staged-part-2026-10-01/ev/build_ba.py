import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import panel, stack, RED, GRN
OUT='/home/user/Manual-test-Cases/build/sv10190-delete-line-staged-part-2026-10-01/ev/'
CROP=(330,400,1700,1050)
before = panel('/tmp/qa10190/prod-after-delete.png', CROP,
  'BEFORE — production, the build customers are on today',
  'app.shopview.com  ·  build v26.39.2-1aeb22d  ·  1 Oct 2026  ·  pressing Delete on a line that holds a received part',
  word=(1200,1600), tipy=(925,1045), c=RED,
  word_note='"Ooooops! An error occurred ... Include your request ID" — no hint of what is wrong or what to do')
after = panel('/tmp/qa10190/click-result.png', CROP,
  'AFTER — staging, with the fix',
  'app.staging.shopview.com  ·  build v26.39.2-538dd8d  ·  1 Oct 2026  ·  the same action on the same kind of line',
  word=(1200,1600), tipy=(925,1045), c=GRN,
  word_note='"Line can not be deleted with staged parts, please move parts to another line or return them"')
stack([before, after],
  'The same click on the same situation. Neither build loses the part, but today a user gets a support '
  'reference number and no explanation; with the fix they are told exactly what is wrong and how to resolve it.'
  ).save(OUT+'04-before-after.png')
print('built')
