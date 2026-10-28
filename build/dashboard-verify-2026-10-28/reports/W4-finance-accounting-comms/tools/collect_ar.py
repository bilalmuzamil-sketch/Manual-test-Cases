#!/usr/bin/env python3
"""W4 — collect A/R Aging Summary / Detail / Collection for several as-of dates, plus the
independent raw records (each customer's account ledger + deposits) for the as-of-today check.

SECRET-FREE: uses the shared curl() helper (cookie read from /tmp/cln/sess-admin.txt).
Raw output → /tmp/cln/w4/ar/ (staging business data stays out of git).

As-of instant = local 23:59:59.999 of the chosen day in the SESSION location's time zone, sent as
UTC 'Y-m-d\\TH:i:s.v\\Z' — the same window the screen sends (formatDateLocalToEndOfDayUTC).
"""
import json, os, sys, datetime as dt
from zoneinfo import ZoneInfo
from urllib.parse import urlencode
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools')
from collect_dashboard import curl

OUT = '/tmp/cln/w4/ar'
LOC = {'hd': ('b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Asia/Karachi'),
       'leth': ('f8a8b802-7780-4b16-bf10-343caeb616b2', 'America/Edmonton')}


def asof(day, tz):
    e = dt.datetime.combine(day, dt.time(23, 59, 59, 999000), ZoneInfo(tz)).astimezone(dt.timezone.utc)
    return e.strftime('%Y-%m-%dT%H:%M:%S.') + f'{e.microsecond // 1000:03d}Z'


def paged(path, params, H, key='collection'):
    rows, page, meta = [], 1, None
    while True:
        s, j = curl('GET', path + '?' + urlencode(params + [('pagination[page]', page), ('pagination[rowsPerPage]', 1000)]),
                    extra_headers=H)
        if s != 200:
            raise SystemExit(f'{path} HTTP {s} {str(j)[:300]}')
        d = j['data']
        rows += d[key]
        meta = d
        if len(d[key]) < 1000:
            break
        page += 1
    meta = dict(meta); meta[key] = rows; meta['_pages'] = page
    return meta


def collect_reports(tag, day):
    wid, tz = LOC[tag]
    curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz})
    H = {'X-Location-ID': wid}
    A = asof(day, tz)
    d = os.path.join(OUT, f'{tag}_{day.isoformat()}'); os.makedirs(d, exist_ok=True)
    summ = paged('/api/reporting/account-receivable/aging-summary-report', [('asOfDate', A)], H)
    s, det = curl('GET', '/api/reporting/account-receivable/aging-detail-report?' + urlencode([('asOfDate', A)]), extra_headers=H)
    coll = paged('/api/reporting/account-receivable/collections-report', [('asOfDate', A)], H)
    for n, o in (('summary', summ), ('detail', det['data'] if s == 200 else {'_status': s, 'body': det}), ('collection', coll)):
        json.dump({'asOf': A, 'tz': tz, 'data': o}, open(os.path.join(d, n + '.json'), 'w'))
    print(tag, day, A, 'summary rows', len(summ['collection']), 'pages', summ['_pages'], 'detail', s,
          'collection rows', len(coll['collection']))
    return summ, det.get('data'), coll


def collect_ledgers(summ, coll, det):
    """Customer → account id → open ledger rows (stored balances) and deposits. A different code path
    (customer_transaction.balance / credit_memo.open_balance / deposit list) from the report's replay SQL."""
    wid, tz = LOC['hd']; H = {'X-Location-ID': wid}
    d = os.path.join(OUT, 'ledgers'); os.makedirs(d, exist_ok=True)
    ids = {r['customerId']: r['customerName'] for r in summ['collection']}
    ids.update({r['customerId']: r['customerName'] for r in coll['collection']})
    done = 0
    for cid, name in ids.items():
        fn = os.path.join(d, cid + '.json')
        if os.path.exists(fn):
            continue
        s, v = curl('GET', f'/api/customers/view/{cid}', extra_headers=H)
        acc = (v.get('data') or {}).get('company', {}).get('customer_account_id') if s == 200 else None
        rec = {'customerId': cid, 'name': name, 'account': acc, 'view_status': s}
        if acc:
            rows, page = [], 1
            while True:
                s2, j = curl('GET', '/api/customer-account/list-unpaid-transaction?' + urlencode(
                    [('accountId', acc), ('pagination[page]', page), ('pagination[rowsPerPage]', 500), ('openOnly', 'true')]),
                    extra_headers=H)
                c = (j.get('data') or {}).get('response', {}).get('collection', []) if s2 == 200 else []
                rows += c
                if len(c) < 500:
                    break
                page += 1
            rec['open_rows'] = rows; rec['open_status'] = s2
            rec['open_group'] = (j.get('data') or {}).get('response', {}).get('groupByDueDateData') if s2 == 200 else None
            s3, dep = curl('GET', '/api/customer-deposits/list?' + urlencode([('accountId', acc)]), extra_headers=H)
            rec['deposits'] = dep.get('data') if s3 == 200 else {'_status': s3}
        json.dump(rec, open(fn, 'w'))
        done += 1
    print('ledgers fetched', done, 'of', len(ids))


if __name__ == '__main__':
    today_hd = dt.datetime.now(ZoneInfo('Asia/Karachi')).date()
    which = sys.argv[1:] or ['reports', 'ledgers']
    if 'reports' in which:
        res = collect_reports('hd', today_hd)
        for day in (dt.date(2026, 9, 30), dt.date(2026, 6, 30), dt.date(2025, 12, 31)):
            collect_reports('hd', day)
        collect_reports('leth', dt.datetime.now(ZoneInfo('America/Edmonton')).date())
    if 'ledgers' in which:
        base = os.path.join(OUT, f'hd_{today_hd.isoformat()}')
        summ = json.load(open(base + '/summary.json'))['data']
        coll = json.load(open(base + '/collection.json'))['data']
        det = json.load(open(base + '/detail.json'))['data']
        collect_ledgers(summ, coll, det)
