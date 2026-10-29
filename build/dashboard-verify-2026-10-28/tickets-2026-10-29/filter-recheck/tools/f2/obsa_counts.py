# OBS A: Inventory Value row counts (As of today) per location set. SECRET-FREE.
import os, sys, datetime as dt, json, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common_f2 import *
from zoneinfo import ZoneInfo
zone = os.environ['TZ']; assert zone == 'America/Toronto'
change_loc(DVI); today = dt.datetime.now(ZoneInfo(zone)).date()
for locs in [[w] for w in ALL] + [ALL]:
    st, j = get('/api/reporting/reports/inventory-value?' + urlencode(iv_params(locs, today, zone, per=1)), DVI)
    print([NAME[w][:14] for w in locs], st, j['data']['pagination']['rowsNumber'] if st == 200 else str(j)[:200])
