import sys, json, importlib.util, collections, os
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
def load(n, p):
    s = importlib.util.spec_from_file_location(n, p); m = importlib.util.module_from_spec(s); s.loader.exec_module(m); return m
R = load('rcc', '/home/user/Manual-test-Cases/build/testing-tools/check_runnable_cases.py'); TR = load('ctr', '/home/user/Manual-test-Cases/build/testing-tools/check_tester_runnable.py')
import rewrite as W
bad = collections.Counter(); f = []; tf = []
for k, c in W.BEFORE.items():
    p, s, e, _ = W.rewrite(c); c2 = dict(c, custom_preconds=p, custom_steps=s, custom_expected=e)
    a = R.audit(c2)
    if a: f.append(k); [bad.update([str(x)[:120]]) for x in a]
    t = TR.scan_case(c2)
    if any(t): tf.append((k, t))
print('runnable fails', len(f), f); [print(' ', v, x) for x, v in bad.most_common()]
print('tester-runnable fails', len(tf)); [print(' ', x) for x in tf]
