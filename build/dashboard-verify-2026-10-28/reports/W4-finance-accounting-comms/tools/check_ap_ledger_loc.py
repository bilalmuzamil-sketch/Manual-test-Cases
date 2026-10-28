#!/usr/bin/env python3
"""W4 — A/P Aging Detail (as of today) vs each vendor's own Unpaid Invoices list, location by location.

The vendor page list (parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account) reads the
stored bill balance; the report replays payments to the as-of date. As of today both must agree on
every open bill and vendor credit: same documents, same open balance."""
import json, glob, os, collections
OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/reports/W4-finance-accounting-comms'
LOCN = {'b3c8c820-f815-4cf1-8938-10956c5ee71a': 'Staging Heavy Duty - 9919', 'f8a8b802-7780-4b16-bf10-343caeb616b2': 'Staging Lethbridge - 4310',
        '25a0d576-b371-4b82-bef4-41ba977f31c2': 'QB Location', '39522bc6-abca-4f67-bd12-2840043c2d68': 'DVI Test'}
D = json.load(open('/tmp/cln/w4/ap/hd_2026-10-29/detail.json'))
asof = D['asOf'].replace('T', ' ')[:19]
rep = collections.defaultdict(dict)
for b, v in D['data']['buckets'].items():
    if isinstance(v, dict):
        for t in v['transactions']:
            rep[(t['locationName'], t['vendorName'])][(t['type'], t['transactionNumber'], t['date'][:10])] = t
res = {'asOf': asof, 'locations': {}}
for wid, lname in LOCN.items():
    d = f'/tmp/cln/w4/ap/ledgers_by_loc2/{wid}'
    if not os.path.isdir(d):
        continue
    st = collections.Counter(); miss, extra, diff, future = [], [], [], []
    seen_vendors = set()
    for f in glob.glob(d + '/*.json'):
        g = json.load(open(f)); st['vendors_files'] += 1
        if not g.get('account'):
            st['no_account_here'] += 1
        led = {}
        for x in g.get('rows', []):
            if abs(x.get('balance') or 0) < 0.005:
                continue
            typ = 'invoice' if x.get('type_label') == 'Invoice' else 'credit'
            if str(x.get('date'))[:19] > asof:
                future.append((g['name'], x.get('invoice_number'), x.get('date'))); continue
            led[(typ, x.get('invoice_number'), str(x.get('date'))[:10])] = x
        r = rep.get((lname, g['name']), {})
        seen_vendors.add(g['name'])
        rk = {(k[0], k[1], k[2]) for k in r}
        for k in set(led) - rk:
            if k[0] == 'credit' and any(kk[0] == 'credit' and abs(abs(r[kk]['openBalance']) - abs(led[k]['balance'])) < 0.005 and kk[2] == k[2] for kk in r):
                continue   # credits: the vendor page shows a different number for the same credit; matched on date + amount
            miss.append((g['name'], k, led[k]['balance']))
        for k in rk - set(led):
            if k[0] == 'credit' and any(kk[0] == 'credit' and kk[2] == k[2] and abs(abs(led[kk]['balance']) - abs(r[k]['openBalance'])) < 0.005 for kk in led):
                continue
            extra.append((g['name'], k, r[k]['openBalance']))
        for k in rk & set(led):
            if abs(abs(r[k]['openBalance']) - abs(led[k]['balance'])) >= 0.005:
                diff.append((g['name'], k, r[k]['openBalance'], led[k]['balance'], r[k]['amount']))
        st['report_rows'] += len(r); st['ledger_rows'] += len(led)
    res['locations'][lname] = {'stats': dict(st), 'missing_from_report_n': len(miss), 'missing_from_report': miss[:25], 'report_not_on_vendor_page_n': len(extra),
                               'report_not_on_vendor_page': extra[:25], 'balance_diff_n': len(diff), 'balance_diff': diff[:25], 'dated_after_as_of': future[:10]}
    print(lname, dict(st), 'missing', len(miss), 'extra', len(extra), 'diff', len(diff), 'future', len(future))
json.dump(res, open(f'{OUT}/results-ap-ledger-by-location.json', 'w'), indent=1, default=str)
