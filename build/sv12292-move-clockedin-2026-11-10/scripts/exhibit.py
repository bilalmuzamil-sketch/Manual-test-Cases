import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN
X1=1590
a=panel('ev/prod/list-sorted-desc.png',crop=(20,90,X1,390),
  title='BEFORE - production (app.shopview.com, build v26.45.3-fc08f23), 10 Nov 2026: Clocked In sorted most first',
  boxes=[(30,188,X1,236,RED,1),(30,284,X1,332,RED,2)],
  notes=[(1,RED,'S1-915 shows nobody in Clocked In, yet it is sorted first, as if one person were clocked in. The running entry was moved away from it.'),
         (2,RED,'S1-914 shows ZZAUTOTEST N4 Dee, yet it is sorted among the work orders with nobody. The entry was moved here.')])
b=panel('ev/branch/list-sorted-desc.png',crop=(20,90,X1,580),
  title='AFTER - QA branch sv12292 (build v26.45.2-6a8b89c), 10 Nov 2026: Clocked In sorted most first',
  boxes=[(30,284,X1,332,GRN,1),(30,380,X1,428,GRN,2)],
  notes=[(1,GRN,'S12292-17581 received the moved running entry (Michael Stephenson) and now sorts with the work orders that have one person.'),
         (2,GRN,'S12292-17580, which the entry left, shows nobody and now sorts with the empty work orders.')])
stack([a,b]).save('ev/exhibits/01-before-after-moved-entry-sort.png')
