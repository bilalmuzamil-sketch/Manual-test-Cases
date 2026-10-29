"""F4 filter recheck - server side (29 Oct 2026). SECRET-FREE (cookie from /tmp/cln/f4/sess.txt, never printed).
One run per location, with the process in the location's own zone and the session change-location'd to it (Rule 99):
  TZ=Asia/Karachi    python3 f4_server.py hd     # D3 IBS Ready To Send, D4 Notes, D5/D6 QB Unexported
  TZ=America/Edmonton python3 f4_server.py leth  # D2 IBS Sent batch, D3/D5 Lethbridge side
  TZ=America/Toronto  python3 f4_server.py dvi   # D7 Customer Invoice export Terms
Writes evidence/f4/server_<tag>.json (summaries only; raw replies stay in /tmp/cln/f4)."""
import json, sys, collections, csv, io, datetime as dt
from zoneinfo import ZoneInfo
from common import *
EV = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f4'
os.makedirs(EV, exist_ok=True)
tag = sys.argv[1]; w = WID[tag]; assert os.environ.get('TZ') == TZ[w], 'TZ must equal the location zone'
out = {'location': NAME[w], 'change_location_status': loc(w), 'zones': zones(w)}
Z = ZoneInfo(TZ[w]); now = dt.datetime.now(Z)
r2 = lambda x: round(x + 0.0, 2)
iso = lambda d: d.astimezone(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.000Z')

def ibs():
    # the screen's own request shape is recorded by f4_screen.mjs; here every row is read (rowsPerPage 1000) with NO search
    s1, t = get('/api/customers/ibs/list-transactions', [('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)], w)
    s2, b = get('/api/customers/ibs/list-batches', [('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)], w)
    json.dump({'t': t, 'b': b}, open(f'{RAW}/ibs_{tag}.json', 'w'))
    rts = t['data']['response']['collection']
    o = {'status': [s1, s2], 'ready_count': len(rts), 'ready_pagination': t['data']['response'].get('pagination'),
         'ready_zero': [{k: r.get(k) for k in ('invoice_display_number', 'customer_name', 'amount', 'balance', 'status', 'date')} for r in rts if abs(r.get('amount') or 0) < 0.005],
         'batches': []}
    for bt in b['data']['response'] or []:
        ta = r2(sum(x['amount'] for x in bt['transactions']) + sum((x.get('amount') or 0) for x in bt.get('credits', [])))
        o['batches'].append({'id': bt['id'], 'date': bt.get('created_at') or bt.get('date'), 'amount': bt['amount'], 'balance': bt['balance'], 'status': bt['status'],
                             'n_inv': len(bt['transactions']), 'n_cr': len(bt.get('credits', [])), 'sum_inv_and_credits': ta, 'diff': r2(bt['amount'] - ta),
                             'inv': [(x.get('invoice_display_number'), x['amount']) for x in bt['transactions']]})
    # search widening check: the only narrowing control on IBS is the page search; an empty search is the widest
    s3, t3 = get('/api/customers/ibs/list-transactions', [('pagination[page]', 1), ('pagination[rowsPerPage]', 1000), ('search', '')], w)
    o['ready_count_empty_search'] = len(t3['data']['response']['collection']) if s3 == 200 else s3
    s4, t4 = get('/api/customers/ibs/list-transactions', [('pagination[page]', 1), ('pagination[rowsPerPage]', 1000), ('search', 'S2-16924')], w)
    o['ready_search_S2_16924'] = [(r.get('invoice_display_number'), r.get('amount')) for r in t4['data']['response']['collection']] if s4 == 200 else s4
    return o

def notes_window(rng):
    d0 = now.replace(hour=0, minute=0, second=0, microsecond=0); dow = (now.weekday() + 1) % 7  # JS getDay: Sun=0
    if rng == 'all': return None, None
    if rng == 'this_week': s = d0 - dt.timedelta(days=dow); return s, s + dt.timedelta(days=7)
    if rng == 'last_week': s = d0 - dt.timedelta(days=dow + 7); return s, d0 - dt.timedelta(days=dow)
    if rng == 'this_month': s = d0.replace(day=1); e = (s + dt.timedelta(days=32)).replace(day=1); return s, e
    if rng == 'last_month': e = d0.replace(day=1); s = (e - dt.timedelta(days=1)).replace(day=1); return s, e
    if rng == 'today': return d0, d0 + dt.timedelta(days=1)

def notes():
    o = {}
    for rng in ('this_week', 'all', 'last_week', 'this_month', 'today', 'last_month'):
        s, e = notes_window(rng); f = []
        if s: f = [('filters[0][field]', 'created_after'), ('filters[0][operator]', 'gte'), ('filters[0][value]', iso(s)),
                   ('filters[1][field]', 'created_before'), ('filters[1][operator]', 'lte'), ('filters[1][value]', iso(e))]
        sort = [('pagination[sortBy]', 'created_at'), ('pagination[descending]', 'true')]
        # (a) exactly what the screen sends: no page, no rowsPerPage (author / mention / search cleared)
        sa, ja = get('/api/notes', f + sort, w); da = ja.get('data') or {}
        # (b) page 2 of the same request: does the server have more for the screen to ask for?
        sb, jb = get('/api/notes', f + sort + [('pagination[page]', 2), ('pagination[rowsPerPage]', 100)], w); db = jb.get('data') or {}
        # (c) every note in the window
        allrows, page = [], 1
        while True:
            sc, jc = get('/api/notes', f + sort + [('pagination[page]', page), ('pagination[rowsPerPage]', 1000)], w)
            dc = jc.get('data') or {}; allrows += dc.get('notes', [])
            if not (dc.get('pagination') or {}).get('hasMore') or page > 20: break
            page += 1
        ids = [n['id'] for n in allrows]
        first100 = [n['id'] for n in da.get('notes', [])]
        o[rng] = {'window_local': [s.isoformat() if s else None, e.isoformat() if e else None], 'window_utc_sent': [iso(s) if s else None, iso(e) if e else None],
                  'screen_request_status': sa, 'screen_request_returned': len(first100), 'screen_request_pagination': da.get('pagination'),
                  'page2_returned': len(db.get('notes', [])), 'page2_pagination': db.get('pagination'),
                  'total_in_window': len(ids), 'unique_total': len(set(ids)), 'hidden_beyond_screen': len(set(ids) - set(first100)),
                  'newest': allrows[0]['createdAt'] if allrows else None, 'oldest': allrows[-1]['createdAt'] if allrows else None,
                  'oldest_shown_on_screen': da.get('notes', [])[-1]['createdAt'] if da.get('notes') else None,
                  'by_type': dict(collections.Counter(n.get('type') for n in allrows)), 'by_source': dict(collections.Counter(n.get('source') for n in allrows)),
                  'by_reference_type': dict(collections.Counter((n.get('reference') or {}).get('type') for n in allrows)),
                  'reference_labels_sample': sorted({(n.get('reference') or {}).get('label') or '' for n in allrows})[:12]}
        if rng == 'all': json.dump(allrows, open(f'{RAW}/notes_all_{tag}.json', 'w'))
    # the same with a location header from another location: is the list organisation-wide?
    sl, jl = get('/api/notes', [('pagination[sortBy]', 'created_at'), ('pagination[descending]', 'true'), ('pagination[rowsPerPage]', 1000)], WID['leth'])
    o['all_first_1000_with_lethbridge_header'] = len((jl.get('data') or {}).get('notes', []))
    return o

def qb():
    o = {}
    for grp in ('customer', 'vendor', 'journal_entry'):
        items, page = [], 1
        while True:
            s, j = get('/api/bookkeeping/unexported-items', [('filters[0][field]', 'groupName'), ('filters[0][value]', grp), ('pagination[page]', page), ('pagination[rowsPerPage]', 1000)], w)
            c = (j.get('data') or {}).get('collection') or []; items += c
            if len(c) < 1000: break
            page += 1
        if grp == 'customer': json.dump(items, open(f'{RAW}/qb_{tag}.json', 'w'))
        dup = collections.defaultdict(list)
        for i in items: dup[(i['type'], i.get('referenceId'))].append(i)
        d2 = {k: v for k, v in dup.items() if len(v) > 1}
        o[grp] = {'status': s, 'rows': len(items), 'types': dict(collections.Counter(i['type'] for i in items)),
                  'blank_no_by_type': dict(collections.Counter(i['type'] for i in items if not i.get('number'))),
                  'dup_docs_by_type': dict(collections.Counter(k[0] for k in d2))}
        if grp == 'customer':
            tv = [i for i in items if (i.get('customer') or '') == 'TestVT1' and str(i.get('date', '')).startswith('2026-10-22')]
            o['testvt1_oct22'] = [{k: (v[:80] if isinstance(v, str) else v) for k, v in i.items() if k in ('type', 'number', 'referenceId', 'date', 'createdAt', 'updatedAt', 'amount', 'errorMessage')} for i in tv]
            o['dashfresh_cm'] = [{k: i.get(k) for k in ('type', 'number', 'referenceId', 'date')} for i in items if (i.get('customer') or '').startswith('DashFresh Alpha MQ') and i['type'] == 'Credit Memo Create'][:3]
            o['keys'] = sorted(items[0].keys()) if items else []
    # unfiltered: no group filter at all (widest)
    s, j = get('/api/bookkeeping/unexported-items', [('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)], w)
    c = (j.get('data') or {}).get('collection') or []
    o['no_group_filter'] = {'status': s, 'rows_first_page': len(c), 'blank_cm_create': sum(1 for i in c if i['type'] == 'Credit Memo Create' and not i.get('number'))}
    return o

def d7():
    o = {}
    INV = 'b0099f00-7006-4f6e-94b7-14e815983958'; CUST = '64b8444e-8f5b-48d6-9cfe-0c4fa1adb4b6'
    s, iv = get(f'/api/invoices/{INV}/view', None, w); c = (iv.get('data') or {}).get('collection', {})
    o['invoice'] = {'status': s, **{k: c.get(k) for k in ('display_number', 'credit_terms', 'due_date', 'invoice_date', 'created_at', 'status')}}
    s, cv = get(f'/api/customers/view/{CUST}', None, w); cc = (cv.get('data') or {}).get('company') or {}
    o['customer_card'] = {'status': s, **{k: cc.get(k) for k in cc if 'term' in k.lower()}, 'name': cc.get('name')}
    d28s = dt.datetime(2026, 10, 28, tzinfo=Z); d28e = dt.datetime(2026, 10, 28, 23, 59, 59, 999000, tzinfo=Z)
    runs = {'today': [('range', 'today')], 'custom_oct28': [('range', 'custom'), ('start_date', iso(d28s)), ('end_date', d28e.astimezone(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.999Z'))],
            'yesterday': [('range', 'yesterday')], 'this_week': [('range', 'this_week')], 'this_month': [('range', 'this_month')]}
    for k, p in runs.items():
        for hdr in ('dvi', 'hd'):
            s, j = get('/api/reporting/export/customer_invoice', [('report', 'customer_invoice')] + p, WID[hdr])
            d = j.get('data'); txt = d[0] if isinstance(d, list) and d else ''
            rows = list(csv.DictReader(io.StringIO(txt)))
            hit = [{x: r.get(x) for x in ('InvoiceNo', 'Customer', 'InvoiceDate', 'DueDate', 'Terms')} for r in rows if r.get('InvoiceNo') == 'S1-38216']
            o[f'{k}__header_{hdr}'] = {'status': s, 'params': p, 'rows': len(rows), 'invoices': len({r.get('InvoiceNo') for r in rows}), 'S1-38216': hit[:2]}
    return o

if tag == 'hd': out['ibs'] = ibs(); out['notes'] = notes(); out['qb'] = qb()
if tag == 'leth': out['ibs'] = ibs(); out['qb'] = qb()
if tag == 'dvi': out['d7'] = d7()
out['zones_end'] = zones(w)
json.dump(out, open(f'{EV}/server_{tag}.json', 'w'), indent=1, default=str)
print(json.dumps(out, default=str)[:200], '... written', f'{EV}/server_{tag}.json')
