"""s2x_judge.py — 11 Nov 2026: judge the exact-amount sort tests (s2x.json) from exec/s2/<id>.json and make annotated pictures.
EXP[id] = list per step (after the opening snapshot) of (header label, expected order of the seeded names as letters, short sentence).
Rows are matched by the seeded names (customer/vendor for summaries; for Detail/Collection the row whose text holds the document's amount).
Prints PASS/FAIL per step; writes RESULTS-s2x-<tag>.json for the ids given on the command line. Usage: python3 s2x_judge.py <tag> C715289 …"""
import json, sys, re
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def by_name(prefix):  # rows of a summary report: letter = the seeded name's letter
    def f(row): m = re.match(prefix + r' ([A-E]) ', row[0] + ' '); return m.group(1) if m else None
    return f
DOCS = {'A': '$300.00', 'B': '$100.00', 'C': '$200.00'}  # document amounts (A $300 open $50, B $100, C $200 open $150)
def by_amount(row):
    if not re.search(r'\d{4}', row[0] if row else ''): return None  # document rows start with a date
    hits = [k for k, v in DOCS.items() if v in row]; return hits[0] if len(hits) == 1 else None
SUM_AR = by_name('ZZX Sort Cust'); SUM_AP = by_name('ZZY Sort Vend')
EXP = {
 'C715289': (SUM_AR, [('Current', 'BCA'), ('Current', 'ACB'), ('Current', 'BCA'), ('1-30 Days', 'CAB'), ('1-30 Days', 'BAC'), ('1-30 Days', 'CAB'), ('31-60 Days', 'ABC'), ('31-60 Days', 'CBA'), ('31-60 Days', 'ABC')]),
 'C715290': (SUM_AR, [('61-90 Days', 'BAC'), ('61-90 Days', 'CAB'), ('61-90 Days', 'BAC'), ('91 And Over', 'ACB'), ('91 And Over', 'BCA'), ('91 And Over', 'ACB'), ('Total', 'ABC'), ('Total', 'CBA'), ('Total', 'ABC')]),
 'C715295': (by_amount, [('Date', 'ACB'), ('Date', 'BCA'), ('Date', 'ACB'), ('Due Date', 'BAC'), ('Due Date', 'CAB')]),
 'C715296': (by_amount, [('Amount', 'ACB'), ('Amount', 'BCA'), ('Open Balance', 'CBA'), ('Open Balance', 'ABC'), ('Open Balance', 'CBA')]),
 'C715300': (by_amount, [('Past Due', 'BAC'), ('Past Due', 'CAB'), ('Amount', 'ACB'), ('Amount', 'BCA'), ('Open Balance', 'CBA'), ('Open Balance', 'ABC'), ('Open Balance', 'CBA')]),
 'C715588': (by_amount, [('Due Date', 'BAC'), ('Due Date', 'CAB'), ('Due Date', 'BAC')]),
 'C715292': (SUM_AP, [('Current', 'BCA'), ('Current', 'ACB'), ('Current', 'BCA'), ('1-30 Days', 'CAB'), ('1-30 Days', 'BAC'), ('1-30 Days', 'CAB'), ('31-60 Days', 'ABC'), ('31-60 Days', 'CBA'), ('31-60 Days', 'ABC')]),
 'C715293': (SUM_AP, [('61-90 Days', 'BAC'), ('61-90 Days', 'CAB'), ('61-90 Days', 'BAC'), ('91 And Over', 'ACB'), ('91 And Over', 'BCA'), ('91 And Over', 'ACB'), ('Total', 'ABC'), ('Total', 'CBA'), ('Total', 'ABC')]),
 'C715303': (by_amount, [('Date', 'ACB'), ('Date', 'BCA'), ('Date', 'ACB'), ('Due Date', 'BAC'), ('Due Date', 'CAB')]),
 'C715304': (by_amount, [('Past Due', 'BAC'), ('Past Due', 'CAB'), ('Amount', 'ACB'), ('Amount', 'BCA'), ('Open Balance', 'CBA'), ('Open Balance', 'ABC'), ('Open Balance', 'CBA')]),
 'C715308': (by_amount, [('Past Due', 'BAC'), ('Past Due', 'CAB'), ('Amount', 'ACB'), ('Amount', 'BCA'), ('Open Balance', 'CBA'), ('Open Balance', 'ABC'), ('Open Balance', 'CBA')]),
 'C715591': (by_amount, [('Due Date', 'BAC'), ('Due Date', 'CAB'), ('Due Date', 'BAC')]),
}
def judge(cid):
    o = json.load(open(PP + 's2/%s.json' % cid)); key, exp = EXP[cid]; steps = o['steps'][1:]; out = []; ok = True
    for i, ((th, want), st) in enumerate(zip(exp, steps), 1):
        rows = st.get('full') or []
        got = ''.join(k for k in (key(r) for r in rows) if k)
        arrow = [t[0] for t in st.get('ths', []) if isinstance(t, (list, tuple))] if False else None
        good = got == want; ok &= good
        out.append({'step': i, 'header': th, 'want': want, 'got': got, 'ok': good, 'shot': st['shot'], 'boxes': st.get('boxes', [])})
    if len(steps) < len(exp): ok = False; out.append({'missing_steps': len(exp) - len(steps)})
    return ok, out
