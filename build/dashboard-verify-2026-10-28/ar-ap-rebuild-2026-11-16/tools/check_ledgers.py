#!/usr/bin/env python3
"""Item 1, independent recompute (16 Nov, as of TODAY): every open document on the reports vs each customer's / vendor's OWN
account list — a different code path (the customer card Invoices tab: customer-account/list-unpaid-transaction; the vendor page
Unpaid list: vendor/transactions/list-unpaid-by-vendor-account), read at every location (ledgers.mjs).
Compares, document by document: present on both sides, open balance, amount, date, due date, location (PRD 947650561 S5-R7
"A row belongs to the location of its own document"), and the per-account and grand totals rebuilt from the ledgers alone,
bucketed by PRD S1-R5a from the ledger's own dates. Report side = HD as-of-today All-locations snapshot (collect.mjs).
Usage: check_ledgers.py -> evidence/results-ledgers.json"""
import json, os, glob, collections, datetime as dt
from zoneinfo import ZoneInfo
EV = os.path.join(os.path.dirname(__file__), '..', 'evidence'); L = '/tmp/cln/arap/ledgers/'; TZ = 'Asia/Karachi'


def cents(x):
    return int(round(float(str(x).replace(',', '')) * 100))


def utc(s):
    return dt.datetime.fromisoformat(s.replace('Z', '+00:00').replace(' ', 'T')).replace(tzinfo=dt.timezone.utc) if s else None


def day(s):
    return utc(s).astimezone(ZoneInfo(TZ)).date() if s else None


def bucket(pd):
    return 'current' if pd <= 0 else 'days_1_to_30' if pd <= 30 else 'days_31_to_60' if pd <= 60 else 'days_61_to_90' if pd <= 90 else 'days_91_plus'


import re as _re
norm = lambda n, t: _re.sub(r'^([A-Za-z]+)\d*-', r'\1-', n) if t in ('Credit Memo', 'Deposit') and n else n   # CM2-4324 ~ CM-4324


