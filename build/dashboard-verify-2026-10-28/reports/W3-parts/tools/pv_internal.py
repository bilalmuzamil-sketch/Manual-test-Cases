"""Parts Velocity LAYER A: every row of every collected preset x location x Type, checked against the
spec's own formulas and rules (PV spec v12: S3-N1, S3-R2, S3-R9, S4, S5-R4, S5-R4a, S5-R5, S5-R7) and
SV-11514 (Last 90 Days). Money arrives in cents. Writes ../results-pv-internal.json + prints a summary."""
from common import *
import glob, collections, math
from decimal import Decimal, ROUND_HALF_UP
def rhu(x, q='1'):
    return float(Decimal(str(x)).quantize(Decimal(q), rounding=ROUND_HALF_UP))
res = []; summ = collections.Counter()
def chk(cid, ok, **kw):
    res.append(dict(check=cid, ok=bool(ok), **kw)); summ[(cid, bool(ok))] += 1
files = sorted(glob.glob(RAW + '/pv/*__*__*.json'))
by = {}
for f in files:
    d = json.load(open(f)); by[(d['wid'], d['range'], d['type'])] = d
for (wid, rng, typ), d in sorted(by.items()):
    if d['status'] != 200:
        chk('HTTP200', False, wid=wid, range=rng, type=typ); continue
    f0, t0 = dt.date.fromisoformat(d['from']), dt.date.fromisoformat(d['to'])
    window = max((t0 - f0).days + 1, 1)
    fetched = dt.datetime.fromisoformat(d['fetched_at']).replace(tzinfo=dt.timezone.utc)
    start_utc = dt.datetime.fromisoformat(instants(f0, t0, TZ[wid])[0].replace('Z', '+00:00'))
    rows = d['rows']
    chk('rowsNumber=rows', d['pagination']['rowsNumber'] == len(rows), wid=wid, range=rng, type=typ, n=len(rows))
    keys = [(r['type'], r['key']) for r in rows]
    chk('no-duplicate-rows', len(keys) == len(set(keys)), wid=wid, range=rng, type=typ)
    # S3-R2 default order demand desc, ties inventory before special order
    order_ok = all((rows[i]['demand'] > rows[i+1]['demand']) or (rows[i]['demand'] == rows[i+1]['demand'] and not (rows[i]['type'] == 'special_order' and rows[i+1]['type'] == 'inventory')) for i in range(len(rows)-1))
    chk('S3-R2 demand-desc, inventory-before-SO on ties', order_ok, wid=wid, range=rng, type=typ)
    for r in rows:
        ctx = dict(wid=wid, range=rng, type=typ, part=r['part_number'], rtype=r['type'], key=r['key'])
        if typ != 'both':
            chk('Type filter returns only that type', r['type'] == typ, **ctx)
        chk('S5-R5 counts never null', all(r[k] is not None for k in ('units_sold', 'units_returned', 'sold_via_wo', 'sold_via_parts_sale', 'demand', 'revenue', 'margin')), **ctx)
        billed = (r['sold_via_wo'] or 0) + (r['sold_via_parts_sale'] or 0)
        rev, mar = r['revenue'], r['margin']; cogs = rev - mar
        # Avg Sell / Avg Cost (S5-R4a) null iff billed <= 0, else Revenue / billed, COGS / billed (cents)
        if billed <= 0:
            chk('S5-R4a Avg Sell null when billed<=0', r['sell_price'] is None, **ctx, billed=billed, got=r['sell_price'])
            chk('S5-R4a Avg Cost null when billed<=0', r['unit_cost'] is None, **ctx, billed=billed, got=r['unit_cost'])
        else:
            tol = 0.5 + 0.5 / billed + 1e-9
            chk('S5-R4a Avg Sell = Revenue / billed units', r['sell_price'] is not None and abs(r['sell_price'] - rev / billed) <= tol + 0.5, **ctx, billed=billed, rev=rev, got=r['sell_price'], exp=round(rev / billed, 2))
            chk('S5-R4a Avg Cost = COGS / billed units', r['unit_cost'] is not None and abs(r['unit_cost'] - cogs / billed) <= tol + 0.5, **ctx, billed=billed, cogs=cogs, got=r['unit_cost'], exp=round(cogs / billed, 2))
        if rev <= 0:
            chk('S5-R4a Margin % null when Revenue<=0', r['margin_pct'] is None, **ctx, rev=rev, got=r['margin_pct'])
        else:
            exp = mar / rev * 100
            chk('S5-R4a Margin % = Margin / Revenue', r['margin_pct'] is not None and abs(r['margin_pct'] - exp) <= 0.005 + 50 / rev, **ctx, got=r['margin_pct'], exp=round(exp, 3))
        if r['type'] == 'special_order':
            chk('SO On Hand/Min/Max/Turns null', all(r[k] is None for k in ('on_hand', 'min', 'max', 'turns_per_year')), **ctx)
            chk('S5-R7 SO Units Sold = Sold(WO)+Sold(PS)', abs(r['units_sold'] - billed) < 1e-6, **ctx, units=r['units_sold'], billed=billed)
            chk('SO Last Sale present', r['last_sale'] is not None, **ctx)
        else:
            chk('S3-N1 kept only with movement/stock>=1/revenue', not (abs(r['units_sold']) < 1e-9 and (r['on_hand'] or 0) < 1 and rev == 0), **ctx, units=r['units_sold'], on_hand=r['on_hand'], rev=rev)
            oh = r['on_hand']
            if oh is not None and oh > 0:
                exp = r['units_sold'] * 365 / window / oh
                chk('S5-R4 Turns/Yr = (Units Sold / Window x 365) / On Hand', r['turns_per_year'] is not None and abs(r['turns_per_year'] - exp) <= 1e-6 * max(1, abs(exp)), **ctx, got=r['turns_per_year'], exp=exp, window=window)
            else:
                chk('S5-R4 Turns/Yr = 0.00 when On Hand 0', r['turns_per_year'] in (0, 0.0), **ctx, got=r['turns_per_year'], on_hand=oh)
            if r['units_sold'] > 1e-9:
                chk('Demand >= 1 when stock moved out (net Units Sold > 0)', r['demand'] >= 1, **ctx, demand=r['demand'], units=r['units_sold'])
        if r['demand'] > 0:
            # a sale inside the window means the last sale (all-time) is no older than the window start
            age_days = (fetched - start_utc).total_seconds() / 86400
            chk('Last Sale <= days since window start when Demand > 0 in window', r['last_sale'] is not None and r['last_sale'] <= math.floor(age_days) + 1, **ctx, last_sale=r['last_sale'], max=age_days)
        chk('Location shows own location (single location)', r['location'] == NAME[wid], **ctx, got=r['location'])
