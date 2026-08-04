#!/usr/bin/env python3
"""Complete the master RECHECK-QUEUE so every active case is represented (Standing Rule 49).

The master queue already carries 429 hand-written rows covering 217 distinct cases.
The per-case re-check obligation for the remaining cases lives in the three batches'
verdicts.csv `recheck` columns. This script appends ONE table of the cases not yet
represented, inside the RECHECK-ROWS markers, and leaves the queue OPEN.

Idempotent: re-running replaces its own generated block, never the hand-written rows.
"""
import csv, glob, json, os, re, sys, collections

HERE = os.path.dirname(os.path.abspath(__file__))
RS = os.path.abspath(os.path.join(HERE, '..'))
Q = os.path.join(RS, 'viu-2026-08-03', 'RECHECK-QUEUE.md')
LINK = 'https://shopview.testrail.io/index.php?/cases/view/'
BEGIN = '<!-- AUDIT-COMPLETION-BLOCK-START -->'
END = '<!-- AUDIT-COMPLETION-BLOCK-END -->'

RECHECK_COL = {'batch-sbc-sbr': 'recheck', 'batch-pv-tu': 'recheck_obligation', 'batch-wip-iv': 'recheck'}

def main():
    idmap = {r['internal_id']: r for r in csv.DictReader(open(os.path.join(RS, 'testrail-id-map.csv')))}
    pop = sorted(idmap)
    ledger = {r['internal_id']: r for r in csv.DictReader(open(os.path.join(HERE, 'per-case-verdicts.csv')))}

    obligations = {}
    for b, col in RECHECK_COL.items():
        for r in csv.DictReader(open(os.path.join(RS, 'viu-2026-08-03', b, 'verdicts.csv'))):
            obligations[r['internal_id']] = (r.get(col) or '').strip()

    txt = open(Q).read()
    body = re.sub(re.escape(BEGIN) + r'.*?' + re.escape(END), '', txt, flags=re.S)
    present = set(re.findall(r'`?([A-Z]{2,4}-[A-Z]+-\d+)`?', body)) & set(pop)
    missing = [i for i in pop if i not in present]

    rows = []
    for i in missing:
        cid = idmap[i]['testrail_case_id']
        ob = obligations.get(i) or ('NEW case authored 2026-08-04 - re-drive it end to end on the settled build.')
        ob = ob.replace('|', '/').replace('\n', ' ')
        if len(ob) > 190:
            ob = ob[:187] + '…'
        rows.append(f"| `{i}` | [{cid}]({LINK}{cid.lstrip('C')}) | {ledger[i]['status_ledger']} | {ob} | **PENDING** |")

    block = [BEGIN, '',
             '### COMPLETION BLOCK — the remaining cases, added 2026-08-04 by the exhaustive audit',
             '',
             f'The hand-written rows above cover **{len(present)}** of the **{len(pop)}** active cases. Standing Rule 49 requires',
             'EVERY case observed on this non-final build to carry a re-check obligation, so the remaining',
             f'**{len(rows)}** are listed here with the obligation recorded per case in the three batch',
             '`verdicts.csv` files. Together the queue now represents **all',
             f'{len(pop)}** active cases. **The queue stays OPEN.**',
             '',
             '| Case | C-id | Status now | What to re-confirm | Re-check outcome |',
             '|---|---|---|---|---|'] + rows + ['', END]

    marker = '<!-- RECHECK-ROWS-END -->'
    assert marker in body, 'RECHECK-ROWS-END marker missing'
    new = body.replace(marker, '\n'.join(block) + '\n\n' + marker)
    open(Q, 'w').write(new)

    check = set(re.findall(r'`?([A-Z]{2,4}-[A-Z]+-\d+)`?', open(Q).read())) & set(pop)
    print(f'hand-written rows covered : {len(present)}')
    print(f'completion block added    : {len(rows)}')
    print(f'queue now represents      : {len(check)} of {len(pop)}')
    print(f'STATUS line intact (OPEN) : {"## STATUS: **OPEN**" in open(Q).read()}')
    return 0 if len(check) == len(pop) else 1

if __name__ == '__main__':
    sys.exit(main())
