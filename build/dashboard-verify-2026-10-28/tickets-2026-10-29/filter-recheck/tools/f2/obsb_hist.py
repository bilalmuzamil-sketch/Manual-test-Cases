# OBS B: list a part's history events compactly, fetched under two session zones to learn which zone historyDate/Time use.
# Usage: python3 obsb_hist.py <inventoryPartId> <workplace-id-of-part>   (TZ unused for the fetch; both zones are tried). SECRET-FREE.
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common_f2 import *
import common_f2
pid, wid = sys.argv[1], sys.argv[2]
out = {}
for zone in ('America/Toronto', 'Asia/Karachi'):
    st, _ = curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': zone})
    st, h = get(f'/api/parts/history/{pid}?' + urlencode({'pagination[page]': 1, 'pagination[rowsPerPage]': 50}), wid)
    rows = h['data']['collection'] if st == 200 else []
    out[zone] = [(e['eventType'], e['historyDate'], e['historyTime'], e.get('workOrderDisplayNumber'), e.get('quantityChange'), e.get('invoiceNumber')) for e in rows]
    print('##', zone, st, len(rows))
    for e in out[zone][:14]: print('  ', e)
# restore the session to the part's own zone
curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': TZ[wid]})
json.dump(out, open(f'/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f2/obsB_history_{pid[:8]}.json', 'w'), indent=1)