# Type: Both = Inventory U Special Order, identical values
for (wid, rng, typ), d in by.items():
    if typ != 'both': continue
    inv, so = by.get((wid, rng, 'inventory')), by.get((wid, rng, 'special_order'))
    if not inv or not so: continue
    A = {(r['type'], r['key']): r for r in d['rows']}
    B = {(r['type'], r['key']): r for r in inv['rows'] + so['rows']}
    chk('S2-R1 Both = Inventory + Special Order (same rows)', set(A) == set(B), wid=wid, range=rng, only_both=len(set(A) - set(B)), only_parts=len(set(B) - set(A)))
    diff = [k for k in set(A) & set(B) if {x: A[k][x] for x in A[k] if x != 'last_sale'} != {x: B[k][x] for x in B[k] if x != 'last_sale'}]
    chk('S2-R1 Both rows carry same values as per-type reads', not diff, wid=wid, range=rng, n_diff=len(diff), sample=diff[:3])
json.dump(res, open('../results-pv-internal.json', 'w'))
agg = collections.defaultdict(lambda: [0, 0])
for (c, ok), n in summ.items(): agg[c][0 if ok else 1] += n
for c, (p, f) in sorted(agg.items()): print(f'{c:75s} PASS {p:7d} FAIL {f}')
print('TOTAL', sum(v[0] for v in agg.values()), sum(v[1] for v in agg.values()))
