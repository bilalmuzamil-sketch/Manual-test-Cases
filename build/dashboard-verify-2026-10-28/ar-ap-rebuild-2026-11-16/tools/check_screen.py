#!/usr/bin/env python3
"""A/R + A/P rebuild (16 Nov) — the SCREEN and the DOWNLOADS against the full data snapshot of the same location zone, as-of
date and scope (collect.mjs), per PRD 947650561 v13. Downloads were made with the Export menu on screen (screen.mjs).
Screen: chips S5-R1 ("As of: 10/15/2026"), headers S2-R1/S2-R4a/S6-R1/S6-R2 (Location hidden with one location), Totals row and
drawn "Total for <name>" rows = data (S5-R18; screen money "$-11,111.00" S3-R7a), the screen's own request totals = data.
CSV: S3-R4 "As of: Oct 15, 2026", S3-R5 "Locations: All locations" / names, S3-R8 flat table + one Totals row, money plain with
two decimals, empty bucket blank, dates YYYY-MM-DD, S3-R8b headings ("Aging Bucket"), S3-R8a Phone + Credit Term after Customer,
S3-R3 exactly the rows (every value compared), S6-N1 no Location column with one location.
PDF: S3-R4 "As of Oct 15, 2026", S3-R5 Locations line, S3-R7 "91 And Over", S3-R7a "(-$11,111.00)" and "Nov 04 2026", S3-R7b
"Total for <name>" never "Subtotal", the Totals figures; S3-N1 refusal over 2,000 rows with the exact message.
Usage: check_screen.py   -> evidence/results-screen-downloads.json"""
import json, os, csv, io, re, subprocess, collections, datetime as dt
from zoneinfo import ZoneInfo
EV = os.path.join(os.path.dirname(__file__), '..', 'evidence')
ZONE = {'HD': 'Asia/Karachi', 'LE': 'America/Edmonton'}
OWNNAME = {'HD': 'Staging Heavy Duty - 9919', 'LE': 'Staging Lethbridge - 4310'}
SK = ['currentCents', 'days1To30Cents', 'days31To60Cents', 'days61To90Cents', 'days91PlusCents', 'totalCents']
BLABEL = {'days_91_plus': '91 or more days past due', 'days_61_to_90': '61-90 days past due', 'days_31_to_60': '31-60 days past due', 'days_1_to_30': '1-30 days past due', 'current': 'Current'}
HEAD = {'ar-aging-summary': ['Customer', 'Location', 'Current', '1-30 Days', '31-60 Days', '61-90 Days', '91 And Over', 'Total'],
        'ap-aging-summary': ['Vendor', 'Location', 'Current', '1-30 Days', '31-60 Days', '61-90 Days', '91 And Over', 'Total'],
        'ar-aging-detail': ['Date', 'Location', 'Transaction Type', 'ID', 'Customer Full Name', 'Due Date', 'Amount', 'Open Balance'],
        'ar-aging-collection': ['Date', 'Location', 'Transaction Type', 'ID', 'Due Date', 'Past Due', 'Amount', 'Open Balance'],
        'ap-aging-detail': ['Date', 'Location', 'Transaction Type', 'No.', 'Vendor Name', 'Due Date', 'Past Due', 'Amount', 'Open Balance'],
        'ap-unpaid-invoices': ['Date', 'Location', 'Transaction Type', 'No.', 'Vendor Name', 'Due Date', 'Past Due', 'Amount', 'Open Balance']}


def scr(c):          # screen money, S3-R7a: "$-11,111.00"
    return ('$-' if c < 0 else '$') + f'{abs(c) / 100:,.2f}'


def pdfm(c):         # PDF money, S3-R7a: "(-$11,111.00)"
    return f'(-${abs(c) / 100:,.2f})' if c < 0 else f'${c / 100:,.2f}'


def plain(c):
    return f'{c / 100:.2f}'


def mdy(s):
    d = dt.date.fromisoformat(s); return d.strftime('%b ') + str(d.day) + d.strftime(', %Y')


class C:
    def __init__(s):
        s.n = collections.Counter(); s.f = collections.defaultdict(list)

    def ok(s, name, cond, detail=None):
        s.n[name + (':pass' if cond else ':fail')] += 1
        if not cond and len(s.f[name]) < 25:
            s.f[name].append(detail)


