# B5: does the Inventory Value PDF export accept ALL locations (the deselected view)? Same query the page sends. SECRET-FREE.
import os, sys, datetime as dt, json, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common_f2 import *
import collect_dashboard
from zoneinfo import ZoneInfo
zone = os.environ['TZ']; assert zone == 'America/Toronto'
change_loc(DVI); today = dt.datetime.now(ZoneInfo(zone)).date(); s, e = instants(today, today, zone)
out = {'process_TZ': zone, 'local_today': str(today)}
for fmt in ('pdf', 'csv'):
    q = urlencode([('format', fmt), ('range', 'custom'), ('start_date', s), ('end_date', e), ('locations', ','.join(ALL)),
                   ('columns', 'part_number,description,category,vendor,location,qty,unit_cost,unit_sell,margin,margin_pct,total_sell,total_cost')])
    fn = f'/tmp/cln/f2/iv_all.{fmt}'
    r = subprocess.run(['curl', '-sS', '-4', '--max-time', '600', '-o', fn, '-w', '%{http_code} %{time_total}', '-H', 'Cookie: ' + collect_dashboard.COOKIE, '-H', 'X-Location-ID: ' + DVI,
                        '-H', 'Origin: https://app.staging.shopview.com', collect_dashboard.API + '/api/reporting/reports/inventory-value/export?' + q], capture_output=True, text=True)
    out[fmt] = {'http_time': r.stdout, 'bytes': os.path.getsize(fn), 'head': open(fn, 'rb').read(300).decode('latin-1')[:200]}
    print(fmt, out[fmt]['http_time'], out[fmt]['bytes'], flush=True)
json.dump(out, open('/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f2/B5_iv_export_all_locations_server.json', 'w'), indent=1)
