"""F3 probe (read-only): SBR rep list + one invoices list shape. TZ=America/Toronto."""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from common import *
w = WID['dvi']; print('loc', loc(w))
LOCS = ','.join(WID[k] for k in ('qb', 'hd', 'leth', 'dvi'))
base = [('range', 'custom'), ('start_date', '2026-10-01T04:00:00.000Z'), ('end_date', '2026-10-30T03:59:59.999Z'), ('productType', 'all'), ('invoiceStatus', 'all'), ('locations', LOCS)]
c, b = get('/api/reporting/reports/sales-by-representative', base + [('pagination[page]', 1), ('pagination[rowsPerPage]', 30), ('pagination[sortBy]', 'rep_name'), ('pagination[descending]', 'false')], w)
print(c, json.dumps(b)[:800])
c, b = get('/api/reporting/reports/sales-by-representative/00000000-0000-0000-0000-000000000000/invoices', base + [('showUnassigned', '1'), ('pagination[page]', 1), ('pagination[rowsPerPage]', 3)], w)
print(c, json.dumps(b)[:1200])
