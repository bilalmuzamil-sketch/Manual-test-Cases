# After probes 14-16 (fresh sign-in, 3 Nov 2026): Part History page, purchase order page, Receive screen, New Line + canned lines,
# invoice menu + Issue Credit, Credits tab + Create Credit all seen on sv10647. Restore the full build line where every screen the case
# uses is now seen; keep "partly checked" for the delete confirmation (no deletable Part Library entry exists; making one is a state) and
# for "the button that adds a line to the purchase order" (not shown on the purchase order page). Receive step reworded to the button
# seen: "Receive Parts (1)". Guard: ours, last edited by us.
import sys, os, re, json, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__))
U = json.load(open(f'{D}/unseen-screens.json')); ids = sorted(set(i for v in U.values() for i in v))
FULL = '<p>Last checked against build v26.43.4-999c51d (QA site sv10647) on 11/3/2026.</p>'
RECV = ('<li>Click Receive on the Receive screen.</li>', '<li>Click the Receive Parts button at the bottom of the Receive screen (it shows how many parts are ticked, for example Receive Parts (1)).</li>')
RECV2 = ('click Receive on the Receive screen.</li>', 'click the Receive Parts button at the bottom of the Receive screen.</li>')
write = '--write' in sys.argv; log = open(f'{D}/write-log.txt', 'a') if write else None
for i in ids:
    cur = L.call(f'get_case/{i}'); assert cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and cur['updated_by'] == 3, i
    s = cur['custom_steps'].replace(*RECV).replace(*RECV2); e = cur['custom_expected']
    m = re.findall(r'<p>Partly checked against build v26\.43\.4-999c51d \(QA site sv10647\) on 11/3/2026; not yet seen on that build: [^<]*</p>', e); assert len(m) == 1, i
    keep = []
    if i in U['the delete confirmation window']: keep.append('the delete confirmation window')
    if 'adds a line to the purchase order' in s: keep.append('the button that adds a line to a purchase order')
    newline = FULL if not keep else f"<p>Partly checked against build v26.43.4-999c51d (QA site sv10647) on 11/3/2026; not yet seen on that build: {' and '.join(keep)}.</p>"
    e = e.replace(m[0], newline)
    d = {f: v for f, v in {'custom_steps': s, 'custom_expected': e}.items() if v != cur[f]}
    if not write: print(i, 'FULL' if not keep else 'PARTLY ' + '; '.join(keep), sorted(d)); continue
    r = L.call(f'update_case/{i}', d); time.sleep(0.6); ok = all(r[f] == v for f, v in d.items())
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{i} (build line after probes 14-16: {'full' if not keep else 'partly'}) fields={sorted(d)} verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n'); log.flush()
