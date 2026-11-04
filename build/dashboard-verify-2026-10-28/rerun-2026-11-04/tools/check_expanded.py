#!/usr/bin/env python3
"""Judge expanded panels + report links (screen_expanded.mjs). Every rendered table row must equal the server row it came from;
only one panel open at a time (S6); each report link opens its report on the tile's preset (S10-R5); At Risk has no link (S5-N2)."""
import json, glob, collections, os
rows = []
def rec(wp, key, check, ok, detail, prd): rows.append({'location': wp, 'panel': key, 'check': check, 'result': 'PASS' if ok else 'FAIL', 'detail': detail, 'prd': prd})
def h(x): return f'{x:,.2f}'
def pct(x): return 'n/a' if x is None else f'{x:.2f}%'          # screen shows no thousands separator on percentages
def money(x): return '—' if x is None else ('-' if x < 0 else '') + '$' + f'{abs(x):,.2f}'
def latest(panel, key):
    for r in reversed(panel['requests']):
        d = r['body'].get('data', {})
        if key in d: return d[key]
    return None
EXPECT_LINK = {'revenueKpi': '/reports/sales?range=this_month', 'billingEfficiencyKpi': '/reports/service-advisor-analysis?range=this_month',
               'techEfficiencyKpi': '/reports/technician-efficiency?range=this_month', 'techUtilizationKpi': '/reports/technician-utilization?dateRange=this-month',
               'salesByCustomer': '/reports/sales-by-customer?dateRange=last-12-months'}
for f in sorted(glob.glob('/tmp/cln/dv/out/expanded-*.json')):
    E = json.load(open(f)); wp, wid = E['workplace'], E['id']
    fallback = json.load(open(f'/tmp/cln/dv/rep/{wid}/last_12_months__dash.json'))['body']['data']
    risk = json.load(open(f'/tmp/cln/dv/raw/{wid}/atrisk_120.json'))['body']['data']['atRiskCustomers']
    for p in E['panels']:
        k = p['key']
        rec(wp, k, 'Only one panel open at a time', p['openPanels'] == 1, f'{p["openPanels"]} open', 'S6')
        R = [r for r in p['rows'] if any(c for c in r)]
        if k == 'billingEfficiencyKpi':
            api = {a['advisorName'].strip(): a for a in (latest(p, 'billingEfficiencyByAdvisor') or [])}
            for r in R:
                a = api.get(r[0]); exp = a and [a['advisorName'].strip(), h(a['actualHours']), h(a['billedHours']), pct(a['efficiencyPct']), money(a['elr'])]
                rec(wp, k, 'Advisor row = server row', a is not None and r[:5] == exp, f'screen {r[:5]} vs {exp}', 'S6 / S3-R2 ELR')
        elif k == 'techEfficiencyKpi':
            api = {a['staffName'].strip(): a for a in (latest(p, 'techPerformance') or [])}
            for r in R:
                a = api.get(r[0]); exp = a and [a['staffName'].strip(), h(a['hoursLogged']), h(a['hoursBilled']), pct(a['efficiency'])]
                rec(wp, k, 'Technician row = server row', a is not None and r[:4] == exp, f'screen {r[:4]} vs {exp}', 'S6')
        elif k == 'techUtilizationKpi':
            api = {a['techName'].strip(): a for a in (latest(p, 'techUtilization') or [])}
            for r in R:
                a = api.get(r[0]); exp = a and [a['techName'].strip(), h(a['woHours']), h(a['internalHours']), h(a['totalHours']), pct(a['utilizationPct'])]
                rec(wp, k, 'Utilization row = server row', a is not None and r[:5] == exp, f'screen {r[:5]} vs {exp}', 'S6')
        elif k == 'salesByCustomer':
            src = latest(p, 'topCustomers') or fallback['topCustomers']
            if wp == 'DVI Test': src = json.load(open('/tmp/cln/dv/snap/S8-after-discount-invoice.json'))  and src
            api = {(c['companyName'] or '').strip(): c for c in src['customers']}
            for r in R:
                c = api.get(r[0]); exp = c and [c['companyName'].strip(), str(c['invoiceCount']), (('+' + h(c['laborDelta'])) if c['laborDelta'] > 0 else (f'({h(c["laborDelta"])})' if c['laborDelta'] < 0 else h(c['laborDelta']))), money(c['revenue'])]
                rec(wp, k, 'Customer row = server row', c is not None and r[:4] == exp, f'screen {r[:4]} vs {exp}', 'S5 / S6')
            rec(wp, k, 'Table lists at most 15 customers (top 15)', len(src['customers']) <= 15, f'{len(src["customers"])} rows from server', 'S6')
        elif k == 'atRiskHero':
            api = {(c['companyName'] or '').strip(): c for c in risk['customers']}
            for r in R:
                c = api.get(r[0]); rec(wp, k, 'At Risk row is an at-risk customer from the server', c is not None, f'screen {r[:4]}', 'S5-R12')
            rv = [c['revenueLast12mo'] for c in risk['customers']]
            rec(wp, k, 'At Risk list sorted by 12-month revenue, highest first', rv == sorted(rv, reverse=True), f'{len(rv)} customers', 'S6 (C88613 wording)')
    for l in E['links']:
        exp = EXPECT_LINK[l['key']]
        rec(wp, l['key'], 'Report link opens the matching report on the tile preset', l['href'] == exp and (l['landed'] or '').split('shopview.com')[-1].split('?')[0] == exp.split('?')[0],
            f'href {l["href"]} landed {l["landed"]} filter "{(l["filterText"] or "")[:60]}"', 'S10-R1..R8')
    rec(wp, 'atRiskHero', 'At Risk tile has no report link', all(l['atRiskHasLink'] == 0 for l in E['links']), 'link count 0', 'S5-N2')
json.dump(rows, open('/tmp/cln/dv/out/expanded.json', 'w'), indent=0)
print('TOTAL', len(rows), collections.Counter(r['result'] for r in rows))
for r in [r for r in rows if r['result'] == 'FAIL'][:20]: print('  FAIL', r['location'][:20], r['panel'], r['check'], '|', r['detail'][:200])
