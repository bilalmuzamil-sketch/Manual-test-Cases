# One-page size probe (rowsNumber) for the default and widest windows. SECRET-FREE.
import os, sys, datetime as dt
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common_f2 import *
from zoneinfo import ZoneInfo
zone = os.environ['TZ']; wid = DVI if zone == 'America/Toronto' else HD
print('chg', change_loc(wid)[0])
today = dt.datetime.now(ZoneInfo(zone)).date()
for locs, f in [([wid], today - dt.timedelta(days=90)), ([wid], today - dt.timedelta(days=365)), (ALL, today - dt.timedelta(days=365))]:
    st, j = get('/api/reporting/reports/parts-velocity?' + urlencode(pv_params(locs, f, today, zone, per=1)), wid)
    print(len(locs), f, st, j['data']['pagination'] if st == 200 else str(j)[:200])
