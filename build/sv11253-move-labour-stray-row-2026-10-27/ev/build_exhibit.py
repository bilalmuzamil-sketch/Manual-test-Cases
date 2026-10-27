import sys, json; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN
P=json.load(open('ev/prod-8-stray-row-2x.rects.json')); B=json.load(open('ev/v6-lines-after-ts.rects.json'))
lab=lambda R,t,ymin,ymax:[l for l in R['labels'] if l['t']==t and ymin<l['y']<ymax][0]
# production: line 2 spans y 360..560
d=lab(P,'Deleted user',400,560); a=lab(P,'Ayesha Test',400,560)
before=panel('ev/prod-8-stray-row-2x.png',(380,350,1420,560),
  'BEFORE - production (app.shopview.com), work order S2-1763, line 2, captured 27 Oct 2026',
  [(d['x']-6,d['y']-4,d['x']+d['w']+20,d['y']+d['h']+4,RED,1)],
  [(1,RED,'After Bilal Muzammil\'s time was moved off this line, an extra empty labour row was left here, shown as "Deleted user". The next technician who clocks in on this line would be given it.')])
t=lab(B,'Tech ShopView',380,540); c=lab(B,'David Combs',380,540)
after=panel('ev/v6-lines-after-ts.png',(380,345,1420,525),
  'AFTER - QA branch sv11253 (build v26.43.1-baa44e3), work order S11253-17586, line 2, captured 27 Oct 2026',
  [(t['x']-6,t['y']-4,c['x']+max(t['w'],c['w'])+20,c['y']+c['h']+4,GRN,1)],
  [(1,GRN,'Same steps. After Tech ShopView\'s time was moved off this line, his row stays with him (0.00 h) next to David Combs. No empty row and no "Deleted user" row is left behind.')])
stack([before,after]).save('ev/01-before-after-stray-row.png'); print('ok')
