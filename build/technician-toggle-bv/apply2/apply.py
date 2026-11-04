import sys, os, json, time, re, html
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D); import setup as S
ROOT = os.path.dirname(D); before = json.load(open(f'{ROOT}/before/all-235.json'))
log = open(f'{D}/write-log.txt', 'a'); write = '--write' in sys.argv
ids = [k for k, c in before.items() if c['section_id'] != 113022]
snapf = f'{D}/before-pass2.json'
if not os.path.exists(snapf): json.dump({k: L.call(f'get_case/{k}') for k in ids}, open(snapf, 'w'), indent=1)
snap = json.load(open(snapf))
STAMP = '<p>Last checked against build v26.43.5-9596ea9 (QA site sv11788) on 11/4/2026.</p>'
PRE = 'Partly checked against build v26.43.5-9596ea9 (QA site sv11788) on 11/4/2026; not yet seen on that build: '
plan = {}; moves = []
for k in ids:
    c = snap[k]; p, s, e = c['custom_preconds'], c['custom_steps'], c['custom_expected']
    s2 = s.replace("Click Lead technician in the work order's card", "Click Lead Technician in the work order's card"); p2 = p.replace("Click Lead technician in the work order's card", "Click Lead Technician in the work order's card")
    s2 = s2.replace('In the second browser, click Work Orders in the top bar.</li>', 'In the second browser, click Work Orders in the menu of the top bar.</li>')
    e2 = e
    if c['section_id'] != 113023:
        items, unseen, _ = S.setup_for(before[k])
        if [t for t in items if not t[0].startswith('Make staff')] or unseen:
            assert 'Setup</strong>' not in p2 and p2.endswith('</ul>'), k
            p2 = p2 + S.to_html(items); moves.append(int(k))
            if unseen:
                add = '; '.join(unseen)
                if STAMP in e2: e2 = e2.replace(STAMP, f'<p>{PRE}{html.escape(add, quote=False)}.</p>')
                else:
                    m = re.search(r'<p>' + re.escape(PRE) + r'([^<]*)\.</p>', e2); assert m, k
                    e2 = e2.replace(m.group(0), f'<p>{PRE}{m.group(1)}; {html.escape(add, quote=False)}.</p>')
    data = {f: v for f, v, o in (('custom_preconds', p2, p), ('custom_steps', s2, s), ('custom_expected', e2, e)) if v != o}
    if data: plan[k] = data
print('tests to update', len(plan), '| to move', len(moves))
if not write: sys.exit()
done = {l.split(' update_case C')[1].split(' ')[0] for l in open(f'{D}/write-log.txt') if 'verify=OK' in l and 'update_case' in l} if os.path.exists(f'{D}/write-log.txt') else set()
for k, data in plan.items():
    if k in done: continue
    cur = L.call(f'get_case/{k}')
    if not (cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and cur['updated_on'] == snap[k]['updated_on']): print('SKIP guard', k); continue
    r = L.call(f'update_case/{k}', data); ok = all(r[f] == v for f, v in data.items())
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{k} ({'Setup section' if 'Setup</strong>' in data.get('custom_preconds', '') else 'Lead Technician wording'}{'; partly line' if 'custom_expected' in data else ''}) fields={sorted(data)} verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n'); log.flush(); time.sleep(0.4)
json.dump({'moves': moves, 'from': {str(m): snap[str(m)]['section_id'] for m in moves}}, open(f'{D}/move-origin.json', 'w'), indent=1)
