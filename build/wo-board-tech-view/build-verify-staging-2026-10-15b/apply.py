# Seven cases the run session flagged ("the test's wording and staging disagree"), 15 Oct 2026. Lane: labels/routes/setup only.
# C96916, C96920, C97003: labels and routes observed on staging v26.40.17-a5c4210 (../build-verify-staging-2026-10-15/probe/,
#   02-board-view.png shows the six-dot grip on every technician column, none on Unassigned). "Build:" line -> staging; stamp
#   re-pointed to staging; C97003's review wording -> the staging "Mark as reviewed" window. Expected wording unchanged.
# C581895: I set READY on 14 Oct from labels alone; its setup (staff name differs from account name) cannot be made on staging
#   (claim-one-name.json, PROVED from the run session's committed evidence) -> READY replaced by a HOLD naming why.
# NOT written: C96973, C96978 (Automated — Rule 71; and their open questions are about the Expected, which is not this lane's),
#   C590125 (HOLD for the product owner).
import json,sys,os,time
sys.path.insert(0,'/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D=os.path.dirname(os.path.abspath(__file__))
OLD='<p>Last checked against build v26.40.8-7a95011 on 10/8/2026.</p>'
NEW='<p>Last checked against build v26.40.17-a5c4210 (staging) on 10/15/2026.</p>'
PLAN={
 96916:dict(pre=[('Build: the Work Orders QA build (sv10043, v26.40.8-7a95011).','Build: staging (https://app.staging.shopview.com), v26.40.17-a5c4210.')],exp=[(OLD,NEW)]),
 96920:dict(pre=[('Build: the Work Orders QA build (sv10043, v26.40.8-7a95011).','Build: staging (https://app.staging.shopview.com), v26.40.17-a5c4210.')],exp=[(OLD,NEW)]),
 97003:dict(pre=[('Build: the Work Orders QA build (sv10043).','Build: staging (https://app.staging.shopview.com), v26.40.17-a5c4210.'),
                 ('click Mark Reviewed, enter the VIN if asked and click Confirm Review','click the Finance tab and click Mark Reviewed; in the Mark as reviewed window fill Mileage or Engine Hours if asked and click Confirm review')],exp=[(OLD,NEW)]),
 581895:dict(pre=[],exp=[('<p>AUTOMATION: READY</p>','<p>AUTOMATION: HOLD - on staging a technician has only one name (renaming the staff record or the sign-in account renames both), so the two different names this case needs cannot be set up there</p>')]),
}
write='--write' in sys.argv
for i,pl in PLAN.items():
    snap=json.load(open(f'{D}/before/C{i}-before.json'))
    cur=L.call(f'get_case/{i}'); time.sleep(0.5)
    if cur['created_by']!=3 or cur['custom_atmstatus']==3: print(i,'SKIP author/automated'); continue
    if cur['updated_on']!=snap['updated_on']: print(i,'SKIP changed since read by',cur['updated_by']); continue
    p=cur['custom_preconds']; e=cur['custom_expected']
    for a,b in pl['pre']: assert p.count(a)==1,(i,a); p=p.replace(a,b)
    for a,b in pl['exp']: assert e.count(a)==1 and e.endswith('</p>'),(i,a); e=e.replace(a,b)
    assert e.endswith('</p>') and e.rfind('<p>AUTOMATION:')>e.rfind('Last checked')
    d={}
    if p!=cur['custom_preconds']: d['custom_preconds']=p
    if e!=cur['custom_expected']: d['custom_expected']=e
    if not write: print(i,'PREVIEW',sorted(d)); continue
    r=L.call(f'update_case/{i}',d); time.sleep(1)
    ok=all(r[f]==v for f,v in d.items()) and all(r[f]==cur[f] for f in ('title','custom_steps','custom_atmstatus','custom_automation_type'))
    print(i,'OK' if ok else 'MISMATCH',sorted(d))
