"""A4 pre-check (read-only): is a timesheet running (clocked in, not out) right now at any location? Each location read in
its own zone (Rule 99: run once per zone with TZ=<zone>). Usage: TZ=<zone> a4probe.py <LOC>"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from f1env import use, get, dump
loc = use(sys.argv[1]); w = loc['wid']
c, b = get('/api/reporting/punch-clock-activities/this_month', [('pagination[page]', 1), ('pagination[rowsPerPage]', 1000), ('pagination[sortBy]', ''), ('pagination[descending]', 'false'), ('search', ''), ('range', 'this_month')], w)
rows = b['data']['collection']
run = [r for r in rows if not r.get('formatted_end_date_time')]
print(loc['name'], loc['local_now'], c, 'rows', len(rows), 'running', len(run), 'keys', list(rows[0])[:30] if rows else None)
for r in run[:5]: print('  ', json.dumps({k: r.get(k) for k in r if any(x in k for x in ('employee', 'work_order', 'start', 'end', 'hours', 'date', 'status', 'id'))})[:500])
dump(f'a4probe-{sys.argv[1]}', {'loc': loc, 'n_rows': len(rows), 'running': run})
