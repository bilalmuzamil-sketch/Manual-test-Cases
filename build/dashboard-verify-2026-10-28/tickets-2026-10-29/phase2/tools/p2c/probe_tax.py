"""Probe (read-only): Sales Tax Collected This month per location — $0.00 rows, statuses; Sales report credit-memo rows. Out /tmp/cln/p2c/probe_tax.json"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from common_p2c import *
res = {}
for wid, name, tz in WORKPLACES:
    print(name, loc(wid)[0])
    c, tax = paged('/api/reporting/sales-tax-report', [('dateRange', 'this_month')], wid)
    rows = tax['collection']
    today = dt.datetime.now(ZoneInfo(tz)).date(); f, t = ranges(today)['this_month']; s, e = instants(f, t, tz)
    c2, sales = get('/api/reporting/sales/custom', [('range', 'custom'), ('start_date', s), ('end_date', e)], wid)
    srows = sales['data']['collection'] if c2 == 200 else []
    res[wid] = {'tax_status': c, 'tax_keys': list(rows[0].keys()) if rows else [], 'tax_n': len(rows), 'tax_meta': {k: v for k, v in tax.items() if k != 'collection'},
                'zero': [r for r in rows if abs(float(r.get('subTotalWithTax') or 0)) < 0.005][:5],
                'n_zero': sum(1 for r in rows if abs(float(r.get('subTotalWithTax') or 0)) < 0.005),
                'sales_status': c2, 'sales_keys': list(srows[0].keys()) if srows else [],
                'credit_rows': [r for r in srows if 'CM' in json.dumps(r) or float(r.get('subtotal') or r.get('subTotal') or 0) < 0][:8]}
json.dump(res, open(OUT + '/probe_tax.json', 'w'), indent=1)
for w, r in res.items():
    print(NAME[w], 'tax', r['tax_status'], r['tax_n'], 'zero', r['n_zero'], 'credit rows', len(r['credit_rows']))
print('TAX KEYS', res[WORKPLACES[0][0]]['tax_keys']); print('SALES KEYS', res[WORKPLACES[0][0]]['sales_keys'])
print('META', json.dumps(res[WORKPLACES[0][0]]['tax_meta'])[:800])
