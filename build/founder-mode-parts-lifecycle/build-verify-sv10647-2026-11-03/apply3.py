# Runnable-steps fixes (check_runnable_cases R1/R3/R4) for the flagged cases: add the build's routes (all seen on sv10647 this pass:
# probes 01-12) to start lines and bare "Open X." steps. No state is added (QA lead's ruling, 3 Nov 2026). Guard: ours, last edited by us.
import sys, os, re, json, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__))
INV = 'the Inventory page (Parts in the top bar, then Inventory in the left menu)'
PRE = [
 (r'Start on the Inventory page, on the Active tab', f'Start on {INV}, on the Active tab'),
 (r'Start in both browsers on the Inventory page, on the Active tab', f'Start in both browsers on {INV}, on the Active tab'),
 (r'Start on the Inventory page\.', f'Start on {INV}.'),
 (r'Start on the Part Library page\.', 'Start on the Part Library page (Parts in the top bar, then Part Library in the left menu).'),
 (r'\(the clock icon at the left of its row\)', '(Parts in the top bar, Inventory in the left menu, then the clock icon at the left of its row)'),
 (r'\(Reports in the top bar, then Inventory Value\)', '(Reports in the top bar, then Inventory Value under PARTS in the left menu)'),
 (r'\(Reports in the top bar, then Parts Velocity\)', '(Reports in the top bar, then Parts Velocity under PARTS in the left menu)'),
]
STP = [
 (r'<li>Open purchase order ([A-Z0-9])\.</li>', r'<li>Open purchase order \1 from the Purchase Orders list (Parts in the top bar, then Purchase Orders in the left menu).</li>'),
 (r'<li>Open work order ([A-Z0-9])\.</li>', r'<li>Open work order \1 from the Work Orders list (Work Orders in the top bar).</li>'),
 (r'<li>Open return ([A-Z0-9])\.</li>', r'<li>Open return \1 from the Returns list (Parts in the top bar, then Returns in the left menu).</li>'),
 (r'<li>Open part sale ([A-Z0-9])\.</li>', r'<li>Open part sale \1 from the Part Sales list (Parts in the top bar, then Part Sales in the left menu).</li>'),
 (r'<li>Open the downloaded file\.</li>', "<li>Open the downloaded file from your browser&#39;s downloads list.</li>"),
 (r'<li>Confirm the deletion\.</li>', '<li>Click the confirm button in the deletion window.</li>'),
 (r'<li>Open the bookmark\.</li>', "<li>Open the bookmark from your browser&#39;s bookmarks list.</li>"),
]
write = '--write' in sys.argv
ids = [int(i) for i in json.load(open(f'{D}/runnable-flags.json'))]
log = open(f'{D}/write-log.txt', 'a') if write else None
os.makedirs(f'{D}/preview3', exist_ok=True)
for i in ids:
    assert i not in (425662, 425725, 425726)
    cur = L.call(f'get_case/{i}'); time.sleep(0.2)
    assert cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and cur['updated_by'] == 3, (i, 'guard')
    p = cur['custom_preconds']; s = cur['custom_steps']
    for a, b in PRE: p = re.sub(a, b, p)
    for a, b in STP: s = re.sub(a, b, s)
    d = {f: v for f, v in {'custom_preconds': p, 'custom_steps': s}.items() if v != cur[f]}
    if not write: json.dump({'id': i, **d}, open(f'{D}/preview3/C{i}.json', 'w'), indent=1); print(i, sorted(d)); continue
    if not d: continue
    r = L.call(f'update_case/{i}', d); time.sleep(0.6)
    ok = all(r[f] == v for f, v in d.items())
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{i} (routes for runnable check) fields={sorted(d)} verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n'); log.flush()
