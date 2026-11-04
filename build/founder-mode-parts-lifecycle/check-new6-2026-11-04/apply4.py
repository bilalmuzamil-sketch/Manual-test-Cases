# The four new v36 tests (C913767-C913770, written 4 Nov 2026 by the test-writing session) build-verified on v26.45.0-2c807b5
# (probes 32-37 in ../check-9-2026-11-04 and here): every step's label seen on this build. "dimmed (disabled)" -> "disabled" (PRD word;
# the disabled red is only slightly paler on screen). Build line + marker READY. C913771/C913772 untouched (SV-12010 is in Board Backlog).
import sys, os, json, time, re
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__)); B = json.load(open(f'{D}/before.json'))
NOTYET = '<p>The build is not yet available to check this case against.</p>'
STAMP = '<p>Last checked against build v26.45.0-2c807b5 (QA site sv10647) on 11/4/2026.</p>'
write = '--write' in sys.argv; log = open(f'{D}/write-log.txt', 'a') if write else None
for c in (913767, 913768, 913769, 913770):
    cur = L.call(f'get_case/{c}'); assert cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and cur['updated_on'] == B[str(c)]['updated_on'], (c, 'guard')
    e = cur['custom_expected']; n = e.count('dimmed (disabled)'); e = e.replace('dimmed (disabled)', 'disabled')
    assert e.count(NOTYET) == 1, (c, 'no not-yet line'); e = e.replace(NOTYET, STAMP)
    mk = re.findall(r'<p>AUTOMATION:[^<]*</p>', e); assert mk == ['<p>AUTOMATION: HOLD - not yet build-verified (no build yet)</p>'], (c, mk)
    e = e.replace(mk[0], '<p>AUTOMATION: READY</p>')
    if not write: print(c, 'dimmed x', n, 'ok'); continue
    r = L.call(f'update_case/{c}', {'custom_expected': e}); time.sleep(0.6); ok = r['custom_expected'] == e
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{c} (build-verified v26.45.0-2c807b5; dimmed->disabled x{n}; READY) fields=['custom_expected'] verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n')
