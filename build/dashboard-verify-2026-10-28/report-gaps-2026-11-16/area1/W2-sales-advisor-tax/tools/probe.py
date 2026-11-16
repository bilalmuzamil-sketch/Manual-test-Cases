import json, sys
sys.path.insert(0, '.')
from common import *
wid = WID['DVI Test']; print(loc(wid)[0])
f, t, s, e = win(wid, 'last_12_months')
W = [('range', 'custom'), ('start_date', s), ('end_date', e)]
P = [('pagination[page]', 1), ('pagination[rowsPerPage]', 5)]
def show(tag, r):
    c, b = r; print('==', tag, c); print(json.dumps(b)[:1500])
show('sbr', get('/api/reporting/reports/sales-by-representative', W + P + [('productType', 'all'), ('invoiceStatus', 'all'), ('locations', wid), ('showUnassigned', '1')], wid))
c, b = get('/api/reporting/reports/sales-by-customer', W + P + [('productType', 'all'), ('locations', wid)], wid)
show('sbc', (c, b))
cid = b['data']['collection'][0]['key']
c2, b2 = get(f'/api/reporting/reports/sales-by-customer/{cid}/assets', W + P + [('productType', 'all'), ('locations', wid)], wid)
show('sbc assets', (c2, b2))
for rng in ('this_month',):
    show('tax', get('/api/reporting/sales-tax-report', [('dateRange', rng), ('pagination[page]', 1), ('pagination[rowsPerPage]', 3)], wid))
show('followup', get('/api/reporting/sales-follow-up/last_3_months', [], wid))
show('te completed', get('/api/reporting/technician-efficiency-completed/custom', W, wid))
show('te expanded', get('/api/reporting/technician-efficiency/expanded/custom', W, wid))
