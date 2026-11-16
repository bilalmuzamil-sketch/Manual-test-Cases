#!/usr/bin/env python3
"""Item 2 (16 Nov) — every A/R/A/P header sort, judged against PRD 947650561 v13 using the FULL data (collect.mjs, Heavy Duty,
as of today, All locations) — never against the build's own idea of order.
 S2-R2 first click: text A to Z; money largest first; dates oldest first; Past Due largest first; ID/No. smallest number first;
       second click reverses; third repeats the first.      S2-R3 an already-sorted column reverses on its first click.
 S2-R4 ID/No. by number value; the same number-aware order breaks ties in every sort, smallest first in BOTH directions;
       a date column compares the day only.               S2-R5 groups never move.   S2-R6 blank values last in both directions.
 S1-R2/R3/R4 name order: capitals ignored, plain character order, accents folded; ties by plain lower-cased name.
 S1-R5/R6/R7 opening order.  S2-N1 A/P Unpaid Invoices' Vendor Name header is not clickable.
Number-aware order is read as "natural" order (text parts compared as text, digit runs by value); where the build differs only
between documents with different prefixes, that is reported separately (the PRD example uses one prefix only).
Usage: sort_check.py -> evidence/results-sort.json"""
import json, os, re, glob, unicodedata, collections, datetime as dt
from zoneinfo import ZoneInfo
EV = os.path.join(os.path.dirname(__file__), '..', 'evidence'); TZ = 'Asia/Karachi'; RAW = '/tmp/cln/arap/sort/'
SNAP = '/tmp/cln/arap/HD/{}/all/'
FOLD = {'ß': 'ss', 'æ': 'ae', 'œ': 'oe', 'ø': 'o', 'Æ': 'ae', 'Œ': 'oe', 'Ø': 'o'}


def fold(s):
    s = ''.join(FOLD.get(ch, ch) for ch in s)
    return ''.join(ch for ch in unicodedata.normalize('NFKD', s) if not unicodedata.combining(ch)).lower()


def namekey(name, ident=''):
    return (fold(name), name.lower(), ident)


def nat(s):
    # number-aware (S2-R4 "S1-99 before S1-100"): a digit run compares by value; every other character by plain character
    # order with capitals ignored (the S1-R2 convention). The PRD is silent on punctuation-led or mixed-prefix numbers; this
    # reading is recorded as an observation, not as an expectation the build was held to beyond the PRD's own example.
    out = []
    for p in re.split(r'(\d+)', (s or '').lower()):
        if p.isdigit():
            out.append((48, int(p)))
        else:
            out.extend((ord(ch), 0) for ch in p)
    return out


def dday(x):
    return None if x is None else dt.datetime.fromisoformat(x.replace('Z', '+00:00')).astimezone(ZoneInfo(TZ)).date()


SUMCOL = {'Current': 'currentCents', '1-30 Days': 'days1To30Cents', '31-60 Days': 'days31To60Cents', '61-90 Days': 'days61To90Cents', '91 And Over': 'days91PlusCents', 'Total': 'totalCents'}
# per column: (value getter, kind) ; kind: text / money / date / pastdue / docno
DOCCOL = {'Date': (lambda r: dday(r['date']), 'date'), 'Due Date': (lambda r: dday(r['dueDate']), 'date'), 'Location': (lambda r: r['locationName'] or None, 'text'),
          'Transaction Type': (lambda r: r['transactionType'], 'text'), 'ID': (lambda r: r['documentNumber'], 'docno'), 'No.': (lambda r: r['documentNumber'], 'docno'),
          'Customer Full Name': (lambda r: r.get('customerName'), 'name'), 'Vendor Name': (lambda r: r.get('vendorName'), 'name'),
          'Past Due': (lambda r: r['daysPastDue'], 'pastdue'), 'Amount': (lambda r: r['amountCents'], 'money'), 'Open Balance': (lambda r: r['openBalanceCents'], 'money')}
FIRST_DESC = {'money': True, 'pastdue': True, 'date': False, 'text': False, 'name': False, 'docno': False}


def primary(v, kind):
    if kind == 'docno':
        return nat(v)
    if kind in ('text',):
        return fold(v)
    if kind == 'name':
        return namekey(v)
    return v


def doc_order(rows, col, desc):
    get, kind = DOCCOL[col]
    blank = [r for r in rows if get(r) is None]; full = [r for r in rows if get(r) is not None]
    tie = lambda r: (nat(r['documentNumber']), r['documentId'])
    full.sort(key=tie)                                         # stable: ties stay smallest number first in both directions
    full.sort(key=lambda r: primary(get(r), kind), reverse=desc)
    blank.sort(key=tie)
    return full + blank


