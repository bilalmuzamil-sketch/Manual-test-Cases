import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack
R='#c62828'
crop=(340,52,1700,300)
a=panel('/tmp/qa8552/p8/D0.png',crop,"Sat, Oct 10 (shop closed), Day view, window 1700 px wide - as it opens",
  [(1667,124,1700,164,R,1)],[(1,R,"The 10 PM label is cut off at the right edge, and 11 PM is not on screen.")])
b=panel('/tmp/qa8552/p8/D1.png',crop,"Same day, scrolled to the right end",
  [(523,124,560,164,R,2)],[(2,R,"Now 12 AM is off the left edge. The 24 hours never fit on screen at once.")])
stack([a,b]).save('/home/user/Manual-test-Cases/build/sv8552-point4-recheck-2026-10-03/ev/D2-closed-day-24h-do-not-fit-hd.png')
