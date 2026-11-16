#!/usr/bin/env python3
"""Area 3 — Technician Utilization S2-R8a (rate in effect when clocked) and S2-E3 ("—" when no rate), seeded on
ZZAUTOTEST V1R-87 Location C (America/Edmonton). TU spec Confluence 641400833 v9 (13 Aug 2026).
Every write is logged to ../seed-log.jsonl and restored at the end. SECRET-FREE. Run: TZ=America/Edmonton python3 tu_rate.py
Writes evidence (no names) to tu-rate-results.json."""
import sys, os, json, time, datetime as dt
from zoneinfo import ZoneInfo
from urllib.parse import urlencode
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/report-gaps-2026-11-16/area1/tools')
from collect_dashboard import curl
from collect_reports import instants
WID, TZ = '613d5730-af58-47c5-ad64-52bb5a8cf58d', 'America/Edmonton'; Z = ZoneInfo(TZ); H = {'X-Location-ID': WID}
TECH = 'b669608e-a897-4f21-a510-8ced9d9fa982'; DEPT = '0653be2e-2816-4428-8dd2-db3526cccebb'
D = os.path.dirname(os.path.abspath(__file__)); LOG = os.path.join(D, '..', 'seed-log.jsonl'); RES = {'steps': []}
def log(op, body, s, b, why):
    open(LOG, 'a').write(json.dumps({'at': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'), 'area': 3, 'op': op, 'request': body, 'http': s, 'response': (json.dumps(b)[:400] if b is not None else None), 'why': why}) + '\n')
def call(m, p, body=None, why=''):
    s, b = curl(m, p, body, extra_headers=H); log(f'{m} {p}', body, s, b, why); return s, b
def lt():
    s, b = curl('GET', '/api/labour-types', extra_headers=H); d = b.get('data'); return d.get('collection', d) if isinstance(d, dict) else d
def tu(day, label):
    s, e = instants(day, day, TZ)
    c, b = curl('GET', '/api/reporting/reports/technician-utilization?' + urlencode([('range', 'custom'), ('start_date', s), ('end_date', e), ('locations', WID), ('pagination[page]', 1), ('pagination[rowsPerPage]', 100)]), extra_headers=H)
    rows = [r for r in (b.get('data') or {}).get('collection', []) if r.get('staff_id') == TECH] if c == 200 else []
    r = rows[0] if rows else None
    out = {'label': label, 'day': day.isoformat(), 'http': c, 'internal_h': round((r or {}).get('internal_seconds', 0) / 3600, 4) if r else None,
           'est_lost_labor_cents': (r or {}).get('est_lost_labor_cents') if r else None, 'row_keys': sorted(r.keys()) if r else None, 'read_at_utc': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')}
    RES['steps'].append(out); print(json.dumps(out)); return out
def clock(a, b, why):
    f = lambda x: x.strftime('%d/%m/%Y %H:%M')
    s, r = call('POST', '/api/technician-tasks/create', {'tech_assigned_id': TECH, 'department_id': DEPT, 'start_date': f(a), 'end_date': f(b)}, why)
    tid = ((r or {}).get('data') or {}).get('id') or ((r or {}).get('data') or {}).get('technician_task_id') if isinstance(r, dict) else None
    RES.setdefault('clocks', []).append({'start_local': f(a), 'end_local': f(b), 'http': s, 'id': tid}); return tid
def setrate(t, rate, why):
    body = {'labour_type_id': t['id'], 'id': t['id'], 'name': t['name'], 'labour_rate': rate, 'labourRate': rate, 'is_default': True, 'isDefault': True}
    s, b = call('POST', '/api/labour-types/change', body, why); RES['steps'].append({'set_rate': rate, 'http': s, 'at_utc': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'), 'resp': json.dumps(b)[:200]}); return s
def wait_until(t):
    while dt.datetime.now(Z) < t: time.sleep(5)
call('POST', '/api/iam/change-location', {'workplace_id': WID, 'workplace_timezone': TZ}, 'Rule 99 session zone')
RES['rule99'] = {'location': 'ZZAUTOTEST V1R-87 Location C', 'zone': TZ, 'process_TZ': os.environ.get('TZ'), 'session_change_location_zone': TZ}
L0 = lt(); RES['labour_types_before'] = [{k: x.get(k) for k in ('id', 'name', 'labour_rate', 'is_default')} for x in L0]; T0 = [x for x in L0 if x.get('is_default')][0]
nov10 = dt.date(2026, 11, 10); today = dt.datetime.now(Z).date()
c0 = clock(dt.datetime(2026, 11, 10, 8, 0, tzinfo=Z), dt.datetime(2026, 11, 10, 10, 0, tzinfo=Z), 'C0: 2 h department time on Nov 10, before any rate change')
tu(nov10, 'baseline Nov 10 (rate 135)')
# S2-R8a: rate 100 at T1, clock 2 minutes after it; rate 200 at T2, clock 2 minutes after it
st = setrate(T0, 100, 'S2-R8a: first rate change 135 -> 100')
if st not in (200, 201): RES['abort'] = f'rate change refused {st}'
else:
    t1 = dt.datetime.now(Z).replace(second=0, microsecond=0) + dt.timedelta(minutes=1); wait_until(t1 + dt.timedelta(minutes=2, seconds=10))
    c1 = clock(t1, t1 + dt.timedelta(minutes=2), 'C1: 2 min while rate = 100')
    setrate(T0, 200, 'S2-R8a: second rate change 100 -> 200')
    t2 = dt.datetime.now(Z).replace(second=0, microsecond=0) + dt.timedelta(minutes=1); wait_until(t2 + dt.timedelta(minutes=2, seconds=10))
    c2 = clock(t2, t2 + dt.timedelta(minutes=2), 'C2: 2 min while rate = 200')
    tu(today, 'today after C1@100 and C2@200 (rate now 200)'); tu(nov10, 'Nov 10 after both changes (rate now 200)')
    setrate(T0, 135, 'restore rate 135')
    tu(today, 'today after restoring 135'); tu(nov10, 'Nov 10 after restoring 135')
# S2-E3: remove the location's only (default) labour type, read, then put it back
s, b = call('POST', '/api/labour-types/delete', {'id': T0['id']}, 'S2-E3: location with no default labour rate')
RES['delete_default'] = {'http': s, 'resp': json.dumps(b)[:300], 'labour_types_after_delete': [{k: x.get(k) for k in ('name', 'labour_rate', 'is_default')} for x in (lt() or [])]}
if s in (200, 201, 204):
    tu(today, 'today with NO rate'); tu(nov10, 'Nov 10 with NO rate')
    open('/tmp/cln/rg16/a3_norate.flag', 'w').write('1')
    print('NO-RATE STATE: waiting 240 s for the screen capture'); time.sleep(240)
    s2, b2 = call('POST', '/api/labour-types/create', {'name': T0['name'], 'labour_rate': 135, 'labourRate': 135, 'is_default': True, 'isDefault': True}, 'restore: recreate General Labor 135 as default')
    RES['restore_create'] = {'http': s2, 'resp': json.dumps(b2)[:300]}
RES['labour_types_end'] = [{k: x.get(k) for k in ('name', 'labour_rate', 'is_default')} for x in (lt() or [])]
tu(nov10, 'Nov 10 after restore')
for c in RES.get('clocks', []):
    if c.get('id'): s, _ = call('DELETE', f"/api/technician-tasks/{c['id']}", None, 'clean-up seeded clock'); c['deleted_http'] = s
json.dump(RES, open(os.path.join(D, 'tu-rate-results.json'), 'w'), indent=1); print('DONE')
