#!/usr/bin/env python3
"""Layer A — every dashboard response must agree with itself and with the PRD's structural rules.

Reads /tmp/cln/dv/raw (collect_dashboard.py). Writes check rows to stdout as JSON lines and a summary.
Each check names the PRD requirement it enforces (Dashboard PRD v53, read 2026-10-28).
"""
import json, os, glob, datetime as dt, collections

RAW = '/tmp/cln/dv/raw'
idx = json.load(open(os.path.join(RAW, 'index.json')))
rows = []


def rec(wp, rng, check, ok, detail, req):
    rows.append({'location': wp, 'range': rng, 'check': check, 'result': 'PASS' if ok else 'FAIL',
                 'detail': detail, 'prd': req})


def exp_unit(days):                                           # S4-R11 / S4-R11c
    return 'day' if days <= 31 else 'week' if days <= 182 else 'month' if days <= 731 else 'quarter'


def buckets(f, t, unit):                                      # bucket start dates, rolling weeks (code note)
    out, cur = [], f
    while cur <= t:
        out.append(cur)
        if unit == 'day': cur += dt.timedelta(days=1)
        elif unit == 'week': cur += dt.timedelta(days=7)
        elif unit == 'month': cur = (cur.replace(day=1) + dt.timedelta(days=32)).replace(day=1)
        else:
            m = ((cur.month - 1) // 3 + 1) * 3 + 1
            cur = dt.date(cur.year + (m > 12), (m - 1) % 12 + 1, 1)
    return out


def r2(x): return None if x is None else round(x + 1e-9, 2)


for w in idx['workplaces']:
    name = w['name']
    for label, meta in w['ranges'].items():
        if label.startswith('atrisk'):
            continue
        j = json.load(open(os.path.join(RAW, w['id'], label + '.json')))
        f, t = dt.date.fromisoformat(j['from']), dt.date.fromisoformat(j['to'])
        days = (t - f).days + 1
        if label == 'custom_367d':
            rec(name, label, 'Range over 366 days is refused', j['status'] == 400,
                f'{days}-day range answered HTTP {j["status"]}', 'S7-R2a "a custom range of up to 366 days, the same limit the reports apply"')
            continue
        if j['status'] != 200:
            rec(name, label, 'Request answered', False, f'HTTP {j["status"]}', 'S3-R1'); continue
        d = j['body']['data']
        unit = exp_unit(days)
        rec(name, label, 'Bucket size follows range length', d['group'] == unit,
            f'{days} days -> got {d["group"]}, expected {unit}', 'S4-R11/S4-R11c')
        nb = len(buckets(f, t, unit))
        for k, sp in (('revenueKpi', d['revenueKpi']['sparkline']), ('billingEfficiencyKpi', d['billingEfficiencyKpi']['sparkline']),
                      ('techEfficiencyKpi', d['techEfficiencyKpi']['sparkline']), ('techUtilizationKpi', d['techUtilizationKpi']['sparkline']),
                      ('topCustomers', d['topCustomers']['sparkline'])):
            rec(name, label, f'{k} sparkline has one point per bucket', len(sp) == nb, f'{len(sp)} points, {nb} buckets', 'S4-R11')
        # Revenue
        rv = d['revenueKpi']
        rec(name, label, 'Revenue sparkline points add up to the headline', abs(sum(rv['sparkline']) - rv['value']) < 0.005,
            f'sum {sum(rv["sparkline"]):.2f} vs headline {rv["value"]:.2f}', 'S4-R11 "a point can never disagree with the tile"')
        ser = sum(b['revenue'] for b in d['revenueSeries'])
        rec(name, label, 'Revenue chart bars add up to the headline', abs(ser - rv['value']) < 0.005,
            f'bars {ser:.2f} vs headline {rv["value"]:.2f}', 'S6-R3a / S7-R5')
        if rv['value'] > 0:
            s = (rv['partsPct'] or 0) + (rv['laborPct'] or 0) + (rv['otherPct'] or 0)
            rec(name, label, 'Parts + Labor + Other = 100', s == 100, f'{rv["partsPct"]}+{rv["laborPct"]}+{rv["otherPct"]}={s}', 'S4-R3')
        inv = sum(b['invoiceCount'] for b in d['revenueSeries'])
        rec(name, label, 'Invoice count equals chart invoice counts', inv == d['invoicesKpi']['value'],
            f'chart {inv} vs tile {d["invoicesKpi"]["value"]}', 'S4-N2')
        # Billing Efficiency
        be = d['billingEfficiencyKpi']
        if be['clockedHours']:
            exp = be['invoicedHours'] / be['clockedHours']
            rec(name, label, 'Billing Efficiency = invoiced / clocked', abs(be['ratio'] - exp) < 0.00006,
                f'ratio {be["ratio"]} vs {be["invoicedHours"]}/{be["clockedHours"]}={exp:.4f}', 'S3-R2')
        else:
            rec(name, label, 'Billing Efficiency has no value with no clocked hours', be['ratio'] is None,
                f'ratio {be["ratio"]} with 0 clocked', 'S3-E3')
        adv = d['billingEfficiencyByAdvisor']
        sa_b = r2(sum(a['billedHours'] for a in adv)); sa_a = r2(sum(a['actualHours'] for a in adv))
        rec(name, label, 'Advisor table hours add up to the Billing Efficiency tile',
            abs(sa_b - be['invoicedHours']) < 0.011 and abs(sa_a - be['clockedHours']) < 0.011,
            f'table {sa_b}/{sa_a} vs tile {be["invoicedHours"]}/{be["clockedHours"]}', 'S6 table + S3-R1')
        for a in adv:
            if a['actualHours']:
                e = round(a['billedHours'] / a['actualHours'] * 100, 2)
                if abs(e - a['efficiencyPct']) > 0.011:
                    rec(name, label, 'Advisor row efficiency = billed / worked', False, f'{a["advisorName"]}: {a["efficiencyPct"]} vs {e}', 'S3-R2')
                if a['elr'] is not None and abs(round(a['laborSales'] / a['actualHours'], 2) - a['elr']) > 0.011:
                    rec(name, label, 'Advisor ELR = labor sales / worked hours', False,
                        f'{a["advisorName"]}: {a["elr"]} vs {a["laborSales"]}/{a["actualHours"]}', 'S3-R2 ELR')
        # Technician Efficiency
        te = d['techEfficiencyKpi']
        if te['hoursLogged']:
            e = round(te['hoursBilled'] / te['hoursLogged'] * 100, 2)
            rec(name, label, 'Technician Efficiency = tech hours / clocked', abs(e - te['value']) < 0.011,
                f'{te["value"]} vs {te["hoursBilled"]}/{te["hoursLogged"]}={e}', 'S3-R2')
        else:
            rec(name, label, 'Technician Efficiency has no value with no clocked hours', te['value'] is None, f'value {te["value"]}', 'S3-E3')
        tp = d['techPerformance']
        rec(name, label, 'Technician table adds up to the Technician Efficiency tile',
            abs(r2(sum(x['hoursBilled'] for x in tp)) - te['hoursBilled']) < 0.011 and abs(r2(sum(x['hoursLogged'] for x in tp)) - te['hoursLogged']) < 0.011,
            f'table {r2(sum(x["hoursBilled"] for x in tp))}/{r2(sum(x["hoursLogged"] for x in tp))} vs tile {te["hoursBilled"]}/{te["hoursLogged"]}', 'S3-R1')
        # Technician Utilization
        tu = d['techUtilizationKpi']; tt = d['techUtilization']
        wo, internal, total = (r2(sum(x[k] for x in tt)) for k in ('woHours', 'internalHours', 'totalHours'))
        if tu['hoursClocked']:
            e = round(tu['woHours'] / tu['hoursClocked'] * 100, 2)
            rec(name, label, 'Utilization headline = WO hrs / clocked (as displayed)', abs(e - tu['value']) < 0.011,
                f'{tu["value"]} vs {tu["woHours"]}/{tu["hoursClocked"]}', 'S4-R9')
            if wo + internal:
                prd = round(wo / (wo + internal) * 100, 2)
                rec(name, label, 'Utilization = WO / (WO + Internal) per PRD', abs(prd - tu['value']) < 0.02,
                    f'tile {tu["value"]}% vs PRD formula {wo}/({wo}+{internal})={prd}%; clocked {tu["hoursClocked"]} vs WO+Internal {r2(wo+internal)}',
                    'S3-R2 "Work-order hours divided by the sum of work-order hours and internal hours"')
        else:
            rec(name, label, 'Utilization has no value with no clocked hours', tu['value'] is None, f'value {tu["value"]}', 'S3-E3')
        rec(name, label, 'Utilization table adds up to the tile', abs(wo - tu['woHours']) < 0.02 and abs(total - tu['hoursClocked']) < 0.02,
            f'table WO {wo} / total {total} vs tile {tu["woHours"]} / {tu["hoursClocked"]}', 'S3-R1')
        bad = [x['techName'] for x in tt if abs(x['woHours'] + x['internalHours'] - x['totalHours']) > 0.011]
        if bad:
            rec(name, label, 'Each technician: WO + Internal = Total', False, f'{len(bad)} technicians differ, e.g. {bad[:3]}', 'S3-R2 / S4-R9')
        # Sales by Customer
        tc = d['topCustomers']
        rec(name, label, 'Sales by Customer top name = first row', (tc['customers'][0]['companyName'] if tc['customers'] else None) == (tc['topCustomerName'] if tc['customers'] else None),
            f'top {tc["topCustomerName"]}', 'S5-R3')
        rec(name, label, 'Sales by Customer last point = never above headline', (max(tc['sparkline']) if tc['sparkline'] else 0) <= tc['count'],
            f'max point {max(tc["sparkline"]) if tc["sparkline"] else 0} vs headline {tc["count"]}', 'S5-R5')
    # At Risk
    prev = None
    for rd in (30, 60, 90, 120, 180):
        j = json.load(open(os.path.join(RAW, w['id'], f'atrisk_{rd}.json')))
        a = j['body']['data']['atRiskCustomers']
        rec(name, f'atrisk_{rd}', 'At Risk has 12 monthly points, last = headline', len(a['sparkline']) == 12 and a['sparkline'][-1] == a['count'],
            f'{len(a["sparkline"])} points, last {a["sparkline"][-1] if a["sparkline"] else None}, headline {a["count"]}', 'S5-R13')
        rec(name, f'atrisk_{rd}', 'At Risk revenue line = sum of customers', abs(sum(c['revenueLast12mo'] for c in a['customers']) - a['revenueTotal12mo']) < 0.01 or len(a['customers']) >= 500,
            f'sum {sum(c["revenueLast12mo"] for c in a["customers"]):.2f} vs {a["revenueTotal12mo"]}', 'S5-R9')
        badc = [c['companyName'] for c in a['customers'] if c['daysSinceLastInvoice'] < rd or not (c['lifetimeInvoiceCount'] >= 2 or c['revenueLast12mo'] > 0)]
        rec(name, f'atrisk_{rd}', 'Every listed customer meets the at-risk test', not badc, f'{len(badc)} fail, e.g. {badc[:3]}', 'S3-R2 / S5-R15')
        if prev is not None:
            rec(name, f'atrisk_{rd}', 'A longer window never adds customers', a['count'] <= prev, f'{a["count"]} vs previous {prev}', 'S3-R2 definition')
        prev = a['count']

os.makedirs('/tmp/cln/dv/out', exist_ok=True)
json.dump(rows, open('/tmp/cln/dv/out/internal.json', 'w'), indent=0)
c = collections.Counter((r['check'], r['result']) for r in rows)
fails = collections.defaultdict(list)
for r in rows:
    if r['result'] == 'FAIL': fails[r['check']].append(r)
print('TOTAL', len(rows), 'PASS', sum(1 for r in rows if r['result'] == 'PASS'), 'FAIL', sum(1 for r in rows if r['result'] == 'FAIL'))
for k, v in fails.items():
    print(f'\nFAIL x{len(v)}: {k}  [{v[0]["prd"][:90]}]')
    for r in v[:6]: print('   ', r['location'], r['range'], '|', r['detail'][:200])
