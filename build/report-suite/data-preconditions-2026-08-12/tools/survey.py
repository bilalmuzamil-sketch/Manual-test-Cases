#!/usr/bin/env python3
"""Broad read-only survey of what data actually exists on the branch.

Every query below is a GET. The point is to answer "does this data state exist?"
before deciding whether anything needs seeding -- the brief is explicit that we
do not seed to answer a question that reading can answer.

SELF-CHECK DISCIPLINE: each probe prints the row count it actually read. A probe
that reads 0 rows proves nothing about the data unless the SAME query shape has
been shown to return rows in another state -- so counts are printed for every
call, not just the interesting ones.
"""
import json, sys, collections
import api

OUT = {}
TODAY = '2026-08-12'
Y1 = '2025-09-01'      # ~346 days, inside the 366-day server cap
MONTH = '2026-08-01'

EX = {'sbc': 'productType=all&', 'sbr': 'productType=all&invoiceStatus=all&',
      'pv': 'type=both&', 'tu': '', 'iv': '', 'wip': 'tab=ApprovedPartiallyCompleted&'}


def fetch(rep, start=Y1, end=TODAY, rows=250, extra=None, sort=None, desc='false'):
    st, b = api.report(rep, start, end, rows=rows,
                       extra=EX[rep] if extra is None else extra, sort=sort, desc=desc)
    if st != 200:
        return st, None, str(b)[:200]
    try:
        return st, api.rowsof(b), b
    except Exception as e:
        return st, None, f'SHAPE {e}'


def show(tag, rows, note=''):
    n = len(rows) if rows is not None else 'ERR'
    print(f'  {tag:52s} rows={n}  {note}')


print('=== LOCATIONS ===')
st, wps = api.get('/api/staff/my-workplaces')
wl = wps['data']['collection'] if st == 200 else []
OUT['locations'] = [{'id': w['id'], 'name': w['name'], 'tz': w.get('timezone')} for w in wl]
print(f'  accessible locations: {len(wl)}')
for w in wl:
    print(f'    {w["name"]}  {w["id"]}')

print('\n=== SALES BY CUSTOMER (range %s..%s) ===' % (Y1, TODAY))
st, sbc, raw = fetch('sbc')
show('all locations, all product types', sbc)
if sbc:
    OUT['sbc_rows'] = len(sbc)
    names = [r.get('customer_name') for r in sbc]
    locs = collections.Counter(r.get('location') for r in sbc)
    OUT['sbc_customers'] = len(set(names))
    OUT['sbc_locations_in_rows'] = dict(locs)
    neg_hrs = [r for r in sbc if (r.get('inv_hrs') or 0) < 0]
    zero_sub = [r for r in sbc if (r.get('subtotal') or 0) <= 0]
    multi_inv = [r for r in sbc if (r.get('invoice_count') or 0) >= 2]
    print(f'    distinct customers: {len(set(names))}')
    print(f'    locations appearing in rows: {dict(locs)}')
    print(f'    rows with negative Inv. Hrs: {len(neg_hrs)}')
    print(f'    rows with subtotal <= 0:     {len(zero_sub)}')
    print(f'    customers with >=2 invoices: {len(multi_inv)}')
    print(f'    total pagination: {(raw.get("data") or raw).get("pagination")}')
    OUT['sbc'] = {'customers': len(set(names)), 'neg_hrs': len(neg_hrs),
                  'zero_subtotal': len(zero_sub), 'multi_invoice': len(multi_inv),
                  'pagination': (raw.get('data') or raw).get('pagination')}

print('\n=== SALES BY REPRESENTATIVE ===')
st, sbr, raw = fetch('sbr')
show('all locations', sbr)
if sbr:
    inact = [r for r in sbr if r.get('is_inactive')]
    unass = [r for r in sbr if r.get('is_unassigned')]
    print(f'    distinct reps: {len({r.get("rep_name") for r in sbr})}')
    print(f'    inactive reps: {len(inact)}  {[r.get("rep_name") for r in inact][:5]}')
    print(f'    unassigned rows: {len(unass)}')
    print(f'    locations in rows: {dict(collections.Counter(r.get("location") for r in sbr))}')
    OUT['sbr'] = {'reps': len({r.get('rep_name') for r in sbr}), 'inactive': len(inact),
                  'unassigned': len(unass),
                  'pagination': (raw.get('data') or raw).get('pagination')}

