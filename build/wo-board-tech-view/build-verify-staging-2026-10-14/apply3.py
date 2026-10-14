# C96970: two steps read "Read where {Work-order-2} is." with nothing to aim at (check_runnable_cases R4).
# Board View holds columns and Tech View holds groups (probe/), so name the thing to read. Step count and meaning unchanged.
import json,sys,time
sys.path.insert(0,'/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
cur=L.call('get_case/96970')
assert cur['created_by']==3 and cur['updated_by']==3 and cur['custom_atmstatus']!=3
s=cur['custom_steps']; old='Read where {Work-order-2} is.'
assert s.count(old)==2, s.count(old)
a=s.find(old); b=s.find(old,a+1)
new=s[:a]+'Read which column {Work-order-2} is in.'+s[a+len(old):b]+'Read which group {Work-order-2} is in.'+s[b+len(old):]
r=L.call('update_case/96970',{'custom_steps':new}); time.sleep(1)
ok=r['custom_steps']==new and all(r[f]==cur[f] for f in ('custom_expected','custom_preconds','title','custom_atmstatus','custom_automation_type'))
print(96970,'OK' if ok else 'MISMATCH')
