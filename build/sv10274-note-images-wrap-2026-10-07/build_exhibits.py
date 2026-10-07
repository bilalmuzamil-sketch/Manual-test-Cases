import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from PIL import Image
from ticket_exhibit import panel, stack, RED, GRN
R='/home/user/Manual-test-Cases/build/sv10274-note-images-wrap-2026-10-07/ev/raw/'; O=R+'../'
b=panel(R+'before-prod12-1920.png',crop=(330,195,1920,505),
  title='BEFORE (production, build v26.40.8-1e8e914, 7 Oct 2026, window 1920 x 1080): a work order note with 12 images',
  boxes=[(381,320,1916,460,RED,1)],
  notes=[(1,RED,'All 12 images sit in one row that runs off the right edge of the screen. Only 9 can be seen. The note\'s three-dot menu (Edit, Add attachment, Delete Note) is pushed about 480 pixels past the right edge, so it cannot be seen without scrolling sideways.')])
a=panel(R+'after-wo12-1920.png',crop=(335,160,1905,690),
  title='AFTER (QA branch sv9667, build v26.40.8-cf5b7ad, 7 Oct 2026, window 1920 x 1080): the same note with 12 images',
  boxes=[(386,285,1704,643,GRN,1),(1838,171,1875,208,GRN,2)],
  notes=[(1,GRN,'The 12 images wrap onto 3 rows and stay inside the note. Nothing scrolls sideways.'),
         (2,GRN,'The note\'s three-dot menu is visible at the top right of the note.')])
stack([b,a]).save(O+'01-before-vs-after-desktop-hd.png')
# phone: side by side
pb=panel(R+'before-prod12-375.png',crop=(0,170,375,560),
  title='BEFORE (production, phone width 375)',
  boxes=[(10,229,373,533,RED,1)],
  notes=[(1,RED,'The note is about 2,100 pixels wide on a 375-pixel screen. Its three-dot menu is far off to the right.')])
pa=panel(R+'after-wo12-375c.png',crop=(0,40,375,560),
  title='AFTER (QA branch, phone width 375)',
  boxes=[(306,48,345,88,GRN,1)],
  notes=[(1,GRN,'The images stack one per row, the note fits the screen, and the three-dot menu is visible.')])
h=max(pb.height,pa.height); out=Image.new('RGB',(pb.width+pa.width+40,h),'white'); out.paste(pb,(0,0)); out.paste(pa,(pb.width+40,0)); out.save(O+'02-before-vs-after-phone-hd.png')
for f in ['01-before-vs-after-desktop-hd.png','02-before-vs-after-phone-hd.png']: print(f,Image.open(O+f).size)
