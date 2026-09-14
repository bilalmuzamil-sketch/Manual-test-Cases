#!/usr/bin/env python3
"""File the Global Search V1->V2 tickets that REPRODUCE on the build.

Resumable: every ticket's key is written to FILED.json the moment it is created, so a quota
cut-off costs at most the ticket in flight. Re-running skips anything already filed.
Only the candidates re-verified as still failing on 2026-09-14 are here -- A1-A4, C2 and C3
were dropped because the build no longer shows the failure (see RE-VERIFICATION-2026-09-14.md).
"""
import json, os, subprocess, sys, time

DIR = os.path.dirname(os.path.abspath(__file__))
EV = os.path.join(DIR, 'evidence')
STATE = os.path.join(DIR, 'FILED.json')
JIRA = '/home/user/Manual-test-Cases/build/atlassian-login/jira.sh'
OWNER = 'SV-9163'          # BE - Search index: backfill and incremental maintenance, nine entity types
EPIC  = 'SV-9160'

def jira(method, path, payload=None):
    args = ['bash', JIRA, method, path]
    if payload is not None:
        p = '/tmp/claude-0/_jira_payload.json'
        open(p, 'w').write(json.dumps(payload))
        args.append(p)
    r = subprocess.run(args, capture_output=True, text=True)
    out = r.stdout
    status = None
    for line in out.splitlines():
        if line.startswith('__HTTP:'):
            status = int(line.split(':')[1])
    body = out.split('__HTTP:')[0].strip()
    try:    j = json.loads(body) if body else None
    except Exception: j = None
    return status, j, body[:300]

def attach(key, filename):
    """jira.sh has no multipart mode -- attachments go through curl directly, same cookies/headers."""
    path = os.path.join(EV, filename)
    r = subprocess.run(['curl','-s','-w','\n__HTTP:%{http_code}',
        '-b', os.environ.get('ATL_COOKIES','/tmp/atlassian/cookies.txt'),
        '--cacert','/root/.ccr/ca-bundle.crt',
        '-H','Accept: application/json',
        '-H','X-Atlassian-Token: no-check',
        '-H','Origin: https://shopview.atlassian.net',
        '-H','Referer: https://shopview.atlassian.net/browse/SV-9160',
        '-H','User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
        '-F', f'file=@{path}',
        f'https://shopview.atlassian.net/rest/api/3/issue/{key}/attachments'],
        capture_output=True, text=True)
    ok = '__HTTP:200' in r.stdout
    return ok, r.stdout[-80:]

# ---------------------------------------------------------------- the eight
# Each: summary · what a user cannot do · the thing they would type · what V1 did · the ask
T = [
 ("B1", "Global Search: a catalogue part cannot be found by its part number",
  "find a part that the workshop does not keep in stock", "ZZT-77-3300",
  "a part number typed into search found the part whether or not any were in stock",
  "Parts the workshop orders in rather than stocks are now invisible to search. Someone quoting a job "
  "has to know it exists and go looking for it another way."),
 ("B2", "Global Search: a customer cannot be found by their postal code",
  "find a customer by typing their postal code", "44872-9931",
  "typing a postal code found the customer",
  "Someone with a delivery note or an address in front of them can no longer start from the postal code."),
 ("B3", "Global Search: a customer cannot be found by their website address",
  "find a customer by typing their website address", "bridgeporthauling-zzt.com",
  "typing a website address found the customer",
  "Someone who has the company's website but not its exact trading name can no longer find them."),
 ("B4", "Global Search: a customer or supplier cannot be found by a contact's job title",
  "find a company by typing a contact's job title", "Dispatch Supervisor",
  "typing a job title found companies with a contact holding that title",
  "Someone trying to reach, say, every dispatch supervisor can no longer find them from search."),
 ("B5", "Global Search: a supplier cannot be found by their postal code",
  "find a supplier by typing their postal code", "43055-2210",
  "typing a postal code found the supplier",
  "Same loss as for customers, on the supplier side -- an invoice or delivery note in hand no longer "
  "gives you a way in."),
 ("B6", "Global Search: a supplier cannot be found by the state or province they are in",
  "find suppliers by typing the state they are in", "Ohio",
  "typing a state found the suppliers based there",
  "Worth noting because it is easy to misread: searching \"Ohio\" DOES show a supplier -- but only "
  "because that supplier is called \"Ohioville\". The supplier actually based in Ohio is not shown. "
  "Note also the asymmetry: a CUSTOMER in Ohio still is found by \"Ohio\", a supplier is not, which "
  "looks more like something overlooked than something decided."),
 ("B7", "Global Search: a vehicle cannot be found by its licence plate",
  "find a vehicle by typing its licence plate", "OHZZT471",
  "typing a licence plate found the vehicle",
  "Someone looking at a vehicle in the yard, or holding a plate number from a phone call, can no "
  "longer start from the plate."),
 ("C1", "Global Search: jobs can no longer be found by typing their status",
  "find jobs by typing a status such as \"quality check\"", "qualitycheck",
  "typing a status listed the jobs currently at that status",
  "Anyone used to typing a status to see that queue now gets nothing. Typing it WITH a space "
  "(\"Quality Check\") does return a list, but those are jobs matching the words elsewhere -- they are "
  "not at that status, which is arguably more confusing than returning nothing."),
]

