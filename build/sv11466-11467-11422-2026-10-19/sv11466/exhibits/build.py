import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
E='/home/user/Manual-test-Cases/build/sv11466-11467-11422-2026-10-19/sv11466/ev/'; O='/home/user/Manual-test-Cases/build/sv11466-11467-11422-2026-10-19/sv11466/exhibits/'
a=panel(E+'staging-1440-light-board_view-hd.png',crop=(0,880,1440,1000),title='1. Staging Heavy Duty - 9919 (many technicians), window 1440 px wide',
  boxes=[(312,963,462,981,GRN,1),(520,963,1432,981,BLU,2)],
  notes=[(1,GRN,'The grab handle is 150 px long, although the board is about 80 times wider than the window.'),(2,BLU,'The sideways scroll bar under the technician columns is 16 px thick.')])
b=panel(E+'staging-1024-light-board_view-hd.png',crop=(0,880,1024,1000),title='2. The same board in a 1024 px wide window',
  boxes=[(312,963,462,981,GRN,1)],notes=[(1,GRN,'The handle is still 150 px. It measured 150 px at 1920, 1440, 1280 and 1024 px wide.')])
c=panel(E+'staging-1440-dvi-hd.png',crop=(0,880,1440,1000),title='3. Location "DVI Test" (8 technicians), window 1440 px wide',
  boxes=[(312,963,828,981,GRN,1)],notes=[(1,GRN,'With most of the board on screen the handle is longer: 516 px here (1,053 px at 1920 wide, 204 px at 1024). Never shorter than 150 px.')])
stack([a,b,c]).save(O+'sv11466-01-thickness-and-handle.png')
d=panel(E+'staging-1440-light-board_view-hd-dragged-right.png',crop=(0,150,1440,1000),title='4. Handle dragged all the way to the right',
  boxes=[(16,160,302,215,GRN,1),(1136,160,1432,215,GRN,2),(1282,963,1432,981,GRN,3)],
  notes=[(1,GRN,'Unassigned stays in place on the left.'),(2,GRN,'The last column, "Deleted technician", is on screen: the board reached its end.'),(3,GRN,'The handle sits at the right end of the bar. Dragging it back to the left returns to the first technician, Aaron Baker.')])
d.save(O+'sv11466-02-drag-end-to-end.png')
e=panel(E+'staging-1440-dark-board_view-hd.png',crop=(0,880,1440,1000),title='5. Dark theme',
  boxes=[(312,963,462,981,GRN,1)],notes=[(1,GRN,'The bar and its 150 px handle stay easy to see on the dark background.')])
f=panel(E+'firefox-1280-board-2x.png',crop=(0,840,1280,955),title='6. Firefox 142, window 1280 px wide (enlarged 2x from the capture)',scale=2,
  boxes=[(312,922,1272,936,GRN,1)],notes=[(1,GRN,"Firefox shows its own standard grey scroll bar (12 px), as the spec allows.")])
stack([e,f]).save(O+'sv11466-03-dark-and-firefox.png')
from PIL import Image
for n in ['01-thickness-and-handle','02-drag-end-to-end','03-dark-and-firefox']:
    im=Image.open(O+f'sv11466-{n}.png'); print(n,im.size)
