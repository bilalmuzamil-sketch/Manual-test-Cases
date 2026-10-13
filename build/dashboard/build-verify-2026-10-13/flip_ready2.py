# Build verification 13 Oct 2026 (QA lead: Ayesha says the held tests are built; "made Automation: Ready if they are
# ready for automation"). Observed on sv490 v26.40.8-754bd3a: grey "-" and the empty-chart outline (design row 15).
# Second set (QA lead: work on tests held when they should not be): the 12 'not yet build-verified' tests; their
# screens were observed on this build (probe/07-11). C351704 step 2 reworded to the Issue Credit window's own labels
# (step count unchanged). Expected wording untouched.
import json,sys,os,time
sys.path.insert(0,'/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D=os.path.dirname(os.path.abspath(__file__))
OLD='<p>AUTOMATION: HOLD - not yet build-verified</p>'
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
    payload={'custom_expected':new}
    if i==351704:
        a='<li>Pick the part to return (e.g. the $160.00 part), choose Store Credit and submit.</li>'
        b='<li>In the Issue Credit window, under Parts to return pick the part (e.g. the $160.00 part) and keep Parts are being returned ticked; under Outcome choose Issue Store Credit; click Issue Credit.</li>'
        assert cur['custom_steps'].count(a)==1; payload['custom_steps']=cur['custom_steps'].replace(a,b)
    if not write: print(i,'PREVIEW ok'); continue
    r=L.call(f'update_case/{i}',payload); time.sleep(1)
    ok=all(r[f]==payload[f] for f in payload) and all(r[f]==cur[f] for f in ('custom_steps','custom_preconds','title','custom_atmstatus','custom_automation_type') if f not in payload) and r['custom_steps'].count('<li>')==cur['custom_steps'].count('<li>')
    print(i,'OK' if ok else 'MISMATCH')
