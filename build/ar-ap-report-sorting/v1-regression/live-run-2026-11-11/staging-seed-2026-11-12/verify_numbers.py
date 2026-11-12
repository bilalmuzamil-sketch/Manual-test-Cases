#!/usr/bin/env python3
"""Rule 111 read-back, READ-ONLY: does every number the cases will look for (cases_qa.js num(), run on staging) equal
the number staging itself shows for that document? Staging's own display numbers are read from the lists the payment
screens use (GET customer-account/list-unpaid-transaction and parts-catalogue/vendor/transactions/list-unpaid-by-
vendor-account; app/src/api/... - the same calls seed.py makes). Only OPEN documents are listed there, so paid,
reversed or voided ones are reported as 'not listed (closed)', never as a match.
    python3 verify_numbers.py > number-readback.txt"""
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); TOOLS = os.path.join(os.path.dirname(HERE), 'tools')
sys.path.insert(0, TOOLS)
from api import call
L = json.load(open(os.path.join(TOOLS, 'seeded-staging.json')))
keys = [k for k in L if k.startswith('doc:')]
js = ("const C=require('./cases_qa.js'); const ks=JSON.parse(process.argv[1]); const o={}; for (const k of ks) o[k]=C.num(k); console.log(JSON.stringify(o));")
want = json.loads(subprocess.run(['node', '-e', js, json.dumps(keys)], cwd=TOOLS, capture_output=True, text=True,
                                 env=dict(os.environ, RUN_ENV='staging')).stdout)
shown = {}   # id -> display number, from staging's own lists
for k, r in L.items():
    if k.startswith('cust:'):
        c = call('staging', f"/api/customer-account/list-unpaid-transaction?accountId={r['account']}&pagination[page]=1&pagination[rowsPerPage]=200")
        for x in c['json']['data']['response']['collection']:
            n = x.get('invoice_display_number') or x.get('credit_display_number') or x.get('formatted_invoice_number')
            for i in (x.get('reference_id'), x.get('id')): shown[i] = n
    if k.startswith('vendor:'):
        c = call('staging', f"/api/parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account?accountId={r['account']}&pagination[page]=1&pagination[rowsPerPage]=200")
        for x in c['json']['data']['response']['collection']:
            n = x.get('invoice_number') or x.get('credit_memo_number') or x.get('number')
            for i in (x.get('reference_id'), x.get('id')): shown[i] = n
match = mism = closed = nonum = 0
for k in sorted(keys):
    r = L[k]; w = want.get(k)
    if not w: nonum += 1; continue
    ids = [r.get(f) for f in ('invoice_id', 'id', 'txn', 'delivery') if r.get(f)]
    got = next((shown[i] for i in ids if i in shown), None)
    if got is None:
        # vendor bills/credits carry our own number: look it up by value
        got = w if w in shown.values() else None
    if got is None: closed += 1; print(f'not listed (closed/paid/reversed)  {k:22s} expects {w}')
    elif got == w: match += 1; print(f'MATCH     {k:22s} {w}')
    else: mism += 1; print(f'MISMATCH  {k:22s} cases expect {w}  staging shows {got}')
print(f'\n{match} match, {mism} MISMATCH, {closed} not listed because closed, {nonum} have no number (payments etc.) - of {len(keys)} documents')
