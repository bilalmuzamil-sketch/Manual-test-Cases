"""A4 clean-up: delete the throwaway RUNNING timesheet F1 made on screen (Admin Shopview, ZZAUTOTEST work order
S1-38220, started 29 Oct 2026 05:01 AM Toronto, no clock-out). Only a row matching ALL of that is deleted. Read back after."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from f1env import use, get, dump, curl, REQLOG
loc = use('DVI'); w = loc['wid']
q = [('pagination[page]', 1), ('pagination[rowsPerPage]', 200), ('pagination[sortBy]', ''), ('pagination[descending]', 'false'), ('search', ''), ('range', 'today')]
c, b = get('/api/reporting/punch-clock-activities/today', q, w)
mine = [r for r in b['data']['collection'] if r['work_order'] == 'S1-38220' and r['employee'] == 'Admin Shopview' and not r.get('formatted_end_date_time') and r['formatted_start_date_time'] == 'Oct 29, 2026 05:01 AM']
print('matching running rows', len(mine), [(r['id'], r['formatted_start_date_time'], r['hours']) for r in mine])
log = []
for r in mine:
    cd, bd = curl('DELETE', f"/api/technician-tasks/{r['id']}", extra_headers={'X-Location-ID': w}); log.append({'DELETE': r['id'], 'status': cd}); print('DELETE', r['id'], cd)
c, b = get('/api/reporting/punch-clock-activities/today', q, w)
left = [r['id'] for r in b['data']['collection'] if r['id'] in {m['id'] for m in mine}]
print('still present after delete:', left)
dump('a4-cleanup', {'loc': loc, 'deleted': log, 'rows_before': mine, 'still_present': left})
