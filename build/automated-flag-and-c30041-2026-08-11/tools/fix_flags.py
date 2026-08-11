"""Set custom_atmstatus 1 (Not Automated) on the 31 Schedule cases our own add_case
tooling flagged as Automated. Rule 50: every write re-GET and byte-compared, every
field the pass did not intend to change proven byte-identical. Stops on any mismatch.

All three text fields are sent explicitly on every payload (playbook DECLARED
NORMALISATION #3 - an omitted text field is re-rendered through the HTML pipeline).
"""
import json, sys
sys.path.insert(0, '/tmp')
from trlib import tr

SNAP = '/home/user/Manual-test-Cases/build/automated-flag-and-c30041-2026-08-11/snapshots/'
pre = json.load(open(SNAP + 'PRE-31-schedule-cases.json'))
TEXT = ['custom_preconds', 'custom_steps', 'custom_expected']
# every field compared; only these may legitimately move
ALLOWED = {'custom_atmstatus', 'updated_on', 'updated_by'}

log = []
for cid in sorted(pre, key=int):
    before = pre[cid]
    assert before['custom_atmstatus'] == 3, cid
    payload = {'custom_atmstatus': 1}
    for f in TEXT:
        payload[f] = before.get(f)
    after = tr(f'update_case/{cid}', payload)

    diffs = {k: (before.get(k), after.get(k)) for k in set(before) | set(after)
             if before.get(k) != after.get(k)}
    unintended = {k: v for k, v in diffs.items() if k not in ALLOWED}
    ok = (after.get('custom_atmstatus') == 1 and not unintended
          and all(after.get(f) == before.get(f) for f in TEXT))
    log.append({'cid': int(cid), 'op': 'update_case', 'atm_before': 3,
                'atm_after': after.get('custom_atmstatus'),
                'fields_compared': len(set(before) | set(after)),
                'unintended_changes': list(unintended),
                'verify': 'PASS' if ok else 'FAIL'})
    print(cid, 'atm', after.get('custom_atmstatus'), 'PASS' if ok else 'FAIL',
          '' if ok else unintended, flush=True)
    if not ok:
        json.dump(log, open('/tmp/flag/oplog.json', 'w'), indent=1)
        raise SystemExit('STOPPED - Rule 50 mismatch on C' + cid)

json.dump(log, open('/tmp/flag/oplog.json', 'w'), indent=1)
print('ALL', len(log), 'PASS')
