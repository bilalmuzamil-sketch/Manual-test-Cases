#!/usr/bin/env python3
"""File the four 'in All but not in its own section' Story Defects, from the QA lead's own recording.

Evidence is HIS screen recording of 14 Sep, decoded frame by frame. Each ticket carries the annotated
frame for its moment, the full recording, and the timestamp to move to. Parent is SV-9169 (the scope
tab strip and grouped results) because the COUNT is right -- the record is indexed -- and it is the
section's own view that comes back empty.
Resumable on completion, never on a bare key.
"""
import json, os, subprocess, time

DIR=os.path.dirname(os.path.abspath(__file__)); EV=os.path.join(DIR,'evidence')
STATE=os.path.join(DIR,'TABDEFECTS.json'); OWNER='SV-9169'
VIDEO='QA-LEAD-screen-recording-2026-09-14.webm'
src=open(os.path.join(DIR,'file_tickets.py')).read()
ns={'__file__':os.path.join(DIR,'file_tickets.py'),'__name__':'nm'}
exec(src.split("state = json.load(open(STATE))")[0], ns)
jira=ns['jira']; attach=ns['attach']

# tag · summary · what they searched · which section · timestamp in the recording · what the record is
T=[("D1-vin","Global Search: a vehicle found by VIN is missing from the Assets section",
    "the full VIN of a vehicle","BAHUTYV09T63EV7NS","Assets","0:34",
    "the 2015 Ford Escape on 4 Star Truck Repair's vehicle list"),
   ("D2-vendor","Global Search: a supplier found by email is missing from the Vendors section",
    "a supplier's email address","jay.harrison@gmail.com","Vendors","1:20",
    "Carolina Truck & Trailer Repair, whose contact holds that email"),
   ("D3-part","Global Search: a part found by its part number is missing from the Parts section",
    "a part number","ZZT-88-4412","Parts","1:35","the stocked part with that number"),
   ("D4-wo","Global Search: a job found by part of its number is missing from the Work orders section",
    "part of a job number","17580","Work orders","1:42","work order S9160-17580")]

def body(searched, typed, section, ts, what):
    return f"""h2. What a user sees

A user searches for {searched} and the search box tells them, in the same breath, both that it found
something and that it found nothing.

Type *{typed}* into the search box. Along the top, *All* shows *1* and *{section}* also shows *1* — so
the record is there. Click *{section}* to look at it, and the panel says *"No results for
"{typed}" in {section}"*.

The record is real: it is {what}.

h2. How to see it

# Open ShopView on the QA branch: [https://sv9160.qa.shopview.com/workorders]
# Open the search box (the magnifying glass in the top bar, or Ctrl and K).
# Type *{typed}*
# Note the number beside *{section}* along the top — it reads 1.
# Click *{section}*.

h2. What is wrong

The count and the section disagree. Anyone who narrows to *{section}* — which is the natural thing to
do when you know what you are looking for — is told the record does not exist. Only someone who stays
on *All* will ever see it.

h2. Screenshot

!DEFECT-{"vin" if section=="Assets" else section.lower().replace(" ","")}-PLACEHOLDER!

h2. Screen recording

*Move to the timeline related to this ticket: {ts}*

The full session is attached as *{VIDEO}*. The moment for this ticket is at *{ts}*.

h2. What should happen

A record that appears under *All* must also appear under its own section. The check only passes when
it shows in both.

h2. Where this was seen

QA branch sv9160, 14 September 2026, recorded by the QA lead. Reproduced from his recording frame by
frame; the branch was returning gateway errors at the time of writing, so the recording is the
evidence rather than a fresh capture.
"""

state=json.load(open(STATE)) if os.path.exists(STATE) else {}
for tag,summary,searched,typed,section,ts,what in T:
    done=state.get(tag,{})
    if done.get('key') and done.get('description_http') in (200,204) and done.get('video_attached'):
        print(f'{tag}: already complete as {done["key"]}'); continue
    key=done.get('key')
    if not key:
        st,j,raw=jira('POST','/rest/api/3/issue',{"fields":{
            "project":{"key":"SV"},"issuetype":{"id":"10007"},"parent":{"key":OWNER},
            "summary":summary,"priority":{"name":"Medium"}}})
        if st not in (200,201): print(f'{tag}: CREATE FAILED {st} {raw}'); break
        key=j['key']; state[tag]={'key':key,'summary':summary,'timestamp':ts,
                                  'created':time.strftime('%Y-%m-%dT%H:%M:%SZ')}
        json.dump(state,open(STATE,'w'),indent=1); print(f'{tag}: created {key}')
    img=f'DEFECT-{tag}.png'
    ok,_=attach(key,img); print(f'   attach {img}: {"ok" if ok else "FAILED"}')
    if tag=='D1-vin':
        ok2,_=attach(key,'DEFECT-D1-vehicle-exists.png'); print(f'   attach context: {"ok" if ok2 else "FAILED"}')
    okv,info=attach(key,VIDEO); print(f'   attach recording: {"ok" if okv else "FAILED "+info}')
    state[tag]['video_attached']=okv
    b=body(searched,typed,section,ts,what).replace(
        f'!DEFECT-{"vin" if section=="Assets" else section.lower().replace(" ","")}-PLACEHOLDER!',
        f'!{img}|width=760!' + ('\n\n*And the vehicle itself, on the customer\'s list:*\n\n!DEFECT-D1-vehicle-exists.png|width=760!' if tag=='D1-vin' else ''))
    st2,_,_=jira('PUT',f'/rest/api/2/issue/{key}',{"fields":{"description":b}})
    print(f'   description: HTTP {st2}')
    state[tag]['description_http']=st2
    json.dump(state,open(STATE,'w'),indent=1)
print('\nFILED:',json.dumps({k:v['key'] for k,v in state.items()},indent=1))
