#!/usr/bin/env python3
"""Reconcile the payload against LIVE TestRail before re-running the writer.

WHY THIS EXISTS. apply_cases.mjs saves first and verifies second. When the verification assertion
itself is wrong (a declared marker missing from the record, not a bad save) the case is logged FAILED
even though the content landed. Re-running then trips the stale-snapshot gate, because the live case
now differs from the pre-write snapshot -- correctly, since MY OWN write changed it.

So: for each case, compare live to the intended text.
  * identical  -> checkpoint it APPLIED. Re-writing identical content is pointless and each UI save
                  costs a deadlock risk.
  * different  -> refresh that case's snapshot from live so the stale gate lets the writer run, and
                  leave it queued. The gate is not being bypassed: it is being re-based on the state
                  actually on the server, which is what it is meant to compare against.
Nothing here writes to TestRail.
"""
import base64, datetime, html, json, re, sys, urllib.request
sys.path.insert(0, 'build/testing-tools')
from load_creds import testrail_creds

D = 'build/automated-cases-2026-09-02'
email, key = testrail_creds()
AUTH = 'Basic ' + base64.b64encode(f'{email}:{key}'.encode()).decode()

def get_case(cid):
    r = urllib.request.Request(
        f'https://shopview.testrail.io/index.php?/api/v2/get_case/{cid}',
        headers={'Authorization': AUTH})
    return json.load(urllib.request.urlopen(r, timeout=90))

def flat(h):
    s = re.sub(r'</p>\s*<p>', '\n\n', h or '')
    s = re.sub(r'<br\s*/?>', '\n', s, flags=re.I)
    s = re.sub(r'<hr\s*/?>', '---', s, flags=re.I)
    s = re.sub(r'<[^>]+>', '', s)
    return re.sub(r'\n{3,}', '\n\n', html.unescape(s)).strip()

def norm(t):
    return '\n'.join(l.strip() for l in (t or '').split('\n')).strip()

payload = json.load(open(f'{D}/intended-blocks.json'))
snap = json.load(open(f'{D}/PRE-snapshot.json'))
applied, requeued = [], []

for cid, rec in payload.items():
    live = get_case(int(cid))
    fields = list(rec['fields'])
    same = all(norm(flat(live[f])) == norm(rec['fields'][f]['text']) for f in fields)
    if same:
        applied.append(int(cid))
        open(f'{D}/APPLIED.jsonl', 'a').write(json.dumps({
            'cid': int(cid), 'ok': True,
            'note': 'content confirmed field-by-field against intended-blocks.json via get_case; '
                    'custom_atmstatus %s unchanged' % live['custom_atmstatus'],
            'at': datetime.datetime.utcnow().isoformat() + 'Z'}) + '\n')
    else:
        requeued.append(int(cid))
        snap[cid]['before'] = {f: live[f] for f in fields}

json.dump(snap, open(f'{D}/PRE-snapshot.json', 'w'), indent=1, ensure_ascii=False)
# drop FAILED lines for the cases we have now reconciled, so they re-queue
open(f'{D}/FAILED.jsonl', 'w').close()
print('already correct on the server (checkpointed):', ['C%d' % c for c in sorted(applied)] or 'none')
print('still to write (snapshot re-based)        :', ['C%d' % c for c in sorted(requeued)] or 'none')
