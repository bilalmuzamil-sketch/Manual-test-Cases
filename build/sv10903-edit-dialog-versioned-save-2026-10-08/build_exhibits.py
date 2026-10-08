"""SV-10903 exhibits (8 Oct 2026). Run from this folder: python3 build_exhibits.py"""
import sys
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
from PIL import Image
R = 'ev/raw/'; O = 'ev/'
PROD = 'BEFORE - Production, build v26.40.12-106a0f1, 8 Oct 2026'
QA = 'AFTER - QA branch sv10360, build v26.40.8-3e5c1df, 8 Oct 2026'
a = panel(R+'PT1-after-reload.png', crop=(232,470,1580,600), title=PROD+': memo typed on the row, Edit opened before it saved, Account changed, Save',
    boxes=[(908,483,1099,516,BLU,1), (692,556,1556,588,RED,2)],
    notes=[(1,BLU,'The Account from the Edit window was saved (6100 Insurance).'), (2,RED,'The memo typed on the row ("ZZ inline memo 1") is gone. The row says "Add a memo".')])
b = panel(R+'T1-after-reload.png', crop=(232,780,1580,925), title=QA+': the same steps',
    boxes=[(907,801,1098,834,GRN,1), (691,873,1554,906,GRN,2)],
    notes=[(1,GRN,'The Account from the Edit window was saved (6100 Insurance).'), (2,GRN,'The memo typed on the row is kept ("ZZ inline memo 1").')])
stack([a, b]).save(O+'01-memo-in-flight-before-after.png')
c = panel(R+'PT3-tab2-after.png', crop=(232,440,1580,520), title=PROD+': a second tab set the Account to 5100, then the Edit window in the first tab saved a memo and payee',
    boxes=[(906,471,1098,504,RED,1)],
    notes=[(1,RED,'The Account the other tab saved (5100 Shop Supplies COGS) is wiped back to empty. No warning was shown; the Edit window just closed.')])
d = panel(R+'T2-banner.png', crop=(550,270,1072,720), title=QA+': the same steps',
    boxes=[(585,392,1015,464,GRN,1), (597,532,1005,632,GRN,2), (950,650,1019,692,BLU,3,'right')],
    notes=[(1,GRN,'"This transaction changed. Reload it before saving." with a Reload button. Nothing was saved over the other tab\'s Account.'),
           (2,GRN,'The memo and payee typed in the window are still there.'),
           (3,BLU,'Save is greyed out until Reload is pressed.')])
stack([c, d]).save(O+'02-other-tab-change-before-after.png')
panel(R+'T3a-row-locked-menu.png', crop=(232,665,1580,940), title='QA branch sv10360, 8 Oct 2026: a row whose own save was refused because another tab changed it first',
    boxes=[(1117,716,1314,776,BLU,1), (1358,738,1556,802,GRN,2)],
    notes=[(1,BLU,'The row shows "This transaction changed. Reload it before saving." with Reload.'), (2,GRN,'In the row\'s menu, Edit and Split are greyed out and do nothing until the row is reloaded.')]).save(O+'03-locked-row-menu.png')
for f in ['01-memo-in-flight-before-after','02-other-tab-change-before-after','03-locked-row-menu']: print(f, Image.open(O+f+'.png').size)
