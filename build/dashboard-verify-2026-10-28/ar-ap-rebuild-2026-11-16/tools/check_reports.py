#!/usr/bin/env python3
"""A/R + A/P rebuild (16 Nov) — recompute and compare the six aging reports from their own document rows, per PRD
947650561 v13 (13 Nov 2026), for each collected (location zone, as-of date, scope).

Recompute (independent of the report's own bucket/Past Due/total fields): from each document's Date and Due Date, read in the
request's zone, Past Due = as-of day - due day (S1-R5a; a credit memo / deposit / vendor credit counts its own date as due
date), bucket = Current (<=0) / 1-30 / 31-60 / 61-90 / 91+ (S5-R15 "1 to 30, 31 to 60, 61 to 90 and more than 90 days past the
due date on the as-of date"); then every Detail group, Summary row and bucket, Collection/Unpaid group and Totals row is rebuilt
from those rows and compared with what the report returned (S5-R18, S5-R18a, S6-R4, S5-R7/R8, S5-R3, S2-R1b).
A/R Collection membership: older A/R PRD 82083852 v25 sec.6 "If the calculated days are <= 0, the transaction is not past due
and it's not shown on the report" (unchanged per 947650561 sec.2 "Which rows and amounts each user can see is unchanged").
Usage: check_reports.py   Reads /tmp/cln/arap/<KEY>/<asOf>/<scope>/ ; writes evidence/results-reports.json (counts + every
failure with document number, no customer/vendor names beyond those already in the rows' public staging test data)."""
import json, os, glob, collections, datetime as dt
from zoneinfo import ZoneInfo
EV = os.path.join(os.path.dirname(__file__), '..', 'evidence')
ZONE = {'HD': 'Asia/Karachi', 'LE': 'America/Edmonton'}
OWN = {'HD': 'b3c8c820-f815-4cf1-8938-10956c5ee71a', 'LE': 'f8a8b802-7780-4b16-bf10-343caeb616b2'}
BK = ['days_91_plus', 'days_61_to_90', 'days_31_to_60', 'days_1_to_30', 'current']
SUMK = {'current': 'currentCents', 'days_1_to_30': 'days1To30Cents', 'days_31_to_60': 'days31To60Cents', 'days_61_to_90': 'days61To90Cents', 'days_91_plus': 'days91PlusCents'}
CREDIT = {'Credit Memo', 'Deposit', 'Vendor Credit'}


def day(iso, tz):
    return dt.datetime.fromisoformat(iso.replace('Z', '+00:00')).astimezone(ZoneInfo(tz)).date()


def bucket(pd):
    return 'current' if pd <= 0 else 'days_1_to_30' if pd <= 30 else 'days_31_to_60' if pd <= 60 else 'days_61_to_90' if pd <= 90 else 'days_91_plus'


class C:
    def __init__(s):
        s.n = collections.Counter(); s.f = collections.defaultdict(list)

    def ok(s, name, cond, detail=None):
        s.n[name + (':pass' if cond else ':fail')] += 1
        if not cond and len(s.f[name]) < 40:
            s.f[name].append(detail)


