# Side finding 2 clean-up: cancel the ZZAUTOTEST manual vendor return from the server, ONLY if the screen's Cancel Return failed.
# Same call the screen is meant to make (app/src/api/returns/index.ts: POST part/manual-return-request/{id}/cancel). SECRET-FREE.
# Usage: TZ=America/Toronto python3 cancel_return_server.py <return-id>
import sys, os, json, datetime as dt
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common_f2 import curl, change_loc, DVI
assert os.environ.get('TZ') == 'America/Toronto'
rid = sys.argv[1]
print('change-location', change_loc(DVI)[0])
st, j = curl('POST', f'/api/part/manual-return-request/{rid}/cancel', {}, extra_headers={'X-Location-ID': DVI})
rec = {'at_utc': dt.datetime.now(dt.timezone.utc).isoformat(), 'return_id': rid, 'status': st, 'body': str(j)[:400], 'process_TZ': os.environ['TZ']}
print(json.dumps(rec))
json.dump(rec, open('/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f2/side2_server_cancel.json', 'w'), indent=1)
