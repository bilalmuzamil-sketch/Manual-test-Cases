#!/usr/bin/env python3
"""SV-11820 server-side read: Sales report vs Service Advisor Analysis for a window at a location, to find a range on sv11839
holding invoices whose service advisor is inactive/deleted, and to compare invoiced hours. SECRET-FREE. Run with TZ=<zone>.
Usage: sv11820_api.py <workplace_id> <zone> <from> <to> <out.json>"""
import sys, json
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/rerun-sv11839-2026-11-04/tools')
from collect_dashboard import curl
from collect_reports import instants
from urllib.parse import urlencode
import datetime as dt
wid, tz, f, t, out = sys.argv[1:6]
assert __import__('os').environ.get('TZ') == tz
print('change-location', curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz})[0])
s, e = instants(dt.date.fromisoformat(f), dt.date.fromisoformat(t), tz)
win = [('range', 'custom'), ('start_date', s), ('end_date', e)]; pg = [('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)]
H = {'X-Location-ID': wid}
cs, sales = curl('GET', '/api/reporting/sales/custom?' + urlencode(win + pg), extra_headers=H)
ca, saa = curl('GET', '/api/reporting/service-advisor-analysis/custom?' + urlencode(win + pg), extra_headers=H)
cd, dash = curl('GET', '/api/dashboard/reports?' + urlencode([('reports[]', 'billingEfficiencyKpi'), ('reports[]', 'billingEfficiencyByAdvisor'), ('from', f), ('to', t)]), extra_headers=H)
def rows(b):
    d = (b or {}).get('data', b) or {}
    return d.get('collection') or d.get('rows') or d.get('items') or (d if isinstance(d, list) else [])
sr, ar = rows(sales), rows(saa)
print('http', cs, ca, cd, 'rows', len(sr), len(ar))
print('sales keys', list(sr[0].keys())[:40] if sr else None)
print('saa keys', list(ar[0].keys())[:40] if ar else None)
print('sales top', [k for k in (sales.get('data') or {}).keys()] if isinstance(sales, dict) else None, 'saa top', [k for k in (saa.get('data') or {}).keys()] if isinstance(saa, dict) else None)
json.dump({'window': [f, t, s, e], 'sales': sales, 'saa': saa, 'dash': dash}, open(out, 'w'))
