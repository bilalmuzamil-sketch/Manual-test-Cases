#!/usr/bin/env python3
"""Layer B — S3-R1: every dashboard figure equals its matching report's figure (same location, dates, filters).

Inputs: /tmp/cln/dv/raw (dashboard) and /tmp/cln/dv/rep (reports). Output: /tmp/cln/dv/out/parity.json + summary.
Also compares each report's OWN preset (by name) with the dashboard preset window (S10-R5..R8).
"""
import json, os, collections

RAW, REP = '/tmp/cln/dv/raw', '/tmp/cln/dv/rep'
idx = json.load(open(os.path.join(RAW, 'index.json')))
rows = []
S31 = 'S3-R1 "Every figure the dashboard shows for a measure equals the figure the measure\'s matching report shows"'


def rec(wp, rng, measure, dash, rep, ok, note=''):
    rows.append({'location': wp, 'range': rng, 'measure': measure, 'dashboard': dash, 'report': rep,
                 'result': 'PASS' if ok else 'FAIL', 'note': note})


def eq(a, b, tol=0.005):
    if a is None or b is None: return a is None and b is None
    return abs(float(a) - float(b)) <= tol


def load(wid, label, rep):
    p = os.path.join(REP, wid, f'{label}__{rep}.json')
    if not os.path.exists(p): return None
    j = json.load(open(p))
    return j if j['status'] == 200 else {'status': j['status'], 'body': j['body']}


def h(sec): return round(sec / 3600 + 1e-12, 2)


