#!/usr/bin/env python3
"""Sales By Customer FULL check against the spec (Confluence 577634305 v22) and independent records.
Invoice level: every invoice row in the drill-down trees (last 12 months + last year = Jan 2025..today)
vs the invoice's own record (GET /api/invoices/{id}/view) and the work order Stats tab
(GET /api/work-orders/statistics/{id}).  Roll-ups: asset = sum(invoices), customer = sum(assets),
every one of the 16 ranges x 3 sales types = sum of tree invoices inside that window.
Output: ../results-sbc.json + printed summary. SECRET-FREE."""
import json, os, sys, collections, datetime as dt
from zoneinfo import ZoneInfo
sys.path.insert(0, os.path.dirname(__file__))
from common import *
from records import invoice, stats, stat_totals, prefetch, money, wo_view
OUTF = os.path.join('/tmp/cln/w2/full', 'results-sbc.json')
MONEY = ['labor_invoiced', 'labor_margin', 'parts_invoiced', 'parts_margin', 'shop_supplies', 'adjustments', 'margin', 'subtotal']
rows = []
def add(loc, rng, check, ok, detail, ref='', level='invoice', key=''):
    rows.append({'report': 'Sales By Customer', 'location': loc, 'range': rng, 'level': level, 'key': key,
                 'check': check, 'result': ok if isinstance(ok, str) else ('PASS' if ok else 'FAIL'), 'detail': detail, 'source': ref})

def label_expected(vd):
    """SV-9459 precedence (PO ticket, Done 2026-09-10) and the spec's S8-R7..R10 (VIN first)."""
    p = lambda x: (x or '').strip() or None
    unit, vin = p(vd.get('unit')), p(vd.get('vin'))
    ymm = ' '.join([p(vd.get('year')) or '', p(vd.get('make')) or '', p(vd.get('model')) or '']) if all(p(vd.get(k)) for k in ('year', 'make', 'model')) else None
    sv9459 = f'{unit} - {ymm}' if unit and ymm else (ymm or unit or vin or 'Unknown Asset')
    spec = vin or unit or p(vd.get('licence_plate')) or 'Unknown Asset'
    return sv9459, spec

