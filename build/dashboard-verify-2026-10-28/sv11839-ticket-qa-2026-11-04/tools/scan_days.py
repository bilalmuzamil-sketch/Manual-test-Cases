"""Scan single days at a location for invoice count and revenue split (SV-11821 / SV-11823 day selection). SECRET-FREE."""
import sys, json, datetime as dt
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/rerun-sv11839-2026-11-04/tools')
from collect_dashboard import curl
wid, tz, start, end, out = sys.argv[1:6]
c, _ = curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz})
print('change-location', c)
d = dt.date.fromisoformat(start); e = dt.date.fromisoformat(end); rows = []
while d <= e:
    q = f'/api/dashboard/reports?reports[]=revenueKpi&reports[]=invoicesKpi&from={d}&to={d}'
    c, j = curl('GET', q)
    data = (j or {}).get('data', {}) if isinstance(j, dict) else {}
    rows.append({'day': str(d), 'http': c, 'revenue': data.get('revenueKpi'), 'invoices': data.get('invoicesKpi')})
    d += dt.timedelta(days=1)
json.dump(rows, open(out, 'w'))
print('sample invoicesKpi', json.dumps(rows[0]['invoices'])[:300])
one = [r['day'] for r in rows if isinstance(r['invoices'], dict) and (r['invoices'].get('count', r['invoices'].get('value')) == 1)]
neg = [(r['day'], r['revenue']) for r in rows if isinstance(r['revenue'], dict) and any((r['revenue'].get(k) or 0) < 0 or (r['revenue'].get(k) or 0) > 100 for k in ('partsPct', 'laborPct', 'otherPct'))]
nullsplit = [(r['day'], r['revenue']) for r in rows if isinstance(r['revenue'], dict) and r['revenue'].get('value') and r['revenue'].get('partsPct') is None]
zero = [(r['day'], r['revenue']) for r in rows if isinstance(r['revenue'], dict) and r['revenue'].get('value', 0) > 0 and 0 in [r['revenue'].get(k) for k in ('partsPct', 'laborPct', 'otherPct')]]
print('one-invoice days', one[:15])
print('neg/over100 split days', json.dumps(neg[:10])[:1500])
print('null split with revenue', json.dumps(nullsplit[:10])[:1500])
print('a zero share with revenue', json.dumps(zero[:5])[:800])
