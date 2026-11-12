#!/usr/bin/env python3
"""V1R-76 (C1095432) revival on TestRail, as the coordinator relayed from the QA lead on 12 Nov 2026 ("Yes"):
  1. move the case back from 134653 "Retired - cannot be set up" to 134654 "Regression Tests" - verified by re-GET;
  2. preconditions ONLY: keep both existing lines word for word and ADD the staging record + the As of date
     (steps and Expected Result untouched - Rule 113), read back at content level;
  3. add it to run 557 UNION-ONLY (Rule 34): full current case list + 1095432, include_all false; count must be +1.
Per-operation log: tr-oplog.jsonl (utc, op, case, HTTP, verification) - Rule 50. Snapshot before: C1095432-before.json (Rule 87)."""
import datetime, json, os, re, sys
sys.path.insert(0, '/tmp/claude-0/-home-user/ef40c1d4-3e84-5396-9a66-1a25d97a7768/scratchpad/xtools')
import tr_client as t
HERE = os.path.dirname(os.path.abspath(__file__)); LOG = os.path.join(HERE, 'tr-oplog.jsonl')
CID, RUN, SEC = 1095432, 557, 134654
def log(op, status, verification, **kw):
    rec = {'utc': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'), 'op': op, 'case': f'C{CID}', 'http': status, 'verification': verification, **kw}
    open(LOG, 'a').write(json.dumps(rec) + '\n'); print(json.dumps(rec)[:300])
def strip(h): return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', h or '')).strip()
before = json.load(open(os.path.join(HERE, 'C1095432-before.json')))
ADD = ('<li>On staging, customer X is "ZZAUTOTEST OVERPAID V1R-76 Cust X": its only invoice, S2-40185 ($100.00), counts $120.00 paid '
       'as of 11/11/2026 (a $20.00 payment dated 11/09/2026 that was reversed on 11/12/2026, plus a $100.00 payment dated 11/10/2026).</li>'
       '<li>The A/R Aging Summary is set to "As of: 11/11/2026" before step 3.</li>')
# 1. move
s, c = t.get_case(CID)
if c['section_id'] != SEC:
    s1, r1 = t.post(f'move_cases_to_section/{SEC}', {'suite_id': 1, 'case_ids': [CID]})
    s2, c = t.get_case(CID)
    log('move_cases_to_section', s1, f"re-GET section_id={c['section_id']} {'OK' if c['section_id'] == SEC else 'MISMATCH'}", from_section=before['section_id'], to_section=SEC)
else: log('move_cases_to_section (skip, already there)', 200, f"section_id={c['section_id']}")
# 2. preconditions only
if 'ZZAUTOTEST OVERPAID V1R-76 Cust X' not in (c.get('custom_preconds') or ''):
    old = c['custom_preconds']; assert old.rstrip().endswith('</ul>'), 'unexpected preconditions shape'
    new = old.rstrip()[:-5] + ADD + '</ul>'
    s3, r3 = t.post(f'update_case/{CID}', {'custom_preconds': new})
    s4, c2 = t.get_case(CID)
    same_other = all(strip(c2.get(k)) == strip(before.get(k)) for k in ('custom_steps', 'custom_expected', 'title'))
    keeps_old = strip(old.replace('</ul>', '')) in strip(c2['custom_preconds'])
    log('update_case custom_preconds', s3, f"read back: new lines present={('S2-40185' in c2['custom_preconds'])}; old lines kept={keeps_old}; steps/expected/title unchanged={same_other}")
    json.dump(c2, open(os.path.join(HERE, 'C1095432-after.json'), 'w'), indent=1)
else: log('update_case (skip, already updated)', 200, 'preconditions already name the staging record')
# 3. run 557 union-only
def run_case_ids():
    ids, off = [], 0
    while True:
        s, r = t.get(f'get_tests/{RUN}&limit=250&offset={off}')
        tests = r.get('tests', r) if isinstance(r, dict) else r
        ids += [x['case_id'] for x in tests]
        if not (isinstance(r, dict) and (r.get('_links') or {}).get('next')): break
        off += 250
    return ids
ids = run_case_ids(); n0 = len(ids)
if CID in ids: log('add_to_run (skip, already in run)', 200, f'run {RUN} has {n0} tests incl. C{CID}')
else:
    full = sorted(set(ids) | {CID})
    assert len(full) == n0 + 1 and set(ids) <= set(full)
    s5, r5 = t.post(f'update_run/{RUN}', {'include_all': False, 'case_ids': full})
    after = run_case_ids()
    ok = len(after) == n0 + 1 and set(ids) <= set(after) and CID in after
    log('update_run union-only', s5, f"tests before {n0}, after {len(after)}, nothing removed={set(ids) <= set(after)}, C{CID} in run={CID in after} {'OK' if ok else 'MISMATCH'}", run=RUN)
