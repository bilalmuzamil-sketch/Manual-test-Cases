#!/usr/bin/env python3
"""WIP layer C — independent recompute of every WIP row (as-of TODAY, every location) from RAW work-order
records (GET /api/work-orders/lines/{id} + /api/work-orders/view/{id}), using the spec's definitions
(Confluence 703660034 v28):
  approved line      = line status authorized | complete                          (§4 Terminology)
  Labor Earned       = per approved line min(clocked, quoted)/quoted x line labor value;
                       quoted 0 -> full value once the line is complete             (S4-R15, §3 fixed-price)
  Completed tab      = full approved value earned, Remaining 0                    (S4-R15a/R16a/R18a)
  Parts Earned       = sell (+core) value of approved-line parts already received (S4-R17)
  Parts Remaining    = sell (+core) value of approved-line parts ordered, not yet received (S4-R18)
  Fixed line total   = valued at its fixed labor/part portions, earned on completion (§3)
  Adjustments        = signed WO-level fee/discount net, status-tab row only     (S4-R29, S3-R6)
  Estimates row      = value of unapproved lines only                              (S3-R5, SV-9027 ruling)
  Labor Delta        = quoted hours - clocked hours on approved lines              (S4-R23)
Ambiguous inputs are COUNTED separately and every mismatching row is tagged with the features it has,
so a mismatch can be traced to a spec gap rather than guessed.
"""
import json, os, glob, collections, datetime as dt

RAW = '/tmp/cln/w1'
OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/reports/W1-labor-wip/results-wip-oracle.json'
COMMITTED = {'authorized_to_order', 'waiting_to_receive'}
AMBIG = {'in_stock', 'requested', 'quoted', 'received_later'}
NOW = dt.datetime.now(dt.timezone.utc).timestamp()


def money(x):
    return float(str(x).replace(',', '')) if x not in (None, '') else 0.0


def ts(v):
    return v['timestamp'] if isinstance(v, dict) and v else None


def line_clock_hours(l):
    tot, open_ = 0.0, False
    trs = l.get('task_records') or []
    trs = list(trs.values()) if isinstance(trs, dict) else trs
    for t in trs:
        s, e = ts(t.get('start_date')), ts(t.get('end_date'))
        if s is None:
            continue
        if e is None:
            e, open_ = NOW, True
        tot += (e - s) / 3600
    return tot, open_


def part_value(p, qty_key='quantity'):
    return (money(p.get('sell_price')) + money(p.get('core_charge'))) * float(p.get(qty_key) or 0)


def compute(lines, view, status):
    f = collections.Counter()
    ap = {'le': 0.0, 'lq': 0.0, 'pe': 0.0, 'pr': 0.0, 'qh': 0.0, 'wh': 0.0, 'fixed_parts_q': 0.0, 'fixed_parts_e': 0.0}
    un = {'labor': 0.0, 'parts': 0.0, 'qh': 0.0, 'n': 0}
    received_any = False
    for l in lines:
        st = l['status']
        if st == 'authorization_declined':
            continue
        lv = money(l['total_labour_cost'])
        qh = (l['time_estimate'] or 0) / 60
        ch, op = line_clock_hours(l)
        if op: f['open_clock'] += 1
        if l.get('adjustments'): f['line_adjustment'] += 1
        if any(p.get('adjustments') for p in l['parts'] + l['part_requests']): f['part_adjustment'] += 1
        fixed_total = l.get('fixed_line_total') is not None
        if l.get('fixed_price') is not None: f['fixed_price'] += 1
        if fixed_total: f['fixed_line_total'] += 1
        parts = [p for p in l['parts'] if not p.get('is_core')]
        reqs = [p for p in l['part_requests'] if not p.get('is_core')]
        if st in ('authorized', 'complete'):
            ap['lq'] += lv; ap['qh'] += qh; ap['wh'] += ch
            if ch > 0: received_any = received_any  # clocked time handled by worked hours
            if qh > 0:
                ap['le'] += min(ch, qh) / qh * lv
            elif st == 'complete':
                ap['le'] += lv
            if fixed_total:
                pp = money(l['total_parts_sell_price'])
                ap['fixed_parts_q'] += pp
                if st == 'complete':
                    ap['fixed_parts_e'] += pp
            else:
                for p in parts:
                    ap['pe'] += part_value(p); received_any = True
                for r in reqs:
                    if r['status'] in COMMITTED:
                        ap['pr'] += part_value(r)
                    elif r['status'] in AMBIG:
                        f['req_' + r['status']] += 1
                        ap.setdefault('amb_' + r['status'], 0.0)
                        ap['amb_' + r['status']] += part_value(r)
        else:  # unapproved (authorization_required)
            un['n'] += 1
            un['labor'] += lv; un['qh'] += qh
            if fixed_total:
                un['parts'] += money(l['total_parts_sell_price'])
            else:
                un['parts'] += sum(part_value(p) for p in parts) + sum(part_value(r) for r in reqs if r['status'] != 'returned')
    adj = money((view.get('adjustmentsSummary') or {}).get('netAmount'))
    return ap, un, adj, received_any, f


