#!/usr/bin/env python3
"""P1-2 (SV-11932) expected-value check at the WIDEST range (Amendment 1): Technician Efficiency report, Lethbridge,
Last 12 months, every technician expanded. Lists every line row whose clocked time is <= 0.01 h with 0 invoiced tech
time (the symptom), and the work-order line's own tech time + every clock on it, so the expected share can be
worked out from the real clocked seconds (Chris Ward, Q28: split on the real time clocked).
Read-only. Usage: TZ=America/Edmonton p12decomp.py [range]"""
import json, os, sys, datetime as dt
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from f1env import use, get, dump
rng = sys.argv[1] if len(sys.argv) > 1 else 'last_12_months'
loc = use('LETH'); w = loc['wid']
c, b = get(f'/api/reporting/technician-efficiency/{rng}', [('range', rng)], w)
techs = b['data']['collection']
out = {'loc': loc, 'range': rng, 'tech_summary': [], 'suspect_lines': []}
by_line = {}
for t in techs:
    sid = t.get('staffId') or t.get('technicianId') or t.get('id')
    out['tech_summary'].append({k: t.get(k) for k in t if not isinstance(t.get(k), (list, dict))})
    c2, e = get(f'/api/reporting/technician-efficiency/expanded/{rng}', [('range', rng), ('staffIds[0]', sid)], w)
    for grp in (e.get('data') or {}).get('collection') or []:
        for ln in grp.get('lines') or []:
            by_line.setdefault(ln.get('lineId'), []).append({'tech': t.get('technician'), 'clocked': ln.get('clockedTime'), 'inv': ln.get('invoicedTechTime')})
            if (ln.get('clockedTime') or 0) <= 0.01 and not ln.get('invoicedTechTime'):
                out['suspect_lines'].append({'tech': t.get('technician') or sid, **{k: ln.get(k) for k in ('invoiceDisplayNumber', 'lineName', 'lineOrder', 'clockedTime', 'invoicedTechTime', 'workOrderId', 'lineId')}})
print('techs', len(techs), 'keys', list(techs[0])[:20] if techs else None)
print('suspect line rows (clocked <= 0.01, invoiced tech 0):', len(out['suspect_lines']))

# line tech time from the work order's Stats (hours_data per line)
stats = {}
for wo in sorted({x['workOrderId'] for x in out['suspect_lines']}):
    c3, st = get(f'/api/work-orders/statistics/{wo}', [], w)
    stats[wo] = {h['line_id']: h for h in (((st or {}).get('data') or {}).get('collection') or {}).get('hours_data', []) if h.get('line_id')}
tot = {'sole': 0.0, 'shared_upper_bound': 0.0}; per_tech = {}
for x in out['suspect_lines']:
    h = stats.get(x['workOrderId'], {}).get(x['lineId']) or {}
    x['line_tech_hours'] = h.get('tech_hours'); x['line_clocked_hours'] = h.get('clocked_hours'); x['clockers'] = by_line.get(x['lineId'])
    x['sole_clocker'] = len(x['clockers'] or []) == 1
    if not x['line_tech_hours']: x['dropped'] = 0; continue
    if x['sole_clocker']: x['dropped'] = x['line_tech_hours']; tot['sole'] += x['line_tech_hours']; per_tech[x['tech']] = per_tech.get(x['tech'], 0) + x['line_tech_hours']
    else:  # share = tech_hours * secs_i / total_secs, secs_i < 36 s; bound with 36 s over the line's clocked total
        ub = x['line_tech_hours'] * 0.01 / max(x['line_clocked_hours'] or 0.01, 0.01); x['dropped_upper_bound'] = round(ub, 4); tot['shared_upper_bound'] += ub
out['dropped_totals'] = tot; out['dropped_sole_by_tech'] = per_tech
print('lines with tech time > 0 and the symptom:', [(x['invoiceDisplayNumber'], x['lineOrder'], x['tech'], x['clockedTime'], x['line_tech_hours'], 'sole' if x['sole_clocker'] else 'shared') for x in out['suspect_lines'] if x.get('line_tech_hours')])
print('totals', tot, 'sole by tech', per_tech)
dump(f'p12decomp-{rng}', out)
