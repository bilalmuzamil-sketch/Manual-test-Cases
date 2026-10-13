# Build verification 13 Oct 2026 (QA lead: Ayesha says the held tests are built; "made Automation: Ready if they are
# ready for automation"). Observed on sv490 v26.40.8-754bd3a: grey "-" and the empty-chart outline (design row 15).
# Change ONLY the hold marker -> stamp + READY. Expected wording untouched.
import json,sys,os,time
sys.path.insert(0,'/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D=os.path.dirname(os.path.abspath(__file__))
OLD='<p>AUTOMATION: HOLD - not yet built (approved design 7 Oct 2026)</p>'
NEW='<p>Last checked against build v26.40.8-754bd3a on 10/13/2026.</p><p>AUTOMATION: READY</p>'
snap={x['id']:x for x in json.load(open('/tmp/cln/dash-live-1013.json'))}
write='--write' in sys.argv
for a in [x for x in sys.argv[1:] if x!='--write']:
    i=int(a); cur=L.call(f'get_case/{i}'); time.sleep(0.6)
    why=None
    if cur['created_by']!=3: why='not ours'
    elif cur['custom_atmstatus']==3 or cur['custom_automation_type']==1: why='Automated/E2E - needs QA lead'
    elif cur['updated_on']!=snap[i]['updated_on']: why=f'changed since snapshot by {cur["updated_by"]}'
    elif cur['custom_expected'].count(OLD)!=1 or not cur['custom_expected'].endswith(OLD): why='marker not as expected'
    if why: print(i,'SKIP',why); continue
    json.dump(cur,open(f'{D}/before/C{i}-before.json','w'),indent=1)
    new=cur['custom_expected'][:-len(OLD)]+NEW
    if not write: print(i,'PREVIEW ok'); continue
    r=L.call(f'update_case/{i}',{'custom_expected':new}); time.sleep(1)
    ok=r['custom_expected']==new and all(r[f]==cur[f] for f in ('custom_steps','custom_preconds','title','custom_atmstatus','custom_automation_type'))
    print(i,'OK' if ok else 'MISMATCH')
