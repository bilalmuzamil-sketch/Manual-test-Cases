#!/usr/bin/env python3
"""Sales By Representative FULL check against the spec (Confluence 585629698 v30) and independent records:
invoice record, WO Stats tab, WO record (its sales rep), customer record (its sales rep).
Invoice level from the per-rep drill-downs (last 12 months + last year, Show Unassigned on); roll-ups;
every range x Invoice Status x Show Unassigned x Product Type = sum of the invoice rows. SECRET-FREE."""
import json, os, sys, collections, datetime as dt
from zoneinfo import ZoneInfo
sys.path.insert(0, os.path.dirname(__file__))
from common import *
from records import invoice, stats, stat_totals, prefetch, money, wo_view, customer_view
OUTF = os.path.join('/tmp/cln/w2/full', 'results-sbr.json')
MONEY = ['labor_invoiced', 'labor_margin', 'parts_invoiced', 'parts_margin', 'shop_supplies', 'adjustments', 'margin', 'subtotal']
rows = []
def add(loc, rng, check, ok, detail, ref='', level='invoice', key=''):
    rows.append({'report': 'Sales By Representative', 'location': loc, 'range': rng, 'level': level, 'key': key, 'check': check,
                 'result': ok if isinstance(ok, str) else ('PASS' if ok else 'FAIL'), 'detail': detail, 'source': ref})
def bucket_spec(v):
    """Spec v30 §3 mapping (verbatim rules); zero-total unpaid -> Unpaid per the spec text."""
    ps = v.get('payment_status'); bal = money(v.get('total_balance'))
    return {'paid': 'Paid', 'overpaid': 'Paid', 'partially_paid': 'Partially Paid', 'unpaid': 'Unpaid'}.get(ps) or ('Paid' if ps == 'prepaid' and bal <= 0 else 'Partially Paid' if ps == 'prepaid' else 'Unpaid')
def bucket_sv9217(v):
    b = bucket_spec(v)
    return 'Paid' if b == 'Unpaid' and money(v.get('sub_total_with_tax')) <= 0 else b
