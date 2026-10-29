# OBS A boundary: Inventory Value PDF at Staging Lethbridge narrowed by the part search to N rows; plus a 2-row control and an HD retry.
# Usage: TZ=America/Toronto python3 obsa_boundary.py term [term ...]   ('@HD' = Heavy Duty, no search; '@DVI' = control). SECRET-FREE.
import os, sys, datetime as dt, json, subprocess, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common_f2 import *
import collect_dashboard
from zoneinfo import ZoneInfo
zone = os.environ['TZ']; assert zone == 'America/Toronto'
change_loc(DVI); today = dt.datetime.now(ZoneInfo(zone)).date(); s, e = instants(today, today, zone)
LB = 'f8a8b802-7780-4b16-bf10-343caeb616b2'
COLS = 'part_number,description,category,vendor,location,qty,unit_cost,unit_sell,margin,margin_pct,total_sell,total_cost'
fn_out = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f2/obsA_iv_pdf_boundary.json'
out = json.load(open(fn_out)) if os.path.exists(fn_out) else {'runs': []}
for term in sys.argv[1:]:
    locs, srch = ([HD], None) if term == '@HD' else ([DVI], None) if term == '@DVI' else ([LB], term)
    st, j = get('/api/reporting/reports/inventory-value?' + urlencode(iv_params(locs, today, zone, search=srch, per=1)), DVI)
    rows = j['data']['pagination']['rowsNumber'] if st == 200 else None
    q = [('format', 'pdf'), ('range', 'custom'), ('start_date', s), ('end_date', e), ('locations', ','.join(locs))] + ([('search', srch)] if srch else []) + [('columns', COLS)]
    fn = f'/tmp/cln/f2/obsa_b_{term.strip("@")}.pdf'; t0 = time.time()
    r = subprocess.run(['curl', '-sS', '-4', '--max-time', '300', '-o', fn, '-w', '%{http_code}', '-H', 'Cookie: ' + collect_dashboard.COOKIE, '-H', 'X-Location-ID: ' + DVI,
                        '-H', 'Origin: https://app.staging.shopview.com', collect_dashboard.API + '/api/reporting/reports/inventory-value/export?' + urlencode(q)], capture_output=True, text=True)
    size = os.path.getsize(fn) if os.path.exists(fn) else 0; head = open(fn, 'rb').read(200).decode('latin-1') if size else r.stderr[:200]
    rec = {'at_utc': dt.datetime.now(dt.timezone.utc).isoformat(), 'locations': [NAME[w] for w in locs], 'search': srch, 'rows': rows, 'http': r.stdout, 'secs': round(time.time() - t0, 1), 'bytes': size, 'head': '%PDF…' if head.startswith('%PDF') else head, 'process_TZ': zone}
    out['runs'].append(rec); json.dump(out, open(fn_out, 'w'), indent=1); print(json.dumps(rec)[:330], flush=True)
