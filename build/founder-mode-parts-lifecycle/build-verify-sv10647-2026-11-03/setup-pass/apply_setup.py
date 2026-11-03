# Writes the per-test setup clicks (clicks.py) under the setup line each one builds, in the 70 tests of "Setup needed before testing"
# (S114049) plus C154833 and C847731; sets the build line (full, or "Partly checked ... not yet seen on that build: <step>").
# QA lead, 3 Nov 2026: "add the clicks/steps for those tests but make sure each click/step should be related to that particular test case only."
# Guards: ours, not Automated, last edited by us; every key matches exactly one setup line; read back.
import sys, os, re, json, time, html
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import clicks as K
D = os.path.dirname(os.path.abspath(__file__))
E = lambda s: html.escape(s, quote=False).replace("'", '&#39;')
FULL = '<p>Last checked against build v26.43.4-999c51d (QA site sv10647) on 11/3/2026.</p>'
LINE = re.compile(r'<p>(?:Last checked|Partly checked) against build v26\.43\.4-999c51d \(QA site sv10647\) on 11/3/2026[^<]*</p>')
write = '--write' in sys.argv; log = open(f'{D}/../write-log.txt', 'a') if write else None
os.makedirs(f'{D}/preview', exist_ok=True); n_ok = 0; matched = {}
for c, plan in sorted(K.C.items()):
    cur = L.call(f'get_case/{c}'); time.sleep(0.15)
    assert cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and cur['updated_by'] == 3, (c, 'guard')
    p = cur['custom_preconds']; assert 'How to do it:' not in p, (c, 'already has clicks')
    lis = re.findall(r'<li>(.*?)</li>', p)
    for key, how in plan.items():
        hits = [x for x in lis if html.unescape(x).startswith(key)]
        if not hits and c in (425624, 573672, 573673, 573674): continue
        assert len(hits) == 1, (c, key, len(hits))
        matched.setdefault(c, []).append(key[:40])
        old = f'<li>{hits[0]}</li>'; assert p.count(old) == 1, (c, key, 'li count')
        p = p.replace(old, f'<li>{hits[0]}<ul><li>How to do it: {E(how)}</li></ul></li>')
    e = cur['custom_expected']; m = LINE.findall(e); assert len(m) == 1, (c, 'build line', len(m))
    new = FULL if c not in K.PARTLY else f'<p>Partly checked against build v26.43.4-999c51d (QA site sv10647) on 11/3/2026; not yet seen on that build: {E(K.PARTLY[c])}.</p>'
    e = e.replace(m[0], new)
    d = {f: v for f, v in {'custom_preconds': p, 'custom_expected': e}.items() if v != cur[f]}
    if not write: json.dump({'id': c, **d}, open(f'{D}/preview/C{c}.json', 'w'), indent=1); n_ok += 1; continue
    r = L.call(f'update_case/{c}', d); time.sleep(0.6); ok = all(r[f] == v for f, v in d.items())
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{c} (per-test setup clicks; build line {'partly' if c in K.PARTLY else 'full'}) fields={sorted(d)} verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n'); log.flush(); n_ok += ok
print('done', n_ok, 'of', len(K.C)); [print(c, matched.get(c)) for c in (425624, 573672, 573673, 573674)]
