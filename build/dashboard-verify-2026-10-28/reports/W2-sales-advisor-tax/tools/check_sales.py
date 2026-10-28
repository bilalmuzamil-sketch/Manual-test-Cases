#!/usr/bin/env python3
"""Sales report: every column not covered by the dashboard pass, for every invoice row of the 16 cached
ranges x 4 locations, against the work order's own Stats tab (GET /api/work-orders/statistics/{id}) —
the record SV-6344 / SV-2463 say the report must match — plus the SV-2107 formulas, SV-5314 credit
rows, and the totals row (SV-2107: percentages recomputed from the totals, never averaged).
Output ../results-sales.json. SECRET-FREE."""
import json, os, sys, glob, collections, datetime as dt
sys.path.insert(0, os.path.dirname(__file__))
from common import *
from records import stats, stat_totals, prefetch
OUTF = os.path.join('/tmp/cln/w2/full', 'results-sales.json')
rows = []
def add(loc, rng, check, ok, detail, src, level='invoice', key=''):
    rows.append({'report': 'Sales', 'location': loc, 'range': rng, 'level': level, 'key': key, 'check': check,
                 'result': ok if isinstance(ok, str) else ('PASS' if ok else 'FAIL'), 'detail': detail, 'source': src})
pct = lambda n, d: None if not d else round(n / d * 100, 2)
near = lambda a, b, tol=0.011: (a is None and b is None) or (a is not None and b is not None and abs(a - b) <= tol)
for wid, name, tz in WORKPLACES:
    per = {}
    for lab in ranges(dt.date(2026, 10, 28)):
        p = f'/tmp/cln/dv/rep/{wid}/{lab}__sales.json'
        if not os.path.exists(p): continue
        j = json.load(open(p))
        if j['status'] != 200: add(name, lab, 'Report loads', False, f'HTTP {j["status"]}', '', 'range'); continue
        col, tot = j['body']['data']['collection'], j['body']['data']['totals']
        for r in col: per[r['document_id']] = r
        # ---- dates inside the window (credit rows included)
        f, t = dt.date.fromisoformat(j['from']), dt.date.fromisoformat(j['to'])
        outside = [r['invoice_number'] for r in col if not (f <= dt.datetime.strptime(r['invoice_date'], '%b %d %Y').date() <= t)]
        add(name, lab, 'Every row (invoices and credit memos) is dated inside the chosen dates', not outside, f'{j["from"]}..{j["to"]} outside: {outside[:5]}', 'SV-2107 / SV-5314', 'range')
        # ---- totals = sums; percentages recomputed (SV-2107)
        S = lambda k: round(sum((r.get(k) or 0) for r in col), 2)
        checks = {
            'hours_worked': S('hours_worked'), 'hours_invoiced': S('hours_invoiced'), 'labor_invoiced': S('labor_invoiced'),
            'parts_invoiced': S('parts_invoiced'), 'parts_cost': S('parts_cost'), 'total_profit': S('total_profit'), 'total_invoiced': S('total_invoiced')}
        bad = {k: (tot.get(k), v) for k, v in checks.items() if not near(tot.get(k), v, 0.015 + 0.0001 * abs(v))}
        add(name, lab, 'Totals row: Inv. Hrs, hours worked, Labor Invoiced, Parts Invoiced, Parts Cost, Profit, Subtotal = sum of the rows', not bad, str(bad), 'SV-2107', 'range')
        lc = S('labor_cost')
        exp = {'labor_efficiency': pct(checks['hours_invoiced'], checks['hours_worked']),
               'labor_margin': pct(checks['labor_invoiced'] - lc, checks['labor_invoiced']),
               'parts_margin': pct(checks['parts_invoiced'] - checks['parts_cost'], checks['parts_invoiced']),
               'total_margin': pct(checks['total_profit'], checks['labor_invoiced'] + checks['parts_invoiced'])}
        bad = {k: (tot.get(k), v) for k, v in exp.items() if not near(tot.get(k), v, 0.02)}
        add(name, lab, 'Totals row percentages are recalculated from the totals (Billing Efficiency, Labor Margin, Parts Margin, Margin)', not bad, str(bad), 'SV-2107 "NOT an average"', 'range')
    ids = [i for i, r in per.items() if not r['is_credit']]
    sts = dict(zip(ids, prefetch([(per[i]['work_order_id'], wid) for i in ids], stats)))
    for iid in ids:
        r = per[iid]; num = r['invoice_number']; st = stat_totals(sts[iid])
        if not st or not st['hours_data']:
            ok = all(not r[k] for k in ('hours_worked', 'hours_invoiced', 'labor_invoiced', 'parts_invoiced', 'parts_cost', 'total_invoiced'))
            add(name, '2y', 'Work order with no lines on its Stats tab shows 0 in every column', ok, num, ''); continue
        nl = max(1, len(st['hours_data_lines']))
        H, L, P = st['hours_data'], st['labor_data'], st['parts_data']
        add(name, '2y', 'Inv. Hrs = billed hours on the work order (Stats tab estimated hours)', near(r['hours_invoiced'], H['estimated_hours'], 0.006 * nl + 0.001), f'{num} report {r["hours_invoiced"]} vs stats {H["estimated_hours"]}', 'SV-2107, SV-2881')
        add(name, '2y', 'Hours worked behind Billing Efficiency = clocked hours on the work order (Stats tab)', near(r['hours_worked'], H['clocked_hours'], 0.006 * nl + 0.02), f'{num} report {r["hours_worked"]} vs stats {H["clocked_hours"]}', 'SV-2463 "It needs to match the statistics tab"')
        be = pct(r['hours_invoiced'], r['hours_worked'])
        add(name, '2y', 'Billing Efficiency = Inv. Hrs / hours clocked x 100; N/A when nothing clocked', near(r['labor_efficiency'], be, 0.011), f'{num} report {r["labor_efficiency"]} vs {be}', 'SV-2107 Labor Efficiency Row')
        add(name, '2y', 'Labor Invoiced = labor sell on the Stats tab', near(r['labor_invoiced'], L['sell_price'], 0.011), f'{num} report {r["labor_invoiced"]} vs stats {L["sell_price"]}', 'SV-2107')
        add(name, '2y', 'Labor cost behind Labor Margin = labor cost on the Stats tab', near(r['labor_cost'], L['cost'], 0.011 + 0.0005 * abs(L['cost'])), f'{num} report {r["labor_cost"]} vs stats {L["cost"]}', 'SV-2107 Labor Margin Row')
        lm = pct(r['labor_invoiced'] - r['labor_cost'], r['labor_invoiced'])
        add(name, '2y', 'Labor Margin = (Labor Invoiced - labor cost) / Labor Invoiced x 100', near(r['labor_margin'], lm, 0.011), f'{num} report {r["labor_margin"]} vs {lm}', 'SV-2107')
        add(name, '2y', 'Parts Invoiced = parts sell on the Stats tab', near(r['parts_invoiced'], P['sell_price'], 0.011), f'{num} report {r["parts_invoiced"]} vs stats {P["sell_price"]}', 'SV-2107')
        add(name, '2y', 'Parts Cost = parts cost on the work order Stats tab', near(r['parts_cost'], P['cost'], 0.011), f'{num} report {r["parts_cost"]} vs stats {P["cost"]}', 'SV-6344 Expected Result')
        pm = pct(r['parts_invoiced'] - r['parts_cost'], r['parts_invoiced'])
        add(name, '2y', 'Parts Margin = (Parts Invoiced - Parts Cost) / Parts Invoiced x 100', near(r['parts_margin'], pm, 0.011), f'{num} report {r["parts_margin"]} vs {pm}', 'SV-2107', key='pi0' if not r['parts_invoiced'] else '')
        prof = round((r['labor_invoiced'] - r['labor_cost']) + (r['parts_invoiced'] - r['parts_cost']), 2)
        add(name, '2y', 'Profit = (Labor Invoiced - labor cost) + (Parts Invoiced - Parts Cost)', near(r['total_profit'], prof, 0.011), f'{num} report {r["total_profit"]} vs {prof}', 'SV-2107 Total Margin Row (total sell - total cost)')
        add(name, '2y', 'Profit = total margin on the work order Stats tab', near(r['total_profit'], st['total_data']['margin'], 0.02), f'{num} report {r["total_profit"]} vs stats {st["total_data"]["margin"]}', 'SV-6344')
        mg = pct(r['total_profit'], r['labor_invoiced'] + r['parts_invoiced'])
        add(name, '2y', 'Margin = Profit / (Labor Invoiced + Parts Invoiced) x 100', near(r['total_margin'], mg, 0.011), f'{num} report {r["total_margin"]} vs {mg}', 'SV-2107 Total Margin Row')
    for iid, r in per.items():
        if not r['is_credit']: continue
        num = r['invoice_number']
        neg = all((r[k] or 0) <= 0 for k in ('parts_invoiced', 'total_invoiced'))
        add(name, '2y', 'Credit memo row: Parts Invoiced and Subtotal are negative', neg, f'{num} parts {r["parts_invoiced"]} subtotal {r["total_invoiced"]}', 'SV-5314 AC2', 'credit')
        add(name, '2y', 'Credit memo row: Profit = Parts Invoiced - Parts Cost (a credit reverses the original profit or loss)', near(r['total_profit'], round(r['parts_invoiced'] - r['parts_cost'], 2)), f'{num} profit {r["total_profit"]} parts {r["parts_invoiced"]} cost {r["parts_cost"]}', 'SV-6101', 'credit')
        add(name, '2y', 'Credit memo row: no hours, no labor', not any(r[k] for k in ('hours_worked', 'hours_invoiced', 'labor_invoiced')), num, 'SV-5314', 'credit')
        add(name, '2y', 'Credit memo row shows the credit number and no work-order link', r['work_order_id'] is None and (r['credit_number'] or '').startswith('C'), num, 'SV-5314 AC3/AC4', 'credit')
        pmc = None if not r['parts_invoiced'] else round(-abs((r['parts_invoiced'] - r['parts_cost']) / r['parts_invoiced'] * 100), 2) if r['parts_invoiced'] - r['parts_cost'] < 0 else round(abs((r['parts_invoiced'] - r['parts_cost']) / r['parts_invoiced'] * 100), 2)
        add(name, '2y', 'Credit memo row: Parts Margin sign follows the profit (negative when the credit takes profit away)', near(r['parts_margin'], pmc), f'{num} report {r["parts_margin"]} vs {pmc}', 'SV-5314 AC2 + SV-6101', 'credit')
json.dump(rows, open(OUTF, 'w'), indent=0)
by = collections.defaultdict(collections.Counter)
for r in rows: by[r['check']][r['result']] += 1
for k, v in by.items(): print(dict(v), '|', k)
print('TOTAL', collections.Counter(r['result'] for r in rows))
