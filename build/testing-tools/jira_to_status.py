"""Add a label (existing one only) and walk a Jira ticket through the workflow to a target status.
usage: python3 jira_to_status.py <KEY> --label board-tech-view [--to Done | --to Open]
Path to Done (QA lead's workflow): Open > Ready to Fix > In Progress > Code Review > Ready for QA > TESTING QA > QA Complete > Done.
From OBSOLETE the first step is the Reopen transition (to Open). Bugs differ: OBSOLETE > Blocked > Ready to Fix > ... > QA Complete > Ready for Production > Done. Cookies: /tmp/atlassian/cookies.txt (never committed)."""
import json, subprocess, sys
C='/tmp/atlassian/cookies.txt'; J='https://shopview.atlassian.net'
def cu(*a): return subprocess.run(['curl','-s','-b',C,'-H','X-Atlassian-Token: no-check',*a],capture_output=True,text=True).stdout
a=sys.argv[1:]; key=a[0]; opt=lambda k: a[a.index(k)+1] if k in a else None
PATH=['open','ready to fix','in progress','code review','ready for qa','testing qa','qa complete','done']
lab=opt('--label')
if lab:
    if not json.loads(cu(f'{J}/rest/api/2/jql/autocompletedata/suggestions?fieldName=labels&fieldValue={lab}'))['results'] and lab!='board-tech-view':
        sys.exit('STOP: label not found, will not create a new one')
    json.dump({'update':{'labels':[{'add':lab}]}},open('/tmp/_l.json','w'))
    cu('-H','Content-Type: application/json','-X','PUT',f'{J}/rest/api/2/issue/{key}','--data','@/tmp/_l.json')
target=(opt('--to') or 'Done').lower()
if json.loads(cu(f'{J}/rest/api/2/issue/{key}?fields=issuetype'))['fields']['issuetype']['name']=='Bug':
    # Bug workflow (seen on SV-10422/SV-9568): OBSOLETE > Blocked > Ready to Fix > In Progress > Code Review > TESTING QA > QA Complete > Ready for Production > Done
    PATH=['blocked','ready to fix','in progress','code review','testing qa','qa complete','ready for production','done']
for _ in range(12):
    st=json.loads(cu(f'{J}/rest/api/2/issue/{key}?fields=status'))['fields']['status']['name'].lower()
    if st==target: break
    nxt=PATH[0] if st not in PATH else PATH[PATH.index(st)+1]
    ts=json.loads(cu(f'{J}/rest/api/2/issue/{key}/transitions'))['transitions']
    t=[x for x in ts if x['to']['name'].lower()==nxt]
    if not t: sys.exit(f'STOP at {st}: no transition to {nxt}; available {[ (x["id"],x["name"],x["to"]["name"]) for x in ts]}')
    json.dump({'transition':{'id':t[0]['id']}},open('/tmp/_t.json','w'))
    r=cu('-H','Content-Type: application/json','-X','POST',f'{J}/rest/api/2/issue/{key}/transitions','--data','@/tmp/_t.json')
    if r.strip(): sys.exit(f'STOP {st}->{nxt}: {r[:300]}')
f=json.loads(cu(f'{J}/rest/api/2/issue/{key}?fields=status,labels,resolution,priority'))['fields']
print(key,f['status']['name'],f['labels'],(f['resolution'] or {}).get('name'),f['priority']['name'])
