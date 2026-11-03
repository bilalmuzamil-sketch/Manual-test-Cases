# Filter-step wording (Location: filter on Inventory Value and Supply filter on Inventory both seen on sv10647, probes 06/01):
# "Pick X in the Y filter." -> "Click the Y filter and pick X." Plus the report's Search (seen, probe 04). Guard: ours, last edited by us.
import sys, os, re, json, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__))
IDS = [425756, 839452, 839453] if '--rest' in sys.argv else [425630, 425660, 425661, 425663, 425665, 425666, 425668, 425756, 839452, 839453]
write = '--write' in sys.argv; log = open(f'{D}/write-log.txt', 'a') if write else None
for i in IDS:
    cur = L.call(f'get_case/{i}'); assert cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and cur['updated_by'] == 3, i
    s0 = cur['custom_steps']
    s = re.sub(r'<li>Pick ([^<]+?) in the (Location|Supply) filter\.</li>', r'<li>Click the \2 filter and pick \1.</li>', s0)
    s = re.sub(r"<li>Type part A(&#39;|')s part number in the Search box\.</li>", "<li>Click Search above the report, then type part A&#39;s part number in the Search box.</li>", s, count=1) if i == 425756 else s
    assert s != s0, i
    if not write: print(i, re.findall(r'<li>Click the[^<]*</li>|<li>Click Search[^<]*</li>', s)[:3]); continue
    r = L.call(f'update_case/{i}', {'custom_steps': s}); time.sleep(0.6); ok = r['custom_steps'] == s
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{i} (filter step wording) fields=['custom_steps'] verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n'); log.flush()