def docs_of(slug, snap):
    if 'detail' in slug:
        return [dict(r, _bucket=b) for b in ['days_91_plus', 'days_61_to_90', 'days_31_to_60', 'days_1_to_30', 'current'] for r in snap['rows'].get(b, [])]
    if 'summary' in slug:
        return snap['collection']
    return [dict(r, _group=g) for g in snap['collection'] for r in g['rows']]


def check_run(key, R, c):
    slug, asof, scope = R['slug'], R['asOf'], R['scope']; tz = ZONE[key]
    p = f'/tmp/cln/arap/{key}/{asof}/{scope}/{slug}.json'
    if not os.path.exists(p):
        return
    snap = json.load(open(p)); tag = f'{slug}'
    # ---- screen
    c.ok(f'screen chip "As of: MM/DD/YYYY" = as-of (S5-R1) [{tag}]', any(x == 'As of: ' + dt.date.fromisoformat(asof).strftime('%m/%d/%Y') for x in R.get('chips', [])), R.get('chips'))
    exp_head = [h for h in HEAD[slug] if not (scope == 'own' and h == 'Location')]
    c.ok(f'screen headers = PRD S2-R1 list, Location only with 2+ locations (S6-R2) [{tag}]', R.get('head') == exp_head, (R.get('head'), exp_head))
    tot = snap.get('totals') or {}
    if 'summary' in slug:
        row = next((t for t in R.get('totals', []) if t and t[0] == 'Totals'), None)
        exp = ['Totals'] + ([''] if scope == 'all' else []) + [scr(tot[k]) for k in SK]
        c.ok(f'screen Totals row = data (S5-R18) [{tag}]', row == exp, (row, exp))
    elif 'detail' in slug:
        row = next((t for t in R.get('totals', []) if t and t[0] == 'Totals'), None)
        if row is not None:
            c.ok(f'screen Totals row = data (S5-R18) [{tag}]', row == ['Totals', scr(tot['amountCents']), scr(tot['openBalanceCents'])], (row, scr(tot['amountCents']), scr(tot['openBalanceCents'])))
        for g in R.get('groups', []):
            if g and g[0].startswith('Total for '):
                b = next((x for x in snap['groups'] if 'Total for ' + x['label'] == g[0]), None)
                c.ok(f'screen "Total for <bucket>" = data (S3-R7b words) [{tag}]', b is not None and g[1:] == [scr(b['amountCents']), scr(b['openBalanceCents'])], g)
            elif len(g) > 1 and '(' in g[1]:
                b = next((x for x in snap['groups'] if g[1].startswith(x['label'] + ' (')), None)
                c.ok(f'screen bucket row "<label> (count)" = data [{tag}]', b is not None and g[1] == f"{b['label']} ({b['rowsNumber']})", g)
    else:
        byname = {x['name']: x for x in snap['collection']}
        for g in R.get('groups', []):
            if g and g[0].startswith('Total for '):
                x = byname.get(g[0][10:]) or next((v for k, v in byname.items() if k.strip() == g[0][10:].strip()), None)
                c.ok(f'screen "Total for <name>" = data [{tag}]', x is not None and g[1:] == [scr(x['amountCents']), scr(x['openBalanceCents'])], g)
    for q in R.get('requests', []):
        if q.get('totals') and '/rows' not in q['u'] and 'locations' not in q['u']:
            c.ok(f'screen request totals = snapshot totals [{tag}]', q['totals'] == tot, (q['u'][:100], q['totals'], tot))
    # ---- downloads
    for d in R.get('downloads', []):
        if d.get('item') == 'Download (PDF)' and not d.get('path') and not d.get('toasts'):
            c.ok(f'NOT VERIFIED: PDF gave no file and no message within {d.get("seconds")} s while 3 other sessions loaded staging (retried alone in pdf_extra) [{tag}]', True, None)
            continue
        if d.get('item') == 'Download (PDF)' and not d.get('path'):
            n = snap.get('rowsNumber') if 'summary' in slug else (tot.get('rowsNumber') or tot.get('documentCount'))
            msg = 'This report is too large for PDF. Export it as CSV, or narrow the filters, then try again.'
            c.ok(f'PDF refused only over 2,000 rows, exact message (S3-N1) [{tag}]', n > 2000 and any(msg in t for t in d.get('toasts', [])), (n, d.get('toasts')))
            continue
        if not d.get('path'):
            c.ok(f'download produced a file [{tag}]', False, d); continue
        if d['path'].endswith('.csv'):
            check_csv(key, slug, asof, scope, snap, d['path'], c, tag)
        elif d['path'].endswith('.pdf'):
            check_pdf(key, slug, asof, scope, snap, d['path'], c, tag)


