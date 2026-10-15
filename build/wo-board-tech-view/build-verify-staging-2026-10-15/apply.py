# WO Board & Tech View "Design — how it looks" (section 73780, run 498): build verification on STAGING, 15 Oct 2026.
# QA lead: "Lets do the build verification for the WO Dashboard and Tech view design test cases". Lane: labels/routes only.
# Observed on staging v26.40.17-a5c4210 (probe/): toolbar, Tech View headers + Column Selection list, Density, group headers
# (Collapse/Pin/grip), row More actions + locked note, Reassign dialog, empty search page, profile menu (Light/Dark).
# Changes: (1) every case: Asset on Site named in the "nothing is chosen in any filter" precondition (remembered chip choice);
# (2) steps: "column chooser" -> the on-screen "Column Selection" (C590110, C590113); "Sign out" -> initials > Logout (C590116);
# (3) stamp: the provenance's "Not yet checked against a build." -> "Last checked against build ... on 10/15/2026." + READY,
#     on 20 cases. NOT stamped: C590125 (HOLD, product owner decision) and C590127 (Technician filter not on this build —
#     claim-technician-filter.json, gate PROVED; Rule 69 marker may not overwrite a HOLD, so the QA lead decides).
# Expected wording otherwise unchanged; title/automation fields untouched.
import json,sys,os,time
sys.path.insert(0,'/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D=os.path.dirname(os.path.abspath(__file__))
BUILD='Last checked against build v26.40.17-a5c4210 (staging) on 10/15/2026.'
AOS=('nothing is chosen in any filter, Assigned to me is off','nothing is chosen in any filter (if the Asset on Site chip shows Yes or No, click the x on the chip), Assigned to me is off')
STEPS={590110:[('the column chooser button','the Column Selection button')],
       590113:[('Click the column chooser button.','Click the Column Selection button.'),('every other column the chooser offers','every other column the Column Selection list offers')],
       590116:[('Sign out and sign in as {User-B}.','Click your initials (top right) and click Logout, then sign in as {User-B}.')]}
NOSTAMP={590125,590127}
snap=json.load(open('/tmp/cln/docjob/wo4-all.json'))['cases']
write='--write' in sys.argv
for k in sorted(snap,key=int):
    i=int(k); cur=L.call(f'get_case/{i}'); time.sleep(0.5)
    if cur['created_by']!=3 or cur['custom_atmstatus']==3: print(i,'SKIP author/automated'); continue
    if cur['updated_on']!=snap[k]['updated_on']: print(i,'SKIP changed since read by',cur['updated_by']); continue
    p=cur['custom_preconds']; assert p.count(AOS[0])==1,(i,'aos'); new_p=p.replace(*AOS)
    s=cur['custom_steps']
    for a,b in STEPS.get(i,[]): assert s.count(a)==1,(i,a); s=s.replace(a,b)
    e=cur['custom_expected']
    if i not in NOSTAMP:
        assert e.count('Not yet checked against a build.')==1 and e.endswith('</p>')
        k2=e.rfind('<p>AUTOMATION:'); assert k2>0 and 'HOLD - not yet build-verified' in e[k2:]
        e=e.replace('Not yet checked against a build.',BUILD); k2=e.rfind('<p>AUTOMATION:'); e=e[:k2]+'<p>AUTOMATION: READY</p>'
    json.dump(cur,open(f'{D}/before/C{i}-before.json','w'),indent=1)
    d={}
    if new_p!=cur['custom_preconds']: d['custom_preconds']=new_p
    if s!=cur['custom_steps']: d['custom_steps']=s
    if e!=cur['custom_expected']: d['custom_expected']=e
    if not write: print(i,'PREVIEW fields:',sorted(d)); continue
    r=L.call(f'update_case/{i}',d); time.sleep(1)
    ok=all(r[f]==v for f,v in d.items()) and all(r[f]==cur[f] for f in ('title','custom_atmstatus','custom_automation_type')+tuple(x for x in ('custom_preconds','custom_steps','custom_expected') if x not in d))
    print(i,'OK' if ok else 'MISMATCH',sorted(d))
