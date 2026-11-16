#!/usr/bin/env python3
"""Item 3 (16 Nov): Dashboard Technician Efficiency tile = Technician Efficiency report, for every preset + the F2 window at every
location (te_tile.mjs), and the F2 example itself (SV-11931: DVI Test, Last 12 Months, Fabian Bonjean, work order S1-38198 —
expected 1.00 Invoiced Tech Hrs / 1.00 Clocked / 100 % per Chris's answer to DQ-1, 28 Oct: "(b) Only billed lines count").
Dashboard PRD (Confluence 788430850) S3-R2: Technician Efficiency = "Invoiced technician hours divided by clocked hours, times 100".
Checks: headline hours = report sums (0.01 h tolerance per technician for display rounding), headline % = hours ratio, every
technician row = report row, every report row = sum of its expanded lines, S1-38198 contributes only its billed line.
Usage: te_check.py -> evidence/results-te-tile.json"""
import json, os, glob, collections
EV = os.path.join(os.path.dirname(__file__), '..', 'evidence')
eq = lambda a, b, t=0.011: a is not None and b is not None and abs(a - b) <= t
out = {}; allc = collections.Counter()
for key in ('HD', 'LE', 'QB', 'DVI'):
    files = sorted(glob.glob(f'/tmp/cln/arap/te/{key}/*.json'))
    files = [f for f in files if not f.endswith('-responses.json')]
    if not files:
        continue
    c = collections.Counter(); fails = []; s38198 = []
    def ok(name, cond, d=None):
        c[name + (':pass' if cond else ':fail')] += 1; allc[':pass' if cond else ':fail'] += 1
        if not cond:
            fails.append((name, d))
    rows_out = {}
    for f in files:
        lab = os.path.basename(f)[:-5]; d = json.load(open(f))
        if d['dash']['s'] != 200 or d['te']['s'] != 200:
            ok('reads answered 200', False, (lab, d['dash']['s'], d['te']['s'])); continue
        k = d['dash']['j']['data']['techEfficiencyKpi']; perf = d['dash']['j']['data']['techPerformance']; col = d['te']['j']['data']['collection']
        th = round(sum(r['technicianTechHours'] for r in col), 2); ch = round(sum(r['technicianClockedHours'] for r in col), 2); n = max(1, len(col))
        ok('tile Invoiced Tech Hrs = report total', eq(k['hoursBilled'], th, 0.011 * n), (lab, k['hoursBilled'], th))
        ok('tile Clocked = report total', eq(k['hoursLogged'], ch, 0.011 * n), (lab, k['hoursLogged'], ch))
        if k['hoursLogged']:
            ok('tile % = Invoiced / Clocked x 100 (S3-R2)', eq(k['value'], round(k['hoursBilled'] / k['hoursLogged'] * 100, 2), 0.011), (lab, k['value'], k['hoursBilled'], k['hoursLogged']))
        else:
            ok('nothing clocked: tile % blank', k['value'] is None, (lab, k['value']))
        byt = {r['technicianId']: r for r in col}
        ok('same technicians on tile table and report', {p['staffId'] for p in perf} == set(byt), (lab, len(perf), len(byt)))
        for p in perf:
            r = byt.get(p['staffId'])
            ok('technician row: tile = report', r is not None and eq(p['hoursBilled'], r['technicianTechHours']) and eq(p['hoursLogged'], r['technicianClockedHours']), (lab, p['staffName'], p['hoursBilled'], p['hoursLogged'], r and (r['technicianTechHours'], r['technicianClockedHours'])))
        for x in (d['ex']['j'] or {}).get('data', {}).get('collection', []):
            ls = x.get('lines', [])
            ok('report row = sum of its lines', eq(sum(l['invoicedTechTime'] for l in ls), x['technicianTechHours'], 0.011 * max(1, len(ls))) and eq(sum(l['clockedTime'] for l in ls), x['technicianClockedHours'], 0.011 * max(1, len(ls))), (lab, x['technician']))
            for l in ls:
                if l.get('invoiceDisplayNumber') == 'S1-38198':
                    s38198.append((lab, x['technician'], l['lineName'], l['lineOrder'], l['clockedTime'], l['invoicedTechTime']))
        rows_out[lab] = {'from': d['from'], 'to': d['to'], 'tile': k, 'tile_table': [(p['staffName'], p['hoursBilled'], p['hoursLogged'], p['efficiency']) for p in perf],
                         'report': [(r['technician'], r['technicianTechHours'], r['technicianClockedHours'], r['technicianTechEfficiency']) for r in col]}
    if key == 'DVI':
        lines = sorted(set(s38198))
        ok('SV-11931 example: S1-38198 contributes only its billed line 1 (line 2 was declined)', bool(lines) and all(l[3] == 1 for l in lines), lines)
        l12 = rows_out.get('last_12_months', {})
        fab = [t for t in l12.get('tile_table', []) if t[0] == 'Fabian Bonjean']
        ok('SV-11931 Expected: Fabian Bonjean 1.00 / 1.00 / 100 % on the tile (Last 12 Months)', fab == [('Fabian Bonjean', 1, 1, 100)], fab)
    scr = {}
    p = os.path.join(EV, f'te-{key}.json')
    if os.path.exists(p):
        scr = json.load(open(p)); s = scr.get('screen', {})
        txt = s.get('tile_text') or ''
        l12 = rows_out.get('last_12_months', {}).get('tile', {})
        ok('SCREEN tile shows the Last 12 Months figures', l12 and f"{l12.get('value')}" .rstrip('0').rstrip('.') in txt.replace(',', ''), (s.get('tile_range_after'), txt[:200], l12))
        rr = [r for r in s.get('report_rows', []) if r and r[0] and not r[0].startswith('Total')]
        ok('SCREEN report rows drawn at Last 12 Months', bool(rr) or not rows_out.get('last_12_months', {}).get('report'), (s.get('report_range_after'), rr[:3]))
    out[key] = {'rule99_start': scr.get('start'), 'rule99_end': scr.get('end'), 'counts': dict(c), 'failures': fails[:40], 'ranges': rows_out, 's1_38198_lines': sorted(set(s38198)), 'screen': scr.get('screen')}
    print(key, {k: v for k, v in c.items() if k.endswith(':fail')}, sum(v for k, v in c.items() if k.endswith(':pass')))
json.dump(out, open(os.path.join(EV, 'results-te-tile.json'), 'w'), indent=1, default=str)
print(dict(allc))
