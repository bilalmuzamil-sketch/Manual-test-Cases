import sys, os, json, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__)); B = json.load(open(f'{D}/../new14/live133-2026-11-14.json')); P = json.load(open(f'{D}/plan.json'))
logp = f'{D}/write-log.txt'; done = {l.split(' update_case C')[1].split(' ')[0] for l in open(logp) if 'verify=OK' in l} if os.path.exists(logp) else set(); log = open(logp, 'a'); F = ('custom_preconds', 'custom_steps', 'custom_expected')
for k, data in P.items():
    if k in done or not data: continue
    cur = L.call(f'get_case/{k}')
    if not (cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and all(cur[f] == B[k][f] for f in F)): print('SKIP guard (changed since this morning)', k, time.strftime('%H:%M', time.gmtime(cur['updated_on']))); continue
    r = L.call(f'update_case/{k}', data); ok = all(r[f] == v for f, v in data.items())
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{k} (Setup for staging + restamp) fields={sorted(data)} verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n'); log.flush(); time.sleep(0.35)
