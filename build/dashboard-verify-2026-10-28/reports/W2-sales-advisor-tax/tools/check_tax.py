#!/usr/bin/env python3
"""Sales Tax Collected — Invoices tab + All tax rates tab, every range x Invoice Status option x location,
against the invoice records (amounts, tax rates) and the customer payment records (paid date).
Sources: CS training page 215941122 (Paid / Partially Paid, full tax per invoice, totals for all invoices),
draft PRD 50200592 v12, SV-4573, SV-4233 (Fabian: filter by PAID date). Output ../results-tax.json. SECRET-FREE."""
import json, os, sys, collections, datetime as dt
from zoneinfo import ZoneInfo
sys.path.insert(0, os.path.dirname(__file__))
from common import *
from records import invoice, prefetch, money, account_payments
OUTF = os.path.join(os.path.dirname(__file__), '..', 'results-tax.json')
rows = []
def add(loc, rng, check, ok, detail, src, level='row', key=''):
    rows.append({'report': 'Sales Tax Collected', 'location': loc, 'range': rng, 'level': level, 'key': key, 'check': check,
                 'result': ok if isinstance(ok, str) else ('PASS' if ok else 'FAIL'), 'detail': detail, 'source': src})
near = lambda a, b, tol=0.011: abs((a or 0) - (b or 0)) <= tol
for wid, name, tz in WORKPLACES:
    d = os.path.join(RAW, wid)
    if not os.path.exists(os.path.join(d, 'tax__this_month__default.json')) or not os.path.exists(os.path.join(d, 'sbc_tree__last_year.json')): continue
    z = ZoneInfo(tz)
    # every non-void invoice of the location over two years (from the Sales By Customer drill-down)
    ids = {}
    for lab in ('last_12_months', 'last_year'):
        for c in json.load(open(os.path.join(d, f'sbc_tree__{lab}.json')))['tree']:
            for a in c['assets']:
                for i in a['invoices'] or []: ids[i['invoice_id']] = i['invoice_number']
    invs = dict(zip(ids, prefetch([(i, wid) for i in ids], invoice)))
    accs = sorted({v['customer_transaction']['customer_account_id'] for v in invs.values() if v and v.get('payment_status') in ('paid', 'partially_paid', 'overpaid', 'prepaid') and v.get('customer_transaction')})
    pays = dict(zip(accs, prefetch([(a, wid) for a in accs], account_payments)))
    last = {}
    for a, plist in pays.items():
        for p in plist or []:
            for s in p.get('payment_statements') or []:
                if s.get('type') == 'invoice':
                    k = s['invoice_display_number']
                    last[k] = max(last.get(k, ''), p['payment_date'])
    bynum = {v['display_number']: v for v in invs.values() if v}
    for lab in ranges(dt.date(2026, 10, 28)):
        for st in ('default', 'paid', 'partially_paid'):
            p = os.path.join(d, f'tax__{lab}__{st}.json')
            if not os.path.exists(p): continue
            S = json.load(open(p)); f, t = S['from'], S['to']
            if S['status'] != 200: add(name, lab, f'Report loads ({st})', False, str(S['data'])[:200], '', 'range'); continue
            col = S['data']['collection']; tot = S['data']['totals']
            want = {'default': {'paid', 'partially_paid'}, 'paid': {'paid'}, 'partially_paid': {'partially_paid'}}[st]
            exp = set()
            for num, v in bynum.items():
                if v.get('payment_status') not in want or num not in last: continue
                ld = dt.datetime.fromisoformat(last[num]).replace(tzinfo=dt.timezone.utc).astimezone(z).date().isoformat()
                if f <= ld <= t: exp.add(num)
            got = {r['invoiceNumber'] for r in col}
            add(name, lab, f'Invoices listed = Paid / Partially Paid invoices whose latest payment falls in the dates (status filter {st})', got == exp,
                f'{f}..{t} report {len(got)} vs records {len(exp)}; missing {sorted(exp-got)[:6]} extra {sorted(got-exp)[:6]}', 'CS 215941122 §4-5, SV-4233 (paid date), SV-4573', 'range')
            add(name, lab, f'Footer Total = sum of Invoice Total over all listed invoices (status filter {st})', near(tot['totalSubTotalWithTax'], sum(r['subTotalWithTax'] for r in col), 0.02), f'{tot["totalSubTotalWithTax"]} vs {round(sum(r["subTotalWithTax"] for r in col),2)}', 'SV-4573 "Last row shows total for all"', 'range')
            add(name, lab, f'Total tax and shop-supply totals = sums of the rows (status filter {st})', near(tot['totalTax'], sum(r['tax'] for r in col), 0.02) and near(tot['totalShopSupplies'], sum(r['shopSupplyTotal'] for r in col), 0.02), f'tax {tot["totalTax"]} vs {round(sum(r["tax"] for r in col),2)}', 'SV-4573', 'range')
            per = collections.Counter()
            for r in col:
                for tr in r['taxRates']: per[(tr['id'], tr['percentage'])] += tr['amount']
            tr_tot = {(x['id'], x['percentage']): x['amount'] for x in tot['taxRatesTotal']}
            ok = set(tr_tot) == {k for k, v in per.items()} and all(near(tr_tot[k], per[k], 0.02) for k in tr_tot)
            add(name, lab, f'All tax rates tab: each rate total = sum of that rate over the listed invoices (status filter {st})', ok, f'{ {k[1]:(tr_tot.get(k), round(per[k],2)) for k in set(tr_tot)|set(per) if not near(tr_tot.get(k),per.get(k),0.02)} }', 'SV-4573 / CS §4C', 'range')
            for r in col:
                v = bynum.get(r['invoiceNumber']); num = r['invoiceNumber']
                if not v:
                    add(name, lab, 'Listed invoice found among the location\'s non-void invoices', False, num, 'CS §5'); continue
                lab_sell = round(sum(l.get('labour_cost') or 0 for l in v['work_order']['lines']), 2)
                prt_sell = round(sum(l.get('parts_cost') or 0 for l in v['work_order']['lines']), 2)
                add(name, lab, 'Invoice Status = the invoice\'s payment status', r['status'] == v['payment_status'], f'{num} {r["status"]} vs {v["payment_status"]}', 'SV-4573 / CS §4A')
                add(name, lab, 'Invoice Created Date = invoice created date', r['createdOn'][:16] == dt.datetime.fromisoformat(v['created_on']).astimezone(dt.timezone.utc).strftime('%Y-%m-%d %H:%M'), f'{num} {r["createdOn"]} vs {v["created_on"]}', 'SV-4573')
                add(name, lab, 'Invoice Paid Date = date of the latest payment', r['paidDate'][:16] == (last.get(num) or '')[:16], f'{num} {r["paidDate"]} vs payments {last.get(num)}', 'SV-4573 "latest payment"')
                add(name, lab, 'Labor Total = labor on the invoice', near(r['laborTotal'], lab_sell), f'{num} {r["laborTotal"]} vs {lab_sell}', 'SV-4573')
                add(name, lab, 'Parts Total = parts on the invoice (invoiced parts only)', near(r['partsTotal'], prt_sell), f'{num} {r["partsTotal"]} vs {prt_sell}', 'SV-9300 Expected')
                add(name, lab, 'Shop Supply Total = invoice shop supplies', near(r['shopSupplyTotal'], money(v['shop_supplies_cost'])), f'{num} {r["shopSupplyTotal"]} vs {v["shop_supplies_cost"]}', 'SV-4573')
                pre = round(money(v['sub_total_with_tax']) - float(v['tax'].get('amountTotal') or 0), 2)
                add(name, lab, 'Invoice Subtotal = invoice subtotal without tax', near(r['subtotal'], pre) or near(r['subtotal'], money(v['sub_total_display'])), f'{num} {r["subtotal"]} vs pre-tax {pre} / display {v["sub_total_display"]}', 'SV-4573')
                ir = {(x['id'], x['percentage']): round(x['amount'], 2) for x in v['tax'].get('rates') or []}
                rr = {(x['id'], x['percentage']): round(x['amount'], 2) for x in r['taxRates']}
                add(name, lab, 'Taxes = each tax rate and amount saved on the invoice', ir == rr, f'{num} report {rr} vs invoice {ir}', 'SV-4573 tax columns')
                add(name, lab, 'Total tax on the row = invoice tax total', near(r['tax'], float(v['tax'].get('amountTotal') or 0)), f'{num} {r["tax"]} vs {v["tax"].get("amountTotal")}', 'CS §4C')
                add(name, lab, 'Invoice Total = invoice total with tax', near(r['subTotalWithTax'], money(v['sub_total_with_tax'])), f'{num} {r["subTotalWithTax"]} vs {v["sub_total_with_tax"]}', 'SV-4573')
                add(name, lab, 'Listed invoice is not void', v['status'] != 'void', f'{num} {v["status"]}', 'CS §5')
    for p in ('this_month', 'last_month', 'this_year', 'last_year', 'this_week', 'last_week', 'this_quarter', 'last_quarter'):
        a = json.load(open(os.path.join(d, f'tax_preset__{p}.json'))); b = json.load(open(os.path.join(d, f'tax__{p}__default.json')))
        add(name, p, 'Preset by name = the same dates as a custom range (location time zone)', a['status'] == 200 and {r['invoiceNumber'] for r in a['data']['collection']} == {r['invoiceNumber'] for r in b['data']['collection']},
            f'preset {len(a["data"].get("collection",[]))} vs custom {len(b["data"].get("collection",[]))}', 'draft PRD "default is This month"', 'range')
json.dump(rows, open(OUTF, 'w'), indent=0)
by = collections.defaultdict(collections.Counter)
for r in rows: by[r['check']][r['result']] += 1
for k, v in by.items(): print(dict(v), '|', k)
print('TOTAL', collections.Counter(r['result'] for r in rows))
