# Build verification on STAGING, 14 Oct 2026 (QA lead: "BUILD VERIFY the test cases only, do not cross your lane").
# Every screen/label the steps use was observed on staging v26.40.17-ddb9ba1 (probe/). Changes: stamp + READY marker;
# Asset on Site named in the preconditions (a remembered "Asset on Site: Yes" choice hides work orders whose asset is not
# on site — it is a saved user choice, not a built-in default; probe/07, the filter definition has no default).
# Steps and Expected wording untouched. C368133 is Automated -> not changed (Rule 71).
import json,sys,os,time
sys.path.insert(0,'/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D=os.path.dirname(os.path.abspath(__file__))
STAMP='<p>Last checked against build v26.40.17-ddb9ba1 (staging) on 10/14/2026.</p><p>AUTOMATION: READY</p>'
AOS='Asset on Site shows no choice (if its chip shows Yes or No, click the x on the chip)'
PRE={
 154648:[('<li>On the Work Orders page nothing is ticked in the Status filter.</li>',f'<li>On the Work Orders page nothing is ticked in the Status filter and {AOS}.</li>')],
 581889:[('nothing is ticked in Status, Assigned to me is off and Search is empty.</li>',f'nothing is ticked in Status, {AOS}, Assigned to me is off and Search is empty.</li>')],
 581890:[('nothing is ticked in Status, Assigned to me is off and Search is empty.</li>',f'nothing is ticked in Status, {AOS}, Assigned to me is off and Search is empty.</li>')],
 96965:'append', 581891:'append'}
write='--write' in sys.argv
for i in (154648,96965,581889,581890,581891):
    snap=json.load(open(f'/tmp/cln/docjob/wo-C{i}.json'))
    cur=L.call(f'get_case/{i}'); time.sleep(0.6)
    if cur['created_by']!=3 or cur['custom_atmstatus']==3: print(i,'SKIP author/automated'); continue
    if cur['updated_on']!=snap['updated_on']: print(i,'SKIP changed since read by',cur['updated_by']); continue
    e=cur['custom_expected']; k=e.rfind('<p>AUTOMATION:'); assert k>0 and e.endswith('</p>') and 'Last checked' not in e
    new_e=e[:k]+STAMP
    p=cur['custom_preconds']
    if PRE[i]=='append':
        j=p.rfind('</ul>'); assert j>0 and p.count('</ul>')==1
        new_p=p[:j]+f'<li>On the Work Orders page, {AOS}.</li>'+p[j:]
    else:
        new_p=p
        for a,b in PRE[i]: assert new_p.count(a)==1,(i,a); new_p=new_p.replace(a,b)
    json.dump(cur,open(f'{D}/before/C{i}-before.json','w'),indent=1)
    if not write: print(i,'PREVIEW ok | marker was:',e[k:][:70]); continue
    r=L.call(f'update_case/{i}',{'custom_expected':new_e,'custom_preconds':new_p}); time.sleep(1)
    ok=r['custom_expected']==new_e and r['custom_preconds']==new_p and all(r[f]==cur[f] for f in ('custom_steps','title','custom_atmstatus','custom_automation_type'))
    print(i,'OK' if ok else 'MISMATCH')
