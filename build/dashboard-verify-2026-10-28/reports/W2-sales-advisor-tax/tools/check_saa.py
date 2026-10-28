#!/usr/bin/env python3
"""Advisor Analysis (Service Advisor Analysis): every column, every row of the 16 cached ranges x 4
locations, against the work order Stats tab, the WO lines record, the invoice record and the work-order
list; the advisor filter for every advisor (last 12 months); the totals row (SV-2108 / SV-2489).
Output ../results-saa.json. SECRET-FREE."""
import json, os, sys, math, collections, datetime as dt
sys.path.insert(0, os.path.dirname(__file__))
from common import *
from records import stats, stat_totals, prefetch, invoice, money
OUTF = os.path.join('/tmp/cln/w2/full', 'results-saa.json')
rows = []
def add(loc, rng, check, ok, detail, src, level='row', key=''):
    rows.append({'report': 'Advisor Analysis', 'location': loc, 'range': rng, 'level': level, 'key': key, 'check': check,
                 'result': ok if isinstance(ok, str) else ('PASS' if ok else 'FAIL'), 'detail': detail, 'source': src})
pct = lambda n, d: None if not d else round(n / d * 100, 2)
near = lambda a, b, tol=0.011: (a is None and b is None) or (a is not None and b is not None and abs(a - b) <= tol)
wolist = {w['id']: w for w in json.load(open('/tmp/cln/dv/wolist.json'))[list(json.load(open('/tmp/cln/dv/wolist.json')).keys())[0]]} if False else {}
WL = json.load(open('/tmp/cln/dv/wolist.json'))
for v in WL.values():
    if isinstance(v, list):
        for w in v: wolist[w['id']] = w
