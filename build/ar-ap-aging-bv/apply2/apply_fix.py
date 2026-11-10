# Correction write (10 Nov 2026 evening): the Setup lists lose the quote marks around cross-references, example names and
# names the tester types (they are not screen labels). Guard: the live preconditions are the pass-2 base + a Setup block
# written by this pass, and steps/expected are as pass 2 left them. Read back.
import sys, os, json, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D); import plan as P
log = open(f'{D}/write-log.txt', 'a'); n = 0
for k, data in P.PLAN.items():
    cur = L.call(f'get_case/{k}'); base = P.LIVE[k]
    exp_now = data.get('custom_expected', base['custom_expected'])
    if not (cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and cur['custom_preconds'].startswith(base['custom_preconds'] + '<p><strong>Setup</strong>')
            and cur['custom_steps'] == base['custom_steps'] and cur['custom_expected'] == exp_now): print('SKIP guard', k); continue
    if cur['custom_preconds'] == data['custom_preconds']: continue
    r = L.call(f'update_case/{k}', {'custom_preconds': data['custom_preconds']}); ok = r['custom_preconds'] == data['custom_preconds']; n += 1
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{k} (Setup wording: no quote marks on non-labels) fields=['custom_preconds'] verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n'); log.flush(); time.sleep(0.35)
print('rewritten', n)
