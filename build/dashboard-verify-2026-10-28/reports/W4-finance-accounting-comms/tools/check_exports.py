#!/usr/bin/env python3
"""W4 — Export Reports: every CSV export's money / quantity columns against independent records.

Exports were fetched as the screen does (GET /api/reporting/export/<report>?range=...), saved under
/tmp/cln/w4/exp/<tag>__<report>.json. Independent records:
  * invoice records   /tmp/cln/dv/inv/*.json         (GET /api/invoices/{id}/view)
  * customer payments /tmp/cln/w4/pay/*.json         (GET /api/customer-payment/list per account)
  * A/P Detail rows   /tmp/cln/w4/ap/hd_2026-10-29   (open bills, other report family)
No written spec exists for the export file layouts (searches recorded in RESULTS.md) — so these are
record-agreement and internal-consistency checks; layout questions go to the PO.
Usage: check_exports.py <tag> <window-start YYYY-MM-DD> <window-end YYYY-MM-DD> <tz>
"""
import json, csv, io, sys, glob, collections, datetime as dt
from zoneinfo import ZoneInfo
OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/reports/W4-finance-accounting-comms'
num = lambda s: float(str(s).replace(',', '').replace('$', '')) if s not in (None, '') else 0.0
rows_out = []
def chk(cid, rep, desc, ok, observed=None, expected=None, ref=None):
    rows_out.append({'check': cid, 'export': rep, 'desc': desc, 'result': 'PASS' if ok else 'FAIL', 'observed': observed, 'expected': expected, 'ref': ref})


def load(tag, rep):
    j = json.load(open(f'/tmp/cln/w4/exp/{tag}__{rep}.json'))
    d = j['body'].get('data') if isinstance(j['body'], dict) else None
    txt = d[0] if isinstance(d, list) and d else ''
    return list(csv.DictReader(io.StringIO(txt))), j['status']


def mdY(s):
    return dt.datetime.strptime(s[:10], '%m-%d-%Y').date()


