#!/usr/bin/env python3
"""Re-file the eight Global Search tickets as STORY DEFECTS under their owning story.

The QA lead asked for Story Defects attached to the stories of epic SV-9160. A Task cannot be
converted: Story Defect is a sub-task type, and Jira rejects the change over REST
("Issue type is a sub-task but parent issue key or id not specified", then a project mismatch).
So each is re-created with parent = the owning story, and the original Task is marked OBSOLETE
with a comment pointing at its replacement. Resumable on completion, never on a bare key.
"""
import json, os, subprocess, sys, time

DIR=os.path.dirname(os.path.abspath(__file__)); EV=os.path.join(DIR,'evidence')
JIRA='/home/user/Manual-test-Cases/build/atlassian-login/jira.sh'
OWNER='SV-9163'; STATE=os.path.join(DIR,'REFILED.json')
SHELL='SV-10001'   # an empty Story Defect already created while proving the mechanics -- reused, not orphaned

src=open(os.path.join(DIR,'file_tickets.py')).read()
ns={'__file__':os.path.join(DIR,'file_tickets.py'),'__name__':'nm'}
exec(src.split("state = json.load(open(STATE))")[0], ns)
T={t[0]:t for t in ns['T']}
jira=ns['jira']; attach=ns['attach']; body=ns['body']
OLD=json.load(open(os.path.join(DIR,'FILED.json')))

state=json.load(open(STATE)) if os.path.exists(STATE) else {}
order=[t[0] for t in ns['T']]
for idx,tag in enumerate(order):
    done=state.get(tag,{})
    if done.get('key') and done.get('description_http') in (200,204):
        print(f'{tag}: already re-filed as {done["key"]}'); continue
    _,summary,cannot,typed,v1did,why = T[tag]
    key=done.get('key')
    if not key:
        if tag==order[0] and SHELL not in [v.get('key') for v in state.values()]:
            key=SHELL
            st,_,raw=jira('PUT',f'/rest/api/3/issue/{key}',{"fields":{"summary":summary}})
            print(f'{tag}: reusing the mechanics shell {key} (summary set, HTTP {st})')
        else:
            st,j,raw=jira('POST','/rest/api/3/issue',{"fields":{
                "project":{"key":"SV"},"issuetype":{"id":"10007"},"parent":{"key":OWNER},
                "summary":summary,"priority":{"name":"Medium"}}})
            if st not in (200,201): print(f'{tag}: CREATE FAILED {st} {raw}'); break
            key=j['key']; print(f'{tag}: created {key}')
        state[tag]={'key':key,'summary':summary,'replaces':OLD[tag]['key'],
                    'created':time.strftime('%Y-%m-%dT%H:%M:%SZ')}
        json.dump(state,open(STATE,'w'),indent=1)
    for img in (f'TICKET-{tag}-no-results.png','TICKET-CONTROL-records-exist.png'):
        ok,info=attach(key,img); print(f'   attach {img}: {"ok" if ok else "FAILED "+info}')
    st2,_,_=jira('PUT',f'/rest/api/2/issue/{key}',
                 {"fields":{"description":body(tag,cannot,typed,v1did,why)}})
    print(f'   description: HTTP {st2}')
    state[tag]['description_http']=st2
    # retire the Task this replaces
    old=OLD[tag]['key']
    jira('POST',f'/rest/api/2/issue/{old}/comment',
         {"body":f"Re-filed as a Story Defect under {OWNER}: {key}. This Task is superseded and should "
                 f"not be worked -- it was an interim step before the QA lead asked for Story Defects "
                 f"attached to the stories of epic SV-9160."})
    stt,_,_=jira('POST',f'/rest/api/3/issue/{old}/transitions',{"transition":{"id":"8"}})  # OBSOLETE
    print(f'   retired {old}: transition HTTP {stt}')
    state[tag]['old_retired_http']=stt
    json.dump(state,open(STATE,'w'),indent=1)
print('\nRE-FILED:',json.dumps({k:v['key'] for k,v in state.items()},indent=1))
