"""s1_classify.py - 12 Nov 2026: sort every difference between the staging reports after the release and the copies saved before it
(before/*.tsv, as of 12 Nov 2026), for C715471 (A/R) and C715472 (A/P). Uses s1/compare.json + s1/after-*.json from s1_compare.mjs.
Checks: (1) new documents - is each one provably made after the copy (customer/vendor absent before, or dated 12 Nov, or a number above
every number of its series before)? (2) Summary rows of customers/vendors with no new, gone or moved documents must be identical, bucket by
bucket. (3) Past Due before vs after on A/P Detail, and every changed Past Due explained by counting the day in Asia/Karachi (the signed-in
location's zone) instead of Greenwich time. Output s1/classify.json."""
import json, csv, re, collections
from datetime import datetime, date, timezone
from zoneinfo import ZoneInfo
o = json.load(open('s1/compare.json')); T = lambda n: list(csv.DictReader(open('before/' + n), delimiter='\t'))
K = ZoneInfo('Asia/Karachi'); AS = date(2026, 11, 12); out = {}
def series(n): m = re.match(r'^(.*?)(\d+)$', n or ''); return (m.group(1), int(m.group(2))) if m else (n, None)
def explain_new(rows_before, new, namekey):
    names = {r[namekey] for r in rows_before}; mx = collections.defaultdict(int)
    for r in rows_before:
        p, n = series(r['transactionNumber'])
        if n is not None: mx[p] = max(mx[p], n)
    why = collections.Counter(); left = []
    for k, num, name, d, b, bal, loc in new:
        p, n = series(num)
        if name not in names: why['customer or vendor not in the saved copy'] += 1
        elif (d or '')[:10] >= '2026-11-12': why['dated 12 Nov (after the copy)'] += 1
        elif n is not None and n > mx.get(p, 10**12): why['number above every %s number in the copy' % p] += 1
        else: left.append([num, name, d, b, bal, loc])
    return dict(why), left
ard_b = T('AR Aging Detail - all documents.tsv'); apd_b = T('AP Aging Detail - all documents.tsv')
out['ard_new'] = explain_new(ard_b, o['ard']['new'], 'customerName'); out['apd_new'] = explain_new(apd_b, o['apd']['new'], 'vendorName')
# (2) Summary rows of untouched customers / vendors
def summ(before_name, after_file, namekey, touched):
    b = {r[namekey]: r for r in T(before_name)}; a = json.load(open(after_file))['rows']; same = diff = 0; ex = []
    cols = [('current', 'currentCents'), ('days1to30', 'days1To30Cents'), ('days31to60', 'days31To60Cents'), ('days61to90', 'days61To90Cents'), ('days91Plus', 'days91PlusCents'), ('total', 'totalCents')]
    for r in a:
        n = r.get(namekey)
        if n in touched or n not in b: continue
        x = b[n]
        if all(round(float(x[c] or 0) * 100) == r[k] for c, k in cols): same += 1
        else: diff += 1; ex.append((n, [x[c] for c, _ in cols], [r[k] for _, k in cols]))
    gone = [n for n in b if n not in {r.get(namekey) for r in a} and n not in touched]
    return {'untouched_same': same, 'untouched_diff': diff, 'examples': ex[:5], 'in_copy_not_now_untouched': gone[:10]}
tA = {x[2] for k in ('new', 'gone', 'bucket', 'intended') for x in o['ard'][k]}; tP = {x[2] for k in ('new', 'gone', 'bucket', 'intended') for x in o['apd'][k]}
out['ars'] = summ('AR Aging Summary - all rows.tsv', 's1/after-ars.json', 'customerName', tA); out['aps'] = summ('AP Aging Summary - all rows.tsv', 's1/after-aps.json', 'vendorName', tP)
# (3) A/P Past Due before vs after
apd_a = {r['documentId']: r for r in json.load(open('s1/after-apd.json'))}; ch = 0; expl = 0; unexpl = []
for r in apd_b:
    a = apd_a.get(r['id'])
    if not a or r['daysPastDue'] == '': continue
    if int(float(r['daysPastDue'])) != a['daysPastDue']:
        ch += 1; due = datetime.fromisoformat(a['dueDate'].replace('Z', '+00:00')).astimezone(K).date()
        if (AS - due).days == a['daysPastDue'] and (AS - datetime.fromisoformat(a['dueDate'].replace('Z', '+00:00')).date()).days == int(float(r['daysPastDue'])): expl += 1
        else: unexpl.append([r['transactionNumber'], r['vendorName'], r['dueDate'], r['daysPastDue'], a['daysPastDue'], a['transactionType']])
out['apd_pastdue'] = {'changed': ch, 'explained_by_karachi_day': expl, 'unexplained': unexpl[:15], 'unexplained_count': len(unexpl)}
# A/R moves explained the same way
ard_a = {r['documentNumber'] + '|' + r['customerName']: r for r in json.load(open('s1/after-ard.json'))}; mv = []
for x in o['ard']['bucket'] + o['ard']['intended']:
    a = ard_a[x[0]]; d = datetime.fromisoformat(a['dueDate'].replace('Z', '+00:00'))
    mv.append([x[1], x[2], a['locationName'], a['dueDate'], d.date().isoformat(), d.astimezone(K).date().isoformat(), (AS - d.date()).days, a['daysPastDue'], x[5], x[6]])
out['ard_moves'] = mv
json.dump(out, open('s1/classify.json', 'w'), indent=1)
print(json.dumps({k: (v if k != 'ard_moves' else len(v)) for k, v in out.items()}, default=str)[:3000])
