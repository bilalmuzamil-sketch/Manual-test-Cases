#!/usr/bin/env python3
"""Judging packs for the PRODUCTION run of run 498 (22 Oct 2026). For each test: the LIVE case text (preconditions, steps, Expected),
the newest Passed result in run 498 (the staging judgement and its bullets), the production readings for that test from the script's
JSON, the production-vs-staging differences (prod_compare.py, positions masked) and the production pictures.
Writes evidence/prod-2026-10-22/judge/<C-id>.md. A pack decides nothing; the verdict is written by whoever judges it.
Usage: python3 judge_pack.py <script>.json C1 C2 ...   (script JSON in evidence/prod-2026-10-22/)"""
import sys, os, re, json, html, glob, subprocess
H = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(H, '..', '..', 'testing-tools'))
import tr_client as tr
EV = os.path.join(H, 'evidence', 'prod-2026-10-22'); OUT = os.path.join(EV, 'judge'); os.makedirs(OUT, exist_ok=True)
b = lambda r: r[1] if isinstance(r, tuple) else r
def strip(h):
    h = re.sub(r'<(br|/p|/li|/h\d|hr ?/?)>', '\n', h or ''); h = re.sub(r'<li>', '- ', h); h = re.sub(r'<[^>]+>', '', h)
    return re.sub(r'\n\s*\n+', '\n', html.unescape(h)).strip()
name = sys.argv[1]; ids = sys.argv[2:]
prod = json.load(open(os.path.join(EV, name)))
tests, off = [], 0
while True:
    t = b(tr.get(f'get_tests/498&limit=250&offset={off}')); t = t['tests'] if isinstance(t, dict) else t; tests += t
    if len(t) < 250: break
    off += 250
tid = {f"C{x['case_id']}": x['id'] for x in tests}
for c in ids:
    if c not in tid: print(c, 'not in run 498 - skipped'); continue
    cs = b(tr.get(f'get_case/{c[1:]}'))
    rs = b(tr.get(f'get_results/{tid[c]}&limit=10')); rs = rs['results'] if isinstance(rs, dict) else rs
    last_pass = next((r for r in rs if r['status_id'] == 1 and (r.get('comment') or '').strip()), None)
    diff = subprocess.run(['python3', os.path.join(H, 'prod_compare.py'), name, c], capture_output=True, text=True).stdout
    pics = sorted(os.path.basename(p) for p in glob.glob(os.path.join(EV, f'{c}*.png')))
    md = [f'# {c} — {cs["title"]}', f'Test in run 498: https://shopview.testrail.io/index.php?/tests/view/{tid[c]}', '',
          '## Preconditions', strip(cs.get('custom_preconds'))[:3000], '', '## Steps', strip(cs.get('custom_steps'))[:4000], '',
          '## Expected (source quote — judge against this, never change it)', strip(cs.get('custom_expected'))[:6000], '',
          '## Newest PASSED result in run 498 (staging judgement)', strip(last_pass['comment'])[:3000] if last_pass else '(none)', '',
          '## Production readings (raw, this test)', '```json', json.dumps(prod.get(c), indent=1)[:14000], '```', '',
          '## Production vs staging differences (positions masked)', '```', diff[:8000], '```', '',
          '## Production pictures (evidence/prod-2026-10-22/)', *[f'- {p}' for p in pics]]
    open(os.path.join(OUT, f'{c}.md'), 'w').write('\n'.join(md)); print(c, 'pack written', len('\n'.join(md)), 'chars,', len(pics), 'pictures')
