import sys, json; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN
N={v:json.load(open(f'data/{v}.json'))['number'] for v in ['v3','v4','v5']}
R=lambda v:json.load(open(f'ev/{v}-final2x.rects.json'))
def lab(r,t,y0,y1): return [l for l in r['labels'] if l['t']==t and y0<l['y']<y1 and l['x']>400][0]
def grp(r,names,y0,y1):
  ls=[lab(r,n,y0,y1) for n in names]; return (min(l['x'] for l in ls)-6,min(l['y'] for l in ls)-4,max(l['x']+l['w'] for l in ls)+20,max(l['y']+l['h'] for l in ls)+4)
r=R('v3'); b=grp(r,['David Combs','Admin ShopView','Tech ShopView'],380,560)
p3=panel('ev/v3-final2x.png',(380,345,1420,560),f'Two technicians moved at once - work order {N["v3"]}, line 2',[(*b,GRN,1)],
 [(1,GRN,'Tech ShopView (claimed with Start) and David Combs were moved here together with Move labor, then Tech ShopView\'s time was moved to line 3. No empty row was left. Admin ShopView then clocked in on this line and got his own new row.')])
r=R('v4'); u=lab(r,'Unassigned',230,330)
p4=panel('ev/v4-final2x.png',(380,180,1420,345),f'Unchanged behaviour: a claimed row that was NOT moved - work order {N["v4"]}, line 1',[(u['x']-6,u['y']-4,u['x']+u['w']+20,u['y']+u['h']+4,GRN,1)],
 [(1,GRN,'Tech ShopView pressed Start on this empty line, then his time was moved to line 3 in the timesheet. The line gets its empty row back, as before (SV-11087). This still works.')])
r=R('v5'); b=grp(r,['David Combs','Tech ShopView'],380,540)
p5=panel('ev/v5-final2x.png',(380,345,1420,525),f'Comparison: a row picked on purpose in Edit labor - work order {N["v5"]}, line 2',[(*b,GRN,1)],
 [(1,GRN,'Tech ShopView was picked in Edit labor (not claimed), moved here with Move labor, then his time was moved off. The line ends up exactly like the claimed row in the first picture (S11253-17586): his row stays (0.00 h), no empty row.')])
stack([p3,p4,p5]).save('ev/02-other-variants.png'); print('ok')
