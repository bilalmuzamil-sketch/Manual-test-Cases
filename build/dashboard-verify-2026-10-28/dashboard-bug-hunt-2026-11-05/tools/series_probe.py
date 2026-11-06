#!/usr/bin/env python3
"""Area 2 lead: Sales report chart (This Month, Heavy Duty) shows bars on Nov 3 and Nov 4 while every invoice row says Nov 04 2026.
Reads the dashboard revenue series and each invoice's own created_on. SECRET-FREE (cookie via collect_dashboard)."""
import sys, json, datetime as dt
from zoneinfo import ZoneInfo
from urllib.parse import urlencode
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/rerun-sv11839-2026-11-04/tools')
from collect_dashboard import curl
W, Z = sys.argv[1], sys.argv[2]; F, T = sys.argv[3], sys.argv[4]; H = {'X-Location-ID': W}
out = {'at_utc': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'), 'workplace': W, 'zone': Z}
out['change_location'] = curl('POST', '/api/iam/change-location', {'workplace_id': W, 'workplace_timezone': Z})[0]
q = [('reports[]', 'revenueSeries'), ('reports[]', 'revenueKpi'), ('from', F), ('to', T)]
c, b = curl('GET', '/api/dashboard/reports?' + urlencode(q), extra_headers=H); out['series_status'] = c; out['series'] = b
print('series', c, json.dumps(b)[:1500])
c, b = curl('GET', '/api/reporting/sales?' + urlencode([('range', 'custom'), ('start_date', F), ('end_date', T), ('limit', 200)]), extra_headers=H)
print('sales', c, json.dumps(b)[:400])
out['sales_status'] = c; out['sales'] = b
json.dump(out, open(sys.argv[5], 'w'), indent=1)
