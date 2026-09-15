#!/usr/bin/env python3
"""File the two supplier findings the QA lead gave the go-ahead for on 15 September 2026.

Both were measured on BOTH versions before anything was written: the live product finds the supplier
by each field, the new version does not. The supplier's own record was read on both, so neither is a
case of an empty field.

Shape: Story Defect, parent SV-9163, priority Medium, same as the other Global Search reports; the
body is written afterwards by rewrite_to_standard.py so it lands in the approved layout with its
picture sized to span the description.
"""
import json, subprocess, sys
REPO='/home/user/Manual-test-Cases'
def sh(a): return subprocess.run(a,capture_output=True,text=True).stdout

TICKETS = [
 dict(summary="Global Search: a supplier cannot be found by their address line 2, although a customer can",
      key_name='address-2'),
 dict(summary="Global Search: a supplier cannot be found by their website address",
      key_name='website'),
]
out={}
for t in TICKETS:
    body={'fields':{'project':{'key':'SV'},'summary':t['summary'],
        'issuetype':{'name':'Story Defect'},'parent':{'key':'SV-9163'},
        'priority':{'name':'Medium'},
        'description':'Being written into the approved layout in the next step.'}}
    p=f"/tmp/new-{t['key_name']}.json"; json.dump(body,open(p,'w'))
    r=sh(['bash',f'{REPO}/build/atlassian-login/jira.sh','POST','/rest/api/2/issue',p])
    try:
        d,_=json.JSONDecoder().raw_decode(r)
        print(t['key_name'], '->', d.get('key'), d.get('errors') or '')
        out[t['key_name']]=d.get('key')
    except Exception:
        print(t['key_name'], 'FAILED', r[-300:])
json.dump(out,open(f'{REPO}/build/global-search/tickets-2026-09-14/NEW-DEFECTS.json','w'),indent=1)
