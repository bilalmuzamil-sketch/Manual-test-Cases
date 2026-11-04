import sys, os, json, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D); import rewrite as W
log = open(f'{D}/write-log.txt', 'a'); done = set()
if os.path.exists(f'{D}/write-log.txt'):
    for l in open(f'{D}/write-log.txt'):
        if 'verify=OK' in l: done.add(l.split(' update_case C')[1].split(' ')[0])
ids = [k for k, c in W.BEFORE.items() if c['section_id'] != 113022 and k not in done]
print('to write', len(ids), 'already', len(done))
for k in ids:
    c = W.BEFORE[k]; cur = L.call(f'get_case/{k}')
    if not (cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and cur['updated_on'] == c['updated_on']): print('SKIP guard', k, cur['updated_by'], cur['updated_on']); continue
    p2, s2, e2, used, miss, hold = W.rewrite(cur)
    data = {'custom_preconds': p2, 'custom_steps': s2, 'custom_expected': e2}
    r = L.call(f'update_case/{k}', data); ok = all(r[f] == v for f, v in data.items())
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{k} (routes in build labels: {len(used)} lines; build line {'partly' if miss else 'full'}; marker {'HOLD kept' if hold else 'READY'}) fields={sorted(data)} verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n'); log.flush(); time.sleep(0.4)
