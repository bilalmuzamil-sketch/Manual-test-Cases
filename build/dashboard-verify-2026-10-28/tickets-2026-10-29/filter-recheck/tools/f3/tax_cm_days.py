"""F3 (read-only): per October day at a location, listed-row tax vs the server's own totalTax and its per-rate totals -> which day/rate holds
credit-memo tax the screen never takes off. Usage: TZ=<zone> python3 tax_cm_days.py <loc> <ticket>"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from common import *
l, ticket = sys.argv[1], sys.argv[2]; w = WID[l]; tz = TZ[w]; loc(w); out = []
d = dt.date(2026, 10, 1); today = dt.datetime.now(ZoneInfo(tz)).date()
while d <= today:
    s = dt.datetime.combine(d, dt.time(0), ZoneInfo(tz)).astimezone(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.000Z')
    e = dt.datetime.combine(d, dt.time(23, 59, 59), ZoneInfo(tz)).astimezone(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.999Z')
    c, b = paged('/api/reporting/sales-tax-report', [('dateRange', 'custom'), ('startDate', s), ('endDate', e), ('search', '')], w)
    rt = round(sum(float(r.get('tax') or 0) for r in b['collection']), 2); tt = b.get('totals', {}).get('totalTax')
    if tt is not None and abs(rt - tt) > 0.004: out.append({'day': str(d), 'row_tax': rt, 'totalTax': tt, 'cm_tax_hidden': round(rt - tt, 2), 'rates': b['totals']['taxRatesTotal']})
    d += dt.timedelta(days=1)
json.dump(out, open(f'{EV}/{ticket}/server-cm-days-{l}.json', 'w'), indent=1); print(json.dumps(out)[:1500])
