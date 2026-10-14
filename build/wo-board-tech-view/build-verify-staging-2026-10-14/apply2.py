# Second set, staging build verification 14 Oct 2026 (QA lead: "Lets Build verify them on staging now").
# Every screen/label the preconditions and steps use was observed on staging v26.40.17-ddb9ba1 (probe/10-13).
# Changes: stamp + READY marker on six cases; two precondition wording fixes to match the build:
#   C581895 Board View "Fields to display" item reads "Lead technician" (probe/10-new-labels.json);
#   C581896 example site address is now staging. Steps and Expected wording untouched.
# C368133 and C96965 are not written: after the first pass only their source block changed (PRD v49), stamp still current.
import json,sys,os,time
sys.path.insert(0,'/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D=os.path.dirname(os.path.abspath(__file__))
STAMP='<p>Last checked against build v26.40.17-ddb9ba1 (staging) on 10/14/2026.</p><p>AUTOMATION: READY</p>'
PRE={581895:[('Fields to display has Lead technician name and Line technicians','Fields to display has Lead technician and Line technicians')],
     581896:[('(for example https://sv10043.qa.shopview.com)','(for example https://app.staging.shopview.com)')]}
write='--write' in sys.argv
os.makedirs(f'{D}/before',exist_ok=True)
for i in (96970,581892,581893,581894,581895,581896):
    snap=json.load(open(f'/tmp/cln/docjob/wo2-C{i}.json'))
    cur=L.call(f'get_case/{i}'); time.sleep(0.6)
    if cur['created_by']!=3 or cur['custom_atmstatus']==3: print(i,'SKIP author/automated'); continue
    if cur['updated_on']!=snap['updated_on']: print(i,'SKIP changed since read by',cur['updated_by']); continue
    e=cur['custom_expected']; k=e.rfind('<p>AUTOMATION:'); assert k>0 and e.endswith('</p>') and 'Last checked' not in e
    new_e=e[:k]+STAMP
    new_p=cur['custom_preconds']
    for a,b in PRE.get(i,[]): assert new_p.count(a)==1,(i,a); new_p=new_p.replace(a,b)
    json.dump(cur,open(f'{D}/before/C{i}-before.json','w'),indent=1)
    if not write: print(i,'PREVIEW ok | marker was:',e[k:][:80],'| preconds changed:',new_p!=cur['custom_preconds']); continue
    d={'custom_expected':new_e}
    if new_p!=cur['custom_preconds']: d['custom_preconds']=new_p
    r=L.call(f'update_case/{i}',d); time.sleep(1)
    ok=r['custom_expected']==new_e and r['custom_preconds']==new_p and all(r[f]==cur[f] for f in ('custom_steps','title','custom_atmstatus','custom_automation_type'))
    print(i,'OK' if ok else 'MISMATCH')
