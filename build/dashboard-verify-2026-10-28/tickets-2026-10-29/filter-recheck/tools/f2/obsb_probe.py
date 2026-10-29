# OBS B probe: PV row keys + part history shape for ZZAUTOTEST-PV1 (inventory part 5871f791-…). SECRET-FREE, prints bounded.
import os, sys, json, datetime as dt
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common_f2 import *
from zoneinfo import ZoneInfo
zone = os.environ['TZ']; assert zone == 'America/Toronto'
change_loc(DVI); today = dt.datetime.now(ZoneInfo(zone)).date()
st, j = get('/api/reporting/reports/parts-velocity?' + urlencode(pv_params([DVI], today - dt.timedelta(days=90), today, zone, search='ZZAUTOTEST-PV1', per=5)), DVI)
r = j['data']['collection'][0]; print('PV keys', sorted(r.keys())); print({k: r[k] for k in r if k in ('key', 'id', 'part_id', 'inventory_part_id', 'last_sale')})
st, h = get('/api/parts/history/5871f791-e4b0-4fdb-a6d1-26d3600b2844?' + urlencode({'pagination[page]': 1, 'pagination[rowsPerPage]': 20}), DVI)
print('history', st, json.dumps(h)[:1800])