def body(tag, cannot, typed, v1did, why):
    return f"""h2. What a user can no longer do

A user can no longer *{cannot}*.

{why}

h2. How to see it

# Open ShopView on the QA branch: [https://sv9160.qa.shopview.com/workorders]
# Open the search box (the magnifying glass in the top bar, or Ctrl and K).
# Type *{typed}*
# Look at the counts along the top of the search box.

h2. What happens now

Nothing is found. Every category reads zero.

h2. What used to happen

In the previous version of Global Search, {v1did}.

h2. Screenshots

*What the user sees today:*

!TICKET-{tag}-no-results.png|width=760!

*The same records ARE found when searched by name, so they do exist and the search box is working:*

!TICKET-CONTROL-records-exist.png|width=760!

h2. The question for the Product Owner

Is losing this acceptable?

* *Yes* -- it was deliberate, and we close this and mark the matching test as agreed behaviour.
* *No* -- it should still work, and this becomes work for the team.

Nothing is being called a fault here. This is a capability the previous version had and this one does
not, raised so somebody decides on purpose rather than by accident.

h2. Where this was seen

QA branch {EPIC} Global Search V2, on 14 September 2026, signed in as an administrator. The same
search box was used for every check, and it returned results for other searches in the same sitting,
so an empty result here is real.
"""

state = json.load(open(STATE)) if os.path.exists(STATE) else {}
for tag, summary, cannot, typed, v1did, why in T:
    # Resume on COMPLETION, not on existence of a key. SV-9997 was created and then cut off before
    # its description and link were written, and an is-there-a-key test skipped it on the next run.
    done = state.get(tag, {})
    if done.get('key') and done.get('description_http') in (200, 204) and done.get('link_http') in (200, 201):
        print(f'{tag}: already complete as {done["key"]} -- skipping'); continue
    if done.get('key'):
        print(f'{tag}: {done["key"]} exists but is INCOMPLETE -- finishing it rather than duplicating')
    fields = {"project": {"key": "SV"}, "issuetype": {"name": "Task"},
              "summary": summary, "priority": {"name": "Medium"},
              "customfield_10153": {"value": "Platform Features"}}
    st, j, raw = jira('POST', '/rest/api/3/issue', {"fields": fields})
    if st not in (200, 201):
        print(f'{tag}: CREATE FAILED {st} {raw}'); break
    key = j['key']
    state[tag] = {'key': key, 'summary': summary, 'created': time.strftime('%Y-%m-%dT%H:%M:%SZ')}
    json.dump(state, open(STATE, 'w'), indent=1)
    print(f'{tag}: created {key}')
    for img in (f'TICKET-{tag}-no-results.png', 'TICKET-CONTROL-records-exist.png'):
        ok, info = attach(key, img)
        print(f'   attach {img}: {"ok" if ok else "FAILED "+info}')
    st2, _, raw2 = jira('PUT', f'/rest/api/2/issue/{key}',
                        {"fields": {"description": body(tag, cannot, typed, v1did, why)}})
    print(f'   description: HTTP {st2}')
    st3, _, raw3 = jira('POST', '/rest/api/3/issueLink',
                        {"type": {"name": "Relates"}, "inwardIssue": {"key": key},
                         "outwardIssue": {"key": OWNER}})
    print(f'   link relates-to {OWNER}: HTTP {st3}')
    state[tag].update({'description_http': st2, 'link_http': st3})
    json.dump(state, open(STATE, 'w'), indent=1)
print('\nFILED:', json.dumps({k: v['key'] for k, v in state.items()}, indent=1))
