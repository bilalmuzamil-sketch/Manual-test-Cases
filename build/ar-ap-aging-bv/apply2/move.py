# Finish the folder move into S133629 in batches of 15, reading each test back.
import sys, os, json, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__)); mo = json.load(open(f'{D}/move-origin.json')); SEC = mo['section']; assert SEC == 133629
ids = sorted(int(i) for i in mo['from']); where = {i: L.call(f'get_case/{i}')['section_id'] for i in ids}
todo = [i for i in ids if where[i] != SEC]; print('already moved', len(ids) - len(todo), 'to move', len(todo))
for j in range(0, len(todo), 15):
    b = todo[j:j + 15]
    try: L.call(f'move_cases_to_section/{SEC}', {'suite_id': 1, 'case_ids': b})
    except Exception as e: print('batch error', b[0], str(e)[:120])
    time.sleep(1)
back = {i: L.call(f'get_case/{i}')['section_id'] for i in ids}
line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} move_cases_to_section S{SEC} (batches of 15): read back {sum(1 for v in back.values() if v == SEC)}/{len(ids)} in S{SEC}"
print(line); open(f'{D}/write-log.txt', 'a').write(line + '\n')