for wid, name, tz in WORKPLACES:
    per, doc = {}, {}
    for lab in ranges(dt.date(2026, 10, 28)):
        ps = f'/tmp/cln/dv/rep/{wid}/{lab}__sales.json'
        if os.path.exists(ps):
            for r in json.load(open(ps))['body']['data']['collection']:
                if r['work_order_id']: doc[r['work_order_id']] = r['document_id']
        p = f'/tmp/cln/dv/rep/{wid}/{lab}__saa.json'
        if not os.path.exists(p): continue
        j = json.load(open(p))
        if j['status'] != 200: add(name, lab, 'Report loads', False, f'HTTP {j["status"]}', '', 'range'); continue
        col, tot = j['body']['data']['collection'], j['body']['data']['totals']
        for r in col: per[(r['work_order_id'], r['invoice_number'])] = r
        f, t = dt.date.fromisoformat(j['from']), dt.date.fromisoformat(j['to'])
        out = [r['invoice_number'] for r in col if not (f <= dt.datetime.strptime(r['invoice_date'], '%b %d %Y').date() <= t)]
        add(name, lab, 'Every row is dated inside the chosen dates', not out, str(out[:5]), 'SV-2108', 'range')
        dup = [k for k, n in collections.Counter(r['work_order_id'] for r in col).items() if n > 1]
        add(name, lab, 'Each work order appears once', not dup, str(dup[:3]), 'formula ref (no written rule)', 'range')
        noadv = [r['invoice_number'] for r in col if not r['advisor']]
        add(name, lab, 'Every row has an advisor', not noadv, str(noadv[:3]), 'SV-2108', 'range')
        S = lambda k: round(sum((r.get(k) or 0) for r in col), 2)
        sums = {k: S(k) for k in ('days_open', 'lines_count', 'hours_worked', 'hours_invoiced', 'hours_profit', 'parts_cost', 'parts_invoiced', 'parts_profit', 'total_profit', 'invoice_subtotal')}
        bad = {k: (tot.get(k), v) for k, v in sums.items() if not near(tot.get(k), v, 0.015 + 0.0001 * abs(v))}
        add(name, lab, 'Totals row = sum of the rows (Days Open, Lines, Hrs Worked, Hrs Invoiced, Labor Delta, Parts Cost/Invoiced/Profit, Total Profit, Subtotal)', not bad, str(bad), 'SV-2108 / SV-2489', 'range')
        li = S('labor_invoiced')
        exp = {'labor_efficiency': pct(sums['hours_invoiced'], sums['hours_worked']), 'effective_labor_rate': None if not sums['hours_worked'] else round(li / sums['hours_worked'], 2),
               'parts_margin': pct(sums['parts_profit'], sums['parts_invoiced']), 'total_margin': pct(sums['total_profit'], li + sums['parts_invoiced'])}
        bad = {k: (tot.get(k), v) for k, v in exp.items() if not near(tot.get(k), v, 0.02)}
        add(name, lab, 'Totals row Billing Efficiency, ELR, Parts Margin, Total Margin recalculated from the totals', not bad, str(bad), 'SV-2108 "TOTAL = SUM(...)/SUM(...)"', 'range')
    keys = list(per)
    sts = dict(zip(keys, prefetch([(k[0], wid) for k in keys], stats)))
    for k in keys:
        r = per[k]; num = r['invoice_number']; st = stat_totals(sts[k])
        if not st or not st['hours_data']:
            ok = all(not r[k] for k in ('hours_worked', 'hours_invoiced', 'labor_invoiced', 'parts_invoiced', 'parts_cost', 'invoice_subtotal'))
            add(name, '2y', 'Work order with no lines on its Stats tab shows 0 in every column', ok, num, ''); continue
        H, L, P, T = st['hours_data'], st['labor_data'], st['parts_data'], st['total_data']
        nl = max(1, len(st['hours_data_lines']))
        add(name, '2y', 'Lines = number of lines on the work order that were not declined', r['lines_count'] == len(st['hours_data_lines']), f'{num} report {r["lines_count"]} vs Stats tab lines {len(st["hours_data_lines"])}', 'formula ref (no written rule)')
        add(name, '2y', 'Labor Delta = Hrs Invoiced - Hrs Worked', near(r['hours_profit'], round(r['hours_invoiced'] - r['hours_worked'], 2)), f'{num} {r["hours_profit"]} vs {r["hours_invoiced"]}-{r["hours_worked"]}', 'SV-2108 hour profit; SV-9200')
        add(name, '2y', 'Hrs Worked = clocked hours on the Stats tab (re-confirm)', near(r['hours_worked'], H['clocked_hours'], 0.006 * nl + 0.02), f'{num} {r["hours_worked"]} vs {H["clocked_hours"]}', 'SV-2108')
        add(name, '2y', 'Hrs Invoiced = billed hours on the Stats tab (re-confirm)', near(r['hours_invoiced'], H['estimated_hours'], 0.006 * nl + 0.001), f'{num} {r["hours_invoiced"]} vs {H["estimated_hours"]}', 'SV-2108')
        add(name, '2y', 'Billing Efficiency = Hrs Invoiced / Hrs Worked x 100; N/A when nothing clocked', near(r['labor_efficiency'], pct(r['hours_invoiced'], r['hours_worked'])), f'{num} {r["labor_efficiency"]}', 'SV-2108 Labor Efficiency Row')
        add(name, '2y', 'Labor billed (behind ELR / Total Profit) = labor sell on the Stats tab', near(r['labor_invoiced'], L['sell_price']), f'{num} {r["labor_invoiced"]} vs {L["sell_price"]}', 'SV-2108 ELR')
        elr = None if not r['hours_worked'] else round(r['labor_invoiced'] / r['hours_worked'], 2)
        add(name, '2y', 'ELR = labor sold / hours clocked', near(r['effective_labor_rate'], elr, 0.011), f'{num} report {r["effective_labor_rate"]} vs {elr}', 'SV-2108 ELR')
        add(name, '2y', 'Parts Cost = parts cost on the Stats tab', near(r['parts_cost'], P['cost']), f'{num} {r["parts_cost"]} vs {P["cost"]}', 'SV-6344 (same rule as Sales)')
        add(name, '2y', 'Parts Invoiced = parts sell on the Stats tab', near(r['parts_invoiced'], P['sell_price']), f'{num} {r["parts_invoiced"]} vs {P["sell_price"]}', 'SV-2108')
        add(name, '2y', 'Parts Profit = Parts Invoiced - Parts Cost', near(r['parts_profit'], round(r['parts_invoiced'] - r['parts_cost'], 2)), num, 'SV-2108')
        add(name, '2y', 'Parts Margin = Parts Profit / Parts Invoiced x 100', near(r['parts_margin'], pct(r['parts_profit'], r['parts_invoiced'])), f'{num} {r["parts_margin"]}', 'SV-2108 Parts Margin')
        tp = round(r['labor_invoiced'] - L['cost'] + r['parts_profit'], 2)
        add(name, '2y', 'Total Profit = (labor sold - labor cost) + Parts Profit (Stats tab labor cost)', near(r['total_profit'], tp, 0.02 + 0.0005 * abs(L['cost'])), f'{num} report {r["total_profit"]} vs {tp} (stats total margin {T["margin"]})', 'SV-2108 Total Margin Row')
        add(name, '2y', 'Total Margin = Total Profit / (labor sold + Parts Invoiced) x 100', near(r['total_margin'], pct(r['total_profit'], r['labor_invoiced'] + r['parts_invoiced'])), f'{num} {r["total_margin"]}', 'SV-2108 Total Margin Row')
        iid = doc.get(r['work_order_id']); v = invoice(iid, wid) if iid else None
        if v:
            add(name, '2y', 'Subtotal = the invoice subtotal on the invoice record', near(r['invoice_subtotal'], money(v['sub_total_display']) + (money(v['sub_total_display']) * 0 )) or near(r['invoice_subtotal'], round(money(v['sub_total_with_tax']) - float(v['tax'].get('amountTotal') or 0), 2)), f'{num} report {r["invoice_subtotal"]} vs invoice {v["sub_total_display"]} / pre-tax {round(money(v["sub_total_with_tax"]) - float(v["tax"].get("amountTotal") or 0),2)}', 'SV-2108')
            w = wolist.get(r['work_order_id'])
            if w and w.get('startDate'):
                start = dt.datetime.fromisoformat(w['startDate']).replace(tzinfo=dt.timezone.utc)
                made = dt.datetime.fromisoformat(v['created_on'])
                exp = math.ceil((made - start).total_seconds() / 86400)
                add(name, '2y', 'Days Open = days from the work order start to the invoice (rounded up)', r['days_open'] == exp, f'{num} report {r["days_open"]} vs {exp} (start {w["startDate"]} invoice {v["created_on"]})', 'formula ref (no written rule)')
    # ---- advisor filter (SV-2489: totals follow the filter)
    p = os.path.join(RAW, wid, 'saa_staff__last_12_months.json')
    if os.path.exists(p):
        base = json.load(open(f'/tmp/cln/dv/rep/{wid}/last_12_months__saa.json'))['body']['data']['collection']
        for a in json.load(open(p)):
            nm = ' '.join(x for x in [a['advisor'].get('first_name') or a['advisor'].get('firstName'), a['advisor'].get('last_name') or a['advisor'].get('lastName')] if x)
            if a['status'] != 200:
                add(name, 'last_12_months', 'Advisor filter loads', False, f'{nm} HTTP {a["status"]}', '', 'filter'); continue
            known = {r['invoice_number'] for r in base}
            got = sorted(r['invoice_number'] for r in a['rows'] if r['invoice_number'] in known)   # rows invoiced after the cached read are left out
            exp = sorted(r['invoice_number'] for r in base if (r['advisor'] or '').strip() == nm.strip())
            if not got and not exp: continue
            add(name, 'last_12_months', 'Advisor filter shows exactly that advisor\'s rows', got == exp, f'{nm}: filtered {len(got)} vs unfiltered rows for that advisor {len(exp)}; diff {sorted(set(got)^set(exp))[:5]}', 'SV-2108 filter by advisor', 'filter', nm)
            tot = a['totals']; s = round(sum(r['invoice_subtotal'] for r in a['rows']), 2)
            add(name, 'last_12_months', 'Advisor filter: Totals row = that advisor\'s rows only', near(tot.get('invoice_subtotal'), s, 0.02) and near(tot.get('hours_worked'), round(sum(r['hours_worked'] for r in a['rows']), 2), 0.02), f'{nm}: totals subtotal {tot.get("invoice_subtotal")} vs rows {s}', 'SV-2489', 'filter', nm)
json.dump(rows, open(OUTF, 'w'), indent=0)
by = collections.defaultdict(collections.Counter)
for r in rows: by[r['check']][r['result']] += 1
for k, v in by.items(): print(dict(v), '|', k)
print('TOTAL', collections.Counter(r['result'] for r in rows))
