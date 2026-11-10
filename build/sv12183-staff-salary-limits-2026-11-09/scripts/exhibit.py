import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN
E='/home/user/Manual-test-Cases/build/sv12183-staff-salary-limits-2026-11-09/ev/'
a=panel(E+'prod-PE1-neg-reopen.png',(400,140,1200,750),'BEFORE - production app.shopview.com (v26.45.2-107ad4b), 9 Nov 2026',
  [(808,336,1175,376,RED,1),(1059,688,1170,724,RED,2)],
  [(1,RED,'Hourly Rate -5 was saved and the window reopens showing $ -5.00.'),(2,RED,'Save & Close accepted it - nothing stops a negative pay rate.')])
b=panel(E+'branch-E1-neg.png',(400,130,1200,760),'AFTER - QA branch sv12183 (v26.45.2-ad81f0b), 9 Nov 2026',
  [(808,326,1175,388,GRN,1),(1059,698,1170,734,GRN,2)],
  [(1,GRN,'Typing -1 shows "Hourly rate cannot be lower than 0".'),(2,GRN,'Save & Close sends nothing and the window stays open.')])
stack([a,b]).save(E+'exhibits/01-before-after-negative-rate.png')
c=panel(E+'branch-N1-after-save.png',(400,130,1200,760),'Staff member saved at -5.00 before the fix (QA branch)',
  [(808,326,1175,388,GRN,1),(1059,698,1170,734,GRN,2)],
  [(1,GRN,'The old -5.00 is still shown, as agreed - it is not changed by itself.'),(2,GRN,'Save & Close is blocked until a valid rate is typed.')])
d=panel(E+'branch-N2-reopened.png',(400,130,1200,760),'Same staff member after typing 5 and saving',
  [(808,326,1175,388,GRN,1)],[(1,GRN,'Saved and reopens as $ 5.00.')])
stack([c,d]).save(E+'exhibits/02-existing-negative-rate.png')
