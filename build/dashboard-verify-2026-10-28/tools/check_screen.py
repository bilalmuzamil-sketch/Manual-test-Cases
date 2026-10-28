#!/usr/bin/env python3
"""Judge the screen run (screen_check.mjs): requested dates vs PRD preset definitions, on-screen text vs the
server's figures in the PRD's wording, the empty-chart rule, and tile independence. Output: /tmp/cln/dv/out/screen.json"""
import json, glob, re, os, sys, datetime as dt, collections
from zoneinfo import ZoneInfo
sys.path.insert(0, os.path.dirname(__file__))
from collect_dashboard import ranges

LABEL = {'Last 12 Months': 'last_12_months', 'This Year': 'this_year', 'Last Year': 'last_year', 'This Quarter': 'this_quarter',
         'Last Quarter': 'last_quarter', 'This Month': 'this_month', 'Last Month': 'last_month', 'This Week': 'this_week', 'Last Week': 'last_week'}
KEY = {'revenueKpi': 'revenueKpi', 'billingEfficiencyKpi': 'billingEfficiencyKpi', 'techEfficiencyKpi': 'techEfficiencyKpi',
       'techUtilizationKpi': 'techUtilizationKpi', 'salesByCustomer': 'topCustomers', 'atRiskHero': 'atRiskCustomers'}
rows = []


def rec(wp, key, preset, check, ok, detail, prd):
    rows.append({'location': wp, 'tile': key, 'preset': preset, 'check': check, 'result': 'PASS' if ok else 'FAIL', 'detail': detail, 'prd': prd})


def money(x): return ('-' if x < 0 else '') + '$' + f'{abs(x):,.2f}'
def hrs(x): return f'{x:,.2f}'
def pct(x): return f'{x:,.2f}%'


def expect(key, d, data):
    """Return (headline, supporting line, empty_chart_expected) per PRD S4/S5 for the server figures d."""
    if key == 'revenueKpi':
        v = d['value']; inv = data.get('invoicesKpi', {}).get('value')
        if v is not None and v > 0 and d.get('partsPct') is not None:
            line = f'Parts {d["partsPct"]}% · Labor {d["laborPct"]}%' + (f' · Other {d["otherPct"]}%' if d.get('otherPct') else '')
        else:
            line = f'{inv} Invoices'
        sp = d['sparkline']; return money(v), line, sp
    if key == 'billingEfficiencyKpi':
        return ('-' if d['ratio'] is None else pct(round(d['ratio'] * 100, 2))), f'{hrs(d["invoicedHours"])} Invoiced / {hrs(d["clockedHours"])} Clocked', d['sparkline']
    if key == 'techEfficiencyKpi':
        return ('-' if d['value'] is None else pct(d['value'])), f'{hrs(d["hoursBilled"])} Invoiced Tech Hrs / {hrs(d["hoursLogged"])} Clocked', d['sparkline']
    if key == 'techUtilizationKpi':
        return ('-' if d['value'] is None else pct(d['value'])), f'{hrs(d["woHours"])} WO Hrs / {hrs(d["hoursClocked"])} Clocked', d['sparkline']
    if key == 'salesByCustomer':
        n = d['count']; return f'{n} customer' + ('' if n == 1 else 's'), 'Top: ' + (d['topCustomerName'] if d['customers'] else 'None'), d['sparkline']
    if key == 'atRiskHero':
        n = d['count']; tail = d['customers'][0]['companyName'] if n == 1 else f'{n} customers'
        return f'{n}', f'{money(d["revenueTotal12mo"])} (12mo) · {tail}', d['sparkline']


def empty_expected(sp):                                       # S4-R12 / S4-R13
    vals = [x for x in sp if x is not None]
    return len(vals) < 2 or all(x == 0 for x in vals)


