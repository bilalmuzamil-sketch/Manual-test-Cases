# Honesty fix (Rule 12): 52 cases use a screen not opened on sv10647 this pass (sign-in expired before the Part History walk; the
# inside of a purchase order, Issue Credit, vendor credit, canned job and the delete confirmation were not opened). Their build line
# becomes "Partly checked ... not yet seen on that build: <screens>". Marker stays READY (QA lead's ruling). Guard: ours, last edited by us.
import sys, os, re, json, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__))
U = json.load(open(f'{D}/unseen-screens.json'))
STAMP = '<p>Last checked against build v26.43.4-999c51d (QA site sv10647) on 11/3/2026.</p>'
by = {}
for k, ids in U.items():
    for i in ids: by.setdefault(i, []).append(k)
write = '--write' in sys.argv; log = open(f'{D}/write-log.txt', 'a') if write else None
for i, ks in sorted(by.items()):
    cur = L.call(f'get_case/{i}'); assert cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and cur['updated_by'] == 3, i
    e0 = cur['custom_expected']; assert e0.count(STAMP) == 1, (i, e0.count(STAMP))
    new = f"<p>Partly checked against build v26.43.4-999c51d (QA site sv10647) on 11/3/2026; not yet seen on that build: {' and '.join(ks)}.</p>"
    e = e0.replace(STAMP, new)
    if not write: print(i, new[3:160]); continue
    r = L.call(f'update_case/{i}', {'custom_expected': e}); time.sleep(0.6); ok = r['custom_expected'] == e
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{i} (partly-checked build line) fields=['custom_expected'] verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n'); log.flush()