def main():
    today = sorted(p.split('/')[-2] for p in glob.glob('/tmp/cln/arap/HD/2026-11-*/'))[-1]; A = dt.date.fromisoformat(today)
    snap = lambda s: json.load(open(f'/tmp/cln/arap/HD/{today}/all/{s}.json'))
    acc = json.load(open(L + 'accounts.json')); wps = [d.rstrip('/').split('/')[-1] for d in glob.glob(L + '*-*-*-*-*/')]
    out = {'as_of': today, 'zone': TZ, 'workplaces_read': len(wps)}
    for side in ('ar', 'ap'):
        det = snap(f'{side}-aging-detail'); rep = {}
        for b, rows in det['rows'].items():
            for r in rows:
                # A/R joins on the number (credit-memo numbers normalised); A/P on the document id, which IS the vendor-list row id
                rep[(r['customerId'] if side == 'ar' else r['vendorId'], norm(r['documentNumber'], r['transactionType']) if side == 'ar' else r['documentId'], r['transactionType'])] = dict(r, _b=b)
        led = {}; seen_at = collections.defaultdict(set)
        for w in wps:
            for f in glob.glob(f'{L}{w}/{"c" if side == "ar" else "v"}_*.json'):
                d = json.load(open(f)); aid = d.get('cid') or d.get('vid')
                for r in d['rows']:
                    if side == 'ar' and r['type'] == 'deposit':
                        continue                      # the Invoices-tab list gives deposits no number/balance: use the Deposits list
                    led[r['id']] = dict(r, _acct=aid); seen_at[r['id']].add(w)
                if side == 'ar':
                    for x in ((d.get('deposits') or {}).get('collection') or []):
                        if x.get('reversedAt') or not x.get('openBalance'):
                            continue
                        led[x['id']] = {'id': x['id'], '_acct': aid, 'type': 'deposit', 'type_label': 'Deposit', 'status': x['status'], 'credit_display_number': x['creditNumber'],
                                        'balance': x['openBalance'], 'amount': x['amount'], 'date': x['depositDate'], 'due_date': None, 'work_place_id': x['workPlaceId'],
                                        'workplace_name': '', '_dep_status': x['status'], '_wo': x.get('workOrderDisplayNumber')}
                        seen_at[x['id']].add(w)
        T = {'invoice': 'Invoice', 'credit': 'Credit Memo', 'deposit': 'Deposit', 'delivery': 'Invoice'}
        def lnum(r):
            return r.get('formatted_invoice_number') or r.get('invoice_display_number') or r.get('credit_display_number') or r.get('invoice_number') or r.get('raw_number')
        def ltype(r):
            if side == 'ar':
                return T.get(r['type'], r['type'])
            return 'Invoice' if r['type_label'] == 'Invoice' else 'Vendor Credit'
        lk = {}
        skipped = collections.Counter()
        for i, r in list(led.items()):
            if r.get('balance') is not None and cents(r['balance']) == 0:
                skipped['zero balance on the account list (not open)'] += 1; continue
            if r.get('date') and day(r['date']) > A:
                skipped['dated after the as-of date (outside an as-of-today report)'] += 1; continue
            lk.setdefault((r['_acct'], norm(lnum(r), ltype(r)) if side == 'ar' else r['id'], ltype(r)), []).append(r)
        c = collections.Counter(); fails = collections.defaultdict(list)
        def ok(n, cond, det_=None):
            c[n + (':pass' if cond else ':fail')] += 1
            if not cond and len(fails[n]) < 30:
                fails[n].append(det_)
        only_rep = [k for k in rep if k not in lk]; only_led = [k for k in lk if k not in rep and not (lk[k][0].get('_dep_status') == 'held' and lk[k][0].get('_wo'))]
        ok('every report document is open on its account', not only_rep, {'n': len(only_rep), 'first': [(rep[k]['documentNumber'], k[2], rep[k]['openBalanceCents'], rep[k]['locationName']) for k in only_rep[:12]]})
        ok('every open account document is on the report', not only_led, {'n': len(only_led), 'by_status': {f'{a}|{b}': n for (a, b), n in collections.Counter((k[2], lk[k][0].get('status')) for k in only_led).items()}, 'first': [(k[1], k[2], [(x['balance'], x.get('status'), x.get('_wo')) for x in lk[k]][:2]) for k in only_led[:12]]})
        dup = [k for k, v in lk.items() if len(v) > 1]
        ok('account lists hold each document once', not dup, [(k[1], len(lk[k])) for k in dup[:10]])
        per_acct_led = collections.defaultdict(collections.Counter); per_acct_rep = collections.defaultdict(collections.Counter)
        for k, r in rep.items():
            per_acct_rep[k[0]][r['_b']] += r['openBalanceCents']
        held = [k for k, lst in lk.items() if lst[0].get('_dep_status') == 'held' and lst[0].get('_wo')]
        ok('held deposits on an open work order are not on the report (SV-11690: "a held deposit is not an overdue credit - not subtracted from aged A/R")', all(k not in rep for k in held), [k[1] for k in held if k in rep][:10])
        out.setdefault('held_deposits', {})[side] = {'n': len(held), 'cents': sum(abs(cents(lk[k][0]['balance'])) for k in held)}
        for k, lst in lk.items():
            if lst[0].get('_dep_status') == 'held' and lst[0].get('_wo'):
                continue
            l = lst[0]; sign = -1 if k[2] in ('Credit Memo', 'Deposit', 'Vendor Credit') else 1
            bal = sign * abs(cents(l['balance'])); amt = sign * abs(cents(l['amount']))
            due = day(l['due_date']) if k[2] == 'Invoice' and l.get('due_date') else day(l['date'])
            per_acct_led[k[0]][bucket((A - due).days)] += bal
            if k not in rep:
                continue
            r = rep[k]
            ok('open balance = account list', r['openBalanceCents'] == bal, (k[1], k[2], r['openBalanceCents'], bal))
            ok('amount = account list', r['amountCents'] == amt, (k[1], k[2], r['amountCents'], amt))
            ok('date = account list (to the second)', utc(r['date']) == utc(l['date']), (k[1], r['date'], l['date']))
            if k[2] == 'Invoice':
                ok('due date = account list (to the second)', utc(r['dueDate']) == utc(l['due_date']), (k[1], r['dueDate'], l['due_date']))
            if side == 'ar':
                ok('location = the document\'s own location (S5-R7)', r['workplaceId'] == l.get('work_place_id'), (k[1], r['locationName'], l.get('workplace_name')))
            else:
                ok('location = the location whose vendor list holds it (S5-R7)', r['workplaceId'] in seen_at[l['id']], (k[1], r['locationName'], len(seen_at[l['id']])))
        for a in set(per_acct_led) | set(per_acct_rep):
            ok('account buckets rebuilt from the account list alone = report (S1-R5a, S5-R18a)', per_acct_led[a] == per_acct_rep[a] or {k: v for k, v in per_acct_led[a].items() if v} == {k: v for k, v in per_acct_rep[a].items() if v}, (a, dict(per_acct_rep[a]), dict(per_acct_led[a])))
        g_led = collections.Counter(); [g_led.update(v) for v in per_acct_led.values()]
        ok('grand bucket totals from the account lists = report Totals', all(g_led[g['bucket']] == g['openBalanceCents'] for g in det['groups']), ({g['bucket']: g['openBalanceCents'] for g in det['groups']}, dict(g_led)))
        out[side] = {'report_documents': len(rep), 'account_documents': len(lk), 'account_items_skipped': dict(skipped), 'counts': dict(c), 'failures': dict(fails)}
        print(side, len(rep), len(lk), {k: v for k, v in c.items() if k.endswith(':fail')}, sum(v for k, v in c.items() if k.endswith(':pass')))
    json.dump(out, open(os.path.join(EV, 'results-ledgers.json'), 'w'), indent=1, default=str)


if __name__ == '__main__':
    main()
