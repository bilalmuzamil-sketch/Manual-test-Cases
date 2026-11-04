#!/usr/bin/env python3
"""Layer C5 — At Risk Customers recomputed from the full invoice history (no report exists; the PRD is the only definition).

PRD v53 S3-R2: "the count of customers whose most recent invoice is at least the selected number of days old, and who also
have either two or more lifetime invoices or some revenue in the last twelve months."  S5-R15: "some revenue" = revenue
> $0.00 over the trailing twelve months, measured like the Revenue tile (subtotals before discount/tax, minus credit
memos).  S3-E2: void invoices count nowhere.  S5-R13: twelve-month trailing window.  Days are calendar days in the
workplace timezone (code note; the PRD says "days old").  History: Sales report, consecutive 366-day windows back until empty.
SECRET-FREE. Output /tmp/cln/dv/out/oracle_atrisk.json
"""
import json, os, sys, datetime as dt, collections
from zoneinfo import ZoneInfo
sys.path.insert(0, os.path.dirname(__file__))
from collect_dashboard import curl, WORKPLACES, ranges
from collect_reports import instants
from urllib.parse import urlencode

HIST = '/tmp/cln/dv/hist'; os.makedirs(HIST, exist_ok=True)
out = []
for wid, name, tz in WORKPLACES:
    curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz})   # session tz drives report dates
    z = ZoneInfo(tz); today = dt.datetime.now(z).date()
    rows, end = [], today
    for k in range(12):                                         # up to 12 years back
        start = end - dt.timedelta(days=365)
        p = f'{HIST}/{wid}_{start}_{end}.json'
        if not os.path.exists(p):
            s, e = instants(start, end, tz)
            c, b = curl('GET', '/api/reporting/sales/custom?' + urlencode([('range', 'custom'), ('start_date', s), ('end_date', e)]), extra_headers={'X-Location-ID': wid})
            json.dump(b, open(p, 'w'))
        col = json.load(open(p))['data']['collection']
        rows += col
        if not col: break
        end = start - dt.timedelta(days=1)
    # customer key: the Sales rows carry the customer name; the dashboard keys by company id -> compare by name
    inv = collections.defaultdict(list); cred = collections.defaultdict(float)
    m11 = ranges(today)['last_12_months'][0]
    for r in rows:
        d = dt.datetime.strptime(r['invoice_date'], '%b %d %Y').date()
        c = (r['customer_service'] or '').strip()
        if r['is_credit']:
            if d >= m11: cred[c] += r['total_invoiced']      # credit rows carry the credit (sign as the report gives it)
        else:
            inv[c].append((d, r['total_invoiced']))
    data = {}
    for c, L in inv.items():
        last = max(d for d, _ in L)
        rev12 = round(sum(v for d, v in L if d >= m11) + cred.get(c, 0), 2)
        data[c] = {'last': last, 'lifetime': len(L), 'rev12': rev12, 'days': (today - last).days}
    for rd in (30, 60, 90, 120, 180):
        mine = {c for c, v in data.items() if c and c != '(No company)' and v['days'] >= rd and (v['lifetime'] >= 2 or v['rev12'] > 0)}
        dash = json.load(open(f'/tmp/cln/dv/raw/{wid}/atrisk_{rd}.json'))['body']['data']['atRiskCustomers']
        dn = {x['companyName'].strip(): x for x in dash['customers']}
        onlyd, onlym = sorted(set(dn) - mine), sorted(mine - set(dn))
        valdiff = [(c, dn[c]['lastInvoiceDate'][:10], str(data[c]['last']), dn[c]['lifetimeInvoiceCount'], data[c]['lifetime'], dn[c]['revenueLast12mo'], data[c]['rev12'])
                   for c in set(dn) & mine if dn[c]['lastInvoiceDate'][:10] != str(data[c]['last']) or dn[c]['lifetimeInvoiceCount'] != data[c]['lifetime'] or abs(dn[c]['revenueLast12mo'] - data[c]['rev12']) > 0.01]
        out.append({'location': name, 'risk_days': rd, 'history_rows': len(rows), 'dashboard_count': dash['count'], 'oracle_count': len(mine),
                    'only_dashboard': onlyd[:30], 'only_oracle': onlym[:30], 'value_differences': valdiff[:30],
                    'result': 'PASS' if dash['count'] == len(mine) and not onlyd and not onlym and not valdiff else 'FAIL'})
        print(name, rd, 'dash', dash['count'], 'mine', len(mine), 'onlyDash', len(onlyd), 'onlyMine', len(onlym), 'valueDiffs', len(valdiff), flush=True)
json.dump(out, open('/tmp/cln/dv/out/oracle_atrisk.json', 'w'), indent=0, default=str)