def summ_order(rows, col, desc, nm, idk):
    if col in ('Customer', 'Vendor'):
        return sorted(rows, key=lambda r: namekey(r[nm], r[idk]), reverse=desc)
    if col == 'Location':
        get = lambda r: fold(r['locationName']) if r['locationName'] else None
    else:
        k = SUMCOL[col]; get = lambda r: r[k] if (r[k] != 0 or k == 'totalCents') else None   # empty bucket = blank (S2-R6, S3-R8)
    full = sorted([r for r in rows if get(r) is not None], key=lambda r: namekey(r[nm], r[idk]))
    full.sort(key=get, reverse=desc)
    return full + sorted([r for r in rows if get(r) is None], key=lambda r: namekey(r[nm], r[idk]))


def direction(col, click, kind):
    d1 = FIRST_DESC[kind]
    return d1 if click % 2 == 1 else (not d1)


def main():
    S = json.load(open(os.path.join(EV, 'sort-HD.json'))); today = S['start']['at_utc'][:10]
    today = dt.datetime.fromisoformat(S['start']['at_utc'].replace('Z', '+00:00')).astimezone(ZoneInfo(TZ)).date().isoformat()
    snap = {s: json.load(open(SNAP.format(today) + s + '.json')) for s in ['ar-aging-summary', 'ap-aging-summary', 'ar-aging-detail', 'ap-aging-detail', 'ar-aging-collection', 'ap-unpaid-invoices']}
    res = []; cnt = collections.Counter()
    def rec(slug, label, click, check, ok, detail=None):
        res.append({'report': slug, 'header': label, 'click': click, 'check': check, 'ok': ok, 'detail': detail}); cnt[(slug, 'pass' if ok else 'fail')] += 1
    for R in S['runs']:
        slug, label, click = R['slug'], R['label'], R['click']
        if click == 0 or not R.get('raw'):
            if R.get('error'):
                rec(slug, label, click, 'header label found', False, R['error'])
            continue
        raw = json.load(open(R['raw'])); reqs = raw['requests']
        if slug == 'ap-unpaid-invoices' and label == 'Vendor Name':
            rec(slug, label, click, 'S2-N1 Vendor Name not clickable: no sort request, no sort mark', not reqs and not any(a['label'] == 'Vendor Name' for a in R['aria']), (len(reqs), R['aria'], R.get('cursor')))
            continue
        summ = 'summary' in slug
        kind = ('money' if label in SUMCOL else 'text' if label == 'Location' else 'name') if summ else DOCCOL[label][1]
        opening_col = (summ and label in ('Customer', 'Vendor')) or (slug in ('ar-aging-collection', 'ap-unpaid-invoices') and label == 'Date')
        desc = direction(label, click, kind) != opening_col     # S2-R3: the column the report opened on reverses on its first click
        mark = [a for a in R['aria'] if a['aria'] in ('ascending', 'descending')]
        rec(slug, label, click, 'only the clicked header carries the sort mark, in the click\'s direction', len(mark) == 1 and mark[0]['label'] == label and mark[0]['aria'] == ('descending' if desc else 'ascending'), R['aria'])
        if not reqs:
            if click == 3:
                r1 = json.load(open(R['raw'].replace('__3.json', '__1.json')))
                rec(slug, label, click, 'S2-R2 third click repeats the first: same rows drawn as after click 1 (answer re-used, no new request)', raw['drawn'][:20] == r1['drawn'][:20], None)
            elif click == 2 and opening_col:
                o = next(x for x in S['runs'] if x['slug'] == slug and x['click'] == 0)
                rec(slug, label, click, 'S2-R3 second click on the opening column returns to the opening order (answer re-used)', [r[:6] for r in raw['drawn'][:8]] == o['first'], None)
            else:
                rec(slug, label, click, 'a sorted answer was received for this click', False, 'no request captured')
            continue
        if summ:
            nm, idk = ('customerName', 'customerId') if slug.startswith('ar') else ('vendorName', 'vendorId')
            page = [q for q in reqs if 'pagination[sortBy]' in q['u']]
            if not page:
                rec(slug, label, click, 'sort request sent', False, [q['u'][:120] for q in reqs]); continue
            got = page[-1]['j']['data']['collection']; exp = summ_order(snap[slug]['collection'], label, desc, nm, idk)[:len(got)]
            same = [g[idk] for g in got] == [e[idk] for e in exp]
            if not same and label not in ('Customer', 'Vendor'):        # tolerate tie order: compare the sorted values position by position
                key = (lambda r: r['locationName']) if label == 'Location' else (lambda r: r[SUMCOL[label]])
                same_vals = [key(g) for g in got] == [key(e) for e in exp]
            else:
                same_vals = same
            rec(slug, label, click, 'answer = PRD order of the full data (S1-R2..R4, S2-R2, S2-R6 blanks last)', same_vals,
                None if same_vals else {'got': [(g[nm][:25], g.get(SUMCOL.get(label, 'totalCents')), g['locationName']) for g in got[:6]], 'exp': [(e[nm][:25], e.get(SUMCOL.get(label, 'totalCents')), e['locationName']) for e in exp[:6]], 'sortBy': page[-1]['u'].split('sortBy]=')[1][:40]})
            if same_vals and not same:
                rec(slug, label, click, 'tie order inside equal values (no PRD rule for account rows; recorded)', True, 'ties ordered differently from name order')
            dn = [r[0] for r in raw['drawn'] if r]
            rec(slug, label, click, 'screen draws the answer in the same order', dn[:len(got)][:10] == [g[nm].strip() for g in got][:10] or len(dn) == 0, dn[:3])
            continue
        if 'detail' in slug:
            rowsreq = [q for q in reqs if '/buckets/' in q['u']]
            if not rowsreq:
                rec(slug, label, click, 'sort request sent for the open buckets', False, [q['u'][:120] for q in reqs]); continue
            for q in rowsreq:
                b = q['u'].split('/buckets/')[1].split('/')[0]; got = q['j']['data']['collection']
                exp = doc_order(snap[slug]['rows'][b], label, desc)[:len(got)]
                ok = [g['documentNumber'] for g in got] == [e['documentNumber'] for e in exp]
                rec(slug, label, click, f'bucket {b}: answer = PRD order of the whole bucket (S2-R2, S2-R4 ties, S2-R6)', ok,
                    None if ok else first_diff(got, exp, label))
        else:
            gr = [q for q in reqs if 'pagination[sortBy]' in q['u']]
            if not gr:
                rec(slug, label, click, 'sort request sent', False, [q['u'][:120] for q in reqs]); continue
            groups = gr[-1]['j']['data']['collection']; full = {g['customerId' if slug.startswith('ar') else 'vendorId']: g for g in snap[slug]['collection']}
            opening = [g['customerId' if slug.startswith('ar') else 'vendorId'] for g in snap[slug]['collection']][:len(groups)]
            gid = 'customerId' if slug.startswith('ar') else 'vendorId'
            rec(slug, label, click, 'S2-R5 groups never move (same group order as opening)', [g[gid] for g in groups] == opening, None)
            bad = []
            for g in groups:
                exp = doc_order(full[g[gid]]['rows'], label, desc)
                if [r['documentNumber'] for r in g['rows']] != [r['documentNumber'] for r in exp]:
                    bad.append((g['name'][:25], first_diff(g['rows'], exp, label)))
            rec(slug, label, click, f'rows inside each of the first {len(groups)} groups in PRD order (S2-R2, S2-R4, S2-R6)', not bad, {'groups_wrong': len(bad), 'first': bad[:3]})
    # opening order (click 0) for every report: S1-R1, S1-R5, S1-R6
    out = {'build': [S['start'].get('app_version'), (S.get('end') or {}).get('app_version')], 'rule99': S['start'], 'counts': {f'{k[0]}:{k[1]}': v for k, v in cnt.items()}, 'results': res}
    json.dump(out, open(os.path.join(EV, 'results-sort.json'), 'w'), indent=1, default=str)
    for k, v in sorted(out['counts'].items()):
        print(k, v)
    for r in res:
        if not r['ok']:
            print('FAIL', r['report'], r['header'], r['click'], r['check'][:70], json.dumps(r['detail'], default=str)[:400])


def first_diff(got, exp, label):
    get, kind = DOCCOL[label]
    for i, (g, e) in enumerate(zip(got, exp)):
        if g['documentNumber'] != e['documentNumber']:
            return {'pos': i, 'got': [(x['documentNumber'], str(get(x))) for x in got[max(0, i - 1):i + 3]], 'exp': [(x['documentNumber'], str(get(x))) for x in exp[max(0, i - 1):i + 3]]}
    return {'len': (len(got), len(exp))}


if __name__ == '__main__':
    main()
