# QA lead's ruling, 3 Nov 2026: "the preconditions should simply tell the state needed to test this particular test case, its the
# responsibility of the tester to create that state ... related to that ONE test case"; "Keep the automation as READY"; and asked where
# "How to set this up on the QA site" came from (it was added by this pass's apply.py, not from the sources).
# (a) batch 1 (242): remove that block only.  (b) batch 2 + hard (118): route fixes, import-step fixes, "+ Add Part, then More options"
# for the cases whose expected result says the New Part Request window opens, stamp, marker READY — no setup recipes.
import sys, os, re, json, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
import apply as A
D = A.D
BLOCK = re.compile(r'<p>How to set this up on the QA site \(https://sv10647\.qa\.shopview\.com\):</p><ul>.*?</ul>$', re.S)
MO = [('click + Add Part.</li>', 'click + Add Part, then click More options.</li>'), ('<li>Click Add Part in the Parts row of its line.</li>', '<li>Click Add Part in the Parts row of its line, then click More options.</li>')]
def plan_b(c):
    p = c['custom_preconds']
    for a, b in A.ROUTE: p = p.replace(a, b)
    s = c['custom_steps']
    for a, b in A.STEPS: s = s.replace(a, b)
    if 'New Part Request window' in s:
        n = 0
        for a, b in MO: n += s.count(a); s = s.replace(a, b)
        assert n >= 1, (c['id'], 'no Add Part step')
    e = c['custom_expected']; assert e.count(A.NOTYET) == 1 and e.count(A.OLDMK) == 1, c['id']
    e = e.replace(A.NOTYET, A.STAMP).replace(A.OLDMK, '<p>AUTOMATION: READY</p>')
    return {'custom_preconds': p, 'custom_steps': s, 'custom_expected': e}
write = '--write' in sys.argv
b1 = [int(x) for x in open(f'{D}/batch1.txt').read().split()]
b2 = [int(x) for x in open(f'{D}/batch2.txt').read().split()] + json.load(open(f'{D}/hard-ids.json'))
assert len(b1) == 242 and len(b2) == 118 and not set(b1) & set(b2)
log = open(f'{D}/write-log.txt', 'a') if write else None
os.makedirs(f'{D}/preview2', exist_ok=True)
todo = [('a', i) for i in b1] + [('b', i) for i in b2]
if '--skipdone' in sys.argv:  # SKIPDONE: resume after a timeout
    _d = set(int(x) for x in re.findall(r'update_case C(\d+) \((?:remove|stamp)', open(f'{D}/write-log.txt').read())); todo = [t for t in todo if t[1] not in _d]
if '--only' in sys.argv: todo = [t for t in todo if t[0] == sys.argv[sys.argv.index('--only') + 1]]
for kind, i in todo:
    assert i not in (425662, 425725, 425726)
    snap = json.load(open(f'{D}/before/C{i}.json'))
    cur = L.call(f'get_case/{i}'); time.sleep(0.2)
    assert cur['created_by'] == 3 and cur['custom_atmstatus'] != 3, (i, 'guard')
    if kind == 'a':
        assert cur['updated_by'] == 3, (i, 'edited by someone else')
        p, n = BLOCK.subn('', cur['custom_preconds']); assert n == 1, (i, 'block', n)
        expect = snap['custom_preconds']
        for a, b in A.ROUTE: expect = expect.replace(a, b)
        assert p == expect, (i, 'remaining preconditions differ from snapshot + route fix')
        d = {'custom_preconds': p}
    else:
        assert cur['updated_on'] == snap['updated_on'], (i, 'changed since snapshot')
        d = plan_b(cur)
    d = {f: v for f, v in d.items() if v != cur[f]}
    if not write: json.dump(d, open(f'{D}/preview2/C{i}.json', 'w'), indent=1); continue
    r = L.call(f'update_case/{i}', d); time.sleep(0.6)
    ok = all(r[f] == v for f, v in d.items())
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{i} ({'remove setup list' if kind == 'a' else 'stamp+READY, no recipes'}) fields={sorted(d)} verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n'); log.flush()
