"""Server-side re-check (read-only) for C1, C3, C4/C5, C6 at DVI Test, America/Toronto session. Out /tmp/cln/p2c/server_check.json"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from common_p2c import *
W = WID['DVI Test']; tz = TZ[W]; loc(W); S = json.load(open(OUT + '/seed.json')); res = {'at_utc': dt.datetime.utcnow().isoformat() + 'Z', 'zone': tz}
today = dt.datetime.now(ZoneInfo(tz)).date(); f, t = ranges(today)['this_month']; s, e = instants(f, t, tz)
base = [('range', 'custom'), ('start_date', s), ('end_date', e), ('productType', 'all'), ('invoiceStatus', 'all'), ('locations', W)]
c, iv = get(f'/api/reporting/reports/sales-by-representative/{S["REP"]["rep"]}/invoices', base + [('pagination[page]', 1), ('pagination[rowsPerPage]', 200)], W)
res['C1_sbr_row'] = [r for r in iv['data']['collection'] if r.get('invoice_id') == S['REP']['invoice_id'] or S['REP']['display'] in json.dumps(r)]
c, st = get(f'/api/work-orders/statistics/{S["REP"]["wo"]}', [], W); res['C1_stats'] = st.get('data') if c == 200 else (c, str(st)[:200])
c, un = get('/api/reporting/reports/sales-by-representative/00000000-0000-0000-0000-000000000000/invoices', base + [('showUnassigned', '1'), ('pagination[page]', 1), ('pagination[rowsPerPage]', 500)], W)
res['C6_unassigned'] = [(r.get('invoice_date'), r.get('invoice_number') or r.get('invoice_display_number')) for r in un['data']['collection']] if c == 200 else (c, str(un)[:300])
c, tax = paged('/api/reporting/sales-tax-report', [('dateRange', 'this_month')], W)
res['C3C4_tax_rows'] = [r for r in tax['collection'] if r['invoiceNumber'] in (S['ZERO']['display'], S['DEP']['display'])]
for k in ('ZERO', 'DEP'):
    c, b = get(f'/api/work-orders/view/{S[k]["wo"]}', [], W); w = b['data']['work_order']
    res[k + '_wo'] = {x: w.get(x) for x in ('display_number', 'status', 'invoice_status', 'open_balance', 'sub_total_with_tax')}
    res[k + '_payments'] = [(p.get('payment_date'), p.get('applied_amount'), p.get('is_deposit')) for p in (b['data'].get('customer_payments') or [])]
json.dump(res, open(OUT + '/server_check.json', 'w'), indent=1, default=str)
print(json.dumps(res, default=str)[:5000])
