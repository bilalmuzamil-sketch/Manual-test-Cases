"""s2_judge.py — 11 Nov 2026: check S2 sort runs from s2/<id>.json. For each 'click <col> #n' step: the arrow is on <col> (aria
ascending/descending), and the rows read (whole table for Summaries/Collection-group lists, or each read bucket segment) follow <col>
in that direction. Money/number columns compare as numbers (blank = 0); text columns compare case-insensitively; dates as dates.
Ties are reported with the next column so a tie-break can be judged by eye. Usage: python3 s2_judge.py C715289 C715290 ..."""
import json, sys, re, datetime
def num(s):
    s = (s or '').replace('$', '').replace(',', '').strip()
    if s in ('', '-'): return 0.0
    try: return float(s)
    except ValueError: return None
def dt(s):
    try: return datetime.datetime.strptime(s.strip(), '%b %d, %Y')
    except Exception: return None
def key(v):
    n = num(v)
    if n is not None: return (0, n)
    d = dt(v)
    if d: return (1, d.timestamp())
    return (2, (v or '').lower())
for cid in sys.argv[1:]:
    o = json.load(open(f's2/{cid}.json')); print('=====', cid, o.get('err') or '')
    for st in o['steps']:
        m = re.match(r'click (.+) #\d+', st['label']); ths = [h['t'] for h in st['ths']]
        mark = [(h['t'], h['aria']) for h in st['ths'] if h['aria'] and h['aria'] != 'none']
        if not m: print('  ', st['label'], 'marked', mark); continue
        col = m.group(1); d = dict(mark).get(col); ci = ths.index(col) if col in ths else None
        tables = []
        if st.get('full'): tables.append(('table', [r for r in st['full'] if len(r) == len(ths) and not (r[0] or '').startswith('Totals')]))
        for k, s in (st.get('segs') or {}).items(): tables.append((s['head'][:30], [r['cells'] for r in s['rows'] if len(r['cells']) == len(ths)]))
        for name, rows in tables:
            if ci is None or not rows: print('  ', st['label'], name, 'no rows/col', col in ths); continue
            ks = [key(r[ci]) for r in rows]; bad = []
            for i in range(len(ks) - 1):
                if (d == 'ascending' and ks[i] > ks[i + 1]) or (d == 'descending' and ks[i] < ks[i + 1]): bad.append((i, rows[i][ci], rows[i + 1][ci]))
            ties = sum(1 for i in range(len(ks) - 1) if ks[i] == ks[i + 1])
            print('  ', st['label'], '| marked', mark, '|', name, 'rows', len(rows), '| order breaks', len(bad), bad[:3], '| ties', ties, '| first', [rows[0][0][:25], rows[0][ci]], 'last', [rows[-1][0][:25], rows[-1][ci]])
