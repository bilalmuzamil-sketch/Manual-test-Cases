import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
# boxes in CSS px (captures are 1440x900 at dpr 2)
a = panel('ev/q1-darrell-column.png', crop=(470,130,1110,600),
    title='1. Board view: Darrell Martinez still has a column',
    boxes=[(729,201,1015,254,RED,1),(830,214,893,238,BLU,2)],
    notes=[(1,RED,'Darrell Martinez (shown as "D..") has his own column with 113 work orders.'),
           (2,BLU,'His column carries the grey "Inactive" label, so he is a deactivated technician.')])
b = panel('ev/q2-darrell-search.png', crop=(500,40,1160,460),
    title='2. Technician list: searching "Darrell" does not find him',
    boxes=[(806,122,1142,160,BLU,1),(806,176,1145,210,RED,2)],
    notes=[(1,BLU,'Typed "Darrell" in the Technician search box.'),
           (2,RED,'Only Darrell Thomas is listed. Darrell Martinez, who has a column, is missing.')])
c = panel('ev/q3-open-nothing-ticked.png', crop=(520,40,1160,640),
    title='3. Technician list just opened, nothing ticked',
    boxes=[(797,174,1149,545,GRN,1),(797,550,1149,605,RED,2)],
    notes=[(1,GRN,'Every box is empty: no technician has been ticked yet.'),
           (2,RED,'The red "50-value limit" message is already showing.')])
for n,p in (('01-deactivated-tech-missing',stack([a,b])),('02-limit-message-before-any-tick',c)):
    p.save(f'{n}.png'); print(n,p.size)
