# B1 server cross-check: the export the screen requests for "Last 90 days" with ALL locations (the deselected view),
# same query the page sent (start = today-90 in the location's zone). Reads only the header lines. SECRET-FREE.
import os, sys, datetime as dt, json, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common_f2 import *
import collect_dashboard
from zoneinfo import ZoneInfo
zone = os.environ['TZ']; assert zone == 'America/Toronto'
change_loc(DVI); today = dt.datetime.now(ZoneInfo(zone)).date()
out = {'process_TZ': zone, 'local_today': str(today), 'runs': {}}
for name, locs in [('dvi_only', [DVI]), ('all_locations', ALL)]:
    s, e = instants(today - dt.timedelta(days=90), today, zone)
    q = urlencode([('format', 'csv'), ('type', 'both'), ('range', 'custom'), ('start_date', s), ('end_date', e), ('locations', ','.join(locs)),
                   ('columns', 'type,part_number,description,category,vendor,units_sold,unit_cost,sell_price,revenue,margin,margin_pct,demand,last_sale,on_hand')])
    path = '/api/reporting/reports/parts-velocity/export?' + q
    r = subprocess.run(['curl', '-sS', '-4', '--max-time', '600', '-H', 'Cookie: ' + collect_dashboard.COOKIE, '-H', 'X-Location-ID: ' + DVI,
                        '-H', 'Origin: https://app.staging.shopview.com', '-w', '\n%{http_code}', collect_dashboard.API + path], capture_output=True, text=True)
    body, code = r.stdout.rsplit('\n', 1)
    out['runs'][name] = {'request': path.split('&columns')[0], 'http': code, 'bytes': len(body), 'head': body.lstrip('﻿').splitlines()[:4]}
    print(name, code, out['runs'][name]['head'][:3], flush=True)
json.dump(out, open('/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f2/B1_export_server.json', 'w'), indent=1)
