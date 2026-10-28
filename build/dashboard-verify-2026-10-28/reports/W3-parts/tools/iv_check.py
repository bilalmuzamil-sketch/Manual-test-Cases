"""Inventory Value FULL pass. LAYER A internal (every row of every collected day x location x ALL) against
IV spec v10 (S2, S3, S4, S5, S7, S9); LAYER B independent recompute of TODAY (live) from the parts list
(GET /api/inventory/parts — quantity, bins, purchase price, sell price, category, vendor, is_core) and from
the pricing matrices + fixed-price list. Money in cents. Writes ../results-iv.json."""
from common import *
import glob, collections
from decimal import Decimal, ROUND_HALF_UP
def rhu(x): return int(Decimal(repr(x)).quantize(Decimal('1'), rounding=ROUND_HALF_UP))
res = []; summ = collections.Counter()
def chk(cid, ok, **kw):
    res.append(dict(check=cid, ok=bool(ok), **kw)); summ[(cid, bool(ok))] += 1
files = {}
for f in glob.glob(RAW + '/iv/*__*.json'):
    d = json.load(open(f)); files[(d['wid'], d['label'])] = d
for (wid, lab), d in sorted(files.items()):
    ctx0 = dict(wid=wid, label=lab, day=d['day'])
    if d['status'] != 200: chk('HTTP 200', False, **ctx0); continue
    rows, meta = d['rows'], d['meta']; tot = meta['totals']
    chk('rowsNumber = rows', meta['pagination']['rowsNumber'] == len(rows), **ctx0)
    exp_asof = d['day'] if lab != 'future' else None
    if lab == 'future':
        chk('S5-R1 future day is capped at today', meta['as_of_date'] < d['day'], **ctx0, as_of=meta['as_of_date'])
    else:
        chk('as_of_date = requested day (snapshot exists or today live)', meta['as_of_date'] == d['day'], **ctx0, as_of=meta['as_of_date'])
    keys = [(r['workplace_id'], r['key']) for r in rows]
    chk('S2-R2/R3 one row per part per location', len(keys) == len(set(keys)), **ctx0)
    chk('S9-R1 default sort Total Cost desc', all(rows[i]['total_cost'] >= rows[i + 1]['total_cost'] for i in range(len(rows) - 1)), **ctx0)
    if not rows:
        chk('S4-N1/S5-N1 empty -> zero totals, Margin % null', tot['qty'] == 0 and tot['total_cost'] == 0 and tot['margin_pct'] is None, **ctx0, totals=tot)
    for r in rows:
        ctx = dict(ctx0, part=r['part_number'], key=r['key'], loc=r['location'])
        chk('S2-R1 qty > 0', r['qty'] > 0, **ctx, qty=r['qty'])
        chk('S3-R7 Total Cost = Qty x Unit Cost', abs(r['total_cost'] - r['qty'] * r['unit_cost']) <= 0.5 + 0.5 * abs(r['qty']) + 1e-6, **ctx, got=r['total_cost'], exp=r['qty'] * r['unit_cost'])
        chk('S3-R6 Total Sell = Qty x Unit Sell', abs(r['total_sell'] - r['qty'] * r['unit_sell']) <= 0.5 + 0.5 * abs(r['qty']) + 1e-6, **ctx, got=r['total_sell'], exp=r['qty'] * r['unit_sell'])
        chk('S3-R8 Margin = Total Sell - Total Cost', abs(r['margin'] - (r['total_sell'] - r['total_cost'])) <= 1, **ctx, got=r['margin'], exp=r['total_sell'] - r['total_cost'])
        if r['total_sell'] <= 0:
            chk('S3-E3 Margin % blank when Total Sell <= 0', r['margin_pct'] is None, **ctx, got=r['margin_pct'])
        else:
            chk('S3-R9 Margin % = Margin / Total Sell', r['margin_pct'] is not None and abs(r['margin_pct'] - r['margin'] / r['total_sell'] * 100) <= 0.006 + 100 / r['total_sell'], **ctx, got=r['margin_pct'], exp=r['margin'] / r['total_sell'] * 100)
        if isinstance(wid, str) and wid != 'ALL':
            chk('S7-R7 Location names the row location', r['location'] == NAME[wid] and r['workplace_id'] == wid, **ctx)
    if rows:
        for f_ in ('qty', 'total_cost', 'total_sell', 'margin'):
            s_ = sum(r[f_] for r in rows)
            tol = 0.011 if f_ == 'qty' else 0.5 * len(rows) + 1
            chk(f'S4-R2 totals {f_} = sum of rows', abs(tot[f_] - s_) <= tol, **ctx0, got=tot[f_], sum=s_, diff=tot[f_] - s_)
        exp = tot['margin'] / tot['total_sell'] * 100 if tot['total_sell'] > 0 else None
        chk('S4-R3 totals Margin % = total Margin / total Total Sell', (exp is None and tot['margin_pct'] is None) or (exp is not None and tot['margin_pct'] is not None and abs(tot['margin_pct'] - exp) <= 0.006), **ctx0, got=tot['margin_pct'], exp=exp)
        avg = sum(r['margin_pct'] or 0 for r in rows) / len(rows)