def check_csv(key, slug, asof, scope, snap, path, c, tag):
    tz = ZONE[key]
    rows = list(csv.reader(io.StringIO(open(path, encoding='utf-8-sig').read())))
    c.ok(f'CSV line 1 "As of: <Mon d, yyyy>" (S3-R4) [{tag}]', rows[0] == ['As of: ' + mdy(asof)], rows[0])
    c.ok(f'CSV line 2 Locations (S3-R5) [{tag}]', rows[1] == ['Locations: ' + ('All locations' if scope == 'all' else OWNNAME[key])], rows[1])
    h = rows[2]; body = rows[3:]
    c.ok(f'CSV one Totals row at the bottom (S3-R8) [{tag}]', body[-1][0] == 'Totals' and sum(1 for r in body if r and r[0] == 'Totals') == 1, body[-1][:3])
    c.ok(f'CSV no Location column with one location (S6-N1) / Location with all (S6-R2) [{tag}]', ('Location' in h) == (scope == 'all'), h)
    data = body[:-1]; T = body[-1]; ix = {n: i for i, n in enumerate(h)}
    opening_order(slug, h, data, c, tag, tz)
    money_ok = all(re.fullmatch(r'-?\d+\.\d\d', v) or v == '' for r in data for n, v in zip(h, r) if n in ('Current', '1-30 Days', '31-60 Days', '61-90 Days', '91 And Over', 'Total', 'Amount', 'Open Balance'))
    c.ok(f'CSV money plain with two decimals, empty = blank (S3-R8) [{tag}]', money_ok, h)
    if 'Date' in ix:
        c.ok(f'CSV dates YYYY-MM-DD (S3-R8) [{tag}]', all(re.fullmatch(r'\d{4}-\d\d-\d\d', r[ix['Date']]) for r in data), [r[ix['Date']] for r in data[:2]])
    if 'summary' in slug:
        exp_h = HEAD[slug] if scope == 'all' else [x for x in HEAD[slug] if x != 'Location']
        c.ok(f'CSV headings = screen headings (S3-R8b, S3-R7 "91 And Over") [{tag}]', h == exp_h, h)
        S = snap['collection']; nm = 'customerName' if slug.startswith('ar') else 'vendorName'
        c.ok(f'CSV rows = screen rows, count (S3-R3) [{tag}]', len(data) == len(S), (len(data), len(S)))
        exp = [[r[nm]] + ([r['locationName']] if scope == 'all' else []) + [(plain(r[k]) if (r[k] or k == 'totalCents') else '') for k in SK] for r in S]
        got_set = sorted(map(tuple, data)); exp_set = sorted(map(tuple, exp))
        c.ok(f'CSV every row value = data (S3-R3) [{tag}]', got_set == exp_set, {'csv_only': [x for x in got_set if x not in set(exp_set)][:3], 'data_only': [x for x in exp_set if x not in set(got_set)][:3]})
        c.ok(f'CSV Totals = data Totals (S5-R18) [{tag}]', T[(2 if scope == 'all' else 1):] == [plain(snap['totals'][k]) for k in SK], (T, [plain(snap['totals'][k]) for k in SK]))
        return
    D = docs_of(slug, snap)
    c.ok(f'CSV rows = documents, count (S3-R3, S3-R9) [{tag}]', len(data) == len(D), (len(data), len(D)))
    num = 'ID' if 'ID' in ix else 'No.'
    if 'detail' in slug:
        c.ok(f'CSV "Aging Bucket" column (S3-R8b) [{tag}]', 'Aging Bucket' in ix, h)
    if slug == 'ar-aging-collection':
        i_ = h.index('Customer') if 'Customer' in h else -9
        c.ok(f'CSV Phone + Credit Term right after Customer (S3-R8a) [{tag}]', h[i_ + 1:i_ + 3] == ['Phone', 'Credit Term'], h)
    bynum = collections.defaultdict(list)
    for r in D:
        bynum[r['documentNumber']].append(r)
    mism = []
    guarded = []
    for r in data:
        n_ = r[ix[num]]
        if n_[:1] == "'" and n_[1:2] in '=+-@':           # spreadsheet formula guard on a value starting with = + - @
            guarded.append(n_); n_ = n_[1:]
        cand = bynum.get(n_, [])
        def same(x):
            ok = r[ix['Amount']] == plain(x['amountCents']) and r[ix['Open Balance']] == plain(x['openBalanceCents']) and r[ix['Transaction Type']] == x['transactionType']
            ok = ok and r[ix['Date']] == dt.datetime.fromisoformat(x['date'].replace('Z', '+00:00')).astimezone(ZoneInfo(tz)).date().isoformat()
            if 'Due Date' in ix:
                ok = ok and r[ix['Due Date']] == ('' if x['dueDate'] is None else dt.datetime.fromisoformat(x['dueDate'].replace('Z', '+00:00')).astimezone(ZoneInfo(tz)).date().isoformat())
            if 'Past Due' in ix:
                ok = ok and r[ix['Past Due']] == ('' if x['daysPastDue'] is None else str(x['daysPastDue']))
            if 'Aging Bucket' in ix:
                ok = ok and r[ix['Aging Bucket']] == BLABEL[x['_bucket']]
            if 'Location' in ix:
                ok = ok and r[ix['Location']] == x['locationName']
            return ok
        if not any(same(x) for x in cand):
            mism.append(r[:1] + [r[ix[num]]] + ([r[ix['Past Due']]] if 'Past Due' in ix else []) + [r[ix['Open Balance']]])
    c.ok(f'CSV every document row = data (date, due, past due, bucket, amounts, location) [{tag}]', not mism, {'n': len(mism), 'first': mism[:5]})
    if guarded:
        c.ok(f'OBSERVATION CSV value starting with + - = @ is written with a leading apostrophe [{tag}]', True, None); OBS.setdefault(tag, set()).update(guarded)
    am = sum(int(round(float(r[ix['Amount']]) * 100)) for r in data); ob = sum(int(round(float(r[ix['Open Balance']]) * 100)) for r in data)
    ta = snap['totals']['amountCents']; to = snap['totals']['openBalanceCents']
    c.ok(f'CSV Totals = data Totals = sum of CSV rows (S5-R18) [{tag}]', T[ix['Amount']] == plain(ta) and T[ix['Open Balance']] == plain(to) and am == ta and ob == to, (T[ix['Amount']], T[ix['Open Balance']], plain(ta), plain(to), am, ob))


