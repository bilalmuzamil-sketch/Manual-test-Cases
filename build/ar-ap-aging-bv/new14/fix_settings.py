# 14 Nov: name the Work Orders settings the Setup is written for, and make the finishing step settings-aware. Guard: the test
# still reads what apply14.py wrote (before.json + plan-v1.json). Then move the 5 tests that need nothing made to "Design — how it looks".
import sys, os, json, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__)); B = json.load(open(f'{D}/before.json')); V1 = json.load(open(f'{D}/plan-v1.json')); P = json.load(open(f'{D}/plan.json'))
log = open(f'{D}/write-log.txt', 'a'); F = ('custom_preconds', 'custom_steps', 'custom_expected'); ts = lambda: time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
for k in P:
    want_old = {f: V1[k].get(f, B[k][f]) for f in F}; new = {f: P[k].get(f, B[k][f]) for f in F}
    data = {f: new[f] for f in F if new[f] != want_old[f]}
    if not data: continue
    cur = L.call(f'get_case/{k}')
    if not (cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and all(cur[f] == want_old[f] for f in F)): print('SKIP guard', k); continue
    r = L.call(f'update_case/{k}', data); ok = all(r[f] == v for f, v in data.items())
    line = f"{ts()} update_case C{k} (Work order settings item + settings-aware finishing step) fields={sorted(data)} verify={'OK' if ok else 'MISMATCH'}"; print(line); log.write(line + '\n'); time.sleep(0.35)
if '--move' in sys.argv:
    ids = [1145255, 1145256, 1145257, 1145258, 1145259]
    L.call('move_cases_to_section/90430', {'suite_id': 1, 'case_ids': ids})
    back = {i: L.call(f'get_case/{i}')['section_id'] for i in ids}
    line = f"{ts()} move_cases_to_section S90430 'Design — how it looks' {ids} (need nothing made); read back {sum(v == 90430 for v in back.values())}/5"; print(line); log.write(line + '\n')
