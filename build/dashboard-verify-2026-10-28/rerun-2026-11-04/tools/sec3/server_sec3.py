#!/usr/bin/env python3
"""Section-3 server re-check (read-only), 4 Nov 2026, each location in its own zone read live (Rule 99).
  d7  <DVI|HD>: Customer Invoice export (the request Export Reports sends) - Terms/InvoiceDate/DueDate for the named invoice,
                plus the invoice record and the customer card.
  pay <DVI|HD> <employee> <from> <to>: Payroll Timesheet export (Custom 1 Jan..today) rows for the person and days, next to
                Timesheet Activities' own per-day rows for the same days and the expected per-day figure = union of that day's
                clock time (overlap once, split at local midnight).
Usage: TZ=<zone> python3 server_sec3.py <mode> ..."""
import csv, io, json, os, sys, datetime as dt
from zoneinfo import ZoneInfo
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from s3 import use, get, instants, dump
mode, key = sys.argv[1], sys.argv[2]
L = use(key); W, tz = L['wid'], L['tz']; Z = ZoneInfo(tz); today = dt.datetime.now(Z).date()
out = {'mode': mode, 'zones': L, 'local_today': str(today)}

def csv_rows(c, b):
    d = (b or {}).get('data'); txt = d[0] if isinstance(d, list) and d else ''
    return list(csv.DictReader(io.StringIO(txt)))

if mode == 'd7':
    inv_no = {'DVI': 'S1-38216', 'HD': 'S2-31597'}[key]
    win = {'DVI': [(dt.date(2026, 10, 1), dt.date(2026, 10, 31))], 'HD': [(dt.date(2026, 9, 1), dt.date(2026, 9, 30))]}[key]
    for p in [[('range', 'last_month')]] + [[('range', 'custom'), ('start_date', instants(f, t, tz)[0]), ('end_date', instants(f, t, tz)[1])] for f, t in win]:
        c, b = get('/api/reporting/export/customer_invoice', [('report', 'customer_invoice')] + p, W); rows = csv_rows(c, b)
        hit = [{x: r.get(x) for x in ('InvoiceNo', 'Customer', 'InvoiceDate', 'DueDate', 'Terms')} for r in rows if r.get('InvoiceNo') == inv_no]
        out[p[0][1] if len(p) == 1 else 'custom'] = {'status': c, 'params': p, 'rows': len(rows), 'header': list(rows[0].keys())[:20] if rows else None, 'hit': hit[:3]}
        print(p[0][1], c, len(rows), hit[:1])
    if key == 'HD':  # the 7 September COD invoices: file Terms vs invoice record
        rows = csv_rows(*get('/api/reporting/export/customer_invoice', [('report', 'customer_invoice'), ('range', 'custom'), ('start_date', instants(*win[0], tz)[0]), ('end_date', instants(*win[0], tz)[1])], W))
        out['sep_same_day_due_not_cod'] = sorted({(r['InvoiceNo'], r['Terms'], r['InvoiceDate'], r['DueDate']) for r in rows if r.get('InvoiceDate') == r.get('DueDate') and r.get('Terms') not in ('COD', '', None)})
        print('Sep rows due same day but Terms not COD:', len(out['sep_same_day_due_not_cod']), out['sep_same_day_due_not_cod'][:8])
    # the invoice record and the customer card
    c, l = get('/api/invoices', [('search', inv_no), ('pagination[page]', 1), ('pagination[rowsPerPage]', 20)], W)
    out['invoice_search'] = {'status': c, 'sample': str(l)[:600]}
    print('invoice search', c, str(l)[:300])

if mode == 'pay':
    who, f, t = sys.argv[3], dt.date.fromisoformat(sys.argv[4]), dt.date.fromisoformat(sys.argv[5])
    s, e = instants(dt.date(today.year, 1, 1), today, tz)
    c, b = get('/api/reporting/export/payroll_timesheet', [('range', 'custom'), ('start_date', s), ('end_date', e)], W)
    rows = csv_rows(c, b); cur = None; exp = {}; over = []
    for r in rows:
        if r.get('Employee Name') and not r['Employee Name'].startswith('Total for'): cur = r['Employee Name']; continue
        if r.get('Date') and float(r.get('Total Hours') or 0) > 24: over.append((cur, r['Date'], r['Total Hours']))
        if cur == who and r.get('Date') and f.isoformat() <= r['Date'] <= t.isoformat(): exp[r['Date']] = {k: r.get(k) for k in r}
    out['export'] = {'status': c, 'window': [str(dt.date(today.year, 1, 1)), str(today)], 'header': list(rows[0].keys()) if rows else None, 'person_days': exp, 'days_over_24_all_staff': over}
    # Timesheet Activities, a day either side, then clip each clock to each local day
    s2, e2 = instants(f - dt.timedelta(days=3), t + dt.timedelta(days=3), tz)
    c, b = get('/api/reporting/punch-clock-activities/custom', [('range', 'custom'), ('start_date', s2), ('end_date', e2), ('pagination[page]', 1), ('pagination[rowsPerPage]', 2000)], W)
    ta = [r for r in b['data']['collection'] if r['employee'] == who]
    fmt = '%b %d, %Y %I:%M %p'
    clocks = {}
    for r in ta:
        if not r.get('formatted_end_date_time'): continue
        clocks[r['id']] = (dt.datetime.strptime(r['formatted_start_date_time'], fmt), dt.datetime.strptime(r['formatted_end_date_time'], fmt), r.get('work_order'), r.get('clock_activity'))
    out['ta_day_rows'] = [{k: r.get(k) for k in ('date', 'work_order', 'clock_activity', 'clock_in', 'clock_out', 'hours', 'formatted_start_date_time', 'formatted_end_date_time')} for r in ta
                          if f <= dt.datetime.strptime(r['date'], '%b %d %Y').date() <= t]
    out['clocks'] = {i: [a.isoformat(), z.isoformat(), wo, act] for i, (a, z, wo, act) in clocks.items()}
    days = {}
    d = f
    while d <= t:
        d0 = dt.datetime.combine(d, dt.time()); d1 = d0 + dt.timedelta(days=1)
        iv = sorted((max(a, d0), min(z, d1)) for a, z, *_ in clocks.values() if a < d1 and z > d0)
        tot_sum = sum((z - a).total_seconds() for a, z in iv); union = 0; cs = ce = None
        for a, z in iv:
            if cs is None or a > ce:
                if cs is not None: union += (ce - cs).total_seconds()
                cs, ce = a, z
            else: ce = max(ce, z)
        if cs is not None: union += (ce - cs).total_seconds()
        ta_sum = round(sum(r['hours'] for r in ta if dt.datetime.strptime(r['date'], '%b %d %Y').date() == d), 2)
        days[str(d)] = {'clock_parts': [(a.strftime('%H:%M'), z.strftime('%H:%M')) for a, z in iv], 'sum_of_parts_h': round(tot_sum / 3600, 2),
                        'expected_union_h': round(union / 3600, 2), 'timesheet_activities_hours': ta_sum, 'export_total_hours': (exp.get(str(d)) or {}).get('Total Hours')}
        print(d, days[str(d)])
        d += dt.timedelta(days=1)
    out['days'] = days
    print('days over 24 (all staff, this location, 1 Jan..today):', len(over), over[:6])
print(dump(f'server-{mode}-{key}-{"-".join(a.replace(" ", "") for a in sys.argv[3:]) or "x"}', out))