# ALL = union of the four single-location reads, same day labels where the anchor day matches
for lab in ('d-1', 'd-2', 'd-7', 'd-30', 'd-60'):
    A = files.get(('ALL', lab))
    if not A: continue
    parts = []
    for wid, name, tz in WORKPLACES:
        # single reads are anchored on their own local today; compare on the same calendar day
        match = [d for (w, l), d in files.items() if w == wid and d['day'] == A['day']]
        if match: parts += match[0]['rows']
        else: parts = None; break
    if parts is None: continue
    ka = {(r['workplace_id'], r['key']): r for r in A['rows']}; kb = {(r['workplace_id'], r['key']): r for r in parts}
    chk('S7-R3 All locations = union of each location (same day)', set(ka) == set(kb) and all(ka[k] == kb[k] for k in ka), day=A['day'], n_all=len(ka), n_union=len(kb), diff=len(set(ka) ^ set(kb)))
# LAYER B — today live vs the parts list + pricing
for wid, name, tz in WORKPLACES:
    today = [d for (w, l), d in files.items() if w == wid and l == 'today'][0]
    P = json.load(open(f'{RAW}/parts/{wid}.json'))['rows']; pr = json.load(open(f'{RAW}/parts/{wid}__pricing.json'))
    mats = pr['pricing']['data']['collection']; fixed = {x['id']: x['fixedPrice'] for x in pr['fixed']['data']['parts']}
    cat2mat = {}
    for m in mats:
        for c in m['categories']: cat2mat[c] = m
    default = [m for m in mats if m.get('is_default')]
    def markup(m, cost):
        for ru in m['rules']:
            if ru['min_cost'] is not None and ru['max_cost'] is not None and float(ru['min_cost']) <= cost <= float(ru['max_cost']):
                return float(ru['markup'])
        return None
    rows = {r['key']: r for r in today['rows']}
    for p in P:
        posbins = [b['quantity'] for b in p['binLocations'] if b['quantity'] > 0]
        q = sum(posbins) if posbins else p['quantity']
        ctx = dict(loc=name, part=p['part_number'], key=p['id'])
        should = (not p['is_core']) and q > 0
        r = rows.get(p['id'])
        chk('S2-R1 row present iff non-core and on-hand > 0 (parts list)', (r is not None) == should, **ctx, qty=q, list_qty=p['quantity'], is_core=p['is_core'], present=r is not None)
        if not r: continue
        chk('S3-R3 Qty = parts-list on-hand', abs(r['qty'] - p['quantity']) < 0.005, **ctx, got=r['qty'], exp=p['quantity'], bins=[b['quantity'] for b in p['binLocations']])
        chk('S3-R4 Unit Cost = part cost (parts list)', abs(r['unit_cost'] - p['purchase_price'] * 100) <= 0.5, **ctx, got=r['unit_cost'], exp=p['purchase_price'] * 100)
        chk('S3-R5 Unit Sell = parts-list sell price ("resolved the same way the parts list resolves it")', abs(r['unit_sell'] - p['sell_price'] * 100) <= 0.5, **ctx, got=r['unit_sell'], exp=p['sell_price'] * 100, fixed=p['is_fixed_price'])
        cost = p['purchase_price']
        if p['id'] in fixed or p['is_fixed_price']:
            e = fixed.get(p['id'], p['sell_price']); how = 'fixed'
        elif not p['category']:
            e = cost; how = 'no-category'
        else:
            m = cat2mat.get(p['category']); mk = markup(m, cost) if m else None; how = 'category-matrix'
            if mk is None and default:
                mk = markup(default[0], cost); how = 'default-matrix'
            if mk is None: mk = 0.0; how = 'no-markup'
            e = cost * (1 + mk / 100)
        chk('S3-R5 Unit Sell = fixed price, else matrix markup on cost, else cost (recomputed)', abs(r['unit_sell'] - e * 100) <= 0.5 + 1e-6, **ctx, got=r['unit_sell'], exp=round(e * 100, 3), how=how, cost=cost)
        chk('S3-R14 Category / Vendor names', (r['category'] or None) == (p['category_label'] or None) and (r['vendor'] or None) == (p['vendor_name'] or None), **ctx, got=(r['category'], r['vendor']), exp=(p['category_label'], p['vendor_name']))
    chk('B every IV row exists in the parts list', set(rows) <= {p['id'] for p in P}, loc=name, extra=len(set(rows) - {p['id'] for p in P}))
import compact; compact.write('results-iv.json', res)
agg = collections.defaultdict(lambda: [0, 0])
for (c, ok), n in summ.items(): agg[c][0 if ok else 1] += n
for c, (p, f) in sorted(agg.items()): print(f'{c:100s} PASS {p:6d} FAIL {f}')
print('TOTAL', sum(v[0] for v in agg.values()), sum(v[1] for v in agg.values()))
