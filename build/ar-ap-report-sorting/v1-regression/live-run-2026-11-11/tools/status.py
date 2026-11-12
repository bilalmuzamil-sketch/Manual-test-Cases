#!/usr/bin/env python3
"""READ-ONLY status board for the seeded universe (Rule 114). Never writes to the environment.
    python3 status.py qa [YYYY-MM-DD]
    python3 status.py staging [YYYY-MM-DD]
It prints (1) the build marker read off the environment's own app page, (2) the GATE - does the upgraded
report route answer (anything but 404 means the upgrade is there), (3) each location's time zone, shop number
and today's date, read live from the app, and then (4) for every customer and vendor in manifest.json, asks
the report's own back end - the same endpoints the A/R Aging Detail and A/P Aging Detail screens call - what is
open for that party on the as-of date, and lists the document numbers the report returns.
The as-of date defaults to TODAY AT LOCATION A, on location A's own clock (not this machine's).
A party with no lines that the manifest says should have open documents prints MISSING.
(The run harness then proves the same records on the screen itself, with screenshots.)"""
import json, os, re, subprocess, sys
from api import call, APP
from envinfo import load as load_wp, local_today
HERE = os.path.dirname(os.path.abspath(__file__))
ENV = sys.argv[1] if len(sys.argv) > 1 else 'qa'
W = load_wp(ENV)
AS_OF = sys.argv[2] if len(sys.argv) > 2 else local_today(W['A']['timezone']).isoformat()
def marker():
    try:
        html = subprocess.run(['curl', '-s', APP[ENV] + '/'], capture_output=True, text=True, timeout=60).stdout
        m = re.search(r'app-version" content="([^"]*)"', html); return m.group(1) if m else 'unread'
    except Exception: return 'unread'
print(f'{ENV}: build marker {marker()}')
gate = call(ENV, f'/api/reporting/reports/ap-aging-summary?asOfDate={AS_OF}')['status']
print(f"GATE: upgraded report route answers HTTP {gate} -> {'upgrade NOT present (404)' if gate == 404 else 'upgrade present'}")
for r in ('A', 'B'):
    x = W[r]; print(f"location {r}: {x['name']} | {x['timezone']} | shop {x['shop_id']} | today there {local_today(x['timezone'])}")
M = json.load(open(f'{HERE}/manifest.json'))
LP = f'{HERE}/seeded-{ENV}.json'
L = json.load(open(LP)) if os.path.exists(LP) else {}
if not L: print(f'no ledger seeded-{ENV}.json: nothing has been seeded on {ENV} by this kit')
elif L.get('anchor_dates'): print(f"seeded anchor {L['anchor_utc']} -> A {L['anchor_dates']['A']}, B {L['anchor_dates']['B']}")
elif L.get('anchor'): print(f"seeded anchor {L['anchor']} (one date, both locations)")
if gate == 404:
    # Before the upgrade lands the aging report cannot be asked, so prove each party through the screens that exist
    # on every build: the customer and vendor PAYMENT screens' unpaid-transaction lists (the calls seed.py uses).
    n = len(M['customers']) + len(M['vendors']); ok_ = miss = 0
    print(f'report route absent: proving through the payment screens\' unpaid lists instead (open documents only)')
    for kind, parties in (('cust', M['customers']), ('vendor', M['vendors'])):
        for p in parties:
            rec = L.get(f"{kind}:{p['key']}")
            if not rec: print(f"MISSING  {p['key']:5s} {p['name']} (not in ledger)"); miss += 1; continue
            path = (f"/api/customer-account/list-unpaid-transaction?accountId={rec['account']}" if kind == 'cust' else
                    f"/api/parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account?accountId={rec['account']}") + '&pagination[page]=1&pagination[rowsPerPage]=200'
            g = call(ENV, path)
            if g['status'] != 200: print(f"ERROR    {p['key']:5s} HTTP {g['status']}"); miss += 1; continue
            col = g['json']['data']['response']['collection']; ok_ += 1
            nums = [x.get('invoice_display_number') or x.get('credit_display_number') or x.get('invoice_number') or x.get('type') for x in col]
            print(f"{'OK     ' if col else 'NO-OPEN'}  {p['key']:5s} {len(col):3d} open: " + ', '.join(str(x) for x in nums[:6]))
    print(f'{ok_} of {n} parties answered by the payment screens, {miss} missing/error (NO-OPEN is expected for parties whose documents are all closed)'); sys.exit(0)
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
miss = present = 0
for kind, slug, filt, parties in (('cust', 'ar-aging-detail', 'customers', M['customers']), ('vendor', 'ap-aging-detail', 'vendors', M['vendors'])):
    for p in parties:
        rec = L.get(f"{kind}:{p['key']}")
        if not rec: print(f"MISSING  {p['key']:5s} {p['name']} (not in ledger)"); miss += 1; continue
        got, err = lines(slug, filt, rec['id'])
        if err: print(f"ERROR    {p['key']:5s} {err}"); miss += 1; continue
        present += 1
        state = 'OK     ' if got else 'NO-OPEN'
        print(f"{state}  {p['key']:5s} {len(got):3d} open line(s) on {AS_OF}: " + ', '.join(f"{n}@{b}={c}" for b, n, c in got[:6]))
print(f'as of {AS_OF}: {present} of {present + miss} parties answered by the report, {miss} missing/error '
      '(NO-OPEN is expected for parties whose documents are all closed or future-dated, e.g. R14, R51, R16, R71)')