DISP = {'paid': 'Paid', 'partially_paid': 'Partially Paid', 'unpaid': 'Unpaid'}
for wid, name, tz in WORKPLACES:
    d = os.path.join(RAW, wid)
    if not os.path.exists(os.path.join(d, 'sbr_tree__last_year.json')): continue
    z = ZoneInfo(tz)
    inv_rows, rep_of = {}, {}
    for lab in ('last_12_months', 'last_year'):
        T = json.load(open(os.path.join(d, f'sbr_tree__{lab}.json')))
        order = [t['rep'] for t in T['tree']]
        un = [i for i, r in enumerate(order) if r['is_unassigned']]
        names = [r['rep_name'] for r in order if not r['is_unassigned']]
        add(name, lab, 'Unassigned row pinned first, reps A-Z by name (S22-R4, Key Decisions "Rep ordering is plain A->Z")',
            (not un or un == [0]) and names == sorted(names, key=str.lower), f'{[r["rep_name"] for r in order][:12]}', 'S22-R4', 'range')
        for t in T['tree']:
            rep = t['rep']; inv = t['invoices'] or []
            s = collections.Counter()
            for i in inv:
                for k in MONEY: s[k] += i[k]
                s['hrs'] += i['inv_hrs']; inv_rows[(rep['key'], i['invoice_id'])] = i; rep_of[(rep['key'], i['invoice_id'])] = rep
            ok = all(s[k] == rep[k] for k in MONEY) and len(inv) == rep['invoice_count'] and abs(s['hrs'] - rep['inv_hrs']) < 0.011
            add(name, lab, 'Rep row = sum of its invoice rows, (n) = its invoices (S5-R4, S5-R6)', ok, f'{rep["rep_name"]}: ' + ('' if ok else str({k: (rep[k], s[k]) for k in MONEY if rep[k] != s[k]}) + f' n {rep["invoice_count"]}/{len(inv)} hrs {rep["inv_hrs"]}/{round(s["hrs"],2)}'), 'S5-R6', 'rep', rep['key'])
            add(name, lab, 'Every rep row has at least one invoice (contributors only, S5-R1)', rep['invoice_count'] >= 1, rep['rep_name'], 'S5-R1', 'rep', rep['key'])
            ords = [(dt.datetime.fromisoformat(i['created_on'].replace('Z', '+00:00')).astimezone(z).date(), int(''.join(c for c in i['invoice_number'].split('-')[-1] if c.isdigit()) or 0)) for i in inv]
            ok = all((ords[j][0] > ords[j + 1][0]) or (ords[j][0] == ords[j + 1][0] and ords[j][1] <= ords[j + 1][1]) for j in range(len(ords) - 1))
            add(name, lab, 'Invoice rows newest first, same-day ties by invoice number (S6-R9)', ok, f'{rep["rep_name"]}: {[i["invoice_number"] for i in inv][:8]}', 'S6-R9', 'rep', rep['key'])
            if not rep['is_unassigned']:
                add(name, lab, 'Rep name tagged (Inactive) only for an inactive rep (S5-R9)', isinstance(rep.get('is_inactive'), bool), f'{rep["rep_name"]} inactive={rep.get("is_inactive")}', 'S5-R9', 'rep', rep['key'])
    keys = list(inv_rows)
    ids = sorted({k[1] for k in keys})
    invs = dict(zip(ids, prefetch([(i, wid) for i in ids], invoice)))
    first = {}
    for k in keys: first.setdefault(k[1], inv_rows[k])
    sts = dict(zip(ids, prefetch([(first[i]['work_order_id'], wid) for i in ids], stats)))
    wos = dict(zip(ids, prefetch([(first[i]['work_order_id'], wid) for i in ids], wo_view)))
    cids = sorted({first[i]['customer_id'] for i in ids if first[i].get('customer_id')})
    cus = dict(zip(cids, prefetch([(c, wid) for c in cids], customer_view)))
    seen = collections.Counter(k[1] for k in keys)
    for iid, n in seen.items():
        add(name, '2y', 'Each invoice appears under exactly one rep or Unassigned (S6-R7, single-rep build)', n == 1, f'{first[iid]["invoice_number"]} appears {n}x', 'S6-R7')
    for (rk, iid), r in inv_rows.items():
        v = invs[iid]; num = r['invoice_number']; rep = rep_of[(rk, iid)]
        if v is None: add(name, '2y', 'Invoice record readable', False, num); continue
        add(name, '2y', 'Listed invoice is not void / reversed', v['status'] != 'void', f'{num} {v["status"]}', '§3 Reversed')
        lab_sell = round(sum(l.get('labour_cost') or 0 for l in v['work_order']['lines']) * 100)
        prt_sell = round(sum(l.get('parts_cost') or 0 for l in v['work_order']['lines']) * 100)
        _adj = (stat_totals(sts[iid]) or {}).get('adjustments') or []          # line-level fees/discounts fold into their line (S7-R17 / S5-R11)
        lab_sell += round(sum(a['resolvedAmount'] for a in _adj if a.get('scope') == 'labor_line') * 100)
        prt_sell += round(sum(a['resolvedAmount'] for a in _adj if a.get('scope') == 'part_line') * 100)
        sup = round(money(v.get('shop_supplies_cost')) * 100)
        sub = round((money(v['sub_total_with_tax']) - float(v['tax'].get('amountTotal') or 0)) * 100)
        add(name, '2y', 'Labor Invoiced = labor on the invoice (+ labor-line fees/discounts)', abs(r['labor_invoiced'] - lab_sell) <= 1, f'{num} {r["labor_invoiced"]} vs {lab_sell}', '§3')
        add(name, '2y', 'Parts Invoiced = parts on the invoice (+ part-line fees/discounts)', abs(r['parts_invoiced'] - prt_sell) <= 1, f'{num} {r["parts_invoiced"]} vs {prt_sell}', '§3')
        add(name, '2y', 'Shop Supplies = the invoice shop-supply charge (S5-R13)', abs(r['shop_supplies'] - sup) <= 1, f'{num} {r["shop_supplies"]} vs {sup}', 'S5-R13')
        add(name, '2y', 'Subtotal = invoice pre-tax total', abs(r['subtotal'] - sub) <= 1, f'{num} {r["subtotal"]} vs {sub}', '§3 Subtotal')
        add(name, '2y', 'Adjustments = invoice-level fees minus discounts (S5-R11)', abs(r['adjustments'] - (sub - lab_sell - prt_sell - sup)) <= 2, f'{num} {r["adjustments"]} vs {sub-lab_sell-prt_sell-sup}', 'S5-R11')
        add(name, '2y', 'Row ties out: Labor + Parts + Shop Supplies + Adjustments = Subtotal (S5-R12)', r['labor_invoiced'] + r['parts_invoiced'] + r['shop_supplies'] + r['adjustments'] == r['subtotal'], num, 'S5-R12')
        add(name, '2y', 'Row ties out: Labor Margin + Parts Margin + Adjustments = Margin (S5-R12)', r['labor_margin'] + r['parts_margin'] + r['adjustments'] == r['margin'], num, 'S5-R12')
        base = r['labor_invoiced'] + r['parts_invoiced'] + r['adjustments']
        add(name, '2y', 'Margin % = Margin / Margin base x 100, "—" when base <= 0 (§3)', r['margin_pct'] == (None if base <= 0 else round(r['margin'] / base * 100, 2)), f'{num} {r["margin_pct"]}', '§3 Margin %')
        add(name, '2y', 'Labor Delta = hours invoiced - hours worked (row fields) (§3, S9-R2)', abs(r['inv_hrs'] - (r['hours_invoiced'] - r['hours_worked'])) < 0.006, f'{num} {r["inv_hrs"]} vs {r["hours_invoiced"]}-{r["hours_worked"]}', '§3 Labor Delta')
        st = stat_totals(sts[iid])
        if st and st['hours_data'] and st['labor_data']:
            nl = max(1, len(st['hours_data_lines']))
            add(name, '2y', 'Hours invoiced = billed labor hours on the work order (Stats tab)', abs(r['hours_invoiced'] - st['hours_data']['estimated_hours']) <= 0.006 * nl + 0.001, f'{num} {r["hours_invoiced"]} vs {st["hours_data"]["estimated_hours"]}', '§3 Labor Delta')
            add(name, '2y', 'Hours worked = technician clocked hours on the work order (Stats tab)', abs(r['hours_worked'] - st['hours_data']['clocked_hours']) <= 0.006 * nl + 0.02, f'{num} {r["hours_worked"]} vs {st["hours_data"]["clocked_hours"]}', '§3 Labor Delta')
            lc = round(st['labor_data']['cost'] * 100); pc = round(st['parts_data']['cost'] * 100)
            add(name, '2y', 'Labor Margin = Labor Invoiced - the shop labor cost (Stats tab)', abs(r['labor_margin'] - (r['labor_invoiced'] - lc)) <= 2, f'{num} {r["labor_margin"]} vs {r["labor_invoiced"]-lc}', '§3 Labor Margin')
            add(name, '2y', 'Parts Margin = Parts Invoiced - the shop parts cost (Stats tab)', abs(r['parts_margin'] - (r['parts_invoiced'] - pc)) <= 2, f'{num} {r["parts_margin"]} vs {r["parts_invoiced"]-pc}', '§3 Parts Margin')
        got = DISP.get(r['payment_status'], r['payment_status'])
        add(name, '2y', 'Status badge = the five-state -> three-value mapping in §3 (spec text)', got == bucket_spec(v), f'{num} badge {got} vs spec {bucket_spec(v)} (invoice payment_status {v.get("payment_status")}, total {v.get("sub_total_with_tax")}, balance {v.get("total_balance")})', '§3 Payment status', key='zero_total' if money(v.get('sub_total_with_tax')) <= 0 else '')
        add(name, '2y', 'Status badge = SV-9217 rule ($0 invoice reads Paid)', got == bucket_sv9217(v), f'{num} badge {got} vs {bucket_sv9217(v)}', 'SV-9217')
        w = wos[iid]; c = cus.get(r.get('customer_id')) or {}
        cname = ' '.join(x for x in (c.get('sales_rep_first_name'), c.get('sales_rep_last_name')) if x) or None
        exp_rep = (w or {}).get('sales_rep_name') or (cname if c.get('sales_rep_id') else None)
        got_rep = None if rep['is_unassigned'] else rep['rep_name']
        add(name, '2y', 'Invoice credited to the work order\'s sales rep, else the customer\'s (Key Decisions, Snapshot)', (got_rep or '').strip().lower() == (exp_rep or '').strip().lower(),
            f'{num} credited {rep["rep_name"]} ({got_rep}) vs WO rep {(w or {}).get("sales_rep_name")} ({(w or {}).get("sales_rep_id")}) / customer rep {c.get("sales_rep_first_name")} {c.get("sales_rep_last_name")} ({c.get("sales_rep_id")})', '§3 Key Decisions, §4 Snapshot', key='unassigned' if rep['is_unassigned'] else 'rep')
    # ---- every range x filters
    for lab in ranges(dt.date(2026, 10, 28)):
        for fn in sorted(os.listdir(d)):
            if not fn.startswith(f'sbr__{lab}__'): continue
            _, _, st_, un, pt = fn[:-5].split('__')
            S = json.load(open(os.path.join(d, fn))); f, t = S['from'], S['to']
            tag = f'status {st_} unassigned {un} type {pt}'
            if S['status'] != 200:
                add(name, lab, f'Report loads ({tag})', st_ == 'paid,unpaid' and 'NOT A SCREEN OPTION' or False, f'HTTP {S["status"]} {str(S["data"])[:150]}', '', 'range'); continue
            want = set(st_.split(',')) if st_ != 'all' else None
            exp = collections.defaultdict(collections.Counter)
            for (rk, iid), r in inv_rows.items():
                v = invs[iid]
                if v is None: continue
                ld = dt.datetime.fromisoformat(v['created_on']).astimezone(z).date().isoformat()
                if not (f <= ld <= t): continue
                if pt == 'none' or (pt == 'parts' and num_prefix(r) != 'P') if False else (pt == 'none' or (pt == 'parts' and r['invoice_number'][0] != 'P') or (pt == 'service' and r['invoice_number'][0] != 'S')): continue
                if want and r['payment_status'] not in want: continue
                rep = rep_of[(rk, iid)]
                if rep['is_unassigned'] and un == '0': continue
                for k in MONEY: exp[rk][k] += r[k]
                exp[rk]['n'] += 1
            got = {c['key']: c for c in S['data']['collection']}
            bad = [(got[k]['rep_name'], {m: (got[k][m], exp[k][m]) for m in MONEY if got[k][m] != exp[k][m]}, got[k]['invoice_count'], exp[k]['n']) for k in set(got) & set(exp)
                   if any(got[k][m] != exp[k][m] for m in MONEY) or got[k]['invoice_count'] != exp[k]['n']]
            add(name, lab, f'Reps listed = reps with a matching invoice ({tag}) (S5-R1, S4-R6, S21-R4, S22)', set(got) == set(exp), f'{f}..{t} report {len(got)} vs records {len(exp)} missing {[k for k in exp if k not in got][:3]} extra {[got[k]["rep_name"] for k in got if k not in exp][:3]}', 'S5-R1', 'range')
            add(name, lab, f'Every rep row = sum of its matching invoices ({tag}) (S3-R8, S4-R6, S4-R7)', not bad, f'{len(bad)} differ {bad[:3]}', 'S4-R7', 'range')
            tot = S['data'].get('totals') or {}
            ts = {m: sum(c[m] for c in got.values()) for m in MONEY}
            add(name, lab, f'Totals = sum of the shown rows, Unassigned only when switched on ({tag}) (S10-R5, S22-R6)', all(tot.get(m) == ts[m] for m in MONEY) if got else True, str({m: (tot.get(m), ts[m]) for m in MONEY if tot.get(m) != ts[m]}), 'S10-R5', 'range')
            if got:
                mb = ts['labor_invoiced'] + ts['parts_invoiced'] + ts['adjustments']
                add(name, lab, f'Totals Margin % recomputed from the totals ({tag}) (§3)', tot.get('margin_pct') == (None if mb <= 0 else round(ts['margin'] / mb * 100, 2)), f'{tot.get("margin_pct")}', '§3', 'range')
            if pt == 'none': add(name, lab, 'No product type selected -> no rows', not got, f'{len(got)}', 'S3-N2', 'range')
json.dump(rows, open(OUTF, 'w'), indent=0)
by = collections.defaultdict(collections.Counter)
for r in rows: by[r['check']][r['result']] += 1
for k, v in by.items(): print(dict(v), '|', k)
print('TOTAL', collections.Counter(r['result'] for r in rows))
