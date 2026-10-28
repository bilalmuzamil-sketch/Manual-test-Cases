"""Parts Velocity LAYER B: independent recompute of the billed-line columns (Revenue, COGS/Margin, Avg Cost,
Avg Sell, Sold (WO), Sold (Parts Sale), special-order Units Sold) from RAW records through a different path:
invoice view (GET /api/invoices/{id}/view, cached /tmp/cln/dv/inv) for what was billed + work-order lines
(GET /api/work-orders/lines/{woId}, cached /tmp/cln/dv/wol) for the part's source, cost, WO status and line status.
Window = invoice date (the build's anchor) AND, separately, the spec's anchor is reported as not testable
(work_order.end_date never populated) — see RESULTS. Writes ../results-pv-recompute.json."""
from common import *
import glob, collections
from decimal import Decimal, ROUND_HALF_UP
def rhu(x): return int(Decimal(str(x)).quantize(Decimal('1'), rounding=ROUND_HALF_UP))
INV = {}
for f in glob.glob('/tmp/cln/dv/inv/*.json'):
    c = json.load(open(f))['body']['data']['collection']; INV[c['id']] = c
WOL = {}
def wol(woid):
    if woid not in WOL:
        WOL[woid] = json.load(open(f'/tmp/cln/dv/wol/{woid}.json'))['data']['collection']
    return WOL[woid]
inv_mtime = max(os.path.getmtime(f) for f in glob.glob('/tmp/cln/dv/inv/*.json'))
res = []; summ = collections.Counter(); unmatched = collections.Counter(); nocat = collections.Counter()
def chk(cid, ok, **kw):
    res.append(dict(check=cid, ok=bool(ok), **kw)); summ[(cid, bool(ok))] += 1