print('\n=== PARTS VELOCITY ===')
st, pv, raw = fetch('pv')
show('type=both', pv)
if pv:
    withmin = [r for r in pv if r.get('min') not in (None, '')]
    withmax = [r for r in pv if r.get('max') not in (None, '')]
    ret = [r for r in pv if (r.get('units_returned') or 0) > 0]
    cats = collections.Counter(r.get('category') for r in pv)
    vends = collections.Counter(r.get('vendor') for r in pv)
    print(f'    parts with Min set: {len(withmin)}   with Max set: {len(withmax)}')
    print(f'    parts with returns: {len(ret)}')
    print(f'    distinct categories: {len(cats)}  vendors: {len(vends)}')
    print(f'    pagination: {(raw.get("data") or raw).get("pagination")}')
    OUT['pv'] = {'rows': len(pv), 'min': len(withmin), 'max': len(withmax),
                 'returns': len(ret), 'categories': len(cats), 'vendors': len(vends),
                 'pagination': (raw.get('data') or raw).get('pagination')}

print('\n=== TECHNICIAN UTILIZATION ===')
st, tu, raw = fetch('tu')
show('all locations', tu)
if tu:
    wo0 = [r for r in tu if (r.get('wo_seconds') or 0) == 0]
    int0 = [r for r in tu if (r.get('internal_seconds') or 0) == 0]
    both = [r for r in tu if (r.get('wo_seconds') or 0) == 0 and (r.get('internal_seconds') or 0) > 0]
    print(f'    technicians: {len(tu)}')
    print(f'    with ZERO wo_seconds:            {len(wo0)}')
    print(f'    with ZERO internal_seconds:      {len(int0)}')
    print(f'    internal>0 AND wo==0 (case 30403): {len(both)}')
    print(f'    summary: {json.dumps((raw.get("data") or raw).get("summary"))[:200]}')
    OUT['tu'] = {'techs': len(tu), 'wo_zero': len(wo0), 'internal_only': len(both)}
    for r in tu[:8]:
        print(f'      {r.get("technician_name"):28s} tot={r.get("total_seconds")} '
              f'wo={r.get("wo_seconds")} int={r.get("internal_seconds")} loc={r.get("location")}')
# the technicians list endpoint (used by the filter)
st, b = api.get(f'/api/reporting/reports/technician-utilization/technicians'
                f'?range=custom&start_date={Y1}&end_date={TODAY}')
if st == 200:
    try:
        tl = api.rowsof(b)
        print(f'    technicians offered by the FILTER: {len(tl)}')
        OUT['tu_filter_techs'] = len(tl)
    except Exception as e:
        print('    tech filter shape:', e, json.dumps(b)[:200])

print('\n=== INVENTORY VALUE ===')
st, iv, raw = fetch('iv')
show('all locations', iv)
if iv:
    d = raw.get('data') or raw
    print(f'    as_of_date: {d.get("as_of_date")}')
    locs = collections.Counter(r.get('location') for r in iv)
    pn = collections.Counter(r.get('part_number') for r in iv)
    dupe = {k: v for k, v in pn.items() if v > 1}
    print(f'    locations in rows: {dict(locs)}')
    print(f'    part numbers appearing at >1 location: {len(dupe)}  e.g. {list(dupe)[:5]}')
    print(f'    pagination: {d.get("pagination")}')
    OUT['iv'] = {'rows': len(iv), 'as_of': d.get('as_of_date'),
                 'locations': dict(locs), 'multi_loc_parts': len(dupe),
                 'pagination': d.get('pagination')}

print('\n=== WORK IN PROGRESS (per tab) ===')
TABS = ['Estimates', 'ApprovedNotStarted', 'ApprovedPartiallyCompleted', 'Completed']
OUT['wip'] = {}
for t in TABS:
    st, rows, raw = fetch('wip', extra=f'tab={t}&', sort='days_open', desc='true')
    if rows is None:
        print(f'  {t:32s} ERR {raw}')
        continue
    d = raw.get('data') or raw
    adv = {r.get('advisor') for r in rows}
    cust = {r.get('customer') for r in rows}
    vin = [r for r in rows if r.get('vin')]
    unit = [r for r in rows if not r.get('vin') and r.get('unit_number')]
    neither = [r for r in rows if not r.get('vin') and not r.get('unit_number')]
    print(f'  {t:32s} rows={len(rows):4d} advisors={len(adv)} customers={len(cust)} '
          f'vin={len(vin)} unit-only={len(unit)} neither={len(neither)}')
    OUT['wip'][t] = {'rows': len(rows), 'advisors': len(adv), 'customers': len(cust),
                     'vin': len(vin), 'unit_only': len(unit), 'neither': len(neither),
                     'statuses': dict(collections.Counter(r.get('status') for r in rows)),
                     'locations': dict(collections.Counter(r.get('location') for r in rows))}
    if t == 'ApprovedPartiallyCompleted':
        print(f'      tab_counts: {d.get("tab_counts")}')
        OUT['wip_tab_counts'] = d.get('tab_counts')
        print(f'      statuses: {OUT["wip"][t]["statuses"]}')
        print(f'      locations: {OUT["wip"][t]["locations"]}')

print(f'\n=== API CALLS: {api.CALLS} ===')
json.dump(OUT, open('/tmp/rs812/survey.json', 'w'), indent=1)
print('written /tmp/rs812/survey.json')