def check(key, asof, scope):
    tz = ZONE[key]; A = dt.date.fromisoformat(asof); d = f'/tmp/cln/arap/{key}/{asof}/{scope}/'
    L = lambda n: json.load(open(d + n + '.json'))
    out = {}
    for side, name_k, id_k in (('ar', 'customerName', 'customerId'), ('ap', 'vendorName', 'vendorId')):
        c = C(); det = L(f'{side}-aging-detail'); summ = L(f'{side}-aging-summary')
        grp_slug = 'ar-aging-collection' if side == 'ar' else 'ap-unpaid-invoices'; grp = L(grp_slug)
        docs = {}; per_acct = collections.defaultdict(lambda: collections.Counter()); acct_locs = collections.defaultdict(set)
        tot = collections.Counter()
        for g in det['groups']:
            rows = det['rows'].get(g['bucket'], [])
            c.ok('D-group-rows-complete', len(rows) == g['rowsNumber'], (g['bucket'], len(rows), g['rowsNumber']))
            c.ok('D-group-amount = rows', sum(r['amountCents'] for r in rows) == g['amountCents'], (g['bucket'], sum(r['amountCents'] for r in rows), g['amountCents']))
            c.ok('D-group-open = rows', sum(r['openBalanceCents'] for r in rows) == g['openBalanceCents'], (g['bucket'], sum(r['openBalanceCents'] for r in rows), g['openBalanceCents']))
            tot['a'] += g['amountCents']; tot['o'] += g['openBalanceCents']; tot['n'] += g['rowsNumber']
            for r in rows:
                c.ok('D-no-duplicate-document', r['documentId'] not in docs, r['documentNumber'])
                docs[r['documentId']] = dict(r, bucket=g['bucket'])
                ddate = day(r['date'], tz)
                credit = r['transactionType'] in CREDIT
                c.ok('D-type-name (S2-R1b)', r['transactionType'] in ({'Invoice', 'Credit Memo', 'Deposit'} if side == 'ar' else {'Invoice', 'Vendor Credit'}), (r['documentNumber'], r['transactionType']))
                c.ok('D-dated-on-or-before-as-of', ddate <= A, (r['documentNumber'], str(ddate)))
                if credit:
                    due = ddate
                    c.ok('D-credit-due-date = own date (S1-R5a)', r['dueDate'] is None or day(r['dueDate'], tz) == ddate, (r['documentNumber'], r['date'], r['dueDate']))
                    c.ok('D-credit-open-balance-negative', r['openBalanceCents'] < 0, (r['documentNumber'], r['openBalanceCents']))
                else:
                    if r['dueDate'] is None:
                        c.ok('D-invoice-has-due-date', False, r['documentNumber']); continue
                    due = day(r['dueDate'], tz)
                    c.ok('D-invoice-open-between-0-and-amount', 0 < r['openBalanceCents'] <= r['amountCents'], (r['documentNumber'], r['amountCents'], r['openBalanceCents']))
                pd = (A - due).days
                c.ok('D-past-due = as-of minus due (S1-R5a)', r['daysPastDue'] == pd, (r['documentNumber'], r['transactionType'], r['date'], r['dueDate'], r['daysPastDue'], pd))
                c.ok('D-in-its-bucket (S1-R5a/S5-R15)', g['bucket'] == bucket(pd), (r['documentNumber'], r['transactionType'], g['bucket'], bucket(pd), pd))
                per_acct[r[id_k]][bucket(pd)] += r['openBalanceCents']; acct_locs[r[id_k]].add(r['locationName'])
                if scope == 'own':
                    c.ok('L-row-at-chosen-location (S5-R7)', r['workplaceId'] == OWN[key], (r['documentNumber'], r['locationName']))
        c.ok('D-totals = groups (S5-R18)', (det['totals']['amountCents'], det['totals']['openBalanceCents'], det['totals']['rowsNumber']) == (tot['a'], tot['o'], tot['n']), (det['totals'], dict(tot)))
        # Summary vs recompute from Detail rows
        srows = {r[id_k]: r for r in summ['collection']}
        c.ok('S-rows-complete', len(summ['collection']) == summ['rowsNumber'], (len(summ['collection']), summ['rowsNumber']))
        c.ok('S-no-account-twice', len(srows) == len(summ['collection']), len(summ['collection']) - len(srows))
        for aid, r in srows.items():
            exp = per_acct.get(aid, collections.Counter())
            for b, k in SUMK.items():
                c.ok('S-bucket = recomputed from documents (S5-R18a)', r[k] == exp[b], (r[name_k][:40], k, r[k], exp[b]))
            c.ok('S-row-total = its buckets', r['totalCents'] == sum(r[k] for k in SUMK.values()), (r[name_k][:40], r['totalCents']))
            locs = acct_locs.get(aid, set())
            if scope == 'all':
                c.ok('S-location = one name or "Multiple" (S6-R4)', r['locationName'] == (next(iter(locs)) if len(locs) == 1 else 'Multiple'), (r[name_k][:40], r['locationName'], sorted(locs)))
        missing = [a for a in per_acct if a not in srows]
        c.ok('S-every-account-with-open-documents-listed (S1-E1)', not missing, missing[:10])
        for k in SUMK.values():
            c.ok('S-Totals = rows (S5-R18)', summ['totals'][k] == sum(r[k] for r in summ['collection']), (k, summ['totals'][k], sum(r[k] for r in summ['collection'])))
            b = [x for x, y in SUMK.items() if y == k][0]
            c.ok('S-Totals = Detail open balance by bucket (S5-R18a)', summ['totals'][k] == next(g['openBalanceCents'] for g in det['groups'] if g['bucket'] == b), (k,))
        c.ok('S-Totals total = rows', summ['totals']['totalCents'] == sum(r['totalCents'] for r in summ['collection']), (summ['totals']['totalCents'], sum(r['totalCents'] for r in summ['collection'])))
        # Collection / Unpaid Invoices vs Detail
        gdocs = {}
        c.ok('G-groups-complete', len(grp['collection']) == grp['rowsNumber'], (len(grp['collection']), grp['rowsNumber']))
        for g in grp['collection']:
            c.ok('G-group-documents-all-delivered', len(g['rows']) == g['rowsNumber'], (g['name'][:40], len(g['rows']), g['rowsNumber']))
            c.ok('G-group-amount = rows', sum(r['amountCents'] for r in g['rows']) == g['amountCents'], (g['name'][:40],))
            c.ok('G-group-open = rows', sum(r['openBalanceCents'] for r in g['rows']) == g['openBalanceCents'], (g['name'][:40],))
            for r in g['rows']:
                c.ok('G-row-in-its-group', r[id_k] == g[id_k], r['documentNumber'])
                gdocs[r['documentId']] = r
        t = grp['totals']
        c.ok('G-Totals = groups (S5-R18)', (t['amountCents'], t['openBalanceCents'], t['documentCount']) == (sum(g['amountCents'] for g in grp['collection']), sum(g['openBalanceCents'] for g in grp['collection']), sum(g['rowsNumber'] for g in grp['collection'])), t)
        if side == 'ar':
            # past-due documents (82083852 v25 sec.6) PLUS credits dated on the as-of day: Chris Ward, SV-11441 comment 79846
            # (29 Oct 2026): "The Collections report stays as it is: SV-5606 shows today's credits there on purpose"
            expect = {i for i, r in docs.items() if r['bucket'] != 'current' or (r['transactionType'] in CREDIT and r['daysPastDue'] == 0)}
            rule = 'G-holds-exactly-the-past-due-documents + same-day credits (82083852 v25 sec.6; SV-11441 c79846)'
            c.ok('G-same-day credit listed with Past Due 0 (S1-R5a)', all(gdocs[i]['daysPastDue'] == 0 for i in gdocs if gdocs[i]['transactionType'] in CREDIT and day(gdocs[i]['date'], tz) == A), None)
        else:
            expect = set(docs); rule = 'G-holds-exactly-the-Detail-documents'
        c.ok(rule, set(gdocs) == expect, {'only_in_group': [gdocs[i]['documentNumber'] for i in list(set(gdocs) - expect)[:15]], 'missing_from_group': [docs[i]['documentNumber'] for i in list(expect - set(gdocs))[:15]], 'n_only': len(set(gdocs) - expect), 'n_missing': len(expect - set(gdocs))})
        for i in set(gdocs) & set(docs):
            a, b = gdocs[i], docs[i]
            same = all(a[k] == b[k] for k in ('date', 'amountCents', 'openBalanceCents', 'transactionType', 'locationName'))
            if side == 'ap' and a['transactionType'] == 'Vendor Credit':
                c.ok('G-vendor-credit has no Due Date and no Past Due (S2-R6)', a['dueDate'] is None and a['daysPastDue'] is None, (a['documentNumber'], a['dueDate'], a['daysPastDue']))
            else:
                same = same and a['daysPastDue'] == b['daysPastDue'] and a['dueDate'] == b['dueDate']
            c.ok('G-row = Detail row (date, due, past due, amounts, location)', same, (a['documentNumber'], {k: (a[k], b[k]) for k in ('dueDate', 'daysPastDue', 'openBalanceCents') if a[k] != b[k]}))
        # Location list (S5-R3)
        if scope == 'all':
            try:
                ll = json.load(open(d + f'{side}-aging-summary-locations.json'))
                names = {x['id'] for x in (ll.get('collection') if isinstance(ll, dict) else ll) or []}
                have = {r['workplaceId'] for r in docs.values() if r['workplaceId']}
                c.ok('L-location-list = locations with open documents (S5-R3)', names == have, {'list_only': sorted(names - have), 'docs_only': sorted(have - names)})
            except FileNotFoundError:
                pass
        nyd = [r for r in docs.values() if r['transactionType'] == 'Invoice' and r['daysPastDue'] is not None and r['daysPastDue'] < 0]
        same_day_credits = sorted(r['documentNumber'] for r in docs.values() if r['transactionType'] in CREDIT and day(r['date'], tz) == A)
        out[side] = {'counts': dict(c.n), 'failures': dict(c.f), 'documents': len(docs), 'accounts': len(srows),
                     'not_yet_due_invoices': len(nyd), 'not_yet_due_examples': sorted([(r['documentNumber'], r['dueDate'], r['daysPastDue']) for r in nyd], key=lambda x: -x[2])[:3],
                     'credits_dated_on_as_of': same_day_credits,
                     'detail_totals': det['totals'], 'summary_totals': summ['totals'], 'group_totals': grp['totals'],
                     'buckets': {g['bucket']: [g['rowsNumber'], g['openBalanceCents']] for g in det['groups']}}
    return out


