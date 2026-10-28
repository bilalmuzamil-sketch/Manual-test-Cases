#!/usr/bin/env python3
"""W4 — A/R Aging historical as-of check, replayed independently.

For each historical as-of date, rebuild each invoice's open balance from the invoice record total
(/tmp/cln/dv/inv) minus every payment the customer's own Payments list (/tmp/cln/w4/pay) shows against
that invoice dated on/before the as-of instant, skipping reversed payments. Compare with the A/R Aging
Detail invoice rows for that date. PRD 82083852 v25: "If an invoice was unpaid on the selected date but
paid later, it must still appear in the historical report."
"""
import json, glob, collections, datetime as dt, sys
from zoneinfo import ZoneInfo
OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/reports/W4-finance-accounting-comms'
inv = {}
for f in glob.glob('/tmp/cln/dv/inv/*.json'):
    try:
        c = json.load(open(f))['body']['data']['collection']
    except Exception:
        continue
    inv[c['display_number']] = c
pay = collections.defaultdict(list)   # display number -> [(payment instant, amount, status)]
for f in glob.glob('/tmp/cln/w4/pay/*.json'):
    for p in json.load(open(f)).get('payments', []):
        sts = p.get('payment_statements') or []
        cm = sum(x.get('amount') or 0 for x in p.get('applied_credit_memos') or [])
        for s in sts:
            n = s.get('invoice_display_number') or s.get('invoice_number')
            amt = s['settlement_amount'] if s.get('settlement_amount') is not None else s['amount'] + (cm if len(sts) == 1 else 0)
            pay[n].append((p['payment_date'], amt, p.get('payment_status'), p.get('display_type'), p.get('is_deposit')))
res = {'cache_invoices': len(inv), 'snapshots': {}}
for snap in sys.argv[1:] or ['hd_2026-09-30', 'hd_2026-06-30', 'hd_2025-12-31']:
    S = json.load(open(f'/tmp/cln/w4/ar/{snap}/detail.json'))
    A = S['asOf'].replace('T', ' ')[:19]
    D = S['data']['buckets']
    rep = {t['transactionNumber']: t for b in D if isinstance(D[b], dict) for t in D[b]['transactions'] if t['type'] == 'invoice'}
    replay = {}
    for n, c in inv.items():
        created = c['created_on'].replace('T', ' ')[:19]
        if created > A or c.get('status') in ('void', 'voided', 'reversed'):
            continue
        paid = sum(a for d, a, st, *_ in pay.get(n, []) if d <= A and st != 'reversed')
        bal = round(float(str(c['total_balance']).replace(',', '')) - paid, 2)
        if bal > 0.004:
            replay[n] = bal
    both = set(rep) & set(replay)
    diff = [(n, rep[n]['balance'], replay[n]) for n in both if abs(rep[n]['balance'] - replay[n]) >= 0.015]
    only_rep = [(n, rep[n]['balance'], n in inv) for n in set(rep) - set(replay)]
    only_rep_cached = [x for x in only_rep if x[2]]
    only_replay = [(n, replay[n], inv[n]['status'], inv[n]['created_on'][:10]) for n in set(replay) - set(rep)]
    res['snapshots'][snap] = {'asOf': A, 'report_invoices': len(rep), 'replay_open': len(replay), 'matched': len(both) - len(diff),
                              'balance_diff': diff[:30], 'balance_diff_n': len(diff), 'report_not_open_by_replay_n': len(only_rep_cached),
                              'report_not_open_by_replay': only_rep_cached[:30], 'report_not_in_cache_n': len(only_rep) - len(only_rep_cached),
                              'open_by_replay_missing_from_report_n': len(only_replay), 'open_by_replay_missing_from_report': sorted(only_replay)[:40]}
    print(snap, {k: v for k, v in res['snapshots'][snap].items() if not isinstance(v, list)})
json.dump(res, open(f'{OUT}/results-ar-history.json', 'w'), indent=1)
