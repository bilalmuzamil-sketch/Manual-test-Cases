#!/usr/bin/env python3
"""All-locations scope (S4-R6, S4-R12a; SBR S21-R4/R8) and the Customer filter (S18-R5/R6/R11). SECRET-FREE."""
import json, os, sys, collections
sys.path.insert(0, os.path.dirname(__file__))
from common import *
R = json.load(open(os.path.join(RAW, 'multi', 'multi.json')))
MONEY = ['labor_invoiced', 'labor_margin', 'parts_invoiced', 'parts_margin', 'shop_supplies', 'adjustments', 'margin', 'subtotal']
rows = []
def add(rep, check, ok, detail, src):
    rows.append({'report': rep, 'location': 'All locations', 'range': 'last_12_months (Heavy Duty time zone)', 'check': check, 'result': 'PASS' if ok else 'FAIL', 'detail': detail, 'source': src})
for rep, pre, key in (('Sales By Customer', '', 'customer_name'), ('Sales By Representative', 'sbr_', 'rep_name')):
    exp = collections.defaultdict(collections.Counter); locs = collections.defaultdict(set)
    for wid, n, z in WORKPLACES:
        for c in R[pre + wid]['data']['collection']:
            for m in MONEY + ['invoice_count']: exp[c['key']][m] += c[m]
            locs[c['key']].add(n)
    got = {c['key']: c for c in R[pre + 'all']['data']['collection']}
    add(rep, 'All locations = the same rows as each location added together (every money column and the count)', set(got) == set(exp) and all(all(got[k][m] == exp[k][m] for m in MONEY + ['invoice_count']) for k in got),
        f'{len(got)} rows vs {len(exp)}; differing {[got[k][key] for k in got if k in exp and any(got[k][m]!=exp[k][m] for m in MONEY)][:5]}', 'SBC S4-R6 / SBR S21-R3,R4')
    bad = [(got[k][key], got[k]['location'], sorted(locs[k])) for k in got if (got[k]['location'] == 'Multiple') != (len(locs[k]) > 1) or (len(locs[k]) == 1 and got[k]['location'] != next(iter(locs[k])))]
    add(rep, 'Location column reads "Multiple" exactly when the row spans more than one location, else the location name', not bad, str(bad[:5]), 'SBC S4-R12a / SBR S21-R8')
    tot = R[pre + 'all']['data']['totals']
    add(rep, 'All-locations Totals = sum of the rows', all(tot[m] == sum(c[m] for c in got.values()) for m in MONEY), '', 'SBC S18-R6 / SBR S10-R5')
hd = WID['Staging Heavy Duty - 9919']
base = {c['key']: c for c in R[hd]['data']['collection']}
bad = []
for k, r in R['by_customer'].items():
    col = r['body']['data']['collection'] if r['status'] == 200 else None
    if col is None or len(col) != 1 or col[0]['key'] != k or any(col[0][m] != base[k][m] for m in MONEY + ['invoice_count']) or any(r['body']['data']['totals'][m] != base[k][m] for m in MONEY):
        bad.append((base[k]['customer_name'], r['status'], len(col or [])))
add('Sales By Customer', f'Customer filter with one customer shows only that customer, same figures, Totals = that customer ({len(R["by_customer"])} customers)', not bad, str(bad[:5]), 'S18-R5, S18-R6, S18-R11')
c2, b2 = R['two_customers']
keys = [c['key'] for c in b2['data']['collection']]
add('Sales By Customer', 'Customer filter with two customers shows exactly those two; Totals = their sum', c2 == 200 and len(keys) == 2 and all(b2['data']['totals'][m] == sum(c[m] for c in b2['data']['collection']) for m in MONEY), str(keys), 'S18-R6')
json.dump(rows, open(os.path.join('/tmp/cln/w2/full', 'results-multi.json'), 'w'), indent=0)
for r in rows: print(r['result'], r['report'], '|', r['check'], '|', r['detail'][:200])
