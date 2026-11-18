"""Release audit 18 Nov 2026 — whole-data checks of the six A/R and A/P aging reports against PRD v14 (quoted rules only).
python3 scripts/invariants.py <data dir> <zone> [--fetch-detail-opening]
Every rule checked is quoted in RULES below; a check either PASSES with a count or lists the first failures."""
import json, sys, re, unicodedata, collections, datetime, subprocess, urllib.parse
from zoneinfo import ZoneInfo
D, Z = sys.argv[1], sys.argv[2]; FETCH = '--fetch-detail-opening' in sys.argv
J = lambda s: json.load(open(f'{D}/{s}.json'))
out, fails = [], collections.OrderedDict()
def check(rule, bad, n, note=''):
    fails[rule] = (len(bad), n); out.append(f'- **{rule}** — {"PASS" if not bad else "FAIL"}: {len(bad)} wrong of {n} {note}')
    out.extend(f'  - {b}' for b in bad[:8])
# S1-R3 fold, S1-R2 plain character order ignoring capitals, S1-R4 tie on lower-cased plain name
FOLD = {'ß': 'ss', 'æ': 'ae', 'œ': 'oe', 'ø': 'o', 'Æ': 'ae', 'Œ': 'oe', 'Ø': 'o'}
def fold(s):
    s = ''.join(FOLD.get(c, c) for c in s)
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')
namekey = lambda n: (fold(n).lower(), n.lower())
def numkey(s):   # S2-R4 "sort by number value: S1-99 before S1-100"; between them plain character order (S1-R2):
    # a digit run compares as one number, placed where a digit sits in character order ('-', ' ', '.' before digits)
    return [(48, int(t)) if t.isdigit() else (ord(t), 0) for t in re.findall(r'\d+|\D', (s or '').lower())]
