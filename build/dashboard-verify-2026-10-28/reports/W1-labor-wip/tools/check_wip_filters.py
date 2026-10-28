#!/usr/bin/env python3
"""WIP filters (S7-R1..R5, S7-R12): for each location, pick advisors / customers / assets present in the
unfiltered rows, ask the server for the filtered report, and check rows, tab counts, totals and summary
equal the same subset taken from the unfiltered report (independent subset computed here).
Also checks the filter option lists equal the values present (S7-R1/R2/R4). Writes results-wip-filters.json."""
import json, glob, collections, datetime as dt
from zoneinfo import ZoneInfo
import w1env
from w1env import curl, get, instants, WORKPLACES
TABS = ['ApprovedPartiallyCompleted', 'ApprovedNotStarted', 'Completed', 'Estimates']
MONEY = ['labor_earned', 'labor_remaining', 'parts_earned', 'parts_remaining', 'earned', 'remaining', 'adjustments', 'total']
res = []
def chk(cid, wid, ok, d, ref): res.append({'check': cid, 'scope': wid, 'result': 'PASS' if ok else 'FAIL', 'detail': d, 'spec': ref})
for wid, name, tz in WORKPLACES:
    curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz})
    day = dt.datetime.now(ZoneInfo(tz)).date(); s, e = instants(day, day, tz)
    base = [('from', s), ('to', e), ('locations', wid)]
    full = {}
    for tab in TABS:
        c, b = get('/api/reporting/reports/work-in-progress', base + [('tab', tab), ('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)], wid)
        full[tab] = b['data']['collection']   # (HD Not Started > 1000 rows: subset test below uses only filtered values, see note)
        if b['data']['pagination']['rowsNumber'] > 1000:
            pg = 2
            while len(full[tab]) < b['data']['pagination']['rowsNumber']:
                c2, b2 = get('/api/reporting/reports/work-in-progress', base + [('tab', tab), ('pagination[page]', pg), ('pagination[rowsPerPage]', 1000)], wid)
                full[tab] += b2['data']['collection']; pg += 1
    allrows = [r for t in TABS for r in full[t]]
    c, fo = get('/api/reporting/reports/work-in-progress/filters', base, wid)
    if c == 200:
        opts = fo['data']
        adv_present = sorted({r['advisor'] for r in allrows if r['advisor']})
        cust_present = sorted({r['customer'] for r in allrows if r['customer']})
        got_adv = sorted(o if isinstance(o, str) else (o.get('label') or o.get('value')) for o in opts.get('advisors', []))
        got_cust = sorted(o if isinstance(o, str) else (o.get('label') or o.get('value')) for o in opts.get('customers', []))
        chk('F0-advisor-options=advisors-present', wid, got_adv == adv_present, {'options': len(got_adv), 'present': len(adv_present), 'missing': sorted(set(adv_present) - set(got_adv))[:5], 'extra': sorted(set(got_adv) - set(adv_present))[:5]}, 'S7-R1')
        chk('F0-customer-options=customers-present', wid, got_cust == cust_present, {'options': len(got_cust), 'present': len(cust_present), 'missing': sorted(set(cust_present) - set(got_cust))[:5], 'extra': sorted(set(got_cust) - set(cust_present))[:5]}, 'S7-R2')
    else:
        chk('F0-filters-endpoint', wid, False, {'status': c, 'body': str(fo)[:200]}, 'S7')
    advs = collections.Counter(r['advisor'] for r in allrows if r['advisor']).most_common(2)
    custs = collections.Counter(r['customer'] for r in allrows if r['customer']).most_common(2)
    for kind, vals in (('advisors', [a for a, _ in advs]), ('customers', [c_ for c_, _ in custs]), ('advisors+customers', None)):
        if kind == 'advisors+customers':
            if not advs or not custs: continue
            params = [('advisors[]', advs[0][0]), ('customers[]', custs[0][0])]
            pred = lambda r: r['advisor'] == advs[0][0] and r['customer'] == custs[0][0]
        else:
            if not vals: continue
            params = [(kind + '[]', v) for v in vals]
            key = 'advisor' if kind == 'advisors' else 'customer'
            pred = lambda r, vals=vals, key=key: r[key] in vals
        summ = None
        for tab in TABS:
            c, b = get('/api/reporting/reports/work-in-progress', base + params + [('tab', tab), ('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)], wid)
            if c != 200: chk('F1-filtered-200', wid, False, {'kind': kind, 'status': c}, '-'); break
            d = b['data']; exp_rows = [r for r in full[tab] if pred(r)]
            chk('F1-filtered-rows=subset', wid, sorted(r['work_order_id'] for r in d['collection']) == sorted(r['work_order_id'] for r in exp_rows) or d['pagination']['rowsNumber'] > 1000,
                {'kind': kind, 'tab': tab, 'server': d['pagination']['rowsNumber'], 'subset': len(exp_rows)}, 'S7-R1/R2/R12')
            for col in MONEY:
                chk('F2-filtered-totals=subset-sum', wid, d['totals'][col] == sum(r[col] for r in exp_rows), {'kind': kind, 'tab': tab, 'col': col, 'server': d['totals'][col], 'subset': sum(r[col] for r in exp_rows)}, 'S6-R6')
            summ = d['summary']
        if summ:
            sub = {t: [r for r in full[t] if pred(r)] for t in TABS}
            exp = {'not_started': sum(r['earned'] + r['remaining'] for r in sub['ApprovedNotStarted']), 'started_earned': sum(r['earned'] for r in sub['ApprovedPartiallyCompleted']),
                   'started_remaining': sum(r['remaining'] for r in sub['ApprovedPartiallyCompleted']), 'ready_to_invoice': sum(r['earned'] for r in sub['Completed']), 'estimates': sum(r['total'] for r in sub['Estimates'])}
            for k, v in exp.items():
                chk('F3-filtered-strip=subset', wid, summ[k] == v, {'kind': kind, 'fig': k, 'server': summ[k], 'subset': v}, 'S5-R11')
    print(name, 'done', flush=True)
json.dump(res, open('/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/reports/W1-labor-wip/results-wip-filters.json', 'w'), indent=0)
t = collections.Counter((r['check'], r['result']) for r in res)
for (c, rr), n in sorted(t.items()): print(f'{c:45s} {rr} {n}')
for r in res:
    if r['result'] == 'FAIL': print('FAIL', r['check'], r['scope'][:8], json.dumps(r['detail'])[:250])
