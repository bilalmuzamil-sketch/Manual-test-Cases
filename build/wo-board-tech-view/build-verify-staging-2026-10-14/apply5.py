# Read steps that named nothing to read (check_runnable_cases R4): name the field/column, as done for C96970.
# Step count, Expected and title unchanged. Guard: C581891 unchanged since re-read at 17:1x (its 17:06 source-note edit by the authoring session kept); C368131 still my apply4 state.
import json,sys,time
sys.path.insert(0,'/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
FIX={581891:[('Read its Technicians.','Read the names in its Technicians field.',2)],
     368131:[('Read the board again.',"Read which column {Work-order-2} is in and whether {Technician-C} still has a column.",1),
             ('<li>Read the pinned columns.</li>',"<li>Read the pinned columns right after Unassigned, including {Technician-B}'s column.</li>",1)]}
for i,reps in FIX.items():
    cur=L.call(f'get_case/{i}'); time.sleep(0.6)
    assert cur['created_by']==3 and cur['custom_atmstatus']!=3
    if i==581891: assert cur['updated_on']==json.load(open('/tmp/cln/docjob/wo3-C581891.json'))['updated_on'],'changed since read'
    else: assert 'change her Location from {Location-A} to {Location-B}' in cur['custom_steps'] and cur['custom_expected'].endswith('on 10/14/2026.</p><p>AUTOMATION: READY</p>')
    s=cur['custom_steps']
    for a,b,n in reps: assert s.count(a)==n,(i,a,s.count(a)); s=s.replace(a,b)
    r=L.call(f'update_case/{i}',{'custom_steps':s}); time.sleep(1)
    ok=r['custom_steps']==s and all(r[f]==cur[f] for f in ('custom_expected','custom_preconds','title','custom_atmstatus','custom_automation_type'))
    print(i,'OK' if ok else 'MISMATCH')
