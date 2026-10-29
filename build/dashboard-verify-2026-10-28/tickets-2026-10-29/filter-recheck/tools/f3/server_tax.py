"""F3 server cross-check, Sales Tax Collected (read-only). Usage: TZ=<zone> python3 server_tax.py <hd|dvi> <ticket> <targets csv>
Same request the screen sends (/api/reporting/sales-tax-report, dateRange + startDate/endDate + statuses[0]); all pages read.
Also: credit memos at the location in the range (Sales report), to work out the expected tax. Out evidence/f3/<ticket>/server-tax.json"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from common import *
l, ticket, tcsv = sys.argv[1], sys.argv[2], sys.argv[3]; w = WID[l]; tz = TZ[w]; targets = [t for t in tcsv.split(',') if t]
out = {'zones': zones(w), 'change_location': loc(w), 'runs': {}}
def inst(f, t):
    s = dt.datetime.combine(f, dt.time(0), ZoneInfo(tz)).astimezone(dt.timezone.utc); e = dt.datetime.combine(t, dt.time(23, 59, 59, 999000), ZoneInfo(tz)).astimezone(dt.timezone.utc)
    return s.strftime('%Y-%m-%dT%H:%M:%S.000Z'), e.strftime('%Y-%m-%dT%H:%M:%S.') + f'{e.microsecond // 1000:03d}Z'
today = dt.datetime.now(ZoneInfo(tz)).date()
specs = {'custom_oct20': ('custom', dt.date(2026, 10, 20), dt.date(2026, 10, 20)), 'custom_oct28': ('custom', dt.date(2026, 10, 28), dt.date(2026, 10, 28)),
         'this_month_default': ('this_month', None, None), 'this_year_widest': ('this_year', None, None), 'last_month': ('last_month', None, None),
         'custom_2020_to_today': ('custom', dt.date(2020, 1, 1), today)}
for name, (rng, f, t) in specs.items():
    for st in (None, 'paid', 'partially_paid'):
        q = [('dateRange', rng)] + ([('startDate', inst(f, t)[0]), ('endDate', inst(f, t)[1])] if f else []) + ([('statuses[0]', st)] if st else []) + [('search', '')]
        c, d = paged('/api/reporting/sales-tax-report', q, w)
        rows = d['collection']; key = name + ('' if not st else '__' + st)
        R = {'request': q, 'status': c, 'n': len(rows), 'meta': {k: v for k, v in d.items() if k not in ('collection',)},
             'sum_row_tax': round(sum(float(r.get('tax') or 0) for r in rows), 2), 'targets': {}}
        R['n_zero_total'] = sum(1 for r in rows if abs(float(r.get('subTotalWithTax') or 0)) < 0.005)
        R['n_negative'] = sum(1 for r in rows if float(r.get('subTotalWithTax') or 0) < 0)
        R['n_credit_like'] = sum(1 for r in rows if 'CM' in str(r.get('invoiceNumber')))
        for tg in targets: R['targets'][tg] = [r for r in rows if r.get('invoiceNumber') == tg]
        out['runs'][key] = R
        if f:  # credit memos in the range (Sales report), for the expected figure
            c2, sa = get('/api/reporting/sales/custom', [('range', 'custom'), ('start_date', inst(f, t)[0]), ('end_date', inst(f, t)[1])], w)
            if c2 == 200: R['credit_memos_in_range'] = [{k: r.get(k) for k in ('credit_number', 'customer_service', 'total_invoiced', 'tax', 'taxes', 'date', 'created_on') if k in r} for r in sa['data']['collection'] if r.get('is_credit')]
os.makedirs(f'{EV}/{ticket}', exist_ok=True); json.dump(out, open(f'{EV}/{ticket}/server-tax.json', 'w'), indent=1, default=str)
for k, R in out['runs'].items():
    print(k, R['status'], 'n', R['n'], 'zero', R['n_zero_total'], 'neg', R['n_negative'], 'cm', R['n_credit_like'], 'rowtax', R['sum_row_tax'], 'totals', json.dumps(R['meta'].get('totals'))[:300],
          {t: [(x.get('invoiceStatus') or x.get('status'), x.get('paidDate') or x.get('invoicePaidDate'), x.get('subTotalWithTax')) for x in v] for t, v in R['targets'].items()}, 'CMs', R.get('credit_memos_in_range', '-') if 'oct20' in k or '2020' in k and not '__' in k else '')