def own_vs_all(key, asof):
    """S5-R7/S5-R8: the location-narrowed report = the All-locations documents at that location, summed again."""
    res = {}
    for side, id_k in (('ar', 'customerId'), ('ap', 'vendorId')):
        c = C(); a = json.load(open(f'/tmp/cln/arap/{key}/{asof}/all/{side}-aging-detail.json')); o = json.load(open(f'/tmp/cln/arap/{key}/{asof}/own/{side}-aging-detail.json'))
        A = {r['documentId']: r for rows in a['rows'].values() for r in rows if r['workplaceId'] == OWN[key]}
        O = {r['documentId']: r for rows in o['rows'].values() for r in rows}
        c.ok('L-narrowed = All-locations rows at that location (S5-R7)', set(A) == set(O), {'all_only': [A[i]['documentNumber'] for i in list(set(A) - set(O))[:10]], 'own_only': [O[i]['documentNumber'] for i in list(set(O) - set(A))[:10]]})
        for i in set(A) & set(O):
            c.ok('L-narrowed row identical', all(A[i][k] == O[i][k] for k in ('openBalanceCents', 'amountCents', 'daysPastDue', 'dueDate')), A[i]['documentNumber'])
        sa = json.load(open(f'/tmp/cln/arap/{key}/{asof}/own/{side}-aging-summary.json'))
        per = collections.Counter()
        for r in O.values():
            per[r[id_k]] += r['openBalanceCents']
        rows = {r[id_k]: r['totalCents'] for r in sa['collection']}
        c.ok('L-Summary lists exactly the accounts with documents there (S5-R8)', set(rows) == {k for k in per}, (len(rows), len(per)))
        for k, v in rows.items():
            c.ok('L-Summary row total = its documents there (S5-R8)', v == per[k], (k, v, per[k]))
        res[side] = {'counts': dict(c.n), 'failures': dict(c.f), 'own_documents': len(O), 'own_summary_rows': len(rows)}
    return res


