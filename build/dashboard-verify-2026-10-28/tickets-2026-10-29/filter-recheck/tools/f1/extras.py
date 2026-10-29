#!/usr/bin/env python3
"""Worker F1 server reads for the 'every non-subject filter deselected' runs (Amendment 1), read-only, each in the
location's own zone (Rule 99), full pages (no paging gaps). Usage: TZ=<zone> extras.py <P14|P13|A1A2>"""
import json, os, sys, datetime as dt
from zoneinfo import ZoneInfo
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from f1env import use, get, dump, instants, LOC
ALL = ','.join(v[0] for v in LOC.values())
item = sys.argv[1]; out = {'item': item}
if item == 'P14':      # Sales By Customer, Last 12 months, ALL locations: ZZAUTOTEST Dash Q27
    loc = use('DVI'); out['loc'] = loc; today = dt.datetime.now(ZoneInfo(loc['tz'])).date()
    s, e = instants(dt.date(2025, 11, 1), today, loc['tz'])
    for lbl, locs in (('DVI only', loc['wid']), ('all locations', ALL)):
        c, b = get('/api/reporting/reports/sales-by-customer', [('range', 'custom'), ('start_date', s), ('end_date', e), ('productType', 'all'), ('locations', locs), ('pagination[page]', 1), ('pagination[rowsPerPage]', 5000), ('pagination[sortBy]', 'customer'), ('pagination[descending]', 'false')], loc['wid'])
        rows = [r for r in b['data']['collection'] if r.get('customer_name') == 'ZZAUTOTEST Dash Q27']
        out[lbl] = {'status': c, 'n': len(b['data']['collection']), 'row': rows}; print('SBC', lbl, c, len(b['data']['collection']), json.dumps(rows)[:300])
if item == 'P13':      # Technician Utilization, Last 12 months, ALL locations; and every clock of the 0.00 technicians, each location in its own zone
    loc = use('HD'); out['loc'] = loc; today = dt.datetime.now(ZoneInfo(loc['tz'])).date()
    s, e = instants(dt.date(2025, 11, 1), today, loc['tz'])
    for lbl, locs in (('HD only', loc['wid']), ('all locations', ALL)):
        c, b = get('/api/reporting/reports/technician-utilization', [('range', 'custom'), ('start_date', s), ('end_date', e), ('locations', locs), ('pagination[page]', 1), ('pagination[rowsPerPage]', 500), ('pagination[sortBy]', 'technician'), ('pagination[descending]', 'false')], loc['wid'])
        coll = b['data']['collection']; z = [r for r in coll if 'QA Technician' in json.dumps(r) or 'Nebojsa' in json.dumps(r)]
        out['TU ' + lbl] = {'status': c, 'n': len(coll), 'rows': z}; print('TU', lbl, c, len(coll), json.dumps(z)[:900])
    out['clocks'] = {}
    for key in ('HD', 'LETH', 'QB', 'DVI'):
        os.environ['TZ'] = LOC[key][1]; __import__('time').tzset()  # process zone follows the location being read (Rule 99)
        l2 = use(key); t2 = dt.datetime.now(ZoneInfo(l2['tz'])).date(); s2, e2 = instants(dt.date(2025, 11, 1), t2, l2['tz'])
        c, b = get('/api/reporting/punch-clock-activities/custom', [('range', 'custom'), ('start_date', s2), ('end_date', e2), ('pagination[page]', 1), ('pagination[rowsPerPage]', 5000)], l2['wid'])
        m = [{k: r.get(k) for k in ('employee', 'date', 'work_order', 'formatted_start_date_time', 'formatted_end_date_time', 'hours')} for r in (b.get('data') or {}).get('collection', []) if r['employee'] in ('QA Technician', 'Nebojsa Custom-Admin')]
        out['clocks'][l2['name']] = m; print('clocks', l2['name'], l2['tz'], c, len(m), json.dumps(m)[:700])
if item == 'A1A2':     # Work In Progress, as of today, every tab, ALL customers, HD and ALL locations: S2-33740 parts, every '1 day' row
    loc = use('HD'); out['loc'] = loc; today = dt.datetime.now(ZoneInfo(loc['tz'])).date(); s, e = instants(today, today, loc['tz'])
    for lbl, locs in (('HD only', loc['wid']), ('all locations', ALL)):
        res = {}
        for tab in ('ApprovedPartiallyCompleted', 'ApprovedNotStarted', 'Completed', 'Estimates'):
            coll, pg, c, total = [], 1, None, None
            while True:   # the endpoint caps a page at 1000 rows: walk every page
                c, b = get('/api/reporting/reports/work-in-progress', [('from', s), ('to', e), ('locations', locs), ('tab', tab), ('pagination[page]', pg), ('pagination[rowsPerPage]', 1000), ('pagination[sortBy]', 'days_open'), ('pagination[descending]', 'false')], loc['wid'])
                d = b['data']; coll += d['collection']; total = (d.get('pagination') or {}).get('rowsNumber')
                if not d['collection'] or len(coll) >= (total or 0): break
                pg += 1
            z = ZoneInfo(loc['tz'])   # Days Open = calendar dates between the start date and the as-of date, in the location's zone
            days = lambda r: (today - dt.datetime.fromisoformat(r['start_date'].replace('Z', '+00:00')).astimezone(z).date()).days if r.get('start_date') else None
            ones = [r['number'] for r in coll if days(r) == 1]
            hit = [{k: r.get(k) for k in ('number', 'customer', 'location', 'start_date', 'parts_earned', 'parts_remaining', 'labor_earned', 'labor_remaining', 'earned', 'remaining', 'total')} | {'calendar_days_open': days(r)} for r in coll if r['number'] in ('S2-33740', 'S2-38105', 'S2-33465', 'S2-33376')]
            res[tab] = {'status': c, 'n': len(coll), 'total': total, 'days_open_1': ones[:20], 'n_days_open_1': len(ones), 'targets': hit}
            print('WIP', lbl, tab, c, len(coll), '/', total, '| 1 day open:', len(ones), ones[:6], '|', json.dumps(hit)[:700])
        out[lbl] = res
dump(f'srv-extras-{item}', out)
