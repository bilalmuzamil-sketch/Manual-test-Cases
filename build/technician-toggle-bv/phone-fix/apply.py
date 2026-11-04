# QA lead, 4 Nov 2026: "1. (a)" -> in C897217-C897219 the phone number (no such field in Edit Staff Member on this build) becomes Job Title
# (seen on the build: Edit Staff Member field "Job Title"). The quoted PRD text is not touched (it does not mention a phone).
import sys, re, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
log = open('phone-fix/write-log.txt', 'a')
REP = [('Choose a new phone number for staff member A.', 'Choose a new job title for staff member A.'),
       ('Replace the phone number with the new phone number.', 'In Job Title, replace the job title with the new job title.'),
       ('The phone field shows the new phone number.', 'Job Title shows the new job title.'),
       ('The window closes and the new phone number is saved.', 'The window closes and the new job title is saved.')]
REASON = 'a phone number field in Edit Staff Member (the window shows none)'
STAMP = '<p>Last checked against build v26.43.5-9596ea9 (QA site sv11788) on 11/4/2026.</p>'
for k in (897217, 897218, 897219):
    c = L.call(f'get_case/{k}'); assert c['created_by'] == 3 and c['updated_by'] == 3 and c['custom_atmstatus'] != 3
    data = {}
    for f in ('custom_preconds', 'custom_steps', 'custom_expected'):
        v = c[f]; q = v.find('Exact quotes from the source'); head, tail = (v[:q], v[q:]) if q != -1 else (v, '')
        for o, n in REP: head = head.replace(o, n)
        m = re.search(r'<p>Partly checked against build v26\.43\.5-9596ea9 \(QA site sv11788\) on 11/4/2026; not yet seen on that build: ([^<]*)\.</p>', tail)
        if m:
            rest = [x for x in m.group(1).split('; ') if x != REASON]
            tail = tail.replace(m.group(0), STAMP if not rest else m.group(0).replace(m.group(1), '; '.join(rest)))
        nv = head + tail
        if nv != v: data[f] = nv
    assert 'phone' not in (data.get('custom_preconds', '') + data.get('custom_steps', '') + data.get('custom_expected', '')).lower(), k
    r = L.call(f'update_case/{k}', data); ok = all(r[f] == v for f, v in data.items())
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{k} (phone number -> Job Title; build line {'full' if STAMP in data.get('custom_expected', '') else 'partly'}) fields={sorted(data)} verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n')
