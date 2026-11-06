import sys; sys.path.insert(0,'../testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
a=panel('ev/prod/list-sorted-asc.png',(276,80,1600,580),'BEFORE - production app.shopview.com (build v26.45.2-864113d), 6 Nov 2026. Clocked In sorted least first',
  [(318,190,1595,234,RED,1),(318,238,1595,522,BLU,2)],
  [(1,RED,'S2-1921 has a clock-in added by hand (ZZAUTOTEST N1 Tim 65732), yet it sorts FIRST, as if nobody were clocked in.'),
   (2,BLU,'These six rows show nobody in Clocked In but sort after it.')])
b=panel('ev/list/list-sorted-asc.png',(150,80,1600,625),'AFTER - QA branch sv12193 (build v26.45.2-7507c64), 6 Nov 2026. Clocked In sorted least first',
  [(200,190,1595,474,BLU,1),(200,526,1595,570,GRN,2),(200,574,1595,618,GRN,3)],
  [(1,BLU,'The six rows that show nobody come first.'),
   (2,GRN,'S12193-17588 has a clock-in added by hand (Andrew Wilkinson) and now sorts with the one-person rows.'),
   (3,GRN,'S12193-17581 shows two people (Debra Garcia +1), both added by hand, and sorts last.')])
stack([a,b]).save('ev/jira/sv12193-01-least-first-prod-vs-branch.png')
c=panel('ev/final/list-sorted-desc.png',(150,80,1600,764),'AFTER - QA branch sv12193 (build v26.45.2-7507c64), 6 Nov 2026. Clocked In sorted most first',
  [(200,190,1595,234,GRN,1),(200,238,1595,474,GRN,2),(200,526,1595,570,BLU,3)],
  [(1,GRN,'S12193-17581: two people, both added by hand, on top.'),
   (2,GRN,'One-person rows, both kinds: added by hand (S12193-17588) and moved here by Split work order (S12193-17592, -17593, -17594). S12193-17591 keeps the person still on its other line.'),
   (3,BLU,'S12193-17590 after its line was split off: shows nobody and sorts with the other rows that show nobody.')])
c.save('ev/jira/sv12193-02-most-first-branch.png')
