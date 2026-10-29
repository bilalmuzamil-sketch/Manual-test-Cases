"""F3 server cross-check (read-only). Usage: TZ=<zone> python3 server_sbr_ap_ar.py <sbr|ap-leth|ap-hd|ar-hd|ar-dvi>
Writes evidence/f3/<ticket>/server-<part>.json. Every call after change-location to the location's own zone (Rule 99)."""
import sys, os, re; sys.path.insert(0, os.path.dirname(__file__))
from common import *
part = sys.argv[1]
def eod(day, tz):  # end of the picked day in the location zone, as the screen sends it
    e = dt.datetime.combine(day, dt.time(23, 59, 59, 999000), ZoneInfo(tz)).astimezone(dt.timezone.utc)
    return e.strftime('%Y-%m-%dT%H:%M:%S.') + f'{e.microsecond // 1000:03d}Z'
def sod(day, tz):
    return dt.datetime.combine(day, dt.time(0, 0), ZoneInfo(tz)).astimezone(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.000Z')
def localdate(s, tz):  # 'YYYY-MM-DD HH:MM:SS' (UTC) or ISO Z -> local calendar date
    s = s.replace('Z', '').replace('T', ' ')[:19]
    return dt.datetime.strptime(s, '%Y-%m-%d %H:%M:%S').replace(tzinfo=dt.timezone.utc).astimezone(ZoneInfo(tz)).date()
out = {'part': part, 'at_utc': dt.datetime.now(dt.timezone.utc).isoformat()}
LOCS = ','.join(WID[k] for k in ('qb', 'hd', 'leth', 'dvi'))
if part == 'sbr':
    w = WID['dvi']; tz = TZ[w]; out['zones'] = zones(w); out['change_location'] = loc(w); today = dt.datetime.now(ZoneInfo(tz)).date()
    def check(label, start, end, locs, unassigned):
        base = [('range', 'custom'), ('start_date', sod(start, tz)), ('end_date', eod(end, tz)), ('productType', 'all'), ('invoiceStatus', 'all'), ('locations', locs)] + ([('showUnassigned', '1')] if unassigned else [])
        c, reps = get('/api/reporting/reports/sales-by-representative', base + [('pagination[page]', 1), ('pagination[rowsPerPage]', 500), ('pagination[sortBy]', 'rep_name'), ('pagination[descending]', 'false')], w)
        res = {'request': base, 'reps': len(reps['data']['collection']), 'multi_days': 0, 'days_out_of_order': 0, 'days_in_created_desc': 0, 'examples': []}
        for r in reps['data']['collection']:
            c, iv = paged(f'/api/reporting/reports/sales-by-representative/{r["key"]}/invoices', base, w)
            rows = iv['collection']; groups = {}
            for x in rows: groups.setdefault(localdate(x['created_on'], tz), []).append(x)
            days = [localdate(x['created_on'], tz) for x in rows]
            if days != sorted(days, reverse=True): res.setdefault('cross_day_out_of_order', []).append(r['rep_name'])
            for d, g in groups.items():
                if len(g) < 2: continue
                res['multi_days'] += 1
                key = [(int(re.search(r'-(\d+)$', x['invoice_number']).group(1)), x['invoice_number'][0]) for x in g]
                created = [x['created_on'] for x in g]
                if key != sorted(key):
                    res['days_out_of_order'] += 1
                    if len(res['examples']) < 8: res['examples'].append({'rep': r['rep_name'], 'day': str(d), 'shown': [x['invoice_number'] for x in g]})
                if created == sorted(created, reverse=True): res['days_in_created_desc'] += 1
            if r.get('is_unassigned') or r['key'].startswith('00000000'):
                res['unassigned_oct28'] = [(x['invoice_number'], x['location']) for x in rows if str(localdate(x['created_on'], tz)) == '2026-10-28']
        out[label] = res
    check('i_ticket_this_month_all_locations_unassigned', today.replace(day=1), today, LOCS, True)
    check('ii_default_this_month_all_locations_no_unassigned', today.replace(day=1), today, LOCS, False)
    check('iii_this_year_all_locations_unassigned', today.replace(month=1, day=1), today, LOCS, True)
    check('extra_this_month_dvi_only_unassigned', today.replace(day=1), today, WID['dvi'], True)
    tk = 'SV-11952'
if part.startswith('ap-'):
    w = WID[part[3:]]; tz = TZ[w]; out['zones'] = zones(w); out['change_location'] = loc(w); today = dt.datetime.now(ZoneInfo(tz)).date()
    def ap(label, path, day, extra=()):
        q = [('asOfDate', eod(day, tz))] + list(extra)
        if 'unpaid' in path:
            c, b = paged(path, q, w); txs = [t for v in b['collection'] for t in v['transactions']]
        else:
            c, b = get(path, q, w); txs = [t for k, v in b['data']['buckets'].items() if isinstance(v, dict) for t in v['transactions']]
        stat = {'request': q, 'status': c, 'n': len(txs), 'not_due_wrong': 0, 'not_due_ok': 0, 'due_or_overdue_wrong': 0, 'due_or_overdue_ok': 0, 'examples': {}}
        for t in txs:
            if not t.get('dueDate'): stat['no_due_date'] = stat.get('no_due_date', 0) + 1; continue
            got = t.get('daysPastDue', t.get('pastDue')); exp = (day - localdate(t['dueDate'], tz)).days
            exp_raw = (day - dt.date.fromisoformat(t['dueDate'][:10])).days  # due date read as the calendar date in the stored value
            k = ('not_due_' if exp < 0 else 'due_or_overdue_') + ('ok' if got == exp else 'wrong'); stat[k] += 1
            stat.setdefault('raw_tally', {}); kr = ('not_due_' if exp_raw < 0 else 'due_or_overdue_') + ('ok' if got == exp_raw else 'wrong'); stat['raw_tally'][kr] = stat['raw_tally'].get(kr, 0) + 1
            stat.setdefault('diff_hist', {}); dk = f'shown-expected={got-exp}' + (' (not due)' if exp < 0 else ' (due/overdue)'); stat['diff_hist'][dk] = stat['diff_hist'].get(dk, 0) + 1
            if t['transactionNumber'] in ('SV10190-ST1', 'SV10190-ST2', 'SV10190-R3', '5363', 'E2E-INV-1790684747987') or (got != exp and len(stat['examples']) < 6):
                stat['examples'][t['transactionNumber'] + '@' + t['locationName'][:20]] = {'due_local': str(localdate(t['dueDate'], tz)), 'dueDate_raw': t['dueDate'], 'shown': got, 'expected': exp}
        out[label] = stat
    D = '/api/reporting/account-payable/aging-detail-report'; U = '/api/reporting/account-payable/unpaid-invoices-report'
    VENDOR = '68c72fe7-8fbe-4795-85aa-7e91fbb54c7e'
    ap('detail_today_default', D, today)
    ap('unpaid_today_default_no_vendor', U, today)
    if part == 'ap-leth':
        ap('detail_oct28_ticket', D, dt.date(2026, 10, 28))
        ap('unpaid_oct20_vendor_picture2', U, dt.date(2026, 10, 20), [('vendorId', VENDOR)])
        ap('unpaid_oct20_no_vendor', U, dt.date(2026, 10, 20))
    tk = 'SV-11922'
if part.startswith('ar-'):
    w = WID[part[3:]]; tz = TZ[w]; out['zones'] = zones(w); out['change_location'] = loc(w); today = dt.datetime.now(ZoneInfo(tz)).date()
    for label, day in [('today_default', today), ('invoice_day_oct15', dt.date(2026, 10, 15)), ('far_future_2027_12_31', dt.date(2027, 12, 31))]:
        c, b = get('/api/reporting/account-receivable/aging-detail-report', [('asOfDate', eod(day, tz))], w)
        hits = {}
        for k, v in b['data']['buckets'].items():
            if isinstance(v, dict):
                for t in v['transactions']:
                    if t['transactionNumber'] in ('P2-2352', 'P2-2439') or t['transactionNumber'] in ('DEP-4763', 'DEP-4801'):
                        hits[t['transactionNumber']] = {'bucket': k, 'amount': t['amount'], 'balance': t['balance'], 'customer': t['customerName']}
                    if 'P2-2352' in json.dumps(t) and t['transactionNumber'] != 'P2-2352': hits.setdefault('other_rows_mentioning_P2-2352', []).append(t)
        out[label] = {'asOfDate': eod(day, tz), 'status': c, 'rows': hits, 'totalBalance': b['data']['buckets'].get('totalBalance')}
    for n, wo in [('P2-2352', 'b9e03515-6e0f-4d1f-b45e-788c2bb44be1'), ('P2-2439', '0464207f-fda5-4663-a39a-8337310dbb72')]:
        c, b = get(f'/api/work-orders/view/{wo}', [], WID['hd'])
        x = (b.get('data') or {}).get('work_order') or {}
        out['wo_' + n] = {'status': c, **{k: x.get(k) for k in ('display_number', 'invoice_status', 'open_balance', 'sub_total_with_tax', 'total', 'deposits_total')},
                          'payments': [(p.get('payment_date'), p.get('applied_amount'), p.get('is_deposit'), p.get('status')) for p in ((b.get('data') or {}).get('customer_payments') or [])]}
    tk = 'SV-11935'
os.makedirs(f'{EV}/{tk}', exist_ok=True)
json.dump(out, open(f'{EV}/{tk}/server-{part}.json', 'w'), indent=1, default=str)
print(json.dumps({k: ({kk: vv for kk, vv in v.items() if kk not in ('request',)} if isinstance(v, dict) else v) for k, v in out.items()}, default=str)[:3500])
