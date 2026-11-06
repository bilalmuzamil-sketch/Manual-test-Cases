# SV-12214 Jira exhibits from the 6 Nov 2026 walk (branch sv12214 v26.45.2-aa4c767 vs production v26.45.1-753355c)
import sys; sys.path.insert(0,'../testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
P='Production app.shopview.com (build v26.45.1-753355c), 6 Nov 2026'
B='QA branch sv12214 (build v26.45.2-aa4c767), 6 Nov 2026'
# 1. reverse-blocked tooltip
a=panel('ev/prod-RC-9-reverse-tooltip.png',(560,80,1600,330),'BEFORE (current Quasar) - '+P,
  [(1470,140,1572,176,BLU,1),(768,192,1600,250,GRN,2)],
  [(1,BLU,'Invoice menu (three dots, top right): Reverse is greyed out because a credit was used.'),
   (2,GRN,'Hovering Reverse shows the reason: "Credit CM-4409 ($10.00) has been applied..."')])
b=panel('ev/branch-RC-9-reverse-tooltip.png',(560,80,1600,330),'AFTER (Quasar 2.35) - '+B,
  [(1470,140,1572,176,BLU,1),(768,192,1600,230,GRN,2)],
  [(1,BLU,'Same: Reverse is greyed out.'),
   (2,GRN,'Same reason shows, on screen and readable: "Credit CM-4189 ($10.00) has been applied..."')])
stack([a,b]).save('ev/jira/sv12214-01-reverse-tooltip-prod-vs-branch.png')
# 2. schedule booking hover box
a=panel('ev/prod-S4b-1.png',(700,290,1350,730),'BEFORE (current Quasar) - '+P,
  [(715,300,1340,370,BLU,1),(880,383,1174,720,GRN,2)],
  [(1,BLU,'Schedule, Day view: a booking.'),(2,GRN,'Moving the mouse over it shows the details box next to it.')])
b=panel('ev/branch-S4b-1.png',(560,480,1210,820),'AFTER (Quasar 2.35) - '+B,
  [(624,490,1600,560,BLU,1),(635,563,929,811,GRN,2)],
  [(1,BLU,'Schedule, Day view: a booking (ZZAUTOTEST SV12214 35888, Brandi Smith).'),(2,GRN,'Same: the details box opens right under it, fully on screen.')])
stack([a,b]).save('ev/jira/sv12214-02-schedule-hover-prod-vs-branch.png')
# 3. Columns menu role (comparison only)
a=panel('ev/prod-L1-list-columns.png',(1040,80,1600,720),'Production (current Quasar) - Work Orders > Columns menu',
  [(1081,119,1289,704,GRN,1)],[(1,GRN,'Comparison only (read with the browser developer tools, not a ShopView feature): this menu is marked as a menu (role="menu").')])
b=panel('ev/branch-L1-list-columns.png',(1040,80,1600,720),'QA branch sv12214 (Quasar 2.35) - same Columns menu',
  [(1081,119,1289,704,RED,1)],[(1,RED,'Looks and works the same, but the "menu" marking (role="menu") is missing. Screen readers and tests that find menus by role no longer see it.')])
stack([a,b]).save('ev/jira/sv12214-03-columns-menu-role.png')
