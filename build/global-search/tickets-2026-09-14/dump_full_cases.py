#!/usr/bin/env python3
"""Dump the FULL Steps and Expected of every case in the run's regression set.

Why: the execution-plan extractor truncates Expected at 420 characters, because it only needed
enough text to find the queries. Thirty of the sixty-two cases hit that limit -- and these cases
carry their GRADING INSTRUCTION in the tail ("IF THIS FAILS: mark the test Blocked...", "do not
raise a defect until the Product Owner has ruled"). Judging from the truncated copy risks marking
Failed a case that says to hold, or the reverse.

Rule 100: read it live, do not rely on a local extract. Read-only.
"""
import sys, json, os, html, re
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
import tr_client as t

D = os.path.dirname(os.path.abspath(__file__))
plan = [c['id'] for c in json.load(open(f'{D}/CASES-6769.json'))]

def clean(s):
    s = html.unescape(s or '')
    s = re.sub(r'<[^>]+>', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()

out = {}
for cid in plan:
    status, c = t.get(f'get_case/{cid}')      # the client returns (status, body), not the body
    if status != 200 or not isinstance(c, dict):
        out[f'C{cid}'] = {'error': f'could not read this case: {status}'}
        continue
    out[f'C{cid}'] = {
        'title': c.get('title'),
        'steps': clean(c.get('custom_steps') or c.get('custom_steps_separated') or ''),
        'expected': clean(c.get('custom_expected') or ''),
        'preconds': clean(c.get('custom_preconds') or ''),
        'created_by': c.get('created_by'),
        'automation_status': c.get('custom_atmstatus'),
    }
json.dump(out, open(f'{D}/CASES-FULL.json', 'w'), indent=1)
lens = sorted((len(v['expected']), k) for k, v in out.items())
print(f'{len(out)} cases dumped; longest Expected {lens[-1][0]} chars ({lens[-1][1]})')
print('cases whose Expected was being truncated at 420:',
      sum(1 for v in out.values() if len(v['expected']) > 420))