for w in idx['workplaces']:
    wid, name = w['id'], w['name']
    for label in w['ranges']:
        if label.startswith('atrisk') or label == 'custom_367d':
            continue
        pd = os.path.join(REP, wid, f'{label}__dash.json')       # paired read when available
        d = json.load(open(pd if os.path.exists(pd) else os.path.join(RAW, wid, label + '.json')))['body']['data']
        # ---- Revenue vs Sales
        s = load(wid, label, 'sales')
        if s:
            st = s['body']['data']['totals']; col = s['body']['data']['collection']
            rec(name, label, 'Revenue = Sales Subtotal total', d['revenueKpi']['value'], st['total_invoiced'], eq(d['revenueKpi']['value'], st['total_invoiced']))
            n_inv = sum(1 for r in col if not r['is_credit'])
            rec(name, label, 'Invoices count = Sales invoice rows', d['invoicesKpi']['value'], n_inv, d['invoicesKpi']['value'] == n_inv)
            rv = st['total_invoiced']
            if rv and rv > 0:
                p, l = st['parts_invoiced'] / rv * 100, st['labor_invoiced'] / rv * 100
                o = 100 - p - l
                ok = abs(d['revenueKpi']['partsPct'] - p) < 1 and abs(d['revenueKpi']['laborPct'] - l) < 1 and abs((d['revenueKpi']['otherPct'] or 0) - o) < 1
                rec(name, label, 'Parts/Labor/Other % match Sales totals', f'{d["revenueKpi"]["partsPct"]}/{d["revenueKpi"]["laborPct"]}/{d["revenueKpi"]["otherPct"]}',
                    f'{p:.2f}/{l:.2f}/{o:.2f}', ok, 'S4-R3 whole-number split, each within 1 point')
            # per-bucket: revenue chart bars vs Sales rows grouped by local invoice date (day buckets only)
        sp = load(wid, label, 'sales_preset')
        if sp and s:
            a, b = s['body']['data']['totals']['total_invoiced'], sp['body']['data']['totals']['total_invoiced']
            rec(name, label, 'Sales report preset (by name) = dashboard preset window', a, b, eq(a, b),
                'S10-R8 / S3-R1: the same preset must cover the same dates in the tile and the report')
        # ---- Billing Efficiency vs Service Advisor Analysis
        sa = load(wid, label, 'saa')
        if sa:
            t = sa['body']['data']['totals']; be = d['billingEfficiencyKpi']
            rec(name, label, 'Billing Efficiency invoiced hrs = SAA Hrs Invoiced', be['invoicedHours'], t.get('hours_invoiced'), eq(be['invoicedHours'], t.get('hours_invoiced'), 0.011))
            rec(name, label, 'Billing Efficiency clocked hrs = SAA Hrs Worked', be['clockedHours'], t.get('hours_worked'), eq(be['clockedHours'], t.get('hours_worked'), 0.011))
            de = None if be['ratio'] is None else round(be['ratio'] * 100, 2)
            re_ = t.get('labor_efficiency')
            rec(name, label, 'Billing Efficiency % = SAA Billing Efficiency', de, re_, (de is None and re_ in (None, 0)) or eq(de, re_, 0.011))
            # per advisor (name match)
            by = collections.defaultdict(lambda: [0.0, 0.0, 0.0])
            for r in sa['body']['data']['collection']:
                k = (r.get('advisor') or '').strip()
                by[k][0] += r.get('hours_invoiced') or 0; by[k][1] += r.get('hours_worked') or 0; by[k][2] += r.get('labor_invoiced') or 0
            for a in d['billingEfficiencyByAdvisor']:
                k = a['advisorName'].strip(); v = by.get(k)
                if v is None:
                    rec(name, label, 'Advisor row exists in SAA', a['advisorName'], 'missing', False); continue
                rec(name, label, f'Advisor {k}: billed / worked hrs = SAA', f'{a["billedHours"]}/{a["actualHours"]}', f'{v[0]:.2f}/{v[1]:.2f}',
                    eq(a['billedHours'], v[0], 0.011 * max(1, len(by))) and eq(a['actualHours'], v[1], 0.011 * max(1, len(by))))
                if v[1]:
                    rec(name, label, f'Advisor {k}: ELR = SAA labor / worked', a['elr'], round(v[2] / v[1], 2), eq(a['elr'], round(v[2] / v[1], 2), 0.02))
        sap = load(wid, label, 'saa_preset')
        if sap and sa:
            a, b = sa['body']['data']['totals'].get('hours_invoiced'), sap['body']['data']['totals'].get('hours_invoiced')
            rec(name, label, 'SAA preset (by name) = dashboard preset window', a, b, eq(a, b, 0.011))
        # ---- Technician Efficiency vs TE Invoiced
        te = load(wid, label, 'te')
        if te:
            col = te['body']['data']['collection']; k = d['techEfficiencyKpi']
            th = round(sum(r['technicianTechHours'] for r in col), 2); ch = round(sum(r['technicianClockedHours'] for r in col), 2)
            rec(name, label, 'Tech Efficiency tech hrs = TE Invoiced Tech Hrs', k['hoursBilled'], th, eq(k['hoursBilled'], th, 0.011))
            rec(name, label, 'Tech Efficiency clocked = TE Clocked Hrs', k['hoursLogged'], ch, eq(k['hoursLogged'], ch, 0.011))
            rep_e = round(th / ch * 100, 2) if ch > 0 else 0
            rec(name, label, 'Tech Efficiency % = TE Efficiency', k['value'], rep_e, (k['value'] is None and ch == 0) or eq(k['value'], rep_e, 0.011),
                'S3-E3 note: with nothing clocked the tile shows "-" and the report 0%, accepted by the PRD')
            byt = {r['technicianId']: r for r in col}
            for p in d['techPerformance']:
                r = byt.get(p['staffId'])
                ok = r is not None and eq(p['hoursBilled'], r['technicianTechHours'], 0.011) and eq(p['hoursLogged'], r['technicianClockedHours'], 0.011)
                rec(name, label, f'Tech {p["staffName"]}: tech / clocked hrs = TE row', f'{p["hoursBilled"]}/{p["hoursLogged"]}',
                    'missing' if r is None else f'{r["technicianTechHours"]}/{r["technicianClockedHours"]}', ok)
        tep = load(wid, label, 'te_preset')
        if tep and te:
            a = round(sum(r['technicianTechHours'] for r in te['body']['data']['collection']), 2)
            b = round(sum(r['technicianTechHours'] for r in tep['body']['data']['collection']), 2)
            rec(name, label, 'TE preset (by name) = dashboard preset window', a, b, eq(a, b, 0.011))
        # ---- Technician Utilization vs TU report
        tu = load(wid, label, 'tu')
        if tu:
            sm = tu['body']['data']['summary']; k = d['techUtilizationKpi']
            rec(name, label, 'Utilization WO hrs = TU WO Hours', k['woHours'], h(sm['wo_seconds']), eq(k['woHours'], h(sm['wo_seconds']), 0.011))
            rec(name, label, 'Utilization clocked = TU Total Hours', k['hoursClocked'], h(sm['total_seconds']), eq(k['hoursClocked'], h(sm['total_seconds']), 0.03),
                'tolerance 0.05 h: open clocks keep growing between the two reads')
            rp = round(sm['wo_seconds'] / sm['total_seconds'] * 100, 2) if sm['total_seconds'] else None
            rec(name, label, 'Utilization % = TU Utilization %', k['value'], rp, eq(k['value'], rp, 0.02))
            byr = {r['staff_id']: r for r in tu['body']['data']['collection']}
            for p in d['techUtilization']:
                r = byr.get(p['techId'])
                ok = r is not None and eq(p['woHours'], h(r['wo_seconds']), 0.011) and eq(p['internalHours'], h(r['internal_seconds']), 0.011)
                rec(name, label, f'Tech {p["techName"]}: WO / internal hrs = TU row', f'{p["woHours"]}/{p["internalHours"]}',
                    'missing' if r is None else f'{h(r["wo_seconds"])}/{h(r["internal_seconds"])}', ok)
        # ---- Sales by Customer vs SBC report
        sb = load(wid, label, 'sbc')
        if sb:
            dd = sb['body']['data']; tc = d['topCustomers']
            n = dd['pagination']['rowsNumber']
            rec(name, label, 'Sales by Customer count = SBC customer rows', tc['count'], n, tc['count'] == n)
            first = dd['collection'][0]['customer_name'] if dd['collection'] else None
            rec(name, label, 'Sales by Customer top = SBC first by Subtotal', tc['topCustomerName'] if tc['customers'] else None, first,
                (tc['topCustomerName'] if tc['customers'] else None) == first)
            byc = {r['key']: r for r in dd['collection']}
            for c in tc['customers']:
                r = byc.get(c['companyId']) if c['companyId'] else next((x for x in dd['collection'] if not x['key']), None)
                ok = r is not None and r['invoice_count'] == c['invoiceCount'] and eq(c['revenue'], r['subtotal'] / 100) and eq(c['laborDelta'], r['inv_hrs'], 0.011)
                rec(name, label, f'Top customer {c["companyName"]}: invoices / subtotal / labor delta = SBC',
                    f'{c["invoiceCount"]}/{c["revenue"]}/{c["laborDelta"]}', 'missing' if r is None else f'{r["invoice_count"]}/{r["subtotal"]/100}/{r["inv_hrs"]}', ok)

os.makedirs('/tmp/cln/dv/out', exist_ok=True)
json.dump(rows, open('/tmp/cln/dv/out/parity.json', 'w'), indent=0)
print('TOTAL', len(rows), 'PASS', sum(r['result'] == 'PASS' for r in rows), 'FAIL', sum(r['result'] == 'FAIL' for r in rows))
g = collections.defaultdict(list)
for r in rows:
    if r['result'] == 'FAIL':
        key = r['measure'].split(':')[0] if r['measure'].startswith(('Advisor ', 'Tech ', 'Top customer')) else r['measure']
        g[key].append(r)
for k, v in sorted(g.items(), key=lambda x: -len(x[1])):
    print(f'\nFAIL x{len(v)}: {k}')
    for r in v[:5]: print('   ', r['location'][:22], r['range'], '| dash', r['dashboard'], '| report', r['report'], '|', r['measure'][:70])