for f in sorted(glob.glob('/tmp/cln/dv/out/screen-*.json')) + sorted(glob.glob('/tmp/cln/dv/out/screenrisk-*.json')):
    S = json.load(open(f)); wp = S['workplace']
    risk_file = 'screenrisk-' in f
    if not risk_file: S['steps'] = [x for x in S['steps'] if x['key'] != 'atRiskHero']   # At Risk judged from its own run
    today = dt.datetime.fromisoformat(S['observed_at_utc'].replace('Z', '+00:00')).astimezone(ZoneInfo(S['tz'])).date()
    R = ranges(today)
    # defaults on arrival (S7-R7)
    for k, want in (() if risk_file else (('revenueKpi', 'This Month'), ('billingEfficiencyKpi', 'This Month'), ('techEfficiencyKpi', 'This Month'),
                    ('techUtilizationKpi', 'This Month'), ('salesByCustomer', 'Last 12 Months'))):
        got = (S['initial'][k]['pill'] or '').replace('event', '').replace('expand_more', '').strip()
        rec(wp, k, '(arrival)', 'Tile opens on its default range', got == want, f'shown "{got}", PRD "{want}"', 'S7-R7')
    if risk_file:
        rec(wp, 'atRiskHero', '(arrival)', 'At Risk opens on 120 days', S['initial']['atRiskHero']['pill'] == '120', f"shown {S['initial']['atRiskHero']['pill']} days", 'S5-R11')
    for s in S['steps']:
        key, preset = s['key'], s['preset']
        if s.get('error'):
            rec(wp, key, preset, 'Option can be chosen', False, s['error'], 'S7-R2 / S5-R10'); continue
        want = KEY[key]
        hit = [r for r in s['requests'] if f'reports[]={want}' in r['url'] and r['status'] == 200]
        if not hit:
            rec(wp, key, preset, 'Choosing the option fetches the tile', False, f'{len(s["requests"])} requests, none for {want}', 'S7-R3'); continue
        r = hit[-1]; data = r['body']['data']
        m = dict(re.findall(r'(from|to|group|risk_days)=([^&]+)', r['url']))
        if key != 'atRiskHero':
            ef, et = (x.isoformat() for x in R[LABEL[preset]])
            rec(wp, key, preset, 'Dates asked for = PRD preset', (m.get('from'), m.get('to')) == (ef, et),
                f'asked {m.get("from")}..{m.get("to")}, PRD {ef}..{et}', 'S7-R2 / S4-R11c / S10-R8')
            pill = (s['shown']['pill'] or '').replace('event', '').replace('expand_more', '').strip()
            rec(wp, key, preset, 'Pill shows the chosen preset', pill == preset, f'pill "{pill}"', 'S7-R2')
            rec(wp, key, preset, 'Other tiles unchanged', not s.get('othersChanged'), f'changed: {s.get("othersChanged")}', 'S7-R6')
        else:
            rec(wp, key, preset, 'Window sent = the chosen days', m.get('risk_days') == preset.split()[0], f'risk_days={m.get("risk_days")}', 'S5-R10/S5-R12')
        head, line, sp = expect(key, data[want], data)
        rec(wp, key, preset, 'Headline on screen = server figure (PRD format)', s['shown']['value'] == head, f'screen "{s["shown"]["value"]}" vs expected "{head}"', 'S4-R2/R4/R6/R8, S5-R1/R2/R7, S3-E3')
        rec(wp, key, preset, 'Supporting line on screen = server figure (PRD wording)', s['shown']['meta'] == line, f'screen "{s["shown"]["meta"]}" vs expected "{line}"', 'S4-R3/R5/R7/R9, S4-N2, S5-R3/R8/R9')
        ee = empty_expected(sp)
        rec(wp, key, preset, 'Empty-chart placeholder exactly when PRD says', bool(s['shown']['emptyChart']) == ee and bool(s['shown']['sparkline']) != ee,
            f'placeholder {s["shown"]["emptyChart"]}, line {s["shown"]["sparkline"]}, expected placeholder={ee} ({sum(x is not None for x in sp)} valued points)', 'S4-R12/S4-R13/S5-R16')

json.dump(rows, open('/tmp/cln/dv/out/screen.json', 'w'), indent=0)
print('TOTAL', len(rows), collections.Counter(r['result'] for r in rows))
g = collections.defaultdict(list)
for r in rows:
    if r['result'] == 'FAIL': g[r['check']].append(r)
for k, v in g.items():
    print(f'\nFAIL x{len(v)}: {k}')
    for r in v[:8]: print('   ', r['location'][:22], r['tile'], r['preset'], '|', r['detail'][:180])
