#!/usr/bin/env python3
"""Layer D seeding helper — throwaway ZZAUTOTEST records in DVI Test (Toronto), the quietest location, so every
dashboard/report change is attributable to the seed.  Recipes: build/APP-ACTIONS-PLAYBOOK.md §C/§D/§F, INVOICING,
"Seed a testable WO end-to-end". IDs recorded in /tmp/cln/dv/seed.json (not secrets). SECRET-FREE.

Usage: python3 seed.py <step> [args]
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from collect_dashboard import curl

WID, TZ = '39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto'
STATE = '/tmp/cln/dv/seed.json'
S = json.load(open(STATE)) if os.path.exists(STATE) else {}
H = {'X-Location-ID': WID}


def save(): json.dump(S, open(STATE, 'w'), indent=1)


def call(method, path, body=None, ok=(200, 201, 204)):
    c, b = curl(method, path, body, extra_headers=H)
    print(method, path, '->', c, (json.dumps(b)[:400] if c not in ok else ''))
    return c, b


def did(b):
    d = (b or {}).get('data', b) or {}
    for k in ('id', 'company_id', 'contact_id', 'vehicle_id', 'work_order_id', 'invoice_id', 'line_id', 'task_id'):
        if isinstance(d, dict) and d.get(k): return d[k]
    if isinstance(d, dict):
        for v in d.values():
            if isinstance(v, dict) and v.get('id'): return v['id']
    return None


def customer(tag):
    call('POST', '/api/iam/change-location', {'workplace_id': WID, 'workplace_timezone': TZ})
    c, b = call('POST', '/api/customers/create', {'name': f'ZZAUTOTEST Dash {tag}'}); cid = did(b)
    c, b = call('POST', '/api/contacts/create', {'company_id': cid, 'first_name': f'ZZAUTOTEST {tag}', 'last_name': 'Contact'}); ct = did(b)
    c, b = call('POST', '/api/vehicles/create', {'company_id': cid, 'customer_id': ct, 'unit': f'ZZ-{tag}'}); vid = did(b)
    S.setdefault('customers', {})[tag] = {'company_id': cid, 'contact_id': ct, 'vehicle_id': vid}; save()
    return S['customers'][tag]


if __name__ == '__main__':
    step = sys.argv[1]
    if step == 'customer':
        print(customer(sys.argv[2]))
    elif step == 'raw':                                   # raw call helper: seed.py raw POST /path '{json}'
        print(call(sys.argv[2], sys.argv[3], json.loads(sys.argv[4]) if len(sys.argv) > 4 else None)[1])


def snapshot(tag, windows=(('2026-10-27', '2026-10-27'), ('2026-10-01', '2026-10-28'))):
    """Paired dashboard + report read for DVI Test, saved to /tmp/cln/dv/snap/<tag>.json."""
    from collect_dashboard import KEYS
    from collect_reports import instants
    from urllib.parse import urlencode
    os.makedirs('/tmp/cln/dv/snap', exist_ok=True)
    call('POST', '/api/iam/change-location', {'workplace_id': WID, 'workplace_timezone': TZ})
    snap = {}
    for f, t in windows:
        s, e = instants(__import__('datetime').date.fromisoformat(f), __import__('datetime').date.fromisoformat(t), TZ)
        win = [('range', 'custom'), ('start_date', s), ('end_date', e)]
        pg = [('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)]
        snap[f'{f}..{t}'] = {
            'dash': curl('GET', '/api/dashboard/reports?' + urlencode([('reports[]', k) for k in KEYS] + [('from', f), ('to', t)]), extra_headers=H)[1],
            'atrisk': {rd: curl('GET', '/api/dashboard/reports?' + urlencode([('reports[]', 'atRiskCustomers'), ('from', f), ('to', t), ('risk_days', rd)]), extra_headers=H)[1] for rd in (30, 120)},
            'sales': curl('GET', '/api/reporting/sales/custom?' + urlencode(win), extra_headers=H)[1],
            'saa': curl('GET', '/api/reporting/service-advisor-analysis/custom?' + urlencode(win + pg), extra_headers=H)[1],
            'te': curl('GET', '/api/reporting/technician-efficiency/custom?' + urlencode(win), extra_headers=H)[1],
            'tu': curl('GET', '/api/reporting/reports/technician-utilization?' + urlencode(win + [('locations', WID)] + pg), extra_headers=H)[1],
            'sbc': curl('GET', '/api/reporting/reports/sales-by-customer?' + urlencode(win + [('productType', 'all'), ('locations', WID)] + pg), extra_headers=H)[1],
            'punch': curl('GET', '/api/reporting/punch-clock-activities/custom?' + urlencode(win + pg), extra_headers=H)[1],
        }
    json.dump(snap, open(f'/tmp/cln/dv/snap/{tag}.json', 'w'))
    d = snap[f'{windows[0][0]}..{windows[0][1]}']['dash']['data']
    print(tag, 'Oct27 dash: rev', d['revenueKpi']['value'], 'inv', d['invoicesKpi']['value'], '| BE', d['billingEfficiencyKpi'],
          '| TE', {k: d['techEfficiencyKpi'][k] for k in ('value', 'hoursBilled', 'hoursLogged')}, '| TU', {k: d['techUtilizationKpi'][k] for k in ('value', 'woHours', 'hoursClocked')},
          '| SBC', d['topCustomers']['count'])
    return snap
