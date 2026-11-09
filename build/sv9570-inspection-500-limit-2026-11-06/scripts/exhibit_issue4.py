import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED
from PIL import Image
O=(214,120,40)
a=panel('ev/branch-tpl-list.png',crop=(190,280,1590,850),title='QA branch sv9570: Settings > Inspection Templates - template "ZZAUTOTEST SV9570 449 Fields 2146" has 450 fields',
  boxes=[(274,630,1062,678,O,1)],notes=[(1,O,'Settings counts 450 fields for this template: 448 checkbox fields plus 2 Instructions blocks.')])
b=panel('ev/branch-instr-450.png',crop=(300,100,1600,800),title='The same template in the builder: one of the fields is an Instructions block',
  boxes=[(388,714,1068,776,O,1)],notes=[(1,O,'"S9 Item 49" is of type Instructions: read-only text shown to the technician, nothing to fill in.')])
c=panel('ev/branch-instr-filler.png',crop=(0,56,1440,760),title='The same template attached to a work order and opened: the inspection counts 448',
  boxes=[(12,158,180,200,O,1),(756,138,826,160,O,2)],notes=[(1,O,'"0 / 448 fields complete" - the Instructions blocks are not counted, so the number does not match the 450 in Settings.'),(2,O,'The heading also says 448 fields. This is the same kind of mismatch the customer reported (236 in Settings, 234 in the inspection).')])
stack([a,b,c]).save('ev/jira/03-issue4-450-vs-448.png'); print(Image.open('ev/jira/03-issue4-450-vs-448.png').size)
