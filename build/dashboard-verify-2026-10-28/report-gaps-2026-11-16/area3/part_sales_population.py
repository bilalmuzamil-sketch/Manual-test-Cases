#!/usr/bin/env python3
"""Area 3 — Sales report population, part sales: EVERY invoiced/paid part sale (full list, every page, per location)
started on/after 1 Jan 2025 must appear in the Sales report for Last Year + Last 12 Months (the area-1 reads in
/tmp/cln/rg16/dv/rep). Source: Dashboard PRD v53 §metrics "Revenue | Sum of invoice subtotals in the selected range …
| Sales report" + S3-E2 (void excluded). Missing ones are looked up on the part sale's own record. No names written.
Run: TZ=<any> python3 part_sales_population.py  (each location's dates are compared in that location's zone)"""
import sys, os, json, datetime as dt, collections
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/report-gaps-2026-11-16/area1/tools')
from collect_dashboard import curl, WORKPLACES
out = {'source': 'Dashboard PRD 788430850 v53: Revenue = "Sum of invoice subtotals in the selected range" (Sales report); S3-E2 void excluded', 'locations': {}}
for wid, name, tz in WORKPLACES:
    curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz}); H = {'X-Location-ID': wid}
    seen, pg = {}, 1
    while pg < 200:
        s, b = curl('GET', f'/api/part-sales?pagination%5Bpage%5D={pg}&pagination%5BrowsPerPage%5D=100', extra_headers=H)
        col = (b.get('data') or {}).get('partSales', []) if s == 200 else []
        new = [x for x in col if x['id'] not in seen]
        for x in col: seen[x['id']] = x
        if not new: break
        pg += 1
    rows = {}
    for lab in ('last_year', 'last_12_months'):
        p = f'/tmp/cln/rg16/dv/rep/{wid}/{lab}__sales.json'
        j = json.load(open(p)); win = (j['from'], j['to'])
        for r in j['body']['data']['collection']: rows.setdefault(r.get('work_order_id'), []).append((lab, r.get('invoice_number'), r.get('invoice_date')))
    pop = [x for x in seen.values() if x.get('status') in ('invoiced', 'paid') and (x.get('startDate') or '') >= '2025-01-01']
    missing = []
    for x in pop:
        if x['id'] in rows: continue
        s, v = curl('GET', f"/api/part-sales/view/{x['id']}", extra_headers=H)
        d = (v or {}).get('data') if isinstance(v, dict) else None
        flat = {k: val for k, val in (d.get('part_sale', d) if isinstance(d, dict) else {}).items() if not isinstance(val, (dict, list))} if isinstance(d, dict) else {}
        missing.append({'number': x.get('number'), 'status': x.get('status'), 'start': x.get('startDate'), 'view_http': s,
                        'record_dates': {k: flat[k] for k in flat if 'date' in k.lower() or 'invoice' in k.lower()}})
    out['locations'][name] = {'zone': tz, 'part_sales_listed': len(seen), 'pages': pg, 'statuses': dict(collections.Counter(x.get('status') for x in seen.values())),
                              'population_invoiced_or_paid_since_2025': len(pop), 'found_in_sales': len(pop) - len(missing), 'missing': missing[:50], 'missing_count': len(missing)}
    print(name, out['locations'][name]['part_sales_listed'], 'population', len(pop), 'missing', len(missing), flush=True)
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'part-sales-population.json'), 'w'), indent=1)
