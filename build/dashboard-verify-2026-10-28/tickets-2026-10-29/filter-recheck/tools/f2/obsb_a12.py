# OBS B: exact sale time for HD part -A12: part history pick + the work order's invoice-created timestamp (UTC). SECRET-FREE.
import os, sys, json, datetime as dt
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common_f2 import *
from zoneinfo import ZoneInfo
zone = os.environ['TZ']; assert zone == 'Asia/Karachi'; change_loc(HD); today = dt.datetime.now(ZoneInfo(zone)).date()
st, j = get('/api/reporting/reports/parts-velocity?' + urlencode(pv_params([HD], today - dt.timedelta(days=365), today, zone, typ='inventory', search='-A12', per=10)), HD)
row = [r for r in j['data']['collection'] if r['part_number'] == '-A12'][0]; print('PV', {k: row[k] for k in ('key', 'last_sale', 'units_sold', 'demand')})
st, h = get(f"/api/parts/history/{row['key']}?" + urlencode({'pagination[page]': 1, 'pagination[rowsPerPage]': 10}), HD)
ev = h['data']['collection']; out = {'pv': row, 'part_history': [(e['eventType'], e['historyDate'], e['historyTime'], e.get('workOrderDisplayNumber'), e.get('workOrderId'), e.get('quantityChange')) for e in ev]}
for e in out['part_history'][:5]: print('  part', e)
wo = next((e[4] for e in out['part_history'] if e[0] == 'part.picked.qty'), None)
st, w = get(f'/api/work-orders/{wo}/history?' + urlencode({'pagination[page]': 1, 'pagination[rowsPerPage]': 60}), HD)
out['wo_invoice_events'] = [(e['eventType'], e.get('historyTimestamp')) for e in w['data']['history'] if 'invoice' in e['eventType'] or 'picked' in e['eventType']]
for e in out['wo_invoice_events']: print('  wo', e)
json.dump(out, open('/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f2/side-obs/obsB_A12_times.json', 'w'), indent=1, default=str)
