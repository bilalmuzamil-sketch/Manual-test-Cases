#!/usr/bin/env python3
"""add_case the six SCH-PANEL cases, byte-verifying each write (Rule 50).

STOPS THE BATCH on any mismatch.  Sends all three text fields explicitly so
TestRail's omit-field re-render (playbook §J) cannot fire.
"""
import sys, json, time
sys.path.insert(0, '/tmp/sch-panel/tr')
from trlib import tr

CASES = json.load(open('/home/user/Manual-test-Cases/build/schedule/cases/cases-J-panel-collapse.json'))
LOG = []

def norm_refs(s):
    """TestRail's DECLARED normalisation: splits on commas, trims, rejoins bare."""
    return ','.join(p.strip() for p in s.split(','))

for c in CASES:
    payload = {
        'title': c['title'],
        'custom_preconds': c['preconditions'],
        'custom_steps': c['steps'],
        'custom_expected': c['expected'],
        'refs': c['refs'],
        'custom_atmstatus': 3,
        'custom_automation_type': 0,
        'priority_id': 2,
    }
    sec = c['section_id']
    try:
        created = tr(f'add_case/{sec}', payload)
    except Exception as e:
        LOG.append({'op': 'add_case', 'internal_id': c['id'], 'section': sec,
                    'http': 'ERROR', 'verify': 'FAILED', 'detail': str(e)[:400]})
        print(f"!! {c['id']} add_case FAILED: {e}")
        break
    cid = created['id']
    time.sleep(0.4)
    got = tr(f'get_case/{cid}')

    # ---- BYTE-LEVEL VERIFICATION: every field of the intended payload ----
    checks, bad = [], []
    for k, v in payload.items():
        actual = got.get(k)
        expect = norm_refs(v) if k == 'refs' else v
        ok = (actual == expect)
        checks.append({'field': k, 'ok': ok})
        if not ok:
            bad.append({'field': k, 'intended': repr(expect)[:300], 'stored': repr(actual)[:300]})
    # ---- and prove the case landed where intended ----
    for k, v in [('section_id', sec), ('suite_id', 1)]:
        ok = (got.get(k) == v)
        checks.append({'field': k, 'ok': ok})
        if not ok:
            bad.append({'field': k, 'intended': v, 'stored': got.get(k)})

    entry = {'op': 'add_case', 'internal_id': c['id'], 'section': sec,
             'case_id': cid, 'http': 200,
             'fields_compared': len(checks),
             'verify': 'MATCH' if not bad else 'MISMATCH',
             'refs_normalisation_applied': True,
             'mismatches': bad}
    LOG.append(entry)
    print(f"  {c['id']:<14} -> C{cid}  HTTP 200  {len(checks)} fields compared  "
          f"{'BYTE-VERIFIED MATCH' if not bad else 'MISMATCH!!'}")
    c['testrail_case_id'] = cid
    if bad:
        print("!! MISMATCH - STOPPING THE BATCH (Rule 50)")
        for b in bad:
            print("   ", b)
        break

json.dump(LOG, open('/tmp/sch-panel/tr/push-log.json', 'w'), indent=1)
if all(e['verify'] == 'MATCH' for e in LOG) and len(LOG) == len(CASES):
    json.dump(CASES, open('/home/user/Manual-test-Cases/build/schedule/cases/cases-J-panel-collapse.json', 'w'),
              indent=1, ensure_ascii=False)
    print(f"\nALL {len(LOG)}/{len(CASES)} add_case verified MATCH. C-ids written back to local source.")
else:
    print(f"\nSTOPPED: {len(LOG)} ops attempted, "
          f"{sum(1 for e in LOG if e['verify']=='MATCH')} verified.")
