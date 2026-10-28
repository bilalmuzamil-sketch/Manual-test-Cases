#!/usr/bin/env python3
"""W4 — A/R Aging checks (internal consistency + PRD aging rules + independent ledger recompute).

Expectations are taken from the PRD 'AR aging summary report, detail report and collections report'
(Confluence 82083852 v25, 2026-02-19) and story SV-5025 — quoted in RESULTS.md. The code is NOT used
as the expectation; it only told us which endpoints to read.

Usage: check_ar.py <snapshot dir under /tmp/cln/w4/ar> [--ledgers]
Writes results-ar-<snapshot>.json next to RESULTS.md and prints a bounded summary.
"""
import json, os, sys, collections, datetime as dt
from zoneinfo import ZoneInfo

BUCKETS = ['current', 'days1to30', 'days31to60', 'days61to90', 'days91Plus']
OUTDIR = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/reports/W4-finance-accounting-comms'
r2 = lambda x: round(x + 0.0, 2)


def bucket_for(days, credit):
    if days <= 0:
        return 'days1to30' if credit else 'current'   # PRD: credits never in Current
    if days <= 30: return 'days1to30'
    if days <= 60: return 'days31to60'
    if days <= 90: return 'days61to90'
    return 'days91Plus'


def local_date(s, tz):
    return dt.datetime.strptime(s[:19], '%Y-%m-%d %H:%M:%S').replace(tzinfo=dt.timezone.utc).astimezone(ZoneInfo(tz)).date()


