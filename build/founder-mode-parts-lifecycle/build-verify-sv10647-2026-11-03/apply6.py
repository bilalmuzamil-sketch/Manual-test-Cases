# "Click Add Part under line 1." -> "..., then click More options." where the expected result says the New Part Request window opens
# (on sv10647 + Add Part opens a row in the line; More options opens the New Part Request window: probes 07/08/09). Guard: ours, last edited by us.
import sys, os, re, json, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__))
FIX = [425737, 425724, 154784, 425738, 540882]; CHECK = [425623, 425624, 573672, 573673, 573674, 839488, 839489, 839490, 839501]
write = '--write' in sys.argv; log = open(f'{D}/write-log.txt', 'a') if write else None
for i in CHECK:
    s = L.call(f'get_case/{i}')['custom_steps']; print('check', i, s.count('More options'))
for i in FIX:
    cur = L.call(f'get_case/{i}'); assert cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and cur['updated_by'] == 3, i
    assert 'New Part Request window opens' in cur['custom_expected'], i
    s0 = cur['custom_steps']; a = '<li>Click Add Part under line 1.</li>'; assert s0.count(a) == 1, (i, s0.count(a))
    s = s0.replace(a, '<li>Click Add Part under line 1, then click More options.</li>')
    if not write: print('fix', i); continue
    r = L.call(f'update_case/{i}', {'custom_steps': s}); time.sleep(0.6); ok = r['custom_steps'] == s
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{i} (Add Part then More options) fields=['custom_steps'] verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n'); log.flush()
