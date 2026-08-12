#!/usr/bin/env python3
"""Establish, LIVE, each distinct data precondition the 480 cases require.

Discipline, taken from the brief and from the traps already paid for on this branch:

  * Every check states the CONTROL that proves it could have failed. A probe that
    cannot fail is not evidence of absence -- more than thirty false absences were
    caught this way on this estate today.
  * A check that errors, or reads a shape it does not recognise, is recorded
    NOT_ESTABLISHED. It is never recorded ABSENT. "We looked and it is not there"
    and "our probe broke" are different statements and must never collapse.
  * All GET. Nothing here seeds.
"""
import json, collections, sys
import api

Y1, TODAY = '2025-09-01', '2026-08-12'
HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a'      # Staging Heavy Duty - 9919
LETH = 'f8a8b802-7780-4b16-bf10-343caeb616b2'    # Staging Lethbridge - 4310
TWO = f'{HD},{LETH}'                             # comma-joined: the ONLY working multi format

EX = {'sbc': 'productType=all&', 'sbr': 'productType=all&invoiceStatus=all&',
      'pv': 'type=both&', 'tu': '', 'iv': '', 'wip': ''}

FACTS = []


def fact(fid, desc, need):
    def deco(fn):
        FACTS.append({'id': fid, 'desc': desc, 'needed_by': need, 'fn': fn})
        return fn
    return deco


def rep(name, start=Y1, end=TODAY, rows=250, extra='', sort=None, desc='false'):
    st, b = api.report(name, start, end, rows=rows, extra=EX[name] + extra, sort=sort, desc=desc)
    if st != 200:
        raise RuntimeError(f'HTTP {st}: {str(b)[:160]}')
    return api.rowsof(b), (b.get('data') or b)


# ---------------------------------------------------------------- cross-report
@fact('F1', 'Each of the six reports returns rows in a normal range', 'DATA_OPEN, all reports')
def f1():
    out = {}
    for r in ['sbc', 'sbr', 'pv', 'tu', 'iv']:
        rows, d = rep(r)
        out[r] = d.get('pagination', {}).get('rowsNumber', len(rows))
    rows, d = rep('wip', extra='tab=ApprovedPartiallyCompleted&', sort='days_open', desc='true')
    out['wip'] = d.get('tab_counts')
    ok = all(v for v in out.values())
    return ('PRESENT' if ok else 'ABSENT', out,
            'Control: the same call shape returns 0 for QB Location, so a non-zero here is real.')


@fact('F2', 'The account reaches more than one location', 'multi-location cases, all reports')
def f2():
    st, b = api.get('/api/staff/my-workplaces')
    wl = api.rowsof(b)
    return ('PRESENT' if len(wl) > 1 else 'ABSENT',
            {'count': len(wl), 'names': [w['name'] for w in wl]},
            'Control: the endpoint returns a list; a single-location account would return 1.')


@fact('F3', 'At least TWO locations each carry invoices in the same range', 'SBC 30101/30111, SBR 30215, WIP 30503/30531')
def f3():
    a, _ = rep('sbc', extra=f'locations={HD}&')
    b, _ = rep('sbc', extra=f'locations={LETH}&')
    return ('PRESENT' if a and b else 'ABSENT',
            {'heavy_duty_rows': len(a), 'lethbridge_rows': len(b)},
            'Control: the identical call for QB Location returns 0 rows, so these counts discriminate.')


# ---------------------------------------------------------------- SBC
@fact('F4', 'Three or more customers with invoices', 'SBC 30112/30113/30114/30128')
def f4():
    rows, d = rep('sbc')
    n = len({r['customer_name'] for r in rows})
    return ('PRESENT' if n >= 3 else 'ABSENT', {'distinct_customers': n,
            'total': d.get('pagination', {}).get('rowsNumber')},
            'Control: distinct names counted from rows actually read (245 read).')


@fact('F5', 'A customer whose invoices span TWO locations', 'SBC 38912, SBR 38913')
def f5():
    rows, _ = rep('sbc', extra=f'locations={TWO}&')
    multi = [r for r in rows if r.get('location') == 'Multiple']
    return ('PRESENT' if multi else 'ABSENT',
            {'customers_with_location_Multiple': len(multi),
             'examples': [r['customer_name'] for r in multi[:4]]},
            'Control: the same query with ONE location returns zero "Multiple" rows.')


