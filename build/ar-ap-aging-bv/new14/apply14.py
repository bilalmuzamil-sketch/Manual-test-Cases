import sys, os, json, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__)); B = json.load(open(f'{D}/before.json')); P = json.load(open(f'{D}/plan.json'))
log = open(f'{D}/write-log.txt', 'a'); F = ('custom_preconds', 'custom_steps', 'custom_expected')
for k, data in P.items():
    cur = L.call(f'get_case/{k}')
    if not (cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and all(cur[f] == B[k][f] for f in F)): print('SKIP guard', k, cur['updated_on']); continue
    r = L.call(f'update_case/{k}', data); ok = all(r[f] == v for f, v in data.items())
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{k} (staging stamp{', Setup' if 'custom_preconds' in data else ''}{', PDF step anchor' if 'custom_steps' in data else ''}) fields={sorted(data)} verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n'); log.flush(); time.sleep(0.35)
