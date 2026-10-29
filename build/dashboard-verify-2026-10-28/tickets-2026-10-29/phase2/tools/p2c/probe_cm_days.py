"""Probe (read-only): per day, Sales Tax hidden totalTax vs the sum of the listed rows' tax -> the credit-memo tax the server
subtracts but no screen shows; plus that day's credit memos from the Sales report. Usage: TZ=<zone> probe_cm_days.py <wid> <from> <to>"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from common_p2c import *
wid, f, t = sys.argv[1], dt.date.fromisoformat(sys.argv[2]), dt.date.fromisoformat(sys.argv[3]); tz = TZ[wid]; loc(wid)
d = f; out = []
while d <= t:
    s, e = instants(d, d, tz)
    c, tax = paged('/api/reporting/sales-tax-report', [('dateRange', 'custom'), ('startDate', s), ('endDate', e)], wid)
    rows = tax['collection']; rowtax = round(sum(float(r['tax']) for r in rows), 2); tt = (tax.get('totals') or {}).get('totalTax')
    c2, sa = get('/api/reporting/sales/custom', [('range', 'custom'), ('start_date', s), ('end_date', e)], wid)
    cms = [(r['credit_number'], r['customer_service'], r['total_invoiced']) for r in sa['data']['collection'] if r['is_credit']]
    if cms or (tt is not None and abs(rowtax - tt) > 0.004):
        out.append({'day': str(d), 'rows': len(rows), 'row_tax': rowtax, 'hidden_totalTax': tt, 'diff': round(rowtax - (tt or 0), 2), 'cms': cms}); print(out[-1])
    d += dt.timedelta(days=1)
json.dump(out, open(f'{OUT}/cm_days_{wid[:8]}.json', 'w'), indent=1)
