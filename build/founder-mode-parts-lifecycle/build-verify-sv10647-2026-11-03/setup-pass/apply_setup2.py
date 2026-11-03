# Rule 119 layout for the 72 setup-needed tests: Preconditions = only what must be true (the "How to do it" text added earlier today is
# taken out again, and the result must equal the preconditions as they were before that pass: live-before.json); a separate
# "Setup" section follows, a numbered list in the order the tester works (vendors and locations first), one item per thing to make.
# Guards: ours, not Automated, last edited by us; read back.
import sys, os, re, json, time, html
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D); import clicks2 as K
E = lambda s: html.escape(s, quote=False).replace("'", '&#39;')
BEFORE = json.load(open(f'{D}/live-before.json'))
HOW = re.compile(r'<ul><li>How to do it: .*?</li></ul>(?=</li>)')
FIRST = ('Make vendor', 'Make location', 'Make a new location')
write = '--write' in sys.argv; log = open(f'{D}/../write-log.txt', 'a') if write else None
os.makedirs(f'{D}/preview2', exist_ok=True); n = 0
for c, plan in sorted(K.C.items()):
    cur = L.call(f'get_case/{c}'); time.sleep(0.15)
    assert cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and cur['updated_by'] == 3, (c, 'guard')
    p = HOW.sub('', cur['custom_preconds'])
    assert p == BEFORE[str(c)]['custom_preconds'], (c, 'preconditions differ from before the clicks pass')
    lis = [html.unescape(x) for x in re.findall(r'<li>(.*?)</li>', p)]
    order = sorted(plan, key=lambda k: min([i for i, x in enumerate(lis) if x.startswith(k)] or [999]))
    its = [it for k in order for it in K.items(plan[k])]
    its = [it for it in its if it[0] and it[0].startswith(FIRST)] + [it for it in its if not (it[0] and it[0].startswith(FIRST))]
    seen = set(); its = [it for it in its if not (it in seen or seen.add(it))]
    setup = '<p><strong>Setup</strong></p><ol>' + ''.join(f'<li>{E(lab + ": " + t) if lab else E(t)}</li>' for lab, t in its) + '</ol>'
    p = p + setup
    if not write: json.dump({'id': c, 'custom_preconds': p}, open(f'{D}/preview2/C{c}.json', 'w'), indent=1); n += 1; continue
    r = L.call(f'update_case/{c}', {'custom_preconds': p}); time.sleep(0.6); ok = r['custom_preconds'] == p
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{c} (Rule 119: Preconditions and a separate Setup, {len(its)} items) fields=['custom_preconds'] verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n'); log.flush(); n += ok
print('done', n, 'of', len(K.C))