def main(snap, ledgers=False):
    base = os.path.join('/tmp/cln/w4/ar', snap)
    S = json.load(open(base + '/summary.json')); D = json.load(open(base + '/detail.json')); C = json.load(open(base + '/collection.json'))
    tz = S['tz']; asof_utc = dt.datetime.strptime(S['asOf'], '%Y-%m-%dT%H:%M:%S.%fZ').replace(tzinfo=dt.timezone.utc)
    asof_local = asof_utc.astimezone(ZoneInfo(tz)).date()
    summ, det, coll = S['data'], D['data']['buckets'], C['data']
    rows = []
    def chk(cid, desc, ok, observed=None, expected=None, ref=None):
        rows.append({'check': cid, 'desc': desc, 'result': 'PASS' if ok else 'FAIL', 'observed': observed, 'expected': expected, 'ref': ref})

    # ---------- Summary ----------
    sr = summ['collection']
    for b in BUCKETS + ['total']:
        tot = r2(sum((r[b] or 0) for r in sr))
        chk('S1', f'Summary Totals row {b} = sum of customer rows', abs(tot - summ['totals'][b]) < 0.005, summ['totals'][b], tot, 'PRD §4 Totals Row')
    bad = [r for r in sr if abs(r2(sum((r[b] or 0) for r in [r] for b in BUCKETS)) - r['total']) >= 0.005]
    chk('S2', 'Every Summary row Total = Current+1–30+31–60+61–90+91+', not bad, len(bad), 0, 'PRD §3 Total Column')
    dup = [k for k, n in collections.Counter(r['customerId'] for r in sr).items() if n > 1]
    chk('S3', 'No customer repeated across the Summary rows', not dup, dup[:5], [], 'PRD §2 one row per customer')

    # ---------- Detail ----------
    allt = [(b, t) for b in BUCKETS for t in det[b]['transactions']]
    for b in BUCKETS:
        a = r2(sum(t['amount'] for t in det[b]['transactions'])); bl = r2(sum(t['balance'] for t in det[b]['transactions']))
        chk('D1', f'Detail section {b} total Amount = sum of rows', abs(a - det[b]['amount']) < 0.005, det[b]['amount'], a, 'PRD Detail §7 Per-Section Totals')
        chk('D2', f'Detail section {b} total Open Balance = sum of rows', abs(bl - det[b]['balance']) < 0.005, det[b]['balance'], bl, 'PRD Detail §7')
    ga = r2(sum(det[b]['amount'] for b in BUCKETS)); gb = r2(sum(det[b]['balance'] for b in BUCKETS))
    chk('D3', 'Detail grand total Amount = sum of section totals', abs(ga - det['totalAmount']) < 0.005, det['totalAmount'], ga, 'PRD Detail §7 Grand Totals')
    chk('D4', 'Detail grand total Open Balance = sum of section totals', abs(gb - det['totalBalance']) < 0.005, det['totalBalance'], gb, 'PRD Detail §7 Grand Totals')
    misb = []
    for b, t in allt:
        cr = t['type'] != 'invoice'
        days = (asof_local - local_date(t['dueDate'] if not cr else t['date'], tz)).days
        if bucket_for(days, cr) != b:
            misb.append({'no': t['transactionNumber'], 'type': t['type'], 'in': b, 'expected': bucket_for(days, cr), 'days': days})
    chk('D5', 'Every Detail row sits in the aging section its days-past-due (invoices) / days-aged (credits) give', not misb, len(misb), 0, 'PRD Detail §6 Aging Logic')
    cc = [t['transactionNumber'] for t in det['current']['transactions'] if t['type'] != 'invoice']
    chk('D6', 'No credit in the Current section', not cc, cc[:5], [], 'PRD Detail §6 "Credits must never appear in Current"')
    dd = [t['transactionNumber'] for b, t in allt if t['type'] != 'invoice' and t['dueDate'] != t['date']]
    chk('D7', 'Credit rows: Due Date = creation date', not dd, dd[:5], [], 'PRD Detail §5 Due Date')
    nolo = [t['transactionNumber'] for b, t in allt if not t.get('locationName')]
    chk('D8', 'Every Detail row names its location', not nolo, nolo[:5], [], 'PRD Detail §5 Location Name')
    badinv = [t['transactionNumber'] for b, t in allt if t['type'] == 'invoice' and not (0 < t['balance'] <= t['amount'] + 0.005)]
    chk('D9', 'Invoice rows: 0 < Open Balance <= Amount', not badinv, badinv[:5], [], 'PRD Detail §5 Open Balance')
    dupn = [k for k, n in collections.Counter((t['type'], t['transactionNumber']) for b, t in allt).items() if n > 1]
    chk('D10', 'No transaction listed twice in Detail', not dupn, dupn[:5], [], 'PRD Detail §3')

    # ---------- Summary vs Detail (per customer, per bucket) ----------
    names = collections.Counter(r['customerName'] for r in sr)
    perdet = collections.defaultdict(lambda: collections.defaultdict(float))
    for b, t in allt:
        perdet[t['customerName']][b] += t['balance']
    mism = []
    for r in sr:
        if names[r['customerName']] > 1:
            continue
        for b in BUCKETS:
            if abs((r[b] or 0) - r2(perdet[r['customerName']][b])) >= 0.005:
                mism.append({'customer': r['customerName'], 'bucket': b, 'summary': r[b], 'detail': r2(perdet[r['customerName']][b])})
    chk('X1', 'Summary row per bucket = sum of that customer\'s Detail Open Balances in that section', not mism, len(mism), 0, 'PRD Summary §3 / Detail §6 (same aging rules)')
    extra = sorted(set(perdet) - set(names))
    chk('X2', 'Every customer in Detail is on the Summary', not extra, extra[:5], [], 'PRD Summary §3 Customer column')
    for b in BUCKETS + ['total']:
        dv = r2(sum(det[x]['balance'] for x in BUCKETS)) if b == 'total' else det[b]['balance']
        chk('X3', f'Summary Totals {b} = Detail section Open Balance total', abs(dv - summ['totals'][b]) < 0.005, summ['totals'][b], dv, 'same population, same as-of date')

    # ---------- Collection ----------
    cr_ = coll['collection']
    badc = []
    for r in cr_:
        a = r2(sum(t['amount'] for t in r['transactions'])); bl = r2(sum(t['balance'] for t in r['transactions']))
        if abs(a - r['totalAmount']) >= 0.005 or abs(bl - r['totalBalance']) >= 0.005:
            badc.append(r['customerName'])
    chk('C1', 'Every Collection customer total = sum of its rows (Amount and Open Balance)', not badc, badc[:5], [], 'PRD Collections §7 Per-Customer Totals')
    ta = r2(sum(r['totalAmount'] for r in cr_)); tb = r2(sum(r['totalBalance'] for r in cr_))
    chk('C2', 'Collection Grand Total Amount = sum of customer totals', abs(ta - coll['totals']['totalAmount']) < 0.005, coll['totals']['totalAmount'], ta, 'PRD Collections §7 Grand Totals')
    chk('C3', 'Collection Grand Total Open Balance = sum of customer totals', abs(tb - coll['totals']['totalBalance']) < 0.005, coll['totals']['totalBalance'], tb, 'PRD Collections §7 Grand Totals')
    notpd = []; wrongpd = []
    for r in cr_:
        for t in r['transactions']:
            cr = t['type'] != 'invoice'
            days = (asof_local - local_date(t['date'] if cr else t['dueDate'], tz)).days
            if days <= 0:
                notpd.append({'no': t['transactionNumber'], 'type': t['type'], 'days': days, 'pastDue': t['pastDue']})
            if t['pastDue'] != days:
                wrongpd.append({'no': t['transactionNumber'], 'shown': t['pastDue'], 'expected': days})
    chk('C4', 'Collection lists only items with Past Due > 0 days', not notpd, len(notpd), 0, 'PRD Collections §6 "If the calculated days are ≤ 0 … not shown"')
    chk('C5', 'Collection Past Due days = as-of date − due date (invoices) / creation date (credits)', not wrongpd, len(wrongpd), 0, 'PRD Collections §6')
    detpd = {(t['type'], t['transactionNumber']): t for b, t in allt if b != 'current'}
    colset = {(t['type'], t['transactionNumber']): t for r in cr_ for t in r['transactions']}
    miss = sorted(set(detpd) - set(colset)); extra2 = sorted(set(colset) - set(detpd))
    chk('X4', 'Collection holds exactly the past-due Detail rows (no more, no fewer)', not miss and not extra2, {'missing': len(miss), 'extra': len(extra2), 'missing_sample': miss[:5], 'extra_sample': extra2[:5]}, 0, 'PRD Collections §4 + Detail §4')
    dupc = [k for k, n in collections.Counter(r['customerId'] for r in cr_).items() if n > 1]
    chk('C6', 'No customer repeated in Collection', not dupc, dupc[:5], [], 'PRD Collections §3')

    res = {'snapshot': snap, 'asOf_utc': S['asOf'], 'asOf_local': asof_local.isoformat(), 'tz': tz,
           'counts': {'summary_rows': len(sr), 'detail_rows': len(allt), 'collection_customers': len(cr_)},
           'checks': rows, 'misbucketed': misb[:50], 'summary_vs_detail': mism[:50], 'collection_not_past_due': notpd[:50],
           'collection_pastdue_wrong': wrongpd[:50]}

    if ledgers:
        res['ledger'] = ledger_checks(sr, allt, asof_local, tz, chk)
    json.dump(res, open(os.path.join(OUTDIR, f'results-ar-{snap}.json'), 'w'), indent=1)
    p = collections.Counter(r['result'] for r in rows)
    print(snap, dict(p))
    for r in rows:
        if r['result'] == 'FAIL':
            print('  FAIL', r['check'], r['desc'], '| observed', json.dumps(r['observed'])[:200], '| expected', r['expected'])
    return res


