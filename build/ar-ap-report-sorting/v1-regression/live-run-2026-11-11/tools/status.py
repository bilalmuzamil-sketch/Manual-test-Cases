#!/usr/bin/env python3
"""READ-ONLY status board for the seeded universe (Rule 114). Never writes.
For every customer and vendor in manifest.json it asks the report's own back end - the same
endpoints the A/R Aging Detail and A/P Aging Detail screens call - what is open for that party on
the as-of date, and lists the document numbers the report returns. Run it FIRST after a redeploy:
    python3 status.py qa [YYYY-MM-DD]
A party with no lines that the manifest says should have open documents prints MISSING.
(The run harness then proves the same records on the screen itself, with screenshots.)"""
import json, os, sys, datetime
from api import call
HERE = os.path.dirname(os.path.abspath(__file__))
ENV = sys.argv[1] if len(sys.argv) > 1 else 'qa'
AS_OF = sys.argv[2] if len(sys.argv) > 2 else datetime.date.today().isoformat()
M = json.load(open(f'{HERE}/manifest.json')); L = json.load(open(f'{HERE}/seeded-{ENV}.json'))
BUCKETS = ['days_91_plus', 'days_61_to_90', 'days_31_to_60', 'days_1_to_30', 'current']
def lines(slug, filt, pid):
    g = call(ENV, f'/api/reporting/reports/{slug}?asOfDate={AS_OF}&{filt}={pid}')
    if g['status'] != 200: return None, f"HTTP {g['status']}"
    out = []
    for grp in g['json']['data']['groups']:
        if not grp['rowsNumber']: continue
        r = call(ENV, f"/api/reporting/reports/{slug}/buckets/{grp['bucket']}/rows?asOfDate={AS_OF}&{filt}={pid}&pagination[page]=1&pagination[rowsPerPage]=200")
        for row in ((r['json'] or {}).get('data') or {}).get('collection') or []:
            out.append((grp['bucket'], row.get('documentNumber') or row.get('number') or row.get('docNumber'), row.get('openBalanceCents')))
    return out, None
miss = 0
for kind, slug, filt, parties in (('cust', 'ar-aging-detail', 'customers', M['customers']), ('vendor', 'ap-aging-detail', 'vendors', M['vendors'])):
    for p in parties:
        rec = L.get(f"{kind}:{p['key']}")
        if not rec: print(f"MISSING  {p['key']:5s} {p['name']} (not in ledger)"); miss += 1; continue
        got, err = lines(slug, filt, rec['id'])
        if err: print(f"ERROR    {p['key']:5s} {err}"); miss += 1; continue
        state = 'OK     ' if got else 'NO-OPEN'
        print(f"{state}  {p['key']:5s} {len(got):3d} open line(s) on {AS_OF}: " + ', '.join(f"{n}@{b}={c}" for b, n, c in got[:6]))
print(f'as of {AS_OF}: {miss} missing/error (NO-OPEN is expected for parties whose documents are all closed or future-dated, e.g. R14, R51, R16, R71)')