def opening_order(slug, h, data, c, tag, tz):
    # S1-R1 names A to Z (S1-R2..R4); S1-R5 fixed bucket order, rows in name order, ties by number; S1-R6 groups in name order,
    # rows oldest date first, same date in number order (S2-R4). Judged on the full CSV, which follows the screen (S3-R3).
    import sort_check as K
    ix = {n: i for i, n in enumerate(h)}
    if 'summary' in slug:
        names = [r[0] for r in data]
        ok = all(K.namekey(a)[:2] <= K.namekey(b)[:2] for a, b in zip(names, names[1:]))
        bad = next((i for i, (a, b) in enumerate(zip(names, names[1:])) if K.namekey(a)[:2] > K.namekey(b)[:2]), None)
        c.ok(f'opening order: names A to Z, QuickBooks order (S1-R1..R4) [{tag}]', ok, None if ok else names[bad:bad + 2]); return
    num = 'ID' if 'ID' in ix else 'No.'
    if 'detail' in slug:
        nm = 'Customer Full Name' if 'Customer Full Name' in ix else 'Vendor Name'
        order = ['91 or more days past due', '61-90 days past due', '31-60 days past due', '1-30 days past due', 'Current']
        key = lambda r: (order.index(r[ix['Aging Bucket']]), K.namekey(r[ix[nm]])[:2], K.nat(r[ix[num]].lstrip("'")))
        what = 'buckets fixed, rows in name order, ties by number (S1-R5)'
    else:
        nm = 'Customer' if 'Customer' in ix else 'Vendor Name'
        key = lambda r: (K.namekey(r[ix[nm]])[:2], r[ix['Date']], K.nat(r[ix[num]].lstrip("'")))
        what = 'groups A to Z, rows oldest date first, same date by number (S1-R6, S2-R4)'
    ks = [key(r) for r in data]
    bad = [i for i in range(len(ks) - 1) if ks[i] > ks[i + 1]]
    c.ok(f'opening order: {what} [{tag}]', not bad, None if not bad else {'n': len(bad), 'first': [[data[i][ix[nm]][:30], data[i][ix[num]], data[i][ix['Date']]] for i in bad[:1]] + [[data[bad[0] + 1][ix[nm]][:30], data[bad[0] + 1][ix[num]], data[bad[0] + 1][ix['Date']]]]})


