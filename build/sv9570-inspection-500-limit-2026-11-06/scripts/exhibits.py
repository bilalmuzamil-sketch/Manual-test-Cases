import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN
a=panel('ev/prod-prod-err-saveclick.png',crop=(0,60,1600,900),
 title='BEFORE - production (build v26.45.2-198e632): all 230 fields answered, then Save & Exit',
 boxes=[(16,160,220,200,RED,1),(1100,816,1500,892,RED,2)],
 notes=[(1,RED,'All 230 fields were answered (Pass) on a 230-field inspection.'),
        (2,RED,'Save & Exit shows "A maximum of 200 responses can be saved at once." and the page does not close.')])
b=panel('ev/prod-prod-err-reopen.png',crop=(0,60,1600,900),
 title='BEFORE - production: the same inspection opened again',
 boxes=[(16,160,220,200,RED,1),(16,280,220,730,RED,2)],
 notes=[(1,RED,'0 / 230 fields complete - every answer was lost.'),(2,RED,'Every section is back to 0/23.')])
c=panel('ev/branch-branch-pass230-reopen.png',crop=(0,60,1600,900),
 title='AFTER - QA branch sv9570 (build v26.45.2-b7be383): same 230-field template, all answered, Save & Exit, opened again',
 boxes=[(16,160,220,200,GRN,1),(16,280,220,730,GRN,2),(1456,72,1584,98,GRN,3)],
 notes=[(1,GRN,'230 / 230 fields complete after reopening.'),(2,GRN,'Every section shows 23/23.'),
        (3,GRN,'Save & Exit saved without an error and went back to the work order; "All changes saved".')])
stack([a,b,c]).save('ev/jira/01-save-230-before-after.png')
d=panel('ev/branch-bld450.png',crop=(0,560,1300,900),
 title='Template builder at 450 fields (QA branch)',
 boxes=[(36,858,144,892,GRN,1)],
 notes=[(1,GRN,'From 450 fields a counter appears under the outline: "450 / 500 fields".')])
e=panel('ev/branch-bld500.png',crop=(0,560,1300,900),
 title='Template builder at 500 fields (QA branch)',
 boxes=[(36,858,144,892,GRN,1),(400,846,700,870,GRN,2),(984,788,1126,866,GRN,3)],
 notes=[(1,GRN,'"500 / 500 fields".'),(2,GRN,'"+ Add Field" is greyed out with the hint "Templates can have up to 500 fields."'),
        (3,GRN,'The copy (duplicate) button is greyed out and shows the same hint. Clicking it adds nothing. Save Draft and Publish still worked at 500.')])
stack([d,e]).save('ev/jira/02-builder-450-500.png')