RANGES = ['last_week', 'last_month', 'last_quarter', 'last_year', 'this_month', 'this_quarter', 'this_year', 'last_90_days', 'custom_366']
for wid, name, tz in WORKPLACES:
    for rng in RANGES:
        d = json.load(open(f'{RAW}/pv/{wid}__{rng}__both.json'))
        f0, t0 = dt.date.fromisoformat(d['from']), dt.date.fromisoformat(d['to'])
        s, e = instants(f0, t0, tz)
        S = dt.datetime.fromisoformat(s.replace('Z', '+00:00')); E = dt.datetime.fromisoformat(e.replace('Z', '+00:00'))
        exp = collections.defaultdict(lambda: dict(rev=0.0, cogs=0.0, units=0.0, wo=0.0, ps=0.0, lines=0, invoices=set()))
        for iid, c in INV.items():
            if c['work_order']['workplace_id'] != wid: continue
            co = dt.datetime.fromisoformat(c['created_on'])
            if not (S <= co <= E): continue
            if c['status'] == 'void': continue
            lines = wol(c['work_order']['id'])
            wostat = lines[0]['work_order_status'] if lines else None
            if wostat not in ('invoiced', 'paid'): continue
            wparts = {p['id']: (p, ln) for ln in lines for p in ln.get('parts', [])}
            preq = {q['id']: q for ln in lines for q in ln.get('part_requests', [])}
            kind = 'ps' if c['display_number'].startswith('P') else 'wo'
            for ln in c['work_order']['lines']:
                for p in ln['parts']:
                    m = wparts.get(p['id'])
                    if not m: unmatched[(name, rng)] += 1; continue
                    wp, wln = m
                    if wln['status'] == 'authorization_declined' or wp.get('is_core'): continue
                    q = float(p['quantity']); price = float(p['cost']) if p.get('cost') is not None else (float(p['total_cost']) / q if q else 0.0)
                    if wp.get('part_source_type') == 'vendor':
                        key = ('special_order', 'PN:' + (wp['part_number'] or '').strip().lower())
                    elif wp.get('inventory_part_id'):
                        key = ('inventory', wp['inventory_part_id'])
                    else:
                        continue
                    x = exp[key]; x['rev'] += q * price * 100; x['cogs'] += q * float(wp['cost'] or 0) * 100; x['units'] += q; x[kind] += q; x['lines'] += 1; x['invoices'].add(iid)
        got = {}
        for r in d['rows']:
            k = (r['type'], r['key'] if r['type'] == 'inventory' else 'PN:' + (r['part_number'] or '').strip().lower())
            if k in got:  # two catalogue parts sharing a part number: merge
                g = got[k]; 
                for f_ in ('revenue', 'margin', 'sold_via_wo', 'sold_via_parts_sale', 'units_sold', 'demand'): g[f_] += r[f_]
            else: got[k] = dict(r)
        keys = set(exp) | {k for k, r in got.items() if (r['sold_via_wo'] + r['sold_via_parts_sale']) != 0 or r['revenue'] != 0}
        for k in keys:
            x = exp.get(k); r = got.get(k)
            ctx = dict(loc=name, range=rng, rtype=k[0], key=k[1], part=(r or {}).get('part_number'))
            pre = 'SO(info, part-number grouping) ' if k[0] == 'special_order' else ''
            if r is None:
                chk(pre + 'B1 every billed part appears as a row', False, **ctx, exp_rev=rhu(x['rev']), exp_units=x['units'], invoices=len(x['invoices'])); continue
            if x is None:
                chk(pre + 'B1 no row carries billed money without a billed line in raw records', False, **ctx, got_rev=r['revenue'], got_units=r['sold_via_wo'] + r['sold_via_parts_sale']); continue
            chk(pre + 'B2 Revenue = sum(price x qty) of billed lines', abs(r['revenue'] - rhu(x['rev'])) <= 1 + 0.01 * x['lines'], **ctx, got=r['revenue'], exp=rhu(x['rev']))
            chk(pre + 'B3 Margin = Revenue - COGS (cost on the WO part)', abs(r['margin'] - rhu(x['rev'] - x['cogs'])) <= 1 + 0.01 * x['lines'], **ctx, got=r['margin'], exp=rhu(x['rev'] - x['cogs']))
            chk(pre + 'B4 Sold (WO) = billed qty on service invoices', abs(r['sold_via_wo'] - x['wo']) < 1e-6, **ctx, got=r['sold_via_wo'], exp=x['wo'])
            chk(pre + 'B5 Sold (Parts Sale) = billed qty on parts-sale invoices', abs(r['sold_via_parts_sale'] - x['ps']) < 1e-6, **ctx, got=r['sold_via_parts_sale'], exp=x['ps'])
            if k[0] == 'special_order':
                chk('B6 SO Units Sold = billed qty', abs(r['units_sold'] - x['units']) < 1e-6, **ctx, got=r['units_sold'], exp=x['units'])
                chk('B7 SO Demand = billed lines (requests)', r['demand'] == x['lines'], **ctx, got=r['demand'], exp=x['lines'])
            else:
                chk('B8 INV Units Sold (movement) = billed qty (expected equal unless drop-ship/neg stock)', abs(r['units_sold'] - x['units']) < 1e-6, **ctx, got=r['units_sold'], exp=x['units'])
                chk('B9 INV Demand = distinct invoices billing the part', r['demand'] == len(x['invoices']), **ctx, got=r['demand'], exp=len(x['invoices']))
import compact; compact.write('results-pv-recompute.json', res, {'unmatched_invoice_parts': {f'{a}|{b}': v for (a, b), v in unmatched.items()}})
agg = collections.defaultdict(lambda: [0, 0])
for (c, ok), n in summ.items(): agg[c][0 if ok else 1] += n
for c, (p, f) in sorted(agg.items()): print(f'{c:90s} PASS {p:6d} FAIL {f}')
print('unmatched invoice part lines (unpicked requests shown at $0 on the invoice view)', sum(unmatched.values()), '| vendor parts with no catalogue id in work-order lines', sum(nocat.values()))
for rt in ('inventory','special_order'):
    c=collections.Counter((x['check'],x['ok']) for x in res if x['rtype']==rt); print(rt, sorted(c.items()))
