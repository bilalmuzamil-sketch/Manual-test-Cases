#!/usr/bin/env python3
"""SV-12201 set-up at Staging Heavy Duty - 9919 (TZ=America/Edmonton): two OVERLAPPING timesheets for one person (staff "-ZZAUTOTEST QA11839 Tech",
staff_id c7fd33ec…) on one work-order line, today (location time): A 20:00-21:00, B 20:30-21:30 → union 1.50 h (double count 2.00 h).
Set-up by the same request the Timesheet Activities "New" dialog makes for a finished entry (technician-tasks/create). SECRET-FREE."""
import sys, os, json, datetime as dt
from zoneinfo import ZoneInfo
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/rerun-sv11839-2026-11-04/tools')
from collect_dashboard import curl
W = 'b3c8c820-f815-4cf1-8938-10956c5ee71a'; Z = 'America/Edmonton'; H = {'X-Location-ID': W}; assert os.environ.get('TZ') == Z
S = json.load(open('/tmp/cln/qa11839/seed.json')); V = S['V12146']; R = S.setdefault('TS12201', {})
LOG = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-05/seed-log.jsonl'
print('change-location', curl('POST', '/api/iam/change-location', {'workplace_id': W, 'workplace_timezone': Z})[0])
today = dt.datetime.now(ZoneInfo(Z)).date(); R['local_date'] = str(today); R['entries'] = []
for tag, a, b in (('A', '20:00', '21:00'), ('B', '20:30', '21:30')):
    body = {'line_id': V['line'], 'work_order_id': V['wo'], 'tech_assigned_id': 'c7fd33ec-4d2b-40e7-979a-c4b5dc56958f',
            'start_date': f'{today.strftime("%d/%m/%Y")} {a}', 'end_date': f'{today.strftime("%d/%m/%Y")} {b}'}
    c, r = curl('POST', '/api/technician-tasks/create', body, extra_headers=H)
    R['entries'].append({'tag': tag, 'start': a, 'end': b, 'http': c, 'resp': r})
    open(LOG, 'a').write(json.dumps({'at_utc': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'), 'tag': 'TS12201', 'op': f'POST /api/technician-tasks/create {tag} {a}-{b}', 'http': c, 'resp': json.dumps(r)[:150]}) + '\n')
    print(tag, a, b, c, json.dumps(r)[:150])
json.dump(S, open('/tmp/cln/qa11839/seed.json', 'w'), indent=1)
