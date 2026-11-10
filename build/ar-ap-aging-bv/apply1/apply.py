import sys, os, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D); import rewrite as W
logp = f'{D}/write-log.txt'; done = set()
if os.path.exists(logp): done = {l.split(' update_case C')[1].split(' ')[0] for l in open(logp) if 'verify=OK' in l}
log = open(logp, 'a'); todo = [k for k in W.BEFORE if k not in done]; print('to write', len(todo), 'done', len(done))
for k in todo:
    c = W.BEFORE[k]; cur = L.call(f'get_case/{k}')
    if not (cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and all(cur[f] == c[f] for f in ('custom_preconds', 'custom_steps', 'custom_expected'))): print('SKIP guard', k, cur['updated_by'], cur['updated_on']); continue
    p, s, e, used = W.rewrite(cur)
    data = {f: v for f, v, o in (('custom_preconds', p, cur['custom_preconds']), ('custom_steps', s, cur['custom_steps']), ('custom_expected', e, cur['custom_expected'])) if v != o}
    r = L.call(f'update_case/{k}', data); ok = all(r[f] == v for f, v in data.items())
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{k} ({', '.join(sorted(set(used))) or 'build line'}) fields={sorted(data)} verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n'); log.flush(); time.sleep(0.35)
