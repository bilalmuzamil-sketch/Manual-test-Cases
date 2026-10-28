#!/usr/bin/env python3
"""W4 — A/P Aging checks (internal consistency + PRD aging rules + independent vendor-ledger recompute).

Expectation source: Confluence 'AP reports' page 265093124 v13 (2026-03-18), stories SV-5653 / SV-5654.
Usage: check_ap.py <snapshot under /tmp/cln/w4/ap> [--ledgers]
"""
import json, os, sys, collections, datetime as dt
from zoneinfo import ZoneInfo

BUCKETS = ['current', 'days1to30', 'days31to60', 'days61to90', 'days91Plus']
OUTDIR = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/reports/W4-finance-accounting-comms'
r2 = lambda x: round(x + 0.0, 2)


def bucket_for(days, credit):
    if days <= 0:
        return 'days1to30' if credit else 'current'
    if days <= 30: return 'days1to30'
    if days <= 60: return 'days31to60'
    if days <= 90: return 'days61to90'
    return 'days91Plus'


def ld(s, tz):
    return dt.datetime.strptime(s[:19], '%Y-%m-%d %H:%M:%S').replace(tzinfo=dt.timezone.utc).astimezone(ZoneInfo(tz)).date()


def main(snap, ledgers=False):
    base = os.path.join('/tmp/cln/w4/ap', snap)
    S = json.load(open(base + '/summary.json')); D = json.load(open(base + '/detail.json')); U = json.load(open(base + '/collection.json'))
    tz = S['tz']
    asof_local = dt.datetime.strptime(S['asOf'], '%Y-%m-%dT%H:%M:%S.%fZ').replace(tzinfo=dt.timezone.utc).astimezone(ZoneInfo(tz)).date()
    summ, det, un = S['data'], D['data']['buckets'], U['data']
    rows = []
    def chk(cid, desc, ok, observed=None, expected=None, ref=None):
        rows.append({'check': cid, 'desc': desc, 'result': 'PASS' if ok else 'FAIL', 'observed': observed, 'expected': expected, 'ref': ref})

    sr = summ['collection']
    for b in BUCKETS + ['total']:
        t = r2(sum((r[b] or 0) for r in sr))
        chk('PS1', f'A/P Summary Totals row {b} = sum of vendor rows', abs(t - summ['totals'][b]) < 0.005, summ['totals'][b], t, 'AP PRD Summary "Totals Row"')
    bad = [r['vendorName'] for r in sr if abs(r2(sum((r[b] or 0) for b in BUCKETS)) - r['total']) >= 0.005]
    chk('PS2', 'Every A/P Summary row Total = sum of its buckets', not bad, bad[:5], [], 'AP PRD Summary "Total column is the sum of all aging buckets"')
    dup = [k for k, n in collections.Counter(r['vendorId'] for r in sr).items() if n > 1]
    chk('PS3', 'No vendor repeated on A/P Summary', not dup, dup[:5], [], 'AP PRD Summary "Each row represents a vendor"')
    zero_names = [r['vendorName'] for r in sr if all(not r[b] for b in BUCKETS)]

    allt = [(b, t) for b in BUCKETS for t in det[b]['transactions']]
    for b in BUCKETS:
        a = r2(sum(t['amount'] for t in det[b]['transactions'])); o = r2(sum(t['openBalance'] for t in det[b]['transactions']))
        chk('PD1', f'A/P Detail section {b} Amount total = sum of rows', abs(a - det[b]['amount']) < 0.005, det[b]['amount'], a, 'AP PRD Detail §7 Per-Section Totals')
        chk('PD2', f'A/P Detail section {b} Open Balance total = sum of rows', abs(o - det[b]['openBalance']) < 0.005, det[b]['openBalance'], o, 'AP PRD Detail §7')
    chk('PD3', 'A/P Detail grand Amount = sum of sections', abs(r2(sum(det[b]['amount'] for b in BUCKETS)) - det['totalAmount']) < 0.005, det['totalAmount'], r2(sum(det[b]['amount'] for b in BUCKETS)), 'AP PRD Detail §7 Grand Totals')
    chk('PD4', 'A/P Detail grand Open Balance = sum of sections', abs(r2(sum(det[b]['openBalance'] for b in BUCKETS)) - det['totalOpenBalance']) < 0.005, det['totalOpenBalance'], r2(sum(det[b]['openBalance'] for b in BUCKETS)), 'AP PRD Detail §7')
    misb, wrongpd = [], []
    for b, t in allt:
        cr = t['type'] != 'invoice'
        days = (asof_local - ld(t['date'] if cr else t['dueDate'], tz)).days
        if bucket_for(days, cr) != b:
            misb.append({'no': t['transactionNumber'], 'type': t['type'], 'in': b, 'expected': bucket_for(days, cr), 'days': days})
        if t['daysPastDue'] != days:
            wrongpd.append({'no': t['transactionNumber'], 'type': t['type'], 'shown': t['daysPastDue'], 'expected': days, 'bucket': b})
    chk('PD5', 'Every A/P Detail row sits in the section its days give', not misb, len(misb), 0, 'AP PRD Detail §6')
    neg_hidden = [w for w in wrongpd if w['expected'] < 0]
    other_pd = [w for w in wrongpd if w['expected'] >= 0]
    chk('PD6a', 'A/P Detail Past Due = Selected Date − Due Date for not-yet-due bills (negative number)', not neg_hidden, len(neg_hidden), 0, 'AP PRD Detail §5 Past Due + §6 "Days past due = Selected Date – Invoice Due Date"')
    chk('PD6b', 'A/P Detail Past Due = Selected Date − Due Date (bills due today or earlier) / − creation date (credits)', not other_pd, len(other_pd), 0, 'AP PRD Detail §6')
    cc = [t['transactionNumber'] for t in det['current']['transactions'] if t['type'] != 'invoice']
    chk('PD7', 'No vendor credit in A/P Detail Current', not cc, cc[:5], [], 'AP PRD Detail §6 "Vendor credits must never appear in Current"')
    dd = [t['transactionNumber'] for b, t in allt if t['type'] != 'invoice' and t['dueDate'] != t['date']]
    chk('PD8', 'A/P Detail credit rows: Due Date = creation date', not dd, dd[:5], [], 'AP PRD Detail §5 Due Date')
    badinv = [(t['transactionNumber'], t['amount'], t['openBalance']) for b, t in allt if t['type'] == 'invoice' and not (0 < t['openBalance'] <= t['amount'] + 0.005)]
    chk('PD9', 'A/P Detail bill rows: 0 < Open Balance <= Amount', not badinv, {'n': len(badinv), 'sample': badinv[:8]}, 0, 'AP PRD Detail §5 Open Balance "Remaining unpaid"')
    nolo = [t['transactionNumber'] for b, t in allt if not t.get('locationName')]
    chk('PD10', 'Every A/P Detail row names its location', not nolo, nolo[:5], [], 'AP PRD Detail §5 Location Name')
    dupn = [k for k, n in collections.Counter(t['id'] for b, t in allt).items() if n > 1]
    chk('PD11', 'No A/P Detail row listed twice', not dupn, dupn[:5], [], 'AP PRD Detail §3')

    dnames = {t['vendorName'] for b, t in allt}
    zero = [n for n in zero_names if n not in dnames]
    chk('PS4', 'Every A/P Summary vendor has at least one open document in A/P Detail (a $0 row = items that net to zero)', not zero, {'zero_rows': len(zero_names), 'without_open_docs': zero}, 0, 'AP PRD Summary "Only vendors with at least one open transaction should appear"')
    per = collections.defaultdict(lambda: collections.defaultdict(float))
    for b, t in allt:
        per[t['vendorName']][b] += t['openBalance']
    names = collections.Counter(r['vendorName'] for r in sr)
    mism = [{'vendor': r['vendorName'], 'bucket': b, 'summary': r[b], 'detail': r2(per[r['vendorName']][b])}
            for r in sr if names[r['vendorName']] == 1 for b in BUCKETS if abs((r[b] or 0) - r2(per[r['vendorName']][b])) >= 0.005]
    chk('PX1', 'A/P Summary per bucket = that vendor\'s A/P Detail Open Balances in the section', not mism, len(mism), 0, 'AP PRD Summary/Detail same aging rules')
    for b in BUCKETS:
        chk('PX2', f'A/P Summary Totals {b} = A/P Detail section total', abs(summ['totals'][b] - det[b]['openBalance']) < 0.005, summ['totals'][b], det[b]['openBalance'], 'same population')

    ur = un['collection']
    badv = [r['vendorName'] for r in ur if abs(r2(sum(t['amount'] for t in r['transactions'])) - r['totalAmount']) >= 0.005 or abs(r2(sum(t['openBalance'] for t in r['transactions'])) - r['totalOpenBalance']) >= 0.005]
    chk('PU1', 'A/P Unpaid Invoices per-vendor totals = sum of rows', not badv, badv[:5], [], 'AP PRD Unpaid §7 Per-Vendor Totals')
    chk('PU2', 'A/P Unpaid Invoices Grand Total Amount = sum of vendors', abs(r2(sum(r['totalAmount'] for r in ur)) - un['totals']['totalAmount']) < 0.005, un['totals']['totalAmount'], r2(sum(r['totalAmount'] for r in ur)), 'AP PRD Unpaid §7 Grand Totals')
    chk('PU3', 'A/P Unpaid Invoices Grand Total Open Balance = sum of vendors', abs(r2(sum(r['totalOpenBalance'] for r in ur)) - un['totals']['totalOpenBalance']) < 0.005, un['totals']['totalOpenBalance'], r2(sum(r['totalOpenBalance'] for r in ur)), 'AP PRD Unpaid §7')
    upd = []; cred_blank = []
    for r in ur:
        for t in r['transactions']:
            if t['transactionType'] == 'Invoice':
                days = (asof_local - ld(t['dueDate'], tz)).days
                if t['pastDue'] != days:
                    upd.append({'no': t['transactionNumber'], 'shown': t['pastDue'], 'expected': days})
            else:
                if t['dueDate'] is not None or t['pastDue'] is not None:
                    cred_blank.append(t['transactionNumber'])
    chk('PU4', 'A/P Unpaid Invoices Past Due = Selected Date − Due Date, negative values shown for bills not yet due', not upd, {'n': len(upd), 'sample': upd[:6]}, 0, 'AP PRD Unpaid §6 "both invoices past due with negative or positive value will be shown"')
    chk('PU5', 'A/P Unpaid Invoices credit rows leave Due Date and Past Due empty', not cred_blank, cred_blank[:5], [], 'AP PRD Unpaid §5')
    uset = {t['id'] for r in ur for t in r['transactions']}; dset = {t['id'] for b, t in allt}
    chk('PX3', 'A/P Unpaid Invoices holds exactly the same documents as A/P Detail', uset == dset, {'only_unpaid': len(uset - dset), 'only_detail': len(dset - uset)}, 0, 'both list every open bill and unapplied credit as of the date')
    chk('PX4', 'A/P Unpaid Invoices Grand Open Balance = A/P Detail grand Open Balance', abs(un['totals']['totalOpenBalance'] - det['totalOpenBalance']) < 0.005, un['totals']['totalOpenBalance'], det['totalOpenBalance'], 'same population')
    vs = {r['vendorId'] for r in sr}; vu = {r['vendorId'] for r in ur}
    chk('PX5', 'Same vendors on A/P Summary and A/P Unpaid Invoices', vs == vu, {'only_summary': len(vs - vu), 'only_unpaid': len(vu - vs)}, 0, 'both: vendors with at least one open transaction')
    res = {'snapshot': snap, 'asOf_local': asof_local.isoformat(), 'tz': tz,
           'counts': {'summary_vendors': len(sr), 'detail_rows': len(allt), 'unpaid_vendors': len(ur)}, 'checks': rows,
           'misbucketed': misb[:50], 'detail_pastdue_wrong_sample': wrongpd[:30], 'detail_pastdue_wrong_nonneg': other_pd[:30], 'detail_pastdue_wrong_n': len(wrongpd),
           'unpaid_pastdue_wrong_sample': upd[:30], 'summary_vs_detail': mism[:30], 'bad_invoice_balance': badinv[:50]}
    if ledgers:
        res['ledger'] = ledger_checks(sr, allt, chk)
    json.dump(res, open(os.path.join(OUTDIR, f'results-ap-{snap}.json'), 'w'), indent=1)
    p = collections.Counter(r['result'] for r in rows)
    print(snap, dict(p))
    for r in rows:
        if r['result'] == 'FAIL':
            print('  FAIL', r['check'], r['desc'], '| obs', json.dumps(r['observed'])[:300], '| exp', r['expected'])


