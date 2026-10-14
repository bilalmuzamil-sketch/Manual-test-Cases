# Third set, staging build verification 14 Oct 2026 (QA lead: "More cases for the same testing suite to build verify on staging").
# Observed on staging v26.40.17-ddb9ba1 (probe/14-20). C581891 not written: only its source note changed since the first pass.
# C97010: re-stamp (was the Work Orders QA build v26.40.8-7a95011, 10/8/2026) to staging; nothing else changes.
# C368131: stamp + READY; on staging the Edit Staff Member "Location" field takes ONE location (q-select--single, probe/14
#   staff-location-menu.png) and its button is "Save & Close", so {Technician-C} is at {Location-A} and step 3 moves her to
#   {Location-B} (still "removed from this location"). Step count, Expected wording and title unchanged.
import json,sys,os,time
sys.path.insert(0,'/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D=os.path.dirname(os.path.abspath(__file__))
STAMP='<p>Last checked against build v26.40.17-ddb9ba1 (staging) on 10/14/2026.</p><p>AUTOMATION: READY</p>'
PRE={368131:[('is an active technician at {Location-A} and at a second location {Location-B} (for example Staging Light Duty), made for this case only.',
              'is an active technician whose Location (Settings &gt; Staff) is {Location-A}, made for this case only. {Location-B} is another location of the company (for example Staging Lethbridge - 4310).')]}
STEPS={368131:[("Click {Technician-C}'s edit icon, remove {Location-A} from her Location field (keep {Location-B}) and click Save.",
                "Click {Technician-C}'s edit icon, change her Location from {Location-A} to {Location-B} and click Save &amp; Close.")]}
write='--write' in sys.argv
for i in (97010,368131):
    snap=json.load(open(f'/tmp/cln/docjob/wo3-C{i}.json'))
    cur=L.call(f'get_case/{i}'); time.sleep(0.6)
    if cur['created_by']!=3 or cur['custom_atmstatus']==3: print(i,'SKIP author/automated'); continue
    if cur['updated_on']!=snap['updated_on']: print(i,'SKIP changed since read by',cur['updated_by']); continue
    e=cur['custom_expected']
    k=e.rfind('<p>Last checked') if 'Last checked' in e else e.rfind('<p>AUTOMATION:')
    assert k>0 and e.endswith('</p>') and '<p>AUTOMATION:' in e[k:]
    new_e=e[:k]+STAMP
    new_p=cur['custom_preconds']; new_s=cur['custom_steps']
    for a,b in PRE.get(i,[]): assert new_p.count(a)==1,(i,a); new_p=new_p.replace(a,b)
    for a,b in STEPS.get(i,[]): assert new_s.count(a)==1,(i,a); new_s=new_s.replace(a,b)
    json.dump(cur,open(f'{D}/before/C{i}-before.json','w'),indent=1)
    if not write: print(i,'PREVIEW ok | tail was:',e[k:][:110]); continue
    d={'custom_expected':new_e}
    if new_p!=cur['custom_preconds']: d['custom_preconds']=new_p
    if new_s!=cur['custom_steps']: d['custom_steps']=new_s
    r=L.call(f'update_case/{i}',d); time.sleep(1)
    ok=r['custom_expected']==new_e and r['custom_preconds']==new_p and r['custom_steps']==new_s and all(r[f]==cur[f] for f in ('title','custom_atmstatus','custom_automation_type'))
    print(i,'OK' if ok else 'MISMATCH')
