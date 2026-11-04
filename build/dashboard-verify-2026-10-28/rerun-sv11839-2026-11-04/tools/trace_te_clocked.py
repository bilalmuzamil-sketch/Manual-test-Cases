#!/usr/bin/env python3
"""Trace the small clocked-hour gaps (report > recompute) on Technician Efficiency, Last 12 Months: fetch the report's own
per-line rows (GET /api/reporting/technician-efficiency/expanded/custom, staffIds[]) and compare each line with the work
order's own clock records. SECRET-FREE. Output /tmp/cln/dvqa/out/trace_te.json + summary."""
import json, os, sys, collections
from urllib.parse import urlencode
sys.path.insert(0, os.path.dirname(__file__))
from collect_dashboard import curl
import oracle_te_prd as O   # reuse recs()/lines() — importing runs the oracle once (cheap, cached)
res = json.load(open('/tmp/cln/dvqa/out/oracle_te_prd.json'))['te']
fails = [r for r in res if r['result'] != 'PASS' and r['range'] == 'last_12_months']
WID = {v: k for k, v in O.W.items()}
out = []
for r in fails:
    wid = WID[r['location']]
    te = json.load(open(f'/tmp/cln/dvqa/rep/{wid}/last_12_months__te.json'))
    row = [x for x in te['body']['data']['collection'] if x['technician'] == r['technician']][0]
    sid = row['technicianId']
    q = [('range', 'custom'), ('start_date', te['start']), ('end_date', te['end']), ('staffIds[]', sid)]
    c, b = curl('GET', '/api/reporting/technician-efficiency/expanded/custom?' + urlencode(q), extra_headers={'X-Location-ID': wid})
    json.dump(b, open(f'/tmp/cln/dvqa/out/te_expanded_{sid[:8]}.json', 'w'))
    out.append({'location': r['location'], 'technician': r['technician'], 'sid': sid, 'status': c, 'report_clocked': r['report_clocked'], 'oracle_clocked': r['oracle_clocked'],
                'keys': list((b or {}).get('data', {}) if isinstance((b or {}).get('data'), dict) else [])[:10]})
    print(r['location'][:12], r['technician'], c, json.dumps(b)[:300])
json.dump(out, open('/tmp/cln/dvqa/out/trace_te.json', 'w'), indent=1)
