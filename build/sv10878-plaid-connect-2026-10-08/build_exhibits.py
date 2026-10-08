"""SV-10878 exhibits (8 Oct 2026). Run from this folder: python3 build_exhibits.py"""
import sys
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
from PIL import Image, ImageDraw
R = 'ev/raw/'; O = 'ev/'
def side(a, b, gap=60):
    H = max(a.height, b.height); out = Image.new('RGB', (a.width+gap+b.width, H), (255,255,255))
    out.paste(a, (0,0)); out.paste(b, (a.width+gap, 0)); d = ImageDraw.Draw(out)
    x = a.width+gap//2; d.line([x, 20, x, H-20], fill=(200,205,215), width=4); return out
B = 'QA branch sv10360, build v26.40.8-3e5c1df, 8 Oct 2026'
panel(R+'M-A2.png', crop=(232,232,904,632), title=f'1. Each row hides what another row already picked ({B})',
      boxes=[(291,330,873,370,BLU,1), (291,530,873,624,GRN,2)],
      notes=[(1,BLU,'Plaid Checking is set to 1000 Checking Account.'),
             (2,GRN,"Plaid Saving's list now offers only 1010 Savings Account and 2300 Credit Card Payable. 1000 Checking Account is no longer offered.")]).save(O+'01-picker-hides-picked-account.png')
panel(R+'M-B2.png', crop=(232,232,904,576), title=f'2. Picking the same account twice is stopped on the row ({B})',
      boxes=[(291,330,873,370,BLU,1), (291,488,873,552,RED,2)],
      notes=[(1,BLU,'Plaid Checking: 1000 Checking Account.'),
             (2,RED,'Plaid Saving was set to 1000 Checking Account while its row was unticked. Ticking it back shows "This chart account is already picked for another account." and Connect stays greyed out until it is changed.')]).save(O+'02-same-account-twice-stopped.png')
a = panel(R+'M2-F1.png', crop=(232,136,904,576), title='3a. Connect pressed: 1010 Savings Account was linked to another bank account in a second tab',
      boxes=[(250,238,890,272,RED,1), (291,382,873,444,RED,2)],
      notes=[(1,RED,'"Some accounts could not be connected. See the messages below." No error page, no crash.'),
             (2,RED,'The reason sits on the row that caused it: "That chart account already belongs to another bank account." Bank accounts list unchanged (still 2).')])
b = panel(R+'M2-G1.png', crop=(232,80,904,200), title='3b. Same screen, Plaid Checking switched to "Create a chart account automatically", Connect pressed again',
      boxes=[(250,90,890,146,GRN,1)],
      notes=[(1,GRN,'Connected straight away without signing in to the bank again: "Connected 2 accounts at First Platypus Bank. 26 transactions imported". The failed try used nothing up.')])
stack([a, b]).save(O+'03-refused-then-retry.png')
p = panel(R+'Q-1-picker.png', crop=(232,376,904,576), title='4a. Plaid connect: "Existing account" list',
      boxes=[(291,516,873,562,GRN,1)], notes=[(1,GRN,'Only 1091 ZZAUTOTEST SV-10878 active bank. 1090 ZZAUTOTEST SV-10878 inactive bank (made inactive) is not offered.')])
m = panel(R+'P-manual.png', crop=(515,224,1060,768), title='4b. Bank Accounts > Add account: "Existing account" list',
      boxes=[(585,686,1015,730,GRN,1)], notes=[(1,GRN,'Only 1091 ZZAUTOTEST SV-10878 active bank. 1090 ZZAUTOTEST SV-10878 inactive bank (made inactive) is not offered.')])
stack([side(p, m)]).save(O+'04-plaid-and-manual-offer-the-same.png')
for f in ['01-picker-hides-picked-account','02-same-account-twice-stopped','03-refused-then-retry','04-plaid-and-manual-offer-the-same']:
    print(f, Image.open(O+f+'.png').size)
def banner(src, title, col, n, text):
    return panel(R+src, crop=(205,72,1590,190), title=title, boxes=[(250,145,1570,180,col,n)], notes=[(n,col,text)])
s0 = banner('Z-sync-0.png', '5a. Transactions > Sync now, BEFORE the refused connect', BLU, 1, 'Sync started for 5 bank connections (the 5 bank sign-ins I had connected so far).')
rf = panel(R+'Z-refused.png', crop=(232,136,904,576), title='5b. Connect refused: 1094 was linked to a manual bank account in another tab',
      boxes=[(250,238,890,272,RED,2), (291,382,873,444,RED,3)],
      notes=[(2,RED,'"Some accounts could not be connected."'), (3,RED,'"That chart account already belongs to another bank account."')])
s1 = banner('Z-sync-1.png', '5c. Sync now again, right AFTER the refused connect', GRN, 4, 'Still 5 bank connections. The refused attempt saved no bank connection.')
s2 = banner('Z-sync-2.png', '5d. Row switched to "Create a chart account automatically", Connect pressed ("Connected 1 account"), then Sync now', GRN, 5, '6 bank connections: only the successful connect added one.')
stack([s0, s1, s2]).save(O+'05a-connection-count.png')
rf.save(O+'05b-refused-row.png')
for f in ['05a-connection-count','05b-refused-row']: print(f, Image.open(O+f+'.png').size)