def ledger_checks(sr, allt, chk):
    L = '/tmp/cln/w4/ap/ledgers'
    byv = collections.defaultdict(dict)
    for b, t in allt:
        byv[t['vendorName']][(t['type'], t['transactionNumber'], t['date'][:10])] = t
    out = {'vendors': 0, 'missing': [], 'extra': [], 'diff': [], 'types_seen': set()}
    for r in sr:
        fn = os.path.join(L, r['vendorId'] + '.json')
        if not os.path.exists(fn):
            continue
        g = json.load(open(fn)); out['vendors'] += 1
        led = {}
        for x in g.get('open_rows', []):
            out['types_seen'].add(x.get('type'))
            if x.get('type_label') != 'Invoice' or abs(x.get('balance') or 0) < 0.005:
                continue
            led[(x.get('invoice_number') or x.get('formatted_invoice_number'), str(x.get('date'))[:10])] = x
        rep = {(k[1], k[2]): v for k, v in byv[r['vendorName']].items() if k[0] == 'invoice'}
        for k in set(led) - set(rep):
            out['missing'].append({'vendor': r['vendorName'], 'no': k[0], 'date': k[1], 'ledger_balance': led[k]['balance']})
        for k in set(rep) - set(led):
            out['extra'].append({'vendor': r['vendorName'], 'no': k[0], 'date': k[1], 'report_open': rep[k]['openBalance']})
        for k in set(rep) & set(led):
            if abs(rep[k]['openBalance'] - led[k]['balance']) >= 0.005:
                out['diff'].append({'vendor': r['vendorName'], 'no': k[0], 'report': rep[k]['openBalance'], 'ledger': led[k]['balance']})
    out['types_seen'] = sorted(map(str, out['types_seen']))
    for k in ('missing', 'extra', 'diff'):
        out[k + '_n'] = len(out[k]); out[k] = out[k][:40]
    chk('PL1', 'Every bill open on the vendor\'s own account appears in A/P Detail', not out['missing_n'], out['missing_n'], 0, 'AP PRD Detail §4')
    chk('PL2', 'Every bill in A/P Detail is open on the vendor\'s own account', not out['extra_n'], out['extra_n'], 0, 'AP PRD Detail §4')
    chk('PL3', 'A/P Detail Open Balance = the bill\'s balance on the vendor account', not out['diff_n'], out['diff_n'], 0, 'AP PRD Detail §5')
    return out


if __name__ == '__main__':
    main(sys.argv[1], '--ledgers' in sys.argv)
