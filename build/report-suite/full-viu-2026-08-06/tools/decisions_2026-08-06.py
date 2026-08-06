# -*- coding: utf-8 -*-
"""The QA lead's three confirmed decisions, 2026-08-06:
   1. C38918 -> AUTOMATION: HOLD (the over-cap condition cannot be produced here)
   3. C30102 title corrected from 'eleven options' to nine
   (2. SV-8937 is a Jira edit, handled separately)"""
import sys, json, re
sys.path.insert(0,'/home/user/Manual-test-Cases/build/report-suite/full-viu-2026-08-06/tools')
sys.path.insert(0,'/tmp/testrail')
import writer, tr

log=[]

# ---- decision 1: C38918 becomes HOLD -------------------------------------
st,c=tr.get_case(38918)
exp=c['custom_expected']
KEEP = ("Why this test cannot be run here: the download has to be over the size limit before this "
        "message can appear, and no tab on this environment comes anywhere near it. On top of that, "
        "the Work In Progress download currently fails whenever the tab you are on has any rows in it "
        "at all - no file arrives and an error appears - which is a separate problem already reported "
        "here: https://shopview.atlassian.net/browse/SV-8907. So there is no way to reach the state "
        "this test is about. Leave the test as it is and move on.")
new = writer.rebuild(exp,
    marker='AUTOMATION: HOLD - the over-size refusal cannot be produced on this environment; no tab comes near the size limit',
    known=KEEP)
line = writer.write(38918, new, log=log)
print('C38918', line)
print('--- marker now:', [l for l in new.split('\n') if l.startswith('AUTOMATION:')])

# ---- decision 3: C30102 title -------------------------------------------
st,c=tr.get_case(30102)
OLD='Date range picker offers eleven options in the specified order'
NEW='Date range picker offers nine periods in the specified order, no All Time'
assert c['title']==OLD, repr(c['title'])
assert len(NEW)<=80, len(NEW)
payload={'title':NEW,
         'custom_preconds':c.get('custom_preconds') or '',
         'custom_steps':c.get('custom_steps') or '',
         'custom_expected':c.get('custom_expected') or ''}
st,vline,before,after=tr.update_case_verified(30102,payload,'update_case')
log.append({'cid':30102,'http':st,'verify':vline})
print('C30102', vline)
print('--- title now:', repr(after['title']), len(after['title']))
json.dump({'log':log},open('/tmp/rs3/write/decisions-oplog.json','w'),indent=1)
