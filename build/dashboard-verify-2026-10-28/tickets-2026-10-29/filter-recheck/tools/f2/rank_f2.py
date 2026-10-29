# Where do the ticket rows sit when the whole list (all locations, Last 12 months, no search) is sorted by Part # descending?
# Decides whether a lay reader can reach them without the search box. SECRET-FREE.
import os, sys, datetime as dt, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common_f2 import *
from zoneinfo import ZoneInfo
zone = os.environ['TZ']; assert zone == 'America/Toronto'
change_loc(DVI); today = dt.datetime.now(ZoneInfo(zone)).date()
f = today.replace(day=1); f = dt.date(f.year - 1, f.month + 1, 1) if f.month < 12 else dt.date(f.year, 1, 1)   # Last 12 months preset start
st, j = get('/api/reporting/reports/parts-velocity?' + urlencode(pv_params(ALL, f, today, zone, sort='part_number', desc=True, per=200)), DVI)
rows = j['data']['collection']
print('window', f, today, 'total', j['data']['pagination']['rowsNumber'])
for i, r in enumerate(rows):
    if r['part_number'].startswith('ZZAUTOTEST-PV1') or r['part_number'].startswith('ZZAUTOTEST-SO'): print(i + 1, r['part_number'], r['type'])
print('first 5', [r['part_number'] for r in rows[:5]])