def ledger_checks(sr, allt, asof_local, tz, chk):
    """As of TODAY only: recompute each customer's open items from the customer's own account ledger
    (customer-account/list-unpaid-transaction = stored balances) and deposits list."""
    L = '/tmp/cln/w4/ar/ledgers'
    by_name = collections.defaultdict(list)
    for b, t in allt:
        by_name[t['customerName']].append((b, t))
    out = {'customers': 0, 'diff_customers': [], 'missing_in_report': [], 'extra_in_report': [], 'amount_vs_full': []}
    for r in sr:
        fn = os.path.join(L, r['customerId'] + '.json')
        if not os.path.exists(fn):
            continue
        g = json.load(open(fn)); out['customers'] += 1
        led = {}
        for x in g.get('open_rows', []):
            num = x.get('formatted_invoice_number') if x['type'] == 'invoice' else (x.get('credit_display_number') or x.get('raw_number') or x.get('invoice_display_number'))
            led[(x['type'], num)] = x
        rep = {(t['type'], t['transactionNumber']): t for b, t in by_name[r['customerName']]}
        rep_inv = {k: v for k, v in rep.items() if k[0] == 'invoice'}
        led_inv = {k: v for k, v in led.items() if k[0] == 'invoice' and abs(v['balance']) > 0.004}
        for k in set(led_inv) - set(rep_inv):
            out['missing_in_report'].append({'customer': r['customerName'], 'no': k[1], 'ledger_balance': led_inv[k]['balance']})
        for k in set(rep_inv) - set(led_inv):
            out['extra_in_report'].append({'customer': r['customerName'], 'no': k[1], 'report_balance': rep_inv[k]['balance']})
        for k in set(rep_inv) & set(led_inv):
            if abs(rep_inv[k]['balance'] - led_inv[k]['balance']) >= 0.005:
                out['diff_customers'].append({'customer': r['customerName'], 'no': k[1], 'report': rep_inv[k]['balance'], 'ledger': led_inv[k]['balance']})
        g['_types'] = sorted({x['type'] for x in g.get('open_rows', [])})
    for k in ('missing_in_report', 'extra_in_report', 'diff_customers'):
        out[k + '_n'] = len(out[k])
    chk('L1', 'Every open invoice on a customer\'s own account (stored balance) appears in A/R Detail', not out['missing_in_report'], out['missing_in_report_n'], 0, 'PRD Detail §4 Transaction Types Included')
    chk('L2', 'Every invoice in A/R Detail is open on the customer\'s own account', not out['extra_in_report'], out['extra_in_report_n'], 0, 'PRD Detail §4')
    chk('L3', 'Open Balance in A/R Detail = the invoice\'s balance on the customer account', not out['diff_customers'], out['diff_customers_n'], 0, 'PRD Detail §5 Open Balance')
    return out


if __name__ == '__main__':
    main(sys.argv[1], '--ledgers' in sys.argv)
