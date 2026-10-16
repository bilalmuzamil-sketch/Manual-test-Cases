# Second write, 16 Oct evening: make the 16 cases flagged by check_tester_runnable.py pass (Rule 115).
# (1) role line names the exact role and its permissions (the gate reads 'You are signed in with' as vague);
# (2) C368151, C590120: the "Source:" paragraph (requirement codes) moves from the preconditions into Expected, before the
#     build sentence, wording unchanged. Guard: ours, last written by this session's apply.py (updated_on read just before).
import json,sys,os,re,time
sys.path.insert(0,'/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D=os.path.dirname(os.path.abspath(__file__))
OLD='You are signed in with the "Admin" role at {Location-A}.'
NEW='You are signed in as an Admin user (the "Admin" role, which has Work orders &gt; View and Create &amp; Edit) at {Location-A}.'
IDS=[96945,97020,368150,368151,590110,590112,590114,590117,590119,590120,590122,590128,614711,614714,614716,614719]
MOVE={368151,590120}
write='--write' in sys.argv; log=open(f'{D}/write-log.txt','a') if write else None
for i in IDS:
    cur=L.call(f'get_case/{i}'); time.sleep(0.4)
    assert cur['created_by']==3,(i,'author')
    if cur['updated_by']!=3 or cur['updated_on']<1792177000: print(i,'SKIP not last written by this pass'); continue
    d={}; p=cur['custom_preconds']
    if p.count(OLD)==1: p=p.replace(OLD,NEW)
    e=cur['custom_expected']
    if i in MOVE:
        m=re.search(r'<p><strong>Source:</strong>.*?</p>',p,re.S); assert m,(i,'no source para')
        p=p[:m.start()]+p[m.end():]
        k=e.find('<p>Last checked against build'); assert k>0,(i,'no stamp')
        e=e[:k]+m.group(0)+e[k:]; d['custom_expected']=e
    if p!=cur['custom_preconds']: d['custom_preconds']=p
    if not d: print(i,'nothing to change'); continue
    if not write: print(i,'PREVIEW',sorted(d)); continue
    r=L.call(f'update_case/{i}',d); time.sleep(1)
    ok=all(r[f]==v for f,v in d.items()) and all(r[f]==cur[f] for f in ('title','custom_atmstatus','custom_steps'))
    line=f"{time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())} update_case C{i} atmstatus={cur['custom_atmstatus']} fields={sorted(d)} (role wording / source paragraph moved) verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line+'\n'); log.flush()
