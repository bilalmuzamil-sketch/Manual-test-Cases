# Last runnable-steps fixes: on sv10647 the list's Search box opens only after clicking Search (probe 03b), and the top-bar search box
# shows a magnifier icon and reads "Search customers, work orders, parts..." (probe 03 screenshot). Guard: ours, last edited by us.
import sys, os, re, json, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__))
R2 = [154768, 425642, 425644, 425645, 839423]; R3 = [425656, 425742, 425743, 425744, 847728]
GS = ('<li>Click the Search box in the top bar.</li>', '<li>Click the Search box in the top bar (the box with the magnifier icon that reads Search customers, work orders, parts...).</li>')
write = '--write' in sys.argv; log = open(f'{D}/write-log.txt', 'a') if write else None
for i in R2 + R3:
    cur = L.call(f'get_case/{i}'); assert cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and cur['updated_by'] == 3, i
    s = cur['custom_steps']
    if i in R2:
        m = re.match(r'<ol><li>(Type [^<]*in the Search box\.)</li>', s); assert m, (i, s[:80])
        s = s.replace(f'<li>{m.group(1)}</li>', f'<li>Click Search above the list (the magnifier icon), then {m.group(1)[0].lower()}{m.group(1)[1:]}</li>', 1)
    else:
        assert s.count(GS[0]) >= 1, i; s = s.replace(*GS)
    if not write: print(i, re.findall(r'<li>[^<]*</li>', s)[0][:170]); continue
    r = L.call(f'update_case/{i}', {'custom_steps': s}); time.sleep(0.6); ok = r['custom_steps'] == s
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{i} (search step wording) fields=['custom_steps'] verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n'); log.flush()
