import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from PIL import Image
from ticket_exhibit import panel, stack, RED, GRN
R='/home/user/Manual-test-Cases/build/sv10599-in-stock-badge-zero-on-hand-2026-10-07/ev/raw/'; O=R+'../'
B=(255,140,0)
a=panel(R+'L0-list-start.png',crop=(0,0,1900,150),title='Step 1: click "Work Orders" in the top menu. Step 2: click "Search" above the list, on the right.',
  boxes=[(257,17,344,40,B,1),(1215,87,1290,116,B,2)],notes=[(1,B,'"Work Orders" in the top menu.'),(2,B,'"Search" (magnifying glass) above the list. Type S10599-17581.')])
b=panel(R+'L1-list-found.png',crop=(0,75,1300,240),title='Step 3: the list now shows only S10599-17581. Look at its Status column.',
  boxes=[(1088,81,1271,121,B,3),(118,186,218,224,B,4)],notes=[(3,B,'S10599-17581 typed in the search box.'),(4,B,'Status column of that row: the green "Approved" label with a small blue circle on its top-right corner.')])
c=panel(R+'L1-list-found.png',crop=(60,160,420,240),title='Close-up of the Status column',
  boxes=[(193,187,216,210,RED,5)],notes=[(5,RED,'This small blue circle with the number 4 is what I called the "blue bubble". Move the mouse pointer over it.')])
d=panel(R+'L2-list-hover.png',crop=(60,120,420,240),title='Step 4: with the mouse over the blue circle, a dark box appears',
  boxes=[(131,142,279,193,RED,6)],notes=[(6,RED,'It reads "1 Part Ready to Order / 3 Parts In Stock". Only 1 of those 3 parts has stock.')])
z=lambda im:im.resize((im.width*5//2,im.height*5//2),Image.LANCZOS)
stack([a,b,z(c),z(d)]).save(O+'05-where-is-the-blue-circle-hd.png'); print(Image.open(O+'05-where-is-the-blue-circle-hd.png').size)
