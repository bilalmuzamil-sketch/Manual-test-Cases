import sys; sys.path.insert(0,'../testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
P='Production app.shopview.com (build v26.45.1-753355c)'; S='Staging app.staging.shopview.com (build v26.45.2-9e313a5), 6 Nov 2026'
a=panel('ev/prod-RC-9-reverse-tooltip.png',(560,80,1600,330),'BEFORE (current Quasar) - '+P,
  [(1470,140,1572,176,BLU,1),(768,192,1600,250,GRN,2)],
  [(1,BLU,'Invoice menu (three dots, top right): Reverse is greyed out because a credit was used.'),(2,GRN,'Hovering Reverse shows the reason.')])
b=panel('ev/staging-RC-9-reverse-tooltip.png',(560,80,1600,330),'AFTER (Quasar 2.35) - '+S,
  [(1470,140,1572,176,BLU,1),(768,192,1600,230,GRN,2)],
  [(1,BLU,'Same: Reverse is greyed out.'),(2,GRN,'Same reason shows, on screen and readable: "Credit CM-4536 ($10.00) has been applied..."')])
stack([a,b]).save('ev/jira/sv12214-s1-reverse-tooltip-prod-vs-staging.png')
a=panel('ev/prod-L1-list-columns.png',(1040,80,1600,720),'Production (current Quasar) - Work Orders > Columns menu',
  [(1081,119,1289,704,GRN,1)],[(1,GRN,'Comparison only (read with the browser developer tools, not a ShopView feature): this menu is marked as a menu (role="menu").')])
b=panel('ev/staging-L1-list-columns.png',(1040,80,1600,720),'Staging (Quasar 2.35) - same Columns menu, 6 Nov 2026',
  [(1081,119,1289,704,RED,1)],[(1,RED,'Looks and works the same, but the "menu" marking (role="menu") is still missing on staging.')])
stack([a,b]).save('ev/jira/sv12214-s2-columns-menu-role-prod-vs-staging.png')
