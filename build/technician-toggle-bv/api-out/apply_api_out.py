# QA lead, 4 Nov 2026, Technician Toggle: the 15 Public API tests -> "Move out of the suite (Recommended)": to a not-runnable folder outside
# group 113017, as done for Parts Lifecycle (S114050). Marker becomes a plain HOLD; any earlier hold reason is kept after it.
import sys, os, re, json, time, html
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__)); log = open(f'{D}/write-log.txt', 'a')
before = json.load(open(f'{D}/../before/all-235.json'))
ids = sorted(int(k) for k, c in before.items() if c['section_id'] == 113022); assert len(ids) == 15, len(ids)
write = '--write' in sys.argv; plan = {}
for c in ids:
    cur = L.call(f'get_case/{c}'); assert cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and cur['updated_on'] == before[str(c)]['updated_on'], c
    e = cur['custom_expected']; m = re.findall(r'<p>AUTOMATION: [^<]*</p>', e); assert len(m) == 1, (c, m)
    old = html.unescape(m[0][3:-4])
    keep = old.split('AUTOMATION: HOLD - ', 1)[1] if old.startswith('AUTOMATION: HOLD - ') else None
    new = '<p>AUTOMATION: HOLD - not manually testable (developer/automated check only): it needs requests sent through the Public API, which a tester cannot do by clicking' + (f'; also {html.escape(keep, quote=False)}' if keep else '') + '</p>'
    plan[c] = (m[0], new, e.replace(m[0], new))
    print(c, cur['title'][:70], '|', 'kept: ' + keep[:60] if keep else '')
if write:
    for c, (o, n, e) in plan.items():
        r = L.call(f'update_case/{c}', {'custom_expected': e}); ok = r['custom_expected'] == e; time.sleep(0.5)
        line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{c} (marker HOLD: not manually testable, Public API) fields=['custom_expected'] verify={'OK' if ok else 'MISMATCH'}"; print(line); log.write(line + '\n')
    sec = L.call('add_section/1', {'suite_id': 1, 'parent_id': 20434, 'name': 'Technician Toggle – not runnable by a manual tester',
        'description': 'Moved out of Technician Toggle (group 113017, folder "API - Public API technician value on staff", 113022) on 4 Nov 2026 on the QA lead\'s answer "Move out of the suite": these tests need requests sent through the Public API. Each test\'s marker gives the reason. Record: build/technician-toggle-bv/api-out/ in the Manual-test-Cases repo.'})
    try: L.call(f"move_cases_to_section/{sec['id']}", {'suite_id': 1, 'case_ids': ids})
    except Exception as ex: print('move call:', ex)
    time.sleep(3); back = {c: L.call(f'get_case/{c}')['section_id'] for c in ids}
    json.dump({'from_section': 113022, 'to_section': sec['id'], 'ids': ids}, open(f'{D}/moved-out-origin.json', 'w'), indent=1)
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} add_section S{sec['id']} under S20434; move_cases_to_section {ids}; read back {sum(1 for v in back.values() if v == sec['id'])}/15 in S{sec['id']}"; print(line); log.write(line + '\n')
