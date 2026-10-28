"""Read PV (today, This Year) + IV (today) for DVI Test and print the seeded ZZAUTOTEST rows. Saves snapshot to /tmp/cln/w3/reads/<label>.json"""
from common import *
WID = '39522bc6-abca-4f67-bd12-2840043c2d68'; lab = sys.argv[1]
change_loc(WID); today = dt.datetime.now(ZoneInfo(TZ[WID])).date()
out = {}
for rng, (f, t) in (('today', (today, today)), ('this_year', (dt.date(today.year, 1, 1), today))):
    st, pg, rows = pv_all(WID, f, t); out['pv_' + rng] = rows
    for r in rows:
        if 'ZZAUTOTEST' in (r['part_number'] or ''):
            print('PV', rng, {k: r[k] for k in ('type', 'part_number', 'units_sold', 'units_returned', 'sold_via_wo', 'sold_via_parts_sale', 'unit_cost', 'sell_price', 'revenue', 'margin', 'margin_pct', 'demand', 'last_sale', 'on_hand', 'turns_per_year', 'min', 'max', 'category', 'vendor')})
st, d, rows, tot = iv_all(WID, today); out['iv_today'] = rows; out['iv_totals'] = tot
for r in rows:
    if 'ZZAUTOTEST' in (r['part_number'] or ''): print('IV', {k: r[k] for k in ('part_number', 'qty', 'unit_cost', 'unit_sell', 'total_cost', 'total_sell', 'margin', 'margin_pct', 'category', 'vendor')})
print('IV totals', tot, d.get('as_of_date'))
os.makedirs('/tmp/cln/w3/reads', exist_ok=True); json.dump(out, open(f'/tmp/cln/w3/reads/{lab}.json', 'w'))
