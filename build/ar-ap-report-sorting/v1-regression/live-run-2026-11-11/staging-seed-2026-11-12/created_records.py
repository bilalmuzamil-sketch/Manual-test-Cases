#!/usr/bin/env python3
"""Lists every record the A/R A/P regression kit created on staging AFTER the "before the feature" snapshot, from the
ledger (../tools/seeded-staging.json), prep-state.json and oplog.jsonl - never typed by hand. Read-only.
    python3 created_records.py > records-created-after-snapshot.md
Document numbers as the screens show them: <prefix><shop number of the document's location>-<sequence>
(staging location A = shop 2, B = shop 3; location C was created with shop 2)."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); TOOLS = os.path.join(os.path.dirname(HERE), 'tools')
L = json.load(open(os.path.join(TOOLS, 'seeded-staging.json')))
M = json.load(open(os.path.join(TOOLS, 'manifest.json')))
W = json.load(open(os.path.join(TOOLS, 'workplaces-staging.json')))
P = json.load(open(os.path.join(HERE, 'prep-state.json'))) if os.path.exists(os.path.join(HERE, 'prep-state.json')) else {}
OPS = [json.loads(l) for l in open(os.path.join(HERE, 'oplog.jsonl'))] if os.path.exists(os.path.join(HERE, 'oplog.jsonl')) else []
SHOP = {'A': W['A']['shop_id'], 'B': W['B']['shop_id'], 'C': (P.get('location_c') or {}).get('shop_id') or '2'}
LOCN = {'A': W['A']['name'], 'B': W['B']['name'], 'C': 'ZZAUTOTEST V1R-87 Location C'}
def shown(r):
    s = SHOP.get(r.get('at') or 'A')
    if r.get('wo_number'): return f"S{s}-{r['wo_number'].split('-')[1]}"
    n = r.get('number') or ''
    for p in ('CM', 'DEP'):
        if n.startswith(p + '-'): return f'{p}{s}-{n.split("-")[1]}'
    return n or r.get('memo') or ''
name = {**{f"cust:{c['key']}": c['name'] for c in M['customers']}, **{f"vendor:{v['key']}": v['name'] for v in M['vendors']}}
print('## Records created AFTER the snapshot (exclude from the comparison)\n')
print('Created on staging by the A/R and A/P regression kit (`v1-regression/live-run-2026-11-11/tools/seed.py staging` and '
      '`staging-seed-2026-11-12/staging_prep.py`), all **after** the "before" capture finished. Every name starts with **ZZAUTOTEST**. '
      'An after-check that finds any of these in a report, a total, a count, a menu or the location switcher must subtract it '
      'before calling anything a regression. Seed anchor: ' + f"`{L.get('anchor_utc')}` (location A {L['anchor_dates']['A']}, B {L['anchor_dates']['B']}). "
      'Source of every row: `v1-regression/live-run-2026-11-11/tools/seeded-staging.json` (ids, numbers, `created_utc`).\n')
print('**Totals move.** These records add open A/R and A/P lines at locations A and B (and one $87.00 invoice at location C), '
      'so every "All customers" / "All vendors" total, bucket count and line count that includes them changes. Compare per party, '
      'and leave out every party whose name starts with "ZZAUTOTEST AR " or "ZZAUTOTEST AP ".\n')
print('### Not documents: locations, roles\n\n| What | Name | Id | Created (UTC) |\n|---|---|---|---|')
for o in OPS:
    if o['op'] in ('create_workplace', 'create_role') and o['http'] in (200, 201):
        print(f"| {'Location (QA lead auto-enrolled; appears in his location switcher)' if o['op'] == 'create_workplace' else 'Custom role (no user holds it outside the run)'} | {o['target']} | `{o.get('workplace_id') or o.get('role_id')}` | {o['utc']} |")
print('\n### Customers and vendors\n\n| Kind | Name | Id | Created (UTC) |\n|---|---|---|---|')
sys.path.insert(0, TOOLS)
from api import call   # read-only: the vendor's own created_at (run 1 created the vendors but lost their ids, so the ledger time is later)
VC = {v['id']: v.get('created_at') for v in call('staging', '/api/parts-catalogue/vendors?search=ZZAUTOTEST&pagination[page]=1&pagination[rowsPerPage]=200')['json']['data']['collection']}
for k in sorted(k for k in L if k.startswith(('cust:', 'vendor:'))):
    r = L[k]; nm = name.get(k) or r.get('name') or ''
    t = (VC.get(r.get('id')) or '').replace(' ', 'T') + 'Z' if k.startswith('vendor:') and VC.get(r.get('id')) else r.get('created_utc', '')
    print(f"| {'Customer' if k.startswith('cust:') else 'Vendor'} | {nm} | `{r.get('id')}` | {t} |")
print('\n### Documents and money movements\n\n| Ledger key | Type | Number on screen | Amount | Dated (location day) | Location | Created (UTC) |\n|---|---|---|---|---|---|---|')
n = 0
for k in sorted(k for k in L if k.startswith(('doc:', 'many:', 'inv:V1R87C'))):
    r = L[k]
    if k.startswith('many:'):
        for i, x in enumerate(r, 1):
            print(f"| {k}#{i} | credit memo | {shown(dict(x, at='A', type='credit_memo'))} | | | {LOCN['A']} | {x.get('created_utc', '')} |"); n += 1
        continue
    at = 'C' if k == 'inv:V1R87C' else (r.get('at') or 'A')
    num = shown(dict(r, at=at))
    print(f"| {k} | {r.get('type') or 'invoice'} | {num} | {r.get('amount') if r.get('amount') is not None else r.get('total', '')} | {r.get('date') or (r.get('created_on') or '')[:10]} | {LOCN[at]} | {r.get('created_utc', '')} |"); n += 1
print(f'\n{n} document rows. Reversed/voided ones are noted in the ledger (`reversed_now`, `voided_now`).')
