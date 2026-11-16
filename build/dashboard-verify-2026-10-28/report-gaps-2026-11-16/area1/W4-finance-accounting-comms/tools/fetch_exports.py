#!/usr/bin/env python3
"""16 Nov re-run: fetch the Reports > Export Reports downloads exactly as the dialog sends them
(ExportReportsDialog.vue: GET /api/reporting/export/<report>?report=<report>&range=custom&start_date&end_date,
start/end = the location's local 00:00:00.000 / 23:59:59.999 as UTC instants). The 28 Oct producer was not committed.
Usage: fetch_exports.py <tag> <wid> <tz> <YYYY-MM-DD start> <YYYY-MM-DD end>
Raw -> /tmp/cln/rg16/w4/exp/<tag>__<report>.json (never committed: holds customer/staff names). SECRET-FREE."""
import json, os, sys
from urllib.parse import urlencode
import datetime as dt
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/report-gaps-2026-11-16/area1/tools')
from collect_dashboard import curl
from collect_reports import instants
tag, wid, tz, a, b = sys.argv[1:6]
curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz})
s0, e0 = instants(dt.date.fromisoformat(a), dt.date.fromisoformat(b), tz)
O = '/tmp/cln/rg16/w4/exp'; os.makedirs(O, exist_ok=True)
for rep in ['customer_contact', 'customer_invoice', 'customer_payment', 'customer_credit_memo', 'vendor_contact', 'vendor_bill',
            'vendor_bill_payment', 'vendor_credit_memo', 'payroll_timesheet', 'journal_entry', 'sales_rep_assignments']:
    q = [('report', rep)] if rep == 'sales_rep_assignments' else [('report', rep), ('start_date', s0), ('end_date', e0), ('range', 'custom')]
    st, body = curl('GET', f'/api/reporting/export/{rep}?' + urlencode(q), extra_headers={'X-Location-ID': wid})
    json.dump({'status': st, 'request': q, 'body': body}, open(f'{O}/{tag}__{rep}.json', 'w'))
    d = body.get('data') if isinstance(body, dict) else None
    print(rep, st, 'lines', (d[0].count('\n') if isinstance(d, list) and d and isinstance(d[0], str) else None), flush=True)
