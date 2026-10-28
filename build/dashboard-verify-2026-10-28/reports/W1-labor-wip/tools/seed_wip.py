#!/usr/bin/env python3
"""Seed known WIP data in DVI Test (throwaway, ZZAUTOTEST) and read the WIP row after each step.
Every created id is recorded in /tmp/cln/w1/seed.json (no secrets) and copied to the results folder.
Usage: seed_wip.py <step> [args]   steps: customer TAG | wo TAG | line WO | raw METHOD PATH JSON | wip WO_NUMBER
"""
import json, os, sys, datetime as dt
from zoneinfo import ZoneInfo
TOOLS = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools'
import w1env  # own session (see w1env.py)
from w1env import curl
from w1env import instants, get

WID, TZ = '39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto'
CANNED = '6e1ec60e-7412-48ae-9f96-f59e653c01a1'
STATE = '/tmp/cln/w1/seed.json'
S = json.load(open(STATE)) if os.path.exists(STATE) else {}
H = {'X-Location-ID': WID}


def save():
    json.dump(S, open(STATE, 'w'), indent=1)


def call(method, path, body=None):
    c, b = curl(method, path, body, extra_headers=H)
    print(method, path, '->', c, json.dumps(b)[:300])
    return c, b


def did(b):
    d = (b or {}).get('data', b) or {}
    for k in ('id', 'company_id', 'contact_id', 'vehicle_id', 'work_order_id', 'line_id'):
        if isinstance(d, dict) and d.get(k):
            return d[k]
    if isinstance(d, dict):
        for v in d.values():
            if isinstance(v, dict) and v.get('id'):
                return v['id']
    return None


def wip_rows(wo_number):
    curl('POST', '/api/iam/change-location', {'workplace_id': WID, 'workplace_timezone': TZ})
    t = dt.datetime.now(ZoneInfo(TZ)).date(); s, e = instants(t, t, TZ)
    out = []
    for tab in ['ApprovedPartiallyCompleted', 'ApprovedNotStarted', 'Completed', 'Estimates']:
        c, b = get('/api/reporting/reports/work-in-progress', [('from', s), ('to', e), ('locations', WID), ('tab', tab),
                   ('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)], WID)
        for r in b['data']['collection']:
            if r['number'] == wo_number:
                out.append({k: r[k] for k in ['tab', 'status', 'labor_earned', 'labor_remaining', 'parts_earned', 'parts_remaining',
                                               'earned', 'remaining', 'adjustments', 'total', 'quoted_hours', 'worked_hours']})
    return out


if __name__ == '__main__':
    step = sys.argv[1]
    curl('POST', '/api/iam/change-location', {'workplace_id': WID, 'workplace_timezone': TZ})
    if step == 'customer':
        tag = sys.argv[2]
        c, b = call('POST', '/api/customers/create', {'name': f'ZZAUTOTEST WIP {tag}'}); cid = did(b)
        c, b = call('POST', '/api/contacts/create', {'company_id': cid, 'first_name': f'ZZAUTOTEST {tag}', 'last_name': 'Contact'}); ct = did(b)
        c, b = call('POST', '/api/vehicles/create', {'company_id': cid, 'customer_id': ct, 'unit': f'ZZ-WIP-{tag}'}); vid = did(b)
        S.setdefault('customers', {})[tag] = {'company_id': cid, 'contact_id': ct, 'vehicle_id': vid}; save()
        print(S['customers'][tag])
    elif step == 'raw':
        c, b = call(sys.argv[2], sys.argv[3], json.loads(sys.argv[4]) if len(sys.argv) > 4 else None)
        print(json.dumps(b)[:3000])
    elif step == 'wip':
        print(json.dumps(wip_rows(sys.argv[2]), indent=1))
    elif step == 'note':
        S.setdefault('notes', []).append(sys.argv[2]); save()
