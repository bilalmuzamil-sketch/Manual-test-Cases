# Pass 2 writer: guarded update_case (owner us, not Automated, text unchanged since the plan was made), read back; then the folder move.
import sys, os, json, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D); import plan as P
logp = f'{D}/write-log.txt'; log = open(logp, 'a')
done = {l.split(' update_case C')[1].split(' ')[0] for l in open(logp) if 'verify=OK' in l and 'update_case' in l} if os.path.exists(logp) else set()
snapf = f'{D}/before-pass2.json'
if not os.path.exists(snapf): json.dump({k: L.call(f'get_case/{k}') for k in P.PLAN}, open(snapf, 'w'), indent=1)
snap = json.load(open(snapf))
F = ('custom_preconds', 'custom_steps', 'custom_expected')
if '--write' in sys.argv:
    for k, data in P.PLAN.items():
        if k in done: continue
        cur = L.call(f'get_case/{k}')
        if not (cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and all(cur[f] == P.LIVE[k][f] for f in F)): print('SKIP guard', k, cur['updated_by'], cur['updated_on']); continue
        r = L.call(f'update_case/{k}', data); ok = all(r[f] == v for f, v in data.items())
        line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{k} (Setup section{'; partly line' if 'custom_expected' in data else ''}) fields={sorted(data)} verify={'OK' if ok else 'MISMATCH'}"
        print(line); log.write(line + '\n'); log.flush(); time.sleep(0.35)
if '--move' in sys.argv:
    ids = sorted(int(k) for k in P.PLAN)
    secs = json.load(open(f'{D}/sections.json')); ex = [s for s in secs if s['parent_id'] == 90418 and s['name'] == 'Setup needed before testing']
    sec = ex[0] if ex else L.call('add_section/1', {'suite_id': 1, 'parent_id': 90418, 'name': 'Setup needed before testing',
          'description': 'Tests whose starting records must be made first. Each test lists them under "Setup" after its Preconditions, in the QA site\'s own labels.'})
    json.dump({'section': sec['id'], 'from': {str(i): snap[str(i)]['section_id'] for i in ids}}, open(f'{D}/move-origin.json', 'w'), indent=1)
    L.call(f"move_cases_to_section/{sec['id']}", {'suite_id': 1, 'case_ids': ids})
    back = {i: L.call(f'get_case/{i}')['section_id'] for i in ids}
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} add_section S{sec['id']} under S90418; move_cases_to_section {len(ids)} tests; read back {sum(1 for v in back.values() if v == sec['id'])}/{len(ids)} in S{sec['id']}"
    print(line); log.write(line + '\n')
