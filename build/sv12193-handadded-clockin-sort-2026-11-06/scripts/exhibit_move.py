import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, RED, BLU
a=panel('ev/move-ticket/list-sorted-desc.png',crop=(0,130,1600,770),
 title='Work Orders > All, search S12193, sorted by Clocked In (most first) - after the time entry was moved from S12193-17584 to S12193-17585',
 boxes=[(1193,140,1316,188,BLU,1),(60,286,1560,330,RED,2),(60,478,1560,522,RED,3)],
 notes=[(1,BLU,'The list is sorted by the Clocked In column, most first: the two-person row, then one-person rows, then rows showing nobody.'),
        (2,RED,'S12193-17584 shows nobody under Clocked In, but it is still sorted with the one-person rows.'),
        (3,RED,'S12193-17585 shows Carol Ramos under Clocked In, but it is sorted with the rows that show nobody.')])
a.save('ev/jira-move/01-moved-entry-sort.png'); print(a.size)