for wid, name, tz in WORKPLACES:
    d = os.path.join(RAW, wid)
    if not os.path.exists(os.path.join(d, 'sbc_tree__last_year.json')): continue
    z = ZoneInfo(tz)
    inv_rows, asset_of = {}, {}
    for lab in ('last_12_months', 'last_year'):
        T = json.load(open(os.path.join(d, f'sbc_tree__{lab}.json')))
        for c in T['tree']:
            cust = c['customer']
            # ---- roll-ups inside the tree (S8-R13, S7-R3)
            sums = collections.Counter(); n = 0
            for a in c['assets']:
                asum = collections.Counter(); hrs = 0
                for i in a['invoices'] or []:
                    for k in MONEY: asum[k] += i[k]
                    hrs += i['inv_hrs']
                    inv_rows[i['invoice_id']] = i; asset_of[i['invoice_id']] = (cust, a['asset'])
                A = a['asset']; ni = len(a['invoices'] or [])
                ok = all(asum[k] == A[k] for k in MONEY) and abs(hrs - A['inv_hrs']) < 0.006 and ni == A['invoice_count']
                add(name, lab, 'Asset row = sum of its invoice rows (S8-R13) and (n) = invoice count', ok,
                    f'{cust["customer_name"]} / {A["label"]}: ' + ('' if ok else str({k: (A[k], asum[k]) for k in MONEY if A[k] != asum[k]}) + f' hrs {A["inv_hrs"]} vs {round(hrs,2)} n {A["invoice_count"]} vs {ni}'),
                    'S8-R13', 'asset', A['key'])
                for k in MONEY: sums[k] += A[k]
                n += A['invoice_count']
            ok = all(sums[k] == cust[k] for k in MONEY) and n == cust['invoice_count']
            add(name, lab, 'Customer row = sum of its asset rows (S8-R13) and (n) = its invoices (S7-R3)', ok,
                f'{cust["customer_name"]}' + ('' if ok else str({k: (cust[k], sums[k]) for k in MONEY if cust[k] != sums[k]}) + f' n {cust["invoice_count"]} vs {n}'), 'S8-R13,S7-R3', 'customer', cust['key'])
            # asset order: Parts Sales last, others A->Z (S8-R6, S8-R6a)
            labels = [a['asset'] for a in c['assets']]
            real = [a['label'] for a in labels if not a['is_parts_sales']]
            ps_pos = [i for i, a in enumerate(labels) if a['is_parts_sales']]
            ok = real == sorted(real, key=lambda s: s.lower()) and (not ps_pos or ps_pos == [len(labels) - 1])
            add(name, lab, 'Assets A-Z by label, "Parts Sales" bucket last (S8-R6, S8-R6a)', ok, f'{cust["customer_name"]}: {[a["label"] for a in labels]}', 'S8-R6a', 'customer', cust['key'])
    ids = list(inv_rows)
    invs = dict(zip(ids, prefetch([(i, wid) for i in ids], invoice)))
    sts = dict(zip(ids, prefetch([(inv_rows[i]['work_order_id'], wid) for i in ids], stats)))
    wvs = dict(zip(ids, prefetch([(inv_rows[i]['work_order_id'], wid) for i in ids], wo_view)))
    # ---- invoice level
    for iid, r in inv_rows.items():
        v = invs[iid]; st = stat_totals(sts[iid]); num = r['invoice_number']
        cust, asset = asset_of[iid]
        if v is None:
            add(name, '2y', 'Invoice record readable', False, num); continue
        made = dt.datetime.fromisoformat(v['created_on']).astimezone(z)
        add(name, '2y', 'Listed invoice is not void / reversed (S7-R7, S7-N2)', v['status'] != 'void', f'{num} status {v["status"]}', 'S7-R7')
        add(name, '2y', 'Invoice date on the row = invoice created date', r['created_on'][:19] == dt.datetime.fromisoformat(v['created_on']).astimezone(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S'), f'{num} row {r["created_on"]} record {v["created_on"]}', 'S8-R12')
        lab_sell = round(sum(l.get('labour_cost') or 0 for l in v['work_order']['lines']) * 100)
        prt_sell = round(sum(l.get('parts_cost') or 0 for l in v['work_order']['lines']) * 100)
        _adj = (stat_totals(sts[iid]) or {}).get('adjustments') or []          # line-level fees/discounts fold into their line (S7-R17 / S5-R11)
        lab_sell += round(sum(a['resolvedAmount'] for a in _adj if a.get('scope') == 'labor_line') * 100)
        prt_sell += round(sum(a['resolvedAmount'] for a in _adj if a.get('scope') == 'part_line') * 100)
        sup = round(money(v.get('shop_supplies_cost')) * 100)
        sub = round((money(v['sub_total_with_tax']) - float(v['tax'].get('amountTotal') or 0)) * 100)
        adj = sub - lab_sell - prt_sell - sup
        add(name, '2y', 'Labor Invoiced = labor on the invoice lines (+ labor-line fees/discounts)', abs(r['labor_invoiced'] - lab_sell) <= 1, f'{num} report {r["labor_invoiced"]} vs invoice {lab_sell} (cents)', 'S4 Terminology')
        add(name, '2y', 'Parts Invoiced = parts on the invoice lines (+ part-line fees/discounts)', abs(r['parts_invoiced'] - prt_sell) <= 1, f'{num} report {r["parts_invoiced"]} vs invoice {prt_sell}', 'S4 Terminology')
        add(name, '2y', 'Shop Supplies = shop supplies charged on the invoice', abs(r['shop_supplies'] - sup) <= 1, f'{num} report {r["shop_supplies"]} vs invoice {sup}', 'S4 Terminology')
        add(name, '2y', 'Subtotal = invoice pre-tax total (after invoice-level fees/discounts)', abs(r['subtotal'] - sub) <= 1, f'{num} report {r["subtotal"]} vs invoice {sub} (with-tax {v["sub_total_with_tax"]} tax {v["tax"].get("amountTotal")})', 'S4 Subtotal')
        add(name, '2y', 'Adjustments = invoice-level fees minus discounts (S7-R17)', abs(r['adjustments'] - adj) <= 2, f'{num} report {r["adjustments"]} vs invoice {adj} (WO adjustments {[(a["kind"], a["resolvedAmount"]) for a in (st or {}).get("adjustments") or []]}, old % discount {v.get("discount")})', 'S7-R17')
        add(name, '2y', 'Row ties out: Labor + Parts + Shop Supplies + Adjustments = Subtotal (S7-R18)', r['labor_invoiced'] + r['parts_invoiced'] + r['shop_supplies'] + r['adjustments'] == r['subtotal'], num, 'S7-R18')
        add(name, '2y', 'Row ties out: Labor Margin + Parts Margin + Adjustments = Margin (S7-R18)', r['labor_margin'] + r['parts_margin'] + r['adjustments'] == r['margin'], num, 'S7-R18')
        if st and st['labor_data'] and st['parts_data'] and st['hours_data']:
            lc = round(st['labor_data']['cost'] * 100); pc = round(st['parts_data']['cost'] * 100)
            add(name, '2y', 'Labor Margin = Labor Invoiced - labor cost (WO Stats tab cost)', abs(r['labor_margin'] - (r['labor_invoiced'] - lc)) <= 2,
                f'{num} report {r["labor_margin"]} vs {r["labor_invoiced"]}-{lc}={r["labor_invoiced"]-lc}', 'S4 Labor Margin')
            add(name, '2y', 'Parts Margin = Parts Invoiced - parts cost (WO Stats tab cost)', abs(r['parts_margin'] - (r['parts_invoiced'] - pc)) <= 2,
                f'{num} report {r["parts_margin"]} vs {r["parts_invoiced"]}-{pc}={r["parts_invoiced"]-pc}', 'S4 Parts Margin')
            ld = st['hours_data']['estimated_hours'] - st['hours_data']['clocked_hours']
            add(name, '2y', 'Labor Delta = hours invoiced - hours worked (WO Stats tab)', abs(r['inv_hrs'] - ld) <= 0.05 + 0.01 * len(st['hours_data_lines']),
                f'{num} report {r["inv_hrs"]} vs stats {st["hours_data"]["estimated_hours"]}-{st["hours_data"]["clocked_hours"]}={round(ld,2)}', 'S4 Labor Delta, S12-R2')
        mp_spec = None if r['subtotal'] <= 0 else round(r['margin'] / r['subtotal'] * 100, 1)
        mp_got = None if r['margin_pct'] is None else round(r['margin_pct'], 1)
        add(name, '2y', 'Margin % = Margin / Subtotal x 100, em dash when Subtotal <= 0 (S7-R11, S7-R12)', mp_spec == mp_got,
            f'{num} report {r["margin_pct"]} vs spec {mp_spec} (supplies {r["shop_supplies"]})', 'S7-R11', key='shop_supplies>0' if r['shop_supplies'] else 'no_supplies')
        base = r['labor_invoiced'] + r['parts_invoiced'] + r['adjustments']
        mp_sbr = None if base <= 0 else round(r['margin'] / base * 100, 2)
        add(name, '2y', 'Margin % = Margin / (Subtotal - Shop Supplies) x 100 (SBR spec v30 context note: "Sales By Customer computes Margin % from the same Margin base")', mp_sbr == r['margin_pct'], f'{num} report {r["margin_pct"]} vs {mp_sbr}', 'SBR §3')
        add(name, '2y', 'Sales type by invoice number prefix (S/P)', r['invoice_number'][0] in 'SP' and ((r['invoice_number'][0] == 'P') == (r['work_order_type'] == 'parts')), f'{num} type {r["work_order_type"]}', 'S4 Service/Parts invoice')
        vd = v.get('vehicle_details') or {}
        has_vehicle = any((vd.get(k) or '').strip() if isinstance(vd.get(k), str) else vd.get(k) for k in ('vin', 'unit', 'licence_plate', 'make', 'model', 'year'))
        if asset['is_parts_sales']:
            add(name, '2y', 'No-vehicle work sits in the "Parts Sales" bucket (S8-R6, S8-E3)', not has_vehicle or r['invoice_number'][0] == 'P', f'{num} vehicle {vd}', 'S8-R6', key='parts_sales')
        else:
            cv = (wvs.get(iid) or {}).get('vehicle') or {}
            if cv: vd = {'vin': cv.get('vin'), 'unit': cv.get('unit'), 'licence_plate': cv.get('licence_plate'), 'year': cv.get('year'), 'make': cv.get('maker_name'), 'model': cv.get('model_name')}
            exp9459, expspec = label_expected(vd)
            got = asset['label'].split(' (#')[0]
            add(name, '2y', 'Asset label follows SV-9459 (Unit # - Year Make Model, VIN fallback)', got == exp9459, f'{num} label "{asset["label"]}" vs SV-9459 "{exp9459}"', 'SV-9459')
            add(name, '2y', 'Asset label follows the spec S8-R7..R10 (VIN, then Unit, then plate)', got == expspec, f'{num} label "{asset["label"]}" vs spec "{expspec}"', 'S8-R7')
    # ---- every range x sales type: customer summary = sum of tree invoices in the window
    for lab in ranges(dt.date(2026, 10, 28)):
        for pt in ('all', 'parts', 'service', 'none'):
            p = os.path.join(d, f'sbc__{lab}__{pt}.json')
            if not os.path.exists(p): continue
            S = json.load(open(p)); f, t = S['from'], S['to']
            if S['status'] != 200:
                add(name, lab, f'Report loads ({pt})', False, f'HTTP {S["status"]}', level='range'); continue
            exp = collections.defaultdict(collections.Counter)
            for iid, r in inv_rows.items():
                v = invs[iid]
                if v is None: continue
                ld = dt.datetime.fromisoformat(v['created_on']).astimezone(z).date().isoformat()
                if not (f <= ld <= t): continue
                if pt == 'none' or (pt == 'parts' and r['invoice_number'][0] != 'P') or (pt == 'service' and r['invoice_number'][0] != 'S'): continue
                ck = asset_of[iid][0]['key']
                for k in MONEY: exp[ck][k] += r[k]
                exp[ck]['n'] += 1; exp[ck]['hrs'] += r['inv_hrs']
            got = {c['key']: c for c in S['data']['collection']}
            ok_set = set(got) == set(exp)
            add(name, lab, f'Customers listed = customers with a non-void invoice in the dates (sales type {pt}) (S7-N1, S3-R5/R6)', ok_set,
                f'{f}..{t}: report {len(got)} vs records {len(exp)}; missing {[k for k in exp if k not in got][:5]} extra {[got[k]["customer_name"] for k in got if k not in exp][:5]}', 'S7-N1,S3', 'range')
            bad = []
            for k in set(got) & set(exp):
                g, e = got[k], exp[k]
                if any(g[m] != e[m] for m in MONEY) or g['invoice_count'] != e['n'] or abs(g['inv_hrs'] - e['hrs']) > 0.011:
                    bad.append((g['customer_name'], {m: (g[m], e[m]) for m in MONEY if g[m] != e[m]}, g['invoice_count'], e['n'], g['inv_hrs'], round(e['hrs'], 2)))
            add(name, lab, f'Every customer row (all columns + (n)) = sum of its invoices in the dates (sales type {pt}) (S7-R5, S7-R6)', not bad,
                f'{len(set(got)&set(exp))} customers; {len(bad)} differ: {bad[:3]}', 'S7-R5,S7-R6', 'range')
            tot = S['data'].get('totals') or {}
            ts = {m: sum(c[m] for c in got.values()) for m in MONEY}
            ok = all(tot.get(m) == ts[m] for m in MONEY) and abs((tot.get('inv_hrs') or 0) - sum(c['inv_hrs'] for c in got.values())) < 0.011
            add(name, lab, f'Totals row = sum of all customer rows (sales type {pt}) (S18-R6)', ok, f'{ {m:(tot.get(m), ts[m]) for m in MONEY if tot.get(m)!=ts[m]} }', 'S18-R6', 'range')
            if tot:
                mb = ts['labor_invoiced'] + ts['parts_invoiced'] + ts['adjustments']
                add(name, lab, f'Totals Margin % recomputed from the summed Margin, not averaged (sales type {pt})',
                    tot.get('margin_pct') == (None if mb <= 0 else round(ts['margin'] / mb * 100, 2)), f'report {tot.get("margin_pct")} sum-based {None if mb<=0 else round(ts["margin"]/mb*100,2)}; spec S7-R11 base would give {None if ts["subtotal"]<=0 else round(ts["margin"]/ts["subtotal"]*100,2)}', 'S7-R14', 'range')
            if pt == 'none':
                add(name, lab, 'No sales type selected -> no rows (S3-R6a)', not got, f'{len(got)} rows', 'S3-R6a', 'range')
            ok = all(c['margin_pct'] == (None if c['labor_invoiced'] + c['parts_invoiced'] + c['adjustments'] <= 0 else round(c['margin'] / (c['labor_invoiced'] + c['parts_invoiced'] + c['adjustments']) * 100, 2)) for c in got.values())
            add(name, lab, f'Customer Margin % recomputed from the row sums (sales type {pt})', ok, '', 'S7-R14', 'range')
json.dump(rows, open(OUTF, 'w'), indent=0)
summ = collections.Counter((r['check'], r['result']) for r in rows)
by = collections.defaultdict(lambda: collections.Counter())
for r in rows: by[r['check']][r['result']] += 1
for k, v in by.items(): print(dict(v), '|', k)
print('TOTAL', collections.Counter(r['result'] for r in rows))
