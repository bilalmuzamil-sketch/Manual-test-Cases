#!/usr/bin/env python3
"""WIP layer A — internal consistency against the spec (Confluence 703660034 v28), every row, every tab,
every scope, every as-of day collected. Expected relations come from the spec text (quoted per check id).
Writes results-wip-internal.json (rows) and prints a summary.
"""
import json, os, glob, collections, datetime as dt
from zoneinfo import ZoneInfo

RAW = '/tmp/cln/w1/wip'
OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/reports/W1-labor-wip/results-wip-internal.json'
TABS = ['ApprovedPartiallyCompleted', 'ApprovedNotStarted', 'Completed', 'Estimates']
MONEY = ['labor_earned', 'labor_remaining', 'parts_earned', 'parts_remaining', 'earned', 'remaining', 'adjustments', 'total']
OPEN = {'estimate', 'approved', 'in_progress', 'ready_for_review', 'complete'}
STATUS_TAB = {'estimate': 'Estimates', 'complete': 'Completed', 'in_progress': 'ApprovedPartiallyCompleted',
              'ready_for_review': 'ApprovedPartiallyCompleted'}
res = []


def chk(cid, scope, asof, ok, detail, ref):
    res.append({'check': cid, 'scope': scope, 'asof': asof, 'result': 'PASS' if ok else 'FAIL', 'detail': detail, 'spec': ref})


groups = collections.defaultdict(dict)
for f in glob.glob(f'{RAW}/*/*.json'):
    scope = f.split('/')[-2]
    asof, tab = os.path.basename(f)[:-5].split('__')
    groups[(scope, asof)][tab] = json.load(open(f))

