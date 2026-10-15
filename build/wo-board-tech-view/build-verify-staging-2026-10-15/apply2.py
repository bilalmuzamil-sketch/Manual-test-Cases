# C590122 step 2 named nothing to look at (check_runnable_cases R4). Step count, Expected unchanged. Guard: my apply.py state.
import json,sys,time
sys.path.insert(0,'/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
cur=L.call('get_case/590122'); assert cur['created_by']==3 and 'Asset on Site chip' in cur['custom_preconds']
a="Look at {Technician-A}'s group."; b="Find {Technician-A}'s group header and look at the group under it."
s=cur['custom_steps']; assert s.count(a)==1; s=s.replace(a,b)
r=L.call('update_case/590122',{'custom_steps':s}); time.sleep(1)
print(590122,'OK' if r['custom_steps']==s and r['custom_expected']==cur['custom_expected'] else 'MISMATCH')
