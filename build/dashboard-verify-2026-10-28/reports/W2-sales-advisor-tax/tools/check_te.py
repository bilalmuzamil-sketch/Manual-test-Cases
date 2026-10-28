#!/usr/bin/env python3
"""Technician Efficiency, BOTH tabs, every range x location: technician rows, line rows, Hrs Profit,
Efficiency (incl. the 0.01-hour rule), the Invoiced-tab population (SV-2115) and the Completed-tab rules
(SV-5450), recomputed from the work-order lines record with clock records (GET /api/work-orders/lines/{wo})
and the invoice records. Output ../results-te.json. SECRET-FREE."""
import json, os, sys, collections, datetime as dt
from zoneinfo import ZoneInfo
sys.path.insert(0, os.path.dirname(__file__))
from common import *
from records import wo_lines, prefetch, invoice
OUTF = os.path.join('/tmp/cln/w2/full', 'results-te.json')
rows = []
def add(loc, rng, tab, check, ok, detail, src, level='line', key=''):
    rows.append({'report': f'Technician Efficiency ({tab})', 'location': loc, 'range': rng, 'level': level, 'key': key, 'check': check,
                 'result': ok if isinstance(ok, str) else ('PASS' if ok else 'FAIL'), 'detail': detail, 'source': src})
def eff(t, c): return 0 if (t < 0.01 or c < 0.01) else round(t / c * 100, 2)
for wid, name, tz in WORKPLACES:
    d = os.path.join(RAW, wid)
    if not os.path.exists(os.path.join(d, 'te_cmp__this_month.json')): continue
    z = ZoneInfo(tz)
    data = {}
    for lab in ranges(dt.date(2026, 10, 28)):
        for tab in ('inv', 'cmp'):
            p = os.path.join(d, f'te_{tab}__{lab}.json')
            if os.path.exists(p): data[(tab, lab)] = json.load(open(p))
    wos = sorted({l['workOrderId'] for j in data.values() if j['xstatus'] == 200 for t in j['expanded']['data']['collection'] for l in t['lines']})
    wl = dict(zip(wos, prefetch([(w, wid) for w in wos], wo_lines)))
    for (tab, lab), j in data.items():
        T = 'Invoiced' if tab == 'inv' else 'Completed'
        src = 'SV-2115' if tab == 'inv' else 'SV-5450'
        thk = 'technicianTechHours' if tab == 'inv' else 'technicianCompletedTechHours'
        lhk = 'invoicedTechTime' if tab == 'inv' else 'completedTechTime'
        if j['status'] != 200 or j['xstatus'] != 200:
            add(name, lab, T, 'Report loads', False, f'HTTP {j["status"]}/{j["xstatus"]}', '', 'range'); continue
        summ = {t['technicianId']: t for t in j['summary']['data']['collection']}
        exp = {t['technicianId']: t for t in j['expanded']['data']['collection']}
        add(name, lab, T, 'Summary technicians = expanded technicians, same figures', set(summ) == set(exp) and all(abs(summ[k]['technicianClockedHours'] - exp[k]['technicianClockedHours']) < 0.006 and abs(summ[k][thk] - exp[k][thk]) < 0.006 for k in summ), f'{len(summ)} techs', src, 'range')
        f, t = j['from'], j['to']
        for tid, tech in exp.items():
            ls = tech['lines']
            sc = round(sum(l['clockedTime'] for l in ls), 2); st = round(sum(l[lhk] for l in ls), 2)
            add(name, lab, T, 'Technician Clocked Hrs and Tech Hrs = sum of the technician\'s line rows', abs(sc - tech['technicianClockedHours']) < 0.011 and abs(st - tech[thk]) < 0.011, f'{tech["technician"]} {tech["technicianClockedHours"]}/{sc} {tech[thk]}/{st}', src, 'tech', tid)
            add(name, lab, T, 'Technician Hrs Profit = Tech Hrs - Clocked Hrs', abs(tech['technicianHoursProfit'] - round(tech[thk] - tech['technicianClockedHours'], 2)) < 0.011, f'{tech["technician"]} {tech["technicianHoursProfit"]}', src, 'tech', tid)
            add(name, lab, T, 'Technician Efficiency = Tech Hrs / Clocked Hrs x 100 (0 when either is under 0.01)', abs(tech['technicianTechEfficiency'] - eff(tech[thk], tech['technicianClockedHours'])) < 0.011, f'{tech["technician"]} {tech["technicianTechEfficiency"]} vs {eff(tech[thk], tech["technicianClockedHours"])}', src, 'tech', tid,)
            for l in ls:
                num = l.get('invoiceDisplayNumber') or l.get('workOrderDisplayNumber')
                dk = 'invoiceDate' if tab == 'inv' else 'completedDate'
                ld = dt.datetime.fromisoformat(l[dk]).replace(tzinfo=dt.timezone.utc).astimezone(z).date().isoformat()
                add(name, lab, T, f'{"Invoice" if tab=="inv" else "Completed"} date inside the chosen dates (location time zone)', f <= ld <= t, f'{num} {l[dk]} -> {ld} vs {f}..{t}', src + (' "Always use the location timezone"' if tab == 'cmp' else ''))
                lines = wl.get(l['workOrderId']) or []
                L = [x for x in lines if x['line_id'] == l['lineId']]
                if not L:
                    add(name, lab, T, 'Line exists on the work order', False, f'{num} line {l["lineName"]}', src); continue
                L = L[0]
                mins = collections.Counter()
                for rec in (L['task_records'].values() if isinstance(L['task_records'], dict) else L['task_records']):
                    end = rec['end_date']['timestamp'] if rec.get('end_date') else dt.datetime.now(dt.timezone.utc).timestamp()
                    mins[rec['staff_id']] += (end - rec['start_date']['timestamp']) / 60
                mine = mins.get(tid, 0); tot = sum(mins.values())
                add(name, lab, T, 'Clocked Hrs on the line = the technician\'s clock records on that line', abs(l['clockedTime'] - round(mine / 60, 2)) <= 0.011 + (0.05 if any(not r.get('end_date') for r in (L['task_records'].values() if isinstance(L['task_records'], dict) else L['task_records'])) else 0), f'{num} {L["line_name"]} {l["clockedTime"]} vs {round(mine/60,2)}', src)
                share = round(mine / tot * (L['tech_time'] or 0) / 60, 2) if tot else 0
                add(name, lab, T, 'Tech Hrs = the technician\'s share of the line\'s tech time (share of clocked time)', abs(l[lhk] - share) <= 0.011, f'{num} {L["line_name"]} {l[lhk]} vs {share} (tech_time {L["tech_time"]} min, mine {round(mine,1)} of {round(tot,1)} min)', 'SV-5450 "allocated proportionally"')
                add(name, lab, T, 'Line Efficiency and Hrs Profit follow from the line\'s hours', abs(l['techEfficiency'] - eff(l[lhk], l['clockedTime'])) < 0.011 and abs(l['lineHoursProfit'] - round(l[lhk] - l['clockedTime'], 2)) < 0.011, f'{num} eff {l["techEfficiency"]} vs {eff(l[lhk], l["clockedTime"])}', src)
                add(name, lab, T, 'Line is not a declined line', L['status'] != 'authorization_declined', f'{num} {L["line_name"]} status {L["status"]}', 'SV-2115 / dashboard F2' if tab == 'inv' else 'SV-5450 "only if Labor line status = Completed"', key='declined' if L['status'] == 'authorization_declined' else '')
                if tab == 'cmp':
                    add(name, lab, T, 'Completed tab lists only lines whose status is Complete', L['status'] == 'complete', f'{num} {L["line_name"]} status {L["status"]}', 'SV-5450 Inclusion Rules')
                    add(name, lab, T, 'Completed tab: the technician has clocked time on the line', mine > 0, f'{num} {tid[:8]} {round(mine,2)} min', 'SV-5450 "Tech has clocked time on that line"')
    for p in ('last_12_months', 'this_year', 'last_year', 'this_quarter', 'last_quarter', 'this_month', 'last_month', 'this_week', 'last_week'):
        for tab in ('inv', 'cmp'):
            pp = os.path.join(d, f'te_{tab}_preset__{p}.json')
            if not os.path.exists(pp) or (tab, p) not in data: continue
            a = json.load(open(pp)); b = data[(tab, p)]
            thk = 'technicianTechHours' if tab == 'inv' else 'technicianCompletedTechHours'
            A = {r['technicianId']: (r['technicianClockedHours'], r[thk]) for r in (a['summary'] or {}).get('data', {}).get('collection', [])}
            Bm = {r['technicianId']: (r['technicianClockedHours'], r[thk]) for r in b['summary']['data']['collection']}
            ok = a['status'] == 200 and set(A) == set(Bm) and all(abs(A[k][0] - Bm[k][0]) < 0.06 and abs(A[k][1] - Bm[k][1]) < 0.011 for k in A)
            add(name, p, 'Invoiced' if tab == 'inv' else 'Completed', 'Preset by name = the same technicians and hours as the custom window of those dates (location time zone, weeks from Sunday)', ok,
                f'preset {len(A)} techs vs custom {len(Bm)}; diff {[k for k in set(A)|set(Bm) if A.get(k)!=Bm.get(k)][:3]}', 'SV-2115 date filter; SV-5450 location time zone', 'range')
    # ---- population (every location): Invoiced tab = clocked lines of work orders invoiced in the dates (SV-2115);
    #      Completed tab = every Complete, clocked line of a work order invoiced since 2025-01-01 appears in the
    #      two-year union of Completed windows (a line is completed before its invoice is made)
    tree = os.path.join(d, 'sbc_tree__last_year.json')
    if os.path.exists(tree):
        inv_of = {}
        for lab2 in ('last_12_months', 'last_year'):
            for cc in json.load(open(os.path.join(d, f'sbc_tree__{lab2}.json')))['tree']:
                for a in cc['assets']:
                    for i in a['invoices'] or []:
                        if i['work_order_type'] == 'service': inv_of[i['work_order_id']] = i
        allw = sorted(inv_of)
        wl2 = dict(zip(allw, prefetch([(w, wid) for w in allw], wo_lines)))
        def pairs(lines, want_status=None, skip_declined=True):
            out = set()
            for L in lines or []:
                if skip_declined and L['status'] == 'authorization_declined': continue
                if want_status and L['status'] != want_status: continue
                recs = L['task_records'].values() if isinstance(L['task_records'], dict) else L['task_records']
                for rec in recs: out.add((rec['staff_id'], L['line_id']))
            return out
        for lab in ranges(dt.date(2026, 10, 28)):
            j = data.get(('inv', lab))
            if not j or j['xstatus'] != 200: continue
            f, t = j['from'], j['to']
            exp = set()
            for w, i in inv_of.items():
                ld = dt.datetime.fromisoformat(i['created_on'].replace('Z', '+00:00')).astimezone(z).date().isoformat()
                if f <= ld <= t: exp |= pairs(wl2.get(w))
            got = {(tt['technicianId'], l['lineId']) for tt in j['expanded']['data']['collection'] for l in tt['lines']}
            declined = {(tt['technicianId'], l['lineId']) for tt in j['expanded']['data']['collection'] for l in tt['lines']
                        if any(L['line_id'] == l['lineId'] and L['status'] == 'authorization_declined' for L in (wl2.get(l['workOrderId']) or wl.get(l['workOrderId']) or []))}
            add(name, lab, 'Invoiced', 'Lines listed = every clocked, not-declined line of the work orders invoiced in the dates (declined lines = finding F2, counted apart)', (got - declined) == exp,
                f'{f}..{t} listed {len(got)} (of which declined {len(declined)}) vs records {len(exp)}; missing {list(exp-got)[:3]} extra {list(got-declined-exp)[:3]}', 'SV-2115 "Which staff should populate"', 'range')
        union = set()
        for lab in ('last_year', 'last_12_months'):
            j = data.get(('cmp', lab))
            if j and j['xstatus'] == 200: union |= {(tt['technicianId'], l['lineId']) for tt in j['expanded']['data']['collection'] for l in tt['lines']}
        exp = set()
        for w, i in inv_of.items():
            if i['created_on'] < '2025-01-02': continue
            for L in wl2.get(w) or []:
                recs = list(L['task_records'].values() if isinstance(L['task_records'], dict) else L['task_records'])
                if L['status'] == 'complete' and recs and min(r['start_date']['timestamp'] for r in recs) >= dt.datetime(2025, 1, 1, tzinfo=dt.timezone.utc).timestamp():
                    exp |= {(r['staff_id'], L['line_id']) for r in recs}
        add(name, '2y', 'Completed', 'Every Complete line with clock records (work orders invoiced since 2 Jan 2025) is listed in a Completed window', exp <= union,
            f'expected {len(exp)} listed {len(exp & union)}; missing {list(exp-union)[:4]}', 'SV-5450 Inclusion Rules', 'range')
json.dump(rows, open(OUTF, 'w'), indent=0)
by = collections.defaultdict(collections.Counter)
for r in rows: by[(r['report'], r['check'])][r['result']] += 1
for k, v in by.items(): print(dict(v), '|', k[0], '|', k[1])
print('TOTAL', collections.Counter(r['result'] for r in rows))
