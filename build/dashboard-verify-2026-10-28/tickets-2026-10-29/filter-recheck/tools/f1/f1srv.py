#!/usr/bin/env python3
"""Step 5 server cross-check for worker F1: replay, with F1's own session (change-located to the location's zone),
the SAME requests the screen sent (from evidence/f1/ui-<MODE>.ui.json) and pull the ticket's figures out of the data.
Raw bodies stay in /tmp/cln/f1/raw (staging business data stays out of git). Usage: TZ=<zone> f1srv.py <MODE>"""
import json, os, sys, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from f1env import use, get, dump, EV

mode = sys.argv[1]
LOCOF = {'P11': 'DVI', 'P14': 'DVI', 'C1': 'DVI', 'P12': 'LETH', 'P13': 'HD', 'A1': 'HD', 'A2': 'HD',
         'P11R': 'DVI', 'P12R': 'LETH', 'P13R': 'HD', 'P14R': 'DVI'}
loc = use(LOCOF[mode]); wid = loc['wid']
ui = json.load(open(f'{EV}/ui-{mode}.ui.json'))
RAW = '/tmp/cln/f1/raw'; os.makedirs(RAW, exist_ok=True)
NEEDLE = {'P11': 'Fabian Bonjean', 'P12': 'Joseph Nelson', 'P13': 'QA Technician', 'P14': 'ZZAUTOTEST Dash Q27',
          'P11R': 'S1-38198', 'P12R': 'S3-17383', 'P13R': 'QA Technician', 'P14R': 'ZZAUTOTEST Dash Q27', 'C1': 'S1-38217', 'A1': 'S2-38105', 'A2': 'S2-33740'}
WO_STATS = {'P14': '64037a28-0778-49a4-abda-47ea472eab17', 'P14R': '64037a28-0778-49a4-abda-47ea472eab17', 'C1': '949e3a4b-abff-4b98-9e4f-373512b179af'}


def find(o, needle, path=''):
    """every dict anywhere in o whose JSON mentions needle and has no nested dict that also mentions it"""
    hits = []
    if isinstance(o, dict):
        sub = [h for k, v in o.items() for h in find(v, needle, f'{path}.{k}')]
        if sub: return sub
        if needle in json.dumps(o): return [(path, o)]
    elif isinstance(o, list):
        for i, v in enumerate(o): hits += find(v, needle, f'{path}[{i}]')
    return hits


res = {'loc': loc, 'mode': mode, 'replays': []}
seen = set()
for r in ui['requests']:
    u = r['url']
    if not re.search(r'/api/(dashboard/reports|reporting/)', u) or 'atRiskCustomers' in u: continue
    if (r['phase'], u) in seen: continue
    seen.add((r['phase'], u))
    path, _, q = u.partition('?')
    c, b = get(path, q, wid)
    fn = f"{RAW}/{mode}-{len(res['replays'])}.json"; json.dump(b, open(fn, 'w'))
    item = {'phase': r['phase'], 'request': u, 'status': c, 'raw': fn}
    nd = NEEDLE.get(mode)
    if nd: item['hits'] = [(p, h) for p, h in find(b, nd)][:6]
    if mode == 'P11' and 'techEfficiencyKpi' in u:
        item['kpi'] = (b.get('data') or {}).get('techEfficiencyKpi') if isinstance(b, dict) else None
    if mode == 'P12' and 'techEfficiencyKpi' in u:
        item['kpi'] = (b.get('data') or {}).get('techEfficiencyKpi')
    if mode == 'P13' and 'techUtilization' in u:
        tu = (b.get('data') or {}).get('techUtilization')
        rows = tu if isinstance(tu, list) else (tu or {}).get('rows') or (tu or {}).get('data') or tu
        item['techUtilization_rows'] = rows if isinstance(rows, list) else json.dumps(rows)[:3000]
    res['replays'].append(item)
if mode in WO_STATS:
    c, b = get(f'/api/work-orders/statistics/{WO_STATS[mode]}', [], wid); res['wo_statistics'] = {'status': c, 'data': (b or {}).get('data')}
dump(f'srv-{mode}', res)
if 'wo_statistics' in res: print('WO statistics', json.dumps(res['wo_statistics'])[:700])
for it in res['replays']:
    print(it['phase'], it['status'], it['request'][:170])
    for k in ('hits', 'kpi', 'techUtilization_rows'):
        if k in it: print('   ', k, json.dumps(it[k], default=str)[:1800])
