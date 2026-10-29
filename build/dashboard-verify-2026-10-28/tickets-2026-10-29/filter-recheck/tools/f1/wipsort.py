"""SV-11938 follow-up: where does S2-33740 land on Work In Progress (as of today, Approved - Not Started, all customers,
ALL locations) under each column sort the screen offers? Read-only, the same request the screen makes (sortBy/descending).
Usage: TZ=Asia/Karachi wipsort.py"""
import json, os, sys, datetime as dt
from zoneinfo import ZoneInfo
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from f1env import use, get, dump, instants, LOC
ALL = ','.join(v[0] for v in LOC.values())
loc = use('HD'); today = dt.datetime.now(ZoneInfo(loc['tz'])).date(); s, e = instants(today, today, loc['tz'])
out = {'loc': loc, 'positions': {}}
for key in ('number', 'customer', 'days_open', 'parts_earned', 'parts_remaining', 'total', 'location', 'advisor', 'asset', 'status'):
    for desc in ('false', 'true'):
        c, b = get('/api/reporting/reports/work-in-progress', [('from', s), ('to', e), ('locations', ALL), ('tab', 'ApprovedNotStarted'), ('pagination[page]', 1), ('pagination[rowsPerPage]', 1000), ('pagination[sortBy]', key), ('pagination[descending]', desc)], loc['wid'])
        coll = (b.get('data') or {}).get('collection') or []
        pos = next((i + 1 for i, r in enumerate(coll) if r['number'] == 'S2-33740'), None)
        out['positions'][f'{key} desc={desc}'] = {'status': c, 'position': pos, 'first3': [(r['number'], r['customer'][:25]) for r in coll[:3]]}
        print(f'{key:16} desc={desc:5} {c} position={pos} first={[(r["number"], r["customer"][:18]) for r in coll[:2]]}')
dump('wipsort-S2-33740', out)
