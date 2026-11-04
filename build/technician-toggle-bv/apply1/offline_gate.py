import sys, json, importlib.util, collections
sys.path.insert(0, '/home/user/Manual-test-Cases/build/technician-toggle-bv/apply1')
def load(n, p):
    s = importlib.util.spec_from_file_location(n, p); m = importlib.util.module_from_spec(s); s.loader.exec_module(m); return m
R = load('rcc', '/home/user/Manual-test-Cases/build/testing-tools/check_runnable_cases.py')
TR = load('ctr', '/home/user/Manual-test-Cases/build/testing-tools/check_tester_runnable.py')
import rewrite as W
bad = collections.Counter(); fails = {}; tfail = {}
for k, c in W.BEFORE.items():
    if c['section_id'] == 113022: continue
    p2, s2, e2, *_ = W.rewrite(c); c2 = dict(c, custom_preconds=p2, custom_steps=s2, custom_expected=e2)
    a = R.audit(c2)
    if a: fails[k] = a; [bad.update([str(x)[:110]]) for x in a]
    t = TR.scan_case(c2)
    if any(t): tfail[k] = t
print('runnable fails', len(fails), '/ 220'); [print(v, k) for k, v in bad.most_common(25)]
print('tester-runnable fails', len(tfail)); [print(k, v) for k, v in list(tfail.items())[:5]]
json.dump(fails, open('/tmp/claude-0/-home-user-Manual-test-Cases/169cf2b3-7c06-5d1d-9efd-a5870bb2aa07/scratchpad/fails.json', 'w'), indent=1)