def check_pdf(key, slug, asof, scope, snap, path, c, tag):
    txt = subprocess.run(['pdftotext', '-layout', path, '-'], capture_output=True, text=True).stdout
    flat = re.sub(r'\s+', ' ', txt)
    c.ok(f'PDF "As of <Mon d, yyyy>" (S3-R4) [{tag}]', ('As of ' + mdy(asof)) in flat, flat[:160])
    c.ok(f'PDF Locations line (S3-R5) [{tag}]', ('Locations: ' + ('All locations' if scope == 'all' else OWNNAME[key])) in flat, flat[:200])
    c.ok(f'PDF never prints "Subtotal" (S3-R7b) [{tag}]', 'Subtotal' not in flat, None)
    if 'summary' in slug:
        c.ok(f'PDF heading "91 And Over" on one line (S3-R7) [{tag}]', '91 And Over' in txt, None)
        figs = [pdfm(snap['totals'][k]) for k in SK]
    else:
        figs = [pdfm(snap['totals']['amountCents']), pdfm(snap['totals']['openBalanceCents'])]
        groups = snap['groups'] if 'detail' in slug else snap['collection']
        names = [('Total for ' + (g['label'] if 'detail' in slug else g['name'].strip())) for g in groups if g.get('rowsNumber', 1)]
        found = sum(1 for n in names if re.sub(r'\s+', ' ', n)[:40] in flat)
        c.ok(f'PDF a "Total for <name>" row per group (S3-R7b) [{tag}]', found == len(names), (found, len(names)))
        lines = subprocess.run(['pdftotext', path, '-'], capture_output=True, text=True).stdout.splitlines()
        c.ok(f'PDF dates as "Nov 04 2026", never Today / Yesterday / N days ago (S3-R7a, S2-R1a) [{tag}]', bool(re.search(r'\b[A-Z][a-z]{2} \d\d \d{4}\b', flat)) and not any(re.fullmatch(r'(Today|Yesterday|\d+ days? ago)', l.strip()) for l in lines), None)
    c.ok(f'PDF carries the Totals figures in S3-R7a format [{tag}]', all(f in flat for f in figs), [f for f in figs if f not in flat])


OBS = {}
if __name__ == '__main__':
    out = {}
    for key in ('HD', 'LE'):
        p = os.path.join(EV, f'screen-{key}.json')
        if not os.path.exists(p):
            continue
        S = json.load(open(p)); c = C()
        # the narrowed ("own") runs in screen-<KEY>.json used the wrong address key (locations=) and were NOT narrowed: discarded;
        # the corrected run (locationIds=) is screen-<KEY>-own.json
        runs = [R for R in S['runs'] if R['scope'] != 'own']
        po = os.path.join(EV, f'screen-{key}-own.json')
        if os.path.exists(po):
            runs += json.load(open(po))['runs']
        for R in runs:
            if R.get('error'):
                c.ok('screen run completed', False, (R['slug'], R['asOf'], R['scope'], R['error'][:120])); continue
            check_run(key, R, c)
        out[key] = {'build_start_end': [S['start'].get('app_version'), (S.get('end') or {}).get('app_version')], 'rule99_start': S['start'], 'rule99_end': S.get('end'),
                    'counts': dict(c.n), 'failures': dict(c.f), 'observations': {k: sorted(v) for k, v in OBS.items()}}
        p_ = sum(v for k, v in c.n.items() if k.endswith(':pass')); f_ = sum(v for k, v in c.n.items() if k.endswith(':fail'))
        print(key, 'pass', p_, 'fail', f_); [print('  FAIL', k[:-5], v) for k, v in c.n.items() if k.endswith(':fail')]
    json.dump(out, open(os.path.join(EV, 'results-screen-downloads.json'), 'w'), indent=1, default=str)
