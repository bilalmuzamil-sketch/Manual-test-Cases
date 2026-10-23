"""23 Oct 2026 — QA lead: bring the tests up to the current PRD (L0562) and "Yes you are allowed to make changess to the automated tests
too". Run-498 cases whose PRECONDITIONS / STEPS still use wording PRD v74 no longer has (run_scan.json):
 - the set-up line "More actions (…) > Reassign lead technician > pick the technician > Reassign" -> PRD v74 S3-R14 ("Assign lead
   technician" on a work order with no lead) + S4-R13 (one click assigns). Worded to work on today's production too, which still shows
   the old menu label and Reassign button until SV-11524 ships, so the set-up stays runnable now and after the fix.
 - "Fields to display" -> "Column Selection" (SV-11580, Done; PRD v74 S5-R2).
Expected is never touched here (Rule 114); Expected occurrences are listed for the QA lead. Never Vladimir's (created_by 1). --write applies."""
import json, os, sys, time
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../testing-tools'))
import tr_client as t
D = os.path.dirname(os.path.abspath(__file__))
OLD = "&gt; Reassign lead technician &gt; pick the technician &gt; Reassign.)"
NEW = "&gt; Assign lead technician (an older screen shows Reassign lead technician) &gt; click the technician (if the window still shows a Reassign button, click it).)"
scan = json.load(open(os.path.join(D, 'run_scan.json')))
todo = [o['case'] for o in scan if o['hits'].get('preconds') or o['hits'].get('steps')]
log = {}
for cid in todo:
    for k in range(5):
        s, c = t.get(f'get_case/{cid}')
        if isinstance(c, dict) and 'id' in c: break
        time.sleep(4 * (k + 1))
    if c['created_by'] == 1: log[cid] = 'skipped: Vladimir'; continue
    new = {}
    for f in ('custom_preconds', 'custom_steps'):
        v = c.get(f) or ''; v2 = v.replace(OLD, NEW).replace('Fields to display', 'Column Selection')
        if v2 != v: new[f] = v2
    if not new: log[cid] = 'nothing to change in preconds/steps (already done or none)'; continue
    json.dump({k: c[k] for k in new} | {'automated': c.get('custom_atmstatus') == 3}, open(os.path.join(D, f'C{cid}-before.json'), 'w'), indent=1)
    if '--write' in sys.argv:
        for k in range(5):
            s, r = t.post(f'update_case/{cid}', new)
            if s == 200: break
            time.sleep(5 * (k + 1))
        for k in range(5):
            s2, c2 = t.get(f'get_case/{cid}')
            if isinstance(c2, dict) and 'id' in c2: break
            time.sleep(5 * (k + 1))
        ok = all(c2.get(k) == v for k, v in new.items()) and c2['custom_expected'] == c['custom_expected'] and c2['title'] == c['title']
        log[cid] = f'update {s} read back {ok} fields {list(new)}' + (' AUTOMATED' if c.get('custom_atmstatus') == 3 else '')
    else: log[cid] = f'dry: {list(new)}' + (' AUTOMATED' if c.get('custom_atmstatus') == 3 else '')
json.dump(log, open(os.path.join(D, 'log-write.json' if '--write' in sys.argv else 'log-dry.json'), 'w'), indent=1)
from collections import Counter
print(len(todo), Counter(v.split(':')[0].split(' ')[0] for v in log.values()), sum('AUTOMATED' in v for v in log.values()), 'automated')
bad = {k: v for k, v in log.items() if 'read back False' in v}; print('BAD', bad) if bad else None
