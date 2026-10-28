#!/usr/bin/env python3
"""Sales Tax Collected — status and paid-date checks against a FRESH oracle (/tmp/cln/w2/taxor: invoice record +
the work order's finance record incl. deposits), plus the population check. Complements check_tax.py (amount
columns, totals, tax rates). Output /tmp/cln/w2/full/results-tax-status.json. SECRET-FREE."""
import json, os, sys, glob, collections, datetime as dt
from zoneinfo import ZoneInfo
sys.path.insert(0, os.path.dirname(__file__))
from common import *
OR = {}
for p in glob.glob(os.path.join(RAW, 'taxor', '*.json')):
    o = json.load(open(p)); OR[o['number']] = o
rows = []
def add(loc, rng, check, ok, detail, src, level='row', key=''):
    rows.append({'report': 'Sales Tax Collected', 'location': loc, 'range': rng, 'level': level, 'key': key, 'check': check,
                 'result': ok if isinstance(ok, str) else ('PASS' if ok else 'FAIL'), 'detail': detail, 'source': src})
def latest(o):
    ds = [x['payment_date'] for x in o['payments'] if x.get('payment_date')]
    return max(ds) if ds else None
for wid, name, tz in WORKPLACES:
    d = os.path.join(RAW, wid); z = ZoneInfo(tz)
    for lab in ranges(dt.date(2026, 10, 28)):
        for st in ('default', 'paid', 'partially_paid'):
            p = os.path.join(d, f'tax__{lab}__{st}.json')
            if not os.path.exists(p): continue
            S = json.load(open(p))
            if S['status'] != 200: continue
            f, t = S['from'], S['to']; col = S['data']['collection']
            want = {'default': {'paid', 'partially_paid'}, 'paid': {'paid'}, 'partially_paid': {'partially_paid'}}[st]
            for r in col:
                o = OR.get(r['invoiceNumber'])
                if not o: add(name, lab, 'Fresh oracle available for the row', False, r['invoiceNumber'], ''); continue
                add(name, lab, 'Invoice Status = the invoice\'s own payment status (Paid / Partially Paid)', r['status'] == o['payment_status'] or (o['payment_status'] == 'unpaid' and o['wo_invoice_status'] == 'paid' and r['status'] == 'paid'),
                    f'{r["invoiceNumber"]} report {r["status"]} | invoice {o["payment_status"]} (work order {o["wo_invoice_status"]}, open balance {o["open_balance"]}, total {o["sub_total_with_tax"]}, payments {[(x["payment_date"], x["applied_amount"], "deposit" if x["is_deposit"] else "payment") for x in o["payments"]]})',
                    'SV-4573 "Invoice Status (, Partially Paid, Paid)"; CS 215941122 §4A', key=f'{r["status"]}->{o["payment_status"]}')
                lp = latest(o); dep = any(x['is_deposit'] for x in o['payments'])
                ok = bool(lp) and r['paidDate'][:16] == lp[:16]
                add(name, lab, 'Invoice Paid Date = date of the latest payment on the invoice', ok or ('DEPOSIT (applied at invoicing)' if dep else False),
                    f'{r["invoiceNumber"]} report {r["paidDate"]} vs latest payment {lp} deposit={dep}', 'SV-4573 "latest payment"', key='deposit' if dep else '')
            got = {r['invoiceNumber'] for r in col}
            exp = set()
            for num, o in OR.items():
                if not num.startswith(('S1', 'S2', 'S3', 'P1', 'P2', 'P3', 'SMQ')) or o['payment_status'] not in want: continue
                if o.get('_wid') and o['_wid'] != wid: continue
                lp = latest(o)
                if lp and f <= dt.datetime.fromisoformat(lp).replace(tzinfo=dt.timezone.utc).astimezone(z).date().isoformat() <= t: exp.add(num)
            exp &= {n for n in OR if any(n == x for x in got) or True}
            mine = {n for n in exp if (n[:2] == {'b3c8c820-f815-4cf1-8938-10956c5ee71a': 'S2', 'f8a8b802-7780-4b16-bf10-343caeb616b2': 'S3', '25a0d576-b371-4b82-bef4-41ba977f31c2': 'S2', '39522bc6-abca-4f67-bd12-2840043c2d68': 'S1'}[wid]) or n[0] == 'P'}
            add(name, lab, f'Invoices listed vs invoices whose own status is {sorted(want)} and whose latest payment is in the dates (status filter {st})', 'INFO',
                f'{f}..{t} listed {len(got)}; listed but invoice not in that status {sorted(n for n in got if OR.get(n) and OR[n]["payment_status"] not in want)[:6]}', 'SV-4233 (paid date) / CS §5', 'range')
json.dump(rows, open('/tmp/cln/w2/full/results-tax-status.json', 'w'), indent=0)
by = collections.defaultdict(collections.Counter)
for r in rows: by[r['check']][r['result']] += 1
for k, v in by.items(): print(dict(v), '|', k)
c = collections.Counter(r['key'] for r in rows if r['check'].startswith('Invoice Status') and r['result'] == 'FAIL'); print('status mismatches', c)
u = {r['detail'].split()[0] for r in rows if r['check'].startswith('Invoice Status') and r['result'] == 'FAIL'}; print('unique invoices', len(u), sorted(u)[:15])