if __name__ == '__main__':
    tag, ids = sys.argv[1], sys.argv[2:]; res = {}
    for cid in ids:
        ok, out = judge(cid); print(cid, 'PASS' if ok else 'CHECK', [(x.get('step'), x.get('header'), x.get('want'), x.get('got')) for x in out])
        res[cid] = (ok, out)
    json.dump({k: {'ok': v[0], 'steps': [{kk: vv for kk, vv in s.items() if kk != 'boxes'} for s in v[1]]} for k, v in res.items()}, open(PP + 's2x-judged-%s.json' % tag, 'w'), indent=1)

NAMES = {'C715292': 'vendor', 'C715293': 'vendor', 'C715303': 'document', 'C715304': 'document', 'C715308': 'document', 'C715591': 'document', 'C715289': 'customer', 'C715290': 'customer', 'C715295': 'document', 'C715296': 'document', 'C715300': 'document', 'C715588': 'document'}
SETUP = {
 'C715292': 'A/P Aging Summary, as of 11/11/2026, Vendor filter = the three new vendors ZZY Sort Vend A/B/C R1 (Current $100/$300/$200, 1-30 $200/$100/$300, 31-60 $300/$200/$100).',
 'C715293': 'A/P Aging Summary, as of 11/11/2026, Vendor filter = ZZY Sort Vend A/B/C R1 (61-90 $250/$350/$150, 91 And Over $350/$150/$250, Total $1,200/$1,100/$1,000).',
 'C715303': 'A/P Aging Detail, as of 11/11/2026, Vendor filter = ZZY Doc Vend A/B/C R1, "1-30 days past due" open: bill A $300 (open $50, dated 40 days ago, due 10 days ago), B $100 (dated and due 20 days ago), C $200 (open $150, dated 35 days ago, due 5 days ago).',
 'C715304': 'A/P Aging Detail, as of 11/11/2026, Vendor filter = ZZY Doc Vend A/B/C R1, "1-30 days past due" open: bill A $300 (open $50, 10 days past due), B $100 (20 days), C $200 (open $150, 5 days).',
 'C715308': 'A/P Unpaid Invoices Report, as of 11/11/2026, Vendor filter = ZZY Doc Group R2, its group open: bill A $300 (open $50, 10 days past due), B $100 (20 days), C $200 (open $150, 5 days).',
 'C715591': 'A/P Unpaid Invoices Report, as of 11/11/2026, Vendor filter = ZZY Doc Group R2, its group open: bill A due 10 days ago, B due 20 days ago, C due 5 days ago.',
 'C715289': 'A/R Aging Summary, as of 11/11/2026, Customer filter = the three new customers ZZX Sort Cust A/B/C R4 (Current $100/$300/$200, 1-30 $200/$100/$300, 31-60 $300/$200/$100).',
 'C715290': 'A/R Aging Summary, as of 11/11/2026, Customer filter = ZZX Sort Cust A/B/C R4 (61-90 $250/$350/$150, 91 And Over $350/$150/$250, Total $1,200/$1,100/$1,000).',
 'C715295': 'A/R Aging Detail, as of 11/11/2026, Customer filter = ZZX Doc Cust A/B/C R3, "1-30 days past due" open: document A $300 (open $50, dated 40 days ago, due 10 days ago), B $100 (dated and due 20 days ago), C $200 (open $150, dated 35 days ago, due 5 days ago).',
 'C715296': 'A/R Aging Detail, as of 11/11/2026, Customer filter = ZZX Doc Cust A/B/C R3, "1-30 days past due" open: document A $300 (open $50), B $100 (open $100), C $200 (open $150).',
 'C715300': 'A/R Aging Collection, as of 11/11/2026, Customer filter = ZZX Doc Group R3, its group open: document A $300 (open $50, 10 days past due), B $100 (open $100, 20 days), C $200 (open $150, 5 days).',
 'C715588': 'A/R Aging Collection, as of 11/11/2026, Customer filter = ZZX Doc Group R3, its group open: document A due 10 days ago, B due 20 days ago, C due 5 days ago.',
}
def picture_and_result(cid, out):
    pics = []; seen = set()
    for x in out:
        if 'step' not in x: continue
        k = (x['header'], len([y for y in seen if y[0] == x['header']]))
        if x['header'] in [s[0] for s in seen] and x['step'] % 2 == 1 and len(pics) >= 6: continue
        seen.add((x['header'], x['step']))
        if len([s for s in seen if s[0] == x['header']]) > 2: continue
        hdr = (r'^(keyboard_arrow_\w+ )?' + re.escape(x['header']) + r' arrow', 'good', '"%s" clicked: arrow shows the sort' % x['header'])
        rows = [b for b in x['boxes'] if b[3] > 600 and b[4] == 48 and not b[0].startswith('Totals') and not re.match(r'^(keyboard|Total for)', b[0])]
        extra = []
        if rows:
            y0 = min(b[2] for b in rows); y1 = max(b[2] + b[4] for b in rows)
            extra = [(278, y0, 1132, y1 - y0, 'good' if x['ok'] else 'bad', 'Order: ' + ', '.join(NAMES[cid] + ' ' + c for c in x['got']))]
        f = ann(x['shot'], PP + 'pics/%s-%d-%s.png' % (cid, x['step'], re.sub(r'\W+', '', x['header'])), 'Step %d: %s, click %s' % (x['step'], x['header'], 'again' if (x['header'], x['step'] - 1) in seen else 'once'), x['boxes'], [hdr], extra)
        pics.append(PP + f if not f.startswith('/') else f)
    obs = [SETUP[cid]] + ['Step %d: %s - %s' % (x['step'], x['header'], ', '.join(NAMES[cid] + ' ' + c for c in x['got'])) for x in out if 'step' in x]
    return pics, obs
if __name__ == '__main__' and len(sys.argv) > 2:
    R = {}
    for cid in sys.argv[2:]:
        ok, out = judge(cid)
        if not ok: continue
        pics, obs = picture_and_result(cid, out)
        R[cid] = {'verdict': 'Passed', 'observed': obs[:1] + ['Every step gives exactly the order the test expects:'] + obs[1:], 'pictures': pics}
    if R: json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, exact-amount sort tests (s2x)'}, 'results': R}, open(PP + 'RESULTS-s2x-%s.json' % sys.argv[1], 'w'), indent=1); print('wrote', list(R))
