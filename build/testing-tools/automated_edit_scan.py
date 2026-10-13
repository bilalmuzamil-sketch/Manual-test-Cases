#!/usr/bin/env python3
"""Which cases in a TestRail run did WE (user 3) edit while TestRail flagged them Automated? (12 Oct 2026)
Answers "which automated cases did we rewrite?" from the system of record, not from memory: reads every case's full
change history, tracks the Automation status through time, and lists our text edits (title/preconds/steps/expected)
made while it was Automated. Also lists every case that was EVER Automated and its status now (Vladimir Tomovic,
user 1, switches the flag both ways — read it live before telling the engineer anything; Rules 65/71).
Usage: python3 build/testing-tools/automated_edit_scan.py <run_id>      (credentials: /tmp/testrail/creds.json)"""
import json, sys, time, datetime, requests
run = sys.argv[1] if len(sys.argv) > 1 else sys.exit(__doc__)
c = json.load(open('/tmp/testrail/creds.json')); h = ('https://' + c['host'] if not c['host'].startswith('http') else c['host']).rstrip('/')
S = requests.Session(); S.auth = (c['email'], c['password'])
def get(p):
    for i in range(8):   # TestRail rate-limits bulk history reads; back off and retry
        try:
            r = S.get(h + '/index.php?/api/v2/' + p, timeout=60); j = r.json()
            if r.status_code == 200 and not (isinstance(j, dict) and 'error' in j): return j
        except Exception: pass
        time.sleep(5 * (i + 1))
    sys.exit('failed ' + p)
def paged(p, key):
    out, off = [], 0
    while True:
        r = get(f'{p}&limit=250&offset={off}'); x = r.get(key, r) if isinstance(r, dict) else r; out += x
        if len(x) < 250: return out
        off += 250
TEXT = {'custom_preconds', 'custom_steps', 'custom_expected', 'title', 'custom_steps_separated'}
hits = []
tests = paged(f'get_tests/{run}', 'tests'); print('tests in run', run, ':', len(tests))
for t in tests:
    cid = t['case_id']; case = get(f'get_case/{cid}')
    hh = sorted(paged(f'get_history_for_case/{cid}', 'history'), key=lambda e: e['created_on'])
    st = next((ch.get('old_value') for e in hh for ch in e.get('changes', []) if ch.get('field') == 'custom_atmstatus'), case.get('custom_atmstatus'))
    for e in hh:
        f = {ch.get('field') for ch in e.get('changes', [])}
        if e.get('user_id') == 3 and f & TEXT and st == 3:
            hits.append((cid, datetime.datetime.utcfromtimestamp(e['created_on']).strftime('%Y-%m-%d %H:%M UTC'), sorted(f & TEXT)))
        for ch in e.get('changes', []):
            if ch.get('field') == 'custom_atmstatus': st = ch.get('new_value')
    if any(ch.get('field') == 'custom_atmstatus' and ch.get('new_value') == 3 for e in hh for ch in e.get('changes', [])) or case.get('custom_atmstatus') == 3:
        print('EVER-AUTOMATED', cid, 'now', {3: 'Automated', 1: 'Not Automated'}.get(case.get('custom_atmstatus'), case.get('custom_atmstatus')), case['title'][:60])
print('--- our text edits made while the case was Automated ---')
for x in hits: print(x)