day = lambda iso: datetime.datetime.fromisoformat(iso.replace('Z', '+00:00')).astimezone(ZoneInfo(Z)).date()
AS = datetime.date(2026, 11, 18)
ORDER = ['days_91_plus', 'days_61_to_90', 'days_31_to_60', 'days_1_to_30', 'current']
SB = {'current': 'currentCents', 'days_1_to_30': 'days1To30Cents', 'days_31_to_60': 'days31To60Cents', 'days_61_to_90': 'days61To90Cents', 'days_91_plus': 'days91PlusCents'}
bucket_for = lambda d: 'current' if d <= 0 else 'days_1_to_30' if d <= 30 else 'days_31_to_60' if d <= 60 else 'days_61_to_90' if d <= 90 else 'days_91_plus'
out.append(f'# Whole-data checks, as of {AS}, screen zone {Z}\n')
for side, P, summ, det, grp in (('A/R', 'customer', 'ar-aging-summary', 'ar-aging-detail', 'ar-aging-collection'), ('A/P', 'vendor', 'ap-aging-summary', 'ap-aging-detail', 'ap-unpaid-invoices')):
    out.append(f'\n## {side}\n'); S, Dt, G = J(summ), J(det), J(grp); rows = Dt['rows']
    # S1-R5a per document
    bad = []
    for r in rows:
        due = r['dueDate'] or r['date']; exp = (AS - day(due)).days
        if r['daysPastDue'] != exp: bad.append(f"{r['documentNumber']} Past Due {r['daysPastDue']} vs {exp} (due {day(due)})")
    check(f'{side} Detail S1-R5a Past Due = as-of minus due date (credit: own date)', bad, len(rows))
    bad = [f"{r['documentNumber']} in {r['bucket']} with Past Due {r['daysPastDue']}" for r in rows if bucket_for(r['daysPastDue']) != r['bucket']]
    check(f'{side} Detail bucket agrees with Past Due (S1-R5a)', bad, len(rows))
    gb = [g['bucket'] for g in Dt['groups']]
    check(f'{side} Detail S1-R5 bucket order "91+, 61-90, 31-60, 1-30, Current"', [] if gb == ORDER else [str(gb)], 1)
    # S5-R18 totals add up
    bad = []
    for g in Dt['groups']:
        rs = [r for r in rows if r['bucket'] == g['bucket']]
        for f in ('amountCents', 'openBalanceCents'):
            if sum(r[f] for r in rs) != g[f]: bad.append(f"{g['bucket']} {f} group {g[f]} vs rows {sum(r[f] for r in rs)}")
        if len(rs) != g['rowsNumber']: bad.append(f"{g['bucket']} rowsNumber {g['rowsNumber']} vs {len(rs)}")
    for f in ('amountCents', 'openBalanceCents'):
        if sum(r[f] for r in rows) != Dt['totals'][f]: bad.append(f'Totals {f}')
    check(f'{side} Detail S5-R18 every "Total for" and Totals add up the lines', bad, len(Dt['groups']) + 2)
    bad = []
    for f in list(SB.values()) + ['totalCents']:
        s = sum(r[f] for r in S['rows'])
        if s != S['totals'][f]: bad.append(f'{f}: rows {s} vs Totals {S["totals"][f]}')
    bad += [f"{r[P+'Name']} total {r['totalCents']} != buckets" for r in S['rows'] if sum(r[f] for f in SB.values()) != r['totalCents']]
    check(f'{side} Summary S5-R18 Totals row = sum of the rows; each row total = its buckets', bad, len(S['rows']) + 6)
    # S5-R18a Summary vs Detail bucket by bucket, and per party
    bad = [f"{b}: Summary {S['totals'][SB[b]]} vs Detail {next(g['openBalanceCents'] for g in Dt['groups'] if g['bucket']==b)}" for b in ORDER if S['totals'][SB[b]] != next(g['openBalanceCents'] for g in Dt['groups'] if g['bucket'] == b)]
    check(f'{side} S5-R18a Summary Totals = Detail Open Balance Totals bucket by bucket', bad, 5)
    per = collections.Counter()
    for r in rows: per[(r[P+'Id'], r['bucket'])] += r['openBalanceCents']
    bad = [f"{r[P+'Name']} {b}: Summary {r[SB[b]]} vs Detail {per[(r[P+'Id'], b)]}" for r in S['rows'] for b in ORDER if r[SB[b]] != per[(r[P+'Id'], b)]]
    ids_s = {r[P+'Id'] for r in S['rows']}; ids_d = {r[P+'Id'] for r in rows}
    bad += [f'{P} only in Detail: {x}' for x in ids_d - ids_s] + [f'{P} only in Summary: {x}' for x in ids_s - ids_d]
    check(f'{side} S5-R18a each {P}: Summary row = its Detail lines, bucket by bucket', bad, len(S['rows']) * 5)
    # S1-R1 Summary opening order + S1-R8 no repeats
    names = [r[P+'Name'] for r in S['rows']]
    bad = [f'"{names[i]}" before "{names[i+1]}"' for i in range(len(names) - 1) if namekey(names[i]) > namekey(names[i+1])]
    check(f'{side} Summary S1-R1..R4 opens in name order', bad, len(names) - 1)
    c = collections.Counter(r[P+'Id'] for r in S['rows']); check(f'{side} Summary S1-R8 paging repeats no {P}', [k for k, v in c.items() if v > 1], len(c))
    # grouped report: S1-R6 groups in name order, rows oldest date first then doc number; same documents as Detail
    gn = [g['name'] for g in G['rows']]
    check(f'{side} {grp} S1-R6 groups in name order', [f'"{gn[i]}" before "{gn[i+1]}"' for i in range(len(gn) - 1) if namekey(gn[i]) > namekey(gn[i+1])], len(gn) - 1)
    bad, gdocs = [], []
    for g in G['rows']:
        rs = g['rows']; gdocs += rs
        if len(rs) != g['rowsNumber']: bad.append(f"{g['name']}: {len(rs)} lines of {g['rowsNumber']} read")
        for i in range(len(rs) - 1):
            a, b = rs[i], rs[i+1]
            if (day(a['date']), numkey(a['documentNumber'])) > (day(b['date']), numkey(b['documentNumber'])): bad.append(f"{g['name']}: {a['documentNumber']} ({day(a['date'])}) before {b['documentNumber']} ({day(b['date'])})")
        for f in ('amountCents', 'openBalanceCents'):
            if sum(r[f] for r in rs) != g[f]: bad.append(f"{g['name']} {f} subtotal {g[f]} vs lines {sum(r[f] for r in rs)}")
    check(f'{side} {grp} S1-R6 rows oldest date first, ties by number; subtotals add up', bad, len(gdocs))
    bad = [f'Totals {f}' for f in ('amountCents', 'openBalanceCents') if sum(g[f] for g in G['rows']) != G['totals'][f]]
    if G['totals']['documentCount'] != len(gdocs): bad.append(f"documentCount {G['totals']['documentCount']} vs {len(gdocs)}")
    check(f'{side} {grp} S5-R18 Totals = sum of groups', bad, 3)
    dd = {r['documentId']: r for r in rows}
    bad = []
    for r in gdocs:
        x = dd.get(r['documentId'])
        if not x: bad.append(f"{r['documentNumber']} not on Detail"); continue
        for f in ('amountCents', 'openBalanceCents', 'documentNumber', 'date', 'locationName'):
            if r[f] != x[f]: bad.append(f"{r['documentNumber']} {f} {r[f]} vs Detail {x[f]}")
        if r['daysPastDue'] is not None and r['daysPastDue'] != x['daysPastDue']: bad.append(f"{r['documentNumber']} Past Due {r['daysPastDue']} vs Detail {x['daysPastDue']}")
    check(f'{side} {grp} every document matches the same document on Detail', bad, len(gdocs))
    if side == 'A/P':
        miss = set(dd) - {r['documentId'] for r in gdocs}
        check('A/P Unpaid holds every A/P Detail document', [dd[m]['documentNumber'] for m in list(miss)[:8]], len(dd))
        blank = [r for r in gdocs if r['daysPastDue'] is None]
        out.append(f'  - note: {len(blank)} A/P Unpaid lines with no Past Due (types: {dict(collections.Counter(r["transactionType"] for r in blank))})')
    else:
        # S8-R1 description (PRD v14): "Overdue invoices, unused credit memos and deposits for each customer ... Excludes invoices that aren't due yet."
        # due exactly on the as-of date = not overdue: excluded, as the old report did (fc08f23 CollectionsItem.php:31 "getPastDue(asOf) <= 0 -> continue")
        want = {r['documentId'] for r in rows if not (r['transactionType'] == 'Invoice' and r['daysPastDue'] <= 0)}
        have = {r['documentId'] for r in gdocs}; inv0 = {r['documentId'] for r in rows if r['transactionType'] == 'Invoice' and r['daysPastDue'] == 0}
        check('A/R Collection = A/R Detail minus invoices not overdue (S8-R1 "Overdue invoices"; old report CollectionsItem.php:31)', [f"extra {dd[x]['documentNumber']} PD {dd[x]['daysPastDue']}" for x in have - want][:6] + [f"missing {dd[x]['documentNumber']} PD {dd[x]['daysPastDue']}" for x in want - have][:6], len(want | have),
              f'(invoices due exactly on the as-of date: {len(inv0)}, of which on Collection: {len(inv0 & have)})')
    # Detail opening order (S1-R5): read every bucket as the screen opens it
    if FETCH:
        CK = open('/tmp/staging/cookie-header.txt').read().strip(); sort = f'{P}_name'; bad = []; n = 0; dup = 0; got = []
        for b in ORDER:
            page, rs = 1, []
            while True:
                u = (f'https://api.staging.shopview.com/api/reporting/reports/{det}/buckets/{b}/rows?asOfDate={AS}&timezone={urllib.parse.quote(Z)}'
                     f'&pagination[page]={page}&pagination[rowsPerPage]=100&pagination[sortBy]={sort}&pagination[descending]=false')
                o = subprocess.run(['curl', '-g', '-s', '-m', '180', '-H', 'Cookie: ' + CK, '-H', 'Accept: application/json', '-H', 'Origin: https://app.staging.shopview.com', u], capture_output=True, text=True).stdout
                d = json.loads(o)['data']; rs += d['collection']
                if not d['collection'] or len(rs) >= d['pagination']['rowsNumber']: break
                page += 1
            got += rs; n += len(rs); dup += len(rs) - len({r['documentId'] for r in rs})
            for i in range(len(rs) - 1):
                a, c2 = rs[i], rs[i+1]
                if (namekey(a[P+'Name']), numkey(a['documentNumber'])) > (namekey(c2[P+'Name']), numkey(c2['documentNumber'])):
                    bad.append(f"{b}: {a[P+'Name']} {a['documentNumber']} before {c2[P+'Name']} {c2['documentNumber']}")
        json.dump(got, open(f'{D}/{det}-opening-order.json', 'w'))
        check(f'{side} Detail S1-R5 lines open in {P} name order, ties by number (100-line pages)', bad, n)
        check(f'{side} Detail S1-R8 paging repeats/skips no line', ([f'{dup} repeated'] if dup else []) + ([f'{len(rows)-n} skipped'] if n != len(rows) else []), len(rows))
open(f'{D}/INVARIANTS.md', 'w').write('\n'.join(out) + '\n'); json.dump(fails, open(f'{D}/invariants.json', 'w'), indent=1)
print('\n'.join(l for l in out if l.startswith('- ') or l.startswith('#')))
