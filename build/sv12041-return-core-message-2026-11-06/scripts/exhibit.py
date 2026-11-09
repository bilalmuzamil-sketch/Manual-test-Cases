import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN
from PIL import Image
a=panel('ev/prod-p1-core-saved.png',crop=(280,80,1580,900),title='BEFORE - production (v26.45.2-864113d), 6 Nov 2026: part at 0, its core at 1, Save Return',
  boxes=[(880,198,1008,242,RED,1),(1098,830,1502,892,RED,2)],
  notes=[(1,RED,'Parts > Returns > Create Return: part 1238214 (A428) at 0, its core at 1.'),(2,RED,'"Each part with bin locations must have a return quantity greater than 0" - it does not say which part, and it does not say why the core cannot go back on its own.')])
b=panel('ev/branch-c1-core-saved.png',crop=(280,80,1580,900),title='AFTER - QA branch sv12041 (v26.45.2-11fd956), same case: part 895-PK at 0, its core at 1',
  boxes=[(880,217,1008,260,GRN,1),(1098,747,1502,892,GRN,2)],
  notes=[(1,GRN,'Part 895-PK (Battery Nut & Bolt) at 0, its core at 1, Save Return.'),(2,GRN,'The message names the part and explains why: "895-PK has a return quantity of 0, a core cannot be returned on its own ... Set a return quantity for the part, or remove it from this return." Nothing is saved.')])
c=panel('ev/branch-c2-nocore-saved.png',crop=(280,80,1580,900),title='AFTER - QA branch: a part without a core at 0',
  boxes=[(955,217,1082,260,GRN,1),(1098,830,1502,892,GRN,2)],
  notes=[(1,GRN,'Part P550848 (fuel/water separator) at 0, Save Return.'),(2,GRN,'"Enter a return quantity above 0 for P550848, or remove it from this return." Nothing is saved.')])
stack([a,b,c]).save('ev/jira/01-return-at-zero-before-after.png'); print(Image.open('ev/jira/01-return-at-zero-before-after.png').size)
