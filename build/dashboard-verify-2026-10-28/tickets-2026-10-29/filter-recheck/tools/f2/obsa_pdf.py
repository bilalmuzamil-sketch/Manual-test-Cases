# OBS A: Inventory Value PDF (and CSV) export per location set: HTTP status, seconds, bytes, error text. Same query shape the page sends.
# Usage: TZ=America/Toronto python3 obsa_pdf.py <label> [extra key=value ...]   SECRET-FREE (cookie never printed).
import os, sys, datetime as dt, json, subprocess, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common_f2 import *
import collect_dashboard
from zoneinfo import ZoneInfo
zone = os.environ['TZ']; assert zone == 'America/Toronto'
label = sys.argv[1]; extra = [tuple(a.split('=', 1)) for a in sys.argv[2:]]
change_loc(DVI); today = dt.datetime.now(ZoneInfo(zone)).date(); s, e = instants(today, today, zone)
LB, QB = 'f8a8b802-7780-4b16-bf10-343caeb616b2', '25a0d576-b371-4b82-bef4-41ba977f31c2'
sets = {'DVI': [DVI], 'QB': [QB], 'LB': [LB], 'HD': [HD], 'HD+LB': [HD, LB], 'ALL': ALL}
COLS = 'part_number,description,category,vendor,location,qty,unit_cost,unit_sell,margin,margin_pct,total_sell,total_cost'
out = {'label': label, 'process_TZ': zone, 'local_today': str(today), 'extra': extra, 'runs': []}
for name, locs in sets.items():
    if extra and name in ('DVI', 'QB'): continue
    st, j = get('/api/reporting/reports/inventory-value?' + urlencode(iv_params(locs, today, zone, per=1) + extra), DVI)
    rows = j['data']['pagination']['rowsNumber'] if st == 200 else None
    for fmt in ('pdf', 'csv'):
        q = urlencode([('format', fmt), ('range', 'custom'), ('start_date', s), ('end_date', e), ('locations', ','.join(locs))] + extra + [('columns', COLS)])
        fn = f'/tmp/cln/f2/obsa_{label}_{name}.{fmt}'; t0 = time.time()
        r = subprocess.run(['curl', '-sS', '-4', '--max-time', '300', '-o', fn, '-w', '%{http_code}', '-H', 'Cookie: ' + collect_dashboard.COOKIE, '-H', 'X-Location-ID: ' + DVI,
                            '-H', 'Origin: https://app.staging.shopview.com', collect_dashboard.API + '/api/reporting/reports/inventory-value/export?' + q], capture_output=True, text=True)
        size = os.path.getsize(fn) if os.path.exists(fn) else 0
        head = open(fn, 'rb').read(220).decode('latin-1') if size else r.stderr[:200]
        rec = {'set': name, 'rows': rows, 'format': fmt, 'http': r.stdout, 'secs': round(time.time() - t0, 1), 'bytes': size, 'head': head if not head.startswith('%PDF') else '%PDF…'}
        out['runs'].append(rec); print(json.dumps(rec)[:300], flush=True)
        if fmt == 'csv' and name in ('DVI', 'QB'): pass
json.dump(out, open(f'/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f2/obsA_iv_export_{label}.json', 'w'), indent=1)