for (scope, asof), tabs in sorted(groups.items()):
    if set(tabs) != set(TABS) or any(t.get('status') != 200 for t in tabs.values()):
        chk('A0-all-tabs-200', scope, asof, False, {t: v.get('status') for t, v in tabs.items()}, '-')
        continue
    first = tabs[TABS[0]]
    if not first.get('has_snapshot', True) and asof < dt.date.today().isoformat():
        chk('A0-no-snapshot', scope, asof, all(len(t['collection']) == 0 for t in tabs.values()),
            {'has_snapshot': False, 'rows': {k: len(v['collection']) for k, v in tabs.items()}}, 'S7-R8a no snapshot -> no rows')
        continue
    tz = first['tz']
    asof_day = dt.date.fromisoformat(first['as_of_date'])
    now_local = dt.datetime.now(ZoneInfo(tz))
    by_wo = collections.defaultdict(list)
    for tab in TABS:
        t = tabs[tab]
        rows = t['collection']
        # tab counts
        chk('A1-tab-count', scope, asof, t['tab_counts'][tab] == len(rows) == t['pagination']['rowsNumber'],
            {'tab': tab, 'tab_counts': t['tab_counts'][tab], 'rows': len(rows)}, 'S1-R4 tab label count')
        chk('A1b-tab-counts-same-in-every-response', scope, asof, t['tab_counts'] == first['tab_counts'], {'tab': tab}, 'S1-R4')
        chk('A1c-summary-same-in-every-response', scope, asof, t['summary'] == first['summary'], {'tab': tab}, 'S5')
        # totals row
        for col in MONEY:
            s = sum(r[col] for r in rows)
            chk('A2-totals-row-' + col, scope, asof, s == t['totals'][col], {'tab': tab, 'sum_rows': s, 'totals': t['totals'][col]}, 'S6-R2')
        sd = round(sum(r['quoted_hours'] - r['worked_hours'] for r in rows), 2)
        chk('A2-totals-row-labor-delta', scope, asof, abs(sd - t['totals']['inv_hours']) < 0.006, {'tab': tab, 'sum': sd, 'totals': t['totals']['inv_hours']}, 'S6-R3')
        for r in rows:
            r['_tab'] = tab
            by_wo[r['work_order_id']].append(r)
            wo = r['number']
            chk('A3-row-tab-field', scope, asof, r['tab'] == tab, {'wo': wo, 'tab': tab, 'row_tab': r['tab']}, '-')
            chk('A3-earned=LE+PE', scope, asof, r['earned'] == r['labor_earned'] + r['parts_earned'], {'wo': wo, 'tab': tab}, 'S4-R19')
            chk('A3-remaining=LR+PR', scope, asof, r['remaining'] == r['labor_remaining'] + r['parts_remaining'], {'wo': wo, 'tab': tab}, 'S4-R20')
            chk('A3-total=E+R+Adj', scope, asof, r['total'] == r['earned'] + r['remaining'] + r['adjustments'], {'wo': wo, 'tab': tab}, 'S4-R21')
            chk('A3-open-status', scope, asof, r['status'] in OPEN, {'wo': wo, 'status': r['status']}, 'S2-R1/S2-R2')
            if tab == 'Completed':
                chk('A4-completed-no-remaining', scope, asof, r['labor_remaining'] == 0 and r['parts_remaining'] == 0,
                    {'wo': wo, 'LR': r['labor_remaining'], 'PR': r['parts_remaining']}, 'S4-R16a/S4-R18a/S4a-R1')
            if tab != 'Estimates':
                exp = STATUS_TAB.get(r['status'])
                if r['status'] == 'approved':
                    ok = tab in ('ApprovedPartiallyCompleted', 'ApprovedNotStarted')
                    if tab == 'ApprovedNotStarted':
                        ok = ok and r['worked_hours'] == 0 and r['labor_earned'] == 0 and r['parts_earned'] == 0
                else:
                    ok = exp == tab
                chk('A5-status-tab-placement', scope, asof, ok, {'wo': wo, 'status': r['status'], 'tab': tab,
                    'worked': r['worked_hours'], 'PE': r['parts_earned']}, 'S3-R1..R4')
            else:
                if r['status'] != 'estimate':
                    chk('A5b-estimates-second-row-no-adjustments', scope, asof, r['adjustments'] == 0, {'wo': wo, 'adj': r['adjustments']}, 'S3-R6')
                chk('A5c-estimates-row-earned-zero', scope, asof, r['earned'] == 0, {'wo': wo, 'earned': r['earned']}, 'S3-R5 (unapproved -> nothing earned)')
            # Days Open: spec S4-R12 = floor(elapsed / 24 h) since created; build note = calendar days
            st = dt.datetime.fromisoformat(r['start_date'].replace('Z', '+00:00')).astimezone(ZoneInfo(tz))
            cal = max(0, (asof_day - st.date()).days)
            ref_instant = now_local if asof_day == now_local.date() else dt.datetime.combine(asof_day, dt.time(23, 59, 59, 999000), ZoneInfo(tz))
            el = max(0, int((ref_instant - st).total_seconds() // 86400))
            r['_days_cal'], r['_days_elapsed'] = cal, el
    # each WO: at most two tabs; estimate-status WOs only in Estimates once; non-estimate twice only with Estimates
    for wid, rs in by_wo.items():
        tabs_of = sorted(x['_tab'] for x in rs)
        st = rs[0]['status']
        if st == 'estimate':
            ok = tabs_of == ['Estimates']
        else:
            ok = len(tabs_of) == 1 or (len(tabs_of) == 2 and 'Estimates' in tabs_of)
        chk('A6-wo-at-most-status-tab-plus-estimates', scope, asof, ok, {'wo': rs[0]['number'], 'status': st, 'tabs': tabs_of}, 'S2-R4/S3-R5')
    # summary strip
    sm = first['summary']
    T = {tab: tabs[tab]['collection'] for tab in TABS}
    exp = {
        'not_started': sum(r['earned'] + r['remaining'] for r in T['ApprovedNotStarted']),
        'started_earned': sum(r['earned'] for r in T['ApprovedPartiallyCompleted']),
        'started_remaining': sum(r['remaining'] for r in T['ApprovedPartiallyCompleted']),
        'ready_to_invoice': sum(r['earned'] for r in T['Completed']),
        'estimates': sum(r['total'] for r in T['Estimates']),
    }
    refs = {'not_started': 'S5-R4', 'started_earned': 'S5-R5', 'started_remaining': 'S5-R6', 'ready_to_invoice': 'S5-R7', 'estimates': 'S5-R8'}
    for k, v in exp.items():
        chk('A7-summary-' + k, scope, asof, sm.get(k) == v, {'api': sm.get(k), 'expected': v}, refs[k])
    # days open tally (observation, compared on screen later)
    allrows = [r for tab in TABS for r in T[tab]]
    diff = [r for r in allrows if r['_days_cal'] != r['_days_elapsed']]
    res.append({'check': 'A8-days-open-calendar-vs-elapsed', 'scope': scope, 'asof': asof, 'result': 'INFO',
                'detail': {'rows': len(allrows), 'differ': len(diff), 'examples': [(r['number'], r['start_date'], r['_days_cal'], r['_days_elapsed']) for r in diff[:5]]},
                'spec': 'S4-R12 elapsed/24h floored'})

json.dump(res, open(OUT, 'w'), indent=0)
tally = collections.Counter((r['check'], r['result']) for r in res)
for (c, rr), n in sorted(tally.items()):
    print(f'{c:50s} {rr:5s} {n}')
fails = [r for r in res if r['result'] == 'FAIL']
print('TOTAL', len(res), 'PASS', sum(r['result'] == 'PASS' for r in res), 'FAIL', len(fails))
for r in fails[:25]:
    print('FAIL', r['check'], r['scope'][:8], r['asof'], json.dumps(r['detail'])[:300])
for r in res:
    if r['check'].startswith('A8'):
        print(r['scope'][:8], r['asof'], r['detail'])