def main():
    rows_by_wo = collections.defaultdict(list)
    for f in glob.glob(f'{RAW}/wip/*/*.json'):
        if '/ALL/' in f:
            continue
        d = json.load(open(f))
        if d['asof'] != max(os.path.basename(x)[:10] for x in glob.glob(os.path.dirname(f) + '/*.json')):
            continue
        for r in d['collection']:
            rows_by_wo[r['work_order_id']].append(r)
    res, missing = [], 0
    tally = collections.Counter()
    for wo, rows in rows_by_wo.items():
        pl, pv = f'{RAW}/wol/{wo}.json', f'{RAW}/wov/{wo}.json'
        if not (os.path.exists(pl) and os.path.exists(pv)):
            missing += 1
            continue
        lines = json.load(open(pl))['data']['collection']
        view = json.load(open(pv))['data']['work_order']
        status = view['status_value']
        ap, un, adj, received_any, feats = compute(lines, view, status)
        for r in rows:
            tab = r['tab']
            if tab == 'Estimates' and status != 'estimate':
                exp = {'labor_earned': 0, 'labor_remaining': un['labor'], 'parts_earned': 0, 'parts_remaining': un['parts'],
                       'adjustments': 0, 'quoted_hours': un['qh'], 'worked_hours': 0}
            elif tab == 'Estimates':
                # estimate-status WO: whole quote is one Estimates row (S3-R5 exception); adjustments included (S5-R8)
                exp = {'labor_earned': 0, 'labor_remaining': un['labor'] + ap['lq'], 'parts_earned': 0,
                       'parts_remaining': un['parts'] + ap['pe'] + ap['pr'] + ap['fixed_parts_q'], 'adjustments': adj,
                       'quoted_hours': un['qh'] + ap['qh'], 'worked_hours': None}
            elif tab == 'Completed':
                pe_all = ap['pe'] + ap['pr'] + ap['fixed_parts_q'] + sum(v for k, v in ap.items() if k.startswith('amb_in_stock'))
                exp = {'labor_earned': ap['lq'], 'labor_remaining': 0, 'parts_earned': pe_all, 'parts_remaining': 0,
                       'adjustments': adj, 'quoted_hours': ap['qh'], 'worked_hours': ap['wh']}
            else:
                exp = {'labor_earned': ap['le'], 'labor_remaining': ap['lq'] - ap['le'], 'parts_earned': ap['pe'] + ap['fixed_parts_e'],
                       'parts_remaining': ap['pr'] + ap['fixed_parts_q'] - ap['fixed_parts_e'] + ap.get('amb_in_stock', 0.0),
                       'adjustments': adj, 'quoted_hours': ap['qh'], 'worked_hours': ap['wh']}
            diffs = {}
            for k, v in exp.items():
                if v is None:
                    continue
                got = r[k] / 100 if k not in ('quoted_hours', 'worked_hours') else r[k]
                tol = 0.011 if k not in ('quoted_hours', 'worked_hours') else 0.011 + (0.05 if feats['open_clock'] else 0)
                if abs(got - v) > tol:
                    diffs[k] = {'report': round(got, 2), 'oracle': round(v, 2)}
            # tab placement for approved status (S3-R4)
            if status == 'approved' and tab != 'Estimates':
                started = ap['wh'] > 0 or received_any
                want = 'ApprovedPartiallyCompleted' if started else 'ApprovedNotStarted'
                if want != tab:
                    diffs['tab'] = {'report': tab, 'oracle': want}
            # Estimates second row exists only if unapproved lines exist (S3-R5)
            ok = not diffs
            key = tuple(sorted(k for k, v in feats.items() if v)) if not ok else ()
            tally[('PASS' if ok else 'FAIL', tab, key)] += 1
            res.append({'wo': r['number'], 'wo_id': wo, 'location': r['location'], 'status': status, 'tab': tab,
                        'result': 'PASS' if ok else 'FAIL', 'diffs': diffs, 'features': dict(feats)})
        # every WO with unapproved lines and a non-estimate status should have an Estimates row (S3-R5)
        tabs = {x['tab'] for x in rows}
        if status != 'estimate' and un['n'] > 0 and (un['labor'] + un['parts']) != 0:
            ok = 'Estimates' in tabs
            tally[('PASS' if ok else 'FAIL', 'S3-R5-has-estimates-row', ())] += 1
            if not ok:
                res.append({'wo': rows[0]['number'], 'wo_id': wo, 'status': status, 'tab': 'missing Estimates row',
                            'result': 'FAIL', 'diffs': {'unapproved_value': un['labor'] + un['parts']}, 'features': dict(feats)})
    json.dump({'missing_raw': missing, 'rows': res}, open(OUT, 'w'), indent=0)
    print('WOs', len(rows_by_wo), 'missing raw', missing, 'rows checked', len(res))
    for (r, tab, key), n in sorted(tally.items(), key=lambda x: (-x[1])):
        print(f'{r} {tab:28s} {n:5d} {key}')
    fails = [x for x in res if x['result'] == 'FAIL']
    print('FAIL rows', len(fails))
    for x in fails[:40]:
        print(x['wo'], x['location'][:12] if x.get('location') else '', x['status'], x['tab'], json.dumps(x['diffs']), {k: v for k, v in x['features'].items() if v})


if __name__ == '__main__':
    main()
