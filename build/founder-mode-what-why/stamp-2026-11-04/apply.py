# QA lead, 4 Nov 2026: "1. (a)" -> stamp C154710 and C839513 against today's staging after walking their labels (p01, p02).
import sys, time, json
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
STAMP = '<p>Last checked against build v26.45.0-440aa25 (staging) on 11/4/2026.</p>'
END = '<p></p><p>AUTOMATION: READY</p>'; log = open('write-log.txt', 'a'); before = {}
for k in (154710, 839513):
    c = L.call(f'get_case/{k}'); before[k] = c
    assert c['created_by'] == 3 and c['custom_atmstatus'] != 3 and 'Last checked against build' not in c['custom_expected'] and c['custom_expected'].endswith(END), k
    e = c['custom_expected'][:-len(END)] + STAMP + END
    r = L.call(f'update_case/{k}', {'custom_expected': e}); ok = r['custom_expected'] == e
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{k} (build line added: v26.45.0-440aa25 staging) fields=['custom_expected'] verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n')
json.dump(before, open('before.json', 'w'), indent=1)
