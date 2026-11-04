# The nine tests the QA lead listed (4 Nov 2026), checked against PRD v36 (Confluence 829227015, edited 3 Nov 2026 by Chris Ward; copy
# CONFLUENCE-829227015-v36-2026-11-04.md), Chris Ward's rulings on SV-12105 / SV-12110 / SV-12115 (3 Nov 2026), and build v26.45.0-2c807b5
# (probes 32-35). QA lead: "if anything in the PRD goes again the answers of Chris ... follow the answer of Chris" (none conflicts).
# Changes: the three changed quotes -> v36 words; PRD version line -> v36 only when every PRD quote in the case is word for word in v36;
# "dimmed" -> "disabled" (the PRD's word; the disabled red is only slightly paler on screen, probe 32/33); C154775: Chris's SV-12105 ruling
# + divergence sentence (Rule 56); build stamp. Guards: ours, not Automated, unchanged since the before.json snapshot; read back.
import sys, os, re, json, time, html
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__)); BEFORE = json.load(open(f'{D}/before.json'))
V36 = open('/tmp/claude-0/v36.md').read(); N = lambda s: re.sub(r'\s+', ' ', html.unescape(s).replace('\\', '')).strip()
V36N = N(V36)
Q = [('Tracked parts sort against each other by quantity.', 'Tracked parts sort against each other by the quantity shown in the Total Qty column. The printed count sheet follows the same order.'),
     ('While an inventory part, an open part request or a part return still uses the entry,', 'While an inventory part, an open part request, a work order line that received it, or a part return (open or credited) still uses the entry,'),
     ('A line that only shares the old number, typed in by hand with no link to this part, keeps its number.&rdquo;', 'A line that only shares the old number, typed in by hand with no link to this part, keeps its number. A part request added by picking this part&#39;s Part Library result is linked to it, and takes the new number.&rdquo;')]
VER = [('version 33 (23 Oct 2026, owner Chris Ward), read 27 Oct 2026', 'version 36 (edited 3 Nov 2026 by Chris Ward), read 4 Nov 2026'),
       ('version 35 (edited 27 Oct 2026 by Chris Ward), read 28 Oct 2026', 'version 36 (edited 3 Nov 2026 by Chris Ward), read 4 Nov 2026')]
DIM = [('dimmed (disabled)', 'disabled'), ('It is dimmed, because', 'It is disabled, because'), ('is still dimmed', 'is still disabled')]
OLDSTAMP = '<p>Last checked against build v26.43.4-999c51d (QA site sv10647) on 11/3/2026.</p>'
NEWSTAMP = '<p>Last checked against build v26.45.0-2c807b5 (QA site sv10647) on 11/4/2026.</p>'
TECH = '&ldquo;Known pre-existing gap, not fixed here: the SQL sorts on p.quantity, while the cell shows the bin-derived available quantity.&rdquo;</li></ul>'
CHRIS = ('<p>From: Jira SV-12105 (https://shopview.atlassian.net/browse/SV-12105), Chris Ward&#39;s ruling of 3 Nov 2026, read 4 Nov 2026</p><ul><li><strong>Chris Ward, '
         '3 Nov 2026:</strong> &ldquo;confirmed: go with the number shown in the column. Total Qty sorts by the available quantity, on screen and on the printed count '
         'sheet. I&#39;ll add that to the PRD so S6-R5 is clear.&rdquo;</li></ul><p>Where the tech plan above says the sort uses a different quantity from the one the '
         'Total Qty cell shows, this case follows the later source: Chris Ward&#39;s ruling on SV-12105 (3 Nov 2026) and PRD version 36, S6-R5.</p>')
write = '--write' in sys.argv; log = open(f'{D}/write-log.txt', 'a') if write else None; report = {}
for i, snap in BEFORE.items():
    c = int(i); cur = L.call(f'get_case/{c}'); time.sleep(0.2)
    assert cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and cur['updated_on'] == snap['updated_on'], (c, 'guard')
    e = cur['custom_expected']; notes = []
    for a, b in Q:
        if a in e: e = e.replace(a, b); notes.append('quote->v36')
    for a, b in DIM:
        if a in e: e = e.replace(a, b); notes.append('dimmed->disabled')
    if c == 154775:
        assert e.count(TECH) == 1; e = e.replace(TECH, TECH + CHRIS); notes.append('Chris SV-12105 + divergence')
    quotes = re.findall(r'<strong>(S\d+-[A-Z]+\d+[a-z]?):</strong>\s*&ldquo;(.*?)&rdquo;', e)
    missing = [k for k, t in quotes if N(t) not in V36N]
    if not missing:
        for a, b in VER:
            if a in e: e = e.replace(a, b); notes.append('PRD version->36')
    assert e.count(OLDSTAMP) == 1, (c, 'stamp'); e = e.replace(OLDSTAMP, NEWSTAMP)
    report[c] = {'title': cur['title'], 'notes': notes, 'prd_quotes': [k for k, _ in quotes], 'not_in_v36': missing}
    if not write: print(c, notes, 'quotes', [k for k, _ in quotes], 'NOT IN v36:', missing); continue
    r = L.call(f'update_case/{c}', {'custom_expected': e}); time.sleep(0.6); ok = r['custom_expected'] == e
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{c} ({'; '.join(notes)}; stamp v26.45.0-2c807b5) fields=['custom_expected'] verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n')
json.dump(report, open(f'{D}/report.json', 'w'), indent=1)