def main(tag, w0, w1, tz):
    w0 = dt.date.fromisoformat(w0); w1 = dt.date.fromisoformat(w1); Z = ZoneInfo(tz)
    LTZ = {'b3c8c820-f815-4cf1-8938-10956c5ee71a': 'Asia/Karachi', 'f8a8b802-7780-4b16-bf10-343caeb616b2': 'America/Edmonton',
           '25a0d576-b371-4b82-bef4-41ba977f31c2': 'America/Vancouver', '39522bc6-abca-4f67-bd12-2840043c2d68': 'America/Toronto'}
    loc = lambda iso, wz=None: dt.datetime.fromisoformat(iso.replace('Z', '+00:00')).astimezone(ZoneInfo(wz) if wz else Z).date()
    idx = {}
    for f in glob.glob('/tmp/cln/dv/inv/*.json'):
        try:
            c = json.load(open(f))['body']['data']['collection']
        except Exception:
            continue
        idx[c.get('display_number')] = c
    # ---------------- customer invoice ----------------
    rows, st = load(tag, 'customer_invoice')
    by = collections.defaultdict(list)
    for r in rows:
        by[r['InvoiceNo']].append(r)
    tot_bad, line_bad, date_bad, due_bad, term_bad, cust_bad, nocache = [], [], [], [], [], [], 0
    for no, rs in by.items():
        for r in rs:
            if abs(num(r['ItemQuantity']) * num(r['ItemRate']) - num(r['ItemAmount'])) >= 0.015:
                line_bad.append((no, r['ItemQuantity'], r['ItemRate'], r['ItemAmount']))
        d = mdY(rs[0]['InvoiceDate'])
        if not (w0 <= d <= w1):
            date_bad.append((no, rs[0]['InvoiceDate']))
        c = idx.get(no)
        if not c:
            nocache += 1; continue
        a = sum(num(r['ItemAmount']) for r in rs) + sum(num(r['ItemTaxAmount']) for r in rs)
        if abs(a - num(c['total_balance'])) >= 0.015:
            tot_bad.append((no, round(a, 2), c['total_balance']))
        wz = LTZ.get((c.get('work_order') or {}).get('workplace_id'))
        if loc(c['created_on'], wz) != d:
            date_bad.append((no, rs[0]['InvoiceDate'], 'record', str(loc(c['created_on'], wz))))
        if c.get('due_date') and loc(c['due_date'], wz) != mdY(rs[0]['DueDate']):
            due_bad.append((no, rs[0]['DueDate'], str(loc(c['due_date'], wz))))
        if (c.get('credit_terms') or '') != (rs[0]['Terms'] or ''):
            term_bad.append((no, rs[0]['Terms'], c.get('credit_terms')))
        if (c.get('customer') or {}).get('company_name') != rs[0]['Customer']:
            cust_bad.append((no, rs[0]['Customer'], (c.get('customer') or {}).get('company_name')))
    chk('X-INV1', 'Customer Invoice', 'Invoice lines + tax add up to the invoice total', not tot_bad, {'invoices': len(by), 'bad': tot_bad[:5]}, 0, 'invoice record total_balance')
    chk('X-INV2', 'Customer Invoice', 'ItemQuantity × ItemRate = ItemAmount on every line', not line_bad, {'lines': len(rows), 'bad': len(line_bad), 'sample': line_bad[:5]}, 0, 'internal')
    chk('X-INV3', 'Customer Invoice', 'InvoiceDate inside the chosen window and = the invoice date', not date_bad, date_bad[:5], 0, 'window + invoice record')
    chk('X-INV4', 'Customer Invoice', 'DueDate = the invoice due date', not due_bad, due_bad[:5], 0, 'invoice record')
    chk('X-INV5', 'Customer Invoice', 'Terms = the invoice credit terms', not term_bad, term_bad[:5], 0, 'invoice record')
    chk('X-INV6', 'Customer Invoice', 'Customer = the invoice customer', not cust_bad, cust_bad[:5], 0, 'invoice record')
    inwin = {k for k, c in idx.items() if c.get('created_on') and w0 <= loc(c['created_on']) <= w1}
    missing = sorted(inwin - set(by))
    chk('X-INV7', 'Customer Invoice', 'Every cached invoice dated in the window is in the export', not missing, {'cache_in_window': len(inwin), 'missing': len(missing), 'sample': missing[:8], 'not_in_cache': nocache}, 0, 'invoice records')
    # ---------------- customer payment ----------------
    rows, st = load(tag, 'customer_payment')
    pays = collections.defaultdict(float)
    for f in glob.glob('/tmp/cln/w4/pay/*.json'):
        for p in json.load(open(f)).get('payments', []):
            if p.get('payment_status') == 'reversed':
                continue
            for s in p.get('payment_statements') or []:
                for nn in {s.get('invoice_display_number'), s.get('invoice_number')} - {None}:
                    pays[(nn, p['payment_date'][:10])] += s['amount']
    pb, pdate = [], []
    for r in rows:
        k = (r['Invoice No'], mdY(r['Payment Date']).isoformat())
        if not (w0 <= mdY(r['Payment Date']) <= w1):
            pdate.append(r['Payment Date'])
        got = [v for (n, d), v in pays.items() if n == r['Invoice No']]
        if not got:
            pb.append((r['Invoice No'], r['Payment Date'], r['Amount'], 'no payment found'))
        elif not any(abs(v - num(r['Amount'])) < 0.015 for v in got):
            pb.append((r['Invoice No'], r['Payment Date'], r['Amount'], [round(v, 2) for v in got][:4]))
    chk('X-PAY1', 'Customer Payment', 'Each payment row Amount = what that payment put on that invoice (customer Payments list)', not pb, {'rows': len(rows), 'bad': len(pb), 'sample': pb[:6]}, 0, 'customer-payment/list')
    chk('X-PAY2', 'Customer Payment', 'Payment Date inside the chosen window', not pdate, pdate[:5], 0, 'window')
    # ---------------- journal entry ----------------
    rows, st = load(tag, 'journal_entry')
    je = collections.defaultdict(float)
    for r in rows:
        je[r['Journal No']] += num(r['Amount'])
    unb = [(k, round(v, 2)) for k, v in je.items() if abs(v) >= 0.005]
    chk('X-JE1', 'Journal Entry', 'Every journal entry balances (its amounts add to zero)', not unb, {'entries': len(je), 'unbalanced': len(unb), 'sample': unb[:6]}, 0, 'double-entry bookkeeping')
    jd = [r['Journal Date'] for r in rows if not (w0 <= mdY(r['Journal Date']) <= w1)]
    chk('X-JE2', 'Journal Entry', 'Journal Date inside the chosen window', not jd, jd[:5], 0, 'window')
    # ---------------- payroll timesheet ----------------
    rows, st = load(tag, 'payroll_timesheet')
    emp, over, sums = None, [], []
    for r in rows:
        if r['Employee Name']:
            emp = r['Employee Name']; continue
        if not r['Date']:
            continue
        t, w, i = num(r['Total Hours']), num(r['WO Hours']), num(r['Internal Hours'])
        if abs(t - (w + i)) >= 0.011:
            sums.append((emp, r['Date'], t, w, i))
        if t > 24:
            over.append((emp, r['Date'], t))
    chk('X-PR1', 'Payroll Timesheet', 'Total Hours = WO Hours + Internal Hours on every day', not sums, sums[:5], 0, 'internal')
    chk('X-PR2', 'Payroll Timesheet', 'No employee day exceeds 24 hours', not over, {'days_over_24': len(over), 'sample': over[:8]}, 0, 'a day has 24 hours')
    # ---------------- vendor bill ----------------
    rows, st = load(tag, 'vendor_bill')
    vb = collections.defaultdict(float)
    for r in rows:
        vb[(r['*BillNo'], r['*Supplier'])] += num(r['*LineAmount']) + num(r['LineTaxAmount'])
    D = json.load(open('/tmp/cln/w4/ap/hd_2026-10-29/detail.json'))['data']['buckets']
    apa = {(t['transactionNumber'], t['vendorName']): t['amount'] for b in D if isinstance(D[b], dict) for t in D[b]['transactions'] if t['type'] == 'invoice'}
    both = [k for k in vb if k in apa]
    vbad = [(k, round(vb[k], 2), apa[k]) for k in both if abs(vb[k] - apa[k]) >= 0.015]
    chk('X-VB1', 'Vendor Bill', 'Bill lines + tax = the bill amount A/P Detail shows (bills still open)', not vbad, {'bills': len(vb), 'compared': len(both), 'bad': len(vbad), 'sample': vbad[:6]}, 0, 'A/P Detail Amount')
    bd = [r['*BillDate'] for r in rows if not (w0 <= mdY(r['*BillDate']) <= w1)]
    chk('X-VB2', 'Vendor Bill', 'BillDate inside the chosen window', not bd, {'outside': len(bd), 'sample': bd[:5]}, 0, 'window')
    # ---------------- vendor bill payment / credit memos ----------------
    rows, st = load(tag, 'vendor_bill_payment')
    vp = [r for r in rows if r.get('Payment Date') and not (w0 <= mdY(r['Payment Date']) <= w1)]
    chk('X-VP1', 'Vendor Bill Payment', 'Payment Date inside the chosen window', not vp, len(vp), 0, 'window')
    neg = [(r['Bill No'], r['Amount']) for r in rows if r.get('Amount') and num(r['Amount']) < 0 and not r['Bill No'].startswith('C-')]
    chk('X-VP2', 'Vendor Bill Payment', 'Negative amounts appear only on vendor-credit lines (Bill No C-...) applied in the payment', not neg, neg[:5], 0, 'internal')
    rows, st = load(tag, 'customer_credit_memo')
    cmd = [r['Adjustment Note Date'] for r in rows if r.get('Adjustment Note Date') and not (w0 <= dt.date.fromisoformat(r['Adjustment Note Date'][:10]) <= w1)]
    chk('X-CM1', 'Customer Credit Memo', 'Adjustment Note Date inside the chosen window', not cmd, cmd[:5], 0, 'window')
    json.dump({'tag': tag, 'window': [str(w0), str(w1)], 'tz': tz, 'checks': rows_out}, open(f'{OUT}/results-exports-{tag}.json', 'w'), indent=1)
    print(collections.Counter(r['result'] for r in rows_out))
    for r in rows_out:
        print(r['result'], r['check'], r['desc'], '|', json.dumps(r['observed'])[:300])


if __name__ == '__main__':
    main(*sys.argv[1:5])
