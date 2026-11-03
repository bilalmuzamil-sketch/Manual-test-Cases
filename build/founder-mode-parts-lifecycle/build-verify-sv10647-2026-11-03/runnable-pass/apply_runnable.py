# QA lead, 3 Nov 2026: "Keep what makes the test case executable/runnable by a manual QA tester, also any test which is not
# runnable/executable should not be the part of this testing suite."
# (1) Five "from before this release" tests are runnable: the records exist on sv10647 (census probe 30, confirmed on screen probe 31);
#     their Setup item now names the record to use; three build lines go from partly to full.
# (2) Three tests cannot be run by hand on this site; they move to a new section outside Part Lifecycle, with a plain HOLD reason.
import sys, os, re, json, time, html
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__)); log = open(f'{D}/../write-log.txt', 'a')
E = lambda s: html.escape(s, quote=False).replace("'", '&#39;')
FULL = '<p>Last checked against build v26.43.4-999c51d (QA site sv10647) on 11/3/2026.</p>'
LIB = 'Click Parts in the top bar, then Part Library in the left menu, click Search and type '
NEW = {
 154778: ('Use two entries from before this release: ' + LIB + '615144. Two rows show, RF axle nut and LF axle nut, both with Part Number 615144: use 615144 as number 1. '
          'Then on the Inventory page click Search and type 615144 to check that no part there has that number.'),
 154831: ('Use two entries from before this release: ' + LIB + '21-361 and click the Reverse Switch row: its Part details panel shows Total parts 0 (entry A). '
          'For entry B use 3030 Long Stroke Brake Chamber (W3030LS), which a part uses.'),
 573683: ('Use an entry from before this release: ' + LIB + 'TK52-67-5Y0H and click the BCM Rear row: its Part details panel shows an empty Manufacturer and '
          'Total parts 0. Use TK52-67-5Y0H as number 1.'),
 839426: ('Use an entry from before this release: ' + LIB + '68157291AA. The Fuel filter row shows no Category: use 68157291AA as number 1.'),
 425658: ('Use date A = 20 October 2026: click Reports in the top bar, then Inventory Value under PARTS, click As of: and pick 20 October 2026, click Search '
          'and type W3030T. Write down its Qty and Total Cost.'),
}
PARTLY_TO_FULL = {154778, 573683, 839426}
OUTS = {
 425625: 'it needs a screenshot of a role&#39;s permissions taken before this release, which cannot exist on this site, and no custom role from before the release is on it',
 425626: 'no role and no part from before this release on this site has the word Catalog in its name, and such records cannot be made now',
 540879: 'it needs a part from before this release that has held 5 in one bin and -2 in another at $10.00, which is not on this site and cannot be made now',
}
write = '--write' in sys.argv
for c, txt in NEW.items():
    cur = L.call(f'get_case/{c}'); assert cur['created_by'] == 3 and cur['updated_by'] == 3 and cur['custom_atmstatus'] != 3, c
    p = cur['custom_preconds']; m = re.search(r'<p><strong>Setup</strong></p><ol>(.*)</ol>$', p, re.S); assert m, c
    its = re.findall(r'<li>(.*?)</li>', m.group(1))
    IDX = {154778: [0], 154831: [0, 1], 573683: [0], 839426: [0], 425658: [1, 2]}
    hit = [its[i] for i in IDX[c]]
    assert hit, (c, [html.unescape(x)[:80] for x in its])
    first = True
    for x in hit:
        p = p.replace(f'<li>{x}</li>', f'<li>{E(txt)}</li>' if first else '', 1); first = False
    d = {'custom_preconds': p}
    if c in PARTLY_TO_FULL:
        e = cur['custom_expected']; mm = re.findall(r'<p>Partly checked against build v26\.43\.4-999c51d[^<]*</p>', e); assert len(mm) == 1, c
        d['custom_expected'] = e.replace(mm[0], FULL)
    if not write: print(c, 'replaces', len(hit), 'item(s):', [html.unescape(x)[:70] for x in hit]); continue
    r = L.call(f'update_case/{c}', d); time.sleep(0.6); ok = all(r[f] == v for f, v in d.items())
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{c} (runnable: record named in Setup{'; build line full' if c in PARTLY_TO_FULL else ''}) fields={sorted(d)} verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n')
origin = {}
for c, why in OUTS.items():
    cur = L.call(f'get_case/{c}'); assert cur['created_by'] == 3 and cur['updated_by'] == 3 and cur['custom_atmstatus'] != 3, c; origin[c] = cur['section_id']
    e = cur['custom_expected']; mk = re.findall(r'<p>AUTOMATION:[^<]*</p>', e); assert len(mk) == 1, c
    newmk = f'<p>AUTOMATION: HOLD - not manually testable on the QA site: {why}</p>'
    if not write: print(c, 'from section', cur['section_id'], '->', newmk[3:110]); continue
    r = L.call(f'update_case/{c}', {'custom_expected': e.replace(mk[0], newmk)}); ok = r['custom_expected'] == e.replace(mk[0], newmk); time.sleep(0.6)
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{c} (marker HOLD: not manually testable) fields=['custom_expected'] verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n')
if write:
    json.dump({'moved_on': '2026-11-03', 'origin_section': origin}, open(f'{D}/moved-out-origin.json', 'w'), indent=1)
    sec = L.call('add_section/1', {'suite_id': 1, 'parent_id': 20434, 'name': 'Parts Lifecycle – not runnable by a manual tester',
        'description': 'Moved out of Part Lifecycle (group 20439) on 3 Nov 2026 on the QA lead\'s instruction: "any test which is not runnable/executable should not be the part of this testing suite". Each test\'s marker gives the reason; original sections in build/founder-mode-parts-lifecycle/build-verify-sv10647-2026-11-03/runnable-pass/moved-out-origin.json.'})
    print('section', sec['id'], sec['name'])
    try: L.call(f"move_cases_to_section/{sec['id']}", {'suite_id': 1, 'case_ids': list(OUTS)})
    except Exception as ex: print('move call:', ex)
    time.sleep(3); back = {c: L.call(f'get_case/{c}')['section_id'] for c in OUTS}
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} add_section S{sec['id']} under S20434; move_cases_to_section {list(OUTS)}; read back {sum(1 for v in back.values() if v == sec['id'])}/3 in S{sec['id']}"
    print(line); log.write(line + '\n')
