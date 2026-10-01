#!/usr/bin/env python3
"""Separate a PRODUCTION failure that is a real fault from one that is only missing data.

Run 415's checks were written against staging records - a specific phone number, a specific
vendor, seeded ZZ... rows. On production those records do not exist, so the check fails with an
empty result set. That is NOT a defect and reporting it as one would be worse than useless: it
buries the real findings in noise and teaches everyone our results need checking.

THE RULE APPLIED HERE (107, data amendment, 2026-10-01): a missing record is never a reason to
leave a check unjudged. So these are not written off - they are separated, given a production
equivalent, and re-run. Only what survives that is reported.

Three buckets:
  REAL        - the check ran against data that exists and the product behaved wrongly
  NO DATA     - the search term names a record that does not exist on production -> re-run with a
                production equivalent before any verdict
  REGRESSION  - passed on staging, fails on production for a product reason. THESE are what the QA
                lead asked to be highlighted, and they are the only ones that get a comment saying
                production is worse than staging.
"""
import json, re, sys, collections

NO_DATA = re.compile(r'→ 0 rows|0 rows, 0 labelled|NO ROWS|no record|not found on this environment', re.I)

def load_staging():
    try:
        return json.load(open('build/global-search/retest-2026-09-30/NEW-VERDICTS.json'))
    except Exception:
        return json.load(open('build/global-search/staging-run-2026-09-29/VERDICTS.json'))['verdicts']

def main(log_path, out_path):
    raw = re.sub(r'\x1b\[[0-9;]*m', '', open(log_path, encoding='utf8', errors='replace').read())
    lines = raw.split('\n')
    notes = collections.defaultdict(list)
    for l in lines:
        m = re.match(r'^C(146\d\d\d):\s*(.+)$', l.strip())
        if m: notes[m.group(1)].append(m.group(2).strip())

    staging = load_staging()
    prod = {}
    for l in lines:
        m = re.match(r'^\s*(✓|✘)\s+\d+\s+(.*?)›\s*C(146\d\d\d)\s*—\s*(.*)$', l)
        if not m: continue
        tick, cid, title = m.group(1), m.group(3), m.group(4)
        n = notes.get(cid, [])
        if tick == '✓':
            bucket = 'passed'
        elif any(NO_DATA.search(x) for x in n):
            bucket = 'no data on production'
        else:
            was = staging.get(cid, {}).get('v')
            bucket = 'REGRESSION - passed on staging' if was == 'Passed' else 'fails on both'
        prod[cid] = {'bucket': bucket, 'title': title.strip(), 'notes': n,
                     'staging': staging.get(cid, {}).get('v', 'not run')}
    json.dump(prod, open(out_path, 'w'), indent=1, ensure_ascii=False)
    tally = collections.Counter(v['bucket'] for v in prod.values())
    for k, n in tally.most_common(): print(f'  {k:<32} {n}')
    print()
    reg = [c for c, v in prod.items() if v['bucket'].startswith('REGRESSION')]
    if reg:
        print('WORSE ON PRODUCTION THAN STAGING - these are the ones to highlight:')
        for c in sorted(reg):
            print(f"  C{c}  {prod[c]['title'][:70]}")
            for x in prod[c]['notes'][:2]: print(f'        {x[:120]}')
    else:
        print('Nothing is worse on production than it was on staging.')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
