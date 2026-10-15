# C96920 (QA lead 15 Oct: "DO whats scientific and logical and best"). The source is about a FAILED SAVE:
#   S1-N3 "A failed preference save retains the previously saved preference." S1-N4 "A failed preference save does not
#   prevent view switching or retrying the save." (PRD 845185030 v52, read 15 Oct). Turning the network off also stops the
#   browser fetching a display it has not opened yet in this page (the run session saw "Something went wrong loading this
#   section" in a fresh browser) — a second variable the source does not speak about. Controlled fix: after the refresh,
#   open Tech View and List once and come back to Board View BEFORE going offline, so offline only the save can fail.
#   The saved choice is still Board View when the network goes off, so the Expected (unchanged) still holds.
import json,sys,time
sys.path.insert(0,'/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
cur=L.call('get_case/96920')
assert cur['created_by']==3 and cur['custom_atmstatus']!=3 and 'v26.40.17-a5c4210 (staging) on 10/15/2026' in cur['custom_expected']
s=cur['custom_steps']
anchor='<li>Turn your network connection off.</li>'
assert s.count(anchor)==1
new='<li>Click Tech View, then List, then Board View in the display switcher, and wait until each has shown its work orders (this loads every display while online, so that offline only the saving of your choice can fail).</li>'
s=s.replace(anchor,new+anchor)
r=L.call('update_case/96920',{'custom_steps':s}); time.sleep(1)
print(96920,'OK' if r['custom_steps']==s and r['custom_expected']==cur['custom_expected'] and r['custom_preconds']==cur['custom_preconds'] else 'MISMATCH')
