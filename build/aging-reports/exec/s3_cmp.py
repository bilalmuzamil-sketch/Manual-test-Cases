"""s3_cmp.py — 11 Nov 2026: compare the on-screen order with the PDF and CSV order for C715329-C715334 (s3/<id>/out.json)."""
import json, re
def key_screen(rep, cells): return cells[0] if rep in ('ars', 'aps') else cells[3]
REP = {'C715329': 'ars', 'C715330': 'ard', 'C715331': 'arc', 'C715332': 'aps', 'C715333': 'apd', 'C715334': 'apu'}
out = {}
for id, rep in REP.items():
    o = json.load(open(f's3/{id}/out.json')); r = {}
    ok = lambda c: len(c) > 3 and not re.match(r'^\$', key_screen(rep, c)) and not re.search(r'days past due \(|Current \(', ' '.join(c))
    s1 = [key_screen(rep, c) for c in o['screen1'] if ok(c)]; s2 = [key_screen(rep, c) for c in o['screen2'] if ok(c)]
    def csvkeys(d):
        h = d['head']; col = h.index('ID') if 'ID' in h else h.index('No.') if 'No.' in h else 0
        return [x[col] for x in d['rows'] if x and x[0] != 'Totals' and len(x) > col]
    c1 = csvkeys(o['csv1d']); c2 = csvkeys(o['csv2d'])
    pdf = o.get('pdfText', ''); hs = max(pdf.find(' Location '), 0); pos = [(pdf.find(k, hs), k) for k in c1]; pdf_order = [k for p, k in sorted(pos) if p >= 0]
    r['screen1_n'] = len(s1); r['csv1_n'] = len(c1); r['screen_eq_csv1'] = s1 == c1; r['pdf_eq_csv1'] = pdf_order == c1; r['pdf_missing'] = [k for p, k in pos if p < 0]
    r['screen2_eq_csv2'] = s2 == c2; r['csv1_ne_csv2'] = c1 != c2
    if s1 != c1: r['diff1'] = [(i, a, b) for i, (a, b) in enumerate(zip(s1 + [None] * 5, c1 + [None] * 5)) if a != b][:6]
    if s2 != c2: r['diff2'] = [(i, a, b) for i, (a, b) in enumerate(zip(s2 + [None] * 5, c2 + [None] * 5)) if a != b][:6]
    r['loc_col'] = ('Location' in o['csv1d']['head'], ' Location ' in pdf)
    out[id] = r; print(id, json.dumps(r)[:600])
json.dump(out, open('s3/cmp-match.json', 'w'), indent=1)
