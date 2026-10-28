#!/usr/bin/env python3
"""Shop Efficiency (Reports > Shop Efficiency) — written source: SV-2116 (Fabian Bonjean, PO, 2023/2024:
"calculates the total hours clocked in a time period (on all work orders, and department jobs) and compares
that against total hours invoiced for the same time period"; billable employees only; "Efficiency = Hours
invoiced divided by hours clocked * 100"; comments: "If the work order did not get invoiced, it would not
calculate them. If the lines are declined, it also does not calculate them.") and SV-2881 (Shop Billing
Efficiency 'Total Hours Invoiced' and Sales 'Total Invoiced Hours' "should be the same").
Paired live read per location x range: Shop Efficiency, Sales (custom window), TU (clocked, billable),
Timesheet Activities footer. Writes results-se.json.
"""
import json, collections, datetime as dt
from zoneinfo import ZoneInfo
import w1env
from w1env import curl, get, instants, WORKPLACES

OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/reports/W1-labor-wip/results-se.json'
res = []


def chk(cid, wid, rng, ok, detail, ref):
    res.append({'check': cid, 'scope': wid, 'range': rng, 'result': 'PASS' if ok else 'FAIL', 'detail': detail, 'spec': ref})


def ranges(today):
    first = today.replace(day=1); lm_end = first - dt.timedelta(days=1)
    wk0 = today - dt.timedelta(days=(today.weekday() + 1) % 7)
    return {'today': (today, today), 'yesterday': (today - dt.timedelta(days=1),) * 2, 'this_week': (wk0, today),
            'last_week': (wk0 - dt.timedelta(days=7), wk0 - dt.timedelta(days=1)), 'this_month': (first, today),
            'last_month': (lm_end.replace(day=1), lm_end), 'custom_0915_1014': (dt.date(2026, 9, 15), dt.date(2026, 10, 14)),
            'this_year': (dt.date(today.year, 1, 1), today), 'last_year': (dt.date(2025, 1, 1), dt.date(2025, 12, 31))}


for wid, name, tz in WORKPLACES:
    curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz})
    today = dt.datetime.now(ZoneInfo(tz)).date()
    for rng, (f, t) in ranges(today).items():
        s, e = instants(f, t, tz); win = [('range', 'custom'), ('start_date', s), ('end_date', e)]
        c, se = get('/api/reporting/shop-billing-efficiency/custom', win, wid)
        c2, sa = get('/api/reporting/sales/custom', win, wid)
        c3, tu = get('/api/reporting/reports/technician-utilization', win + [('locations', wid), ('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)], wid)
        if c != 200 or c2 != 200 or c3 != 200:
            chk('S0-200', wid, rng, False, {'se': c, 'sales': c2, 'tu': c3}, '-'); continue
        T = se['data']['totals']
        clocked, inv, diff, eff = T['total_clocked_hours'], T['total_invoiced_hours'], T['difference'], T['efficiency']
        # S1 internal: difference and efficiency (SV-2116 formula)
        chk('S1-difference=invoiced-clocked', wid, rng, abs(diff - round(inv - clocked, 2)) < 0.011, {'diff': diff, 'inv': inv, 'clocked': clocked}, 'SV-2116 spreadsheet (Difference)')
        exp_eff = round(inv / clocked * 100, 2) if clocked else None
        chk('S1-efficiency=invoiced/clocked*100', wid, rng, (eff is None and exp_eff is None) or (eff is not None and exp_eff is not None and abs(eff - exp_eff) < 0.011),
            {'eff': eff, 'expected': exp_eff}, 'SV-2116 "Efficiency = Hours invoiced divided by hours clocked * 100"')
        # S2 invoiced hours = Sales report Total Invoiced Hours (SV-2881)
        sales_h = sa['data']['totals']['hours_invoiced']
        rows_h = round(sum((r['hours_invoiced'] or 0) for r in sa['data']['collection'] if not r['is_credit']), 2)
        chk('S2-invoiced=Sales-total-invoiced-hours', wid, rng, abs(inv - sales_h) < 0.011, {'SE': inv, 'Sales': sales_h, 'Sales_rows': rows_h, 'invoices': len(sa['data']['collection'])}, 'SV-2881 "These numbers should be the same"')
        # S3 clocked hours = billable clocked time in the dates (TU = billable staff, every clock cut to the dates)
        tu_h = round(tu['data']['summary']['total_seconds'] / 3600, 2)
        chk('S3-clocked=TU-total(billable)', wid, rng, abs(clocked - tu_h) < 0.011, {'SE': clocked, 'TU': tu_h}, 'SV-2116 "total hours clocked ... (on all work orders, and department jobs)"; billable only')
        print(name[:14], rng, 'SE', clocked, inv, diff, eff, '| Sales', sales_h, '| TU', tu_h, flush=True)

json.dump(res, open(OUT, 'w'), indent=0)
tl = collections.Counter((r['check'], r['result']) for r in res)
for (c, rr), n in sorted(tl.items()):
    print(f'{c:42s} {rr} {n}')
for r in res:
    if r['result'] == 'FAIL':
        print('FAIL', r['check'], r['scope'][:8], r['range'], json.dumps(r['detail'])[:220])
