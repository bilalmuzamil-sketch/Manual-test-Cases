import sys, json, importlib.util, collections, os
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
def load(n, p):
    s = importlib.util.spec_from_file_location(n, p); m = importlib.util.module_from_spec(s); s.loader.exec_module(m); return m
R = load('rcc', '/home/user/Manual-test-Cases/build/testing-tools/check_runnable_cases.py'); TR = load('ctr', '/home/user/Manual-test-Cases/build/testing-tools/check_tester_runnable.py')
import plan as P
bad = collections.Counter(); f = []; tf = []
for k, c in P.LIVE.items():
    c2 = dict(c, **P.PLAN.get(k, {}))
    a = R.audit(c2)
    if a: f.append(k); [bad.update([str(x)[:140]]) for x in a]
    t = TR.scan_case(c2)
    if any(t): tf.append((k, t))
print('runnable fails', len(f), f[:20]); [print(' ', v, x) for x, v in bad.most_common(15)]
print('tester-runnable fails', len(tf)); [print(' ', x) for x in tf[:15]]
