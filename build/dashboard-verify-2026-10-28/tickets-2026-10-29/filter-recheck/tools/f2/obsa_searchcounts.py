# OBS A: row counts at Staging Lethbridge for candidate search terms (to pick PDF sizes for the boundary). SECRET-FREE.
import os, sys, datetime as dt
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common_f2 import *
from zoneinfo import ZoneInfo
zone = os.environ['TZ']; change_loc(DVI); today = dt.datetime.now(ZoneInfo(zone)).date()
LB = 'f8a8b802-7780-4b16-bf10-343caeb616b2'
for t in sys.argv[1:]:
    st, j = get('/api/reporting/reports/inventory-value?' + urlencode(iv_params([LB], today, zone, search=t, per=1)), DVI)
    print(repr(t), st, j['data']['pagination']['rowsNumber'] if st == 200 else str(j)[:120])
