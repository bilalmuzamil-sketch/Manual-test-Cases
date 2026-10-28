#!/usr/bin/env python3
"""W2 FULL collection: Sales By Customer, Sales By Representative, Sales Tax Collected, Technician
Efficiency (both tabs, summary + expanded). Every location x 16 ranges (9 presets + 7 custom edges).
Raw responses -> /tmp/cln/w2/<wid>/... (staging business data stays out of git). SECRET-FREE.
Usage: collect_w2.py [location-name-substring]"""
import json, os, sys, time
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import quote
sys.path.insert(0, os.path.dirname(__file__))
from common import *

LABELS = list(ranges(dt.date(2026, 10, 28)).keys())
PRESETS = ['last_12_months', 'this_year', 'last_year', 'this_quarter', 'last_quarter', 'this_month',
           'last_month', 'this_week', 'last_week']
DRILL = ['last_12_months', 'last_year']


def save(wid, name, obj):
    d = os.path.join(RAW, wid); os.makedirs(d, exist_ok=True)
    json.dump(obj, open(os.path.join(d, name + '.json'), 'w'))


def paged(path, params, wid, per=1000, key='collection'):
    out, pg, meta = [], 1, None
    while True:
        c, b = get(path, params + [('pagination[page]', pg), ('pagination[rowsPerPage]', per)], wid)
        if c != 200:
            return c, {'error': b, 'collection': out}
        d = b['data']; meta = d
        if pg > 1 and d[key] and out and json.dumps(d[key][0]) == json.dumps(out[0]):
            break                                     # endpoint ignores the page parameter: page 1 was already everything
        out += d[key]
        total = (d.get('pagination') or {}).get('rowsNumber')
        if len(d[key]) < per or (total is not None and len(out) >= total):
            break
        pg += 1
    meta = dict(meta); meta[key] = out
    return 200, meta


def sbc(wid):
    for lab in LABELS:
        f, t, s, e = win(wid, lab)
        for pt in ('all', 'parts', 'service', 'none'):
            W = [('range', 'custom'), ('start_date', s), ('end_date', e), ('productType', pt), ('locations', wid),
                 ('pagination[sortBy]', 'subtotal'), ('pagination[descending]', 'true')]
            c, d = paged('/api/reporting/reports/sales-by-customer', W, wid)
            save(wid, f'sbc__{lab}__{pt}', {'from': str(f), 'to': str(t), 'start': s, 'end': e, 'status': c, 'data': d})
    for lab in DRILL:
        f, t, s, e = win(wid, lab)
        base = [('range', 'custom'), ('start_date', s), ('end_date', e), ('productType', 'all'), ('locations', wid)]
        summ = json.load(open(os.path.join(RAW, wid, f'sbc__{lab}__all.json')))['data']['collection']
        def drill(cust):
            ca, a = paged(f'/api/reporting/reports/sales-by-customer/{cust["key"]}/assets', base, wid)
            assets = []
            for asset in (a.get('collection') or []):
                ci, inv = paged(f'/api/reporting/reports/sales-by-customer/{cust["key"]}/assets/{quote(asset["key"], safe="")}/invoices', base, wid)
                assets.append({'asset': asset, 'status': ci, 'invoices': inv.get('collection')})
            return {'customer': cust, 'status': ca, 'assets': assets}
        with ThreadPoolExecutor(6) as ex:
            tree = list(ex.map(drill, summ))
        save(wid, f'sbc_tree__{lab}', {'from': str(f), 'to': str(t), 'tree': tree})


def sbr(wid):
    for lab in LABELS:
        f, t, s, e = win(wid, lab)
        combos = [(st, un, 'all') for st in ('all', 'paid', 'partially_paid', 'unpaid') for un in ('0', '1')]
        combos += [('all', '1', 'parts'), ('all', '1', 'service'), ('all', '1', 'none'), ('paid,unpaid', '1', 'all')]
        for st, un, pt in combos:
            W = [('range', 'custom'), ('start_date', s), ('end_date', e), ('productType', pt), ('invoiceStatus', st),
                 ('locations', wid), ('showUnassigned', un)]
            c, d = paged('/api/reporting/reports/sales-by-representative', W, wid)
            save(wid, f'sbr__{lab}__{st}__{un}__{pt}', {'from': str(f), 'to': str(t), 'status': c, 'data': d})
    for lab in DRILL:
        f, t, s, e = win(wid, lab)
        base = [('range', 'custom'), ('start_date', s), ('end_date', e), ('productType', 'all'), ('invoiceStatus', 'all'), ('locations', wid)]
        summ = json.load(open(os.path.join(RAW, wid, f'sbr__{lab}__all__1__all.json')))['data']['collection']
        def drill(rep):
            c, d = paged(f'/api/reporting/reports/sales-by-representative/{quote(rep["key"], safe="")}/invoices', base, wid)
            return {'rep': rep, 'status': c, 'invoices': d.get('collection')}
        with ThreadPoolExecutor(6) as ex:
            save(wid, f'sbr_tree__{lab}', {'from': str(f), 'to': str(t), 'tree': list(ex.map(drill, summ))})


def tax(wid):
    for lab in LABELS:
        f, t, s, e = win(wid, lab)
        for st in ([], ['paid'], ['partially_paid'], ['unpaid'], ['paid', 'partially_paid', 'unpaid']):
            W = [('dateRange', 'custom'), ('startDate', s), ('endDate', e)] + [('statuses[]', x) for x in st]
            c, d = paged('/api/reporting/sales-tax-report', W, wid, per=500)
            save(wid, f'tax__{lab}__{"-".join(st) or "default"}', {'from': str(f), 'to': str(t), 'status': c, 'data': d})
    for p in PRESETS + ['today', 'yesterday']:
        c, d = paged('/api/reporting/sales-tax-report', [('dateRange', p)], wid, per=500)
        save(wid, f'tax_preset__{p}', {'status': c, 'data': d})


def te(wid):
    for lab in LABELS:
        f, t, s, e = win(wid, lab)
        W = [('range', 'custom'), ('start_date', s), ('end_date', e)]
        for tab, base in (('inv', '/api/reporting/technician-efficiency'), ('cmp', '/api/reporting/technician-efficiency-completed')):
            c, b = get(base + '/custom', W, wid)
            rows = (b or {}).get('data', {}).get('collection', []) if c == 200 else []
            ids = [r['technicianId'] for r in rows]
            c2, b2 = (get(base + '/expanded/custom', W + [('staff_ids[]', i) for i in ids], wid) if ids else (200, {'data': {'collection': []}}))
            save(wid, f'te_{tab}__{lab}', {'from': str(f), 'to': str(t), 'status': c, 'summary': b, 'xstatus': c2, 'expanded': b2})
    for p in PRESETS + ['today', 'yesterday']:
        for tab, base in (('inv', '/api/reporting/technician-efficiency'), ('cmp', '/api/reporting/technician-efficiency-completed')):
            c, b = get(f'{base}/{p}', [('range', p)], wid)
            save(wid, f'te_{tab}_preset__{p}', {'status': c, 'summary': b})


def main(only=None):
    for wid, name, tz in WORKPLACES:
        if only and only not in name: continue
        print(name, 'change-location', loc(wid)[0], flush=True)
        for fn in (sbc, sbr, tax, te):
            t0 = time.time(); fn(wid); print(name, fn.__name__, round(time.time() - t0), 's', flush=True)
    open(os.path.join(RAW, 'DONE'), 'w').write(dt.datetime.utcnow().isoformat())


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else None)
