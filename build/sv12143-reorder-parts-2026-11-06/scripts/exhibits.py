import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN
a=panel('ev/prod-p4-returned-after.png',crop=(300,90,1600,900),
 title='BEFORE - production (app.shopview.com, build v26.45.2-198e632), work order S2-1943, line 1',
 boxes=[(1148,384,1218,402,RED,1),(1100,794,1500,890,RED,2)],
 notes=[(1,RED,'The core on this line was marked OK, so it shows "Returned" - the same as on the customer\'s line 4.'),
        (2,RED,'Dragging any part to a new place shows the customer\'s error, and nothing moves, even after a refresh.')])
b=panel('ev/branch-b4-returned-a-after.png',crop=(300,90,1600,900),
 title='AFTER - QA branch sv12143 (build v26.45.2-a775397), work order S12143-17580, line 1',
 boxes=[(1173,384,1242,402,GRN,1),(426,486,840,580,GRN,2),(1100,842,1500,890,GRN,3)],
 notes=[(1,GRN,'Same set-up: a core marked OK shows "Returned" on the line.'),
        (2,GRN,'ZZ-COMPRESSOR was dragged up above the two hardline parts. The hardlines stay together, which is what the customer wanted.'),
        (3,GRN,'"Part moved" shows, and the new order is still there after a refresh.')])
stack([a,b]).save('ev/jira/01-before-after-returned-core.png')
