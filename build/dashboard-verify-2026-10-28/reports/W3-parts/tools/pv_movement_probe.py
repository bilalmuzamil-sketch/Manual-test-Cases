"""Probe: does inventory Units Sold / Demand follow the date the part was put on the work order
(addedToLineAt) rather than the invoice date? Only for invoiced/paid WOs, non-declined lines, non-core."""
from common import *
import glob, collections
INV = {}
for f in glob.glob('/tmp/cln/dv/inv/*.json'):
    c = json.load(open(f))['body']['data']['collection']; INV.setdefault(c['work_order']['id'], []).append(c)
out = collections.Counter(); samples = collections.defaultdict(list)
for wid, name, tz in WORKPLACES[:2]:
    for rng in ['last_month', 'last_quarter', 'last_year', 'this_year']:
        d = json.load(open(f'{RAW}/pv/{wid}__{rng}__both.json'))
        f0, t0 = dt.date.fromisoformat(d['from']), dt.date.fromisoformat(d['to'])
        s, e = instants(f0, t0, tz); S = dt.datetime.fromisoformat(s.replace('Z', '+00:00')); E = dt.datetime.fromisoformat(e.replace('Z', '+00:00'))
        byadd = collections.defaultdict(lambda: [0.0, set()]); byinv = collections.defaultdict(lambda: [0.0, set()])
        for woid, invs in INV.items():
            if invs[0]['work_order']['workplace_id'] != wid: continue
            W = json.load(open(f'/tmp/cln/dv/wol/{woid}.json'))['data']['collection']
            if not W or W[0]['work_order_status'] not in ('invoiced', 'paid'): continue
            ico = min(dt.datetime.fromisoformat(c['created_on']) for c in invs)
            for ln in W:
                if ln['status'] == 'authorization_declined': continue
                for p in ln['parts']:
                    if not p.get('inventory_part_id') or p.get('is_core') or p.get('part_source_type') != 'inventory': continue
                    a = dt.datetime.fromisoformat(p['addedToLineAt'])
                    if S <= a <= E: byadd[p['inventory_part_id']][0] += float(p['quantity']); byadd[p['inventory_part_id']][1].add(woid)
                    if S <= ico <= E: byinv[p['inventory_part_id']][0] += float(p['quantity']); byinv[p['inventory_part_id']][1].add(woid)
        for r in d['rows']:
            if r['type'] != 'inventory': continue
            a = byadd.get(r['key'], [0, set()]); i = byinv.get(r['key'], [0, set()])
            if a[0] == 0 and i[0] == 0 and r['units_sold'] == 0: continue
            mu = abs(r['units_sold'] - a[0]) < 1e-6; mi = abs(r['units_sold'] - i[0]) < 1e-6
            da = r['demand'] == len(a[1]); di = r['demand'] == len(i[1])
            out[(name[:12], rng, 'units', 'add' if mu else '', 'inv' if mi else '')] += 1
            out[(name[:12], rng, 'demand', 'add' if da else '', 'inv' if di else '')] += 1
            if not mu and not mi and len(samples[rng]) < 6:
                samples[rng].append((r['part_number'], r['key'][:8], r['units_sold'], r['demand'], 'byAdded', a[0], len(a[1]), 'byInvoice', i[0], len(i[1]), 'on_hand', r['on_hand']))
for k, v in sorted(out.items()): print(k, v)
for k, v in samples.items():
    for x in v: print(k, x)
