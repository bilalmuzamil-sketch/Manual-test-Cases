#!/usr/bin/env python3
"""Item 1, the fixed past as-of date (30 Sep 2026), replayed independently of the report:
open on 30 Sep = open today (the today snapshot, itself verified document by document against the accounts, check_ledgers.py)
                 + every payment applied to that document AFTER the as-of instant (the end of 30 Sep in the location's zone).
A/R payments: each customer account's own payment list (customer-payment/list: payment time, per-invoice settlement amounts).
A/P payments: Reports > Export Reports "Vendor Bill Payment" for 30 Sep .. 31 Dec (day-level dates; a payment dated 30 Sep or
1 Oct cannot be placed before/after the instant from the file alone -> those bills are reported NOT VERIFIED, not guessed).
Source: the as-of date selects what was open on that day (PRD 947650561 S5-R10b / S1-E1; the A/R PRD 82083852 v25: "If an
invoice was unpaid on the selected date but paid later, it must still appear in the historical report").
Usage: check_history.py -> evidence/results-history.json"""
import json, os, glob, csv, io, collections, datetime as dt
from zoneinfo import ZoneInfo
EV = os.path.join(os.path.dirname(__file__), '..', 'evidence'); L = '/tmp/cln/arap/ledgers/'
ZONE = {'HD': 'Asia/Karachi', 'LE': 'America/Edmonton'}; ASOF = dt.date(2026, 9, 30)
c_ = lambda x: int(round(float(str(x).replace(',', '')) * 100))
utc = lambda s: dt.datetime.fromisoformat(s.replace('Z', '+00:00').replace(' ', 'T')).replace(tzinfo=dt.timezone.utc) if s and '+' not in s else dt.datetime.fromisoformat(s)


def docs(key, asof, slug):
    d = json.load(open(f'/tmp/cln/arap/{key}/{asof}/all/{slug}.json'))
    return {r['documentNumber']: r for rows in d['rows'].values() for r in rows if r['transactionType'] == 'Invoice'}


out = {}
for key, tz in ZONE.items():
    today = sorted(p.split('/')[-2] for p in glob.glob(f'/tmp/cln/arap/{key}/2026-11-*/'))[-1]
    end = dt.datetime.combine(ASOF, dt.time(23, 59, 59, 999000), ZoneInfo(tz)).astimezone(dt.timezone.utc)
    res = {}
    # ---------------- A/R
    now = docs(key, today, 'ar-aging-detail'); then = docs(key, '2026-09-30', 'ar-aging-detail')
    after = collections.Counter(); inv_date = {}; before_pay = collections.Counter()
    for f in glob.glob(L + 'pay/*.json'):
        for p in json.load(open(f))['payments']:
            if p.get('payment_status') == 'reversed' or p.get('reversed_at'):
                continue
            sts = p.get('payment_statements') or []; cm = sum(x.get('amount') or 0 for x in p.get('applied_credit_memos') or [])
            for s in sts:
                if s.get('type') != 'invoice':
                    continue
                n = s.get('invoice_display_number'); amt = s['settlement_amount'] if s.get('settlement_amount') is not None else s['amount'] + (cm if len(sts) == 1 else 0)
                if s.get('transaction_date'):
                    inv_date[n] = utc(s['transaction_date'])
                (after if utc(p['payment_date']) > end else before_pay)[n] += c_(amt)
    exp = {}
    for n in set(now) | set(after):
        v = (now[n]['openBalanceCents'] if n in now else 0) + after[n]
        d0 = utc(now[n]['date']) if n in now else inv_date.get(n)
        if v > 0 and d0 is not None and d0 <= end:
            exp[n] = v
    both = set(exp) & set(then)
    diff = sorted((n, then[n]['openBalanceCents'], exp[n]) for n in both if then[n]['openBalanceCents'] != exp[n])
    only_rep = sorted(set(then) - set(exp)); only_exp = sorted(set(exp) - set(then))
    res['ar'] = {'report_invoices': len(then), 'replayed_open': len(exp), 'identical': len(both) - len(diff), 'balance_differs': len(diff), 'balance_differs_first': diff[:15],
                 'on_report_not_open_by_replay': len(only_rep), 'on_report_not_open_by_replay_first': [(n, then[n]['openBalanceCents'], n in now, before_pay[n]) for n in only_rep[:15]],
                 'open_by_replay_not_on_report': len(only_exp), 'open_by_replay_not_on_report_first': [(n, exp[n], str(inv_date.get(n) or (now[n]['date'] if n in now else ''))) for n in only_exp[:15]]}
    # ---------------- A/P (day-level export)
    nowp = docs(key, today, 'ap-aging-detail'); thenp = docs(key, '2026-09-30', 'ap-aging-detail')
    t = json.load(open(L + 'export_vendor_bill_payment.json'))['data'][0]; rows = list(csv.reader(io.StringIO(t)))
    h = rows[0]; ix = {x: i for i, x in enumerate(h)}; aft = collections.Counter(); edge = set()
    for r in rows[1:]:
        if len(r) < len(h) or not r[ix['Bill No']]:
            continue
        d = dt.datetime.strptime(r[ix['Payment Date']], '%m-%d-%Y').date()
        if d in (dt.date(2026, 9, 30), dt.date(2026, 10, 1)):
            edge.add(r[ix['Bill No']])
        if d > ASOF:
            aft[r[ix['Bill No']]] += c_(r[ix['Amount']])
    expp = {}
    for n in set(nowp) | set(aft):
        v = (nowp[n]['openBalanceCents'] if n in nowp else 0) + aft[n]
        if v > 0 and (n in nowp and utc(nowp[n]['date']) <= end or n not in nowp):
            expp[n] = v
    bothp = set(expp) & set(thenp)
    diffp = sorted((n, thenp[n]['openBalanceCents'], expp[n]) for n in bothp if thenp[n]['openBalanceCents'] != expp[n])
    onlyr = sorted(set(thenp) - set(expp)); onlye = sorted(n for n in set(expp) - set(thenp) if n in nowp)
    res['ap'] = {'report_bills': len(thenp), 'replayed_open': len(expp), 'identical': len(bothp) - len(diffp), 'balance_differs': len(diffp), 'balance_differs_first': diffp[:15],
                 'bills_with_a_payment_on_30_Sep_or_1_Oct (NOT VERIFIED from a day-level file)': sorted(edge)[:30],
                 'on_report_not_open_by_replay': len(onlyr), 'on_report_not_open_by_replay_first': [(n, thenp[n]['openBalanceCents'], n in nowp) for n in onlyr[:15]],
                 'open_today_dated_before_as_of_not_on_report': len(onlye), 'first': onlye[:15], 'payments_after_as_of_in_export': sum(aft.values())}
    out[key] = res
    print(key, {s: {k: v for k, v in res[s].items() if isinstance(v, int)} for s in res})
json.dump(out, open(os.path.join(EV, 'results-history.json'), 'w'), indent=1, default=str)
