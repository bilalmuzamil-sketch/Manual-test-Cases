#!/usr/bin/env python3
"""Re-check SV-11945 (a "Receive later" special-order part billed on S1-38203 / S1-38206 shows as never sold on Parts Velocity)
on the current staging build, DVI Test in its own zone (Rule 99). Read-only. Usage: TZ=Pacific/Fiji python3 recheck_sv11945.py"""
import json, os, sys, datetime as dt
from zoneinfo import ZoneInfo
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from s3 import use, get, instants, dump, WID
L = use('DVI'); W, tz = L['wid'], L['tz']
today = dt.datetime.now(ZoneInfo(tz)).date()
m11 = (today.month - 11 - 1) % 12 + 1; y11 = today.year - (1 if today.month <= 11 else 0)
s, e = instants(dt.date(y11, m11, 1), today, tz); ALL = ','.join(WID.values())
out = {'zones': L, 'local_today': str(today), 'window': [str(dt.date(y11, m11, 1)), str(today)], 'parts': {}}
for pn in ('ZZAUTOTEST-SO1-10282011', 'ZZAUTOTEST-SO2-10282011'):
    q = [('type', 'both'), ('range', 'custom'), ('start_date', s), ('end_date', e), ('locations', ALL), ('search', pn), ('pagination[page]', 1), ('pagination[rowsPerPage]', 50), ('pagination[sortBy]', 'demand'), ('pagination[descending]', 'true')]
    c, b = get('/api/reporting/reports/parts-velocity', q, W)
    out['parts'][pn] = {'status': c, 'rows': [{k: r.get(k) for k in r if not isinstance(r.get(k), (list, dict))} for r in ((b.get('data') or {}).get('collection') or [])]}
print(json.dumps(out, default=str)[:3000]); print(dump('recheck-sv11945', out))