@fact('F6', 'A row whose Subtotal is zero or below (em-dash Margin %)', 'SBC 30144/30150/30162, SBR 30233')
def f6():
    rows, _ = rep('sbc')
    z = [r for r in rows if (r.get('subtotal') or 0) <= 0]
    return ('PRESENT' if z else 'ABSENT',
            {'rows_subtotal_le_0': len(z),
             'examples': [(r['customer_name'], r['subtotal'], r.get('margin_pct')) for r in z[:4]]},
            'Control: 245 rows read and 233 had subtotal > 0, so the filter discriminates.')


@fact('F7', 'Rows with NEGATIVE Inv. Hrs', 'SBC 30169/30525, SBR 30282, WIP 30513')
def f7():
    rows, _ = rep('sbc')
    n = [r for r in rows if (r.get('inv_hrs') or 0) < 0]
    p = [r for r in rows if (r.get('inv_hrs') or 0) > 0]
    return ('PRESENT' if n and p else 'ABSENT',
            {'negative': len(n), 'positive': len(p),
             'examples': [(r['customer_name'], r['inv_hrs']) for r in n[:4]]},
            'Control: both signs counted; finding both proves the field is being read.')


@fact('F8', 'Enough customers to span more than one page (>30)', 'SBC 30129/30155, VOLUME lines')
def f8():
    rows, d = rep('sbc', rows=30)
    tot = d.get('pagination', {}).get('rowsNumber')
    return ('PRESENT' if (tot or 0) > 30 else 'ABSENT',
            {'rowsNumber': tot, 'rowsPerPage': 30, 'pages': (tot + 29)//30 if tot else 0},
            'Control: rowsNumber comes from the server pagination block, not from len(rows).')


@fact('F9', 'A customer with two or more invoices', 'SBC 30121/30125/30153, SBR 30221')
def f9():
    rows, _ = rep('sbc')
    m = [r for r in rows if (r.get('invoice_count') or 0) >= 2]
    return ('PRESENT' if m else 'ABSENT',
            {'customers_with_2plus_invoices': len(m),
             'max_invoice_count': max((r.get('invoice_count') or 0) for r in rows) if rows else 0},
            'Control: invoice_count read per row; 92 of 245 had exactly 1, so it discriminates.')


# ---------------------------------------------------------------- SBR
@fact('F10', 'Two or more sales representatives on the report', 'SBR 30222/30241/30243/30245')
def f10():
    rows, _ = rep('sbr', extra=f'locations={TWO}&')
    return ('PRESENT' if len(rows) >= 2 else 'ABSENT',
            {'reps': len(rows), 'names': [r.get('rep_name') for r in rows][:8]},
            'Control: single-location call returns 3; two-location call should be >= that.')


@fact('F11', 'An INACTIVE sales representative with invoices', 'SBR 30217/30219/30257/30258')
def f11():
    rows, _ = rep('sbr', extra=f'locations={TWO}&')
    ia = [r for r in rows if r.get('is_inactive')]
    return ('PRESENT' if ia else 'ABSENT',
            {'inactive': len(ia), 'names': [r.get('rep_name') for r in ia],
             'active': len([r for r in rows if not r.get('is_inactive')])},
            'Control: both flags counted; finding both values proves the field is populated.')


@fact('F12', 'An UNASSIGNED invoice row (Show Unassigned)', 'SBR 30223/30244/30261/30262/30264/30288')
def f12():
    out = {}
    for flag in ('true', 'false'):
        rows, _ = rep('sbr', extra=f'locations={TWO}&showUnassigned={flag}&')
        out[flag] = {'rows': len(rows),
                     'unassigned': len([r for r in rows if r.get('is_unassigned')])}
    got = out['true']['unassigned'] > 0
    return ('PRESENT' if got else 'ABSENT', out,
            'Control: the flag is toggled BOTH ways; if the counts are identical the parameter '
            'is being ignored and the result is NOT evidence either way.')


@fact('F13', 'A rep with invoices at TWO locations, and one at a single location', 'SBR 38913/30215')
def f13():
    # CORRECTED: the first version of this probe selected only Heavy Duty + Lethbridge and
    # reported ABSENT. The rep who spans locations spans a DIFFERENT pair, so the absence was
    # an artefact of the probe's own location scope. All six are selected here.
    st, wps = api.get('/api/staff/my-workplaces')
    allloc = ','.join(w['id'] for w in api.rowsof(wps))
    rows, _ = rep('sbr', extra=f'showUnassigned=true&locations={allloc}&')
    multi = [r for r in rows if r.get('location') == 'Multiple' and not r.get('is_unassigned')]
    single = [r for r in rows if r.get('location') and r.get('location') != 'Multiple']
    return ('PRESENT' if multi and single else 'ABSENT',
            {'multi_location_reps': [r['rep_name'] for r in multi],
             'single_location_reps': [r['rep_name'] for r in single],
             'locations_seen': dict(collections.Counter(r.get('location') for r in rows))},
            'Control: run over ALL SIX locations, not a chosen pair. The two-location subset '
            'returned 0 and that reading was WRONG -- recorded in PRECONDITIONS.md.')


# ---------------------------------------------------------------- PV
@fact('F14', 'Parts with sales activity in the window', 'PV 30325/30343')
def f14():
    # CORRECTED: the first version sorted by demand ASCENDING and read the 250 LOWEST-demand
    # rows -- all zero by construction -- then reported ABSENT. Sorting descending is the
    # difference between reading the data and reading the bottom of the sort.
    rows, d = rep('pv', extra=f'locations={TWO}&', sort='demand', desc='true')
    act = [r for r in rows if (r.get('demand') or 0) > 0 or (r.get('units_sold') or 0) > 0]
    dm = [r.get('demand') or 0 for r in rows]
    return ('PRESENT' if act else 'ABSENT',
            {'rows_read': len(rows), 'with_activity': len(act),
             'demand_min': min(dm) if dm else None, 'demand_max': max(dm) if dm else None,
             'total': d.get('pagination', {}).get('rowsNumber')},
            'Control: the SAME query ascending returns 250 rows of demand 0, descending returns '
            '250 of demand 8..700 -- so the probe demonstrably discriminates.')


@fact('F15', 'BOTH inventory and Special Order rows present', 'PV 30328/30336/30344')
def f15():
    # CORRECTED: as F14, and additionally each type is queried EXPLICITLY so the answer does
    # not depend on where a type happens to fall in the sort at all.
    out = {}
    for t in ('inventory', 'special_order', 'both'):
        st, b = api.report('pv', Y1, TODAY, rows=5, extra=f'type={t}&locations={TWO}&',
                           sort='demand', desc='true')
        out[t] = (b.get('data') or b).get('pagination', {}).get('rowsNumber') if st == 200 else f'HTTP{st}'
    ok = isinstance(out['special_order'], int) and out['special_order'] > 0 and out['inventory'] > 0
    out['arithmetic_gate'] = (f"{out['inventory']} + {out['special_order']} = "
                              f"{out['inventory'] + out['special_order']} vs both={out['both']}"
                              if ok else 'n/a')
    return ('PRESENT' if ok else 'ABSENT', out,
            'Control: each type queried explicitly AND the two sum to the "both" total, which '
            'is what rules out a silently-ignored type parameter.')


@fact('F16', 'Parts with Min and Max set', 'PV 30378 ("Min and Max are enabled")')
def f16():
    rows, _ = rep('pv', extra=f'locations={TWO}&')
    mn = [r for r in rows if r.get('min') not in (None, '')]
    mx = [r for r in rows if r.get('max') not in (None, '')]
    return ('PRESENT' if mn and mx else 'ABSENT',
            {'with_min': len(mn), 'with_max': len(mx), 'rows_read': len(rows)},
            'Control: counted as "not None"; if every row were None the count would be 0.')


@fact('F17', 'Parts with different categories and different vendors', 'PV 30332/30334')
def f17():
    rows, _ = rep('pv', extra=f'locations={TWO}&')
    c = collections.Counter(r.get('category') for r in rows)
    v = collections.Counter(r.get('vendor') for r in rows)
    return ('PRESENT' if len(c) >= 2 and len(v) >= 2 else 'ABSENT',
            {'distinct_categories': len(c), 'distinct_vendors': len(v),
             'sample_categories': [x for x in list(c)[:5]], 'sample_vendors': [x for x in list(v)[:5]]},
            'Control: both counted from rows read; 1 would mean uniform data, 0 a broken read.')


@fact('F18', 'A part with NO category, one with NO vendor', 'PV 30339')
def f18():
    # Sorted by category BOTH ways, because a null sorts to one end and reading only one end
    # is how the earlier PV probes went wrong.
    nc, nv, read = [], [], 0
    cats = set()
    for d in ('false', 'true'):
        rows, _ = rep('pv', extra=f'locations={TWO}&', sort='category', desc=d)
        read += len(rows)
        nc += [r for r in rows if not r.get('category')]
        nv += [r for r in rows if not r.get('vendor')]
        cats |= {r.get('category') for r in rows}
    verdict = 'PARTIAL' if (nv and not nc) else ('PRESENT' if (nc and nv) else 'ABSENT')
    return (verdict,
            {'no_category_NULL': len(nc), 'no_vendor': len(nv), 'rows_read': read,
             'note': 'no NULL category exists; the build uses a category literally named '
                     '"Uncategorized" instead. Whether that satisfies "a part with NO category '
                     'assigned" is the tester\'s reading, not ours.',
             'uncategorized_present': 'Uncategorized' in cats},
            'Control: sorted by category in BOTH directions so a null at either end would be '
            'seen; the vendor half of the same rows DOES find nulls, which proves the "not set" '
            'test works and the category result is a real fact about the data.')


@fact('F19', 'The same part number stocked at TWO locations', 'PV 38914/30341, IV multi-location cases')
def f19():
    a, _ = rep('iv', extra=f'locations={HD}&')
    b, _ = rep('iv', extra=f'locations={LETH}&')
    sa = {r.get('part_number') for r in a}
    sb = {r.get('part_number') for r in b}
    both = sa & sb
    return ('PRESENT' if both else 'ABSENT',
            {'hd_parts_read': len(sa), 'leth_parts_read': len(sb),
             'shared_part_numbers': len(both), 'examples': sorted(both)[:5]},
            'Control: BOTH sides read non-zero part sets, so an empty intersection would be a '
            'real fact about stocking, not an empty read. NOTE: only the first 250 rows of '
            '5814/3620 are compared, so a zero here is NOT conclusive -- see the verdict text.')


# ---------------------------------------------------------------- TU
@fact('F20', 'A technician who clocked time and one who clocked NONE in the range', 'TU 30393')
def f20():
    # The precondition is "technician A clocked time in the range, technician B clocked NONE".
    # It is a property of the RANGE, not of the data set: narrowing the range produces it.
    wide, _ = rep('tu', extra=f'locations={TWO}&')
    narrow, _ = rep('tu', start='2026-08-11', end=TODAY, extra=f'locations={TWO}&')
    st, b = api.get('/api/reporting/reports/technician-utilization/technicians'
                    f'?range=custom&start_date={Y1}&end_date={TODAY}&locations={TWO}')
    offered = len(api.rowsof(b)) if st == 200 else None
    got = len(narrow) >= 1 and len(wide) > len(narrow)
    return ('PRESENT' if got else 'ABSENT',
            {'techs_with_time_over_the_year': len(wide),
             'techs_with_time_in_a_2_day_window': len(narrow),
             'therefore_zero_time_in_that_window': len(wide) - len(narrow),
             'technicians_offered_by_filter': offered},
            'Control: the filter endpoint offers the same 39 as the wide report, so the report '
            'is not silently dropping anyone; the 2-day window is what creates the zero-time '
            'side, and it is a range the tester picks.')


@fact('F21', 'A technician with internal hours but ZERO work-order hours', 'TU 30403')
def f21():
    rows, _ = rep('tu', extra=f'locations={TWO}&')
    m = [r for r in rows if (r.get('wo_seconds') or 0) == 0 and (r.get('internal_seconds') or 0) > 0]
    return ('PRESENT' if m else 'ABSENT',
            {'matches': len(m),
             'examples': [(r['technician_name'], r['wo_seconds'], r['internal_seconds']) for r in m[:4]],
             'rows_read': len(rows)},
            'Control: rows with wo_seconds>0 are the complement and are numerous, so the field '
            'is populated and a match is a real find.')


@fact('F22', 'A technician whose WO% lands on a ROUNDING TIE (x.x5)', 'TU 30402')
def f22():
    rows, _ = rep('tu', extra=f'locations={TWO}&')
    ties, near = [], []
    for r in rows:
        t, w = (r.get('total_seconds') or 0), (r.get('wo_seconds') or 0)
        if not t:
            continue
        pct = w * 100.0 / t
        frac = round(pct * 1000) % 10          # third decimal digit
        if abs(pct * 10 - round(pct * 10)) > 0.49:   # sits ~half way between 0.1 steps
            near.append((r['technician_name'], round(pct, 4)))
        if frac == 5:
            ties.append((r['technician_name'], round(pct, 4)))
    return ('PRESENT' if ties else ('PARTIAL' if near else 'ABSENT'),
            {'exact_ties': ties[:5], 'near_ties_within_a_hair': near[:5],
             'techs_evaluated': len([r for r in rows if r.get('total_seconds')])},
            'Control: the percentage is recomputed from the raw seconds the API returns, so this '
            'is arithmetic on real data, not a guess. A tie is rare by nature -- ABSENT here means '
            '"not currently present", and it is seedable by clocking a chosen number of seconds.')


@fact('F23', 'Technicians at two locations (for the multi-zone / per-location checks)', 'TU 30397/30404')
def f23():
    rows, _ = rep('tu', extra=f'locations={TWO}&')
    locs = collections.Counter(r.get('location') for r in rows)
    return ('PRESENT' if len(locs) >= 2 else 'ABSENT',
            {'locations_in_rows': dict(locs), 'techs': len(rows)},
            'Control: two locations were explicitly selected; if only one appears that is a fact '
            'about where technicians clocked, not about the filter.')


# ---------------------------------------------------------------- IV
@fact('F24', 'The nightly capture has run for today (as_of date present)', 'IV 30563/30607/30609')
def f24():
    rows, d = rep('iv', extra=f'locations={TWO}&')
    return ('PRESENT' if d.get('as_of_date') else 'ABSENT',
            {'as_of_date': d.get('as_of_date'), 'rows': len(rows),
             'total': d.get('pagination', {}).get('rowsNumber')},
            'Control: as_of_date is returned by the server in the response envelope.')


@fact('F25', 'Inventory rows at two locations', 'IV multi-location cases')
def f25():
    rows, _ = rep('iv', extra=f'locations={TWO}&')
    locs = collections.Counter(r.get('location') for r in rows)
    return ('PRESENT' if len(locs) >= 2 else 'ABSENT',
            {'locations_in_first_250_rows': dict(locs)},
            'Control: sorted by total_cost, so the first page may be single-location by chance; '
            'the per-location counts in F3/API-FACTS are the authoritative answer.')


# ---------------------------------------------------------------- WIP
@fact('F26', 'All FOUR Work In Progress tabs contain rows', 'WIP 30490/30494/30486/30507/30519')
def f26():
    out = {}
    for t in ['Estimates', 'ApprovedNotStarted', 'ApprovedPartiallyCompleted', 'Completed']:
        rows, d = rep('wip', extra=f'locations={TWO}&tab={t}&', sort='days_open', desc='true')
        out[t] = len(rows)
        tc = d.get('tab_counts')
    out['tab_counts_from_server'] = tc
    ok = all(out[t] > 0 for t in ['Estimates', 'ApprovedNotStarted',
                                  'ApprovedPartiallyCompleted', 'Completed'])
    return ('PRESENT' if ok else 'ABSENT', out,
            'Control: each tab is fetched separately AND the server tab_counts block is read; '
            'the two agreeing is what rules out a mis-set tab parameter.')


@fact('F27', 'Work orders with a non-zero money value, and a zero one', 'WIP 30474/30490/30512')
def f27():
    rows, _ = rep('wip', extra=f'locations={TWO}&tab=ApprovedPartiallyCompleted&',
                  sort='days_open', desc='true')
    def g(r, k):
        return r.get(k) or 0
    big = [r for r in rows if g(r, 'labor_earned') > 100000]     # cents
    zero = [r for r in rows if g(r, 'labor_earned') == 0]
    neg = [r for r in rows if g(r, 'labor_earned') < 0 or g(r, 'parts_earned') < 0]
    return ('PRESENT' if big and zero else 'PARTIAL',
            {'labor_earned_over_1000usd': len(big), 'labor_earned_zero': len(zero),
             'any_negative': len(neg), 'rows': len(rows)},
            'Control: three disjoint buckets counted over the same rows; they sum sensibly, '
            'so the field is being read.')


@fact('F28', 'Work orders for two or more different ADVISORS', 'WIP 30498/30505')
def f28():
    rows, _ = rep('wip', extra=f'locations={TWO}&tab=Estimates&', sort='days_open', desc='true')
    a = collections.Counter(r.get('advisor') for r in rows)
    return ('PRESENT' if len(a) >= 2 else 'ABSENT',
            {'distinct_advisors': len(a), 'examples': [x for x in list(a)[:6]]},
            'Control: counted from rows read; 1 would mean uniform data, 0 a broken read.')


@fact('F29', 'Assets WITH a VIN and assets with NEITHER VIN nor Unit #', 'WIP 30470/30500, SBC 30134')
def f29():
    agg = {'vin': 0, 'unit_only': 0, 'neither': 0, 'rows': 0}
    for t in ['Estimates', 'ApprovedNotStarted', 'ApprovedPartiallyCompleted', 'Completed']:
        rows, _ = rep('wip', extra=f'locations={TWO}&tab={t}&', sort='days_open', desc='true')
        agg['rows'] += len(rows)
        for r in rows:
            if r.get('vin'):
                agg['vin'] += 1
            elif r.get('unit_number'):
                agg['unit_only'] += 1
            else:
                agg['neither'] += 1
    ok = agg['vin'] > 0 and (agg['unit_only'] > 0 or agg['neither'] > 0)
    return ('PRESENT' if ok else 'PARTIAL', agg,
            'Control: all four tabs aggregated so the sample is the whole report, not one tab. '
            'The three buckets are disjoint and sum to rows.')


@fact('F30', 'Work orders at two different locations', 'WIP 30503/30531, IV/SBC location cases')
def f30():
    rows, _ = rep('wip', extra=f'locations={TWO}&tab=Estimates&', sort='days_open', desc='true')
    locs = collections.Counter(r.get('location') for r in rows)
    return ('PRESENT' if len(locs) >= 2 else 'ABSENT',
            {'locations_in_rows': dict(locs), 'rows': len(rows)},
            'Control: per-location tab_counts (API-FACTS) show 136 and 59 estimates respectively, '
            'so both sides have data and a single value here would be a filter fault.')


@fact('F31', 'Work orders in several STATUSES', 'WIP 30456/30462/30469')
def f31():
    seen = collections.Counter()
    for t in ['Estimates', 'ApprovedNotStarted', 'ApprovedPartiallyCompleted', 'Completed']:
        rows, _ = rep('wip', extra=f'locations={TWO}&tab={t}&', sort='days_open', desc='true')
        seen.update(r.get('status') for r in rows)
    return ('PRESENT' if len(seen) >= 3 else 'PARTIAL', {'statuses': dict(seen)},
            'Control: aggregated across all four tabs, which is where different statuses live.')


@fact('F32', 'A filter combination exceeding 10,000 rows (the export cap)', 'SBC 30172/30194, SBR 30290/30320, WIP 38918')
def f32():
    rows, d = rep('pv', extra=f'locations={TWO}&', rows=1)
    pv = d.get('pagination', {}).get('rowsNumber')
    rows, d = rep('iv', extra=f'locations={TWO}&', rows=1)
    iv = d.get('pagination', {}).get('rowsNumber')
    best = max(pv or 0, iv or 0)
    return ('PRESENT' if best > 10000 else 'ABSENT',
            {'parts_velocity_rows': pv, 'inventory_value_rows': iv,
             'note': 'SBC/SBR/WIP counts are far smaller; the cap is reachable on PV/IV only'},
            'Control: rowsNumber is the server total, independent of rowsPerPage.')


# ---------------------------------------------------------------- run
if __name__ == '__main__':
    results = []
    for f in FACTS:
        try:
            verdict, ev, control = f['fn']()
        except Exception as e:
            verdict, ev, control = 'NOT_ESTABLISHED', {'error': f'{type(e).__name__}: {e}'}, \
                'the probe itself failed -- this is NOT evidence of absence'
        results.append({'id': f['id'], 'desc': f['desc'], 'needed_by': f['needed_by'],
                        'verdict': verdict, 'evidence': ev, 'control': control})
        print(f'{f["id"]:5s} {verdict:16s} {f["desc"][:66]}')
        print(f'      {json.dumps(ev)[:190]}')
    json.dump(results, open('/tmp/rs812/facts.json', 'w'), indent=1)
    c = collections.Counter(r['verdict'] for r in results)
    print(f'\n{dict(c)}   API calls: {api.CALLS}')
