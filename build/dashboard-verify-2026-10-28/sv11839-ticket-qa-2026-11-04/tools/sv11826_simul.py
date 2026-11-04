#!/usr/bin/env python3
"""SV-11826: fire the tile request and the report request at the same instant (two threads), 4 rounds × 3 ranges, Heavy Duty.
Separates "read at different moments" (developer's explanation) from a real difference. SECRET-FREE. TZ=America/Edmonton."""
import sys, json, threading, time, datetime as dt
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/rerun-sv11839-2026-11-04/tools')
from collect_dashboard import curl
from urllib.parse import urlencode
W = 'b3c8c820-f815-4cf1-8938-10956c5ee71a'; H = {'X-Location-ID': W}
assert __import__('os').environ.get('TZ') == 'America/Edmonton'
print('change-location', curl('POST', '/api/iam/change-location', {'workplace_id': W, 'workplace_timezone': 'America/Edmonton'})[0])
R = {'last-12-months': ('2025-12-01', '2026-11-04', 'month', '2025-12-01T07:00:00.000Z'), 'custom-32-days': ('2026-10-04', '2026-11-04', 'week', '2026-10-04T06:00:00.000Z'),
     'custom-366-days': ('2025-11-04', '2026-11-04', 'month', '2025-11-04T07:00:00.000Z'), 'past-last-year': ('2025-01-01', '2025-12-31', 'month', '2025-01-01T07:00:00.000Z')}
END = {'past-last-year': '2026-01-01T06:59:59.999Z'}
out = []
for rnd in range(4):
    for tag, (f, t, g, s) in R.items():
        res = {}
        def tile(): res['tile'] = curl('GET', '/api/dashboard/reports?' + urlencode([('reports[]', 'techUtilizationKpi'), ('from', f), ('to', t), ('group', g)]), extra_headers=H)[1]['data']['techUtilizationKpi']; res['t_at'] = time.time()
        def rep():
            b = curl('GET', '/api/reporting/reports/technician-utilization?' + urlencode([('range', 'custom'), ('start_date', s), ('end_date', END.get(tag, '2026-11-05T06:59:59.999Z')), ('locations', W), ('pagination[page]', 1), ('pagination[rowsPerPage]', 30)]), extra_headers=H)[1]
            res['rep'] = b['data']['summary']; res['r_at'] = time.time()
        a, b = threading.Thread(target=tile), threading.Thread(target=rep); a.start(); b.start(); a.join(); b.join()
        rw, rt = res['rep']['wo_seconds'] / 3600, res['rep']['total_seconds'] / 3600
        row = {'round': rnd, 'range': tag, 'at_utc': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'), 'tile_wo': res['tile']['woHours'], 'tile_clocked': res['tile']['hoursClocked'],
               'report_wo': round(rw, 4), 'report_total': round(rt, 4), 'report_wo_2dp': round(rw, 2), 'report_total_2dp': round(rt, 2),
               'diff_wo': round(round(rw, 2) - res['tile']['woHours'], 2), 'diff_total': round(round(rt, 2) - res['tile']['hoursClocked'], 2), 'finish_gap_s': round(abs(res['t_at'] - res['r_at']), 2)}
        out.append(row); print(json.dumps(row))
    time.sleep(20)
json.dump(out, open('/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-04/SV-11826/simultaneous-reads.json', 'w'), indent=1)
