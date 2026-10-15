# C96973 (AUTOMATED) — QA lead 15 Oct: "Follow the requirements" (yes to the Rule-106 correction in
# ../source-verify-2026-10-15/C96973-RECONCILIATION.md). Expected corrected BACK to PRD 845185030 v52 (read 15 Oct):
# S4-E8, S3-N1, S1-N1a quoted; source line re-dated; stamp -> staging (steps' labels seen there 14-15 Oct). Tell Vlad (Rule 65).
import json,sys,time,re
sys.path.insert(0,'/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
snap=json.load(open('build/wo-board-tech-view/build-verify-staging-2026-10-15b/before/C96973-before.json'))
cur=L.call('get_case/96973')
assert cur['created_by']==3 and cur['updated_on']==snap['updated_on'], 'changed since read'
e=cur['custom_expected']
R=[('<li>After the change the work order no longer matches Assigned to me and disappears from the board without a reload (your column count goes from 1 to 0).</li>',
    '<li>After the change the work order no longer matches Assigned to me and disappears from the board without a reload. With none of your work orders left, your column is hidden and the board shows &ldquo;No work orders match these filters&rdquo;, then &ldquo;Try removing a filter to widen your results.&rdquo;, with a Clear all filters button.</li>'),
   ('PRD Confluence 845185030, edited 7 Oct 2026 (status line "PRD v33"), S4-E4, S4-E8, read 8 Oct 2026. Assigned to me behaviour S1-R13 / S3-N1. Source-verified 8 October 2026.',
    'PRD Confluence 845185030, version 52 (14 Oct 2026, Chris Ward), S4-E4, S4-E8, S3-N1 and S1-N1a, read 15 Oct 2026. Assigned to me behaviour S1-R13 / S3-N1. Source-verified 15 October 2026; the expected result was corrected that day to the PRD (the earlier "column count goes from 1 to 0" was not in the source).'),
   ('<p>Last checked against build v26.40.8-7a95011 on 10/8/2026.</p>','<p>Last checked against build v26.40.17-a5c4210 (staging) on 10/15/2026.</p>')]
for a,b in R: assert e.count(a)==1,(a[:60],e.count(a)); e=e.replace(a,b)
m=re.search(r'(<li><strong>S4-E8:</strong>.*?</li>)',e); assert m
add=('<li><strong>S3-N1:</strong> &ldquo;With Assigned to me enabled, Board View shows only the technician columns, including Unassigned, that hold at least one work order matching Assigned to me (S1-R13). Every other column is hidden, including pinned technicians.&rdquo;</li>'
     '<li><strong>S1-N1a:</strong> &ldquo;With filters active, with or without a search, the empty state reads &ldquo;No work orders match these filters&rdquo;, then &ldquo;Try removing a filter to widen your results.&rdquo;, with a Clear all filters button.&rdquo;</li>')
e=e[:m.end()]+add+e[m.end():]
assert e.endswith('<p>AUTOMATION: READY</p>')
r=L.call('update_case/96973',{'custom_expected':e}); time.sleep(1)
print(96973,'OK' if r['custom_expected']==e and all(r[f]==cur[f] for f in ('custom_steps','custom_preconds','title','custom_atmstatus','custom_automation_type')) else 'MISMATCH')
