"""Check every collected filter read against the unfiltered read of the same report/location/window
(PV spec S2-R4..R10, S2-E1..E3, S3-R1a, S3-R10/R10a; IV spec S4-R8, S6-R3..R9, S7). Writes ../results-filters.json."""
from common import *
import glob, collections
res = []; summ = collections.Counter()
def chk(cid, ok, **kw):
    res.append(dict(check=cid, ok=bool(ok), **kw)); summ[(cid, bool(ok))] += 1
HD, LE = 'b3c8c820-f815-4cf1-8938-10956c5ee71a', 'f8a8b802-7780-4b16-bf10-343caeb616b2'
cats = json.load(open(RAW + '/flt/_categories.json')); cid2lab = {c['value']: c['label'] for c in cats}
vend = json.load(open(RAW + '/flt/_vendors.json')); vid2name = {v['id']: v['name'] for v in vend}
base_iv = {w: {r['key']: r for r in json.load(open(f'{RAW}/iv/{w}__today.json'))['rows']} for w in (HD, LE)}
base_pv = {w: {(r['type'], r['key']): r for r in json.load(open(f'{RAW}/pv/{w}__this_year__both.json'))['rows']} for w in (HD, LE)}
parts = {w: {p['id']: p for p in json.load(open(f'{RAW}/parts/{w}.json'))['rows']} for w in (HD, LE)}
so_part = collections.defaultdict(lambda: collections.defaultdict(float))
for f in sorted(glob.glob(RAW + '/flt/*_????.json')):
    d = json.load(open(f)); rep, w, kind, val = d['rep'], d['wid'], d['kind'], d['value']
    ctx = dict(rep=rep, loc=NAME.get(w, 'HD+LE') if isinstance(w, str) else 'HD+LE', kind=kind, value=(cid2lab.get(val) or vid2name.get(val) or val))
    if d['status'] != 200: chk('HTTP 200', False, **ctx, status=d['status']); continue
    rows = d['rows']
    if kind == 'locations':
        if rep == 'iv':
            union = set(base_iv[HD]) | set(base_iv[LE]); got = {r['key'] for r in rows}
            chk('IV S7-R3 two locations = union of each', got == union, **ctx, missing=len(union - got), extra=len(got - union))
            chk('IV S7-R7 every row names its own location', all(r['location'] in (NAME[HD], NAME[LE]) for r in rows), **ctx)
            tot = d['meta']['totals']
            chk('IV S4-R2 totals = sum of rows (two locations)', abs(tot['total_cost'] - sum(r['total_cost'] for r in rows)) <= len(rows) * 0.5 + 1, **ctx)
        else:
            inv = {r['key']: r for r in rows if r['type'] == 'inventory'}
            uinv = {k[1] for b in base_pv.values() for k in b if k[0] == 'inventory'}
            chk('PV S3-R1a inventory rows = one per part per location (union)', set(inv) == uinv, **ctx, missing=len(uinv - set(inv)), extra=len(set(inv) - uinv))
            so = {r['key']: r for r in rows if r['type'] == 'special_order'}
            both = {k[1] for k in base_pv[HD] if k[0] == 'special_order'} & {k[1] for k in base_pv[LE] if k[0] == 'special_order'}
            chk('PV S3-R10 SO row at both locations shows "Multiple"', all(so[k]['location'] == 'Multiple' for k in both if k in so), **ctx, n=len(both))
            only = ({k[1] for k in base_pv[HD] if k[0] == 'special_order'} ^ {k[1] for k in base_pv[LE] if k[0] == 'special_order'})
            chk('PV S3-R10 SO row at one location shows that location', all(so[k]['location'] in (NAME[HD], NAME[LE]) for k in only if k in so), **ctx)
            sums = [(k, so[k]['revenue'], base_pv[HD].get(('special_order', k), {}).get('revenue', 0) + base_pv[LE].get(('special_order', k), {}).get('revenue', 0)) for k in both if k in so]
            chk('PV S3-R1a merged SO money = sum of the locations (same calendar year; time-zone edge tolerated)', sum(1 for k, a, b in sums if a != b) <= max(2, len(sums) // 50), **ctx, n=len(sums), differ=sum(1 for k, a, b in sums if a != b))
            chk('PV S2-R12 Location column values present with >1 location', all(r['location'] for r in rows), **ctx)
        continue
    B = base_iv[w] if rep == 'iv' else base_pv[w]
    if rep == 'iv':
        got = {r['key'] for r in rows}
        if kind == 'category': exp = {k for k, r in B.items() if r['category'] == cid2lab[val]}
        elif kind == 'vendor': exp = {k for k in B if parts[w].get(k, {}).get('vendor_id') == val}
        else: exp = {k for k, r in B.items() if val.lower() in (r['part_number'] or '').lower() or val.lower() in (r['description'] or '').lower()}
        chk(f'IV {kind} filter returns exactly the matching parts', got == exp, **ctx, n=len(got), missing=len(exp - got), extra=len(got - exp))
        same = all({x: r[x] for x in r} == B[r['key']] for r in rows if r['key'] in B)
        chk(f'IV {kind} filter keeps each row\'s values', same, **ctx)
        if rows:
            tot = d['meta']['totals']
            ok = all(abs(tot[f_] - sum(r[f_] for r in rows)) <= (0.011 if f_ == 'qty' else 0.5 * len(rows) + 1) for f_ in ('qty', 'total_cost', 'total_sell', 'margin'))
            mp = (tot['margin'] / tot['total_sell'] * 100) if tot['total_sell'] > 0 else None
            ok2 = (mp is None and tot['margin_pct'] is None) or (mp is not None and tot['margin_pct'] is not None and abs(mp - tot['margin_pct']) < 0.006)
            chk(f'IV S4-R8 {kind} totals recomputed over the filtered set', ok and ok2, **ctx, totals=tot)
        else:
            chk(f'IV {kind} empty result has no rows and zero totals', d['meta']['totals']['qty'] == 0, **ctx)
    else:
        ginv = {r['key']: r for r in rows if r['type'] == 'inventory'}; gso = {r['key']: r for r in rows if r['type'] == 'special_order'}
        binv = {k[1]: r for k, r in B.items() if k[0] == 'inventory'}
        if kind == 'category':
            exp = {k for k, r in binv.items() if r['category'] == val}
            chk('PV S2-R4 Category: inventory rows = parts in that category', set(ginv) == exp, **ctx, missing=len(exp - set(ginv)), extra=len(set(ginv) - exp))
            chk('PV S3-R10a Category filter: every row shows that category', all(r['category'] == val for r in rows), **ctx, bad=[(r['part_number'], r['category']) for r in rows if r['category'] != val][:3])
        elif kind == 'vendor':
            exp = {k for k, r in binv.items() if r['vendor'] == val}
            chk('PV S2-R5 Vendor: inventory rows = parts from that vendor', set(ginv) == exp, **ctx, missing=len(exp - set(ginv)), extra=len(set(ginv) - exp))
            chk('PV S3-R10a Vendor filter: every row shows that vendor', all(r['vendor'] == val for r in rows), **ctx, bad=[(r['part_number'], r['vendor']) for r in rows if r['vendor'] != val][:3])
        elif kind == 'bin':
            chk('PV S2-R8 Bin: no Special Order rows', not gso, **ctx, n_so=len(gso))
            exp = {k for k in binv if any(b['binLocationId'] == val for b in parts[w].get(k, {}).get('binLocations', []))}
            chk('PV S2-R8 Bin: inventory rows = parts stocked in that bin', set(ginv) == exp, **ctx, missing=len(exp - set(ginv)), extra=len(set(ginv) - exp))
        else:
            expk = {k for k, r in B.items() if val.lower() in (r['part_number'] or '').lower() or val.lower() in (r['description'] or '').lower()}
            gotk = {(r['type'], r['key']) for r in rows}
            chk('PV S2-R6 Search: part # or description contains text (case-insensitive)', gotk == expk, **ctx, missing=len(expk - gotk), extra=len(gotk - expk))
        same = all({x: r[x] for x in r if x != 'last_sale'} == {x: binv[k][x] for x in binv[k] if x != 'last_sale'} for k, r in ginv.items() if k in binv)
        chk(f'PV {kind} filter keeps inventory row values', same, **ctx)
        if kind in ('category', 'vendor'):
            for k, r in gso.items(): so_part[(w, kind, k)]['revenue'] += r['revenue']; so_part[(w, kind, k)]['units'] += r['units_sold']
# SO partition: the per-category (per-vendor) slices of one Special Order part add back to its unfiltered figures
for w in (HD, LE):
    for kind in ('category', 'vendor'):
        bad = []; n = 0
        for k, r in base_pv[w].items():
            if k[0] != 'special_order': continue
            if kind == 'category' and r['category'] is None: continue
            if kind == 'vendor' and r['vendor'] is None: continue
            n += 1; p = so_part.get((w, kind, k[1]), {'revenue': 0, 'units': 0})
            if abs(p['revenue'] - r['revenue']) > 1 or abs(p['units'] - r['units_sold']) > 1e-6: bad.append((r['part_number'], r['revenue'], p['revenue'], r['units_sold'], p['units']))
        chk(f'PV S3-R10a SO {kind} slices add back to the part total', len(bad) == 0, loc=NAME[w], n=n, n_bad=len(bad), sample=bad[:5])
json.dump(res, open('../results-filters.json', 'w'))
agg = collections.defaultdict(lambda: [0, 0])
for (c, ok), n in summ.items(): agg[c][0 if ok else 1] += n
for c, (p, f) in sorted(agg.items()): print(f'{c:85s} PASS {p:5d} FAIL {f}')
