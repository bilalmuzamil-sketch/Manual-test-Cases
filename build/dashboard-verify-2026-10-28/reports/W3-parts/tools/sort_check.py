"""Every sortable column, both directions, read in full (all pages) — PV (Lethbridge, This Month) S3-R3 and
IV (Lethbridge, today) S9-R2/R3: rows in the requested order, text case-insensitive, nulls first ascending /
last descending, every page joined. Writes ../results-sort.json."""
from common import *
import collections, functools
LE = 'f8a8b802-7780-4b16-bf10-343caeb616b2'
change_loc(LE)
today = dt.datetime.now(ZoneInfo(TZ[LE])).date()
PV_COLS = ['type', 'part_number', 'description', 'category', 'vendor', 'units_sold', 'units_returned', 'sold_via_wo', 'sold_via_parts_sale', 'unit_cost', 'sell_price', 'revenue', 'margin', 'margin_pct', 'demand', 'last_sale', 'on_hand', 'turns_per_year', 'min', 'max']
IV_COLS = ['part_number', 'description', 'category', 'vendor', 'qty', 'unit_cost', 'unit_sell', 'margin', 'margin_pct', 'total_sell', 'total_cost']
TEXT = {'type', 'part_number', 'description', 'category', 'vendor'}
res = []
def ordered(vals, desc, text):
    bad = 0; seen_nonnull = False
    for i in range(len(vals) - 1):
        a, b = vals[i], vals[i + 1]
        if a is None and b is None: continue
        if not desc and a is not None and b is None: bad += 1; continue      # nulls first ascending
        if desc and a is None and b is not None: bad += 1; continue          # nulls last descending
        if a is None or b is None: continue
        if text: a, b = str(a).lower(), str(b).lower()
        if (a > b if not desc else a < b): bad += 1
    return bad
for rep, cols in (('pv', PV_COLS), ('iv', IV_COLS)):
    for c in cols:
        for desc in (False, True):
            if rep == 'pv': st, pg, rows = pv_all(LE, today.replace(day=1), today, 'both', (), c, desc)
            else: st, d, rows, tot = iv_all(LE, today, (), c, desc)
            vals = [r.get(c) for r in rows]
            bad = ordered(vals, desc, c in TEXT) if st == 200 else -1
            res.append(dict(check=f'{rep.upper()} sort {c} {"desc" if desc else "asc"}', ok=st == 200 and bad == 0, rows=len(rows), out_of_order=bad,
                            first=vals[:3], last=vals[-3:]))
            print(res[-1]['check'], st, len(rows), 'out_of_order', bad, flush=True)
json.dump(res, open('../results-sort.json', 'w'))
