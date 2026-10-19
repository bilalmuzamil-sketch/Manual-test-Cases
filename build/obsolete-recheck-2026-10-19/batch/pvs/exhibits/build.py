# Production vs Staging exhibits for the 8 obsolete tickets that behave the same on both (19 Oct 2026).
# Production build v26.40.19-d2441a9 (org Trucks Hill 2), Staging build v26.40.19-e435950. Boxes come from each environment's own capture JSON (CSS px).
import sys, json; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
from PIL import Image
E='/home/user/Manual-test-Cases/build/obsolete-recheck-2026-10-19/batch/pvs/ev/'; O='/home/user/Manual-test-Cases/build/obsolete-recheck-2026-10-19/batch/pvs/exhibits/'
P=json.load(open(E+'prod-all.json')); S={**json.load(open(E+'staging-11464_11118_11099_11120.json')),**json.load(open(E+'staging-11121_11107_11125_11124.json'))}
LAB={'prod':'PRODUCTION (build v26.40.19-d2441a9)','staging':'STAGING (build v26.40.19-e435950)'}
def R(r,pad=0): return (r['x']-pad,r['y']-pad,r['x']+r['w']+pad,r['y']+r['h']+pad)
def hstack(ps,gap=40):
    H=max(p.height for p in ps); out=Image.new('RGB',(sum(p.width for p in ps)+gap*(len(ps)-1),H),(255,255,255)); x=0
    for p in ps: out.paste(p,(x,0)); x+=p.width+gap
    return out
def pair(fn,crop,title,mk):
    ps=[]
    for env,D in [('prod',P),('staging',S)]:
        boxes,notes=mk(D); ps.append(panel(E+f'{env}-{fn}',crop,f'{LAB[env]}: {title}',boxes,notes))
    return stack(ps) if (crop[2]-crop[0])>700 else hstack(ps)
def save(img,name): img.save(O+name); print(name,img.width//2,img.height//2)
# SV-11464
def m464(t,w):
    def f(D):
        v=D['p'][t]; th=v['th']; last=v['pills'][-1]
        return [(th['x']+2,th['y'],th['x']+th['w']-2,last['y']+last['h']+6,BLU,1,'right')],[(1,BLU,f'Status column: every pill on this screen is {w} px wide.')]
    return f
save(stack([pair('11464-all.png',(0,125,560,480),'All tab',m464('all','113.98')),pair('11464-estimate.png',(0,125,560,480),'Estimates tab',m464('estimate','67.00'))]),'sv11464-production-vs-staging.png')
# SV-11118
def m118(D):
    t=D['t118']; return [(D['nav']['x'],D['nav']['y'],D['nav']['x']+D['nav']['w'],D['nav']['y']+D['nav']['h'],BLU,1),(*R(t['tab'],2)[:4],RED,2,'top'),(*R(t['atm'],2)[:4],RED,3,'top')],[(1,BLU,'Opened the link (Estimates tab, Assigned to me on), then clicked Work Orders in the top menu.'),(2,RED,'Estimates is still the selected tab.'),(3,RED,'Assigned to me is still on.')]
save(pair('11118-after-topmenu.png',(0,0,1080,135),'after clicking Work Orders in the top menu',m118),'sv11118-production-vs-staging.png')
# SV-11099
def m099(D):
    t=D['t099']; return [(*R(t['msg'],6)[:4],BLU,1)],[(1,BLU,'"No work orders match the search "ZZNOMATCH123"." with no button.')]
save(pair('11099-search.png',(330,100,1110,560),'List, search ZZNOMATCH123',m099),'sv11099-production-vs-staging.png')
# SV-11120
def m120(D):
    t=D['t120']; return [(*R(t['lead'],4)[:4],RED,1,'right')],[(1,RED,f"Paid work order {t['n']}: Lead technician is shown as plain text, and it cannot be changed.")]
save(pair('11120-paid.png',(0,70,420,450),'Paid work order page',m120),'sv11120-production-vs-staging.png')
# SV-11121
def m121(D):
    t=D['t121']; return [(*R(t['head'],6)[:4],BLU,1)],[(1,BLU,'The Imported work order opens as its invoice. There is no Lead technician anywhere on the page.')]
save(pair('11121-imported.png',(380,60,1330,700),'Imported work order ZZAUTOTEST-IMP-001',m121),'sv11121-production-vs-staging.png')
# SV-11107
def m107e(D):
    r=D['t107']['roster']; a,b=r[0],r[1]; first,second=('Technician 1','Ayesha Khan') if D is P else ('Aaron Baker','Aaron Zed')
    return [(a['x']-3,a['y']-4,b['x']+b['w']+3,b['y']+b['h']+4,BLU,1,'right')],[(1,BLU,f"Two technicians on the line: {first} was added first, then {second}.")]
def m107a(D):
    r=D['t107']['audit']; return [(r[0]['x'],r[0]['y'],r[0]['x']+r[0]['w'],r[0]['y']+r[0]['h'],GRN,1),(r[1]['x'],r[1]['y'],r[1]['x']+r[1]['w'],r[1]['y']+r[1]['h'],BLU,2)],[(1,GRN,'Adding the first technician is recorded: "Line tech changed, Tech: - → name".'),(2,BLU,'"Line created". There is no entry for the second technician.')]
save(stack([pair('11107-edit-line.png',(400,160,1040,730),'Edit Line',m107e),pair('11107-audit.png',(110,330,1330,560),'the line\'s Audit log',m107a)]),'sv11107-production-vs-staging.png')
# SV-11125
def m125a(D):
    b=D['t125']['before']; return [(*R(b['credits'],3)[:4],BLU,1,'right'),(*R(b['chip'],3)[:4],BLU,2)],[(1,BLU,'Credits tab selected.'),(2,BLU,'Date filter set to 60 days.')]
def m125b(D):
    a=D['t125']['after']; return [(*R(a['returns'],3)[:4],RED,3)],[(3,RED,'After a reload the page opens on the Returns tab (clicking Credits again shows 60 days is kept).')]
save(stack([pair('11125-1-credits-60.png',(160,60,1260,135),'Parts > Returns, before reload',m125a),pair('11125-2-reloaded.png',(160,60,1260,135),'after reloading the page',m125b)]),'sv11125-production-vs-staging.png')
# SV-11124
def m124(D):
    h=D['t124']['head']; return [(h['x'],h['y'],min(h['x']+h['w'],1430),h['y']+h['h'],BLU,1)],[(1,BLU,'Staff list columns: First Name, Last Name, Email, Job Title, Role, Department(S), Created, Confirmed Invitation, Billable. There is no photo column.')]
save(pair('11124-staff.png',(240,170,1440,420),'Settings > Staff',m124),'sv11124-production-vs-staging.png')