if __name__ == '__main__':
    R = {'prd': 'Confluence 947650561 v13 (13 Nov 2026)', 'runs': {}, 'own_vs_all': {}}
    for key in ('HD', 'LE'):
        for p in sorted(glob.glob(f'/tmp/cln/arap/{key}/*/*/')):
            asof, scope = p.rstrip('/').split('/')[-2:]
            if not os.path.exists(p + 'ap-unpaid-invoices.json'):
                continue
            R['runs'][f'{key}/{asof}/{scope}'] = check(key, asof, scope)
        for asof in sorted({p.split('/')[-3] for p in glob.glob(f'/tmp/cln/arap/{key}/*/own/')}):
            if os.path.exists(f'/tmp/cln/arap/{key}/{asof}/own/ap-aging-detail.json'):
                R['own_vs_all'][f'{key}/{asof}'] = own_vs_all(key, asof)
    json.dump(R, open(os.path.join(EV, 'results-reports.json'), 'w'), indent=1, default=str)
    for k, v in list(R['runs'].items()) + list(R['own_vs_all'].items()):
        for side, x in v.items():
            p = sum(n for t, n in x['counts'].items() if t.endswith(':pass')); f = sum(n for t, n in x['counts'].items() if t.endswith(':fail'))
            print(k, side, 'pass', p, 'fail', f, {t[:-5]: n for t, n in x['counts'].items() if t.endswith(':fail')})
